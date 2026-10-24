# Round 2 review: la-m9 (Orthogonality, least squares and symmetric matrices)

Reviewed: honors lessons `40h1-inner-product-spaces.md`, `40h2-householder-qr.md` and
`40h3-pseudoinverse-low-rank.md`; the round 2 additions to core lessons 33–40 (identified by diffing
each lesson body against the round 1 build in `samples/math/math-linear-algebra.json`);
`questions/r2-la-m9.yaml` (82 questions), `drills/r2-la-m9.yaml` (8 drills),
`glossary-r2-la-m9.yaml` (16 terms), `cards-r2-la-m9.yaml` (24 cards), 4 SVGs plus their `-blank`
copies, 9 Mermaid diagrams and 10 new plot blocks.
`content/math/check-module.sh linear-algebra la-m9` reports zero problems after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| `la-m9-r2-weighted` drill prompt | A weight of 1 printed as `1u_3v_3` (a "1x" artifact). | Weights use `{w:coef}`, so a weight of 1 prints as `u_3v_3`. |
| `la-m9-r2-householder` drill solution | When $2\mathbf{u}^T\mathbf{y}/\mathbf{u}^T\mathbf{u}$ is negative, the line read $\mathbf{y} - -\frac{7}{3}(\dots)$. | The coefficient is now in parentheses: $\mathbf{y} - \left(-\frac73\right)(\dots)$. |
| `la-m9-r2-q34` explanation | It called the intermediate vector $\mathbf{y} = R\mathbf{x}$ "the inner product", which is wrong and confusing in a module about inner products. | "the intermediate vector $\mathbf{y} = R\mathbf{x}$". |
| 40h2, Householder QR section | It said the positive-diagonal QR factorization is unique without the condition that makes it so. | It now says "when the columns of $A$ are independent". |
| 40h2, "Which sign?" | "Software takes $\alpha = -\operatorname{sign}(x_1)\|\mathbf{x}\|$" was stated as universal; some texts (for example Golub–Van Loan's `house`) keep the other sign and use a rewritten formula to avoid the cancellation. | "Library routines (LAPACK, for example) usually take…". |
| 33, Pythagoras plot | The "u + v" label sat on its own segment, and the dashed "v" label crowded the y-axis. | Segment labels replaced by `labels` at (1.05, 1.6), inside the triangle, and (−0.85, 1.0). |
| 37, unit-circle plot | The "2u₂" label sat on the dashed unit circle and the −1 tick. | The label is now placed at (1.45, −0.75), off the circle. |
| 38, level-curve plot | "Q = −4" floated at (2.4, 3.6), far from any orange curve; "Q = 4" was far below its curve; the "(1, 1)" label sat across the dashed principal axis $y = x$. | "Q = −4" now at (3.2, 1.2), just above the orange right branch; "Q = 4" at (3.2, −0.85), under the blue right branch; "(1, 1)" at (1.85, 1.25), clear of the axis and the curves. |
| 40h1, $\lvert t\rvert$ plot | The auto-placed "\|t\|" label sat on both curves at the right edge. | The "\|t\|" function label is removed and a free label added at (−0.62, 0.74), just above the solid line. |
| 40h2, reflection plot | The "u = x − 5e₁" label sat on the y-axis, and "Hx = 5e₁" sat on the x-axis tick labels. | Both moved to free labels at (−1.15, 4.6) and (3.6, 0.35). |
| `la-m9-four-subspaces.svg` and `-blank` | The red "A" (Nul A → 0) sat on its own arrow. | Moved to (288, 246), above the curve. |
| `la-m9-svd-steps.svg` and `-blank` | "e₂" was covered by its arrowhead, "σ₂e₂" sat on the ellipse outline, and "σ₁e₁" crowded the outline. | Moved "e₂" to (472, 98, end-anchored), "σ₂e₂" to (480, 394, end-anchored, above the ellipse) and "σ₁e₁" to (585, 410). |

## Checked and right (a reader might doubt)

- **Questions.** I worked all 82 questions before reading the keys, and every key is right. Spot
  values: q15 $\mathbf{v}_3 = (-\tfrac23, \tfrac23, \tfrac23)$; q17 residuals $0.5, -1, 0.5$;
  q27 eigenvalues $-2 \pm \sqrt2$; q31 $D_3 = 4$ with pivots $2, \tfrac32, \tfrac43$; q40
  $A^TA = [9\ 18; 18\ 36]$; h12 gives $5$ and $3b_2 = -3$; h18 gives $\mathbf{u} = (-2, 0, 4)$;
  h22 gives $(1, -3)$ (and $(2, -1) = \mathbf{x} - \mathbf{u}$ is the projection, as the explanation says);
  h25 gives $(\tfrac{11}{5}, \tfrac25)$; h27 gives $2\times10^7 - 6.7\times10^5 \approx 1.93\times10^7$;
  h39 gives $20\cdot1001 = 20{,}020$; h41 gives the $3.5I$ error $\sqrt{4.5}$.
- **Order and match questions.** Each has exactly one order: q08, q12, q19, q23, q29, q34, q38,
  h07, h20 and h34 have no swappable steps. q24's reflection pairing is right:
  $\mathbf{u}_1\mathbf{u}_1^T - \mathbf{u}_2\mathbf{u}_2^T = [0\ 1; 1\ 0]$.
- **40h1.** Recomputed in sympy and numpy:
  - $\langle t^2 - \tfrac13, t^2 - \tfrac13\rangle = \tfrac{8}{45}$, $c_2 = \tfrac{15}{16}$, and $\|\,|t| - \hat f\,\|^2 = \tfrac1{96}$ by direct integration;
  - the Fourier error norms for $f(t) = t$ are 2.847 ($n = 1$), 1.889 ($n = 3$) and 1.094 ($n = 10$), against $\|t\| = 4.547$.
- **40h2.** Läuchli example in double precision with classical Gram–Schmidt: $\mathbf{q}_2\cdot\mathbf{q}_3 = 0.5000$.
  numpy's Householder QR gives $\max|Q^TQ - I| = 2.2\times10^{-16}$. The modified Gram–Schmidt vector
  $(0, -\tfrac\varepsilon2, -\tfrac\varepsilon2, \varepsilon)$, the $H$ of Example 2 and every entry of
  Example 3 were checked by hand. The flop counts $2mn^2 - \tfrac23n^3$ (Householder) and $2mn^2$
  (Gram–Schmidt) match Trefethen & Bau, Lectures 8 and 10.
- **40h3.** Example 3 ($A_1 = [1.5\ 1.5; 4.5\ 4.5]$, error $\sqrt5$) and Example 4 ($90{,}050$, about 11%;
  $\sqrt{10.25/146.25} = 0.265$) are correct. The Penrose conditions are stated correctly for real
  matrices.
- **History.** These dates agree with standard references (Stewart 1993, "On the early history of the
  singular value decomposition", SIAM Review 35(4); MacTutor biographies; Householder, J. ACM 5 (1958);
  Penrose, Proc. Cambridge Phil. Soc. 51 (1955)): Cauchy 1821 (Cours d'analyse), Bunyakovsky 1859,
  Schwarz 1888, Legendre in the 1780s, Fourier 1822, Householder 1958, Moore 1920, Penrose 1955,
  Schmidt 1907, Eckart–Young 1936 and Mirsky 1960.
- **Core additions.**
  - Regression data $(0,1), (1,1), (2,4), (3,4)$ gives $y = 0.7 + 1.2x$, with residuals $0.3, -0.9, 0.9, -0.3$.
  - The hyperbola parametrizations in lesson 38 satisfy $Q = \pm4$ exactly.
  - Lesson 37: $4\mathbf{u}_1 = (2.828, 2.828)$ and $2\mathbf{u}_2 = (1.414, -1.414)$.
  - The SVD picture's directions match lesson 40's Example 1 ($\mathbf{u}_1 \propto (1, 3)$, $\mathbf{u}_2 \propto (3, -1)$, ellipse tilt $\arctan 3 = 71.57°$, semi-axis ratio 3). $V^T$ is drawn as a reflection, which is correct because $\det V = -1$.
- **Drills.** The 8 drills were generated 400 times each with the app's `generate()`, and every answer
  was recomputed independently from the values shown, with exact fractions or decimals rounded to 2
  places.
  - 0 key errors.
  - Correctly rounded 2-decimal answers and `sqrt(n)` are accepted.
  - Answers off by 0.02–0.03, or a fraction off by $\tfrac{1}{d}$, are rejected.
  - After the fixes there are no "+ -", "- -" or "1x" artifacts.
- **Pictures and diagrams.** All four label questions' markers sit on the parts named. All 9 Mermaid
  diagrams render legibly and their `accDescr` describe the whole chart. The notes say 10 (8 core);
  there are 7 core (lesson 33 has none) plus 2 honors, and lesson 33 still has two figures.
- **Glossary.** No term or alias of `glossary-r2-la-m9.yaml` duplicates another glossary file.
- **Overlap.** No overlap with other round 2 lessons. la-h1's writer moved Eckart–Young out of lesson
  92 and points to 40h3.

## Left as is / uncertain

- `la-m9-proj-plane.svg`: the z arrow stops just short of the tip of y, so the two arrowheads don't
  overlap. It reads correctly, but a strict reader might notice the gap.
- In `la-m9-regression.svg`, the residual at $x = 0$ (0.3) is hidden behind the y-axis.
- In lesson 35's Gram–Schmidt plot, the "v₂" label is close to (but not on) the y-axis tick "1".
