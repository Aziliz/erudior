# Round 2 review: mv-m8 (Surface integrals and the big theorems)

Reviewer for item 79. `content/math/check-module.sh multivariable mv-m8` after fixes: build and checker OK, zero problems.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| `lessons/38h2-green-identities.md`, "Boundary-value problems and uniqueness" | Said hydraulic head in steady groundwater flow satisfies Poisson/Laplace without the assumption it needs (the writer flagged it as a simplification, but the lesson did not say so). | Added "(in a uniform aquifer, a simplifying assumption)". Factual/labeling fix. |
| `lessons/35-surface-integrals.md`, "Choosing a method" Mermaid | Scalar branch said "Multiply f by the length of r_u × r_v", which leaves out the integration over D. | Box and accDescr now say "Integrate f times the length of r_u × r_v over D (graph: ...)". Other fix. |
| `images/mv-m8-paddle-wheel.svg` | The "spin" label touched the arrowhead of the back flow arrow. | Moved the label up 7 px. Picture fix. |
| `images/mv-m8-param-patch.svg` | The "r_u" label sat on a green grid curve, and "r_v" touched a blue grid curve. | Moved both labels into clear space between the grid curves. Picture fix. |
| `questions/r2-mv-m8.yaml`, `mv-m8-r2-q24` | Accept list was missing a common wording. | Added "a half" (1/2, 0.5, "half", "one half" were already accepted). Other fix. |

## Checked and found right
- All 53 questions worked independently before looking at the keys. Every key is correct, every select-all set is complete and the other choices are clearly wrong, the order questions (q10, q16, q25, h10, h26) have only one valid order, and the match/label pairings are unambiguous. These include h06 (104 = 96 + 8), h03 (−π/2), h13 (−π/3), h20 (64π), h22 (c = 2), h24 (4/3), and h27 (x² + y² − 2z² and xyz are harmonic).
- 38h1: Example 1 (128π/3 both ways), Example 2 (2π three ways, including the direct line integral −π + 3π), Example 3 ((x₀ + h/2)³ − (x₀ − h/2)³ = 3x₀²h + h³/4). I also checked the chain-rule expansion in the Stokes-for-a-graph proof and that it matches curl F · ⟨−g_x, −g_y, 1⟩. All verified in sympy.
- 38h2: the product-rule table (including div(F × G) = G·curl F − F·curl G and curl curl F = ∇(div F) − ∇²F), Examples 1–4 (6xyz; div(x/r³) = 0; 4π/3 on the unit ball; c = −2/3 and T = −r²/3), the uniqueness proof, the Neumann compatibility condition, and the max-principle remark (true as stated).
- History (38h1, h08, cards). Lagrange 1762, Gauss 1813 and Ostrogradsky's general proof in 1826 match Wikipedia's "Divergence theorem" history. On Stokes' theorem: Thomson's letter to Stokes of 2 July 1850, and Stokes setting it on the February 1854 Smith's Prize exam (its first appearance in print), match V. J. Katz, "The History of Stokes' Theorem", *Mathematics Magazine* 52 (1979).
- Drills: all 6 formulas verified symbolically in sympy against direct integration (cylinder faces and volume, line integral around the tilted plane, cube flux, sphere flux of ∇u, and ∮u ∂u/∂n for linear u). The smallest possible answers keep relTolerance at or above half a unit in the second decimal place. No placeholder collisions: `\tfrac{{s}}{2}` correctly renders s/2.
- Pictures: rendered all 5 SVGs and the 4 label blanks with their markers. Swirl and B-field directions are counterclockwise seen from above and consistent with the right-hand rule. r_u and r_v are drawn tangent to their grid curves (slopes checked against the polylines). Every marker sits on its named part. The q14 "flat disk" marker lies inside the dome outline, as the stem explains.
- Mermaid: rendered all 8 diagrams. Content is correct and the accDescr lines describe the whole diagram. No new ```plot blocks were added in round 2 (I compared plot counts against the round 1 build), so there were none to render.
- Core lessons: compared them with the round 1 build. Only additions were made; nothing was removed or rewritten.
- Glossary (9) and cards (20) are correct.

## Uncertain / for others
- `glossary-r2-mv-m3.yaml` (not my file) defines **mean value property** for circles only. 38h2 bolds the term and uses the sphere version, so the pop-up shows the 2D statement. Suggest that the mv-m3 owner add "(in 3D, spheres)". Their **Laplace's equation** entry already mentions 3D.
- Overlap: the mean value property and the "no interior maximum" consequence also appear in 16h3 (mv-m3, stated) and in 92 (mv-h1, proved). The curl-of-curl identity in 38h2's table is proved in 91 (mv-h1). In each case 38h2 only states the result briefly, and mv-h1's notes say they built on 38h2, so I made no change.
- `images/mv-m8-z-simple-blank.svg` is not used by any question (the writer kept it on purpose). It is harmless.
