# Round 2 review: module phys-m2 (Kinematics)

Reviewer for item 82. Scope: honors lessons 06h1, 06h2, 06h3; round 2 additions to lessons
03–06; `questions/r2-phys-m2.yaml` (59), `drills/r2-phys-m2.yaml` (9), `glossary-r2-phys-m2.yaml`
(11), `cards-r2-phys-m2.yaml` (27), the 16 `images/phys-m2-*` SVGs and the 7 Mermaid diagrams.
`content/math/check-module.sh physics phys-m2` reports zero problems after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| phys-m2-r2-h10 (order) | Steps 2 ("solve the one-phase model and check the speed") and 3 ("find when top speed is reached") could be done in either order and still give a valid method, so the order wasn't unique. | Items are now: restart the clock with the head start; find when and where top speed is reached; check where the speeder is then (still ahead); close the remaining gap at the speed difference. Each step needs the one before it. The explanation is rewritten to match and still mentions the lesson's quick one-phase test. |
| phys-m2-r2-h38 (label) explanation | It said intervals growing as 1, 2, 3, 4 "would mean the acceleration was not constant". That's wrong: equal increases in interval distance *are* constant acceleration, just not starting from rest. | Explanation now says 1, 2, 3, 4 still means constant acceleration but doesn't fit a start from rest, because from rest the second interval must be three times the first. |
| `images/phys-m2-frames.svg` and its alt text in 06-motion-2d.md | The ground-frame parabola is drawn about 9 times too tall (the real ball rises 1.2 m over 20 m), so the launch looks like about 60° when the real angle is 14°. Nothing said the drawing wasn't to scale. | Added "height not to scale" to the SVG caption line, and a sentence to the alt text: "The height of the path is exaggerated: the real ball rises only about 1.2 m." |
| 06h1, first plot (x–t chase) | The point label "catch: 20 s, 500 m" was cut off at the right edge and sat on the police curve. The "speeder" curve label touched the police curve. | Took the labels off the curves and the point. Added free-standing labels in empty space: "catch (dot): 20 s, 500 m", "speeder" and "police (dashed)". The y-range is now 0–700. |
| 06h1, second plot (v–t chase) | The point label "equal speeds: largest gap" ran into the "speeder" curve label. | Took the label off the point and added a free-standing label "dot: equal speeds, largest gap" above the lines. |
| 06h2 plot (safety parabola) | The "safety parabola" curve label sat on the x-axis label and the curves. The "target (30, 5)" label sat on the 45° path. | Added free-standing labels "safety parabola (dashed)" and "target →" in empty regions, clear of every curve. |
| cards-r2-phys-m2, "Dilemma zone" card | "($d > vt_r + v^2/2a$ needed)" was unclear: it didn't say what $d$ is, and $v^2/2a$ can be read as $(v^2/2)a$. | Now reads "(the distance to the line is less than $vt_r + v^2/(2a)$)". |
| drill phys-m2-r2-chase | `td` could be 0, which produced the prompt "0 s later the police car starts". | `td` minimum raised to 0.5. |

No other fixes were needed. Everything else checked out (details below).

## Checked and found right (worth noting)

- **Every number in the three honors lessons was recomputed in Python.**
  - 06h1: Example 1 (20 s, 500 m, 50 m/s; largest gap 125 m at 10 s). Example 2 (unconstrained root 21.8 s at 54.6 m/s; phases 14.0 s and 245 m, gap 155 m, catch at 29.5 s and 787.5 m). Example 3 (32.4 m, 7.6 m; with reaction time 31.0 m left, contact at 2.85 s at 3.7 m/s, 5.2 m/s² needed). The stopping table, all five rows. The "40% faster gives 62% more" claim. Example 4 (37.5 m, 30 m, zone 7.5 m, $t_y \ge 3.5$ s).
  - 06h2: Example 1 (A = 11.025; angles 36.1° and 63.3°; times 1.86 s and 3.34 s). Example 2 (57.4 m at 35.4°; a 45° throw gives 55.5 m). Example 3 (16.7 m along the slope; best angle 55° found by brute force; 17.1 m). Example 4 (meet at 6.08 m; minimum speed 15.7 m/s).
  - 06h3: the 4.9 cm interval series, the 0.30 m ramp example, the least-squares fit (slope 4.907, intercept −0.0016), and the ruler drop (0.19 s).
- **Formulas checked.** The incline range $d = v_0^2[\sin(2\theta-\alpha)-\sin\alpha]/(g\cos^2\alpha)$, $\theta_{best} = 45^\circ+\alpha/2$ and $d_{max} = v_0^2/[g(1+\sin\alpha)]$ match brute-force maximization. The best angle from a cliff, $\tan\theta = v_0/\sqrt{v_0^2+2gh}$, matches the safety-parabola result.
- **Questions.** All 59 were worked independently. Each MC has one defensible answer, and every distractor's explanation was checked against its arithmetic (for example h15 2θ = 47.3°, h29 √4.85 = 2.20, h31 0.11/0.024/1.6 s). Select-all sets q04, q09, q13, q19, h09, h24 and h39 are correct. h24's "add to 90°" is correctly false, since the stem excludes level targets.
- **Drill formulas.** All match the lessons. Tolerances accept correctly rounded answers: relTolerance 0.01 for 3 s.f., 0.15° for the nearest 0.1°, and 0.006 for g-from-slope, where the true slope comes from the times rounded as shown. No placeholder collisions.
- **Pictures.** All 16 SVGs were rendered, and the 7 blanks were rendered with their markers. Every marker sits on its part. Geometry checked against the physics:
  - toss: spacings 7:5:3:1 and velocity arrows 4:3:2:1;
  - projectile: equal horizontal steps, and a drop of 1:4 from the top;
  - river: drawn to scale, 80 m and 48 m;
  - dilemma: 9 px/m, with 37.5 m, 30 m and a 15 m intersection;
  - incline: 50° on a 20° slope, with the apex and landing consistent with Example 3;
  - monkey: 26.6° aim and a 3.9 m drop;
  - galileo: intervals 1:3:5:7.
- **Mermaid.** All 7 diagrams were rendered and are readable. Each accDescr describes the whole diagram.
- **Plots.** The 5 honors plots were rendered with the app's code. The other plots are fine (stopping-distance curve, h–t² fit). The functions match the lessons.
- **History.**
  - Stevin and Jan Cornets de Groot: 1586, Delft church tower, about 30 ft, lead balls with a mass ratio of about 10:1, heard landing together. Reported in Stevin's *De Beghinselen der Weeghconst* (1586) ([Delft tower experiment](https://en.wikipedia.org/wiki/Delft_tower_experiment)).
  - The Pisa story comes from Viviani's biography of Galileo, and historians doubt it ([Leaning Tower experiment](https://en.wikipedia.org/wiki/Galileo%27s_Leaning_Tower_of_Pisa_experiment)).
  - Apollo 15 hammer and feather: David Scott, August 1971, on live TV (NASA Apollo 15 Lunar Surface Journal).
  - Galileo's water clock and inclined plane: *Two New Sciences* (1638), Third Day.
  - Aristotle's view is labeled as a simplified summary.
- **Driving numbers.**
  - AASHTO stopping sight distance uses a 2.5 s brake-reaction time and 3.4 m/s² (11.2 ft/s²).
  - The ITE yellow-change interval uses 1.0 s and 10 ft/s² (about 3 m/s²).
  - Gazis, Herman and Maradudin, *Operations Research* 8 (1960).
  - The lesson calls the dilemma-zone model physics, not traffic law, which is correct.
- **g values.** About 9.78 m/s² at the equator and 9.83 m/s² at the poles, a spread of about 0.5%. $g_n = 9.80665$ m/s² exactly (CGPM 1901, NIST). Rolling ball $a = \tfrac57 g\sin\theta$.
- The core-lesson additions are captions or intros only. No existing text was changed.

## Overlap

- 06h3 (measuring g from a straight-line graph of h against t²) has the same idea as 02h1-uncertainty (phys-m1), which finds g from a T²-against-L pendulum graph. They are complementary, not duplicates.
- 06h1's brief mention that tires set the shortest stopping distance overlaps with 10h1-friction-systems (phys-m4 area). That's consistent, so no change.

## Left uncertain

- 06h2 says shot-putters release "well below 45°". Elite release angles are roughly 35–38°, so the claim is qualitative but fair. Left as is.
- In 06h3 Example 3, the two-point slope 0.80/0.1631 = 4.9050 is quoted as 4.90. That's an acceptable rounding, and the least-squares value 4.91 is the one used.
