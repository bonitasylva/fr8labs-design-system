import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

const sourceRoot = new URL('../src/', import.meta.url);
const tokenSource = await readFile(new URL('../../tokens/tokens.css', import.meta.url), 'utf8');
const tokenDocs = await readFile(new URL('../src/stories/TokenFoundation.stories.tsx', import.meta.url), 'utf8');
const breakpoints = JSON.parse(await readFile(new URL('../../tokens/breakpoints.json', import.meta.url), 'utf8'));
const themeContract = JSON.parse(await readFile(new URL('../../tokens/theme-contract.json', import.meta.url), 'utf8'));
const cssFiles = await findCss(sourceRoot);
const componentCss = (await Promise.all(cssFiles.filter((file) => !file.endsWith('tokens.css')).map((file) => readFile(file, 'utf8')))).join('\n');
const definitions = new Map([...tokenSource.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
const references = new Set([...(tokenSource + componentCss).matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));
const missing = [...references].filter((name) => !definitions.has(name));

assert(missing.length === 0, `Undefined tokens: ${missing.join(', ')}`);
assert(!/(#[\da-f]{3,8}|rgb\()/i.test(componentCss), 'Raw colors found outside tokens.css');

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
  '--fds-primitive-space-1',
  '--fds-primitive-space-2',
  '--fds-primitive-space-3',
  '--fds-primitive-space-4',
  '--fds-primitive-space-5',
  '--fds-primitive-size-30',
  '--fds-primitive-opacity-disabled',
  '--fds-primitive-radius-default',
  '--fds-primitive-border-width',
  '--fds-primitive-border-width-strong',
  '--fds-primitive-size-520',
  '--fds-primitive-size-540',
  '--fds-primitive-size-768',
  '--fds-primitive-size-1280',
  '--fds-primitive-measure-72',
  '--fds-primitive-focus-width',
  '--fds-primitive-focus-offset',
  '--fds-primitive-motion-duration-spinner',
  '--fds-primitive-shadow-control',
  '--fds-primitive-shadow-overlay',
]) assert(!definitions.has(name), `Retired primitive token remains: ${name}`);

for (const name of ['--fds-space-1', '--fds-space-2', '--fds-space-3', '--fds-space-5']) {
  assert(!definitions.has(name), `Retired spacing token remains: ${name}`);
}

for (const section of ['Primitives: reference values live only in this section.', 'Semantics: components consume roles, never primitives directly.', 'Component tokens: only stable, repeated component decisions.']) {
  const body = tokenSource.split(`/* ${section}`)[1]?.split('/* ')[0] ?? '';
  const undocumented = [...body.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]).filter((name) => !tokenDocs.includes(`['${name}',`));
  assert(undocumented.length === 0, `Storybook token reference is missing: ${undocumented.join(', ')}`);
}

assert(themeContract.defaultTheme === 'default', 'Theme contract must identify the shipped default theme');
assert(Array.isArray(themeContract.overrides) && themeContract.overrides.length > 0, 'Theme contract must declare its approved override roles');
for (const override of themeContract.overrides) {
  assert(/^--fds-(?!primitive-)[\w-]+$/.test(override.cssVariable), `Theme override must be semantic: ${override.cssVariable}`);
  assert(definitions.has(override.cssVariable), `Theme override does not exist: ${override.cssVariable}`);
  assert(!override.cssVariable.startsWith('--fds-button-'), `Theme override must not be a component token: ${override.cssVariable}`);
  if (override.contrast) assert(resolve(override.contrast.against) && Number.isFinite(override.contrast.minimum), `Theme override contrast is incomplete: ${override.cssVariable}`);
}

const expected = {
  '--fds-color-brand-accent': '#008de4',
  '--fds-color-action-primary': '#0067e7',
  '--fds-color-action-primary-border': 'transparent',
  '--fds-color-action-primary-hover': '#0054bd',
  '--fds-color-action-tertiary-background': 'transparent',
  '--fds-color-action-primary-active': '#023c9b',
  '--fds-button-primary-background-hover': '#0054bd',
  '--fds-radius-control': '4px',
  '--fds-primitive-radius-small': '4px',
  '--fds-primitive-border-width-thin': '1px',
  '--fds-primitive-border-width-thick': '2px',
  '--fds-primitive-outline-focus-width': '3px',
  '--fds-primitive-outline-focus-offset': '2px',
  '--fds-font-size-page-title': '20px',
  '--fds-line-height-page-title': '28px',
  '--fds-font-size-body': '14px',
  '--fds-line-height-body': '20px',
  '--fds-font-size-data': '13px',
  '--fds-line-height-data': '18px',
  '--fds-font-size-label': '12px',
  '--fds-line-height-label': '16px',
  '--fds-space-none': '0',
  '--fds-space-2xs': '4px',
  '--fds-space-xs': '8px',
  '--fds-space-sm': '12px',
  '--fds-space-md': '16px',
  '--fds-space-lg': '20px',
  '--fds-space-xl': '24px',
  '--fds-space-2xl': '28px',
  '--fds-space-3xl': '32px',
  '--fds-button-height-small': '28px',
  '--fds-button-height-medium': '32px',
  '--fds-button-height-large': '40px',
  '--fds-table-row-height': '32px',
  '--fds-table-header-height': '36px',
  '--fds-dialog-width': '520px',
  '--fds-drawer-width': '540px',
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

for (const [name, {value}] of Object.entries(breakpoints)) {
  assert(definitions.get(`--fds-primitive-breakpoint-${name}`) === value, `Breakpoint CSS token --fds-primitive-breakpoint-${name} must match breakpoints.json`);
}

for (const [foreground, background, minimum] of [
  ['--fds-color-text-default', '--fds-color-surface-default', 4.5],
  ['--fds-color-text-muted', '--fds-color-surface-default', 4.5],
  ['--fds-color-action-primary', '--fds-color-text-inverse', 4.5],
  ['--fds-color-action-primary-hover', '--fds-color-text-inverse', 4.5],
  ['--fds-color-action-primary-active', '--fds-color-text-inverse', 4.5],
  ['--fds-button-secondary-foreground', '--fds-button-secondary-background', 4.5],
  ['--fds-button-tertiary-foreground', '--fds-color-surface-default', 4.5],
  ['--fds-button-danger-foreground', '--fds-button-danger-background', 4.5],
  ['--fds-button-danger-foreground', '--fds-button-danger-background-hover', 4.5],
  ['--fds-color-field-border', '--fds-color-field-background', 3],
  ['--fds-color-field-border-error', '--fds-color-field-background', 3],
  ['--fds-color-feedback-info-content-text', '--fds-color-feedback-info-surface', 4.5],
  ['--fds-color-feedback-info-text', '--fds-color-feedback-info-surface', 4.5],
  ['--fds-color-feedback-info-icon', '--fds-color-feedback-info-surface', 3],
  ['--fds-color-feedback-success-content-text', '--fds-color-feedback-success-surface', 4.5],
  ['--fds-color-feedback-success-text', '--fds-color-feedback-success-surface', 4.5],
  ['--fds-color-feedback-success-icon', '--fds-color-feedback-success-surface', 3],
  ['--fds-color-feedback-warning-content-text', '--fds-color-feedback-warning-surface', 4.5],
  ['--fds-color-feedback-warning-text', '--fds-color-feedback-warning-surface', 4.5],
  ['--fds-color-feedback-warning-icon', '--fds-color-feedback-warning-surface', 3],
  ['--fds-color-feedback-error-content-text', '--fds-color-feedback-error-surface', 4.5],
  ['--fds-color-feedback-error-text', '--fds-color-feedback-error-surface', 4.5],
  ['--fds-color-feedback-error-icon', '--fds-color-feedback-error-surface', 3],
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
