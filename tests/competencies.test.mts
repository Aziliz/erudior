import { validateCompetencies, evaluateCompetencies, recommendedCompetencies, type Competency } from "../src/lib/competencies.ts";
const skills: Competency[] = [
  { id:"math.fractions",title:"Fractions",prerequisites:[],evidence:{"math-prealgebra":["fractions"],"math-5":["fraction operations"]}},
  { id:"math.ratios",title:"Ratios",prerequisites:["math.fractions"],evidence:{"math-prealgebra":["ratios"]}},
  { id:"math.proportions",title:"Proportions",prerequisites:["math.ratios"],evidence:{"math-prealgebra":["proportions"]}},
];
const ok=(name:string,condition:boolean)=>{if(!condition)throw new Error(name);console.log("PASS",name)};
ok("valid skill graph",validateCompetencies(skills).length===0);
ok("missing prerequisites rejected",validateCompetencies([{...skills[0],prerequisites:["missing"]}]).some(e=>e.includes("Missing prerequisite")));
ok("cycles rejected",validateCompetencies([{...skills[0],prerequisites:["math.ratios"]},...skills.slice(1)]).some(e=>e.includes("cycle")));
ok("duplicate IDs rejected",validateCompetencies([skills[0],skills[0]]).some(e=>e.includes("Duplicate")));
const evidence={"math-prealgebra":{fractions:{mastery:0.9,confidence:0.9,n:12},ratios:{mastery:0.5,confidence:0.9,n:8}},"math-5":{"fraction operations":{mastery:0.85,confidence:0.9,n:8}}};
const result=evaluateCompetencies(skills,evidence);
ok("shared skill aggregates two courses",result[0].mastery!==null&&result[0].mastery>0.85&&result[0].mastery<0.91);
ok("prerequisite mastery unlocks ratios",result[1].ready);
ok("unmastered ratios blocks proportions",result[2].blockedBy.includes("math.ratios"));
ok("unknown skills are not mastered",result[2].mastery===null&&!result[2].mastered);
ok("recommendation selects unmastered ready skill",recommendedCompetencies(result)[0]?.id==="math.ratios");
const low=evaluateCompetencies(skills,{"math-prealgebra":{fractions:{mastery:0.95,confidence:0.2,n:1}}});
ok("low-confidence apparent mastery does not unlock",low[1].ready===false);
