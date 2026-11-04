/** Frozen task-schema validation for evidence version 1. Keep future authoring extensions separate. */
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
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
export function validateAssessedWorkTaskV1(raw: unknown, options: CourseWorkValidationOptions = {}): string[] {
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
