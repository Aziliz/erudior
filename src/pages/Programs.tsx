import StudyProgramCard from "../components/StudyProgramCard";
import { STUDY_PROGRAMS } from "../lib/studyPrograms";
import { CATALOG } from "../lib/catalog";
import { appUrl } from "../lib/site";

export default function Programs() {
  const availableIds = new Set(CATALOG.map(course => course.id));
  return <div className="page progress-overview">
    <h1>Programs</h1>
    <p>Explore a sequence of courses toward a larger learning goal. Each program includes stages, recommended prerequisites, learning outcomes and portfolio milestones.</p>
    <p>Save a program from Courses in the web app. Following a program saves your plan without enrolling you in every course.</p>
    {STUDY_PROGRAMS.map(program => <StudyProgramCard key={program.id} program={program} availableIds={availableIds}
      action={<a className="btn primary" href={appUrl("/progress")}>Plan in the web app</a>} />)}
  </div>;
}
