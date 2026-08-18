import {readFile, writeFile} from 'node:fs/promises';

const file = new URL('../dist/styles.css', import.meta.url);
const css = await readFile(file, 'utf8');

const scoped = transform(css
  .replaceAll(':root', '.fds-root')
  .replaceAll(':where(html)', '.fds-root')
  .replaceAll(':where(html[data-theme=light])', '.fds-root[data-theme=light]')
  .replaceAll(':where(html[data-theme=dark])', '.fds-root[data-theme=dark]')
  .replaceAll(':where(html:not([data-theme]))', '.fds-root:not([data-theme])')
  .replaceAll(':where(body)', '.fds-root'));

await writeFile(file, scoped);

function transform(source) {
  let output = '';
  let cursor = 0;

  while (cursor < source.length) {
    const open = source.indexOf('{', cursor);
    if (open === -1) return output + source.slice(cursor);
    const close = matchingBrace(source, open);
    const header = source.slice(cursor, open);
    const body = source.slice(open + 1, close);
    const trimmed = header.trim();

    if (trimmed.startsWith('@keyframes') || trimmed.startsWith('@property') || trimmed.startsWith('@font-face')) {
      output += `${header}{${body}}`;
    } else if (trimmed.startsWith('@')) {
      output += `${header}{${transform(body)}}`;
    } else {
      output += `${scopeSelectors(header)}{${body}}`;
    }
    cursor = close + 1;
  }
  return output;
}

function matchingBrace(source, open) {
  let depth = 1;
  for (let index = open + 1; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}' && --depth === 0) return index;
  }
  throw new Error('Unbalanced CSS in dist/styles.css');
}

function scopeSelectors(header) {
  return splitSelectors(header).map((selector) => {
    const trimmed = selector.trim();
    return trimmed.startsWith('.fds-root') ? trimmed : `.fds-root ${trimmed}`;
  }).join(',');
}

function splitSelectors(header) {
  const selectors = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < header.length; index += 1) {
    if (header[index] === '(' || header[index] === '[') depth += 1;
    if (header[index] === ')' || header[index] === ']') depth -= 1;
    if (header[index] === ',' && depth === 0) {
      selectors.push(header.slice(start, index));
      start = index + 1;
    }
  }
  selectors.push(header.slice(start));
  return selectors;
}
