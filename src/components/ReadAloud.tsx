// Read-aloud controls: a button that reads something, the lesson's "Read aloud" bar with
// pause and stop, and the listen/blend prompt on early-reader questions.

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Question } from "../lib/types";
import { canSpeak, onVoices, speaker, type SayItem, type SpeakerState } from "../lib/speech";
import { elementItem, READ_LANG, resolveAudio, sayItem, type AudioLib } from "../lib/readAloud";
import { handlePhonicsClick, hydratePhonics, parseUnits, renderBlendWord } from "../lib/phonics";

export function useSpeaker(): SpeakerState {
  return useSyncExternalStore(speaker.subscribe, speaker.getState, speaker.getState);
}

/** Whether the device has a voice (voices can arrive a moment after the page loads). */
export function useCanSpeak(lang = READ_LANG): boolean {
  const [, tick] = useState(0);
  useEffect(() => onVoices(() => tick((n) => n + 1)), []);
  return canSpeak(lang);
}

export function SpeakerIcon() {
  return (
    <svg className="ra-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Reads something aloud; pressing it again while it's reading stops it. Hidden when nothing
 * can be heard (no voice and no recording).
 */
export function SayButton({
  owner,
  items,
  label,
  text,
  className = "btn ghost sm ra-say",
  hasClip,
}: {
  owner: string;
  /** Built on click, so it reads the page as it is then. */
  items: () => SayItem[];
  /** Accessible name (and tooltip). */
  label: string;
  /** Visible words beside the icon, if any. */
  text?: string;
  className?: string;
  /** A recording exists, so the button works even with no voice. */
  hasClip?: boolean;
}) {
  const st = useSpeaker();
  const tts = useCanSpeak();
  if (!tts && !hasClip) return null;
  const on = st.owner === owner && st.status !== "idle";
  return (
    <button
      type="button"
      className={`${className}${on ? " is-playing" : ""}`}
      aria-label={text ? undefined : on ? "Stop reading" : label}
      title={label}
      aria-pressed={on}
      onClick={() => (on ? speaker.stop() : speaker.play(items(), { lang: READ_LANG, owner }))}
    >
      <SpeakerIcon />
      {text && <span>{on ? "Stop" : text}</span>}
    </button>
  );
}

/**
 * The lesson's reader: reads every part of the lesson in order, highlighting the part being
 * read, with Pause/Resume and Stop. Hidden when the device has no voice.
 */
export function ReadAloudBar({
  owner,
  units,
  lib,
  prominent,
}: {
  owner: string;
  /** The parts to read, in order (collected when reading starts). */
  units: () => HTMLElement[];
  lib?: AudioLib;
  /** Early-reader courses: a big button. */
  prominent?: boolean;
}) {
  const st = useSpeaker();
  const tts = useCanSpeak();
  const mine = st.owner === owner && st.status !== "idle";
  useEffect(() => () => speaker.stopIf(owner), [owner]);
  if (!tts) return null;
  const start = () =>
    speaker.play(
      units().map((u) => elementItem(u, lib)),
      { lang: READ_LANG, owner, scroll: true },
    );
  return (
    <div className={`ra-bar${prominent ? " is-prominent" : ""}${mine ? " is-active" : ""}`} role="group" aria-label="Read aloud">
      {!mine ? (
        <button type="button" className={prominent ? "btn primary ra-start" : "btn sm ghost ra-start"} onClick={start}>
          <SpeakerIcon />
          <span>{prominent ? "Read the lesson to me" : "Read aloud"}</span>
        </button>
      ) : (
        <>
          {st.status === "playing" ? (
            <button type="button" className="btn sm" onClick={() => speaker.pause()}>
              Pause
            </button>
          ) : (
            <button type="button" className="btn sm primary" onClick={() => speaker.resume()}>
              Resume
            </button>
          )}
          <button type="button" className="btn sm ghost" onClick={() => speaker.stop()}>
            Stop
          </button>
          <span className="small muted ra-pos">
            {st.status === "paused" ? "Paused at" : "Reading"} part {Math.min(st.index + 1, st.total)} of {st.total}
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Early-reader question extras: a Listen button for `listen` and tappable sound tiles for
 * `blend`. Uses the same HTML and click handling as the lesson blocks.
 */
export function PhonicsPrompt({ q, lib }: { q: Question; lib?: AudioLib }) {
  const ref = useRef<HTMLDivElement>(null);
  const tts = useCanSpeak();
  const listenClip = q.listen ? !!resolveAudio(lib, q.listen).clip : false;
  const html = useMemo(
    () =>
      q.blend?.length
        ? `<div class="ph ph-blend in-question">${renderBlendWord({ word: q.blend.join(""), units: parseUnits(q.blend.join(" ")) }, 0, { quiz: true })}<p class="ph-nosound" hidden>Sound isn't available on this device.</p></div>`
        : "",
    [q.blend],
  );
  useEffect(() => {
    if (ref.current) hydratePhonics(ref.current, { lib, lang: READ_LANG });
  }, [html, lib, tts]);
  if (!q.listen && !html) return null;
  return (
    <div className="phonics-prompt">
      {q.listen && (tts || listenClip) && (
        <SayButton
          owner={`listen-${q.id}`}
          className="btn primary listen-btn"
          label="Listen"
          text="Listen"
          hasClip={listenClip}
          items={() => [sayItem(lib, q.listen!)]}
        />
      )}
      {q.listen && !tts && !listenClip && <p className="small muted">Sound isn&rsquo;t available on this device, so this question can&rsquo;t be played.</p>}
      {html && <div ref={ref} onClick={(e) => handlePhonicsClick(e.target as Element, { lib, lang: READ_LANG })} dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
}
