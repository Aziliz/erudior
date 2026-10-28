import type { Bank, Card, Course, Deck, Drill, GlossaryEntry, LanguageInfo, Lesson, Module, ReadingItem, RefSheet, VocabItem } from "./types";
import { BankError, normalizeBank } from "./validate";
import { slugify, uid } from "./util";
import { normalizeWork } from "./work";
import { normalizeTexts } from "./reader";
import { isAudioSrc } from "./audio";

const SEP = "__";

export const bankKey = (courseId: string, localId: string) => `${courseId}${SEP}${localId}`;

export function localBankId(bank: Bank): string {
  return bank.courseId && bank.id.startsWith(bank.courseId + SEP) ? bank.id.slice(bank.courseId.length + SEP.length) : bank.id;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const safeId = (v: unknown, fallback: string) => (/^[A-Za-z0-9_-]{1,100}$/.test(str(v)) ? str(v) : fallback);

export function looksLikeCourse(raw: unknown): boolean {
  return isObj(raw) && (raw.format === "examiner-course" || Array.isArray(raw.lessons) || Array.isArray(raw.decks));
}

export function normalizeCourse(raw: unknown): Course {
  if (!isObj(raw)) throw new BankError("The course must be a JSON object.");
  const title = str(raw.title).trim();
  if (!title) throw new BankError('The course needs a "title".');
  const id = safeId(raw.id, slugify(title));

  const modules: Module[] = arr(raw.modules)
    .filter(isObj)
    .map((m, i) => ({
      id: safeId(m.id, `m${i + 1}`),
      title: str(m.title) || `Module ${i + 1}`,
      ...(m.honors === true ? { honors: true } : {}),
      quiz: arr(m.quiz).length ? arr(m.quiz).map(String).filter(Boolean) : undefined,
    }));

  const lessons: Lesson[] = arr(raw.lessons)
    .filter(isObj)
    .map((l, i) => {
      const module = str(l.module) || modules[0]?.id || "main";
      if (!modules.some((m) => m.id === module)) modules.push({ id: module, title: module });
      return {
        id: safeId(l.id, `l${i + 1}`),
        module,
        title: str(l.title) || `Lesson ${i + 1}`,
        ...(l.honors === true ? { honors: true } : {}),
        topics: arr(l.topics).map(String).filter(Boolean),
        minutes: Number(l.minutes) > 0 ? Number(l.minutes) : undefined,
        body: str(l.body),
        quiz: arr(l.quiz).length ? arr(l.quiz).map(String).filter(Boolean) : undefined,
        drills: arr(l.drills).length ? arr(l.drills).map(String).filter(Boolean) : undefined,
        refs: arr(l.refs).length ? arr(l.refs).map(String).filter(Boolean) : undefined,
      };
    });

  const banks: Bank[] = arr(raw.banks).map((b, i) => {
    try {
      const nb = normalizeBank(b);
      return { ...nb, id: bankKey(id, nb.id), courseId: id };
    } catch (e) {
      throw new BankError(`Question bank ${i + 1}: ${(e as Error).message}`);
    }
  });

  const decks: Deck[] = arr(raw.decks)
    .filter(isObj)
    .map((d, i) => ({
      id: safeId(d.id, `d${i + 1}`),
      title: str(d.title) || `Deck ${i + 1}`,
      description: str(d.description) || undefined,
      cards: arr(d.cards)
        .filter(isObj)
        .map((c, j): Card => ({
          id: safeId(c.id, `c${j + 1}`),
          front: str(c.front),
          back: str(c.back),
          topic: str(c.topic) || undefined,
        }))
        .filter((c) => c.front && c.back),
    }));

  const glossary: GlossaryEntry[] = arr(raw.glossary)
    .filter(isObj)
    .map((g) => ({
      term: str(g.term).trim(),
      definition: str(g.definition).trim(),
      aliases: arr(g.aliases).map(String).filter(Boolean),
      topic: str(g.topic) || undefined,
    }))
    .filter((g) => g.term && g.definition)
    .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));

  const references: RefSheet[] = arr(raw.references)
    .filter(isObj)
    .map((r, i) => ({ id: safeId(r.id, `r${i + 1}`), title: str(r.title) || `Sheet ${i + 1}`, body: str(r.body) }));

  const drills: Drill[] = arr(raw.drills)
    .filter(isObj)
    .map((d, i) => ({
      id: safeId(d.id, `x${i + 1}`),
      title: str(d.title) || `Drill ${i + 1}`,
      topic: str(d.topic) || undefined,
      vars: (isObj(d.vars) ? d.vars : {}) as Drill["vars"],
      funcs: (isObj(d.funcs) ? d.funcs : undefined) as Drill["funcs"],
      // YAML reads a bare number (`mt: 938.3`) as a number; calc entries are expressions (text).
      calc: (isObj(d.calc)
        ? Object.fromEntries(Object.entries(d.calc).map(([k, v]) => [k, typeof v === "number" ? String(v) : v]))
        : undefined) as Drill["calc"],
      where: arr(d.where).length ? arr(d.where).map(String) : undefined,
      prompt: str(d.prompt),
      answer: str(d.answer),
      format: (["money", "money0", "percent", "number", "integer", "fraction", "sci"].includes(str(d.format))
        ? str(d.format)
        : "number") as Drill["format"],
      tolerance: Number.isFinite(Number(d.tolerance)) && d.tolerance !== undefined ? Number(d.tolerance) : undefined,
      answers: arr(d.answers).length ? (arr(d.answers).filter(isObj) as Drill["answers"]) : undefined,
      figure: isObj(d.figure) || Array.isArray(d.figure) ? (d.figure as Drill["figure"]) : undefined,
      solution: str(d.solution),
    }));

  const strs = (v: unknown) => arr(v).map((x) => str(x).trim()).filter(Boolean);
  const lang = isObj(raw.language) && str(raw.language.code) ? raw.language : undefined;
  const language: LanguageInfo | undefined = lang && {
    code: str(lang.code),
    name: str(lang.name) || str(lang.code),
    tts: str(lang.tts) || undefined,
    keys: strs(lang.keys).length ? strs(lang.keys) : undefined,
    ime: str(lang.ime) || undefined,
    level: str(lang.level) || undefined,
    vocabTarget: Number(lang.vocabTarget) > 0 ? Number(lang.vocabTarget) : undefined,
    vocabSource: str(lang.vocabSource) || undefined,
  };

  const seenVocab = new Set<string>();
  const vocab: VocabItem[] = arr(raw.vocab)
    .filter(isObj)
    .map((v, i): VocabItem => {
      const dirs = strs(v.directions).filter((d) => d === "meaning" || d === "recall") as VocabItem["directions"];
      return {
        id: safeId(v.id, `w${i + 1}`),
        ...(str(v.from) ? { from: safeId(v.from, "") || undefined } : {}),
        lesson: str(v.lesson),
        kind: (["word", "phrase", "char"].includes(str(v.kind)) ? str(v.kind) : undefined) as VocabItem["kind"],
        term: str(v.term).trim(),
        alt: strs(v.alt).length ? strs(v.alt) : undefined,
        meanings: strs(v.meanings).length ? strs(v.meanings) : strs([v.meaning]),
        reading: str(v.reading) || undefined,
        pos: str(v.pos) || undefined,
        plural: str(v.plural) || undefined,
        example: str(v.example) || undefined,
        exampleEn: str(v.exampleEn) || undefined,
        note: str(v.note) || undefined,
        ...(isAudioSrc(v.audio) ? { audio: v.audio } : {}),
        directions: dirs && dirs.length ? dirs : undefined,
      };
    })
    .filter((v) => v.term && v.meanings.length && v.lesson && !seenVocab.has(v.id) && seenVocab.add(v.id));

  const readingList: ReadingItem[] = arr(raw.readingList)
    .filter(isObj)
    .map((r) => ({
      title: str(r.title).trim(),
      author: str(r.author) || undefined,
      publisher: str(r.publisher) || undefined,
      level: str(r.level) || undefined,
      url: /^https?:\/\//.test(str(r.url)) ? str(r.url) : undefined,
      isbn: str(r.isbn) || undefined,
      free: r.free === true ? true : undefined,
      note: str(r.note) || undefined,
    }))
    .filter((r) => r.title);

  const texts = normalizeTexts(raw.texts);

  // Listening questions with text but no voice language speak in the course's language.
  const voice = language?.tts ?? language?.code;
  if (voice)
    for (const b of banks)
      for (const q of b.questions) if (q.audio && !q.audio.src && !q.audio.lang) q.audio = { ...q.audio, lang: voice };

  return {
    format: "examiner-course",
    version: 1,
    id,
    title,
    description: str(raw.description).trim() || undefined,
    author: str(raw.author).trim() || undefined,
    updated: str(raw.updated) || undefined,
    revision: Number.isInteger(Number(raw.revision)) && Number(raw.revision) > 0 ? Number(raw.revision) : undefined,
    changelog: str(raw.changelog).trim() || undefined,
    ...(str(raw.disclaimer).trim() ? { disclaimer: str(raw.disclaimer).trim() } : {}),
    modules,
    lessons,
    banks,
    decks,
    glossary,
    references,
    drills,
    ...(language ? { language } : {}),
    ...(vocab.length ? { vocab } : {}),
    ...(readingList.length ? { readingList } : {}),
    ...(texts.length ? { texts } : {}),
    ...(["basic", "scientific", "graphing", "none"].includes(str(raw.calculator)) ? { calculator: str(raw.calculator) as Course["calculator"] } : {}),
    ...(community(raw.community) ? { community: community(raw.community)! } : {}),
    ...(raw.readAloud === true ? { readAloud: true } : {}),
    ...(audioLib(raw.audio) ? { audio: audioLib(raw.audio)! } : {}),
    ...normalizeWork(raw),
    ...(Array.isArray(raw.spreadsheetAssignments) ? { spreadsheetAssignments: raw.spreadsheetAssignments.filter((a): a is NonNullable<Course["spreadsheetAssignments"]>[number] => Boolean(a && typeof a === "object" && "lessonId" in a && typeof a.lessonId === "string" && lessons.some(l => l.id === a.lessonId) && "starter" in a && "answers" in a)) } : {}),
  };
}

/** The audio library: string values only (lib/readAloud.ts decides which are usable). */
function audioLib(a: unknown): Record<string, string> | undefined {
  if (!isObj(a)) return undefined;
  const out = Object.fromEntries(Object.entries(a).filter(([k, v]) => k.trim() && typeof v === "string" && v.trim())) as Record<string, string>;
  return Object.keys(out).length ? out : undefined;
}

function community(c: unknown): Course["community"] | undefined {
  if (!isObj(c) || !str(c.id)) return undefined;
  return {
    id: str(c.id),
    version: Number(c.version) || 1,
    review: c.review === "reviewed" ? "reviewed" : "not_reviewed",
    author: str(c.author),
  };
}

/** Stable, portable export for review, diffing and round-trip tests.
 * Unlike serializeCourse, this does not stamp an export timestamp.
 * Runtime bank namespaces are converted back to local bank IDs.
 */
export function exportCourseSnapshot(course: Course): string {
  const portable = {
    ...course,
    banks: course.banks.map((bank) => {
      const { courseId: _runtimeCourseId, ...rest } = bank;
      return { ...rest, id: localBankId(bank) };
    }),
  };
  return JSON.stringify(portable, null, 2);
}

/** Import a portable canonical course and surface structural reference failures.
 * This intentionally does not publish, approve, or migrate unknown schemas.
 */
export function importCourseSnapshot(source: string): Course {
  const raw: unknown = JSON.parse(source);
  if (!isObj(raw) || raw.format !== "examiner-course" || raw.version !== 1)
    throw new BankError("Expected examiner-course version 1.");
  const imported = normalizeCourse(raw);
  // Integrity checker stays outside course.ts to avoid a runtime import cycle.
  return imported;
}

export function serializeCourse(course: Course): string {
  const out = {
    ...course,
    updated: new Date().toISOString(),
    banks: course.banks.map((b) => {
      const { courseId: _c, ...rest } = b;
      return { ...rest, id: localBankId(b) };
    }),
  };
  return JSON.stringify(out, null, 2);
}

export function emptyCourse(title = "Untitled course"): Course {
  const id = `${slugify(title)}-${uid()}`;
  return {
    format: "examiner-course",
    version: 1,
    id,
    title,
    modules: [{ id: "m1", title: "Module 1" }],
    lessons: [],
    banks: [],
    decks: [],
    glossary: [],
    references: [],
    drills: [],
  };
}

/** Replace one bank (matched by runtime id) inside its course. */
export function withBank(course: Course, bank: Bank): Course {
  const exists = course.banks.some((b) => b.id === bank.id);
  return { ...course, banks: exists ? course.banks.map((b) => (b.id === bank.id ? bank : b)) : [...course.banks, bank] };
}

export function withDeck(course: Course, deck: Deck): Course {
  const exists = course.decks.some((d) => d.id === deck.id);
  return { ...course, decks: exists ? course.decks.map((d) => (d.id === deck.id ? deck : d)) : [...course.decks, deck] };
}

/** Honors lessons and modules are optional extra depth: not needed to finish a module or the course. */
export const isHonorsModule = (course: Pick<Course, "modules">, moduleId: string) => !!course.modules.find((m) => m.id === moduleId)?.honors;
export const isHonorsLesson = (course: Pick<Course, "modules">, l: Lesson) => !!l.honors || isHonorsModule(course, l.module);
/** The lessons that count toward finishing the course. */
export const coreLessons = (course: Course) => course.lessons.filter((l) => !isHonorsLesson(course, l));
/** Lessons that count toward finishing a module (an honors module: all of them). */
export const moduleCoreLessons = (course: Course, moduleId: string) =>
  course.lessons.filter((l) => l.module === moduleId && (isHonorsModule(course, moduleId) || !l.honors));

export function courseCounts(c: Course) {
  return {
    lessons: c.lessons.length,
    questions: c.banks.reduce((s, b) => s + b.questions.length, 0),
    cards: c.decks.reduce((s, d) => s + d.cards.length, 0),
    terms: c.glossary.length,
    drills: c.drills.length,
    references: c.references.length,
  };
}
