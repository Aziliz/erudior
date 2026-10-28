// Library sections for Classroom mode: a classroom student's assignments on the teacher's
// computer, and "My classes" for students on their own device (class file in, hand-in out).

import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import { CATALOG, courseFinished } from "../lib/catalog";
import { classesOf, type Family, type Student } from "../lib/family";
import { loadJoined, parseClassFile, saveJoined, type Joined } from "../lib/classroom";
import * as store from "../lib/storage";
import { preparePersistedHandIn } from "../lib/classroomExport";
import { today } from "../lib/srs";

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function dueText(due: string | undefined, done: boolean): { text: string; late: boolean } {
  if (!due) return { text: "", late: false };
  if (done) return { text: `Due ${fmt(due)}`, late: false };
  const late = due < today();
  return { text: late ? `Was due ${fmt(due)}` : `Due ${fmt(due)}`, late };
}

function AssignmentRow({ api, courseId, title, due }: { api: AppApi; courseId: string; title: string; due?: string }) {
  const have = api.courses.some((c) => c.id === courseId);
  const f = courseFinished(courseId, api.progress, api.allCourses.find((c) => c.id === courseId));
  const d = dueText(due, f.done);
  return (
    <li className="assigned-row">
      <b>{title}</b>
      <span className="small muted">{f.done ? "Finished" : f.lessons ? `${f.lessonsDone} of ${f.lessons} lessons` : ""}</span>
      {d.text && <span className={`small ${d.late ? "late" : "muted"}`}>{d.text}</span>}
      {have ? (
        <button className="btn sm" onClick={() => api.go({ name: "course", courseId })}>
          Open<span className="sr-only"> {title}</span>
        </button>
      ) : (
        <button className="btn sm primary" onClick={() => api.addCourse(courseId)}>
          Start<span className="sr-only"> {title}</span>
        </button>
      )}
    </li>
  );
}

const titleOf = (api: AppApi, id: string) => CATALOG.find((e) => e.id === id)?.title ?? api.allCourses.find((c) => c.id === id)?.title ?? id;

/** On the teacher's computer: this student's assignments, class by class. */
export function ClassAssignments({ api, family, student }: { api: AppApi; family: Family; student: Student }) {
  const classes = classesOf(family, student.id).filter((c) => c.assignments.length);
  if (!classes.length) return null;
  return (
    <>
      {classes.map((c) => (
        <section key={c.id} style={{ marginBottom: 28 }}>
          <h2 className="section-title">Assigned in {c.name}</h2>
          <ul className="assigned-list">
            {[...c.assignments]
              .sort((a, b) => (a.due ?? "9999").localeCompare(b.due ?? "9999"))
              .map((a) => (
                <AssignmentRow key={a.courseId} api={api} courseId={a.courseId} title={titleOf(api, a.courseId)} due={a.due} />
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}

/** On a student's own device: classes joined from a class file, with hand-in. */
export function MyClasses({ api }: { api: AppApi }) {
  const [joined, setJoined] = useState<Joined[] | null>(null);
  const [pending, setPending] = useState<Joined["cls"] | null>(null);
  const [who, setWho] = useState("");

  useEffect(() => {
    loadJoined().then(setJoined, () => setJoined([]));
  }, []);

  const save = async (list: Joined[]) => {
    await saveJoined(list);
    setJoined(list);
  };

  async function join() {
    try {
      const text = await store.pickJsonFile();
      if (text === null) return;
      const cls = parseClassFile(JSON.parse(text));
      setPending(cls);
      setWho("");
    } catch (e) {
      api.toast((e as Error).message);
    }
  }

  async function handIn(j: Joined) {
    try {
      const h = await preparePersistedHandIn(j);
      const name = j.cls.students.find((s) => s.id === j.studentId)?.name ?? "student";
      const file = `hand-in ${j.cls.name} ${name} ${today()}.json`.replace(/[^\w\- .]+/g, "");
      if (await store.exportText(JSON.stringify(h), file, "Erudior hand-in")) api.toast("Saved. Give that file to your teacher.");
    } catch (e) {
      api.toast((e as Error).message);
    }
  }

  if (!joined) return null;
  return (
    <section className="my-classes" style={{ marginBottom: 28 }}>
      {joined.map((j) => {
        const me = j.cls.students.find((s) => s.id === j.studentId);
        return (
          <div key={j.cls.classId} style={{ marginBottom: 20 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                {j.cls.name}
                {j.cls.teacher && <span className="small muted"> · {j.cls.teacher}</span>}
              </h2>
              <div className="row">
                <button className="btn sm primary" onClick={() => handIn(j)}>
                  Hand in work<span className="sr-only"> for {j.cls.name}</span>
                </button>
                <button
                  className="btn sm ghost"
                  onClick={async () => {
                    if (await store.confirmAction(`Leave ${j.cls.name} on this device? Your progress stays.`, "Leave class"))
                      save(joined.filter((x) => x.cls.classId !== j.cls.classId));
                  }}
                >
                  Leave<span className="sr-only"> {j.cls.name}</span>
                </button>
              </div>
            </div>
            <p className="small muted">Class roster selection: {me?.name ?? "?"}. Hand in saves a file with your work on these courses for your teacher.</p>
            {j.cls.assignments.length === 0 ? (
              <p className="small muted">Nothing assigned yet.</p>
            ) : (
              <ul className="assigned-list">
                {j.cls.assignments.map((a) => (
                  <AssignmentRow key={a.courseId} api={api} courseId={a.courseId} title={a.title} due={a.due} />
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {pending ? (
        <form
          className="panel"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!who) return api.toast("Pick your name.");
            await save([...joined.filter((x) => x.cls.classId !== pending.classId), { cls: pending, studentId: who }]);
            setPending(null);
            api.toast(`Joined ${pending.name}`);
          }}
        >
          <h2 style={{ fontSize: "1.0625rem" }}>Join {pending.name}</h2>
          <label className="field" style={{ maxWidth: 360, marginTop: 8 }}>
            <span>Which one is you?</span>
            <select className="select" value={who} onChange={(e) => setWho(e.target.value)}>
              <option value="">Choose your name…</option>
              {pending.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit">
              Join class
            </button>
            <button className="btn ghost" type="button" onClick={() => setPending(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="small muted">
          Got a class file from your teacher?{" "}
          <button className="linkish" onClick={join}>
            Join a class
          </button>
        </p>
      )}
    </section>
  );
}
