# Round 2 notes: ps-m8 (Regression, ANOVA and nonparametric methods)

`content/math/check-module.sh probstats ps-m8`: build and checker report zero problems
(5 lessons, 84 questions, 14 drills, 48 cards).

## Added

**Honors lessons** (honors: true, module ps-m8, 50 min, about 1,830 words of prose each)
- `lessons/36h1-multiple-regression.md` (ps-m8-h-multiple-regression), "Honors: Multiple regression
  in matrix form". Model Y = Xβ + ε and the design matrix; normal equations from the gradient;
  least squares as an orthogonal projection (hat matrix, idempotent, trace p, so n − p residual df);
  E(b) = β and Cov(b) = σ²(XᵀX)⁻¹; t tests for single coefficients; a one-paragraph matrix proof of
  Gauss–Markov; "held fixed" meaning of coefficients; R² vs adjusted R²; overall F test;
  multicollinearity and the VIF (two-predictor formula Var(b1) = σ²/[S11(1 − r12²)]); leverage.
  Examples: (1) lesson 34's rail-wear line re-derived with 2×2 matrices; (2) wear on traffic and
  curvature, n = 6, solved by hand from centered sums (b1 = 0.5808, b2 = 0.6788, t = 6.38 and 2.52,
  R² = 0.966, adj 0.943, F = 42.6), contrasted with the simple slope 0.697; (3) leverage of a
  far-out seventh site (h = 0.885 vs cutoff 4/7).
- `lessons/36h2-blocking-two-way-anova.md` (ps-m8-h-two-way-anova), "Honors: Blocking and two-way
  ANOVA". Randomized block design and the additive model, three-way SS split, E(MSTr), link to the
  paired t test (F = t² for k = 2), cost in error df; balanced two-way factorial with replication,
  main effects, interaction, SS table, test-interaction-first; assumptions, and a note that
  unbalanced designs (types of sums of squares) are contested. Fisher/Rothamsted history (1919,
  1925, 1935). Examples: (1) 3 fasteners × 4 sites: block F = 19.0 (p = 0.0025) vs one-way
  F = 0.20 (p = 0.82) on the same data; (2) 2 rail grades × 3 lubrication levels, r = 2, all-integer
  SS (27, 72, 32, 12), interaction F = 8.0 (p = 0.020), with an interaction plot.

**Core lessons 34–36**: additions only, each introduced by a sentence or two; no existing text
changed (lesson 36: "The steps, in order:" appended to the permutation paragraph's last line).
- 34: labeled least-squares anatomy SVG (observed point, fitted value, residual, point of means,
  intercept, slope triangle; made-up data with ŷ = 1.65 + 0.7x exactly); Mermaid regression
  workflow (fit → residual plot → fix loop → slope inference → CI vs PI).
- 35: SVG splitting one observation's deviation (Example 1, value 19 in ballast B) into
  between (2.33) and within (2) parts; Mermaid one-way ANOVA procedure ending in multiple comparisons.
- 36: Mermaid permutation-test steps; Mermaid "choosing a rank-based test" chart (labeled as simplified).

**Pictures** (7 SVGs, original, 1.3–5.1 KB, each rendered and looked at; blanks checked with
markers): ps-m8-ls-anatomy (+ -blank), ps-m8-anova-split (+ -blank), ps-m8-projection (+ -blank),
ps-m8-block-layout. **Diagrams**: 5 Mermaid (34, 35, 36 ×2, 36h2), all with accTitle/accDescr, all
rendered. **Plots**: interaction plot (36h2).

**Questions** (45, `questions/r2-ps-m8.yaml`)
- Core q01–q15, 5 per lesson. 34: label, text, order, select-all, match. 35: label, text, order,
  select-all, match. 36: match, text ×2, order, select-all. module_quiz: q01, q05, q06, q08, q11, q12.
- Honors h01–h15 (36h1): label, text ×2, order, select-all, match, 9 multiple choice.
  h16–h30 (36h2): text ×2, order, select-all ×2, match, 9 multiple choice.
  Multiple-choice answer positions 0/1/2/3: 4/5/5/4.

**Drills** (5, `drills/r2-ps-m8.yaml`, linked from the honors lessons): ps-m8-r2-two-predictor-fit,
ps-m8-r2-coef-test, ps-m8-r2-adj-r2-f (36h1); ps-m8-r2-block-anova, ps-m8-r2-two-way-ss (36h2).
Each generated 300 times; every displayed answer recomputed independently in Python (numpy/scipy)
from the prompt text and typed back through checkAll: 1500/1500 matched and accepted. Tolerances
allow answers built from the rounded intermediate values the prompts ask for (b0 0.005; block F
0.05 with SSE ≥ 4 and F ≤ 30; coefficient test requires SE ≥ 0.1). Values that can exceed 999
use dp formats inside TeX to avoid thousands separators.

**Glossary** (`glossary-r2-ps-m8.yaml`, 17 terms, every bolded term in 36h1/36h2; checked for
duplicates against every glossary file): multiple linear regression model, design matrix, column
space, hat matrix, adjusted R-squared, overall F test, variance inflation factor, multicollinearity,
leverage, blocking, block, randomized block design, additive model, factorial design, main effect,
interaction, interaction plot.

**Cards** (`cards-r2-ps-m8.yaml`, 21): 12 on Multiple regression, 9 on Two-way ANOVA.

## For a reviewer
- Every number in the lessons, questions and explanations was recomputed with numpy/scipy.
- 36h1 states without proof that SSE/σ² ~ χ²(n − p) independently of b (labeled in the text).
- Gauss–Markov attribution: "Gauss proved the result in the 1820s; Markov's name was attached in the
  twentieth century, an attribution historians of statistics have questioned." Worth a glance.
- 36h2 Fisher dates (Rothamsted from 1919; books 1925 and 1935) are standard; h29 asks about them.
- The ps-h1 honors module ("Modern statistical methods") is being written at the same time; if it
  also covers multiple regression or two-way ANOVA, the two should be reconciled.
- Not covered (left for later): Kruskal–Wallis computation and Spearman rank correlation (lesson 36
  only names Kruskal–Wallis), partial F tests, unbalanced two-way ANOVA.

## Errors found in existing content
None.

## Sources
Standard results (least squares, hat matrix, Gauss–Markov, VIF, randomized block and two-way ANOVA
decompositions) as found in any mathematical statistics text, for example Wackerly, Mendenhall and
Scheaffer, *Mathematical Statistics with Applications*, and Montgomery, *Design and Analysis of
Experiments*. All examples and data are original.
