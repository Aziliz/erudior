// erudior.com/roadmap: every course and engine feature Erudior needs before version 1.0.
import { CATALOG } from "../lib/catalog";
import { ELECTIVES, ENGINE, ROADMAP, UPDATES } from "../lib/roadmap";
import { appUrl } from "../lib/site";
import { slugify } from "../lib/util";

const byTitle = new Map(CATALOG.map((e) => [e.title.toLowerCase(), e]));

export default function Roadmap() {
  const rows = ROADMAP.map((g) => ({ ...g, courses: g.courses.map((c) => ({ ...c, entry: byTitle.get((c.catalog ?? c.title).toLowerCase()) })) }));
  const all = rows.flatMap((g) => g.courses);
  const done = all.filter((c) => c.entry).length;
  const extraAreas = UPDATES.filter((area) => area.id === "web-app-updates" || area.id === "application-updates");
  const engineDone = ENGINE.filter((e) => e.status === "done").length;
  const pct = Math.round((done / all.length) * 100);
  return (
    <div className="page roadmap">
      <h1>Road to version 1.0</h1>
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
        {extraAreas.map((area) => <a key={area.id} href={`#${area.id}`}>{area.title}</a>)}
        <a href="#engine">Lesson engine</a>
      </nav>

      {rows.map((g) => {
        const n = g.courses.filter((c) => c.entry).length;
        return (
          <section key={g.id} id={g.id} className="roadmap-group" aria-labelledby={`h-${g.id}`}>
            <h2 id={`h-${g.id}`}>
              {g.title} <span className="faint small">({n} of {g.courses.length} available)</span>
            </h2>
            <ul className="roadmap-list">
              {g.courses.map((c) => (
                <li key={c.title} className={c.entry ? "is-done" : ""}>
                  <span className={`pill ${c.entry ? "pass" : ""}`}>{c.entry ? "Available" : "Planned"}</span>
                  <span className="roadmap-name">
                    {c.entry ? <a href={appUrl("/" + slugify(c.entry.title))}>{c.title}</a> : c.title}
                    {c.catalog && c.entry && <span className="faint small"> ({c.entry.title})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}


      {extraAreas.map((area) => (
        <section key={area.id} id={area.id} className="roadmap-group" aria-labelledby={`h-${area.id}`}>
          <h2 id={`h-${area.id}`}>{area.title}</h2>
          <ul className="roadmap-list">
            {area.items.map((item) => (
              <li key={item.title} className={item.status === "done" ? "is-done" : ""}>
                <span className={`pill ${item.status === "done" ? "pass" : ""}`}>
                  {item.status === "done" ? "Done" : item.status === "in_progress" ? "In progress" : "Planned"}
                </span>
                <span className="roadmap-name">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section id="engine" className="roadmap-group" aria-labelledby="h-engine">
        <h2 id="h-engine">Lesson engine</h2>
        <ul className="roadmap-list">
          {[...ENGINE].sort((a, b) => (a.status === b.status ? 0 : a.status === "done" ? 1 : -1)).map((e) => (
            <li key={e.title} className={e.status === "done" ? "is-done" : ""}>
              <span className={`pill ${e.status === "done" ? "pass" : ""}`}>{e.status === "done" ? "Done" : "Planned"}</span>
              <span className="roadmap-name">
                {e.title}
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


    </div>
  );
}
