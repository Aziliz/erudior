import { LIMITS, communityReaderQuestions, type CommunityDoc } from "./communityFormat";

const usedIds = (d: CommunityDoc) => new Set([...(d.modules ?? []).map(m => m.id), ...d.lessons.map(l => l.id)]);
const freshId = (prefix: string, used: Set<string>) => { let n = 1; while (used.has(`${prefix}${n}`)) n++; return `${prefix}${n}`; };
const explicitLessons = (d: CommunityDoc) => d.lessons.map(l => !l.module && d.modules?.length ? { ...l, module: d.modules[0].id } : l);
const readerUses = (d: CommunityDoc, ids: Set<string>) => d.texts?.some(t => t.sections.some(s => s.questions?.some(id => ids.has(id))));

/** Refuse deletion rather than silently discarding dependencies. Quizzes are explicitly disclosed by the UI. */
export function communityModuleDeleteProblem(d: CommunityDoc, id: string): string | undefined {
  if (d.canonical) return "Use the canonical course editor for this course.";
  if ([...(d.writing ?? []), ...(d.labs ?? [])].some(r => r.module === id)) return "Move assessed work to another module before deleting this module.";
  const remaining = { ...d, modules: (d.modules ?? []).filter(m => m.id !== id) };
  const next = new Set(communityReaderQuestions(remaining).map(q => q.id));
  const removed = new Set(communityReaderQuestions(d).filter(q => !next.has(q.id)).map(q => q.id));
  if (readerUses(d, removed)) return "Unlink reading questions from this module quiz before deleting the module.";
}

export function deleteCommunityModule(doc: CommunityDoc, moduleId: string): CommunityDoc {
  if (communityModuleDeleteProblem(doc, moduleId) || !doc.modules?.some(m => m.id === moduleId)) return doc;
  const remaining = doc.modules.filter(m => m.id !== moduleId), destination = remaining[0]?.id;
  return { ...doc, modules: remaining.length ? remaining : undefined,
    lessons: explicitLessons(doc).map(l => { if (l.module !== moduleId) return l; const { module: _old, ...rest } = l; return destination ? { ...rest, module: destination } : rest; }) };
}

export function reorderCommunityModule(doc: CommunityDoc, id: string, direction: -1 | 1): CommunityDoc {
  if (doc.canonical) return doc;
  const modules = [...(doc.modules ?? [])], index = modules.findIndex(m => m.id === id), next = index + direction;
  if (index < 0 || next < 0 || next >= modules.length) return doc;
  [modules[index], modules[next]] = [modules[next], modules[index]];
  return { ...doc, modules, lessons: explicitLessons(doc) };
}

/** Materialize the implicit original module and append exactly one new unit. IDs are resolved against latest state. */
export function addCommunityModule(doc: CommunityDoc, requestedId?: string): CommunityDoc {
  const modules = doc.modules ?? [], used = usedIds(doc);
  if (doc.canonical || modules.length + (modules.length ? 1 : 2) > LIMITS.modules) return doc;
  if (requestedId && (!/^[A-Za-z0-9_-]+$/.test(requestedId) || used.has(requestedId))) return doc;
  const newId = requestedId ?? freshId("m", used); used.add(newId);
  if (!modules.length) {
    const originalId = freshId("m", used);
    return { ...doc, modules: [{ id: originalId, title: doc.title || "Module 1" }, { id: newId, title: "Module 2" }], lessons: doc.lessons.map(l => ({ ...l, module: originalId })) };
  }
  return { ...doc, modules: [...modules, { id: newId, title: `Module ${modules.length + 1}` }] };
}

export function moveCommunityLesson(doc: CommunityDoc, lessonId: string, moduleId: string): CommunityDoc {
  if (doc.canonical || !doc.modules?.some(m => m.id === moduleId) || !doc.lessons.some(l => l.id === lessonId)) return doc;
  return { ...doc, lessons: doc.lessons.map(l => l.id === lessonId ? { ...l, module: moduleId } : l) };
}

export function addCommunityLesson(doc: CommunityDoc, moduleId?: string): CommunityDoc {
  if (doc.canonical || doc.lessons.length >= LIMITS.lessons || (moduleId && !doc.modules?.some(m => m.id === moduleId))) return doc;
  const id = freshId("l", usedIds(doc));
  return { ...doc, lessons: [...doc.lessons, { id, ...(moduleId ? { module: moduleId } : {}), title: `Lesson ${doc.lessons.length + 1}`, blocks: [{ type: "text", md: "" }] }] };
}

export function communityLessonDeleteProblem(doc: CommunityDoc, id: string): string | undefined {
  if (doc.canonical) return "Use the canonical course editor for this course.";
  if (doc.lessons.length <= 1) return "Keep at least one lesson in this course.";
  if ([...(doc.spreadsheetAssignments ?? []), ...(doc.branchingScenarios ?? []), ...(doc.scientificWorkspaces ?? []), ...(doc.advancedAssessments ?? [])].some(a => a.lessonId === id)) return "Move or remove linked workspaces and assignments before deleting this lesson.";
  if (doc.vocab?.some(v => v.lesson === id)) return "Move vocabulary to another lesson before deleting this lesson.";
  const next = new Set(communityReaderQuestions({ ...doc, lessons: doc.lessons.filter(l => l.id !== id) }).map(q => q.id));
  if (readerUses(doc, new Set(communityReaderQuestions(doc).filter(q => !next.has(q.id)).map(q => q.id)))) return "Unlink reading questions before deleting this lesson.";
  if (doc.lessons.find(l => l.id === id)?.blocks.some(b => b.type === "assignment")) return "Remove assessed work links before deleting this lesson.";
}
export function deleteCommunityLesson(doc: CommunityDoc, id: string): CommunityDoc {
  if (communityLessonDeleteProblem(doc, id) || !doc.lessons.some(l => l.id === id)) return doc;
  return { ...doc, lessons: doc.lessons.filter(l => l.id !== id) };
}
export function reorderCommunityLesson(doc: CommunityDoc, id: string, direction: -1 | 1): CommunityDoc {
  if (doc.canonical) return doc;
  const lessons = [...doc.lessons], index = lessons.findIndex(l => l.id === id), next = index + direction;
  if (index < 0 || next < 0 || next >= lessons.length) return doc;
  [lessons[index], lessons[next]] = [lessons[next], lessons[index]];
  return { ...doc, lessons };
}
