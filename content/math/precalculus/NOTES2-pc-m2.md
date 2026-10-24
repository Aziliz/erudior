# Round 2 notes: module pc-m2 (Parent functions, transformations and inverses)

`content/math/check-module.sh precalculus pc-m2`: build and checker report zero problems
(6 lessons, 97 questions, 12 drills, 43 cards).

## Added

**Honors lessons** (both `honors: true`, `module: pc-m2`)
- `lessons/07h1-symmetry.md`, pc-m2-h-symmetry, "Symmetry beyond even and odd" (45 min, ~2,100 words):
  symmetry about $x = a$ and about a point $(a, b)$ via shifting to the origin; why a parabola's axis
  is $-b/2a$; every cubic has a center of symmetry at $x = -B/3A$ (proof); centers of shifted
  reciprocal functions; parity of sums, products and compositions; even/odd decomposition with
  existence and uniqueness proofs; $f(|x|)$ vs $|f(x)|$. Four worked examples, two plots, one SVG.
- `lessons/07h2-composition-algebra.md`, pc-m2-h-composition-algebra, "The algebra of composition,
  inverses and iteration" (50 min, ~2,000 words): associativity, identity function, $(f \circ g)^{-1} =
  g^{-1} \circ f^{-1}$ with proof, inverse of $a f(b(x-h)) + k$, linear fractional functions and their
  swap-and-negate inverse (matrix connection noted as a preview), involutions, iteration, fixed
  points, cobweb diagrams, exact convergence rule for linear maps (the curved case is labeled a
  calculus preview), and when $f$ and $f^{-1}$ can meet off $y = x$. Five worked examples.

**Core lessons 04–07** (additions only, nothing rewritten)
- 04: parent-function gallery (SVG) with an intro sentence; even/odd/neither test (Mermaid).
- 05: four-panel transformations of $\sqrt{x}$ (SVG); step-by-step sketching procedure (Mermaid).
- 06: two-machine composition picture (SVG); domain-of-composition decision chart (Mermaid).
- 07: horizontal line test (```plot); finding-an-inverse procedure (Mermaid).

**Pictures** (11 original SVGs in `images/`, all under 31 KB, all rendered and checked, label
markers previewed): pc-m2-parent-gallery(+blank), pc-m2-transform-panels(+blank), pc-m2-machines,
pc-m2-inverse-mirror-blank, pc-m2-cubic-center(+blank), pc-m2-cobweb(+blank).
**Diagrams**: 5 Mermaid (4 core, 1 honors), all with accTitle/accDescr, all rendered.

**Questions** (`questions/r2-pc-m2.yaml`, 49)
- Core pc-m2-r2-q01…q19 (19; 4–5 per lesson): label 3 (q01, q06, q15), text 4 (q02, q07, q11, q16),
  match 4 (q03, q10, q14, q19), order 4 (q05, q08, q12, q17), select-all 4 (q04, q09, q13, q18).
  module_quiz: q01, q03, q06, q09, q13, q15, q17. Lesson 06 has no label question (its machine
  picture is too simple to label meaningfully).
- Honors pc-m2-r2-h01…h15 (symmetry, 15) and h16…h30 (composition algebra, 15): 18 MC, 4 text,
  2 match, 2 order, 2 select-all, 2 label. MC answer positions 0: 4, 1: 4, 2: 5, 3: 5.

**Drills** (`drills/r2-pc-m2.yaml`, 4): pc-m2-r2-cubic-center, pc-m2-r2-even-odd-parts (honors 1);
pc-m2-r2-lft-inverse (expression answer), pc-m2-r2-fixed-point (honors 2).

**Glossary** (`glossary-r2-pc-m2.yaml`, 10, checked against every glossary*.yaml, no duplicates):
point symmetry, center of symmetry, even part, odd part, identity function, linear fractional
function, involution, iteration, fixed point, cobweb diagram. ("axis of symmetry", also bolded, already exists.)

**Cards** (`cards-r2-pc-m2.yaml`, 20): 10 per honors lesson.

## For the reviewer
- All numbers were recomputed in Python/sympy (centers, decompositions, inverses, involution
  check, iterates of $\sqrt{x+6}$ from $-5$, $x_3$ values, intersections of $-x^3$ and its inverse).
- 07h1 mentions cosh/sinh by name only (not bolded, no glossary entry) to avoid clashing with
  other writers.
- 07h2 states the matrix correspondence for linear fractional functions without proof (checked on
  one example); the slope rule for nonlinear fixed points is labeled a calculus preview.
- Order questions were checked for a single valid order (q08 and q05 use distinct values; q12 and
  h25 carry intermediate numbers or a forced reverse chain).

## Errors found in existing content
None.

## Sources
Standard precalculus results (symmetry tests, even/odd decomposition, inverses of compositions,
linear fractional maps, fixed-point iteration); all explanations, examples and figures are original.
