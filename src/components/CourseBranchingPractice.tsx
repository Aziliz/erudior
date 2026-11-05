import { useState } from 'react';
import { BRANCHING_DISCLAIMER, branchingConditionMatches, replayBranchingPractice, type BranchingPack } from '../lib/branchingEngine';

export default function CourseBranchingPractice({ source: pack }: { source: BranchingPack }) {
  const [choices, setChoices] = useState<string[]>([]);
  const [error, setError] = useState('');
  const state = replayBranchingPractice(pack, choices);
  const node = pack.nodes.find(item => item.id === state.nodeId)!;

  function choose(id: string) {
    const next = [...choices, id];
    try {
      replayBranchingPractice(pack, next);
      setChoices(next);
      setError('');
    } catch (failure) {
      setError((failure as Error).message);
    }
  }

  return <section className="branching panel" aria-label="Self-study scenario">
    <h2>Try the scenario</h2>
    <p>{pack.description}</p>
    <p>{BRANCHING_DISCLAIMER} This run lasts while the activity is open.</p>
    <h3>{node.title}</h3>
    <p>{node.text}</p>
    <p role="status">Elapsed {pack.timeUnit}: {state.tick}. Outcome: {state.outcome}.</p>
    {state.outcome === 'in-progress' && <ul>{node.choices.map(choice => <li key={choice.id}>
      <button className="btn" style={{ whiteSpace: 'normal', maxWidth: '100%' }} disabled={state.tick + choice.costTicks > pack.maxTick ||
        !choice.conditions.every(condition => branchingConditionMatches(state, condition))}
        onClick={() => choose(choice.id)}>{choice.title} ({choice.costTicks} {pack.timeUnit})</button>
    </li>)}</ul>}
    {pack.milestones.length > 0 && <ul>{pack.milestones.map(milestone => <li key={milestone.id}>
      {milestone.title} by tick {milestone.deadlineTick}: {state.milestones[milestone.id]}
    </li>)}</ul>}
    {choices.length > 0 && <><h3>Decision timeline</h3><ol>{state.timeline.map((event, index) =>
      <li key={index}>Tick {event.tick} · {event.text}</li>)}</ol>
      <button className="btn" onClick={() => { setChoices([]); setError(''); }}>Restart scenario</button></>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
