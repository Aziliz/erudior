// Finding TeX in text (no KaTeX here, so the community worker can use it too). See math.ts.

export interface MathSeg {
  math: boolean;
  display?: boolean;
  text: string;
}

export function splitMath(src: string): MathSeg[] {
  const out: MathSeg[] = [];
  let buf = "";
  let i = 0;
  const push = (seg: MathSeg) => {
    if (buf) out.push({ math: false, text: buf });
    buf = "";
    out.push(seg);
  };
  while (i < src.length) {
    const c = src[i];
    // Escaped dollar sign.
    if (c === "\\" && src[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }
    if (src.startsWith("$$", i)) {
      const end = src.indexOf("$$", i + 2);
      if (end > i + 2) {
        push({ math: true, display: true, text: src.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (src.startsWith("\\[", i)) {
      const end = src.indexOf("\\]", i + 2);
      if (end > 0) {
        push({ math: true, display: true, text: src.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (src.startsWith("\\(", i)) {
      const end = src.indexOf("\\)", i + 2);
      if (end > 0) {
        push({ math: true, text: src.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (c === "$" && src[i + 1] && !/\s/.test(src[i + 1])) {
      // Find a valid closing $ on the same paragraph.
      let j = i + 1;
      let found = -1;
      while (j < src.length) {
        if (src[j] === "\n" && src[j + 1] === "\n") break;
        if (src[j] === "\\" ) {
          j += 2;
          continue;
        }
        if (src[j] === "$") {
          if (!/\s/.test(src[j - 1]) && !/\d/.test(src[j + 1] ?? "")) found = j;
          break;
        }
        j++;
      }
      if (found > i + 1) {
        push({ math: true, text: src.slice(i + 1, found) });
        i = found + 1;
        continue;
      }
    }
    buf += c;
    i++;
  }
  if (buf) out.push({ math: false, text: buf });
  return out;
}
