# Round 2 notes: module ps-m7 (Hypothesis testing)

`content/math/check-module.sh probstats ps-m7`: build and checker report zero problems
(6 lessons, 104 questions, 18 drills, 60 cards).

## Added

**Honors lessons** (both `honors: true`, `module: ps-m7`, 45 min)
- `lessons/33h1-wald-score-lrt.md` (`ps-m7-h-wald-score-lrt`), "Wald, score and likelihood ratio
  tests", ~1,850 words: score function and observed information; the three statistics and their
  geometry on the log-likelihood; Taylor-expansion proof that they agree to first order (exactly
  for a quadratic log-likelihood); binomial example (the one-proportion z test is the score test;
  at x = 52, n = 400, p0 = 0.10 only the score test rejects at 5%); Poisson example (corrects the
  label in lesson 32, see below); Wald's lack of invariance (log-odds example, Hauck–Donner);
  inverting the tests into Wald, Wilson and LR intervals; Pearson X² / G² / Neyman's χ² as score /
  LR / Wald; practical guidance (labeled as advice, not theorem); history (Wald 1943, Rao 1948,
  Wilks 1938).
- `lessons/33h2-sequential-tests.md` (`ps-m7-h-sprt`), "Sequential testing: Wald's probability
  ratio test", ~1,500 words: SPRT definition (log ratio oriented f1/f0, noted as the reciprocal of
  the NP ratio); derivation of Wald's boundaries and the bounds α' + β' ≤ α + β; Bernoulli
  acceptance-sampling example with parallel boundary lines; two sample lots (reject at clip 12,
  accept at clip 53); Wald's identity and the ASN (39.3 / 33.8) vs the fixed-sample n = 77;
  simulation of true errors and ASN; Wald–Wolfowitz optimality; normal-mean increment; peeking
  (simulated Type I error 0.19 with 10 looks, 0.37 with 100); group sequential designs (Pocock,
  O'Brien–Fleming); truncation and other limits.

**Core lessons 30–33** (additions only; one existing sentence corrected, see below)
- 30: error-regions picture (SVG, α/β/power under two densities) with a short paragraph;
  Mermaid "steps of a test" flowchart.
- 31: plot of the paired locomotive data (one line per locomotive) with a short paragraph; Mermaid
  "choosing the test for normal data" decision chart.
- 32: bar chart of Bin(10, 0.5) vs Bin(10, 0.8) showing the NP region filled in order of the
  likelihood ratio (size 0.055, power 0.678) with a paragraph; Mermaid "building a likelihood
  ratio test" recipe.
- 33: two-way table picture with expected counts in parentheses (SVG); Mermaid "choosing a test
  for count data" chart.

**Pictures** (8 SVGs, original, all < 10 KB, rendered and checked, markers checked on blanks):
ps-m7-error-regions(+blank), ps-m7-two-way-table(+blank), ps-m7-h-trinity(+blank),
ps-m7-h-sprt-lines(+blank). Generator scripts were in /tmp/r2-ps-m7/gen.

**Diagrams** (5 Mermaid, all with accTitle/accDescr, rendered): test steps, normal-test chooser,
LRT recipe, count-test chooser, SPRT loop. Plus 2 new `plot` figures (paired lines, NP bars).

**Questions** (48 in `questions/r2-ps-m7.yaml`)
- Core ps-m7-r2-q01…q20 (5 per lesson): label 2 (q01, q16), text 4 (q02, q06, q12, q17), match 4
  (q03, q07, q13, q18), order 1 (q11), select-all 4 (q04, q08, q14, q19), MC 5 (q05, q09, q10, q15,
  q20). module_quiz: q01, q03, q10, q11, q15, q16, q18 (1–2 per lesson).
- Honors ps-m7-r2-h01…h14 (Wald/score/LR): label h01, text h04, match h05, select-all h06, order h12,
  MC 9. Honors h15…h28 (SPRT): label h15, text h16, order h17, match h18, select-all h19, MC 9.
- Answer positions of the 23 four-choice MC questions: 0: 5, 1: 6, 2: 6, 3: 6.

**Drills** (5 in `drills/r2-ps-m7.yaml`): ps-m7-r2-trinity-binomial, ps-m7-r2-trinity-poisson
(honors 1); ps-m7-r2-sprt-bounds, ps-m7-r2-sprt-lines, ps-m7-r2-sprt-asn (honors 2). Each generated
400 times; every target matched an independent Python computation and the displayed answers (and
full-precision targets) were accepted by checkAll.

**Glossary** (11 terms, `glossary-r2-ps-m7.yaml`, no collisions with any glossary*.yaml): score
function, observed information, Wald test, score test (aliases include Lagrange multiplier test),
sequential test, sequential probability ratio test (SPRT), continuation region, overshoot, average
sample number (ASN), Wald's identity, group sequential design.

**Cards** (21, `cards-r2-ps-m7.yaml`): 12 for the Wald/score/LR lesson, 9 for the SPRT lesson.

## Error found in existing content (fixed)
- Lesson 32, after Example 4: the statistic $(\bar x - \lambda_0)/\sqrt{\lambda_0/n} = 2.19$ was called
  "Wald-type". It uses the null variance, so it is the score statistic (the Wald version uses
  $\bar x/n$ and gives 2.00). Reworded to "(the score statistic, since it uses the null variance)".

## For a reviewer to double-check
- Historical claims: Wald (1943) Wald test; Rao (1948) score test; Wilks (1938); Hauck–Donner (1977);
  Brown, Cai and DasGupta (2001) on Wald-interval coverage; SPRT developed 1943 at Columbia's
  Statistical Research Group, published 1945 and in *Sequential Analysis* (1947); the Wallis/Friedman
  origin is attributed to Wallis's own account; Wald–Wolfowitz optimality (1948); Pocock (1977),
  O'Brien–Fleming (1979).
- "Neyman's χ² is the Wald statistic" and "Pearson's X² is the score statistic" for the multinomial.
- Simulated values (SPRT α' ≈ 0.034, β' ≈ 0.096, ASN ≈ 42/39; peeking 0.19/0.37) are from 200,000
  replications with fixed seeds; the lesson words them as "about".
- The fixed-sample comparison n = 77 (c = 8) is the smallest n whose best exact binomial test meets
  size ≤ 0.05 and power ≥ 0.90 at p = 0.15.
- A third honors lesson on multiple testing (FWER vs FDR, Benjamini–Hochberg) would fit this
  module, but it was left out in case the ps-h1 ("Modern statistical methods") writer covers it;
  Bonferroni/Tukey already appear in lesson 35.

## Sources
Standard results checked against Casella & Berger (Statistical Inference, ch. 8 and 10.3) and
Wald (1947) as recalled; all numbers recomputed in Python (scipy) and by simulation.
