import {emptyCourse} from "../src/lib/course.ts";
import {SAMPLE_ASSIGNMENT} from "../src/lib/spreadsheetAssignments.ts";
import {attachSpreadsheetAssignment} from "../src/lib/spreadsheetCoursePackage.ts";
import {spreadsheetReviewReport,acknowledgeSpreadsheetReview} from "../src/lib/spreadsheetReview.ts";
import {importValidatedCourseSnapshot} from "../src/lib/courseIntegrity.ts";
const check=(ok:boolean,message:string)=>{if(!ok)throw Error(message)};
const course=emptyCourse("Spreadsheet training");
course.lessons=[{id:"intro",module:course.modules[0].id,title:"Intro",body:"Lesson"}];
const attached=attachSpreadsheetAssignment(course,"intro",SAMPLE_ASSIGNMENT);
const report=spreadsheetReviewReport(attached);
check(report.readyForHumanReview,"valid attachment should be review-ready");
check(report.assignments[0].gradedCells===1 && report.assignments[0].protectedCells===5,"review counts");
const receipt=acknowledgeSpreadsheetReview(attached,"Instructor A","2026-10-28T12:00:00Z");
check(receipt.reviewer==="Instructor A","review acknowledgement");
check(importValidatedCourseSnapshot(receipt.snapshot).spreadsheetAssignments?.[0].lessonId==="intro","reviewed snapshot round-trip");
const corrupt={...attached,spreadsheetAssignments:[{...attached.spreadsheetAssignments![0],lessonId:"missing"}]};
check(!spreadsheetReviewReport(corrupt).readyForHumanReview,"invalid assignment must block review");
let failed=false;try{acknowledgeSpreadsheetReview(corrupt,"Instructor","2026-10-28");}catch{failed=true}
check(failed,"invalid course cannot be acknowledged");
failed=false;try{acknowledgeSpreadsheetReview(attached,"","2026-10-28");}catch{failed=true}
check(failed,"anonymous review rejected");
