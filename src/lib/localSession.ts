/** Local UI access boundary only. Not encryption, verified guardianship, or server identity.
 * Never persist grants: a newly loaded Family starts locked, including single learners.
 */
type Role = { kind: 'locked' } | { kind: 'adult' } | { kind: 'learner'; id: string };
let enabled = false;
let epoch = 0;
let role: Role = { kind: 'locked' };
let credentialFingerprint: string | null = null;
type LocalParentCredential = { password: unknown; pin?: unknown; recovery?: unknown };
const credentialKey = (parent: LocalParentCredential): string => JSON.stringify({
  password: parent.password, pin: parent.pin, recovery: parent.recovery,
});

/** Binding is memory-only, and never includes failed-attempt counters or timestamps. */
export function bindLocalSessionCredential(parent: LocalParentCredential): void {
  credentialFingerprint = credentialKey(parent);
}
export function assertLocalSessionCredential(parent: LocalParentCredential): void {
  if (enabled && credentialFingerprint !== null && credentialFingerprint !== credentialKey(parent))
    throw Error('Local adult credentials changed. Lock and authenticate again.');
}

export function configureLocalSession(value: boolean): void {
  if (value === enabled) return;
  enabled = value;
  credentialFingerprint = null;
  role = { kind: 'locked' };
  epoch++;
}
export const localSessionEpoch = (): number => epoch;
export const localSessionEnabled = (): boolean => enabled;
export const localSessionLocked = (): boolean => enabled && role.kind === 'locked';
export function unlockLocalLearner(id: string): void {
  if (!/^[a-z0-9]{1,24}$/.test(id)) throw Error('Invalid local learner identity.');
  role = { kind: 'learner', id };
  epoch++;
}
export function unlockLocalAdult(): void { role = { kind: 'adult' }; epoch++; }
export function lockLocalSession(): void { role = { kind: 'locked' }; epoch++; }
export function assertLocalLearner(id: string | null): void {
  if (enabled && (role.kind === 'locked' || role.kind === 'learner' && role.id !== id || id === null))
    throw Error('Unlock this learner with the supervising adult before continuing.');
}
export function assertLocalAdult(): void {
  if (enabled && role.kind !== 'adult') throw Error('Fresh supervising-adult access is required.');
}
/** Capture before the first await (or when constructing a view's action facade).
 * Reopening the same learner never revives a callback from an earlier session.
 */
export function captureLocalSession(): () => void {
  const captured = epoch;
  return () => {
    if (captured !== epoch || enabled && role.kind === 'locked')
      throw Error('Local session changed or locked. Reopen this view before continuing.');
  };
}

/** Bind a service's existing authorization hooks to its creating UI session.
 * The service's ordinary source/version/CAS checks remain authoritative too.
 * This adds no authority to IO: it only narrows the existing hooks.
 */
export function bindLocalSessionAuthority<T extends object>(io: T): T {
  const guard = captureLocalSession();
  const copy = { ...io };
  for (const name of ['authorize', 'authorizeAdult', 'learnerContext', 'context'] as const) {
    const original = Reflect.get(io, name);
    if (typeof original !== 'function') continue;
    Reflect.set(copy, name, async (...args: unknown[]) => {
      guard();
      if (name === 'authorize' || name === 'authorizeAdult') assertLocalAdult();
      const result = await original.apply(io, args);
      guard();
      if (name === 'authorize' || name === 'authorizeAdult') assertLocalAdult();
      else assertLocalLearner(result?.studentId ?? result?.profileId ?? null);
      return result;
    });
  }
  return copy;
}
