import { useCallback, useEffect, useRef, useState } from "react";
import type { Bank, Course, Progress } from "./lib/types";
import type { Session } from "./lib/session";
import * as store from "./lib/storage";
import { normalizeCourse, withBank } from "./lib/course";

const BUNDLED_COURSE_ID = "colorado-broker";
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
import RefView from "./pages/RefView";
import CourseEditor from "./pages/CourseEditor";
import { Mark } from "./components/Mark";

export type View =
  | { name: "library" }
  | { name: "progress" }
  | { name: "bank"; bankId: string }
  | { name: "editor"; bankId: string; isNew?: boolean }
  | { name: "run"; session: Session }
  | { name: "results"; attemptId: string; back: View }
  | { name: "course"; courseId: string; tab?: CourseTab }
  | { name: "courseEdit"; courseId: string; isNew?: boolean }
  | { name: "lesson"; courseId: string; lessonId: string }
  | { name: "cards"; courseId: string; deckIds: string[]; mode: "review" | "cram"; topics?: string[] }
  | { name: "deckEdit"; courseId: string; deckId: string }
  | { name: "drill"; courseId: string; drillIds: string[]; count: number }
  | { name: "ref"; courseId: string; refId: string };

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
        // Install bundled courses once each. Deleting one later doesn't bring it back.
        const seeded = p.seededCourses ?? [];
        if (!seeded.includes(BUNDLED_COURSE_ID)) {
          const [{ default: bundled }, { courses }] = await Promise.all([
            import("../samples/colorado-broker-course.json"),
            store.listCourses(),
          ]);
          if (!courses.some((c) => c.id === BUNDLED_COURSE_ID)) await store.saveCourse(normalizeCourse(bundled));
          p = { ...p, seeded: true, seededCourses: [...seeded, BUNDLED_COURSE_ID] };
          await store.saveProgress(p);
        }
        progressRef.current = p;
        setProgressState(p);
        await reload();
        setReady(true);
      } catch (e) {
        setLoadError(String(e));
      }
    })();
  }, [reload]);

  const allBanks = [...courses.flatMap((c) => c.banks), ...standalone];

  const saveCourse = useCallback(
    async (course: Course) => {
      await store.saveCourse(course);
      await reload();
    },
    [reload],
  );

  const api: AppApi = {
    banks: allBanks,
    courses,
    progress,
    go: setView,
    toast,
    reload,
    setProgress,
    updateProgress: (fn) => setProgress(fn(progressRef.current)),
    saveCourse,
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
      body = <Runner api={api} session={view.session} bank={bankFor(view.session.bankId)} />;
      fullScreen = true;
      break;
    case "results": {
      const attempt = progress.attempts.find((a) => a.id === view.attemptId);
      if (attempt) body = <Results api={api} attempt={attempt} bank={bankFor(attempt.bankId)} back={view.back} />;
      break;
    }
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
            decks={c.decks.filter((d) => view.deckIds.includes(d.id))}
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
