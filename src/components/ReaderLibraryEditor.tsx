import { useState } from "react";
import type { ReaderText, ReaderSection } from "../lib/types";
import { validateReaderTexts } from "../lib/readerContent";
import { uid } from "../lib/util";

export type ReaderLibraryEditorProps = {
  texts: ReaderText[];
  /** Only questions in the course's first bank, not an aggregated bank list. */
  questions: Array<{ id: string; stem: string }>;
  onChange: (texts: ReaderText[]) => void;
  protectedTextIds?: readonly string[];
  protectedSectionIds?: Record<string, readonly string[]>;
};
function Field({ label, value, change, multiline = false }: { label: string; value?: string; change: (value: string) => void; multiline?: boolean }) {
  return <label className="field"><span>{label}</span>{multiline ? <textarea className="textarea" rows={label === "Section body" ? 16 : 3} value={value ?? ""} onChange={e => change(e.target.value)} /> : <input className="input" value={value ?? ""} onChange={e => change(e.target.value)} />}</label>;
}
export default function ReaderLibraryEditor({ texts, questions, onChange, protectedTextIds = [], protectedSectionIds = {} }: ReaderLibraryEditorProps) {
  const [textId, setTextId] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [glossaryIndex, setGlossaryIndex] = useState(0);
  const [questionSearch, setQuestionSearch] = useState("");
  const [confirmRemoval, setConfirmRemoval] = useState<"text" | "section" | null>(null);
  const text = texts.find(item => item.id === textId);
  const section = text?.sections.find(item => item.id === sectionId);
  const replace = (next: ReaderText) => onChange(texts.map(item => item.id === next.id ? next : item));
  const replaceSection = (next: ReaderSection) => { if (text) replace({ ...text, sections: text.sections.map(item => item.id === next.id ? next : item) }); };
  function optional(key: "author" | "date" | "lang" | "subject" | "about" | "source", value: string) {
    if (!text) return; const next = { ...text }; if (value === "") delete next[key]; else next[key] = value; replace(next);
  }
  function selectText(id: string) { setTextId(id); setSectionId(null); setGlossaryIndex(0); setQuestionSearch(""); setConfirmRemoval(null); }
  function addText() {
    const item: ReaderText = { id: `text-${uid()}`, title: "New reading text", kind: "prose", sections: [] };
    onChange([...texts, item]); selectText(item.id);
  }
  function addSection() {
    if (!text) return;
    const item = { id: `part-${uid()}`, title: "New section", body: "" };
    replace({ ...text, sections: [...text.sections, item] }); setSectionId(item.id); setConfirmRemoval(null);
  }
  function moveSection(direction: -1 | 1) {
    if (!text || !section) return; const index = text.sections.findIndex(item => item.id === section.id), target = index + direction;
    if (target < 0 || target >= text.sections.length) return;
    const sections = [...text.sections]; [sections[index], sections[target]] = [sections[target], sections[index]]; replace({ ...text, sections });
  }
  const sectionProtected = (item: ReaderSection) => !!text && (protectedSectionIds[text.id] ?? []).includes(item.id);
  const textRemovalReason = text && (protectedTextIds.includes(text.id) || text.sections.some(sectionProtected)) ? "This text has reading progress or another reference. Keep its stable identity." : text?.sections.some(item => item.questions?.length) ? "Unlink reading questions from all sections before deleting this text." : "";
  const sectionRemovalReason = section && sectionProtected(section) ? "This section has reading progress or another reference. Keep its stable identity." : section?.questions?.length ? "Unlink reading questions before deleting this section." : "";
  function remove() {
    if (!text) return;
    if (confirmRemoval === "text" && !textRemovalReason) { onChange(texts.filter(item => item.id !== text.id)); selectText(""); }
    if (confirmRemoval === "section" && section && !sectionRemovalReason) { replace({ ...text, sections: text.sections.filter(item => item.id !== section.id) }); setSectionId(null); }
    setConfirmRemoval(null);
  }
  const problems = validateReaderTexts(texts, { questionIds: questions.map(item => item.id) });
  const offeredQuestions = questions.filter(item => !section?.questions?.includes(item.id) && `${item.id} ${item.stem}`.toLowerCase().includes(questionSearch.toLowerCase())).slice(0, 40);
  return <section className="stack" aria-label="Embedded reading library editor">
    <p>Texts stay inside this course. Add only material you may distribute, and record its source and rights. Text and section IDs stay fixed while titles, content and order change.</p>
    <button type="button" onClick={addText}>Add reading text</button>
    <nav aria-label="Reading texts">{texts.map(item => <button type="button" key={item.id} aria-current={item.id === textId ? "page" : undefined} onClick={() => selectText(item.id)}>Edit text: {item.title || item.id}</button>)}</nav>
    {text && <>
      <fieldset><legend>Text details</legend><p className="small">Stable text ID: {text.id}</p>
        <Field label="Text title" value={text.title} change={title => replace({ ...text, title })} />
        <label className="field"><span>Text kind</span><select value={text.kind ?? "prose"} onChange={e => replace({ ...text, kind: e.target.value as ReaderText["kind"] })}>{["prose", "poem", "play", "document"].map(kind => <option key={kind} value={kind}>{kind}</option>)}</select></label>
        <Field label="Text author" value={text.author} change={value => optional("author", value)} />
        <Field label="Publication date or period" value={text.date} change={value => optional("date", value)} />
        <Field label="Text language" value={text.lang} change={value => optional("lang", value)} />
        <Field label="Reading subject" value={text.subject} change={value => optional("subject", value)} />
        <Field label="About this text" value={text.about} multiline change={value => optional("about", value)} />
        <Field label="Source, edition and rights attribution" value={text.source} multiline change={value => optional("source", value)} />
        <label className="field"><span>Line number interval (0 hides, blank uses default)</span><input type="number" min={0} step={1} value={text.lineNumbers ?? ""} onChange={e => { const next = { ...text }; if (e.target.value === "") delete next.lineNumbers; else next.lineNumbers = Number(e.target.value); replace(next); }} /></label>
      </fieldset>
      <fieldset><legend>Text glossary</legend>{!!text.glossary?.length && <label className="field"><span>Glossary entry to edit</span><select value={glossaryIndex} onChange={e => setGlossaryIndex(Number(e.target.value))}>{text.glossary.map((entry, index) => <option key={index} value={index}>{entry.term || `Term ${index + 1}`}</option>)}</select></label>}{(text.glossary ?? []).map((entry, index) => {
        if (index !== glossaryIndex) return null;
        const update = (patch: Partial<typeof entry>) => replace({ ...text, glossary: text.glossary!.map((item, i) => i === index ? { ...item, ...patch } : item) });
        return <fieldset key={index}><legend>Glossary term {index + 1}</legend><Field label={`Glossary ${index + 1} term`} value={entry.term} change={term => update({ term })} /><Field label={`Glossary ${index + 1} definition`} value={entry.definition} multiline change={definition => update({ definition })} /><Field label={`Glossary ${index + 1} topic`} value={entry.topic} change={topic => update({ topic })} /><Field label={`Glossary ${index + 1} aliases (one per line)`} value={entry.aliases?.join("\n")} multiline change={value => update({ aliases: value ? value.split("\n") : [] })} /><button type="button" onClick={() => { replace({ ...text, glossary: text.glossary!.filter((_, i) => i !== index) }); setGlossaryIndex(Math.max(0, index - 1)); }}>Remove glossary term {index + 1}</button></fieldset>;
      })}<button type="button" onClick={() => { setGlossaryIndex(text.glossary?.length ?? 0); replace({ ...text, glossary: [...(text.glossary ?? []), { term: "", definition: "", aliases: [] }] }); }}>Add text glossary term</button></fieldset>
      <fieldset><legend>Sections</legend><button type="button" onClick={addSection}>Add section</button><nav aria-label="Text sections">{text.sections.map(item => <button type="button" key={item.id} aria-current={item.id === sectionId ? "page" : undefined} onClick={() => { setSectionId(item.id); setQuestionSearch(""); setConfirmRemoval(null); }}>Edit section: {item.title || item.id}</button>)}</nav>
        {section && <><p className="small">Stable section ID: {section.id}</p><Field label="Section title" value={section.title} change={title => replaceSection({ ...section, title })} /><Field label="Section body" value={section.body} multiline change={body => replaceSection({ ...section, body })} />
          <p className="small">Prose/document bodies use Markdown; poems/plays preserve line breaks. Footnotes use [^note1] and a matching [^note1]: explanation line. Edit both in the body.</p>
          <button type="button" onClick={() => { let index = 1; while (section.body.includes(`[^note${index}]`)) index++; const reference = `[^note${index}]`; replaceSection({ ...section, body: section.body + `${section.body.endsWith("\n") ? "" : "\n"}${reference}\n\n${reference}: Footnote explanation.\n` }); }}>Add footnote</button>
          <div className="row"><button type="button" disabled={text.sections[0]?.id === section.id} onClick={() => moveSection(-1)}>Move section earlier</button><button type="button" disabled={text.sections[text.sections.length - 1]?.id === section.id} onClick={() => moveSection(1)}>Move section later</button></div>
          <fieldset><legend>First-bank reading questions</legend>{(section.questions ?? []).map(id => <div key={id}>{questions.find(item => item.id === id)?.stem ?? `Missing question ${id}`} <button type="button" onClick={() => replaceSection({ ...section, questions: section.questions!.filter(item => item !== id) })}>Unlink question {id}</button></div>)}
            <Field label="Find first-bank questions" value={questionSearch} change={setQuestionSearch} />
            {!questions.length && <p>No questions in the first bank. Add questions in its bank editor before linking them.</p>}
            {offeredQuestions.map(item => <button type="button" key={item.id} onClick={() => replaceSection({ ...section, questions: [...(section.questions ?? []), item.id] })}>Link question {item.id}: {item.stem.slice(0, 140)}</button>)}
            {questions.length > 40 && <p>Showing up to 40 matches. Search by question ID or wording.</p>}
          </fieldset>
          <button type="button" disabled={!!sectionRemovalReason} title={sectionRemovalReason} onClick={() => setConfirmRemoval("section")}>Remove section</button>{sectionRemovalReason && <p>{sectionRemovalReason}</p>}
        </>}
      </fieldset>
      <button type="button" disabled={!!textRemovalReason} title={textRemovalReason} onClick={() => setConfirmRemoval("text")}>Remove reading text</button>{textRemovalReason && <p>{textRemovalReason}</p>}
      {confirmRemoval && <div role="alert"><p>Delete this {confirmRemoval === "text" ? "text and every section" : "section"} from the course draft? This does not erase existing learner records.</p><button type="button" onClick={remove}>Confirm reading removal</button><button type="button" onClick={() => setConfirmRemoval(null)}>Keep reading content</button></div>}
    </>}
    {problems.length > 0 && <div role="status"><strong>Resolve before publication:</strong><ul>{problems.slice(0, 40).map((problem, i) => <li key={i}>{problem}</li>)}</ul></div>}
  </section>;
}
