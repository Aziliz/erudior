import { useEffect, useState } from "react";
import CompetencySupervisor from "../components/CompetencySupervisor";
import type { AppApi } from "../App";
import { CATALOG, courseFinished } from "../lib/catalog";
import {
  GRADES,
  SUBJECTS,
  gradeLabel,
  gradingOf,
  adultLabel,
  isClassroom,
  makeSecret,
  newStudent,
  passwordProblem,
  pinProblem,
  type Family,
  type Student,
} from "../lib/family";
import {
  addManual,
  confirmProposed,
  dayRows,
  emptyRecords,
  loadRecords,
  reminders,
  saveRecords,
  subjectOf,
  upcoming,
  yearSummary,
  type Records,
} from "../lib/records";
import { routeOptions, stateInfo, statesData } from "../lib/states";
import { addDays, today } from "../lib/srs";
import * as store from "../lib/storage";
import {
  decryptText,
  exportEncrypted,
  isEncryptedBackup,
  restoreContents,
} from "../lib/backup";
import { uid } from "../lib/util";
import type { Progress } from "../lib/types";
import { deleteStudentWithSubmissionHistory } from "../lib/classroomSubmissionStore";
import { GradesTab, ReportsTab } from "./ParentRecords";
import {
  ClassOverview,
  ClassesTab,
  GradebookTab,
  HandinsTab,
} from "./TeacherTabs";
import LiveHost from "./LiveHost";
import LearningGames from "./LearningGames";
import Presentations from "./Presentations";
import { LIVE } from "../lib/live";
import { DocumentsTab, ReadingTab } from "./ParentFiles";
import { StudentWorkTab } from "./StudentWork";
import {
  DEFAULT_WEIGHTS,
  MIN_CUTOFFS as MIN,
  cutoffProblem,
  type Cutoffs,
  type Weights,
} from "../lib/grades";

export type ParentTab =
  | "overview"
  | "learning-paths"
  | "attendance"
  | "courses"
  | "grades"
  | "reading"
  | "documents"
  | "reports"
  | "students"
  | "state"
  | "settings"
  | "classes"
  | "gradebook"
  | "handins"
  | "work"
  | "live"
  | "games"
  | "presentations";

const CLASS_TABS: { id: ParentTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "learning-paths", label: "Learning paths" },
  { id: "classes", label: "Classes" },
  { id: "gradebook", label: "Gradebook" },
  { id: "handins", label: "Hand-ins" },
  { id: "work", label: "Student work" },
  { id: "grades", label: "Grades" },
  { id: "reports", label: "Reports" },
  { id: "students", label: "Students" },
  { id: "games", label: "Learning games" },
  { id: "presentations", label: "Interactive presentations" },
  ...(LIVE ? [{ id: "live" as const, label: "Live room" }] : []),
  { id: "settings", label: "Settings and backup" },
];

const TABS: { id: ParentTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "learning-paths", label: "Learning paths" },
  { id: "attendance", label: "Attendance and hours" },
  { id: "courses", label: "Courses" },
  { id: "grades", label: "Grades" },
  { id: "work", label: "Student work" },
  { id: "reading", label: "Reading and activities" },
  { id: "documents", label: "Documents" },
  { id: "reports", label: "Reports" },
  { id: "students", label: "Students" },
  { id: "state", label: "State rules" },
  { id: "games", label: "Learning games" },
  { id: "presentations", label: "Interactive presentations" },
  ...(LIVE ? [{ id: "live" as const, label: "Live room" }] : []),
  { id: "settings", label: "Settings and backup" },
];

const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const fmtHours = (h: number) =>
  h < 10 ? h.toFixed(1) : Math.round(h).toLocaleString();
const fmtMinutes = (m: number) =>
  m >= 60
    ? `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`
    : `${Math.round(m)} min`;

type RecordsMap = Record<string, Records>;

export default function ParentArea({
  api,
  family,
  tab,
  onLock,
}: {
  api: AppApi;
  family: Family;
  tab: ParentTab;
  onLock: () => void;
}) {
  const [records, setRecords] = useState<RecordsMap | null>(null);
  const classroom = isClassroom(family);

  useEffect(() => {
    (async () => {
      const out: RecordsMap = {};
      for (const s of family.students) out[s.id] = await loadRecords(s.id);
      setRecords(out);
    })();
  }, [family.students]);

  const saveRec = async (id: string, r: Records) => {
    await saveRecords(id, r);
    setRecords((m) => ({ ...(m ?? {}), [id]: r }));
  };

  return (
    <div className="page">
      <div className="page-head no-print">
        <div>
          <h1>{adultLabel(family)} area</h1>
          <p className="muted">
            {classroom
              ? family.school?.name ||
                family.school?.administrator ||
                "Classroom"
              : (stateInfo(family.state)?.name ?? family.state)}{" "}
            · School year {fmtDate(family.year.start)} to{" "}
            {fmtDate(family.year.end)}
          </p>
        </div>
        <button className="btn" onClick={onLock}>
          Lock
        </button>
      </div>
      <nav
        className="tabs no-print"
        aria-label={`${adultLabel(family)} sections`}
      >
        {(classroom ? CLASS_TABS : TABS).map((t) => (
          <button
            key={t.id}
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => api.go({ name: "parent", tab: t.id })}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {!records ? (
        <p className="muted">Loading records…</p>
      ) : (
        <>
          {tab === "overview" &&
            (classroom ? (
              <ClassOverview api={api} family={family} />
            ) : (
              <Overview api={api} family={family} records={records} />
            ))}
          {tab === "learning-paths" && <CompetencySupervisor api={api} family={family} />}
          {tab === "classes" && <ClassesTab api={api} family={family} />}
          {tab === "gradebook" && <GradebookTab api={api} family={family} />}
          {tab === "handins" && <HandinsTab api={api} family={family} />}
          {tab === "work" && <StudentWorkTab api={api} family={family} />}
          {tab === "live" && LIVE && <LiveHost api={api} />}
          {tab === "games" && <LearningGames api={api} />}
          {tab === "presentations" && <Presentations api={api} />}
          {tab === "attendance" && (
            <Attendance
              api={api}
              family={family}
              records={records}
              saveRec={saveRec}
            />
          )}
          {tab === "courses" && <Courses api={api} family={family} />}
          {tab === "grades" && <GradesTab api={api} family={family} />}
          {tab === "reports" && <ReportsTab api={api} family={family} />}
          {tab === "reading" && <ReadingTab api={api} family={family} />}
          {tab === "documents" && <DocumentsTab api={api} family={family} />}
          {tab === "students" && <Students api={api} family={family} />}
          {tab === "state" && <StateTab api={api} family={family} />}
          {tab === "settings" && <Settings api={api} family={family} />}
        </>
      )}
    </div>
  );
}

// ---------- Overview ----------

function Meter({
  label,
  have,
  need,
  pace,
  whole,
}: {
  label: string;
  have: number;
  need?: number;
  pace: number;
  whole?: boolean;
}) {
  const show = whole ? have.toLocaleString() : fmtHours(have);
  if (!need)
    return (
      <div className="stat">
        <b>{show}</b>
        <span className="small muted">{label} (no state minimum)</span>
      </div>
    );
  const pct = Math.min(100, Math.round((have / need) * 100));
  const behind = have < need * pace * 0.9;
  return (
    <div className="meter-block">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span>
          <b>{show}</b> of {need.toLocaleString()} {label}
        </span>
        <span className="small muted">
          {behind ? "Behind pace" : "On pace"}
        </span>
      </div>
      <div
        className={`bar ${behind ? "low" : ""}`}
        role="img"
        aria-label={`${pct}% of the yearly minimum`}
      >
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Overview({
  api,
  family,
  records,
}: {
  api: AppApi;
  family: Family;
  records: RecordsMap;
}) {
  const due = upcoming(family);
  const now = today();
  const [text, setText] = useState("");
  const [date, setDate] = useState(addDays(now, 7));

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Coming up</h2>
          <span className="small muted">Next 45 days and anything overdue</span>
        </div>
        {due.length === 0 ? (
          <p className="muted small">Nothing due soon.</p>
        ) : (
          <ul className="reminder-list">
            {due.map((r) => (
              <li key={r.key} className={r.date < now ? "overdue" : ""}>
                <span className="small">
                  <b>
                    {r.date < now ? "Overdue: " : ""}
                    {fmtDate(r.date)}
                  </b>
                </span>
                <span>{r.text}</span>
                <button
                  className="btn sm"
                  onClick={() =>
                    api.setFamily({ ...family, done: [...family.done, r.key] })
                  }
                >
                  Done<span className="sr-only">: {r.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="row"
          style={{ marginTop: 12 }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!text.trim()) return;
            await api.setFamily({
              ...family,
              reminders: [
                ...family.reminders,
                { id: uid("r"), date, text: text.trim() },
              ],
            });
            setText("");
            api.toast("Reminder added");
          }}
        >
          <label className="field grow">
            <span>Add your own reminder</span>
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Book the standardized test"
            />
          </label>
          <label className="field">
            <span>Date</span>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <button
            className="btn"
            type="submit"
            style={{ alignSelf: "flex-end" }}
          >
            Add
          </button>
        </form>
      </section>

      {family.students.map((s) => {
        const r = records[s.id] ?? emptyRecords();
        const y = yearSummary(r, family, s);
        return (
          <section key={s.id} className="panel">
            <div className="panel-head">
              <h2>
                {s.name}{" "}
                <span className="small muted">({gradeLabel(s.grade)})</span>
              </h2>
              {y.daysProposed > 0 && (
                <button
                  className="btn sm primary"
                  onClick={() => api.go({ name: "parent", tab: "attendance" })}
                >
                  {y.daysProposed} day{y.daysProposed === 1 ? "" : "s"} to
                  confirm
                </button>
              )}
            </div>
            <div className="meters">
              <Meter
                label="school days"
                have={y.daysPresent}
                need={y.needDays}
                pace={y.yearElapsed}
                whole
              />
              <Meter
                label="hours"
                have={y.hours}
                need={y.needHours}
                pace={y.yearElapsed}
              />
            </div>
            {y.state?.rules.either && y.needDays && y.needHours && (
              <p className="small muted">
                {y.state.name} accepts either the days or the hours.
              </p>
            )}
            {y.state?.rules.guidance && (
              <p className="small muted">
                These minimums are the state agency's reading, not statute (see
                State rules).
              </p>
            )}
            {y.bySubject.length > 0 ? (
              <table className="table" style={{ marginTop: 12 }}>
                <caption className="sr-only">
                  Hours by subject for {s.name}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col" className="r">
                      Hours this year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {y.bySubject.map((b) => (
                    <tr key={b.subject}>
                      <td>{b.subject}</td>
                      <td className="r">{fmtHours(b.hours)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="small muted" style={{ marginTop: 12 }}>
                No learning recorded yet this school year.
              </p>
            )}
            {y.state && y.state.subjects !== "None" && (
              <p className="small muted" style={{ marginTop: 8 }}>
                {y.state.name} subjects: {y.state.subjects}
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}

// ---------- Attendance ----------

const STATUS: Record<string, string> = {
  present: "School day",
  absent: "Not a school day",
  proposed: "Proposed",
  short: "Under the daily minimum",
  none: "",
};

function Attendance({
  api,
  family,
  records,
  saveRec,
}: {
  api: AppApi;
  family: Family;
  records: RecordsMap;
  saveRec: (id: string, r: Records) => Promise<void>;
}) {
  const [sid, setSid] = useState(family.students[0].id);
  const s = family.students.find((x) => x.id === sid) ?? family.students[0];
  const r = records[s.id] ?? emptyRecords();
  const rows = dayRows(r, family);
  const proposed = rows.filter((x) => x.status === "proposed").length;
  const [form, setForm] = useState({
    date: today(),
    minutes: 60,
    subject: "Other",
    note: "",
  });

  const setDay = (date: string, v: "present" | "absent" | null) => {
    const days = { ...r.days };
    if (v) days[date] = v;
    else delete days[date];
    return saveRec(s.id, { ...r, days });
  };

  async function downloadCsv() {
    const q = (x: string) => `"${x.replace(/"/g, '""')}"`;
    const lines = ["Date,Minutes,Status,Subjects and notes"];
    for (const row of [...rows].reverse()) {
      const parts = [
        ...Object.entries(r.time[row.date] ?? {}).map(
          ([c, sec]) =>
            `${subjectOf(c, s)} (${Math.round(sec / 60)} min, in app)`,
        ),
        ...r.manual
          .filter((m) => m.date === row.date)
          .map(
            (m) =>
              `${m.subject} (${m.minutes} min${m.note ? `: ${m.note}` : ""})`,
          ),
      ];
      lines.push(
        [
          row.date,
          Math.round(row.minutes),
          STATUS[row.status] || "",
          q(parts.join("; ")),
        ].join(","),
      );
    }
    if (
      await store.exportText(
        lines.join("\n") + "\n",
        `attendance-${s.name.replace(/\W+/g, "-")}-${family.year.start.slice(0, 4)}.csv`,
        "CSV",
        "csv",
      )
    )
      api.toast("Attendance saved");
  }

  return (
    <>
      <div
        className="row"
        style={{ marginBottom: 16, justifyContent: "space-between" }}
      >
        <label className="field">
          <span>Student</span>
          <select
            className="select"
            value={s.id}
            onChange={(e) => setSid(e.target.value)}
          >
            {family.students.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <button className="btn" onClick={downloadCsv}>
            Download attendance (CSV)
          </button>
          <button
            className="btn primary"
            disabled={!proposed}
            onClick={() =>
              saveRec(s.id, confirmProposed(r, family)).then(() =>
                api.toast(
                  `Confirmed ${proposed} day${proposed === 1 ? "" : "s"}`,
                ),
              )
            }
          >
            Confirm {proposed || "no"} proposed day{proposed === 1 ? "" : "s"}
          </button>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Add learning time</h2>
          <span className="small muted">
            Field trips, reading, sports, music lessons…
          </span>
        </div>
        <form
          className="form-grid four"
          onSubmit={async (e) => {
            e.preventDefault();
            if (form.minutes <= 0) return;
            await saveRec(
              s.id,
              addManual(r, { ...form, note: form.note.trim() }),
            );
            setForm((f) => ({ ...f, note: "" }));
            api.toast("Time added");
          }}
        >
          <label className="field">
            <span>Date</span>
            <input
              className="input"
              type="date"
              value={form.date}
              max={today()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Minutes</span>
            <input
              className="input"
              type="number"
              min={5}
              max={720}
              step={5}
              value={form.minutes}
              onChange={(e) =>
                setForm({ ...form, minutes: Number(e.target.value) || 0 })
              }
            />
          </label>
          <label className="field">
            <span>Subject</span>
            <select
              className="select"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              {SUBJECTS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Note (optional)</span>
            <input
              className="input"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>
          <div>
            <button className="btn" type="submit">
              Add time
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Days</h2>
          <span className="small muted">
            A day with {fmtMinutes(family.dailyMinutes)} or more is proposed.
            You decide.
          </span>
        </div>
        {rows.length === 0 ? (
          <p className="muted small">
            No learning recorded this school year yet.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">Days for {s.name}</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col" className="r">
                    Time
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date}>
                    <td>{fmtDate(row.date)}</td>
                    <td className="r">{fmtMinutes(row.minutes)}</td>
                    <td>
                      <span
                        className={`pill ${row.status === "present" ? "pass" : row.status === "absent" ? "fail" : "neutral"}`}
                      >
                        {STATUS[row.status] || "None"}
                      </span>
                    </td>
                    <td>
                      <div className="row">
                        {row.status !== "present" && (
                          <button
                            className="btn sm"
                            onClick={() => setDay(row.date, "present")}
                          >
                            School day
                            <span className="sr-only">
                              : {fmtDate(row.date)}
                            </span>
                          </button>
                        )}
                        {row.status !== "absent" && (
                          <button
                            className="btn sm ghost"
                            onClick={() => setDay(row.date, "absent")}
                          >
                            Not a school day
                            <span className="sr-only">
                              : {fmtDate(row.date)}
                            </span>
                          </button>
                        )}
                        {(row.status === "present" ||
                          row.status === "absent") && (
                          <button
                            className="btn sm ghost"
                            onClick={() => setDay(row.date, null)}
                          >
                            Undo
                            <span className="sr-only">
                              : {fmtDate(row.date)}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {r.manual.length > 0 && (
        <section className="panel">
          <div className="panel-head">
            <h2>Time added by hand</h2>
          </div>
          <ul className="plain-list">
            {[...r.manual].reverse().map((m) => (
              <li
                key={m.id}
                className="row"
                style={{ justifyContent: "space-between" }}
              >
                <span>
                  {fmtDate(m.date)}: {m.subject}, {fmtMinutes(m.minutes)}
                  {m.note && <span className="muted"> ({m.note})</span>}
                </span>
                <button
                  className="btn sm ghost"
                  onClick={() =>
                    saveRec(s.id, {
                      ...r,
                      manual: r.manual.filter((x) => x.id !== m.id),
                    })
                  }
                >
                  Delete<span className="sr-only"> this entry</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

// ---------- Courses ----------

function Courses({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0].id);
  const s = family.students.find((x) => x.id === sid) ?? family.students[0];
  const [progress, setProgress] = useState<Progress | null>(null);
  const [pick, setPick] = useState("");
  const [subject, setSubject] = useState<string>("Math");

  useEffect(() => {
    store
      .loadState(`progress-${s.id}`)
      .then((t) =>
        setProgress(t ? (JSON.parse(t) as Progress) : store.emptyProgress()),
      );
  }, [s.id]);

  const options = [
    ...CATALOG.map((e) => ({ id: e.id, title: e.title })),
    ...api.allCourses
      .filter((c) => !CATALOG.some((e) => e.id === c.id) && !c.community)
      .map((c) => ({ id: c.id, title: `${c.title} (your course)` })),
  ].filter((o) => !s.assigned.some((a) => a.courseId === o.id));
  const title = (id: string) =>
    CATALOG.find((e) => e.id === id)?.title ??
    api.allCourses.find((c) => c.id === id)?.title ??
    id;

  const update = (st: Student) =>
    api.setFamily({
      ...family,
      students: family.students.map((x) => (x.id === st.id ? st : x)),
    });
  const move = (i: number, d: -1 | 1) => {
    const a = [...s.assigned];
    [a[i], a[i + d]] = [a[i + d], a[i]];
    return update({ ...s, assigned: a });
  };

  return (
    <>
      <label className="field" style={{ marginBottom: 16, maxWidth: 320 }}>
        <span>Student</span>
        <select
          className="select"
          value={s.id}
          onChange={(e) => setSid(e.target.value)}
        >
          {family.students.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </label>
      <section className="panel">
        <div className="panel-head">
          <h2>{s.name}'s courses</h2>
          <span className="small muted">
            In each subject the first unfinished course is current; the next one
            opens when it's finished.
          </span>
        </div>
        {s.assigned.length === 0 ? (
          <p className="muted small">No courses assigned yet.</p>
        ) : (
          <ol className="assign-list">
            {s.assigned.map((a, i) => {
              const f = progress
                ? courseFinished(
                    a.courseId,
                    progress,
                    api.allCourses.find((c) => c.id === a.courseId),
                  )
                : null;
              return (
                <li key={a.courseId} className="row">
                  <span className="pill neutral">{a.subject}</span>
                  <b className="grow">{title(a.courseId)}</b>
                  <span className="small muted">
                    {f
                      ? f.done
                        ? "Finished"
                        : `${f.lessonsDone} of ${f.lessons} lessons`
                      : ""}
                  </span>
                  <button
                    className="btn sm ghost"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    Up<span className="sr-only">: {title(a.courseId)}</span>
                  </button>
                  <button
                    className="btn sm ghost"
                    disabled={i === s.assigned.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    Down<span className="sr-only">: {title(a.courseId)}</span>
                  </button>
                  <button
                    className="btn sm ghost"
                    onClick={() =>
                      update({
                        ...s,
                        assigned: s.assigned.filter(
                          (x) => x.courseId !== a.courseId,
                        ),
                      })
                    }
                  >
                    Remove<span className="sr-only">: {title(a.courseId)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
        <form
          className="row"
          style={{ marginTop: 16, alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!pick) return;
            await update({
              ...s,
              assigned: [...s.assigned, { courseId: pick, subject }],
            });
            setPick("");
          }}
        >
          <label className="field grow">
            <span>Course</span>
            <select
              className="select"
              value={pick}
              onChange={(e) => {
                setPick(e.target.value);
                setSubject(subjectOf(e.target.value, undefined));
              }}
            >
              <option value="">Choose a course…</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Counts toward</span>
            <select
              className="select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <button className="btn primary" type="submit" disabled={!pick}>
            Assign
          </button>
        </form>
        <label className="check" style={{ marginTop: 16 }}>
          <input
            type="checkbox"
            checked={s.freeChoice}
            onChange={(e) => update({ ...s, freeChoice: e.target.checked })}
          />
          {s.name} may also start courses that aren't assigned
        </label>
      </section>
    </>
  );
}

// ---------- Students ----------

function Students({ api, family }: { api: AppApi; family: Family }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const update = (st: Student) =>
    api.setFamily({
      ...family,
      students: family.students.map((x) => (x.id === st.id ? st : x)),
    });

  async function remove(st: Student) {
    if (family.students.length === 1)
      return api.toast("A family needs at least one student.");
    const ok = await store.confirmAction(
      `Remove ${st.name}? Their progress, attendance records, saved classroom hand-ins and review history are deleted from this computer. Class roster references are removed. An ID-only deletion marker prevents old hand-ins from recreating the profile. Back up first; existing backups, exported files and shared attachment storage are not deleted.`,
      "Remove student",
    );
    if (!ok) return;
    try {
      const updated = await deleteStudentWithSubmissionHistory(st.id, family);
      // Never leave future saves pointed at a profile whose state was deleted.
      if (store.activeStudent() === st.id) store.useStudentFiles(null);
      if (api.reloadClassroomState) await api.reloadClassroomState();
      else await api.setFamily(updated);
      if (api.student?.id === st.id) await api.chooseStudent(updated.students[0].id);
      api.toast(`Removed ${st.name}, including saved hand-ins and review history`);
    } catch (error) {
      api.toast(`Student deletion did not finish: ${error instanceof Error ? error.message : String(error)}. Reload and retry removal; some data may already be deleted.`);
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Students</h2>
      </div>
      <ul className="plain-list">
        {family.students.map((st) => (
          <li key={st.id} className="row student-row">
            <label className="field grow">
              <span>Name</span>
              <input
                className="input"
                defaultValue={st.name}
                onBlur={(e) =>
                  e.target.value.trim() &&
                  e.target.value.trim() !== st.name &&
                  update({ ...st, name: e.target.value.trim() })
                }
              />
            </label>
            <label className="field">
              <span>Grade</span>
              <select
                className="select"
                value={st.grade}
                onChange={(e) =>
                  update({ ...st, grade: Number(e.target.value) })
                }
              >
                {GRADES.map((_, g) => (
                  <option key={g} value={g}>
                    {gradeLabel(g)}
                  </option>
                ))}
              </select>
            </label>
            {st.grade >= 8 && (
              <>
                <label className="field">
                  <span>Date of birth (transcript, optional)</span>
                  <input
                    className="input"
                    type="date"
                    value={st.birthDate ?? ""}
                    onChange={(e) =>
                      update({ ...st, birthDate: e.target.value || undefined })
                    }
                  />
                </label>
                <label className="field">
                  <span>Graduation date (optional)</span>
                  <input
                    className="input"
                    type="date"
                    value={st.graduation ?? ""}
                    onChange={(e) =>
                      update({ ...st, graduation: e.target.value || undefined })
                    }
                  />
                </label>
              </>
            )}
            <button className="btn sm ghost" onClick={() => remove(st)}>
              Remove<span className="sr-only"> {st.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <form
        className="row student-row"
        style={{ marginTop: 16, alignItems: "flex-end" }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return;
          const st = newStudent(name, grade);
          await store.saveState(
            `progress-${st.id}`,
            JSON.stringify({
              ...store.emptyProgress(),
              catalogV1: true,
              enrolled: [],
            }),
          );
          await api.setFamily({
            ...family,
            students: [...family.students, st],
          });
          setName("");
          api.toast(`Added ${st.name}`);
        }}
      >
        <label className="field grow">
          <span>New student's name</span>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="field">
          <span>Grade</span>
          <select
            className="select"
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
          >
            {GRADES.map((_, g) => (
              <option key={g} value={g}>
                {gradeLabel(g)}
              </option>
            ))}
          </select>
        </label>
        <button className="btn primary" type="submit">
          Add student
        </button>
      </form>
    </section>
  );
}

// ---------- State rules ----------

function StateTab({ api, family }: { api: AppApi; family: Family }) {
  const [code, setCode] = useState(family.state);
  const s = stateInfo(code);
  const mine = code === family.state;
  const rows: [string, string][] = s
    ? [
        ["Compulsory ages", s.ages],
        ["Notice", s.notice],
        ["Days and hours", s.time],
        ["Subjects", s.subjects],
        ["Testing or evaluation", s.assessment],
        ["Records to keep", s.records],
        ["Parent qualifications", s.teacher],
        ["Other legal routes", s.routes],
      ]
    : [];
  return (
    <>
      <div className="row" style={{ marginBottom: 16, alignItems: "flex-end" }}>
        <label className="field">
          <span>State</span>
          <select
            className="select"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          >
            {statesData().states.map((x) => (
              <option key={x.code} value={x.code}>
                {x.name}
                {x.code === family.state ? " (yours)" : ""}
              </option>
            ))}
          </select>
        </label>
        {!mine && (
          <button
            className="btn"
            onClick={() =>
              api
                .setFamily({
                  ...family,
                  state: code,
                  route: "Home education law",
                })
                .then(() => api.toast("State changed"))
            }
          >
            Make this our state
          </button>
        )}
        {mine && s && (
          <label className="field">
            <span>How you homeschool</span>
            <select
              className="select"
              value={family.route}
              onChange={(e) =>
                api.setFamily({ ...family, route: e.target.value })
              }
            >
              {routeOptions(s).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {s && (
        <section className="panel">
          <div className="panel-head">
            <h2>{s.name}</h2>
            <span className="small muted">
              Last checked {fmtDate(s.checked)}
            </span>
          </div>
          <dl className="rules-list">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {s.unsettled && (
            <p className="notice" style={{ marginTop: 12 }}>
              Not settled: {s.unsettled}
            </p>
          )}
          <h3 style={{ marginTop: 16 }}>Sources</h3>
          <ul className="plain-list small">
            {s.sources.map((u) => (
              <li key={u}>
                <a
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    // The desktop app opens links in the system browser.
                    if (!store.inApp) return;
                    e.preventDefault();
                    import("@tauri-apps/plugin-opener")
                      .then((o) => o.openUrl(u))
                      .catch(() => api.toast("Couldn't open the browser."));
                  }}
                >
                  {new URL(u).hostname}
                  <span className="sr-only"> (opens in your browser)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="small muted" style={{ marginTop: 12 }}>
            A summary to help you keep track, not legal advice. Laws change;
            check the sources, your state's education department, or a
            homeschool association. Rules version {statesData().version}.
          </p>
        </section>
      )}
    </>
  );
}

// ---------- Settings ----------

function Settings({ api, family }: { api: AppApi; family: Family }) {
  const [start, setStart] = useState(family.year.start);
  const [end, setEnd] = useState(family.year.end);
  const [minutes, setMinutes] = useState(family.dailyMinutes);
  const [pw, setPw] = useState("");
  const [pin, setPin] = useState("");
  const [bpass, setBpass] = useState("");
  const [rpass, setRpass] = useState("");
  const [msg, setMsg] = useState("");

  async function saveYear(e: React.FormEvent) {
    e.preventDefault();
    if (end <= start)
      return api.toast("The school year has to end after it starts.");
    await api.setFamily({
      ...family,
      year: { start, end },
      dailyMinutes: Math.max(15, minutes),
    });
    api.toast("School year saved");
  }

  async function newYear() {
    const next = {
      start: addDays(family.year.end, 1),
      end: addDays(
        family.year.end,
        1 +
          (Date.parse(family.year.end) - Date.parse(family.year.start)) /
            86400000,
      ),
    };
    const ok = await store.confirmAction(
      `Start the ${next.start.slice(0, 4)}–${next.end.slice(0, 4)} school year? Every student moves up a grade. Last year's records stay and can still be downloaded.`,
      "New school year",
    );
    if (!ok) return;
    await api.setFamily({
      ...family,
      year: next,
      students: family.students.map((s) => ({
        ...s,
        grade: Math.min(12, s.grade + 1),
      })),
    });
    setStart(next.start);
    setEnd(next.end);
    api.toast("New school year started");
  }

  async function backup(e: React.FormEvent) {
    e.preventDefault();
    if (bpass.length < 8)
      return setMsg("Use a backup passphrase of at least 8 characters.");
    setMsg("");
    try {
      if (await exportEncrypted(api.allCourses, api.banks, bpass))
        api.toast("Encrypted backup saved");
      setBpass("");
    } catch (err) {
      setMsg(`Backup failed: ${String(err)}`);
    }
  }

  async function restore(e: React.FormEvent) {
    e.preventDefault();
    try {
      const text = await store.pickJsonFile();
      if (text === null) return;
      const raw = JSON.parse(text);
      if (!isEncryptedBackup(raw))
        return setMsg("That file isn't an encrypted Erudior family backup.");
      const plain = await decryptText(raw, rpass);
      const ok = await store.confirmAction(
        "Restore this backup? It replaces the family settings, every student's progress and records, and the courses on this computer.",
        "Restore backup",
      );
      if (!ok) return;
      await restoreContents(plain, {
        courses: api.allCourses,
        banks: api.banks,
      });
      window.location.reload();
    } catch (err) {
      setMsg((err as Error).message ?? String(err));
    }
  }

  return (
    <>
      <SchoolInfo api={api} family={family} />
      <Grading api={api} family={family} />
      <section className="panel">
        <div className="panel-head">
          <h2>School year</h2>
        </div>
        <form className="form-grid" onSubmit={saveYear}>
          <label className="field">
            <span>Starts</span>
            <input
              className="input"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Ends</span>
            <input
              className="input"
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
          {!isClassroom(family) && (
            <label className="field">
              <span>Minutes that make a school day</span>
              <input
                className="input"
                type="number"
                min={15}
                max={720}
                step={15}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value) || 0)}
              />
            </label>
          )}
          <div className="row span-2">
            <button className="btn primary" type="submit">
              Save
            </button>
            <button className="btn" type="button" onClick={newYear}>
              Start the next school year
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Parent sign-in</h2>
        </div>
        <form
          className="row"
          style={{ alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            const p = passwordProblem(pw);
            if (p) return api.toast(p);
            await api.setFamily({
              ...family,
              parent: { ...family.parent, password: await makeSecret(pw) },
            });
            setPw("");
            api.toast("Password changed");
          }}
        >
          <label className="field grow">
            <span>New password</span>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </label>
          <button className="btn" type="submit">
            Change password
          </button>
        </form>
        <form
          className="row"
          style={{ alignItems: "flex-end", marginTop: 16 }}
          onSubmit={async (e) => {
            e.preventDefault();
            const p = pinProblem(pin);
            if (p) return api.toast(p);
            await api.setFamily({
              ...family,
              parent: { ...family.parent, pin: await makeSecret(pin) },
            });
            setPin("");
            api.toast("PIN saved");
          }}
        >
          <label className="field grow">
            <span>
              {family.parent.pin
                ? "New PIN"
                : "PIN for quicker sign-in (optional, 4 to 8 digits)"}
            </span>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
          </label>
          <button className="btn" type="submit">
            {family.parent.pin ? "Change PIN" : "Turn on PIN"}
          </button>
          {family.parent.pin && (
            <button
              className="btn ghost"
              type="button"
              onClick={() =>
                api
                  .setFamily({
                    ...family,
                    parent: { ...family.parent, pin: undefined },
                  })
                  .then(() => api.toast("PIN turned off"))
              }
            >
              Turn off PIN
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Encrypted backup</h2>
        </div>
        <p className="muted small" style={{ marginBottom: 12 }}>
          One file with the family settings, every student's progress and
          records, and your courses, locked with a passphrase. Use it to move to
          another computer or after reinstalling. Without the passphrase it
          can't be opened.
        </p>
        <form
          className="row"
          style={{ alignItems: "flex-end" }}
          onSubmit={backup}
        >
          <label className="field grow">
            <span>Backup passphrase</span>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={bpass}
              onChange={(e) => setBpass(e.target.value)}
            />
          </label>
          <button className="btn primary" type="submit">
            Back up now
          </button>
        </form>
        <form
          className="row"
          style={{ alignItems: "flex-end", marginTop: 16 }}
          onSubmit={restore}
        >
          <label className="field grow">
            <span>Passphrase of the backup to restore</span>
            <input
              className="input"
              type="password"
              autoComplete="off"
              value={rpass}
              onChange={(e) => setRpass(e.target.value)}
            />
          </label>
          <button className="btn" type="submit">
            Restore from backup…
          </button>
        </form>
        <p
          className={msg ? "notice error" : "sr-only"}
          role="alert"
          style={{ marginTop: 12 }}
        >
          {msg}
        </p>
      </section>

      {!isClassroom(family) && (
        <section className="panel">
          <div className="panel-head">
            <h2>All reminders this year</h2>
          </div>
          <ul className="plain-list small">
            {reminders(family).map((r) => (
              <li
                key={r.key}
                className="row"
                style={{ justifyContent: "space-between" }}
              >
                <span>
                  <b>{fmtDate(r.date)}</b> {r.text}{" "}
                  {family.done.includes(r.key) && (
                    <span className="muted">(done)</span>
                  )}
                </span>
                {r.custom && (
                  <button
                    className="btn sm ghost"
                    onClick={() =>
                      api.setFamily({
                        ...family,
                        reminders: family.reminders.filter(
                          (x) => `custom:${x.id}` !== r.key,
                        ),
                      })
                    }
                  >
                    Delete<span className="sr-only">: {r.text}</span>
                  </button>
                )}
                {!r.custom && family.done.includes(r.key) && (
                  <button
                    className="btn sm ghost"
                    onClick={() =>
                      api.setFamily({
                        ...family,
                        done: family.done.filter((k) => k !== r.key),
                      })
                    }
                  >
                    Not done<span className="sr-only">: {r.text}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function SchoolInfo({ api, family }: { api: AppApi; family: Family }) {
  const [f, setF] = useState(
    family.school ?? { name: "", administrator: "", address: "" },
  );
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Home school</h2>
        <span className="small muted">
          Printed on report cards, transcripts and reports.
        </span>
      </div>
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await api.setFamily({
            ...family,
            school: {
              name: f.name.trim(),
              administrator: f.administrator.trim(),
              address: f.address.trim(),
            },
          });
          api.toast("Saved");
        }}
      >
        <label className="field">
          <span>School name</span>
          <input
            className="input"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            placeholder="e.g. Maple Street Academy"
          />
        </label>
        <label className="field">
          <span>Administrator (the parent who signs)</span>
          <input
            className="input"
            value={f.administrator}
            onChange={(e) => setF({ ...f, administrator: e.target.value })}
            autoComplete="name"
          />
        </label>
        <label className="field span-2">
          <span>Address (optional)</span>
          <input
            className="input"
            value={f.address}
            onChange={(e) => setF({ ...f, address: e.target.value })}
            autoComplete="street-address"
          />
        </label>
        <div className="span-2">
          <button className="btn primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </section>
  );
}

function Grading({ api, family }: { api: AppApi; family: Family }) {
  const g = gradingOf(family);
  const [c, setC] = useState<Record<keyof Cutoffs, string>>({
    A: String(g.cutoffs.A),
    B: String(g.cutoffs.B),
    C: String(g.cutoffs.C),
    D: String(g.cutoffs.D),
  });
  const [w, setW] = useState<Record<keyof Weights, string>>({
    lessons: String(g.weights.lessons),
    modules: String(g.weights.modules),
    final: String(g.weights.final),
    parent: String(g.weights.parent),
  });
  const [msg, setMsg] = useState("");
  const W: [keyof Weights, string][] = [
    ["lessons", "Lesson quizzes"],
    ["modules", "Module tests"],
    ["final", "Final exam"],
    ["parent", "Work you graded"],
  ];
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Grading</h2>
        <span className="small muted">
          A from 90, B from 80, C from 70, D from 60 at the loosest; you can
          raise them.
        </span>
      </div>
      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          const cutoffs = {
            A: Number(c.A),
            B: Number(c.B),
            C: Number(c.C),
            D: Number(c.D),
          };
          const weights = {
            lessons: Number(w.lessons),
            modules: Number(w.modules),
            final: Number(w.final),
            parent: Number(w.parent),
          };
          const p =
            cutoffProblem(cutoffs) ||
            (Object.values(weights).some((x) => !(x >= 0 && x <= 100)) &&
              "Weights go from 0 to 100.") ||
            (Object.values(weights).every((x) => x === 0) &&
              "At least one weight has to be above 0.") ||
            "";
          setMsg(p);
          if (p) return;
          await api.setFamily({ ...family, grading: { cutoffs, weights } });
          api.toast("Grading saved");
        }}
      >
        <fieldset className="plain-fieldset">
          <legend className="small">Lowest percent for each letter</legend>
          <div className="form-grid four">
            {(["A", "B", "C", "D"] as const).map((k) => (
              <label key={k} className="field">
                <span>{k}</span>
                <input
                  className="input"
                  type="number"
                  min={MIN[k]}
                  max={100}
                  value={c[k]}
                  onChange={(e) => setC({ ...c, [k]: e.target.value })}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="plain-fieldset">
          <legend className="small">
            What the course percent is made of (weights; parts with no scores
            yet are skipped)
          </legend>
          <div className="form-grid four">
            {W.map(([k, label]) => (
              <label key={k} className="field">
                <span>{label}</span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={100}
                  value={w[k]}
                  onChange={(e) => setW({ ...w, [k]: e.target.value })}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <p
          className={msg ? "notice error" : "sr-only"}
          role="alert"
          style={{ marginBottom: 12 }}
        >
          {msg}
        </p>
        <div className="row">
          <button className="btn primary" type="submit">
            Save
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setW({
                lessons: String(DEFAULT_WEIGHTS.lessons),
                modules: String(DEFAULT_WEIGHTS.modules),
                final: String(DEFAULT_WEIGHTS.final),
                parent: String(DEFAULT_WEIGHTS.parent),
              });
            }}
          >
            Default weights
          </button>
        </div>
      </form>
    </section>
  );
}
