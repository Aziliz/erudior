import assert from "node:assert/strict";
import { createClassroomSubmissionStore, type ClassroomSubmissionIO } from "../src/lib/classroomSubmissionStore.ts";
import { classFile, makeHandIn } from "../src/lib/classroom.ts";
import { newClass, newStudent, type Family } from "../src/lib/family.ts";
import { emptyProgress } from "../src/lib/storage.ts";
const student = newStudent("Learner", 7), other = newStudent("Other", 7);
const cls = newClass("Class", [student.id]); cls.assignments = [{ courseId: "math", assigned: "2026-10-28" }];
const family = { format:"erudior-family", version:1, mode:"classroom", students:[student,other], classes:[cls], state:"",route:"",year:{start:"2026-01-01",end:"2026-12-31"},dailyMinutes:180,parent:{password:{salt:"",hash:"",iterations:1},recovery:{salt:"",hash:"",iterations:1}},reminders:[],done:[] } as Family;
const progress = emptyProgress(); progress.lessonsDone={"math/lesson":"2026-10-28T10:00:00Z"};
const handin = await makeHandIn(classFile(family,cls,()=>"Math"),student.id,progress);
function fixture() {
 const state=new Map<string,string>([["family",JSON.stringify(family)]]); let fail=""; let mutations=0;
 const io:ClassroomSubmissionIO={readState:async k=>state.get(k)??null,writeState:async(k,v)=>{if(fail===k){fail="";throw Error("disk failure");} state.set(k,v);mutations++;},updateState:async(k,fn)=>{const text=await fn(state.get(k)??null);await io.writeState(k,text);return text;},readFamily:async()=>JSON.parse(state.get("family")!),writeFamily:async f=>{state.set("family",JSON.stringify(f));},readFile:async()=>null,writeFile:async()=>{},now:()=>"2026-10-28T12:00:00Z"};
 return {state,io,store:createClassroomSubmissionStore(io),fail:(k:string)=>{fail=k;},mutations:()=>mutations};
}
const f=fixture(); const first=await f.store.import(handin,family);assert(first.inserted&&first.record.importComplete);
assert.equal((await f.store.load()).length,1); assert.equal(JSON.parse(f.state.get(`progress-${student.id}`)!).lessonsDone["math/lesson"],progress.lessonsDone["math/lesson"]);
assert.equal((await f.store.import(handin,family)).inserted,false);assert.equal((await f.store.load()).length,1);
let records=await f.store.review({submissionId:first.record.id,eventId:"review1",status:"reviewed",reviewedAt:"2026-10-28T13:00:00Z",note:"Inspected"},family);
assert.equal(records[0].reviewEvents.length,1);
records=await f.store.review({submissionId:first.record.id,eventId:"review1",status:"reviewed",reviewedAt:"2026-10-28T13:00:00Z",note:"Inspected"},family);assert.equal(records[0].reviewEvents.length,1);
records=await f.store.review({submissionId:first.record.id,eventId:"review2",status:"needs_revision",reviewedAt:"2026-10-28T14:00:00Z",note:"Explain"},family);assert.equal(records[0].reviewEvents.length,2);
assert.equal((await createClassroomSubmissionStore(f.io).load())[0].status,"needs_revision");
for(const key of ["classroom-submissions",`progress-${student.id}`,"family"]){
 const f=fixture();f.fail(key);await assert.rejects(f.store.import(handin,family),/disk/);
 const pending=await f.store.load();assert(pending.every(r=>!r.importComplete));
 if(pending.length)await assert.rejects(f.store.review({submissionId:pending[0].id,eventId:"x",status:"reviewed",reviewedAt:"2026-10-28T13:00:00Z",note:""},family),/Finish importing/);
 await createClassroomSubmissionStore(f.io).import(handin,family);assert.equal((await f.store.load()).length,1);assert((await f.store.load())[0].importComplete);
}
const reviewFailure=fixture();const imported=await reviewFailure.store.import(handin,family);reviewFailure.fail("classroom-submissions");
const decision={submissionId:imported.record.id,eventId:"stable",status:"reviewed" as const,reviewedAt:"2026-10-28T13:00:00Z",note:"Retry"};
await assert.rejects(reviewFailure.store.review(decision,family),/disk/);assert.equal((await reviewFailure.store.load())[0].status,"pending");await reviewFailure.store.review(decision,family);assert.equal((await reviewFailure.store.load())[0].reviewEvents.length,1);
const denied=fixture();const changed=structuredClone(family);changed.classes![0].students=[];denied.state.set("family",JSON.stringify(changed));await assert.rejects(denied.store.import(handin,family),/roster/);assert.equal(denied.mutations(),0);
const corrupt=fixture();corrupt.state.set("classroom-submissions","{bad");await assert.rejects(corrupt.store.import(handin,family));assert.equal(corrupt.state.get("classroom-submissions"),"{bad");
const concurrent=fixture();await Promise.all([concurrent.store.import(handin,family),concurrent.store.import(handin,family)]);assert.equal((await concurrent.store.load()).length,1);
const update=fixture();const originalUpdate=update.io.updateState;update.io.updateState=async(k,fn)=>{if(k.startsWith("progress-")){const latest=emptyProgress();latest.lessonsDone={"math/other":"2026-10-27T10:00:00Z"};update.state.set(k,JSON.stringify(latest));}return originalUpdate(k,fn);};await update.store.import(handin,family);assert.equal(Object.keys(JSON.parse(update.state.get(`progress-${student.id}`)!).lessonsDone).length,2);
console.log("classroom durable store: exact receipt, reload, idempotence, interrupted import/review recovery, current membership and latest-state projection passed");
