import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createRunPersistence } from '../src/lib/runPersistence';
import { recordSession } from '../src/lib/quiz';
import { startLessonQuiz, restoreRun, serializeRun, type Session, type RunState } from '../src/lib/session';
import type { AppApi } from '../src/App';
import type { Bank } from '../src/lib/types';

const defer = () => { let resolve!: () => void; const promise = new Promise<void>(r => { resolve = r; }); return { promise, resolve }; };
// Older writes must finish before final snapshot/commit/cleanup, with no late resurrection.
{
 const p=createRunPersistence(),gate=defer(),events:(string|null)[]=[];
 const write=async(text:string|null)=>{events.push(text);if(text==='old')await gate.promise;};
 const a=p.save(write,'old'),b=p.save(write,'new');const done=p.finish(write,'submitted',async()=>{events.push('commit');});
 await p.save(write,'too late');assert.equal(await p.finish(write,'double click',async()=>{}),false);
 await Promise.resolve();assert.deepEqual(events,['old']);gate.resolve();await Promise.all([a,b,done]);
 assert.deepEqual(events,['old','new','submitted','commit',null]);assert(p.closed);await p.save(write,'unmount');assert.equal(events.at(-1),null);
}
// A failed final snapshot cannot commit, and a rejected queued writer does not poison retries.
{
 const p=createRunPersistence();let saved='prior',fail=true,commits=0;
 const write=async(text:string|null)=>{if(fail)throw Error('disk unavailable');saved=text!;};
 await assert.rejects(p.save(write,'autosave'),/unavailable/);
 await assert.rejects(p.finish(write,'current',async()=>{commits++;}),/unavailable/);
 assert.equal(saved,'prior');assert.equal(commits,0);assert(!p.locked);fail=false;
 await p.leave(write,'latest');assert.equal(saved,'latest');assert(p.closed);
}
// Cleanup retries only cleanup. The completed quiz remains frozen while cleanup is pending.
{
 const p=createRunPersistence();let fail=true,commits=0;const values:(string|null)[]=[];
 const write=async(text:string|null)=>{if(text===null&&fail)throw Error('cleanup unavailable');values.push(text);};
 await assert.rejects(p.finish(write,'current',async()=>{commits++;}),/unavailable/);assert(p.committed&&p.locked);
 await p.save(write,'stale');assert.equal(await p.leave(write,'stale'),false);fail=false;
 await p.finish(write,'changed',async()=>{commits++;});assert.equal(commits,1);assert.deepEqual(values,['current',null]);
}

const dom=new JSDOM('<!doctype html><html lang="en"><body><div id="root"></div></body></html>',{url:'https://synthetic.invalid/',pretendToBeVisual:true});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,Element:dom.window.Element,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});dom.window.HTMLElement.prototype.scrollTo=()=>{};dom.window.confirm=()=>true;
// Drive production autosave/clock callbacks explicitly instead of waiting for wall time.
let timerId=0;
const timers=new Map<number,{callback:()=>void,ms:number}>();
dom.window.setInterval=((callback:()=>void,ms:number)=>{const id=++timerId;timers.set(id,{callback,ms});return id;}) as typeof dom.window.setInterval;
dom.window.clearInterval=(id:number|undefined)=>{if(id!==undefined)timers.delete(id);};
const React=await import('react');const {createRoot}=await import('react-dom/client');const {default:Runner}=await import('../src/pages/Runner');const {emptyProgress}=await import('../src/lib/storage');
const bank:Bank={format:'examiner-bank',version:1,id:'synthetic-bank',title:'Synthetic bank',sections:[],exam:{questionCount:1,timeLimitMinutes:1,passingPercent:70},questions:[{id:'one',topic:'Synthetic',stem:'Choose the first answer.',choices:['First','Second'],answer:[0],explanation:'Synthetic test only.'}]};
const session=startLessonQuiz(bank,{courseId:'synthetic-course',lessonId:'one'},['one']);
const initial:RunState={index:0,answers:{one:[0]},flags:{},checked:{one:true},blockIdx:0,blockUsed:[5]};
let mounted:ReturnType<typeof createRoot>|undefined;
const button=(label:string)=>{const b=[...document.querySelectorAll<HTMLButtonElement>('button')].find(b=>b.textContent?.trim()===label);assert(b,`Missing ${label}`);return b;};
const click=async(label:string)=>React.act(async()=>button(label).click());
const tick=async(ms:number)=>React.act(async()=>{for(const timer of timers.values())if(timer.ms===ms)timer.callback();});
function fixture(){
 let saved:string|null=serializeRun(session,initial),failDraft=false,failProgress=false,failCleanup=false,commitThenThrow=false;
 let delay:Promise<void>|null=null;const routes:unknown[]=[],messages:string[]=[],writes:(string|null)[]=[];let commits=0;
 const api={progress:emptyProgress(),courses:[],allCourses:[],banks:[bank],family:null,student:null,
  go:(view:unknown)=>routes.push(view),toast:(message:string)=>messages.push(message),
  saveLearnerSession:async(text:string|null)=>{if(delay)await delay;if(text!==null&&failDraft)throw Error('synthetic draft failure');if(text===null&&failCleanup)throw Error('synthetic cleanup failure');saved=text;writes.push(text);},
  updateProgress:async(fn:(p:ReturnType<typeof emptyProgress>)=>ReturnType<typeof emptyProgress>)=>{commits++;if(failProgress)throw Error('synthetic progress failure');api.progress=fn(api.progress);if(commitThenThrow){commitThenThrow=false;throw Error('uncertain commit acknowledgement');}},
 } as unknown as AppApi;
 return {api,routes,messages,writes,get saved(){return saved;},get commits(){return commits;},draftFailure:(v:boolean)=>{failDraft=v;},progressFailure:(v:boolean)=>{failProgress=v;},cleanupFailure:(v:boolean)=>{failCleanup=v;},uncertainCommit:()=>{commitThenThrow=true;},delay:(v:Promise<void>|null)=>{delay=v;}};
}
async function mount(f:ReturnType<typeof fixture>,s:Session=session,state:RunState=initial){
 if(mounted)await React.act(async()=>mounted!.unmount());mounted=createRoot(document.getElementById('root')!);
 await React.act(async()=>mounted!.render(React.createElement(Runner,{api:f.api,session:s,bank,initial:state})));
}
try{
 // Failed Save & exit stays visible, with no success toast/navigation; retry saves then navigates.
 {
  const f=fixture();await mount(f);f.draftFailure(true);await click('Save & exit');assert.equal(f.routes.length,0);assert(!f.messages.includes('Session saved.'));assert(restoreRun(f.saved!,[bank]));assert.match(document.querySelector('[role=alert]')!.textContent!,/draft failure/);
  f.draftFailure(false);await click('Retry save and exit');assert.equal(f.routes.length,1);assert(f.messages.includes('Session saved.'));
 }
 // Navigation cannot run ahead of a delayed write.
 {
  const f=fixture();await mount(f);const gate=defer();f.delay(gate.promise);await click('Save & exit');assert.equal(f.routes.length,0);assert(!f.messages.includes('Session saved.'));assert.equal(document.querySelector('.runner')!.getAttribute('aria-busy'),'true');
  await React.act(async()=>{gate.resolve();await gate.promise;});assert.equal(f.routes.length,1);
 }
 // Failed progress preserves an up-to-date recoverable draft, then retries normally.
 {
  const f=fixture();await mount(f);f.progressFailure(true);await click('See results');assert.equal(f.routes.length,0);assert.equal(f.api.progress.attempts.length,0);assert(restoreRun(f.saved!,[bank]));assert(!document.querySelector('.sheet-side')!.hasAttribute('inert'));
  await tick(15000);assert(button('Retry submission'),'A later successful autosave must leave the submission retry available');
  f.progressFailure(false);await click('Retry submission');assert.equal(f.api.progress.attempts.length,1);assert.equal(f.saved,null);assert.equal(f.routes.length,1);
 }
 // Failed cleanup freezes the submitted run; double retry cannot create another attempt.
 {
  const f=fixture();await mount(f);f.cleanupFailure(true);await click('See results');assert.equal(f.api.progress.attempts.length,1);assert.equal(f.routes.length,0);assert(restoreRun(f.saved!,[bank]));assert(document.querySelector('.sheet-side')!.hasAttribute('inert'));
  const before=JSON.stringify(f.api.progress);const gate=defer();f.cleanupFailure(false);f.delay(gate.promise);await React.act(async()=>{const retry=button('Finish saving');retry.click();retry.click();});assert.equal(f.commits,1);
  await React.act(async()=>{gate.resolve();await gate.promise;});assert.equal(f.saved,null);assert.equal(f.routes.length,1);assert.equal(JSON.stringify(f.api.progress),before);
 }
 // Remounting the stale draft after a committed attempt must not duplicate stats/activity.
 {
  const f=fixture();await mount(f);f.cleanupFailure(true);await click('See results');const restored=restoreRun(f.saved!,[bank])!;assert(restored);const before=JSON.stringify(f.api.progress);
  f.cleanupFailure(false);await mount(f,restored.session,restored.state);await click('See results');assert.equal(f.api.progress.attempts.length,1);assert.equal(JSON.stringify(f.api.progress),before);assert.equal(f.saved,null);
 }
 // An ambiguous acknowledgement after commit is also safe to retry against latest progress.
 {
  const f=fixture();await mount(f);f.uncertainCommit();await click('See results');assert.equal(f.api.progress.attempts.length,1);assert(restoreRun(f.saved!,[bank]));const before=JSON.stringify(f.api.progress);
  await click('Retry submission');assert.equal(JSON.stringify(f.api.progress),before);assert.equal(f.saved,null);
 }
 // Expiry attempts one save, freezes answers and permits an explicit recovery retry.
 {
  const f=fixture();f.progressFailure(true);
  const exam:Session={...session,lesson:undefined,mode:'exam',blocks:[{start:0,end:1,timeLimitSec:1}],timeLimitSec:1};
  await mount(f,exam);assert.equal(f.commits,1);assert.equal(f.routes.length,0);
  await tick(500);await tick(500);assert.equal(f.commits,1,'Failed expiry must not spin on each clock tick');
  assert.equal(f.messages.filter(m=>m==="Time's up. Saving your exam.").length,1);
  assert(!f.messages.some(m=>m.includes('was submitted')));
  assert(document.querySelector('.sheet-side')!.hasAttribute('inert'));
  await React.act(async()=>document.querySelector<HTMLButtonElement>('[data-choice="1"]')!.click());
  await tick(15000);assert.deepEqual(restoreRun(f.saved!,[bank])!.state.answers.one,[0]);
  f.progressFailure(false);await click('Retry submission');assert.equal(f.api.progress.attempts[0].correct,1);assert.equal(f.saved,null);assert.equal(f.routes.length,1);
 }
 // Empty quizzes and warm-ups retain their existing exit/progress semantics.
 {
  const f=fixture();await mount(f,session,{...initial,answers:{},checked:{}});
  await click('Finish quiz');assert.equal(f.commits,0);assert.equal(f.saved,null);assert.equal(f.api.progress.attempts.length,0);assert.equal(f.routes.length,1);
 }
 {
  const f=fixture();const warmup:Session={...session,lesson:undefined,kind:'pretest',pretestLesson:session.lesson};await mount(f,warmup);
  await click('See results');assert.equal(f.commits,1);assert.equal(f.api.progress.attempts.length,0);assert.equal(f.saved,null);assert.equal(f.routes.length,1);
  assert(f.messages.includes('Now read the lesson. The answers to the warm-up are in it.'));
 }
 // Same run is idempotent; a genuinely new quiz still records new practice.
 {
  const one=recordSession(emptyProgress(),session,initial.answers,{},bank,5);const repeated=recordSession(one.progress,session,{one:[1]},{},bank,99);assert.equal(repeated.progress,one.progress);assert.equal(repeated.attempt,one.attempt);
  const again=recordSession(one.progress,{...session,id:'new-session'},initial.answers,{},bank,5);assert.equal(again.progress.attempts.length,2);assert.equal(again.progress.stats[bank.id].one.seen,2);
 }
 console.log('Runner save recovery: ordered writes, failed/slow exit, failed commit, cleanup/double retry, recovered committed attempts, uncertain acknowledgement, expiry, empty quizzes and warm-ups pass');
}finally{if(mounted)await React.act(async()=>mounted!.unmount());dom.window.close();}
