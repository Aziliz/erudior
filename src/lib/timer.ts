// Active study time for homeschool records. Counts while a study screen is open, the window is
// visible, and the student did something (typed, clicked, scrolled, touched) in the last few
// minutes; otherwise it pauses. Saved to the student's records about once a minute.

import { useEffect } from "react";
import { addTime, adjustTime, loadRecords, saveRecords } from "./records";
import { today } from "./srs";

export const IDLE_MS = 3 * 60_000;
const TICK_MS = 5_000;
const FLUSH_MS = 60_000;

// Writes to one records file go one at a time.
let chain: Promise<unknown> = Promise.resolve();
export function creditTime(studentId: string, courseId: string, seconds: number, date = today()): Promise<void> {
  const next = chain.then(async () => {
    if (seconds < 1) return;
    await saveRecords(studentId, addTime(await loadRecords(studentId), date, courseId, seconds));
  });
  chain = next.catch(() => {});
  return next;
}

/** Logged minutes (activity logs) added or taken back; same write queue as tracked time. */
export function adjustLogged(studentId: string, courseId: string, date: string, seconds: number): Promise<void> {
  const next = chain.then(async () => {
    if (!seconds) return;
    await saveRecords(studentId, adjustTime(await loadRecords(studentId), date, courseId, seconds));
  });
  chain = next.catch(() => {});
  return next;
}

/** Pure accumulator, separate from the DOM so it can be tested. */
export class ActiveClock {
  private lastInput: number;
  private lastTick: number;
  private seconds = 0;
  constructor(now: number) {
    this.lastInput = now;
    this.lastTick = now;
  }
  input(now: number) {
    this.lastInput = now;
  }
  tick(now: number, visible: boolean) {
    if (visible && now - this.lastInput < IDLE_MS) this.seconds += Math.min(now - this.lastTick, TICK_MS * 2) / 1000;
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
    const clock = new ActiveClock(Date.now());
    const visible = () => document.visibilityState === "visible";
    const onInput = () => clock.input(Date.now());
    const events = ["keydown", "pointerdown", "pointermove", "wheel", "touchstart", "scroll"] as const;
    for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true });
    const tick = window.setInterval(() => clock.tick(Date.now(), visible()), TICK_MS);
    const flush = () => creditTime(studentId, courseId, clock.take()).catch(() => {});
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
