import { validAttempt, validBaseline, type QuestionAttempt } from "./questionReview";
import type { ReviewBaseline } from "./reviewSnapshot";
import type { Course } from "./types";
import { activityLabels, courseActivities } from "./courseActivities";
import { ASSIGN_BLOCK, parseAssignBlock } from "./courseWork";
import { uid } from "./util";

/** A portable author/reviewer worksheet, kept separate from learner course packages. */
export interface Comparison { url: string; finding: string }
export interface ReviewDecision {
  reviewer: string;
  result: "reviewed" | "changes";
  note: string;
  date: string;
  revision: number;
  digest: string;
  evidence: string;
}
export interface Objective {
  id: string;
  outcome: string;
  lessonId: string;
  task: string;
  taskNote: string;
  rubric: string;
  rubricNote: string;
  author: string;
  comparisons: Comparison[];
  workedExample?: string;
  guidedPractice?: string;
  independentApplication?: string;
  review: ReviewDecision | null;
  previousReviews?: ReviewDecision[];
  draftDecision?: { reviewer: string; findings: string; result: ReviewDecision["result"] };
}
export interface ObjectiveFile { format: "erudior-objective-review"; version: 1 | 2; courseId: string; objectives: Objective[]; attempts?: QuestionAttempt[]; baselines?: ReviewBaseline[] }
export interface TaskEvidence { key: string; title: string; lessons: string[]; rubric?: string }
export const sourceLabels = ["University source 1", "University source 2", "Official source"];
export function newObjective(lessonId: string, author = ""): Objective {
  return { id: uid("objective-"), outcome: "", lessonId, author, task: "", taskNote: "", rubric: "", rubricNote: "",
    comparisons: sourceLabels.map(() => ({ url: "", finding: "" })), review: null };
}
export function objectiveTasks(course: Course): Map<string, TaskEvidence> {
  const tasks = new Map<string, TaskEvidence>();
  for (const kind of ["writing", "lab"] as const) {
    for (const task of (kind === "writing" ? course.writing : course.labs) ?? []) {
      const key = kind + ":" + task.id;
      const rubric = course.rubrics?.find(r => r.id === task.rubric && r.criteria.length);
      tasks.set(key, { key, title: task.title, lessons: [], rubric: rubric && (rubric.title || rubric.id) });
    }
  }
  for (const activity of courseActivities(course)) {
    const key = activity.kind + ":" + activity.id;
    const advanced = activity.kind === "advanced" && course.advancedAssessments?.find(item => item.id === activity.id);
    tasks.set(key, { key, title: activityLabels[activity.kind] + " — " + activity.title,
      lessons: activity.lessonId ? [activity.lessonId] : [], rubric: advanced ? advanced.rubric.title : undefined });
  }
  for (const lesson of course.lessons) {
    for (const block of lesson.body.matchAll(ASSIGN_BLOCK)) {
      for (const link of parseAssignBlock(block[1]).links) {
        if (link.kind === "log") continue;
        const linked = tasks.get(link.kind + ":" + link.id);
        if (linked && !linked.lessons.includes(lesson.id)) linked.lessons.push(lesson.id);
      }
    }
    if (lesson.vmLab) {
      const key = "vm:" + lesson.id;
      tasks.set(key, { key, title: "VM practical — " + lesson.title, lessons: [lesson.id] });
    }
  }
  return tasks;
}
export function comparisonCoverage(items: Comparison[]) {
  const universities = new Set<string>();
  let official = false;
  items.forEach(({url, finding}, i) => {
    if (!finding.trim()) return;
    let site: URL;
    try { site = new URL(url); } catch { return; }
    if (!["https:", "http:"].includes(site.protocol) || !site.hostname.includes(".") || site.username || site.password) return;
    const host = site.hostname.toLowerCase().replace(/\.$/, "");
    site.hash = "";
    if (i === 2) {
      official = !items.slice(0, 2).some(source => {
        try {
          const university = new URL(source.url);
          university.hash = "";
          return university.href === site.href;
        } catch { return false; }
      });
    } else if (host.endsWith(".edu")) universities.add(host.split(".").slice(-2).join("."));
  });
  return { universities: universities.size, official };
}
// Fixed field order also binds imported decisions to their objective and all comparison notes.
export function objectiveEvidence(o: Objective): string {
  return JSON.stringify([o.id, o.outcome, o.lessonId, o.author, o.task, o.taskNote, o.rubric, o.rubricNote,
    o.comparisons.map(s => [s.url, s.finding]),
    ...(o.workedExample || o.guidedPractice || o.independentApplication ? [o.workedExample ?? "", o.guidedPractice ?? "", o.independentApplication ?? ""] : [])]);
}
export function reviewState(o: Objective, digest: string, revision: number) {
  if (!o.review) return "Missing review";
  if (!digest) return "Checking course revision";
  if (o.review.digest !== digest || o.review.revision !== revision || o.review.evidence !== objectiveEvidence(o)) return "Review outdated";
  return o.review.result === "changes" ? "Changes requested" : "Review recorded";
}
export function recordObjective(o: Objective, digest: string, revision: number, reviewer: string, result: ReviewDecision["result"], note: string): ReviewDecision {
  if (!o.outcome.trim() || !o.author.trim() || !reviewer.trim() || reviewer.trim().toLowerCase() === o.author.trim().toLowerCase() || !note.trim())
    throw Error("Enter the objective, its author, a different reviewer and the review findings.");
  if (!/^[0-9a-f]{64}$/.test(digest)) throw Error("Wait for the course revision to be identified.");
  return { reviewer: reviewer.trim(), result, note: note.trim(), date: new Date().toISOString(), revision, digest, evidence: objectiveEvidence(o) };
}
export function objectiveGaps(course: Course, tasks: Map<string, TaskEvidence>, o: Objective, digest: string): string[] {
  const gaps: string[] = [];
  if (!o.outcome.trim()) gaps.push("Objective");
  if (!course.lessons.some(l => l.id === o.lessonId)) gaps.push("Lesson");
  if (!o.workedExample?.trim()) gaps.push("Worked example");
  if (!o.guidedPractice?.trim()) gaps.push("Guided practice");
  if (!o.independentApplication?.trim()) gaps.push("Independent application");
  const task = tasks.get(o.task);
  if (!task && !(o.task === "manual" && o.taskNote.trim())) gaps.push("Independent task");
  if (!(task?.rubric || course.rubrics?.some(r => r.id === o.rubric && r.criteria.length) || (o.rubric === "#manual" && o.rubricNote.trim()))) gaps.push("Rubric");
  const coverage = comparisonCoverage(o.comparisons);
  if (coverage.universities < 2) gaps.push("University comparisons");
  if (!coverage.official) gaps.push("Official comparison");
  const state = reviewState(o, digest, course.revision ?? 1);
  if (state !== "Review recorded") gaps.push(state);
  return gaps;
}
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const stringFields = (v: Record<string, unknown>, keys: string[]) => keys.every(k => typeof v[k] === "string");
export function readObjectiveFile(text: string, courseId: string): ObjectiveFile {
  const value: unknown = JSON.parse(text);
  if (!isObject(value) || value.format !== "erudior-objective-review" || (value.version !== 1 && value.version !== 2) || value.courseId !== courseId || !Array.isArray(value.objectives))
    throw Error("Choose an objective review file for this course.");
  if (value.attempts !== undefined && (!Array.isArray(value.attempts) || !value.attempts.every(validAttempt) ||
      new Set(value.attempts.map(a => a.id)).size !== value.attempts.length)) throw Error("Invalid question review records.");
  if (value.baselines !== undefined && (!Array.isArray(value.baselines) || !value.baselines.every(validBaseline) ||
      new Set(value.baselines.map(b => b.digest)).size !== value.baselines.length)) throw Error("Invalid course comparison records.");
  const seen = new Set<string>();
  for (const o of value.objectives) {
    if (!isObject(o) || !stringFields(o, ["id","outcome","lessonId","task","taskNote","rubric","rubricNote","author"]) ||
        typeof o.id !== "string" || !o.id.trim() || seen.has(o.id) || !Array.isArray(o.comparisons) || o.comparisons.length !== 3 ||
        !o.comparisons.every(s => isObject(s) && stringFields(s, ["url","finding"]))) throw Error("Invalid or duplicate objective in review file.");
    if ([o.workedExample, o.guidedPractice, o.independentApplication].some(s => s !== undefined && typeof s !== "string"))
      throw Error("Invalid skill progression evidence.");
    seen.add(o.id);
    const draft = o.draftDecision;
    if (draft !== undefined && (!isObject(draft) || !stringFields(draft, ["reviewer", "findings"]) || (draft.result !== "reviewed" && draft.result !== "changes")))
      throw Error("Invalid draft reviewer notes in review file.");
    if (o.previousReviews !== undefined && !Array.isArray(o.previousReviews)) throw Error("Invalid review history in review file.");
    const records = [...(o.previousReviews ?? []), ...(o.review === null ? [] : [o.review])];
    for (const r of records) {
      if (!isObject(r) || !stringFields(r, ["reviewer","note","date","digest","evidence"]) ||
        typeof r.reviewer !== "string" || !r.reviewer.trim() || typeof r.note !== "string" || !r.note.trim() ||
        (r.result !== "reviewed" && r.result !== "changes") || !Number.isFinite(Date.parse(String(r.date))) ||
        !Number.isSafeInteger(r.revision) || Number(r.revision) < 1 || !/^[0-9a-f]{64}$/.test(String(r.digest)) ||
        (r.evidence === objectiveEvidence(o as unknown as Objective) && (!String(o.author).trim() || r.reviewer.trim().toLowerCase() === String(o.author).trim().toLowerCase())))
        throw Error("Invalid reviewer record in review file.");
    }
  }
  return value as unknown as ObjectiveFile;
}
