// Tone questions (Chinese): hear a syllable or word, pick the tone of each syllable. Used by the
// question runner (type "tone") and by tone practice rounds (pages/ToneRunner.tsx).
//
// With a Mandarin voice (or a recording) the learner listens: the syllables are shown without
// tone marks and the characters stay hidden until the answer is checked. With no voice the item
// says so, shows the characters and toneless pinyin, and asks for the tones from memory.

import { useEffect, useId, useRef, useState } from "react";
import type { Chosen } from "../lib/types";
import { playClip, stopAudio } from "../lib/audio";
import { canSpeak, onVoices } from "../lib/speech";
import { picksOf, TONE_GLYPH, toneFeedback, toneFromKey, toneKey, toneLabel, toneParts, TONES, toneShort, toneSyllables } from "../lib/tones";
import { RubyText } from "./Ruby";

/** The voice language for Chinese tone items: the course's Mandarin voice, else zh-CN. */
export const toneVoice = (tts?: string) => (tts && /^(zh|cmn)([-_](?!hk|mo)|$)/i.test(tts) ? tts : "zh-CN");

/** Can this device play the item: a recording, or a Mandarin voice for the characters? */
export function toneAudible(voice: string, clip?: string) {
  return !!clip || canSpeak(voice);
}

interface Props {
  /** Stable id of the item (resets the picks' focus and stops the sound when it changes). */
  id: string;
  text: string;
  reading: string;
  chosen: Chosen;
  onChange?: (next: Chosen) => void;
  /** Enter on a tone (check the answer, or go on once checked). */
  onEnter?: () => void;
  reveal?: boolean;
  disabled?: boolean;
  /** Review screens: smaller, no sound. */
  review?: boolean;
  /** Voice language (e.g. the course's "zh-CN"). */
  voice?: string;
  /** A recording (data:audio URL) that replaces the device's voice. */
  clip?: string;
  /** Say the item when it first appears (tone practice rounds). */
  autoPlay?: boolean;
}

export default function ToneAnswer({ id, text, reading, chosen, onChange, onEnter, reveal, disabled, review, voice: tts, clip, autoPlay }: Props) {
  const [, tick] = useState(0);
  useEffect(() => onVoices(() => tick((n) => n + 1)), []);
  const syls = toneSyllables(text, reading);
  const picks = picksOf(chosen, syls.length);
  const off = !!(disabled || reveal || review || !onChange);
  const voice = toneVoice(tts);
  const audible = toneAudible(voice, clip);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<"normal" | "slow" | null>(null);
  const [said, setSaid] = useState("");
  const uid = useId();
  const box = useRef<HTMLDivElement>(null);
  const parts = reveal ? toneParts(syls.map((s) => s.tone), picks) : [];

  const play = (how: "normal" | "slow") => {
    setPlaying(how);
    playClip(clip ? { src: clip } : { text, lang: voice }, { rate: how === "slow" ? 0.65 : 1 }).finally(() => setPlaying((p) => (p === how ? null : p)));
  };

  useEffect(() => {
    setActive(0);
    setSaid("");
    if (autoPlay && audible && !review) {
      const t = window.setTimeout(() => play("normal"), 250);
      return () => {
        window.clearTimeout(t);
        stopAudio();
      };
    }
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const pick = (i: number, tone: number) => {
    if (off) return;
    const next = picks.map((t, j) => (j === i ? tone : t));
    onChange!(next);
    setSaid(`${syls.length > 1 ? `Syllable ${i + 1}: ` : ""}${toneLabel(tone)}`);
    if (i + 1 < syls.length) setActive(i + 1);
  };

  // Keys 1–4 pick a tone and 5 (or 0) the neutral tone, for the syllable in turn.
  useEffect(() => {
    if (off) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest("textarea, select, [contenteditable], input:not([type=radio])")) return;
      if (t?.closest("input[type=radio]") && !box.current?.contains(t)) return;
      const tone = toneFromKey(e.key);
      if (tone === undefined) return;
      e.preventDefault();
      pick(Math.min(active, syls.length - 1), tone);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!syls.length) return <p className="small muted">This tone item can't be shown (its characters and pinyin don't match).</p>;
  const plainWord = syls.map((s) => s.plain).join(" ");

  return (
    <div className={`tone-q${review ? " review" : ""}`} ref={box}>
      {!review &&
        (audible ? (
          <div className="row tone-listen">
            <button type="button" className="btn" onClick={() => play("normal")} aria-pressed={playing === "normal"}>
              🔊 {playing === "normal" ? "Playing…" : "Listen"}
            </button>
            <button type="button" className="btn ghost" onClick={() => play("slow")} aria-pressed={playing === "slow"}>
              {playing === "slow" ? "Playing slowly…" : "Listen slowly"}
            </button>
          </div>
        ) : (
          <p className="tone-novoice small" role="note">
            <strong>From memory:</strong> this device has no Mandarin voice, so you can't hear it. Pick the {syls.length > 1 ? "tones" : "tone"} you
            remember for the word. To practise by ear, add a Chinese (Mandarin) voice in the device's speech settings.
          </p>
        ))}
      {(!audible || reveal || review) && (
        <p className="tone-word" lang="zh">
          <span className="tone-chars">{syls.map((s) => s.chars).join("")}</span>
          {!reveal && !review && <span className="tone-plain muted" lang="zh-Latn"> {plainWord}</span>}
        </p>
      )}
      <div className="tone-rows">
        {syls.map((s, i) => {
          const name = `${uid}-s${i}`;
          const heading = `${syls.length > 1 ? `Syllable ${i + 1} of ${syls.length}: ` : "Tone of "}${s.plain}`;
          return (
            <div key={i} className={`tone-row${active === i && !off ? " active" : ""}`}>
              <div className="tone-syl" id={`${name}-h`} lang="zh-Latn">
                <span className="sr-only">{heading}</span>
                <span aria-hidden="true">{reveal || review ? <span className={`tn t${s.tone}`}>{s.marked}</span> : s.plain}</span>
                {reveal && (
                  <span className={`part-mark ${parts[i] ? "ok" : "bad"}`}>
                    {parts[i] ? "✓" : "✗"} {toneLabel(s.tone)}
                  </span>
                )}
              </div>
              <div className="tone-opts" role="radiogroup" aria-labelledby={`${name}-h`}>
                {TONES.map((t) => {
                  const on = picks[i] === t;
                  return (
                    <label key={t} className={`tone-opt${on ? " on" : ""}${reveal && t === s.tone ? " answer" : ""}`}>
                      <input
                        type="radio"
                        name={name}
                        value={t}
                        checked={on}
                        disabled={off}
                        aria-label={toneLabel(t)}
                        onChange={() => pick(i, t)}
                        onFocus={() => setActive(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && onEnter) {
                            e.preventDefault();
                            onEnter();
                          }
                        }}
                      />
                      <span className="tone-key" aria-hidden="true">{toneKey(t)}</span>
                      <span className={`tone-glyph tn t${t}`} aria-hidden="true" lang="zh-Latn">{TONE_GLYPH[t]}</span>
                      <span className="tone-name" aria-hidden="true">{toneShort(t) === "neutral" ? "neutral" : ["", "high", "rising", "dip", "falling"][t]}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!off && <p className="small muted tone-help">Keys: 1–4 for the tones, 5 for neutral{syls.length > 1 ? ", one syllable after another" : ""}.</p>}
      <p className="sr-only" aria-live="polite">{said}</p>
      {reveal && (
        <p className="tone-answer" lang="zh">
          <span className="tone-chars-big">
            <RubyText text={text} reading={reading} lang="zh" />
          </span>{" "}
          <span lang="en">{toneFeedback(syls)}</span>
        </p>
      )}
    </div>
  );
}
