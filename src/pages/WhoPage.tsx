import type { AppApi } from "../App";
import { gradeLabel, type Family } from "../lib/family";

/** "Who's learning?" Students go straight in; the parent area asks for the password. */
export default function WhoPage({ api, family }: { api: AppApi; family: Family }) {
  return (
    <div className="page narrow-page">
      <h1>Who's learning?</h1>
      <ul className="who-grid">
        {family.students.map((s) => (
          <li key={s.id}>
            <button className="who-card" aria-current={api.student?.id === s.id ? "true" : undefined} onClick={() => api.chooseStudent(s.id)}>
              <span className="who-initial" aria-hidden="true">
                {s.name.slice(0, 1).toUpperCase()}
              </span>
              <b>{s.name}</b>
              <span className="small muted">{gradeLabel(s.grade)}</span>
            </button>
          </li>
        ))}
      </ul>
      <button className="btn" onClick={() => api.go({ name: "parent" })}>
        Parent area
      </button>
    </div>
  );
}
