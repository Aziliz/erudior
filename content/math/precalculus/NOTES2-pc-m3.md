# Round 2 notes: module pc-m3 (Polynomial and rational functions)

`content/math/check-module.sh precalculus pc-m3`: build and checker report zero problems
(10 lessons, 154 questions, 24 drills, 55 cards). I ran it 13 times to catch rare random drill inputs.

## Added

**Honors lessons** (3; the module has 7 core lessons)
- `lessons/14h1-cubic-formula.md` (pc-m3-h-cubic-formula, "Solving cubics: Cardano's formula and the
  case for complex numbers", 45 min, ~1,960 words). Covers depressing a cubic ($x = t - b/3$, with the
  $p, q$ formulas), the $t = u + v$ derivation, and Cardano's formula. Gives the history: del Ferro,
  Fior, Tartaglia, Cardano's Ars Magna (1545), Ferrari, Bombelli (1572). Treats the irreducible case
  with Bombelli's $x^3 = 15x + 4$, explains what the sign of $D$ says (and how it relates to
  $\Delta = -4p^3 - 27q^2$), and closes with Abel–Ruffini and Galois. 3 worked examples, a Mermaid
  flowchart and a plot of Bombelli's cubic.
- `lessons/14h2-interpolation.md` (pc-m3-h-interpolation, "Polynomial interpolation: one curve through
  given points", 45 min, ~1,680 words). Covers existence and uniqueness (proved with the factor
  theorem), Lagrange basis polynomials, the Newton form and adding a point, Shamir secret sharing
  (labeled as simplified: real schemes work modulo a prime), and Runge's phenomenon. 3 worked
  examples, a plot of the basis polynomials, and a Runge plot (the exact degree-10 interpolant).
- `lessons/14h3-linear-fractional.md` (pc-m3-h-linear-fractional, "Linear fractional functions:
  every one is a transformed 1/x", 40 min, ~1,720 words). Shows that $(ax+b)/(cx+d) = v + k/(x-h)$
  (with a Mermaid chain of transformations) and covers the degenerate case $ad - bc = 0$, the center of
  symmetry $f(h+s) + f(h-s) = 2v$, how the asymptotes and center swap under the inverse, and the
  3-cycle $1/(1-x)$. The application is the thin-lens equation (labeled as a model; the usual sign
  convention for virtual images). 3 worked examples, a plot and a lens SVG.
  pc-m2's honors lesson 07h2 already teaches the inverse formula, involutions and the matrix link, so
  14h3 only recaps the formula, points to 7h2, and adds what is new (asymptotes and center swap).

**Core lessons** (additions only, each figure introduced by a sentence)
- 08: end-behavior SVG (four cases) after the table; Mermaid "what the graph does at a zero".
- 09: labeled synthetic-division SVG after Example 2; new short section "Which tool when", a Mermaid
  decision chart (long division / synthetic / remainder theorem / factor theorem).
- 10: Mermaid cycle of the powers of $i$; one paragraph and a plot showing multiplication by $i$
  as a quarter turn ($3 + i \to -1 + 3i \to -3 - i \to 1 - 3i$).
- 11: plot of Example 3's cubic (one real zero), and a Mermaid flowchart of the zero-finding strategy.
- 12: Mermaid "hole or vertical asymptote" chart; new short section "All the features on one graph"
  with a labeled SVG of $(2x^2+4x-6)/(x^2+4x+3)$.
- 13: Mermaid flowchart of the 7-step graphing routine; plot comparing $1/(x-3)$ and $1/(x-3)^2$.
- 14: Mermaid "is a critical value included?" chart; number lines for Examples 2 and 3.

**Pictures** (9 SVGs in `images/`, original, 1–20 KB, all rendered and checked, markers previewed):
pc-m3-end-behavior, pc-m3-end-behavior-blank (different curves in a different order),
pc-m3-synthetic-parts, pc-m3-synthetic-parts-blank (Example 4's numbers), pc-m3-complex-plane-blank,
pc-m3-rational-features, pc-m3-rational-features-blank (a different function), pc-m3-thin-lens,
pc-m3-thin-lens-blank.

**Diagrams**: 9 Mermaid diagrams (7 core, 2 honors), each with accTitle/accDescr, all rendered.
New figure blocks: 4 plots in the core lessons, 2 number lines, and 4 plots in the honors lessons.

**Questions** (69, `questions/r2-pc-m3.yaml`)
- Core: pc-m3-r2-q01…q31, 4–5 per lesson.
  - 08: label, text, match, select-all, order.
  - 09: label, text, match, select-all.
  - 10: label, text, match, select-all, order.
  - 11: order, text, select-all, match.
  - 12: label, text, match, select-all.
  - 13: match, text, select-all, MC.
  - 14: order, text, select-all, match, MC.
  - module_quiz: q01, q05, q06, q10, q15, q18, q19, q23, q24, q27 (1–2 per lesson).
- Honors:
  - 14h1: h01–h13 (8 MC, 2 text, 1 order, 1 match, 1 select-all).
  - 14h2: h14–h25 (7 MC, 2 text, 1 order, 1 match, 1 select-all).
  - 14h3: h26–h38 (7 MC, 2 text, 1 order, 1 match, 1 select-all, 1 label).
  - MC answer positions are balanced within each honors lesson.

**Drills** (9, `drills/r2-pc-m3.yaml`): pc-m3-r2-depress, -cardano-type, -cardano-root (14h1);
-lagrange, -newton-form, -secret (14h2); -lf-form, -lf-reflect, -lens (14h3).
- Each was generated 400 times through `generate()`, and every prompt was re-solved independently
  in sympy: 0 mismatches.
- Rounded answers: the 4-decimal answer has tolerance 0.0001; image distance (1 dp) has 0.06;
  magnification (2 dp) has 0.02, which covers working from a rounded $d_i$ ($d_o \ge 4$).
- Exact answers use `kind: fraction`, rounded to 9 places in calc. A float-zero answer once failed
  the checker; `val != 0` and rounding fixed it.

**Glossary** (11, `glossary-r2-pc-m3.yaml`): depressed cubic, Cardano's formula, casus irreducibilis,
discriminant of a cubic, polynomial interpolation, interpolating polynomial, Lagrange basis polynomial,
Newton form, secret sharing, Runge's phenomenon, focal length. I checked them against every
glossary*.yaml. "Linear fractional function" and "center of symmetry" already exist (pc-m2), so I
did not redefine them. Every bolded term in the honors lessons has an entry.

**Cards** (25, `cards-r2-pc-m3.yaml`): 9 for 14h1, 8 for 14h2, 8 for 14h3.

## For the reviewer
- History in 14h1 follows the standard account (dates given as "around" or by year). I hedged the
  contested details (the Tartaglia–Cardano promise) in the text. The claim that the irreducible case
  can't avoid complex numbers is given as "proved in the 1800s" (Wantzel 1843, Hölder 1891).
- In 14h1, D is defined with the opposite sign to the usual discriminant; the lesson states the relation $\Delta = -108D$.
- 14h3 cross-references "Honors Lesson 7h2" (pc-m2's 07h2-composition-algebra) and restates the
  inverse formula, so it still reads on its own.
- q03 and q23 are match questions with repeated answers (allowed: sorting into categories).

## Errors found in existing content
None in pc-m3's lessons, questions or drills. (PROGRESS.md's outline numbers lessons 8–13 without
the complex-numbers lesson; not changed, since PROGRESS.md is shared.)

## Sources
Standard results (Cardano's formula, the cubic discriminant, Lagrange and Newton interpolation, the
thin-lens equation), all re-derived and checked in sympy. History: MacTutor biographies of del Ferro,
Tartaglia, Cardano and Bombelli; A. Shamir, "How to share a secret", Communications of the ACM 22
(1979); C. Runge, Zeitschrift für Mathematik und Physik 46 (1901).
