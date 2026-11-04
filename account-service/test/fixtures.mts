import type { AccountAction, AccountRequest, AccountSnapshot, AuthorityReceipt, DeviceSession, LearningRecord } from '../src/model.ts';

const opaque = (name: string) => name.padEnd(28, '_');
export const ACCOUNT_TEST_NOW = 1_800_000_000;
export const accountFixtureIds = Object.fromEntries([
  'adult', 'otherAdult', 'adultLearner', 'child', 'otherChild', 'personal', 'otherPersonal', 'family', 'school', 'otherSchool',
  'personalIdentity', 'schoolIdentity', 'otherIdentity', 'personalAuthority', 'familyAuthority', 'guardianAuthority', 'privacyAuthority',
  'schoolAuthority', 'enrollmentAuthority', 'sharingAuthority', 'otherEnrollmentAuthority',
  'familyMember', 'guardian', 'schoolMember', 'classroom', 'otherClassroom', 'foreignClassroom', 'assignment',
  'enrollment', 'otherEnrollment', 'schoolLink', 'personalRecord', 'familyRecord', 'familyNote', 'grade',
  'schoolAssignment', 'submission', 'foreignGrade', 'personalSession', 'familySession', 'schoolSession', 'childSession',
].map(name => [name, opaque(name)])) as Record<
  'adult' | 'otherAdult' | 'adultLearner' | 'child' | 'otherChild' | 'personal' | 'otherPersonal' | 'family' | 'school' | 'otherSchool' |
  'personalIdentity' | 'schoolIdentity' | 'otherIdentity' | 'personalAuthority' | 'familyAuthority' | 'guardianAuthority' | 'privacyAuthority' |
  'schoolAuthority' | 'enrollmentAuthority' | 'sharingAuthority' | 'otherEnrollmentAuthority' |
  'familyMember' | 'guardian' | 'schoolMember' | 'classroom' | 'otherClassroom' | 'foreignClassroom' | 'assignment' |
  'enrollment' | 'otherEnrollment' | 'schoolLink' | 'personalRecord' | 'familyRecord' | 'familyNote' | 'grade' |
  'schoolAssignment' | 'submission' | 'foreignGrade' | 'personalSession' | 'familySession' | 'schoolSession' | 'childSession', string>;

export function accountFixture(now = ACCOUNT_TEST_NOW): AccountSnapshot {
  const i = accountFixtureIds, effective = { startsAt: now - 1000, expiresAt: now + 1000 }, base = { version: 1, status: 'active' as const };
  const authority = (id: string, kind: AuthorityReceipt['kind'], workspaceId: string, accountId: string | null, learnerId: string | null, purpose: AuthorityReceipt['purposes'][number]): AuthorityReceipt =>
    ({ ...base, id, kind, workspaceId, accountId, learnerId, learnerVersion: learnerId ? 1 : null, purposes: [purpose], ...effective });
  const context = (workspaceId: string, school = false) => ({ workspaceId, workspaceVersion: 1, schoolPolicyVersion: school ? 1 : null });
  const personalAuth = { kind: 'personal' as const, identityId: i.personalIdentity, identityVersion: 1, authenticatedAt: now - 30, assurance: 'mfa' as const };
  const session = (id: string, activeWorkspaceId: string): DeviceSession => ({ ...base, id, principal: { kind: 'account', id: i.adult, version: 1 }, authentication: { ...personalAuth }, activeWorkspaceId,
    contexts: [context(i.personal), context(i.family), context(i.school, true), context(i.otherSchool, true)], issuedAt: now - 30, expiresAt: now + 500 });
  const record = (id: string, workspaceId: string, category: LearningRecord['category'], authorityId: string, learnerId = i.child, classId: string | null = null): LearningRecord =>
    ({ ...base, id, workspaceId, category, authorityId, learnerId, classId, visibility: 'released' });
  return {
    format: 'erudior-private-account-snapshot', version: 1, revision: 7, capturedAt: now,
    accounts: [{ ...base, id: i.adult, ageClass: 'adult' }, { ...base, id: i.otherAdult, ageClass: 'adult' }],
    learners: [
      { ...base, id: i.adultLearner, accountId: i.adult, ageBand: 'adult', guardianAccess: 'independent' },
      { ...base, id: i.child, accountId: null, ageBand: 'under-13', guardianAccess: 'guardian-managed' },
      { ...base, id: i.otherChild, accountId: null, ageBand: '13-17', guardianAccess: 'guardian-managed' },
    ],
    identities: [
      { ...base, id: i.personalIdentity, accountId: i.adult, issuer: 'https://personal.example', subject: 'synthetic-person', trust: 'personal', schoolId: null },
      { ...base, id: i.schoolIdentity, accountId: i.adult, issuer: 'https://school.example', subject: 'synthetic-staff', trust: 'school', schoolId: i.school },
      { ...base, id: i.otherIdentity, accountId: i.otherAdult, issuer: 'https://personal.example', subject: 'synthetic-other', trust: 'personal', schoolId: null },
    ],
    workspaces: [
      { ...base, id: i.personal, kind: 'personal', ownerAccountId: i.adult, verified: true, schoolPolicy: null },
      { ...base, id: i.otherPersonal, kind: 'personal', ownerAccountId: i.otherAdult, verified: true, schoolPolicy: null },
      { ...base, id: i.family, kind: 'family', ownerAccountId: null, verified: true, schoolPolicy: null },
      { ...base, id: i.school, kind: 'school', ownerAccountId: null, verified: true, schoolPolicy: { version: 1, allowedSources: ['school'], minimumAssurance: 'mfa', maxAuthenticationAgeSeconds: 600 } },
      { ...base, id: i.otherSchool, kind: 'school', ownerAccountId: null, verified: true, schoolPolicy: { version: 1, allowedSources: ['school'], minimumAssurance: 'mfa', maxAuthenticationAgeSeconds: 600 } },
    ],
    authorities: [
      authority(i.personalAuthority, 'adult-self', i.personal, i.adult, i.adultLearner, 'independent-learning'),
      authority(i.familyAuthority, 'verified-guardian', i.family, i.adult, null, 'family-administration'),
      authority(i.guardianAuthority, 'verified-guardian', i.family, i.adult, i.child, 'family-learning'),
      authority(i.privacyAuthority, 'verified-guardian', i.family, i.adult, i.child, 'family-privacy'),
      authority(i.schoolAuthority, 'verified-school', i.school, i.adult, null, 'school-administration'),
      authority(i.enrollmentAuthority, 'verified-school', i.school, null, i.child, 'school-learning'),
      authority(i.sharingAuthority, 'verified-school', i.school, i.adult, i.child, 'school-family-sharing'),
      authority(i.otherEnrollmentAuthority, 'verified-school', i.otherSchool, null, i.otherChild, 'school-learning'),
    ],
    familyMemberships: [{ ...base, id: i.familyMember, familyId: i.family, accountId: i.adult, role: 'steward', authorityId: i.familyAuthority, ...effective }],
    guardians: [{ ...base, id: i.guardian, familyId: i.family, accountId: i.adult, learnerId: i.child, authorityId: i.guardianAuthority, privacyAuthorityId: i.privacyAuthority,
      actions: ['record.read', 'record.write', 'record.export', 'guardian.change', 'device.pair', 'learner.erase'], categories: ['practice', 'assignment', 'submission', 'grade', 'attendance', 'family-note', 'accommodation'], ...effective }],
    schoolMemberships: [{ ...base, id: i.schoolMember, schoolId: i.school, accountId: i.adult, role: 'teacher', authorityId: i.schoolAuthority, administrativeActions: [], ...effective }],
    classes: [{ ...base, id: i.classroom, schoolId: i.school }, { ...base, id: i.otherClassroom, schoolId: i.school }, { ...base, id: i.foreignClassroom, schoolId: i.otherSchool }],
    teachingAssignments: [{ ...base, id: i.assignment, membershipId: i.schoolMember, classId: i.classroom, actions: ['record.read', 'record.write', 'record.export', 'grade.publish'], categories: ['assignment', 'submission', 'grade', 'attendance'], ...effective }],
    enrollments: [
      { ...base, id: i.enrollment, schoolId: i.school, classId: i.classroom, learnerId: i.child, schoolLearnerId: opaque('school-local-child'), authorityId: i.enrollmentAuthority, ...effective },
      { ...base, id: i.otherEnrollment, schoolId: i.otherSchool, classId: i.foreignClassroom, learnerId: i.otherChild, schoolLearnerId: opaque('foreign-local-child'), authorityId: i.otherEnrollmentAuthority, ...effective },
    ],
    familySchoolLinks: [{ ...base, id: i.schoolLink, guardianRelationshipId: i.guardian, enrollmentId: i.enrollment, authorityId: i.sharingAuthority, categories: ['grade', 'assignment'], ...effective }],
    records: [
      record(i.personalRecord, i.personal, 'practice', i.personalAuthority, i.adultLearner),
      record(i.familyRecord, i.family, 'practice', i.guardianAuthority),
      { ...record(i.familyNote, i.family, 'family-note', i.guardianAuthority), visibility: 'private' },
      record(i.grade, i.school, 'grade', i.enrollmentAuthority, i.child, i.classroom),
      { ...record(i.schoolAssignment, i.school, 'assignment', i.enrollmentAuthority, i.child, i.classroom), visibility: 'private' },
      record(i.submission, i.school, 'submission', i.enrollmentAuthority, i.child, i.classroom),
      record(i.foreignGrade, i.otherSchool, 'grade', i.otherEnrollmentAuthority, i.otherChild, i.foreignClassroom),
    ],
    sessions: [
      session(i.personalSession, i.personal), session(i.familySession, i.family),
      { ...session(i.schoolSession, i.school), authentication: { kind: 'school', schoolId: i.school, identityId: i.schoolIdentity, identityVersion: 1, authenticatedAt: now - 30, assurance: 'mfa' }, contexts: [context(i.school, true)] },
      { ...base, id: i.childSession, principal: { kind: 'learner', id: i.child, version: 1 }, authentication: { kind: 'restricted-learner', authorityId: i.guardianAuthority, authorityVersion: 1, authenticatedAt: now - 30 }, activeWorkspaceId: i.family, contexts: [context(i.family)], issuedAt: now - 30, expiresAt: now + 500 },
    ],
  };
}

export function accountRequest(snapshot: AccountSnapshot, action: AccountAction, sessionId: string, kind: AccountRequest['target']['kind'], id: string): AccountRequest {
  const session = snapshot.sessions.find(x => x.id === sessionId)!;
  const collection = kind === 'account' ? snapshot.accounts : kind === 'learner' ? snapshot.learners : kind === 'record' ? snapshot.records : snapshot.workspaces;
  return { sessionId, sessionVersion: session.version, snapshotRevision: snapshot.revision, workspaceId: session.activeWorkspaceId,
    action, target: { kind, id, version: collection.find(x => x.id === id)?.version ?? 1 } };
}
