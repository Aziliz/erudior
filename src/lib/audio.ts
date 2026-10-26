// Sound for listening practice: a course's recorded clips (data:audio/… URLs, embedded in the
// course file like pictures) with the device's text-to-speech as the fallback. One sound plays
// at a time across the app: starting one stops the last.

import type { AudioClip } from "./types";
import { canSpeak, speakAsync, stopSpeaking } from "./speech";

/** Embedded audio the app accepts: common formats the desktop web views and browsers decode. */
export const AUDIO_SRC = /^data:audio\/(mpeg|mp3|mp4|aac|x-m4a|ogg|opus|wav|x-wav|wave|webm|flac);base64,[A-Za-z0-9+/]+={0,2}$/;
export const isAudioSrc = (s: unknown): s is string => typeof s === "string" && AUDIO_SRC.test(s);

/** About how many bytes a data URL holds (for the course checker's size warning). */
export const audioBytes = (src: string) => Math.round(((src.length - src.indexOf(",") - 1) * 3) / 4);

let stopCurrent: (() => void) | null = null;

/** Stop whatever is playing (clip or voice). */
export function stopAudio() {
  const stop = stopCurrent;
  stopCurrent = null;
  stop?.();
  stopSpeaking();
}

/** True when the clip can be heard on this device: a recording, or a voice for its language. */
export function canPlay(c: AudioClip | undefined, fallbackLang?: string): boolean {
  if (!c) return false;
  if (c.src) return true;
  return !!c.text && canSpeak(c.lang ?? fallbackLang);
}

/** Play an audio element (a clip or the student's own recording) until it ends or is stopped. */
export function playElement(a: HTMLAudioElement, rate = 1): Promise<void> {
  stopAudio();
  return new Promise((resolve) => {
    a.playbackRate = rate;
    // Keep the pitch natural when slowed down.
    (a as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
    const end = () => {
      a.removeEventListener("ended", end);
      a.removeEventListener("error", end);
      if (stopCurrent === stop) stopCurrent = null;
      resolve();
    };
    const stop = () => {
      a.pause();
      end();
    };
    stopCurrent = stop;
    a.addEventListener("ended", end);
    a.addEventListener("error", end);
    a.currentTime = 0;
    a.play().catch(end);
  });
}

/** Play a recording (or speak the text) and resolve when it ends or is stopped. */
export function playClip(c: AudioClip, opts: { rate?: number; fallbackLang?: string } = {}): Promise<void> {
  const rate = opts.rate ?? 1;
  if (c.src && typeof Audio !== "undefined") return playElement(new Audio(c.src), rate);
  stopAudio();
  const lang = c.lang ?? opts.fallbackLang;
  if (c.text && lang) return speakAsync(c.text, lang, 0.9 * rate);
  return Promise.resolve();
}
