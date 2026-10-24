# Round 2 review: trig-m6 (Identities and equations)

Reviewer for item 129. I worked every new question before reading its key, recomputed the lesson numbers in Python, rendered every new SVG (and each blank with its label markers), every new plot (preview-plots.mjs) and all 10 Mermaid diagrams, and checked the drills against independent Python. `content/math/check-module.sh trigonometry trig-m6` reports zero problems after the fixes below.

## Changes

### Answer key
- **trig-m6-r2-h40**: the distractor "crd 1° < 3/2 · crd 1½°" is a *true* upper bound on crd 1° (crd 1° < crd 1½°), so a student could defend it as correct. I replaced it with "crd 1° < 1/3 · crd 3°", which is false (crd 3°/3 ≈ 1.04693 < crd 1° ≈ 1.04718) and models the same real mistake: reading a lower bound as an upper one. I also extended the explanation to cover this choice and the "3/4 crd ¾°" choice.

### Facts
- **27h1, "Solving a sin x + b cos x = c"**: the lesson said "Lesson 23 solved this equation by writing the left side as R sin(x + φ)". Lesson 23 only rewrites a sin x + b cos x as a single sinusoid (its Example 6). It never solves the equation. Reworded to say Lesson 23 showed how to write the left side as R sin(x + φ), which turns the equation into sin(x + φ) = c/R.
- **27h3, "The one step that is not exact"**: the chord-ratio inequality crd α / crd β < α/β is older than Ptolemy and is usually called Aristarchus's inequality. The lesson read as if it were Ptolemy's own, so I added that it was known before him and is now often called Aristarchus's inequality. Source: Wikipedia, "Ptolemy's table of chords" (Aristarchus's inequality section).
- **cards-r2-trig-m6.yaml**: the card "Ptolemy's inequality for chords" clashes with the standard name "Ptolemy's inequality", which is the *quadrilateral* inequality AC·BD ≤ AB·CD + AD·BC. Renamed the front to "The chord-ratio inequality Ptolemy used (Aristarchus's inequality)".
- **27h3, "Chords and sines"**: "astronomers in India tabulated the half-chord R sin(θ/2)" was ambiguous: the Indian tables were indexed by the half-angle, so the entries were R sin θ. Reworded to "the half-chord instead (half the chord of twice the angle, R sin θ)". This now matches Lesson 12h1.
- **27h2, "Cubics solved with cosines"**: the lesson said 4c³ − 3c = k always gives "three real roots". Added that two of them are equal when k = ±1. For example, k = 1 gives cos 0°, cos 120°, cos 240° = 1, −½, −½.

### Pictures and plots
- **trig-m6-h-tan-half-line.svg**: the "(cos x, sin x)" label sat on the line of slope t. Moved it below and to the right of the point. The blank version and the h06 markers are unaffected.
- **L22 plot (sin x + cos x against y = 1)**: the two automatic curve labels overlapped each other and the dashed line. I replaced them with placed labels. I also added the third crossing at x = 2π, which is in the plotted window but was unmarked, and changed the caption to "0, π/2 and 2π".
- **L26 plot (sin 5x cos 3x vs ½(sin 8x + sin 2x))**: the two curves are identical, so both labels landed on top of each other as unreadable text. Removed the labels and changed the caption to say which curve is solid and which is dashed.
- **L27 plot (extraneous roots)**: the curve labels overlapped each other and the lines, and the "0" and "3π/2" point labels touched the curve. Replaced them with placed labels clear of all lines.
- **27h2 Chebyshev plot**: all three labels (T₂, T₃, T₄) piled up at the top right corner. Replaced them with labels at each curve's own extremum, and the caption now notes that T₃ is dashed.

### Other
- **L23**: the sentence introducing the rectangle proof said "its top is cos(α + β)", but the whole top side is cos α cos β. Only the piece TP is cos(α + β). Changed it to "the top piece TP is cos(α + β), the bottom OR minus the short piece SP".

## Checked and found right (a reader might doubt these)
- 27h1: the Example 4 numbers (t = (3 ± √21)/6, x ≈ 1.8028 and 5.7674, which agree with the R sin(x + φ) method); the discriminant 4(a² + b² − c²); that x = π is a root exactly when b + c = 0.
- History in 27h1, checked against Wikipedia, "Tangent half-angle substitution": Euler used the substitution in his 1768 integral calculus, Legendre described the general method in 1817 ("early 1800s" is fine), the Weierstrass attribution has no documented source, and Russian texts call it the "universal trigonometric substitution". The Euclid triple recipe is in Elements X (lemma to Prop. 29).
- 27h2: T₀ to T₆ (T₆ = 32c⁶ − 48c⁴ + 18c² − 1); sin 18° and cos 36°; the roots of 8c³ − 6c − 1 and their sum of 0; the rational-root candidates; the telescoping sine sum, the cosine sum and the Example 4 result (cot 15° = 2 + √3); Wantzel 1837; Chebyshev 1821–1894; Viète "around 1600" (published posthumously in 1615).
- 27h3: crd 60°, 120°, 36° and 12° and their sexagesimal forms (103;55,23, 37;4,55, 12;32,36, and 84;51,10 = 60√2). Example 3 gives 12.5434. In Example 4, the bounds 1.047168 and 1.047190 and the modern value 1.047184 all round to 1;2,50. The table runs from ½° to 180° in ½° steps (360 entries). The chord form of the difference formula reduces correctly to the sine difference formula. Example 2 and h34 use a genuinely cyclic quadrilateral: cos B = ¼ and cos D = −¼, so the opposite angles sum to 180°.
- SVG geometry, checked from the coordinates: the three triangles are similar (each about 35°). In the tan-half line, the central angle is 70° and the inscribed angle 35°, with (0, t) at t = tan 35°. In the Ptolemy quad, ∠ABE = ∠DBC (62.5°), E lies on AC and all four points are on the circle. In the Ptolemy sum figure, the angles at B and D are right angles. Every label-question marker sits on the part its label names (q01, q11, q21, h06, h35).
- All 77 questions: each has one defensible answer, the accept lists are complete, and the order questions have no swappable steps. For q15, choosing the sum formula depends on the 60° + 45° split, so its order holds.
- Drills: for trig-m6-r2-asinbcos, I enumerated all 248 valid parameter sets and compared them with brute-force root finding; all matched. The other six drills' formulas were checked by hand. The tolerances accept every correctly rounded answer (0.0001 for 4 places, 0.001 for 3, 0.01 and 0.02 for 2), and fractions are exact.
- Glossary: 9 terms, none duplicating any term or alias in the course's glossary*.yaml files.
- Mermaid: all 10 diagrams render and are readable, and each accTitle/accDescr describes the whole diagram.

## Overlap
- 27h2's derivation of sin 18° and cos 36° covers the same values as 08h1 (Module 2 honors, golden triangle). The lesson says so and uses a different method. Acceptable.
- 27h3's radius-60 and sexagesimal material overlaps the short Ptolemy example in 12h1 (Module 3 honors, crd 90° = 84;51,10). 27h3 leaves the history of the word "sine" to 12h1. Acceptable.
- 39h3 (roots of unity) refers back to this module's Chebyshev polynomials and Wantzel's theorem, and it is consistent with them.

## Left uncertain
- Hipparchus's lost table being "usually credited" to him is properly hedged. Wikipedia describes that table as having 7½° steps; the lesson doesn't give a step size, so nothing conflicts.

Sources: Wikipedia, "Tangent half-angle substitution" and "Ptolemy's table of chords"; T. L. Heath, *A History of Greek Mathematics*, vol. 2 (Ptolemy's bounds for crd 1°); Euclid, *Elements* X.29 lemma 1.
