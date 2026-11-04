import { useEffect, useMemo, useRef, useState } from "react";
import type { Course } from "../lib/types";
import { MAX_AUDIO_CLIP_BYTES } from "../lib/courseAudio";
import { createOfflineCoursePackage, inspectOfflineCourse } from "../lib/offlineCourse";
import { exportPortableCourseText } from "../lib/storage";

/** A private, explicit file workflow: never fetch remote course media on the user's behalf. */
export default function OfflineCourseExport({ course, onClose, saveFile = exportPortableCourseText }: {
  course: Course;
  onClose: () => void;
  saveFile?: typeof exportPortableCourseText;
}) {
  const report = useMemo(() => {
    try { return { inspection: inspectOfflineCourse(course), error: "" }; }
    catch (error) { return { inspection: null, error: String(error) }; }
  }, [course]);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(0);
  const generation = useRef(0);
  const saving = useRef(false);
  const readers = useRef(new Map<string, FileReader>());
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    generation.current++;
    setReplacements({}); setFileNames({}); setError(""); setStatus(""); setReading(0); setBusy(false);
    saving.current = false;
    heading.current?.focus();
    return () => {
      generation.current++;
      readers.current.forEach(reader => reader.abort());
      readers.current.clear();
    };
  }, [course]);

  function chooseFile(source: string, kind: "image" | "audio", file: File | undefined) {
    if (!file || saving.current) return;
    const oldReader = readers.current.get(source);
    if (oldReader) { readers.current.delete(source); oldReader.abort(); }
    setReplacements(old => { const next = { ...old }; delete next[source]; return next; });
    setFileNames(old => { const next = { ...old }; delete next[source]; return next; });
    setError(""); setStatus("");
    const limit = kind === "image" ? 2 * 1024 * 1024 : MAX_AUDIO_CLIP_BYTES;
    if (file.size > limit || file.size === 0) {
      setError(`${file.name}: choose a nonempty ${kind} no larger than ${kind === "image" ? "2 MiB" : "400,000 bytes"}.`);
      setReading(readers.current.size); return;
    }
    const reader = new FileReader();
    const current = generation.current;
    readers.current.set(source, reader); setReading(readers.current.size);
    const finish = () => {
      if (current !== generation.current || readers.current.get(source) !== reader) return false;
      readers.current.delete(source); setReading(readers.current.size); return true;
    };
    reader.onload = () => {
      if (!finish()) return;
      if (typeof reader.result !== "string") { setError("The selected file could not be read."); return; }
      setReplacements(old => ({ ...old, [source]: reader.result as string }));
      setFileNames(old => ({ ...old, [source]: file.name }));
    };
    reader.onerror = () => { if (finish()) setError(`${file.name} could not be read. Choose the file again.`); };
    reader.onabort = () => { finish(); };
    try { reader.readAsDataURL(file); }
    catch { if (finish()) setError(`${file.name} could not be read. Choose the file again.`); }
  }

  async function save() {
    if (saving.current || readers.current.size || !report.inspection) return;
    saving.current = true; setBusy(true); setError(""); setStatus("");
    const current = generation.current;
    try {
      const text = await createOfflineCoursePackage(course, replacements);
      if (current !== generation.current) return;
      const saved = await saveFile(text, `${course.id}.erudior.json`, "Erudior offline course");
      if (current === generation.current) setStatus(saved ? "Offline package saved. Share this file directly; nothing was uploaded." : "Save cancelled. Your selections are kept.");
    } catch (failure) {
      if (current === generation.current) setError(`Could not save offline package: ${String(failure)}`);
    } finally {
      if (current === generation.current) { saving.current = false; setBusy(false); }
    }
  }

  const missing = report.inspection?.assets.filter(asset => !replacements[asset.source]).length ?? 0;
  return <section className="panel" aria-labelledby="offline-export-title" aria-busy={busy || reading > 0} style={{ marginBottom: 20, padding: 20 }}>
    <h2 id="offline-export-title" ref={heading} tabIndex={-1}>Share {course.title} offline</h2>
    <p>This package contains course content and embedded lesson media, not learner progress, submissions, credentials or account records. No account is required and nothing is uploaded.</p>
    <p>Share only content and media you have permission to redistribute. Keep the original attribution and license terms. A shared copy is not an officially signed or reviewed course.</p>
    <p className="muted">External links are not downloaded. Device speech voices and Python's first-use runtime may require separate setup or internet access.</p>
    {report.error && <p className="notice error" role="alert">{report.error}</p>}
    {report.inspection && <>
      <p>{report.inspection.assets.length ? `${report.inspection.assets.length} media file(s) need a local replacement. Remote files are never fetched automatically.` : "All lesson media is already embedded. Review the notes before saving."}</p>
      {report.inspection.warnings.length > 0 && <ul>{report.inspection.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>}
      {report.inspection.assets.map((asset, index) => <div key={asset.source} style={{ marginBottom: 16 }}>
        <label htmlFor={`offline-asset-${index}`}>Local {asset.kind} for <code style={{ overflowWrap: "anywhere" }}>{asset.source.length > 180 ? asset.source.slice(0, 180) + "…" : asset.source}</code></label>
        <input id={`offline-asset-${index}`} type="file" style={{ maxWidth: "100%" }} accept={asset.kind === "image" ? "image/png,image/jpeg,image/gif,image/webp,image/svg+xml" : "audio/mpeg,audio/mp3,audio/mp4,audio/aac,audio/x-m4a,audio/ogg,audio/opus,audio/wav,audio/x-wav,audio/wave,audio/webm,audio/flac,.mp3,.m4a,.mp4,.ogg,.oga,.opus,.wav,.wave,.webm,.aac,.flac"} disabled={busy} onChange={event => { chooseFile(asset.source, asset.kind, event.target.files?.[0]); event.target.value = ""; }} />
        {fileNames[asset.source] && <p className="muted">Selected: {fileNames[asset.source]}</p>}
      </div>)}
    </>}
    {error && <p className="notice error" role="alert">{error}</p>}
    <p role="status">{busy ? "Preparing or saving package…" : reading ? "Reading selected media…" : status || (missing ? `${missing} media file(s) still needed.` : "")}</p>
    <div className="row">
      <button className="btn primary" disabled={busy || reading > 0 || missing > 0 || !report.inspection} onClick={save}>Save offline package</button>
      <button className="btn ghost" onClick={onClose}>{busy ? "Close" : "Cancel"}</button>
    </div>
  </section>;
}
