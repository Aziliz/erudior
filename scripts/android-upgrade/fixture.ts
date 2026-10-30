// Only copied/imported into the disposable CI checkout by prepare.py.
// No updater mocks: the test clicks App.tsx's normal update button.
import { getVersion } from "@tauri-apps/api/app";
import { emptyProgress, inApp, saveCourse, listCourses, saveProgress,
  loadProgress, updateProfileProgress, loadProfileProgress } from "./lib/storage";
import type { Course } from "./lib/types";

const course: Course = {
  format: "examiner-course", version: 1, id: "upgrade-proof-course",
  title: "Upgrade persistence proof", revision: 7,
  modules: [{ id: "module", title: "Persistent learning" }],
  lessons: [{ id: "lesson", module: "module", title: "Keep this completed lesson", body: "Saved before the Android upgrade." }],
  banks: [], decks: [{ id: "deck", title: "Review", cards: [{ id: "card", front: "Retained?", back: "Yes" }] }],
  glossary: [], references: [], drills: [],
};
const progress = {
  ...emptyProgress(), seeded: true, catalogV1: true, theme: "dark" as const,
  study: { recallFirst: true, explainFirst: false, autoRead: false },
  lessonsDone: { "upgrade-proof-course/lesson": "2026-10-01" },
  cards: { "upgrade-proof-course/deck/card": {
    due: "2026-11-01", ivl: 12, ease: 2.5, reps: 6, lapses: 1, last: "2026-10-01",
  } },
  plans: { "upgrade-proof-course": { examDate: "2027-01-01", daysPerWeek: 5, newCardsPerDay: 8, createdAt: "2026-10-01" } },
};

async function snapshot() {
  const p = await loadProgress();
  const profile = await loadProfileProgress("upgradetest");
  const courses = await listCourses();
  if (courses.broken.length) throw new Error(courses.broken.join("; "));
  return {
    course: courses.courses.find(c => c.id === course.id) ?? null,
    lessonsDone: p.lessonsDone, cards: p.cards, plans: p.plans,
    theme: p.theme, study: p.study,
    displayPreferences: { theme: localStorage.getItem("examiner.theme"),
      width: localStorage.getItem("examiner.width"), textSize: localStorage.getItem("examiner.textSize") },
    profileLessons: profile.lessonsDone,
  };
}
Object.assign(window, { __erudiorUpgradeE2E: {
  version: getVersion,
  snapshot,
  async seed() {
    if (!inApp) throw new Error("Acceptance fixtures require the real native persistence backend");
    await saveCourse(course);
    await saveProgress(progress);
    localStorage.setItem("examiner.theme", "dark");
    localStorage.setItem("examiner.width", "comfortable");
    localStorage.setItem("examiner.textSize", "115");
    await updateProfileProgress("upgradetest", old => ({ ...old,
      lessonsDone: { "upgrade-proof-course/lesson": "2026-10-02" },
    }));
    return snapshot();
  },
} });
