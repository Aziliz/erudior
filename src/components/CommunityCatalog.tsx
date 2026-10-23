import { useEffect, useMemo, useState } from "react";
import type { AppApi } from "../App";
import { REPORT_REASONS, REVIEW_HELP, REVIEW_LABEL, api as community, type CommunityEntry, type Review } from "../lib/community";
import { SUBJECTS } from "../lib/communityFormat";

export function ReviewPill({ review }: { review: Review }) {
  return (
    <span className={`pill ${review === "reviewed" ? "pass" : "flagpill"}`} title={REVIEW_HELP[review]}>
      {REVIEW_LABEL[review]}
    </span>
  );
}

/** A small form to report a community course to the reviewers. */
export function ReportForm({ api, id, title, onDone }: { api: AppApi; id: string; title: string; onDone: () => void }) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="subpanel report-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await community.report(id, reason, details.trim());
          api.toast("Thanks. A reviewer will look at it.");
          onDone();
        } catch (err) {
          api.toast((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h4>Report “{title}”</h4>
      <label className="field">
        <span>What's wrong</span>
        <select className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
          {REPORT_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="field" style={{ marginTop: 8 }}>
        <span>Details (optional; don't include personal information)</span>
        <textarea className="textarea" value={details} maxLength={2000} onChange={(e) => setDetails(e.target.value)} />
      </label>
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn sm primary" type="submit" disabled={busy}>
          Send report
        </button>
        <button className="btn sm ghost" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Courses made by the community, in Free learning only (never in homeschool records). */
export default function CommunityCatalog({ api }: { api: AppApi }) {
  const [list, setList] = useState<CommunityEntry[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");
  const [reviewedOnly, setReviewedOnly] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [reporting, setReporting] = useState<string | null>(null);
  const [shown, setShown] = useState(12);

  useEffect(() => {
    community.catalog().then(setList, (e) => setError((e as Error).message));
  }, []);

  const installed = useMemo(() => new Map(api.courses.filter((c) => c.community).map((c) => [c.community!.id, c])), [api.courses]);
  const filtered = (list ?? []).filter((c) => {
    if (reviewedOnly && c.review !== "reviewed") return false;
    if (subject && c.subject !== subject) return false;
    const hay = `${c.title} ${c.description} ${c.author} ${c.subject} ${c.level}`.toLowerCase();
    return q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((w) => hay.includes(w));
  });

  async function start(id: string) {
    setBusy(id);
    await api.addCommunityCourse(id);
    setBusy(null);
  }

  return (
    <section className="catalog community">
      <div className="row" style={{ justifyContent: "space-between", margin: "36px 0 6px" }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          Community courses
        </h2>
        {list && <span className="small muted">{filtered.length === list.length ? `${list.length} courses` : `${filtered.length} of ${list.length} courses`}</span>}
      </div>
      <p className="small muted" style={{ marginBottom: 12 }}>
        Made by people who use Erudior. <b>Reviewed</b> means an Erudior reviewer checked that version; <b>Not reviewed</b> means nobody has yet.
        {api.family ? " Community courses are for free learning and don't count toward homeschool records." : ""}
      </p>
      {error ? (
        <p className="notice small" role="status">
          Community courses couldn't be loaded: {error}
        </p>
      ) : !list ? (
        <p className="muted small">Loading community courses…</p>
      ) : list.length === 0 ? (
        <p className="muted small">No community courses yet.</p>
      ) : (
        <>
          <div className="catalog-filters">
            <input className="input" type="search" placeholder="Search community courses" aria-label="Search community courses" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="field inline-field">
              <span>Subject</span>
              <select className="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">All</option>
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="check">
              <input type="checkbox" checked={reviewedOnly} onChange={(e) => setReviewedOnly(e.target.checked)} />
              Reviewed only
            </label>
          </div>
          <div className="catalog-grid">
            {filtered.slice(0, shown).map((c) => {
              const mine = installed.get(c.id);
              const outdated = mine && (mine.community!.version < c.version || mine.community!.review !== c.review);
              return (
                <div key={c.id} className="catalog-card">
                  <div className="catalog-tags">
                    <ReviewPill review={c.review} />
                    <span className="pill neutral">{c.subject}</span>
                    <span className="pill neutral">{c.level}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p className="small muted">by {c.author}</p>
                  <p className="muted small clamp3">{c.description}</p>
                  <p className="meta small muted">
                    {[c.counts.lessons && `${c.counts.lessons} lessons`, c.counts.questions && `${c.counts.questions} questions`, c.counts.cards && `${c.counts.cards} cards`]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <div className="row">
                    {mine ? (
                      <>
                        <button className="btn sm" onClick={() => api.go({ name: "course", courseId: mine.id })}>
                          In progress: open<span className="sr-only"> {c.title}</span>
                        </button>
                        {outdated && (
                          <button className="btn sm primary" disabled={busy !== null} onClick={() => start(c.id)}>
                            {busy === c.id ? "Updating…" : "Update"}
                            <span className="sr-only"> {c.title}</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <button className="btn sm primary" disabled={busy !== null} onClick={() => start(c.id)}>
                        {busy === c.id ? "Adding…" : "Start course"}
                        <span className="sr-only">: {c.title}</span>
                      </button>
                    )}
                    <button className="btn sm ghost" aria-expanded={reporting === c.id} onClick={() => setReporting(reporting === c.id ? null : c.id)}>
                      Report<span className="sr-only"> {c.title}</span>
                    </button>
                  </div>
                  {reporting === c.id && <ReportForm api={api} id={c.id} title={c.title} onDone={() => setReporting(null)} />}
                </div>
              );
            })}
          </div>
          {filtered.length > shown && (
            <button className="btn sm" style={{ marginTop: 12 }} onClick={() => setShown((n) => n + 12)}>
              Show more
            </button>
          )}
        </>
      )}
    </section>
  );
}
