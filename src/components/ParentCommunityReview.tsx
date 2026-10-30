import { useEffect, useRef, useState } from 'react';
import type { AppApi } from '../App';
import { SUBJECTS, type Family } from '../lib/family';
import type { Course } from '../lib/types';
import { normalizeCourse } from '../lib/course';
import { downloadCommunityCourse } from '../lib/community';
import { parentCourseDigest } from '../lib/parentCourseReview';
import { loadStoredCourseSnapshot } from '../lib/storage';
import { registerNavigationGuard } from '../lib/navigationGuard';
import CanonicalCourseInspection from './CanonicalCourseInspection';
import ParentCoursePreview from './ParentCoursePreview';
import PublicCommunity from '../pages/PublicCommunity';
/** Personal suitability review only, never a public review/rating or enrollment during preview. */
export default function ParentCommunityReview({api,family}:{api:AppApi;family:Family}) {
 const [sid,setSid]=useState(family.students[0]?.id??''),[id,setId]=useState<string>();
 const [preview,setPreview]=useState<{course:Course;digest:string;installedRaw:string|null;remote:boolean}|null>(null);
 const [subject,setSubject]=useState<string>('Other'),[ack,setAck]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[failed,setFailed]=useState(false);
 const scope=useRef({sid,id});scope.current={sid,id};const alive=useRef(true),working=useRef(false);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 useEffect(()=>registerNavigationGuard(()=>!working.current),[]);
 const current=(learner:string,course:string|undefined)=>alive.current&&scope.current.sid===learner&&scope.current.id===course;
 const clear=()=>{setPreview(null);setAck(false);setMessage('');setFailed(false);};
 const run=async(work:()=>Promise<void>)=>{if(working.current)return;working.current=true;setBusy(true);setMessage('');setFailed(false);try{await work();}catch(e){if(alive.current){setMessage((e as Error).message);setFailed(true);}}finally{working.current=false;if(alive.current)setBusy(false);}};
 const review=async(installed?:Course)=>{
  const learner=sid,selected=id;if(!api.authorizeAcademicRecords)throw Error('Parent review authorization is unavailable.');await api.authorizeAcademicRecords(learner);
  // Capture exact stored bytes before any remote request. Offline review always uses those bytes,
  // not a possibly stale rendered course object; the app performs CAS against this raw snapshot.
  const snapshot=await loadStoredCourseSnapshot(installed?.id??`community-${selected}`);
  if(installed&&!snapshot)throw Error('The downloaded course changed or was removed. Reload saved Family state and review again.');
  const course=installed?snapshot!.course:normalizeCourse(await downloadCommunityCourse(selected!));
  const digest=await parentCourseDigest(course);await api.authorizeAcademicRecords(learner);
  if(current(learner,selected)){setPreview({course,digest,installedRaw:snapshot?.raw??null,remote:!installed});setAck(false);}
 };
 const installed=api.allCourses.filter(c=>c.community);
 return <section className="panel" aria-label="Personal community course review" style={{minWidth:0,overflowWrap:'anywhere'}}><h2>Review community courses for a learner</h2><p>Preview privately, then assign this exact version to one learner. This is your personal decision, not an Erudior endorsement or academic credit. Public reading stays account-free. Community uploading is a separate signed-in adult workflow.</p><label className="field">Learner for review<select className="select" disabled={busy} value={sid} onChange={e=>{clear();setSid(e.target.value);}}>{family.students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><p role={failed?'alert':'status'} aria-live="polite">{message}</p>
 {failed&&api.reloadClassroomState&&<><p>A failed save may have installed source or committed an assignment before interruption. Reload saved state and inspect assignments before retrying. No learner progress is intentionally changed.</p><button className="btn" disabled={busy} onClick={()=>void run(async()=>{await api.reloadClassroomState!();clear();setMessage('Saved Family state reloaded. Inspect assignments before retrying an uncertain save.');})}>Reload saved Family state</button></>}
 {!preview?<>{installed.length>0&&<details><summary>Review an already downloaded course offline</summary>{installed.map(c=><p key={c.id}><button className="btn" disabled={busy} onClick={()=>void run(()=>review(c))}>Review downloaded: {c.title}</button></p>)}</details>}<PublicCommunity id={id} appContext onNavigate={next=>{if(!working.current){clear();setId(next);}}}/>{id&&<button className="btn primary" disabled={busy} onClick={()=>void run(()=>review())}>{busy?'Loading review…':'Load full private review'}</button>}<p className="small muted">Loading a review downloads source and validated course images into this preview only. It does not install, assign, enroll or change learning records. Already downloaded courses can be reviewed offline.</p></>:<><h3>Reviewing {preview.course.title} for {family.students.find(s=>s.id===sid)?.name}</h3><p>Community version {preview.course.community?.version} · Author {preview.course.community?.author}. Publication review: {preview.course.community?.review==='reviewed'?'reviewed by platform':'not reviewed by platform'}. This never substitutes for your decision.</p><p className="small muted">Exact source SHA-256: {preview.digest}</p><ParentCoursePreview key={preview.digest} course={preview.course}/><details><summary>Inspect full course content and resources</summary><CanonicalCourseInspection course={preview.course}/></details><label className="field">Assigned subject<select className="select" disabled={busy} value={subject} onChange={e=>setSubject(e.target.value)}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></label><label className="check"><input type="checkbox" disabled={busy} checked={ack} onChange={e=>setAck(e.target.checked)}/>I reviewed this exact source, resources, links and suitability for this learner. I understand it is community-authored and does not award academic credit.</label><div className="row"><button className="btn primary" disabled={busy||!ack||failed} onClick={()=>void run(async()=>{const learner=sid,selected=id;if(!api.assignReviewedCommunityCourse)throw Error('Parent assignment is unavailable. Reopen the app.');await api.assignReviewedCommunityCourse(learner,preview.course,preview.digest,subject,()=>{if(!current(learner,selected))throw Error('Review or learner changed. Review again.');},preview.installedRaw,preview.remote);if(current(learner,selected)){setPreview(null);setAck(false);setMessage('Reviewed version assigned. The learner can start from assigned courses; no learner progress was changed.');}})}>Approve this version and assign</button><button className="btn" disabled={busy} onClick={clear}>Cancel review</button></div><p>Changed versions or content need fresh review. Removing the assignment revokes approval and preserves prior progress.</p></>}
 </section>;
}
