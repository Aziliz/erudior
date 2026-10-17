# Probability and Statistics — part C (modules ps-m7, ps-m8)

Writer C owns: lessons 28–34, questions/ps-m7.yaml, questions/ps-m8.yaml, drills/ps-m7.yaml,
drills/ps-m8.yaml, cards-c.yaml, glossary-c.yaml, references/testing.md (ps-ref-testing).

## Outline

### ps-m7 Hypothesis testing
| # | Lesson id | Title | Topics | Drills |
|---|---|---|---|---|
| 28 | ps-test-framework | The testing framework: errors, power and p-values | Hypothesis testing framework; Power | ps-d-binom-size-power, ps-d-z-power, ps-d-z-sample-size |
| 29 | ps-normal-tests | Tests for means and variances of normal samples | Tests for normal means; Tests for variances | ps-d-paired-t, ps-d-two-sample-t, ps-d-chisq-variance |
| 30 | ps-neyman-pearson | Most powerful tests and likelihood ratio tests | Neyman–Pearson lemma; Likelihood ratio tests | ps-d-mp-exponential, ps-d-lrt-poisson, ps-d-lrt-binomial |
| 31 | ps-proportions-chisq | Tests for proportions and chi-square tests | Tests for proportions; Chi-square tests | ps-d-two-prop-z, ps-d-gof, ps-d-independence |

### ps-m8 Regression, ANOVA and nonparametric methods
| # | Lesson id | Title | Topics | Drills |
|---|---|---|---|---|
| 32 | ps-linear-regression | Simple linear regression | Simple linear regression | ps-d-ls-fit, ps-d-slope-test, ps-d-pred-interval |
| 33 | ps-anova | One-way analysis of variance | One-way ANOVA | ps-d-anova-raw, ps-d-anova-summary, ps-d-anova-table |
| 34 | ps-nonparametric | Nonparametric methods | Nonparametric tests | ps-d-sign-test, ps-d-signed-rank, ps-d-rank-sum |

Lessons 33–34 were adapted from the old draft /tmp/claude-0/stats-extra/40-anova-nonparametric.md
(split in two, rewritten at the calculus-based level: SS decomposition proof, E(MSTr), F
distribution argument, Bonferroni/Tukey; signed-rank and rank-sum null moments derived,
exact distributions, permutation tests, ARE).

## Counts

- Lessons: 7 (about 1,300–1,500 words each, 2–4 worked examples each, 2–5 figures each:
  power curves, rejection regions on t/χ²/F/normal/gamma densities, a log-likelihood plot,
  observed-vs-expected bars, scatterplot with confidence and prediction bands, residual plots,
  boxplots by group, the exact null distribution of W⁺, a rank dot plot).
- Questions: 91 (13 per lesson); module_quiz: 14 in ps-m7, 9 in ps-m8, covering every topic.
  Answer positions: ps-m7 13/13/13/13; ps-m8 10/10/10/9.
- Drills: 21 (3 per lesson).
- Notecards (cards-c.yaml): 65. Glossary (glossary-c.yaml): 66 terms.
- Reference sheet: ps-ref-testing (test statistics and null distributions, rejection regions,
  power and sample size, NP/LRT/Wilks, proportions and chi-square, regression, ANOVA table,
  nonparametric statistics with null moments).

## Verification done

- Every numeric question key recomputed with scipy (/tmp/claude-0/ps-c/verify_q.py); distractors
  checked to be wrong and traced to a named mistake in the explanation.
- Every lesson example recomputed with scipy/numpy.
- Drills: each generated 400 times from the built JSON (generate() from src/lib/drills.ts);
  targets matched an independent scipy computation from the generated inputs (worst relative
  error 5e-13); the displayed answer is accepted when typed; every number shown in a prompt
  equals the value the answer is computed from (inputs are rounded before use).
- Figures rendered to PNG and inspected.
- Isolated build of modules ps-m7/ps-m8 only (copy in /tmp/claude-0/ps-c/check/probstats, via
  /tmp/claude-0/ps-c/build_copy.sh) passes build.py and tests/check-course.mts with zero problems.

## Notes for a reviewer

- Notation: $H_1$ for the alternative (with $H_a$ mentioned), $t_{\alpha,\nu}$ and
  $\chi^2_{\alpha,\nu}$ are upper-$\alpha$ points, $F_{\alpha,a,b}$ likewise.
- Glossary deliberately omits terms other writers own (t, chi-square and F distributions,
  pivotal quantity, likelihood function, MLE, confidence interval, Bonferroni inequality,
  relative efficiency). Before release, check that glossary-a/b don't also define any of mine
  (e.g. "power", "p-value", "least squares", "residual", "regression sum of squares").
- Regression in lesson 32 assumes the earlier lesson on covariance/correlation; "regression
  line" / "regression function" are bolded in lesson 17 (other writer), so I used
  "simple linear regression model" and "least squares" instead.
- Lesson 29 refers to $\bar X$ and $S^2$ being independent and to $(n-1)S^2/\sigma^2 \sim \chi^2_{n-1}$
  as known from the sampling-distributions lesson.
- The F density in lesson 33's figure is written out explicitly ((1 + x/6)^(−7) for F(2, 12))
  because the engine has no F pdf.
