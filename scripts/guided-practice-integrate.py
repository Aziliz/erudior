"""One-shot exact-base feature-branch integration. Removed before PR creation."""
from pathlib import Path
import subprocess
R=Path('.')
modified=['src/App.tsx','src/components/CourseMetadataEditor.tsx','src/lib/courseContentTypes.ts','src/lib/course.ts','src/lib/canonicalAuthoring.ts','src/lib/communityFormat.ts','src/pages/CourseHome.tsx','src/pages/BankHome.tsx','src/pages/Runner.tsx','src/pages/LessonView.tsx','src/pages/Results.tsx','src/pages/CourseProgress.tsx','.github/workflows/community.yml','.github/workflows/courses.yml']
subprocess.run(['git','diff','--exit-code','9ab137b1b587bc012f554dc9727b9f4e52213c90','--',*modified],check=True)
def edit(f,old,new,count=1):
 p=R/f;s=p.read_text();assert s.count(old)==count,(f,old[:80],s.count(old));p.write_text(s.replace(old,new))
def prefix(f,s):
 p=R/f;p.write_text(s+p.read_text())
prefix('src/lib/courseContentTypes.ts','import type { AssessmentPresentation } from "./assessmentPresentation";\n')
edit('src/lib/courseContentTypes.ts','export interface Course {','export interface Course {\n    /** Opt-in untimed learning presentation; not an age, grade, or credit decision. */\n    assessmentPresentation?: AssessmentPresentation;')
prefix('src/lib/course.ts','import { parseAssessmentPresentation } from "./assessmentPresentation";\n')
edit('src/lib/course.ts','  if (!isObj(raw)) throw new BankError("The course must be a JSON object.");','  if (!isObj(raw)) throw new BankError("The course must be a JSON object.");\n  // Validate before legacy fallback so an invalid setting cannot silently enable exams.\n  const assessmentPresentation = parseAssessmentPresentation(raw.assessmentPresentation);')
edit('src/lib/course.ts','    ...(raw.readAloud === true ? { readAloud: true } : {}),','    ...(raw.readAloud === true ? { readAloud: true } : {}),\n    ...(assessmentPresentation === undefined ? {} : { assessmentPresentation }),')
prefix('src/lib/canonicalAuthoring.ts','import { parseAssessmentPresentation } from "./assessmentPresentation";\n')
edit('src/lib/canonicalAuthoring.ts',"'calculator', 'readAloud', 'audio'","'calculator', 'readAloud', 'assessmentPresentation', 'audio'")
edit('src/lib/canonicalAuthoring.ts',"    boolean(c, ['readAloud'], 'course');","    boolean(c, ['readAloud'], 'course');\n    try { parseAssessmentPresentation(c.assessmentPresentation); } catch { add('course.assessmentPresentation', 'unknown assessment presentation'); }")
prefix('src/lib/communityFormat.ts','import { parseAssessmentPresentation, type AssessmentPresentation } from "./assessmentPresentation";\n')
edit('src/lib/communityFormat.ts','  calculator?: CalcChoice;','  calculator?: CalcChoice;\n  /** Legacy block-mode setting; canonical courses store it inside canonical.course. */\n  assessmentPresentation?: AssessmentPresentation;')
edit('src/lib/communityFormat.ts','  if (d.calculator !== undefined && !CALCULATORS.includes(d.calculator)) errs.push("Choose a calculator.");','  if (d.calculator !== undefined && !CALCULATORS.includes(d.calculator)) errs.push("Choose a calculator.");\n  try { parseAssessmentPresentation(d.assessmentPresentation); } catch { errs.push("Choose a valid assessment presentation."); }')
edit('src/lib/communityFormat.ts','  const title = d.title.trim();','  const assessmentPresentation = parseAssessmentPresentation(d.assessmentPresentation);\n  const title = d.title.trim();')
edit('src/lib/communityFormat.ts','    revision: meta.version,\n    modules: appModules,','    revision: meta.version,\n    ...(assessmentPresentation === undefined ? {} : { assessmentPresentation }),\n    modules: appModules,')
edit('src/components/CourseMetadataEditor.tsx','    <label>Read-aloud setting','''    <label>Assessment presentation<select className="select" value={course.assessmentPresentation ?? "standard"} onChange={e=>patch('assessmentPresentation',e.target.value as Course['assessmentPresentation'])}><option value="standard">Standard study and exams</option><option value="guided-practice">Guided practice (untimed)</option></select></label>
    <p className="small muted">Guided practice removes exam planning and visible timers. Answer checks and lesson completion rules stay the same. This does not determine age, placement, or credit.</p>
    <label>Read-aloud setting''')
prefix('src/App.tsx','import { guidedSessionProblem } from "./lib/assessmentPresentation";\n')
edit('src/App.tsx','    go: (v) => {\n      if (lockedRef.current || gateRef.current) return;','''    go: (v) => {
      if (lockedRef.current || gateRef.current) return;
      if (v.name === "run") {
        const owner = courses.find(c => c.banks.some(b => b.id === v.session.bankId));
        const problem = guidedSessionProblem(owner, v.session);
        if (problem) { toast(problem); return; }
      }''')
prefix('src/pages/CourseHome.tsx','import { isGuidedPractice } from "../lib/assessmentPresentation";\nimport { GuidedCourseHome } from "./GuidedPractice";\n')
edit('src/pages/CourseHome.tsx','{tab === "today" && <TodayTab api={api} course={course} />}','{tab === "today" && (isGuidedPractice(course) ? <GuidedCourseHome api={api} course={course} /> : <TodayTab api={api} course={course} />)}')
edit('src/pages/CourseHome.tsx','{`. Exams: ${Math.min(b.exam.questionCount, b.questions.length)} questions, ${b.exam.timeLimitMinutes} min`}','{isGuidedPractice(course) ? ". Untimed practice" : `. Exams: ${Math.min(b.exam.questionCount, b.questions.length)} questions, ${b.exam.timeLimitMinutes} min`}')
old='''                  <div className="stat">
                    <b>{last ? `${percent(last.correct, last.total)}%` : "None"}</b>
                    <span className="small muted">last exam</span>
                  </div>'''
edit('src/pages/CourseHome.tsx',old,'{!isGuidedPractice(course) && ('+old+')}')
edit('src/pages/CourseHome.tsx','title="Take this lesson\'s quiz"','title={isGuidedPractice(course) ? "Practice this lesson" : "Take this lesson\'s quiz"}')
edit('src/pages/CourseHome.tsx','                        Quiz: {nq}','                        {isGuidedPractice(course) ? "Practice" : "Quiz"}: {nq}')
edit('src/pages/CourseHome.tsx','aria-label={passed ? "Passed" : "Not passed"}','aria-label={isGuidedPractice(course) ? passed ? "Practice complete" : "Practice not complete" : passed ? "Passed" : "Not passed"}')
edit('src/pages/CourseHome.tsx','Module {mi + 1} quiz: all of {m.title}','{isGuidedPractice(course) ? "Unit" : "Module"} {mi + 1} {isGuidedPractice(course) ? "practice" : "quiz"}: all of {m.title}')
prefix('src/pages/BankHome.tsx','import { isGuidedPractice } from "../lib/assessmentPresentation";\nimport { GuidedBankPractice } from "./GuidedPractice";\n')
edit('src/pages/BankHome.tsx','export default function BankHome({ api, bank }: { api: AppApi; bank: Bank }) {','''export default function BankHome({ api, bank }: { api: AppApi; bank: Bank }) {
  const course = api.courses.find(c => c.banks.some(b => b.id === bank.id));
  return course && isGuidedPractice(course)
    ? <GuidedBankPractice key={bank.id} api={api} course={course} bank={bank} />
    : <StandardBankHome key={bank.id} api={api} bank={bank} />;
}
function StandardBankHome({ api, bank }: { api: AppApi; bank: Bank }) {''')
prefix('src/pages/Runner.tsx','import { guidedSessionProblem, isGuidedPractice } from "../lib/assessmentPresentation";\n')
edit('src/pages/Runner.tsx','export default function Runner({ api, session: started, bank, initial }: Props) {','''export default function Runner(props: Props) {
  const course = props.api.courses.find(c => c.banks.some(b => b.id === props.session.bankId));
  const problem = guidedSessionProblem(course, props.session);
  if (problem) return <section className="page panel"><h1>Choose an untimed activity</h1><p>{problem}</p><button className="btn primary" onClick={() => props.api.go(course ? { name: "course", courseId: course.id } : { name: "library" })}>Back to learning</button></section>;
  return <ActiveRunner {...props} />;
}
function ActiveRunner({ api, session: started, bank, initial }: Props) {''')
edit('src/pages/Runner.tsx','  const earlyReader = !!(bank?.courseId && api.courses.find((c) => c.id === bank.courseId)?.readAloud);','''  const guided = isGuidedPractice(api.courses.find(c => c.banks.some(b => b.id === started.bankId)));
  const earlyReader = guided || !!(bank?.courseId && api.courses.find((c) => c.id === bank.courseId)?.readAloud);''')
edit('src/pages/Runner.tsx','{isExam ? "Exam" : quizLesson ? "Lesson quiz" : quizModule ? "Module quiz"','{guided ? quizLesson ? "Lesson practice" : quizModule ? "Unit practice" : "Practice together" : isExam ? "Exam" : quizLesson ? "Lesson quiz" : quizModule ? "Module quiz"')
old='''          <span className={clockClass} aria-label={remaining !== undefined ? "Time remaining" : "Time elapsed"}>
            {formatClock(remaining ?? blockElapsed)}
          </span>'''
edit('src/pages/Runner.tsx',old,'{guided ? <span className="small muted">Take your time. You can save and take a break.</span> : ('+old+')}')
prefix('src/pages/LessonView.tsx','import { isGuidedPractice } from "../lib/assessmentPresentation";\n')
edit('src/pages/LessonView.tsx','  const key = lessonKey(course.id, lesson.id);','  const guided = isGuidedPractice(course);\n  const key = lessonKey(course.id, lesson.id);')
edit('src/pages/LessonView.tsx','<h2>End-of-lesson quiz</h2>','<h2>{guided ? "Try what you learned" : "End-of-lesson quiz"}</h2>')
edit('src/pages/LessonView.tsx','''            {quizQs.length} question{quizQs.length === 1 ? "" : "s"} on this lesson. Get {needed} right to complete it; you see
            the answer and explanation after each one.''','''            {guided ? `${quizQs.length} practice questions. Take your time and look at the explanation after each answer. The app marks this lesson complete after ${needed} answers match; that is a practice checkpoint, not a grade-placement decision.` : <>{quizQs.length} question{quizQs.length === 1 ? "" : "s"} on this lesson. Get {needed} right to complete it; you see the answer and explanation after each one.</>}''')
edit('src/pages/LessonView.tsx','{best ? "Retake the quiz" : "Take the quiz"}','{guided ? best ? "Practice again" : "Start lesson practice" : best ? "Retake the quiz" : "Take the quiz"}')
edit('src/pages/LessonView.tsx','title={hasQuiz && !done ? "Pass the end-of-lesson quiz to complete this lesson" : undefined}','title={hasQuiz && !done ? guided ? "Complete the lesson practice checkpoint to mark this lesson complete" : "Pass the end-of-lesson quiz to complete this lesson" : undefined}')
edit('src/pages/LessonView.tsx','? "Take the quiz"','? guided ? "Start lesson practice" : "Take the quiz"')
prefix('src/pages/Results.tsx','import { isGuidedPractice } from "../lib/assessmentPresentation";\n')
edit('src/pages/Results.tsx','  const [noteFor, setNoteFor]','  const guided = isGuidedPractice(course);\n  const [noteFor, setNoteFor]')
edit('src/pages/Results.tsx','  const showFocus = !quizLesson','  const showFocus = !guided && !quizLesson')
edit('src/pages/Results.tsx','        count: wrong.length,','        count: guided ? Math.min(5, wrong.length) : wrong.length,')
old='''        <div className="score-big">
          {pct}
          <small>%</small>
        </div>'''
edit('src/pages/Results.tsx',old,'{!guided && ('+old+')}')
edit('src/pages/Results.tsx','{quizLesson || quizModule\n              ? passed','{guided ? "Let’s look at your practice" : quizLesson || quizModule\n              ? passed')
edit('src/pages/Results.tsx','''          <p className="muted" style={{ marginTop: 6 }}>
            {attempt.correct} of {attempt.total} correct''','''          {guided ? <div className="stack" style={{ gap: 8, marginTop: 6 }}>
            <p>{attempt.correct} of {attempt.total} answers matched. Use the explanations below to choose what to practice next.</p>
            {(quizLesson || quizModule) && <p>{passed ? "This practice checkpoint is complete." : "This checkpoint needs more practice before the app marks it complete. You can revisit the lesson and try again."}</p>}
            <p className="small muted">An adult can also watch you try a new example with objects, drawings, or speech. These answers do not decide grade placement or show how independently you worked.</p>
            <details><summary>Session details</summary><p className="small muted">{pct}% correct · {formatDuration(attempt.durationSec)} recorded · {formatDateTime(attempt.finishedAt)}{isExam ? " · Earlier timed session" : ""}</p></details>
          </div> : <p className="muted" style={{ marginTop: 6 }}>
            {attempt.correct} of {attempt.total} correct''')
edit('src/pages/Results.tsx','''          </p>
          {quizModule ? (''','''          </p>}
          {quizModule ? (''')
edit('src/pages/Results.tsx','                  Retake the module quiz','                  {guided ? "Practice the unit again" : "Retake the module quiz"}')
edit('src/pages/Results.tsx','                    Module quiz: {moduleNext.title}','                    {guided ? "Unit practice" : "Module quiz"}: {moduleNext.title}')
edit('src/pages/Results.tsx','                  Retake the quiz','                  {guided ? "Practice the lesson again" : "Retake the quiz"}')
edit('src/pages/Results.tsx','                Practice the {wrong.length} I missed','                {guided ? `Practice up to ${Math.min(5, wrong.length)} again` : `Practice the ${wrong.length} I missed`}')
prefix('src/pages/CourseProgress.tsx','import { isGuidedPractice } from "../lib/assessmentPresentation";\n')
edit('src/pages/CourseProgress.tsx','  const headingId = useId();\n  const { progress } = api;','  const headingId = useId();\n  const guided = isGuidedPractice(course);\n  const { progress } = api;')
edit('src/pages/CourseProgress.tsx','<span>module quizzes passed</span>','<span>{guided ? "unit practice checkpoints" : "module quizzes passed"}</span>')
edit('src/pages/CourseProgress.tsx','<p className="muted">Next module quiz:','<p className="muted">Next {guided ? "unit practice" : "module quiz"}:')
edit('src/pages/CourseProgress.tsx','>Open module quizzes</button>','>{guided ? "Open unit practice" : "Open module quizzes"}</button>')
edit('src/pages/CourseProgress.tsx','''      <section className="panel" aria-label="Course exam scores">''','''      {!guided && <section className="panel" aria-label="Course exam scores">''')
edit('src/pages/CourseProgress.tsx','''      </section>

      <section className="panel" aria-label="Course session history">''','''      </section>}
      {guided && <p className="notice">Practice records show answers and app checkpoints, not grade placement or independent performance. Use a fresh hands-on example with a supervising adult to gather that evidence.</p>}

      <section className="panel" aria-label="Course session history">''')
edit('src/pages/CourseProgress.tsx','<ScorePill attempt={attempt} />','{!guided && <ScorePill attempt={attempt} />}')
for name in ['community','courses']:
 edit(f'.github/workflows/{name}.yml','      - "src/lib/courseContentTypes.ts"','      - "src/lib/courseContentTypes.ts"\n      - "src/lib/assessmentPresentation.ts"')
Path('.github/workflows/guided-practice-workspace.yml').unlink()
Path('.github/workflows/guided-practice-integrate.yml').unlink()
Path(__file__).unlink()
