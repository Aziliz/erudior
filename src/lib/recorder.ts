// The student's own voice, for speaking practice (record, then compare with the model).
// Recordings stay on the device: they're kept in memory as blob: URLs while the page is open
// and are gone when it closes, unless the student saves a copy (lib/storage.ts saveBlob).
// Nothing is uploaded and there's no automatic scoring.

/** Longest recording; speaking drills are a sentence or two. */
export const MAX_SECONDS = 30;

export const canRecord = () =>
  typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";

/** A friendly message for a failed microphone request. */
export function micError(e: unknown): string {
  const name = (e as { name?: string })?.name ?? "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "The microphone isn't allowed. To record yourself, allow Erudior to use the microphone (in your browser's site settings, or your computer's privacy settings), then try again.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "No microphone was found. Plug one in (or turn it on) and try again.";
  if (name === "NotReadableError" || name === "AbortError") return "The microphone is busy or not working. Close other apps that use it and try again.";
  return "Recording didn't start on this device. You can still listen and repeat out loud.";
}

/** The first container format this device can record (WebKit records mp4, Chromium and Firefox webm/ogg). */
function pickType(): string | undefined {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
  return types.find((t) => MediaRecorder.isTypeSupported?.(t));
}

export interface Recording {
  blob: Blob;
  url: string;
  type: string;
  seconds: number;
}

export interface ActiveRecording {
  /** Resolves with the recording once stopped (by `stop()` or after MAX_SECONDS). */
  done: Promise<Recording>;
  stop: () => void;
}

/** Ask for the microphone and start recording. Throws (see micError) when it can't. */
export async function startRecording(): Promise<ActiveRecording> {
  if (!canRecord()) throw Object.assign(new Error("unsupported"), { name: "NotSupportedError" });
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const type = pickType();
  let rec: MediaRecorder;
  try {
    rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  } catch (e) {
    stream.getTracks().forEach((t) => t.stop());
    throw e;
  }
  const chunks: Blob[] = [];
  const t0 = Date.now();
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise<Recording>((resolve, reject) => {
    rec.onstop = () => {
      // Release the microphone at once, so the system's "in use" light goes off.
      stream.getTracks().forEach((t) => t.stop());
      window.clearTimeout(limit);
      const blob = new Blob(chunks, { type: rec.mimeType || type || "audio/webm" });
      if (!blob.size) return reject(Object.assign(new Error("empty"), { name: "AbortError" }));
      resolve({ blob, url: URL.createObjectURL(blob), type: blob.type, seconds: (Date.now() - t0) / 1000 });
    };
    rec.onerror = (e) => {
      stream.getTracks().forEach((t) => t.stop());
      reject((e as unknown as { error?: unknown }).error ?? e);
    };
  });
  const stop = () => rec.state !== "inactive" && rec.stop();
  const limit = window.setTimeout(stop, MAX_SECONDS * 1000);
  rec.start();
  return { done, stop };
}

/** File extension for a recording's type. */
export const recordingExt = (type: string) => (type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm");
