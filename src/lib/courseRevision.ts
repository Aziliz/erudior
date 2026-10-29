import { branchingRevisionProblems } from "./branchingCoursePackage";
import { scientificRevisionProblems } from "./scientificCoursePackage";
import { readerRevisionProblems } from "./readerContent";
import type { Course } from "./types";
import { localBankId } from "./course";
import { courseWorkRevisionProblems, courseWorkLessonRevisionProblems } from "./courseWork";

export interface CourseRevisionIssue {
  severity: "blocking" | "warning";
  path: string;
  message: string;
}

/** Compare persisted identities before replacing a previously published course.
 * Intentionally non-mutating: authors must explicitly migrate or retain old IDs.
 */
export function compareCourseRevisions(previous: Course, next: Course): CourseRevisionIssue[] {
  const issues: CourseRevisionIssue[] = [];
  const add = (severity: CourseRevisionIssue["severity"], path: string, message: string) =>
    issues.push({ severity, path, message });

  if (previous.id !== next.id) add("blocking", "id", "Course ID cannot change during an update.");
  const oldRevision = previous.revision ?? 1;
  const newRevision = next.revision ?? 1;
  if (newRevision <= oldRevision)
    add("blocking", "revision", `Revision must increase beyond ${oldRevision}.`);

  const compare = <T>(kind: string, before: T[], after: T[], id: (item: T) => string, context?: (item: T) => string) => {
    const remaining = new Map(after.map((item) => [id(item), item]));
    for (const item of before) {
      const key = id(item);
      const current = remaining.get(key);
      if (!current) add("blocking", `${kind}.${key}`, "Previously published ID removed; progress could be orphaned.");
      else if (context && context(item) !== context(current))
        add("warning", `${kind}.${key}`, "Existing ID moved or reassigned; review saved progress compatibility.");
    }
  };

  for (const message of [...courseWorkRevisionProblems(previous, next), ...courseWorkLessonRevisionProblems(previous.lessons, next.lessons)]) add("blocking", "work", message);

  compare("modules", previous.modules, next.modules, (m) => m.id);
  compare("lessons", previous.lessons, next.lessons, (l) => l.id, (l) => l.module);
  compare("banks", previous.banks, next.banks, localBankId);
  for (const bank of previous.banks) {
    const current = next.banks.find((b) => localBankId(b) === localBankId(bank));
    if (current) compare(`banks.${localBankId(bank)}.questions`, bank.questions, current.questions, (q) => q.id);
  }
  compare("decks", previous.decks, next.decks, (d) => d.id);
  for (const deck of previous.decks) {
    const current = next.decks.find((d) => d.id === deck.id);
    if (current) compare(`decks.${deck.id}.cards`, deck.cards, current.cards, (card) => card.id);
  }
  compare("drills", previous.drills, next.drills, (d) => d.id);
  compare("references", previous.references, next.references, (r) => r.id);
  compare("texts", previous.texts ?? [], next.texts ?? [], (t) => t.id);
  for (const text of previous.texts ?? []) {
    const current = (next.texts ?? []).find((t) => t.id === text.id);
    if (current) compare(`texts.${text.id}.sections`, text.sections, current.sections, (section) => section.id);
  }
  for (const message of readerRevisionProblems(previous.texts ?? [], next.texts ?? [])) add("blocking", "texts", message);
  for(const issue of branchingRevisionProblems(previous.branchingScenarios??[],next.branchingScenarios??[]))add("blocking","branchingScenarios",issue);
  for(const issue of scientificRevisionProblems(previous.scientificWorkspaces??[],next.scientificWorkspaces??[]))add("blocking","scientificWorkspaces",issue);
  compare("branchingScenarios", previous.branchingScenarios ?? [], next.branchingScenarios ?? [], scenario=>scenario.id, scenario=>scenario.lessonId ?? "");
  compare("scientificWorkspaces", previous.scientificWorkspaces ?? [], next.scientificWorkspaces ?? [], scenario=>scenario.id, scenario=>scenario.lessonId ?? "");
  compare("spreadsheetAssignments", previous.spreadsheetAssignments ?? [], next.spreadsheetAssignments ?? [],
    (assignment) => assignment.id, (assignment) => assignment.lessonId);
  for (const [i, assignment] of (next.spreadsheetAssignments ?? []).entries())
    if (!next.lessons.some(lesson => lesson.id === assignment.lessonId))
      add("blocking", `spreadsheetAssignments[${i}].lessonId`, `Assignment refers to unknown lesson: ${assignment.lessonId}`);
  compare("vocab", previous.vocab ?? [], next.vocab ?? [], (word) => word.id, (word) => word.lesson);
  for (const [i, word] of (next.vocab ?? []).entries())
    if (!next.lessons.some((lesson) => lesson.id === word.lesson))
      add("blocking", `vocab[${i}].lesson`, `Vocabulary refers to unknown lesson: ${word.lesson}`);
  return issues;
}
