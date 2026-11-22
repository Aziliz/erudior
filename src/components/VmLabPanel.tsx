import VmProvider from "./VmProvider";
import VmConsole, { type GuestRole } from "./VmConsole";
import { VmSetup, VmResult } from "./VmLabParts";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { AppApi } from "../App";
import { activeStudent, confirmAction, inApp } from "../lib/storage";
import { latestVmReports, validVmReport, vmReportKey, type VmLabReport, type VmLabScenario } from "../lib/vmLab";

type Action = "status" | "start" | "stop" | "reset" | "check" | "console-client" | "console-server";
interface LabState {
  running: { client: boolean; server: boolean };
  password: string | null;
  resetPending?: boolean;
  attemptId?: string | null;
  report: VmLabReport | null;
}

interface PanelProps {
  api: AppApi; course: string; lesson: string; scenario: VmLabScenario;
}

export default function VmLabPanel(props: PanelProps) {
  return <section className="panel stack" aria-label="Virtual machine lab">
    <VmProvider>{provider => <Panel {...props} provider={provider} />}</VmProvider>
  </section>;
}

function Panel({ api, course, lesson, scenario, provider }: PanelProps & { provider: string }) {
  const rhce = course === "rhce-ansible-alma10";
  const coursePractice = lesson === "practice-environment";
  const student = api.student?.id ?? null;
  const profile = student === null ? "solo-" + (api.progress.anonymousGeneration ?? 0) : "student-" + student;
  const key = vmReportKey(course, lesson, scenario);
  const saved = api.progress.vmLabReports?.[key];
  const supported = !!provider;
  const [terminal, setTerminal] = useState<{role:GuestRole; sequence:number} | null>(null);
  const [lab, setLab] = useState<LabState | null>(null);
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const mounted = useRef(false);

  const request = (action: Action) => invoke<LabState>("vm_lab", { action, scenario, profile, course, lesson });

  useEffect(() => {
    mounted.current = true;
    let live = true;
    if (inApp) void (async () => {
      try {
        if (!provider) return;
        const state = await request("status");
        if (live) setLab(state);
      } catch (cause) {
        if (live) setError(String(cause));
      }
    })();
    return () => { live = false; mounted.current = false; };
    // The owning lesson keys this component on learner, course, lesson and scenario.
  }, [provider, profile, course, lesson, scenario]);

  function current() { return mounted.current && activeStudent() === student; }

  async function record(report: VmLabReport) {
    if (!current() || !validVmReport(report, scenario)) throw Error("The lab result could not be saved for this learner.");
    await api.updateProgress(p => ({ ...p, vmLabReports: latestVmReports(p.vmLabReports, { [key]: report }) }));
  }

  async function act(action: Action) {
    if (locked.current || !current()) return;
    if (action === "console-client" || action === "console-server") {
      const role = action === "console-client" ? "client" : "server";
      setTerminal(previous => ({role,sequence:(previous?.sequence ?? 0)+1}));
      return;
    }
    locked.current = true;
    setBusy(action);
    setError("");
    try {
      if (action === "reset" && !await confirmAction("Erase this lab’s two practice disks and start fresh next time?")) return;
      if (action === "check" && !await confirmAction("Check the current configuration and reboot the client to test it again?")) return;
      if (!current()) return;
      if (["check","stop","reset"].includes(action)) setTerminal(null);
      const next = await request(action);
      if (!current()) return;
      setLab(next);
      if (action === "check" && next.report) await record(next.report);
    } catch (cause) {
      if (current()) {
        setError(String(cause));
        try {
          const latest = await request("status");
          if (current()) setLab(latest);
        } catch { /* Keep the original actionable error. */ }
      }
    } finally {
      locked.current = false;
      if (current()) setBusy(null);
    }
  }

  const both = lab?.running.client && lab.running.server;
  const pending = lab?.report;
  const needsSave = validVmReport(pending, scenario) && (!validVmReport(saved, scenario) || pending.checkedAt > saved.checkedAt);
  return <>
    <h2>{coursePractice ? (rhce ? "RHCE practice machines" : "RHCSA practice machines") : "Two-machine Linux lab"}</h2>
    {rhce ? <p>The client is your Ansible control node. The managed server is <code>192.168.77.10</code>. On first boot, wait for <code>sudo cloud-init status --wait</code> on each guest. On the client, use <code>~/.ssh/erudior_rhce</code> for the learner account on the server.</p> : coursePractice ? <p>Use the client and server throughout the course. Each graded practical has its own disks. Reset this pair when you want a fresh practice environment.</p> : <p>The server at <code>192.168.77.10</code> exports <code>/srv/projects</code>. On the client, configure autofs to open the share at <code>/mnt/projects</code>. Your practice check tests the mount and reads a file from the server before and after a client reboot.</p>}
    {supported ? <>
      <VmSetup provider={provider} course={course} preparing={busy === "start"} />
      {lab?.resetPending && <p role="alert">Choose Reset disks again to finish the interrupted reset.</p>}
      {lab && <p role="status">Server {lab.running.server ? "running" : "off"} · Client {lab.running.client ? "running" : "off"}</p>}
      <div className="row" aria-busy={!!busy}>
        <button className="btn primary" disabled={!!busy || !!both || lab?.resetPending} onClick={() => act("start")}>Start lab</button>
        <button className="btn" disabled={!!busy || !lab?.running.client} onClick={() => act("console-client")}>Client console</button>
        <button className="btn" disabled={!!busy || !lab?.running.server} onClick={() => act("console-server")}>Server console</button>
        {!coursePractice && <button className="btn" disabled={!!busy || !both} onClick={() => act("check")}>Check my work</button>}
        <button className="btn" disabled={!!busy || !(lab?.running.client || lab?.running.server)} onClick={() => act("stop")}>Stop lab</button>
        <button className="btn" disabled={!!busy || (!lab?.password && !lab?.resetPending)} onClick={() => act("reset")}>Reset disks</button>
        <button className="btn" disabled={!!busy} onClick={() => act("status")}>Refresh status</button>
      </div>
      {terminal && lab?.attemptId && lab.running[terminal.role] && <VmConsole key={terminal.sequence} role={terminal.role} profile={profile} course={course} lesson={lesson} scenario={scenario} expected={lab.attemptId} close={()=>setTerminal(null)} />}
      {lab?.password && <details><summary>Console login</summary><p>User <code>learner</code> · Password <code>{lab.password}</code>. Press Enter in the console for the login prompt.</p></details>}
      {busy && <p role="status">{busy === "check" ? "Checking the client and waiting for its reboot…" : "Contacting the lab…"}</p>}
      {needsSave && <button className="btn" disabled={!!busy} onClick={() => void record(pending).catch(cause => setError(String(cause)))}>Save latest check to course progress</button>}
    </> : <p className="muted">Use the Windows, macOS or Linux desktop app to start the machines and check your work.</p>}
    {error && <p role="alert">{error}</p>}
    {validVmReport(saved, scenario) && <VmResult saved={saved} />}
  </>;
}
