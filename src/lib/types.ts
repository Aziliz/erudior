// Question bank file format ("examiner-bank", version 1). See docs/BANK_FORMAT.md.

export interface Section {
  id: string;
  name: string;
}

/**
 * Question kinds. All of them keep `choices` and `answer` so code that only lists or counts
 * questions keeps working:
 * - choice (default): pick one; more than one index in `answer` = "select all that apply".
 * - text: fill in the blank(s). Each `___` in the stem is a blank (none = one box under the
 *   stem); `accept[i]` lists the accepted answers for blank i. `choices` and `answer` are empty.
 * - match: `left[i]` is matched to `choices[answer[i]]`; extra choices are distractors.
 * - label: like match, but the left side is numbered markers on `image` at `markers[i]`.
 * - order: `choices` are listed in the correct order and shown shuffled. `answer` is empty.
 */
export type QuestionType = "choice" | "text" | "match" | "label" | "order";

export interface QuestionImage {
  /** A data: URL (bundled and community courses) or an app-relative path. */
  src: string;
  /** What the image shows, for people who can't see it. Required. */
  alt: string;
  caption?: string;
}

export interface Question {
  id: string;
  /** Section id (e.g. "national" / "state"). Optional. */
  section?: string;
  /** Free-text topic used for practice filters and weak-topic tracking. */
  topic: string;
  type?: QuestionType;
  stem: string;
  /** Shown under the stem (any type); the picture for label questions. */
  image?: QuestionImage;
  choices: string[];
  /** Zero-based indices into `choices`. More than one = "select all that apply". */
  answer: number[];
  /** match: the items on the left. */
  left?: string[];
  /** label: marker positions on the image, in percent of its width and height. */
  markers?: { x: number; y: number }[];
  /** text: accepted answers per blank. */
  accept?: string[][];
  /** text: answers must match capital letters too (e.g. gene symbols). */
  caseSensitive?: boolean;
  /** text: a typed fraction must be in lowest terms (6/8 is wrong when 3/4 is accepted). */
  lowestTerms?: boolean;
  /** From an honors lesson: left out of full practice exams unless asked for. */
  honors?: boolean;
  explanation?: string;
}

/**
 * A learner's answer: choice indices (choice), the choice picked for each left item or marker
 * (match, label; -1 = none yet), the choices in the learner's order (order), or the typed
 * text per blank (text).
 */
export type Chosen = (number | string)[];

export interface ExamConfig {
  /** Questions drawn at random for each timed exam. */
  questionCount: number;
  timeLimitMinutes: number;
  passingPercent: number;
  /** Optional fixed count per section id; the rest of questionCount is drawn from anywhere. */
  sectionQuotas?: Record<string, number>;
  /**
   * Optional pass mark per section id (percent). When set, an exam passes only
   * if every listed section meets its own mark, like PSI's two-portion exams.
   */
  sectionPassing?: Record<string, number>;
  /**
   * Optional time limit per section id (minutes). With section quotas, the
   * exam runs one section at a time, each on its own clock, like PSI.
   */
  sectionTimeLimits?: Record<string, number>;
}

export interface Bank {
  format: "examiner-bank";
  version: 1;
  /**
   * Standalone banks: the file id. Banks inside a course are given the
   * runtime id `${courseId}__${localId}` so stats never collide across courses.
   */
  id: string;
  /** Runtime only: set when the bank lives inside a course. Never serialized. */
  courseId?: string;
  title: string;
  description?: string;
  author?: string;
  updated?: string;
  sections: Section[];
  exam: ExamConfig;
  questions: Question[];
}

export type Mode = "exam" | "practice";

export interface AnswerRecord {
  qid: string;
  chosen: Chosen;
  correct: boolean;
  flagged?: boolean;
  /** How sure the student said they were before checking (practice and quizzes). */
  confidence?: "sure" | "unsure" | "guess";
}

export interface Tally {
  total: number;
  correct: number;
}

export interface Attempt {
  id: string;
  bankId: string;
  bankTitle: string;
  mode: Mode;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  timeLimitSec?: number;
  total: number;
  answered: number;
  correct: number;
  passingPercent?: number;
  /** Per-section pass marks, keyed by section name (as in bySection). */
  sectionPassing?: Record<string, number>;
  /** Set when this attempt was a lesson's end-of-lesson quiz. */
  lesson?: LessonRef;
  /** Set when this attempt was a module's end-of-module quiz. */
  module?: ModuleRef;
  /** "weekly": the weekly cumulative review quiz. */
  kind?: "pretest" | "weekly";
  byTopic: Record<string, Tally>;
  bySection: Record<string, Tally>;
  answers: AnswerRecord[];
}

export interface LessonRef {
  courseId: string;
  lessonId: string;
}

export interface ModuleRef {
  courseId: string;
  moduleId: string;
}

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
  lastSeen: string;
  /** Spaced review (lib/review.ts): right answers on separate days since the last miss. */
  streak?: number;
  /** Spaced review: local YYYY-MM-DD the question is next due. */
  due?: string;
  /** Spaced review: local day of the last right answer that counted. */
  rightDay?: string;
}

// ---------------------------------------------------------------------------
// Course pack format ("examiner-course", version 1). See docs/COURSE_FORMAT.md.

export interface Module {
  id: string;
  title: string;
  /** An honors module: optional extra material (every lesson in it is honors). */
  honors?: boolean;
  /**
   * End-of-module quiz: ids of questions in the course's first bank. It unlocks once
   * every lesson in the module is complete; passing it marks the module complete.
   */
  quiz?: string[];
}

export interface Lesson {
  id: string;
  module: string;
  title: string;
  /**
   * Honors lesson: optional extra depth. It isn't needed to finish its module or the course,
   * but study time on it counts like any lesson.
   */
  honors?: boolean;
  /** Question/card topics this lesson covers, for "practice this" links. */
  topics?: string[];
  minutes?: number;
  /** Markdown. [[term]] or [[term|shown text]] links to the glossary. */
  body: string;
  /** Math drill ids and quick-reference sheet ids offered in the lesson's study box. */
  drills?: string[];
  refs?: string[];
  /**
   * End-of-lesson quiz: ids of questions in the course's first bank. When set,
   * passing the quiz (LESSON_QUIZ_PASS percent) is what marks the lesson complete.
   */
  quiz?: string[];
}

export interface Card {
  id: string;
  front: string;
  back: string;
  topic?: string;
}

export interface Deck {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  aliases?: string[];
  topic?: string;
}

export interface RefSheet {
  id: string;
  title: string;
  body: string; // Markdown
}

/** A choice can be a number, text, or a label shown in text with a number used in math. */
export type DrillChoice = number | string | { label: string; value: number };

export type DrillVar = { min: number; max: number; step?: number } | { choices: DrillChoice[] };

export type NumFormat = "money" | "money0" | "percent" | "number" | "integer" | "fraction" | "sci";

/**
 * One answer box. A drill has either the classic single `answer` + `format`, or a list
 * of `answers` (multi-part, e.g. x and y).
 */
export interface AnswerPart {
  /** Name of the calc/var value that's correct (number kinds). */
  name?: string;
  /** Label next to the box, e.g. "x =" or "Speed". Markdown/math allowed. */
  label?: string;
  /**
   * number (default): any equivalent value, typed as a number or math like 3/4, sqrt(3)/2, 2pi.
   * fraction: must be typed as a whole number or fraction (no decimals), e.g. -7/4.
   * expression: an algebraic answer in the listed variables, e.g. 6x^2 - 2, checked by
   *   plugging values in. `expression` is the correct one, written with drill values/functions.
   */
  kind?: "number" | "fraction" | "expression";
  format?: NumFormat;
  /** Absolute tolerance (number kinds). */
  tolerance?: number;
  /** Relative tolerance, e.g. 0.01 for 1%. */
  relTolerance?: number;
  /** Accept anything that rounds to the same value at this many significant figures. */
  sigfigs?: number;
  /** Fractions must be in lowest terms. */
  lowestTerms?: boolean;
  /** Accepted units and their factor to the answer's unit: { "m/s": 1, "km/h": 0.27778 }. The first is shown. */
  units?: Record<string, number>;
  /** Expression kind: the correct expression, e.g. "3*a*x^2 - 2" or "deriv(f, x)". */
  expression?: string;
  /** Expression kind: the variables the answer may use. Default ["x"]. */
  variables?: string[];
  /** Expression kind: accept answers that differ by a constant (antiderivatives, "+ C"). */
  plusC?: boolean;
  /** Expression kind: how to show the correct answer (placeholders and $math$ allowed). */
  show?: string;
}

export interface Drill {
  id: string;
  title: string;
  topic?: string;
  /** Random inputs. */
  vars: Record<string, DrillVar>;
  /**
   * Functions usable in calc, where and answers: { "f(x)": "a*x^2 + b*x" }. They can use
   * the drill's values, and deriv(f, x), integ(f, a, b), solve(f, lo, hi), limit(f, a)
   * and extremum(f, lo, hi, ±1) work on them.
   */
  funcs?: Record<string, string>;
  /** Derived values, evaluated in order. See docs/COURSE_FORMAT.md for operators and functions. */
  calc?: Record<string, string>;
  /** Conditions every problem must meet (e.g. "b^2 - 4*a*c > 0"); the inputs are re-rolled until they do. */
  where?: string[];
  /** Text with {name} or {name:format} placeholders. */
  prompt: string;
  /** Name of the var/calc value that is the answer (single-answer drills). */
  answer: string;
  format: NumFormat;
  /** Accepted absolute difference. Defaults by format. */
  tolerance?: number;
  /** Multi-part or non-numeric answers. When present, `answer`/`format`/`tolerance` are ignored. */
  answers?: AnswerPart[];
  /** A graph or diagram shown with the problem (see Figure in docs/COURSE_FORMAT.md). */
  figure?: FigureSpec | FigureSpec[];
  /** Worked solution, same placeholder syntax. */
  solution: string;
}

/** Graph or diagram spec. Numbers anywhere may be expressions using the drill's values. */
export interface FigureSpec {
  /**
   * "plot" draws on coordinate axes; "shape" draws a plain diagram (geometry);
   * "numberline" draws a single horizontal number line (use y = 0 for points and segments).
   */
  type: "plot" | "shape" | "numberline";
  /** Plot only: same scale on both axes (circles look round). Height follows the ranges. */
  equal?: boolean;
  /** Axis titles (plot only). */
  xLabel?: string;
  yLabel?: string;
  /** Visible range; plot defaults to [-10, 10] both ways. */
  x?: [number | string, number | string];
  y?: [number | string, number | string];
  /** Grid and axes (plot only). Default true. */
  grid?: boolean;
  /** Where the y-axis (and its numbers) sits: at x = 0 when visible (default) or along the left edge. */
  yAxisAt?: "zero" | "left";
  /** Where the x-axis (and its numbers) sits: at y = 0 when visible (default) or along the bottom edge. */
  xAxisAt?: "zero" | "bottom";
  /** Functions to graph: "f" (a drill function), or an expression in x like "2x + 1". */
  functions?: (string | { f: string; label?: string; color?: string; dashed?: boolean; from?: number | string; to?: number | string })[];
  /** Points: [x, y] or { at: [x, y], label?, open? }. */
  points?: ([number | string, number | string] | { at: [number | string, number | string]; label?: string; open?: boolean; color?: string })[];
  /** Line segments and arrows. */
  segments?: { from: [number | string, number | string]; to: [number | string, number | string]; label?: string; arrow?: boolean; dashed?: boolean; color?: string }[];
  /** Polygons (triangles, etc.). */
  polygons?: { points: [number | string, number | string][]; fill?: boolean; color?: string }[];
  circles?: { center: [number | string, number | string]; r: number | string; fill?: boolean; color?: string }[];
  /** Text labels at a point. */
  labels?: { at: [number | string, number | string]; text: string }[];
  /** Shade between a function and the x-axis (or another function) from a to b. */
  shade?: { f: string; g?: string; from: number | string; to: number | string; color?: string }[];
  /** Tangent line to a function at x. */
  tangents?: { f: string; at: number | string; color?: string }[];
  /** Right-angle marks: the corner vertex and its two neighbors. */
  rightAngles?: [[number | string, number | string], [number | string, number | string], [number | string, number | string]][];
  /** Parametric curves (x(t), y(t)) for t in [from, to]; also polar curves via r(t)cos t, r(t)sin t. */
  curves?: { x: string; y: string; t: [number | string, number | string]; label?: string; color?: string; dashed?: boolean }[];
  /** Slope field for dy/dx = f(x, y): short segments on a grid (step defaults to a 20×15 grid). */
  slopeField?: { f: string; step?: number | string };
  /** Vector field (u(x, y), v(x, y)): arrows on a grid, scaled to fit. */
  vectorField?: { u: string; v: string; step?: number | string };
  /** Bars (histograms, bar charts): each bar is centered at x with the given height. */
  bars?: { x: number | string; height: number | string; width?: number | string; label?: string; color?: string }[];
  /** Drawing size in px (width); height follows the aspect of the ranges for shapes. Default 420. */
  width?: number;
  caption?: string;
}

export interface Course {
  format: "examiner-course";
  version: 1;
  id: string;
  title: string;
  description?: string;
  author?: string;
  updated?: string;
  /** Integer that goes up with each published version of the course. */
  revision?: number;
  /** What changed in this revision (shown when offering the update). */
  changelog?: string;
  /** Shown on the course's pages: limits of the material (professional and exam-prep courses). */
  disclaimer?: string;
  modules: Module[];
  lessons: Lesson[];
  banks: Bank[];
  decks: Deck[];
  glossary: GlossaryEntry[];
  references: RefSheet[];
  drills: Drill[];
  /** Language courses: the language, its proficiency level, and typing helpers. */
  language?: LanguageInfo;
  /** Language courses: words (and alphabet characters) learned with typed review cards. */
  vocab?: VocabItem[];
  /** Recommended reading for the course's level. */
  readingList?: ReadingItem[];
  /** The calculator offered while studying ("none": no calculator); by default it follows the subject (lib/calcKind.ts). */
  calculator?: "basic" | "scientific" | "graphing" | "none";
  /** Community courses (made by users on the website): never count toward homeschool records. */
  community?: CommunityInfo;
}

export interface CommunityInfo {
  /** The course's id on the community site. */
  id: string;
  version: number;
  review: "reviewed" | "not_reviewed";
  author: string;
}

export interface LanguageInfo {
  /** BCP-47 code, e.g. "de". */
  code: string;
  /** Display name, e.g. "German". */
  name: string;
  /** Voice for text-to-speech, e.g. "de-DE". */
  tts?: string;
  /** Characters offered as buttons under the typing box, e.g. ["ä", "ö", "ü", "ß"]. */
  keys?: string[];
  /** Input converter for non-Roman scripts (e.g. "ja": romaji -> kana -> kanji). */
  ime?: string;
  /** Proficiency framework and level, e.g. "CEFR A1". */
  level?: string;
  /** Recommended minimum vocabulary for the level. */
  vocabTarget?: number;
  /** Where vocabTarget comes from. */
  vocabSource?: string;
}

export type VocabDirection = "meaning" | "recall";

export interface VocabItem {
  id: string;
  /** Set on words carried over from an earlier course (its course id), e.g. A1 words inside A2. */
  from?: string;
  /** Lesson that introduces it; it joins the review backlog once that lesson is done. */
  lesson: string;
  kind?: "word" | "phrase" | "char";
  /** The word as written in the language, e.g. "der Hund" (nouns with their article). */
  term: string;
  /** Other accepted spellings of the term. */
  alt?: string[];
  /** Accepted English meanings; the first is shown. */
  meanings: string[];
  /** Romanization or pronunciation guide (non-Roman scripts). */
  reading?: string;
  /** Part of speech, e.g. "noun", "verb". */
  pos?: string;
  /** Noun plural, e.g. "die Hunde". */
  plural?: string;
  /** Example sentence and its translation. */
  example?: string;
  exampleEn?: string;
  note?: string;
  /** Which typed cards it gets; default both (meaning: term -> English; recall: English -> term). */
  directions?: VocabDirection[];
}

export interface ReadingItem {
  title: string;
  author?: string;
  publisher?: string;
  level?: string;
  url?: string;
  isbn?: string;
  free?: boolean;
  note?: string;
}

/** Review state of one vocab card (item + direction). */
export interface VocabState {
  /** 0 novice, 1 beginner, 2 advanced, 3 expert. */
  stage: number;
  /** Correct answers in a row within the stage (0-4; the 5th moves it up). */
  streak: number;
  /** Passed expert: out of the review rotation. */
  done?: boolean;
  /** YYYY-MM-DD of the last counted review (one counted review per day). */
  last?: string;
  right?: number;
  wrong?: number;
  /** YYYY-MM-DD the card was first reviewed (paces carried-over words in). */
  intro?: string;
}

// ---------------------------------------------------------------------------

export interface CardState {
  /** YYYY-MM-DD the card is next due. */
  due: string;
  /** Scheduled interval in days (0 = again, still in today's session). */
  ivl: number;
  /** Legacy SM-2 ease; only read to convert old cards to FSRS. */
  ease: number;
  reps: number;
  lapses: number;
  last: string;
  /** YYYY-MM-DD the card was first studied (for the new-cards-per-day limit). */
  first?: string;
  /** FSRS memory stability in days (absent on cards not yet rated under FSRS). */
  stability?: number;
  /** FSRS difficulty, 1 (easy) to 10 (hard). */
  difficulty?: number;
}

export interface Plan {
  examDate: string; // YYYY-MM-DD
  daysPerWeek: number; // 1-7
  newCardsPerDay: number;
  createdAt: string;
}

export interface DayActivity {
  questions: number;
  cards: number;
  lessons: number;
  drills: number;
}

export interface Progress {
  version: 1;
  seeded: boolean;
  /** Bundled courses already installed once (so deleting one doesn't bring it back). */
  seededCourses?: string[];
  /** Set once the old "install every bundled course" data was cleaned up for the catalog. */
  catalogV1?: boolean;
  /** Homeschool families: the courses this student has in progress (courses are shared on disk). */
  enrolled?: string[];
  theme?: "light" | "dark" | "system";
  attempts: Attempt[];
  /** bankId -> questionId -> stats */
  stats: Record<string, Record<string, QuestionStat>>;
  /** `${courseId}/${deckId}/${cardId}` -> spaced-repetition state */
  cards: Record<string, CardState>;
  /** `${courseId}/${lessonId}` -> local YYYY-MM-DD completed */
  lessonsDone: Record<string, string>;
  /** `${courseId}/${moduleId}` -> local YYYY-MM-DD the module quiz was passed */
  modulesDone?: Record<string, string>;
  /** courseId -> plan */
  plans: Record<string, Plan>;
  /** YYYY-MM-DD -> counts (for streaks and today's checklist) */
  activity: Record<string, DayActivity>;
  /** `${courseId}/${drillId}` -> tallies */
  drills: Record<string, { attempts: number; correct: number }>;
  /** `${courseId}/${itemId}/${direction}` -> vocabulary review state */
  vocab?: Record<string, VocabState>;
  /** `${bankId}/${questionId}` -> the user's persistent flag and note */
  qmeta?: Record<string, QuestionMeta>;
  /** Study habits for practice (see BankHome). */
  study?: StudyPrefs;
  /** `${courseId}/${lessonId}` -> local YYYY-MM-DD the pre-lesson warm-up was done or skipped */
  pretests?: Record<string, string>;
}

export interface StudyPrefs {
  /** Before the explanation, prompt for your own explanation. Default on. */
  explainFirst?: boolean;
  /** Hide answer choices until you've thought of the answer. Default off. */
  recallFirst?: boolean;
}

export interface QuestionMeta {
  flag?: boolean;
  note?: string;
}
