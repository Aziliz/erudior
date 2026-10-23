# Round 2 notes: module a2-m3 (Polynomial functions)

`content/math/check-module.sh algebra2 a2-m3`: build and checker report zero problems
(5 lessons, 76 questions, 12 drills, 34 cards).

## Added

**Honors lessons** (both `honors: true`, `module: a2-m3`, 45 min, links `alg-ref-functions`)
- `lessons/12h1-locating-zeros.md` (a2-m3-h-locating-zeros), "Locating real zeros with Descartes'
  rule of signs, bounds and bisection", about 2,100 words including tables. Sign changes,
  Descartes' rule (with the parity argument for "less by an even number"), $f(-x)$ for negative
  zeros, the upper/lower bound test with a proof of the upper-bound case and a note that a failed
  test proves nothing, the bisection method and how many steps it needs. 4 examples: a table of
  possible zero counts for a quintic; exactly one positive zero for $x^5 + 2x^2 - 7$; bounds,
  Descartes and sign changes combined for $x^4 - x^3 - 3x^2 + 2x - 6$; 7 bisection steps for
  $x^3 - x - 1$ (the zero from the core IVT section). Figures: bisection flowchart (Mermaid) and a
  plot of the first three intervals.
- `lessons/12h2-roots-coefficients.md` (a2-m3-h-roots-coefficients), "Roots and coefficients:
  Vieta's formulas and polynomial identities", about 1,800 words. Identity vs equation, the
  identity principle (degree ≤ n polynomials agreeing at n + 1 points are identical; proved from
  "at most n zeros"), comparing coefficients, Vieta's formulas for cubics derived by expanding, the
  general degree-n sum and product, symmetric expressions ($r^2 + s^2 + t^2$, sum of
  reciprocals), a negative sum of squares as a sign of non-real roots, Euclid's formula for
  Pythagorean triples. 6 examples. Figures: plot of $2x^3 - 5x^2 - 4x + 3$ with its zeros; a
  `shape` triangle for the 3-4-5 triple.

**Core lessons** (additions only; one or two introducing sentences each, nothing rewritten)
- 10-polynomial-functions: end-behavior 2×2 picture (SVG), "sketching from factored form"
  flowchart (Mermaid), labeled picture of $(x + 4)^2(x + 2)(x - 1)^3$ showing touch, simple
  crossing, flattened crossing, turning points (including the touch, which is also a local min)
  and y-intercept (SVG).
- 11-polynomial-division: labeled synthetic-division table for Example 3 (SVG); new short section
  "Choosing a method" with a decision flowchart (Mermaid): remainder only → evaluate $f(c)$;
  divisor $x - c$ → synthetic; otherwise long division.
- 12-rational-roots: "finding all zeros" loop flowchart (Mermaid); kinds-of-zeros tree
  (complex → real (rational / irrational) or non-real) (Mermaid).

**Pictures** (5 SVGs in `images/`, all original, 2–11 KB, rendered and checked):
a2-m3-end-behavior, a2-m3-graph-features, a2-m3-graph-features-blank, a2-m3-synthetic-parts,
a2-m3-synthetic-parts-blank. The blanks are for the two label questions; markers were placed from
the generator's coordinates and checked with `--markers`. Generator script:
`/tmp/r2-a2-m3/gen/svgs.py` (scratch).

**Diagrams** (5 Mermaid): sketching steps, division-method decision, finding-all-zeros loop,
kinds of zeros, bisection loop. All have accTitle/accDescr and were rendered.

**Questions** (`questions/r2-a2-m3.yaml`, 43 new)
- Core, a2-m3-r2-q01…q15 (5 per lesson): text 3 (q01, q08, q11), match 3 (q02, q10, q14),
  order 2 (q07, q12), select-all 4 (q03, q09, q13, q15), label 2 (q04, q06), MC 1 (q05).
  module_quiz: q02, q04 (lesson 10), q06, q08 (lesson 11), q12, q14 (lesson 12).
- Honors locating zeros, a2-m3-r2-h01…h14: 9 MC, 2 text, 1 select-all, 1 order, 1 match.
- Honors roots/coefficients, a2-m3-r2-h15…h28: 9 MC, 2 text, 2 select-all, 1 match.
- Answer positions of the 19 new 4-choice MC questions: 0: 4, 1: 5, 2: 6, 3: 4.

**Drills** (`drills/r2-a2-m3.yaml`, 6): a2-m3-r2-descartes, a2-m3-r2-upper-bound,
a2-m3-r2-bisection (lesson 12h1); a2-m3-r2-vieta, a2-m3-r2-symmetric, a2-m3-r2-missing-root
(lesson 12h2). I generated 400 instances of each from the built JSON with `generate()` and
recomputed every answer independently in Python (sign counts, synthetic-division bound search
with a monotonicity check, exact-fraction bisection, numpy roots for Vieta and symmetric sums,
sympy expansion for the missing root): 2,400 instances, 0 mismatches. Bisection endpoints show
with `num4` (e.g. 1.625) and fraction answers with `format: fraction`.

**Glossary** (`glossary-r2-a2-m3.yaml`, 12 terms, checked against every glossary file in the
course, no duplicates): Descartes' rule of signs, sign change, upper bound, lower bound, bound
test, bisection method, Vieta's formulas, polynomial identity, identity principle, comparing
coefficients, symmetric expression, Pythagorean triple. Every bolded term in the two honors
lessons links to an entry.

**Cards** (`cards-r2-a2-m3.yaml`, 20): 10 on locating zeros, 10 on Vieta's formulas and
identities (topics Locating real zeros, Vieta's formulas, Polynomial identities).

## For a reviewer to double-check
- History: Descartes stated the rule in *La Géométrie* (1637) without proof; Viète found cases of
  the root–coefficient relations in the late 1500s and Albert Girard stated the general pattern
  in 1629; Euclid's formula appears in *Elements* (Book X). The wording is cautious ("found cases
  of", "a version of it appears").
- The lesson only sketches why Descartes' rule holds: it proves the parity part and says the
  "at most" part takes real work. This is labeled.
- Bound test: the "0 may count as either sign" convention for the lower-bound row. I checked it
  with a sign argument (each term of $(x - c)q(x)$ has the same sign or is 0 for $x < c < 0$).
- Lesson 10's new picture: the double zero at −4 is also a local minimum, so the label question
  (q04) names marker 2 "Turning point (local maximum)" to avoid two right answers, and q05 asks
  for the count (3).
- a2-m3-r2-q15 notes in its explanation that real coefficients force only complex conjugates;
  $-\sqrt5$ would be forced only with rational coefficients (not taught in this course).

## Errors found in existing content
None. I re-read the module's 33 existing questions and 6 drills and found nothing to fix.

## Sources
Standard results (Descartes' rule of signs, upper and lower bound theorem, bisection method,
Vieta's formulas, Euclid's formula), stated in my own words and checked against my own algebra.
Every number in the lessons, questions and drills was recomputed with sympy/numpy.
