import { emptyCourse } from "../src/lib/course.ts";
import { SAMPLE_ASSIGNMENT } from "../src/lib/spreadsheetAssignments.ts";
import { attachSpreadsheetAssignment,exportSpreadsheetCoursePackage } from "../src/lib/spreadsheetCoursePackage.ts";
const base=emptyCourse("Training");
base.lessons=[{id:"intro",module:"m1",title:"Intro",body:""}];
const attached=attachSpreadsheetAssignment(base,"intro",SAMPLE_ASSIGNMENT);
if(!attached.spreadsheetAssignments?.length || base.spreadsheetAssignments?.length)throw Error("Attachment mutation");
if(JSON.parse(exportSpreadsheetCoursePackage(attached)).spreadsheetAssignments[0].lessonId!=="intro")throw Error("Round trip");
try{attachSpreadsheetAssignment(base,"missing",SAMPLE_ASSIGNMENT);throw Error("Expected error");}catch(e){if(String(e).includes("Expected error"))throw e;}
try{attachSpreadsheetAssignment(attached,"intro",SAMPLE_ASSIGNMENT);throw Error("Expected duplicate error");}catch(e){if(String(e).includes("Expected duplicate error"))throw e;}
