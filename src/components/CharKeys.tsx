// Character buttons under a typing box: the course's `keys` (ä ö ü ß, ā ē ī ō ū ȳ…) and, for
// Ancient Greek (ime "grc"), the breathings, accents, iota subscript, diaeresis and ς. A Greek
// mark combines with the letter before the caret (ἀ + ´ → ἄ); a second mark of the same kind
// replaces the first.

import type { Ime } from "../lib/ime";
import { insertGreekMark } from "../lib/greek";

export const GREEK_KEYS: { ch: string; show: string; label: string }[] = [
  { ch: "̓", show: "ἀ", label: "Smooth breathing" },
  { ch: "̔", show: "ἁ", label: "Rough breathing" },
  { ch: "́", show: "ά", label: "Acute accent" },
  { ch: "̀", show: "ὰ", label: "Grave accent" },
  { ch: "͂", show: "ᾶ", label: "Circumflex" },
  { ch: "ͅ", show: "ᾳ", label: "Iota subscript" },
  { ch: "̈", show: "ϊ", label: "Diaeresis" },
  { ch: "ς", show: "ς", label: "Final sigma" },
];

const COMBINING = /^[̀-ͯ]$/;

/** The box after a key: inserted at the selection (a Greek mark joins the letter before it), then the ime. */
export function applyKey(value: string, start: number, end: number, ch: string, ime?: Ime): { text: string; caret: number } {
  if (COMBINING.test(ch) || (ch === "ς" && ime)) {
    const r = insertGreekMark(value.slice(0, start) + value.slice(end), start, ch);
    return r;
  }
  const head = value.slice(0, start) + ch;
  const converted = ime ? ime(head) : head;
  const text = ime ? ime(converted + value.slice(end)) : converted + value.slice(end);
  return { text, caret: converted.length };
}

/**
 * The buttons. `greek`: show the Greek marks. `onKey` gets the character; the caller applies it
 * with applyKey to its own box and keeps focus there (buttons don't take focus on mouse down).
 */
export default function CharKeys({ keys, greek, onKey, label = "Special characters" }: { keys?: string[]; greek?: boolean; onKey: (ch: string) => void; label?: string }) {
  const own = (keys ?? []).filter((k) => !greek || !GREEK_KEYS.some((g) => g.ch === k));
  if (!own.length && !greek) return null;
  return (
    <div className="char-keys" role="group" aria-label={label}>
      {greek &&
        GREEK_KEYS.map((k) => (
          <button key={k.label} type="button" className="btn char-key" lang="grc" aria-label={k.label} title={k.label} onMouseDown={(e) => e.preventDefault()} onClick={() => onKey(k.ch)}>
            {k.show}
          </button>
        ))}
      {own.map((k) => (
        <button key={k} type="button" className="btn char-key" onMouseDown={(e) => e.preventDefault()} onClick={() => onKey(k)}>
          {k}
        </button>
      ))}
    </div>
  );
}
