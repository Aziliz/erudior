// Actual editors, synthetic persistence/publication only. No production authors or courses.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','community-guide-browser');await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
const sampleTable='| Shape | Sides |\n|---|---:|\n| Triangle | 3 |\n| Square | 4 |';
const sampleDiagram='flowchart LR\n  A[Read the table] --> B[Compare the shapes]';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/C8AAAAASUVORK5CYII=','base64');
let server,browser,page,current='startup';const errors=[],screenshots=[];
try{
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('/synthetic-api')},logLevel:'warn'});await server.listen();
 const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
 const button=name=>page.getByRole('button',{name,exact:true});
 const state=()=>page.evaluate(()=>window.communityGuideFixture.state());
 const saved=async()=>{await button('Save draft').click();await page.locator('.save-state').filter({hasText:'All changes saved'}).waitFor();};
 async function audit(name,target){
  current=name;
  await page.evaluate(()=>{window.scrollTo(0,0);for(const e of document.querySelectorAll('.main,.inner')){e.scrollTop=0;e.scrollLeft=0;}});
  if(target)await target.scrollIntoViewIfNeeded();
  await page.evaluate(()=>document.fonts.ready);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  if(overflow>1)await writeFile(path.join(out,name+'-overflow.json'),JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.slice(0,80),rect:(()=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};})()})).filter(e=>e.rect.left< -1||e.rect.right>innerWidth+1)),null,2));
  assert(overflow<=1,name+': body overflow');
  await page.addScriptTag({content:axe});
  const a=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
  assert.deepEqual(a.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],name+': accessibility');
  await page.screenshot({path:path.join(out,name+'.png'),fullPage:false});screenshots.push(name+'.png');
 }
 async function guideWalkthrough(name,field,expected){
  const before=await state();
  const summary=page.locator('summary').filter({hasText:'Authoring guide'});await summary.focus();await page.keyboard.press('Enter');
  const guide=page.getByRole('region',{name:'Community authoring guide'});await guide.waitFor();
  await audit(name+'-guide-open',guide);
  const sections=guide.getByRole('navigation',{name:'Authoring guide sections'}).getByRole('button');const titles=await sections.allTextContents();assert(titles.length>=8,'comprehensive section navigation');
  // Every section is reachable by an actual button, not merely present in hidden markup.
  for(const [index,title] of titles.entries()){await guide.getByRole('button',{name:title,exact:true}).click();await guide.getByRole('heading',{level:3}).waitFor();if(name.endsWith('-legacy'))await audit(name+'-guide-section-'+String(index+1).padStart(2,'0'),guide.getByRole('heading',{level:3}));}
  const search=page.getByLabel('Search authoring guide',{exact:true});await search.fill('spreadsheet');assert(await sections.count()>0);await audit(name+'-guide-search',guide);
  await search.fill('zzzz-no-authoring-topic');assert.equal(await sections.count(),0);await audit(name+'-guide-no-results',guide);await search.fill('');
  await summary.focus();await page.keyboard.press('Enter');await guide.waitFor({state:'hidden'});
  assert.equal(await field.inputValue(),expected,'Guide keeps the exact unsaved editor value');
  const after=await state();assert.deepEqual(after.draft,before.draft,'Guide never changes persisted source');assert.equal(after.publishes,before.publishes,'Guide never publishes');
 }
 for(const theme of ['light','dark'])for(const width of [1280,320])for(const mode of ['legacy','canonical']){
  const name=`${theme}-${width}-${mode}`;current=name;
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
  await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===origin&&u.pathname==='/synthetic-api/images/guide-image')return route.fulfill({status:200,contentType:'image/png',body:png});return u.origin===origin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
  page=await context.newPage();page.on('pageerror',error=>errors.push(`${current}: ${error.message}`));
  await page.goto(origin+`/tests/fixtures/community-guide.html?mode=${mode}`);await page.getByRole('heading',{level:1}).waitFor();
  if(mode==='legacy'){
   await page.getByRole('button',{name:/^Lessons \(/}).click();await page.getByRole('button',{name:/Alpha lesson/}).click();
   await page.evaluate(()=>window.communityGuideFixture.failSaves(true));const title=page.getByLabel('Lesson title',{exact:true});await title.fill('Shapes walkthrough');
   await guideWalkthrough(name,title,'Shapes walkthrough');await page.evaluate(()=>window.communityGuideFixture.failSaves(false));
   await button('Heading').click();await page.getByRole('group',{name:/^Heading \(block/}).getByRole('textbox').fill('Compare shapes');
   await button('Text').click();await page.locator('.block-text').last().getByRole('textbox').fill(sampleTable);
   await button('Diagram').click();const diagram=page.locator('.block-diagram').last();await diagram.getByRole('textbox',{name:/^Mermaid diagram/}).fill(sampleDiagram);await diagram.getByLabel('Title',{exact:true}).fill('Reading a shape table');await diagram.getByLabel("What it shows, for people who can't see it",{exact:true}).fill('Read the table, then compare the number of sides.');
   await button('Math model to play with').click();const model=page.locator('.block-manipulative').last();await model.getByLabel('Number built at the start',{exact:true}).fill('4');await model.getByLabel('Caption (optional): what to try with the model',{exact:true}).fill('Build the number of sides of a square.');
   await button('Image').click();
   const imageBlock=page.locator('fieldset.block-image').last();await imageBlock.locator('input[type=file]').setInputFiles({name:'synthetic-guide.png',mimeType:'image/png',buffer:png});await imageBlock.getByRole('img').waitFor();await imageBlock.getByLabel("Description for people who can't see it (alt text)",{exact:true}).fill('A tiny synthetic pixel used only to verify image upload.');
   await button('Question').click();const question=page.locator('.block-question').last();await question.getByRole('textbox',{name:/^Question · math/}).fill('How many sides does a square have?');await question.getByLabel('Choice 1',{exact:true}).fill('3');await question.getByLabel('Choice 2',{exact:true}).fill('4');await question.getByLabel('Choice 2 is right',{exact:true}).check();await question.getByLabel('Explanation shown after answering (optional)',{exact:true}).fill('A square has four sides.');
   await saved();assert.deepEqual(await page.evaluate(()=>window.communityGuideFixture.check()),[]);await button('Preview').click();const preview=page.getByRole('region',{name:'Lesson preview'});await preview.getByRole('table').waitFor();await preview.getByRole('heading',{name:'Compare shapes',exact:true}).waitFor();await preview.getByText('How many sides does a square have?',{exact:false}).waitFor();await preview.locator('.diagram svg').waitFor();await audit(name+'-rich-preview',preview);
   await page.reload();await page.getByRole('button',{name:/^Lessons \(/}).click();assert.equal(await title.inputValue(),'Shapes walkthrough');await button('Preview').click();await preview.getByRole('table').waitFor();await audit(name+'-reopened-preview',preview);
   await button('Publish').click();await page.getByRole('heading',{name:'Publish',exact:true}).waitFor();await page.locator('section.panel').getByRole('button',{name:'Publish',exact:true}).click();await page.getByText('Published version 1',{exact:true}).first().waitFor();
  }else{
   const description=page.getByLabel('Description',{exact:true});await description.fill('Unsaved canonical listing preserved while reading.');await guideWalkthrough(name,description,'Unsaved canonical listing preserved while reading.');await button('Save listing draft').click();await page.getByText('Canonical draft saved.',{exact:true}).waitFor();
   await button('Edit full course').click();await page.getByRole('button',{name:/^Lessons \(/}).click();await button('Alpha lesson').click();const body=page.getByLabel('Lesson text (Markdown)',{exact:true});const text=`Alpha original body.\n\n## Canonical table\n\n${sampleTable}`;await body.fill(text);await guideWalkthrough(name+'-full-editor',body,text);await button('Save course').click();await page.getByText('Canonical draft saved.',{exact:true}).waitFor();await button('← Done').click();await page.reload();await button('Edit full course').click();await page.getByRole('button',{name:/^Lessons \(/}).click();await button('Alpha lesson').click();assert.equal(await body.inputValue(),text);await button('Preview').click();await page.getByRole('table').waitFor();await audit(name+'-reopened-preview',page.getByRole('table'));await button('← Done').click();await button('Publish canonical version 1').click();await page.getByText('Published community version 1; not reviewed.',{exact:true}).waitFor();
  }
  const published=await state();assert.equal(published.publishes,1);assert.equal(published.version,1);const installed=await page.evaluate(()=>window.communityGuideFixture.install());assert.equal(installed.community.review,'not_reviewed');assert.equal(installed.lessons[0].id,'alpha');assert(installed.lessons[0].body.includes('Triangle'));await page.getByRole('region',{name:'Installed synthetic course'}).getByRole('table').waitFor();if(mode==='legacy'){assert(installed.banks.some(b=>b.questions.some(q=>q.stem==='How many sides does a square have?')));assert.deepEqual(installed.banks.flatMap(b=>b.questions).find(q=>q.stem==='How many sides does a square have?').answer,[1]);await page.getByRole('region',{name:'Installed synthetic course'}).locator('.diagram svg').waitFor();}await audit(name+'-installed',page.getByRole('region',{name:'Installed synthetic course'}));await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,themes:['light','dark'],widths:[320,1280],modes:['legacy','canonical'],screenshots,errors},null,2));console.log('Community authoring guide: search/section/close preserves unsaved edits; documented rich lesson create/preview/save/reopen/publish/install passes.');
}catch(error){await writeFile(path.join(out,'failure-diagnostics.json'),JSON.stringify({current,error:String(error),errors,screenshots},null,2));if(page)await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});throw error;}finally{await browser?.close();await server?.close();}
