// Actual App/IndexedDB acceptance. Only disposable synthetic records; external requests blocked.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'classroom-workflows-browser');
await mkdir(out, {recursive:true});
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const password = 'Synthetic classroom acceptance password 2026';
let server, browser, page, current = 'startup';
const checks = [], screenshots = [], errors = [];
const heading = name => page.getByRole('heading', {name,exact:true});
const button = name => page.getByRole('button', {name,exact:true});
const card = title => page.getByRole('region', {name:title,exact:true});
async function authenticate() {
  const credential = page.getByLabel(/^(PIN|Teacher password)$/).filter({visible:true});
  await credential.first().waitFor();
  const form = credential.first().locator('xpath=ancestor::form[1]');
  const fallback = form.getByRole('button', {name:'Use password instead',exact:true});
  if (await fallback.isVisible()) await fallback.click();
  await form.getByLabel('Teacher password', {exact:true}).fill(password);
  await form.getByRole('button', {name:'Open',exact:true}).click();
}
async function select(name) {
  await heading("Who's learning?").waitFor();
  await page.locator('.who-card').filter({hasText:name}).click();
  await heading('Shared device locked').waitFor();
  await authenticate(); await heading('Library').waitFor();
}
async function settled() {
  const refresh=button('Refresh classroom');
  if(!await refresh.count())return;
  const deadline=Date.now()+15000;
  while(!await refresh.isEnabled()) {if(Date.now()>deadline)throw Error('Classroom save/load did not settle');await new Promise(r=>setTimeout(r,25));}
}
async function switchLearner(name) {
  await settled();
  await page.getByRole('button', {name:/^Student: .*\. Switch student$/}).click();
  await select(name); await openLearner();
}
async function openLearner() {
  await page.getByRole('navigation', {name:'Main',exact:true}).getByRole('button', {name:'Courses',exact:true}).click();
  await button('Open my classroom').click(); await heading('My classroom').waitFor();
}
async function openTeacher() {
  await settled();
  await page.getByRole('navigation', {name:'Main',exact:true}).getByRole('button', {name:'Classroom',exact:true}).click();
  await authenticate();
  await page.getByRole('navigation', {name:'Teacher sections',exact:true}).getByRole('button', {name:'Class collaboration',exact:true}).click();
  await heading('Class collaboration').waitFor();
}
async function audit(name, target = page.locator('main').first()) {
  current = name; await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth) <= 1, `${name}: no page overflow`);
  await page.addScriptTag({content:axe});
  const violations = await page.evaluate(async () => (await window.axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  assert.deepEqual(violations, [], `${name}: accessibility`);
  if (await target.count()) await target.scrollIntoViewIfNeeded();
  const file = name+'.png'; await page.screenshot({path:path.join(out,file),fullPage:false}); screenshots.push(file);
}
async function seed() {
  return page.evaluate(async password => {
    const store = await import('/src/lib/storage.ts');
    const familyLib = await import('/src/lib/family.ts');
    const {classFile,makeHandIn} = await import('/src/lib/classroom.ts');
    const {recordHandIn} = await import('/src/lib/submissionHistory.ts');
    const {family} = await familyLib.createFamily({mode:'classroom',className:'Synthetic science',state:'',route:'Synthetic local acceptance only',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password,students:[{name:'Synthetic Alice',grade:7},{name:'Synthetic Bob',grade:7},{name:'Synthetic Outsider',grade:7}]});
    const [alice,bob,outsider] = family.students;
    const science = family.classes[0]; science.students=[alice.id,bob.id]; science.assignments=[{courseId:'synthetic-science',assigned:'2026-10-01'}];
    family.classes.push(familyLib.newClass('Synthetic other class',[outsider.id]));
    await familyLib.saveFamily(family);
    for (const learner of family.students) await store.updateProfileProgress(learner.id, () => ({...store.emptyProgress(),seeded:true,catalogV1:true,enrolled:[]}));
    const progress={...store.emptyProgress(),work:{'synthetic-science/observation':{kind:'writing',started:'2026-10-30T12:00:00Z',updated:'2026-10-30T12:00:00Z',submitted:'2026-10-30T12:00:00Z',text:'Synthetic original observation: plants face the light.',rounds:1}}};
    const handin=await makeHandIn(classFile(family,science,()=> 'Synthetic science'),alice.id,progress);
    const {records}=recordHandIn([],handin,'2026-10-30T12:30:00Z');
    await store.saveState('classroom-submissions',JSON.stringify({version:1,records,complete:records.map(r=>r.id)}));
    return {alice:alice.id,bob:bob.id,outsider:outsider.id,classId:science.id};
  },password);
}
async function chooseTab(name) { await settled(); await button(name).click(); }
async function newItem(kind, title, text) {
  await button(`New ${kind}`).click();
  const form=page.getByRole('form',{name:`${kind} editor`,exact:true});
  await form.getByLabel('Title',{exact:true}).fill(title);
  await form.getByLabel('Instructions',{exact:true}).fill(text);
  return form;
}
async function saveAndPublish(form,title) {
  await form.getByRole('button',{name:'Save draft',exact:true}).click();
  await card(title).waitFor(); await card(title).getByRole('button',{name:'Publish',exact:true}).click();
  await card(title).getByRole('button',{name:'Withdraw',exact:true}).waitFor();
}
async function respond(title,text,targetLabel,targetOption) {
  const form=card(title).getByRole('form',{name:`Respond to ${title}`,exact:true});
  if(targetLabel)await form.getByLabel(targetLabel,{exact:true}).selectOption({label:targetOption});
  await form.getByLabel('Response text',{exact:true}).fill(text);
  await form.getByRole('button',{name:'Submit response',exact:true}).click();
  await card(title).getByText(text,{exact:true}).waitFor();
}

try {
  server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_HOMESCHOOL':JSON.stringify('1'),'import.meta.env.VITE_COURSES_URL':JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('')},logLevel:'warn'});
  await server.listen(); const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
  for(const {width,theme} of [{width:1280,theme:'light'},{width:320,theme:'dark'}]) {
    const prefix=`${theme}-${width}`; current=`${prefix}-startup`;
    const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
    await context.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===origin||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
    page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(`${current}: ${e.message}`));page.on('dialog',d=>d.accept());
    await page.goto(origin);await heading('Library').waitFor();const ids=await seed();await page.reload();await select('Synthetic Alice');await openTeacher();
    await audit(`${prefix}-teacher-entry`);
    for (const [shortcut,tab] of [['Classes and assignments','Classes'],['Hand-ins','Hand-ins'],['Gradebook','Gradebook'],['Learning games','Learning games']]) {
      await page.getByRole('navigation',{name:'Existing classroom tools',exact:true}).getByRole('button',{name:shortcut,exact:true}).click();
      const sections=page.getByRole('navigation',{name:'Teacher sections',exact:true});
      assert.equal(await sections.getByRole('button',{name:tab,exact:true}).getAttribute('aria-current'),'page','existing teacher tool remains integrated');
      await sections.getByRole('button',{name:'Class collaboration',exact:true}).click();await heading('Class collaboration').waitFor();await settled();
    }
    // Teacher creates a real group and all five activity types through ordinary controls.
    await chooseTab('Groups');await button('New group').click();
    let form=page.getByRole('form',{name:'Group editor',exact:true});
    await form.getByLabel('Group name',{exact:true}).fill('Synthetic science team');
    await form.getByLabel('Synthetic Alice',{exact:true}).check();await form.getByLabel('Synthetic Bob',{exact:true}).check();
    await form.getByRole('button',{name:'Save group',exact:true}).click();await card('Synthetic science team').waitFor();
    await chooseTab('Projects');form=await newItem('project','Synthetic plant project','Measure a plant and explain observations.');
    await form.getByLabel('Audience group',{exact:true}).selectOption({label:'Synthetic science team'});
    await form.getByLabel('Milestones (one per line)',{exact:true}).fill('Record observation\nExplain result');
    await saveAndPublish(form,'Synthetic plant project');await audit(`${prefix}-project-published`,card('Synthetic plant project'));
    await chooseTab('Peer review');form=await newItem('peer review','Synthetic peer discussion','Give specific helpful feedback on this exact observation.');
    await form.getByLabel('Approved submission',{exact:true}).selectOption({index:1});
    await form.getByRole('region',{name:'Snapshot preview',exact:true}).getByText('Synthetic original observation: plants face the light.',{exact:true}).waitFor();
    await form.getByLabel('Synthetic Bob',{exact:true}).check();await saveAndPublish(form,'Synthetic peer discussion');
    await chooseTab('Conferences');form=await newItem('conference','Synthetic learner conference','Bring one question about your work.');
    await form.getByLabel('Synthetic Alice',{exact:true}).uncheck();
    await form.getByLabel('Scheduled time',{exact:true}).fill('2026-11-01T10:00');
    await form.getByLabel('Private teacher note',{exact:true}).fill('Private synthetic teacher observation never visible to learners.');
    await form.getByLabel('Action items (one per line)',{exact:true}).fill('Prepare a question');
    await saveAndPublish(form,'Synthetic learner conference');
    await chooseTab('Notices');form=await newItem('notice','Synthetic class notice','Please bring your observation notebook.');
    await form.getByLabel('Synthetic Alice',{exact:true}).uncheck();await saveAndPublish(form,'Synthetic class notice');
    await chooseTab('Field trips');form=await newItem('field trip','Synthetic garden visit','Observe the plants and reflect on your visit.');
    await form.getByLabel('Scheduled time',{exact:true}).fill('2026-11-02T09:00');
    await form.getByLabel('Location',{exact:true}).fill('Synthetic learning garden');await saveAndPublish(form,'Synthetic garden visit');
    // Cancellation and keyboard entry do not save a phantom activity.
    form=await newItem('field trip','Canceled synthetic visit','Not a real activity.');
    await form.getByRole('button',{name:'Cancel changes',exact:true}).focus();await page.keyboard.press('Enter');
    assert.equal(await card('Canceled synthetic visit').count(),0);await audit(`${prefix}-field-trip-published`,card('Synthetic garden visit'));
    // Simulate a concurrent local writer at the persistence boundary, not an unlock.
    await chooseTab('Notices');form=await newItem('notice','Synthetic conflict draft','Keep this draft if another view writes first.');
    await page.evaluate(async()=>{const s=await import('/src/lib/storage.ts');await s.updateState('classroom-workflows',raw=>{const value=JSON.parse(raw);value.revision++;return JSON.stringify(value);});});
    await form.getByRole('button',{name:'Save draft',exact:true}).click();
    await page.getByRole('alert').filter({hasText:'Changes were not confirmed.'}).waitFor();
    assert.equal(await form.getByLabel('Title',{exact:true}).inputValue(),'Synthetic conflict draft');
    await audit(`${prefix}-conflict-retains-draft`,form);
    await button('Refresh classroom').click();await settled();
    await form.getByRole('button',{name:'Save draft',exact:true}).click();await card('Synthetic conflict draft').waitFor();
    await switchLearner('Synthetic Bob');
    await chooseTab('Projects');await respond('Synthetic plant project','Synthetic Bob measured a seven-centimeter stem.','Milestone','Record observation');
    await chooseTab('Peer review');await card('Synthetic peer discussion').getByText('Approved peer snapshot',{exact:true}).click();
    await card('Synthetic peer discussion').getByText('Synthetic original observation: plants face the light.',{exact:true}).waitFor();
    await respond('Synthetic peer discussion','Synthetic peer feedback: explain how you measured the light.');
    await audit(`${prefix}-learner-peer-response`,card('Synthetic peer discussion'));
    await chooseTab('Conferences');assert.equal(await page.getByText('Private synthetic teacher observation never visible to learners.',{exact:true}).count(),0);
    await respond('Synthetic learner conference','Synthetic Bob prepared a measurement question.','Action','Prepare a question');
    await chooseTab('Notices');await card('Synthetic class notice').getByRole('button',{name:'Acknowledge',exact:true}).click();
    await card('Synthetic class notice').getByText('✓ Acknowledged on this device',{exact:true}).waitFor();
    assert.equal(await card('Synthetic class notice').getByRole('button',{name:'Acknowledge',exact:true}).count(),0,'confirmed acknowledgment cannot be clicked repeatedly');
    await chooseTab('Field trips');await respond('Synthetic garden visit','Synthetic Bob observed plants growing toward sunlight.');
    await audit(`${prefix}-learner-field-trip-reflection`,card('Synthetic garden visit'));
    const persistedBefore=await page.evaluate(async()=>JSON.parse(await(await import('/src/lib/storage.ts')).loadState('classroom-workflows')));
    assert.equal(persistedBefore.responses.length,5,'one complete learner response for each capability');
    assert.equal(persistedBefore.responses.filter(r=>r.kind==='acknowledgment').length,1);
    assert.equal(persistedBefore.reviews.length,0);
    await switchLearner('Synthetic Alice');await chooseTab('Peer review');
    assert.equal(await card('Synthetic peer discussion').getByText('Synthetic peer feedback: explain how you measured the light.',{exact:true}).count(),0,'unmoderated peer feedback stays private');
    await chooseTab('Projects');assert.equal(await card('Synthetic plant project').getByText('Synthetic Bob measured a seven-centimeter stem.',{exact:true}).count(),0,'unreviewed contribution stays private');
    await chooseTab('Conferences');assert.equal(await card('Synthetic learner conference').count(),0,'individual conference invisible to another learner');
    await chooseTab('Notices');assert.equal(await card('Synthetic class notice').count(),0,'individual notice invisible to another learner');
    await openTeacher();
    // Save private moderation first, prove it is still withheld, then explicitly release.
    await chooseTab('Peer review');let reviewCard=card('Synthetic peer discussion');
    await reviewCard.getByRole('button',{name:'Review response',exact:true}).click();
    await reviewCard.getByLabel('Review note',{exact:true}).fill('Synthetic moderated feedback is constructive.');
    await reviewCard.getByRole('button',{name:'Save review (private)',exact:true}).click();
    await switchLearner('Synthetic Alice');await chooseTab('Peer review');
    assert.equal(await card('Synthetic peer discussion').getByText('Synthetic moderated feedback is constructive.',{exact:true}).count(),0);
    await openTeacher();await chooseTab('Peer review');reviewCard=card('Synthetic peer discussion');
    await reviewCard.getByRole('button',{name:'Review response',exact:true}).click();
    await reviewCard.getByRole('button',{name:'Release review',exact:true}).click();
    for(const [tab,title,note] of [['Projects','Synthetic plant project','Synthetic project evidence reviewed.'],['Conferences','Synthetic learner conference','Synthetic conference action reviewed.'],['Notices','Synthetic class notice','Synthetic notice acknowledgment reviewed.'],['Field trips','Synthetic garden visit','Synthetic field-trip reflection reviewed; no automatic credit.']]) {
      await chooseTab(tab);const item=card(title);await item.getByRole('button',{name:'Review response',exact:true}).click();
      await item.getByLabel('Review note',{exact:true}).fill(note);await item.getByRole('button',{name:'Release review',exact:true}).click();
    }
    await audit(`${prefix}-teacher-reviewed-field-trip`,card('Synthetic garden visit'));
    await switchLearner('Synthetic Alice');await chooseTab('Peer review');
    await card('Synthetic peer discussion').getByText('Synthetic peer feedback: explain how you measured the light.',{exact:true}).waitFor();
    assert.equal(await card('Synthetic peer discussion').getByText('Synthetic moderated feedback is constructive.',{exact:true}).count(),0,'teacher review note is private to the response author');
    await audit(`${prefix}-released-peer-feedback`,card('Synthetic peer discussion'));
    await chooseTab('Projects');await card('Synthetic plant project').getByText('Synthetic Bob measured a seven-centimeter stem.',{exact:true}).waitFor();
    // Browser history returns to the scoped learner workspace without granting another role.
    await settled();await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('button',{name:'Courses',exact:true}).click();
    await heading('Courses').waitFor();await page.goBack();await heading('My classroom').waitFor();
    await page.goForward();await heading('Courses').waitFor();await button('Open my classroom').click();await heading('My classroom').waitFor();
    // Reload revokes the memory-only grant, but retains committed work.
    await page.reload();await select('Synthetic Alice');await openLearner();await chooseTab('Peer review');
    await card('Synthetic peer discussion').getByText('Synthetic peer feedback: explain how you measured the light.',{exact:true}).waitFor();
    assert.equal(await card('Synthetic peer discussion').getByText('Synthetic moderated feedback is constructive.',{exact:true}).count(),0,'teacher review note is private to the response author');
    // Offline interaction uses already loaded local App modules and persists a real response.
    await switchLearner('Synthetic Bob');await chooseTab('Peer review');
    await card('Synthetic peer discussion').getByText('Synthetic moderated feedback is constructive.',{exact:true}).waitFor();
    await chooseTab('Projects');await context.setOffline(true);
    await respond('Synthetic plant project','Synthetic offline explanation persisted.','Milestone','Explain result');
    await context.setOffline(false);await audit(`${prefix}-offline-project-response`,card('Synthetic plant project'));
    await switchLearner('Synthetic Outsider');
    assert.deepEqual(await page.getByLabel('Class',{exact:true}).locator('option').allTextContents(),['Synthetic other class']);
    for(const tab of ['Projects','Peer review','Conferences','Notices','Field trips']) {await chooseTab(tab);assert.equal(await page.getByText(/Synthetic (plant project|peer discussion|learner conference|class notice|garden visit)/).count(),0,'other class sees no activity');}
    await audit(`${prefix}-outsider-class-isolation`);
    await switchLearner('Synthetic Alice');await openTeacher();await chooseTab('Peer review');
    await card('Synthetic peer discussion').getByRole('button',{name:'Revoke release',exact:true}).click();
    await chooseTab('Notices');await card('Synthetic class notice').getByRole('button',{name:'Withdraw',exact:true}).click();
    await chooseTab('Projects');await card('Synthetic plant project').getByRole('button',{name:'Edit',exact:true}).click();
    form=page.getByRole('form',{name:'project editor',exact:true});await form.getByLabel('Instructions',{exact:true}).fill('Revised synthetic instructions require fresh publication.');
    await form.getByRole('button',{name:'Save draft',exact:true}).click();
    await switchLearner('Synthetic Bob');await chooseTab('Projects');assert.equal(await card('Synthetic plant project').count(),0,'edited revision remains unpublished');
    await chooseTab('Notices');assert.equal(await card('Synthetic class notice').count(),0,'withdrawn notice disappears');
    await switchLearner('Synthetic Alice');await chooseTab('Peer review');assert.equal(await card('Synthetic peer discussion').getByText('Synthetic peer feedback: explain how you measured the light.',{exact:true}).count(),0,'revoked feedback disappears from source learner');
    await audit(`${prefix}-revoked-feedback`,card('Synthetic peer discussion'));
    const finalState=await page.evaluate(async()=>JSON.parse(await(await import('/src/lib/storage.ts')).loadState('classroom-workflows')));
    assert.equal(finalState.items.filter(i=>i.title==='Synthetic plant project').length,2,'edits retain exact prior revision');
    assert.equal(finalState.responses.length,6,'saved original and offline contributions retained');
    assert.equal(await page.evaluate(async ids=>{const s=await import('/src/lib/storage.ts');return [await s.loadState('records-'+ids.alice),await s.loadState('records-'+ids.bob)].some(Boolean)},ids),false,'classroom activity never manufactures academic credit');
    checks.push({width,theme,workflow:'group/project milestones; immutable peer snapshot; private moderation then release and revocation; scoped conference actions/private notes; notice acknowledgment; field-trip reflection/review; role/class privacy; edits withdraw; cancel/keyboard; reload requires adult; offline local persistence; no academic credit'});
    await context.close();
  }
  assert.deepEqual(errors,[],'No browser runtime errors');
  assert(checks.length>0,'Capability acceptance must exercise complete teacher/learner workflows');
  await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,data:'synthetic local classrooms only',externalNetwork:'blocked',checks,screenshots,errors},null,2));
  console.log('Local classroom real-App acceptance passed');
} catch(error) {
  const diagnostic=page?await page.evaluate(()=>({url:location.href,headings:[...document.querySelectorAll('h1,h2')].map(n=>n.textContent),notices:[...document.querySelectorAll('[role=alert],[role=status]')].map(n=>n.textContent)})).catch(()=>null):null;
  await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,screenshots,errors,diagnostic},null,2));
  if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw error;
} finally {await browser?.close();await server?.close();}
