import { useEffect, useRef, useState } from 'react';
import type { AppApi } from '../App';
import type { InterventionTask } from '../lib/interventionTasks';
import type { InterventionActivity } from '../lib/interventions';

export interface LearnerInterventionAccess {
  loadInterventionTasks?: () => Promise<InterventionTask[]>;
  launchInterventionTask?: (task: InterventionTask, activity: InterventionActivity) => Promise<void>;
  importInterventionTask?: () => Promise<boolean>;
}

/** Only sanitized tasks enter this view: never adult observations, baselines or other learners. */
export default function LearnerInterventions({api}:{api:AppApi & LearnerInterventionAccess}) {
  const [tasks,setTasks]=useState<InterventionTask[]>([]),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const service=useRef(api);service.current=api;
  const mounted=useRef(true),pending=useRef(false),generation=useRef(0);
  const identity=api.student?.id ?? 'guest';
  useEffect(()=>{mounted.current=true;generation.current++;pending.current=false;setTasks([]);setLoaded(false);setError('');setNotice('');void reload();return()=>{mounted.current=false;generation.current++;};},[identity,!!api.loadInterventionTasks]);
  async function action(fn:()=>Promise<void>){if(pending.current)return;const ticket=generation.current;pending.current=true;setBusy(true);setError('');try{await fn();}catch(e){if(mounted.current&&ticket===generation.current)setError((e as Error).message);}finally{if(mounted.current&&ticket===generation.current){pending.current=false;setBusy(false);}}}
  async function reload(){const ticket=generation.current;await action(async()=>{if(!service.current.loadInterventionTasks)throw Error('Targeted activities are not available for this profile.');const next=await service.current.loadInterventionTasks();if(mounted.current&&ticket===generation.current){setTasks(next);setLoaded(true);}});}
  async function importTask(){const ticket=generation.current;await action(async()=>{if(!service.current.importInterventionTask||!service.current.loadInterventionTasks)return;const imported=await service.current.importInterventionTask();if(!mounted.current||ticket!==generation.current||!imported)return;const next=await service.current.loadInterventionTasks();if(mounted.current&&ticket===generation.current){setTasks(next);setLoaded(true);setNotice('Recommendation imported for this profile. Review it with your supervising adult.');}});}
  return <section className="panel learner-interventions" aria-labelledby="targeted-activities-title" aria-busy={busy}>
    <h2 id="targeted-activities-title">Targeted learning activities</h2>
    <p>Follow the support plan agreed with your supervising adult. Activity files are recommendations from an unverified sender, not authenticated instructions. They do not create grades, mastery or completion credit.</p>
    <p className="small muted">Only your activities appear here. Source changes, unavailable courses and unmet prerequisites may prevent launch; ask your adult to review the plan rather than substituting another resource.</p>
    <div className="row"><button className="btn" disabled={busy||!api.loadInterventionTasks} onClick={()=>void reload()}>Reload targeted activities</button><button className="btn" disabled={busy||!api.importInterventionTask} onClick={()=>void importTask()}>Import activity recommendation</button></div>
    {error&&<p role="alert" className="notice">{error}</p>}{notice&&<p role="status">{notice}</p>}
    {!loaded?<p role="status">Activities have not loaded. Retry if an error is shown.</p>:!tasks.length?<p>No targeted activities are assigned to this profile.</p>:<ul>{tasks.map(task=><li key={task.id}>
      <h3>{task.goal}</h3><p>{task.instructions}</p>{task.due&&<p>Review by <time dateTime={task.due}>{task.due}</time></p>}
      <p className="small muted">Skill: {task.skillId} · issued <time dateTime={task.issuedAt}>{new Date(task.issuedAt).toLocaleDateString()}</time></p>
      <div className="row">{task.activities.map((activity,index)=><button key={index} className="btn" disabled={busy||!api.launchInterventionTask} onClick={()=>void action(async()=>{if(!service.current.launchInterventionTask)throw Error('Activity launch is unavailable.');await service.current.launchInterventionTask(task,activity);})}>{activity.kind==='lesson'?'Study assigned lesson':'Start assigned practice'}: {activity.title}</button>)}</div>
    </li>)}</ul>}
  </section>;
}
