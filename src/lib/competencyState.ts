/** Durable, profile-local competency evidence. Manual placement never alters measured scores. */
import type { Course, Progress } from './types';
import { competencyEvidenceKey, evaluateCompetencies, type Competency, type CourseTopicEvidence, type CompetencyState } from './competencies';
import { collectCompetencyEvidence } from './competencyPlacement';

export interface CompetencySource {
  skillId: string; courseId: string; bankId: string; questionId: string;
  fingerprint: string; revision: number;
  /** After revision change only new evidence counts; cumulative legacy stats are baselined. */
  since?: string; baselineSeen?: number; baselineCorrect?: number;
  /** Active cumulative estimate; historical transitions are never summed. */
  snapshotId?: string;
}
export interface CompetencySnapshot extends CompetencySource {
  id: string; at: string; mastery: number; confidence: number; n: number;
}
export type CompetencyDecisionAction = 'ready' | 'mastered' | 'needs-practice' | 'revoke';
export interface CompetencyDecision {
  id: string; skillId: string; action: CompetencyDecisionAction; reason: string;
  actorId: string; actorName: string; at: string;
  /** Plaintext learner imports retain history but cannot confer supervising-adult authority. */
  imported?: boolean;
}
export interface CompetencyLedger { version: 1; sources: CompetencySource[]; snapshots: CompetencySnapshot[]; decisions: CompetencyDecision[] }
export interface CompetencyCapture { sources: CompetencySource[]; snapshots: CompetencySnapshot[]; installedCourseIds: string[]; skillIds: string[] }
export const COMPETENCY_LIMITS = { sources: 10000, snapshots: 50000, decisions: 5000, bytes: 32 * 1024 * 1024 };
const id = (x: unknown): x is string => typeof x === 'string' && x.length > 0 && x.length <= 200 && !/[\x00-\x1f]/.test(x) && !['__proto__','constructor','prototype'].includes(x);
const iso = (x: unknown): x is string => typeof x === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(x) && Number.isFinite(Date.parse(x));
const hash = (x: unknown): x is string => typeof x === 'string' && /^[a-f0-9]{64}$/.test(x);
const record = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const sourceKey = (s: CompetencySource) => JSON.stringify([s.skillId,s.courseId,s.bankId,s.questionId]);
function sourceValid(s: unknown): s is CompetencySource {
  return record(s) && [s.skillId,s.courseId,s.bankId,s.questionId].every(id) && hash(s.fingerprint) && Number.isSafeInteger(s.revision) && Number(s.revision) >= 0 && (s.snapshotId === undefined || hash(s.snapshotId)) &&
    (s.since === undefined || (iso(s.since) && Number.isSafeInteger(s.baselineSeen) && Number(s.baselineSeen) >= 0 && Number.isSafeInteger(s.baselineCorrect) && Number(s.baselineCorrect) >= 0 && Number(s.baselineCorrect) <= Number(s.baselineSeen)));
}
export function emptyCompetencyLedger(): CompetencyLedger { return { version: 1, sources: [], snapshots: [], decisions: [] }; }
/** Throw before restore/write; malformed evidence must never silently become mastery. */
export function parseCompetencyLedger(raw: unknown): CompetencyLedger {
  if (raw === undefined) return emptyCompetencyLedger();
  if (!record(raw) || raw.version !== 1 || !Array.isArray(raw.sources) || !Array.isArray(raw.snapshots) || !Array.isArray(raw.decisions) ||
      raw.sources.length > COMPETENCY_LIMITS.sources || raw.snapshots.length > COMPETENCY_LIMITS.snapshots || raw.decisions.length > COMPETENCY_LIMITS.decisions ||
      new TextEncoder().encode(JSON.stringify(raw)).length > COMPETENCY_LIMITS.bytes) throw Error('Invalid or oversized competency history.');
  if (!raw.sources.every(sourceValid) || new Set(raw.sources.map(sourceKey)).size !== raw.sources.length) throw Error('Invalid competency source lineage.');
  for (const s of raw.snapshots) if (!sourceValid(s) || !record(s) || !hash(s.id) || !iso(s.at) ||
    !Number.isFinite(s.mastery) || Number(s.mastery) < 0 || Number(s.mastery) > 1 || !Number.isFinite(s.confidence) || Number(s.confidence) < 0 || Number(s.confidence) > 1 ||
    !Number.isSafeInteger(s.n) || Number(s.n) < 1 || Number(s.n) > 100000000) throw Error('Invalid competency evidence snapshot.');
  if (new Set(raw.snapshots.map((s: CompetencySnapshot) => s.id)).size !== raw.snapshots.length) throw Error('Duplicate competency snapshot.');
  for (const d of raw.decisions) if (!record(d) || ![d.id,d.skillId,d.actorId,d.actorName].every(id) || !iso(d.at) ||
    (d.imported !== undefined && typeof d.imported !== 'boolean') || !['ready','mastered','needs-practice','revoke'].includes(String(d.action)) || typeof d.reason !== 'string' || !d.reason.trim() || d.reason.length > 2000)
      throw Error('Invalid competency placement history.');
  if (new Set(raw.decisions.map((d: CompetencyDecision) => d.id)).size !== raw.decisions.length) throw Error('Duplicate competency decision.');
  const bySnapshot = new Map(raw.snapshots.map((snapshot: CompetencySnapshot) => [snapshot.id, snapshot]));
  for (const s of raw.sources) if (s.snapshotId !== undefined) {
    const snapshot = bySnapshot.get(s.snapshotId);
    if (!snapshot || sourceKey(snapshot) !== sourceKey(s) || snapshot.fingerprint !== s.fingerprint || snapshot.since !== s.since) throw Error('Invalid active competency evidence reference.');
  }
  return structuredClone(raw) as unknown as CompetencyLedger;
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value).filter(([,v]) => v !== undefined).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => JSON.stringify(k)+':'+canonical(v)).join(',') + '}';
  return JSON.stringify(value);
}
async function digest(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonical(value));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
/** Snapshot exact identities and assessed statistics; topic aliases never enter this ledger. */
export async function captureCompetencyEvidence(graph: Competency[], courses: Course[], progress: Progress, at = new Date().toISOString()): Promise<CompetencyCapture> {
  if (!iso(at)) throw Error('Invalid competency capture time.');
  const previous = parseCompetencyLedger(progress.competencies);
  const scores = collectCompetencyEvidence(courses,progress,graph), sources: CompetencySource[] = [], snapshots: CompetencySnapshot[] = [];
  for (const skill of graph) for (const assessment of skill.assessments ?? []) {
    const course = courses.find(c=>c.id===assessment.courseId), bank = course?.banks.find(b=>b.id===assessment.bankId);
    if (!course || !bank) continue;
    for (const questionId of assessment.questionIds) {
      const question = bank.questions.find(q=>q.id===questionId); if (!question) continue;
      const revision = course.revision ?? 0;
      const source: CompetencySource = { skillId:skill.id, courseId:course.id, bankId:bank.id, questionId, revision,
        fingerprint:await digest({courseId:course.id,bankId:bank.id,question,revision}) };
      const prior = previous.sources.find(s=>sourceKey(s)===sourceKey(source)) ?? [...previous.snapshots].reverse().find(s=>sourceKey(s)===sourceKey(source));
      const stat = progress.stats[bank.id]?.[questionId];
      if (prior?.fingerprint === source.fingerprint && prior.since) Object.assign(source,{since:prior.since,baselineSeen:prior.baselineSeen,baselineCorrect:prior.baselineCorrect});
      else if (!prior || prior.fingerprint !== source.fingerprint) Object.assign(source,{since:at,baselineSeen:stat?.seen ?? 0,baselineCorrect:stat?.correct ?? 0});
      sources.push(source);
      let score = scores[course.id]?.[competencyEvidenceKey(bank.id,questionId)];
      if (source.since) {
        const since = Date.parse(source.since);
        const filtered: Progress = {...progress,attempts:progress.attempts.filter(a=>Date.parse(a.finishedAt)>since),stats:{}};
        if (stat && stat.seen >= source.baselineSeen! && stat.correct >= source.baselineCorrect!) filtered.stats = {[bank.id]:{[questionId]:{...stat,seen:stat.seen-source.baselineSeen!,correct:stat.correct-source.baselineCorrect!}}};
        score = collectCompetencyEvidence(courses,filtered,[{...skill,assessments:[{...assessment,questionIds:[questionId]}]}])[course.id]?.[competencyEvidenceKey(bank.id,questionId)];
      }
      if (score && score.n > 0) {
        // Cumulative observations replace their earlier score; never sum snapshots.
        const snapshot = {...source,...score,at,id:await digest({...source,...score})};
        source.snapshotId = snapshot.id;
        snapshots.push(snapshot);
      }
    }
  }
  const result = {sources,snapshots,installedCourseIds:courses.map(c=>c.id),skillIds:graph.map(s=>s.id)};
  parseCompetencyLedger({version:1,sources,snapshots,decisions:[]});
  return result;
}
export function syncCompetencyLedger(progress: Progress, capture: CompetencyCapture): Progress {
  const ledger = parseCompetencyLedger(progress.competencies);
  parseCompetencyLedger({version:1,sources:capture.sources,snapshots:capture.snapshots,decisions:[]});
  const installed = new Set(capture.installedCourseIds), skills = new Set(capture.skillIds);
  // Missing installations retain their last independently identified evidence. Installed
  // revisions replace active lineage, so removed/changed questions cannot retain mastery.
  const sources = ledger.sources.filter(s=>!installed.has(s.courseId) || !skills.has(s.skillId));
  sources.push(...capture.sources);
  const snapshots = [...ledger.snapshots]; const seen = new Set(snapshots.map(s=>s.id));
  for (const s of capture.snapshots) if (!seen.has(s.id)) { snapshots.push(s); seen.add(s.id); }
  const next = parseCompetencyLedger({...ledger,sources,snapshots});
  return {...progress,competencies:next};
}
export function latestCompetencyDecision(ledger: CompetencyLedger, skillId: string): CompetencyDecision | undefined {
  const decision = [...ledger.decisions].reverse().find(d=>d.skillId===skillId && !d.imported);
  return decision?.action === 'revoke' ? undefined : decision;
}
export function applyCompetencyDecision(progress: Progress, decision: CompetencyDecision): Progress {
  const ledger = parseCompetencyLedger(progress.competencies), existing = ledger.decisions.find(d=>d.id===decision.id);
  if (existing) {
    if (JSON.stringify(existing)!==JSON.stringify(decision)) throw Error('Competency decision ID conflicts with history.');
    return progress;
  }
  return {...progress,competencies:parseCompetencyLedger({...ledger,decisions:[...ledger.decisions,decision]})};
}
/** Latest snapshot for the active semantic revision, without double counting repeats. */
export function competencyLedgerEvidence(progress: Progress, skillId?: string): CourseTopicEvidence {
  const ledger = parseCompetencyLedger(progress.competencies);
  return ledgerEvidence(ledger, new Map(ledger.snapshots.map(s=>[s.id,s])), skillId);
}
function ledgerEvidence(ledger: CompetencyLedger, snapshots: Map<string, CompetencySnapshot>, skillId?: string): CourseTopicEvidence {
  const result: CourseTopicEvidence = Object.create(null);
  const latest = new Map<string,CompetencySnapshot>();
  for (const source of ledger.sources) {
    const s=source.snapshotId ? snapshots.get(source.snapshotId) : undefined;
    if(s && sourceKey(s)===sourceKey(source) && s.fingerprint===source.fingerprint && s.since===source.since)latest.set(sourceKey(s),s);
  }
  for (const s of latest.values()) {
    if(skillId !== undefined && s.skillId !== skillId)continue;
    const course = result[s.courseId] ??= Object.create(null);
    course[competencyEvidenceKey(s.bankId,s.questionId)] = {mastery:s.mastery,confidence:s.confidence,n:s.n};
  }
  return result;
}
export type DurableCompetencyState = CompetencyState & { assessedMastered: boolean; placement?: CompetencyDecision };
export function competencyLedgerStates(graph: Competency[], progress: Progress): DurableCompetencyState[] {
  const ledger = parseCompetencyLedger(progress.competencies);
  const snapshots = new Map(ledger.snapshots.map(s=>[s.id,s]));
  const retainedGraph = graph.map(skill=>({...skill,assessments:ledger.sources.filter(s=>s.skillId===skill.id).reduce<NonNullable<Competency['assessments']>>((all,s)=>{
    const found=all.find(a=>a.courseId===s.courseId&&a.bankId===s.bankId); if(found)found.questionIds.push(s.questionId);else all.push({courseId:s.courseId,bankId:s.bankId,questionIds:[s.questionId]});return all;
  },[])}));
  const states = retainedGraph.map(skill=>{
    const s=evaluateCompetencies([{...skill,prerequisites:[]}],ledgerEvidence(ledger,snapshots,skill.id))[0];
    return {...s,assessedMastered:s.mastered,placement:latestCompetencyDecision(ledger,s.id)};
  });
  const effectiveMastery = new Map(states.map(s=>[s.id,s.placement ? s.placement.action==='mastered' : s.mastered]));
  return states.map(s=>{
    const blockedBy = (graph.find(g=>g.id===s.id)?.prerequisites ?? []).filter(id=>!effectiveMastery.get(id));
    return {...s,mastered:effectiveMastery.get(s.id)!,blockedBy,ready:s.placement?.action==='ready' || s.placement?.action==='mastered' || blockedBy.length===0};
  });
}

/** Learner-controlled plaintext recovery is not an adult authentication channel. */
export function importCompetencyHistory(raw: unknown, existing: unknown): CompetencyLedger {
  const incoming=parseCompetencyLedger(raw), current=parseCompetencyLedger(existing);
  const decisions: CompetencyDecision[] = incoming.decisions.map(d=>({...d,imported:true}));
  for(const d of current.decisions){
    const index=decisions.findIndex(item=>item.id===d.id);
    if(index>=0){
      const {imported:_a,...left}=decisions[index], {imported:_b,...right}=d;
      if(JSON.stringify(left)!==JSON.stringify(right))throw Error('Imported competency decision conflicts with existing history.');
      decisions[index]=d;
    } else decisions.push(d);
  }
  return parseCompetencyLedger({...incoming,decisions});
}
