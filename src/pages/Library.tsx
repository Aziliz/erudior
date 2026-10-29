import { TEMPORARY_GUEST, learningDraftStorage } from "../lib/guestSession";
import { assertCourseImportPreservesFields } from "../lib/courseImport";
import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import { CATALOG, courseFinished, facets, isPublishedCourse, prerequisites, type CatalogEntry } from "../lib/catalog";
import { currentAssignments, isClassroom } from "../lib/family";
import { ClassAssignments, MyClasses } from "../components/ClassViews";
import { LIVE } from "../lib/live";
import { ReviewPill } from "../components/CommunityCatalog";
import { REMOTE } from "../lib/courseSource";
import type { Bank } from "../lib/types";
import * as store from "../lib/storage";
import { BankError, emptyBank, normalizeBank } from "../lib/validate";
import { courseCounts, emptyCourse, exportCourseSnapshot, looksLikeCourse, normalizeCourse } from "../lib/course";
import { validateCourseWork, validateWorkLessonReferences } from "../lib/courseWork";
import { courseFromCanonicalAuthoring } from "../lib/canonicalAuthoring";
import { validateReaderTexts } from "../lib/readerContent";
import { bankCoverage } from "../lib/session";
import { courseNumbers } from "../lib/planner";
import { daysBetween, today } from "../lib/srs";
import { percent, uid } from "../lib/util";
import { subjectKey } from "../lib/taxonomy";
import { GENERAL_DISCLAIMER } from "../components/Terms";

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
        const source = (raw as { format?: string }).format === "erudior-canonical-authoring"
          ? courseFromCanonicalAuthoring(raw, { mode: "source", maxBytes: Number.MAX_SAFE_INTEGER }) : raw;
        const rawWorkErrors = [...validateCourseWork(source, { legacy: true }), ...validateReaderTexts((source as { texts?: unknown }).texts, { legacy: true })];
        if (rawWorkErrors.length) throw new BankError("Invalid course work: " + rawWorkErrors.join("; "));
        try { assertCourseImportPreservesFields(raw); } catch (error) { throw new Error("Invalid course work: " + (error as Error).message); }
        let course = normalizeCourse(raw);
        const workErrors = [...validateCourseWork(course, { moduleIds: course.modules.map(module => module.id) }), ...validateWorkLessonReferences(course, course.lessons), ...validateReaderTexts(course.texts, { questionIds: course.banks[0]?.questions.map(question => question.id) ?? [] })];
        if (workErrors.length) throw new BankError("Invalid course work: " + workErrors.join("; "));
        const existing = courses.find((c) => c.id === course.id);
        // A file can't replace an Erudior or community course: it comes in as a separate copy.
        if (isPublishedCourse(course) || isPublishedCourse(existing)) {
          course = normalizeCourse({ ...JSON.parse(exportCourseSnapshot(course)), id: `${course.id}-${uid()}`, title: `${course.title} (copy)`, community: undefined });
          api.toast(`"${course.title}" was imported as your own copy; the published course can't be replaced.`);
        } else if (existing) {
          const replace = await store.confirmAction(
            `"${existing.title}" is already in your library. Replace it with the imported file? Your progress is kept.\n\nChoose No to keep both.`,
          );
          if (!replace) course = normalizeCourse({ ...JSON.parse(exportCourseSnapshot(course)), id: `${course.id}-${uid()}`, title: `${course.title} (copy)` });
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
          <h1>{store.inApp || import.meta.env?.VITE_AS_DESKTOP === "1" ? "Library" : "Courses"}</h1>
          <p className="muted">Each course keeps its own lessons, questions, notecards and progress.</p>
        </div>
        <div className="row">
          {LIVE && !TEMPORARY_GUEST && (
            <><button className="btn" onClick={() => api.go({ name: "live" })}>
              Join a live room
            </button>
            <button className="btn" onClick={() => api.go({ name: "presentation" })}>Join presentation</button></>
          )}
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

      {api.family && api.student && isClassroom(api.family) && <ClassAssignments api={api} family={api.family} student={api.student} />}
      {api.student && !isClassroom(api.family) && api.student.assigned.length > 0 && <Assigned api={api} />}
      {!api.family && <MyClasses api={api} />}

      <h2 className="section-title">In progress</h2>
      {courses.length === 0 ? (
        <div className="panel" style={{ marginBottom: 8, padding: "18px 22px" }}>
          <h2 style={{ fontSize: "1.0625rem", marginBottom: 4 }}>No courses in progress</h2>
          <p className="muted">Pick a course from the catalog below and choose Start course, or import a course file (.json).</p>
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
                  {c.community && (
                    <p className="small muted">
                      Community course by {c.community.author} · <ReviewPill review={c.community.review} />
                    </p>
                  )}
                  {c.description && <p className="muted small clamp2">{c.description}</p>}
                  <p className="meta">
                    {[
                      n.lessonsTotal && `${n.lessonsTotal} lessons`,
                      n.honorsTotal && `${n.honorsTotal} honors lessons`,
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

      <Catalog api={api} />

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
      <p className="app-legal small faint">
        {GENERAL_DISCLAIMER}{" "}
        <button className="linkish" onClick={() => api.go({ name: "legal", page: "terms" })}>
          Terms of Use
        </button>{" "}
        ·{" "}
        <button className="linkish" onClick={() => api.go({ name: "legal", page: "privacy" })}>
          Privacy Policy
        </button>
      </p>
    </div>
  );
}

/** The parent's plan for this student: per subject, the current course and what comes next. */
function Assigned({ api }: { api: AppApi }) {
  const s = api.student!;
  const have = new Set(api.courses.map((c) => c.id));
  const finished = (id: string) => courseFinished(id, api.progress, api.allCourses.find((c) => c.id === id)).done;
  const current = currentAssignments(s, finished);
  const title = (id: string) => CATALOG.find((e) => e.id === id)?.title ?? api.allCourses.find((c) => c.id === id)?.title ?? id;
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 className="section-title">Assigned to {s.name}</h2>
      <ul className="assigned-list">
        {s.assigned.map((a) => {
          const done = finished(a.courseId);
          const now = current.has(a.courseId);
          const blocked = api.assignmentBlock(a.courseId);
          return (
            <li key={a.courseId} className="assigned-row">
              <span className="pill neutral">{a.subject}</span>
              <b>{title(a.courseId)}</b>
              <span className="small muted">{done ? "Finished" : now ? "Current" : blocked ?? "Up next"}</span>
              {now &&
                (have.has(a.courseId) ? (
                  <button className="btn sm" onClick={() => api.go({ name: "course", courseId: a.courseId })}>
                    Open
                  </button>
                ) : (
                  <button className="btn sm primary" onClick={() => api.addCourse(a.courseId)}>
                    Start
                  </button>
                ))}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type Filters = { q: string; subject: string[]; level: string[]; type: string[] };
/** Catalog cards per page. */
const PAGE_SIZE = 15;
const FILTER_KEY = "examiner.catalogFilters";

function readFilters(): Filters {
  try {
    const f = JSON.parse(learningDraftStorage.getItem(FILTER_KEY) ?? "null");
    if (f && Array.isArray(f.subject)) return { q: "", subject: f.subject, level: f.level ?? [], type: f.type ?? [] };
  } catch {
    /* no saved filters */
  }
  return { q: "", subject: [], level: [], type: [] };
}

function matches(e: CatalogEntry, f: Filters): boolean {
  const any = (want: string[], have: string[]) => want.length === 0 || want.some((w) => have.includes(w));
  if (!any(f.subject, [e.subject]) || !any(f.level, e.level) || !any(f.type, e.type)) return false;
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = `${e.title} ${e.description} ${e.subject} ${e.level.join(" ")} ${e.type.join(" ")}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/** Every course that ships with the app, with search and filters. Adding one puts it under In progress. */
function Catalog({ api }: { api: AppApi }) {
  const [f, setF] = useState<Filters>(readFilters);
  const [adding, setAdding] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const opts = facets();
  useEffect(() => {
    try {
      learningDraftStorage.setItem(FILTER_KEY, JSON.stringify({ subject: f.subject, level: f.level, type: f.type }));
    } catch {
      /* filters just won't be remembered */
    }
  }, [f.subject, f.level, f.type]);

  const toggle = (k: "subject" | "level" | "type", v: string) =>
    setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));
  const shown = CATALOG.filter((e) => matches(e, f));
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const pageNow = Math.min(page, pages - 1);
  const visible = shown.slice(pageNow * PAGE_SIZE, pageNow * PAGE_SIZE + PAGE_SIZE);
  // A new search or filter starts back on the first page.
  useEffect(() => setPage(0), [f.q, f.subject, f.level, f.type]);
  const filtered = f.q || f.subject.length || f.level.length || f.type.length;
  const installed = new Set(api.courses.map((c) => c.id));

  async function add(id: string) {
    setAdding(id);
    await api.addCourse(id);
    setAdding(null);
  }

  const group = (label: string, k: "subject" | "level" | "type") => (
    <div className="catalog-filter">
      <span className="small muted">{label}</span>
      <div className="chips">
        {opts[k].map((v) => (
          <button key={v} className="chip" aria-pressed={f[k].includes(v)} onClick={() => toggle(k, v)}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="catalog">
      <div className="row" style={{ justifyContent: "space-between", margin: "36px 0 12px" }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          Course catalog
        </h2>
        <span className="small muted">
          {shown.length === CATALOG.length ? `${CATALOG.length} courses` : `${shown.length} of ${CATALOG.length} courses`}
          {pages > 1 && ` · page ${pageNow + 1} of ${pages}`}
        </span>
      </div>
      {REMOTE && api.catalog.source !== "website" && (
        <p className="notice small" role="status">
          {api.catalog.source === "saved"
            ? "Couldn't reach the course website, so this is the catalog saved on this device. Courses you've started work offline."
            : "Connecting to the course website… New courses can be added once it's reachable; courses you've started work offline."}
        </p>
      )}
      <div className="catalog-filters">
        <input
          className="input"
          type="search"
          placeholder="Search courses"
          aria-label="Search courses"
          value={f.q}
          onChange={(e) => setF((x) => ({ ...x, q: e.target.value }))}
        />
        {group("Subject", "subject")}
        {group("Level", "level")}
        {group("Type", "type")}
        {filtered ? (
          <button className="btn sm" onClick={() => setF({ q: "", subject: [], level: [], type: [] })}>
            Clear filters
          </button>
        ) : null}
      </div>
      {shown.length === 0 ? (
        <p className="muted small">No courses match. Try fewer filters.</p>
      ) : (
        <div className="catalog-grid">
          {visible.map((e) => {
            const have = installed.has(e.id);
            const needs = have || api.publicLearning ? [] : prerequisites(e, api.progress).filter((r) => !r.done);
            const open = () => api.go(have ? { name: "course", courseId: e.id } : { name: "overview", catalogId: e.id });
            return (
              <div key={e.id} className="catalog-card" data-subject={subjectKey(e.subject)}>
                <div className="catalog-tags">
                  <span className="pill neutral subject">{e.subject}</span>
                  {e.level.map((l) => (
                    <span key={l} className="pill neutral">
                      {l}
                    </span>
                  ))}
                  {e.type.includes("Exam prep") && <span className="pill neutral">Exam prep</span>}
                </div>
                <h3>
                  {/* The whole card is clickable through this button's ::after; the Start button sits above it. */}
                  <button className="card-link" onClick={open}>
                    {e.title}
                    <span className="sr-only">{have ? ": open course" : ": view overview"}</span>
                  </button>
                </h3>
                <p className="muted small clamp3">{e.description}</p>
                <p className="meta small muted">
                  {[
                    e.lessons && `${e.lessons} lessons`,
                    e.honors && `${e.honors} honors`,
                    e.questions && `${e.questions} questions`,
                    e.drills && `${e.drills} drills`,
                    e.words && `${e.words} words`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {have ? (
                  <button className="btn sm" onClick={(ev) => (ev.stopPropagation(), open())}>
                    In progress: open
                  </button>
                ) : needs.length ? (
                  <button className="btn sm" onClick={(ev) => (ev.stopPropagation(), open())}>
                    🔒 Finish {needs.map((r) => r.title).join(", ")} first
                  </button>
                ) : api.assignmentBlock(e.id) ? (
                  <button className="btn sm" onClick={(ev) => (ev.stopPropagation(), open())}>
                    🔒 {api.assignmentBlock(e.id)}
                  </button>
                ) : (
                  <button
                    className="btn sm primary"
                    disabled={adding !== null}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      add(e.id);
                    }}
                  >
                    {adding === e.id ? "Adding…" : "Start course"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {pages > 1 && (
        <nav className="pager" aria-label="Course catalog pages">
          <button className="btn sm" disabled={pageNow === 0} onClick={() => setPage(pageNow - 1)}>
            ← Previous
          </button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} className="btn sm" aria-current={i === pageNow ? "page" : undefined} onClick={() => setPage(i)}>
              {i + 1}
            </button>
          ))}
          <button className="btn sm" disabled={pageNow >= pages - 1} onClick={() => setPage(pageNow + 1)}>
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
