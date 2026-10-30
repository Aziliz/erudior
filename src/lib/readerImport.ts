import { READER_LIMITS, validateReaderTexts, type ReaderText } from './readerContent';

/** Text only: no document conversion, network request, executable HTML or asset fetching. */
export const READER_IMPORT_BYTES = 500_000;
export type ReaderImport = { filename: string; title: string; body: string };
export function readerImportFileProblem(name: string, size: number): string | null {
  if (!/\.(txt|md|markdown)$/i.test(name)) return 'Choose a UTF-8 .txt, .md or .markdown file. PDF, Word and HTML conversion is not supported.';
  if (!Number.isSafeInteger(size) || size < 1 || size > READER_IMPORT_BYTES) return `Reading imports must contain 1–${READER_IMPORT_BYTES.toLocaleString('en-US')} bytes.`;
  return null;
}
export function parseReaderImport(name: string, bytes: Uint8Array): ReaderImport {
  const problem = readerImportFileProblem(name, bytes.byteLength); if (problem) throw Error(problem);
  let body: string;
  try { body = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { throw Error('The file is not valid UTF-8 text. Save a UTF-8 copy and try again.'); }
  if (!body.trim()) throw Error('The reading file is empty.');
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(body)) throw Error('The file contains binary or unsupported control characters.');
  if (body.length > READER_LIMITS.body) throw Error('Reading text exceeds the section length limit.');
  const filename = name.split(/[\\/]/).pop() || 'Reading text';
  return { filename, title: filename.replace(/\.(txt|md|markdown)$/i, '').slice(0, READER_LIMITS.short) || 'Reading text', body };
}
/** Append only, leaving original objects and stable identities untouched. Draft validation is still enforced. */
export function appendReaderImport(texts: ReaderText[], imported: ReaderImport, title: string, source: string, targetTextId: string | null, makeId: () => string): ReaderText[] {
  if (!title.trim() || title.length > READER_LIMITS.short) throw Error(`Enter a title of 1–${READER_LIMITS.short} characters.`);
  if (source.length > READER_LIMITS.short) throw Error(`Source attribution must be at most ${READER_LIMITS.short} characters.`);
  const section = { id: `part-${makeId()}`, title, body: imported.body };
  let next: ReaderText[];
  if (targetTextId !== null) {
    if (!texts.some(text => text.id === targetTextId)) throw Error('The target reading text no longer exists. Choose the file again.');
    next = texts.map(text => text.id === targetTextId ? { ...text, sections: [...text.sections, section] } : text);
  } else {
    const text: ReaderText = { id: `text-${makeId()}`, title, kind: 'document', ...(source ? { source } : {}), sections: [section] };
    next = [...texts, text];
  }
  const problems = validateReaderTexts(next, { strict: false });
  if (problems.length) throw Error(problems.join('\n'));
  return next;
}
