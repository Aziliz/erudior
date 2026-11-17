import { o, type CourseOutline } from "./types";

/** Writing systems and sound features that change what a first course must teach. */
const SCRIPT: Record<string, string> = {
  Russian: "the Cyrillic alphabet", "Modern Greek": "the Greek alphabet", Hebrew: "the Hebrew alphabet and vowel points",
  Arabic: "the Arabic script", "Persian (Farsi)": "the Persian alphabet", Urdu: "the Urdu (Nastaliq) script",
  Hindi: "Devanagari", Marathi: "Devanagari", Bengali: "the Bengali script", Punjabi: "Gurmukhi",
  Tamil: "the Tamil script", Telugu: "the Telugu script", Thai: "the Thai script", Korean: "Hangul",
  "Mandarin Chinese": "pinyin and first characters", Japanese: "hiragana, katakana and first kanji",
};
const TONES = new Set(["Mandarin Chinese", "Thai", "Vietnamese", "Punjabi"]);

/** Six proficiency bands, roughly CEFR A1 to C2. */
const BANDS: { modules: string[]; outcomes: string[]; capstone: string }[] = [
  { modules: ["Sounds and pronunciation", "Greetings and introductions", "Numbers, time and dates", "Family, home and daily routines", "Food and shopping", "Core grammar: the present and basic sentences"],
    outcomes: ["Understand and use familiar everyday expressions and very basic phrases.", "Introduce yourself and ask and answer simple personal questions."],
    capstone: "Record a self-introduction and a short role-play, and write a message about your week." },
  { modules: ["Past and future events", "Travel and directions", "Work and school", "Health and services", "Describing people and places", "Grammar for routine tasks"],
    outcomes: ["Communicate in simple, routine tasks on familiar topics.", "Describe your background, surroundings and past experiences simply."],
    capstone: "Record a conversation about a past trip and write a short personal letter." },
  { modules: ["Experiences and plans", "Opinions and reasons", "News and media", "Culture and traditions", "Problem solving in everyday situations", "Connected grammar and longer texts"],
    outcomes: ["Handle most situations while traveling or living where the language is spoken.", "Produce connected text on familiar topics and give reasons for opinions."],
    capstone: "Give a recorded talk on a cultural topic and write a reasoned opinion piece." },
  { modules: ["Abstract and technical topics", "Argument and debate", "Literature and film", "Work and professional life", "Society and current issues", "Complex grammar and register"],
    outcomes: ["Understand the main ideas of complex texts, including technical discussion in your field.", "Interact fluently with native speakers and argue a viewpoint."],
    capstone: "Hold a recorded debate and write an argumentative essay." },
  { modules: ["Academic language", "Professional communication", "Literature and the arts", "Implicit meaning and nuance", "Structured writing", "Style and register"],
    outcomes: ["Understand demanding, longer texts and recognize implicit meaning.", "Use the language flexibly for social, academic and professional purposes."],
    capstone: "Write and present a structured academic or professional report." },
  { modules: ["Near-native comprehension", "Specialized fields", "Literature and rhetoric", "Idiom and cultural depth", "Precision and nuance", "Translation and mediation"],
    outcomes: ["Understand virtually everything heard or read.", "Express yourself precisely, distinguishing fine shades of meaning."],
    capstone: "Translate and analyze a demanding text and present your analysis." },
];

/** Which band each course in a framework covers, by the framework's number of levels. */
function bandFor(index: number, count: number): number {
  if (count === 6) return index;
  if (count === 5) return [0, 2, 3, 4, 5][index]!; // ACTFL-style Novice to Distinguished; JLPT N5 to N1 uses 0-4 below
  if (count === 9) return [0, 1, 2, 2, 3, 3, 4, 5, 5][index]!; // HSK 3.0 levels 1-9
  return Math.min(5, Math.round((index / Math.max(1, count - 1)) * 5));
}

const EXAMS: Record<string, string> = { "Mandarin Chinese": "HSK", Japanese: "JLPT", Korean: "TOPIK" };

/** Outline for one level of a modern-language proficiency track. */
export function languageOutline(language: string, level: string, index: number, count: number): CourseOutline {
  const band = language === "Japanese" ? index : bandFor(index, count);
  const base = BANDS[band]!;
  const modules = [...base.modules];
  if (index === 0 && SCRIPT[language]) modules.unshift(`Reading and writing ${SCRIPT[language]}`);
  if (index === 0 && TONES.has(language)) modules.splice(1, 0, "Tones");
  if (index > 0 && SCRIPT[language] && /Chinese|Japanese/.test(language)) modules.push(`${language === "Japanese" ? "Kanji" : "Characters"} for ${level}`);
  const exam = EXAMS[language];
  modules.push(exam ? `${exam} ${level.replace(/^(HSK|TOPIK) /, "")} practice in the exam format` : `Proficiency practice at ${level}`);
  return o(modules, base.outcomes, base.capstone);
}
