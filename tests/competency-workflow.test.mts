import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import type {Attempt, Course, Progress} from '../src/lib/types.ts';
import type {AuthoredCompetency} from '../src/lib/competencyCatalog.ts';

// Exercise real persistence/backup orchestration at an isolated native boundary.
// No actual learner files, credentials, or network are accessed.
const state = new Map<string,string>(), items = new Map<string,string>();
const writes: string[] = [];
let pauseRead: ((name:string)=>Promise<void>) | undefined;
(globalThis as any).isTauri = true;
(globalThis as any).window = {__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
  if(command==='load_state'){await pauseRead?.(args.name);return state.get(args.name)??null;}
  if(command==='save_state'){writes.push(args.name);args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
  if(command==='compare_and_swap_state'){
    if((state.get(args.name)??null)!==args.expected)return false;
    writes.push(args.name);state.set(args.name,args.content);return true;
  }
  if(command==='load_progress')return state.get('progress')??null;
  if(command==='save_progress'){writes.push('progress');state.set('progress',args.content);return;}
  if(command==='save_item'){writes.push('item:'+args.id);items.set(args.kind+':'+args.id,args.content);return;}
  if(command==='delete_item'){writes.push('delete:'+args.id);items.delete(args.kind+':'+args.id);return;}
  if(command==='list_items')return [...items].filter(([key])=>key.startsWith(args.kind+':')).map(([,value])=>value);
  throw Error('Unexpected native command: '+command);
}}};
const {emptyProgress,useStudentFiles} = await import('../src/lib/storage.ts');
const {emptyCourse,normalizeCourse} = await import('../src/lib/course.ts');
const {emptyBank} = await import('../src/lib/validate.ts');
const {FOUNDATION_COMPETENCIES} = await import('../src/lib/competencyCatalog.ts');
const {resolveCompetencyEvidence,competencyQuestionIds} = await import('../src/lib/competencyEvidence.ts');
const {studentCompetencyPlacement} = await import('../src/lib/competencyPlacement.ts');
const {competencyImprovement} = await import('../src/lib/competencyImprovement.ts');
const {startPractice} = await import('../src/lib/session.ts');
const {captureCompetencyEvidence,syncCompetencyLedger,competencyLedgerStates,applyCompetencyDecision,parseCompetencyLedger} = await import('../src/lib/competencyState.ts');

const course:Course={...emptyCourse('Workflow fixture'),id:'workflowcourse',revision:1,
  modules:[{id:'module',title:'Module',quiz:['module-only']}],
  lessons:[
    {id:'foundation',module:'module',title:'Foundation',body:'Study the foundation.',quiz:['linked'],topics:[]},
    {id:'advanced',module:'module',title:'Advanced',body:'Study the next skill.',quiz:['advanced-q'],topics:[]},
    {id:'unassessed',module:'module',title:'Unassessed',body:'Reading alone is not mastery.',topics:[]},
  ],
  banks:[{...emptyBank('Fixture bank'),id:'workflowcourse__bank',courseId:'workflowcourse',questions:[
    {id:'linked',topic:'Same topic',stem:'Linked question',choices:['Yes','No'],answer:[0]},
    {id:'unrelated',topic:'Same topic',stem:'Unlinked question',choices:['Yes','No'],answer:[0]},
    {id:'module-only',topic:'Same topic',stem:'Module-only question',choices:['Yes','No'],answer:[0]},
    {id:'advanced-q',topic:'Next topic',stem:'Next question',choices:['Yes','No'],answer:[0]},
  ]} as any]};
const authored:AuthoredCompetency[]=[
  {id:'workflow.foundation',title:'Foundation',prerequisites:[],evidence:{},lessons:{workflowcourse:['foundation']}},
  {id:'workflow.advanced',title:'Advanced',prerequisites:['workflow.foundation'],evidence:{},lessons:{workflowcourse:['advanced']}},
  {id:'workflow.unassessed',title:'Unassessed',prerequisites:[],evidence:{},lessons:{workflowcourse:['unassessed']}},
];
const originalCourse=JSON.stringify(course), graph=resolveCompetencyEvidence(authored,[course]);
const placement=(p:Progress)=>studentCompetencyPlacement(graph,[course],p);
const stat=(p:Progress,id:string)=>placement(p).states.find(s=>s.id===id)!;
let learner=emptyProgress();
// Establish source identity before answers exist; revisionless legacy attempts
// cannot authenticate which semantic question version the learner actually saw.
learner=syncCompetencyLedger(learner,await captureCompetencyEvidence(graph,[course],learner,'2026-10-24T00:00:00Z'));
learner.lessonsDone={'workflowcourse/foundation':'2026-10-25'};
assert.equal(stat(learner,'workflow.foundation').mastery,null,'study completion alone never grants mastery');
assert.equal(stat(learner,'workflow.advanced').ready,false);
assert.equal(stat(learner,'workflow.unassessed').mastery,null,'empty exact mapping is an unassessed skill, not a render exception');
learner.stats[course.banks[0].id]={unrelated:{seen:100,correct:100} as any,'module-only':{seen:100,correct:100} as any};
assert.equal(stat(learner,'workflow.foundation').mastery,null,'same-topic/module-only evidence cannot leak into a lesson skill');
const pool=competencyQuestionIds(graph[0],course.banks[0]);
assert.deepEqual(pool,['linked']);
const session=startPractice(course.banks[0],learner,{count:10,topics:[],sections:[],filter:'smart',shuffleChoices:true,questionIds:pool});
assert(session.items.length>0);
assert(session.items.every(item=>item.q.id==='linked'),'focused practice uses only exact approved identities');
assert((session.adaptive?.reserve??[]).every(id=>id==='linked'),'adaptive reserve cannot broaden the selected skill');
function attempt(id:string,qid:string,day:number,correct=true):Attempt{
  return {id,bankId:course.banks[0].id,bankTitle:'Fixture bank',mode:'practice',startedAt:`2026-10-${day}T12:00:00Z`,finishedAt:`2026-10-${day}T12:01:00Z`,durationSec:60,total:1,answered:1,correct:correct?1:0,byTopic:{'Same topic':{correct:correct?1:0,total:1}},bySection:{},answers:[{qid,correct,chosen:[correct?0:1]}]} as Attempt;
}
learner.attempts=Array.from({length:18},(_,i)=>attempt('answer'+i,'linked',25+i%3));
assert(stat(learner,'workflow.foundation').mastered,'repeated assessed evidence across three days establishes mastery');
assert(stat(learner,'workflow.advanced').ready,'measured prerequisite mastery unlocks the next skill');
const counted=stat(learner,'workflow.foundation').attempts;
const replay={...learner,attempts:[...learner.attempts,...learner.attempts]};
assert.equal(stat(replay,'workflow.foundation').attempts,counted,'replayed attempts do not duplicate evidence');
const unrelated={...emptyProgress(),attempts:[attempt('noise1','unrelated',25,false),attempt('noise2','unrelated',27,true)]};
assert.equal(competencyImprovement(graph[0],course.banks,unrelated),null,'unlinked answers cannot manufacture an improvement trend');
assert.equal(JSON.stringify(course),originalCourse,'measurement never mutates authored content');

// The real existing taxonomy resolves only exact lesson-linked identities. Missing
// assessments remain unknown; this test never repairs or invents course content.
const wanted=new Set(FOUNDATION_COMPETENCIES.flatMap(s=>Object.keys(s.lessons)));
const corpus:Course[]=[];
for(const file of readdirSync('samples',{recursive:true}).filter((s):s is string=>typeof s==='string'&&s.endsWith('.json'))){
  const raw=JSON.parse(readFileSync('samples/'+file,'utf8'));
  if(wanted.has(raw.id))corpus.push(normalizeCourse(raw));
}
const corpusGraph=resolveCompetencyEvidence(FOUNDATION_COMPETENCIES,corpus);
assert.equal(corpusGraph.length,FOUNDATION_COMPETENCIES.length);
assert(studentCompetencyPlacement(corpusGraph,corpus,emptyProgress()).states.every(s=>s.mastery===null&&!s.mastered));
for(const skill of corpusGraph){
  const spec=FOUNDATION_COMPETENCIES.find(s=>s.id===skill.id)!;
  for(const source of skill.assessments??[]){
    const c=corpus.find(c=>c.id===source.courseId)!;
    const linked=new Set(c.lessons.filter(l=>spec.lessons[c.id]?.includes(l.id)).flatMap(l=>l.quiz??[]));
    assert(source.questionIds.every(id=>linked.has(id)),`${skill.id}: no broad module/topic evidence`);
    assert.deepEqual(competencyQuestionIds(skill,c.banks.find(b=>b.id===source.bankId)!).sort(),source.questionIds.slice().sort());
  }
}
console.log('competency workflow: exact linked evidence/practice, unknown skills, prerequisite unlock, replay isolation and real-corpus mapping passed');

const {createCompetencyStore} = await import('../src/lib/competencyStore.ts');
const storage = await import('../src/lib/storage.ts');
const {collect,restoreContents,encryptText,decryptText} = await import('../src/lib/backup.ts');
const {emptyRecords} = await import('../src/lib/records.ts');
const legacy={...learner,competencies:undefined};
const legacyCaptured=syncCompetencyLedger(legacy,await captureCompetencyEvidence(graph,[course],legacy,'2026-10-28T11:00:00Z'));
assert.equal(competencyLedgerStates(graph,legacyCaptured).find(s=>s.id==='workflow.foundation')!.mastery,null,'first capture cannot authenticate legacy answers to a current revision');
assert.deepEqual(legacyCaptured.attempts,legacy.attempts,'legacy raw history is preserved, not deleted');
const capture=await captureCompetencyEvidence(graph,[course],learner,'2026-10-28T12:00:00Z');
learner=syncCompetencyLedger(learner,capture);
const durable=(p:Progress,g=graph)=>competencyLedgerStates(g,p);
const durableSkill=(p:Progress,id:string,g=graph)=>durable(p,g).find(s=>s.id===id)!;
assert(durableSkill(learner,'workflow.foundation').assessedMastered);
const sourceHistory=structuredClone(learner.competencies!);
assert.deepEqual(syncCompetencyLedger(learner,capture).competencies,learner.competencies,'repeat capture is idempotent');
const noCoursesGraph=resolveCompetencyEvidence(authored,[],{allowMissingCourses:true});
const removed=syncCompetencyLedger(learner,await captureCompetencyEvidence(noCoursesGraph,[],learner,'2026-10-28T13:00:00Z'));
assert(durableSkill(removed,'workflow.foundation',noCoursesGraph).assessedMastered,'earned skill evidence survives course removal');
assert(durableSkill(removed,'workflow.advanced',noCoursesGraph).ready,'retained prerequisite evidence works without its course installed');
learner=syncCompetencyLedger(removed,await captureCompetencyEvidence(graph,[course],removed,'2026-10-28T14:00:00Z'));
assert.deepEqual(learner.competencies,sourceHistory,'same-revision reinstall neither loses nor duplicates evidence');
const revised:Course={...course,revision:2,banks:[{...course.banks[0],questions:course.banks[0].questions.map(q=>q.id==='linked'?{...q,stem:'Semantically revised question',answer:[1]}:q)}]};
const revisedGraph=resolveCompetencyEvidence(authored,[revised]);
let changed=syncCompetencyLedger(learner,await captureCompetencyEvidence(revisedGraph,[revised],learner,'2026-10-29T00:00:00Z'));
assert.equal(durableSkill(changed,'workflow.foundation',revisedGraph).mastery,null,'old raw answers cannot be relabeled as evidence for a revised question');
assert(!durableSkill(changed,'workflow.advanced',revisedGraph).ready);
assert(changed.competencies!.snapshots.some(s=>sourceHistory.snapshots.some(old=>old.id===s.id)),'revision changes retain original historical evidence');
changed=syncCompetencyLedger(changed,await captureCompetencyEvidence(revisedGraph,[revised],changed,'2026-10-29T01:00:00Z'));
assert.equal(durableSkill(changed,'workflow.foundation',revisedGraph).mastery,null,'repeated revision sync cannot resurrect stale raw evidence');
changed={...changed,attempts:[...Array.from({length:18},(_,i)=>attempt('revised-answer'+i,'linked',29+i%3)),...changed.attempts]};
changed=syncCompetencyLedger(changed,await captureCompetencyEvidence(revisedGraph,[revised],changed,'2026-11-01T12:00:00Z'));
assert(durableSkill(changed,'workflow.foundation',revisedGraph).assessedMastered,'genuinely new answers establish mastery for the revised question');

const adult={actorId:'parent',actorName:'Supervising adult'};
const decision={id:'decision1',skillId:'workflow.foundation',action:'needs-practice' as const,reason:'Review the prerequisites together.',...adult,at:'2026-11-01T13:00:00Z'};
const overridden=applyCompetencyDecision(changed,decision);
assert.equal(durableSkill(overridden,'workflow.foundation',revisedGraph).mastered,false);
assert.equal(durableSkill(overridden,'workflow.foundation',revisedGraph).assessedMastered,true,'adult placement never rewrites measured mastery');
assert.equal(durableSkill(overridden,'workflow.advanced',revisedGraph).ready,false);
assert.deepEqual(applyCompetencyDecision(overridden,decision),overridden,'same decision replay is idempotent');
assert.throws(()=>applyCompetencyDecision(overridden,{...decision,reason:'Conflicting rewrite'}),/conflict/i);
const revoked=applyCompetencyDecision(overridden,{...decision,id:'decision2',action:'revoke',reason:'Review finished; use measured evidence again.',at:'2026-11-01T14:00:00Z'});
assert(durableSkill(revoked,'workflow.foundation',revisedGraph).mastered);
assert(durableSkill(revoked,'workflow.advanced',revisedGraph).ready);
assert.equal(revoked.competencies!.decisions.length,2,'revocation preserves an auditable decision history');
const explicitlyPlaced=applyCompetencyDecision(revoked,{...decision,id:'decision3',skillId:'workflow.advanced',action:'mastered',reason:'Prior learning reviewed in person.',at:'2026-11-01T15:00:00Z'});
assert(durableSkill(explicitlyPlaced,'workflow.advanced',revisedGraph).mastered);
assert.equal(durableSkill(explicitlyPlaced,'workflow.advanced',revisedGraph).assessedMastered,false);
assert.equal(durableSkill(explicitlyPlaced,'workflow.advanced',revisedGraph).mastery,null,'manual placement is not fabricated assessment evidence');

const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Alice',grade:5,assigned:[],freeChoice:false},{id:'bob',name:'Bob',grade:7,assigned:[],freeChoice:true}]};
state.set('family',JSON.stringify(family));state.set('progress',JSON.stringify(emptyProgress()));
state.set('progress-alice',JSON.stringify(explicitlyPlaced));state.set('progress-bob',JSON.stringify(emptyProgress()));
for(const student of family.students)state.set('records-'+student.id,JSON.stringify(emptyRecords()));
let authorized=true, selected='alice';
const members=new Set(['alice','bob']);
const store=createCompetencyStore({
  readProgress:async id=>JSON.parse((await storage.loadState('progress-'+id))!),
  updateProgress:async(id,change)=>JSON.parse(await storage.updateState('progress-'+id,async old=>JSON.stringify(await change(old?JSON.parse(old):emptyProgress())))),
  authorize:async id=>{if(!authorized||id!==selected)throw Error('Adult area locked or learner changed.');return adult;},
  studentExists:async id=>members.has(id),now:()=> '2026-11-02T12:00:00Z',
});
await store.decide('alice',{id:'decision4',skillId:'workflow.unassessed',action:'ready',reason:'Begin with a supported placement assessment.'});
assert.equal(JSON.parse(state.get('progress-alice')!).competencies.decisions.length,4);
assert.equal(JSON.parse(state.get('progress-bob')!).competencies,undefined,'adult edits never touch sibling progress');
await Promise.all([
  store.decide('alice',{id:'concurrent1',skillId:'workflow.unassessed',action:'needs-practice',reason:'First concurrent observation.'}),
  store.decide('alice',{id:'concurrent2',skillId:'workflow.unassessed',action:'ready',reason:'Second concurrent observation.'}),
]);
assert.equal(JSON.parse(state.get('progress-alice')!).competencies.decisions.length,6,'CAS appends both concurrent adult decisions without losing history');
let releaseRead!:()=>void, readStarted!:()=>void;
const started=new Promise<void>(resolve=>{readStarted=resolve;});
const staleRead=createCompetencyStore({
  readProgress:async()=>{readStarted();await new Promise<void>(resolve=>{releaseRead=resolve;});return explicitlyPlaced;},
  updateProgress:async()=>{throw Error('Read-only test must not write.');},
  authorize:async id=>{if(id!==selected)throw Error('Learner changed during read.');return adult;},
  studentExists:async id=>members.has(id),now:()=> '2026-11-02T12:00:00Z',
});
const pendingRead=staleRead.load('alice');await started;selected='bob';releaseRead();
await assert.rejects(pendingRead,/changed during read/,'late profile reads cannot expose another learner history');selected='alice';
authorized=false;const beforeDenied=[...state];
await assert.rejects(store.decide('alice',{id:'denied',skillId:'workflow.advanced',action:'mastered',reason:'Must not write.'}),/locked/);
assert.deepEqual([...state],beforeDenied);
authorized=true;selected='bob';await assert.rejects(store.load('alice'),/learner changed/);
selected='alice';members.delete('alice');await assert.rejects(store.decide('alice',{id:'deleted',skillId:'workflow.advanced',action:'mastered',reason:'Must not recreate.'}),/no longer exists/);
assert.deepEqual([...state],beforeDenied,'deleted-profile decision cannot recreate learner data');members.add('alice');

useStudentFiles('bob');
const backup=await collect([revised],[]);
assert.deepEqual(backup.students.alice.progress.competencies,JSON.parse(state.get('progress-alice')!).competencies);
assert.equal(backup.students.bob.progress.competencies,undefined);
assert.equal(backup.progress.competencies,undefined,'active learner cannot replace base profile in backup');
const encrypted=await encryptText(JSON.stringify(backup),'workflow test passphrase');
assert(!encrypted.includes('Prior learning reviewed in person.'));
await assert.rejects(decryptText(JSON.parse(encrypted),'wrong'),/Wrong passphrase/);
state.clear();items.clear();
await restoreContents(await decryptText(JSON.parse(encrypted),'workflow test passphrase'),{courses:[],banks:[]});
assert.deepEqual(JSON.parse(state.get('progress-alice')!).competencies,backup.students.alice.progress.competencies);
assert.deepEqual(JSON.parse(state.get('progress-bob')!),backup.students.bob.progress);
const restored=JSON.parse(state.get('progress-alice')!) as Progress;
assert(durableSkill(restored,'workflow.foundation',revisedGraph).assessedMastered);
assert.equal(durableSkill(restored,'workflow.advanced',revisedGraph).assessedMastered,false);
assert.equal(durableSkill(restored,'workflow.advanced',revisedGraph).placement?.reason,'Prior learning reviewed in person.');
for(const damage of [
  (p:any)=>{p.competencies.version=99;},
  (p:any)=>{p.competencies.snapshots[0].mastery=2;},
  (p:any)=>{p.competencies.decisions[0].action='issue-certificate';},
  (p:any)=>{p.competencies.decisions.push({...p.competencies.decisions[0]});},
]){
  const invalid=structuredClone(backup);damage(invalid.students.alice.progress);
  assert.throws(()=>parseCompetencyLedger(invalid.students.alice.progress.competencies));
  const before=[...state];writes.length=0;
  await assert.rejects(restoreContents(JSON.stringify(invalid),{courses:[{id:'must-not-delete'} as Course],banks:[]}));
  assert.deepEqual([...state],before);assert.deepEqual(writes,[],'malformed competency history is rejected before any restore mutation');
}
console.log('competency workflow: durable revision isolation, placement/revoke history, adult/profile guards, encrypted two-learner recovery and fail-closed backup passed');
