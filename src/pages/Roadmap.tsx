// erudior.com/roadmap: every course and engine feature Erudior needs before version 1.0.
import { CATALOG } from "../lib/catalog";
import { ELECTIVES, ENGINE, ROADMAP } from "../lib/roadmap";
import { appUrl } from "../lib/site";
import { slugify } from "../lib/util";

const byTitle = new Map(CATALOG.map((e) => [e.title.toLowerCase(), e]));

export default function Roadmap() {
  const rows = ROADMAP.map((g) => ({ ...g, courses: g.courses.map((c) => ({ ...c, entry: byTitle.get((c.catalog ?? c.title).toLowerCase()) })) }));
  const all = rows.flatMap((g) => g.courses);
  const done = all.filter((c) => c.entry).length;
  const engineDone = ENGINE.filter((e) => e.status === "done").length;
  const pct = Math.round((done / all.length) * 100);
  return (
    <div className="page roadmap">
      <h1>Road to version 1.0</h1>
      <p className="home-lede">
        Erudior stays below version 1.0 until a family can use it as its whole homeschool program, from kindergarten through high school, and a teacher
        can use it for a full course load. This is everything that has to be finished first.
      </p>

      <section className="panel roadmap-summary" aria-label="Progress">
        <div className="roadmap-stat">
          <b>
            {done} of {all.length}
          </b>
          <span className="small muted">courses available</span>
        </div>
        <div className="roadmap-stat">
          <b>
            {engineDone} of {ENGINE.length}
          </b>
          <span className="small muted">lesson-engine features done</span>
        </div>
        <div className="roadmap-bar" role="img" aria-label={`${pct}% of the courses are available`}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </section>

      <nav className="roadmap-toc small" aria-label="On this page">
        {rows.map((g) => (
          <a key={g.id} href={`#${g.id}`}>
            {g.title}
          </a>
        ))}
        <a href="#engine">Lesson engine</a>
      </nav>

      {rows.map((g) => {
        const n = g.courses.filter((c) => c.entry).length;
        return (
          <section key={g.id} id={g.id} className="roadmap-group" aria-labelledby={`h-${g.id}`}>
            <h2 id={`h-${g.id}`}>
              {g.title} <span className="faint small">({n} of {g.courses.length} available)</span>
            </h2>
            {g.note && <p className="muted small">{g.note}</p>}
            <ul className="roadmap-list">
              {g.courses.map((c) => (
                <li key={c.title} className={c.entry ? "is-done" : ""}>
                  <span className={`pill ${c.entry ? "pass" : ""}`}>{c.entry ? "Available" : "Planned"}</span>
                  <span className="roadmap-name">
                    {c.entry ? <a href={appUrl("/" + slugify(c.entry.title))}>{c.title}</a> : c.title}
                    {c.catalog && c.entry && <span className="faint small"> ({c.entry.title})</span>}
                    {c.covers && <span className="faint small"> · {c.covers}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section id="engine" className="roadmap-group" aria-labelledby="h-engine">
        <h2 id="h-engine">Lesson engine</h2>
        <p className="muted small">New subjects need new kinds of lessons. These features have to work before their courses can be good.</p>
        <ul className="roadmap-list">
          {[...ENGINE].sort((a, b) => (a.status === b.status ? 0 : a.status === "done" ? 1 : -1)).map((e) => (
            <li key={e.title} className={e.status === "done" ? "is-done" : ""}>
              <span className={`pill ${e.status === "done" ? "pass" : ""}`}>{e.status === "done" ? "Done" : "Planned"}</span>
              <span className="roadmap-name">
                <b>{e.title}.</b> <span className="muted">{e.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="roadmap-group" aria-labelledby="h-electives">
        <h2 id="h-electives">Also available</h2>
        <p className="muted small">College-level courses already in the catalog, kept as advanced electives (not needed for 1.0):</p>
        <p>
          {ELECTIVES.map((t, i) => {
            const e = byTitle.get(t.toLowerCase());
            return (
              <span key={t}>
                {i > 0 && ", "}
                {e ? <a href={appUrl("/" + slugify(e.title))}>{t}</a> : t}
              </span>
            );
          })}
          .
        </p>
      </section>

      <p className="small muted">
        Every course is written and then checked by an independent review of each lesson, question and practice problem before it's released. Order of
        work: high school courses first (students need transcript credits soonest), then kindergarten to grade 5 with art, music, health and PE, then
        grades 6 to 8, Spanish and electives.
      </p>
    </div>
  );
}
