/** Read-only publisher preflight. No catalog edits, approvals, signing keys, remote fetches or publishing. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { COURSE_PUBLIC_KEYS } from '../src/lib/courseKeys';
import { sha256Hex, verifySignature } from '../src/lib/courseSign';
import { importValidatedCourseSnapshot } from '../src/lib/courseIntegrity';
import { compareCourseRevisions } from '../src/lib/courseRevision';
import { courseFromCanonicalAuthoring } from '../src/lib/canonicalAuthoring';
import { validateSpreadsheetReleaseApproval } from '../src/lib/spreadsheetReleaseApproval';
import { PROMOTION_LIMITS, parsePromotionJson, promotionDigest, verifyPromotionHandoff } from '../src/lib/promotionReview';

const flags = ['--handoff', '--expected-handoff-sha256', '--course', '--publisher-review', '--previous-dir', '--community-origin', '--spreadsheet-approval'] as const;
type Flag = typeof flags[number];
function args(values: string[]): Map<Flag, string> {
  const result = new Map<Flag, string>();
  for (let i = 0; i < values.length; i += 2) {
    const key = values[i] as Flag, value = values[i + 1];
    if (!flags.includes(key) || result.has(key) || !value || value.startsWith('--')) throw Error('Unknown, duplicate or missing option. Required: --handoff FILE --expected-handoff-sha256 HEX --course FILE --publisher-review FILE --previous-dir DIR. Optional: --community-origin HTTPS_ORIGIN --spreadsheet-approval FILE.');
    result.set(key, value);
  }
  for (const key of flags.slice(0, 5)) if (!result.has(key)) throw Error(`Required publisher verification option: ${key}`);
  return result;
}
function bytes(file: string, maximum: number = PROMOTION_LIMITS.bytes): Buffer {
  const fd = fs.openSync(file, 'r');
  try {
    const stat = fs.fstatSync(fd); if (!stat.isFile() || stat.size > maximum) throw Error('Input must be a bounded regular file.');
    const result = fs.readFileSync(fd); if (result.length > maximum) throw Error('Input byte limit exceeded.'); return result;
  } finally { fs.closeSync(fd); }
}
const utf8 = (value: Uint8Array) => new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(value);
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const hash = (v: unknown): v is string => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const id = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const requiredText = (v: unknown): v is string => typeof v === 'string' && !!v.trim() && v.length <= 8000 && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v);
function fields(v: unknown, allowed: string[], required = allowed): asserts v is Record<string, unknown> {
  if (!obj(v) || Object.keys(v).some(k => !allowed.includes(k)) || required.some(k => !Object.prototype.hasOwnProperty.call(v, k))) throw Error('Invalid or unknown publisher verification fields.');
}
/** Every true field is a recorded human statement, never a programmatic proof of legal authority. */
export interface PromotionPublisherReview {
  format: 'erudior-independent-publisher-review'; version: 1; handoffSha256: string; courseId: string; revision: number;
  publisher: string; reviewedAt: string; authorizedPublisher: true; independentlyReviewedContent: true;
  independentlyReviewedRights: true; verifiedSourceEvidence: true;
  authorizationReference: string; contentEvidence: string; rightsEvidence: string; sourceEvidence: string;
}
function publisherReview(input: unknown): PromotionPublisherReview {
  const v = parsePromotionJson(input, PROMOTION_LIMITS.reviewBytes);
  fields(v, ['format', 'version', 'handoffSha256', 'courseId', 'revision', 'publisher', 'reviewedAt', 'authorizedPublisher', 'independentlyReviewedContent', 'independentlyReviewedRights', 'verifiedSourceEvidence', 'authorizationReference', 'contentEvidence', 'rightsEvidence', 'sourceEvidence']);
  if (v.format !== 'erudior-independent-publisher-review' || v.version !== 1 || !hash(v.handoffSha256) || !id(v.courseId) || !Number.isSafeInteger(v.revision) || Number(v.revision) < 1
    || !requiredText(v.publisher) || (v.publisher as string).length > 300 || typeof v.reviewedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v.reviewedAt)
    || !Number.isFinite(Date.parse(v.reviewedAt)) || new Date(v.reviewedAt).toISOString() !== v.reviewedAt
    || ['authorizedPublisher', 'independentlyReviewedContent', 'independentlyReviewedRights', 'verifiedSourceEvidence'].some(k => v[k] !== true)
    || ['authorizationReference', 'contentEvidence', 'rightsEvidence', 'sourceEvidence'].some(k => !requiredText(v[k]))) throw Error('Independent authorized publisher review and retained evidence are required.');
  return v as unknown as PromotionPublisherReview;
}
interface PriorEntry { id: string; revision: number; file: string; sha256: string; bytes?: number }
function priorCatalog(input: unknown): { courses: PriorEntry[] } {
  const v = parsePromotionJson(input, 8 * 1024 * 1024);
  fields(v, ['format', 'version', 'courses', 'published', 'states'], ['format', 'version', 'courses']);
  if (v.format !== 'examiner-catalog' || v.version !== 1 || !Array.isArray(v.courses) || v.courses.length > 10000) throw Error('Invalid signed previous catalog schema.');
  const ids = new Set<string>(), files = new Set<string>();
  for (const entry of v.courses) {
    fields(entry, ['id', 'revision', 'file', 'sha256', 'bytes', 'order', 'title', 'description', 'disclaimer', 'subject', 'level', 'type', 'lessons', 'honors', 'questions', 'cards', 'drills', 'lessonIds', 'honorsLessonIds', 'honorsModuleIds', 'requires', 'carried', 'outline', 'words'], ['id', 'revision', 'file', 'sha256']);
    if (!id(entry.id) || !Number.isSafeInteger(entry.revision) || Number(entry.revision) < 1 || entry.file !== `${entry.id}.r${entry.revision}.json` || !hash(entry.sha256)
      || entry.bytes !== undefined && (!Number.isSafeInteger(entry.bytes) || Number(entry.bytes) < 1 || Number(entry.bytes) > PROMOTION_LIMITS.bytes)
      || ids.has(entry.id) || files.has(String(entry.file))) throw Error('Malformed, duplicate or unsafe previous catalog entry.');
    ids.add(entry.id); files.add(String(entry.file));
  }
  return v as unknown as { courses: PriorEntry[] };
}
export async function verifyPublisherHandoff(argv: string[]) {
  const options = args(argv), expected = options.get('--expected-handoff-sha256')!;
  if (!hash(expected)) throw Error('Expected handoff SHA-256 must be 64 lowercase hexadecimal characters.');
  const origin = options.get('--community-origin');
  if (origin) { const u = new URL(origin); if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash || !['', '/'].includes(u.pathname)) throw Error('Community origin must be an explicit HTTPS origin.'); }
  const handoff = await verifyPromotionHandoff(bytes(options.get('--handoff')!), { communityImageOrigin: origin, expectedHandoffSha256: expected });
  const independent = publisherReview(bytes(options.get('--publisher-review')!, PROMOTION_LIMITS.reviewBytes));
  if (independent.handoffSha256 !== handoff.handoffSha256 || independent.courseId !== handoff.review.intendedOfficial.courseId || independent.revision !== handoff.review.intendedOfficial.revision) throw Error('Publisher review does not match this exact handoff and intended identity/revision.');
  if (independent.publisher.trim().toLocaleLowerCase('en-US') === handoff.review.reviewer.trim().toLocaleLowerCase('en-US')) throw Error('Publisher review must record an independent reviewer, not the community admin reviewer.');
  if (Date.parse(independent.reviewedAt) < Date.parse(handoff.review.reviewedAt)) throw Error('Publisher review predates the retained admin review.');
  const courseBytes = bytes(options.get('--course')!, 32 * 1024 * 1024), raw = parsePromotionJson(courseBytes);
  courseFromCanonicalAuthoring({ format: 'erudior-canonical-authoring', version: 1, course: raw }, { mode: 'publication', maxBytes: 32 * 1024 * 1024 });
  if (JSON.stringify(raw) !== JSON.stringify(handoff.candidate.course)) throw Error('Repository candidate differs from the exact reviewed candidate; no identity or content rewriting is allowed.');
  const course = importValidatedCourseSnapshot(utf8(courseBytes));
  const previousDir = path.resolve(options.get('--previous-dir')!), catalogBytes = bytes(path.join(previousDir, 'catalog.json'), 8 * 1024 * 1024);
  const signature = utf8(bytes(path.join(previousDir, 'catalog.json.sig'), 512)).trim();
  if (!COURSE_PUBLIC_KEYS.length || !verifySignature(catalogBytes, signature, COURSE_PUBLIC_KEYS)) throw Error('Signed previous catalog failed verification with application-pinned keys.');
  const previous = priorCatalog(catalogBytes), prior = previous.courses.find(c => c.id === course.id);
  let revisionContinuity: 'new-course-r1' | 'unchanged-identical' | 'compatible-update' = 'new-course-r1';
  let previousCourseSha256: string | null = null;
  if (prior) {
    const previousBytes = bytes(path.join(previousDir, prior.file));
    previousCourseSha256 = await sha256Hex(previousBytes);
    if (previousCourseSha256 !== prior.sha256 || prior.bytes !== undefined && previousBytes.length !== prior.bytes) throw Error('Signed prior course artifact digest or byte-count mismatch.');
    const previousCourse = importValidatedCourseSnapshot(utf8(previousBytes));
    if (previousCourse.id !== prior.id || (previousCourse.revision ?? 1) !== prior.revision) throw Error('Previous course identity/revision does not match its signed catalog.');
    if ((course.revision ?? 1) === prior.revision) {
      if (!courseBytes.equals(previousBytes)) throw Error('Official revision collision: changed immutable course bytes without a new revision.');
      revisionContinuity = 'unchanged-identical';
    } else {
      const problems = compareCourseRevisions(previousCourse, course);
      if (problems.length) throw Error('Official revision compatibility blocked: ' + problems.map(p => `${p.path}: ${p.message}`).join('; '));
      revisionContinuity = 'compatible-update';
    }
  } else if ((course.revision ?? 1) !== 1) throw Error('A new official identity must begin at revision 1; create and review a new source rather than rewriting this handoff.');
  const approvalFile = options.get('--spreadsheet-approval');
  const approval = approvalFile ? parsePromotionJson(bytes(approvalFile, PROMOTION_LIMITS.reviewBytes), PROMOTION_LIMITS.reviewBytes) : undefined;
  if (approval !== undefined) fields(approval, ['courseId', 'revision', 'snapshotSha256', 'reviewer', 'reviewedAt']);
  const spreadsheetProblems = await validateSpreadsheetReleaseApproval(course, approval);
  if (spreadsheetProblems.length) throw Error('Spreadsheet publication blocked: ' + spreadsheetProblems.join('; '));
  return {
    format: 'erudior-promotion-verification-report', version: 1, status: 'preflight-passed-not-published',
    communityId: handoff.review.communityId, publishedVersion: handoff.review.publishedVersion,
    courseId: course.id, revision: course.revision ?? 1, handoffSha256: handoff.handoffSha256,
    sourceSha256: handoff.review.sourceSha256, candidateSha256: handoff.review.candidateSha256,
    repositoryFileSha256: await sha256Hex(courseBytes), publisherReviewSha256: await promotionDigest(independent),
    previousCatalogSha256: await sha256Hex(catalogBytes), previousCourseSha256,
    verified: { capturedSourceCandidateParity: true, separatelyRetainedExportDigest: true, exactRepositoryCandidate: true, signedPreviousCatalog: true, revisionContinuity, spreadsheetApprovalBinding: course.spreadsheetAssignments?.length ? 'verified-record-binding' : 'not-applicable' },
    recordedHumanAttestations: { adminReviewer: handoff.review.reviewer, independentPublisher: independent.publisher, contentReview: true, rightsReview: true, sourceEvidenceReview: true, publisherAuthorization: true },
    notEstablished: ['Legal rights and licensing truth', 'Actual identities or authority of reviewers in an unsigned portable record', 'Current server review/revocation state or source availability', 'Freshness of the previous release versus the deployed catalog', 'Production signing, deployment, or official publication'],
    nextStep: 'An independently authorized publisher must recheck current review/source status and baseline freshness, retain this evidence, and use the unchanged scripts/publish-courses.ts production release path with all repository and deployment checks. No catalog, course, key or approval was changed.',
  };
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try { console.log(JSON.stringify(await verifyPublisherHandoff(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(JSON.stringify({ status: 'blocked', error: error instanceof Error ? error.message : 'Publisher verification failed.' })); process.exitCode = 1; }
}
