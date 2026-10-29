import assert from "node:assert/strict";
import { createAssessedWorkSubmission, validateAssessedWorkSubmission, mergeAssessedWorkSubmissions, appendAssessedWorkSubmission, assessedWorkSubmissionsForCourses, ASSESSED_WORK_LIMITS } from "../src/lib/assessedWorkEvidence.ts";
const now=Date.parse("2026-10-28T10:00:00Z");
const task={id:"essay",title:"Explain",kind:"short" as const,prompt:"Explain your reasoning.",rubric:"r1"};
const rubric={id:"r1",criteria:[{id:"reason",name:"Reasoning",levels:[{label:"Clear",points:2},{label:"Try again",points:0}]}]};
const response={kind:"writing" as const,started:new Date(now-1000).toISOString(),updated:new Date(now).toISOString(),submitted:new Date(now).toISOString(),rounds:1,text:"Original reasoning",self:{reason:2}};
const input={id:"e1",submittedAt:now,courseId:"course",assignmentId:"essay",kind:"writing" as const,task,rubric,response,files:{}};
const first=createAssessedWorkSubmission(input);
assert.deepEqual(validateAssessedWorkSubmission(first),[]);assert(Object.isFrozen(first.task));assert(Object.isFrozen(first.response));
task.prompt="Revised";response.text="Edited";rubric.criteria[0].levels[0].points=3;
assert.equal((first.task as any).prompt,"Explain your reasoning.");assert.equal((first.response as any).text,"Original reasoning");assert.equal(first.rubric!.criteria[0].levels[0].points,2);
assert.deepEqual(mergeAssessedWorkSubmissions({e1:first},JSON.parse(JSON.stringify({e1:first}))),{e1:first});
assert.throws(()=>appendAssessedWorkSubmission({e1:first},createAssessedWorkSubmission({...first,submittedAt:now+1,response:{...first.response as any,submitted:new Date(now+1).toISOString()}})),/Conflicting/);
assert.deepEqual(assessedWorkSubmissionsForCourses({e1:first},["cours"]),{});
for(const bad of [null,{...first,version:2},{...first,assignmentId:"wrong"},{...first,score:1},{...first,rubric:{...first.rubric,criteria:[first.rubric!.criteria[0],first.rubric!.criteria[0]]}},{...first,response:{...first.response as any,self:{reason:999}}},{...first,response:{...first.response as any,submitted:"bad"}},{...first,files:{unreferenced:{mime:"text/plain",data:"YQ=="}}}])assert(validateAssessedWorkSubmission(bad).length);
const ref={id:"file1",fileId:"f1",name:"answer.txt",mime:"text/plain",bytes:1,caption:"Evidence",date:"2026-10-28"};
const withFile=createAssessedWorkSubmission({...first,response:{...first.response as any,photos:[ref]},files:{f1:{mime:"text/plain",data:"YQ=="}}});
assert.deepEqual(validateAssessedWorkSubmission(withFile),[]);
for(const files of [{},{f1:{mime:"image/png",data:"YQ=="}},{f1:{mime:"text/plain",data:"YmI="}}])assert(validateAssessedWorkSubmission({...withFile,files}).length);
const labTask={id:"lab",title:"Observe",adult:true,safety:["Ask an adult"],materials:["Water"],steps:[{text:"Observe",adult:true}],tables:[{id:"t",columns:["Value"],rows:1}],questions:[{id:"q",prompt:"What happened?",kind:"observation" as const}]};
const {rubric: _rubric, ...withoutRubric}=first;
const lab=createAssessedWorkSubmission({...withoutRubric,id:"lab1",assignmentId:"lab",kind:"lab",task:labTask,response:{kind:"lab",started:response.started,updated:response.updated,submitted:response.submitted,rounds:1,done:[0],have:[0],tables:{t:[["1"]]},answers:{q:"Observed"}}});
assert.deepEqual(validateAssessedWorkSubmission(lab),[]);
for(const patch of [{done:[2]},{tables:{wrong:[["1"]]}},{answers:{wrong:"x"}}])assert(validateAssessedWorkSubmission({...lab,response:{...lab.response,...patch}}).length);
const logInput={id:"log1",submittedAt:now,courseId:"course",assignmentId:"activity-log",kind:"log" as const,task:{title:"Practice",types:["Music"],uploads:true},response:[{id:"entry1",courseId:"course",date:"2026-10-28",minutes:30,type:"Music",note:"Scales"}],files:{}};
const log=createAssessedWorkSubmission(logInput);assert.deepEqual(validateAssessedWorkSubmission(log),[]);
assert(validateAssessedWorkSubmission({...log,response:[{...logInput.response[0],courseId:"other"}]}).length);
assert(validateAssessedWorkSubmission({...log,response:[logInput.response[0],logInput.response[0]]}).length);
for(const bad of [
 {...first,id:"../escape"}, {...first,response:{...first.response as any,tables:{arbitrary:{unsafe:"payload"}}}},
 {...first,response:{...first.response as any,started:"2030-01-01T00:00:00Z"}},
 {...withFile,response:{...withFile.response as any,photos:[{...ref,date:"2026-02-31"}]}},
 {...withFile,response:{...withFile.response as any,photos:[{...ref,mime:"text/html; arbitrary"}]},files:{f1:{mime:"text/html; arbitrary",data:"YQ=="}}},
 {...log,response:[{...logInput.response[0],date:"2026-02-31"}]},
 {...log,response:[{...logInput.response[0],credited:{fake:"object"}}]},
]) assert(validateAssessedWorkSubmission(bad).length);
for(const reserved of ["__proto__","constructor","prototype"]) {
 assert(validateAssessedWorkSubmission({...first,task:{...first.task,module:reserved}}).length);
 assert(validateAssessedWorkSubmission({...first,rubric:{...first.rubric,criteria:[{...first.rubric!.criteria[0],id:reserved}]}}).length);
 assert(validateAssessedWorkSubmission({...lab,task:{...lab.task,questions:[{id:reserved,prompt:"Why?",kind:"observation"}]}}).length);
}
assert(validateAssessedWorkSubmission({...first,task:{...first.task,kind:["short"]}}).length);
assert(validateAssessedWorkSubmission({...log,submittedAt:9000000000000000}).length);
const tooMany=Object.fromEntries(Array.from({length:ASSESSED_WORK_LIMITS.count+1},(_,i)=>{const e=createAssessedWorkSubmission({...first,id:`e${i}`});return[e.id,e];}));assert.throws(()=>mergeAssessedWorkSubmissions({},tooMany),/oversized/);
const cycle:any={...first};cycle.loop=cycle;assert(validateAssessedWorkSubmission(cycle).length);
console.log("assessed work evidence: immutable versioned task/rubric/response/files, schema, isolation, conflicts, bounds, writing/lab/activity passed");

const {prepareAssessedWorkSubmission,pendingAssessedWorkSubmission,beginAssessedWorkSubmissionSave,confirmAssessedWorkSubmissionSave}=await import("../src/lib/assessedWorkSubmissionState.ts");
const colliding=createAssessedWorkSubmission({...first,id:"collisionwriting",assignmentId:"activity-log",task:{...first.task,id:"activity-log"} as any});
prepareAssessedWorkSubmission("isolation",colliding);prepareAssessedWorkSubmission("isolation",log);
assert.equal(pendingAssessedWorkSubmission("isolation","course","activity-log","writing")!.submission.id,colliding.id);
assert.equal(pendingAssessedWorkSubmission("isolation","course","activity-log","log")!.submission.id,log.id);
for(const entry of [colliding,log]){assert(beginAssessedWorkSubmissionSave("isolation",entry));confirmAssessedWorkSubmissionSave("isolation",entry);}
