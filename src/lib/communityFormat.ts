import { validateImageAsset } from "./imageAssets";
import { markdownImageAssets, transformMarkdownImages } from "./markdownAssets";
import { validateMarkdownAssets } from "./lessonSource";
import { readerMarkdownImageAssets, transformReaderMarkdownImages, validateReaderMarkdownAssets } from "./readerMarkdownAssets";
import { canonicalAssetSources, transformCanonicalAssets } from "./canonicalAssets";
// Community courses: the block-only format people write on the website, its limits and checks
// (shared by the editor, the API worker and the app), and conversion to an app course.
// No DOM or Node APIs here: the worker bundles this file too.

import { LEVELS, SUBJECTS, TYPES, calculatorForSubject, knownSubject, normalizeLevels } from "./taxonomy";
import type { Drill, FigureSpec } from "./exerciseTypes";
import { drillError } from "./drills";
import { renderFigure } from "./figure";
import { splitMath } from "./mathSplit";
import { readSpec, targetProblems, type ManipSpec, type ManipTarget } from "./manip";
import { parseCourseBranchingScenarios, branchingCourseProblems, type CourseBranchingScenario } from "./branchingCoursePackage";
import { normalizeSpreadsheetAssignment, validateAssignment, type SpreadsheetAssignment } from "./spreadsheetAssignments";
import { courseWorkRevisionProblems, validateCourseWork, type CourseWork } from "./courseWork";
import { validateReaderTexts, normalizeValidatedReaderTexts, readerRevisionProblems, type ReaderText } from "./readerContent";
import { validateCanonicalAuthoring, demoteRuntimeCourse, runtimeCourseFromCanonicalAuthoring, canonicalRevisionProblems, type CanonicalAuthoringPayload } from "./canonicalAuthoring";
import type { Course } from "./courseContentTypes";
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
  | { type: "assignment"; kind: "writing" | "lab"; id: string }
  | { type: "assignment"; kind: "log" }
  | { type: "heading"; text: string; /** 2 = section (default), 3 = subsection. */ level?: 2 | 3 }
  | { type: "text"; md: string }
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

export interface CommunityDoc extends CourseWork {
  /** Authoritative full-course mode. Legacy authored mirrors must be absent. */
  canonical?: CanonicalAuthoringPayload;
  /** Canonical reader content; question links use installed first-bank IDs. */
  texts?: ReaderText[];
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
  /** Canonical, lesson-linked spreadsheet exercises; community publication is not official approval. */
  branchingScenarios?: CourseBranchingScenario[];
  spreadsheetAssignments?: Array<SpreadsheetAssignment & { lessonId: string }>;
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
  spreadsheetAssignments: 60,
  /** One complete spreadsheet assignment, including its starter and grading criteria. */
  spreadsheetAssignmentBytes: 128 * 1024,
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

/** Shared server/editor boundary. Drafts may omit exercises, but attached exercises
 * must be structurally valid so saving or installation cannot discard their data. */
export function checkCommunitySpreadsheetAssignments(value: unknown, lessonIds: ReadonlySet<string>): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return ["Spreadsheet assignments must be an array."];
  if (value.length > LIMITS.spreadsheetAssignments) return [`At most ${LIMITS.spreadsheetAssignments} spreadsheet assignments.`];
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [index, assignment] of value.entries()) {
    const at = `Spreadsheet assignment ${index + 1}`;
    // Test serializability before traversing nested author data. Worker inputs are
    // JSON, while the editor can also pass incomplete in-memory drafts here.
    try {
      const serialized = JSON.stringify(assignment);
      if (serialized === undefined || new TextEncoder().encode(serialized).byteLength > LIMITS.spreadsheetAssignmentBytes) {
        errors.push(`${at}: exceeds the ${LIMITS.spreadsheetAssignmentBytes} byte limit.`);
        continue;
      }
    } catch {
      errors.push(`${at}: must contain JSON data only.`);
      continue;
    }
    const problems = validateAssignment(assignment);
    errors.push(...problems.map(problem => `${at}: ${problem}.`));
    if (!isObj(assignment)) continue;
    if (typeof assignment.id === "string") {
      if (seen.has(assignment.id)) errors.push(`${at}: repeated assignment id.`);
      seen.add(assignment.id);
    }
    if (!isStr(assignment.lessonId) || !lessonIds.has(assignment.lessonId))
      errors.push(`${at}: its lesson doesn't exist.`);
    if (typeof assignment.title === "string" && assignment.title.length > LIMITS.title)
      errors.push(`${at}: keep the title under ${LIMITS.title} characters.`);
  }
  return errors;
}

/** Exactly the IDs emitted by toCourse into its first and only question bank. */
export function communityReaderQuestions(d: CommunityDoc): Array<{ id: string; stem: string }> {
  return [
    ...(Array.isArray(d.lessons) ? d.lessons : []).flatMap(lesson => (Array.isArray(lesson?.blocks) ? lesson.blocks : []).flatMap(block => block?.type === "question" ? [{ id: `${lesson.id}-${block.id}`, stem: block.stem }] : [])),
    ...(Array.isArray(d.modules) ? d.modules : []).flatMap(module => (Array.isArray(module?.quiz) ? module.quiz : []).map(question => ({ id: `${module.id}-${question?.id}`, stem: question?.stem }))),
  ];
}
/** The reader renders these fields as Markdown; use the same traversal at every boundary. */
function visitReaderMarkdown(texts: unknown, visit: (owner: Record<string, unknown>, key: string, kind?: string) => void): void {
  if (!Array.isArray(texts)) return;
  for (const text of texts) if (isObj(text)) {
    if (typeof text.about === "string") visit(text, "about");
    for (const [list, key] of [[text.sections, "body"]] as const)
      if (Array.isArray(list)) for (const item of list) if (isObj(item) && typeof item[key] === "string") visit(item, key, typeof text.kind === "string" ? text.kind : undefined);
  }
}
export function checkCommunityReaderTexts(d: CommunityDoc, strict: boolean, context: { communityImageOrigin?: string } = {}): string[] {
  const ids = communityReaderQuestions(d).map(q => q.id);
  const errors = validateReaderTexts(d.texts, { strict, questionIds: ids });
  visitReaderMarkdown(d.texts, (owner, key, kind) => errors.push(...(key === "body" ? validateReaderMarkdownAssets(owner[key] as string, { ...context, kind }) : validateMarkdownAssets(owner[key], context)).map(error => `Reading library ${key}: ${error}`)));
  if (d.texts?.length && new Set(ids).size !== ids.length) errors.push("Reading library: generated question IDs are ambiguous; rename conflicting lesson/module question IDs.");
  return errors;
}

/** Assignment directives are typed references, never arbitrary Markdown/source. */
export function checkCommunityAssignmentReferences(d: CommunityDoc): string[] {
  const errors: string[] = [];
  for (const lesson of Array.isArray(d.lessons) ? d.lessons : []) for (const block of Array.isArray(lesson?.blocks) ? lesson.blocks : []) {
    if (block?.type !== "assignment") continue;
    if (block.kind === "log") {
      if (!d.activityLog || Object.keys(block).some(key => !["type", "kind"].includes(key))) errors.push(`Lesson ${lesson.id}: invalid activity log reference.`);
    } else if (block.kind === "writing" || block.kind === "lab") {
      const resources = block.kind === "writing" ? d.writing : d.labs;
      if (typeof block.id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(block.id) || !Array.isArray(resources) || !resources.some(resource => resource?.id === block.id) || Object.keys(block).some(key => !["type", "kind", "id"].includes(key))) errors.push(`Lesson ${lesson.id}: invalid ${block.kind} reference.`);
    } else errors.push(`Lesson ${lesson.id}: unknown assignment kind.`);
  }
  return errors;
}
/** Match immutable publication identities, independent of draft/UI state. */
export function communityWorkRevisionProblems(previous: CommunityDoc, next: CommunityDoc, communityId?: string, communityImageOrigin?: string): string[] {
  if (previous.canonical) return next.canonical ? canonicalRevisionProblems(previous.canonical, next.canonical) : ["Canonical publications cannot downgrade to legacy blocks."];
  if (next.canonical) {
    if (!communityId) return ["A verified community identity is required for migration."];
    try { return canonicalRevisionProblems(migrateCommunityDocToCanonical(previous, communityId, id => `${communityImageOrigin ?? ""}/images/${id}`, communityImageOrigin).canonical!, next.canonical); }
    catch { return ["The previous publication could not be migrated losslessly."]; }
  }
  const errors = [...courseWorkRevisionProblems(previous, next), ...readerRevisionProblems(previous.texts ?? [], next.texts ?? [])];
  for (const lesson of previous.lessons) for (const block of lesson.blocks) {
    if (block.type !== "assignment") continue;
    const replacement = next.lessons.find(l => l.id === lesson.id)?.blocks.some(b => b.type === "assignment" && b.kind === block.kind && (b.kind === "log" || block.kind !== "log" && b.id === block.id));
    if (!replacement) errors.push(`Published lesson ${lesson.id}: assessed-work references cannot be removed or reassigned.`);
  }
  return errors;
}

/**
 * Problems that stop publishing (an empty list means it's fine). Drafts may be incomplete;
 * `strict` adds the checks for publishing (no empty lessons, questions answerable, etc.).
 */
export function checkDoc(raw: unknown, strict: boolean, context: { communityImageOrigin?: string } = {}): string[] {
  const errs: string[] = [];
  const d = raw as CommunityDoc;
  if (!d || typeof d !== "object" || d.format !== "erudior-community" || d.version !== 1) return ["Not a community course document."];
  try {
    if (new TextEncoder().encode(JSON.stringify(d)).byteLength > LIMITS.docBytes)
      return ["The course is too large. Split it into two courses."];
  } catch {
    return ["The course must contain JSON data only."];
  }
  if (!isStr(d.title) || !d.title.trim()) errs.push("Give the course a title.");
  else if (d.title.length > LIMITS.title) errs.push(`Keep the title under ${LIMITS.title} characters.`);
  if (!isStr(d.description) || d.description.length > LIMITS.description) errs.push(`Keep the description under ${LIMITS.description} characters.`);
  if (strict && !d.description?.trim()) errs.push("Add a short description.");
  if (!SUBJECTS.includes(d.subject as (typeof SUBJECTS)[number])) errs.push("Choose a subject.");
  if (!LEVELS.includes(d.level as (typeof LEVELS)[number])) errs.push("Choose a level.");
  if (d.type !== undefined && !TYPES.includes(d.type as (typeof TYPES)[number])) errs.push("Choose a type.");
  if (d.canonical !== undefined) {
    const allowed = new Set(["format", "version", "title", "description", "subject", "level", "type", "lessons", "decks", "canonical"]);
    for (const key of Object.keys(d)) if (!allowed.has(key)) errs.push(`Canonical mode cannot contain legacy or unknown field ${key}.`);
    if (!Array.isArray(d.lessons) || d.lessons.length || !Array.isArray(d.decks) || d.decks.length) errs.push("Canonical mode requires empty legacy lessons and decks.");
    errs.push(...validateCanonicalAuthoring(d.canonical, { strict, maxBytes: LIMITS.docBytes, ...context }));
    if (d.canonical?.course?.title !== d.title) errs.push("Listing title must match the canonical course title.");
    return errs;
  }
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
    if (strict && !l.blocks.some((b) => b.type !== "question" && !(b.type === "text" && !b.md.trim())) && !(Array.isArray(d.branchingScenarios) && d.branchingScenarios.some(s=>s && s.lessonId===l.id))) errs.push(`${where}: has no content.`);
    l.blocks.forEach((b, j) => {
      const at = `${where}, block ${j + 1}`;
      switch (b?.type) {
        case "assignment":
          break;
        case "heading":
          if (!isStr(b.text) || b.text.length > LIMITS.short) errs.push(`${at}: heading too long.`);
          if (b.level !== undefined && b.level !== 2 && b.level !== 3) errs.push(`${at}: bad heading size.`);
          if (strict && !b.text.trim()) errs.push(`${at}: empty heading.`);
          break;
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
  errs.push(...checkCommunityReaderTexts(d, strict, context));
  errs.push(...checkCommunityAssignmentReferences(d));
  errs.push(...validateCourseWork(d, { strict, moduleIds: [...mids] }));
  errs.push(...branchingCourseProblems(d.branchingScenarios, ids));
  errs.push(...checkCommunitySpreadsheetAssignments(d.spreadsheetAssignments, ids));
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
function communityImageId(source:string, origin?:string):string|undefined {
  try { const base=new URL(origin || "https://community.invalid"), url=new URL(source);
    if(url.protocol!=="https:"||url.origin!==base.origin||url.username||url.password||url.search||url.hash)return;
    const route=/^\/images\/([A-Za-z0-9_-]+)$/.exec(url.pathname);return route?.[1];
  }catch{return;}
}
function canonicalImageIds(doc:CommunityDoc, communityOrigin?:string):string[]{
  return doc.canonical?[...new Set(canonicalAssetSources(doc.canonical.course).flatMap(src=>{const id=communityImageId(src,communityOrigin);return id?[id]:[];}))]:[];
}
function readerImageIds(d: CommunityDoc, communityOrigin?: string): string[] {
  const ids = new Set<string>();
  visitReaderMarkdown(d.texts, (owner, key, kind) => {
    const parsed = (key === "body" ? readerMarkdownImageAssets(owner[key] as string, kind) : markdownImageAssets(owner[key] as string));
    if (parsed.errors.length) throw Error(parsed.errors.join("; "));
    for (const asset of parsed.assets) { const id = communityImageId(asset.src, communityOrigin); if (id) ids.add(id); }
  });
  return [...ids];
}
export const imageIds = (d: CommunityDoc, communityOrigin?: string): string[] => [
  ...readerImageIds(d, communityOrigin),
  ...canonicalImageIds(d, communityOrigin),
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

/** One block as lesson Markdown. */
function blockMd(b: Block, imageSrc: (id: string) => string): string {
  switch (b.type) {
    case "assignment":
      return "```assignment\n" + (b.kind === "log" ? "log" : `${b.kind}: ${b.id}`) + "\n```";
    case "heading":
      return `${b.level === 3 ? "###" : "##"} ${oneLine(b.text)}`;
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
export function toCourse(d: CommunityDoc, meta: CommunityMeta, imageSrc: (id: string) => string, communityOrigin?: string): Record<string, unknown> {
  return convertCommunityCourse(d, meta, imageSrc, communityOrigin, false);
}
/** Migration retains validated source URLs; only installation embeds remote media. */
function convertCommunityCourse(d: CommunityDoc, meta: CommunityMeta, imageSrc: (id: string) => string, communityOrigin: string | undefined, preserveSourceMedia: boolean): Record<string, unknown> {
  if (d.canonical === undefined) parseCourseBranchingScenarios(d.branchingScenarios,new Set(d.lessons.map(l=>l.id)));
  if (d.canonical !== undefined) {
    const errors = checkDoc(d, true, { communityImageOrigin: communityOrigin });
    if (errors.length) throw Error(errors.join("; "));
    const runtime = runtimeCourseFromCanonicalAuthoring(d.canonical, { id: `community-${meta.id}`, revision: meta.version, community: meta }, { communityImageOrigin: communityOrigin });
    // Installation-only offline embedding. The immutable authored payload is never changed.
    if (communityOrigin !== undefined) {
      return transformCanonicalAssets(runtime, source => {
        const id=communityImageId(source,communityOrigin);if(!id)return source;
        const embedded=imageSrc(id);if(!embedded)throw Error("A required community image could not be embedded.");const errors=validateImageAsset(embedded);if(errors.length)throw Error("A downloaded community image is invalid: "+errors.join("; "));return embedded;
      }) as unknown as Record<string,unknown>;
    }
    return runtime as unknown as Record<string, unknown>;
  }
  const readerProblems = checkCommunityReaderTexts(d, true, { communityImageOrigin: communityOrigin });
  if (readerProblems.length) throw new Error("Cannot install reading library: " + readerProblems.join("; "));
  const texts = d.texts === undefined ? undefined : normalizeValidatedReaderTexts(d.texts, { questionIds: communityReaderQuestions(d).map(q => q.id) });
  // Normalize clones the immutable published reader data; only the installed copy is embedded.
  let readerBytes = new TextEncoder().encode(JSON.stringify(texts ?? [])).length;
  visitReaderMarkdown(texts, (owner, key, kind) => {
    owner[key] = (key === "body" ? transformReaderMarkdownImages : transformMarkdownImages)(owner[key] as string, source => {
      const id = communityImageId(source, communityOrigin);
      if (!id || preserveSourceMedia) return source;
      const embedded = imageSrc(id);
      if (!embedded) throw Error("A required community reader image could not be embedded.");
      const errors = validateImageAsset(embedded);
      if (errors.length) throw Error("A downloaded community reader image is invalid: " + errors.join("; "));
      return embedded;
    }, (previous, next) => {
      readerBytes += new TextEncoder().encode(JSON.stringify(next)).length - new TextEncoder().encode(JSON.stringify(previous)).length;
      if (readerBytes > 32 * 1024 * 1024) throw Error("Reader asset expansion exceeds total byte limit");
    }, kind);
  });
  const workProblems = [...validateCourseWork(d, { moduleIds: d.modules?.map(m => m.id) ?? [] }), ...checkCommunityAssignmentReferences(d)];
  if (workProblems.length) throw new Error("Cannot install assessed work: " + workProblems.join("; "));
  const work = Object.fromEntries((["rubrics", "writing", "labs", "activityLog"] as const).filter(key => d[key] !== undefined).map(key => [key, structuredClone(d[key])]));
  const spreadsheetProblems = checkCommunitySpreadsheetAssignments(d.spreadsheetAssignments,
    new Set(d.lessons.filter(lesson => lesson && typeof lesson.id === "string").map(lesson => lesson.id)));
  if (spreadsheetProblems.length) throw new Error("Cannot install spreadsheet assignments: " + spreadsheetProblems.join("; "));
  const spreadsheetAssignments = d.spreadsheetAssignments?.map(assignment => ({
    ...normalizeSpreadsheetAssignment(assignment), lessonId: assignment.lessonId,
  }));
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
    ...(d.branchingScenarios === undefined ? {} : { branchingScenarios: parseCourseBranchingScenarios(d.branchingScenarios,new Set(d.lessons.map(l=>l.id))) }),
    ...(spreadsheetAssignments ? { spreadsheetAssignments } : {}),
    ...work,
    ...(texts === undefined ? {} : { texts }),
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

/** Explicit migration; the immutable old release remains intact. No reverse block conversion. */
export function migrateCommunityDocToCanonical(doc: CommunityDoc, communityId: string, imageSrc: (id: string) => string = id => `/images/${id}`, communityImageOrigin?: string): CommunityDoc {
  const errors = checkDoc(doc, true, { communityImageOrigin });
  if (errors.length) throw Error(errors.join("; "));
  if (doc.canonical) return structuredClone(doc);
  const runtime = convertCommunityCourse(doc, { id: communityId, version: 1, review: "not_reviewed", author: "" }, imageSrc, communityImageOrigin, true) as unknown as Course;
  // Legacy conversion creates bank data, not complete portable bank envelopes.
  // These are documented generated markers, never inferred publication authority.
  runtime.banks = runtime.banks.map(bank => ({ ...bank, format: "examiner-bank", version: 1 }));
  const { payload } = demoteRuntimeCourse(runtime, { communityImageOrigin });
  return { format: "erudior-community", version: 1, title: payload.course.title, description: doc.description, subject: doc.subject, level: doc.level, type: doc.type ?? "Course", lessons: [], decks: [], canonical: payload };
}
