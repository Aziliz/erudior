import { useMemo, useState } from "react";
import { compareReviewEntries, type ReviewBaseline } from "../lib/reviewSnapshot";
import type { QuestionLocation } from "./BlindQuestionReview";

export default function CourseReviewChanges({ current, previous, openQuestion }: {
  current?: ReviewBaseline; previous?: ReviewBaseline; openQuestion: (where: QuestionLocation) => void;
}) {
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(40);
  const changes = useMemo(() => previous && current ? compareReviewEntries(previous.entries, current.entries) : [], [previous, current]);
  if (!previous) return <p>This review has no saved item comparison. Record a review on this version to enable comparisons for future edits.</p>;
  if (!current) return <p>Checking for course changes…</p>;
  const matching = changes.filter(c => c.label.toLowerCase().includes(filter.trim().toLowerCase()));
  return <div>
    <p>{changes.length} changed entries since revision {previous.revision}.</p>
    {!!changes.length && <>
      <label className="field">Filter changes<input className="input" value={filter} onChange={e => { setFilter(e.target.value); setLimit(40); }} /></label>
      <ul>{matching.slice(0, limit).map(c => {
        // Added and edited keys originate from the current course index.
        const parts: unknown = c.change === "Removed" ? null : JSON.parse(c.key);
        const canOpen = Array.isArray(parts) && ["Question", "Answer key", "Explanation"].includes(parts[0]);
        return <li key={c.key}>{c.change} · {c.label} {canOpen && <button type="button" className="btn sm"
          onClick={() => openQuestion({ bankId: parts[1], questionId: parts[2] })}>Review question</button>}</li>;
      })}</ul>
      {filter && !matching.length && <p>No matching changes.</p>}
      {matching.length > limit && <button type="button" className="btn sm" onClick={() => setLimit(limit + 40)}>Show more changes</button>}
    </>}
  </div>;
}
