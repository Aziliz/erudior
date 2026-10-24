// Which calculator a screen offers: the course's own choice, else by its catalog subject
// (taxonomy.ts calculatorForSubject). null = the course turned the calculator off.
import type { CalcKind } from "../components/Calculator";
import type { Course } from "./types";
import { CATALOG } from "./catalog";
import { calculatorForSubject } from "./taxonomy";

export function calcKind(course: Course | undefined): CalcKind | null {
  if (course?.calculator) return course.calculator === "none" ? null : course.calculator;
  return calculatorForSubject(course ? CATALOG.find((e) => e.id === course.id)?.subject : undefined);
}
