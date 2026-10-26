// Bank editor: the question-type picker, the picture, and the answer fields for each kind
// (choices are edited by the Editor page itself).

import { useEffect, useRef, useState } from "react";
import type { Question, QuestionType } from "../lib/types";
import { BLANK, qtype } from "../lib/questions";
import { DEFAULT_TARGET, ModelFields, modelErrors } from "./ManipEditor";
import { parseMapSpec } from "../lib/mapSpec";
import { parseSpan, parseTimeline } from "../lib/timeline";
import { DEFAULT_TIME_LIMIT, normalizeCodeSpec, type CodeLang, type CodeSpec } from "../lib/code";

const TYPE_NAMES: Record<QuestionType, string> = {
  choice: "Multiple choice",
  text: "Fill in the blank",
  match: "Match",
  order: "Put in order",
  label: "Label a picture",
  model: "Use a math model (blocks, clock, coins…)",
  map: "Map: find or label places",
  timeline: "Place events on a timeline",
  code: "Code exercise",
};

const lines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const uniq = (xs: string[]) => [...new Set(xs)];

/** Defaults when a question changes kind (keeps the stem, topic, section, picture, explanation). */
export function changeKind(q: Question, kind: QuestionType): Question {
  const { left: _l, markers: _m, accept: _a, caseSensitive: _c, type: _t, model: _mo, target: _ta, map: _mp, targets: _tg, marks: _mk, slots: _sl, timeline: _tl, dates: _d, code: _k, ...base } = q;
  switch (kind) {
    case "choice":
      return { ...base, choices: ["", "", "", ""], answer: [0] };
    case "text":
      return { ...base, type: "text", choices: [], answer: [], accept: [[""]] };
    case "match":
      return {
        ...base,
        type: "match",
        left: ["", ""],
        choices: [""],
        answer: [0, 0],
      };
    case "order":
      return { ...base, type: "order", choices: ["", "", ""], answer: [] };
    case "label":
      return { ...base, type: "label", markers: [], choices: [], answer: [] };
    case "model":
      return { ...base, type: "model", choices: [], answer: [], model: { kind: "blocks" }, target: DEFAULT_TARGET.blocks };
    case "map":
      return { ...base, type: "map", map: "base: us", targets: [""], choices: [], answer: [] };
    case "timeline":
      return { ...base, type: "timeline", slots: ["", ""], choices: ["", ""], answer: [0, 1] };
    case "code":
      return {
        ...base,
        type: "code",
        choices: [],
        answer: [],
        code: { language: "python", function: "solve", starter: "def solve(n):\n    pass\n", solution: "def solve(n):\n    return n\n", tests: [{ args: [1], expect: 1 }] },
      };
  }
}

/** Problems that block saving, by kind. */
export function kindErrors(q: Question): string[] {
  const e: string[] = [];
  if (q.image && !q.image.alt.trim()) e.push("Describe the picture (alt text) for people who can't see it.");
  switch (qtype(q)) {
    case "choice":
      if (q.choices.length < 2) e.push("Add at least two choices.");
      if (q.choices.some((c) => !c.trim())) e.push("Fill in or remove empty choices.");
      if (!q.answer.length) e.push("Mark the correct answer.");
      break;
    case "text": {
      const blanks = (q.stem.match(BLANK) ?? []).length;
      if (!q.accept?.length || q.accept.some((a) => !a.some((x) => x.trim()))) e.push("Give at least one accepted answer for each blank.");
      if (blanks > 1 && blanks !== q.accept?.length) e.push(`The question has ${blanks} blanks (___); give accepted answers for each.`);
      break;
    }
    case "match":
      if ((q.left?.length ?? 0) < 2) e.push("Add at least two pairs.");
      if (q.left?.some((l) => !l.trim()) || q.answer.some((a) => !q.choices[a]?.trim())) e.push("Fill in both sides of every pair.");
      if (q.left && new Set(q.left.map((l) => l.trim())).size !== q.left.length) e.push("Each item on the left must be different.");
      break;
    case "order":
      if (q.choices.length < 2) e.push("Add at least two items.");
      if (q.choices.some((c) => !c.trim())) e.push("Fill in or remove empty items.");
      if (new Set(q.choices.map((c) => c.trim())).size !== q.choices.length) e.push("Each item must be different.");
      break;
    case "label":
      if (!q.image) e.push("Add a picture to label.");
      if ((q.markers?.length ?? 0) < 2) e.push("Click the picture to place at least two numbered markers.");
      if (q.answer.some((a) => !q.choices[a]?.trim())) e.push("Name every marker.");
      break;
    case "model":
      e.push(...modelErrors(q.model, q.target));
      break;
    case "order":
      if (q.dates?.some((d) => !parseSpan(d))) e.push(`A date can't be read (examples: 1776, July 4, 1776, 44 BCE).`);
      break;
    case "map": {
      const p = parseMapSpec(q.map ?? "").problems[0];
      if (!q.map?.trim()) e.push("Describe the map (at least a base: line).");
      else if (p) e.push(`Map: ${p}.`);
      if (q.targets) {
        if (!q.targets.some((t) => t.trim())) e.push("Name at least one place to find.");
      } else if ((q.marks?.length ?? 0) < 2) e.push("Name at least two places to number.");
      break;
    }
    case "timeline":
      if ((q.slots?.length ?? 0) < 2) e.push("Add at least two events.");
      if (q.slots?.some((d) => !parseSpan(d))) e.push(`Every event needs a date the app can read (examples: 1776, July 4, 1776, 44 BCE, c. 3000 BCE).`);
      if (q.answer.some((a) => !q.choices[a]?.trim())) e.push("Describe every event.");
      if (q.timeline?.trim()) {
        const p = parseTimeline(q.timeline).problems.find((x) => !x.startsWith("no event"));
        if (p) e.push(`Periods: ${p}.`);
      }
      break;
    case "code":
      try {
        normalizeCodeSpec(q.code);
      } catch (err) {
        e.push(`The exercise ${(err as Error).message.replace(/^\(code\) /, "")}`);
      }
      if (!q.code?.solution?.trim()) e.push("Add a model solution (shown after a correct answer).");
      break;
  }
  return e;
}

/** Code exercise fields: language, function name, starter and model code, tests (as JSON), hints. */
function CodeFields({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  const spec: CodeSpec = q.code ?? { language: "python", starter: "", tests: [] };
  const set = (patch: Partial<CodeSpec>) => onChange({ ...q, code: { ...spec, ...patch } });
  const [testsText, setTestsText] = useState(() => JSON.stringify(spec.tests, null, 2));
  const [testsError, setTestsError] = useState("");
  useEffect(() => {
    setTestsText(JSON.stringify(q.code?.tests ?? [], null, 2));
    setTestsError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);
  return (
    <div className="field code-fields">
      <div className="row">
        <label className="field">
          <span>Language</span>
          <select className="select" value={spec.language} onChange={(e) => set({ language: e.target.value as CodeLang })}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </label>
        <label className="field">
          <span>Function the tests call (optional)</span>
          <input className="input code-input" value={spec.function ?? ""} spellCheck={false} onChange={(e) => set({ function: e.target.value.trim() || undefined })} />
        </label>
        <label className="field">
          <span>Seconds per test</span>
          <input
            className="input"
            type="number"
            min={1}
            max={30}
            value={spec.timeLimit ?? DEFAULT_TIME_LIMIT}
            onChange={(e) => set({ timeLimit: Number(e.target.value) === DEFAULT_TIME_LIMIT ? undefined : Number(e.target.value) })}
          />
        </label>
      </div>
      <label className="field">
        <span>Starter code (what the student sees first)</span>
        <textarea className="textarea code-input" rows={5} spellCheck={false} value={spec.starter} onChange={(e) => set({ starter: e.target.value })} />
      </label>
      <label className="field">
        <span>Model solution (shown after a correct answer, or on request after checking)</span>
        <textarea className="textarea code-input" rows={5} spellCheck={false} value={spec.solution ?? ""} onChange={(e) => set({ solution: e.target.value || undefined })} />
      </label>
      <label className="field">
        <span>Tests (JSON list)</span>
        <textarea
          className="textarea code-input"
          rows={8}
          spellCheck={false}
          value={testsText}
          aria-invalid={!!testsError}
          aria-describedby="code-tests-help"
          onChange={(e) => setTestsText(e.target.value)}
          onBlur={() => {
            try {
              const tests = JSON.parse(testsText);
              if (!Array.isArray(tests)) throw new Error("Tests must be a list: [ … ].");
              setTestsError("");
              set({ tests });
            } catch (err) {
              setTestsError((err as Error).message);
            }
          }}
        />
      </label>
      <p id="code-tests-help" className="small muted">
        Each test is <code>{`{ "args": [3], "expect": 6 }`}</code> (calls the function) or <code>{`{ "stdin": ["Ada"], "stdout": "Hello, Ada!" }`}</code> (runs the program
        and compares what it prints). Add <code>"hidden": true</code> to keep a test's details from the student.
      </p>
      {testsError && (
        <p className="small bad" role="alert">
          Tests aren't valid JSON yet: {testsError}
        </p>
      )}
      <label className="field">
        <span>Hints (optional, one per line, shown one at a time)</span>
        <textarea
          className="textarea"
          rows={2}
          defaultValue={(spec.hints ?? []).join("\n")}
          key={q.id}
          onBlur={(e) => set({ hints: lines(e.target.value).length ? lines(e.target.value) : undefined })}
        />
      </label>
    </div>
  );
}

export function KindPicker({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  return (
    <label className="field">
      <span>Question type</span>
      <select className="select" value={qtype(q)} onChange={(e) => onChange(changeKind(q, e.target.value as QuestionType))}>
        {(Object.keys(TYPE_NAMES) as QuestionType[]).map((k) => (
          <option key={k} value={k}>
            {TYPE_NAMES[k]}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Picture for any question (stored in the bank as a data: URL). */
export function PictureField({ q, onChange, toast }: { q: Question; onChange: (q: Question) => void; toast: (s: string) => void }) {
  const file = useRef<HTMLInputElement>(null);
  function pick(f: File | undefined) {
    if (!f) return;
    if (!/^image\/(png|jpeg|gif|webp|svg\+xml)$/.test(f.type)) return toast("Use a PNG, JPG, GIF, WebP or SVG picture.");
    if (f.size > 1_500_000) return toast("That picture is over 1.5 MB. Use a smaller one.");
    const r = new FileReader();
    r.onload = () =>
      onChange({
        ...q,
        image: {
          src: String(r.result),
          alt: q.image?.alt ?? "",
          caption: q.image?.caption,
        },
      });
    r.readAsDataURL(f);
  }
  return (
    <div className="field">
      <span>Picture{qtype(q) === "label" ? "" : " (optional)"}</span>
      {q.image ? (
        <div className="stack" style={{ gap: 8 }}>
          {qtype(q) !== "label" && <img src={q.image.src} alt="" className="editor-pic" />}
          <label className="field">
            <span>Describe the picture (for screen readers)</span>
            <input className="input" value={q.image.alt} onChange={(e) => onChange({ ...q, image: { ...q.image!, alt: e.target.value } })} />
          </label>
          <div className="row">
            <button className="btn sm" onClick={() => file.current?.click()}>
              Replace picture
            </button>
            <button className="btn sm ghost" onClick={() => onChange({ ...q, image: undefined })}>
              Remove picture
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn sm" onClick={() => file.current?.click()}>
            Add picture
          </button>
        </div>
      )}
      <input
        ref={file}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}

/** Answer fields for text, match, order and label questions. */
export function KindFields({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  const kind = qtype(q);

  if (kind === "map") return <MapFields q={q} onChange={onChange} />;
  if (kind === "timeline") return <TimelineFields q={q} onChange={onChange} />;
  if (kind === "code") return <CodeFields q={q} onChange={onChange} />;

  if (kind === "text") {
    const blanks = Math.max(1, (q.stem.match(BLANK) ?? []).length);
    const accept = Array.from({ length: blanks }, (_, i) => q.accept?.[i] ?? [""]);
    return (
      <div className="field">
        <span>Accepted answers</span>
        <p className="small muted">
          Mark each blank in the question with three underscores: ___. List every answer to accept, one per line. Spacing, capital letters and a final
          period are ignored.
        </p>
        {accept.map((a, i) => (
          <label key={i} className="field">
            <span>{blanks > 1 ? `Blank ${i + 1}` : "Answers"}</span>
            <textarea
              className="textarea"
              rows={2}
              value={a.join("\n")}
              onChange={(e) =>
                onChange({
                  ...q,
                  accept: accept.map((x, j) => (j === i ? e.target.value.split("\n") : x)),
                })
              }
              onBlur={() =>
                onChange({
                  ...q,
                  accept: accept.map((x) => (lines(x.join("\n")).length ? lines(x.join("\n")) : [""])),
                })
              }
            />
          </label>
        ))}
        <label className="check small">
          <input type="checkbox" checked={!!q.caseSensitive} onChange={(e) => onChange({ ...q, caseSensitive: e.target.checked || undefined })} />
          Capital letters must match
        </label>
      </div>
    );
  }

  if (kind === "match") {
    const pairs = (q.left ?? []).map((l, i) => [l, q.choices[q.answer[i]] ?? ""] as [string, string]);
    const extra = q.choices.filter((_, i) => !q.answer.includes(i));
    const rebuild = (ps: [string, string][], ds: string[]) => {
      const choices = uniq([...ps.map((p) => p[1]), ...ds]);
      onChange({
        ...q,
        left: ps.map((p) => p[0]),
        choices,
        answer: ps.map((p) => choices.indexOf(p[1])),
      });
    };
    return (
      <div className="field">
        <span>Pairs (left item and its match)</span>
        {pairs.map(([l, r], i) => (
          <div key={i} className="pair-edit">
            <input
              className="input"
              aria-label={`Pair ${i + 1} left`}
              value={l}
              placeholder="Item"
              onChange={(e) =>
                rebuild(
                  pairs.map((p, j) => (j === i ? [e.target.value, p[1]] : p)),
                  extra,
                )
              }
            />
            <span aria-hidden="true">→</span>
            <input
              className="input"
              aria-label={`Pair ${i + 1} match`}
              value={r}
              placeholder="Its match"
              onChange={(e) =>
                rebuild(
                  pairs.map((p, j) => (j === i ? [p[0], e.target.value] : p)),
                  extra,
                )
              }
            />
            <button
              className="btn ghost sm"
              aria-label={`Remove pair ${i + 1}`}
              disabled={pairs.length <= 2}
              onClick={() =>
                rebuild(
                  pairs.filter((_, j) => j !== i),
                  extra,
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn sm" disabled={pairs.length >= 8} onClick={() => rebuild([...pairs, ["", ""]], extra)}>
            Add pair
          </button>
        </div>
        <label className="field">
          <span>Extra wrong matches (optional, one per line)</span>
          <textarea className="textarea" rows={2} defaultValue={extra.join("\n")} key={q.id} onBlur={(e) => rebuild(pairs, lines(e.target.value))} />
        </label>
        <p className="small muted">Items on the left may share a match (sorting into groups).</p>
      </div>
    );
  }

  if (kind === "order") {
    const set = (choices: string[]) => onChange({ ...q, choices });
    return (
      <div className="field">
        <span>Items, in the correct order (learners see them shuffled)</span>
        {q.choices.map((c, i) => (
          <div key={i} className="pair-edit">
            <span className="order-num" aria-hidden="true">
              {i + 1}
            </span>
            <input
              className="input"
              aria-label={`Item ${i + 1}`}
              value={c}
              onChange={(e) => set(q.choices.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <input
              className="input date-input"
              aria-label={`Item ${i + 1} date (optional)`}
              placeholder="Date (optional)"
              value={q.dates?.[i] ?? ""}
              onChange={(e) => {
                const dates = q.choices.map((_, j) => (j === i ? e.target.value : (q.dates?.[j] ?? "")));
                onChange({ ...q, dates: dates.some((d) => d.trim()) ? dates : undefined });
              }}
            />
            <button
              className="btn ghost sm"
              aria-label={`Move item ${i + 1} up`}
              disabled={i === 0}
              onClick={() => set(q.choices.map((x, j) => (j === i - 1 ? q.choices[i] : j === i ? q.choices[i - 1] : x)))}
            >
              ↑
            </button>
            <button
              className="btn ghost sm"
              aria-label={`Remove item ${i + 1}`}
              disabled={q.choices.length <= 2}
              onClick={() => set(q.choices.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn sm" disabled={q.choices.length >= 10} onClick={() => set([...q.choices, ""])}>
            Add item
          </button>
        </div>
      </div>
    );
  }

  if (kind === "model")
    return <ModelFields idBase={`mf-${q.id}`} model={q.model} target={q.target} onChange={(model, target) => onChange({ ...q, model, target })} />;

  if (kind === "label") {
    const names = q.answer.map((a) => q.choices[a] ?? "");
    const extra = q.choices.filter((_, i) => !q.answer.includes(i));
    const rebuild = (markers: { x: number; y: number }[], ns: string[], ds: string[]) => {
      const choices = uniq([...ns, ...ds]);
      onChange({
        ...q,
        markers,
        choices,
        answer: ns.map((n) => choices.indexOf(n)),
      });
    };
    const place = (e: React.MouseEvent<HTMLDivElement>) => {
      const box = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - box.left) / box.width) * 1000) / 10;
      const y = Math.round(((e.clientY - box.top) / box.height) * 1000) / 10;
      rebuild([...(q.markers ?? []), { x, y }], [...names, `Part ${names.length + 1}`], extra);
    };
    if (!q.image) return <p className="small muted">Add a picture above, then click it to place numbered markers.</p>;
    return (
      <div className="field">
        <span>Markers: click the picture to add one (or use Add marker), then name each</span>
        <div className="q-image-box editor-label-pic" onClick={place}>
          <img src={q.image.src} alt="" />
          {q.markers?.map((m, i) => (
            <span key={i} className="q-marker" style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-hidden="true">
              {i + 1}
            </span>
          ))}
        </div>
        {names.map((n, i) => (
          <div key={i} className="pair-edit">
            <span className="q-marker inline" aria-hidden="true">
              {i + 1}
            </span>
            <input
              className="input"
              aria-label={`Marker ${i + 1} name`}
              value={n}
              onChange={(e) =>
                rebuild(
                  q.markers ?? [],
                  names.map((x, j) => (j === i ? e.target.value : x)),
                  extra,
                )
              }
            />
            {(["x", "y"] as const).map((k) => (
              <input
                key={k}
                className="input num-input"
                type="number"
                min={0}
                max={100}
                step={0.5}
                aria-label={`Marker ${i + 1} ${k === "x" ? "across" : "down"} (percent)`}
                title={k === "x" ? "Across (%)" : "Down (%)"}
                value={q.markers?.[i]?.[k] ?? 0}
                onChange={(e) =>
                  rebuild(
                    (q.markers ?? []).map((m, j) =>
                      j === i
                        ? {
                            ...m,
                            [k]: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          }
                        : m,
                    ),
                    names,
                    extra,
                  )
                }
              />
            ))}
            <button
              className="btn ghost sm"
              aria-label={`Remove marker ${i + 1}`}
              onClick={() =>
                rebuild(
                  (q.markers ?? []).filter((_, j) => j !== i),
                  names.filter((_, j) => j !== i),
                  extra,
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <div className="row">
          <button className="btn sm" onClick={() => rebuild([...(q.markers ?? []), { x: 50, y: 50 }], [...names, `Part ${names.length + 1}`], extra)}>
            Add marker
          </button>
        </div>
        <label className="field">
          <span>Extra wrong labels (optional, one per line)</span>
          <textarea
            className="textarea"
            rows={2}
            defaultValue={extra.join("\n")}
            key={q.id}
            onBlur={(e) => rebuild(q.markers ?? [], names, lines(e.target.value))}
          />
        </label>
      </div>
    );
  }
  return null;
}

/** Map questions: the map (block syntax) and either places to find or places to number. */
function MapFields({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  const find = !!q.targets;
  const names = find ? (q.targets ?? []) : (q.marks ?? []);
  const extra = find ? [] : q.choices.filter((c) => !(q.marks ?? []).includes(c));
  const setNames = (ns: string[], ds: string[] = extra) => {
    if (find) return onChange({ ...q, targets: ns, choices: [], answer: [] });
    const choices = uniq([...ns, ...ds]);
    onChange({ ...q, marks: ns, choices, answer: ns.map((n) => choices.indexOf(n)) });
  };
  return (
    <div className="field">
      <label className="field">
        <span>Map</span>
        <textarea className="textarea mono" rows={5} value={q.map ?? ""} onChange={(e) => onChange({ ...q, map: e.target.value })} />
      </label>
      <p className="small muted">
        Same lines as a map in a lesson: <code>base: world</code> or <code>base: us</code>, <code>view: fit</code>, <code>region: France, Spain | Group</code>,{" "}
        <code>point: Denver | 39.74, -104.99</code>. See the course format guide.
      </p>
      <fieldset className="row" style={{ border: 0, padding: 0, gap: 16 }}>
        <legend className="small">The learner</legend>
        <label className="check small">
          <input type="radio" checked={find} onChange={() => onChange({ ...q, targets: q.marks?.length ? q.marks : [""], marks: undefined, choices: [], answer: [] })} />
          clicks the named place(s)
        </label>
        <label className="check small">
          <input
            type="radio"
            checked={!find}
            onChange={() => {
              const ms = (q.targets ?? []).filter((t) => t.trim());
              const marks = ms.length >= 2 ? ms : [...ms, "", ""].slice(0, Math.max(2, ms.length));
              onChange({ ...q, targets: undefined, marks, choices: marks, answer: marks.map((_, i) => i) });
            }}
          />
          names numbered places
        </label>
      </fieldset>
      <label className="field">
        <span>{find ? "Places to click (one per line; the question should name them)" : "Places to number (one per line, in order: regions or points on the map)"}</span>
        <textarea className="textarea" rows={3} value={names.join("\n")} onChange={(e) => setNames(e.target.value.split("\n"))} onBlur={() => setNames(lines(names.join("\n")))} />
      </label>
      {!find && (
        <label className="field">
          <span>Extra wrong names (optional, one per line)</span>
          <textarea className="textarea" rows={2} defaultValue={extra.join("\n")} key={q.id} onBlur={(e) => setNames(names, lines(e.target.value))} />
        </label>
      )}
    </div>
  );
}

/** Timeline questions: events with their dates (the slots), extra wrong events, optional periods. */
function TimelineFields({ q, onChange }: { q: Question; onChange: (q: Question) => void }) {
  const rows = (q.slots ?? []).map((d, i) => [d, q.choices[q.answer[i]] ?? ""] as [string, string]);
  const extra = q.choices.filter((_, i) => !q.answer.includes(i));
  const rebuild = (rs: [string, string][], ds: string[] = extra) => {
    const choices = uniq([...rs.map((r) => r[1]), ...ds]);
    onChange({ ...q, slots: rs.map((r) => r[0]), choices, answer: rs.map((r) => choices.indexOf(r[1])) });
  };
  return (
    <div className="field">
      <span>Events and their dates (numbered on the timeline; learners place each event)</span>
      {rows.map(([d, ev], i) => (
        <div key={i} className="pair-edit">
          <span className="q-marker inline" aria-hidden="true">
            {i + 1}
          </span>
          <input className="input date-input" aria-label={`Slot ${i + 1} date`} placeholder="Date, e.g. 1776" value={d} onChange={(e) => rebuild(rows.map((r, j) => (j === i ? [e.target.value, r[1]] : r)))} />
          <input className="input" aria-label={`Slot ${i + 1} event`} placeholder="What happened" value={ev} onChange={(e) => rebuild(rows.map((r, j) => (j === i ? [r[0], e.target.value] : r)))} />
          <button className="btn ghost sm" aria-label={`Remove slot ${i + 1}`} disabled={rows.length <= 2} onClick={() => rebuild(rows.filter((_, j) => j !== i))}>
            Remove
          </button>
        </div>
      ))}
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn sm" disabled={rows.length >= 8} onClick={() => rebuild([...rows, ["", ""]])}>
          Add event
        </button>
      </div>
      <label className="field">
        <span>Extra wrong events (optional, one per line)</span>
        <textarea className="textarea" rows={2} defaultValue={extra.join("\n")} key={q.id} onBlur={(e) => rebuild(rows, lines(e.target.value))} />
      </label>
      <label className="field">
        <span>Periods shown for context (optional; lines like era: 1861–1865 | Civil War)</span>
        <textarea className="textarea mono" rows={2} value={q.timeline ?? ""} onChange={(e) => onChange({ ...q, timeline: e.target.value || undefined })} />
      </label>
    </div>
  );
}
