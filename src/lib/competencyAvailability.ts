import type { AuthoredCompetency } from "./competencyCatalog";

/** Prevent dangling dependencies when only a subset of courses is installed. */
export function availableCompetencySubset(skills: AuthoredCompetency[], installedIds: readonly string[]): AuthoredCompetency[] {
  const installed = new Set(installedIds);
  const byId = new Map(skills.map(s => [s.id,s]));
  const memo = new Map<string, boolean>();
  const check = (id: string, path = new Set<string>()): boolean => {
    if (memo.has(id)) return memo.get(id)!;
    const skill = byId.get(id);
    if (!skill || path.has(id)) return false;
    const next = new Set(path); next.add(id);
    const ok = Object.keys(skill.lessons).every(courseId => installed.has(courseId)) &&
      skill.prerequisites.every(parent => check(parent,next));
    memo.set(id,ok);
    return ok;
  };
  return skills.filter(skill => check(skill.id));
}
