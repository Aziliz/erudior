import { availableCompetencySubset } from "../src/lib/competencyAvailability.ts";
import { FOUNDATION_COMPETENCIES } from "../src/lib/competencyCatalog.ts";
const check=(name:string,ok:boolean)=>{if(!ok)throw Error(name);console.log("PASS",name)};
const none=availableCompetencySubset(FOUNDATION_COMPETENCIES,[]);
check("no installed courses yields no skills",none.length===0);
const algebraOnly=availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-algebra1"]);
check("algebra alone does not expose missing math prerequisites",algebraOnly.length===0);
const pre=availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-prealgebra"]);
check("pre-algebra yields usable skills",pre.some(s=>s.id==="math.fractions"));
check("pre-algebra omits algebra-specific skills",!pre.some(s=>s.id==="math.functions"));
const all=availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-prealgebra","math-algebra1","lang-german-a1"]);
check("complete installed subjects include all mapped skills",all.length===13);
check("original taxonomy remains unchanged",FOUNDATION_COMPETENCIES.length===45);

const expanded=availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-prealgebra","math-algebra1","math-algebra2","math-geometry","lang-german-a1","lang-german-a2"]);
check("expanded course set exposes all mapped skills",expanded.length===FOUNDATION_COMPETENCIES.length);
check("algebra 2 remains blocked without prerequisites",!availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-algebra2"]).some(s=>s.id==="math.algebra2.polynomials"));
check("german A2 remains blocked without A1",!availableCompetencySubset(FOUNDATION_COMPETENCIES,["lang-german-a2"]).some(s=>s.id==="german.a2.writing"));

const full=availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-prealgebra","math-algebra1","math-algebra2","math-geometry","math-trigonometry","math-precalculus","math-calculus","science-biology","science-physics","lang-german-a1","lang-german-a2","lang-german-b1"]);
check("all 45 authored skill definitions available with full curriculum",full.length===45);
check("calculus without prerequisite courses is excluded",!availableCompetencySubset(FOUNDATION_COMPETENCIES,["math-calculus"]).some(s=>s.id==="math.calculus.integrals"));
check("German B1 requires A1 and A2",!availableCompetencySubset(FOUNDATION_COMPETENCIES,["lang-german-b1"]).some(s=>s.id==="german.b1.argument"));
