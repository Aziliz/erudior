import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import type { AppApi } from "../src/App.tsx";
import type { Progress } from "../src/lib/types.ts";
import { ADMIN_EXAM, RHCSA_MOCK, MOCK_TASKS, VM_TASKS, NFS_EXAM, NFS_LAB, validVmReport, validateVmReports, vmReportKey, vmScore, vmTotal, type VmTaskReport } from "../src/lib/vmLab.ts";

const dom = new JSDOM("<!doctype html><main></main>", {url:"https://example.test"});
Object.assign(globalThis, {window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement,
  localStorage:dom.window.localStorage, isTauri:true, IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});
const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { assertCourseImportPreservesFields } = await import("../src/lib/courseImport.ts");
const { normalizeCourse, serializeCourse } = await import("../src/lib/course.ts");
const { emptyProgress, useStudentFiles } = await import("../src/lib/storage.ts");
const { parseAnonymousProgress } = await import("../src/lib/anonymousPrivacy.ts");
const { default: Panel } = await import("../src/components/VmExamPanel.tsx");
const { default: ProgressView } = await import("../src/pages/CourseProgress.tsx");
const { default: LessonView } = await import("../src/pages/LessonView.tsx");
const raw = JSON.parse(readFileSync("samples/demo-vm-lab.json", "utf8"));
assertCourseImportPreservesFields(raw);
const course = normalizeCourse(raw);
const lesson = course.lessons.find(l => l.vmLab === ADMIN_EXAM)!;
const tasks = lesson.vmTasks!;
assert.deepEqual(JSON.parse(serializeCourse(course)).lessons.find((l:{id:string})=>l.id===lesson.id).vmTasks,tasks);
for (const bad of [undefined, [], [tasks[0],tasks[0]], [{id:"shell",points:1}], [{id:"__proto__",points:1}],
  [{...tasks[0],points:1.5}], [{...tasks[0],points:101}], [{...tasks[0],script:"bad"}]]) {
  const invalid = {...raw,lessons:[{...lesson,vmTasks:bad}]};
  assert.throws(()=>normalizeCourse(invalid));
  assert.throws(()=>assertCourseImportPreservesFields(invalid));
}
for (const scenario of [NFS_EXAM,NFS_LAB]) assert.throws(()=>normalizeCourse({...raw,lessons:[{...lesson,vmLab:scenario}]}));
for (const mins of [0,241,10.5,"20"]) assert.throws(()=>normalizeCourse({...raw,lessons:[{...lesson,vmExamMinutes:mins}]}));
const start = 1_700_000_000_000;
const report: VmTaskReport = {
  attempt:"467cf151-2285-41d8-af62-b3db18e23e7a",checkedAt:start+1810000,
  exam:{startedAt:start,deadlineAt:start+1800000,submittedAt:start+1800000,reason:"expired"},
  tasks:[{...tasks[0],before:true,after:true},{...tasks[1],before:true},{...tasks[2],before:false,after:false}],
};
const key = vmReportKey(course.id,lesson.id,ADMIN_EXAM);
assert(validVmReport(report,ADMIN_EXAM));
assert.equal(vmScore(report),7);
assert.equal(vmTotal(report),10);
assert(!validVmReport({...report,tasks:[{...tasks[0],before:true}]},ADMIN_EXAM));
assert(!validVmReport({...report,tasks:[{...tasks[1],before:true,after:true}]},ADMIN_EXAM));
assert(!validVmReport({...report,exam:{...report.exam,reason:"submitted"}},ADMIN_EXAM));
assert(!validVmReport(report,NFS_EXAM));
assert.throws(()=>validateVmReports({[vmReportKey(course.id,lesson.id,NFS_LAB)]:report}));
assert.equal(vmScore({...report,tasks:[{...tasks[0],before:true,after:false}]}),0);
const mockCourse = normalizeCourse(JSON.parse(readFileSync("samples/rhcsa-10-practice-exam.json", "utf8")));
assert.equal(mockCourse.lessons[0].vmLab, RHCSA_MOCK);
for (const override of [{vmExamMinutes:15},{vmTasks:tasks}]) {
  const invalid={...raw,lessons:[{...raw.lessons[0],vmLab:RHCSA_MOCK,...override}]};
  assert.throws(()=>normalizeCourse(invalid));
  assert.throws(()=>assertCourseImportPreservesFields(invalid));
}
const persistentReport: VmTaskReport = {...report, gradingVersion:2,
  exam:{...report.exam,deadlineAt:start+180*60000,submittedAt:start+20*60000,reason:"submitted"},
  tasks:MOCK_TASKS.map(t=>({...t,before:true,after:t.id!=="server-team-directory"}))};
assert(validVmReport(persistentReport,RHCSA_MOCK));
assert.equal(vmScore(persistentReport),270);
assert.equal(new Set(MOCK_TASKS.map(t=>VM_TASKS[t.id].area)).size,10);
assert(!validVmReport({...persistentReport,tasks:report.tasks},RHCSA_MOCK));
assert(!validVmReport({...persistentReport,tasks:persistentReport.tasks.map(({after,...t})=>t)},ADMIN_EXAM));
assert(!validVmReport({...persistentReport,exam:report.exam},RHCSA_MOCK));
const {VmResult} = await import("../src/components/VmLabParts.tsx");
const mockText = (r:VmTaskReport)=>new JSDOM(renderToStaticMarkup(createElement(VmResult,{saved:r,scenario:RHCSA_MOCK}))).window.document.body.textContent!;
assert.match(mockText(persistentReport),/270 of 300/);
assert.match(mockText(persistentReport),/Erudior practice result · Pass/);
assert.match(mockText({...persistentReport,tasks:persistentReport.tasks.map((t,i)=>({...t,after:i<6}))}),/Below target/);
assert.match(mockText({...persistentReport,tasks:persistentReport.tasks.map((t,i)=>({...t,after:i<7}))}),/practice result · Pass/);
const restoredMock = parseAnonymousProgress(JSON.stringify({...emptyProgress(),vmLabReports:{[vmReportKey(mockCourse.id,mockCourse.lessons[0].id,RHCSA_MOCK)]:persistentReport}}));
assert.equal(Object.values(restoredMock.vmLabReports!)[0].checkedAt,persistentReport.checkedAt);
let progress: Progress = emptyProgress();
let phase="new", allow=false, saveFails=true, generation=0;
const actions:string[]=[];
const state=()=>({running:{client:phase!=="new",server:phase!=="new"}, password:phase==="active"?"fixture":null,
  report:phase==="complete"?report:null,exam:{phase,id:phase==="new"?null:report.attempt,
    rubric:["new","prepared"].includes(phase)?undefined:tasks,remainingMs:phase==="active"?605000:0}});
(dom.window as any).__TAURI_INTERNALS__={invoke:async(command:string,args:any)=>{
  if(command==="install_kind")return "linux-package";
  if(command==="plugin:dialog|message")return allow?"Yes":"No";
  assert.equal(command,"vm_lab");assert.equal(args.scenario,ADMIN_EXAM);
  actions.push(args.action);
  if(args.action==="start")phase="prepared";
  if(args.action==="begin"){assert.deepEqual(args.tasks,tasks);phase="active";}
  if(args.action==="submit"){assert.equal(args.expected,report.attempt);phase="submitted";}
  return state();
}};
useStudentFiles("learnera");
const root=createRoot(document.querySelector("main")!);
const api={student:{id:"learnera"},get progress(){return progress;},courses:[course],updateProgress:async(fn:(p:Progress)=>Progress)=>{
  if(saveFails)throw Error("Storage unavailable");progress=fn(progress);render();
}} as unknown as AppApi;
function render(){
  root.render(createElement(Panel,{key:generation,api,course:course.id,lesson:lesson.id,scenario:ADMIN_EXAM,
    minutes:30,tasks:generation ? [{...tasks[0],points:99}] : tasks}));
}
const { clickVmButton: click } = await import("./vm-ui-interactions.mts");
await act(async()=>render());
await click("Prepare machines");await click("Begin 30-minute exam");
assert.equal(document.querySelector('[role="timer"]')?.textContent,"10:05 remaining");
await act(async()=>{generation++;render();});
assert.equal(actions.filter(x=>x==="begin").length,1);
assert.match(document.body.textContent!,/Shared team directory/);
assert(!document.body.textContent!.includes("99 points"));
await click("Submit exam");assert(!actions.includes("submit"));
allow=true;await click("Submit exam");assert.equal(progress.vmLabReports,undefined);
phase="complete";await click("Refresh status");assert.match(document.body.textContent!,/Storage unavailable/);
saveFails=false;await click("Save exam result");
assert.match(document.body.textContent!,/7 of 10 points/);
const reopened=parseAnonymousProgress(JSON.stringify(progress));
assert.deepEqual(reopened.vmLabReports?.[key],report);
await act(async()=>root.unmount());
const restoredApi={...api,progress:reopened};
const html=renderToStaticMarkup(createElement(ProgressView,{api:restoredApi,course}));
assert.match(new JSDOM(html).window.document.body.textContent!,/7\/10 points/);
for(const l of course.lessons) {
  const lessonHtml=renderToStaticMarkup(createElement(LessonView,{api:restoredApi,course,lesson:l}));
  assert(lessonHtml.includes(l.vmLab===NFS_LAB?'aria-label="Virtual machine lab"':'aria-label="Timed practical exam"'));
}
console.log("Weighted exam import, per-task scoring, sealed submission, pinned rubric, save retry and restored course progress passed.");
const mockLesson = mockCourse.lessons[0];
const mockKey = vmReportKey(mockCourse.id, mockLesson.id, RHCSA_MOCK);
let mockBegun = false;
(dom.window as any).__TAURI_INTERNALS__.invoke = async (cmd:string,args:any) => {
  if(cmd === "install_kind") return "linux-package";
  assert.equal(cmd, "vm_lab");
  assert.equal(args.scenario, RHCSA_MOCK);
  assert.equal(args.minutes, 180);
  assert.deepEqual(args.tasks, MOCK_TASKS);
  if (args.action === "begin") mockBegun = true;
  return {running:{client:true,server:true}, password:null,report:null,
    exam:{phase:mockBegun?"active":"prepared",id:report.attempt,gradingVersion:2,remainingMs:180*60000}};
};
const mockRoot = createRoot(document.querySelector("main")!);
await act(async()=>mockRoot.render(createElement(LessonView,{api:{...api,courses:[mockCourse]},course:mockCourse,lesson:mockLesson})));
await click("Begin 180-minute exam");
assert(mockBegun);
assert.match(document.body.textContent!,/180:00 remaining/);
await act(async()=>mockRoot.unmount());
const restoredView = renderToStaticMarkup(createElement(ProgressView,{api:{...api,courses:[mockCourse],progress:restoredMock},course:mockCourse}));
assert.match(new JSDOM(restoredView).window.document.body.textContent!, /270\/300 points.*Practice pass/);
assert.deepEqual(restoredMock.vmLabReports?.[mockKey], persistentReport);
console.log("RHEL 10 practice profile, ten-area report, both sides of the pass target, backup and lesson launch passed.");

// Randomized second form: values drawn per attempt, one task per area.
{
  const { RHCSA_MOCK2, DEFAULT_PARAMS, AREA_POOLS, taskInstruction } = await import("../src/lib/vmLab.ts");
  const { spawnSync } = await import("node:child_process");
  const py = spawnSync("python3", ["-c", "import sys,json;sys.path.insert(0,'src-tauri/src/vm_lab');import runner;print(json.dumps([runner.DEFAULT_PARAMS,[list(p) for _,p in runner.AREA_POOLS],[[a,list(p)] for a,p in runner.AREA_POOLS]]))"], {encoding: "utf8"});
  assert.equal(py.status, 0, py.stderr);
  const [pyDefaults, pyPools, pyAreas] = JSON.parse(py.stdout);
  assert.deepEqual(pyDefaults, DEFAULT_PARAMS);
  assert.deepEqual(pyPools, AREA_POOLS);
  for (const [area, pool] of pyAreas as [string, string[]][]) for (const id of pool) assert.equal(VM_TASKS[id as keyof typeof VM_TASKS].area, area);
  for (const id of Object.keys(VM_TASKS) as (keyof typeof VM_TASKS)[]) assert.doesNotMatch(taskInstruction(id), /\{\w+\}/);
  assert.match(taskInstruction("client-cron", {...DEFAULT_PARAMS, cronHour: "7", cronMinute: "5"}), /at 7:05/);
  assert.match(taskInstruction("client-operator", {...DEFAULT_PARAMS, opUser: "kim42"}), /kim42 user/);
  const params = {...DEFAULT_PARAMS, opUser: "kim42", webPort: "18555"};
  const drawn = {...persistentReport, params,
    tasks: AREA_POOLS.map(pool => ({id: pool[0] as keyof typeof VM_TASKS, points: 30, before: true, after: true}))};
  assert(validVmReport(drawn, RHCSA_MOCK2));
  assert(!validVmReport(drawn, RHCSA_MOCK));
  assert(!validVmReport(persistentReport, RHCSA_MOCK2));
  const {params: _omit, ...withoutParams} = drawn;
  assert(!validVmReport(withoutParams, RHCSA_MOCK2));
  assert(!validVmReport({...drawn, params: {...params, extra: "x"}}, RHCSA_MOCK2));
  assert(!validVmReport({...drawn, tasks: [...drawn.tasks].reverse()}, RHCSA_MOCK2));
  assert(!validVmReport({...drawn, tasks: drawn.tasks.map((t, i) => i ? t : {...t, points: 31})}, RHCSA_MOCK2));
  validateVmReports({[vmReportKey("c", "l", RHCSA_MOCK2)]: drawn});
  const text = new JSDOM(renderToStaticMarkup(createElement(VmResult,{saved:drawn,scenario:RHCSA_MOCK2}))).window.document.body.textContent!;
  assert.match(text, /300 of 300 points.*Pass/);
  assert.match(text, /Local storage/);

  const v2Course = {...mockCourse, lessons: [{...mockLesson, vmLab: RHCSA_MOCK2}]} as typeof mockCourse;
  let begun = false;
  (dom.window as any).__TAURI_INTERNALS__.invoke = async (cmd:string,args:any) => {
    if(cmd === "install_kind") return "linux-package";
    assert.equal(args.scenario, RHCSA_MOCK2);
    assert.equal(args.minutes, 180);
    assert.equal(args.tasks, undefined);
    if (args.action === "begin") begun = true;
    return {running:{client:true,server:true}, password:null, report:null,
      exam: begun ? {phase:"active",id:report.attempt,gradingVersion:2,remainingMs:180*60000,rubric:drawn.tasks.map(({id,points})=>({id,points})),params}
        : {phase:"prepared",id:report.attempt}};
  };
  const v2Root = createRoot(document.querySelector("main")!);
  await act(async()=>v2Root.render(createElement(LessonView,{api:{...api,courses:[v2Course]},course:v2Course,lesson:v2Course.lessons[0]})));
  assert.match(document.body.textContent!, /tasks appear when you begin/);
  await click("Begin 180-minute exam");
  assert.match(document.body.textContent!, /kim42 user/);
  assert.match(document.body.textContent!, /TCP port 18555/);
  await act(async()=>v2Root.unmount());
  console.log("Randomized RHCSA form: shared defaults, drawn values on task cards and report validation passed.");
}

const { RHCE_EXAM, ANSIBLE_TASK, lessonVmScenario, validVmTasks } = await import("../src/lib/vmLab.ts");
assert.equal(lessonVmScenario("rhce-ansible-alma10", {id:"collector-converge"}), RHCE_EXAM);
assert.equal(lessonVmScenario("ordinary-course", {id:"collector-converge"}), undefined);
assert.equal(lessonVmScenario("rhce-ansible-alma10", {id:"collector-converge", vmLab:NFS_LAB}), NFS_LAB);
const ansibleReport = {...persistentReport, tasks:[{id:ANSIBLE_TASK, points:100, before:true, after:true}]};
assert(validVmReport(ansibleReport, RHCE_EXAM));
assert(!validVmReport(ansibleReport, ADMIN_EXAM));
assert(!validVmReport({...ansibleReport, tasks:[{...ansibleReport.tasks[0], points:5}]}, RHCE_EXAM));
assert(!validVmTasks([{id:ANSIBLE_TASK, points:100}]));
assert.equal(vmScore(ansibleReport), 100);
validateVmReports({[vmReportKey("rhce-ansible-alma10","collector-converge", RHCE_EXAM)]:ansibleReport});
