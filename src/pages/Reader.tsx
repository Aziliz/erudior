// The built-in reader: one text from a course's library, a section at a time. It follows the
// Display settings (theme, reading width, text size), remembers the place (section and the
// paragraph or line at the top of the screen), counts reading time only while the window is
// visible and the student is active (lib/timer.ts ActiveClock), offers read-aloud with the
// device's voice, footnotes and word pop-ups, and reading questions after a section.
// Finishing a text adds it to a homeschool student's reading log.

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { AppApi } from "../App";
import type { Course, ReaderText } from "../lib/types";
import Markdown, { renderMarkdown } from "../components/Markdown";
import {
  footnotes,
  isVerse,
  readingKey,
  readingSubject,
  readingTime,
  renderVerse,
  verseLines,
} from "../lib/reader";
import { ActiveClock } from "../lib/timer";
import { persistReaderBook } from "../lib/readerRecords";
import { canSpeak, onVoices, speakAsync, stopSpeaking } from "../lib/speech";
import { lessonQuizQuestions, startReadingQuestions, serializeRun } from "../lib/session";
import { mainBank } from "./CourseHome";
import { fmtDate } from "../components/ReportDocs";
import { activeStudent, saveSessionState } from "../lib/storage";
import { readerPersistence, readerRevision, type ReaderPersistence } from "../lib/readerPersistence";

/** Reading pauses after this long without scrolling, keys or clicks (a long page takes a while). */
const READ_IDLE_MS = 4 * 60_000;
const TICK_MS = 5_000;
const SAVE_MS = 30_000;

const KIND_LABEL: Record<NonNullable<ReaderText["kind"]>, string> = { prose: "Book", poem: "Poem", play: "Play", document: "Document" };

/** Text of a block for read-aloud, without line numbers and note markers. */
function blockText(el: Element): string {
  const c = el.cloneNode(true) as Element;
  c.querySelectorAll(".ln, sup.fn, .katex-mathml").forEach((x) => x.remove());
  return (c.textContent ?? "").replace(/\s+/g, " ").trim();
}

export default function Reader(props: { api: AppApi; course: Course; text: ReaderText }) {
  const bank=mainBank(props.course);
  const identity=JSON.stringify([props.api.student?.id??null,props.course.id,!!props.course.community,props.text,bank?.questions]);
  if(!props.text.sections.length)return <p role="alert">This text has no readable sections.</p>;
  return <ReaderLoader key={identity} {...props}/>;
}
function ReaderLoader({api,course,text}:{api:AppApi;course:Course;text:ReaderText}) {
 const [controller,setController]=useState<ReaderPersistence|null>(null),[error,setError]=useState("");
 useEffect(()=>{let live=true;const bank=mainBank(course);readerRevision(text,ids=>lessonQuizQuestions(bank,ids)).then(version=>{if(live)setController(readerPersistence(api.student?.id??null,course.id,text,version,api.progress));}).catch(e=>{if(live)setError((e as Error).message);});return()=>{live=false;};},[]);
 if(error)return <p role="alert">Reader could not open safely: {error}</p>;
 if(!controller)return <p role="status">Opening offline text…</p>;
 return <ReaderSession api={api} course={course} text={text} controller={controller}/>;
}
function ReaderSession({ api, course, text, controller }: { api: AppApi; course: Course; text: ReaderText; controller:ReaderPersistence }) {
  const key = readingKey(course.id, text.id);
  useSyncExternalStore(controller.subscribe,controller.version,controller.version);
  const apiRef=useRef(api);apiRef.current=api;
  const alive=useRef(true),studentId=api.student?.id??null;
  const allowed=useCallback(()=>alive.current&&activeStudent()===studentId,[studentId]);
  const [actionError,setActionError]=useState(""),[actionBusy,setActionBusy]=useState(false),[historyOpen,setHistoryOpen]=useState(false);
  const acting=useRef(false);
  const start = controller.confirmed;
  const [sectionId, setSectionId] = useState(text.sections.some((s) => s.id === start.section) ? start.section : text.sections[0].id);
  const idx = Math.max(0, text.sections.findIndex((s) => s.id === sectionId));
  const section = text.sections[idx];
  const state = controller.confirmed;
  const verse = isVerse(text);
  const voice = text.lang ?? course.language?.tts ?? course.language?.code ?? "en-US";
  const langCode = (text.lang ?? course.language?.code)?.split(/[-_]/)[0];
  const glossary = useMemo(() => [...(text.glossary ?? []), ...course.glossary], [text, course]);

  // Footnotes come out of the text first; poems and plays are laid out line by line.
  const { source, notes } = useMemo(() => {
    const fn = footnotes(section.body);
    if (!verse) return { source: fn.text, notes: fn.notes };
    const inline = (md: string) => {
      const html = renderMarkdown(md);
      const m = /^\s*<p>([\s\S]*)<\/p>\s*$/.exec(html);
      return m ? m[1] : html;
    };
    return { source: renderVerse(verseLines(fn.text, text.kind), text.lineNumbers ?? 5, inline), notes: fn.notes };
  }, [section, verse, text]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const noteTrigger = useRef<HTMLElement|null>(null);
  const blocks = useCallback((): HTMLElement[] => {
    const el = bodyRef.current?.querySelector(".reader-text");
    if (!el) return [];
    return verse ? [...el.querySelectorAll<HTMLElement>("[data-b]")] : ([...el.children] as HTMLElement[]);
  }, [verse]);
  const scroller = () => (bodyRef.current?.closest(".main") as HTMLElement | null) ?? (document.scrollingElement as HTMLElement | null);

  // ---- Reading time ------------------------------------------------------------------------
  const clock = useRef<ActiveClock | null>(null);
  const [counting, setCounting] = useState(true);
  const flush = useCallback(async () => {
    const seconds=clock.current?.take()??0;
    controller.addTime(seconds);
    return controller.persist(fn=>apiRef.current.updateProgress(fn),allowed);
  }, [controller,allowed]);
  useEffect(() => {
    const c = new ActiveClock(Date.now(), READ_IDLE_MS);
    clock.current = c;
    const visible = () => document.visibilityState === "visible";
    const onInput = () => { if(visible()) c.input(Date.now()); };
    const events = ["keydown", "pointerdown", "pointermove", "wheel", "touchstart", "scroll"] as const;
    for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true });
    const tick = window.setInterval(() => {
      const now = Date.now();
      c.tick(now, visible());
      setCounting(c.counting(now, visible()));
    }, TICK_MS);
    const saver = window.setInterval(flush, SAVE_MS);
    let wasVisible=visible();
    const onHide = () => {
      c.tick(Date.now(), wasVisible);
      wasVisible=visible();
      if (!wasVisible) void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      c.tick(Date.now(), visible());
      for (const e of events) window.removeEventListener(e, onInput, { capture: true });
      document.removeEventListener("visibilitychange", onHide);
      window.clearInterval(tick);
      window.clearInterval(saver);
      void flush();
      clock.current = null;
    };
  }, [flush]);

  // ---- Place -------------------------------------------------------------------------------
  const placeTimer = useRef(0);
  useEffect(() => {
    const sc = scroller();
    if (!sc) return;
    const onScroll = () => {
      window.clearTimeout(placeTimer.current);
      const top = (sc === document.scrollingElement ? 0 : sc.getBoundingClientRect().top) + (document.querySelector(".reader-bar")?.getBoundingClientRect().height ?? 0);
      const list = blocks();
      const at = Math.max(0, list.findIndex((b) => b.getBoundingClientRect().bottom > top + 8));
      controller.setPlace(section.id,at);
      placeTimer.current=window.setTimeout(()=>{void flush();},1200);
    };
    sc.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      sc.removeEventListener("scroll", onScroll);
      window.clearTimeout(placeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id, blocks]);

  // Open at the saved place (first visit to this section: at its top), and note the section.
  const firstOpen = useRef(true);
  useEffect(() => {
    const at = firstOpen.current && state.section === section.id ? Math.min(Math.max(0,Math.floor(state.at)||0),Math.max(0,blocks().length-1)) : 0;
    const el = blocks()[at];
    const sc = scroller();
    const frame=requestAnimationFrame(() => {
      if(!allowed())return;
      if (at > 0 && el) {
        el.scrollIntoView({ block: "start" });
        // Leave room for the sticky bar.
        if (sc) sc.scrollTop -= (document.querySelector(".reader-bar")?.getBoundingClientRect().height ?? 0) + 8;
      } else if (!firstOpen.current && sc) sc.scrollTop = 0;
      if (!firstOpen.current) headRef.current?.focus();
      firstOpen.current = false;
    });
    controller.setPlace(section.id,at);
    void flush();
    return ()=>cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id]);

  // ---- Read aloud --------------------------------------------------------------------------
  const [, tick] = useState(0);
  useEffect(() => onVoices(() => tick((n) => n + 1)), []);
  const [aloud, setAloud] = useState(false);
  const aloudRun = useRef(0);
  const stopAloud = useCallback(() => {
    aloudRun.current++;
    stopSpeaking();
    setAloud(false);
    bodyRef.current?.querySelectorAll(".is-reading").forEach((x) => x.classList.remove("is-reading"));
  }, []);
  useEffect(() => stopAloud, [section.id, stopAloud]);
  async function readAloud() {
    if (aloud) return stopAloud();
    const run = ++aloudRun.current;
    setAloud(true);
    const list = blocks();
    const sc = scroller();
    const bar = document.querySelector(".reader-bar")?.getBoundingClientRect().height ?? 0;
    const top = (sc && sc !== document.scrollingElement ? sc.getBoundingClientRect().top : 0) + bar;
    // Start at the first block on screen.
    const from = Math.max(0, list.findIndex((b) => b.getBoundingClientRect().bottom > top + 8));
    const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    for (const b of list.slice(from)) {
      if (run !== aloudRun.current) return;
      const t = blockText(b);
      if (!t) continue;
      b.classList.add("is-reading");
      b.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : "auto" });
      // Listening counts as reading: keep the clock from going idle.
      clock.current?.input(Date.now());
      await speakAsync(t, voice, 0.95);
      b.classList.remove("is-reading");
    }
    if (run === aloudRun.current) setAloud(false);
  }

  // ---- Sections, finishing, questions ------------------------------------------------------
  async function syncReadingLog() {
    if(!controller.confirmed.finished || !api.family || !studentId || course.community)return true;
    try {
      // Explicit captured learner ID; finish a confirmed learner's projection even if they switch during its write.
      if(!allowed())return false;
      const total=controller.confirmed.seconds;
      await persistReaderBook(studentId,{date:controller.confirmed.finished!,title:text.title,author:text.author??"",subject:readingSubject(text,course.language?.code),note:`Read in Erudior (${course.title})`,minutes:Math.round(total/60),textKey:key},!!course.community);
      controller.logSaved=true;controller.logError="";controller.notify();return true;
    } catch(e){controller.logError=`Reading is saved, but its reading-log entry is not confirmed: ${(e as Error).message}`;controller.notify();return false;}
  }
  async function action(run:()=>Promise<void>) {
    if(acting.current||!allowed())return;
    acting.current=true;setActionBusy(true);setActionError("");
    try{await run();}catch(e){if(alive.current)setActionError((e as Error).message);}finally{acting.current=false;if(alive.current)setActionBusy(false);}
  }
  const go = (i:number) => action(async()=>{if(i<0||i>=text.sections.length)return;if(await flush()&&allowed())setSectionId(text.sections[i].id);});
  const readOn = state.read[section.id];
  const last = idx === text.sections.length - 1;
  const bank = mainBank(course);
  const questions = lessonQuizQuestions(bank, section.questions);
  const total=state.seconds;
  function finishSection() {void action(async()=>{
    controller.finish(section.id);
    if(!await flush())return;
    await syncReadingLog();
    if(!allowed())return;
    if(controller.confirmed.finished)api.toast(`You finished ${text.title}!`);
    if(!last)setSectionId(text.sections[idx+1].id);
  });}
  function askQuestions() {void action(async()=>{
    if(!bank||!await flush()||!allowed())return;
    if(!controller.questions[section.id]) {
      const session=startReadingQuestions(bank,{courseId:course.id,textId:text.id,sectionId:section.id},section.questions!);
      const flags=Object.fromEntries(session.items.filter(item=>apiRef.current.progress.qmeta?.[session.bankId+"/"+item.q.id]?.flag).map(item=>[item.q.id,true]));
      controller.questions[section.id]={session,initial:{index:0,answers:{},flags,checked:{},blockIdx:0,blockUsed:session.blocks?.map(()=>0)??[0]}};
    }
    const {session,initial}=controller.questions[section.id];
    await saveSessionState(serializeRun(session,initial));
    if(!allowed())return;
    delete controller.questions[section.id];api.go({name:"run",session,initial});
  });}
  // Reconcile a failed reading-log projection after remount/reload, never community records.
  useEffect(()=>{if(state.finished&&!controller.pending)void syncReadingLog();},[state.finished,Math.floor(total/60),controller.pending]);
  // Registered after time/position cleanups: their final synchronous write can start,
  // but any later asynchronous continuation cannot write into a different reader/profile.
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);

  const kind = KIND_LABEL[text.kind ?? "prose"];
  const done = text.sections.filter((s) => state.read[s.id]).length;

  return (
    <div className="page reader" onClickCapture={event=>{const trigger=(event.target as HTMLElement).closest<HTMLElement>(".fn-ref, .gloss");if(trigger)noteTrigger.current=trigger;}} onKeyDown={event=>{if(event.key==="Escape"){const close=bodyRef.current?.querySelector<HTMLButtonElement>('[role="dialog"] button[aria-label="Close"]');if(close){close.click();noteTrigger.current?.focus();event.preventDefault();}}}}>
      <button className="back" onClick={()=>void action(async()=>{if(await flush()&&allowed())api.go({name:"course",courseId:course.id,tab:"reading"});})}>
        ← {course.title}: Reading
      </button>
      {(controller.error||controller.logError||actionError)&&<div role="alert" className="notice">{controller.error||controller.logError||actionError}<button className="btn" disabled={actionBusy||controller.busy} onClick={()=>controller.questions[section.id] ? askQuestions() : void action(async()=>{if(await flush())await syncReadingLog();})}>{controller.questions[section.id] ? "Retry question launch" : "Retry saving reading"}</button></div>}
      {controller.pending&&<p role="status">Reading changes are not yet confirmed saved.</p>}
      {!!Object.keys(state.priorRead??{}).length&&<details onToggle={event=>setHistoryOpen(event.currentTarget.open)}><summary>Previous-version reading history retained</summary><p>Changed sections must be read again. Unchanged sections keep their place and completion.</p>{historyOpen&&<pre>{JSON.stringify({sections:state.priorRead,completed:state.completedRevisions},null,2)}</pre>}</details>}
      <header className="reader-head">
        <p className="muted small">
          {kind}
          {text.date ? ` · ${text.date}` : ""}
          {text.sections.length > 1 ? ` · ${done} of ${text.sections.length} parts read` : ""}
        </p>
        <h1>{text.title}</h1>
        {text.author && <p className="reader-by">{text.author}</p>}
        {(text.about || text.source) && (
          <details className="reader-about">
            <summary>About this text</summary>
            {text.about && <Markdown source={text.about} glossary={glossary} />}
            {text.source && <p className="small muted">Source: {text.source}</p>}
          </details>
        )}
      </header>

      <div className="reader-bar" role="toolbar" aria-label="Reading tools">
        {text.sections.length > 1 && (
          <>
            <button className="btn sm ghost" disabled={idx === 0||actionBusy||controller.busy} onClick={() => go(idx - 1)} aria-label="Previous part">
              ←
            </button>
            <label className="reader-toc">
              <span className="sr-only">Part</span>
              <select className="select" disabled={actionBusy||controller.busy} value={section.id} onChange={(e) => go(text.sections.findIndex((s) => s.id === e.target.value))}>
                {text.sections.map((s, i) => (
                  <option key={s.id} value={s.id}>
                    {state.read[s.id] ? "✓ " : ""}
                    {i + 1}. {s.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn sm ghost" disabled={last||actionBusy||controller.busy} onClick={() => go(idx + 1)} aria-label="Next part">
              →
            </button>
          </>
        )}
        {canSpeak(voice) && (
          <button className="btn sm" onClick={()=>void readAloud().catch(error=>{if(alive.current){stopAloud();setActionError(`Read-aloud stopped: ${(error as Error).message}`);}})} aria-pressed={aloud}>
            {aloud ? "■ Stop reading aloud" : "🔊 Read aloud"}
          </button>
        )}
        <span className="reader-time small muted">
          Reading time: {readingTime(total)}
          <span role="status">{counting ? "" : " · paused while you're away"}</span>
        </span>
      </div>

      <article className="reader-body" ref={bodyRef} lang={langCode}>
        <h2 ref={headRef} tabIndex={-1} className="reader-section">
          {section.title}
        </h2>
        <Markdown
          key={section.id}
          source={source}
          html={verse}
          decorate={false}
          glossary={glossary}
          notes={notes}
          className={`prose reader-text${verse ? " is-verse" : ""}`}
          ttsLang={voice}
        />
        {notes.length > 0 && (
          <section className="reader-notes" aria-labelledby="reader-notes-h">
            <h3 id="reader-notes-h">Notes</h3>
            <ol>
              {notes.map((n) => (
                <li key={n.id}>
                  <Markdown source={n.text} glossary={glossary} className="note-text" />
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>

      {questions.length > 0 && (
        <section className="panel reader-questions">
          <h2>Questions about {section.title}</h2>
          <p className="muted small">
            {questions.length} question{questions.length === 1 ? "" : "s"} to check your understanding. You see the answer and an explanation after each one.
          </p>
          <button className="btn" disabled={actionBusy||controller.busy} onClick={askQuestions}>
            Answer the questions
          </button>
        </section>
      )}

      <section className="panel reader-end">
        {readOn ? (
          <p className="small">
            <span className="pill pass">Read</span> You finished this part on {fmtDate(readOn)}.
          </p>
        ) : (
          <p className="small muted">{last ? "This is the last part." : "When you've read this part, mark it and go on."}</p>
        )}
        <div className="row">
          {!readOn && (
            <button className="btn primary" disabled={actionBusy||controller.busy} onClick={finishSection}>
              {last ? (done === text.sections.length - 1 ? `I've finished the ${kind.toLowerCase()}` : "I've read this part") : "I've read this part: next"}
            </button>
          )}
          {readOn && !last && (
            <button className="btn primary" onClick={() => go(idx + 1)}>
              Next: {text.sections[idx + 1].title}
            </button>
          )}
          {state.finished && (
            <span className="small muted">
              Finished on {fmtDate(state.finished)}
              {api.family && api.student && !course.community && controller.logSaved ? `; it's in ${api.student.name}'s reading log.` : course.community ? "; community reading stays outside official reading records." : "."}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
