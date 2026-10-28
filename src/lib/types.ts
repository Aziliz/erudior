import type { Drill } from "./exerciseTypes";
export type { DrillChoice, DrillVar, NumFormat, AnswerPart, Drill, FigureSpec } from "./exerciseTypes";

// Question bank file format ("examiner-bank", version 1). See docs/BANK_FORMAT.md.

import type { ManipSpec, ManipTarget } from "./manip";
import type { ActivityLogSpec, Lab, LogEntry, Rubric, WorkRecord, WritingTask } from "./work";

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
 *   Optional `dates` (one per item) turn it into "put the events in time order".
 * - map: a map drawn from `map` (the ```map block syntax). Either `targets` (find: click the
 *   named place(s); the answer is the picked names, `choices`/`answer` empty) or `marks`
 *   (label: numbered places, `answer[i]` is the choice for marks[i], like label).
 * - timeline: numbered `slots` (dates) on a timeline; `answer[i]` is the choice (event) placed
 *   at slot i, like label. Optional `timeline` (```timeline syntax) adds periods for context.
 * - model: answered by changing a math manipulative (`model`: counters, blocks, number line,
 *   fraction bars, clock, coins); `target` says what's right. `choices` and `answer` are empty.
 * - code: write a program; `code` holds the language, starter code, tests, hints and solution
 *   (see lib/code.ts). `choices` and `answer` are empty.
 */
import type { CodeSpec } from "./code";

export type QuestionType = "choice" | "text" | "match" | "label" | "order" | "model" | "map" | "timeline" | "code";

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
  /** order: the date of each item, in the correct order (shown after checking). */
  dates?: string[];
  /** map: the map, in ```map block syntax (base, view, regions, points, routes…). */
  map?: string;
  /** map (find): the place(s) to pick. */
  targets?: string[];
  /** map (label): the places that get numbered markers. */
  marks?: string[];
  /** timeline: the dates of the numbered slots. */
  slots?: string[];
  /** timeline: periods (and other events) for context, in ```timeline block syntax. */
  timeline?: string;
  /** code: the exercise (language, starter, tests, hints, solution). */
  code?: CodeSpec;
  /** From an honors lesson: left out of full practice exams unless asked for. */
  honors?: boolean;
  /** model: the manipulative and its starting state. */
  model?: ManipSpec;
  /** model: what counts as right. */
  target?: ManipTarget;
  explanation?: string;
  /**
   * Early readers: words played with a big Listen button under the stem ("Listen. Which word
   * did you hear?"). A recording from the course's audio library under the same text (or a
   * data:audio URL here) plays in place of text-to-speech.
   */
  listen?: string;
  /** Early readers: sound units to blend, shown as tiles the child taps one by one ("c a t"; "c[k]" plays sound:k). */
  blend?: string[];
  /**
   * Listening questions: something to hear before answering (a recorded clip, or text spoken by
   * the device's voice). The transcript (`text`) is shown only after the answer is checked.
   */
  audio?: AudioClip;
}

/** A recorded clip (`src`, a data:audio/… URL) and/or text for the device's voice to speak. */
export interface AudioClip {
  src?: string;
  /** What is said. Spoken by text-to-speech when there's no `src`; shown as the transcript. */
  text?: string;
  /** Voice language for text-to-speech, e.g. "de-DE" (defaults to the course language). */
  lang?: string;
}

/**
 * A learner's answer: choice indices (choice), the choice picked for each left item or marker
 * (match, label, map with marks, timeline; -1 = none yet), the choices in the learner's order
 * (order), the typed text per blank (text), the names of the places picked (map with targets),
 * or the manipulative's state (model; see startState in manip.ts),
 * or `[code, stamp?]` (code; the stamp records the last test run, see makeStamp in lib/code.ts).
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
  /** Competency and baseline at the start of a targeted practice intervention. */
  intervention?: { skillId: string; baseline: number | null };
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
  /** Books and documents read inside the app (the Reading tab's library). See lib/reader.ts. */
  texts?: ReaderText[];
  /** The calculator offered while studying ("none": no calculator); by default it follows the subject (lib/calcKind.ts). */
  calculator?: "basic" | "scientific" | "graphing" | "none";
  /** Community courses (made by users on the website): never count toward homeschool records. */
  community?: CommunityInfo;
  /**
   * Early-reader course (kindergarten to grade 2): read-aloud buttons on every paragraph,
   * question and answer choice, larger text, and each new question read aloud automatically
   * (each learner can turn that off).
   */
  readAloud?: boolean;
  /**
   * Recorded audio that replaces text-to-speech: { key: data:audio URL or "say:<text>" }. A key
   * is the words as they're read (matched ignoring case, spacing and punctuation) or a name
   * that a block refers to, such as `sound:m` for the sound of m. See lib/readAloud.ts.
   */
  audio?: Record<string, string>;
  /** Student work a parent or teacher reviews (lib/work.ts): rubrics, writing assignments, labs, an activity log. */
  rubrics?: Rubric[];
  writing?: WritingTask[];
  labs?: Lab[];
  activityLog?: ActivityLogSpec;
  /** Course-authored spreadsheet exercises; lessonId attaches each assignment to a lesson. */
  spreadsheetAssignments?: Array<import("./spreadsheetAssignments").SpreadsheetAssignment & { lessonId: string }>;
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
  /** Recorded pronunciation (data:audio/… URL); the device's voice is used when missing. */
  audio?: string;
  /** Which typed cards it gets; default both (meaning: term -> English; recall: English -> term). */
  directions?: VocabDirection[];
}

/** A book, poem, play or document in the course's library, read in the app's reader. */
export interface ReaderText {
  id: string;
  title: string;
  author?: string;
  /** When it was written or first published, shown as given ("1862", "c. 1600"). */
  date?: string;
  /** prose (default) and document are Markdown; poem and play are line by line, with line numbers. */
  kind?: "prose" | "poem" | "play" | "document";
  /** Language of the text (BCP-47, e.g. "de-DE"); default: the course's language, else English. */
  lang?: string;
  /** Subject for the homeschool reading log (default: English language arts, or World languages). */
  subject?: string;
  /** Short Markdown introduction shown in the library and above the text. */
  about?: string;
  /** Edition or source, and its copyright status. */
  source?: string;
  /** Poems and plays: number every Nth line (default 5; 0 = no numbers). */
  lineNumbers?: number;
  /** Words explained for this text; [[term]] links look here first, then in the course glossary. */
  glossary?: GlossaryEntry[];
  sections: ReaderSection[];
}

/** A chapter, scene, poem or part of a text. */
export interface ReaderSection {
  id: string;
  title: string;
  /** Markdown (poems and plays: one line of the text per line). Footnotes: [^1] … [^1]: note. */
  body: string;
  /** Reading questions: ids of questions in the course's first bank. */
  questions?: string[];
}

/** Where a student is in one text, and how long they've read it. */
export interface ReadingState {
  /** The section open last, and the paragraph or line at the top of the screen. */
  section: string;
  at: number;
  /** Seconds of active reading (window visible, not idle). */
  seconds: number;
  /** sectionId -> YYYY-MM-DD the student finished it. */
  read: Record<string, string>;
  /** YYYY-MM-DD every section had been read. */
  finished?: string;
  /** YYYY-MM-DD last opened. */
  last: string;
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
  /** Seconds of reading in the reader (optional: older progress files don't have it). */
  readingSec?: number;
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
  /** Course spreadsheet assignment grading history, keyed by course/assignment ID. */
  spreadsheetGrades?: Record<string, {score: number; gradedAt: string; revision: number; assignmentSnapshot?: string; workbookSnapshot?: string; submissionId?: string}>;
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
  /** `${courseId}/${itemId}` -> the student's writing or lab work (lib/work.ts). */
  work?: Record<string, WorkRecord>;
  /** Activity log entries (PE, art, music practice), every course. */
  logs?: LogEntry[];
  /** `${courseId}/${textId}` -> place and time in a text read in the reader */
  reading?: Record<string, ReadingState>;
}

export interface StudyPrefs {
  /** Before the explanation, prompt for your own explanation. Default on. */
  explainFirst?: boolean;
  /** Hide answer choices until you've thought of the answer. Default off. */
  recallFirst?: boolean;
  /** Read-aloud courses: read each new question aloud by itself. Default on. */
  autoRead?: boolean;
}

export interface QuestionMeta {
  flag?: boolean;
  note?: string;
}
