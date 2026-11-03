// Actual public and app screens; disposable local storage, no production requests.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'test-results/study-programs');
await mkdir(out, {recursive:true});
const axe = await readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const server = await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{
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
  await page.goto(origin+'/programs?site');
  await page.getByRole('heading',{name:'Programs',exact:true}).waitFor();
  const card=page.getByRole('article',{name:'J.D. Preparation program',exact:true});
  assert.match(await card.innerText(),/0 of 24 courses available/);
  // Native details must expand with keyboard, including nested course outlines.
  await card.locator(':scope > details > summary').first().focus();await page.keyboard.press('Enter');
  await card.locator('li details summary').first().focus();await page.keyboard.press('Enter');
  await page.getByRole('heading',{name:'Module outline',exact:true}).waitFor();
  assert.equal(await card.getByRole('button').count(),0);
  await audit('public-outline');
  await page.goto(origin+'/?app');await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();
  await page.getByRole('heading',{name:'Your courses',exact:true}).waitFor();
  await page.getByRole('button',{name:/^Follow program/}).click();
  const saved=page.getByRole('article',{name:'J.D. Preparation pathway',exact:true});await saved.waitFor();
  const read=()=>page.evaluate(async()=>(await import('/src/lib/storage.ts')).loadProgress());
  assert.equal((await read()).learningPathways.find(p=>p.id==='jd-preparation').courseIds.length,24);
  assert.equal((await read()).enrolled?.length??0,0);
  assert.equal(await saved.getByRole('button',{name:/Continue course|View next course|View course/}).count(),0);
  assert.equal(await saved.locator('.study-program progress').count(),3);
  await saved.locator('.study-program > details > summary').first().click();
  await saved.scrollIntoViewIfNeeded();await audit('saved-program');
  await page.reload();await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();await saved.waitFor();
  await saved.getByRole('button',{name:'Stop following',exact:true}).click();await saved.waitFor({state:'detached'});
  assert.equal((await read()).learningPathways?.length??0,0);
  assert.equal((await read()).enrolled?.length??0,0);
  await ctx.close();
 }
 assert.deepEqual(errors,[]);
 await writeFile(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
 console.log('Public/app JD program: keyboard outlines, follow, persistence, removal, no enrollment, planned-course launch prevention and 8 responsive/accessibility states passed.');
} finally {await browser?.close();await server.close();}
