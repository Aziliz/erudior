import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import type { AppApi } from "../src/App.tsx";
import type { Progress } from "../src/lib/types.ts";
import { NFS_LAB, vmReportKey, vmScore, validVmReport } from "../src/lib/vmLab.ts";

const dom = new JSDOM("<main></main>", { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document,
  HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage, isTauri: true, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const { normalizeCourse, serializeCourse } = await import("../src/lib/course.ts");
const { assertCourseImportPreservesFields } = await import("../src/lib/courseImport.ts");
const { compareCourseRevisions } = await import("../src/lib/courseRevision.ts");
const { emptyProgress, useStudentFiles } = await import("../src/lib/storage.ts");
const { default: VmLabPanel } = await import("../src/components/VmLabPanel.tsx");
const raw = JSON.parse(readFileSync("samples/demo-vm-lab.json", "utf8"));
assertCourseImportPreservesFields(raw);
const course = normalizeCourse(raw);
assert.equal(JSON.parse(serializeCourse(course)).lessons[0].vmLab, NFS_LAB);
for (const bad of ["../escape", { command: "start" }]) {
  const invalid = structuredClone(raw);
  invalid.lessons[0].vmLab = bad;
  assert.throws(() => assertCourseImportPreservesFields(invalid));
  assert.throws(() => normalizeCourse(invalid));
}
const legacy = structuredClone(raw);
delete legacy.lessons[0].vmLab;
assertCourseImportPreservesFields(legacy);
const old = normalizeCourse(legacy);
assert.equal(old.lessons[0].vmLab, undefined);
assert(compareCourseRevisions(course, { ...old, revision: 2 }).some(i => i.path.endsWith(".vmLab")));
const report = { attempt: "a878d4cb-d2d0-4fb9-bcce-0015a872989b", checkedAt: Date.now(),
  before: { automount: true, remoteFile: true }, after: { automount: false, remoteFile: true } };
assert.equal(vmScore(report), 3);
assert(!validVmReport({ ...report, after: {} }));
let progress = emptyProgress(), started = false, confirm = false, student = "learnera";
let latest: typeof report | null = null;
let saveFail = false, resolved: (() => void) | undefined, delay = false;
const actions: string[] = [];
(dom.window as any).__TAURI_INTERNALS__ = { invoke: async (command: string, args: any) => {
  if (command === "install_kind") return "linux-package";
  if (command === "plugin:dialog|message") return confirm ? "Yes" : "No";
  assert.equal(command, "vm_lab");
  assert.equal(args.scenario, NFS_LAB);
  actions.push(args.action);
  if (args.action === "start") started = true;
  if (args.action === "check") {
    if (delay) await new Promise<void>(r => { resolved = r; });
    latest = report;
  }
  if (args.action === "reset") { started = false; latest = null; }
  return { running: { client: started, server: started }, password: started ? "demo" : null, report: latest };
} };
const root = createRoot(document.querySelector("main")!);
function render() {
  const api = { student: { id: student }, progress, updateProgress: async (fn: (p: Progress) => Progress) => {
    if (saveFail) throw Error("Disk unavailable");
    progress = fn(progress); render();
  } } as AppApi;
  root.render(createElement(VmLabPanel, { key: student, api, course: course.id, lesson: "network-mount", scenario: NFS_LAB }));
}
const { clickVmButton: click } = await import("./vm-ui-interactions.mts");
useStudentFiles(student);
await act(async () => render());
assert.deepEqual(actions, ["status"]);
await click("Start lab");
await click("Client console");
await click("Check my work");
assert(!actions.includes("check"));
confirm = true;
saveFail = true;
await click("Check my work");
assert.match(document.querySelector('[role="alert"]')!.textContent!, /Disk unavailable/);
saveFail = false;
await click("Save latest check to course progress");
const key = vmReportKey(course.id, "network-mount", NFS_LAB);
assert.deepEqual(progress.vmLabReports?.[key], report);
assert.match(document.body.textContent!, /3 of 4 checks passed/);
await click("Reset disks");
assert.equal(actions.filter(a => a === "reset").length, 1);
assert.deepEqual(progress.vmLabReports?.[key], report);
await click("Start lab");
delay = true;
await click("Check my work", () => !!resolved);
await act(async () => { student = "learnerb"; useStudentFiles(student); progress = emptyProgress(); render(); });
await act(async () => { resolved!(); });
assert.equal(progress.vmLabReports, undefined);
const { parseAnonymousProgress, inventoryAnonymousData } = await import("../src/lib/anonymousPrivacy.ts");
const restored = parseAnonymousProgress({ ...emptyProgress(), vmLabReports: { [key]: report } });
assert.deepEqual(restored.vmLabReports?.[key], report);
assert.equal(inventoryAnonymousData(restored, null, {}).vmLabChecks, 1);
assert.throws(() => parseAnonymousProgress({ ...restored, vmLabReports: { [key]: { ...report, password: "unexpected" } } }));
const { latestVmReports } = await import("../src/lib/vmLab.ts");
assert.equal(latestVmReports({[key]: report}, {[key]: {...report, checkedAt: 1}})[key].checkedAt, report.checkedAt);
await act(async () => root.unmount());
console.log("VM lesson import, roundtrip, revision, scoring, controls, consent, save retry and learner isolation passed");
