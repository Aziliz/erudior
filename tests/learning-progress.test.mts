import assert from "node:assert/strict";
import { courseAttempts, courseProgress, enrollmentProgress } from "../src/lib/learningProgress.ts";
import type { Attempt, Course, Progress } from "../src/lib/types.ts";

const empty = (): Progress => ({version:1,seeded:false,attempts:[],stats:{},cards:{},lessonsDone:{},plans:{},activity:{},drills:{}});
const fixture = (id: string, count = 4): Course => ({
  format:"examiner-course",version:1,id,title:`Course ${id}`,
  modules:[{id:"first",title:"First module",quiz:["q1"]},{id:"second",title:"Second module"},{id:"honors",title:"Optional module",honors:true,quiz:["q1"]}],
  lessons:[
    ...Array.from({length:count},(_,index)=>({id:`lesson-${index+1}`,module:index<2?"first":"second",title:`Lesson ${index+1}`,body:""})),
    {id:"extra",module:"first",title:"Optional depth",body:"",honors:true},
    {id:"advanced",module:"honors",title:"Optional module lesson",body:""},
  ],
  banks:[{format:"examiner-bank",version:1,id:`${id}__questions`,courseId:id,title:"Questions",sections:[],exam:{questionCount:10,timeLimitMinutes:10,passingPercent:70},questions:[{id:"q1",stem:"Question",topic:"Topic",choices:["Yes","No"],answer:[0]}]}],
  decks:[],glossary:[],references:[],drills:[],
});
const attempt = (id:string, courseId:string, changes:Partial<Attempt>={}):Attempt => ({
  id,bankId:`${courseId}__questions`,bankTitle:"Questions",mode:"practice",startedAt:"2026-10-28T09:00:00.000Z",finishedAt:"2026-10-28T09:02:00.000Z",durationSec:120,total:10,answered:5,correct:4,byTopic:{},bySection:{},answers:[],...changes,
});

// Current course content is the denominator. Optional and removed lesson IDs never inflate it.
const first=fixture("first"), p=empty();
p.lessonsDone={"first/lesson-1":"2026-10-27","first/extra":"2026-10-27","first/advanced":"2026-10-27","first/removed":"2026-10-27","first-other/lesson-2":"2026-10-27"};
const original=JSON.stringify(p);
let summary=courseProgress(first,p);
assert.equal(summary.lessonsTotal,4);
assert.equal(summary.lessonsDone,1);
assert.equal(summary.percent,25);
assert.equal(summary.status,"in-progress");
assert.equal(summary.nextLessonId,"lesson-2");
assert.equal(summary.moduleQuizzesTotal,1);
assert.equal(summary.nextModuleId,null,"Module quiz remains unavailable until its core lessons are complete");
assert.equal(JSON.stringify(p),original,"Summaries never mutate saved progress");

// Module quiz tracking remains independent from the existing course completion semantics.
p.lessonsDone["first/lesson-2"]="2026-10-28";
summary=courseProgress(first,p);
assert.equal(summary.nextModuleId,"first");
p.modulesDone={"first/first":"2026-10-28","first/honors":"2026-10-28","first/removed":"2026-10-28"};
assert.equal(courseProgress(first,p).moduleQuizzesDone,1);
for(let i=3;i<=4;i++)p.lessonsDone[`first/lesson-${i}`]="2026-10-28";
p.modulesDone={};
summary=courseProgress(first,p);
assert.equal(summary.percent,100);
assert.equal(summary.complete,true,"Finishing the existing course does not gain a new module-quiz requirement");
assert.equal(summary.completionBasis,"lessons");
assert.equal(summary.moduleQuizzesDone,0);
assert.equal(summary.nextLessonId,null);

// A valid full exam can finish a course without falsely marking unread lessons complete.
const exams=empty();
exams.attempts=[attempt("pass","first",{mode:"exam",total:10,answered:10,correct:8,passingPercent:70})];
summary=courseProgress(first,exams);
assert.equal(summary.percent,100);
assert.equal(summary.complete,true);
assert.equal(summary.completionBasis,"exam");
assert.equal(summary.lessonsDone,0);
assert.equal(summary.nextLessonId,null);
for(const rejected of [
  attempt("practice","first",{correct:5,passingPercent:50}),
  attempt("lesson","first",{mode:"exam",correct:5,passingPercent:50,lesson:{courseId:"first",lessonId:"lesson-1"}}),
  attempt("module","first",{mode:"exam",correct:5,passingPercent:50,module:{courseId:"first",moduleId:"first"}}),
  attempt("empty","first",{mode:"exam",total:0,answered:0,correct:0,passingPercent:0}),
  attempt("unknown-threshold","first",{mode:"exam",total:5,answered:5,correct:5}),
  attempt("wrong-bank","first",{mode:"exam",bankId:"first__unowned",total:5,answered:5,correct:5,passingPercent:50}),
  attempt("wrong-course","first",{mode:"exam",total:5,answered:5,correct:5,passingPercent:50,lesson:{courseId:"other",lessonId:"lesson-1"}}),
]) {
  exams.attempts=[rejected];
  assert.equal(courseProgress(first,exams).complete,false,rejected.id);
}
exams.attempts=[attempt("section-fail","first",{mode:"exam",total:10,answered:10,correct:9,passingPercent:70,sectionPassing:{Required:80},bySection:{Required:{total:5,correct:3}}})];
assert.equal(courseProgress(first,exams).complete,false,"A failed required exam section prevents completion");

// History is isolated, includes explicit historical course references, and uses actual answers.
const history=empty();
history.attempts=[
  attempt("owned","first"),
  attempt("other","other",{durationSec:999,correct:5}),
  attempt("prefix-only","first",{bankId:"first__removed",durationSec:999}),
  attempt("conflict","first",{lesson:{courseId:"other",lessonId:"lesson-1"},durationSec:999}),
  attempt("historical","first",{bankId:"first__old",lesson:{courseId:"first",lessonId:"old-lesson"},finishedAt:"2026-10-29T10:00:00.000Z",durationSec:30,total:20,answered:5,correct:1}),
];
assert.deepEqual(courseAttempts(first,history).map(a=>a.id),["historical","owned"]);
summary=courseProgress(first,history);
assert.equal(summary.questionsAnswered,10);
assert.equal(summary.accuracy,0.5);
assert.equal(summary.studySeconds,150);
assert.equal(summary.lastStudiedAt,"2026-10-29T10:00:00.000Z");
assert.equal(history.attempts[0].id,"owned","Sorting results does not reorder saved history");
const wrongOwner={...first,banks:first.banks.map(bank=>({...bank,courseId:"other"}))};
assert.deepEqual(courseAttempts(wrongOwner,{...empty(),attempts:[attempt("mismatched-bank-owner","first")]}),[]);
const optionalOnly=empty();
optionalOnly.lessonsDone["first/extra"]="2026-10-29";
assert.equal(courseProgress(first,optionalOnly).percent,0);
assert.equal(courseProgress(first,optionalOnly).lastStudiedAt,"2026-10-29","Optional work remains real study activity without contributing to required completion");

// Keep equally enrolled courses equally weighted even when their lesson counts differ.
const short=fixture("short",1),long=fixture("long",100),rollup=empty();
rollup.lessonsDone["short/lesson-1"]="2026-10-29";
let overview=enrollmentProgress([short,long],rollup);
assert.equal(overview.percent,50,"A 1-lesson completed course and an untouched 100-lesson course each have equal share");
assert.equal(overview.completedCourses,1);
assert.equal(overview.lessonsDone,1);
assert.equal(overview.lessonsTotal,101);
assert.equal(enrollmentProgress([short,short,long],rollup).enrolledCourses,2,"Duplicate enrollment IDs do not inflate denominators");
rollup.enrolled=["another-profile-course"];
assert.equal(enrollmentProgress([short],rollup).completedCourses,1,"The caller's learner-scoped course list is authoritative");
const fiftyEight=fixture("fifty-eight",100),fractionalProgress=empty();
for(let i=1;i<=58;i++)fractionalProgress.lessonsDone[`fifty-eight/lesson-${i}`]="2026-10-29";
assert.equal(courseProgress(fiftyEight,fractionalProgress).percent,58);
assert.equal(enrollmentProgress([fiftyEight],fractionalProgress).percent,58,"Binary floating-point error cannot turn an exact58% average into57%");

// Missing/empty course content stays unmeasured and never silently completes.
const emptyCourse={...fixture("empty",0),lessons:[],modules:[],banks:[]};
summary=courseProgress(emptyCourse,empty());
assert.equal(summary.percent,null);
assert.equal(summary.complete,false);
assert.equal(summary.status,"no-checkpoints");
overview=enrollmentProgress([short,emptyCourse],rollup);
assert.equal(overview.percent,50);
assert.equal(overview.unmeasuredCourses,1);
assert.equal(overview.completedCourses,1);
assert.equal(enrollmentProgress([],empty()).percent,null);
const missingQuiz={...first,banks:first.banks.map(bank=>({...bank,questions:[]}))};
assert.equal(courseProgress(missingQuiz,empty()).moduleQuizzesTotal,0,"Removed questions cannot create a runnable module quiz");

// Display 100% only for complete courses, including large-course rounding boundaries.
const almost=fixture("almost",1000),almostProgress=empty();
for(let i=1;i<1000;i++)almostProgress.lessonsDone[`almost/lesson-${i}`]="2026-10-29";
assert.equal(courseProgress(almost,almostProgress).percent,99);
assert.equal(enrollmentProgress([almost],almostProgress).percent,99);
console.log("Learning progress: course isolation, completion semantics, activity measures, enrollment averages and empty states passed.");
