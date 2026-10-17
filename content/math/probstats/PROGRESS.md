# Probability and Statistics (math-probstats)

Calculus-based college course written 2026-10-16 by three writers (notes below), then independently reviewed.


# Probability and Statistics — part A (modules ps-m1 to ps-m3)

Writer A owns lessons 01–14, `questions/ps-m1..m3.yaml`, `drills/ps-m1..m3.yaml`,
`cards-a.yaml`, `glossary-a.yaml` and `references/probability.md` (id `ps-ref-probability`).
Status: all done; my part builds and checks clean (alone and in the full course build).

## Outline

| # | Lesson id | Title | Topics | Drills |
|---|---|---|---|---|
| 01 | ps-axioms | Sample spaces, events and the axioms of probability | Sample spaces and events; Probability axioms | ps-d-union-two, ps-d-incl-excl-three |
| 02 | ps-counting | Counting and equally likely outcomes | Counting methods; Birthday and matching problems | ps-d-committee, ps-d-multinomial, ps-d-birthday |
| 03 | ps-conditional | Conditional probability and Bayes' theorem | Conditional probability; Bayes' theorem | ps-d-chain-draws, ps-d-total-bayes, ps-d-diagnostic |
| 04 | ps-independence | Independence | Independence | ps-d-reliability, ps-d-at-least-one |
| 05 | ps-discrete-rv | Discrete random variables, expectation and variance | Random variables and pmfs; Expectation and variance | ps-d-pmf-moments, ps-d-linear-rv, ps-d-lotus |
| 06 | ps-binomial | Bernoulli, binomial and hypergeometric distributions | Binomial distribution; Hypergeometric distribution | ps-d-binom-prob, ps-d-hypergeom |
| 07 | ps-geometric | Geometric and negative binomial distributions | Geometric distribution; Negative binomial distribution | ps-d-geom, ps-d-negbin |
| 08 | ps-poisson | The Poisson distribution | Poisson distribution; Poisson process | ps-d-poisson-prob, ps-d-poisson-approx, ps-d-poisson-process |
| 09 | ps-mgf | Moment generating functions | Moment generating functions | ps-d-mgf-write, ps-d-mgf-identify, ps-d-mgf-sum |
| 10 | ps-continuous-rv | Continuous random variables | Densities and cdfs; Continuous expectation | ps-d-pdf-constant, ps-d-pdf-moments, ps-d-cdf-quantile |
| 11 | ps-uniform-exponential | The uniform and exponential distributions | Uniform distribution; Exponential distribution | ps-d-uniform, ps-d-exponential, ps-d-exp-poisson |
| 12 | ps-normal | The normal distribution | Normal distribution; Normal approximation | ps-d-normal-prob, ps-d-normal-quantile, ps-d-normal-approx |
| 13 | ps-gamma-beta | The gamma and beta distributions | Gamma distribution; Beta distribution | ps-d-gamma-integral, ps-d-gamma-dist, ps-d-beta |
| 14 | ps-transformations | Functions of a random variable | Functions of a random variable | ps-d-cdf-method, ps-d-change-of-variables, ps-d-inverse-transform |

All lessons link `ps-ref-probability`.

## Counts

- Lessons: 14 (about 1,000–1,550 words of prose each, not counting figure JSON), each with
  derivations, 2–5 worked examples, figures, Common mistakes and Key points.
- Questions: 175 (ps-m1 52, ps-m2 60, ps-m3 63; 12–13 per lesson), 52 marked `module_quiz`
  (3–5 per lesson; every lesson topic is covered in its module quiz).
  Answer positions overall: index 0: 43, 1: 42, 2: 46, 3: 44.
- Drills: 38 (2–3 per lesson).
- Notecards (`cards-a.yaml`): 104. Glossary (`glossary-a.yaml`): 110 terms; every bolded term in
  lessons 01–14 links to a glossary entry (checked against the built JSON).
- Reference sheet: `references/probability.md` — probability rules, counting, expectation,
  discrete and continuous distribution tables (pmf/pdf, mean, variance, MGF), transformations.

## Verification

- Every numeric question key was recomputed in Python (scipy/sympy) and each distractor checked
  not to equal the key; conceptual keys were reviewed by hand.
- Every drill was generated 500 times with `generate()`; each target was compared with an
  independent calculation written separately (brute-force counting, direct sums, Simpson
  integration, bisection for quantiles), and the displayed answer was typed back through
  `checkAll()` and accepted. Script: /tmp/claude-0/ps-a/verify-drills.mts with
  /tmp/claude-0/ps-a/expect.mts.
- `tests/check-course.mts` passes on a part-A-only build and on the full course build.

## Notes for a reviewer

- Lesson 10 adapts the old draft `/tmp/claude-0/stats-extra/27-continuous-random-variables.md`
  (example 1 and some questions/the `pdf-constant` and `uniform` drills); uniform/exponential
  material moved to lesson 11 and the level was raised (tail formula, heavy tails, Cauchy).
- Conventions used throughout: geometric counts *trials* (mean $1/p$); exponential uses the rate
  $\lambda$; gamma uses shape $\alpha$ and *scale* $\theta$ (changed from $\beta$ in review); $\text{N}(\mu, \sigma^2)$ has the variance second.
  Other writers should match these when they cite part A.
- Results stated with a forward reference to Module 4 (proved there): $E(XY) = E(X)E(Y)$ for
  independent variables (used for $M_{X+Y} = M_X M_Y$), additivity of variances for independent
  sums, and the covariance derivation of the hypergeometric variance. Lesson 13 cites the
  beta–gamma identity without proof.
- Lesson 12 uses one double integral in polar coordinates (Gaussian integral).
- Drills that use `integ()` (pdf-moments, pdf-constant, beta) and `sum()`/`prod()`
  (gamma-dist, birthday) were checked against independent closed forms.
- Large integers inside math use `{name:dp0}` to avoid thousands separators inside TeX.


# Probability and Statistics — part B progress (lessons 15–27)

Owner of: lessons/15–27, questions/ps-m4–m6.yaml, drills/ps-m4–m6.yaml, cards-b.yaml, glossary-b.yaml,
references/estimation.md (id `ps-ref-estimation`). Status: **complete**; the full course builds and
`check-course` reports OK (built 2026-10-16 together with parts A and C).

## Outline

| # | Lesson id | Title | Topics | Drills |
|---|---|---|---|---|
| 15 | ps-joint-dist | Joint distributions and marginals | Joint distributions | ps-d-joint-table, ps-d-joint-triangle |
| 16 | ps-conditional-indep | Conditional distributions and independence | Conditional distributions; Independence of random variables | ps-d-cond-table, ps-d-cond-density, ps-d-exp-race |
| 17 | ps-covariance | Expectation, covariance and correlation | Covariance and correlation | ps-d-cov-table, ps-d-cov-triangle, ps-d-var-lincomb |
| 18 | ps-sums | Sums of independent random variables | Sums of random variables | ps-d-sum-normal, ps-d-sum-poisson, ps-d-sum-exp |
| 19 | ps-cond-expectation | Conditional expectation; total expectation and variance | Conditional expectation | ps-d-mixture, ps-d-random-sum, ps-d-poisson-mix |
| 20 | ps-bivariate-normal | Bivariate normal and order statistics | Bivariate normal; Order statistics | ps-d-bvn-cond, ps-d-bvn-sum, ps-d-order-exp |
| 21 | ps-lln | Markov, Chebyshev, weak law of large numbers | Probability inequalities; Law of large numbers | ps-d-chebyshev, ps-d-lln-n |
| 22 | ps-clt | Central Limit Theorem | Central Limit Theorem | ps-d-clt-sum, ps-d-clt-binom, ps-d-clt-poisson-mean |
| 23 | ps-sampling-normal | Sampling distributions: chi-square, t, F | Sampling distributions | ps-d-chi2-s2, ps-d-t-prob, ps-d-f-ratio |
| 24 | ps-point-estimators | Bias, variance, MSE, consistency, efficiency, CRLB | Properties of estimators | ps-d-mse, ps-d-uniform-estimators, ps-d-crlb |
| 25 | ps-mle | Method of moments and maximum likelihood | Method of moments; Maximum likelihood | ps-d-mle-exp, ps-d-mle-normal, ps-d-mom-uniform |
| 26 | ps-confidence-intervals | Confidence intervals from pivots | Confidence intervals | ps-d-ci-t, ps-d-ci-var, ps-d-ci-pooled |
| 27 | ps-bayes-inference | Introduction to Bayesian inference | Bayesian inference | ps-d-beta-binomial, ps-d-normal-normal, ps-d-gamma-poisson |

## Counts

- 13 lessons, ~1,020–1,260 words of prose each (display math and figures excluded), 2–4 worked
  examples, Common mistakes and Key points in each; 16 figures (joint-density regions, conditional
  densities, triangular convolution, bivariate-normal scatter with regression line, max-of-uniforms
  densities, running proportion of heads, CLT densities, simulated chi-square histogram, t vs normal,
  estimator sampling distributions, Poisson and uniform likelihoods, 25 simulated confidence
  intervals, prior/likelihood/posterior curves).
- 156 questions (12 per lesson; 48 with module_quiz, ≥3 per lesson, every topic covered). Correct
  positions exactly 3/3/3/3 in every lesson.
- 37 drills; 102 notecards (cards-b.yaml); 75 glossary terms (glossary-b.yaml); 1 reference sheet.

## Verification

- Every computational question key recomputed in Python (scipy/sympy) with scripts that also check
  no distractor equals the key; conceptual ones re-read.
- Drills: each generated 400 times with `generate()`; the displayed answer and the full-precision
  target were typed through `checkAll()` and accepted; every target matched an independent Python
  calculation (numerical double integrals, convolutions, numerical posteriors, optimizers for MLEs).
- Lesson worked-example numbers checked in Python; scatter/histogram/interval figures were simulated
  with fixed seeds.

## Notes for a reviewer

- Conventions match part A: N(μ, σ²) with variance second; geometric counts trials; gamma written
  with shape and **scale** (chi-square = shape ν/2, scale 2). The Bayesian gamma–Poisson prior is
  stated as shape α, rate β (scale 1/β), since that is the standard conjugate form; it is labeled each time.
- Lesson 17 proves "variances of independent sums add" (part A defers the proof to Module 4).
- Bolded terms that already live in glossary-a.yaml (chi-square distribution, degrees of freedom,
  continuity correction) are linked to A's entries rather than duplicated. No term or alias in
  glossary-b collides with glossary-a or glossary-c.
- Lesson 26 mentions the Wilson interval and Welch's t only briefly; part C covers Welch in testing.
- Several MoM-uniform drill instances produce a MoM estimate below the sample maximum; that is
  deliberate and discussed in the solution text.


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


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every derivation checked with sympy/scipy, every drill generated hundreds of times against an independent solver. All answer keys were correct.

# Review of probstats part A (ps-m1 to ps-m3)

Scope: lessons 01–14, questions/ps-m1..m3.yaml (175 questions), drills/ps-m1..m3.yaml (38 drills),
cards-a.yaml, glossary-a.yaml, references/probability.md.

## Method
- Every question solved independently before the keys were compared (all 175 keys matched);
  distractor values and explanation arithmetic recomputed in Python (scipy).
- Every lesson derivation and worked example rechecked (numbers in Python).
- All 14 lessons' figures rendered with renderFigure plus the app stylesheet and screenshotted (Chromium).
- Each drill generated 300–400 times; every answer recomputed from the prompt text as shown
  (verify.py, separate code: brute-force counting, scipy distributions, quad integration); shown answers
  typed back through checkAll (fractions as text, expressions typed by hand); every unformatted or
  formatted placeholder checked for silent rounding (precision.mts).

## Fixes

### Drills: prompt showed values different from those used (wrong answers for the shown numbers)
- ps-d-diagnostic: default formatting rounds to 2 decimals, so prevalence 0.001/0.002 showed as "0",
  0.005 as "0.01", specificity 0.995 as "1", and the solution's 1 − prevalence and false-positive rate
  were rounded too. Now sig3/sig4 formats.
- ps-d-poisson-approx: p = 0.001…0.005 showed as "0" or "0.01" in prompt and solution. Now `{p:sig3}`.
- ps-d-normal-quantile: p = 0.975 showed as "0.98" (answer computed for 0.975). Now `{p:sig4}`.

### Drills: placeholder traps / broken TeX in solutions
- ps-d-geom: `\sqrt{q}/p` printed as `\sqrt0.9/p`; now `\sqrt{\,q}/p`.
- ps-d-normal-quantile: `z_{p}` printed as `z_0.975`; rewritten as `z = \Phi^{-1}(p)`.
- ps-d-gamma-dist: `\sqrt{k}` (meant the letter k) printed the number; now `\sqrt{\,k}`.

### Drills: ugly output and grammar
- ps-d-linear-rv: `Y = 3X + 0` possible; added `where b != 0`.
- ps-d-mgf-write / ps-d-mgf-identify: `e^{1t}`, `e^{-1t}`; now coef formats.
- ps-d-change-of-variables: `1\,y\,e^{-0.5y^2}` and `1e^{-1y^2}`; now coef formats.
- ps-d-gamma-dist: "the 2th/3th failure" → "failure number k"; "at most 1 failures" → "fewer than k failures".
- ps-d-poisson-process, ps-d-mgf-sum: "exactly 1 requests/breakdowns" → ask for P(N = k), P(T = k).
- ps-d-exp-poisson: "in 1 hours" → "in a 1-hour period".
- ps-d-pdf-constant (x^{1}), ps-d-pdf-moments (12/1^4), ps-d-gamma-integral (x^{1}, e^{-x/1}),
  ps-d-inverse-transform ((x/1)^{1}): dropped the degenerate parameter values.

### Notation consistency (course convention: Gamma(α, θ), scale θ)
- Lesson 13 used β for the gamma scale throughout. Changed to θ in lesson 13 (text, formulas, figure
  caption, key points), lesson 14 (Z² example), lesson 11 (exponential mean parametrization),
  questions ps-q-1303/1304, cards, glossary (gamma distribution, scale parameter), reference sheet,
  and drills ps-d-gamma-integral/ps-d-gamma-dist. Lesson 13 now notes that some texts write the
  scale as β and some use the rate. PROGRESS-a.md convention line updated.

### Figures
- Lesson 13 gamma and beta figures: the three curve labels were all drawn on top of each other at the
  right edge (unreadable). Replaced by text labels next to each curve; beta y-range raised to 2.9.

### Reference sheet
- Discrete tail-sum formula listed under "X ≥ 0" without saying it needs integer values; added.

## Verified correct (no change)
- All 175 question keys, distractors and explanations; no positional references; no Markdown.
- All lesson derivations and worked examples (lessons 1–14); other figures match their text.
- cards-a.yaml and glossary-a.yaml content.

## Outside my area (not edited)
- ps-m6 / lesson 27 (Bayesian inference) and ps-q-2708 write Gamma(α, β) with β a *rate*. It is labeled
  as a rate there, but it conflicts with the course convention Gamma(α, θ) with scale θ; the part-C/B
  reviewer may want to rename it (e.g. Gamma with shape α and rate β written explicitly, or use θ = 1/β).

## Final state
- `python3 content/math/build.py probstats` and
  `npx tsx tests/check-course.mts samples/math-drafts/math-probstats.json`: OK, zero problems.
- Scripts: /tmp/claude-0/review-ps-a/{gen.mts, verify.py, precision.mts, expr.mts, figs.mts}.

# Review of probstats part B (lessons 15–27, ps-m4–m6)

All 156 question keys were solved independently before the keys were read. Every key is correct and each question has exactly one correct choice. Every lesson's worked numbers were checked with scipy or sympy. The 37 drills were generated 300–400 times each, and every target matched an independent Python calculation (dblquad, scipy distributions, optimizers). Every displayed answer was accepted when typed. The 16 lesson figures were rendered with the app CSS and screenshotted.

## Questions (explanations only; no key was wrong)
- 1502: the source of the 0.65 distractor was misdescribed.
- 1507, 1606, 2208, 2507: these referred to choices by position ("last integral", "first and third", "last choice", "second choice"). Each now names the choice by its content.
- 1701: the source of the −3 distractor was wrong. It comes from subtracting in the wrong order, not from a sign slip.
- 2002: the 5 distractor is 20(1 − ρ). It was misdescribed.
- 2005: 7 comes from *adding* the SDs, not subtracting them.
- 2105: the e^{-12} distractor was misdescribed.
- 2503: the e^{-0.5} distractor explanation used an invented λ = 1/20.

## Lessons
- L17: the equality case of the |ρ| ≤ 1 proof said Var(U ∓ V) = 0. It should be ±.
- L21: the Monte Carlo variance 0.040 did not match n ≥ 8100. It is now 0.0404 (≈ 0.5981 − 0.5577).
- L25: called (n+1)/n·X_(n) "the efficient estimator". "Efficient" means attaining the CRLB, which does not apply to this non-regular family, so the wording was changed.
- L22, L23 (t densities), L24, L27: the curve labels were stacked on top of each other at the right edge and could not be read. The labels were removed and the captions now identify each curve.

## Drills
- Normal-table probabilities in ps-d-sum-normal, clt-sum, clt-binom, clt-poisson-mean, bvn-cond and bvn-sum: a learner following the solution's 2-decimal z could miss by up to 0.00195. The tolerance was 0.001, so about a third of sum-normal instances would reject the solution's own route. The tolerance is now 0.0025.
- ps-d-lln-n: the CLT n changes by 1 depending on how z is rounded (1.6449 vs 1.64485). The tolerance is now 1, and the solution says so.
- ps-d-joint-triangle, ps-d-cond-density: removed ugly output in the solutions ("y^{1}", "x^{1}", "(1 + 1)").
- ps-d-order-exp: the prompt did not say how to round the mean. It now asks for 2 decimals.
- ps-d-sum-exp: the prompt could read "mean 1 hours". Reworded.
- ps-d-clt-binom: "at most k starts at k + 0.5" now reads "the cutoff is".
- ps-d-mom-uniform: removed "efficient" (same reason as L25).
- ps-d-beta-binomial: added `where` so that 0 < x < n, which avoids θ^{0} and degenerate data.

## Cards, glossary, reference sheet
All entries checked, including the geometric Fisher information 1/(p²(1−p)). No errors found.

## Outside my scope
Nothing noticed.

Build and check-course: OK, zero problems.

# Review of probstats part C (ps-m7, ps-m8)

Verified independently (scipy): all 91 question keys/distractors/explanations; every worked example in lessons 28-34;
all 16 lesson figures rendered and screenshotted; all 21 drills generated 300-400x each with answers recomputed from
the prompt text as shown (all matched; shown answers accepted); cards-c, glossary-c, references/testing.md.

## Fixes
1. questions/ps-m8.yaml ps-q-3406: distractor "90 and 126.7" was explained as the second sample's mean n(N+1)/2,
   which is 95, not 90. Changed the choice to 95 so it matches the stated mistake.
2. lessons/30: "S ~ Gamma(n, lambda)" contradicted the course's scale convention; now Gamma(n, 1/lambda) (scale 1/lambda).
3. lessons/33 intro: "chance ... can be as high as 1 - 0.95^3 = 0.14" was wrong (that is the independent-tests value;
   the upper bound is 0.15). Reworded.
4. lessons/34: ARE sentence "about 95 observations do the work of 100" was ambiguous about direction; made explicit
   (t needs ~95 where Wilcoxon needs 100).
5. lessons/34: "it moves a rank by at most its position" (outlier robustness) was unclear/incorrect; reworded.
6. drills/ps-m8.yaml ps-d-pred-interval: prompt used {b1v:signed}x, giving "+ 1x" when b1 = 1; now signedcoef.
7. drills/ps-m8.yaml ps-d-slope-test and ps-d-anova-table: p-values could display as "0"; added where pv >= 0.0005.

## Unresolved / notes
- None in scope. Minor cosmetic: ANOVA boxplot "grand mean" label slightly overlaps box B (left as is).


## Gap lessons (2026-10-17)

Fills the VERIFY.md "common" gaps on Rao–Blackwell/MVUE/completeness and on the bootstrap, and makes the
sections added during the source check (sufficiency and the delta method in lesson 25, the multinomial
distribution in lesson 33 (was 31), the two-variable Jacobian in lesson 18) quizzable.
Totals now: 36 lessons, 459 questions, 105 drills, 289 cards, 269 glossary terms, 3 reference sheets.
Build and check-course: zero problems.

### New lessons
| File | id | Module | Title |
|---|---|---|---|
| lessons/26-rao-blackwell-mvue.md | ps-mvue | ps-m6 | Rao–Blackwell, completeness and minimum-variance unbiased estimators (Bernoulli, Poisson, normal, uniform, exponential examples; exponential families) |
| lessons/28-bootstrap.md | ps-bootstrap | ps-m6 | The bootstrap and resampling (empirical distribution, bootstrap SE and bias, exact small cases, percentile intervals, limits, parametric bootstrap, permutation preview) |

Placed after MLE (25) and after confidence intervals (now 27). Renumbered files (ids unchanged): old 26 is now 27;
old 27–34 are now 29–36. No lesson text used file numbers; relative references were updated:
lesson 24 (pointer to "the lesson after next"), lesson 25 (sufficiency paragraph now points to the next lesson; key points
gained delta-method and factorization lines), lesson 27 (pivot recipe now cites the chi-square/t/F lesson; points to the
bootstrap; "credible intervals, two lessons on"), lesson 29 ("confidence intervals of two lessons ago"), lesson 36
(permutation section notes the bootstrap-lesson preview). questions/ps-m6.yaml section comments renumbered.
Both new lessons link ps-ref-estimation. course.yaml: description mentions MVUEs and the bootstrap; modules unchanged;
id/revision/released/order/subject/level/type untouched.

### New questions (37)
- ps-mvue: ps-q-2551 – ps-q-2562 (12; module quiz 2551, 2553, 2555, 2559). Topic "Minimum-variance unbiased estimation".
- ps-bootstrap: ps-q-2651 – ps-q-2662 (12; module quiz 2651, 2653, 2656, 2662). Topic "Bootstrap and resampling".
- Task B, ps-mle (sufficiency, factorization, delta method): ps-q-2513 – ps-q-2517 (5; module quiz 2513, 2516).
- Task B, ps-proportions-chisq (multinomial): ps-q-3114 – ps-q-3117 (4; module quiz 3114).
- Task B, ps-sums (Jacobian): ps-q-1813 – ps-q-1816 (4; module quiz 1813).
- Correct positions across the 37: 0×9, 1×9, 2×10, 3×9 (each new lesson exactly 3/3/3/3).

### New drills (9)
- ps-m6: ps-d-umvue-bernoulli, ps-d-umvue-poisson, ps-d-umvue-exp (lesson 26); ps-d-boot-se-mean, ps-d-boot-median3,
  ps-d-permutation-p (lesson 28); ps-d-delta-method (lesson 25).
- ps-m7: ps-d-multinom-dist (lesson 33). ps-m4: ps-d-jacobian (lesson 18).

### Also added
- glossary-d.yaml (14 terms): minimum-variance unbiased estimator (MVUE/UMVUE), Rao–Blackwell theorem, Rao–Blackwellization,
  complete statistic (alias "complete"), Lehmann–Scheffé theorem, exponential family, bootstrap, empirical distribution,
  plug-in principle, bootstrap sample, bootstrap replicate, bootstrap standard error, percentile interval, parametric bootstrap.
- cards-d.yaml (15 cards): 1 two-variable Jacobian, 8 MVUE, 6 bootstrap. New files (sorted after a/b/c) so existing
  card ids, which are numbered in file order, do not shift.
- references/estimation.md: Rao–Blackwell, completeness, Lehmann–Scheffé and exponential-family rows; an MVUE table;
  a "Bootstrap and resampling" section.

### Verification
- Every new question solved in Python before fixing keys (/tmp/claude-0/gaps/probstats/keycheck.py: fractions, sympy
  Jacobians, scipy multinomial/Poisson sums, itertools enumeration of bootstrap and permutation cases); distractors checked wrong.
- Lesson numbers checked (UMVUE values, variance curves, ideal bootstrap SEs, exact median-of-3 distribution, exact
  bootstrap-median distribution for n = 15, permutation count); the histogram is one seeded run (numpy seed 2026, B = 2000).
- Each new drill generated 600 times (/tmp/claude-0/gaps/probstats/drills.mts): targets match an independent solver that
  reads the prompt as shown (full 5^5 resample enumeration, 27-sample enumeration, 20-subset enumeration, finite-difference
  Jacobians, direct multinomial pmf); shown answer and a rounded answer accepted; a wrong answer rejected; no "+ -",
  "1X", "^{1}" or comma-grouped numbers inside math.
- Lesson figures rendered (renderFigure) and screenshotted.

### Notes for a reviewer
- course.yaml revision not bumped (not allowed in this task); whoever releases should bump it and mention the two lessons.
- Lessons 18, 25 and 33 now link 4 drills each (AUTHORING suggests 1–3).
- The bootstrap lesson comes before Module 7, so its permutation section is a short *preview* (p-value described
  informally, "formalized in the next module"), not a recap; lesson 36 keeps the full treatment and now refers back.
- Lesson 26 states without proof that exponential-family statistics are complete when the natural parameter fills an
  interval, and that (ΣX, ΣX²) is complete for the two-parameter normal; Bernoulli, Poisson and uniform completeness are proved.
- Lesson 28 example 3 reports one simulation run (SE 0.49, interval 1.2 to 3.5); the exact bootstrap distribution gives
  SE 0.48 and lower 2.5% point 1.1, which the lesson mentions as Monte Carlo variation.
- Pre-existing glossary duplicates (not from this work): "central limit theorem", "p-value", "r-squared" each appear twice
  across glossary files.
