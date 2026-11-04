import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import type { StudioClient, StudioEnvelope } from '../src/lib/studioApi';
import type { StudioDocument } from '../src/lib/adminStudio';
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://app.erudior.test/admin/studio',pretendToBeVisual:true});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react');const {createRoot}=await import('react-dom/client');
const bundle=resolve('tests/.admin-studio-ui-bundle.mjs');
await build({entryPoints:['src/pages/AdminStudio.tsx'],outfile:bundle,bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},define:{'import.meta.env.VITE_COMMUNITY_API':'""'}});
const {default:Studio}=await import(pathToFileURL(bundle).href);
const root=createRoot(document.getElementById('root')!);
const doc:StudioDocument={format:'erudior-studio-material',version:1,id:'saved',revision:1,kind:'worksheet',title:'Synthetic material',instructions:'Read carefully.',teacherNotes:'PRIVATE_NOTE_992',resources:[{key:'card/1',kind:'passage',title:'Synthetic card',source:{courseId:'source',revision:1,digest:'a'.repeat(64)},blocks:[{label:'Prompt',text:'Public prompt',answerText:'PRIVATE_ANSWER_883'}]}]};
let sessionKey='initial-session';let role='admin',reads=0,createAttempts=0,deliverCalls=0;const requestIds:string[]=[];
const envelope=():StudioEnvelope=>({document:structuredClone(doc),approval:{revision:1,digest:'a'.repeat(64),reviewedBy:'admin',reviewedAt:'now'},problems:[]});
const client:StudioClient={
 session:async()=>({userId:'admin',sessionKey}),
 logout:async()=>({ok:true}),
 me:async()=>({user:{id:'admin',name:'Synthetic admin',role:role as 'admin',accepted:true,provider:'dev'},providers:{google:false,github:false,dev:false}}),
 sources:async()=>({sources:[],nextCursor:null}), source:async()=>{throw Error('not used');},
 list:async()=>({materials:[{id:doc.id,title:doc.title,kind:doc.kind,revision:1,approved:true,updated:'now'}],nextCursor:null}),
 read:async()=>{reads++;return envelope();},
 create:async(id,d)=>{requestIds.push(id);const attempt=createAttempts++;if(attempt<2)throw Object.assign(Error('Unknown outcome'),{status:attempt===0?0:500});return {document:{...d,id:'created',revision:1},approval:null,problems:[]};},
 save:async()=>{throw Object.assign(Error('Conflict'),{status:409});},
 approve:async()=>envelope(),remove:async()=>({deleted:true,id:'saved',revision:2}),restore:async()=>envelope(),
 deliver:async(_id,a)=>{deliverCalls++;return a==='teacher'?{document:structuredClone(doc)}:{view:{kind:doc.kind,title:doc.title,instructions:doc.instructions,resources:doc.resources.map(r=>({...r,blocks:r.blocks.map(b=>({label:b.label,text:b.text}))}))}};},
};
const button=(name:string)=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===name);assert(b,`Button ${name} present`);return b;};
const click=async(name:string)=>React.act(async()=>{button(name).click();await new Promise(r=>setTimeout(r,5));});
const render=async()=>React.act(async()=>{root.render(React.createElement(Studio,{client,configured:true,onExit:()=>{}}));await new Promise(r=>setTimeout(r,5));});
try{
 await render();assert(document.body.textContent?.includes('Private library'));
 await click('Synthetic materialWorksheet · revision 1 · Approved');assert.equal(reads,1);
 assert(document.querySelector('textarea')&&document.body.textContent?.includes('Private teacher notes'));
 await click('Present learner view');
 assert(document.body.textContent?.includes('Public prompt'));assert(!document.body.innerHTML.includes('PRIVATE_NOTE_992'));assert(!document.body.innerHTML.includes('PRIVATE_ANSWER_883'));assert.equal(document.querySelectorAll('textarea').length,0,'learner display has no private editor DOM');assert(!document.body.textContent?.includes('Private library'));
 await click('Close learner presentation');assert(document.body.textContent?.includes('Private library'));
 await click('Present teacher view');assert(document.body.innerHTML.includes('PRIVATE_ANSWER_883'));await click('Synthetic materialWorksheet · revision 1 · Approved');const previousDeliveries=deliverCalls;await React.act(async()=>{window.dispatchEvent(new dom.window.Event('focus'));await new Promise(r=>setTimeout(r,10));});assert.equal(deliverCalls,previousDeliveries,'material switch does not resurrect old presenter');assert(!document.body.innerHTML.includes('PRIVATE_ANSWER_883'));
 await click('Save material');assert(document.body.textContent?.includes('in-memory draft is preserved'));assert(document.body.textContent?.includes('Conflict'));
 await click('Save as new copy');assert(document.body.textContent?.includes('Outcome not confirmed'));assert(button('Save material').disabled);
 await click('Retry pending operation');assert(document.body.textContent?.includes('Outcome not confirmed'),'500 mutation stays pending');await click('Retry pending operation');assert.equal(createAttempts,3);assert.equal(requestIds[1],requestIds[2]);assert.equal(requestIds[0],requestIds[1],'unknown-outcome retry retains request identity');assert(document.body.textContent?.includes('Saved revision 1'));
 sessionKey='replacement-session';await React.act(async()=>{window.dispatchEvent(new dom.window.Event('focus'));await new Promise(r=>setTimeout(r,10));});assert.equal(document.querySelectorAll('textarea').length,0,'same-user new session clears private draft');
 role='author';await React.act(async()=>{window.dispatchEvent(new dom.window.Event('focus'));await new Promise(r=>setTimeout(r,10));});assert(document.body.textContent?.includes('Administrator sign-in required'));assert(!document.body.innerHTML.includes('PRIVATE_NOTE_992'));assert.equal(document.querySelectorAll('textarea').length,0);
 assert.equal(localStorage.length,0,'no persistent teacher data');
 console.log('Studio actual UI: library/open, physically answer-free learner screen, conflict draft retention, idempotent unknown-outcome retry, role revocation and no local persistent secrets passed.');
}finally{await React.act(async()=>root.unmount());await unlink(bundle);dom.window.close();}
