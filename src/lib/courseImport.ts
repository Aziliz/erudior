import { courseFromCanonicalAuthoring, migrateLegacyCourseToCanonical } from './canonicalAuthoring';

/** Untrusted import/recovery preflight. Legacy recovery normalization must not hide
 * unsupported authored fields. Runtime provenance is deliberately outside authored
 * content; this check never grants or changes publication/review authority. */
export function assertCourseImportPreservesFields(raw: unknown): void {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Course must be an object');
  const source = raw as Record<string, unknown>;
  const options = { strict: false, mode: 'source' as const, maxBytes: Number.MAX_SAFE_INTEGER };
  if (source.format === 'erudior-canonical-authoring') {
    courseFromCanonicalAuthoring(raw, { ...options, strict: true });
    return;
  }
  // Pre-format historical imports retain their documented legacy path. Explicit
  // versioned course files must satisfy the known, lossless migration contract.
  if (source.format !== 'examiner-course') return;
  const { community: _runtimeProvenance, ...authored } = source;
  const banks = Array.isArray(source.banks) ? source.banks.map(value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    const bank = value as Record<string, unknown>;
    const { courseId, ...portable } = bank;
    if (courseId !== undefined) {
      if (typeof source.id !== 'string' || courseId !== source.id || typeof bank.id !== 'string' || !bank.id.startsWith(source.id + '__')) throw Error('Inconsistent runtime bank namespace');
      portable.id = bank.id.slice(source.id.length + 2);
    }
    return portable;
  }) : source.banks;
  migrateLegacyCourseToCanonical({ ...authored, ...(banks === undefined ? {} : { banks }) }, options);
}
