import assert from "node:assert/strict";
// Exercise the production backup orchestration against an in-memory native-command
// boundary: no browser database, real user files, or credentials are accessed.
const state = new Map<string, string>(); const mutations: string[] = [];
(globalThis as any).isTauri = true;
(globalThis as any).window = { __TAURI_INTERNALS__: { invoke: async (command: string, args: any) => {
 if (command === "load_state") return state.get(args.name) ?? null;
 if (command === "save_state") { mutations.push(args.name); if(args.content === null) state.delete(args.name); else state.set(args.name,args.content); return; }
 if (command === "load_progress") return state.get("progress") ?? null;
 if (command === "save_progress") { mutations.push("progress"); state.set("progress",args.content); return; }
 if (command === "delete_item") { mutations.push("delete:"+args.id); return; }
 throw Error("Unexpected storage command: "+command);
} } };
const {collect, restoreContents, encryptText, decryptText} = await import("../src/lib/backup.ts");
const {recordHandIn, reviewHandIn, SUBMISSION_LIMITS} = await import("../src/lib/submissionHistory.ts");
const {createSpreadsheetSubmission} = await import("../src/lib/spreadsheetEvidence.ts");
const {SAMPLE_ASSIGNMENT} = await import("../src/lib/spreadsheetAssignments.ts");
const evidence = createSpreadsheetSubmission({id:"attempt1",submittedAt:1700000000000,courseId:"math",lessonId:"lesson",assignment:SAMPLE_ASSIGNMENT,workbook:SAMPLE_ASSIGNMENT.starter});
const handin = {format:"erudior-handin",version:1,classId:"class1",className:"Class",studentId:"student1",studentName:"Learner",created:"2026-10-28T08:00:00Z",courses:["math"],progress:{attempts:[],lessonsDone:{},drills:{},spreadsheetSubmissions:{attempt1:evidence}},mac:btoa("s".repeat(32))};
let records = recordHandIn([],handin as any,"2026-10-28T09:00:00Z").records;
records = reviewHandIn(records,records[0].id,"needs_revision","2026-10-28T10:00:00Z","Explain the formula","review1");
const second = recordHandIn(records,{...handin,mac:btoa("t".repeat(32))} as any,"2026-10-28T11:00:00Z").records;
const ledger = {version:1,records:second,complete:[records[0].id]};
state.set("classroom-submissions",JSON.stringify(ledger));
const backup = await collect([],[]);
assert.deepEqual(backup.classroomSubmissions,ledger);
const encrypted = await encryptText(JSON.stringify(backup),"test-only passphrase");
assert(!encrypted.includes("Explain the formula"));
await assert.rejects(decryptText(JSON.parse(encrypted),"wrong passphrase"),/Wrong passphrase/);
state.set("classroom-submissions",JSON.stringify({version:1,records:[],complete:[]}));
await restoreContents(await decryptText(JSON.parse(encrypted),"test-only passphrase"),{courses:[],banks:[]});
assert.deepEqual(JSON.parse(state.get("classroom-submissions")!),ledger);
assert.equal(mutations.at(-1),"classroom-submissions");
for (const invalid of [null,{}, {...ledger,complete:["missing"]}, {...ledger,records:Array(SUBMISSION_LIMITS.records+1).fill(records[0])}, {...ledger,records:[{...records[0],snapshot:{...handin,progress:{...handin.progress,spreadsheetSubmissions:{attempt1:{...evidence,grade:{...evidence.grade,score:1}}}}}}]}]) {
 const before = [...state]; mutations.length=0;
 await assert.rejects(restoreContents(JSON.stringify({...backup,classroomSubmissions:invalid}),{courses:[{id:"would-delete"} as any],banks:[]}));
 assert.deepEqual([...state],before); assert.deepEqual(mutations,[]);
}
state.set("classroom-submissions","{damaged"); await assert.rejects(collect([],[]));
state.set("classroom-submissions",JSON.stringify(ledger));
const {classroomSubmissions:_,...legacy}=backup;
await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});
assert.equal(state.has("classroom-submissions"),false);
assert.equal((await collect([],[])).classroomSubmissions,undefined);
console.log("classroom backup: encrypted snapshot/review/pending roundtrip, wrong passphrase, preflight tampering/count rejection, damaged collect and legacy clear passed");

// Optional assessed-work evidence is validated even without an instructor receipt.
const {createAssessedWorkSubmission}=await import('../src/lib/assessedWorkEvidence.ts');
const at='2026-10-28T12:00:00Z';
const workEvidence=createAssessedWorkSubmission({id:'writing1',submittedAt:Date.parse(at),courseId:'writing',assignmentId:'essay',kind:'writing',task:{id:'essay',title:'Original task',kind:'short',prompt:'Original prompt'},response:{kind:'writing',started:at,updated:at,submitted:at,rounds:1,text:'Original answer',photos:[{id:'p1',fileId:'f1',name:'evidence.txt',mime:'text/plain',bytes:3,caption:'Original',date:'2026-10-28'}]},files:{f1:{mime:'text/plain',data:'AQID'}}});
const withWork={...backup,classroomSubmissions:undefined,progress:{...backup.progress,assessedWorkSubmissions:{writing1:workEvidence}}};
await restoreContents(await decryptText(JSON.parse(await encryptText(JSON.stringify(withWork),'another test passphrase')),'another test passphrase'),{courses:[],banks:[]});
assert.deepEqual(JSON.parse(state.get('progress')!).assessedWorkSubmissions,{writing1:workEvidence});
assert.deepEqual((await collect([],[])).progress.assessedWorkSubmissions,{writing1:workEvidence});
for(const invalid of [{...workEvidence,task:{...workEvidence.task,id:'different'}},{...workEvidence,files:{f1:{mime:'text/plain',data:'AQI='}}}]) {
 const damaged={...withWork,progress:{...withWork.progress,assessedWorkSubmissions:{writing1:invalid}}};
 const before=[...state];mutations.length=0;
 await assert.rejects(restoreContents(JSON.stringify(damaged),{courses:[{id:'never-delete'} as any],banks:[]}));
 assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'malformed assessed evidence rejected before any restore mutation');
}
state.set('progress',JSON.stringify({...withWork.progress,assessedWorkSubmissions:{writing1:{...workEvidence,version:2}}}));
await assert.rejects(collect([],[]));
console.log('assessed-work backup: encrypted original task/response/file roundtrip and collect/restore preflight passed');
const {emptyCourse}=await import('../src/lib/course.ts');
const validCourse=emptyCourse('Backup work course');
for(const course of [{...validCourse,writing:[null]},{...validCourse,writing:[{id:'essay',title:'Essay',kind:'short',prompt:'Prompt',module:'missing'}]},{...validCourse,lessons:[{id:'lesson',module:validCourse.modules[0].id,title:'Lesson',body:'```assignment\nwriting: missing\n```'}]}]) {
 const before=[...state];mutations.length=0;
 await assert.rejects(restoreContents(JSON.stringify({...withWork,courses:[course]}),{courses:[{id:'never-delete'} as any],banks:[]}),/Invalid backup course work/);
 assert.deepEqual([...state],before);assert.deepEqual(mutations,[]);
}
console.log('encrypted course backup: malformed raw work and dangling module/lesson references rejected before writes');
