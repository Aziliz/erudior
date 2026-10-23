# NOTES2-a1-h1: Honors module a1-h1, Algebraic reasoning and modeling

`content/math/check-module.sh algebra1 a1-h1`: build and checker report **zero problems** (4 lessons, 60 questions, 10 drills, 37 cards).

## What was added

**Lessons** (module `a1-h1`, which is already `honors: true` in course.yaml):

| File | Id | Title | Min | Prose words* | Worked examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| 90-algebraic-proof.md | a1-h1-proof | Proving it with algebra | 45 | ~2,150 | 6 (odd + odd; three consecutive integers; digit reversal; odd squares are 8m + 1; x² − y² ≠ 2 by contradiction; 6x + 9y = 100 has no integer solutions) + the broken "2 = 1" proof | a1-h1-squares-gnomon.svg (dot picture of (n+1)² − n² = 2n + 1); Mermaid "is the claim always true?" chart | a1-h1-r2-consecutive-sum, a1-h1-r2-digit-reverse |
| 91-equivalence-extraneous.md | a1-h1-equivalence | Reasoning about solving: equivalence and extraneous solutions | 45 | ~1,550 | 4 (x² = 5x loses 0; √(x+6) = x; √(x−3) + 5 = x; abs(2x − 1) = x − 5) + x/(x−2) = 2/(x−2) | plot of √(x+6) with y = x and y = −x; Mermaid radical-equation procedure | a1-h1-r2-radical-eq, a1-h1-r2-radical-isolate |
| 92-modeling-cycle.md | a1-h1-modeling | The modeling cycle | 50 | ~1,560 | 3 (60 mi/h to 88 ft/s and reaction distance; Fermi estimate of shower water with sensitivity; coffee cooling: first model fails validation, revised to T = 20 + 70(1/2)^(t/10)) | a1-h1-modeling-cycle.svg; Mermaid "which family of function?" chart; plot of both coffee models with data | a1-h1-r2-unit-convert, a1-h1-r2-cooling, a1-h1-r2-fermi |
| 93-recursive-models.md | a1-h1-recursive | Recursive models: multiply, then add | 45 | ~1,400 | 3 (repeated doses table; explicit formula and "within 1 mg"; monthly savings via the equilibrium) + fish-pond unstable equilibrium in text | a1-h1-dose-tank.svg; plot of dose levels; plot of fish populations diverging; Mermaid stability chart | a1-h1-r2-iterate, a1-h1-r2-equilibrium, a1-h1-r2-savings |

*Prose without figure/Mermaid source; tables and alt text included.

Each lesson has an intro tying back to core lessons (1, 3, 4, 5, 7, 12, 13, 19, 21, 26, 28, 30, 32, 36), "Common mistakes" and "Key points". The module is cross-cutting: proof (90) feeds the equivalence argument (91) and the equilibrium proof (93); the modeling cycle (92) introduces the shifted exponential y = L + a·bˣ that reappears as the explicit formula in 93.

**Questions** (`questions/r2-a1-h1.yaml`, a1-h1-r2-h01 to h60): 15 per lesson, 60 total.
- 36 four-choice MC, correct positions 9 / 9 / 9 / 9.
- 24 other types (40%): 9 text, 4 select-all, 4 order, 4 match, 3 label (gnomon picture, modeling cycle, dose tank).
- `module_quiz: true` on 20 (5 per lesson), covering general forms, conjecture vs proof, counterexamples, broken proofs, non-reversible steps, radical equations, validation, units, model families, the recursive rule, equilibrium and stability.

**Pictures** (original, 1–3 KB each, previewed): a1-h1-squares-gnomon.svg (+ -blank), a1-h1-modeling-cycle.svg (+ -blank), a1-h1-dose-tank.svg (+ -blank). **Mermaid**: 4. **Plots**: 4.

**Drills** (`drills/r2-a1-h1.yaml`, 10): consecutive-sum, digit-reverse, radical-eq (two boxes: solution and extraneous candidate), radical-isolate, unit-convert, cooling (nearest tenth, tolerance 0.051), fermi, iterate (three boxes), equilibrium (includes r > 1 with negative d), savings (nearest cent, tolerance 0.011). Each generated 1,500 times with tsx (`generate` + `checkAll` on the built JSON) against an independent calculation (brute-force integer search for the radical equations, direct iteration for the savings balance): every rounded correct answer accepted, a wrong answer (+1) rejected, text scanned for "+ -", unfilled placeholders and long decimals. 0 failures.

**Glossary** (`glossary-r2-a1-h1.yaml`): 21 terms: conjecture, counterexample, proof, even number, odd number, divisible, direct proof, reversible step, radical equation, extraneous solution, mathematical model, modeling cycle, assumption, dimensional analysis, conversion factor, Fermi estimate, Newton's law of cooling, recursive model, equilibrium, stable equilibrium, unstable equilibrium. Checked against every glossary*.yaml in the course: no duplicate terms or aliases. Lesson 90 also bolds **proof by contradiction**, which is defined in `glossary-r2-a1-m7.yaml` (I removed my own entry to avoid a duplicate), and the existing core terms **identity** and **equivalent equations**.

**Cards** (`cards-r2-a1-h1.yaml`): 37 (11 / 9 / 9 / 8 by lesson), topics Algebraic proof, Equivalence and extraneous solutions, The modeling cycle, Recursive models.

## For a reviewer to double-check

- **Overlap with other writers' honors lessons.** Two core-module writers (alg-m1 `05h1`, a1-m7 `32h1`) prove √2 irrational, so lesson 90 does not; its contradiction examples are x² − y² = 2 and 6x + 9y = 100 instead. Lesson 28 already sketches "rational + irrational is irrational", so that was left out too. Lesson 91's short absolute-value section (abs(2x − 1) = x − 5) overlaps alg-m2's `07h1-abs-cases`; it is kept brief and framed as an equivalence (hidden condition B ≥ 0) example. a1-m7's `32h3-series` covers geometric series; lesson 93 reaches the savings balance through the equilibrium instead, so the two approaches complement each other.
- **Glossary dependency:** if `glossary-r2-a1-m7.yaml` drops "proof by contradiction", lesson 90 needs its own entry. If alg-m1 later adds "even"/"odd" entries with aliases "even number"/"odd number", one side must drop them.
- **History:** Euler and n² + n + 41 ("in the 1700s"; his 1772 letter). Fermi is credited with the estimation style, no specific story told.
- **Simplifications, labeled in the text:** the medicine model tracks only the amount just after each dose; Newton's law of cooling is called an approximation; the fish model notes real populations can't grow forever. The coffee data are made up but generated from the revised model and rounded (model 69.5 / 44.7 / 37.5 vs data 70 / 45 / 37).
- **Facts:** US new showerheads limited to 2.5 gal/min (Energy Policy Act of 1992); NBA court 94 ft; a 1.5 s reaction time at 60 mi/h covers 132 ft.
- Savings drill uses "interest, then deposit" (ordinary annuity), matching lesson 93 Example 3: B₂₄ = 20,000(1.005²⁴ − 1) ≈ \$2,543.20.

## Errors found in existing content

None. Core lessons 1, 3, 4, 7, 21, 28, 30, 32 and 36 were read for overlap and cross-references.

## Sources

- Common Core State Standards for Mathematics, Modeling (the modeling cycle: formulate, compute, interpret, validate, report) and A-REI.1–2 (explaining solving steps; extraneous solutions of radical equations).
- OpenStax *Intermediate Algebra 2e* (solving radical equations, checking for extraneous solutions) and *College Algebra 2e* (Newton's law of cooling as a shifted exponential model).
- OpenStax *Elementary Algebra 2e*, unit conversion with conversion factors.
- Euler's prime-generating polynomial n² + n + 41 (fails at n = 40: 1681 = 41²), standard number theory references.
- US Energy Policy Act of 1992 (showerhead maximum 2.5 gal/min at 80 psi).
- All numbers recomputed in Python (sympy for the radical equations, direct iteration for every recursive table, the coffee model values and the savings balance).
