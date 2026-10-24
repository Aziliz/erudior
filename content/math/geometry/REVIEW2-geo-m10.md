# Geometry module 10 (geo-m10), round 2: review

Reviewer worked every new question (57) before reading the key, recomputed every number in Python, rendered all 13
SVGs (label markers included), both new lesson figures and all 6 Mermaid diagrams, and simulated the drills.
`content/math/check-module.sh geometry geo-m10`: OK, zero problems after the fixes.

## Changes

### Answer-key / question errors (2)
- **geo-m10-r2-h10** (order, affine to projective): "Put each new point on every line of its class" and "Add one new
  line containing all the new points" could be done in either order, so the order was not unique. Merged
  creating the points with putting them on their lines, kept "add the new line" (needs the new points), and added
  a final "Check that any two lines now meet in exactly one point". Explanation updated.
- **geo-m10-r2-h18**: "E is on ray AM with ME = AM" is also satisfied by E = A. Now "on ray AM beyond M".

### Factual fixes (4)
- **41h2 Example 2** (and drill **geo-m10-r2-defect-split**): in hyperbolic geometry a triangle is determined by its
  angles (AAA), so once ∠A, ∠B, ∠C and ∠BAD are given, ∠ADB is fixed. The example's 95° was impossible: the true
  value for A = 50°, B = 60°, C = 55°, ∠BAD = 20° is 94.03° (hyperbolic law of cosines for angles: cosh c =
  (cos C + cos A cos B)/(sin A sin B), then cos D = −cos 20° cos B + sin 20° sin B cosh c). Changed to 94° "to the
  nearest degree" with a sentence explaining why it is not free; defects are now 6° and 9° (sum 15°), and "twice the
  area" became "1.5 times". The drill chose ∠ADB at random, so most of its triangles could not exist. Rewritten:
  ∠ADB is computed with the same formula (`acosd`), and `where` keeps only rolls where it is within 0.03° of a whole
  degree, with every defect ≥ 1 (whole ≥ 4). Simulated 2,000 generations: all found valid inputs within 500 tries.
- **41h1**: the order-10 search "took years of machine time" overstated it; the Lam–Thiel–Swiercz search used
  about 2,000 hours (roughly three months) of Cray-1A time. Now "used months of supercomputer time". Source:
  Lam, "The search for a finite projective plane of order 10", Amer. Math. Monthly 98 (1991); Wikipedia, Lam's problem.
- **41h2 Example 1**: "an angle under 40°/2⁸ ≈ 0.16°" → "at most" (the lemma gives ≤, and 40/256 = 0.156).
- **41h2, defect section**: "There is no geometry where some triangles are Euclidean and others are not" was too
  broad (the sphere is a geometry); now "No model of neutral geometry has some triangles with defect 0 and others
  with positive defect."

### Picture fixes (2)
- **geo-m10-buffon.svg / -blank.svg**: the needle (length 240 px) was longer than the line spacing (170 px), while
  the lesson and question assume ℓ ≤ d. Redrawn with ℓ = d = 170 px at θ = 40°, center 40 px above the nearest
  line (still crosses); the arc, dotted (ℓ/2) sin θ segment and labels moved to match, and the x label moved off the
  needle. **geo-m10-r2-h38** markers updated to the new positions (angle, x, needle).
- **geo-m10-r2-q06**: marker 4 (great circle through the poles) sat where that circle runs 13 px from the sphere's
  outline; moved to (29.1, 39.0), where the meridian is clearly separate.

### Other fixes (2)
- **41h3 plot**: with ℓ = d the curve's label sat on the dashed rectangle top and the dashed side crossed the
  "θ (radians)" axis title. Now ℓ = 0.8, d = 1 (curve 0.4 sin θ below the rectangle top), x-range to 2.2, label
  placed inside the region; caption updated.
- **geo-m10-r2-h32** explanation: "an error of a few hundredths or more is normal" understated it; the standard
  error with N = 200, ℓ = d is about 0.17. Now "about 0.1 or more".
- **geo-m10-r2-h27**: Bolyai and Lobachevsky "published hyperbolic geometry as a consistent alternative": they did
  not prove consistency (Beltrami did, relatively, in 1868). Now "a genuine alternative geometry".

## Checked and found right
- All 15 core and 42 honors keys; every select-all set; order questions q10, q15, h21, h35 have a single order.
- Fano plane: the seven lines satisfy P1–P3 (script); A, B, C, G is a valid P3 quadruple; DEF circle is the incircle
  and crosses the medians at non-points. Example 3 parallel classes (AB∥CG, BC∥AG, CA∥BG) correct. Example 4 proof
  of the dual of P3 correct.
- Counts n² + n + 1, affine n² points / n² + n lines / n + 1 classes; Bruck–Ryser statement (n ≡ 1, 2 mod 4) and 6
  excluded; 10 = 9 + 1; 12 open; Spot It! 55 cards vs 57 (hedged).
- Legendre construction and proof (SAS on AMB/EMC; angle at C = ∠B + ∠C); Archimedean step labeled; defect
  additivity; Saccheri summit angles by SAS then SSS; Lambert halves of the 75° example (defect 15° each).
- History: Saccheri 1733 (*Euclides ab omni naevo vindicatus*, "repugnant to the nature of the straight line");
  Lambert written 1766, published 1786, area ∝ defect; Lobachevsky 1829, Bolyai 1832, Beltrami 1868; Barbier 1860;
  Bertrand 1889; Jaynes 1973 favoring method 2 (labeled as contested). Fano 1892.
- Buffon: midpoint sums 1.0065 (4) and 1.0029 (6) ("about 1.006 / 1.003"); P = 5/(4π) ≈ 0.398; π ≈ 3000/956 ≈ 3.138;
  Lazzarini 2·5·3408/(6·1808) = 355/113 = 3.1415929, binomial error ≈ 0.050. Bertrand 1/3, 1/2, 1/4 and the
  "longer than r" variant 2/3, √3/2, 3/4. Bertrand SVG: chords perpendicular to the radius / to the center–midpoint
  line as described.
- Drills proj-count, affine-count, saccheri, buffon, buffon-pi, bertrand: formulas match prompts; dp3 answers have
  tolerance 0.001 ≥ half the last place; the Bertrand solution's rounded intermediates stay within tolerance.
- Glossary: no duplicate terms or aliases across all glossary files; definitions correct. Cards correct.
- Core additions (39, 40, 41): Mermaid charts and SVGs correct and readable; sphere-lines SVG is a consistent
  projection (pole, equator, 48° latitude circle and meridian with correct hidden halves).

## Overlap
41h2's "What neutral geometry can prove" repeats in brief what geo-m3's 09h1 already teaches (neutral geometry,
I.16 → parallels exist, the sphere caveat). It is short and builds on it, so left as is; not a contradiction.

## Uncertain
- None of substance. The "summit is longer than the base" claim (41h2 common mistakes, h25) is standard
  (Greenberg) but not proved in the lesson.

Sources: Greenberg, *Euclidean and Non-Euclidean Geometries* (neutral geometry, Saccheri–Legendre, hyperbolic
trigonometry); Lam, Amer. Math. Monthly 98 (1991) 305–318; https://en.wikipedia.org/wiki/Lam%27s_problem;
Badger, Math. Magazine 67 (1994) on Lazzarini.
