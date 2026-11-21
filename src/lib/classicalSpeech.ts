// Text for the nearest real voice to read Latin and Ancient Greek (no device has either).
// All of it is approximate, and lessons say so (CLASSICAL.md):
//   Latin, restored classical: an Italian voice, the text respelled so Italian spelling rules give
//     roughly the classical sounds (latinRestored).
//   Latin, ecclesiastical: an Italian voice, nearly as written (latinEcclesiastical).
//   Greek, modern: a Greek voice, polytonic reduced to monotonic (greek.ts toMonotonic).
//   Greek, restored Attic: an Italian voice reading a transliteration (greekRestored).
// Pure functions; tests/classical.test.mts.

const stripCombining = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");

/** Keep the case of the original's first letter on a respelled word. */
function caseLike(orig: string, out: string): string {
  if (!orig || !out) return out;
  const first = orig[0];
  if (first !== first.toLowerCase() && first === first.toUpperCase()) {
    if (orig.length > 1 && orig === orig.toUpperCase()) return out.toUpperCase();
    return out[0].toUpperCase() + out.slice(1);
  }
  return out;
}

const LATIN_WORD = /[A-Za-zÀ-ɏ̀-ͯ]+/g;

/**
 * Latin, restored classical, respelled for an Italian voice. c and g are hard everywhere
 * (ce → che, gi → ghi, sc before e/i → sch); v is the glide u (vīnum → uinum); ae → ai, oe → oi;
 * gn → ngn (classical [ŋn]); ph th → p t; y → i; x → cs; h is dropped (Italian voices don't say it
 * anyway); ti, double consonants and quantities' letters are kept (the macrons go: Italian voices
 * ignore them).
 */
export function latinRestored(text: string): string {
  return text.replace(LATIN_WORD, (w) => {
    let s = stripCombining(w).toLowerCase();
    s = s
      .replace(/j/g, "i")
      .replace(/ae/g, "ai")
      .replace(/oe/g, "oi")
      .replace(/ph/g, "p")
      .replace(/th/g, "t")
      .replace(/rh/g, "r")
      .replace(/ch/g, "K")
      .replace(/h/g, "")
      .replace(/y/g, "i")
      .replace(/x/g, "cs")
      .replace(/qu/g, "Q")
      .replace(/v/g, "u")
      .replace(/gn/g, "ngn")
      // Hard c and g before front vowels (Italian ch/gh); gl before i stays [gl], not [ʎ].
      .replace(/c(?=[ei])/g, "ch")
      .replace(/K(?=[ei])/g, "ch")
      .replace(/K/g, "c")
      .replace(/g(?=[ei])/g, "gh")
      .replace(/gl(?=i)/g, "ghl")
      .replace(/Q/g, "qu");
    return caseLike(w, s);
  });
}

/**
 * Latin, ecclesiastical (Italianate), for an Italian voice: Italian spelling rules already fit, so
 * only the macrons go, ae/oe → e, ti before a vowel → zi (grātia → grazia, but not after s, t, x),
 * ph → f, th → t, y → i, j → i.
 */
export function latinEcclesiastical(text: string): string {
  return text.replace(LATIN_WORD, (w) => {
    let s = stripCombining(w).toLowerCase();
    s = s
      .replace(/j/g, "i")
      .replace(/ae|oe/g, "e")
      .replace(/ph/g, "f")
      .replace(/th/g, "t")
      .replace(/y/g, "i")
      .replace(/(^|[^stx])ti(?=[aeiou])/g, "$1zi");
    return caseLike(w, s);
  });
}

// --- Greek, restored Attic → Latin letters for an Italian voice ------------------------------

interface GLetter {
  base: string; // lower-case Greek letter
  rough: boolean;
  diaeresis: boolean;
  upper: boolean;
}

function parseGreekWord(w: string): GLetter[] {
  const out: GLetter[] = [];
  for (const ch of w.normalize("NFD")) {
    if (/[̀-ͯ]/.test(ch)) {
      const last = out[out.length - 1];
      if (!last) continue;
      if (ch === "̔") last.rough = true;
      if (ch === "̈") last.diaeresis = true;
      continue;
    }
    const lower = ch.toLowerCase();
    out.push({ base: lower === "ς" ? "σ" : lower, rough: false, diaeresis: false, upper: ch !== lower });
  }
  return out;
}

const G_SIMPLE: Record<string, string> = {
  β: "b", δ: "d", ζ: "sd", θ: "t", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "ks", π: "p", ρ: "r", σ: "s", τ: "t", φ: "p", χ: "k", ψ: "ps", ϝ: "u",
};

/** Sounds (k and g kept abstract) → Italian spelling: k → c/ch, g → g/gh before front vowels. */
function italianSpelling(sounds: string): string {
  return sounds
    .replace(/k(?=[eièé])/g, "ch")
    .replace(/k/g, "c")
    .replace(/g(?=[eièé])/g, "gh")
    .replace(/g(?=n)/g, "gh")
    .replace(/gl(?=i)/g, "ghl")
    .replace(/cs/g, "cs");
}

/**
 * Ancient Greek, restored Attic (c. 400 BC), as Latin letters an Italian voice reads roughly right.
 * Approximate by design: φ θ χ lose their aspiration (→ p t k), η → è, ω → o, υ → u, ει → e
 * (Attic [eː]), ου → u, αι οι αυ ευ kept, iota subscript silent, γ before γ κ χ ξ → n, rough
 * breathing → h (most Italian voices won't say it), ζ → sd. The pitch accent isn't marked.
 */
export function greekRestored(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[Ͱ-Ͽἀ-῿̀-ͯ]+/g, (w) => {
      const ls = parseGreekWord(w);
      let s = "";
      for (let i = 0; i < ls.length; i++) {
        const l = ls[i];
        const next = ls[i + 1];
        const pair = next && !next.diaeresis ? l.base + next.base : "";
        if ((l.rough && l.base !== "ρ") || (next?.rough && /^(αι|ει|οι|ου|αυ|ευ|ηυ|υι)$/.test(pair))) s += "h";
        if (pair === "ει") { s += "e"; i++; continue; }
        if (pair === "ου") { s += "u"; i++; continue; }
        if (pair === "αι" || pair === "οι" || pair === "υι") { s += (l.base === "α" ? "a" : l.base === "ο" ? "o" : "u") + "i"; i++; continue; }
        if (pair === "αυ" || pair === "ευ" || pair === "ηυ") { s += (l.base === "α" ? "a" : l.base === "ε" ? "e" : "è") + "u"; i++; continue; }
        switch (l.base) {
          case "α": s += "a"; break;
          case "ε": s += "e"; break;
          case "η": s += "è"; break;
          case "ι": s += "i"; break;
          case "ο": s += "o"; break;
          case "υ": s += "u"; break;
          case "ω": s += "o"; break;
          case "γ": s += next && /[γκχξ]/.test(next.base) ? "n" : "g"; break;
          case "ρ": s += "r"; break;
          default: s += G_SIMPLE[l.base] ?? "";
        }
      }
      const out = italianSpelling(s);
      return ls[0]?.upper && out ? out[0].toUpperCase() + out.slice(1) : out;
    })
    .replace(/·/g, ",")
    .replace(/;/g, "?");
}
