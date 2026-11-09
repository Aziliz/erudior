// Production Runner, synthetic questions, no course downloads or learner storage.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Runner from '../../src/pages/Runner';
import { emptyProgress } from '../../src/lib/storage';
import { readSpec, targetProblems } from '../../src/lib/manip';
import { speaker } from '../../src/lib/speech';
import type { AppApi } from '../../src/App';
import type { Course, Bank, Question } from '../../src/lib/types';
import type { Session } from '../../src/lib/session';
import 'katex/dist/katex.min.css';
import '../../src/styles.css';

const models = [
  { kind: 'blocks', value: 12 },
  { kind: 'numberline', at: 2 },
  { kind: 'counters', count: 2 },
  { kind: 'clock', time: '2:00' },
  { kind: 'coins', start: ['penny'] },
  { kind: 'fractions', bars: ['1/4'] },
] as const;
const targets = [{ value: 23 }, { at: 3 }, { count: 3 }, { time: '3:00' }, { cents: 2 }, { values: ['2/4'] }];
const questions = models.map((model, index) => ({
  id: model.kind, type: 'model', topic: 'Synthetic practice',
  stem: 'Use the model to show your answer.', model,
  target: targets[index], choices: [], answer: [],
})) as unknown as Question[];
for (const q of questions) {
  const checked = readSpec(q.model);
  if (checked.problems.length || targetProblems(checked.model, q.target).length) throw Error('Invalid synthetic model: ' + q.id);
}
questions.push({ id: 'text', type: 'text', topic: 'Synthetic practice', stem: 'Write the number that comes after two.', choices: [], answer: [], accept: [['3']] });
questions.push({ id: 'fraction-choice', type: 'choice', topic: 'Synthetic practice',
  stem: 'A row has nine flags. Two of the flags are blue. Which fraction of the row is blue?',
  choices: [String.raw`$\frac{2}{9}$`, String.raw`$\frac{9}{2}$`], answer: [0] });
function Fixture() {
  const [selection, setSelection] = useState({ index: 0, readAloud: true });
  const bank = { id: 'synthetic-bank', title: 'Synthetic practice', courseId: 'synthetic', sections: [] } as unknown as Bank;
  const course = { id: 'synthetic', title: 'Synthetic reader layout', readAloud: selection.readAloud, assessmentPresentation: 'guided-practice', lessons: [], banks: [bank] } as unknown as Course;
  const progress = emptyProgress();
  progress.study = { autoRead: false, explainFirst: false };
  const api = { progress, courses: [course], go: () => {}, toast: () => {}, saveLearnerSession: async () => {} } as unknown as AppApi;
  const q = questions[selection.index];
  const session: Session = { id: `synthetic-${q.id}`, bankId: bank.id, bankTitle: bank.title, mode: 'practice', startedAt: Date.now(), items: [{ q, order: q.choices.map((_, i) => i) }], blocks: [{ start: 0, end: 1 }] };
  Object.assign(window, { readerFixture: { show(index: number, readAloud = true) { speaker.stop(); setSelection({ index, readAloud }); } } });
  // Match App's production scroll container, rather than letting Runner overflow the document.
  return <div className="shell"><main className="main" id="main" tabIndex={-1} data-question={q.id} data-read-aloud={selection.readAloud}><Runner key={`${q.id}-${selection.readAloud}`} api={api} bank={bank} session={session}/></main></div>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
