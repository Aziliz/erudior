# REVIEW2-geo-h1: Honors module geo-h1, Constructions and classic theorems

Reviewer pass on round 2 item 61 (lessons 90–93, `questions/r2-geo-h1.yaml`, `drills/r2-geo-h1.yaml`,
`glossary-r2-geo-h1.yaml`, `cards-r2-geo-h1.yaml`, `images/geo-h1-*`). After the fixes,
`content/math/check-module.sh geometry geo-h1` reports zero problems.

## Changes

| Where | Problem | Fix |
|---|---|---|
| Drill `geo-h1-r2-ceva-third` | No triangle-inequality check. About 37% of generated instances described a triangle that can't exist (e.g. AF = FB = 2, BD = 2, DC = 3, CA = 10: sides 4, 5, 10). | Added `where` conditions `ca < af+fb+bd+dc`, `af+fb < bd+dc+ca`, `bd+dc < af+fb+ca` (3,266 valid combinations remain). |
| Drill `geo-h1-r2-menelaus` | Same problem: about 40% of instances were impossible triangles (e.g. AB = 4, BC = 4, AC = 8). | Added `ac < af+fb+bc`, `af+fb < bc+ac`, `bc < af+fb+ac`. |
| Lesson 92, "The medial triangle" | "Like any rotation or dilation, $T$ sends every line to a parallel line" is false for rotations in general (only a half-turn does this). | Now: "A half-turn and a dilation each send every line to a parallel line (a rotation by any other angle would not), so $T$ does too; it also keeps angles and halves every length." |
| Lesson 93, Mermaid "is it cyclic?" chart | The equal-angle and equal-product tests had only "yes" and "not known" branches, so a known "no" led nowhere. | Added "no → Not cyclic" edges to both tests and updated `accDescr` to describe them. Re-rendered and checked. |
| Lesson 90, product-construction ```shape | Auto-placed point labels U and B sat on segment UA and on the dashed parallel, and A sat on ray OP. | Points left unlabeled; O, U, B, A placed as `labels` at clear positions (O left of the vertex, U and B under the base line next to "1" and "b − 1", A above the ray). Re-rendered: nothing touches. |
| Question h58 (order) | Steps 1 ("note it is cyclic") and 2 ("pair the opposite sides") could reasonably be done in either order. | Rewritten as four strictly dependent steps: note cyclic so Ptolemy applies → write the relation (bases and legs as opposite-side pairs) → substitute → take the positive root. Explanation updated. |

Counts: answer-key errors 0; factual fixes 1 (rotation statement); picture fixes 1 (shape-figure labels); other fixes 4 (two drill `where` conditions, Mermaid branches, h58 order).

## Checked and found right (things a reader might doubt)

- All 58 questions worked independently before looking at the keys. All keys are correct, and every distractor explanation matches the mistake it names (h16 4/9 vs 9/4; h19 14/5 from $BD = 8$; h31 $2G - O$, $3G - O$; h45 64/7 from pairing adjacent sides; h47 √117 and √52; h51 √1400, 26, 72).
- h45: the cyclic quadrilateral with sides 3, 5, 7, 7 really has diagonals $AC = 7$, $BD = 8$ (from the cyclic diagonal formulas: $AC^2 = \frac{(ac+bd)(ad+bc)}{ab+cd} = 49$).
- h09 / lesson 90: "a whole number of degrees is constructible exactly when it is a multiple of 3°" holds: 3° = 18° − 15°, and 1° would give 20°.
- h27: ratio products 8 and 1/8 are not 1, so those cevians are not concurrent.
- h56: rhombus side 1, 60°: diagonals 1 and √3, product 1.73 < 2; a 3–5 parallelogram with a 60° angle is not cyclic.
- Lesson 90: product/quotient constructions (shape coordinates checked: P = (7.5, 3.75), OP/OA = OB/OU = 2.5); √a construction; $8c^3 - 6c - 1 = 0$ has root cos 20° = 0.9397 (sympy) and no rational root; cos 72° = (√5 − 1)/4 (sympy); 15-gon angle 144° − 120° = 24°; Gauss–Wantzel examples 9, 10, 15, 18, 20.
- Lesson 91: Ceva area proof and converse; the bisector and altitude products ($AF = b\cos A$, $FB = a\cos B$, etc.) cancel; Example 1 (CE = 12, EA = 6), Example 3 (CE = 4, EA = 8), Example 4 (Menelaus in triangle ADC gives AG/GD = 2).
- Lesson 92: Example 1 (O = (3, 1), G = (8/3, 4/3), H = (2, 2), OG = √2/3, GH = 2√2/3); Example 2 nine-point checks; right-triangle Example 3 (five distinct points); $OG : GN : NH = 2 : 1 : 3$. Lesson 37 does mention negative scale factors, so the cross-reference in lesson 92 is right.
- Lesson 93: Ptolemy proof (two AA similarities); Examples 1–4 (√97 checked by coordinates; pentagon diagonal φ; PA = 8, side 7 via cos 120°); Brahmagupta check on the 5-6-5-12 trapezoid = 36; Brahmagupta overestimates for non-cyclic quadrilaterals (Bretschneider's formula subtracts $abcd\cos^2\frac{A+C}{2}$).
- Cross-references to Lessons 4, 15, 16, 21, 23, 24, 26, 28, 29, 30, 31, 37 and to honors lessons 19h1, 26h3, 30h2 point to content that is really there.
- Pictures: all five SVGs and three blanks rendered and checked numerically. Ceva cevians meet at (325.6, 210.0) to within 0.01 px; Menelaus points F, E, D are on the transversal (within 0.03 px) and the dashed feet are perpendicular; Euler figure drawn from A(0,0), B(12,0), C(1,9): O, G, N, H and all nine points match the computed pixel positions, all nine within 0.1 px of radius R/2; Ptolemy ∠ABK = 35.01°, ∠DBC = 35.00°, K on AC, all four vertices on the circle. Label markers for h14, h29, h44 sit on the named parts (h44's markers 2 and 3 are close but don't overlap).
- Drills: 1,500 instances each, generated with the app's engine and recomputed independently in Python from the prompt text. All answers match; 2-decimal answers are accepted (tolerance 0.006); `sqrt(n)` input is accepted where the prompt offers it; answers 0.02 off are rejected for the irrational-answer drills; no "+ -", "- -", "1x", thousands commas or unfilled placeholders. Trapezoid and Brahmagupta drills always describe figures that exist.
- Glossary: no term or alias duplicates any `glossary*.yaml` in the course. Cards checked (constructible n-gons up to 20: 3, 4, 5, 6, 8, 10, 12, 15, 16, 17, 20).
- History: Wantzel 1837; Lindemann 1882; Gauss's 17-gon 1796 (aged 18); Ceva 1678; Menelaus about 100 CE; Euler 1765; Brianchon and Poncelet 1820–21; Feuerbach 1822; *Almagest* about 150 CE; Brahmagupta 628 CE. These agree with the MacTutor History of Mathematics biographies and with Courant and Robbins, *What Is Mathematics?* ch. III, and Coxeter and Greitzer, *Geometry Revisited* ch. 1–2.

## Overlap

- Lesson 92 Example 1 uses the same triangle, A(0,0), B(6,0), C(2,4), as the Module 5 honors lesson 19h1, *Proving the triangle centers exist*. It finds O and G again, as 19h1 already does, although it then checks $H = 3G - 2O$ and the distances. That repeats some work but is not wrong. A different triangle would make the example more useful. Left as is.
- Lesson 91 Example 4 (centroid 2 : 1) and lesson 92's Euler line proof repeat results proved in 19h1, but by different methods, and the lessons say so. Lesson 93's recap of the concyclic tests cites 30h2 and doesn't repeat its proofs. The φ material cites 26h3. No other overlap found.

## Left uncertain

- The Ptolemy proof's Step 3 ("add ∠KBD to both angles") takes ray BK to lie between BA and BD. If ∠DBC > ∠ABD, you subtract instead and get the same result. Most textbooks skip this case too, so I left it.
- Lesson 92's remark "(In a right or obtuse triangle the parallelogram in Step 2 can flatten …)" is loosely worded. In an obtuse triangle the proof works unchanged, and only the right-triangle case is degenerate. It says "can", so it isn't false. Left as is.
