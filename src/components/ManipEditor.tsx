// Editor fields for a model question (bank editor and community courses): pick the
// manipulative, set where it starts, then set the right answer by changing the model itself.

import { useEffect, useRef, useState } from "react";
import { ManipModel } from "./Manipulative";
import {
  COINS,
  MANIP_KINDS,
  MANIP_NAMES,
  readSpec,
  solution,
  startState,
  targetFromState,
  targetProblems,
  targetText,
  validState,
  type ManipKind,
  type ManipSpec,
  type ManipState,
  type ManipTarget,
} from "../lib/manip";

/** A first right answer for a new model question (never the starting state). */
export const DEFAULT_TARGET: Record<ManipKind, ManipTarget> = {
  counters: { count: 5 },
  blocks: { value: 47 },
  numberline: { at: 3 },
  fractions: { values: ["1/2"] },
  clock: { time: "3:00" },
  coins: { cents: 25 },
};

/** Problems that block saving, in plain words. */
export function modelErrors(model: ManipSpec | undefined, target: ManipTarget | undefined): string[] {
  if (!model) return ["Choose a model."];
  const r = readSpec(model);
  return [...r.problems, ...targetProblems(r.model, target)].map((p) => p.charAt(0).toUpperCase() + p.slice(1) + ".");
}

const list = (v: unknown) => (Array.isArray(v) ? v.join(", ") : v === undefined ? "" : String(v));
const splitList = (s: string) => s.split(/[\s,]+/).filter(Boolean);
const numOrText = (s: string): number | string | undefined => (s.trim() === "" ? undefined : /^-?\d+(\.\d+)?$/.test(s.trim()) ? Number(s) : s.trim());

/** Choosing the model and how it starts (model questions and community lesson blocks). */
export function ModelStartFields({
  spec,
  onSpec,
  onKind,
  idBase,
  withCaption,
}: {
  spec: ManipSpec;
  onSpec: (spec: ManipSpec) => void;
  onKind: (kind: ManipKind) => void;
  idBase: string;
  /** Lesson blocks: a line shown above the model. */
  withCaption?: boolean;
}) {
  const { model: m } = readSpec(spec);
  const setSpec = (patch: Partial<ManipSpec>) => {
    const next = { ...spec, ...patch } as Record<string, unknown>;
    for (const k of Object.keys(next)) if (next[k] === undefined || next[k] === "") delete next[k];
    onSpec(next as unknown as ManipSpec);
  };
  const id = (k: string) => `${idBase}-${k}`;

  const text = (key: keyof ManipSpec, label: string, hint?: string, asList = false) => (
    <label className="field" htmlFor={id(key)}>
      <span>{label}</span>
      <input
        id={id(key)}
        className="input"
        value={list(spec[key])}
        placeholder={hint}
        onChange={(e) => setSpec({ [key]: asList ? (e.target.value.trim() ? splitList(e.target.value) : undefined) : numOrText(e.target.value) } as Partial<ManipSpec>)}
      />
    </label>
  );
  const pick = (key: keyof ManipSpec, label: string, values: number[], names?: string[], def = values[0]) => (
    <label className="field" htmlFor={id(key)}>
      <span>{label}</span>
      <select id={id(key)} className="select" value={String(spec[key] ?? def)} onChange={(e) => setSpec({ [key]: Number(e.target.value) } as Partial<ManipSpec>)}>
        {values.map((v, i) => (
          <option key={v} value={v}>
            {names?.[i] ?? v}
          </option>
        ))}
      </select>
    </label>
  );
  const whole = (key: keyof ManipSpec, label: string) => (
    <label className="field" htmlFor={id(key)}>
      <span>{label}</span>
      <input
        id={id(key)}
        className="input num-input"
        type="number"
        min={0}
        value={spec[key] === undefined ? "" : String(spec[key])}
        onChange={(e) => setSpec({ [key]: e.target.value === "" ? undefined : Number(e.target.value) } as Partial<ManipSpec>)}
      />
    </label>
  );

  return (
    <>
      <label className="field" htmlFor={id("kind")}>
        <span>Model</span>
        <select
          id={id("kind")}
          className="select"
          value={spec.kind}
          onChange={(e) => {
            onKind(e.target.value as ManipKind);
          }}
        >
          {MANIP_KINDS.map((k) => (
            <option key={k} value={k}>
              {MANIP_NAMES[k]}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="plain-fieldset">
        <legend className="small">How the model starts</legend>
        <div className="form-grid">
          {spec.kind === "counters" && (
            <>
              {pick("frames", "Ten-frames", [1, 2])}
              {pick("colors", "Colors", [1, 2], ["One (red)", "Two (red and yellow)"])}
              {whole("count", "Red counters at the start")}
              {m.colors === 2 && whole("count2", "Yellow counters at the start")}
            </>
          )}
          {spec.kind === "blocks" && (
            <>
              {pick("places", "Places", [1, 2, 3, 4], ["Ones", "Tens and ones", "Hundreds, tens, ones", "Thousands to ones"], 3)}
              {whole("value", "Number built at the start")}
            </>
          )}
          {spec.kind === "numberline" && (
            <>
              {text("min", "Smallest number", "0")}
              {text("max", "Largest number", "10")}
              {text("step", "Space between ticks (1, 0.5 or 1/4)", "1")}
              {text("at", "Marker starts at", "0")}
              {text("hops", "Hop buttons (sizes, separated by commas)", "1", true)}
            </>
          )}
          {spec.kind === "fractions" && (
            <>
              {text("bars", "Bars at the start (shaded/parts, separated by commas)", "0/4", true)}
              <label className="check small">
                <input type="checkbox" checked={!!spec.fixed} onChange={(e) => setSpec({ fixed: e.target.checked || undefined })} />
                Learners can't change the number of parts
              </label>
            </>
          )}
          {spec.kind === "clock" && (
            <>
              {text("time", "Time at the start", "12:00")}
              {pick("step", "Minute hand moves by", [5, 1, 15, 30], ["5 minutes", "1 minute", "15 minutes", "30 minutes"])}
            </>
          )}
          {spec.kind === "coins" && (
            <fieldset className="plain-fieldset span-2">
              <legend className="small">Coins offered</legend>
              <div className="row">
                {COINS.map((c, i) => (
                  <label key={c.id} className="check small">
                    <input
                      type="checkbox"
                      checked={m.coins.includes(i)}
                      onChange={(e) => {
                        const next = e.target.checked ? [...m.coins, i] : m.coins.filter((x) => x !== i);
                        setSpec({ coins: next.length ? COINS.filter((_, j) => next.includes(j)).map((x) => x.id) : undefined });
                      }}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {withCaption && <div className="span-2">{text("caption", "Caption (optional): what to try with the model")}</div>}
          <label className="check small span-2">
            <input type="checkbox" checked={spec.readout !== false} onChange={(e) => setSpec({ readout: e.target.checked ? undefined : false })} />
            Show the total next to the model (the number, amount, time or fraction)
          </label>
        </div>
      </fieldset>

    </>
  );
}

/** A model question's fields: the model, how it starts, and the right answer (set on the model). */
export function ModelFields({
  model,
  target,
  onChange,
  idBase,
}: {
  model?: ManipSpec;
  target?: ManipTarget;
  onChange: (model: ManipSpec, target: ManipTarget) => void;
  /** Makes the field ids unique on the page. */
  idBase: string;
}) {
  const spec: ManipSpec = model ?? { kind: "blocks" };
  const { model: m } = readSpec(spec);
  const t = target ?? {};
  const opts = { fewest: !!t.fewest, exact: !!t.exact, colors: !!t.colors };
  const fromTarget = (): ManipState => {
    const sol = target ? solution(m, target) : null;
    return sol && validState(m, sol) ? sol : startState(m);
  };
  const [answer, setAnswer] = useState<ManipState>(fromTarget);
  // A changed model (kind, size, parts...) redraws the answer from the saved target.
  const specKey = JSON.stringify(spec);
  const last = useRef(specKey);
  useEffect(() => {
    if (last.current === specKey) return;
    last.current = specKey;
    setAnswer(fromTarget());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey]);
  const setOpts = (o: Partial<typeof opts>) => onChange(spec, targetFromState(m, answer, { ...opts, ...o }));
  const errs = modelErrors(spec, target);

  return (
    <div className="field model-fields">
      <ModelStartFields spec={spec} idBase={idBase} onSpec={(next) => onChange(next, t)} onKind={(kind) => onChange({ kind }, DEFAULT_TARGET[kind])} />

      <fieldset className="plain-fieldset">
        <legend className="small">Right answer: change the model to show it</legend>
        <ManipModel
          model={m}
          state={answer}
          label="Right answer"
          onChange={(s) => {
            setAnswer(s);
            onChange(spec, targetFromState(m, s, opts));
          }}
        />
        {spec.kind === "blocks" && (
          <label className="check small">
            <input type="checkbox" checked={opts.fewest} onChange={(e) => setOpts({ fewest: e.target.checked })} />
            Only the usual way (no place with 10 or more blocks)
          </label>
        )}
        {spec.kind === "coins" && (
          <label className="check small">
            <input type="checkbox" checked={opts.fewest} onChange={(e) => setOpts({ fewest: e.target.checked })} />
            Must use the fewest coins
          </label>
        )}
        {spec.kind === "fractions" && (
          <label className="check small">
            <input type="checkbox" checked={opts.exact} onChange={(e) => setOpts({ exact: e.target.checked })} />
            Exactly this many parts (otherwise any equal fraction is right)
          </label>
        )}
        {spec.kind === "counters" && m.colors === 2 && (
          <label className="check small">
            <input type="checkbox" checked={opts.colors} onChange={(e) => setOpts({ colors: e.target.checked })} />
            The number of each color must match too
          </label>
        )}
        <p className="small">
          <span className="muted">Accepted: </span>
          {target ? targetText(m, target) : "(not set yet)"}
        </p>
      </fieldset>
      {errs.length > 0 && (
        <ul className="small model-errors" role="status">
          {errs.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
