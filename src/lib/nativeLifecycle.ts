/** Native elapsed time is independent of suspended WebView timers and wall-clock
 * changes. This signal can conceal/revoke a local grant; it never creates one. */
export function applyNativeLifecycle(detail: unknown, handlers: {
  conceal: () => void; reveal: () => void; lock: () => void;
}): void {
  if (!detail || typeof detail !== "object") return;
  const { paused, backgroundMs } = detail as Record<string, unknown>;
  if (typeof paused !== "boolean" || typeof backgroundMs !== "number" ||
      !Number.isFinite(backgroundMs) || backgroundMs < 0) return;
  if (paused) { handlers.conceal(); return; }
  // Revoke before revealing, even when no DOM pause event/timer was delivered.
  if (backgroundMs >= 30_000) handlers.lock();
  handlers.reveal();
}

export type NativeLifecycleHandlers = {
  conceal: () => void; reveal: () => void; lock: () => void;
};

/** Per-document consumer. A delivery ACK means its synchronous commit completed,
 * not merely that an event had a listener. No callback can grant authorization. */
export function createNativeLifecycleConsumer() {
  let bridgeId: string | null = null, sequence = 0, consumedRevocation = 0;
  return (detail: unknown, handlers: NativeLifecycleHandlers, commit: (work: () => void) => void): boolean => {
    if (!detail || typeof detail !== 'object') return false;
    const event = detail as Record<string, unknown>;
    if (typeof event.bridgeId !== 'string' || !event.bridgeId || event.bridgeId.length > 100 ||
        !Number.isSafeInteger(event.sequence) || (event.sequence as number) <= 0 ||
        !Number.isSafeInteger(event.revocation) || (event.revocation as number) < 0 ||
        (event.revocation as number) > (event.sequence as number) ||
        typeof event.paused !== 'boolean' || typeof event.backgroundMs !== 'number' ||
        !Number.isFinite(event.backgroundMs) || event.backgroundMs < 0 ||
        (event.backgroundMs >= 30_000 && event.revocation === 0)) return false;
    if (bridgeId !== null && bridgeId !== event.bridgeId) return false;
    const nextSequence = event.sequence as number, owed = event.revocation as number;
    if (nextSequence <= sequence) return true; // Already consumed; never re-lock after fresh auth.
    commit(() => {
      // An earlier long absence remains owed even if this latest event is a pause
      // or short resume. Revoke before either concealment or reveal can commit.
      if (owed > consumedRevocation) handlers.lock();
      if (event.paused) handlers.conceal(); else handlers.reveal();
    });
    // Do not consume or ACK an event whose synchronous commit threw.
    bridgeId = event.bridgeId;
    sequence = nextSequence;
    consumedRevocation = Math.max(consumedRevocation, owed);
    return true;
  };
}
