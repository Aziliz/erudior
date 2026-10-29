import assert from 'node:assert/strict';
import {createDocumentEngineStore,deleteDocumentStudent} from '../src/lib/documentEngineStore.ts';
import {emptyDocumentTemplate,parseDocumentLibrary} from '../src/lib/documentEngine.ts';
import {stateTransactions,validStateName} from '../src/lib/stateLock.ts';
let text:string|null=null,profile='alice',authority='adult1',tick=0;
const tx=stateTransactions({read:async()=>text,write:async(_,v)=>{text=v;},compareAndSwap:async(_,old,next)=>{if(text!==old)return false;text=next;return true;}});
const io={read:async()=>text,update:(fn:any)=>tx.update('document-engine',fn),authorizeAdult:async(id?:string)=>{if(id&&!['alice','bob'].includes(id))throw Error('No profile');return {actorId:'adult',actorName:'Teacher',authorityKey:authority};},learnerContext:async()=>({studentId:profile,authorityKey:'learner:'+profile}),now:()=>new Date(Date.UTC(2026,9,29,0,0,tick++)).toISOString()};
const {supervisor:adult,learner}=createDocumentEngineStore(io);
assert(validStateName('document-engine'));for(const id of ['../document-engine','document-engine/other','document-engine-extra'])assert(!validStateName(id));
const input=emptyDocumentTemplate('form');input.pages[0].text='Educational source text';input.fields=[{id:'answer',pageId:'page1',label:'Answer',kind:'text',required:true}];
const saved=await adult.saveTemplate(input,null);assert.equal(saved.revision,1);assert(!saved.approval);assert.deepEqual(await adult.saveTemplate(input,null),saved,'save retry does not duplicate source');
await assert.rejects(adult.assign({id:'case',studentId:'alice',title:'Case',instructions:'Review the educational source.',documents:[saved]},null));
const approved=await adult.approveTemplate('form',1);assert.deepEqual(await adult.approveTemplate('form',1),approved);
const assigned=await adult.assign({id:'case',studentId:'alice',title:'Case',instructions:'Review the educational source.',documents:[approved]},null);
const response={values:{form:{answer:'Learner response'}},annotations:[{id:'note',documentId:'form',pageId:'page1',note:'Evidence',quote:{start:0,end:11,text:'Educational'}}]};
await assert.rejects(learner.submit('case',1,{values:{},annotations:[]},'bad',null));
const draft=await learner.saveDraft('case',1,response,null);assert.equal(draft.revision,1);assert.deepEqual(await learner.saveDraft('case',1,response,null),draft);
const snapshot=await learner.submit('case',1,response,'submission',1);assert.deepEqual(await learner.submit('case',1,response,'submission',1),snapshot);
await assert.rejects(learner.submit('case',1,{...response,values:{form:{answer:'Changed'}}},'submission',1));
const review=await adult.review({id:'feedback',submissionId:'submission',status:'needs_revision',note:'Explain the evidence.'});assert.deepEqual(await adult.review({id:'feedback',submissionId:'submission',status:'needs_revision',note:'Explain the evidence.'}),review);
await assert.rejects(adult.review({id:'feedback',submissionId:'submission',status:'reviewed',note:'Changed'}));
await adult.saveTemplate({...approved,title:'Private unsent source draft'},1);
let view=await learner.load();assert.equal(view.templates.length,1);assert.equal(view.templates[0].title,approved.title);assert.equal(view.feedback.length,1);
profile='bob';view=await learner.load();assert.equal(view.assignments.length,0);assert.equal(view.submissions.length,0);assert.equal(view.templates.length,0);await assert.rejects(learner.saveDraft('case',1,response,1));profile='alice';
// Old assignments, exact source and feedback survive new source review and reassignment.
const approved2=await adult.approveTemplate('form',2);const assigned2=await adult.assign({...assigned,documents:[approved2]},1);assert.equal(assigned2.revision,2);await assert.rejects(learner.saveDraft('case',1,response,1));assert.deepEqual((await adult.load()).submissions[0],snapshot);
const results=await Promise.allSettled([learner.saveDraft('case',2,response,null),learner.saveDraft('case',2,{...response,values:{form:{answer:'Concurrent'}}},null)]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1,'CAS does not overwrite another answer');
// Recheck identity after asynchronous IO, including load.
const changed=createDocumentEngineStore({...io,read:async()=>{profile='bob';return text;}});profile='alice';await assert.rejects(changed.learner.load(),/profile changed/);profile='alice';
const adultChanged=createDocumentEngineStore({...io,update:async(fn:any)=>{authority='adult2';return tx.update('document-engine',fn);}});const before=text;await assert.rejects(adultChanged.supervisor.saveTemplate(emptyDocumentTemplate('other'),null),/authority changed/);assert.equal(text,before);
const learnerChanged=createDocumentEngineStore({...io,update:async(fn:any)=>{profile='bob';return tx.update('document-engine',fn);}});profile='alice';const beforeSwitch=text;await assert.rejects(learnerChanged.learner.saveDraft('case',2,response,1),/profile changed/);assert.equal(text,beforeSwitch);profile='alice';
// A profile removed between the first read and CAS wins, never resurrecting drafts.
let first=true;const racingTx=stateTransactions({read:async()=>text,write:async(_,value)=>{text=value;},compareAndSwap:async(_,old,next)=>{if(first){first=false;text=JSON.stringify(deleteDocumentStudent(parseDocumentLibrary(text),'alice'));return false;}if(text!==old)return false;text=next;return true;}});
const raced=createDocumentEngineStore({...io,update:(fn:any)=>racingTx.update('document-engine',fn)});
await assert.rejects(raced.learner.saveDraft('case',2,response,1),/deleted/);assert.equal(parseDocumentLibrary(text).drafts.length,0);
text=JSON.stringify(deleteDocumentStudent(parseDocumentLibrary(text),'alice'));assert.equal(parseDocumentLibrary(text).submissions.length,0);await assert.rejects(learner.load(),/deleted/);await assert.rejects(adult.assign({...assigned,id:'resurrect'},null),/deleted/);assert.deepEqual(deleteDocumentStudent(parseDocumentLibrary(text),'alice'),parseDocumentLibrary(text));
console.log('document store: exact approved revisions, CAS conflicts, retry idempotence, immutable evidence, scoped privacy, fresh identities and deletion tombstones passed');
