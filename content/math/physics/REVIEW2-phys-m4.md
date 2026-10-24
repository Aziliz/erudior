# Round 2 review: module phys-m4 (Energy and momentum)

Reviewed: honors lessons 14h1-rockets and 14h2-restitution, round 2 additions to core lessons
11–14, `questions/r2-phys-m4.yaml` (49), `drills/r2-phys-m4.yaml` (5),
`glossary-r2-phys-m4.yaml` (12), `cards-r2-phys-m4.yaml` (19), `images/m4-*` (13 SVGs),
2 plots, 5 Mermaid diagrams. `content/math/check-module.sh physics m4`: zero problems after fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| 14h2-restitution, bouncing-ball plot | The "0.64 m" and "0.41 m" points sat at the landing times (t = 1.17 s, 1.75 s), floating beside the curve instead of on the bounce peaks; the "time (s)" axis label sat on the last bounce. | Points moved to the peaks (0.813 s, 0.64 m) and (1.464 s, 0.41 m), recomputed in Python; labels placed just above them with `labels`; x range extended to 3.4 s so the axis title is clear. |
| 14h1-rockets, rocket-equation plot | Both point labels sat on the curve. Caption "each extra exhaust speed of Δv multiplies … by about 2.7" was garbled. | Labels moved off the curve (`labels`); caption now "each extra u of Δv multiplies the mass ratio needed by e ≈ 2.7". |
| images/m4-rocket.svg | "thrust" label nearly touched "(fuel and oxidizer)". | Label moved to the right of the thrust arrow. |
| phys-m4-r2-h07 (order) + 14h1 Staging section | Explanation claimed igniting the second stage before separation "would push against the first stage"; false in general (hot staging is used, e.g. Titan II, Soyuz, Starship), and with hot staging two items swap, so the order was not unique. | Stem now asks for the usual sequence where the second stage ignites after separation; explanation and lesson note hot staging exists. |
| phys-m4-r2-h18 (text) | Answer is a percentage; "64%" not accepted. | Added `64%`, `64 percent`. |
| 11-work-kinetic-energy, sentence before sled picture | "Only the rope's tension (along part of its length)…" is wrong wording (it is the tension's horizontal component, not part of the rope). | "(through its horizontal component)". |

## Checked and found right (a reader might doubt)
- All lesson numbers recomputed in Python: Example 1 thrust 7.5×10⁵ N, T/W 1.53, a = 5.2 m/s²; step-sum table 1691/1991, 1818/1848, 1831/1834 → 2000 ln 2.5 = 1833 m/s; e^(9.4/3.5) = 14.7, 6.8 % non-propellant; staging 4828 vs 2749 + 3510 = 6259 m/s (+29.6 %); conveyor 100 N / 250 W / 125 W; rain car 2.73 m/s, 8200 J lost; restitution 0.40/2.4 m/s, 7.2 J by both methods; bounce 0.262 m, 4.56 m, 4.07 s; ITF √(135/254) = 0.73, √(147/254) = 0.76; Jupiter Δv ≈ 2×10⁻²⁰ m/s.
- General restitution formulas and K_lost = (1 − e²)K_rel verified symbolically (sympy).
- Conveyor half-and-half split independent of roughness: correct (in the belt frame the sand's KE ½Rv² is all dissipated).
- Gravity-assist geometry: craft passes the planet's trailing side (planet moving left, path loops round its right side) for a speed gain; passing in front slows it (used for Mercury missions, e.g. MESSENGER). Head-on v + 2U labeled an upper limit.
- Impulse-graph SVG: the curve is a raised-cosine pulse, so the average-force line at exactly half the peak is correct for this shape.
- Energy-track SVG: point C is at exactly half the release height; bars match.
- Every question worked before reading the key (49); all keys and distractor explanations correct apart from the fixes above. Select-all, match, order (except h07) unambiguous.
- All 6 label questions rendered with markers: each marker on the part its label names.
- Drills: formulas match the lesson; 3 s.f. answers use relTolerance 0.01 (≥ 0.005 worst case), 2-decimal velocities tolerance 0.011; ranges keep approach speed ≥ 2 m/s and T between 1.2W and 4W.
- Glossary: no term or alias duplicates any other glossary file in the course.
- History: William Moore (1810/1813), Tsiolkovsky 1903, Goddard and Oberth independent; Newton's Principia (1687) scholium with wool, steel, cork and glass balls; Voyager 2 launched 1977, Neptune 1989.

## Sources
- Tsiolkovsky rocket equation, history: https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation
- ITF Rules of Tennis, Appendix I (ball rebound 135–147 cm from 254 cm onto concrete): https://www.itftennis.com/en/about-us/governance/rules-and-regulations/
- OpenStax University Physics Vol. 1, §9.7 Rocket Propulsion and §9.4–9.5 (collisions, CM frame).
- NASA Voyager mission overview (launch 1977, Neptune 1989): https://science.nasa.gov/mission/voyager/
- Hot staging: Titan II and Starship flight test descriptions (general knowledge).

## Overlap and uncertain
- No overlap with other round 2 lessons. `delta-v` is also bolded in 20h3-orbital-mechanics (phys-m5); it uses this module's glossary entry, consistent.
- Example 4 bat e = 0.50 is a rough value (BBCOR-style ~0.5); the lesson already labels the 65 m/s as an overestimate.
- Glossary alias "bar chart" is generic, as the writer noted; no conflict today.
