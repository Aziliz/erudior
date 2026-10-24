# Round 2 review: alg-m4 (Systems of equations and inequalities)

Reviewer for item 3. Scope: honors lessons 17h1 (Cramer's rule) and 17h2 (linear programming), the
round 2 additions to lessons 14–17, `questions/r2-alg-m4.yaml` (48), `drills/r2-alg-m4.yaml` (5),
`glossary-r2-alg-m4.yaml` (11), `cards-r2-alg-m4.yaml` (23), `images/alg-m4-*` (11 SVGs).
`content/math/check-module.sh algebra1 alg-m4` reports zero problems after the fixes below.

Counts: answer-key errors 0, factual fixes 3, picture fixes 5, other fixes 1.

## Changes

### Factual
- **17h1, "A little history".** The lesson credited the rule to Cramer (1750) with no mention that
  Colin Maclaurin had proved it for 2 × 2 and 3 × 3 systems first, in his *Treatise of Algebra*
  (published 1748, after his death). Added one parenthetical sentence saying so, and that the rule
  is named for Cramer, whose version covered any number of unknowns. Source: MacTutor, "Matrices and
  determinants" (mathshistory.st-andrews.ac.uk/HistTopics/Matrices_and_determinants/).
- **cards-r2-alg-m4.yaml, "Unbounded feasible region".** "Minimizing a positive-coefficient cost with
  $x, y \ge 0$ always has a minimum" is false for an empty (infeasible) region. Changed it to "over a
  nonempty region always has a minimum".
- **glossary-r2-alg-m4.yaml, simplex method.** "The standard procedure" overstated it, since interior-point
  methods are also standard. Changed it to "A standard procedure".

### Pictures and plots
- **images/alg-m4-feasible-region.svg.** The "vertex (4, 1)" label started on the dashed line. Moved it to
  (418, 272), in the gap between the two lines right of the vertex. Re-rendered. The blank copy has no
  text, and the q16 markers are unchanged and still on their parts.
- **Four ```plot figures.** The writer could not preview these. I rendered them with the app's own
  `renderFigure` and `styles.css`. All four had labels on curves or on each other, so I fixed them
  with free `labels` (same content, same captions):
  - 15 (sum line): the segment label "sum: 8x = 8" landed on the intersection point, and "(1, 2)" and
    "3x + 2y = 7" sat on lines. Now "sum: x = 1" is at the top beside the dashed line, "(1, 2)" is
    between the lines, and "3x + 2y = 7" is below the line at left. This matches the lesson sentence
    "its graph is the vertical line x = 1".
  - 17h1 (nearly parallel lines): the three curve labels were printed on top of each other at the
    lower right. I replaced them with a key in the empty upper right: "steepest: x + y = 2",
    "other solid: x + 1.1y = 2.1", "dashed: x + 1.1y = 2.2".
  - 17h2 (level lines): "P = 120/200/240" overlapped the x-axis ticks and each other, and the vertex
    labels "(0, 8)" and "(6, 0)" were crossed by the P = 200 line. The bands between level lines are
    too narrow for a label, so I did three things. The P = 240 line now stops at x = 4.6, which still
    clearly misses the region. P = 240 is labeled at the end of that line, P = 200 to the right of its
    line, and P = 120 inside the region below its line. The (0, 8) and (6, 0) dots no longer carry
    labels: their coordinates can be read on the axes and are listed in the text.
  - 17h2 (whole-number plan): "(2, 3)" and "corner (1.8, 2.8)" overlapped each other, and "(2, 2) best"
    and "2x + 3y = 12" overlapped each other. Labels now sit beside their points ("(1.8, 2.8)" below the
    corner inside the region; the caption already says it is the best corner). Both line labels are
    off the lines.

### Other
- **17 Mermaid (graphing an inequality).** The edge label `"no: < or >"` used raw `<`/`>`, which the
  brief says can vanish. It is now `"no: #lt; or #gt;"`. Re-rendered: it reads "no: < or >".

## Checked and found right (a reader might doubt these)
- **Every question worked independently before I read the key.** All 48 keys are right. Select-alls
  q04, q09, q14, q19, h09 and h21 were checked choice by choice. The order questions (q03, q08, q13,
  q18, h08, h28) each have exactly one valid order. Text `accept` lists are complete; in q12, "40"
  compares by value. Distractor explanations name real slips (h01: 2, −22, 7; h02: −23).
- **Python/brute force:**
  - Bakery integer optimum (2, 2) = 180; the continuous corner (1.8, 2.8) = 202.
  - h22 integer optimum (1, 4) = 19; the corner (2.2, 3.4) = 20.2 is the best corner.
  - Feed-region minima on a fine grid: 4x + 3y gives 21, 2x + 5y gives 18, x + y gives 6, 2x gives 0.
  - h24 range 4/3 ≤ p ≤ 8, checked at and past both ends.
  - Workshop range 20 ≤ p ≤ 40, with p = 15/45 as in Example 1; h17 range 30–60; h18 tie at 240.
  - The q17 polygon is convex.
- **17h1 proofs.** $aD_x + bD_y = eD$. "D = 0 ⇔ equal slopes", including the vertical case. The claim
  "D = Dx = Dy = 0 ⇒ same line" holds for genuine lines: all 2 × 2 minors of the augmented 2 × 3
  matrix vanish, so it has rank 1. The $0x + 0y = 1$ caveat is correct. Every example number
  (−38/−38/−76, −19/−88/−96, k = 1 → Dx = 28, k = −9 & m = 12, the 0.1 and 0.01 sensitivity) is right.
  Lesson 15 Examples 2 and 3 are the systems cited.
- **Drills.** I generated 600 instances of each of the 5 drills with the app's `generate`. Each was
  recomputed in Python from the printed prompt alone: determinant; D, Dx, Dy, x, y; k = bc/d; the LP
  minimum by vertex enumeration plus a 0.1-step grid; the sensitivity range by brute force over p.
  There were 0 mismatches. The displayed answer is accepted and target + 1 is rejected in every
  instance. There are no "+ -" signs, "1x" coefficients or unfilled placeholders. All answers are
  exact integers, so no tolerance is needed.
- **SVGs.** All 11 rendered: content, labels and markers are correct. The break-even graph matches
  C = 600 + 1.5n, R = 4n and (240, 960). The feed region has C = 21 through (0, 7) and (5.25, 0), and
  C = 36 through (0, 12) and (9, 0). The Cramer figure's numbers are correct. The mixture volumes are
  30/20/50.
- **Mermaid.** All 6 diagrams rendered. Their content matches the lessons, and every accTitle/accDescr
  describes the whole diagram.
- **Glossary.** No term or alias duplicates any glossary*.yaml in the course. The definitions are correct.
- **History.**
  - Seki 1683, Leibniz's 1693 letter (to de l'Hôpital), and Cramer 1750 (*Introduction à l'analyse
    des lignes courbes algébriques*, finding a curve through given points): MacTutor.
  - Kantorovich's plywood-trust problem (1938–39) and his 1939 book: Econlib biography of Kantorovich.
  - 1975 Nobel Memorial Prize to Kantorovich and Koopmans "for their contributions to the theory of
    optimum allocation of resources": Econlib, and NobelPrize.org's 1975 listing (search result; the
    page itself would not load).
  - Dantzig 1947 and the U.S. Air Force: standard, and in the writer's INFORMS source.
- **Overlap.** No other round 2 lesson in Algebra 1 covers determinants, Cramer's rule or linear
  programming. I checked every NOTES2-*.md and the a1-h1 lessons.

## Left uncertain
- *Nine Chapters* dating: MacTutor puts it at about 200–100 BC, and other references say it reached its
  final form around the first century CE. The lesson's "compiled by about the first century CE" is
  consistent with both, so I left it.
- Kantorovich's starting problem is described as distributing raw materials or work among peeling
  machines at the Plywood Trust. The lesson's "assigning work to machines at a plywood factory" is a
  fair simplification, so I left it.
- 17h1 is now about 2,300 whitespace-separated words, math tokens included (the writer counted about
  2,050). The prose alone is within the 2,200 guideline.
