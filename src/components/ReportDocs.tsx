// The printable homeschool reports. Each renders an <article class="doc"> that prints on its own
// (styles.css hides everything else when printing) and can be saved as an HTML file.

import { gradingOf, gradeLabel, isClassroom, type Family, type Student } from "../lib/family";
import { LEVEL_LABEL, letterFor, type Cutoffs } from "../lib/grades";
import {
  compliance,
  reportCard,
  transcript,
  workSamples,
  type Period,
  type PortfolioPhoto,
  type StudentData,
} from "../lib/reports";
import { stateInfo } from "../lib/states";
import { bookMinutes, type Activity, type BookEntry } from "../lib/records";
import type { DocumentRef } from "../lib/documents";
import { PortfolioWork } from "./WorkParts";

export const fmtDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
const short = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const pct = (p?: number) => (p === undefined ? "—" : `${Math.round(p)}%`);
const hrs = (h: number) => (h < 10 ? h.toFixed(1) : Math.round(h).toLocaleString());
const num2 = (n?: number) => (n === undefined ? "—" : n.toFixed(2));
const cred = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : n.toString());

function Letterhead({ family, student, title, sub }: { family: Family; student: Student; title: string; sub: string }) {
  const school = family.school;
  return (
    <header className="doc-head">
      <div>
        <p className="doc-school">{school?.name || (isClassroom(family) ? school?.administrator || "Classroom" : `${student.name}'s home school`)}</p>
        {school?.address && <p className="doc-small">{school.address}</p>}
        <p className="doc-small">{stateInfo(family.state)?.name}</p>
      </div>
      <div className="doc-title">
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
    </header>
  );
}

function Signature({ family, note }: { family: Family; note?: string }) {
  const today = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  return (
    <footer className="doc-foot">
      <div className="doc-sign">
        <div>
          <span className="doc-line" />
          <p className="doc-small">
            {family.school?.administrator || (isClassroom(family) ? "Teacher" : "Parent")}, {isClassroom(family) ? "teacher" : "school administrator"}
          </p>
        </div>
        <div>
          <span className="doc-line">{today}</span>
          <p className="doc-small">Date</p>
        </div>
      </div>
      <p className="doc-small doc-note">
        {note ??
          (isClassroom(family)
            ? "Prepared by the teacher from records kept in Erudior on the teacher's computer."
            : "Prepared by the parent from records kept in Erudior on the family's computer. The parent, as the home school's administrator, is responsible for the accuracy of this record.")}
      </p>
    </footer>
  );
}

function Scale({ cutoffs }: { cutoffs: Cutoffs }) {
  return (
    <p className="doc-small">
      Grading scale: A {cutoffs.A}–100, B {cutoffs.B}–{cutoffs.A - 1}, C {cutoffs.C}–{cutoffs.B - 1}, D {cutoffs.D}–{cutoffs.C - 1}, F below {cutoffs.D}. Plus
      and minus mark the top and bottom 30% of each band. GPA on a 4.0 scale (A+ counts 4.0); weighted GPA adds 0.5 for Honors and 1.0 for AP or dual credit.
    </p>
  );
}

// ---------- shared sections ----------

function ReadingList({ books }: { books: BookEntry[] }) {
  if (!books.length) return null;
  const sorted = [...books].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <>
      <h3>Reading log ({books.length} book{books.length === 1 ? "" : "s"})</h3>
      <ol className="doc-small doc-list">
        {sorted.map((b) => (
          <li key={b.id}>
            <cite>{b.title}</cite>
            {b.author && `, ${b.author}`} ({b.subject}, finished {short(b.date)}
            {b.minutes ? `; ${bookMinutes(b.minutes)} of reading recorded in the app` : ""}){b.note && `. ${b.note}`}
          </li>
        ))}
      </ol>
    </>
  );
}

function ActivityList({ acts, title = "Activities" }: { acts: Activity[]; title?: string }) {
  if (!acts.length) return null;
  const sorted = [...acts].sort((a, b) => a.kind.localeCompare(b.kind) || a.from.localeCompare(b.from));
  const total = acts.reduce((s, a) => s + a.hours, 0);
  return (
    <>
      <h3>{title}</h3>
      <table className="doc-table">
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr>
            <th scope="col">Activity</th>
            <th scope="col">Kind</th>
            <th scope="col">Dates</th>
            <th scope="col" className="r">
              Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) => (
            <tr key={a.id}>
              <td>
                {a.name}
                {a.role && `, ${a.role}`}
                {a.note && <span className="doc-comment">{a.note}</span>}
              </td>
              <td>{a.kind}</td>
              <td>
                {short(a.from)} {a.from.slice(0, 4)} – {a.to ? `${short(a.to)} ${a.to.slice(0, 4)}` : "ongoing"}
              </td>
              <td className="r">{a.hours ? a.hours.toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="doc-small">Total: {total.toLocaleString()} hours.</p>
    </>
  );
}

function DocsOnFile({ docs }: { docs: DocumentRef[] }) {
  if (!docs.length) return null;
  return (
    <>
      <h3>Documents on file</h3>
      <ul className="doc-small doc-list">
        {[...docs]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((x) => (
            <li key={x.id}>
              {fmtDate(x.date)}: {x.kind} ({x.name}){x.note && `. ${x.note}`}
            </li>
          ))}
      </ul>
      <p className="doc-small">Copies are kept by the parent and available on request.</p>
    </>
  );
}

// ---------- report card ----------

export function ReportCardDoc({ d, yearStart }: { d: StudentData; yearStart: string }) {
  const r = reportCard(d, yearStart);
  const { cutoffs, weights } = gradingOf(d.family);
  return (
    <article className="doc" aria-label="Report card">
      <Letterhead family={d.family} student={d.student} title="Report card" sub={`School year ${r.year.label}`} />
      <dl className="doc-facts">
        <div>
          <dt>Student</dt>
          <dd>{d.student.name}</dd>
        </div>
        <div>
          <dt>Grade</dt>
          <dd>{gradeLabel(r.gradeLevel)}</dd>
        </div>
        <div>
          <dt>School days</dt>
          <dd>{r.daysPresent}</dd>
        </div>
        <div>
          <dt>Hours of instruction</dt>
          <dd>{hrs(r.hours)}</dd>
        </div>
      </dl>
      {r.rows.length === 0 ? (
        <p>No courses on record for this school year.</p>
      ) : (
        <table className="doc-table">
          <caption className="sr-only">Courses and grades</caption>
          <thead>
            <tr>
              <th scope="col">Subject</th>
              <th scope="col">Course</th>
              <th scope="col" className="r">
                Percent
              </th>
              <th scope="col">Grade</th>
              <th scope="col" className="r">
                Credits
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.courseId}>
                <td>{row.subject}</td>
                <td>
                  {row.title}
                  {row.level !== "regular" && ` (${LEVEL_LABEL[row.level]})`}
                  {row.comment && <span className="doc-comment">{row.comment}</span>}
                  {row.overridden && row.overrideNote && <span className="doc-comment">Grade set by the parent: {row.overrideNote}</span>}
                </td>
                <td className="r">{pct(row.percent)}</td>
                <td>
                  <b>{row.letter ?? "—"}</b>
                </td>
                <td className="r">{row.credits ? cred(row.credits) : "—"}</td>
                <td>{row.status === "finished" ? `Finished ${short(row.finished!)}` : "In progress"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Scale cutoffs={cutoffs} />
      <p className="doc-small">
        Course percent: lesson quizzes {weights.lessons}%, module tests {weights.modules}%, final exam {weights.final}%, work graded by the parent{" "}
        {weights.parent}% (best score on each quiz and test; parts without scores yet are left out).
      </p>
      <Signature family={d.family} />
    </article>
  );
}

// ---------- transcript ----------

export function TranscriptDoc({ d }: { d: StudentData }) {
  const t = transcript(d);
  const { cutoffs } = gradingOf(d.family);
  return (
    <article className="doc" aria-label="High school transcript">
      <Letterhead family={d.family} student={d.student} title="High school transcript" sub="Official record of the home school" />
      <dl className="doc-facts">
        <div>
          <dt>Student</dt>
          <dd>{d.student.name}</dd>
        </div>
        {d.student.birthDate && (
          <div>
            <dt>Date of birth</dt>
            <dd>{fmtDate(d.student.birthDate)}</dd>
          </div>
        )}
        {d.student.graduation && (
          <div>
            <dt>Graduation</dt>
            <dd>{fmtDate(d.student.graduation)}</dd>
          </div>
        )}
        <div>
          <dt>Credits earned</dt>
          <dd>{cred(t.credits)}</dd>
        </div>
        <div>
          <dt>Cumulative GPA</dt>
          <dd>
            {num2(t.gpa)} unweighted · {num2(t.weightedGpa)} weighted
          </dd>
        </div>
      </dl>
      {t.years.length === 0 && <p>No high school credits on record yet.</p>}
      <div className="doc-years">
        {t.years.map((y) => (
          <section key={y.year.from} className="doc-year">
            <h3>
              {y.year.label} · {gradeLabel(y.gradeLevel)}
            </h3>
            <table className="doc-table">
              <caption className="sr-only">
                Courses in {y.year.label}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Course</th>
                  <th scope="col">Grade</th>
                  <th scope="col" className="r">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody>
                {y.lines.map((l, i) => (
                  <tr key={i}>
                    <td>
                      {l.title}
                      {l.level !== "regular" && ` (${LEVEL_LABEL[l.level]})`}
                      {l.where && <span className="doc-comment">{l.where}</span>}
                    </td>
                    <td>{l.status === "finished" ? (l.letter ?? "P") : "IP"}</td>
                    <td className="r">{l.status === "finished" ? cred(l.credits) : `(${cred(l.credits)})`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="doc-small">
              Year: {cred(y.credits)} credits · GPA {num2(y.gpa)} ({num2(y.weightedGpa)} weighted)
            </p>
          </section>
        ))}
      </div>
      {t.bySubject.length > 0 && (
        <p className="doc-small">
          Credits by subject: {t.bySubject.map((s) => `${s.subject} ${cred(s.credits)}`).join(" · ")}. IP = in progress (credits in parentheses not yet earned).
        </p>
      )}
      <ActivityList acts={d.records.activities} title="Activities and service" />
      <Scale cutoffs={cutoffs} />
      <p className="doc-small">One credit is a full-year course (about 120–180 hours). Courses taken elsewhere name the provider.</p>
      <Signature
        family={d.family}
        note="I certify that this is a true and accurate record of the student's high school work in our home school. Prepared with Erudior from records kept on the family's computer. Credits are awarded by the home school; Erudior is a study tool and does not grant credit or accreditation."
      />
    </article>
  );
}

// ---------- compliance report ----------

function MonthGrids({ from, to, marks }: { from: string; to: string; marks: Map<string, "S" | "N"> }) {
  const months: string[] = [];
  for (let m = from.slice(0, 7); m <= to.slice(0, 7); ) {
    months.push(m);
    const [y, mo] = m.split("-").map(Number);
    m = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`;
  }
  return (
    <div className="doc-months">
      {months.map((m) => {
        const [y, mo] = m.split("-").map(Number);
        const first = new Date(y, mo - 1, 1).getDay();
        const n = new Date(y, mo, 0).getDate();
        const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
        while (cells.length % 7) cells.push(null);
        const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
        return (
          <table key={m} className="doc-cal">
            <caption>{new Date(y, mo - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</caption>
            <thead>
              <tr>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <th key={i} scope="col" abbr={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i]}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((w, i) => (
                <tr key={i}>
                  {w.map((day, j) => {
                    if (!day) return <td key={j} />;
                    const date = `${m}-${String(day).padStart(2, "0")}`;
                    const mark = date >= from && date <= to ? marks.get(date) : undefined;
                    return (
                      <td key={j} className={mark === "S" ? "on" : undefined}>
                        {day}
                        {mark === "S" && <span className="sr-only"> school day</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
    </div>
  );
}

export function ComplianceDoc({ d, period, title }: { d: StudentData; period: Period; title?: string }) {
  const c = compliance(d, period);
  const st = stateInfo(d.family.state);
  const marks = new Map(c.days.filter((x) => x.status === "present" || x.status === "absent").map((x) => [x.date, x.status === "present" ? ("S" as const) : ("N" as const)]));
  const subjects = [...new Set([...c.bySubject.map((x) => x.subject), ...c.material.keys(), ...Object.keys(c.narratives)])];
  return (
    <article className="doc" aria-label="Homeschool progress report">
      <Letterhead
        family={d.family}
        student={d.student}
        title={title ?? "Homeschool progress report"}
        sub={`${period.label}: ${fmtDate(period.from)} to ${fmtDate(period.to)}`}
      />
      <dl className="doc-facts">
        <div>
          <dt>Student</dt>
          <dd>{d.student.name}</dd>
        </div>
        <div>
          <dt>Grade</dt>
          <dd>{gradeLabel(d.student.grade)}</dd>
        </div>
        <div>
          <dt>School days</dt>
          <dd>
            {c.daysPresent} this period · {c.daysPresentYear} this year{c.needDays ? ` of ${c.needDays}` : ""}
          </dd>
        </div>
        <div>
          <dt>Hours of instruction</dt>
          <dd>
            {hrs(c.hours)} this period · {hrs(c.hoursYear)} this year{c.needHours ? ` of ${c.needHours.toLocaleString()}` : ""}
          </dd>
        </div>
      </dl>

      <h3>Attendance</h3>
      <MonthGrids from={period.from} to={period.to} marks={marks} />
      <p className="doc-small">Shaded days are school days the parent confirmed.</p>

      <h3>Hours by subject</h3>
      {c.bySubject.length ? (
        <table className="doc-table narrow">
          <caption className="sr-only">Hours by subject</caption>
          <thead>
            <tr>
              <th scope="col">Subject</th>
              <th scope="col" className="r">
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {c.bySubject.map((b) => (
              <tr key={b.subject}>
                <td>{b.subject}</td>
                <td className="r">{hrs(b.hours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hours recorded in this period.</p>
      )}
      {st && st.subjects !== "None" && <p className="doc-small">Subjects {st.name} requires: {st.subjects}.</p>}

      <h3>Material covered and progress</h3>
      {subjects.length === 0 && <p>Nothing recorded in this period.</p>}
      {subjects.map((s) => {
        const lines = c.material.get(s) ?? [];
        const manual = c.manual.filter((m) => m.subject === s);
        const grades = c.grades.filter((g) => g.subject === s);
        return (
          <section key={s} className="doc-subject">
            <h4>{s}</h4>
            {lines.map((l) => (
              <div key={l.courseId}>
                <p>
                  <b>{l.title}</b>
                  {l.lessons.length > 0 && `: ${l.lessons.length} lesson${l.lessons.length === 1 ? "" : "s"} finished`}
                </p>
                {l.lessons.length > 0 && <p className="doc-small">{l.lessons.map((x) => x.title).join("; ")}.</p>}
                {l.tests.length > 0 && (
                  <p className="doc-small">
                    Tests: {l.tests.map((x) => `${x.title} ${Math.round(x.percent)}% (${short(x.date)})`).join("; ")}.
                  </p>
                )}
              </div>
            ))}
            {manual.length > 0 && (
              <p className="doc-small">
                Other learning: {manual.map((m) => `${short(m.date)} ${m.minutes} min${m.note ? ` (${m.note})` : ""}`).join("; ")}.
              </p>
            )}
            {grades.length > 0 && (
              <p>
                Grade{grades.length > 1 ? "s" : ""} to date: {grades.map((g) => `${g.title} ${pct(g.percent)} (${g.letter})`).join("; ")}
              </p>
            )}
            {c.narratives[s] && (
              <p>
                <b>Evaluation:</b> {c.narratives[s]}
              </p>
            )}
          </section>
        );
      })}

      {c.tests.length > 0 && (
        <>
          <h3>Standardized tests and evaluations</h3>
          <ul>
            {c.tests.map((t) => (
              <li key={t.id}>
                {fmtDate(t.date)}: {t.name}. {t.result}
                {t.notes && ` ${t.notes}`}
              </li>
            ))}
          </ul>
        </>
      )}
      <ReadingList books={d.records.reading.filter((b) => b.date >= period.from && b.date <= period.to)} />
      <ActivityList acts={d.records.activities.filter((a) => a.from <= period.to && (a.to || "9999") >= period.from)} />
      <DocsOnFile docs={d.records.documents.filter((x) => x.date >= c.year.from && x.date <= period.to)} />
      <Signature family={d.family} />
    </article>
  );
}

// ---------- portfolio ----------

export function PortfolioDoc({ d, yearStart, photos }: { d: StudentData; yearStart: string; photos: PortfolioPhoto[] }) {
  const r = reportCard(d, yearStart);
  const samples = workSamples(d, yearStart);
  const { cutoffs } = gradingOf(d.family);
  const mine = photos.filter((p) => p.date >= r.year.from && p.date <= r.year.to).sort((a, b) => a.date.localeCompare(b.date));
  const subjects = [...new Set([...r.rows.map((x) => x.subject), ...mine.map((p) => p.subject)])].sort();
  const lessonsIn = (courseId: string) =>
    Object.entries(d.progress.lessonsDone)
      .filter(([k, date]) => k.startsWith(`${courseId}/`) && date >= r.year.from && date <= r.year.to)
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([k, date]) => ({ date, title: d.courses.find((c) => c.id === courseId)?.lessons.find((l) => `${courseId}/${l.id}` === k)?.title ?? k }));
  return (
    <article className="doc" aria-label="Portfolio">
      <Letterhead family={d.family} student={d.student} title="Portfolio" sub={`School year ${r.year.label} · ${gradeLabel(r.gradeLevel)}`} />
      <dl className="doc-facts">
        <div>
          <dt>Student</dt>
          <dd>{d.student.name}</dd>
        </div>
        <div>
          <dt>School days</dt>
          <dd>{r.daysPresent}</dd>
        </div>
        <div>
          <dt>Hours of instruction</dt>
          <dd>{hrs(r.hours)}</dd>
        </div>
        <div>
          <dt>Materials used</dt>
          <dd>{r.rows.map((x) => x.title).join("; ") || "—"}</dd>
        </div>
      </dl>
      {subjects.map((s) => (
        <section key={s} className="doc-subject">
          <h3>{s}</h3>
          {r.rows
            .filter((x) => x.subject === s)
            .map((row) => {
              const lessons = lessonsIn(row.courseId);
              const work = samples.filter((w) => w.courseId === row.courseId);
              return (
                <div key={row.courseId}>
                  <h4>
                    {row.title}: {pct(row.percent)} {row.letter && `(${row.letter})`}
                  </h4>
                  {lessons.length > 0 && (
                    <p className="doc-small">
                      Log: {lessons.map((l) => `${short(l.date)} ${l.title}`).join("; ")}.
                    </p>
                  )}
                  {work.map((w) => (
                    <div key={w.attempt.id} className="doc-sample">
                      <p>
                        <b>
                          Work sample: {w.label}, {fmtDate(w.attempt.finishedAt.slice(0, 10))}, {w.attempt.correct} of {w.attempt.total} (
                          {letterFor((w.attempt.correct / Math.max(1, w.attempt.total)) * 100, cutoffs)})
                        </b>
                      </p>
                      <ol className="doc-small">
                        {w.questions.map((q, i) => (
                          <li key={i}>
                            {q.stem} <i>Answer given: {q.chosen}</i>
                            {q.correct ? " ✓" : ` ✗ (correct: ${q.answer})`}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                  <PortfolioWork
                    course={d.courses.find((c) => c.id === row.courseId)}
                    work={d.progress.work ?? {}}
                    reviews={d.records.reviews ?? {}}
                    logs={d.progress.logs ?? []}
                    from={r.year.from}
                    to={r.year.to}
                  />
                </div>
              );
            })}
          {mine
            .filter((p) => p.subject === s)
            .map((p) => (
              <figure key={p.id} className="doc-photo">
                <img src={p.image} alt={p.caption || `Work sample from ${fmtDate(p.date)}`} />
                <figcaption className="doc-small">
                  {fmtDate(p.date)}
                  {p.caption && `: ${p.caption}`}
                </figcaption>
              </figure>
            ))}
        </section>
      ))}
      {subjects.length === 0 && <p>Nothing on record for this school year yet.</p>}
      <ReadingList books={d.records.reading.filter((b) => b.date >= r.year.from && b.date <= r.year.to)} />
      <ActivityList acts={d.records.activities.filter((a) => a.from <= r.year.to && (a.to || "9999") >= r.year.from)} />
      <DocsOnFile docs={d.records.documents.filter((x) => x.date >= r.year.from && x.date <= r.year.to)} />
      <Signature family={d.family} />
    </article>
  );
}

/** A period ending today at the latest (reports for the current year stop at today). */
export function clampPeriod(p: Period, today: string): Period {
  return p.to > today && p.from <= today ? { ...p, to: today } : p;
}
