// Isolated synthetic source only. No shipped course content or real learner records.
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import DocumentEngine from '../../src/components/DocumentEngine';
import LearnerDocumentCases from '../../src/components/LearnerDocumentCases';
import {createDocumentEngineStore} from '../../src/lib/documentEngineStore';
import {parseDocumentLibrary} from '../../src/lib/documentEngine';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
import '../../src/documentEngine.css';
const family:any={format:'erudior-family',version:1,parent:{password:null},mode:'classroom',school:{name:'Synthetic school',administrator:'Teacher'},students:[{id:'alice',name:'Alice',assigned:[],freeChoice:true},{id:'bob',name:'Bob',assigned:[],freeChoice:true}]};
let saved=localStorage.getItem('synthetic-document-state'),fail=false,tick=0,active='alice',adult=true;
const store=createDocumentEngineStore({read:async()=>saved,update:async change=>{if(fail){fail=false;throw Error('Synthetic interrupted save; retry safely.');}saved=await change(saved);localStorage.setItem('synthetic-document-state',saved);return saved;},authorizeAdult:async id=>{if(!adult||id&&!family.students.some((s:any)=>s.id===id))throw Error('Adult authorization unavailable.');return {actorId:'teacher',actorName:'Teacher',authorityKey:'synthetic-adult'};},learnerContext:async()=>({studentId:active,authorityKey:'synthetic-'+active}),now:()=>new Date(Date.UTC(2026,9,29,12,0,tick++)).toISOString()});
Object.assign(window,{documentFixture:{state:()=>parseDocumentLibrary(saved),failNextSave:()=>{fail=true;},revokeAdult:()=>{adult=false;}}});
function Fixture(){const [mode,setMode]=useState<'adult'|'learner'>('adult'),[student,setStudent]=useState('alice');active=student;adult=mode==='adult';const api:any={family,student:family.students.find((s:any)=>s.id===student),documentSupervisor:store.supervisor,documentLearner:store.learner,toast:(message:string)=>{document.getElementById('toast')!.textContent=message;}};const switchMode=(next:typeof mode)=>{if(requestNavigation('app',{name:next}))setMode(next);};return <><div className="row"><button className="btn" onClick={()=>switchMode('adult')}>Fixture adult area</button><button className="btn" onClick={()=>switchMode('learner')}>Fixture learner area</button></div><p id="toast" role="status"/>{mode==='adult'?<DocumentEngine api={api}/>:<><label>Fixture learner<select className="select" aria-label="Fixture learner" value={student} onChange={e=>{if(requestNavigation('app',{name:'learner'}))setStudent(e.target.value);}}><option value="alice">Alice</option><option value="bob">Bob</option></select></label><LearnerDocumentCases api={api}/></>}</>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
