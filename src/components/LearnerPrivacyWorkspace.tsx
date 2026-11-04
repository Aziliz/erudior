import {useMemo,useState} from 'react';
import type {AppApi} from '../App';
import LearnerPrivacyPanel from './LearnerPrivacyPanel';
export default function LearnerPrivacyWorkspace({api}:{api:AppApi}){
 const [chosen,setChosen]=useState(api.family?.students[0]?.id??'');
 const studentId=api.family?(api.family.students.some(s=>s.id===chosen)?chosen:api.family.students[0]?.id??''):null;
 const service=useMemo(()=>api.learnerPrivacy?.forProfile(studentId),[api.learnerPrivacy,studentId]);
 const profileKey=JSON.stringify({studentId,password:api.family?.parent.password});
 return <section><h2>Learner privacy</h2>{api.family&&<label>Local learner<select aria-label="Privacy learner profile" className="select" style={{minHeight:32}} value={studentId??''} onChange={e=>setChosen(e.target.value)}>{api.family.students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}{service?<LearnerPrivacyPanel key={profileKey} profileKey={profileKey} service={service}/>:<p>Privacy controls are unavailable in this context.</p>}</section>;
}
