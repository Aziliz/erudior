import type { Course } from "./types";
import { exportCourseSnapshot } from "./course";
import { sha256Hex } from "./courseSign";
import { spreadsheetReviewReport } from "./spreadsheetReview";

/** A review acknowledgement is scoped to exact course bytes, not just a course ID. */
export interface SpreadsheetReleaseApproval {
  courseId:string;
  revision:number;
  snapshotSha256:string;
  reviewer:string;
  reviewedAt:string;
}
export async function validateSpreadsheetReleaseApproval(course:Course, approval:SpreadsheetReleaseApproval|undefined):Promise<string[]> {
 if(!(course.spreadsheetAssignments?.length))return [];
 const report=spreadsheetReviewReport(course);
 if(!report.readyForHumanReview)return ["Spreadsheet content failed review preflight: "+report.issues.join("; ")];
 if(!approval)return ["Spreadsheet approval missing"];
 const expected=await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(course)));
 const errors:string[]=[];
 if(approval.courseId!==course.id||approval.revision!==(course.revision??1))errors.push("Approval course identity or revision mismatch");
 if(approval.snapshotSha256!==expected)errors.push("Approval snapshot digest mismatch");
 if(!approval.reviewer?.trim() || !Number.isFinite(Date.parse(approval.reviewedAt)))errors.push("Approval reviewer/date invalid");
 return errors;
}
