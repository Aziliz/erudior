import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { autoRuby, rubyHtml } from "../lib/kana";

/**
 * Japanese text with furigana: `{漢字|かんじ}` markup in `text`, or a whole word plus its kana
 * `reading` (the reading goes over the kanji only). Other languages render as plain text.
 */
export function RubyText({ text, reading, lang }: { text: string; reading?: string; lang?: string }) {
  if (lang !== "ja") return <>{text}</>;
  const marked = reading ? autoRuby(text, reading) : text;
  if (!marked.includes("|")) return <>{text}</>;
  const escaped = marked.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rubyHtml(escaped, false)) }} />;
}

const KEY = "erudior.furigana";

export function furiganaOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

/** Apply the saved furigana setting to the page (CSS hides <rt> when off). */
export function applyFurigana(on = furiganaOn()) {
  document.documentElement.classList.toggle("furigana-off", !on);
}

const listeners = new Set<(on: boolean) => void>();

export function setFurigana(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage unavailable: setting lasts for this page view */
  }
  applyFurigana(on);
  listeners.forEach((f) => f(on));
}

/** A switch that shows or hides furigana everywhere (shown on Japanese course screens). */
export function FuriganaToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(furiganaOn);
  useEffect(() => {
    applyFurigana(on);
    listeners.add(setOn);
    return () => {
      listeners.delete(setOn);
    };
  }, []);
  return (
    <button
      type="button"
      className={`btn sm ghost furigana-toggle ${className}`}
      aria-pressed={on}
      title="Show the kana reading above kanji"
      onClick={() => setFurigana(!on)}
    >
      <span lang="ja" aria-hidden="true">
        <ruby>
          字<rt>じ</rt>
        </ruby>
      </span>{" "}
      Furigana {on ? "on" : "off"}
    </button>
  );
}
