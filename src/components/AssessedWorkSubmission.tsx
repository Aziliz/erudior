import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AppApi } from "../App";
import { activeStudent } from "../lib/storage";
import { loadFile } from "../lib/documents";
import { appendAssessedWorkSubmission, createAssessedWorkSubmission, assessedWorkJSON, type AssessedWorkSubmission } from "../lib/assessedWorkEvidence";
import { beginAssessedWorkSubmissionSave, confirmAssessedWorkSubmissionSave, failAssessedWorkSubmissionSave, getConfirmedAssessedWorkSubmissions, pendingAssessedWorkSubmission, prepareAssessedWorkSubmission, assessedWorkSubmissionRegistryVersion, subscribeAssessedWorkSubmissions } from "../lib/assessedWorkSubmissionState";
import type { WorkRecord } from "../lib/work";
import Markdown from "./Markdown";
import { RubricTable } from "./WorkParts";

/** A submission is only confirmed after its durable progress write resolves. */
export function useAssessedWorkSubmission(api: AppApi, courseId: string, assignmentId: string, kind: AssessedWorkSubmission["kind"]) {
 const studentId=api.student?.id??null;
 const mounted=useRef(true), busy=useRef(false);
 const [gathering,setGathering]=useState(false), [error,setError]=useState("");
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 useSyncExternalStore(subscribeAssessedWorkSubmissions,assessedWorkSubmissionRegistryVersion,assessedWorkSubmissionRegistryVersion);
 const pending=pendingAssessedWorkSubmission(studentId,courseId,assignmentId,kind);
 let history:AssessedWorkSubmission[]=[];let historyError="";
 try {history=Object.values(getConfirmedAssessedWorkSubmissions(api.progress,studentId)).filter(entry=>entry.courseId===courseId&&entry.assignmentId===assignmentId).sort((a,b)=>b.submittedAt-a.submittedAt);}
 catch {historyError="Existing submission history is invalid; it was not replaced.";}
 async function submit(input: Omit<AssessedWorkSubmission,"version"|"files">):Promise<boolean> {
  if(busy.current||pending?.saving)return false;
  busy.current=true;setGathering(true);setError("");
  let beganSave=false;
  let entry=pendingAssessedWorkSubmission(studentId,courseId,assignmentId,kind)?.submission;
  try {
   if(activeStudent()!==studentId)throw Error("Wait for the selected learner to load.");
   if(!entry){
    const snapshot=structuredClone(input);
    const refs=Array.isArray(snapshot.response)?snapshot.response.flatMap(e=>e.file?[e.file]:[]):snapshot.response.photos??[];
    const files:AssessedWorkSubmission["files"]={};
    for(const ref of refs){const file=await loadFile(ref.fileId);if(!file)throw Error("An original attachment is missing. Restore it before submitting.");files[ref.fileId]=file;ref.bytes=atob(file.data).length;}
    entry=prepareAssessedWorkSubmission(studentId,createAssessedWorkSubmission({...snapshot,files}));
   }
   if(activeStudent()!==studentId||!mounted.current)throw Error("The learner or assignment changed before saving. Retry this snapshot from its original profile.");
   if(!beginAssessedWorkSubmissionSave(studentId,entry))return false;
   beganSave=true;
   const saved=entry;
   await api.updateProgress(previous=>({...previous,
    assessedWorkSubmissions:appendAssessedWorkSubmission(previous.assessedWorkSubmissions??{},saved),
    ...(saved.kind==="log"?{}:(() => {
      const key=courseId+"/"+assignmentId, current=previous.work?.[key];
      const draftBody=(record:WorkRecord)=>{const {submitted:_submitted,rounds:_rounds,...body}=record;return body;};
      // Retry appends its original evidence; it must never replace newer draft edits.
      const response=saved.response as WorkRecord;
      if(current && assessedWorkJSON(current)!==assessedWorkJSON(response)) {
        const predecessor=(current.rounds??0)===(response.rounds??1)-1;
        if(!predecessor || assessedWorkJSON(draftBody(current))!==assessedWorkJSON(draftBody(response)) || (current.submitted && Date.parse(current.submitted)>=Date.parse(response.submitted!))) return {};
      }
      return {work:{...previous.work,[key]:saved.response as WorkRecord}};
    })()),
   }));
   confirmAssessedWorkSubmissionSave(studentId,saved);
   return true;
  } catch(e){if(entry&&beganSave)failAssessedWorkSubmissionSave(studentId,entry);if(mounted.current)setError((e as Error).message);return false;}
  finally {busy.current=false;if(mounted.current)setGathering(false);}
 }
 return {submit,pending,history,error:error||historyError,busy:gathering||!!pending?.saving};
}

/** Original prompts and responses remain inspectable even after a course revision. */
export function AssessedWorkHistory({entries}:{entries:AssessedWorkSubmission[]}) {
 const [selected,setSelected]=useState<string|null>(null);
 if(!entries.length)return null;
 return <section className="panel" aria-label="Confirmed original work"><h2>Confirmed submission history</h2><p className="small muted">Original task, rubric, response and attachments. These submissions are evidence, not automatic grades.</p>{entries.map(entry=><div key={entry.id}><button className="btn" aria-expanded={selected===entry.id} onClick={()=>setSelected(selected===entry.id?null:entry.id)}>{new Date(entry.submittedAt).toLocaleString()} — {entry.task.title}</button>{selected===entry.id&&<div>
 {"prompt" in entry.task && entry.task.prompt && <Markdown source={entry.task.prompt}/>}
 {entry.kind==="lab"&&<pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(entry.task,null,2)}</pre>}
 {entry.rubric&&<RubricTable rubric={entry.rubric} caption="Original rubric"/>}
 <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(entry.response,null,2)}</pre>
 {Object.entries(entry.files).map(([id,file])=><p key={id}><a href={`data:application/octet-stream;base64,${file.data}`} download={id}>Download original attachment {id}</a></p>)}
 </div>}</div>)}</section>;
}
