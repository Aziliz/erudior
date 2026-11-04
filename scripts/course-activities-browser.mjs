// Synthetic-only course activity discovery, targeted launch and return regression.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url)),out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','course-activities-browser');await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');let server,browser,page,current='startup';const issues=[];
try{
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify('')},logLevel:'warn'});await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
 const button=name=>page.getByRole('button',{name,exact:true});
 async function audit(name){current=name;await page.evaluate(()=>document.fonts.ready);assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1),name+': body overflow');await page.addScriptTag({content:axe});const r=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));assert.deepEqual(r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],name+': accessibility');await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
 async function inspect(name){
  const disclosure=page.getByText('Inspect this exact course activity',{exact:true});await disclosure.focus();await page.keyboard.press('Enter');
  const region=page.getByRole('region',{name:'Engine source inspection'});await region.waitFor();
  await page.waitForFunction(()=>{const region=document.querySelector('[aria-label="Engine source inspection"]');return !!region&&/Inspection SHA-256: [a-f0-9]{64}/.test(region.textContent||'');});
  assert.match(await region.innerText(),/Source ID:.*Source revision:/s);assert.match(await region.innerText(),/Adult handoff:/);
  await audit(name+'-inspection');
  const raw=region.locator('details').first();await raw.locator('summary').click();await raw.locator('pre').waitFor();const source=JSON.parse(await raw.locator('pre').innerText());assert.equal(source.id,await page.evaluate(()=>window.courseActivitiesFixture.route().sourceId));assert.equal(source.lessonId,'intro');await raw.locator('summary').click();await disclosure.click();
 }
 for(const colorScheme of ['light','dark'])for(const width of [1280,320]){
 const name=`${colorScheme}-${width}`;current=name;const context=await browser.newContext({viewport:{width,height:900},colorScheme});await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===origin||['data:','blob:'].includes(u.protocol)?r.continue():r.abort();});page=await context.newPage();page.on('pageerror',e=>issues.push(`${current}: ${e.message}`));await page.goto(origin+'/tests/fixtures/course-activities.html');await page.getByRole('heading',{name:'Apply this lesson',exact:true}).waitFor();await audit(name+'-lesson');
 await button('Open Synthetic reasoning and oral assessment').focus();await page.keyboard.press('Enter');await button('Assigned reasoning — assessment revision 1').click();assert.equal((await page.evaluate(()=>window.courseActivitiesFixture.roundtrip())).kind,'advanced');await audit(name+'-assessment');await inspect(name+'-assessment');await page.getByLabel('Step answer',{exact:true}).fill('4');page.once('dialog',d=>d.dismiss());await button('← Return to lesson: Synthetic lesson').click();assert.equal(await page.getByLabel('Step answer',{exact:true}).inputValue(),'4');page.once('dialog',d=>d.accept());await button('← Return to lesson: Synthetic lesson').click();await page.getByRole('heading',{name:'Apply this lesson',exact:true}).waitFor();
 const scientific=await page.getByRole('button',{name:/^Open Synthetic/}).allTextContents();const scienceName=scientific.find(x=>/investigation|scientific|measurement/i.test(x));assert(scienceName,scientific.join('|'));await button(scienceName).click();await button('Assigned investigation — workspace revision 1').click();await audit(name+'-scientific');await inspect(name+'-scientific');await button('← Return to lesson: Synthetic lesson').click();
 await button('Open Fictional shared project').click();await button('Assigned scenario — scenario revision 1').click();await audit(name+'-branching');await inspect(name+'-branching');await button('← Return to lesson: Synthetic lesson').click();
 await button('Open Synthetic spreadsheet').click();await page.getByRole('region',{name:'Scrollable assignment workbook'}).waitFor();await audit(name+'-spreadsheet');await inspect(name+'-spreadsheet');await button('← Return to lesson: Synthetic lesson').click();
 await page.evaluate(()=>window.courseActivitiesFixture.openMissing());await page.getByRole('alert').filter({hasText:'no longer'}).waitFor();await audit(name+'-missing');await button('All course activities').click();await page.evaluate(()=>window.courseActivitiesFixture.mismatch());await button('Open Synthetic reasoning and oral assessment').click();await page.getByText(/No assignment matches this exact course source/).waitFor();assert.equal(await button('Assigned reasoning — assessment revision 1').count(),0);await audit(name+'-mismatch');assert(await page.evaluate(()=>window.courseActivitiesFixture.writes()===window.courseActivitiesFixture.initialWrites));await context.close();
 }
 assert.deepEqual(issues,[]);await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,viewports:[320,1280],themes:['light','dark'],issues},null,2));console.log('Course discovery, source-targeted engines, return guards, mismatch/missing source, keyboard and axe passed.');
}catch(e){await writeFile(path.join(out,'failure-diagnostics.json'),JSON.stringify({current,issues,error:String(e)},null,2));if(page)await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});throw e;}finally{await browser?.close();await server?.close();}
