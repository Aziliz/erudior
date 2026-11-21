export const NFS_LAB = "linux-nfs-autofs-v1";
export const NFS_EXAM = "linux-nfs-autofs-exam-v1";
export const ADMIN_EXAM = "linux-admin-exam-v1";
export const RHCSA_MOCK = "rhcsa-rhel10-practice-v1";
export const MOCK_MINUTES = 180;
export const MOCK_PASS_POINTS = 210;
export const DEFAULT_VM_EXAM_MINUTES = 20;
export type VmExamScenario = typeof NFS_EXAM | typeof ADMIN_EXAM | typeof RHCSA_MOCK;
export type VmLabScenario = typeof NFS_LAB | VmExamScenario;

export const VM_TASKS = {
  "client-operator": {area: "Users and groups", role: "Client", title: "Operator account", instruction: "Create the labtech user and make it a member of the labops group. Create labops on the client if it does not exist."},
  "server-team-directory": {area: "Essential tools", role: "Server", title: "Shared team directory", instruction: "Create /srv/team with group labops and permissions 2770 (setgid)."},
  "client-nfs": {area: "File systems", role: "Client", title: "On-demand NFS mount", instruction: "Use autofs to mount 192.168.77.10:/srv/projects at /mnt/projects on demand and read erudior-lab.txt there."},
  "client-repo": {area: "Software management", role: "Client", title: "Offline RPM repository", instruction: "Enable a DNF repository with the repository ID erudior-local at file:///srv/erudior-repo with package signature checking enabled. The directory holds the lab repository metadata."},
  "client-script": {area: "Shell scripts", role: "Client", title: "Classify a script argument", instruction: "Create an executable shell script with a shell shebang at /usr/local/bin/lab-classify. For one nonnegative integer argument print small for values below 10 and large otherwise. Allow an unprivileged user to run it."},
  "server-tuning": {area: "Running systems", role: "Server", title: "System tuning", instruction: "Activate the throughput-performance TuneD profile and keep it active after boot."},
  "server-swap": {area: "Local storage", role: "Server", title: "Persistent swap", instruction: "Add and activate a swap file of at least 64 MiB at /var/lib/erudior.swap. Make it activate automatically after boot."},
  "server-service": {area: "Deployment and maintenance", role: "Server", title: "Service at startup", instruction: "Start the supplied erudior-maint.service and enable it at boot."},
  "client-resolution": {area: "Basic networking", role: "Client", title: "Persistent name resolution", instruction: "Configure files.lab.test to resolve to the server at 192.168.77.10 for IPv4 applications."},
  "server-selinux": {area: "Security", role: "Server", title: "SELinux web content", instruction: "Create /var/www/html/erudior-status.txt as a regular file with the httpd_sys_content_t SELinux type. Keep SELinux enforcing."},
} as const;
export type VmTaskId = keyof typeof VM_TASKS;
export interface VmTask { id: VmTaskId; points: number }
export const MOCK_TASKS: VmTask[] = (Object.keys(VM_TASKS) as VmTaskId[]).map(id => ({id, points: 30}));
export interface VmTaskResult extends VmTask { before: boolean; after?: boolean }
export interface VmExamReceipt { startedAt: number; deadlineAt: number; submittedAt: number; reason: "submitted" | "expired" }
export type VmLabChecks = { automount: boolean; remoteFile: boolean };
interface CommonReport {attempt: string; checkedAt: number; exam?: VmExamReceipt}
interface NfsReport extends CommonReport {before: VmLabChecks; after: VmLabChecks}
export interface VmTaskReport extends CommonReport {gradingVersion?: 2; tasks: VmTaskResult[]; exam: VmExamReceipt}
export type VmLabReport = NfsReport | VmTaskReport;

export function isVmExam(value: unknown): value is VmExamScenario {
  return value === NFS_EXAM || value === ADMIN_EXAM || value === RHCSA_MOCK;
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
  return rows(value, t => weight(t) && Object.keys(t).length === 2);
}
function validResults(value: unknown, persistent: boolean) {
  return rows(value, t => {
    if (!weight(t) || !("before" in t) || typeof t.before !== "boolean") return false;
    if (!persistent && !["client-operator", "server-team-directory", "client-nfs"].includes(t.id)) return false;
    return !persistent && VM_TASKS[t.id].role === "Server" ? Object.keys(t).length === 3 :
      Object.keys(t).length === 4 && "after" in t && typeof t.after === "boolean";
  });
}
export function vmReportKey(course: string, lesson: string, scenario: VmLabScenario) {
  return [course, lesson, scenario].join("/");
}
function validReceipt(e: VmExamReceipt, checked: number) {
  return !!e && typeof e === "object" && Object.keys(e).length === 4 &&
    [e.startedAt, e.submittedAt, e.deadlineAt].every(Number.isSafeInteger) && e.startedAt > 0 &&
    validExamMinutes((e.deadlineAt - e.startedAt) / 60000) &&
    e.submittedAt >= e.startedAt && e.submittedAt <= e.deadlineAt && e.submittedAt <= checked &&
    ["submitted", "expired"].includes(e.reason) && ((e.reason === "expired") === (e.submittedAt === e.deadlineAt));
}
export function validVmReport(value: unknown, scenario?: VmLabScenario): value is VmLabReport {
  if (!value || typeof value !== "object") return false;
  const r = value as VmLabReport;
  if (typeof r.attempt !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(r.attempt) ||
      !Number.isSafeInteger(r.checkedAt) || r.checkedAt <= 0 || r.checkedAt > 8640000000000000) return false;
  if (r.exam !== undefined && !validReceipt(r.exam, r.checkedAt)) return false;
  if (scenario && (isVmExam(scenario) !== !!r.exam || ([ADMIN_EXAM, RHCSA_MOCK] as VmLabScenario[]).includes(scenario) !== ("tasks" in r))) return false;
  if ("tasks" in r) {
    const persistent = r.gradingVersion === 2;
    if ((!persistent && "gradingVersion" in r) || !r.exam || Object.keys(r).length !== (persistent ? 5 : 4) || !validResults(r.tasks, persistent)) return false;
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
