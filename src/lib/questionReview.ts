import type { Chosen } from "./types";
import type { ReviewBaseline } from "./reviewSnapshot";

export const questionIssues = ["Checked", "Incorrect key", "Ambiguous wording", "Valid answer rejected",
  "Missing instruction", "Explanation error", "Unanswerable", "Other"] as const;
export type QuestionIssue = typeof questionIssues[number];
export interface QuestionAttempt {
  id: string; bankId: string; questionId: string; digest: string; revision: number;
  stem: string; reviewer: string; order: number[]; chosen: Chosen;
  stage: "answering" | "revealed" | "recorded";
  issue: QuestionIssue; note: string;
  comparison?: { response: string; key: string; explanation: string; correct: boolean };
  recordedAt?: string;
}

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function validHash(s: unknown) { return typeof s === "string" && /^[0-9a-f]{64}$/.test(s); }
function revision(n: unknown) { return typeof n === "number" && Number.isSafeInteger(n) && n > 0; }
export function validAttempt(value: unknown): value is QuestionAttempt {
  if (!object(value)) return false;
  const a = value, c = a.comparison;
  if (![a.id, a.bankId, a.questionId].every(s => typeof s === "string" && s.trim()) ||
      ![a.stem, a.reviewer, a.note].every(s => typeof s === "string") || !validHash(a.digest) || !revision(a.revision) ||
      !Array.isArray(a.chosen) || !a.chosen.every(n => typeof n === "string" || Number.isFinite(n)) ||
      !Array.isArray(a.order) || !a.order.every(n => Number.isSafeInteger(n) && n >= 0 && n < (a.order as number[]).length) ||
      new Set(a.order).size !== a.order.length || !questionIssues.includes(a.issue as QuestionIssue)) return false;
  if (c !== undefined && !(object(c) && typeof c.correct === "boolean" &&
      [c.response, c.key, c.explanation].every(s => typeof s === "string"))) return false;
  if (a.stage === "answering") return c === undefined && a.recordedAt === undefined;
  if (a.stage === "revealed") return c !== undefined && a.recordedAt === undefined;
  return a.stage === "recorded" && (c !== undefined || a.issue === "Unanswerable") && !!String(a.reviewer).trim() &&
    !!String(a.note).trim() && typeof a.recordedAt === "string" && Number.isFinite(Date.parse(a.recordedAt));
}
export function validBaseline(value: unknown): value is ReviewBaseline {
  if (!object(value) || !validHash(value.digest) || !revision(value.revision) || !Array.isArray(value.entries)) return false;
  const seen = new Set<string>();
  return value.entries.every(e => {
    if (!object(e) || typeof e.key !== "string" || typeof e.label !== "string" || !validHash(e.hash) || seen.has(e.key)) return false;
    seen.add(e.key);
    return true;
  });
}
