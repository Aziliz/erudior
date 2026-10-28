import type { Course } from "./types";
import { validateCompetencies, type Competency } from "./competencies";
import { validateAuthoredCompetencies, type AuthoredCompetency } from "./competencyCatalog";

/** Resolve assessment evidence ONLY from questions explicitly linked to an authored lesson.
 * A free-text topic is not evidence unless a linked question actually has that topic.
 * This avoids attributing generic topic labels from unrelated lessons.
 */
export function resolveCompetencyEvidence(
  authored: AuthoredCompetency[],
  courses: Course[],
): Competency[] {
  const known = Object.fromEntries(courses.map(c => [c.id, c.lessons.map(l => l.id)]));
  const issues = validateAuthoredCompetencies(authored, known);
  if (issues.length) throw new Error(issues.join("; "));
  const courseMap = new Map(courses.map(c => [c.id,c]));
  const result = authored.map(skill => {
    const evidence: Record<string,string[]> = {};
    for (const [courseId, lessonIds] of Object.entries(skill.lessons)) {
      const course = courseMap.get(courseId)!;
      // Lesson quizzes and their parent module quizzes may both assess these skills.
      const targetLessons = course.lessons.filter(l => lessonIds.includes(l.id));
      const linkedModules = new Set(targetLessons.map(l => l.module));
      const linkedIds = new Set([
        ...targetLessons.flatMap(l=>l.quiz ?? []),
        ...course.modules.filter(m => linkedModules.has(m.id)).flatMap(m => m.quiz ?? []),
      ]);
      const topics = new Set<string>();
      for (const bank of course.banks) for (const q of bank.questions)
        if (linkedIds.has(q.id) && q.topic.trim()) topics.add(q.topic);
      evidence[courseId] = [...topics].sort();
    }
    return { id:skill.id, title:skill.title, prerequisites:[...skill.prerequisites], evidence };
  });
  const graphIssues=validateCompetencies(result);
  // Empty evidence is a valid unassessed skill: do not invent mastery.
  const materialIssues=graphIssues.filter(x=>!x.startsWith("Invalid evidence mapping:"));
  if(materialIssues.length)throw new Error(materialIssues.join("; "));
  return result;
}

/** Preview coverage so course designers know which skills still need linked assessment. */
export function competencyCoverage(graph: Competency[]) {
  return graph.map(skill => ({
    id:skill.id,
    assessed:Object.values(skill.evidence).some(topics=>topics.length>0),
    linkedTopics:Object.values(skill.evidence).reduce((n,topics)=>n+topics.length,0),
  }));
}
