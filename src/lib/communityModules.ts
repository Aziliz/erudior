import type { CommunityDoc } from "./communityFormat";

/** Keep all lessons when removing a module, including the implicit default-module case. */
export function deleteCommunityModule(doc: CommunityDoc, moduleId: string): CommunityDoc {
  const modules = doc.modules ?? [];
  if (!modules.some((m) => m.id === moduleId)) return doc;
  const remaining = modules.filter((m) => m.id !== moduleId);
  const destination = remaining[0]?.id;
  return {
    ...doc,
    modules: remaining.length ? remaining : undefined,
    lessons: doc.lessons.map((lesson) => {
      if (lesson.module === moduleId || (!lesson.module && modules[0]?.id === moduleId)) {
        const { module: _old, ...rest } = lesson;
        return destination ? { ...rest, module: destination } : rest;
      }
      return lesson;
    }),
  };
}

/** Explicitly add one module, preserving the implicit original module and its lessons. */
export function addCommunityModule(doc: CommunityDoc, newId: string): CommunityDoc {
  const modules = doc.modules ?? [];
  if (!modules.length) {
    // A course without explicit modules already has one implicit teaching unit.
    // Materialize it and append exactly one additional unit.
    const used = new Set([...doc.lessons.map((l) => l.id), newId]);
    let number = 1;
    while (used.has(`m${number}`)) number++;
    const originalId = `m${number}`;
    return {
      ...doc,
      modules: [
        { id: originalId, title: doc.title || "Module 1" },
        { id: newId, title: "Module 2" },
      ],
      lessons: doc.lessons.map((l) => ({ ...l, module: originalId })),
    };
  }
  return { ...doc, modules: [...modules, { id: newId, title: `Module ${modules.length + 1}` }] };
}

/** Move a lesson between explicit modules without changing its stable ID or contents. */
export function moveCommunityLesson(doc: CommunityDoc, lessonId: string, moduleId: string): CommunityDoc {
  if (!(doc.modules ?? []).some((m) => m.id === moduleId)) return doc;
  return {
    ...doc,
    lessons: doc.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, module: moduleId } : lesson),
  };
}

/** Add a lesson to the selected module, maintaining unique IDs and an editable text block. */
export function addCommunityLesson(doc: CommunityDoc, moduleId: string): CommunityDoc {
  if (!(doc.modules ?? []).some((m) => m.id === moduleId)) return doc;
  const ids = new Set([...doc.lessons.map((l) => l.id), ...(doc.modules ?? []).map((m) => m.id)]);
  let i = 1;
  while (ids.has(`l${i}`)) i++;
  return { ...doc, lessons: [...doc.lessons, { id: `l${i}`, module: moduleId, title: `Lesson ${doc.lessons.length + 1}`, blocks: [{ type: "text", md: "" }] }] };
}
