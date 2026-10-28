import { emptyCourse } from "../src/lib/course.ts";
import { collectCompetencyEvidence, studentCompetencyPlacement, explainCompetencyBlock } from "../src/lib/competencyPlacement.ts";
import type { Progress } from "../src/lib/types.ts";
const check=(name:string,ok:boolean)=>{if(!ok)throw new Error(name);console.log("PASS",name)};
const course=emptyCourse("Foundations"); course.id="math-foundations";
const progress={version:1,seeded:true,attempts:[],stats:{},cards:{},lessonsDone:{},plans:{},activity:{},drills:{}} as Progress;
const graph=[
 {id:"arithmetic",title:"Arithmetic",prerequisites:[],evidence:{"math-foundations":["addition"]}},
 {id:"fractions",title:"Fractions",prerequisites:["arithmetic"],evidence:{"math-foundations":["fractions"]}},
 {id:"ratios",title:"Ratios",prerequisites:["fractions"],evidence:{"math-foundations":["ratios"]}},
];
check("empty progress does not invent evidence",Object.keys(collectCompetencyEvidence([course],progress,graph)["math-foundations"]).length===0);
const placement=studentCompetencyPlacement(graph,[course],progress);
check("placement recommends first teachable skill",placement.recommendations.length===1&&placement.recommendations[0].skillId==="arithmetic");
check("suggested course tied to actual installed course",placement.recommendations[0].suggestedCourseIds[0]==="math-foundations");
check("prerequisite explanations name skill",explainCompetencyBlock(placement.states[1],placement.states).includes("Arithmetic"));
check("unknown mastery does not unlock dependents",!placement.states[2].ready);
check("no mutation of progress",progress.attempts.length===0);
