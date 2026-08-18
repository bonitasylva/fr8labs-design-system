import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import test from 'node:test';

const exec = promisify(execFile);

test('npm artifact contains only the testing consumer surface', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const {stdout} = await exec('npm', ['pack', '--dry-run', '--json'], {cwd: new URL('../', import.meta.url)});
  const files = JSON.parse(stdout)[0].files.map(({path}) => path);

  assert.equal(packageJson.license, 'Apache-2.0');
  assert.equal(packageJson.publishConfig.tag, 'testing');
  assert.match(readme, /npm install sandbox-fds-components@testing sandbox-fds-icons@testing sandbox-fds-tokens@testing/);
  assert.doesNotMatch(readme, /\.tgz|tarball dependency|npm run storybook/);
  assert.ok(files.includes('dist/index.js'));
  assert.ok(files.includes('dist/styles.css'));
  assert.equal(files.includes('dist/fds-catalog.json'), false);
});
