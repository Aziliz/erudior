# AP Statistics (math-ap-statistics)

Narrowed on 2026-10-16 from the broader Statistics draft described below: the calculus-based continuous random variables lesson, ANOVA/nonparametric lesson and Poisson material moved to the Probability & Statistics course (content/math/probstats); lessons after 26 were renumbered.

# Statistics and Probability — progress

Course id `math-statistics`, folder `content/math/statistics`, prefix `stat-`.

## Outline (9 modules, 40 lessons)

### stat-m1 Exploring one-variable data
1. stat-data-types — Data, variables and types · drills: stat-relfreq
2. stat-cat-displays — Displaying categorical data · stat-relfreq, stat-pie-angle
3. stat-quant-displays — Dotplots, stemplots and histograms · stat-hist-read, stat-cumfreq
4. stat-center — Measures of center · stat-mean-data, stat-median-data, stat-weighted-mean, stat-mean-missing
5. stat-spread — Measures of spread · stat-sd-data, stat-range-iqr
6. stat-boxplots — Five-number summary, outliers, boxplots · stat-five-number, stat-fences, stat-boxplot-read

### stat-m2 Position and the normal model
7. stat-percentiles-z — Percentiles and z-scores · stat-zscore, stat-z-to-x
8. stat-transformations — Linear transformations of data · stat-lin-transform, stat-unit-convert
9. stat-normal — Density curves, normal distributions, empirical rule · stat-empirical
10. stat-normal-calc — Normal calculations and inverse normal · stat-normal-below, stat-normal-between, stat-invnorm, stat-normal-find-sd

### stat-m3 Two-variable data
11. stat-scatter-corr — Scatterplots and correlation · stat-corr-calc
12. stat-lsrl — Least-squares regression · stat-lsrl-summary, stat-lsrl-data
13. stat-residuals — Residuals, r², influential points · stat-residual, stat-r-squared
14. stat-transform-linear — Transformations to linearity · stat-exp-model, stat-power-model
15. stat-two-way — Two-way tables · stat-two-way-cond, stat-two-way-joint

### stat-m4 Collecting data
16. stat-sampling — Sampling methods and bias · stat-strat-alloc, stat-systematic
17. stat-experiments — Designing experiments · stat-factorial-design
18. stat-study-conclusions — Observational studies, confounding, scope of inference · stat-factorial-design

### stat-m5 Probability
19. stat-prob-basics — Probability rules · stat-union, stat-venn-regions
20. stat-conditional — Conditional probability and independence · stat-cond-table, stat-indep-atleast
21. stat-trees-bayes — Tree diagrams and Bayes · stat-tree-total, stat-bayes
22. stat-counting — Counting · stat-perm, stat-comb, stat-comb-prob

### stat-m6 Random variables
23. stat-discrete-rv — Discrete random variables · stat-ev, stat-rv-sd, stat-ev-game
24. stat-combining-rv — Transforming and combining · stat-linear-rv, stat-combine-rv
25. stat-binomial — Binomial · stat-binom-pdf, stat-binom-cdf, stat-binom-mean-sd
26. stat-geom-poisson — Geometric and Poisson · stat-geom, stat-geom-cdf, stat-poisson, stat-poisson-cdf
27. stat-continuous-rv — Continuous random variables (calculus) · stat-uniform, stat-exponential, stat-pdf-constant, stat-pdf-mean

### stat-m7 Sampling distributions and confidence intervals
28. stat-sampling-dist — Sampling distributions; sample proportion · stat-phat-dist, stat-phat-prob
29. stat-clt — Sample mean and CLT · stat-xbar-prob, stat-sum-prob
30. stat-ci-prop — CI for a proportion · stat-ci-prop, stat-moe-prop, stat-sample-size-prop
31. stat-ci-mean — CI for a mean (t) · stat-tstar, stat-ci-mean-t, stat-sample-size-mean
32. stat-ci-two — Two-sample intervals · stat-ci-two-prop, stat-ci-two-mean, stat-ci-paired

### stat-m8 Significance tests
33. stat-test-logic — Logic of tests, p-values · stat-pvalue-z, stat-pvalue-t
34. stat-errors-power — Errors and power · stat-power-z
35. stat-test-prop — z tests for proportions · stat-z-test-prop, stat-two-prop-test
36. stat-test-mean — t tests for means · stat-t-test-one, stat-t-test-paired, stat-t-test-two

### stat-m9 More inference
37. stat-chi-gof — Chi-square goodness of fit · stat-chi-gof
38. stat-chi-two-way — Chi-square independence/homogeneity · stat-chi-expected, stat-chi-indep
39. stat-reg-inference — Inference for slope · stat-reg-slope-t, stat-reg-slope-ci
40. stat-anova-nonpar — One-way ANOVA and nonparametric tests · stat-anova-f, stat-sign-test, stat-rank-sum

Reference sheets (stubs until the end): stat-ref-descriptive, stat-ref-probability, stat-ref-inference, stat-ref-which-test.

Tools in scratchpad/stat: partial.sh (builds only modules that have lessons), chk.py (counts, answer spread, -g glossary gaps), pvm.sh (render lesson figures), dsample.mts (sample drills).

## Status
- [x] course.yaml
- [x] m1  - [x] m2  - [x] m3  - [x] m4  - [x] m5  - [x] m6  - [x] m7  - [x] m8  - [x] m9
- [x] cards  - [x] glossary  - [x] references
- [x] final build + check (both report zero problems)

## Final counts
40 lessons (9 modules), 432 questions (answer index spread 109/108/113/102), 88 drills,
223 notecards, 249 glossary terms, 4 reference sheets. Every lesson 900+ words, 2+ worked
examples, 10–12 questions with 2–3 marked module_quiz. Every bolded lesson term has a glossary
entry (non-term emphasis was converted to italics).

## Notes for reviewers
- Quartiles use the median-of-halves method throughout (matches the engine's `quartile`).
- Two-sample t drills use the conservative df = min(n1, n2) − 1 (stated in the prompts);
  lessons show both conservative and Welch df.
- Normal-probability drills accept answers within 0.0006 (z values are exact to 2 decimals);
  inverse-normal and power drills allow table-rounding error (0.6 points / 0.003).
- Geometric distribution counts trials (values 1, 2, …), as stated in lesson 26.
- 35 questions had two choices swapped (correct answer moved from index 1 to 2 or 3) to
  balance answer positions; explanations never refer to choice positions.


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every lesson statistic recomputed, every drill generated hundreds of times against an independent solver. All answer keys were correct.

# AP Statistics review — modules stat-m1 to stat-m3 (lessons 01–15), cards.yaml

All 160 questions in m1–m3 were solved independently. All answer keys were correct.
I generated each of the 31 drills 300–400 times and checked them in Python against the prompt as shown. Every computed answer was correct, and every shown answer was accepted when typed.

## Questions (questions/m1–m3.yaml)
- Removed Markdown emphasis that does not render (`**...**`, `*...*`). Emphasis words that matter are now uppercase (FALSE, NOT):
  0101, 0102, 0103, 0110, 0208, 0308, 0510, 0605, 0707, 0904, 1101, 1103, 1106, 1107, 1306, 1307, 1308, 1309, 1401, 1408.
- 1209: the explanation referred to "the first choice", but choices are shuffled. It now names the line $\hat{y} = 1.7 + 6.5x$.
- 1311: the stem said "shows random scatter, but … fan shape", which contradicts itself. It now says "shows no curved pattern, but …".

## Lessons
- 06: Line A's boxplot had its median at 5 inside a 4–7 box (lopsided), yet the text calls it roughly symmetric. The figure is redrawn: box 3.5–6.5, whiskers 1.5–8.5. The median (5), IQR (3) and range (7) still match the text.
- 09 Example 1: broken inline math, "$47.5\% + 34\% = $ *81.5%*" and "$72 - 8 = $ *64*". The closing `$` came after a space, so the math showed as raw text. Fixed.
- 09: "never need to integrate it by hand" became "compute with it by hand". This removes the calculus framing of densities.
- 10: the normal probability plot used ±1.87 as the extreme expected z for n = 15. The (i−0.5)/n positions used for the other points give ±1.83. Fixed.
- 12: removed the "calculus derivation — partial derivatives" aside, which is college-only.
- 13: "SST = 10 (from the last lesson)" was wrong, because S_yy came from the correlation lesson, two lessons back. It now reads "SST = S_yy = 10 (from the correlation lesson)".
- Every worked example in lessons 01–15 was recomputed (bacteria log fit, influential-point lines, Simpson's table, ogive median and so on). All correct. All figures were rendered and match their data.

## Drills
- stat-lin-transform: the equation showed "- 1x" and "0 + 2x". Now uses signedcoef and `where aa != 0`.
- stat-exp-model, stat-power-model: the prompt asks for 3 significant figures, but the shown answer was "5,011.87" or "48.07". The answer format is now sig3, with relTolerance kept.
- stat-power-model: excluded intercept 0 ("0 + 1.5 ln x").
- Answers that say "give N decimals" are now displayed with N decimals (dp1/dp4 instead of num1/num4). Previously they showed "89°", "24%" or "0.21" when 1 or 4 decimals were asked. Affected drills: relfreq, pie-angle, hist-read, cumfreq, normal-below, normal-between, invnorm, normal-find-sd, r-squared, two-way-cond, two-way-joint.
- stat-weighted-mean: grade points now display as 4.0 or 3.0 (not "4" or "3"). The numerator uses 1 decimal (not "36.00").

## cards.yaml
- Removed 17 college-only cards: Poisson (4), continuous random variables with pdf/cdf integrals, uniform variance and exponential (6), and ANOVA/nonparametric (7). The count went from 223 to 206.
- The geometric cards' topic changed from 'Geometric and Poisson' to 'Geometric distribution', which matches lesson 26's topic.
- Removed Markdown italics from the "r = 0" card. The other cards were checked and are correct.

## Noted outside my scope (not edited)
- Card "Hypergeometric probability" (Counting) is not AP content. It is not on the listed college-only set, so I kept it.
- Lesson 07 teaches Chebyshev's inequality, and question 0707 tests it. Chebyshev is not on the AP syllabus, but it is not college-only calculus, so both are kept.
- Lesson 26 (geometric-poisson) and its questions and drills still need the Poisson removal (another reviewer's area).
- Drills stat-mean-missing and stat-normal-find-sd are not linked from any lesson's front matter (lessons 04 and 10 already list 3 drills).

Build and check: `python3 content/math/build.py ap-statistics` and `check-course.mts` both report OK, with zero problems in the whole course.

# AP Statistics review — modules stat-m4 to stat-m6 (lessons 16–26)

All 98 questions in m4–m6 were solved independently before reading the keys. Every key was
correct. 22 drills × 400 instances were checked against an independent Python calculation,
with 0 mismatches. Every shown answer is accepted when typed.

## Scope change (lesson 26 → geometric only)
- Rewrote lesson 26 as "The geometric distribution". The id stays `stat-geom-poisson` so progress
  keys don't change; the file is now `lessons/26-geometric.md`, and the topic is
  "Geometric distribution". Removed the Poisson sections, Example 3 (Poisson approximation),
  the Poisson histogram and the Poisson rows in the model table. Added the geometric-setting
  conditions and the 10% note, the TI geometpdf/geometcdf commands, a section on shape, a
  p = 0.15 geometric histogram (rendered and checked), Example 2 (rolling for a six, including
  at least/more than), and Example 3 (binomial vs geometric vs neither).
- Deleted questions stat-q-2604–2609 (Poisson). Added stat-q-2612–2617 (geometric setting,
  P(X > k), SD, P(X ≥ k), most likely value, expected trials). Lesson 26 now has 11 questions,
  2 of them in the module quiz.
- Deleted these drills: stat-poisson, also removed from the lesson's drills list;
  stat-poisson-cdf, which no lesson linked; stat-pdf-mean, a calculus pdf drill left over from the
  removed lesson 27. Renamed the topic on the geometric drills.
- Lesson 23: replaced "Lesson 27 treats continuous random variables with calculus" with a
  sentence that names the continuous models this course actually uses.
- questions/m6.yaml: updated a stale comment and removed the "Lesson 27" comment.

## Errors fixed
- Lesson 17: corrected the claim that double-blinding "prevents the placebo effect". It
  keeps any placebo effect the same in every group. Fixed the same claim in the stat-q-1703
  explanation.
- stat-q-2204 explanation: called 0.432 "the binomial answer" before the binomial had been
  taught. It now shows 3(0.4)(0.6)^2.
- Markdown in questions: removed it from 1602, 1603, 1604, 1702, 1707 and 2111.
- Drills:
  - stat-systematic printed "3th". The minimum is now 4th.
  - stat-perm printed "1st through 2th/3th place". The prompt is reworded.
  - stat-combine-rv showed "X − Y" as plain text. It is now math.
  - stat-binom-cdf's solution gave no numbers. It now shows P(X ≤ k) and the binomcdf call.

## Checked, no change needed
- Worked examples in lessons 16–25 (all arithmetic verified).
- Figures: the Venn diagram in L19, the tree in L21 and the histograms in L23/L25 match the text.
  In the L21 tree, the "no D" label slightly touches its branch (cosmetic only).

## Outside my scope (not edited), needs another reviewer
- cards.yaml lines 171–178: 4 Poisson cards, and topic 'Geometric and Poisson' should become
  'Geometric distribution'.
- glossary.yaml:
  - Poisson random variable and Poisson approximation entries should be removed.
  - The topic on the geometric setting, geometric random variable and memoryless entries should
    be renamed.
  - "memoryless" mentions the exponential distribution.
  - "probability density function" defines it with an integral (calculus).
- references/probability.md:
  - the Poisson row (line 46);
  - the exponential and Poisson facts (line 51);
  - the poissonpdf/poissoncdf calculator row (line 60).
- PROGRESS.md lines 43–44 still list the Poisson drills and old lesson 27.

# AP Statistics review: modules stat-m7 to stat-m9 (lessons 27–38), glossary, references

All 87 questions in m7–m9 were solved independently (scipy) before checking keys. Every key was correct.
Every worked example in lessons 27–38 was recomputed and all of them were correct. All 8 figures were rendered and screenshotted, and they match the text.
All 26 drills were generated about 500 times each and checked against independent calculations parsed from the prompt as shown. Each shown answer is accepted, including with table-rounded intermediate values.

## Questions
- stat-q-3201: the distractor 0.0670, described as the sum of the two SEs, was miscomputed. The correct sum is 0.03464 + 0.03162 = 0.0663, so the choice and explanation now say 0.0663.
- stat-q-3604: two distractors were effectively identical ("t = 2.5, p ≈ 0.012" twice). One is now "t = 10.0, p < 0.001", which comes from dividing s_d by n. The explanation names that mistake.
- stat-q-3610: the stem said Welch p = 0.050, but the course rule (reject if p ≤ α) would then reject, which contradicted the key "not convincing". The stem now says p = 0.0502, and the explanation is fixed to match.
- stat-q-3608: dropped "consider a nonparametric procedure" (a college-only topic).
- stat-q-3803: the distractor "One-way ANOVA" became "Two-proportion z test", with a matching explanation.
- stat-q-3808: the choice and explanation suggested "an exact method/test", which this course doesn't teach for two-way tables. They now say to combine sparse categories.
- Removed Markdown bold and italics, which the app does not render: 2801, 2804, 2910, 3203, 3305, 3507, 3703.
- Fixed stale lesson numbers in the YAML section comments of m7–m9, and removed the empty "Lesson 40: ANOVA" section.

## Lessons
- L28: "(lesson 31)" changed to lesson 30, and "result of lesson 28" changed to lesson 27.
- L29: "lesson 28" changed to lesson 27 (2 places).
- L32: "the next three lessons apply it to proportions and means" now names lesson 33 (errors) and lessons 34–35 correctly.
- L35: "lesson 31 … lesson 33" changed to lessons 30 and 32.
- L36: "coin machine of lesson 35" changed to lesson 34.
- L37: referred to a "track-inspection table" that doesn't exist anywhere in the course. It now gives the data inline.

## Drills
- stat-sample-size-prop: the margin 0.015 or 0.025 displayed as "0.02" or "0.03" because of default 2-decimal formatting, so the answer key didn't match the prompt (126 of 400 instances). It now uses {mm:num4}.
- stat-reg-slope-t: SE_b was computed to 3 decimals but displayed with 2, so t and p didn't match the shown SE. SE is now rounded to 2 in the calculation.
- stat-power-z: the true mean was shown to 2 decimals but computed unrounded, so power was off by up to 0.005. The mean is now rounded in the calculation.
- stat-chi-indep: some instances had expected counts below 5. Added a where condition.
- stat-z-test-prop and stat-two-prop-test: the p-value tolerance went from 0.003 to 0.004. A learner using z rounded to 2 decimals (as asked) could be marked wrong.
- stat-phat-prob: fixed a garbled solution sentence ("the area at most that point").
- stat-xbar-prob: removed "= σ/5.48" (an approximation written with =).
- stat-sample-size-mean: "within 1 units" reworded.
- stat-chi-gof: the expected count no longer shows "50.00" next to "50".

## Glossary
- Removed 14 college-only entries: Poisson (2), pdf, cdf, exponential distribution, ANOVA, SSG, mean square, F distribution, nonparametric tests, sign test, both Wilcoxon tests, and Kruskal–Wallis.
- "within-group variation" (alias SSE) became an "SSE" entry for regression.
- Removed F, ∫ and exponential mentions from "degrees of freedom", "expected value" and "memoryless".
- "uniform distribution" reworded without the calculus-based variance.
- Topic names "Geometric and Poisson" and "Continuous random variables" updated to "Geometric distribution" and "Discrete random variables".

## References
- inference.md: removed the ANOVA F row, the SSG/SSE sentence, and "F" from the upper-tail row.
- which-test.md: removed the ANOVA rows and the nonparametric alternatives (replaced with one row on t procedures being unreliable).
- probability.md: removed the calculus "Continuous" column, the Poisson, Uniform and Exponential rows, the Poisson and exponential facts, and the Poisson calculator row.

## Outside my scope (not edited)
- Nothing else outstanding found. Lesson 26 has already been renamed to 26-geometric.md by another reviewer. Its lesson id is still stat-geom-poisson, which is fine because ids must stay stable.

Build and check-course: OK, zero problems.

## Gap lessons (2026-10-17)

Filled the coverage gaps listed in VERIFY.md (simulation, investigative questions, mosaic plots).

### New lesson
- `stat-simulation`, "Simulation", `lessons/20-simulation.md`, module stat-m5, between probability rules and conditional probability (CED 2.3). It covers State/Plan/Do/Conclude, assigning one or two random digits, ignoring unused labels, skipping repeats without replacement, how the number of trials affects precision, simulation-based inference (null model, estimated p-value) and randomization tests. It has 3 worked examples (Examples 1 and 2 by hand from random digits, Example 3 a 200-sample simulation) and 2 figures (a running-proportion plot and a simulated distribution), plus Common mistakes and Key points.
- Renumbering: old lessons 20–38 are now files 21–39, and every id is unchanged. Textual "lesson N" references for N ≥ 20 in lesson bodies and question-file comments were shifted by +1 (lessons 26, 29, 30, 33, 36, 37; m5–m9 comments).
- Cross-references: lesson 19's Simulation section now points to the next lesson, and its "(next lesson)" for independence now says lesson 21. Lesson 33 ties its test logic back to the simulation-based inference of lesson 20.
- The `references/probability.md` (stat-ref-probability) sheet has a new Simulation section and a randInt row. The lesson links stat-ref-probability and stat-ref-inference.
- Glossary: "simulation" was updated (topic now Simulation). Added simulation trial, table of random digits, random number generator, null model, simulation-based inference and randomization test.
- Cards: 6 Simulation cards, plus 1 card for investigative questions (Types of data) and 1 for mosaic plots (Two-way tables).

### New questions (20; answer positions 5/5/5/5)
- Lesson 20: stat-q-sim-01 … stat-q-sim-12. The module-quiz questions are sim-01, sim-06, sim-08 and sim-12.
- Lesson 01 (investigative questions): stat-q-0111–0114. 0111 and 0113 are in the module quiz.
- Lesson 15 (mosaic plots): stat-q-1511–1514. 1511 and 1514 are in the module quiz.

### New drills (4)
- stat-sim-digits: count successes in 20 random digits and estimate.
- stat-sim-trials: 10 four-digit trials, "at least m of 4", and estimate.
- stat-sim-pvalue: a tail table from a simulated null distribution; count at least as extreme and estimate the p-value. `where ext >= 1`.
- stat-mosaic-count: from bar width % and segment height %, find the group size and cell count. Linked from lesson 15.
- No drill for investigative questions, since there is no computation to drill.
- Lesson 15 also has a new mosaic-plot figure (widths 60:80:60) under the segmented bar chart.

### Notes for reviewers
- Numbers in the simulations are genuine seeded runs. In Example 1, the 50 digits give 4/10 against the exact 0.528. In Example 2 the result is 2/4, and a 1,000-trial run gave 0.328 against the exact 1/3. In Example 3, 3 of 200 samples are at 27 or more (exact P = 0.019).
- Verification: every new question was solved in Python. Each new drill was generated 500 times, and the answers were recomputed from the digits and table shown in the prompt: 0 mismatches. Every shown answer is accepted when typed, and target+1 is rejected.
- The randomization-test paragraph uses illustrative numbers ("say, only 12 of 1,000 shuffles") and has no data set.
- Earlier sections of this file and VERIFY.md use the old lesson numbers (before the renumbering).
- Build and check-course: OK, zero problems. Totals are 39 lessons, 430 questions, 83 drills, 214 cards and 243 glossary terms.
