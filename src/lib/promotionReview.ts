import { courseFromCanonicalAuthoring, type PortableAuthoredCourse } from './canonicalAuthoring';
import { canonicalAssetSources, transformCanonicalAssets } from './canonicalAssets';
import type { PromotionCandidate } from './promotionCandidate';

/** These records retain human statements, not legal findings, publisher permissions or signatures. */
export const PROMOTION_LIMITS = { bytes: 36 * 1024 * 1024, reviewBytes: 200_000, evidence: 24, evidenceText: 6000, notes: 8000 } as const;
export const PROMOTION_CHECKLIST = ['contentAccuracy', 'accessibility', 'attribution', 'sourceRights', 'mediaRights', 'parityReviewed'] as const;
export interface PromotionChecklist { contentAccuracy: boolean; accessibility: boolean; attribution: boolean; sourceRights: boolean; mediaRights: boolean; parityReviewed: boolean }
export interface PromotionEvidence { id: string; kind: 'content' | 'rights' | 'media-rights'; reference: string; text: string }
export interface PromotionReviewInput {
  decision: 'approved-for-handoff' | 'rejected' | 'revoked';
  intendedOfficial: { courseId: string; revision: number };
  checklist: PromotionChecklist; evidence: PromotionEvidence[]; notes: string;
}
export interface PromotionReviewRecord extends PromotionReviewInput {
  format: 'erudior-promotion-review'; version: 1; id: string; revision: number;
  communityId: string; publishedVersion: number; sourceSha256: string; courseSha256: string; candidateSha256: string;
  reviewer: string; reviewedAt: string;
}
export interface PromotionHandoff {
  format: 'erudior-reviewed-promotion-handoff'; version: 1; status: 'reviewed-not-authorized';
  candidate: PromotionCandidate; review: PromotionReviewRecord; reviewSha256: string; handoffSha256: string;
}
export interface PromotionVerificationOptions {
  /** Trusted deployment configuration or an explicit operator option, never read from the document. */
  communityImageOrigin?: string;
  /** Independently retained export digest. Matching this is integrity, not authentication/authorization. */
  expectedHandoffSha256?: string;
}
const encoder = new TextEncoder();
const reserved = new Set(['__proto__', 'prototype', 'constructor']);
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v) && [Object.prototype, null].includes(Object.getPrototypeOf(v));
const id = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(v) && !reserved.has(v);
const positive = (v: unknown): v is number => Number.isSafeInteger(v) && Number(v) > 0;
const hash = (v: unknown): v is string => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const text = (v: unknown, max: number, empty = false): v is string => typeof v === 'string' && v.length <= max && (empty || !!v.trim()) && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v);
function fail(message: string): never { throw Error(message); }
function shape(value: unknown, keys: readonly string[], label: string): asserts value is Record<string, unknown> {
  if (!obj(value) || Object.keys(value).length !== keys.length || !keys.every(k => Object.prototype.hasOwnProperty.call(value, k))) fail(`Invalid ${label} fields.`);
}
/** Reject duplicate keys rather than accepting JSON.parse's last value. No URLs or references are fetched. */
function uniqueJsonKeys(source: string): void {
  let i = 0, nodes = 0;
  const ws = () => { while (/\s/.test(source[i] ?? '') && i < source.length) i++; };
  const stringEnd = () => { const start = i++; while (i < source.length) { if (source[i] === '\\') { i += 2; continue; } if (source[i++] === '"') return source.slice(start, i); } return fail('Unterminated JSON string.'); };
  const value = (depth: number): void => {
    if (depth > 40 || ++nodes > 500000) fail('Promotion structural limit exceeded.');
    ws(); const char = source[i];
    if (char === '{') {
      i++; ws(); const seen = new Set<string>(); if (source[i] === '}') { i++; return; }
      while (i < source.length) {
        ws(); if (source[i] !== '"') fail('Invalid JSON object key.');
        const key = JSON.parse(stringEnd()); if (seen.has(key) || reserved.has(key)) fail('Duplicate or reserved JSON key.'); seen.add(key);
        ws(); if (source[i++] !== ':') fail('Invalid JSON object.'); value(depth + 1); ws();
        if (source[i] === '}') { i++; return; } if (source[i++] !== ',') fail('Invalid JSON object.');
      }
      fail('Unterminated JSON object.');
    } else if (char === '[') {
      i++; ws(); if (source[i] === ']') { i++; return; }
      while (i < source.length) { value(depth + 1); ws(); if (source[i] === ']') { i++; return; } if (source[i++] !== ',') fail('Invalid JSON array.'); }
      fail('Unterminated JSON array.');
    } else if (char === '"') { stringEnd(); }
    else { const start = i; while (i < source.length && !/[\s,\]}]/.test(source[i])) i++; if (i === start) fail('Invalid JSON value.'); }
  };
  value(0); ws(); if (i !== source.length) fail('Unexpected JSON trailing content.');
}
/** Shared network/file boundary: bounded bytes, fatal UTF-8, duplicate-key and plain JSON checks. */
export function parsePromotionJson(input: unknown, maxBytes: number = PROMOTION_LIMITS.bytes): unknown {
  if (input instanceof Uint8Array) {
    if (input.byteLength > maxBytes) fail('Promotion byte limit exceeded.');
    input = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(input);
  }
  if (typeof input === 'string') {
    if (encoder.encode(input).length > maxBytes) fail('Promotion byte limit exceeded.');
    uniqueJsonKeys(input); input = JSON.parse(input);
  }
  let nodes = 0; const ancestors = new Set<object>();
  const plain = (v: unknown, depth: number): void => {
    if (++nodes > 500000 || depth > 40) fail('Promotion structural limit exceeded.');
    if (v === null || typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number' && Number.isFinite(v)) return;
    if (!v || typeof v !== 'object' || !Array.isArray(v) && !obj(v) || ancestors.has(v)) fail('Promotion must be plain acyclic JSON.');
    if (Object.getOwnPropertySymbols(v).length || Array.isArray(v) && (Object.keys(v).length !== v.length || !Object.keys(v).every((key, index) => key === String(index)))) fail('Promotion must be plain JSON.');
    ancestors.add(v);
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(v))) {
      if (Array.isArray(v) && key === 'length') continue;
      if (reserved.has(key) || !descriptor.enumerable || !('value' in descriptor)) fail('Promotion contains an unsafe JSON property.');
      plain(descriptor.value, depth + 1);
    }
    ancestors.delete(v);
  };
  plain(input, 0);
  if (encoder.encode(JSON.stringify(input)).length > maxBytes) fail('Promotion byte limit exceeded.');
  return structuredClone(input);
}
export async function promotionDigest(value: unknown): Promise<string> {
  const wrapped = parsePromotionJson({ value }) as { value: unknown };
  const bytes = encoder.encode(JSON.stringify(wrapped.value));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
}
const inputFields = ['decision', 'intendedOfficial', 'checklist', 'evidence', 'notes'];
function reviewInput(input: unknown): PromotionReviewInput {
  shape(input, inputFields, 'promotion review');
  if (!['approved-for-handoff', 'rejected', 'revoked'].includes(String(input.decision))) fail('Invalid promotion review decision.');
  shape(input.intendedOfficial, ['courseId', 'revision'], 'intended official identity');
  if (!id(input.intendedOfficial.courseId) || !positive(input.intendedOfficial.revision)) fail('Invalid intended official identity.');
  shape(input.checklist, PROMOTION_CHECKLIST, 'promotion checklist');
  if (!PROMOTION_CHECKLIST.every(k => typeof (input.checklist as Record<string, unknown>)[k] === 'boolean')) fail('Invalid promotion checklist values.');
  if (!Array.isArray(input.evidence) || input.evidence.length > PROMOTION_LIMITS.evidence) fail('Invalid promotion evidence count.');
  for (const item of input.evidence) {
    shape(item, ['id', 'kind', 'reference', 'text'], 'promotion evidence');
    if (!id(item.id) || !['content', 'rights', 'media-rights'].includes(String(item.kind)) || !text(item.reference, 2000) || !text(item.text, PROMOTION_LIMITS.evidenceText)) fail('Invalid retained promotion evidence.');
  }
  if (new Set(input.evidence.map(item => item.id)).size !== input.evidence.length) fail('Duplicate promotion evidence ID.');
  if (!text(input.notes, PROMOTION_LIMITS.notes, input.decision === 'approved-for-handoff')) fail('Review notes are required for rejection or revocation.');
  if (input.decision === 'approved-for-handoff') {
    if (!PROMOTION_CHECKLIST.every(k => (input.checklist as Record<string, unknown>)[k] === true)) fail('Every review checklist item must be attested before handoff.');
    for (const kind of ['content', 'rights']) if (!input.evidence.some(e => e.kind === kind)) fail(`Retained ${kind} evidence is required before handoff.`);
  }
  return input as unknown as PromotionReviewInput;
}
export function parsePromotionReviewInput(input: unknown): PromotionReviewInput { return reviewInput(parsePromotionJson(input, PROMOTION_LIMITS.reviewBytes)); }
export function parsePromotionReviewRecord(input: unknown): PromotionReviewRecord {
  const v = parsePromotionJson(input, PROMOTION_LIMITS.reviewBytes);
  shape(v, [...inputFields, 'format', 'version', 'id', 'revision', 'communityId', 'publishedVersion', 'sourceSha256', 'courseSha256', 'candidateSha256', 'reviewer', 'reviewedAt'], 'promotion review record');
  if (v.format !== 'erudior-promotion-review' || v.version !== 1 || !id(v.id) || !positive(v.revision) || !id(v.communityId) || !positive(v.publishedVersion)
    || !hash(v.sourceSha256) || !hash(v.courseSha256) || !hash(v.candidateSha256) || !text(v.reviewer, 300) || !text(v.reviewedAt, 24)
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v.reviewedAt) || !Number.isFinite(Date.parse(v.reviewedAt)) || new Date(v.reviewedAt).toISOString() !== v.reviewedAt) fail('Invalid promotion review record.');
  reviewInput(Object.fromEntries(inputFields.map(k => [k, v[k]])));
  return v as unknown as PromotionReviewRecord;
}
const requiredChecks = ['Official publisher authorization', 'Content and source-rights/licensing review', 'Revision continuity against authenticated prior release', 'Spreadsheet release approval when applicable', 'Production signature and release integrity validation'];
/** Verifies captured JSON bytes and every permitted image substitution, never a reviewer's authority. */
export async function verifyPromotionCandidate(input: unknown, options: PromotionVerificationOptions = {}): Promise<PromotionCandidate> {
  const v = parsePromotionJson(input); shape(v, ['source', 'course', 'provenance'], 'promotion candidate');
  const p = v.provenance;
  shape(p, ['format', 'version', 'status', 'communityId', 'publishedVersion', 'hashEncoding', 'sourceSha256', 'courseSha256', 'transformations', 'requiredChecks'], 'candidate provenance');
  if (p.format !== 'erudior-promotion-candidate' || p.version !== 1 || p.status !== 'unapproved-candidate' || p.hashEncoding !== 'sha256-utf8-json-stringify'
    || !id(p.communityId) || !positive(p.publishedVersion) || !hash(p.sourceSha256) || !hash(p.courseSha256)
    || JSON.stringify(p.requiredChecks) !== JSON.stringify(requiredChecks) || !Array.isArray(p.transformations) || p.transformations.length > 10000) fail('Invalid unapproved candidate provenance.');
  const source = courseFromCanonicalAuthoring(v.source, { mode: 'publication', communityImageOrigin: options.communityImageOrigin });
  const course = courseFromCanonicalAuthoring({ format: 'erudior-canonical-authoring', version: 1, course: v.course }, { mode: 'publication', maxBytes: 32 * 1024 * 1024 });
  if (await promotionDigest(v.source) !== p.sourceSha256 || await promotionDigest(v.course) !== p.courseSha256) fail('Promotion source or candidate digest mismatch.');
  const originalAssets = canonicalAssetSources(source), remoteAssets = originalAssets.filter(asset => !asset.startsWith('data:'));
  const embeddedByDigest = new Map<string, string>();
  for (const asset of canonicalAssetSources(course)) { if (!asset.startsWith('data:')) fail('Promotion candidate contains unresolved media.'); embeddedByDigest.set(await promotionDigest(asset), asset); }
  const substitutions = new Map<string, string>();
  for (const t of p.transformations) {
    shape(t, ['source', 'imageId', 'embeddedSha256'], 'candidate transformation');
    if (!text(t.source, 2000) || !id(t.imageId) || !hash(t.embeddedSha256) || substitutions.has(t.source) || !remoteAssets.includes(t.source)) fail('Invalid or duplicate candidate transformation.');
    if (!options.communityImageOrigin) fail('Trusted community image origin is required.');
    const origin = new URL(options.communityImageOrigin), url = new URL(t.source);
    if (origin.protocol !== 'https:' || url.origin !== origin.origin || url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== `/images/${t.imageId}`) fail('Untrusted candidate image origin or route.');
    const embedded = embeddedByDigest.get(t.embeddedSha256); if (!embedded) fail('Candidate transformation digest has no matching embedded image.');
    substitutions.set(t.source, embedded);
  }
  if (substitutions.size !== remoteAssets.length) fail('Missing candidate media transformation.');
  const expected = transformCanonicalAssets(source, asset => substitutions.get(asset) ?? asset);
  if (JSON.stringify(expected) !== JSON.stringify(v.course)) fail('Candidate parity failed: only recorded image embedding is permitted.');
  return v as unknown as PromotionCandidate;
}
/** Conservative media-evidence requirement covers images and recorded audio/video declarations. */
export function promotionRequiresMediaEvidence(course: PortableAuthoredCourse): boolean {
  return canonicalAssetSources(course).length > 0 || /data:audio\/|```(?:video|youtube)\b/i.test(JSON.stringify(course));
}
async function verifyReviewBinding(candidate: PromotionCandidate, review: PromotionReviewRecord): Promise<void> {
  const p = candidate.provenance;
  if (review.communityId !== p.communityId || review.publishedVersion !== p.publishedVersion || review.sourceSha256 !== p.sourceSha256 || review.courseSha256 !== p.courseSha256 || review.candidateSha256 !== await promotionDigest(candidate)) fail('Review is not bound to this exact community candidate.');
  if (review.intendedOfficial.courseId !== candidate.course.id || review.intendedOfficial.revision !== (candidate.course.revision ?? 1)) fail('Intended official identity/revision must match the unchanged reviewed candidate.');
  if (review.decision === 'approved-for-handoff' && promotionRequiresMediaEvidence(candidate.course) && !review.evidence.some(e => e.kind === 'media-rights')) fail('Retained media-rights evidence is required for this candidate.');
}
/** Call only after server authentication, current-source checks and CAS. Client input supplies no identity. */
export async function createPromotionReview(candidateInput: unknown, input: unknown, context: { id: string; revision: number; reviewer: string; reviewedAt: string }, options: PromotionVerificationOptions = {}): Promise<PromotionReviewRecord> {
  shape(context, ['id', 'revision', 'reviewer', 'reviewedAt'], 'server review context');
  const candidate = await verifyPromotionCandidate(candidateInput, options), fields = parsePromotionReviewInput(input), p = candidate.provenance;
  const review = parsePromotionReviewRecord({ ...fields, format: 'erudior-promotion-review', version: 1, ...context, communityId: p.communityId, publishedVersion: p.publishedVersion, sourceSha256: p.sourceSha256, courseSha256: p.courseSha256, candidateSha256: await promotionDigest(candidate) });
  await verifyReviewBinding(candidate, review); return review;
}
/** This portable record cannot be imported to grant admin status or official publication permission. */
export async function createPromotionHandoff(candidateInput: unknown, reviewInput: unknown, options: PromotionVerificationOptions = {}): Promise<PromotionHandoff> {
  const candidate = await verifyPromotionCandidate(candidateInput, options), review = parsePromotionReviewRecord(reviewInput);
  await verifyReviewBinding(candidate, review);
  if (review.decision !== 'approved-for-handoff') fail('Only an approved-for-handoff review can be exported.');
  const body = { format: 'erudior-reviewed-promotion-handoff' as const, version: 1 as const, status: 'reviewed-not-authorized' as const, candidate, review, reviewSha256: await promotionDigest(review) };
  return { ...body, handoffSha256: await promotionDigest(body) };
}
export async function verifyPromotionHandoff(input: unknown, options: PromotionVerificationOptions = {}): Promise<PromotionHandoff> {
  const v = parsePromotionJson(input); shape(v, ['format', 'version', 'status', 'candidate', 'review', 'reviewSha256', 'handoffSha256'], 'promotion handoff');
  if (v.format !== 'erudior-reviewed-promotion-handoff' || v.version !== 1 || v.status !== 'reviewed-not-authorized' || !hash(v.reviewSha256) || !hash(v.handoffSha256)) fail('Invalid non-authorizing promotion handoff.');
  const { handoffSha256: supplied, ...body } = v;
  if (await promotionDigest(body) !== supplied) fail('Promotion handoff digest mismatch.');
  if (options.expectedHandoffSha256 !== undefined && (!hash(options.expectedHandoffSha256) || options.expectedHandoffSha256 !== supplied)) fail('Handoff does not match the independently retained export digest.');
  const candidate = await verifyPromotionCandidate(v.candidate, options), review = parsePromotionReviewRecord(v.review);
  if (await promotionDigest(review) !== v.reviewSha256) fail('Promotion review digest mismatch.');
  await verifyReviewBinding(candidate, review);
  if (review.decision !== 'approved-for-handoff') fail('Promotion handoff is not approved for handoff.');
  return v as unknown as PromotionHandoff;
}
