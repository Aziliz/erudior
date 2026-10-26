// Interactive math manipulatives (see lib/manip.ts for the models, checking and pictures).
// Everything works without dragging: every move has a real button, the number line and clock
// are sliders that take arrow keys, and each change is announced. Pointer users can also tap
// boxes, parts and coins, drag the number line marker and drag the clock's hands.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  COINS,
  MANIP_NAMES,
  PLACES,
  blockAdd,
  blockBreak,
  blockTrade,
  clockAdd,
  coinAdd,
  coinSvg,
  counterAdd,
  counterRemove,
  counterToggle,
  describe,
  drawClock,
  drawCoins,
  drawCounters,
  drawFractions,
  drawNumberline,
  drawPlace,
  fracParts,
  fracShade,
  fracSplit,
  lineMove,
  numberText,
  readSpec,
  readoutText,
  startState,
  stateOr,
  MAX_PARTS,
  type ManipSpec,
  type ManipState,
  type Model,
} from "../lib/manip";

/** The width of an element, kept current (the number line and bars are drawn to fit it). */
function useWidth(fallback = 560) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => el.clientWidth > 0 && setW(Math.max(200, Math.round(el.clientWidth)));
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** A button that stays focusable when it can't be used (so focus isn't lost to the page). */
function Btn({ off, onClick, label, children, className = "btn sm" }: { off?: boolean; onClick: () => void; label?: string; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" className={className} aria-disabled={off || undefined} aria-label={label} onClick={() => !off && onClick()}>
      {children}
    </button>
  );
}

interface Props {
  model: Model;
  state: ManipState;
  onChange?: (next: ManipState) => void;
  /** Read only (after checking, review screens). */
  disabled?: boolean;
  /** Name for the group ("Base-ten blocks"). */
  label?: string;
}

/** One model with its controls; the parent holds the state. */
export function ManipModel({ model: m, state, onChange, disabled, label }: Props) {
  const s = stateOr(m, state);
  const set = (next: ManipState) => !disabled && next !== s && onChange?.(next);
  const said = describe(m, s);
  const total = m.readout ? readoutText(m, s) : "";
  return (
    <div className={`mp mp-${m.kind}${disabled ? " is-off" : ""}`} role="group" aria-label={label ?? MANIP_NAMES[m.kind]}>
      {m.kind === "counters" && <Counters m={m} s={s} set={set} off={disabled} />}
      {m.kind === "blocks" && <Blocks m={m} s={s} set={set} off={disabled} />}
      {m.kind === "numberline" && <NumberLine m={m} s={s} set={set} off={disabled} said={said} />}
      {m.kind === "fractions" && <Fractions m={m} s={s} set={set} off={disabled} />}
      {m.kind === "clock" && <Clock m={m} s={s} set={set} off={disabled} said={said} />}
      {m.kind === "coins" && <Coins m={m} s={s} set={set} off={disabled} />}
      {total && (
        <p className="mp-readout" aria-hidden="true">
          {total}
        </p>
      )}
      {/* Read on every change; it also describes the model to anyone browsing the page. */}
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
      {!disabled && onChange && (
        <div className="mp-row mp-reset">
          <Btn className="btn sm ghost" off={JSON.stringify(s) === JSON.stringify(startState(m))} onClick={() => onChange(startState(m))}>
            Start over
          </Btn>
        </div>
      )}
    </div>
  );
}

type KindProps = { m: Model; s: ManipState; set: (n: ManipState) => void; off?: boolean; said?: string };

function Counters({ m, s, set, off }: KindProps) {
  const reds = s.filter((x) => x === 1).length;
  const yellows = s.filter((x) => x === 2).length;
  const full = !s.includes(0);
  const two = m.colors === 2;
  return (
    <>
      <div
        className="mp-pic"
        onClick={(e) => {
          const cell = (e.target as Element).closest("[data-cell]")?.getAttribute("data-cell");
          if (!off && cell != null) set(counterToggle(m, s, Number(cell)));
        }}
        dangerouslySetInnerHTML={{ __html: drawCounters(m, s) }}
      />
      {!off && (
        <div className="mp-row">
          <Btn off={full} onClick={() => set(counterAdd(m, s, 1))} label={two ? "Add a red counter" : "Add a counter"}>
            + {two ? "Red" : "Add"}
          </Btn>
          <Btn off={!reds} onClick={() => set(counterRemove(s, 1))} label={two ? "Take away a red counter" : "Take away a counter"}>
            − {two ? "Red" : "Take away"}
          </Btn>
          {two && (
            <>
              <Btn off={full} onClick={() => set(counterAdd(m, s, 2))} label="Add a yellow counter">
                + Yellow
              </Btn>
              <Btn off={!yellows} onClick={() => set(counterRemove(s, 2))} label="Take away a yellow counter">
                − Yellow
              </Btn>
            </>
          )}
          <Btn className="btn sm ghost" off={!reds && !yellows} onClick={() => set(s.map(() => 0))}>
            Clear
          </Btn>
        </div>
      )}
    </>
  );
}

function Blocks({ s, set, off }: KindProps) {
  const top = s.length - 1;
  return (
    <div className="mp-places">
      {s
        .map((n, i) => {
          const p = PLACES[i];
          const lower = PLACES[i - 1];
          const upper = PLACES[i + 1];
          return (
            <div key={i} className="mp-place-col">
              <span className="mp-place-name">
                {p.plural}: <b>{n}</b>
              </span>
              <div className="mp-pic" dangerouslySetInnerHTML={{ __html: drawPlace(i, n) }} />
              {!off && (
                <div className="mp-place-btns">
                  <span className="mp-pair">
                    <Btn off={n >= 20} onClick={() => set(blockAdd(s, i, 1))} label={`Add a ${p.name}`}>
                      +
                    </Btn>
                    <Btn off={n <= 0} onClick={() => set(blockAdd(s, i, -1))} label={`Take away a ${p.name}`}>
                      −
                    </Btn>
                  </span>
                  {i > 0 && (
                    <Btn off={n < 1 || s[i - 1] + 10 > 20} onClick={() => set(blockBreak(s, i))} label={`Break a ${p.name} into 10 ${lower.plural}`}>
                      Break 1 → 10
                    </Btn>
                  )}
                  {i < top && (
                    <Btn off={n < 10 || s[i + 1] >= 20} onClick={() => set(blockTrade(s, i))} label={`Trade 10 ${p.plural} for a ${upper.name}`}>
                      Trade 10 → 1
                    </Btn>
                  )}
                </div>
              )}
            </div>
          );
        })
        .reverse()}
    </div>
  );
}

function NumberLine({ m, s, set, off, said }: KindProps) {
  const [box, width] = useWidth();
  const [trail, setTrail] = useState<number[]>([]);
  const drag = useRef<{ from: number } | null>(null);
  const go = (v: number, hop = true) => {
    const next = lineMove(m, v);
    if (next[0] === s[0]) return;
    if (hop) setTrail((t) => [...t, s[0]].slice(-8));
    set(next);
  };
  const valueAt = (e: React.PointerEvent) => {
    const svg = (e.currentTarget as HTMLElement).querySelector("svg");
    if (!svg) return s[0];
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * width;
    return m.min + ((px - 22) / (width - 44)) * (m.max - m.min);
  };
  const big = Math.max(...m.hops);
  return (
    <>
      <div
        ref={box}
        className="mp-pic mp-slider"
        role={off ? undefined : "slider"}
        tabIndex={off ? undefined : 0}
        aria-label={off ? undefined : "Number line marker"}
        aria-valuemin={off ? undefined : m.min}
        aria-valuemax={off ? undefined : m.max}
        aria-valuenow={off ? undefined : s[0]}
        aria-valuetext={off ? undefined : said}
        aria-hidden={off || undefined}
        onKeyDown={(e) => {
          if (off) return;
          const k = e.key;
          const to =
            k === "ArrowRight" || k === "ArrowUp" ? s[0] + m.step
            : k === "ArrowLeft" || k === "ArrowDown" ? s[0] - m.step
            : k === "PageUp" ? s[0] + big
            : k === "PageDown" ? s[0] - big
            : k === "Home" ? m.min
            : k === "End" ? m.max
            : null;
          if (to === null) return;
          e.preventDefault();
          go(to);
        }}
        onPointerDown={(e) => {
          if (off) return;
          drag.current = { from: s[0] };
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          go(valueAt(e), false);
        }}
        onPointerMove={(e) => drag.current && go(valueAt(e), false)}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          if (d && d.from !== s[0]) setTrail((t) => [...t, d.from].slice(-8));
        }}
        dangerouslySetInnerHTML={{ __html: drawNumberline(m, s, width, trail) }}
      />
      {!off && (
        <div className="mp-row">
          {m.hops.map((h) => (
            <Btn key={`b${h}`} off={s[0] - h < m.min - 1e-9} onClick={() => go(s[0] - h)} label={`Hop back ${numberText(h, m.den)}`}>
              ← {numberText(h, m.den)}
            </Btn>
          ))}
          {m.hops.map((h) => (
            <Btn key={`f${h}`} off={s[0] + h > m.max + 1e-9} onClick={() => go(s[0] + h)} label={`Hop forward ${numberText(h, m.den)}`}>
              {numberText(h, m.den)} →
            </Btn>
          ))}
          {trail.length > 0 && (
            <Btn className="btn sm ghost" onClick={() => setTrail([])}>
              Clear hops
            </Btn>
          )}
        </div>
      )}
    </>
  );
}

function Fractions({ m, s, set, off }: KindProps) {
  const [box, width] = useWidth();
  return (
    <>
      <div
        ref={box}
        className="mp-pic"
        onClick={(e) => {
          const el = (e.target as Element).closest("[data-part]");
          if (off || !el) return;
          const bar = Number(el.getAttribute("data-bar"));
          const part = Number(el.getAttribute("data-part"));
          // Tap a part to shade up to it; tap the last shaded part to unshade it.
          set(fracShade(s, bar, s[2 * bar + 1] === part + 1 ? part : part + 1));
        }}
        dangerouslySetInnerHTML={{ __html: drawFractions(m, s, width) }}
      />
      {!off && (
        <div className="mp-bars">
          {m.bars.map((_, b) => {
            const [parts, shaded] = [s[2 * b], s[2 * b + 1]];
            const name = m.bars.length > 1 ? `bar ${b + 1}` : "the bar";
            return (
              <div key={b} className="mp-row mp-bar-row" role="group" aria-label={m.bars.length > 1 ? `Bar ${b + 1}` : "Fraction bar"}>
                {m.bars.length > 1 && (
                  <span className="mp-bar-name" aria-hidden="true">
                    Bar {b + 1}
                  </span>
                )}
                <Btn off={shaded >= parts} onClick={() => set(fracShade(s, b, shaded + 1))} label={`Shade one more part of ${name}`}>
                  + Shade
                </Btn>
                <Btn off={shaded <= 0} onClick={() => set(fracShade(s, b, shaded - 1))} label={`Unshade one part of ${name}`}>
                  − Shade
                </Btn>
                {!m.fixed && (
                  <>
                    <Btn off={parts >= MAX_PARTS} onClick={() => set(fracParts(s, b, parts + 1))} label={`More parts in ${name}`}>
                      + Part
                    </Btn>
                    <Btn off={parts <= 1} onClick={() => set(fracParts(s, b, parts - 1))} label={`Fewer parts in ${name}`}>
                      − Part
                    </Btn>
                    <Btn off={parts * 2 > MAX_PARTS} onClick={() => set(fracSplit(s, b))} label={`Cut each part of ${name} in half`}>
                      Cut in half
                    </Btn>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Clock({ m, s, set, off, said }: KindProps) {
  const drag = useRef<"h" | "m" | null>(null);
  const step = m.minuteStep;
  const angleAt = (e: React.PointerEvent) => {
    const svg = (e.currentTarget as HTMLElement).querySelector("svg");
    if (!svg) return 0;
    const r = svg.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    return ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  };
  const turnTo = (e: React.PointerEvent) => {
    const a = angleAt(e);
    const now = (s[0] % 12) * 60 + s[1];
    let target: number;
    if (drag.current === "h") {
      // The hour hand: pick the hour it points nearest to, keeping the minutes.
      const h = ((Math.round(a / 30 - s[1] / 60) % 12) + 12) % 12;
      target = h * 60 + s[1];
    } else {
      const min = (Math.round(a / 6 / step) * step) % 60;
      // Crossing 12 moves the hour hand on, as on a real clock.
      let h = s[0] % 12;
      if (s[1] >= 45 && min < 15) h++;
      else if (s[1] < 15 && min >= 45) h--;
      target = h * 60 + min;
    }
    const next = clockAdd(s, target - now);
    if (next[0] !== s[0] || next[1] !== s[1]) set(next);
  };
  const minutes = (s[0] % 12) * 60 + s[1];
  return (
    <>
      <div
        className="mp-pic mp-slider mp-clock-box"
        role={off ? undefined : "slider"}
        tabIndex={off ? undefined : 0}
        aria-label={off ? undefined : "Clock hands (arrow keys move the minute hand, Page Up and Page Down the hour)"}
        aria-valuemin={off ? undefined : 0}
        aria-valuemax={off ? undefined : 719}
        aria-valuenow={off ? undefined : minutes}
        aria-valuetext={off ? undefined : said}
        aria-hidden={off || undefined}
        onKeyDown={(e) => {
          if (off) return;
          const k = e.key;
          const by =
            k === "ArrowRight" || k === "ArrowUp" ? step
            : k === "ArrowLeft" || k === "ArrowDown" ? -step
            : k === "PageUp" ? 60
            : k === "PageDown" ? -60
            : null;
          if (k === "Home") {
            e.preventDefault();
            return set([12, 0]);
          }
          if (by === null) return;
          e.preventDefault();
          set(clockAdd(s, by));
        }}
        onPointerDown={(e) => {
          if (off) return;
          drag.current = (e.target as Element).closest("[data-hand='h']") ? "h" : "m";
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          turnTo(e);
        }}
        onPointerMove={(e) => drag.current && turnTo(e)}
        onPointerUp={() => (drag.current = null)}
        dangerouslySetInnerHTML={{ __html: drawClock(m, s) }}
      />
      {!off && (
        <div className="mp-row">
          <span className="mp-pair">
            <Btn onClick={() => set(clockAdd(s, -60))} label="Move the hour hand back one hour">
              − Hour
            </Btn>
            <Btn onClick={() => set(clockAdd(s, 60))} label="Move the hour hand forward one hour">
              + Hour
            </Btn>
          </span>
          {step < 60 && (
            <span className="mp-pair">
              <Btn onClick={() => set(clockAdd(s, -step))} label={`Move the minute hand back ${step} minute${step === 1 ? "" : "s"}`}>
                − {step} min
              </Btn>
              <Btn onClick={() => set(clockAdd(s, step))} label={`Move the minute hand forward ${step} minute${step === 1 ? "" : "s"}`}>
                + {step} min
              </Btn>
            </span>
          )}
        </div>
      )}
    </>
  );
}

function Coins({ m, s, set, off }: KindProps) {
  const [box, width] = useWidth();
  return (
    <>
      <div
        ref={box}
        className="mp-pic mp-mat-box"
        onClick={(e) => {
          const c = (e.target as Element).closest("[data-coin]")?.getAttribute("data-coin");
          if (!off && c != null) set(coinAdd(s, Number(c), -1));
        }}
        dangerouslySetInnerHTML={{ __html: drawCoins(m, s, width) }}
      />
      {!off && (
        <ul className="mp-tray" aria-label="Coins">
          {m.coins.map((i) => {
            const c = COINS[i];
            return (
              <li key={c.id} className="mp-tray-coin">
                <span className="mp-tray-pic" aria-hidden="true" dangerouslySetInnerHTML={{ __html: coinSvg(i, 1.6) }} />
                <span className="mp-tray-name">
                  {c.name} <span className="muted">({c.label})</span>
                </span>
                <span className="mp-pair">
                  <Btn off={s[i] >= 20} onClick={() => set(coinAdd(s, i, 1))} label={`Add a ${c.name}`}>
                    +
                  </Btn>
                  <Btn off={s[i] <= 0} onClick={() => set(coinAdd(s, i, -1))} label={`Take away a ${c.name}`}>
                    −
                  </Btn>
                </span>
                <span className="mp-tray-count" aria-hidden="true">
                  ×{s[i]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/** A lesson's model: keeps its own state (nothing is saved). */
export function LessonManipulative({ spec }: { spec: ManipSpec }) {
  const model = readSpec(spec).model;
  const [state, setState] = useState<ManipState>(() => startState(model));
  // A new spec (the lesson changed) starts fresh.
  const key = JSON.stringify(spec);
  const last = useRef(key);
  useEffect(() => {
    if (last.current !== key) {
      last.current = key;
      setState(startState(model));
    }
  }, [key, model]);
  return <ManipModel model={model} state={state} onChange={setState} />;
}
