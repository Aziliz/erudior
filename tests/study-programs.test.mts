import assert from 'node:assert/strict';
import { STUDY_PROGRAMS, matchingProgram, programCourses, programPathway, plannedProgramCourse, programCategory, searchPrograms } from '../src/lib/studyPrograms';
import { parseLearningPathways, pathwayProgress, starterPathways } from '../src/lib/learningPathways';
import { emptyCourse } from '../src/lib/course';
import { emptyProgress } from '../src/lib/storage';
import { CATALOG } from '../src/lib/catalog';
import type { CatalogEntry } from '../src/lib/catalog';

const jd = STUDY_PROGRAMS.find(p => p.id === 'jd-preparation')!;
assert(jd);
assert.deepEqual(jd.stages.map(s => s.courses.length), [6, 10, 9]);
const courses = programCourses(jd), path = programPathway(jd);
assert.equal(courses.length, 25);
assert.equal(jd.version, 2);
assert.deepEqual(path.courseIds.slice(0, 4), ['lsat-180-mastery', 'law-us-legal-system', 'law-case-reading', 'law-legal-research']);
const previousPath = {...path, courseIds:path.courseIds.slice(1)};
const previousBytes = JSON.stringify(previousPath);
assert.equal(matchingProgram(previousPath), undefined, 'an older saved sequence is preserved as a custom plan');
assert.deepEqual(parseLearningPathways([previousPath]), [previousPath]);
assert.equal(JSON.stringify(previousPath), previousBytes, 'the new definition does not mutate saved plans');
assert.deepEqual(parseLearningPathways([path]), [path]);
assert.equal(new Set(courses.map(c => c.courseId)).size, courses.length);
const earlier = new Set<string>();
for (const course of courses) {
  assert(course.modules.length >= 4 && course.outcomes.length >= 2 && course.assignment.length > 30);
  for (const id of course.recommendedBefore) assert(earlier.has(id), `${course.courseId} has a dangling, cyclic or out-of-order prerequisite ${id}`);
  earlier.add(course.courseId);
}
assert.equal(matchingProgram(path), jd);
assert.equal(matchingProgram({...path, title:'My law studies'}), jd);
assert.equal(matchingProgram({...path, courseIds:[...path.courseIds].reverse()}), undefined);
assert.equal(matchingProgram({...path, courseIds:path.courseIds.slice(1)}), undefined);
assert.equal(matchingProgram({...path, id:'custom'}), undefined);
const copy = programPathway(jd);copy.courseIds.reverse();assert.equal(programPathway(jd).courseIds[0], courses[0].courseId);
assert.equal(plannedProgramCourse('unrecognized'), undefined);
assert(!starterPathways().some(p => p.id === jd.id), 'planned program is separate from available-course starters');
assert(courses.slice(0, 3).every(c => CATALOG.some(e => e.id === c.courseId)), 'LSAT and the first two law courses are available');
const firstRelease = CATALOG.find(e => e.id === courses[0].courseId)!;
assert.equal(firstRelease.lessons, 58); assert.equal(firstRelease.questions, 712);
assert.equal(firstRelease.cards, 352); assert.equal(firstRelease.outline?.length, 12);
assert.deepEqual(firstRelease.outline?.map(m => m.title), courses[0].modules);
const secondRelease = CATALOG.find(e => e.id === courses[1].courseId)!;
assert.equal(secondRelease.lessons, 8); assert.equal(secondRelease.questions, 80);
assert.equal(secondRelease.outline?.length, 4);
assert.deepEqual(secondRelease.outline?.map(m => m.title), courses[1].modules);
assert.deepEqual(courses[1].recommendedBefore, [firstRelease.id]);
const firstComplete = emptyProgress();
for (const id of firstRelease.lessonIds!) firstComplete.lessonsDone[`${firstRelease.id}/${id}`] = '2026-11-03';
const readyForLaw = pathwayProgress(path, [], firstComplete, CATALOG);
assert.equal(readyForLaw.nextCourseId, secondRelease.id);
assert.equal(readyForLaw.completedCourses, 1);
assert.equal(readyForLaw.steps[1].available, true);
assert.equal(readyForLaw.steps[1].enrolled, false, 'next available course is not enrolled automatically');
for (const id of secondRelease.lessonIds!) firstComplete.lessonsDone[`${secondRelease.id}/${id}`] = '2026-11-03';
const firstTwoComplete = pathwayProgress(path, [], firstComplete, CATALOG);
assert.equal(firstTwoComplete.completedCourses, 2);
assert.equal(firstTwoComplete.nextCourseId, courses[2].courseId);
assert.equal(firstTwoComplete.steps[2].available, true);
const thirdRelease = CATALOG.find(e => e.id === courses[2].courseId)!;
assert.equal(thirdRelease.lessons, 8); assert.equal(thirdRelease.questions, 80); assert.equal(thirdRelease.cards, 64);
assert.deepEqual(thirdRelease.outline?.map(m => m.title), courses[2].modules);
const writing = CATALOG.find(e => e.id === 'law-legal-writing-1')!;
assert(writing, 'Legal Writing I is available in the existing program');
assert.equal(writing.lessons, 8); assert.equal(writing.questions, 80); assert.equal(writing.cards, 64);
const writingPlan = courses.find(c => c.courseId === writing.id)!;
assert.deepEqual(writing.outline?.map(m => m.title), writingPlan.modules);
assert.deepEqual(writingPlan.recommendedBefore, ['law-case-reading', 'law-legal-research']);
const writingStep = pathwayProgress(path, [], emptyProgress(), CATALOG).steps.find(s => s.courseId === writing.id)!;
assert.equal(writingStep.available, true); assert.equal(writingStep.enrolled, false);
const advocacy = CATALOG.find(e => e.id === 'law-legal-writing-2')!;
assert(advocacy, 'Legal Writing II is available in the existing program');
assert.equal(advocacy.lessons, 8); assert.equal(advocacy.questions, 80); assert.equal(advocacy.cards, 64);
const advocacyPlan = courses.find(c => c.courseId === advocacy.id)!;
assert.deepEqual(advocacy.outline?.map(m => m.title), advocacyPlan.modules);
assert.deepEqual(advocacyPlan.recommendedBefore, ['law-legal-writing-1']);
const advocacyStep = pathwayProgress(path, [], emptyProgress(), CATALOG).steps.find(s => s.courseId === advocacy.id)!;
assert.equal(advocacyStep.available, true); assert.equal(advocacyStep.enrolled, false);
const contracts = CATALOG.find(e => e.id === 'law-contracts-1')!;
assert(contracts, 'Contracts I is available in Stage 2');
assert.equal(contracts.lessons, 8); assert.equal(contracts.questions, 80); assert.equal(contracts.cards, 64);
const contractsPlan = courses.find(c => c.courseId === contracts.id)!;
assert.deepEqual(contracts.outline?.map(m => m.title), contractsPlan.modules);
assert.deepEqual(contractsPlan.recommendedBefore, ['law-legal-writing-1']);
const contractsStep = pathwayProgress(path, [], emptyProgress(), CATALOG).steps.find(s => s.courseId === contracts.id)!;
assert.equal(contractsStep.available, true); assert.equal(contractsStep.enrolled, false);
const contracts2 = CATALOG.find(e => e.id === 'law-contracts-2')!;
assert(contracts2, 'Contracts II is available after Contracts I in Stage 2');
assert.equal(contracts2.lessons, 8); assert.equal(contracts2.questions, 80); assert.equal(contracts2.cards, 64);
const contracts2Plan = courses.find(c => c.courseId === contracts2.id)!;
assert.deepEqual(contracts2.outline?.map(m => m.title), contracts2Plan.modules);
assert.deepEqual(contracts2Plan.recommendedBefore, ['law-contracts-1']);
const contracts2Step = pathwayProgress(path, [], emptyProgress(), CATALOG).steps.find(s => s.courseId === contracts2.id)!;
assert.equal(contracts2Step.available, true); assert.equal(contracts2Step.enrolled, false);
assert.equal(CATALOG.find(e => e.id === 'law-torts'), undefined, 'Torts remains planned');
const publishedCourses = courses.filter(c => CATALOG.some(e => e.id === c.courseId));
const allAvailableComplete = emptyProgress();
for (const course of publishedCourses) {
  for (const id of CATALOG.find(e => e.id === course.courseId)!.lessonIds!) allAvailableComplete.lessonsDone[`${course.courseId}/${id}`] = '2026-11-05';
}
const waitingForPublication = pathwayProgress(path, [], allAvailableComplete, CATALOG);
assert.equal(waitingForPublication.completedCourses, publishedCourses.length);
assert.equal(waitingForPublication.steps.find(s => s.courseId === waitingForPublication.nextCourseId)?.available, false, 'completion does not release the next planned course');
const p = emptyProgress();
p.lessonsDone[`${courses[0].courseId}/obsolete`] = '2026-11-03';
const blank = pathwayProgress(path, [], p, []);
assert.equal(blank.percent, 0);assert.equal(blank.completedCourses, 0);
assert.equal(blank.nextCourseId, courses[0].courseId);
assert(blank.steps.every(s => !s.available && s.percent === null));
assert.equal(blank.steps[0].title, courses[0].title);
const published: CatalogEntry = {...CATALOG[0], id:courses[0].courseId, title:courses[0].title, lessons:1, lessonIds:['intro'], requires:[]};
p.lessonsDone[`${published.id}/intro`] = '2026-11-03';
const partial = pathwayProgress(path, [], p, [published]);
assert.equal(partial.completedCourses, 1);assert.equal(partial.percent, 4);
assert.equal(partial.nextCourseId, courses[1].courseId);
const stage = pathwayProgress({id:'readiness',title:'Readiness',courseIds:path.courseIds.slice(0,6)},[],p,[published]);
assert.equal(stage.percent, 16);
const installed = {...emptyCourse(published.title),id:published.id,modules:[{id:'main',title:'Main'}],lessons:[{id:'intro',module:'main',title:'Intro',body:'Synthetic content.'},{id:'new',module:'main',title:'New',body:'Synthetic content.'}]};
assert.equal(pathwayProgress(path,[installed],p,[published]).completedCourses,0,'current installed content takes precedence over older catalog checkpoints');
assert.equal(pathwayProgress(path,[],emptyProgress(),[published]).percent,0,'a different learner receives no inherited completion');
console.log('Study programs: complete three-stage outline, valid ordered dependencies, snapshot matching, honest availability and equal-course/stage progress passed.');

// College core: "choose at least N" areas built on the strictest state minimum per area.
{
  const { poolStatus, programCourseIds, programPoolProblems } = await import('../src/lib/studyPrograms');
  const core = STUDY_PROGRAMS.find(p => p.id === 'college-core')!;
  assert(core && core.pools?.length, 'college core program is listed');
  assert.deepEqual(programPoolProblems(core, new Set(CATALOG.map(e => e.id))), []);
  const minimums = Object.fromEntries(core.pools!.map(pool => [pool.id, pool.minimum]));
  assert.deepEqual(minimums, {
    'written-communication': 3, 'oral-communication': 1, mathematics: 2, 'natural-sciences': 3, 'arts-humanities': 4,
    history: 2, government: 2, 'social-behavioral': 3, 'world-language': 2, 'diversity-global': 2, 'critical-thinking': 2,
    'ethics-civic': 1, 'people-environment': 1, 'computer-literacy': 1, 'college-success': 1, 'health-wellness': 1,
  });
  const subject = core.pools!.filter(pool => !pool.theme);
  assert.equal(subject.reduce((n, pool) => n + pool.minimum, 0), 25);
  const subjectIds = new Set(subject.flatMap(pool => pool.courseIds));
  for (const pool of core.pools!.filter(p => p.theme)) for (const id of pool.courseIds) assert(subjectIds.has(id), `${pool.id}: ${id} also counts in a subject area`);
  const outlineIds = new Set(programCourses(core).map(c => c.courseId));
  for (const course of programCourses(core)) {
    assert(course.modules.length >= 4 && course.outcomes.length >= 2 && course.assignment.length > 30, course.courseId);
    for (const id of course.recommendedBefore) assert(outlineIds.has(id), `${course.courseId} recommends unknown ${id}`);
  }
  const outlinesById = new Map<string, unknown>();
  for (const outline of STUDY_PROGRAMS.flatMap(programCourses)) {
    const seen = outlinesById.get(outline.courseId);
    assert(!seen || seen === outline, `${outline.courseId}: a course shared by programs uses one outline`);
    outlinesById.set(outline.courseId, outline);
  }
  const plan = programPathway(core);
  assert.equal(plan.courseIds.length, 25, 'default picks meet every area at the minimum');
  assert.deepEqual(parseLearningPathways([plan]), [plan]);
  assert.equal(matchingProgram(plan), core);
  assert.equal(matchingProgram({ ...plan, courseIds: [...plan.courseIds].reverse() }), core, 'any order of choices still follows the program');
  assert.equal(matchingProgram({ ...plan, courseIds: [...plan.courseIds, 'college-mythology'] }), core, 'extra courses are allowed');
  assert.equal(matchingProgram({ ...plan, courseIds: [...plan.courseIds, 'law-torts'] }), undefined, 'courses outside the program make it a custom plan');
  const arts = core.pools!.find(p => p.id === 'arts-humanities')!;
  const litOnly = poolStatus(arts, ['college-introduction-to-literature', 'college-mythology', 'college-ethics', 'college-introduction-to-logic'], new Set());
  assert(!litOnly.planned, 'four courses without an arts course do not meet the area');
  const done = poolStatus(arts, arts.defaults, new Set(arts.defaults));
  assert(done.planned && done.met);
  assert(programCourseIds(core).includes('math-calculus'), 'existing catalog courses can be chosen');
  assert.equal(plannedProgramCourse('math-calculus')?.title, 'Calculus', 'catalog courses reused by programs share one outline');
  assert.equal(plannedProgramCourse('college-ethics')?.title, 'Ethics');
}
console.log('College core areas passed.');

// Staged programs: Pre-Med, Medical School Preparation, Computer Science, Electrical Engineering, Cosmetology Theory.
{
  const staged = STUDY_PROGRAMS.filter(p => !p.pools?.length).map(p => p.id);
  assert(staged.length >= 50, 'license and major programs are listed');
  assert.equal(new Set(STUDY_PROGRAMS.map(p => p.id)).size, STUDY_PROGRAMS.length, 'program ids are unique');
  for (const programId of staged) {
    const program = STUDY_PROGRAMS.find(p => p.id === programId)!;
    assert(program, `${programId} is listed`);
    assert(!program.pools?.length && program.stages.length >= 2, `${programId} is a staged program`);
    assert(program.sources.length && program.sources.every(s => /^https:\/\//.test(s.url)), `${programId}: sources`);
    assert(/independent|theory only|ground school/i.test(program.notice), `${programId}: says what it is not`);
    const courses = programCourses(program);
    assert.equal(new Set(courses.map(c => c.courseId)).size, courses.length, `${programId}: no repeated course`);
    const earlier = new Set<string>();
    for (const course of courses) {
      assert(course.modules.length >= 4 && course.outcomes.length >= 2 && course.assignment.length > 30, `${programId}: ${course.courseId}`);
      for (const id of course.recommendedBefore) assert(earlier.has(id), `${programId}: ${course.courseId} recommends ${id}, which is not earlier in the program`);
      earlier.add(course.courseId);
    }
    const plan = programPathway(program);
    assert.deepEqual(parseLearningPathways([plan]), [plan]);
    assert.equal(matchingProgram(plan), program);
    assert.equal(matchingProgram({ ...plan, courseIds: [...plan.courseIds].reverse() }), undefined, `${programId}: a reordered plan is custom`);
    for (const stage of program.stages) assert(stage.summary && stage.milestone, `${programId}: ${stage.id} has a summary and portfolio`);
  }
  const cosmo = STUDY_PROGRAMS.find(p => p.id === 'cosmetology-theory')!;
  assert.match(cosmo.notice, /Theory only/);
  assert.match(cosmo.notice, /practice hours/);
  const medical = STUDY_PROGRAMS.find(p => p.id === 'medical-school-preparation')!;
  assert.match(medical.description, /Pre-Med comes first/);
  assert.equal(programCourses(medical).at(-1)!.courseId, 'med-usmle-step1-preparation');
  assert.equal(programCourses(STUDY_PROGRAMS.find(p => p.id === 'pre-med')!).at(-1)!.courseId, 'pre-med-mcat-preparation');
}
{
  for (const program of STUDY_PROGRAMS) if (program.id !== 'college-core')
    assert.notEqual(programCategory(program), 'College', `${program.id} has a subject category`);
  const majors = STUDY_PROGRAMS.filter(p => p.id.startsWith('major-'));
  assert(majors.length >= 30, 'college majors are listed');
  for (const major of majors) assert.match(major.notice, /not a degree/, `${major.id}: says it is not a degree`);
}
{
  assert.equal(searchPrograms(STUDY_PROGRAMS, '  ').length, STUDY_PROGRAMS.length, 'an empty search shows every program');
  assert(searchPrograms(STUDY_PROGRAMS, 'chemical ENGINEERING').some(p => p.id === 'major-chemical-engineering'), 'search matches every word, ignoring case');
  assert(searchPrograms(STUDY_PROGRAMS, 'Thermodynamics').length > 1, 'search matches course titles');
  assert(searchPrograms(STUDY_PROGRAMS, 'Social sciences').some(p => p.id === 'major-sociology'), 'search matches the category');
  assert.equal(searchPrograms(STUDY_PROGRAMS, 'zzqx').length, 0);
}
console.log('Staged programs passed.');
