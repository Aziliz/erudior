import { useState } from 'react';
import { DOCUMENT_DISCLAIMER, emptyDocumentResponse, parseDocumentReviewResponse } from '../lib/documentEngine';
import type { CourseDocumentReview as Review } from '../lib/documentCoursePackage';
import { exportText } from '../lib/storage';
import { exportTransactionPack } from '../lib/transactionEngine';
import DocumentCaseView from './DocumentCaseView';

export default function CourseDocumentReview({ review }: { review: Review }) {
  const [response, setResponse] = useState(emptyDocumentResponse);
  const [pending, setPending] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');
  const transaction = review.transaction;
  async function exportCase() {
    if (!transaction) return;
    try {
      setExportError('');
      const pack = exportTransactionPack({ ...transaction.pack, documents: review.documents });
      await exportText(pack, transaction.pack.id + '.json', 'Save educational transaction pack');
    } catch {
      setExportError('Could not save the transaction pack. Try exporting it again.');
    }
  }
  function checkReview() {
    try {
      parseDocumentReviewResponse(response, review.documents, true);
      if (!response.annotations.length) throw Error('Add at least one source annotation before checking your review.');
      setError('');
      setShowDebrief(true);
    } catch (failure) {
      setError((failure as Error).message);
    }
  }
  return <section className="document-engine" aria-label="Self-study document review">
    <div className="activity-directions">
      <h2>What to do</h2>
      <p>{review.instructions}</p>
      <ol>
        <li>Read the first source and fill in its response fields. If there are other sources, use the Document menu to open each one and fill in its fields.</li>
        <li>Highlight a line that supports your answer. Choose <strong>Use highlighted text</strong>, write a short note about why it matters, then choose <strong>Add annotation</strong>.</li>
        <li>Choose <strong>Show model review</strong> to compare your reasoning with the sample response.</li>
      </ol>
    </div>
    <p>{DOCUMENT_DISCLAIMER} Responses last while this activity is open.</p>
    <DocumentCaseView assignment={review} response={response} onChange={setResponse} onPending={setPending} />
    <button className="btn primary document-review-check" disabled={pending} onClick={checkReview}>Show model review</button>
    {error && <p role="alert">{error}</p>}
    {showDebrief && <section className="activity-model-review" aria-label="Model review">
      <h3>Compare with the model review</h3>
      <ul>{review.debrief.map(item => <li key={item}>{item}</li>)}</ul>
    </section>}
    {transaction && <details>
      <summary>Optional supervised transaction simulation</summary>
      <p>{transaction.instructions}</p>
      <p>Simulated case start date <strong>{transaction.startDate}</strong>. A supervising adult imports the pack in Transaction practice, saves it, reviews the exact pack and assigns it. The learner opens it in Progress.</p>
      <button className="btn" onClick={() => void exportCase()}>Export transaction pack</button>
      {exportError && <p role="alert">{exportError}</p>}
    </details>}
  </section>;
}
