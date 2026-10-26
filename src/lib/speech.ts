// Speech through the device's own text-to-speech (Web Speech API), plus recorded clips.
// Buttons hide when the device has no voice for the language (some desktop webviews have
// speechSynthesis but no voices at all), so nothing here may throw when speech is missing.

let voices: SpeechSynthesisVoice[] = [];

function synth(): SpeechSynthesis | undefined {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : undefined;
}

function loadVoices() {
  const s = synth();
  if (!s) return;
  try {
    voices = s.getVoices() ?? [];
  } catch {
    voices = [];
  }
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

/** One-off: say a word now (vocabulary). Stops anything else being read. */
export function speak(text: string, lang: string, rate = 0.9) {
  speaker.stop();
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

// ---------------------------------------------------------------------------------------
// The reader: a queue of things to say, one at a time, with pause, resume and stop.

/** One thing to read: TTS text, or a recorded clip (data: URL) that replaces it. */
export interface SayItem {
  text: string;
  /** A recorded clip; when it fails to play, the text is spoken instead. */
  clip?: string;
  /** Highlighted (class "ra-now") while this item is read. */
  el?: HTMLElement | null;
  /** Waits this long (ms) before the item, e.g. a beat between blended sounds and the word. */
  pause?: number;
}

export interface SpeakerState {
  status: "idle" | "playing" | "paused";
  /** Who started the current reading (a lesson, a question…), so each control knows if it's theirs. */
  owner: string | null;
  index: number;
  total: number;
}

/**
 * Long utterances are cut off after ~15 s in some browsers (Chrome), and short ones give
 * natural pauses, so text is spoken a sentence (or ~180 characters) at a time.
 */
export function splitSentences(text: string, max = 180): string[] {
  const out: string[] = [];
  for (const raw of text.replace(/\s+/g, " ").trim().split(/(?<=[.!?;])\s+(?=\S)/)) {
    let s = raw.trim();
    while (s.length > max) {
      const cut = Math.max(s.lastIndexOf(", ", max), s.lastIndexOf(" ", max));
      const at = cut > max / 3 ? cut + 1 : max;
      out.push(s.slice(0, at).trim());
      s = s.slice(at).trim();
    }
    if (s) out.push(s);
  }
  return out;
}

type Opts = { lang: string; rate?: number; owner?: string; scroll?: boolean; onDone?: () => void };

class Speaker {
  private items: SayItem[] = [];
  private pos = 0;
  private status: SpeakerState["status"] = "idle";
  private owner: string | null = null;
  private opts: Opts = { lang: "en" };
  /** Bumped on every stop/pause/advance: callbacks from older utterances are ignored. */
  private gen = 0;
  private audio: HTMLAudioElement | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private lit: HTMLElement | null = null;
  private listeners = new Set<() => void>();
  private snap: SpeakerState = { status: "idle", owner: null, index: 0, total: 0 };

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  };
  getState = () => this.snap;

  private emit() {
    this.snap = { status: this.status, owner: this.owner, index: this.pos, total: this.items.length };
    this.listeners.forEach((f) => f());
  }

  /** Read the items in order (replacing whatever was being read). */
  play(items: SayItem[], opts: Opts) {
    this.halt();
    this.items = items.filter((i) => i.clip || i.text.trim());
    this.pos = 0;
    this.opts = opts;
    this.owner = opts.owner ?? null;
    if (!this.items.length) {
      this.status = "idle";
      this.emit();
      return;
    }
    this.status = "playing";
    this.emit();
    this.run();
  }

  /** Pausing stops the current sentence; resuming starts that item again from its beginning
   * (speechSynthesis.pause() is unreliable across browsers, so it isn't used). */
  pause() {
    if (this.status !== "playing") return;
    this.cut();
    this.status = "paused";
    this.emit();
  }

  resume() {
    if (this.status !== "paused") return;
    this.status = "playing";
    this.emit();
    this.run();
  }

  stop() {
    if (this.status === "idle" && !this.lit) return;
    this.halt();
    this.items = [];
    this.owner = null;
    this.status = "idle";
    this.emit();
  }

  /** Stop only if `owner` started the current reading (e.g. a screen closing). */
  stopIf(owner: string) {
    if (this.owner === owner) this.stop();
  }

  private halt() {
    this.cut();
    this.light(null);
  }

  private cut() {
    this.gen++;
    clearTimeout(this.timer);
    if (this.audio) {
      this.audio.onended = this.audio.onerror = null;
      try {
        this.audio.pause();
      } catch {
        /* already gone */
      }
      this.audio = null;
    }
    try {
      synth()?.cancel();
    } catch {
      /* no speech */
    }
  }

  private light(el: HTMLElement | null | undefined) {
    if (this.lit && this.lit !== el) this.lit.classList.remove("ra-now");
    this.lit = el ?? null;
    if (!el) return;
    el.classList.add("ra-now");
    if (this.opts.scroll && typeof el.getBoundingClientRect === "function") {
      const r = el.getBoundingClientRect();
      if (r.top < 60 || r.bottom > window.innerHeight - 20) el.scrollIntoView?.({ block: "center", behavior: "smooth" });
    }
  }

  private run() {
    const my = ++this.gen;
    if (this.pos >= this.items.length) {
      this.light(null);
      this.status = "idle";
      this.owner = null;
      this.items = [];
      this.emit();
      this.opts.onDone?.();
      return;
    }
    const it = this.items[this.pos];
    this.light(it.el);
    const next = () => {
      if (my !== this.gen) return;
      this.pos++;
      this.emit();
      this.run();
    };
    const sayText = () => (it.text.trim() ? this.say(splitSentences(it.text), my, next) : next());
    const start = () => {
      if (my !== this.gen) return;
      if (it.clip) this.playClip(it.clip, my, next, sayText);
      else sayText();
    };
    if (it.pause) this.timer = setTimeout(start, it.pause);
    else start();
  }

  private playClip(src: string, my: number, done: () => void, fail: () => void) {
    let a: HTMLAudioElement;
    try {
      a = new Audio(src);
    } catch {
      fail();
      return;
    }
    this.audio = a;
    const failed = () => {
      if (my === this.gen) fail();
    };
    a.onended = () => done();
    a.onerror = failed;
    a.play()?.catch?.(failed);
  }

  private say(chunks: string[], my: number, done: () => void) {
    const s = synth();
    const v = voiceFor(this.opts.lang);
    if (!s || !v || !chunks.length) {
      // Nothing can speak this: move on rather than hang.
      this.timer = setTimeout(done, 0);
      return;
    }
    const sayOne = (i: number) => {
      if (my !== this.gen) return;
      if (i >= chunks.length) return done();
      const u = new SpeechSynthesisUtterance(chunks[i]);
      u.lang = this.opts.lang;
      try {
        u.voice = v;
      } catch {
        /* an engine that rejects its own voice object: the language picks one */
      }
      u.rate = this.opts.rate ?? 0.9;
      let finished = false;
      const fin = () => {
        if (finished) return;
        finished = true;
        clearTimeout(this.timer);
        sayOne(i + 1);
      };
      u.onend = fin;
      u.onerror = fin;
      // Some engines never fire onend; don't hang the queue on them.
      clearTimeout(this.timer);
      this.timer = setTimeout(fin, 4000 + chunks[i].length * 140);
      try {
        s.speak(u);
      } catch {
        fin();
      }
    };
    sayOne(0);
  }
}

/** The one reader for the whole app (starting a new reading stops the old one). */
export const speaker = new Speaker();
