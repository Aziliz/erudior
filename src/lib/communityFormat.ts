// Community courses: the block-only format people write on the website, its limits and checks
// (shared by the editor, the API worker and the app), and conversion to an app course.
// No DOM or Node APIs here: the worker bundles this file too.

import { LEVELS, SUBJECTS, TYPES, calculatorForSubject, knownSubject, normalizeLevels } from "./taxonomy";
import type { Drill, FigureSpec } from "./types";
import { drillError } from "./drills";
import { renderFigure } from "./figure";
import { splitMath } from "./mathSplit";
import { readSpec, targetProblems, type ManipSpec, type ManipTarget } from "./manip";
export { LEVELS, SUBJECTS, TYPES };

export type QKind = "choice" | "text" | "match" | "label" | "order" | "model";
export const Q_KINDS: QKind[] = ["choice", "text", "match", "label", "order", "model"];

/**
 * A question (in a lesson or a module quiz). Like the app's questions:
 * - choice (default): `answer` lists the right choices (more than one = select all that apply).
 * - text: each `___` in the stem is a blank (none = one box); `accept[i]` lists answers for blank i.
 * - match: `left[i]` goes with `choices[answer[i]]`; extra choices are distractors.
 * - label: numbered `markers` on the image; marker i goes with `choices[answer[i]]`.
 * - order: `choices` written in the right order (shown shuffled).
 * - model: a math manipulative (`model`) set to show `target` (as in the app's model questions).
 */
export interface CQuestion {
  id: string;
  kind?: QKind;
  stem: string;
  choices: string[];
  answer: number[];
  explanation: string;
  accept?: string[][];
  caseSensitive?: boolean;
  lowestTerms?: boolean;
  left?: string[];
  /** label: marker positions in percent of the image's width and height. */
  markers?: { x: number; y: number }[];
  /** A picture shown under the question (required for label questions). */
  imageId?: string;
  imageAlt?: string;
  /** model: the manipulative and how it starts. */
  model?: ManipSpec;
  /** model: what counts as right. */
  target?: ManipTarget;
}

export type CalloutKind = "tip" | "warning" | "rule";

export type Block =
  | { type: "heading"; text: string; /** 2 = section (default), 3 = subsection. */ level?: 2 | 3 }
  | { type: "text"; md: string }
  /** Full official lesson Markdown, including fenced maps, timelines, phonics, code and assignments. */
  | { type: "source"; md: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "image"; imageId: string; alt: string; caption: string }
  | ({ type: "question" } & CQuestion)
  /** A tinted box: a tip, a warning, or a named rule/theorem. */
  | { type: "callout"; kind: CalloutKind; title: string; md: string }
  /** A worked example (its own tinted box). */
  | { type: "example"; title: string; md: string }
  /** A formula on its own line (TeX). */
  | { type: "math"; tex: string }
  /** A graph or geometry drawing: a figure spec as JSON (the same format as official courses). */
  | { type: "figure"; spec: string; caption: string }
  /** A Mermaid diagram (flowchart, timeline, sequence…), with a title and description for screen readers. */
  | { type: "diagram"; code: string; title: string; description: string }
  /** A math manipulative to play with (counters, blocks, number line, fraction bars, clock, coins). */
  | { type: "manipulative"; spec: ManipSpec };

export interface CLesson {
  id: string;
  title: string;
  blocks: Block[];
  /** Module id (missing: the first module). */
  module?: string;
  /** Optional extra depth: not needed to finish the module or course. */
  honors?: boolean;
  /** About how long it takes. */
  minutes?: number;
  /** Drill and reference sheet ids offered beside the lesson. */
  drills?: string[];
  refs?: string[];
}

export interface CModule {
  id: string;
  title: string;
  /** Every lesson in it is optional extra depth. */
  honors?: boolean;
  /** End-of-module quiz (unlocks when its lessons are done). */
  quiz?: CQuestion[];
}

export interface CCard {
  id: string;
  front: string;
  back: string;
}

export interface CDeck {
  id: string;
  title: string;
  cards: CCard[];
}

export interface CGlossary {
  term: string;
  definition: string;
  aliases?: string[];
}

export interface CReference {
  id: string;
  title: string;
  md: string;
}

export interface CVocab {
  id: string;
  /** The lesson that introduces it. */
  lesson: string;
  kind?: "word" | "phrase" | "char";
  term: string;
  alt?: string[];
  meanings: string[];
  reading?: string;
  pos?: string;
  plural?: string;
  example?: string;
  exampleEn?: string;
  note?: string;
}

export interface CLanguage {
  code: string;
  name: string;
  tts?: string;
  keys?: string[];
  level?: string;
}

export interface CReading {
  title: string;
  author?: string;
  url?: string;
  free?: boolean;
  note?: string;
}

export interface CExam {
  questionCount?: number;
  minutes?: number;
  passingPercent?: number;
}

export type CalcChoice = "basic" | "scientific" | "graphing" | "none";
export const CALCULATORS: CalcChoice[] = ["basic", "scientific", "graphing", "none"];

export interface CommunityDoc {
  format: "erudior-community";
  version: 1;
  title: string;
  description: string;
  subject: string;
  level: string;
  /** "Course" or "Exam prep" (missing on drafts made before types existed: a course). */
  type?: string;
  /** The calculator learners get (missing: chosen from the subject, like official courses). */
  calculator?: CalcChoice;
  /** The practice exam (missing: up to 50 questions, 1.5 minutes each, 70% to pass). */
  exam?: CExam;
  /** Missing or empty: one module named after the course. */
  modules?: CModule[];
  lessons: CLesson[];
  decks: CDeck[];
  glossary?: CGlossary[];
  references?: CReference[];
  /** Math drills: practice problems with fresh numbers each time (the app's Drill format). */
  drills?: Drill[];
  /** Language courses. */
  language?: CLanguage;
  vocab?: CVocab[];
  readingList?: CReading[];
  /** Enable official early-reader read-aloud UI for this course. */
  readAloud?: boolean;
}

export const LIMITS = {
  title: 120,
  description: 600,
  lessons: 60,
  blocksPerLesson: 80,
  text: 6000,
  listItems: 30,
  choices: 6,
  short: 500,
  decks: 20,
  cards: 300,
  images: 40,
  /** Bytes per uploaded image. */
  imageBytes: 2 * 1024 * 1024,
  /** Whole document, as JSON. */
  docBytes: 900 * 1024,
  modules: 30,
  /** Questions in one module quiz. */
  moduleQuiz: 40,
  /** Blanks, match rows or markers in one question. */
  parts: 12,
  glossary: 500,
  references: 30,
  drills: 80,
  /** One drill, as JSON. */
  drillBytes: 12000,
  vocab: 3000,
  readingList: 60,
  minutes: 600,
};

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export const emptyDoc = (title = "Untitled course"): CommunityDoc => ({
  format: "erudior-community",
  version: 1,
  title,
  description: "",
  subject: "Other",
  level: "High School",
  type: "Course",
  lessons: [{ id: "l1", title: "Lesson 1", blocks: [{ type: "text", md: "" }] }],
  decks: [],
});

const ID = /^[A-Za-z0-9_-]{1,40}$/;
const isStr = (x: unknown): x is string => typeof x === "string";
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const strList = (x: unknown, max: number, len: number) => Array.isArray(x) && x.length <= max && x.every((s) => isStr(s) && s.length <= len);

/** The app's question fields for a community question (shared by lessons and module quizzes). */
function appQuestion(q: CQuestion, imageSrc: (id: string) => string): Record<string, unknown> {
  const kind = q.kind ?? "choice";
  const line = (c: string) => c.replace(/\s*\n\s*/g, " ").trim();
  if (kind === "match" || kind === "label") {
    // Blank extra answers (left from typing) are dropped; answers point at the kept ones.
    const keep = q.choices.map((_, i) => i).filter((i) => q.answer.includes(i) || q.choices[i].trim());
    q = { ...q, choices: keep.map((i) => q.choices[i]), answer: q.answer.map((a) => keep.indexOf(a)) };
  }
  return {
    ...(kind !== "choice" ? { type: kind } : {}),
    // Questions show as plain text with math (not Markdown).
    stem: q.stem.trim(),
    choices: kind === "text" || kind === "model" ? [] : q.choices.map(line),
    answer: kind === "text" || kind === "order" || kind === "model" ? [] : q.answer,
    ...(kind === "text" ? { accept: (q.accept ?? []).map((a) => a.map((x) => x.trim()).filter(Boolean)), ...(q.caseSensitive ? { caseSensitive: true } : {}), ...(q.lowestTerms ? { lowestTerms: true } : {}) } : {}),
    ...(kind === "match" ? { left: (q.left ?? []).map(line) } : {}),
    ...(kind === "label" ? { markers: q.markers ?? [] } : {}),
    ...(kind === "model" ? { model: readSpec(q.model).spec, target: q.target } : {}),
    ...(q.imageId ? { image: { src: imageSrc(q.imageId), alt: (q.imageAlt ?? "").trim() } } : {}),
    explanation: q.explanation.trim() || undefined,
  };
}

function checkQuestion(q: CQuestion, at: string, strict: boolean, errs: string[]) {
  const kind = q.kind ?? "choice";
  if (!Q_KINDS.includes(kind)) return void errs.push(`${at}: unknown question type.`);
  const choices = Array.isArray(q.choices) ? q.choices : [];
  if (!isStr(q.stem) || q.stem.length > LIMITS.text) errs.push(`${at}: question too long.`);
  const maxChoices = kind === "choice" ? LIMITS.choices : LIMITS.parts + LIMITS.choices;
  if (choices.length > maxChoices || !choices.every((c) => isStr(c) && c.length <= LIMITS.short)) errs.push(`${at}: up to ${maxChoices} choices.`);
  if (!Array.isArray(q.answer) || !q.answer.every((a) => Number.isInteger(a) && a >= 0 && a < choices.length)) errs.push(`${at}: the right answer isn't one of the choices.`);
  if (!isStr(q.explanation) || q.explanation.length > LIMITS.text) errs.push(`${at}: explanation too long.`);
  if (q.accept !== undefined && (!Array.isArray(q.accept) || q.accept.length > LIMITS.parts || !q.accept.every((a) => strList(a, 20, LIMITS.short))))
    errs.push(`${at}: too many accepted answers.`);
  if (q.left !== undefined && !strList(q.left, LIMITS.parts, LIMITS.short)) errs.push(`${at}: up to ${LIMITS.parts} items to match.`);
  if (q.markers !== undefined && (!Array.isArray(q.markers) || q.markers.length > LIMITS.parts || !q.markers.every((m) => isObj(m) && Number.isFinite(m.x) && Number.isFinite(m.y))))
    errs.push(`${at}: bad markers.`);
  if (q.imageId !== undefined && q.imageId !== "" && !ID.test(q.imageId)) errs.push(`${at}: the picture is missing.`);
  if (q.imageAlt !== undefined && (!isStr(q.imageAlt) || q.imageAlt.length > LIMITS.short)) errs.push(`${at}: picture description too long.`);
  if ((q.model !== undefined && (!isObj(q.model) || JSON.stringify(q.model).length > 1000)) || (q.target !== undefined && (!isObj(q.target) || JSON.stringify(q.target).length > 500)))
    errs.push(`${at}: the model is too big.`);
  if (!strict) return;
  if (!q.stem.trim()) errs.push(`${at}: the question is empty.`);
  if (q.imageId && !q.imageAlt?.trim()) errs.push(`${at}: describe the picture for people who can't see it.`);
  switch (kind) {
    case "choice":
      if (choices.filter((c) => c.trim()).length < 2 || choices.some((c) => !c.trim())) errs.push(`${at}: needs at least two choices, none empty.`);
      if (!q.answer?.length) errs.push(`${at}: mark the right answer.`);
      break;
    case "text": {
      const blanks = (q.stem.match(/_{3,}/g) ?? []).length;
      const accept = q.accept ?? [];
      if (!accept.length || accept.some((a) => !a.some((x) => x.trim()))) errs.push(`${at}: give at least one accepted answer for each blank.`);
      else if (Math.max(1, blanks) !== accept.length) errs.push(`${at}: the question has ${Math.max(1, blanks)} blank(s) (___) but ${accept.length} answer list(s).`);
      break;
    }
    case "match":
    case "label": {
      const items = kind === "match" ? (q.left ?? []) : (q.markers ?? []);
      if (items.length < 2) errs.push(kind === "match" ? `${at}: add at least two items to match.` : `${at}: place at least two markers on the picture.`);
      if (kind === "match" && (q.left ?? []).some((x) => !x.trim())) errs.push(`${at}: an item to match is empty.`);
      if (kind === "label" && !q.imageId) errs.push(`${at}: a labeling question needs a picture.`);
      if (kind === "label" && (q.markers ?? []).some((m) => m.x < 0 || m.x > 100 || m.y < 0 || m.y > 100)) errs.push(`${at}: a marker is off the picture.`);
      if (choices.filter((c) => c.trim()).length < 2) errs.push(`${at}: needs at least two answers to pick from.`);
      if (q.answer.length !== items.length || q.answer.some((a) => !choices[a]?.trim())) errs.push(`${at}: give the answer for every item.`);
      break;
    }
    case "order":
      if (choices.length < 2 || choices.some((c) => !c.trim())) errs.push(`${at}: needs at least two steps, none empty.`);
      if (new Set(choices.map((c) => c.trim())).size !== choices.length) errs.push(`${at}: the same step is listed twice.`);
      break;
    case "model": {
      const r = readSpec(q.model);
      for (const p of [...r.problems, ...targetProblems(r.model, q.target)]) errs.push(`${at}: ${p}.`);
      break;
    }
  }
}

/** A figure block's spec, read and drawn once to catch mistakes (throws with a readable message). */
export function readFigure(spec: string): FigureSpec {
  let f: unknown;
  try {
    f = JSON.parse(spec);
  } catch (e) {
    throw new Error(`the figure isn't valid JSON (${(e as Error).message}).`);
  }
  if (!isObj(f) || !["plot", "shape", "numberline"].includes(String(f.type))) throw new Error(`the figure needs "type": "plot", "shape" or "numberline".`);
  renderFigure(f as unknown as FigureSpec);
  return f as unknown as FigureSpec;
}

/** Mermaid source with its own title/description lines and config directives taken out. */
const diagramBody = (code: string) =>
  code
    .split("\n")
    .filter((l) => !/^\s*(accTitle|accDescr)\b/.test(l) && !/^\s*%%\{/.test(l) && !/^\s*click\s/.test(l))
    .join("\n")
    .trim();

/**
 * Problems that stop publishing (an empty list means it's fine). Drafts may be incomplete;
 * `strict` adds the checks for publishing (no empty lessons, questions answerable, etc.).
 */
export function checkDoc(raw: unknown, strict: boolean): string[] {
  const errs: string[] = [];
  const d = raw as CommunityDoc;
  if (!d || typeof d !== "object" || d.format !== "erudior-community" || d.version !== 1) return ["Not a community course document."];
  if (JSON.stringify(d).length > LIMITS.docBytes) errs.push("The course is too large. Split it into two courses.");
  if (!isStr(d.title) || !d.title.trim()) errs.push("Give the course a title.");
  else if (d.title.length > LIMITS.title) errs.push(`Keep the title under ${LIMITS.title} characters.`);
  if (!isStr(d.description) || d.description.length > LIMITS.description) errs.push(`Keep the description under ${LIMITS.description} characters.`);
  if (strict && !d.description?.trim()) errs.push("Add a short description.");
  if (!SUBJECTS.includes(d.subject as (typeof SUBJECTS)[number])) errs.push("Choose a subject.");
  if (!LEVELS.includes(d.level as (typeof LEVELS)[number])) errs.push("Choose a level.");
  if (d.type !== undefined && !TYPES.includes(d.type as (typeof TYPES)[number])) errs.push("Choose a type.");
  if (d.readAloud !== undefined && typeof d.readAloud !== "boolean") errs.push("Read-aloud must be enabled or disabled.");
  if (d.calculator !== undefined && !CALCULATORS.includes(d.calculator)) errs.push("Choose a calculator.");
  if (d.exam !== undefined) {
    const e = d.exam;
    const n = (v: unknown, lo: number, hi: number) => v === undefined || (Number.isInteger(v) && (v as number) >= lo && (v as number) <= hi);
    if (!isObj(e) || !n(e.questionCount, 1, 300) || !n(e.minutes, 1, 600) || !n(e.passingPercent, 1, 100))
      errs.push("Practice exam: questions 1–300, minutes 1–600, passing score 1–100%.");
  }
  if (!Array.isArray(d.lessons) || !Array.isArray(d.decks)) return [...errs, "The course is damaged (lessons or decks missing)."];

  // Modules
  const modules = d.modules ?? [];
  const mids = new Set<string>();
  if (!Array.isArray(modules)) errs.push("The course is damaged (modules).");
  else {
    if (modules.length > LIMITS.modules) errs.push(`At most ${LIMITS.modules} modules.`);
    modules.forEach((m, i) => {
      const where = `Module ${i + 1}${m?.title ? ` (${m.title})` : ""}`;
      if (!m || !ID.test(m.id) || mids.has(m.id)) errs.push(`${where}: bad or repeated id.`);
      else mids.add(m.id);
      if (!isStr(m?.title) || !m.title.trim() || m.title.length > LIMITS.title) errs.push(`${where}: needs a title under ${LIMITS.title} characters.`);
      if (m?.quiz !== undefined) {
        if (!Array.isArray(m.quiz) || m.quiz.length > LIMITS.moduleQuiz) errs.push(`${where}: at most ${LIMITS.moduleQuiz} quiz questions.`);
        else {
          const qids = new Set<string>();
          m.quiz.forEach((q, j) => {
            const at = `${where}, quiz question ${j + 1}`;
            if (!ID.test(q?.id) || qids.has(q.id)) errs.push(`${at}: bad or repeated id.`);
            else qids.add(q.id);
            if (q) checkQuestion(q, at, strict, errs);
          });
        }
      }
      if (strict && !d.lessons.some((l) => (l.module ?? modules[0]?.id) === m.id)) errs.push(`${where}: has no lessons.`);
    });
  }

  if (d.lessons.length > LIMITS.lessons) errs.push(`At most ${LIMITS.lessons} lessons.`);
  if (strict && d.lessons.length === 0) errs.push("Add at least one lesson.");
  if (strict && d.lessons.length && d.lessons.every((l) => l.honors || modules.find((m) => m.id === (l.module ?? modules[0]?.id))?.honors))
    errs.push("At least one lesson must be a regular (not honors) lesson.");
  const drillIds = new Set((Array.isArray(d.drills) ? d.drills : []).map((x) => x?.id));
  const refIds = new Set((Array.isArray(d.references) ? d.references : []).map((x) => x?.id));
  const ids = new Set<string>();
  const qids = new Set<string>();
  let images = 0;
  d.lessons.forEach((l, i) => {
    const where = `Lesson ${i + 1}${l?.title ? ` (${l.title})` : ""}`;
    if (!l || !ID.test(l.id) || ids.has(l.id) || mids.has(l.id)) errs.push(`${where}: bad or repeated id.`);
    else ids.add(l.id);
    if (!isStr(l?.title) || !l.title.trim() || l.title.length > LIMITS.title) errs.push(`${where}: needs a title under ${LIMITS.title} characters.`);
    if (!Array.isArray(l?.blocks)) return void errs.push(`${where}: damaged.`);
    if (l.module !== undefined && !mids.has(l.module)) errs.push(`${where}: its module doesn't exist.`);
    if (l.minutes !== undefined && !(Number.isInteger(l.minutes) && l.minutes > 0 && l.minutes <= LIMITS.minutes)) errs.push(`${where}: minutes should be 1–${LIMITS.minutes}.`);
    if (l.drills !== undefined && (!strList(l.drills, LIMITS.drills, 40) || l.drills.some((x) => !drillIds.has(x)))) errs.push(`${where}: lists a drill that doesn't exist.`);
    if (l.refs !== undefined && (!strList(l.refs, LIMITS.references, 40) || l.refs.some((x) => !refIds.has(x)))) errs.push(`${where}: lists a reference sheet that doesn't exist.`);
    if (l.blocks.length > LIMITS.blocksPerLesson) errs.push(`${where}: at most ${LIMITS.blocksPerLesson} blocks.`);
    if (strict && !l.blocks.some((b) => b.type !== "question" && !((b.type === "text" || b.type === "source") && !b.md.trim()))) errs.push(`${where}: has no content.`);
    l.blocks.forEach((b, j) => {
      const at = `${where}, block ${j + 1}`;
      switch (b?.type) {
        case "heading":
          if (!isStr(b.text) || b.text.length > LIMITS.short) errs.push(`${at}: heading too long.`);
          if (b.level !== undefined && b.level !== 2 && b.level !== 3) errs.push(`${at}: bad heading size.`);
          if (strict && !b.text.trim()) errs.push(`${at}: empty heading.`);
          break;
        case "source":
        case "text":
          if (!isStr(b.md) || b.md.length > LIMITS.text) errs.push(`${at}: text over ${LIMITS.text} characters; split it.`);
          break;
        case "list":
          if (!Array.isArray(b.items) || b.items.length > LIMITS.listItems || !b.items.every((x) => isStr(x) && x.length <= LIMITS.short))
            errs.push(`${at}: lists hold up to ${LIMITS.listItems} items of ${LIMITS.short} characters.`);
          if (strict && !b.items.some((x) => x.trim())) errs.push(`${at}: empty list.`);
          break;
        case "image":
          images++;
          if (!ID.test(b.imageId)) errs.push(`${at}: the image is missing.`);
          if (!isStr(b.alt) || b.alt.length > LIMITS.short) errs.push(`${at}: describe the image in under ${LIMITS.short} characters.`);
          if (strict && !b.alt.trim()) errs.push(`${at}: describe the image for people who can't see it (alt text).`);
          if (!isStr(b.caption) || b.caption.length > LIMITS.short) errs.push(`${at}: caption too long.`);
          break;
        case "question":
          if (!ID.test(b.id) || qids.has(b.id)) errs.push(`${at}: bad or repeated question id.`);
          else qids.add(b.id);
          if (b.imageId) images++;
          checkQuestion(b, at, strict, errs);
          break;
        case "callout":
        case "example":
          if (b.type === "callout" && !["tip", "warning", "rule"].includes(b.kind)) errs.push(`${at}: choose a kind of box.`);
          if (!isStr(b.title) || b.title.length > LIMITS.short) errs.push(`${at}: title too long.`);
          if (!isStr(b.md) || b.md.length > LIMITS.text) errs.push(`${at}: text over ${LIMITS.text} characters.`);
          if (strict && !b.md.trim() && !(b.type === "callout" && b.title.trim())) errs.push(`${at}: empty box.`);
          break;
        case "math":
          if (!isStr(b.tex) || b.tex.length > LIMITS.short * 4) errs.push(`${at}: formula too long.`);
          if (isStr(b.tex) && /\$\$|\\\]/.test(b.tex)) errs.push(`${at}: write the formula without $$ around it.`);
          if (strict && !b.tex.trim()) errs.push(`${at}: empty formula.`);
          break;
        case "figure":
          if (!isStr(b.spec) || b.spec.length > LIMITS.text) errs.push(`${at}: figure too large.`);
          else if (strict || b.spec.trim())
            try {
              readFigure(b.spec);
            } catch (e) {
              errs.push(`${at}: ${(e as Error).message}`);
            }
          if (!isStr(b.caption) || b.caption.length > LIMITS.short) errs.push(`${at}: caption too long.`);
          break;
        case "diagram":
          if (!isStr(b.code) || b.code.length > LIMITS.text || b.code.includes("```")) errs.push(`${at}: diagram too large (or contains \`\`\`).`);
          if (!isStr(b.title) || b.title.length > LIMITS.short || !isStr(b.description) || b.description.length > LIMITS.short * 2)
            errs.push(`${at}: title or description too long.`);
          if (strict && !diagramBody(b.code ?? "")) errs.push(`${at}: empty diagram.`);
          if (strict && (!b.title.trim() || !b.description.trim())) errs.push(`${at}: give the diagram a title and a description for people who can't see it.`);
          break;
        case "manipulative":
          if (!isObj(b.spec) || JSON.stringify(b.spec).length > 1000) errs.push(`${at}: the model is too big.`);
          else if (strict) for (const p of readSpec(b.spec).problems) errs.push(`${at}: ${p}.`);
          break;
        default:
          errs.push(`${at}: unknown block.`);
      }
    });
  });
  if (images > LIMITS.images) errs.push(`At most ${LIMITS.images} images per course.`);

  // Notecards
  if (d.decks.length > LIMITS.decks) errs.push(`At most ${LIMITS.decks} card decks.`);
  const dids = new Set<string>();
  let cards = 0;
  d.decks.forEach((k, i) => {
    const where = `Deck ${i + 1}${k?.title ? ` (${k.title})` : ""}`;
    if (!k || !ID.test(k.id) || dids.has(k.id)) errs.push(`${where}: bad or repeated id.`);
    else dids.add(k.id);
    if (!isStr(k?.title) || !k.title.trim() || k.title.length > LIMITS.title) errs.push(`${where}: needs a title.`);
    if (!Array.isArray(k?.cards)) return void errs.push(`${where}: damaged.`);
    cards += k.cards.length;
    const cids = new Set<string>();
    k.cards.forEach((c, j) => {
      if (!ID.test(c?.id) || cids.has(c.id)) errs.push(`${where}, card ${j + 1}: bad id.`);
      else cids.add(c.id);
      if (!isStr(c.front) || !isStr(c.back) || c.front.length > LIMITS.short * 2 || c.back.length > LIMITS.short * 2) errs.push(`${where}, card ${j + 1}: too long.`);
      if (strict && (!c.front.trim() || !c.back.trim())) errs.push(`${where}, card ${j + 1}: needs both sides.`);
    });
    if (strict && k.cards.length === 0) errs.push(`${where}: has no cards.`);
  });
  if (cards > LIMITS.cards) errs.push(`At most ${LIMITS.cards} cards in all.`);

  // Glossary
  if (d.glossary !== undefined) {
    if (!Array.isArray(d.glossary) || d.glossary.length > LIMITS.glossary) errs.push(`At most ${LIMITS.glossary} glossary terms.`);
    else {
      const terms = new Set<string>();
      d.glossary.forEach((g, i) => {
        const at = `Glossary term ${i + 1}${g?.term ? ` (${g.term})` : ""}`;
        if (!isStr(g?.term) || g.term.length > LIMITS.title || /[[\]|]/.test(g.term)) errs.push(`${at}: terms are under ${LIMITS.title} characters, without [ ] or |.`);
        else if (terms.has(g.term.trim().toLowerCase())) errs.push(`${at}: listed twice.`);
        else terms.add(g.term.trim().toLowerCase());
        if (!isStr(g?.definition) || g.definition.length > LIMITS.text / 4) errs.push(`${at}: definition too long.`);
        if (g?.aliases !== undefined && !strList(g.aliases, 10, LIMITS.title)) errs.push(`${at}: up to 10 other names.`);
        if (strict && (!g.term.trim() || !g.definition.trim())) errs.push(`${at}: needs a term and a definition.`);
      });
    }
  }

  // Reference sheets
  if (d.references !== undefined) {
    if (!Array.isArray(d.references) || d.references.length > LIMITS.references) errs.push(`At most ${LIMITS.references} reference sheets.`);
    else {
      const seen = new Set<string>();
      d.references.forEach((r, i) => {
        const at = `Reference sheet ${i + 1}${r?.title ? ` (${r.title})` : ""}`;
        if (!r || !ID.test(r.id) || seen.has(r.id)) errs.push(`${at}: bad or repeated id.`);
        else seen.add(r.id);
        if (!isStr(r?.title) || !r.title.trim() || r.title.length > LIMITS.title) errs.push(`${at}: needs a title.`);
        if (!isStr(r?.md) || r.md.length > LIMITS.text * 2) errs.push(`${at}: over ${LIMITS.text * 2} characters.`);
        if (strict && !r.md.trim()) errs.push(`${at}: is empty.`);
      });
    }
  }

  // Drills
  if (d.drills !== undefined) {
    if (!Array.isArray(d.drills) || d.drills.length > LIMITS.drills) errs.push(`At most ${LIMITS.drills} drills.`);
    else {
      const seen = new Set<string>();
      d.drills.forEach((x, i) => {
        const at = `Drill ${i + 1}${x?.title ? ` (${x.title})` : ""}`;
        if (!x || !ID.test(x.id) || seen.has(x.id)) return void errs.push(`${at}: bad or repeated id.`);
        seen.add(x.id);
        if (JSON.stringify(x).length > LIMITS.drillBytes) errs.push(`${at}: too large.`);
        if (!isStr(x.title) || !x.title.trim() || x.title.length > LIMITS.title) errs.push(`${at}: needs a title.`);
        if (!isObj(x.vars) || !isStr(x.prompt) || !isStr(x.solution) || !isStr(x.answer)) return void errs.push(`${at}: damaged.`);
        if (x.calc !== undefined && (!isObj(x.calc) || !Object.values(x.calc).every(isStr))) errs.push(`${at}: damaged formulas.`);
        if (x.funcs !== undefined && (!isObj(x.funcs) || !Object.values(x.funcs).every(isStr))) errs.push(`${at}: damaged functions.`);
        if (x.where !== undefined && !strList(x.where, 20, LIMITS.short)) errs.push(`${at}: damaged conditions.`);
        if (strict) {
          if (!x.prompt.trim()) errs.push(`${at}: write the problem.`);
          const problem = drillError(x);
          if (problem) errs.push(`${at}: ${problem}`);
        }
      });
    }
  }

  // Language
  if (d.language !== undefined) {
    const g = d.language;
    if (!isObj(g) || !/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(String(g.code)) || !isStr(g.name) || g.name.length > LIMITS.title)
      errs.push("Language: give its code (like de or es-MX) and name.");
    else {
      if (g.tts !== undefined && !(isStr(g.tts) && g.tts.length <= 20)) errs.push("Language: bad voice code.");
      if (g.keys !== undefined && !strList(g.keys, 40, 4)) errs.push("Language: up to 40 typing keys of one character each.");
      if (g.level !== undefined && !(isStr(g.level) && g.level.length <= LIMITS.title)) errs.push("Language: level too long.");
    }
  }
  if (d.vocab !== undefined) {
    if (!Array.isArray(d.vocab) || d.vocab.length > LIMITS.vocab) errs.push(`At most ${LIMITS.vocab} vocabulary words.`);
    else {
      if (d.vocab.length && !d.language) errs.push("Vocabulary needs the language set (on the Vocabulary tab).");
      const seen = new Set<string>();
      d.vocab.forEach((v, i) => {
        const at = `Word ${i + 1}${v?.term ? ` (${v.term})` : ""}`;
        if (!v || !ID.test(v.id) || seen.has(v.id)) return void errs.push(`${at}: bad or repeated id.`);
        seen.add(v.id);
        if (!ids.has(v.lesson)) errs.push(`${at}: choose the lesson that teaches it.`);
        if (v.kind !== undefined && !["word", "phrase", "char"].includes(v.kind)) errs.push(`${at}: bad kind.`);
        if (!isStr(v.term) || v.term.length > LIMITS.title || !strList(v.meanings, 10, LIMITS.title) || (v.alt !== undefined && !strList(v.alt, 10, LIMITS.title)))
          errs.push(`${at}: too long.`);
        for (const k of ["reading", "pos", "plural", "example", "exampleEn", "note"] as const)
          if (v[k] !== undefined && !(isStr(v[k]) && v[k]!.length <= LIMITS.short)) errs.push(`${at}: ${k} too long.`);
        if (strict && (!v.term?.trim() || !v.meanings?.some((m) => m.trim()))) errs.push(`${at}: needs the word and at least one meaning.`);
      });
    }
  }
  if (d.readingList !== undefined) {
    if (!Array.isArray(d.readingList) || d.readingList.length > LIMITS.readingList) errs.push(`At most ${LIMITS.readingList} books in the reading list.`);
    else
      d.readingList.forEach((r, i) => {
        const at = `Reading list ${i + 1}`;
        if (!isStr(r?.title) || r.title.length > LIMITS.title || (strict && !r.title.trim())) errs.push(`${at}: needs a title.`);
        if (r?.url && !(isStr(r.url) && /^https?:\/\/\S+$/.test(r.url) && r.url.length <= LIMITS.short)) errs.push(`${at}: the link must start with https://.`);
        for (const k of ["author", "note"] as const) if (r?.[k] !== undefined && !(isStr(r[k]) && r[k]!.length <= LIMITS.short)) errs.push(`${at}: ${k} too long.`);
      });
  }
  return errs;
}

/** Image ids a document uses. */
export const imageIds = (d: CommunityDoc): string[] => [
  ...new Set([
    ...d.lessons.flatMap((l) => l.blocks.flatMap((b) => (b.type === "image" ? [b.imageId] : b.type === "question" && b.imageId ? [b.imageId] : []))),
    ...(d.modules ?? []).flatMap((m) => (m.quiz ?? []).flatMap((q) => (q.imageId ? [q.imageId] : []))),
  ]),
];

// ---------- to an app course ----------

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Community text is plain Markdown with no HTML: escape <, & and > outside math (math keeps
 * them: $x < 3$), drop code fences (figures and diagrams have their own blocks), and keep only
 * http(s) links. [[term]] links to the glossary.
 */
export function safeMd(md: string): string {
  return splitMath(md)
    .map((s) =>
      s.math
        ? s.display
          ? `\\[${s.text.replace(/\\\]/g, "")}\\]`
          : `\\(${s.text.replace(/\\\)/g, "")}\\)`
        : escHtml(s.text)
            .replace(/\$/g, "\\$")
            .replace(/^\s*(```|~~~).*$/gm, "")
            .replace(/\]\(\s*(?!https?:\/\/)[^)]*\)/g, "]()"),
    )
    .join("");
}

const oneLine = (s: string) => safeMd(s).replace(/\s*\n\s*/g, " ").trim();

export interface CommunityMeta {
  id: string;
  version: number;
  review: "reviewed" | "not_reviewed";
  author: string;
}

/** Preserve only documented interactive fences; ordinary prose still uses the community sanitizer.
 * The final lesson renderer sanitizes generated HTML independently.
 */
export function safeAdvancedSource(md: string): string {
  const allowed = /^(?:sounds|blend|trace|dialogue|speak|map|timeline|sim|code|assignment|example|manipulative|figure|plot|shape|mermaid)(?:\s|$)/;
  const fence = /^\`\`\`([^\n]*)\n([\s\S]*?)^\`\`\`[ \t]*$/gm;
  let result = "";
  let previous = 0;
  for (const match of md.matchAll(fence)) {
    const offset = match.index ?? 0;
    result += safeMd(md.slice(previous, offset));
    if (allowed.test(match[1].trim()) && !match[2].includes("\`\`\`")) result += match[0];
    else result += safeMd(match[0]);
    previous = offset + match[0].length;
  }
  return result + safeMd(md.slice(previous));
}

/** One block as lesson Markdown. */
function blockMd(b: Block, imageSrc: (id: string) => string): string {
  switch (b.type) {
    case "heading":
      return `${b.level === 3 ? "###" : "##"} ${oneLine(b.text)}`;
    case "source":
      return safeAdvancedSource(b.md);
    case "text":
      return safeMd(b.md);
    case "list":
      return b.items
        .filter((x) => x.trim())
        .map((x, i) => `${b.ordered ? `${i + 1}.` : "-"} ${oneLine(x)}`)
        .join("\n");
    case "image": {
      const alt = oneLine(b.alt).replace(/[[\]]/g, "");
      return `![${alt}](${imageSrc(b.imageId)})${b.caption.trim() ? `\n\n*${oneLine(b.caption)}*` : ""}`;
    }
    case "callout": {
      // The app colors a quote that starts with a bold label: Tip/Remember (tip), Warning/Note
      // (warning), anything else (a named rule).
      const label = oneLine(b.title) || (b.kind === "tip" ? "Tip" : b.kind === "warning" ? "Warning" : "Rule");
      const lead = b.kind === "tip" && !/^(exam tip|tip|strategy|remember|hint)\b/i.test(label) ? `Tip: ${label}` : b.kind === "warning" && !/^(warning|caution|watch out|careful|note)\b/i.test(label) ? `Warning: ${label}` : b.kind === "rule" && /^(exam tip|tip|strategy|remember|hint|warning|caution|watch out|careful|note)\b/i.test(label) ? `Rule: ${label}` : label;
      const body = safeMd(b.md).trim();
      return [`**${lead}**`, ...(body ? ["", ...body.split("\n")] : [])].map((x) => `> ${x}`.trimEnd()).join("\n");
    }
    case "example": {
      const title = oneLine(b.title);
      return `### Example${title ? `: ${title.replace(/^example\s*:?\s*/i, "")}` : ""}\n\n${safeMd(b.md)}`;
    }
    case "math":
      return b.tex.trim() ? `\\[${b.tex.replace(/\\\]/g, "").trim()}\\]` : "";
    case "figure": {
      if (!b.spec.trim()) return "";
      try {
        const f = readFigure(b.spec);
        if (b.caption.trim()) f.caption = b.caption.trim();
        return "```figure\n" + JSON.stringify(f) + "\n```";
      } catch {
        return "";
      }
    }
    case "diagram": {
      const body = diagramBody(b.code);
      if (!body || body.includes("```")) return "";
      const one = (s: string) => s.replace(/[\n{}]/g, " ").trim();
      return ["```mermaid", body.split("\n")[0], `  accTitle: ${one(b.title) || "Diagram"}`, `  accDescr: ${one(b.description) || one(b.title) || "Diagram"}`, ...body.split("\n").slice(1), "```"].join("\n");
    }
    case "manipulative": {
      // JSON can't hold a line break, so the block can't be closed early by its contents.
      const { spec } = readSpec(b.spec);
      return "```manipulative " + spec.kind + "\n" + JSON.stringify(spec) + "\n```";
    }
    case "question":
      return "";
  }
}

/**
 * Build an app course. `imageSrc` turns an image id into a URL or data URL (the app embeds
 * images when it installs a course, so it works offline).
 */
export function toCourse(d: CommunityDoc, meta: CommunityMeta, imageSrc: (id: string) => string): Record<string, unknown> {
  const title = d.title.trim();
  const modules = d.modules?.length ? d.modules : [{ id: "m1", title }];
  const moduleOf = (l: CLesson) => (l.module && modules.some((m) => m.id === l.module) ? l.module : modules[0].id);
  const honorsModule = (id: string) => !!modules.find((m) => m.id === id && "honors" in m && m.honors);
  const questions: Record<string, unknown>[] = [];
  const lessons = d.lessons.map((l) => {
    const quiz: string[] = [];
    const module = moduleOf(l);
    const honors = !!l.honors || honorsModule(module);
    const parts: string[] = [];
    for (const b of l.blocks) {
      if (b.type === "question") {
        const qid = `${l.id}-${b.id}`;
        quiz.push(qid);
        questions.push({ id: qid, topic: l.title.trim(), ...appQuestion(b, imageSrc), ...(honors ? { honors: true } : {}) });
      } else {
        const md = blockMd(b, imageSrc);
        if (md.trim()) parts.push(md);
      }
    }
    return {
      id: l.id,
      module,
      title: l.title.trim(),
      ...(l.honors ? { honors: true } : {}),
      topics: [l.title.trim()],
      ...(l.minutes ? { minutes: l.minutes } : {}),
      body: parts.join("\n\n"),
      quiz: quiz.length ? quiz : undefined,
      drills: l.drills?.length ? l.drills : undefined,
      refs: l.refs?.length ? l.refs : undefined,
    };
  });
  const appModules = modules.map((m) => {
    const quiz = ("quiz" in m ? (m.quiz ?? []) : []).map((q) => {
      const qid = `${m.id}-${q.id}`;
      questions.push({ id: qid, topic: m.title.trim(), ...appQuestion(q, imageSrc), ...(honorsModule(m.id) ? { honors: true } : {}) });
      return qid;
    });
    return { id: m.id, title: m.title.trim(), ...(honorsModule(m.id) ? { honors: true } : {}), ...(quiz.length ? { quiz } : {}) };
  });
  const core = questions.filter((q) => !q.honors).length || questions.length;
  const count = Math.max(1, Math.min(core, d.exam?.questionCount ?? 50));
  const glossary = (d.glossary ?? [])
    .filter((g) => g.term.trim() && g.definition.trim())
    .map((g) => ({ term: g.term.trim(), definition: safeMd(g.definition).trim(), ...(g.aliases?.length ? { aliases: g.aliases.map((a) => a.trim()).filter(Boolean) } : {}) }));
  const calculator = d.calculator ?? calculatorForSubject(d.subject);
  return {
    format: "examiner-course",
    version: 1,
    id: `community-${meta.id}`,
    title,
    description: d.description.trim(),
    author: meta.author,
    revision: meta.version,
    modules: appModules,
    lessons,
    banks: questions.length
      ? [
          {
            id: "main",
            title: `${title}: questions`,
            exam: {
              questionCount: count,
              timeLimitMinutes: d.exam?.minutes ?? Math.max(10, Math.round(count * 1.5)),
              passingPercent: d.exam?.passingPercent ?? 70,
            },
            sections: [],
            questions,
          },
        ]
      : [],
    decks: d.decks.map((k) => ({
      id: k.id,
      title: k.title.trim(),
      cards: k.cards.map((c) => ({ id: c.id, front: safeMd(c.front), back: safeMd(c.back), topic: k.title.trim() })),
    })),
    glossary,
    references: (d.references ?? []).map((r) => ({ id: r.id, title: r.title.trim(), body: safeMd(r.md) })),
    drills: (d.drills ?? []).map((x) => ({ ...x, prompt: safeMd(x.prompt), solution: safeMd(x.solution) })),
    ...(d.language ? { language: { code: d.language.code, name: d.language.name.trim(), ...(d.language.tts ? { tts: d.language.tts } : {}), ...(d.language.keys?.length ? { keys: d.language.keys } : {}), ...(d.language.level ? { level: d.language.level } : {}) } } : {}),
    ...(d.language && d.vocab?.length ? { vocab: d.vocab.filter((v) => v.term.trim() && v.meanings.some((m) => m.trim())).map((v) => ({ ...v, meanings: v.meanings.filter((m) => m.trim()) })) } : {}),
    ...(d.readingList?.length ? { readingList: d.readingList.filter((r) => r.title.trim()) } : {}),
    calculator,
    ...(d.readAloud === true ? { readAloud: true } : {}),
    community: meta,
  };
}

/** A draft saved with older labels, moved onto the current subject, level and type lists.
 * Values that were never valid are left alone, so checkDoc still refuses them. */
export function upgradeDoc(d: CommunityDoc): CommunityDoc {
  if (!d || typeof d !== "object") return d;
  const subject = typeof d.subject === "string" ? (knownSubject(d.subject) ?? d.subject) : d.subject;
  const level = typeof d.level === "string" ? (normalizeLevels([d.level])[0] ?? d.level) : d.level;
  const type = d.type ?? "Course";
  return subject === d.subject && level === d.level && type === d.type ? d : { ...d, subject, level, type };
}
