import assert from 'node:assert/strict';
import { pathToView, viewToPath, pageKey } from '../src/lib/routes';
assert.deepEqual(pathToView('/workspace', '', [], []), { name: 'workspace' });
assert.equal(viewToPath({ name: 'workspace' }, [], () => undefined), '/workspace');
assert.equal(pageKey({ name: 'workspace' }), 'workspace:');
assert.equal(pathToView('/workspace/unexpected', '', [], []), null);
assert.deepEqual(pathToView('/progress', '', [], []), { name: 'progress' });
console.log('Student workspace route is additive; Courses route remains unchanged.');
