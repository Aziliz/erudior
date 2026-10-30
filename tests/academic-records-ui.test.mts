import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import type { AppApi } from '../src/App';
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test/?guest=1'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,HTMLSelectElement:dom.window.HTMLSelectElement,HTMLTextAreaElement:dom.window.HTMLTextAreaElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
let allowNavigation=true;dom.window.confirm=()=>allowNavigation;
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react');const {createRoot}=await import('react-dom/client');
const {requestNavigation}=await import('../src/lib/navigationGuard');
const {default:Workspace}=await import('../src/components/AcademicRecordsWorkspace');
const store=await import('../src/lib/storage');const records=await import('../src/lib/records');const {createFamily}=await import('../src/lib/family');
const {family}=await createFamily({state:'',route:'Synthetic local plan',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password:'Synthetic test password',students:[{name:'Synthetic Alice',grade:10},{name:'Synthetic Bob',grade:9}]});
const [alice,bob]=family.students.map(s=>s.id);const notices:string[]=[];
let authorized=true;
const api={allCourses:[],authorizeAcademicRecords:async(id:string)=>{if(!authorized||![alice,bob].includes(id))throw Error("Adult authorization revoked");},toast:(s:string)=>notices.push(s)} as unknown as AppApi;
const root=createRoot(document.getElementById('root')!);await React.act(async()=>root.render(React.createElement(Workspace,{api,family})));
function button(label:string){const b=[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()===label);assert(b,`Missing button ${label}`);return b;}
async function click(label:string){await React.act(async()=>button(label).click());}
function field(label:string){const wrapper=[...document.querySelectorAll('label')].find(x=>x.textContent?.trim().startsWith(label));const f=wrapper?.querySelector<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input,select,textarea');assert(f,`Missing field ${label}`);return f;}
async function fill(label:string,value:string){const f=field(label);const prototype=f.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:f.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await React.act(async()=>{Object.getOwnPropertyDescriptor(prototype,'value')!.set!.call(f,value);f.dispatchEvent(new dom.window.Event(f.tagName==='SELECT'?'change':'input',{bubbles:true}));});}
async function check(label:string){await React.act(async()=>(field(label) as HTMLInputElement).click());}
assert.match(document.body.textContent!,/not an accredited transcript/);
await click('Edit planning policy');await fill('Policy name','Synthetic goals');await fill('Total credits required','2');await click('Add subject requirement');await fill('Subject','Science');await fill('Required credits','2');await click('Save planning policy');assert.equal((await records.loadRecords(alice)).academic?.policy.totalCredits,2);
await click('Edit planning policy');await fill('Policy name','Canceled');await click('Cancel policy changes');assert.equal((await records.loadRecords(alice)).academic?.policy.name,'Synthetic goals');
await click('Add transfer or local credit');await fill('Credit title','Synthetic transfer');await fill('Credit subject','Science');await fill('Completion date','2025-05-20');await fill('Planning credits','2');await fill('Evidence reference','Synthetic portfolio');await fill('Correction or review note','<img src=x onerror="globalThis.injected=1">');await check('I reviewed this statement');await click('Save credit statement');
assert.equal((await records.loadRecords(alice)).academic?.claims.length,1);assert.match(document.body.textContent!,/planning requirements met/);assert.equal(document.querySelector('img'),null);
await click('Review or correct Synthetic transfer');await fill('Planning credits','1');await click('Save credit statement');assert.equal((await records.loadRecords(alice)).academic?.claims.length,1);assert.equal((await records.loadRecords(alice)).academic?.claims[0].credits,1);
await click('Review or correct Synthetic transfer');await fill('Credit title','Canceled');await click('Cancel credit changes');assert.equal((await records.loadRecords(alice)).academic?.claims[0].title,'Synthetic transfer');
await click('Remove planning entry Synthetic transfer');await click('Cancel removal');assert.equal((await records.loadRecords(alice)).academic?.claims.length,1);
await click('Preview records export');assert.match(document.querySelector('pre')!.textContent!,/erudior-academic-planning/);await click('Cancel export');assert.equal(document.querySelector('pre'),null);
await fill('Remove planning entries before','2026-01-01');await click('Preview local cleanup');await click('Cancel cleanup');assert.equal((await records.loadRecords(alice)).academic?.claims.length,1);
// Another timer-like writer advances revision while an adult form stays open.
await click('Review or correct Synthetic transfer');await fill('Correction or review note','Stale draft');await records.updateRecordsAtomic(alice,r=>({...r,manual:[{id:'manual',date:'2026-10-30',minutes:2,subject:'Science',note:'Concurrent'}]}));await click('Save credit statement');assert.match(notices.at(-1)!,/changed/);assert.equal((field('Correction or review note') as HTMLTextAreaElement).value,'Stale draft');assert.equal((await records.loadRecords(alice)).manual.length,1);await click('Cancel credit changes');await click('Reload records');
// Student changes clear pending forms and never migrate prior student data.
await click('Add transfer or local credit');await fill('Credit title','Unsaved Alice');allowNavigation=false;assert.equal(requestNavigation('history'),false);assert.equal(requestNavigation('app',{name:'progress'}),false);await fill('Student',bob);assert.equal(field('Student').value,alice);allowNavigation=true;await fill('Student',bob);assert.equal(document.querySelector('input[value="Unsaved Alice"]'),null);assert.equal((await records.loadRecords(bob)).academic,undefined);assert.doesNotMatch(document.body.textContent!,/Credit: Synthetic transfer/);
await fill('Student',alice);
// Adult authorization is rechecked after an asynchronous write wait, not captured once.
let releaseAuthorization!:()=>void;const authGate=new Promise<void>(resolve=>releaseAuthorization=resolve);let authHeld=false;
Object.defineProperty(navigator,'locks',{configurable:true,value:{request:async(name:string,_options:unknown,work:()=>Promise<unknown>)=>{if(name===`erudior.state.records-${alice}`&&!authHeld){authHeld=true;await authGate;}return work();}}});
await click('Review or correct Synthetic transfer');await fill('Correction or review note','Unauthorized queued change');await click('Save credit statement');assert(authHeld);authorized=false;await React.act(async()=>releaseAuthorization());assert.notEqual((await records.loadRecords(alice)).academic?.claims[0].note,'Unauthorized queued change');assert.match(notices.at(-1)!,/authorization revoked/);authorized=true;Object.defineProperty(navigator,'locks',{configurable:true,value:undefined});await click('Cancel credit changes');await click('Reload records');
// A pending write blocks profile navigation and remains confined to its captured learner.
let releaseWrite!:()=>void;const gate=new Promise<void>(resolve=>releaseWrite=resolve);let held=false;
Object.defineProperty(navigator,'locks',{configurable:true,value:{request:async(name:string,_options:unknown,work:()=>Promise<unknown>)=>{if(name===`erudior.state.records-${alice}`&&!held){held=true;await gate;}return work();}}});
await click('Review or correct Synthetic transfer');await fill('Correction or review note','Must not cross profiles');await click('Save credit statement');assert(held);await fill('Student',bob);assert.equal(field('Student').value,alice);assert.equal(requestNavigation('history'),false);await React.act(async()=>releaseWrite());assert.equal((await records.loadRecords(alice)).academic?.claims[0].note,'Must not cross profiles');assert.equal((await records.loadRecords(bob)).academic,undefined);Object.defineProperty(navigator,'locks',{configurable:true,value:undefined});await fill('Student',alice);
// Failed cleanup cannot falsely report success or remove selected claims.
await fill('Remove planning entries before','2026-01-01');await click('Preview local cleanup');
Object.defineProperty(navigator,'locks',{configurable:true,value:{request:async()=>{throw Error('Synthetic storage write failure');}}});await click('Confirm local cleanup');assert.equal((await records.loadRecords(alice)).academic?.claims.length,1);assert.match(notices.at(-1)!,/Synthetic storage write failure/);Object.defineProperty(navigator,'locks',{configurable:true,value:undefined});await click('Cancel cleanup');await click('Reload records');
await fill('Remove planning entries before','2026-01-01');await click('Preview local cleanup');await click('Confirm local cleanup');assert.equal((await records.loadRecords(alice)).academic?.claims.length,0);assert.equal((await records.loadRecords(alice)).manual.length,1);assert((await records.loadRecords(alice)).audit!.length>=4);
// Damaged JSON is preserved, not converted into an empty editable profile.
await store.saveState(`records-${bob}`,'{synthetic damaged');await fill('Student',bob);assert.match(document.querySelector('[role=alert]')!.textContent!,/quarantin/i);assert.equal(await store.loadState(`records-${bob}`),'{synthetic damaged');assert.equal([...document.querySelectorAll('button')].some(b=>b.textContent==='Add transfer or local credit'),false);await click('Reload records');assert.equal(await store.loadState(`records-${bob}`),'{synthetic damaged');
await React.act(async()=>root.unmount());console.log('Academic records UI: policy, reviewed credit corrections, cancel, export preview, CAS conflict, profile isolation, explicit retention and malformed quarantine passed.');

const { pathToView, viewToPath } = await import('../src/lib/routes.ts');
assert.deepEqual(pathToView('/parent/academic-records','',[],[]),{name:'parent',tab:'academic-records'});
assert.equal(viewToPath({name:'parent',tab:'academic-records'},[],()=>undefined),'/parent/academic-records');
