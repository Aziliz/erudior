# Round 2 review: module stat-m8 (Significance tests)

Reviewer for item 26. Scope: honors lessons 36h1, 36h2 and 36h3; the round 2 additions to lessons
33 to 36; `questions/r2-stat-m8.yaml` (62), `drills/r2-stat-m8.yaml` (9),
`glossary-r2-stat-m8.yaml` (16), `cards-r2-stat-m8.yaml` (31) and `images/stat-m8-*` (9 SVGs).
`content/math/check-module.sh ap-statistics stat-m8` reports zero problems after the fixes (7 lessons,
106 questions, 17 drills, 51 cards, 398 terms).

Counts: answer-key errors 0, factual fixes 2, picture fixes 2, other fixes 6.

## Changes

### Factual
1. **36h1, Example 4.** The lesson said a significant result at power 0.80 overstates the effect by
   "about 1.13". Numerical integration of the truncated normal (true effect 2.80 SE, cutoff 1.96,
   both tails, absolute values) gives 1.125 (1.1249). Changed to "about 1.12". The power 0.17 case
   (2.49) is right.
2. **Lesson 36, paired-picture lead-in.** "Operators differ from one another by up to 13 units per
   hour" only holds for the old-jig column (16 to 29). The new-jig column runs 16 to 31, and the alt
   text and q16 say "16 to 31". Changed to "up to 15 units".

### Pictures
3. **stat-m8-alpha-beta.svg** (lesson 34): the bold "β ≈ 0.20" label sat on top of the solid H₀
   curve. Moved the label to the left (x 45, y 232) and re-anchored its leader line, which still ends
   in the β region. Re-rendered: no text crosses a curve.
4. **q07 marker 3 (Power)** was at (73.3, 52.6), right on the dashed curve's edge. Moved it to
   (69, 62), inside the green power region. Re-rendered with all four markers.

### Other
5. **Drill stat-m8-r2-tost:** the t₁ and t₂ answers used `tolerance: 0.002`. A learner who follows
   the solution (SE rounded to 4 decimals as shown, then t to 3 decimals) lands outside that in about
   11% of instances (37,691 simulated; worst error 0.038, when SE is near 0.03 and t is near 30).
   Changed both to `relTolerance: 0.004`. Simulated again: 0 failures. Wrong methods (using s_d
   instead of SE, or a sign slip) still miss by far more.
6. **Drill stat-m8-r2-noninferiority:** a z tolerance of 0.011 rejected 5 of 69,907 simulated
   learner-path answers (p̂ and SE rounded to 4 decimals, z to 2). Raised it to 0.015.
7. **Drills stat-m8-r2-exact-binom and -exact-two-sided:** the solution printed the null mean with
   `{mu:num1}`, so a mean like 0.65 (n·0.05) or 2.25 showed as 0.7 or 2.3. Changed to `num2`.
8. **Drill stat-m8-r2-equiv-ci:** the prompt asked for "the smallest margin for which TOST would
   conclude equivalence", and the solution then said strictly any margin *above* it. That is
   contradictory. With "reject when p ≤ α", equivalence holds at that margin itself (p is exactly
   0.05). Reworded it as the boundary margin, where the TOST p-value equals 0.05, and relabeled the
   answer box "boundary Δ". The answer is unchanged.
9. **h38, choice B:** "A two-way table in which one expected count is 3.8" did not fit the stem's
   "usual z or t procedure", since a general two-way table uses chi-square. Changed it to "Comparing
   two proportions when one expected count in the 2 × 2 table is 3.8". The key is unchanged and still
   matches the explanation (large counts fail, so use Fisher's exact test).
10. **Glossary "winner's curse":** removed the alias "exaggeration ratio". The exaggeration ratio is
    the number (for example 2.49), not the tendency the definition describes. "Type M error" stays.

## Checked and found right (things a reader might doubt)

- **All 62 questions worked independently** before reading the keys. Some checks: q03 2·Φ(−1.70) =
  0.0891; q10 power at μ = 54 is 0.6387; q15 P(Z ≥ 2.10) = 0.0179; h02 98.96 rounds up to 99;
  h07 62.8 rounds up to 63 per group; h29 46/512 = 0.0898; h31 79/4096 = 0.0193 (distractors
  66/4096 and 1/4096 are right); h35 2/32 = 0.0625 and the sign-test distractor 6/32 = 0.1875;
  h42 10/512 = 0.0195. Every select-all, order, match and label key holds, and each order has only
  one valid sequence.
- **36h1 numbers** (scipy): power 0.804, 0.442 and 0.912 on the curves; n = 95.15 or 95.19 rounds up
  to 96, and n = 95 gives power 0.8996. The effect-size table gives 154.6, 24.7 and 9.66, so 155, 25
  and 10. Rider survey: cutoff 0.8715, power 0.717, n = 385.6 with exact z values (the displayed
  (19.64)² is 385.7; both round up to 386). Two lines: 43.6, so 44 per group. Noncentral t: n = 96
  gives power 0.8986 and n = 97 gives 0.9013, so "97 for the t test" is right. Type M at power 0.17:
  2.49.
- **36h2 numbers:** t₁ = 5.25 (p = 1.1e−5), t₂ = −2.25 (p = 0.0169), 90% CI (−0.017, 0.257), ordinary
  p = 0.147. With n = 6: t = 0.73, p = 0.495; t₂ = −1.10, p = 0.160; CI (−0.21, 0.45). Non-inferiority:
  SE 0.0282, z = 2.12, p = 0.0168, 95% CI (−0.095, 0.015). The four intervals in the equivalence SVG
  match the alt text's endpoints when Δ = 0.30 (measured from the pixel positions).
- **36h3 numbers:** P(X ≥ 6 | B(150, 0.02)) = 0.0819; the two-sided value from R's `binom.test` rule
  is 0.1302 (scipy `binomtest`). Coin table 56, 11 and 1 out of 1024. Signed-rank with midranks: full
  enumeration gives 2/128 = 0.015625, and scipy `wilcoxon(method='exact')` agrees (W⁺ = 27).
- **Lesson 36 picture:** the invented old/new values reproduce the lesson's differences. Paired t is
  3.21 (p = 0.0074); the two-sample Welch t is 0.948 (p = 0.36), as stated.
- **Lesson 33:** critical value 0.8 − 1.645·0.02828 = 0.7535.
- **Lesson 35:** 0.0287 per tail.
- **Attributions:**
  - Cohen (1988), 2nd ed., d = 0.2, 0.5 and 0.8, labeled as rough.
  - Gelman & Carlin (2014), *Perspectives on Psychological Science* 9(6), Type M errors.
  - Hoenig & Heisey (2001), *The American Statistician* 55(1): observed power is a function of the
    p-value, and is about 0.5 at p = 0.05.
  - Schuirmann (1987), *J. Pharmacokinetics and Biopharmaceutics* 15(6), TOST. The text says
    "popularized", which fits, since Westlake's earlier interval work exists.
  - FDA bioequivalence: the 90% CI of the geometric mean ratio must lie within 80–125%
    (FDA guidance, *Statistical Approaches to Establishing Bioequivalence*).
  - Wilcoxon (1945), *Biometrics Bulletin* 1.
- **The intersection-union argument** for running each TOST test at the full α is correct and stated
  correctly.
- **Drills:** each one was recomputed independently in Python (sample-size ceilings with 3-decimal
  z values: 0 changes over all admissible inputs; proportion power: a learner who rounds z to 2
  decimals is off by at most 0.0031, within tolerance 0.005; the TOST p-value and the equiv-ci
  endpoints stay within tolerance on the learner path).
- **Rendering:** all 5 SVGs and 4 blanks were rendered with their markers, and all 4 Mermaid
  diagrams were rendered. The text is readable and nothing is cut off. The accTitle and accDescr of
  each diagram describe the whole diagram.
- **Glossary:** no term or alias duplicates any glossary*.yaml in the course (checked by script).

## Overlap with other round 2 lessons

- None that needs action. The writer already removed a multiple-testing draft that duplicated stat-h1
  `92-multiple-testing.md`, and cut the permutation and Fisher sections to cross-references to
  stat-h1 `90-resampling.md` and stat-m9 `39h2`.
- Small thematic touches remain, and they complement rather than repeat:
  - 92 discusses low power in its false-discovery argument; 36h1 covers the Type M error and
    sample size.
  - stat-m7 `32h1` calls the Clopper–Pearson interval conservative; 36h3 covers conservative tests,
    and the glossary entry covers both.
  - stat-h1 `93-meta-analysis` defines Cohen's d and refers back to 36h1 for effect size.
  - stat-m9 `39h2` uses "effect size" for Cramér's V.

## Left uncertain

- The ```plot blocks in 36h1 (power curves) and 36h3 (sign-test bars) were checked by reasoning only.
  The functions and values are right, and the point labels sit on the plotted points by design. Their
  rendered placement wasn't viewed.
