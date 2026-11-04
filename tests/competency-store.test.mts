import assert from 'node:assert/strict';
import {createCompetencyStore} from '../src/lib/competencyStore.ts';
import {parseCompetencyLedger,applyCompetencyDecision,emptyCompetencyLedger} from '../src/lib/competencyState.ts';
import {emptyProgress} from '../src/lib/storage.ts';
import {stateTransactions} from '../src/lib/stateLock.ts';
import type {Progress} from '../src/lib/types.ts';
const raw=new Map<string,string>(),exists=new Set(['alice','bob']);let unlocked=true;let actor='parent';let now='2026-10-28T22:00:00.000Z';
const tx=stateTransactions({read:async key=>raw.get(key)??null,write:async(key,value)=>{if(value===null)raw.delete(key);else raw.set(key,value);},compareAndSwap:async(key,old,value)=>{if((raw.get(key)??null)!==old)return false;raw.set(key,value);return true;}});
const store=createCompetencyStore({
 readProgress:async id=>JSON.parse(raw.get('progress-'+id)??JSON.stringify(emptyProgress())),
 updateProgress:async(id,change)=>JSON.parse(await tx.update('progress-'+id,async old=>JSON.stringify(await change(old?JSON.parse(old):emptyProgress())))),
 authorize:async()=>{if(!unlocked)throw Error('Locked');return {actorId:actor,actorName:'Supervising adult'};},
 studentExists:async id=>exists.has(id),now:()=>now,
});
const first={id:'event1',skillId:'math.skill',action:'mastered' as const,reason:'Reviewed external work locally; not a credential'};
await Promise.all([store.decide('alice',first),store.decide('alice',{...first,id:'event2',skillId:'math.second'})]);
assert.equal((await store.load('alice')).competencies?.decisions.length,2);assert.equal((await store.load('bob')).competencies,undefined);
now='2026-10-28T22:01:00.000Z';await store.decide('alice',first);assert.equal((await store.load('alice')).competencies?.decisions.length,2);
await assert.rejects(store.decide('alice',{...first,reason:'changed intent'}),/conflicts/);
await store.decide('alice',{...first,id:'event3',action:'revoke',reason:'Return to assessment evidence'});
unlocked=false;await assert.rejects(store.load('alice'),/Locked/);await assert.rejects(store.decide('alice',{...first,id:'event4'}),/Locked/);unlocked=true;
exists.delete('alice');await assert.rejects(store.decide('alice',{...first,id:'event5'}),/no longer exists/);await assert.rejects(store.load('../bob'));
const ledger=JSON.parse(raw.get('progress-alice')!).competencies;assert.deepEqual(parseCompetencyLedger(JSON.parse(JSON.stringify(ledger))),ledger);
for(const invalid of [null,{}, {...ledger,version:2},{...ledger,decisions:[{...ledger.decisions[0],reason:''}]},{...ledger,decisions:[ledger.decisions[0],ledger.decisions[0]]}, {...ledger,sources:[{skillId:'a',courseId:'c',bankId:'b',questionId:'q',fingerprint:'bad',revision:1}]}]) assert.throws(()=>parseCompetencyLedger(invalid));
assert.deepEqual(parseCompetencyLedger(undefined),emptyCompetencyLedger());
const before=emptyProgress();assert.throws(()=>applyCompetencyDecision(before,{...first,actorId:'parent',actorName:'Adult',at:'bad'}));assert.equal(before.competencies,undefined);
// Scope captured at invocation does not follow a subsequent selection. CAS also preserves learner fields.
let selected='bob';const selectedAtStart=selected;const pending=store.decide(selectedAtStart,{...first,id:'scope'});selected='other';await pending;assert.equal(JSON.parse(raw.get('progress-bob')!).competencies.decisions[0].id,'scope');assert(!raw.has('progress-other'));
const p:Progress=JSON.parse(raw.get('progress-bob')!);assert.equal(p.version,1);
console.log('competency store: immutable/idempotent decisions, concurrent updates, profile isolation, live unlock and deletion gates, malformed recovery rejection passed');
