import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import type { Card, Course, Deck } from "../lib/types";
import { withDeck } from "../lib/course";
import { confirmAction } from "../lib/storage";
import { uid } from "../lib/util";

export default function DeckEditor({ api, course, deck }: { api: AppApi; course: Course; deck: Deck }) {
  const [draft, setDraft] = useState<Deck>(() => structuredClone(deck));
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");

  const update = (fn: (d: Deck) => Deck) => {
    setDraft(fn);
    setDirty(true);
  };
  const setCard = (id: string, patch: Partial<Card>) =>
    update((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));

  const topics = [...new Set(course.decks.flatMap((d) => d.cards.map((c) => c.topic)).filter(Boolean))] as string[];
  const s = search.trim().toLowerCase();
  const shown = draft.cards.filter(
    (c) => !s || c.front.toLowerCase().includes(s) || c.back.toLowerCase().includes(s) || c.topic?.toLowerCase().includes(s),
  );
  const incomplete = draft.cards.filter((c) => !c.front.trim() || !c.back.trim()).length;

  async function save() {
    if (!draft.title.trim()) return api.toast("Give the deck a name.");
    if (incomplete) return api.toast(`${incomplete} card${incomplete === 1 ? " is" : "s are"} missing a front or back.`);
    await api.saveCourse(withDeck(course, draft));
    setDirty(false);
    api.toast("Deck saved");
  }

  async function close() {
    if (dirty && !(await confirmAction("Discard unsaved changes to this deck?", "Unsaved changes"))) return;
    api.go({ name: "course", courseId: course.id, tab: "cards" });
  }

  async function removeDeck() {
    if (!(await confirmAction(`Delete the deck "${draft.title}" and its ${draft.cards.length} cards?`, "Delete deck"))) return;
    await api.saveCourse({ ...course, decks: course.decks.filter((d) => d.id !== deck.id) });
    api.go({ name: "course", courseId: course.id, tab: "cards" });
  }

  function addCard() {
    const c: Card = { id: `c-${uid()}`, front: "", back: "", topic: draft.cards[draft.cards.length - 1]?.topic };
    update((d) => ({ ...d, cards: [...d.cards, c] }));
    setSearch("");
    setTimeout(() => document.getElementById(`front-${c.id}`)?.focus(), 30);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="editor-main" style={{ height: "100%" }}>
      <div className="editor-bar">
        <button className="btn ghost sm" onClick={close}>
          ← Done
        </button>
        <strong>{draft.title || "Untitled deck"}</strong>
        {dirty && (
          <span className="small muted row" style={{ gap: 6 }}>
            <span className="dirty-dot" /> Unsaved changes
          </span>
        )}
        <div className="spacer" />
        <button className="btn sm danger ghost" onClick={removeDeck}>
          Delete deck
        </button>
        <button className="btn primary" onClick={save} disabled={!dirty}>
          Save deck
        </button>
      </div>
      <div className="inner" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div className="form-grid">
          <label className="field">
            <span>Deck name</span>
            <input className="input" value={draft.title} onChange={(e) => update((d) => ({ ...d, title: e.target.value }))} />
          </label>
          <label className="field">
            <span>Description</span>
            <input
              className="input"
              value={draft.description ?? ""}
              onChange={(e) => update((d) => ({ ...d, description: e.target.value || undefined }))}
            />
          </label>
        </div>
        <div className="row" style={{ justifyContent: "space-between", margin: "8px 0 12px" }}>
          <input
            className="input"
            style={{ maxWidth: 320 }}
            placeholder={`Search ${draft.cards.length} cards`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search cards"
          />
          <button className="btn primary" onClick={addCard}>
            Add card
          </button>
        </div>
        <datalist id="card-topics">
          {topics.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <div className="card-edit-list">
          {shown.map((c) => (
            <div key={c.id} className="card-edit">
              <label className="field">
                <span>Front</span>
                <textarea
                  id={`front-${c.id}`}
                  className="textarea"
                  rows={2}
                  value={c.front}
                  onChange={(e) => setCard(c.id, { front: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Back</span>
                <textarea className="textarea" rows={2} value={c.back} onChange={(e) => setCard(c.id, { back: e.target.value })} />
              </label>
              <div className="card-edit-side">
                <label className="field">
                  <span>Topic</span>
                  <input
                    className="input"
                    list="card-topics"
                    value={c.topic ?? ""}
                    onChange={(e) => setCard(c.id, { topic: e.target.value || undefined })}
                  />
                </label>
                <button
                  className="btn sm ghost danger"
                  onClick={() => update((d) => ({ ...d, cards: d.cards.filter((x) => x.id !== c.id) }))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {shown.length === 0 && <p className="muted">{draft.cards.length ? "No cards match." : "No cards yet. Add one to start."}</p>}
        </div>
        <p className="faint small" style={{ marginTop: 12 }}>
          Cards support Markdown, and [[term]] links to the glossary. Editing a card's text keeps its review schedule.
        </p>
      </div>
    </div>
  );
}
