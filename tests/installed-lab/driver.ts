// Replaces the webview entry only in a disposable acceptance installer.
import { Channel, invoke } from "@tauri-apps/api/core";
import { ADMIN_EXAM, latestVmReports, validVmReport, vmReportKey, vmScore, type VmLabReport } from "../../src/lib/vmLab";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const tasks = [{id: "client-operator", points: 50}, {id: "server-team-directory", points: 50}];
const scope = {scenario: ADMIN_EXAM, profile: "acceptance", course: "installed-test", lesson: "two-guests"} as const;
const key = vmReportKey(scope.course, scope.lesson, scope.scenario);
type Status = {password: string; running: Record<string, boolean>; report?: VmLabReport; exam: {phase: string; id: string; error?: string}};
const action = (action: string, expected?: string) => invoke<Status>("vm_lab", {...scope, action, tasks, minutes: 60, expected});
async function receipt(phase: string, detail?: unknown) {
  await invoke("save_item", {kind: "documents", id: "installed-lab", content: JSON.stringify({phase, detail})});
}
async function consoleTask(role: string, expected: string, password: string) {
  const id = crypto.randomUUID(), decoder = new TextDecoder();
  const channel = new Channel<{kind: string; bytes?: number[]; message?: string}>();
  let buffer = "", closed = "";
  channel.onmessage = e => {
    if (e.kind === "output") buffer = (buffer + decoder.decode(new Uint8Array(e.bytes!), {stream: true})).slice(-16384);
    else closed = e.message || "Console disconnected.";
  };
  const send = (line: string) => invoke("vm_console_write", {id, bytes: Array.from(new TextEncoder().encode(line + "\n"))});
  async function until(marker: RegExp) {
    const deadline = Date.now() + 120000;
    while (!marker.test(buffer)) {
      if (closed || Date.now() > deadline) throw Error(closed || role + " timed out waiting for " + marker.source);
      await sleep(200);
    }
    buffer = "";
  }
  await invoke("vm_console_open", {...scope, id, role, expected, channel});
  try {
    await send(""); await until(/login: /i);
    await send("learner"); await until(/password:/i);
    await send(password); await until(/\$ /);
    const task = role === "client" ? "sudo groupadd labops && sudo useradd -G labops labtech" :
      "sudo groupadd labops && sudo install -d -g labops -m 2770 /srv/team";
    await send(task + " && printf '\\nERUDIOR_%s_READY\\n' " + role);
    await until(new RegExp("ERUDIOR_" + role + "_READY"));
  } finally { await invoke("vm_console_close", {id}); }
}
async function exercise() {
  const previous = await invoke<string | null>("load_progress");
  if (previous) {
    const saved = JSON.parse(previous).vmLabReports?.[key], state = await action("status");
    if (!validVmReport(saved, ADMIN_EXAM) || vmScore(saved) !== 100 || JSON.stringify(saved) !== JSON.stringify(state.report))
      throw Error("A fresh desktop process did not recover the same graded attempt.");
    await receipt("verified", saved);
    return;
  }
  await receipt("starting");
  if (/Windows/i.test(navigator.userAgent)) {
    const setup = await invoke<{state: string}>("vm_windows_host", {target: "Erudior-Labs"});
    if (setup.state !== "ready") throw Error("WSL 2 setup returned " + setup.state);
  }
  let state = await action("start");
  if (!state.running.client || !state.running.server) throw Error("Both guests must be running.");
  const expected = state.exam.id, deadline = Date.now() + 18 * 60000;
  for (;;) {
    try {state = await action("begin", expected); break;} catch (error) {
      if (Date.now() > deadline) throw error;
      await sleep(5000);
    }
  }
  if (state.exam.phase !== "active") throw Error("The timer did not start.");
  for (const role of ["server", "client"]) {await receipt("console-" + role); await consoleTask(role, expected, state.password);}
  await action("submit", expected);
  const stopAt = Date.now() + 20 * 60000;
  do {
    await sleep(2000); state = await action("status");
    if (state.exam.phase === "error" || Date.now() > stopAt) throw Error(state.exam.error || "Grading timed out.");
  } while (state.exam.phase !== "complete");
  if (!validVmReport(state.report, ADMIN_EXAM) || vmScore(state.report) !== 100) throw Error("Expected both tasks to pass after guest reboots.");
  await invoke("save_progress", {content: JSON.stringify({vmLabReports: latestVmReports({}, {[key]: state.report})})});
  await receipt("restart", state.report);
}
void exercise().catch(e => receipt("failed", String(e)));
