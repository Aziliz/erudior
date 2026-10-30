// Actual App with isolated synthetic local Families. No production accounts or requests.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium=pw.chromium || pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS || path.join(root,'test-results','shared-device-browser');
await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
const password='Synthetic shared device password 2026';
let server,browser,page,current='startup';
const errors=[],checks=[],screenshots=[];
const heading=name=>page.getByRole('heading',{name,exact:true});
const button=name=>page.getByRole('button',{name,exact:true});
const locked=()=>page.getByRole('region',{name:'Locked shared device',exact:true});
async function authenticate(value=password){
 await page.getByLabel('Parent password',{exact:true}).fill(value);
 await button('Open').click();
}
async function select(name){
 await heading("Who's learning?").waitFor();
 await page.locator('.who-card').filter({hasText:name}).click();
 await locked().waitFor();
 await page.getByRole('status').filter({hasText:`Authorize ${name} to learn`}).waitFor();
 await authenticate(); await heading('Library').waitFor();
}
async function seed(count){return page.evaluate(async({password,count})=>{
 const store=await import('/src/lib/storage.ts'),{createFamily}=await import('/src/lib/family.ts');
 const {family}=await createFamily({mode:'homeschool',state:'',route:'Synthetic local acceptance',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password,students:[{name:'Synthetic Alice',grade:7},{name:'Synthetic Bob',grade:6}].slice(0,count)});
 for(const s of family.students)await store.updateProfileProgress(s.id,()=>({...store.emptyProgress(),catalogV1:true,enrolled:[]}));
 return family.students.map(s=>s.id);
},{password,count});}
async function audit(name){
 current=name;await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,`${name}: body overflow`);
 await page.addScriptTag({content:axe});
 const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
 assert.deepEqual(violations,[],`${name}: accessibility`);
 const file=name+'.png';await page.screenshot({path:path.join(out,file),fullPage:false});screenshots.push(file);
}
async function workspace(){
 await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();
 await heading('Courses').waitFor();await button('Open student workspace').click();
 await heading('Student dashboard and notebook').waitFor();await button('Notebook').click();
}
try{
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify('1'),'import.meta.env.VITE_COURSES_URL':JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('')},logLevel:'warn'});
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
 for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}]){
  const prefix=`${theme}-${width}`;
  // Separate contexts prove single-learner startup without altering an existing Family.
  for(const count of [1,2]){
   current=`${prefix}-${count}-startup`;
   const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
   await context.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===origin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
   page=await context.newPage();await page.clock.install();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));page.on('dialog',dialog=>dialog.dismiss());
   await page.goto(origin);await heading('Library').waitFor();const ids=await seed(count);await page.reload();
   await heading("Who's learning?").waitFor();assert.equal(await heading('Library').count(),0,'startup never enters a learner, even the only learner');
   await audit(`${prefix}-${count}-guarded-chooser`);
   await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await locked().waitFor();
   await authenticate('Wrong synthetic password');await page.getByRole('alert').filter({hasText:"password isn't right"}).waitFor();
   assert.equal(await heading('Library').count(),0);await audit(`${prefix}-${count}-wrong-password`);
   await button('Cancel').click();await heading("Who's learning?").waitFor();
   await select('Synthetic Alice');
   await page.reload();await heading("Who's learning?").waitFor();
   await select('Synthetic Alice');
   if(count===1){checks.push({width,theme,workflow:'single learner locked startup; wrong password; cancel; explicit authorization; reload loses grant'});await context.close();continue;}
   await button('Student: Synthetic Alice. Switch student').click();await select('Synthetic Alice');
   await button('Student: Synthetic Alice. Switch student').click();await select('Synthetic Bob');
   assert.equal(await button('Student: Synthetic Bob. Switch student').count(),1);
   await button('Student: Synthetic Bob. Switch student').click();await select('Synthetic Alice');
   await workspace();await button('Add note').click();
   const form=page.getByRole('form',{name:'Add note',exact:true});
   await form.getByLabel('Title',{exact:true}).fill('Synthetic private draft');
   await form.getByLabel('Notes',{exact:true}).fill('Unsaved Alice-only text survives locking');
   // Pause a genuine storage mutation, then revoke its lease through the actual UI.
   await page.evaluate(async id=>{
    const store=await import('/src/lib/storage.ts');
    let release;const wait=new Promise(resolve=>release=resolve);window.syntheticRelease=release;
    window.syntheticPending=store.updateProfileProgress(id,async p=>{window.syntheticStarted=true;await wait;return {...p,syntheticLateWrite:true};}).then(()=>({ok:true}),e=>({ok:false,message:e.message}));
   },ids[0]);
   await page.waitForFunction(()=>window.syntheticStarted);
   await button('Lock device').click();await locked().waitFor();
   assert.equal(await form.isVisible(),false,'draft text is concealed from locked UI');
   const lockedUrl=page.url();await page.goBack();await page.waitForFunction(url=>location.href===url,lockedUrl);await locked().waitFor();await page.goForward();await page.waitForFunction(url=>location.href===url,lockedUrl);await locked().waitFor();
   await audit(`${prefix}-locked-draft`);
   await button('Unlock device').click();await authenticate();await form.waitFor();
   assert.equal(await form.getByLabel('Notes',{exact:true}).inputValue(),'Unsaved Alice-only text survives locking');
   const late=await page.evaluate(async()=>{window.syntheticRelease();return window.syntheticPending;});assert.equal(late.ok,false,'pre-lock write cannot borrow fresh authorization');
   assert.match(late.message,/session|lock|learner|authority/i);
   await form.getByRole('button',{name:'Save entry',exact:true}).click();
   await page.getByRole('article',{name:/Synthetic private draft$/}).waitFor();
   const saved=await page.evaluate(async ids=>{const s=await import('/src/lib/storage.ts');return Promise.all(ids.map(id=>s.loadProfileProgress(id)));},ids);
   assert.equal(saved[0].syntheticLateWrite,undefined);assert.equal(saved[0].studentWorkspace.entries[0].body,'Unsaved Alice-only text survives locking');assert.equal(saved[1].studentWorkspace?.entries?.length??0,0);
   await audit(`${prefix}-resumed-private-note`);
   // Virtual time drives the real idle timer, without a production/test backdoor.
   await page.clock.fastForward(10*60_000+2_000);await locked().waitFor();
   await audit(`${prefix}-idle-locked`);await button('Unlock device').click();await authenticate();
   await page.getByRole('article',{name:/Synthetic private draft$/}).waitFor();
   // Deterministic visibility event tests the actual lifecycle handler. Native OS
   // background delivery remains a separate native acceptance requirement.
   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
   await page.clock.fastForward(31_000);
   await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
   await locked().waitFor();await audit(`${prefix}-background-locked`);
   await button('Unlock device').click();await authenticate();
   await page.getByRole('article',{name:/Synthetic private draft$/}).waitFor();
   // Sensitive settings require a new credential check, not just an open Parent tab.
   await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Family',exact:true}).click();await authenticate();
   await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:'Settings and backup',exact:true}).click();
   await page.getByLabel('New password',{exact:true}).fill('Synthetic replacement never submitted');await button('Change password').click();
   await page.getByRole('status').filter({hasText:'Confirm adult access for this sensitive action.'}).waitFor();await audit(`${prefix}-sensitive-reauth`);
   await button('Cancel').click();await locked().waitFor();await button('Unlock device').click();await authenticate();
   assert.equal(await page.getByLabel('New password',{exact:true}).inputValue(),'Synthetic replacement never submitted','canceled reauth preserves unsaved settings');
   await page.reload();await heading("Who's learning?").or(heading('Parent area')).waitFor();
   // Direct parent route must still require the original credential after cancellation.
   await page.goto(origin+'/parent');await heading('Parent area').waitFor();await authenticate();await page.getByRole('navigation',{name:'Parent sections',exact:true}).waitFor();
   checks.push({width,theme,workflow:'two learners; explicit same/sibling authorization; private notebook; preserved unsaved draft; lock/history concealment; delayed pre-lock mutation rejected after reauthentication; idle timeout; simulated background visibility handler; sensitive settings cancellation; reload original credential'});
   await context.close();
  }
 }
 assert.deepEqual(errors,[],'No browser runtime errors');
 await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,data:'synthetic isolated local families',externalNetwork:'blocked',checks,screenshots,errors},null,2));
 console.log('Shared-device real-App acceptance passed');
}catch(error){
 const diagnostic=page?await page.evaluate(()=>({url:location.href,headings:[...document.querySelectorAll('h1,h2')].map(n=>n.textContent),notices:[...document.querySelectorAll('[role=alert],[role=status]')].map(n=>n.textContent)})).catch(()=>null):null;
 await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,screenshots,errors,diagnostic},null,2));if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw error;
}finally{await browser?.close();await server?.close();}
