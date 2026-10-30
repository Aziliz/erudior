/** Private course transport: no fetching, account gate, learner data, or publication authority. */
import type { Course } from './courseContentTypes';
import { demoteRuntimeCourse, runtimeCourseFromCanonicalAuthoring, validateCanonicalAuthoring, type CanonicalAuthoringPayload, type PortableAuthoredCourse } from './canonicalAuthoring';
import { transformCanonicalAssets } from './canonicalAssets';
import { validateImageAsset } from './imageAssets';
import { validateEmbeddedAudio } from './courseAudio';
import { exportCourseSnapshot } from './course';
import { validateOfflineMedia } from './offlineMedia';
import { transformOfflineAudio } from './offlineAudio';

export const MAX_OFFLINE_COURSE_BYTES = 24 * 1024 * 1024;
const options = { strict: false, maxBytes: MAX_OFFLINE_COURSE_BYTES, mode: 'publication' as const };
const bytes = (s: string) => new TextEncoder().encode(s);
const placeholder = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>');
const audioPlaceholder = 'data:audio/wav;base64,UklGRg==';
export interface OfflineAsset { source: string; kind: 'image' | 'audio' }
function fail(errors: string[]) { if (errors.length) throw Error(errors.join('; ')); }
function bound(text: string) { if (bytes(text).length > MAX_OFFLINE_COURSE_BYTES) throw Error('Course package exceeds the 24 MiB limit.'); }
function safeRemote(src: string): boolean {
  try { const u = new URL(src); return u.protocol === 'https:' && !u.username && !u.password && !u.search && !u.hash; } catch { return false; }
}
const audio = <T extends PortableAuthoredCourse>(course: T, map: (src: string) => string): T => transformOfflineAudio(course, map, MAX_OFFLINE_COURSE_BYTES);
export function inspectOfflineCourse(course: Course): { payload: CanonicalAuthoringPayload; assets: OfflineAsset[]; warnings: string[] } {
  bound(JSON.stringify(course));
  const assets: OfflineAsset[] = [];
  function inspect(source: string, kind: OfflineAsset['kind']): string {
    if (source.startsWith('data:')) { fail(validateOfflineMedia(source, kind)); return source; }
    const errors = kind === 'image' ? validateImageAsset(source, { mode: 'source' }) : validateEmbeddedAudio(source, 'audio', { mode: 'source' });
    if (errors.length && !safeRemote(source)) fail(errors);
    if (!assets.some(a => a.source === source && a.kind === kind)) assets.push({ source, kind });
    return kind === 'image' ? placeholder : audioPlaceholder;
  }
  // Validate all authored fields using safe placeholders, without accepting remote media as trusted.
  const validation = audio(transformCanonicalAssets(course, s => inspect(s, 'image'), { maxBytes: MAX_OFFLINE_COURSE_BYTES }), s => inspect(s, 'audio'));
  demoteRuntimeCourse(validation as Course, options);
  const portable = JSON.parse(exportCourseSnapshot(course));
  delete portable.community;
  const payload: CanonicalAuthoringPayload = { format: 'erudior-canonical-authoring', version: 1, course: portable };
  const warnings = [
    'This file contains authored course content only, not learner progress, submissions, recordings, or account data.',
    'An imported copy is untrusted. Its checksum detects corruption, not authorship, approval, or a valid publisher signature.',
    'External links and prerequisite courses are not bundled. Python exercises may need an initial runtime download; spoken text needs available device voices.',
    'Only share content and media you have permission to redistribute.'
  ];
  return { payload, assets, warnings };
}
async function digest(payload: CanonicalAuthoringPayload) {
  const hash = await crypto.subtle.digest('SHA-256', bytes(JSON.stringify(payload)));
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}
export async function createOfflineCoursePackage(course: Course, replacements: Record<string, string> = {}): Promise<string> {
  const { payload, assets } = inspectOfflineCourse(course);
  function replace(source: string, kind: OfflineAsset['kind']) {
    if (source.startsWith('data:')) return source;
    const value = Object.prototype.hasOwnProperty.call(replacements, source) ? replacements[source] : undefined;
    if (!value) throw Error(`Choose a local ${kind} file for ${source}.`);
    fail(validateOfflineMedia(value, kind));
    return value;
  }
  for (const key of Object.keys(replacements)) if (!assets.some(a => a.source === key)) throw Error('Unexpected media replacement.');
  const embedded: CanonicalAuthoringPayload = { ...payload, course: audio(transformCanonicalAssets(payload.course, s => replace(s, 'image'), { maxBytes: MAX_OFFLINE_COURSE_BYTES }), s => replace(s, 'audio')) };
  fail(validateCanonicalAuthoring(embedded, options));
  const text = JSON.stringify({ format: 'erudior-offline-course', version: 1, payload: embedded, sha256: await digest(embedded) });
  bound(text);
  return text;
}
export function isOfflineCoursePackage(raw: unknown): boolean { return !!raw && typeof raw === 'object' && (raw as {format?: unknown}).format === 'erudior-offline-course'; }
export async function importOfflineCoursePackage(text: string): Promise<Course> {
  bound(text);
  const raw = JSON.parse(text);
  if (!isOfflineCoursePackage(raw) || raw.version !== 1 || Object.keys(raw).sort().join(',') !== 'format,payload,sha256,version' || typeof raw.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(raw.sha256)) throw Error('Unsupported or malformed offline course package.');
  fail(validateCanonicalAuthoring(raw.payload, options));
  audio(transformCanonicalAssets(raw.payload.course, s => { fail(validateOfflineMedia(s, 'image')); return s; }, { maxBytes: MAX_OFFLINE_COURSE_BYTES }), s => { fail(validateOfflineMedia(s, 'audio')); return s; });
  if (await digest(raw.payload) !== raw.sha256) throw Error('Course package checksum mismatch. Ask the sender for a fresh export.');
  return runtimeCourseFromCanonicalAuthoring(raw.payload, { id: 'offline-' + crypto.randomUUID(), revision: raw.payload.course.revision ?? 1 }, options);
}
