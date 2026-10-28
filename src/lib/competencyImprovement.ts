import type { Attempt, Progress } from "./types";
import type { Competency } from "./competencies";
import type { Bank } from "./types";

/** Compare chronological evidence windows for the same competency and assessment topics.
 * Descriptive change only: attempts are not tagged as interventions.
 */
export function competencyImprovement(skill: Competency, banks: Bank[], progress: Progress) {
  const pairs = Object.entries(skill.evidence).flatMap(([courseId, topics]) =>
    banks.filter(bank => bank.courseId === courseId).flatMap(bank =>
      topics.map(topic => ({bankId:bank.id, topic}))
    )
  );
  const seen = new Set(pairs.map(p=>p.bankId+"\u0000"+p.topic));
  const ordered = progress.attempts.flatMap((attempt: Attempt) =>
    Object.entries(attempt.byTopic).filter(([topic,tally]) =>
      tally.total > 0 && seen.has(attempt.bankId+"\u0000"+topic)
    ).map(([,tally])=>({time:Date.parse(attempt.finishedAt),correct:tally.correct,total:tally.total,attemptId:attempt.id}))
  ).filter(x=>Number.isFinite(x.time)).sort((a,b)=>a.time-b.time || a.attemptId.localeCompare(b.attemptId));
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
