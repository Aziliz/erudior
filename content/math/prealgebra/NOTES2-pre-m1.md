# NOTES2-pre-m1: Round 2 for pre-m1 (Whole numbers)

`content/math/check-module.sh prealgebra pre-m1`: build and checker report **zero problems** (8 lessons, 125 questions, 19 drills, 62 cards).

## Honors lessons (3, all `honors: true`, module `pre-m1`)

| File | Id | Title | Minutes | Words* | Worked examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| 05h1-number-bases.md | pre-m1-h-bases | Place value in other bases | 40 | ~1,910 | 4 ($2304_5$ to base ten; 45 to binary; $1011_2 + 110_2$; $2\text{F}_{16}$ and 200 ↔ hex) | pre-m1-base-five.svg; Mermaid repeated-division flowchart | pre-m1-r2-base-to-ten, pre-m1-r2-ten-to-binary, pre-m1-r2-hex-to-ten |
| 05h2-euclid.md | pre-m1-h-euclid | Euclid's algorithm and counting divisors | 45 | ~1,900 | 4 (GCF(1,071, 462) and simplifying; GCF and LCM of 2,024 and 1,309; divisors of 360; smallest number with 12 divisors) + Euclid's proof that primes never run out | pre-m1-euclid-tiling.svg; Mermaid algorithm flowchart; divisor table for 72 | pre-m1-r2-euclid, pre-m1-r2-lcm-euclid, pre-m1-r2-divisor-count |
| 05h3-estimation.md | pre-m1-h-estimation | Bounds, error and Fermi problems | 40 | ~1,470 | 5 (bounds for a product; bounds for a difference; seats from a rounded row count; heartbeats per year; school hours grades 1–12) | numberline of the rounding range; Mermaid Fermi breakdown | pre-m1-r2-bounds-product, pre-m1-r2-round-range, pre-m1-r2-rate-chain |

*Raw word count of the body including tables and Mermaid source.

## Core lessons (additions only)

| Lesson | Added |
|---|---|
| 01-place-value | base-ten blocks picture (1,324) with a two-sentence intro; Mermaid rounding flowchart |
| 02-whole-ops | area model picture for 47 × 36 with a short paragraph (new bold term **area model**); Mermaid long-division cycle; picture of the 7,385 ÷ 6 long-division layout |
| 03-order-ops | picture of 3² as a square and 3³ as a cube; Mermaid order-of-operations chart |
| 04-factors | dot arrays for the factor pairs of 12 (one-sentence intro); Mermaid prime-test flowchart; sieve of Eratosthenes 1–50 picture with two sentences (name, why multiples of 2, 3, 5, 7 suffice) |
| 05-gcf-lcm | Venn diagram of the prime factors of 84 and 90 with a short paragraph explaining GCF × LCM = product; Mermaid "GCF or LCM?" chart |

## Questions (`questions/r2-pre-m1.yaml`, 70)

- Core (pre-m1-r2-q01…q26): 26, 5–6 per lesson, all new types: 8 text, 5 order, 5 match, 5 select-all, 3 label (base-ten blocks, long-division parts, Venn regions). `module_quiz: true` on 10 (2 per lesson).
- Honors (pre-m1-r2-h01…h44): 15 / 15 / 14 per lesson. 22 four-choice MC (correct index 0/1/2/3: 5/5/6/6), 9 text, 5 order, 3 match, 5 select-all. New types are about half of each honors quiz.

## Pictures (12 SVG files, original, 88 KB total, all previewed; label markers previewed on the blanks)

pre-m1-base-ten-blocks.svg (+ -blank), pre-m1-area-model.svg, pre-m1-long-division.svg (+ -blank), pre-m1-square-cube.svg, pre-m1-factor-arrays.svg, pre-m1-sieve.svg, pre-m1-venn-84-90.svg (+ -blank), pre-m1-base-five.svg, pre-m1-euclid-tiling.svg.
Mermaid diagrams: 8 (5 core, 3 honors), each with accTitle/accDescr, all `flowchart TD`, previewed.

## Drills (`drills/r2-pre-m1.yaml`, 9)

pre-m1-r2-base-to-ten, pre-m1-r2-ten-to-binary, pre-m1-r2-hex-to-ten, pre-m1-r2-euclid, pre-m1-r2-lcm-euclid, pre-m1-r2-divisor-count, pre-m1-r2-bounds-product, pre-m1-r2-round-range, pre-m1-r2-rate-chain. The binary drill's answer box uses `format: dp0` so the correct answer shows as digits (1011011) rather than with thousands commas; the checker accepts it.

## Glossary and cards

- `glossary-r2-pre-m1.yaml`: 12 terms (area model, number base, base-ten system, binary, bit, byte, hexadecimal, Euclidean algorithm, overestimate, underestimate, Fermi problem, order of magnitude). Checked against every glossary*.yaml in the course: no duplicate terms or aliases.
- `cards-r2-pre-m1.yaml`: 31 cards (bases 10, Euclid/divisors 11, estimation 8, core pictures 2).

## For a reviewer

- **Overlap with other writers.** "Upper bound" and "lower bound" are bolded by the pre-m8 writer (35h3-measurement-error), so lesson 05h3 uses them in italics and does not define them in the glossary, to avoid duplicate entries. 05h3 and 35h3 both compute bounds of products; 05h3 does it for whole-number rounding early in the course, 35h3 for measurements. The pre-m6 writer mentions *order of magnitude* in italics (22h2); I defined it in my glossary, so if they add it too, one entry must go. The honors module pre-h1 (number theory) may also want the Euclidean algorithm or number bases; if its writer covers them, the overlap should be resolved there.
- History claims (kept modest): Euclid's *Elements* about 300 BC containing the GCF algorithm (Book VII) and the infinitude of primes (Book IX, Prop. 20); Babylonian base sixty "nearly 4,000 years ago" and its survival in minutes and seconds; Maya counting mostly in twenties with an 18 × 20 calendar place; placeholder signs in both systems; French *quatre-vingts*; Fermi's 1945 paper-scrap estimate described as "the same order of magnitude as later measurements" (his figure was about 10 kilotons, later measurements around 20); the piano-tuner question as "is said to have" asked.
- "Every two steps the remainder drops to less than half" (05h2) is the standard bound behind Lamé's theorem: $r_{k+2} < r_k / 2$.
- School-hours example (05h3) uses typical US figures (about 180 days, 6.5 hours) and says so.
- Every number in the lessons, questions and examples was recomputed in Python (base conversions, binary sums, Euclid steps, divisor counts, 30,031 = 59 × 509, bounds, Fermi products).

## Errors found in existing content

None. One imprecision noted but not edited: lesson 05 says the GCF answer "is smaller than the numbers"; it can equal the smaller number (GCF(6, 12) = 6). The new Mermaid chart says "no bigger than the smallest number."

## Sources

- OpenStax *Prealgebra 2e*, ch. 1–2 (place value, divisibility, prime factorization, GCF/LCM) for scope.
- Euclid, *Elements*, Book VII Props. 1–2 (the algorithm) and Book IX Prop. 20 (infinitely many primes); Knuth, *The Art of Computer Programming* vol. 2 §4.5.2–4.5.3 (Euclid's algorithm and its speed).
- Ifrah, *The Universal History of Numbers* (Babylonian base sixty, Maya base twenty and the 18 × 20 calendar place).
- Fermi's Trinity estimate: Fermi, "My Observations During the Explosion at Trinity on July 16, 1945" (report of about 10,000 tons of TNT).
