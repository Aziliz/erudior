import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import { loadPhotos } from "../lib/portfolio";
import type { PortfolioPhoto } from "../lib/reports";
import { parseStudentWorkspace } from "../lib/studentWorkspace";

/** Learner-safe view: no parent records, report generation or authority to edit assessed work. */
export default function StudentPortfolio({ api }: { api: AppApi }) {
  const id = api.student?.id ?? null;
  const [loaded, setLoaded] = useState<{ id: string; photos: PortfolioPhoto[] } | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let live = true;
    setLoaded(null); setError("");
    if (id) void loadPhotos(id).then(values => {
      if (!Array.isArray(values) || values.length > 500) throw Error("The saved portfolio cannot be displayed safely.");
      let totalBytes = 0;
      for (const value of values) {
        if (value && typeof value.image === "string") totalBytes += value.image.length;
        if (totalBytes > 32 * 1024 * 1024) throw Error("This portfolio is too large to preview here. Your saved originals are unchanged.");
      }
      const photos = values.filter(photo => photo && typeof photo.id === "string" && typeof photo.caption === "string"
        && photo.caption.length <= 10000 && typeof photo.subject === "string" && photo.subject.length <= 1000
        && typeof photo.date === "string" && photo.date.length <= 40 && typeof photo.image === "string"
        && photo.image.length <= 8 * 1024 * 1024 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo.image));
      if (photos.length !== values.length) throw Error("Some saved portfolio photos have an unsupported format. Your originals are unchanged; ask your supervising adult to review them.");
      if (live) setLoaded({ id, photos });
    }).catch(problem => { if (live) setError(problem instanceof Error ? problem.message : "Could not load portfolio photos."); });
    return () => { live = false; };
  }, [id, retry]);
  let projects: import("../lib/studentWorkspace").WorkspaceEntry[] = [];
  try { projects = parseStudentWorkspace(api.progress.studentWorkspace).entries.filter(entry => entry.kind === "project" && entry.status === "done"); } catch { /* Main workspace reports invalid data without hiding the unchanged photos. */ }
  const photos = loaded?.id === id ? loaded.photos : [];
  return <section className="panel" aria-labelledby="student-portfolio-title">
    <h2 id="student-portfolio-title">Your portfolio</h2>
    <p className="muted">Your completed projects and saved work photos. A personal collection is not a grade, assessed credit, or a credential. Adult-managed records stay separate.</p>
    <h3>Completed projects</h3>
    {projects.length ? <ul>{projects.map(project => <li key={project.id}><strong>{project.title}</strong>{project.body && <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{project.body}</p>}</li>)}</ul>
      : <p className="muted">Mark one of your projects done to collect it here.</p>}
    <h3>Saved work photos</h3>
    {!id ? <p className="muted">Work photos are available for a selected local family or classroom learner. Your independent projects are collected above.</p>
      : error ? <div role="alert"><p>{error}</p><button className="btn" onClick={() => setRetry(value => value + 1)}>Retry portfolio</button></div>
      : !loaded ? <p role="status">Loading your saved photos…</p>
      : !photos.length ? <p className="muted">No work photos have been saved for you yet. Your supervising adult can add them in the existing records area.</p>
      : <div className="student-portfolio-photos">{photos.map((photo, index) => <figure key={`${photo.id}-${index}`}>
          <img src={photo.image} alt={photo.caption || "Saved work sample"} loading="lazy" style={{ maxWidth: "100%", maxHeight: 320, objectFit: "contain" }} />
          <figcaption>{photo.caption}<span className="small muted"> {photo.subject} · {photo.date}</span></figcaption>
        </figure>)}</div>}
  </section>;
}
