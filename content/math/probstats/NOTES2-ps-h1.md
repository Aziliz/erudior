# NOTES2-ps-h1: Honors module ps-h1, Modern statistical methods

`content/math/check-module.sh probstats ps-h1`: build and checker report **zero problems**
(4 lessons, 55 questions, 11 drills, 40 cards).

## What was added

**Lessons** (module `ps-h1`; the module is already `honors: true` in course.yaml). The four are cross-cutting
capstones: each combines material from several core modules (MSE and Bayes; regression and
bias–variance; testing, p-values and ANOVA multiple comparisons; Bayes, LLN/Monte Carlo and
transformations).

| File | Id | Min | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 90-james-stein-shrinkage.md | ps-h1-james-stein | 45 | ~1,600 | 3 (best constant c*; five means toward 0; eight track sections toward the grand mean) + full proof of Stein's risk formula via Stein's lemma | ps-h1-js-risk.svg (risk curves, p = 10); `shape` figure of raw vs shrunk estimates | ps-h1-r2-js-factor, ps-h1-r2-js-grand |
| 91-ridge-lasso-cross-validation.md | ps-h1-ridge-lasso | 45 | ~1,430 | 3 (ridge bias–variance with λ* = σ²/β²; ridge and lasso on the core rail-wear data; reading a CV table with the one-SE rule) | `plot` of bias², variance, MSE vs λ; ps-h1-lasso-ridge.svg (diamond vs disk geometry); Mermaid K-fold CV flowchart | ps-h1-r2-ridge-1d, ps-h1-r2-lasso-1d, ps-h1-r2-ridge-mse |
| 92-multiple-testing-fdr.md | ps-h1-multiple-testing | 45 | ~1,520 | 2 (Bonferroni 2 / Holm 3 / BH 5 rejections on one list; expected false-discovery share in a screen) + Holm proof, BH motivation | ps-h1-bh-plot.svg (BH line, Holm and Bonferroni thresholds); outcome table; Mermaid "which error rate" chart | ps-h1-r2-fwer, ps-h1-r2-bh-count, ps-h1-r2-holm-count, ps-h1-r2-expected-fdp |
| 93-markov-chain-monte-carlo.md | ps-h1-mcmc | 50 | ~1,530 | 3 (four-state Metropolis chain with full transition matrix; three MH steps on a Poisson/half-Cauchy posterior; ESS and Monte Carlo SE) + detailed-balance proofs | Mermaid MH iteration flowchart; ps-h1-mcmc-trace.svg (seeded trace plot with burn-in) | ps-h1-r2-mh-accept, ps-h1-r2-ess |

*Prose only (display math, figures, Mermaid and alt text removed); raw body 1,800–1,970 words.

Refs: ps-ref-estimation (90, 93), ps-ref-testing (91, 92).

**Questions** (`questions/r2-ps-h1.yaml`, ps-h1-r2-h01 … h55): 55 total; 13 / 14 / 14 / 14 per lesson.
- 32 four-choice MC, correct positions exactly 2/2/2/2 in every lesson (8/8/8/8 overall).
- 23 other types (42%): 8 text, 4 select-all, 4 match, 3 order, 4 label (one per lesson).
- `module_quiz: true` on 19 (4 / 5 / 5 / 5), covering every lesson's main skills.

**Pictures**: 4 original SVGs, each with a `-blank` copy for its label question (all under 12 KB,
previewed with markers): ps-h1-js-risk, ps-h1-lasso-ridge, ps-h1-bh-plot, ps-h1-mcmc-trace.
Curves are computed, not sketched: the James–Stein risk from the Poisson-mixture formula for
E[1/noncentral χ²] (checked by simulation, 400,000 runs at ‖θ‖² = 10: 6.206 vs 6.209), the lasso/ridge
contact points by constrained optimization, the trace plot from a seeded run (numpy seed 2, step 1.2,
start 9). **Mermaid**: 3 (lessons 91, 92, 93), each with accTitle/accDescr, previewed. **Plots/shapes**: 2.

**Drills** (`drills/r2-ps-h1.yaml`, 11): listed above. Each generated 1,000 times from the built JSON:
targets matched an independent re-implementation, the shown answer and the full-precision target were
accepted, a clearly wrong answer was rejected, and no NaN, "+ -" or comma-grouped numbers appear in
math. BH and Holm count drills keep every p-value at least 0.0004 from its threshold (no
floating-point ties) and produce every count from 0 to 6.

**Glossary** (`glossary-r2-ps-h1.yaml`): 37 terms, none duplicating a term or alias in any other
glossary file (checked against all, including other writers' r2 files present at the time).
**Cards** (`cards-r2-ps-h1.yaml`): 40 (10 per lesson).

## For a reviewer to double-check

- **Overlap with the ps-m6 honors lesson 29h2 (decision theory).** That lesson bolds and (presumably)
  defines *risk function* and *admissible*, and ends by pointing to this module for Stein's paradox. Lesson 90
  therefore uses those words unbolded, defines them briefly in the text, and points back to 29h2. If the
  ps-m6 glossary does not end up defining them, bold them again in lesson 90 and add entries.
- **"burn-in"** is already a glossary term (reliability sense, glossary-r2-ps-m3). Lesson 93 bolds
  **burn-in period** (MCMC sense, own entry) so the pop-up is not the reliability definition.
- The ps-m8 honors lesson (36h1) defines *design matrix* and *hat matrix*; lesson 91 uses matrix notation
  without bolding those terms and describes the hat-matrix diagonal in words.
- Results stated without proof, and labeled so: admissibility of X for p = 1, 2; the positive-part estimator
  dominates James–Stein; the grand-mean version dominates for p ≥ 4; BH's FDR = m₀q/m under independence and the
  Benjamini–Yekutieli results; the ergodic theorem (labeled "simplified form": irreducible + aperiodic); the
  0.23 / 0.44 acceptance-rate guidelines (labeled as rough guides from idealized theory).
- Lasso penalty convention: RSS + λΣ|β| (so the one-predictor threshold is λ/2). The lesson warns that software
  (e.g. ½n-scaled criteria) uses different λ scales.
- ESS formula N(1 − ρ)/(1 + ρ) is the AR(1) approximation and is labeled as such.
- Example data (eight track sections, CV table, 1,000-test screen, Poisson counts 12 in 5) are invented and
  presented as illustrations; the rail-wear numbers (S_xx = 70, S_xy = 46.4) come from core lesson 34.
- Question h36 accepts 0.00625 (fractions such as 1/160 compare by value automatically, as the brief states).

## Errors found in existing content

None found in the lessons read (24, 29, 34, 35, 21, 29h2).

## Sources

- Stein, C. (1956), Inadmissibility of the usual estimator for the mean of a multivariate normal distribution,
  Proc. Third Berkeley Symp.; James, W. and Stein, C. (1961), Estimation with quadratic loss, Proc. Fourth
  Berkeley Symp.; Efron, B. and Morris, C. (1973, 1975), JASA, on Stein's estimator and empirical Bayes.
- Hoerl, A. E. and Kennard, R. W. (1970), Ridge regression, Technometrics 12; Tibshirani, R. (1996), Regression
  shrinkage and selection via the lasso, JRSS B 58; Hastie, Tibshirani and Friedman, *The Elements of Statistical
  Learning* (cross-validation, one-SE rule).
- Holm, S. (1979), Scand. J. Statist. 6; Benjamini, Y. and Hochberg, Y. (1995), JRSS B 57; Benjamini, Y. and
  Yekutieli, D. (2001), Ann. Statist. 29.
- Metropolis, N. et al. (1953), J. Chem. Phys. 21; Hastings, W. K. (1970), Biometrika 57; Geman, S. and Geman, D.
  (1984), IEEE PAMI; Gelfand, A. and Smith, A. F. M. (1990), JASA; Gelman, A. and Rubin, D. (1992), Statist. Sci.;
  Roberts, G. O., Gelman, A. and Gilks, W. R. (1997), Ann. Appl. Probab. 7.
- Every number in the lessons, questions and figures was recomputed in Python (numpy/scipy/fractions).
