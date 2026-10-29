import type { Course } from "./types";
import { validateCourseIntegrity } from "./courseIntegrity";
import { exportCourseSnapshot } from "./course";
import { validateAssignment } from "./spreadsheetAssignments";

/** Review report is descriptive and does not authorize or sign an official publication. */
export function spreadsheetReviewReport(course:Course) {
  const issues=validateCourseIntegrity(course).map(x=>x.path+": "+x.message);
  const assignments=course.spreadsheetAssignments??[];
  const seen=new Set<string>();
  const entries=assignments.map(a=>{
    const errors=validateAssignment(a);
    if(!course.lessons.some(l=>l.id===a.lessonId))errors.push("Unknown lesson");
    if(seen.has(a.id))errors.push("Duplicate assignment ID");
    seen.add(a.id);
    return {id:a.id,lessonId:a.lessonId,title:a.title,
      gradedCells:Object.keys(a.answers).length,protectedCells:a.protectedCells.length,
      issues:errors};
  });
  return {courseId:course.id,assignments:entries,
    issues:[...new Set([...issues,...entries.flatMap(e=>e.issues.map(i=>e.id+": "+i))])],
    readyForHumanReview:assignments.length>0 && issues.length===0 && entries.every(e=>e.issues.length===0)};
}
export interface SpreadsheetReviewReceipt {
  courseId:string;
  reviewer:string;
  reviewedAt:string;
  snapshot:string;
}
/** Explicit acknowledgement of a reviewed snapshot. No automatic publication or endorsement. */
export function acknowledgeSpreadsheetReview(course:Course,reviewer:string,reviewedAt:string):SpreadsheetReviewReceipt {
  const report=spreadsheetReviewReport(course);
  if(!report.readyForHumanReview)throw Error("Course spreadsheet assignments are not review-ready: "+report.issues.join("; "));
  if(!reviewer.trim() || !Number.isFinite(Date.parse(reviewedAt)))throw Error("Reviewer and review date required");
  return {courseId:course.id,reviewer:reviewer.trim(),reviewedAt,snapshot:exportCourseSnapshot(course)};
}
