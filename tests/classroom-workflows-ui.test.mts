import assert from 'node:assert/strict';
import { register } from 'node:module';
import { JSDOM } from 'jsdom';
// JSDOM verifies component interactions, not CSS layout; real browser CI owns styling.
register(`data:text/javascript,${encodeURIComponent("export async function load(url,context,next){if(url.endsWith('.css'))return {format:'module',source:'export default {}',shortCircuit:true};return next(url,context);}")}`,import.meta.url);
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,HTMLTextAreaElement:dom.window.HTMLTextAreaElement,HTMLSelectElement:dom.window.HTMLSelectElement,localStorage:dom.window.localStorage,sessionStorage:dom.window.sessionStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react'),{createRoot}=await import('react-dom/client');
const {default:Workspace}=await import('../src/pages/ClassroomWorkflowWorkspace.tsx');
const {createClassroomWorkflowStore}=await import('../src/lib/classroomWorkflowStore.ts');
const {parseClassroomWorkflowState,latestWorkflowItems}=await import('../src/lib/classroomWorkflows.ts');
const {configureLocalSession,unlockLocalAdult,unlockLocalLearner,lockLocalSession}=await import('../src/lib/localSession.ts');
const {requestNavigation}=await import('../src/lib/navigationGuard.ts');
const family:any={format:'erudior-family',version:1,mode:'classroom',parent:{password:'synthetic'},students:['alice','bob','outsider'].map(id=>({id,name:id[0].toUpperCase()+id.slice(1),grade:5,assigned:[],freeChoice:false})),classes:[{id:'class1',name:'Synthetic class',students:['alice','bob','outsider'],assignments:[{courseId:'course1'}],handins:{},freeChoice:false}],reminders:[],done:[]};
const source={key:'receipt:work',studentId:'alice',receiptId:'["class1","alice","mac"]',version:'mac',text:'Exact immutable source text'};
let raw:string|null=null,who='bob',failAfterWrite=false,reads=0;
const io:any={read:async()=>{reads++;return raw;},update:async(fn:any)=>{const next=await fn(raw);raw=next;if(failAfterWrite){failAfterWrite=false;throw Error('Synthetic lost save acknowledgment');}return next;},authorizeAdult:async()=>({authorityKey:'teacher'}),learnerContext:async()=>({studentId:who}),family:async()=>structuredClone(family),resolvePeerSource:async(classId:string,key:string)=>{assert.equal(classId,'class1');assert.equal(key,source.key);return {...source,classId,courseId:'course1'};},peerSourceCurrent:async()=>true,now:()=> '2026-10-31T02:00:00.000Z'};
const root=createRoot(document.getElementById('root')!);
const sentIds:string[]=[];
let api:any,teacher=true,backing:ReturnType<typeof createClassroomWorkflowStore>;
configureLocalSession(true);
const render=async()=>React.act(async()=>root.render(React.createElement(Workspace,{api,teacher})));
async function role(adult:boolean,id='bob'){
  teacher=adult;who=id;if(adult)unlockLocalAdult();else unlockLocalLearner(id);
  backing=createClassroomWorkflowStore(io);
  api={homeschool:true,family,student:adult?null:family.students.find((s:any)=>s.id===id),allCourses:[{id:'course1',title:'Synthetic assigned course'}],classroomWorkflows:{...backing,respond:async(...args:Parameters<typeof backing.respond>)=>{sentIds.push(args[2].id);return backing.respond(...args);}},classroomPeerSources:async()=>[{...source,classId:'class1',courseId:'course1',label:'Alice exact hand-in'}],toast:()=>{},go:()=>{}};
  await render();
}
const button=(label:string,within:ParentNode=document)=>{const found=[...within.querySelectorAll<HTMLButtonElement>('button')].find(b=>b.textContent===label);assert(found,`Missing button ${label}`);return found;};
async function click(label:string,within:ParentNode=document){const b=button(label,within);assert(!b.disabled,`Disabled button ${label}`);await React.act(async()=>b.click());}
const field=(label:string,within:ParentNode=document)=>{const e=within.querySelector<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>(`[aria-label="${label}"]`);assert(e,`Missing field ${label}`);return e;};
async function input(label:string,value:string,within:ParentNode=document){const e=field(label,within);await React.act(async()=>{const proto=e.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:e.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(e,value);e.dispatchEvent(new dom.window.Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));});}
async function member(name:string){const e=[...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].find(e=>e.parentElement?.textContent===name);assert(e,`Missing member ${name}`);await React.act(async()=>e.click());}
const state=()=>parseClassroomWorkflowState(raw);
const item=()=>latestWorkflowItems(state()).find(i=>i.kind==='project')!;
const card=()=>{const e=document.querySelector<HTMLElement>(`section[aria-label="${item().title}"]`);assert(e,'Missing project card');return e;};
function external(change:(s:ReturnType<typeof state>)=>void){const s=state();change(s);s.revision++;raw=JSON.stringify(parseClassroomWorkflowState(s));}
await role(true);assert.equal(field('Class').tagName,'SELECT');
await click('Groups');await click('New group');await input('Group name','Synthetic team');await member('Alice');await member('Bob');assert.equal(requestNavigation(),false);await click('Save group');assert.equal(state().groups.length,1);assert.equal(requestNavigation(),true);
await click('Projects');await click('New project');await input('Title','Collaborative project');await input('Instructions','Complete the first milestone.');await input('Assigned course','course1');await input('Audience group',state().groups[0].id);await input('Milestones (one per line)','First milestone');await click('Save draft');assert.equal(item().published,false);await click('Publish',card());assert.equal(item().published,true);
// Real component + service learner contribution and repeated-click guard.
await role(false,'bob');assert(document.querySelector('.page.classroom-workflows'));await input('Milestone',item().milestones![0].id,card());await input('Response text','Bob shared contribution',card());assert.equal(requestNavigation(),false);await React.act(async()=>{const b=button('Submit response',card());b.click();b.click();});assert.equal(state().responses.length,1);assert.equal(requestNavigation(),true);
await role(false,'alice');assert(!document.body.textContent!.includes('Bob shared contribution'),'unmoderated contribution is private');
await role(true);await click('Review response',card());await input('Review note','Private evaluation for Bob only',card());await input('Review status','reviewed',card());await click('Release review',card());
await role(false,'alice');assert(document.body.textContent!.includes('Bob shared contribution'));assert(!document.body.textContent!.includes('Private evaluation for Bob only'));
await role(false,'bob');assert(document.body.textContent!.includes('Private evaluation for Bob only'));
await role(false,'outsider');assert(!document.body.textContent!.includes('Collaborative project'));assert(!document.body.textContent!.includes('Bob shared contribution'));
// A conflicting teacher edit keeps its captured revision and text after refresh.
await role(true);await click('Edit',card());await input('Title','My unsaved title');const prior=item();const externalTeacher=createClassroomWorkflowStore(io);await externalTeacher.saveItem({...((({revision,published,revoked,createdAt,...input})=>input)(prior)),title:'Other window title'},prior.revision);
await click('Save draft');assert.match(document.body.textContent!,/changed elsewhere|Item changed/);assert.equal(field('Title').value,'My unsaved title');await click('Refresh classroom');assert.equal(field('Title').value,'My unsaved title');await click('Save draft');assert.match(document.body.textContent!,/Item changed/);assert.equal(item().title,'Other window title');await click('Cancel changes');assert.equal(requestNavigation(),true);await click('Publish',card());
// Uncertain save + withdrawal retains own text AND stable retry identity across remount.
await role(false,'bob');await input('Milestone',item().milestones![0].id,card());await input('Response text','Uncertain retained contribution',card());failAfterWrite=true;await click('Submit response',card());assert.match(document.body.textContent!,/lost save acknowledgment/);assert.equal(field('Response text',card()).value,'Uncertain retained contribution');const uncertainId=sentIds.at(-1);assert(state().responses.some(r=>r.id===uncertainId));external(s=>{latestWorkflowItems(s).find(i=>i.id===item().id)!.published=false;});await click('Refresh classroom');assert.equal(field('Retained response text').value,'Uncertain retained contribution');assert.equal(document.querySelector('[role="status"]')?.textContent,'','refresh clears stale saved status without discarding draft');assert(!document.querySelector('section[aria-label="Other window title"]'));
external(s=>{latestWorkflowItems(s).find(i=>i.id===item().id)!.published=true;});await click('Refresh classroom');assert.equal(field('Response text',card()).value,'Uncertain retained contribution');await click('Submit response',card());assert.equal(sentIds.at(-1),uncertainId);assert.equal(state().responses.filter(r=>r.text==='Uncertain retained contribution').length,1);assert.equal(requestNavigation(),true);
// Locks invalidate service callbacks. Fresh same-learner authorization preserves an open draft.
await input('Milestone',item().milestones![0].id,card());await input('Response text','Draft across lock',card());lockLocalSession();await click('Submit response',card());assert.match(document.body.textContent!,/session/);assert.equal(field('Retained response text').value,'Draft across lock');await role(false,'bob');assert.equal(field('Response text',card()).value,'Draft across lock');await click('Cancel response',card());assert.equal(requestNavigation(),true);
// A role/profile switch never renders a preceding learner's draft or private review.
await input('Response text','Bob unsaved private draft',card());await role(false,'alice');assert(!document.body.textContent!.includes('Bob unsaved private draft'));assert(!document.body.textContent!.includes('Private evaluation for Bob only'));assert.equal(field('Response text',card()).value,'');
// Exact source selection and moderated peer feedback never expose the reviewer’s private note.
await role(true);await click('Peer review');await click('New peer review');await input('Title','Peer critique');await input('Approved submission',source.key);await member('Bob');await click('Save draft');const peerCard=()=>document.querySelector<HTMLElement>('section[aria-label="Peer critique"]')!;await click('Publish',peerCard());
await role(false,'bob');await click('Peer review');assert(peerCard().textContent!.includes(source.text));await input('Response text','Constructive peer feedback',peerCard());await click('Submit response',peerCard());
await role(false,'alice');await click('Peer review');assert(!peerCard().textContent!.includes('Constructive peer feedback'));
await role(true);await click('Peer review');await click('Review response',peerCard());await input('Review note','Private reviewer evaluation',peerCard());await click('Release review',peerCard());
await role(false,'alice');await click('Peer review');assert(peerCard().textContent!.includes('Constructive peer feedback'));assert(!peerCard().textContent!.includes('Private reviewer evaluation'));
await role(false,'bob');await click('Peer review');assert(peerCard().textContent!.includes('Private reviewer evaluation'));
// Supplemental editor labels, cancellation, schedule fields and local-only messaging.
await role(true);for(const [tab,kind] of [['Conferences','conference'],['Notices','notice'],['Field trips','field trip']] as const){await click(tab);await click(`New ${kind}`);await input('Title',`Canceled ${kind}`);if(kind!=='notice'){await input('Scheduled time','2026-11-02T09:00');}if(kind==='conference'){await input('Private teacher note','Private scheduling note');await input('Action items (one per line)','Bring draft');}if(kind==='field trip')await input('Location','Synthetic museum');assert.equal(requestNavigation(),false);await click('Cancel changes');assert.equal(requestNavigation(),true);assert(!state().items.some(i=>i.title===`Canceled ${kind}`));}
assert.match(document.body.textContent!,/not remote messages or video calls/);
const beforePublic=reads;api={...api,homeschool:false};await render();assert.equal(reads,beforePublic,'public availability guidance never reads private classroom state');assert.match(document.body.textContent!,/No learner records are opened here/);assert(!document.body.textContent!.includes(source.text));
await React.act(async()=>root.unmount());configureLocalSession(false);assert.equal(requestNavigation(),true);
console.log('Classroom component integration passed: project/group and exact peer review, moderation privacy, accessible fields, conflicts/cancel, lock/role isolation, uncertain-save withdrawal retry identity.');
