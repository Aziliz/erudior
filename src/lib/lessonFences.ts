/** Shared Markdown fence boundaries. Never interpret a nested marker inside an outer code fence. */
export const INTERACTIVE_LESSON_KINDS = ["sounds","blend","trace","map","timeline","sim","code","example","figure","plot","shape","numberline","manipulative","assignment","dialogue","speak","mermaid"] as const;
export type LessonFence = { kind: string; info: string; body: string; start: number; end: number; interactive: boolean; closed: boolean; marker: string; closeMarker?: string };
export function scanLessonFences(source: string): LessonFence[] {
  const lines = [...source.matchAll(/[^\n]*(?:\n|$)/g)].filter(match => match[0].length);
  const result: LessonFence[] = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i][0].replace(/\r?\n$/, "");
    const open = /^( {0,3})(`{3,}|~{3,})([^\r\n]*)$/.exec(raw);
    if (!open || open[2][0] === "`" && open[3].includes("`")) continue;
    const info = open[3].trim(), kind = /^(\S+)/.exec(info)?.[1] ?? "";
    const start = lines[i].index!, bodyStart = start + lines[i][0].length;
    let j = i + 1, closeMarker: string | undefined;
    for (; j < lines.length; j++) {
      const close = /^( {0,3})(`{3,}|~{3,})[ \t]*\r?$/.exec(lines[j][0].replace(/\n$/, ""));
      if (close && close[2][0] === open[2][0] && close[2].length >= open[2].length) { closeMarker = close[1] + close[2]; break; }
    }
    const closed = j < lines.length, end = closed ? lines[j].index! + lines[j][0].length : source.length;
    result.push({kind,info:info.slice(kind.length).trim(),body:source.slice(bodyStart,closed?lines[j].index!:source.length),start,end,interactive:open[1]===""&&open[2]==="```"&&(INTERACTIVE_LESSON_KINDS as readonly string[]).includes(kind),closed,marker:open[1]+open[2],...(closeMarker?{closeMarker}:{})});
    i = closed ? j : lines.length;
  }
  return result;
}
