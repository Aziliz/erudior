import { replayTransaction, formatMinorUnits, transactionDocumentAssignment, type TransactionAssignment, type TransactionSession } from '../lib/transactionEngine';
import type { DocumentResponse } from '../lib/documentEngine';
import DocumentCaseView from './DocumentCaseView';

export default function TransactionCaseView({ assignment, session, onResponse, onPending, disabled = false }: { assignment: TransactionAssignment; session: TransactionSession; onResponse?: (r: DocumentResponse) => void; onPending?: (p: boolean) => void; disabled?: boolean ;}) {
  const state = replayTransaction(assignment, session.events);
  const money = (n: number) => `${formatMinorUnits(n, assignment.pack.minorUnitDigits)} ${assignment.pack.currency}`;
  return <section className="transaction-evidence">
    <div className="transaction-summary">
      <h3>Case state: {state.stage}</h3>
      <p>Simulated date: {state.date}. Outcome: {state.outcome}. Saved session revision: {session.revision}.</p>
      <p>{assignment.pack.jurisdiction.name} · source version {assignment.pack.jurisdiction.version} · pack revision {assignment.pack.revision}</p>
      <p>Configured educational rules, not verified current law or a real transaction.</p>
    </div>
    <details>
      <summary>Reviewed rule and source snapshot</summary>
      <p>{assignment.pack.jurisdiction.sourceNote}</p>
      <p>Authored effective dates: {assignment.pack.jurisdiction.effectiveFrom} through {assignment.pack.jurisdiction.effectiveThrough}.</p>
      <dl>{Object.entries(assignment.pack.rules).map(([k, v]) =>
        <div key={k}>
          <dt>{k}</dt>
          <dd>{String(v)}</dd>
        </div>)}</dl>
      <ul>{assignment.pack.formRoles.map(r =>
        <li key={r.documentId}>{assignment.pack.documents.find(d => d.id === r.documentId)?.title}: {r.role}</li>)}</ul>
    </details>
    <h3>Offer and counteroffer history</h3>
    {state.offers.length === 0 ? <p>No offer has been recorded.</p> : <div className="transaction-table" tabIndex={0} aria-label="Scrollable offer history">
      <table>
        <thead>
          <tr>
            <th>Offer</th>
            <th>Party / lineage</th>
            <th>Terms</th>
            <th>Dates</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{state.offers.map(o =>
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.party}{o.parentOfferId && <p>Counter to {o.parentOfferId}</p>}</td>
            <td>Price {money(o.price)}<br />Earnest {money(o.earnest)}<p>{o.note}</p>
            </td>
            <td>Expires {o.expiresOn}<br />Closes {o.closingDate}</td>
            <td>{o.status}</td>
          </tr>)}</tbody>
      </table>
    </div>}
    <h3>Title, inspection and financing conditions</h3>
    <ul>{assignment.pack.contingencies.map(c =>
      <li key={c.id}>{c.title} ({c.category}) — {state.contingencies[c.id] ?? 'unresolved'}; {c.dueDays} simulated days after acceptance; {c.required ? 'required' : 'optional'}; {c.allowWaiver ? 'authored waiver permitted' : 'waiver not permitted'}.</li>)}</ul>
    <h3>Client trust ledgers</h3>
    <ul>{assignment.pack.clients.map(c =>
      <li key={c.id}>{c.name}: {money(state.clientBalances[c.id] ?? 0)}</li>)}</ul>
    <p>Cash register balance: {money(state.cashRegister)}</p>
    <div className="transaction-table" tabIndex={0} aria-label="Scrollable trust register">
      <table>
        <thead>
          <tr>
            <th>Date / entry</th>
            <th>Client</th>
            <th>Signed amount</th>
            <th>Reference / correction</th>
          </tr>
        </thead>
        <tbody>{state.entries.map(e =>
          <tr key={e.id}>
            <td>{e.date}<br />{e.id}</td>
            <td>{assignment.pack.clients.find(c => c.id === e.clientId)?.name ?? e.clientId}</td>
            <td>{money(e.amount)}</td>
            <td>{e.reference}{e.reversalOf && <p>Reverses {e.reversalOf}</p>}<p>{e.note}</p>
            </td>
          </tr>)}</tbody>
      </table>
    </div>
    <h3>Three-way reconciliation</h3>{state.reconciliation ? <>
      <p>Statement balance: {money(state.reconciliation.bankBalance)}. Adjusted bank: {money(state.reconciliation.adjustedBank)}. Cash register: {money(state.reconciliation.cashRegister)}. Reported client-ledger total: {money(state.reconciliation.clientLedgerTotal)}.</p>
      <p>Statement comparison date {state.reconciliation.date}; {state.reconciliation.entryCount} register entries at this snapshot.</p>
      <p>Outstanding entries: {state.reconciliation.outstandingEntryIds.join(', ') || 'none'}.</p>{state.reconciliation.issues.length ? <ul>{state.reconciliation.issues.map((x, i) =>
        <li key={i}>{x}</li>)}</ul> : <p>All three balances match the configured educational records.</p>}</> : <p>No reconciliation recorded.</p>}
    <h3>Educational audit findings</h3>{state.auditFindings.length ? <ul>{state.auditFindings.map((x, i) =>
      <li key={i}>{x}</li>)}</ul> : <p>No current consistency finding. This is not a compliance determination.</p>}
    <details>
      <summary>Persistent event history ({session.events.length})</summary>
      <ol>{session.events.map(e =>
        <li key={e.id}>
          <strong>{e.command.kind}</strong> · {e.at}<dl>{Object.entries(e.command).filter(([k]) => k !== 'kind').map(([k, v]) =>
            <div key={k}>
              <dt>{k}</dt>
              <dd>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
            </div>)}</dl>
        </li>)}</ol>
    </details>
    <h3>Exact source document responses</h3>
    <DocumentCaseView key={`${assignment.id}@${assignment.revision}`} assignment={transactionDocumentAssignment(assignment)} response={session.response} onChange={onResponse} onPending={onPending} disabled={disabled} />
  </section>;
}
