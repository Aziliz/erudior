/**
 * Cross-course competency graph v1.
 * Stable skill IDs are independent of the course teaching them. Skills may be
 * reused by multiple courses; cycles and broken prerequisites are invalid.
 */
export interface Competency {
  id: string;
  title: string;
  prerequisites: string[];
  /** Course ID -> existing question/drill topic labels that provide evidence. */
  evidence: Record<string, string[]>;
}
export interface SkillEvidence { mastery: number; confidence: number; n: number }
export interface CompetencyState {
  id: string;
  title: string;
  mastery: number | null;
  confidence: number;
  attempts: number;
  ready: boolean;
  blockedBy: string[];
  mastered: boolean;
}
export type CourseTopicEvidence = Record<string, Record<string, SkillEvidence>>;
const ID = /^[a-z][a-z0-9._-]{1,99}$/;
export function validateCompetencies(skills: Competency[]): string[] {
  const errors: string[] = [];
  const lookup = new Map<string, Competency>();
  for (const s of skills) {
    if (!ID.test(s.id)) errors.push(`Invalid skill ID: ${s.id}`);
    if (lookup.has(s.id)) errors.push(`Duplicate skill ID: ${s.id}`);
    lookup.set(s.id, s);
    if (!s.title.trim()) errors.push(`Missing title: ${s.id}`);
    for (const [courseId, topics] of Object.entries(s.evidence)) {
      if (!courseId.trim() || !topics.length || topics.some(t => !t.trim()))
        errors.push(`Invalid evidence mapping: ${s.id}/${courseId}`);
    }
  }
  const visiting = new Set<string>(), visited = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) { errors.push(`Prerequisite cycle: ${id}`); return; }
    if (visited.has(id)) return;
    const s = lookup.get(id);
    if (!s) return;
    visiting.add(id);
    for (const required of s.prerequisites) {
      if (!lookup.has(required)) errors.push(`Missing prerequisite: ${s.id} -> ${required}`);
      else visit(required);
    }
    visiting.delete(id);
    visited.add(id);
  };
  for (const s of skills) visit(s.id);
  return [...new Set(errors)];
}

/** Aggregate established topic evidence; unknown topics are never treated as mastered. */
export function evaluateCompetencies(
  skills: Competency[],
  sources: CourseTopicEvidence,
  threshold = 0.8,
  minimumConfidence = 0.65,
): CompetencyState[] {
  const errors = validateCompetencies(skills);
  if (errors.length) throw new Error(errors.join("; "));
  if (!(threshold > 0 && threshold <= 1) || !(minimumConfidence >= 0 && minimumConfidence <= 1))
    throw new Error("Invalid mastery thresholds");
  const values = new Map<string, {mastery:number|null;confidence:number;attempts:number;mastered:boolean}>();
  for (const skill of skills) {
    const evidence: SkillEvidence[] = [];
    for (const [courseId, topics] of Object.entries(skill.evidence))
      for (const topic of topics) {
        const entry = sources[courseId]?.[topic];
        if (entry && entry.n > 0 && Number.isFinite(entry.mastery) && Number.isFinite(entry.confidence))
          evidence.push(entry);
      }
    const attempts = evidence.reduce((sum,e) => sum + Math.max(0,e.n), 0);
    const mastery = attempts ? evidence.reduce((sum,e) => sum + e.mastery * Math.max(0,e.n),0) / attempts : null;
    const confidence = attempts ? evidence.reduce((sum,e) => sum + e.confidence * Math.max(0,e.n),0) / attempts : 0;
    values.set(skill.id,{mastery,confidence,attempts,mastered:mastery !== null && mastery >= threshold && confidence >= minimumConfidence});
  }
  return skills.map(skill => {
    const v = values.get(skill.id)!;
    const blockedBy = skill.prerequisites.filter(id => !values.get(id)!.mastered);
    return {id:skill.id,title:skill.title,...v,ready:blockedBy.length === 0,blockedBy};
  });
}

/** Prioritize immediately teachable skills before skills requiring prerequisites. */
export function recommendedCompetencies(states: CompetencyState[], limit = 5): CompetencyState[] {
  return states.filter(s => s.ready && !s.mastered)
    .sort((a,b) => (a.mastery === null ? -1 : b.mastery === null ? 1 : a.mastery-b.mastery) || a.id.localeCompare(b.id))
    .slice(0,Math.max(0,limit));
}
