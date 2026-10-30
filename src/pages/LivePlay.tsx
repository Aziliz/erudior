// Joining a live room: code + nickname, then the host's questions one at a time. A student sees
// only their own answers and score, and class totals after each question.

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import MathText from "../components/MathText";
import { codeOk, liveSocket, normCode, playerUrl, type PlayState } from "../lib/live";

const LETTERS = "ABCDEFGH";
/** A readable name for a choice that may contain $math$ (screen readers get the TeX without dollar signs). */
const spoken = (s: string) => s.replace(/\$+/g, "").trim();

export default function LivePlay({ api, initialCode }: { api: AppApi; initialCode?: string }) {
  const [code, setCode] = useState(normCode(initialCode ?? ""));
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"connecting" | "open" | "lost" | null>(null);
  const [play, setPlay] = useState<PlayState | null>(null);
  const [ended, setEnded] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [left, setLeft] = useState<number | null>(null);
  const sock = useRef<ReturnType<typeof liveSocket> | null>(null);

  useEffect(() => () => sock.current?.stop(), []);

  // Countdown for timed questions.
  useEffect(() => {
    if (play?.phase !== "question" || play.secondsLeft == null) return setLeft(null);
    setLeft(play.secondsLeft);
    const t = setInterval(() => setLeft((s) => (s === null ? null : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [play?.phase, play?.index, play?.secondsLeft]);

  useEffect(() => setPicked([]), [play?.index, play?.phase]);

  function join(e: React.FormEvent) {
    e.preventDefault();
    if (joining) return;
    sock.current?.stop();
    const c = normCode(code);
    if (!codeOk(c)) return setError("Room codes are 6 letters and numbers.");
    if (!name.trim()) return setError("Enter a nickname.");
    setError("");
    setJoining(true);
    let me = "";
    try {
      me = sessionStorage.getItem(`erudior.live.${c}`) ?? "";
    } catch {
      /* no storage */
    }
    const s = liveSocket(
      playerUrl(c, me || undefined),
      {
        onMessage: (m) => {
          if (m.t === "hello" && me) { me = ""; sock.current?.send({ t: "join", name: name.trim() }); }
          if (m.t === "error") {
            setError(m.message);
            setJoining(false);
          } else if (m.t === "play") {
            setPlay(m);
            setJoining(false);
            if (me !== m.player) {
              me = m.player;
              try {
                sessionStorage.setItem(`erudior.live.${c}`, me);
              } catch {
                /* no storage */
              }
            }
          }
        },
        onStatus: setStatus,
        onEnd: (codeNum, reason) => {
          setEnded(codeNum === 4002 ? "The host removed you from the room." : reason || "The room closed.");
          setJoining(false);
        },
      },
      () => (me ? null : { t: "join", name: name.trim() }),
    );
    s.setUrl(() => playerUrl(c, me || undefined));
    sock.current = s;
  }

  const answer = (choices: number[]) => {
    if (!play || !choices.length || status !== "open" || play.answered || play.phase !== "question") return;
    sock.current?.send({ t: "answer", index: play.index, choices });
    setPicked(choices);
  };

  if (ended)
    return (
      <div className="page live-play">
        <h1>Live room</h1>
        <p className="notice" role="status">
          {ended}
        </p>
        {play && play.total > 0 && (
          <p>
            You got <b>{play.correct}</b> of {play.total} right{play.timed ? `, ${play.score.toLocaleString()} points` : ""}.
          </p>
        )}
        <button className="btn" onClick={() => api.go({ name: "library" })}>
          Back to the Library
        </button>
      </div>
    );

  if (!play)
    return (
      <form className="page live-play" onSubmit={join} noValidate>
        <h1>Join a live room</h1>
        <p className="muted">Your teacher or parent shows a 6-character code. Use a nickname or first name; it's only kept while the room is open.</p>
        <div className="form-grid" style={{ marginTop: 16 }}>
          <label className="field">
            <span>Room code</span>
            <input
              className="input live-code-input"
              value={code}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              onChange={(e) => setCode(normCode(e.target.value))}
            />
          </label>
          <label className="field">
            <span>Nickname</span>
            <input className="input" value={name} maxLength={20} autoComplete="nickname" onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <p className={error ? "notice error" : "sr-only"} role="alert">
          {error}
        </p>
        <button className="btn primary" type="submit" disabled={joining} style={{ marginTop: 12 }}>
          {joining ? "Joining…" : "Join"}
        </button>
      </form>
    );

  const total = play.total;
  return (
    <div className="page live-play">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>{play.title}</h1>
        <span className="small muted">
          {play.name} · {play.timed ? `${play.score.toLocaleString()} points` : `${play.correct} right`}
          {status === "lost" && " · reconnecting…"}
        </span>
      </div>
      {play.mode === "teams" && <section className="panel" aria-label="Team battle scores"><h2>Your team: Team {play.team + 1}</h2><ul>{play.teams.map(t => <li key={t.team}>Team {t.team + 1}: {t.score} points · {t.correct} correct</li>)}</ul></section>}
      {play.mode === "cooperative" && <p className="notice" role="status">Class challenge: {play.cooperative?.correct ?? 0} correct answers together from {play.cooperative?.answered ?? 0} submitted answers.</p>}
      <div aria-live="polite" className="live-stage">
        {play.phase === "lobby" && <p className="live-big">You're in. Waiting for the host to start…</p>}

        {play.phase === "question" && play.choices && (
          <section>
            <p className="small muted">
              Question {play.index + 1} of {total}
              {left !== null && ` · ${left} s left`}
            </p>
            <MathText as="p" className="live-stem" text={play.stem ?? ""} />
            {play.answered ? (
              <p className="live-big">Answer sent. Waiting for the others…</p>
            ) : play.multi ? (
              <fieldset className="plain-fieldset">
                <legend className="small">Choose all that apply, then send</legend>
                <div className="live-choices">
                  {play.choices.map((c, i) => (
                    <label key={i} className={`live-choice ${picked.includes(i) ? "on" : ""}`}>
                      <input type="checkbox" aria-label={`${LETTERS[i]}: ${spoken(c)}`} checked={picked.includes(i)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, i] : p.filter((x) => x !== i)))} />
                      <b aria-hidden="true">{LETTERS[i]}</b> <MathText text={c} />
                    </label>
                  ))}
                </div>
                <button className="btn primary" disabled={!picked.length || status !== "open"} onClick={() => answer(picked)} style={{ marginTop: 12 }}>
                  Send answer
                </button>
              </fieldset>
            ) : (
              <div className="live-choices" role="group" aria-label="Choices">
                {play.choices.map((c, i) => (
                  <button key={i} className="live-choice" disabled={status !== "open"} aria-label={`${LETTERS[i]}: ${spoken(c)}`} onClick={() => answer([i])}>
                    <b aria-hidden="true">{LETTERS[i]}</b> <MathText text={c} />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {play.phase === "reveal" && play.choices && (
          <section>
            <p className={`live-big ${play.right ? "good" : "bad"}`}>{play.yours ? (play.right ? "Right!" : "Not this time.") : "No answer sent."}</p>
            <MathText as="p" className="live-stem" text={play.stem ?? ""} />
            <Totals choices={play.choices} answer={play.answer ?? []} counts={play.counts ?? []} yours={play.yours ?? []} answered={play.classAnswered ?? 0} />
            <p className="small muted">
              {play.classRight} of {play.classAnswered} in the room got it right. Waiting for the next question…
            </p>
          </section>
        )}

        {play.phase === "ended" && (
          <p className="live-big">
            Finished! You got {play.correct} of {total} right{play.timed ? ` · ${play.score.toLocaleString()} points` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}

/** Answer totals for one question (no names). */
export function Totals({ choices, answer, counts, yours = [], answered }: { choices: string[]; answer: number[]; counts: number[]; yours?: number[]; answered: number }) {
  return (
    <ul className="live-totals">
      {choices.map((c, i) => {
        const n = counts[i] ?? 0;
        const pct = answered ? Math.round((n / answered) * 100) : 0;
        const ok = answer.includes(i);
        return (
          <li key={i} className={ok ? "right" : ""}>
            <span className="live-total-label">
              <b aria-hidden="true">{LETTERS[i]}</b> <MathText text={c} />
              {ok && <span className="pill pass">Right answer</span>}
              {yours.includes(i) && <span className="pill neutral">Your answer</span>}
            </span>
            <span className="live-bar" aria-hidden="true">
              <i style={{ width: `${pct}%` }} />
            </span>
            <span className="small">
              {n} ({pct}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
}
