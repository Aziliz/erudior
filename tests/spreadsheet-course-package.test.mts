import { emptyCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { gradeAssignment } from "../src/lib/spreadsheetAssignments.ts";
import { SAMPLE_ASSIGNMENT } from "../src/lib/spreadsheetAssignments.ts";
import { attachSpreadsheetAssignment,exportSpreadsheetCoursePackage } from "../src/lib/spreadsheetCoursePackage.ts";
const base=emptyCourse("Training");
base.lessons=[{id:"intro",module:"m1",title:"Intro",body:""}];
const attached=attachSpreadsheetAssignment(base,"intro",SAMPLE_ASSIGNMENT);
if(!attached.spreadsheetAssignments?.length || base.spreadsheetAssignments?.length)throw Error("Attachment mutation");
if(JSON.parse(exportSpreadsheetCoursePackage(attached)).spreadsheetAssignments[0].lessonId!=="intro")throw Error("Round trip");
try{attachSpreadsheetAssignment(base,"missing",SAMPLE_ASSIGNMENT);throw Error("Expected error");}catch(e){if(String(e).includes("Expected error"))throw e;}
try{attachSpreadsheetAssignment(attached,"intro",SAMPLE_ASSIGNMENT);throw Error("Expected duplicate error");}catch(e){if(String(e).includes("Expected duplicate error"))throw e;}

const installed=importValidatedCourseSnapshot(exportCourseSnapshot(attached));
const exercise=installed.spreadsheetAssignments?.[0];
if(!exercise || exercise.lessonId!=="intro" || exercise.protectedCells.join(",")!==SAMPLE_ASSIGNMENT.protectedCells.join(","))throw Error("Round-trip protection and lesson reference lost");
if(JSON.stringify(exercise.answers)!==JSON.stringify(SAMPLE_ASSIGNMENT.answers))throw Error("Grading criteria changed during round trip");
const learner=structuredClone(exercise.starter);
learner.sheets.Budget.B3="=B1-B2";
if(gradeAssignment(exercise,learner).score!==1)throw Error("Imported spreadsheet assignment cannot grade");
for(const corrupt of [
 {...attached,spreadsheetAssignments:[{...exercise,lessonId:"missing"}]},
 {...attached,spreadsheetAssignments:[exercise,exercise]},
 {...attached,spreadsheetAssignments:[{...exercise,answers:{}}]},
]) {
 try {importValidatedCourseSnapshot(JSON.stringify(corrupt));throw Error("Accepted invalid package");}
 catch(e){if(String(e).includes("Accepted invalid package"))throw e;}
}
