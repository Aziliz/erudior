// College Core program: public outline and app follow/edit flow with area progress.
// Disposable local storage, no production requests. CHROMIUM_PATH may point at a system Chrome.
import assert from 'node:assert/strict';
import { mkdir, readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'test-results/college-core');
await mkdir(out, {recursive:true});
const axe = await readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const server = await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0,fs:{allow:[root,await realpath(path.join(root,'node_modules'))]}},define:{
  __DEV_COURSE_KEY__:JSON.stringify(''),
  'import.meta.env.VITE_HOMESCHOOL':JSON.stringify('1'),
  'import.meta.env.VITE_AS_DESKTOP':JSON.stringify('1'),
  'import.meta.env.VITE_COURSES_URL':JSON.stringify(''),
  'import.meta.env.VITE_COMMUNITY_API':JSON.stringify(''),
},logLevel:'warn'});
let browser;const errors=[];const checks=[];
try {
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH, args:["--no-sandbox"] } : {});
 for(const width of [1280,320]) for(const theme of ['light','dark']) {
  const ctx=await browser.newContext({viewport:{width,height:960},colorScheme:theme,reducedMotion:'reduce'});
  await ctx.route('**/*',route=>new URL(route.request().url()).origin===origin ? route.continue():route.abort());
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  async function audit(name) {
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow');
   await page.addScriptTag({content:axe});
   const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations);
   assert.deepEqual(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],name+' accessibility');
   await page.screenshot({path:path.join(out,`${name}-${theme}-${width}.png`),fullPage:false});
   checks.push(`${name}-${theme}-${width}`);
  }
  // Public outline
  await page.goto(origin+'/programs?site');
  const card=page.getByRole('article',{name:'College Core program',exact:true});await card.waitFor();
  const text=await card.innerText();
  assert.match(text, /16 areas · \d+ courses to choose from/);
  assert.match(text, /Minimum to finish: 25 courses/);
  const arts=card.locator(':scope > details').filter({has:page.locator('summary',{hasText:/^Arts and humanities · choose at least 4$/})});
  await arts.locator('summary').first().focus();await page.keyboard.press('Enter');
  await arts.getByText(/Includes at least 1 in arts and 1 in literature/).waitFor();
  await arts.locator('li details summary').first().click();
  await arts.getByRole('heading',{name:'Module outline',exact:true}).first().waitFor();
  await audit('public-core');
  // App: follow, see areas, change choices
  await page.goto(origin+'/?app');await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();
  await page.getByRole('heading',{name:'Your courses',exact:true}).waitFor();
  await page.getByRole('button',{name:/^Follow program.*College Core/}).click();
  const saved=page.getByRole('article',{name:'College Core pathway',exact:true});await saved.waitFor();
  const read=()=>page.evaluate(async()=>(await import('/src/lib/storage.ts')).loadProgress());
  assert.equal((await read()).learningPathways.find(p=>p.id==='college-core').courseIds.length,25);
  assert.equal((await read()).enrolled?.length??0,0,'following does not enroll');
  const program=saved.locator('.study-program');
  assert.match(await program.locator(':scope > details > summary').first().innerText(), /Written communication · choose at least 3 · 3 chosen · 0 completed/);
  await program.locator(':scope > details > summary').first().click();
  assert.equal(await program.locator(':scope > details').first().locator('progress').getAttribute('max'),'3');
  await audit('followed-core');
  // Remove a math choice in the editor: the area then asks for one more course.
  await saved.getByRole('button',{name:'Edit pathway'}).click();
  const editor=page.locator('form.pathway-editor');await editor.waitFor();
  await editor.getByRole('button',{name:'Remove Introductory Statistics (planned) from pathway'}).click();
  await editor.getByRole('button',{name:'Save pathway'}).click();await editor.waitFor({state:'detached'});
  assert.equal((await read()).learningPathways.find(p=>p.id==='college-core').courseIds.length,24);
  const math=()=>saved.locator('.study-program > details').filter({has:page.locator('summary',{hasText:/^Mathematics/})});
  assert.match(await math().locator('summary').first().innerText(), /1 chosen/);
  await math().locator('summary').first().click();
  await math().getByText(/Your pathway needs 1 more course here/).waitFor();
  await audit('core-needs-course');
  // Add more than the minimum: published Calculus and planned Mythology from the editor's list.
  await saved.getByRole('button',{name:'Edit pathway'}).click();await editor.waitFor();
  for (const label of ['Calculus','Precalculus','Mythology (planned)']) {
   await editor.getByRole('combobox').selectOption({label});
   await editor.getByRole('button',{name:'Add course'}).click();
  }
  await audit('core-editor');
  await editor.getByRole('button',{name:'Save pathway'}).click();await editor.waitFor({state:'detached'});
  const ids=(await read()).learningPathways.find(p=>p.id==='college-core').courseIds;
  assert(ids.includes('math-calculus') && ids.includes('college-mythology'));
  assert.match(await math().locator('summary').first().innerText(), /3 chosen/, 'extra courses keep the program attached');
  await ctx.close();
 }
 assert.deepEqual(errors,[]);
 console.log(`College Core: public area outline, keyboard expansion, follow without enrolling, area progress, missing-choice notice, extra courses, and ${checks.length} responsive/accessibility states passed.`);
} finally { await browser?.close(); await server.close(); }
