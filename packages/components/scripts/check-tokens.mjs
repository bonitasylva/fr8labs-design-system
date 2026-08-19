import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

const sourceRoot = new URL('../src/', import.meta.url);
const tokenSource = await readFile(new URL('../../tokens/tokens.css', import.meta.url), 'utf8');
const tokenDocs = await readFile(new URL('../src/stories/TokenFoundation.stories.tsx', import.meta.url), 'utf8');
const breakpoints = JSON.parse(await readFile(new URL('../../tokens/breakpoints.json', import.meta.url), 'utf8'));
const cssFiles = await findCss(sourceRoot);
const componentCss = (await Promise.all(cssFiles.filter((file) => !file.endsWith('tokens.css')).map((file) => readFile(file, 'utf8')))).join('\n');
const definitions = new Map([...tokenSource.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
const references = new Set([...(tokenSource + componentCss).matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));
const missing = [...references].filter((name) => !definitions.has(name));

assert(missing.length === 0, `Undefined tokens: ${missing.join(', ')}`);
assert(!/(#[\da-f]{3,8}|rgb\()/i.test(componentCss), 'Raw colors found outside tokens.css');

for (const section of ['Semantics:', 'Component tokens:']) {
  const body = tokenSource.split(`/* ${section}`)[1]?.split('/* ')[0] ?? '';
  const raw = [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].filter((match) => !match[2].trim().startsWith('var('));
  assert(raw.length === 0, `${section} must contain aliases only: ${raw.map((match) => match[1]).join(', ')}`);
}

const componentTokenBody = tokenSource.split('/* Component tokens:')[1]?.split('/* ')[0] ?? '';
const componentPrimitiveReferences = [...componentTokenBody.matchAll(/(--[\w-]+)\s*:\s*var\((--fds-primitive-[\w-]+)\)/g)];
assert(componentPrimitiveReferences.length === 0, `Component tokens must reference semantic tokens: ${componentPrimitiveReferences.map(([, name]) => name).join(', ')}`);

for (const name of [
  '--fds-primitive-color-primary-border',
  '--fds-primitive-color-status-success-border',
  '--fds-primitive-color-status-warning-border',
  '--fds-primitive-color-status-danger-border',
  '--fds-primitive-color-icon-default',
  '--fds-primitive-color-icon-disabled',
  '--fds-primitive-color-icon-hover',
  '--fds-primitive-color-action-hover',
  '--fds-primitive-color-overlay',
  '--fds-primitive-size-30',
  '--fds-primitive-size-48',
]) assert(!definitions.has(name), `Legacy or unused primitive token remains: ${name}`);

for (const section of ['Primitives: raw values live only in this section.', 'Semantics: components consume roles, never primitives directly.']) {
  const body = tokenSource.split(`/* ${section}`)[1]?.split('/* ')[0] ?? '';
  const undocumented = [...body.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]).filter((name) => !tokenDocs.includes(`['${name}',`));
  assert(undocumented.length === 0, `Storybook token reference is missing: ${undocumented.join(', ')}`);
}

const expected = {
  '--fds-color-brand-accent': '#008de4',
  '--fds-color-action-primary': '#0067e7',
  '--fds-color-action-primary-border': 'rgb(0 34 69 / 16%)',
  '--fds-color-action-tertiary-background': 'transparent',
  '--fds-color-action-primary-active': '#023c9b',
  '--fds-radius-control': '4px',
  '--fds-font-size-page-title': '20px',
  '--fds-line-height-page-title': '28px',
  '--fds-font-size-body': '14px',
  '--fds-line-height-body': '20px',
  '--fds-font-size-data': '13px',
  '--fds-line-height-data': '18px',
  '--fds-font-size-label': '12px',
  '--fds-line-height-label': '16px',
  '--fds-button-height-small': '28px',
  '--fds-button-height-medium': '32px',
  '--fds-button-height-large': '40px',
  '--fds-table-row-height': '32px',
  '--fds-table-header-height': '36px',
  '--fds-size-container-form': '48rem',
  '--fds-size-container-reading': '72ch',
  '--fds-size-container-page': '80rem',
};

for (const [name, value] of Object.entries(expected)) assert(resolve(name) === value, `${name} must resolve to ${value}`);

assert(JSON.stringify(breakpoints) === JSON.stringify({
  base: {value: '0rem', pixels: 0},
  small: {value: '40rem', pixels: 640},
  medium: {value: '48rem', pixels: 768},
  large: {value: '64rem', pixels: 1024},
  wide: {value: '80rem', pixels: 1280},
}), 'Breakpoint scale changed without updating its contract check');

for (const [foreground, background, minimum] of [
  ['--fds-color-text-default', '--fds-color-surface-default', 4.5],
  ['--fds-color-text-muted', '--fds-color-surface-default', 4.5],
  ['--fds-color-action-primary', '--fds-color-text-inverse', 4.5],
  ['--fds-color-action-primary-active', '--fds-color-text-inverse', 4.5],
  ['--fds-button-secondary-foreground', '--fds-button-secondary-background', 4.5],
  ['--fds-button-tertiary-foreground', '--fds-color-surface-default', 4.5],
  ['--fds-button-danger-foreground', '--fds-button-danger-background', 4.5],
  ['--fds-button-danger-foreground', '--fds-button-danger-background-hover', 4.5],
  ['--fds-color-field-border', '--fds-color-field-background', 3],
  ['--fds-color-feedback-info-content-text', '--fds-color-feedback-info-surface', 4.5],
  ['--fds-color-feedback-info-text', '--fds-color-feedback-info-surface', 4.5],
  ['--fds-color-feedback-success-content-text', '--fds-color-feedback-success-surface', 4.5],
  ['--fds-color-feedback-success-text', '--fds-color-feedback-success-surface', 4.5],
  ['--fds-color-feedback-warning-content-text', '--fds-color-feedback-warning-surface', 4.5],
  ['--fds-color-feedback-warning-text', '--fds-color-feedback-warning-surface', 4.5],
  ['--fds-color-feedback-error-content-text', '--fds-color-feedback-error-surface', 4.5],
  ['--fds-color-feedback-error-text', '--fds-color-feedback-error-surface', 4.5],
  ['--fds-color-status-neutral-text', '--fds-color-status-neutral-surface', 4.5],
  ['--fds-color-status-success-text', '--fds-color-status-success-surface', 4.5],
  ['--fds-color-status-warning-text', '--fds-color-status-warning-surface', 4.5],
  ['--fds-color-status-danger-text', '--fds-color-status-danger-surface', 4.5],
  ['--fds-color-status-success-border', '--fds-color-status-success-surface', 3],
  ['--fds-color-status-warning-border', '--fds-color-status-warning-surface', 3],
  ['--fds-color-status-danger-border', '--fds-color-status-danger-surface', 3],
]) assert(contrast(resolve(foreground), resolve(background)) >= minimum, `${foreground} fails ${minimum}:1 on ${background}`);

console.log(`Validated ${definitions.size} tokens across ${cssFiles.length} CSS files.`);

function resolve(name, seen = new Set()) {
  assert(!seen.has(name), `Circular token alias: ${[...seen, name].join(' -> ')}`);
  const value = definitions.get(name);
  assert(value, `Missing token: ${name}`);
  const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return alias ? resolve(alias, new Set([...seen, name])) : value.toLowerCase();
}

function contrast(a, b) {
  const values = [a, b].map((hex) => {
    const channels = hex.match(/[\da-f]{2}/gi)?.map((value) => parseInt(value, 16) / 255);
    assert(channels?.length === 3, `Contrast check requires a hex color, received ${hex}`);
    return channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
      .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  }).sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

async function findCss(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = await Promise.all(entries.map((entry) => entry.isDirectory() ? findCss(new URL(`${entry.name}/`, directory)) : [join(directory.pathname, entry.name)]));
  return files.flat().filter((file) => file.endsWith('.css'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
