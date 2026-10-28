// Public roadmap: one course section and one task list per product area.
import { CATALOG } from "../lib/catalog";
import { ELECTIVES, ENGINE, ROADMAP, UPDATES } from "../lib/roadmap";
import { appUrl } from "../lib/site";
import { slugify } from "../lib/util";

const byTitle = new Map(CATALOG.map((entry) => [entry.title.toLowerCase(), entry]));
const areas = UPDATES.filter((area) => area.id !== "course-updates" && area.id !== "engine-updates");
const engineTasks = UPDATES.find((area) => area.id === "engine-updates")?.items ?? [];

export default function Roadmap() {
  const groups = ROADMAP.map((group) => ({
    ...group,
    courses: group.courses.map((course) => ({
      ...course,
      entry: byTitle.get((course.catalog ?? course.title).toLowerCase()),
    })),
  }));
  const courses = groups.flatMap((group) => group.courses);
  const available = courses.filter((course) => course.entry).length;
  const doneEngine = ENGINE.filter((feature) => feature.status === "done").length;
  const percent = Math.round((available / courses.length) * 100);

  return (
    <div className="page roadmap">
      <h1>Road to version 1.0</h1>

      <section className="panel roadmap-summary" aria-label="Progress">
        <div className="roadmap-stat"><b>{available} of {courses.length}</b><span className="small muted">courses available</span></div>
        <div className="roadmap-stat"><b>{doneEngine} of {ENGINE.length}</b><span className="small muted">existing engine features done</span></div>
        <div className="roadmap-bar" role="img" aria-label={`${percent}% of the courses are available`}>
          <span style={{ width: `${percent}%` }} />
        </div>
      </section>

      <nav className="roadmap-toc small" aria-label="On this page">
        <a href="#course-update">Course update</a>
        {areas.map((area) => <a key={area.id} href={`#${area.id}`}>{area.title}</a>)}
        <a href="#engine-update">Engine update</a>
      </nav>

      <section id="course-update" className="roadmap-group" aria-labelledby="h-course-update">
        <h2 id="h-course-update">Course update <span className="faint small">({available} of {courses.length} available)</span></h2>
        {groups.map((group) => (
          <div key={group.id} id={group.id}>
            <h3>{group.title}</h3>
            <ul className="roadmap-list">
              {group.courses.map((course) => (
                <li key={course.title} className={course.entry ? "is-done" : ""}>
                  <span className={`pill ${course.entry ? "pass" : ""}`}>{course.entry ? "Available" : "Planned"}</span>
                  <span className="roadmap-name">
                    {course.entry ? <a href={appUrl("/" + slugify(course.entry.title))}>{course.title}</a> : course.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h3>Advanced electives already available</h3>
        <ul className="roadmap-list">
          {ELECTIVES.map((title) => {
            const entry = byTitle.get(title.toLowerCase());
            return <li key={title} className={entry ? "is-done" : ""}>
              <span className={`pill ${entry ? "pass" : ""}`}>{entry ? "Available" : "Planned"}</span>
              <span className="roadmap-name">{entry ? <a href={appUrl("/" + slugify(entry.title))}>{title}</a> : title}</span>
            </li>;
          })}
        </ul>
      </section>

      {areas.map((area) => (
        <section key={area.id} id={area.id} className="roadmap-group" aria-labelledby={`h-${area.id}`}>
          <h2 id={`h-${area.id}`}>{area.title}</h2>
          <ul className="roadmap-list">
            {area.items.map((item) => (
              <li key={item.title} className={item.status === "done" ? "is-done" : ""}>
                <span className={`pill ${item.status === "done" ? "pass" : ""}`}>
                  {item.status === "done" ? "Done" : item.status === "in_progress" ? "In progress" : "Planned"}
                </span>
                <span className="roadmap-name">{item.title}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section id="engine-update" className="roadmap-group" aria-labelledby="h-engine-update">
        <h2 id="h-engine-update">Engine update</h2>
        <ul className="roadmap-list">
          {engineTasks.map((task) => (
            <li key={task.title}>
              <span className={`pill ${task.status === "done" ? "pass" : ""}`}>{task.status === "in_progress" ? "In progress" : task.status === "done" ? "Done" : "Planned"}</span>
              <span className="roadmap-name">{task.title}</span>
            </li>
          ))}
          {ENGINE.map((feature) => (
            <li key={feature.title} className={feature.status === "done" ? "is-done" : ""}>
              <span className={`pill ${feature.status === "done" ? "pass" : ""}`}>{feature.status === "done" ? "Done" : "Planned"}</span>
              <span className="roadmap-name">{feature.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
