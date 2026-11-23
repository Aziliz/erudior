import type { Course } from "./types";
import { exportCourseSnapshot, normalizeCourse } from "./course";
import { sha256Hex } from "./courseSign";

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, child]) => [key, canonical(child)]));
  return value;
}
/** Normalized portable content includes embedded media and provenance; save/reload is stable. */
export async function reviewCourseDigest(course: Course): Promise<string> {
  const portable = JSON.parse(exportCourseSnapshot(normalizeCourse(JSON.parse(exportCourseSnapshot(course)))));
  return sha256Hex(new TextEncoder().encode(JSON.stringify(canonical(portable))));
}
