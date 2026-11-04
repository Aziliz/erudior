// Exercise the shared real component, styling and playback policy, not screenshots alone.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const { chromium } = pw.chromium ? pw : pw.default;
const root = path.resolve(import.meta.dirname, '..');
const evidence = path.join(root, 'artifacts/startup-splash');
mkdirSync(evidence, { recursive: true });
const source = ['startupSplash.ts', 'startupSplashPolicy.ts'].map(f => readFileSync(path.join(root, 'src/lib', f), 'utf8')).join('\n');
const css = readFileSync(path.join(root, 'src/styles.css'), 'utf8') + '\n' + readFileSync(path.join(root, 'src/startupSplash.css'), 'utf8');
const js = ts.transpileModule(source.replace(/^export /gm, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.None },
}).outputText;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const results = [];
async function load(page, brand = { kind: 'official' }, inline = false) {
  await page.setContent(`<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><main>Page ready</main></body></html>`);
  await page.addScriptTag({ content: `(()=>{${js}\nwindow.claimSplash=claimWebAppSplash;window.showSplash=()=>{const s=${inline ? 'createBrandingPreview' : 'createStartupSplash'}(${JSON.stringify(brand)});document.body.append(s);window.splash=s;return s;};window.startSplash=()=>scheduleStartupSplashDismissal(window.splash);window.dismissSplash=()=>dismissStartupSplash(window.splash);window.showSplash();})();` });
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
    for (const brand of [{kind:'official'}, {kind:'third-party',productName:'Your learning app'}]) {
      await load(page, brand); await seek(page, 0);
      assert.equal(await page.locator('.eb-sheet').count(), 2, 'exactly two page turns');
      assert.equal(await page.locator('.erudior-book-back').count(), 0, 'no separately appearing outline');
      assert.equal(await page.locator('[data-prerender-skip]').count(), 1);
      assert.ok(await page.evaluate(() => window.splash.getAnimations({subtree:true}).every(a => a.effect.getTiming().duration === 3000)));
      const closed = await page.locator('.eb-cover').boundingBox();
      assert.ok(Math.abs(closed.x + closed.width / 2 - width / 2) < 2, 'closed half-book centered');
      for (const t of [0,120,450,840,870,1050,1290,1470,1650,1890,2070,2250,2430,2670]) {
        await seek(page, t);
        for (const selector of ['.eb-cover','.eb-sheet-one','.eb-sheet-two']) {
          assert.equal(await page.locator(selector).evaluate(e => getComputedStyle(e).opacity), '1', 'no disappearing page faces');
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
        if (width === 390 || (width === 1440 && brand.kind === 'official')) await page.screenshot({ path: path.join(evidence, `${brand.kind}-${width}-frame-${t}.png`) });
      }
      const ribbonHeights = [];
      for (const t of [2070,2250,2430,2670]) {
        await seek(page, t); ribbonHeights.push((await page.locator('.eb-ribbon').boundingBox()).height);
      }
      assert.ok(ribbonHeights[0] < 1 && ribbonHeights[3] > 140 && ribbonHeights[1] < ribbonHeights[2] && ribbonHeights[2] < ribbonHeights[3], 'bookmark unfolds over 600 ms');
      results.push({ width, height, kind:brand.kind, frames:14, ribbonHeights });
    }
    await load(page);
    await page.evaluate(() => {
      window.startedAt=performance.now(); window.removedAt=null;
      new MutationObserver(() => { if(!window.splash.isConnected && window.removedAt===null) window.removedAt=performance.now()-window.startedAt; }).observe(document.body,{childList:true});
      window.startSplash();
    });
    await page.waitForTimeout(2400);
    assert.equal(await page.locator('.erudior-splash').count(), 1, 'no dismissal during bookmark reveal');
    await page.waitForFunction(() => window.removedAt!==null, null, {timeout:4500});
    const elapsed = await page.evaluate(() => window.removedAt);
    assert.ok(elapsed >= 2900 && elapsed < 3800, `dismissed at ${elapsed}ms`);
    assert.deepEqual(errors, []);
    results.push({width, dismissedMs:Math.round(elapsed)});
    await context.close();
  }
  const page = await browser.newPage(); await load(page);
  const policy = await page.evaluate(() => {
    const make = () => { const values = new Map(); return { getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v) }; };
    const base = {isSite:false,isNative:false,reducedMotion:false,navigationType:'navigate',storage:make()};
    const outcome = {first:window.claimSplash(base),repeat:window.claimSplash(base)};
    for (const [name,patch] of Object.entries({website:{isSite:true},native:{isNative:true},reload:{navigationType:'reload'},back:{navigationType:'back_forward'},reduced:{reducedMotion:true}})) outcome[name]=window.claimSplash({...base,storage:make(),...patch});
    outcome.denied=window.claimSplash({...base,storage:{getItem(){throw Error('denied')},setItem(){throw Error('denied')}}});
    return outcome;
  });
  assert.deepEqual(policy,{first:true,repeat:false,website:false,native:false,reload:false,back:false,reduced:false,denied:false});
  results.push({policy});
  await load(page, {kind:'third-party',productName:'Your learning app'}, true);
  assert.equal(await page.locator('.erudior-splash').count(),0,'inline preview is not an overlay');
  assert.equal(await page.locator('.erudior-brand-preview').evaluate(e=>e.getAnimations({subtree:true}).length),0,'no footer autoplay');
  assert.equal(await page.locator('.erudior-brand-preview a').innerText(),'Powered by Erudior');
  assert.equal(await page.locator('.erudior-brand-preview a').getAttribute('href'),'https://erudior.com');
  assert.match(await page.locator('.erudior-brand-preview > small').innerText(),/not affiliated with or endorsed/);
  assert.ok(!(await page.locator('.erudior-brand-preview').innerText()).includes('Learn without limits.'));
  await load(page); await page.addStyleTag({content:'.erudior-splash{transition:none!important}'}); await page.evaluate(()=>window.dismissSplash());
  await page.waitForTimeout(450); assert.equal(await page.locator('.erudior-splash').count(),0);
  await page.close();
  const reduced = await browser.newContext({reducedMotion:'reduce'}); const rp=await reduced.newPage();
  await load(rp); await rp.evaluate(()=>window.startSplash()); assert.equal(await rp.locator('.erudior-splash').count(),0);
  await load(rp,{kind:'third-party',productName:'Your learning app'},true);
  assert.equal(await rp.locator('.erudior-brand-preview').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  await reduced.close();
  results.push({footer:'still and independent attribution',reducedMotion:'no animation',missingTransition:'removed'});
  writeFileSync(path.join(evidence,'results.json'),JSON.stringify({ok:true,results},null,2));
  console.log('Two-page splash and web-app-only policy passed:',JSON.stringify(results));
} catch(error) {
  writeFileSync(path.join(evidence,'results.json'),JSON.stringify({ok:false,results,error:String(error)},null,2)); throw error;
} finally { await browser.close(); }
