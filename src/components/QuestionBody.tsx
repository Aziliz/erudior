// The answer area for every question kind (choice, text, match, label, order), used while
// answering (Runner) and read-only when reviewing (Results). `reveal` marks each part right or
// wrong and shows the correct answer.

import { Fragment, useEffect, useRef } from "react";
import MathText from "./MathText";
import type { Chosen, Question } from "../lib/types";
import { BLANK, blankCount, partsCorrect, qtype } from "../lib/questions";
import { LETTERS } from "../lib/util";
import { mathTextSpeech, sayItem, type AudioLib } from "../lib/readAloud";
import { SayButton } from "./ReadAloud";

/** Readable text for a string that may hold $math$ (for aria-labels and <option>s). */
export const spoken = (s: string) =>
  s
    .replace(/\$+/g, "")
    .replace(/\\[a-z]+\{?|[{}]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

interface Props {
  q: Question;
  /** Display order of choices (choice), options (match/label) or the starting arrangement (order). */
  order: number[];
  chosen: Chosen;
  /** Choice questions: the original index clicked. */
  onChoose?: (original: number) => void;
  /** Other kinds: the whole new answer. */
  onChange?: (next: Chosen) => void;
  /** Enter in a text box (e.g. to check the answer). */
  onEnter?: () => void;
  reveal?: boolean;
  disabled?: boolean;
  /** Review screens: smaller, no inputs. */
  review?: boolean;
  /** Early-reader courses: a read button beside every choice and item (`lib`: recorded audio). */
  read?: { lib?: AudioLib };
}

/** A small button that reads one choice or item aloud. */
function ReadOne({ text, read, owner }: { text: string; read: { lib?: AudioLib }; owner: string }) {
  return (
    <SayButton
      owner={owner}
      className="ra-btn ra-choice"
      label={`Read aloud: ${spoken(text)}`}
      items={() => [sayItem(read.lib, mathTextSpeech(text), { key: text })]}
    />
  );
}

/** The stem, with numbered blanks for fill-in-the-blank questions. */
export function QuestionStem({ q, className = "q-stem" }: { q: Question; className?: string }) {
  if (qtype(q) !== "text" || !/_{3,}/.test(q.stem)) return <MathText as="p" className={className} text={q.stem} />;
  const parts = q.stem.split(BLANK);
  const many = parts.length > 2;
  return (
    <p className={className}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          <MathText text={p} />
          {i < parts.length - 1 && (
            <span className="blank-mark">
              <span className="sr-only">blank</span>
              {many ? `(${i + 1})` : ""}
            </span>
          )}
        </Fragment>
      ))}
    </p>
  );
}

export function QuestionImage({ q, numbered }: { q: Question; numbered?: boolean }) {
  if (!q.image) return null;
  return (
    <figure className="q-image">
      <div className="q-image-box">
        <img src={q.image.src} alt={q.image.alt} />
        {numbered &&
          q.markers?.map((m, i) => (
            <span key={i} className="q-marker" style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-hidden="true">
              {i + 1}
            </span>
          ))}
      </div>
      {q.image.caption && (
        <figcaption>
          <MathText text={q.image.caption} />
        </figcaption>
      )}
    </figure>
  );
}

function Mark({ ok, fix }: { ok: boolean; fix?: React.ReactNode }) {
  return ok ? <span className="part-mark ok">✓ Right</span> : <span className="part-mark bad">✗{fix !== undefined && <> Answer: {fix}</>}</span>;
}

export default function QuestionBody({ q, order, chosen, onChoose, onChange, onEnter, reveal, disabled, review, read }: Props) {
  const kind = qtype(q);
  const parts = reveal ? partsCorrect(q, chosen) : [];
  const off = disabled || reveal;

  if (kind === "text") {
    const n = blankCount(q);
    return (
      <div className="q-parts text-answers">
        {Array.from({ length: n }, (_, i) => {
          const val = String(chosen[i] ?? "");
          const label = n > 1 ? `Blank ${i + 1}` : "Your answer";
          return (
            <div key={i} className={`text-answer ${reveal ? (parts[i] ? "is-right" : "is-wrong") : ""}`}>
              {review ? (
                <p>
                  <span className="muted">{label}: </span>
                  {val.trim() ? <b>{val}</b> : <span className="faint">(blank)</span>}
                </p>
              ) : (
                <label className="field">
                  <span>{label}</span>
                  <input
                    className="input"
                    value={val}
                    disabled={off}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={(e) => {
                      const next = Array.from({ length: n }, (_, j) => String(chosen[j] ?? ""));
                      next[i] = e.target.value;
                      onChange?.(next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onEnter?.();
                      }
                    }}
                  />
                </label>
              )}
              {reveal && <Mark ok={parts[i]} fix={<MathText text={q.accept?.[i]?.[0] ?? ""} />} />}
              {reveal && (q.accept?.[i]?.length ?? 0) > 1 && <p className="small muted">Also accepted: {q.accept![i].slice(1).join(", ")}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "match" || kind === "label") {
    const rows = kind === "match" ? (q.left ?? []) : q.answer.map((_, i) => `Part ${i + 1}`);
    return (
      <>
        {kind === "label" && <QuestionImage q={q} numbered />}
        <div className="q-parts match-rows">
          {rows.map((left, i) => {
            const pick = typeof chosen[i] === "number" ? (chosen[i] as number) : -1;
            const id = `m-${q.id}-${i}`;
            return (
              <div key={i} className={`match-row ${reveal ? (parts[i] ? "is-right" : "is-wrong") : ""}`}>
                <label htmlFor={id} className="match-left">
                  {kind === "label" ? (
                    <span className="q-marker inline" aria-hidden="true">
                      {i + 1}
                    </span>
                  ) : null}
                  {kind === "label" ? <span className="sr-only">{left}</span> : <MathText text={left} />}
                </label>
                {read && kind === "match" && <ReadOne text={left} read={read} owner={`item-${q.id}-${i}`} />}
                {review ? (
                  <span className="match-pick">{pick >= 0 ? <MathText text={q.choices[pick]} /> : <span className="faint">(none)</span>}</span>
                ) : (
                  <select
                    id={id}
                    // Spelled out too: a left item that is only math can leave the <label> without a readable name.
                    aria-label={spoken(left) || `Item ${i + 1}`}
                    className="input match-pick"
                    value={pick}
                    disabled={off}
                    onChange={(e) => {
                      const next = q.answer.map((_, j) => (typeof chosen[j] === "number" ? (chosen[j] as number) : -1));
                      next[i] = Number(e.target.value);
                      onChange?.(next);
                    }}
                  >
                    <option value={-1}>Choose…</option>
                    {order.map((o) => (
                      <option key={o} value={o}>
                        {spoken(q.choices[o])}
                      </option>
                    ))}
                  </select>
                )}
                {reveal && <Mark ok={parts[i]} fix={<MathText text={q.choices[q.answer[i]]} />} />}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (kind === "order") {
    return <OrderList q={q} order={order} chosen={chosen} onChange={onChange} reveal={reveal} disabled={off} review={review} parts={parts} read={read} />;
  }

  // Multiple choice / select all that apply.
  const multi = q.answer.length > 1;
  return (
    <div className="choices" role={multi ? "group" : "radiogroup"} aria-label="Answer choices">
      {order.map((orig, pos) => {
        const selected = chosen.includes(orig);
        const isAnswer = q.answer.includes(orig);
        let cls = "choice";
        let bubble = "bubble";
        if (reveal) {
          if (isAnswer) {
            cls += " is-right";
            bubble += selected ? " right" : " should";
          } else if (selected) {
            cls += " is-wrong";
            bubble += " wrong";
          }
        } else if (selected) {
          cls += " selected";
          bubble += " filled";
        }
        const btn = (
          <button
            key={orig}
            className={cls}
            role={multi ? "checkbox" : "radio"}
            aria-checked={selected}
            disabled={off}
            data-choice={orig}
            onClick={() => onChoose?.(orig)}
          >
            <span className={bubble}>{LETTERS[pos]}</span>
            <MathText text={q.choices[orig]} />
          </button>
        );
        if (!read) return btn;
        return (
          <div key={orig} className="choice-row">
            {btn}
            <ReadOne text={q.choices[orig]} read={read} owner={`choice-${q.id}-${orig}`} />
          </div>
        );
      })}
    </div>
  );
}

function OrderList({
  q,
  order,
  chosen,
  onChange,
  reveal,
  disabled,
  review,
  parts,
  read,
}: {
  q: Question;
  order: number[];
  chosen: Chosen;
  onChange?: (next: Chosen) => void;
  reveal?: boolean;
  disabled?: boolean;
  review?: boolean;
  parts: boolean[];
  read?: { lib?: AudioLib };
}) {
  const current = (chosen.length === q.choices.length ? chosen : order) as number[];
  const focusNext = useRef<string | null>(null);
  const host = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!focusNext.current) return;
    host.current?.querySelector<HTMLButtonElement>(`[data-k="${focusNext.current}"]`)?.focus();
    focusNext.current = null;
  });

  const move = (pos: number, by: number) => {
    const to = pos + by;
    if (to < 0 || to >= current.length) return;
    const next = current.slice();
    [next[pos], next[to]] = [next[to], next[pos]];
    // Keep focus on the same button of the moved item (or the other one at the ends).
    const item = current[pos];
    const dir = to === 0 ? "down" : to === current.length - 1 ? "up" : by < 0 ? "up" : "down";
    focusNext.current = `${item}-${dir}`;
    onChange?.(next);
  };

  return (
    <div className="q-parts">
      {!reveal && !review && <p className="q-hint">Use the arrow buttons to put the items in order, first at the top.</p>}
      <ol className="order-list" ref={host}>
        {current.map((orig, pos) => (
          <li key={orig} className={`order-item ${reveal ? (parts[pos] ? "is-right" : "is-wrong") : ""}`}>
            <span className="order-num" aria-hidden="true">
              {pos + 1}
            </span>
            <span className="order-text">
              <MathText text={q.choices[orig]} />
            </span>
            {read && <ReadOne text={q.choices[orig]} read={read} owner={`item-${q.id}-${orig}`} />}
            {!review && !reveal && (
              <span className="order-btns">
                <button
                  className="btn sm ghost"
                  data-k={`${orig}-up`}
                  disabled={disabled || pos === 0}
                  aria-label={`Move "${spoken(q.choices[orig])}" up`}
                  onClick={() => move(pos, -1)}
                >
                  ↑
                </button>
                <button
                  className="btn sm ghost"
                  data-k={`${orig}-down`}
                  disabled={disabled || pos === current.length - 1}
                  aria-label={`Move "${spoken(q.choices[orig])}" down`}
                  onClick={() => move(pos, 1)}
                >
                  ↓
                </button>
              </span>
            )}
            {reveal && <Mark ok={parts[pos]} fix={<MathText text={q.choices[pos]} />} />}
          </li>
        ))}
      </ol>
      {reveal && !parts.every(Boolean) && (
        <p className="small">
          <span className="muted">Correct order: </span>
          {q.choices.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && " → "}
              <MathText text={c} />
            </Fragment>
          ))}
        </p>
      )}
    </div>
  );
}
