import { addCommunityModule, deleteCommunityModule } from "../src/lib/communityModules";
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
assert(added.lessons[0].module === added.modules?.[0].id, "existing lesson stays in original module");
const withLesson: CommunityDoc = {...added, lessons: [...added.lessons, {id:"l2",title:"Shapes",module:"m3",blocks:[{type:"text",md:"Draw a circle."}]}]};
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
if(errors) process.exit(1);
console.log("community module regression tests passed");
