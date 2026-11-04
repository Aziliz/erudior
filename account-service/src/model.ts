/**
 * Private account contracts. This package has no provider, database, HTTP route or
 * production binding. A valid object is NOT authenticated evidence.
 *
 * A future server must load the entire relevant authorization graph in one
 * transaction from trusted stores, verify provider/consent evidence independently,
 * and recheck its revisions atomically with the protected operation. Never parse
 * request JSON into AccountSnapshot and treat it as an authenticated snapshot.
 */

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };
export type AccountAction =
  | 'record.read' | 'record.write' | 'record.export' | 'grade.publish'
  | 'family.manage' | 'school.manage' | 'guardian.change' | 'device.pair'
  | 'learner.erase' | 'account.close' | 'account.recovery.change';
export type RecordCategory = 'practice' | 'assignment' | 'submission' | 'grade' | 'attendance' | 'family-note' | 'accommodation';
export type AuthorityPurpose = 'independent-learning' | 'family-learning' | 'family-privacy' | 'family-administration' | 'school-learning' | 'school-administration' | 'school-family-sharing';
export type Assurance = 'single-factor' | 'mfa';
export type WorkspaceKind = 'personal' | 'family' | 'school';

export interface Account {
  id: string; version: number; status: 'active' | 'suspended' | 'closing' | 'erased';
  ageClass: 'adult' | 'minor' | 'unresolved';
}
export interface Learner {
  id: string; version: number; status: 'active' | 'suspended' | 'erasing' | 'erased';
  accountId: string | null; ageBand: 'under-13' | '13-17' | 'adult' | 'unresolved';
  /** Server-resolved rights state. Age alone cannot authorize continuing sharing. */
  guardianAccess: 'guardian-managed' | 'independent' | 'unresolved';
}
export interface ExternalIdentity {
  id: string; version: number; accountId: string; issuer: string; subject: string;
  trust: 'personal' | 'school'; schoolId: string | null; status: 'active' | 'revoked';
}
export interface SchoolSignInPolicy {
  version: number; allowedSources: ('personal' | 'school')[];
  minimumAssurance: Assurance; maxAuthenticationAgeSeconds: number;
}
export interface Workspace {
  id: string; version: number; kind: WorkspaceKind; status: 'active' | 'suspended' | 'closed';
  ownerAccountId: string | null; verified: boolean; schoolPolicy: SchoolSignInPolicy | null;
}
export interface AuthorityReceipt {
  id: string; version: number; status: 'active' | 'withdrawn' | 'expired';
  kind: 'adult-self' | 'learner-self' | 'verified-guardian' | 'verified-school';
  workspaceId: string; accountId: string | null; learnerId: string | null; learnerVersion: number | null;
  purposes: AuthorityPurpose[]; startsAt: number; expiresAt: number;
}
export interface FamilyMembership {
  id: string; version: number; familyId: string; accountId: string;
  role: 'guardian' | 'steward'; status: 'active' | 'revoked'; authorityId: string;
  startsAt: number; expiresAt: number;
}
export interface GuardianRelationship {
  id: string; version: number; familyId: string; accountId: string; learnerId: string;
  status: 'active' | 'revoked'; authorityId: string; privacyAuthorityId: string | null; actions: AccountAction[];
  categories: RecordCategory[]; startsAt: number; expiresAt: number;
}
export interface SchoolMembership {
  id: string; version: number; schoolId: string; accountId: string;
  role: 'teacher' | 'assistant' | 'administrator'; status: 'active' | 'revoked';
  authorityId: string; administrativeActions: ('school.manage')[];
  startsAt: number; expiresAt: number;
}
export interface SchoolClass {
  id: string; version: number; schoolId: string; status: 'active' | 'closed';
}
export interface TeachingAssignment {
  id: string; version: number; membershipId: string; classId: string;
  status: 'active' | 'revoked'; actions: AccountAction[]; categories: RecordCategory[];
  startsAt: number; expiresAt: number;
}
export interface Enrollment {
  id: string; version: number; schoolId: string; classId: string; learnerId: string;
  /** This school-local ID is never a public/global learner lookup key. */
  schoolLearnerId: string; status: 'active' | 'revoked'; authorityId: string;
  startsAt: number; expiresAt: number;
}
export interface FamilySchoolLink {
  id: string; version: number; guardianRelationshipId: string; enrollmentId: string;
  status: 'active' | 'revoked'; authorityId: string; categories: RecordCategory[];
  startsAt: number; expiresAt: number;
}
export interface LearningRecord {
  id: string; version: number; learnerId: string; workspaceId: string; classId: string | null;
  category: RecordCategory; visibility: 'private' | 'released';
  status: 'active' | 'erasing' | 'erased'; authorityId: string;
}
export type Authentication =
  | { kind: 'personal'; identityId: string; identityVersion: number; authenticatedAt: number; assurance: Assurance }
  | { kind: 'school'; schoolId: string; identityId: string; identityVersion: number; authenticatedAt: number; assurance: Assurance }
  | { kind: 'restricted-learner'; authorityId: string; authorityVersion: number; authenticatedAt: number };
export interface SessionContext {
  workspaceId: string; workspaceVersion: number; schoolPolicyVersion: number | null;
}
export interface DeviceSession {
  id: string; version: number; status: 'active' | 'revoked';
  principal: { kind: 'account' | 'learner'; id: string; version: number };
  authentication: Authentication; activeWorkspaceId: string; contexts: SessionContext[];
  issuedAt: number; expiresAt: number;
}
export interface AccountSnapshot {
  /** revision must change for every relevant state change, including policy/rights changes. */
  format: 'erudior-private-account-snapshot'; version: 1; revision: number; capturedAt: number;
  accounts: Account[]; learners: Learner[]; identities: ExternalIdentity[]; workspaces: Workspace[];
  authorities: AuthorityReceipt[]; familyMemberships: FamilyMembership[]; guardians: GuardianRelationship[];
  schoolMemberships: SchoolMembership[]; classes: SchoolClass[]; teachingAssignments: TeachingAssignment[];
  enrollments: Enrollment[]; familySchoolLinks: FamilySchoolLink[]; records: LearningRecord[]; sessions: DeviceSession[];
}
export interface AccountRequest {
  sessionId: string; sessionVersion: number; snapshotRevision: number; workspaceId: string;
  action: AccountAction; target: { kind: 'account' | 'learner' | 'record' | 'workspace'; id: string; version: number };
}

export const ACCOUNT_ACTIONS: readonly AccountAction[] = Object.freeze([
  'record.read', 'record.write', 'record.export', 'grade.publish', 'family.manage', 'school.manage',
  'guardian.change', 'device.pair', 'learner.erase', 'account.close', 'account.recovery.change',
]);
export const ACCOUNT_RECORD_CATEGORIES: readonly RecordCategory[] = Object.freeze([
  'practice', 'assignment', 'submission', 'grade', 'attendance', 'family-note', 'accommodation',
]);
const PURPOSES: readonly AuthorityPurpose[] = ['independent-learning', 'family-learning', 'family-privacy', 'family-administration', 'school-learning', 'school-administration', 'school-family-sharing'];
export const ACCOUNT_POLICY = Object.freeze({ snapshotMaxAgeSeconds: 5, sensitiveAuthenticationAgeSeconds: 300, authenticationMaxAgeSeconds: 43_200, maximumSessionSeconds: 2_592_000 });

export function isAccountId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{15,127}$/.test(value);
}
export function isAccountTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 253_402_300_799;
}
export function isAccountVersion(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 1;
}

function invalid(field: string): never { throw new Error('Invalid account contract: ' + field); }
function object(value: unknown, fields: readonly string[]): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
    Object.keys(value).length !== fields.length || fields.some(k => !Object.hasOwn(value, k))) invalid('object fields');
}
function oneOf(value: unknown, values: readonly unknown[]): void { if (!values.includes(value)) invalid('enum'); }
function id(value: unknown): void { if (!isAccountId(value)) invalid('opaque identifier'); }
function nullableId(value: unknown): void { if (value !== null) id(value); }
function revision(value: unknown): void { if (!isAccountVersion(value)) invalid('revision'); }
function time(value: unknown): void { if (!isAccountTimestamp(value)) invalid('time'); }
function bool(value: unknown): void { if (typeof value !== 'boolean') invalid('boolean'); }
function window(value: Record<string, unknown>): void {
  time(value.startsAt); time(value.expiresAt);
  if ((value.expiresAt as number) <= (value.startsAt as number)) invalid('effective window');
}
function choices(value: unknown, values: readonly unknown[], allowEmpty = false): void {
  if (!Array.isArray(value) || (!allowEmpty && !value.length) || value.length > values.length || new Set(value).size !== value.length) invalid('scope set');
  for (const item of value) oneOf(item, values);
}
function entities(value: unknown, validate: (item: unknown) => void): void {
  if (!Array.isArray(value) || value.length > 10_000) invalid('collection bounds');
  for (const item of value) validate(item);
}
function common(value: Record<string, unknown>, statuses: string[]): void { id(value.id); revision(value.version); oneOf(value.status, statuses); }
function relationship(value: unknown, fields: string[]): asserts value is Record<string, unknown> {
  object(value, ['id', 'version', 'status', 'startsAt', 'expiresAt', ...fields]);
  common(value, ['active', 'revoked']); window(value);
}

function validateSnapshotShape(raw: unknown): asserts raw is AccountSnapshot {
  object(raw, ['format', 'version', 'revision', 'capturedAt', 'accounts', 'learners', 'identities', 'workspaces', 'authorities', 'familyMemberships', 'guardians', 'schoolMemberships', 'classes', 'teachingAssignments', 'enrollments', 'familySchoolLinks', 'records', 'sessions']);
  if (raw.format !== 'erudior-private-account-snapshot' || raw.version !== 1) invalid('snapshot format');
  revision(raw.revision); time(raw.capturedAt);
  entities(raw.accounts, v => { object(v, ['id', 'version', 'status', 'ageClass']); common(v, ['active', 'suspended', 'closing', 'erased']); oneOf(v.ageClass, ['adult', 'minor', 'unresolved']); });
  entities(raw.learners, v => { object(v, ['id', 'version', 'status', 'accountId', 'ageBand', 'guardianAccess']); common(v, ['active', 'suspended', 'erasing', 'erased']); nullableId(v.accountId); oneOf(v.ageBand, ['under-13', '13-17', 'adult', 'unresolved']); oneOf(v.guardianAccess, ['guardian-managed', 'independent', 'unresolved']); if (v.ageBand === 'adult' && v.guardianAccess === 'guardian-managed') invalid('adult rights state'); });
  entities(raw.identities, v => {
    object(v, ['id', 'version', 'accountId', 'issuer', 'subject', 'trust', 'schoolId', 'status']); common(v, ['active', 'revoked']); id(v.accountId); nullableId(v.schoolId); oneOf(v.trust, ['personal', 'school']);
    if (typeof v.issuer !== 'string' || v.issuer.length > 2048 || !/^https:\/\/[^\s]+$/.test(v.issuer)) invalid('identity issuer');
    const issuer = new URL(v.issuer); if (issuer.username || issuer.password || issuer.search || issuer.hash) invalid('identity issuer');
    if (typeof v.subject !== 'string' || v.subject.length < 1 || v.subject.length > 255 || /[\u0000-\u0020\u007f]/.test(v.subject)) invalid('identity subject');
    if ((v.trust === 'personal') !== (v.schoolId === null)) invalid('identity trust domain');
  });
  entities(raw.workspaces, v => {
    object(v, ['id', 'version', 'kind', 'status', 'ownerAccountId', 'verified', 'schoolPolicy']); common(v, ['active', 'suspended', 'closed']); oneOf(v.kind, ['personal', 'family', 'school']); nullableId(v.ownerAccountId); bool(v.verified);
    if ((v.kind === 'personal') !== (v.ownerAccountId !== null)) invalid('workspace owner');
    if (v.kind === 'school') {
      object(v.schoolPolicy, ['version', 'allowedSources', 'minimumAssurance', 'maxAuthenticationAgeSeconds']);
      revision(v.schoolPolicy.version); choices(v.schoolPolicy.allowedSources, ['personal', 'school']); oneOf(v.schoolPolicy.minimumAssurance, ['single-factor', 'mfa']);
      if (!isAccountVersion(v.schoolPolicy.maxAuthenticationAgeSeconds) || v.schoolPolicy.maxAuthenticationAgeSeconds > ACCOUNT_POLICY.authenticationMaxAgeSeconds) invalid('school authentication age');
    } else if (v.schoolPolicy !== null) invalid('non-school policy');
  });
  entities(raw.authorities, v => {
    object(v, ['id', 'version', 'status', 'kind', 'workspaceId', 'accountId', 'learnerId', 'learnerVersion', 'purposes', 'startsAt', 'expiresAt']); common(v, ['active', 'withdrawn', 'expired']);
    oneOf(v.kind, ['adult-self', 'learner-self', 'verified-guardian', 'verified-school']); id(v.workspaceId); nullableId(v.accountId); nullableId(v.learnerId); if (v.learnerVersion !== null) revision(v.learnerVersion); if ((v.learnerId === null) !== (v.learnerVersion === null)) invalid('learner authority revision'); choices(v.purposes, PURPOSES); window(v);
  });
  entities(raw.familyMemberships, v => { relationship(v, ['familyId', 'accountId', 'role', 'authorityId']); id(v.familyId); id(v.accountId); id(v.authorityId); oneOf(v.role, ['guardian', 'steward']); });
  entities(raw.guardians, v => { relationship(v, ['familyId', 'accountId', 'learnerId', 'authorityId', 'privacyAuthorityId', 'actions', 'categories']); id(v.familyId); id(v.accountId); id(v.learnerId); id(v.authorityId); nullableId(v.privacyAuthorityId); choices(v.actions, ['record.read', 'record.write', 'record.export', 'guardian.change', 'device.pair', 'learner.erase']); choices(v.categories, ACCOUNT_RECORD_CATEGORIES); });
  entities(raw.schoolMemberships, v => { relationship(v, ['schoolId', 'accountId', 'role', 'authorityId', 'administrativeActions']); id(v.schoolId); id(v.accountId); id(v.authorityId); oneOf(v.role, ['teacher', 'assistant', 'administrator']); choices(v.administrativeActions, ['school.manage'], true); if (v.role !== 'administrator' && (v.administrativeActions as unknown[]).length) invalid('administrative scope'); });
  entities(raw.classes, v => { object(v, ['id', 'version', 'schoolId', 'status']); common(v, ['active', 'closed']); id(v.schoolId); });
  entities(raw.teachingAssignments, v => { relationship(v, ['membershipId', 'classId', 'actions', 'categories']); id(v.membershipId); id(v.classId); choices(v.actions, ['record.read', 'record.write', 'record.export', 'grade.publish']); choices(v.categories, ACCOUNT_RECORD_CATEGORIES); });
  entities(raw.enrollments, v => { relationship(v, ['schoolId', 'classId', 'learnerId', 'schoolLearnerId', 'authorityId']); id(v.schoolId); id(v.classId); id(v.learnerId); id(v.schoolLearnerId); id(v.authorityId); });
  entities(raw.familySchoolLinks, v => { relationship(v, ['guardianRelationshipId', 'enrollmentId', 'authorityId', 'categories']); id(v.guardianRelationshipId); id(v.enrollmentId); id(v.authorityId); choices(v.categories, ['assignment', 'submission', 'grade', 'attendance']); });
  entities(raw.records, v => { object(v, ['id', 'version', 'learnerId', 'workspaceId', 'classId', 'category', 'visibility', 'status', 'authorityId']); common(v, ['active', 'erasing', 'erased']); id(v.learnerId); id(v.workspaceId); nullableId(v.classId); id(v.authorityId); oneOf(v.category, ACCOUNT_RECORD_CATEGORIES); oneOf(v.visibility, ['private', 'released']); });
  entities(raw.sessions, v => {
    object(v, ['id', 'version', 'status', 'principal', 'authentication', 'activeWorkspaceId', 'contexts', 'issuedAt', 'expiresAt']); common(v, ['active', 'revoked']); id(v.activeWorkspaceId); time(v.issuedAt); time(v.expiresAt);
    if ((v.expiresAt as number) <= (v.issuedAt as number) || (v.expiresAt as number) - (v.issuedAt as number) > ACCOUNT_POLICY.maximumSessionSeconds) invalid('session lifetime');
    object(v.principal, ['kind', 'id', 'version']); oneOf(v.principal.kind, ['account', 'learner']); id(v.principal.id); revision(v.principal.version);
    const a = v.authentication;
    if (!a || typeof a !== 'object') invalid('authentication');
    const kind = (a as Record<string, unknown>).kind;
    if (kind === 'restricted-learner') {
      object(a, ['kind', 'authorityId', 'authorityVersion', 'authenticatedAt']); id(a.authorityId); revision(a.authorityVersion);
      if (v.principal.kind !== 'learner') invalid('restricted principal');
    } else {
      object(a, kind === 'school' ? ['kind', 'schoolId', 'identityId', 'identityVersion', 'authenticatedAt', 'assurance'] : ['kind', 'identityId', 'identityVersion', 'authenticatedAt', 'assurance']);
      oneOf(a.kind, ['personal', 'school']); id(a.identityId); revision(a.identityVersion); oneOf(a.assurance, ['single-factor', 'mfa']);
      if (a.kind === 'school') id(a.schoolId);
      if (v.principal.kind !== 'account') invalid('identity principal');
    }
    time(a.authenticatedAt); if ((a.authenticatedAt as number) > (v.issuedAt as number)) invalid('authentication time');
    if (!Array.isArray(v.contexts) || v.contexts.length < 1 || v.contexts.length > 128) invalid('context bounds');
    const seen = new Set();
    for (const c of v.contexts) { object(c, ['workspaceId', 'workspaceVersion', 'schoolPolicyVersion']); id(c.workspaceId); revision(c.workspaceVersion); if (c.schoolPolicyVersion !== null) revision(c.schoolPolicyVersion); if (seen.has(c.workspaceId)) invalid('duplicate context'); seen.add(c.workspaceId); }
  });
}

function validateReferences(s: AccountSnapshot): void {
  const all = [s.accounts, s.learners, s.identities, s.workspaces, s.authorities, s.familyMemberships, s.guardians, s.schoolMemberships, s.classes, s.teachingAssignments, s.enrollments, s.familySchoolLinks, s.records, s.sessions].flat();
  if (new Set(all.map(x => x.id)).size !== all.length) invalid('duplicate entity identifier');
  const account = (key: string) => s.accounts.find(x => x.id === key) ?? invalid('account reference');
  const learner = (key: string) => s.learners.find(x => x.id === key) ?? invalid('learner reference');
  const workspace = (key: string, kind?: WorkspaceKind) => { const v = s.workspaces.find(x => x.id === key); if (!v || kind && v.kind !== kind) return invalid('workspace reference'); return v; };
  const authority = (key: string) => s.authorities.find(x => x.id === key) ?? invalid('authority reference');
  const klass = (key: string) => s.classes.find(x => x.id === key) ?? invalid('class reference');
  const members = (key: string) => s.schoolMemberships.find(x => x.id === key) ?? invalid('membership reference');
  const guard = (key: string) => s.guardians.find(x => x.id === key) ?? invalid('guardian reference');
  const enroll = (key: string) => s.enrollments.find(x => x.id === key) ?? invalid('enrollment reference');
  const match = (condition: boolean) => { if (!condition) invalid('relationship binding'); };
  for (const l of s.learners) if (l.accountId !== null) account(l.accountId);
  const linkedAccounts = s.learners.flatMap(x => x.accountId ? [x.accountId] : []);
  match(new Set(linkedAccounts).size === linkedAccounts.length);
  const external = new Set<string>();
  for (const i of s.identities) { account(i.accountId); if (i.schoolId) workspace(i.schoolId, 'school'); const key = JSON.stringify([i.issuer, i.subject]); if (external.has(key)) invalid('duplicate issuer subject'); external.add(key); }
  for (const w of s.workspaces) if (w.ownerAccountId) account(w.ownerAccountId);
  const personalOwners = s.workspaces.flatMap(x => x.ownerAccountId ? [x.ownerAccountId] : []);
  match(new Set(personalOwners).size === personalOwners.length);
  for (const a of s.authorities) {
    const w = workspace(a.workspaceId); if (a.accountId) account(a.accountId); if (a.learnerId) learner(a.learnerId);
    match(a.purposes.length === 1);
    if (a.kind === 'verified-school') {
      match(w.kind === 'school');
      if (a.purposes[0] === 'school-learning') match(a.accountId === null && a.learnerId !== null);
      else if (a.purposes[0] === 'school-administration') match(a.accountId !== null && a.learnerId === null);
      else match(a.purposes[0] === 'school-family-sharing' && a.accountId !== null && a.learnerId !== null);
    } else if (a.kind === 'verified-guardian') {
      match(w.kind === 'family' && a.accountId !== null);
      match(a.learnerId === null ? a.purposes[0] === 'family-administration' : ['family-learning', 'family-privacy'].includes(a.purposes[0]));
    } else match(w.kind === 'personal' && a.accountId === w.ownerAccountId && a.learnerId !== null && learner(a.learnerId).accountId === a.accountId && a.purposes[0] === 'independent-learning');
  }
  for (const m of s.familyMemberships) { workspace(m.familyId, 'family'); account(m.accountId); const a = authority(m.authorityId); match(a.kind === 'verified-guardian' && a.workspaceId === m.familyId && a.accountId === m.accountId && a.learnerId === null); }
  for (const g of s.guardians) {
    workspace(g.familyId, 'family'); account(g.accountId); learner(g.learnerId); const a = authority(g.authorityId);
    match(a.kind === 'verified-guardian' && a.workspaceId === g.familyId && a.accountId === g.accountId && a.learnerId === g.learnerId && a.purposes[0] === 'family-learning');
    if (g.privacyAuthorityId !== null) { const p = authority(g.privacyAuthorityId); match(p.kind === 'verified-guardian' && p.workspaceId === g.familyId && p.accountId === g.accountId && p.learnerId === g.learnerId && p.purposes[0] === 'family-privacy'); }
  }
  for (const m of s.schoolMemberships) { workspace(m.schoolId, 'school'); account(m.accountId); const a = authority(m.authorityId); match(a.kind === 'verified-school' && a.workspaceId === m.schoolId && a.accountId === m.accountId && a.learnerId === null); }
  for (const c of s.classes) workspace(c.schoolId, 'school');
  for (const t of s.teachingAssignments) match(members(t.membershipId).schoolId === klass(t.classId).schoolId);
  const schoolIds = new Map<string, string>();
  for (const e of s.enrollments) {
    workspace(e.schoolId, 'school'); learner(e.learnerId); const a = authority(e.authorityId);
    match(klass(e.classId).schoolId === e.schoolId && a.kind === 'verified-school' && a.workspaceId === e.schoolId && a.learnerId === e.learnerId);
    const key = JSON.stringify([e.schoolId, e.schoolLearnerId]); const prior = schoolIds.get(key); match(!prior || prior === e.learnerId); schoolIds.set(key, e.learnerId);
  }
  for (const l of s.familySchoolLinks) { const g = guard(l.guardianRelationshipId), e = enroll(l.enrollmentId), a = authority(l.authorityId); match(g.learnerId === e.learnerId && a.kind === 'verified-school' && a.workspaceId === e.schoolId && a.accountId === g.accountId && a.learnerId === e.learnerId); }
  for (const r of s.records) {
    learner(r.learnerId); const w = workspace(r.workspaceId), a = authority(r.authorityId);
    match(a.workspaceId === w.id && a.learnerId === r.learnerId);
    if (w.kind === 'school') match(r.classId !== null && klass(r.classId).schoolId === w.id && r.category !== 'family-note');
    else match(r.classId === null);
    if (w.kind === 'personal') match(learner(r.learnerId).accountId === w.ownerAccountId);
  }
  for (const s1 of s.sessions) {
    if (s1.principal.kind === 'account') account(s1.principal.id); else learner(s1.principal.id);
    workspace(s1.activeWorkspaceId); match(s1.contexts.some(x => x.workspaceId === s1.activeWorkspaceId));
    for (const c of s1.contexts) { const w = workspace(c.workspaceId); match((w.kind === 'school') === (c.schoolPolicyVersion !== null)); }
    const a = s1.authentication;
    if (a.kind === 'restricted-learner') { const receipt = authority(a.authorityId); match(receipt.learnerId === s1.principal.id && receipt.workspaceId === s1.activeWorkspaceId); match(s1.contexts.length === 1); }
    else { const identity = s.identities.find(x => x.id === a.identityId) ?? invalid('session identity reference'); match(identity.accountId === s1.principal.id && identity.trust === a.kind); if (a.kind === 'school') match(identity.schoolId === a.schoolId && s1.contexts.every(c => c.workspaceId === a.schoolId)); }
  }
}

export function validateAccountSnapshot(input: unknown): ValidationResult<AccountSnapshot> {
  try { validateSnapshotShape(input); validateReferences(input); return { ok: true, value: structuredClone(input) }; }
  catch { return { ok: false, error: 'invalid-account-snapshot' }; }
}
export function validateAccountRequest(input: unknown): ValidationResult<AccountRequest> {
  try {
    object(input, ['sessionId', 'sessionVersion', 'snapshotRevision', 'workspaceId', 'action', 'target']); id(input.sessionId); revision(input.sessionVersion); revision(input.snapshotRevision); id(input.workspaceId); oneOf(input.action, ACCOUNT_ACTIONS);
    object(input.target, ['kind', 'id', 'version']); oneOf(input.target.kind, ['account', 'learner', 'record', 'workspace']); id(input.target.id); revision(input.target.version);
    return { ok: true, value: structuredClone(input) as unknown as AccountRequest };
  } catch { return { ok: false, error: 'invalid-account-request' }; }
}
