# Round 2 notes: ps-m1 (Probability foundations)

`content/math/check-module.sh probstats ps-m1`: build and checker report zero problems
(6 lessons, 103 questions, 15 drills, 51 cards).

## Added

**Honors lessons** (`honors: true`, `module: ps-m1`)
- `lessons/04h1-first-step-analysis.md`, `ps-m1-h-first-step`, "Honors: First-step analysis and
  the gambler's ruin" (45 min, about 2,000 words of prose). Covers conditioning on the first step
  and recognizing the same problem afterward. Includes why the game ends with probability 1 (by
  monotonicity), craps ($w_k = P(k)/(P(k)+P(7))$, overall $244/495$), and the gambler's ruin
  recursion with boundary conditions. The ruin recursion is solved in full, by differences and
  then a geometric sum, for fair and unfair games. Also covers the limit with an unlimited
  opponent, timid versus bold play, and the problem of points (recursion and Fermat's shortcut).
  Examples: first six wins (two methods), craps, fair ruin \$20 to \$100, roulette timid versus
  bold, A needs 2 and B needs 3. It has a Mermaid craps flowchart, the random-walk SVG and a plot
  of $P_i$ for $p = 0.5$ and $0.45$.
- `lessons/04h2-paradoxes-of-conditioning.md`, `ps-m1-h-paradoxes`, "Honors: Paradoxes of
  conditioning" (45 min, about 1,600 words). Covers Simpson's paradox as weighted averages,
  including a proof that equal mixes cannot reverse a comparison, randomization, confounders, and
  the question of when to split or combine. It also covers the 1973 Berkeley admissions case,
  Berkson's paradox and selection bias (common cause versus common effect), the two-child problem
  under three information processes plus the Tuesday-boy variant ($13/27$), and Bertrand's box.
  It has the Simpson bar-chart SVG and two Mermaid diagrams (confounder, collider).

**Core lessons** (additions only, each with a lead-in sentence; nothing rewritten)
- 01-axioms: Mermaid "how the rules follow from the axioms" (axioms leading to the empty set,
  finite additivity, complement, monotonicity, addition rule, inclusion–exclusion, union bound
  and Bonferroni). Also the SVG `ps-m1-venn3`, a three-set Venn diagram showing how
  inclusion–exclusion counts each region (1, 2 − 1, 3 − 3 + 1, 0).
- 02-counting: SVG `ps-m1-subsets-orders` (3 subsets × 2! orderings = 6 ordered pairs, the "why"
  of $\binom nr$); Mermaid "which counting formula" decision chart.
- 03-conditional-bayes: SVG `ps-m1-restrict` (conditioning keeps B and rescales); SVG
  `ps-m1-tree-parts` (priors, likelihoods, path products); Mermaid "steps for Bayes' theorem".
- 04-independence: SVG `ps-m1-indep-square` (unit square, areas multiply, with complements);
  Mermaid common-cause diagram for the two-coin example.

**Pictures** (11 SVG files, original, 1–8 KB each, all rendered and checked, label markers
checked): ps-m1-venn3 (+blank), ps-m1-subsets-orders, ps-m1-restrict, ps-m1-tree-parts (+blank),
ps-m1-indep-square (+blank), ps-m1-h-random-walk (+blank), ps-m1-h-simpson (+blank).
Generator script: /tmp/r2-ps-m1/gen.py (writes the SVGs and the marker percentages).

**Diagrams** (7 Mermaid, all with accTitle/accDescr, rendered): axioms (01), counting (02), Bayes
steps (03), common cause (04), craps (04h1), confounder and collider (04h2).

**Questions** (51, `questions/r2-ps-m1.yaml`)
- Core `ps-m1-r2-q01`…`q20`, 5 per lesson:
  - 01: text q01, order q02, match q03, select-all q04, label q05.
  - 02: text q06 and q10, match q07, select-all q08, order q09 (no picture worth labeling).
  - 03: text q11, order q12, match q13, select-all q14, label q15.
  - 04: text q16, match q17, select-all q18, label q19, order q20.
  - module_quiz: q01, q04, q06, q10, q11, q15, q16, q18 (2 per lesson).
- Honors 04h1 `h01`…`h16` (16): MC 10, text 2 (h02, h06), select-all 1 (h08), order 1 (h09),
  label 1 (h10), match 1 (h14).
- Honors 04h2 `h17`…`h31` (15): MC 9, text 2 (h17, h26), select-all 1 (h20), label 1 (h21),
  match 1 (h28), order 1 (h29).
- No module_quiz on honors questions. The 19 honors MC answers sit at positions 0–3 (5, 5, 5, 4).

**Drills** (5, `drills/r2-ps-m1.yaml`)
- For 04h1: `ps-m1-r2-alternating` (alternating race), `ps-m1-r2-ruin` (reach target and ruin;
  $p \ne 0.5$ only, so no 0/0) and `ps-m1-r2-points` (problem of points via binomcdf).
- For 04h2: `ps-m1-r2-simpson` (combined rates with a guaranteed reversal; percents to 1 decimal,
  tolerance 0.06) and `ps-m1-r2-berkson` (three probabilities).
- Each was generated 1,500 times with tsx (`generate()` + `checkAll()`) against an independent
  calculation: a long series sum for the race, value iteration of the recursion for the ruin
  drill, direct binomial sums, and the formulas for the rest. In every run the target matched,
  a correctly rounded independent answer and the shown answer were accepted, a wrong answer was
  rejected, and no NaN or unfilled placeholders appeared. Script: /tmp/r2-ps-m1/v/verify.mts.
- The Simpson drill's `where` passes about 3% of random draws; with 500 rerolls a failure to
  generate has probability under $10^{-6}$.

**Glossary** (`glossary-r2-ps-m1.yaml`, 12 terms): first-step analysis, random walk, absorbing
state, boundary conditions, gambler's ruin, problem of points, bold play, timid play, Simpson's
paradox, confounding variable (aliases include confounder), Berkson's paradox, selection bias. I
checked them against every `glossary*.yaml` in the course, including the other writers' r2 files
present at the time: no clashes.

**Cards** (`cards-r2-ps-m1.yaml`, 18): 10 on First-step analysis / Gambler's ruin, 8 on Simpson's
paradox / Paradoxes of conditioning.

## For a reviewer to double-check
- Historical claims: problem of points discussed by Pacioli (1494) and solved in the Pascal–Fermat
  letters of 1654. Simpson (1951), with Pearson and Yule noting similar effects "around 1900".
  Berkson (1946, hospital patients). Bertrand's box (1889, *Calcul des probabilités*). Dubins and
  Savage (1965): bold play is optimal for reaching a fixed goal in a subfair red-and-black game.
  The lesson states this only "for a game like this one".
- Berkeley 1973: "about 44% of men and 35% of women admitted" and Bickel, Hammel and O'Connell
  (1975) "found little evidence of bias against women within departments" are worded cautiously.
  Please confirm the wording is acceptable.
- The two-child model treats sexes as equally likely and independent. The lesson labels this a
  simplification.
- The endless-game limit, $1 - (q/p)^i$, is stated with "a limit argument (continuity of
  probability), not proved here".
- The ruin plot draws $P_i$ as a continuous curve, and its caption says only whole-number $i$
  occur.
- All numbers recomputed in Python. Examples: $6/11$, $244/495$, $(1 - (10/9)^{20})/(1 - (10/9)^{40}) \approx 0.1084$,
  $11/16$, $4/13$, $19/27$, $0.648$, $13/27$ (by enumeration), $8/11$, $0.98976$.

## Errors found in existing content
None in ps-m1. Unrelated to ps-m1: a few entries in `glossary-b.yaml` and `glossary-c.yaml`
repeat a term as an alias in a different capitalization ("Central Limit Theorem" / "central
limit theorem", "p-value" / "P-value", "r-squared" / "R-squared"). This is harmless, the build
accepts it, and I left those entries alone.

## Sources
Standard results (Kolmogorov axioms, first-step analysis, gambler's ruin, Fermat's solution of the
problem of points) as found in any calculus-based probability text. The historical notes listed
above. All explanations, examples, numbers, pictures and questions are original.
