import { useEffect, useMemo, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course, VocabItem } from "../lib/types";
import {
  applyAnswer,
  cardsFor,
  checkAnswer,
  dueCards,
  shuffled,
  stageLabel,
  stateOf,
  unlockedItems,
  STAGES,
  type VocabCard,
  type Verdict,
} from "../lib/vocab";
import { logActivity } from "../lib/planner";
import { canSpeak, onVoices, speak } from "../lib/speech";
import { imeFor } from "../lib/ime";
import { confirmAction } from "../lib/storage";

export type VocabMode = "review" | "practice";

interface Props {
  api: AppApi;
  course: Course;
  mode: VocabMode;
  /** Practice only: limit to these lessons' words. */
  lessonIds?: string[];
  /** Practice only: how many cards. */
  count?: number;
}

interface QItem extends VocabCard {
  /** Counts toward the stage (first answer of the day in a review). */
  counted: boolean;
}

interface Shown {
  verdict: Verdict;
  typed: string;
  /** What the counted answer did, e.g. "Beginner 3/5" or "Moved up to Advanced". */
  change?: string;
}

/** A noun's article, e.g. "der Hund" -> "der". */
const articleOf = (term: string) => (/^(der|die|das) /.exec(term) || [])[1];

export function PosHint({ item }: { item: VocabItem }) {
  const bits: string[] = [];
  if (item.pos) bits.push(item.pos);
  if (item.pos === "noun" || articleOf(item.term)) bits.push("with der/die/das");
  return bits.length ? <span className="muted vocab-pos">{bits.join(" · ")}</span> : null;
}

export function SpeakButton({ text, lang, label = "Play pronunciation" }: { text: string; lang?: string; label?: string }) {
  const [, tick] = useState(0);
  useEffect(() => onVoices(() => tick((n) => n + 1)), []);
  if (!canSpeak(lang)) return null;
  return (
    <button type="button" className="btn ghost speak" aria-label={label} title={label} onClick={() => speak(text, lang!)}>
      🔊
    </button>
  );
}

export default function VocabRunner({ api, course, mode, lessonIds, count }: Props) {
  const lang = course.language;
  const ime = imeFor(lang);
  const initial = useMemo<QItem[]>(() => {
    if (mode === "review") return shuffled(dueCards(course, api.progress)).map((c) => ({ ...c, counted: true }));
    let items = unlockedItems(course, api.progress);
    if (lessonIds?.length) items = (course.vocab ?? []).filter((v) => !v.from && lessonIds.includes(v.lesson));
    const cards = shuffled(cardsFor(course, items));
    return (count ? cards.slice(0, count) : cards).map((c) => ({ ...c, counted: false }));
  }, []);
  const [queue, setQueue] = useState<QItem[]>(initial);
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState<string>();
  const [shown, setShown] = useState<Shown>();
  const [stats, setStats] = useState({ right: 0, wrong: 0, up: 0, learned: 0 });
  const input = useRef<HTMLInputElement>(null);
  const card = queue[0];
  const back = () => api.go({ name: "course", courseId: course.id, tab: "vocab" });

  useEffect(() => {
    input.current?.focus();
  }, [card, shown]);

  async function submit() {
    if (!card || shown) return;
    const v = checkAnswer(card, typed, lang?.code);
    if (!v.ok && v.retry) {
      setHint(v.note);
      return;
    }
    setHint(undefined);
    let change: string | undefined;
    if (card.counted) {
      const { next, event } = applyAnswer(stateOf(api.progress, card.key), v.ok);
      change =
        event === "learned"
          ? "Learned — out of the review rotation"
          : event === "up"
            ? `Moved up to ${STAGES[next.stage]}`
            : event === "reset"
              ? `Back to ${STAGES[next.stage]} 0/5`
              : stageLabel(next);
      setStats((s) => ({
        ...s,
        up: s.up + (event === "up" ? 1 : 0),
        learned: s.learned + (event === "learned" ? 1 : 0),
      }));
      await api.updateProgress((p) => logActivity({ ...p, vocab: { ...p.vocab, [card.key]: next } }, "cards"));
    }
    setStats((s) => ({ ...s, right: s.right + (v.ok ? 1 : 0), wrong: s.wrong + (v.ok ? 0 : 1) }));
    setShown({ verdict: v, typed, change });
    if (card.dir === "recall" && lang?.tts) speak(card.item.term, lang.tts);
  }

  function next() {
    if (!card || !shown) return;
    const rest = queue.slice(1);
    // Missed cards come back later in the session as practice (not counted again today).
    if (!shown.verdict.ok) rest.splice(Math.min(rest.length, 4 + Math.floor(Math.random() * 3)), 0, { ...card, counted: false });
    setQueue(rest);
    setShown(undefined);
    setTyped("");
  }

  function insert(ch: string) {
    const el = input.current;
    const start = el?.selectionStart ?? typed.length;
    const end = el?.selectionEnd ?? typed.length;
    const t = typed.slice(0, start) + ch + typed.slice(end);
    setTyped(t);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  async function quit() {
    if (queue.length && stats.right + stats.wrong > 0 && !(await confirmAction("End this session? Answers so far are saved.")))
      return;
    back();
  }

  if (!initial.length) {
    return (
      <div className="page" style={{ maxWidth: 640 }}>
        <button className="back" onClick={back}>
          ← {course.title}
        </button>
        <section className="panel">
          <h2>{mode === "review" ? "No reviews due" : "No words to practice yet"}</h2>
          <p className="muted">
            {mode === "review"
              ? "Every word you've unlocked has had its review today. Come back tomorrow, or do extra practice (it doesn't change your levels)."
              : "Words unlock as you finish lessons."}
          </p>
        </section>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="page" style={{ maxWidth: 640 }}>
        <section className="panel">
          <h2>{mode === "review" ? "Reviews done" : "Practice done"}</h2>
          <p>
            {stats.right} right, {stats.wrong} wrong.
            {mode === "review" && (stats.up || stats.learned) ? ` ${stats.up} moved up a level, ${stats.learned} learned.` : ""}
          </p>
          {mode === "practice" && <p className="muted">Extra practice doesn't change your levels.</p>}
          <button className="btn primary" onClick={back}>
            Back to vocabulary
          </button>
        </section>
      </div>
    );
  }

  const { item, dir } = card;
  const st = stateOf(api.progress, card.key);
  const done = initial.length - queue.filter((q) => initial.includes(q)).length;
  const ok = shown?.verdict.ok;

  return (
    <div className="page vocab-run" style={{ maxWidth: 720 }}>
      <div className="run-head">
        <button className="back" onClick={quit}>
          ← End
        </button>
        <span className="muted">
          {mode === "review" ? "Review" : "Extra practice"} · {done}/{initial.length}
          {queue.length > initial.length - done ? ` (+${queue.length - (initial.length - done)} again)` : ""}
        </span>
      </div>

      <section className={`panel vocab-card ${dir}`} aria-live="polite">
        <div className="vocab-meta muted">
          <span>{dir === "meaning" ? `${lang?.name ?? "Word"} → English` : `English → ${lang?.name ?? "word"}`}</span>
          <span>{card.counted ? stageLabel(st) : mode === "review" ? "Practice (already counted today)" : "Practice"}</span>
        </div>

        {dir === "meaning" ? (
          <div className="vocab-prompt" lang={lang?.code}>
            <span>{item.term}</span>
            <SpeakButton text={item.term} lang={lang?.tts} />
          </div>
        ) : (
          <div className="vocab-prompt en">
            <span>{item.meanings[0]}</span>
          </div>
        )}
        <div className="vocab-sub">
          {dir === "recall" ? <PosHint item={item} /> : item.reading && <span className="muted">{item.reading}</span>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (shown) next();
            else submit();
          }}
        >
          <label className="sr-only" htmlFor="vocab-answer">
            {dir === "meaning" ? "English meaning" : `${lang?.name ?? "Word"} spelling`}
          </label>
          <input
            id="vocab-answer"
            ref={input}
            className={`vocab-input ${shown ? (ok ? "right" : "wrong") : ""}`}
            value={typed}
            readOnly={!!shown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            lang={dir === "recall" ? lang?.code : "en"}
            placeholder={dir === "meaning" ? "Type the meaning in English" : `Type it in ${lang?.name ?? "the language"}`}
            onChange={(e) => {
              setHint(undefined);
              setTyped(ime && dir === "recall" ? ime(e.target.value) : e.target.value);
            }}
          />
          {dir === "recall" && !!lang?.keys?.length && !shown && (
            <div className="char-keys" aria-label="Special characters">
              {lang.keys.map((k) => (
                <button key={k} type="button" className="btn" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(k)}>
                  {k}
                </button>
              ))}
            </div>
          )}
          {hint && <p className="vocab-hint">{hint}</p>}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit">
              {shown ? "Next" : "Check"}
            </button>
          </div>
        </form>

        {shown && (
          <div className={`vocab-result ${ok ? "right" : "wrong"}`}>
            <p>
              <strong>{ok ? "Right." : "Not quite."}</strong> {shown.verdict.note}
              {shown.change && <span className="muted"> · {shown.change}</span>}
            </p>
            <p className="vocab-answer" lang={lang?.code}>
              <span>{item.term}</span>
              <SpeakButton text={item.term} lang={lang?.tts} />
              <span className="muted"> — {item.meanings.join("; ")}</span>
            </p>
            {item.plural && <p className="muted">Plural: {item.plural}</p>}
            {item.example && (
              <p className="vocab-example">
                <span lang={lang?.code}>{item.example}</span>
                {item.exampleEn && <span className="muted"> — {item.exampleEn}</span>}
              </p>
            )}
            {item.note && <p className="muted">{item.note}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
