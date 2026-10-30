import assert from "node:assert/strict";
import { createClassroomSubmissionStore, validateClassroomSubmissionState, type ClassroomSubmissionIO } from "../src/lib/classroomSubmissionStore.ts";
import { classFile, makeHandIn } from "../src/lib/classroom.ts";
import { newClass, newStudent, type Family } from "../src/lib/family.ts";
import { emptyProgress } from "../src/lib/storage.ts";
import { stateTransactions } from "../src/lib/stateLock.ts";
const a = newStudent("Delete me", 7), b = newStudent("Keep me", 7);
const cls = newClass("Class", [a.id, b.id]); cls.assignments = [{ courseId: "math", assigned: "2026-10-28" }];
const family = { format:"erudior-family",version:1,mode:"classroom",students:[a,b],classes:[cls] } as Family;
const h = await makeHandIn(classFile(family,cls,()=>"Math"),a.id,emptyProgress());
const other = await makeHandIn(classFile(family,cls,()=>"Math"),b.id,emptyProgress());
function fixture(f = family) {
  const data = new Map<string,string>([["family",JSON.stringify(f)]]);
  let failure = "";
  const backend = { read: async(k:string)=>data.get(k)??null, write:async(k:string,v:string|null)=>{ if(failure===k){failure="";throw Error("injected failure");} if(v===null)data.delete(k);else data.set(k,v); } };
  const tx = stateTransactions(backend);
  const io:ClassroomSubmissionIO = { readState:backend.read,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(data.get("family")!),writeFamily:async f=>tx.save("family",JSON.stringify(f)),readFile:async()=>null,writeFile:async()=>{},now:()=>"2026-10-28T12:00:00Z" };
  return {data,io,store:createClassroomSubmissionStore(io),fail:(key:string)=>{failure=key;}};
}
const f=fixture();const receipt=await f.store.import(h,family);await f.store.import(other,family);
await f.store.review({submissionId:receipt.record.id,eventId:"decision",status:"reviewed",reviewedAt:"2026-10-28T12:30:00Z",note:"Personal note"},family);
for(const prefix of ["records","session","portfolio"]) f.data.set(`${prefix}-${a.id}`,"personal data");
const workspace={version:1,entries:[{id:"private-note",kind:"note",title:"Private notebook",body:"Private student notes",status:"active",createdAt:"2026-10-30T10:00:00.000Z",updatedAt:"2026-10-30T10:00:00.000Z"}]};
f.data.set(`progress-${a.id}`,JSON.stringify({...emptyProgress(),studentWorkspace:workspace}));
f.data.set(`progress-${b.id}`,JSON.stringify({...emptyProgress(),studentWorkspace:workspace}));
const updated=await f.store.deleteStudent(a.id,family);
assert.deepEqual(JSON.parse(f.data.get(`progress-${b.id}`)!).studentWorkspace,workspace,"deletion preserves the other learner workspace");
assert.deepEqual(updated.students.map(s=>s.id),[b.id]);assert.deepEqual(updated.classes![0].students,[b.id]);assert.equal(updated.classes![0].handins[a.id],undefined);
for(const prefix of ["progress","records","session","portfolio"]) assert.equal(f.data.has(`${prefix}-${a.id}`),false);
const ledger=validateClassroomSubmissionState(f.data.get("classroom-submissions")!);
assert.deepEqual(ledger.deletedStudentIds,[a.id]);assert.equal(ledger.records.length,1);assert.equal(ledger.records[0].studentId,b.id);assert.equal(ledger.complete.length,1);
assert(!f.data.get("classroom-submissions")!.includes("Personal note"));
assert(!f.data.get("classroom-submissions")!.includes(a.name));
assert.deepEqual(validateClassroomSubmissionState(JSON.stringify(ledger)).deletedStudentIds,[a.id],"backup/state roundtrip preserves deletion markers");
// Even an accidentally restored stale roster cannot revive deleted evidence.
f.data.set("family",JSON.stringify(family));await assert.rejects(f.store.import(h,family),/deleted/);
assert.equal(f.data.has(`progress-${a.id}`),false);
// Failure leaves the profile visible for retry, but permanently blocks re-import.
for(const target of ["classroom-submissions",`progress-${a.id}`,`records-${a.id}`,`session-${a.id}`,`portfolio-${a.id}`,"family"]) {
  const x=fixture();await x.store.import(h,family);x.fail(target);
  await assert.rejects(x.store.deleteStudent(a.id,family),/failure/);
  assert(JSON.parse(x.data.get("family")!).students.some((s:any)=>s.id===a.id));
  await createClassroomSubmissionStore(x.io).deleteStudent(a.id,family);
  assert.equal((await x.store.load()).length,0);assert.equal(x.data.has(`progress-${a.id}`),false);
}
// Ordinary homeschool profiles use the same explicit cleanup, not classroom-only gates.
const homeschool={...family,mode:undefined,classes:undefined};const home=fixture(homeschool);home.data.set(`progress-${a.id}`,"old");
assert.deepEqual((await home.store.deleteStudent(a.id,homeschool)).students.map(s=>s.id),[b.id]);
// A distinct importer paused before its progress transaction cannot undo deletion.
const navigatorDescriptor=Object.getOwnPropertyDescriptor(globalThis,"navigator");
Object.defineProperty(globalThis,"navigator",{value:undefined,configurable:true});
const race=fixture();let reached!:()=>void, resume!:()=>void;const atProgress=new Promise<void>(r=>{reached=r;});const release=new Promise<void>(r=>{resume=r;});
const importerIO={...race.io,updateState:async(k:string,fn:Parameters<ClassroomSubmissionIO["updateState"]>[1])=>{if(k===`progress-${a.id}`){reached();await release;}return race.io.updateState(k,fn);}};
const importing=createClassroomSubmissionStore(importerIO).import(h,family);await atProgress;
await race.store.deleteStudent(a.id,family);resume();await assert.rejects(importing,/deleted/);
assert.equal(race.data.has(`progress-${a.id}`),false);assert.equal((await race.store.load()).length,0);
if(navigatorDescriptor)Object.defineProperty(globalThis,"navigator",navigatorDescriptor);
// Roster-only changes do not call deletion or erase saved evidence.
const archive=fixture();await archive.store.import(h,family);const archived=structuredClone(family);archived.classes![0].students=[];archive.data.set("family",JSON.stringify(archived));
assert.equal((await archive.store.load()).length,1);assert.equal(validateClassroomSubmissionState(archive.data.get("classroom-submissions")!).deletedStudentIds,undefined);
assert.throws(()=>validateClassroomSubmissionState(JSON.stringify({...ledger,deletedStudentIds:["../unsafe"]})),/deletion markers/);
console.log("classroom profile deletion: ledger/privacy purge, other learner retention, tombstones, stale import race, partial failure retry, homeschool and roster archival passed");
// Simulate a second native view whose per-key CAS writes after the tombstone check.
Object.defineProperty(globalThis,"navigator",{value:undefined,configurable:true});
const late=fixture();let computed!:()=>void, finish!:()=>void;const afterCheck=new Promise<void>(r=>{computed=r;});const finishWrite=new Promise<void>(r=>{finish=r;});
const lateIO={...late.io,updateState:async(k:string,fn:Parameters<ClassroomSubmissionIO["updateState"]>[1])=>{
  if(k!==`progress-${a.id}`)return late.io.updateState(k,fn);
  const next=await fn(late.data.get(k)??null);computed();await finishWrite;late.data.set(k,next);return next;
}};
const lateImport=createClassroomSubmissionStore(lateIO).import(h,family);await afterCheck;await late.store.deleteStudent(a.id,family);finish();await assert.rejects(lateImport,/deleted/);
assert.equal(late.data.has(`progress-${a.id}`),false,"post-write cleanup removes late projection");assert.equal((await late.store.load()).length,0);
if(navigatorDescriptor)Object.defineProperty(globalThis,"navigator",navigatorDescriptor);
// Legacy receipts can be retained, but incomplete attached evidence cannot be reviewed.
const photo={id:"photo1",fileId:"file1",name:"evidence.txt",mime:"text/plain",bytes:1,caption:"Original",date:"2026-10-28"};
const withMissing=emptyProgress();withMissing.work={"math/writing":{kind:"writing",started:h.created,updated:h.created,text:"Work",photos:[photo]}};
const legacy=await makeHandIn(classFile(family,cls,()=>"Math"),a.id,withMissing);
const legacyStore=fixture();const legacyReceipt=await legacyStore.store.import(legacy,family);
await assert.rejects(legacyStore.store.review({submissionId:legacyReceipt.record.id,eventId:"missing",status:"reviewed",reviewedAt:"2026-10-28T13:00:00Z",note:""},family),/missing referenced attachments/);
assert.equal((await legacyStore.store.load())[0].reviewEvents.length,0);
console.log("classroom deletion: late per-key CAS cleanup and legacy missing-evidence review gate passed");
