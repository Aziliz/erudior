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
  {id:"math.geometry.foundations",title:"Geometry foundations",prerequisites:[],evidence:{},lessons:{"math-geometry":["geo-basics","geo-measure"]}},
  {id:"math.geometry.angles",title:"Angle relationships",prerequisites:["math.geometry.foundations"],evidence:{},lessons:{"math-geometry":["geo-anglepairs","geo-transversals"]}},
  {id:"math.geometry.proofs",title:"Geometric reasoning and proof",prerequisites:["math.geometry.angles"],evidence:{},lessons:{"math-geometry":["geo-deductive","geo-proofs"]}},
  {id:"math.geometry.triangles",title:"Triangle properties and congruence",prerequisites:["math.geometry.angles"],evidence:{},lessons:{"math-geometry":["geo-tri-angles","geo-congruent","geo-asa-hl"]}},
  {id:"math.geometry.similarity",title:"Similarity and proportional geometry",prerequisites:["math.geometry.triangles"],evidence:{},lessons:{"math-geometry":["geo-similar","geo-sim-thm"]}},
  {id:"math.geometry.right-triangles",title:"Right-triangle geometry",prerequisites:["math.geometry.triangles"],evidence:{},lessons:{"math-geometry":["geo-pythag","geo-special-right","geo-trig"]}},
  {id:"math.algebra2.functions",title:"Function transformations and composition",prerequisites:["math.functions"],evidence:{},lessons:{"math-algebra2":["a2-transformations","a2-composition","a2-inverses"]}},
  {id:"math.algebra2.complex",title:"Complex numbers",prerequisites:["math.linear-equations"],evidence:{},lessons:{"math-algebra2":["alg-complex","a2-complex-quadratics"]}},
  {id:"math.algebra2.polynomials",title:"Polynomial functions",prerequisites:["math.algebra2.functions"],evidence:{},lessons:{"math-algebra2":["alg-poly-functions","alg-poly-division","alg-rational-roots"]}},
  {id:"math.algebra2.rationals",title:"Rational functions and equations",prerequisites:["math.algebra2.polynomials"],evidence:{},lessons:{"math-algebra2":["alg-rational-simplify","alg-rational-eq","a2-rational-graphs"]}},
  {id:"math.algebra2.exponentials",title:"Exponential and logarithmic functions",prerequisites:["math.algebra2.functions"],evidence:{},lessons:{"math-algebra2":["alg-exp-functions","alg-logs","alg-exp-log-eq"]}},
  {id:"german.a2.past-tense",title:"German A2 past-tense communication",prerequisites:["german.a1.numbers"],evidence:{},lessons:{"lang-german-a2":["de2-perfect-review","de2-praeteritum"]}},
  {id:"german.a2.complex-sentences",title:"German A2 subordinate clauses",prerequisites:["german.a2.past-tense"],evidence:{},lessons:{"lang-german-a2":["de2-weil-dass","de2-wenn-als-ob"]}},
  {id:"german.a2.writing",title:"German A2 practical writing",prerequisites:["german.a2.complex-sentences"],evidence:{},lessons:{"lang-german-a2":["de2-writing","de2-exam-review"]}},
  {id:"math.trig.angles",title:"Angles and radians",prerequisites:["math.geometry.right-triangles"],evidence:{},lessons:{"math-trigonometry":["trig-angles","trig-radians"]}},
  {id:"math.trig.ratios",title:"Trigonometric ratios",prerequisites:["math.trig.angles"],evidence:{},lessons:{"math-trigonometry":["trig-ratios","trig-solve-right"]}},
  {id:"math.trig.unit-circle",title:"Unit circle",prerequisites:["math.trig.ratios"],evidence:{},lessons:{"math-trigonometry":["trig-unit-circle","trig-reference"]}},
  {id:"math.trig.graphs",title:"Trigonometric graphs",prerequisites:["math.trig.unit-circle"],evidence:{},lessons:{"math-trigonometry":["trig-graph-sincos","trig-transform"]}},
  {id:"math.precalc.functions",title:"Advanced functions",prerequisites:["math.algebra2.functions"],evidence:{},lessons:{"math-precalculus":["pc-functions","pc-composition","pc-inverses"]}},
  {id:"math.precalc.polynomials",title:"Precalculus polynomial analysis",prerequisites:["math.precalc.functions"],evidence:{},lessons:{"math-precalculus":["pc-polynomial-graphs","pc-poly-zeros"]}},
  {id:"math.precalc.trig",title:"Precalculus trig identities",prerequisites:["math.trig.unit-circle"],evidence:{},lessons:{"math-precalculus":["pc-unit-circle","pc-trig-graphs-identities"]}},
  {id:"math.calculus.limits",title:"Limits and continuity",prerequisites:["math.precalc.functions"],evidence:{},lessons:{"math-calculus":["calc-limits-intro","calc-limit-laws","calc-continuity"]}},
  {id:"math.calculus.derivatives",title:"Differentiation",prerequisites:["math.calculus.limits"],evidence:{},lessons:{"math-calculus":["calc-derivative-def","calc-basic-rules","calc-chain-rule"]}},
  {id:"math.calculus.integrals",title:"Integration",prerequisites:["math.calculus.derivatives"],evidence:{},lessons:{"math-calculus":["calc-antiderivatives","calc-riemann-sums","calc-ftc"]}},
  {id:"biology.foundations",title:"Scientific biology foundations",prerequisites:[],evidence:{},lessons:{"science-biology":["bio-life","bio-method"]}},
  {id:"biology.cells",title:"Cell structures",prerequisites:["biology.foundations"],evidence:{},lessons:{"science-biology":["bio-cell-theory","bio-cell-types","bio-organelles"]}},
  {id:"biology.genetics",title:"Heredity and genetics",prerequisites:["biology.cells"],evidence:{},lessons:{"science-biology":["bio-meiosis","bio-mendel","bio-dna"]}},
  {id:"physics.motion",title:"Motion and acceleration",prerequisites:[],evidence:{},lessons:{"science-physics":["phys-motion-1d","phys-const-accel"]}},
  {id:"physics.forces",title:"Newtonian forces",prerequisites:["physics.motion"],evidence:{},lessons:{"science-physics":["phys-newton","phys-friction"]}},
  {id:"physics.energy",title:"Work and energy",prerequisites:["physics.forces"],evidence:{},lessons:{"science-physics":["phys-work","phys-energy"]}},
  {id:"german.b1.narration",title:"German B1 past narration",prerequisites:["german.a2.writing"],evidence:{},lessons:{"lang-german-b1":["de3-praeteritum","de3-plusquamperfekt"]}},
  {id:"german.b1.argument",title:"German B1 opinions and argument",prerequisites:["german.b1.narration"],evidence:{},lessons:{"lang-german-b1":["de3-opinions-media","de3-politics-society"]}},
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
