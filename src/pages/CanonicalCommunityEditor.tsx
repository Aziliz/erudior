import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course, Bank } from "../lib/types";
import { API, api as community } from "../lib/community";
import { checkDoc, LEVELS, SUBJECTS, TYPES, type CommunityDoc } from "../lib/communityFormat";
import { canonicalAuthoringFromCourse, courseFromCanonicalAuthoring, validateCanonicalAuthoring } from "../lib/canonicalAuthoring";
import { exportText, pickJsonFile } from "../lib/storage";
import { registerNavigationGuard } from "../lib/navigationGuard";
import CourseEditor from "./CourseEditor";
import Editor from "./Editor";
import DeckEditor from "./DeckEditor";

type Meta = { status: string; version: number; review: string; reviewNote: string | null };
/** A community persistence adapter around the same canonical editors used by the app. */
export default function CanonicalCommunityEditor({ api, id, initialDoc, initialMeta }: { api: AppApi; id: string; initialDoc: CommunityDoc; initialMeta: Meta }) {
  const [doc, setDoc] = useState(initialDoc);
  const latest = useRef(initialDoc);
  const persisted = useRef(initialDoc);
  const [meta, setMeta] = useState(initialMeta);
  const [view, setView] = useState<"home" | "course" | `bank:${string}` | `deck:${string}`>("home");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const readOnly = meta.status === "removed";
  const course = courseFromCanonicalAuthoring(doc.canonical, { strict: false, communityImageOrigin: API || undefined }) as Course;
  useEffect(() => {
    const guard = registerNavigationGuard(() => {
      if (view === "home" && !lock.current && latest.current === persisted.current) return true;
      api.toast("Use the editor's Done button, then save listing changes before leaving."); return false;
    });
    const unload = (e: BeforeUnloadEvent) => { if (view !== "home" || lock.current || latest.current !== persisted.current) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", unload);
    return () => { guard(); window.removeEventListener("beforeunload", unload); };
  }, [view, api.toast]);
  async function save(next: CommunityDoc) {
    if (readOnly || lock.current) throw Error("This draft is read-only or another save is pending.");
    const errors = checkDoc(next, false, { communityImageOrigin: API || undefined }); if (errors.length) throw Error(errors.join("; "));
    lock.current = true; setBusy(true); setError("");
    try { await community.save(id, next); latest.current = next; persisted.current = next; setDoc(next); setMessage("Canonical draft saved."); }
    catch (e) { setError((e as Error).message); throw e; }
    finally { lock.current = false; setBusy(false); }
  }
  async function saveCourse(next: Course) {
    // The embedded editors operate on portable IDs, never runtime or approval metadata.
    const canonical = canonicalAuthoringFromCourse(JSON.parse(JSON.stringify(next)), { strict: false, communityImageOrigin: API || undefined });
    await save({ ...latest.current, title: canonical.course.title, canonical });
  }
  const adapter: AppApi = { ...api, courses: [course], allCourses: [course], saveCourse,
    saveBank: async (bank: Bank) => {
      const current = courseFromCanonicalAuthoring(latest.current.canonical, { strict: false, communityImageOrigin: API || undefined }) as Course;
      await saveCourse({ ...current, banks: current.banks.map(b => b.id === bank.id ? bank : b) });
    },
    go: () => { if (!lock.current) setView("home"); },
  };
  const run = async (action: () => Promise<unknown>) => { setError(""); setMessage(""); try { await action(); } catch (e) { setError((e as Error).message); } };
  const change = (patch: Partial<CommunityDoc>) => { const next = { ...latest.current, ...patch }; latest.current = next; setDoc(next); };
  const problems = checkDoc(doc, true, { communityImageOrigin: API || undefined });
  const selectedBank = view.startsWith("bank:") ? course.banks.find(b => b.id === view.slice(5)) : undefined;
  const selectedDeck = view.startsWith("deck:") ? course.decks.find(d => d.id === view.slice(5)) : undefined;
  return <div className="page">
    <h1>Canonical community course: {course.title}</h1>
    <p>One authoritative course payload. Community review is not official-course approval. Publishing preserves source author metadata; the community publisher is separate provenance.</p>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {readOnly && <p role="alert">Taken down: {meta.reviewNote}. Editing and publishing are disabled.</p>}
    {view === "course" ? <fieldset className="canonical-course-editor-shell" disabled={busy || readOnly}><CourseEditor api={adapter} course={course} communityMode /></fieldset> : selectedBank ? <fieldset className="canonical-listing-fieldset" disabled={busy || readOnly}><Editor key={selectedBank.id} api={adapter} bank={selectedBank} /></fieldset> : selectedDeck ? <fieldset className="canonical-listing-fieldset" disabled={busy || readOnly}><DeckEditor key={selectedDeck.id} api={adapter} course={course} deck={selectedDeck} /></fieldset> : <>
      <fieldset className="canonical-listing-fieldset" disabled={busy || readOnly}><legend>Community listing</legend>
        <p>Listing title follows the authored course title. Listing classifications do not rewrite source metadata.</p>
        <label className="field">Description<textarea className="textarea" value={doc.description} onChange={e => change({ description: e.target.value })} /></label>
        {([['subject', SUBJECTS], ['level', LEVELS], ['type', TYPES]] as const).map(([key, choices]) => <label className="field" key={key}>{key}<select className="select" value={doc[key] ?? "Course"} onChange={e => change({ [key]: e.target.value })}>{choices.map(value => <option key={value}>{value}</option>)}</select></label>)}
        <button className="btn" onClick={() => run(() => save(latest.current))}>Save listing draft</button>
      </fieldset>
      <fieldset className="canonical-listing-fieldset" disabled={busy || readOnly}><legend>Canonical authoring</legend>
        <button className="btn" onClick={() => setView("course")}>Edit full course</button>
        {course.banks.map(bank => <button className="btn" key={bank.id} onClick={() => setView(`bank:${bank.id}`)}>Edit question bank: {bank.title}</button>)}
        {course.decks.map(deck => <button className="btn" key={deck.id} onClick={() => setView(`deck:${deck.id}`)}>Edit notecard deck: {deck.title}</button>)}
        <button className="btn" onClick={() => run(async () => { const bankId = `bank-${crypto.randomUUID()}`; await saveCourse({ ...course, banks: [...course.banks, { format: "examiner-bank", version: 1, id: bankId, title: "New question bank", sections: [], questions: [], exam: { questionCount: 10, timeLimitMinutes: 15, passingPercent: 70 } }] }); setView(`bank:${bankId}`); })}>Add question bank</button>
        <button className="btn" onClick={() => run(async () => { const deckId = `deck-${crypto.randomUUID()}`; await saveCourse({ ...course, decks: [...course.decks, { id: deckId, title: "New notecard deck", cards: [] }] }); setView(`deck:${deckId}`); })}>Add notecard deck</button>
        <button className="btn" onClick={() => run(async () => {
          const raw = await pickJsonFile(); if (raw === null) return;
          const payload = JSON.parse(raw); const errors = validateCanonicalAuthoring(payload, { strict: false, communityImageOrigin: API || undefined }); if (errors.length) throw Error(errors.join("; "));
          const canonical = canonicalAuthoringFromCourse(courseFromCanonicalAuthoring(payload, { strict: false, communityImageOrigin: API || undefined }), { strict: false, communityImageOrigin: API || undefined });
          await save({ ...latest.current, canonical, title: canonical.course.title });
        })}>Import canonical authoring file</button>
      </fieldset>
      <button className="btn" disabled={busy} onClick={() => run(() => exportText(JSON.stringify(doc.canonical, null, 2), `${id}-canonical-authoring.json`, "Canonical authoring payload"))}>Download original authoring payload</button>
      <p>The downloaded payload retains source IDs and revision. Installed courses receive community runtime IDs and the published community version; they do not replace this source.</p>
      <h2>Publish</h2><p>Current published version: {meta.version} · {meta.review}</p>
      {problems.length > 0 && <div role="status"><p>Resolve before publishing:</p><ul>{problems.map((problem, index) => <li key={index}>{problem}</li>)}</ul></div>}
      <button className="btn" disabled={busy || readOnly || problems.length > 0} onClick={() => run(async () => {
        await save(latest.current); lock.current = true; setBusy(true);
        try { const published = await community.publish(id); setMeta({ ...meta, status: "published", version: published.version, review: "not_reviewed" }); setMessage(`Published community version ${published.version}; not reviewed.`); }
        finally { lock.current = false; setBusy(false); }
      })}>Publish canonical version {meta.version + 1}</button>
    </>}
  </div>;
}
