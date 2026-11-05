import { DOCUMENT_LIMITS, documentJSON, parseDocumentTemplate, type DocumentTemplate } from './documentEngine';
import { parseTransactionPack, type TransactionPack } from './transactionEngine';

export type CourseDocumentReview = {
  id: string;
  revision: number;
  lessonId: string;
  title: string;
  instructions: string;
  documents: DocumentTemplate[];
  debrief: string[];
  transaction?: { startDate: string; instructions: string; pack: Omit<TransactionPack, 'documents' | 'approval'> };
};

export function parseCourseDocumentReviews(input: unknown, lessonIds: ReadonlySet<string>): CourseDocumentReview[] {
  if (input === undefined) return [];
  if (!Array.isArray(input) || input.length > 30 ||
      new TextEncoder().encode(documentJSON(input)).length > DOCUMENT_LIMITS.bytes)
    throw Error('Invalid course document review collection.');
  const seen = new Set<string>();
  return input.map(raw => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) ||
        Object.keys(raw).some(key => !['id', 'revision', 'lessonId', 'title', 'instructions', 'documents', 'debrief', 'transaction'].includes(key)) ||
        typeof raw.id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(raw.id) || seen.has(raw.id) ||
        !Number.isSafeInteger(raw.revision) || raw.revision < 1 || typeof raw.lessonId !== 'string' || !lessonIds.has(raw.lessonId) ||
        !isText(raw.title, 300) || !isText(raw.instructions, 10000) ||
        !Array.isArray(raw.documents) || !raw.documents.length || raw.documents.length > DOCUMENT_LIMITS.documents ||
        !Array.isArray(raw.debrief) || !raw.debrief.length || raw.debrief.length > 30 ||
        !raw.debrief.every((item: unknown) => isText(item, 5000)))
      throw Error('Invalid course document review or lesson reference.');
    const documents: DocumentTemplate[] = raw.documents.map(parseDocumentTemplate);
    if (documents.some(doc => doc.approval || doc.revision < 1) ||
        new Set(documents.map(doc => doc.id)).size !== documents.length)
      throw Error('Course review documents must have unique versioned sources and cannot carry local approval.');
    const transaction = raw.transaction === undefined ? undefined : parseTransactionSource(raw.transaction, documents);
    seen.add(raw.id);
    return { ...raw, documents, debrief: [...raw.debrief], ...(transaction && { transaction }) };
  });
}

function isText(value: unknown, max: number): value is string {
  return typeof value === 'string' && !!value.trim() && value.length <= max;
}

function parseTransactionSource(input: unknown, documents: DocumentTemplate[]): NonNullable<CourseDocumentReview['transaction']> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Invalid supervised transaction source.');
  const { startDate, instructions, pack, ...extra } = input as Record<string, unknown>;
  if (Object.keys(extra).length || !isText(instructions, 10000) || !pack || typeof pack !== 'object' ||
      Array.isArray(pack) || 'approval' in pack || 'documents' in pack)
    throw Error('Invalid supervised transaction source or embedded approval.');
  const { documents: _documents, ...rules } = parseTransactionPack({ ...pack, documents });
  if (rules.revision < 1 || typeof startDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !Number.isFinite(Date.parse(startDate)) || new Date(startDate).toISOString().slice(0, 10) !== startDate ||
      startDate < rules.jurisdiction.effectiveFrom || startDate > rules.jurisdiction.effectiveThrough)
    throw Error('Invalid supervised transaction source revision or start date.');
  return { startDate, instructions, pack: rules };
}

export function documentCourseProblems(input: unknown, lessonIds: ReadonlySet<string>): string[] {
  try { parseCourseDocumentReviews(input, lessonIds); return []; }
  catch (error) { return [(error as Error).message]; }
}

export function documentReviewRevisionProblems(before: CourseDocumentReview[], after: CourseDocumentReview[]): string[] {
  return before.flatMap(old => {
    const current = after.find(review => review.id === old.id);
    if (!current || current.lessonId !== old.lessonId)
      return [`Document review ${old.id}: published lesson binding removed or changed`];
    if (current.revision < old.revision || (current.revision === old.revision && documentJSON(current) !== documentJSON(old)))
      return [`Document review ${old.id}: changed source requires a greater revision`];
    return [];
  });
}
