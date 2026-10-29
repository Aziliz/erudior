// Authored course data only; shared by app, worker, and portable adapters.
import type { Drill } from "./exerciseTypes";
import type { ManipSpec, ManipTarget } from "./manip";
import type { CodeSpec } from "./code";
import type { ActivityLogSpec, Lab, Rubric, WritingTask } from "./courseWork";
import type { GlossaryEntry, ReaderText } from "./readerContent";
export interface Section {
    id: string;
    name: string;
}
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
    markers?: {
        x: number;
        y: number;
    }[];
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
export interface AudioClip {
    src?: string;
    /** What is said. Spoken by text-to-speech when there's no `src`; shown as the transcript. */
    text?: string;
    /** Voice language for text-to-speech, e.g. "de-DE" (defaults to the course language). */
    lang?: string;
}
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
    /** Authored prerequisite course IDs; publication does not itself approve catalog enforcement. */
    requires?: string[];
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
    branchingScenarios?: import("./branchingCoursePackage").CourseBranchingScenario[];
    scientificWorkspaces?: import("./scientificCoursePackage").CourseScientificWorkspace[];
    spreadsheetAssignments?: Array<import("./spreadsheetAssignments").SpreadsheetAssignment & {
        lessonId: string;
    }>;
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
