// Parent area: Reading and activities (reading log, PE / extracurricular / volunteer hours)
// and Documents (files on record: notices, test reports, immunization forms…).

import { useRef, useState } from "react";
import type { AppApi } from "../App";
import { SUBJECTS, type Family } from "../lib/family";
import { ACTIVITY_KINDS, bookMinutes, loadRecords, updateRecordsAtomic, type Records } from "../lib/records";
import { DOC_KINDS, deleteFile, newDocRef, saveCopy, storeFile } from "../lib/documents";
import { today } from "../lib/srs";
import { uid } from "../lib/util";
import * as store from "../lib/storage";
import { RecordsStatus, StudentPicker, useStudentData } from "./ParentRecords";
import { fmtDate } from "../components/ReportDocs";

const sizeOf = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

// ---------- Reading and activities ----------

export function ReadingTab({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0].id);
  const { data, setRecords, error, retry } = useStudentData(api, family, sid);
  if (!data) return <RecordsStatus api={api} error={error} retry={retry} sid={sid} />;
  return (
    <>
      <div className="row" style={{ marginBottom: 16 }}>
        {error && <RecordsStatus api={api} error={error} retry={retry} sid={sid} />}
      <StudentPicker family={family} sid={sid} setSid={setSid} />
      </div>
      <Books api={api} r={data.records} setRecords={setRecords} name={data.student.name} />
      <Activities api={api} r={data.records} setRecords={setRecords} name={data.student.name} />
    </>
  );
}

type Setter = (r: Records) => Promise<boolean>;

function Books({ api, r, setRecords, name }: { api: AppApi; r: Records; setRecords: Setter; name: string }) {
  const blank = { date: today(), title: "", author: "", subject: "English language arts", note: "" };
  const [f, setF] = useState(blank);
  const books = [...r.reading].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Reading log</h2>
        <span className="small muted">Printed in the portfolio and progress reports. Pennsylvania's portfolio requires one.</span>
      </div>
      <form
        className="form-grid four"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!f.title.trim()) return api.toast("Enter the book's title.");
          if (!await setRecords({ ...r, reading: [...r.reading, { id: uid("b"), ...f, title: f.title.trim(), author: f.author.trim(), note: f.note.trim() }] })) return;
          setF({ ...blank, subject: f.subject });
          api.toast("Book added");
        }}
      >
        <label className="field">
          <span>Title</span>
          <input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Author</span>
          <input className="input" value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} />
        </label>
        <label className="field">
          <span>Finished on</span>
          <input className="input" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        </label>
        <label className="field">
          <span>Subject</span>
          <select className="select" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>
            {SUBJECTS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="field span-2">
          <span>Note (optional)</span>
          <input className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. read aloud together; book report attached" />
        </label>
        <div>
          <button className="btn" type="submit">
            Add book
          </button>
        </div>
      </form>
      {books.length === 0 ? (
        <p className="muted small">No books logged for {name} yet.</p>
      ) : (
        <ul className="plain-list">
          {books.map((b) => (
            <li key={b.id} className="row" style={{ justifyContent: "space-between" }}>
              <span>
                {fmtDate(b.date)}: <cite>{b.title}</cite>
                {b.author && `, ${b.author}`}{" "}
                <span className="muted">
                  ({b.subject}
                  {b.minutes ? `; ${bookMinutes(b.minutes)} reading in Erudior` : ""}
                  {b.note ? `; ${b.note}` : ""})
                </span>
              </span>
              <button className="btn sm ghost" onClick={() => setRecords({ ...r, reading: r.reading.filter((x) => x.id !== b.id) })}>
                Delete<span className="sr-only">: {b.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Activities({ api, r, setRecords, name }: { api: AppApi; r: Records; setRecords: Setter; name: string }) {
  const blank = { kind: ACTIVITY_KINDS[1] as string, name: "", role: "", from: today(), to: "", hours: "", note: "" };
  const [f, setF] = useState(blank);
  const list = [...r.activities].sort((a, b) => b.from.localeCompare(a.from));
  const totals = new Map<string, number>();
  for (const a of r.activities) totals.set(a.kind, (totals.get(a.kind) ?? 0) + a.hours);
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Activities and service</h2>
        <span className="small muted">Listed on the transcript and progress reports. To count PE toward school hours, also add it under Attendance and hours.</span>
      </div>
      <form
        className="form-grid four"
        onSubmit={async (e) => {
          e.preventDefault();
          const hours = Number(f.hours || 0);
          if (!f.name.trim()) return api.toast("Name the activity.");
          if (!(hours >= 0 && hours < 10000)) return api.toast("Hours should be a number.");
          if (f.to && f.to < f.from) return api.toast("The end date is before the start date.");
          if (!await setRecords({
            ...r,
            activities: [...r.activities, { id: uid("v"), kind: f.kind, name: f.name.trim(), role: f.role.trim(), from: f.from, to: f.to, hours, note: f.note.trim() }],
          })) return;
          setF({ ...blank, kind: f.kind });
          api.toast("Activity added");
        }}
      >
        <label className="field">
          <span>Kind</span>
          <select className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>
            {ACTIVITY_KINDS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Activity</span>
          <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Youth orchestra" />
        </label>
        <label className="field">
          <span>Role (optional)</span>
          <input className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="e.g. Second violin" />
        </label>
        <label className="field">
          <span>Hours</span>
          <input className="input" type="number" min={0} step={0.5} value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} />
        </label>
        <label className="field">
          <span>From</span>
          <input className="input" type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} />
        </label>
        <label className="field">
          <span>To (blank if ongoing)</span>
          <input className="input" type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} />
        </label>
        <label className="field">
          <span>Note (optional)</span>
          <input className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        </label>
        <div>
          <button className="btn" type="submit">
            Add activity
          </button>
        </div>
      </form>
      {list.length === 0 ? (
        <p className="muted small">No activities logged for {name} yet.</p>
      ) : (
        <>
          <p className="small muted">{[...totals].map(([k, h]) => `${k}: ${h.toLocaleString()} h`).join(" · ")}</p>
          <ul className="plain-list">
            {list.map((a) => (
              <li key={a.id} className="row" style={{ justifyContent: "space-between" }}>
                <span>
                  <b>{a.name}</b>
                  {a.role && `, ${a.role}`} <span className="muted">({a.kind}; {fmtDate(a.from)}
                  {a.to ? ` to ${fmtDate(a.to)}` : ", ongoing"}; {a.hours} h{a.note ? `; ${a.note}` : ""})</span>
                </span>
                <button className="btn sm ghost" onClick={() => setRecords({ ...r, activities: r.activities.filter((x) => x.id !== a.id) })}>
                  Delete<span className="sr-only">: {a.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

// ---------- Documents ----------

export function DocumentsTab({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0].id);
  const { data, setRecords, error, retry } = useStudentData(api, family, sid);
  const scope = useRef(sid); scope.current = sid;
  const [kind, setKind] = useState<string>(DOC_KINDS[0]);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [everyone, setEveryone] = useState(false);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  if (!data) return <RecordsStatus api={api} error={error} retry={retry} sid={sid} />;
  const r = data.records;
  const docs = [...r.documents].sort((a, b) => b.date.localeCompare(a.date));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const files = [...(file.current?.files ?? [])];
    if (!files.length) return api.toast("Choose a file first.");
    setBusy(true);
    try {
      const refs = [];
      for (const f of files) refs.push(newDocRef({ ...(await storeFile(f)), kind, date, note: note.trim() }));
      if (!await setRecords({ ...r, documents: [...r.documents, ...refs] })) return;
      if (everyone)
        for (const st of family.students)
          if (st.id !== sid) {
            const additions = refs.map(x => ({ ...x, id: uid("d") }));
            await updateRecordsAtomic(st.id, other => ({ ...other, documents: [...other.documents, ...additions] }), { action: "Adult shared document attachment", guard: async () => { if (scope.current !== sid) throw Error("Learner changed. Reopen documents before continuing."); if (!api.authorizeAcademicRecords) throw Error("Academic records authorization is unavailable."); await api.authorizeAcademicRecords(st.id); if (scope.current !== sid) throw Error("Learner changed. Reopen documents before continuing."); } });
          }
      setNote("");
      if (file.current) file.current.value = "";
      api.toast(`Attached ${refs.length} file${refs.length === 1 ? "" : "s"}`);
    } catch (err) {
      api.toast((err as Error).message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const ref = r.documents.find((x) => x.id === id)!;
    if (!(await store.confirmAction(`Remove "${ref.name}" from ${data!.student.name}'s records?`, "Remove document"))) return;
    if (!await setRecords({ ...r, documents: r.documents.filter((x) => x.id !== id) })) return;
    // Delete the file once no student refers to it.
    let used = false;
    for (const st of family.students) if (st.id !== sid && (await loadRecords(st.id)).documents.some((x) => x.fileId === ref.fileId)) used = true;
    if (!used) await deleteFile(ref.fileId).catch(() => {});
    api.toast("Removed");
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 16 }}>
        {error && <RecordsStatus api={api} error={error} retry={retry} sid={sid} />}
      <StudentPicker family={family} sid={sid} setSid={setSid} />
      </div>
      <section className="panel">
        <div className="panel-head">
          <h2>Attach a document</h2>
          <span className="small muted">Notices you filed, letters you received, test reports, immunization or exemption forms.</span>
        </div>
        <form className="form-grid four" onSubmit={add}>
          <label className="field">
            <span>File (PDF, photo, document)</span>
            <input ref={file} className="input" type="file" multiple />
          </label>
          <label className="field">
            <span>Kind</span>
            <select className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
              {DOC_KINDS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Date on the document</span>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="field">
            <span>Note (optional)</span>
            <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. mailed certified, receipt #…" />
          </label>
          {family.students.length > 1 && (
            <label className="check span-2">
              <input type="checkbox" checked={everyone} onChange={(e) => setEveryone(e.target.checked)} />
              Attach to every student (e.g. a family notice of intent)
            </label>
          )}
          <div>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? "Attaching…" : "Attach"}
            </button>
          </div>
        </form>
        <p className="small muted">Files stay on this computer (up to 15 MB each) and are included in the encrypted backup.</p>
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>{data.student.name}'s documents</h2>
        </div>
        {docs.length === 0 ? (
          <p className="muted small">Nothing attached yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <caption className="sr-only">Documents on record for {data.student.name}</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Kind</th>
                  <th scope="col">File</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{fmtDate(d.date)}</td>
                    <td>
                      {d.kind}
                      {d.note && <div className="small muted">{d.note}</div>}
                    </td>
                    <td>
                      {d.name} <span className="small muted">({sizeOf(d.bytes)})</span>
                    </td>
                    <td>
                      <div className="row">
                        <button
                          className="btn sm"
                          onClick={() =>
                            saveCopy(d).then(
                              (ok) => ok && api.toast("Saved a copy"),
                              (e) => api.toast(String(e)),
                            )
                          }
                        >
                          Save a copy<span className="sr-only">: {d.name}</span>
                        </button>
                        <button className="btn sm ghost" onClick={() => remove(d.id)}>
                          Remove<span className="sr-only">: {d.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
