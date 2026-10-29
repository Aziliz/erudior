import type { Attempt, Progress } from "./types";
import type { Competency } from "./competencies";
import type { Bank } from "./types";
import { competencyQuestionIds } from "./competencyEvidence";

/** Compare chronological evidence windows for the same competency and assessment topics.
 * Descriptive change only: attempts are not tagged as interventions.
 */
export function competencyImprovement(skill: Competency, banks: Bank[], progress: Progress) {
  const allowed = new Map(banks.filter(bank => banks.filter(b => b.id === bank.id).length === 1)
    .map(bank => [bank.id, new Set(competencyQuestionIds(skill, bank))]));
  const seenAttempts = new Set<string>();
  const ordered = progress.attempts.flatMap((attempt: Attempt) => {
    if (attempt.kind === "pretest" || seenAttempts.has(attempt.id)) return [];
    seenAttempts.add(attempt.id);
    const ids = allowed.get(attempt.bankId);
    if (!ids?.size) return [];
    const answers = attempt.answers.filter(a => ids.has(a.qid) && typeof a.correct === "boolean" && Array.isArray(a.chosen) && a.chosen.length > 0 &&
      attempt.answers.filter(other => other.qid === a.qid).length === 1);
    if (!answers.length) return [];
    return [{time:Date.parse(attempt.finishedAt), correct:answers.filter(a => a.correct).length,total:answers.length,attemptId:attempt.id}];
  }).filter(x=>Number.isFinite(x.time)).sort((a,b)=>a.time-b.time || a.attemptId.localeCompare(b.attemptId));
  if(ordered.length < 2)return null;
  const middle = Math.floor(ordered.length/2);
  const score=(items:typeof ordered)=> {
    const total=items.reduce((sum,x)=>sum+x.total,0);
    return total ? items.reduce((sum,x)=>sum+x.correct,0)/total : 0;
  };
  const before=ordered.slice(0,middle),after=ordered.slice(middle);
  return {before:score(before),after:score(after),change:score(after)-score(before),
    sessions:ordered.length,earlierAnswers:before.reduce((n,x)=>n+x.total,0),laterAnswers:after.reduce((n,x)=>n+x.total,0)};
}
