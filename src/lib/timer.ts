import { captureLocalSession, assertLocalLearner } from "./localSession";
// Active study time for homeschool records. Counts while a study screen is open, the window is
// visible, and the student did something (typed, clicked, scrolled, touched) in the last few
// minutes; otherwise it pauses. Saved to the student's records about once a minute.

import { useEffect } from "react";
import { addTime, adjustTime, updateRecordsAtomic, type Records } from "./records";
import { today } from "./srs";

export const IDLE_MS = 3 * 60_000;
const TICK_MS = 5_000;
const FLUSH_MS = 60_000;

/** Atomic latest-record mutation; preserves concurrent parent edits and timer increments. */
export async function updateRecords(studentId: string, change: (r: Records) => Records): Promise<void> {
  await updateRecordsAtomic(studentId, change, { action: "Learning activity updated" });
}
export async function adjustLogged(studentId: string, courseId: string, date: string, seconds: number): Promise<void> {
  if (seconds) await updateRecords(studentId, r => adjustTime(r, date, courseId, seconds));
}

export function creditTime(studentId: string, courseId: string, seconds: number, date = today()): Promise<void> {
  if (seconds < 1) return Promise.resolve();
  return updateRecords(studentId, (r) => addTime(r, date, courseId, seconds));
}

/** Pure accumulator, separate from the DOM so it can be tested. */
export class ActiveClock {
  private lastInput: number;
  private lastTick: number;
  private seconds = 0;
  constructor(
    now: number,
    private idleMs = IDLE_MS,
  ) {
    this.lastInput = now;
    this.lastTick = now;
  }
  /** True while time counts: visible and some input within the idle limit. */
  counting(now: number, visible: boolean): boolean {
    return visible && now - this.lastInput < this.idleMs;
  }
  input(now: number) {
    this.lastInput = now;
  }
  tick(now: number, visible: boolean) {
    if (this.counting(now, visible)) this.seconds += Math.min(now - this.lastTick, TICK_MS * 2) / 1000;
    this.lastTick = now;
  }
  take(): number {
    const s = this.seconds;
    this.seconds = 0;
    return s;
  }
}

/** Track active time on `courseId` for `studentId` while both are set. */
export function useStudyTimer(studentId: string | null, courseId: string | null) {
  useEffect(() => {
    if (!studentId || !courseId) return;
    const authorize=captureLocalSession();
    const clock = new ActiveClock(Date.now());
    const visible = () => document.visibilityState === "visible";
    const onInput = () => clock.input(Date.now());
    const events = ["keydown", "pointerdown", "pointermove", "wheel", "touchstart", "scroll"] as const;
    for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true });
    const tick = window.setInterval(() => clock.tick(Date.now(), visible()), TICK_MS);
    const flush = () => { const seconds=clock.take(); try { authorize(); assertLocalLearner(studentId); void creditTime(studentId, courseId, seconds).catch(() => {}); } catch { /* Locked time never borrows a new session. */ } };
    const saver = window.setInterval(flush, FLUSH_MS);
    return () => {
      clock.tick(Date.now(), visible());
      for (const e of events) window.removeEventListener(e, onInput, { capture: true });
      window.clearInterval(tick);
      window.clearInterval(saver);
      flush();
    };
  }, [studentId, courseId]);
}
