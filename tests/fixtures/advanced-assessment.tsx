import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import AdvancedAssessmentStudio from '../../src/components/AdvancedAssessmentStudio';
import LearnerAdvancedAssessment from '../../src/components/LearnerAdvancedAssessment';
import {createAdvancedAssessmentStore} from '../../src/lib/advancedAssessmentStore';
import {parseAdvancedAssessmentLibrary} from '../../src/lib/advancedAssessment';
import {syntheticAdvancedAssessmentPack} from './advanced-assessment-data';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
import '../../src/advanced-assessment.css';
const family:any={parent:{password:null},students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
let saved=localStorage.getItem('synthetic-advanced-assessment-state'),active='alice',adult=true,fail=false,time=Number(localStorage.getItem('synthetic-advanced-assessment-tick')??0);
const now=()=>{const value=new Date(Date.UTC(2026,9,29,12,0,time++)).toISOString();localStorage.setItem('synthetic-advanced-assessment-tick',String(time));return value;};
const store=createAdvancedAssessmentStore({read:async()=>saved,update:async change=>{if(fail){fail=false;throw Error('Synthetic interrupted save; retry safely.');}saved=await change(saved);localStorage.setItem('synthetic-advanced-assessment-state',saved);return saved;},authorizeAdult:async(id?:string)=>{if(!adult||id&&!family.students.some((s:any)=>s.id===id))throw Error('Synthetic adult unavailable.');return {actorId:'teacher',actorName:'Synthetic teacher',authorityKey:'test-adult'};},learnerContext:async()=>({studentId:active,authorityKey:'test-'+active}),now});
const course:any={id:'synthetic-course',title:'Synthetic neutral functions and projects',revision:1,lessons:[],advancedAssessments:[syntheticAdvancedAssessmentPack()]};
Object.assign(window,{advancedAssessmentFixture:{state:()=>parseAdvancedAssessmentLibrary(saved),failNextSave:()=>{fail=true;}}});
function Fixture(){const [mode,setMode]=useState<'adult'|'learner'>('adult'),[student,setStudent]=useState('alice');active=student;adult=mode==='adult';const api:any={family,courses:[course],student:family.students.find((s:any)=>s.id===student),advancedAssessmentSupervisor:store.supervisor,advancedAssessmentLearner:store.learner};const change=(value:typeof mode)=>{if(requestNavigation('app',{name:value}))setMode(value);};return <><div className="advanced-assessment"><button onClick={()=>change('adult')}>Fixture adult area</button><button onClick={()=>change('learner')}>Fixture learner area</button></div>{mode==='adult'?<AdvancedAssessmentStudio api={api}/>:<><label>Fixture learner<select className="select" aria-label="Fixture learner" value={student} onChange={e=>{if(requestNavigation('app',{name:'learner'}))setStudent(e.target.value);}}><option value="alice">Alice</option><option value="bob">Bob</option></select></label><LearnerAdvancedAssessment api={api}/></>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
