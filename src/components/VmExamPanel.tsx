import VmProvider from "./VmProvider";
import VmConsole, { type GuestRole } from "./VmConsole";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { AppApi } from "../App";
import { activeStudent, confirmAction, inApp } from "../lib/storage";
import { ADMIN_EXAM, RHCSA_MOCK, VM_TASKS, latestVmReports, validVmReport, vmReportKey, type VmExamScenario, type VmLabReport, type VmTask } from "../lib/vmLab";
import { VmResult, VmSetup } from "./VmLabParts";

type Phase = "new" | "prepared" | "active" | "submitted" | "complete" | "error" | "interrupted";
type Action = "status" | "start" | "begin" | "submit" | "stop" | "retry" | "reset" | "console-client" | "console-server";
interface State {
  exam: {phase: Phase; id: string | null; remainingMs?: number; rubric?: VmTask[]; gradingVersion?: 2; platforms?: {client: string; server: string}; error?: string};
  running: {client: boolean; server: boolean};
  password: string | null;
  report: VmLabReport | null;
}
const messages: Record<Phase,string> = {
  new: "Prepare both machines to take the exam.", prepared: "Begin when both machines are ready. The clock starts when you begin.",
  active: "Exam in progress", submitted: "Submitted. Grading is in progress.", complete: "Grading complete.",
  error: "Grading was interrupted. Your submission is locked and can be retried.", interrupted: "The host restarted during this attempt.",
};

interface PanelProps {
  api: AppApi; course: string; lesson: string; scenario: VmExamScenario; minutes: number; tasks?: VmTask[];
}

export default function VmExamPanel(props: PanelProps) {
  return <section className="panel stack" aria-label="Timed practical exam">
    <VmProvider>{provider => <Panel {...props} provider={provider} />}</VmProvider>
  </section>;
}

function Panel({ api, course, lesson, scenario, minutes, tasks, provider }: PanelProps & { provider: string }) {
  const student = api.student?.id ?? null;
  const profile = student ? "student-" + student : "solo-" + (api.progress.anonymousGeneration ?? 0);
  const key = vmReportKey(course, lesson, scenario);
  const saved = api.progress.vmLabReports?.[key];
  const [state, setState] = useState<State | null>(null);
  const supported = !!provider;
  const [terminal, setTerminal] = useState<{role:GuestRole; sequence:number} | null>(null);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const busy = pendingAction !== null;
  const [error, setError] = useState("");
  const mounted = useRef(false);
  const locked = useRef(false);
  const epoch = useRef(0);
  const autoSaved = useRef("");
  const latestApi = useRef(api);
  latestApi.current = api;
  const phase = state?.exam.phase ?? "new";
  const rubric = state?.exam.rubric ?? tasks ?? [];
  const weighted = scenario === ADMIN_EXAM || scenario === RHCSA_MOCK;
  const legacy = weighted && !!state?.exam.rubric && state.exam.gradingVersion !== 2;
  const rebootRoles = weighted ? [...new Set(rubric.map(t => VM_TASKS[t.id].role.toLowerCase()))].filter(r => !legacy || r === "client") : ["client"];
  const result = state?.report;
  const recover = validVmReport(result, scenario) && (!validVmReport(saved, scenario) || result.checkedAt > saved.checkedAt);

  function current() { return mounted.current && activeStudent() === student; }
  function request(action: Action, expected?: string | null) {
    return invoke<State>("vm_lab", {action, scenario, profile, course, lesson, minutes, tasks, expected: expected ?? null});
  }
  async function record(report: VmLabReport) {
    if (!current() || !validVmReport(report, scenario)) return;
    await latestApi.current.updateProgress(p => ({...p, vmLabReports: latestVmReports(p.vmLabReports, {[key]: report})}));
  }

  useEffect(() => {
    mounted.current = true;
    let disposed = false;
    async function initialize() {
      try {
        if (!provider) return;
        const version = epoch.current;
        const data = await request("status");
        if (!disposed && current() && version === epoch.current) setState(data);
      } catch (cause) { if (!disposed) setError(String(cause)); }
    }
    if (inApp) void initialize();
    return () => { disposed = true; mounted.current = false; };
  }, [profile, course, lesson, scenario, minutes, tasks]);

  useEffect(() => {
    if (!supported || (phase !== "active" && phase !== "submitted")) return;
    let disposed = false;
    let pending = false;
    const interval = window.setInterval(async () => {
      if (!current() || pending || locked.current) return;
      pending = true;
      const version = epoch.current;
      try {
        const data = await request("status");
        if (!disposed && current() && version === epoch.current) { setState(data); setError(""); }
      } catch (cause) {
        if (!disposed && current() && version === epoch.current) setError(String(cause));
      } finally { pending = false; }
    }, 1000);
    return () => { disposed = true; window.clearInterval(interval); };
  }, [supported, phase, profile, course, lesson, scenario, minutes, tasks]);

  useEffect(() => {
    if (!recover || !result || autoSaved.current === result.attempt) return;
    autoSaved.current = result.attempt;
    void record(result).catch(cause => { if (current()) setError(String(cause)); });
  }, [result, recover]);

  async function act(action: Action) {
    if (!current() || locked.current) return;
    if (action === "console-client" || action === "console-server") {
      const role = action === "console-client" ? "client" : "server";
      setTerminal(previous => ({role,sequence:(previous?.sequence ?? 0)+1}));
      return;
    }
    locked.current = true;
    epoch.current++;
    setPendingAction(action);
    setError("");
    try {
      if (action === "submit" && !await confirmAction(rebootRoles.length
        ? `Submit now? Grading will close your consoles and reboot the ${rebootRoles.join(" and ")}.`
        : "Submit now and close your consoles?")) return;
      if (action === "reset" && !await confirmAction("Discard these exam disks? Saved course results are retained.")) return;
      if (!current()) return;
      const data = await request(action, state?.exam.id);
      if (current()) setState(data);
    } catch (cause) {
      if (current()) {
        setError(String(cause));
        try { const data = await request("status"); if (current()) setState(data); } catch { /* Keep the action error. */ }
      }
    } finally { locked.current = false; if (current()) setPendingAction(null); }
  }

  const seconds = Math.ceil((state?.exam.remainingMs ?? 0) / 1000);
  const machines = state?.running;
  return <>
    <h2>{scenario === RHCSA_MOCK ? "RHCSA practice exam · RHEL 10" : "Timed Linux practical"}</h2>
    {weighted ? <>
      <ol>{rubric.map(t => <li key={t.id}><strong>{VM_TASKS[t.id].role} · {VM_TASKS[t.id].title}</strong>
        {scenario !== RHCSA_MOCK && ` · ${t.points} ${t.points === 1 ? "point" : "points"}`}<p>{VM_TASKS[t.id].instruction}</p></li>)}</ol>
      <p>{legacy ? "This earlier attempt checks server tasks at submission only." : "Each task must work at submission and after its machine reboots to earn its points."}</p>
      {scenario === RHCSA_MOCK && <p>Erudior practice settings are 180 minutes, 300 points and a 210-point passing target. Each of the ten objective areas is worth 30 points.</p>}
    </> : <p>{VM_TASKS["client-nfs"].instruction} The mount must also work after reboot.</p>}
    {supported ? <>
      <VmSetup provider={provider} course={course} preparing={pendingAction === "start"} />
      {state?.exam.platforms && <p>Client · {state.exam.platforms.client}<br />Server · {state.exam.platforms.server}</p>}
      <p role="status">{messages[phase]}</p>
      {phase === "active" && <strong role="timer">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2,"0")} remaining</strong>}
      <div className="row" aria-busy={busy}>
        {(phase === "new" || (phase === "prepared" && !(machines?.client && machines.server))) &&
          <button className="btn primary" disabled={busy || !state} onClick={() => act("start")}>Prepare machines</button>}
        {phase === "prepared" && <button className="btn primary" disabled={busy || !(machines?.client && machines.server)}
          onClick={() => act("begin")}>Begin {minutes}-minute exam</button>}
        {phase === "active" && <>
          <button className="btn" disabled={busy || !seconds} onClick={() => act("console-client")}>Client console</button>
          <button className="btn" disabled={busy || !seconds} onClick={() => act("console-server")}>Server console</button>
          <button className="btn primary" disabled={busy} onClick={() => act("submit")}>Submit exam</button>
        </>}
        {phase === "error" && <button className="btn" disabled={busy} onClick={() => act("retry")}>Retry grading</button>}
        {(phase === "complete" || phase === "prepared") && (machines?.client || machines?.server) &&
          <button className="btn" disabled={busy} onClick={() => act("stop")}>Stop machines</button>}
        {["prepared","complete","error","interrupted"].includes(phase) &&
          <button className="btn" disabled={busy || recover} onClick={() => act("reset")}>Reset exam disks</button>}
        <button className="btn" disabled={busy} onClick={() => act("status")}>Refresh status</button>
      </div>
      {phase === "active" && state?.password && <details><summary>Console login</summary><p>User <code>learner</code> · Password <code>{state.password}</code></p></details>}
      {terminal && phase==="active" && state?.exam.id && <VmConsole key={terminal.sequence} role={terminal.role} profile={profile} course={course} lesson={lesson} scenario={scenario} expected={state.exam.id} close={()=>setTerminal(null)} />}
      {state?.exam.error && <p role="alert">{state.exam.error}</p>}
      {recover && result && <button className="btn" onClick={() => void record(result).then(() => { if (current()) setError(""); }).catch(cause => { if (current()) setError(String(cause)); })}>Save exam result</button>}
    </> : <p className="muted">Open this lesson in the Windows, macOS or Linux desktop app to take the {minutes}-minute practical.</p>}
    {error && <p role="alert">{error}</p>}
    {validVmReport(saved, scenario) && phase !== "active" && phase !== "submitted" && <VmResult saved={saved} scenario={scenario} />}
  </>;
}
