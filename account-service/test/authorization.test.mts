import assert from 'node:assert/strict';
import { authorizeAccountOperation } from '../src/authorization.ts';
import { ACCOUNT_RECORD_CATEGORIES, type AccountRequest, type AccountSnapshot } from '../src/model.ts';
import { accountFixture, accountFixtureIds as i, accountRequest, ACCOUNT_TEST_NOW as now } from './fixtures.mts';

let scenarios = 0;
function check(label: string, action: AccountRequest['action'], sessionId: string, kind: AccountRequest['target']['kind'], targetId: string,
  allowed: boolean, change: (s: AccountSnapshot, r: AccountRequest) => void = () => {}) {
  const s = accountFixture(), request = accountRequest(s, action, sessionId, kind, targetId);
  change(s, request); const result = authorizeAccountOperation(s, request, now);
  assert.equal(result.allowed, allowed, label + ': ' + JSON.stringify(result)); scenarios++;
  if (result.allowed) {
    assert.equal(result.action, action); assert.equal(result.sessionId, sessionId); assert.deepEqual(result.target, request.target);
    assert.equal(result.snapshotRevision, s.revision); assert.ok(result.validUntil > now);
    assert.ok(result.revisionGuards.some(g => g.id === targetId && g.version === request.target.version));
  }
}

check('Own Personal practice read', 'record.read', i.personalSession, 'record', i.personalRecord, true);
check('Own mutable practice write', 'record.write', i.personalSession, 'record', i.personalRecord, true);
check('Current guardian Family read', 'record.read', i.familySession, 'record', i.familyRecord, true);
check('Guardian private family note', 'record.write', i.familySession, 'record', i.familyNote, true);
check('Assigned teacher grade read', 'record.read', i.schoolSession, 'record', i.grade, true);
check('Explicit grade publication', 'grade.publish', i.schoolSession, 'record', i.grade, true);
check('Teacher assignment write', 'record.write', i.schoolSession, 'record', i.schoolAssignment, true);
check('Family released school summary', 'record.read', i.familySession, 'record', i.grade, true);
check('Restricted learner own released practice', 'record.read', i.childSession, 'record', i.familyRecord, true);
check('Restricted learner own practice write', 'record.write', i.childSession, 'record', i.familyRecord, true);
check('Own account closure with fresh independent Personal authentication', 'account.close', i.personalSession, 'account', i.adult, true);
check('Verified scoped family erasure', 'learner.erase', i.familySession, 'learner', i.child, true);
check('Scoped child device pairing', 'device.pair', i.familySession, 'learner', i.child, true);
check('Steward family administration', 'family.manage', i.familySession, 'workspace', i.family, true);

check('School login cannot read Family', 'record.read', i.schoolSession, 'record', i.familyRecord, false);
check('School login cannot close person', 'account.close', i.schoolSession, 'account', i.adult, false);
check('School login cannot replace personal recovery', 'account.recovery.change', i.schoolSession, 'account', i.adult, false);
check('School login cannot approve child device', 'device.pair', i.schoolSession, 'learner', i.child, false);
check('Personal session cannot silently switch to School', 'record.read', i.personalSession, 'record', i.grade, false,
  (s, r) => { s.sessions.find(x => x.id === i.personalSession)!.activeWorkspaceId = i.school; r.workspaceId = i.school; });
check('Personal method may satisfy explicitly accepted school policy', 'record.read', i.personalSession, 'record', i.grade, true,
  (s, r) => { s.sessions.find(x => x.id === i.personalSession)!.activeWorkspaceId = i.school; r.workspaceId = i.school; s.workspaces.find(x => x.id === i.school)!.schoolPolicy!.allowedSources.push('personal'); });
check('No tenant-wide visibility through teaching role', 'record.read', i.schoolSession, 'record', i.foreignGrade, false);
check('No unassigned class access', 'record.read', i.schoolSession, 'record', i.grade, false,
  s => { s.records.find(x => x.id === i.grade)!.classId = i.otherClassroom; s.enrollments[0].classId = i.otherClassroom; });
check('Revoked class assignment', 'record.read', i.schoolSession, 'record', i.grade, false, s => { s.teachingAssignments[0].status = 'revoked'; });
check('Revoked staff membership', 'record.read', i.schoolSession, 'record', i.grade, false, s => { s.schoolMemberships[0].status = 'revoked'; });
check('Revoked enrollment', 'record.read', i.schoolSession, 'record', i.grade, false, s => { s.enrollments[0].status = 'revoked'; });
check('Expired institutional authority', 'record.read', i.schoolSession, 'record', i.grade, false, s => { s.authorities.find(a => a.id === i.enrollmentAuthority)!.expiresAt = now; });
check('Administrator title alone has no gradebook access', 'record.read', i.schoolSession, 'record', i.grade, false,
  s => { s.schoolMemberships[0].role = 'administrator'; s.schoolMemberships[0].administrativeActions = ['school.manage']; s.teachingAssignments = []; });
check('Explicit administrator operation', 'school.manage', i.schoolSession, 'workspace', i.school, true,
  s => { s.schoolMemberships[0].role = 'administrator'; s.schoolMemberships[0].administrativeActions = ['school.manage']; });
check('Teacher cannot edit immutable submission', 'record.write', i.schoolSession, 'record', i.submission, false);
check('Ordinary record write cannot publish grade', 'record.write', i.schoolSession, 'record', i.grade, false);
check('Family access cannot overwrite institutional grade', 'grade.publish', i.familySession, 'record', i.grade, false);
check('Family sharing is read only, not whole-gradebook export', 'record.export', i.familySession, 'record', i.grade, false);
check('Unreleased school feedback stays private', 'record.read', i.familySession, 'record', i.grade, false, s => { s.records.find(x => x.id === i.grade)!.visibility = 'private'; });
check('School family link revocation applies immediately', 'record.read', i.familySession, 'record', i.grade, false, s => { s.familySchoolLinks[0].status = 'revoked'; });
check('Family link category restriction', 'record.read', i.familySession, 'record', i.grade, false, s => { s.familySchoolLinks[0].categories = ['assignment']; });
check('Guardian cannot claim unrelated learner', 'learner.erase', i.familySession, 'learner', i.otherChild, false);
check('Guardian revocation applies immediately', 'record.read', i.familySession, 'record', i.familyRecord, false, s => { s.guardians[0].status = 'revoked'; });
check('Consent withdrawal stops learning access', 'record.read', i.familySession, 'record', i.familyRecord, false, s => { s.authorities.find(a => a.id === i.guardianAuthority)!.status = 'withdrawn'; });
check('Separate verified privacy authority still permits erasure after withdrawal', 'learner.erase', i.familySession, 'learner', i.child, true,
  s => { s.authorities.find(a => a.id === i.guardianAuthority)!.status = 'withdrawn'; });
check('No separate privacy authority means no erasure grant', 'learner.erase', i.familySession, 'learner', i.child, false, s => { s.guardians[0].privacyAuthorityId = null; });
check('Privacy authority withdrawal blocks unverified erasure', 'learner.erase', i.familySession, 'learner', i.child, false, s => { s.authorities.find(a => a.id === i.privacyAuthority)!.status = 'withdrawn'; });
check('Narrow category grant cannot erase whole family domain', 'learner.erase', i.familySession, 'learner', i.child, false, s => { s.guardians[0].categories = ['practice']; });
check('Partial relationship grants are never unioned for erasure', 'learner.erase', i.familySession, 'learner', i.child, false,
  s => { s.guardians.push({ ...s.guardians[0], id: 'second-guardian-link-0001', categories: ACCOUNT_RECORD_CATEGORIES.filter(c => c !== 'practice') }); s.guardians[0].categories = ['practice']; });
check('Age/rights change invalidates pre-transition authority', 'record.read', i.familySession, 'record', i.familyRecord, false, s => { s.learners.find(l => l.id === i.child)!.version++; });
check('Eligible student rights cannot retain implicit guardian read', 'record.read', i.familySession, 'record', i.familyRecord, false, s => { s.learners.find(l => l.id === i.child)!.guardianAccess = 'independent'; });
check('Unresolved rights deny guardian operations', 'device.pair', i.familySession, 'learner', i.child, false, s => { s.learners.find(l => l.id === i.child)!.guardianAccess = 'unresolved'; });
check('Adult learner continuing sharing is not assumed', 'record.read', i.familySession, 'record', i.familyRecord, false,
  s => { const l = s.learners.find(l => l.id === i.child)!; l.ageBand = 'adult'; l.guardianAccess = 'independent'; });
check('Child cannot read guardian private note', 'record.read', i.childSession, 'record', i.familyNote, false);
check('Child cannot elevate to guardian management', 'family.manage', i.childSession, 'workspace', i.family, false);
check('Child cannot erase profile', 'learner.erase', i.childSession, 'learner', i.child, false);
check('Child cannot pair another device', 'device.pair', i.childSession, 'learner', i.child, false);
check('Under-13 personal account does not imply independent collection consent', 'record.read', i.personalSession, 'record', i.personalRecord, false,
  s => { s.learners.find(l => l.id === i.adultLearner)!.ageBand = 'under-13'; s.accounts[0].ageClass = 'minor'; s.authorities.find(a => a.id === i.personalAuthority)!.kind = 'learner-self'; });

for (const [label, change] of [
  ['revoked device', (s: AccountSnapshot) => { s.sessions.find(x => x.id === i.familySession)!.status = 'revoked'; }],
  ['expired device at boundary', (s: AccountSnapshot) => { s.sessions.find(x => x.id === i.familySession)!.expiresAt = now; }],
  ['suspended principal', (s: AccountSnapshot) => { s.accounts[0].status = 'suspended'; }],
  ['changed principal version', (s: AccountSnapshot) => { s.accounts[0].version++; }],
  ['revoked identity', (s: AccountSnapshot) => { s.identities[0].status = 'revoked'; }],
  ['changed identity version', (s: AccountSnapshot) => { s.identities[0].version++; }],
  ['closed workspace', (s: AccountSnapshot) => { s.workspaces.find(w => w.id === i.family)!.status = 'closed'; }],
  ['stale workspace context', (s: AccountSnapshot) => { s.workspaces.find(w => w.id === i.family)!.version++; }],
  ['stale target', (s: AccountSnapshot) => { s.records.find(r => r.id === i.familyRecord)!.version++; }],
  ['future snapshot', (s: AccountSnapshot) => { s.capturedAt = now + 1; }],
  ['old snapshot', (s: AccountSnapshot) => { s.capturedAt = now - 5; }],
  ['future authentication', (s: AccountSnapshot) => { s.sessions.find(x => x.id === i.familySession)!.authentication.authenticatedAt = now + 1; }],
] as const) check(label, 'record.read', i.familySession, 'record', i.familyRecord, false, change);

check('Stale request revision', 'record.read', i.familySession, 'record', i.familyRecord, false, (_s, r) => { r.snapshotRevision--; });
check('Stale request session', 'record.read', i.familySession, 'record', i.familyRecord, false, (_s, r) => { r.sessionVersion++; });
check('Correct ID with wrong target kind', 'account.close', i.personalSession, 'learner', i.adultLearner, false);
check('Cannot close another account', 'account.close', i.personalSession, 'account', i.otherAdult, false);
check('Sensitive action freshness boundary', 'account.close', i.personalSession, 'account', i.adult, false,
  s => { s.sessions[0].authentication.authenticatedAt = now - 300; });
check('MFA is required for privileged read even if school policy permits password login', 'record.read', i.schoolSession, 'record', i.grade, false,
  s => { const a = s.sessions.find(x => x.id === i.schoolSession)!.authentication; if (a.kind === 'school') a.assurance = 'single-factor'; s.workspaces.find(w => w.id === i.school)!.schoolPolicy!.minimumAssurance = 'single-factor'; });
check('No stale school-policy acceptance', 'record.read', i.schoolSession, 'record', i.grade, false, s => { s.workspaces.find(w => w.id === i.school)!.schoolPolicy!.version++; });

assert.equal(authorizeAccountOperation(null, null, NaN).allowed, false);
assert.equal(authorizeAccountOperation(accountFixture(), { authorized: true }, now).allowed, false);
const policyFixture = accountFixture();
const policyDecision = authorizeAccountOperation(policyFixture, accountRequest(policyFixture, 'record.read', i.schoolSession, 'record', i.grade), now);
assert.ok(policyDecision.allowed);
assert.deepEqual(policyDecision.schoolPolicyGuards, [{ workspaceId: i.school, version: 1 }], 'Separate policy revision is bound alongside entity revisions');
console.log(`Account authorization: ${scenarios} independent scope, context, lifecycle, revocation and privilege scenarios passed.`);
