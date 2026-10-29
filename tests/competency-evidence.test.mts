import { emptyCourse } from "../src/lib/course.ts";
import { resolveCompetencyEvidence, competencyCoverage } from "../src/lib/competencyEvidence.ts";
import { studentPlacementFromAuthoredCourses } from "../src/lib/competencyPlacement.ts";
import type { AuthoredCompetency } from "../src/lib/competencyCatalog.ts";
import type { Progress, Bank } from "../src/lib/types.ts";
const check=(name:string,pass:boolean)=>{if(!pass)throw Error(name);console.log("PASS",name)};
const c=emptyCourse("Math practice"); c.id="course1";
c.lessons=[{id:"lesson1",module:"m1",title:"Fractions",topics:[],body:"",quiz:["q1"]},{id:"lesson2",module:"m1",title:"Other",topics:[],body:"",quiz:["q2"]}];
c.banks=[{id:"course1__bank",courseId:"course1",questions:[{id:"q1",topic:"fractions",stem:"One half?",choices:["Yes","No"],answer:[0]},{id:"q2",topic:"unrelated",stem:"Unrelated?",choices:["Yes","No"],answer:[0]}]} as Bank];
const specs:AuthoredCompetency[]=[{id:"math.fractions",title:"Fractions",prerequisites:[],evidence:{},lessons:{"course1":["lesson1"]}},{id:"math.ratios",title:"Ratios",prerequisites:["math.fractions"],evidence:{},lessons:{"course1":["lesson2"]}}];
const mapped=resolveCompetencyEvidence(specs,[c]);
check("explicit quiz derives real topic",mapped[0].evidence.course1?.includes("fractions")===true);
check("unrelated topics excluded",!mapped[0].evidence.course1?.includes("unrelated"));
check("coverage reports linked assessments",competencyCoverage(mapped)[0].assessed);
const progress={version:1,seeded:true,attempts:[],stats:{},cards:{},lessonsDone:{},plans:{},activity:{},drills:{}} as Progress;
const placement=studentPlacementFromAuthoredCourses(specs,[c],progress);
check("empty progress has no invented mastery",placement.states[0].mastery===null);
check("dependent skill blocked",!placement.states[1].ready);
check("missing lesson link rejected",(()=>{try{resolveCompetencyEvidence([{...specs[0],lessons:{"course1":["bad"]}}],[c]);return false}catch{return true}})());

// A shared topic is display metadata, never permission to count another question.
{
  const sameTopic = structuredClone(c);
  sameTopic.banks[0].questions[1].topic = "fractions";
  sameTopic.modules = [{id:"m1",title:"Module",quiz:["q1","q2"]}];
  const exact = resolveCompetencyEvidence(specs,[sameTopic]);
  check("module quiz does not broaden lesson assessment",exact[0].assessments?.[0].questionIds.join() === "q1");
  const unrelated = structuredClone(progress);
  unrelated.stats[sameTopic.banks[0].id] = {q2:{seen:100,correct:100,lastCorrect:true,lastSeen:"2026-10-28T00:00:00Z"}};
  check("same-topic unlinked stats do not grant mastery",studentPlacementFromAuthoredCourses(specs,[sameTopic],unrelated).states[0].mastery === null);
  const missingQuiz = structuredClone(sameTopic); missingQuiz.lessons[0].quiz=[];
  const unassessed = studentPlacementFromAuthoredCourses(specs,[missingQuiz],unrelated);
  check("unassessed skill remains unknown without throwing",unassessed.states[0].mastery === null);
  const absent = resolveCompetencyEvidence(specs,[],{allowMissingCourses:true});
  check("full graph retains absent-course prerequisite nodes",absent.length === specs.length && absent.every(s => s.assessments?.length === 0));
  const duplicate = structuredClone(sameTopic); duplicate.banks[0].questions.push({...duplicate.banks[0].questions[0]});
  check("ambiguous question identity fails closed",resolveCompetencyEvidence(specs,[duplicate])[0].assessments?.length === 0);
}
