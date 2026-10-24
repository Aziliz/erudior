# Round 2 review: honors module stat-h1 (Honors: Beyond the AP exam)

Reviewer for item 28. Scope: lessons 90–93, `questions/r2-stat-h1.yaml` (56), `drills/r2-stat-h1.yaml`
(11), `glossary-r2-stat-h1.yaml` (40), `cards-r2-stat-h1.yaml` (38), `images/stat-h1-*` (7 SVGs).
`content/math/check-module.sh ap-statistics stat-h1` after fixes: OK, zero problems.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| Lesson 91, after the prior/posterior picture | "the posterior … is narrower than either" stated as a general rule. Not always true: Beta(1, 20) prior (var 0.0021) + 10 of 10 → Beta(11, 20) (var 0.0072), wider than the prior. | "usually narrower than either", with the exception in parentheses. | Computed (beta variance ab/((a+b)²(a+b+1))) |
| Lesson 93, publication bias | "the published studies overstate the effect" stated as certain. | "tend to overstate". | Rosenthal 1979; Borenstein et al. 2009 ch. 30 |
| `glossary-r2-stat-h1.yaml`, publication bias | "it makes pooled estimates too large" (same overstatement). | "it tends to make …". | as above |
| stat-h1-r2-h32 (order, BH) | Item "Compute the threshold kq/m for each rank k" could be done before sorting (thresholds depend only on k, q, m), so steps 1 and 2 were swappable. | Item 2 is now "Compare the k-th smallest p-value with its threshold kq/m" (needs the sort); explanation updated. | Benjamini & Hochberg 1995 |
| stat-h1-r2-h41 explanation | Said the false share falls only a little "because so few hypotheses are true"; the real reason here is that power was already 0.8 (TP 80 → 95, FP 45 fixed). | Reason corrected. | Computed: 45/125 = 0.36 → 45/140 = 0.32 |
| Drill stat-h1-r2-boot-count, solution | "about 63% of them" for every n; for n = 5 the share is 67%, n = 10 65%. | "a share that approaches about 63% as n grows". | 1 − (1 − 1/n)ⁿ → 1 − 1/e |

## Checked and found right (a reader might doubt)

- Every number in the four lessons recomputed in Python/scipy: commute data (sum 218, s = 12.18,
  s/√9 = 4.06, √(8/9)·4.06 = 3.83); the three hand resamples (sorted values, medians 21/18/24, means
  23.8/20.9/29.3); exact long-run bootstrap distribution of the median (0.14, 2.89, 11.45, 22.07,
  26.90 … %, mean 21.32, SD 3.91, so "one run gave 3.9" and h03's mean 21.3 are consistent); 2.5th/97.5th
  percentiles 15 and 33; (1 − 1/10)¹⁰ = 0.349; permutation test: exactly 2 of 70 splits ≥ 5.5 (6.0 and
  5.5), p = 0.0286; Welch one-sided t p = 0.019 (pooled would be 0.016; AP uses Welch, so the text is right).
- Lesson 91: grid posterior 0.023/0.298/0.679 (total 0.1310); Beta(8, 4) normalizing constant 1320,
  95% CrI 0.390–0.891, P(p > 0.5) = 0.887; Wald 0.416–0.984; Beta(35, 15) 95% range 0.567–0.817;
  Beta(44, 26) mean 0.629, CrI 0.513–0.737; the 2% → 16% reference matches lesson 22. Bayes died
  1761, essay read/published 1763 via Price; Laplace 1774 "Mémoire sur la probabilité des causes par
  les événements".
- Lesson 92: 1 − 0.95²⁰ = 0.642; BH example 6/2/4 rejections; 45/125 = 0.36, 45/80 = 0.5625;
  1 − 0.95⁵ = 0.226. Simmons, Nelson & Simonsohn 2011 (60.7% for the combined four degrees of
  freedom); OSC 2015 Science 349 (97% → 36% significant, replication effects about half); ASA 2016
  principles 2 and 3; Holm 1979; BH 1995 (proved for independent tests, as stated); Ioannidis 2005 title.
- Lesson 93: s_p = 10.63, d = 0.40, pooled t = 1.86, p = 0.066; t = d√(n/2) table (3.16/p 0.0016;
  1.90/p 0.065); P(Z < 0.5) = 0.69; Example 2 weights, shares, CIs, pooled 2.50 (0.51 to 4.50),
  z = 2.46, p = 0.014, Q = 2.01, I² = 0; Example 3 Q = 7.95 (p = 0.019), I² = 0.75, DerSimonian–Laird
  τ² = 6.26, RE shares 28/33/39%, estimate 3.72, CI 0.42–7.02 (FE 1.71–4.72, so "more than twice as
  wide" holds). Pearson 1904 typhoid, Glass 1976, Cochrane 1993, Rosenthal 1979, Higgins & Thompson 2002
  (the 25/50/75% reading is from Higgins et al. 2003, and the text only says "often read as").
- All 56 questions worked before reading keys: every key right, one defensible answer each, distractor
  explanations name real mistakes. Text answers (1.94, 252, 8/7, 0.4, 0.002, 0.29, 5.10, 0.82) are
  single numbers that compare by value. h14 = 7/27, h18 = 0.804, h42 = 0.1855 → 0.185.
- Drills: 300 instances of each of the 11 generated with the app's own generator; every answer
  recomputed independently in Python/scipy from the prompt text: 0 mismatches; every displayed
  (rounded) answer is accepted by the checker; tolerances ≥ half the last place.
- Pictures (all rendered and viewed): bootstrap diagram (bar heights match the exact distribution,
  interval 15–33), prior/likelihood/posterior (exact Beta curves, peaks at 0.71/0.45/0.63, CrI 0.51–0.74),
  discovery tree (80/20/45/855), forest plot (every square, CI end and the diamond checked against the
  axis scale). All label markers sit on the parts their labels name; text readable, nothing cut off.
- Mermaid (3, previewed): content right, accTitle/accDescr describe the whole diagram.
- Plots: bar heights (lesson 90), Beta(8, 4) density and shaded 0.390–0.891 inside the y-range max 2.94
  (lesson 91), 1 − 0.95ᵐ and the Bonferroni curve 1 − (1 − 0.05/m)ᵐ (lesson 92) correct.
- Glossary: no term or alias duplicates any other glossary*.yaml in the course.

## Overlap

None that needs action. stat-m8's 36h1 introduces effect size and Cohen's conventions; lesson 93
refers back to it and only adds Cohen's d as a formula (no duplicate glossary entry). stat-m8 dropped
its own multiple-testing draft for this reason. Lesson 20's randomization test is extended, not repeated.
23h1's union bound is cited, not redefined.

## Left uncertain

- The likelihood curve in `stat-h1-prior-posterior.svg` starts at p = 0.2 at a small nonzero height
  instead of tapering from 0; cosmetic only, left as is.
- Plots were checked by reasoning, not as rendered images (the label positions are set by the renderer).
