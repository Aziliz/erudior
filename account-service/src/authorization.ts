import {
  ACCOUNT_POLICY, ACCOUNT_RECORD_CATEGORIES, isAccountTimestamp, validateAccountRequest, validateAccountSnapshot,
  type Account, type AccountAction, type AccountRequest, type AuthorityPurpose,
  type AuthorityReceipt, type DeviceSession, type FamilyMembership, type GuardianRelationship,
  type Learner, type LearningRecord, type SchoolMembership, type Workspace,
} from './model';

export type AuthorizationDecision =
  /** Internal diagnostic codes; future APIs must not reveal target existence through them. */
  | { allowed: false; reason: 'invalid-input' | 'stale-snapshot' | 'stale-request' | 'inactive-session' | 'authentication-required' | 'context-denied' | 'target-denied' | 'permission-denied' }
  | {
    allowed: true; action: AccountAction; sessionId: string; sessionVersion: number; snapshotRevision: number;
    principal: DeviceSession['principal']; workspaceId: string; target: AccountRequest['target'];
    validUntil: number; revisionGuards: { id: string; version: number }[];
    schoolPolicyGuards: { workspaceId: string; version: number }[];
  };

const TARGETS: Record<AccountAction, AccountRequest['target']['kind']> = {
  'record.read': 'record', 'record.write': 'record', 'record.export': 'record', 'grade.publish': 'record',
  'family.manage': 'workspace', 'school.manage': 'workspace', 'guardian.change': 'learner',
  'device.pair': 'learner', 'learner.erase': 'learner', 'account.close': 'account', 'account.recovery.change': 'account',
};
const SENSITIVE = new Set<AccountAction>([
  'record.export', 'grade.publish', 'family.manage', 'school.manage', 'guardian.change',
  'device.pair', 'learner.erase', 'account.close', 'account.recovery.change',
]);

/**
 * A transaction-local policy decision, never an authentication/token verifier.
 * The snapshot must be independently resolved from trusted server stores; a
 * structurally valid client payload does not establish any authority. Never send
 * this graph to clients or accept a previous `allowed` result as a capability.
 * Re-read and enforce ALL returned revisions, policy versions, validUntil and
 * current state atomically with every protected read/write/export, including
 * queues and background work. Every relevant mutation advances snapshot.revision;
 * every changed entity advances its own version. Entity guards alone are not
 * sufficient to reuse a decision or detect newly created/revoked relationships.
 *
 * Supported writes are existing mutable practice/family notes/assignments and
 * explicitly scoped institutional grade publication. This function does not
 * authorize signup, identity linking, role creation, school erasure, attachment
 * transport, or edits to immutable submissions. Those operations need separate
 * audited protocols rather than a wildcard permission.
 */
export function authorizeAccountOperation(snapshotInput: unknown, requestInput: unknown, now: number): AuthorizationDecision {
  const deny = (reason: Extract<AuthorizationDecision, { allowed: false }>['reason']): AuthorizationDecision => ({ allowed: false, reason });
  try {
    if (!isAccountTimestamp(now)) return deny('invalid-input');
    const parsed = validateAccountSnapshot(snapshotInput), requested = validateAccountRequest(requestInput);
    if (!parsed.ok || !requested.ok) return deny('invalid-input');
    const s = parsed.value, r = requested.value;
    if (s.capturedAt > now || s.capturedAt + ACCOUNT_POLICY.snapshotMaxAgeSeconds <= now) return deny('stale-snapshot');
    if (r.snapshotRevision !== s.revision) return deny('stale-request');
    const guards = new Map<string, number>();
    const policies = new Map<string, number>();
    const track = <T extends { id: string; version: number }>(v: T): T => { guards.set(v.id, v.version); return v; };
    const trackWorkspace = (v: Workspace): Workspace => { if (v.schoolPolicy) policies.set(v.id, v.schoolPolicy.version); return track(v); };
    let validUntil = s.capturedAt + ACCOUNT_POLICY.snapshotMaxAgeSeconds;
    const live = (v: { status: string; startsAt: number; expiresAt: number }): boolean => {
      if (v.status !== 'active' || v.startsAt > now || v.expiresAt <= now) return false;
      validUntil = Math.min(validUntil, v.expiresAt); return true;
    };
    const session = s.sessions.find(x => x.id === r.sessionId);
    if (!session || session.status !== 'active' || session.issuedAt > now || session.expiresAt <= now) return deny('inactive-session');
    track(session); validUntil = Math.min(validUntil, session.expiresAt);
    if (session.version !== r.sessionVersion) return deny('stale-request');
    const principal = session.principal.kind === 'account'
      ? s.accounts.find(x => x.id === session.principal.id) : s.learners.find(x => x.id === session.principal.id);
    if (!principal || principal.status !== 'active' || principal.version !== session.principal.version) return deny('inactive-session');
    track(principal);
    const actor = session.principal.kind === 'account' ? principal as Account : null;
    const ownLearner = session.principal.kind === 'learner' ? principal as Learner : s.learners.find(x => x.accountId === actor?.id) ?? null;
    const w = s.workspaces.find(x => x.id === r.workspaceId), context = session.contexts.find(x => x.workspaceId === r.workspaceId);
    if (!w || w.status !== 'active' || !w.verified || !context || session.activeWorkspaceId !== w.id || context.workspaceVersion !== w.version) return deny('context-denied');
    trackWorkspace(w);
    const auth = session.authentication;
    if (auth.authenticatedAt > now || auth.authenticatedAt + ACCOUNT_POLICY.authenticationMaxAgeSeconds <= now) return deny('authentication-required');
    validUntil = Math.min(validUntil, auth.authenticatedAt + ACCOUNT_POLICY.authenticationMaxAgeSeconds);
    if (auth.kind !== 'restricted-learner') {
      const identity = s.identities.find(x => x.id === auth.identityId);
      if (!identity || identity.status !== 'active' || identity.version !== auth.identityVersion || identity.accountId !== actor?.id) return deny('authentication-required');
      track(identity);
      if (auth.kind === 'school' && (w.kind !== 'school' || w.id !== auth.schoolId)) return deny('context-denied');
    }
    if (w.kind === 'personal' && (!actor || auth.kind !== 'personal' || w.ownerAccountId !== actor.id)) return deny('context-denied');
    if (w.kind === 'family' && auth.kind !== 'personal' && auth.kind !== 'restricted-learner') return deny('context-denied');
    if (w.kind === 'school') {
      const policy = w.schoolPolicy!;
      if (context.schoolPolicyVersion !== policy.version) return deny('context-denied');
      if (auth.kind !== 'restricted-learner') {
        if (!policy.allowedSources.includes(auth.kind) || policy.minimumAssurance === 'mfa' && auth.assurance !== 'mfa' || auth.authenticatedAt + policy.maxAuthenticationAgeSeconds <= now) return deny('authentication-required');
        validUntil = Math.min(validUntil, auth.authenticatedAt + policy.maxAuthenticationAgeSeconds);
      }
    }
    const mfa = auth.kind !== 'restricted-learner' && auth.assurance === 'mfa';
    const personalMfa = auth.kind === 'personal' && mfa;
    if (SENSITIVE.has(r.action)) {
      if (!mfa || auth.authenticatedAt + ACCOUNT_POLICY.sensitiveAuthenticationAgeSeconds <= now) return deny('authentication-required');
      validUntil = Math.min(validUntil, auth.authenticatedAt + ACCOUNT_POLICY.sensitiveAuthenticationAgeSeconds);
    }
    if (TARGETS[r.action] !== r.target.kind) return deny('target-denied');
    const target = r.target.kind === 'record' ? s.records.find(x => x.id === r.target.id)
      : r.target.kind === 'account' ? s.accounts.find(x => x.id === r.target.id)
        : r.target.kind === 'learner' ? s.learners.find(x => x.id === r.target.id)
          : s.workspaces.find(x => x.id === r.target.id);
    if (!target || target.status !== 'active' || target.version !== r.target.version) return deny('target-denied');
    track(target);

    function receipt(id: string, purpose: AuthorityPurpose, workspaceId: string, accountId: string | null, learnerId: string | null): AuthorityReceipt | null {
      const a = s.authorities.find(x => x.id === id);
      if (!a || !live(a) || !a.purposes.includes(purpose) || a.workspaceId !== workspaceId || a.accountId !== accountId || a.learnerId !== learnerId) return null;
      if (learnerId !== null) {
        const subject = s.learners.find(x => x.id === learnerId);
        if (!subject || subject.status !== 'active' || a.learnerVersion !== subject.version) return null;
        track(subject);
      }
      track(a); return a;
    }
    function familyMember(accountId: string, familyId: string): FamilyMembership | null {
      const a = s.accounts.find(x => x.id === accountId);
      if (!a || a.status !== 'active' || a.ageClass !== 'adult') return null;
      for (const member of s.familyMemberships.filter(x => x.accountId === accountId && x.familyId === familyId)) {
        if (!live(member) || !receipt(member.authorityId, 'family-administration', familyId, accountId, null)) continue;
        track(a); return track(member);
      }
      return null;
    }
    function guardian(accountId: string, familyId: string, learnerId: string, action: AccountAction, category?: LearningRecord['category']): GuardianRelationship | null {
      if (!familyMember(accountId, familyId)) return null;
      const subject = s.learners.find(x => x.id === learnerId);
      if (!subject || subject.status !== 'active' || subject.guardianAccess !== 'guardian-managed' || !['under-13', '13-17'].includes(subject.ageBand)) return null;
      track(subject);
      for (const g of s.guardians.filter(x => x.accountId === accountId && x.familyId === familyId && x.learnerId === learnerId)) {
        const receiptId = action === 'learner.erase' ? g.privacyAuthorityId : g.authorityId;
        const purpose = action === 'learner.erase' ? 'family-privacy' : 'family-learning';
        if (!live(g) || !g.actions.includes(action) || category && !g.categories.includes(category) || !receiptId || !receipt(receiptId, purpose, familyId, accountId, learnerId)) continue;
        if (action === 'learner.erase' && !ACCOUNT_RECORD_CATEGORIES.every(c => g.categories.includes(c))) continue;
        // Continuing adult/eligible-student sharing requires a separate protocol;
        // a birthday or old active receipt cannot silently extend guardianship.
        return track(g);
      }
      return null;
    }
    function schoolMember(accountId: string, schoolId: string): SchoolMembership | null {
      if (actor?.id !== accountId || actor.ageClass !== 'adult' || !mfa) return null;
      for (const member of s.schoolMemberships.filter(x => x.accountId === accountId && x.schoolId === schoolId)) {
        if (!live(member) || !receipt(member.authorityId, 'school-administration', schoolId, accountId, null)) continue;
        return track(member);
      }
      return null;
    }
    function enrollment(record: LearningRecord) {
      const klass = s.classes.find(x => x.id === record.classId);
      const school = s.workspaces.find(x => x.id === record.workspaceId);
      if (!klass || klass.status !== 'active' || klass.schoolId !== record.workspaceId || !school || school.status !== 'active' || !school.verified) return null;
      for (const e of s.enrollments.filter(x => x.classId === record.classId && x.schoolId === record.workspaceId && x.learnerId === record.learnerId)) {
        const a = s.authorities.find(x => x.id === e.authorityId);
        if (!live(e) || !a || !receipt(a.id, 'school-learning', e.schoolId, a.accountId, e.learnerId)) continue;
        track(klass); trackWorkspace(school); return track(e);
      }
      return null;
    }
    function restrictedAuthority(learner: Learner, workspace: Workspace): boolean {
      if (auth.kind !== 'restricted-learner' || session!.principal.kind !== 'learner' || learner.id !== session!.principal.id) return false;
      const a = s.authorities.find(x => x.id === auth.authorityId);
      if (!a || a.version !== auth.authorityVersion || a.workspaceId !== workspace.id || a.learnerId !== learner.id || a.learnerVersion !== learner.version || !live(a)) return false;
      track(a);
      if (workspace.kind === 'family') return a.accountId !== null && !!guardian(a.accountId, workspace.id, learner.id, 'device.pair');
      return workspace.kind === 'school' && a.kind === 'verified-school' && a.purposes.includes('school-learning');
    }
    function allow(): AuthorizationDecision {
      return { allowed: true, action: r.action, sessionId: session!.id, sessionVersion: session!.version,
        snapshotRevision: s.revision, principal: { ...session!.principal }, workspaceId: w!.id, target: { ...r.target },
        validUntil, revisionGuards: [...guards].map(([id, version]) => ({ id, version })).sort((a, b) => a.id.localeCompare(b.id)),
        schoolPolicyGuards: [...policies].map(([workspaceId, version]) => ({ workspaceId, version })).sort((a, b) => a.workspaceId.localeCompare(b.workspaceId)) };
    }

    if (r.action === 'account.close' || r.action === 'account.recovery.change') {
      return actor && personalMfa && w.kind === 'personal' && r.target.id === actor.id ? allow() : deny('permission-denied');
    }
    if (r.action === 'family.manage') {
      const member = actor && personalMfa && w.kind === 'family' && r.target.id === w.id ? familyMember(actor.id, w.id) : null;
      return member?.role === 'steward' ? allow() : deny('permission-denied');
    }
    if (r.action === 'school.manage') {
      const member = actor && w.kind === 'school' && r.target.id === w.id ? schoolMember(actor.id, w.id) : null;
      return member?.role === 'administrator' && member.administrativeActions.includes('school.manage') ? allow() : deny('permission-denied');
    }
    if (r.action === 'guardian.change' || r.action === 'device.pair' || r.action === 'learner.erase') {
      if (!actor || !personalMfa || w.kind !== 'family' || !guardian(actor.id, w.id, r.target.id, r.action)) return deny('permission-denied');
      if (r.action === 'guardian.change' && familyMember(actor.id, w.id)?.role !== 'steward') return deny('permission-denied');
      return allow(); // learner.erase covers this family's whole learner domain, never school custody.
    }

    const record = target as LearningRecord;
    const learner = s.learners.find(x => x.id === record.learnerId), owner = s.workspaces.find(x => x.id === record.workspaceId);
    if (!learner || learner.status !== 'active' || !owner || owner.status !== 'active' || !owner.verified) return deny('target-denied');
    track(learner); trackWorkspace(owner);
    const recordAuthority = s.authorities.find(x => x.id === record.authorityId);
    const purpose = owner.kind === 'personal' ? 'independent-learning' : owner.kind === 'family' ? 'family-learning' : 'school-learning';
    if (!recordAuthority || !receipt(record.authorityId, purpose, owner.id, recordAuthority.accountId, learner.id)) return deny('permission-denied');
    if (owner.kind === 'personal') {
      if (!actor || auth.kind !== 'personal' || w.id !== owner.id || learner.accountId !== actor.id || ownLearner?.id !== learner.id || learner.ageBand === 'under-13' || learner.ageBand === 'unresolved') return deny('permission-denied');
      if (recordAuthority.kind === 'adult-self' && (actor.ageClass !== 'adult' || learner.ageBand !== 'adult')) return deny('permission-denied');
      if (!['adult-self', 'learner-self'].includes(recordAuthority.kind)) return deny('permission-denied');
      return r.action === 'record.read' || r.action === 'record.export' || r.action === 'record.write' && record.category === 'practice' ? allow() : deny('permission-denied');
    }
    if (owner.kind === 'family') {
      if (w.id !== owner.id || recordAuthority.kind !== 'verified-guardian') return deny('permission-denied');
      if (actor && personalMfa && guardian(actor.id, w.id, learner.id, r.action, record.category)) {
        if (r.action === 'record.read' || r.action === 'record.export' || r.action === 'record.write' && ['practice', 'family-note', 'assignment'].includes(record.category)) return allow();
      }
      if (ownLearner?.id !== learner.id || record.category === 'family-note' || record.category === 'accommodation' || record.visibility !== 'released') return deny('permission-denied');
      if (!restrictedAuthority(learner, w)) return deny('permission-denied');
      return r.action === 'record.read' || r.action === 'record.write' && record.category === 'practice' ? allow() : deny('permission-denied');
    }
    const enrolled = enrollment(record);
    if (!enrolled || recordAuthority.kind !== 'verified-school') return deny('permission-denied');
    if (w.kind === 'family') {
      // Family can read a school's released summary only through one complete,
      // current link. Viewing this record never changes its institutional custody.
      if (!actor || !personalMfa || r.action !== 'record.read' || record.visibility !== 'released') return deny('permission-denied');
      const g = guardian(actor.id, w.id, learner.id, 'record.read', record.category);
      if (!g) return deny('permission-denied');
      for (const link of s.familySchoolLinks.filter(x => x.guardianRelationshipId === g.id && x.enrollmentId === enrolled.id)) {
        if (live(link) && link.categories.includes(record.category) && receipt(link.authorityId, 'school-family-sharing', owner.id, actor.id, learner.id)) { track(link); return allow(); }
      }
      return deny('permission-denied');
    }
    if (w.id !== owner.id) return deny('context-denied');
    if (actor) {
      const member = schoolMember(actor.id, w.id);
      if (member) for (const assignment of s.teachingAssignments.filter(x => x.membershipId === member.id && x.classId === record.classId)) {
        if (!live(assignment) || !assignment.actions.includes(r.action) || !assignment.categories.includes(record.category)) continue;
        track(assignment);
        if (r.action === 'record.read' || r.action === 'record.export' || r.action === 'record.write' && record.category === 'assignment' || r.action === 'grade.publish' && record.category === 'grade') return allow();
      }
    }
    if (ownLearner?.id !== learner.id || record.visibility !== 'released' || record.category === 'accommodation') return deny('permission-denied');
    if (auth.kind === 'restricted-learner' && !restrictedAuthority(learner, w)) return deny('permission-denied');
    // A school-controlled login is permitted for its enrolled learner, including
    // a school-provisioned child. Consumer signup is a separate authority path.
    return r.action === 'record.read' || r.action === 'record.write' && record.category === 'practice' ? allow() : deny('permission-denied');
  } catch { return deny('invalid-input'); }
}
