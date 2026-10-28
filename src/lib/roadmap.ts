// What Erudior needs before version 1.0 (ready to be a family's whole homeschool program or a
// teacher's course set): the K–12 course map from Jon's homeschool roadmap, and the lesson-engine
// work those courses need. Shown at erudior.com/roadmap. A course counts as available when the
// catalog has it (matched by `catalog` title), so the page updates itself as courses ship.

export interface RoadmapCourse {
  title: string;
  /** What it covers, in a few words. */
  covers?: string;
  /** Catalog title when it exists (or will exist) under another name. */
  catalog?: string;
}

export interface RoadmapGroup {
  id: string;
  title: string;
  note?: string;
  courses: RoadmapCourse[];
}

const K8 = ["K", "1", "2", "3", "4", "5", "6", "7", "8"];
const gradeName = (g: string) => (g === "K" ? "Kindergarten" : `Grade ${g}`);

const K8_TOPICS: Record<string, [string, string, string, string]> = {
  K: ["Counting to 100, shapes, comparing", "Letters, phonics, first sight words", "Senses, weather, plants and animals", "Me, family, community, rules"],
  "1": ["Adding and subtracting within 20, place value, time", "Reading fluency, sentences, spelling", "Light, sound, sky patterns, animal parents", "Maps, community helpers, holidays"],
  "2": ["Adding and subtracting within 1,000, money, measurement", "Paragraphs, grammar, reading for meaning", "Materials, land and water, habitats", "Local history, geography, goods and services"],
  "3": ["Multiplication, division, fractions, area", "Narrative writing, chapter books, cursive", "Forces, life cycles, weather and climate", "State history, Native peoples, branches of government"],
  "4": ["Multi-digit operations, decimals, angles", "Informational writing, vocabulary, poetry", "Energy, waves, Earth's features, body systems", "US regions, exploration"],
  "5": ["Fraction operations, volume, the coordinate plane", "Research reports, literary devices", "Matter, ecosystems, Earth and space", "US history to 1850"],
  "6": ["Ratios, percents, negative numbers, expressions", "Argument essays, novels, speaking", "Earth science: plates, weather, water", "Ancient civilizations"],
  "7": ["Proportions, probability, linear equations", "Poetry, persuasive writing, research", "Life science: cells, genetics, ecosystems", "Medieval and early modern world"],
  "8": ["Functions, linear systems, the Pythagorean theorem", "Evidence and analysis, speeches, grammar", "Physical science: chemistry and physics basics", "US history to 1900, civics and the Constitution"],
};
const SUBJECTS = ["Math", "Language Arts", "Science", "Social Studies"] as const;

export const ROADMAP: RoadmapGroup[] = [
  ...SUBJECTS.map((subject, i) => ({
    id: `k8-${subject.toLowerCase().replace(/\s+/g, "-")}`,
    title: `${subject}, kindergarten to grade 8`,
    courses: K8.map((g) => ({
      title: `${subject} ${g === "K" ? "K" : g}`,
      covers: `${gradeName(g)}: ${K8_TOPICS[g][i]}`,
      ...(subject === "Math" && g === "8" ? { catalog: "Pre-algebra and Arithmetic" } : {}),
    })),
  })),
  {
    id: "k8-other",
    title: "Art, music, health and PE, kindergarten to grade 8",
    note: "Short courses, one per grade band, so every student covers the subjects many states require.",
    courses: ["K–2", "3–5", "6–8"].flatMap((band) =>
      ["Art", "Music", "Health and Safety", "Physical Education"].map((s) => ({ title: `${s} ${band}`, covers: `Grades ${band}` })),
    ),
  },
  {
    id: "k8-life-skills",
    title: "Digital and life skills, kindergarten to grade 8",
    courses: [
      { title: "Digital Citizenship K–2" },
      { title: "Digital Literacy 3–5" },
      { title: "Computer Literacy 6–8" },
      { title: "Financial Literacy 3–5" },
      { title: "Financial Literacy 6–8" },
      { title: "Media Literacy 6–8" },
      { title: "Critical Thinking 6–8" },
      { title: "Communication and Life Skills 6–8" },
      { title: "Career Exploration 6–8" },
    ],
  },
  { id: "k8-technology", title: "Technology and practical skills, kindergarten to grade 8", courses: [
    { title: "Keyboarding and Typing 3–5" },
    { title: "Digital Productivity 6–8" },
    { title: "AI Literacy 6–8" },
    { title: "Robotics and Engineering 6–8" },
  ] },
  {
    id: "hs-math",
    title: "High school math",
    courses: [
      { title: "Algebra 1" },
      { title: "Geometry" },
      { title: "Algebra 2" },
      { title: "Trigonometry" },
      { title: "Precalculus" },
      { title: "Calculus" },
      { title: "AP Statistics" },
    ],
  },
  {
    id: "hs-science",
    title: "High school science",
    courses: [{ title: "Biology" }, { title: "Chemistry" }, { title: "Earth and Environmental Science" }, { title: "Physics" }],
  },
  {
    id: "hs-english",
    title: "High school English",
    courses: [
      { title: "English 9", covers: "Composition and grammar, short stories, poetry, drama" },
      { title: "English 10", covers: "World literature, argument and research writing" },
      { title: "English 11", covers: "American literature, rhetoric" },
      { title: "English 12", covers: "British literature, the senior research paper" },
    ],
  },
  {
    id: "hs-social",
    title: "High school social studies",
    courses: [{ title: "World History" }, { title: "US History" }, { title: "US Government and Civics" }, { title: "Economics" }],
  },
  {
    id: "language-french",
    title: "French — CEFR proficiency courses",
    courses: [
      { title: "French A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "French A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "French B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "French B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "French C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "French C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-german",
    title: "German — CEFR proficiency courses",
    courses: [
      { title: "German A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "German A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "German B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "German B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "German C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "German C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-spanish",
    title: "Spanish — CEFR proficiency courses",
    courses: [
      { title: "Spanish A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Spanish A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Spanish B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Spanish B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Spanish C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Spanish C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-portuguese",
    title: "Portuguese — CEFR proficiency courses",
    courses: [
      { title: "Portuguese A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Portuguese A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Portuguese B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Portuguese B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Portuguese C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Portuguese C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-russian",
    title: "Russian — CEFR proficiency courses",
    courses: [
      { title: "Russian A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Russian A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Russian B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Russian B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Russian C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Russian C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-italian",
    title: "Italian — CEFR proficiency courses",
    courses: [
      { title: "Italian A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Italian A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Italian B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Italian B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Italian C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Italian C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-modern-greek",
    title: "Modern Greek — CEFR proficiency courses",
    courses: [
      { title: "Modern Greek A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Modern Greek A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Modern Greek B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Modern Greek B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Modern Greek C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Modern Greek C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-mandarin",
    title: "Mandarin Chinese — HSK 3.0",
    courses: [
      { title: "Mandarin Chinese HSK 1", covers: "Foundational Mandarin vocabulary, pronunciation, characters, listening and everyday exchanges" },
      { title: "Mandarin Chinese HSK 2", covers: "Foundational Mandarin vocabulary, pronunciation, characters, listening and everyday exchanges" },
      { title: "Mandarin Chinese HSK 3", covers: "Foundational Mandarin vocabulary, pronunciation, characters, listening and everyday exchanges" },
      { title: "Mandarin Chinese HSK 4", covers: "Intermediate to advanced reading, grammar, conversation and extended listening" },
      { title: "Mandarin Chinese HSK 5", covers: "Intermediate to advanced reading, grammar, conversation and extended listening" },
      { title: "Mandarin Chinese HSK 6", covers: "Intermediate to advanced reading, grammar, conversation and extended listening" },
      { title: "Mandarin Chinese HSK 7", covers: "Advanced texts, precise language use, academic reading and complex listening" },
      { title: "Mandarin Chinese HSK 8", covers: "Advanced texts, precise language use, academic reading and complex listening" },
      { title: "Mandarin Chinese HSK 9", covers: "Advanced texts, precise language use, academic reading and complex listening" },
    ],
  },
  {
    id: "language-thai",
    title: "Thai — CU-TFL",
    courses: [
      { title: "Thai Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Thai Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Thai Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Thai Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Thai Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-hindi",
    title: "Hindi — ACTFL",
    courses: [
      { title: "Hindi Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Hindi Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Hindi Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Hindi Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Hindi Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-japanese",
    title: "Japanese — JLPT",
    courses: [
      { title: "Japanese N5", covers: "Kana, introductory kanji, basic grammar, everyday reading and listening" },
      { title: "Japanese N4", covers: "Kana, introductory kanji, basic grammar, everyday reading and listening" },
      { title: "Japanese N3", covers: "Intermediate vocabulary and kanji, connected reading and listening" },
      { title: "Japanese N2", covers: "Advanced grammar, kanji, nuanced reading and listening" },
      { title: "Japanese N1", covers: "Advanced grammar, kanji, nuanced reading and listening" },
    ],
  },
  {
    id: "language-arabic",
    title: "Arabic — CEFR-aligned Modern Standard Arabic",
    courses: [
      { title: "Arabic A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Arabic A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Arabic B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Arabic B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Arabic C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Arabic C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-bengali",
    title: "Bengali — ACTFL proficiency",
    courses: [
      { title: "Bengali Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Bengali Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Bengali Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Bengali Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Bengali Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-indonesian",
    title: "Indonesian — UKBI / CEFR crosswalk",
    courses: [
      { title: "Indonesian A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Indonesian A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Indonesian B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Indonesian B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Indonesian C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Indonesian C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-urdu",
    title: "Urdu — ACTFL proficiency",
    courses: [
      { title: "Urdu Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Urdu Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Urdu Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Urdu Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Urdu Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-korean",
    title: "Korean — TOPIK",
    courses: [
      { title: "Korean TOPIK 1", covers: "Hangul, everyday vocabulary, essential grammar, reading and listening" },
      { title: "Korean TOPIK 2", covers: "Hangul, everyday vocabulary, essential grammar, reading and listening" },
      { title: "Korean TOPIK 3", covers: "Everyday and workplace communication, extended reading, grammar and listening" },
      { title: "Korean TOPIK 4", covers: "Everyday and workplace communication, extended reading, grammar and listening" },
      { title: "Korean TOPIK 5", covers: "Advanced Korean comprehension, academic and professional vocabulary, reading and writing" },
      { title: "Korean TOPIK 6", covers: "Advanced Korean comprehension, academic and professional vocabulary, reading and writing" },
    ],
  },
  {
    id: "language-turkish",
    title: "Turkish — TYS / CEFR",
    courses: [
      { title: "Turkish A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Turkish A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Turkish B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Turkish B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Turkish C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Turkish C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-vietnamese",
    title: "Vietnamese — Vietnamese six-level proficiency framework",
    courses: [
      { title: "Vietnamese Level 1", covers: "Pronunciation, foundational vocabulary and everyday communication" },
      { title: "Vietnamese Level 2", covers: "Pronunciation, foundational vocabulary and everyday communication" },
      { title: "Vietnamese Level 3", covers: "Independent listening, reading, speaking and practical writing" },
      { title: "Vietnamese Level 4", covers: "Independent listening, reading, speaking and practical writing" },
      { title: "Vietnamese Level 5", covers: "Advanced reading, complex conversation and formal communication" },
      { title: "Vietnamese Level 6", covers: "Advanced reading, complex conversation and formal communication" },
    ],
  },
  {
    id: "language-punjabi",
    title: "Punjabi — ACTFL proficiency",
    courses: [
      { title: "Punjabi Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Punjabi Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Punjabi Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Punjabi Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Punjabi Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-tamil",
    title: "Tamil — ACTFL proficiency",
    courses: [
      { title: "Tamil Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Tamil Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Tamil Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Tamil Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Tamil Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-persian-farsi",
    title: "Persian (Farsi) — SAMFA / CEFR aligned",
    courses: [
      { title: "Persian (Farsi) A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Persian (Farsi) A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Persian (Farsi) B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Persian (Farsi) B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Persian (Farsi) C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Persian (Farsi) C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-swahili",
    title: "Swahili — CEFR-aligned proficiency",
    courses: [
      { title: "Swahili A1", covers: "Introductions, basic vocabulary, pronunciation and everyday exchanges" },
      { title: "Swahili A2", covers: "Routine conversations, practical reading and simple writing" },
      { title: "Swahili B1", covers: "Independent everyday communication, experiences and connected texts" },
      { title: "Swahili B2", covers: "Extended discussion, argument, complex reading and clear writing" },
      { title: "Swahili C1", covers: "Advanced fluency, academic and professional communication" },
      { title: "Swahili C2", covers: "Near-comprehensive comprehension, nuanced expression and complex texts" },
    ],
  },
  {
    id: "language-filipino-tagalog",
    title: "Filipino (Tagalog) — ACTFL proficiency",
    courses: [
      { title: "Filipino (Tagalog) Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Filipino (Tagalog) Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Filipino (Tagalog) Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Filipino (Tagalog) Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Filipino (Tagalog) Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-telugu",
    title: "Telugu — ACTFL proficiency",
    courses: [
      { title: "Telugu Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Telugu Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Telugu Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Telugu Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Telugu Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "language-marathi",
    title: "Marathi — ACTFL proficiency",
    courses: [
      { title: "Marathi Novice", covers: "Writing system, basic vocabulary and memorized everyday exchanges" },
      { title: "Marathi Intermediate", covers: "Everyday conversations, personal topics and connected messages" },
      { title: "Marathi Advanced", covers: "Narration, description and extended real-world communication" },
      { title: "Marathi Superior", covers: "Abstract discussion, argument and professional communication" },
      { title: "Marathi Distinguished", covers: "Nuanced discourse, culturally appropriate expression and complex texts" },
    ],
  },
  {
    id: "hs-careers",
    title: "High school career and advanced electives",
    courses: [
      { title: "Digital Citizenship and AI Literacy" },
      { title: "Media Literacy and Critical Thinking" },
      { title: "Life Skills and Independent Living" },
      { title: "Communication and Public Speaking" },
      { title: "Career Readiness" },
      { title: "Entrepreneurship" },
      { title: "Vocational Foundations" },
      { title: "Engineering Design" },
      { title: "Psychology" },
      { title: "Philosophy" },
      { title: "College and Career Preparation" },
    ],
  },
  {
    id: "hs-programming",
    title: "Programming and web development — high school and adult learners",
    courses: [
      { title: "C Fundamentals", covers: "Variables, control flow, functions, compilation, arrays and pointers" },
      { title: "C Intermediate", covers: "Memory management, structures, file I/O, debugging and modular programs" },
      { title: "C Advanced", covers: "Data structures, systems programming, performance and portable projects" },
      { title: "C++ Fundamentals", covers: "Modern C++ syntax, types, functions, classes and standard containers" },
      { title: "C++ Intermediate", covers: "Object-oriented design, RAII, templates, algorithms and smart pointers" },
      { title: "C++ Advanced", covers: "Concurrency, generic programming, performance and larger software architecture" },
      { title: "Python Fundamentals", covers: "Syntax, variables, loops, functions, collections and small scripts" },
      { title: "Python Intermediate", covers: "Modules, files, exceptions, classes, testing and automation" },
      { title: "Python Advanced", covers: "Typing, asynchronous programming, APIs, packaging and production projects" },
      { title: "JavaScript Fundamentals", covers: "Variables, functions, arrays, objects and browser scripting" },
      { title: "JavaScript Intermediate", covers: "DOM, events, modules, fetch, asynchronous code and debugging" },
      { title: "JavaScript Advanced", covers: "Application architecture, testing, security, performance and full-stack projects" },
      { title: "HTML/CSS Fundamentals", covers: "Semantic HTML, selectors, typography, colors and accessible page structure" },
      { title: "HTML/CSS Intermediate", covers: "Responsive design, Flexbox, Grid, forms and reusable components" },
      { title: "HTML/CSS Advanced", covers: "Accessibility, design systems, animations, performance and production websites" },
    ],
  },
  {
    id: "hs-other",
    title: "High school health, PE, arts and electives",
    courses: [
      { title: "Health", covers: "Including first aid and CPR knowledge" },
      { title: "Physical Education", covers: "Activity log and fitness planning" },
      { title: "Art" },
      { title: "Music" },
      { title: "Personal Finance" },
      { title: "Computer Science" },
    ],
  },
  { id: "professional-real-estate", title: "Professional education — state-configurable real estate licensing", courses: [
    { title: "Real Estate law and practice — jurisdiction-specific hours" },
    { title: "State contracts and regulations — jurisdiction-specific hours" },
    { title: "Real estate closings — jurisdiction-specific hours" },
    { title: "Real estate trust accounts — jurisdiction-specific hours" },
    { title: "Current legal issues — jurisdiction-specific hours" },
    { title: "Real estate practical applications — jurisdiction-specific hours" },
  ] },
];

/** Already in the catalog and kept as advanced electives; not needed for 1.0. */
export const ELECTIVES = ["Multivariable Calculus", "Linear Algebra", "Differential Equations", "Probability and Statistics", "University Physics I", "University Physics II"];

/** Outstanding engine tasks consolidated into the original lesson-engine roadmap. */
/** Status reflects the full deliverable, not merely the existence of foundation code.
 * Done subfeatures live in ENGINE; broad items stay in progress until fully integrated.
 */
export const ENGINE_IN_PROGRESS = new Set<string>([
  "Shared canonical course and content model",
  "Jurisdiction-configurable instructional-hour and assessment evidence tracking",
  "General spreadsheet simulator: formulas, references, templates and macros",
  "Cross-course competency graph",
  "Expand competency pathways and assessment coverage across courses",
  "Learning diagnostics and targeted intervention",
  "Production course publishing deployment repair",
  "Course creator parity regression suite",
  "Community and official course content round-trip fidelity",
  "Community course audio, reading and assignment parity",
]);

export const ENGINE_PLANNED = [
  "Shared canonical course and content model",
  "Production course publishing deployment repair",
  "Cross-course competency graph",
  "Expand competency pathways and assessment coverage across courses",
  "Learning game mechanics and live quiz modes",
  "Teacher-paced and student-paced interactive presentations",
  "Lesson-to-game and lesson-to-assessment conversion",
  "Teacher-generated materials with review and approval",
  "Interactive lesson, worksheet and assessment generation",
  "Learning diagnostics and targeted intervention",
  "Learning content interoperability (CASE, QTI, LTI and Common Cartridge)",
  "Interactive document and case file engine",
  "Jurisdiction-configurable contracts and counteroffers simulator",
  "Jurisdiction-configurable trust account reconciliation simulator",
  "Spreadsheet simulator templates: six-column closing, proration and settlement sheets",
  "Jurisdiction-configurable real estate transaction case simulator",
  "Jurisdiction-configurable instructional-hour and assessment evidence tracking",
  "General spreadsheet simulator: formulas, references, templates and macros",
  "Branching scenario and timeline engine",
  "Scientific and engineering workspaces",
  "Advanced assessment and feedback",
  "Content review, versioning and auditability",
  "Credential integrity and compliance evidence",
  "Course creator parity regression suite",
  "Community and official course content round-trip fidelity",
  "Community course audio, reading and assignment parity",
  "Independent course review, accessibility and learner pilot verification",
  "Privacy-preserving learner data architecture",
] as const;

export type EngineStatus = "done" | "planned";

/** Lesson-engine work the new courses need, so every subject gets good lessons. */
export const ENGINE: { title: string; detail: string; status: EngineStatus }[] = [
  { title: "Reusable spreadsheet calculation foundation", detail: "Generic workbook, sheet references, arithmetic formula evaluation and circular-reference protection (PR #38). Interactive editing and templates remain in progress.", status: "done" },
  { title: "Jurisdiction-neutral requirements pack foundation", detail: "Versioned rules, validation of program hours and source metadata, explicit jurisdiction selection and fail-closed lookups (PR #37). Full course integration remains in progress.", status: "done" },
  { title: "Automatic competency intervention next-step recommendations", detail: "Use saved baselines and current mastery to select review, reassessment, continued practice, or advancement (PR #36).", status: "done" },
  { title: "Repeatable competency reassessment and outcome regression coverage", detail: "Students can repeat focused assessments after an intervention, with tests for mastery comparisons, missing baselines and newest-session selection (PR #35).", status: "done" },
  { title: "Post-intervention mastery reassessment", detail: "Compare saved pre-practice competency mastery with current mastery, recommend next steps, and show mastered skills ready to advance (PR #34).", status: "done" },
  { title: "Traceable competency focused-practice sessions", detail: "Targeted sessions retain skill ID and starting mastery estimate in saved attempts, with linked session results shown in Progress (PR #33).", status: "done" },
  { title: "Competency assessment improvement trends", detail: "Student Learning Path compares earlier and later recorded topic assessment performance without claiming causal impact (PR #32).", status: "done" },
  { title: "Focused competency practice from Learning Path", detail: "Starts actual question-bank practice limited to assessment-linked competency topics from the student Progress page (PR #31).", status: "done" },
  { title: "Student learning path and recommended-course navigation", detail: "Progress page with prerequisite explanations and course navigation, merged PRs #15 and #21; initial learning pathway implementation.", status: "done" },
  { title: "Cross-course competency graph foundation and student Learning Path", detail: "Skill prerequisites, course-linked evidence, mastery and placement recommendations with the Progress page. Merged PR #15; broader course coverage remains in progress.", status: "done" },
  { title: "Course integrity validation and portable snapshots", detail: "Non-destructive checks for content IDs and references, canonical version 1 import and deterministic exports; merged in PR #11 and merge-only integrity CI passed.", status: "done" },
  { title: "Course revision compatibility and publishing preflight", detail: "Stable identifiers and revision comparison, authenticated baseline verification and rejection of unsafe updates; merged in PR #11 with integrity CI passed. Production deployment remains blocked by a historical course hash mismatch.", status: "done" },
  { title: "Read-aloud lessons and questions", detail: "Every lesson, question and answer choice can be read aloud, with the part being read highlighted, so children who can't read yet can learn on their own (kindergarten to grade 2). Early-reader courses read each new question by themselves and can use recorded audio.", status: "done" },
  { title: "Phonics and handwriting practice", detail: "Letter sounds with audio, blending practice and letter tracing (finger, pen or mouse) for early readers.", status: "done" },
  { title: "Writing assignments with rubrics", detail: "Essays and short responses written in the app, graded by the parent or teacher with a rubric, and kept in the portfolio (English and social studies).", status: "done" },
  { title: "Built-in reader for books and documents", detail: "Public-domain novels, poems, plays and primary sources read inside the app: chapters, line-numbered poems and plays, footnotes and word pop-ups, read-aloud, reading questions, your place remembered, and reading time recorded in the reading log.", status: "done" },
  { title: "Maps and timelines", detail: "Interactive world and US maps (or a course's own) with shaded regions, places, routes and zoom; zoomable timelines from prehistory to today; questions where you find or label places on a map and place events on a timeline.", status: "done" },
  { title: "Science labs and simulations", detail: "Guided at-home labs with safety notes and photo uploads to the portfolio, plus simple simulations where a lab isn't practical.", status: "done" },
  { title: "Listening and speaking practice", detail: "Audio for vocabulary and dialogues (recordings or the device's voice), dialogues played line by line with translations, listening and dictation questions, and speaking practice: record yourself and compare with the model. Recordings stay on your device.", status: "done" },
  { title: "Code exercises", detail: "Write and run Python or JavaScript in the app, with runnable examples in lessons and exercises checked by automatic tests, for Computer Science.", status: "done" },
  { title: "Activity logs for PE, art and music", detail: "Log practice and activities, upload work, and count hours toward state requirements.", status: "done" },
  { title: "Adaptive practice", detail: "Smart practice gives more questions on your weak topics and fewer on the ones you've mastered, adjusting as you answer; notecards, drills and the daily plan lean the same way, and every exam ends with what to study next.", status: "done" },
  { title: "Memory aids from learning science", detail: "Practice questions come back on a spaced schedule until you've got them right on three different days; optional Sure/Unsure/Guess ratings; warm-up questions before a lesson; explain-it-yourself and recall-first habits; mixed topics; a weekly review quiz; FSRS notecard scheduling; and fading worked examples in lessons.", status: "done" },
  { title: "Math manipulatives", detail: "Counters in ten-frames, base-ten blocks, number lines, fraction bars, a clock and coins to play with in lessons, and practice questions answered by using them. Every model works with buttons or the keyboard and tells screen readers what it shows.", status: "done" },
  { title: "Question types, pictures, diagrams and graphs", detail: "Fill in the blank, matching, ordering, labeling pictures, drawn diagrams and auto-labeled graphs.", status: "done" },
  { title: "Homeschool records", detail: "Attendance, hours, grades, report cards, transcripts, portfolios and state reports for all 50 states and DC.", status: "done" },
  { title: "Classrooms and live rooms", detail: "Classes, due dates, a gradebook, hand-in files, and live quizzes on any device.", status: "done" },
];


/** Planned work beyond the existing course catalog, organized by delivery surface.
 * "in_progress" is used only for source changes known to be in a draft PR; not deployed.
 */
export type UpdateStatus = "done" | "in_progress" | "planned";
export type UpdateItem = { title: string; detail: string; status: UpdateStatus; phase: "1.0" | "Later" };
export type UpdateArea = { id: string; title: string; intro: string; items: UpdateItem[] };
const planned = (title: string, detail: string, phase: "1.0" | "Later" = "1.0"): UpdateItem =>
  ({ title, detail, status: "planned", phase });

export const UPDATES: UpdateArea[] = [
  {
    id: "web-app-updates", title: "Website update",
    intro: "Public discovery, community authoring, Teacher Assistant and safe family/credential account access.",
    items: [
      planned("Erudior opening-book splash and official motto", "Opening book with teal star bookmark, official Learn without limits tagline, reduced-motion support and no artificial load delay."),
      planned("Third-party Powered by Erudior splash", "Same book animation with independent developer branding, no implied partnership or endorsement."),
      planned("Erudior Engine attribution and contribution license", "Finalize legally reviewed splash and upstream modification requirements, attribution and no implied endorsement; release rights subject to third-party licenses."),
      { title: "Independent website deployment and public roadmap publishing", detail: "Cloudflare Pages deploys independently of signed R2 course packages; verified successful workflow jobs.", status: "done", phase: "1.0" },
      planned("Keep all learning publicly accessible", "Public course pages, reading and practice without an account; optional local guest progress and export."),
      { title: "Fix community module and lesson controls", detail: "Predictable add/delete, explicit lesson-to-module assignment, inline confirmation, save/reopen tests and accessible controls; changes currently on draft PR #1.", status: "in_progress", phase: "1.0" },
      { title: "Community creation guide and authoring tests", detail: "In-editor guide for headings, Markdown tables, images/alt text, diagrams, manipulatives, quizzes and advanced source; test complete create→publish→install workflow. Draft PR #1 not deployed.", status: "in_progress", phase: "1.0" },
      planned("Community editor visual audio, reader and assignment tools", "Replace advanced JSON-only resource inputs with accessible authoring and file support."),
      planned("Community creator eight-course K demo browser test", "Create, save, reopen, publish and install eight K subjects, compare parity with official courses and repair defects."),
      planned("Teacher Content Studio editor and presenter UI", "Website controls for creating and presenting teacher materials, classroom games and lessons.", "Later"),
      planned("Reviewed community-to-official promotion", "Admin-gated review of an immutable published version; embed media, retain provenance, check parity and approval; publish only via authorized official release pipeline."),
      planned("Safe authentication and family accounts", "Parent-created under-13 profiles with verifiable consent, restricted child sessions and device pairing; teen sign-in transition at 13, adult transition at 18, guardian reauthentication."),
      planned("Credential registry and public verification", "Professional-only certificate issuance when authorized; signed PDFs, unguessable IDs, privacy-preserving lookup, revocation, correction and issuer identity."),
    ],
  },
  {
    id: "application-updates", title: "App update",
    intro: "Signed-in student, parent, teacher and professional learner workflows, including desktop and multi-device use.",
    items: [
      planned("Official Erudior application splash and motto", "Opening-book star bookmark with Learn without limits and accessible motion settings."),
      planned("Student dashboard and notebook", "Daily plan, independent notebook, reading shelf, goals, skill map, portfolio, student-directed projects and accessible options."),
      planned("Parent homeschool planning", "Subject-specific placement, grade/course customization, four-year high-school plans, graduation credit audit, transfer credit, materials lists, field trips and portfolio evidence."),
      planned("Parent dashboard PIN protection and child account switching", "Restricted child profiles, parent reauthentication and shared-device role switching."),
      planned("Multiple devices and offline recovery", "Restricted student sign-ins on personal computers, shared-device profile switching, sync, offline drafts, interruption recovery and conflict-safe completion tracking."),
      planned("Age transitions and permissions", "Keep one permanent student academic identity from child to teen to adult; age 13 updates login options without creating a duplicate record; adult control and guardian access reviewed at 18."),
      planned("Credential certificate issuance and revocation", "Signed PDFs, public verification with unguessable IDs and authorization checks."),
      planned("Professional verified enrollment", "Free public lessons remain separate from identity-verified prelicensing/CE tracking, assessments, provider-approved hour equivalency and certificates."),
      planned("Academic records and portability", "Retain existing attendance, report cards, transcripts and portfolios; add configurable graduation policies, exports, audit trails, retention schedules and authorization controls."),
      planned("Classroom and teacher workflows", "Reuse existing classrooms and gradebook for assignments, live games, peer review, conferencing, group projects, communication and field trip logs."),
      planned("Security, privacy and accessibility", "COPPA-consent workflow, teen protections, least-privilege access, privacy-first analytics, encrypted backups, age-appropriate sharing, WCAG 2.2 AA test coverage and restore drills."),
    ],
  },
];
