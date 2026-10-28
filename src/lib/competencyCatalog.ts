import type { Competency } from "./competencies";

/** Stable curriculum taxonomy. Topic evidence is attached only after auditing real
 * question-bank topic labels; lesson references describe where skills are taught. */
export interface AuthoredCompetency extends Competency {
  lessons: Record<string, string[]>;
}

export const FOUNDATION_COMPETENCIES: AuthoredCompetency[] = [
  {id:"math.place-value",title:"Place value",prerequisites:[],evidence:{},lessons:{"math-prealgebra":["pre-place-value"]}},
  {id:"math.whole-operations",title:"Whole-number operations",prerequisites:["math.place-value"],evidence:{},lessons:{"math-prealgebra":["pre-whole-ops"]}},
  {id:"math.integers",title:"Integer operations",prerequisites:["math.whole-operations"],evidence:{},lessons:{"math-prealgebra":["pre-integers","pre-int-addsub","pre-int-muldiv"]}},
  {id:"math.fractions",title:"Fraction arithmetic",prerequisites:["math.whole-operations"],evidence:{},lessons:{"math-prealgebra":["pre-frac-basics","pre-frac-muldiv","pre-frac-addsub"]}},
  {id:"math.ratios",title:"Ratios",prerequisites:["math.fractions"],evidence:{},lessons:{"math-prealgebra":["pre-ratio"]}},
  {id:"math.proportions",title:"Proportional reasoning",prerequisites:["math.ratios"],evidence:{},lessons:{"math-prealgebra":["pre-proportion"]}},
  {id:"math.linear-equations",title:"Linear equations",prerequisites:["math.integers","math.fractions"],evidence:{},lessons:{"math-algebra1":["alg-linear-eq","alg-literal","alg-linear-apps"]}},
  {id:"math.functions",title:"Functions",prerequisites:["math.linear-equations"],evidence:{},lessons:{"math-algebra1":["alg-functions","alg-domain-range"]}},
  {id:"math.slope",title:"Slope and linear models",prerequisites:["math.functions"],evidence:{},lessons:{"math-algebra1":["alg-slope","alg-line-forms"]}},
  {id:"math.systems",title:"Linear systems",prerequisites:["math.linear-equations"],evidence:{},lessons:{"math-algebra1":["alg-systems-sub","alg-elimination"]}},
  {id:"german.a1.pronunciation",title:"German A1 pronunciation",prerequisites:[],evidence:{},lessons:{"lang-german-a1":["de1-sounds"]}},
  {id:"german.a1.greetings",title:"German A1 greetings",prerequisites:["german.a1.pronunciation"],evidence:{},lessons:{"lang-german-a1":["de1-greetings"]}},
  {id:"german.a1.numbers",title:"German A1 numbers",prerequisites:["german.a1.greetings"],evidence:{},lessons:{"lang-german-a1":["de1-numbers"]}},
];

export function validateAuthoredCompetencies(
  skills: AuthoredCompetency[],
  courseLessons: Record<string, readonly string[]>,
): string[] {
  const errors: string[] = [];
  for (const skill of skills) for (const [courseId, ids] of Object.entries(skill.lessons)) {
    const known = courseLessons[courseId];
    if (!known) { errors.push(`Unknown course ${courseId} for ${skill.id}`); continue; }
    for (const id of ids) if (!known.includes(id))
      errors.push(`Unknown lesson ${courseId}/${id} for ${skill.id}`);
  }
  return errors;
}
