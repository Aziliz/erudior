# Round 2 review: ps-m8 (Regression, ANOVA and nonparametric methods)

Reviewer, independent of the writer. `content/math/check-module.sh probstats ps-m8` reports zero
problems after the fixes (5 lessons, 84 questions, 14 drills, 48 cards).

## Changes

1. **ps-m8-r2-h25** (match, interaction-plot patterns). The left item "Two flat lines at the same
   height" was paired with "Neither factor has an effect", but flat lines are also parallel, so
   "No interaction" was an equally defensible pick for it. The answer now reads "No interaction
   and no effect of either factor", which only the flat-lines item fits fully. The explanation says
   so. (Answer-key ambiguity.)
2. **36h2 history paragraph and ps-m8-r2-h29 explanation.** The text said that both designs were
   "set out in" *Statistical Methods for Research Workers* (1925) and *The Design of Experiments*
   (1935). That skipped the key 1926 paper and over-credited the 1925 book, which is mainly
   remembered for the analysis of variance. It now reads: analysis of variance in SMRW (1925),
   randomized blocks argued for in "The arrangement of field experiments" (1926), both designs at
   length in DoE (1935). Source: Q. Zhao, "Fisher and randomization" talk slides (Cambridge
   Statslab, 2022), which give the SMRW 1925, then Fisher 1926, then DoE 1935 sequence and Fisher's
   appointment at Rothamsted in 1919; Rothamsted repository entry for Fisher (1926), *J. Ministry
   of Agriculture* 33, 503–513.
3. **36h1 Key points, last bullet.** "Leverages … flag influential $x$ positions" mixed up
   leverage and influence, which the lesson body itself keeps apart. Changed to "flag far-out $x$
   positions, whose points can be influential."

## Checked and found right
- Every number in 36h1 and 36h2, recomputed in numpy/scipy:
  - Example 1: $\mathbf b = (1.860, 0.6629)$; leverages 0.524/0.295/0.181; seventh site $h = 0.885$.
  - Example 2: $b = (1.4436, 0.5808, 0.6788)$, SSE 1.2941, SEs 0.0911/0.2694, $t$ = 6.38 ($p$ 0.0078) and 2.52 ($p$ 0.086), $R^2$ 0.966, adjusted 0.943, $F$ 42.6 ($p$ 0.006), simple slope 0.697, $r_{12}$ 0.507, VIF 1.35.
  - Block example: SST 1190.67, SSTr 50.67, SSB 1132, SSE 8, $F$ 19.0 ($p$ 0.0025), $F_{0.05,2,6}$ 5.14, one-way $F$ 0.20 ($p$ 0.82).
  - Factorial: SS 27/72/32/12, SST 143, $p$ = 0.020/0.010/0.003.
- The made-up data in the least-squares anatomy SVG: points read back from the pixel coordinates give $\hat y = 1.650 + 0.700x$ with $\bar x = 4$ and $\bar y = 4.45$, as the lesson says. The ANOVA-split SVG matches lesson 35's Example 1 (B = 15–19, grand mean 14.67).
- All 45 questions worked before reading the keys; every distractor's explanation is a real
  mistake (for example h05: 12.5 / 0.83 / 0.5, h09: 0.74 / 0.70 / 0.26, h30: 6.33 / 28.5 / 0.20).
  Order questions have no swappable steps. Select-alls are clean.
- Drills: 400 instances of each of the 5 generated with the app's `generate`. Every answer was
  recomputed independently in Python from the prompt text: 2000/2000 match. Correctly rounded
  answers are accepted by `checkAll`, and so are answers built from the rounded intermediates the
  prompts ask for (b0 from 4-dp slopes, $t$ from a 4-dp SE, block $F$ from 2-dp SS). There are no
  unfilled placeholders and no thousands commas inside math (bold answers outside math can show
  "1,0xx.xx", which is fine).
- Pictures: all 4 SVGs rendered, and the 3 blanks rendered with their question markers. Every
  marker sits on its part, and no text overlaps or is cut off. Mermaid: all 5 rendered and
  readable, and the accDescr lines describe the whole diagram. The interaction plot renders
  cleanly, with labels off the lines.
- Gauss–Markov: the proof sketch is right (the cross term $\mathbf A\mathbf D^\top = (\mathbf X^\top\mathbf X)^{-1}(\mathbf D\mathbf X)^\top = 0$).
  The attribution is fair: Gauss's *Theoria combinationis* is from 1821–23, and the Markov
  attribution has been questioned (Plackett 1949). h14 is correct that normality is not needed.
- "SSE/σ² ~ χ²(n − p) independent of b" is stated without proof, and the text labels it that way.
  The unbalanced-design remark is labeled as contested. The rank-test chart is labeled as
  simplified.
- Glossary: 17 terms. None duplicates a term or alias in any other glossary file, including the
  r2 files.

## Overlap
The ps-h1 lesson `91-ridge-lasso-cross-validation.md` briefly restates the matrix least squares
solution and mentions Gauss–Markov as background for ridge. It complements 36h1 rather than
duplicating it. Nothing to reconcile.

## Uncertain
Nothing material. The 2p/n leverage cutoff is one common rule (3p/n is also used). The lesson
says "a common rule of thumb", which is fair.
