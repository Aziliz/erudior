import assert from "node:assert/strict";
import { emptyCourse, exportCourseSnapshot, normalizeCourse } from "../src/lib/course.ts";
import { reviewCourseDigest } from "../src/lib/reviewSnapshot.ts";
import { newObjective, objectiveTasks, comparisonCoverage, objectiveGaps, readObjectiveFile, recordObjective, reviewState } from "../src/lib/objectiveReview.ts";

const course = emptyCourse("Reading workshop");
course.revision = 3;
course.author = "Course writer";
course.lessons = [{ id: "claims", module: "m1", title: "Evaluate a claim",
  body: "Explain your choice.\n\n```assignment\nwriting: response\n```" }];
course.writing = [{ id: "response", title: "Argue a position", kind: "essay", prompt: "Respond to the claim.", rubric: "reasons" }];
course.rubrics = [{ id: "reasons", title: "Use of evidence", criteria: [{ id: "proof", name: "Reasoning", levels: [{ points: 1, label: "Supported" }, { points: 0, label: "Missing" }] }] }];
const original = exportCourseSnapshot(course);
const tasks = objectiveTasks(course);
assert.deepEqual(tasks.get("writing:response")?.lessons, ["claims"]);
const objective = newObjective("claims", course.author);
const digest = await reviewCourseDigest(course);
assert.deepEqual(objectiveGaps(course,tasks,objective,digest), ["Objective","Independent task","Rubric","University comparisons","Official comparison","Missing review"]);
Object.assign(objective, { outcome: "Support a claim with evidence", task: "writing:response" });
objective.comparisons = [
  {url: "https://owl.purdue.edu/example", finding: "Evidence is tied to the claim."},
  {url: "https://library.purdue.edu/example", finding: "Explains source choice."},
  {url: "https://standards.example.org/goal", finding: "Matches the stated outcome."},
];
assert.equal(comparisonCoverage(objective.comparisons).universities,1);
objective.comparisons[1].url = "https://writing.example.edu/example";
assert.throws(() => recordObjective(objective, digest, 3, " course WRITER ", "reviewed", "Checked."));
assert.throws(() => recordObjective(objective, "", 3, "Reader", "reviewed", "Checked."));
objective.review = recordObjective(objective, digest, 3, "Reader", "changes", "The sample response needs a supporting reason.");
assert.deepEqual(objectiveGaps(course,tasks,objective,digest),["Changes requested"]);
objective.review = recordObjective(objective, digest, 3, "Reader", "reviewed", "Independently confirmed the rubric against the source.");
assert.deepEqual(objectiveGaps(course,tasks,objective,digest),[]);
const file = {format:"erudior-objective-review",version:1,courseId:course.id,objectives:[objective]};
assert.deepEqual(readObjectiveFile(JSON.stringify(file),course.id),file);
assert.throws(() => readObjectiveFile(JSON.stringify(file),"another"));
assert.throws(() => readObjectiveFile(JSON.stringify({...file,objectives:[objective,objective]}),course.id));
assert.throws(() => readObjectiveFile(JSON.stringify({...file,objectives:[{...objective,comparisons:null}]}),course.id));
assert.throws(() => readObjectiveFile(JSON.stringify({...file,objectives:[{...objective,review:{...objective.review,reviewer:"Course writer"}}]}),course.id));
assert.equal(reviewState({...objective,outcome:"A revised objective"},digest,3),"Review outdated");
assert.equal(reviewState(objective,digest,4),"Review outdated");
assert.equal(await reviewCourseDigest(normalizeCourse(JSON.parse(original))),digest);
assert.equal(reviewState(objective,await reviewCourseDigest({...course,description:"Changed within revision 3"}),3),"Review outdated");
assert.equal(exportCourseSnapshot(course),original);
const missing = {...objective, lessonId:"removed",task:"writing:removed",rubric:"removed"};
assert.deepEqual(objectiveGaps(course,tasks,missing,digest),["Lesson","Independent task","Rubric","Review outdated"]);
const manual = {...objective, task:"manual",taskNote:"Case file, final page",rubric:"#manual",rubricNote:"Marking guide, section 2"};
assert.deepEqual(objectiveGaps(course,tasks,manual,digest),["Review outdated"]);
assert.equal(comparisonCoverage([{url:"https://fake.edu.example.org",finding:"x"},...objective.comparisons.slice(1)]).universities,1);
const duplicatePage = objective.comparisons.map(s => ({ ...s }));
duplicatePage[2].url = duplicatePage[0].url + "#outcomes";
assert.equal(comparisonCoverage(duplicatePage).official, false);
assert.throws(() => readObjectiveFile(JSON.stringify({ ...file, objectives: [{ ...objective, previousReviews: [{}] }] }), course.id));
console.log("Objective review passed: task links, rubrics, independent sources, missing evidence, worksheet round-trip and revision binding.");
