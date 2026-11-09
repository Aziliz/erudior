// Sentence-builder questions: word tiles in a bank; picking one adds it to the end of the
// sentence, picking a placed tile sends it back. Keyboard: tiles are buttons; in the sentence,
// Left/Right arrows move the focused tile, Delete/Backspace sends it back; in the bank, the
// arrows move between tiles. Tiles can also be dragged. The built sentence is announced.

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Chosen, Question } from "../lib/types";
import { hasJapanese } from "../lib/kana";
import { bankOrder, buildJoiner, buildParts, buildPool, closestAnswer, placedTiles, sentenceText, tilePlain } from "../lib/sentenceBuild";
import { isCorrect } from "../lib/questions";
import { RubyText } from "./Ruby";

interface Props {
  q: Question;
  chosen: Chosen;
  onChange?: (next: Chosen) => void;
  reveal?: boolean;
  disabled?: boolean;
  review?: boolean;
  /** The course language (e.g. "ja", "de"): the default joiner and the tiles' lang. */
  lang?: string;
  /** Mixed into the bank's shuffle (e.g. the session id); the same seed gives the same order. */
  seed?: string;
}

/** One tile's text; furigana markup shows as ruby. */
function TileText({ text, lang }: { text: string; lang?: string }) {
  const ja = lang === "ja" || hasJapanese(text);
  return <RubyText text={text} lang={ja ? "ja" : undefined} />;
}

export default function SentenceBuilder({ q, chosen, onChange, reveal, disabled, review, lang, seed }: Props) {
  const pool = buildPool(q);
  const placed = placedTiles(q, chosen);
  const joiner = buildJoiner(q, lang);
  const tileLang = lang ?? (pool.some(hasJapanese) ? "ja" : undefined);
  const order = useMemo(() => bankOrder(q, seed), [q, seed]);
  const [said, setSaid] = useState("");
  const focusNext = useRef<string | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef<{ from: "bank" | "sentence"; tile: number } | null>(null);
  const hintId = `build-hint-${q.id}`;
  const off = disabled || reveal || review;

  useEffect(() => {
    if (!focusNext.current) return;
    const el = host.current?.querySelector<HTMLElement>(`[data-k="${focusNext.current}"]`) ?? host.current?.querySelector<HTMLElement>(".build-sentence button, .build-bank button");
    el?.focus();
    focusNext.current = null;
  });

  const plain = (ts: number[]) => sentenceText(q, ts.map((i) => pool[i]), lang);
  const commit = (next: number[], message: string, focus: string | null) => {
    focusNext.current = focus;
    setSaid(`${message} ${next.length ? `Sentence: ${plain(next)}` : "The sentence is empty."}`);
    onChange?.(next);
  };
  const add = (tile: number, at = placed.length) => {
    if (off || placed.includes(tile)) return;
    const next = placed.slice();
    next.splice(at, 0, tile);
    // Focus stays in the bank: the next tile still there, else the sentence's last tile.
    const left = order.filter((i) => !next.includes(i));
    const pos = order.indexOf(tile);
    const stay = left.find((i) => order.indexOf(i) > pos) ?? left[left.length - 1];
    commit(next, `Added “${tilePlain(pool[tile])}”.`, stay !== undefined ? `b${stay}` : `s${tile}`);
  };
  const remove = (tile: number) => {
    if (off) return;
    const pos = placed.indexOf(tile);
    const next = placed.filter((i) => i !== tile);
    const stay = next[pos] ?? next[pos - 1];
    commit(next, `Removed “${tilePlain(pool[tile])}”.`, stay !== undefined ? `s${stay}` : `b${tile}`);
  };
  const move = (tile: number, by: number) => {
    const pos = placed.indexOf(tile);
    const to = pos + by;
    if (off || to < 0 || to >= placed.length) return;
    const next = placed.slice();
    [next[pos], next[to]] = [next[to], next[pos]];
    commit(next, `Moved “${tilePlain(pool[tile])}” to position ${to + 1} of ${next.length}.`, `s${tile}`);
  };
  const reorder = (tile: number, at: number) => {
    const without = placed.filter((i) => i !== tile);
    const next = without.slice();
    next.splice(Math.min(at, without.length), 0, tile);
    if (next.every((x, i) => x === placed[i])) return;
    commit(next, `Moved “${tilePlain(pool[tile])}” to position ${next.indexOf(tile) + 1} of ${next.length}.`, `s${tile}`);
  };
  const dropAt = (at: number) => {
    const d = drag.current;
    drag.current = null;
    if (!d || off) return;
    if (d.from === "bank") add(d.tile, at);
    else reorder(d.tile, at);
  };

  // After checking (and in review): the learner's sentence marked, and the right one.
  if (reveal || review) {
    const right = !!reveal && isCorrect(q, chosen);
    const parts = reveal ? buildParts(q, chosen) : [];
    const answer = closestAnswer(q, chosen);
    return (
      <div className={`q-parts build ${reveal ? (right ? "is-right" : "is-wrong") : ""}`}>
        <p className="small muted build-label">Your sentence</p>
        {placed.length ? (
          <p className="build-sentence is-shown" lang={tileLang}>
            {placed.map((tile, pos) => {
              const ok = parts[pos];
              return (
                <span key={tile} className={`build-tile ${reveal ? (ok ? "is-right" : "is-wrong") : ""}`}>
                  <TileText text={pool[tile]} lang={lang} />
                  {reveal && <span className="sr-only">{ok ? " (right)" : " (wrong place)"}</span>}
                </span>
              );
            })}
            {q.punctuation && <span className="build-punct">{q.punctuation}</span>}
          </p>
        ) : (
          <p className="faint">(not answered)</p>
        )}
        {reveal &&
          (right ? (
            <span className="part-mark ok">✓ Right</span>
          ) : (
            <p className="build-answer">
              <span className="part-mark bad">✗ Answer:</span>{" "}
              <span lang={tileLang}>
                {answer.map((t, i) => (
                  <Fragment key={i}>
                    {i > 0 && joiner}
                    <TileText text={t} lang={lang} />
                  </Fragment>
                ))}
                {q.punctuation}
              </span>
              {placed.length < answer.length && <span className="small muted"> ({answer.length - placed.length} more tile{answer.length - placed.length === 1 ? "" : "s"} needed)</span>}
            </p>
          ))}
        {reveal && (q.accept?.length ?? 0) > 0 && (
          <p className="small muted">
            Also right:{" "}
            {[q.tiles ?? [], ...(q.accept ?? [])]
              .filter((a) => a !== answer)
              .map((a, i) => (
                <Fragment key={i}>
                  {i > 0 && "; "}
                  <span lang={tileLang}>{sentenceText(q, a, lang)}</span>
                </Fragment>
              ))}
          </p>
        )}
      </div>
    );
  }

  const bank = order.filter((i) => !placed.includes(i));
  const bankKey = (tile: number, e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const pos = bank.indexOf(tile);
    const to = e.key === "Home" ? 0 : e.key === "End" ? bank.length - 1 : Math.max(0, Math.min(bank.length - 1, pos + (e.key === "ArrowRight" ? 1 : -1)));
    host.current?.querySelector<HTMLElement>(`[data-k="b${bank[to]}"]`)?.focus();
  };
  const sentenceKey = (tile: number, e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      // Handled here even at the ends, so the arrows never change the question instead.
      e.preventDefault();
      move(tile, e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      reorder(tile, e.key === "Home" ? 0 : placed.length);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove(tile);
    }
  };

  return (
    <div className="q-parts build" ref={host}>
      <p className="q-hint" id={hintId}>
        Select the tiles in order to build the sentence. Select a tile in your sentence to send it back; use the Left and Right arrow keys to move it.
      </p>
      <div
        className={`build-sentence ${placed.length ? "" : "is-empty"}`}
        role="group"
        aria-label="Your sentence"
        aria-describedby={hintId}
        lang={tileLang}
        onDragOver={(e) => drag.current && e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          dropAt(placed.length);
        }}
      >
        {placed.map((tile, pos) => (
          <button
            key={tile}
            type="button"
            className="build-tile placed"
            data-k={`s${tile}`}
            disabled={off}
            draggable={!off}
            aria-label={`${tilePlain(pool[tile])}, ${pos + 1} of ${placed.length}`}
            onClick={() => remove(tile)}
            onKeyDown={(e) => sentenceKey(tile, e)}
            onDragStart={(e) => {
              drag.current = { from: "sentence", tile };
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", tilePlain(pool[tile]));
            }}
            onDragOver={(e) => drag.current && e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dropAt(pos);
            }}
          >
            <TileText text={pool[tile]} lang={lang} />
          </button>
        ))}
        {placed.length > 0 && q.punctuation && (
          <span className="build-punct" aria-hidden="true">
            {q.punctuation}
          </span>
        )}
        {!placed.length && (
          <span className="build-placeholder" lang="en">
            Your sentence appears here.
          </span>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {said}
      </p>
      <div
        className="build-bank"
        role="group"
        aria-label="Word tiles"
        lang={tileLang}
        onDragOver={(e) => drag.current?.from === "sentence" && e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const d = drag.current;
          drag.current = null;
          if (d?.from === "sentence") remove(d.tile);
        }}
      >
        {order.map((tile) =>
          placed.includes(tile) ? (
            // A gap keeps the other tiles where they were.
            <span key={tile} className="build-tile ghost" aria-hidden="true">
              <TileText text={pool[tile]} lang={lang} />
            </span>
          ) : (
            <button
              key={tile}
              type="button"
              className="build-tile"
              data-k={`b${tile}`}
              disabled={off}
              draggable={!off}
              aria-label={tilePlain(pool[tile])}
              onClick={() => add(tile)}
              onKeyDown={(e) => bankKey(tile, e)}
              onDragStart={(e) => {
                drag.current = { from: "bank", tile };
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", tilePlain(pool[tile]));
              }}
            >
              <TileText text={pool[tile]} lang={lang} />
            </button>
          ),
        )}
      </div>
      <div className="row">
        <button
          type="button"
          className="btn sm ghost"
          disabled={off || !placed.length}
          onClick={() => {
            focusNext.current = order.length ? `b${order[0]}` : null;
            setSaid("Cleared. The sentence is empty.");
            onChange?.([]);
          }}
        >
          Clear the sentence
        </button>
      </div>
    </div>
  );
}
