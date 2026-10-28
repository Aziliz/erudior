import type { CompetencyState } from "./competencies";
import type { Progress } from "./types";
import { interventionOutcome } from "./interventionOutcome";

export type InterventionAction = "assess" | "review" | "practice" | "advance";
/** Deterministic next activity, based on recorded evidence; never pretends a new assessment exists. */
export function interventionNextAction(skill: CompetencyState, progress: Progress): {action:InterventionAction; reason:string} {
  if (skill.mastered) return {action:"advance",reason:"Current mastery meets the threshold; move to another ready skill."};
  const outcome=interventionOutcome(skill,progress);
  if (skill.mastery===null || !outcome || outcome.delta===null)
    return {action:"assess",reason:"Collect comparable assessment evidence for this skill."};
  if (outcome.delta<=0) return {action:"review",reason:"Mastery has not improved; review the linked lesson before reassessment."};
  return {action:"practice",reason:"Mastery is improving but below threshold; continue focused practice."};
}
