import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import type { AppApi } from '../src/App';
import type { Bank } from '../src/lib/types';
import type { Session } from '../src/lib/session';

const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://synthetic.invalid/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,HTMLTextAreaElement:dom.window.HTMLTextAreaElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
dom.window.HTMLElement.prototype.scrollTo=()=>{};
const React=await import('react');
const {createRoot}=await import('react-dom/client');
const {default:Runner}=await import('../src/pages/Runner');
const {emptyProgress}=await import('../src/lib/storage');
const {configureLocalSession,unlockLocalLearner,lockLocalSession,captureLocalSession,assertLocalLearner}=await import('../src/lib/localSession');
const bank={format:'examiner-bank',version:1,id:'synthetic-bank',title:'Synthetic session',sections:[],exam:{count:1,minutes:10},questions:[{id:'one',stem:'Synthetic question: choose one.',choices:['First','Second'],answer:[0],explanation:'Synthetic only.'}]} as Bank;
const session:Session={id:'synthetic-session',bankId:bank.id,bankTitle:bank.title,mode:'practice',items:[{q:bank.questions[0],order:[0,1]}],blocks:[{start:0,end:1}],startedAt:Date.now()};
const saved:{id:string;content:string|null}[]=[],rejected:string[]=[],routes:unknown[]=[];
const progress=emptyProgress();
function apiFor(id:string):AppApi{
 const guard=captureLocalSession();
 return {family:{},student:{id,name:id},courses:[],allCourses:[],banks:[bank],progress,
  go:(v:unknown)=>routes.push(v),toast:()=>{},updateProgress:async()=>{},
  saveLearnerSession:async(content:string|null)=>{try{guard();assertLocalLearner(id);saved.push({id,content});}catch(e){rejected.push((e as Error).message);throw e;}},
 } as unknown as AppApi;
}
const root=createRoot(document.getElementById('root')!);
let api:AppApi;
const render=()=>React.act(async()=>root.render(React.createElement(Runner,{api,bank,session})));
const choice=(n:number)=>document.querySelector<HTMLButtonElement>(`[data-choice="${n}"]`)!;
try{
 configureLocalSession(true);unlockLocalLearner('alice');api=apiFor('alice');
 const oldWriter=api.saveLearnerSession!;
 await render();await React.act(async()=>choice(0).click());
 assert.equal(choice(0).getAttribute('aria-checked'),'true');
 assert.deepEqual(JSON.parse(saved.at(-1)!.content!).state.answers.one,[0]);
 const beforeLock=saved.length;
 lockLocalSession();
 await React.act(async()=>{await assert.rejects(oldWriter('old callback'),/session changed|locked/);});
 assert.equal(saved.length,beforeLock,'old callback cannot persist while locked');
 unlockLocalLearner('alice');api=apiFor('alice');await render();
 assert.equal(choice(0).getAttribute('aria-checked'),'true','same mounted Runner retains its answer through reauthentication');
 assert(saved.length>beforeLock,'new same-learner API writer autosaves retained draft');
 assert.deepEqual(JSON.parse(saved.at(-1)!.content!).state.answers.one,[0]);
 await React.act(async()=>{await assert.rejects(oldWriter('old callback after new grant'),/session changed|locked/);});
 await React.act(async()=>choice(1).click());
 assert.deepEqual(JSON.parse(saved.at(-1)!.content!).state.answers.one,[1],'fresh API writer saves subsequent answer edits');
 const beforeSibling=saved.length;
 unlockLocalLearner('bob');api=apiFor('bob');await render();
 assert.equal(choice(1).getAttribute('aria-checked'),'true','synthetic forced identity replacement does not silently clear existing answer draft');
 assert.equal(saved.length,beforeSibling,'original Alice Runner cannot autosave into Bob');
 assert.match(document.querySelector('[role=alert]')?.textContent??'',/Learner changed\. Reopen this session for its original learner/);
 await React.act(async()=>choice(0).click());
 assert.equal(saved.length,beforeSibling,'subsequent interaction cannot save old Runner under another learner');
 assert(saved.every(value=>value.id==='alice'));
 assert.equal(routes.length,0);
 console.log('Actual Runner retains same-learner answer draft, renews its writer, rejects old grants and never writes another learner');
}finally{await React.act(async()=>root.unmount());configureLocalSession(false);dom.window.close();}
