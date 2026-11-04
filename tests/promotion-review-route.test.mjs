import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const main = readFileSync('src/main.tsx', 'utf8');
test('promotion review uses a separate web-only admin entry', () => {
  assert.match(main, /const promotionRoute = !IS_SITE && !inApp/);
  assert(main.includes('/^\\/admin\\/promotions\\/?$/'));
  assert.match(main, /promotionRoute \? import\("\.\/pages\/AdminPromotions"\)/);
  assert(readFileSync('src/Site.tsx', 'utf8').includes('appUrl("/admin/promotions")'));
});
test('promotion does not add credentialed trust origins or release credentials', () => {
  const config = readFileSync('worker/wrangler.toml', 'utf8').split('[env.dev]')[0];
  assert.match(config, /APP_ORIGIN = "https:\/\/app\.erudior\.com"/);
  assert.match(config, /ALLOWED_ORIGINS = ""/);
  assert(!config.includes('COURSE_SIGNING_KEY'));
  assert(!config.includes('GITHUB_TOKEN'));
});
