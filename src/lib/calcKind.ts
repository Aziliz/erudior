import type { CalcKind } from "../components/Calculator";
import type { Course, Progress } from "./types";
import { catalogEntry } from "./catalog";
import { calculatorForSubject } from "./taxonomy";

export function calcKind(course: Pick<Course, "id" | "calculator"> | undefined, preferences?: Progress["courseCalculators"]): CalcKind | null {
  if (!course || course.calculator === "none") return null;
  const enabled = preferences?.[course.id];
  if (enabled === false) return null;
  const kind = course.calculator ?? calculatorForSubject(catalogEntry(course.id)?.subject);
  if (kind !== "none") return kind;
  return null;
}
