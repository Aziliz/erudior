// Real App/IndexedDB acceptance; synthetic local learners, all external network blocked.
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer, preview as serveBuild } from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'homeschool-planning-browser');
await mkdir(out, { recursive: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const password = 'Synthetic academic test password 2026';
const communityOrigin = 'https://community.synthetic.invalid';
const remoteEntry = {id:'synthetic-remote-plan',title:'Synthetic remote science',description:'Synthetic remote parent-review fixture, not curriculum.',subject:'Science',level:'High School',type:'Course',author:'Synthetic remote author',version:1,review:'not_reviewed',counts:{lessons:1,questions:0,cards:0},updated:'2026-10-30T00:00:00Z'};
const remoteDocument = version => ({format:'erudior-community',version:1,title:remoteEntry.title,description:remoteEntry.description,subject:remoteEntry.subject,level:remoteEntry.level,type:remoteEntry.type,lessons:[{id:'remote-read',title:'Synthetic remote reviewed lesson',blocks:[{type:'text',md:`Synthetic remote source version ${version}; personally reviewed before learner use.`}]}],decks:[]});
let server, builtServer, builtDirectory, browser, page, current = 'startup';
const checks = [], screenshots = [], errors = [];
const button = name => page.getByRole('button', {name,exact:true});
const heading = name => page.getByRole('heading', {name,exact:true});
const status = text => page.locator('.homeschool-planning [role="status"]').filter({hasText:text});
async function audit(name, target) {
  current = name; await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)<=1,`${name}: body overflow`);
  await page.addScriptTag({content:axe});
  const violations = await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  assert.deepEqual(violations,[],`${name}: accessibility`);
  // Keep whole-document accessibility/overflow assertions above, but frame the named
  // state itself rather than whichever unrelated section an earlier click exposed.
  await target.waitFor({state:'visible'});
  await target.evaluate(element => {
    element.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
    const headerBottom=Math.max(0,document.querySelector('header.topbar')?.getBoundingClientRect().bottom ?? 0);
    const rect=element.getBoundingClientRect();
    const availableHeight=innerHeight-headerBottom-24;
    const desiredTop=headerBottom+12+(element.tagName==='ARTICLE'?Math.max(0,(availableHeight-rect.height)/2):0);
    let scroller=element.parentElement;
    while(scroller && !(scroller.scrollHeight>scroller.clientHeight && /auto|scroll/.test(getComputedStyle(scroller).overflowY)))scroller=scroller.parentElement;
    const adjustment=rect.top-desiredTop;
    if(scroller)scroller.scrollTop+=adjustment;
    else window.scrollBy({top:adjustment,behavior:'instant'});
  });
  const visible=await target.evaluate(element=>{
    const rect=element.getBoundingClientRect();
    const headerBottom=Math.max(0,document.querySelector('header.topbar')?.getBoundingClientRect().bottom ?? 0);
    return {top:rect.top,headerBottom,visibleHeight:Math.min(rect.bottom,innerHeight)-Math.max(rect.top,headerBottom)};
  });
  assert(visible.top>=visible.headerBottom && visible.visibleHeight>0,`${name}: named state is visible below the actual header (${JSON.stringify(visible)})`);
  const file=name+'.png'; await page.screenshot({path:path.join(out,file),fullPage:false}); screenshots.push(file);
}
async function unlockParent() {
  await heading('Parent area').waitFor();
  if (await page.getByLabel('Parent password',{exact:true}).count()) { await page.getByLabel('Parent password',{exact:true}).fill(password); await button('Open').click(); }
}
const label=name=>page.getByLabel(name,{exact:true});
async function parent(tab='Homeschool planning') {await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Family',exact:true}).click();await unlockParent();await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:tab,exact:true}).click();}
async function records(id){return page.evaluate(async id=>(await import('/src/lib/records.ts')).loadRecords(id),id);}
async function family(){return page.evaluate(async()=>(await import('/src/lib/family.ts')).loadFamily());}
async function progress(id){return page.evaluate(async id=>JSON.parse(await(await import('/src/lib/storage.ts')).loadState(`progress-${id}`)),id);}
async function library(){await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Library',exact:true}).click();await heading('Library').waitFor();}
async function selectReloadedLearner(name) { await heading("Who's learning?").waitFor(); await page.locator('.who-card').filter({hasText:name}).click(); }
async function downloadedReview(){await page.getByText('Review an already downloaded course offline',{exact:true}).click();await button('Review downloaded: Synthetic community science').click();await heading('Reviewing Synthetic community science for Synthetic Alice').waitFor();}
async function approve(){await page.getByLabel(/I reviewed this exact source/).check();await button('Approve this version and assign').click();await page.getByRole('status').filter({hasText:'Reviewed version assigned.'}).waitFor();}
async function seed(){return page.evaluate(async password=>{
 const store=await import('/src/lib/storage.ts'),{createFamily}=await import('/src/lib/family.ts'),{emptyCourse}=await import('/src/lib/course.ts'),r=await import('/src/lib/records.ts');
 const {family}=await createFamily({mode:'homeschool',state:'',route:'Synthetic state-neutral plan',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password,students:[{name:'Synthetic Alice',grade:10},{name:'Synthetic Bob',grade:9}]});
 const course={...emptyCourse('Synthetic community science'),id:'community-synthetic-plan',community:{id:'synthetic-plan',version:1,review:'not_reviewed',author:'Synthetic author'},modules:[{id:'unit',title:'Synthetic unit'}],lessons:[{id:'lesson',module:'unit',title:'Synthetic reviewed lesson',body:'This exact synthetic lesson is available after personal parent review.'}]};
 await store.saveCourse(course);for(const s of family.students)await store.updateProfileProgress(s.id,()=>({...store.emptyProgress(),catalogV1:true,enrolled:[]}));
 await r.saveRecords(family.students[0].id,{...r.emptyRecords(),documents:[{id:'evidence',fileId:'synthetic-paper',name:'Synthetic portfolio note',mime:'text/plain',bytes:1,kind:'Other',date:'2026-10-30',note:'Synthetic reference only'}]});
 return {alice:family.students[0].id,bob:family.students[1].id,courseId:course.id};
},password);}
try {
 server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify('1'),'import.meta.env.VITE_AS_DESKTOP':JSON.stringify(''),'import.meta.env.VITE_COURSES_URL':JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify(communityOrigin)},logLevel:'warn'});
 await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
 for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}]) {
  const prefix=`${theme}-${width}`;current=prefix+'-setup';const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  let remoteVersion=1;const remoteRequests=[],unexpectedRemote=[];
  await context.route('**/*',route=>{
    const request=route.request(),u=new URL(request.url());
    if(u.origin===communityOrigin){
      remoteRequests.push({method:request.method(),path:u.pathname,cookie:request.headers().cookie??'',authorization:request.headers().authorization??''});
      if(request.method()!=='GET'||!['/catalog','/courses/'+remoteEntry.id].includes(u.pathname)){unexpectedRemote.push(`${request.method()} ${u.pathname}`);return route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({error:'Synthetic fixture forbids identity and mutation APIs.'})});}
      const entry={...remoteEntry,version:remoteVersion};
      return route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(u.pathname==='/catalog'?{courses:[entry]}:{...entry,doc:remoteDocument(remoteVersion)})});
    }
    return u.origin===origin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();
  });
  page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));page.on('dialog',dialog=>dialog.accept());
  await page.goto(origin+'/parent/planning');await heading('Parent homeschool planning').waitFor();await button('Set up Family or Classroom').waitFor();await audit(prefix+'-no-family',heading('Parent homeschool planning'));assert.equal(await family(),null);
  await button('Browse courses').click();await heading('Library').waitFor();const ids=await seed();await page.reload();await heading("Who's learning?").waitFor();await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await heading('Library').waitFor();
  await parent();await heading('Parent homeschool planning').waitFor();await button('Add subject placement').waitFor();await audit(prefix+'-empty',heading('Parent homeschool planning'));
  current=prefix+'-placement';await button('Add subject placement').click();await label('Placement subject').fill('Math');await label('Subject level').fill('Introductory algebra');await label('Placement rationale').fill('Synthetic parent observation, independent of overall grade.');await button('Save placement').focus();await page.keyboard.press('Enter');await heading('Math: Introductory algebra').waitFor();
  await button('Edit placement: Math').click();await label('Subject level').fill('Canceled level');await button('Cancel planning changes').click();assert.equal((await records(ids.alice)).planning.placements[0].level,'Introductory algebra');
  current=prefix+'-four-year';
  for(const grade of [9,10,11,12]){await button(`Plan Grade ${grade} course`).click();await label('Planned course title').fill(`Synthetic Grade ${grade} science`);await label('Plan subject').fill('Science');await label('Plan school year').fill(String(2026+grade-9));await label('Projected credits').fill('1');await label('Course planning notes').fill('Planning only; no earned credit.');if(grade===9)await label('Synthetic portfolio note').check();await button('Save planned course').click();await button(`Edit planned course: Synthetic Grade ${grade} science`).waitFor();}
  assert.equal((await records(ids.alice)).planning.courses.length,4);assert.equal((await records(ids.alice)).academic,undefined);await audit(prefix+'-four-year',heading('Four-year high-school plan'));
  await button('Add material').click();await label('Material title').fill('Synthetic notebook');await label('Material course').selectOption({label:'Synthetic Grade 9 science'});await label('Quantity').fill('2');await button('Save material').click();await button('Mark ready: Synthetic notebook').click();await button('Mark needed: Synthetic notebook').waitFor();assert.equal((await records(ids.alice)).planning.materials[0].ready,true);
  await button('Add field trip').click();await label('Field trip title').fill('Synthetic museum visit');await label('Trip date').fill('2026-11-05');await label('Trip location').fill('Synthetic local museum');await label('Trip subject').fill('Science');await label('Synthetic portfolio note').check();await label('Trip notes').fill('<img src=x onerror="window.injected=1">');await audit(prefix+'-trip-editor',heading('Edit field trip'));await button('Save field trip').click();await heading('Synthetic museum visit').waitFor();assert.equal(await page.evaluate(()=>window.injected),undefined);
  await button('Edit field trip: Synthetic museum visit').click();await label('Trip status').selectOption('completed');await button('Save field trip').click();await heading('Synthetic museum visit').waitFor();assert.equal((await records(ids.alice)).manual.length,0);assert.deepEqual((await records(ids.alice)).days,{});await audit(prefix+'-materials-trips',heading('Field trips and portfolio'));
  await button('Remove field trip: Synthetic museum visit').click();await button('Cancel removal').click();assert.equal((await records(ids.alice)).planning.trips.length,1);
  await label('View school year').selectOption('2026');await button('Remove planned course: Synthetic Grade 9 science').click();await button('Confirm planning removal').click();await status('Planning note removed').waitFor();assert.equal((await records(ids.alice)).planning.materials[0].coursePlanId,'');assert.equal((await records(ids.alice)).documents.length,1);
  current=prefix+'-isolation';await label('Student').selectOption(ids.bob);await button('Add subject placement').waitFor();assert.equal(await heading('Math: Introductory algebra').count(),0);assert.equal((await records(ids.bob)).planning,undefined);await label('Student').selectOption(ids.alice);await heading('Math: Introductory algebra').waitFor();
  current=prefix+'-conflict';await button('Edit placement: Math').click();await label('Subject level').fill('Stale planning draft');await page.evaluate(async id=>{const r=await import('/src/lib/records.ts');await r.updateRecordsAtomic(id,x=>({...x,manual:[...x.manual,{id:'other',date:'2026-10-30',minutes:3,subject:'Math',note:'Concurrent writer'}]}));},ids.alice);await button('Save placement').click();await page.getByRole('alert').filter({hasText:/changed|conflict|reload/i}).waitFor();assert.equal(await label('Subject level').inputValue(),'Stale planning draft');assert.equal((await records(ids.alice)).manual.length,1);await audit(prefix+'-conflict',page.getByRole('alert').filter({hasText:/changed|conflict|reload/i}));await button('Cancel planning changes').click();await button('Reload records').click();await heading('Math: Introductory algebra').waitFor();
  current=prefix+'-offline-history';await context.setOffline(true);await button('Add material').click();await label('Material title').fill('Offline pencils');await button('Save material').click();await heading('Offline pencils').waitFor();await context.setOffline(false);await library();await page.goBack();await unlockParent();await heading('Parent homeschool planning').waitFor();await heading('Offline pencils').waitFor();await page.goForward();await heading('Library').waitFor();await parent();await page.reload();await unlockParent();await heading('Offline pencils').waitFor();assert.equal(new URL(page.url()).pathname,'/parent/planning');
  current=prefix+'-community-review';await button('Review and assign courses').click();await heading('Review community courses for a learner').waitFor();const priorProgress=await progress(ids.alice);await downloadedReview();assert.equal(await button('Approve this version and assign').isEnabled(),false);await page.getByRole('region',{name:'Readable private course preview',exact:true}).getByText('Lessons (1)',{exact:true}).click();await page.getByRole('region',{name:'Readable private course preview',exact:true}).getByText('This exact synthetic lesson is available after personal parent review.',{exact:true}).waitFor();await page.getByText('Inspect full course content and resources',{exact:true}).click();await page.locator('pre:visible').filter({hasText:'This exact synthetic lesson is available'}).first().waitFor();await audit(prefix+'-community-preview',heading('Reviewing Synthetic community science for Synthetic Alice'));await button('Cancel review').click();assert.deepEqual(await progress(ids.alice),priorProgress);assert.equal((await family()).students[0].assigned.length,0);
  await downloadedReview();await context.setOffline(true);await approve();await context.setOffline(false);assert.equal((await family()).students[0].assigned[0].communityReview.version,1);assert.equal((await family()).students[1].assigned.length,0);assert.deepEqual(await progress(ids.alice),priorProgress);
  await downloadedReview();await approve();assert.equal((await family()).students[0].assigned.length,1,'Repeat approval updates rather than duplicates');
  await library();const assigned=page.locator('.assigned-row').filter({hasText:'Synthetic community science'});await assigned.getByRole('button',{name:/Start|Open/,exact:true}).click();await heading('Synthetic community science').waitFor();await page.locator('.lesson-row').getByRole('button',{name:/Synthetic reviewed lesson/}).click();await heading('Synthetic reviewed lesson').waitFor();await page.getByText('This exact synthetic lesson is available after personal parent review.',{exact:true}).waitFor();await audit(prefix+'-learner-lesson',heading('Synthetic reviewed lesson'));
  const lessonUrl=page.url();await button('Student: Synthetic Alice. Switch student').click();await heading("Who's learning?").waitFor();await page.locator('.who-card').filter({hasText:'Synthetic Bob'}).click();await heading('Library').waitFor();await page.goto(lessonUrl);await selectReloadedLearner('Synthetic Bob');await page.getByText(/Parent review required for this exact community version/).first().waitFor();assert.equal(await page.getByText('This exact synthetic lesson is available after personal parent review.',{exact:true}).count(),0,'Alice approval cannot authorize Bob');await button('Student: Synthetic Bob. Switch student').click();await heading("Who's learning?").waitFor();await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await heading('Library').waitFor();await page.goto(lessonUrl);await selectReloadedLearner('Synthetic Alice');await heading('Synthetic reviewed lesson').waitFor();
  current=prefix+'-version-change';await page.evaluate(async id=>{const s=await import('/src/lib/storage.ts');const c=(await s.listCourses()).courses.find(c=>c.id===id);if(!c)throw Error('Synthetic course missing');await s.saveCourse({...c,community:{...c.community,version:2},lessons:c.lessons.map(l=>({...l,body:'Changed synthetic version requires a new review.'}))});},ids.courseId);await page.reload();await selectReloadedLearner('Synthetic Alice');await page.getByText(/Parent review required for this exact community version/).first().waitFor();assert.equal(await page.getByText('Changed synthetic version requires a new review.',{exact:true}).count(),0,'Unreviewed new content not shown');await audit(prefix+'-new-version-blocked',page.getByText(/Parent review required for this exact community version/).first());
  await parent('Courses');await downloadedReview();await approve();assert.equal((await family()).students[0].assigned[0].communityReview.version,2);const beforeRevoke=await progress(ids.alice);await page.locator('.assign-list li').filter({hasText:'Synthetic community science'}).getByRole('button',{name:/Remove/}).click();assert.equal((await family()).students[0].assigned.length,0);assert.deepEqual(await progress(ids.alice),beforeRevoke,'Revocation preserves progress');await library();assert.equal(await page.locator('.assigned-row').filter({hasText:'Synthetic community science'}).count(),0);await page.goto(lessonUrl);await selectReloadedLearner('Synthetic Alice');await page.getByText(/Parent review required for this exact community version/).first().waitFor();assert.equal(await page.getByText('Changed synthetic version requires a new review.',{exact:true}).count(),0,'Revoked approval blocks deep-linked content');await audit(prefix+'-revoked',page.getByText(/Parent review required for this exact community version/).first());
  current=prefix+'-remote-preview';await parent('Courses');
  const remoteId='community-'+remoteEntry.id;
  const remoteStored=()=>page.evaluate(async id=>(await import('/src/lib/storage.ts')).loadStoredCourseSnapshot(id),remoteId);
  const priorRemoteFamily=await family(),priorRemoteProgress=await progress(ids.alice);
  await page.getByRole('link',{name:'View course: '+remoteEntry.title,exact:true}).click();await heading(remoteEntry.title).waitFor();
  assert.equal(await remoteStored(),null,'Remote catalogue/detail is discovery, not installation');
  await button('Load full private review').click();await heading('Reviewing Synthetic remote science for Synthetic Alice').waitFor();
  await page.getByRole('region',{name:'Readable private course preview',exact:true}).getByText('Lessons (1)',{exact:true}).click();
  await page.getByRole('region',{name:'Readable private course preview',exact:true}).getByText('Synthetic remote source version 1; personally reviewed before learner use.',{exact:true}).waitFor();
  assert.equal(await remoteStored(),null,'Full private preview must not install downloaded source');assert.deepEqual(await family(),priorRemoteFamily);assert.deepEqual(await progress(ids.alice),priorRemoteProgress);
  await audit(prefix+'-remote-private-preview',heading('Reviewing Synthetic remote science for Synthetic Alice'));
  remoteVersion=2;await page.getByLabel(/I reviewed this exact source/).check();await button('Approve this version and assign').click();
  await page.getByRole('alert').filter({hasText:'Published version changed during review.'}).waitFor();
  assert.equal(await remoteStored(),null,'Changed remote version rejected before source installation');assert.deepEqual(await family(),priorRemoteFamily);assert.deepEqual(await progress(ids.alice),priorRemoteProgress);
  assert.equal(await button('Approve this version and assign').isEnabled(),false,'Failed preview cannot be blindly resubmitted');
  await audit(prefix+'-remote-version-conflict',page.getByRole('alert').filter({hasText:'Published version changed during review.'}));
  await button('Cancel review').click();await button('Load full private review').click();await heading('Reviewing Synthetic remote science for Synthetic Alice').waitFor();
  await page.getByRole('region',{name:'Readable private course preview',exact:true}).getByText('Lessons (1)',{exact:true}).click();
  await page.getByRole('region',{name:'Readable private course preview',exact:true}).getByText('Synthetic remote source version 2; personally reviewed before learner use.',{exact:true}).waitFor();
  assert.equal(await remoteStored(),null);await approve();assert.equal((await remoteStored()).course.community.version,2);
  const remoteAssignment=(await family()).students[0].assigned.find(a=>a.courseId===remoteId);assert.equal(remoteAssignment.communityReview.version,2);assert.deepEqual(await progress(ids.alice),priorRemoteProgress,'Remote approval does not enroll or modify progress');
  assert.equal((await family()).students[1].assigned.some(a=>a.courseId===remoteId),false);
  await library();await page.locator('.assigned-row').filter({hasText:remoteEntry.title}).getByRole('button',{name:'Start',exact:true}).click();await heading(remoteEntry.title).waitFor();
  assert((await progress(ids.alice)).enrolled.includes(remoteId),'Explicit learner Start enrolls the reviewed source');
  await page.locator('.lesson-row').getByRole('button',{name:/Synthetic remote reviewed lesson/}).click();await heading('Synthetic remote reviewed lesson').waitFor();await page.getByText('Synthetic remote source version 2; personally reviewed before learner use.',{exact:true}).waitFor();await audit(prefix+'-remote-learner-content',heading('Synthetic remote reviewed lesson'));
  // A separate local writer replaces bytes after preview. The approval CAS must not overwrite it.
  current=prefix+'-remote-local-cas';await parent('Courses');await page.getByRole('link',{name:'View course: '+remoteEntry.title,exact:true}).click();await heading(remoteEntry.title).waitFor();await button('Load full private review').click();await heading('Reviewing Synthetic remote science for Synthetic Alice').waitFor();
  const beforeLocalConflictFamily=await family(),beforeLocalConflictProgress=await progress(ids.alice);
  await page.evaluate(async id=>{const s=await import('/src/lib/storage.ts');const snap=await s.loadStoredCourseSnapshot(id);await s.saveCourse({...snap.course,community:{...snap.course.community,version:3},lessons:snap.course.lessons.map(l=>({...l,body:'Synthetic concurrent local source must be preserved.'}))});},remoteId);
  const changedLocal=await remoteStored();await page.getByLabel(/I reviewed this exact source/).check();await button('Approve this version and assign').click();
  await page.getByRole('alert').filter({hasText:'Installed source changed during review.'}).waitFor();assert.deepEqual(await remoteStored(),changedLocal,'CAS rejection preserves concurrent local course bytes');assert.deepEqual(await family(),beforeLocalConflictFamily);assert.deepEqual(await progress(ids.alice),beforeLocalConflictProgress);
  await audit(prefix+'-remote-local-conflict',page.getByRole('alert').filter({hasText:'Installed source changed during review.'}));await button('Cancel review').click();
  assert.deepEqual(unexpectedRemote,[],'Only anonymous synthetic public GET endpoints were used');assert(remoteRequests.filter(r=>r.path==='/courses/'+remoteEntry.id).length>=6,'Preview and approval revalidate the synthetic remote source');assert(remoteRequests.every(r=>!r.cookie&&!r.authorization),'Personal review never calls publishing identity APIs');
  checks.push({width,theme,workflow:'parent gate; placement/year/fouryear/material/trip CRUD; portfolio; cancel; CAS error; offline/reload/history; crossprofile; exact community review/cancel/repeat/assignment; learner content; changed version blocked/reviewed; revocation preserves progress; synthetic remote catalogue/detail/read-only preview; changed published source rejection; fresh source approval and explicit learner use; concurrent local CAS rejection'});await context.close();
 }
  // The public web build intentionally does not expose local-family management.
  // Exercise emitted production assets, not the HOMESCHOOL-enabled source server.
  current='public-build';
  builtDirectory=await mkdtemp(path.join(tmpdir(),'erudior-parent-planning-entry-'));
  await build({root,configFile:false,plugins:[react()],resolve:{alias:[{find:'./bundledCourses',replacement:path.join(root,'src/lib/bundledCourses.remote.ts')}]},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify(''),'import.meta.env.VITE_AS_DESKTOP':JSON.stringify(''),'import.meta.env.VITE_COURSES_URL':JSON.stringify('https://courses.synthetic.invalid/v1/'),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('')},worker:{format:'es'},build:{outDir:builtDirectory,emptyOutDir:true,target:'es2021'},logLevel:'warn'});
  builtServer=await serveBuild({root,configFile:false,build:{outDir:builtDirectory},preview:{host:'127.0.0.1',port:0},logLevel:'warn'});
  const publicOrigin=`http://127.0.0.1:${builtServer.httpServer.address().port}`;
  for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}])for(const guest of [false,true]) {
    current=`public-${theme}-${width}-${guest?'guest':'saved'}-no-family`;
    const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
    const sourceRequests=[];
    await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.pathname.startsWith('/src/')||u.pathname.startsWith('/@vite/'))sourceRequests.push(u.pathname);return u.origin===publicOrigin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
    page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));
    const target=publicOrigin+'/parent/planning'+(guest?'?guest=1':'');
    // storage.ts delegates named records to webstore.ts: DB erudior, store kv, erudior.* keys.
    const noRecords=async()=>{
      const keys=await page.evaluate(async()=>{
        const databases=await indexedDB.databases();if(!databases.some(db=>db.name==='erudior'))return [];
        return new Promise((resolve,reject)=>{const open=indexedDB.open('erudior');open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result;const tx=db.transaction('kv','readonly');const req=tx.objectStore('kv').getAllKeys();req.onsuccess=()=>resolve(req.result.filter(key=>typeof key==='string'&&(key==='erudior.family'||key.startsWith('erudior.records-'))));req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();};});
      });
      assert.deepEqual(keys,[],'Visiting the public entry never creates family or academic records');
    };
    const assertPublicEntry=async()=>{
      await heading('Parent homeschool planning').waitFor();
      await page.getByText('Parent homeschool planning is available in the local app with a configured Family workspace.',{exact:false}).waitFor();
      await page.getByText('This academic planning update ships with the next app version.',{exact:false}).waitFor();
      const downloadUrl=new URL(await page.getByRole('link',{name:'Download app',exact:true}).getAttribute('href'),publicOrigin);
      assert.equal(downloadUrl.origin,publicOrigin);assert.equal(downloadUrl.pathname,'/download');assert(downloadUrl.searchParams.has('site'),'Local deployment link selects the public site');
      assert.equal(await button('Set up Family or Classroom').count(),0);
      assert.equal(await button('Add subject placement').count(),0);
      assert.equal(await page.getByLabel('Parent password',{exact:true}).count(),0);
      assert.equal(new URL(page.url()).pathname,'/parent/planning');
      if(guest)await page.getByText('This temporary guest session cannot create or open a persistent learner workspace.',{exact:false}).waitFor();
      await noRecords();
    };
    await page.goto(target);await assertPublicEntry();await audit(current,heading('Parent homeschool planning'));
    await page.reload();await assertPublicEntry();
    await button('Browse courses').click();await heading('Library').waitFor();
    await page.goBack();await assertPublicEntry();await page.goForward();await heading('Library').waitFor();
    if(guest)assert.equal(new URL(page.url()).searchParams.get('guest'),'1','Guest mode survives the exit and history traversal');
    await noRecords();assert.deepEqual(sourceRequests,[],'Production acceptance uses emitted assets rather than Vite source modules');
    checks.push({width,theme,guest,workflow:'served production build; explicit unsupported academic entry; no family/records authority; reload; Browse courses; Back/Forward; guest isolation'});
    await context.close();
  }
  assert.deepEqual(errors,[],'No browser runtime errors');await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,data:'synthetic isolated local learners',externalNetwork:'blocked',checks,screenshots,errors},null,2));console.log('Homeschool planning browser acceptance passed.');
 } catch(error) {
  const diagnostic = page ? await page.evaluate(() => ({
    url: location.href, title: document.title,
    headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(n=>n.textContent),
    controls: [...document.querySelectorAll('button,input,select,textarea')].map(n=>({tag:n.tagName,type:n.getAttribute('type'),ariaLabel:n.getAttribute('aria-label'),label:n.closest('label')?.textContent?.slice(0,200),text:n.tagName==='BUTTON'?n.textContent?.slice(0,200):undefined,disabled:n.disabled})),
    notices: [...document.querySelectorAll('[role=alert],[role=status]')].map(n=>n.textContent?.slice(0,1000)),
  })).catch(e=>({unavailable:String(e)})) : null;
  await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,screenshots,errors,diagnostic},null,2));
  if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw error;
}
finally {await browser?.close();await server?.close();await new Promise(resolve=>builtServer?.httpServer?builtServer.httpServer.close(resolve):resolve());if(builtDirectory)await rm(builtDirectory,{recursive:true,force:true});}
