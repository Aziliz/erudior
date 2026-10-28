import { prepareOfficialPromotion } from "../src/lib/communityPromotion";
import { type CommunityDoc } from "../src/lib/communityFormat";
const lesson = { id: "l1", title: "Numbers", blocks: [{ type: "text" as const, md: "Count to ten." }] };
const d: CommunityDoc = {
 format: "erudior-community", version: 1, title: "Math K",
 description: "An introductory course in counting and numbers.",
 subject: "Math", level: "Elementary School", type: "Course",
 lessons: [lesson], decks: [],
};
const meta = { id: "community-1", version: 2, author: "Teacher", review: "reviewed" as const };
let failures=0;
function ok(label:string,pass:boolean) {if(!pass){console.error("FAIL",label);failures++;}}
const converted = prepareOfficialPromotion(d,meta,"math-k");
ok("official identifier",converted.id==="math-k");
ok("published lesson preserved",converted.lessons[0]?.body.includes("Count to ten.")??false);
ok("converted format",converted.format==="examiner-course");
ok("no community-review label on official course",!converted.community);
function rejects(label:string,run:()=>unknown) {try{run();ok(label,false)}catch{ok(label,true)}}
rejects("non-reviewed not promotable",()=>prepareOfficialPromotion(d,{...meta,review:"not_reviewed"},"math-k"));
rejects("unpublished not promotable",()=>prepareOfficialPromotion(d,{...meta,version:0},"math-k"));
rejects("invalid ID rejected",()=>prepareOfficialPromotion(d,meta,"community-abc"));
rejects("invalid course rejected",()=>prepareOfficialPromotion({...d,description:""},meta,"math-k"));
rejects("missing approved image resolver rejected",()=>prepareOfficialPromotion({...d,lessons:[{...lesson,blocks:[{type:"image",imageId:"img1",alt:"Dot",caption:""}]}]},meta,"math-k"));
if(failures)process.exit(1);
console.log("community promotion tests passed");
