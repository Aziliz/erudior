// Worker-safe canonical assessed-work data. No DOM, storage or Course imports.
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
  // Canonical resources already validated structurally are data, not shorthand:
  // retain explicit defaults (selfCheck:true/uploads:false), text and list order.
  // The legacy path below remains for historical authoring/checker fixtures.
  if (!validateCourseWork(raw, { strict: false }).length)
    return cloneCanonicalWork(raw);
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


export const COURSE_WORK_LIMITS = { resources: 200, criteria: 100, levels: 20, steps: 200, tables: 100, questions: 200, columns: 100, rows: 50, text: 50000, bytes: 2 * 1024 * 1024 } as const;
export interface CourseWorkValidationOptions {
  /** Publishing requires complete resources; drafts may contain empty text/lists. */
  strict?: boolean;
  /** Explicit compatibility for documented old shorthand, never malformed values. */
  legacy?: boolean;
  /** Omit only when validating a standalone resource collection. */
  moduleIds?: readonly string[];
}

/** Strict, non-mutating raw validation. Returns diagnostics rather than dropping fields. */
export function validateCourseWork(raw: unknown, options: CourseWorkValidationOptions = {}): string[] {
  const strict = options.strict !== false, legacy = options.legacy === true;
  const errors: string[] = [];
  const add = (at: string, message: string) => { if (errors.length < 200) errors.push(`${at}: ${message}`); };
  const record = (v: unknown, at: string): Record<string, unknown> | null => {
    if (!isObj(v) || ![Object.prototype, null].includes(Object.getPrototypeOf(v))) { add(at, "must be an object"); return null; }
    return v;
  };
  const root = record(raw, "work"); if (!root) return errors;
  const selected = Object.fromEntries(["rubrics", "writing", "labs", "activityLog"].filter(k => root[k] !== undefined).map(k => [k, root[k]]));
  try {
    let nodes = 0, chars = 0;
    const ancestors = new Set<object>();
    const scan = (v: unknown, depth = 0): void => {
      if (++nodes > 100000 || depth > 16) throw Error("structure too large");
      if (typeof v === "string") { chars += v.length; if (chars > COURSE_WORK_LIMITS.bytes) throw Error("content too large"); }
      else if (typeof v === "number" && !Number.isFinite(v)) throw Error("nonfinite number");
      else if (v && typeof v === "object") {
        if (ancestors.has(v)) throw Error("cyclic content");
        if (!Array.isArray(v) && (!isObj(v) || ![Object.prototype, null].includes(Object.getPrototypeOf(v)))) throw Error("non-plain object");
        ancestors.add(v);
        for (const [k, value] of Object.entries(v)) { if (["__proto__", "prototype", "constructor"].includes(k)) throw Error("unsafe key"); scan(value, depth + 1); }
        ancestors.delete(v);
      } else if (v !== null && v !== undefined && !["boolean", "number"].includes(typeof v)) throw Error("non-JSON data");
    };
    scan(selected);
    if (new TextEncoder().encode(JSON.stringify(selected)).byteLength > COURSE_WORK_LIMITS.bytes) throw Error("content too large");
  } catch (error) { return [`work: ${error instanceof Error ? error.message : "invalid content"}`]; }
  const fields = (o: Record<string, unknown>, allowed: string[], at: string) => { for (const key of Object.keys(o)) if (!allowed.includes(key)) add(`${at}.${key}`, "unsupported field"); };
  const string = (v: unknown, at: string, required = false, max = COURSE_WORK_LIMITS.text) => {
    if (typeof v !== "string" || v.length > max || (required && strict && !v.trim())) add(at, required ? "text required or too long" : "must be bounded text");
  };
  const ident = (v: unknown, at: string): v is string => { if (typeof v !== "string" || ["__proto__", "constructor", "prototype"].includes(v) || !/^[A-Za-z0-9_-]{1,100}$/.test(v)) { add(at, "invalid stable ID"); return false; } return true; };
  const numeric = (v: unknown): number => typeof v === "number" ? v : legacy && typeof v === "string" && /^\d+(?:\.\d+)?$/.test(v) ? Number(v) : NaN;
  const num = (v: unknown, at: string, max: number, min = 0) => { const n = numeric(v); if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max) add(at, "invalid number"); };
  const integer = (v: unknown, at: string, max: number, min = 1) => { num(v, at, max, min); if (!Number.isInteger(numeric(v))) add(at, "must be an integer"); };
  const bool = (v: unknown, at: string) => { if (typeof v !== "boolean") add(at, "must be true or false"); };
  const optional = (o: Record<string, unknown>, key: string, fn: (v: unknown, at: string) => void, at: string) => { if (o[key] !== undefined) fn(o[key], `${at}.${key}`); };
  const array = (v: unknown, at: string, max: number, nonempty = false): unknown[] => {
    if (!Array.isArray(v)) { add(at, "must be an array"); return []; }
    if (v.length > max) { add(at, "too many items"); return []; }
    if (strict && nonempty && !v.length) add(at, "needs at least one item"); return v;
  };
  const strings = (v: unknown, at: string, max: number, nonempty = false) => array(v, at, max, nonempty).forEach((x, i) => string(x, `${at}[${i}]`, true));
  const unique = (id: unknown, seen: Set<string>, at: string) => { if (ident(id, at)) { if (seen.has(id)) add(at, "duplicate ID"); seen.add(id); } };
  const rubricIds = new Set<string>(), taskIds = new Set<string>();
  const rubricRefs: Array<{ id: string; at: string }> = [];
  const rubric = (rawRubric: unknown, at: string, inlineId?: string) => {
    const r = record(rawRubric, at); if (!r) return;
    fields(r, ["id", "title", "criteria"], at);
    unique(r.id ?? inlineId, rubricIds, `${at}.id`); optional(r, "title", string, at);
    const criteria = new Set<string>();
    for (const [i, rawCriterion] of array(r.criteria, `${at}.criteria`, COURSE_WORK_LIMITS.criteria, true).entries()) {
      const path = `${at}.criteria[${i}]`, c = record(rawCriterion, path); if (!c) continue;
      fields(c, ["id", "name", "description", "levels", ...(legacy ? ["title"] : [])], path);
      unique(c.id, criteria, `${path}.id`); string(c.name ?? (legacy ? c.title : undefined), `${path}.name`, true); optional(c, "description", string, path);
      const levels = array(c.levels, `${path}.levels`, COURSE_WORK_LIMITS.levels);
      if (strict && levels.length < 2) add(`${path}.levels`, "needs at least two levels");
      const points = new Set<number>();
      for (const [j, rawLevel] of levels.entries()) {
        const lp = `${path}.levels[${j}]`, l = record(rawLevel, lp); if (!l) continue;
        fields(l, ["points", "label", "description"], lp); num(l.points, `${lp}.points`, 100000); string(l.label, `${lp}.label`, true); optional(l, "description", string, lp);
        if (points.has(numeric(l.points))) add(`${lp}.points`, "duplicate scoring level"); points.add(numeric(l.points));
      }
    }
  };
  if (root.rubrics !== undefined) array(root.rubrics, "rubrics", COURSE_WORK_LIMITS.resources).forEach((r, i) => rubric(r, `rubrics[${i}]`));
  const common = (t: Record<string, unknown>, at: string) => {
    unique(t.id, taskIds, `${at}.id`);
    if (t.title !== undefined || !legacy) string(t.title, `${at}.title`, true);
    optional(t, "module", (v, p) => { if (ident(v, p) && options.moduleIds && !options.moduleIds.includes(v)) add(p, "unknown module"); }, at);
    optional(t, "minutes", (v, p) => integer(v, p, 100000), at); optional(t, "selfCheck", bool, at);
    if (t.rubric !== undefined) {
      if (legacy && isObj(t.rubric)) rubric(t.rubric, `${at}.rubric`, `${t.id}-rubric`);
      else if (ident(t.rubric, `${at}.rubric`)) rubricRefs.push({ id: t.rubric, at: `${at}.rubric` });
    }
  };
  if (root.writing !== undefined) for (const [i, rawTask] of array(root.writing, "writing", COURSE_WORK_LIMITS.resources).entries()) {
    const at = `writing[${i}]`, w = record(rawTask, at); if (!w) continue;
    fields(w, ["id", "title", "module", "kind", "prompt", "words", "rubric", "selfCheck", "minutes"], at); common(w, at);
    if (!(legacy && w.kind === undefined) && w.kind !== "short" && w.kind !== "essay") add(`${at}.kind`, "must be short or essay");
    string(w.prompt, `${at}.prompt`, true);
    if (w.words !== undefined) { const words = record(w.words, `${at}.words`); if (words) { fields(words, ["min", "max"], `${at}.words`); optional(words, "min", (v, p) => integer(v, p, 1000000), `${at}.words`); optional(words, "max", (v, p) => integer(v, p, 1000000), `${at}.words`); if (words.min !== undefined && words.max !== undefined && numeric(words.min) > numeric(words.max)) add(`${at}.words`, "minimum exceeds maximum"); } }
  }
  if (root.labs !== undefined) for (const [i, rawLab] of array(root.labs, "labs", COURSE_WORK_LIMITS.resources).entries()) {
    const at = `labs[${i}]`, l = record(rawLab, at); if (!l) continue;
    fields(l, ["id", "title", "module", "minutes", "intro", "adult", "safety", "materials", "steps", "tables", "questions", "photos", "rubric", "selfCheck", ...(legacy ? ["supervision"] : [])], at); common(l, at);
    optional(l, "intro", string, at);
    if (l.adult !== undefined || !legacy) bool(l.adult, `${at}.adult`);
    if (l.supervision !== undefined && l.supervision !== "adult") add(`${at}.supervision`, "unsupported supervision");
    for (const field of ["safety", "materials"]) strings(l[field] ?? (legacy ? [] : undefined), `${at}.${field}`, 200, true);
    for (const [j, rawStep] of array(l.steps ?? (legacy ? [] : undefined), `${at}.steps`, COURSE_WORK_LIMITS.steps, true).entries()) {
      const p = `${at}.steps[${j}]`;
      if (legacy && typeof rawStep === "string") { string(rawStep, p, true); continue; }
      const step = record(rawStep, p); if (!step) continue; fields(step, ["text", "adult"], p); string(step.text, `${p}.text`, true); optional(step, "adult", bool, p);
      if (step.adult === true && l.adult !== true && l.supervision !== "adult") add(p, "adult step requires supervised lab");
    }
    const tableIds = new Set<string>(), questionIds = new Set<string>();
    const tables = array(l.tables ?? (legacy ? [] : undefined), `${at}.tables`, COURSE_WORK_LIMITS.tables);
    for (const [j, rawTable] of tables.entries()) {
      const p = `${at}.tables[${j}]`, t = record(rawTable, p); if (!t) continue;
      fields(t, ["id", "title", "columns", "rows", "rowLabels"], p); unique(t.id, tableIds, `${p}.id`); optional(t, "title", string, p); strings(t.columns, `${p}.columns`, COURSE_WORK_LIMITS.columns, true);
      if (t.rows !== undefined || !legacy) integer(t.rows, `${p}.rows`, COURSE_WORK_LIMITS.rows);
      if (t.rowLabels !== undefined) { strings(t.rowLabels, `${p}.rowLabels`, COURSE_WORK_LIMITS.rows); const rows = t.rows ?? (Array.isArray(t.rowLabels) ? t.rowLabels.length : 3); if (Array.isArray(t.rowLabels) && t.rowLabels.length > numeric(rows)) add(p, "row labels exceed row count"); }
    }
    const questions = array(l.questions ?? (legacy ? [] : undefined), `${at}.questions`, COURSE_WORK_LIMITS.questions);
    for (const [j, rawQuestion] of questions.entries()) {
      const p = `${at}.questions[${j}]`, q = record(rawQuestion, p); if (!q) continue;
      fields(q, ["id", "prompt", "kind"], p); unique(q.id, questionIds, `${p}.id`); string(q.prompt, `${p}.prompt`, true);
      if (!(legacy && q.kind === undefined) && q.kind !== "observation" && q.kind !== "conclusion") add(`${p}.kind`, "invalid question kind");
    }
    if (strict && !tables.length && !questions.length) add(at, "lab needs data tables or questions");
    if (l.photos !== undefined && !(legacy && typeof l.photos === "boolean")) string(l.photos, `${at}.photos`);
  }
  for (const ref of rubricRefs) if (!rubricIds.has(ref.id)) add(ref.at, "unknown rubric");
  if (root.activityLog !== undefined) {
    const a = record(root.activityLog, "activityLog");
    if (a) { fields(a, ["title", "types", "weeklyMinutes", "weeklyDays", "prompt", "uploads"], "activityLog");
      if (a.title !== undefined || !legacy) string(a.title, "activityLog.title", true);
      strings(a.types, "activityLog.types", 100, true);
      if (Array.isArray(a.types) && new Set(a.types).size !== a.types.length) add("activityLog.types", "duplicate activity type");
      optional(a, "weeklyMinutes", (v, p) => integer(v, p, 10080), "activityLog"); optional(a, "weeklyDays", (v, p) => integer(v, p, 7), "activityLog"); optional(a, "prompt", string, "activityLog");
      if (a.uploads !== undefined || !legacy) bool(a.uploads, "activityLog.uploads");
    }
  }
  return errors;
}

/** Validate before legacy shorthand is normalized; never silently drop malformed work. */
export function normalizeValidatedCourseWork(raw: unknown, options: CourseWorkValidationOptions = {}): CourseWork {
  const errors = validateCourseWork(raw, options);
  if (errors.length) throw Error(errors.join("; "));
  if (options.legacy) return normalizeWork(raw as Record<string, unknown>);
  return cloneCanonicalWork(raw as Record<string, unknown>);
}

/** Progress-bearing work identities are immutable across published revisions. */
export function courseWorkRevisionProblems(previous: CourseWork, next: CourseWork): string[] {
  const errors: string[] = [];
  const keep = <T extends { id: string }>(before: readonly T[], after: readonly T[], at: string, inspect?: (old: T, current: T) => void) => {
    for (const old of before) { const current = after.find(item => item.id === old.id); if (!current) errors.push(`${at}.${old.id}: published ID removed`); else inspect?.(old, current); }
  };
  const context = (old: WritingTask | Lab, current: WritingTask | Lab, at: string) => {
    if (old.module !== current.module) errors.push(`${at}.${old.id}: module reassigned`);
    if (old.rubric !== current.rubric) errors.push(`${at}.${old.id}: rubric reassigned`);
  };
  const prefix = (before: readonly unknown[], after: readonly unknown[], at: string) => {
    if (before.some((value, index) => JSON.stringify(value) !== JSON.stringify(after[index]))) errors.push(`${at}: published positional fields changed or removed`);
  };
  keep(previous.writing ?? [], next.writing ?? [], "writing", (old, current) => {
    context(old, current, "writing"); if (old.kind !== current.kind) errors.push(`writing.${old.id}: task kind changed`);
  });
  keep(previous.labs ?? [], next.labs ?? [], "labs", (old, current) => {
    context(old, current, "labs");
    prefix(old.materials, current.materials, `labs.${old.id}.materials`);
    prefix(old.steps, current.steps, `labs.${old.id}.steps`);
    keep(old.tables, current.tables, `labs.${old.id}.tables`, (table, updated) => {
      prefix(table.columns, updated.columns, `labs.${old.id}.tables.${table.id}.columns`);
      prefix(table.rowLabels ?? [], updated.rowLabels ?? [], `labs.${old.id}.tables.${table.id}.rowLabels`);
      if (updated.rows < table.rows) errors.push(`labs.${old.id}.tables.${table.id}: row count reduced`);
    });
    keep(old.questions, current.questions, `labs.${old.id}.questions`, (question, updated) => {
      if (question.kind !== updated.kind) errors.push(`labs.${old.id}.questions.${question.id}: question kind changed`);
    });
  });
  keep(previous.rubrics ?? [], next.rubrics ?? [], "rubrics", (old, current) => {
    keep(old.criteria, current.criteria, `rubrics.${old.id}.criteria`, (criterion, updated) => {
      if (criterion.levels.some(level => !updated.levels.some(nextLevel => nextLevel.points === level.points))) errors.push(`rubrics.${old.id}.criteria.${criterion.id}: scoring level removed or changed`);
    });
  });
  if (previous.activityLog) {
    if (!next.activityLog) errors.push("activityLog: published activity log removed");
    else for (const type of previous.activityLog.types) if (!next.activityLog.types.includes(type)) errors.push(`activityLog.types: published activity type removed: ${type}`);
  }
  return errors;
}

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


/** Validate portable lesson links without depending on Markdown rendering or Course. */
export function validateWorkLessonReferences(work: CourseWork, lessons: readonly { id: string; body: string }[]): string[] {
  const errors: string[] = [];
  for (const lesson of lessons) {
    const blocks = [...lesson.body.matchAll(ASSIGN_BLOCK)];
    const opened = (lesson.body.match(/^```assignment\b/gm) ?? []).length;
    if (opened > blocks.length) errors.push(`lesson ${lesson.id}: malformed or unclosed assignment block`);
    for (const block of blocks) {
      const parsed = parseAssignBlock(block[1]);
      for (const problem of parsed.problems) errors.push(`lesson ${lesson.id}: ${problem}`);
      for (const link of parsed.links) {
        if (link.kind === "log" && !work.activityLog) errors.push(`lesson ${lesson.id}: activity log does not exist`);
        if (link.kind === "writing" && !work.writing?.some(item => item.id === link.id)) errors.push(`lesson ${lesson.id}: writing ${link.id} does not exist`);
        if (link.kind === "lab" && !work.labs?.some(item => item.id === link.id)) errors.push(`lesson ${lesson.id}: lab ${link.id} does not exist`);
      }
    }
  }
  return errors;
}

function cloneCanonicalWork(source: Record<string, unknown>): CourseWork {
  return structuredClone(Object.fromEntries(["rubrics", "writing", "labs", "activityLog"].filter(key => source[key] !== undefined).map(key => [key, source[key]]))) as CourseWork;
}

/** Keep each published lesson's assessed-work attachments stable, not just resource IDs. */
export function courseWorkLessonRevisionProblems(previous: readonly { id: string; body: string }[], next: readonly { id: string; body: string }[]): string[] {
  const links = (body: string) => new Set([...body.matchAll(ASSIGN_BLOCK)].flatMap(block => parseAssignBlock(block[1]).links.map(link => link.kind === "log" ? "log" : `${link.kind}:${link.id}`)));
  const errors: string[] = [];
  for (const lesson of previous) {
    const after = next.find(item => item.id === lesson.id);
    const remaining = links(after?.body ?? "");
    for (const link of links(lesson.body)) if (!remaining.has(link)) errors.push(`lesson ${lesson.id}: published assignment link ${link} removed or reassigned`);
  }
  return errors;
}
