import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import { adultLabel, isClassroom, lockedFor, passwordProblem, resetWithRecovery, unlockParent, type Family } from "../lib/family";

/** Password (or PIN, if the parent turned it on) before the parent area opens. */
export default function ParentGate({ api, family, onUnlock }: { api: AppApi; family: Family; onUnlock: (family: Family) => void }) {
  const hasPin = !!family.parent.pin;
  const [kind, setKind] = useState<"password" | "pin">(hasPin ? "pin" : "password");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [now, setNow] = useState(Date.now());
  const input = useRef<HTMLInputElement>(null);
  const working = useRef(false), alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const wait = lockedFor(family, now);

  useEffect(() => {
    if (!wait) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [wait]);

  useEffect(() => input.current?.focus(), [kind, forgot]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value || busy || wait) return;
    if (working.current) return;
    working.current = true; setBusy(true); setMsg("");
    try {
      const { ok, family: next } = await unlockParent(family, kind, value);
      if (!alive.current) return;
      await api.setFamily(next);
      if (!alive.current) return;
      setValue(""); setNow(Date.now());
      if (ok) { onUnlock(next); return; }
      const left = lockedFor(next);
      setMsg(left ? `Too many wrong tries. Try again in ${Math.ceil(left / 60000)} minute${left > 60000 ? "s" : ""}.` : `That ${kind === "pin" ? "PIN" : "password"} isn't right.`);
    } catch (error) { if (alive.current) setMsg(`${(error as Error).message} Reload saved Family before trying again.`); }
    finally { working.current = false; if (alive.current) setBusy(false); }
  }

  if (forgot) return <Recovery api={api} family={family} onBack={() => setForgot(false)} onUnlock={onUnlock} />;

  return (
    <form className="page narrow-page" onSubmit={submit}>
      <h1>{adultLabel(family)} area</h1>
      <p className="muted">{isClassroom(family) ? "Classes, assignments, grades, hand-ins and settings." : "Attendance, hours, course assignments and settings."}</p>
      <label className="field" style={{ maxWidth: 360, marginTop: 16 }}>
        <span>{kind === "pin" ? "PIN" : `${adultLabel(family)} password`}</span>
        <input
          ref={input}
          className="input"
          type="password"
          inputMode={kind === "pin" ? "numeric" : undefined}
          autoComplete="current-password"
          value={value}
          disabled={busy || wait > 0}
          onChange={(e) => setValue(kind === "pin" ? e.target.value.replace(/\D/g, "") : e.target.value)}
          aria-describedby="gate-msg"
        />
      </label>
      <p id="gate-msg" className={msg ? "notice error" : "sr-only"} role="alert" style={{ marginTop: 12, maxWidth: 480 }}>
        {wait ? `Locked for ${Math.ceil(wait / 1000)} more seconds.` : msg}
      </p>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn primary" type="submit" disabled={busy || wait > 0}>
          {busy ? "Checking…" : "Open"}
        </button>
        {hasPin && (
          <button type="button" className="btn ghost" disabled={busy} onClick={() => (setKind(kind === "pin" ? "password" : "pin"), setMsg(""))}>
            Use {kind === "pin" ? "password" : "PIN"} instead
          </button>
        )}
        <button type="button" className="btn ghost" disabled={busy} onClick={() => api.go({ name: api.student ? "library" : "who" })}>
          Cancel
        </button>
      </div>
      {msg && <button type="button" className="btn" disabled={busy} onClick={async () => {
        if (working.current) return; working.current=true; setBusy(true);
        try { if (!api.reloadClassroomState) throw Error("Reload is unavailable. Reopen the app."); await api.reloadClassroomState(); if(alive.current){setValue("");setMsg("");setNow(Date.now());} }
        catch(e){if(alive.current)setMsg((e as Error).message);} finally{working.current=false;if(alive.current)setBusy(false);}
      }}>Reload saved Family</button>}
      <button type="button" className="linkish small" disabled={busy} style={{ marginTop: 20 }} onClick={() => setForgot(true)}>
        Forgot the password?
      </button>
    </form>
  );
}

function Recovery({ api, family, onBack, onUnlock }: { api: AppApi; family: Family; onBack: () => void; onUnlock: (family: Family) => void }) {
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [newCode, setNewCode] = useState("");
  const recoveredFamily = useRef<Family | null>(null);
  const [busy,setBusy]=useState(false);
  const working=useRef(false),alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if(working.current)return;
    const p = passwordProblem(pw);
    if (p) return setMsg(p);
    working.current=true;setBusy(true);setMsg("");
    try {
      const r = await resetWithRecovery(family, code, pw);
      if(!alive.current)return;
      if (!r) { setMsg("That recovery code isn't right."); return; }
      await api.setFamily(r.family);
      if(alive.current){recoveredFamily.current = r.family;setNewCode(r.recoveryCode);setCode("");setPw("");}
    } catch(e){if(alive.current)setMsg(`${(e as Error).message} Reload saved Family before retrying recovery.`);}
    finally{working.current=false;if(alive.current)setBusy(false);}
  }

  if (newCode)
    return (
      <div className="page narrow-page">
        <h1>Password changed</h1>
        <p>Your old recovery code no longer works. Here's the new one; write it down. The PIN was turned off; you can set a new one in Settings.</p>
        <p className="recovery-code">{newCode}</p>
        <button className="btn primary" onClick={() => onUnlock(recoveredFamily.current ?? family)}>
          Open the area
        </button>
      </div>
    );

  return (
    <form className="page narrow-page" onSubmit={submit}>
      <h1>Reset the password</h1>
      <p className="muted">Use the recovery code shown when homeschool was set up.</p>
      <div className="form-grid" style={{ marginTop: 16 }}>
        <label className="field">
          <span>Recovery code</span>
          <input className="input" disabled={busy} autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <label className="field">
          <span>New password (8 characters or more)</span>
          <input className="input" disabled={busy} type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
      </div>
      <p className={msg ? "notice error" : "sr-only"} role="alert" style={{ marginTop: 12 }}>
        {msg}
      </p>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn primary" type="submit" disabled={busy}>
          Reset password
        </button>
        {msg && <button type="button" className="btn" disabled={busy} onClick={async()=>{
          if(working.current)return;working.current=true;setBusy(true);
          try{if(!api.reloadClassroomState)throw Error("Reload unavailable. Reopen the app.");await api.reloadClassroomState();if(alive.current){setCode("");setPw("");setMsg("");}}
          catch(e){if(alive.current)setMsg((e as Error).message);}finally{working.current=false;if(alive.current)setBusy(false);}
        }}>Reload saved Family</button>}
        <button type="button" className="btn ghost" disabled={busy} onClick={onBack}>
          Back
        </button>
      </div>
    </form>
  );
}
