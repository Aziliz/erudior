// The code editor (CodeMirror 6), loaded only on screens with code. Line numbers, Python and
// JavaScript highlighting in the app's theme colors, auto-indent, bracket closing, undo.
// Tab indents; Esc then Tab moves focus on (CodeMirror's escape hatch, so the keyboard is never
// trapped), and the screens say so under the editor.
import { EditorState, Compartment, StateEffect, StateField, type Extension } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  placeholder as placeholderExt,
  type DecorationSet,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { HighlightStyle, LanguageSupport, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { tags as t } from "@lezer/highlight";
import type { CodeLang } from "./code";

// Theme colors come from the app's tokens, which keep 7:1 contrast in every theme.
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword, t.self], color: "var(--accent)", fontWeight: "600" },
  { tag: [t.string, t.special(t.string), t.regexp], color: "var(--ok)" },
  { tag: [t.number, t.bool, t.null, t.atom], color: "var(--study)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--ink-3)", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.definition(t.variableName)), t.definition(t.function(t.variableName))], fontWeight: "600" },
  { tag: [t.className, t.definition(t.className), t.typeName], color: "var(--flag)" },
  { tag: t.invalid, textDecoration: "underline wavy var(--bad)" },
]);

const baseTheme = EditorView.theme({
  "&": { color: "var(--ink)", backgroundColor: "var(--surface)", fontSize: "0.95rem" },
  ".cm-content": { fontFamily: "var(--code-font)", caretColor: "var(--ink)", padding: "6px 0" },
  ".cm-scroller": { fontFamily: "var(--code-font)", lineHeight: "1.5" },
  ".cm-gutters": { backgroundColor: "var(--paper)", color: "var(--ink-3)", borderRight: "1px solid var(--rule)" },
  // The current line is tinted only while typing, lightly enough to keep 7:1 text contrast.
  ".cm-activeLine": { backgroundColor: "transparent" },
  "&.cm-focused .cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--accent-soft) 30%, transparent)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
  "&.cm-focused .cm-activeLineGutter": { backgroundColor: "var(--accent-soft)", color: "var(--ink)" },
  "&.cm-focused .cm-cursor": { borderLeftColor: "var(--ink)", borderLeftWidth: "2px" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: "color-mix(in srgb, var(--accent) 28%, transparent)" },
  ".cm-matchingBracket": { backgroundColor: "var(--accent-soft)", outline: "1px solid var(--accent)" },
  ".cm-placeholder": { color: "var(--ink-3)" },
  "&.cm-focused": { outline: "none" },
});

export interface EditorHandle {
  view: EditorView;
  getValue(): string;
  setValue(code: string): void;
  setReadOnly(on: boolean): void;
  /** Mark a line (an error) or clear the mark (null). */
  markLine(line: number | null): void;
  focus(): void;
  destroy(): void;
}

export interface EditorOptions {
  doc: string;
  language: CodeLang;
  readOnly?: boolean;
  /** Accessible name, e.g. "Your code (Python)". */
  label: string;
  /** Id of the element that explains the keys (aria-describedby). */
  describedBy?: string;
  placeholder?: string;
  onChange?: (code: string) => void;
}

const setErrorLine = StateEffect.define<number | null>();
const errorLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects)
      if (e.is(setErrorLine)) {
        if (e.value === null || e.value < 1 || e.value > tr.state.doc.lines) deco = Decoration.none;
        else deco = Decoration.set([Decoration.line({ class: "cm-error-line" }).range(tr.state.doc.line(e.value).from)]);
      }
    // Editing clears the mark: it described the code as it was.
    if (tr.docChanged) deco = Decoration.none;
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function createEditor(parent: HTMLElement, o: EditorOptions): EditorHandle {
  const ro = new Compartment();
  // Each language's grammar is its own download; highlighting and smart indent switch on when it arrives.
  const langSlot = new Compartment();
  let alive = true;
  const grammar =
    o.language === "python" ? import("@codemirror/lang-python").then((m) => m.pythonLanguage) : import("@codemirror/lang-javascript").then((m) => m.javascriptLanguage);
  grammar.then((l) => alive && view.dispatch({ effects: langSlot.reconfigure(new LanguageSupport(l)) })).catch(() => {});
  const readOnlyExt = (on: boolean): Extension => [EditorState.readOnly.of(on), EditorView.editable.of(!on)];
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: o.doc,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        drawSelection(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        indentUnit.of(o.language === "python" ? "    " : "  "),
        EditorState.tabSize.of(o.language === "python" ? 4 : 2),
        langSlot.of([]),
        syntaxHighlighting(highlight),
        baseTheme,
        errorLineField,
        EditorView.lineWrapping,
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.contentAttributes.of({
          "aria-label": o.label,
          ...(o.describedBy ? { "aria-describedby": o.describedBy } : {}),
          autocapitalize: "off",
          autocorrect: "off",
          spellcheck: "false",
        }),
        o.placeholder ? placeholderExt(o.placeholder) : [],
        ro.of(readOnlyExt(!!o.readOnly)),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) o.onChange?.(u.state.doc.toString());
        }),
      ],
    }),
  });
  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: (code) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } }),
    setReadOnly: (on) => view.dispatch({ effects: ro.reconfigure(readOnlyExt(on)) }),
    markLine: (line) => view.dispatch({ effects: setErrorLine.of(line) }),
    focus: () => view.focus(),
    destroy: () => {
      alive = false;
      view.destroy();
    },
  };
}
