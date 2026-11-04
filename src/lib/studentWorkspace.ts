/** Private learner planning only: never assignments, grades, credit, or credentials. */
export type WorkspaceKind = 'task' | 'note' | 'reading' | 'goal' | 'project';
export type WorkspaceStatus = 'planned' | 'active' | 'done';
export interface WorkspaceLink {
  courseId: string;
  kind: 'course' | 'lesson' | 'reading' | 'reference' | 'work';
  sourceId?: string;
}
export interface WorkspaceEntry {
  id: string;
  kind: WorkspaceKind;
  title: string;
  body: string;
  status: WorkspaceStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  link?: WorkspaceLink;
}
export interface StudentWorkspace { version: 1; entries: WorkspaceEntry[] }
export const STUDENT_WORKSPACE_LIMITS = { entries: 500, title: 160, body: 20000, bytes: 2 * 1024 * 1024 } as const;
const encoder = new TextEncoder();
const kinds = ['task', 'note', 'reading', 'goal', 'project'];
const statuses = ['planned', 'active', 'done'];
function invalid(): never { throw Error('Invalid student workspace. Check entry fields, dates, and storage limits.'); }
function fields(value: unknown, required: string[], optional: string[] = []): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) invalid();
  const keys = Reflect.ownKeys(value);
  if (keys.some(key => typeof key !== 'string' || ![...required, ...optional].includes(key))
    || required.some(key => !Object.prototype.hasOwnProperty.call(value, key))) invalid();
  // Archive data is plain JSON, never getters or mutable executable descriptors.
  for (const key of keys) if (!('value' in Object.getOwnPropertyDescriptor(value, key)!)) invalid();
}
function id(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(value)
    || ['__proto__', 'prototype', 'constructor'].includes(value)) invalid();
}
function timestamp(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)
    || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) invalid();
}
function date(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\d$/.test(value)
    || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) invalid();
}
/** Undefined is the empty legacy workspace. Invalid archives are rejected, never normalized away. */
export function parseStudentWorkspace(input: unknown): StudentWorkspace {
  if (input === undefined) return { version: 1, entries: [] };
  fields(input, ['version', 'entries']);
  if (input.version !== 1 || !Array.isArray(input.entries) || input.entries.length > STUDENT_WORKSPACE_LIMITS.entries
    || Object.getPrototypeOf(input.entries) !== Array.prototype
    || Reflect.ownKeys(input.entries).length !== input.entries.length + 1
    || Object.keys(input.entries).length !== input.entries.length) invalid();
  for (let index = 0; index < input.entries.length; index++)
    if (!Object.prototype.hasOwnProperty.call(input.entries, index)
      || !('value' in Object.getOwnPropertyDescriptor(input.entries, index)!)) invalid();
  const ids = new Set<string>();
  let bytes = 26;
  // Check every bound before constructing a copy. Large text fails before serialization.
  for (const item of input.entries) {
    fields(item, ['id', 'kind', 'title', 'body', 'status', 'createdAt', 'updatedAt'], ['dueDate', 'link']);
    id(item.id); if (ids.has(item.id)) invalid(); ids.add(item.id);
    if (typeof item.kind !== 'string' || !kinds.includes(item.kind) || typeof item.status !== 'string' || !statuses.includes(item.status)) invalid();
    if (typeof item.title !== 'string' || !item.title.length || item.title.trim() !== item.title
      || item.title.length > STUDENT_WORKSPACE_LIMITS.title || /[\x00-\x1f\x7f]/.test(item.title)) invalid();
    if (typeof item.body !== 'string' || item.body.length > STUDENT_WORKSPACE_LIMITS.body || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(item.body)) invalid();
    timestamp(item.createdAt); timestamp(item.updatedAt); if (item.updatedAt < item.createdAt) invalid();
    if ('dueDate' in item) date(item.dueDate);
    if ('link' in item) {
      fields(item.link, ['courseId', 'kind'], ['sourceId']); id(item.link.courseId);
      if (!['course', 'lesson', 'reading', 'reference', 'work'].includes(item.link.kind as string)) invalid();
      if (item.link.kind === 'course') { if ('sourceId' in item.link) invalid(); }
      else id(item.link.sourceId);
    }
    bytes += encoder.encode(JSON.stringify(item)).byteLength + 1;
    if (bytes > STUDENT_WORKSPACE_LIMITS.bytes) invalid();
  }
  return { version: 1, entries: input.entries.map(item => ({ ...item, ...(item.link ? { link: { ...item.link } } : {}) })) } as StudentWorkspace;
}
/** Compare the editor's snapshot inside the profile's atomic storage updater. */
export function upsertWorkspaceEntry(input: unknown, entry: WorkspaceEntry, expectedOriginal: string | null): StudentWorkspace {
  const workspace = parseStudentWorkspace(input);
  const nextEntry = parseStudentWorkspace({ version: 1, entries: [entry] }).entries[0];
  const existing = workspace.entries.find(item => item.id === nextEntry.id);
  if (expectedOriginal === null ? !!existing : !existing || JSON.stringify(existing) !== expectedOriginal)
    throw Error('This workspace entry changed. Reopen it before saving.');
  if (existing && (existing.kind !== nextEntry.kind || existing.createdAt !== nextEntry.createdAt))
    throw Error('An existing entry must keep its kind and creation date.');
  return parseStudentWorkspace({ version: 1, entries: existing
    ? workspace.entries.map(item => item.id === nextEntry.id ? nextEntry : item) : [...workspace.entries, nextEntry] });
}
export function removeWorkspaceEntry(input: unknown, entryId: string, expectedOriginal: string): StudentWorkspace {
  id(entryId);
  const workspace = parseStudentWorkspace(input), existing = workspace.entries.find(item => item.id === entryId);
  if (!existing || JSON.stringify(existing) !== expectedOriginal) throw Error('This workspace entry changed. Reopen it before deleting.');
  return { version: 1, entries: workspace.entries.filter(item => item.id !== entryId) };
}
