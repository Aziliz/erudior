# Round 2 notes: module pc-m9 (Sequences, series, induction and counting)

`content/math/check-module.sh precalculus pc-m9`: build and checker report zero problems
(8 lessons, 122 questions, 21 drills, 54 cards).

## Added

**Honors lessons** (all `honors: true`, `module: pc-m9`, 45 min, topics new to the course)
- `lessons/40h1-recurrences.md` (pc-m9-h-recurrences), "Recurrence relations: from a rule to a
  formula", ~1,950 words: first-order linear recurrences $a_{n+1} = ra_n + c$, fixed point
  $L = c/(1-r)$ and $a_n = L + (a_0 - L)r^n$, attracting vs repelling; Tower of Hanoi; loan
  payment (\$10,000 at 1%/month, 36 months: \$332.14); second-order recurrences,
  characteristic equation, distinct and (stated) repeated roots; Fibonacci, golden ratio,
  Binet's formula, rounding $\varphi^n/\sqrt5$; domino tilings of a 2 × n strip.
  Examples 1–5. Plot, Mermaid chart, tilings SVG.
- `lessons/40h2-counting-techniques.md` (pc-m9-h-counting), "Counting techniques: repetition,
  overlaps and pigeons", ~1,650 words: multinomial coefficients (MISSISSIPPI), grid paths,
  stars and bars, inclusion–exclusion for three sets (1–1000 divisible by 2, 3 or 5: 734),
  derangements via inclusion–exclusion ($D_4 = 9$, $D_n/n! \to 1/e$), pigeonhole principle.
  Examples 1–6. Grid-path shape figure, stars-and-bars SVG, three-set Venn SVG.
- `lessons/40h3-binomial-probability.md` (pc-m9-h-binomial-probability), "Repeated trials:
  binomial probability and expected value", ~1,500 words: binomial setting, derivation of
  $\binom nk p^kq^{n-k}$, sum to 1 via the binomial theorem, at-least problems, random
  variables and expected value, fair games (raffle, American roulette), $E(X) = np$ by
  indicators, expected waiting time $1/p$ by the $E = 1 + qE$ argument. Examples 1–5.
  Mermaid checklist, tree-diagram SVG, histogram plot.
- Chosen to avoid pc-h1 (proof methods, sizes of infinity, infinite series, area/integration).

**Core lessons 36–40**: pictures/diagrams added with a sentence of introduction; nothing rewritten.
- 36: labeled sigma notation (SVG); Gauss staircase picture of $1 + \dots + 5$ (```shape).
- 37: bouncing ball (SVG) in Example 7; new short "Which formula?" section with a Mermaid
  decision chart (arithmetic / geometric / neither, finite vs infinite, convergence).
- 38: dominoes picture of base case and inductive step (SVG); six-step proof outline (Mermaid).
- 39: Pascal's triangle with the sum rule (SVG); "find one term" procedure (Mermaid).
- 40: outfit tree diagram (SVG); permutation/combination decision chart (Mermaid) plus one
  sentence explaining its $n^r$ box; hearts/face-cards Venn diagram (SVG) in Example 6.

**Pictures** (16 SVGs, original, each under 8 KB, all rendered and checked; blanks with markers
checked): pc-m9-sigma-parts(+blank), pc-m9-bounce(+blank), pc-m9-dominoes(+blank),
pc-m9-pascal(+blank), pc-m9-outfit-tree, pc-m9-venn-cards(+blank), pc-m9-tilings,
pc-m9-stars-bars, pc-m9-venn3(+blank), pc-m9-binomial-tree.

**Diagrams**: 6 Mermaid (recurrence method, binomial checklist, which formula, induction steps,
binomial term, counting method), all `flowchart TD` with accTitle/accDescr, rendered.
**Figures**: 4 new (Gauss staircase, recurrence plot, grid path, binomial histogram).

**Questions** (64 new, `questions/r2-pc-m9.yaml`)
- Core pc-m9-r2-q01…q25 (5 per lesson; each lesson has a label, a text, an order or match and a
  select-all): label 5 (q01, q06, q11, q16, q21), text 7 (q02, q03, q07, q10, q13, q17,
  q23), order 3 (q04, q12, q20), match 3 (q08, q18, q22), select-all 5 (q05, q09,
  q14, q19, q24), MC 2 (q15, q25). module_quiz: q02, q05, q07, q09, q12, q17, q19, q22, q24.
- Honors h01–h13 (recurrences), h14–h26 (counting), h27–h39 (binomial/expected value):
  13 each, 21 MC, 9 text, 2 match, 3 order, 3 select-all, 1 label. No module_quiz.
- Answer positions of the 23 four-choice MC questions: 0: 5, 1: 6, 2: 6, 3: 6.

**Drills** (9, `drills/r2-pc-m9.yaml`): pc-m9-r2-affine-term, -affine-limit, -second-order
(recurrences); -multiset, -stars-bars, -incl-excl (counting); -binom-exact, -binom-atleast,
-expected-game (binomial/expected value). 4-decimal answers use tolerance 0.0001; 1-decimal
answers 0.051; cents 0.006 (values are multiples of 1/6, so never on a rounding boundary).

**Glossary** (19 terms, `glossary-r2-pc-m9.yaml`, checked against every glossary file):
recurrence relation, initial conditions, first-order linear recurrence, second-order linear
recurrence, characteristic equation, golden ratio, Binet's formula, multinomial coefficient,
stars and bars, inclusion–exclusion principle, derangement, pigeonhole principle, Bernoulli
trial, binomial setting, binomial distribution, random variable, probability distribution,
expected value, fair game. "fixed point" is bolded in 40h1 but already defined in
glossary-r2-pc-m2.yaml (same meaning: $L$ is a fixed point of $f(x) = rx + c$; the lesson says so).

**Cards** (28, `cards-r2-pc-m9.yaml`): 11 recurrences, 8 counting, 9 binomial/expected value.

## For a reviewer to double-check
- All numbers recomputed in Python (loan payment, Binet values, MISSISSIPPI, Venn region counts
  267/134/67/133/67/33/33/266, derangements, binomial probabilities, roulette −2/38).
- Stated without proof and labeled so: repeated-root solution $(A + Bn)s^n$; linearity of
  expectation; $D_n/n! \to 1/e$; law of large numbers; $E = 1/p$ argument assumes $E$ is finite.
- Tower of Hanoi attributed to Édouard Lucas, 1883 (published under a pseudonym; standard).
- h31 explanation names $np(1-p)$ "the variance", a term the course doesn't define.
- The 37 "Which formula?" section is a new heading (one sentence plus the chart).

## Errors found in existing content
None. Spot-checked lesson 37 Example 4 (\$16,387.93), lesson 39 Example 5 (1.1040808) and
lesson 40 Example 7 (0.518): all correct.

## Sources
Standard results (recurrences, Binet, inclusion–exclusion, derangements, binomial distribution,
expected value); explanations, examples and questions are original. Lucas/Tower of Hanoi date
from common history-of-mathematics references.
