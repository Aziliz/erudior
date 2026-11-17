// Actual public and app screens; disposable local storage, no production requests.
import assert from 'node:assert/strict';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'test-results/study-programs');
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
  await page.goto(origin+'/programs?site');
  await page.locator('details.program-group > summary').filter({hasText:/^Law/}).click();
  await page.getByRole('heading',{name:'Programs',exact:true}).waitFor();
  const card=page.getByRole('article',{name:'J.D. Preparation program',exact:true});
  const availableProgramCount = await page.evaluate(async()=>{
   const { STUDY_PROGRAMS, programCourses } = await import('/src/lib/studyPrograms.ts');
   const { CATALOG } = await import('/src/lib/catalog.ts');
   return programCourses(STUDY_PROGRAMS[0]).filter(c=>CATALOG.some(e=>e.id===c.courseId)).length;
  });
  assert((await card.innerText()).includes(`${availableProgramCount} of 25 courses available`));
  assert.match(await card.locator('li details summary').first().textContent(), /^LSAT 180 Mastery/);
  // Native details must expand with keyboard, including nested course outlines.
  await card.locator(':scope > details > summary').first().focus();await page.keyboard.press('Enter');
  await card.locator('li details summary').first().focus();await page.keyboard.press('Enter');
  await page.getByRole('heading',{name:'Module outline',exact:true}).waitFor();
  assert.equal(await card.getByRole('button').count(),0);
  await audit('public-outline');
  await page.goto(origin+'/?app');await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();
  await page.getByRole('heading',{name:'Your courses',exact:true}).waitFor();
  await page.locator('details.program-group > summary').filter({hasText:/^Law/}).click();
  await page.getByRole('button',{name:/^Follow program.*J\.D\. Preparation/}).click();
  const saved=page.getByRole('article',{name:'J.D. Preparation pathway',exact:true});await saved.waitFor();
  const read=()=>page.evaluate(async()=>(await import('/src/lib/storage.ts')).loadProgress());
  const installed=()=>page.evaluate(async()=>(await (await import('/src/lib/storage.ts')).listCourses()).courses.map(c=>c.id));
  assert.equal((await read()).learningPathways.find(p=>p.id==='jd-preparation').courseIds.length,25);
  assert.equal((await read()).enrolled?.length??0,0);
  assert.deepEqual(await installed(),[], 'following the program does not install courses');
  assert.equal(await saved.getByRole('button',{name:'View next course',exact:true}).count(),1);
  assert.equal(await saved.locator('.pathway-step button').count(),availableProgramCount, 'only published courses have launch actions');
  assert.equal(await saved.locator('.study-program progress').count(),3);
  await saved.locator('.study-program > details > summary').first().click();
  await saved.scrollIntoViewIfNeeded();await audit('saved-program');
  await saved.getByRole('button',{name:'View next course',exact:true}).click();
  await page.getByRole('heading',{name:'LSAT 180 Mastery',exact:true}).waitFor();
  await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
  assert.deepEqual(await installed(),[], 'viewing LSAT does not install it');
  await audit('lsat-overview');
  await page.getByRole('button',{name:'Start course',exact:true}).click();
  await page.locator('.overview').waitFor({state:'detached'});
  assert.deepEqual(await installed(),['lsat-180-mastery']);
  await page.getByRole('button',{name:'Lessons',exact:true}).click();
  await page.locator('.lesson-row > button:first-child').first().click();
  await page.locator('.lesson-body').waitFor();
  await audit('lsat-lesson');
  await page.goto(origin+'/?app');
  await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();await saved.waitFor();
  assert.equal((await read()).learningPathways.find(p=>p.id==='jd-preparation').courseIds[0],'lsat-180-mastery');
  const enrolledBeforeLawOverview = (await read()).enrolled ?? [];
  await saved.locator('.study-program > details > summary').first().click();
  await saved.locator('.study-program li details > summary').nth(1).click();
  await saved.locator('.study-program li details').nth(1).getByRole('button',{name:/^View course/}).click();
  await page.getByRole('heading',{name:'Introduction to the U.S. Legal System',exact:true}).waitFor();
  await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
  assert.deepEqual((await read()).enrolled ?? [], enrolledBeforeLawOverview, 'viewing the law overview preserves explicit enrollment records');
  assert.deepEqual(await installed(),['lsat-180-mastery'], 'viewing the law overview does not install it');
  await audit('course-overview');
  await page.getByRole('button',{name:'Start course',exact:true}).click();
  await page.locator('.overview').waitFor({state:'detached'});
  assert.deepEqual((await installed()).sort(),['law-us-legal-system','lsat-180-mastery']);
  await page.getByRole('button',{name:'Lessons',exact:true}).click();
  await page.locator('.lesson-row > button:first-child').first().click();
  await page.locator('.lesson-body').waitFor();
  await audit('published-lesson');
  await page.goto(origin+'/?app');
  await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();await saved.waitFor();
  await saved.locator('.study-program > details > summary').first().click();
  await saved.locator('.study-program li details > summary').nth(2).click();
  await saved.locator('.study-program li details').nth(2).getByRole('button',{name:/^View course/}).click();
  await page.getByRole('heading',{name:'Case Reading and Legal Reasoning',exact:true}).waitFor();
  await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
  assert.deepEqual((await installed()).sort(),['law-us-legal-system','lsat-180-mastery'], 'viewing the next course does not install it');
  await audit('case-reading-overview');
  await page.getByRole('button',{name:'Start course',exact:true}).click();
  await page.locator('.overview').waitFor({state:'detached'});
  assert.deepEqual((await installed()).sort(),['law-case-reading','law-us-legal-system','lsat-180-mastery']);
  await page.getByRole('button',{name:'Lessons',exact:true}).click();
  await page.locator('.lesson-row > button:first-child').first().click();
  await page.locator('.lesson-body').waitFor();
  await audit('case-reading-lesson');
  await page.goto(origin+'/?app');
  await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();await saved.waitFor();
  await saved.locator('.study-program > details > summary').nth(1).click();
  const contracts = saved.locator('.study-program li details').filter({has:page.locator('summary',{hasText:/^Contracts II:/})});
  assert.match(await contracts.locator('summary').innerText(), /Available$/);
  assert.match(await saved.locator('.study-program li details > summary').filter({hasText:/^Torts/}).innerText(), /Planned$/);
  await contracts.locator('summary').click();
  await contracts.getByRole('button',{name:/^View course/}).click();
  await page.getByRole('heading',{name:'Contracts II: Performance, Breach and Remedies',exact:true}).waitFor();
  await page.getByRole('heading',{name:'Overview',exact:true}).waitFor();
  assert.deepEqual((await installed()).sort(),['law-case-reading','law-us-legal-system','lsat-180-mastery'], 'viewing Contracts II does not install it');
  await audit('contracts-2-overview');
  await page.getByRole('button',{name:'Start course',exact:true}).click();
  await page.locator('.overview').waitFor({state:'detached'});
  assert.deepEqual((await installed()).sort(),['law-case-reading','law-contracts-2','law-us-legal-system','lsat-180-mastery']);
  await page.getByRole('button',{name:'Lessons',exact:true}).click();
  assert.equal(await page.locator('.lesson-row').count(),8);
  assert.equal(await page.locator('.module-quiz button:disabled').count(),4);
  await page.locator('.lesson-row > button:first-child').first().click();
  await page.locator('.lesson-body').waitFor();
  await audit('contracts-2-lesson');
  await page.goto(origin+'/?app');
  await page.reload();await page.getByRole('heading',{name:'Library',exact:true}).waitFor();
  await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();await saved.waitFor();
  await saved.getByRole('button',{name:'Stop following',exact:true}).click();await saved.waitFor({state:'detached'});
  assert.equal((await read()).learningPathways?.length??0,0);
  assert.deepEqual((await installed()).sort(),['law-case-reading','law-contracts-2','law-us-legal-system','lsat-180-mastery'], 'stopping the program preserves all explicitly started courses');
  await ctx.close();
 }
 assert.deepEqual(errors,[]);
 await writeFile(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
 console.log(`Public/app JD program: LSAT first, keyboard outlines, follow, persistence, removal, explicit enrollment of LSAT and three law courses, Contracts II lesson/module gates, planned-course launch prevention and ${checks.length} responsive/accessibility states passed.`);
} finally {await browser?.close();await server.close();}
