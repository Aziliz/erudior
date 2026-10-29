import { createLearnerPrivacyStore } from "./lib/learnerPrivacyStore";
import { createAdvancedAssessmentStore } from "./lib/advancedAssessmentStore";
import { createScientificWorkspaceStore } from "./lib/scientificWorkspaceStore";
import { createBranchingEngineStore } from "./lib/branchingEngineStore";
import { createInstructionalEvidenceStore } from "./lib/instructionalEvidenceStore";
import { createTransactionEngineStore } from "./lib/transactionEngineStore";
import { createDocumentEngineStore } from "./lib/documentEngineStore";
import { importQtiItem, qtiChoiceToBank } from "./lib/interopQti";
import { createInterventionStore } from "./lib/interventionStore";
import { createInterventionTaskAccess } from "./lib/interventionTaskAccess";
import { taskFromPlan, parseInterventionTask, sameInterventionTask, type InterventionTask } from "./lib/interventionTasks";
import { validateInterventionActivities, interventionStatus, type InterventionActivity } from "./lib/interventions";
import { startPractice } from "./lib/session";
import { validateCourseIntegrity } from "./lib/courseIntegrity";
import { useCallback, useEffect, useRef, useState } from "react";
import { requestNavigation, navigationPosition, newNavigationPosition, withNavigationPosition, sameNavigationPosition, restoreBlockedPop, type DisplayedHistory } from "./lib/navigationGuard";
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
import { LEGAL_TITLES, LegalView, type LegalPage } from "./components/Terms";
import { courseJsonLd, courseUrl, setSeo } from "./lib/seo";
import { APP_ORIGIN, SITE_ORIGIN } from "./lib/site";
import CourseHome, { type CourseTab } from "./pages/CourseHome";
import LessonView from "./pages/LessonView";
import WorkView from "./pages/WorkView";
import CardsRunner from "./pages/CardsRunner";
import DeckEditor from "./pages/DeckEditor";
import DrillRunner from "./pages/DrillRunner";
import { CATALOG, catalogUpdates, hasActivity, loadCatalogCourse, prerequisites, setCatalog } from "./lib/catalog";
import { fetchCatalog, type CatalogSource } from "./lib/courseSource";
import RefView from "./pages/RefView";
import Reader from "./pages/Reader";
import VocabRunner, { type VocabMode } from "./pages/VocabRunner";
import { migrateVocabKeys } from "./lib/vocab";
import CourseOverview from "./pages/CourseOverview";
import CourseEditor from "./pages/CourseEditor";
import SearchPage from "./pages/SearchPage";
import { checkForUpdate, openReleasesPage, type AvailableUpdate } from "./lib/updates";
import { Mark } from "./components/Mark";
import { HOMESCHOOL, adultLabel, classesOf, isClassroom, currentAssignments, loadFamily, saveFamily, type Family, type Student } from "./lib/family";
import { courseFinished, isPublishedCourse } from "./lib/catalog";
import { refreshStates } from "./lib/states";
import { useStudyTimer } from "./lib/timer";
import FamilySetup from "./pages/FamilySetup";
import WhoPage from "./pages/WhoPage";
import ParentArea, { type ParentTab } from "./pages/ParentArea";
import ParentGate from "./pages/ParentGate";
import type { CompetencySupervisorAccess } from "./components/CompetencySupervisor";
import { createCompetencyStore } from "./lib/competencyStore";
import { FOUNDATION_COMPETENCIES } from "./lib/competencyCatalog";
import { resolveCompetencyEvidence } from "./lib/competencyEvidence";
import { AUTHORING, downloadCommunityCourse, isCommunityId } from "./lib/community";
import CreateHome from "./pages/CreateHome";
import CommunityPage from "./pages/CommunityPage";
import { COMMUNITY } from "./lib/community";
import CommunityEditor from "./pages/CommunityEditor";
import ReviewQueue from "./pages/ReviewQueue";
import LivePlay from "./pages/LivePlay";
import PresentationPlay from "./pages/PresentationPlay";
import { createPresentationStore } from "./lib/presentationStore";
import { presentationProblems, type PresentationDeck } from "./lib/presentations";
import { LIVE } from "./lib/live";
import { pageKey, pathToView, viewToPath, type RouteCourse } from "./lib/routes";
import { subjectKey } from "./lib/taxonomy";
import { siteUrl } from "./lib/site";

/** The website keeps the address bar in step with the screen; the desktop app has no address bar. */
// (VITE_AS_DESKTOP=1 makes a browser build look like the desktop app, for screenshots.)
const ROUTES = !store.inApp && typeof window !== "undefined" && import.meta.env?.VITE_AS_DESKTOP !== "1";

/** Screens that hold an activity's in-memory state; going back to one reopens its course instead. */
function restorable(v: View): View {
  switch (v.name) {
    case "run":
    case "results":
    case "editor":
    case "courseEdit":
    case "deckEdit":
      return { name: "library" };
    case "cards":
    case "drill":
    case "vocab":
      return { name: "course", courseId: v.courseId };
    default:
      return v;
  }
}

export type View =
  | { name: "community" }
  | { name: "library" }
  | { name: "progress" }
  | { name: "legal"; page: LegalPage }
  | { name: "bank"; bankId: string }
  | { name: "editor"; bankId: string; isNew?: boolean }
  | { name: "run"; session: Session; initial?: RunState }
  | { name: "results"; attemptId: string; back: View }
  | { name: "course"; courseId: string; tab?: CourseTab }
  | { name: "courseEdit"; courseId: string; isNew?: boolean }
  | { name: "lesson"; courseId: string; lessonId: string }
  | { name: "work"; courseId: string; itemId: string }
  | { name: "cards"; courseId: string; deckIds: string[]; mode: "review" | "cram"; topics?: string[] }
  | { name: "deckEdit"; courseId: string; deckId: string }
  | { name: "drill"; courseId: string; drillIds: string[]; count: number }
  | { name: "ref"; courseId: string; refId: string }
  | { name: "read"; courseId: string; textId: string }
  | { name: "search"; q: string }
  | { name: "overview"; catalogId: string }
  | { name: "vocab"; courseId: string; mode: VocabMode; lessonIds?: string[]; count?: number; batch?: number }
  | { name: "who" }
  | { name: "familySetup" }
  | { name: "parent"; tab?: ParentTab }
  | { name: "create" }
  | { name: "communityEdit"; id: string }
  | { name: "review" }
  | { name: "live"; code?: string }
  | { name: "presentation"; code?: string };

export interface AppApi {
  /** Where the course catalog came from: the website, the copy saved on this device, or the build. */
  learnerPrivacy?: ReturnType<typeof createLearnerPrivacyStore>;
  catalog: { source: CatalogSource; error?: string };
  banks: Bank[];
  courses: Course[];
  progress: Progress;
  competencySupervisor?: CompetencySupervisorAccess;
  interventionSupervisor?: ReturnType<typeof createInterventionStore>;
  loadInterventionTasks?: () => Promise<InterventionTask[]>;
  launchInterventionTask?: (task:InterventionTask, activity:InterventionActivity) => Promise<void>;
  importInterventionTask?: () => Promise<boolean>;
  exportInterventionTask?: (studentId:string, planId:string) => Promise<void>;
  importInteroperabilityBank?: (xml: string) => Promise<void>;
  instructionalSupervisor?: ReturnType<typeof createInstructionalEvidenceStore>["supervisor"];
  instructionalLearner?: ReturnType<typeof createInstructionalEvidenceStore>["learner"];
  advancedAssessmentSupervisor?: ReturnType<typeof createAdvancedAssessmentStore>["supervisor"];
  advancedAssessmentLearner?: ReturnType<typeof createAdvancedAssessmentStore>["learner"];
  scientificSupervisor?: ReturnType<typeof createScientificWorkspaceStore>["supervisor"];
  scientificLearner?: ReturnType<typeof createScientificWorkspaceStore>["learner"];
  branchingSupervisor?: ReturnType<typeof createBranchingEngineStore>["supervisor"];
  branchingLearner?: ReturnType<typeof createBranchingEngineStore>["learner"];
  transactionSupervisor?: ReturnType<typeof createTransactionEngineStore>["supervisor"];
  transactionLearner?: ReturnType<typeof createTransactionEngineStore>["learner"];
  documentSupervisor?: ReturnType<typeof createDocumentEngineStore>["supervisor"];
  documentLearner?: ReturnType<typeof createDocumentEngineStore>["learner"];
  presentationLibrary?: ReturnType<typeof createPresentationStore>;
  validatePresentation?: (deck: PresentationDeck) => Promise<string[]>;
  competencySync?: { pending: boolean; error: string };
  retryCompetencySync?: () => void;
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
  /** Homeschool features available (desktop app). */
  homeschool: boolean;
  /** The homeschool family, once set up. */
  family: Family | null;
  /** The student using the app (homeschool families). */
  student: Student | null;
  setFamily: (f: Family) => Promise<void>;
  /** Refresh imported classroom state without rewriting a stale in-memory snapshot. */
  reloadClassroomState?: () => Promise<void>;
  /** Switch to a student's progress and open their library. */
  chooseStudent: (id: string) => Promise<void>;
  /** Every installed course, whoever is enrolled (parent area). */
  allCourses: Course[];
  /** Can this student start this catalog course? A reason if not. */
  assignmentBlock: (courseId: string) => string | null;
  /** Download (or update) a community course and open it. */
  addCommunityCourse: (id: string) => Promise<void>;
}

type Theme = "system" | "light" | "dark" | "sepia" | "dim" | "contrast";
const THEMES: Theme[] = ["system", "light", "dark", "sepia", "dim", "contrast"];

type ReadingWidth = "full" | "comfortable";
type TextSize = "100" | "115" | "130";

function readPref<T extends string>(key: string, allowed: T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("examiner.theme");
    return THEMES.includes(t as Theme) ? (t as Theme) : "system";
  } catch {
    return "system";
  }
}

export default function App() {
  // Signing in on the website returns to /?create.
  const [view, setView] = useState<View>(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      if (AUTHORING && q.has("create")) {
        window.history.replaceState(null, "", window.location.pathname);
        return { name: "create" };
      }
      if (LIVE && q.has("presentation")) {
        window.history.replaceState({}, "", window.location.pathname);
        return { name: "presentation", code: q.get("presentation") ?? "" };
      }
      // A live room link (app.erudior.com/?live=CODE) opens the join screen.
      if (LIVE && q.has("live")) {
        window.history.replaceState(null, "", window.location.pathname);
        return { name: "live", code: q.get("live") ?? "" };
      }
    } catch {
      /* not in a browser */
    }
    return { name: "library" };
  });
  const [standalone, setStandalone] = useState<Bank[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [broken, setBroken] = useState<string[]>([]);
  const [progress, setProgressState] = useState<Progress>(store.emptyProgress());
  const progressRef = useRef(progress);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [width, setWidth] = useState<ReadingWidth>(() => readPref("examiner.width", ["full", "comfortable"], "full"));
  const [textSize, setTextSize] = useState<TextSize>(() => readPref("examiner.textSize", ["100", "115", "130"], "100"));
  const [displayOpen, setDisplayOpen] = useState(false);
  // Where the course catalog came from (download builds); re-renders pages that read CATALOG.
  const [catalogInfo, setCatalogInfo] = useState<{ source: CatalogSource; error?: string }>({ source: "bundled" });
  const toastTimer = useRef<number>(undefined);
  const mainRef = useRef<HTMLElement>(null);
  const [resumable, setResumable] = useState<Resumable | null>(null);
  const [courseUpdates, setCourseUpdates] = useState<Course[]>([]);
  const courseUpdate = courseUpdates[0] ?? null;
  const dropUpdate = () => setCourseUpdates((u) => u.slice(1));
  const [appUpdate, setAppUpdate] = useState<AvailableUpdate | null>(null);
  const [installing, setInstalling] = useState<number | null | false>(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [family, setFamilyState] = useState<Family | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const adultAccess = useRef({ unlocked: false, parentView: false });
  // Bind document authority to the credential reviewed at this explicit unlock.
  const documentUnlockedCredential = useRef<string | null>(null);
  adultAccess.current = { unlocked: parentUnlocked, parentView: view.name === "parent" };
  const [competencySync, setCompetencySync] = useState({ pending: false, error: "" });
  const [competencyRetry, setCompetencyRetry] = useState(0);
  const student = family?.students.find((s) => s.id === studentId) ?? null;

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

  // Each subject has its own accent color on its course's screens (styles.css [data-subject]).
  useEffect(() => {
    const id =
      "courseId" in view
        ? view.courseId
        : view.name === "overview"
          ? view.catalogId
          : view.name === "run"
            ? allBanks.find((b) => b.id === view.session.bankId)?.courseId
            : undefined;
    const subject = id ? CATALOG.find((e) => e.id === id)?.subject : undefined;
    const key = subject ? subjectKey(subject) : null;
    if (key) document.documentElement.setAttribute("data-subject", key);
    else document.documentElement.removeAttribute("data-subject");
  }, [view]);

  // Reading width and text size (WCAG 1.4.8 / 1.4.4): applied to <html>, remembered per device.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-width", width);
    root.style.fontSize = textSize === "100" ? "" : `${textSize}%`;
    try {
      localStorage.setItem("examiner.width", width);
      localStorage.setItem("examiner.textSize", textSize);
    } catch {
      /* storage unavailable */
    }
  }, [width, textSize]);

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
        const fam = HOMESCHOOL ? await loadFamily() : null;
        if (fam) {
          setFamilyState(fam);
          if (fam.students.length === 1) {
            store.useStudentFiles(fam.students[0].id);
            setStudentId(fam.students[0].id);
          } else setView({ name: "who" });
        }
        let p = await store.loadProgress();
        // Courses are added from the catalog when someone starts them. Older versions
        // installed every bundled course up front; once, remove the ones never used
        // (progress is kept regardless, and they can be added again).
        if (!fam && !p.catalogV1) {
          const { courses: installed } = await store.listCourses();
          for (const c of installed)
            if (CATALOG.some((e) => e.id === c.id) && !hasActivity(c.id, p)) await store.deleteCourse(c.id);
          p = { ...p, catalogV1: true };
          await store.saveProgress(p);
        }
        // Vocabulary progress moved from per-course to per-language keys (v0.11).
        const migrated = migrateVocabKeys(p, (await store.listCourses()).courses);
        if (migrated !== p) {
          p = migrated;
          await store.saveProgress(p);
        }
        progressRef.current = p;
        setProgressState(p);
        await reload();
        setReady(true);
        // Quietly look for a new version of the app; offline is fine.
        checkForUpdate().then(setAppUpdate, () => {});
        // Builds that download courses: get the signed catalog from the website (or the last
        // one saved here when offline). Bundled builds keep the catalog they shipped with.
        const fetched = await fetchCatalog();
        if (fetched) {
          setCatalog(fetched.entries);
          setCatalogInfo({ source: fetched.source, error: fetched.error });
          if (fam) refreshStates().catch(() => {});
        }
        // Offer newer catalog versions of courses that are already added.
        const { courses: installed } = await store.listCourses();
        catalogUpdates(installed).then(
          (u) => setCourseUpdates(u.map((x) => normalizeCourse(x.course))),
          () => {},
        );
      } catch (e) {
        setLoadError(String(e));
      } finally {
        setCatalogTried(true);
      }
    })();
  }, [reload]);

  // Homeschool students each see the courses they started (course files are shared on disk).
  const enrolled = family && studentId ? new Set(progress.enrolled ?? []) : null;
  const myCourses = enrolled ? courses.filter((c) => enrolled.has(c.id)) : courses;
  const allBanks = [...myCourses.flatMap((c) => c.banks), ...standalone];

  // Capture from the live persisted profile under CAS; stale async results never replace
  // another learner or a newer answer. Ledger updates merge independently of raw progress.
  const competencyEvidenceVersion = JSON.stringify([progress.attempts, progress.stats, progress.enrolled]);
  useEffect(() => {
    if (!ready || (family && !studentId)) return;
    const selected = store.activeStudent();
    let active = true;
    setCompetencySync({ pending: true, error: "" });
    Promise.resolve().then(() => {
      const graph = resolveCompetencyEvidence(FOUNDATION_COMPETENCIES, courses, { allowMissingCourses: true });
      return store.syncCompetencyState(selected, graph, courses);
    }).then(fresh => {
      if (!active || store.activeStudent() !== selected) return;
      if (JSON.stringify(progressRef.current.competencies) !== JSON.stringify(fresh.competencies)) {
        const merged = { ...progressRef.current, competencies: fresh.competencies };
        progressRef.current = merged; setProgressState(merged);
      }
      setCompetencySync({ pending: false, error: "" });
    }, error => {
      if (active && store.activeStudent() === selected) setCompetencySync({ pending: false, error: error instanceof Error ? error.message : String(error) });
    });
    return () => { active = false; };
  }, [ready, courses, studentId, competencyEvidenceVersion, !!family, competencyRetry]);


  // Website addresses: app.erudior.com/<course>, /<course>/lessons/<id>, … (see lib/routes.ts).
  // An address typed or reloaded is opened once the courses (and the catalog) are known.
  const pendingPath = useRef<string | null>(
    ROUTES && window.location.pathname !== "/" ? window.location.pathname + window.location.search : null,
  );
  const fromPop = useRef(false);
  const displayedHistory = useRef<DisplayedHistory>({ url: window.location.pathname + window.location.search + window.location.hash, state: window.history.state });
  const restoringHistory = useRef(false);
  const lastPage = useRef<string | null>(null);
  const [catalogTried, setCatalogTried] = useState(false);
  const routeCourses = (): RouteCourse[] => {
    const seen = new Map<string, RouteCourse>();
    for (const c of [...courses, ...CATALOG]) if (!seen.has(c.id)) seen.set(c.id, { id: c.id, title: c.title });
    return [...seen.values()];
  };
  const bankCourse = (bankId: string) => allBanks.find((b) => b.id === bankId)?.courseId;

  useEffect(() => {
    if (!ROUTES || !ready || !pendingPath.current) return;
    const url = new URL(pendingPath.current, window.location.origin);
    const v = pathToView(url.pathname, url.search, myCourses, CATALOG);
    if (v || catalogTried) {
      pendingPath.current = null;
      if (v && view.name === "library") setView(v);
      else setView((cur) => ({ ...cur })); // write the address for the screen we're on
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, catalogTried, courses]);

  useEffect(() => {
    if (!ROUTES || !ready || pendingPath.current) return;
    const key = pageKey(view);
    const path = viewToPath(view, routeCourses(), bankCourse);
    const id = "courseId" in view ? view.courseId : view.name === "overview" ? view.catalogId : null;
    const courseTitle = id ? routeCourses().find((c) => c.id === id)?.title : null;
    const title = courseTitle ? `${courseTitle} · Erudior` : "Erudior";
    // What search engines see: a catalog course's overview is its public page (schema.org Course);
    // the library and community lists are indexable; personal screens are not.
    const entry = id ? CATALOG.find((e) => e.id === id) : null;
    if (entry) setSeo({ title, description: entry.description, url: courseUrl(entry.title), jsonLd: view.name === "overview" ? courseJsonLd(entry) : undefined });
    else if (view.name === "library")
      setSeo({ title: "Free courses · Erudior", description: `Free courses: ${CATALOG.map((e) => e.title).join(", ")}.`, url: APP_ORIGIN + "/" });
    else if (view.name === "community") setSeo({ title: "Community courses · Erudior", description: "Free courses written by people who use Erudior.", url: APP_ORIGIN + "/community" });
    else if (view.name === "legal") setSeo({ title: `${LEGAL_TITLES[view.page]} · Erudior`, url: `${SITE_ORIGIN}/${view.page}` });
    else setSeo({ title, noindex: true });
    if (fromPop.current) {
      fromPop.current = false;
      lastPage.current = key;
      return;
    }
    const write = (push: boolean) => {
      const fn = push ? window.history.pushState : window.history.replaceState;
      const position = navigationPosition(displayedHistory.current.state) ?? newNavigationPosition();
      if (push) position.index += 1;
      try {
        fn.call(window.history, withNavigationPosition({ erudiorView: view }, position), "", path);
      } catch {
        fn.call(window.history, withNavigationPosition({}, position), "", path); // retain routing position if view state can't be stored
      }
      displayedHistory.current = { url: window.location.pathname + window.location.search + window.location.hash, state: window.history.state };
    };
    write(lastPage.current !== null && lastPage.current !== key);
    lastPage.current = key;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, ready]);

  useEffect(() => {
    if (!ROUTES) return;
    const onPop = (e: PopStateEvent) => {
      if (restoringHistory.current && sameNavigationPosition(e.state, displayedHistory.current.state)) {
        restoringHistory.current = false;
        return;
      }
      restoringHistory.current = false;
      if (!requestNavigation("history")) {
        const restored = restoreBlockedPop(window.history, displayedHistory.current, e.state);
        restoringHistory.current = restored.traversing;
        displayedHistory.current = restored.displayed;
        return;
      }
      displayedHistory.current = { url: window.location.pathname + window.location.search + window.location.hash, state: e.state };
      const saved = (e.state as { erudiorView?: View } | null)?.erudiorView;
      const v = saved
        ? restorable(saved)
        : pathToView(window.location.pathname, window.location.search, myCourses, CATALOG) ?? { name: "library" };
      fromPop.current = true;
      setView(v);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, studentId]);

  // Look for an unfinished session whenever we're not inside one.
  const banksKey = allBanks.map((b) => b.id + b.questions.length).join();
  useEffect(() => {
    if (!ready || view.name === "run" || (family && !studentId)) return;
    store
      .loadSessionState()
      .then((text) => setResumable(text ? restoreRun(text, allBanks) : null))
      .catch(() => setResumable(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, view, banksKey, studentId]);

  const enroll = useCallback(
    async (id: string) => {
      const p = progressRef.current;
      if (!family || !studentId || p.enrolled?.includes(id)) return;
      await setProgress({ ...p, enrolled: [...(p.enrolled ?? []), id] });
    },
    [family, studentId, setProgress],
  );

  const saveCourse = useCallback(
    async (course: Course) => {
      // Bank/deck editors share this boundary: no alternate editor may persist
      // deletion of a question still used by a lesson or reading section.
      const issues = validateCourseIntegrity(course);
      if (issues.length) throw Error("Cannot save course: " + issues.map(issue => `${issue.path}: ${issue.message}`).join("; "));
      await store.saveCourse(course);
      await enroll(course.id);
      await reload();
    },
    [reload, enroll],
  );

  const assignmentBlock = useCallback(
    (courseId: string): string | null => {
      if (!student) return null;
      if (isClassroom(family)) {
        const mine = classesOf(family!, student.id);
        if (mine.some((c) => c.assignments.some((a) => a.courseId === courseId) || c.freeChoice)) return null;
        return "Not assigned in your class";
      }
      const finished = (id: string) => courseFinished(id, progressRef.current, courses.find((c) => c.id === id)).done;
      const current = currentAssignments(student, finished);
      if (current.has(courseId)) return null;
      const a = student.assigned.find((x) => x.courseId === courseId);
      if (a) {
        if (finished(courseId)) return null;
        const before = student.assigned.find((x) => x.subject === a.subject && current.has(x.courseId));
        return before ? `Starts after ${CATALOG.find((e) => e.id === before.courseId)?.title ?? before.courseId}` : null;
      }
      return student.freeChoice ? null : "Not assigned yet; ask a parent";
    },
    [student, courses, family],
  );

  const studentSelectionRequest = useRef(0);
  const chooseStudent = useCallback(
    async (id: string) => {
      const target = { name: "library" as const };
      if (!requestNavigation("app", target)) return;
      const request = ++studentSelectionRequest.current;
      // Read the selected files without changing the active student's storage context.
      const raw = await store.loadState(`progress-${id}`);
      let p = store.emptyProgress();
      try { if (raw) p = { ...p, ...JSON.parse(raw) }; } catch { /* Match storage's corrupt-file fallback. */ }
      const migrated = migrateVocabKeys(p, courses);
      if (migrated !== p) {
        p = migrated;
        await store.saveState(`progress-${id}`, JSON.stringify(p));
      }
      if (request !== studentSelectionRequest.current || !requestNavigation("app", target)) return;
      store.useStudentFiles(id);
      progressRef.current = p;
      setProgressState(p);
      setStudentId(id);
      setResumable(null);
      setView({ name: "library" });
    },
    [courses],
  );

  const setFamily = useCallback(async (f: Family) => {
    await saveFamily(f);
    setFamilyState(f);
  }, []);

  // Leaving the parent area locks it again.
  useEffect(() => {
    if (view.name !== "parent") setParentUnlocked(false);
  }, [view.name]);

  const addCourse = useCallback(
    async (id: string) => {
      const entry = CATALOG.find((e) => e.id === id);
      if (!entry) return;
      const needs = prerequisites(entry, progressRef.current).filter((r) => !r.done);
      if (needs.length) {
        toast(`Finish ${needs.map((r) => r.title).join(" and ")} first`);
        return;
      }
      const blocked = assignmentBlock(id);
      if (blocked) {
        toast(blocked);
        return;
      }
      try {
        // Another student may already have it; their copy (and any edits) is shared.
        if (!courses.some((c) => c.id === id)) await store.saveCourse(normalizeCourse(await loadCatalogCourse(entry)));
        await enroll(id);
        await reload();
        const target = { name: "course" as const, courseId: id };
        if (requestNavigation("app", target)) setView(target);
      } catch (e) {
        toast(`Couldn't add "${entry.title}": ${String(e)}`);
      }
    },
    [reload, toast, assignmentBlock, courses, enroll],
  );

  const addCommunityCourse = async (id: string) => {
    try {
      const course = normalizeCourse(await downloadCommunityCourse(id));
      await saveCourse(course);
      const target = { name: "course" as const, courseId: course.id };
      if (requestNavigation("app", target)) setView(target);
    } catch (e) {
      toast(`Couldn't add the course: ${(e as Error).message}`);
    }
  };

  const competencyAdultStore = createCompetencyStore({
    readProgress: store.loadProfileProgress,
    updateProgress: store.updateProfileProgress,
    studentExists: store.competencyProfileExists,
    authorize: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review learning paths.");
      const current = await loadFamily();
      if (!current || !current.students.some(s => s.id === id) || !adultAccess.current.unlocked || !adultAccess.current.parentView)
        throw Error("Adult access or learner membership changed; reopen the learning path.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent") };
    },
    now: () => new Date().toISOString(),
  });
  const competencySupervisor: CompetencySupervisorAccess = {
    load: async id => {
      const graph = resolveCompetencyEvidence(FOUNDATION_COMPETENCIES, courses, { allowMissingCourses: true });
      await competencyAdultStore.sync(id, graph, courses);
      return competencyAdultStore.load(id);
    },
    decide: async (id, input) => {
      if (!FOUNDATION_COMPETENCIES.some(s => s.id === input.skillId)) throw Error("Unknown skill.");
      const fresh = await competencyAdultStore.decide(id, input);
      if (store.activeStudent() === id) {
        const merged = { ...progressRef.current, competencies: fresh.competencies };
        progressRef.current = merged; setProgressState(merged);
      }
      return fresh;
    },
  };

  const interventionSupervisor = createInterventionStore({
    read: () => store.loadState("interventions"),
    update: change => store.updateState("interventions", change),
    readProgress: store.loadProfileProgress,
    readCourses: async () => (await store.listCourses()).courses,
    now: () => new Date().toISOString(),
    authorize: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review interventions.");
      const current = await loadFamily();
      if (!current || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult access or learner membership changed. Reopen diagnostics.");
      return {actorId:"local-supervising-adult",actorName:current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"),authorityKey:JSON.stringify(current.parent.password)};
    },
  });
  const interventionTasks = createInterventionTaskAccess({
    context: async () => {
      const profileId = store.activeStudent(), current = await loadFamily();
      if (store.activeStudent() !== profileId || (!current && profileId !== null) || (current && (!profileId || !current.students.some(s => s.id === profileId)))) throw Error("Select a current learner profile before opening support tasks.");
      return {profileId,scope:JSON.stringify(current ? {mode:current.mode,student:current.students.find(s=>s.id===profileId),classes:current.classes,password:current.parent.password} : null)};
    },
    readInterventions: () => store.loadState("interventions"),
    readProgress: store.loadProfileProgress,
    updateProgress: store.updateProfileProgress,
    readCourses: async () => (await store.listCourses()).courses,
    allowed: async (courseId, context, p, installed) => {
      const current = await loadFamily();
      if (current && context.profileId) {
        const learner = current.students.find(s => s.id === context.profileId);
        if (!learner) return "This learner profile no longer exists.";
        if (!p.enrolled?.includes(courseId)) return "Open this assigned course from the library before starting its support activity.";
        if (isClassroom(current)) {
          if (!classesOf(current, learner.id).some(c => c.freeChoice || c.assignments.some(a => a.courseId === courseId))) return "This course is not assigned in your class.";
        } else {
          const finished = (id:string) => courseFinished(id,p,installed.find(c=>c.id===id)).done;
          if (!currentAssignments(learner,finished).has(courseId) && !finished(courseId) && !learner.freeChoice) return "This course is not currently assigned. Ask the supervising adult.";
        }
      }
      const entry = CATALOG.find(c => c.id === courseId);
      if (entry && prerequisites(entry,p).some(r => !r.done)) return "Course prerequisites are not yet satisfied. Ask the supervising adult to review them.";
      return null;
    },
  });

  const advancedAssessment = createAdvancedAssessmentStore({
    read: () => store.loadState("advanced-assessment"),
    update: change => store.updateState("advanced-assessment", change),
    now: () => new Date().toISOString(),
    authorizeAdult: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review educational advanced assessments.");
      const current = await loadFamily();
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Lock and reopen advanced assessments.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"), authorityKey: JSON.stringify({password: current.parent.password, students: current.students.map(s => s.id)}) };
    },
    learnerContext: async () => {
      const selected = store.activeStudent(), current = await loadFamily();
      if (!selected || !current || !current.students.some(s => s.id === selected) || store.activeStudent() !== selected) throw Error("Select a current learner profile before opening advanced assessments.");
      return { studentId: selected, authorityKey: JSON.stringify({student: current.students.find(s => s.id === selected), password: current.parent.password}) };
    },
  });

  const scientificWorkspace = createScientificWorkspaceStore({
    read: () => store.loadState("scientific-workspace"),
    update: change => store.updateState("scientific-workspace", change),
    now: () => new Date().toISOString(),
    authorizeAdult: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review educational scientific workspaces.");
      const current = await loadFamily();
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Lock and reopen scientific workspaces.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"), authorityKey: JSON.stringify({password: current.parent.password, students: current.students.map(s => s.id)}) };
    },
    learnerContext: async () => {
      const selected = store.activeStudent(), current = await loadFamily();
      if (!selected || !current || !current.students.some(s => s.id === selected) || store.activeStudent() !== selected) throw Error("Select a current learner profile before opening scientific workspaces.");
      return { studentId: selected, authorityKey: JSON.stringify({student: current.students.find(s => s.id === selected), password: current.parent.password}) };
    },
  });

  const branchingEngine = createBranchingEngineStore({
    read: () => store.loadState("branching-engine"),
    update: change => store.updateState("branching-engine", change),
    now: () => new Date().toISOString(),
    authorizeAdult: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review fictional branching scenarios.");
      const current = await loadFamily();
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Lock and reopen branching cases.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"), authorityKey: JSON.stringify({password: current.parent.password, students: current.students.map(s => s.id)}) };
    },
    learnerContext: async () => {
      const selected = store.activeStudent(), current = await loadFamily();
      if (!selected || !current || !current.students.some(s => s.id === selected) || store.activeStudent() !== selected) throw Error("Select a current learner profile before opening branching cases.");
      return { studentId: selected, authorityKey: JSON.stringify({student: current.students.find(s => s.id === selected), password: current.parent.password}) };
    },
  });

  const instructionalEvidence = createInstructionalEvidenceStore({
    read: () => store.loadState("instructional-evidence"),
    update: change => store.updateState("instructional-evidence", change),
    readCourses: async () => (await store.listCourses()).courses,
    readProgress: async id => {
      const raw = await store.loadState(`progress-${id}`);
      return raw === null ? store.emptyProgress() : { ...store.emptyProgress(), ...JSON.parse(raw) };
    },
    readRecords: id => store.loadState(`records-${id}`),
    now: () => new Date().toISOString(),
    authorizeAdult: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review instructional workload evidence.");
      const current = await loadFamily();
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Lock and reopen instructional evidence.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"), authorityKey: JSON.stringify({password: current.parent.password, students: current.students.map(s => s.id)}) };
    },
    learnerContext: async () => {
      const selected = store.activeStudent(), current = await loadFamily();
      if (!selected || !current || !current.students.some(s => s.id === selected) || store.activeStudent() !== selected) throw Error("Select a current learner profile before opening instructional evidence.");
      return { studentId: selected, authorityKey: JSON.stringify({student: current.students.find(s => s.id === selected), password: current.parent.password}) };
    },
  });

  const transactionEngine = createTransactionEngineStore({
    read: () => store.loadState("transaction-engine"),
    update: change => store.updateState("transaction-engine", change),
    now: () => new Date().toISOString(),
    authorizeAdult: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review educational transaction simulations.");
      const current = await loadFamily();
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Lock and reopen transaction cases.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"), authorityKey: JSON.stringify({password: current.parent.password, students: current.students.map(s => s.id)}) };
    },
    learnerContext: async () => {
      const selected = store.activeStudent(), current = await loadFamily();
      if (!selected || !current || !current.students.some(s => s.id === selected) || store.activeStudent() !== selected) throw Error("Select a current learner profile before opening transaction cases.");
      return { studentId: selected, authorityKey: JSON.stringify({student: current.students.find(s => s.id === selected), password: current.parent.password}) };
    },
  });

  const documentEngine = createDocumentEngineStore({
    read: () => store.loadState("document-engine"),
    update: change => store.updateState("document-engine", change),
    now: () => new Date().toISOString(),
    authorizeAdult: async id => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to review educational documents.");
      const current = await loadFamily();
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || (id && !current.students.some(s => s.id === id)) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Lock and reopen document cases.");
      return { actorId: "local-supervising-adult", actorName: current.school?.administrator?.trim() || (isClassroom(current) ? "Teacher" : "Parent"), authorityKey: JSON.stringify({password: current.parent.password, students: current.students.map(s => s.id)}) };
    },
    learnerContext: async () => {
      const selected = store.activeStudent(), current = await loadFamily();
      if (!selected || !current || !current.students.some(s => s.id === selected) || store.activeStudent() !== selected) throw Error("Select a current learner profile before opening document cases.");
      return { studentId: selected, authorityKey: JSON.stringify({student: current.students.find(s => s.id === selected), password: current.parent.password}) };
    },
  });

  const learnerPrivacy = createLearnerPrivacyStore({
    read: () => store.loadState("learner-privacy"),
    update: change => store.updateState("learner-privacy", change),
    courses: async () => (await store.listCourses()).courses,
    progress: id => store.loadProfileProgress(id),
    updateProgress: (id, change) => store.updateProfileProgress(id, change),
    authorize: async id => {
      // Anonymous practice has no account or upload identity. Family privacy actions require
      // the current unlocked adult, never a learner selection or a community author cookie.
      const current = await loadFamily();
      if (id === null) {
        if (current || store.activeStudent() !== null) throw Error("Anonymous practice scope changed.");
        return "anonymous-local-device";
      }
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area for learner privacy controls.");
      if (!current || documentUnlockedCredential.current !== JSON.stringify(current.parent.password) || !current.students.some(s => s.id === id) || !await store.competencyProfileExists(id) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority or learner membership changed. Reopen privacy controls.");
      return JSON.stringify({ password: current.parent.password, students: current.students.map(s => s.id) });
    },
    // No production remote identity provider is configured. No network call is made here.
  });

  const presentationLibrary = createPresentationStore({
    read: () => store.loadState("presentations"),
    update: change => store.updateState("presentations", change),
    authorize: async () => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area to edit presentations.");
      const current = await loadFamily();
      if (!current || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult access changed. Reopen the presentation library.");
      return JSON.stringify(current.parent.password);
    },
  });

  const api: AppApi = {
    learnerPrivacy,
    catalog: catalogInfo,
    banks: allBanks,
    courses: myCourses,
    progress,
    competencySync,
    retryCompetencySync: () => setCompetencyRetry(n => n + 1),
    competencySupervisor,
    interventionSupervisor,
    instructionalSupervisor: instructionalEvidence.supervisor,
    instructionalLearner: instructionalEvidence.learner,
    advancedAssessmentSupervisor: advancedAssessment.supervisor,
    advancedAssessmentLearner: advancedAssessment.learner,
    scientificSupervisor: scientificWorkspace.supervisor,
    scientificLearner: scientificWorkspace.learner,
    branchingSupervisor: branchingEngine.supervisor,
    branchingLearner: branchingEngine.learner,
    transactionSupervisor: transactionEngine.supervisor,
    transactionLearner: transactionEngine.learner,
    documentSupervisor: documentEngine.supervisor,
    documentLearner: documentEngine.learner,
    loadInterventionTasks: () => interventionTasks.load(),
    importInterventionTask: async () => {
      const context = await interventionTasks.context();
      const raw = await store.pickJsonFile(); if (raw === null) return false;
      const task = parseInterventionTask(raw);
      const current = await loadFamily();
      const name = current?.students.find(s=>s.id===context.profileId)?.name ?? "this local learner";
      if (!await store.confirmAction(`Import support instructions for ${name}? Goal: ${task.goal}. This file does not authenticate its sender or confer grades. Confirm it was intended for this learner.`, "Import learner support task")) return false;
      await interventionTasks.install(task,context);
      if (store.activeStudent() === context.profileId) {
        const fresh = await store.loadProfileProgress(context.profileId);
        if (store.activeStudent() === context.profileId) {const next={...progressRef.current,interventionTasks:fresh.interventionTasks};progressRef.current=next;setProgressState(next);}
      }
      return true;
    },
    exportInterventionTask: async (id,planId) => {
      const state = await interventionSupervisor.load(id), plan = state.plans.find(p=>p.id===planId);
      if (!plan || interventionStatus(state,planId) !== "active") throw Error("Only an active plan can be shared as a learner task.");
      await validateInterventionActivities((await store.listCourses()).courses,plan.skillId,plan.activities);
      const refreshed = await interventionSupervisor.load(id);
      const currentPlan=refreshed.plans.find(p=>p.id===planId);
      if (!currentPlan || interventionStatus(refreshed,planId) !== "active" || !sameInterventionTask(taskFromPlan(currentPlan),taskFromPlan(plan))) throw Error("The plan changed while preparing its handoff. Reload it.");
      await store.exportText(JSON.stringify(taskFromPlan(currentPlan)),"erudior-support-task.json","Learner support task");
    },
    launchInterventionTask: async (task,activity) => {
      const context = await interventionTasks.context();
      if (activity.kind === "practice" && resumable && !await store.confirmAction("Starting this assigned practice replaces the unfinished session. Continue?", "Start assigned practice")) return;
      const ready = await interventionTasks.prepare(task,activity);
      if (ready.context.profileId !== context.profileId || ready.context.scope !== context.scope) throw Error("Learner changed while confirming the activity. Reopen it.");
      let target: View;
      if (activity.kind === "lesson") target={name:"lesson",courseId:activity.courseId,lessonId:activity.lessonId!};
      else {
        const source=ready.courses.find(c=>c.id===activity.courseId)?.banks.find(b=>b.id===activity.bankId);
        if (!source) throw Error("The assigned practice bank is unavailable.");
        const ids=new Set(activity.questionIds), bank={...source,questions:source.questions.filter(q=>ids.has(q.id))};
        target={name:"run",session:{...startPractice(bank,ready.progress,{count:Math.min(10,bank.questions.length),topics:[],sections:[],filter:"all",shuffleChoices:true}),intervention:{skillId:task.skillId,baseline:ready.mastery}}};
      }
      if (!requestNavigation("app",target)) return;
      if (activity.kind === "practice" && resumable) {
        await store.saveState(context.profileId ? `session-${context.profileId}` : "session",null);
        const current=await interventionTasks.context();
        if (current.profileId!==context.profileId||current.scope!==context.scope) throw Error("Learner changed. The activity was not opened.");
        // Revalidate after asynchronous session cleanup before exposing question content.
        await interventionTasks.prepare(task,activity);
        setResumable(null);
      }
      if (requestNavigation("app",target)) {adultAccess.current={unlocked:false,parentView:false};setView(target);}
    },
    presentationLibrary,
    validatePresentation: async deck => {
      if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the adult area before delivery.");
      const before = await loadFamily();
      const fresh = await store.listCourses();
      const after = await loadFamily();
      if (!before || !after || JSON.stringify(before.parent.password) !== JSON.stringify(after.parent.password) || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult authority changed during source verification.");
      return presentationProblems(deck, fresh.courses);
    },
    go: (v) => {
      if (!requestNavigation("app", v)) return;
      if (v.name !== "parent") adultAccess.current = { unlocked: false, parentView: false };
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
            if (!ok || !requestNavigation("app", v)) return;
            await store.saveSessionState(null);
            setResumable(null);
            if (requestNavigation("app", v)) setView(v);
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
    importInteroperabilityBank: async (xml) => {
      // A file never carries adult authority, a published source identity, or credit.
      const assertAdult = async () => {
        if (!adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Unlock the supervising-adult area before importing content.");
        const current = await loadFamily();
        if (!current || !adultAccess.current.unlocked || !adultAccess.current.parentView) throw Error("Adult access changed; reopen content exchange.");
        return JSON.stringify(current.parent.password);
      };
      const authority = await assertAdult();
      const bank = qtiChoiceToBank(importQtiItem(xml), `qti-${crypto.randomUUID()}`);
      if (await assertAdult() !== authority) throw Error("Supervising adult changed; review the import again.");
      await store.saveBank(bank); // New random standalone ID only; never replaces an installed source.
      // A refresh failure must not misreport a completed save and invite a duplicate retry.
      try { await reload(); } catch { toast("The new bank was saved. Reopen the library to refresh its listing."); }
    },
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
    homeschool: HOMESCHOOL,
    family,
    student,
    setFamily,
    reloadClassroomState: async () => {
      const selected = store.activeStudent();
      const [freshFamily, freshProgress] = await Promise.all([loadFamily(), store.loadProgress()]);
      setFamilyState(freshFamily);
      if (store.activeStudent() === selected) { progressRef.current = freshProgress; setProgressState(freshProgress); }
      await reload();
    },
    chooseStudent,
    allCourses: courses,
    assignmentBlock,
    addCommunityCourse,
  };

  // Active study time for the student's records.
  const studyCourse = (() => {
    switch (view.name) {
      case "lesson":
      case "vocab":
      case "cards":
      case "drill":
      case "ref":
      case "work":
      case "read":
        return view.courseId;
      case "run": {
        const b = allBanks.find((x) => x.id === view.session.bankId);
        return b?.courseId ?? `bank:${view.session.bankId}`;
      }
      default:
        return null;
    }
  })();
  // Community courses are free learning only: their time isn't recorded.
  useStudyTimer(family ? studentId : null, studyCourse && !isCommunityId(studyCourse) ? studyCourse : null);

  if (loadError) {
    return (
      <div className="page">
        <h1>Erudior couldn't load your data</h1>
        <p className="notice error" style={{ marginTop: 16 }}>
          {loadError}
        </p>
      </div>
    );
  }
  if (!ready) return null;

  const bankFor = (id: string) => allBanks.find((b) => b.id === id);
  const courseFor = (id: string) => myCourses.find((c) => c.id === id);
  const fallback = <Library api={api} broken={broken} standalone={standalone} />;

  let body: React.ReactNode = fallback;
  let fullScreen = false;
  switch (view.name) {
    case "library":
      break;
    case "community":
      // Homeschool families use approved core courses only; community courses are for free learning.
      if (COMMUNITY && !family) body = <CommunityPage api={api} />;
      break;

    case "progress":
      body = <ProgressPage api={api} />;
      break;
    case "legal":
      body = (
        <div className="page">
          <button className="back" onClick={() => api.go({ name: "library" })}>
            ← Library
          </button>
          <LegalView
            page={view.page}
            linkTo={(page, label) => (
              <button className="linkish" onClick={() => api.go({ name: "legal", page })}>
                {label}
              </button>
            )}
          />
        </div>
      );
      break;
    case "bank": {
      const bank = bankFor(view.bankId);
      if (bank) body = <BankHome api={api} bank={bank} />;
      break;
    }
    case "editor": {
      const bank = bankFor(view.bankId);
      // Published courses can't be edited here (links or old addresses land on the bank instead).
      if (bank && bank.courseId && isPublishedCourse(courseFor(bank.courseId))) body = <BankHome api={api} bank={bank} />;
      else if (bank) body = <Editor key={bank.id} api={api} bank={bank} isNew={view.isNew} />;
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
      if (c && isPublishedCourse(c)) body = <CourseHome key={c.id} api={api} course={c} tab="today" />;
      else if (c) body = <CourseEditor key={c.id} api={api} course={c} isNew={view.isNew} />;
      fullScreen = true;
      break;
    }
    case "lesson": {
      const c = courseFor(view.courseId);
      const l = c?.lessons.find((x) => x.id === view.lessonId);
      if (c && l) body = <LessonView key={l.id} api={api} course={c} lesson={l} />;
      break;
    }
    case "work": {
      const c = courseFor(view.courseId);
      if (c) body = <WorkView key={view.itemId} api={api} course={c} itemId={view.itemId} />;
      break;
    }
    case "vocab": {
      const c = courseFor(view.courseId);
      if (c) body = <VocabRunner key={JSON.stringify(view)} api={api} course={c} mode={view.mode} lessonIds={view.lessonIds} count={view.count} />;
      fullScreen = true;
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
      if (c && isPublishedCourse(c)) body = <CourseHome key={c.id} api={api} course={c} tab="cards" />;
      else if (c && d) body = <DeckEditor key={d.id} api={api} course={c} deck={d} />;
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
    case "read": {
      const c = courseFor(view.courseId);
      const t = c?.texts?.find((x) => x.id === view.textId);
      if (c && t) body = <Reader key={`${c.id}/${t.id}`} api={api} course={c} text={t} />;
      break;
    }
    case "ref": {
      const c = courseFor(view.courseId);
      const r = c?.references.find((x) => x.id === view.refId);
      if (c && r) body = <RefView api={api} course={c} sheet={r} />;
      break;
    }
    case "who":
      if (family) body = <WhoPage api={api} family={family} />;
      break;
    case "familySetup":
      if (HOMESCHOOL && !family)
        body = (
          <FamilySetup
            api={api}
            onDone={async (f) => {
              if (!requestNavigation("app", { name: isClassroom(f) ? "parent" : "library" })) return;
              setFamilyState(f);
              if (isClassroom(f)) {
                // The teacher who just set it up goes straight to their area.
                documentUnlockedCredential.current = JSON.stringify(f.parent.password);
                setParentUnlocked(true);
                api.go({ name: "parent", tab: "classes" });
                return;
              }
              await chooseStudent(f.students[0].id);
              if (store.activeStudent() !== f.students[0].id || !requestNavigation("app", { name: "library" })) return;
              // Courses already on this computer stay in the first student's list.
              const p = progressRef.current;
              await setProgress({ ...p, enrolled: courses.map((c) => c.id) });
            }}
          />
        );
      break;
    case "parent":
      if (family)
        body = parentUnlocked ? (
          <ParentArea api={api} family={family} tab={view.tab ?? "overview"} onLock={() => api.go({ name: "library" })} />
        ) : (
          <ParentGate api={api} family={family} onUnlock={() => { documentUnlockedCredential.current = JSON.stringify(family.parent.password); adultAccess.current = { unlocked: true, parentView: true }; setParentUnlocked(true); }} />
        );
      break;
  }
  if (view.name === "create" && AUTHORING) body = <CreateHome api={api} />;
  if (view.name === "communityEdit" && AUTHORING) {
    body = <CommunityEditor key={view.id} api={api} id={view.id} />;
  }
  if (view.name === "review" && AUTHORING) body = <ReviewQueue api={api} />;
  if (view.name === "live" && LIVE) body = <LivePlay key={view.code ?? ""} api={api} initialCode={view.code} />;
  if (view.name === "presentation" && LIVE) body = <PresentationPlay key={view.code ?? ""} api={api} initialCode={view.code} />;
  // Students pick who they are before anything else.
  if (family && !studentId && view.name !== "parent") body = <WhoPage api={api} family={family} />;

  const navCurrent =
    view.name === "progress"
      ? "progress"
      : view.name === "community" || view.name === "create" || view.name === "communityEdit"
            ? "community"
            : view.name === "parent" || view.name === "who" || view.name === "familySetup"
              ? null
              : "library";
  const showCommunity = COMMUNITY && !family;

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!fullScreen && (
        <header className="topbar">
          {ROUTES ? (
            <a className="brand" href={siteUrl("/")} aria-label="Erudior home page">
              <Mark />
              Erudior
            </a>
          ) : (
            <button className="brand" onClick={() => api.go({ name: "library" })} aria-label="Erudior: library">
              <Mark />
              Erudior
            </button>
          )}
          <nav className="nav" aria-label="Main">
            <button
              aria-current={navCurrent === "library" ? "page" : undefined}
              onClick={() => api.go({ name: "library" })}
            >
              {ROUTES ? "Courses" : "Library"}
            </button>
            {showCommunity && (
              <button
                aria-current={navCurrent === "community" ? "page" : undefined}
                onClick={() => api.go({ name: "community" })}
              >
                Community
              </button>
            )}
            <button
              aria-current={navCurrent === "progress" ? "page" : undefined}
              onClick={() => api.go({ name: "progress" })}
            >
              Progress
            </button>
            {ROUTES && <a href={siteUrl("/download")}>Download</a>}
          </nav>
          <div className="spacer" />
          {HOMESCHOOL && family && (
            <div className="row family-nav">
              {student && (
                <button className="btn sm ghost" onClick={() => api.go({ name: "who" })} aria-label={`Student: ${student.name}. Switch student`}>
                  Student: {student.name}
                </button>
              )}
              <button
                className="btn sm"
                aria-current={view.name === "parent" ? "page" : undefined}
                onClick={() => api.go({ name: "parent" })}
              >
                {adultLabel(family)}
              </button>
            </div>
          )}
          {HOMESCHOOL && !family && (
            <button className="btn sm" onClick={() => api.go({ name: "familySetup" })}>
              Homeschool or classroom
            </button>
          )}
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
<div className="display-menu">
            <button
              className="btn sm"
              aria-expanded={displayOpen}
              aria-controls="display-panel"
              onClick={() => setDisplayOpen((o) => !o)}
            >
              Display
            </button>
            {displayOpen && (
              <div
                id="display-panel"
                className="display-panel"
                role="group"
                aria-label="Display settings"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setDisplayOpen(false);
                    document.querySelector<HTMLButtonElement>('[aria-controls="display-panel"]')?.focus();
                  }
                }}
              >
                <label className="field">
                  <span>Theme</span>
                  <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                    <option value="system">System (light or dark)</option>
                    <option value="light">Light</option>
                    <option value="sepia">Sepia (warm paper)</option>
                    <option value="dim">Dim (soft dark)</option>
                    <option value="dark">Dark</option>
                    <option value="contrast">High contrast</option>
                  </select>
                </label>
                <label className="field">
                  <span>Reading width</span>
                  <select className="select" value={width} onChange={(e) => setWidth(e.target.value as ReadingWidth)}>
                    <option value="full">Full (95% of the window)</option>
                    <option value="comfortable">Comfortable (about 80 characters)</option>
                  </select>
                </label>
                <label className="field">
                  <span>Text size</span>
                  <select className="select" value={textSize} onChange={(e) => setTextSize(e.target.value as TextSize)}>
                    <option value="100">Normal</option>
                    <option value="115">Large</option>
                    <option value="130">Larger</option>
                  </select>
                </label>
                <button className="btn sm" onClick={() => setDisplayOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
        </header>
      )}
      <main className="main" id="main" tabIndex={-1} ref={mainRef}>
        {!fullScreen && appUpdate && (
          <div className="resume-banner update-banner" role="region" aria-label="App update">
            <div>
              <b>Erudior {appUpdate.version} is available</b>
              <span className="small muted">
                {installing !== false
                  ? `Downloading${installing !== null ? ` (${installing}%)` : ""}… Erudior restarts when it's done.`
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
      {/* Always mounted so screen readers announce new messages. */}
      <div className={toastMsg ? "toast" : "sr-only"} role="status" aria-live="polite">
        {toastMsg}
      </div>
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
