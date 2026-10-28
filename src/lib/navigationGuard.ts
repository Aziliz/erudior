/** Synchronous route vetoes protect in-memory drafts before a screen unmounts. */
export type NavigationKind = "app" | "history";
export type NavigationTarget = { name: string; courseId?: string };
type Guard = (kind: NavigationKind, target?: NavigationTarget) => boolean;
const guards = new Set<Guard>();
export function registerNavigationGuard(guard: Guard): () => void {
  guards.add(guard);
  return () => { guards.delete(guard); };
}
export function requestNavigation(kind: NavigationKind = "app", target?: NavigationTarget): boolean {
  for (const guard of [...guards]) {
    try { if (!guard(kind, target)) return false; }
    catch { return false; } // A broken protection hook must not discard a draft.
  }
  return true;
}

const POSITION = "erudiorNavigationPosition";
export type NavigationPosition = { session: string; index: number };
export type DisplayedHistory = { url: string; state: unknown };
export function navigationPosition(state: unknown): NavigationPosition | null {
  if (!state || typeof state !== "object") return null;
  const position = (state as Record<string, unknown>)[POSITION];
  if (!position || typeof position !== "object") return null;
  const { session, index } = position as NavigationPosition;
  return typeof session === "string" && session.length > 0 && session.length < 100 && Number.isSafeInteger(index) && index >= 0
    ? { session, index } : null;
}
export function newNavigationPosition(): NavigationPosition {
  return { session: globalThis.crypto.randomUUID(), index: 0 };
}
export function withNavigationPosition(state: Record<string, unknown>, position: NavigationPosition): Record<string, unknown> {
  return { ...state, [POSITION]: position };
}
export function sameNavigationPosition(a: unknown, b: unknown): boolean {
  const x = navigationPosition(a), y = navigationPosition(b);
  return !!x && !!y && x.session === y.session && x.index === y.index;
}
/** Restore a vetoed Back OR Forward without assuming its direction.
 * Indexed same-session entries can be traversed back exactly. For an unknown
 * external/legacy entry, keep the displayed route by pushing a fresh lineage;
 * never guess an offset or overwrite another route's state.
 */
export function restoreBlockedPop(history: Pick<History, "go" | "pushState">, displayed: DisplayedHistory, targetState: unknown): { traversing: boolean; displayed: DisplayedHistory } {
  const current = navigationPosition(displayed.state), target = navigationPosition(targetState);
  if (current && target && current.session === target.session && current.index !== target.index) {
    history.go(current.index - target.index);
    return { traversing: true, displayed };
  }
  const previous = displayed.state && typeof displayed.state === "object" ? displayed.state as Record<string, unknown> : {};
  const state = withNavigationPosition(previous, newNavigationPosition());
  history.pushState(state, "", displayed.url);
  return { traversing: false, displayed: { url: displayed.url, state } };
}
