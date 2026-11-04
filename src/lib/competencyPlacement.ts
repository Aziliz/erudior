import type { Course, Progress } from "./types";
import type { AuthoredCompetency } from "./competencyCatalog";
import { resolveCompetencyEvidence } from "./competencyEvidence";
import { courseMastery, masteryFrom, STRONG } from "./mastery";
import { competencyEvidenceKey, evaluateCompetencies, recommendedCompetencies, type Competency, type CompetencyState, type CourseTopicEvidence } from "./competencies";

/** Bridge saved student answers to the cross-course graph without changing Progress storage. */
export function collectCompetencyEvidence(
  courses: Course[],
  progress: Progress,
  graph: Competency[],
): CourseTopicEvidence {
  const relevant = new Map<string, Set<string>>();
  for (const skill of graph.filter(s => s.assessments === undefined))
    for (const [id, topics] of Object.entries(skill.evidence)) {
      const existing = relevant.get(id) ?? new Set<string>();
      for (const topic of topics) existing.add(topic);
      relevant.set(id, existing);
    }
  const result: CourseTopicEvidence = {};
  for (const course of courses) {
    const topics = relevant.get(course.id);
    if (!topics) continue;
    const measured = courseMastery(course, progress);
    const entries: Record<string, { mastery: number; confidence: number; n: number }> = {};
    for (const topic of topics) {
      const score = measured.get(topic);
      if (score && score.n > 0) entries[topic] = { mastery: score.mastery, confidence: score.confidence, n: score.n };
    }
    result[course.id] = entries;
  }
  // A resolved graph never broadens a lesson question to other questions/drills
  // sharing its topic. Stored sources retain exact course/bank/question identity.
  const uniqueBanks = new Map<string, number>();
  for (const course of courses) for (const bank of course.banks) uniqueBanks.set(bank.id, (uniqueBanks.get(bank.id) ?? 0) + 1);
  for (const skill of graph) for (const mapping of skill.assessments ?? []) {
    const course = courses.find(c => c.id === mapping.courseId);
    const bank = course?.banks.find(b => b.id === mapping.bankId);
    if (!bank || uniqueBanks.get(bank.id) !== 1) continue;
    const entries = result[mapping.courseId] ??= {};
    for (const qid of mapping.questionIds) {
      if (bank.questions.filter(q => q.id === qid).length !== 1) continue;
      const key = competencyEvidenceKey(bank.id, qid);
      if (Object.prototype.hasOwnProperty.call(entries, key)) continue;
      const history: number[] = [], rightDays = new Set<string>(), seenAttempts = new Set<string>();
      const attempts = progress.attempts.filter(a => a.bankId === bank.id && a.kind !== "pretest" && Number.isFinite(Date.parse(a.finishedAt)))
        .slice().sort((a,b) => Date.parse(b.finishedAt)-Date.parse(a.finishedAt) || a.id.localeCompare(b.id));
      for (const attempt of attempts) {
        if (seenAttempts.has(attempt.id)) continue;
        seenAttempts.add(attempt.id);
        const answers = attempt.answers.filter(a => a.qid === qid);
        if (answers.length !== 1 || typeof answers[0].correct !== "boolean" || !Array.isArray(answers[0].chosen) || !answers[0].chosen.length) continue;
        const answer = answers[0];
        const value = answer.correct ? (answer.confidence === "guess" ? 0.5 : 1) : 0;
        if (history.length < 30) {
          history.push(value);
          if (value === 1) rightDays.add(new Date(attempt.finishedAt).toISOString().slice(0,10));
        }
      }
      const stat = progress.stats[bank.id]?.[qid];
      const validStat = stat && Number.isSafeInteger(stat.seen) && stat.seen > 0 && stat.seen <= 1_000_000 &&
        Number.isSafeInteger(stat.correct) && stat.correct >= 0 && stat.correct <= stat.seen;
      // Totals are used only without retained history; never count the same answers twice.
      const score = masteryFrom(history, !history.length && validStat ? {seen:stat.seen,correct:stat.correct} : undefined);
      if (history.length && rightDays.size < 3) score.mastery = Math.min(score.mastery, STRONG - 0.01);
      if (score.n) entries[key] = score;
    }
  }
  return result;
}

export interface PlacementRecommendation {
  skillId: string;
  title: string;
  reason: string;
  prerequisiteGaps: string[];
  suggestedCourseIds: string[];
  /** Confidence in estimated mastery, not a certification or placement test score. */
  confidence: number;
}

export function studentCompetencyPlacement(
  graph: Competency[],
  courses: Course[],
  progress: Progress,
  limit = 5,
): { states: CompetencyState[]; recommendations: PlacementRecommendation[] } {
  const states = evaluateCompetencies(graph, collectCompetencyEvidence(courses, progress, graph));
  const byId = new Map(states.map(s => [s.id, s]));
  const skillById = new Map(graph.map(s => [s.id, s]));
  const recommendations = recommendedCompetencies(states, limit).map(state => {
    const spec = skillById.get(state.id)!;
    const missing = state.blockedBy.map(id => byId.get(id)?.title ?? id);
    const reason = state.mastery === null
      ? "Ready to assess: prerequisites are satisfied, but there is no recorded mastery evidence."
      : `Ready for practice: estimated mastery ${Math.round(state.mastery * 100)}%, confidence ${Math.round(state.confidence * 100)}%.`;
    return {skillId:state.id,title:state.title,reason,prerequisiteGaps:missing,
      suggestedCourseIds:Object.keys(spec.evidence).filter(id=>courses.some(c=>c.id===id)),
      confidence:state.confidence};
  });
  return {states,recommendations};
}

/** Human-readable explanation for a locked skill, including the first unmet prerequisites. */
export function explainCompetencyBlock(state: CompetencyState, all: CompetencyState[]): string {
  if (state.ready) return state.mastered ? "Mastered and available for review." : "Prerequisites satisfied.";
  const byId = new Map(all.map(s=>[s.id,s]));
  return "Complete prerequisites first: " + state.blockedBy.map(id => {
    const parent = byId.get(id);
    return parent ? `${parent.title} (${parent.mastery === null ? "not yet assessed" : Math.round(parent.mastery * 100) + "% mastery"})` : id;
  }).join("; ");
}

/** First real-course entry point: derive actual assessed topics before recommending placement. */
export function studentPlacementFromAuthoredCourses(
  authored: AuthoredCompetency[],
  courses: Course[],
  progress: Progress,
  limit = 5,
) {
  return studentCompetencyPlacement(resolveCompetencyEvidence(authored, courses), courses, progress, limit);
}
