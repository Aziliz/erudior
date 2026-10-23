# Round 2 notes: module alg-m4 (Systems of equations and inequalities)

`content/math/check-module.sh algebra1 alg-m4`: build and checker report zero problems
(6 lessons, 91 questions, 13 drills, 34 cards).

## Added

**Honors lessons** (`honors: true`, `module: alg-m4`)
- `lessons/17h1-cramer-determinants.md` (alg-m4-h-cramer, "Honors: Determinants and Cramer's rule",
  45 min, about 2,050 words incl. math): elimination done once with letters; the 2 × 2 determinant;
  $D$, $D_x$, $D_y$ and Cramer's rule; proof that $D \ne 0$ gives exactly one solution (including
  the substitution check $aD_x + bD_y = eD$) and that $D = 0$ means equal slopes (with the vertical
  case); telling none from infinitely many with $D_x$, $D_y$ (and the $0x + 0y = 1$ caveat);
  ill-conditioned systems; history (Nine Chapters, Seki 1683, Leibniz 1693, Cramer 1750) and why
  computers use elimination. Examples: Lesson 15's two systems redone by Cramer; parameter $k$ for a
  unique solution; $k, m$ for infinitely many; nearly parallel lines ($D = 0.1$).
- `lessons/17h2-linear-programming.md` (alg-m4-h-linear-programming, "Honors: Linear programming in
  depth", 45 min, about 1,950 words): level lines; which corner wins by comparing slopes;
  sensitivity range; ties along an edge; bounded vs unbounded regions (feed-mix minimization, no
  maximum); infeasible problems; whole-number answers (rounding the best corner is infeasible in the
  bakery example; a question shows rounding can also be feasible but not best); the whole procedure
  as a chart; history (Kantorovich 1939, Dantzig's simplex method 1947, 1975 Nobel Memorial Prize
  to Kantorovich and Koopmans).

**Core lessons 14–17**: additions only, each with an introducing sentence or two.
- 14: three-cases picture (SVG); substitution flowchart with the three possible endings (Mermaid).
- 15: plot showing that the sum of two equations (x = 1) passes through the intersection point;
  "which method when" decision chart (Mermaid).
- 16: word-problem routine (Mermaid); mixture beakers (SVG); break-even graph with loss and profit
  regions and fixed costs (SVG), with a short paragraph.
- 17: graphing-an-inequality flowchart (Mermaid); labeled feasible region (solid and dashed
  boundaries, open vertex, test point) (SVG), with a short paragraph.

**Pictures** (11 SVGs in `images/`, original, 2–7 KB each, white background, #1c2833 ink, text
≥ 14 px, all rendered and checked; blank copies rendered with their label markers):
alg-m4-three-cases(+blank), alg-m4-mixture, alg-m4-break-even(+blank), alg-m4-feasible-region(+blank),
alg-m4-cramer(+blank), alg-m4-feed-region(+blank).

**Diagrams** (6 Mermaid, all `flowchart TD`, all with accTitle/accDescr, all rendered): substitution
outcomes, which method when, word-problem routine, graphing an inequality, what the determinants
tell you, solving an LP problem (12 boxes). New ```plot figures: sum line (15), nearly parallel
lines, level lines, whole-number plan (honors).

**Questions** (48 new, `questions/r2-alg-m4.yaml`)
- Core alg-m4-r2-q01…q20, 5 per lesson: label 3 (q01, q11, q16), text 5 (q02, q06, q07, q12, q17),
  order 4 (q03, q08, q13, q18), match 4 (q05, q10, q15, q20), select-all 4 (q04, q09, q14, q19).
  module_quiz: q01, q04, q07, q09, q11, q12, q16, q19 (2 per lesson).
- Honors alg-m4-r2-h01…h14 (Cramer, 14): 8 MC, 2 text, 1 match, 1 order, 1 select-all, 1 label.
- Honors alg-m4-r2-h15…h28 (linear programming, 14): 8 MC, 2 text, 1 select-all, 1 match,
  1 label, 1 order.
- 16 four-choice MC answer positions: 0: 4, 1: 4, 2: 4, 3: 4.

**Drills** (5, `drills/r2-alg-m4.yaml`, each generated 2,000 times and checked against an
independent recomputation, including a brute-force grid search for the LP minimum and a check of
the sensitivity range at and beyond both ends): alg-m4-r2-determinant, alg-m4-r2-cramer (D, Dx,
Dy, x, y), alg-m4-r2-singular-k, alg-m4-r2-lp-min (unbounded region, minimum), alg-m4-r2-lp-range
(sensitivity range for $p$).

**Glossary** (11, `glossary-r2-alg-m4.yaml`; checked against every glossary*.yaml, no duplicate
terms or aliases): matrix, determinant, Cramer's rule, ill-conditioned, level line, sensitivity
analysis, bounded region, unbounded region, infeasible, integer programming, simplex method.

**Cards** (23, `cards-r2-alg-m4.yaml`): 4 core (method choice, why adding is allowed, fixed costs on
a break-even graph, open vertex), 10 Cramer, 9 linear programming.

## For the reviewer
- Label marker positions were computed by the script that drew the SVGs and checked on renders.
  In the feasible-region and feed-region label questions, markers 4/5 and 2 sit on the dots they
  name (the vertex, the test point, the optimal vertex) and cover them, as in Biology.
- The two plot figures in 17h2 with several point labels (level lines; whole-number plan) could not
  be previewed by eye with the preview script (it renders SVG/Mermaid only); the checker renders
  them without errors. Worth a look in the app for overlapping point labels near (1.8, 2.8) and (2, 3).
- 17h1 states the D = 0 classification for "genuine lines" (in each equation, x and y not both 0)
  and gives the counterexample; 17h2 states the LP existence theorem for unbounded regions without
  proof, labeled as such. The ill-conditioning section is labeled as a simplified picture
  (condition numbers come later). Integer programming: "check nearby whole-number points" is
  labeled as a practical shortcut, not a guarantee.
- History dates: Nine Chapters "compiled by about the first century CE" (dating is uncertain;
  phrased loosely); Seki 1683, Leibniz 1693 (letter), Cramer 1750; Kantorovich 1939, Dantzig 1947,
  Nobel 1975.

## Errors found in existing content
None. (PROGRESS.md's outline numbers lessons one lower than the files after Lesson 12, because
13-piecewise-functions.md was added later; not mine to edit.)

## Sources
- Mathematics: standard results (determinant, Cramer's rule, corner principle); every derivation,
  numeric answer, example and distractor recomputed in Python/sympy (script in my /tmp folder,
  deleted after use).
- History, confirmed by search this session: INFORMS biographical profile of George B. Dantzig
  (simplex method, 1947, U.S. Air Force planning); computer-museum.ru profile of L. V. Kantorovich
  (1939 work on production planning, plywood trust).
- History from standard references, not re-fetched this session (reviewer: please confirm against
  MacTutor and NobelPrize.org): Nine Chapters dating, Seki 1683, Leibniz 1693, Cramer 1750 (rule
  published in his book on algebraic curves), 1975 Nobel Memorial Prize to Kantorovich and Koopmans.
