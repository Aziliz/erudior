// Eight original synthetic K templates through actual community authoring and learner UI.
// No production account, credential, source course, publication or learner record is used.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','community-k-demo-browser');
await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
let server,browser,page,current='startup';
const errors=[],screenshots=[],completed=[];
try {
  server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0},define:{__DEV_COURSE_KEY__:JSON.stringify(''),'import.meta.env.VITE_COMMUNITY_API':JSON.stringify('/synthetic-api')},logLevel:'warn'});
  await server.listen();
  const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
  const button=name=>page.getByRole('button',{name,exact:true});
  const state=()=>page.evaluate(()=>window.communityKDemoFixture.state());
  const source=()=>page.evaluate(()=>window.communityKDemoFixture.source());
  const record=async id=>(await state()).drafts[id];
  const description=mode=>page.getByLabel(mode==='legacy'?'Description (what learners will get out of it)':'Description',{exact:true});
  async function saved(mode,id) {
    const before=(await record(id)).saves;
    await button(mode==='legacy'?'Save draft':'Save listing draft').click();
    if(mode==='legacy')await page.locator('.save-state').filter({hasText:'All changes saved'}).waitFor();
    else await page.getByText('Canonical draft saved.',{exact:true}).waitFor();
    // A debounce may already have saved the exact content; source equality is checked by callers.
    assert((await record(id)).saves>=before);
  }
  async function publish(mode,version) {
    if(mode==='legacy') {
      await button('Publish').click();
      await page.getByRole('heading',{name:'Publish',exact:true}).waitFor();
      await page.locator('section.panel').getByRole('button',{name:version===1?'Publish':`Publish version ${version}`,exact:true}).click();
      await page.getByText(`Published version ${version}`,{exact:true}).first().waitFor();
    } else {
      await button(`Publish canonical version ${version}`).click();
      await page.getByText(`Published community version ${version}; not reviewed.`,{exact:true}).waitFor();
    }
  }
  async function audit(name,target) {
    current=name;
    await page.evaluate(()=>{window.scrollTo(0,0);for(const e of document.querySelectorAll('.main,.inner')){e.scrollTop=0;e.scrollLeft=0;}});
    if(target)await target.scrollIntoViewIfNeeded();
    await page.evaluate(()=>document.fonts.ready);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    if(overflow>1)await writeFile(path.join(out,name+'-overflow.json'),JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>{const r=e.getBoundingClientRect();return{tag:e.tagName,cls:e.className,left:r.left,right:r.right,text:e.textContent?.slice(0,90)}}).filter(e=>e.left< -1||e.right>innerWidth+1)),null,2));
    assert(overflow<=1,name+': body overflow');
    await page.addScriptTag({content:axe});
    const result=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
    assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],name+': accessibility');
    await page.screenshot({path:path.join(out,name+'.png'),fullPage:false});
    screenshots.push(name+'.png');
  }
  async function renderedBody() {
    const body=page.locator('.lesson-body');await body.waitFor();
    if(await body.locator('.diagram').count())await body.locator('.diagram svg').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    return (await body.innerText()).replace(/\s+/g,' ').trim();
  }
  for(const {theme,width} of [{theme:'light',width:1280},{theme:'dark',width:320}])for(const mode of ['legacy','canonical']) {
    const group=`${theme}-${width}-${mode}`;current=group;
    const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
    const outside=[];
    await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin===origin||['data:','blob:'].includes(url.protocol))return route.continue();outside.push(url.href);return route.abort();});
    page=await context.newPage();page.on('pageerror',error=>errors.push(`${current}: ${error.message}`));
    page.on('dialog',dialog=>dialog.dismiss());
    await page.goto(origin+`/tests/fixtures/community-k-demo.html?mode=${mode}`);
    await page.getByRole('heading',{name:'Your community courses',exact:true}).waitFor();
    const emptyProgress=await page.evaluate(()=>window.communityKDemoFixture.progress());
    const subjectOptions=await page.getByLabel('Synthetic subject',{exact:true}).locator('option').evaluateAll(options=>options.map(option=>({id:option.value,title:option.textContent})));
    assert.equal(subjectOptions.length,8,'Exactly eight synthetic subjects');
    assert.equal(new Set(subjectOptions.map(s=>s.id)).size,8);
    for(const [index,subject] of subjectOptions.entries()) {
      const name=`${group}-${subject.id}`;current=name;
      await page.getByLabel('Synthetic subject',{exact:true}).selectOption(subject.id);
      await button('New course').click();
      await description(mode).waitFor();
      const id=await page.evaluate(()=>window.communityKDemoFixture.selectedId());
      assert.equal(id,`${mode}-${subject.id}`);
      assert.equal(Object.keys((await state()).drafts).length,index+1);
      const original=await source();
      const text=`Synthetic ${subject.title} acceptance example. Edited in the real ${mode} community editor. Not a reviewed curriculum.`;
      await description(mode).fill(text);
      await saved(mode,id);
      assert.equal((await source()).description,text);
      // Author an additional body block in each real editor, not merely fixture metadata.
      const authoredNote=`Original ${subject.title} demo note written through the real editor.`;
      if(mode==='legacy') {
        await page.getByRole('button',{name:/^Lessons \(/}).click();
        await button('Text').click();
        await page.locator('.block-text').last().getByRole('textbox').fill(authoredNote);
        await saved(mode,id);
        await button('About').click();
      } else {
        await button('Edit full course').click();
        await page.getByRole('button',{name:/^Lessons \(/}).click();
        const lessonTitle=original.canonical.course.lessons[0].title;
        await button(lessonTitle).click();
        const body=page.getByLabel('Lesson text (Markdown)',{exact:true});
        await body.fill((await body.inputValue())+'\n\n'+authoredNote);
        await button('Save course').click();
        await page.getByText('Canonical draft saved.',{exact:true}).waitFor();
        await button('← Done').click();
      }
      const authored=await source();
      await audit(name+'-authored',description(mode));
      await page.reload();await description(mode).waitFor();
      assert.equal(await description(mode).inputValue(),text);
      assert.deepEqual(await source(),authored,'Reload preserves authored source exactly');
      assert.equal(authored.title,original.title);
      await publish(mode,1);
      assert.equal((await record(id)).publishes,1);
      const versionOne=(await record(id)).published[0];
      assert.deepEqual(versionOne,authored,'Published version is the exact saved draft');
      await audit(name+'-published',page.getByRole('heading',{level:1}));
      await button('Install published demo').click();
      await page.waitForFunction(()=>Boolean(window.communityKDemoFixture.installed()));
      const parity=await page.evaluate(()=>({actual:window.communityKDemoFixture.manifest(window.communityKDemoFixture.installed()),expected:window.communityKDemoFixture.manifest(window.communityKDemoFixture.expected()),installed:window.communityKDemoFixture.installed()}));
      assert.deepEqual(parity.actual,parity.expected,'Community installation matches the synthetic official-format runtime projection');
      assert.equal(parity.installed.community.review,'not_reviewed');
      assert.equal(parity.installed.revision,1);
      await button('View source lesson').click();
      const sourceText=await renderedBody();assert(sourceText.length>20);assert(sourceText.includes(authoredNote),'Actual editor body addition reaches the learner renderer');
      await button('View installed lesson').click();
      assert.equal(await renderedBody(),sourceText,'Same learner renderer and authored body after install');
      assert(await page.getByRole('heading',{name:'End-of-lesson quiz',exact:true}).count()>0,'Question links survive installation');
      assert.equal(await page.locator('audio[autoplay]').count(),0,'No automatic media playback');
      if(index===0) {
        const skip=button('Skip');
        await skip.waitFor();await skip.click();
        await page.waitForFunction(()=>Object.keys(window.communityKDemoFixture.progress().pretests).length>0);
        assert(Object.keys((await page.evaluate(()=>window.communityKDemoFixture.progress())).pretests).length>0,'Real warmup skip records isolated demo progress');
      }
      await audit(name+'-installed-lesson',page.locator('.lesson-body'));
      // Returning and reopening goes through the real author list, not a fixture shortcut editor.
      await button('Demo course list').click();
      await page.getByRole('heading',{name:'Your community courses',exact:true}).waitFor();
      await page.getByRole('button',{name:`Edit ${authored.title}`,exact:true}).click();
      await description(mode).waitFor();assert.equal(await description(mode).inputValue(),text);
      if(index===0) {
        await page.evaluate(()=>window.communityKDemoFixture.failSaves(true));
        const changed=text+' Version two tests interrupted recovery.';
        await description(mode).fill(changed);
        await button(mode==='legacy'?'Save draft':'Save listing draft').click();
        if(mode==='legacy')await page.locator('.save-state').filter({hasText:'Not saved:'}).waitFor();
        else await page.getByRole('alert').filter({hasText:'Synthetic save interrupted'}).waitFor();
        assert.equal((await source()).description,text,'Failed save cannot replace stored draft');
        assert.deepEqual((await record(id)).published,[versionOne],'Failed save never changes published bytes');
        await audit(name+'-save-recovery',description(mode));
        await page.evaluate(()=>window.communityKDemoFixture.failSaves(false));
        await saved(mode,id);assert.equal((await source()).description,changed);
        await page.evaluate(()=>window.communityKDemoFixture.failPublish(true));
        if(mode==='legacy') {await button('Publish').click();await page.getByRole('heading',{name:'Publish',exact:true}).waitFor();await page.locator('section.panel').getByRole('button',{name:'Publish version 2',exact:true}).click();}
        else await button('Publish canonical version 2').click();
        await page.getByText('Synthetic publication interrupted; no version created.',{exact:false}).first().waitFor();
        assert.deepEqual((await record(id)).published,[versionOne]);
        await page.evaluate(()=>window.communityKDemoFixture.failPublish(false));
        if(mode==='legacy') {await page.locator('section.panel').getByRole('button',{name:'Publish version 2',exact:true}).click();await page.getByText('Published version 2',{exact:true}).first().waitFor();}
        else await publish(mode,2);
        const updated=await record(id);assert.equal(updated.publishes,2);assert.equal(updated.published.length,2);assert.deepEqual(updated.published[0],versionOne,'New publication retains immutable version one');
        assert.equal(updated.published[1].description,changed);
        await button('Install published demo').click();
        await page.waitForFunction(()=>window.communityKDemoFixture.installed()?.revision===2);
        assert.deepEqual(await page.evaluate(()=>window.communityKDemoFixture.manifest(window.communityKDemoFixture.installed())),await page.evaluate(()=>window.communityKDemoFixture.manifest(window.communityKDemoFixture.expected())));
        await audit(name+'-version-two',page.getByRole('heading',{level:1}));
      }
      await button('Demo course list').click();
      await page.getByRole('heading',{name:'Your community courses',exact:true}).waitFor();
      completed.push({theme,width,mode,subject:subject.id,id});
    }
    const complete=await state();assert.equal(Object.keys(complete.drafts).length,8);
    assert(Object.values(complete.drafts).every(draft=>draft.published.length>=1));
    await audit(group+'-eight-subjects',page.getByRole('heading',{name:'Your community courses',exact:true}));
    await page.reload();await page.getByRole('heading',{name:'Your community courses',exact:true}).waitFor();
    assert.deepEqual((await state()).drafts,complete.drafts,'All eight independently persisted drafts survive reload');
    // Reopening an unrelated list entry must update the source/install subject, not keep a stale selector.
    await page.getByLabel('Synthetic subject',{exact:true}).selectOption(subjectOptions.at(-1).id);
    await page.getByRole('button',{name:'Edit Synthetic K Math',exact:true}).click();
    await description(mode).waitFor();
    assert.equal(await page.evaluate(()=>window.communityKDemoFixture.selectedId()),`${mode}-math`);
    await button('Install published demo').click();
    await page.waitForFunction(()=>window.communityKDemoFixture.installed()?.revision===2);
    assert.equal((await page.evaluate(()=>window.communityKDemoFixture.installed())).id,`community-${mode}-math`,'Cross-subject reopen installs the intended source');
    // Progress is intentionally ephemeral; populate it through the actual learner UI after reload.
    await button('View installed lesson').click();
    await renderedBody();
    await button('Skip').waitFor();await button('Skip').click();
    await page.waitForFunction(()=>Object.keys(window.communityKDemoFixture.progress().pretests).length>0);
    await button('Demo course list').click();
    await page.getByRole('heading',{name:'Your community courses',exact:true}).waitFor();
    // Reset confirmation protects the demo registry; reset never touches unrelated browser data.
    await page.evaluate(()=>{localStorage.setItem('unrelated-course-sentinel','keep');sessionStorage.setItem('unrelated-session-sentinel','keep');});
    const progressBeforeReset=await page.evaluate(()=>window.communityKDemoFixture.progress());
    assert(Object.keys(progressBeforeReset.pretests).length>0);
    await button('Reset synthetic demo').click();await button('Keep synthetic demo').click();
    assert.deepEqual((await state()).drafts,complete.drafts);
    assert.deepEqual(await page.evaluate(()=>window.communityKDemoFixture.progress()),progressBeforeReset,'Canceled reset keeps demo progress');
    await page.evaluate(()=>{window.communityKDemoFixture.failSaves(true);window.communityKDemoFixture.failPublish(true);window.communityKDemoFixture.delay(10);});
    await button('Reset synthetic demo').click();await button('Confirm demo reset').click();
    await page.getByRole('heading',{name:'No courses yet',exact:true}).waitFor();assert.equal(Object.keys((await state()).drafts).length,0);
    assert.deepEqual(await page.evaluate(()=>window.communityKDemoFixture.faults()),{failSaves:false,failPublish:false,delay:0},'Reset clears demo fault injection');
    const progressAfterReset=await page.evaluate(()=>window.communityKDemoFixture.progress());
    assert.deepEqual(progressAfterReset,emptyProgress,'Reset clears all isolated demo progress');
    assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('unrelated-course-sentinel'),sessionStorage.getItem('unrelated-session-sentinel')]),['keep','keep']);
    await page.reload();await page.getByRole('heading',{name:'No courses yet',exact:true}).waitFor();assert.equal(Object.keys((await state()).drafts).length,0);
    assert.deepEqual(outside,[],'Demo cannot contact outside services');
    await context.close();
  }
  assert.equal(completed.length,32);assert.deepEqual(errors,[]);
  await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,subjects:8,modes:['legacy','canonical'],views:[{theme:'light',width:1280},{theme:'dark',width:320}],completed,screenshots,errors,scope:'Synthetic seeded templates, actual authoring/save/reopen/publish/install APIs and learner renderer. Not curriculum or production publication.'},null,2));
  console.log('Eight-subject synthetic K demo: 32 actual-editor create/save/reopen/publish/install lifecycles, runtime/renderer parity, failure recovery, immutable versions and isolated reset passed.');
} catch(error) {
  await writeFile(path.join(out,'failure-diagnostics.json'),JSON.stringify({current,error:String(error),errors,screenshots,completed},null,2));
  if(page)await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});
  throw error;
} finally {await browser?.close();await server?.close();}
