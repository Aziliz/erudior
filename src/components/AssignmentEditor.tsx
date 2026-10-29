import { useState } from "react";
import type { Workbook } from "../lib/spreadsheet";
import { canonicalAssignmentAddress, validateAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
const KEY = "erudior.spreadsheet.author.assignment.v1";

export function AssignmentEditor({ workbook, onUse, initialAssignment, submitLabel = "Save and open assignment", onCancel, onPendingChange }:
  { workbook: Workbook; onUse: (assignment: SpreadsheetAssignment) => void; initialAssignment?: SpreadsheetAssignment; submitLabel?: string; onCancel?: () => void; onPendingChange?: (pending:boolean)=>void }) {
  const [title, setTitle] = useState(initialAssignment?.title ?? "My spreadsheet exercise");
  const [protectedText, setProtected] = useState(initialAssignment?.protectedCells.join(", ") ?? "");
  const [address, setAddress] = useState("");
  const [expected, setExpected] = useState("");
  const [expectedType, setExpectedType] = useState<"number" | "text">("number");
  const [tolerance, setTolerance] = useState(String(initialAssignment?.tolerance ?? 0));
  const [checks, setChecks] = useState<Record<string, number | string>>(initialAssignment?.answers ?? {});
  const [message, setMessage] = useState("");
  function add() {
    if (!address.trim()) return setMessage("Enter a worksheet!cell reference.");
    const key = canonicalAssignmentAddress(workbook, address);
    if (!key)
      return setMessage("Choose a cell on an existing worksheet, such as Budget!B3.");
    if (expectedType === "number" && (!expected.trim() || !Number.isFinite(Number(expected))))
      return setMessage("Enter a finite numeric result or choose Text.");
    setChecks(current => ({ ...current, [key]: expectedType === "number" ? Number(expected) : expected }));
    setAddress(""); setExpected(""); setMessage("");
  }
  function useAssignment() {
    if (address.trim() || expected) return setMessage("Add the pending criterion or clear its fields before applying.");
    if (!tolerance.trim()) return setMessage("Enter a numeric tolerance (0 for exact answers).");
    const assignment: SpreadsheetAssignment = {
      id: initialAssignment?.id ?? "local-spreadsheet-exercise", title,
      starter: structuredClone(workbook),
      protectedCells: protectedText.split(",").map(x => canonicalAssignmentAddress(workbook, x.trim()) ?? x.trim()).filter(Boolean),
      answers: { ...checks }, tolerance: Number(tolerance),
    };
    const errors = validateAssignment(assignment);
    if (errors.length) return setMessage(errors.join("; "));
    // Course authoring is persisted by the course editor, not a global author draft.
    if (!initialAssignment) {
      try { localStorage.setItem(KEY, JSON.stringify(assignment)); }
      catch { return setMessage("Unable to save assignment on this device. Your edits remain open."); }
    }
    try { onUse(assignment); setMessage("Assignment applied. Save the course to keep course changes."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to apply assignment."); }
  }
  function restore() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return setMessage("No saved author assignment on this device.");
      const saved: SpreadsheetAssignment = JSON.parse(raw);
      if (validateAssignment(saved).length) return setMessage("The saved assignment is invalid and was not loaded.");
      // Opening the saved starter together with its criteria avoids pairing a draft
      // with an unrelated workbook currently shown in the practice lab.
      onUse(structuredClone(saved));
    } catch { setMessage("Unable to restore the saved assignment."); }
  }
  return <section className="panel" aria-label="Spreadsheet assignment author" onChange={()=>onPendingChange?.(true)}>
    <h3>{initialAssignment ? "Assignment criteria" : "Author a spreadsheet assignment"}</h3>
    <p className="small muted">Protect starter cells and specify expected calculated results. Applying an assignment does not approve or publish official course content.</p>
    <label>Assignment title <input className="input" value={title} onChange={e => setTitle(e.target.value)} /></label>
    <label>Protected cells (comma-separated worksheet!cell references)
      <input className="input" placeholder="Budget!B1, Budget!B2" value={protectedText} onChange={e => setProtected(e.target.value)} />
    </label>
    <div className="row" style={{ flexWrap: "wrap" }}>
      <label>Graded cell <input className="input" placeholder="Budget!B3" value={address} onChange={e => setAddress(e.target.value)} /></label>
      <label>Result type <select className="select" value={expectedType} onChange={e => setExpectedType(e.target.value as "number" | "text")}><option value="number">Number</option><option value="text">Text</option></select></label>
      <label>Expected result <input className="input" value={expected} onChange={e => setExpected(e.target.value)} /></label>
      <button type="button" className="btn sm" onClick={add}>Add or replace criterion</button>
    </div>
    {Object.entries(checks).map(([key, value]) => <p className="small" key={key}>{key}: {JSON.stringify(value)} ({typeof value}) <button className="btn sm" type="button" aria-label={"Remove criterion " + key} onClick={() => setChecks(c => { const next = { ...c }; delete next[key]; return next; })}>Remove</button></p>)}
    <label>Numeric tolerance <input className="input" inputMode="decimal" value={tolerance} onChange={e => setTolerance(e.target.value)} /></label>
    <div className="row" style={{flexWrap:"wrap"}}>
      <button type="button" className="btn primary sm" onClick={useAssignment}>{submitLabel}</button>
      {onCancel && <button type="button" className="btn sm" onClick={onCancel}>Cancel assignment changes</button>}
      {!initialAssignment && <button type="button" className="btn sm" onClick={restore}>Restore saved assignment</button>}
    </div>
    {message && <p role="status" className="small">{message}</p>}
  </section>;
}
