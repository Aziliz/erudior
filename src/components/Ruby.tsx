import { useEffect, useId, useState } from "react";
import type { PronScheme } from "../lib/types";
import { activeScheme, applyPronStyle, audioNote, onPronChange, registerSchemes, schemesFor, setScheme } from "../lib/pronunciation";
import DOMPurify from "dompurify";
import { accentList, autoRuby, hasKanji, pitchHtml, rubyHtml } from "../lib/kana";
import { pinyinPairs, pinyinRubyHtml } from "../lib/pinyin";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Japanese text with furigana: `{漢字|かんじ}` markup in `text` (and pitch markup, `{橋|はし:2}`,
 * `[はし:2]`), or a whole word plus its kana `reading` (the reading goes over the kanji only).
 * `pitch` marks the accent on a kana-only word (a word with kanji shows its accent on the
 * reading instead: see PitchText). Chinese: `{汉字|hàn zì}` markup, or a term plus its pinyin
 * `reading` (one syllable over each character). Other languages render as plain text.
 */
export function RubyText({ text, reading, lang, pitch }: { text: string; reading?: string; lang?: string; pitch?: number | number[] }) {
  if (lang === "zh") {
    const pairs = reading && !/[{|]/.test(text) ? pinyinPairs(text, reading, true) : null;
    const html = pairs ? pinyinRubyHtml(pairs) : rubyHtml(escapeHtml(text), false);
    if (!html.includes("<ruby")) return <>{text}</>;
    return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
  }
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

// --- Learner switches (per device): furigana, pitch accent, pinyin, tone colours ------------

/**
 * A per-device on/off setting mirrored as a class on <html>. By default the setting is on and
 * the class marks "off" (furigana-off); `defaultOn: false` settings put their class on when on.
 */
function makeSetting(key: string, htmlClass: string, defaultOn = true) {
  const listeners = new Set<(on: boolean) => void>();
  const isOn = (): boolean => {
    try {
      const v = localStorage.getItem(key);
      return defaultOn ? v !== "off" : v === "on";
    } catch {
      return defaultOn;
    }
  };
  /** Apply the saved setting to the page (CSS hides the marks when off). */
  const apply = (on = isOn()) => {
    if (typeof document !== "undefined") document.documentElement.classList.toggle(htmlClass, defaultOn ? !on : on);
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
const pinyin = makeSetting("erudior.pinyin", "pinyin-off");
const toneColours = makeSetting("erudior.tones", "tones-on", false);
const traditionalScript = makeSetting("erudior.zhScript", "zh-trad", false);

export const furiganaOn = furigana.isOn;
export const applyFurigana = furigana.apply;
export const setFurigana = furigana.set;
export const pitchOn = pitchAccent.isOn;
export const applyPitch = pitchAccent.apply;
export const setPitch = pitchAccent.set;
export const pinyinOn = pinyin.isOn;
export const applyPinyin = pinyin.apply;
export const setPinyin = pinyin.set;
export const toneColoursOn = toneColours.isOn;
export const applyToneColours = toneColours.apply;
export const setToneColours = toneColours.set;
/** Chinese courses shown in traditional characters (per device; off = simplified). */
export const traditionalOn = traditionalScript.isOn;
export const applyTraditional = traditionalScript.apply;
export const setTraditional = traditionalScript.set;
export const useTraditional = traditionalScript.useSetting;

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

/** A switch that shows or hides pinyin over Chinese characters (shown on Chinese course screens). */
export function PinyinToggle({ className = "" }: { className?: string }) {
  const on = pinyin.useSetting();
  return (
    <button
      type="button"
      className={`btn sm ghost pinyin-toggle ${className}`}
      aria-pressed={on}
      title="Show the pinyin above Chinese characters"
      onClick={() => setPinyin(!on)}
    >
      <span lang="zh" aria-hidden="true">
        <ruby className="py">
          字<rt>zì</rt>
        </ruby>
      </span>{" "}
      Pinyin {on ? "on" : "off"}
    </button>
  );
}

/** A switch that colours characters and pinyin by tone (off unless the learner turns it on). */
export function ToneToggle({ className = "" }: { className?: string }) {
  const on = toneColours.useSetting();
  return (
    <button
      type="button"
      className={`btn sm ghost tone-toggle ${className}`}
      aria-pressed={on}
      title="Colour each syllable by its tone (tones 1–4 and neutral)"
      onClick={() => setToneColours(!on)}
    >
      <span lang="zh-Latn" aria-hidden="true">
        {["ā", "á", "ǎ", "à"].map((v, i) => (
          <span key={v} className={`tn t${i + 1}`}>{v}</span>
        ))}
      </span>{" "}
      Tone colours {on ? "on" : "off"}
    </button>
  );
}

/** Simplified or traditional characters for the whole course (shown on courses that can convert). */
export function ScriptToggle({ className = "" }: { className?: string }) {
  const on = traditionalScript.useSetting();
  return (
    <button
      type="button"
      className={`btn sm ghost script-toggle ${className}`}
      aria-pressed={on}
      title="Show the course in traditional characters (Taiwan forms) instead of simplified"
      onClick={() => setTraditional(!on)}
    >
      <span lang={on ? "zh-Hant" : "zh-Hans"} aria-hidden="true">
        {on ? "繁" : "简"}
      </span>{" "}
      {on ? "Traditional" : "Simplified"}
    </button>
  );
}

/** The Chinese switches, side by side (the script switch when the course can convert). */
export function ChineseToggles({ script = false }: { script?: boolean }) {
  return (
    <>
      <PinyinToggle />
      <ToneToggle />
      {script && <ScriptToggle />}
    </>
  );
}

/**
 * The learner's pronunciation for a language that teaches more than one (Latin: restored or
 * ecclesiastical; Greek: restored or modern), per language on this device. It picks which
 * ```pron blocks show and how the voice reads; the line beside it says the audio is approximate.
 */
export function PronunciationSwitch({ code, schemes }: { code?: string; schemes?: PronScheme[] }) {
  registerSchemes(code, schemes);
  const [, tick] = useState(0);
  const id = useId();
  useEffect(() => {
    applyPronStyle();
    return onPronChange(() => tick((n) => n + 1));
  }, []);
  const list = schemesFor(code);
  if (!code || list.length < 2) return null;
  const on = activeScheme(code) ?? list[0].id;
  return (
    <span className="pron-switch">
      <label htmlFor={id} className="small">
        Pronunciation
      </label>
      <select id={id} className="select sm" value={on} onChange={(e) => setScheme(code, e.target.value)}>
        {list.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <span className="small muted pron-audio-note">{audioNote(code, on)}</span>
    </span>
  );
}

/** The reading switches for a course language: Japanese or Chinese ones, the pronunciation switch, else nothing. */
export function LanguageToggles({ code, script, pron }: { code?: string; script?: boolean; pron?: PronScheme[] }) {
  if (code === "ja") return <JapaneseToggles />;
  if (code === "zh") return <ChineseToggles script={script} />;
  if (pron && pron.length > 1) return <PronunciationSwitch code={code} schemes={pron} />;
  return null;
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
