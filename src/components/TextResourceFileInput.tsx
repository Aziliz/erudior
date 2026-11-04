import { useEffect, useRef, useState } from "react";
import { parseReaderImport, readerImportFileProblem } from "../lib/readerImport";

/** Local text preview only: file contents are never executed or fetched. Apply is explicit. */
export default function TextResourceFileInput({ label, value, onApply }: { label: string; value: string; onApply: (value: string) => void }) {
  const epoch = useRef(0), live = useRef(true), latest = useRef({ value, onApply });
  latest.current = { value, onApply };
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [candidate, setCandidate] = useState<{ name: string; text: string; before: string } | null>(null);
  useEffect(() => { live.current = true; return () => { live.current = false; epoch.current++; }; }, []);
  const cancel = () => { epoch.current++; setBusy(false); setCandidate(null); setError(""); };
  async function read(file: File) {
    const token = ++epoch.current, before = value;
    setCandidate(null); setError(""); setBusy(false);
    const problem = readerImportFileProblem(file.name, file.size);
    if (problem) { setError(problem); return; }
    setBusy(true);
    try {
      const bytes = await new Promise<ArrayBuffer>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(Error("Could not read the selected file.")); reader.onload = () => reader.result instanceof ArrayBuffer ? resolve(reader.result) : reject(Error("Invalid file contents.")); reader.readAsArrayBuffer(file); });
      if (!live.current || token !== epoch.current) return;
      if (latest.current.value !== before) throw Error("The destination changed. Choose the file again before replacing it.");
      const result = parseReaderImport(file.name, new Uint8Array(bytes));
      setCandidate({ name: file.name, text: result.body, before });
    } catch (e) { if (live.current && token === epoch.current) setError(e instanceof Error ? e.message : "Could not import file."); }
    finally { if (live.current && token === epoch.current) setBusy(false); }
  }
  return <fieldset className="text-resource-import"><legend>Import {label}</legend>
    <p>Choose a UTF-8 .txt or .md file you may distribute. Review its text before replacing this field. No file is uploaded or executed.</p>
    <label className="field"><span>{label} file</span><input className="input" type="file" accept=".txt,.md,.markdown,text/plain,text/markdown" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void read(file); }} /></label>
    {busy && <p role="status">Reading text file…</p>}
    {candidate && <><p>Selected file: {candidate.name}</p><pre className="resource-text-preview" role="region" tabIndex={0} aria-label={`${label} file preview`}>{candidate.text}</pre>
      <button className="btn" type="button" onClick={() => { if (latest.current.value !== candidate.before) { setError("The destination changed. Choose the file again before replacing it."); setCandidate(null); return; } try { latest.current.onApply(candidate.text); cancel(); } catch (e) { setError(e instanceof Error ? e.message : "Could not apply text."); } }}>Replace {label} with file text</button></>}
    {(busy || candidate) && <button className="btn" type="button" onClick={cancel}>Cancel {label} import</button>}
    {error && <p role="alert">{error}</p>}
  </fieldset>;
}
