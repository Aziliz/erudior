/** Local planning records, not an issuing authority or a legal graduation determination. */
export const ACADEMIC_NOTICE = "A family planning record, not an accredited transcript, verified transfer credit, credential or determination of legal graduation eligibility. Imported statements are unverified.";
export const MAX_ACADEMIC_BYTES = 2 * 1024 * 1024;
export interface CreditRequirement { id: string; subject: string; credits: number; requireEvidence: boolean }
export interface GraduationPolicy { name: string; totalCredits: number; requirements: CreditRequirement[] }
export interface CreditClaim {
  id: string; title: string; subject: string; date: string; credits: number;
  evidence: string; note: string; sourceKey: string;
  origin: "local" | "imported"; reviewed: boolean; provenance: string; updatedAt: string;
}
export interface AcademicRecords {
  version: 1; policy: GraduationPolicy; claims: CreditClaim[];
  imports: { fingerprint: string; importedAt: string; label: string; summary?: string }[];
  retention: { before: string | null };
}
export interface AcademicCandidate {
  key: string; claimId?: string; title: string; subject: string; date?: string; credits: number; eligible: boolean; evidence: string; provenance: string;
}
export const emptyAcademicRecords = (): AcademicRecords => ({ version: 1, policy: { name: "My graduation plan", totalCredits: 0, requirements: [] }, claims: [], imports: [], retention: { before: null } });
const object = (v: unknown): Record<string, unknown> => {
  if (!v || typeof v !== "object" || Array.isArray(v) || ![Object.prototype, null].includes(Object.getPrototypeOf(v))) throw Error("Expected an academic record object.");
  const o = v as Record<string, unknown>;
  if (Object.keys(o).some(k => ["__proto__", "constructor", "prototype"].includes(k))) throw Error("Unsafe record field.");
  return o;
};
const str = (v: unknown, max = 1000, required = false): string => {
  if (typeof v !== "string" || v.length > max || (required && !v.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)) throw Error("Invalid or oversized academic text.");
  return v;
};
const number = (v: unknown, max = 1000): number => { if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > max) throw Error("Credits must be finite and nonnegative."); return v; };
const bool = (v: unknown): boolean => { if (typeof v !== "boolean") throw Error("Invalid academic choice."); return v; };
const list = (v: unknown, max: number): unknown[] => { if (!Array.isArray(v) || v.length > max) throw Error("Too many academic entries."); return v; };
const date = (v: unknown): string => {
  const s = str(v, 10, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !Number.isFinite(Date.parse(s)) || new Date(s).toISOString().slice(0, 10) !== s) throw Error("Use a real YYYY-MM-DD date.");
  return s;
};
const timestamp = (v: unknown): string => { const s = str(v, 40, true); if (!/^\d{4}-\d{2}-\d{2}T/.test(s) || !Number.isFinite(Date.parse(s))) throw Error("Invalid record timestamp."); return s; };
const unique = (values: string[]) => { if (new Set(values).size !== values.length) throw Error("Duplicate academic entry."); };
const normalized = (s: string) => s.trim().toLocaleLowerCase("en-US");
function claim(v: unknown): CreditClaim {
  const o = object(v);
  if (o.origin !== "local" && o.origin !== "imported") throw Error("Invalid claim origin.");
  return { id: str(o.id, 160, true), title: str(o.title, 300, true), subject: str(o.subject, 100, true), date: date(o.date), credits: number(o.credits, 100), evidence: str(o.evidence, 2000), note: str(o.note, 4000), sourceKey: str(o.sourceKey, 300).trim(), origin: o.origin, reviewed: bool(o.reviewed), provenance: str(o.provenance, 1000, true), updatedAt: timestamp(o.updatedAt) };
}
export function parseGraduationPolicy(v: unknown): GraduationPolicy {
  const o = object(v);
  const requirements = list(o.requirements, 100).map(v => { const r = object(v); return { id: str(r.id, 160, true), subject: str(r.subject, 100, true), credits: number(r.credits, 100), requireEvidence: bool(r.requireEvidence) }; });
  unique(requirements.map(r => r.id)); unique(requirements.map(r => normalized(r.subject)));
  return { name: str(o.name, 200, true), totalCredits: number(o.totalCredits), requirements };
}
export function parseAcademicRecords(v: unknown): AcademicRecords {
  if (v === undefined) return emptyAcademicRecords();
  if (JSON.stringify(v).length > MAX_ACADEMIC_BYTES) throw Error("Academic records exceed the size limit.");
  const o = object(v); if (o.version !== 1) throw Error("Unsupported academic records version.");
  const claims = list(o.claims, 2000).map(claim); unique(claims.map(c => c.id)); unique(claims.map(c => c.sourceKey).filter(Boolean)); unique(claims.map(c => `${normalized(c.title)}|${normalized(c.subject)}|${c.date}`));
  const imports = list(o.imports, 2000).map(v => { const i = object(v); const fingerprint = str(i.fingerprint, 64, true); if (!/^[a-f0-9]{64}$/.test(fingerprint)) throw Error("Invalid import fingerprint."); return { fingerprint, importedAt: timestamp(i.importedAt), label: str(i.label, 300, true), ...(i.summary === undefined ? {} : { summary: str(i.summary, 200000) }) }; });
  unique(imports.map(i => i.fingerprint)); const retention = object(o.retention);
  return { version: 1, policy: parseGraduationPolicy(o.policy), claims, imports, retention: { before: retention.before === null ? null : date(retention.before) } };
}
const entryIdentity = (c: Pick<CreditClaim, "title" | "subject" | "date">) => `${normalized(c.title)}|${normalized(c.subject)}|${c.date}`;
const identity = (c: Pick<CreditClaim, "title" | "subject" | "date" | "sourceKey">) => c.sourceKey.trim() ? `source:${c.sourceKey.trim()}` : `entry:${normalized(c.title)}|${normalized(c.subject)}|${c.date}`;
/** Corrections preserve imported provenance. A parent's review is not institutional verification. */
export function saveCreditClaim(state: AcademicRecords, value: CreditClaim): AcademicRecords {
  const current = parseAcademicRecords(state), next = claim(value), old = current.claims.find(c => c.id === next.id);
  if (old) { next.origin = old.origin; next.provenance = old.provenance; }
  if (current.claims.some(c => c.id !== next.id && (identity(c) === identity(next) || entryIdentity(c) === entryIdentity(next)))) throw Error("This credit source is already recorded. Correct the existing entry instead.");
  return parseAcademicRecords({ ...current, claims: old ? current.claims.map(c => c.id === next.id ? next : c) : [...current.claims, next] });
}
export function removeCreditClaim(state: AcademicRecords, id: string): AcademicRecords { return parseAcademicRecords({ ...state, claims: state.claims.filter(c => c.id !== id) }); }
export interface AcademicAudit {
  totalCredits: number; requiredCredits: number; totalRemaining: number; planningRequirementsMet: boolean;
  requirements: (CreditRequirement & { counted: number; remaining: number })[];
  entries: (AcademicCandidate & { counted: boolean; reason: string })[];
  notice: string;
}
/** Each source counts at most once. Explicit local corrections replace the linked candidate, not add to it. */
export function auditAcademicRecords(state: AcademicRecords, existing: AcademicCandidate[] = []): AcademicAudit {
  const s = parseAcademicRecords(state), linked = new Set(s.claims.filter(c => c.origin !== "imported" || c.reviewed).map(c => c.sourceKey).filter(Boolean));
  const candidates = [...existing.filter(c => !linked.has(c.key)), ...s.claims.map(c => ({ key: c.sourceKey || `claim:${c.id}`, claimId: c.id, date: c.date, title: c.title, subject: c.subject, credits: c.credits, eligible: c.reviewed, evidence: c.evidence, provenance: c.provenance }))];
  const seen = new Set<string>();
  const entries = candidates.map(c => {
    const duplicate = seen.has(c.key); seen.add(c.key);
    const requirement = s.policy.requirements.find(r => normalized(r.subject) === normalized(c.subject));
    const reason = duplicate ? "Duplicate source" : !c.eligible ? "Needs parent review or course completion" : !Number.isFinite(c.credits) || c.credits < 0 ? "Invalid credits" : requirement?.requireEvidence && !c.evidence.trim() ? "Evidence reference required" : "Counted for this local plan only";
    return { ...c, counted: reason === "Counted for this local plan only", reason };
  });
  const totalCredits = entries.filter(c => c.counted).reduce((n,c) => n+c.credits,0);
  const requirements = s.policy.requirements.map(r => { const counted = entries.filter(c => c.counted && normalized(c.subject) === normalized(r.subject)).reduce((n,c) => n+c.credits,0); return { ...r, counted, remaining: Math.max(0,r.credits-counted) }; });
  const totalRemaining = Math.max(0,s.policy.totalCredits-totalCredits);
  return { totalCredits, requiredCredits: s.policy.totalCredits, totalRemaining, planningRequirementsMet: totalRemaining === 0 && requirements.every(r => r.remaining === 0), requirements, entries, notice: ACADEMIC_NOTICE };
}
export interface AcademicImportPreview { fingerprint: string; exportedAt: string; label: string; policy: GraduationPolicy; claims: CreditClaim[]; summary: string; archives: { label: string; importedAt: string; summary: string }[]; notice: string }
/** Portable planning claims intentionally exclude learner identifiers, authority, progress and attachment paths. */
export function exportAcademicRecords(state: AcademicRecords, now: string, label = "Local academic planning records", existingCandidates: AcademicCandidate[] = [], historicalSummary = ""): string {
  const s = parseAcademicRecords(state), linked = new Set(s.claims.map(c => c.sourceKey));
  const claims = [...s.claims, ...existingCandidates.filter(c => !linked.has(c.key)).map((c,i): CreditClaim => ({ id: `export-candidate-${i}`, title: c.title, subject: c.subject, date: c.date ?? now.slice(0,10), credits: c.credits, evidence: c.evidence, note: c.eligible ? "Existing local report entry; not independently verified." : "Existing incomplete or unreviewed local report entry.", sourceKey: c.key, origin: "local", reviewed: false, provenance: c.provenance, updatedAt: now }))];
  list(claims,2000).forEach(claim); unique(claims.map(c => c.id));
  const text = JSON.stringify({ format: "erudior-academic-planning", version: 1, exportedAt: timestamp(now), label: str(label, 300, true), policy: s.policy, claims, summary: str(historicalSummary, 200000), archives: s.imports.filter(i => i.summary).map(i => ({ label: i.label, importedAt: i.importedAt, summary: i.summary! })), notice: ACADEMIC_NOTICE }, null, 2);
  if (new TextEncoder().encode(text).length > MAX_ACADEMIC_BYTES) throw Error("Academic export exceeds 2 MiB. Export fewer planning claims.");
  return text;
}
export async function previewAcademicImport(text: string): Promise<AcademicImportPreview> {
  if (new TextEncoder().encode(text).length > MAX_ACADEMIC_BYTES) throw Error("Academic import exceeds 2 MiB.");
  const o = object(JSON.parse(text));
  if (o.format !== "erudior-academic-planning" || o.version !== 1) throw Error("Choose an Erudior academic planning export.");
  const policy = parseGraduationPolicy(o.policy), claims = list(o.claims, 2000).map(claim); unique(claims.map(c => c.id));
  // Fingerprint content, not whitespace/export time, so exporting the same claims twice cannot double count them.
  const summary = o.summary === undefined ? "" : str(o.summary,200000);
  const archives = list(o.archives ?? [],2000).map(value => { const a = object(value); return { label: str(a.label,300,true), importedAt: timestamp(a.importedAt), summary: str(a.summary,200000) }; });
  if (summary.length + archives.reduce((n,a) => n+a.summary.length+a.label.length+100,0) > 200000) throw Error("Combined historical summary exceeds the archive limit.");
  const canonical = JSON.stringify({ policy, claims, summary, archives });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  const fingerprint = [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2,"0")).join("");
  return { fingerprint, exportedAt: timestamp(o.exportedAt), label: str(o.label,300,true), policy, claims, summary, archives, notice: ACADEMIC_NOTICE };
}
/** Import appends unreviewed claims; it never replaces the target policy or existing academic history. */
export function applyAcademicImport(state: AcademicRecords, preview: AcademicImportPreview, now: string, idFactory: () => string, existingCandidates: AcademicCandidate[] = []): AcademicRecords {
  const s = parseAcademicRecords(state); timestamp(now);
  if (s.imports.some(i => i.fingerprint === preview.fingerprint)) throw Error("This academic export has already been imported.");
  const known = new Set(s.claims.map(identity)), knownEntries = new Set(s.claims.map(entryIdentity));
  const existingKeys = new Set(existingCandidates.map(c => c.key));
  if (preview.claims.some(c => c.sourceKey && existingKeys.has(c.sourceKey))) throw Error("An imported source already exists in this learner’s course records. Review or correct that existing source instead; nothing was imported.");
  const added = preview.claims.map(c => {
    if (known.has(identity(c)) || knownEntries.has(entryIdentity(c))) throw Error("An imported credit source is already recorded. Correct the existing entry instead.");
    known.add(identity(c)); knownEntries.add(entryIdentity(c));
    return { ...c, id: idFactory(), origin: "imported" as const, reviewed: false, provenance: `Unverified import: ${preview.label}. Original statement: ${c.provenance}`.slice(0,1000), updatedAt: now };
  });
  return parseAcademicRecords({ ...s, claims: [...s.claims,...added], imports: [...s.imports,{ fingerprint: preview.fingerprint, importedAt: now, label: preview.label, summary: [preview.summary, ...preview.archives.map(a => `Prior unverified archive: ${a.label} (imported ${a.importedAt})\n${a.summary}`)].filter(Boolean).join("\n\n") }] });
}
export interface AcademicRetentionPreview { before: string; ids: string[]; snapshot: string; notice: string }
export function previewAcademicRetention(state: AcademicRecords, before: string): AcademicRetentionPreview {
  const s = parseAcademicRecords(state); date(before);
  return { before, ids: s.claims.filter(c => c.date < before).map(c => c.id), snapshot: JSON.stringify(s), notice: "Remove only the listed local planning claims. Existing transcripts, attendance, documents and audit/import history stay. Downloaded exports, backups and other devices are not removed." };
}
export function applyAcademicRetention(state: AcademicRecords, preview: AcademicRetentionPreview): AcademicRecords {
  const s = parseAcademicRecords(state);
  if (JSON.stringify(s) !== preview.snapshot) throw Error("Academic records changed. Preview cleanup again.");
  const expected = previewAcademicRetention(s,preview.before);
  if (JSON.stringify(expected.ids) !== JSON.stringify(preview.ids)) throw Error("Cleanup selection changed. Preview again.");
  return parseAcademicRecords({ ...s, claims: s.claims.filter(c => !preview.ids.includes(c.id)), retention: { before: preview.before } });
}

/** Backup is a transport, not authority: preserve statements but require a fresh local review. */
export function restoreAcademicRecords(value: unknown): AcademicRecords {
  const s = parseAcademicRecords(value);
  return { ...s, claims: s.claims.map(c => ({ ...c, origin: "imported", reviewed: false, provenance: `Unverified backup restore. Original statement: ${c.provenance}`.slice(0,1000) })) };
}
