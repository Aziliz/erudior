/** One private learning-path projection shared by learners and supervising adults. */
import type { Course, Progress } from './types';
import { FOUNDATION_COMPETENCIES } from './competencyCatalog';
import { resolveCompetencyEvidence, competencyCoverage } from './competencyEvidence';
import { competencyLedgerStates, parseCompetencyLedger } from './competencyState';
import { recommendedCompetencies } from './competencies';

export function competencyPath(courses: Course[], progress: Progress, limit = 5) {
  const graph = resolveCompetencyEvidence(FOUNDATION_COMPETENCIES, courses, { allowMissingCourses: true });
  const ledger = parseCompetencyLedger(progress.competencies);
  const installed = new Set(courses.map(c => c.id));
  const visible = new Set(FOUNDATION_COMPETENCIES.filter(s => Object.keys(s.lessons).some(id => installed.has(id))).map(s => s.id));
  for (const source of ledger.sources) visible.add(source.skillId);
  for (const decision of ledger.decisions) visible.add(decision.skillId);
  const byId = new Map(graph.map(s => [s.id, s]));
  function includePrerequisites(id: string) {
    for (const required of byId.get(id)?.prerequisites ?? []) if (!visible.has(required)) { visible.add(required); includePrerequisites(required); }
  }
  for (const id of [...visible]) includePrerequisites(id);
  const shownGraph = graph.filter(s => visible.has(s.id));
  const states = competencyLedgerStates(shownGraph, progress);
  const recommendations = recommendedCompetencies(states, limit).map(s => {
    const definition = FOUNDATION_COMPETENCIES.find(x => x.id === s.id)!;
    const placement = states.find(x => x.id === s.id)?.placement;
    return { skillId: s.id, title: s.title, confidence: s.confidence,
      reason: placement ? `Adult placement: ${placement.reason} Assessment evidence remains separate.` : s.mastery === null
        ? 'Ready to assess: no current linked assessment evidence has been recorded.'
        : `Ready for practice: estimated mastery ${Math.round(s.mastery * 100)}%, confidence ${Math.round(s.confidence * 100)}%.`,
      prerequisiteGaps: s.blockedBy, suggestedCourseIds: Object.keys(definition.lessons).filter(id => installed.has(id)) };
  });
  return { graph: shownGraph, states, recommendations, coverage: competencyCoverage(shownGraph) };
}
