// Pronunciation through the device's own text-to-speech (Web Speech API).
// Hidden when the device has no voice for the language.

let voices: SpeechSynthesisVoice[] = [];

function synth(): SpeechSynthesis | undefined {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : undefined;
}

function loadVoices() {
  const s = synth();
  if (s) voices = s.getVoices();
}
loadVoices();
synth()?.addEventListener?.("voiceschanged", loadVoices);

const base = (tag: string) => tag.toLowerCase().split(/[-_]/)[0];

/** A voice for the language, preferring an exact region match. */
export function voiceFor(lang: string): SpeechSynthesisVoice | undefined {
  if (!voices.length) loadVoices();
  const l = lang.toLowerCase().replace("_", "-");
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === l) ?? voices.find((v) => base(v.lang) === base(lang))
  );
}

/** True when speech is available at all (voices can load late, so the button may appear after a moment). */
export function canSpeak(lang?: string): boolean {
  if (!lang || !synth()) return false;
  return !!voiceFor(lang);
}

export function speak(text: string, lang: string, rate = 0.9) {
  const s = synth();
  if (!s) return;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const v = voiceFor(lang);
  if (v) u.voice = v;
  u.rate = rate;
  s.speak(u);
}

/** Re-render hook target: resolves once voices are known (some browsers load them asynchronously). */
export function onVoices(cb: () => void): () => void {
  const s = synth();
  if (!s?.addEventListener) return () => {};
  s.addEventListener("voiceschanged", cb);
  return () => s.removeEventListener("voiceschanged", cb);
}

/**
 * Speak and resolve when the voice finishes (or is stopped). Used to play a dialogue or a page
 * line by line. Resolves at once when there's no speech engine.
 */
export function speakAsync(text: string, lang: string, rate = 0.9): Promise<void> {
  const s = synth();
  if (!s || !text.trim()) return Promise.resolve();
  return new Promise((resolve) => {
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = voiceFor(lang);
    if (v) u.voice = v;
    u.rate = rate;
    let done = false;
    let started = false;
    const t0 = Date.now();
    const end = () => {
      if (done) return;
      done = true;
      window.clearInterval(watch);
      resolve();
    };
    u.onstart = () => (started = true);
    u.onend = end;
    u.onerror = end;
    // Some engines never fire onend after cancel(); stop waiting once nothing is speaking.
    const watch = window.setInterval(() => {
      if ((started || Date.now() - t0 > 3000) && !s.speaking && !s.pending) end();
    }, 400);
    s.speak(u);
  });
}

export function stopSpeaking() {
  synth()?.cancel();
}
