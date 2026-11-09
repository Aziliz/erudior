import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  discardPreparedBackup,
  FamilyRestoreError,
  MAX_ENCRYPTED_BACKUP_BYTES,
  restorePreparedBackup,
  verifyEncryptedBackup,
  type PreparedFamilyRestore,
} from "../lib/backup";
import { assertLocalAdult, localSessionEpoch } from "../lib/localSession";
import { createNativeLifecycleConsumer } from "../lib/nativeLifecycle";
import type { Bank, Course } from "../lib/types";

/** This seam replaces IO only in deterministic component tests. The application uses
 * the real, read-only preflight and single-use prepared restore implementation. */
export interface FamilyBackupRecoveryService {
  verify: typeof verifyEncryptedBackup;
  restore: typeof restorePreparedBackup;
  discard: typeof discardPreparedBackup;
}
const productionService: FamilyBackupRecoveryService = {
  verify: verifyEncryptedBackup,
  restore: restorePreparedBackup,
  discard: discardPreparedBackup,
};
type Stage = "idle" | "authorizing" | "input" | "verifying" | "verified" | "review" | "restoring";
type Terminal = { kind: "pending" | "partial" | "complete"; message: string };
const interrupted = "Restore did not finish; some files may already have changed. Reload saved Family before explicitly verifying and restoring again. This review cannot be retried.";
const reloadApplication = () => window.location.reload();

export default function FamilyBackupRecovery({
  reauthenticateAdult, current, contextKey, service = productionService,
  onRestored = reloadApplication, onReload = reloadApplication,
}: {
  reauthenticateAdult?: () => Promise<(() => void) | null>;
  current: { courses: Course[]; banks: Bank[] };
  /** Changes of family, active profile or credentials invalidate private review state. */
  contextKey: string;
  service?: FamilyBackupRecoveryService;
  onRestored?: () => void;
  onReload?: () => void;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [passphrase, setPassphrase] = useState("");
  const [filename, setFilename] = useState("");
  const [prepared, setPrepared] = useState<PreparedFamilyRestore | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const mounted = useRef(false), epoch = useRef(0), busy = useRef(false);
  const authorizing = useRef(false), restoring = useRef(false);
  const authority = useRef<(() => void) | null>(null);
  const authorizedSession = useRef<number | null>(null);
  const file = useRef<File | null>(null), input = useRef<HTMLInputElement>(null);
  const privatePassphrase = useRef(""), privatePrepared = useRef<PreparedFamilyRestore | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const preparedService = useRef<FamilyBackupRecoveryService | null>(null);
  const latest = useRef({ current, contextKey, service });
  latest.current = { current, contextKey, service };
  const renderedSession = localSessionEpoch();
  const heading = useRef<HTMLHeadingElement>(null), startButton = useRef<HTMLButtonElement>(null);

  function clearPrivate(note = "", update = true) {
    ++epoch.current;
    authority.current = null; authorizedSession.current = null;
    privatePassphrase.current = "";
    file.current = null;
    if (input.current) input.current.value = "";
    if (privatePrepared.current) (preparedService.current ?? latest.current.service).discard(privatePrepared.current);
    privatePrepared.current = null; preparedService.current = null;
    if (!restoring.current) busy.current = false;
    if (update && mounted.current) {
      setPassphrase(""); setFilename(""); setPrepared(null); setAcknowledged(false);
      setStage(restoring.current ? "restoring" : "idle"); setError(""); setMessage(note);
    }
  }

  useLayoutEffect(() => {
    // Reauthentication intentionally changes the session before any private inputs exist.
    // Every later epoch change, including away-and-back, invalidates the review.
    if (!authorizing.current && authorizedSession.current !== null && authorizedSession.current !== renderedSession) clearPrivate();
  }, [renderedSession]);
  useLayoutEffect(() => { clearPrivate(); }, [contextKey, service]);
  useEffect(() => {
    mounted.current = true;
    const conceal = () => clearPrivate("Private backup inputs and review cleared. Authenticate and verify again.");
    const visibility = () => { if (document.hidden) conceal(); };
    const blur = () => {
      // A file picker may blur the window before a file is selected. It has no
      // decrypted data to clear; once a passphrase or review exists, blur clears it.
      if (privatePassphrase.current || privatePrepared.current || restoring.current || busy.current && !authorizing.current) conceal();
    };
    const consumeNativeLifecycle = createNativeLifecycleConsumer();
    const nativeLifecycle = (event: Event) => {
      // App owns the native delivery acknowledgement. This listener only revokes
      // private review state, including pauses without a DOM visibility event.
      consumeNativeLifecycle((event as CustomEvent).detail, { conceal, lock: conceal, reveal: () => {} }, work => work());
    };
    window.addEventListener("erudior-native-lifecycle", nativeLifecycle);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", conceal);
    window.addEventListener("blur", blur);
    const timer = window.setInterval(() => {
      if (!authority.current || authorizing.current) return;
      try { authority.current(); assertLocalAdult(); }
      catch { conceal(); }
    }, 250);
    return () => {
      mounted.current = false;
      clearPrivate("", false);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", conceal);
      window.removeEventListener("erudior-native-lifecycle", nativeLifecycle);
      window.removeEventListener("blur", blur);
    };
  }, []);
  useEffect(() => {
    if (stage === "verified" || stage === "review") heading.current?.focus();
    if (stage === "input") input.current?.focus();
    if (stage === "idle" && message) startButton.current?.focus();
  }, [stage]);

  function guardFor(operation: number, context: string, authorize: () => void) {
    return () => {
      if (!mounted.current || epoch.current !== operation || latest.current.contextKey !== context || document.hidden)
        throw Error("Backup review changed or was hidden. Authenticate and verify again.");
      authorize(); assertLocalAdult();
    };
  }
  async function begin() {
    if (busy.current || terminalRef.current) return;
    clearPrivate();
    const operation = epoch.current, context = latest.current.contextKey;
    busy.current = true; authorizing.current = true; setStage("authorizing");
    try {
      if (!reauthenticateAdult) throw Error("Reopen the app to authenticate this sensitive action.");
      const authorize = await reauthenticateAdult();
      if (!mounted.current || operation !== epoch.current || context !== latest.current.contextKey) return;
      if (!authorize) { clearPrivate("Authentication canceled. No backup was opened."); return; }
      const guard = guardFor(operation, context, authorize); guard();
      authority.current = guard; authorizedSession.current = localSessionEpoch();
      setStage("input"); setMessage("Choose the encrypted file first, then enter its backup passphrase. Verification does not restore or change local data.");
    } catch (failure) {
      if (mounted.current && operation === epoch.current) { clearPrivate(); setError(failure instanceof Error ? failure.message : "Authentication could not finish."); }
    } finally {
      authorizing.current = false;
      if (operation === epoch.current) busy.current = false;
    }
  }
  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (busy.current || terminalRef.current || !file.current || !privatePassphrase.current || !authority.current) return;
    const operation = epoch.current, authorize = authority.current, selected = file.current;
    const io = latest.current.service;
    busy.current = true; setStage("verifying"); setError(""); setMessage("Checking the encrypted backup. Local data is unchanged.");
    let result: PreparedFamilyRestore | null = null;
    try {
      authorize();
      if (selected.size > MAX_ENCRYPTED_BACKUP_BYTES) throw Error(`The encrypted backup exceeds the ${Math.floor(MAX_ENCRYPTED_BACKUP_BYTES / 1024 / 1024)} MiB limit. Choose a smaller supported backup.`);
      const raw = await selected.text();
      authorize();
      const password = privatePassphrase.current;
      privatePassphrase.current = ""; setPassphrase("");
      result = await io.verify(raw, password, latest.current.current, authorize);
      authorize();
      privatePrepared.current = result; preparedService.current = io;
      setPrepared(result); file.current = null; if (input.current) input.current.value = "";
      setFilename(""); setStage("verified"); setMessage("Verification completed. Nothing was restored or written to local learning data.");
    } catch (failure) {
      if (result && result !== privatePrepared.current) io.discard(result);
      if (mounted.current && operation === epoch.current) {
        clearPrivate();
        setError(failure instanceof Error ? failure.message : "The backup could not be verified.");
      }
    } finally { if (operation === epoch.current) busy.current = false; }
  }
  function reviewRestore() {
    if (busy.current || !privatePrepared.current || !authority.current) return;
    try { authority.current(); setAcknowledged(false); setStage("review"); }
    catch (failure) { clearPrivate(); setError((failure as Error).message); }
  }
  async function restore(event: React.FormEvent) {
    event.preventDefault();
    if (busy.current || terminalRef.current || !acknowledged || stage !== "review" || !privatePrepared.current || !authority.current) return;
    const operation = epoch.current, selected = privatePrepared.current, authorize = authority.current, io = latest.current.service;
    busy.current = true;
    try { authorize(); }
    catch (failure) { busy.current = false; clearPrivate(); setError((failure as Error).message); return; }
    restoring.current = true;
    // Until the backend proves a failure was before writing, never offer a retry.
    terminalRef.current = { kind: "pending", message: interrupted };
    setTerminal(terminalRef.current); setStage("restoring"); setError(""); setMessage("Restoring the exact verified backup. Keep this window open.");
    setPrepared(null); setAcknowledged(false);
    try {
      await io.restore(selected, latest.current.current, authorize);
      terminalRef.current = { kind: "complete", message: "Backup restored locally. Reload Family to read the saved data and authenticate again. Parent course reviews, classroom releases and server consent must be checked again." };
      if (mounted.current) { setTerminal(terminalRef.current); setMessage(""); }
      if (mounted.current && operation === epoch.current) {
        try { onRestored(); }
        catch { setMessage("Backup restored. Use Reload saved Family to reopen the saved data."); }
      }
    } catch (failure) {
      const partial = !(failure instanceof FamilyRestoreError) || failure.partial;
      if (partial) {
        terminalRef.current = { kind: "partial", message: interrupted };
        if (mounted.current) { setTerminal(terminalRef.current); setError(interrupted); setMessage(""); }
      } else {
        terminalRef.current = null;
        if (mounted.current) { setTerminal(null); setError(`${(failure as Error).message} No restore writes were started. Verify again before restoring.`); setMessage(""); }
      }
    } finally {
      io.discard(selected);
      privatePrepared.current = null; preparedService.current = null; authority.current = null; authorizedSession.current = null; restoring.current = false; busy.current = false;
      ++epoch.current;
      if (mounted.current) { setStage("idle"); setPrepared(null); setPassphrase(""); setFilename(""); }

    }
  }

  return <section className="family-backup-recovery" aria-label="Encrypted Family backup recovery" style={{ marginTop: 24, minWidth: 0, overflowWrap: "anywhere" }}>
    <h3>Verify or restore a backup</h3>
    <p className="small muted">Practice opening your backup without changing this computer. A verified backup can then be reviewed for an explicit local restore. Your passphrase and decrypted review stay in memory only.</p>
    {stage === "idle" && !terminal && <button ref={startButton} type="button" className="btn" onClick={begin}>Verify an encrypted backup</button>}
    {stage === "authorizing" && <p role="status">Authenticate with the supervising adult to open a private backup.</p>}
    {(stage === "input" || stage === "verifying") && <form onSubmit={verify} aria-label="Verify encrypted Family backup">
      <label className="field" style={{ minWidth: 0 }}><span>Encrypted Family backup file</span><input ref={input} aria-label="Encrypted Family backup file" className="input" style={{ maxWidth: "100%", minWidth: 0 }} type="file" accept=".json,application/json" disabled={stage === "verifying"} onClick={() => { privatePassphrase.current = ""; setPassphrase(""); }} onChange={event => {
        if (busy.current || !authority.current) return;
        try { authority.current(); } catch { clearPrivate("Authenticate again before choosing a backup."); return; }
        file.current = event.target.files?.[0] ?? null; setFilename(file.current?.name ?? "");
        privatePassphrase.current = ""; setPassphrase(""); setError("");
      }} /></label>
      {filename && <p className="small">Selected file: {filename}</p>}
      <label className="field"><span>Backup passphrase to verify</span><input className="input" aria-label="Backup passphrase to verify" type="password" autoComplete="off" value={passphrase} disabled={stage === "verifying"} onChange={event => { privatePassphrase.current = event.target.value; setPassphrase(event.target.value); }} /></label>
      <div className="row" style={{ flexWrap: "wrap", marginTop: 12 }}><button className="btn primary" type="submit" disabled={stage === "verifying" || !filename || !passphrase}>Verify selected backup</button><button className="btn" type="button" onClick={() => clearPrivate("Verification canceled. No local learning data was changed.")}>Cancel verification</button></div>
    </form>}
    {prepared && (stage === "verified" || stage === "review") && <section aria-label="Verified Family backup" style={{ marginTop: 16 }}>
      <h4 ref={heading} tabIndex={-1}>{stage === "review" ? "Review restore before replacing data" : "Backup verified"}</h4>
      <p className="small">{prepared.createdAt ? `Backup created: ${prepared.createdAt}` : "Backup creation date is unavailable."} Verification checks that this encrypted file opens and can be read. It is not proof that every original attachment was included.</p>
      <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))", gap: 12 }}>
        {([['Learners', prepared.inventory.students], ['Courses', prepared.inventory.courses], ['Question banks', prepared.inventory.banks], ['Record entries', prepared.inventory.records], ['Photos', prepared.inventory.photos], ['Attached files', prepared.inventory.files], ['Missing referenced files', prepared.inventory.missingFiles]] as const).map(([label, count]) => <div key={label}><dt>{label}</dt><dd style={{ marginLeft: 0 }}><strong>{count}</strong></dd></div>)}
      </dl>
      <h5>What would be replaced on this computer</h5>
      <ul className="small">
        <li>Learners: {prepared.currentInventory.students} currently, {prepared.inventory.students} in backup. {prepared.changes.studentsAdded} added; {prepared.changes.studentsRemoved} no longer listed.</li>
        <li>Courses: {prepared.currentInventory.courses} currently, {prepared.inventory.courses} in backup. {prepared.changes.coursesAdded} added; {prepared.changes.coursesRemoved} removed.</li>
        <li>Question banks: {prepared.currentInventory.banks} currently, {prepared.inventory.banks} in backup. {prepared.changes.banksAdded} added; {prepared.changes.banksRemoved} removed.</li>
      </ul>
      <p className="small">Matching learners, courses and banks are replaced from the backup, even when these counts are unchanged. Family settings, saved progress and records are also replaced. This is not an exact comparison of each answer or record.</p>
      {!!prepared.inventory.studentNames.length && <p className="small"><strong>Learners in backup: </strong>{prepared.inventory.studentNames.join(", ")}</p>}
      {!!prepared.inventory.courseTitles.length && <p className="small"><strong>Courses in backup: </strong>{prepared.inventory.courseTitles.join(", ")}</p>}
      {!!prepared.inventory.libraries.length && <p className="small"><strong>Included local libraries: </strong>{prepared.inventory.libraries.join(", ")}</p>}
      {prepared.inventory.truncated && <p className="small">Long name and title lists are shortened here. The counts cover the full verified backup.</p>}
      <div className="notice" aria-label="Restore warnings"><h5>Before restoring</h5><ul className="small">{prepared.warnings.map((warning, index) => <li key={index}>{warning}</li>)}<li>Restore writes multiple files. If it is interrupted, some files may already have changed; it is not an all-or-nothing transaction.</li><li>Keep a separate encrypted backup of current data if you may need to return to it. No automatic rollback copy is made.</li></ul></div>
      <details className="small"><summary>Verified file fingerprint</summary><p>{prepared.digest}</p><p>This SHA-256 fingerprint identifies the exact decrypted backup reviewed here. Restore cannot switch to a different file.</p></details>
      {stage === "verified" ? <div className="row" style={{ flexWrap: "wrap", marginTop: 16 }}>
        <button className="btn primary" type="button" onClick={() => { clearPrivate("Backup verification finished without restoring. Your recovery drill succeeded; local learning data is unchanged and the private review was cleared."); startButton.current?.focus(); }}>Finish verification without restoring</button>
        <button className="btn" type="button" onClick={reviewRestore}>Review restore</button>
        <button className="btn ghost" type="button" onClick={() => clearPrivate("Verification canceled. The private review was cleared; no local learning data was changed.")}>Cancel verification</button>
      </div> : <form onSubmit={restore} aria-label="Confirm local Family restore" style={{ marginTop: 16 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><input type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /><span>I understand this replaces local Family data</span></label>
        <p className="small">Restore only if these are the learners, courses and records you intended. Restored parent course reviews, classroom releases and server consent do not regain their old authority. Check the warnings above for the specific review resets.</p>
        <div className="row" style={{ flexWrap: "wrap" }}><button className="btn primary" type="submit" disabled={!acknowledged}>Restore this verified backup</button><button className="btn" type="button" onClick={() => { setAcknowledged(false); setStage("verified"); }}>Cancel restore review</button><button className="btn ghost" type="button" onClick={() => clearPrivate("Restore canceled. The private review was cleared; no local learning data was changed.")}>Discard verified backup</button></div>
      </form>}
    </section>}
    {message && <p className="notice" role="status">{message}</p>}
    {error && <p className="notice error" role="alert">{error}</p>}
    {terminal && stage !== "restoring" && <div className="notice" aria-label="Restore outcome">{!error && <p role="status">{terminal.message}</p>}<button className="btn" type="button" onClick={onReload}>Reload saved Family</button></div>}
  </section>;
}
