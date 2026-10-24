# Precalculus module pc-m6 (Systems and matrices), round 2: review

Reviewer for item 109. Scope: honors lessons 27h1 (transformations), 27h2 (Markov chains), 27h3 (eigenvalues); round 2 additions to core lessons 22–27; `questions/r2-pc-m6.yaml` (72), `drills/r2-pc-m6.yaml` (6), `glossary-r2-pc-m6.yaml` (16), `cards-r2-pc-m6.yaml` (27), `images/pc-m6-*` (14).

## Changes

| Where | Problem | Fix |
|---|---|---|
| pc-m6-r2-q01 (accept) | `leading term` was accepted. A leading term is a polynomial term (the course glossary defines it that way), not a matrix entry. | Removed it. Added `pivot element` and `leading element`, which are correct. |
| images/pc-m6-minor.svg and pc-m6-minor-blank.svg | The red cross-out line ran straight through the circled entry, so its minus sign disappeared and −1 read as "1". | Broke both cross-out lines where they meet the circle, so the circled −1 is readable. Label markers re-checked on the blank render. |
| 22-gaussian, Example 4 plot | The "(1, 4)" point label sat on the parabola. | Moved it to a free label below and to the right of the point. |
| 22-gaussian, circle-and-line plot | The "(3, 4)" and "(-4, -3)" labels sat on the circle. | Moved them off the circle and the line as free labels. |
| 27h1, Example 1 plot | The "(-1, 4)" label sat on the y-axis and its "4" tick. | Moved it to a free label to the left of the point. |
| 27h2, weather plot | The y-axis title "probability of sun" overlapped the top dot (0, 1) and the "1" tick. | Changed the y-range from [0, 1.05] to [0, 1.15]. |
| 27h3, "Finding the eigenvectors" | "The two equations are multiples of each other, so one can be dropped" fails when $A = \lambda I$ (both equations read 0 = 0). | Added one sentence covering that exception. |
| 27h3, "Why eigenvectors make powers easy" | "The term with the larger $\lvert\lambda\rvert$ takes over" is false if that term's coefficient is 0. | Added "(as long as its coefficient is not 0)". |
| cards-r2-pc-m6, "Chains that don't settle" | "Chains with an absorbing state … end up stuck there" leaves out the condition the lesson states: the absorbing state must be reachable. | Now reads: "If some absorbing state … can be reached from every state, the chain ends up stuck in an absorbing state with probability 1." |
| glossary "characteristic equation of the matrix" | Its alias "characteristic polynomial" pointed to a definition of an equation, not a polynomial. | The definition now says the left side, $\det(A - \lambda I)$, is the characteristic polynomial. |

No answer key was wrong. All 72 questions were worked independently before looking at the keys.

## Checked and found right (a reader might doubt these)

- **Every question.** All keys, select-all sets, order uniqueness (q02, q12, q20, q22, q28, h14, h27, h36), match pairings, and the reasoning in every distractor explanation were checked. Examples: q03, $x = -1 + 9t$; h03, the $(5, 5)$ distractor equals $A^T$ times the point; h19, $\begin{bmatrix} 0.5 & 1 \\ 0.5 & 0 \end{bmatrix}^2$ is all positive; h22, using column 1 instead of row 1 gives 320; h23, a row 3 of $(0, 0, 1)$ means nothing enters state 3; h38, the determinant is $6 + 4 = 10$.
- **Label markers.** All six label questions were rendered with their markers, and each marker is on the part it names. In q26, marker 5 sits about 12 px up and right of the open dot at (5, 3), touching it, so it is unambiguous; the others are exact (checked against the SVG coordinates).
- **SVGs.** All 14 were rendered. Solution-case lines, the det-area dissection (each of the six pieces has the labeled area), the F gallery (rotation, reflection, shear and stretch images computed), unit-square map, row-times-column, inverse-by-rows and eigen-direction arrows are geometrically correct.
- **Drills.** Each of the 6 was generated 1,500 times with the app's own generator. Every target was recomputed in Python/sympy from the prompt as displayed, with 0 mismatches. Correct answers are accepted (markov-step accepts both 0.65 and 0.650). Wrong answers are rejected. There are no "+ -", "1x" or unfilled placeholders. The only thousands commas are in the bolded answer of image-area, outside math.
- **Lesson numbers.** All lesson numbers were recomputed: weather chain $P^2$ and the day-by-day values; bike stations (400, 280, 320) and the steady state (0.2, 0.3, 0.5); Examples 1–4 of 27h1; the eigen examples; the Fibonacci ratios; Binet's formula, consistent with 40h1-recurrences ($F_0 = 0$, $\psi = 1 - \varphi$).
- **History.** Markov introduced chains in 1906 to extend the law of large numbers to dependent variables. In 1913 he analyzed vowel/consonant sequences in the first 20,000 letters of *Eugene Onegin* (B. Hayes, "First Links in the Markov Chain", *American Scientist* 101(2), 2013). Brin & Page (1998, *Computer Networks and ISDN Systems* 30) "usually set d to 0.85". The lesson labels PageRank as simplified.
- **Mermaid diagrams.** All 10 were rendered. The content is correct and every accTitle/accDescr describes the whole diagram.
- **Glossary duplicates.** None. pc-m9's "characteristic equation" and "golden ratio" are avoided as the writer describes.

## Overlap

There is no duplicated teaching. 33h1 (pc-m7 rotation of axes) points ahead to 27h3 for eigenvalues, and 27h3 points to 40h1 for Binet's formula. Both are consistent.

## Left as is / uncertain

- The 26-partial-fractions plot: the renderer places the axis letter "x" and a few tick labels where the dashed curves pass near the x-axis. This can't be avoided with these functions and is only cosmetic, so I left it.
- In the bike-station Mermaid diagram, Mermaid places a few edge labels (0.2, 0.1) on their arrows. They are still readable.

`content/math/check-module.sh precalculus pc-m6`: OK, zero problems.

Counts: answer-key errors 1 (q01 accept list), factual fixes 4 (two 27h3 caveats, the absorbing-state card, the characteristic-polynomial glossary entry), picture fixes 5 (minor SVG pair, 4 plots), other fixes 0.
