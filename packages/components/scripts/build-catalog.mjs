import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(packageRoot, '../..');
const tokenPackageRoot = resolve(repositoryRoot, 'packages/tokens');
const sourcePath = resolve(packageRoot, 'src/catalog/fds-catalog.json');
const outputPath = resolve(packageRoot, 'dist/fds-catalog.json');
const catalog = JSON.parse(await readFile(sourcePath, 'utf8'));
const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));
const tokenPackageJson = JSON.parse(await readFile(resolve(tokenPackageRoot, 'package.json'), 'utf8'));
const storybookManifest = JSON.parse(await readFile(resolve(packageRoot, 'manifests/components.json'), 'utf8'));
const publicIndex = await readFile(resolve(packageRoot, 'src/index.ts'), 'utf8');
const ids = new Set();

const slug = (value) => value.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const storyTitle = (source) => source.match(/\btitle\s*:\s*['"]([^'"]+)/)?.[1];
const storySummary = (source, fallback) => source.match(/description\s*:\s*\{\s*component\s*:\s*['"]([^'"]+)/)?.[1] ?? fallback;
const explicitlyApproved = (source) => /fds\s*:\s*\{(?=[^}]*approved\s*:\s*true)(?=[^}]*status\s*:\s*['"]approved['"])[^}]*\}/s.test(source);

for (const entry of Object.values(storybookManifest.components)) {
  if (!entry.id.startsWith('components-') && !entry.id.startsWith('patterns-operations-')) continue;
  const storyPath = resolve(packageRoot, entry.path.replace(/^\.\//, ''));
  const storySource = await readFile(storyPath, 'utf8');
  if (!explicitlyApproved(storySource)) continue;

  const title = storyTitle(storySource);
  if (!title) throw new Error(`${entry.path} has no Storybook title.`);

  if (entry.id.startsWith('components-')) {
    const exportName = entry.reactDocgen?.exportName;
    const componentPath = entry.reactDocgen?.definedInFile;
    if (!exportName || !componentPath || !publicIndex.includes(`export {${exportName}}`)) throw new Error(`${entry.id} is approved but missing its public export or component source.`);
    const id = `component.${slug(exportName)}`;
    if (catalog.items.some((item) => item.id === id)) continue;
    const props = Object.fromEntries(Object.entries(entry.reactDocgen.props ?? {}).map(([name, prop]) => [name, prop.tsType?.raw ?? prop.tsType?.name ?? 'unknown']));
    catalog.items.push({
      id,
      kind: 'component',
      status: 'approved',
      fdsVersion: catalog.currentApprovedVersion,
      title: exportName,
      summary: storySummary(storySource, `Approved ${exportName} component documented in Storybook.`),
      dependencies: [`sandbox-fds-components@${packageJson.version}`, 'react>=19.0.0'],
      accessibility: ['Preserve the documented accessible names, keyboard behavior, focus handling, and visible states.'],
      source: {path: relative(repositoryRoot, componentPath), storybookTitle: title, storybookId: entry.stories[0]?.id},
      updatedAt: '2026-08-17',
      api: {import: `import {${exportName}} from 'sandbox-fds-components';`, props},
      states: entry.stories.map((story) => story.name),
    });
    continue;
  }

  const id = `template.${entry.id.replace('patterns-operations-', '')}`;
  if (catalog.items.some((item) => item.id === id)) continue;
  const importedNames = storySource.match(/import \{([^}]+)\} from ['"]\.\.\/index['"];/)?.[1].split(',').map((name) => name.trim().replace(/^type\s+/, '')).filter(Boolean) ?? [];
  const allowedComponentIds = importedNames.map((name) => `component.${slug(name)}`).filter((componentId) => catalog.items.some((item) => item.id === componentId));
  catalog.items.push({
    id,
    kind: 'template',
    status: 'approved',
    fdsVersion: catalog.currentApprovedVersion,
    title: title.split('/').at(-1),
    summary: storySummary(storySource, `Approved ${title.split('/').at(-1)} fake-data workflow.`),
    dependencies: [`sandbox-fds-components@${packageJson.version}`, 'react>=19.0.0'],
    accessibility: ['Preserve the documented reading order, labels, keyboard path, and explicit empty or error states.'],
    source: {path: relative(repositoryRoot, storyPath), storybookTitle: title, storybookId: entry.stories[0]?.id},
    updatedAt: '2026-08-17',
    states: entry.stories.map((story) => story.name),
    slots: importedNames,
    allowedComponentIds,
    fakeFixtureSchema: {policy: 'Synthetic freight data only.'},
  });
}

const tokenSource = await readFile(resolve(tokenPackageRoot, 'tokens.css'), 'utf8');
const rootBody = tokenSource.match(/\.fds-root\s*\{([\s\S]*)\}\s*$/)?.[1];
if (!rootBody) throw new Error('Could not find .fds-root token definitions.');

let layer;
const definitions = [];
for (const line of rootBody.split('\n')) {
  if (line.includes('/* Primitives:')) layer = 'primitive';
  if (line.includes('/* Semantics:')) layer = 'semantic';
  if (line.includes('/* Component tokens:')) layer = 'component';
  if (line.includes('/* Compatibility aliases')) layer = 'compatibility';
  const match = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);/);
  if (match) definitions.push({cssVariable: match[1], sourceValue: match[2].trim(), layer});
}

const values = new Map(definitions.map((token) => [token.cssVariable, token.sourceValue]));
const referencedBy = new Map(definitions.map((token) => [token.cssVariable, []]));
for (const token of definitions) {
  const alias = token.sourceValue.match(/^var\((--[\w-]+)\)$/)?.[1];
  if (alias && referencedBy.has(alias)) referencedBy.get(alias).push(token.cssVariable);
}

function resolveValue(cssVariable, seen = new Set()) {
  if (seen.has(cssVariable)) throw new Error(`Circular token alias: ${[...seen, cssVariable].join(' -> ')}`);
  const value = values.get(cssVariable);
  if (!value) throw new Error(`Missing token: ${cssVariable}`);
  const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return alias ? resolveValue(alias, new Set([...seen, cssVariable])) : value;
}

function tokenPath({cssVariable, layer: tokenLayer}) {
  const name = tokenLayer === 'primitive' ? cssVariable.replace('--fds-primitive-', '') : cssVariable.replace(/^--fds-/, '').replace(/^--/, '');
  const path = name.replaceAll('-', '.');
  return tokenLayer === 'primitive' ? path : `${tokenLayer === 'compatibility' ? 'compat' : tokenLayer}.${path}`;
}

const usage = {
  primitive: 'Reference value only; product and component CSS should prefer an approved semantic or component token.',
  semantic: 'Approved purpose-based token for product and component CSS.',
  component: 'Approved stable component decision; use it only for the named FDS component contract.',
  compatibility: 'Compatibility alias only; new work should use the canonical token named in sourceValue.',
};

const tokens = definitions.map((token) => {
  const path = tokenPath(token);
  const shorthand = token.cssVariable.replace(/^--fds-(primitive-)?/, '').replace(/^--/, '').replaceAll('-', '.');
  const aliases = shorthand === path ? [] : [shorthand];
  const consumers = referencedBy.get(token.cssVariable);
  return {
    id: `token.${path}`,
    kind: 'token',
    status: 'approved',
    fdsVersion: catalog.currentApprovedVersion,
    title: token.cssVariable,
    summary: `Approved FDS ${token.layer} token. Source value: ${token.sourceValue}.${aliases.length ? ` Shorthand: ${aliases.join(', ')}.` : ''}`,
    dependencies: [`sandbox-fds-tokens@${tokenPackageJson.version}/tokens.css`],
    accessibility: ['Preserve the approved token mapping and validate contrast or interaction meaning in its consuming component.'],
    source: {path: 'packages/tokens/tokens.css', storybookTitle: 'Foundations/Tokens', storybookId: token.layer === 'primitive' ? 'foundations-tokens--primitives' : 'foundations-tokens--semantics'},
    updatedAt: '2026-08-16',
    tokenPath: path,
    aliases,
    layer: token.layer,
    dtcgValue: token.sourceValue,
    sourceValue: token.sourceValue,
    resolvedValue: resolveValue(token.cssVariable),
    cssVariable: token.cssVariable,
    aliasUsedBy: consumers,
    referencedBy: consumers,
    permittedUsage: usage[token.layer],
  };
});

if (tokens.length !== 223) throw new Error(`Expected 223 tokens, generated ${tokens.length}.`);
catalog.items = [...catalog.items.filter((item) => item.kind !== 'token'), ...tokens];

if (catalog.currentApprovedVersion !== packageJson.version) throw new Error(`Catalog version ${catalog.currentApprovedVersion} does not match sandbox-fds-components ${packageJson.version}.`);

for (const item of catalog.items) {
  for (const field of ['id', 'kind', 'status', 'fdsVersion', 'title', 'summary', 'dependencies', 'accessibility', 'source', 'updatedAt']) {
    if (item[field] === undefined) throw new Error(`${item.id ?? 'Catalog item'} is missing ${field}.`);
  }
  if (ids.has(item.id)) throw new Error(`Duplicate catalog ID: ${item.id}.`);
  if (item.fdsVersion !== packageJson.version) throw new Error(`${item.id} uses ${item.fdsVersion}; expected ${packageJson.version}.`);
  ids.add(item.id);
  await readFile(resolve(repositoryRoot, item.source.path));
  if (item.status === 'approved' && ['component', 'template'].includes(item.kind)) item.codeSnapshot = await readFile(resolve(repositoryRoot, item.source.path), 'utf8');
  if (item.status === 'approved' && item.kind === 'prompt') item.prompt = await readFile(resolve(repositoryRoot, item.source.path), 'utf8');
  if (item.status !== 'approved') {
    delete item.codeSnapshot;
    delete item.prompt;
  }
}

await mkdir(dirname(outputPath), {recursive: true});
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Built ${outputPath} (${catalog.items.length} records).`);
