// Community courses: the block-only format people write on the website, its limits and checks
// (shared by the editor, the API worker and the app), and conversion to an app course.
// No DOM or Node APIs here: the worker bundles this file too.

export const SUBJECTS = ["Math", "Science", "English", "History and social studies", "Languages", "Arts", "Health and PE", "Technology", "Other"] as const;
export const LEVELS = ["Elementary", "Middle school", "High school", "College", "Adult"] as const;

export type Block =
  | { type: "heading"; text: string }
  | { type: "text"; md: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "image"; imageId: string; alt: string; caption: string }
  | { type: "question"; id: string; stem: string; choices: string[]; answer: number[]; explanation: string };

export interface CLesson {
  id: string;
  title: string;
  blocks: Block[];
}

export interface CCard {
  id: string;
  front: string;
  back: string;
}

export interface CDeck {
  id: string;
  title: string;
  cards: CCard[];
}

export interface CommunityDoc {
  format: "erudior-community";
  version: 1;
  title: string;
  description: string;
  subject: string;
  level: string;
  lessons: CLesson[];
  decks: CDeck[];
}

export const LIMITS = {
  title: 120,
  description: 600,
  lessons: 60,
  blocksPerLesson: 80,
  text: 6000,
  listItems: 30,
  choices: 6,
  short: 500,
  decks: 20,
  cards: 300,
  images: 40,
  /** Bytes per uploaded image. */
  imageBytes: 2 * 1024 * 1024,
  /** Whole document, as JSON. */
  docBytes: 900 * 1024,
};

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export const emptyDoc = (title = "Untitled course"): CommunityDoc => ({
  format: "erudior-community",
  version: 1,
  title,
  description: "",
  subject: "Other",
  level: "Adult",
  lessons: [{ id: "l1", title: "Lesson 1", blocks: [{ type: "text", md: "" }] }],
  decks: [],
});

const ID = /^[A-Za-z0-9_-]{1,40}$/;
const isStr = (x: unknown): x is string => typeof x === "string";

/**
 * Problems that stop publishing (an empty list means it's fine). Drafts may be incomplete;
 * `strict` adds the checks for publishing (no empty lessons, questions answerable, etc.).
 */
export function checkDoc(raw: unknown, strict: boolean): string[] {
  const errs: string[] = [];
  const d = raw as CommunityDoc;
  if (!d || typeof d !== "object" || d.format !== "erudior-community" || d.version !== 1) return ["Not a community course document."];
  if (JSON.stringify(d).length > LIMITS.docBytes) errs.push("The course is too large. Split it into two courses.");
  if (!isStr(d.title) || !d.title.trim()) errs.push("Give the course a title.");
  else if (d.title.length > LIMITS.title) errs.push(`Keep the title under ${LIMITS.title} characters.`);
  if (!isStr(d.description) || d.description.length > LIMITS.description) errs.push(`Keep the description under ${LIMITS.description} characters.`);
  if (strict && !d.description?.trim()) errs.push("Add a short description.");
  if (!SUBJECTS.includes(d.subject as (typeof SUBJECTS)[number])) errs.push("Choose a subject.");
  if (!LEVELS.includes(d.level as (typeof LEVELS)[number])) errs.push("Choose a level.");
  if (!Array.isArray(d.lessons) || !Array.isArray(d.decks)) return [...errs, "The course is damaged (lessons or decks missing)."];
  if (d.lessons.length > LIMITS.lessons) errs.push(`At most ${LIMITS.lessons} lessons.`);
  if (strict && d.lessons.length === 0) errs.push("Add at least one lesson.");
  const ids = new Set<string>();
  const qids = new Set<string>();
  let images = 0;
  d.lessons.forEach((l, i) => {
    const where = `Lesson ${i + 1}${l?.title ? ` (${l.title})` : ""}`;
    if (!l || !ID.test(l.id) || ids.has(l.id)) errs.push(`${where}: bad or repeated id.`);
    else ids.add(l.id);
    if (!isStr(l?.title) || !l.title.trim() || l.title.length > LIMITS.title) errs.push(`${where}: needs a title under ${LIMITS.title} characters.`);
    if (!Array.isArray(l?.blocks)) return void errs.push(`${where}: damaged.`);
    if (l.blocks.length > LIMITS.blocksPerLesson) errs.push(`${where}: at most ${LIMITS.blocksPerLesson} blocks.`);
    if (strict && !l.blocks.some((b) => (b.type === "text" && b.md.trim()) || b.type === "list" || b.type === "image" || b.type === "heading"))
      errs.push(`${where}: has no content.`);
    l.blocks.forEach((b, j) => {
      const at = `${where}, block ${j + 1}`;
      switch (b?.type) {
        case "heading":
          if (!isStr(b.text) || b.text.length > LIMITS.short) errs.push(`${at}: heading too long.`);
          if (strict && !b.text.trim()) errs.push(`${at}: empty heading.`);
          break;
        case "text":
          if (!isStr(b.md) || b.md.length > LIMITS.text) errs.push(`${at}: text over ${LIMITS.text} characters; split it.`);
          break;
        case "list":
          if (!Array.isArray(b.items) || b.items.length > LIMITS.listItems || !b.items.every((x) => isStr(x) && x.length <= LIMITS.short))
            errs.push(`${at}: lists hold up to ${LIMITS.listItems} items of ${LIMITS.short} characters.`);
          if (strict && !b.items.some((x) => x.trim())) errs.push(`${at}: empty list.`);
          break;
        case "image":
          images++;
          if (!ID.test(b.imageId)) errs.push(`${at}: the image is missing.`);
          if (!isStr(b.alt) || b.alt.length > LIMITS.short) errs.push(`${at}: describe the image in under ${LIMITS.short} characters.`);
          if (strict && !b.alt.trim()) errs.push(`${at}: describe the image for people who can't see it (alt text).`);
          if (!isStr(b.caption) || b.caption.length > LIMITS.short) errs.push(`${at}: caption too long.`);
          break;
        case "question": {
          if (!ID.test(b.id) || qids.has(b.id)) errs.push(`${at}: bad or repeated question id.`);
          else qids.add(b.id);
          const choices = Array.isArray(b.choices) ? b.choices : [];
          if (!isStr(b.stem) || b.stem.length > LIMITS.text) errs.push(`${at}: question too long.`);
          if (choices.length > LIMITS.choices || !choices.every((c) => isStr(c) && c.length <= LIMITS.short)) errs.push(`${at}: up to ${LIMITS.choices} choices.`);
          if (!Array.isArray(b.answer) || !b.answer.every((a) => Number.isInteger(a) && a >= 0 && a < choices.length)) errs.push(`${at}: the right answer isn't one of the choices.`);
          if (!isStr(b.explanation) || b.explanation.length > LIMITS.text) errs.push(`${at}: explanation too long.`);
          if (strict) {
            if (!b.stem.trim()) errs.push(`${at}: the question is empty.`);
            if (choices.filter((c) => c.trim()).length < 2 || choices.some((c) => !c.trim())) errs.push(`${at}: needs at least two choices, none empty.`);
            if (!b.answer?.length) errs.push(`${at}: mark the right answer.`);
          }
          break;
        }
        default:
          errs.push(`${at}: unknown block.`);
      }
    });
  });
  if (images > LIMITS.images) errs.push(`At most ${LIMITS.images} images per course.`);
  if (d.decks.length > LIMITS.decks) errs.push(`At most ${LIMITS.decks} card decks.`);
  const dids = new Set<string>();
  let cards = 0;
  d.decks.forEach((k, i) => {
    const where = `Deck ${i + 1}${k?.title ? ` (${k.title})` : ""}`;
    if (!k || !ID.test(k.id) || dids.has(k.id)) errs.push(`${where}: bad or repeated id.`);
    else dids.add(k.id);
    if (!isStr(k?.title) || !k.title.trim() || k.title.length > LIMITS.title) errs.push(`${where}: needs a title.`);
    if (!Array.isArray(k?.cards)) return void errs.push(`${where}: damaged.`);
    cards += k.cards.length;
    const cids = new Set<string>();
    k.cards.forEach((c, j) => {
      if (!ID.test(c?.id) || cids.has(c.id)) errs.push(`${where}, card ${j + 1}: bad id.`);
      else cids.add(c.id);
      if (!isStr(c.front) || !isStr(c.back) || c.front.length > LIMITS.short * 2 || c.back.length > LIMITS.short * 2) errs.push(`${where}, card ${j + 1}: too long.`);
      if (strict && (!c.front.trim() || !c.back.trim())) errs.push(`${where}, card ${j + 1}: needs both sides.`);
    });
    if (strict && k.cards.length === 0) errs.push(`${where}: has no cards.`);
  });
  if (cards > LIMITS.cards) errs.push(`At most ${LIMITS.cards} cards in all.`);
  return errs;
}

/** Image ids a document uses. */
export const imageIds = (d: CommunityDoc): string[] => [
  ...new Set(d.lessons.flatMap((l) => l.blocks.flatMap((b) => (b.type === "image" ? [b.imageId] : [])))),
];

// ---------- to an app course ----------

/**
 * Community text is plain Markdown with no HTML: escape <, drop code fences (which would
 * become figures/plots in the app), and keep only http(s) links.
 */
export function safeMd(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^\s*(```|~~~).*$/gm, "")
    .replace(/\[\[/g, "[​[")
    .replace(/\]\(\s*(?!https?:\/\/)[^)]*\)/g, "]()");
}

const oneLine = (s: string) => safeMd(s).replace(/\s*\n\s*/g, " ").trim();

export interface CommunityMeta {
  id: string;
  version: number;
  review: "reviewed" | "not_reviewed";
  author: string;
}

/**
 * Build an app course. `imageSrc` turns an image id into a URL or data URL (the app embeds
 * images when it installs a course, so it works offline).
 */
export function toCourse(d: CommunityDoc, meta: CommunityMeta, imageSrc: (id: string) => string): Record<string, unknown> {
  const questions: Record<string, unknown>[] = [];
  const lessons = d.lessons.map((l) => {
    const parts: string[] = [];
    const quiz: string[] = [];
    for (const b of l.blocks) {
      if (b.type === "heading") parts.push(`## ${oneLine(b.text)}`);
      else if (b.type === "text") parts.push(safeMd(b.md));
      else if (b.type === "list")
        parts.push(
          b.items
            .filter((x) => x.trim())
            .map((x, i) => `${b.ordered ? `${i + 1}.` : "-"} ${oneLine(x)}`)
            .join("\n"),
        );
      else if (b.type === "image") {
        const alt = oneLine(b.alt).replace(/[[\]]/g, "");
        parts.push(`![${alt}](${imageSrc(b.imageId)})${b.caption.trim() ? `\n\n*${oneLine(b.caption)}*` : ""}`);
      } else if (b.type === "question") {
        const qid = `${l.id}-${b.id}`;
        quiz.push(qid);
        questions.push({
          id: qid,
          topic: l.title,
          // Questions show as plain text (React escapes it), not Markdown.
          stem: b.stem.trim(),
          choices: b.choices.map((c) => c.replace(/\s*\n\s*/g, " ").trim()),
          answer: b.answer,
          explanation: b.explanation.trim() || undefined,
        });
      }
    }
    return { id: l.id, module: "m1", title: l.title.trim(), topics: [l.title.trim()], body: parts.join("\n\n"), quiz: quiz.length ? quiz : undefined };
  });
  const passing = 70;
  return {
    format: "examiner-course",
    version: 1,
    id: `community-${meta.id}`,
    title: d.title.trim(),
    description: d.description.trim(),
    author: meta.author,
    revision: meta.version,
    modules: [{ id: "m1", title: d.title.trim() }],
    lessons,
    banks: questions.length
      ? [
          {
            id: "main",
            title: `${d.title.trim()}: questions`,
            exam: { questionCount: Math.min(questions.length, 50), timeLimitMinutes: Math.max(10, Math.min(questions.length, 50) * 1.5), passingPercent: passing },
            sections: [],
            questions,
          },
        ]
      : [],
    decks: d.decks.map((k) => ({
      id: k.id,
      title: k.title.trim(),
      cards: k.cards.map((c) => ({ id: c.id, front: safeMd(c.front), back: safeMd(c.back), topic: k.title.trim() })),
    })),
    glossary: [],
    references: [],
    drills: [],
    community: meta,
  };
}
