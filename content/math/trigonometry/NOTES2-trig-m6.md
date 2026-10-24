# Module 6 round 2 (trig-m6, Identities and equations): writer notes

## Added
- **Honors lessons (3)**, all `honors: true`, `module: trig-m6`, refs `trig-ref-identities`:
  - `27h1-tangent-half-angle-substitution.md` (trig-m6-h-tan-half, "The tangent half-angle substitution", 45 min, ~1,800 words with math): t = tan(x/2) formulas and derivation, where it fails (x = π), the line through (−1, 0) picture with the inscribed-angle and product-of-roots derivations, rational parametrization, Pythagorean triples (q² − p², 2pq, q² + p²), solving a sin x + b cos x = c as (b + c)t² − 2at + (c − b) = 0 with the c² ≤ a² + b² condition, the lost x = π root, dx = 2dt/(1 + t²), and a hedged note on the "Weierstrass" name. 5 worked examples. Drills trig-m6-r2-tan-half-values, trig-m6-r2-triple, trig-m6-r2-asinbcos.
  - `27h2-multiple-angles-chebyshev.md` (trig-m6-h-multiple-angles, "Multiple angles, Chebyshev polynomials and cubics", 45 min, ~1,500 words with math): recursion cos(n+1)x = 2cos x cos nx − cos(n−1)x, Chebyshev polynomials T0–T5 and their properties, sin 3x, sin 18° and cos 36° from 5·18° = 90°, Viète's trigonometric solution of 4c³ − 3c = k, why 60° cannot be trisected (Wantzel's theorem stated without proof), the telescoping sum of sines and cosines. 4 worked examples. Drills trig-m6-r2-chebyshev, trig-m6-r2-sine-sum.
  - `27h3-ptolemy-chords.md` (trig-m6-h-ptolemy, "Ptolemy's chords: the identities before sine", 45 min, ~1,550 words with math): crd θ = 2R sin(θ/2), radius 60 and sexagesimal, Ptolemy's theorem with full similar-triangle proof, the sine sum formula from a cyclic quadrilateral with a diameter, the chord form of the difference formula, how the table was built, and the inequality that traps crd 1°. 4 worked examples. Drills trig-m6-r2-chord, trig-m6-r2-ptolemy. History of the word "sine" is left to the Module 3 honors lesson (12h1), which already tells it; this lesson only points there.
- **Core lessons improved** (additions only, each introduced by a sentence or two):
  - L21: picture of the three similar right triangles behind the three Pythagorean identities; Mermaid "one value and the quadrant → all six values".
  - L22: Mermaid checklist for verifying an identity; plot of sin x + cos x against y = 1 (agrees only at isolated points).
  - L23: rectangle picture proof of the sum formulas (labeled lengths); Mermaid map of how every identity in the module comes from cos(α − β).
  - L24: isosceles-triangle area picture of sin 2θ = 2 sin θ cos θ; Mermaid "which form of cos 2x".
  - L25: unit-circle picture of tan(θ/2) = sin θ/(1 + cos θ); Mermaid for choosing the half-angle sign.
  - L26: plot showing sin 5x cos 3x and ½(sin 8x + sin 2x) are the same graph; Mermaid of the derivation of product-to-sum and sum-to-product.
  - L27: Mermaid of the general solving plan; plot of sin x + cos x against y = ±1 explaining the extraneous roots of Example 4.
- **Questions**: `questions/r2-trig-m6.yaml`, 77 in all.
  - Core: 35, trig-m6-r2-q01 – q35 (5 per lesson): text 8, match 7, order 7, select-all 7, label 3 (q01, q11, q21), four-choice 3 (q10, q20 with picture, q35). module_quiz: q01, q05, q06, q11, q15, q16, q19, q21, q26, q31 (1–2 per lesson).
  - Honors: 42, trig-m6-r2-h01 – h42 (14 per lesson): four-choice 23 (correct positions 0×6, 1×6, 2×5, 3×6), text 8, match 3, order 3, select-all 3, label 2 (h06, h35). 19 of 42 are new types.
- **Pictures** (8 SVGs + 5 blanks, all original, each under 4 KB): trig-m6-three-triangles(+blank), trig-m6-sum-rectangle(+blank), trig-m6-double-isosceles, trig-m6-half-angle-circle(+blank), trig-m6-h-tan-half-line(+blank), trig-m6-h-chord, trig-m6-h-ptolemy-quad, trig-m6-h-ptolemy-sum(+blank). Blanks back the label questions q01, q11, q21, h06, h35. All rendered with preview-figure.mjs and checked, the blanks with their markers.
- **Mermaid diagrams (10)**: one in each core lesson (L21–L27) and one in each honors lesson (solving a sin x + b cos x = c; building the Chebyshev polynomials; building Ptolemy's table). All `flowchart TD` with accTitle/accDescr, previewed.
- **Plots (4)**: L22, L26, L27, and the Chebyshev graphs in 27h2.
- **Drills (7)** in `drills/r2-trig-m6.yaml`: trig-m6-r2-tan-half-values, -triple, -asinbcos, -chebyshev, -sine-sum, -chord, -ptolemy. Each generated 300 times and checked against an independent Python calculation (asinbcos roots found by brute-force sign changes, Ptolemy diagonals compared with the exact chord of the arcs). Rounded answers are accepted: tolerance 0.0001 for 4 places, 0.001 for 3, 0.01–0.02 for 2. Exact answers display as fractions.
- **Glossary**: `glossary-r2-trig-m6.yaml`, 9 terms (tangent half-angle substitution, rational parametrization, Chebyshev polynomials, trigonometric solution of the cubic, telescoping sum, crd, sexagesimal, cyclic quadrilateral, Ptolemy's theorem). Checked against every glossary*.yaml in the course: no duplicate terms or aliases. ("Pythagorean triple" and "chord", also bolded, already exist.)
- **Cards**: `cards-r2-trig-m6.yaml`, 27 (9 per honors lesson).
- `content/math/check-module.sh trigonometry trig-m6`: build and checker OK, zero problems.

## For the reviewer
- History, all hedged in the text: the method behind the "Weierstrass substitution" appears in Euler's integral calculus (1768) and Legendre's general description (early 1800s); no clear source ties it to Weierstrass. Ptolemy: Almagest, second century CE, radius 60, arcs ½° to 180° in ½° steps; an earlier lost table "usually credited" to Hipparchus. crd 1° = 1;2,50, bounded with the chords of ¾° and 1½° (as in Heath's account). Chebyshev 1821–1894, studied the polynomials in the 1850s. Viète's trigonometric cubic "around 1600". Wantzel 1837. Euclid's triple recipe "appears in the Elements". Worth a spot check.
- The sexagesimal values in 27h3 (103;55,23 for crd 120°, 37;4,55 for crd 36°, 12;32,36 for crd 12°) are my own conversions of the exact values, not quoted from the Almagest; only 1;2,50 is presented as Ptolemy's value.
- 27h2 states Wantzel's theorem without proof, says some angles can be trisected, and notes that marked-ruler or paper-folding methods can trisect 60°.
- 27h3 Example 2 and h34 use a genuine cyclic quadrilateral (sides 4, 8, 6, 4 with AC = 8, BD = 7, and the same shape scaled 1.5×), checked with the cyclic-quadrilateral diagonal formula.
- q30 (beats) assumes beat frequency = difference of the two frequencies, as in Lesson 26.
- 27h1 bolds "Pythagorean triple", which already has a glossary entry from Lesson 5, so no new entry was added.
- Core-lesson additions are introduced in a sentence or two; the L23 rectangle proof and the L24 and L25 pictures each add a short paragraph that explains the picture.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard identities and proofs (Ptolemy's theorem, the rectangle proof of the sum formula, the Chebyshev recursion, Viète's cubic). History checked against Wikipedia's "Tangent half-angle substitution" and "Ptolemy's table of chords" articles and T. L. Heath, *A History of Greek Mathematics* vol. 2 (From Aristarchus to Diophantus), on Ptolemy's bounds for crd 1°. Every number in the lessons, questions and drills was recomputed in Python (sympy for the identities). All writing and drawings are original.
