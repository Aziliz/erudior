// Small helpers shared by the custom lesson blocks (```map, ```timeline, ```sim).

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A short stable hash, for ids that stay the same between renders of the same text. */
export function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** One short paragraph's HTML without its <p> wrapper (for titles and list items). */
export const unwrap = (html: string) => {
  const m = /^\s*<p>([\s\S]*)<\/p>\s*$/.exec(html);
  return m && !m[1].includes("<p>") ? m[1] : html;
};

/** Plain text from a short Markdown string (for aria-labels and data the widgets show as text). */
export const plain = (s: string) =>
  s
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\$+/g, "")
    .trim();

/**
 * Split "key: value" lines into fields. Keys in `multi` may continue on the following lines
 * (until the next known key); any other line that isn't a field is reported. Blank lines and
 * lines starting with # (outside multi-line fields) are skipped.
 */
export function readFields(
  body: string,
  keys: string[],
  multi: string[],
): { fields: { key: string; value: string; line: number }[]; problems: string[] } {
  const re = new RegExp(`^(${keys.join("|")})\\s*:[ \\t]?(.*)$`, "i");
  const fields: { key: string; value: string; line: number }[] = [];
  const problems: string[] = [];
  let cur: { key: string; lines: string[]; line: number } | null = null;
  const flush = () => {
    if (cur) fields.push({ key: cur.key, value: cur.lines.join("\n").trim(), line: cur.line });
    cur = null;
  };
  body
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .forEach((line, i) => {
      const m = re.exec(line);
      if (m) {
        flush();
        cur = { key: m[1].toLowerCase(), lines: [m[2]], line: i + 1 };
        if (!multi.includes(cur.key)) flush();
        return;
      }
      if (cur) {
        cur.lines.push(line);
        return;
      }
      if (!line.trim() || line.trim().startsWith("#")) return;
      problems.push(`line ${i + 1} isn't understood ("${line.trim().slice(0, 40)}"); lines start with ${keys.slice(0, 4).join(":, ")}: …`);
    });
  flush();
  return { fields, problems };
}
