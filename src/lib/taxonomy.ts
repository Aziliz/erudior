// How every course is labeled: level, type and subject. Shared by the course catalog, the
// community catalog, the community editor and the API.

export const LEVELS = ["Elementary School", "Middle School", "High School", "College", "Professional"] as const;
export type Level = (typeof LEVELS)[number];

export const TYPES = ["Course", "Exam prep"] as const;
export type CourseType = (typeof TYPES)[number];

export const SUBJECTS = [
  "Math",
  "Science",
  "English and language arts",
  "Reading and literature",
  "Writing",
  "History",
  "Social studies",
  "Geography",
  "Government and civics",
  "Economics",
  "Languages",
  "Computer science",
  "Technology",
  "Engineering",
  "Business",
  "Personal finance",
  "Real estate",
  "Law",
  "Health",
  "Physical education",
  "Psychology",
  "Philosophy and religion",
  "Art",
  "Music",
  "Trades and vocational",
  "Life skills",
  "Test prep",
  "Other",
] as const;

/** Older labels (catalogs and community drafts made before these lists) mapped onto the current ones. */
const OLD_LEVELS: Record<string, Level[]> = {
  elementary: ["Elementary School"],
  "elementary school": ["Elementary School"],
  "middle school": ["Middle School"],
  "high school": ["High School"],
  college: ["College"],
  graduate: ["College"],
  professional: ["Professional"],
  adult: ["Professional"],
  // CEFR language levels fit learners of any age.
  a1: ["High School", "College", "Professional"],
  a2: ["High School", "College", "Professional"],
  b1: ["High School", "College", "Professional"],
  b2: ["High School", "College", "Professional"],
  c1: ["College", "Professional"],
  c2: ["College", "Professional"],
};

/** Current level labels for any level list (unknown labels are dropped). */
export function normalizeLevels(levels: readonly string[]): Level[] {
  const out = new Set<Level>();
  for (const l of levels) for (const x of OLD_LEVELS[l.trim().toLowerCase()] ?? []) out.add(x);
  return LEVELS.filter((l) => out.has(l));
}

/** One level (community courses have exactly one). */
export const normalizeLevel = (level: string): Level => normalizeLevels([level])[0] ?? "Professional";

export function normalizeTypes(types: readonly string[]): CourseType[] {
  const t = new Set(types.map((x) => x.trim().toLowerCase()));
  const out = TYPES.filter((x) => t.has(x.toLowerCase()));
  return out.length ? out : ["Course"];
}

export const normalizeType = (type: string | undefined): CourseType => normalizeTypes(type ? [type] : [])[0];

/** Old community subject names mapped onto the current list. */
const OLD_SUBJECTS: Record<string, string> = {
  english: "English and language arts",
  "history and social studies": "History",
  arts: "Art",
  "health and pe": "Health",
};

/** The current name for a subject, or undefined if it isn't one (old names are mapped). */
export function knownSubject(subject: string): string | undefined {
  if ((SUBJECTS as readonly string[]).includes(subject)) return subject;
  const s = subject.trim().toLowerCase();
  return OLD_SUBJECTS[s] ?? SUBJECTS.find((x) => x.toLowerCase() === s);
}

/** For display: the current subject name, "Other" if it isn't one. */
export const normalizeSubject = (subject: string): string => knownSubject(subject) ?? "Other";

/** The color family a subject uses (styles.css [data-subject]). */
export function subjectKey(subject: string): "math" | "science" | "languages" | "business" | "humanities" | "arts" | "other" {
  const s = normalizeSubject(subject);
  if (["Math", "Computer science", "Engineering", "Technology", "Test prep"].includes(s)) return "math";
  if (["Science", "Health", "Physical education", "Psychology"].includes(s)) return "science";
  if (["Languages", "English and language arts", "Reading and literature", "Writing"].includes(s)) return "languages";
  if (["Real estate", "Business", "Personal finance", "Economics", "Law", "Trades and vocational", "Life skills"].includes(s)) return "business";
  if (["History", "Social studies", "Geography", "Government and civics", "Philosophy and religion"].includes(s)) return "humanities";
  if (["Art", "Music"].includes(s)) return "arts";
  return "other";
}

/** The calculator a subject gets by default. Real exams set the rules: the PSI real estate exams
 * allow only a basic calculator; math and science get a graphing one (AP exams allow it). */
export function calculatorForSubject(subject: string | undefined): "basic" | "scientific" | "graphing" {
  if (subject && ["Real estate", "Law"].includes(subject)) return "basic";
  if (subject && ["Math", "Science", "Engineering", "Computer science", "Economics", "Business", "Personal finance", "Test prep"].includes(subject)) return "graphing";
  return "scientific";
}
