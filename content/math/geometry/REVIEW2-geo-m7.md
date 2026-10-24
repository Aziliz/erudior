# Round 2 review: geo-m7 (Circles)

Reviewed independently: both honors lessons (30h1, 30h2), the round 2 additions to core lessons 27–30, all 48 questions in `questions/r2-geo-m7.yaml`, the 5 drills, 8 glossary entries, 21 cards and all 11 `images/geo-m7-*` SVGs. Every question was worked before reading the key. `content/math/check-module.sh geometry geo-m7` reports OK after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| geo-m7-r2-q04 (explanation) | "An arc of 2 radians has $s = 12$, about 3.82 units longer than $2\pi \approx 6.28$." The difference is 5.72 (12 − 6.28). Answer key itself was right. | Changed 3.82 to 5.72. |
| geo-m7-r2-h21 (explanation) | Said the distractor $5\sqrt3$ "uses $\cos 30^\circ$", but $10/\cos 30^\circ$ gives $2R = 11.55$, not $5\sqrt3$. The distractor is $10\cos 30^\circ$. | Now says "$5\sqrt3 = 10\cos 30^\circ$ uses the wrong trig function." |
| geo-m7-r2-q01 (stem) | Marker 3 (Diameter) sits on the left half of the horizontal diameter, which by itself is a radius, so "Radius" could be defended for it. | Stem adds: "Each number marks a whole segment, line or point, not part of one." |
| geo-m7-r2-q06 (stem) | Marker 1 (Half of the chord) is on the chord line, and "Whole chord" is a distractor, so the stem didn't make clear which segment was meant. | Stem now asks for "the numbered sides of the two right triangles", so 1 is clearly the triangle's leg MB. |
| geo-m7-r2-h10 (marker 3) | The "Line of centers" marker (68.3, 54.8) sat exactly where the line of centers crosses the right circle, so it could be read as marking the circle or that point. | Moved it to (60.5, 54.8), on the line of centers inside the right circle, clear of the circle. Re-rendered and checked. |
| geo-m7-r2-q02, h22 (`accept`) | Missing some reasonable forms. | Added `3*π` (q02) and `2√(3)`, `2*sqrt3`, `2*√3`, `sqrt12`, `3.4641` (h22). |
| 30h1, Example 3 plot | The point labels "(4, 3)" and "(4, −3)" sat on the second circle and the dashed axis. The "x" axis label crowded the second circle, whose right edge is at x = 9.61 with the axis ending at 10. | Point labels moved to free `labels` at (5.8, 4.4) and (5.8, −4.7), clear of both circles. x range widened to [−6, 11]. Re-rendered and checked. |

Counts: answer-key errors 0; factual fixes 2 (two wrong statements in explanations, q04 and h21); picture fixes 2 (h10 marker, 30h1 plot labels); other fixes 3 (q01 and q06 stems, accept lists).

## Checked and found right (a reader might doubt)

- **Power formulas and examples (30h1).** All recomputed in Python: Example 1 (power −64, chord 17.8, shortest chord 16); Example 2 (144 and −17, and the check by completing the square); Example 3 (axis x = 4, chord from (4, ±3), power 33.25, tangent ≈ 5.77); Example 4 (radical center (4.5, 4.5), power 31.5, tangent ≈ 5.61).
- **Radical-axis proof.** $(D_1 - D_2, E_1 - E_2)$ is twice the vector between the centers, so the line is perpendicular to the line of centers. For non-intersecting, non-nested circles the axis does lie between them. The orthogonal-circle remark in Example 4 is right: a radius drawn to a crossing point is tangent to the other circle.
- **Steiner and "Potenz", 1826.** Matches Wikipedia, "Power of a point" (Steiner introduced the term in 1826).
- **Test 2 proof sketch (30h2).** In the "inside" case, D′ lies on the ray AD beyond D, so it is on C's side of AB and ∠AD′B ≅ ∠ACB. The exterior-angle step is valid. The "outside" case is labeled as a sketch ("a similar argument"), as the notes say.
- **Test 1 converse and Test 3 proof.** E on arc AC away from B, with D on the same side of AC (convex), is valid. In Test 3, SAS similarity matches A↔D, E↔E, C↔B. A and D are on the same side of CB, because ACBD is a convex quadrilateral when chords AB and CD cross.
- **Cyclic-quadrilateral table.** Agrees with Lesson 19's conventions: "exactly one pair" for trapezoids, and kites exclude rhombuses. Under those conventions, "trapezoid that isn't isosceles: never" is correct.
- **Extended Law of Sines (30h2).** Proof covers acute, obtuse and right A. Example 3 gives R ≈ 9.33 and b ≈ 18.03. In Example 4 (13–14–15) K = 84 and R = 65/8, and sin = 12/15 really is the angle opposite 13. Example 5's circle (x − 2)² + (y − 3)² = 25 is right, and so are the tests of the fourth points (0 and −9).
- **SVG geometry, from the SVG coordinates.** In the secant–tangent figure, OT ⟂ PT and PT² ≈ PA·PB to 0.03%. In the radical-axis figure the axis is at x = 264.03, PT₁ = PT₂ = 149.9 and both are tangent. In the extended-sines figure BA′ is a diameter, ∠A = ∠A′ = 55.0° and ∠BCA′ = 90°. In the arcs figure ∠AOB = 64.0°. Every blank copy was rendered with its markers; apart from the h10 marker, every marker is on the part it names.
- **Mermaid charts.** All 7 rendered and readable, and each `accDescr` describes the whole chart.
- **Drills.** Recomputed independently over thousands of random instances, with 0 failures. The radical-axis drill's points lie on both circles, and so do points of equal power. In the isosceles drill, R = l²/(2h) equals abc/4K and the drawn circle passes through all three vertices. In the circle-through-3-points drill, solving the 3×3 system gives back D, E and r. For the power drill, the general form gives the same value as d² − r² and it is always positive. The circumradius drill's 0.02 tolerance on b covers a b computed from R rounded to 2 decimals (worst case about 0.015). All other tolerances are at least half the last place.
- **Glossary.** No term or alias duplicates another `glossary*.yaml`. "Power of a point" is left to the core glossary.
- **Cards.** All 21 are correct.

## Overlap

- `93-ptolemy-cyclic.md` (geo-h1) restates the three concyclic tests without proofs and links to 30h2 by name. This looks intentional (a recap), not duplication. No changes.
- No `26h*` lesson covers the Extended Law of Sines, and no other round 2 lesson covers power of a point or the radical axis.

## Left uncertain / notes

- In 30h1 the bolded "power of a point" pops up the core glossary's unsigned definition (the constant product), while the lesson defines it as signed $d^2 - r^2$. The lesson explains the relation ("Its size is the constant product"), so I left it alone. A course editor could align the core entry.
- "general form" is a generic glossary term. If a later writer defines it for lines, one entry has to go (the writer's note says the same).
