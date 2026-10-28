import { useState } from "react";
import type { Course } from "../lib/types";
import type { SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
import { SAMPLE_ASSIGNMENT } from "../lib/spreadsheetAssignments";
import { validateWorkbook } from "../lib/workbookTemplates";
import { attachSpreadsheetAssignment, replaceSpreadsheetAssignment, removeSpreadsheetAssignment } from "../lib/spreadsheetCoursePackage";
import { uid } from "../lib/util";
import { AssignmentEditor } from "./AssignmentEditor";

type LinkedAssignment = SpreadsheetAssignment & { lessonId: string };
export default function CourseSpreadsheetEditor({ course, update, onEditingChange }:
  { course: Course; update: (fn: (course: Course) => Course) => void; onEditingChange: (editing: boolean) => void }) {
  const [editing, setEditing] = useState<LinkedAssignment | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [sheet, setSheet] = useState("");
  const [newSheet, setNewSheet] = useState("");
  const [cell, setCell] = useState("A1");
  const [raw, setRaw] = useState("");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [error, setError] = useState("");
  function start(assignment: LinkedAssignment, fresh: boolean) {
    setEditing(structuredClone(assignment)); setIsNew(fresh); setSheet(Object.keys(assignment.starter.sheets)[0]);
    setNewSheet(""); setCell("A1"); setRaw(String(assignment.starter.sheets[Object.keys(assignment.starter.sheets)[0]].A1 ?? "")); setError(""); onEditingChange(true);
  }
  function finish() { setEditing(null); setError(""); onEditingChange(false); }
  function editCell() {
    if (!editing) return;
    const address = cell.trim().toUpperCase();
    if (!/^[A-Z]+[1-9][0-9]*$/.test(address)) return setError("Enter a cell coordinate such as B3.");
    const value = raw.trim() && /^-?(?:\d+\.?\d*|\.\d+)$/.test(raw.trim()) ? Number(raw) : raw;
    const workbook = { sheets: { ...editing.starter.sheets, [sheet]: { ...editing.starter.sheets[sheet], [address]: value } } };
    if (!validateWorkbook(workbook)) return setError("This workbook exceeds supported limits or contains an invalid cell.");
    setEditing({ ...editing, starter: workbook }); setRaw(String(value)); setError("");
  }
  function addSheet() {
    if (!editing) return;
    const name = newSheet.trim();
    if (Object.keys(editing.starter.sheets).some(s => s.toLowerCase() === name.toLowerCase())) return setError("Worksheet names must be unique, ignoring case.");
    const workbook = { sheets: { ...editing.starter.sheets, [name]: {} } };
    if (!validateWorkbook(workbook)) return setError("Use a worksheet name beginning with a letter, up to 40 characters; at most 20 sheets.");
    setEditing({ ...editing, starter: workbook }); setSheet(name); setCell("A1"); setRaw(""); setNewSheet(""); setError("");
  }
  return <section className="stack" aria-label="Course spreadsheet assignments">
    <p className="small muted">Create reusable, lesson-linked exercises. Apply assignment changes, then save the course. Learner work is separate from the instructor starter.</p>
    {!editing && <>
      <button className="btn primary sm" type="button" disabled={!course.lessons.length} onClick={() => start({ ...structuredClone(SAMPLE_ASSIGNMENT), id: "sheet-" + uid(), lessonId: course.lessons[0].id, title: "New spreadsheet assignment" }, true)}>Add spreadsheet assignment</button>
      {!course.lessons.length && <p>Add a lesson before attaching an assignment.</p>}
      {(course.spreadsheetAssignments ?? []).map(assignment => <div className="panel" key={assignment.id}>
        <h3>{assignment.title}</h3><p className="small">Lesson: {course.lessons.find(l => l.id === assignment.lessonId)?.title ?? "Missing lesson"} · {Object.keys(assignment.answers).length} grading criteria</p>
        <div className="row"><button className="btn sm" type="button" onClick={() => start(assignment, false)}>Edit {assignment.title}</button>
          <button className="btn sm" type="button" onClick={() => setRemoveId(assignment.id)}>Remove {assignment.title}</button></div>
        {removeId === assignment.id && <div role="group" aria-label="Confirm assignment removal"><p>Remove this exercise from the draft? Published assignment IDs must be retained in future official revisions to preserve learner records.</p><button className="btn sm danger" type="button" onClick={() => { update(c => removeSpreadsheetAssignment(c, assignment.id)); setRemoveId(null); }}>Confirm removal</button><button className="btn sm" type="button" onClick={() => setRemoveId(null)}>Keep assignment</button></div>}
      </div>)}
    </>}
    {editing && <>
      <label>Attached lesson <select className="select" value={editing.lessonId} onChange={e => setEditing({ ...editing, lessonId: e.target.value })}>{course.lessons.map(l => <option value={l.id} key={l.id}>{l.title}</option>)}</select></label>
      <p className="small muted">Stable assignment ID: {editing.id}</p>
      <section className="panel" aria-label="Assignment starter workbook">
        <h3>Starter workbook</h3>
        <label>Worksheet <select className="select" value={sheet} onChange={e => { setSheet(e.target.value); setCell("A1"); setRaw(String(editing.starter.sheets[e.target.value].A1 ?? "")); }}>{Object.keys(editing.starter.sheets).map(s => <option key={s}>{s}</option>)}</select></label>
        <div className="row"><label>New worksheet <input className="input" value={newSheet} onChange={e => setNewSheet(e.target.value)} /></label><button type="button" className="btn sm" onClick={addSheet}>Add worksheet</button></div>
        <div className="row" style={{ flexWrap: "wrap" }}><label>Starter cell <input className="input" value={cell} onChange={e => { setCell(e.target.value); setRaw(String(editing.starter.sheets[sheet][e.target.value.toUpperCase()] ?? "")); }} /></label><label>Starter content <input className="input" value={raw} onChange={e => setRaw(e.target.value)} /></label><button type="button" className="btn sm" onClick={editCell}>Set starter cell</button></div>
        <p className="small muted">Enter a number, text or supported formula. Blank graded cells let learners supply their own answer.</p>
        <div style={{ maxHeight: 280, overflow: "auto" }}><table className="table"><thead><tr><th>Cell</th><th>Starter content</th><th>Action</th></tr></thead><tbody>{Object.entries(editing.starter.sheets[sheet]).map(([address, value]) => <tr key={address}><th scope="row">{address}</th><td>{String(value) || "(blank)"}</td><td><button type="button" className="btn sm" onClick={() => { setCell(address); setRaw(String(value)); }}>Edit {sheet}!{address}</button></td></tr>)}</tbody></table></div>
      </section>
      <AssignmentEditor key={editing.id} workbook={editing.starter} initialAssignment={editing} submitLabel="Apply assignment to course" onCancel={finish} onUse={assignment => {
        if (newSheet.trim()) throw Error("Add or clear the pending worksheet name first.");
        if (String(editing.starter.sheets[sheet][cell.trim().toUpperCase()] ?? "") !== raw) throw Error("Set the pending starter cell before applying assignment changes.");
        update(c => isNew ? attachSpreadsheetAssignment(c, editing.lessonId, assignment) : replaceSpreadsheetAssignment(c, editing.lessonId, assignment)); finish();
      }} />
    </>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
