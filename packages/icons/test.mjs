import assert from 'node:assert/strict';
import test from 'node:test';
import {Icon} from './index.js';

test('icons are decorative by default and labelled on request', () => {
  assert.equal(Icon({name: 'download'}).props['aria-hidden'], true);
  assert.deepEqual(Icon({name: 'download', label: 'Download', size: 16}).props, {
    className: 'material-symbols-sharp fds-icon fds-icon--16',
    'aria-hidden': undefined,
    'aria-label': 'Download',
    role: 'img',
    children: 'download',
  });
});
