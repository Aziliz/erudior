import assert from 'node:assert/strict';
import {competencyLedgerStates,parseCompetencyLedger,type CompetencyLedger} from '../src/lib/competencyState.ts';
import {emptyProgress} from '../src/lib/storage.ts';
const ledger:CompetencyLedger={version:1,sources:[],snapshots:[],decisions:[]};
const graph=Array.from({length:45},(_,i)=>({id:`scale.skill-${i}`,title:`Skill ${i}`,prerequisites:i?[`scale.skill-${i-1}`]:[],evidence:{},assessments:[]}));
let counter=1;
for(const skill of graph){
 const source={skillId:skill.id,courseId:'scale-course',bankId:'scale-bank',questionId:skill.id,fingerprint:'a'.repeat(64),revision:1,snapshotId:''};
 for(let n=0;n<100;n++){
  const id=(counter++).toString(16).padStart(64,'0');source.snapshotId=id;
  ledger.snapshots.push({...source,id,at:'2026-10-28T12:00:00.000Z',mastery:n===99?.9:.1,confidence:.9,n:100});
 }
 ledger.sources.push(source);
}
const before=JSON.stringify(ledger);
const states=competencyLedgerStates(graph,{...emptyProgress(),competencies:ledger});
assert.equal(states.length,45);assert(states.every(s=>s.assessedMastered&&s.ready&&s.attempts===100));
assert.equal(JSON.stringify(ledger),before,'large projection is immutable and historical snapshots never add attempts');
const bad=structuredClone(ledger);bad.sources[0].snapshotId=bad.sources[1].snapshotId;
assert.throws(()=>parseCompetencyLedger(bad),/active competency evidence/,'indexed validation still rejects cross-skill active refs');
console.log('competency scale: 45 skills / 4500 historical snapshots, active-reference isolation, immutable projection and no double counting passed');
