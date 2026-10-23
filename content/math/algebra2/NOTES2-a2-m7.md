# Algebra 2 module a2-m7 (Sequences and series), round 2: writer notes

## Added

**Honors lessons (2)**
- `lessons/24h1-finite-differences.md` (a2-m7-h-differences, "Finite differences and sums of powers", 45 min, about 1,700 words of prose): difference tables, why constant second differences mean a quadratic (first difference $2An + A + B$; $m$th differences $= m!\,A$), fitting a quadratic (take $A$, subtract $An^2$, read the linear part), the warning that a few terms never prove a pattern (circle regions 1, 2, 4, 8, 16, 31), sigma rules, $\sum k^2$ and $\sum k^3$, a telescoping derivation of $\sum k^2$, sums over a range, and $\sum 1/(k(k+1)) = n/(n+1)$. 6 worked examples, 1 plot, 1 Mermaid chart, 1 table.
- `lessons/24h2-recurrences-loans.md` (a2-m7-h-loans, "Recurrences, savings plans and loans", 50 min, about 1,650 words): $a_n = ra_{n-1} + c$, fixed point $L = c/(1-r)$, $a_n - L$ geometric, attracting vs repelling ($r = -1$ case noted), medication steady state (labeled as a simplified model), a harvested fish pond that collapses, future value of an annuity derived as a geometric series, the loan balance recurrence and payment formula, an amortization schedule and the balance after $k$ payments. 5 worked examples, 2 plots, 1 Mermaid chart, 1 table.

**Core lessons (additions only)**
- 23-arithmetic-sequences: staircase picture (`images/a2-m7-staircase.svg`) with two intro sentences after the sum formula; new short section "Choosing a formula" with a Mermaid procedure chart (check differences → find $a_1$, $d$ → term / which term / sum).
- 24-geometric-sequences: halving-square picture (`images/a2-m7-halving.svg`) with a short paragraph after the "walk to a wall" paragraph; new short section "Choosing a formula" with a Mermaid decision chart (arithmetic / geometric / neither, finite vs infinite sum, $|r| < 1$).

**Questions (`questions/r2-a2-m7.yaml`, 40)**
- Core a2-m7-r2-q01–q12 (6 per lesson): 4 text, 2 order, 2 match, 2 select-all, 2 label. `module_quiz: true` on q01, q03 (lesson 23) and q09, q12 (lesson 24).
- Honors a2-m7-r2-h01–h14 (24h1): 8 multiple choice, 3 text, 1 select-all, 1 order, 1 match.
- Honors a2-m7-r2-h15–h28 (24h2): 8 multiple choice, 3 text, 1 select-all, 1 order, 1 match.
- Answer positions of the 16 single-answer honors questions: 4 at each index.

**Pictures (4 SVGs, original)**: a2-m7-staircase (+ -blank) and a2-m7-halving (+ -blank); blanks used by label questions q04 and q10. All rendered with preview-figure.mjs, markers checked.

**Mermaid diagrams (4)**: arithmetic-sequence procedure (23), formula decision chart (24), finite-difference method (24h1), behaviour of $a_n = ra_{n-1} + c$ (24h2). All rendered and checked; edge labels avoid ">" (it was dropped in rendering, so the chart says "more than 1").

**Drills (`drills/r2-a2-m7.yaml`, 6)**: a2-m7-r2-quadratic-seq (expression answer in $n$), a2-m7-r2-power-sum, a2-m7-r2-power-range (24h1); a2-m7-r2-fixed-point (2 dp, tolerance 0.006), a2-m7-r2-annuity-fv (nearest dollar, tolerance 1), a2-m7-r2-loan-payment (payment to the cent, tolerance 0.01; interest to the dollar, tolerance 1, which also accepts interest computed from the rounded payment) (24h2). 300 instances of each were generated with `generate()` and every answer recomputed independently in Python (sums by brute force, recurrences and loan balances by iterating month by month): all passed. Solutions keep comma-formatted numbers out of math (`dp0`), and money values out of lines whose math could pair with them.

**Glossary (`glossary-r2-a2-m7.yaml`, 10)**: finite differences, first differences, second differences, difference table, recurrence relation, fixed point (alias equilibrium), annuity, future value (alias FV), amortized loan, amortization schedule. All glossary files checked for duplicates before and after (none).

**Cards (`cards-r2-a2-m7.yaml`, 19)**: 10 for 24h1, 9 for 24h2.

`content/math/check-module.sh algebra2 a2-m7`: OK, zero problems (4 lessons, 63 questions, 12 drills).

## For a reviewer
- **telescoping sum**: 24h1 bolds it, but the a2-m5 writer's honors lesson 19h2 (partial fractions) bolds it first and teaches the same $\sum 1/(k(k+1))$ example, so I did not add a glossary entry (to avoid a duplicate). When I finished, no a2-m5 glossary-r2 file existed yet. If a2-m5 ends up without a "telescoping sum" entry, add one. 24h1 points to 19h2 in one sentence. For the same reason I replaced my planned telescoping drill with a "sum of powers over a range" drill (a2-m5-r2-telescope already practices telescoping).
- 24h2 uses $a_0$ (value at time 0) for the fish pond and the loans, while the course convention is sequences from $n = 1$. The switch is stated in the lesson and in Common mistakes.
- The medication example (30% left each day) and the fish pond are simplified models, labeled as such.
- Loan example: payment 463.99 dollars, total interest about 3,839 (computed from the unrounded payment: 3,839.23; from 60 × 463.99: 3,839.40). The schedule rows use the rounded payment.
- The "circle regions" sequence (1, 2, 4, 8, 16, 31) assumes no three chords meet at one interior point; the lesson says so.

## Errors found in existing content
None. The existing a2-m7 questions, drills, cards and glossary entries were rechecked; no edits.

## Sources
Standard results, checked by computation (Python, exact fractions): sum-of-powers formulas, finite differences of polynomials, the circle-regions count $\binom n4 + \binom n2 + 1$, the annuity future value and amortized-loan payment formulas (standard in OpenStax Precalculus / College Algebra sequences and series chapters and in introductory finance texts). Every number in the lessons, questions and explanations was recomputed (`/tmp/r2-a2-m7/calc.py`, now deleted).
