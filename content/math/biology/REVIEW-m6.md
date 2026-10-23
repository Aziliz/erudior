# Module 6 (DNA, genes and biotechnology) review

Reviewer: independent (did not write this module). Lessons 22–25, `questions/m06.yaml`,
`drills/m06.yaml`, `glossary-m6.yaml`, `cards-m6.yaml`, NOTES-m6.md items.
`content/math/check-module.sh biology m6`: 0 problems after edits.

## What was checked
- All 42 questions worked before reading the key. Every key correct; every distractor wrong; stems
  unambiguous. Sequence items (0605, 0612, 0615, 0617, 0627, 0628, 0632) checked by script against
  the standard codon table.
- Lesson 23's 64-entry codon table checked entry by entry against the standard code (NCBI
  translation table 1): all correct.
- Worked examples: complement 5′-ATGCCGTT-3′, mRNA 5′-AUGCCUAGG-3′, Example 2 translation
  (Met–Phe–Gly–Lys), anticodon 3′-AAG-5′ → UUC Phe, mutation Example 2 (frameshift gives Met–Asn–Gly),
  Chargaff 22% G, hybrid fraction 2/2ⁿ, restriction 3,000/4,500/2,500 and circle 4,500/5,500,
  gel 10^3.15 ≈ 1,413 bp, PCR 50 × 2²⁰ = 52,428,800.
- **Sequence drills (bio-complement, bio-transcribe, bio-translate: 12 problems each;
  bio-mutation-effect: 16)**: every key re-derived by an independent script with its own codon table
  (built from the NCBI table-1 string, not from the writer's code). For each problem it checks that
  exactly one option is correct and matches `value mod 10`, that the `sol` entry has the same
  value and names the same option, and that every distractor really is the mistake the solution
  says it is (copied strand, U in DNA, reversed order; DNA complement, template with U, reversed;
  anticodon lookup, +1 frame, frame from base 1). For translation: first AUG located, in-frame stop
  present, polypeptide stops at it. For mutations: the type is recomputed (length change → frameshift;
  else same amino acid / stop / other) and the original ends in a stop with no earlier in-frame stop.
  **Result: all 52 keys correct**, positions balanced (3/3/3/3 per 12-pool, 4/4/4/4 for mutations),
  and all frameshift position statements (insert before 8; delete 14, 12, 11) correct.
- Other drills (chargaff, strand-counts, codon-count, pcr-copies, gel-size, restriction-fragments):
  prompts and solutions read; formulas correct.
- Glossary (34) and cards (28): consistent with lessons.

## Changes
| File | Change | Why / source |
|---|---|---|
| lessons/22-dna.md | Franklin's photos "(with Maurice Wilkins's group)" → "taken at King's College London (where Maurice Wilkins also studied DNA)"; added that Watson and Crick saw her data without her knowledge | Franklin was not part of Wilkins's group, and the old wording blurred her role. Standard history (e.g. NIH/NLM Profiles in Science, Rosalind Franklin). |
| lessons/22-dna.md | Human chromosome origins "thousands" → "hundreds to thousands" | The genome has roughly 30,000–50,000 active origins across 23 chromosomes, so small chromosomes have hundreds. |
| lessons/25-biotech.md | Genome sequenced "in a day" → "in a day or two" | Softened: a routine whole-genome run takes about a day or more. |
| questions/m06.yaml (bio-q-0617) | Explanation of the CAU distractor: "reads the complement backwards" → "is the anticodon read 5′ to 3′ and then looked up as if it were a codon" | The old explanation was wrong: CAU is the anticodon reversed, not the complement. |
| questions/m06.yaml (bio-q-0604) | "18% confuses A with C's partner" → "18% wrongly assumes A equals C" | The old explanation didn't make sense. |
| drills/m06.yaml (bio-mutation-effect) | "inserting an U" → "inserting a U" | Grammar. |

## NOTES-m6 facts checked
- Error rate about 1 per billion after proofreading and repair: consistent with standard figures (10⁻⁹–10⁻¹⁰). Kept.
- Casgevy approved in 2023 (UK Nov, FDA Dec 8 2023): confirmed, https://www.statnews.com/2023/12/08/fda-approves-casgevy-crispr-based-medicine-for-treatment-of-sickle-cell-disease/ . Doudna and Charpentier, 2020 Nobel Prize in Chemistry: correct.
- Human insulin 1982, CODIS 20 core STR loci, HGP 2003 / 13 years / about $3 billion, about 20,000
  protein-coding genes, Jacob–Monod Nobel 1965, Nirenberg–Matthaei 1961, Crick 1958, Meselson–Stahl 1958,
  Mullis 1983: all standard and correct. Not fetched individually.
- Lac operon (repressor as the main switch, CAP/glucose in one sentence): OK for this level.

## For the editor
- As NOTES-m6 suggests, consider adding the codon table to `bio-ref-genetics`. The sequence drills tell
  learners to use "the codon table from the lesson", and lesson 23 has no `refs:` line.
