import type { Attempt, Tally } from "../lib/types";
import { attemptPassed } from "../lib/session";
import { percent } from "../lib/util";

export function AccuracyBar({ value }: { value: number | null }) {
  if (value === null) return <span className="faint small">Not attempted</span>;
  const pct = Math.round(value * 100);
  const cls = pct < 60 ? "bar low" : pct < 75 ? "bar mid" : "bar";
  return (
    <div className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
      <div className={cls} style={{ flex: 1 }} role="img" aria-label={`${pct} percent`}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <span className="num small" style={{ width: 38, textAlign: "right" }}>
        {pct}%
      </span>
    </div>
  );
}

/** Table of tallies (by topic or section), weakest first. */
export function TallyTable({ title, data }: { title: string; data: Record<string, Tally> }) {
  const rows = Object.entries(data).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total || a[0].localeCompare(b[0]),
  );
  if (!rows.length) return null;
  return (
    <table className="table">
      <thead>
        <tr>
          <th>{title}</th>
          <th className="r">Correct</th>
          <th style={{ width: "40%" }}>Score</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, t]) => (
          <tr key={name}>
            <td>{name}</td>
            <td className="r">
              {t.correct}/{t.total}
            </td>
            <td>
              <AccuracyBar value={t.total ? t.correct / t.total : null} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Pass/Fail pill for exams, percentage pill for practice. */
export function ScorePill({ attempt }: { attempt: Attempt }) {
  const passed = attemptPassed(attempt);
  if (passed === undefined) return <span className="pill neutral">{percent(attempt.correct, attempt.total)}%</span>;
  return <span className={`pill ${passed ? "pass" : "fail"}`}>{passed ? "Pass" : "Fail"}</span>;
}

/** Section table with each section's own pass mark, when the exam has them. */
export function SectionTable({ data, marks }: { data: Record<string, Tally>; marks?: Record<string, number> }) {
  const rows = Object.entries(data);
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Section</th>
          <th className="r">Correct</th>
          <th style={{ width: "36%" }}>Score</th>
          {marks && <th className="r">Needed</th>}
          {marks && <th />}
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, t]) => {
          const pct = t.total ? (t.correct / t.total) * 100 : 0;
          const need = marks?.[name];
          return (
            <tr key={name}>
              <td>{name}</td>
              <td className="r">
                {t.correct}/{t.total}
              </td>
              <td>
                <AccuracyBar value={t.total ? t.correct / t.total : null} />
              </td>
              {marks && <td className="r">{need !== undefined ? `${need}%` : ""}</td>}
              {marks && (
                <td className="r">
                  {need !== undefined && (
                    <span className={`pill ${pct >= need - 1e-9 ? "pass" : "fail"}`}>{pct >= need - 1e-9 ? "Pass" : "Fail"}</span>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
