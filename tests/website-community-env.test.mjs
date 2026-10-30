import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { validateWebsiteCommunityOrigin } from '../scripts/check-website-community-env.mjs';

test('public API build configuration requires an explicit safe HTTPS origin', () => {
  assert.equal(validateWebsiteCommunityOrigin('https://api.erudior.com'), 'https://api.erudior.com');
  assert.equal(validateWebsiteCommunityOrigin(' https://api.synthetic.test/ '), 'https://api.synthetic.test');
  for (const value of [undefined, '', ' ', '/catalog', 'http://api.synthetic.test', 'https://user:password@api.synthetic.test', 'https://api.synthetic.test/path', 'https://api.synthetic.test?token=value', 'https://api.synthetic.test#fragment', 'javascript:alert(1)', 'https://localhost']) {
    assert.throws(() => validateWebsiteCommunityOrigin(value), /Website build requires/);
  }
});

test('website compiles the public service origin before deployment and checks real served assets', () => {
  const workflow = readFileSync(new URL('../.github/workflows/site.yml', import.meta.url), 'utf8');
  const job = workflow.slice(workflow.indexOf('  website:'));
  const steps = job.indexOf('    steps:');
  assert(steps > 0);
  assert(job.slice(0, steps).includes("VITE_COMMUNITY_API: ${{ vars.COMMUNITY_API || 'https://api.erudior.com' }}"), 'API origin must exist for build, not only the later upload step');
  assert(workflow.indexOf('node scripts/check-website-community-env.mjs') < workflow.indexOf('website-build -- npm run build'));
  assert(workflow.includes('node scripts/prerender-browser.mjs'));
});
