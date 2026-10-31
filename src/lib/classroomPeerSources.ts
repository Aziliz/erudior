import type { Family } from './family';
import type { StoredSubmissionRecord } from './classroomSubmissionStore';
import type { WorkflowSource } from './classroomWorkflows';

/** Teacher-only selection metadata; learners receive only the explicitly published snapshot. */
export interface ClassroomPeerSourceOption extends WorkflowSource {
  key: string; label: string; classId: string; courseId: string;
}
/** Select complete immutable writing/lab evidence, never notebook, grades, attachments or whole progress.
 * Source version binds the signed receipt and exact work key. Oversized work is omitted rather than truncated.
 */
export function classroomPeerSourceOptions(family: Family, classId: string, receipts: StoredSubmissionRecord[]): ClassroomPeerSourceOption[] {
  const cls = family.mode === 'classroom' ? family.classes?.find(c => c.id === classId) : undefined;
  if (!cls) throw Error('Open a current local classroom.');
  const out: ClassroomPeerSourceOption[] = [];
  for (const receipt of receipts) {
    if (!receipt.importComplete || receipt.classId !== classId || !cls.students.includes(receipt.studentId) || !family.students.some(s => s.id === receipt.studentId)) continue;
    for (const [workKey, work] of Object.entries(receipt.snapshot.progress.work ?? {})) {
      const courseId = cls.assignments.find(a => workKey.startsWith(a.courseId + '/'))?.courseId;
      if (!courseId || !receipt.courses.includes(courseId) || !work.submitted) continue;
      const text = work.text?.trim();
      if (!text || text.length > 20000) continue;
      const version = `${receipt.snapshot.mac}:${workKey}`;
      if (version.length > 200) continue;
      out.push({key: `${receipt.id}:${workKey}`,label: `${receipt.studentName} · ${workKey} · ${receipt.submittedAt}`,classId,courseId,studentId:receipt.studentId,receiptId:receipt.id,version,text});
    }
  }
  return out;
}
export function resolveClassroomPeerSource(options: ClassroomPeerSourceOption[], key: string): ClassroomPeerSourceOption {
  const match = options.find(o => o.key === key);
  if (!match) throw Error('This exact submitted work is no longer available in the current class. Select a current complete hand-in.');
  return match;
}
