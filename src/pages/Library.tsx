import type { AppApi } from "../App";
import * as store from "../lib/storage";
import { BankError, emptyBank, parseBank } from "../lib/validate";
import { bankCoverage } from "../lib/session";
import { percent, uid } from "../lib/util";

export default function Library({ api, broken }: { api: AppApi; broken: string[] }) {
  const { banks, progress } = api;

  async function importBank() {
    let text: string | null;
    try {
      text = await store.pickBankFile();
    } catch (e) {
      api.toast(`Couldn't open the file: ${String(e)}`);
      return;
    }
    if (text === null) return;
    try {
      let bank = parseBank(text);
      const existing = banks.find((b) => b.id === bank.id);
      if (existing) {
        const replace = await store.confirmAction(
          `"${existing.title}" is already in your library. Replace it with the imported file?\n\nChoose No to keep both.`,
        );
        if (!replace) bank = { ...bank, id: `${bank.id}-${uid()}`, title: `${bank.title} (copy)` };
      }
      await store.saveBank(bank);
      await api.reloadBanks();
      api.toast(`Imported "${bank.title}" with ${bank.questions.length} questions`);
    } catch (e) {
      api.toast(e instanceof BankError ? e.message : `Import failed: ${String(e)}`);
    }
  }

  async function newBank() {
    const bank = emptyBank();
    await store.saveBank(bank);
    await api.reloadBanks();
    api.go({ name: "editor", bankId: bank.id, isNew: true });
  }

  const lastAttempt = (bankId: string) => progress.attempts.find((a) => a.bankId === bankId && a.mode === "exam");

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Question banks</h1>
          <p className="muted">Pick a bank to take a timed exam or practice by topic.</p>
        </div>
        <div className="row">
          <button className="btn" onClick={newBank}>
            New bank
          </button>
          <button className="btn primary" onClick={importBank}>
            Import bank
          </button>
        </div>
      </div>

      {broken.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {broken.map((msg, i) => (
            <p key={i} className="notice error">
              A stored bank couldn't be read: {msg}
            </p>
          ))}
        </div>
      )}

      {banks.length === 0 ? (
        <div className="panel empty">
          <h2>No question banks yet</h2>
          <p className="muted">
            Import a bank file (.json), or start a new bank and write questions in the editor.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={newBank}>
              New bank
            </button>
            <button className="btn primary" onClick={importBank}>
              Import bank
            </button>
          </div>
        </div>
      ) : (
        <div className="bank-list">
          {banks.map((b) => {
            const cov = bankCoverage(b, progress);
            const last = lastAttempt(b.id);
            return (
              <div
                key={b.id}
                className="bank-row"
                role="button"
                tabIndex={0}
                onClick={() => api.go({ name: "bank", bankId: b.id })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    api.go({ name: "bank", bankId: b.id });
                  }
                }}
              >
                <div>
                  <h2>{b.title}</h2>
                  <div className="meta">
                    {b.questions.length} questions
                    {b.sections.length > 0 && <>, {b.sections.map((s) => s.name).join(" and ")}</>}
                  </div>
                </div>
                <div className="stat">
                  <b>{percent(cov.seen, cov.total)}%</b>
                  <span className="small muted">studied</span>
                </div>
                <div className="stat">
                  <b>{last ? `${percent(last.correct, last.total)}%` : "None"}</b>
                  <span className="small muted">last exam</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
