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
