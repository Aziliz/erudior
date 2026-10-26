// Student work that a parent or teacher reviews: writing assignments graded with rubrics,
// guided at-home science labs, and activity logs (PE, art, music practice).
//
// Course side (course JSON): `rubrics`, `writing`, `labs` and `activityLog`; lessons link to
// them with an ```assignment block. Student side: `Progress.work` (drafts, lab data, photos,
// self-checks, submissions) and `Progress.logs` (activity entries); both travel in classroom
// hand-ins. Reviewer side: `Records.reviews` (rubric levels, comments, scores); a final review
// with a score also writes a ParentGrade, which is how it reaches the course grade.
// Photos and uploaded files live in the documents store (documents.ts), not in progress.json,
// so progress stays small; only their ids are kept here.

import type { Course, Progress } from "./types";
import type { ParentGrade } from "./grades";
import type { Records } from "./records";
import { addDays, today } from "./srs";
import { uid } from "./util";

// ---------- course format ----------

export interface RubricLevel {
  points: number;
  /** Short name, e.g. "Excellent", "Getting there". */
  label: string;
  /** What work at this level looks like. */
  description?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  /** Highest points first. */
  levels: RubricLevel[];
}

export interface Rubric {
  id: string;
  title?: string;
  criteria: RubricCriterion[];
}

export interface WritingTask {
  id: string;
  title: string;
  module?: string;
  /** "short": a short response (a few sentences); "essay": a longer piece with formatting. */
  kind: "essay" | "short";
  /** Markdown, shown above the editor. */
  prompt: string;
  /** Length target in words. */
  words?: { min?: number; max?: number };
  /** Rubric id (in course.rubrics). An inline rubric object becomes `${id}-rubric`. */
  rubric?: string;
  /** Offer the student a self-check against the rubric before handing in (default on with a rubric). */
  selfCheck?: boolean;
  minutes?: number;
}

export interface LabStep {
  text: string;
  /** An adult does (or closely watches) this step. */
  adult?: boolean;
}

export interface LabTable {
  id: string;
  title?: string;
  columns: string[];
  /** Starting number of rows (students can add more). */
  rows: number;
  /** Fixed labels for the first column, one per row (e.g. "0 min", "2 min"). */
  rowLabels?: string[];
}

export interface LabQuestion {
  id: string;
  prompt: string;
  /** "observation": what you saw; "conclusion": what it means. */
  kind: "observation" | "conclusion";
}

export interface Lab {
  id: string;
  title: string;
  module?: string;
  minutes?: number;
  /** Markdown: what the lab is about, the question it answers. */
  intro?: string;
  /** An adult must be there for the whole lab. */
  adult: boolean;
  /** Safety notes, shown first and prominently. */
  safety: string[];
  materials: string[];
  steps: LabStep[];
  tables: LabTable[];
  questions: LabQuestion[];
  /** Ask for photos (the text is the prompt, e.g. "Take a photo of your setup"). */
  photos?: string;
  rubric?: string;
  selfCheck?: boolean;
}

export interface ActivityLogSpec {
  title: string;
  /** Kinds of activity offered, e.g. ["Running", "Soccer", "Yoga"]. "Other" is always added. */
  types: string[];
  /** Weekly target in minutes. */
  weeklyMinutes?: number;
  /** Weekly target in active days. */
  weeklyDays?: number;
  /** Markdown shown above the log. */
  prompt?: string;
  /** Allow a photo or file (drawing, recording) with each entry. Default true. */
  uploads: boolean;
}

/** The parts of a course that hold student work. */
export interface CourseWork {
  rubrics?: Rubric[];
  writing?: WritingTask[];
  labs?: Lab[];
  activityLog?: ActivityLogSpec;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const strs = (v: unknown) => arr(v).map(str).filter(Boolean);
const idOf = (v: unknown, fallback: string) => (/^[A-Za-z0-9_-]{1,100}$/.test(str(v)) ? str(v) : fallback);
const pos = (v: unknown) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.round(Number(v)) : undefined);

function normRubric(r: Record<string, unknown>, id: string): Rubric {
  return {
    id,
    ...(str(r.title) ? { title: str(r.title) } : {}),
    criteria: arr(r.criteria)
      .filter(isObj)
      .map((c, i) => ({
        id: idOf(c.id, `c${i + 1}`),
        name: str(c.name) || str(c.title) || `Criterion ${i + 1}`,
        ...(str(c.description) ? { description: str(c.description) } : {}),
        levels: arr(c.levels)
          .filter(isObj)
          .map((l) => ({ points: Number(l.points), label: str(l.label), ...(str(l.description) ? { description: str(l.description) } : {}) }))
          .filter((l) => Number.isFinite(l.points) && l.points >= 0)
          .sort((a, b) => b.points - a.points),
      })),
  };
}

/** Read the student-work parts of a raw course object (used by normalizeCourse). */
export function normalizeWork(raw: Record<string, unknown>): CourseWork {
  const rubrics: Rubric[] = arr(raw.rubrics)
    .filter(isObj)
    .map((r, i) => normRubric(r, idOf(r.id, `rubric${i + 1}`)));
  const rubricRef = (v: unknown, ownerId: string): string | undefined => {
    if (isObj(v)) {
      const id = idOf(v.id, `${ownerId}-rubric`);
      if (!rubrics.some((r) => r.id === id)) rubrics.push(normRubric(v, id));
      return id;
    }
    return str(v) || undefined;
  };
  const selfCheck = (v: unknown) => (v === false ? { selfCheck: false } : {});
  const writing: WritingTask[] = arr(raw.writing)
    .filter(isObj)
    .map((w, i) => {
      const id = idOf(w.id, `w${i + 1}`);
      const min = pos(isObj(w.words) ? w.words.min : undefined);
      const max = pos(isObj(w.words) ? w.words.max : undefined);
      const rubric = rubricRef(w.rubric, id);
      return {
        id,
        title: str(w.title) || `Writing ${i + 1}`,
        ...(str(w.module) ? { module: str(w.module) } : {}),
        kind: w.kind === "short" ? "short" : "essay",
        prompt: str(w.prompt),
        ...(min || max ? { words: { ...(min ? { min } : {}), ...(max ? { max } : {}) } } : {}),
        ...(rubric ? { rubric } : {}),
        ...selfCheck(w.selfCheck),
        ...(pos(w.minutes) ? { minutes: pos(w.minutes) } : {}),
      };
    });
  const labs: Lab[] = arr(raw.labs)
    .filter(isObj)
    .map((l, i) => {
      const id = idOf(l.id, `lab${i + 1}`);
      const rubric = rubricRef(l.rubric, id);
      return {
        id,
        title: str(l.title) || `Lab ${i + 1}`,
        ...(str(l.module) ? { module: str(l.module) } : {}),
        ...(pos(l.minutes) ? { minutes: pos(l.minutes) } : {}),
        ...(str(l.intro) ? { intro: str(l.intro) } : {}),
        adult: l.adult === true || l.supervision === "adult",
        safety: strs(l.safety),
        materials: strs(l.materials),
        steps: arr(l.steps)
          .map((s): LabStep | null => (typeof s === "string" ? { text: s.trim() } : isObj(s) ? { text: str(s.text), ...(s.adult === true ? { adult: true } : {}) } : null))
          .filter((s): s is LabStep => !!s && !!s.text),
        tables: arr(l.tables)
          .filter(isObj)
          .map((t, j) => {
            const rowLabels = strs(t.rowLabels);
            return {
              id: idOf(t.id, `t${j + 1}`),
              ...(str(t.title) ? { title: str(t.title) } : {}),
              columns: strs(t.columns),
              rows: Math.min(50, pos(t.rows) ?? (rowLabels.length || 3)),
              ...(rowLabels.length ? { rowLabels } : {}),
            };
          }),
        questions: arr(l.questions)
          .filter(isObj)
          .map((q, j) => ({ id: idOf(q.id, `q${j + 1}`), prompt: str(q.prompt), kind: q.kind === "conclusion" ? "conclusion" : "observation" }) as LabQuestion),
        ...(l.photos === true ? { photos: "Add photos of your setup and results." } : str(l.photos) ? { photos: str(l.photos) } : {}),
        ...(rubric ? { rubric } : {}),
        ...selfCheck(l.selfCheck),
      };
    });
  const a = isObj(raw.activityLog) ? raw.activityLog : undefined;
  const activityLog: ActivityLogSpec | undefined = a && {
    title: str(a.title) || "Activity log",
    types: strs(a.types),
    ...(pos(a.weeklyMinutes) ? { weeklyMinutes: pos(a.weeklyMinutes) } : {}),
    ...(pos(a.weeklyDays) ? { weeklyDays: Math.min(7, pos(a.weeklyDays)!) } : {}),
    ...(str(a.prompt) ? { prompt: str(a.prompt) } : {}),
    uploads: a.uploads !== false,
  };
  return {
    ...(rubrics.length ? { rubrics } : {}),
    ...(writing.length ? { writing } : {}),
    ...(labs.length ? { labs } : {}),
    ...(activityLog ? { activityLog } : {}),
  };
}

export const hasWork = (c: CourseWork) => !!(c.writing?.length || c.labs?.length || c.activityLog);
export const rubricOf = (c: CourseWork, id?: string) => (id ? c.rubrics?.find((r) => r.id === id) : undefined);

export type WorkItem = { kind: "writing"; item: WritingTask } | { kind: "lab"; item: Lab };

export function findWork(c: CourseWork, id: string): WorkItem | undefined {
  const w = c.writing?.find((x) => x.id === id);
  if (w) return { kind: "writing", item: w };
  const l = c.labs?.find((x) => x.id === id);
  return l ? { kind: "lab", item: l } : undefined;
}

/** Self-check is on by default whenever there's a rubric. */
export const offersSelfCheck = (c: CourseWork, item: WritingTask | Lab) => !!rubricOf(c, item.rubric) && item.selfCheck !== false;

/** "Aim for 150–250 words" and friends. */
export function wordTarget(w?: { min?: number; max?: number }): string {
  if (!w) return "";
  if (w.min && w.max) return `Aim for ${w.min}–${w.max} words.`;
  if (w.min) return `Write at least ${w.min} words.`;
  if (w.max) return `Keep it to ${w.max} words or fewer.`;
  return "";
}

// ---------- assignment blocks in lessons ----------
//
//   ```assignment
//   writing: persuasive-paragraph
//   lab: melting-ice
//   log
//   ```

export type BlockLink = { kind: "writing" | "lab"; id: string } | { kind: "log" };

export const ASSIGN_BLOCK = /^```assignment[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gm;

export function parseAssignBlock(body: string): { links: BlockLink[]; problems: string[] } {
  const links: BlockLink[] = [];
  const problems: string[] = [];
  for (const raw of body.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^(writing|lab)\s*:\s*([A-Za-z0-9_-]+)\s*$/i.exec(line);
    if (m) links.push({ kind: m[1].toLowerCase() as "writing" | "lab", id: m[2] });
    else if (/^(activity\s+)?log\s*:?\s*$/i.test(line)) links.push({ kind: "log" });
    else problems.push(`can't read "${line.slice(0, 50)}" (use writing: <id>, lab: <id> or log)`);
  }
  if (!links.length && !problems.length) problems.push("empty assignment block");
  return { links, problems };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const KICKER = { writing: "Writing assignment", lab: "Science lab", log: "Activity log" } as const;

/** What the lesson card shows for one link (title, one line of detail, status), from the course. */
export interface LinkInfo {
  title: string;
  /** Replaces the default kind label (e.g. "Short response"). */
  kicker?: string;
  detail?: string;
  status?: string;
  /** Adult supervision flag for labs. */
  adult?: boolean;
}

/** The cards for one block. Without `info` (or for an unknown id) the card names only the kind. */
export function renderAssignBlock(links: BlockLink[], info?: (l: BlockLink) => LinkInfo | undefined): string {
  const cards = links.map((l) => {
    const i = info?.(l);
    const target = l.kind === "log" ? "log:" : `${l.kind}:${l.id}`;
    const title = i?.title ?? (l.kind === "log" ? "Activity log" : l.id);
    return (
      `<div class="assign-card" data-kind="${l.kind}">` +
      `<p class="assign-kicker">${esc(i?.kicker ?? KICKER[l.kind])}${i?.adult ? ` <span class="assign-adult">Adult needed</span>` : ""}</p>` +
      `<p class="assign-title">${esc(title)}</p>` +
      (i?.detail ? `<p class="assign-detail">${esc(i.detail)}</p>` : "") +
      `<div class="assign-foot">` +
      (i?.status ? `<span class="assign-status">${esc(i.status)}</span>` : "") +
      `<button type="button" class="btn sm primary assign-open" data-assign="${esc(target)}" aria-label="Open ${esc(KICKER[l.kind].toLowerCase())}: ${esc(title)}">Open</button>` +
      `</div></div>`
    );
  });
  return `<div class="assign-links">${cards.join("")}</div>`;
}

/**
 * Swap assignment blocks for placeholders before Markdown runs; `restore` puts the cards back
 * after sanitizing (the card HTML is built here from escaped text).
 */
export function protectAssignments(src: string, info?: (l: BlockLink) => LinkInfo | undefined): { text: string; restore: (html: string) => string } {
  if (!src.includes("```assignment")) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const text = src.replace(ASSIGN_BLOCK, (_w, body: string) => {
    out.push(renderAssignBlock(parseAssignBlock(body).links, info));
    return `\n\nXASSIGNX${out.length - 1}XASSIGNX\n\n`;
  });
  return {
    text,
    restore: (html) => html.replace(/<p>XASSIGNX(\d+)XASSIGNX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XASSIGNX(\d+)XASSIGNX/g, (_m, n) => out[Number(n)]),
  };
}

/** The link a clicked "Open" button points at, or null. */
export function assignTarget(target: Element): BlockLink | null {
  const btn = target.closest<HTMLElement>("button.assign-open");
  const v = btn?.dataset.assign;
  if (!v) return null;
  const [kind, id] = v.split(":");
  if (kind === "log") return { kind: "log" };
  return kind === "writing" || kind === "lab" ? { kind, id } : null;
}

// ---------- authoring checks ----------

/** Problems in a course's student-work parts and its assignment blocks (for the course checker). */
export function workProblems(c: CourseWork & Pick<Course, "lessons" | "modules">): string[] {
  const out: string[] = [];
  const ids = new Set<string>();
  const moduleIds = new Set(c.modules.map((m) => m.id));
  for (const r of c.rubrics ?? []) {
    if (!r.criteria.length) out.push(`rubric ${r.id}: no criteria`);
    const cids = new Set<string>();
    for (const k of r.criteria) {
      if (cids.has(k.id)) out.push(`rubric ${r.id}: criterion id ${k.id} is used twice`);
      cids.add(k.id);
      if (k.levels.length < 2) out.push(`rubric ${r.id} criterion ${k.id}: needs at least two levels`);
      if (k.levels.some((l) => !l.label)) out.push(`rubric ${r.id} criterion ${k.id}: a level has no label`);
      if (new Set(k.levels.map((l) => l.points)).size !== k.levels.length) out.push(`rubric ${r.id} criterion ${k.id}: two levels have the same points`);
    }
  }
  const common = (what: string, x: { id: string; module?: string; rubric?: string }) => {
    if (ids.has(x.id)) out.push(`${what} ${x.id}: id is used by another writing assignment or lab`);
    ids.add(x.id);
    if (x.module && !moduleIds.has(x.module)) out.push(`${what} ${x.id}: module ${x.module} doesn't exist`);
    if (x.rubric && !rubricOf(c, x.rubric)) out.push(`${what} ${x.id}: rubric ${x.rubric} doesn't exist`);
  };
  for (const w of c.writing ?? []) {
    common("writing", w);
    if (!w.prompt) out.push(`writing ${w.id}: no prompt`);
    if (w.words?.min && w.words.max && w.words.min > w.words.max) out.push(`writing ${w.id}: words.min is more than words.max`);
  }
  for (const l of c.labs ?? []) {
    common("lab", l);
    if (!l.steps.length) out.push(`lab ${l.id}: no steps`);
    if (!l.materials.length) out.push(`lab ${l.id}: no materials`);
    if (!l.safety.length) out.push(`lab ${l.id}: no safety notes (every lab needs at least one, even "No special safety needs")`);
    if (!l.adult && l.steps.some((s) => s.adult)) out.push(`lab ${l.id}: has adult steps but isn't marked adult: true`);
    const tids = new Set<string>();
    for (const t of l.tables) {
      if (tids.has(t.id)) out.push(`lab ${l.id}: table id ${t.id} is used twice`);
      tids.add(t.id);
      if (!t.columns.length) out.push(`lab ${l.id} table ${t.id}: no columns`);
      if (t.rowLabels && t.rowLabels.length > t.rows) out.push(`lab ${l.id} table ${t.id}: more row labels than rows`);
    }
    const qids = new Set<string>();
    for (const q of l.questions) {
      if (qids.has(q.id)) out.push(`lab ${l.id}: question id ${q.id} is used twice`);
      qids.add(q.id);
      if (!q.prompt) out.push(`lab ${l.id} question ${q.id}: no prompt`);
    }
    if (!l.tables.length && !l.questions.length) out.push(`lab ${l.id}: no data tables or questions (nothing for the student to record)`);
  }
  const a = c.activityLog;
  if (a && !a.types.length) out.push("activityLog: no types");
  for (const l of c.lessons)
    for (const m of l.body.matchAll(ASSIGN_BLOCK)) {
      const { links, problems } = parseAssignBlock(m[1]);
      for (const p of problems) out.push(`lesson ${l.id}: assignment block: ${p}`);
      for (const k of links) {
        if (k.kind === "log" && !a) out.push(`lesson ${l.id}: assignment block links the activity log, but the course has no activityLog`);
        if (k.kind === "writing" && !c.writing?.some((w) => w.id === k.id)) out.push(`lesson ${l.id}: writing ${k.id} doesn't exist`);
        if (k.kind === "lab" && !c.labs?.some((w) => w.id === k.id)) out.push(`lesson ${l.id}: lab ${k.id} doesn't exist`);
      }
    }
  for (const l of c.lessons) {
    const opened = (l.body.match(/^```assignment\b/gm) ?? []).length;
    if (opened > [...l.body.matchAll(ASSIGN_BLOCK)].length) out.push(`lesson ${l.id}: an \`\`\`assignment block is never closed, or has text after "assignment"`);
  }
  return out;
}

// ---------- student side ----------

export interface WorkFile {
  id: string;
  /** In the documents store (documents.ts). */
  fileId: string;
  name: string;
  mime: string;
  bytes: number;
  caption: string;
  /** YYYY-MM-DD */
  date: string;
}

export interface WorkRecord {
  kind: "writing" | "lab";
  /** ISO times. */
  started: string;
  updated: string;
  /** Writing: the text (paragraphs, **bold**, *italic*, "- " lists). */
  text?: string;
  /** Lab: materials gathered and steps done (indices). */
  have?: number[];
  done?: number[];
  /** Lab: table id → rows of cells. */
  tables?: Record<string, string[][]>;
  /** Lab: question id → answer. */
  answers?: Record<string, string>;
  photos?: WorkFile[];
  /** Self-check: criterion id → points the student chose. */
  self?: Record<string, number>;
  /** ISO time of the latest hand-in (absent while it's a draft). */
  submitted?: string;
  /** How many times it was handed in. */
  rounds?: number;
}

export interface LogEntry {
  id: string;
  courseId: string;
  /** YYYY-MM-DD */
  date: string;
  type: string;
  minutes: number;
  note: string;
  file?: WorkFile;
  /** Homeschool: the student whose school hours these minutes were added to (so deleting takes them back). */
  credited?: string;
}

export interface WorkReview {
  /** ISO time. */
  at: string;
  /** "Parent" or "Teacher". */
  by: string;
  /** The submission this review is for (WorkRecord.submitted). */
  forSubmitted: string;
  /** Criterion id → points chosen. */
  levels: Record<string, number>;
  notes?: Record<string, string>;
  comment: string;
  points?: number;
  outOf?: number;
  percent?: number;
  /** Sent back for another draft (doesn't count as a grade). */
  revise?: boolean;
}

export const workKey = (courseId: string, itemId: string) => `${courseId}/${itemId}`;

export type WorkStatus = "new" | "draft" | "submitted" | "revise" | "reviewed";

/** The latest review of the current submission, if there is one. */
export function currentReview(w: WorkRecord | undefined, reviews: WorkReview[] | undefined): WorkReview | undefined {
  if (!w?.submitted) {
    // A sent-back draft the student is revising: its last review is still the feedback to read.
    const last = reviews?.[reviews.length - 1];
    return last?.revise ? last : undefined;
  }
  return [...(reviews ?? [])].reverse().find((r) => r.forSubmitted === w.submitted);
}

export function workStatus(w: WorkRecord | undefined, reviews?: WorkReview[]): WorkStatus {
  if (!w) return "new";
  const r = currentReview(w, reviews);
  if (!w.submitted) return r?.revise ? "revise" : "draft";
  if (!r) return "submitted";
  return r.revise ? "revise" : "reviewed";
}

/** Can the student change it? Drafts and work sent back for another draft. */
export const editable = (s: WorkStatus) => s === "new" || s === "draft" || s === "revise";

export function statusLabel(s: WorkStatus, adult: string | null): string {
  switch (s) {
    case "new":
      return "Not started";
    case "draft":
      return "Draft";
    case "submitted":
      return adult ? `Handed in, waiting for your ${adult.toLowerCase()}` : "Finished";
    case "revise":
      return "Needs another draft";
    case "reviewed":
      return "Graded";
  }
}

export function touchWork(p: Progress, key: string, kind: WorkRecord["kind"], fn: (w: WorkRecord) => WorkRecord): Progress {
  const now = new Date().toISOString();
  const cur = p.work?.[key] ?? { kind, started: now, updated: now };
  return { ...p, work: { ...(p.work ?? {}), [key]: { ...fn(cur), updated: now } } };
}

export function submitWork(w: WorkRecord, now = new Date().toISOString()): WorkRecord {
  return { ...w, submitted: now, rounds: (w.rounds ?? 0) + 1 };
}

/** Take back a hand-in that hasn't been reviewed yet, or start the next draft after "revise". */
export function reopenWork(w: WorkRecord): WorkRecord {
  const { submitted: _s, ...rest } = w;
  return rest;
}

// ---------- student text ----------

/** Words in the student's text (formatting marks don't count). */
export function wordCount(text: string): number {
  const plain = text.replace(/[*_#>`]+/g, " ").replace(/^\s*[-•]\s+/gm, " ");
  return (plain.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
}

const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*(?=\S)([^*]*?\S)\*(?![*\w])/g, "$1<em>$2</em>")
    .replace(/(^|[^_\w])_(?=\S)([^_]*?\S)_(?![_\w])/g, "$1<em>$2</em>");

/**
 * The student's text as HTML: paragraphs (blank line between), **bold**, *italic*, "- " lists
 * and "# " headings. Everything else is escaped, so this is safe without a sanitizer and looks
 * the same in the editor preview, the review screen and the printed portfolio.
 */
export function studentHtml(text: string): string {
  const out: string[] = [];
  for (const block of text.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    const lines = block.split("\n").filter((l) => l.trim());
    if (!lines.length) continue;
    if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
      out.push(`<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-•*]\s+/, ""))}</li>`).join("")}</ul>`);
      continue;
    }
    const h = /^#{1,3}\s+(.*)$/.exec(lines[0]);
    if (h && lines.length === 1) {
      out.push(`<h3>${inline(h[1])}</h3>`);
      continue;
    }
    out.push(`<p>${lines.map(inline).join("<br>")}</p>`);
  }
  return out.join("");
}

// ---------- rubric scores ----------

export interface Score {
  points: number;
  outOf: number;
  percent: number;
  /** Every criterion has a level. */
  complete: boolean;
}

export function rubricScore(r: Rubric, levels: Record<string, number>): Score {
  let points = 0;
  let outOf = 0;
  let complete = true;
  for (const c of r.criteria) {
    const max = Math.max(0, ...c.levels.map((l) => l.points));
    outOf += max;
    const v = levels[c.id];
    if (v === undefined || !c.levels.some((l) => l.points === v)) complete = false;
    else points += v;
  }
  return { points, outOf, percent: outOf ? (points / outOf) * 100 : 0, complete };
}

export const gradeId = (courseId: string, itemId: string) => `work-${courseId}-${itemId}`;

/**
 * Save a review on the student's records. A final review with a percent also sets the grade
 * for this piece of work (one ParentGrade per assignment, replaced on regrading), which is how
 * rubric scores reach the course grade's "graded work" part.
 */
export function addReview(r: Records, courseId: string, itemId: string, title: string, review: WorkReview): Records {
  const key = workKey(courseId, itemId);
  const reviews = { ...(r.reviews ?? {}), [key]: [...(r.reviews?.[key] ?? []), review] };
  let grades: ParentGrade[] = r.grades;
  if (!review.revise && review.percent !== undefined) {
    const id = gradeId(courseId, itemId);
    const g: ParentGrade = { id, courseId, date: review.at.slice(0, 10), title, percent: Math.round(review.percent * 10) / 10 };
    grades = [...grades.filter((x) => x.id !== id), g];
  }
  return { ...r, reviews, grades };
}

// ---------- activity logs ----------

/** Monday of the week holding `date`. */
export function weekStart(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dow = (new Date(y, m - 1, d).getDay() + 6) % 7;
  return addDays(date, -dow);
}

export interface LogTotals {
  minutes: number;
  entries: number;
  days: number;
  byType: { type: string; minutes: number }[];
}

export function logTotals(entries: LogEntry[], from = "0000-00-00", to = "9999-99-99"): LogTotals {
  const inRange = entries.filter((e) => e.date >= from && e.date <= to);
  const types = new Map<string, number>();
  for (const e of inRange) types.set(e.type, (types.get(e.type) ?? 0) + e.minutes);
  return {
    minutes: inRange.reduce((s, e) => s + e.minutes, 0),
    entries: inRange.length,
    days: new Set(inRange.map((e) => e.date)).size,
    byType: [...types].map(([type, minutes]) => ({ type, minutes })).sort((a, b) => b.minutes - a.minutes),
  };
}

export function thisWeek(entries: LogEntry[], now = today()): LogTotals {
  const from = weekStart(now);
  return logTotals(entries, from, addDays(from, 6));
}

export const courseLogs = (p: Progress, courseId: string) => (p.logs ?? []).filter((e) => e.courseId === courseId).sort((a, b) => b.date.localeCompare(a.date));

export const newLogEntry = (e: Omit<LogEntry, "id">): LogEntry => ({ ...e, id: uid("g") });

export const fmtMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${Math.round(m % 60)} min` : ""}` : `${Math.round(m)} min`);

// ---------- hand-ins (classroom) ----------

/** The student's work and logs for the given courses (for a hand-in file). */
export function workForCourses(p: Progress, courses: string[]): Pick<Progress, "work" | "logs"> {
  const mine = (k: string) => courses.some((c) => k.startsWith(`${c}/`));
  return {
    work: Object.fromEntries(Object.entries(p.work ?? {}).filter(([k]) => mine(k))),
    logs: (p.logs ?? []).filter((e) => courses.includes(e.courseId)),
  };
}

/** Every stored file the work and logs refer to. */
export function workFileIds(p: Pick<Progress, "work" | "logs">): string[] {
  const ids = new Set<string>();
  for (const w of Object.values(p.work ?? {})) for (const f of w.photos ?? []) ids.add(f.fileId);
  for (const e of p.logs ?? []) if (e.file) ids.add(e.file.fileId);
  return [...ids];
}

/** Merge handed-in work into the teacher's copy: the newer copy of each piece wins; logs by id. */
export function mergeStudentWork(p: Progress, w: Pick<Progress, "work" | "logs">): Progress {
  const work = { ...(p.work ?? {}) };
  for (const [k, v] of Object.entries(w.work ?? {})) if (!work[k] || v.updated > work[k].updated) work[k] = v;
  const logs = new Map((p.logs ?? []).map((e) => [e.id, e]));
  for (const e of w.logs ?? []) logs.set(e.id, e);
  return { ...p, work, logs: [...logs.values()].sort((a, b) => a.date.localeCompare(b.date)) };
}
