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
