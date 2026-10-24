# Round 2 review: ps-m1 (Probability foundations)

Reviewer for item 115. Scope: honors lessons 04h1 and 04h2, round 2 additions to core lessons
01–04, `questions/r2-ps-m1.yaml` (51), `drills/r2-ps-m1.yaml` (5), `glossary-r2-ps-m1.yaml` (12),
`cards-r2-ps-m1.yaml` (18), `images/ps-m1-*` (12 SVG files).
`content/math/check-module.sh probstats ps-m1` reports zero problems after the fixes.

## Changes

1. **04h1-first-step-analysis.md, gambler's ruin plot** (picture/plot fix). The two function
   labels "p = 0.5" and "p = 0.45" were drawn on top of each other at the top-right end of the
   curves (both curves end at (20, 1)), so neither was readable, and the "(10, 0.12)" point label
   touched the dashed curve. I removed the function labels and the point label and put three
   `labels` in clear space: "p = 0.5" above-left of the line, "p = 0.45" right of the dashed
   curve, "(10, 0.12)" under the point. I also added "solid line p = 0.5, dashed curve
   p = 0.45" to the caption. Re-rendered with `preview-plots.mjs`: nothing overlaps.
2. **Drill `ps-m1-r2-simpson`, solution** (factual fix). The solution said the reversal happens
   "because A was used mostly on hard jobs". In about 3% of generated instances (27 of 800)
   hard jobs are 50% or less of A's jobs (as low as 36%), so the sentence was false there. I
   added `hda`/`hdb` (each method's share of hard jobs) to `calc`, and the sentence now reads
   "because hard jobs make up a larger share of A's jobs ({hda}%) than of B's ({hdb}%)". I
   checked the whole drill grid exhaustively in Python: whenever the drill's `where` holds, A's
   hard share is strictly larger than B's, so the new sentence is always true.

## Checked and found right

- **Questions (all 51)**: I worked each one before reading the key. Every key is correct, and
  every select-all, order, match and label item has exactly one defensible answer. Numbers I
  rechecked include q01 0.8, q06 3024/126, q09 56 < 336 < 512 < 6561, q10 1/3, q11 0.116/0.018,
  q16 0.98976, q17, q20 (0.512, 0.64, 0.8, 0.96), h01 2/3, h02 1/2, h07 4/13, h11 19/27, h12 7/8,
  h13 0.648, h16 (each $2^i$ step: $1.25 \cdot 2^i$), h17 48 (naive average 63.75), h18 (P
  75/50/70, Q 80/60/64), h22 8/11, h29 (1/3, 13/27, 1/2, 2/3) and h30 13/27. The text-answer
  `accept` lists cover the reasonable forms. Numbers compare by value.
- **Lesson numbers** (recomputed in Python): 6/11, the craps table, 134/495 and 244/495 ≈ 0.4929,
  the timid-play value $(1-(10/9)^{20})/(1-(10/9)^{40}) = 0.10840$ against 18/38 = 0.4737 for
  bold play (the ratio is 4.37, so "more than four times" holds), the plot point $P_{10} = 0.1185$
  for $p = 0.45$, $N = 20$, the problem-of-points table and 11/16, the Berkson numbers
  (0.44, 0.682, 0.3, 1), the two-child cases, 13/27 by counting, and Bertrand 2/3.
- **Simpson table** (04h2): A 90/100 and 150/300 (60% overall), B 240/300 and 40/100 (70%). The
  weights 0.25/0.75 are right, and so is the equal-mix argument. In ps-m1-restrict.svg the
  A∩B share of B is exactly the same in both panels (5500/24000 = 13200/57600 = 0.229).
- **Historical claims**:
  - Pacioli discussed the problem of points in the *Summa* (1494), and it was solved in the
    Pascal–Fermat letters of 1654. Earlier Italian versions exist, which fits "already old".
  - E. H. Simpson, JRSS B 13 (1951). Pearson (1899) and Yule (1903) noted similar effects, so
    "around 1900" is fair.
  - Berkson, *Biometrics Bulletin* 2 (1946), on hospital-based samples.
  - Bertrand, *Calcul des probabilités* (1889).
  - Dubins and Savage, *How to Gamble If You Must* (1965): bold play is optimal in subfair
    red-and-black. The lesson limits the claim to "a game like this one".
  - Berkeley fall 1973: about 44% of 8,442 men and 35% of 4,321 women were admitted. Bickel,
    Hammel and O'Connell (*Science* 187, 1975) found no significant bias against women within
    departments (if anything, a small bias toward women in a few). The lesson's "little evidence
    of bias against women within departments" is accurate and suitably cautious.
- **Labeled simplifications**: the two-child model (equal, independent sexes) is labeled. The
  endless-game limit is stated as "not proved here". The plot caption says only whole-number
  $i$ occur. The causal split-or-combine summary is labeled as simplified.
- **Pictures**: I rendered all 12 SVGs and the 5 label questions with their markers (q05, q15,
  q19, h10, h21). Content is correct, no text overlaps, nothing is cut off, and every marker
  sits on the part its label names. Two markers cover a digit on the blank picture (h10 marker 5
  covers "2" on the start state; q15 marker 5 covers the $B^c$ node). That is intended, because
  those are the parts being asked about.
- **Mermaid (7)**: all rendered and readable, with `accTitle`/`accDescr` that describe the whole
  diagram. The axioms chart's arrows match the proofs. Bonferroni comes from the addition rule
  plus $P(A \cup B) \le 1$. The union bound comes from the addition rule, which is valid by
  induction, although the lesson's text derives it from inclusion–exclusion.
- **Drills**: I generated 800 instances of each drill with the app's `generate()` and recomputed
  every answer independently in Python from the prompt text as shown:
  - alternating: closed form
  - ruin: linear solve of the recursion with boundary conditions
  - points: $W(a,b)$ recursion, not the binomial
  - simpson: from the printed counts, also checking that each count matches its printed percent
    and that the reversal holds
  - berkson: formulas

  There were 0 mismatches, and no NaN, unfilled placeholders, "+ -" or "1x". `checkAll`
  accepted the correctly rounded answers and rejected answers off by 1.5 in the last place,
  1,000 runs per drill, 0 failures. Tolerances are 0.0001 for 4 dp and 0.06 for 1 dp.
- **Glossary**: no term or alias clashes with any other `glossary*.yaml` in the course, and every
  bolded new term has an entry. The definitions and cards are correct.
- **Overlap**: none. No other round 2 lesson in probstats covers the gambler's ruin, Simpson,
  Berkson, the two-child problem or the problem of points (NOTES2-ps-m2 explicitly avoids them).
  09h1's branching extinction also conditions on the first generation, but on a different
  problem.

## Left uncertain

- Nothing material. Two points are wording choices that I left alone:
  - The h27 three-card version is attributed as "Bertrand's box in another form". The card
    version is usually credited to Warren Weaver (1950), but it is mathematically the same
    problem.
  - In the core axioms chart, the union bound arrow leaves the addition rule rather than
    inclusion–exclusion. Both are mathematically valid.
