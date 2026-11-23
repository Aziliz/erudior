/** CSS layout tests, not native installation or family authorization tests.
 * Uses repository styles and a fixed fixture matching App/ParentArea markup.
 * Run: node scripts/android-shell-browser.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
// No external fonts or network requests are needed to prove layout bounds.
const base = (read('src/styles.css') + '\n' + read('src/androidUpdateLayout.css'))
  .replace(/^@import[^;]+;/gm, '');
const polish = read('src/androidApp.css');
const fixture = read('tests/fixtures/android-shell.html');
const entry = read('src/main.tsx');
assert(entry.includes('import "./androidApp.css"'), 'Phone styles must be included in the application entry');
const evidence = path.join(root, 'android-shell-evidence');
mkdirSync(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true });
let checks = 0;
try {
  for (const width of [320, 360, 390, 412, 760, 800, 1024]) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await page.route('**/*', route => route.abort());
      await page.setContent(fixture);
      await page.addStyleTag({ content: base });
      await page.addStyleTag({ content: polish });
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      const phone = width <= 760;
      assert.equal(await page.locator('.android-bottom-nav').isVisible(), phone, 'Phone nav must not duplicate wide-screen nav');
      if (phone) {
        assert(await page.locator('.family-nav').isVisible(), 'Student switching and parent access must remain visible');
        for (const selector of ['.family-nav .btn', '.display-menu > button', '.android-bottom-nav button']) {
          for (const box of await page.locator(selector).evaluateAll(nodes => nodes.map(n => {const r=n.getBoundingClientRect();return {width:r.width,height:r.height};}))) {
            assert(box.width >= 48 && box.height >= 48, `${selector}: undersized touch target at ${width}px`);
          }
        }
        await page.getByRole('button', { name: 'Display', exact: true }).click();
        const panel = await page.locator('#display-panel').boundingBox();
        assert(panel && panel.x >= 0 && panel.x + panel.width <= width + 1, 'Display settings overflow');
        await page.getByRole('button', { name: 'Done', exact: true }).click();
        for (const name of ['Attendance and hours', 'Courses', 'Grades', 'Reports', 'Students', 'Learning games', 'Interactive presentations', 'Settings and backup']) {
          const section = page.getByRole('button', { name, exact: true });
          await section.scrollIntoViewIfNeeded();
          await section.click();
          assert.equal(await section.getAttribute('aria-current'), 'page', `${name} must stay reachable`);
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert(overflow <= 1, `Whole-page horizontal overflow at ${width}px: ${overflow}`);
        const table = page.locator('.table-wrap');
        assert(await table.evaluate(n => n.scrollWidth >= n.clientWidth), 'Gradebook should retain local scrolling');
        if (width === 390) await page.screenshot({ path: path.join(evidence, `shell-${theme}.png`), fullPage: true });
        // An enlarged text setting must not make the whole document overflow.
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Enlarged-text overflow');
      }
      checks++;
      await page.close();
    }
  }
  // No global UI changes: remove native class and compare browser geometry.
  const web = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await web.route('**/*', route => route.abort());
  await web.setContent(fixture.replace('shell erudior-android-shell', 'shell'));
  await web.addStyleTag({ content: base });
  const measure = () => web.locator('.topbar').evaluate(n => ({display:getComputedStyle(n).display, height:n.getBoundingClientRect().height}));
  const before = await measure();
  await web.addStyleTag({ content: polish });
  assert.deepEqual(await measure(), before, 'Native phone styling must not alter browser layout');
  await web.close();
  console.log(`PASS: ${checks} viewport/theme combinations, accessible control sizes, homeschool navigation, display settings and browser isolation.`);
} finally {
  await browser.close();
}
