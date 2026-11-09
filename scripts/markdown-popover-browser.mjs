// Production reader, synthetic prose only; no course packages or external requests.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS || path.join(root,'test-results/markdown-popover');
await fs.mkdir(out,{recursive:true});
const result={checks:[],errors:[],requests:[]};
const bundle=await build({stdin:{contents:`
import React from 'react';
import {createRoot} from 'react-dom/client';
import Markdown from './src/components/Markdown';
import './src/styles.css';
createRoot(document.getElementById('root')!).render(<main style={{padding:16,minHeight:2200}}>
 <h1>ExtraordinarilyLongHeadingForNarrowScreens</h1>
 <Markdown source={'A synthetic extraordinarilylongwordthatmustwrap.\\n\\n- Another extraordinarilylongwordthatmustwrap.'}/>
 <div style={{height:800}}/>
 <Markdown source={'Open [[notice]], then [[missing]].'} glossary={[{term:'notice',definition:'A synthetic explanation, with enough text to wrap on a narrow screen.'}]}/>
 <Markdown html source={'<button class="fn-ref" data-fn="note1">1</button>'} notes={[{id:'note1',n:1,text:'A synthetic footnote.'}]}/>
 <button className="btn">Following control</button>
</main>);`,resolveDir:root,loader:'tsx'},bundle:true,write:false,outdir:out,format:'iife',platform:'browser',jsx:'automatic',
 define:{'import.meta.env':'{}','process.env.NODE_ENV':'"production"'},loader:{'.woff':'dataurl','.woff2':'dataurl','.ttf':'dataurl'},logLevel:'silent'});
const js=bundle.outputFiles.find(x=>x.path.endsWith('.js')).text,css=bundle.outputFiles.find(x=>x.path.endsWith('.css')).text;
const axe=await fs.readFile(path.join(root,'node_modules/axe-core/axe.min.js'),'utf8');
const browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--disable-gpu']}:{});
try {
 for(const width of [320,1280]) for(const theme of ['light','dark']) for(const scale of [100,200]) {
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
  await context.route('**/*',route=>{result.requests.push(route.request().url());return route.abort();});
  const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
  await page.setContent('<!doctype html><html lang="en"><head><title>Reader keyboard and reflow</title></head><body><div id="root"></div></body></html>');
  await page.evaluate(({theme,scale})=>{document.documentElement.dataset.theme=theme;document.documentElement.style.fontSize=scale+'%';},{theme,scale});
  await page.addStyleTag({content:css});await page.addScriptTag({content:js});await page.locator('button.gloss').first().waitFor();await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'heading and prose reflow');
  const links=page.locator('button.gloss,button.fn-ref');
  for(let i=0;i<await links.count();i++) {
   const trigger=links.nth(i);await trigger.focus();
   // Open with the link at the bottom edge: focused Close must scroll into view.
   await trigger.evaluate(el=>scrollTo(0,el.getBoundingClientRect().bottom+scrollY-innerHeight+2));
   await page.keyboard.press('Enter');const dialog=page.getByRole('dialog');await dialog.waitFor();
   const close=dialog.getByRole('button',{name:'Close',exact:true});
   assert(await close.evaluate(el=>el===document.activeElement),'focus enters dialog');
   const bounds=await close.boundingBox();assert(bounds.y>=0&&bounds.y+bounds.height<=900,'focused control remains visible');
   for(const key of ['Tab','Shift+Tab']) {await page.keyboard.press(key);assert(await close.evaluate(el=>el===document.activeElement),'Tab stays within dialog');}
   await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert(await trigger.evaluate(el=>el===document.activeElement),'Escape restores originating link');
   await page.keyboard.press('Enter');await dialog.waitFor();await page.keyboard.press('Enter');await dialog.waitFor({state:'detached'});assert(await trigger.evaluate(el=>el===document.activeElement),'Close restores originating link');
   await page.keyboard.press('Enter');await dialog.waitFor();await page.addScriptTag({content:axe});
   const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));assert.deepEqual(violations,[]);
   if(i===0)await page.screenshot({path:path.join(out,`${width}-${theme}-${scale}-dialog.png`)});
   await page.locator('.pop-scrim').click({position:{x:2,y:2}});await dialog.waitFor({state:'detached'});assert(await trigger.evaluate(el=>el===document.activeElement),'outside dismissal restores link');
   result.checks.push({width,theme,scale,trigger:i,keyboard:true,focusVisible:true,overflow:false,violations});
  }
  await context.close();
 }
 assert.deepEqual(result.errors,[]);assert.deepEqual(result.requests,[]);
 console.log(`Reader popovers: ${result.checks.length} glossary/footnote keyboard, focus visibility, dismissal and reflow states passed`);
} finally {await browser.close();await fs.writeFile(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');}
