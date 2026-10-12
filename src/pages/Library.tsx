import type { AppApi } from "../App";
import type { Bank } from "../lib/types";
import * as store from "../lib/storage";
import { BankError, emptyBank, normalizeBank } from "../lib/validate";
import { courseCounts, emptyCourse, looksLikeCourse, normalizeCourse } from "../lib/course";
import { bankCoverage } from "../lib/session";
import { courseNumbers } from "../lib/planner";
import { daysBetween, today } from "../lib/srs";
import { percent, uid } from "../lib/util";

export default function Library({ api, broken, standalone }: { api: AppApi; broken: string[]; standalone: Bank[] }) {
  const { courses, progress } = api;

  async function importFile() {
    let text: string | null;
    try {
      text = await store.pickJsonFile();
    } catch (e) {
      api.toast(`Couldn't open the file: ${String(e)}`);
      return;
    }
    if (text === null) return;
    try {
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch (e) {
        throw new BankError(`This file isn't valid JSON: ${(e as Error).message}`);
      }
      if (looksLikeCourse(raw)) {
        let course = normalizeCourse(raw);
        const existing = courses.find((c) => c.id === course.id);
        if (existing) {
          const replace = await store.confirmAction(
            `"${existing.title}" is already in your library. Replace it with the imported file? Your progress is kept.\n\nChoose No to keep both.`,
          );
          if (!replace) course = normalizeCourse({ ...(raw as object), id: `${course.id}-${uid()}`, title: `${course.title} (copy)` });
        }
        await api.saveCourse(course);
        const n = courseCounts(course);
        api.toast(`Imported "${course.title}": ${n.lessons} lessons, ${n.questions} questions, ${n.cards} cards`);
        return;
      }
      let bank = normalizeBank(raw);
      const existing = standalone.find((b) => b.id === bank.id);
      if (existing) {
        const replace = await store.confirmAction(
          `"${existing.title}" is already in your library. Replace it with the imported file?\n\nChoose No to keep both.`,
        );
        if (!replace) bank = { ...bank, id: `${bank.id}-${uid()}`, title: `${bank.title} (copy)` };
      }
      await api.saveBank(bank);
      api.toast(`Imported "${bank.title}" with ${bank.questions.length} questions`);
    } catch (e) {
      api.toast(e instanceof BankError ? e.message : `Import failed: ${String(e)}`);
    }
  }

  async function newCourse() {
    const c = emptyCourse();
    await api.saveCourse(c);
    api.go({ name: "courseEdit", courseId: c.id, isNew: true });
  }

  async function newBank() {
    const bank = emptyBank();
    await api.saveBank(bank);
    api.go({ name: "editor", bankId: bank.id, isNew: true });
  }

  const lastAttempt = (bankId: string) => progress.attempts.find((a) => a.bankId === bankId && a.mode === "exam");

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Library</h1>
          <p className="muted">Each course keeps its own lessons, questions, notecards and progress.</p>
        </div>
        <div className="row">
          <button className="btn" onClick={newCourse}>
            New course
          </button>
          <button className="btn primary" onClick={importFile}>
            Import
          </button>
        </div>
      </div>

      {broken.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {broken.map((msg, i) => (
            <p key={i} className="notice error">
              A stored file couldn't be read. {msg}
            </p>
          ))}
        </div>
      )}

      <h2 className="section-title">Courses</h2>
      {courses.length === 0 ? (
        <div className="panel empty" style={{ marginBottom: 32 }}>
          <h2>No courses yet</h2>
          <p className="muted">Import a course file (.json) to get lessons, question banks, notecards and a study plan in one place.</p>
          <button className="btn primary" onClick={importFile}>
            Import a course
          </button>
        </div>
      ) : (
        <div className="course-list">
          {courses.map((c) => {
            const counts = courseCounts(c);
            const n = courseNumbers(c, progress);
            const plan = progress.plans[c.id];
            const daysLeft = plan ? daysBetween(today(), plan.examDate) : null;
            return (
              <button key={c.id} className="course-row" onClick={() => api.go({ name: "course", courseId: c.id })}>
                <div className="course-main">
                  <h2>{c.title}</h2>
                  {c.description && <p className="muted small clamp2">{c.description}</p>}
                  <p className="meta">
                    {[
                      counts.lessons && `${counts.lessons} lessons`,
                      counts.questions && `${counts.questions} questions`,
                      counts.cards && `${counts.cards} notecards`,
                      counts.drills && `${counts.drills} math drills`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <div className="course-stats">
                  <div className="stat">
                    <b>{counts.lessons ? `${n.lessonsDone}/${n.lessonsTotal}` : "None"}</b>
                    <span className="small muted">lessons done</span>
                  </div>
                  <div className="stat">
                    <b>{n.cardsDue}</b>
                    <span className="small muted">cards due</span>
                  </div>
                  <div className="stat">
                    <b>{daysLeft === null ? "No date" : daysLeft < 0 ? "Done" : daysLeft}</b>
                    <span className="small muted">{daysLeft !== null && daysLeft >= 0 ? "days to exam" : "exam"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="row" style={{ justifyContent: "space-between", margin: "36px 0 12px" }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          Standalone question banks
        </h2>
        <button className="btn sm" onClick={newBank}>
          New bank
        </button>
      </div>
      {standalone.length === 0 ? (
        <p className="muted small">Banks that aren't part of a course show up here.</p>
      ) : (
        <div className="bank-list">
          {standalone.map((b) => {
            const cov = bankCoverage(b, progress);
            const last = lastAttempt(b.id);
            return (
              <button key={b.id} className="bank-row" onClick={() => api.go({ name: "bank", bankId: b.id })}>
                <div>
                  <h2>{b.title}</h2>
                  <div className="meta">
                    {b.questions.length} questions
                    {b.sections.length > 0 && <>, {b.sections.map((s) => s.name).join(" and ")}</>}
                  </div>
                </div>
                <div className="stat">
                  <b>{percent(cov.seen, cov.total)}%</b>
                  <span className="small muted">studied</span>
                </div>
                <div className="stat">
                  <b>{last ? `${percent(last.correct, last.total)}%` : "None"}</b>
                  <span className="small muted">last exam</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
