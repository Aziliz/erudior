import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { accentList, autoRuby, hasKanji, pitchHtml, rubyHtml } from "../lib/kana";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Japanese text with furigana: `{漢字|かんじ}` markup in `text` (and pitch markup, `{橋|はし:2}`,
 * `[はし:2]`), or a whole word plus its kana `reading` (the reading goes over the kanji only).
 * `pitch` marks the accent on a kana-only word (a word with kanji shows its accent on the
 * reading instead: see PitchText). Other languages render as plain text.
 */
export function RubyText({ text, reading, lang, pitch }: { text: string; reading?: string; lang?: string; pitch?: number | number[] }) {
  if (lang !== "ja") return <>{text}</>;
  if (accentList(pitch).length && !hasKanji(text) && !/[{[]/.test(text)) return <PitchText kana={text} pitch={pitch} />;
  const marked = reading ? autoRuby(text, reading) : text;
  if (!marked.includes("|") && !marked.includes("[")) return <>{text}</>;
  return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rubyHtml(escapeHtml(marked), false)) }} />;
}

/** Kana with its pitch accent marked (a line over high morae, a tick where the pitch drops). */
export function PitchText({ kana, pitch }: { kana: string; pitch?: number | number[] }) {
  if (!accentList(pitch).length) return <>{kana}</>;
  return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pitchHtml(kana, pitch)) }} />;
}

// --- Learner switches (per device): furigana, pitch accent ----------------------------------

function makeSetting(key: string, htmlClass: string) {
  const listeners = new Set<(on: boolean) => void>();
  const isOn = (): boolean => {
    try {
      return localStorage.getItem(key) !== "off";
    } catch {
      return true;
    }
  };
  /** Apply the saved setting to the page (CSS hides the marks when off). */
  const apply = (on = isOn()) => {
    if (typeof document !== "undefined") document.documentElement.classList.toggle(htmlClass, !on);
  };
  const set = (on: boolean) => {
    try {
      localStorage.setItem(key, on ? "on" : "off");
    } catch {
      /* storage unavailable: setting lasts for this page view */
    }
    apply(on);
    listeners.forEach((f) => f(on));
  };
  const useSetting = () => {
    const [on, setOn] = useState(isOn);
    useEffect(() => {
      apply(on);
      listeners.add(setOn);
      return () => {
        listeners.delete(setOn);
      };
    }, []);
    return on;
  };
  return { isOn, apply, set, useSetting };
}

const furigana = makeSetting("erudior.furigana", "furigana-off");
const pitchAccent = makeSetting("erudior.pitch", "pitch-off");

export const furiganaOn = furigana.isOn;
export const applyFurigana = furigana.apply;
export const setFurigana = furigana.set;
export const pitchOn = pitchAccent.isOn;
export const applyPitch = pitchAccent.apply;
export const setPitch = pitchAccent.set;

/** A switch that shows or hides furigana everywhere (shown on Japanese course screens). */
export function FuriganaToggle({ className = "" }: { className?: string }) {
  const on = furigana.useSetting();
  return (
    <button
      type="button"
      className={`btn sm ghost furigana-toggle ${className}`}
      aria-pressed={on}
      title="Show the kana reading above kanji"
      onClick={() => setFurigana(!on)}
    >
      <span lang="ja" aria-hidden="true">
        <ruby>
          字<rt>じ</rt>
        </ruby>
      </span>{" "}
      Furigana {on ? "on" : "off"}
    </button>
  );
}

/** A switch that shows or hides pitch-accent marks everywhere (next to the furigana switch). */
export function PitchToggle({ className = "" }: { className?: string }) {
  const on = pitchAccent.useSetting();
  return (
    <button
      type="button"
      className={`btn sm ghost pitch-toggle ${className}`}
      aria-pressed={on}
      title="Mark where the pitch is high and where it drops"
      onClick={() => setPitch(!on)}
    >
      <span lang="ja" aria-hidden="true" className="pa">
        <span className="pa-w">
          <span className="pa-m pa-l">は</span>
          <span className="pa-m pa-h pa-d">し</span>
        </span>
      </span>{" "}
      Pitch accent {on ? "on" : "off"}
    </button>
  );
}

/** Both Japanese switches, side by side. */
export function JapaneseToggles() {
  return (
    <>
      <FuriganaToggle />
      <PitchToggle />
    </>
  );
}
