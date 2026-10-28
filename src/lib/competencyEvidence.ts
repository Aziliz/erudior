import type { Bank, Course } from "./types";
import { validateCompetencies, type Competency } from "./competencies";
import { validateAuthoredCompetencies, type AuthoredCompetency } from "./competencyCatalog";

/** Resolve assessment evidence ONLY from questions explicitly linked to an authored lesson.
 * A free-text topic is not evidence unless a linked question actually has that topic.
 * This avoids attributing generic topic labels from unrelated lessons.
 */
export function resolveCompetencyEvidence(
  authored: AuthoredCompetency[],
  courses: Course[],
  options: { allowMissingCourses?: boolean } = {},
): Competency[] {
  const known = Object.fromEntries(courses.map(c => [c.id, c.lessons.map(l => l.id)]));
  const validationSpecs = options.allowMissingCourses ? authored.map(skill => ({...skill, lessons:Object.fromEntries(Object.entries(skill.lessons).filter(([id]) => Object.prototype.hasOwnProperty.call(known,id)))})) : authored;
  const issues = validateAuthoredCompetencies(validationSpecs, known);
  if (issues.length) throw new Error(issues.join("; "));
  const courseMap = new Map(courses.map(c => [c.id,c]));
  if (courseMap.size !== courses.length) throw new Error("Duplicate course identity in competency sources");
  const bankCounts = new Map<string, number>();
  const questionCounts = new Map<string, Map<string, number>>();
  for (const course of courses) {
    const counts = new Map<string, number>();
    for (const bank of course.banks) {
      bankCounts.set(bank.id, (bankCounts.get(bank.id) ?? 0) + 1);
      for (const q of bank.questions) counts.set(q.id, (counts.get(q.id) ?? 0) + 1);
    }
    questionCounts.set(course.id, counts);
  }
  const result = authored.map(skill => {
    const evidence: Record<string,string[]> = {};
    const assessments: NonNullable<Competency["assessments"]> = [];
    for (const [courseId, lessonIds] of Object.entries(skill.lessons)) {
      const course = courseMap.get(courseId);
      if (!course) continue;
      // Only explicit lesson question links prove attribution. A parent module quiz
      // may assess several lessons, so it must not confer every skill in the module.
      const linkedIds = new Set(course.lessons.filter(l => lessonIds.includes(l.id)).flatMap(l => l.quiz ?? []));
      const topics = new Set<string>();
      for (const bank of course.banks) {
        // Ambiguous bank/question IDs cannot identify stored learner evidence safely.
        if (bankCounts.get(bank.id) !== 1) continue;
        const questions = bank.questions.filter(q => linkedIds.has(q.id) &&
          questionCounts.get(courseId)?.get(q.id) === 1);
        if (questions.length) assessments.push({courseId, bankId: bank.id, questionIds: questions.map(q => q.id).sort()});
        for (const q of questions) if (q.topic.trim()) topics.add(q.topic);
      }
      evidence[courseId] = [...topics].sort();
    }
    return { id:skill.id, title:skill.title, prerequisites:[...skill.prerequisites], evidence, assessments };
  });
  const graphIssues = validateCompetencies(result);
  if (graphIssues.length) throw new Error(graphIssues.join("; "));
  return result;
}

/** Preview coverage so course designers know which skills still need linked assessment. */
export function competencyCoverage(graph: Competency[]) {
  return graph.map(skill => ({
    id:skill.id,
    assessed:skill.assessments !== undefined ? skill.assessments.some(a => a.questionIds.length > 0) : Object.values(skill.evidence).some(topics=>topics.length>0),
    linkedQuestions:skill.assessments?.reduce((n,a) => n+a.questionIds.length, 0) ?? 0,
    linkedTopics:Object.values(skill.evidence).reduce((n,topics)=>n+topics.length,0),
  }));
}

/** Exact practice pool for a resolved skill. Legacy explicit topic graphs retain their API. */
export function competencyQuestionIds(skill: Competency, bank: Bank): string[] {
  const ids = skill.assessments === undefined ? null : new Set(skill.assessments
    .filter(a => a.bankId === bank.id && a.courseId === bank.courseId).flatMap(a => a.questionIds));
  const topics = skill.evidence[bank.courseId ?? ""] ?? [];
  return bank.questions.filter(q => ids ? ids.has(q.id) : topics.includes(q.topic)).map(q => q.id);
}
