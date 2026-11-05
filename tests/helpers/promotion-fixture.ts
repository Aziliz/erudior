import { emptyCourse } from '../../src/lib/course';
import { canonicalAuthoringFromCourse } from '../../src/lib/canonicalAuthoring';
import { preparePromotionCandidate } from '../../src/lib/promotionCandidate';
import { createPromotionReview, createPromotionHandoff, type PromotionReviewInput } from '../../src/lib/promotionReview';
import { attachSpreadsheetAssignment } from '../../src/lib/spreadsheetCoursePackage';
import { SAMPLE_ASSIGNMENT } from '../../src/lib/spreadsheetAssignments';
export const promotionOrigin = 'https://community.example.test';
export const promotionImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><rect width="2" height="2"/></svg>');
export const promotionReviewInput: PromotionReviewInput = {
  decision: 'approved-for-handoff', intendedOfficial: { courseId: 'promotion-fixture', revision: 1 },
  checklist: { contentAccuracy: true, accessibility: true, attribution: true, sourceRights: true, mediaRights: true, parityReviewed: true },
  evidence: [
    { id: 'content-evidence', kind: 'content', reference: 'Synthetic content check only', text: 'Synthetic test fixture checked for exact content. Not a real review.' },
    { id: 'rights-evidence', kind: 'rights', reference: 'Synthetic rights fixture only', text: 'Synthetic statement for testing. No legal rights determination.' },
    { id: 'media-evidence', kind: 'media-rights', reference: 'Synthetic image fixture only', text: 'Generated rectangle fixture. Not a production rights approval.' },
  ], notes: 'Synthetic review for test transport only.',
};
export async function promotionFixture(options: { images?: boolean; spreadsheet?: boolean; revision?: number } = {}) {
  let course = { ...emptyCourse('Synthetic promotion fixture'), id: 'promotion-fixture', revision: options.revision ?? 1, author: 'Synthetic Author', updated: '2026-01-01', description: 'Exact description: café 🧪', lessons: [{ id: 'lesson-one', module: 'm1', title: 'Synthetic lesson', body: options.images === false ? 'Exact source content.' : `Exact source content.\n![Synthetic rectangle](${promotionOrigin}/images/fixture-image)` }] };
  if (options.spreadsheet) course = attachSpreadsheetAssignment(course, 'lesson-one', SAMPLE_ASSIGNMENT) as typeof course;
  const source = canonicalAuthoringFromCourse(course, { mode: 'publication', communityImageOrigin: promotionOrigin });
  const candidate = await preparePromotionCandidate({ payload: source, communityId: 'community-fixture', publishedVersion: 7, communityImageOrigin: promotionOrigin }, async () => promotionImage);
  const review = await createPromotionReview(candidate, { ...promotionReviewInput, intendedOfficial: { courseId: candidate.course.id, revision: candidate.course.revision ?? 1 } }, { id: 'review-fixture', revision: 1, reviewer: 'synthetic-admin', reviewedAt: '2026-01-02T00:00:00.000Z' }, { communityImageOrigin: promotionOrigin });
  const handoff = await createPromotionHandoff(candidate, review, { communityImageOrigin: promotionOrigin });
  return { source, candidate, review, handoff };
}
