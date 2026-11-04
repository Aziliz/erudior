import assert from 'node:assert/strict';
import {
  planAccountClosure, planFamilyLearnerErasure, planSchoolRecordErasureReferral,
  type AccountClosureInventory, type ClosureFamilyScope, type FamilyErasureInventory,
} from '../src/lifecycle.ts';
import {
  advanceDeletionFence, checkQueuedWriteAgainstLedger, planErasureSchedule, reconcileRestoredFence,
  type DeletionFence, type PlanningResult,
} from '../src/retention.ts';
import type { AccountSnapshot } from '../src/model.ts';
import { ACCOUNT_TEST_NOW as now, accountFixture, accountFixtureIds as i, accountRequest } from './fixtures.mts';

let cases = 0;
function test(name: string, run: () => void): void { run(); cases++; console.log('ok - ' + name); }
function plan<T>(result: PlanningResult<T>): T { assert.equal(result.ok, true, result.ok ? undefined : result.reason); return (result as { ok: true; plan: T }).plan; }
const opaque = (name: string) => name.padEnd(28, '_');
const day = 86_400;
const policy = { activeEraseWithinSeconds: 30 * day, backupExpireWithinSeconds: 30 * day, offlineReplayUntil: now + 90 * day };
function fence(): DeletionFence {
  return { scope: { kind: 'family-learner', subjectId: i.child, workspaceId: i.family }, epoch: 1, ledgerRevision: 1,
    state: 'active', effectiveAt: now - 1000, retainAtLeastUntil: now + 90 * day };
}
function closureInventory(s: AccountSnapshot): AccountClosureInventory {
  return { format: 'erudior-account-closure-inventory', version: 1, snapshotRevision: s.revision,
    accountId: i.adult, accountVersion: s.accounts.find(a => a.id === i.adult)!.version,
    familyScopes: [{ familyId: i.family, familyVersion: s.workspaces.find(w => w.id === i.family)!.version,
      learnerId: i.child, learnerVersion: s.learners.find(l => l.id === i.child)!.version,
      currentFence: fence(), independentAccess: null }] };
}
function closure(s = accountFixture(), inventory = closureInventory(s), resolutions: unknown = []) {
  return planAccountClosure(s, accountRequest(s, 'account.close', i.personalSession, 'account', i.adult), inventory, resolutions, now);
}
function erasureInventory(s: AccountSnapshot): FamilyErasureInventory {
  return { format: 'erudior-family-erasure-inventory', version: 1, snapshotRevision: s.revision,
    familyId: i.family, familyVersion: s.workspaces.find(w => w.id === i.family)!.version,
    learnerId: i.child, learnerVersion: s.learners.find(l => l.id === i.child)!.version, currentFence: fence(),
    records: s.records.filter(r => r.workspaceId === i.family && r.learnerId === i.child && r.status !== 'erased')
      .map(r => ({ id: r.id, version: r.version, retention: { requestedAt: now, policy: { ...policy } } })) };
}
function erase(s = accountFixture(), inventory = erasureInventory(s)) {
  return planFamilyLearnerErasure(s, accountRequest(s, 'learner.erase', i.familySession, 'learner', i.child), inventory, now);
}
function addGuardian(s: AccountSnapshot, rebindRecords = false): void {
  const membershipAuthority = structuredClone(s.authorities.find(a => a.id === i.familyAuthority)!);
  membershipAuthority.id = opaque('second_member_authority'); membershipAuthority.accountId = i.otherAdult;
  const learningAuthority = structuredClone(s.authorities.find(a => a.id === i.guardianAuthority)!);
  learningAuthority.id = opaque('second_learning_authority'); learningAuthority.accountId = i.otherAdult;
  const privacyAuthority = structuredClone(s.authorities.find(a => a.id === i.privacyAuthority)!);
  privacyAuthority.id = opaque('second_privacy_authority'); privacyAuthority.accountId = i.otherAdult;
  s.authorities.push(membershipAuthority, learningAuthority, privacyAuthority);
  s.familyMemberships.push({ ...structuredClone(s.familyMemberships[0]), id: opaque('second_membership'), accountId: i.otherAdult, authorityId: membershipAuthority.id });
  s.guardians.push({ ...structuredClone(s.guardians[0]), id: opaque('second_guardian'), accountId: i.otherAdult,
    authorityId: learningAuthority.id, privacyAuthorityId: privacyAuthority.id });
  if (rebindRecords) for (const record of s.records.filter(r => r.workspaceId === i.family)) record.authorityId = learningAuthority.id;
}
function addIndependentTeen(s: AccountSnapshot, scope: ClosureFamilyScope): void {
  const learner = s.learners.find(l => l.id === i.child)!;
  learner.ageBand = '13-17'; learner.accountId = opaque('teen_account');
  s.accounts.push({ id: learner.accountId, version: 1, status: 'active', ageClass: 'minor' });
  const identityId = opaque('teen_personal_identity'), personalId = opaque('teen_personal_workspace'), authorityId = opaque('teen_self_authority');
  s.identities.push({ id: identityId, version: 1, status: 'active', accountId: learner.accountId,
    issuer: 'https://personal.example', subject: 'synthetic-teen', trust: 'personal', schoolId: null });
  s.workspaces.push({ id: personalId, version: 1, status: 'active', kind: 'personal', ownerAccountId: learner.accountId, verified: true, schoolPolicy: null });
  s.authorities.push({ id: authorityId, version: 1, status: 'active', kind: 'learner-self', workspaceId: personalId,
    accountId: learner.accountId, learnerId: learner.id, learnerVersion: learner.version,
    purposes: ['independent-learning'], startsAt: now - 100, expiresAt: now + 1000 });
  scope.independentAccess = { accountId: learner.accountId, identityId, authorityId,
    recoveryReceiptId: opaque('teen_personal_recovery'), verifiedAt: now - 90, expiresAt: now + 1000 };
}
function eraseFamilyState(s: AccountSnapshot, scope: ClosureFamilyScope): void {
  for (const record of s.records.filter(r => r.workspaceId === i.family)) record.status = 'erased';
  scope.currentFence = { ...scope.currentFence, epoch: 2, ledgerRevision: 2, state: 'erased', effectiveAt: now };
}

test('last-guardian closure revokes adult access and suspends covered collection while stewardship is unresolved', () => {
  const result = plan(closure());
  assert.equal(result.finalization, 'pending-family-resolution');
  assert.equal(result.immediateActions.revokeAccountSessions, true);
  assert.equal(result.immediateActions.revokeAccountRelationships, true);
  assert.deepEqual(result.immediateActions.suspendFamilyCollection, [{ familyId: i.family, learnerId: i.child }]);
  assert.equal(result.persistScopedLifecycleJobsBeforeRevocation, true);
  assert.equal(result.preserveExternalProviderAccounts, true);
  assert.equal(result.preserveOtherCustodians, true);
  assert.ok(result.accountDataTargets.includes('erudior-identity-record'));
  assert.equal(JSON.stringify(result.accountDataTargets).includes(i.child), false);
});
test('a teen birthday alone does not resolve dependent stewardship', () => {
  const s = accountFixture(); s.learners.find(l => l.id === i.child)!.ageBand = '13-17';
  assert.equal(plan(closure(s)).finalization, 'pending-family-resolution');
});
test('independent teen identity survives parent closure while Family custody stays explicit', () => {
  const s = accountFixture(), inventory = closureInventory(s); addIndependentTeen(s, inventory.familyScopes[0]);
  const result = plan(closure(s, inventory, [{ familyId: i.family, learnerId: i.child, kind: 'independent' }]));
  assert.equal(result.familyResolutions[0].preserveIndependentAccountId, opaque('teen_account'));
  assert.equal(result.familyResolutions[0].reason, 'resolve-family-custody');
  assert.equal(result.finalization, 'pending-family-resolution');
});
test('school-controlled credentials cannot qualify as independent personal recovery', () => {
  const s = accountFixture(), inventory = closureInventory(s); addIndependentTeen(s, inventory.familyScopes[0]);
  const identity = s.identities.find(x => x.id === inventory.familyScopes[0].independentAccess!.identityId)!;
  identity.trust = 'school'; identity.schoolId = i.school;
  const result = plan(closure(s, inventory, [{ familyId: i.family, learnerId: i.child, kind: 'independent' }]));
  assert.equal(result.familyResolutions[0].reason, 'establish-independent-access');
  assert.equal(result.familyResolutions[0].preserveIndependentAccountId, null);
});
test('missing and duplicate dependent inventory fails closed', () => {
  const s = accountFixture(), missing = closureInventory(s); missing.familyScopes = [];
  assert.equal(closure(s, missing).ok, false);
  const duplicate = closureInventory(s); duplicate.familyScopes.push(structuredClone(duplicate.familyScopes[0]));
  assert.equal(closure(s, duplicate).ok, false);
});
test('revoked guardian link cannot conceal Family records still relying on closing account', () => {
  const s = accountFixture(); s.guardians[0].status = 'revoked';
  const missing = closureInventory(s); missing.familyScopes = [];
  assert.equal(closure(s, missing).ok, false);
  assert.equal(plan(closure(s)).finalization, 'pending-family-resolution');
});
test('stale learner, workspace, account and inventory revisions are rejected', () => {
  for (const field of ['learnerVersion', 'familyVersion'] as const) {
    const s = accountFixture(), inventory = closureInventory(s); inventory.familyScopes[0][field]++;
    assert.equal(closure(s, inventory).ok, false, field);
  }
  for (const field of ['snapshotRevision', 'accountVersion'] as const) {
    const s = accountFixture(), inventory = closureInventory(s); inventory[field]++;
    assert.equal(closure(s, inventory).ok, false, field);
  }
});
test('a second guardian alone cannot strand records under revoked originating authority', () => {
  const s = accountFixture(); addGuardian(s);
  const result = plan(closure(s));
  assert.equal(result.finalization, 'pending-family-resolution');
  assert.equal(result.familyResolutions[0].reason, 'rebind-family-record-authority');
});
test('verified remaining guardian with continuing record authority resolves Family custody', () => {
  const s = accountFixture(); addGuardian(s, true);
  const result = plan(closure(s));
  assert.equal(result.finalization, 'ready');
  assert.equal(result.familyResolutions[0].reason, 'verified-guardian-remains');
  assert.deepEqual(result.immediateActions.suspendFamilyCollection, []);
});
test('expired remaining guardian authority and changed learner rights cannot resolve transfer', () => {
  const s = accountFixture(); addGuardian(s, true);
  s.authorities.find(a => a.id === opaque('second_learning_authority'))!.expiresAt = now;
  assert.equal(plan(closure(s)).finalization, 'pending-family-resolution');
  const changed = accountFixture(); addGuardian(changed, true);
  changed.learners.find(l => l.id === i.child)!.guardianAccess = 'independent';
  assert.equal(plan(closure(changed)).finalization, 'pending-family-resolution');
});
test('explicit Family erasure is not dismissed because another guardian remains', () => {
  const s = accountFixture(); addGuardian(s, true);
  const result = plan(closure(s, closureInventory(s), [{ familyId: i.family, learnerId: i.child, kind: 'erase-family-data' }]));
  assert.equal(result.finalization, 'pending-family-resolution');
  assert.equal(result.familyResolutions[0].reason, 'complete-scoped-family-erasure');
  assert.equal(erase(s).ok, true);
});
test('school-only continuation needs independent school authority and separate Family erasure', () => {
  const s = accountFixture(), inventory = closureInventory(s);
  const choice = [{ familyId: i.family, learnerId: i.child, kind: 'school-only', schoolId: i.school }];
  let result = plan(closure(s, inventory, choice));
  assert.equal(result.finalization, 'pending-family-resolution');
  assert.equal(result.familyResolutions[0].preserveSchoolWorkspaceId, i.school);
  eraseFamilyState(s, inventory.familyScopes[0]);
  result = plan(closure(s, inventory, choice));
  assert.equal(result.finalization, 'ready');
  assert.equal(s.records.find(r => r.id === i.grade)!.status, 'active');
  assert.deepEqual(result.requiredLearnerIdentityReviews, [{ learnerId: i.child, eraseIfNoIndependentBasis: true }]);
});
test('unknown school and withdrawn school enrollment authority cannot validate continuation', () => {
  const s = accountFixture(); s.authorities.find(a => a.id === i.enrollmentAuthority)!.status = 'withdrawn';
  const result = plan(closure(s, closureInventory(s), [{ familyId: i.family, learnerId: i.child, kind: 'school-only', schoolId: i.school }]));
  assert.equal(result.familyResolutions[0].reason, 'verify-school-authority');
});
test('Family erasure completion does not imply indefinite preservation of an orphaned identity', () => {
  const s = accountFixture(), inventory = closureInventory(s); eraseFamilyState(s, inventory.familyScopes[0]);
  const result = plan(closure(s, inventory));
  assert.equal(result.finalization, 'ready');
  assert.deepEqual(result.requiredLearnerIdentityReviews, [{ learnerId: i.child, eraseIfNoIndependentBasis: true }]);
});
test('closing adult learner requires personal-data review and association detachment separately from account metadata', () => {
  const result = plan(closure());
  assert.deepEqual(result.requiredOwnLearnerReviews, [{ learnerId: i.adultLearner, learnerVersion: 1, personalWorkspaceId: i.personal,
    erasePersonalLearningDataUnderResolvedPolicy: true, detachClosingAccountBeforeAccountRowErasure: true, reviewRemainingInstitutionalCustody: true }]);
});
test('an erased fence contradicting live Family records blocks closure', () => {
  const s = accountFixture(), inventory = closureInventory(s);
  inventory.familyScopes[0].currentFence.state = 'erased';
  assert.equal(closure(s, inventory).ok, false);
});
test('school and restricted learner sessions cannot initiate adult account closure', () => {
  const s = accountFixture();
  for (const sessionId of [i.schoolSession, i.childSession]) {
    assert.equal(planAccountClosure(s, accountRequest(s, 'account.close', sessionId, 'account', i.adult), closureInventory(s), [], now).ok, false);
  }
});
test('closure requires current Personal session and fresh appropriate authentication', () => {
  const s = accountFixture(); s.sessions.find(x => x.id === i.personalSession)!.authentication.authenticatedAt = now - 301;
  assert.equal(closure(s).ok, false);
  const revoked = accountFixture(); revoked.sessions.find(x => x.id === i.personalSession)!.status = 'revoked';
  assert.equal(closure(revoked).ok, false);
});

test('Family erasure targets exact Family records and explicitly requires learner custody review', () => {
  const s = accountFixture(), before = structuredClone(s);
  const result = plan(erase(s));
  assert.deepEqual(result.records.map(r => r.id).sort(), [i.familyNote, i.familyRecord].sort());
  assert.equal(result.preserveOtherCustodians, true);
  assert.deepEqual(result.learnerIdentityReview, { required: true, scope: 'complete-current-custody', eraseIfNoIndependentBasis: true });
  assert.equal(result.stopCoveredCollection, true);
  assert.equal(result.advanceFenceBeforeDataRemoval, true);
  assert.deepEqual(s, before, 'planning never mutates or erases the snapshot');
});
test('Family erasure does not accept school or unrelated records in its inventory', () => {
  const s = accountFixture(), inventory = erasureInventory(s);
  inventory.records.push({ id: i.grade, version: 1, retention: { requestedAt: now, policy } });
  assert.equal(erase(s, inventory).ok, false);
});
test('Family erasure rejects missing, duplicate and stale record inventories', () => {
  for (const mutate of [
    (inventory: FamilyErasureInventory) => inventory.records.pop(),
    (inventory: FamilyErasureInventory) => inventory.records.push(structuredClone(inventory.records[0])),
    (inventory: FamilyErasureInventory) => inventory.records[0].version++,
  ]) {
    const s = accountFixture(), inventory = erasureInventory(s); mutate(inventory);
    assert.equal(erase(s, inventory).ok, false);
  }
});
test('a narrow-category grant cannot authorize whole Family learner erasure', () => {
  const s = accountFixture(); s.guardians[0].categories = ['practice'];
  assert.equal(erase(s).ok, false);
});
test('withdrawing learning consent does not remove separately verified privacy-request authority', () => {
  const s = accountFixture(); s.authorities.find(a => a.id === i.guardianAuthority)!.status = 'withdrawn';
  assert.equal(erase(s).ok, true);
  s.authorities.find(a => a.id === i.privacyAuthority)!.status = 'withdrawn';
  assert.equal(erase(s).ok, false);
});
test('school erasure referral is current read-authorized routing without mutation permission', () => {
  const s = accountFixture();
  const result = plan(planSchoolRecordErasureReferral(s, accountRequest(s, 'record.read', i.familySession, 'record', i.grade), now));
  assert.equal(result.schoolWorkspaceId, i.school); assert.equal(result.mutationAuthorized, false);
  assert.equal(result.recordId, i.grade);
});
test('school referral hides unauthorized and nonexistent record targets behind the same result', () => {
  const s = accountFixture();
  const foreign = planSchoolRecordErasureReferral(s, accountRequest(s, 'record.read', i.familySession, 'record', i.foreignGrade), now);
  const missing = planSchoolRecordErasureReferral(s, accountRequest(s, 'record.read', i.familySession, 'record', opaque('nonexistent_record')), now);
  assert.deepEqual(foreign, missing); assert.equal(foreign.ok, false);
});
test('retention policy is explicit and shorter applicable deadlines win', () => {
  const result = plan(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy,
    requiredActiveEraseBy: now + 5 * day, requiredCompleteEraseBy: now + 12 * day }));
  assert.equal(result.activeEraseBy, now + 5 * day); assert.equal(result.backupExpireBy, now + 12 * day);
  assert.equal(result.ledgerRetainAtLeastUntil, now + 90 * day);
  assert.equal(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now }).ok, false);
});
test('a 30-day active target plus 30-day backup target remains 60 days end-to-end', () => {
  const result = plan(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy }));
  assert.equal(result.activeEraseBy, now + 30 * day); assert.equal(result.backupExpireBy, now + 60 * day);
});
test('holds are record-scoped, bounded, reviewable and do not silently override deadlines', () => {
  const hold = { id: opaque('verified_hold'), recordId: i.familyRecord, basisReference: opaque('verified_hold_basis'),
    purpose: 'pending-access-request' as const, reviewAt: now - 1, expiresAt: now + 100 * day, status: 'active' as const };
  const result = plan(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy, hold }));
  assert.equal(result.activeEraseBy, now + 30 * day); assert.equal(result.hold!.reviewRequired, true);
  assert.equal(result.hold!.conflictsWithDeadline, true); assert.equal(result.hold!.restrictedRetentionRequired, true);
  assert.equal(result.ledgerRetainAtLeastUntil, now + 130 * day);
  assert.equal(planErasureSchedule({ recordId: i.familyNote, requestedAt: now, now, policy, hold }).ok, false);
  assert.equal(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy, hold: { ...hold, expiresAt: Infinity } }).ok, false);
});
test('expired or explicitly released holds no longer block erasure', () => {
  const hold = { id: opaque('verified_hold'), recordId: i.familyRecord, basisReference: opaque('verified_hold_basis'),
    purpose: 'legal-obligation', reviewAt: now - 100, expiresAt: now, status: 'active' };
  assert.equal(plan(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy, hold })).hold, null);
  assert.equal(plan(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy, hold: { ...hold, expiresAt: now + 100, status: 'released' } })).hold, null);
});
test('retention rejects nonfinite times, overflow, negative windows and unknown input fields', () => {
  for (const value of [NaN, Infinity, -1, 0.5, Number.MAX_SAFE_INTEGER]) {
    assert.equal(planErasureSchedule({ recordId: i.familyRecord, requestedAt: value, now, policy }).ok, false);
  }
  assert.equal(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy: { ...policy, activeEraseWithinSeconds: -1 } }).ok, false);
  assert.equal(planErasureSchedule({ recordId: i.familyRecord, requestedAt: now, now, policy, arbitraryOverride: true }).ok, false);
});
test('scope withdrawal or erasure rejects queued writes even if a caller copies new versions', () => {
  const active = fence(), queued = { scope: active.scope, epoch: active.epoch, ledgerRevision: active.ledgerRevision, createdAt: now - 10 };
  assert.equal(checkQueuedWriteAgainstLedger(active, queued, now).ok, true);
  const erased = { ...active, epoch: 2, ledgerRevision: 2, state: 'erased', effectiveAt: now };
  assert.equal(checkQueuedWriteAgainstLedger(erased, queued, now).ok, false);
  assert.equal(checkQueuedWriteAgainstLedger(erased, { ...queued, epoch: 2, ledgerRevision: 2, createdAt: now }, now).ok, false);
});
test('ledger scope and immutable revision prevent cross-family replay and regression', () => {
  const active = fence();
  assert.equal(advanceDeletionFence(active, { ...active, epoch: 2 }).ok, false);
  assert.equal(advanceDeletionFence(active, { ...active, ledgerRevision: 2, retainAtLeastUntil: now }).ok, false);
  const erased = { ...active, epoch: 2, ledgerRevision: 2, state: 'erased', effectiveAt: now };
  assert.equal(advanceDeletionFence(erased, { ...erased, epoch: 3, ledgerRevision: 3, state: 'active' }).ok, false);
  assert.equal(checkQueuedWriteAgainstLedger(active, { scope: { ...active.scope, workspaceId: i.otherSchool }, epoch: 1, ledgerRevision: 1, createdAt: now }, now).ok, false);
});
test('restored snapshots reconcile against an independent current ledger and cannot reopen service themselves', () => {
  const old = fence(), erased = { ...old, epoch: 2, ledgerRevision: 2, state: 'erased', effectiveAt: now };
  const result = plan(reconcileRestoredFence(old, erased));
  assert.equal(result.eraseRestoredScope, true); assert.equal(result.invalidateRestoredQueue, true); assert.equal(result.serviceReopenAuthorized, false);
  assert.equal(reconcileRestoredFence(erased, old).ok, false); assert.equal(reconcileRestoredFence(old, undefined).ok, false);
});

console.log(`Account lifecycle: ${cases} cases passed.`);
