import { useState } from "react";
import type { AppApi } from "../App";
import { GRADES, createFamily, defaultYear, gradeLabel, passwordProblem, pinProblem, type Family } from "../lib/family";
import { hoursFor, routeOptions, stateInfo, statesData } from "../lib/states";
import { today } from "../lib/srs";

/** A school day's minimum the state implies, else 3 hours. */
export function suggestedMinutes(code: string): number {
  const s = stateInfo(code);
  if (!s) return 180;
  if (s.rules.hoursPerDay) return Math.round(s.rules.hoursPerDay * 60);
  const h = hoursFor(s.rules, 5);
  if (h && s.rules.days) return Math.round(((h / s.rules.days) * 60) / 15) * 15;
  if (h) return Math.round(((h / 180) * 60) / 15) * 15;
  return 180;
}

export default function FamilySetup({ api, onDone }: { api: AppApi; onDone: (f: Family) => Promise<void> }) {
  const year = defaultYear(today());
  const [state, setState] = useState("");
  const [route, setRoute] = useState("Home education law");
  const [start, setStart] = useState(year.start);
  const [end, setEnd] = useState(year.end);
  const [minutes, setMinutes] = useState(180);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [usePin, setUsePin] = useState(false);
  const [pin, setPin] = useState("");
  const [students, setStudents] = useState([{ name: "", grade: 1 }]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ family: Family; code: string } | null>(null);
  const info = stateInfo(state);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const named = students.filter((s) => s.name.trim());
    const problem =
      (!state && "Choose your state.") ||
      (end <= start && "The school year has to end after it starts.") ||
      (!named.length && "Add at least one student.") ||
      passwordProblem(pw) ||
      (pw !== pw2 && "The two passwords don't match.") ||
      (usePin && pinProblem(pin)) ||
      "";
    setError(problem);
    if (problem) {
      document.getElementById("setup-error")?.focus();
      return;
    }
    setBusy(true);
    try {
      const { family, recoveryCode } = await createFamily({
        state,
        route,
        year: { start, end },
        dailyMinutes: minutes,
        password: pw,
        pin: usePin ? pin : undefined,
        students: named,
      });
      setDone({ family, code: recoveryCode });
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="page narrow-page">
        <h1>Write down your recovery code</h1>
        <p>If you forget the parent password, this code is the only way to reset it. Examiner keeps nothing online, so nobody else can.</p>
        <p className="recovery-code" aria-label={`Recovery code: ${done.code.split("").join(" ")}`}>
          {done.code}
        </p>
        <p className="muted small">Keep it somewhere safe, away from the computer (a notebook or a password manager).</p>
        <button className="btn primary" onClick={() => onDone(done.family)}>
          I've written it down
        </button>
      </div>
    );

  return (
    <form className="page narrow-page" onSubmit={submit} noValidate>
      <button type="button" className="back" onClick={() => api.go({ name: "library" })}>
        ← Library
      </button>
      <h1>Set up homeschool</h1>
      <p className="muted">
        Separate progress for each student, a parent area behind a password, attendance and hours against your state's
        rules, and reminders. Everything stays on this computer.
      </p>

      <fieldset className="panel form-grid">
        <legend>Your state</legend>
        <label className="field">
          <span>State</span>
          <select
            className="select"
            value={state}
            required
            onChange={(e) => {
              setState(e.target.value);
              setRoute("Home education law");
              setMinutes(suggestedMinutes(e.target.value));
            }}
          >
            <option value="">Choose…</option>
            {statesData().states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        {info && (
          <label className="field">
            <span>How you homeschool</span>
            <select className="select" value={route} onChange={(e) => setRoute(e.target.value)}>
              {routeOptions(info).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        )}
        {info && (
          <p className="small muted span-2">
            {info.name}: notice: {info.notice}. Time: {info.time}. Testing: {info.assessment}.{" "}
            {route !== "Home education law" && "Under another route the school or program sets the rules; reminders use only your own dates."}
          </p>
        )}
      </fieldset>

      <fieldset className="panel form-grid">
        <legend>School year</legend>
        <label className="field">
          <span>Starts</span>
          <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="field">
          <span>Ends</span>
          <input className="input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label className="field">
          <span>Minutes that make a school day</span>
          <input
            className="input"
            type="number"
            min={15}
            max={720}
            step={15}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value) || 0)}
            aria-describedby="minutes-help"
          />
        </label>
        <p id="minutes-help" className="small muted">
          Days with at least this much learning (in the app or entered by hand) are proposed as school days. You confirm them.
        </p>
      </fieldset>

      <fieldset className="panel">
        <legend>Students</legend>
        <p className="small muted" style={{ marginBottom: 12 }}>
          Each student gets their own progress. Progress already on this computer becomes the first student's.
        </p>
        {students.map((s, i) => (
          <div key={i} className="row student-row">
            <label className="field grow">
              <span>Name</span>
              <input
                className="input"
                value={s.name}
                autoComplete="off"
                onChange={(e) => setStudents((x) => x.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))}
              />
            </label>
            <label className="field">
              <span>Grade</span>
              <select
                className="select"
                value={s.grade}
                onChange={(e) => setStudents((x) => x.map((y, j) => (j === i ? { ...y, grade: Number(e.target.value) } : y)))}
              >
                {GRADES.map((_, g) => (
                  <option key={g} value={g}>
                    {gradeLabel(g)}
                  </option>
                ))}
              </select>
            </label>
            {students.length > 1 && (
              <button type="button" className="btn sm ghost" onClick={() => setStudents((x) => x.filter((_, j) => j !== i))}>
                Remove<span className="sr-only"> student {i + 1}</span>
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn sm" onClick={() => setStudents((x) => [...x, { name: "", grade: 1 }])}>
          Add another student
        </button>
      </fieldset>

      <fieldset className="panel form-grid">
        <legend>Parent password</legend>
        <label className="field">
          <span>Password (8 characters or more)</span>
          <input className="input" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        <label className="field">
          <span>Type it again</span>
          <input className="input" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </label>
        <label className="check span-2">
          <input type="checkbox" checked={usePin} onChange={(e) => setUsePin(e.target.checked)} />
          Also allow a PIN for quicker sign-in
        </label>
        {usePin && (
          <label className="field">
            <span>PIN (4 to 8 digits)</span>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
          </label>
        )}
      </fieldset>

      {error && (
        <p id="setup-error" className="notice error" role="alert" tabIndex={-1}>
          {error}
        </p>
      )}
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "Setting up…" : "Set up homeschool"}
        </button>
      </div>
    </form>
  );
}
