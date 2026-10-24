# Round 2 review: phys-m3 (Forces and Newton's laws), item 83

Reviewed independently: honors lessons 10h1 (friction in systems) and 10h2 (accelerating frames), the
additions to core lessons 07–10, `questions/r2-phys-m3.yaml` (46), `drills/r2-phys-m3.yaml` (5),
`glossary-r2-phys-m3.yaml` (7), `cards-r2-phys-m3.yaml` (17) and the 15 `images/phys-m3-*` SVGs.

## Changes

| Where | Problem | Change |
|---|---|---|
| q12 (order) | Steps "draw a free-body diagram for each block" and "choose a positive direction for each block" can reasonably be done in either order, so the order was not unique. | Replaced the items with a strictly sequential chain: choose positive directions → write ΣF = ma for each block → add the equations so T cancels and solve for a → substitute a to find T. Explanation rewritten to match. |
| q02 (order) | "Choose axes" could be read as swappable with "draw the free-body diagram". | Item now reads "Choose axes that suit the forces drawn, ideally one along the acceleration", and the explanation says why axes come after the diagram (so as many forces as possible lie along them). Order unchanged. |
| 10h1, Common mistakes (banked curve) | "At and above the design speed it [n] is larger than mg cos θ" implied it might not be below. Solving the vertical and inward equations gives n = mg cos θ + (mv²/r) sin θ for any friction value, so n > mg cos θ at every nonzero speed. | Stated the formula and "larger than mg cos θ at any nonzero speed". Derived and checked here. |
| 10h2, Earth as a rotating frame | Claim that the bulge "accounts for the rest" gave no scale (writer flagged it). | Added the numbers: g ≈ 9.78 m/s² at the equator, ≈ 9.83 m/s² at the poles; the centrifugal term (0.034 m/s²) is roughly two-thirds of the 0.05 m/s² difference. Source: WGS 84 normal gravity (9.7803 / 9.8322 m/s²). |
| 10h2, Coriolis | "Large storm systems rotate counterclockwise in the Northern Hemisphere" is true of cyclones but not of high-pressure systems (anticyclones rotate clockwise there). | Now "large low-pressure storm systems, such as hurricanes". |

Counts: answer-key errors 0; factual fixes 2 (10h1 normal force, 10h2 storm systems); picture fixes 0;
other fixes 3 (q12 order uniqueness, q02 wording, 10h2 g numbers added).

## Checked and found right

- Every question worked before reading the key; all numbers recomputed in Python (g = 9.8): q01 678 N,
  q06 tan 25° = 0.466, q11 1.96, q16 4, q18 n = 0.5mg / mg / 2.5mg, h02 36.75 N (and the 7.35, 29.4,
  73.5 distractors), h03, h04 2.94, h05 (49 vs 29.4 N, limit 33.9 N, friction 19.6 N up the slope), h06
  2.87 / 1.13 / 3.00 kg, h08 22.05 m/s (distractors 11.76, 17.71, 21.26 match their stated mistakes),
  h13 tan 20° = 0.364, h15 1.73 (55.6, 9.65, 0.176), h17 28.4 s (4.52, 9.03, 128), h23 0 / 6.8 / 9.8 /
  12.8, h25 0.582 s (0.639, 0.716, 0.412), h26 4.23 rpm.
- Select-all q03, q08, q13, q19, h09, h20: every keyed answer right, every other choice clearly wrong.
  h09 "static friction from the road pushes a car forward" is correct for tires rolling without slipping.
- Order q10, h10, h23, q18: unique orders.
- Match q05, q07, q15, q17, h11, h21: unambiguous (repeated answers are intended category sorting).
- Lesson worked examples: 10h1 Ex 1 (3.0 m/s², 6.0 vs 7.84 N, 39.2 N, 2.94 and 6.77 m/s²), Ex 2
  (12.7 N limit, a = 0.690 m/s², T = 36.4 N, range 1.20–3.80 kg), Ex 3 (12.6 m/s, 19.1 m/s, 14.9 and
  9.8 m/s, km/h conversions); 10h2 Ex 1 (17.0°, 2.05 N), Ex 2 (0.504 vs 0.553 s), Ex 3 (0.313 rad/s,
  20.1 s, 3.0 rpm, 98.2%), ω²R_E = 0.034 m/s² (0.35% of g), Coriolis 0.0021 m/s² for 20 m/s at 45°.
- Banked-curve v_max / v_min formulas re-derived; limiting cases (μ = 0, θ = 0, μ ≥ tan θ) correct.
- Coriolis direction (right in the Northern Hemisphere, merry-go-round turning counterclockwise
  deflects to the right), "too weak to set sink drain direction", and the "few rpm" comfort figure (hedged
  as uncertain in the lesson) are consistent with standard references (e.g. OpenStax University
  Physics vol. 1, §6.3 sidebar on Coriolis/inertial forces).
- "Max acceleration ≈ μs g for all-wheel drive" is labeled as a simplified model.
- Drills: sampled instances and recomputed independently from the prompts; relTolerance 0.01 accepts
  any correctly rounded 3-significant-figure answer (max rounding error 0.5%). The incline-pulley `where`
  (a > 0.3) keeps the stated motion direction physical; banked-range `where` guarantees a real v_min.
  check-module's 40-instance generation passes.
- All 15 SVGs rendered: geometry right (θ between mg and the into-slope axis; n tilted toward the
  center by θ; pendulum hanging backward with −mA dashed; movable pulley 2T = W), text readable,
  nothing cut off. All six label questions' markers sit on the arrows their labels name.
- The 08 friction-vs-applied-force plot and all six Mermaid diagrams rendered and read correctly;
  accTitle/accDescr describe the whole diagram.
- Glossary terms do not duplicate any other physics glossary file; definitions and cards correct.

## Overlap

`lessons/90-gravity-spacetime.md` (phys-h1) refers back to 10h2's fictitious force in its equivalence-
principle section; that is a cross-reference, not a repeat. 10h2's elevator example overlaps round 1's
apparent-weight example in 07 only in setting (it asks a different question in a different frame).

## Left uncertain

- Third-law SVG: the "Table pushes book up" arrow starts inside the book box close to the word "Book";
  readable, left as is.

`content/math/check-module.sh physics phys-m3`: OK, zero problems.
