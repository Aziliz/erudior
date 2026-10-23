# Round 2 notes: la-m2 (Systems of linear equations)

`content/math/check-module.sh linear-algebra la-m2`: build and checker report zero problems
(6 lessons, 95 questions, 13 drills, 38 cards).

## Added

**Honors lessons** (`honors: true`, `module: la-m2`)
- `lessons/07h1-rref-unique.md`, `la-m2-h-rref-unique`, "Honors: Why the reduced echelon form is
  unique" (45 min, about 2,200 words counting math). Proves the theorem lesson 05 states without
  proof. Covers: echelon forms are not unique (two reductions of one matrix); invariants; column
  relations = solutions of the homogeneous system, hence kept by row operations (proof); reading
  relations from an RREF (pivot columns are $\mathbf{e}_k$, a non-pivot column lists its weights,
  a column is a pivot column iff it is not a combination of the columns to its left); the full
  proof; consequences (canonical form, pivot positions and number of pivots well defined, row
  equivalent iff same RREF, with proof). Examples: two echelon forms of
  $\begin{bmatrix} 3 & 6 & 3 \\ 1 & 4 & 5\end{bmatrix}$; relations in lesson 05's matrix $A$;
  a row-equivalence test ($P$, $Q$, and a one-entry change $Q'$); writing an RREF from column
  relations alone. Mermaid outline of the proof; short history note.
- `lessons/07h2-iterative-methods.md`, `la-m2-h-iterative`, "Honors: Iterative methods: Jacobi
  and Gauss–Seidel" (45 min, about 1,700 words). Covers sparse systems, direct vs iterative
  methods, the equilibrium-temperature (average of four neighbors) model, the Jacobi and
  Gauss–Seidel updates, sweeps, strict diagonal dominance and the convergence theorem (stated
  without proof, labeled), divergence and the cure by reordering equations, a Jacobi vs
  Gauss–Seidel error table, and when to use direct vs iterative methods (stopping rule labeled as
  a rule of thumb). Examples: a 4-unknown plate (solution 55, 60, 40, 45); Jacobi and
  Gauss–Seidel on $4x + y = 9$, $x + 3y = 5$; divergence on $x + 2y = 3$, $3x + y = 4$ and
  convergence after swapping. SVG plate picture and a Mermaid loop diagram.

**Core lessons** (additions only; nothing rewritten, each picture introduced by a sentence)
- 04-systems-row-operations: SVG `la-m2-planes.svg` (three planes seen edge-on: common line,
  tent, two parallel + third, three parallel) after the paragraph on how three planes meet;
  Mermaid diagram of a row operation and its reverse (why the solution set is kept).
- 05-row-reduction: SVG `la-m2-echelon.svg` (parts of an echelon form: leading entries, pivot
  columns shaded, columns without pivots, staircase, zero row); Mermaid flowchart of the row
  reduction algorithm (forward and backward phases).
- 06-existence-uniqueness: Mermaid decision chart (pivot in last column? free variables?) and a
  plot for Example 2 (h = 12 parallel lines vs h = 10 crossing at (2, 0)).
- 07-applications-systems: Mermaid modeling workflow; SVG `la-m2-network.svg` (a three-node
  network: nodes, branches, inflow and outflows), with its conservation equations in one added
  sentence. (The lesson already had a shape and a plot.)

**Pictures** (8 SVGs, original, 1.6–3.7 KB each, rendered and checked, label markers checked):
la-m2-planes, la-m2-planes-blank, la-m2-echelon, la-m2-echelon-blank, la-m2-network,
la-m2-network-blank, la-m2-h-plate, la-m2-h-plate-blank. The `-blank` files are for label
questions.

**Diagrams** (6 Mermaid, all with accTitle/accDescr, rendered): 04 row operation and its reverse
(`flowchart LR`, 2 boxes), 05 algorithm (TD), 06 decision chart (TD), 07 modeling workflow (TD),
07h1 proof outline (TD), 07h2 Gauss–Seidel loop (TD).

**Questions** (48, `questions/r2-la-m2.yaml`)
- Core, `la-m2-r2-q01`…`q20` (5 per lesson). Lesson 04: text q01, order q02, match q03,
  select-all q04, label q05. Lesson 05: label q06, order q07, text q08, select-all q09, match q10.
  Lesson 06: text q11 and q15, match q12, order q13, select-all q14. Lesson 07: label q16, text
  q17, order q18, match q19, select-all q20. module_quiz: q01, q05, q06, q09, q11, q15, q16.
- Honors 07h1, `h01`…`h14`: MC 8, text 2 (h03, h09), select-all 2 (h05, h12), order 1 (h06),
  match 1 (h07).
- Honors 07h2, `h15`…`h28`: MC 6, text 3 (h16, h24, h28), select-all 2 (h17, h27), label 1
  (h18), order 1 (h20), match 1 (h22).
- No module_quiz on honors questions. Answer positions of the 14 MC questions: 0/1/2/3 = 4/4/3/3.

**Drills** (4, `drills/r2-la-m2.yaml`): `la-m2-r2-col-relation` (rebuild column 3 of $A$ from its
first two columns and its RREF) and `la-m2-r2-relation-to-rref` (find the RREF entries from a
column relation) for 07h1; `la-m2-r2-jacobi` and `la-m2-r2-gauss-seidel` (one sweep on a strictly
diagonally dominant 2×2 system, integer results by construction) for 07h2. Each was generated
2,000 times with tsx (`generate()` + `checkAll()`) against an independent calculation: every
correct answer and every shown answer accepted, a wrong one rejected, no stray signs or unfilled
placeholders.

**Glossary** (`glossary-r2-la-m2.yaml`, 10 terms): invariant, column relation, canonical form
(07h1); sparse, direct method, iterative method, Jacobi method, sweep, Gauss–Seidel method,
strictly diagonally dominant (07h2). Checked against every `glossary*.yaml` in the course.

**Cards** (`cards-r2-la-m2.yaml`, 21): 10 on "Uniqueness of the RREF", 11 on "Iterative methods".

## For a reviewer to double-check
- Topic change: my first draft of the second honors lesson was on operation counts, partial
  pivoting and ill-conditioning. The la-m1 writer's `03h2-sensitive-systems.md` (and their
  glossary) and the la-m5 writer's `18h1-pivoting-ldu.md` already cover that, so I deleted my draft
  and wrote the iterative-methods lesson instead. Nothing from the draft remains. 07h2 refers to
  elimination's cost as "roughly $n^3/3$ multiplications", matching 03h2.
- 07h2 states the convergence theorem for strictly diagonally dominant matrices without proof,
  and notes that larger plate grids are only weakly dominant but still converge "by a stronger
  theorem beyond this course" (irreducible diagonal dominance). The "average of four neighbors"
  rule is labeled a simplified model (a discretization of the steady heat equation).
- The Jacobi/Gauss–Seidel error table (25, 12.5, 6.25, 3.13, 1.56 vs 25, 8.75, 2.19, 0.55, 0.14)
  was computed in Python from a start of all zeros. "Error halves / shrinks by about 4" is
  stated for this plate only.
- History: the Nine Chapters is dated "roughly two thousand years ago" (before about 200 CE, per
  Grcar); Yuster's proof of RREF uniqueness, *Mathematics Magazine*, 1984; Jacobi and Seidel as
  19th-century German mathematicians, with Gauss describing a similar method "in a letter decades
  before Seidel published his" (left without dates on purpose).
- 07h1 uses column vectors and "combination of columns", ideas the course formally develops in
  la-m3; the lesson defines what it needs ("column relation") in terms of homogeneous systems.
- Label markers: planes-blank in each panel under the drawing; echelon-blank on the row 2 pivot,
  above columns 4 and 2, beside the zero row, and on the zero below the first pivot;
  network-blank on node A, the A→B branch, the inflow and the outflow at B; plate-blank on the four
  interior points.

## Errors found in existing content
None. All existing la-m2 lessons, questions, drills, cards and glossary entries were read; nothing
was edited.

## Sources
Standard linear algebra (row reduction, reduced echelon form, Jacobi and Gauss–Seidel methods,
convergence for strictly diagonally dominant matrices). T. Yuster, "The Reduced Row Echelon Form
of a Matrix Is Unique: A Simple Proof", *Mathematics Magazine* 57 (1984). J. F. Grcar, "How
ordinary elimination became Gaussian elimination", *Historia Mathematica* (2011; arXiv:0907.2397).
All numbers were recomputed in Python/sympy.
