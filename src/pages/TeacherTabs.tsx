// Teacher area (Classroom mode): Overview, Classes (roster, assignments, class file),
// Gradebook (students × assigned courses, CSV) and Hand-ins (import students' files).

import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import { CATALOG, courseFinished } from "../lib/catalog";
import { newClass, newStudent, gradingOf, type ClassInfo, type Family } from "../lib/family";
import { classFile } from "../lib/classroom";
import { coursePercent, gradeParts, letterFor } from "../lib/grades";
import { loadRecords, type Records } from "../lib/records";
import { today } from "../lib/srs";
import * as store from "../lib/storage";
import ClassroomSubmissionReview from "../components/ClassroomSubmissionReview";
import type { Progress } from "../lib/types";

const fmt = (d: string) => new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

function useAll(family: Family) {
  const [data, setData] = useState<Record<string, { progress: Progress; records: Records }> | null>(null);
  const load = async () => {
    const out: Record<string, { progress: Progress; records: Records }> = {};
    for (const s of family.students) {
      const t = await store.loadState(`progress-${s.id}`);
      out[s.id] = { progress: t ? { ...store.emptyProgress(), ...(JSON.parse(t) as Progress) } : store.emptyProgress(), records: await loadRecords(s.id) };
    }
    setData(out);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [family.students]);
  return { data, reload: load };
}

const titleOf = (api: AppApi, id: string) => CATALOG.find((e) => e.id === id)?.title ?? api.allCourses.find((c) => c.id === id)?.title ?? id;

interface Cell {
  done: boolean;
  lessonsDone: number;
  lessons: number;
  percent?: number;
  letter?: string;
  late: boolean;
}

function cell(family: Family, p: Progress, r: Records, courseId: string, due: string | undefined, api: AppApi): Cell {
  const f = courseFinished(courseId, p, api.allCourses.find((c) => c.id === courseId));
  const { cutoffs, weights } = gradingOf(family);
  const override = r.courses[courseId]?.percentOverride;
  const percent = override ?? coursePercent(gradeParts(courseId, p, r.grades), weights);
  return { done: f.done, lessonsDone: f.lessonsDone, lessons: f.lessons, percent, letter: percent === undefined ? undefined : letterFor(percent, cutoffs), late: !!due && !f.done && due < today() };
}

function ClassPicker({ family, cid, setCid }: { family: Family; cid: string; setCid: (s: string) => void }) {
  return (
    <label className="field">
      <span>Class</span>
      <select className="select" value={cid} onChange={(e) => setCid(e.target.value)}>
        {(family.classes ?? []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}

const setClass = (api: AppApi, family: Family, c: ClassInfo) => api.setFamily({ ...family, classes: (family.classes ?? []).map((x) => (x.id === c.id ? c : x)) });

// ---------- Overview ----------

export function ClassOverview({ api, family }: { api: AppApi; family: Family }) {
  const { data } = useAll(family);
  if (!data) return <p className="muted">Loading…</p>;
  const classes = family.classes ?? [];
  if (!classes.length)
    return (
      <p className="muted">
        No classes yet.{" "}
        <button className="linkish" onClick={() => api.go({ name: "parent", tab: "classes" })}>
          Add a class
        </button>
      </p>
    );
  return (
    <>
      {classes.map((c) => {
        let finished = 0;
        let late = 0;
        const pending = c.students.length * c.assignments.length;
        for (const sid of c.students)
          for (const a of c.assignments) {
            const d = data[sid];
            if (!d) continue;
            const x = cell(family, d.progress, d.records, a.courseId, a.due, api);
            if (x.done) finished++;
            if (x.late) late++;
          }
        const upcoming = c.assignments.filter((a) => a.due && a.due >= today()).sort((a, b) => a.due!.localeCompare(b.due!));
        return (
          <section key={c.id} className="panel">
            <div className="panel-head">
              <h2>{c.name}</h2>
              <button className="btn sm" onClick={() => api.go({ name: "parent", tab: "gradebook" })}>
                Gradebook<span className="sr-only"> for {c.name}</span>
              </button>
            </div>
            <div className="stats-strip">
              <div>
                <b>{c.students.length}</b>
                <span>students</span>
              </div>
              <div>
                <b>{c.assignments.length}</b>
                <span>assigned courses</span>
              </div>
              <div>
                <b>
                  {finished} / {pending}
                </b>
                <span>finished</span>
              </div>
              <div>
                <b>{late}</b>
                <span>past due</span>
              </div>
            </div>
            {upcoming.length > 0 && (
              <p className="small" style={{ marginTop: 12 }}>
                Next due: {upcoming.slice(0, 3).map((a) => `${titleOf(api, a.courseId)} (${fmt(a.due!)})`).join("; ")}
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}

// ---------- Classes ----------

export function ClassesTab({ api, family }: { api: AppApi; family: Family }) {
  const classes = family.classes ?? [];
  const [cid, setCid] = useState(classes[0]?.id ?? "");
  const [newName, setNewName] = useState("");
  const c = classes.find((x) => x.id === cid) ?? classes[0];

  return (
    <>
      <div className="row" style={{ marginBottom: 16, alignItems: "flex-end" }}>
        {classes.length > 0 && <ClassPicker family={family} cid={c?.id ?? ""} setCid={setCid} />}
        <form
          className="row"
          style={{ alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newName.trim()) return;
            const nc = newClass(newName);
            await api.setFamily({ ...family, classes: [...classes, nc] });
            setCid(nc.id);
            setNewName("");
            api.toast(`Added ${nc.name}`);
          }}
        >
          <label className="field">
            <span>New class</span>
            <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Period 5 Geometry" />
          </label>
          <button className="btn" type="submit">
            Add class
          </button>
        </form>
      </div>
      {c && <ClassEditor key={c.id} api={api} family={family} c={c} />}
    </>
  );
}

function ClassEditor({ api, family, c }: { api: AppApi; family: Family; c: ClassInfo }) {
  const [names, setNames] = useState("");
  const [pick, setPick] = useState("");
  const [due, setDue] = useState("");
  const [name, setName] = useState(c.name);
  const members = family.students.filter((s) => c.students.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const others = family.students.filter((s) => !c.students.includes(s.id));
  const options = [
    ...CATALOG.map((e) => ({ id: e.id, title: e.title })),
    ...api.allCourses.filter((x) => !CATALOG.some((e) => e.id === x.id) && !x.community).map((x) => ({ id: x.id, title: `${x.title} (your course)` })),
  ].filter((o) => !c.assignments.some((a) => a.courseId === o.id));
  const grade = members[0]?.grade ?? 6;

  async function exportClassFile() {
    const file = classFile(family, c, (id) => titleOf(api, id));
    const ok = await store.exportText(JSON.stringify(file), `class ${c.name}.json`.replace(/[^\w\- .]+/g, ""), "Erudior class file");
    if (ok) api.toast("Class file saved. Share it with students who use their own device.");
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>{c.name}</h2>
          <div className="row">
            <button className="btn sm" onClick={exportClassFile}>
              Save class file for students' devices
            </button>
            <button
              className="btn sm ghost danger"
              onClick={async () => {
                if (!(await store.confirmAction(`Delete the class ${c.name}? Students and their progress stay on this computer.`, "Delete class"))) return;
                await api.setFamily({ ...family, classes: (family.classes ?? []).filter((x) => x.id !== c.id) });
              }}
            >
              Delete class
            </button>
          </div>
        </div>
        <form
          className="row"
          style={{ alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (name.trim()) await setClass(api, family, { ...c, name: name.trim() });
            api.toast("Renamed");
          }}
        >
          <label className="field grow">
            <span>Class name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button className="btn" type="submit">
            Rename
          </button>
        </form>
        <p className="small muted" style={{ marginTop: 8 }}>
          Students on this computer pick their name. Students on their own device (any Erudior, including app.erudior.com) open the class file, pick their name,
          and hand in a file you import under Hand-ins. Re-save the class file after changing assignments or the roster.
        </p>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Assigned courses</h2>
        </div>
        {c.assignments.length === 0 ? (
          <p className="muted small">Nothing assigned yet.</p>
        ) : (
          <ul className="plain-list">
            {c.assignments.map((a) => (
              <li key={a.courseId} className="row" style={{ justifyContent: "space-between" }}>
                <span>
                  <b>{titleOf(api, a.courseId)}</b> <span className="small muted">assigned {fmt(a.assigned)}</span>
                </span>
                <span className="row">
                  <label className="field inline-field">
                    <span className="small">Due</span>
                    <input
                      className="input"
                      type="date"
                      value={a.due ?? ""}
                      onChange={(e) =>
                        setClass(api, family, { ...c, assignments: c.assignments.map((x) => (x.courseId === a.courseId ? { ...x, due: e.target.value || undefined } : x)) })
                      }
                    />
                  </label>
                  <button className="btn sm ghost" onClick={() => setClass(api, family, { ...c, assignments: c.assignments.filter((x) => x.courseId !== a.courseId) })}>
                    Remove<span className="sr-only"> {titleOf(api, a.courseId)}</span>
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <form
          className="row"
          style={{ marginTop: 12, alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!pick) return;
            await setClass(api, family, { ...c, assignments: [...c.assignments, { courseId: pick, due: due || undefined, assigned: today() }] });
            setPick("");
            setDue("");
          }}
        >
          <label className="field grow">
            <span>Course</span>
            <select className="select" value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Choose a course…</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Due (optional)</span>
            <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
          <button className="btn primary" type="submit" disabled={!pick}>
            Assign
          </button>
        </form>
        <label className="check" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={c.freeChoice} onChange={(e) => setClass(api, family, { ...c, freeChoice: e.target.checked })} />
          Students in this class may also start courses that aren't assigned
        </label>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Roster ({members.length})</h2>
        </div>
        <ul className="plain-list">
          {members.map((s) => (
            <li key={s.id} className="row" style={{ justifyContent: "space-between" }}>
              <span>
                {s.name}
                {c.handins[s.id] && <span className="small muted"> · last hand-in {fmt(c.handins[s.id])}</span>}
              </span>
              <button className="btn sm ghost" onClick={() => setClass(api, family, { ...c, students: c.students.filter((x) => x !== s.id) })}>
                Remove from class<span className="sr-only">: {s.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <form
          className="row"
          style={{ marginTop: 12, alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            const list = names
              .split("\n")
              .map((n) => n.trim())
              .filter(Boolean);
            if (!list.length) return;
            const added = list.map((n) => newStudent(n, grade));
            for (const st of added) await store.saveState(`progress-${st.id}`, JSON.stringify({ catalogV1: true, enrolled: [] }));
            await api.setFamily({
              ...family,
              students: [...family.students, ...added],
              classes: (family.classes ?? []).map((x) => (x.id === c.id ? { ...x, students: [...x.students, ...added.map((a) => a.id)] } : x)),
            });
            setNames("");
            api.toast(`Added ${added.length} student${added.length === 1 ? "" : "s"}`);
          }}
        >
          <label className="field grow">
            <span>New students, one name per line</span>
            <textarea className="textarea" rows={3} value={names} onChange={(e) => setNames(e.target.value)} />
          </label>
          <button className="btn" type="submit">
            Add students
          </button>
        </form>
        {others.length > 0 && (
          <form
            className="row"
            style={{ marginTop: 12, alignItems: "flex-end" }}
            onSubmit={async (e) => {
              e.preventDefault();
              const sel = (e.currentTarget.elements.namedItem("existing") as HTMLSelectElement).value;
              if (sel) await setClass(api, family, { ...c, students: [...c.students, sel] });
            }}
          >
            <label className="field">
              <span>Add a student from another class</span>
              <select className="select" name="existing" defaultValue="">
                <option value="">Choose…</option>
                {others.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn" type="submit">
              Add to {c.name}
            </button>
          </form>
        )}
      </section>
    </>
  );
}

// ---------- Gradebook ----------

export function GradebookTab({ api, family }: { api: AppApi; family: Family }) {
  const classes = family.classes ?? [];
  const [cid, setCid] = useState(classes[0]?.id ?? "");
  const { data } = useAll(family);
  const c = classes.find((x) => x.id === cid) ?? classes[0];
  if (!c) return <p className="muted">Add a class first.</p>;
  if (!data) return <p className="muted">Loading…</p>;
  const members = family.students.filter((s) => c.students.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const cells = (sid: string) => c.assignments.map((a) => cell(family, data[sid].progress, data[sid].records, a.courseId, a.due, api));
  const show = (x: Cell) => `${x.percent === undefined ? "—" : `${Math.round(x.percent)}% ${x.letter}`}`;

  async function csv() {
    const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const head = ["Student", ...c.assignments.flatMap((a) => [`${titleOf(api, a.courseId)} %`, `${titleOf(api, a.courseId)} grade`, `${titleOf(api, a.courseId)} lessons`])];
    const rows = members.map((s) => [
      s.name,
      ...cells(s.id).flatMap((x) => [x.percent === undefined ? "" : String(Math.round(x.percent)), x.letter ?? "", `${x.lessonsDone}/${x.lessons}${x.done ? " finished" : x.late ? " late" : ""}`]),
    ]);
    const text = [head, ...rows].map((r) => r.map(q).join(",")).join("\n") + "\n";
    if (await store.exportText(text, `gradebook ${c.name} ${today()}.csv`.replace(/[^\w\- .]+/g, ""), "CSV", "csv")) api.toast("Gradebook saved");
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
        <ClassPicker family={family} cid={c.id} setCid={setCid} />
        <button className="btn" onClick={csv} disabled={!members.length || !c.assignments.length}>
          Download gradebook (CSV)
        </button>
      </div>
      {c.assignments.length === 0 || members.length === 0 ? (
        <p className="muted">Assign a course and add students to see the gradebook.</p>
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label={`Gradebook for ${c.name}`}>
          <table className="table gradebook">
            <caption className="sr-only">
              Gradebook for {c.name}: course grade and lessons finished per student
            </caption>
            <thead>
              <tr>
                <th scope="col">Student</th>
                {c.assignments.map((a) => (
                  <th key={a.courseId} scope="col">
                    {titleOf(api, a.courseId)}
                    {a.due && <div className="small muted">due {fmt(a.due)}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((s) => (
                <tr key={s.id}>
                  <th scope="row">{s.name}</th>
                  {cells(s.id).map((x, i) => (
                    <td key={i}>
                      <b>{show(x)}</b>
                      <div className={`small ${x.late ? "late" : "muted"}`}>
                        {x.done ? "Finished" : `${x.lessonsDone}/${x.lessons} lessons${x.late ? ", past due" : ""}`}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small muted" style={{ marginTop: 8 }}>
        Grades use the scale and weights in Settings. Open Grades to enter grades for paper work or set a grade yourself.
      </p>
    </>
  );
}

// ---------- Hand-ins ----------

export function HandinsTab({ api, family }: { api: AppApi; family: Family }) {
  return <ClassroomSubmissionReview family={family} onChanged={api.reloadClassroomState ?? api.reload} />;
}
