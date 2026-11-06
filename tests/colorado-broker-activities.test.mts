import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courseActivities } from '../src/lib/courseActivities.ts';
import { exportCourseSnapshot } from '../src/lib/course.ts';
import { importValidatedCourseSnapshot } from '../src/lib/courseIntegrity.ts';
import { compareCourseRevisions } from '../src/lib/courseRevision.ts';
import { parseDocumentReviewResponse } from '../src/lib/documentEngine.ts';
import { replayBranchingPractice } from '../src/lib/branchingEngine.ts';
import { attemptPassed, defaultExamOptions, startExam } from '../src/lib/session.ts';
import { gradeAssignment } from '../src/lib/spreadsheetAssignments.ts';
import { validateSpreadsheetReleaseApproval } from '../src/lib/spreadsheetReleaseApproval.ts';
import { applyTransactionCommand, emptyTransactionSession, exportTransactionPack, importTransactionPack, parseTransactionAssignment, replayTransaction, type TransactionCommand } from '../src/lib/transactionEngine.ts';

const source = readFileSync(new URL('../samples/colorado-broker-course.json', import.meta.url), 'utf8');
const course = importValidatedCourseSnapshot(source);
const restored = importValidatedCourseSnapshot(exportCourseSnapshot(course));
assert.deepEqual(restored.documentReviews, course.documentReviews);
assert.deepEqual(restored.branchingScenarios, course.branchingScenarios);
assert.deepEqual(restored.spreadsheetAssignments, course.spreadsheetAssignments);
assert.equal(courseActivities(course).length, 7);
assert.deepEqual(courseActivities(course, 'co-counterproposals-amend-notices').map(activity => activity.kind), ['document', 'branching']);
const courseWithoutReview = structuredClone(course);
courseWithoutReview.revision!++;
courseWithoutReview.documentReviews!.shift();
assert(compareCourseRevisions(course, courseWithoutReview).some(issue => issue.path === 'documentReviews'));
for (const invalidate of [
  (raw: any) => { raw.documentReviews[0].lessonId = 'missing'; },
  (raw: any) => { raw.documentReviews[0].documents[0].approval = { actor: 'Portable author', at: '2026-04-06T00:00:00Z' }; },
  (raw: any) => { raw.documentReviews[2].transaction.pack.approval = null; },
  (raw: any) => { raw.documentReviews[2].transaction.startDate = '2026-05-32'; },
]) {
  const raw = JSON.parse(source);
  invalidate(raw);
  assert.throws(() => importValidatedCourseSnapshot(JSON.stringify(raw)));
}
const review = course.documentReviews![0];
const page = review.documents[0].pages[0];
const quote = 'April 13, 2026';
const start = page.text.indexOf(quote);
const response = {
  values: { 'juniper-agreement': { deadline: '2026-04-13' }, 'juniper-draft-extension': { 'file-note': 'Unsigned draft. Track the executed cutoff.' } },
  annotations: [{ id: 'review-note', documentId: 'juniper-agreement', pageId: page.id, note: 'Operative date', quote: { start, end: start + quote.length, text: quote } }],
};
assert.deepEqual(parseDocumentReviewResponse(response, review.documents, true), response);
assert.throws(() => parseDocumentReviewResponse({ ...response, values: {} }, review.documents, true), /required field/);

const { lessonId: _lesson, selfStudy: _selfStudy, ...branch } = course.branchingScenarios![0];
assert.equal(replayBranchingPractice(branch, ['send', 'verify']).outcome, 'success');
const late = replayBranchingPractice(branch, ['wait', 'verify']);
assert.equal(late.outcome, 'incomplete');
assert.equal(late.milestones['timely-objection'], 'missed');
assert.throws(() => replayBranchingPractice(branch, ['verify']), /unavailable/);

const [closing, trust] = course.spreadsheetAssignments!;
assert(closing.directions?.some(step => step.includes('C2') && step.includes('D2')));
assert(trust.directions?.some(step => step.includes('B13') && step.includes('B14')));
const closingBook = structuredClone(closing.starter);
Object.assign(closingBook.sheets.Closing, {
  C2: '=SalePrice', D2: '=B17', E3: '=B18', F3: '=E3', E4: '=B19', F4: '=E4',
  B5: '=AnnualTax*SellerDays/DaysInYear', E5: '=B5', C6: '=B23', D6: '=C6',
  B7: '=B24', G7: '=B7', B8: '=B25', G8: '=B8', B9: '=B26', G9: '=B9', D10: '=B27', G10: '=D10',
  E11: '=SUM(D2:D10)-SUM(E2:E10)', F11: '=E11', B12: '=SUM(C2:C11)-SUM(B2:B11)', G12: '=B12',
  B14: '=B13-C13', D14: '=D13-E13', F14: '=F13-G13',
});
for (const column of 'BCDEFG') closingBook.sheets.Closing[column + '13'] = `=SUM(${column}2:${column}12)`;
assert.equal(gradeAssignment(closing, closing.starter).score, 0);
const closingGrade = gradeAssignment(closing, closingBook);
assert.equal(closingGrade.score, 1, JSON.stringify(closingGrade.feedback.filter(cell => !cell.passed)));
closingBook.sheets.Closing.G5 = 1200;
assert(gradeAssignment(closing, closingBook).score < 1);
const trustBook = structuredClone(trust.starter);
Object.assign(trustBook.sheets.Trust, { B5: '=B2+B3-B4', B11: '=SUM(ClientLedgers)', B13: '=B5-JournalBalance', B14: '=JournalBalance-B11' });
const trustGrade = gradeAssignment(trust, trustBook);
assert.equal(trustGrade.score, 1, JSON.stringify(trustGrade.feedback.filter(cell => !cell.passed)));
assert.deepEqual(await validateSpreadsheetReleaseApproval(course, undefined), ['Spreadsheet approval missing']);
const approval = JSON.parse(readFileSync(new URL('../samples/reviews/colorado-broker.json', import.meta.url), 'utf8'));
assert.deepEqual(await validateSpreadsheetReleaseApproval(course, approval), []);


const closingReview = course.documentReviews!.find(item => item.transaction)!;
const sim = closingReview.transaction!;
const portablePack = exportTransactionPack({ ...sim.pack, documents: closingReview.documents });
const importedPack = importTransactionPack(portablePack);
assert.equal(importedPack.approval, undefined);
const at = '2026-04-06T00:00:00Z';
const assignment = parseTransactionAssignment({
  id: 'practice', studentId: 'test-learner', revision: 1, title: sim.pack.title, startDate: sim.startDate, instructions: sim.instructions, createdAt: at,
  pack: { ...importedPack, revision: 1, approval: { actor: 'Test reviewer', at } },
});
let session = emptyTransactionSession(assignment);
const record = (command: Omit<TransactionCommand, 'note'> | Record<string, unknown>) => {
  session = applyTransactionCommand(assignment, session, { ...command, note: 'Test transaction step' } as TransactionCommand, `event-${session.revision}`, at);
};
for (const stage of ['representation', 'pricing', 'offer']) record({ kind: 'stage', stage });
record({ kind: 'offer', offerId: 'terms', party: 'buyer', clientId: 'juniper', price: 48000000, earnest: 1200000, expiresOn: sim.startDate, closingDate: '2026-05-01' });
record({ kind: 'accept', offerId: 'terms', party: 'seller' });
record({ kind: 'deposit', entryId: 'juniper-check', clientId: 'juniper', amount: 1200000, reference: 'receipt-1' });
record({ kind: 'deposit', entryId: 'cedar-check', clientId: 'cedar', amount: 650000, reference: 'receipt-2' });
record({ kind: 'disburse', entryId: 'cedar-refund', clientId: 'cedar', amount: 200000, reference: 'check-1' });
record({ kind: 'reconcile', bankBalance: 650000, outstandingEntryIds: ['juniper-check', 'cedar-refund'], reportedClientBalances: { juniper: 1200000, cedar: 450000 } });
assert.equal(replayTransaction(assignment, session.events).reconciliation?.adjustedBank, 1650000);
for (const contingencyId of ['inspection', 'title']) record({ kind: 'contingency', contingencyId, status: 'satisfied' });
session.response.values = {
  'juniper-closing-instructions': { 'tax-treatment': 'Seller debit and buyer credit' },
  'juniper-closing-draft': { correction: 'Reverse tax adjustment and post cash received for earnest money.' },
};
record({ kind: 'clock', date: '2026-05-01' });
record({ kind: 'reconcile', bankBalance: 1650000, outstandingEntryIds: [], reportedClientBalances: { juniper: 1200000, cedar: 450000 } });
record({ kind: 'stage', stage: 'closing' });
record({ kind: 'disburse', entryId: 'juniper-close', clientId: 'juniper', amount: 1200000, reference: 'close-1' });
record({ kind: 'disburse', entryId: 'cedar-close', clientId: 'cedar', amount: 450000, reference: 'close-2' });
record({ kind: 'reconcile', bankBalance: 0, outstandingEntryIds: [], reportedClientBalances: { juniper: 0, cedar: 0 } });
record({ kind: 'stage', stage: 'archived' });
assert.equal(replayTransaction(assignment, session.events).stage, 'archived');

const bank = course.banks[0];
assert.equal(bank.questions.length, 828);
const exam = startExam(bank, defaultExamOptions(bank));
assert.equal(exam.items.filter(({ q }) => q.section === 'national').length, 80);
assert.equal(exam.items.filter(({ q }) => q.section === 'state').length, 74);
assert.deepEqual(bank.exam.sectionTimeLimits, { national: 120, state: 110 });
const atCut = { mode: 'exam', sectionPassing: exam.sectionPassing };
const [national, state] = bank.sections.map(section => section.name);
assert.equal(attemptPassed({ ...atCut, bySection: { [national]: { correct: 60, total: 80 }, [state]: { correct: 53, total: 74 } } } as Parameters<typeof attemptPassed>[0]), true);
assert.equal(attemptPassed({ ...atCut, bySection: { [national]: { correct: 60, total: 80 }, [state]: { correct: 52, total: 74 } } } as Parameters<typeof attemptPassed>[0]), false);
console.log('Colorado broker activity package, case paths, graded workbook formulas, transaction close/archive, and timed exam passed.');
