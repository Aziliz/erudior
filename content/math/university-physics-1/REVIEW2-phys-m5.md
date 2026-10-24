# Round 2 review: phys-m5 (Rotation and gravitation)

Reviewer, working independently of the writer. Scope: honors lessons 19h1, 19h2 and 19h3, the round 2
additions to core lessons 15–19, `questions/r2-phys-m5.yaml` (68), `drills/r2-phys-m5.yaml` (6),
`glossary-r2-phys-m5.yaml` (13), `cards-r2-phys-m5.yaml` (25) and the 20 `images/phys-m5-*` files.
`content/math/check-module.sh university-physics-1 phys-m5` reports zero problems after the fixes.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| 19-gravitation.md, K/U/E plot | The dashed E curve ran through the x-axis tick labels 2.5, 3 and 3.5, and the "r" axis title sat on the K curve at the right edge | x range changed from [0, 4] to [0, 2.2]; re-rendered, nothing overlaps now | render |
| images/phys-m5-rolling-sum.svg | The "v" labels on the center arrows of the translation and rolling wheels sat on the wheel rims, and the translation wheel's bottom "v" sat on the ground line | Center labels moved above the arrows, inside the wheels; bottom label moved above the ground line. The blank copy has no text and needed no change | render |
| images/phys-m5-tipping.svg | In the 45° box the "pivot edge" label sat across the dashed center-of-gravity line | Label moved to the left of the pivot (anchored at its end) | render |
| 19h3, Roche limit section | "Roche, who in 1849 calculated it": he calculated it in 1848 and the paper came out in 1849 | Now says "in 1848 (published in 1849)". The card's "(Roche, 1849)" cites the paper and was left as it is | Wikipedia "Roche limit" (cites Roche's 1849 Montpellier memoir) |
| phys-m5-r2-q23 explanation | "a geostationary satellite 24 h" stated the period too loosely | Now "one sidereal day, about 23 h 56 min (by design…)" | standard value |

## Checked and found right (things a reader might doubt)

- **Every question worked independently before I read its key** (25 core, 43 honors). No answer-key errors. All
  numeric keys and distractors recomputed: h02 (5.0; 7/√1.4 = 5.92; 2.0), h03 (1.02 s; 3.57; 1.43; 2.55),
  h06 (−0.50), h15 (0.98; 0.098; 0.10; 1.02), h21 (1.56; 3.12; 1.80; 0.052), h22 (1.2), h30, h31 (6.01×10³ s,
  half = 50 min; √(R/g) = 16 min), h37 (60,000; 95,200; 47,600). The order items have no ties (q08 torques
  0/6/16/20/24 N·m; q18; h11 0.714/0.667/0.600/0.500; h40 0/0.25/0.44/0.5/1).
- **Lesson numbers**: bowling ball (t* = 2.332 s, v_f = 5.714 m/s, ω = 51.9 rad/s, d = 15.99 m, 224 → 160 J);
  backspin hoop (−0.90 m/s, stops at 1.02 s and 1.53 m, rolls from 1.33 s at 1.39 m); toy gyroscope
  (I = 9.19×10⁻⁵, L = 0.0289, Ω = 2.04 rad/s, T = 3.08 s, ω/Ω ≈ 154); crooked rotor (L⊥ = 0.0385,
  τ = 1.92 N·m, 9.6 N, 7.96 rev/s); stool (1.6 rad/s); tunnel (5065 s = 84.4 min, 7.90 km/s); tides (Moon
  1.10×10⁻⁶, Sun 5.05×10⁻⁷, ratio 0.459, direct pulls 5.93×10⁻³ vs 3.32×10⁻⁵ = 178×, spring 1.6, neap 0.60);
  Roche (9,490 km rigid, 18,370 km fluid); tipping angle arctan(45/75) = 31.0°.
- **Derivations**: slip-velocity friction direction; angular momentum about a floor point (friction has no lever
  arm, and the torques of N and Mg cancel); v_f = (v₀ + cRω₀)/(1 + c); t* with initial spin; center of percussion
  b = I_P/(Md) and the cue ball as the same result with the contact point as pivot; precession is independent of
  tilt; L of the crooked dumbbell is perpendicular to the rod, axial part = I_axle·ω; shell-ring integral
  dV = −GM ds/(2rR); tidal field (2, −1) components.
- **Facts**: axial precession about 25,800 yr; Hipparchus about 130 BCE; Vega near the pole in about 12,000 yr
  (closest around 13,700 CE); tropical year 20.4 min shorter than the sidereal year (365.24219 vs 365.25636 d);
  PREM g ≈ 10.7 m/s² at the core–mantle boundary, about 2,890 km down; Moon recedes 3.8 cm/yr (lunar laser ranging);
  Bay of Fundy range above 15 m; 60 ft (18.3 m) from the foul line to the head pin; Kooijman et al., Science 332
  (2011) 339 (gyroscopic and trail effects cancelled, bicycle still self-stable), correctly labeled contested;
  Shoemaker–Levy 9 broke up in July 1992 and hit Jupiter in July 1994; Principia 1687; ISS CMGs.
- **Pictures** (all 20 rendered; the 7 blanks with their markers): the disk arrows point the right ways for a slowing
  CCW disk; the lever arm is perpendicular to the line of action and its length is r sin 60°; the Kepler ellipse is
  to scale (a = 250, b = 200, focus offset 150) and its two wedges have equal area (5999 vs 6003 px²); the gyroscope
  τ = +ŷ (into the page) and the precession arrow is counterclockwise seen from above; the dumbbell's L has an upward
  part along ω and is perpendicular to the rod; the tide arrows have the right directions and roughly 2 : 1.6 : 1
  lengths. Every marker sits on the part its label names.
- **Mermaid** (5) and **plots** (4): rendered and read; the content and accTitle/accDescr are correct.
- **Drills**: I wrote an independent script that generates 400 instances of each drill with the app's own
  `generate`, re-reads the numbers from the prompt text and recomputes the answers. Result: 0 mismatches. Correctly
  rounded 3 s.f. answers are accepted (relTolerance 0.01 ≥ 0.005), a 3% error is rejected, and there are no unfilled
  placeholders.
- **Glossary**: no duplicates of any term or alias in the course's glossary files; the definitions are correct.
  **Cards**: correct.

## Left as is / uncertain

- hinged-beam SVG: the hinge components H and V are drawn just below the hinge, and the sign's weight just to the
  right of the sign, not exactly at their points of application. This is a common drawing convention and the alt
  text and lesson text say where they act, but strictly the lesson's own rule is "each force at its point of action".
- phys-m5-r2-tidal drill: "moon" masses go up to 9.9×10²⁴ kg (heavier than Earth) at 10⁸ m. The arithmetic is right
  but the scenario is unphysical at the top of the range. Not an error, so I didn't change it.
- Overlap: the Kepler ellipse picture in lesson 19 and phys-h1's ellipse figure (lesson 92) show similar geometry.
  The text doesn't duplicate. Lesson 19's own round 1 text already states the shell theorem and g ∝ r inside; 19h3
  proves and extends it, which is fine.

## Counts

Answer-key errors 0; factual fixes 2 (Roche date, geostationary period); picture fixes 3 (gravitation plot,
rolling-sum SVG, tipping SVG); other fixes 0.
