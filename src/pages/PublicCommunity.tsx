import { useEffect, useMemo, useRef, useState } from 'react';
import { API, REVIEW_HELP, REVIEW_LABEL, api as community, type CommunityEntry } from '../lib/community';
import { appUrl } from '../lib/site';
import { publicCommunityId, validatePublicCommunityCatalog, validatePublicCommunityDetail, type PublicCommunityDetail } from '../lib/publicCommunity';

type Props = { id?: string; onNavigate?: (id?: string) => void; onStart?: (id: string) => Promise<void>; appContext?: boolean };
type Load = { key: string; list?: CommunityEntry[]; detail?: PublicCommunityDetail; error?: string };
/** Public, read-only discovery. No identity calls, installs or account gates on the website. */
export default function PublicCommunity({ id, onNavigate, onStart, appContext = false }: Props) {
  const key = id === undefined ? 'catalog' : `course:${id}`;
  const [state, setState] = useState<Load>({ key: '' });
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [shown, setShown] = useState(12);
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState('');
  const openingRef = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    let active = true;
    generation.current++;
    openingRef.current = false; setOpening(false); setOpenError('');
    setState({ key });
    const request = async () => {
      try {
        if (id !== undefined) {
          if (!publicCommunityId(id)) throw Error('This community course link is invalid.');
          const detail = validatePublicCommunityDetail(await community.course(id), id, API || undefined);
          if (active) setState({ key, detail });
        } else {
          const list = validatePublicCommunityCatalog(await community.catalog());
          if (active) setState({ key, list });
        }
      } catch (error) {
        if (active) setState({ key, error: error instanceof Error ? error.message : 'Community courses could not be loaded.' });
      }
    };
    void request();
    return () => { active = false; generation.current++; };
  }, [id, key, retry]);
  const current = state.key === key ? state : { key };
  const list = current.list ?? [];
  const options = useMemo(() => ({ subjects: [...new Set(list.map(c => c.subject))].sort(), levels: [...new Set(list.map(c => c.level))].sort() }), [current.list]);
  const filtered = list.filter(c => (!subject || c.subject === subject) && (!level || c.level === level) && (!reviewed || c.review === 'reviewed') && query.toLowerCase().split(/\s+/).filter(Boolean).every(word => `${c.title} ${c.description} ${c.author} ${c.subject} ${c.level}`.toLowerCase().includes(word)));
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, next?: string) => {
    if (!onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); onNavigate(next);
  };
  const badge = (c: CommunityEntry) => <span className={`pill ${c.review === 'reviewed' ? 'pass' : 'flagpill'}`} title={REVIEW_HELP[c.review]}>{REVIEW_LABEL[c.review]}</span>;
  async function start() {
    if (!id || !onStart || openingRef.current) return;
    const token = generation.current;
    openingRef.current = true; setOpening(true); setOpenError('');
    try { await onStart(id); }
    catch (error) { if (token === generation.current) setOpenError(error instanceof Error ? error.message : 'The course could not be opened. Please retry.'); }
    finally { if (token === generation.current) { openingRef.current = false; setOpening(false); } }
  }
  return <div className="page public-community">
    {id !== undefined && <a className="back" href="/community" onClick={event => navigate(event)}>← Community courses</a>}
    <div className="page-head"><h1>{current.detail?.entry.title ?? (id === undefined ? 'Community courses' : 'Community course')}</h1></div>
    <p className="muted">Free courses made by the community. Browse and learn without an account. Community creation and uploads require a signed-in adult aged 18 or older in the app.</p>
    <p className="small muted">A review label applies only to the published version shown. It is not accreditation or approval for a particular learner; parents can inspect the content for suitability.</p>
    {current.error ? <div data-prerender-skip className="notice" role="alert"><p>{current.error}</p><button className="btn" onClick={() => setRetry(value => value + 1)}>Retry loading courses</button></div> : !current.list && !current.detail ? <p role="status">Loading community courses…</p> : null}
    {current.detail && <section data-prerender-skip aria-label="Community course details" className="panel" style={{ overflowWrap: 'anywhere' }}>
      <div className="row">{badge(current.detail.entry)}<span className="pill neutral">{current.detail.entry.subject}</span><span className="pill neutral">{current.detail.entry.level}</span><span className="pill neutral">{current.detail.entry.type}</span></div>
      <p>By {current.detail.entry.author} · Version {current.detail.entry.version}</p>
      <p>{current.detail.entry.description}</p>
      <p className="small muted">{current.detail.entry.counts.lessons} lessons · {current.detail.entry.counts.questions} questions · {current.detail.entry.counts.cards} cards</p>
      <h2>Lesson outline</h2>
      {current.detail.lessons.length ? <ol>{current.detail.lessons.map(lesson => <li key={lesson.id}>{lesson.title}</li>)}</ol> : <p>No lessons in this course. Other practice resources may be included.</p>}
      {appContext ? onStart ? <button className="btn primary" disabled={opening} onClick={() => void start()}>{opening ? 'Opening course…' : 'Start or open course'}</button> : <p className="notice">Preview only in this profile. Ask your supervising adult about adding this course to your learning plan.</p> : <a className="btn primary" href={appUrl(`/community/${current.detail.entry.id}`)}>Learn in web app</a>}
      {openError && <p className="notice" role="alert">{openError}</p>}
      {!appContext && <p className="small muted">Learning opens in the free web app. No sign-in is needed.</p>}
    </section>}
    {current.list && <section data-prerender-skip aria-label="Community course catalog">
      <div className="catalog-filters">
        <label className="field"><span>Search community courses</span><input className="input" type="search" value={query} onChange={e => { setQuery(e.target.value); setShown(12); }} /></label>
        <label className="field"><span>Subject</span><select className="select" value={subject} onChange={e => { setSubject(e.target.value); setShown(12); }}><option value="">All subjects</option>{options.subjects.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field"><span>Level</span><select className="select" value={level} onChange={e => { setLevel(e.target.value); setShown(12); }}><option value="">All levels</option>{options.levels.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="check"><input type="checkbox" checked={reviewed} onChange={e => { setReviewed(e.target.checked); setShown(12); }} />Reviewed only</label>
      </div>
      <p className="small muted" role="status">{filtered.length} of {list.length} community courses</p>
      {!list.length ? <p>No community courses have been published yet. Please check back later.</p> : !filtered.length ? <div><p>No courses match these filters.</p><button className="btn" onClick={() => { setQuery(''); setSubject(''); setLevel(''); setReviewed(false); setShown(12); }}>Clear filters</button></div> : <div className="catalog-grid">{filtered.slice(0, shown).map(c => <article className="catalog-card" key={c.id} style={{ overflowWrap: 'anywhere' }}>
        <div className="catalog-tags">{badge(c)}<span className="pill neutral">{c.subject}</span><span className="pill neutral">{c.level}</span></div>
        <h2 style={{ fontSize: '1.2rem' }}><a href={`/community/${c.id}`} onClick={e => navigate(e, c.id)}>{c.title}</a></h2>
        <p className="small muted">By {c.author} · Version {c.version}</p><p>{c.description}</p>
        <p className="small muted">{c.counts.lessons} lessons · {c.counts.questions} questions · {c.counts.cards} cards</p>
        <a className="btn sm" href={`/community/${c.id}`} onClick={e => navigate(e, c.id)}>View course<span className="sr-only">: {c.title}</span></a>
      </article>)}</div>}
      {filtered.length > shown && <button className="btn" onClick={() => setShown(count => count + 12)}>Show more courses</button>}
    </section>}
  </div>;
}
