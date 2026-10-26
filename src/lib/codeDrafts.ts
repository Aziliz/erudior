// Code drafts: what a student last typed for an exercise or a lesson's code block, kept on this
// device (per student in homeschool families) so leaving and coming back doesn't lose it. A
// convenience only: graded work is saved with the session like any other answer.
import { activeStudent } from "./storage";

const PREFIX = "erudior.code.";
const MAX = 200; // drafts kept; the oldest are dropped
const key = (k: string) => `${PREFIX}${activeStudent() ?? "_"}.${k}`;

export function loadDraft(k: string): string | null {
  try {
    const raw = localStorage.getItem(key(k));
    return raw === null ? null : (JSON.parse(raw) as { code: string }).code;
  } catch {
    return null;
  }
}

export function saveDraft(k: string, code: string | null): void {
  try {
    if (code === null) return localStorage.removeItem(key(k));
    localStorage.setItem(key(k), JSON.stringify({ code, at: Date.now() }));
    const all = Object.keys(localStorage).filter((x) => x.startsWith(PREFIX));
    if (all.length > MAX) {
      const age = (x: string) => {
        try {
          return (JSON.parse(localStorage.getItem(x) ?? "{}") as { at?: number }).at ?? 0;
        } catch {
          return 0;
        }
      };
      all.sort((a, b) => age(a) - age(b)).slice(0, all.length - MAX).forEach((x) => localStorage.removeItem(x));
    }
  } catch {
    /* storage full or blocked: drafts are optional */
  }
}
