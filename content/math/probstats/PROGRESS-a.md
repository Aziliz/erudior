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
  $\lambda$; gamma uses shape $\alpha$ and *scale* $\beta$; $\text{N}(\mu, \sigma^2)$ has the variance second.
  Other writers should match these when they cite part A.
- Results stated with a forward reference to Module 4 (proved there): $E(XY) = E(X)E(Y)$ for
  independent variables (used for $M_{X+Y} = M_X M_Y$), additivity of variances for independent
  sums, and the covariance derivation of the hypergeometric variance. Lesson 13 cites the
  beta–gamma identity without proof.
- Lesson 12 uses one double integral in polar coordinates (Gaussian integral).
- Drills that use `integ()` (pdf-moments, pdf-constant, beta) and `sum()`/`prod()`
  (gamma-dist, birthday) were checked against independent closed forms.
- Large integers inside math use `{name:dp0}` to avoid thousands separators inside TeX.
