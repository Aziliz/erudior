import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import { topicStats } from "../lib/session";
import * as store from "../lib/storage";
import { formatDateTime, formatDuration, percent } from "../lib/util";
import { AccuracyBar, ScorePill } from "../components/Bars";

export default function ProgressPage({ api }: { api: AppApi }) {
  const { progress, banks } = api;
  const [bankFilter, setBankFilter] = useState<string>("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    store.dataLocation().then(setLocation, () => setLocation(""));
  }, []);

  const attempts = progress.attempts.filter((a) => !bankFilter || a.bankId === bankFilter);
  const exams = attempts.filter((a) => a.mode === "exam");
  const answeredTotal = attempts.reduce((s, a) => s + a.total, 0);
  const correctTotal = attempts.reduce((s, a) => s + a.correct, 0);
  const studySec = attempts.reduce((s, a) => s + a.durationSec, 0);

  // Weakest topics across the selected banks, needing at least 3 answers to count.
  const weak = banks
    .filter((b) => !bankFilter || b.id === bankFilter)
    .flatMap((b) => topicStats(b, progress).map((t) => ({ ...t, bank: b.title })))
    .filter((t) => t.attempts >= 3 && t.accuracy !== null && t.accuracy < 1)
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
    .slice(0, 8);

  async function reset() {
    const scope = bankFilter ? banks.find((b) => b.id === bankFilter)?.title : "all banks";
    const ok = await store.confirmAction(`Erase all history and question stats for ${scope}? This can't be undone.`);
    if (!ok) return;
    if (bankFilter) {
      const stats = { ...progress.stats };
      delete stats[bankFilter];
      await api.setProgress({
        ...progress,
        attempts: progress.attempts.filter((a) => a.bankId !== bankFilter),
        stats,
      });
    } else {
      await api.setProgress({ ...progress, attempts: [], stats: {} });
    }
    api.toast("Progress erased");
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Progress</h1>
          <p className="muted">Every finished exam and practice session, and where you're losing points.</p>
        </div>
        <div className="row">
          <select className="select" style={{ width: "auto" }} value={bankFilter} onChange={(e) => setBankFilter(e.target.value)}>
            <option value="">All banks</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-strip">
        <div>
          <b>{exams.length}</b>
          <span>exams</span>
        </div>
        <div>
          <b>{attempts.length - exams.length}</b>
          <span>practice sessions</span>
        </div>
        <div>
          <b>{answeredTotal}</b>
          <span>questions answered</span>
        </div>
        <div>
          <b>{answeredTotal ? `${percent(correctTotal, answeredTotal)}%` : "None"}</b>
          <span>overall accuracy</span>
        </div>
        <div>
          <b>{formatDuration(studySec)}</b>
          <span>study time</span>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head">
            <h2>Weakest topics</h2>
          </div>
          {weak.length === 0 ? (
            <p className="muted small">Topics show up here once you've answered at least 3 questions in them and missed at least one.</p>
          ) : (
            <table className="table">
              <tbody>
                {weak.map((t) => (
                  <tr key={t.bank + t.topic}>
                    <td>
                      {t.topic}
                      {!bankFilter && <div className="faint small">{t.bank}</div>}
                    </td>
                    <td style={{ width: "45%" }}>
                      <AccuracyBar value={t.accuracy} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Exam scores</h2>
          </div>
          {exams.length === 0 ? (
            <p className="muted small">Take a timed exam to start a score trend.</p>
          ) : (
            <ScoreTrend points={exams.slice(0, 20).reverse().map((a) => ({ pct: percent(a.correct, a.total), pass: a.passingPercent }))} />
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h2>History</h2>
        </div>
        {attempts.length === 0 ? (
          <p className="muted small">No sessions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Bank</th>
                <th>Mode</th>
                <th className="r">Score</th>
                <th className="r">Time</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id} className="click" onClick={() => api.go({ name: "results", attemptId: a.id, back: { name: "progress" } })}>
                  <td>{formatDateTime(a.finishedAt)}</td>
                  <td>{a.bankTitle}</td>
                  <td>{a.mode === "exam" ? "Exam" : "Practice"}</td>
                  <td className="r">
                    {a.correct}/{a.total} ({percent(a.correct, a.total)}%)
                  </td>
                  <td className="r">{formatDuration(a.durationSec)}</td>
                  <td className="r">
                    <ScorePill correct={a.correct} total={a.total} passing={a.mode === "exam" ? a.passingPercent : undefined} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="row" style={{ marginTop: 24, justifyContent: "space-between" }}>
        <span className="faint small">Data is stored in {location}</span>
        <button className="btn danger ghost sm" onClick={reset} disabled={!attempts.length && !Object.keys(progress.stats).length}>
          Erase progress{bankFilter ? " for this bank" : ""}
        </button>
      </div>
    </div>
  );
}

/** Small line chart of exam scores, oldest to newest, with the passing line. */
function ScoreTrend({ points }: { points: { pct: number; pass?: number }[] }) {
  const W = 420;
  const H = 160;
  const pad = { l: 30, r: 10, t: 10, b: 20 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / 100) * ih;
  const pass = points[points.length - 1]?.pass;
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.pct)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Exam score trend">
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
          <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--ink-3)">
            {v}
          </text>
        </g>
      ))}
      {pass !== undefined && (
        <g>
          <line x1={pad.l} x2={W - pad.r} y1={y(pass)} y2={y(pass)} stroke="var(--ok)" strokeDasharray="4 4" />
          <text x={W - pad.r} y={y(pass) - 4} textAnchor="end" fontSize="10" fill="var(--ok)">
            pass {pass}%
          </text>
        </g>
      )}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.pct)} r="3.5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2">
          <title>{p.pct}%</title>
        </circle>
      ))}
      <text x={pad.l} y={H - 4} fontSize="10" fill="var(--ink-3)">
        oldest
      </text>
      <text x={W - pad.r} y={H - 4} fontSize="10" fill="var(--ink-3)" textAnchor="end">
        latest
      </text>
    </svg>
  );
}
