import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
async function files(directory: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', '.wrangler'].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (['.ts', '.tsx', '.js', '.mjs', '.html'].includes(extname(path))) result.push(path);
  }
  return result;
}
for (const directory of ['src', 'worker/src', 'functions']) {
  for (const file of await files(resolve(root, directory))) {
    const source = await readFile(file, 'utf8');
    assert(!/(?:from\s*|import\s*\(|require\s*\()\s*['"][^'"]*account-service\//.test(source), `${relative(root, file)} must not import the separate private account service`);
    assert(!source.includes('/v1/ui/settings.js'), `${relative(root, file)} must not mount the private settings application`);
    assert(!source.includes('__Host-erudior-account'), `${relative(root, file)} must not use private account credentials`);
  }
}
const client = await readFile(resolve(root, 'account-service/browser/settings.js'), 'utf8');
assert(!/\b(?:localStorage|sessionStorage)\s*[.\[]/.test(client), 'private settings must not persist session projections or credentials');
assert(!/serviceWorker\s*\.\s*register/.test(client), 'private settings must not install a persistent service worker');
console.log('Private browser UI remains isolated from public application, community Worker and public functions');
