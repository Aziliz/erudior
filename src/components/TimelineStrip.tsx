// A small timeline for timeline questions: numbered slots at their dates. Periods from an optional
// ```timeline spec show as bands for context. Decorative for screen readers: the answer rows
// beside it carry the same dates in text.

import { useMemo } from "react";
import { parseSpan, parseTimeline } from "../lib/timeline";

export default function TimelineStrip({ dates, context }: { dates: string[]; context?: string }) {
  const lay = useMemo(() => {
    const spans = dates.map((d) => parseSpan(d));
    const eras = context ? parseTimeline(context).eras : [];
    const ys = [...spans.flatMap((s) => (s ? [s.a.y, s.b?.y ?? s.a.y] : [])), ...eras.flatMap((e) => [e.span.a.y, e.span.b?.y ?? e.span.a.y])];
    if (!ys.length) return null;
    let lo = Math.min(...ys), hi = Math.max(...ys);
    const pad = Math.max((hi - lo) * 0.08, 1);
    lo -= pad;
    hi += pad;
    const pct = (y: number) => ((y - lo) / (hi - lo)) * 100;
    // Alternate label rows when neighbours are close, so dates don't overlap.
    const order = spans.map((s, i) => ({ i, x: s ? pct(s.a.y) : 0 })).sort((a, b) => a.x - b.x);
    const row: number[] = [];
    let lastX = -100;
    let lastRow = 1;
    for (const o of order) {
      row[o.i] = o.x - lastX < 18 ? 1 - lastRow : 0;
      lastRow = row[o.i];
      lastX = o.x;
    }
    return { spans, eras, pct, row };
  }, [dates, context]);
  if (!lay) return null;
  return (
    <div className="tl-strip" aria-hidden="true">
      {lay.eras.length > 0 && (
        <div className="tl-strip-eras">
          {lay.eras.map((e, i) => (
            <span key={i} className={`tl-strip-era${e.cat ? ` k${i % 6}` : ` n${i % 2}`}`} style={{ left: `${lay.pct(e.span.a.y)}%`, width: `${lay.pct(e.span.b?.y ?? e.span.a.y) - lay.pct(e.span.a.y)}%` }}>
              {e.text}
            </span>
          ))}
        </div>
      )}
      <div className="tl-strip-axis">
        {lay.spans.map((s, i) =>
          s ? (
            <span key={i} className={`tl-strip-slot row${lay.row[i]}`} style={{ left: `${lay.pct(s.a.y)}%` }}>
              <span className="q-marker inline">{i + 1}</span>
              <span className="tl-strip-date">{dates[i]}</span>
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
