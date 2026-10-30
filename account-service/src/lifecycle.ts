/**
 * Private-service lifecycle planners. They perform no writes, send no messages,
 * and erase no data. The future executor must reload the complete inventories,
 * reauthorize, and compare all revisions in the same transaction as execution.
 * Inputs are server-resolved facts; JSON parsing never verifies guardianship,
 * recovery, a legal hold, or completeness of a database query.
 * Before revoking interactive access, an executor must atomically persist the
 * scoped, verified lifecycle request and its independently authorized jobs. A
 * revoked parent's session cannot later serve as deletion-job authority.
 */
import {
  type AccountSnapshot, type AccountRequest, type AuthorityReceipt,
  isAccountId, isAccountTimestamp, isAccountVersion,
  validateAccountSnapshot, validateAccountRequest,
} from './model';
import { authorizeAccountOperation } from './authorization';
import {
  type DeletionFence, type ErasureSchedule, type ErasureScheduleInput, type PlanningResult,
  isDeletionFence, planErasureSchedule,
} from './retention';

export interface IndependentAccessEvidence {
  accountId: string;
  identityId: string;
  /** Reference to a separately verified personal recovery setup, not a mailbox. */
  recoveryReceiptId: string;
  authorityId: string;
  verifiedAt: number;
  expiresAt: number;
}
export interface ClosureFamilyScope {
  familyId: string;
  familyVersion: number;
  learnerId: string;
  learnerVersion: number;
  currentFence: DeletionFence;
  independentAccess: IndependentAccessEvidence | null;
}
export interface AccountClosureInventory {
  format: 'erudior-account-closure-inventory';
  version: 1;
  snapshotRevision: number;
  accountId: string;
  accountVersion: number;
  /** Complete affected scopes, including active links whose authority expired. */
  familyScopes: ClosureFamilyScope[];
}
export type DependentResolution =
  | { familyId: string; learnerId: string; kind: 'guardian'; guardianAccountId: string }
  | { familyId: string; learnerId: string; kind: 'independent' }
  | { familyId: string; learnerId: string; kind: 'erase-family-data' }
  | { familyId: string; learnerId: string; kind: 'school-only'; schoolId: string };

export interface AccountClosurePlan {
  kind: 'account-closure-plan';
  accountId: string;
  accountVersion: number;
  snapshotRevision: number;
  authorizationValidUntil: number;
  sessionId: string;
  sessionVersion: number;
  finalization: 'ready' | 'pending-family-resolution';
  immediateActions: {
    revokeAccountSessions: true;
    revokeAccountRelationships: true;
    suspendFamilyCollection: { familyId: string; learnerId: string }[];
  };
  /** Erudior-held data only; underlying Google/school accounts are not targets. */
  accountDataTargets: readonly ['erudior-identity-record', 'external-sign-in-links', 'contact-and-recovery', 'device-sessions', 'account-profile'];
  preserveExternalProviderAccounts: true;
  preserveOtherCustodians: true;
  /** Separate jobs; adult account data must not be held indefinitely for these. */
  requiredLearnerIdentityReviews: { learnerId: string; eraseIfNoIndependentBasis: true }[];
  requiredOwnLearnerReviews: {
    learnerId: string; learnerVersion: number; personalWorkspaceId: string;
    erasePersonalLearningDataUnderResolvedPolicy: true;
    detachClosingAccountBeforeAccountRowErasure: true;
    reviewRemainingInstitutionalCustody: true;
  }[];
  persistScopedLifecycleJobsBeforeRevocation: true;
  familyResolutions: {
    familyId: string;
    familyVersion: number;
    learnerId: string;
    learnerVersion: number;
    fenceEpoch: number;
    ledgerRevision: number;
    status: 'resolved' | 'pending';
    reason: 'verified-guardian-remains' | 'family-scope-erased' | 'verify-guardian-transfer' |
      'establish-independent-access' | 'resolve-family-custody' | 'complete-scoped-family-erasure' |
      'verify-school-authority' | 'choose-stewardship' | 'rebind-family-record-authority' | 'resolve-withdrawn-family-scope';
    preserveIndependentAccountId: string | null;
    preserveSchoolWorkspaceId: string | null;
  }[];
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function exact(value: Record<string, unknown>, required: string[], optional: string[] = []): boolean {
  return required.every(key => Object.hasOwn(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key));
}
function current(value: { status: string; startsAt: number; expiresAt: number }, now: number): boolean {
  return value.status === 'active' && value.startsAt <= now && now < value.expiresAt;
}
function key(familyId: string, learnerId: string): string { return familyId + '/' + learnerId; }
function authorityCurrent(s: AccountSnapshot, id: string, now: number): AuthorityReceipt | null {
  const receipt = s.authorities.find(a => a.id === id);
  if (!receipt || !current(receipt, now)) return null;
  if (receipt.learnerId !== null && !s.learners.some(l => l.id === receipt.learnerId && l.version === receipt.learnerVersion && l.status === 'active')) return null;
  return receipt;
}
function guardianCanContinue(s: AccountSnapshot, familyId: string, learnerId: string, accountId: string, closingId: string, now: number): boolean {
  if (accountId === closingId || !s.accounts.some(a => a.id === accountId && a.status === 'active' && a.ageClass === 'adult')) return false;
  const learner = s.learners.find(l => l.id === learnerId);
  if (!learner || learner.status !== 'active' || learner.guardianAccess !== 'guardian-managed' ||
    !['under-13', '13-17'].includes(learner.ageBand) ||
    !s.workspaces.some(w => w.id === familyId && w.status === 'active' && w.verified)) return false;
  const membership = s.familyMemberships.find(m => m.accountId === accountId && m.familyId === familyId && current(m, now));
  if (!membership) return false;
  const memberAuthority = authorityCurrent(s, membership.authorityId, now);
  if (!memberAuthority || !memberAuthority.purposes.includes('family-administration')) return false;
  return s.guardians.some(g => {
    if (g.accountId !== accountId || g.familyId !== familyId || g.learnerId !== learnerId || !current(g, now)) return false;
    const authority = authorityCurrent(s, g.authorityId, now);
    return !!authority && authority.kind === 'verified-guardian' && authority.accountId === accountId &&
      authority.learnerId === learnerId && authority.workspaceId === familyId && authority.purposes.includes('family-learning');
  });
}
function retainedRecordsHaveContinuingAuthority(s: AccountSnapshot, scope: ClosureFamilyScope, closingId: string, now: number): boolean {
  return s.records.filter(r => r.workspaceId === scope.familyId && r.learnerId === scope.learnerId && r.status !== 'erased').every(record => {
    if (record.status !== 'active') return false;
    const receipt = authorityCurrent(s, record.authorityId, now);
    return !!receipt && receipt.kind === 'verified-guardian' && receipt.accountId !== null && receipt.accountId !== closingId &&
      receipt.workspaceId === scope.familyId && receipt.learnerId === scope.learnerId && receipt.purposes.includes('family-learning') &&
      guardianCanContinue(s, scope.familyId, scope.learnerId, receipt.accountId, closingId, now);
  });
}
function validateIndependentEvidence(value: unknown): value is IndependentAccessEvidence {
  return object(value) && exact(value, ['accountId', 'identityId', 'recoveryReceiptId', 'authorityId', 'verifiedAt', 'expiresAt']) &&
    ['accountId', 'identityId', 'recoveryReceiptId', 'authorityId'].every(k => isAccountId(value[k])) &&
    isAccountTimestamp(value.verifiedAt) && isAccountTimestamp(value.expiresAt) && value.expiresAt > value.verifiedAt;
}
function independentCanContinue(s: AccountSnapshot, scope: ClosureFamilyScope, closingId: string, now: number): string | null {
  const evidence = scope.independentAccess;
  const learner = s.learners.find(l => l.id === scope.learnerId);
  if (!evidence || !learner || !['13-17', 'adult'].includes(learner.ageBand) || learner.status !== 'active' ||
    learner.accountId !== evidence.accountId || evidence.accountId === closingId || evidence.verifiedAt > now || evidence.expiresAt <= now ||
    !s.accounts.some(a => a.id === evidence.accountId && a.status === 'active' && a.ageClass !== 'unresolved')) return null;
  if (!s.identities.some(i => i.id === evidence.identityId && i.accountId === evidence.accountId && i.trust === 'personal' && i.status === 'active')) return null;
  const authority = authorityCurrent(s, evidence.authorityId, now);
  if (!authority || !['adult-self', 'learner-self'].includes(authority.kind) || authority.accountId !== evidence.accountId ||
    authority.learnerId !== learner.id || !authority.purposes.includes('independent-learning')) return null;
  return evidence.accountId;
}
function schoolCanContinue(s: AccountSnapshot, learnerId: string, schoolId: string, now: number): boolean {
  if (!s.workspaces.some(w => w.id === schoolId && w.kind === 'school' && w.status === 'active' && w.verified)) return false;
  return s.enrollments.some(e => {
    if (e.learnerId !== learnerId || e.schoolId !== schoolId || !current(e, now) ||
      !s.classes.some(c => c.id === e.classId && c.schoolId === schoolId && c.status === 'active')) return false;
    const authority = authorityCurrent(s, e.authorityId, now);
    return !!authority && authority.kind === 'verified-school' && authority.workspaceId === schoolId &&
      authority.learnerId === learnerId && authority.purposes.includes('school-learning');
  });
}

function parseClosureInventory(input: unknown, s: AccountSnapshot, request: AccountRequest): PlanningResult<AccountClosureInventory> {
  if (!object(input) || !exact(input, ['format', 'version', 'snapshotRevision', 'accountId', 'accountVersion', 'familyScopes']) ||
    input.format !== 'erudior-account-closure-inventory' || input.version !== 1 || input.snapshotRevision !== s.revision ||
    input.accountId !== request.target.id || input.accountVersion !== request.target.version || !Array.isArray(input.familyScopes) ||
    input.familyScopes.length > 10_000) return { ok: false, reason: 'invalid-closure-inventory' };
  const expected = new Set(s.guardians.filter(g => g.accountId === input.accountId && g.status === 'active' &&
    s.learners.some(l => l.id === g.learnerId && l.status !== 'erased')).map(g => key(g.familyId, g.learnerId)));
  // Revoking a relationship before closure must not hide records still relying
  // on the departing account's authority from the custody-resolution inventory.
  for (const record of s.records) {
    if (record.status === 'erased' || !s.workspaces.some(w => w.id === record.workspaceId && w.kind === 'family')) continue;
    const authority = s.authorities.find(a => a.id === record.authorityId);
    if (authority?.accountId === input.accountId) expected.add(key(record.workspaceId, record.learnerId));
  }
  const seen = new Set<string>();
  for (const scope of input.familyScopes) {
    if (!object(scope) || !exact(scope, ['familyId', 'familyVersion', 'learnerId', 'learnerVersion', 'currentFence', 'independentAccess']) ||
      !isAccountId(scope.familyId) || !isAccountId(scope.learnerId) || !isAccountVersion(scope.familyVersion) || !isAccountVersion(scope.learnerVersion) ||
      !isDeletionFence(scope.currentFence) || scope.currentFence.scope.kind !== 'family-learner' ||
      scope.currentFence.scope.workspaceId !== scope.familyId || scope.currentFence.scope.subjectId !== scope.learnerId ||
      scope.currentFence.effectiveAt > s.capturedAt ||
      (scope.independentAccess !== null && !validateIndependentEvidence(scope.independentAccess))) return { ok: false, reason: 'invalid-closure-scope' };
    const scopeKey = key(scope.familyId, scope.learnerId);
    if (seen.has(scopeKey) || !expected.has(scopeKey) ||
      !s.workspaces.some(w => w.id === scope.familyId && w.kind === 'family' && w.version === scope.familyVersion) ||
      !s.learners.some(l => l.id === scope.learnerId && l.version === scope.learnerVersion)) return { ok: false, reason: 'closure-inventory-mismatch' };
    if (scope.currentFence.state === 'erased' && s.records.some(r => r.workspaceId === scope.familyId && r.learnerId === scope.learnerId && r.status !== 'erased')) {
      return { ok: false, reason: 'family-erasure-incomplete' };
    }
    seen.add(scopeKey);
  }
  if (seen.size !== expected.size) return { ok: false, reason: 'incomplete-closure-inventory' };
  return { ok: true, plan: structuredClone(input) as unknown as AccountClosureInventory };
}
function parseResolutions(input: unknown, inventory: AccountClosureInventory): PlanningResult<DependentResolution[]> {
  if (!Array.isArray(input) || input.length > inventory.familyScopes.length) return { ok: false, reason: 'invalid-dependent-resolutions' };
  const seen = new Set<string>();
  for (const resolution of input) {
    if (!object(resolution) || !isAccountId(resolution.familyId) || !isAccountId(resolution.learnerId)) return { ok: false, reason: 'invalid-dependent-resolution' };
    const extra = resolution.kind === 'guardian' ? ['guardianAccountId'] : resolution.kind === 'school-only' ? ['schoolId'] : [];
    if (!['guardian', 'independent', 'erase-family-data', 'school-only'].includes(resolution.kind as string) ||
      !exact(resolution, ['familyId', 'learnerId', 'kind', ...extra]) || extra.some(field => !isAccountId(resolution[field]))) return { ok: false, reason: 'invalid-dependent-resolution' };
    const resolutionKey = key(resolution.familyId, resolution.learnerId);
    if (seen.has(resolutionKey) || !inventory.familyScopes.some(scope => key(scope.familyId, scope.learnerId) === resolutionKey)) return { ok: false, reason: 'resolution-scope-mismatch' };
    seen.add(resolutionKey);
  }
  return { ok: true, plan: structuredClone(input) as DependentResolution[] };
}

export function planAccountClosure(snapshotInput: unknown, requestInput: unknown, inventoryInput: unknown, resolutionsInput: unknown, now: number): PlanningResult<AccountClosurePlan> {
  const parsedSnapshot = validateAccountSnapshot(snapshotInput);
  const parsedRequest = validateAccountRequest(requestInput);
  if (!parsedSnapshot.ok || !parsedRequest.ok || parsedRequest.value.action !== 'account.close' || parsedRequest.value.target.kind !== 'account') return { ok: false, reason: 'invalid-closure-request' };
  const decision = authorizeAccountOperation(parsedSnapshot.value, parsedRequest.value, now);
  if (!decision.allowed) return { ok: false, reason: 'closure-not-authorized' };
  const s = parsedSnapshot.value;
  const request = parsedRequest.value;
  const inventoryResult = parseClosureInventory(inventoryInput, s, request);
  if (!inventoryResult.ok) return inventoryResult;
  const inventory = inventoryResult.plan;
  const resolutions = parseResolutions(resolutionsInput, inventory);
  if (!resolutions.ok) return resolutions;
  const collectionSuspensions: AccountClosurePlan['immediateActions']['suspendFamilyCollection'] = [];
  const familyResolutions: AccountClosurePlan['familyResolutions'] = [];
  for (const scope of inventory.familyScopes) {
    const selected = resolutions.plan.find(r => r.familyId === scope.familyId && r.learnerId === scope.learnerId);
    const independentAccountId = independentCanContinue(s, scope, inventory.accountId, now);
    const remaining = s.guardians.find(g => guardianCanContinue(s, scope.familyId, scope.learnerId, g.accountId, inventory.accountId, now));
    const erased = scope.currentFence.state === 'erased';
    const result: AccountClosurePlan['familyResolutions'][number] = {
      familyId: scope.familyId, familyVersion: scope.familyVersion, learnerId: scope.learnerId, learnerVersion: scope.learnerVersion,
      fenceEpoch: scope.currentFence.epoch, ledgerRevision: scope.currentFence.ledgerRevision,
      status: 'pending', reason: 'choose-stewardship', preserveIndependentAccountId: independentAccountId, preserveSchoolWorkspaceId: null,
    };
    const continuingBasis = retainedRecordsHaveContinuingAuthority(s, scope, inventory.accountId, now);
    if (!remaining || !continuingBasis || scope.currentFence.state !== 'active' || selected?.kind === 'erase-family-data' || selected?.kind === 'school-only') {
      collectionSuspensions.push({ familyId: scope.familyId, learnerId: scope.learnerId });
    }
    if (selected?.kind === 'guardian') {
      if (guardianCanContinue(s, scope.familyId, scope.learnerId, selected.guardianAccountId, inventory.accountId, now)) {
        if (scope.currentFence.state !== 'active') result.reason = 'resolve-withdrawn-family-scope';
        else if (!continuingBasis) result.reason = 'rebind-family-record-authority';
        else { result.status = 'resolved'; result.reason = 'verified-guardian-remains'; }
      } else result.reason = 'verify-guardian-transfer';
    } else if (selected?.kind === 'school-only') {
      if (schoolCanContinue(s, scope.learnerId, selected.schoolId, now)) {
        result.preserveSchoolWorkspaceId = selected.schoolId;
        result.status = erased ? 'resolved' : 'pending'; result.reason = erased ? 'family-scope-erased' : 'complete-scoped-family-erasure';
      } else result.reason = 'verify-school-authority';
    } else if (selected?.kind === 'erase-family-data') {
      result.status = erased ? 'resolved' : 'pending'; result.reason = erased ? 'family-scope-erased' : 'complete-scoped-family-erasure';
    } else if (selected?.kind === 'independent') {
      result.status = independentAccountId && erased ? 'resolved' : 'pending';
      result.reason = !independentAccountId ? 'establish-independent-access' : erased ? 'family-scope-erased' : 'resolve-family-custody';
    } else if (erased) {
      result.status = 'resolved'; result.reason = 'family-scope-erased';
    } else if (remaining) {
      if (scope.currentFence.state !== 'active') result.reason = 'resolve-withdrawn-family-scope';
      else if (!continuingBasis) result.reason = 'rebind-family-record-authority';
      else { result.status = 'resolved'; result.reason = 'verified-guardian-remains'; }
    } else if (independentAccountId) result.reason = 'resolve-family-custody';
    familyResolutions.push(result);
  }
  return { ok: true, plan: {
    kind: 'account-closure-plan', accountId: inventory.accountId, accountVersion: inventory.accountVersion,
    snapshotRevision: s.revision, authorizationValidUntil: decision.validUntil, sessionId: request.sessionId, sessionVersion: request.sessionVersion,
    finalization: familyResolutions.every(r => r.status === 'resolved') ? 'ready' : 'pending-family-resolution',
    immediateActions: { revokeAccountSessions: true, revokeAccountRelationships: true, suspendFamilyCollection: collectionSuspensions },
    accountDataTargets: ['erudior-identity-record', 'external-sign-in-links', 'contact-and-recovery', 'device-sessions', 'account-profile'],
    preserveExternalProviderAccounts: true, preserveOtherCustodians: true,
    requiredLearnerIdentityReviews: [...new Set(familyResolutions.filter(r => r.reason === 'family-scope-erased').map(r => r.learnerId))]
      .map(learnerId => ({ learnerId, eraseIfNoIndependentBasis: true })),
    requiredOwnLearnerReviews: s.learners.filter(l => l.accountId === inventory.accountId).map(l => ({
      learnerId: l.id, learnerVersion: l.version, personalWorkspaceId: request.workspaceId,
      erasePersonalLearningDataUnderResolvedPolicy: true, detachClosingAccountBeforeAccountRowErasure: true,
      reviewRemainingInstitutionalCustody: true,
    })),
    persistScopedLifecycleJobsBeforeRevocation: true,
    familyResolutions,
  } };
}

export interface FamilyErasureInventory {
  format: 'erudior-family-erasure-inventory'; version: 1; snapshotRevision: number;
  familyId: string; familyVersion: number; learnerId: string; learnerVersion: number;
  currentFence: DeletionFence;
  records: { id: string; version: number; retention: Omit<ErasureScheduleInput, 'recordId' | 'now'> }[];
}
export interface FamilyErasurePlan {
  kind: 'family-learner-erasure-plan'; snapshotRevision: number; authorizationValidUntil: number;
  sessionId: string; sessionVersion: number; scope: { familyId: string; familyVersion: number; learnerId: string; learnerVersion: number };
  expectedFence: DeletionFence;
  stopCoveredCollection: true; revokeAffectedScopeGrants: true; advanceFenceBeforeDataRemoval: true;
  learnerIdentityReview: { required: true; scope: 'complete-current-custody'; eraseIfNoIndependentBasis: true };
  preserveOtherCustodians: true;
  records: { id: string; version: number; schedule: ErasureSchedule }[];
  requiredStores: readonly ['records', 'private-files', 'exports', 'sync-queues', 'processor-copies', 'backups'];
}

/** An authorized guardian can request exact Family erasure even if another guardian remains. */
export function planFamilyLearnerErasure(snapshotInput: unknown, requestInput: unknown, inventoryInput: unknown, now: number): PlanningResult<FamilyErasurePlan> {
  const parsedSnapshot = validateAccountSnapshot(snapshotInput);
  const parsedRequest = validateAccountRequest(requestInput);
  if (!parsedSnapshot.ok || !parsedRequest.ok || parsedRequest.value.action !== 'learner.erase' || parsedRequest.value.target.kind !== 'learner') return { ok: false, reason: 'invalid-family-erasure-request' };
  const s = parsedSnapshot.value; const request = parsedRequest.value;
  const decision = authorizeAccountOperation(s, request, now);
  if (!decision.allowed) return { ok: false, reason: 'family-erasure-not-authorized' };
  const value = inventoryInput;
  const workspace = s.workspaces.find(w => w.id === request.workspaceId);
  if (!workspace || workspace.kind !== 'family' || !object(value) ||
    !exact(value, ['format', 'version', 'snapshotRevision', 'familyId', 'familyVersion', 'learnerId', 'learnerVersion', 'currentFence', 'records']) ||
    value.format !== 'erudior-family-erasure-inventory' || value.version !== 1 || value.snapshotRevision !== s.revision ||
    value.familyId !== workspace.id || value.familyVersion !== workspace.version || value.learnerId !== request.target.id || value.learnerVersion !== request.target.version ||
    !isDeletionFence(value.currentFence) || value.currentFence.scope.kind !== 'family-learner' || value.currentFence.scope.workspaceId !== value.familyId ||
    value.currentFence.scope.subjectId !== value.learnerId || value.currentFence.effectiveAt > now ||
    !Array.isArray(value.records) || value.records.length > 10_000) return { ok: false, reason: 'invalid-family-erasure-inventory' };
  const expected = s.records.filter(r => r.workspaceId === workspace.id && r.learnerId === request.target.id && r.status !== 'erased');
  const seen = new Set<string>(); const records: FamilyErasurePlan['records'] = [];
  for (const record of value.records) {
    if (!object(record) || !exact(record, ['id', 'version', 'retention']) || !isAccountId(record.id) ||
      !isAccountVersion(record.version) || !object(record.retention) || seen.has(record.id) ||
      !expected.some(r => r.id === record.id && r.version === record.version) ||
      Object.hasOwn(record.retention, 'recordId') || Object.hasOwn(record.retention, 'now')) return { ok: false, reason: 'erasure-record-custody-mismatch' };
    const schedule = planErasureSchedule({ ...record.retention, recordId: record.id, now });
    if (!schedule.ok) return schedule;
    seen.add(record.id); records.push({ id: record.id, version: record.version, schedule: schedule.plan });
  }
  if (seen.size !== expected.length) return { ok: false, reason: 'incomplete-family-erasure-inventory' };
  if (value.currentFence.state === 'erased' && expected.length) return { ok: false, reason: 'family-erasure-incomplete' };
  return { ok: true, plan: {
    kind: 'family-learner-erasure-plan', snapshotRevision: s.revision, authorizationValidUntil: decision.validUntil,
    sessionId: request.sessionId, sessionVersion: request.sessionVersion,
    scope: { familyId: workspace.id, familyVersion: workspace.version, learnerId: request.target.id, learnerVersion: request.target.version },
    expectedFence: structuredClone(value.currentFence), stopCoveredCollection: true, revokeAffectedScopeGrants: true, advanceFenceBeforeDataRemoval: true,
    learnerIdentityReview: { required: true, scope: 'complete-current-custody', eraseIfNoIndependentBasis: true },
    preserveOtherCustodians: true, records,
    requiredStores: ['records', 'private-files', 'exports', 'sync-queues', 'processor-copies', 'backups'],
  } };
}

/** Routing only. Existing read access does not decide a school erasure request. */
export function planSchoolRecordErasureReferral(snapshotInput: unknown, requestInput: unknown, now: number): PlanningResult<{
  kind: 'school-erasure-referral'; schoolWorkspaceId: string; recordId: string; recordVersion: number;
  mutationAuthorized: false; snapshotRevision: number; authorizationValidUntil: number;
}> {
  const parsedSnapshot = validateAccountSnapshot(snapshotInput); const parsedRequest = validateAccountRequest(requestInput);
  if (!parsedSnapshot.ok || !parsedRequest.ok || parsedRequest.value.action !== 'record.read' || parsedRequest.value.target.kind !== 'record') return { ok: false, reason: 'referral-not-available' };
  const s = parsedSnapshot.value; const request = parsedRequest.value;
  const decision = authorizeAccountOperation(s, request, now);
  if (!decision.allowed) return { ok: false, reason: 'referral-not-available' };
  const record = s.records.find(r => r.id === request.target.id);
  if (!record || !s.workspaces.some(w => w.id === record.workspaceId && w.kind === 'school')) return { ok: false, reason: 'referral-not-available' };
  return { ok: true, plan: { kind: 'school-erasure-referral', schoolWorkspaceId: record.workspaceId, recordId: record.id,
    recordVersion: record.version, mutationAuthorized: false, snapshotRevision: s.revision, authorizationValidUntil: decision.validUntil } };
}
