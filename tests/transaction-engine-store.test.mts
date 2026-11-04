import assert from 'node:assert/strict';
import { createTransactionEngineStore, deleteTransactionStudent } from '../src/lib/transactionEngineStore.ts';
import { parseTransactionLibrary, type TransactionPack } from '../src/lib/transactionEngine.ts';
import { emptyDocumentTemplate } from '../src/lib/documentEngine.ts';
import { stateTransactions, validStateName } from '../src/lib/stateLock.ts';

const source = emptyDocumentTemplate('source');
source.revision = 1;
source.fields = [{id:'answer',pageId:'page1',label:'Reasoning',kind:'text',required:true}];
const pack: TransactionPack = {
  format:'erudior-transaction-pack',version:1,id:'pack',revision:0,title:'Synthetic transaction',
  jurisdiction:{id:'synthetic',name:'Synthetic educational jurisdiction',version:'test1',sourceNote:'Fictional test source, not law',effectiveFrom:'2026-01-01',effectiveThrough:'2027-12-31'},
  currency:'USD',minorUnitDigits:2,documents:[source],formRoles:[{documentId:'source',role:'Educational agreement'}],
  clients:[{id:'buyer',name:'Fictional buyer'},{id:'other',name:'Fictional other client'}],contingencies:[],
  rules:{requireRepresentation:true,requireDocumentsForClose:true,requireReconciliationForClose:true,requireZeroTrustForArchive:true,minEarnestBasisPoints:0,depositDueDays:7},
};
let text: string | null = null, profile = 'alice', authority = 'unlocked1', tick = 0;
const tx = stateTransactions({read:async()=>text,write:async(_,value)=>{text=value;},compareAndSwap:async(_,old,next)=>{if(text!==old)return false;text=next;return true;}});
const io = {
  read:async()=>text,
  update:(change:any)=>tx.update('transaction-engine',change),
  authorizeAdult:async(id?:string)=>{if(id&&!['alice','bob'].includes(id))throw Error('Unknown learner');return {actorId:'adult',actorName:'Teacher',authorityKey:authority};},
  learnerContext:async()=>({studentId:profile,authorityKey:'profile:'+profile}),
  now:()=>new Date(Date.UTC(2026,9,29,0,0,tick++)).toISOString(),
};
const {supervisor,learner} = createTransactionEngineStore(io);
assert(validStateName('transaction-engine'));
for(const bad of ['transaction-engine-extra','../transaction-engine','transaction-engine/other'])assert(!validStateName(bad));
const first = await supervisor.savePack(pack,null);
assert.equal(first.revision,1);assert(!first.approval);
assert.deepEqual(await supervisor.savePack(pack,null),first,'identical save retry is idempotent');
const input = {id:'case',studentId:'alice',title:'Synthetic case',instructions:'Fictional practice only',startDate:'2026-10-29',pack:first};
await assert.rejects(supervisor.assign(input,null),/approved/);
const approved = await supervisor.approvePack('pack',1);
assert.deepEqual(await supervisor.approvePack('pack',1),approved);
const assignment = await supervisor.assign({...input,pack:approved},null);
assert.deepEqual(await supervisor.assign({...input,pack:approved},null),assignment);
const response = {values:{source:{answer:'Private educational reasoning'}},annotations:[]};
const saved = await learner.saveDocuments('case',1,response,null);
assert.equal(saved.revision,1);
assert.deepEqual(await learner.saveDocuments('case',1,response,null),saved);
const stage = {kind:'stage' as const,stage:'representation' as const,note:'Discuss fictional representation'};
const session = await learner.command('case',1,stage,'event1',1);
assert.equal(session.revision,2);assert.equal(session.events.length,1);
assert.deepEqual(await learner.command('case',1,stage,'event1',1),session,'event retry does not duplicate history');
await assert.rejects(learner.command('case',1,{...stage,note:'Changed'},'event1',2),/identity/);
const evidence = await learner.submit('case',1,'submission',2);
assert.deepEqual(await learner.submit('case',1,'submission',2),evidence);
const feedback = await supervisor.review({id:'review',submissionId:'submission',status:'needs_revision',note:'Explain your choice'});
assert.deepEqual(await supervisor.review({id:'review',submissionId:'submission',status:'needs_revision',note:'Explain your choice'}),feedback);
await assert.rejects(supervisor.review({id:'review',submissionId:'submission',status:'reviewed',note:'Changed'}),/identity/);
await supervisor.savePack({...approved,title:'Private unassigned new source'},1);
let view = await learner.load();assert.equal(view.packs.length,1);assert.equal(view.packs[0].title,approved.title);assert.equal(view.feedback.length,1);
profile='bob';view=await learner.load();assert.equal(view.assignments.length,0);assert.equal(view.packs.length,0);assert.equal(view.sessions.length,0);assert.equal(view.submissions.length,0);await assert.rejects(learner.saveDocuments('case',1,response,2));profile='alice';
const approved2=await supervisor.approvePack('pack',2);
await supervisor.assign({...input,pack:approved2},1);
await assert.rejects(learner.command('case',1,stage,'stale',2),/changed/);
assert.deepEqual((await supervisor.load()).submissions[0],evidence,'new pack/reassignment retains exact evidence');
const concurrent = await Promise.allSettled([
  learner.saveDocuments('case',2,response,null),
  learner.saveDocuments('case',2,{values:{source:{answer:'Different concurrent response'}},annotations:[]},null),
]);
assert.equal(concurrent.filter(value=>value.status==='fulfilled').length,1);
const changedLoad = createTransactionEngineStore({...io,read:async()=>{profile='bob';return text;}});
profile='alice';await assert.rejects(changedLoad.learner.load(),/profile changed/);profile='alice';
const before=text;
const changedAdult=createTransactionEngineStore({...io,update:async(change:any)=>{authority='changed';return tx.update('transaction-engine',change);}});
await assert.rejects(changedAdult.supervisor.savePack({...pack,id:'newpack'},null),/authority changed/);assert.equal(text,before);
const changedProfile=createTransactionEngineStore({...io,update:async(change:any)=>{profile='bob';return tx.update('transaction-engine',change);}});
profile='alice';await assert.rejects(changedProfile.learner.saveDocuments('case',2,response,1),/profile changed/);assert.equal(text,before);profile='alice';
let firstCAS=true;
const race=stateTransactions({read:async()=>text,write:async(_,value)=>{text=value;},compareAndSwap:async(_,old,next)=>{
  if(firstCAS){firstCAS=false;text=JSON.stringify(deleteTransactionStudent(parseTransactionLibrary(text),'alice'));return false;}
  if(text!==old)return false;text=next;return true;
}});
const raced=createTransactionEngineStore({...io,update:(change:any)=>race.update('transaction-engine',change)});
await assert.rejects(raced.learner.saveDocuments('case',2,response,1),/deleted/);
const removed=parseTransactionLibrary(text);assert.equal(removed.assignments.length,0);assert.equal(removed.sessions.length,0);assert.equal(removed.submissions.length,0);assert.equal(removed.feedback.length,0);assert.deepEqual(removed.deletedStudentIds,['alice']);
assert.deepEqual(deleteTransactionStudent(removed,'alice'),removed);
await assert.rejects(learner.load(),/deleted/);
await assert.rejects(supervisor.assign({...input,id:'resurrect',pack:approved2},null),/deleted/);
console.log('Transaction persistence: exact pack approval, session/event CAS and idempotence, immutable evidence, scoped privacy, fresh authority and deletion race passed');
// An untouched checkpoint has deterministic session identity on a retry.
let initial: string | null = null;
const fresh=createTransactionEngineStore({...io,read:async()=>initial,update:async change=>{initial=await change(initial);return initial;}});
profile='bob';await fresh.supervisor.savePack(pack,null);const freshPack=await fresh.supervisor.approvePack('pack',1);
await fresh.supervisor.assign({...input,id:'emptycase',studentId:'bob',pack:freshPack},null);
const emptyEvidence=await fresh.learner.submit('emptycase',1,'emptycheckpoint',null);
assert.deepEqual(await fresh.learner.submit('emptycase',1,'emptycheckpoint',null),emptyEvidence);
assert.equal((await fresh.learner.load()).submissions.length,1);

const closedPack = {...pack,id:'terminalpack',rules:{...pack.rules,requireDocumentsForClose:false,requireReconciliationForClose:false}};
await fresh.supervisor.savePack(closedPack,null);
const terminalSource=await fresh.supervisor.approvePack('terminalpack',1);
await fresh.supervisor.assign({...input,id:'terminalcase',studentId:'bob',pack:terminalSource},null);
let terminalRevision:number|null=null;
async function terminalCommand(command:any,id:string){const result=await fresh.learner.command('terminalcase',1,command,id,terminalRevision);terminalRevision=result.revision;return result;}
await terminalCommand({kind:'stage',stage:'representation',note:'Fictional representation'},'t1');
await terminalCommand({kind:'stage',stage:'pricing',note:'Fictional pricing'},'t2');
await terminalCommand({kind:'stage',stage:'offer',note:'Fictional offer'},'t3');
await terminalCommand({kind:'offer',offerId:'offer',party:'buyer',clientId:'buyer',price:10000,earnest:0,expiresOn:'2026-11-02',closingDate:'2026-11-03',note:'Fictional terms'},'t4');
await terminalCommand({kind:'accept',offerId:'offer',party:'seller',note:'Simulated acceptance'},'t5');
await terminalCommand({kind:'stage',stage:'closing',note:'Simulated close'},'t6');
const beforeTerminal=initial;
await assert.rejects(fresh.learner.saveDocuments('terminalcase',1,response,terminalRevision),/closed|terminal|outcome|frozen|closing/);
assert.equal(initial,beforeTerminal,'closed evidence cannot be rewritten via store');
await fresh.supervisor.assign({...input,id:'adversecase',studentId:'bob',pack:terminalSource},null);
const terminated=await fresh.learner.command('adversecase',1,{kind:'terminate',note:'Fictional adverse outcome'},'terminate',null);
const beforeAdverse=initial;
await assert.rejects(fresh.learner.saveDocuments('adversecase',1,response,terminated.revision),/closed|terminal|outcome|frozen|closing/);
assert.equal(initial,beforeAdverse,'adverse evidence cannot be rewritten via store');
console.log('Transaction store terminal response freeze: closed and adverse outcomes reject rewriting, preserving evidence');
