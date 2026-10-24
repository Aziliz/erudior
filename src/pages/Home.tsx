import type { AppApi } from "../App";
import { CATALOG } from "../lib/catalog";
import { COMMUNITY } from "../lib/community";
import { Mark } from "../components/Mark";

/** The website's front page: what Erudior is, and the way into courses, the community and the app. */
export default function Home({ api }: { api: AppApi }) {
  const n = CATALOG.length;
  const lessons = CATALOG.reduce((s, e) => s + e.lessons + (e.honors ?? 0), 0);
  const questions = CATALOG.reduce((s, e) => s + e.questions, 0);
  const subjects = [...new Set(CATALOG.map((e) => e.subject))];
  const featured = CATALOG.slice(0, 6);
  const inProgress = api.courses.length;

  return (
    <div className="page home">
      <section className="home-hero">
        <div className="home-mark" aria-hidden="true">
          <Mark />
        </div>
        <h1>Learn anything, free.</h1>
        <p className="home-lede">
          Full courses with lessons, practice questions, flashcards and drills, from pre-algebra to college physics, German and professional
          exam prep. No account, no ads, and your progress stays on your device.
        </p>
        <div className="row home-ctas">
          <button className="btn primary" onClick={() => api.go({ name: "library" })}>
            {inProgress ? "Continue learning" : "Browse courses"}
          </button>
          <button className="btn" onClick={() => api.go({ name: "download" })}>
            Get the desktop app
          </button>
          {COMMUNITY && (
            <button className="btn ghost" onClick={() => api.go({ name: "community" })}>
              Community courses
            </button>
          )}
        </div>
        {n > 0 && (
          <p className="small muted home-stats">
            {n} courses · {lessons.toLocaleString()} lessons · {questions.toLocaleString()} practice questions · {subjects.join(", ")}
          </p>
        )}
      </section>

      <section className="home-features" aria-label="What you get">
        <div className="home-feature">
          <h2>Courses that teach</h2>
          <p className="muted">
            Each course is a full sequence of lessons with worked examples and diagrams. School courses add honors lessons for students who want to go further.
          </p>
        </div>
        <div className="home-feature">
          <h2>Practice that sticks</h2>
          <p className="muted">
            Quizzes after each lesson, timed practice exams, spaced-repetition flashcards and drills with fresh numbers every time, plus a study plan that
            counts down to your test date.
          </p>
        </div>
        <div className="home-feature">
          <h2>Built for homeschool</h2>
          <p className="muted">
            The desktop app keeps attendance, grades, report cards, transcripts and portfolios for each child, with your state's rules, all stored on your
            own computer.
          </p>
        </div>
        {COMMUNITY && (
          <div className="home-feature">
            <h2>Made by the community</h2>
            <p className="muted">
              Anyone can write a course and share it. Each published version is marked Reviewed once an Erudior reviewer has checked it.
            </p>
          </div>
        )}
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="home-courses">
          <div className="row" style={{ justifyContent: "space-between", margin: "8px 0 12px" }}>
            <h2 id="home-courses" className="section-title" style={{ margin: 0 }}>
              Courses
            </h2>
            <button className="btn sm" onClick={() => api.go({ name: "library" })}>
              See all {n}
            </button>
          </div>
          <div className="catalog-grid">
            {featured.map((e) => (
              <button key={e.id} className="catalog-card home-course" onClick={() => api.go({ name: "overview", catalogId: e.id })}>
                <div className="catalog-tags">
                  {[e.subject, ...e.level, ...e.type].map((t) => (
                    <span key={t} className="pill neutral">
                      {t}
                    </span>
                  ))}
                </div>
                <h3>{e.title}</h3>
                <p className="muted small clamp3">{e.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
