import type { Bank, ExamConfig, Question, Section } from "./types";
import { slugify, uid } from "./util";

export class BankError extends Error {}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Parse and normalize a bank from JSON text. Throws BankError with a
 * readable message pointing at the first problem it finds.
 */
export function parseBank(text: string): Bank {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    throw new BankError(`This file isn't valid JSON: ${(e as Error).message}`);
  }
  return normalizeBank(raw);
}

export function normalizeBank(raw: unknown): Bank {
  if (!isObj(raw)) throw new BankError("The bank must be a JSON object.");
  if (raw.format !== undefined && raw.format !== "examiner-bank") {
    throw new BankError(`Unknown format "${String(raw.format)}". Expected "examiner-bank".`);
  }
  const title = str(raw.title).trim();
  if (!title) throw new BankError('The bank needs a "title".');

  const id = /^[A-Za-z0-9_-]{1,100}$/.test(str(raw.id)) ? str(raw.id) : slugify(title);

  const sections: Section[] = Array.isArray(raw.sections)
    ? raw.sections.filter(isObj).map((s) => ({
        id: str(s.id).trim() || slugify(str(s.name)),
        name: str(s.name).trim() || str(s.id),
      }))
    : [];

  if (!Array.isArray(raw.questions)) throw new BankError('The bank needs a "questions" array.');

  const seen = new Set<string>();
  const questions: Question[] = raw.questions.map((q, i) => {
    const where = `Question ${i + 1}`;
    if (!isObj(q)) throw new BankError(`${where} isn't an object.`);
    const stem = str(q.stem).trim();
    if (!stem) throw new BankError(`${where} has no "stem" (the question text).`);
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      throw new BankError(`${where} needs at least two "choices".`);
    }
    const choices = q.choices.map((c) => String(c));
    const answerRaw = Array.isArray(q.answer) ? q.answer : [q.answer];
    const answer = answerRaw.map((a) => Number(a));
    if (!answer.length || answer.some((a) => !Number.isInteger(a) || a < 0 || a >= choices.length)) {
      throw new BankError(
        `${where} has an invalid "answer". Use zero-based choice indices, e.g. 0 for the first choice.`,
      );
    }
    let qid = str(q.id).trim() || `q${i + 1}`;
    if (seen.has(qid)) qid = `${qid}-${uid()}`;
    seen.add(qid);
    const section = str(q.section).trim() || undefined;
    if (section && !sections.some((s) => s.id === section)) {
      sections.push({ id: section, name: section });
    }
    return {
      id: qid,
      section,
      topic: str(q.topic).trim() || "General",
      stem,
      choices,
      answer: Array.from(new Set(answer)).sort((a, b) => a - b),
      explanation: str(q.explanation).trim() || undefined,
    };
  });

  const ex = isObj(raw.exam) ? raw.exam : {};
  const count = Number(ex.questionCount);
  const exam: ExamConfig = {
    // Not clamped to the bank size: a bank may still be filling up. Drawing clamps.
    questionCount: Number.isInteger(count) && count > 0 ? count : 50,
    timeLimitMinutes: Number(ex.timeLimitMinutes) > 0 ? Number(ex.timeLimitMinutes) : 60,
    passingPercent:
      Number(ex.passingPercent) > 0 && Number(ex.passingPercent) <= 100 ? Number(ex.passingPercent) : 75,
  };
  if (isObj(ex.sectionQuotas)) {
    const quotas: Record<string, number> = {};
    for (const [k, v] of Object.entries(ex.sectionQuotas)) {
      const n = Number(v);
      if (Number.isInteger(n) && n > 0) quotas[k] = n;
    }
    if (Object.keys(quotas).length) exam.sectionQuotas = quotas;
  }
  if (isObj(ex.sectionPassing)) {
    const marks: Record<string, number> = {};
    for (const [k, v] of Object.entries(ex.sectionPassing)) {
      const n = Number(v);
      if (n > 0 && n <= 100) marks[k] = n;
    }
    if (Object.keys(marks).length) exam.sectionPassing = marks;
  }

  return {
    format: "examiner-bank",
    version: 1,
    id,
    title,
    description: str(raw.description).trim() || undefined,
    author: str(raw.author).trim() || undefined,
    updated: str(raw.updated) || undefined,
    sections,
    exam,
    questions,
  };
}

/** Problems that don't block saving but the editor should surface. */
export function bankWarnings(bank: Bank): string[] {
  const w: string[] = [];
  if (!bank.questions.length) w.push("This bank has no questions yet.");
  if (bank.exam.questionCount > bank.questions.length) {
    w.push(
      `Exam size (${bank.exam.questionCount}) is larger than the bank (${bank.questions.length}); exams will use every question.`,
    );
  }
  const quotas = bank.exam.sectionQuotas;
  if (quotas) {
    const sum = Object.values(quotas).reduce((a, b) => a + b, 0);
    if (sum > bank.exam.questionCount) {
      w.push(`Section quotas add up to ${sum}, more than the exam size of ${bank.exam.questionCount}.`);
    }
    for (const [sid, n] of Object.entries(quotas)) {
      const have = bank.questions.filter((q) => q.section === sid).length;
      const name = bank.sections.find((s) => s.id === sid)?.name ?? sid;
      if (have < n) w.push(`Section "${name}" needs ${n} questions per exam but only has ${have}.`);
    }
  }
  return w;
}

export function emptyBank(title = "Untitled bank"): Bank {
  return {
    format: "examiner-bank",
    version: 1,
    id: `${slugify(title)}-${uid()}`,
    title,
    sections: [],
    exam: { questionCount: 50, timeLimitMinutes: 60, passingPercent: 75 },
    questions: [],
  };
}

export function serializeBank(bank: Bank): string {
  const { courseId: _courseId, ...rest } = bank;
  return JSON.stringify({ ...rest, updated: new Date().toISOString() }, null, 2);
}
