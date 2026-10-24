# Round 2 review: module ps-m7 (Hypothesis testing), item 121

Reviewer's check: `content/math/check-module.sh probstats ps-m7` reports zero problems after the fixes
(6 lessons, 104 questions, 18 drills, 60 cards).

## Changes

| Where | What was wrong | Change |
|---|---|---|
| Lesson 32 (`32-neyman-pearson-lrt.md`), paragraph before the NP bar chart | Likelihood ratio written $f_1(t)/f_0(t) = 1.6^t\,0.4^{10}$. The correct ratio is $(0.8/0.5)^t(0.2/0.5)^{10-t} = 1.6^t\,0.4^{10-t} = 4^t\,0.4^{10}$. (The conclusion, that it increases in $t$, was right.) | Now $1.6^t\,0.4^{10-t} = 4^t\,0.4^{10}$. |
| Lesson 32, NP bar chart (```plot) | The dashed "reject: t ≥ 8" line was at x = 8.5, between t = 8 and t = 9, so the picture showed the region as t ≥ 9 | Moved the line to x = 7.5 (between 7 and 8) and its label to x = 9.1. Re-rendered and checked. |
| `ps-m7-r2-q15` explanation | Same wrong ratio $1.6^t\,0.4^{10}$ | Now $1.6^t\,0.4^{10-t} = 4^t\,0.4^{10}$. The key (choice 0) was right: ratios 0.302/0.0439 = 6.9 and 0.2013/0.1172 = 1.7. |
| `ps-m7-r2-q09` correct choice and explanation | The key said the lines "nearly all fall by a similar amount". In the data every line falls, but the drops vary from 0.1 to 0.7 mm, so "a similar amount" overstated it | Choice now "…but every one falls from A to B". The explanation now says the drops (0.1 to 0.7 mm, s.d. 0.26) vary much less than the heights do (s.d. 0.51 for A). |
| Lesson 31, paired-data plot paragraph | "almost every one slopes the same way", but all six differences are positive (the caption already said "every line falls") | "every one slopes the same way" |
| Lesson 31, paired-data plot | The "compound B" label touched the 4.6 data point | Moved both axis-category labels from y = 4.5 to 4.45. Re-rendered: clear. |
| Drill `ps-m7-r2-sprt-asn` | Asked for 1 decimal with tolerance 0.1, but the solution showed $E(Z)$ to 4 decimals (as few as 2 significant figures, e.g. −0.0059 when $p_0 = 0.02$). A student who used the displayed intermediates could be off by several units on ASNs of about 400 and be marked wrong. | Prompt now asks for 3 significant figures, answers use `sigfigs: 3, format: sig3`, and $E_0(Z)$, $E_1(Z)$ are shown with `sig4`. I checked all 54 input combinations: working from the displayed intermediates now stays within the accepted window (worst case 47% of the half-unit). |

Counts: answer-key errors 1 (q09's correct choice overstated the data). Factual fixes 2 (the lesson 32 ratio formula, and the same formula in q15's explanation). Picture fixes 2 (the NP chart's rejection line, the paired-plot label). Other fixes 2 (the "almost every" wording in lesson 31, the ASN drill's answer format).

## Checked and found right (things a reader might doubt)

- **33h1 numbers (recomputed in Python/scipy):**
  - Binomial: S = 4.00, W = 3.183, LR = 3.690. Two-sided p = 0.0455 / 0.0744 / 0.0547; one-sided 0.0228 / 0.0372 / 0.0274; exact binomial one-sided 0.0311.
  - Poisson: W = 4.00, S = 4.80, LR = 4.509; p = 0.046 / 0.028 / 0.034.
  - Log-odds Wald: ψ0 = −2.19722, ψ̂ = −1.90096, SE = 0.14868, W = 3.971.
  - Intervals: Wald (0.0970, 0.1630), Wilson (0.1005, 0.1665), LR (0.0994, 0.1653) found by root-finding. Wald for 1/20: (−0.046, 0.146); Wilson (0.009, 0.236).
- **33h1 theory:**
  - $J(\hat\theta) = nI(\hat\theta)$ for the binomial and the Poisson.
  - Taylor-expansion argument, including the sign: $U(\theta_0) \approx (\hat\theta - \theta_0)J(\hat\theta)$.
  - The three statistics are exactly equal for a normal mean with σ known.
  - The score test is invariant to reparametrization with expected information (the lesson correctly limits the claim to that case).
  - Neyman's $\sum(O-E)^2/O$ is the Wald statistic (checked algebraically for k = 2: it equals $n(\hat p - p_0)^2/[\hat p(1-\hat p)]$). Pearson's X² is the score statistic and G² is the LR statistic.
  - "No general ordering" is correctly hedged. Question h12 shows S < LR < W, the reverse order.
- **33h2 numbers:**
  - a = −2.2513, b = 2.8904; increments 1.0986 / −0.1112.
  - Lines: d ≥ 2.389 + 0.0919n and d ≤ −1.861 + 0.0919n. Fastest decisions: reject after 3 straight defectives, accept after 21 straight good clips.
  - Lot A rejects at clip 12 (S = 3.505). Lot B accepts at clip 53 (S = −2.265; at clip 52 it was −2.154). I confirmed both by stepping the paths.
  - E0(Z) = −0.0507, E1(Z) = 0.0703; ASN 39.3 / 33.8.
  - Fixed-sample plan n = 77, c = 8: size 0.0385, power 0.9075, and it is the smallest n that meets both conditions.
  - My own simulation (100,000 lots): α' = 0.035, β' = 0.095, ASN 41.8 / 39.4. This matches the lesson's "about" values.
  - Peeking (my own simulation, 200,000 runs): 0.193 with 10 looks and 0.374 with 100. This matches Armitage, McPherson and Rowe (1969, JRSS A).
  - The bounds α' ≤ α/(1−β), β' ≤ β/(1−α) and α'+β' ≤ α+β follow from the lesson's inequalities. The normal-increment formula and the KL interpretation of −E0(Z) are both correct.
- **History and attribution:**
  - Wald, Trans. AMS 1943 (Wald test); Rao, Proc. Camb. Phil. Soc. 1948 (score test); Wilks, Ann. Math. Stat. 1938.
  - Hauck and Donner, JASA 1977; Brown, Cai and DasGupta, Statistical Science 2001.
  - SPRT: developed 1943 at Columbia's Statistical Research Group, published in Ann. Math. Stat. 1945 and in *Sequential Analysis* (1947). Wallis's own account (JASA 1980) credits the question to Wallis and Friedman.
  - Wald and Wolfowitz, Ann. Math. Stat. 1948 (optimality, correctly stated for both $E_0N$ and $E_1N$).
  - Pocock, Biometrika 1977; O'Brien and Fleming, Biometrics 1979.
  - All of these agree with Casella and Berger (ch. 8, 10.3) and the cited primary papers.
- **Lesson 32 correction by the writer:** the round 1 sentence said "Wald-type" and the writer changed it to "score statistic". That is correct: the statistic uses the null variance, and the Wald version gives 2.00.
- **All 48 new questions:** worked independently before reading each key. Checked:
  - q02 n = 56 (55.67 rounded up); q10 t = 4.243 and all three distractors; q13 $L(1)/L(4) = 2^n e^{-3\sum x^2/8}$.
  - h02/h03/h12: S = 3.125, LR = 3.351, W = 3.922. h08 LR = 3.757. h11 (−0.026, 0.186).
  - h20 0.444 and all three distractors; h21 lines at 5.147 and 0.897; h25 0.75; h26 17 / 3.
  - The order questions (q11, h12, h17) each have a single correct order. All select-all answers are right.
- **Drills:** generated 300 instances of each of the 5 drills with the app's own `generate`. I recomputed every target independently in Python from the prompt text and found 0 mismatches. Every displayed answer was accepted and a 5%-off answer rejected. No unfilled placeholders and no "+ -".
- **Pictures:** rendered all 4 SVGs and their 4 blank versions with the label-question markers. Content, geometry and marker placement are right. In the SPRT chart the lines, the intercept at n = 20.24, the steps at 5, 8 and 26, and the stop at 53 match the lesson. The error-regions, two-way-table and trinity pictures are correct.
- **Mermaid and plots:** rendered all 5 Mermaid diagrams and all lesson figures. Each `accDescr` describes the whole diagram. The degrees-of-freedom labels and the np0 ≥ 10 rule are consistent with lesson 33's text.
- **Glossary and cards:** no term or alias collides with any `glossary*.yaml` in the course, and all definitions are correct.

## Uncertain / notes

- The trinity SVG uses a combining circumflex (θ + U+0302) for θ̂. In the headless preview the hat sits slightly right of the θ. It is still readable, and other courses' SVGs use the same character, so I left it.
- `ps-m7-r2-trinity-binomial` shows p̂ to 4 decimals. A student who plugs that rounded p̂ into S (instead of x/n) can be up to about 0.02 off for large n, more than the 0.005 tolerance. The drill meets the rounding rule for the actual answer, and the solution computes from x/n, so I left it.
- **Overlap:** 33h1's interval section repeats material from ps-m6 honors lessons:
  - Wald vs Wilson for a proportion, Brown–Cai–DasGupta, and the Wald interval going negative also appear in `29h3-proportion-intervals.md`.
  - Observed vs expected information also appears in `29h1-fisher-information-numerical-mle.md`.
  - The overlap is brief, and 33h1 frames it as test inversion, so I left it. A cross-reference could be added later.
  - Multiple testing and FDR are covered by `92-multiple-testing-fdr.md` (ps-h1), so the writer was right not to add a third honors lesson on them.
