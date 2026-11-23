import type { Course } from "./types";
import { exportCourseSnapshot, normalizeCourse } from "./course";
import { sha256Hex } from "./courseSign";

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, child]) => [key, canonical(child)]));
  return value;
}
/** Normalized portable content includes embedded media and provenance; save/reload is stable. */
function portableSnapshot(course: Course): Course {
  return JSON.parse(exportCourseSnapshot(normalizeCourse(JSON.parse(exportCourseSnapshot(course)))));
}
export async function reviewCourseDigest(course: Course): Promise<string> {
  return fingerprint(portableSnapshot(course));
}

export interface ReviewEntry { key: string; label: string; hash: string }
export interface ReviewBaseline { digest: string; revision: number; entries: ReviewEntry[] }
export interface ReviewChange { key: string; label: string; change: "Added" | "Edited" | "Removed" }

export function compareReviewEntries(before: ReviewEntry[], after: ReviewEntry[]): ReviewChange[] {
  const previous = new Map(before.map(entry => [entry.key, entry]));
  const changes: ReviewChange[] = [];
  for (const item of after) {
    const old = previous.get(item.key);
    if (!old || old.hash !== item.hash) changes.push({ key: item.key, label: item.label, change: old ? "Edited" : "Added" });
    previous.delete(item.key);
  }
  for (const old of previous.values()) changes.push({ key: old.key, label: old.label, change: "Removed" });
  return changes;
}

async function fingerprint(value: unknown) {
  return sha256Hex(new TextEncoder().encode(JSON.stringify(canonical(value))));
}

/** Store identifiers, labels and hashes. Embedded media, questions and answer keys stay in the course. */
export async function reviewBaseline(course: Course): Promise<ReviewBaseline> {
  const portable = portableSnapshot(course);
  const { lessons, banks, rubrics = [], writing = [], labs = [], advancedAssessments = [],
    branchingScenarios = [], scientificWorkspaces = [], spreadsheetAssignments = [], documentReviews = [], ...other } = portable;
  const entries: ReviewEntry[] = [];
  const work: { ids: string[]; label: string; value: unknown }[] = [];
  const order: [string, string[]][] = [];
  function group(name: string, items: { id: string; title?: string }[]) {
    order.push([name, items.map(item => item.id)]);
    for (const item of items) work.push({ ids: [name, item.id], label: name + " · " + (item.title || item.id), value: item });
  }
  group("Lesson", lessons);
  group("Rubric", rubrics);
  group("Writing task", writing);
  group("Lab", labs);
  group("Scenario", branchingScenarios);
  group("Science workspace", scientificWorkspaces);
  group("Spreadsheet", spreadsheetAssignments);
  group("Document review", documentReviews);
  order.push(["Advanced assessment", advancedAssessments.map(item => item.id)]);
  for (const { rubric, ...task } of advancedAssessments) {
    work.push({ ids: ["Advanced assessment", task.id], label: "Advanced assessment · " + task.title, value: task });
    work.push({ ids: ["Assessment rubric", task.id], label: "Assessment rubric · " + rubric.title, value: rubric });
  }
  order.push(["Bank", banks.map(bank => bank.id)]);
  for (const { questions, ...bank } of banks) {
    work.push({ ids: ["Bank", bank.id], label: "Question bank · " + bank.title, value: [bank, questions.map(q => q.id)] });
    for (const q of questions) {
      const item = bank.title + " / " + q.id + " · " + q.stem.slice(0, 80);
      const { answer, accept, target, targets, tiles, reading, lowestTerms, caseSensitive, code, explanation, ...prompt } = q;
      const { tests, solution, ...exercise } = code ?? {};
      const key = { answer, accept, target, targets, tiles, reading, lowestTerms, caseSensitive, tests, solution,
        correctChoices: answer.map(i => q.choices[i]), sequence: q.type === "order" ? q.choices : undefined };
      work.push({ ids: ["Question", bank.id, q.id], label: "Question · " + item, value: [prompt, exercise] });
      work.push({ ids: ["Answer key", bank.id, q.id], label: "Answer key · " + item, value: key });
      work.push({ ids: ["Explanation", bank.id, q.id], label: "Explanation · " + item, value: explanation ?? "" });
    }
  }
  work.push({ ids: ["Course"], label: "Course settings, modules and other materials", value: other });
  work.push({ ids: ["Order"], label: "Course item order or membership", value: order });
  for (let i = 0; i < work.length; i += 96) {
    entries.push(...await Promise.all(work.slice(i, i + 96).map(async ({ ids, label, value }) =>
      ({ key: JSON.stringify(ids), label, hash: await fingerprint(value) }))));
  }
  return { digest: await fingerprint(portable), revision: course.revision ?? 1, entries };
}
