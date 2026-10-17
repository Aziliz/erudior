import { useCallback, useEffect, useRef, useState } from "react";
import type { Bank, Course, Progress } from "./lib/types";
import { restoreRun, runSummary, type Resumable, type RunState, type Session } from "./lib/session";
import { formatClock } from "./lib/util";
import * as store from "./lib/storage";
import { normalizeCourse, withBank } from "./lib/course";
import { studyDecks } from "./lib/srs";

import Library from "./pages/Library";
import BankHome from "./pages/BankHome";
import Runner from "./pages/Runner";
import Results from "./pages/Results";
import Editor from "./pages/Editor";
import ProgressPage from "./pages/ProgressPage";
import CourseHome, { type CourseTab } from "./pages/CourseHome";
import LessonView from "./pages/LessonView";
import CardsRunner from "./pages/CardsRunner";
import DeckEditor from "./pages/DeckEditor";
import DrillRunner from "./pages/DrillRunner";
import { CATALOG, catalogUpdates, hasActivity, loadCatalogCourse } from "./lib/catalog";
import RefView from "./pages/RefView";
import CourseOverview from "./pages/CourseOverview";
import CourseEditor from "./pages/CourseEditor";
import SearchPage from "./pages/SearchPage";
import { checkForUpdate, openReleasesPage, type AvailableUpdate } from "./lib/updates";
import { Mark } from "./components/Mark";

export type View =
  | { name: "library" }
  | { name: "progress" }
  | { name: "bank"; bankId: string }
  | { name: "editor"; bankId: string; isNew?: boolean }
  | { name: "run"; session: Session; initial?: RunState }
  | { name: "results"; attemptId: string; back: View }
  | { name: "course"; courseId: string; tab?: CourseTab }
  | { name: "courseEdit"; courseId: string; isNew?: boolean }
  | { name: "lesson"; courseId: string; lessonId: string }
  | { name: "cards"; courseId: string; deckIds: string[]; mode: "review" | "cram"; topics?: string[] }
  | { name: "deckEdit"; courseId: string; deckId: string }
  | { name: "drill"; courseId: string; drillIds: string[]; count: number }
  | { name: "ref"; courseId: string; refId: string }
  | { name: "search"; q: string }
  | { name: "overview"; catalogId: string };

export interface AppApi {
  banks: Bank[];
  courses: Course[];
  progress: Progress;
  go: (v: View) => void;
  toast: (msg: string) => void;
  reload: () => Promise<void>;
  setProgress: (p: Progress) => Promise<void>;
  /** Functional update against the latest progress (safe for rapid successive writes). */
  updateProgress: (fn: (p: Progress) => Progress) => Promise<void>;
  /** Saves a standalone bank, or writes the bank back into its course. */
  saveBank: (bank: Bank) => Promise<void>;
  deleteBank: (bank: Bank) => Promise<void>;
  saveCourse: (course: Course) => Promise<void>;
  /** Add a catalog course to In progress (loads and stores it), then open it. */
  addCourse: (id: string) => Promise<void>;
  /** Show the app-update banner for an update found elsewhere (e.g. a manual check). */
  notifyUpdate: (u: AvailableUpdate) => void;
  /** Go back from a bank: to its course if it has one, else the library. */
  bankBack: (bank: Bank) => View;
}

type Theme = "system" | "light" | "dark";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("examiner.theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

export default function App() {
  const [view, setView] = useState<View>({ name: "library" });
  const [standalone, setStandalone] = useState<Bank[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [broken, setBroken] = useState<string[]>([]);
  const [progress, setProgressState] = useState<Progress>(store.emptyProgress());
  const progressRef = useRef(progress);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const toastTimer = useRef<number>(undefined);
  const mainRef = useRef<HTMLElement>(null);
  const [resumable, setResumable] = useState<Resumable | null>(null);
  const [courseUpdates, setCourseUpdates] = useState<Course[]>([]);
  const courseUpdate = courseUpdates[0] ?? null;
  const dropUpdate = () => setCourseUpdates((u) => u.slice(1));
  const [appUpdate, setAppUpdate] = useState<AvailableUpdate | null>(null);
  const [installing, setInstalling] = useState<number | null | false>(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl/Cmd+K jumps to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("examiner.theme", theme);
    } catch {
      /* storage unavailable; theme just won't persist */
    }
  }, [theme]);

  // New screen starts at the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [view]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const reload = useCallback(async () => {
    const [b, c] = await Promise.all([store.listBanks(), store.listCourses()]);
    setStandalone(b.banks);
    setCourses(c.courses);
    setBroken([...c.broken, ...b.broken]);
  }, []);

  const setProgress = useCallback(async (p: Progress) => {
    progressRef.current = p;
    setProgressState(p);
    await store.saveProgress(p);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let p = await store.loadProgress();
        // Courses are added from the catalog when someone starts them. Older versions
        // installed every bundled course up front; once, remove the ones never used
        // (progress is kept regardless, and they can be added again).
        if (!p.catalogV1) {
          const { courses: installed } = await store.listCourses();
          for (const c of installed)
            if (CATALOG.some((e) => e.id === c.id) && !hasActivity(c.id, p)) await store.deleteCourse(c.id);
          p = { ...p, catalogV1: true };
          await store.saveProgress(p);
        }
        progressRef.current = p;
        setProgressState(p);
        await reload();
        // Offer newer catalog versions of courses that are already added.
        const { courses: installed } = await store.listCourses();
        const updates = (await catalogUpdates(installed)).map((u) => normalizeCourse(u.course));
        setCourseUpdates(updates);
        setReady(true);
        // Quietly look for a new version of the app; offline is fine.
        checkForUpdate().then(setAppUpdate, () => {});
      } catch (e) {
        setLoadError(String(e));
      }
    })();
  }, [reload]);

  const allBanks = [...courses.flatMap((c) => c.banks), ...standalone];

  // Look for an unfinished session whenever we're not inside one.
  const banksKey = allBanks.map((b) => b.id + b.questions.length).join();
  useEffect(() => {
    if (!ready || view.name === "run") return;
    store
      .loadSessionState()
      .then((text) => setResumable(text ? restoreRun(text, allBanks) : null))
      .catch(() => setResumable(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, view, banksKey]);

  const saveCourse = useCallback(
    async (course: Course) => {
      await store.saveCourse(course);
      await reload();
    },
    [reload],
  );

  const addCourse = useCallback(
    async (id: string) => {
      const entry = CATALOG.find((e) => e.id === id);
      if (!entry) return;
      try {
        await store.saveCourse(normalizeCourse(await loadCatalogCourse(entry)));
        await reload();
        setView({ name: "course", courseId: id });
      } catch (e) {
        toast(`Couldn't add "${entry.title}": ${String(e)}`);
      }
    },
    [reload, toast],
  );

  const api: AppApi = {
    banks: allBanks,
    courses,
    progress,
    go: (v) => {
      // Starting a new session replaces the saved one, so ask first.
      if (v.name === "run" && !v.initial && resumable) {
        const s = runSummary(resumable);
        const what = resumable.session.mode === "exam" ? "exam" : "practice session";
        store
          .confirmAction(
            `You have an unfinished ${what} in ${resumable.session.bankTitle} (${s.answered} of ${s.total} answered). Starting a new one discards it. Continue?`,
            "Start new session",
          )
          .then(async (ok) => {
            if (!ok) return;
            await store.saveSessionState(null);
            setResumable(null);
            setView(v);
          });
        return;
      }
      setView(v);
    },
    toast,
    reload,
    setProgress,
    updateProgress: (fn) => setProgress(fn(progressRef.current)),
    saveCourse,
    addCourse,
    saveBank: async (bank) => {
      if (bank.courseId) {
        const course = courses.find((c) => c.id === bank.courseId);
        if (!course) throw new Error("This bank's course is missing.");
        await saveCourse(withBank(course, bank));
      } else {
        await store.saveBank(bank);
        await reload();
      }
    },
    deleteBank: async (bank) => {
      if (bank.courseId) {
        const course = courses.find((c) => c.id === bank.courseId);
        if (course) await saveCourse({ ...course, banks: course.banks.filter((b) => b.id !== bank.id) });
      } else {
        await store.deleteBank(bank.id);
        await reload();
      }
    },
    notifyUpdate: setAppUpdate,
    bankBack: (bank) =>
      bank.courseId ? { name: "course", courseId: bank.courseId, tab: "banks" } : { name: "library" },
  };

  if (loadError) {
    return (
      <div className="page">
        <h1>Examiner couldn't load your data</h1>
        <p className="notice error" style={{ marginTop: 16 }}>
          {loadError}
        </p>
      </div>
    );
  }
  if (!ready) return null;

  const bankFor = (id: string) => allBanks.find((b) => b.id === id);
  const courseFor = (id: string) => courses.find((c) => c.id === id);
  const fallback = <Library api={api} broken={broken} standalone={standalone} />;

  let body: React.ReactNode = fallback;
  let fullScreen = false;
  switch (view.name) {
    case "library":
      break;
    case "progress":
      body = <ProgressPage api={api} />;
      break;
    case "bank": {
      const bank = bankFor(view.bankId);
      if (bank) body = <BankHome api={api} bank={bank} />;
      break;
    }
    case "editor": {
      const bank = bankFor(view.bankId);
      if (bank) body = <Editor key={bank.id} api={api} bank={bank} isNew={view.isNew} />;
      fullScreen = true;
      break;
    }
    case "run":
      body = (
        <Runner
          key={view.session.id}
          api={api}
          session={view.session}
          bank={bankFor(view.session.bankId)}
          initial={view.initial}
        />
      );
      fullScreen = true;
      break;
    case "results": {
      const attempt = progress.attempts.find((a) => a.id === view.attemptId);
      if (attempt) body = <Results api={api} attempt={attempt} bank={bankFor(attempt.bankId)} back={view.back} />;
      break;
    }
    case "overview":
      body = <CourseOverview api={api} id={view.catalogId} />;
      break;
    case "course": {
      const c = courseFor(view.courseId);
      if (c) body = <CourseHome key={c.id} api={api} course={c} tab={view.tab ?? "today"} />;
      break;
    }
    case "courseEdit": {
      const c = courseFor(view.courseId);
      if (c) body = <CourseEditor key={c.id} api={api} course={c} isNew={view.isNew} />;
      fullScreen = true;
      break;
    }
    case "lesson": {
      const c = courseFor(view.courseId);
      const l = c?.lessons.find((x) => x.id === view.lessonId);
      if (c && l) body = <LessonView key={l.id} api={api} course={c} lesson={l} />;
      break;
    }
    case "cards": {
      const c = courseFor(view.courseId);
      if (c)
        body = (
          <CardsRunner
            api={api}
            course={c}
            decks={studyDecks(c, progress).filter((d) => view.deckIds.includes(d.id))}
            mode={view.mode}
            topics={view.topics}
          />
        );
      fullScreen = true;
      break;
    }
    case "deckEdit": {
      const c = courseFor(view.courseId);
      const d = c?.decks.find((x) => x.id === view.deckId);
      if (c && d) body = <DeckEditor key={d.id} api={api} course={c} deck={d} />;
      fullScreen = true;
      break;
    }
    case "drill": {
      const c = courseFor(view.courseId);
      if (c)
        body = (
          <DrillRunner
            api={api}
            course={c}
            drills={c.drills.filter((d) => view.drillIds.includes(d.id))}
            count={view.count}
          />
        );
      fullScreen = true;
      break;
    }
    case "search":
      body = <SearchPage key={view.q} api={api} initial={view.q} />;
      break;
    case "ref": {
      const c = courseFor(view.courseId);
      const r = c?.references.find((x) => x.id === view.refId);
      if (c && r) body = <RefView api={api} course={c} sheet={r} />;
      break;
    }
  }

  const navCurrent = view.name === "progress" ? "progress" : "library";

  return (
    <div className="shell">
      {!fullScreen && (
        <header className="topbar">
          <div className="brand">
            <Mark />
            Examiner
          </div>
          <nav className="nav" aria-label="Main">
            <button
              aria-current={navCurrent === "library" ? "page" : undefined}
              onClick={() => setView({ name: "library" })}
            >
              Library
            </button>
            <button
              aria-current={navCurrent === "progress" ? "page" : undefined}
              onClick={() => setView({ name: "progress" })}
            >
              Progress
            </button>
          </nav>
          <div className="spacer" />
          <form
            className="top-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchRef.current?.value.trim() ?? "";
              api.go({ name: "search", q });
            }}
          >
            <input
              ref={searchRef}
              className="input"
              type="search"
              placeholder="Search (Ctrl+K)"
              aria-label="Search everything"
              defaultValue={view.name === "search" ? view.q : ""}
              key={view.name === "search" ? "s" : "x"}
            />
          </form>
          <label className="small muted row" style={{ gap: 6 }}>
            Theme
            <select
              className="select"
              style={{ width: "auto", padding: "4px 8px" }}
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </header>
      )}
      <main className="main" ref={mainRef}>
        {!fullScreen && appUpdate && (
          <div className="resume-banner update-banner" role="region" aria-label="App update">
            <div>
              <b>Examiner {appUpdate.version} is available</b>
              <span className="small muted">
                {installing !== false
                  ? `Downloading${installing !== null ? ` (${installing}%)` : ""}… Examiner restarts when it's done.`
                  : appUpdate.canInstall
                    ? "Install it now; your courses and progress are kept."
                    : "Download the new .deb or .rpm from the release page and install it over this one. Your data is kept."}
              </span>
            </div>
            {installing === false && (
              <div className="row">
                <button className="btn sm ghost" onClick={() => setAppUpdate(null)}>
                  Later
                </button>
                {appUpdate.canInstall ? (
                  <button
                    className="btn sm primary"
                    onClick={async () => {
                      setInstalling(null);
                      try {
                        await appUpdate.install((pct) => setInstalling(pct));
                      } catch (e) {
                        setInstalling(false);
                        toast(`Update failed: ${String(e)}`);
                      }
                    }}
                  >
                    Install and restart
                  </button>
                ) : (
                  <button className="btn sm primary" onClick={() => openReleasesPage().catch(() => toast("Couldn't open the browser."))}>
                    Open download page
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {!fullScreen && courseUpdate && (view.name === "library" || (view.name === "course" && view.courseId === courseUpdate.id)) && (
          <div className="resume-banner update-banner" role="region" aria-label="Course update">
            <div>
              <b>An updated version of “{courseUpdate.title}” is available</b>
              <span className="small muted">
                {courseUpdate.changelog ?? "Corrections and new material."} Your progress, notes and card schedules are kept;
                any edits you made to this course's content are replaced.
              </span>
            </div>
            <div className="row">
              <button className="btn sm ghost" onClick={dropUpdate}>
                Not now
              </button>
              <button
                className="btn sm primary"
                onClick={async () => {
                  await saveCourse(courseUpdate);
                  dropUpdate();
                  toast("Course updated");
                }}
              >
                Update course
              </button>
            </div>
          </div>
        )}
        {!fullScreen && resumable && (
          <ResumeBanner
            r={resumable}
            onResume={() => api.go({ name: "run", session: resumable.session, initial: resumable.state })}
            onDiscard={async () => {
              const s = runSummary(resumable);
              const what = resumable.session.mode === "exam" ? "exam" : "practice session";
              if (
                await store.confirmAction(
                  `Discard your unfinished ${what} (${s.answered} of ${s.total} answered)? It won't be scored or saved.`,
                  "Discard",
                )
              ) {
                await store.saveSessionState(null);
                setResumable(null);
              }
            }}
          />
        )}
        {body}
      </main>
      {toastMsg && (
        <div className="toast" role="status">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function ResumeBanner({ r, onResume, onDiscard }: { r: Resumable; onResume: () => void; onDiscard: () => void }) {
  const s = runSummary(r);
  const isExam = r.session.mode === "exam";
  return (
    <div className="resume-banner" role="region" aria-label="Unfinished session">
      <div>
        <b>
          Unfinished {isExam ? "exam" : "practice"}: {r.session.bankTitle}
        </b>
        <span className="small muted">
          {s.answered} of {s.total} answered
          {s.blockName ? `, in ${s.blockName}` : ""}
          {s.left !== undefined ? `, ${formatClock(Math.max(0, s.left))} left on the clock` : ""}
        </span>
      </div>
      <div className="row">
        <button className="btn sm ghost" onClick={onDiscard}>
          Discard
        </button>
        <button className="btn sm primary" onClick={onResume}>
          Resume
        </button>
      </div>
    </div>
  );
}
