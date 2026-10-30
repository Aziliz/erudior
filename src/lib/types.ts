import type { Chosen } from "./courseContentTypes";
export type { Section, QuestionType, QuestionImage, Question, AudioClip, Chosen, ExamConfig, Bank, Module, Lesson, Card, Deck, RefSheet, Course, CommunityInfo, LanguageInfo, VocabDirection, VocabItem, ReadingItem } from "./courseContentTypes";
export type { GlossaryEntry, ReaderText, ReaderSection } from "./readerContent";
export type { DrillChoice, DrillVar, NumFormat, AnswerPart, Drill, FigureSpec } from "./exerciseTypes";

// Question bank file format ("examiner-bank", version 1). See docs/BANK_FORMAT.md.

import type { LogEntry, WorkRecord } from "./work";



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







/** A recorded clip (`src`, a data:audio/… URL) and/or text for the device's voice to speak. */


/**
 * A learner's answer: choice indices (choice), the choice picked for each left item or marker
 * (match, label, map with marks, timeline; -1 = none yet), the choices in the learner's order
 * (order), the typed text per blank (text), the names of the places picked (map with targets),
 * or the manipulative's state (model; see startState in manip.ts),
 * or `[code, stamp?]` (code; the stamp records the last test run, see makeStamp in lib/code.ts).
 */






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






















/** Where a student is in one text, and how long they've read it. */
export interface ReadingState {
  /** Local semantic revision; prior completion remains separately available. */
  revision?: string;
  sectionRevisions?: Record<string, string>;
  priorRead?: Record<string, string>;
  completedRevisions?: Record<string, string>;
  /** Idempotent cumulative writer/day active-time receipts; never silently pruned. */
  writerSeconds?: Record<string, number>;
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
  /** Local anonymous erasure generation; never academic evidence or remote authority. */
  anonymousGeneration?: number;
  /** Learner-imported support instructions only; never adult authority or assessment evidence. */
  interventionTasks?: import("./interventionTasks").InterventionTask[];
  /** Profile-local durable skill evidence and explicit supervising-adult placement history. */
  competencies?: import("./competencyState").CompetencyLedger;
  version: 1;
  seeded: boolean;
  /** Bundled courses already installed once (so deleting one doesn't bring it back). */
  seededCourses?: string[];
  /** Set once the old "install every bundled course" data was cleaned up for the catalog. */
  catalogV1?: boolean;
  /** Homeschool families: the courses this student has in progress (courses are shared on disk). */
  enrolled?: string[];
  /** Learner-owned ordered course plans, kept with this profile's progress and recovery. */
  learningPathways?: import("./learningPathways").LearningPathway[];
  /** Private learner-owned planning; never authoritative assignments or grades. */
  studentWorkspace?: import("./studentWorkspace").StudentWorkspace;
  theme?: "light" | "dark" | "system";
  /** Course spreadsheet assignment grading history, keyed by course/assignment ID. */
  /** Immutable learner-submitted spreadsheet evidence; practice scores remain separate. */
  assessedWorkSubmissions?: import("./assessedWorkEvidence").AssessedWorkSubmissionMap;
  spreadsheetSubmissions?: import("./spreadsheetEvidence").SpreadsheetSubmissionMap;
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
