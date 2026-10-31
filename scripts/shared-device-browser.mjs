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
let activePassword=password,acceptDialogs=false;
let server,browser,page,current='startup',lastCredentialDiagnostic=null;
const errors=[],checks=[],screenshots=[];
const heading=name=>page.getByRole('heading',{name,exact:true});
const button=name=>page.getByRole('button',{name,exact:true});
const locked=()=>page.getByRole('region',{name:'Locked shared device',exact:true});
// Playwright's waitForFunction treats a Promise as truthy before it resolves.
// Await persistence predicates in the host and only accept a literal true.
async function waitForPersisted(predicate,arg,target=page){
 const deadline=Date.now()+15_000;let actual;
 do{actual=await target.evaluate(predicate,arg);if(actual===true)return;await new Promise(resolve=>setTimeout(resolve,50));}while(Date.now()<deadline);
 assert.equal(actual,true,'durable state did not reach the expected condition within 15 seconds');
}
async function authenticate(value=activePassword){
 // Navigation can mount a PIN-first gate after this helper is called. Wait for
 // its visible credential field before deciding whether password fallback exists.
 const credential=page.getByLabel(/^(PIN|Parent password|Teacher password)$/).filter({visible:true});
 await credential.first().waitFor();
 const gate=credential.first().locator('xpath=ancestor::form[1]');
 const fallback=gate.getByRole('button',{name:'Use password instead',exact:true});
 if(await fallback.isVisible())await fallback.click();
 await gate.getByLabel(/^(Parent|Teacher) password$/).fill(value);
 await gate.getByRole('button',{name:'Open',exact:true}).click();
}
async function select(name){
 await heading("Who's learning?").waitFor();
 await page.locator('.who-card').filter({hasText:name}).click();
 await locked().waitFor();
 await page.getByRole('status').filter({hasText:`Authorize ${name} to learn`}).waitFor();
 await authenticate(); await heading('Library').waitFor();
}
async function seed(count,mode='homeschool'){return page.evaluate(async({password,count,mode})=>{
 const store=await import('/src/lib/storage.ts'),{createFamily}=await import('/src/lib/family.ts');
 const {family,recoveryCode}=await createFamily({mode,className:'Synthetic classroom',state:'',route:'Synthetic local acceptance',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password,students:[{name:'Synthetic Alice',grade:7},{name:'Synthetic Bob',grade:6}].slice(0,count)});
 for(const s of family.students)await store.updateProfileProgress(s.id,()=>({...store.emptyProgress(),catalogV1:true,enrolled:[]}));
 return {ids:family.students.map(s=>s.id),recoveryCode};
},{password,count,mode});}
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
   page=await context.newPage();await page.clock.install();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));page.on('dialog',dialog=>acceptDialogs?dialog.accept():dialog.dismiss());
   await page.goto(origin);await heading('Library').waitFor();activePassword=password;acceptDialogs=false;const {ids,recoveryCode}=await seed(count);await page.reload();
   await heading("Who's learning?").waitFor();assert.equal(await heading('Library').count(),0,'startup never enters a learner, even the only learner');
   await page.clock.fastForward(6_000);
   assert.equal(await heading("Who's learning?").isVisible(),true,"a chooser without a grant stays available while credential polling is idle");
   assert.equal(await locked().count(),0,"initial authentication is not trapped behind a phantom session lock");
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
   // Actual keyboard events cannot reach window-bubbling shortcuts in the
   // preserved hidden Runner/reader, including when focus starts outside the lock.
   await page.evaluate(()=>{
    window.syntheticBubbledKeys=[];
    window.syntheticKeyListener=event=>window.syntheticBubbledKeys.push(event.type+':'+event.key);
    window.addEventListener('keydown',window.syntheticKeyListener);window.addEventListener('keyup',window.syntheticKeyListener);
    document.body.setAttribute('tabindex','-1');document.body.focus();
   });
   await page.keyboard.press('a');await page.keyboard.press('ArrowRight');await page.keyboard.press('Control+k');await page.keyboard.press('Tab');
   assert.deepEqual(await page.evaluate(()=>window.syntheticBubbledKeys),[],'locked outside-target keyboard events do not reach hidden screen handlers');
   assert(await page.evaluate(()=>!!document.activeElement?.closest('.local-session-lock')),'Tab outside the lock focuses a lock control');
   const lockedUrl=page.url();await page.goBack();await page.waitForFunction(url=>location.href===url,lockedUrl);await locked().waitFor();await page.goForward();await page.waitForFunction(url=>location.href===url,lockedUrl);await locked().waitFor();
   await audit(`${prefix}-locked-draft`);
   await button('Unlock device').click();
   await locked().getByLabel('Parent password',{exact:true}).pressSequentially(activePassword);
   assert.deepEqual(await page.evaluate(()=>window.syntheticBubbledKeys),[],'typing the credential remains local to the lock overlay');
   await page.evaluate(()=>{window.removeEventListener('keydown',window.syntheticKeyListener);window.removeEventListener('keyup',window.syntheticKeyListener);document.body.removeAttribute('tabindex');});
   await locked().getByRole('button',{name:'Open',exact:true}).click();await form.waitFor();
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
   await page.goto(origin+'/parent/planning');await heading('Parent area').waitFor();await authenticate();await page.getByRole('navigation',{name:'Parent sections',exact:true}).waitFor();
   // A second real App tab holds a learner grant before credentials change.
   const mainPage=page,second=await context.newPage();page=second;await page.clock.install();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));
   await page.goto(origin);await select('Synthetic Alice');await workspace();await button('Add note').click();
   await page.getByRole('form',{name:'Add note',exact:true}).getByLabel('Title',{exact:true}).fill('Rejected stale tab note');
   const beforeCredential=await second.evaluate(async()=>{
    const session=await import('/src/lib/localSession.ts'),store=await import('/src/lib/storage.ts'),family=await(await import('/src/lib/family.ts')).loadFamily();
    window.syntheticCredentialBefore=JSON.stringify({password:family.parent.password,pin:family.parent.pin,recovery:family.parent.recovery});
    return {enabled:session.localSessionEnabled(),locked:session.localSessionLocked(),learner:store.activeStudent(),hasPin:!!family.parent.pin};
   });
   assert.deepEqual(beforeCredential,{enabled:true,locked:false,learner:ids[0],hasPin:false},'second App has a bound live learner session before credential rotation');
   page=mainPage;await page.bringToFront();
   await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:'Settings and backup',exact:true}).click();
   await page.getByLabel('PIN for quicker sign-in (optional, 4 to 8 digits)',{exact:true}).fill('7319');await button('Turn on PIN').click();await authenticate();
   await waitForPersisted(async()=>!!(await(await import('/src/lib/family.ts')).loadFamily()).parent.pin);
   const credentialDiagnostic=await second.evaluate(async()=>{
    const session=await import('/src/lib/localSession.ts'),family=await(await import('/src/lib/family.ts')).loadFamily();
    let rejected=false,oldRejected=false;try{session.assertLocalSessionCredential(family.parent);}catch{rejected=true;}try{session.assertLocalSessionCredential(JSON.parse(window.syntheticCredentialBefore));}catch{oldRejected=true;}
    return {enabled:session.localSessionEnabled(),locked:session.localSessionLocked(),epoch:session.localSessionEpoch(),oldRejected,changed:window.syntheticCredentialBefore!==JSON.stringify({password:family.parent.password,pin:family.parent.pin,recovery:family.parent.recovery}),hasPin:!!family.parent.pin,rejected};
   });
   lastCredentialDiagnostic=credentialDiagnostic;console.log('Cross-tab credential diagnostic',JSON.stringify(credentialDiagnostic));
   assert.equal(credentialDiagnostic.changed,true,'second tab reads the newly persisted credential');
   assert.equal(credentialDiagnostic.rejected,true,'second tab credential binding rejects the newly persisted credential');
   const staleTabResult=await second.evaluate(async id=>{try{await(await import('/src/lib/storage.ts')).updateProfileProgress(id,p=>({...p,staleTabMutation:true}));return 'unexpected success';}catch(e){return e.message;}},ids[0]);
   assert.match(staleTabResult,/credential|session|lock|authority/i,'changed PIN invalidates another tab write grant');
   await second.bringToFront();await second.evaluate(()=>window.dispatchEvent(new Event('focus')));
   // The lock region can also be the temporary background concealment screen.
   // Prove authority was actually revoked, independently of its visibility.
   await waitForPersisted(async()=>(await import('/src/lib/localSession.ts')).localSessionLocked(),undefined,second);
   assert.equal(await second.evaluate(async id=>(await(await import('/src/lib/storage.ts')).loadProfileProgress(id)).staleTabMutation,ids[0]),undefined);
   await second.getByRole('region',{name:'Locked shared device',exact:true}).waitFor();
   page=second;await button('Unlock device').click();await page.getByLabel('PIN',{exact:true}).fill('7319');await button('Open').click();
   await page.getByRole('form',{name:'Add note',exact:true}).waitFor();
   assert.equal(await page.getByRole('form',{name:'Add note',exact:true}).getByLabel('Title',{exact:true}).inputValue(),'Rejected stale tab note','new credential resumes the preserved draft');
   assert.equal(await page.evaluate(async()=>(await import('/src/lib/localSession.ts')).localSessionLocked()),false);
   await audit(`${prefix}-new-pin-resumes-other-tab`);await second.close();page=mainPage;await page.bringToFront();
   // Repeated wrong PIN attempts persist, including after a full document reload.
   await page.goto(origin+'/parent/planning');await page.getByLabel('PIN',{exact:true}).waitFor();
   for(let n=1;n<=5;n++){await page.getByLabel('PIN',{exact:true}).fill('0000');await button('Open').click();await waitForPersisted(async expected=>(await(await import('/src/lib/family.ts')).loadFamily()).parent.failures===expected,n);}
   assert(await button('Open').isDisabled());await page.reload();await page.getByLabel('PIN',{exact:true}).waitFor();assert(await button('Open').isDisabled(),'PIN cooldown survives reload');await audit(`${prefix}-pin-lockout`);
   await page.clock.fastForward(61_000);await page.waitForFunction(()=>!document.querySelector('button[type=submit]')?.disabled);await authenticate();await page.getByRole('navigation',{name:'Parent sections',exact:true}).waitFor();
   // Correct PIN really opens a restricted learner, not the adult workspace.
   await page.goto(origin);await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await page.getByLabel('PIN',{exact:true}).fill('7319');await button('Open').click();await heading('Library').waitFor();assert.equal(await page.getByRole('navigation',{name:'Parent sections',exact:true}).count(),0);
   await page.goto(origin+'/parent/planning');await button('Forgot the password?').click();await page.getByLabel('Recovery code',{exact:true}).fill(recoveryCode);activePassword='Recovered synthetic password 2026';await page.getByLabel('New password (8 characters or more)',{exact:true}).fill(activePassword);await button('Reset password').click();await heading('Password changed').waitFor();
   const replacementCode=(await page.locator('.recovery-code').innerText()).trim();assert.notEqual(replacementCode,recoveryCode);const recovered=await page.evaluate(async()=>(await import('/src/lib/family.ts')).loadFamily());assert.equal(recovered.parent.pin,undefined,'recovery removes PIN');await audit(`${prefix}-recovery-rotates-code`);await button('Open the area').click();await page.getByRole('navigation',{name:'Parent sections',exact:true}).waitFor();
   await page.goto(origin+'/parent/planning');await button('Forgot the password?').click();await page.getByLabel('Recovery code',{exact:true}).fill(recoveryCode);await page.getByLabel('New password (8 characters or more)',{exact:true}).fill('Must not replace recovered password');await button('Reset password').click();await page.getByRole('alert').filter({hasText:"recovery code isn't right"}).waitFor();await button('Back').click();await authenticate();
   await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:'Settings and backup',exact:true}).click();
   // Export through the actual download and restore through the actual file picker.
   const backupPass='Synthetic encrypted backup passphrase',backupPath=path.join(out,`${prefix}-synthetic-backup.json`);
   await page.getByLabel('Backup passphrase',{exact:true}).fill(backupPass);const downloaded=page.waitForEvent('download');await button('Back up now').click();await authenticate();const download=await downloaded;await download.saveAs(backupPath);
   const envelope=JSON.parse(await readFile(backupPath,'utf8'));assert.equal(envelope.format,'examiner-backup-encrypted');assert.equal(JSON.stringify(envelope).includes('Synthetic Alice'),false,'backup output is encrypted');
   async function restoreBackup(expectSuccess){
    await page.getByLabel('Passphrase of the backup to restore',{exact:true}).fill(backupPass);const picker=page.waitForEvent('filechooser');await button('Restore from backup…').click();await authenticate();const chooser=await picker;acceptDialogs=true;const restored=expectSuccess?page.waitForEvent('load'):null;await chooser.setFiles(backupPath);
    if(expectSuccess){await restored;await page.goto(origin+'/parent/planning');await heading('Parent area').waitFor();await authenticate();await page.getByRole('navigation',{name:'Parent sections',exact:true}).waitFor();}
    else await page.getByRole('alert').filter({hasText:'This backup contains a deleted learner. Erased learner records cannot be restored to their old identity.'}).waitFor();
    acceptDialogs=false;
   }
   await restoreBackup(true);
   await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:'Students',exact:true}).click();acceptDialogs=true;await button('Remove Synthetic Bob').click();await authenticate();await waitForPersisted(async id=>!(await(await import('/src/lib/family.ts')).loadFamily()).students.some(s=>s.id===id),ids[1]);acceptDialogs=false;
   const tombstone=await page.evaluate(async id=>{const s=await import('/src/lib/storage.ts');return {deleted:JSON.parse(await s.loadState('classroom-submissions')).deletedStudentIds.includes(id),progress:await s.loadState('progress-'+id)};},ids[1]);assert.equal(tombstone.deleted,true);assert.equal(tombstone.progress,null);
   await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:'Settings and backup',exact:true}).click();await restoreBackup(false);await audit(`${prefix}-deleted-backup-rejected`);
   assert.equal(await page.evaluate(async id=>(await(await import('/src/lib/family.ts')).loadFamily()).students.some(s=>s.id===id),ids[1]),false,'backup cannot resurrect erased learner');
   assert.equal(await page.evaluate(async id=>(await import('/src/lib/storage.ts')).loadState('progress-'+id),ids[1]),null,'rejected backup leaves erased progress absent');
   checks.push({width,theme,workflow:'two learners; explicit same/sibling authorization; private notebook; preserved unsaved draft; lock/history concealment; delayed pre-lock mutation rejected after reauthentication; idle timeout; simulated background visibility handler; sensitive settings cancellation; reload original credential; PIN setup/cooldown/fallback; cross-tab credential invalidation; recovery rotation; actual encrypted backup/download/restore; deletion/tombstone stale backup rejection'});
   await context.close();
  }
  const classroomContext=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  await classroomContext.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  page=await classroomContext.newPage();page.setDefaultTimeout(15000);activePassword=password;await page.goto(origin);await heading('Library').waitFor();await seed(1,'classroom');await page.reload();await heading("Who's learning?").waitFor();
  await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await page.getByLabel('Teacher password',{exact:true}).waitFor();await authenticate();await heading('Library').waitFor();
  await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Classroom',exact:true}).click();await page.getByLabel('Teacher password',{exact:true}).waitFor();await authenticate();await page.getByRole('navigation',{name:'Teacher sections',exact:true}).waitFor();await audit(`${prefix}-classroom-teacher`);
  checks.push({width,theme,workflow:'classroom sole learner requires teacher authorization; entering Teacher area requires fresh authentication'});await classroomContext.close();
 }
 assert.deepEqual(errors,[],'No browser runtime errors');
 await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,data:'synthetic isolated local families',externalNetwork:'blocked',checks,screenshots,errors},null,2));
 console.log('Shared-device real-App acceptance passed');
}catch(error){
 const diagnostic=page?await page.evaluate(()=>({url:location.href,headings:[...document.querySelectorAll('h1,h2')].map(n=>n.textContent),notices:[...document.querySelectorAll('[role=alert],[role=status]')].map(n=>n.textContent)})).catch(()=>null):null;
 await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,screenshots,errors,diagnostic,lastCredentialDiagnostic},null,2));if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw error;
}finally{await browser?.close();await server?.close();}
