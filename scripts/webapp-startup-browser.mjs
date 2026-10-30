// Real built app/site entrypoints, using isolated contexts and local assets only.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { onRequest } from '../functions/_middleware.js';
const pw=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
const {chromium}=pw.chromium?pw:pw.default;
const root=path.resolve(import.meta.dirname,'..');
const evidence=path.join(root,'artifacts/webapp-startup'); mkdirSync(evidence,{recursive:true});
const local='http://127.0.0.1:4176';
const server=spawn('npx',['vite','preview','--host','127.0.0.1','--port','4176','--strictPort'],{cwd:root,stdio:'ignore'});
const results=[]; let browser, lastPage;
async function setup(options={}) {
  const context=await browser.newContext(options);
  await context.addInitScript(()=>{
    window.startupAudit={overlays:0,appReadyDuringIntro:false};
    new MutationObserver(records=>{
      for(const record of records) for(const node of record.addedNodes) {
        if(node instanceof Element && node.matches('.erudior-splash')) window.startupAudit.overlays++;
      }
      if(document.querySelector('.erudior-splash') && document.querySelector('#root .catalog')) window.startupAudit.appReadyDuringIntro=true;
    }).observe(document,{childList:true,subtree:true});
  });
  await context.route(/^https:\/\/(www\.|app\.)?erudior\.com\//,async route=>{
    const request=new Request(route.request().url()); const url=new URL(request.url);
    const asset=req=>{const u=new URL(req.url);return fetch(local+u.pathname+u.search)};
    // Without a snapshot, visible catalog content proves React has mounted, not just prerendering.
    const response=url.hostname==='app.erudior.com' && url.pathname==='/'
      ? await fetch(local+'/index.html')
      : await onRequest({request,env:{ASSETS:{fetch:asset}},next:()=>asset(request)});
    await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
  });
  return context;
}
try {
  let ready=false;
  for(let i=0;i<60;i++){try{if((await fetch(local)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500));}
  assert.ok(ready,'local production server starts'); browser=await chromium.launch();
  for(const width of [1280,390]) {
    const context=await setup({viewport:{width,height:844}}); const page=await context.newPage(); lastPage=page;
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('https://erudior.com/',{waitUntil:'networkidle'});
    await page.locator('.engine-attribution .erudior-brand-preview').waitFor();
    assert.equal(await page.evaluate(()=>window.startupAudit.overlays),0,'public homepage never auto-plays');
    assert.equal(await page.locator('.erudior-brand-preview').getAttribute('data-playing'),'false');
    assert.equal(await page.locator('.erudior-brand-preview').evaluate(e=>e.getAnimations({subtree:true}).length),0);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.match(await page.locator('.engine-license-status').innerText(),/draft, not yet adopted/);
    assert.equal(await page.locator('.engine-attribution').evaluate(e=>getComputedStyle(e).display),'grid','footer stylesheet is loaded');
    assert.equal(await page.locator('.engine-attribution-links').evaluate(e=>getComputedStyle(e).gap),'10px','license links stay separated');
    const columns=await page.locator('.engine-attribution').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
    assert.equal(columns,width>720?2:1,'responsive footer columns');
    await page.locator('#engine-license').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(evidence,`${width}-footer-still.png`)});
    await page.getByRole('button',{name:'Play third-party animation'}).click();
    assert.equal(await page.locator('.erudior-brand-preview').getAttribute('data-playing'),'true');
    assert.equal(await page.locator('.erudior-splash').count(),0,'manual footer preview never covers the page');
    await page.waitForFunction(()=>document.querySelector('.erudior-brand-preview')?.getAttribute('data-playing')==='false');
    assert.equal(await page.getByRole('button',{name:'Play third-party animation'}).isEnabled(),true);
    await page.locator('nav a[href="/roadmap"]').click(); await page.locator('main h1').waitFor();
    assert.equal(await page.evaluate(()=>window.startupAudit.overlays),0);
    await page.goto('https://app.erudior.com/',{waitUntil:'domcontentloaded'});
    await page.locator('.erudior-splash').waitFor({state:'visible',timeout:3000});
    await page.locator('#root .catalog').waitFor({state:'visible',timeout:10000});
    assert.ok(await page.evaluate(()=>window.startupAudit.appReadyDuringIntro),'app renders while intro is still playing');
    await page.locator('.erudior-splash').waitFor({state:'detached',timeout:4500});
    assert.equal(await page.evaluate(()=>window.startupAudit.overlays),1,'one intro on fresh web-app opening');
    await page.screenshot({path:path.join(evidence,`${width}-app-ready.png`)});
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>window.startupAudit.overlays),0,'refresh never replays');
    await page.goto('https://erudior.com/',{waitUntil:'networkidle'}); await page.goBack({waitUntil:'networkidle'});
    assert.equal(await page.locator('.erudior-splash').count(),0,'history return never replays');
    assert.deepEqual(errors,[]);results.push({width,site:'no autoplay',footer:'manual only',webapp:'one intro',concurrentRender:true,refresh:'none',history:'none'});
    await context.close();
  }
  const reduced=await setup({reducedMotion:'reduce'});const page=await reduced.newPage();
  await page.goto('https://app.erudior.com/',{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>window.startupAudit.overlays),0,'reduced motion skips automatic intro');
  await page.goto('https://erudior.com/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Play third-party animation'}).click();
  assert.equal(await page.locator('.erudior-brand-preview').getAttribute('data-playing'),'false');
  results.push({reducedMotion:'static attribution only'});await reduced.close();
  writeFileSync(path.join(evidence,'results.json'),JSON.stringify({ok:true,results},null,2));
  console.log('Built app startup and homepage footer checks passed:',JSON.stringify(results));
} catch(error) {
  if(lastPage && !lastPage.isClosed()) await lastPage.screenshot({path:path.join(evidence,'failure.png'),fullPage:true}).catch(()=>{});
  writeFileSync(path.join(evidence,'results.json'),JSON.stringify({ok:false,results,error:String(error)},null,2));throw error;
} finally {await browser?.close();server.kill();}
