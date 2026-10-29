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
export const ENGINE_IN_PROGRESS = new Set<string>([]);

/** Deployed slices and remaining work; each capability still has one roadmap row. */
export const ENGINE_PROGRESS_DETAILS: Record<string, string> = {
  "Independent course review, accessibility and learner pilot verification": "Deferred real-world review and learner-pilot obligation, not completed by synthetic engine tests. Remains Planned without Done credit; course adoption follows completion of the requested engine work.",
  "Content review, versioning and auditability": "Skipped at the user’s request on 2026-10-29: the user reports prior content review. No new review-system implementation or Done credit is claimed. Course adoption of new engine features waits until the remaining engine work is complete.",
};

export const ENGINE_PLANNED = [
  "Content review, versioning and auditability",
  "Independent course review, accessibility and learner pilot verification",
] as const;

export type EngineStatus = "done" | "planned";

/** Lesson-engine work the new courses need, so every subject gets good lessons. */
export const ENGINE: { title: string; detail: string; status: EngineStatus }[] = [
  { title: "Privacy-preserving learner data architecture", detail: "Local anonymous practice with explicit inventory, scoped in-app deletion, encrypted full-local recovery and durable stale-writer fences; separately opt-in encrypted server checkpoints use a strict minimized non-scoring allowlist, explicit conflict/recovery review, terminal remote erasure and bounded retention. Existing credential registry remains isolated. Browser IndexedDB replacement is atomic; native process-locked recovery has disclosed multi-file power-loss limits and conservative shared-file retention. Production server identity, consent authority, separate storage/trust, retention scheduling and recovery reconciliation require separately authorized setup and remain disabled. Independent scope/security review, actual App authority, cross-tab storage, isolated D1/TLS, all 44 native-reviewed Chromium mobile/desktop light/dark keyboard/WCAG states, full regression, native and all three Android gates passed in PR #95; all seven postmerge lanes and authoritative signed-catalog/live disabled-API readback passed. No real learner data, credential provisioning, automatic scoring/credit, course-content changes or installer release.", status: "done" },
  { title: "Credential integrity and compliance evidence", detail: "Reusable disabled-by-default credential engine with independently signed enrollment and instructor attestations, exact approved program/method/evidence binding, issuer-signed immutable events, deterministic text-only PDF with detached exact-byte Ed25519 proof, privacy-minimal challenge-bound status, terminal revocation and issuer-authenticated historical audit recovery. Local educational evidence export rechecks authority and never grants qualifying credit. Separate registry/trust configuration is absent in production; real institutional approval, identity verification, secure issuer provisioning and monotonic recovery reconciliation require separate authorization. Independent security/original-scope review, real isolated D1 and certificate-verified HTTPS, all 24 native-reviewed Chromium mobile/desktop light/dark keyboard/WCAG states, full regression and all three Android gates passed in PR #94; all six applicable postmerge lanes and authoritative signed-catalog/live disabled-API readback passed. Native state unchanged. No real qualification issued, keys or trust provisioned, PAdES/accreditation claim, new course content or installer release.", status: "done" },
  { title: "Advanced assessment and feedback", detail: "Reusable multi-step math answers and reasoning, local oral audio with transcript-only accommodation, versioned rubric histories, pinned explicit question variants, assistance declarations and exact assessment lineage. Structured canonical/community authoring and reviewed publication/install preserve source snapshots; append-only responses, frozen V1 educational matching and separate human rubric revisions support cautious misconception reports, evidence comparison and portable exports. Fresh authority, review CAS, privacy deletion and encrypted recovery quarantine of both sources and imported judgments are verified. Independent original-scope/security review, all 32 native-reviewed Chromium mobile/desktop light/dark keyboard/WCAG states, full regression, native and all three Android gates passed in PR #93; all seven postmerge lanes and authoritative signed-catalog/live readback passed. No automatic academic grades, proctoring, qualification or credential grants, new course content or changed historical grading; installers remain deferred. PR #96 adds deployed lesson-linked discovery, exact-source assignment launch and return-to-lesson navigation, readable inspection and explicit adult handoff where required. Synthetic verification does not claim adoption into actual course artifacts; reviewed prose, questions and historical results remain unchanged.", status: "done" },
  { title: "Scientific and engineering workspaces", detail: "Reusable guided investigations with hypotheses, procedure/safety notes, unit-labelled measurements and explicit absolute uncertainty intervals; accessible graphs and exact data tables, frozen versioned ideal circuit/gas instruments, engineering design iterations, criteria and tradeoffs. Structured canonical/community authoring, reviewed publication/install and exact local assignments preserve source revisions, append-only trials/corrections, immutable evidence and separate human feedback. Fresh authority, CAS/retries, privacy deletion and encrypted recovery quarantine are verified. Independent full-scope/security review, all 28 native-reviewed Chromium mobile/desktop light/dark keyboard/WCAG states, full regression, native and all three Android gates passed in PR #92; all seven postmerge lanes and authoritative signed-catalog/live readback passed. Educational models only: no real equipment control, scientific or safety certification, statistical confidence claim or new course content; installers remain deferred. PR #96 adds deployed lesson-linked discovery, exact-source assignment launch and return-to-lesson navigation, readable inspection and explicit adult handoff where required. Synthetic verification does not claim adoption into actual course artifacts; reviewed prose, questions and historical results remain unchanged.", status: "done" },
  { title: "Branching scenario and timeline engine", detail: "Reusable fictional case files and finite typed decision graphs with state changes, explicit simulated-time deadlines, one-time consequences, project milestones and successful/adverse/incomplete outcomes. Structured canonical/community authoring, exact local source review, assignment snapshots, persistent replayable decisions, immutable evidence, human feedback and revision comparison; guarded retries, live profile authority, CAS, encrypted recovery and restored-source quarantine. Independent original-scope/security review, all 24 real Chromium mobile/desktop light/dark keyboard/WCAG states, full regression, native and all three Android gates passed in PR #91; all seven separate postmerge lanes and authoritative signed-catalog/live readback passed. Educational simulation only, no real-world professional authority, wall-clock compliance, arbitrary code or new course content; installers remain deferred. PR #96 adds deployed lesson-linked discovery, exact-source assignment launch and return-to-lesson navigation, readable inspection and explicit adult handoff where required. Synthetic verification does not claim adoption into actual course artifacts; reviewed prose, questions and historical results remain unchanged.", status: "done" },
  { title: "Spreadsheet simulator", detail: "Versioned reusable worksheets with bounded functions, named ranges, quoted cross-sheet references, dependency recalculation, typed validation and cell explanations; structured canonical/community authoring, exact review/publishing/install and protected learner drafts. Explicit preview/consent for declarative set/copy macro simulations, replayable audit traces, immutable versioned submissions and encrypted recovery preserve original V1 grading. Independent full-scope/security/visual review, exact full regression, all three Android gates and real 320/1280 light/dark keyboard/WCAG workflows passed in PR #90, followed by separate regression/browser/integrity/web/API/signed-course delivery and authoritative readback. No VBA or arbitrary program execution, Excel compatibility promise, regulatory credit or new course content; installers remain deferred. PR #96 adds deployed lesson-linked discovery, source-specific launch/return and readable inspection, protecting pending edits and failed draft saves on navigation. No actual course artifacts or historical results were changed.", status: "done" },
  { title: "Jurisdiction-configurable instructional-hour and assessment evidence tracking", detail: "Versioned jurisdiction and outline requirements mapped to exact installed lesson/assessment snapshots with defensible workload rationale; locally reviewed learner assignments, immutable observed or explicitly attested evidence, full-bank assessment gates and append-only human approval/rejection/revocation. Nonduplicating educational totals, source-history uncertainty, portable audits, fresh authority, stale-review CAS, privacy deletion and encrypted recovery with separate pack/decision quarantine and fresh review receipts. Full original workflow validated in PR #88; PR #89 repaired a pre-existing random drill exhaustion without content edits or weaker checks. Exact regression, native, Android, browser/accessibility, integrity and separate web/API/signed-course delivery/readback passed. No regulatory-credit, enrollment or credential claim; installers and new courses remain deferred.", status: "done" },
  { title: "Jurisdiction-configurable regulated transaction simulations", detail: "Reviewed, versioned educational rule packs and exact document snapshots; contracts and counteroffer lineage, fictional contingencies and deadlines; segregated exact-money client ledgers, reversals and three-way reconciliation; full successful/adverse transaction lifecycle with recoverable drafts, immutable evidence, instructor feedback and revision comparison. Same-device author/learner workflow with portable evidence, live authority, CAS, encrypted recovery and restored approval quarantine. Full regression, native, Android/emulator, browser/accessibility, integrity and separate web/API/signed-course delivery passed in PR #87. Synthetic educational engine only: no current-law claim, real money, filing, official forms, regulatory credit or new course content; installers remain deferred.", status: "done" },
  { title: "Interactive document and case file engine", detail: "Reusable versioned educational source templates with exact adult approval; multi-document cases, typed fillable fields, source-backed overlays and exact quote/region annotations; recoverable learner drafts, immutable evidence submissions, append-only instructor feedback and source/evidence revision comparisons. Explicit same-device workflow with portable source/evidence exports, live profile/authority checks, CAS conflicts, encrypted recovery and restored-approval quarantine. Full regression, native, Android/emulator, browser/accessibility, integrity and separate web/API/signed-course delivery passed in PR #86. Educational simulations only, not official forms or authenticated remote hand-ins; no new course content and desktop installers remain deferred.", status: "done" },
  { title: "Learning content interoperability (CASE, QTI, LTI and Common Cartridge)", detail: "Reviewed CASE 1.1 framework exchange and explicit skill mappings; QTI 3 choice/exact-string item exchange and no-credit preview; real Common Cartridge 1.3 static-resource ZIP exchange; isolated LTI 1.3 resource-link launch with browser binding and atomic replay protection. Supported profiles reject unsupported semantics, preserve external identities and never grant source trust, roles or grades. Full regression, Android/emulator, browser/accessibility, real D1/cross-site HTTPS integration, integrity and separate deployments passed in PR #85. LTI is disabled until separately approved platform registration; no certification or real-LMS compatibility claim. OneRoster and installers remain outside this delivery.", status: "done" },
  { title: "Learning diagnostics and targeted intervention", detail: "Transparent exact-source skill evidence and uncertainty, observed response patterns, adult-selected reteaching groups and differentiated support plans; own-learner activities, sanitized offline handoff, classroom observations, explicit follow-up reviews and private parent summaries. Source/profile/authority races, CAS retries, encrypted recovery and deletion are covered. Full regression, native, Android/emulator, browser/accessibility, integrity and separate web/API/signed-course delivery passed in PR #84. Educational guidance only: no clinical diagnosis, automatic grades or new course content; desktop installers remain deferred.", status: "done" },
  { title: "Teacher-paced and student-paced interactive presentations", detail: "Reusable installed-source decks with authoring, save/reopen, reorder, import/export and encrypted backup; teacher-led and independent student-paced local/remote delivery; opt-in video questions with accessible transcripts and timestamp pauses. Exact source/revision checks, private learner responses, reconnect/close recovery and draft conflicts are covered. Full regression, native, browser/accessibility, live API, integrity and separate web/API/signed-course delivery passed in PR #81. No academic credit or new course content; desktop installers remain deferred.", status: "done" },
  { title: "Learning game mechanics and live quiz modes", detail: "Installed-content review boards, bingo, memory and matching; classroom timer, random picker, balanced teams, local polls, text whiteboard, exit tickets and presenter view; individual, team and cooperative live quizzes with private learner results and authoritative scoring. Full regression, browser/accessibility, live protocol, integrity and separate web/API/signed-course delivery passed in PR #77. Games do not award academic credit. Desktop installers remain deferred.", status: "done" },
  { title: "Cross-course competency graph", detail: "Complete stable skill/prerequisite pathways with exact linked assessment evidence, durable private per-learner history, revision-safe reassessment, retained prerequisites, adult placement/override/revoke history, learner and supervising-adult views, and exact-question adaptive practice. Full regression, native persistence, integrity and separate web/API/course delivery passed in PR #76. Manual placement is not assessed mastery or certification. Installers are deferred to the later consolidated release.", status: "done" },
  { title: "Shared canonical course and content model", detail: "Complete versioned model for reader/audio resources, advanced interactive content and metadata, with lossless authoring, review, publishing/install, learner persistence, revisions and encrypted recovery. Integrated tests and web/API delivery passed through PRs #73–75. Desktop installers are explicitly deferred to a later consolidated release; this does not claim desktop distribution.", status: "done" },
  { title: "Production course publishing deployment repair", detail: "Restored three stale German artifacts to exact signed-catalog bytes with verified backups. All 20 published packages authenticate; normal publication, website deployment and full regression suites passed after PRs #55–58. Bounded transfers retain exact-byte verification and fail-closed authoritative-origin recovery. Release integrity checks remain mandatory.", status: "done" },
  { title: "Course content validation and portable revisions", detail: "Course integrity checks, deterministic snapshots, compatible revisions and signed-release preflight. Live release repair remains tracked separately.", status: "done" },
  { title: "Early literacy and accessible learning", detail: "Read-aloud lessons and questions, phonics, handwriting practice and accessible learning interactions.", status: "done" },
  { title: "Reading, writing and language practice", detail: "Reader for documents, writing assignments and rubrics, and listening/speaking practice.", status: "done" },
  { title: "Interactive mathematics, science and coding", detail: "Math manipulatives, science labs and simulations, executable code exercises, diagrams and supported question formats.", status: "done" },
  { title: "Maps, timelines and visual learning", detail: "Interactive maps, timelines, route and event learning activities.", status: "done" },
  { title: "Practice, review and memory aids", detail: "Adaptive practice, spaced review and evidence-based study supports. The cross-course graph and human-supervised learning diagnostics are completed separately.", status: "done" },
  { title: "Homeschool and activity records", detail: "Attendance, grades, transcripts, portfolios and physical/art/music activity logs.", status: "done" },
  { title: "Classroom teaching and live sessions", detail: "Classroom assignments, due dates, gradebook and live quizzes, with immutable hand-in history, exact-snapshot instructor decisions, interrupted-import recovery and encrypted backup.", status: "done" },
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
    intro: "Public discovery, free guest learning, and admin-only management. No student, family, teacher or professional accounts on the public website.",
    items: [
      { title: "Erudior opening-book splash and official motto", detail: "Opening-book and teal bookmark on first website visit per browser session (not refresh), visible about 1.7 seconds with reduced-motion support.", status: "done", phase: "1.0" },
      { title: "Third-party Powered by Erudior splash", detail: "Reusable independent-product splash with product name, Engine attribution and explicit non-endorsement notice (PR #39).", status: "done", phase: "1.0" },
      { title: "Erudior Engine attribution and contribution license", detail: "License draft updated in PR #3; attribution and upstream modified-source obligations require rights-holder and legal review before adoption.", status: "in_progress", phase: "1.0" },
      { title: "Independent website deployment and public roadmap publishing", detail: "Cloudflare Pages deploys independently of signed R2 course packages; verified successful workflow jobs.", status: "done", phase: "1.0" },
      { title: "Keep all learning publicly accessible", detail: "Public discovery, direct course and lesson reading/practice without accounts; optional saved-device progress/export and isolated temporary sessions. Signed loading, managed assignment/prerequisite and credit authority remain intact. PRs #97–98 verified public workflows and all 27 discovery snapshots.", status: "done", phase: "1.0" },
      { title: "Fix community module and lesson controls", detail: "Stable-ID add/reorder and lesson-to-module assignment, dependency-safe inline delete/cancel, accessible legacy and canonical controls, and verified save/retry/reopen/publish/install workflows. PR #1 merged and deployed with regression, integrity and publishing checks passing.", status: "done", phase: "1.0" },
      { title: "Community creation guide and authoring tests", detail: "In-editor guide for headings, Markdown tables, images/alt text, diagrams, manipulatives, quizzes and advanced source; test complete create→publish→install workflow. Draft PR #1 not deployed.", status: "in_progress", phase: "1.0" },
      planned("Community editor visual audio, reader and assignment tools", "Replace advanced JSON-only resource inputs with accessible authoring and file support."),
      planned("Community creator eight-course K demo browser test", "Create, save, reopen, publish and install eight K subjects, compare parity with official courses and repair defects."),
      planned("Teacher Content Studio editor and presenter UI", "Admin-panel-only website controls for authoring and review; teacher and learner accounts live in the application.", "Later"),
      planned("Reviewed community-to-official promotion", "Admin-panel-gated review of an immutable published version; embed media, retain provenance, check parity and approval; publish only via authorized official release pipeline."),
      planned("Credential registry and public verification", "Professional-only certificate issuance when authorized; signed PDFs, unguessable IDs, privacy-preserving lookup, revocation, correction and issuer identity."),
    ],
  },
  {
    id: "application-updates", title: "App update",
    intro: "Signed-in student, parent, teacher and professional learner workflows, including desktop and multi-device use.",
    items: [
      { title: "Official Erudior application splash and motto", detail: "Accessible official opening-book loading splash shared with the public website (PR #39).", status: "done", phase: "1.0" },
      planned("Safe authentication and family accounts", "App-only student and guardian profiles, consent, device pairing and age transitions; no public website accounts."),
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
