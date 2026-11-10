import { useState } from "react";
import StudyProgramCard from "../components/StudyProgramCard";
import { STUDY_PROGRAMS, groupPrograms, searchPrograms } from "../lib/studyPrograms";
import { CATALOG } from "../lib/catalog";
import { appUrl } from "../lib/site";

export default function Programs() {
  const availableIds = new Set(CATALOG.map(course => course.id));
  const [query, setQuery] = useState("");
  const matched = searchPrograms(STUDY_PROGRAMS, query);
  return <div className="page progress-overview">
    <h1>Programs</h1>
    <p>Explore a sequence of courses toward a larger learning goal. Each program includes stages, recommended prerequisites, learning outcomes and portfolio milestones.</p>
    <p>Save a program from Courses in the web app. Following a program saves your plan without enrolling you in every course.</p>
    <div className="catalog-filters"><input className="input" type="search" placeholder="Search programs" aria-label="Search programs" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
    {query.trim() && <p className="small muted" aria-live="polite">{matched.length} of {STUDY_PROGRAMS.length} programs</p>}
    {matched.length === 0 && <p className="muted small">No programs match.</p>}
    {groupPrograms(matched).map(group => <details key={group.category} className="program-group" open={query.trim() ? true : undefined}>
      <summary><h2>{group.category}</h2><span className="small muted">{group.programs.length} {group.programs.length === 1 ? "program" : "programs"}</span></summary>
      {group.programs.map(program => <StudyProgramCard key={program.id} program={program} availableIds={availableIds}
        action={<a className="btn primary" href={appUrl("/progress")}>Plan in the web app</a>} />)}
    </details>)}
  </div>;
}
