// React wrapper around the CodeMirror editor (lib/codeEditor.ts), which is downloaded only when a
// code screen opens. Until it arrives the code shows as plain text in the same box.
import { useEffect, useRef, useState } from "react";
import type { CodeLang } from "../lib/code";
import type { EditorHandle } from "../lib/codeEditor";

interface Props {
  value: string;
  language: CodeLang;
  label: string;
  readOnly?: boolean;
  describedBy?: string;
  /** A line to mark (an error), or null. */
  errorLine?: number | null;
  onChange?: (code: string) => void;
  className?: string;
}

export default function CodeEditor({ value, language, label, readOnly, describedBy, errorLine, onChange, className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const ed = useRef<EditorHandle | null>(null);
  const change = useRef(onChange);
  change.current = onChange;
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    import("../lib/codeEditor")
      .then((m) => {
        if (!alive || !host.current) return;
        ed.current = m.createEditor(host.current, {
          doc: value,
          language,
          readOnly,
          label,
          describedBy,
          onChange: (c) => change.current?.(c),
        });
        setReady(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      ed.current?.destroy();
      ed.current = null;
    };
    // The editor is made once per language; later changes go through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Outside changes (Start over, a restored draft) replace the text; typing doesn't come back here.
  useEffect(() => {
    if (ed.current && ed.current.getValue() !== value) ed.current.setValue(value);
  }, [value, ready]);
  useEffect(() => ed.current?.setReadOnly(!!readOnly), [readOnly, ready]);
  useEffect(() => ed.current?.markLine(errorLine ?? null), [errorLine, ready]);

  if (failed)
    // The editor couldn't load (offline web visit with an old cache): a plain text box still works.
    return (
      <textarea
        className={`textarea code-fallback ${className}`}
        aria-label={label}
        aria-describedby={describedBy}
        value={value}
        readOnly={readOnly}
        spellCheck={false}
        rows={Math.min(20, Math.max(4, value.split("\n").length + 1))}
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  return (
    <div className={`code-editor ${className}`}>
      <div ref={host} />
      {!ready && (
        <pre className="code-src code-loading" aria-label={label}>
          <code>{value}</code>
        </pre>
      )}
    </div>
  );
}
