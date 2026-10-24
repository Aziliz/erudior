# REVIEW2-phys-m2: Round 2 review of Kinematics (University Physics I)

Reviewer, independent of the writer. Scope: honors lessons 06h1-aiming-projectiles.md and 06h2-curved-paths.md, round 2 additions to lessons 03–06, `questions/r2-phys-m2.yaml` (49), `drills/r2-phys-m2.yaml` (5), `glossary-r2-phys-m2.yaml` (9), `cards-r2-phys-m2.yaml` (20), `images/phys-m2-*` (12 SVGs).

`content/math/check-module.sh university-physics-1 phys-m2` after fixes: **OK, zero problems** (6 lessons, 90 questions, 15 drills, 37 cards).

## Changes

| Where | What was wrong | Fix |
|---|---|---|
| phys-m2-r2-q04 (explanation) | Said the object "is at rest only for the instant $t = 8.5$ s", but the graph starts at $v = 0$, so it is also at rest at $t = 0$. | Now: at rest only at single instants, at the start ($t = 0$) and at the turnaround ($t = 8.5$ s). Key unchanged. |
| images/phys-m2-curve-accel.svg | The dashed line to the center of the curve ran through the closing parenthesis of the "(changes direction)" label. | Moved the two "radial part" label lines left (end x 226.8 → 212). Blank version unaffected. |
| images/phys-m2-osculating.svg | "N̂ (unit normal)" ran across the blue path, and "center of curvature" ran across the dashed circle. | Split the normal label into two lines inside the circle ("N̂" / "(unit normal)"); centered "center of curvature" under the center dot. Blank version unaffected. |
| 06h1 safety-parabola plot | The dashed safety parabola ended at x = 40.8 right against the "x (m)" axis label. | x range [0, 44] → [0, 48]. |
| 06h2 osculating-circle plot | The path, drawn to t = 2.8 s, ended on the x axis on top of the "x (m)" label. | Parameter range t ∈ [0, 2.8] → [0, 2.6] (ends at (20.3, 3.2)). |

Counts: answer-key errors 0; factual fixes 1 (q04 explanation); picture fixes 2 SVGs; other fixes 2 (plot label collisions).

## Checked and found right

- **All 49 questions worked independently before reading keys.** Every key and every distractor value recomputed (e.g. h02 25.8°/64.2°; h03 safety parabola $10 - x^2/40$ gives 1.9 m at x = 18, so (18, 2) is out of reach and the others are in; h05 16.3 m/s, distractors 15.3 = √(2gy), 12.1 = √(gd), 5.4 = √(g|y − d|); h08 7.73 m, 7.47 = L cos α, 7.22 without cos²α, 10.2 level range; h17 17.0 m, 10.2, 12.8 = v²/|a_t|, 1.70; h22 81.6 m, 40.8, 47.1, 10.2; h23 20.4 m vs 20.0 displacement, 22.4, 10.2; h27 −2.24 m/s²). Text accept lists complete (all numeric ones say "Give only the number"). Order questions (q10, q14, h11, h24) have one defensible order; match pairs unambiguous; select-all sets correct.
- **Lesson numbers recomputed in Python:** 06h1 Ex 1 (k = 11.025, disc 193.3, 36.1° / 63.3°, 1.86 s / 3.34 s, safety parabola 9.38 m at 30 m), Ex 2 (12.8 m/s, 54.2°, α = 18.4°), Ex 3 (13.6 m, 17.1 m at 55°, 23.0 m level, 34.9 m downhill at 35°); 06h2 Ex 1 (7.81, 0.768, 8.45, ρ = 7.22 m, center (7.621, 1.455)), Ex 2 (22.2 m, 40.4 m, −5.62 m/s²), Ex 3 (5.22 m/s², 73.3°, 106.7°), Ex 4 (3.66 m vs 3.61 m). Derivations checked: quadratic in tan θ, envelope, $v_{0,\min}^2 = g(y + d)$ and the 45° + α/2 identity, slope range and its maximum, $\vec a = \dot v\hat T + (v^2/\rho)\hat N$, $|\vec v\times\vec a| = v a_n$, projectile ρ = v³/(g v_x). Sign remark "negative cross product means clockwise" is right.
- **Plot functions:** trajectory end points (26.24, 38.35, 40.20, 31.27, 13.96 m) are the 20 m/s ranges; safety parabola 20.408 − 0.01225x²; each trajectory is tangent to it. Lesson 04 rectangle/triangle plot (20 m + 25 m) right.
- **Pictures** (all six pairs rendered, markers checked on the blanks): projectile-parts velocity arrows are tangent to the drawn parabola and the components match at symmetric points; slope-launch geometry is to scale for Example 3(a) (θ = 40°, α = 20°, apex-to-landing ratio 1.13 matches 11.3 m vs 12.8 m); osculating circle is the true osculating circle of the drawn parabola (ρ = 100 px, center computed); curve-accel center is equidistant from the road at every point and the car moves counterclockwise; roof-throw heights are to scale (11 m : 20 m).
- **Mermaid** (6 diagrams rendered): content correct, accTitle/accDescr describe the whole diagram, readable.
- **Drills:** formulas checked against independent numerical methods (both angles land on the target over 3,000 instances; minimum speed and angle by brute-force search over angles; slope range by bisection and L_max by angle sweep; a_t by finite differences over all 724 allowed tn-accel instances). Tolerances accept correctly rounded answers (0.1° for nearest-0.1° angles; 1% relative for 3 s.f.). Placeholder `\sqrt{{disc:sig4}}` fills correctly per `src/lib/drills.ts`.
- **Glossary/cards:** no term or alias duplicates any glossary*.yaml in the course; definitions correct.
- **History:** Galileo, *Discourses and Mathematical Demonstrations Relating to Two New Sciences* (Leiden, 1638), Fourth Day: parabolic path of a projectile and equal ranges for elevations equally above and below 45°, with tables of ranges; matches the lesson and card.
- **Overlap:** no other round 2 module in this course covers projectile targeting or curvature (checked all NOTES2-*.md). 06h2 extends round 1 lesson 10 (circular motion) and does not repeat it.

## Left as is / uncertain

- "path length" as an alias of arc length: the waves/sound lessons talk about path-length difference; since glossary pop-ups attach only to bolded terms, it should not collide, but worth a glance if it does.
- 06h2 "which you can see in any photograph of a long kick": mild, since real kicks have drag; left.

## Sources

OpenStax *University Physics* Vol. 1, §4.3–4.4 (projectile motion; tangential and centripetal acceleration); Galileo, *Two New Sciences* (1638), Fourth Day; standard calculus results (curvature κ = |v × a|/v³, arc length), checked symbolically and numerically.
