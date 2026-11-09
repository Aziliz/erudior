// Real Runner and reader hit targets. Speech is instrumented, not audible.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results/runner-reader');
await mkdir(out, { recursive: true });
const bundle = await build({
  entryPoints: [path.join(root, 'tests/fixtures/runner-reader.tsx')], bundle: true,
  format: 'iife', platform: 'browser', write: false, outdir: path.join(out, 'bundle'),
  jsx: 'automatic', target: 'es2022', define: { 'import.meta.env': '{}', __DEV_COURSE_KEY__: '""', 'process.env.NODE_ENV': '"production"' },
  loader: { '.woff': 'dataurl', '.woff2': 'dataurl', '.ttf': 'dataurl' }, logLevel: 'silent',
});
const js = bundle.outputFiles.find(f => f.path.endsWith('.js')).text;
const css = bundle.outputFiles.find(f => f.path.endsWith('.css')).text;
const checks = [], errors = [], requests = [], layouts = [];
let browser, page, current = 'startup';
try {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const width of [320, 480, 600, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, hasTouch: true, reducedMotion: 'reduce' });
    await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
    page = await context.newPage();
    page.on('pageerror', error => errors.push({ current, message: error.message }));
    await page.setContent('<!doctype html><html lang="en"><head><title>Reader layout regression</title></head><body><div id="root"></div></body></html>');
    await page.evaluate(() => {
      let pending;
      window.readerVoice = { calls: 0 };
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(text) { this.text = text; } } });
      Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
        getVoices: () => [{ lang: 'en-US', name: 'Synthetic', localService: true, default: true }],
        speak: utterance => { pending = utterance; window.readerVoice.calls++; },
        cancel: () => { const old = pending; pending = null; old?.onerror?.({ error: 'interrupted' }); },
        addEventListener() {}, removeEventListener() {},
      } });
    });
    await page.addStyleTag({ content: css });
    await page.addScriptTag({ content: js });
    await page.locator('.read-q').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const [index, kind] of ['blocks', 'numberline', 'counters', 'clock', 'coins', 'fractions', 'text'].entries()) {
      current = `${width}-${kind}`;
      await page.evaluate(index => window.readerFixture.show(index), index);
      await page.waitForFunction(kind => document.querySelector('main')?.dataset.question === kind, kind);
      if (kind !== 'text') {
        const model = page.locator(`.model-answer .mp.mp-${kind}`);
        await model.waitFor();
        assert(await model.locator('svg').count() > 0, `${current}: production model picture renders`);
        assert(await model.locator('button:not(:disabled):not([aria-disabled="true"])').count() > 0, `${current}: enabled model controls render`);
      }
      const reader = page.locator('.read-q');
      await reader.scrollIntoViewIfNeeded();
      // Prove the regression is sensitive to the original negative margin, not
      // merely that a button somewhere on the page can be clicked.
      if (width === 320) {
        const legacy = await page.addStyleTag({ content: '.ra-course .q-stem-row ~ .q-type { margin-top: -8px; }' });
        const overlap = await reader.evaluate(button => {
          const b = button.getBoundingClientRect();
          const range = document.createRange(); range.selectNodeContents(document.querySelector('.q-type'));
          return { textGap: range.getBoundingClientRect().top - b.bottom,
            bottomHit: button.contains(document.elementFromPoint(b.x + b.width / 2, b.bottom - 1)) };
        });
        assert(overlap.textGap < 0, `${current}: negative control must reproduce text overlap`);
        assert.equal(overlap.bottomHit, false, `${current}: negative control must obstruct the bottom edge`);
        await legacy.evaluate(node => node.remove());
      }
      const geometry = await reader.evaluate(button => {
        const b = button.getBoundingClientRect();
        const hint = document.querySelector('.q-type');
        const range = document.createRange(); range.selectNodeContents(hint);
        const text = range.getBoundingClientRect();
        const point = { x: b.x + b.width / 2, y: b.bottom - 1 };
        return { textGap: text.top - b.bottom, boxGap: hint.getBoundingClientRect().top - b.bottom,
          bottomHit: button.contains(document.elementFromPoint(point.x, point.y)), point };
      });
      assert(geometry.textGap >= 0, `${current}: instruction text overlaps reader (${geometry.textGap}px)`);
      assert(geometry.boxGap >= 0, `${current}: instruction box overlaps reader (${geometry.boxGap}px)`);
      assert(geometry.bottomHit, `${current}: bottom edge must hit reader`);
      let calls = await page.evaluate(() => window.readerVoice.calls);
      await page.touchscreen.tap(geometry.point.x, geometry.point.y);
      await page.waitForFunction(calls => window.readerVoice.calls > calls, calls);
      assert.equal(await reader.getAttribute('aria-pressed'), 'true');
      await reader.click(); // stop; also prove repeated activation works
      assert.equal(await reader.getAttribute('aria-pressed'), 'false');
      // Reach the reader using actual sequential keyboard navigation, not .focus().
      await page.evaluate(() => { document.activeElement?.blur(); document.body.tabIndex = -1; document.body.focus(); });
      let reached = false;
      for (let tab = 0; tab < 25; tab++) {
        await page.keyboard.press('Tab');
        if (await reader.evaluate(button => button === document.activeElement)) { reached = true; break; }
      }
      assert(reached, `${current}: reader reachable with Tab`);
      calls = await page.evaluate(() => window.readerVoice.calls);
      await page.keyboard.press('Enter');
      await page.waitForFunction(calls => window.readerVoice.calls > calls, calls);
      await page.keyboard.press('Space');
      assert.equal(await reader.getAttribute('aria-pressed'), 'false');
      // Keep document overflow strict. Also record the production scroll container
      // and footer: an existing intermediate-width footer issue must not disappear
      // from the evidence just because the real App contains its horizontal scroll.
      const layout = await page.evaluate(() => {
        const size = selector => {
          const node = document.querySelector(selector);
          return { clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
            right: node.getBoundingClientRect().right };
        };
        return { viewport: innerWidth, document: size('html'), main: size('.main'),
          question: size('.q-scroll'), footer: size('.runner-foot') };
      });
      layouts.push({ current, ...layout });
      assert(layout.document.scrollWidth <= width + 1, `${current}: horizontal document overflow`);
      assert(layout.question.scrollWidth <= layout.question.clientWidth + 1, `${current}: horizontal question overflow`);
      if (width === 320 || width === 1280) {
        assert(layout.main.scrollWidth <= layout.main.clientWidth + 1, `${current}: horizontal main overflow`);
      }
      await reader.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(out, `${current}.png`) });
      checks.push({ width, kind, textGap: geometry.textGap, boxGap: geometry.boxGap, bottomTouch: true, keyboard: true });
    }
    current = width + '-fraction-choice';
    await page.evaluate(() => window.readerFixture.show(7));
    const fraction = page.locator('.choice .mfrac').first();
    await fraction.waitFor();
    await page.evaluate(() => document.fonts.ready);
    const reader = page.locator('.read-q');
    await reader.scrollIntoViewIfNeeded();
    const hit = await reader.evaluate(button => {
      const rect = button.getBoundingClientRect();
      const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2;
      const target = document.elementFromPoint(x, y);
      return { x, y, reader: button.contains(target), target: target?.outerHTML.slice(0, 120) };
    });
    assert(hit.reader, current + ': reader center intercepted by ' + hit.target);
    const calls = await page.evaluate(() => window.readerVoice.calls);
    await page.touchscreen.tap(hit.x, hit.y);
    await page.waitForFunction(calls => window.readerVoice.calls > calls, calls);
    assert.equal(await reader.getAttribute('aria-pressed'), 'true');
    await reader.click();
    // Selecting prose in the question still works with a real pointer drag.
    const text = await page.locator('.q-stem').evaluate(stem => {
      const range = document.createRange();
      range.setStart(stem.firstChild, 0); range.setEnd(stem.firstChild, 5);
      const r = range.getBoundingClientRect();
      return { left: r.left, right: r.right, y: r.top + r.height / 2 };
    });
    await page.mouse.move(text.left, text.y);
    await page.mouse.down();
    await page.mouse.move(text.right, text.y, { steps: 8 });
    await page.mouse.up();
    assert.equal(await page.evaluate(() => getSelection().toString()), 'A row');
    const option = page.getByRole('radio').first();
    assert.equal(await option.getAttribute('aria-checked'), 'false');
    const formula = await fraction.boundingBox();
    await page.mouse.click(formula.x + formula.width / 2, formula.y + formula.height / 2);
    assert.equal(await option.getAttribute('aria-checked'), 'true');
    checks.push({ width, kind: 'fraction-choice', readerTouch: true, proseSelection: true, formulaClick: true });
    // Ordinary courses retain their existing compact question layout.
    await page.evaluate(() => window.readerFixture.show(6, false));
    await page.waitForFunction(() => document.querySelector('main')?.dataset.readAloud === 'false');
    assert.equal(await page.locator('.q-type').evaluate(node => getComputedStyle(node).marginTop), '-8px');
    await context.close();
  }
  assert.deepEqual(errors, []); assert.deepEqual(requests, []);
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, scope: 'Production Runner, synthetic fixtures, instrumented speech', checks, layouts, errors, requests }, null, 2));
  console.log(`Reader layout: ${checks.length} scenarios passed.`);
} catch (error) {
  await page?.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
  await writeFile(path.join(out, 'failure.json'), JSON.stringify({ current, error: String(error), checks, layouts, errors, requests }, null, 2));
  throw error;
} finally { await browser?.close(); }
