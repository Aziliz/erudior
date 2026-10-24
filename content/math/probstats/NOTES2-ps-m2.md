# Round 2 notes: module ps-m2 (Discrete random variables)

`content/math/check-module.sh probstats ps-m2`: build and checker OK, zero problems
(7 lessons, 114 questions, 18 drills, 55 cards). The only warning was about another writer's
file (`questions/r2-ps-m5.yaml`, YAML error while they were working on it).

## Added

**Honors lessons** (both `honors: true`, `module: ps-m2`, 45 min)
- `lessons/09h1-pgf-branching.md`, id `ps-m2-h-pgf-branching`, "Probability generating functions
  and branching processes" (~2,000 words of prose excluding display math and code blocks). PGF
  definition, coefficients = pmf, moments from derivatives at 1, table of PGFs, sums; random sums as
  compositions $G_N(G_X(s))$; Poisson thinning; Galton–Watson branching processes, $G_{Z_n}$ as the
  n-fold composition, $E(Z_n) = m^n$; extinction probability as the smallest fixed point, with a full
  proof of the extinction theorem from convexity; the critical-case paradox; history (Galton 1873,
  Watson, Bienaymé 1845, Steffensen 1930). Examples: three dice totalling 10 via PGFs (27/216);
  thinning Poisson(6) at 0.7; offspring (1/4, 1/4, 1/2) with q = 1/2 and iterates; Poisson(1.5)
  outbreak model with q ≈ 0.417 (labeled as a simplified model), plus the overdispersion remark.
- `lessons/09h2-poisson-paradigm.md`, id `ps-m2-h-poisson-paradigm`, "The Poisson paradigm and the
  law of small numbers" (~1,800 words). Total variation distance (both forms, why they agree); Poisson
  binomial distribution; Le Cam's inequality with the coupling proof; Barbour–Hall refinement
  (stated); the Poisson paradigm, labeled a heuristic, and the factorial-moment pair check
  $E[X(X-1)] = \sum_{i \ne j} P(A_i \cap A_j)$ vs $\lambda^2$; Bortkiewicz's horse-kick data. Examples: welds
  from lesson 8 (bounds 0.008 / 0.0035 vs actual 0.0009) and Bin(12, 0.25) as a failure case;
  unequal probabilities (absolute vs relative error); matches in a shuffle (mean = variance = 1,
  table vs Poisson(1)); shared birthdays (253/365, e^−0.693 ≈ 0.500 vs exact 0.4927).

Chosen to avoid the neighbors: ps-m1 honors does random walks / Simpson's paradox, ps-m3 does
reliability / mixed variables, lesson 19 does random sums by total expectation (09h1 only adds the
PGF composition and points forward), ps-h1 is modern statistical methods.

**Core lessons 05–09** (additions only; each already had at least one plot)
- 05: labeled cdf anatomy picture (SVG) with a two-sentence intro; Mermaid "from a pmf to the mean
  and SD" procedure.
- 06: probability tree for three trials (SVG) with a short paragraph tying it to $\binom32 p^2q$;
  Mermaid "Bernoulli, binomial or hypergeometric" chart under the existing model table.
- 07: negative binomial as a sum of geometric waits (SVG) with one sentence; new short section
  "Fixed trials or fixed successes?" with a Mermaid chart.
- 08: Poisson process time line (SVG); new short section "Which discrete model?" with a Mermaid
  chart covering all five named distributions of the module.
- 09: Mermaid "MGF method for a sum" procedure with a one-line intro.

**Pictures** (11 original SVGs, 3–9 KB each, all rendered and checked, markers checked on the blanks):
ps-m2-cdf-anatomy(-blank), ps-m2-binomial-tree(-blank), ps-m2-negbin-waits(-blank),
ps-m2-poisson-process(-blank), ps-m2-pgf-fixed-point(-blank), ps-m2-family-tree.

**Diagrams**: 7 Mermaid flowcharts (all `flowchart TD`, accTitle/accDescr, rendered): pmf-to-SD
procedure, Bernoulli/binomial/hypergeometric, binomial/geometric/negative binomial, which discrete
model, MGF method, finding the extinction probability, is a count approximately Poisson.
New plots in honors lessons: cobweb iteration toward q (09h1), observed vs Poisson horse-kick counts (09h2).

**Questions** (`questions/r2-ps-m2.yaml`, 54)
- Core ps-m2-r2-q01…q25 (5 per lesson): label 4 (q01, q06, q11, q16), text 5 (q02, q07, q12, q17,
  q21), match 5 (q03, q08, q13, q19, q22), order 3 (q05, q20, q24), select-all 5 (q04, q09, q14, q18,
  q23), MC 3 (q10, q15, q25). Every lesson has a text, a match or order, a select-all, and (05–08) a label.
  module_quiz: q02, q03, q07, q08, q12, q13, q17, q19, q22, q25 (2 per lesson).
- Honors 09h1, ps-m2-r2-h01…h15: MC 9, text 2 (h03, h11), order 1 (h12), match 1 (h13), label 1 (h14),
  select-all 1 (h15).
- Honors 09h2, ps-m2-r2-h16…h29: MC 9, text 2 (h18, h25), match 1 (h26), order 1 (h27), select-all 1 (h24).
- Answer positions of the 21 four-choice MC questions: 0: 5, 1: 5, 2: 6, 3: 5.

**Drills** (`drills/r2-ps-m2.yaml`, 5): ps-m2-r2-pgf-sum, ps-m2-r2-thinning, ps-m2-r2-extinction (09h1);
ps-m2-r2-lecam, ps-m2-r2-poisson-binomial (09h2). Each generated 500 times; targets matched an
independent calculation (extinction by fixed-point iteration, Poisson pmf by formula, etc.), and both
the displayed answer and the answer rounded to 4 decimals were accepted.

**Glossary** (`glossary-r2-ps-m2.yaml`, 13 terms, checked against every glossary file including other
writers' r2 files): probability generating function, thinning, offspring distribution, branching
process, supercritical, subcritical, critical, extinction probability, total variation distance,
Poisson binomial distribution, Le Cam's inequality, coupling, Poisson paradigm. Every bolded term in
both honors lessons has an entry ("random sum" links to glossary-b's existing entry).

**Cards** (`cards-r2-ps-m2.yaml`, 20): 11 for 09h1 (topics Probability generating functions,
Branching processes), 9 for 09h2 (topic Poisson approximation).

## For a reviewer to double-check
- History: Galton's problem in *The Educational Times* (1873); Watson's answer (same journal) and the
  joint Galton–Watson paper (1875); Watson concluded extinction is always certain; Bienaymé stated the
  criterion in 1845 with no surviving proof; Steffensen's solution 1930.
- Le Cam's inequality is stated as $d_{TV} \le \sum p_i^2$ with $d_{TV}$ = half the L1 distance (Le Cam
  1960 states $\sum_k |\cdot| < 2\sum p_i^2$). Barbour–Hall (1984) factor $(1 - e^{-\lambda})/\lambda$; Chen 1975.
- The coupling proof uses a uniform random number (Module 3), flagged as a forward reference.
- 09h1 Example 4: the Poisson-offspring outbreak model is labeled simplified; the "about 0.77" uses a
  negative binomial with mean 1.5 and dispersion k = 0.5 (computed: 0.7676); Lloyd-Smith et al. 2005
  (Nature) cited for superspreading.
- Bortkiewicz data: the commonly quoted 10-corps subset, 1875–1894, counts 109/65/22/3/1, mean 0.61,
  sample variance 0.611; expected Poisson counts 108.7/66.3/20.2/4.1/0.6.
- Birthday: 253/365 = 0.693151 just exceeds ln 2 = 0.693147, so n = 23 is the break-even size in the
  Poisson approximation.
- Thinning: the independence of kept and discarded counts is mentioned without proof.
- Label markers sit on small features (event dots in the Poisson process picture, the f(0) point);
  the other dots and the axis stay visible.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
Standard results recomputed in Python (scipy, numpy). Galton–Watson history: Wikipedia
"Galton–Watson process" and P. Jagers' history notes (Chalmers). Le Cam (1960), Pacific J. Math.;
Barbour and Hall (1984), Math. Proc. Cambridge Phil. Soc.; Chen (1975), Annals of Probability;
Lloyd-Smith et al. (2005), Nature, "Superspreading and the effect of individual variation on disease
emergence". Bortkiewicz (1898), *Das Gesetz der kleinen Zahlen*; data table from the University of York
history-of-statistics transcription.
