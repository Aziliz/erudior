/**
 * Server-only planning helpers. These are targets and replay checks, not a
 * deletion executor, legal-policy resolver, or durable deletion ledger.
 * Every input must come from the current private service transaction. In
 * particular, a restored database must never supply its own "current" ledger.
 */
import { isAccountId, isAccountTimestamp, isAccountVersion } from './model';

export type PlanningResult<T> = { ok: true; plan: T } | { ok: false; reason: string };

export interface ErasureScheduleInput {
  recordId: string;
  requestedAt: number;
  now: number;
  policy: {
    activeEraseWithinSeconds: number;
    backupExpireWithinSeconds: number;
    offlineReplayUntil: number;
  };
  /** Applicable shorter deadlines are resolved by the responsible service. */
  requiredActiveEraseBy?: number;
  requiredCompleteEraseBy?: number;
  hold?: {
    id: string;
    recordId: string;
    basisReference: string;
    purpose: 'legal-obligation' | 'pending-access-request' | 'institutional-retention';
    reviewAt: number;
    expiresAt: number;
    status: 'active' | 'released';
  };
}

export interface ErasureSchedule {
  recordId: string;
  activeEraseBy: number;
  backupExpireBy: number;
  /** Extend from actual completion/provider expiry; never prune by this alone. */
  ledgerRetainAtLeastUntil: number;
  overdue: boolean;
  hold: null | {
    id: string;
    reviewAt: number;
    expiresAt: number;
    reviewRequired: boolean;
    conflictsWithDeadline: boolean;
    restrictedRetentionRequired: true;
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function exact(value: Record<string, unknown>, required: string[], optional: string[] = []): boolean {
  return required.every(key => Object.hasOwn(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key));
}
function nonnegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
function addTime(time: number, duration: number): number | null {
  const result = time + duration;
  return isAccountTimestamp(result) ? result : null;
}

/** No default retention period is silently imposed on school or child data. */
export function planErasureSchedule(input: unknown): PlanningResult<ErasureSchedule> {
  if (!object(input) || !exact(input, ['recordId', 'requestedAt', 'now', 'policy'],
    ['requiredActiveEraseBy', 'requiredCompleteEraseBy', 'hold']) ||
    !isAccountId(input.recordId) || !isAccountTimestamp(input.requestedAt) ||
    !isAccountTimestamp(input.now) || input.requestedAt > input.now || !object(input.policy) ||
    !exact(input.policy, ['activeEraseWithinSeconds', 'backupExpireWithinSeconds', 'offlineReplayUntil']) ||
    !nonnegativeInteger(input.policy.activeEraseWithinSeconds) || input.policy.activeEraseWithinSeconds === 0 ||
    !nonnegativeInteger(input.policy.backupExpireWithinSeconds) ||
    !isAccountTimestamp(input.policy.offlineReplayUntil) || input.policy.offlineReplayUntil < input.requestedAt) {
    return { ok: false, reason: 'invalid-retention-input' };
  }
  for (const key of ['requiredActiveEraseBy', 'requiredCompleteEraseBy']) {
    if (Object.hasOwn(input, key) && !isAccountTimestamp(input[key])) {
      return { ok: false, reason: 'invalid-retention-deadline' };
    }
  }
  const configuredActive = addTime(input.requestedAt, input.policy.activeEraseWithinSeconds);
  if (configuredActive === null) return { ok: false, reason: 'retention-time-overflow' };
  const activeEraseBy = Math.min(configuredActive,
    (input.requiredActiveEraseBy as number | undefined) ?? configuredActive,
    (input.requiredCompleteEraseBy as number | undefined) ?? configuredActive);
  const configuredBackup = addTime(activeEraseBy, input.policy.backupExpireWithinSeconds);
  if (configuredBackup === null) return { ok: false, reason: 'retention-time-overflow' };
  const backupExpireBy = Math.min(configuredBackup, (input.requiredCompleteEraseBy as number | undefined) ?? configuredBackup);
  let hold: ErasureSchedule['hold'] = null;
  if (Object.hasOwn(input, 'hold')) {
    const candidate = input.hold;
    if (!object(candidate) || !exact(candidate,
      ['id', 'recordId', 'basisReference', 'purpose', 'reviewAt', 'expiresAt', 'status']) ||
      !isAccountId(candidate.id) || !isAccountId(candidate.recordId) || candidate.recordId !== input.recordId ||
      !isAccountId(candidate.basisReference) ||
      !['legal-obligation', 'pending-access-request', 'institutional-retention'].includes(candidate.purpose as string) ||
      !isAccountTimestamp(candidate.reviewAt) || !isAccountTimestamp(candidate.expiresAt) ||
      candidate.reviewAt > candidate.expiresAt || !['active', 'released'].includes(candidate.status as string)) {
      return { ok: false, reason: 'invalid-or-unscoped-hold' };
    }
    if (candidate.status === 'active' && candidate.expiresAt > input.now) {
      hold = {
        id: candidate.id, reviewAt: candidate.reviewAt, expiresAt: candidate.expiresAt,
        reviewRequired: candidate.reviewAt <= input.now,
        conflictsWithDeadline: candidate.expiresAt > activeEraseBy,
        restrictedRetentionRequired: true,
      };
    }
  }
  const heldBackupExpiry = hold ? addTime(hold.expiresAt, input.policy.backupExpireWithinSeconds) : 0;
  if (heldBackupExpiry === null) return { ok: false, reason: 'retention-time-overflow' };
  return { ok: true, plan: {
    recordId: input.recordId, activeEraseBy, backupExpireBy,
    ledgerRetainAtLeastUntil: Math.max(backupExpireBy, input.policy.offlineReplayUntil, heldBackupExpiry),
    overdue: input.now > activeEraseBy || input.now > backupExpireBy,
    hold,
  } };
}

export interface LifecycleScope {
  kind: 'account' | 'family-learner' | 'school-learner';
  subjectId: string;
  workspaceId?: string;
}
export interface DeletionFence {
  scope: LifecycleScope;
  epoch: number;
  ledgerRevision: number;
  state: 'active' | 'withdrawn' | 'erased';
  effectiveAt: number;
  retainAtLeastUntil: number;
}

export function isLifecycleScope(input: unknown): input is LifecycleScope {
  if (!object(input) || !exact(input, ['kind', 'subjectId'], ['workspaceId']) || !isAccountId(input.subjectId)) return false;
  if (input.kind === 'account') return !Object.hasOwn(input, 'workspaceId');
  return (input.kind === 'family-learner' || input.kind === 'school-learner') && isAccountId(input.workspaceId);
}
function sameScope(a: LifecycleScope, b: LifecycleScope): boolean {
  return a.kind === b.kind && a.subjectId === b.subjectId && a.workspaceId === b.workspaceId;
}
export function isDeletionFence(input: unknown): input is DeletionFence {
  return object(input) && exact(input,
    ['scope', 'epoch', 'ledgerRevision', 'state', 'effectiveAt', 'retainAtLeastUntil']) &&
    isLifecycleScope(input.scope) && isAccountVersion(input.epoch) && isAccountVersion(input.ledgerRevision) &&
    ['active', 'withdrawn', 'erased'].includes(input.state as string) &&
    isAccountTimestamp(input.effectiveAt) && isAccountTimestamp(input.retainAtLeastUntil) &&
    input.retainAtLeastUntil >= input.effectiveAt;
}

/** Monotonic updates only. Terminal scope identities are never reused. */
export function advanceDeletionFence(current: unknown, next: unknown): PlanningResult<DeletionFence> {
  if (!isDeletionFence(current) || !isDeletionFence(next) || !sameScope(current.scope, next.scope)) {
    return { ok: false, reason: 'invalid-deletion-fence' };
  }
  const rank = { active: 0, withdrawn: 1, erased: 2 };
  if (next.epoch < current.epoch || next.ledgerRevision < current.ledgerRevision ||
    next.effectiveAt < current.effectiveAt || next.retainAtLeastUntil < current.retainAtLeastUntil ||
    rank[next.state] < rank[current.state]) return { ok: false, reason: 'deletion-fence-regression' };
  if (next.state !== current.state && (next.epoch <= current.epoch || next.ledgerRevision <= current.ledgerRevision)) {
    return { ok: false, reason: 'deletion-transition-needs-new-version' };
  }
  if (next.ledgerRevision === current.ledgerRevision &&
    (next.epoch !== current.epoch || next.effectiveAt !== current.effectiveAt ||
      next.retainAtLeastUntil !== current.retainAtLeastUntil || next.state !== current.state)) {
    return { ok: false, reason: 'deletion-version-reused' };
  }
  return { ok: true, plan: structuredClone(next) };
}

export interface QueuedScopeWrite {
  scope: LifecycleScope;
  epoch: number;
  ledgerRevision: number;
  createdAt: number;
}

/** This check supplements current authorization; it does not grant it. */
export function checkQueuedWriteAgainstLedger(currentLedger: unknown, queuedWrite: unknown, now: number): PlanningResult<{ replayEligible: true }> {
  if (!isDeletionFence(currentLedger) || !object(queuedWrite) ||
    !exact(queuedWrite, ['scope', 'epoch', 'ledgerRevision', 'createdAt']) ||
    !isLifecycleScope(queuedWrite.scope) || !isAccountVersion(queuedWrite.epoch) ||
    !isAccountVersion(queuedWrite.ledgerRevision) || !isAccountTimestamp(queuedWrite.createdAt) ||
    !isAccountTimestamp(now) || currentLedger.effectiveAt > now || queuedWrite.createdAt > now ||
    !sameScope(currentLedger.scope, queuedWrite.scope)) return { ok: false, reason: 'invalid-replay-input' };
  if (currentLedger.state !== 'active') return { ok: false, reason: 'scope-no-longer-accepts-writes' };
  if (currentLedger.epoch !== queuedWrite.epoch || currentLedger.ledgerRevision !== queuedWrite.ledgerRevision ||
    queuedWrite.createdAt < currentLedger.effectiveAt) return { ok: false, reason: 'stale-queued-write' };
  return { ok: true, plan: { replayEligible: true } };
}

/**
 * The current ledger must be durable state obtained independently of the
 * restored snapshot. An unknown/missing/older ledger blocks recovery. This
 * does not perform data removal or authorize reopening the service.
 */
export function reconcileRestoredFence(restored: unknown, currentLedger: unknown): PlanningResult<{
  fence: DeletionFence;
  invalidateRestoredQueue: boolean;
  eraseRestoredScope: boolean;
  serviceReopenAuthorized: false;
}> {
  const advanced = advanceDeletionFence(restored, currentLedger);
  if (!advanced.ok) return advanced;
  const old = restored as DeletionFence;
  const current = advanced.plan;
  return { ok: true, plan: {
    fence: current,
    invalidateRestoredQueue: current.epoch !== old.epoch || current.ledgerRevision !== old.ledgerRevision || current.state !== 'active',
    eraseRestoredScope: current.state === 'erased',
    serviceReopenAuthorized: false,
  } };
}
