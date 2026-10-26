// Question editor for community courses: every question type official courses have
// (multiple choice, select all, typed answers with blanks, matching, labeling a picture,
// putting in order), with an optional picture. Used in lessons and module quizzes.

import { useState } from "react";
import type { AppApi } from "../App";
import { api as community, imageUrl } from "../lib/community";
import { LIMITS, type CQuestion, type QKind } from "../lib/communityFormat";
import { shrinkImage } from "../lib/portfolio";
import { DEFAULT_TARGET, ModelFields } from "../components/ManipEditor";

export const Q_KIND_LABEL: Record<QKind, string> = {
  choice: "Multiple choice",
  text: "Type the answer",
  match: "Match",
  label: "Label a picture",
  order: "Put in order",
  model: "Math model (blocks, clock, coins…)",
};

/** Upload a picture to the community store (large photos are shrunk first). */
export async function uploadImage(f: File): Promise<string> {
  const blob = f.size > 1.5 * 1024 * 1024 || f.type === "image/jpeg" ? await (await fetch(await shrinkImage(f))).blob() : f;
  return (await community.upload(blob)).id;
}

export function ImagePicker({ api, label, onPicked }: { api: AppApi; label: string; onPicked: (id: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="field">
      <span>{label} (PNG, JPEG, WebP or GIF)</span>
      <input
        className="input"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={busy}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            onPicked(await uploadImage(f));
          } catch (err) {
            api.toast((err as Error).message);
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </label>
  );
}

export const newQuestion = (id: string, kind: QKind = "choice"): CQuestion => ({ id, kind, stem: "", choices: ["", ""], answer: [], explanation: "" });

/** Switch type, keeping the stem, picture and explanation. */
function retype(q: CQuestion, kind: QKind): CQuestion {
  const base = { id: q.id, kind, stem: q.stem, explanation: q.explanation, imageId: q.imageId, imageAlt: q.imageAlt };
  switch (kind) {
    case "choice":
      return { ...base, choices: q.choices.length >= 2 ? q.choices : ["", ""], answer: [] };
    case "text":
      return { ...base, choices: [], answer: [], accept: [[""]] };
    case "match":
      return { ...base, left: ["", ""], choices: ["", ""], answer: [0, 1] };
    case "label":
      return { ...base, markers: [], choices: [], answer: [] };
    case "order":
      return { ...base, choices: q.choices.length >= 2 ? q.choices : ["", "", ""], answer: [] };
    case "model":
      return { ...base, choices: [], answer: [], model: { kind: "blocks" }, target: DEFAULT_TARGET.blocks };
  }
}

/** Pairs (left item or marker → right answer) and extra wrong answers, from choices + answer. */
function pairs(q: CQuestion) {
  const rights = q.answer.map((a) => q.choices[a] ?? "");
  const extra = q.choices.filter((_, i) => !q.answer.includes(i));
  return { rights, extra };
}
/** Choices = the distinct right answers, then the extra ones; answer points into them. */
function fromPairs(rights: string[], extra: string[]): { choices: string[]; answer: number[] } {
  const choices: string[] = [];
  const answer = rights.map((r) => {
    const i = choices.findIndex((c) => c.trim() && c === r);
    if (i >= 0) return i;
    choices.push(r);
    return choices.length - 1;
  });
  return { choices: [...choices, ...extra], answer };
}

export function QuestionEditor({ api, q, onChange }: { api: AppApi; q: CQuestion; onChange: (q: CQuestion) => void }) {
  const kind = q.kind ?? "choice";
  const blanks = Math.max(1, (q.stem.match(/_{3,}/g) ?? []).length);
  const set = (p: Partial<CQuestion>) => onChange({ ...q, ...p });
  const { rights, extra } = pairs(q);

  return (
    <>
      <label className="field">
        <span>Question type</span>
        <select className="select" value={kind} onChange={(e) => onChange(retype(q, e.target.value as QKind))}>
          {(Object.keys(Q_KIND_LABEL) as QKind[]).map((k) => (
            <option key={k} value={k}>
              {Q_KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>
          Question{kind === "text" ? " (mark each blank with ___ ; no blank = one answer box under the question)" : ""} · math: $x^2$
        </span>
        <textarea className="textarea" rows={2} value={q.stem} maxLength={LIMITS.text} onChange={(e) => set({ stem: e.target.value })} />
      </label>

      <div className="form-grid">
        {q.imageId && (
          <div className="span-2">
            <LabelImage q={q} onChange={onChange} editable={kind === "label"} />
          </div>
        )}
        <ImagePicker api={api} label={q.imageId ? "Replace picture" : kind === "label" ? "Picture to label" : "Picture (optional)"} onPicked={(id) => set({ imageId: id })} />
        {q.imageId && (
          <label className="field">
            <span>Describe the picture (alt text)</span>
            <input className="input" value={q.imageAlt ?? ""} maxLength={LIMITS.short} onChange={(e) => set({ imageAlt: e.target.value })} />
          </label>
        )}
        {q.imageId && kind !== "label" && (
          <button className="btn sm ghost" onClick={() => set({ imageId: undefined, imageAlt: undefined })}>
            Remove picture
          </button>
        )}
      </div>

      {kind === "choice" && (
        <fieldset className="plain-fieldset choices-edit">
          <legend className="small">Choices (check the right answer; check more than one for "select all that apply")</legend>
          {q.choices.map((c, ci) => (
            <div key={ci} className="row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={q.answer.includes(ci)}
                  onChange={(e) => set({ answer: e.target.checked ? [...q.answer, ci].sort((a, b) => a - b) : q.answer.filter((x) => x !== ci) })}
                />
                <span className="sr-only">Choice {ci + 1} is right</span>
              </label>
              <input
                className="input grow"
                aria-label={`Choice ${ci + 1}`}
                value={c}
                maxLength={LIMITS.short}
                onChange={(e) => set({ choices: q.choices.map((x, i) => (i === ci ? e.target.value : x)) })}
              />
              <button
                className="btn sm ghost"
                disabled={q.choices.length <= 2}
                onClick={() => set({ choices: q.choices.filter((_, i) => i !== ci), answer: q.answer.filter((x) => x !== ci).map((x) => (x > ci ? x - 1 : x)) })}
              >
                Remove<span className="sr-only"> choice {ci + 1}</span>
              </button>
            </div>
          ))}
          <button className="btn sm" disabled={q.choices.length >= LIMITS.choices} onClick={() => set({ choices: [...q.choices, ""] })}>
            Add choice
          </button>
        </fieldset>
      )}

      {kind === "text" && (
        <fieldset className="plain-fieldset">
          <legend className="small">Accepted answers, one per line (spacing and, unless checked, capital letters don't matter)</legend>
          {Array.from({ length: blanks }, (_, bi) => (
            <label key={bi} className="field">
              <span>{blanks > 1 ? `Blank ${bi + 1}` : "Answer"}</span>
              <textarea
                className="textarea"
                rows={2}
                value={(q.accept?.[bi] ?? []).join("\n")}
                onChange={(e) => {
                  const accept = Array.from({ length: blanks }, (_, i) => q.accept?.[i] ?? [""]);
                  accept[bi] = e.target.value.split("\n").slice(0, 20);
                  set({ accept });
                }}
              />
            </label>
          ))}
          {(q.accept?.length ?? 0) > blanks && (
            <button className="btn sm ghost" onClick={() => set({ accept: q.accept!.slice(0, blanks) })}>
              Drop answers for blanks that were removed
            </button>
          )}
          <label className="check">
            <input type="checkbox" checked={!!q.caseSensitive} onChange={(e) => set({ caseSensitive: e.target.checked || undefined })} />
            Capital letters must match
          </label>
          <label className="check">
            <input type="checkbox" checked={!!q.lowestTerms} onChange={(e) => set({ lowestTerms: e.target.checked || undefined })} />
            Fractions must be in lowest terms
          </label>
        </fieldset>
      )}

      {(kind === "match" || kind === "label") && (
        <fieldset className="plain-fieldset choices-edit">
          <legend className="small">
            {kind === "match" ? "Pairs: each item and the answer it goes with" : "Click the picture to add a numbered marker, then type what each marker shows"}
          </legend>
          {rights.map((r, i) => (
            <div key={i} className="row">
              {kind === "match" ? (
                <input
                  className="input grow"
                  aria-label={`Item ${i + 1}`}
                  placeholder={`Item ${i + 1}`}
                  value={q.left?.[i] ?? ""}
                  maxLength={LIMITS.short}
                  onChange={(e) => set({ left: (q.left ?? []).map((x, j) => (j === i ? e.target.value : x)) })}
                />
              ) : (
                <>
                  <span className="q-marker inline" aria-hidden="true">
                    {i + 1}
                  </span>
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
                        set({ markers: (q.markers ?? []).map((m, j) => (j === i ? { ...m, [k]: Math.max(0, Math.min(100, Number(e.target.value) || 0)) } : m)) })
                      }
                    />
                  ))}
                </>
              )}
              <span aria-hidden="true">→</span>
              <input
                className="input grow"
                aria-label={kind === "match" ? `Goes with item ${i + 1}` : `Marker ${i + 1} shows`}
                value={r}
                maxLength={LIMITS.short}
                onChange={(e) => set(fromPairs(rights.map((x, j) => (j === i ? e.target.value : x)), extra))}
              />
              <button
                className="btn sm ghost"
                onClick={() =>
                  set({
                    ...fromPairs(
                      rights.filter((_, j) => j !== i),
                      extra,
                    ),
                    ...(kind === "match" ? { left: (q.left ?? []).filter((_, j) => j !== i) } : { markers: (q.markers ?? []).filter((_, j) => j !== i) }),
                  })
                }
              >
                Remove<span className="sr-only"> pair {i + 1}</span>
              </button>
            </div>
          ))}
          {kind === "label" && q.imageId && (
            <button
              className="btn sm"
              disabled={rights.length >= LIMITS.parts}
              onClick={() => set({ ...fromPairs([...rights, ""], extra), markers: [...(q.markers ?? []), { x: 50, y: 50 }] })}
            >
              Add marker
            </button>
          )}
          {kind === "match" && (
            <button
              className="btn sm"
              disabled={rights.length >= LIMITS.parts}
              onClick={() => set({ ...fromPairs([...rights, ""], extra), left: [...(q.left ?? []), ""] })}
            >
              Add pair
            </button>
          )}
          <label className="field" style={{ marginTop: 8 }}>
            <span>Extra wrong answers to pick from (optional), one per line</span>
            <textarea
              className="textarea"
              rows={2}
              value={extra.join("\n")}
              onChange={(e) => set(fromPairs(rights, e.target.value.split("\n").slice(0, LIMITS.choices)))}
            />
          </label>
        </fieldset>
      )}

      {kind === "order" && (
        <fieldset className="plain-fieldset choices-edit">
          <legend className="small">Steps in the right order (learners see them shuffled)</legend>
          {q.choices.map((c, ci) => (
            <div key={ci} className="row">
              <span className="pill neutral">{ci + 1}</span>
              <input
                className="input grow"
                aria-label={`Step ${ci + 1}`}
                value={c}
                maxLength={LIMITS.short}
                onChange={(e) => set({ choices: q.choices.map((x, i) => (i === ci ? e.target.value : x)) })}
              />
              <button className="btn sm ghost" disabled={ci === 0} onClick={() => set({ choices: swap(q.choices, ci, ci - 1) })}>
                Up<span className="sr-only"> step {ci + 1}</span>
              </button>
              <button className="btn sm ghost" disabled={q.choices.length <= 2} onClick={() => set({ choices: q.choices.filter((_, i) => i !== ci) })}>
                Remove<span className="sr-only"> step {ci + 1}</span>
              </button>
            </div>
          ))}
          <button className="btn sm" disabled={q.choices.length >= LIMITS.parts} onClick={() => set({ choices: [...q.choices, ""] })}>
            Add step
          </button>
        </fieldset>
      )}

      {kind === "model" && <ModelFields idBase={`cq-${q.id}`} model={q.model} target={q.target} onChange={(model, target) => set({ model, target })} />}

      <label className="field" style={{ marginTop: 8 }}>
        <span>Explanation shown after answering (optional)</span>
        <textarea className="textarea" rows={2} value={q.explanation} maxLength={LIMITS.text} onChange={(e) => set({ explanation: e.target.value })} />
      </label>
    </>
  );
}

const swap = <T,>(xs: T[], i: number, j: number) => {
  const a = [...xs];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};

/** The question's picture; for labeling, click to add a marker. */
function LabelImage({ q, onChange, editable }: { q: CQuestion; onChange: (q: CQuestion) => void; editable: boolean }) {
  const markers = q.markers ?? [];
  return (
    <div className="q-image-box editor-label-pic">
      <img
        src={imageUrl(q.imageId!)}
        alt={q.imageAlt || "Picture without a description yet"}
        onClick={(e) => {
          if (!editable || markers.length >= LIMITS.parts) return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
          const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
          const { rights, extra } = pairs(q);
          onChange({ ...q, markers: [...markers, { x, y }], ...fromPairs([...rights, ""], extra) });
        }}
        style={editable ? { cursor: "crosshair" } : undefined}
      />
      {editable &&
        markers.map((m, i) => (
          <span key={i} className="q-marker" style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-hidden="true">
            {i + 1}
          </span>
        ))}
    </div>
  );
}
