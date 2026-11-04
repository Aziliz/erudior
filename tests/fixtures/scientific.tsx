import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import ScientificStudio from '../../src/components/ScientificStudio';
import LearnerScientific from '../../src/components/LearnerScientific';
import {createScientificWorkspaceStore} from '../../src/lib/scientificWorkspaceStore';
import {parseScientificLibrary} from '../../src/lib/scientificWorkspace';
import {syntheticScientificPack} from './scientific-data';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
import '../../src/scientific.css';
const family:any={parent:{password:null},students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
let saved=localStorage.getItem('synthetic-scientific-state'),active='alice',adult=true,fail=false,time=Number(localStorage.getItem('synthetic-scientific-tick')??0);
const now=()=>{const value=new Date(Date.UTC(2026,9,29,12,0,time++)).toISOString();localStorage.setItem('synthetic-scientific-tick',String(time));return value;};
const store=createScientificWorkspaceStore({read:async()=>saved,update:async change=>{if(fail){fail=false;throw Error('Synthetic interrupted save; retry safely.');}saved=await change(saved);localStorage.setItem('synthetic-scientific-state',saved);return saved;},authorizeAdult:async(id?:string)=>{if(!adult||id&&!family.students.some((s:any)=>s.id===id))throw Error('Synthetic adult unavailable.');return {actorId:'teacher',actorName:'Synthetic teacher',authorityKey:'test-adult'};},learnerContext:async()=>({studentId:active,authorityKey:'test-'+active}),now});
const course:any={id:'synthetic-course',title:'Synthetic neutral functions and projects',revision:1,lessons:[],scientificWorkspaces:[syntheticScientificPack(),syntheticScientificPack('circuit'),syntheticScientificPack('gas')]};
Object.assign(window,{scientificFixture:{state:()=>parseScientificLibrary(saved),failNextSave:()=>{fail=true;}}});
function Fixture(){const [mode,setMode]=useState<'adult'|'learner'>('adult'),[student,setStudent]=useState('alice');active=student;adult=mode==='adult';const api:any={family,courses:[course],student:family.students.find((s:any)=>s.id===student),scientificSupervisor:store.supervisor,scientificLearner:store.learner};const change=(value:typeof mode)=>{if(requestNavigation('app',{name:value}))setMode(value);};return <><div className="scientific"><button onClick={()=>change('adult')}>Fixture adult area</button><button onClick={()=>change('learner')}>Fixture learner area</button></div>{mode==='adult'?<ScientificStudio api={api}/>:<><label>Fixture learner<select className="select" aria-label="Fixture learner" value={student} onChange={e=>{if(requestNavigation('app',{name:'learner'}))setStudent(e.target.value);}}><option value="alice">Alice</option><option value="bob">Bob</option></select></label><LearnerScientific api={api}/></>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
