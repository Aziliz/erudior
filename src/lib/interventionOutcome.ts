import type { CompetencyState } from "./competencies";
import type { Attempt, Progress } from "./types";

/** Compares a stored pre-session mastery estimate to the current estimate.
 * Both values use the same competency mastery scale; neither is session accuracy.
 */
export function interventionOutcome(skill: CompetencyState, progress: Progress) {
  const completed = progress.attempts.filter((a:Attempt) =>
    a.intervention?.skillId === skill.id && Number.isFinite(Date.parse(a.finishedAt)))
    .sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt));
  const latest = completed[0];
  if (!latest) return null;
  const baseline = latest.intervention?.baseline;
  const current = skill.mastery;
  const delta = baseline == null || current == null ? null : current-baseline;
  const next = skill.mastered ? "Advance to the next available skill." :
    delta == null ? "Complete another assessment to establish a comparable mastery estimate." :
    delta > 0 ? "Mastery is improving; continue focused practice until the skill is mastered." :
    "Review the recommended lesson and retry focused practice.";
  return { attemptId:latest.id, sessionDate:latest.finishedAt, baseline:baseline ?? null,
    current, delta, mastered:skill.mastered, next, sessions:completed.length };
}
