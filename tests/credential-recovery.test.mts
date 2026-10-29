/** Isolated synthetic recovery: no registry, persistent key, or real qualification. */
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
import { credentialFixture } from './fixtures/credentialIntegrity';
import { credentialBase64, credentialHash, parseCredentialTrust, signCredentialEnvelope, verifyCredentialChain, verifyCredentialEnvelope, verifyCredentialStatus } from '../src/lib/credentialIntegrity';
import { createCredentialBundle, verifyCredentialBundle } from '../src/lib/credentialPdf';

const f = await credentialFixture();
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const revokedBundle = await createCredentialBundle([f.event, f.revoked], f.trust, 'issuer-synthetic', f.keys.issuer.secretKey);
// Portable artifacts preserve historical facts, never assert current registry authority.
for (const [bundle, historical] of [[f.bundle, 'issued'], [revokedBundle, 'revoked']] as const) {
  const original = JSON.stringify(bundle);
  const recovered = await verifyCredentialBundle(copy(bundle), f.trust);
  assert.equal(recovered.currentStatus, 'unknown');
  assert.equal(recovered.historicalStatus, historical);
  assert.deepEqual(recovered.bundle, bundle);
  assert.equal(JSON.stringify(bundle), original);
  assert.equal('trust' in recovered.bundle, false);
  assert.equal('secretKey' in recovered.bundle, false);
  await assert.rejects(() => verifyCredentialBundle({ ...copy(bundle), currentStatus: 'issued' }, f.trust));
}
// Even a valid old issued bundle cannot supersede a fresh revocation response.
const challenge = 'R'.repeat(43);
const status = verifyCredentialStatus(f.status(challenge, 'revoked', f.now + 2), f.trust,
  f.issue.credentialId, f.now + 2, challenge, f.issue.lookupTokenHash);
assert.equal(status.status, 'revoked');
assert.deepEqual(Object.keys(status).sort(), ['audience', 'challenge', 'checkedAt', 'credentialId', 'expiresAt', 'issuerId', 'lookupTokenHash', 'status'].sort());
for (const privateValue of [f.enrollment.subject, f.approval.evidenceDigest, f.approval.methodDigest, f.token])
  assert.equal(JSON.stringify(status).includes(privateValue), false);
const check = (response: unknown, now = f.now, nonce = challenge, hash = f.issue.lookupTokenHash) =>
  verifyCredentialStatus(response, f.trust, f.issue.credentialId, now, nonce, hash);
assert.throws(() => check(f.status(challenge), f.now, 'S'.repeat(43)));
assert.throws(() => check(f.status(challenge), f.now + 60)); // Expiry equality is expired.
assert.throws(() => check(f.status(challenge, 'issued', f.now + 31)));
assert.throws(() => check(f.status(challenge), f.now, challenge, 'f'.repeat(64)));
for (const patch of [{ subject: f.enrollment.subject }, { audience: 'https://other.example.test' },
  { issuerId: 'another-issuer' }, { credentialId: 'other-credential-0001' }, { expiresAt: f.now + 301 }]) {
  const signed = signCredentialEnvelope('status', { ...f.status(challenge).payload, ...patch }, 'issuer-synthetic', f.keys.issuer.secretKey);
  assert.throws(() => check(signed));
}
// Purpose changes and a different trusted role cannot turn one proof into another.
assert.throws(() => verifyCredentialEnvelope({ ...f.event, purpose: 'status' }, f.trust, 'status'));
assert.throws(() => check(signCredentialEnvelope('status', f.status(challenge).payload, 'instructor-synthetic', f.keys.instructor.secretKey)));
const foreign = await credentialFixture(f.now);
await assert.rejects(() => verifyCredentialBundle(f.bundle, foreign.trust));
const reused = copy(f.trust); reused.keys[1].publicKey = reused.keys[0].publicKey;
assert.throws(() => parseCredentialTrust(reused));
// Recomputed links alone do not authenticate edits; terminal revocation cannot be undone.
const changedIssue = { ...f.event, payload: { ...f.issued, approvedMinutes: 61 } };
const forgedRevocation = signCredentialEnvelope('event', { ...f.revoked.payload, previousDigest: await credentialHash(changedIssue), approvedMinutes: 61 }, 'issuer-synthetic', f.keys.issuer.secretKey);
await assert.rejects(() => verifyCredentialChain([changedIssue, forgedRevocation], f.trust));
await assert.rejects(() => verifyCredentialChain([f.revoked], f.trust));
await assert.rejects(() => verifyCredentialChain([f.event, f.revoked, f.event], f.trust));
const changedSubject = signCredentialEnvelope('event', { ...f.revoked.payload, subject: 'other-subject-000001' }, 'issuer-synthetic', f.keys.issuer.secretKey);
await assert.rejects(() => verifyCredentialChain([f.event, changedSubject], f.trust));
// A trusted signature over arbitrary PDF bytes still cannot bypass safe deterministic output.
const bytes = new TextEncoder().encode('%PDF-1.4\n/JavaScript /OpenAction (malicious)\n%%EOF\n');
const injected = copy(f.bundle);
injected.pdfBase64 = credentialBase64(bytes);
injected.manifest = signCredentialEnvelope('pdf', { ...injected.manifest.payload, pdfDigest: await credentialHash(bytes) }, 'issuer-synthetic', f.keys.issuer.secretKey);
await assert.rejects(() => verifyCredentialBundle(injected, f.trust), /PDF exact-byte binding/);
const alteredPdf = copy(f.bundle); alteredPdf.pdfBase64 = credentialBase64(new TextEncoder().encode('not a PDF'));
await assert.rejects(() => verifyCredentialBundle(alteredPdf, f.trust));
const substituted = copy(f.bundle); substituted.manifest = { ...substituted.manifest, purpose: 'event' };
await assert.rejects(() => verifyCredentialBundle(substituted, f.trust));
console.log('credential recovery, historical-status, privacy, freshness and safe-PDF checks passed');
