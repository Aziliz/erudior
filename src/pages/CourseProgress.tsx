import { useEffect, useId, useState } from "react";
import type { AppApi } from "../App";
import type { Attempt, Course } from "../lib/types";
import { AccuracyBar, ScorePill } from "../components/Bars";
import { courseProgress } from "../lib/learningProgress";
import { courseNumbers } from "../lib/planner";
import { topicStats } from "../lib/session";
import { competencyPath } from "../lib/competencyPath";
import { FOUNDATION_COMPETENCIES } from "../lib/competencyCatalog";
import { explainCompetencyBlock } from "../lib/competencyPlacement";
import { formatDateTime, formatDuration, percent } from "../lib/util";

/** The learner's detailed record for one course. Enrollment rollups live in ProgressPage. */
export default function CourseProgress({ api, course }: { api: AppApi; course: Course }) {
  const headingId = useId();
  const { progress } = api;
  const summary = courseProgress(course, progress);
  const coverage = courseNumbers(course, progress);
  const [historyLimit, setHistoryLimit] = useState(20);
  useEffect(() => setHistoryLimit(20), [course.id, api.student?.id]);
  const nextLesson = course.lessons.find(lesson => lesson.id === summary.nextLessonId);
  const nextModule = course.modules.find(module => module.id === summary.nextModuleId);
  const exams = summary.attempts.filter(attempt => attempt.mode === "exam");
  const weak = course.banks.flatMap(bank => topicStats(bank, progress).map(topic => ({ ...topic, bankId: bank.id, bankTitle: bank.title })))
    .filter(topic => topic.attempts >= 3 && topic.accuracy !== null && topic.accuracy < 1)
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0) || a.topic.localeCompare(b.topic))
    .slice(0, 8);
  const openResult = (attemptId: string) => api.go({ name: "results", attemptId, back: { name: "course", courseId: course.id, tab: "progress" } });

  return (
    <div className="stack course-progress">
      <section className="panel" aria-labelledby={headingId}>
        <div className="panel-head">
          <div>
            <h2 id={headingId}>Course progress</h2>
            <p className="muted small">Your lessons, assessments, and practice in {course.title}.</p>
          </div>
          <button className="btn sm" onClick={() => api.go({ name: "progress" })}>All enrolled courses</button>
        </div>
        {summary.percent === null ? (
          <p className="muted">This course has no core lessons to measure yet. Its practice history still appears below.</p>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>{summary.percent}% complete</strong>
              <span className="small muted">{summary.lessonsDone} of {summary.lessonsTotal} core lessons complete</span>
            </div>
            <progress aria-label={`${course.title} course completion`} value={summary.percent} max={100} style={{ width: "100%", height: 12, accentColor: "var(--accent)" }}>{summary.percent}%</progress>
          </div>
        )}
        {summary.completionBasis === "exam" && <p className="small" style={{ marginTop: 10 }}>Completed by passing a full-course exam. The lesson counts below show which lessons you have worked through.</p>}
        <p className="small muted" style={{ marginTop: 10 }}>Lesson completion, assessment scores, and skill mastery are shown separately. Optional honors lessons do not reduce core lesson progress.</p>
        <div className="stats-strip">
          <div><b>{summary.lessonsDone}/{summary.lessonsTotal}</b><span>core lessons</span></div>
          <div><b>{summary.moduleQuizzesDone}/{summary.moduleQuizzesTotal}</b><span>module quizzes passed</span></div>
          <div><b>{summary.questionsAnswered}</b><span>questions answered</span></div>
          <div><b>{summary.accuracy === null ? "No scores yet" : `${Math.round(summary.accuracy * 100)}%`}</b><span>answer accuracy</span></div>
          <div><b>{formatDuration(summary.studySeconds)}</b><span>recorded session time</span></div>
        </div>
        {nextLesson ? (
          <div className="row" style={{ justifyContent: "space-between" }}>
            <p className="muted">Next lesson: <strong style={{ color: "var(--ink)" }}>{nextLesson.title}</strong></p>
            <button className="btn primary" onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: nextLesson.id })}>Continue lesson</button>
          </div>
        ) : nextModule ? (
          <div className="row" style={{ justifyContent: "space-between" }}>
            <p className="muted">Next module quiz: <strong style={{ color: "var(--ink)" }}>{nextModule.title}</strong></p>
            <button className="btn primary" onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>Open module quizzes</button>
          </div>
        ) : summary.complete ? (
          <p>Core course progress is complete. You can review lessons or continue practicing.</p>
        ) : null}
      </section>

      <div className="grid-2">
        <section className="panel" aria-label="Course study coverage">
          <div className="panel-head"><h2>Study coverage</h2></div>
          <dl className="course-coverage">
            <div><dt>Questions practiced</dt><dd>{coverage.questionsSeen} of {coverage.questionsTotal}</dd></div>
            <div><dt>Notecards learned</dt><dd>{coverage.cardsLearned} of {coverage.cardsTotal}</dd></div>
            {coverage.honorsTotal > 0 && <div><dt>Optional honors lessons</dt><dd>{coverage.honorsDone} of {coverage.honorsTotal}</dd></div>}
          </dl>
          <button className="btn sm" onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>Review lessons</button>
        </section>

        <section className="panel" aria-label="Course topics to practice">
          <div className="panel-head"><h2>Topics to practice</h2></div>
          {weak.length ? <ul className="roadmap-list">
            {weak.map(topic => <li key={`${topic.bankId}/${topic.topic}`} style={{ display: "block" }}>
              <strong>{topic.topic}</strong>
              {course.banks.length > 1 && <p className="small muted">{topic.bankTitle}</p>}
              <AccuracyBar value={topic.accuracy} />
              <p className="small muted">{topic.correct} correct answers in {topic.attempts} attempts</p>
            </li>)}
          </ul> : <p className="muted small">Topics appear after at least three answers in this course and one missed answer.</p>}
          <button className="btn sm" onClick={() => api.go({ name: "course", courseId: course.id, tab: "banks" })}>Open course questions</button>
        </section>
      </div>

      <CourseSkills api={api} course={course} />

      <section className="panel" aria-label="Course exam scores">
        <div className="panel-head"><h2>Exam scores</h2></div>
        {exams.length ? <>
          <p className="muted small">The latest {Math.min(exams.length, 20)} exam{exams.length === 1 ? "" : "s"} in this course. Select a session below to see its answers.</p>
          <ScoreTrend courseTitle={course.title} attempts={exams.slice(0, 20).reverse()} />
        </> : <p className="muted small">Complete an exam in this course to see its score history.</p>}
      </section>

      <section className="panel" aria-label="Course session history">
        <div className="panel-head"><h2>Session history</h2><span className="small muted">{summary.attempts.length} session{summary.attempts.length === 1 ? "" : "s"}</span></div>
        {summary.attempts.length ? <>
          <div className="table-wrap learning-history" role="region" aria-label={`${course.title} session history`} tabIndex={0}>
            <table className="table">
              <thead><tr><th>When</th><th>Activity</th><th>Mode</th><th className="r">Score</th><th className="r">Time</th><th>Result</th></tr></thead>
              <tbody>{summary.attempts.slice(0, historyLimit).map(attempt => <tr key={attempt.id}>
                <td>{formatDateTime(attempt.finishedAt)}</td>
                <td>{attempt.lesson ? course.lessons.find(lesson => lesson.id === attempt.lesson?.lessonId)?.title ?? attempt.bankTitle
                  : attempt.module ? course.modules.find(module => module.id === attempt.module?.moduleId)?.title ?? attempt.bankTitle : attempt.bankTitle}</td>
                <td>{attempt.mode === "exam" ? "Exam" : "Practice"}</td>
                <td className="r">{attempt.correct}/{attempt.total} ({percent(attempt.correct, attempt.total)}%)</td>
                <td className="r">{formatDuration(attempt.durationSec)}</td>
                <td><ScorePill attempt={attempt} /> <button className="btn sm" onClick={() => openResult(attempt.id)} aria-label={`View result for ${attempt.bankTitle} on ${formatDateTime(attempt.finishedAt)}`}>View result</button></td>
              </tr>)}</tbody>
            </table>
          </div>
          {historyLimit < summary.attempts.length && <button className="btn sm" style={{ marginTop: 12 }} onClick={() => setHistoryLimit(limit => limit + 20)}>Show {Math.min(20, summary.attempts.length - historyLimit)} more sessions</button>}
        </> : <p className="muted small">No completed sessions in this course yet. Your results will appear here as you study.</p>}
      </section>
    </div>
  );
}

function CourseSkills({ api, course }: { api: AppApi; course: Course }) {
  const headingId = useId();
  const definitions = FOUNDATION_COMPETENCIES.filter(skill => Object.prototype.hasOwnProperty.call(skill.lessons, course.id));
  if (!definitions.length) return null;
  const ids = new Set(definitions.map(skill => skill.id));
  let model: ReturnType<typeof competencyPath> | null = null;
  let error = api.competencySync?.error ?? "";
  if (!api.competencySync?.pending && !error) {
    try { model = competencyPath(api.courses, api.progress); }
    catch (cause) { error = cause instanceof Error ? cause.message : String(cause); }
  }
  const states = model?.states.filter(skill => ids.has(skill.id)) ?? [];
  return <section className="panel" aria-labelledby={headingId}>
    <div className="panel-head"><h2 id={headingId}>Skills in this course</h2></div>
    <p className="muted small">Linked assessments show skill mastery. A supervising adult's placement decision is separate from assessed mastery.</p>
    {api.competencySync?.pending ? <p role="status">Updating course skill evidence…</p> : error ? <div role="alert">
      <p>Course skill evidence could not be verified: {error}</p>
      {api.retryCompetencySync && <button className="btn sm" onClick={api.retryCompetencySync}>Retry course skills</button>}
    </div> : states.length ? <>
      <p className="small muted">{states.filter(skill => skill.assessedMastered).length} assessed as mastered · {states.filter(skill => skill.placement).length} adult placement decisions</p>
      <ul className="roadmap-list">{states.map(skill => <li key={skill.id}>
        <span className={`pill ${skill.assessedMastered ? "pass" : "neutral"}`}>{skill.placement ? "Adult placement" : skill.assessedMastered ? "Assessed mastery" : skill.ready ? "Ready to assess" : "Prerequisites needed"}</span>
        <div>
          <strong>{skill.title}</strong>
          <p className="small muted">{explainCompetencyBlock(skill, model!.states)}</p>
          <p className="small muted">{skill.mastery === null ? "No current assessed evidence." : `Assessment estimate ${Math.round(skill.mastery * 100)}%, confidence ${Math.round(skill.confidence * 100)}%.`}</p>
          {skill.placement && <p className="small muted">Adult decision by {skill.placement.actorName}: {skill.placement.reason}. This is not assessed mastery or certification.</p>}
          {(definitions.find(definition => definition.id === skill.id)?.lessons[course.id] ?? [])
            .map(id => course.lessons.find(lesson => lesson.id === id)).filter(lesson => !!lesson).slice(0, 2)
            .map(lesson => <button key={lesson.id} className="linkish small" onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: lesson.id })}>Review {lesson.title}</button>)}
        </div>
      </li>)}</ul>
    </> : <p className="muted small">No current assessed skill evidence is available for this course.</p>}
  </section>;
}

function ScoreTrend({ courseTitle, attempts }: { courseTitle: string; attempts: Attempt[] }) {
  const W = 620, H = 180, pad = { left: 36, right: 16, top: 12, bottom: 28 };
  const x = (index: number) => pad.left + (attempts.length === 1 ? (W - pad.left - pad.right) / 2 : index * (W - pad.left - pad.right) / (attempts.length - 1));
  const y = (value: number) => H - pad.bottom - value * (H - pad.top - pad.bottom) / 100;
  const points = attempts.map((attempt, index) => ({ x: x(index), score: percent(attempt.correct, attempt.total), attempt }));
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${courseTitle} exam score trend, oldest to newest`}>
    {[0, 50, 100].map(value => <g key={value}>
      <line x1={pad.left} x2={W - pad.right} y1={y(value)} y2={y(value)} stroke="var(--rule)" />
      <text x={pad.left - 6} y={y(value) + 4} textAnchor="end" fontSize="12" fill="var(--ink-3)">{value}%</text>
    </g>)}
    <path d={points.map((point, index) => `${index ? "L" : "M"}${point.x},${y(point.score)}`).join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2" />
    {points.map(point => <circle key={point.attempt.id} cx={point.x} cy={y(point.score)} r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"><title>{formatDateTime(point.attempt.finishedAt)}: {point.score}%</title></circle>)}
    <text x={pad.left} y={H - 6} fontSize="12" fill="var(--ink-3)">Oldest</text>
    <text x={W - pad.right} y={H - 6} textAnchor="end" fontSize="12" fill="var(--ink-3)">Latest</text>
  </svg>;
}
