# REVIEW2-trig-h1: review of the honors module trig-h1 ("Trigonometry in science and engineering")

Reviewer for item 133. Scope: lessons 90–93, `questions/r2-trig-h1.yaml` (h01–h56), `drills/r2-trig-h1.yaml` (12 drills), `glossary-r2-trig-h1.yaml` (40 terms), `cards-r2-trig-h1.yaml` (40 cards), `images/trig-h1-*` (4 SVGs + 4 blanks), 4 Mermaid charts, 1 plot, 2 shapes.

`content/math/check-module.sh trigonometry trig-h1` after the fixes: **OK, zero problems**.

## Counts

- Answer-key errors: **0**
- Factual fixes: **2**
- Picture fixes: **4** (1 SVG, 3 lesson figures)
- Other fixes: **3**

## Changes

### Factual

1. **Lesson 90, "Two answers" paragraph, and the intro sentence.** The lesson said the two inverse-kinematics solutions are "the ambiguous case of Module 7 again: the same three lengths, two different triangles". That is wrong. The ambiguous case is SSA giving two *non-congruent* triangles. Here the three sides (SSS) fix the triangle, and the two solutions are the same triangle reflected across the shoulder–target line. I rewrote both passages to say the situation *recalls* the ambiguous case (two answers from the same data) and to explain why the reason differs. I made the matching wording fix in the h10 explanation and in the "Why inverse kinematics has two solutions" card.
2. **Lesson 92, index of refraction.** The lesson said "Light is slower in denser optical materials, so $n \ge 1$". That reasoning is circular, because "optically denser" is defined by $n$. It now says that light is slower in a material than in a vacuum, so $n \ge 1$, and that a larger $n$ means slower light (an "optically denser" material).

### Pictures

3. **`trig-h1-spherical-triangle.svg`.** The "N (North Pole)" label sat across the sphere's outline. I moved it above the sphere (x 280, y 48, centered). The blank copy has no text, so it is unchanged, and its markers are still on the right parts.
4. **Lesson 90, the shape figure with both elbow solutions.** The point labels "shoulder" and "elbow (down)" sat on the arm segments and on the dashed line. I replaced the point labels with free `labels` placed clear of every line.
5. **Lesson 91, the plot of two waves and their sum.** The renderer puts curve labels at the right end of each curve, so all three labels were crossed by other curves. The "ωt (radians)" axis title was crossed too. Changes:
   - I removed the curve labels and moved the identification into the caption. The two dashed waves are told apart by their peaks (5 and 8), and the sum is the solid curve.
   - I widened x to [−3.2, 4.4] so the axis title sits in clear space.
6. **Lesson 92, Huygens shape.** The "A" point label overlapped the dashed wavefront. I moved it to a free label above and left of A.

### Other

7. **Lesson 91, AC circuits.** "In a circuit driven at one frequency, every voltage and current is a sinusoid of that frequency" is true only for linear (ideal) components in steady state. I added "of ideal components … once it has settled into its steady state".
8. **Glossary, "alternating current".** The entry defined AC as current that "varies sinusoidally". AC is current that reverses direction periodically; a sinusoid is the usual case, not part of the definition. I reworded the entry.
9. **h16.** I added `6*sqrt(3)` to `accept`.

## Checked and found right (things a reader might doubt)

- **Every question (h01–h56)** was worked before I read the key. All keys and distractor explanations are correct. Numbers recomputed in Python include:
  - h14: 53.13°;
  - h18: $\cos(\omega t+1)-\cos(\omega t-1) = -2\sin 1\,\sin\omega t$;
  - h22: 26.53 Ω;
  - h25: 159.2 / 503.3 / 6283;
  - h29: 35.26°;
  - h32: glass→water $\theta_c$ = 62.46°;
  - h35: 28.90° and 35.17°;
  - h37: 32.58° / 68.96° / 5.74°;
  - h40: 38.8°;
  - h43: 6672 km, and the chord $2R\sin30^\circ$ = 6371 km;
  - h54: 75.5°, 1.360R vs 1.318R.
- **h48.** A spherical triangle with angles 120°, 90° and 60° exists: its polar triangle's sides 60°, 90° and 120° satisfy the triangle inequality.
- **Order questions (h08, h26, h38, h51)** each have one valid order.
- **Label questions.** All four blank images were rendered with their markers. Every marker sits on the part it names.
- **Worked examples**, all recomputed:
  - rotation (2.964, 2.866);
  - forward kinematics (42.41, 48.98);
  - inverse kinematics: θ2 = ±67.98°, θ1 = 2.48° / 59.45°; both were confirmed by forward kinematics and by intersecting the two circles, and the elbow coordinates in the shape match;
  - phasor sum 10.79∠−24.18°;
  - RLC: X_L 75.40, X_C 53.05, Z 37.41, I 4.544 A, φ 36.68°, V_R 136.3, V_L 342.6, V_C 241.1, f0 50.3 Hz, power factor 0.80;
  - Snell: 28.90°, critical angles 48.75° / 24.41° / 41.81°;
  - fiber: NA 0.2425, acceptance angle 14.03°, wall critical angle 80.6°;
  - New York–Madrid: 5769 km, also by the haversine formula; the 40.5° parallel route is about 5940 km; the bearing is 65.7°; the route's highest latitude is 46.3° N (Clairaut, $\cos\varphi_{max} = \sin\theta_0\cos\varphi_1$);
  - the 8-digit rounding example: 0.90 km instead of 1 km;
  - octant area 63.8 million km².
- **Elbow-up/down convention.** Positive θ2 with θ1 = φ − ψ puts the elbow on the clockwise side of the target line, which is consistent with the figure and the drill.
- **Huygens shape geometry.** The right angles are at the wavefront ends, and $\sin\theta_1/\sin\theta_2$ = 1.50 as drawn. The arm, phasor and refraction SVGs are drawn to scale: the arm at 30° and 75°, the refraction at about 50° in and about 30.6° out, so n ≈ 1.5.
- **Drills.** I generated 300 instances of each of the 12 drills with the app's `generate()` and recomputed every answer independently from the prompt text:
  - rotation by complex multiplication;
  - inverse kinematics by circle–circle intersection;
  - phasor sums by Fourier projection of the sampled wave;
  - resonance by root-finding $X_L = X_C$;
  - distance from the 3-D cross and dot product;
  - bearing from the tangent vector.

  There were 0 mismatches, and the app accepted the displayed rounded answers in every instance. Tolerances are at least half the last place everywhere. I found no unfilled placeholders, "+ -" or thousands commas inside math. In the spherical-excess drill, the `where` conditions are exactly the conditions for a spherical triangle to exist.
- **Mermaid diagrams.** All four render cleanly, and their accTitle/accDescr describe the whole chart.
- **History and facts.** These match standard references (Wikipedia "Snell's law", "Phasor", "Spherical trigonometry", "Great-circle distance"; OpenStax *University Physics* Vol. 3 ch. 1 and Vol. 2 ch. 15):
  - Ibn Sahl 984 (Baghdad, *On Burning Mirrors and Lenses*);
  - Harriot 1602 and Snellius 1621, both unpublished;
  - Descartes 1637;
  - Huygens 1678;
  - Steinmetz in the 1890s (his 1893 paper);
  - Girard 1629, labeled "usually credited";
  - the spherical-Earth error of up to about 0.5%;
  - 120 V RMS ≈ 170 V peak;
  - n values for water 1.33, glass about 1.5 and diamond 2.42.

## Overlap

- Lesson 90's rotation section repeats part of trig-m8's 34h1 (rotation). It is labeled as a review there.
- 04h1 (trig-m1) defines great circles and mentions the haversine name, and 12h1 mentions the haversine. Lesson 93 builds on these rather than repeating them.

There is no other overlap with round 2 lessons.

## Left uncertain

Nothing substantive. The flowchart in lesson 92 says "refracts, bending toward the normal" for $n_1 \le n_2$. That ignores the trivial cases $n_1 = n_2$ and normal incidence, and I left it as is.
