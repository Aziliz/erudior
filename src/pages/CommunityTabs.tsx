// Course editor tabs beyond lessons and notecards: modules (with honors and module quizzes),
// glossary, reference sheets, math drills, and language courses (vocabulary, reading list).
// Together they give community courses everything official courses have.

import { useState } from "react";
import { addCommunityLesson, addCommunityModule, deleteCommunityModule, moveCommunityLesson, reorderCommunityModule, communityModuleDeleteProblem } from "../lib/communityModules";
import type { AppApi } from "../App";
import Markdown from "../components/Markdown";
import { LIMITS, type CGlossary, type CModule, type CommunityDoc, type CReading, type CReference, type CVocab } from "../lib/communityFormat";
import { drillError, generate } from "../lib/drills";
import type { Drill, DrillVar, NumFormat } from "../lib/types";
import { QuestionEditor, Q_KIND_LABEL, newQuestion } from "./CommunityQuestion";

type Update = (fn: (d: CommunityDoc) => CommunityDoc) => void;

export const newId = (prefix: string, taken: string[]) => {
  for (let i = 1; ; i++) if (!taken.includes(`${prefix}${i}`)) return `${prefix}${i}`;
};

function move<T>(xs: T[], i: number, d: number): T[] {
  const a = [...xs];
  const j = i + d;
  if (j < 0 || j >= a.length) return a;
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

const lines = (s: string, max: number) => s.split("\n").slice(0, max);

// ---------- Modules ----------

export function Modules({ api, doc, update }: { api: AppApi; doc: CommunityDoc; update: Update }) {
  const modules = doc.modules ?? [];
  const [open, setOpen] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState<{ id: string; snapshot: string } | null>(null);
  const setModule = (mi: number, fn: (m: CModule) => CModule) => update((d) => ({ ...d, modules: (d.modules ?? []).map((m) => (m.id === modules[mi]?.id ? fn(m) : m)) }));
  const lessonsIn = (id: string, first: boolean) => doc.lessons.filter((l) => l.module === id || (first && !l.module));
  return (
    <>
      <p className="muted small" style={{ marginBottom: 12 }}>
        Modules group lessons into units. Each can end with a module quiz that unlocks once its lessons are done. Honors modules are optional extra
        depth: learners don't need them to finish the course. {modules.length === 0 && "Right now all lessons are in one module named after the course."}
      </p>
      {modules.map((m, mi) => (
        <fieldset key={m.id} className="panel">
          <legend>Module {mi + 1}</legend>
          <div className="row" style={{ alignItems: "flex-end" }}>
            <label className="field grow">
              <span>Module title</span>
              <input className="input" value={m.title} maxLength={LIMITS.title} onChange={(e) => setModule(mi, (x) => ({ ...x, title: e.target.value }))} />
            </label>
            <label className="check">
              <input type="checkbox" checked={!!m.honors} onChange={(e) => setModule(mi, (x) => ({ ...x, honors: e.target.checked || undefined }))} />
              Honors module
            </label>
            <button className="btn sm ghost" disabled={mi === 0} onClick={() => update((d) => reorderCommunityModule(d, m.id, -1))}>
              Up<span className="sr-only">: module {mi + 1}</span>
            </button>
            <button className="btn sm ghost" disabled={mi === modules.length - 1} onClick={() => update((d) => reorderCommunityModule(d, m.id, 1))}>
              Down<span className="sr-only">: module {mi + 1}</span>
            </button>
            {deletePending?.id === m.id ? (
              <span className="row">
                <span className="small" role="status">Delete “{m.title}” and its {m.quiz?.length ?? 0} quiz questions? Its lessons move to the first remaining module{modules.length === 1 ? " (the implicit course module)" : ""}.</span>
                <button className="btn sm danger" onClick={() => { update((d) => { if (JSON.stringify(d.modules?.find(current => current.id === m.id)) !== deletePending.snapshot) { api.toast("The module changed. Review it before deleting."); return d; } const problem = communityModuleDeleteProblem(d, m.id); if (problem) { api.toast(problem); return d; } return deleteCommunityModule(d, m.id); }); setDeletePending(null); }}>Confirm delete</button>
                <button className="btn sm ghost" onClick={() => setDeletePending(null)}>Cancel</button>
              </span>
            ) : (
              <button className="btn sm ghost danger" disabled={!!communityModuleDeleteProblem(doc, m.id)} onClick={() => setDeletePending({ id: m.id, snapshot: JSON.stringify(m) })}>Delete module<span className="sr-only">: {m.title}</span></button>
            )}
          </div>
          {communityModuleDeleteProblem(doc, m.id) && <p className="small muted">{communityModuleDeleteProblem(doc, m.id)}</p>}
          <div className="panel" aria-label={`Lessons in ${m.title}`}>
            <strong>Lessons (${lessonsIn(m.id, mi === 0).length})</strong>
            {lessonsIn(m.id, mi === 0).map((lesson) => (
              <div className="row" key={lesson.id} style={{ marginTop: 8, alignItems: "center" }}>
                <span className="grow">{lesson.title}</span>
                <label className="field">
                  <span className="sr-only">{`Move ${lesson.title} to module`}</span>
                  <select className="select" value={m.id} onChange={(event) => update((d) => moveCommunityLesson(d, lesson.id, event.target.value))}>
                    {modules.map((destination) => <option key={destination.id} value={destination.id}>{destination.title}</option>)}
                  </select>
                </label>
              </div>
            ))}
            {!lessonsIn(m.id, mi === 0).length && <p className="small muted">No lessons assigned. Add or move a lesson here from the Lessons tab.</p>}
            <button className="btn sm" disabled={doc.lessons.length >= LIMITS.lessons} onClick={() => update((d) => addCommunityLesson(d, m.id))}>Add lesson to this module</button>
          </div>
          <details open={open === m.id} onToggle={(e) => (e.currentTarget.open ? setOpen(m.id) : open === m.id && setOpen(null))}>
            <summary>Module quiz ({m.quiz?.length ?? 0} questions)</summary>
            {(m.quiz ?? []).map((q, qi) => (
              <fieldset key={q.id} className="panel block-edit">
                <legend>
                  Quiz question {qi + 1}: {Q_KIND_LABEL[q.kind ?? "choice"]}
                </legend>
                <div className="row block-tools">
                  <button className="btn sm ghost" disabled={qi === 0} onClick={() => setModule(mi, (x) => ({ ...x, quiz: move(x.quiz ?? [], qi, -1) }))}>
                    Up<span className="sr-only">: quiz question {qi + 1}</span>
                  </button>
                  <button className="btn sm ghost danger" onClick={() => setModule(mi, (x) => ({ ...x, quiz: (x.quiz ?? []).filter((_, i) => i !== qi) }))}>
                    Delete<span className="sr-only">: quiz question {qi + 1}</span>
                  </button>
                </div>
                <QuestionEditor api={api} q={q} onChange={(nq) => setModule(mi, (x) => ({ ...x, quiz: (x.quiz ?? []).map((y, i) => (i === qi ? nq : y)) }))} />
              </fieldset>
            ))}
            <button
              className="btn sm"
              disabled={(m.quiz?.length ?? 0) >= LIMITS.moduleQuiz}
              onClick={() => setModule(mi, (x) => ({ ...x, quiz: [...(x.quiz ?? []), newQuestion(newId("q", (x.quiz ?? []).map((y) => y.id)))] }))}
            >
              Add quiz question
            </button>
          </details>
        </fieldset>
      ))}
      <button
        className="btn"
        disabled={modules.length >= LIMITS.modules - (modules.length ? 0 : 1)}
        onClick={() => update((d) => addCommunityModule(d))}
      >
        Add a module
      </button>
    </>
  );
}

// ---------- Glossary ----------

export function Glossary({ doc, update }: { doc: CommunityDoc; update: Update }) {
  const items = doc.glossary ?? [];
  const set = (fn: (g: CGlossary[]) => CGlossary[]) => update((d) => ({ ...d, glossary: fn(d.glossary ?? []) }));
  return (
    <>
      <p className="muted small" style={{ marginBottom: 12 }}>
        Learners can look terms up any time. In lesson text, write <code>[[term]]</code> (or <code>[[term|shown text]]</code>) to link a word to its
        definition.
      </p>
      <div className="table-wrap">
        <table className="table cards-edit">
          <caption className="sr-only">Glossary terms</caption>
          <thead>
            <tr>
              <th scope="col">Term</th>
              <th scope="col">Definition</th>
              <th scope="col">Other names (comma-separated)</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((g, i) => (
              <tr key={i}>
                <td>
                  <input className="input" aria-label={`Term ${i + 1}`} value={g.term} maxLength={LIMITS.title} onChange={(e) => set((xs) => xs.map((x, j) => (j === i ? { ...x, term: e.target.value } : x)))} />
                </td>
                <td>
                  <textarea
                    className="textarea"
                    rows={2}
                    aria-label={`Definition ${i + 1}`}
                    value={g.definition}
                    maxLength={LIMITS.text / 4}
                    onChange={(e) => set((xs) => xs.map((x, j) => (j === i ? { ...x, definition: e.target.value } : x)))}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    aria-label={`Other names for term ${i + 1}`}
                    value={(g.aliases ?? []).join(", ")}
                    onChange={(e) =>
                      set((xs) =>
                        xs.map((x, j) =>
                          j === i
                            ? {
                                ...x,
                                aliases: e.target.value
                                  .split(",")
                                  .map((a) => a.trimStart())
                                  .slice(0, 10),
                              }
                            : x,
                        ),
                      )
                    }
                  />
                </td>
                <td>
                  <button className="btn sm ghost" onClick={() => set((xs) => xs.filter((_, j) => j !== i))}>
                    Remove<span className="sr-only"> term {i + 1}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn sm" disabled={items.length >= LIMITS.glossary} onClick={() => set((xs) => [...xs, { term: "", definition: "" }])}>
        Add term
      </button>
    </>
  );
}

// ---------- Reference sheets ----------

export function References({ doc, update }: { doc: CommunityDoc; update: Update }) {
  const refs = doc.references ?? [];
  const [preview, setPreview] = useState<string | null>(null);
  const set = (fn: (r: CReference[]) => CReference[]) => update((d) => ({ ...d, references: fn(d.references ?? []) }));
  return (
    <>
      <p className="muted small" style={{ marginBottom: 12 }}>
        Quick-reference sheets: formulas, tables, rules to look up while studying. Offer one beside a lesson from that lesson's settings.
      </p>
      {refs.map((r, i) => (
        <fieldset key={r.id} className="panel">
          <legend>Sheet {i + 1}</legend>
          <div className="row" style={{ alignItems: "flex-end" }}>
            <label className="field grow">
              <span>Title</span>
              <input className="input" value={r.title} maxLength={LIMITS.title} onChange={(e) => set((xs) => xs.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
            </label>
            <button className="btn sm" aria-pressed={preview === r.id} onClick={() => setPreview(preview === r.id ? null : r.id)}>
              {preview === r.id ? "Edit" : "Preview"}
            </button>
            <button
              className="btn sm ghost danger"
              onClick={() =>
                window.confirm(`Delete the sheet "${r.title}"?`) &&
                update((d) => ({
                  ...d,
                  references: (d.references ?? []).filter((_, j) => j !== i),
                  lessons: d.lessons.map((l) => (l.refs?.includes(r.id) ? { ...l, refs: l.refs.filter((x) => x !== r.id) } : l)),
                }))
              }
            >
              Delete sheet
            </button>
          </div>
          {preview === r.id ? (
            <Markdown source={r.md} glossary={[]} />
          ) : (
            <label className="field">
              <span>Content (Markdown: **bold**, lists, tables with | pipes |, math like $a^2 + b^2 = c^2$)</span>
              <textarea className="textarea" rows={10} value={r.md} maxLength={LIMITS.text * 2} onChange={(e) => set((xs) => xs.map((x, j) => (j === i ? { ...x, md: e.target.value } : x)))} />
            </label>
          )}
        </fieldset>
      ))}
      <button
        className="btn"
        disabled={refs.length >= LIMITS.references}
        onClick={() => set((xs) => [...xs, { id: newId("r", xs.map((x) => x.id)), title: `Sheet ${xs.length + 1}`, md: "" }])}
      >
        Add a reference sheet
      </button>
    </>
  );
}

// ---------- Drills ----------

const FORMATS: [NumFormat, string][] = [
  ["number", "Number"],
  ["integer", "Whole number"],
  ["money", "Money ($1,234.56)"],
  ["money0", "Money, whole dollars"],
  ["percent", "Percent"],
  ["fraction", "Fraction"],
  ["sci", "Scientific notation"],
];

const blankDrill = (id: string): Drill => ({
  id,
  title: "New drill",
  vars: { a: { min: 2, max: 9 }, b: { min: 2, max: 9 } },
  calc: { total: "a * b" },
  prompt: "What is {a} × {b}?",
  answer: "total",
  format: "number",
  solution: "{a} × {b} = {total}",
});

export function Drills({ doc, update }: { doc: CommunityDoc; update: Update }) {
  const drills = doc.drills ?? [];
  const setDrill = (i: number, x: Drill) => update((d) => ({ ...d, drills: (d.drills ?? []).map((y, j) => (j === i ? x : y)) }));
  return (
    <>
      <p className="muted small" style={{ marginBottom: 12 }}>
        Drills make endless practice problems: you write the problem with placeholders like <code>{"{a}"}</code>, say how each value is picked and how
        the answer is worked out, and learners get fresh numbers every time. Offer a drill beside a lesson from that lesson's settings.
      </p>
      {drills.map((x, i) => (
        <DrillEditor
          key={x.id}
          drill={x}
          n={i + 1}
          onChange={(nx) => setDrill(i, nx)}
          onDelete={() =>
            window.confirm(`Delete the drill "${x.title}"?`) &&
            update((d) => ({
              ...d,
              drills: (d.drills ?? []).filter((_, j) => j !== i),
              lessons: d.lessons.map((l) => (l.drills?.includes(x.id) ? { ...l, drills: l.drills.filter((y) => y !== x.id) } : l)),
            }))
          }
        />
      ))}
      <button
        className="btn"
        disabled={drills.length >= LIMITS.drills}
        onClick={() => update((d) => ({ ...d, drills: [...(d.drills ?? []), blankDrill(newId("x", (d.drills ?? []).map((y) => y.id)))] }))}
      >
        Add a drill
      </button>
    </>
  );
}

type VarRow = { name: string; mode: "range" | "list"; min: string; max: string; step: string; list: string };
const toRows = (vars: Drill["vars"]): VarRow[] =>
  Object.entries(vars).map(([name, v]) =>
    "choices" in v
      ? { name, mode: "list", min: "", max: "", step: "", list: v.choices.map((c) => (typeof c === "object" ? `${c.label}=${c.value}` : String(c))).join(", ") }
      : { name, mode: "range", min: String(v.min), max: String(v.max), step: v.step ? String(v.step) : "", list: "" },
  );
const fromRows = (rows: VarRow[]): Drill["vars"] =>
  Object.fromEntries(
    rows
      .filter((r) => r.name.trim())
      .map((r): [string, DrillVar] => [
        r.name.trim(),
        r.mode === "list"
          ? {
              choices: r.list
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
                .map((c) => {
                  const m = /^(.+?)=(-?[\d.]+)$/.exec(c);
                  return m ? { label: m[1].trim(), value: Number(m[2]) } : c !== "" && Number.isFinite(Number(c)) ? Number(c) : c;
                }),
            }
          : { min: Number(r.min) || 0, max: Number(r.max) || 0, ...(Number(r.step) > 0 ? { step: Number(r.step) } : {}) },
      ]),
  );

function DrillEditor({ drill: x, n, onChange, onDelete }: { drill: Drill; n: number; onChange: (d: Drill) => void; onDelete: () => void }) {
  const [json, setJson] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState("");
  const [sample, setSample] = useState<{ prompt: string; solution: string } | null>(null);
  const error = drillError(x);
  const rows = toRows(x.vars);
  const calc = Object.entries(x.calc ?? {});
  const names = [...rows.map((r) => r.name), ...calc.map(([k]) => k)].filter(Boolean);
  const setRows = (rs: VarRow[]) => onChange({ ...x, vars: fromRows(rs) });
  const setCalc = (cs: [string, string][]) => onChange({ ...x, calc: cs.length ? Object.fromEntries(cs) : undefined });

  return (
    <fieldset className="panel block-edit">
      <legend>
        Drill {n}: {x.title}
      </legend>
      <div className="row block-tools">
        <button
          className="btn sm"
          onClick={() => {
            try {
              const inst = generate(x);
              setSample({ prompt: inst.prompt, solution: inst.solution });
            } catch (e) {
              setSample({ prompt: `Can't make a problem: ${(e as Error).message}`, solution: "" });
            }
          }}
        >
          Try it
        </button>
        <button className="btn sm ghost" aria-pressed={json !== null} onClick={() => (setJson(json === null ? JSON.stringify(x, null, 2) : null), setJsonError(""))}>
          {json === null ? "Edit as JSON" : "Back to the form"}
        </button>
        <button className="btn sm ghost danger" onClick={onDelete}>
          Delete<span className="sr-only">: drill {n}</span>
        </button>
      </div>
      {error && <p className="notice error small">{error}</p>}
      {sample && (
        <div className="panel drill-sample" aria-live="polite">
          <Markdown source={sample.prompt} />
          {sample.solution && (
            <details>
              <summary>Solution</summary>
              <Markdown source={sample.solution} />
            </details>
          )}
        </div>
      )}

      {json !== null ? (
        <>
          <p className="small muted">
            The full drill format (multi-part answers, expression answers, units, functions and graphs) is described in the course format guide. Keep
            the same <code>id</code>.
          </p>
          <textarea className="textarea code" rows={16} value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} aria-label="Drill as JSON" />
          {jsonError && <p className="notice error small">{jsonError}</p>}
          <button
            className="btn sm"
            onClick={() => {
              try {
                const parsed = JSON.parse(json) as Drill;
                if (!parsed || typeof parsed !== "object" || typeof parsed.vars !== "object") throw new Error('needs "vars", "prompt", "answer" and "solution".');
                onChange({ ...parsed, id: x.id });
                setJsonError("");
              } catch (e) {
                setJsonError(`Not applied: ${(e as Error).message}`);
              }
            }}
          >
            Apply JSON
          </button>
        </>
      ) : (
        <>
          <div className="form-grid">
            <label className="field">
              <span>Title</span>
              <input className="input" value={x.title} maxLength={LIMITS.title} onChange={(e) => onChange({ ...x, title: e.target.value })} />
            </label>
            <label className="field">
              <span>Topic (optional)</span>
              <input className="input" value={x.topic ?? ""} maxLength={LIMITS.title} onChange={(e) => onChange({ ...x, topic: e.target.value || undefined })} />
            </label>
          </div>

          <fieldset className="plain-fieldset">
            <legend className="small">Values picked at random</legend>
            {rows.map((r, i) => {
              const setRow = (p: Partial<VarRow>) => setRows(rows.map((y, j) => (j === i ? { ...y, ...p } : y)));
              return (
                <div key={i} className="row">
                  <input className="input num-input" aria-label={`Value ${i + 1} name`} value={r.name} onChange={(e) => setRow({ name: e.target.value.replace(/[^A-Za-z0-9_]/g, "") || r.name })} />
                  <select className="select" aria-label={`Value ${i + 1} kind`} value={r.mode} onChange={(e) => setRow({ mode: e.target.value as VarRow["mode"] })}>
                    <option value="range">from a range</option>
                    <option value="list">from a list</option>
                  </select>
                  {r.mode === "range" ? (
                    <>
                      <input className="input num-input" type="number" aria-label={`${r.name} smallest`} placeholder="min" value={r.min} onChange={(e) => setRow({ min: e.target.value })} />
                      <input className="input num-input" type="number" aria-label={`${r.name} largest`} placeholder="max" value={r.max} onChange={(e) => setRow({ max: e.target.value })} />
                      <input className="input num-input" type="number" aria-label={`${r.name} step`} placeholder="step 1" value={r.step} onChange={(e) => setRow({ step: e.target.value })} />
                    </>
                  ) : (
                    <input
                      className="input grow"
                      aria-label={`${r.name} choices, comma-separated`}
                      placeholder="3, 5, 7  or  apples, pears  or  dozen=12"
                      value={r.list}
                      onChange={(e) => setRow({ list: e.target.value })}
                    />
                  )}
                  <button className="btn sm ghost" onClick={() => setRows(rows.filter((_, j) => j !== i))}>
                    Remove<span className="sr-only"> value {r.name}</span>
                  </button>
                </div>
              );
            })}
            <button className="btn sm" onClick={() => setRows([...rows, { name: newId("v", names), mode: "range", min: "1", max: "10", step: "", list: "" }])}>
              Add value
            </button>
          </fieldset>

          <fieldset className="plain-fieldset">
            <legend className="small">Worked-out values, in order (math like a * b, (a + b) / 2, sqrt(a), round(x, 2))</legend>
            {calc.map(([k, v], i) => (
              <div key={i} className="row">
                <input
                  className="input num-input"
                  aria-label={`Worked value ${i + 1} name`}
                  value={k}
                  onChange={(e) => setCalc(calc.map((c, j) => (j === i ? [e.target.value.replace(/[^A-Za-z0-9_]/g, ""), c[1]] : c)))}
                />
                <span aria-hidden="true">=</span>
                <input className="input grow code" aria-label={`${k} formula`} value={v} onChange={(e) => setCalc(calc.map((c, j) => (j === i ? [c[0], e.target.value] : c)))} />
                <button className="btn sm ghost" onClick={() => setCalc(calc.filter((_, j) => j !== i))}>
                  Remove<span className="sr-only"> {k}</span>
                </button>
              </div>
            ))}
            <button className="btn sm" onClick={() => setCalc([...calc, [newId("w", names), ""]])}>
              Add worked value
            </button>
          </fieldset>

          <label className="field">
            <span>Conditions every problem must meet, one per line (optional, e.g. a != b)</span>
            <textarea
              className="textarea code"
              rows={2}
              value={(x.where ?? []).join("\n")}
              onChange={(e) => onChange({ ...x, where: e.target.value.trim() ? lines(e.target.value, 20) : undefined })}
            />
          </label>
          <label className="field">
            <span>Problem: {"{name}"} shows a value, {"{name:money}"} formats it; math like $x^2$ works</span>
            <textarea className="textarea" rows={3} value={x.prompt} maxLength={LIMITS.text} onChange={(e) => onChange({ ...x, prompt: e.target.value })} />
          </label>
          {x.answers?.length ? (
            <p className="small muted">This drill has several answer boxes; edit them as JSON.</p>
          ) : (
            <div className="form-grid">
              <label className="field">
                <span>The answer is</span>
                <select className="select" value={x.answer} onChange={(e) => onChange({ ...x, answer: e.target.value })}>
                  {!names.includes(x.answer) && <option value={x.answer}>{x.answer || "(choose)"}</option>}
                  {names.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Shown as</span>
                <select className="select" value={x.format} onChange={(e) => onChange({ ...x, format: e.target.value as NumFormat })}>
                  {FORMATS.map(([f, label]) => (
                    <option key={f} value={f}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Allowed difference (optional)</span>
                <input
                  className="input"
                  type="number"
                  step="any"
                  min={0}
                  value={x.tolerance ?? ""}
                  onChange={(e) => onChange({ ...x, tolerance: e.target.value === "" ? undefined : Math.abs(Number(e.target.value)) })}
                />
              </label>
            </div>
          )}
          <label className="field">
            <span>Worked solution (same placeholders)</span>
            <textarea className="textarea" rows={3} value={x.solution} maxLength={LIMITS.text} onChange={(e) => onChange({ ...x, solution: e.target.value })} />
          </label>
        </>
      )}
    </fieldset>
  );
}

// ---------- Language courses ----------

const LANGS: [string, string, string][] = [
  ["de", "German", "de-DE"],
  ["es", "Spanish", "es-ES"],
  ["fr", "French", "fr-FR"],
  ["it", "Italian", "it-IT"],
  ["pt", "Portuguese", "pt-BR"],
  ["ja", "Japanese", "ja-JP"],
  ["zh", "Chinese", "zh-CN"],
  ["ko", "Korean", "ko-KR"],
  ["la", "Latin", ""],
  ["ru", "Russian", "ru-RU"],
  ["ar", "Arabic", "ar-SA"],
  ["asl", "American Sign Language", ""],
];

export function Language({ doc, update }: { doc: CommunityDoc; update: Update }) {
  const g = doc.language;
  const vocab = doc.vocab ?? [];
  const reading = doc.readingList ?? [];
  const [filter, setFilter] = useState("");
  const setVocab = (fn: (v: CVocab[]) => CVocab[]) => update((d) => ({ ...d, vocab: fn(d.vocab ?? []) }));
  const setReading = (fn: (v: CReading[]) => CReading[]) => update((d) => ({ ...d, readingList: fn(d.readingList ?? []) }));
  const shown = vocab.map((v, i) => [v, i] as const).filter(([v]) => !filter || v.lesson === filter);
  return (
    <>
      <section className="panel">
        <h2>Language course</h2>
        <p className="small muted">
          For courses that teach a language: learners review each lesson's words with typed cards (meaning and recall), and the app can read words
          aloud.
        </p>
        {!g ? (
          <button className="btn" onClick={() => update((d) => ({ ...d, language: { code: "de", name: "German", tts: "de-DE" } }))}>
            This course teaches a language
          </button>
        ) : (
          <div className="form-grid">
            <label className="field">
              <span>Language</span>
              <select
                className="select"
                value={LANGS.some(([c]) => c === g.code) ? g.code : "other"}
                onChange={(e) => {
                  const l = LANGS.find(([c]) => c === e.target.value);
                  update((d) => ({ ...d, language: l ? { ...g, code: l[0], name: l[1], tts: l[2] || undefined } : { ...g, code: "xx", name: "" } }));
                }}
              >
                {LANGS.map(([c, name]) => (
                  <option key={c} value={c}>
                    {name}
                  </option>
                ))}
                <option value="other">Other…</option>
              </select>
            </label>
            {!LANGS.some(([c]) => c === g.code) && (
              <>
                <label className="field">
                  <span>Language code (like nl or pt-PT)</span>
                  <input className="input" value={g.code} maxLength={20} onChange={(e) => update((d) => ({ ...d, language: { ...g, code: e.target.value.trim() } }))} />
                </label>
                <label className="field">
                  <span>Language name</span>
                  <input className="input" value={g.name} maxLength={LIMITS.title} onChange={(e) => update((d) => ({ ...d, language: { ...g, name: e.target.value } }))} />
                </label>
              </>
            )}
            <label className="field">
              <span>Level (optional, like CEFR A1)</span>
              <input className="input" value={g.level ?? ""} maxLength={LIMITS.title} onChange={(e) => update((d) => ({ ...d, language: { ...g, level: e.target.value || undefined } }))} />
            </label>
            <label className="field">
              <span>Extra letters as typing buttons (like ä ö ü ß)</span>
              <input
                className="input"
                value={(g.keys ?? []).join(" ")}
                onChange={(e) => update((d) => ({ ...d, language: { ...g, keys: e.target.value.split(/\s+/).filter(Boolean).slice(0, 40) } }))}
              />
            </label>
            <button
              className="btn sm ghost danger"
              onClick={() => window.confirm("Stop treating this as a language course? The vocabulary list is removed.") && update((d) => ({ ...d, language: undefined, vocab: undefined }))}
            >
              Not a language course
            </button>
          </div>
        )}
      </section>

      {g && (
        <section className="panel">
          <h2>Vocabulary ({vocab.length})</h2>
          <div className="row">
            <label className="field">
              <span>Show</span>
              <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">All lessons</option>
                {doc.lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="table-wrap">
            <table className="table cards-edit">
              <caption className="sr-only">Vocabulary</caption>
              <thead>
                <tr>
                  <th scope="col">Word or phrase (nouns with their article)</th>
                  <th scope="col">Meanings (comma-separated; first is shown)</th>
                  <th scope="col">Lesson</th>
                  <th scope="col">Example (optional)</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map(([v, i]) => {
                  const setV = (p: Partial<CVocab>) => setVocab((xs) => xs.map((x, j) => (j === i ? { ...x, ...p } : x)));
                  return (
                    <tr key={v.id}>
                      <td>
                        <input className="input" lang={g.code} aria-label={`Word ${i + 1}`} value={v.term} maxLength={LIMITS.title} onChange={(e) => setV({ term: e.target.value })} />
                      </td>
                      <td>
                        <input
                          className="input"
                          aria-label={`Meanings of word ${i + 1}`}
                          value={v.meanings.join(", ")}
                          onChange={(e) => setV({ meanings: e.target.value.split(",").map((m) => m.trimStart()).slice(0, 10) })}
                        />
                      </td>
                      <td>
                        <select className="select" aria-label={`Lesson for word ${i + 1}`} value={v.lesson} onChange={(e) => setV({ lesson: e.target.value })}>
                          {doc.lessons.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input className="input" lang={g.code} aria-label={`Example for word ${i + 1}`} value={v.example ?? ""} maxLength={LIMITS.short} onChange={(e) => setV({ example: e.target.value || undefined })} />
                        <input
                          className="input"
                          aria-label={`Example translation for word ${i + 1}`}
                          placeholder="Translation"
                          value={v.exampleEn ?? ""}
                          maxLength={LIMITS.short}
                          onChange={(e) => setV({ exampleEn: e.target.value || undefined })}
                        />
                      </td>
                      <td>
                        <button className="btn sm ghost" onClick={() => setVocab((xs) => xs.filter((_, j) => j !== i))}>
                          Remove<span className="sr-only"> word {i + 1}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            className="btn sm"
            disabled={vocab.length >= LIMITS.vocab}
            onClick={() => setVocab((xs) => [...xs, { id: newId("w", xs.map((x) => x.id)), lesson: filter || doc.lessons[doc.lessons.length - 1]?.id || "", term: "", meanings: [""] }])}
          >
            Add word
          </button>
        </section>
      )}

      <section className="panel">
        <h2>Reading list ({reading.length})</h2>
        <p className="small muted">Books or articles that go with the course. Free ones are marked for learners.</p>
        {reading.map((r, i) => {
          const setR = (p: Partial<CReading>) => setReading((xs) => xs.map((x, j) => (j === i ? { ...x, ...p } : x)));
          return (
            <div key={i} className="row reading-row">
              <input className="input grow" aria-label={`Book ${i + 1} title`} placeholder="Title" value={r.title} maxLength={LIMITS.title} onChange={(e) => setR({ title: e.target.value })} />
              <input className="input" aria-label={`Book ${i + 1} author`} placeholder="Author" value={r.author ?? ""} maxLength={LIMITS.short} onChange={(e) => setR({ author: e.target.value || undefined })} />
              <input className="input" aria-label={`Book ${i + 1} link`} placeholder="https://…" value={r.url ?? ""} maxLength={LIMITS.short} onChange={(e) => setR({ url: e.target.value.trim() || undefined })} />
              <label className="check">
                <input type="checkbox" checked={!!r.free} onChange={(e) => setR({ free: e.target.checked || undefined })} />
                Free
              </label>
              <button className="btn sm ghost" onClick={() => setReading((xs) => xs.filter((_, j) => j !== i))}>
                Remove<span className="sr-only"> book {i + 1}</span>
              </button>
            </div>
          );
        })}
        <button className="btn sm" disabled={reading.length >= LIMITS.readingList} onClick={() => setReading((xs) => [...xs, { title: "" }])}>
          Add a book
        </button>
      </section>
    </>
  );
}
