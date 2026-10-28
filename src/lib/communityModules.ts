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
    const implicit = "m1" === newId ? "m2" : "m1";
    return {
      ...doc,
      modules: [{ id: implicit, title: doc.title }, { id: newId, title: "Module 2" }],
      lessons: doc.lessons.map((l) => ({ ...l, module: implicit })),
    };
  }
  return { ...doc, modules: [...modules, { id: newId, title: `Module ${modules.length + 1}` }] };
}
