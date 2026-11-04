import assert from 'node:assert/strict';
import { pathToView, viewToPath, pageKey } from '../src/lib/routes.ts';
import { readFileSync } from 'node:fs';
for (const id of ['592g71352y693w43', 'synthetic-one', 'A_1']) {
  const view = { name: 'communityCourse' as const, id };
  assert.deepEqual(pathToView(`/community/${id}`, '', [], []), view);
  assert.equal(viewToPath(view, [], () => undefined), `/community/${id}`);
  assert.equal(pageKey(view), `community:${id}`);
}
assert.deepEqual(pathToView('/community', '', [], []), { name: 'community' });
for (const path of ['/community/%2Fescape', '/community/%ZZ', '/community/a/extra', '/community/'+ 'a'.repeat(101)]) assert.equal(pathToView(path, '', [], []), null);
const site=readFileSync(new URL('../src/Site.tsx',import.meta.url),'utf8');
assert.ok(site.includes('href="/community" onClick={(e) => go(e, "community")}'));
assert.ok(site.includes('>Community</a>'));
assert.match(site, /<PublicCommunity/);
assert.doesNotMatch(site, /<CreateHome|<CommunityEditor|community\.me\(/);
const routes=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
assert.ok(routes.includes('onStart={family ? undefined : (id) => addCommunityCourse(id, true)}'));
console.log('Public community exact-ID routes, public nav and family read-only boundaries passed.');
