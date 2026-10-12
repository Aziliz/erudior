import { useEffect, useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Bank, Question } from "../lib/types";
import * as store from "../lib/storage";
import { bankWarnings } from "../lib/validate";
import { LETTERS, slugify, uid } from "../lib/util";

type Sel = { kind: "settings" } | { kind: "question"; id: string };

function questionErrors(q: Question): string[] {
  const e: string[] = [];
  if (!q.stem.trim()) e.push("Write the question text.");
  if (q.choices.length < 2) e.push("Add at least two choices.");
  if (q.choices.some((c) => !c.trim())) e.push("Fill in or remove empty choices.");
  if (!q.answer.length) e.push("Mark the correct answer.");
  if (!q.topic.trim()) e.push("Give the question a topic.");
  return e;
}

export default function Editor({ api, bank, isNew }: { api: AppApi; bank: Bank; isNew?: boolean }) {
  const [draft, setDraft] = useState<Bank>(() => structuredClone(bank));
  const [dirty, setDirty] = useState(false);
  const [sel, setSel] = useState<Sel>(
    isNew || !bank.questions.length ? { kind: "settings" } : { kind: "question", id: bank.questions[0].id },
  );
  const [search, setSearch] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const update = (fn: (b: Bank) => Bank) => {
    setDraft((d) => fn(d));
    setDirty(true);
  };
  const updateQ = (id: string, fn: (q: Question) => Question) =>
    update((b) => ({ ...b, questions: b.questions.map((q) => (q.id === id ? fn(q) : q)) }));

  const topics = useMemo(() => [...new Set(draft.questions.map((q) => q.topic).filter(Boolean))].sort(), [draft]);
  const errorsById = useMemo(
    () => new Map(draft.questions.map((q) => [q.id, questionErrors(q)] as const).filter(([, e]) => e.length)),
    [draft],
  );
  const filtered = draft.questions.filter((q) => {
    const s = search.trim().toLowerCase();
    return !s || q.stem.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s);
  });

  async function save() {
    if (!draft.title.trim()) {
      setSel({ kind: "settings" });
      api.toast("Give the bank a title before saving.");
      return;
    }
    if (errorsById.size) {
      setShowErrors(true);
      const first = [...errorsById.keys()][0];
      setSel({ kind: "question", id: first });
      api.toast(`${errorsById.size} question${errorsById.size === 1 ? " needs" : "s need"} fixing before saving.`);
      return;
    }
    try {
      await store.saveBank(draft);
      await api.reloadBanks();
      setDirty(false);
      api.toast("Bank saved");
    } catch (e) {
      api.toast(`Save failed: ${String(e)}`);
    }
  }

  async function close() {
    if (dirty && !(await store.confirmAction("Discard unsaved changes to this bank?", "Unsaved changes"))) return;
    api.go({ name: "bank", bankId: bank.id });
  }

  // Ctrl/Cmd+S saves.
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

  function addQuestion(base?: Question) {
    const prev = sel.kind === "question" ? draft.questions.find((q) => q.id === sel.id) : undefined;
    const q: Question = base
      ? { ...structuredClone(base), id: uid("q") }
      : {
          id: uid("q"),
          section: prev?.section ?? draft.sections[0]?.id,
          topic: prev?.topic ?? "General",
          stem: "",
          choices: ["", "", "", ""],
          answer: [0],
        };
    update((b) => {
      const at = prev ? b.questions.findIndex((x) => x.id === prev.id) + 1 : b.questions.length;
      const questions = b.questions.slice();
      questions.splice(at, 0, q);
      return { ...b, questions };
    });
    setSel({ kind: "question", id: q.id });
    setSearch("");
  }

  async function deleteQuestion(id: string) {
    if (!(await store.confirmAction("Delete this question?", "Delete question"))) return;
    const idx = draft.questions.findIndex((q) => q.id === id);
    const rest = draft.questions.filter((q) => q.id !== id);
    update((b) => ({ ...b, questions: rest }));
    const next = rest[Math.min(idx, rest.length - 1)];
    setSel(next ? { kind: "question", id: next.id } : { kind: "settings" });
  }

  const current = sel.kind === "question" ? draft.questions.find((q) => q.id === sel.id) : undefined;
  const currentIndex = current ? draft.questions.indexOf(current) : -1;

  return (
    <div className="editor">
      <aside className="editor-side">
        <div className="tools">
          <button className="btn ghost sm" style={{ alignSelf: "flex-start" }} onClick={close}>
            ← Done
          </button>
          <button
            className={`q-item`}
            style={{ border: "1px solid var(--rule)", borderRadius: 6 }}
            aria-current={sel.kind === "settings"}
            onClick={() => setSel({ kind: "settings" })}
          >
            <span className="t" style={{ fontWeight: 600 }}>
              Bank settings
            </span>
            <span className="m">Title, sections, exam size and timing</span>
          </button>
          <div className="row" style={{ flexWrap: "nowrap" }}>
            <input
              className="input"
              placeholder="Search questions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search questions"
            />
            <button className="btn primary" onClick={() => addQuestion()}>
              Add
            </button>
          </div>
          <span className="small muted">
            {draft.questions.length} questions{search && `, ${filtered.length} shown`}
          </span>
        </div>
        <div className="q-list">
          {filtered.map((q) => {
            const errs = errorsById.get(q.id);
            return (
              <button
                key={q.id}
                className="q-item"
                aria-current={sel.kind === "question" && sel.id === q.id}
                onClick={() => setSel({ kind: "question", id: q.id })}
              >
                <span className="t">
                  {draft.questions.indexOf(q) + 1}. {q.stem || <span className="faint">New question</span>}
                </span>
                <span className={`m ${showErrors && errs ? "err" : ""}`}>
                  {showErrors && errs ? errs[0] : q.topic}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="editor-main">
        <div className="editor-bar">
          <strong>{draft.title || "Untitled bank"}</strong>
          {dirty && (
            <span className="small muted row" style={{ gap: 6 }}>
              <span className="dirty-dot" /> Unsaved changes
            </span>
          )}
          <div className="spacer" />
          <span className="kbd">Ctrl+S</span>
          <button className="btn primary" onClick={save} disabled={!dirty}>
            Save bank
          </button>
        </div>

        <div className="inner">
          {sel.kind === "settings" && <Settings draft={draft} update={update} />}

          {current && (
            <div className="stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h2>Question {currentIndex + 1}</h2>
                <div className="row">
                  <button className="btn sm" onClick={() => addQuestion(current)}>
                    Duplicate
                  </button>
                  <button className="btn sm danger" onClick={() => deleteQuestion(current.id)}>
                    Delete
                  </button>
                </div>
              </div>

              {showErrors && errorsById.get(current.id)?.map((e) => (
                <p key={e} className="notice error">
                  {e}
                </p>
              ))}

              <div className="form-grid" style={{ marginBottom: 0 }}>
                <label className="field">
                  <span>Section</span>
                  <select
                    className="select"
                    value={current.section ?? ""}
                    onChange={(e) => updateQ(current.id, (q) => ({ ...q, section: e.target.value || undefined }))}
                  >
                    <option value="">None</option>
                    {draft.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Topic</span>
                  <input
                    className="input"
                    list="topic-list"
                    value={current.topic}
                    onChange={(e) => updateQ(current.id, (q) => ({ ...q, topic: e.target.value }))}
                  />
                  <datalist id="topic-list">
                    {topics.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </label>
              </div>

              <label className="field">
                <span>Question</span>
                <textarea
                  className="textarea serif"
                  rows={4}
                  value={current.stem}
                  placeholder="Type the question"
                  onChange={(e) => updateQ(current.id, (q) => ({ ...q, stem: e.target.value }))}
                />
              </label>

              <div className="field">
                <span>Choices (click the bubble to mark the correct answer{current.answer.length > 1 ? "s" : ""})</span>
                {current.choices.map((c, i) => {
                  const right = current.answer.includes(i);
                  return (
                    <div key={i} className="choice-edit">
                      <button
                        className="mark"
                        aria-label={`Mark choice ${LETTERS[i]} correct`}
                        aria-pressed={right}
                        onClick={() =>
                          updateQ(current.id, (q) => {
                            const multi = q.answer.length > 1 || multiMode(q);
                            if (!multi) return { ...q, answer: [i] };
                            const next = right ? q.answer.filter((x) => x !== i) : [...q.answer, i].sort((a, b) => a - b);
                            return { ...q, answer: next };
                          })
                        }
                      >
                        <span className={`bubble ${right ? "right" : ""}`}>{LETTERS[i]}</span>
                      </button>
                      <textarea
                        className="textarea"
                        style={{ minHeight: 40 }}
                        rows={1}
                        value={c}
                        placeholder={`Choice ${LETTERS[i]}`}
                        onChange={(e) =>
                          updateQ(current.id, (q) => ({
                            ...q,
                            choices: q.choices.map((x, j) => (j === i ? e.target.value : x)),
                          }))
                        }
                      />
                      <button
                        className="btn ghost sm"
                        aria-label={`Remove choice ${LETTERS[i]}`}
                        disabled={current.choices.length <= 2}
                        onClick={() =>
                          updateQ(current.id, (q) => ({
                            ...q,
                            choices: q.choices.filter((_, j) => j !== i),
                            answer: q.answer.filter((a) => a !== i).map((a) => (a > i ? a - 1 : a)),
                          }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                <div className="row" style={{ marginTop: 8 }}>
                  <button
                    className="btn sm"
                    disabled={current.choices.length >= 8}
                    onClick={() => updateQ(current.id, (q) => ({ ...q, choices: [...q.choices, ""] }))}
                  >
                    Add choice
                  </button>
                  <label className="check small">
                    <input
                      type="checkbox"
                      checked={multiMode(current)}
                      onChange={(e) =>
                        updateQ(current.id, (q) => {
                          setMulti(q.id, e.target.checked);
                          return e.target.checked ? q : { ...q, answer: q.answer.slice(0, 1) };
                        })
                      }
                    />
                    More than one correct answer
                  </label>
                </div>
              </div>

              <label className="field">
                <span>Explanation (shown after answering)</span>
                <textarea
                  className="textarea serif"
                  rows={3}
                  value={current.explanation ?? ""}
                  placeholder="Why the answer is right, and what makes the others wrong"
                  onChange={(e) =>
                    updateQ(current.id, (q) => ({ ...q, explanation: e.target.value || undefined }))
                  }
                />
              </label>

              <div className="row" style={{ justifyContent: "space-between", paddingTop: 8 }}>
                <button
                  className="btn"
                  disabled={currentIndex <= 0}
                  onClick={() => setSel({ kind: "question", id: draft.questions[currentIndex - 1].id })}
                >
                  Previous
                </button>
                <button
                  className="btn"
                  disabled={currentIndex >= draft.questions.length - 1}
                  onClick={() => setSel({ kind: "question", id: draft.questions[currentIndex + 1].id })}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// "More than one correct answer" toggle state for questions that currently
// have a single answer marked (otherwise it's implied by answer.length > 1).
const multiFlags = new Set<string>();
const multiMode = (q: Question) => q.answer.length > 1 || multiFlags.has(q.id);
const setMulti = (id: string, on: boolean) => (on ? multiFlags.add(id) : multiFlags.delete(id));

function Settings({ draft, update }: { draft: Bank; update: (fn: (b: Bank) => Bank) => void }) {
  const [newSection, setNewSection] = useState("");
  const warnings = bankWarnings(draft);
  const quotas = draft.exam.sectionQuotas ?? {};
  const setExam = (patch: Partial<Bank["exam"]>) => update((b) => ({ ...b, exam: { ...b.exam, ...patch } }));

  function addSection() {
    const name = newSection.trim();
    if (!name) return;
    let id = slugify(name);
    while (draft.sections.some((s) => s.id === id)) id = `${id}-2`;
    update((b) => ({ ...b, sections: [...b.sections, { id, name }] }));
    setNewSection("");
  }

  function removeSection(id: string) {
    update((b) => {
      const q = { ...(b.exam.sectionQuotas ?? {}) };
      delete q[id];
      return {
        ...b,
        sections: b.sections.filter((s) => s.id !== id),
        questions: b.questions.map((x) => (x.section === id ? { ...x, section: undefined } : x)),
        exam: { ...b.exam, sectionQuotas: Object.keys(q).length ? q : undefined },
      };
    });
  }

  return (
    <div className="stack">
      <h2>Bank settings</h2>
      {warnings.map((w) => (
        <p key={w} className="notice">
          {w}
        </p>
      ))}
      <label className="field">
        <span>Title</span>
        <input className="input" value={draft.title} onChange={(e) => update((b) => ({ ...b, title: e.target.value }))} />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea
          className="textarea"
          rows={2}
          value={draft.description ?? ""}
          onChange={(e) => update((b) => ({ ...b, description: e.target.value || undefined }))}
        />
      </label>
      <label className="field">
        <span>Author</span>
        <input
          className="input"
          value={draft.author ?? ""}
          onChange={(e) => update((b) => ({ ...b, author: e.target.value || undefined }))}
        />
      </label>

      <div className="panel">
        <h3 style={{ marginBottom: 12 }}>Timed exam defaults</h3>
        <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <label className="field">
            <span>Questions per exam</span>
            <input
              className="input num"
              type="number"
              min={1}
              value={draft.exam.questionCount}
              onChange={(e) => setExam({ questionCount: Math.max(1, Number(e.target.value) || 1) })}
            />
          </label>
          <label className="field">
            <span>Time limit (minutes)</span>
            <input
              className="input num"
              type="number"
              min={1}
              value={draft.exam.timeLimitMinutes}
              onChange={(e) => setExam({ timeLimitMinutes: Math.max(1, Number(e.target.value) || 1) })}
            />
          </label>
          <label className="field">
            <span>Passing score (%)</span>
            <input
              className="input num"
              type="number"
              min={1}
              max={100}
              value={draft.exam.passingPercent}
              onChange={(e) => setExam({ passingPercent: Math.min(100, Math.max(1, Number(e.target.value) || 1)) })}
            />
          </label>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: 4 }}>Sections</h3>
        <p className="small muted" style={{ marginBottom: 12 }}>
          Optional. Set a per-exam count to keep each section in its own block with a fixed number of questions, like a
          national and a state portion. Leave the count blank to draw freely.
        </p>
        {draft.sections.length > 0 && (
          <table className="table" style={{ marginBottom: 12 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th className="r">In bank</th>
                <th className="r">Per exam</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {draft.sections.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input
                      className="input"
                      value={s.name}
                      onChange={(e) =>
                        update((b) => ({
                          ...b,
                          sections: b.sections.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)),
                        }))
                      }
                    />
                  </td>
                  <td className="r">{draft.questions.filter((q) => q.section === s.id).length}</td>
                  <td className="r" style={{ width: 110 }}>
                    <input
                      className="input num"
                      type="number"
                      min={0}
                      value={quotas[s.id] ?? ""}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        const next = { ...quotas };
                        if (n > 0) next[s.id] = n;
                        else delete next[s.id];
                        setExam({ sectionQuotas: Object.keys(next).length ? next : undefined });
                      }}
                    />
                  </td>
                  <td className="r">
                    <button className="btn ghost sm danger" onClick={() => removeSection(s.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="row" style={{ flexWrap: "nowrap", maxWidth: 420 }}>
          <input
            className="input"
            placeholder="New section name"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSection()}
          />
          <button className="btn" onClick={addSection} disabled={!newSection.trim()}>
            Add section
          </button>
        </div>
      </div>
    </div>
  );
}
