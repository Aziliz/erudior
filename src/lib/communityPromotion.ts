import { checkDoc, toCourse, type CommunityDoc, type CommunityMeta } from "./communityFormat";
import { normalizeCourse } from "./course";
import type { Course } from "./types";

/**
 * Prepare a reviewed community version for the official course publishing pipeline.
 * This does not publish anything. Approval must be for the exact immutable reviewed version.
 * Consumers must independently authorize promotion and store its provenance.
 */
export function prepareOfficialPromotion(
  document: CommunityDoc,
  metadata: CommunityMeta,
  officialId: string,
): Course {
  if (metadata.review !== "reviewed") throw new Error("Community course must be reviewed before official promotion.");
  if (!Number.isInteger(metadata.version) || metadata.version < 1) throw new Error("A published version is required.");
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(officialId) || officialId.startsWith("community-"))
    throw new Error("Use a valid, distinct official course ID.");
  const errors = checkDoc(document, true);
  if (errors.length) throw new Error("Community course is not publishable: " + errors.join("; "));
  // Reject external image references: official packages must embed their assets
  // through the authorized publisher's image resolver before this function is used.
  const converted = toCourse(document, metadata, (id) => { throw new Error("Image " + id + " must be embedded before promotion."); });
  const course = normalizeCourse({ ...converted, id: officialId, community: undefined });
  return course;
}
