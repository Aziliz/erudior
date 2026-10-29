import { courseFromCanonicalAuthoring, type CanonicalAuthoringPayload, type PortableAuthoredCourse } from './canonicalAuthoring';
import { canonicalAssetSources, transformCanonicalAssets } from './canonicalAssets';
import { validateImageAsset } from './imageAssets';

/** Preparation is not publication, a rights decision, or evidence of official approval. */
export interface PromotionCandidate {
  source: CanonicalAuthoringPayload;
  course: PortableAuthoredCourse;
  provenance: {
    format: 'erudior-promotion-candidate'; version: 1; status: 'unapproved-candidate';
    communityId: string; publishedVersion: number;
    hashEncoding: 'sha256-utf8-json-stringify'; sourceSha256: string; courseSha256: string;
    transformations: { source: string; imageId: string; embeddedSha256: string }[];
    requiredChecks: readonly string[];
  };
}
const MAX_CANDIDATE_BYTES = 32 * 1024 * 1024;
const bytes = (value: unknown) => new TextEncoder().encode(JSON.stringify(value));
const digest = async (value: unknown) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes(value))), b => b.toString(16).padStart(2, '0')).join('');
/** The caller supplies the exact loaded published payload and its version, not an
 * installed namespaced course. Resolver is only invoked for validated owned-media
 * route IDs; it must use the existing application media endpoint, never arbitrary URLs.
 * Server publication ownership validation remains authoritative; hashes record the
 * captured transformation, not a signature or a promise of immutable remote bytes. */
export async function preparePromotionCandidate(input: {
  payload: unknown; communityId: string; publishedVersion: number; communityImageOrigin?: string;
}, resolveImage?: (id: string) => Promise<string>): Promise<PromotionCandidate> {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(input.communityId) || ['__proto__', 'constructor', 'prototype'].includes(input.communityId)
    || !Number.isSafeInteger(input.publishedVersion) || input.publishedVersion < 1) throw Error('Invalid published source identity.');
  const original = courseFromCanonicalAuthoring(input.payload, { mode: 'publication', communityImageOrigin: input.communityImageOrigin });
  const source = structuredClone(input.payload) as CanonicalAuthoringPayload;
  const embedded = new Map<string, string>();
  const transformations: PromotionCandidate['provenance']['transformations'] = [];
  let total = bytes(source).length;
  for (const asset of canonicalAssetSources(original)) {
    if (asset.startsWith('data:')) continue;
    if (!input.communityImageOrigin || !resolveImage) throw Error('Promotion preparation needs the verified community image resolver.');
    const origin = new URL(input.communityImageOrigin), url = new URL(asset);
    const route = /^\/images\/([A-Za-z0-9_-]+)$/.exec(url.pathname);
    if (url.protocol !== 'https:' || url.origin !== origin.origin || url.username || url.password || url.search || url.hash || !route) throw Error('Untrusted promotion image route.');
    const data = await resolveImage(route[1]);
    const errors = validateImageAsset(data, { mode: 'publication' });
    if (errors.length) throw Error('Invalid promotion image: ' + errors.join('; '));
    total += data.length;
    if (total > MAX_CANDIDATE_BYTES) throw Error('Promotion candidate asset limit exceeded.');
    embedded.set(asset, data);
    transformations.push({ source: asset, imageId: route[1], embeddedSha256: await digest(data) });
  }
  const course = transformCanonicalAssets(original, asset => embedded.get(asset) ?? asset);
  // Revalidate without any trusted remote origin: candidate must be self-contained.
  courseFromCanonicalAuthoring({ format: 'erudior-canonical-authoring', version: 1, course }, { mode: 'publication', maxBytes: MAX_CANDIDATE_BYTES });
  return {
    source, course,
    provenance: { format: 'erudior-promotion-candidate', version: 1, status: 'unapproved-candidate',
      communityId: input.communityId, publishedVersion: input.publishedVersion,
      hashEncoding: 'sha256-utf8-json-stringify', sourceSha256: await digest(source), courseSha256: await digest(course), transformations,
      requiredChecks: ['Official publisher authorization', 'Content and source-rights/licensing review', 'Revision continuity against authenticated prior release', 'Spreadsheet release approval when applicable', 'Production signature and release integrity validation'],
    },
  };
}
