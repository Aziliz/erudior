import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Course, Deck } from "../lib/types";
import Markdown from "../components/Markdown";
import {
  buildReviewQueue,
  cramQueue,
  previewInterval,
  schedule,
  type QueueItem,
  type Rating,
} from "../lib/srs";
import { logActivity } from "../lib/planner";
import { confirmAction } from "../lib/storage";

interface Props {
  api: AppApi;
  course: Course;
  decks: Deck[];
  mode: "review" | "cram";
  topics?: string[];
}

const RATINGS: { r: Rating; label: string; key: string }[] = [
  { r: "again", label: "Again", key: "1" },
  { r: "hard", label: "Hard", key: "2" },
  { r: "good", label: "Good", key: "3" },
  { r: "easy", label: "Easy", key: "4" },
];

export default function CardsRunner({ api, course, decks, mode, topics }: Props) {
  const plan = api.progress.plans[course.id];
  // The queue is fixed at the start; "again" re-inserts a card a few places later.
  const initial = useMemo(
    () =>
      mode === "review"
        ? buildReviewQueue(course, decks, api.progress, plan?.newCardsPerDay ?? 20)
        : cramQueue(course, decks, topics),
    [],
  );
  const [queue, setQueue] = useState<QueueItem[]>(initial);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [known, setKnown] = useState(0);
  const total = initial.length;
  const card = queue[0];
  const state = card ? api.progress.cards[card.key] : undefined;

  const back = () => api.go({ name: "course", courseId: course.id, tab: "cards" });

  const rate = useCallback(
    async (r: Rating) => {
      if (!card || !flipped) return;
      const rest = queue.slice(1);
      if (r === "again") rest.splice(Math.min(3, rest.length), 0, card);
      setQueue(rest);
      setFlipped(false);
      setReviewed((n) => n + 1);
      await api.updateProgress((p) =>
        logActivity({ ...p, cards: { ...p.cards, [card.key]: schedule(p.cards[card.key], r) } }, "cards"),
      );
    },
    [card, flipped, queue, api],
  );

  const cram = useCallback(
    async (gotIt: boolean) => {
      if (!card || !flipped) return;
      const rest = queue.slice(1);
      if (!gotIt) rest.push(card);
      else setKnown((n) => n + 1);
      setQueue(rest);
      setFlipped(false);
      setReviewed((n) => n + 1);
      await api.updateProgress((p) => logActivity(p, "cards"));
    },
    [card, flipped, queue, api],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
        else if (mode === "cram") cram(true);
        else rate("good");
        return;
      }
      if (!flipped) return;
      if (mode === "review") {
        const hit = RATINGS.find((x) => x.key === e.key);
        if (hit) rate(hit.r);
      } else if (e.key === "1") cram(false);
      else if (e.key === "2") cram(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, mode, rate, cram]);

  async function quit() {
    if (queue.length && reviewed > 0 && mode === "cram") {
      if (!(await confirmAction("Stop cramming? Nothing is lost; cram mode doesn't change your review schedule.", "Stop")))
        return;
    }
    back();
  }

  if (!card) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: 80 }}>
        <h1>{total === 0 ? "Nothing to review right now" : mode === "review" ? "Review done" : "Deck done"}</h1>
        <p className="muted" style={{ margin: "10px auto 24px" }}>
          {total === 0
            ? "No cards are due and today's new cards are already introduced. Cram mode lets you flip through anyway."
            : mode === "review"
              ? `You went through ${total} card${total === 1 ? "" : "s"} (${reviewed} ratings). Come back tomorrow for the next ones that come due.`
              : `All ${total} cards marked as known after ${reviewed} flips.`}
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          {total === 0 && (
            <button
              className="btn"
              onClick={() => api.go({ name: "cards", courseId: course.id, deckIds: decks.map((d) => d.id), mode: "cram" })}
            >
              Cram instead
            </button>
          )}
          <button className="btn primary" onClick={back}>
            Back to notecards
          </button>
        </div>
      </div>
    );
  }

  const remaining = queue.length;
  return (
    <div className="cards-runner">
      <h1 className="sr-only">Notecards: {decks.length === 1 ? decks[0].title : course.title}</h1>
      <div className="runner-bar">
        <button className="btn ghost sm" onClick={quit}>
          Done
        </button>
        <div className="title">{decks.length === 1 ? decks[0].title : course.title}</div>
        <span className="pill neutral">{mode === "review" ? "Spaced review" : "Cram"}</span>
        <div className="spacer" />
        <span className="small muted num">
          {mode === "cram" ? `${known}/${total} known` : `${remaining} left`}
        </span>
      </div>
      <div className="progress-line">
        <i style={{ width: `${(mode === "cram" ? known / total : 1 - remaining / Math.max(total, remaining)) * 100}%` }} />
      </div>

      <div className="card-stage">
        <div
          className={`flashcard ${flipped ? "is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            // Glossary links inside the card open their pop-up instead of flipping.
            if ((e.target as HTMLElement).closest(".gloss, .gloss-pop, .pop-scrim")) return;
            setFlipped((f) => !f);
          }}
          aria-label={flipped ? "Card back. Click to show the front." : "Card front. Click to reveal the answer."}
        >
          <div className="fc-side">
            <span className="fc-tag">{card.card.topic ?? card.deck.title}</span>
            <Markdown source={card.card.front} glossary={course.glossary} className="prose fc-front" />
            {flipped && (
              <>
                <hr />
                <Markdown source={card.card.back} glossary={course.glossary} className="prose fc-back" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card-actions">
        {!flipped ? (
          <button className="btn primary lg" onClick={() => setFlipped(true)}>
            Show answer <span className="kbd-inline">Space</span>
          </button>
        ) : mode === "review" ? (
          <div className="ratings">
            {RATINGS.map((x) => (
              <button key={x.r} className={`btn rate-${x.r}`} onClick={() => rate(x.r)}>
                <b>{x.label}</b>
                <span className="small">{previewInterval(state, x.r)}</span>
                <span className="kbd-inline">{x.key}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="ratings">
            <button className="btn rate-again" onClick={() => cram(false)}>
              <b>Still learning</b>
              <span className="kbd-inline">1</span>
            </button>
            <button className="btn rate-good" onClick={() => cram(true)}>
              <b>Got it</b>
              <span className="kbd-inline">2</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
