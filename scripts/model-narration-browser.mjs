// Real manipulatives and reader, generic fixtures and an instrumented (inaudible) voice.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results/model-narration');await mkdir(out,{recursive:true});
const entry=`import React,{useRef,useState} from 'react';import {createRoot} from 'react-dom/client';
import {ManipModel} from './src/components/Manipulative';import {readSpec,startState,describe} from './src/lib/manip';
import {ReadAloudBar} from './src/components/ReadAloud';import {speechText} from './src/lib/readAloud';import {speaker} from './src/lib/speech';import './src/styles.css';
const specs=[{kind:'counters',count:2},{kind:'blocks',value:124},{kind:'numberline',at:4},{kind:'fractions',bars:['1/2','2/4']},{kind:'clock',time:'2:45'},{kind:'coins',start:['quarter','dime','penny']}];
function Model({spec}){const m=readSpec(spec).model;const [state,setState]=useState(()=>startState(m));const ref=useRef(null);window.modelTest.expected=()=>describe(m,state);window.modelTest.text=()=>speechText(ref.current);return <section className="panel"><ReadAloudBar owner={'model-'+m.kind} prominent units={()=>[ref.current]}/><figure ref={ref} className="manip"><ManipModel model={m} state={state} onChange={setState}/><figcaption>Explore this model. Use Add when you need another object.</figcaption></figure></section>}
function App(){const [which,setWhich]=useState(0);window.modelTest.show=i=>setWhich(i);window.modelTest.stop=()=>speaker.stop();return <main className="page stack" data-kind={specs[which].kind}><h1>Model reading review</h1><p>Generic component test, instrumented voice only.</p><Model key={which} spec={specs[which]}/></main>}
window.modelTest={};createRoot(document.getElementById('root')).render(<App/>);`;
const bundle=await build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},bundle:true,format:'iife',platform:'browser',write:false,outdir:path.join(root,'.model-narration-test'),jsx:'automatic',target:'es2021',define:{'import.meta.env':'{}','__DEV_COURSE_KEY__':'""','process.env.NODE_ENV':'"production"'},loader:{'.woff':'dataurl','.woff2':'dataurl','.ttf':'dataurl'},logLevel:'silent'});
const js=bundle.outputFiles.find(f=>f.path.endsWith('.js')).text,css=bundle.outputFiles.find(f=>f.path.endsWith('.css')).text;
const axe=await readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const checks=[],screenshots=[],errors=[],requests=[];let browser,page,current='startup',audits=0;
const normalized=s=>s.replace(/\s+/g,' ').trim();
try{
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
 for(const width of [320,1280]){
  const context=await browser.newContext({viewport:{width,height:960},colorScheme:width===320?'dark':'light',reducedMotion:'reduce'});
  await context.route('**/*',r=>{requests.push(r.request().url());return r.abort();});
  page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push({current,message:e.message}));
  await page.setContent('<!doctype html><html lang="en"><head><title>Model narration regression</title></head><body><div id="root"></div></body></html>');
  await page.evaluate(width=>{
   document.documentElement.dataset.theme=width===320?'dark':'light';let pending=null;const spoken=[];
   class Utterance{constructor(text){this.text=text;}}
   Object.defineProperty(window,'SpeechSynthesisUtterance',{value:Utterance,configurable:true});
   Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'en-US',name:'Instrumented (no audio)',localService:true,default:true}],speak:u=>{if(pending)throw Error('Overlap');pending=u;spoken.push(u.text);},cancel:()=>{const old=pending;pending=null;old?.onerror?.({error:'interrupted'});},addEventListener:()=>{},removeEventListener:()=>{}},configurable:true});
   window.modelVoice={reset:()=>{spoken.length=0;},finish:()=>{let n=0;while(pending){if(++n>100)throw Error('Nonterminating queue');const old=pending;pending=null;old.onend?.();}return [...spoken];}};
  },width);
  await page.addStyleTag({content:css});await page.addScriptTag({content:js});await page.locator('.mp').waitFor();await page.evaluate(()=>document.fonts.ready);
  let kinds=0;
  for(const [i,kind] of ['counters','blocks','numberline','fractions','clock','coins'].entries()){
   current=`${width}-${kind}`;await page.evaluate(i=>{window.modelTest.stop();window.modelTest.show(i);},i);await page.waitForFunction(kind=>document.querySelector('main')?.dataset.kind===kind,kind);
   async function read(){
    const expected=await page.evaluate(()=>window.modelTest.expected());
    assert.equal(await page.locator('.mp [aria-live="polite"]').textContent(),expected);
    const text=await page.evaluate(()=>window.modelTest.text());
    assert.equal(text.split(expected).length-1,1,'Exactly one state description');
    assert.equal(text.replace(expected,'').trim().replace(/^[. ]+/,''),'Explore this model. Use Add when you need another object.','Only authored caption follows state');
    await page.evaluate(()=>window.modelVoice.reset());await page.getByRole('button',{name:'Read the lesson to me',exact:true}).click();
    assert.equal(normalized((await page.evaluate(()=>window.modelVoice.finish())).join(' ')),normalized(text));
    await page.getByRole('button',{name:'Read the lesson to me',exact:true}).waitFor();return expected;
   }
   const before=await read();
   const control=page.locator('.mp button:not([aria-disabled="true"]):not([disabled])').first();await control.focus();await page.keyboard.press('Enter');
   await page.waitForFunction(before=>document.querySelector('.mp > [aria-live=polite]')?.textContent!==before,before);
   assert.notEqual(await read(),before,'Keyboard interaction updates spoken state');
   await page.addScriptTag({content:axe});const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
   assert.deepEqual(audit.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],current+' accessibility');audits++;
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),current+' overflow');
   if(kind==='counters'){
    await page.getByRole('button',{name:'Start over',exact:true}).click();await page.waitForFunction(before=>document.querySelector('.mp > [aria-live=polite]')?.textContent===before,before);assert.equal(await read(),before);
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));const name=current+'.png';await page.screenshot({path:path.join(out,name)});screenshots.push(name);
   }
   kinds++;
  }
  checks.push({width,modelKinds:kinds,currentStateNarratedOnce:true,captionPreserved:true,toolbarOmitted:true,keyboardControls:true,resetRefreshesNarration:true});await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,scope:'Production model/reader components with synthetic fixtures and instrumented speech; not full App or audible speech',checks,audits,screenshots,errors,requests},null,2)+'\n');console.log(JSON.stringify({passed:true,checks,audits}));
}catch(error){await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,audits,errors,requests},null,2));await page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw error;}
finally{await browser?.close();}
