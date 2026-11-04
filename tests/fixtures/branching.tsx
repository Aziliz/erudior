import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import BranchingStudio from '../../src/components/BranchingStudio';
import LearnerBranching from '../../src/components/LearnerBranching';
import {createBranchingEngineStore} from '../../src/lib/branchingEngineStore';
import {parseBranchingLibrary} from '../../src/lib/branchingEngine';
import {syntheticBranchingPack} from './branching-data';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
import '../../src/branching.css';
const family:any={parent:{password:null},students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
let saved=localStorage.getItem('synthetic-branching-state'),active='alice',adult=true,fail=false,time=Number(localStorage.getItem('synthetic-branching-tick')??0);
const now=()=>{const value=new Date(Date.UTC(2026,9,29,12,0,time++)).toISOString();localStorage.setItem('synthetic-branching-tick',String(time));return value;};
const store=createBranchingEngineStore({read:async()=>saved,update:async change=>{if(fail){fail=false;throw Error('Synthetic interrupted save; retry safely.');}saved=await change(saved);localStorage.setItem('synthetic-branching-state',saved);return saved;},authorizeAdult:async(id?:string)=>{if(!adult||id&&!family.students.some((s:any)=>s.id===id))throw Error('Synthetic adult unavailable.');return {actorId:'teacher',actorName:'Synthetic teacher',authorityKey:'test-adult'};},learnerContext:async()=>({studentId:active,authorityKey:'test-'+active}),now});
const course:any={id:'synthetic-course',title:'Synthetic neutral functions and projects',revision:1,lessons:[],branchingScenarios:[syntheticBranchingPack()]};
Object.assign(window,{branchingFixture:{state:()=>parseBranchingLibrary(saved),failNextSave:()=>{fail=true;}}});
function Fixture(){const [mode,setMode]=useState<'adult'|'learner'>('adult'),[student,setStudent]=useState('alice');active=student;adult=mode==='adult';const api:any={family,courses:[course],student:family.students.find((s:any)=>s.id===student),branchingSupervisor:store.supervisor,branchingLearner:store.learner};const change=(value:typeof mode)=>{if(requestNavigation('app',{name:value}))setMode(value);};return <><div className="branching"><button onClick={()=>change('adult')}>Fixture adult area</button><button onClick={()=>change('learner')}>Fixture learner area</button></div>{mode==='adult'?<BranchingStudio api={api}/>:<><label>Fixture learner<select className="select" aria-label="Fixture learner" value={student} onChange={e=>{if(requestNavigation('app',{name:'learner'}))setStudent(e.target.value);}}><option value="alice">Alice</option><option value="bob">Bob</option></select></label><LearnerBranching api={api}/></>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
