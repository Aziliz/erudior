// Which calculator a screen offers. Real exams set the rules: the PSI real estate exams allow
// only a basic calculator, so those courses get the basic one everywhere; math and science get
// the graphing calculator (AP exams allow one); other subjects get the scientific one.
import type { CalcKind } from "../components/Calculator";
import type { Course } from "./types";
import { CATALOG } from "./catalog";

const GRAPHING = new Set(["Math", "Science", "Engineering", "Computer science", "Economics", "Business", "Personal finance", "Test prep"]);
const BASIC = new Set(["Real estate", "Law"]);

export function calcKind(course: Course | undefined): CalcKind {
  if (course?.calculator) return course.calculator;
  const subject = course ? CATALOG.find((e) => e.id === course.id)?.subject : undefined;
  if (subject && BASIC.has(subject)) return "basic";
  if (subject && GRAPHING.has(subject)) return "graphing";
  return "scientific";
}
