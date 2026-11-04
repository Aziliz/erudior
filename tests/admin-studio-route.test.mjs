import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const main=readFileSync('src/main.tsx','utf8'),site=readFileSync('src/Site.tsx','utf8');
test('Studio mounts only on the web application surface, with a separate lazy entry',()=>{
  assert.match(main,/const studioRoute = !IS_SITE && !inApp/);
  assert(main.includes('/^\\/admin\\/studio\\/?$/'));
  assert.match(main,/studioRoute \? import\("\.\/pages\/AdminStudio"\)/);
  assert(site.includes('appUrl("/admin/studio")'));
});
test('Studio does not expand credentialed origins',()=>{
  const wrangler=readFileSync('worker/wrangler.toml','utf8').split('[env.dev]')[0];
  assert.match(wrangler,/APP_ORIGIN = "https:\/\/app\.erudior\.com"/);
  assert.match(wrangler,/ALLOWED_ORIGINS = ""/);
});
