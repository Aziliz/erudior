# Round 2 review: module mv-m6 (Triple integrals and change of variables)

Reviewer for item 77. `content/math/check-module.sh multivariable mv-m6` after fixes: build and
checker OK (6 lessons, 93 questions, 14 drills, 37 cards), zero problems.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| `images/mv-m6-torus-section.svg` and `-blank.svg` | The horizontal line z = 0 ran left past the axis into r < 0, which is outside the half-plane the picture shows. The label "r" sat just right of the disk, where it read as a radius of the disk. | The line now starts at the axis. The "r" label is now at the right end of the line, as an axis label. Re-rendered both, and the markers still sit on their parts. | Picture check |
| `lessons/28h2` n-ball ```plot | The x-axis label "dimension n" sat on the bars for n = 11 and 12. | Changed the x range from [0, 13] to [0, 16] so the label clears the bars. Re-rendered with preview-plots. | Picture check |
| `lessons/28h2` intro | Said "Lesson 28 ended with a promise". The promise to design your own coordinates is in Lesson 28's opening paragraph (line 17). | "opened with a promise" | 28-jacobian.md |
| `lessons/28h2` Pappus | "around AD 300" was a little early. Pappus lived c. 290–350, flourished c. 320, and wrote the *Collection* c. 340. | "in the early 300s AD" | Britannica, "Pappus of Alexandria" (fl. AD 320); MacTutor biography; Wikipedia |
| `lessons/28h2` torus paragraph, and the glossary entry `torus` | Defined "torus" as the solid. In standard usage, and in this course (Lesson 34, mv-h1's Gauss–Bonnet lesson, the Euler characteristic glossary entry), a torus is the surface. | Lesson: "Strictly, the word names the surface; here we need the solid doughnut (a solid torus) …". Glossary: the surface from revolving a circle; revolving the disk gives the solid torus, with volume 2π²Ra². | Standard definition |
| `questions/r2-mv-m6.yaml` mv-m6-r2-h09 | The distractor "Earth is slightly flattened at the poles" is a true statement about Earth, and the explanation didn't say why it isn't the answer. | Added a sentence: flattening is about Earth's outer shape, while a factor below 0.4 is about how mass is distributed inside. The key is unchanged. | — |

**Counts:** answer-key errors 0; factual fixes 3 (Pappus date, torus definition in the lesson and glossary, the "ended with" cross-reference); picture fixes 2 (torus section, n-ball plot); other fixes 1 (h09 explanation).

## Checked and found right

- **All 49 questions**: I worked each one before looking at the key, and checked with sympy where needed: q10 64π/3 (the 8π and 128π/3 distractors), q03 (the wrong-shadow integral really is 0 and the prism is 1/2), q15 φ order 0 < π/6 < π/2 < 3π/4 < π, q17 J = −1/2, q20 2 ln 4 (60 and 4 ln 4), h10 the cone 3/10, h12 4.18 / 4.95 / 4.04 / 3.50, h18 6, h22 order V1 < V10 < V2 < V8 < V5, h25 π²a⁴/2, h26 1 − 0.9¹⁰ ≈ 0.651, and h27 72π/5 (with 24π/5, 8π/5 and 8π). Every key has exactly one defensible answer. The text accepts are complete, and the order questions have no steps that could be swapped.
- **h13 distractor**: "average of sin²φ over [0, π] is 2/3" is false. The plain average is 1/2. You get 2/3 only when the average is weighted by sin φ, so the distractor is correctly wrong.
- **Lesson numbers**: Example 3 (0.119 and 0.0339 kg·m²) and the rolling speeds in Example 4 (5.29, 5.11, 4.85, 4.43, 6.26). The linear-density ball: m = πδ₀a³/3, I = 4πδ₀a⁵/45, ratio 4/15. The shell derivative argument gives 2a²/3. The ellipsoid I_z = m(a² + b²)/5. The slanted box: det = 2, V = 3, integral 9/2. The toroidal Jacobian is −s(R + s cos α) in the order (s, α, θ), absolute value as stated. Torus 6π² ≈ 59.2. Pappus triangle 16π both ways. The n-ball recursion integral is 1/n. V₁…V₁₂ match π^{n/2}/Γ(n/2 + 1) (the plot heights are correct). The shell fractions are 27%, 65% and > 99%.
- **Rolling-race picture**: the distances traveled are in the ratio 1/(1 + β), as they should be at equal times (0.93, 0.84, 0.70 relative to the ball).
- **Earth's moment of inertia factor**: 0.3307, which the lesson rounds to 0.331 (Wikipedia, "Moment of inertia factor"). The rolling race is labeled as an idealization.
- **Other pictures**: the tetrahedron picture's projection is consistent. The green segment is at (0.3, 0.3) and runs from z = 0 to z = 0.4 on the top plane. The cylindrical and spherical pictures have P and its shadow exactly on the generated ellipses, and the θ arc runs from +x toward the r segment.
- **Label markers**: all six label questions have their markers on the named parts.
- **Mermaid diagrams**: all 5 were rendered. They are correct and readable, and accTitle/accDescr describe each whole diagram.
- **Drills**: I recomputed all 6 independently. The planes determinant is 1 + pqs, checked symbolically for every (p, q, s), and the `where` clause excludes det = 0. The torus drill's square always stays in r ≥ 0. The 2-decimal answers use tolerance 0.005 and the I answers use sigfigs 3.
- **Writer's fix to `drills/m6.yaml` mv-d-sph-ball** (tolerance 0.005 for a 2-decimal prompt): correct.
- **Glossary**: no term or alias duplicates an entry in any other glossary*.yaml. "Torus" otherwise appears only inside the mv-h1 Euler characteristic definition.

## Overlap

- `16h2-derivative-matrix` (mv-m3) already presents the chain rule as a product of derivative matrices. 28h2's "Building Jacobians from pieces" reuses that idea, applied to determinants and volume. It is complementary, not a repeat.
- No other overlap with the other NOTES2 files.

## Left uncertain

- Guldin "rediscovered in the 1600s": his *Centrobaryca* appeared in 1635–1641. That is fine as stated, but Kepler had used related ideas earlier.
- The lesson's sentence "once n > 2π the factor 2π/n is less than 1" explains why each parity chain decreases from n = 7 on. It doesn't explain V₆ < V₅, though nothing it says is false.
