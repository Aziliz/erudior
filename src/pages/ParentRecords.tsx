// Parent area: Grades (course grades, parent-entered work, outside courses, test results)
// and Reports (report card, transcript, portfolio, state progress report; print or save).

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import { SUBJECTS, gradeLabel, gradingOf, GRADES, isClassroom, type Family } from "../lib/family";
import { LEVEL_LABEL, letterFor, type CourseLevel, type CourseRecord } from "../lib/grades";
import { loadRecords, saveRecords, type Records } from "../lib/records";
import {
  coursesInYear,
  periodKey,
  quarters,
  recordYears,
  titleOf,
  yearOf,
  type Period,
  type PortfolioPhoto,
  type StudentData,
} from "../lib/reports";
import { loadPhotos, newPhoto, savePhotos, shrinkImage } from "../lib/portfolio";
import { today } from "../lib/srs";
import * as store from "../lib/storage";
import { uid } from "../lib/util";
import { ComplianceDoc, PortfolioDoc, ReportCardDoc, TranscriptDoc, clampPeriod, fmtDate } from "../components/ReportDocs";

export function useStudentData(api: AppApi, family: Family, sid: string) {
  const [data, setData] = useState<StudentData | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const scope = useRef(sid); scope.current = sid;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    let live = true;
    setData(null); setError("");
    (async () => {
      try {
        if (!api.authorizeAcademicRecords) throw Error("Academic records authorization is unavailable.");
        await api.authorizeAcademicRecords(sid);
        const progress = await store.loadProfileProgress(sid);
        const records = await loadRecords(sid);
        const student = family.students.find((s) => s.id === sid);
        if (!student) throw Error("This learner is no longer available.");
        await api.authorizeAcademicRecords(sid);
        if (live) setData({ family, student, progress, records, courses: api.allCourses });
      } catch (e) { if (live) setError((e as Error).message); }
    })();
    return () => { live = false; };
  }, [api.allCourses, family, sid, reload]);
  const setRecords = async (r: Records): Promise<boolean> => {
    const captured = sid;
    const guard = async () => { if (!mounted.current || scope.current !== captured) throw Error("Learner changed. Reopen these records before saving."); if (!api.authorizeAcademicRecords) throw Error("Academic records authorization is unavailable."); await api.authorizeAcademicRecords(captured); if (!mounted.current || scope.current !== captured) throw Error("Learner changed. Reopen these records before saving."); };
    try {
      await guard();
      const saved = await saveRecords(captured, r, { guard, action: "Adult record edit" });
      await guard(); setData((d) => d?.student.id === captured ? { ...d, records: saved } : d);
      setError(""); return true;
    } catch (e) { const message = (e as Error).message; if (mounted.current && scope.current === captured) setError(message); api.toast(message); return false; }
  };
  return { data: data?.student.id === sid ? data : null, setRecords, error, retry: () => setReload(n => n + 1) };
}

export function RecordsStatus({ error, retry, sid, api }: { error: string; retry: () => void; sid: string; api: AppApi }) {
  return <div className="notice" role={error ? "alert" : "status"}>
    <p>{error || "Loading records…"}</p>
    {error && <><p>No damaged records have been replaced. Reload to inspect the latest saved version before retrying. Downloaded recovery files may contain private learner information.</p>
      <button className="btn" onClick={retry}>Reload records</button>{" "}
      <button className="btn" onClick={async () => {
        try {
          if (!api.authorizeAcademicRecords) throw Error("Academic records authorization is unavailable.");
          await api.authorizeAcademicRecords(sid);
          const raw = await store.loadState(`records-${sid}`);
          await api.authorizeAcademicRecords(sid);
          if (raw !== null) await store.exportText(raw, "academic-records-recovery.json", "Private records recovery");
        } catch (e) { api.toast((e as Error).message); }
      }}>Download stored recovery copy</button></>}
  </div>;
}

export function StudentPicker({ family, sid, setSid }: { family: Family; sid: string; setSid: (s: string) => void }) {
  return (
    <label className="field">
      <span>Student</span>
      <select className="select" aria-label="Student" value={sid} onChange={(e) => setSid(e.target.value)}>
        {family.students.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </label>
  );
}

const yearOptions = (d: StudentData) => recordYears(d).map((y) => ({ value: y, label: yearOf(d.family, y).label }));

// ---------- Grades ----------

export function GradesTab({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0].id);
  const { data, setRecords, error, retry } = useStudentData(api, family, sid);
  const [year, setYear] = useState(family.year.start);
  const [editing, setEditing] = useState<string | null>(null);
  if (!data) return <RecordsStatus api={api} error={error} retry={retry} sid={sid} />;
  const r = data.records;
  const rows = coursesInYear(data, year);
  const { cutoffs } = gradingOf(family);

  const setCourse = (id: string, rec: CourseRecord) => setRecords({ ...r, courses: { ...r.courses, [id]: rec } });

  return (
    <>
      {error && <RecordsStatus api={api} error={error} retry={retry} sid={sid} />}
      <div className="row" style={{ marginBottom: 16, alignItems: "flex-end" }}>
        <StudentPicker family={family} sid={sid} setSid={(s) => (setSid(s), setEditing(null))} />
        <label className="field">
          <span>School year</span>
          <select className="select" value={year} onChange={(e) => setYear(e.target.value)}>
            {yearOptions(data).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Course grades</h2>
          <span className="small muted">Best score on each quiz and test; weights are in Settings.</span>
        </div>
        {rows.length === 0 ? (
          <p className="muted small">No courses on record for this year. Assigned and started courses show up here.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">Course grades for {data.student.name}</caption>
              <thead>
                <tr>
                  <th scope="col">Course</th>
                  <th scope="col" className="r">
                    Lessons
                  </th>
                  <th scope="col" className="r">
                    Modules
                  </th>
                  <th scope="col" className="r">
                    Final
                  </th>
                  <th scope="col" className="r">
                    Parent
                  </th>
                  <th scope="col" className="r">
                    Course
                  </th>
                  <th scope="col" className="r">
                    Credits
                  </th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const p = (v?: number, n?: number) => (v === undefined ? "—" : `${Math.round(v)}%${n && n > 1 ? ` (${n})` : ""}`);
                  return (
                    <tr key={row.courseId}>
                      <td>
                        <b>{row.title}</b>
                        <div className="small muted">
                          {row.subject}
                          {row.level !== "regular" && ` · ${LEVEL_LABEL[row.level]}`} · {row.status === "finished" ? `finished ${fmtDate(row.finished!)}` : "in progress"}
                        </div>
                      </td>
                      <td className="r">{p(row.parts.lessons, row.parts.counts.lessons)}</td>
                      <td className="r">{p(row.parts.modules, row.parts.counts.modules)}</td>
                      <td className="r">{p(row.parts.final)}</td>
                      <td className="r">{p(row.parts.parent, row.parts.counts.parent)}</td>
                      <td className="r">
                        <b>{row.percent === undefined ? "—" : `${Math.round(row.percent)}% ${row.letter}`}</b>
                        {row.overridden && <div className="small muted">set by you</div>}
                      </td>
                      <td className="r">{row.credits || "—"}</td>
                      <td>
                        <button className="btn sm" aria-expanded={editing === row.courseId} onClick={() => setEditing(editing === row.courseId ? null : row.courseId)}>
                          Edit<span className="sr-only">: {row.title}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {editing && (
          <CourseEditor
            key={editing}
            family={family}
            title={titleOf(editing, data.courses)}
            rec={r.courses[editing] ?? {}}
            row={rows.find((x) => x.courseId === editing)!}
            onSave={async (rec) => {
              if (!await setCourse(editing, rec)) return;
              setEditing(null);
              api.toast("Saved");
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </section>

      <ParentGrades api={api} data={data} setRecords={setRecords} courseIds={rows.map((x) => x.courseId)} />
      <OutsideCourses api={api} data={data} setRecords={setRecords} />
      <Tests api={api} data={data} setRecords={setRecords} />
      <p className="small muted">
        Letter grades use A from {cutoffs.A}%, B from {cutoffs.B}%, C from {cutoffs.C}%, D from {cutoffs.D}% (change in Settings; it can only be made stricter).
      </p>
    </>
  );
}

function CourseEditor({
  family,
  title,
  rec,
  row,
  onSave,
  onCancel,
}: {
  family: Family;
  title: string;
  rec: CourseRecord;
  row: ReturnType<typeof coursesInYear>[number];
  onSave: (r: CourseRecord) => Promise<void>;
  onCancel: () => void;
}) {
  const [credits, setCredits] = useState(String(row.credits));
  const [level, setLevel] = useState<CourseLevel>(row.level);
  const [override, setOverride] = useState(rec.percentOverride === undefined ? "" : String(rec.percentOverride));
  const [note, setNote] = useState(rec.overrideNote ?? "");
  const [comment, setComment] = useState(rec.comment ?? "");
  const [grade, setGrade] = useState(row.gradeLevel);
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const { cutoffs } = gradingOf(family);
  return (
    <form
      className="subpanel"
      onSubmit={async (e) => {
        e.preventDefault();
        const c = Number(credits);
        const o = override.trim() === "" ? undefined : Number(override);
        if (!(c >= 0 && c <= 5)) return setMsg("Credits go from 0 to 5.");
        if (o !== undefined && !(o >= 0 && o <= 100)) return setMsg("A percent goes from 0 to 100.");
        if (o !== undefined && !note.trim()) return setMsg("Say briefly why you're setting the grade; it's printed on the report card.");
        await onSave({ ...rec, credits: c, level, percentOverride: o, overrideNote: o === undefined ? undefined : note.trim(), comment: comment.trim() || undefined, gradeLevel: grade });
      }}
    >
      <h3 ref={ref} tabIndex={-1}>
        {title}
      </h3>
      <div className="form-grid">
        <label className="field">
          <span>Credits (1.0 = full-year course)</span>
          <input className="input" type="number" min={0} max={5} step={0.25} value={credits} onChange={(e) => setCredits(e.target.value)} />
        </label>
        <label className="field">
          <span>Level</span>
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value as CourseLevel)}>
            {(Object.keys(LEVEL_LABEL) as CourseLevel[]).map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABEL[l]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Set the course percent yourself (optional)</span>
          <input className="input" type="number" min={0} max={100} value={override} onChange={(e) => setOverride(e.target.value)} placeholder="Use the computed grade" />
        </label>
        <label className="field">
          <span>Reason for setting it</span>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} disabled={override.trim() === ""} />
        </label>
        <label className="field">
          <span>Grade level when taken</span>
          <select className="select" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {GRADES.map((_, g) => (
              <option key={g} value={g}>
                {gradeLabel(g)}
              </option>
            ))}
          </select>
        </label>
        <label className="field span-2">
          <span>Comment for the report card (optional)</span>
          <input className="input" value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
      </div>
      {override.trim() !== "" && Number.isFinite(Number(override)) && (
        <p className="small muted">That's a {letterFor(Number(override), cutoffs)}.</p>
      )}
      <p className={msg ? "notice error" : "sr-only"} role="alert">
        {msg}
      </p>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" type="submit">
          Save
        </button>
        <button className="btn ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

type Setter = (r: Records) => Promise<boolean>;

function ParentGrades({ api, data, setRecords, courseIds }: { api: AppApi; data: StudentData; setRecords: Setter; courseIds: string[] }) {
  const r = data.records;
  const [f, setF] = useState({ courseId: courseIds[0] ?? "", title: "", date: today(), percent: "" });
  const mine = r.grades.filter((g) => courseIds.includes(g.courseId)).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Work you graded</h2>
        <span className="small muted">Essays, projects, paper tests: anything done outside the app.</span>
      </div>
      {courseIds.length === 0 ? (
        <p className="muted small">Add a course first.</p>
      ) : (
        <form
          className="form-grid four"
          onSubmit={async (e) => {
            e.preventDefault();
            const p = Number(f.percent);
            if (!f.title.trim() || !(p >= 0 && p <= 100) || f.percent === "") return api.toast("Give it a name and a percent from 0 to 100.");
            if (!await setRecords({ ...r, grades: [...r.grades, { id: uid("g"), courseId: f.courseId || courseIds[0], title: f.title.trim(), date: f.date, percent: p }] })) return;
            setF({ ...f, title: "", percent: "" });
            api.toast("Grade added");
          }}
        >
          <label className="field">
            <span>Course</span>
            <select className="select" value={f.courseId || courseIds[0]} onChange={(e) => setF({ ...f, courseId: e.target.value })}>
              {courseIds.map((id) => (
                <option key={id} value={id}>
                  {titleOf(id, data.courses)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>What it was</span>
            <input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Essay on the water cycle" />
          </label>
          <label className="field">
            <span>Date</span>
            <input className="input" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          </label>
          <label className="field">
            <span>Percent</span>
            <input className="input" type="number" min={0} max={100} value={f.percent} onChange={(e) => setF({ ...f, percent: e.target.value })} />
          </label>
          <div>
            <button className="btn" type="submit">
              Add grade
            </button>
          </div>
        </form>
      )}
      {mine.length > 0 && (
        <ul className="plain-list">
          {mine.map((g) => (
            <li key={g.id} className="row" style={{ justifyContent: "space-between" }}>
              <span>
                {fmtDate(g.date)}: {titleOf(g.courseId, data.courses)}, {g.title}: <b>{g.percent}%</b>
              </span>
              <button className="btn sm ghost" onClick={() => setRecords({ ...r, grades: r.grades.filter((x) => x.id !== g.id) })}>
                Delete<span className="sr-only">: {g.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function OutsideCourses({ api, data, setRecords }: { api: AppApi; data: StudentData; setRecords: Setter }) {
  const r = data.records;
  const fam = data.family;
  const blank = { title: "", subject: "Math", year: String(Number(fam.year.start.slice(0, 4)) - 1), grade: Math.max(9, data.student.grade - 1), percent: "", credits: "1", level: "regular" as CourseLevel, where: "" };
  const [f, setF] = useState(blank);
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Courses taken elsewhere</h2>
        <span className="small muted">For the transcript: another school, a co-op, community college.</span>
      </div>
      <form
        className="form-grid four"
        onSubmit={async (e) => {
          e.preventDefault();
          const p = f.percent === "" ? undefined : Number(f.percent);
          const c = Number(f.credits);
          if (!f.title.trim() || (p !== undefined && !(p >= 0 && p <= 100)) || !(c >= 0 && c <= 5)) return api.toast("Check the course name, percent and credits.");
          const yearStart = `${f.year}-${fam.year.start.slice(5)}`;
          if (!await setRecords({
            ...r,
            outside: [...r.outside, { id: uid("o"), title: f.title.trim(), subject: f.subject, yearStart, gradeLevel: f.grade, percent: p, credits: c, level: f.level, where: f.where.trim() }],
          })) return;
          setF(blank);
          api.toast("Course added to the transcript");
        }}
      >
        <label className="field">
          <span>Course</span>
          <input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Subject</span>
          <select className="select" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>
            {SUBJECTS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>School year starting in</span>
          <input className="input" type="number" min={2000} max={2100} value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} />
        </label>
        <label className="field">
          <span>Grade level</span>
          <select className="select" value={f.grade} onChange={(e) => setF({ ...f, grade: Number(e.target.value) })}>
            {GRADES.map((_, g) => (
              <option key={g} value={g}>
                {gradeLabel(g)}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Percent (optional)</span>
          <input className="input" type="number" min={0} max={100} value={f.percent} onChange={(e) => setF({ ...f, percent: e.target.value })} />
        </label>
        <label className="field">
          <span>Credits</span>
          <input className="input" type="number" min={0} max={5} step={0.25} value={f.credits} onChange={(e) => setF({ ...f, credits: e.target.value })} />
        </label>
        <label className="field">
          <span>Level</span>
          <select className="select" value={f.level} onChange={(e) => setF({ ...f, level: e.target.value as CourseLevel })}>
            {(Object.keys(LEVEL_LABEL) as CourseLevel[]).map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABEL[l]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Where</span>
          <input className="input" value={f.where} onChange={(e) => setF({ ...f, where: e.target.value })} />
        </label>
        <div>
          <button className="btn" type="submit">
            Add course
          </button>
        </div>
      </form>
      {r.outside.length > 0 && (
        <ul className="plain-list">
          {r.outside.map((o) => (
            <li key={o.id} className="row" style={{ justifyContent: "space-between" }}>
              <span>
                {yearOf(fam, o.yearStart).label}, {gradeLabel(o.gradeLevel)}: <b>{o.title}</b> ({o.subject}, {o.credits} credit{o.credits === 1 ? "" : "s"}
                {o.percent !== undefined ? `, ${o.percent}%` : ""}
                {o.where ? `, ${o.where}` : ""})
              </span>
              <button className="btn sm ghost" onClick={() => setRecords({ ...r, outside: r.outside.filter((x) => x.id !== o.id) })}>
                Delete<span className="sr-only">: {o.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Tests({ api, data, setRecords }: { api: AppApi; data: StudentData; setRecords: Setter }) {
  const r = data.records;
  const blank = { date: today(), name: "", result: "", notes: "" };
  const [f, setF] = useState(blank);
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Standardized tests and evaluations</h2>
      </div>
      <form
        className="form-grid four"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!f.name.trim() || !f.result.trim()) return api.toast("Enter the test and the result.");
          if (!await setRecords({ ...r, tests: [...r.tests, { id: uid("t"), date: f.date, name: f.name.trim(), result: f.result.trim(), notes: f.notes.trim() }] })) return;
          setF(blank);
          api.toast("Result added");
        }}
      >
        <label className="field">
          <span>Date</span>
          <input className="input" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        </label>
        <label className="field">
          <span>Test or evaluator</span>
          <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Iowa Assessments, grade 3" />
        </label>
        <label className="field">
          <span>Result</span>
          <input className="input" value={f.result} onChange={(e) => setF({ ...f, result: e.target.value })} placeholder="e.g. Composite 68th percentile" />
        </label>
        <label className="field">
          <span>Notes (optional)</span>
          <input className="input" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </label>
        <div>
          <button className="btn" type="submit">
            Add result
          </button>
        </div>
      </form>
      {r.tests.length > 0 && (
        <ul className="plain-list">
          {[...r.tests]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((t) => (
              <li key={t.id} className="row" style={{ justifyContent: "space-between" }}>
                <span>
                  {fmtDate(t.date)}: <b>{t.name}</b>: {t.result}
                  {t.notes && <span className="muted"> ({t.notes})</span>}
                </span>
                <button className="btn sm ghost" onClick={() => setRecords({ ...r, tests: r.tests.filter((x) => x.id !== t.id) })}>
                  Delete<span className="sr-only">: {t.name}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}

// ---------- Reports ----------

type Kind = "card" | "transcript" | "portfolio" | "progress";
const KINDS: { id: Kind; label: string }[] = [
  { id: "card", label: "Report card" },
  { id: "transcript", label: "High school transcript" },
  { id: "progress", label: "State progress report (attendance, hours, material covered)" },
  { id: "portfolio", label: "Portfolio (log, work samples, photos)" },
];

/** The document's own styles, for "Save as web page" (the file opens and prints anywhere). */
function standaloneHtml(title: string, doc: HTMLElement): string {
  const css = [...document.styleSheets]
    .flatMap((s) => {
      try {
        return [...s.cssRules].map((r) => r.cssText);
      } catch {
        return [];
      }
    })
    .filter((t) => t.includes(".doc") || t.startsWith(":root") || t.startsWith("@font-face") || t.startsWith(".sr-only"))
    .join("\n");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${css}
body{margin:0;background:#fff;color:#111}</style></head><body data-theme="light">${doc.outerHTML}</body></html>`;
}

export function ReportsTab({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0].id);
  const { data, setRecords, error, retry } = useStudentData(api, family, sid);
  const [kind, setKind] = useState<Kind>("card");
  const [year, setYear] = useState(family.year.start);
  const [periodId, setPeriodId] = useState("year");
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true; setPhotos([]);
    loadPhotos(sid).then(value => { if (live) setPhotos(value); }, () => { if (live) setPhotos([]); });
    return () => { live = false; };
  }, [sid]);

  if (!data) return <RecordsStatus api={api} error={error} retry={retry} sid={sid} />;
  const now = today();
  const qs = quarters(family);
  const period: Period =
    periodId === "year"
      ? clampPeriod({ from: family.year.start, to: family.year.end, label: `School year ${yearOf(family, family.year.start).label}` }, now)
      : clampPeriod(qs[Number(periodId)], now);
  const title = KINDS.find((k) => k.id === kind)!.label.replace(/ \(.*/, "");
  const fileBase = `${title} - ${data.student.name} - ${kind === "progress" ? period.label : yearOf(family, year).label}`.replace(/[^\w\- –]+/g, "");

  async function saveHtml() {
    const el = docRef.current?.querySelector("article.doc") as HTMLElement | null;
    if (!el) return;
    if (await store.exportText(standaloneHtml(fileBase, el), `${fileBase}.html`, "Web page", "html")) api.toast("Saved");
  }

  return (
    <>
      {error && <RecordsStatus api={api} error={error} retry={retry} sid={sid} />}
      <div className="row no-print" style={{ marginBottom: 16, alignItems: "flex-end" }}>
        <StudentPicker family={family} sid={sid} setSid={setSid} />
        <label className="field">
          <span>Report</span>
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {KINDS.filter((k) => !isClassroom(family) || k.id === "card" || k.id === "portfolio").map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        {(kind === "card" || kind === "portfolio") && (
          <label className="field">
            <span>School year</span>
            <select className="select" value={year} onChange={(e) => setYear(e.target.value)}>
              {yearOptions(data).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {kind === "progress" && (
          <label className="field">
            <span>Period</span>
            <select className="select" value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
              <option value="year">Whole school year to date</option>
              {qs.map((q, i) => (
                <option key={i} value={String(i)} disabled={q.from > now}>
                  {q.label} ({fmtDate(q.from)} to {fmtDate(q.to)})
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="row">
          <button className="btn primary" onClick={() => window.print()}>
            Print or save as PDF
          </button>
          <button className="btn" onClick={saveHtml}>
            Save as web page
          </button>
        </div>
      </div>

      {!family.school?.name && (
        <p className="notice no-print" style={{ marginBottom: 16 }}>
          {isClassroom(family) ? "Add your school's name and your name" : "Add your home school's name and the administrator's name"} in Settings and backup; they're printed on every report.
        </p>
      )}

      {kind === "progress" && <Narratives data={data} period={period} setRecords={setRecords} />}
      {kind === "portfolio" && (
        <Photos
          api={api}
          photos={photos}
          setPhotos={async (p) => {
            await savePhotos(sid, p);
            setPhotos(p);
          }}
          year={yearOf(family, year)}
        />
      )}

      <div ref={docRef} className="doc-frame" tabIndex={0} role="region" aria-label="Report preview">
        {kind === "card" && <ReportCardDoc d={data} yearStart={year} />}
        {kind === "transcript" && <TranscriptDoc d={data} />}
        {kind === "progress" && <ComplianceDoc d={data} period={period} title={family.state === "NY" && periodId !== "year" ? "Quarterly report" : undefined} />}
        {kind === "portfolio" && <PortfolioDoc d={data} yearStart={year} photos={photos} />}
      </div>
    </>
  );
}

function Narratives({ data, period, setRecords }: { data: StudentData; period: Period; setRecords: Setter }) {
  const key = periodKey(period);
  const r = data.records;
  const subjects = [...new Set([...coursesInYear(data, yearOf(data.family, period.from).from).map((x) => x.subject), ...Object.keys(r.narratives[key] ?? {})])];
  if (!subjects.length) return null;
  return (
    <details className="panel no-print" style={{ marginBottom: 16 }}>
      <summary>
        <b>Your evaluation by subject</b> <span className="small muted">(printed on the report; New York asks for one each quarter)</span>
      </summary>
      <div className="form-grid" style={{ marginTop: 12 }}>
        {subjects.map((s) => (
          <label key={s} className="field">
            <span>{s}</span>
            <textarea
              className="textarea"
              defaultValue={r.narratives[key]?.[s] ?? ""}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v === (r.narratives[key]?.[s] ?? "")) return;
                const cur = { ...(r.narratives[key] ?? {}) };
                if (v) cur[s] = v;
                else delete cur[s];
                setRecords({ ...r, narratives: { ...r.narratives, [key]: cur } });
              }}
            />
          </label>
        ))}
      </div>
    </details>
  );
}

function Photos({
  api,
  photos,
  setPhotos,
  year,
}: {
  api: AppApi;
  photos: PortfolioPhoto[];
  setPhotos: (p: PortfolioPhoto[]) => Promise<void>;
  year: Period;
}) {
  const [subject, setSubject] = useState<string>("Other");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(today() <= year.to ? today() : year.to);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const mine = photos.filter((p) => p.date >= year.from && p.date <= year.to);
  return (
    <details className="panel no-print" style={{ marginBottom: 16 }}>
      <summary>
        <b>Photos of paper work</b> <span className="small muted">({mine.length} this year)</span>
      </summary>
      <form
        className="form-grid four"
        style={{ marginTop: 12 }}
        onSubmit={async (e) => {
          e.preventDefault();
          const files = [...(file.current?.files ?? [])];
          if (!files.length) return api.toast("Choose a photo first.");
          setBusy(true);
          try {
            const added: PortfolioPhoto[] = [];
            for (const f of files) added.push(newPhoto({ date, subject, caption: caption.trim(), image: await shrinkImage(f) }));
            await setPhotos([...photos, ...added]);
            setCaption("");
            if (file.current) file.current.value = "";
            api.toast(`Added ${added.length} photo${added.length === 1 ? "" : "s"}`);
          } catch (err) {
            api.toast(`Couldn't read that image: ${String(err)}`);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="field">
          <span>Photo or scan</span>
          <input ref={file} className="input" type="file" accept="image/*" multiple />
        </label>
        <label className="field">
          <span>Subject</span>
          <select className="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Date</span>
          <input className="input" type="date" value={date} min={year.from} max={year.to} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="field">
          <span>What it shows</span>
          <input className="input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Fractions worksheet" />
        </label>
        <div>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add"}
          </button>
        </div>
      </form>
      {mine.length > 0 && (
        <ul className="photo-list">
          {mine.map((p) => (
            <li key={p.id}>
              <img src={p.image} alt="" />
              <span className="small">
                {fmtDate(p.date)} · {p.subject}
                {p.caption && `: ${p.caption}`}
              </span>
              <button className="btn sm ghost" onClick={() => setPhotos(photos.filter((x) => x.id !== p.id))}>
                Remove<span className="sr-only"> photo: {p.caption || fmtDate(p.date)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="small muted">Photos are shrunk to 1,600 pixels and kept with this student's records on this computer.</p>
    </details>
  );
}

