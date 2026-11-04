import {useEffect,useRef,useState} from 'react';
import type {AppApi} from '../App';
import {instructionalReport,type InstructionalLibrary} from '../lib/instructionalEvidence';
import {registerNavigationGuard} from '../lib/navigationGuard';
import {exportText} from '../lib/storage';
import {INSTRUCTIONAL_NOTICE,InstructionalAudit,InstructionalCapture,InstructionalHistory,InstructionalPackView} from './InstructionalEvidenceView';
export default function LearnerInstructionalEvidence({api}:{api:AppApi}) {
 const service=api.instructionalLearner;
 const [library,setLibrary]=useState<InstructionalLibrary|null>(null),[selected,setSelected]=useState(''),[dirty,setDirty]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState('');
 const generation=useRef(0),running=useRef(false),unsaved=useRef(false);unsaved.current=dirty;
 const scope=JSON.stringify({student:api.student?.id,password:api.family?.parent?.password});
 useEffect(()=>{const g=++generation.current;setLibrary(null);setSelected('');setDirty(false);setBusy(false);setError('');setStatus('');service?.load().then(v=>{if(g===generation.current)setLibrary(v);}).catch(e=>{if(g===generation.current)setError(String(e));});return()=>{generation.current++;};},[scope]);
 useEffect(()=>{const off=registerNavigationGuard(()=>!running.current&&(!unsaved.current||window.confirm('Discard unsaved instructional evidence inputs?')));const before=(e:BeforeUnloadEvent)=>{if(unsaved.current||running.current){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',before);return()=>{off();window.removeEventListener('beforeunload',before);};},[]);
 async function run(action:(g:number)=>Promise<void>){if(running.current)return false;running.current=true;setBusy(true);setError('');const g=generation.current;try{await action(g);return g===generation.current;}catch(e){if(g===generation.current)setError(e instanceof Error?e.message:String(e));return false;}finally{running.current=false;if(g===generation.current)setBusy(false);}}
 const assignment=library?.assignments.find(a=>`${a.id}@${a.revision}`===selected),latest=library?.assignments.filter(a=>!library.assignments.some(b=>b.id===a.id&&b.revision>a.revision))??[];
 return <section className="instructional-evidence"><h2>My instructional evidence</h2><p>{INSTRUCTIONAL_NOTICE}</p>{error&&<p role="alert">{error}</p>}{status&&<p role="status">{status}</p>}
 {!service?<p>Instructional evidence is unavailable for this profile.</p>:<><button disabled={busy} onClick={()=>{if(dirty&&!window.confirm('Discard unsaved instructional evidence inputs?'))return;void run(async g=>{const v=await service.load();if(g!==generation.current)return;setLibrary(v);setSelected('');setDirty(false);setStatus('Instructional evidence reloaded.');});}}>Reload instructional evidence</button>
 {library?.restoredAt&&<p>Restored local history is not authenticated. A supervising adult must freshly review quarantined requirements and credit decisions.</p>}
 <fieldset disabled={busy}><legend>My current instructional assignments</legend>{!latest.length&&<p>No instructional assignments.</p>}{latest.map(a=><button key={a.id} onClick={()=>{if(dirty&&!window.confirm('Discard unsaved instructional evidence inputs?'))return;setSelected(`${a.id}@${a.revision}`);setDirty(false);setError('');setStatus('');}}>{a.title} — instructional revision {a.revision}</button>)}</fieldset>
 {library&&assignment&&<><h3>{assignment.title}</h3><p>{assignment.instructions}</p><p>Assignment revision {assignment.revision}; educational start {assignment.startDate}.</p><InstructionalPackView pack={assignment.pack} sources={false} library={library}/>
 <InstructionalCapture key={selected} assignment={assignment} disabled={busy||!!library.pendingApproval?.includes(`${assignment.pack.id}@${assignment.pack.revision}`)} onDirty={setDirty} onCapture={input=>run(async g=>{await service.capture(input);const state=await service.load();if(g!==generation.current)return;setLibrary(state);setStatus('Immutable instructional evidence captured. No credit was automatically awarded.');})}/>
 <InstructionalAudit library={library} assignment={assignment}/><button disabled={busy} onClick={()=>void run(async()=>{await exportText(JSON.stringify(instructionalReport(library,assignment.id,assignment.revision),null,2),`instructional-audit-${assignment.id}.json`,'Instructional audit');})}>Export my instructional audit</button><InstructionalHistory library={library} assignment={assignment}/></>}
 </>}</section>;
}
