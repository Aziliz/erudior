import assert from 'node:assert/strict';
import { authorizeAccountOperation } from '../src/authorization';
import { validateAccountSnapshot, type AccountAction, type AccountRequest, type AccountSnapshot } from '../src/model';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { planAccountClosure, planFamilyLearnerErasure, planSchoolRecordErasureReferral } from '../src/lifecycle';
import {
  advanceDeletionFence,
  checkQueuedWriteAgainstLedger,
  planErasureSchedule,
  reconcileRestoredFence,
  type DeletionFence,
  type QueuedScopeWrite,
} from '../src/retention';

// Independent synthetic workflows. No network, provider identity, personal
// information, or service adapter is involved in this acceptance suite.
const now = 1_800_000_000;
const day = 86_400;
const learnerId = 'acceptance_learner_one';
const familyId = 'acceptance_family_one';
const schoolId = 'acceptance_school_one';
const familyFence: DeletionFence = {
  scope: { kind: 'family-learner', subjectId: learnerId, workspaceId: familyId },
  epoch: 1,
  ledgerRevision: 10,
  state: 'active',
  effectiveAt: now - day,
  retainAtLeastUntil: now + 60 * day,
};
const schoolFence: DeletionFence = {
  ...structuredClone(familyFence),
  scope: { kind: 'school-learner', subjectId: learnerId, workspaceId: schoolId },
};
const queuedFamilyWrite: QueuedScopeWrite = {
  scope: structuredClone(familyFence.scope),
  epoch: 1,
  ledgerRevision: 10,
  createdAt: now - 60,
};
const erasedFamilyFence: DeletionFence = {
  ...structuredClone(familyFence),
  epoch: 2,
  ledgerRevision: 11,
  state: 'erased',
  effectiveAt: now,
};

assert.equal(checkQueuedWriteAgainstLedger(familyFence, queuedFamilyWrite, now).ok, true,
  'current active family scope passes replay eligibility only');
assert.equal(checkQueuedWriteAgainstLedger(erasedFamilyFence, queuedFamilyWrite, now).ok, false,
  'a device reconnecting after family erasure cannot replay its queued work');
assert.equal(checkQueuedWriteAgainstLedger(erasedFamilyFence, {
  ...queuedFamilyWrite, epoch: 2, ledgerRevision: 11, createdAt: now,
}, now).ok, false, 'copying new revision numbers cannot reactivate an erased scope');
assert.equal(checkQueuedWriteAgainstLedger(schoolFence, {
  ...queuedFamilyWrite, scope: structuredClone(schoolFence.scope),
}, now).ok, true, 'family erasure does not erase separately held school records');
assert.equal(checkQueuedWriteAgainstLedger(schoolFence, queuedFamilyWrite, now).ok, false,
  'one learner ID cannot substitute school authority for family scope');
assert.equal(checkQueuedWriteAgainstLedger({
  ...familyFence,
  scope: { ...familyFence.scope, workspaceId: 'acceptance_other_family' },
}, queuedFamilyWrite, now).ok, false, 'replay fences bind the exact family workspace');

const restored = reconcileRestoredFence(familyFence, erasedFamilyFence);
assert.equal(restored.ok, true);
if (restored.ok) {
  assert.equal(restored.plan.eraseRestoredScope, true);
  assert.equal(restored.plan.invalidateRestoredQueue, true);
  assert.equal(restored.plan.serviceReopenAuthorized, false,
    'reconciliation guidance does not itself authorize reopening a service');
}
assert.equal(reconcileRestoredFence(familyFence, undefined).ok, false,
  'a restored snapshot cannot stand in for a missing current deletion ledger');
assert.equal(reconcileRestoredFence(erasedFamilyFence, familyFence).ok, false,
  'an older ledger cannot roll a newer erased snapshot backward');
assert.equal(advanceDeletionFence(erasedFamilyFence, {
  ...erasedFamilyFence, epoch: 3, ledgerRevision: 12, state: 'active',
}).ok, false, 'terminal identities cannot be reactivated by increasing revisions');
assert.equal(advanceDeletionFence(familyFence, {
  ...familyFence, epoch: 2,
}).ok, false, 'a changed fence cannot reuse the same ledger revision');

const scheduleInput = {
  recordId: 'acceptance_family_record',
  requestedAt: now,
  now,
  policy: {
    activeEraseWithinSeconds: 30 * day,
    backupExpireWithinSeconds: 30 * day,
    offlineReplayUntil: now + 10 * day,
  },
};
const schedule = planErasureSchedule(scheduleInput);
assert.equal(schedule.ok, true);
if (schedule.ok) {
  assert.equal(schedule.plan.activeEraseBy, now + 30 * day);
  assert.equal(schedule.plan.backupExpireBy, now + 60 * day,
    'a 30-day active target plus 30-day backup window is a 60-day end-to-end target');
  assert.equal(schedule.plan.ledgerRetainAtLeastUntil, now + 60 * day);
}
const shorter = planErasureSchedule({
  ...scheduleInput,
  requiredActiveEraseBy: now + 5 * day,
  requiredCompleteEraseBy: now + 10 * day,
});
assert.equal(shorter.ok, true);
if (shorter.ok) {
  assert.equal(shorter.plan.activeEraseBy, now + 5 * day);
  assert.equal(shorter.plan.backupExpireBy, now + 10 * day);
}
const hold = {
  id: 'acceptance_record_hold',
  recordId: scheduleInput.recordId,
  basisReference: 'acceptance_hold_basis',
  purpose: 'pending-access-request',
  reviewAt: now + day,
  expiresAt: now + 40 * day,
  status: 'active',
};
const held = planErasureSchedule({ ...scheduleInput, hold });
assert.equal(held.ok, true);
if (held.ok) {
  assert.equal(held.plan.activeEraseBy, now + 30 * day,
    'a hold is disclosed separately rather than silently rewriting the deadline');
  assert.equal(held.plan.hold?.conflictsWithDeadline, true);
  assert.equal(held.plan.hold?.restrictedRetentionRequired, true);
}
assert.equal(planErasureSchedule({
  ...scheduleInput, hold: { ...hold, recordId: 'acceptance_unrelated_record' },
}).ok, false, 'a hold for one record cannot retain another record');
assert.equal(planErasureSchedule({ ...scheduleInput, now: Number.POSITIVE_INFINITY }).ok, false);
assert.equal(planErasureSchedule({
  ...scheduleInput,
  policy: { ...scheduleInput.policy, activeEraseWithinSeconds: Number.MAX_SAFE_INTEGER },
}).ok, false, 'overflow cannot turn a finite erasure policy into an unlimited deadline');

function operation(s: AccountSnapshot, sessionId: string, action: AccountAction, kind: AccountRequest['target']['kind'], targetId: string): AccountRequest {
  const session = s.sessions.find(item => item.id === sessionId)!;
  const collection = kind === 'account' ? s.accounts : kind === 'learner' ? s.learners : kind === 'workspace' ? s.workspaces : s.records;
  return {
    sessionId,
    sessionVersion: session.version,
    snapshotRevision: s.revision,
    workspaceId: session.activeWorkspaceId,
    action,
    target: { kind, id: targetId, version: collection.find(item => item.id === targetId)!.version },
  };
}
function permitted(s: AccountSnapshot, sessionId: string, action: AccountAction, kind: AccountRequest['target']['kind'], targetId: string): boolean {
  return authorizeAccountOperation(s, operation(s, sessionId, action, kind, targetId), now).allowed;
}

// One person is both guardian and teacher. Their selected context and sign-in
// authority determine which records they can use; the roles never combine.
const original = accountFixture(now);
assert.equal(validateAccountSnapshot(original).ok, true, 'synthetic baseline is structurally valid');
assert.equal(permitted(original, ids.personalSession, 'record.read', 'record', ids.personalRecord), true);
assert.equal(permitted(original, ids.familySession, 'record.read', 'record', ids.familyRecord), true);
assert.equal(permitted(original, ids.familySession, 'record.read', 'record', ids.grade), true,
  'a verified guardian sees the specific school grade released through their link');
assert.equal(permitted(original, ids.familySession, 'record.read', 'record', ids.schoolAssignment), false,
  'a school-family link does not expose an unreleased teacher draft');
assert.equal(permitted(original, ids.familySession, 'record.write', 'record', ids.grade), false,
  'a Family view cannot overwrite the school grade');
assert.equal(permitted(original, ids.schoolSession, 'record.read', 'record', ids.grade), true);
assert.equal(permitted(original, ids.schoolSession, 'grade.publish', 'record', ids.grade), true);
assert.equal(permitted(original, ids.schoolSession, 'record.read', 'record', ids.familyNote), false);
assert.equal(permitted(original, ids.schoolSession, 'record.read', 'record', ids.foreignGrade), false);
assert.equal(permitted(original, ids.schoolSession, 'record.write', 'record', ids.submission), false,
  'teacher authority does not make an immutable learner submission editable');

// A school administrator resets the institutional credential. A new valid
// school session still cannot be used as personal recovery or Family authority.
const schoolReset = structuredClone(original);
schoolReset.identities.find(item => item.id === ids.schoolIdentity)!.version++;
const resetSession = schoolReset.sessions.find(item => item.id === ids.schoolSession)!;
assert.equal(resetSession.authentication.kind, 'school');
if (resetSession.authentication.kind === 'school') resetSession.authentication.identityVersion++;
assert.equal(permitted(schoolReset, ids.schoolSession, 'record.read', 'record', ids.grade), true);
for (const action of ['account.close', 'account.recovery.change'] as const) {
  const request = operation(schoolReset, ids.schoolSession, action, 'account', ids.adult);
  request.workspaceId = ids.personal;
  assert.equal(authorizeAccountOperation(schoolReset, request, now).allowed, false,
    'school recovery cannot authorize ' + action);
}
const pairingRequest = operation(schoolReset, ids.schoolSession, 'device.pair', 'learner', ids.child);
pairingRequest.workspaceId = ids.family;
assert.equal(authorizeAccountOperation(schoolReset, pairingRequest, now).allowed, false,
  'school credentials cannot approve a family child device');
resetSession.activeWorkspaceId = ids.family;
resetSession.contexts.push({ workspaceId: ids.family, workspaceVersion: 1, schoolPolicyVersion: null });
assert.equal(permitted(schoolReset, ids.schoolSession, 'record.read', 'record', ids.familyRecord), false,
  'adding Family to a school-authenticated context object fails closed');

// Personal authentication must meet the institution's independently selected
// policy, even though this same person already has a teaching assignment.
const personalSchool = structuredClone(original);
const personalSchoolSession = personalSchool.sessions.find(item => item.id === ids.familySession)!;
personalSchoolSession.activeWorkspaceId = ids.school;
assert.equal(permitted(personalSchool, ids.familySession, 'record.read', 'record', ids.grade), false);
const schoolPolicy = personalSchool.workspaces.find(item => item.id === ids.school)!.schoolPolicy!;
schoolPolicy.allowedSources.push('personal');
schoolPolicy.version++;
assert.equal(permitted(personalSchool, ids.familySession, 'record.read', 'record', ids.grade), false,
  'a changed school policy requires a newly authorized context version');
personalSchoolSession.contexts.find(item => item.workspaceId === ids.school)!.schoolPolicyVersion = schoolPolicy.version;
assert.equal(permitted(personalSchool, ids.familySession, 'record.read', 'record', ids.grade), true);

// A teacher's membership does not grant all classes. Explicitly adding a second
// read-only class assignment enables reads without enabling grade publication.
const secondClass = structuredClone(original);
const secondEnrollment = { ...secondClass.enrollments.find(item => item.id === ids.enrollment)!,
  id: 'acceptance_second_enrollment', classId: ids.otherClassroom };
secondClass.enrollments.push(secondEnrollment);
const secondGrade = { ...secondClass.records.find(item => item.id === ids.grade)!,
  id: 'acceptance_second_class_grade', classId: ids.otherClassroom };
secondClass.records.push(secondGrade);
assert.equal(validateAccountSnapshot(secondClass).ok, true);
assert.equal(permitted(secondClass, ids.schoolSession, 'record.read', 'record', secondGrade.id), false);
secondClass.teachingAssignments.push({
  ...secondClass.teachingAssignments[0], id: 'acceptance_second_assignment', classId: ids.otherClassroom,
  actions: ['record.read'], categories: ['grade'],
});
assert.equal(permitted(secondClass, ids.schoolSession, 'record.read', 'record', secondGrade.id), true);
assert.equal(permitted(secondClass, ids.schoolSession, 'grade.publish', 'record', secondGrade.id), false);

const coTeacher = structuredClone(original);
const coIdentityId = 'acceptance_co_teacher_identity';
const coAuthorityId = 'acceptance_co_teacher_authority';
const coMembershipId = 'acceptance_co_teacher_membership';
const coSessionId = 'acceptance_co_teacher_session';
coTeacher.identities.push({ ...coTeacher.identities.find(item => item.id === ids.schoolIdentity)!,
  id: coIdentityId, accountId: ids.otherAdult, subject: 'synthetic-co-teacher' });
coTeacher.sessions.push({ ...coTeacher.sessions.find(item => item.id === ids.schoolSession)!,
  id: coSessionId, principal: { kind: 'account', id: ids.otherAdult, version: 1 },
  authentication: { kind: 'school', schoolId: ids.school, identityId: coIdentityId, identityVersion: 1,
    authenticatedAt: now - 30, assurance: 'mfa' } });
assert.equal(permitted(coTeacher, coSessionId, 'record.read', 'record', ids.grade), false,
  'an individually authenticated school employee still needs membership');
coTeacher.authorities.push({ ...coTeacher.authorities.find(item => item.id === ids.schoolAuthority)!,
  id: coAuthorityId, accountId: ids.otherAdult });
coTeacher.schoolMemberships.push({ ...coTeacher.schoolMemberships[0],
  id: coMembershipId, accountId: ids.otherAdult, authorityId: coAuthorityId });
assert.equal(permitted(coTeacher, coSessionId, 'record.read', 'record', ids.grade), false,
  'membership does not automatically assign every class');
coTeacher.teachingAssignments.push({ ...coTeacher.teachingAssignments[0],
  id: 'acceptance_co_teacher_assignment', membershipId: coMembershipId, actions: ['record.read'], categories: ['grade'] });
assert.equal(permitted(coTeacher, coSessionId, 'record.read', 'record', ids.grade), true);
assert.equal(permitted(coTeacher, coSessionId, 'grade.publish', 'record', ids.grade), false);
coTeacher.schoolMemberships.find(item => item.id === ids.schoolMember)!.status = 'revoked';
assert.equal(permitted(coTeacher, ids.schoolSession, 'record.read', 'record', ids.grade), false);
assert.equal(permitted(coTeacher, coSessionId, 'record.read', 'record', ids.grade), true,
  'one teacher leaving does not delete the class or another teacher authority');

assert.equal(permitted(original, ids.childSession, 'record.read', 'record', ids.familyRecord), true);
assert.equal(permitted(original, ids.childSession, 'record.read', 'record', ids.familyNote), false);
for (const action of ['device.pair', 'guardian.change', 'learner.erase'] as const) {
  assert.equal(permitted(original, ids.childSession, action, 'learner', ids.child), false,
    'restricted learner sessions cannot perform ' + action);
}
assert.equal(permitted(original, ids.personalSession, 'account.close', 'account', ids.otherAdult), false,
  'fresh personal authentication can close only the same account');

// Every revocation scenario starts from a known-permitted operation. These are
// mutations of current server state, not client-side tab visibility checks.
const revokedCases: { label: string; session: string; target: string; change: (s: AccountSnapshot) => void }[] = [
  { label: 'device session', session: ids.familySession, target: ids.familyRecord,
    change: s => { s.sessions.find(item => item.id === ids.familySession)!.status = 'revoked'; } },
  { label: 'personal identity', session: ids.familySession, target: ids.familyRecord,
    change: s => { s.identities.find(item => item.id === ids.personalIdentity)!.status = 'revoked'; } },
  { label: 'guardian relationship', session: ids.familySession, target: ids.familyRecord,
    change: s => { s.guardians[0].status = 'revoked'; } },
  { label: 'family membership', session: ids.familySession, target: ids.familyRecord,
    change: s => { s.familyMemberships[0].status = 'revoked'; } },
  { label: 'school membership', session: ids.schoolSession, target: ids.grade,
    change: s => { s.schoolMemberships[0].status = 'revoked'; } },
  { label: 'class assignment', session: ids.schoolSession, target: ids.grade,
    change: s => { s.teachingAssignments[0].status = 'revoked'; } },
  { label: 'student enrollment', session: ids.schoolSession, target: ids.grade,
    change: s => { s.enrollments.find(item => item.id === ids.enrollment)!.status = 'revoked'; } },
  { label: 'school sharing link', session: ids.familySession, target: ids.grade,
    change: s => { s.familySchoolLinks[0].status = 'revoked'; } },
];
for (const item of revokedCases) {
  const s = structuredClone(original);
  assert.equal(permitted(s, item.session, 'record.read', 'record', item.target), true, item.label + ' baseline');
  item.change(s);
  s.revision++;
  assert.equal(permitted(s, item.session, 'record.read', 'record', item.target), false, item.label + ' revokes access');
}

const staleRequest = operation(original, ids.schoolSession, 'record.read', 'record', ids.grade);
const changedRecord = structuredClone(original);
changedRecord.records.find(item => item.id === ids.grade)!.version++;
assert.equal(authorizeAccountOperation(changedRecord, staleRequest, now).allowed, false);
const changedSession = structuredClone(original);
changedSession.sessions.find(item => item.id === ids.schoolSession)!.version++;
assert.equal(authorizeAccountOperation(changedSession, staleRequest, now).allowed, false);
assert.equal(authorizeAccountOperation(original, staleRequest, now + 5).allowed, false,
  'an earlier authorization snapshot cannot become a long-lived permission');
const expiredAuthority = structuredClone(original);
expiredAuthority.authorities.find(item => item.id === ids.enrollmentAuthority)!.expiresAt = now;
assert.equal(permitted(expiredAuthority, ids.schoolSession, 'record.read', 'record', ids.grade), false,
  'authority expires exactly at its deadline');
for (const malformed of [undefined, null, {}, [], { ...staleRequest, action: 'administrator.everything' }]) {
  assert.equal(authorizeAccountOperation(original, malformed, now).allowed, false);
}

// An age/rights change invalidates prior learner-specific authority. Even a
// renewed receipt cannot turn an independent learner into a managed child.
const ageTransition = structuredClone(original);
const transitionedLearner = ageTransition.learners.find(item => item.id === ids.child)!;
transitionedLearner.version++;
transitionedLearner.ageBand = '13-17';
assert.equal(permitted(ageTransition, ids.familySession, 'record.read', 'record', ids.familyRecord), false,
  'old learner-specific receipts fail after learner version changes');
for (const receipt of ageTransition.authorities.filter(item => item.learnerId === ids.child)) receipt.learnerVersion = transitionedLearner.version;
transitionedLearner.guardianAccess = 'independent';
assert.equal(permitted(ageTransition, ids.familySession, 'record.read', 'record', ids.grade), false,
  'postsecondary or other independent rights can end guardian access before age eighteen');
transitionedLearner.ageBand = 'adult';
assert.equal(permitted(ageTransition, ids.familySession, 'record.read', 'record', ids.familyRecord), false,
  'continuing adult sharing requires a separate future consent protocol');

function closureInventory(s: AccountSnapshot) {
  return {
    format: 'erudior-account-closure-inventory', version: 1,
    snapshotRevision: s.revision, accountId: ids.adult,
    accountVersion: s.accounts.find(item => item.id === ids.adult)!.version,
    familyScopes: [{
      familyId: ids.family, familyVersion: 1,
      learnerId: ids.child, learnerVersion: s.learners.find(item => item.id === ids.child)!.version,
      currentFence: { ...familyFence, scope: { kind: 'family-learner', subjectId: ids.child, workspaceId: ids.family } },
      independentAccess: null,
    }],
  };
}
const closureRequest = operation(original, ids.personalSession, 'account.close', 'account', ids.adult);
const closing = planAccountClosure(original, closureRequest, closureInventory(original), [], now);
assert.equal(closing.ok, true);
if (closing.ok) {
  assert.equal(closing.plan.finalization, 'pending-family-resolution');
  assert.deepEqual(closing.plan.immediateActions.suspendFamilyCollection, [{ familyId: ids.family, learnerId: ids.child }]);
  assert.equal(closing.plan.preserveExternalProviderAccounts, true);
  assert.equal(closing.plan.preserveOtherCustodians, true);
  assert.deepEqual(closing.plan.accountDataTargets, [
    'erudior-identity-record', 'external-sign-in-links', 'contact-and-recovery', 'device-sessions', 'account-profile',
  ], 'account closure does not target learner or school records');
  assert.equal(closing.plan.persistScopedLifecycleJobsBeforeRevocation, true,
    'controlled lifecycle work must remain completable after sessions are revoked');
  assert.deepEqual(closing.plan.requiredOwnLearnerReviews.map(item => item.learnerId), [ids.adultLearner],
    'closing adults own learning identity is separately inventoried for erasure and custody review');
}
assert.equal(planAccountClosure(original, closureRequest, {
  ...closureInventory(original), familyScopes: [],
}, [], now).ok, false, 'omitting a dependent from the inventory cannot make closure ready');
const unclaimedTeen = structuredClone(original);
unclaimedTeen.learners.find(item => item.id === ids.child)!.ageBand = '13-17';
const teenClosure = planAccountClosure(unclaimedTeen, closureRequest, closureInventory(unclaimedTeen), [], now);
assert.equal(teenClosure.ok, true);
if (teenClosure.ok) assert.equal(teenClosure.plan.finalization, 'pending-family-resolution',
  'turning thirteen does not create independent credentials or recovery');
const alreadyRevokedGuardian = structuredClone(original);
alreadyRevokedGuardian.guardians[0].status = 'revoked';
assert.equal(planAccountClosure(alreadyRevokedGuardian, closureRequest, {
  ...closureInventory(alreadyRevokedGuardian), familyScopes: [],
}, [], now).ok, false, 'records still bound to the closing authority need resolution even after relationship revocation');

function erasureInventory(s: AccountSnapshot) {
  return {
    format: 'erudior-family-erasure-inventory', version: 1, snapshotRevision: s.revision,
    familyId: ids.family, familyVersion: 1, learnerId: ids.child,
    learnerVersion: s.learners.find(item => item.id === ids.child)!.version,
    currentFence: { ...familyFence, scope: { kind: 'family-learner', subjectId: ids.child, workspaceId: ids.family } },
    records: s.records.filter(item => item.workspaceId === ids.family && item.learnerId === ids.child && item.status !== 'erased')
      .map(item => ({ id: item.id, version: item.version, retention: { requestedAt: now, policy: scheduleInput.policy } })),
  };
}
const eraseRequest = operation(original, ids.familySession, 'learner.erase', 'learner', ids.child);
const beforePlan = JSON.stringify(original);
const erasure = planFamilyLearnerErasure(original, eraseRequest, erasureInventory(original), now);
assert.equal(erasure.ok, true);
if (erasure.ok) {
  assert.deepEqual(erasure.plan.records.map(item => item.id).sort(), [ids.familyRecord, ids.familyNote].sort());
  assert.equal(erasure.plan.preserveOtherCustodians, true);
  assert.equal(erasure.plan.stopCoveredCollection, true);
  assert.equal(erasure.plan.advanceFenceBeforeDataRemoval, true);
  assert.deepEqual(erasure.plan.learnerIdentityReview,
    { required: true, scope: 'complete-current-custody', eraseIfNoIndependentBasis: true },
    'a scoped Family plan requires a complete custody review rather than indefinite identity retention');
}
assert.equal(JSON.stringify(original), beforePlan, 'planning does not mutate records or execute deletion');
assert.equal(planFamilyLearnerErasure(original, eraseRequest, {
  ...erasureInventory(original), records: erasureInventory(original).records.slice(0, 1),
}, now).ok, false, 'a partial inventory cannot claim full Family erasure');
assert.equal(planFamilyLearnerErasure(original, eraseRequest, {
  ...erasureInventory(original), records: [...erasureInventory(original).records,
    { id: ids.grade, version: 1, retention: { requestedAt: now, policy: scheduleInput.policy } }],
}, now).ok, false, 'a Family erasure request cannot include a school-owned grade');
const narrowGuardian = structuredClone(original);
narrowGuardian.guardians[0].categories = ['practice'];
assert.equal(planFamilyLearnerErasure(narrowGuardian, eraseRequest, erasureInventory(narrowGuardian), now).ok, false,
  'a narrow category grant does not authorize whole-family learner erasure');
narrowGuardian.guardians.push({ ...narrowGuardian.guardians[0], id: 'acceptance_other_partial_guardian',
  categories: ['assignment', 'submission', 'grade', 'attendance', 'family-note', 'accommodation'] });
assert.equal(planFamilyLearnerErasure(narrowGuardian, eraseRequest, erasureInventory(narrowGuardian), now).ok, false,
  'partial grants are not combined into whole-domain destructive authority');
const withdrawnLearning = structuredClone(original);
withdrawnLearning.authorities.find(item => item.id === ids.guardianAuthority)!.status = 'withdrawn';
assert.equal(permitted(withdrawnLearning, ids.familySession, 'record.read', 'record', ids.familyRecord), false);
assert.equal(planFamilyLearnerErasure(withdrawnLearning, eraseRequest, erasureInventory(withdrawnLearning), now).ok, true,
  'withdrawal of learning consent does not block separately verified privacy erasure authority');
const revokedPrivacyActor = structuredClone(withdrawnLearning);
revokedPrivacyActor.guardians[0].status = 'revoked';
assert.equal(planFamilyLearnerErasure(revokedPrivacyActor, eraseRequest, erasureInventory(revokedPrivacyActor), now).ok, false,
  'privacy authority does not revive a revoked guardianship');
const referral = planSchoolRecordErasureReferral(original,
  operation(original, ids.familySession, 'record.read', 'record', ids.grade), now);
assert.equal(referral.ok, true);
if (referral.ok) {
  assert.equal(referral.plan.schoolWorkspaceId, ids.school);
  assert.equal(referral.plan.mutationAuthorized, false,
    'permission to see a released school grade only routes an erasure request');
}

// The same learner can establish independent access before a parent closes
// their account. That access survives; it does not silently reassign Family data.
const independentTeen = structuredClone(original);
const teenAccountId = 'acceptance_independent_teen_account';
const teenIdentityId = 'acceptance_independent_teen_identity';
const teenWorkspaceId = 'acceptance_independent_teen_workspace';
const teenAuthorityId = 'acceptance_independent_teen_authority';
const teen = independentTeen.learners.find(item => item.id === ids.child)!;
teen.accountId = teenAccountId;
teen.ageBand = '13-17';
teen.version++;
for (const authority of independentTeen.authorities.filter(item => item.learnerId === ids.child)) authority.learnerVersion = teen.version;
independentTeen.accounts.push({ id: teenAccountId, version: 1, status: 'active', ageClass: 'minor' });
independentTeen.identities.push({ ...independentTeen.identities.find(item => item.id === ids.personalIdentity)!,
  id: teenIdentityId, accountId: teenAccountId, subject: 'synthetic-independent-teen' });
independentTeen.workspaces.push({ ...independentTeen.workspaces.find(item => item.id === ids.personal)!,
  id: teenWorkspaceId, ownerAccountId: teenAccountId });
independentTeen.authorities.push({ ...independentTeen.authorities.find(item => item.id === ids.personalAuthority)!,
  id: teenAuthorityId, kind: 'learner-self', workspaceId: teenWorkspaceId, accountId: teenAccountId,
  learnerId: ids.child, learnerVersion: teen.version });
const teenInventory = {
  ...closureInventory(independentTeen),
  familyScopes: closureInventory(independentTeen).familyScopes.map(scope => ({ ...scope,
    independentAccess: { accountId: teenAccountId, identityId: teenIdentityId,
      recoveryReceiptId: 'acceptance_teen_recovery_receipt', authorityId: teenAuthorityId,
      verifiedAt: now - 60, expiresAt: now + day } })),
};
const teenResolution = [{ familyId: ids.family, learnerId: ids.child, kind: 'independent' }];
const independentClosure = planAccountClosure(independentTeen,
  operation(independentTeen, ids.personalSession, 'account.close', 'account', ids.adult), teenInventory, teenResolution, now);
assert.equal(independentClosure.ok, true);
if (independentClosure.ok) {
  assert.equal(independentClosure.plan.familyResolutions[0].preserveIndependentAccountId, teenAccountId);
  assert.equal(independentClosure.plan.finalization, 'pending-family-resolution');
  assert.equal(independentClosure.plan.familyResolutions[0].reason, 'resolve-family-custody');
}
for (const record of independentTeen.records.filter(item => item.workspaceId === ids.family)) record.status = 'erased';
const afterErasureInventory = { ...teenInventory, familyScopes: teenInventory.familyScopes.map(scope => ({
  ...scope, currentFence: { ...scope.currentFence, state: 'erased', epoch: 2, ledgerRevision: 11, effectiveAt: now },
})) };
const afterFamilyErasure = planAccountClosure(independentTeen,
  operation(independentTeen, ids.personalSession, 'account.close', 'account', ids.adult), afterErasureInventory, teenResolution, now);
assert.equal(afterFamilyErasure.ok, true);
if (afterFamilyErasure.ok) {
  assert.equal(afterFamilyErasure.plan.finalization, 'ready');
  assert.equal(afterFamilyErasure.plan.familyResolutions[0].preserveIndependentAccountId, teenAccountId);
  assert.deepEqual(afterFamilyErasure.plan.requiredLearnerIdentityReviews,
    [{ learnerId: ids.child, eraseIfNoIndependentBasis: true }],
    'global identity disposition still requires current custody evidence after scoped erasure');
}

console.log('Independent account context, rights, revocation, custody, closure, erasure and recovery acceptance passed.');
