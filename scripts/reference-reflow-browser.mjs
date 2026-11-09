// Generic production RefView reflow regression; no private curriculum or network.
import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'test-results/reference-reflow');
await mkdir(out,{recursive:true});
const link='https://example.invalid/reference/'+ 'long-source-identifier-'.repeat(8);
const heading='AnUnbrokenSyntheticReferenceHeadingForWrapping';
const body='# '+heading+'\n\nRead every word without horizontal scrolling.\n\n['+link+']('+link+')\n\n[Readable source label]('+link+')';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import RefView from './src/pages/RefView';import './src/styles.css';const sheet={id:'synthetic',title:'A synthetic reference sheet',body:window.referenceFixture.body};const course={id:'synthetic-review',title:'Synthetic review',references:[sheet],glossary:[]};createRoot(document.getElementById('root')).render(<main><RefView api={{go:()=>{}}} course={course} sheet={sheet}/></main>);`;
const bundle=await build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},bundle:true,format:'iife',platform:'browser',write:false,outdir:path.join(root,'.reflow-test'),jsx:'automatic',target:'es2021',define:{'import.meta.env':'{}','__DEV_COURSE_KEY__':'""','process.env.NODE_ENV':'"production"'},loader:{'.woff':'dataurl','.woff2':'dataurl','.ttf':'dataurl'},logLevel:'silent'});
const js=bundle.outputFiles.find(f=>f.path.endsWith('.js')).text,css=bundle.outputFiles.find(f=>f.path.endsWith('.css')).text;
const axe=await readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const checks=[],network=[],errors=[];let browser,page,current='startup';
try{
 browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{});
 for(const width of [320,1280]){
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:width===320?'dark':'light',reducedMotion:'reduce'});
  await context.route('**/*',r=>{network.push(r.request().url());return r.abort();});
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<!doctype html><html lang="en"><head><title>Reference reflow test</title></head><body><div id="root"></div></body></html>');
  await page.addStyleTag({content:css});
  await page.evaluate(({body,width})=>{window.referenceFixture={body};document.documentElement.dataset.theme=width===320?'dark':'light';},{body,width});
  await page.addScriptTag({content:js});await page.locator('.ref-sheet').waitFor();await page.evaluate(()=>document.fonts.ready);
  for(const scale of [100,130,200]){
   current=`${width}-${scale}`;await page.evaluate(n=>document.documentElement.style.fontSize=n+'%',scale);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),current+': horizontal overflow');
   assert.equal(await page.locator('.ref-sheet .prose h1').innerText(),heading);
   for(const anchor of await page.locator('.ref-sheet a').all())assert.equal(await anchor.getAttribute('href'),link);
   assert.equal(await page.locator('.ref-sheet a').count(),2);
   assert.deepEqual(await page.locator('.ref-sheet').evaluate(el=>({wrap:getComputedStyle(el).overflowWrap,clip:getComputedStyle(el).overflowX})),{wrap:'anywhere',clip:'visible'});
   await page.addScriptTag({content:axe});
   const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
   assert.deepEqual(audit.violations.map(v=>v.id),[],current+': accessibility');
   const source=page.getByRole('link',{name:'Readable source label',exact:true});await source.focus();assert(await source.evaluate(el=>document.activeElement===el));
   checks.push({width,scale,textPreserved:true,destinationsPreserved:true,overflow:false,clipping:false,accessibility:true});
  }
  await page.screenshot({path:path.join(out,width+'-enlarged.png')});
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.ref-sheet h1').first().innerText(),'A synthetic reference sheet');await page.emulateMedia({media:'screen'});
  await context.close();
 }
 assert.deepEqual(network,[]);assert.deepEqual(errors,[]);
 await writeFile(path.join(out,'result.json'),JSON.stringify({passed:true,scope:'Offline production RefView rendering with generic text; not full App routing, persistence, native device or printed output',checks,network,errors},null,2)+'\n');
}catch(error){await writeFile(path.join(out,'failure.json'),JSON.stringify({current,error:String(error),checks,network,errors},null,2));await page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw error;}
finally{await browser?.close();}
