import type { AppApi } from "../App";
import type { Course, RefSheet } from "../lib/types";
import Markdown from "../components/Markdown";

export default function RefView({ api, course, sheet }: { api: AppApi; course: Course; sheet: RefSheet }) {
  const i = course.references.findIndex((r) => r.id === sheet.id);
  const prev = course.references[i - 1];
  const next = course.references[i + 1];
  const go = (id: string) => api.go({ name: "ref", courseId: course.id, refId: id });
  return (
    <div className="page ref-page">
      <div className="row no-print" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <button className="back" style={{ margin: 0 }} onClick={() => api.go({ name: "course", courseId: course.id, tab: "reference" })}>
          ← Quick reference
        </button>
        <div className="row">
          <button className="btn sm" disabled={!prev} onClick={() => prev && go(prev.id)}>
            Previous
          </button>
          <button className="btn sm" disabled={!next} onClick={() => next && go(next.id)}>
            Next
          </button>
          <button className="btn sm" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
      <article className="ref-sheet">
        <h1>{sheet.title}</h1>
        <p className="faint small print-only">{course.title}</p>
        <Markdown source={sheet.body} glossary={course.glossary} />
      </article>
    </div>
  );
}
