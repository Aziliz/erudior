// Real App with generic synthetic curriculum, never private course material.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
import nacl from 'tweetnacl';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results/guided-practice');
await mkdir(out,{recursive:true});
const axe=await readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const q=i=>({id:'q'+i,stem:`Which numeral shows two? (${i})`,choices:['2','4','6'],answer:[0],explanation:'Two is written 2. Count two objects to check.'});
const guided={format:'erudior-community',version:1,title:'Guided learning demo',description:'Synthetic interface review, not an approved curriculum.',subject:'Math',level:'Elementary School',type:'Course',assessmentPresentation:'guided-practice',calculator:'none',modules:[{id:'unit',title:'One practice unit',quiz:[q(6),q(7)]}],lessons:[{id:'lesson',module:'unit',title:'Explore a small group',blocks:[{type:'heading',text:'Your goal'},{type:'text',md:'I can count a small group. Try two objects, then explain what you notice.'},...[1,2,3,4,5].map(i=>({type:'question',...q(i)}))]}],decks:[],references:[{id:'adult-guide',title:'Supporting the learner',md:'Read prompts as needed. Watch a fresh example separately from the app checkpoint.'}]};
const standard={...guided,title:'Standard assessment demo',assessmentPresentation:'standard'};
const api='https://api.guided-practice.test',docs={'guided-demo':guided,'standard-demo':standard};
const entry=id=>({id,title:docs[id].title,description:docs[id].description,subject:'Math',level:'Elementary School',type:'Course',author:'Synthetic tests',version:1,review:'not_reviewed',counts:{lessons:1,questions:7,cards:0},updated:'2026-11-03T00:00:00Z'});
const keys=nacl.sign.keyPair(),catalog=Buffer.from(JSON.stringify({format:'examiner-catalog',version:1,courses:[]})),sig=Buffer.from(nacl.sign.detached(catalog,keys.secretKey)).toString('base64');
const checks=[],screenshots=[],errors=[],unexpected=[];let server,browser,page,current='startup';
try{
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(Buffer.from(keys.publicKey).toString('base64')),'import.meta.env.VITE_COURSES_URL':JSON.stringify('/test-courses/'),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify(''),'import.meta.env.VITE_AS_DESKTOP':JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify(api)},logLevel:'warn'});
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
 for(const width of [1280,320]){
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:width===320?'dark':'light',reducedMotion:'reduce'});
  const reads=[];
  await context.route('**/*',route=>{
   const r=route.request(),u=new URL(r.url());
   if(u.origin===api){
    reads.push({method:r.method(),cookie:r.headers().cookie||''});const id=u.pathname.split('/')[2];
    if(r.method()!=='GET'||!(u.pathname==='/catalog'||docs[id])){unexpected.push(r.method()+' '+u.href);return route.abort();}
    return route.fulfill({contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(u.pathname==='/catalog'?{courses:Object.keys(docs).map(entry)}:{...entry(id),doc:docs[id]})});
   }
   if(u.origin!==origin&&!['data:','blob:'].includes(u.protocol)){unexpected.push(u.href);return route.abort();}
   if(u.pathname.startsWith('/test-courses/'))return route.fulfill({contentType:u.pathname.endsWith('.sig')?'text/plain':'application/json',body:u.pathname.endsWith('.sig')?sig:catalog});
   return route.continue();
  });
  page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push({current,message:e.message}));
  const button=s=>page.getByRole('button',{name:s,exact:true}),heading=s=>page.getByRole('heading',{name:s,exact:true});
  const sections=()=>page.getByRole('navigation',{name:'Course sections'});
  async function open(id='guided-demo'){await page.goto(origin+'/community/'+id+'?app');await heading(docs[id].title).waitFor();await button('Start or open course').click();await sections().waitFor();}
  async function tab(name){await sections().getByRole('button',{name,exact:true}).click();}
  async function audit(name,target){current=name;await page.waitForFunction(()=>!document.querySelector('.erudior-splash'));await page.evaluate(()=>document.fonts.ready);if(target)await target.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+': overflow');await page.addScriptTag({content:axe});const result=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],name+': accessibility');await page.screenshot({path:path.join(out,name+'.png')});screenshots.push(name+'.png');}
  const state=()=>page.evaluate(async()=>await(await import('/src/lib/storage.ts')).loadProgress());
  async function answer(correct=true){await page.locator('.q-stem').waitFor();assert.equal(await page.locator('.clock').count(),0);assert.equal(await page.getByRole('button',{name:'Sure',exact:true}).count(),0);await page.locator(`[role="radio"][data-choice="${correct?0:1}"]`).focus();await page.keyboard.press('Space');await button('Check answer').click();await page.locator('.feedback .verdict').waitFor();assert.equal(await page.locator('.feedback .verdict.ok').count(),correct?1:0);assert.match(await page.locator('.feedback .expl').innerText(),/Count two objects/);}
  async function finish(count,correct){for(let i=0;i<count;i++){await answer(correct);if(i<count-1){const old=await page.locator('.q-stem').textContent();await button('Next').click();await page.waitForFunction(old=>document.querySelector('.q-stem')?.textContent!==old,old);}else{await button('See results').click();await heading('Let’s look at your practice').waitFor();}}}
  await open();await heading('A little learning, at your pace').waitFor();assert.equal(await page.getByText('Exam date',{exact:true}).count(),0);assert.equal(await page.getByText('Readiness',{exact:true}).count(),0);await audit(`${width}-guided-home`,heading('A little learning, at your pace'));
  await tab('Lessons');assert(await page.locator('.module-quiz button').isDisabled());await page.getByRole('button',{name:/Explore a small group/}).click();await heading('Try what you learned').waitFor();await audit(`${width}-lesson-checkpoint`,page.locator('.lesson-quiz'));
  await page.locator('.lesson-quiz').getByRole('button',{name:'Start lesson practice',exact:true}).click();await finish(5,false);assert.equal((await state()).lessonsDone['community-guided-demo/lesson'],undefined);assert.match(await page.locator('.score-head').innerText(),/needs more practice/);assert.equal(await page.locator('.score-big').count(),0);await audit(`${width}-try-again`,heading('Let’s look at your practice'));
  await button('Practice the lesson again').click();await answer(true);await button('Save & exit').click();await page.locator('.runner-main').waitFor({state:'hidden'});await page.reload();await page.getByRole('region',{name:'Unfinished session'}).waitFor();await button('Resume').click();await page.locator('.feedback .verdict.ok').waitFor();assert.equal(await page.locator('.clock').count(),0);await audit(`${width}-resumed-practice`,page.locator('.runner-bar'));
  await button('Next').click();await finish(4,true);assert((await state()).lessonsDone['community-guided-demo/lesson']);await open();await tab('Lessons');assert(await page.locator('.module-quiz button').isEnabled());await page.locator('.module-quiz button').click();await finish(2,true);assert((await state()).modulesDone['community-guided-demo/unit']);await audit(`${width}-checkpoint-complete`,heading('Let’s look at your practice'));
  await open();await tab('Questions');assert.equal(await page.getByText(/Exams:.*min/).count(),0);await page.locator('.bank-row').click();await heading('Practice together').waitFor();assert.equal(await page.getByRole('button',{name:'Start exam',exact:true}).count(),0);await page.getByLabel('How many questions?',{exact:true}).selectOption('3');await audit(`${width}-short-practice`,heading('Practice together'));await button('Start 3 practice questions').click();await answer(true);await button('Save & exit').click();
  await page.locator('.runner-main').waitFor({state:'hidden'});
  await page.getByRole('region',{name:'Unfinished session'}).waitFor();
  await page.goto(origin+'/?app');await heading('Library').waitFor();
  // Seed only after the previous runner has unmounted and completed its saved-draft write.
  const legacy=await page.evaluate(async()=>{const store=await import('/src/lib/storage.ts'),s=await import('/src/lib/session.ts');const course=(await store.listCourses()).courses.find(c=>c.id==='community-guided-demo');const run=s.startExam(course.banks[0],s.defaultExamOptions(course.banks[0]));const raw=s.serializeRun(run,{index:0,answers:{},flags:{},checked:{},confidence:{},blockIdx:0,blockUsed:run.blocks.map(()=>0)});await store.saveSessionState(raw);return raw;});
  assert.equal(await page.evaluate(async()=>await(await import('/src/lib/storage.ts')).loadSessionState()),legacy);
  await page.reload();await button('Resume').click();await page.getByRole('status').filter({hasText:'untimed guided practice'}).waitFor();assert.equal(await page.locator('.runner-main').count(),0);assert.equal(await page.evaluate(async()=>await(await import('/src/lib/storage.ts')).loadSessionState()),legacy);await page.evaluate(async()=>await(await import('/src/lib/storage.ts')).saveSessionState(null));
  await open();await tab('Progress');assert.equal(await page.getByRole('heading',{name:/Exam scores/i}).count(),0);await audit(`${width}-practice-progress`,heading('Course progress'));
  await page.evaluate(()=>document.documentElement.style.fontSize='130%');await audit(`${width}-large-progress`,heading('Course progress'));await page.evaluate(()=>document.documentElement.style.fontSize='');
  // Standard and read-aloud-only courses must keep exam choices; presentation is not inferred.
  await open('standard-demo');await page.getByText('Exam date',{exact:true}).waitFor();await tab('Questions');await page.locator('.bank-row').click();await heading('Timed exam').waitFor();await audit(`${width}-standard-unchanged`,heading('Timed exam'));
  await button('Start exam').click();await page.locator('.clock').waitFor();await button('Save & exit').click();
  assert(reads.length&&reads.every(r=>r.method==='GET'&&!r.cookie));checks.push({width,failedCheckpointRetained:true,correctRetry:true,unitUnlocked:true,savedResume:true,timedResumeBlockedAndPreserved:true,standardExamRetained:true});await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);
 await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,scope:'Real App in synthetic browser sessions; not Android or actual speech acceptance',checks,screenshots,errors,unexpected},null,2));
}catch(e){await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(e),checks,screenshots,errors,unexpected},null,2));await page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw e;}
finally{await browser?.close();await server?.close();}
