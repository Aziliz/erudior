# NOTES2-pre-h1: Honors module pre-h1, Number theory and problem solving

`content/math/check-module.sh prealgebra pre-h1`: build and checker report **zero problems** (4 lessons, 55 questions, 10 drills, 38 cards).

## What was added

**Lessons** (module `pre-h1`, files 90–93; the module is `honors: true` in course.yaml):

| File | Id | Title | Min | Words | Examples | Figures | Drills |
|---|---|---|---|---|---|---|---|
| 90-remainders.md | pre-h1-remainders | Remainders and clock arithmetic | 45 | ~1,770 | 4 (100 days from Tuesday; 1,234 × 5,678 mod 9; last digit of 7^2026; 2^50 mod 7) | pre-h1-day-clock.svg; Mermaid casting-out-nines flowchart | pre-h1-r2-remainder-product, pre-h1-r2-last-digit, pre-h1-r2-days-later |
| 91-parity-proof.md | pre-h1-parity | Even, odd and proof | 45 | ~1,620 | 4 (three consecutive numbers; squares mod 4 and 4,000,003; ± signs on 1–10; mutilated chessboard) | pre-h1-chessboard.svg; Mermaid "counterexample, proof or conjecture" flowchart | pre-h1-r2-consecutive-sum |
| 92-counting-multiples.md | pre-h1-counting-multiples | Counting multiples and the zeros at the end of n! | 45 | ~1,740 | 5 (multiples of 6 in 100–300; 4 or 6 up to 1,000; none of 2, 3, 5 up to 100; zeros of 100!; zeros of 1,000!) | pre-h1-venn-2-3.svg (+ blank for the label question); Mermaid repeated-division flowchart | pre-h1-r2-multiples-range, pre-h1-r2-either-count, pre-h1-r2-factorial-zeros |
| 93-strategies.md | pre-h1-strategies | Problem-solving strategies: patterns, sums and smaller cases | 50 | ~1,620 | 3 + Gauss sum in text (7 + 11 + … + 199; handshakes; squares on a chessboard) | pre-h1-staircase.svg; pre-h1-odd-squares.svg; Mermaid Pólya flowchart | pre-h1-r2-count-terms, pre-h1-r2-arith-sum, pre-h1-r2-handshakes |

Each lesson has an intro tying back to core lessons (long division, factors/divisibility, GCF/LCM), `##` sections explaining why, Common mistakes and Key points. Topics were chosen to be cross-cutting and to avoid the core-module honors lessons already written (05h1 bases, 05h2 Euclid/divisor counting/infinitely many primes, 08h1 sign-rule proofs, 08h2 absolute value, 12h1/12h2 fractions). Lesson 91 uses "counterexample" (already defined in glossary-r2-pre-m2) without redefining it.

**Questions** (`questions/r2-pre-h1.yaml`, pre-h1-r2-h01 to h55): 14 / 14 / 14 / 13 per lesson.
- 33 four-choice MC (correct positions 9 / 8 / 8 / 8).
- 22 other types (40%): 9 text, 4 select-all, 4 order, 4 match, 1 label (Venn regions, lesson 92).
- `module_quiz: true` on 20 (5 per lesson), covering every lesson topic.

**Drills** (`drills/r2-pre-h1.yaml`, 10): listed above. 400 instances of each were generated and every answer recomputed independently in Python (brute force: actual products, factorials, range counts): 0 mismatches. All answers are integers (`format: integer`); numbers of 1,000 or more are kept out of TeX.

**Pictures** (all original, white background, ≤ 8 KB, previewed): pre-h1-day-clock.svg, pre-h1-chessboard.svg, pre-h1-venn-2-3.svg, pre-h1-venn-2-3-blank.svg (label markers checked in preview), pre-h1-odd-squares.svg, pre-h1-staircase.svg. **Mermaid**: 4 (one per lesson), each with accTitle/accDescr, previewed.

**Glossary** (`glossary-r2-pre-h1.yaml`): 16 terms: modular arithmetic, modulus, congruent modulo m, casting out nines, conjecture, proof, Goldbach's conjecture, parity, invariant, Venn diagram, inclusion–exclusion principle, factorial, Legendre's formula, triangular numbers, arithmetic sequence, common difference. Checked against every glossary*.yaml in the course (terms and aliases): no duplicates.

**Cards** (`cards-r2-pre-h1.yaml`): 38 (9 / 10 / 10 / 9 by lesson).

## For a reviewer to double-check

- Historical claims: Euler wrote about $n^2 + n + 41$ in the 1700s (his 1772 letter used the equivalent $n^2 - n + 41$; the lesson says only "in the 1700s"). Goldbach's conjecture: 1742 letter to Euler; verified by computer up to about $4 \times 10^{18}$ (Oliveira e Silva, Herzog and Pardi, 2014). Pólya, *How to Solve It*, 1945. The Gauss schoolroom story is labeled as a popular, probably embellished story.
- Lesson 92 says "more 2s than 5s" in $n!$ without proof (stated as an observation: every second number vs every fifth); this is standard.
- Lesson 93's handshake and chessboard-squares problems are counting problems; if the pre-m9 honors writer adds a combinations lesson there may be light overlap (here they are framed as "try smaller cases").
- The days-of-week drill asks for the day *number* (Sunday = 0 … Saturday = 6), since drill answers are numeric; the prompt states the numbering.

## Errors found in existing content

None. (Read lessons 02, 04, 05, 05h2, 08h1 and the core glossary for overlap.)

## Sources

Standard elementary number theory (no text copied): congruences and casting out nines; parity and invariant arguments (mutilated chessboard, a classic puzzle); inclusion–exclusion; Legendre's formula; arithmetic series. Facts checked: Wikipedia "Goldbach's conjecture" (1742 letter; verification bound $4 \times 10^{18}$), "Lucky numbers of Euler" ($n^2 + n + 41$, prime for 0 ≤ n ≤ 39), "How to Solve It" (Pólya, 1945; four phases), "Legendre's formula". All numbers recomputed in Python.
