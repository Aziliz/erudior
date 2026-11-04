/** Private local parental suitability decisions, never publication approval or verified credit. */
import { loadFamily, type Assignment, type Family } from "./family";
import type { Course } from "./types";
import { exportCourseSnapshot, normalizeCourse } from "./course";
import { sha256Hex } from "./courseSign";
import { competencyProfileExists, loadStoredCourseSnapshot, updateState } from "./storage";
export interface ParentCourseReview { learnerId: string; communityId: string; version: number; contentDigest: string; reviewedAt: string }
const digestPattern = /^[a-f0-9]{64}$/;
const learnerPattern = /^[a-z0-9]{1,24}$/;
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, child]) => [key, canonical(child)]));
  return value;
}
/** Normalized portable content includes embedded media and provenance; save/reload is stable. */
export async function parentCourseDigest(course: Course): Promise<string> {
  const portable = JSON.parse(exportCourseSnapshot(normalizeCourse(JSON.parse(exportCourseSnapshot(course)))));
  return sha256Hex(new TextEncoder().encode(JSON.stringify(canonical(portable))));
}
export function makeParentCourseReview(learnerId: string, course: Course, contentDigest: string, now = new Date().toISOString()): ParentCourseReview {
  if (!learnerPattern.test(learnerId) || !course.community?.id || !Number.isSafeInteger(course.community.version) || course.community.version < 1 || !digestPattern.test(contentDigest) || !Number.isFinite(Date.parse(now))) throw Error("This community course review is incomplete. Preview the course again.");
  return { learnerId, communityId: course.community.id, version: course.community.version, contentDigest, reviewedAt: now };
}
/** A missing/pending digest fails closed. Bind digest to the actual current Course object. */
export function hasParentCourseReview(learnerId: string, course: Course, contentDigest: string | undefined, receipt: ParentCourseReview | undefined): boolean {
  return Boolean(course.community && receipt && learnerPattern.test(learnerId) && digestPattern.test(contentDigest ?? "") && receipt.learnerId === learnerId && receipt.communityId === course.community.id && receipt.version === course.community.version && receipt.contentDigest === contentDigest && typeof receipt.reviewedAt === "string" && Number.isFinite(Date.parse(receipt.reviewedAt)));
}
/** Encrypted/imported backups preserve history, not permission to review for a child. */
export function withoutParentCourseReviews(family: Family): Family {
  if (!family || !Array.isArray(family.students)) throw Error("Invalid family assignments in backup.");
  return { ...family, students: family.students.map(student => {
    if (!student || typeof student !== "object" || (student.assigned !== undefined && !Array.isArray(student.assigned))) throw Error("Invalid family assignments in backup.");
    // Legacy minimal families had no assigned field: no assignments means no review authority.
    const assigned = (student.assigned ?? []).map(assignment => {
      if (!assignment || typeof assignment !== "object" || typeof assignment.courseId !== "string" || typeof assignment.subject !== "string") throw Error("Invalid family assignments in backup.");
      const { communityReview: _untrusted, ...historical } = assignment;
      return historical;
    });
    return { ...student, assigned };
  }) };
}
export interface ParentAssignmentIO {
  update(change: (old: string | null) => string | Promise<string>): Promise<string>;
  exists(learnerId: string): Promise<boolean>;
}
const assignmentIO: ParentAssignmentIO = { update: change => updateState("family", change), exists: competencyProfileExists };
/** CAS captured family. Mandatory guard rechecks unlocked credentials, learner and preview content.
 * This never writes progress; assignment/revocation cannot erase or enroll learner work.
 */
export async function saveParentCourseAssignment(expected: Family, learnerId: string, courseId: string, assignment: Assignment | null, guard: () => void | Promise<void>, io: ParentAssignmentIO = assignmentIO): Promise<Family> {
  if (typeof guard !== "function" || !learnerPattern.test(learnerId) || !courseId || courseId.length > 200 || expected.mode === "classroom") throw Error("A local parent review and learner are required.");
  if (assignment && (assignment.courseId !== courseId || !assignment.subject.trim() || assignment.subject.length > 100)) throw Error("Choose a course and subject.");
  if (assignment?.communityReview && (assignment.communityReview.learnerId !== learnerId || !digestPattern.test(assignment.communityReview.contentDigest) || !Number.isSafeInteger(assignment.communityReview.version) || assignment.communityReview.version < 1 || !assignment.communityReview.communityId || !Number.isFinite(Date.parse(assignment.communityReview.reviewedAt)))) throw Error("This review does not belong to this learner or course version.");
  assignment = assignment ? structuredClone(assignment) : null;
  const snapshot = JSON.stringify(expected);
  const assertScope = async () => { await guard(); if (!await io.exists(learnerId)) throw Error("This learner was deleted or is no longer available."); await guard(); };
  await assertScope();
  const text = await io.update(async old => {
    await assertScope();
    if (!old) throw Error("Family settings changed. Reopen the parent area.");
    const current = JSON.parse(old) as Family;
    if (JSON.stringify({ ...current, reminders: current.reminders ?? [], done: current.done ?? [] }) !== snapshot) throw Error("Family assignments changed. Reload before reviewing or assigning again.");
    if (!current.students.some(student => student.id === learnerId)) throw Error("This learner is no longer available.");
    const next: Family = { ...current, students: current.students.map(student => {
      if (student.id !== learnerId) return student;
      const present = student.assigned.some(a => a.courseId === courseId);
      return { ...student, assigned: assignment ? (present ? student.assigned.map(a => a.courseId === courseId ? assignment! : a) : [...student.assigned, assignment]) : student.assigned.filter(a => a.courseId !== courseId) };
    }) };
    await assertScope(); return JSON.stringify(next);
  });
  if (!await io.exists(learnerId)) {
    await io.update(old => {
      if (!old) throw Error("Family was removed; nothing to clean up.");
      const current = JSON.parse(old) as Family;
      return JSON.stringify({ ...current, students: current.students.filter(student => student.id !== learnerId) });
    }).catch(() => { /* Never recreate a removed family during cleanup. */ });
    throw Error("This learner was deleted while saving. Reload Family to inspect the current state.");
  }
  // A failure here is an uncertain UI outcome; reload instead of blindly repeating the write.
  await guard(); return JSON.parse(text) as Family;
}

export interface ParentCourseAccessIO {
  family(): Promise<Family | null>;
  course(id: string): Promise<{ course: Course; raw: string } | null>;
  exists(id: string): Promise<boolean>;
}
const accessIO: ParentCourseAccessIO = { family: loadFamily, course: loadStoredCourseSnapshot, exists: competencyProfileExists };
/** Fresh persisted authority, reusable at activity write boundaries as well as route entry. */
export async function assertCurrentParentCourseAccess(learnerId: string, courseId: string, expectedDigest?: string, io: ParentCourseAccessIO = accessIO): Promise<void> {
  const denied = () => Error("Parent review required for this exact community version. Reopen the learning plan; prior progress is preserved.");
  if (!learnerPattern.test(learnerId)) throw denied();
  const family = await io.family(), source = await io.course(courseId);
  if (!family || family.mode === "classroom" || !source || source.course.id !== courseId || !source.course.community || !await io.exists(learnerId)) throw denied();
  const digest = await parentCourseDigest(source.course);
  if (expectedDigest !== undefined && digest !== expectedDigest) throw denied();
  const current = await io.family(), stored = await io.course(courseId);
  const student = current?.students.find(s => s.id === learnerId);
  if (!current || current.mode === "classroom" || !student || !stored || stored.raw !== source.raw || !hasParentCourseReview(learnerId,source.course,digest,student.assigned.find(a => a.courseId === courseId)?.communityReview) || !await io.exists(learnerId)) throw denied();
}
