import { RHCSA_MOCK, MOCK_PASS_POINTS, type VmLabScenario, VM_TASKS, taskEarned, vmScore, vmTotal, type VmLabReport } from "../lib/vmLab";

export function VmSetup({provider, course}:{provider:string; course:string}) {
  const almaCourse = course === "rhcsa-rhel10-administration";
  const image = almaCourse ? "almalinux-10-rhcsa.qcow2" : "linux-nfs-autofs-v1.qcow2";
  return <details><summary>First-time setup</summary>
    {provider==="windows" ? <p>Install Debian 13 or later in WSL 2 using <code>wsl --install -d Debian</code>. Open Debian once to create your Linux user. Run the setup commands below in Debian.</p>
      : provider==="macos" ? <p>Install Lima and run <code>limactl start --name=erudior-labs --cpus=4 --memory=6 template:debian</code>. Run <code>limactl shell erudior-labs</code> for the setup commands below. On subsequent sessions start the existing instance with <code>limactl start erudior-labs</code>.</p>
      : <p>Use the Linux user account that runs Erudior. Install QEMU 9.2 or newer, qemu-img, Python 3 and genisoimage or xorriso.</p>}
    {["windows","macos"].includes(provider) && <p>Inside Debian install the tools with <code>sudo apt update</code> and <code>sudo apt install python3 qemu-system-x86 qemu-utils genisoimage</code>. Check <code>qemu-system-x86_64 --version</code> for 9.2 or newer.</p>}
    <p>Place the prepared x86-64 {almaCourse ? "AlmaLinux 10" : "Enterprise Linux 10"} qcow2 image inside that Linux environment at <code>~/.local/share/erudior-vm-labs/images/{image}</code> (or under XDG_DATA_HOME). Use a cloud-init image with serial login and the tools listed in the course. Keep the provider running through grading.</p>
  </details>;
}

export function VmResult({saved, scenario}: {saved: VmLabReport; scenario?: VmLabScenario}) {
  return <div><h3>{saved.exam ? "Practical exam result" : "Latest saved practice check"}</h3>
    <p>{vmScore(saved)} of {vmTotal(saved)} {"tasks" in saved ? "points" : "checks passed"} · {new Date(saved.checkedAt).toLocaleString()}</p>
    {saved.exam && <p>{saved.exam.reason === "expired" ? "Submitted at the time limit" : "Submitted by learner"}</p>}
    {scenario === RHCSA_MOCK && "tasks" in saved && <>
      <p><strong>Erudior practice result · {vmScore(saved) >= MOCK_PASS_POINTS ? "Pass" : "Below target"}</strong> · Target {MOCK_PASS_POINTS}/300</p>
      <table className="table"><thead><tr><th>Objective area</th><th>Score</th></tr></thead>
      <tbody>{saved.tasks.map(t => <tr key={t.id}><th scope="row">{VM_TASKS[t.id].area}</th><td>{taskEarned(t)}/{t.points}</td></tr>)}</tbody></table>
    </>}
    {"tasks" in saved ? <details open={scenario !== RHCSA_MOCK}><summary>Review task checks</summary><table className="table"><thead><tr><th>Task</th><th>At submission</th><th>After its VM reboot</th><th>Points</th></tr></thead>
      <tbody>{saved.tasks.map(t => <tr key={t.id}><th scope="row">{VM_TASKS[t.id].role} · {VM_TASKS[t.id].title}</th>
        <td>{t.before ? "Passed" : "Missed"}</td><td>{t.after === undefined ? "Unverified (earlier grading)" : t.after ? "Passed" : "Missed"}</td>
        <td>{taskEarned(t)}/{t.points}</td></tr>)}</tbody></table></details> :
    <table className="table"><thead><tr><th>Objective</th><th>Before reboot</th><th>After reboot</th></tr></thead>
        <tbody>{(["automount", "remoteFile"] as const).map(check => <tr key={check}>
          <th scope="row">{check === "automount" ? "Autofs manages the mount" : "The file is readable from the NFS share"}</th>
          <td>{saved.before[check] ? "Passed" : "Missed"}</td><td>{saved.after[check] ? "Passed" : "Missed"}</td>
        </tr>)}</tbody></table>}</div>;
}
