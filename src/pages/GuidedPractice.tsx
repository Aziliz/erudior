import { useId, useState } from "react";
import type { AppApi } from "../App";
import type { Bank, Course } from "../lib/types";
import { courseProgress } from "../lib/learningProgress";
import { practicePool, startPractice } from "../lib/session";

/** A course-authored learning surface, not a learner-age or readiness assessment. */
export function GuidedCourseHome({ api, course }: { api: AppApi; course: Course }) {
  const id = useId();
  const summary = courseProgress(course, api.progress);
  const next = course.lessons.find(l => l.id === summary.nextLessonId);
  return <div className="stack guided-practice">
    <section className="panel" aria-labelledby={id}>
      <span className="pill neutral">Guided practice · no time limit</span>
      <h2 id={id} style={{ marginTop: 14 }}>A little learning, at your pace</h2>
      <p className="muted" style={{ marginTop: 8 }}>Read, listen, or work with an adult. Try one activity, talk about it, and take a break when you need one.</p>
      {next ? <div className="stack" style={{ marginTop: 20, gap: 12 }}>
        <div><span className="small muted">Next lesson</span><h3>{next.title}</h3></div>
        <div><button className="btn primary" onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: next.id })}>Continue learning</button></div>
      </div> : <button className="btn primary" style={{ marginTop: 16 }} onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>Choose a lesson</button>}
      <p className="small muted" style={{ marginTop: 16 }}>{summary.lessonsDone} of {summary.lessonsTotal} lesson checkpoints complete. You can revisit any lesson.</p>
    </section>
    <section className="panel" aria-label="Ways to practice">
      <div className="panel-head"><h2>What would you like to try?</h2></div>
      <div className="row" style={{ flexWrap: "wrap", gap: 12 }}>
        <button className="btn" onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>Explore lessons</button>
        {course.banks.some(b => b.questions.length) && <button className="btn" onClick={() => api.go({ name: "course", courseId: course.id, tab: "banks" })}>Try a few questions</button>}
        {!!course.references.length && <button className="btn" onClick={() => api.go({ name: "course", courseId: course.id, tab: "reference" })}>Open teaching references</button>}
      </div>
    </section>
    <section className="panel" aria-label="For the supporting adult">
      <div className="panel-head"><h2>For the supporting adult</h2></div>
      <p>Read prompts or help with controls as needed. Then watch the learner try a new example with objects, drawings, or speech. Keep access help separate from help solving the problem.</p>
      <p className="small muted" style={{ marginTop: 10 }}>App checkpoints and answer totals are practice records. They do not establish independent performance, attendance, credit, or grade placement.</p>
    </section>
  </div>;
}

/** No exam button or date, and only deliberately short, untimed practice batches. */
export function GuidedBankPractice({ api, course, bank }: { api: AppApi; course: Course; bank: Bank }) {
  const [count, setCount] = useState(5);
  const [topic, setTopic] = useState("");
  const topics = [...new Set(bank.questions.filter(q => !q.honors).map(q => q.topic))].sort();
  const options = { topics: topic ? [topic] : [], sections: [], filter: "all" as const, shuffleChoices: false, honors: false };
  const available = practicePool(bank, api.progress, options).length;
  const actual = Math.min(count, available);
  return <div className="page stack guided-practice">
    <div><button className="back" onClick={() => api.go({ name: "course", courseId: course.id, tab: "banks" })}>← {course.title}</button></div>
    <section className="panel">
      <span className="pill neutral">No time limit</span>
      <h1 style={{ marginTop: 12 }}>Practice together</h1>
      <p className="muted" style={{ marginTop: 8 }}>Choose a small set. Look at each explanation, and save your place whenever you need a break.</p>
      <div className="stack" style={{ gap: 16, marginTop: 22, maxWidth: 480 }}>
        <label className="field"><span>How many questions?</span><select className="select" aria-label="How many questions?" value={count} onChange={e => setCount(Number(e.target.value))}>
          {[3, 5, 10].map(n => <option key={n} value={n}>Up to {n} questions</option>)}
        </select></label>
        <label className="field"><span>What shall we practice?</span><select className="select" aria-label="What shall we practice?" value={topic} onChange={e => setTopic(e.target.value)}>
          <option value="">A mix of topics</option>{topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select></label>
        <div><button className="btn primary" disabled={!available} onClick={() => {
          if (available) api.go({ name: "run", session: startPractice(bank, api.progress, { ...options, count: actual }) });
        }}>{available ? `Start ${actual} practice questions` : "No questions in this selection"}</button></div>
      </div>
    </section>
    <p className="notice">Practice answers help choose what to work on next. An adult’s observations on a new example are separate from the app’s answer checks.</p>
  </div>;
}
