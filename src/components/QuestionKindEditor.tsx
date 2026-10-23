// Bank editor: the question-type picker, the picture, and the answer fields for each kind
// (choices are edited by the Editor page itself).

import { useRef } from "react";
import type { Question, QuestionType } from "../lib/types";
import { BLANK, qtype } from "../lib/questions";

const TYPE_NAMES: Record<QuestionType, string> = {
  choice: "Multiple choice",
  text: "Fill in the blank",
  match: "Match",
  order: "Put in order",
  label: "Label a picture",
};

const lines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const uniq = (xs: string[]) => [...new Set(xs)];

/** Defaults when a question changes kind (keeps the stem, topic, section, picture, explanation). */
export function changeKind(q: Question, kind: QuestionType): Question {
  const { left: _l, markers: _m, accept: _a, caseSensitive: _c, type: _t, ...base } = q;
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
  }
  return e;
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
