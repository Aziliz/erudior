import type { PortableAuthoredCourse } from "../lib/canonicalAuthoring";
import CourseWorkInspection from "./CourseWorkInspection";
import ReadingLibraryInspection from "./ReadingLibraryInspection";

const data = (value: unknown) => <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(value, null, 2)}</pre>;
/** Validated source inspection: never executes authored scripts or substitutes current library data. */
export default function CanonicalCourseInspection({ course }: { course: PortableAuthoredCourse }) {
  return <section aria-label="Full canonical publication inspection">
    <h3>{course.title} — full canonical source</h3>
    <p>Source ID: {course.id} · Source author: {course.author ?? "Not supplied"} · Source revision: {course.revision ?? "Not supplied"}</p>
    <p>{course.description}</p><h4>Metadata, defaults and disclaimer</h4>
    {data({ updated: course.updated, changelog: course.changelog, disclaimer: course.disclaimer, calculator: course.calculator, readAloud: course.readAloud, language: course.language, readingList: course.readingList })}
    <h4>Modules and assessment references</h4>{data(course.modules)}
    <h4>Lessons and validated interactive source</h4>{course.lessons.map(lesson => <article key={lesson.id}><h5>{lesson.title} ({lesson.id})</h5>{data(lesson)}</article>)}
    <h4>All question banks and exam rules</h4>{course.banks.map(bank => <article key={bank.id}><h5>{bank.title} ({bank.id})</h5>{data({ ...bank, questions: undefined })}{bank.questions.map(question => <section key={question.id}><h6>{question.id}: {question.stem}</h6>{data(question)}</section>)}</article>)}
    <h4>Notecard decks</h4>{data(course.decks)}<h4>Glossary and references</h4>{data({ glossary: course.glossary, references: course.references })}
    <h4>Drills and vocabulary</h4>{data({ drills: course.drills, vocab: course.vocab })}
    <h4>Audio assets, alignment, and resource bindings</h4>{data(course.audio ?? {})}
    <CourseWorkInspection work={course} />
    <ReadingLibraryInspection texts={course.texts ?? []} questions={course.banks[0]?.questions ?? []} />
    <h4>Branching scenarios, state, deadlines and consequences</h4>{data(course.branchingScenarios ?? [])}
    <h4>Scientific workspaces, measurements, uncertainty and design</h4>{data(course.scientificWorkspaces ?? [])}
    <h4>Spreadsheet starters, protection and grading criteria</h4>{data(course.spreadsheetAssignments ?? [])}
    <details><summary>Exact complete authoring course JSON</summary>{data(course)}</details>
  </section>;
}
