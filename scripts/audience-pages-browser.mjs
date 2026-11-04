// Real public Site renderer. App screenshots are captured separately from the real App,
// with synthetic local records; this test never creates accounts or contacts production.
import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.AUDIENCE_PAGE_ARTIFACTS || path.join(root,'test-results/audience-pages');
await mkdir(out,{recursive:true});
const axe=await readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const cases=[{path:'/parents',title:/parents and homeschool families/i,nav:'For parents'}, {path:'/teachers',title:/teachers/i,nav:'For teachers'}, {path:'/live-rooms',title:/live rooms/i,nav:'Live rooms'}];
let server,browser,page,current='startup';
const errors=[],checks=[],screenshots=[];
const requiredTags=['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'];
async function ready(entry) {
 await page.locator('.audience-page h1').filter({hasText:entry.title}).waitFor();
 await page.locator('.startup-splash').waitFor({state:'hidden'});
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.audience-page h1').count(),1);
 assert.equal(await page.locator('.audience-page form, .audience-page input, .audience-page textarea, .audience-page select').count(),0,'public pages do not collect account information');
 assert.equal(await page.locator('nav[aria-label="Main"] a[aria-current="page"]').innerText(),entry.nav);
}
async function imageReady(image) {
 await image.scrollIntoViewIfNeeded();
 await image.evaluate(async node=> {await node.decode();if(!node.complete||node.naturalWidth===0)throw Error('Screenshot did not load: '+node.src);});
 assert(await image.evaluate(node=>node.getBoundingClientRect().width>0),'image is visibly rendered');
}
async function audit(name, screenshot=true) {
 current=name;
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+': no horizontal page overflow');
 await page.addScriptTag({content:axe});
 const violations=await page.evaluate(async tags=>(await window.axe.run(document,{runOnly:{type:'tag',values:tags}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),requiredTags);
 assert.deepEqual(violations,[],name+': accessibility');
 if(screenshot){const file=name+'.png';await page.screenshot({path:path.join(out,file),fullPage:false});screenshots.push(file);}
 checks.push(name);
}
try {
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_COURSES_URL':JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify('')},logLevel:'warn'});
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
 for(const width of [1280,320]) for(const theme of ['light','dark']) {
  const ctx=await browser.newContext({viewport:{width,height:900},colorScheme:theme,reducedMotion:'reduce'});
  await ctx.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const entry of cases) {
   const prefix=`${entry.path.slice(1)}-${width}-${theme}`;
   await page.goto(origin+entry.path+'?site');await ready(entry);
   await imageReady(page.locator('.audience-page img').first());await page.evaluate(()=>scrollTo(0,0));await audit(prefix+'-overview');
   const details=page.locator('.audience-tab-guide details');const count=await details.count();assert(count>=4);
   for(let i=0;i<count;i++) {
    const detail=details.nth(i),summary=detail.locator(':scope > summary');
    assert.equal(await detail.getAttribute('open'),null,'walkthrough starts collapsed');
    await summary.focus();await page.keyboard.press('Enter');
    await detail.locator('img').first().waitFor({state:'visible'});
    for(const image of await detail.locator('img').all())await imageReady(image);
    await summary.scrollIntoViewIfNeeded();
    await audit(`${prefix}-tab-${i+1}`,i===0||i===count-1);
    await summary.click();assert.equal(await detail.getAttribute('open'),null,'close hides detail');
    await summary.click();assert.notEqual(await detail.getAttribute('open'),null,'repeated open works');
    await summary.click();assert.equal(await detail.getAttribute('open'),null,'repeated close works');
   }
   // Resize text without disabling author styling; expand each actual disclosure so
   // long labels, body copy and screenshot containers are all included in overflow checks.
   await page.evaluate(()=>{document.documentElement.style.fontSize='200%';for(const d of document.querySelectorAll('.audience-tab-guide details'))d.open=true;});
   await page.evaluate(()=>document.fonts.ready);await audit(prefix+'-enlarged',false);
   await page.evaluate(()=>{document.documentElement.style.fontSize='';for(const d of document.querySelectorAll('.audience-tab-guide details'))d.open=false;});
   await page.reload();await ready(entry);assert.equal(await page.locator('.audience-tab-guide details[open]').count(),0);
   const other=cases.find(e=>e.path!==entry.path);
   await page.locator('nav[aria-label="Main"]').getByRole('link',{name:other.nav,exact:true}).click();await ready(other);
   assert.equal(new URL(page.url()).pathname,other.path);
   await page.goBack();await ready(entry);assert.equal(new URL(page.url()).pathname,entry.path);
   await page.goForward();await ready(other);assert.equal(new URL(page.url()).pathname,other.path);
   await page.goBack();await ready(entry);await audit(prefix+'-history',false);
  }
  await ctx.close();
 }
 assert.deepEqual(errors,[],'no uncaught browser errors');
 await writeFile(path.join(out,'results.json'),JSON.stringify({checks,screenshots,errors,render:'actual public Site',productionRequests:false},null,2));
 console.log(`Audience public pages passed ${checks.length} accessibility/layout states, all capture image loads, keyboard/repeated disclosure actions, reload and Back/Forward on all three routes.`);
} catch(error) {
 if(page&&!page.isClosed()) {await page.screenshot({path:path.join(out,'failure.png'),fullPage:false}).catch(()=>{});await writeFile(path.join(out,'failure.html'),await page.content()).catch(()=>{});}
 await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,errors},null,2));throw error;
} finally {await browser?.close();await server?.close();}
