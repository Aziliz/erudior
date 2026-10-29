import type { Course } from "./types";
import type { SpreadsheetAssignment } from "./spreadsheetAssignments";
import { normalizeSpreadsheetAssignment, validateAssignment } from "./spreadsheetAssignments";
/** Prepare instructor-authored workbook content for a real course release.
 * Does not publish or bypass course review/signing.
 */
export function attachSpreadsheetAssignment(course:Course,lessonId:string,assignment:SpreadsheetAssignment):Course {
 if(!course.lessons.some(l=>l.id===lessonId))throw Error("Unknown lesson");
 const problems=validateAssignment(assignment);
 if(problems.length)throw Error(problems.join("; "));
 if(course.spreadsheetAssignments?.some(a=>a.id===assignment.id))throw Error("Duplicate spreadsheet assignment ID");
 return {...course,spreadsheetAssignments:[...(course.spreadsheetAssignments??[]),{...normalizeSpreadsheetAssignment(assignment),lessonId}]};
}
export function exportSpreadsheetCoursePackage(course:Course):string {
 for(const assignment of course.spreadsheetAssignments??[]) {
  if(!course.lessons.some(l=>l.id===assignment.lessonId))throw Error("Dangling spreadsheet lesson");
  const problems=validateAssignment(assignment);
  if(problems.length)throw Error(problems.join("; "));
 }
 return JSON.stringify(course,null,2);
}

/** Replace the authored content without changing the progress-bearing assignment ID. */
export function replaceSpreadsheetAssignment(course:Course,lessonId:string,assignment:SpreadsheetAssignment):Course {
 if(!course.lessons.some(l=>l.id===lessonId))throw Error("Unknown lesson");
 const problems=validateAssignment(assignment);
 if(problems.length)throw Error(problems.join("; "));
 if(!course.spreadsheetAssignments?.some(a=>a.id===assignment.id))throw Error("Unknown spreadsheet assignment ID");
 return {...course,spreadsheetAssignments:course.spreadsheetAssignments.map(a=>a.id===assignment.id?{...normalizeSpreadsheetAssignment(assignment),lessonId}:a)};
}

/** Remove only the draft attachment. Published revision checks separately protect issued IDs. */
export function removeSpreadsheetAssignment(course:Course,assignmentId:string):Course {
 if(!course.spreadsheetAssignments?.some(a=>a.id===assignmentId))throw Error("Unknown spreadsheet assignment ID");
 return {...course,spreadsheetAssignments:course.spreadsheetAssignments.filter(a=>a.id!==assignmentId)};
}
