import type { AppApi } from "../App";
import { adultLabel, classesOf, gradeLabel, isClassroom, type Family, type Student } from "../lib/family";

/** The adult authorizes a memory-only learner session; cards never grant access. */
export default function WhoPage({ api, family }: { api: AppApi; family: Family }) {
  const card = (s: Student) => (
    <li key={s.id}>
      <button className="who-card" aria-current={api.student?.id === s.id ? "true" : undefined} onClick={() => void api.chooseStudent(s.id).catch(e=>api.toast((e as Error).message))}>
        <span className="who-initial" aria-hidden="true">
          {s.name.slice(0, 1).toUpperCase()}
        </span>
        <b>{s.name}</b>
        {!isClassroom(family) && <span className="small muted">{gradeLabel(s.grade)}</span>}
      </button>
    </li>
  );
  const classes = family.classes ?? [];
  const unplaced = family.students.filter((s) => classesOf(family, s.id).length === 0);
  return (
    <div className="page">
      <h1>Who's learning?</h1>
      <p className="muted">Choose a learner, then ask the {adultLabel(family).toLowerCase()} to authorize this session with their password or PIN. Reloading or locking this shared device requires authorization again.</p>
      {isClassroom(family) ? (
        <>
          {classes.map((c) => (
            <section key={c.id}>
              <h2 className="section-title">{c.name}</h2>
              <ul className="who-grid">
                {family.students
                  .filter((s) => c.students.includes(s.id))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(card)}
              </ul>
            </section>
          ))}
          {unplaced.length > 0 && (
            <section>
              <h2 className="section-title">Not in a class</h2>
              <ul className="who-grid">{unplaced.map(card)}</ul>
            </section>
          )}
        </>
      ) : (
        <ul className="who-grid">{family.students.map(card)}</ul>
      )}
      <button className="btn" onClick={() => api.go({ name: "parent" })}>
        {adultLabel(family)} area
      </button>
    </div>
  );
}
