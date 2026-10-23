# NOTES2-calc-h1: Honors module calc-h1, "Honors: Toward analysis"

`content/math/check-module.sh calculus calc-h1`: build and checker report **zero problems**. The build has 4 lessons, 56 questions, 8 drills (7 new plus the existing `calc-d-ivt-bisect`) and 38 cards.

## What was added

The module is a capstone in the style of a first real-analysis course. It has one thread: the **completeness** of the real numbers is the reason the big theorems of the course are true.

- **Lesson 90** makes sequence limits precise.
- **Lesson 91** introduces completeness and its consequences.
- **Lesson 92** proves the IVT and EVT, which closes the chain EVT → Rolle → MVT → FTC 2.
- **Lesson 93** proves integrability and FTC 1.

Before choosing topics, I read the other calculus honors lessons that existed on 2026-10-23 (05h1, 05h2, 08h2, 16h2, 20h1, 25h2, 44h1, and others) so I wouldn't repeat them. Where they touch the same ideas, my lessons cross-reference them:
- 05h1 proves the sum law for functions. Lesson 90 proves it for sequences and points to 05h1.
- 05h2 says that proving the IVT from "no holes" "belongs to real analysis". Lesson 91 quotes that line, and lesson 92 does the proof.
- 25h2 uses the same telescoping-column picture to bound left and right sums. Lesson 93 says so and uses the picture to prove integrability instead.

| File | Id | Minutes | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 90-sequence-limits.md | calc-h1-sequence-limits | 45 | ~1,400 | 4: solving for N; bounding instead of solving; divergence of $(-1)^n$; two subsequences | calc-h1-epsilon-band.svg; plot of $(-1)^n n/(n+1)$ | calc-h1-r2-epsilon-n, calc-h1-r2-geometric-n |
| 91-completeness.md | calc-h1-completeness | 50 | ~1,800 | 2: sup/inf of $(-1)^n + 1/n$; $a_{n+1} = \sqrt{2 + a_n}$ | calc-h1-sup.svg; Mermaid "what completeness implies" | calc-h1-r2-sup-inf, calc-h1-r2-recursive-limit |
| 92-big-theorems.md | calc-h1-big-theorems | 50 | ~1,550 | 3: sin(1/x) discontinuity by sequences; bisection table for $x^3 + x - 1$; EVT failing for $x^2$ on (0, 1) | calc-h1-bisection-proof.svg; plot of 1/x on (0, 1]; Mermaid "completeness → … → FTC 2" | calc-h1-r2-bisection-steps, calc-d-ivt-bisect (existing) |
| 93-integrability.md | calc-h1-integrability | 50 | ~1,700 | 3: U and L for $x^2$; $n$ for $\sqrt x$ on [0, 4]; uniform continuity of $x^2$ vs 1/x | calc-h1-darboux.svg; Mermaid "is f integrable?" | calc-h1-r2-upper-lower, calc-h1-r2-darboux-n |

*Prose words leave out code blocks, display math and image alt text.

Lesson contents:
- **Lesson 90:** the definition of a sequence limit; proving divergence by negating the definition; uniqueness of limits; convergent ⇒ bounded; the sum law; subsequences.
- **Lesson 91:** upper and lower bounds; sup and inf with the ε-test; the completeness axiom, and why it fails on $\mathbb{Q}$; the Archimedean property, with proof; the monotone convergence theorem, with proof; nested intervals; the Bolzano–Weierstrass theorem (halving proof); Cauchy sequences.
- **Lesson 92:** the sequential criterion for continuity; limits keep non-strict inequalities; the IVT proof by bisection and nested intervals; the EVT proof via Bolzano–Weierstrass, in two steps; what each hypothesis does; the EVT failing on $\mathbb{Q}$ with $1/(x^2 - 2)$; the false converse of the IVT.
- **Lesson 93:** partitions; upper and lower sums; refinement; the upper and lower integrals; Riemann's criterion; the Dirichlet function; monotone functions are integrable (proof); uniform continuity (the Heine–Cantor result is given as a sketch); continuous functions are integrable; proof of FTC Part 1.

**Questions** (`questions/r2-calc-h1.yaml`, calc-h1-r2-h01 to h56): 14 per lesson.
- 32 four-choice multiple choice, with answer positions 2/2/2/2 in each lesson.
- 24 other types (43%): 8 text, 4 select-all, 4 order, 4 match, 4 label (on the four blank SVGs).
- `module_quiz: true` on 20 questions (5 per lesson). Together they cover all 8 topics of the module.

**Pictures**: 4 original SVGs, each with a `-blank.svg` copy for its label question. All are under 8 KB and use the palette fills. I previewed each one as a PNG, and checked the blank copies with `--markers`. The 3 Mermaid diagrams and 2 plots were also rendered and inspected.

**Drills** (`drills/r2-calc-h1.yaml`): the 7 listed in the table above.

**Glossary** (`glossary-r2-calc-h1.yaml`): 22 terms:
- real analysis, limit of a sequence, subsequence;
- upper bound, lower bound, least upper bound (alias supremum), greatest lower bound (alias infimum), completeness axiom, Archimedean property, monotone convergence theorem, nested interval property, Bolzano–Weierstrass theorem, Cauchy sequence;
- sequential criterion;
- partition, upper sum, lower sum, refinement, lower integral, upper integral, Riemann's criterion, uniformly continuous.

Two terms are bolded in my lessons but defined only in `glossary-r2-calc-m1.yaml`, so I added no duplicate entry: **triangle inequality** and **Dirichlet function**. I didn't bold "ε–N definition", because calc-m1's entry is worded for $x \to \infty$; lesson 90 bolds **limit of a sequence** instead. The checker confirmed that none of my terms or aliases duplicates any `glossary*.yaml` in the course.

**Cards** (`cards-r2-calc-h1.yaml`): 38 in total (10 / 10 / 8 / 10 by lesson).

## Verification

- Every numeric key, example and figure value was recomputed in Python or sympy. This includes:
  - Lesson 90 Example 2: the smallest valid cutoff for ε = 0.001 is really after n = 260;
  - the bisection table;
  - the values of $\sqrt{2 + a_n}$;
  - U and L in Example 1;
  - n = 801 in Example 2.
- Each distractor was checked to be wrong. Every order question was checked for exactly one valid order.
- Drills: 300 seeded instances of each (2,100 in all) were generated with `generate()` on the built JSON. `/tmp/r2-calc-h1/gen/vd.py` re-solved each one from the prompt text alone, using exact fractions and brute-force searches for cutoffs: 0 mismatches. Correct typed forms were accepted in every instance (exact fractions, and decimals at the precision the prompt asks for). Off-by-one cutoffs and swapped sup/inf were rejected.

## For a reviewer to double-check

- **Overlap with other writers.** Several honors lessons were written at the same time as this module: 05h1 and 05h2 (calc-m1) and 25h2 (calc-m6). My cross-references name them as "the Module 1 honors lesson on precise limits", "the Module 1 honors lesson on the IVT" and "the Module 6 honors lesson 'From sums to integrals and back'". Lesson 91 quotes 05h2 word for word ("is really a statement that the real line has no holes"). If those lessons are renamed or that sentence changes, these references need to be updated.
- **Glossary entries owned by calc-m1.** Lesson 90 bolds **triangle inequality**, and lesson 93 bolds **Dirichlet function**. Both link to calc-m1's glossary entries. If calc-m1 drops either entry, it should move to `glossary-r2-calc-h1.yaml`.
- **Labeled simplifications.**
  - Completeness is taken as an axiom.
  - The equivalence of the Darboux and Riemann-sum definitions is stated without proof.
  - Heine–Cantor (continuous on [a, b] ⇒ uniformly continuous) is given as a sketch.
  - The converse direction of the sequential criterion and the ∞/∞ details are stated, not proved.
- **History** (hedged in the text):
  - Bolzano used a halving argument in 1817, and Weierstrass made the theorem standard "decades later".
  - Dedekind and Cantor constructed the reals "in the 1870s".
  - Riemann gave his definition "in the 1850s" (1854), and the upper and lower sums are "usually credited to" Darboux in the 1870s (1875).
  - Lebesgue's integral dates from "around 1902".
- **Drill leniency.** In calc-h1-r2-sup-inf, the prompt asks for exact values, but the app also accepts the 2-decimal value it displays (for example 4.33 for 13/3). That is the app's normal behavior. The other drills show answers at the precision they ask for (calc-h1-r2-recursive-limit shows $a_3$ to 3 decimals).
- **Drill display.** In calc-h1-r2-upper-lower, the sum limit is written `^{\,{imax}}` because the app strips a plain `^{1}`.

## Errors found in existing content

None. I read the core lessons 04, 05, 17, 22, 23 and 40 and the honors lessons listed above. I edited no existing or shared files.

## Sources

- The theorems and definitions are standard results of introductory real analysis. All explanations, examples and questions are original.
- I did not fetch the historical dates during this round. They are well known, but a reviewer may want to spot-check them:
  - Bolzano's 1817 paper;
  - Dedekind's 1872 *Stetigkeit und irrationale Zahlen*;
  - Riemann's 1854 Habilitationsschrift;
  - Darboux's 1875 paper on discontinuous functions;
  - Lebesgue's 1902 thesis.
