export const ALMA_PRACTICE = "alma10-course-practice-v1";
export const NFS_LAB = "linux-nfs-autofs-v1";
export const NFS_EXAM = "linux-nfs-autofs-exam-v1";
export const ADMIN_EXAM = "linux-admin-exam-v1";
export const RHCSA_MOCK = "rhcsa-rhel10-practice-v1";
/** Randomized form: one task per area and values drawn per attempt. */
export const RHCSA_MOCK2 = "rhcsa-rhel10-practice-v2";
export const RHCE_EXAM = "rhce-ansible-idempotence-v1";
export const ANSIBLE_TASK = "server-ansible-state";
export const MOCK_MINUTES = 180;
export const MOCK_PASS_POINTS = 210;
export const DEFAULT_VM_EXAM_MINUTES = 20;
export type VmExamScenario = typeof NFS_EXAM | typeof ADMIN_EXAM | typeof RHCSA_MOCK | typeof RHCSA_MOCK2 | typeof RHCE_EXAM;
export type VmLabScenario = typeof NFS_LAB | VmExamScenario;
export type VmConsoleScenario = VmLabScenario | typeof ALMA_PRACTICE;

export function coursePracticeScenario(course: {id: string; practiceEnvironment?: string}) {
  if (course.practiceEnvironment === "none") return undefined;
  // These older course packages already have persistent disks in the original scenario.
  if (course.id === "rhcsa-rhel10-administration" || course.id === "rhce-ansible-alma10") return NFS_LAB;
  if (course.practiceEnvironment === "almalinux-10.3") return ALMA_PRACTICE;
  return undefined;
}

// {name} placeholders are filled with the attempt's values (DEFAULT_PARAMS for fixed lessons).
export const VM_TASKS = {
  [ANSIBLE_TASK]: {area: "Ansible automation", role: "Server", title: "Converge the managed node", instruction: "On the client (control node), save /home/learner/site.yml. Target the managed group in /etc/erudior-lab/inventory.ini. Make /etc/erudior-proof.conf on dispatch a root:root regular file with mode 0640 containing managed=true followed by one newline. The grader removes that file, runs your playbook twice, then reboots the managed node. The first run must create it, the second must report zero changes, and the file must survive reboot."},
  "client-operator": {area: "Users and groups", role: "Client", title: "Operator account", instruction: "Create the {opUser} user and make it a member of the {opGroup} group. Create {opGroup} on the client if it does not exist."},
  "server-team-directory": {area: "Essential tools", role: "Server", title: "Shared team directory", instruction: "Create {teamDir} with group {teamGroup} and permissions 2770 (setgid). Create the group if it does not exist."},
  "client-nfs": {area: "File systems", role: "Client", title: "On-demand NFS mount", instruction: "Use autofs to mount 192.168.77.10:/srv/projects at /mnt/projects on demand and read erudior-lab.txt there."},
  "client-repo": {area: "Software management", role: "Client", title: "Offline RPM repository", instruction: "Enable a DNF repository with the repository ID {repoId} at file:///srv/erudior-repo with package signature checking enabled. The directory holds the lab repository metadata."},
  "client-script": {area: "Shell scripts", role: "Client", title: "Classify a script argument", instruction: "Create an executable shell script with a shell shebang at {scriptPath}. For one nonnegative integer argument print small for values below {threshold} and large otherwise. Allow an unprivileged user to run it."},
  "server-tuning": {area: "Running systems", role: "Server", title: "System tuning", instruction: "Activate the {tunedProfile} TuneD profile and keep it active after boot."},
  "server-swap": {area: "Local storage", role: "Server", title: "Persistent swap file", instruction: "Add and activate a swap file of at least {swapMiB} MiB at {swapFile}. Make it activate automatically after boot."},
  "server-service": {area: "Deployment and maintenance", role: "Server", title: "Service at startup", instruction: "Start the supplied erudior-maint.service and enable it at boot."},
  "client-resolution": {area: "Basic networking", role: "Client", title: "Persistent name resolution", instruction: "Configure {hostAlias} to resolve to the server at 192.168.77.10 for IPv4 applications."},
  "server-selinux": {area: "Security", role: "Server", title: "SELinux web content", instruction: "Create {webFile} as a regular file with the httpd_sys_content_t SELinux type. Keep SELinux enforcing."},
  "server-lvm": {area: "Local storage", role: "Server", title: "Logical volume on a new disk", instruction: "On the server disk with serial erudior-data, create volume group {vgName} with a {lvMiB} MiB logical volume {lvName}. Format it with XFS and mount it at {lvMount} persistently. Leave the system disk unchanged."},
  "server-swap-part": {area: "Local storage", role: "Server", title: "Swap on a new device", instruction: "Add at least {swapDevMiB} MiB of swap on the server disk with serial erudior-data, as a partition or a logical volume, and activate it automatically after boot. Keep existing swap."},
  "server-web-port": {area: "Security", role: "Server", title: "Web service on a custom port", instruction: "Make httpd serve /var/www/html on TCP port {webPort}, start it now and at boot, and allow that port through firewalld permanently. Keep SELinux enforcing."},
  "client-ssh-key": {area: "Security", role: "Client", title: "Key-based SSH login", instruction: "Create the user {sshUser} on the server. Let learner on the client log in to the server as {sshUser} with an SSH key and no password prompt."},
  "client-cron": {area: "Deployment and maintenance", role: "Client", title: "Scheduled job", instruction: "In learner's crontab on the client, run logger {cronTag} every day at {cronHour}:{cronMinute} (hour and minute, 24-hour clock)."},
  "client-network": {area: "Basic networking", role: "Client", title: "Static address and hostname", instruction: "Configure the client's second interface (MAC 52:54:00:aa:01:20) persistently with IPv4 address {spareAddress}/24, gateway {spareGateway} and DNS server {spareDns}. Set the client's hostname to {clientHostname}."},
} as const;
/** Values the fixed lessons use; must match DEFAULT_PARAMS in src-tauri/src/vm_lab/runner.py. */
export const DEFAULT_PARAMS: Readonly<Record<string, string>> = {
  teamDir: "/srv/team", teamGroup: "labops", opUser: "labtech", opGroup: "labops",
  repoId: "erudior-local", scriptPath: "/usr/local/bin/lab-classify", threshold: "10",
  tunedProfile: "throughput-performance", swapFile: "/var/lib/erudior.swap", swapMiB: "64",
  hostAlias: "files.lab.test", webFile: "/var/www/html/erudior-status.txt",
  vgName: "labvg", lvName: "labdata", lvMiB: "400", lvMount: "/srv/labdata", swapDevMiB: "256",
  webPort: "18080", sshUser: "labssh", cronMinute: "15", cronHour: "2", cronTag: "erudior-nightly",
  spareAddress: "10.88.10.20", spareGateway: "10.88.10.1", spareDns: "10.88.10.53",
  clientHostname: "client01.lab.test",
};
/** One pool per objective area, in report order; must match AREA_POOLS in runner.py. */
export const AREA_POOLS: readonly (readonly string[])[] = [
  ["server-team-directory"], ["client-repo"], ["client-script"], ["server-tuning"],
  ["server-lvm", "server-swap-part", "server-swap"], ["client-nfs"], ["server-service", "client-cron"],
  ["client-network", "client-resolution"], ["client-operator"], ["server-web-port", "client-ssh-key", "server-selinux"],
];
export function taskInstruction(id: VmTaskId, params?: Record<string, string>) {
  const values = {...DEFAULT_PARAMS, ...params};
  return VM_TASKS[id].instruction.replace(/\{(\w+)\}/g, (all, key: string) =>
    key === "cronMinute" ? (values[key] ?? "").padStart(2, "0") : values[key] ?? all);
}
export type VmTaskId = keyof typeof VM_TASKS;
export interface VmTask { id: VmTaskId; points: number }
// The fixed first form: its original ten tasks in their original order.
export const MOCK_TASKS: VmTask[] = (["client-operator", "server-team-directory", "client-nfs", "client-repo", "client-script",
  "server-tuning", "server-swap", "server-service", "client-resolution", "server-selinux"] as VmTaskId[]).map(id => ({id, points: 30}));
export interface VmTaskResult extends VmTask { before: boolean; after?: boolean }
export interface VmExamReceipt { startedAt: number; deadlineAt: number; submittedAt: number; reason: "submitted" | "expired" }
export type VmLabChecks = { automount: boolean; remoteFile: boolean };
interface CommonReport {attempt: string; checkedAt: number; exam?: VmExamReceipt}
interface NfsReport extends CommonReport {before: VmLabChecks; after: VmLabChecks}
export interface VmTaskReport extends CommonReport {gradingVersion?: 2; tasks: VmTaskResult[]; exam: VmExamReceipt; params?: Record<string, string>}
export type VmLabReport = NfsReport | VmTaskReport;

export function isVmExam(value: unknown): value is VmExamScenario {
  return value === RHCE_EXAM || value === NFS_EXAM || value === ADMIN_EXAM || isRhcsaMock(value);
}
export function isRhcsaMock(value: unknown): value is typeof RHCSA_MOCK | typeof RHCSA_MOCK2 {
  return value === RHCSA_MOCK || value === RHCSA_MOCK2;
}
function validParams(value: unknown) {
  return !!value && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === Object.keys(DEFAULT_PARAMS).length &&
    Object.keys(DEFAULT_PARAMS).every(k => typeof (value as Record<string, unknown>)[k] === "string" &&
      ((value as Record<string, string>)[k]).length <= 64);
}
export function isVmLab(value: unknown): value is VmLabScenario {
  return value === NFS_LAB || isVmExam(value);
}
export function readVmLab(value: unknown): VmLabScenario {
  if (!isVmLab(value)) throw Error("Unknown VM lab scenario.");
  return value;
}
export function validExamMinutes(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 240;
}
function weight(row: unknown): row is VmTask {
  if (!row || typeof row !== "object") return false;
  const t = row as Partial<VmTask>;
  return typeof t.id === "string" && Object.prototype.hasOwnProperty.call(VM_TASKS, t.id) && typeof t.points === "number" &&
    Number.isInteger(t.points) && t.points >= 1 && t.points <= 100;
}
function rows(value: unknown, check: (r: unknown) => boolean) {
  return Array.isArray(value) && value.length > 0 && value.length <= Object.keys(VM_TASKS).length &&
    value.every(check) && new Set(value.map(t => t.id)).size === value.length;
}
export function validVmTasks(value: unknown): value is VmTask[] {
  return rows(value, t => weight(t) && t.id !== ANSIBLE_TASK && Object.keys(t).length === 2);
}
function validResults(value: unknown, persistent: boolean) {
  return rows(value, t => {
    if (!weight(t) || !("before" in t) || typeof t.before !== "boolean") return false;
    if (!persistent && !["client-operator", "server-team-directory", "client-nfs"].includes(t.id)) return false;
    return !persistent && VM_TASKS[t.id].role === "Server" ? Object.keys(t).length === 3 :
      Object.keys(t).length === 4 && "after" in t && typeof t.after === "boolean";
  });
}
export function vmReportKey(course: string, lesson: string, scenario: VmConsoleScenario) {
  return [course, lesson, scenario].join("/");
}
function validReceipt(e: VmExamReceipt, checked: number) {
  return !!e && typeof e === "object" && Object.keys(e).length === 4 &&
    [e.startedAt, e.submittedAt, e.deadlineAt].every(Number.isSafeInteger) && e.startedAt > 0 &&
    validExamMinutes((e.deadlineAt - e.startedAt) / 60000) &&
    e.submittedAt >= e.startedAt && e.submittedAt <= e.deadlineAt && e.submittedAt <= checked &&
    ["submitted", "expired"].includes(e.reason) && ((e.reason === "expired") === (e.submittedAt === e.deadlineAt));
}
export function validVmReport(value: unknown, scenario?: VmConsoleScenario): value is VmLabReport {
  if (scenario === ALMA_PRACTICE) return false;
  if (!value || typeof value !== "object") return false;
  const r = value as VmLabReport;
  if (typeof r.attempt !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(r.attempt) ||
      !Number.isSafeInteger(r.checkedAt) || r.checkedAt <= 0 || r.checkedAt > 8640000000000000) return false;
  if (r.exam !== undefined && !validReceipt(r.exam, r.checkedAt)) return false;
  if (scenario && (isVmExam(scenario) !== !!r.exam || ([ADMIN_EXAM, RHCSA_MOCK, RHCSA_MOCK2, RHCE_EXAM] as VmLabScenario[]).includes(scenario) !== ("tasks" in r))) return false;
  if ("tasks" in r) {
    const persistent = r.gradingVersion === 2;
    const drawn = "params" in r;
    if (drawn && (!persistent || !validParams(r.params))) return false;
    if ((!persistent && "gradingVersion" in r) || !r.exam || Object.keys(r).length !== (persistent ? 5 : 4) + Number(drawn) || !validResults(r.tasks, persistent)) return false;
    if (scenario === RHCE_EXAM || r.tasks.some(t => t.id === ANSIBLE_TASK)) return (!scenario || scenario === RHCE_EXAM) && persistent && !drawn && r.tasks.length === 1 && r.tasks[0].id === ANSIBLE_TASK && r.tasks[0].points === 100;
    if (scenario === RHCSA_MOCK2 || (!scenario && drawn)) return drawn && r.exam.deadlineAt - r.exam.startedAt === MOCK_MINUTES * 60000 &&
      r.tasks.length === AREA_POOLS.length && r.tasks.every((t, i) => AREA_POOLS[i].includes(t.id) && t.points === 30);
    if (drawn) return false;
    if (scenario === RHCSA_MOCK) return persistent && r.exam.deadlineAt - r.exam.startedAt === MOCK_MINUTES * 60000 &&
      r.tasks.length === MOCK_TASKS.length && MOCK_TASKS.every((t, i) => r.tasks[i].id === t.id && r.tasks[i].points === t.points);
    return true;
  }
  const valid = (c: VmLabChecks) => !!c && Object.keys(c).length === 2 && typeof c.automount === "boolean" && typeof c.remoteFile === "boolean";
  return Object.keys(r).length === (r.exam ? 5 : 4) && valid(r.before) && valid(r.after);
}
export function taskEarned(t: VmTaskResult) { return t.before && t.after !== false ? t.points : 0; }
export function vmScore(report: VmLabReport) {
  if ("tasks" in report) return report.tasks.reduce((sum, t) => sum + taskEarned(t), 0);
  return [report.before, report.after].reduce((sum, t) => sum + Number(t.automount) + Number(t.remoteFile), 0);
}
export function vmTotal(report: VmLabReport) {
  return "tasks" in report ? report.tasks.reduce((sum, t) => sum + t.points, 0) : 4;
}
export function validateVmReports(value: unknown): asserts value is Record<string, VmLabReport> {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length > 10000)
    throw Error("Invalid saved VM lab results.");
  for (const [key, report] of Object.entries(value)) {
    const parts = key.split("/");
    if (parts.length !== 3 || !isVmLab(parts[2]) || !parts.slice(0, 2).every(p => /^[A-Za-z0-9_-]{1,100}$/.test(p)) || !validVmReport(report, parts[2]))
      throw Error("Invalid saved VM lab result.");
  }
}
export function latestVmReports(current: Record<string, VmLabReport> = {}, incoming: Record<string, VmLabReport> = {}) {
  const result = { ...current };
  for (const [key, report] of Object.entries(incoming)) {
    if (!result[key] || report.checkedAt >= result[key].checkedAt) result[key] = report;
  }
  return result;
}

/** The already distributed AlmaLinux RHCE course has a convergence lesson without VM metadata. */
export function lessonVmScenario(courseId: string, lesson: {id: string; vmLab?: VmLabScenario}) {
  return lesson.vmLab ?? (courseId === "rhce-ansible-alma10" && lesson.id === "collector-converge" ? RHCE_EXAM : undefined);
}
