/** Authored presentation, never inferred age, identity, consent, or placement authority. */
export type AssessmentPresentation = "standard" | "guided-practice";
export function parseAssessmentPresentation(value: unknown): AssessmentPresentation | undefined {
  if (value === undefined || value === "standard" || value === "guided-practice") return value;
  throw new Error('Assessment presentation must be "standard" or "guided-practice".');
}
export function isGuidedPractice(course: { assessmentPresentation?: unknown } | null | undefined): boolean {
  return course?.assessmentPresentation === "guided-practice";
}
/** Reject rather than silently converting an older timed draft or changing its scoring. */
export function guidedSessionProblem(
  course: { assessmentPresentation?: unknown } | null | undefined,
  session: { mode: string; timeLimitSec?: number; blocks?: { timeLimitSec?: number }[] },
): string | null {
  if (!isGuidedPractice(course)) return null;
  if (session.mode !== "practice" || session.timeLimitSec !== undefined || session.blocks?.some(b => b.timeLimitSec !== undefined))
    return "This course uses untimed guided practice. Return to the course to choose a practice activity. Your saved session has not been changed.";
  return null;
}
