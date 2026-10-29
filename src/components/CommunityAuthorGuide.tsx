import { useId, useState } from 'react';
import { AUTHOR_GUIDE_SECTIONS, searchAuthorGuide } from '../lib/communityAuthorGuide';

/** Read-only help: stays mounted alongside the editor and never changes its navigation or draft. */
export default function CommunityAuthorGuide() {
  const id = useId();
  const [query,setQuery] = useState('');
  const [selected,setSelected] = useState(AUTHOR_GUIDE_SECTIONS[0].id);
  const matches = searchAuthorGuide(query);
  const section = matches.find(s=>s.id===selected) ?? matches[0];
  return <details className="author-guide">
    <summary>Authoring guide</summary>
    <section aria-label="Community authoring guide">
      <p className="muted">Read alongside your draft. Opening, searching and closing help does not change or publish your work.</p>
      <label className="field" htmlFor={`${id}-search`}>Search authoring guide
        <input id={`${id}-search`} type="search" className="input" maxLength={200} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try tables, alt text, save or publish" />
      </label>
      <p className="small muted" role="status">{matches.length} of {AUTHOR_GUIDE_SECTIONS.length} sections</p>
      {query && <button type="button" className="btn sm" onClick={()=>setQuery('')}>Clear guide search</button>}
      <div className="author-guide-layout">
        <nav aria-label="Authoring guide sections">{matches.map(s=><button type="button" className="btn" key={s.id} aria-current={section?.id===s.id?'true':undefined} aria-controls={`${id}-section`} onClick={()=>setSelected(s.id)}>{s.title}</button>)}</nav>
        <article id={`${id}-section`} aria-labelledby={section?`${id}-heading`:undefined}>
          {section ? <><h3 id={`${id}-heading`}>{section.title}</h3><p>{section.summary}</p><ol>{section.steps.map((step,i)=><li key={i}>{step}</li>)}</ol>
            {section.example && <div><p><strong>{section.example.label}</strong></p><pre tabIndex={0} aria-label={section.example.label}><code>{section.example.text}</code></pre></div>}
            {section.caution && <p className="notice">{section.caution}</p>}
          </> : <p>No guide sections match. Try a shorter search or clear it to see all sections.</p>}
        </article>
      </div>
      <p className="small"><a href="https://github.com/Aziliz/erudior/blob/main/docs/COMMUNITY_AUTHOR_GUIDE.md" target="_blank" rel="noreferrer">Repository copy of this guide</a>{' · '}<a href="https://github.com/Aziliz/erudior/blob/main/docs/COURSE_FORMAT.md" target="_blank" rel="noreferrer">Advanced course format reference</a></p>
    </section>
  </details>;
}
