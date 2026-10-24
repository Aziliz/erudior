# Round 2 notes: module ps-m6 (Estimation)

`content/math/check-module.sh probstats ps-m6`: build and checker report zero problems
(10 lessons, 166 questions, 30 drills, 84 cards).

## Added

**Honors lessons** (all `honors: true`, `module: ps-m6`, 45 min; three, since the module has seven core lessons)
- `lessons/29h1-fisher-information-numerical-mle.md` (`ps-m6-h-numerical-mle`), "Fisher information at
  work: numerical MLEs and standard errors", ~1,700 words: the score's mean 0 and variance $nI$; a
  Taylor/CLT/LLN sketch of why the MLE is approximately normal (labeled a sketch, not a proof); observed vs
  expected information (Efron and Hinkley 1978); Wald interval; Newton's method and Fisher scoring;
  zero-truncated Poisson fault log (no closed form: Newton table from 1.5, overshoot, convergence to 0.874;
  scoring path; SE 0.369; Wald (0.151, 1.597) vs likelihood interval (0.326, 1.773); delta method for
  $e^{-\lambda}$); multiparameter information matrix; gamma (shape, scale) example with trigamma, SEs from the
  inverse (0.371, 0.422, correlation −0.88) vs naive 0.176, 0.2. Three worked examples; Newton plot.
- `lessons/29h2-decision-theory-shrinkage.md` (`ps-m6-h-decision-shrinkage`), "Loss, risk and
  admissibility: decision theory for estimators", ~1,780 words: loss and risk; crossing risk curves for three
  binomial estimators ($n = 16$); domination and admissibility ($S^2$ inadmissible; a constant guess
  admissible); Bayes risk and Bayes estimators (mean/median/mode for squared/absolute/zero–one loss, with
  proofs); minimax and the constant-risk-Bayes theorem (proved); the binomial minimax estimator
  $(X + \sqrt n/2)/(n + \sqrt n)$; linear shrinkage of a normal mean toward a prior guess (risk formula,
  break-even distance, Bayes risk = posterior variance, uniqueness ⇒ admissibility proof, $\bar X$ minimax
  stated with the limiting argument only sketched). Three worked examples, two risk plots.
  **Stein's paradox was deliberately left out** (one closing paragraph points to it) because the honors
  module's lesson 90 (`ps-h1-james-stein`) covers James–Stein, admissibility and empirical Bayes in full.
- `lessons/29h3-proportion-intervals.md` (`ps-m6-h-proportion-intervals`), "Intervals for a proportion:
  coverage under the microscope", ~1,750 words: exact coverage $C(p)$ for discrete data (worked $n = 5$
  table, coverage 0.801); why Wald fails, including the erratic-in-$n$ examples (p = 0.2: n = 23 → 0.951,
  n = 24 → 0.873; p = 0.005: n = 591 → 0.945, n = 592 → 0.792, matching Brown, Cai and DasGupta 2001);
  Wilson derivation (and its identity with the score interval, cross-referenced to ps-m7's 33h1);
  Agresti–Coull; Clopper–Pearson (inverting exact tests, beta quantiles, conservative); Jeffreys; worked
  intervals for 2 of 20 (all five methods) and zero failures in 30 (exact bound, rule of three, Wilson).
  Coverage-curve SVG (Wald, Wilson, Clopper–Pearson, n = 20).

**Core lessons 23–29** (additions only, nothing rewritten)
- 23: new short section "How the families fit together": Mermaid (how chi-square, t, F are built from
  normals) and the four-densities picture (SVG).
- 24: bias/variance target picture (SVG) with a short introduction.
- 25: MLE procedure flowchart (Mermaid, including the support-depends-on-θ branch); Poisson
  log-likelihood plot with horizontal tangent at the MLE.
- 26: MVUE recipe flowchart (Mermaid: sufficiency → completeness → guess or Rao–Blackwellize →
  Lehmann–Scheffé).
- 27: pivot-areas picture (SVG, central 1 − α and α/2 tails); "Choosing the interval" section with a
  decision chart (Mermaid).
- 28: resampling picture (SVG: data 3, 5, 6, 10 and three resamples); bootstrap algorithm flowchart (Mermaid).
- 29: Bayesian updating cycle (Mermaid); "priors wash out" plot (Beta(2, 8) and Beta(8, 2) priors, posteriors
  after 30 of 100).

**Pictures** (8 original SVGs, all under 28 KB, all rendered and checked; label markers previewed):
ps-m6-families(+blank), ps-m6-targets(+blank), ps-m6-pivot-areas(+blank), ps-m6-resampling,
ps-m6-h-coverage (exact coverage computed in Python).
**Diagrams**: 6 Mermaid (lessons 23, 25, 26, 27, 28, 29), each with accTitle/accDescr, all rendered.
**Plots**: 5 new ```plot figures (lessons 25 and 29; one in 29h1, two in 29h2; 29h3 uses the SVG).

**Questions** (`questions/r2-ps-m6.yaml`, 77)
- Core ps-m6-r2-q01…q35 (5 per lesson): label 3 (q01, q06, q21), text 10 (q02, q07, q10, q12, q15, q17,
  q22, q27, q30, q32), match 7 (q03, q09, q14, q19, q25, q29, q34), order 6 (q05, q11, q16, q23, q26, q31),
  select-all 7 (q04, q08, q13, q18, q24, q28, q33), MC 2 (q20, q35). module_quiz: 2 per lesson (q01, q05,
  q06, q09, q11, q14, q16, q19, q21, q25, q26, q28, q31, q34).
- Honors ps-m6-r2-h01…h14 (numerical MLE), h15…h28 (decision theory), h29…h42 (proportion intervals):
  25 MC, 5 text, 4 match, 3 order, 5 select-all. MC answer positions (all 27 MC): 0: 6, 1: 8, 2: 7, 3: 6.

**Drills** (`drills/r2-ps-m6.yaml`, 8): newton-step, wald-exp, info-matrix-se (honors 1); binomial-risk,
linear-shrinkage (honors 2); wilson, zero-successes, wald-coverage (honors 3).

**Glossary** (`glossary-r2-ps-m6.yaml`, 19; checked against every glossary*.yaml, no duplicate terms or
aliases): expected information, Wald interval, Newton's method, Fisher scoring, zero-truncated Poisson
distribution, likelihood interval, Fisher information matrix, decision theory, loss function, dominates,
Bayes risk, Bayes estimator, minimax estimator, coverage probability, conservative interval,
Agresti–Coull interval, Clopper–Pearson interval, Jeffreys interval, rule of three.
Bolded terms that link to other writers' entries (not redefined): score function, observed information
(glossary-r2-ps-m7), Wilson interval (glossary-b), risk function, admissible (to be defined by the ps-h1
writer for lesson 90, which bolds both; if that glossary does not include them, these two bolds in 29h2 have
no pop-up).

**Cards** (`cards-r2-ps-m6.yaml`, 28): 11 / 9 / 8 for the three honors lessons.

## For the reviewer
- Every number was recomputed in Python (scipy): Newton and scoring iterates, information values,
  likelihood interval, gamma information matrix (trigamma), binomial risks (also brute-force sums),
  Bayes risks by integration, all interval endpoints and exact coverages, the "lucky/unlucky n" Wald
  coverages, question keys and distractors.
- Drills: each generated 400 times and compared with independent calculations written separately
  (bisection quantiles, brute-force binomial risk, quadratic roots for Wilson); the displayed answer and an
  answer rounded as the prompt asks were typed back through `checkAll()` 1,000 times each and accepted.
- Example 3 in 29h1 uses illustrative gamma estimates ($\hat\alpha = \hat\theta = 2$, $n = 50$), labeled "for illustration".
- 29h2 states without full proof that $\bar X$ is minimax for a normal mean (limiting Bayes argument sketched)
  and the posterior-median result for absolute error (one-line argument).
- Attributions checked: Wald (decision theory, 1940s), Efron and Hinkley (1978), Wilson (1927), Clopper and
  Pearson (1934), Agresti and Coull (1998), Brown, Cai and DasGupta (2001).
- Overlaps handled: 33h1 (ps-m7) also derives the score/information facts and mentions Wald vs Wilson
  intervals in one paragraph; 29h1 focuses on computation and standard errors, 29h3 on coverage, and 29h3
  points to 33h1 for the score-test view.
- The interval decision chart in lesson 27 is a staircase about 880 px wide in the preview; it stays
  readable but is the widest diagram in the module.

## Errors found in existing content
None.

## Sources
Standard results (Casella and Berger, *Statistical Inference*, for the decision-theory and likelihood
material, used only to check statements); Brown, Cai and DasGupta, "Interval estimation for a binomial
proportion", *Statistical Science* 16 (2001); Agresti and Coull, *The American Statistician* 52 (1998);
Efron and Hinkley, *Biometrika* 65 (1978). All examples, data and wording are original.
