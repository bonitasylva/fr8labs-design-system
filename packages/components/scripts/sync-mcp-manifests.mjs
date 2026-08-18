import {mkdir, readFile, writeFile} from 'node:fs/promises';

const packageRoot = new URL('../', import.meta.url);
const sourceRoot = new URL('../storybook-static/manifests/', import.meta.url);
const outputRoot = new URL('../manifests/', import.meta.url);
const approved = (source) => /fds\s*:\s*\{(?=[^}]*approved\s*:\s*true)(?=[^}]*status\s*:\s*['"]approved['"])[^}]*\}/s.test(source);
const cleanPath = (value) => value.replaceAll('\\', '/').replace(/^.*\/packages\/components\//, './');

function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitize(item)]));
  return typeof value === 'string' && (/^\//.test(value) || /^[A-Z]:\\/.test(value)) ? cleanPath(value) : value;
}

const components = JSON.parse(await readFile(new URL('components.json', sourceRoot), 'utf8'));
const publicComponents = [];
for (const [id, entry] of Object.entries(components.components)) {
  if (id.startsWith('internal-')) continue;
  if (entry.error?.name === 'No component found' && /^(foundations-|patterns-)/.test(id)) delete entry.error;
  if (id.startsWith('foundations-')) {
    publicComponents.push([id, entry]);
    continue;
  }
  const source = await readFile(new URL(entry.path.replace(/^\.\//, ''), packageRoot), 'utf8');
  if (approved(source)) publicComponents.push([id, entry]);
}
components.components = Object.fromEntries(publicComponents);

const docs = JSON.parse(await readFile(new URL('docs.json', sourceRoot), 'utf8'));
docs.docs = Object.fromEntries(Object.entries(docs.docs).filter(([, entry]) => /^(Getting Started|Foundations)\//.test(entry.title)));

await mkdir(outputRoot, {recursive: true});
for (const [file, manifest] of [['components.json', components], ['docs.json', docs]]) {
  const contents = `${JSON.stringify(sanitize(manifest), null, 2)}\n`;
  if (/\/Users\/|[A-Z]:\\/.test(contents)) throw new Error(`${file} contains an absolute workstation path.`);
  await Promise.all([writeFile(new URL(file, sourceRoot), contents), writeFile(new URL(file, outputRoot), contents)]);
}
