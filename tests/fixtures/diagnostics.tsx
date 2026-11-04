// Synthetic browser fixture only: no shipped course content or real learner data.
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import LearningDiagnostics from '../../src/components/LearningDiagnostics';
import LearnerInterventions from '../../src/components/LearnerInterventions';
import {emptyCourse} from '../../src/lib/course';
import {emptyProgress,pickJsonFile,exportText} from '../../src/lib/storage';
import {FOUNDATION_COMPETENCIES} from '../../src/lib/competencyCatalog';
import {resolveCompetencyEvidence} from '../../src/lib/competencyEvidence';
import {captureCompetencyEvidence,syncCompetencyLedger} from '../../src/lib/competencyState';
import {createInterventionStore} from '../../src/lib/interventionStore';
import {parseInterventionState} from '../../src/lib/interventions';
import {taskFromPlan,type InterventionTask} from '../../src/lib/interventionTasks';
import {createInterventionTaskAccess} from '../../src/lib/interventionTaskAccess';
import {requestNavigation} from '../../src/lib/navigationGuard';
import {startPractice} from '../../src/lib/session';
import '../../src/styles.css';
import '../../src/diagnostics.css';
const course=emptyCourse('Synthetic diagnostics source');course.id='math-prealgebra';course.revision=1;
course.modules=[{id:'module',title:'Synthetic module'}];
course.lessons=[...new Set(FOUNDATION_COMPETENCIES.flatMap(s=>s.lessons[course.id]??[]))].map(id=>({id,module:'module',title:id==='pre-place-value'?'Place value lesson':id,body:'Synthetic instructional resource.',quiz:id==='pre-place-value'?['q-place']:[]}));
course.banks=[{id:'math-prealgebra__fixture',courseId:course.id,title:'Synthetic linked questions',questions:[{id:'q-place',topic:'Place value',section:'Math',stem:'Synthetic place value check',choices:['First','Second'],answer:[0],explanation:'Synthetic explanation'}],sections:[{id:'Math',title:'Math'}],exam:{count:1}} as any];
let courses=[course];
const graph=resolveCompetencyEvidence(FOUNDATION_COMPETENCIES,courses,{allowMissingCourses:true});
let alice=emptyProgress();alice=syncCompetencyLedger(alice,await captureCompetencyEvidence(graph,courses,alice,'2026-10-20T12:00:00Z'));
alice.attempts=Array.from({length:12},(_,i)=>({id:`attempt${i}`,bankId:course.banks[0].id,bankTitle:'Synthetic linked questions',mode:'practice' as const,startedAt:`2026-10-${21+Math.floor(i/6)}T12:00:00Z`,finishedAt:`2026-10-${21+Math.floor(i/6)}T12:01:${String(i).padStart(2,'0')}Z`,durationSec:60,total:1,answered:1,correct:0,byTopic:{'Place value':{total:1,correct:0}},bySection:{Math:{total:1,correct:0}},answers:[{qid:'q-place',chosen:[1],correct:false,confidence:'sure' as const}]}));
alice.stats={[course.banks[0].id]:{'q-place':{seen:12,correct:0,lastCorrect:false,lastSeen:'2026-10-22T12:01:11Z'}}};
alice=syncCompetencyLedger(alice,await captureCompetencyEvidence(graph,courses,alice,'2026-10-23T12:00:00Z'));
const progress:any={alice,bob:emptyProgress()};
const family:any={format:'erudior-family',version:1,mode:'classroom',school:{name:'Synthetic school',administrator:'Teacher'},students:[{id:'alice',name:'Alice',assigned:[],freeChoice:true},{id:'bob',name:'Bob',assigned:[],freeChoice:true}],classes:[{id:'testclass',name:'Synthetic class',students:['alice','bob'],assignments:[],handins:{},freeChoice:true}]};
let saved:string|null=null,failSave=false;let tick=0;
const store=createInterventionStore({read:async()=>saved,update:async change=>{if(failSave){failSave=false;throw Error('Synthetic save interruption; retry safely.');}saved=await change(saved);return saved;},authorize:async sid=>{if(sid&&!family.students.some((s:any)=>s.id===sid))throw Error('Learner no longer available.');return {actorId:'teacher',actorName:'Teacher'};},readProgress:async sid=>progress[sid],readCourses:async()=>courses,now:()=>new Date(Date.UTC(2026,9,29,12,0,tick++)).toISOString()});
let activeStudentId='alice';
const taskAccess=createInterventionTaskAccess({context:async()=>({profileId:activeStudentId,scope:'synthetic-profile:'+activeStudentId}),readInterventions:async()=>saved,readProgress:async id=>progress[id!],updateProgress:async(id,change)=>progress[id!]=await change(progress[id!]),readCourses:async()=>courses,allowed:async()=>null});
const toast=(text:string)=>{document.getElementById('toast')!.textContent=text;};
// This fixture exposes only bounded synthetic controls for regression fault injection.
Object.assign(window,{diagnosticsFixture:{state:()=>parseInterventionState(saved),failNextSave:()=>{failSave=true;},changeSource:()=>{courses=structuredClone(courses);courses[0].revision=2;},restoreSource:()=>{courses=[course];}}});
function Fixture(){
  const [mode,setMode]=useState<'adult'|'learner'>('adult'),[studentId,setStudentId]=useState('alice');
  const [launch,setLaunch]=useState('');activeStudentId=studentId;
  const api:any={allCourses:courses,courses,banks:courses.flatMap(c=>c.banks),student:family.students.find((s:any)=>s.id===studentId),toast,interventionSupervisor:store,competencySupervisor:{load:async(id:string)=>progress[id]},
    exportInterventionTask:async(id:string,planId:string)=>{const state=await store.load(id);const plan=state.plans.find(p=>p.id===planId)!;await exportText(JSON.stringify(taskFromPlan(plan)),`activity-${id}.json`,'Activity recommendation','json');},
    loadInterventionTasks:taskAccess.load,
    launchInterventionTask:async(task:InterventionTask,activity:any)=>{const prepared=await taskAccess.prepare(task,activity);if(activity.kind==='practice'){const bank=prepared.courses.flatMap(c=>c.banks).find(b=>b.id===activity.bankId)!;const session=startPractice({...bank,questions:bank.questions.filter(q=>activity.questionIds.includes(q.id))},prepared.progress,{count:10,topics:[],sections:[],filter:'all',shuffleChoices:true});setLaunch(`Practice launched with ${session.items.map(item=>item.q.id).join(', ')}`);}else setLaunch(`Lesson launched: ${activity.lessonId}`);},
    importInterventionTask:async()=>{const context=await taskAccess.context();const text=await pickJsonFile();if(text===null)return false;if(!window.confirm('Import this unverified recommendation for this profile?'))return false;await taskAccess.install(text,context);return true;}

  };
  const switchMode=(next:typeof mode)=>{if(requestNavigation('app',{name:next})){setMode(next);setLaunch('');}};
  return <><div className="row" style={{marginBottom:16}}><button className="btn" onClick={()=>switchMode('adult')}>Fixture adult area</button><button className="btn" onClick={()=>switchMode('learner')}>Fixture learner area</button></div><div id="toast" role="status"/>{mode==='adult'?<LearningDiagnostics api={api} family={family}/>:<><label className="field">Fixture learner<select className="select" aria-label="Fixture learner" value={studentId} onChange={e=>{setStudentId(e.target.value);setLaunch('');}}><option value="alice">Alice</option><option value="bob">Bob</option></select></label><LearnerInterventions api={api}/><p role="status">{launch}</p></>}</>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
