import { useMemo, useState } from "react";
import type { Bank, Course, Question } from "../lib/types";
import { localBankId } from "../lib/course";
import { makeItems } from "../lib/session";
import { answerText, chosenText, isComplete, isCorrect, qtype, typeLabel } from "../lib/questions";
import { audioLibrary } from "../lib/readAloud";
import { imeFor } from "../lib/ime";
import { uid } from "../lib/util";
import { questionIssues, type QuestionAttempt, type QuestionIssue } from "../lib/questionReview";
import QuestionBody, { QuestionAudio, QuestionImage, QuestionStem } from "./QuestionBody";
import { PhonicsPrompt } from "./ReadAloud";
import MathText from "./MathText";

export type QuestionLocation = { bankId: string; questionId: string };
interface Props {
  course: Course; digest: string; attempts: QuestionAttempt[];
  location: QuestionLocation | null; select: (where: QuestionLocation) => void;
  save: (attempt: QuestionAttempt) => void;
}
export default function BlindQuestionReview({ course, digest, attempts, location, select, save }: Props) {
  const bank = course.banks.find(b => localBankId(b) === location?.bankId) ?? course.banks.find(b => b.questions.length);
  const q = bank?.questions.find(item => item.id === location?.questionId) ?? bank?.questions[0];
  return <section aria-label="Blind question review">
    <h4>Blind question review</h4>
    {bank && <label className="field">Question bank<select className="select" value={localBankId(bank)}
      onChange={e => select({ bankId: e.target.value, questionId: "" })}>
      {course.banks.map(b => <option key={b.id} value={localBankId(b)}>{b.title}</option>)}
    </select></label>}
    {bank && q ? <>
      <label className="field">Question to review<select className="select" value={q.id}
        onChange={e => select({ bankId: localBankId(bank), questionId: e.target.value })}>
        {bank.questions.map(item => <option key={item.id} value={item.id}>{item.id} · {item.stem.slice(0, 80)}</option>)}
      </select></label>
      {digest ? <QuestionTrial key={JSON.stringify([bank.id, q.id, digest])} course={course} bank={bank} q={q}
        digest={digest} attempts={attempts} save={save} /> : <p>Identifying the course revision…</p>}
    </> : <p>This bank has no questions to review.</p>}
    {!!attempts.length && <details><summary>Question review history ({attempts.filter(a => a.stage === "recorded").length} recorded)</summary>
      <ul>{attempts.map(a => <li key={a.id}>{a.bankId} / {a.questionId} · {a.stem.slice(0, 80)} · revision {a.revision} · {a.stage === "recorded" ? a.issue : "Draft"}
        {a.digest !== digest && " · Earlier course content"}{a.reviewer && " · " + a.reviewer}
        {a.note && <p>{a.note}</p>}{a.comparison && <details><summary>Saved comparison</summary><p>Reviewer response · {a.comparison.response}</p>
          <p>Recorded key · {a.comparison.key}</p><p>Recorded explanation · {a.comparison.explanation || "None supplied"}</p></details>}
      </li>)}</ul>
    </details>}
  </section>;
}

function QuestionTrial({ course, bank, q, digest, attempts, save }: {
  course: Course; bank: Bank; q: Question; digest: string; attempts: QuestionAttempt[]; save: Props["save"];
}) {
  const id = localBankId(bank);
  const [sequence, setSequence] = useState(0);
  const blank = useMemo<QuestionAttempt>(() => ({
    id: uid("trial-"), bankId: id, questionId: q.id, stem: q.stem, revision: course.revision ?? 1, digest,
    order: makeItems([q], true)[0].order, chosen: [], reviewer: "", stage: "answering", issue: "Checked", note: "",
  }), [id, q, course.revision, digest, sequence]);
  const latest = [...attempts].reverse().find(a => a.bankId === id && a.questionId === q.id && a.digest === digest);
  const a = latest && (latest.stage !== "recorded" || sequence === 0 || latest.id === blank.id) ? latest : blank;
  const [notice, setNotice] = useState("");
  if (a.stage === "recorded") return <div><p>Question review recorded · {a.issue}</p>
    <button type="button" className="btn sm" onClick={() => { setSequence(sequence + 1); setNotice(""); }}>Start another blind attempt</button></div>;
  const revealed = a.stage === "revealed";
  const edit = (patch: Partial<QuestionAttempt>) => { setNotice(""); save({ ...a, ...patch }); };
  function reveal() {
    if (revealed || !isComplete(q, a.chosen)) return;
    edit({ stage: "revealed", comparison: { response: chosenText(q, a.chosen), key: qtype(q) === "text" && q.accept?.length
      ? q.accept.map(variants => variants.join(" / ")).join("; ") : answerText(q),
      explanation: q.explanation ?? "", correct: isCorrect(q, a.chosen) } });
  }
  function record() {
    const reviewer = a.reviewer.trim();
    if (!reviewer || [course.author, bank.author].some(author => author?.trim().toLowerCase() === reviewer.toLowerCase())) {
      setNotice("Enter the name of a reviewer independent of the author."); return;
    }
    if (!a.note.trim()) { setNotice("Describe what you verified or what needs correction."); return; }
    if (!revealed && a.issue !== "Unanswerable") return;
    edit({ reviewer, note: a.note.trim(), stage: "recorded", recordedAt: new Date().toISOString() });
  }
  const lang = course.language;
  const lib = audioLibrary(course);
  return <div className="stack">
    <p className="small muted">{typeLabel(q)} · {bank.title} / {q.id}</p>
    <QuestionStem q={q} />
    <PhonicsPrompt q={q} lib={lib} />
    {qtype(q) !== "label" && <QuestionImage q={q} />}
    <QuestionAudio q={q} revealed={revealed} fallbackLang={lang?.tts ?? lang?.code} />
    <QuestionBody key={a.id} q={q} order={a.order} chosen={a.chosen} reveal={revealed} exam={!revealed} disabled={revealed}
      seed={a.id} lang={lang?.code} ime={imeFor(lang)} tts={lang?.tts} read={course.readAloud ? { lib } : undefined}
      onChange={value => { if (!revealed) edit({ chosen: value }); }}
      onChoose={index => { if (!revealed) edit({ chosen: q.answer.length > 1 ?
        (a.chosen.includes(index) ? a.chosen.filter(v => v !== index) : [...a.chosen, index]) : [index] }); }} />
    {!revealed && <button className="btn primary" type="button" disabled={!isComplete(q, a.chosen)} onClick={reveal}>Lock response and reveal key</button>}
    {a.comparison && <div className="review-comparison" aria-label="Answer comparison">
      <div><h5>Reviewer response</h5><MathText as="p" text={a.comparison.response} /></div>
      <div><h5>Course answer key</h5><MathText as="p" text={a.comparison.key} /></div>
      <p>{a.comparison.correct ? "The engine accepted this response." : "The engine rejected this response."}</p>
      <div><h5>Course explanation</h5><MathText as="p" text={a.comparison.explanation || "No explanation supplied."} /></div>
    </div>}
    <label className="field">Question reviewer<input className="input" value={a.reviewer} onChange={e => edit({ reviewer: e.target.value })} /></label>
    <label className="field">Item finding<select className="select" value={a.issue} onChange={e => edit({ issue: e.target.value as QuestionIssue })}>
      {questionIssues.map(s => <option key={s}>{s}</option>)}</select></label>
    <label className="field">Item review note<textarea className="textarea" value={a.note} onChange={e => edit({ note: e.target.value })} /></label>
    <button className="btn" type="button" disabled={!revealed && a.issue !== "Unanswerable"} onClick={record}>Record item finding</button>
    {notice && <p role="status">{notice}</p>}
  </div>;
}
