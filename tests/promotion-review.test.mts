import assert from 'node:assert/strict';
import { sha256Hex } from '../src/lib/courseSign.ts';
import { preparePromotionCandidate } from '../src/lib/promotionCandidate.ts';
import { PROMOTION_LIMITS, createPromotionHandoff, createPromotionReview, parsePromotionJson, parsePromotionReviewInput, parsePromotionReviewRecord, promotionDigest, verifyPromotionCandidate, verifyPromotionHandoff } from '../src/lib/promotionReview.ts';
import { promotionFixture, promotionOrigin, promotionImage, promotionReviewInput } from './helpers/promotion-fixture.ts';
const options = { communityImageOrigin: promotionOrigin };
const { source, candidate, review, handoff } = await promotionFixture();
assert.deepEqual(await verifyPromotionCandidate(candidate, options), candidate);
assert.deepEqual(await verifyPromotionHandoff(new TextEncoder().encode(JSON.stringify(handoff, null, 2)), { ...options, expectedHandoffSha256: handoff.handoffSha256 }), handoff);
assert.deepEqual(candidate.source, source);
assert.equal(candidate.provenance.status, 'unapproved-candidate');
assert.equal(handoff.status, 'reviewed-not-authorized');
assert.deepEqual(await createPromotionHandoff(candidate, review, options), handoff, 'stable export, not a restamped approval');
assert.equal(await promotionDigest(promotionImage), await sha256Hex(new TextEncoder().encode(JSON.stringify(promotionImage))));
assert.equal(await promotionDigest({ text: 'é🧪' }), await sha256Hex(new TextEncoder().encode('{"text":"é🧪"}')));
for (const extra of [{ approved: true }, { official: true }, { publisher: 'admin' }]) {
  assert.throws(() => parsePromotionReviewInput({ ...promotionReviewInput, ...extra }), /fields/);
  await assert.rejects(verifyPromotionHandoff({ ...handoff, ...extra }, options), /fields/);
}
for (const invalid of [
  { ...promotionReviewInput, checklist: { ...promotionReviewInput.checklist, sourceRights: false } },
  { ...promotionReviewInput, checklist: { ...promotionReviewInput.checklist, publisherAuthority: true } },
  { ...promotionReviewInput, evidence: [] },
  { ...promotionReviewInput, evidence: [promotionReviewInput.evidence[0], promotionReviewInput.evidence[0]] },
  { ...promotionReviewInput, evidence: [{ ...promotionReviewInput.evidence[0], text: 'a'.repeat(PROMOTION_LIMITS.evidenceText + 1) }] },
  { ...promotionReviewInput, notes: 'a'.repeat(PROMOTION_LIMITS.notes + 1) },
  { ...promotionReviewInput, decision: 'published' },
  { ...promotionReviewInput, decision: 'rejected', notes: '' },
  { ...promotionReviewInput, decision: 'revoked', notes: '' },
  { ...promotionReviewInput, intendedOfficial: { courseId: '__proto__', revision: 1 } },
]) assert.throws(() => parsePromotionReviewInput(invalid));
for (const invalid of [{ ...review, reviewedAt: '2026-02-30T00:00:00.000Z' }, { ...review, revision: 0 }, { ...review, reviewer: '' }, { ...review, format: 'approval' }]) assert.throws(() => parsePromotionReviewRecord(invalid));
await assert.rejects(createPromotionReview(candidate, { ...promotionReviewInput, intendedOfficial: { courseId: 'silently-renamed', revision: 1 } }, { id: review.id, revision: 2, reviewer: review.reviewer, reviewedAt: review.reviewedAt }, options), /unchanged/);
await assert.rejects(createPromotionReview(candidate, { ...promotionReviewInput, evidence: promotionReviewInput.evidence.filter(e => e.kind !== 'media-rights') }, { id: review.id, revision: 2, reviewer: review.reviewer, reviewedAt: review.reviewedAt }, options), /media-rights/);
for (const decision of ['rejected', 'revoked'] as const) {
  const record = await createPromotionReview(candidate, { ...promotionReviewInput, decision, notes: 'Do not proceed.' }, { id: review.id, revision: 2, reviewer: review.reviewer, reviewedAt: review.reviewedAt }, options);
  await assert.rejects(createPromotionHandoff(candidate, record, options), /Only an approved/);
}
const context = { id: review.id, revision: 2, reviewer: review.reviewer, reviewedAt: review.reviewedAt };
await assert.rejects(createPromotionReview(candidate, { ...promotionReviewInput, intendedOfficial: { courseId: candidate.course.id, revision: 2 } }, context, options), /unchanged/);
const changed = structuredClone(candidate); changed.course.title = 'Changed';
await assert.rejects(verifyPromotionCandidate(changed, options), /digest/);
changed.provenance.courseSha256 = await promotionDigest(changed.course);
await assert.rejects(verifyPromotionCandidate(changed, options), /parity/);
const swapped = structuredClone(candidate); swapped.source.course.lessons[0].body = 'Substituted source'; swapped.provenance.sourceSha256 = await promotionDigest(swapped.source);
await assert.rejects(verifyPromotionCandidate(swapped, options), /transformation|parity/);
for (const mutate of [
  (c: typeof candidate) => { c.provenance.transformations = []; },
  (c: typeof candidate) => { c.provenance.transformations.push(c.provenance.transformations[0]); },
  (c: typeof candidate) => { c.provenance.transformations[0].embeddedSha256 = '0'.repeat(64); },
  (c: typeof candidate) => { c.provenance.transformations[0].imageId = 'different-image'; },
  (c: typeof candidate) => { c.provenance.requiredChecks = []; },
]) { const c = structuredClone(candidate); mutate(c); await assert.rejects(verifyPromotionCandidate(c, options)); }
await assert.rejects(verifyPromotionCandidate(candidate), /asset|origin|image/i);
await assert.rejects(verifyPromotionCandidate(candidate, { communityImageOrigin: 'https://attacker.example.test' }));
const replacement = await preparePromotionCandidate({ payload: { ...source, course: { ...source.course, title: 'Different valid canonical source' } }, communityId: 'community-fixture', publishedVersion: 7, communityImageOrigin: promotionOrigin }, async () => promotionImage);
await assert.rejects(createPromotionHandoff(replacement, review, options), /exact community/);
const changedRecord = structuredClone(handoff); changedRecord.review.notes = 'Altered';
await assert.rejects(verifyPromotionHandoff(changedRecord, options), /digest/);
const rewritten = await createPromotionHandoff(candidate, { ...review, notes: 'Recomputed unsigned evidence' }, options);
await assert.rejects(verifyPromotionHandoff(rewritten, { ...options, expectedHandoffSha256: handoff.handoffSha256 }), /independently retained/);
assert.equal((await verifyPromotionHandoff(rewritten, options)).status, 'reviewed-not-authorized', 'self-consistent unsigned data never establishes authority');
for (const json of ['{"a":1,"a":2}', '{"a":1,"\\u0061":2}', '{"__proto__":{}}', '{"ok":1} trailing', '[1,,2]', '{"x":NaN}']) assert.throws(() => parsePromotionJson(json));
assert.throws(() => parsePromotionJson(new Uint8Array([0xc3, 0x28])), /encoded|encoding/i);
assert.throws(() => parsePromotionJson(new TextEncoder().encode('"éé"'), 5), /byte limit/);
assert.throws(() => parsePromotionJson({ a: undefined }), /plain/);
assert.throws(() => parsePromotionJson({ a: Number.NaN }), /plain/);
let called = false; const getter = { get unsafe() { called = true; return 'no'; } };
assert.throws(() => parsePromotionJson(getter), /unsafe/); await assert.rejects(promotionDigest(getter), /unsafe/); assert.equal(called, false);
const decorated: any[] = new Array(1); (decorated as any).other = 1; assert.throws(() => parsePromotionJson(decorated), /plain JSON/);
const cyclic: any = {}; cyclic.self = cyclic; assert.throws(() => parsePromotionJson(cyclic), /acyclic/);
assert.throws(() => parsePromotionJson(JSON.parse('{"nested":{"constructor":"no"}}')), /unsafe/);
let deep: unknown = null; for (let i = 0; i < 50; i++) deep = [deep]; assert.throws(() => parsePromotionJson(deep), /structural/);
const noMedia = await promotionFixture({ images: false });
assert.deepEqual(await verifyPromotionHandoff(noMedia.handoff), noMedia.handoff);
const audioSource = structuredClone(noMedia.source); audioSource.course.audio = { sound: 'data:audio/mpeg;base64,AA==' };
const audioCandidate = await preparePromotionCandidate({ payload: audioSource, communityId: 'community-fixture', publishedVersion: 7 });
await assert.rejects(createPromotionReview(audioCandidate, { ...promotionReviewInput, evidence: promotionReviewInput.evidence.filter(e => e.kind !== 'media-rights') }, context), /media-rights/);
console.log('Promotion protocol: exact source/media parity, immutable review binding, retained evidence, no authority grants, digest substitution and strict bounded UTF-8 rejection passed.');
