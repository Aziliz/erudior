# Round 2 review: la-m4 (Linear transformations)

Reviewed: honors lessons 14h1 (`la-m4-h-lines`) and 14h2 (`la-m4-h-inverses`), the round 2
additions to lessons 12, 13 and 14, `questions/r2-la-m4.yaml` (42), `drills/r2-la-m4.yaml` (5),
`glossary-r2-la-m4.yaml` (7), `cards-r2-la-m4.yaml` (21) and the 8 `images/la-m4-*` SVGs.

## Changes

1. **la-m4-r2-h25 (match), answer-key error.** The pairs were "Pivot in every row → Has a right
   inverse" and "Square, with a pivot in every row → Invertible". A square matrix with a pivot in
   every row *also* has a right inverse, and match answers may repeat, so a learner who picked
   "Has a right inverse" for the square case was marked wrong while being right. The distractor
   "Has exactly one right inverse" was also true of the square case (an invertible matrix has
   exactly one right inverse, $A^{-1}$). Rewrote the left items to be mutually exclusive (pivot in
   every column but not every row / every row but not every column / every row and every column /
   fewer pivots than rows and columns), with answers "Left inverses only, no right inverse",
   "Right inverses only, no left inverse", "One inverse that works on both sides", "No one-sided
   inverse at all", and a distractor that fits no item ("Many left inverses and many right
   inverses"). Explanation rewritten to match. Id kept.
2. **Lesson 14h2, Common mistakes, "Wrong size" (factual tightening).** It said "For a $3 \times 2$
   matrix, both kinds of one-sided inverse are $2 \times 3$", which suggests a $3 \times 2$ matrix
   can have a right inverse (it never can: tall matrices are never onto, as the lesson itself
   says). Now: a one-sided inverse of an $m \times n$ matrix is $n \times m$; a left inverse of a
   $3 \times 2$ matrix is $2 \times 3$; a tall $3 \times 2$ matrix never has a right inverse.
3. **Lesson 14h2, Example 1 plot (plot fix).** Rendered with the app's code, the curve labels
   "c = −2", "c = 0", "c = 2", "c = 4" were drawn on top of their own lines (the renderer puts a
   function label at the right end, which sits on a descending line), and "(-2, 1)" sat on the
   c = 0 line. With lines only 1 unit apart there was no room for clear labels, so the plot now
   shows c = −4, 0, 4 (lines 2 units apart), ends each line at $x_1 = 3$ and places the c labels
   just past the line ends, with "(-2, 1)" in the band between c = 0 and c = 4. Caption unchanged
   (it names no particular c values; the lesson text doesn't either). Re-rendered: nothing
   overlaps.
4. **Lesson 12 Mermaid "Is T linear?" (diagram fix).** The diamond "Each output entry just
   c1x1 + ... + cnxn?" had only "yes" and "not sure" exits, so a learner answering "no" had
   nowhere to go. The edge is now "no, or not sure" → check both linearity properties (where a
   counterexample shows "not linear"); accDescr updated to match.

## Checked and found right (a reader might doubt these)

- 14h1: $P$ (angle and slope forms), $R = 2P - I$ and its $2\theta$ form, $R\mathbf{w}_\varphi = \mathbf{w}_{2\theta-\varphi}$,
  reflections at $\alpha$ then $\beta$ = rotation by $2(\beta-\alpha)$ (checked $R_\beta R_\alpha$ numerically for all
  multiples of 15°), rotation by $\gamma$ then reflection at $\beta$ = reflection at $\beta - \gamma/2$. Examples 1–3
  recomputed ((3,1) → P (1,2), R (−1,3); 60° rotation matrix and both columns; $\tfrac15[4\ 3;\ 3\ -4]$ is the
  reflection across $x_2 = \tfrac13 x_1$, about 18.43°). The flag plot's three polygons are exactly
  the start, its reflection in the $x_1$-axis, and the 60° rotation of the start. "Isometry" from
  Greek isos + metron is correct. The right-triangle derivation of $P\mathbf{e}_1$ is flagged as
  holding as drawn and then verified for all θ via $P\mathbf{u} = \mathbf{u}$, $P\mathbf{n} = \mathbf{0}$: fine.
- 14h2: Example 2 preimage $(b_1-2b_2, b_2, 0) + t(6,-3,1)$; Example 3 right inverses (both
  columns choices); Example 4 left inverses $C$ and $C'$, $C(2,3,-3) = (2,-1)$, and the warning
  case $A(1,-2) = (1,0,-6)$; the composition theorem and counterexample; $C = D$ proof.
  Cross-references hold: structure theorem is lesson 10 (Module 3), inverses are Module 5, rank
  is Module 7, and lesson 36 does use $(A^TA)^{-1}A^T$. The unproved "a one-to-one $A$ has $n$ rows
  forming an invertible block" and "every linear isometry of the plane is a rotation or reflection"
  are labeled as taken on trust / stated without proof.
- All 42 questions worked independently before reading keys; all other keys, `accept` lists and
  distractor explanations are right (e.g. h03's four matrices are the 60° reflection, 30°
  reflection, 120° rotation and 60° projection; h20's three wrong products; h06 line $x_2 = \tfrac23x_1$).
  Order questions q04, q08, q15, h10, h24 have only one valid order. q05 repeats the answer
  "Linear" on purpose (allowed in match).
- Pictures: all 8 SVGs rendered (label copies with their markers). Geometry is right (reflect-line
  points at exact grid positions; gallery panels match their matrices; arrow diagrams match their
  alt text and labels), fonts ≥ 14 px, nothing cut off, every marker on the part its label names.
- Plots: lesson 13 rotation plot and 14h1 flag plot read cleanly (the "1" tick on the $x_2$-axis
  under the $\mathbf{e}_2$ arrowhead in lesson 13 is the app's own tick label and unavoidable).
  Mermaid charts in 13, 14 and 14h2 are correct, readable, with full accDescr.
- Drills: regenerated 2,000 instances of project/reflect (compared with $\mathbf{u}\mathbf{u}^T\mathbf{x}$ and
  $2P\mathbf{x}-\mathbf{x}$), all 132 angle pairs of two-reflections (compared with the product of the two
  reflection matrices), 2,000 preimage instances ($A\mathbf{p} = \mathbf{b}$, $A\mathbf{v} = \mathbf{0}$): 0 failures.
  Projection and reflection answers always have denominator 2, 5 or 10, so they are exact
  3-place decimals and tolerance 0.001 accepts them. Left-inverse drill checked algebraically
  (det ±1 gives integer $B^{-1}$; $\mathbf{b} = A\mathbf{s}$ is in the range by construction).
- Glossary: no term or alias collides with any other `glossary*.yaml` in the course. Cards correct.

## Overlap (no change made)

- 14h1's projection onto a line previews lesson 34 (orthogonal projections, Module 9), and
  $R = 2P - I$ is closely related to the Householder reflection in 40h2 (la-m9). 14h1 works in
  $\mathbb{R}^2$ with angles and slopes and comes first, so it reads as a preview, not a repeat.
- 14h2's closing mention of $(A^TA)^{-1}A^T$ as a left inverse is also in 40h3 (pseudoinverse); it
  is a one-sentence forward reference.

## Uncertain

- Nothing outstanding. `content/math/check-module.sh linear-algebra la-m4`: OK, zero problems.

Counts: answer-key errors 1, factual fixes 1, picture/plot/diagram fixes 2, other fixes 0.
