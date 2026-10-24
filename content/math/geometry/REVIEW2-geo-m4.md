# Round 2 review: geo-m4 (Triangles and congruence), assignment 54

Reviewed: honors lessons 14h1 (Long Side SSA) and 14h2 (shortest paths); the round 2 additions to
core lessons 10–14; `questions/r2-geo-m4.yaml` (51 questions); `drills/r2-geo-m4.yaml` (5);
`glossary-r2-geo-m4.yaml` (6); `cards-r2-geo-m4.yaml` (20); 12 `images/geo-m4-*.svg`.
`content/math/check-module.sh geometry geo-m4` after the fixes: OK, zero problems (7 lessons,
106 questions, 13 drills, 36 cards).

## Changes

| Where | Problem | Fix |
|---|---|---|
| geo-m4-r2-q03 (match, angle classes) | Answers may repeat in a match question, and a 60-60-60 triangle is also correctly called **acute**, so a learner who chose "Acute" for it was marked wrong for a true answer. | The stem now asks for the *most specific* classification and says an equiangular triangle is also acute. Pairs unchanged. |
| geo-m4-r2-q01 (label) + `images/geo-m4-exterior-angle-blank.svg` | Marker 2 (adjacent interior angle) sat on the boundary between the small interior arc at C and the exterior angle, half on side CB, so it was unclear which angle it marked. | Interior arc at C enlarged (radius 45 → 58); marker 2 moved from (61.7, 79.9) to (60.0, 78.4), now clearly inside the interior angle. Re-rendered with markers. |
| `images/geo-m4-ssa-cases.svg`, panel 4 (a ≥ b) | The circle (r = 180) was far too big for its panel: only two fragments were visible, the crossing behind A was at the clip edge, and the dashed arc ran through the "A" label. The case being shown could not be seen. | Panel 4 redrawn at its own scale (b = 110, a = 125, same 36° angle; A moved right). The whole circle near the ray now shows, the crossing behind A has an open dot on a dotted extension of the line, and the A label is clear. The lesson's alt text now mentions the open dot. |
| 14h1, proof figure (shape block) | The labels X and Y sat on top of the point dots. | Labels moved down (y −0.5 → −0.8; A −0.45 → −0.7). Re-rendered. |
| 14h2, Example 2, Step 4 | "$\sqrt{45} + \sqrt{72} \approx 6.71 + 8.49 = 15.20$": the true sum is 15.193… (15.19), so the result was a rounding of rounded values. | Now "$\approx 6.708 + 8.485 \approx 15.19$". |
| 14h2, Common mistakes | "halfway between the two hikers' positions" (the example has one hiker plus a camp). | "the point of the river halfway between the start and the camp". |
| glossary: superposition | "Modern axiom systems avoid it by taking SAS as an axiom" was too general (some modern treatments make superposition rigorous with rigid motions instead). | "Many modern axiom systems (Hilbert's, for example)…", which matches the lesson. |

## Checked and found right (in case a reader doubts these)

- **Every question answered independently before reading the key** (q01–q25, h01–h26). Notable checks: q22 (6…20, 15 values); q24 (∠B 45 < ∠C 65 < ∠A 70 → AC, AB, BC); h09 (√(10²−8²) = 6 → 9 and 21; AC = 17 > 10); h11 (d = 9·sin 30° = 4.5 < 5 < 9, two triangles); h14 (4 < s < 26); h17 (P = (3, 0)); h23 (lower bound max(8, 16) = 16; the true upper bound is 20, and the explanation correctly calls 24 an upper bound); h24 (26). Each select-all has every listed answer right and every other choice clearly wrong. Each order question has one possible order.
- **SSA case table and "why the second crossing stays on the ray"** in 14h1: checked by brute-force circle–ray intersection for every (b, d, a) the drill can generate. Zero mismatches with the formula `if(a<d,0,if(a==d,1,if(a<b,2,1)))`.
- **Long Side SSA proof**: sound (X lies strictly between A and Y, so ∠AXC is the supplement of an acute base angle; AC > CX = BC ≥ AC is a contradiction). The theorem and the name "SsA" match Wikipedia, *Congruence (geometry)*, which says SSA proves congruence when the side opposite the angle is ≥ the adjacent side ("long side-short side-angle"). The lesson correctly says the name "Long Side SSA" is this course's own.
- **Supplementary angles in the ambiguous case**, Example 4 (atan(6/4.5) = 53.13°, 126.87°), and Example 2 (7 sin 40° = 4.4995 ≈ 4.5 < 5) all recomputed.
- **History**: Euclid I.4 (SAS, by superposition), I.8 (SSS), I.26 (ASA and AAS), I.20 (triangle inequality), I.21 (inside point), about 300 BCE; no HL proposition; Hilbert, *Grundlagen der Geometrie* (1899), congruence axiom III.5, a form of SAS; Heron of Alexandria (1st c. CE), with the reflection argument correctly hedged as "is credited with" (the authorship of the *Catoptrica* is questioned).
- **Euclid I.20 proof is not circular**: Lesson 14 proves the Side–Angle Inequality from isosceles triangles and the Exterior Angle Inequality, as 14h2 claims.
- **Figures**: I.20 (BD = BC = 3.61), I.21 (E = (5.82, 2.18) lies on AC), Lesson 10 Example 4 exterior angles (extensions collinear, labels inside the right angles), kite ticks, Heron SVG (A′, P, B collinear: slopes −0.710 and −0.712), hinge SVG (√(34 − 30 cos 40°) = 3.32, √(34 − 30 cos 100°) = 6.26), congruence-test pictures (AAS side truly non-included; HL marks hypotenuse and leg), side–angle SVG (measured angles 34.8°, 85°, 60°). All label-question markers sit on their parts (q11, q16, q21, h07, h18).
- **Mermaid** (lessons 10, 12, 13, 14, 14h1): all render, read well, are correct, and have accTitle/accDescr covering the whole chart.
- **Drills**: isos-ext (2·base exterior angle at the apex, base 15–80 gives a valid vertex angle); ssa-count (brute force above); ssa-two (k < p keeps both B on the ray, and a < b always holds); quad-side (r > p + q makes L positive); heron (x of P and minimum length checked against numerical minimization for every allowed input; tolerance 0.01 ≥ half of the last place for "2 decimal places"). No placeholder collisions inside TeX braces.
- **Glossary/cards**: no duplicate terms or aliases in any geometry glossary file ("Heron's formula" exists, which is a different term). Card facts checked (quadrilateral fourth side; diagonals between half the perimeter and the perimeter; inside point bounds).

## Overlap (not changed)

- 14h1's SSA counting (a < d, a = d, d < a < b, a ≥ b) repeats the count in Lesson 25 (geo-m6), which now also has a round 2 Mermaid chart for counting SSA triangles. 14h1 does it synthetically and goes on to the congruence theorem. The writer noted this, and it is a reasonable complement, not a duplicate.
- 14h2's reflection idea appears briefly in geo-m8's 34h3 (mirroring a pen in a wall), for a different problem. No geo-m9 lesson does Heron's problem.

## Left uncertain

- In `geo-m4-ssa-cases.svg` panels 2 and 3, the tops of the dashed circles are still clipped by the panel bounds (by design). The crossings that matter are all visible, so I left them.
- The isosceles label question's marker 4 (base angle at A) overlaps the vertex a little but is clearly on the angle.

## Counts

Answer-key errors 1 (q03 ambiguous match), factual fixes 2 (Example 2 rounding, superposition glossary overstatement), picture fixes 3 (exterior-angle blank + marker, ssa-cases panel 4, 14h1 shape labels), other fixes 1 (common-mistake wording).

Sources: Euclid, *Elements* Book I (Props. 4, 8, 20, 21, 26); D. Hilbert, *Grundlagen der Geometrie* (1899); Wikipedia, "Congruence (geometry)" (https://en.wikipedia.org/wiki/Congruence_(geometry)), SSA section; all numbers recomputed in Python.
