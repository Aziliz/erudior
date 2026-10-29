import { addCommunityLesson, addCommunityModule, deleteCommunityModule, moveCommunityLesson, reorderCommunityModule, reorderCommunityLesson, communityLessonDeleteProblem, deleteCommunityLesson, communityModuleDeleteProblem } from "../src/lib/communityModules";
import { checkDoc, toCourse, type CommunityDoc } from "../src/lib/communityFormat";

let errors = 0;
const assert = (condition: boolean, label: string) => {
  if (!condition) { console.error("FAIL", label); errors++; }
};
const base: CommunityDoc = {
  format: "erudior-community", version: 1, title: "Math K",
  description: "Counting, shape, and number lessons.", subject: "Math", level: "Elementary School",
  lessons: [{ id: "l1", title: "Count", blocks: [{type:"text",md:"Count objects."}] }],
  decks: [],
};
const added = addCommunityModule(base,"m3");
assert(added.modules?.length === 2, "implicit module becomes explicit plus exactly one newly added module");
assert(new Set(added.modules?.map(m=>m.id)).size === 2, "module IDs are unique");
const collision = addCommunityModule({...base, lessons:[{...base.lessons[0],id:"m1"},{...base.lessons[0],id:"m2"}]}, "m3");
assert(collision.modules?.[0].id === "m4", "implicit module avoids collisions with lesson IDs");
assert(added.lessons[0].module === added.modules?.[0].id, "existing lesson stays in original module");
const appended = addCommunityLesson(added, added.modules![1].id);
assert(appended.lessons.length === 2, "adding a lesson inside a module creates exactly one lesson");
assert(appended.lessons[1].module === added.modules![1].id, "new lesson is assigned to the selected module");
assert(new Set(appended.lessons.map(l => l.id)).size === appended.lessons.length, "new lesson ID is unique");
const withLesson: CommunityDoc = {...added, lessons: [...added.lessons, {id:"l2",title:"Shapes",module:"m3",blocks:[{type:"text",md:"Draw a circle."}]}]};
const moved = moveCommunityLesson(withLesson, "l1", "m3");
assert(moved.lessons[0].module === "m3", "lesson can be moved using module selector");
assert(moved.lessons[0].blocks === withLesson.lessons[0].blocks, "moving lessons preserves lesson contents");
assert(moveCommunityLesson(moved, "l1", "nonexistent") === moved, "invalid module move is ignored");
const deleted = deleteCommunityModule(withLesson,added.modules![0].id);
assert(deleted.modules?.length === 1, "delete removes exactly one module");
assert(deleted.lessons.every(l=>l.module==="m3"), "lessons are reassigned instead of deleted");
assert(checkDoc(deleted,true).length===0, "deleted module document remains publishable");
const final = deleteCommunityModule(deleted,"m3");
assert(final.modules === undefined, "last module returns to implicit default");
assert(final.lessons.every(l=>!l.module), "lessons become implicit after last module delete");
assert(checkDoc(final,true).length===0, "last-module deletion preserves valid course");
const converted = toCourse(withLesson, {id:"t",version:1,review:"not_reviewed",author:"test"}, ()=>"") as {lessons:{module:string}[]};
assert(converted.lessons[0].module !== converted.lessons[1].module, "official course conversion keeps module assignment");
const implicit = { ...withLesson, lessons: withLesson.lessons.map((l,i) => i === 0 ? { ...l, module: undefined } : l) };
const reordered = reorderCommunityModule(implicit, implicit.modules![0].id, 1);
assert(reordered.lessons[0].module === implicit.modules![0].id, "module reorder pins omitted assignments to original stable module");
assert(reorderCommunityModule(implicit,"missing",1) === implicit, "stale module operation is a no-op");
assert(addCommunityModule(withLesson, withLesson.modules![0].id) === withLesson, "duplicate requested module is rejected");
assert(addCommunityModule(withLesson, "l1") === withLesson, "module/lesson ID collision rejected");
const repeat = addCommunityLesson(addCommunityLesson(withLesson));
assert(new Set(repeat.lessons.map(l=>l.id)).size === repeat.lessons.length, "repeated add resolves IDs in latest document");
const vocab = { ...withLesson, vocab: [{ id:"v1", lesson:"l1", term:"one", meanings:["one"] }] };
assert(!!communityLessonDeleteProblem(vocab,"l1") && deleteCommunityLesson(vocab,"l1") === vocab, "vocabulary is not orphaned");
const linked = { ...withLesson, writing: [{id:"w", module:withLesson.modules![0].id}] } as unknown as CommunityDoc;
assert(!!communityModuleDeleteProblem(linked,withLesson.modules![0].id) && deleteCommunityModule(linked,withLesson.modules![0].id) === linked, "assessed work module is not orphaned");
for (const key of ["spreadsheetAssignments","branchingScenarios","scientificWorkspaces","advancedAssessments"] as const) {
 const attached = { ...withLesson, [key]: [{id:"a",lessonId:"l1"}] } as unknown as CommunityDoc;
 assert(deleteCommunityLesson(attached,"l1") === attached, key + " blocks linked lesson deletion");
 assert(reorderCommunityLesson(attached,"l1",1)[key] === attached[key], key + " retained unchanged by reorder");
}
const invalidDestination = moveCommunityLesson(withLesson,"l1","absent");
assert(invalidDestination === withLesson, "stale move cannot orphan lesson");
assert(deleteCommunityLesson(withLesson,"missing") === withLesson, "repeated delete is idempotent");
if(errors) process.exit(1);
console.log("community module regression tests passed");
