// Real local file download/upload, consent, IndexedDB reload and offline learner rendering.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','offline-course-browser');
await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64');
let server,browser;const completed=[],errors=[],screenshots=[];
try {
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify('')},logLevel:'warn'});await server.listen();
 const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
 for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}]) {
  const name=`${theme}-${width}`,context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme});
  const outside=[];await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin===origin||['data:','blob:'].includes(url.protocol))return route.continue();outside.push(url.href);return route.abort();});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(`${name}: ${error.message}`));
  const button=label=>page.getByRole('button',{name:label,exact:true});
  const courses=()=>page.evaluate(()=>window.offlineCourseFixture.courses());
  async function audit(stage){
   await page.evaluate(()=>document.fonts.ready);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,`${name}-${stage}: horizontal overflow`);
   await page.addScriptTag({content:axe});const violations=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));});
   assert.deepEqual(violations,[],`${name}-${stage}: accessibility`);
   const file=`${name}-${stage}.png`;await page.screenshot({path:path.join(out,file),fullPage:true});screenshots.push(file);
  }
  await page.goto(origin+'/tests/fixtures/offline-course.html');await button('Share offline').waitFor();
  await page.waitForFunction(()=>window.offlineCourseFixture.courses().length===1);
  const before=await courses(),progress=await page.evaluate(()=>window.offlineCourseFixture.progress());
  await button('Share offline').click();assert(await button('Save offline package').isDisabled());await audit('missing-media');
  await page.locator('input[type=file]').setInputFiles({name:'synthetic-chart.png',mimeType:'image/png',buffer:png});
  await page.getByText('Selected: synthetic-chart.png',{exact:true}).waitFor();await audit('export-ready');
  const downloadPromise=page.waitForEvent('download');await button('Save offline package').click();const download=await downloadPromise;
  const file=path.join(out,`${name}.erudior.json`);await download.saveAs(file);
  const content=await readFile(file,'utf8');assert.match(content,/data:image\/png;base64/);assert(!content.includes('lessonsDone'));
  await button('Cancel').click();assert.equal(await page.locator('#offline-export-title').count(),0);
  await button('Import screen').click();const choose=page.waitForEvent('filechooser');await button('Import').click();await (await choose).setFiles(file);
  await page.getByRole('heading',{name:'Import offline course',exact:true}).waitFor();assert.equal((await courses()).length,1);await audit('import-confirm');
  await button('Cancel import').click();assert.equal((await courses()).length,1);
  const chooseAgain=page.waitForEvent('filechooser');await button('Import').click();await (await chooseAgain).setFiles(file);await button('Import as local copy').click();
  await page.waitForFunction(()=>window.offlineCourseFixture.courses().length===2);const after=await courses();assert.deepEqual(after.find(c=>c.id===before[0].id),before[0]);assert.notEqual(after.find(c=>c.id!==before[0].id).id,before[0].id);
  await page.reload();await page.waitForFunction(()=>window.offlineCourseFixture.courses().length===2);assert.deepEqual(await page.evaluate(()=>window.offlineCourseFixture.progress()),progress);
  await context.setOffline(true);await button('Read imported lesson').click();
  const image=page.getByRole('img',{name:'Synthetic chart',exact:true});await image.waitFor();assert(await image.evaluate(i=>i.complete&&i.naturalWidth>0),'embedded image renders offline');assert.match(await image.getAttribute('src'),/^data:image\/png;base64,/);await audit('offline-lesson');
  assert.deepEqual(outside,[],'No remote media requests or uploads');completed.push(name);await context.close();
 }
 assert.deepEqual(errors,[],'No browser runtime errors');
 await writeFile(path.join(out,'report.json'),JSON.stringify({passed:true,completed,screenshots,errors},null,2));console.log('Offline course browser acceptance passed: '+completed.join(', '));
} catch(error){await writeFile(path.join(out,'failure.json'),JSON.stringify({message:String(error),completed,screenshots,errors},null,2));throw error;}
finally{await browser?.close();await server?.close();}
