import assert from 'node:assert/strict';
import test from 'node:test';
import { isGuidedPractice, parseAssessmentPresentation, guidedSessionProblem } from '../src/lib/assessmentPresentation';
import { normalizeCourse, serializeCourse } from '../src/lib/course';
import { checkDoc, toCourse, migrateCommunityDocToCanonical, type CommunityDoc } from '../src/lib/communityFormat';
import { validateCanonicalAuthoring, demoteRuntimeCourse, runtimeCourseFromCanonicalAuthoring } from '../src/lib/canonicalAuthoring';
import { createOfflineCoursePackage, importOfflineCoursePackage } from '../src/lib/offlineCourse';
import { emptyProgress } from '../src/lib/storage';
import { startLessonQuiz, startModuleQuiz, startPractice, startExam, defaultExamOptions, attemptPassed } from '../src/lib/session';
import { recordSession } from '../src/lib/quiz';

const doc: CommunityDoc = {
  format:'erudior-community',version:1,title:'Synthetic guided course',description:'Synthetic presentation tests, not a published curriculum.',subject:'Math',level:'Elementary School',type:'Course',
  assessmentPresentation:'guided-practice', modules:[{id:'m1',title:'A synthetic unit',quiz:[{id:'unit-q',stem:'Which number is two?',choices:['2','4','6'],answer:[0],explanation:'Two is written 2.'}]}],
  lessons:[{id:'l1',module:'m1',title:'A synthetic lesson',blocks:[{type:'text',md:'Try a small group.'}, ...Array.from({length:5},(_,i)=>({type:'question' as const,id:'q'+i,stem:`Which number is two? (${i+1})`,choices:['2','4','6'],answer:[0],explanation:'Two is written 2.'}))]}],decks:[],
};
const meta={id:'guided-synthetic',version:1,review:'not_reviewed' as const,author:'Synthetic tests'};
const convert=(d:CommunityDoc)=>normalizeCourse(toCourse(d,meta,()=>{throw Error('No media expected');}));

test('guided presentation is explicit, not inferred from age, title, or speech support',()=>{
  assert.equal(isGuidedPractice(undefined),false);
  assert.equal(isGuidedPractice({}),false);
  assert.equal(isGuidedPractice({assessmentPresentation:'standard'}),false);
  assert.equal(isGuidedPractice({assessmentPresentation:'guided-practice'}),true);
  assert.equal(isGuidedPractice({readAloud:true,title:'Math K'} as any),false);
  for(const v of ['guided',true,false,null,0,[],{},''])assert.throws(()=>parseAssessmentPresentation(v));
});

test('block authoring validates and converts the setting without changing questions or identity',()=>{
  for(const strict of [false,true])assert.deepEqual(checkDoc(doc,strict),[]);
  const c=convert(doc), standard=convert({...doc,assessmentPresentation:'standard'});
  assert.equal(c.assessmentPresentation,'guided-practice');assert.equal(c.id,standard.id);
  assert.deepEqual(c.banks,standard.banks);assert.deepEqual(c.lessons,standard.lessons);assert.deepEqual(c.modules,standard.modules);
  for(const value of [null,true,'wrong',{}]){
    const invalid={...doc,assessmentPresentation:value} as any;
    assert(checkDoc(invalid,false).some(x=>x.includes('assessment presentation')));
    assert(checkDoc(invalid,true).some(x=>x.includes('assessment presentation')));
    assert.throws(()=>convert(invalid));
  }
});

test('normalization cannot silently drop an invalid setting via its legacy fallback',()=>{
  const c=convert(doc);
  for(const value of [null,true,'wrong',{}])assert.throws(()=>normalizeCourse({...c,assessmentPresentation:value}));
  assert.equal(normalizeCourse(JSON.parse(serializeCourse(c))).assessmentPresentation,'guided-practice');
});

test('canonical migration, exact-source serialization and local offline transport preserve the setting',async()=>{
  const c=convert(doc), {payload}=demoteRuntimeCourse(c);
  assert.deepEqual(validateCanonicalAuthoring(payload,{strict:true}),[]);
  assert.equal(runtimeCourseFromCanonicalAuthoring(payload,{id:c.id,revision:1}).assessmentPresentation,'guided-practice');
  const migrated=migrateCommunityDocToCanonical(doc,'guided-synthetic');
  assert.equal(migrated.canonical?.course.assessmentPresentation,'guided-practice');
  assert.deepEqual(checkDoc(migrated,true),[]);assert.equal(convert(migrated).assessmentPresentation,'guided-practice');
  assert(checkDoc({...migrated,assessmentPresentation:'standard'},true).some(x=>x.includes('Canonical mode')),'conflicting listing metadata is not a policy override');
  const imported=await importOfflineCoursePackage(await createOfflineCoursePackage(c));
  assert.equal(imported.assessmentPresentation,'guided-practice');
  assert.deepEqual(imported.banks.map(b=>b.questions),JSON.parse(JSON.stringify(c.banks.map(b=>b.questions))));
  assert.deepEqual(imported.lessons,JSON.parse(JSON.stringify(c.lessons)));assert.deepEqual(imported.modules,JSON.parse(JSON.stringify(c.modules)));
  for(const v of [null,true,'wrong'])assert(validateCanonicalAuthoring({...payload,course:{...payload.course,assessmentPresentation:v}} as any).some(x=>x.includes('assessmentPresentation')));
});

test('guided navigation rejects new or resumed timed sessions, without mutating the saved session',()=>{
  const c=convert(doc), bank=c.banks[0], p=emptyProgress();
  const practice=startPractice(bank,p,{count:3,topics:[],sections:[],filter:'all',shuffleChoices:false});
  assert.equal(guidedSessionProblem(c,practice),null);
  for(const s of [startExam(bank,defaultExamOptions(bank)),{...practice,timeLimitSec:60},{...practice,blocks:[{start:0,end:3,timeLimitSec:60}]}]){
    const original=JSON.stringify(s);assert(guidedSessionProblem(c,s));assert.equal(JSON.stringify(s),original);
    assert.equal(guidedSessionProblem({...c,assessmentPresentation:'standard'},s),null);
  }
});

test('lesson and unit answer grading and completion thresholds are unchanged',()=>{
  const c=convert(doc), b=c.banks[0];
  for(const make of [()=>startLessonQuiz(b,{courseId:c.id,lessonId:'l1'},c.lessons[0].quiz!),()=>startModuleQuiz(b,{courseId:c.id,moduleId:'m1'},c.modules[0].quiz!)]){
    const s=make();assert.equal(guidedSessionProblem(c,s),null);
    for(let correct=0;correct<=s.items.length;correct++){
      const answers=Object.fromEntries(s.items.map((it,i)=>[it.q.id,i<correct?[0]:[1]]));
      const result=recordSession(emptyProgress(),s,answers,{},b,20);
      assert.equal(result.attempt.correct,correct);
      const passes=correct/s.items.length>=.7;
      assert.equal(attemptPassed(result.attempt),passes);
      assert.equal(Boolean(s.lesson?result.progress.lessonsDone[c.id+'/l1']:result.progress.modulesDone?.[c.id+'/m1']),passes);
    }
  }
});
