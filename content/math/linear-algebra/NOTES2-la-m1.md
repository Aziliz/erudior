# Round 2 notes: la-m1 (Bridge: vectors, systems and matrices)

`content/math/check-module.sh linear-algebra la-m1`: build and checker report zero problems
(5 lessons, 77 questions, 12 drills, 37 cards).

## Added

**Honors lessons** (`honors: true`, `module: la-m1`)
- `lessons/03h1-vector-geometry.md`, `la-m1-h-vector-geometry`, "Honors: Proving geometry with
  vectors" (45 min, about 1,630 words without figure blocks). Points as position vectors, midpoint
  and section formulas ($\frac{n\mathbf{a} + m\mathbf{b}}{m+n}$, weights add to 1), lines
  $\mathbf{p} + t\mathbf{d}$, parallel vectors and the collinearity test, a proof-strategy chart,
  then vector proofs of the midsegment theorem, parallelogram diagonals bisecting (and
  $\mathbf{d} = \mathbf{a} + \mathbf{c} - \mathbf{b}$), concurrent medians / centroid, and
  Varignon's theorem. Short history note (Hamilton 1843, Grassmann 1844, Gibbs and Heaviside in
  the 1880s). Examples: 2:1 section point, collinearity test, centroid of (1,1),(7,3),(4,8),
  Varignon proof with a numeric check.
- `lessons/03h2-leontief.md`, `la-m1-h-leontief`, "Honors: The Leontief input–output model"
  (45 min, about 1,710 words). Consumption matrix (column convention, $c_{ij}$ = sector $i$'s
  output per unit of sector $j$), intermediate and final demand, $(I - C)\mathbf{x} = \mathbf{d}$
  solved with the 2×2 inverse, reading columns of the Leontief inverse (multipliers), effect of a
  demand change, rounds of production $\mathbf{d} + C\mathbf{d} + C^2\mathbf{d} + \cdots$ with a
  proof sketch (column sums < 1 shrink each round; labeled as an idea, not a full proof), the
  productive condition (labeled sufficient, not necessary), a non-productive example with a
  negative inverse, and a 3-sector problem solved by elimination. History: Wassily Leontief
  (1905–1999), 1973 Nobel Memorial Prize in Economic Sciences.

**Core lessons** (additions only; nothing rewritten)
- 01-plane-vectors: SVG `la-m1-vector-parts.svg` (tail, head, components, length, angle) with an
  intro sentence; a ```plot of multiples of v = (2, 1) (v, 2v, −v, 0.5v) with an intro sentence.
- 02-elimination: Mermaid flowchart of 3×3 elimination with the three outcomes; SVG
  `la-m1-three-cases.svg` (one / no / infinitely many solutions as line pictures).
- 03-matrix-arithmetic: SVG `la-m1-row-col.svg` (row 2 of A times column 1 of B gives entry (2,1),
  with the computation); Mermaid "is A + B / AB defined?" chart; Mermaid 2×2 inverse routine.

**Pictures** (10 SVGs, original, 0.9–2.8 KB, previewed; markers checked on every `-blank`):
la-m1-vector-parts(+blank), la-m1-three-cases(+blank), la-m1-row-col(+blank),
la-m1-h-centroid(+blank), la-m1-h-leontief(+blank).

**Diagrams** (5 Mermaid, `flowchart TD`, accTitle/accDescr, all rendered): elimination outcomes
(02), defined-or-not (03), 2×2 inverse (03), vector-proof strategy (03h1), Leontief procedure
(03h2). Honors lessons also have figures: section-point plot and Varignon shape (03h1), the
rounds-of-production bar plot (03h2).

**Questions** (41, `questions/r2-la-m1.yaml`)
- Core q01–q15, 5 per lesson. Lesson 01: text q01, label q02, select-all q03, match q04,
  order q05. Lesson 02: text q06, label q07, order q08, select-all q09, match q10. Lesson 03:
  text q11, q15, label q12, select-all q13, order q14. module_quiz: q01, q02, q06, q07, q11, q14.
- Honors 03h1 h01–h13: MC 7, text 2 (h03, h13), select-all h05, order h07, label h08, match h09.
- Honors 03h2 h14–h26: MC 6, text 3 (h15, h22, h26), select-all h17, order h18, match h19,
  label h20.
- No module_quiz on honors questions. MC answer positions 0/1/2/3 = 4/3/3/3.

**Drills** (5, `drills/r2-la-m1.yaml`): `la-m1-r2-section`, `la-m1-r2-centroid`,
`la-m1-r2-parallelogram` (fraction answers) for 03h1; `la-m1-r2-leontief-solve` (integer
production from tenths-valued C) and `la-m1-r2-leontief-change` (Δx = k × column of the
Leontief inverse, exact or 2 dp, tolerance 0.006) for 03h2. Each generated 2,000 times with
`generate()` + `checkAll()` against an independent calculation (exact integer/fraction
arithmetic; the Leontief prompt's d was parsed back and re-solved): every correct answer
accepted (exact fraction, shown answer, and 2-dp rounding where offered), a typical wrong answer
rejected, no unfilled placeholders or "+ -" in the text. 0 failures.

**Glossary** (`glossary-r2-la-m1.yaml`, 14 terms): midpoint formula, section formula, direction
vector, collinear, midsegment, median, centroid; input–output model, consumption matrix,
production vector, intermediate demand, final demand, Leontief inverse, productive. Checked
against every `glossary*.yaml` in the course: no duplicate terms or aliases.

**Cards** (`cards-r2-la-m1.yaml`, 20): 10 for 03h1, 10 for 03h2.

## For a reviewer
- Topic change: I first wrote 03h2 on conditioning, round-off and partial pivoting, then found
  the la-m2 writer's `07h2-cost-accuracy.md` (and la-m5's `18h1-pivoting-ldu.md`) cover the same
  ground, with clashing glossary terms. I deleted my version (its lesson, questions, drills,
  glossary and cards) and replaced it with the Leontief model, which nothing else in the course
  covers.
- 03h1 overlaps lightly with la-m3's `11h1-affine-convex.md` (both mention that weights adding to
  1 give points on a line). 03h1 stays with plane geometry and doesn't use the term "affine".
- The Leontief lesson uses the column convention ($c_{ij}$ = input from sector $i$ per unit of
  sector $j$), as most linear algebra texts do; some economics texts present tables the other way.
- The proof that column sums < 1 make the series converge is a sketch (labeled as one); it uses
  "each round is at most half the last" for the worked $C$ (max column sum 0.5).
- Lesson 01 already bolds **components**; the new sentence doesn't bold it again.
- Label markers in `la-m1-row-col-blank.svg` sit on the highlight boxes' edges so they don't hide
  the numbers.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard results (section formula, midsegment, centroid, Varignon, Leontief open model and the
Neumann-series argument) checked against my own derivations; every number in the lessons,
questions and drills was recomputed with sympy or exact arithmetic. Dates: Hamilton's quaternions
(1843), Grassmann's *Ausdehnungslehre* (1844), Gibbs and Heaviside's vector analysis (1880s),
Varignon (1654–1722), Leontief (1905–1999) and his 1973 Nobel Memorial Prize, from general
reference knowledge (not fetched this round); worth a quick check.
