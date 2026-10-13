import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Bank, Card, Course, GlossaryEntry, Lesson, Question, RefSheet } from "../lib/types";
import { startPractice } from "../lib/session";
import { LETTERS } from "../lib/util";

type Hit =
  | { kind: "lesson"; course: Course; item: Lesson; text: string }
  | { kind: "ref"; course: Course; item: RefSheet; text: string }
  | { kind: "term"; course: Course; item: GlossaryEntry; text: string }
  | { kind: "question"; bank: Bank; course?: Course; item: Question; text: string }
  | { kind: "card"; course: Course; deck: string; item: Card; text: string };

const GROUPS: { kind: Hit["kind"]; label: string }[] = [
  { kind: "term", label: "Glossary" },
  { kind: "lesson", label: "Lessons" },
  { kind: "ref", label: "Quick reference" },
  { kind: "question", label: "Questions" },
  { kind: "card", label: "Notecards" },
];

/** Strip Markdown and glossary-link syntax down to plain text for matching and snippets. */
function plain(md: string): string {
  return md
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, t, s) => s ?? t)
    .replace(/[#>*_`|]/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(text: string, terms: string[]): boolean {
  const t = text.toLowerCase();
  return terms.every((w) => t.includes(w));
}

function snippet(text: string, terms: string[], width = 160): string {
  const t = text.toLowerCase();
  const at = Math.max(0, t.indexOf(terms[0]));
  const start = Math.max(0, at - 50);
  const s = text.slice(start, start + width);
  return (start > 0 ? "…" : "") + s + (start + width < text.length ? "…" : "");
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

export default function SearchPage({ api, initial }: { api: AppApi; initial: string }) {
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [more, setMore] = useState<Record<string, boolean>>({});
  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const index = useMemo(() => {
    const out: Hit[] = [];
    for (const c of api.courses) {
      for (const l of c.lessons) out.push({ kind: "lesson", course: c, item: l, text: `${l.title} ${plain(l.body)}` });
      for (const r of c.references) out.push({ kind: "ref", course: c, item: r, text: `${r.title} ${plain(r.body)}` });
      for (const g of c.glossary)
        out.push({ kind: "term", course: c, item: g, text: `${g.term} ${(g.aliases ?? []).join(" ")} ${g.definition}` });
      for (const d of c.decks)
        for (const card of d.cards)
          out.push({ kind: "card", course: c, deck: d.title, item: card, text: plain(`${card.front} ${card.back}`) });
    }
    for (const b of api.banks) {
      const course = b.courseId ? api.courses.find((c) => c.id === b.courseId) : undefined;
      for (const qq of b.questions)
        out.push({
          kind: "question",
          bank: b,
          course,
          item: qq,
          text: `${qq.stem} ${qq.choices.join(" ")} ${qq.explanation ?? ""}`,
        });
    }
    return out;
  }, [api.courses, api.banks]);

  const hits = terms.length ? index.filter((h) => matches(h.text, terms)) : [];
  // Rank: title/term matches first within each group.
  const titleOf = (h: Hit) =>
    h.kind === "term" ? h.item.term : h.kind === "lesson" || h.kind === "ref" ? h.item.title : "";
  const scored = hits
    .map((h) => ({ h, s: matches(titleOf(h), terms) ? 0 : 1 }))
    .sort((a, b) => a.s - b.s)
    .map((x) => x.h);
  const multiCourse = api.courses.length > 1;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Search</h1>
          <p className="muted">Lessons, glossary, quick reference, questions and notecards.</p>
        </div>
      </div>
      <input
        className="input search-big"
        autoFocus
        value={q}
        placeholder="Try “earnest money”, “transaction-broker” or “cap rate”"
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search"
      />
      {terms.length > 0 && (
        <p className="small muted" style={{ margin: "10px 2px 18px" }}>
          {hits.length ? `${hits.length} result${hits.length === 1 ? "" : "s"}` : `Nothing matches “${q.trim()}”.`}
        </p>
      )}

      {GROUPS.map(({ kind, label }) => {
        const group = scored.filter((h) => h.kind === kind);
        if (!group.length) return null;
        const shown = more[kind] ? group : group.slice(0, 8);
        return (
          <section key={kind} className="panel search-group">
            <div className="panel-head">
              <h2>{label}</h2>
              <span className="small muted num">{group.length}</span>
            </div>
            <ul className="hits">
              {shown.map((h, i) => {
                const key = `${kind}-${i}-${"id" in h.item ? h.item.id : titleOf(h)}`;
                const where = h.kind === "question" ? h.bank.title : h.course.title;
                return (
                  <li key={key}>
                    {h.kind === "lesson" && (
                      <button
                        className="hit"
                        onClick={() => api.go({ name: "lesson", courseId: h.course.id, lessonId: h.item.id })}
                      >
                        <b>
                          <Highlight text={h.item.title} terms={terms} />
                        </b>
                        <span className="small muted">
                          <Highlight text={snippet(plain(h.item.body), terms)} terms={terms} />
                        </span>
                      </button>
                    )}
                    {h.kind === "ref" && (
                      <button className="hit" onClick={() => api.go({ name: "ref", courseId: h.course.id, refId: h.item.id })}>
                        <b>
                          <Highlight text={h.item.title} terms={terms} />
                        </b>
                        <span className="small muted">
                          <Highlight text={snippet(plain(h.item.body), terms)} terms={terms} />
                        </span>
                      </button>
                    )}
                    {h.kind === "term" && (
                      <div className="hit static">
                        <b>
                          <Highlight text={h.item.term} terms={terms} />
                        </b>
                        <span className="small">
                          <Highlight text={h.item.definition} terms={terms} />
                        </span>
                      </div>
                    )}
                    {h.kind === "card" && (
                      <button className="hit" onClick={() => setOpen(open === key ? null : key)} aria-expanded={open === key}>
                        <b>
                          <Highlight text={plain(h.item.front)} terms={terms} />
                        </b>
                        {open === key ? (
                          <span className="small">
                            <Highlight text={plain(h.item.back)} terms={terms} />
                          </span>
                        ) : (
                          <span className="small faint">Show answer</span>
                        )}
                      </button>
                    )}
                    {h.kind === "question" && (
                      <div className="hit static">
                        <button className="hit-q" onClick={() => setOpen(open === key ? null : key)} aria-expanded={open === key}>
                          <b>
                            <Highlight text={h.item.stem} terms={terms} />
                          </b>
                          {open !== key && <span className="small faint">Show answer</span>}
                        </button>
                        {open === key && (
                          <div className="hit-detail">
                            <ul className="review-choices">
                              {h.item.choices.map((c, ci) => (
                                <li key={ci}>
                                  <span className={`bubble ${h.item.answer.includes(ci) ? "right" : ""}`}>{LETTERS[ci]}</span>
                                  <span>
                                    <Highlight text={c} terms={terms} />
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {h.item.explanation && (
                              <p className="review-expl">
                                <Highlight text={h.item.explanation} terms={terms} />
                              </p>
                            )}
                            <button
                              className="btn sm"
                              style={{ marginTop: 10 }}
                              onClick={() =>
                                api.go({
                                  name: "run",
                                  session: startPractice(h.bank, api.progress, {
                                    count: 1,
                                    topics: [],
                                    sections: [],
                                    filter: "all",
                                    shuffleChoices: true,
                                    questionIds: [h.item.id],
                                  }),
                                })
                              }
                            >
                              Practice this question
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {multiCourse && <span className="faint small hit-where">{where}</span>}
                  </li>
                );
              })}
            </ul>
            {group.length > shown.length && (
              <button className="btn sm ghost" onClick={() => setMore({ ...more, [kind]: true })}>
                Show all {group.length}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
