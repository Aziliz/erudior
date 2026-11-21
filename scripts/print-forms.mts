// Print every inflected form of a course's Latin or Greek words (or any conjugation course's
// words), so writers and reviewers can check the generator and the tables.
//
//   npx tsx scripts/print-forms.mts <course.json> [word…] [--rules] [--missing]
//
// A word is its id or its term (puella, λύω). With no word, every word with "conj" is printed.
// Each form shows its slot id, its label as the learner sees it, the answer (other accepted
// forms after "also"), and with --rules the rule shown after answering. Forms the course doesn't
// drill (not in language.conjugation, or in the word's noForms) are marked "(not drilled)";
// slots that neither generate nor come from a table are printed as MISSING with the reason.
// --missing prints only words with missing slots in drilled forms.
import { readFileSync } from "node:fs";
import { normalizeCourse } from "../src/lib/course.ts";
import { classicalWord, conjWordProblem, conjWordWarnings, formName, formsForClass, promptsFor } from "../src/lib/conjugation.ts";
import { isClassical, languageForms } from "../src/lib/courseConjugation.ts";
import { missingReason, slotLabel, slotsOfForm } from "../src/lib/conjugationClassical.ts";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const [file, ...words] = args.filter((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: npx tsx scripts/print-forms.mts <course.json> [word…] [--rules] [--missing]");
  process.exit(2);
}
const course = normalizeCourse(JSON.parse(readFileSync(file, "utf8")));
const lang = course.language?.code ?? "";
const drilled = new Set((course.language?.conjugation?.forms ?? []).map((f) => f.form));
const want = (v: { id: string; term: string }) => !words.length || words.some((w) => w.normalize("NFC") === v.id || w.normalize("NFC") === v.term.normalize("NFC"));
const list = (course.vocab ?? []).filter((v) => v.conj && want(v));
if (!list.length) {
  console.error(words.length ? `no word with "conj" matches ${words.join(", ")}` : `no word in ${file} has "conj"`);
  process.exit(1);
}
let missingCount = 0;
for (const item of list) {
  const out: string[] = [];
  out.push(`${item.term}${item.dict ? `  (${item.dict})` : ""}  [${item.conj}]  id ${item.id}`);
  const problem = conjWordProblem(lang, item);
  if (problem) {
    out.push(`  PROBLEM: ${problem}`);
    console.log(out.join("\n") + "\n");
    missingCount++;
    continue;
  }
  for (const w of conjWordWarnings(lang, item)) out.push(`  warning: ${w}`);
  const forms = formsForClass(lang, item);
  let wordMissing = 0;
  if (isClassical(lang)) {
    const w = classicalWord(lang, item);
    if (typeof w === "string") continue;
    const all = languageForms(lang).filter((f) => slotsOfForm(w, f).length);
    for (const form of all) {
      const slots = slotsOfForm(w, form);
      if (!slots.some((s) => w.cells.has(s) || !w.optional.has(s))) continue;
      const shown = slots.filter((s) => w.cells.has(s) || !w.optional.has(s) || s.split(".")[1] !== "loc");
      const on = drilled.has(form) && forms.includes(form);
      out.push(`  ${formName(lang, form)} [${form}]${on ? "" : "  (not drilled)"}`);
      for (const s of shown) {
        const c = w.cells.get(s);
        if (!c && w.optional.has(s)) {
          out.push(`    ${s.padEnd(20)} ${slotLabel(s, w).padEnd(48)} —`);
          continue;
        }
        if (!c) {
          if (on) wordMissing++;
          out.push(`    ${s.padEnd(20)} MISSING: ${missingReason(w, s) ?? "give it in forms"}`);
          continue;
        }
        out.push(`    ${s.padEnd(20)} ${slotLabel(s, w).padEnd(48)} ${c.forms[0]}${c.forms.length > 1 ? `   also ${c.forms.slice(1).join(", ")}` : ""}`);
        if (flags.has("--rules")) out.push(`    ${"".padEnd(20)} ${c.rule}`);
      }
    }
  } else {
    for (const form of forms) {
      out.push(`  ${formName(lang, form)} [${form}]${drilled.has(form) ? "" : "  (not drilled)"}`);
      for (const p of promptsFor(course, item, form)) {
        out.push(`    ${p.label.padEnd(48)} ${p.answers[0]}${p.also.length ? `   also ${p.also.join(", ")}` : ""}`);
        if (flags.has("--rules")) out.push(`    ${"".padEnd(48)} ${p.rule}`);
      }
    }
  }
  missingCount += wordMissing;
  if (!flags.has("--missing") || wordMissing) console.log(out.join("\n") + "\n");
}
process.exit(flags.has("--missing") && missingCount ? 1 : 0);
