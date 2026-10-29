// Review the real splash component/CSS in Chromium, including mobile-size viewports.
// No page navigation, production requests, accounts, or learner data are involved.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const { chromium } = pw.chromium ? pw : pw.default;
const root = path.resolve(import.meta.dirname, '..');
const evidence = path.join(root, 'artifacts/startup-splash');
mkdirSync(evidence, { recursive: true });
const source = readFileSync(path.join(root, 'src/lib/startupSplash.ts'), 'utf8');
const css = readFileSync(path.join(root, 'src/styles.css'), 'utf8') + '\n' + readFileSync(path.join(root, 'src/startupSplash.css'), 'utf8');
const js = ts.transpileModule(source.replace(/^export /gm, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.None },
}).outputText;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const results = [];
async function load(page, brand = { kind: 'official' }) {
  await page.setContent(`<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><main>Page ready</main></body></html>`);
  await page.addScriptTag({ content: `(()=>{${js}\nwindow.showSplash=()=>{const s=createStartupSplash(${JSON.stringify(brand)});document.body.append(s);window.splash=s;return s;};window.startSplash=()=>scheduleStartupSplashDismissal(window.splash);window.dismissSplash=()=>dismissStartupSplash(window.splash);window.showSplash();})();` });
}
async function seek(page, ms) {
  await page.evaluate(t => window.splash.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = t; }), ms);
}
try {
  for (const [width, height, deviceScaleFactor] of [[1440,900,1],[390,844,3],[320,568,2],[844,390,1]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await load(page);
    await seek(page, 0);
    assert.equal(await page.locator('.eb-sheet').count(), 3);
    assert.equal(await page.locator('.erudior-book-back').count(), 0, 'no separately revealed outline');
    assert.equal(await page.locator('[data-prerender-skip]').count(), 1);
    assert.ok(await page.evaluate(() => window.splash.getAnimations({subtree:true}).every(a => a.effect.getTiming().duration === 2800)), 'one shared 2.8-second timeline');
    const closed = await page.locator('.eb-cover').boundingBox();
    assert.ok(Math.abs(closed.x + closed.width / 2 - width / 2) < 2, 'closed book remains centered');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
    for (const t of [0,168,300,450,600,840,1000,1200,1400,1600,1800,2000,2184,2436]) {
      await seek(page, t);
      for (const selector of ['.eb-cover','.eb-sheet-one','.eb-sheet-two','.eb-sheet-three']) {
        assert.equal(await page.locator(selector).evaluate(e => getComputedStyle(e).opacity), '1', 'cover and pages do not pop into view');
      }
      if (width === 1440 || width === 390) await page.screenshot({ path: path.join(evidence, `${width}-frame-${t}.png`) });
    }
    assert.equal(await page.locator('.eb-ribbon').evaluate(e => getComputedStyle(e).opacity), '1');
    // A fresh real-time run, not the paused frame-inspection timeline.
    await load(page);
    await page.evaluate(() => {
      window.startedAt = performance.now(); window.removedAt = null;
      new MutationObserver(() => { if (!window.splash.isConnected && window.removedAt === null) window.removedAt = performance.now() - window.startedAt; }).observe(document.body, {childList:true});
      window.startSplash();
    });
    await page.waitForTimeout(2300);
    assert.equal(await page.locator('.erudior-splash').count(), 1, 'not dismissed during page turns');
    await page.waitForFunction(() => window.removedAt !== null, null, { timeout: 4000 });
    const elapsed = await page.evaluate(() => window.removedAt);
    // CI scheduling may be late; the authored timeline must never finish early.
    assert.ok(elapsed >= 2700 && elapsed < 3600, `dismissed at ${elapsed}ms`);
    assert.deepEqual(errors, []);
    results.push({ width, height, deviceScaleFactor, frames: 14, dismissedMs: Math.round(elapsed) });
    await context.close();
  }
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  await load(reducedPage); await reducedPage.evaluate(() => window.startSplash());
  assert.equal(await reducedPage.locator('.erudior-splash').count(), 0);
  results.push({ reducedMotion: 'immediate dismissal' });
  await reduced.close();
  const page = await browser.newPage();
  await load(page);
  await page.addStyleTag({ content: '.erudior-splash{transition:none!important}' });
  await page.evaluate(() => window.dismissSplash());
  await page.waitForTimeout(450);
  assert.equal(await page.locator('.erudior-splash').count(), 0, 'removal does not depend on transitionend');
  results.push({ missingTransitionEvent: 'removed' });
  await load(page, { kind:'third-party', productName:'Independent learning' });
  assert.equal(await page.locator('.erudior-splash > strong').innerText(), 'Independent learning');
  assert.match(await page.locator('.erudior-splash > small').innerText(), /not affiliated/);
  results.push({ thirdPartyAttribution: 'preserved' });
  await page.close();
  writeFileSync(path.join(evidence, 'results.json'), JSON.stringify({ok:true, results}, null, 2));
  console.log('Splash visual/lifecycle checks passed:', JSON.stringify(results));
} catch (error) {
  writeFileSync(path.join(evidence, 'results.json'), JSON.stringify({ok:false, results, error:String(error)}, null, 2));
  throw error;
} finally { await browser.close(); }
