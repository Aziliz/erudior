/** Pure authored-audio contract. No playback, fetching, recording, or permission APIs. */
import type { AudioClip } from './courseContentTypes';

export const MAX_AUDIO_CLIP_BYTES = 400_000;
export type AudioValidationOptions = { mode?: 'source' | 'publication' };
const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v) && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
const dangerous = new Set(['__proto__', 'prototype', 'constructor']);
const LANGUAGE = /^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/;
const EMBEDDED = /^data:audio\/(mpeg|mp3|mp4|aac|x-m4a|ogg|opus|wav|x-wav|wave|webm|flac);base64,([A-Za-z0-9+/]+={0,2})$/;
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export const normalizedClipKey = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}:]+/gu, ' ').replace(/(^|\s):|:(\s|$)/g, ' ').replace(/\s+/g, ' ').trim();

/** Exact byte count only after canonical base64 validation; rejects nonzero unused pad bits. */
export function embeddedAudioBytes(raw: unknown): number | null {
  if (typeof raw !== 'string' || raw.length > Math.ceil(MAX_AUDIO_CLIP_BYTES / 3) * 4 + 80) return null;
  const match = EMBEDDED.exec(raw);
  if (!match || !BASE64.test(match[2])) return null;
  const data = match[2];
  const padding = data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0;
  if (padding && (alphabet.indexOf(data[data.length - padding - 1]) & (padding === 2 ? 15 : 3))) return null;
  return data.length / 4 * 3 - padding;
}

function localAudioRef(raw: string): boolean {
  return /^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(?:mp3|m4a|ogg|oga|opus|wav|webm|aac|flac)$/i.test(raw) && !raw.split('/').some(part => part === '.' || part === '..');
}
export function validateEmbeddedAudio(raw: unknown, path = 'audio', options: AudioValidationOptions = {}): string[] {
  if (typeof raw !== 'string') return [`${path}: expected an embedded audio string`];
  if (localAudioRef(raw)) return options.mode === 'source' ? [] : [`${path}: unresolved local audio reference; embed the exact local asset before publication`];
  const bytes = embeddedAudioBytes(raw);
  if (bytes === null) return [`${path}: expected an allowed data:audio MIME with canonical base64 (remote URLs and unsafe paths are not allowed)`];
  return bytes > MAX_AUDIO_CLIP_BYTES ? [`${path}: audio exceeds ${MAX_AUDIO_CLIP_BYTES} decoded bytes`] : [];
}
export function validateAudioClip(raw: unknown, path = 'audio', options: AudioValidationOptions = {}): string[] {
  if (!object(raw)) return [`${path}: expected an audio clip object`];
  const errors = Object.keys(raw).filter(k => !['src', 'text', 'lang'].includes(k)).map(k => `${path}.${k}: unsupported audio field`);
  if (own(raw, 'src')) errors.push(...validateEmbeddedAudio(raw.src, `${path}.src`, options));
  if (own(raw, 'text') && typeof raw.text !== 'string') errors.push(`${path}.text: expected text`);
  if (own(raw, 'lang') && (typeof raw.lang !== 'string' || !LANGUAGE.test(raw.lang))) errors.push(`${path}.lang: expected a language code`);
  if (!own(raw, 'src') && !(typeof raw.text === 'string' && raw.text.trim())) errors.push(`${path}: requires a recorded source or nonempty spoken text`);
  return errors;
}
export function cloneAudioClip(raw: unknown, options: AudioValidationOptions = {}): AudioClip {
  const errors = validateAudioClip(raw, 'audio', options);
  if (errors.length) throw new Error(errors.join('\n'));
  return { ...(raw as AudioClip) };
}
export function validateCourseAudioFields(raw: unknown, path = 'course', options: AudioValidationOptions = {}): string[] {
  if (!object(raw)) return [`${path}: expected an object`];
  const errors: string[] = [];
  if (own(raw, 'readAloud') && typeof raw.readAloud !== 'boolean') errors.push(`${path}.readAloud: expected boolean`);
  if (!own(raw, 'audio')) return errors;
  if (!object(raw.audio)) return [...errors, `${path}.audio: expected a clip library object`];
  const keys = new Set<string>();
  for (const [key, value] of Object.entries(raw.audio)) {
    const normalized = normalizedClipKey(key);
    if (!normalized || dangerous.has(key)) errors.push(`${path}.audio: invalid clip key ${JSON.stringify(key)}`);
    if (keys.has(normalized)) errors.push(`${path}.audio: colliding normalized clip key ${JSON.stringify(key)}`);
    keys.add(normalized);
    if (typeof value === 'string' && /^say:\s*\S/i.test(value)) continue;
    errors.push(...validateEmbeddedAudio(value, `${path}.audio[${JSON.stringify(key)}]`, options));
  }
  return errors;
}
/** Copies just the audio fields, preserving explicit false, exact keys, and spoken whitespace. */
export function cloneCourseAudioFields(raw: unknown, options: AudioValidationOptions = {}): { readAloud?: boolean; audio?: Record<string, string> } {
  const errors = validateCourseAudioFields(raw, 'course', options);
  if (errors.length) throw new Error(errors.join('\n'));
  const value = raw as {readAloud?: boolean; audio?: Record<string,string>};
  return { ...(own(value, 'readAloud') ? {readAloud:value.readAloud} : {}), ...(own(value, 'audio') ? {audio:{...value.audio}} : {}) };
}
export function validateQuestionAudioFields(raw: unknown, path = 'question', options: AudioValidationOptions = {}): string[] {
  if (!object(raw)) return [`${path}: expected an object`];
  const errors = own(raw, 'audio') ? validateAudioClip(raw.audio, `${path}.audio`, options) : [];
  if (own(raw, 'listen')) {
    if (typeof raw.listen !== 'string' || !raw.listen.trim()) errors.push(`${path}.listen: expected nonempty spoken text or a clip key`);
    else if (/^data:/i.test(raw.listen)) errors.push(...validateEmbeddedAudio(raw.listen, `${path}.listen`, options));
    else if (/^(?:[a-z][a-z0-9+.-]*:\/\/|javascript:|blob:|file:|\/\/)/i.test(raw.listen)) errors.push(`${path}.listen: URLs are not clip keys or spoken text`);
  }
  if (own(raw, 'blend') && (!Array.isArray(raw.blend) || raw.blend.some(v => typeof v !== 'string' || !v.trim()))) errors.push(`${path}.blend: expected an array of nonempty sound units`);
  return errors;
}
export function validateVocabAudioFields(raw: unknown, path = 'vocabulary', options: AudioValidationOptions = {}): string[] {
  if (!object(raw)) return [`${path}: expected an object`];
  return own(raw, 'audio') ? validateEmbeddedAudio(raw.audio, `${path}.audio`, options) : [];
}
export function cloneQuestionAudioFields(raw: unknown, options: AudioValidationOptions = {}): { audio?: AudioClip; listen?: string; blend?: string[] } {
  const errors = validateQuestionAudioFields(raw, 'question', options);
  if (errors.length) throw new Error(errors.join('\n'));
  const value = raw as { audio?: AudioClip; listen?: string; blend?: string[] };
  return { ...(own(value, 'audio') ? {audio:cloneAudioClip(value.audio,options)} : {}), ...(own(value, 'listen') ? {listen:value.listen} : {}), ...(own(value, 'blend') ? {blend:[...value.blend!]} : {}) };
}
export function cloneVocabAudioFields(raw: unknown, options: AudioValidationOptions = {}): { audio?: string } {
  const errors = validateVocabAudioFields(raw, 'vocabulary', options);
  if (errors.length) throw new Error(errors.join('\n'));
  const value = raw as {audio?: string};
  return own(value, 'audio') ? {audio:value.audio} : {};
}
