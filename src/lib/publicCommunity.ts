import type { CommunityEntry } from './community';
import { LIMITS, checkDoc, upgradeDoc, type CommunityDoc } from './communityFormat';
import { courseFromCanonicalAuthoring } from './canonicalAuthoring';
import { normalizeLevel, normalizeSubject, normalizeType } from './taxonomy';

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, max: number, nonempty = false): value is string => typeof value === 'string' && value.length <= max && (!nonempty || !!value.trim());
export const publicCommunityId = (id: unknown): id is string => typeof id === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(id);
/** Public API responses are untrusted. Never allow an invalid ID to become a route. */
export function validatePublicCommunityEntry(raw: unknown): CommunityEntry {
  if (!object(raw) || !publicCommunityId(raw.id) || !text(raw.title, LIMITS.title, true) || !text(raw.description, LIMITS.description) || !text(raw.author, 200) || !text(raw.subject, 120) || !text(raw.level, 120) || (raw.type !== undefined && !text(raw.type, 120)) || !Number.isSafeInteger(raw.version) || Number(raw.version) < 1 || (raw.review !== 'reviewed' && raw.review !== 'not_reviewed') || !object(raw.counts) || !['lessons', 'questions', 'cards'].every(key => Number.isSafeInteger((raw.counts as Record<string, unknown>)[key]) && Number((raw.counts as Record<string, unknown>)[key]) >= 0 && Number((raw.counts as Record<string, unknown>)[key]) <= 100000) || !(raw.updated === null || text(raw.updated, 80))) throw Error('The community service returned invalid course information. Please retry later.');
  return { id: raw.id, title: raw.title, description: raw.description, author: raw.author, subject: normalizeSubject(raw.subject), level: normalizeLevel(raw.level), type: normalizeType(raw.type as string | undefined), version: raw.version as number, review: raw.review as CommunityEntry['review'], counts: { ...(raw.counts as CommunityEntry['counts']) }, updated: raw.updated as string | null };
}
export function validatePublicCommunityCatalog(raw: unknown): CommunityEntry[] {
  if (!Array.isArray(raw) || raw.length > 1000) throw Error('The community service returned an invalid catalog. Please retry later.');
  const list = raw.map(validatePublicCommunityEntry);
  if (new Set(list.map(item => item.id)).size !== list.length) throw Error('The community catalog contains duplicate courses. Please retry later.');
  return list;
}
export interface PublicCommunityDetail { entry: CommunityEntry; lessons: { id: string; title: string }[] }
export function validatePublicCommunityDetail(raw: unknown, requestedId: string, communityImageOrigin?: string): PublicCommunityDetail {
  const entry = validatePublicCommunityEntry(raw);
  if (!publicCommunityId(requestedId) || entry.id !== requestedId) throw Error('The requested course does not match the response. Please retry.');
  let doc: CommunityDoc;
  try {
    doc = upgradeDoc((raw as { doc: CommunityDoc }).doc);
    if (checkDoc(doc, true, { communityImageOrigin }).length || doc.title !== entry.title) throw Error('Invalid course');
    const lessons = doc.canonical ? courseFromCanonicalAuthoring(doc.canonical, { strict: true, communityImageOrigin }).lessons : doc.lessons;
    return { entry, lessons: lessons.map(lesson => ({ id: lesson.id, title: lesson.title })) };
  } catch { throw Error('This published course could not be validated. Please try again later.'); }
}
