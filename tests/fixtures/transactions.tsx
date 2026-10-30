// Isolated synthetic fixture; no real laws, official forms, transactions or learner records.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import TransactionStudio from '../../src/components/TransactionStudio';
import LearnerTransactions from '../../src/components/LearnerTransactions';
import {createTransactionEngineStore} from '../../src/lib/transactionEngineStore';
import {parseTransactionLibrary} from '../../src/lib/transactionEngine';
import {createDocumentEngineStore} from '../../src/lib/documentEngineStore';
import {emptyDocumentTemplate} from '../../src/lib/documentEngine';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
import '../../src/documentEngine.css';
import '../../src/transactions.css';

const family:any={format:'erudior-family',version:1,parent:{password:null},mode:'classroom',school:{name:'Synthetic school',administrator:'Teacher'},students:[{id:'alice',name:'Alice',assigned:[],freeChoice:true},{id:'bob',name:'Bob',assigned:[],freeChoice:true}]};
let saved=localStorage.getItem('synthetic-transaction-state');
let sources=localStorage.getItem('synthetic-transaction-sources');
let active='alice', adult=true, fail=false, tick=0;
const now=()=>new Date(Date.UTC(2026,9,29,12,0,tick++)).toISOString();
const authorizeAdult=async(id?:string)=>{
  if(!adult || id&&!family.students.some((s:any)=>s.id===id))throw Error('Synthetic adult authorization unavailable.');
  return {actorId:'teacher',actorName:'Teacher',authorityKey:'synthetic-authority'};
};
const learnerContext=async()=>({studentId:active,authorityKey:'synthetic-'+active});
const documentStore=createDocumentEngineStore({read:async()=>sources,update:async change=>{sources=await change(sources);localStorage.setItem('synthetic-transaction-sources',sources);return sources;},authorizeAdult,learnerContext,now});
if(!sources){
  const source=emptyDocumentTemplate('synthetic-source','Synthetic practice form');
  source.sourceNote='Synthetic original test source, not a law or official form.';
  source.licenseNote='Synthetic regression fixture only.';
  source.pages[0].text='Fictional practice record. Explain the simulated decision and evidence.';
  source.fields=[{id:'reason',pageId:'page1',label:'Document explanation',kind:'longtext',required:true},{id:'quantity',pageId:'page1',label:'Simulated quantity',kind:'number',required:false,min:0,max:10}];
  await documentStore.supervisor.saveTemplate(source,null);
  await documentStore.supervisor.approveTemplate(source.id,1);
}
const store=createTransactionEngineStore({read:async()=>saved,update:async change=>{
  if(fail){fail=false;throw Error('Synthetic interrupted save; retry safely.');}
  saved=await change(saved);localStorage.setItem('synthetic-transaction-state',saved);return saved;
},authorizeAdult,learnerContext,now});
Object.assign(window,{transactionFixture:{state:()=>parseTransactionLibrary(saved),failNextSave:()=>{fail=true;}}});
function Fixture(){
  const [mode,setMode]=useState<'adult'|'learner'>('adult');
  const [student,setStudent]=useState('alice');active=student;adult=mode==='adult';
  const api:any={family,student:family.students.find((s:any)=>s.id===student),transactionSupervisor:store.supervisor,transactionLearner:store.learner,documentSupervisor:documentStore.supervisor,toast:(message:string)=>{document.getElementById('toast')!.textContent=message;}};
  const switchMode=(next:typeof mode)=>{if(requestNavigation('app',{name:next}))setMode(next);};
  return <><div className="row"><button className="btn" onClick={()=>switchMode('adult')}>Fixture adult area</button><button className="btn" onClick={()=>switchMode('learner')}>Fixture learner area</button></div><p id="toast" role="status"/>{mode==='adult'?<TransactionStudio api={api}/>:<><label>Fixture learner<select className="select" aria-label="Fixture learner" value={student} onChange={e=>{if(requestNavigation('app',{name:'learner'}))setStudent(e.target.value);}}><option value="alice">Alice</option><option value="bob">Bob</option></select></label><LearnerTransactions api={api}/></>}</>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
