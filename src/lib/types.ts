// Question bank file format ("examiner-bank", version 1). See docs/BANK_FORMAT.md.

export interface Section {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  /** Section id (e.g. "national" / "state"). Optional. */
  section?: string;
  /** Free-text topic used for practice filters and weak-topic tracking. */
  topic: string;
  stem: string;
  choices: string[];
  /** Zero-based indices into `choices`. More than one = "select all that apply". */
  answer: number[];
  explanation?: string;
}

export interface ExamConfig {
  /** Questions drawn at random for each timed exam. */
  questionCount: number;
  timeLimitMinutes: number;
  passingPercent: number;
  /** Optional fixed count per section id; the rest of questionCount is drawn from anywhere. */
  sectionQuotas?: Record<string, number>;
}

export interface Bank {
  format: "examiner-bank";
  version: 1;
  id: string;
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
  chosen: number[];
  correct: boolean;
  flagged?: boolean;
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
  byTopic: Record<string, Tally>;
  bySection: Record<string, Tally>;
  answers: AnswerRecord[];
}

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
  lastSeen: string;
}

export interface Progress {
  version: 1;
  seeded: boolean;
  theme?: "light" | "dark" | "system";
  attempts: Attempt[];
  /** bankId -> questionId -> stats */
  stats: Record<string, Record<string, QuestionStat>>;
}
