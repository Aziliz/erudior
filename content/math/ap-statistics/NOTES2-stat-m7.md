# Round 2 notes: module stat-m7 (Sampling distributions and confidence intervals)

`content/math/check-module.sh ap-statistics stat-m7`: build and checker report zero problems
(7 lessons, 108 questions, 19 drills, 46 cards).

## Added

**Honors lessons** (2)
- `lessons/32h1-proportion-intervals.md` (stat-m7-h-proportion-intervals, "Better intervals for a
  proportion: coverage, plus four and Wilson", 45 min, about 2,000 words). Covers:
  - nominal level vs. coverage probability, and exact coverage as a sum of binomial probabilities;
  - why the Wald interval falls short: zero width, impossible endpoints, sawtooth coverage;
  - plus four (Agresti–Coull 1998), and its two-sample version (Agresti–Caffo 2000);
  - the Wilson score interval, derived as a quadratic, with plus four as its rounded center and
    its link to inverting the z test;
  - Clopper–Pearson ("exact" means at least 95%);
  - zero successes and the rule of three.

  Examples: a coverage table for n = 10, p = 0.3 (0.840); 2 cracked fasteners in 40 by plus four;
  the same data by Wilson, with a four-method comparison table; 0 failures in 50 relays.
- `lessons/32h2-student-t.md` (stat-m7-h-student-t, "Where t comes from: degrees of freedom,
  robustness and prediction", 45 min, about 1,700 words). Covers:
  - Gosset/Student (1908);
  - why n − 1, and that s is biased low (c4);
  - t = Z/(s/σ) from three normal-theory facts, stated without proof;
  - true coverage of the "z with s" interval;
  - a 200,000-sample robustness simulation (normal, uniform, exponential, contaminated normal);
  - the prediction interval x̄ ± t*·s·√(1 + 1/n);
  - Welch–Satterthwaite df and its bounds.

  Examples: n = 8 coverage (0.909); a prediction interval for lesson 31's freight trains
  (20.66, 41.74); Welch df when one group dominates (9.81).

**Core lessons 28–32**: I only added pictures and diagrams, each with a sentence or two of lead-in.
Nothing was removed or rewritten.
- 28: picture of the three distributions (population / one sample / simulated sampling distribution
  of p̂ from 1,000 SRSs of 150, seed 28: mean 0.600, SD 0.040, one sample 85/150); Mermaid chart of
  the checks for p̂ (center → 10% → large counts).
- 29: SVG of the exact x̄ distributions for an exponential population (mean 10): the population, then
  n = 4, then n = 30 (gamma densities); Mermaid "can I use a normal model for x̄?".
- 30: Mermaid State/Plan/Do/Conclude; SVG anatomy of Example 1's interval; ```plot of the 95%
  margin of error vs n (0.98/√n) with n = 100, 400 and 1,600 marked.
- 31: SVG of t* areas for df = 9 (2.262, middle 0.95, tails 0.025); Mermaid chart for choosing
  z or t.
- 32: ```shape figure with three difference intervals (A = Example 1, B contains 0, C below 0),
  plus one added sentence on reading it; new short section "Choosing the right interval" with a
  Mermaid chart (two-proportion z / paired t / two-sample t).

**Pictures** (9 SVGs, all original, 5–35 KB). I rendered each one and checked it, including the
label markers on the blank copies:
- stat-m7-three-dists and its -blank copy;
- stat-m7-clt-shapes and its -blank copy;
- stat-m7-ci-anatomy and its -blank copy;
- stat-m7-tstar-areas and its -blank copy;
- stat-m7-coverage-n40 (exact coverage curves).

A Python script made them from computed values (gamma densities, t densities, exact binomial
coverage).

**Diagrams**: 6 Mermaid charts (5 core, plus a "which proportion interval" chart in honors 1). All
have accTitle/accDescr and were rendered. **Plots/shapes**:
- core 30: margin of error vs n;
- core 32: difference intervals;
- honors 2: coverage of the "z with s" interval vs n, and a confidence interval vs prediction
  interval comparison.

I rendered all four with the app's figure code and CSS, and checked them.

**Questions** (53, all in `questions/r2-stat-m7.yaml`)
- Core, stat-m7-r2-q01…q25 (5 per lesson):
  - label: 4 (q01, q06, q11, q16)
  - text: 5 (q02, q07, q13, q17, q22)
  - match: 3 (q03, q18, q21)
  - order: 3 (q08, q12, q25)
  - select-all: 5 (q04, q09, q14, q19, q23)
  - MC: 5 (q05 and q24 use pictures)

  module_quiz: q01, q03, q06, q09, q11, q14, q17, q21.
- Honors 1, h01…h14:
  - 8 MC (h11 uses the coverage figure)
  - 2 text
  - 2 select-all
  - 1 match
  - 1 order
- Honors 2, h15…h28:
  - 7 MC
  - 3 text
  - 2 select-all
  - 1 match
  - 1 order

  No module_quiz flags on either honors lesson (core-module honors lessons).
- Answer positions of the 20 new 4-choice MC questions: 5 at each of 0, 1, 2 and 3.

**Drills** (6, `drills/r2-stat-m7.yaml`, 3 linked from each honors lesson):
- honors 1: stat-m7-r2-plus-four, -wilson, -zero-successes;
- honors 2: stat-m7-r2-z-with-s, -prediction-interval, -welch-df.

I generated 400 instances of each with the app's engine and compared them with independent scipy
answers parsed from the prompt. Results:
- 0 mismatches;
- every correctly rounded answer is accepted, including a prediction interval that uses a t* rounded
  to 3 decimals;
- answers shifted by 0.01 (0.03 for the prediction interval, 0.1 for Welch df) are rejected;
- displayed answers show the number of decimals the prompt asks for.

**Glossary** (8 terms in `glossary-r2-stat-m7.yaml`). I checked them against every glossary*.yaml,
and there are no collisions across files:
- Wald interval, nominal confidence level, coverage probability;
- plus four interval, Wilson score interval, Clopper–Pearson interval;
- rule of three, Welch–Satterthwaite approximation.

**Cards** (20 in `cards-r2-stat-m7.yaml`): 10 per honors lesson.

## For the reviewer to double-check
- Every number was recomputed in Python (scipy). This covers:
  - the honors examples, the coverage table and the coverage figure (exact binomial sums, grid step
    0.0025);
  - Wilson and Clopper–Pearson endpoints;
  - c4 (0.940 for n = 5, 0.973 for n = 10);
  - tail and coverage values of the t distribution;
  - Welch df.
- The robustness table in honors 2 is a seeded simulation (200,000 samples per cell; seed 20261023).
  It is labeled in the lesson as simulation results accurate to about ±0.001. The contaminated normal
  is 95% N(0, 1) and 5% N(0, 10²).
- Statements worded with care:
  - Plus four "a common textbook guideline is n ≥ 10 at 90–99%" (Moore et al.'s rule), labeled as a
    guideline.
  - Wald coverage for n = 40, 0.2 ≤ p ≤ 0.8: "between about 0.905 and 0.956".
  - Clopper–Pearson coverage for n = 40: "usually between about 96% and 99%". The computed 5th to
    95th percentiles over p are 0.957 to 0.991, and the minimum is 0.952.
  - Rule of three: "one-sided bound = upper end of a two-sided 90% interval".
- Gosset history: worked at Guinness in Dublin; published in Biometrika in 1908 as "Student"; Fisher
  later recast the result. The lesson does not state why Guinness required a pen name.
- Glossary overlap to resolve: the stat-m9 writer's glossary already has "prediction interval",
  defined only for regression (ŷ at x*). So honors 2 uses *prediction interval* in italics, not bold,
  to avoid a misleading pop-up. A shared definition covering both cases would let it be bolded.
- Possible overlap with stat-h1 (honors module): it may also touch interval coverage or the
  bootstrap. My lessons stay on one-proportion intervals and t theory.

## Errors found in existing content
None. While adding figures I spot-checked the worked examples in lessons 28–32, and all are correct.
That includes lesson 31's claim that a z interval with s at n = 5 has about 88% coverage (exact:
0.878).

## Sources
- Wilson, E. B. (1927), "Probable inference, the law of succession, and statistical inference",
  JASA 22.
- Clopper, C. J. and Pearson, E. S. (1934), Biometrika 26.
- Agresti, A. and Coull, B. A. (1998), "Approximate is better than 'exact' for interval estimation
  of binomial proportions", The American Statistician 52.
- Agresti, A. and Caffo, B. (2000), The American Statistician 54.
- Brown, L. D., Cai, T. T. and DasGupta, A. (2001), "Interval estimation for a binomial proportion",
  Statistical Science 16.
- Hanley, J. A. and Lippman-Hand, A. (1983), "If nothing goes wrong, is everything all right?",
  JAMA 249.
- Student (1908), "The probable error of a mean", Biometrika 6.
- Satterthwaite, F. E. (1946), Biometrics Bulletin 2.
- Welch, B. L. (1947), Biometrika 34.
- Moore, McCabe and Craig, Introduction to the Practice of Statistics, and OpenStax Introductory
  Statistics, for course conventions.
