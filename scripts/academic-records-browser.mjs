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
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'academic-records-browser');
await mkdir(out, { recursive: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const password = 'Synthetic academic test password 2026';
let server, builtServer, builtDirectory, browser, page, current = 'startup';
const checks = [], screenshots = [], errors = [];
const button = name => page.getByRole('button', {name,exact:true});
const heading = name => page.getByRole('heading', {name,exact:true});
const claim = name => page.getByRole('article', {name:`Credit: ${name}`,exact:true});
const status = text => page.locator('.academic-records [role="status"]').filter({hasText:text});
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
async function openRecords() {
  await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Family',exact:true}).click();
  await unlockParent();
  await page.getByRole('navigation',{name:'Parent sections',exact:true}).getByRole('button',{name:'Academic records',exact:true}).click();
  await heading('Academic records and portability').waitFor(); await button('Edit planning policy').waitFor();
}
async function records(id) { return page.evaluate(async id=>(await import('/src/lib/records.ts')).loadRecords(id),id); }
async function addCredit(title,date='2025-05-20') {
  await button('Add transfer or local credit').click();
  await page.getByLabel('Credit title',{exact:true}).fill(title); await page.getByLabel('Credit subject',{exact:true}).fill('Science');
  await page.getByLabel('Completion date',{exact:true}).fill(date); await page.getByLabel('Planning credits',{exact:true}).fill('1');
  await page.getByLabel('Evidence reference',{exact:true}).fill('Synthetic paper portfolio; not institution verified');
  await page.getByLabel('Correction or review note',{exact:true}).fill('<img src=x onerror="window.injected=1"> synthetic statement');
  await page.getByLabel(/I reviewed this statement/).check(); await button('Save credit statement').focus(); await page.keyboard.press('Enter');
  await claim(title).waitFor(); await heading('Review credit statement').waitFor({state:'detached'});
}
try {
  server = await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify('1'),'import.meta.env.VITE_AS_DESKTOP':JSON.stringify(''),'import.meta.env.VITE_COURSES_URL':JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('')},logLevel:'warn'});
  await server.listen(); const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
  for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}]) {
    current=`${theme}-${width}`; const prefix=current;
    const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce',acceptDownloads:true});
    await context.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===origin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
    page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));page.on('dialog',dialog=>dialog.accept());
    current=prefix+'-no-family-supported';
    await page.goto(origin+'/parent/academic-records');await heading('Academic records and portability').waitFor();
    await button('Set up Family or Classroom').waitFor();assert.equal(await button('Edit planning policy').count(),0);
    assert.equal(await page.evaluate(async()=>(await import('/src/lib/storage.ts')).loadState('family')),null);
    await audit(prefix+'-no-family-supported',heading('Academic records and portability'));
    await button('Set up Family or Classroom').click();await heading('Set up homeschool or a classroom').waitFor();
    assert.equal(await page.evaluate(async()=>(await import('/src/lib/storage.ts')).loadState('family')),null,'Opening setup does not create a family');
    await button('← Library').click();await heading('Library').waitFor();
    await page.goto(origin+'/parent/academic-records');await heading('Academic records and portability').waitFor();await page.reload();await heading('Academic records and portability').waitFor();
    await button('Browse courses').click();await heading('Library').waitFor();await page.goBack();await heading('Academic records and portability').waitFor();
    await button('Browse courses').click();await heading('Library').waitFor();
    const ids=await page.evaluate(async password=>{
      const store=await import('/src/lib/storage.ts');const {createFamily}=await import('/src/lib/family.ts');
      const {family}=await createFamily({mode:'homeschool',state:'',route:'Synthetic state-neutral plan',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password,students:[{name:'Synthetic Alice',grade:10},{name:'Synthetic Bob',grade:9}]});
      for(const s of family.students)await store.updateProfileProgress(s.id,()=>({...store.emptyProgress(),catalogV1:true,enrolled:[]}));
      return {alice:family.students[0].id,bob:family.students[1].id};
    },password);
    await page.reload();await heading("Who's learning?").waitFor();await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await heading('Library').waitFor();
    await openRecords();await audit(prefix+'-empty',heading('Academic records and portability'));
    await button('Edit planning policy').click();await page.getByLabel('Policy name',{exact:true}).fill('Synthetic graduation goals');await page.getByLabel('Total credits required',{exact:true}).fill('2');
    await button('Add subject requirement').click();await page.getByLabel('Subject',{exact:true}).fill('Science');await page.getByLabel('Required credits',{exact:true}).fill('2');
    await audit(prefix+'-policy-editor',page.getByRole('group',{name:'Subject requirement 1',exact:true}));await button('Save planning policy').click();await status('Planning policy saved.').waitFor();
    await button('Edit planning policy').click();await page.getByLabel('Policy name',{exact:true}).fill('Canceled change');await button('Cancel policy changes').click();assert.equal((await records(ids.alice)).academic.policy.name,'Synthetic graduation goals');
    await addCredit('Synthetic transfer');await claim('Synthetic transfer').getByText(/Counted for this local plan/).waitFor();assert.equal(await page.evaluate(()=>window.injected),undefined);
    await button('Review or correct Synthetic transfer').click();await page.getByLabel('Planning credits',{exact:true}).fill('2');await button('Save credit statement').click();await heading('Review credit statement').waitFor({state:'detached'});
    assert.equal((await records(ids.alice)).academic.claims.length,1);assert.equal((await records(ids.alice)).academic.claims[0].credits,2);await audit(prefix+'-credit-audit',claim('Synthetic transfer'));
    await button('Review or correct Synthetic transfer').click();await page.getByLabel('Credit title',{exact:true}).fill('Canceled title');await button('Cancel credit changes').click();await claim('Synthetic transfer').waitFor();
    await button('Remove planning entry Synthetic transfer').click();await button('Cancel removal').click();assert.equal((await records(ids.alice)).academic.claims.length,1);
    await button('Preview records export').click();await heading('Export preview').waitFor();await audit(prefix+'-export-preview',heading('Export preview'));await button('Cancel export').click();
    await button('Preview records export').click();const dl=page.waitForEvent('download');await button('Save private records export').click();const download=await dl;const file=path.join(out,prefix+'-records.json');await download.saveAs(file);const exported=JSON.parse(await readFile(file,'utf8'));assert.equal(exported.format,'erudior-academic-planning');assert(!JSON.stringify(exported).includes(ids.alice));
    current=prefix+'-switch-import-target';
    await page.getByLabel('Student',{exact:true}).selectOption(ids.bob);await button('Edit planning policy').waitFor();assert.equal(await claim('Synthetic transfer').count(),0);
    await page.getByLabel('Choose academic records file',{exact:true}).setInputFiles(file);await heading('Review import before saving').waitFor();await audit(prefix+'-import-preview',heading('Review import before saving'));await button('Cancel import').click();assert.equal((await records(ids.bob)).academic,undefined);
    current=prefix+'-import-unverified';
    await page.getByLabel('Choose academic records file',{exact:true}).setInputFiles(file);await button('Import unverified statements').click();await claim('Synthetic transfer').getByText(/Needs parent review/).waitFor();const imported=(await records(ids.bob)).academic;assert.equal(imported.claims[0].reviewed,false);assert.equal(imported.claims[0].origin,'imported');assert.equal(imported.policy.totalCredits,0);
    await page.getByLabel('Choose academic records file',{exact:true}).setInputFiles(file);await button('Import unverified statements').click();await status(/already been imported/).waitFor();assert.equal((await records(ids.bob)).academic.claims.length,1);await button('Cancel import').click();
    await page.getByLabel('Choose academic records file',{exact:true}).setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{broken')});await status(/JSON|property|Unexpected/).waitFor();
    await page.getByLabel('Choose academic records file',{exact:true}).setInputFiles({name:'oversized.json',mimeType:'application/json',buffer:Buffer.alloc(2*1024*1024+1,32)});await status(/exceeds 2 MiB/).waitFor();await audit(prefix+'-import-error',status(/exceeds 2 MiB/));
    current=prefix+'-review-import';
    await button('Review or correct Synthetic transfer').click();await page.getByLabel(/I reviewed this statement/).check();await button('Save credit statement').click();await claim('Synthetic transfer').getByText(/Counted for this local plan/).waitFor();assert.match((await records(ids.bob)).academic.claims[0].provenance,/Unverified import/);
    await page.getByLabel('Remove planning entries before',{exact:true}).fill('2026-01-01');await button('Preview local cleanup').click();await audit(prefix+'-cleanup-preview',page.locator('.notice').filter({has:button('Confirm local cleanup')}));await button('Cancel cleanup').click();assert.equal((await records(ids.bob)).academic.claims.length,1);
    await button('Preview local cleanup').click();await button('Confirm local cleanup').click();await status(/Selected local planning entries removed/).waitFor();assert.equal((await records(ids.bob)).academic.claims.length,0);assert.equal((await records(ids.bob)).academic.imports.length,1);
    current=prefix+'-stale-editor';
    await page.getByLabel('Student',{exact:true}).selectOption(ids.alice);await claim('Synthetic transfer').waitFor();
    await button('Review or correct Synthetic transfer').click();await page.getByLabel('Correction or review note',{exact:true}).fill('Stale draft');
    await page.evaluate(async id=>{const r=await import('/src/lib/records.ts');await r.updateRecordsAtomic(id,current=>({...current,manual:[...current.manual,{id:'concurrent',date:'2026-10-30',minutes:3,subject:'Science',note:'Other writer'}]}));},ids.alice);
    await button('Save credit statement').click();await page.getByRole('alert').filter({hasText:/changed|conflict|reload/i}).waitFor();assert.equal(await page.getByLabel('Correction or review note',{exact:true}).inputValue(),'Stale draft');assert.equal((await records(ids.alice)).manual.length,1);await audit(prefix+'-conflict',page.getByRole('alert').filter({hasText:/changed|conflict|reload/i}));
    await button('Cancel credit changes').click();await button('Reload records').click();await claim('Synthetic transfer').waitFor();
    current=prefix+'-offline-and-history';
    await context.setOffline(true);await addCredit('Offline synthetic credit','2026-10-30');await context.setOffline(false);
    await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Courses',exact:true}).click();await heading('Courses').waitFor();await page.goBack();await unlockParent();await heading('Academic records and portability').waitFor();await page.goForward();await heading('Courses').waitFor();await openRecords();await claim('Offline synthetic credit').waitFor();
    current=prefix+'-route-reload';assert.equal(new URL(page.url()).pathname,'/parent/academic-records');
    await page.reload();await unlockParent();await heading('Academic records and portability').waitFor();await claim('Offline synthetic credit').waitFor();
    current=prefix+'-delayed-import';
    // A delayed file read cannot leak a previous learner's import into a new profile.
    await page.evaluate(()=>{window.originalFileText=File.prototype.text;File.prototype.text=function(){return new Promise(resolve=>{window.releaseAcademicFile=()=>window.originalFileText.call(this).then(resolve);});};});
    await page.getByLabel('Choose academic records file',{exact:true}).setInputFiles(file);await page.waitForFunction(()=>typeof window.releaseAcademicFile==='function');await page.getByLabel('Student',{exact:true}).selectOption(ids.bob);assert.equal(await page.getByLabel('Student',{exact:true}).inputValue(),ids.alice);await page.evaluate(()=>{window.releaseAcademicFile();File.prototype.text=window.originalFileText;});await button('Edit planning policy').waitFor();await page.waitForFunction(()=>!document.querySelector('.academic-records input[type=file]').disabled);await heading('Review import before saving').waitFor();await button('Cancel import').click();await page.getByLabel('Student',{exact:true}).selectOption(ids.bob);await button('Edit planning policy').waitFor();
    // Preserve malformed storage in place; user can download a recovery copy and retry.
    await page.evaluate(async id=>(await import('/src/lib/storage.ts')).saveState(`records-${id}`,'{damaged-synthetic-records'),ids.bob);
    await page.getByLabel('Student',{exact:true}).selectOption(ids.alice);await claim('Synthetic transfer').waitFor();await page.getByLabel('Student',{exact:true}).selectOption(ids.bob);await page.getByRole('alert').filter({hasText:/quarantin|damaged|invalid/i}).waitFor();await audit(prefix+'-quarantine',page.getByRole('alert').filter({hasText:/quarantin|damaged|invalid/i}));
    const recoveryDownload=page.waitForEvent('download');await button('Download stored recovery copy').click();const recovery=await recoveryDownload;const recoveryPath=path.join(out,prefix+'-recovery.json');await recovery.saveAs(recoveryPath);assert.equal(await readFile(recoveryPath,'utf8'),'{damaged-synthetic-records');
    assert.equal(await page.evaluate(async id=>(await import('/src/lib/storage.ts')).loadState(`records-${id}`),ids.bob),'{damaged-synthetic-records');
    checks.push({width,theme,workflow:'real adult gate; policy/credit CRUD; keyboard; export/import/cancel/untrusted/repeat/errors; cleanup; CAS conflict; offline save/reload; history; delayed import profile isolation; malformed quarantine'});await context.close();
  }
  // The public web build intentionally does not expose local-family management.
  // Exercise emitted production assets, not the HOMESCHOOL-enabled source server.
  current='public-build';
  builtDirectory=await mkdtemp(path.join(tmpdir(),'erudior-academic-entry-'));
  await build({root,configFile:false,plugins:[react()],resolve:{alias:[{find:'./bundledCourses',replacement:path.join(root,'src/lib/bundledCourses.remote.ts')}]},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify(''),'import.meta.env.VITE_AS_DESKTOP':JSON.stringify(''),'import.meta.env.VITE_COURSES_URL':JSON.stringify('https://courses.synthetic.invalid/v1/'),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('')},worker:{format:'es'},build:{outDir:builtDirectory,emptyOutDir:true,target:'es2021'},logLevel:'warn'});
  builtServer=await serveBuild({root,configFile:false,build:{outDir:builtDirectory},preview:{host:'127.0.0.1',port:0},logLevel:'warn'});
  const publicOrigin=`http://127.0.0.1:${builtServer.httpServer.address().port}`;
  for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}])for(const guest of [false,true]) {
    current=`public-${theme}-${width}-${guest?'guest':'saved'}-no-family`;
    const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
    const sourceRequests=[];
    await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.pathname.startsWith('/src/')||u.pathname.startsWith('/@vite/'))sourceRequests.push(u.pathname);return u.origin===publicOrigin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
    page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));
    const target=publicOrigin+'/parent/academic-records'+(guest?'?guest=1':'');
    // storage.ts delegates named records to webstore.ts: DB erudior, store kv, erudior.* keys.
    const noRecords=async()=>{
      const keys=await page.evaluate(async()=>{
        const databases=await indexedDB.databases();if(!databases.some(db=>db.name==='erudior'))return [];
        return new Promise((resolve,reject)=>{const open=indexedDB.open('erudior');open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result;const tx=db.transaction('kv','readonly');const req=tx.objectStore('kv').getAllKeys();req.onsuccess=()=>resolve(req.result.filter(key=>typeof key==='string'&&(key==='erudior.family'||key.startsWith('erudior.records-'))));req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();};});
      });
      assert.deepEqual(keys,[],'Visiting the public entry never creates family or academic records');
    };
    const assertPublicEntry=async()=>{
      await heading('Academic records and portability').waitFor();
      await page.getByText('Academic records are available in the local app with a configured Family or Classroom workspace.',{exact:false}).waitFor();
      await page.getByText('This academic planning update ships with the next app version.',{exact:false}).waitFor();
      const downloadUrl=new URL(await page.getByRole('link',{name:'Download app',exact:true}).getAttribute('href'),publicOrigin);
      assert.equal(downloadUrl.origin,publicOrigin);assert.equal(downloadUrl.pathname,'/download');assert(downloadUrl.searchParams.has('site'),'Local deployment link selects the public site');
      assert.equal(await button('Set up Family or Classroom').count(),0);
      assert.equal(await button('Edit planning policy').count(),0);
      assert.equal(await page.getByLabel('Parent password',{exact:true}).count(),0);
      assert.equal(new URL(page.url()).pathname,'/parent/academic-records');
      if(guest)await page.getByText('This temporary guest session cannot create or open a persistent learner workspace.',{exact:false}).waitFor();
      await noRecords();
    };
    await page.goto(target);await assertPublicEntry();await audit(current,heading('Academic records and portability'));
    await page.reload();await assertPublicEntry();
    await button('Browse courses').click();await heading('Library').waitFor();
    await page.goBack();await assertPublicEntry();await page.goForward();await heading('Library').waitFor();
    if(guest)assert.equal(new URL(page.url()).searchParams.get('guest'),'1','Guest mode survives the exit and history traversal');
    await noRecords();assert.deepEqual(sourceRequests,[],'Production acceptance uses emitted assets rather than Vite source modules');
    checks.push({width,theme,guest,workflow:'served production build; explicit unsupported academic entry; no family/records authority; reload; Browse courses; Back/Forward; guest isolation'});
    await context.close();
  }
  assert.deepEqual(errors,[],'No browser runtime errors');await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,data:'synthetic isolated local learners',externalNetwork:'blocked',checks,screenshots,errors},null,2));console.log('Academic records browser acceptance passed.');
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
