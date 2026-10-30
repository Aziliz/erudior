// Public Community discovery must be compiled into the Android preview. This
// check neither enables private accounts nor contacts the production API.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ANDROID_COMMUNITY_ORIGIN = 'https://api.erudior.com';

export function validateAndroidCommunityEnvironment(value, csp) {
  const input = typeof value === 'string' ? value.trim() : '';
  let url;
  try { url = new URL(input); } catch { throw Error('Android release requires VITE_COMMUNITY_API.'); }
  if (url.origin !== ANDROID_COMMUNITY_ORIGIN || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw Error('Android release Community API must be the approved HTTPS origin.');
  }
  const connect = typeof csp === 'string'
    ? csp.split(';').map(part => part.trim().split(/\s+/)).find(parts => parts[0] === 'connect-src')
    : undefined;
  if (!connect?.slice(1).includes(url.origin)) {
    throw Error('Android CSP does not explicitly permit the Community API.');
  }
  return url.origin;
}

export async function verifyCompiledCommunityOrigin(dist, origin) {
  if (origin !== ANDROID_COMMUNITY_ORIGIN) throw Error('Unapproved Community origin.');
  const assets = path.join(dist, 'assets');
  const names = (await readdir(assets)).filter(name => name.endsWith('.js'));
  if (!names.length) throw Error('No compiled JavaScript assets found.');
  const matched = [];
  for (const name of names) {
    const source = await readFile(path.join(assets, name), 'utf8');
    if (source.includes(JSON.stringify(origin)) || source.includes("'" + origin + "'")) matched.push(name);
  }
  if (!matched.length) throw Error('Community API origin is missing from the compiled Android frontend.');
  return { origin, assets: matched, scope: 'configuration and compiled-origin presence; not device/network acceptance' };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--dist')) {
    throw Error('Usage: node scripts/check-android-community-env.mjs [--dist DIRECTORY]');
  }
  const config = JSON.parse(await readFile('src-tauri/tauri.conf.json', 'utf8'));
  const origin = validateAndroidCommunityEnvironment(process.env.VITE_COMMUNITY_API, config.app?.security?.csp);
  console.log(JSON.stringify(args.length ? await verifyCompiledCommunityOrigin(args[1], origin) : { origin, preflight: true }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
