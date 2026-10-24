import { CATALOG } from "../lib/catalog";
import { appUrl } from "../lib/site";

interface Feature {
  id: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  shot: string;
  alt: string;
  /** A second, smaller picture (e.g. the phone side of a live room). */
  extra?: { shot: string; alt: string };
}

const FEATURES: Feature[] = [
  {
    id: "parents",
    kicker: "For parents",
    title: "Homeschool records that keep themselves",
    body: "Set up your family once: your state, the school year and each child's grade. Erudior counts study time as your children work, proposes school days for you to confirm, and turns it all into the records your state asks for.",
    points: [
      "Attendance and hours against your state's minimum, with reminders for notices and testing",
      "Grades and GPA from quizzes and tests, plus work you grade yourself",
      "Report cards, high school transcripts, progress reports and portfolios to print or save as PDF",
      "A password (or PIN) keeps the parent area to yourself",
    ],
    shot: "/shots/parent-overview.png",
    alt: "The parent area overview: each student's school days and hours against the state minimum, hours by subject, and upcoming reminders.",
  },
  {
    id: "kids",
    kicker: "For kids",
    title: "Each child picks their name and gets to work",
    body: "Children see the courses you assigned them, in order, and pick up exactly where they left off. Lessons explain with worked examples and diagrams; quizzes check understanding before moving on.",
    points: [
      "Assigned courses by subject; the next one unlocks when the current one is done",
      "Lesson quizzes, practice exams, flashcards that space out reviews, and math drills with fresh numbers",
      "A calculator beside every quiz and lesson: graphing for math and science",
      "Honors lessons for students who want to go further",
    ],
    shot: "/shots/kid-library.png",
    alt: "A student's library: assigned courses in progress, with lessons finished and what's next.",
  },
  {
    id: "live",
    kicker: "Live rooms",
    title: "Game-show quizzes for the whole family or class",
    body: "Host a live quiz from the parent or teacher area. Everyone joins on a phone, tablet or laptop at app.erudior.com with a six-character code, no account needed. Run it at your own pace or against the clock, with points for speed.",
    points: ["Questions from any course, lesson quiz or module test", "Answer counts after each question; scores only on the host's screen", "Players only ever see their own results"],
    shot: "/shots/live-host.png",
    alt: "The host's screen in a live room: the join code, the players, and the current question with answer counts.",
    extra: { shot: "/shots/live-player.png", alt: "A student's phone answering a live room question." },
  },
  {
    id: "classroom",
    kicker: "For teachers",
    title: "Classroom mode",
    body: "Teachers set up classes, assign courses with due dates and follow progress in a gradebook. Students work on the teacher's computer or their own: they open the class file, study, and hand in their work as a file the teacher imports.",
    points: ["Class rosters, assignments and due dates", "A gradebook you can export as a spreadsheet", "Hand-in files are checked, so mix-ups and casual edits are caught"],
    shot: "/shots/gradebook.png",
    alt: "The teacher's gradebook: students by assigned course, with grades, lessons finished and work past due.",
  },
  {
    id: "lessons",
    kicker: "Courses",
    title: "Real courses, not just question banks",
    body: "Pick any course from the catalog and the app downloads it; after that it works offline. Math, science, German and professional exam prep today, with more on the way, plus courses written by the community for free learning.",
    points: ["Every lesson ends with its key points and the common mistakes", "Formulas in their own panels, with diagrams and pictures", "New versions of a course are offered automatically, and your progress is kept"],
    shot: "/shots/lesson.png",
    alt: "A math lesson with a worked example, a formula panel and the graphing calculator open on the left.",
  },
];

/** erudior.com: what Erudior is, what the desktop app does, and where to get it. */
export default function Home() {
  const n = CATALOG.length;
  const subjects = [...new Set(CATALOG.map((e) => e.subject))];
  return (
    <div className="page home">
      <section className="home-hero">
        <h1>Free courses and homeschool records, on your own computer.</h1>
        <p className="home-lede">
          Erudior is a free learning app for families and classrooms: full courses with lessons, quizzes, flashcards and drills, plus the attendance,
          grades and transcripts homeschoolers need. Your children's records never leave your computer.
        </p>
        <div className="row home-ctas">
          <a className="btn primary" href="/download">
            Download the app
          </a>
          <a className="btn" href={appUrl("/courses")}>
            Study in your browser
          </a>
        </div>
        <p className="notice dev-notice small" role="note">
          <b>Early version:</b> Erudior is still being built and tested. Don't use it to replace homeschool or regular school yet; it's fine as extra
          practice.
        </p>
        <p className="small muted home-stats">
          Free for Windows, macOS and Linux · No accounts, no ads{n ? ` · ${n} courses in ${subjects.join(", ")}` : ""}
        </p>
      </section>

      {FEATURES.map((f, i) => (
        <section key={f.id} id={f.id} className={`home-feature-row${i % 2 ? " flip" : ""}`} aria-labelledby={`h-${f.id}`}>
          <div className="home-feature-text">
            <p className="home-kicker">{f.kicker}</p>
            <h2 id={`h-${f.id}`}>{f.title}</h2>
            <p>{f.body}</p>
            <ul>
              {f.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className={`home-shot${f.extra ? " with-phone" : ""}`}>
            <img src={f.shot} alt={f.alt} loading="lazy" width={1280} height={800} />
            {f.extra && <img className="home-shot-phone" src={f.extra.shot} alt={f.extra.alt} loading="lazy" width={390} height={760} />}
          </div>
        </section>
      ))}

      <section className="home-privacy">
        <h2>Your family's data stays home</h2>
        <p>
          Progress, grades, attendance and documents are saved on your computer, and the backup file is encrypted with a passphrase only you know.
          Students don't need accounts, and there's no tracking and no ads. The app goes online only to download courses and updates, for community
          courses, and for live rooms.
        </p>
      </section>

      <section className="home-final">
        <h2>Ready when you are</h2>
        <div className="row home-ctas">
          <a className="btn primary" href="/download">
            Download Erudior
          </a>
          <a className="btn" href={appUrl("/courses")}>
            Try it in your browser
          </a>
        </div>
      </section>
    </div>
  );
}
