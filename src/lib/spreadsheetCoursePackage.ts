import type { Course } from "./types";
import type { SpreadsheetAssignment } from "./spreadsheetAssignments";
import { validateAssignment } from "./spreadsheetAssignments";
/** Prepare instructor-authored workbook content for a real course release.
 * Does not publish or bypass course review/signing.
 */
export function attachSpreadsheetAssignment(course:Course,lessonId:string,assignment:SpreadsheetAssignment):Course {
 if(!course.lessons.some(l=>l.id===lessonId))throw Error("Unknown lesson");
 const problems=validateAssignment(assignment);
 if(problems.length)throw Error(problems.join("; "));
 if(course.spreadsheetAssignments?.some(a=>a.id===assignment.id))throw Error("Duplicate spreadsheet assignment ID");
 return {...course,spreadsheetAssignments:[...(course.spreadsheetAssignments??[]),{...structuredClone(assignment),lessonId}]};
}
export function exportSpreadsheetCoursePackage(course:Course):string {
 for(const assignment of course.spreadsheetAssignments??[]) {
  if(!course.lessons.some(l=>l.id===assignment.lessonId))throw Error("Dangling spreadsheet lesson");
  const problems=validateAssignment(assignment);
  if(problems.length)throw Error(problems.join("; "));
 }
 return JSON.stringify(course,null,2);
}
