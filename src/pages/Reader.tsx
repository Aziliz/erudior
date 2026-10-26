// The built-in reader: one text from a course's library, a section at a time. It follows the
// Display settings (theme, reading width, text size), remembers the place (section and the
// paragraph or line at the top of the screen), counts reading time only while the window is
// visible and the student is active (lib/timer.ts ActiveClock), offers read-aloud with the
// device's voice, footnotes and word pop-ups, and reading questions after a section.
// Finishing a text adds it to a homeschool student's reading log.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course, ReaderText } from "../lib/types";
import Markdown, { renderMarkdown } from "../components/Markdown";
import {
  addReadingTime,
  footnotes,
  isVerse,
  markSectionRead,
  readingKey,
  readingState,
  readingSubject,
  readingTime,
  renderVerse,
  savePlace,
  verseLines,
} from "../lib/reader";
import { ActiveClock, updateRecords } from "../lib/timer";
import { logBook } from "../lib/records";
import { canSpeak, onVoices, speakAsync, stopSpeaking } from "../lib/speech";
import { lessonQuizQuestions, startReadingQuestions } from "../lib/session";
import { mainBank } from "./CourseHome";
import { fmtDate } from "../components/ReportDocs";

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

export default function Reader({ api, course, text }: { api: AppApi; course: Course; text: ReaderText }) {
  const key = readingKey(course.id, text.id);
  const start = readingState(api.progress, course.id, text);
  const [sectionId, setSectionId] = useState(text.sections.some((s) => s.id === start.section) ? start.section : text.sections[0].id);
  const idx = Math.max(0, text.sections.findIndex((s) => s.id === sectionId));
  const section = text.sections[idx];
  const state = api.progress.reading?.[key] ?? start;
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
  const blocks = useCallback((): HTMLElement[] => {
    const el = bodyRef.current?.querySelector(".reader-text");
    if (!el) return [];
    return verse ? [...el.querySelectorAll<HTMLElement>("[data-b]")] : ([...el.children] as HTMLElement[]);
  }, [verse]);
  const scroller = () => (bodyRef.current?.closest(".main") as HTMLElement | null) ?? (document.scrollingElement as HTMLElement | null);

  // ---- Reading time ------------------------------------------------------------------------
  const clock = useRef<ActiveClock | null>(null);
  const [counting, setCounting] = useState(true);
  const flush = useCallback(() => {
    const s = clock.current?.take() ?? 0;
    if (s >= 1) api.updateProgress((p) => addReadingTime(p, course.id, text, s)).catch(() => {});
  }, [api, course.id, text]);
  useEffect(() => {
    const c = new ActiveClock(Date.now(), READ_IDLE_MS);
    clock.current = c;
    const visible = () => document.visibilityState === "visible";
    const onInput = () => c.input(Date.now());
    const events = ["keydown", "pointerdown", "pointermove", "wheel", "touchstart", "scroll"] as const;
    for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true });
    const tick = window.setInterval(() => {
      const now = Date.now();
      c.tick(now, visible());
      setCounting(c.counting(now, visible()));
    }, TICK_MS);
    const saver = window.setInterval(flush, SAVE_MS);
    const onHide = () => {
      c.tick(Date.now(), true);
      if (!visible()) flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      c.tick(Date.now(), visible());
      for (const e of events) window.removeEventListener(e, onInput, { capture: true });
      document.removeEventListener("visibilitychange", onHide);
      window.clearInterval(tick);
      window.clearInterval(saver);
      flush();
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
      placeTimer.current = window.setTimeout(() => {
        const top = (sc === document.scrollingElement ? 0 : sc.getBoundingClientRect().top) + (document.querySelector(".reader-bar")?.getBoundingClientRect().height ?? 0);
        const list = blocks();
        const at = Math.max(0, list.findIndex((b) => b.getBoundingClientRect().bottom > top + 8));
        api.updateProgress((p) => savePlace(p, course.id, text, section.id, at)).catch(() => {});
      }, 1200);
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
    const at = firstOpen.current && state.section === section.id ? state.at : 0;
    const el = blocks()[at];
    const sc = scroller();
    requestAnimationFrame(() => {
      if (at > 0 && el) {
        el.scrollIntoView({ block: "start" });
        // Leave room for the sticky bar.
        if (sc) sc.scrollTop -= (document.querySelector(".reader-bar")?.getBoundingClientRect().height ?? 0) + 8;
      } else if (!firstOpen.current && sc) sc.scrollTop = 0;
      if (!firstOpen.current) headRef.current?.focus();
      firstOpen.current = false;
    });
    api.updateProgress((p) => savePlace(p, course.id, text, section.id, at)).catch(() => {});
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
  const go = (i: number) => {
    flush();
    setSectionId(text.sections[i].id);
  };
  const readOn = state.read[section.id];
  const last = idx === text.sections.length - 1;
  const bank = mainBank(course);
  const questions = lessonQuizQuestions(bank, section.questions);

  async function finishSection() {
    flush();
    let finished = false;
    await api.updateProgress((p) => {
      const was = !!p.reading?.[key]?.finished;
      const next = markSectionRead(p, course.id, text, section.id);
      finished = !was && !!next.reading?.[key]?.finished;
      return next;
    });
    if (finished) {
      api.toast(`You finished ${text.title}!`);
      // Homeschool: it goes in the student's reading log (the parent can edit or remove it).
      if (api.family && api.student && !course.community) {
        const secs = api.progress.reading?.[key]?.seconds ?? 0;
        await updateRecords(api.student.id, (r) =>
          logBook(r, {
            date: new Date().toISOString().slice(0, 10),
            title: text.title,
            author: text.author ?? "",
            subject: readingSubject(text, course.language?.code),
            note: `Read in Erudior (${course.title})`,
            minutes: Math.round(secs / 60),
            textKey: key,
          }),
        ).catch(() => {});
      }
    }
    if (!last) go(idx + 1);
  }

  function askQuestions() {
    if (!bank) return;
    flush();
    api.go({ name: "run", session: startReadingQuestions(bank, { courseId: course.id, textId: text.id, sectionId: section.id }, section.questions!) });
  }

  // Keep the reading log's minutes current for a finished book read again.
  const total = state.seconds;
  useEffect(() => {
    if (!state.finished || !api.family || !api.student || course.community) return;
    const sid = api.student.id;
    updateRecords(sid, (r) => {
      const e = r.reading.find((b) => b.textKey === key);
      return e ? logBook(r, { ...e, minutes: Math.round(total / 60) }) : r;
    }).catch(() => {});
    // Only when a whole minute is added.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(total / 60)]);

  const kind = KIND_LABEL[text.kind ?? "prose"];
  const done = text.sections.filter((s) => state.read[s.id]).length;

  return (
    <div className="page reader">
      <button className="back" onClick={() => api.go({ name: "course", courseId: course.id, tab: "reading" })}>
        ← {course.title}: Reading
      </button>
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
            <button className="btn sm ghost" disabled={idx === 0} onClick={() => go(idx - 1)} aria-label="Previous part">
              ←
            </button>
            <label className="reader-toc">
              <span className="sr-only">Part</span>
              <select className="select" value={section.id} onChange={(e) => go(text.sections.findIndex((s) => s.id === e.target.value))}>
                {text.sections.map((s, i) => (
                  <option key={s.id} value={s.id}>
                    {state.read[s.id] ? "✓ " : ""}
                    {i + 1}. {s.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn sm ghost" disabled={last} onClick={() => go(idx + 1)} aria-label="Next part">
              →
            </button>
          </>
        )}
        {canSpeak(voice) && (
          <button className="btn sm" onClick={readAloud} aria-pressed={aloud}>
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
          <button className="btn" onClick={askQuestions}>
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
            <button className="btn primary" onClick={finishSection}>
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
              {api.family && api.student ? `; it's in ${api.student.name}'s reading log.` : "."}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
