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
