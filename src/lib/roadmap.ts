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
    id: "hs-languages",
    title: "World languages",
    courses: [{ title: "German A1" }, { title: "German A2" }, { title: "German B1" }, { title: "Spanish 1" }, { title: "Spanish 2" }],
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
];

/** Already in the catalog and kept as advanced electives; not needed for 1.0. */
export const ELECTIVES = ["Multivariable Calculus", "Linear Algebra", "Differential Equations", "Probability and Statistics", "University Physics I", "University Physics II"];

/** Outstanding engine tasks consolidated into the original lesson-engine roadmap. */
export const ENGINE_PLANNED = [
  "Shared canonical course and content model",
  "Cross-course competency graph",
  "Learning game mechanics and live quiz modes",
  "Interactive lesson, worksheet and assessment generation",
  "Learning diagnostics and targeted intervention",
  "Learning content interoperability (CASE, QTI, LTI and Common Cartridge)",
  "Interactive document and case file engine",
  "Workbook and financial calculation engine",
  "Branching scenario and timeline engine",
  "Scientific and engineering workspaces",
  "Advanced assessment and feedback",
  "Content review, versioning and auditability",
  "Credential integrity and compliance evidence",
  "Course creator parity regression suite",
  "Privacy-preserving learner data architecture",
] as const;

export type EngineStatus = "done" | "planned";

/** Lesson-engine work the new courses need, so every subject gets good lessons. */
export const ENGINE: { title: string; detail: string; status: EngineStatus }[] = [
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
      planned("Keep all learning publicly accessible", "Public course pages, reading and practice without an account; optional local guest progress and export."),
      { title: "Fix community module and lesson controls", detail: "Predictable add/delete, explicit lesson-to-module assignment, inline confirmation, save/reopen tests and accessible controls; changes currently on draft PR #1.", status: "in_progress", phase: "1.0" },
      { title: "Community creation guide and authoring tests", detail: "In-editor guide for headings, Markdown tables, images/alt text, diagrams, manipulatives, quizzes and advanced source; test complete create→publish→install workflow. Draft PR #1 not deployed.", status: "in_progress", phase: "1.0" },
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
      planned("Student dashboard and notebook", "Daily plan, independent notebook, reading shelf, goals, skill map, portfolio, student-directed projects and accessible options."),
      planned("Parent homeschool planning", "Subject-specific placement, grade/course customization, four-year high-school plans, graduation credit audit, transfer credit, materials lists, field trips and portfolio evidence."),
      planned("Multiple devices and offline recovery", "Restricted student sign-ins on personal computers, shared-device profile switching, sync, offline drafts, interruption recovery and conflict-safe completion tracking."),
      planned("Age transitions and permissions", "Keep one permanent student academic identity from child to teen to adult; age 13 updates login options without creating a duplicate record; adult control and guardian access reviewed at 18."),
      planned("Professional verified enrollment", "Free public lessons remain separate from identity-verified prelicensing/CE tracking, assessments, provider-approved hour equivalency and certificates."),
      planned("Academic records and portability", "Retain existing attendance, report cards, transcripts and portfolios; add configurable graduation policies, exports, audit trails, retention schedules and authorization controls."),
      planned("Classroom and teacher workflows", "Reuse existing classrooms and gradebook for assignments, live games, peer review, conferencing, group projects, communication and field trip logs."),
      planned("Security, privacy and accessibility", "COPPA-consent workflow, teen protections, least-privilege access, privacy-first analytics, encrypted backups, age-appropriate sharing, WCAG 2.2 AA test coverage and restore drills."),
    ],
  },
];
