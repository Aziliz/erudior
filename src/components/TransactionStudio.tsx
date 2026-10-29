import { useEffect, useRef, useState } from 'react';
import type { AppApi } from '../App';
import type { DocumentTemplate } from '../lib/documentEngine';
import { emptyTransactionPack, importTransactionPack, exportTransactionPack, type TransactionPack, type TransactionLibrary } from '../lib/transactionEngine';
import { registerNavigationGuard } from '../lib/navigationGuard';
import { exportText } from '../lib/storage';
import TransactionCaseView from './TransactionCaseView';

export default function TransactionStudio({ api }: { api: AppApi ;}) {
  const service = api.transactionSupervisor;
  const [library, setLibrary] = useState<TransactionLibrary | null>(null);
  const [sources, setSources] = useState<DocumentTemplate[]>([]);
  const [pack, setPack] = useState(() => emptyTransactionPack(crypto.randomUUID()));
  const [packDirty, setPackDirty] = useState(false), [caseDirty, setCaseDirty] = useState(false), [feedbackDirty, setFeedbackDirty] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [status, setStatus] = useState(''), [reviewed, setReviewed] = useState(false);
  const [comparePack, setComparePack] = useState(''), [caseKey, setCaseKey] = useState(''), [assignedPack, setAssignedPack] = useState('');
  const [student, setStudent] = useState(''), [caseTitle, setCaseTitle] = useState(''), [instructions, setInstructions] = useState(''), [startDate, setStartDate] = useState('');
  const [submission, setSubmission] = useState(''), [comparison, setComparison] = useState(''), [feedback, setFeedback] = useState(''), [decision, setDecision] = useState<'reviewed' | 'needs_revision'>('reviewed');
  const generation = useRef(0), running = useRef(false), unsaved = useRef(false), assignmentId = useRef(crypto.randomUUID()), feedbackId = useRef(crypto.randomUUID());
  unsaved.current = packDirty || caseDirty || feedbackDirty;
  const scope = JSON.stringify({ password: api.family?.parent.password, students: api.family?.students.map(s => s.id) });
  useEffect(() => {
    const g = ++generation.current;
    setLibrary(null); setSources([]); setError(''); setStatus(''); setPack(emptyTransactionPack(crypto.randomUUID()));
    setPackDirty(false); setCaseDirty(false); setFeedbackDirty(false); setSubmission(''); setComparison(''); setCaseKey(''); setAssignedPack(''); setStudent(''); setCaseTitle(''); setInstructions(''); setFeedback('');
    Promise.all([service?.load(), api.documentSupervisor?.load()]).then(([state, docs]) => { if (g !== generation.current) return; if (state) setLibrary(state); setSources(docs?.templates ?? []); }).catch(e => { if (g === generation.current) setError(String(e)); });
    return () => { generation.current++; };
  }, [scope]);
  useEffect(() => {
    const off = registerNavigationGuard(() => !running.current && (!unsaved.current || window.confirm('Discard unsaved transaction studio changes?')));
    const before = (e: BeforeUnloadEvent) => { if (unsaved.current || running.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', before); return () => { off(); window.removeEventListener('beforeunload', before); };
  }, []);
  async function run(action: (g: number) => Promise<void>) {
    if (running.current) return; running.current = true; setBusy(true); setError(''); const g = generation.current;
    try { await action(g); } catch (e) { if (g === generation.current) setError(e instanceof Error ? e.message : String(e)); }
    finally { running.current = false; if (g === generation.current) setBusy(false); }
  }
  async function refresh(g: number) { const v = await service!.load(); if (g === generation.current) setLibrary(v); }
  const edit = (next: TransactionPack) => { setPack(next); setPackDirty(true); setReviewed(false); setStatus(''); };
  const discardPack = () => !packDirty || window.confirm('Discard unsaved rule pack changes?');
  const pending = (p: TransactionPack) => library?.pendingApproval?.includes(`${p.id}@${p.revision}`) ?? false;
  const selectedCase = library?.assignments.find(a => `${a.id}@${a.revision}` === caseKey);
  const selected = library?.submissions.find(s => s.id === submission), other = library?.submissions.find(s => s.id === comparison && s.caseId === selected?.caseId);
  const earlier = library?.packs.find(p => `${p.id}@${p.revision}` === comparePack);
  function SourceSummary({ value }: { value: TransactionPack ;}) {
    return <>
      <h4>{value.title} — revision {value.revision}</h4>
      <p>Jurisdiction identifier {value.jurisdiction.id}; {value.jurisdiction.name}; source version {value.jurisdiction.version}; effective {value.jurisdiction.effectiveFrom} through {value.jurisdiction.effectiveThrough}.</p>
      <p>{value.jurisdiction.sourceNote}</p>
      <p>Currency: {value.currency}; decimal places: {value.minorUnitDigits}.</p>
      <h5>All configured rules</h5>
      <dl>{Object.entries(value.rules).map(([k, v]) =>
        <div key={k}>
          <dt>{k}</dt>
          <dd>{String(v)}</dd>
        </div>)}</dl>
      <h5>Client ledger identities</h5>
      <ul>{value.clients.map(c =>
        <li key={c.id}>{c.name} · {c.id}</li>)}</ul>
      <h5>Contingency definitions</h5>
      <ul>{value.contingencies.map(c =>
        <li key={c.id}>{c.title} · {c.id} · {c.category} · {c.dueDays} simulated days; required: {String(c.required)}; waiver permitted: {String(c.allowWaiver)}.</li>)}</ul>
      <h5>Form roles and exact sources</h5>
      {value.documents.map(d =>
        <details key={d.id}>
          <summary>{d.title} — source revision {d.revision}</summary>
          <p>Document identifier: {d.id}. Role: {value.formRoles.find(r => r.documentId === d.id)?.role ?? 'not selected'}.</p>
          <p>Source provenance: {d.sourceNote}</p>
          <p>Source permission: {d.licenseNote}</p>
          {d.pages.map(p =>
            <section key={p.id}>
              <h5>{p.title} · page {p.id}</h5>
              <pre>{p.text}</pre>
            </section>)}
          <h5>Field definitions and constraints</h5>
          <ul>{d.fields.map(f =>
            <li key={f.id}>{f.label} · {f.id} · page {f.pageId} · type {f.kind} · required: {String(f.required)}; minimum {f.min ?? 'none'}, maximum {f.max ?? 'none'}, character limit {f.maxLength ?? 'default'}; options {f.options?.join(' / ') ?? 'none'}; overlay {f.anchor ? `left ${f.anchor.x}, top ${f.anchor.y}, width ${f.anchor.width}, height ${f.anchor.height}` : 'none'}.</li>)}</ul>
        </details>)}
    </>;
  }

  return <section className="transactions document-engine">
    <h2>Educational transaction studio</h2>
    <p>Fictional educational simulations only. Do not enter real confidential information. This is not legal or financial advice, official filing, a real transaction, or a regulatory compliance certificate.</p>
    <p>Same-device assignments and evidence. The supervising adult reviews the exact authored rules and sources; imported approval labels grant no authority.</p>
    {library?.restoredAt && <p role="status">Restored local history is not authenticated. Sources marked for review require fresh local approval before further work.</p>}
    {error && <p role="alert">{error}</p>}{status && <p role="status">{status}</p>}
    {!service ? <p>Unlock the supervising-adult area to use transaction tools.</p> : <>
      <button disabled={busy} onClick={() => void run(async g => { await refresh(g); if (g === generation.current) setStatus('Transaction library refreshed; editor drafts retained.'); })}>Refresh transaction library</button>
      <fieldset disabled={busy}>
        <legend>Reusable jurisdiction and rule pack</legend>
        <label>Saved rule pack revision<select aria-label="Saved rule pack revision" value={pack.revision ? `${pack.id}@${pack.revision}` : ''} onChange={e => { if (!discardPack()) return; const p = library?.packs.find(p => `${p.id}@${p.revision}` === e.target.value); if (p) { setPack(p); setPackDirty(false); setReviewed(false); setComparePack(''); } }}>
          <option value="">Unsaved pack</option>{library?.packs.map(p =>
            <option key={`${p.id}@${p.revision}`} value={`${p.id}@${p.revision}`}>{p.title} — revision {p.revision}{p.approval && !pending(p) ? ' (locally reviewed)' : ''}</option>)}</select>
        </label>
        <button onClick={() => { if (discardPack()) { setPack(emptyTransactionPack(crypto.randomUUID())); setPackDirty(false); setReviewed(false); setComparePack(''); } }}>New rule pack</button>
        <label>Import educational rule pack<input aria-label="Import educational rule pack" type="file" accept=".json,application/json" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file || !discardPack()) return; void run(async g => { if (file.size > 2 * 1024 * 1024) throw Error('Rule pack file is too large.'); const p = importTransactionPack(await file.text(), crypto.randomUUID()); if (g !== generation.current) return; edit(p); setStatus('Imported unapproved educational pack. Review every rule and source before assignment.'); }); }} />
        </label>
        <label>Rule pack title<input aria-label="Rule pack title" maxLength={300} value={pack.title} onChange={e => edit({ ...pack, title: e.target.value })} />
        </label>
        <div className="transaction-grid">
          {(['id', 'name', 'version', 'sourceNote', 'effectiveFrom', 'effectiveThrough'] as const).map(k =>
            <label key={k}>Jurisdiction {k}<input aria-label={`Jurisdiction ${k}`} type={k.startsWith('effective') ? 'date' : 'text'} value={pack.jurisdiction[k] ?? ''} onChange={e => edit({ ...pack, jurisdiction: { ...pack.jurisdiction, [k]: e.target.value } })} />
            </label>)}
          <label>Currency code<input aria-label="Currency code" value={pack.currency} maxLength={3} onChange={e => edit({ ...pack, currency: e.target.value.toUpperCase() })} />
          </label>
          <label>Decimal places<select aria-label="Decimal places" value={pack.minorUnitDigits} onChange={e => edit({ ...pack, minorUnitDigits: Number(e.target.value) })}>{[0, 1, 2, 3, 4].map(n =>
            <option key={n}>{n}</option>)}</select>
          </label>
        </div>
        <h3>Explicit educational rules</h3>
        {(['requireRepresentation', 'requireDocumentsForClose', 'requireReconciliationForClose', 'requireZeroTrustForArchive'] as const).map(k =>
          <label key={k}>
            <input type="checkbox" checked={pack.rules[k]} onChange={e => edit({ ...pack, rules: { ...pack.rules, [k]: e.target.checked } })} />{k}</label>)}
        <label>Minimum earnest deposit basis points<input aria-label="Minimum earnest deposit basis points" type="number" min="0" max="10000" value={pack.rules.minEarnestBasisPoints} onChange={e => edit({ ...pack, rules: { ...pack.rules, minEarnestBasisPoints: Number(e.target.value) } })} />
        </label>
        <label>Deposit deadline in simulated days<input aria-label="Deposit deadline in simulated days" type="number" min="0" max="3650" value={pack.rules.depositDueDays} onChange={e => edit({ ...pack, rules: { ...pack.rules, depositDueDays: Number(e.target.value) } })} />
        </label>
        <h3>Fictional client ledgers</h3>
        {pack.clients.map((c, i) =>
          <fieldset key={c.id}>
            <legend>Client {i + 1}</legend>
            <label>Client name<input aria-label={`Client ${i + 1} name`} value={c.name} onChange={e => edit({ ...pack, clients: pack.clients.map(x => x.id === c.id ? { ...x, name: e.target.value } : x) })} />
            </label>
            <p>Stable ledger ID: {c.id}</p>
            <button onClick={() => edit({ ...pack, clients: pack.clients.filter(x => x.id !== c.id) })}>Remove client {i + 1}</button>
          </fieldset>)}
        <button onClick={() => edit({ ...pack, clients: [...pack.clients, { id: crypto.randomUUID(), name: 'Fictional client' }] })}>Add fictional client</button>
        <h3>Contingencies and due diligence</h3>
        {pack.contingencies.map((c, i) =>
          <fieldset key={c.id}>
            <legend>Contingency {i + 1}</legend>
            <label>Contingency title<input aria-label={`Contingency ${i + 1} title`} value={c.title} onChange={e => edit({ ...pack, contingencies: pack.contingencies.map(x => x.id === c.id ? { ...x, title: e.target.value } : x) })} />
            </label>
            <label>Category<select aria-label={`Contingency ${i + 1} category`} value={c.category} onChange={e => edit({ ...pack, contingencies: pack.contingencies.map(x => x.id === c.id ? { ...x, category: e.target.value as typeof c.category } : x) })}>{['title', 'inspection', 'financing', 'other'].map(x =>
              <option key={x}>{x}</option>)}</select>
            </label>
            <label>Days after acceptance<input aria-label={`Contingency ${i + 1} days`} type="number" min="0" max="3650" value={c.dueDays} onChange={e => edit({ ...pack, contingencies: pack.contingencies.map(x => x.id === c.id ? { ...x, dueDays: Number(e.target.value) } : x) })} />
            </label>
            <label>
              <input type="checkbox" checked={c.required} onChange={e => edit({ ...pack, contingencies: pack.contingencies.map(x => x.id === c.id ? { ...x, required: e.target.checked } : x) })} />Required contingency {i + 1}</label>
            <label>
              <input type="checkbox" checked={c.allowWaiver} onChange={e => edit({ ...pack, contingencies: pack.contingencies.map(x => x.id === c.id ? { ...x, allowWaiver: e.target.checked } : x) })} />Allow educational waiver {i + 1}</label>
            <button onClick={() => edit({ ...pack, contingencies: pack.contingencies.filter(x => x.id !== c.id) })}>Remove contingency {i + 1}</button>
          </fieldset>)}
        <button onClick={() => edit({ ...pack, contingencies: [...pack.contingencies, { id: crypto.randomUUID(), title: 'Authored educational condition', category: 'other', dueDays: 7, required: true, allowWaiver: false }] })}>Add contingency</button>
        <h3>Exact document sources and form roles</h3>
        <p>Create reusable source documents in Document cases first. Selecting a source copies its exact revision; this pack still requires its own review.</p>
        {sources.map(d =>
          <label key={`${d.id}@${d.revision}`}>
            <input type="checkbox" checked={pack.documents.some(x => x.id === d.id && x.revision === d.revision)} onChange={e => { const docs = pack.documents.filter(x => x.id !== d.id); edit({ ...pack, documents: e.target.checked ? [...docs, d] : docs, formRoles: e.target.checked ? [...pack.formRoles.filter(r => r.documentId !== d.id), { documentId: d.id, role: 'other' }] : pack.formRoles.filter(r => r.documentId !== d.id) }); }} />{d.title} — document revision {d.revision}</label>)}
        {pack.documents.map(d =>
          <div key={d.id}>
            <label>Role for {d.title}<input aria-label={`Form role for ${d.title}`} value={pack.formRoles.find(r => r.documentId === d.id)?.role ?? 'other'} onChange={e => edit({ ...pack, formRoles: [...pack.formRoles.filter(r => r.documentId !== d.id), { documentId: d.id, role: e.target.value as TransactionPack['formRoles'][number]['role'] }] })} maxLength={100}/>
            </label>
            <details>
              <summary>Review exact source: {d.title}</summary>
              <p>{d.sourceNote}</p>
              <p>{d.licenseNote}</p>{d.pages.map(p =>
                <section key={p.id}>
                  <h4>{p.title}</h4>
                  <pre>{p.text}</pre>
                </section>)}</details>
            <button onClick={() => edit({ ...pack, documents: pack.documents.filter(x => x.id !== d.id), formRoles: pack.formRoles.filter(r => r.documentId !== d.id) })}>Remove source {d.title}</button>
          </div>)}
        <button onClick={() => void run(async g => { const saved = await service.savePack(pack, pack.revision || null); if (g !== generation.current) return; setPack(saved); setPackDirty(false); setReviewed(false); await refresh(g); if (g === generation.current) setStatus('Rule pack revision saved. Review its exact rules and sources before approval.'); })}>Save rule pack revision</button>
        <button onClick={() => void run(async () => { await exportText(exportTransactionPack(pack), 'educational-rule-pack.json', 'Export educational rule pack', 'json'); })}>Export educational rule pack</button>
        <label>Compare saved rule pack<select aria-label="Compare saved rule pack" value={comparePack} onChange={e => setComparePack(e.target.value)}>
          <option value="">Choose saved revision</option>{library?.packs.filter(p => p.id === pack.id && p.revision !== pack.revision).map(p =>
            <option key={p.revision} value={`${p.id}@${p.revision}`}>Revision {p.revision}</option>)}</select>
        </label>
        {earlier && <div className="transaction-compare">
          <article>
            <h3>Selected saved source</h3>
            <SourceSummary value={earlier} />
          </article>
          <article>
            <h3>Current editor source</h3>
            <SourceSummary value={pack} />
          </article>
        </div>}
        <details>
          <summary>Review complete current rule pack snapshot</summary>
          <SourceSummary value={pack} />
        </details>
        <label>
          <input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />I reviewed this exact saved educational rule pack, dates, document sources and permissions.</label>
        <button disabled={packDirty || !pack.revision || !reviewed || !!pack.approval && !pending(pack)} onClick={() => void run(async g => { const p = await service.approvePack(pack.id, pack.revision); if (g !== generation.current) return; setPack(p); await refresh(g); if (g === generation.current) setStatus('Exact educational rule pack approved locally.'); })}>Approve exact rule pack</button>
      </fieldset>
      <fieldset disabled={busy}>
        <legend>Assign or revise a transaction case</legend>
        <label>Existing transaction case<select aria-label="Existing transaction case" value={caseKey} onChange={e => { if (caseDirty && !window.confirm('Discard unsaved transaction assignment?')) return; setCaseDirty(false); setCaseKey(e.target.value); const a = library?.assignments.find(a => `${a.id}@${a.revision}` === e.target.value); setStudent(a?.studentId ?? ''); setCaseTitle(a?.title ?? ''); setInstructions(a?.instructions ?? ''); setStartDate(a?.startDate ?? ''); setAssignedPack(a ? `${a.pack.id}@${a.pack.revision}` : ''); if (!a) assignmentId.current = crypto.randomUUID(); }}>
          <option value="">New transaction case</option>{library?.assignments.filter(a => !library.assignments.some(b => b.id === a.id && b.revision > a.revision)).map(a =>
            <option key={a.id} value={`${a.id}@${a.revision}`}>{a.title} — revision {a.revision}</option>)}</select>
        </label>
        <label>Transaction learner<select aria-label="Transaction learner" disabled={!!selectedCase} value={student} onChange={e => { setStudent(e.target.value); setCaseDirty(true); }}>
          <option value="">Choose learner</option>{api.family?.students.map(s =>
            <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        </label>
        <label>Assigned rule pack<select aria-label="Assigned rule pack" value={assignedPack} onChange={e => { setAssignedPack(e.target.value); setCaseDirty(true); }}>
          <option value="">Choose locally reviewed pack</option>{library?.packs.filter(p => p.approval && !pending(p)).map(p =>
            <option key={`${p.id}@${p.revision}`} value={`${p.id}@${p.revision}`}>{p.title} — revision {p.revision}</option>)}</select>
        </label>
        <label>Transaction case title<input aria-label="Transaction case title" value={caseTitle} onChange={e => { setCaseTitle(e.target.value); setCaseDirty(true); }} />
        </label>
        <label>Transaction instructions<textarea aria-label="Transaction instructions" value={instructions} onChange={e => { setInstructions(e.target.value); setCaseDirty(true); }} />
        </label>
        <label>Simulated start date<input aria-label="Simulated start date" type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setCaseDirty(true); }} />
        </label>
        <button disabled={!student || !assignedPack} onClick={() => void run(async g => { const p = library!.packs.find(p => `${p.id}@${p.revision}` === assignedPack)!; const a = await service.assign({ id: selectedCase?.id ?? assignmentId.current, studentId: student, title: caseTitle, instructions, startDate, pack: p }, selectedCase?.revision ?? null); if (g !== generation.current) return; await refresh(g); if (g !== generation.current) return; setCaseKey(`${a.id}@${a.revision}`); setCaseDirty(false); setStatus('Transaction assigned with exact reviewed rules and source snapshots.'); })}>{selectedCase ? 'Assign revised transaction case' : 'Assign transaction case'}</button>
      </fieldset>
      <fieldset disabled={busy}>
        <legend>Immutable transaction evidence and feedback</legend>
        <label>Transaction submission<select aria-label="Transaction submission" value={submission} onChange={e => { if (feedbackDirty && !window.confirm('Discard unsaved transaction feedback?')) return; setSubmission(e.target.value); setComparison(''); setFeedback(''); setFeedbackDirty(false); feedbackId.current = crypto.randomUUID(); }}>
          <option value="">Choose evidence</option>{library?.submissions.map(s =>
            <option key={s.id} value={s.id}>{api.family?.students.find(x => x.id === s.studentId)?.name ?? 'Learner'} — {s.assignment.title} — {s.submittedAt}</option>)}</select>
        </label>
        {selected && <>
          <label>Compare transaction evidence<select aria-label="Compare transaction evidence" value={comparison} onChange={e => setComparison(e.target.value)}>
            <option value="">No comparison</option>{library?.submissions.filter(s => s.caseId === selected.caseId && s.id !== selected.id).map(s =>
              <option key={s.id} value={s.id}>{s.submittedAt} — case revision {s.caseRevision}</option>)}</select>
          </label>
          <div className={other ? 'transaction-compare' : ''}>{[selected, ...(other ? [other] : [])].map((s, i) =>
            <article key={s.id}>
              <h3>{i ? 'Comparison' : 'Selected'} transaction evidence</h3>
              <p>{s.submittedAt} · case revision {s.caseRevision}</p>
              <TransactionCaseView assignment={s.assignment} session={s.session} />
              <h4>Instructor feedback</h4>{library?.feedback.filter(r => r.submissionId === s.id).map(r =>
                <p key={r.id}>{r.status} · {r.at}: {r.note}</p>)}</article>)}</div>
          <label>Transaction feedback decision<select aria-label="Transaction feedback decision" value={decision} onChange={e => { setDecision(e.target.value as typeof decision); setFeedbackDirty(true); feedbackId.current = crypto.randomUUID(); }}>
            <option value="reviewed">Reviewed</option>
            <option value="needs_revision">Needs revision</option>
          </select>
          </label>
          <label>Transaction instructor feedback<textarea aria-label="Transaction instructor feedback" value={feedback} onChange={e => { setFeedback(e.target.value); setFeedbackDirty(true); feedbackId.current = crypto.randomUUID(); }} />
          </label>
          <button disabled={!feedback.trim()} onClick={() => void run(async g => { await service.review({ id: feedbackId.current, submissionId: selected.id, status: decision, note: feedback }); if (g !== generation.current) return; await refresh(g); if (g !== generation.current) return; setFeedback(''); setFeedbackDirty(false); feedbackId.current = crypto.randomUUID(); setStatus('Transaction feedback appended without changing evidence.'); })}>Append transaction feedback</button>
          <button onClick={() => void run(async () => { if (!window.confirm('Export this private educational transaction evidence and feedback? Share only with an authorized recipient.')) return; await exportText(JSON.stringify({ format: 'erudior-transaction-evidence-export', version: 1, notice: 'Unauthenticated local educational record; not an official transaction or signed classroom hand-in.', submission: selected, feedback: library?.feedback.filter(r => r.submissionId === selected.id) }, null, 2), 'educational-transaction-evidence.json', 'Export educational evidence', 'json'); })}>Export transaction evidence copy</button>
        </>}
      </fieldset>
    </>}
  </section>;
}
