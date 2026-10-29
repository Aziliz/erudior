import { useEffect, useRef, useState } from 'react';
import type { AppApi } from '../App';
import type { DocumentResponse } from '../lib/documentEngine';
import { emptyTransactionSession, replayTransaction, parseMinorUnits, formatMinorUnits, type TransactionAssignment, type TransactionSession, type TransactionLibrary, type TransactionCommand, type TransactionParty } from '../lib/transactionEngine';
import { registerNavigationGuard } from '../lib/navigationGuard';
import TransactionCaseView from './TransactionCaseView';

export default function LearnerTransactions({ api }: { api: AppApi ;}) {
  const service = api.transactionLearner;
  const [library, setLibrary] = useState<TransactionLibrary | null>(null), [assignment, setAssignment] = useState<TransactionAssignment | null>(null), [session, setSession] = useState<TransactionSession | null>(null);
  const [revision, setRevision] = useState<number | null>(null), [docDirty, setDocDirty] = useState(false), [pendingNote, setPendingNote] = useState(false), [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [status, setStatus] = useState(''), [history, setHistory] = useState('');
  const [stage, setStage] = useState<'representation' | 'pricing' | 'offer' | 'closing' | 'archived'>('representation'), [stageNote, setStageNote] = useState('');
  const [party, setParty] = useState<TransactionParty>('buyer'), [parentOffer, setParentOffer] = useState(''), [client, setClient] = useState(''), [price, setPrice] = useState(''), [earnest, setEarnest] = useState(''), [expiry, setExpiry] = useState(''), [closing, setClosing] = useState(''), [offerNote, setOfferNote] = useState('');
  const [decisionOffer, setDecisionOffer] = useState(''), [decisionParty, setDecisionParty] = useState<TransactionParty>('seller'), [decisionNote, setDecisionNote] = useState('');
  const [condition, setCondition] = useState(''), [conditionStatus, setConditionStatus] = useState<'satisfied' | 'waived' | 'failed'>('satisfied'), [conditionNote, setConditionNote] = useState('');
  const [clock, setClock] = useState(''), [clockNote, setClockNote] = useState('');
  const [fundKind, setFundKind] = useState<'deposit' | 'disburse'>('deposit'), [fundClient, setFundClient] = useState(''), [amount, setAmount] = useState(''), [reference, setReference] = useState(''), [fundNote, setFundNote] = useState('');
  const [reverseId, setReverseId] = useState(''), [reverseReference, setReverseReference] = useState(''), [reverseNote, setReverseNote] = useState('');
  const [bank, setBank] = useState(''), [outstanding, setOutstanding] = useState<string[]>([]), [reported, setReported] = useState<Record<string, string>>({}), [reconcileNote, setReconcileNote] = useState(''), [terminationNote, setTerminationNote] = useState('');
  const generation = useRef(0), running = useRef(false), unsaved = useRef(false), eventIds = useRef<Record<string, string>>({}), submissionId = useRef(crypto.randomUUID());
  unsaved.current = docDirty || pendingNote || Object.values(dirty).some(Boolean);
  const mark = (group: string) => { setDirty(v => ({ ...v, [group]: true })); for (const key of Object.keys(eventIds.current)) if (key.startsWith(group)) delete eventIds.current[key]; setStatus(''); };
  function resetEditors() { setDirty({}); setStage('representation'); setStageNote(''); setParty('buyer'); setParentOffer(''); setClient(''); setPrice(''); setEarnest(''); setExpiry(''); setClosing(''); setOfferNote(''); setDecisionOffer(''); setDecisionNote(''); setCondition(''); setConditionNote(''); setClock(''); setClockNote(''); setFundClient(''); setAmount(''); setReference(''); setFundNote(''); setReverseId(''); setReverseReference(''); setReverseNote(''); setBank(''); setOutstanding([]); setReported({}); setReconcileNote(''); setTerminationNote(''); eventIds.current = {}; }
  const learnerScope = JSON.stringify({ student: api.student?.id, password: api.family?.parent?.password });
  useEffect(() => {
    const g = ++generation.current; setLibrary(null); setAssignment(null); setSession(null); setRevision(null); setDocDirty(false); setPendingNote(false); setError(''); setStatus(''); setHistory(''); setBusy(false); resetEditors();
    service?.load().then(v => { if (g === generation.current) setLibrary(v); }).catch(e => { if (g === generation.current) setError(String(e)); }); return () => { generation.current++; };
  }, [learnerScope]);
  useEffect(() => { const off = registerNavigationGuard(() => !running.current && (!unsaved.current || window.confirm('Discard unsaved transaction inputs?'))); const before = (e: BeforeUnloadEvent) => { if (unsaved.current || running.current) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', before); return () => { off(); window.removeEventListener('beforeunload', before); }; }, []);
  async function run(action: (g: number) => Promise<void>) { if (running.current) return; running.current = true; setBusy(true); setError(''); const g = generation.current; try { await action(g); } catch (e) { if (g === generation.current) setError(e instanceof Error ? e.message : String(e)); } finally { running.current = false; if (g === generation.current) setBusy(false); } }
  function open(a: TransactionAssignment) { if (unsaved.current && !window.confirm('Discard unsaved transaction inputs?')) return; const saved = library?.sessions.find(s => s.caseId === a.id && s.caseRevision === a.revision); setAssignment(a); setSession(saved ?? emptyTransactionSession(a)); setRevision(saved?.revision ?? null); setDocDirty(false); setPendingNote(false); setHistory(''); setError(''); setStatus(''); resetEditors(); submissionId.current = crypto.randomUUID(); }
  async function apply(group: string, command: TransactionCommand) { if (!assignment || !service || docDirty || pendingNote) return; eventIds.current[group] ??= crypto.randomUUID(); await run(async g => { const next = await service.command(assignment.id, assignment.revision, command, eventIds.current[group], revision); if (g !== generation.current) return; const loaded = await service.load(); if (g !== generation.current) return; setSession(next); setRevision(next.revision); setLibrary(loaded); setDirty(v => ({ ...v, [group]: false })); submissionId.current = crypto.randomUUID(); setStatus('Simulation event saved. Prior events and submitted evidence are unchanged.'); }); }
  function action(group: string, build: () => TransactionCommand) { if (running.current) return; try { void apply(group, build()); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }
  const state = assignment && session ? replayTransaction(assignment, session.events) : null;
  const money = (text: string) => parseMinorUnits(text, assignment!.pack.minorUnitDigits);
  const signedMoney = (text: string) => text.trim().startsWith('-') ? -money(text.trim().slice(1)) : money(text);
  const blocked = busy || docDirty || pendingNote;
  const commandBlocked = blocked || state?.stage === 'archived';
  const actionDirty = Object.values(dirty).some(Boolean);
  const latest = library?.assignments.filter(a => !library.assignments.some(b => b.id === a.id && b.revision > a.revision)) ?? [];
  const evidence = library?.submissions.filter(s => s.caseId === assignment?.id) ?? [], selectedEvidence = evidence.find(s => s.id === history);
  const changeResponse = (response: DocumentResponse) => { setSession(s => s ? { ...s, response } : s); setDocDirty(true); submissionId.current = crypto.randomUUID(); setStatus(''); };
  return <section className="transactions document-engine">
    <h2>My educational transaction cases</h2>
    <p>Fictional educational practice only. No real money, legal advice, official filing, professional credit or external transaction occurs. Use fictional data. Actions follow the assigned educational rules, not verified current law.</p>
    {error && <p role="alert">{error}</p>}{status && <p role="status">{status}</p>}
    {library?.restoredAt && <p>Restored local records are not authenticated. A supervising adult must re-review quarantined packs before work continues.</p>}
    {!service ? <p>Transaction practice is unavailable for this profile.</p> : <>
      <button disabled={busy} onClick={() => { if (unsaved.current && !window.confirm('Discard unsaved transaction inputs?')) return; void run(async g => { const v = await service.load(); if (g !== generation.current) return; setLibrary(v); setAssignment(null); setSession(null); setDocDirty(false); setPendingNote(false); resetEditors(); setStatus('Transaction cases reloaded.'); }); }}>Reload transaction cases</button>
      {library && latest.length === 0 && <p>No transaction cases assigned.</p>}
      <fieldset disabled={busy}>
        <legend>Assigned transaction cases</legend>{latest.map(a =>
          <button key={a.id} onClick={() => open(a)}>{a.title} — transaction revision {a.revision}</button>)}</fieldset>
      {assignment && session && state && <>
        <h3>{assignment.title}</h3>
        <p>{assignment.instructions}</p>
        <p>{docDirty ? 'Unsaved document responses.' : revision === null ? 'No saved session yet.' : `Saved session revision ${revision}.`}</p>
        <TransactionCaseView key={`${assignment.id}@${assignment.revision}`} assignment={assignment} session={session} onResponse={state.outcome === 'in-progress' ? changeResponse : undefined} onPending={setPendingNote} disabled={busy} />
        {state.outcome !== 'in-progress' && <p>Source document responses are frozen after this outcome. Settlement ledger and reconciliation remain available until archive.</p>}
        <button disabled={busy || pendingNote || state.outcome !== 'in-progress'} onClick={() => void run(async g => { const saved = await service.saveDocuments(assignment.id, assignment.revision, session.response, revision); if (g !== generation.current) return; const loaded = await service.load(); if (g !== generation.current) return; setSession(saved); setRevision(saved.revision); setDocDirty(false); setLibrary(loaded); submissionId.current = crypto.randomUUID(); setStatus('Transaction document draft saved.'); })}>Save transaction documents</button>
        {(docDirty || pendingNote) && <p>Save document responses and add pending annotations before recording simulation events or submitting evidence.</p>}
        <fieldset disabled={commandBlocked}>
          <legend>Case lifecycle</legend>
          <label>Next educational phase<select aria-label="Next educational phase" value={stage} onChange={e => { setStage(e.target.value as typeof stage); mark('stage'); }}>{['representation', 'pricing', 'offer', 'closing', 'archived'].map(v =>
            <option key={v}>{v}</option>)}</select>
          </label>
          <label>Phase reasoning<textarea aria-label="Phase reasoning" value={stageNote} onChange={e => { setStageNote(e.target.value); mark('stage'); }} />
          </label>
          <button onClick={() => action('stage', () => ({ kind: 'stage', stage, note: stageNote }))}>Record phase transition</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Offer or counteroffer</legend>
          <label>Offering party<select aria-label="Offering party" value={party} onChange={e => { setParty(e.target.value as TransactionParty); mark('offer'); }}>
            <option>buyer</option>
            <option>seller</option>
          </select>
          </label>
          <label>Counter to offer<select aria-label="Counter to offer" value={parentOffer} onChange={e => { setParentOffer(e.target.value); mark('offer'); }}>
            <option value="">New offer</option>{state.offers.filter(o => o.status === 'pending').map(o =>
              <option key={o.id} value={o.id}>{o.party} · {o.id}</option>)}</select>
          </label>
          <label>Offer client<select aria-label="Offer client" value={client} onChange={e => { setClient(e.target.value); mark('offer'); }}>
            <option value="">Choose fictional client</option>{assignment.pack.clients.map(c =>
              <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </label>
          <label>Offer price<input aria-label="Offer price" inputMode="decimal" value={price} onChange={e => { setPrice(e.target.value); mark('offer'); }} />
          </label>
          <label>Earnest amount<input aria-label="Earnest amount" inputMode="decimal" value={earnest} onChange={e => { setEarnest(e.target.value); mark('offer'); }} />
          </label>
          <label>Offer expiry date<input aria-label="Offer expiry date" type="date" value={expiry} onChange={e => { setExpiry(e.target.value); mark('offer'); }} />
          </label>
          <label>Proposed closing date<input aria-label="Proposed closing date" type="date" value={closing} onChange={e => { setClosing(e.target.value); mark('offer'); }} />
          </label>
          <label>Offer reasoning<textarea aria-label="Offer reasoning" value={offerNote} onChange={e => { setOfferNote(e.target.value); mark('offer'); }} />
          </label>
          <button onClick={() => action('offer', () => ({ kind: 'offer', offerId: eventIds.current.offerOfferId ?? (eventIds.current.offerOfferId = crypto.randomUUID()), party, ...(parentOffer ? { parentOfferId: parentOffer } : {}), clientId: client, price: money(price), earnest: money(earnest), expiresOn: expiry, closingDate: closing, note: offerNote }))}>Record offer or counteroffer</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Respond to exact offer terms</legend>
          <label>Offer to respond to<select aria-label="Offer to respond to" value={decisionOffer} onChange={e => { setDecisionOffer(e.target.value); mark('decision'); }}>
            <option value="">Choose pending offer</option>{state.offers.filter(o => o.status === 'pending').map(o =>
              <option key={o.id} value={o.id}>{o.party} · {o.id}</option>)}</select>
          </label>
          <label>Responding party<select aria-label="Responding party" value={decisionParty} onChange={e => { setDecisionParty(e.target.value as TransactionParty); mark('decision'); }}>
            <option>buyer</option>
            <option>seller</option>
          </select>
          </label>
          <label>Response reasoning<textarea aria-label="Response reasoning" value={decisionNote} onChange={e => { setDecisionNote(e.target.value); mark('decision'); }} />
          </label>{(['accept', 'reject', 'withdraw'] as const).map(kind =>
            <button key={kind} onClick={() => action('decision', () => ({ kind, offerId: decisionOffer, party: decisionParty, note: decisionNote }))}>{kind === 'accept' ? 'Accept exact offer' : kind === 'reject' ? 'Reject exact offer' : 'Withdraw exact offer'}</button>)}</fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Due-diligence outcome</legend>
          <label>Contingency<select aria-label="Contingency" value={condition} onChange={e => { setCondition(e.target.value); mark('condition'); }}>
            <option value="">Choose condition</option>{assignment.pack.contingencies.map(c =>
              <option key={c.id} value={c.id}>{c.title} ({c.category})</option>)}</select>
          </label>
          <label>Condition outcome<select aria-label="Condition outcome" value={conditionStatus} onChange={e => { setConditionStatus(e.target.value as typeof conditionStatus); mark('condition'); }}>
            <option>satisfied</option>
            <option>waived</option>
            <option>failed</option>
          </select>
          </label>
          <label>Condition evidence<textarea aria-label="Condition evidence" value={conditionNote} onChange={e => { setConditionNote(e.target.value); mark('condition'); }} />
          </label>
          <button onClick={() => action('condition', () => ({ kind: 'contingency', contingencyId: condition, status: conditionStatus, note: conditionNote }))}>Record contingency outcome</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Simulated date and deadlines</legend>
          <p>Advancing the fictional case date may expire offers or conditions under this pack. It does not calculate a real legal deadline.</p>
          <label>Advance simulated date<input aria-label="Advance simulated date" type="date" value={clock} onChange={e => { setClock(e.target.value); mark('clock'); }} />
          </label>
          <label>Date-change reason<textarea aria-label="Date-change reason" value={clockNote} onChange={e => { setClockNote(e.target.value); mark('clock'); }} />
          </label>
          <button onClick={() => action('clock', () => ({ kind: 'clock', date: clock, note: clockNote }))}>Advance case clock</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Client-owned trust entry</legend>
          <label>Trust entry type<select aria-label="Trust entry type" value={fundKind} onChange={e => { setFundKind(e.target.value as typeof fundKind); mark('fund'); }}>
            <option>deposit</option>
            <option>disburse</option>
          </select>
          </label>
          <label>Trust client<select aria-label="Trust client" value={fundClient} onChange={e => { setFundClient(e.target.value); mark('fund'); }}>
            <option value="">Choose fictional client</option>{assignment.pack.clients.map(c =>
              <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </label>
          <label>Trust amount<input aria-label="Trust amount" inputMode="decimal" value={amount} onChange={e => { setAmount(e.target.value); mark('fund'); }} />
          </label>
          <label>Trust reference<input aria-label="Trust reference" value={reference} onChange={e => { setReference(e.target.value); mark('fund'); }} />
          </label>
          <label>Trust entry reason<textarea aria-label="Trust entry reason" value={fundNote} onChange={e => { setFundNote(e.target.value); mark('fund'); }} />
          </label>
          <button onClick={() => action('fund', () => ({ kind: fundKind, entryId: eventIds.current.fundEntryId ?? (eventIds.current.fundEntryId = crypto.randomUUID()), clientId: fundClient, amount: money(amount), reference, note: fundNote }))}>Post trust entry</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Append a correction</legend>
          <label>Entry to reverse<select aria-label="Entry to reverse" value={reverseId} onChange={e => { setReverseId(e.target.value); mark('reverse'); }}>
            <option value="">Choose posted entry</option>{state.entries.map(e =>
              <option key={e.id} value={e.id}>{e.reference} · {formatMinorUnits(e.amount, assignment.pack.minorUnitDigits)}</option>)}</select>
          </label>
          <label>Reversal reference<input aria-label="Reversal reference" value={reverseReference} onChange={e => { setReverseReference(e.target.value); mark('reverse'); }} />
          </label>
          <label>Correction reason<textarea aria-label="Correction reason" value={reverseNote} onChange={e => { setReverseNote(e.target.value); mark('reverse'); }} />
          </label>
          <button onClick={() => action('reverse', () => ({ kind: 'reverse', entryId: eventIds.current.reverseEntryId ?? (eventIds.current.reverseEntryId = crypto.randomUUID()), targetEntryId: reverseId, reference: reverseReference, note: reverseNote }))}>Append trust reversal</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Three-way statement reconciliation</legend>
          <p>Enter independent statement and client-ledger totals. Outstanding entries adjust the bank figure once; discrepancies remain visible as educational audit findings.</p>
          <label>Bank statement balance<input aria-label="Bank statement balance" inputMode="decimal" value={bank} onChange={e => { setBank(e.target.value); mark('reconcile'); }} />
          </label>
          <fieldset>
            <legend>Outstanding entries not on the statement</legend>{state.entries.map(e =>
              <label key={e.id}>
                <input type="checkbox" checked={outstanding.includes(e.id)} onChange={x => { setOutstanding(x.target.checked ? [...outstanding, e.id] : outstanding.filter(id => id !== e.id)); mark('reconcile'); }} />{e.reference} · {formatMinorUnits(e.amount, assignment.pack.minorUnitDigits)}</label>)}</fieldset>{assignment.pack.clients.map(c =>
                  <label key={c.id}>Reported balance for {c.name}<input aria-label={`Reported balance for ${c.name}`} inputMode="decimal" value={reported[c.id] ?? ''} onChange={e => { setReported({ ...reported, [c.id]: e.target.value }); mark('reconcile'); }} />
                  </label>)}<label>Reconciliation reasoning<textarea aria-label="Reconciliation reasoning" value={reconcileNote} onChange={e => { setReconcileNote(e.target.value); mark('reconcile'); }} />
          </label>
          <button onClick={() => action('reconcile', () => ({ kind: 'reconcile', bankBalance: signedMoney(bank), outstandingEntryIds: outstanding, reportedClientBalances: Object.fromEntries(assignment.pack.clients.map(c => [c.id, signedMoney(reported[c.id] ?? '')])), note: reconcileNote }))}>Record three-way reconciliation</button>
        </fieldset>
        <fieldset disabled={commandBlocked}>
          <legend>Adverse case outcome</legend>
          <label>Termination reason<textarea aria-label="Termination reason" value={terminationNote} onChange={e => { setTerminationNote(e.target.value); mark('terminate'); }} />
          </label>
          <button onClick={() => { if (window.confirm('Record an irreversible adverse outcome for this fictional case? Its history will remain available.')) action('terminate', () => ({ kind: 'terminate', note: terminationNote })); }}>Terminate fictional transaction</button>
        </fieldset>
        {actionDirty && <p>Unposted transaction inputs are not evidence. Record each edited action or explicitly discard its draft before submission.</p>}
        <button disabled={busy} onClick={() => { if (window.confirm('Discard all unposted transaction action inputs? Saved events and document responses remain unchanged.')) resetEditors(); }}>Discard unposted transaction inputs</button>
        <button disabled={blocked || actionDirty || revision === null} onClick={() => void run(async g => { await service.submit(assignment.id, assignment.revision, submissionId.current, revision); if (g !== generation.current) return; const loaded = await service.load(); if (g !== generation.current) return; setLibrary(loaded); setStatus('Immutable transaction evidence submitted locally. No external transaction or academic credit was created.'); })}>Submit transaction evidence</button>
        <h3>Prior evidence and instructor feedback</h3>
        <label>Saved transaction evidence<select aria-label="Saved transaction evidence" value={history} onChange={e => setHistory(e.target.value)}>
          <option value="">Choose evidence snapshot</option>{evidence.map(s =>
            <option key={s.id} value={s.id}>{s.submittedAt} — case revision {s.caseRevision}</option>)}</select>
        </label>{selectedEvidence && <details open>
          <summary>Immutable saved transaction evidence</summary>
          <TransactionCaseView assignment={selectedEvidence.assignment} session={selectedEvidence.session} />{library?.feedback.filter(f => f.submissionId === selectedEvidence.id).map(f =>
            <p key={f.id}>{f.status} · {f.at}: {f.note}</p>)}</details>}
      </>}
    </>}
  </section>;
}
