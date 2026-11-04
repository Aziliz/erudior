// Parent or teacher area → Live room: pick questions from an installed course, open a room,
// show the code, and run the quiz. The host sees nicknames (to remove anyone) and scores;
// students see only their own result and class totals. Nothing is saved.

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import MathText from "../components/MathText";
import { Totals } from "./LivePlay";
import { hostUrl, liveSourceQuestions, hosting, liveSocket, openRoom, setHosting, type HostState, type LiveQuestion, type LiveMode } from "../lib/live";
import type { Course, Question } from "../lib/types";
import * as store from "../lib/storage";

const LETTERS = "ABCDEFGH";

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const toLive = (q: Question): LiveQuestion => ({ stem: q.stem, choices: q.choices, answer: q.answer });
/** Live rooms use multiple-choice questions without pictures (other kinds need the full app). */
// Live rooms show the question on each device as text: no pictures or sound.


export default function LiveHost({ api }: { api: AppApi }) {
  const [room, setRoom] = useState(hosting);
  if (!room) return <Setup api={api} onOpen={(r) => (setHosting(r), setRoom(r))} />;
  return (
    <Run
      api={api}
      room={room}
      onClosed={() => {
        setHosting(null);
        setRoom(null);
      }}
    />
  );
}

interface Opened {
  code: string;
  token: string;
  joinUrl: string;
  title: string;
  questions?: LiveQuestion[];
  timed?: boolean;
  seconds?: number;
  mode?: LiveMode;
  teamCount?: number;
}

function Setup({ api, onOpen }: { api: AppApi; onOpen: (r: Opened) => void }) {
  const courses = api.allCourses.filter((c) => c.banks.some((b) => b.questions.length));
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const course: Course | undefined = courses.find((c) => c.id === courseId);
  const [source, setSource] = useState("random");
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<LiveMode>("individual");
  const [teamCount, setTeamCount] = useState(2);
  const [timed, setTimed] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const alive = useRef(true);
  const opening = useRef(false);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const quizzes = course
    ? [
        ...course.modules.filter((m) => m.quiz?.length).map((m) => ({ id: `m:${m.id}`, label: `Module test: ${m.title}`, ids: m.quiz! })),
        ...course.lessons.filter((l) => l.quiz?.length).map((l) => ({ id: `l:${l.id}`, label: `Lesson quiz: ${l.title}`, ids: l.quiz! })),
      ]
    : [];

  function pickQuestions(): LiveQuestion[] {
    if (!course) return [];
    if (source === "random") {
      const all = liveSourceQuestions(course);
      return shuffle(all).slice(0, count).map(toLive);
    }
    const q = quizzes.find((x) => x.id === source);
    return liveSourceQuestions(course, q?.ids ?? []).slice(0, 100).map(toLive);
  }

  if (!courses.length) return <p className="muted">Start a course with questions first; the live room uses its questions.</p>;

  return (
    <section className="panel">
      <h2>Run a live quiz</h2>
      <p className="muted small" style={{ marginBottom: 12 }}>
        Text-only choice questions are supported; media and ambiguous question IDs are excluded. Lesson/module sets are limited to 100 questions. Students join at app.erudior.com with a code and a nickname, on any phone, tablet or computer. You pace the questions; they see their own result and how
        the room answered, never other students' names. Nothing is saved after the room closes. Needs an internet connection.
      </p>
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          if (opening.current) return;
          const questions = pickQuestions();
          if (!questions.length) return setError("No questions there; pick another set.");
          opening.current = true;
          setBusy(true);
          setError("");
          try {
            const r = await openRoom();
            if (!alive.current) {
              // A navigated-away setup must not attach a newly opened room to another screen.
              let cleanup: ReturnType<typeof liveSocket> | undefined;
              cleanup = liveSocket(hostUrl(r.code, r.token), {
                onMessage: m => { if (m.t === "state") { cleanup?.send({ t: "close" }); cleanup?.stop(); } },
                onStatus() {}, onEnd() { cleanup?.stop(); },
              });
              setTimeout(() => cleanup?.stop(), 15_000);
              return;
            }
            const label = source === "random" ? course!.title : (quizzes.find((x) => x.id === source)?.label ?? course!.title);
            onOpen({ ...r, title: label, questions, timed, seconds, mode, teamCount });
          } catch (err) {
            if (alive.current) setError((err as Error).message);
          } finally {
            opening.current = false;
            if (alive.current) setBusy(false);
          }
        }}
      >
        <label className="field">
          <span>Course</span>
          <select className="select" value={courseId} onChange={(e) => (setCourseId(e.target.value), setSource("random"))}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Questions</span>
          <select className="select" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="random">Random questions from the whole course</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label} ({q.ids.length})
              </option>
            ))}
          </select>
        </label>
        {source === "random" && (
          <label className="field">
            <span>How many</span>
            <input className="input" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
          </label>
        )}
        <label className="field"><span>Game mode</span>
          <select className="select" value={mode} onChange={e => setMode(e.target.value as LiveMode)}>
            <option value="individual">Individual quiz battle</option>
            <option value="teams">Team quiz battle</option>
            <option value="cooperative">Cooperative class challenge</option>
          </select>
        </label>
        {mode === "teams" && <label className="field"><span>Number of teams</span><input className="input" type="number" min={2} max={8} value={teamCount} onChange={e => setTeamCount(Math.max(2, Math.min(8, Number(e.target.value) || 2)))} /></label>}
        <p className="small muted span-2">Team scores are sums of individual points; balance teams in the lobby. Cooperative play celebrates the class's total correct answers, without a leaderboard. These games do not award grades or mastery.</p>
        <fieldset className="plain-fieldset span-2">
          <legend className="small">Pace</legend>
          <label className="check">
            <input type="radio" name="pace" checked={!timed} onChange={() => setTimed(false)} />
            Untimed: you reveal each answer when the room is ready; one point per right answer
          </label>
          <label className="check" style={{ marginTop: 6 }}>
            <input type="radio" name="pace" checked={timed} onChange={() => setTimed(true)} />
            Timed: a countdown per question; faster right answers score more points
          </label>
          {timed && (
            <label className="field" style={{ maxWidth: 220, marginTop: 8 }}>
              <span>Seconds per question</span>
              <input className="input" type="number" min={5} max={120} value={seconds} onChange={(e) => setSeconds(Math.max(5, Math.min(120, Number(e.target.value) || 20)))} />
            </label>
          )}
        </fieldset>
        <p className={error ? "notice error span-2" : "sr-only"} role="alert">
          {error}
        </p>
        <div className="span-2">
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? "Opening…" : "Open the room"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Run({ api, room, onClosed }: { api: AppApi; room: Opened; onClosed: () => void }) {
  const [s, setS] = useState<HostState | null>(null);
  const [status, setStatus] = useState<"connecting" | "open" | "lost">("connecting");
  const [left, setLeft] = useState<number | null>(null);
  const sock = useRef<ReturnType<typeof liveSocket> | null>(null);
  const setupSent = useRef(false);
  const closeRequested = useRef(false);
  const [closing, setClosing] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [connectionAttempt, setConnectionAttempt] = useState(0);

  useEffect(() => {
    setupSent.current = false;
    setConnectionError("");
    const k = liveSocket(
      hostUrl(room.code, room.token),
      {
        onMessage: (m) => {
          if (m.t === "error") { api.toast(m.message); return; }
          if (m.t !== "state") return;
          setS(m);
          if (closeRequested.current) { k.send({ t: "close" }); return; }
          // First connection: send the questions (they stay on the server only while the room is open).
          if (!setupSent.current && room.questions && m.phase === "lobby" && m.total === 0) {
            setupSent.current = true;
            k.send({ t: "setup", title: room.title, questions: room.questions, timed: room.timed, seconds: room.seconds, mode: room.mode, teamCount: room.teamCount });
          }
        },
        onStatus: status => { if (status !== "open") setupSent.current = false; setStatus(status); },
        onEnd: (code, reason) => {
          if (code === 0) {
            setStatus("lost");
            setConnectionError(closeRequested.current
              ? "Connection lost. Room closure is not confirmed. Reconnect to retry closing it."
              : "Connection lost. The room may still be open. Reconnect to resume control.");
            return;
          }
          api.toast(code === 4000 ? "The room was opened in another window." : reason || "The room closed.");
          onClosed();
        },
      },
    );
    sock.current = k;
    return () => k.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.code, connectionAttempt]);

  useEffect(() => {
    if (!s || s.phase !== "question" || !s.timed) return setLeft(null);
    const tick = () => setLeft(Math.max(0, Math.round((s.deadline - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [s]);

  const send = (m: unknown) => sock.current?.send(m);
  const players = s?.players ?? [];
  const joinHost = room.joinUrl.replace(/^https?:\/\//, "").replace(/\/\?live=.*$/, "");

  return (
    <div className="live-host">
      {connectionError && <section className="notice error" role="alert"><p>{connectionError}</p><button className="btn" onClick={() => setConnectionAttempt(n => n + 1)}>Reconnect to room</button> <button className="btn ghost danger" onClick={async () => {
        if (!(await store.confirmAction("Forget this room on this device? This does not close the server room. It may remain open until its inactivity or four-hour expiry limit. You will lose the host credential and cannot control it again.", "Forget room locally"))) return;
        sock.current?.stop();
        onClosed();
      }}>Forget room on this device</button></section>}
      <section className="panel live-code-panel">
        <div>
          <p className="small muted">Join at {joinHost || "the Erudior website"} → Join a live room, code:</p>
          <p className="live-code" aria-label={`Room code ${room.code.split("").join(" ")}`}>
            {room.code}
          </p>
          <p className="small muted">
            {room.title} · {s?.timed ? `timed, ${s.seconds} s` : "untimed"}
            {status !== "open" && " · reconnecting…"}
          </p>
        </div>
        <div className="row">
          <button
            className="btn ghost danger"
            disabled={closing}
            onClick={async () => {
              if (!(await store.confirmAction("Close the room? Everyone is disconnected and nothing is kept.", "Close room"))) return;
              closeRequested.current = true;
              setClosing(true);
              send({ t: "close" });
            }}
          >
            {closing ? "Closing room — reconnecting if needed…" : "Close room"}
          </button>
        </div>
      </section>

      {s && (
        <section className="panel" aria-live="polite">
          {s.phase === "lobby" && (
            <>
              <h2>
                {players.length} joined · {s.total} questions ready
              </h2>
              <button className="btn primary" disabled={status !== "open" || !players.some(p => p.connected) || !s.total} onClick={() => send({ t: "show", index: s.index })}>
                Start with question 1
              </button>
            </>
          )}
          {(s.phase === "question" || s.phase === "reveal") && s.question && (
            <>
              <p className="small muted">
                Question {s.index + 1} of {s.total}
                {left !== null && ` · ${left} s left`} · {s.phase === "question" ? `${s.answered} of ${players.filter((p) => p.connected).length} answered` : "answers shown"}
              </p>
              <MathText as="p" className="live-stem" text={s.question.stem} />
              {s.phase === "question" ? (
                <ol className="live-host-choices">
                  {s.question.choices.map((c, i) => (
                    <li key={i}>
                      <b aria-hidden="true">{LETTERS[i]}</b> <MathText text={c} />
                    </li>
                  ))}
                </ol>
              ) : (
                <Totals choices={s.question.choices} answer={s.question.answer} counts={s.history[s.index]?.counts ?? []} answered={s.history[s.index]?.answered ?? 0} />
              )}
              <div className="row" style={{ marginTop: 12 }}>
                {s.phase === "question" && (
                  <button className="btn primary" disabled={status !== "open"} onClick={() => send({ t: "reveal", index: s.index })}>
                    Show answers
                  </button>
                )}
                {s.phase === "reveal" && s.index + 1 < s.total && (
                  <button className="btn primary" disabled={status !== "open"} onClick={() => send({ t: "show", index: s.index })}>
                    Next question
                  </button>
                )}
                {(s.phase === "reveal" || s.index + 1 >= s.total) && (
                  <button className="btn" onClick={() => send({ t: "end", index: s.index })}>
                    Finish the quiz
                  </button>
                )}
              </div>
            </>
          )}
          {s.phase === "ended" && <Summary s={s} />}
        </section>
      )}

      {s?.mode === "teams" && <section className="panel"><h2>Team battle</h2><p className="small muted">Players see only numbered teams and aggregate scores, never other nicknames.</p>
        {s.phase === "lobby" && <button className="btn" disabled={status !== "open"} onClick={() => send({ t: "shuffleTeams" })}>Randomize balanced teams</button>}
        <ul>{s.teams.map(t => <li key={t.team}>Team {t.team + 1}: {t.members} players · {t.score} points · {t.correct} correct</li>)}</ul>
      </section>}
      {s?.mode === "cooperative" && <section className="panel"><h2>Class challenge</h2><p>{s.cooperative.correct} correct answers together from {s.cooperative.answered} submitted answers. Every contribution counts.</p></section>}
      <section className="panel">
        <h2>In the room ({players.length})</h2>
        <p className="small muted">Only you see names. Remove anyone with an unsuitable nickname; they can rejoin with another.</p>
        <ul className="plain-list live-players">
          {players.map((p) => (
            <li key={p.id} className="row" style={{ justifyContent: "space-between" }}>
              <span>
                {p.name}
                {!p.connected && <span className="small muted"> (disconnected)</span>}
                {s?.phase === "question" && p.answered && <span className="small muted"> · answered</span>}
              </span>
              {s?.mode === "teams" && <label className="field"><span className="sr-only">Team for {p.name}</span><select className="select" aria-label={`Team for ${p.name}`} disabled={s.phase !== "lobby" || status !== "open"} value={p.team} onChange={e => send({ t: "assign", player: p.id, team: Number(e.target.value) })}>{s.teams.map(t => <option key={t.team} value={t.team}>Team {t.team + 1}</option>)}</select></label>}
              <button className="btn sm ghost" onClick={() => send({ t: "remove", player: p.id })}>
                Remove<span className="sr-only"> {p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Summary({ s }: { s: HostState }) {
  const ranked = [...s.players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return (
    <>
      <h2>Finished</h2>
      <table className="table">
        <caption className="sr-only">How the room did on each question</caption>
        <thead>
          <tr>
            <th scope="col">Question</th>
            <th scope="col" className="r">
              Right
            </th>
          </tr>
        </thead>
        <tbody>
          {s.history.map((h, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td className="r">
                {h ? `${h.right} of ${h.answered}${h.answered ? ` (${Math.round((h.right / h.answered) * 100)}%)` : ""}` : "not asked"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ marginTop: 16 }}>Scores (only on your screen; not saved)</h3>
      <table className="table">
        <caption className="sr-only">Scores by nickname</caption>
        <thead>
          <tr>
            <th scope="col">Nickname</th>
            <th scope="col" className="r">
              Right
            </th>
            {s.timed && (
              <th scope="col" className="r">
                Points
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {ranked.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className="r">{p.correct}</td>
              {s.timed && <td className="r">{p.score.toLocaleString()}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
