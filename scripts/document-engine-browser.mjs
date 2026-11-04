// Isolated synthetic learning-support regression. No production learner data or network access.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','document-engine-browser');
await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
let server,browser,page,current='startup';const issues=[];
try {
  server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0,strictPort:false},define:{__DEV_COURSE_KEY__:JSON.stringify('')},logLevel:'warn'});
  await server.listen();const address=server.httpServer.address();assert(address&&typeof address!=='string');const origin=`http://127.0.0.1:${address.port}`;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
  const button=name=>page.getByRole('button',{name,exact:true});
  const audit=async name=>{
    current=name;await page.evaluate(()=>document.fonts.ready);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    assert(overflow<=1,`${name}: ${overflow}px horizontal overflow`);
    await page.addScriptTag({content:axe});
    const results=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
    assert.deepEqual(results.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],`${name}: accessibility violations`);
    await page.screenshot({path:path.join(out,`${name.replace(/[^a-z0-9-]/gi,'-')}.png`),fullPage:true});
  };
  for(const colorScheme of ['light','dark'])for(const width of [1280,320]){
    const caseName=`${colorScheme}-${width}`;current=caseName;const context=await browser.newContext({viewport:{width,height:900},colorScheme});
    await context.route('**/*',route=>{const url=new URL(route.request().url());return url.origin===origin||url.protocol==='data:'?route.continue():route.abort();});
    page=await context.newPage();page.on('pageerror',e=>issues.push(`${current}: ${e.message}`));await page.goto(`${origin}/tests/fixtures/document-engine.html`);
    const label=name=>page.getByLabel(name,{exact:true});
    await page.getByRole('heading',{name:'Interactive document and case studio',exact:true}).waitFor();
    async function author(title,field){
      await label('Template title').fill(title);await label('Source provenance').fill('Synthetic original source for automated regression only.');await label('Source permission or license').fill('Synthetic test material; not an official form.');await label('Page 1 source text').fill('Synthetic evidence source. Review this exact text before responding.');
      await button('Add fillable field').click();await label('Field 1 label').fill(field);
      await page.getByRole('checkbox',{name:'Required field',exact:true}).check();
      await button('Save template revision').focus();await page.keyboard.press('Enter');await page.getByText('New source revision saved. Review and approve this exact revision before assignment.',{exact:true}).waitFor();
      await page.getByRole('checkbox',{name:'I reviewed this exact saved source, fields and permission notes for educational use.',exact:true}).check();await button('Approve exact source revision').click();await page.getByText('Exact source revision approved for educational assignment.',{exact:true}).waitFor();
    }
    await author('Synthetic form','Observation');await audit(`${caseName}-source-authoring`);
    const exported=page.waitForEvent('download');await button('Export portable template').click();const portable=JSON.parse(await readFile(await (await exported).path(),'utf8'));assert.equal(portable.approval,undefined,'Portable template cannot carry operative approval');
    await button('New template').click();await author('Synthetic reference','Reference response');
    await label('Case learner').selectOption('alice');await label('Case title').fill('Synthetic evidence case');await label('Case instructions').fill('Review both educational sources and annotate evidence.');
    await page.getByRole('checkbox',{name:'Synthetic form — source revision 1 (latest)',exact:true}).check();await page.getByRole('checkbox',{name:'Synthetic reference — source revision 1 (latest)',exact:true}).check();
    await page.evaluate(()=>window.documentFixture.failNextSave());await button('Assign document case').click();await page.getByRole('alert').filter({hasText:'Synthetic interrupted save'}).waitFor();await button('Assign document case').click();await page.getByText('Case assigned on this device with exact approved source snapshots. Earlier evidence is unchanged.',{exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>window.documentFixture.state().assignments.length),1);await audit(`${caseName}-assigned`);
    await button('Fixture learner area').click();await button('Synthetic evidence case — revision 1').click();await label('Observation').fill('First observation');await label('Quote end character').fill('9');await label('Annotation note').fill('Exact source evidence');await button('Add annotation').click();
    await page.getByRole('checkbox',{name:'Annotate a page region instead of an exact quote',exact:true}).check();await label('Annotation note').fill('Region evidence');await button('Add annotation').click();
    await label('Document source').selectOption({label:'Synthetic reference (revision 1)'});await label('Reference response').fill('Supporting evidence');
    await page.evaluate(()=>window.documentFixture.failNextSave());await button('Save document draft').click();await page.getByRole('alert').filter({hasText:'Synthetic interrupted save'}).waitFor();assert.equal(await label('Reference response').inputValue(),'Supporting evidence');await button('Save document draft').click();await page.getByText('Draft saved on this device.',{exact:true}).waitFor();
    await button('Reload cases').click();await button('Synthetic evidence case — revision 1').click();assert.equal(await label('Observation').inputValue(),'First observation');await page.getByText('Exact source evidence',{exact:true}).waitFor();
    await page.getByText('Page-position overlays and accessible coordinates',{exact:true}).click();await audit(`${caseName}-learner-draft`);
    await button('Submit document evidence').focus();await page.keyboard.press('Enter');await page.getByText('Immutable evidence submitted on this device. Earlier evidence remains unchanged.',{exact:true}).waitFor();await button('Submit document evidence').click();assert.equal(await page.evaluate(()=>window.documentFixture.state().submissions.length),1,'Repeated submit is idempotent');
    await button('Fixture adult area').click();await label('Instructor submission').selectOption({index:1});await label('Feedback status').selectOption('needs_revision');await label('Instructor feedback').fill('Explain the source more clearly.');await button('Append instructor feedback').click();await page.getByText('Feedback appended to this immutable submission.',{exact:true}).waitFor();await audit(`${caseName}-feedback`);
    await button('Fixture learner area').click();await button('Synthetic evidence case — revision 1').click();await label('Evidence snapshot').selectOption({index:1});await button('Revise a copy of this evidence').click();await label('Observation').first().fill('Revised observation');await button('Save document draft').click();await page.getByText('Draft saved on this device.',{exact:true}).waitFor();await button('Submit document evidence').click();await page.getByText('Immutable evidence submitted on this device. Earlier evidence remains unchanged.',{exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>window.documentFixture.state().submissions.length),2);
    await label('Fixture learner').selectOption('bob');await page.getByText('No document cases assigned.',{exact:true}).waitFor();assert.equal(await button('Synthetic evidence case — revision 1').count(),0,'Other profile cannot view case');
    await button('Fixture adult area').click();await label('Instructor submission').selectOption({index:1});await label('Compare evidence with').selectOption({index:1});await page.getByRole('heading',{name:/Comparison evidence/}).waitFor();assert.equal(await label('Observation').nth(0).inputValue(),'First observation');assert.equal(await label('Observation').nth(1).inputValue(),'Revised observation');await audit(`${caseName}-comparison`);
    const sourceKey=await page.evaluate(()=>{const t=window.documentFixture.state().templates.find(t=>t.title==='Synthetic form');return `${t.id}@${t.revision}`;});
    await label('Saved template revision').selectOption(sourceKey);await label('Page 1 source text').fill('Revised synthetic source. Previous evidence must keep the original text.');await button('Save template revision').click();await page.getByText('New source revision saved. Review and approve this exact revision before assignment.',{exact:true}).waitFor();
    await label('Compare source revision').selectOption(sourceKey);await audit(`${caseName}-source-revision-comparison`);
    await page.getByRole('checkbox',{name:'I reviewed this exact saved source, fields and permission notes for educational use.',exact:true}).check();await button('Approve exact source revision').click();await page.getByText('Exact source revision approved for educational assignment.',{exact:true}).waitFor();
    await label('Existing case').selectOption({index:1});await page.getByRole('checkbox',{name:'Synthetic form — source revision 2 (latest)',exact:true}).check();await button('Assign new case revision').click();await page.getByText('Case assigned on this device with exact approved source snapshots. Earlier evidence is unchanged.',{exact:true}).waitFor();
    const history=await page.evaluate(()=>window.documentFixture.state());assert.equal(history.assignments.length,2);assert.match(history.submissions[0].assignment.documents[0].pages[0].text,/Synthetic evidence source/);assert.equal(history.submissions[0].assignment.documents[0].revision,1);
    await button('Fixture learner area').click();await label('Fixture learner').selectOption('alice');await button('Synthetic evidence case — revision 2').click();await label('Document source').selectOption({label:'Synthetic form (revision 2)'});await label('Observation').fill('Reassigned source response');await label('Document source').selectOption({label:'Synthetic reference (revision 1)'});await label('Reference response').fill('Retained reference response');await button('Submit document evidence').click();await page.getByText('Immutable evidence submitted on this device. Earlier evidence remains unchanged.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.documentFixture.state().submissions.length),3);await audit(`${caseName}-reassigned-source`);
    await button('Fixture adult area').click();
    await page.reload();await label('Instructor submission').selectOption({index:1});assert.match(await page.locator('.document-comparison').textContent(),/Explain the source more clearly/,'Saved immutable review survives reopen');await audit(`${caseName}-reopened`);
    await context.close();page=null;
  }
  assert.deepEqual(issues,[],'Browser runtime errors');console.log('Document engine browser passed authoring, approval, multi-document assignment, drafts, annotations, immutable evidence, feedback, resubmission, comparison, recovery, profile isolation, keyboard, 320/1280 light/dark and axe.');
}catch(error){if(page)await page.screenshot({path:path.join(out,`${current.replace(/[^a-z0-9-]/gi,'-')}-failure.png`),fullPage:true}).catch(()=>{});throw error;}finally{await browser?.close();await server?.close();}
