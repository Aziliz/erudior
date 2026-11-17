import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Chosen, Course } from "../lib/types";
import { buildToneRound, recordTones, type TonePrompt } from "../lib/toneDrills";
import { picksOf, toneComplete, toneCorrect, toneLabel, toneParts } from "../lib/tones";
import { logActivity } from "../lib/planner";
import { confirmAction } from "../lib/storage";
import ToneAnswer, { toneAudible, toneVoice } from "../components/ToneAnswer";
import { ChineseToggles } from "../components/Ruby";

interface QItem {
  prompt: TonePrompt;
  /** Counts toward the tones' accuracy (the first answer in the round). */
  counted: boolean;
  n: number;
}

/**
 * A round of tone prompts from the course's vocabulary (language.tones): hear a word, pick the
 * tone of each syllable, see the marked pinyin. Misses come back later in the round as practice.
 */
export default function ToneRunner({ api, course, lessonIds }: { api: AppApi; course: Course; lessonIds?: string[] }) {
  const initial = useMemo<QItem[]>(() => buildToneRound(course, api.progress, { lessonIds }).map((prompt, n) => ({ prompt, counted: true, n })), []);
  const [queue, setQueue] = useState(initial);
  const [chosen, setChosen] = useState<Chosen>([]);
  const [shown, setShown] = useState<{ ok: boolean }>();
  const [hint, setHint] = useState<string>();
  const [tally, setTally] = useState({ right: 0, total: 0 });
  const current = queue[0];
  const voice = toneVoice(course.language?.tts);
  const back = () =>
    lessonIds?.length === 1 ? api.go({ name: "lesson", courseId: course.id, lessonId: lessonIds[0] }) : api.go({ name: "course", courseId: course.id, tab: "vocab" });

  async function check() {
    if (!current || shown) return;
    const tones = current.prompt.syls.map((s) => s.tone);
    const picks = picksOf(chosen, tones.length);
    if (!toneComplete(picks)) {
      setHint(tones.length > 1 ? "Pick a tone for every syllable." : "Pick a tone.");
      return;
    }
    setHint(undefined);
    const ok = toneCorrect(tones, picks);
    if (current.counted) {
      setTally((t) => ({ right: t.right + (ok ? 1 : 0), total: t.total + 1 }));
      const parts = toneParts(tones, picks);
      await api.updateProgress((p) => logActivity(recordTones(p, current.prompt.syls, parts), "cards"));
    }
    setShown({ ok });
  }

  function next() {
    if (!current || !shown) return;
    const rest = queue.slice(1);
    if (!shown.ok) rest.splice(Math.min(rest.length, 3 + Math.floor(Math.random() * 3)), 0, { ...current, counted: false });
    setQueue(rest);
    setShown(undefined);
    setChosen([]);
  }

  async function quit() {
    if (queue.length && tally.total && !(await confirmAction("End this round? Answers so far are saved."))) return;
    back();
  }

  if (!initial.length)
    return (
      <div className="page">
        <button className="back" onClick={back}>
          ← {course.title}
        </button>
        <section className="panel">
          <h1 className="h2">No words for tone practice yet</h1>
          <p className="muted">Words of one or two syllables join tone practice when you finish their lessons.</p>
        </section>
      </div>
    );

  if (!current)
    return (
      <div className="page">
        <section className="panel">
          <h1 className="h2">Round done</h1>
          <p>
            {tally.right} of {initial.length} right the first time.
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={() => api.go({ name: "vocab", courseId: course.id, mode: "tones", lessonIds, batch: Date.now() })}>
              Another round
            </button>
            <button className="btn" onClick={back}>
              {lessonIds?.length === 1 ? "Back to the lesson" : "Back to vocabulary"}
            </button>
          </div>
        </section>
      </div>
    );

  const { item, syls } = current.prompt;
  const done = initial.length - queue.filter((q) => q.counted).length;
  const audible = toneAudible(voice, item.audio);

  return (
    <div className="page vocab-run tone-run">
      <h1 className="sr-only">Tone practice: {course.title}</h1>
      <div className="run-head">
        <button className="back" onClick={quit}>
          ← End
        </button>
        <ChineseToggles />
        <span className="muted">
          Tones · {Math.min(done + 1, initial.length)}/{initial.length}
          {queue.length > initial.length - done ? ` (+${queue.length - (initial.length - done)} again)` : ""}
        </span>
      </div>

      <section className="panel vocab-card tone-card">
        <div className="vocab-meta muted">
          <span>{audible ? (syls.length > 1 ? "Listen: tone pair" : "Listen: one syllable") : "From memory (no Mandarin voice)"}</span>
          <span>{current.counted ? "Counts toward your tone accuracy" : "Practice (already counted)"}</span>
        </div>
        <p className="q-stem">{syls.length > 1 ? `Which tones are the ${syls.length} syllables?` : "Which tone is it?"}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (shown) next();
            else void check();
          }}
        >
          <ToneAnswer
            id={`${item.id}-${current.n}-${current.counted ? "c" : "p"}`}
            text={item.term}
            reading={item.reading ?? ""}
            chosen={chosen}
            onChange={(c) => {
              setHint(undefined);
              setChosen(c);
            }}
            onEnter={() => (shown ? next() : void check())}
            reveal={!!shown}
            voice={voice}
            clip={item.audio}
            autoPlay
          />
          {hint && (
            <p className="vocab-hint" role="status">
              {hint}
            </p>
          )}
          {shown && (
            <div className={`vocab-result ${shown.ok ? "right" : "wrong"}`} role="status">
              <p>
                <strong>{shown.ok ? "Right." : "Not quite."}</strong> {item.meanings[0]}
                {!shown.ok && <span className="sr-only"> The answer: {syls.map((s) => toneLabel(s.tone)).join("; ")}.</span>}
              </p>
            </div>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit" autoFocus>
              {shown ? "Next" : "Check"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
