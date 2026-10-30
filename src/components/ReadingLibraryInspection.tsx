import type { ReaderText } from "../lib/readerContent";

/** Review authored bytes literally: no HTML, external fetching, or source-code execution. */
export default function ReadingLibraryInspection({ texts, questions }: { texts: ReaderText[]; questions: Array<{ id: string; stem: string }> }) {
  return <section aria-label="Reading library inspection"><h3>Reading library</h3>
    {texts.map(text => <article key={text.id}>
      <h4>{text.title}</h4>
      <p>Text ID: {text.id} · Author: {text.author ?? "Unspecified"} · Date: {text.date ?? "Unspecified"}</p>
      <p>Kind: {text.kind ?? "prose"} · Language: {text.lang ?? "Course default"} · Subject: {text.subject ?? "Course default"} · Line numbering: {text.lineNumbers ?? 5}</p>
      <h5>Source and copyright attribution</h5><p style={{ whiteSpace: "pre-wrap" }}>{text.source ?? "Not supplied"}</p>
      <h5>Introduction</h5><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{text.about ?? ""}</pre>
      <h5>Text glossary</h5><dl>{text.glossary?.map((entry, index) => <div key={index}><dt>{entry.term}</dt><dd>{entry.definition} · Aliases: {entry.aliases?.join(", ") ?? "None"} · Topic: {entry.topic ?? "None"}</dd></div>)}</dl>
      {text.sections.map(section => <section key={section.id}><h5>{section.title} ({section.id})</h5>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{section.body}</pre>
        <h6>Reading questions (first bank)</h6><ul>{section.questions?.map(id => <li key={id}>{id}: {questions.find(q => q.id === id)?.stem ?? "Missing question"}</li>)}</ul>
      </section>)}
    </article>)}
  </section>;
}
