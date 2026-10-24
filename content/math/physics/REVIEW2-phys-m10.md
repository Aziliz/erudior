# Round 2 review: phys-m10 (Magnetism and induction)

Reviewer for item 90. Scope: honors lessons `41h1-charged-particles.md` and `41h2-ac-power.md`, the round 2 additions to lessons 38–41, `questions/r2-phys-m10.yaml` (48), `drills/r2-phys-m10.yaml` (5), `glossary-r2-phys-m10.yaml` (13), `cards-r2-phys-m10.yaml` (20), and the `images/phys-m10-*` SVGs.
`content/math/check-module.sh physics phys-m10` after the fixes: build and checker OK, 0 problems.

## Changes

### Answer keys
None wrong. All 48 questions worked independently before reading the keys; every key is right.

### Factual fixes
- **41h1, "Magnetic bottles" paragraph.** It said a particle bounces "if the field is strong enough". Whether a particle mirrors depends on how much the field grows *relative to its pitch angle*, not on field strength alone. It now says "if the field grows enough (how much is enough depends on the angle at which the particle spirals)". The paragraph also suggested that particles trapped in the Van Allen belts make the aurora. Auroral particles are mostly electrons from the magnetotail/plasma sheet, guided down field lines at high latitudes, not belt particles. The text now says so. (Sources: standard space-physics accounts, e.g. NASA/NOAA aurora pages and the mirror condition $\sin^2\alpha = B/B_{\max}$ in plasma texts such as Chen, *Introduction to Plasma Physics*.)
- **41h1, Example 3 (Thomson).** "about 1800 times smaller, which is how Thomson knew these particles were far lighter than atoms" was an overreach. A large $e/m$ alone can't separate charge from mass. Thomson's inference rested on the charge being about the hydrogen ion's, which his 1898–99 charge measurements supported. That qualifier is now in the text. The card "Thomson, 1897" in `cards-r2-phys-m10.yaml` got the same qualifier.
- **h14 explanation.** "synchrotrons raise the field" is now "synchrotrons raise the field (and adjust the frequency) as the particles gain energy". Synchrotrons ramp both, so the old wording was incomplete.

### Picture fixes
- **`phys-m10-rails.svg` and `-blank.svg`.** The × field marks were drawn everywhere *except* inside the circuit loop, so the flux the lesson talks about seemed to be missing from the loop. I added six × marks inside the loop, clear of the current arrows, the R label and every marker. Markers were re-previewed and still sit on their parts.
- **`phys-m10-hall.svg`.** Likewise, no × marks were drawn on the strip itself, where the field has to act. I added five, clear of the charges, arrows and labels.
- **Plot fixes (all re-rendered with `preview-plots.mjs`):**
  - **41 RL current plot.** The point labels "t = τ: 63%" and "t = 2τ: 86%" sat on the curve. They are now separate labels below and right of the points.
  - **41 reactance plot.** The capacitor label overlapped the y-axis title and the dashed curve, and "equal at 71 Hz" sat on the dashed curve. I moved both into clear space.
  - **41h2 phase plot.** The two labels overlapped each other, the y-axis title and both curves. I moved them below the curves, set the curves to stop at 4π inside a wider x range, and shortened the x-axis title to "ωt (rad)" so it no longer sits on the curves.

### Other fixes
- **Drill `phys-m10-r2-rlc-power`, solution.** `\dfrac{X_L - X_C}{R}` had `{R}` filled by the drill value R, so it rendered as e.g. `\dfrac{X_L - X_C}45`. In TeX that displays as (X_L − X_C)/4 followed by a stray 5, which is wrong. It is now written `{\,R}`. I also gave the φ and power-factor answers `format: num1` and `dp3`. The displayed correct answers had shown 2 decimals (e.g. "0.46") when the prompt asks for 3. The tolerances are unchanged.
- **q10 explanation.** "Each is roughly ten to a hundred times the one before" was false: the solenoid is about 380 times Earth's field. It now reads "at least ten times the one before (the solenoid is a few hundred times Earth's field)".
- **h21 explanation.** The 140 V distractor now names the mistake: adding $V_R$ and $V_L - V_C$ as plain numbers.

## Checked and found right (a reader might doubt these)
- **Directions.**
  - Orbit picture: a + charge in B into the page goes counterclockwise.
  - Rails: the induced current is counterclockwise, up through the rod.
  - Solenoid: dots on top and crosses on the bottom give an interior field to the right, so N is on the right.
  - Motor: the battery polarity, half-ring leads and coil-current arrows are mutually consistent.
  - Cyclotron: clockwise for + ions with B out of the page, consistent with the beam leaving the top to the right.
  - Hall strip: electrons drifting left in B into the page are pushed up, so the top edge is negative.
  - Phasors: $V_C > V_L$ puts V below the axis.
- **Numbers (recomputed in Python).**
  - Examples 1–4 of both honors lessons, e.g. 41h2 Example 1 at 107/134/189 V, −27°, 0.89 and 380 W.
  - Every numeric question: h01, h04, h06, h07, h09, h17, h18, h21, h23, h24, q02, q08, q13, q16 and q20, including each distractor's stated mistake.
  - The RL and reactance plot functions: 0.1896, 0.2594, and the crossing at 71.2 Hz and 44.7 Ω.
- **Drills.** I generated 400 instances of each of the 5 drills with the app's engine and recomputed every answer in Python from the inputs: 0 mismatches.
  - The 1% relTolerance covers 3-s.f. rounding at every value (worst case 0.5%).
  - φ ±0.06° covers rounding to 0.1°, and power factor ±0.0006 covers 3 dp.
  - No unfilled placeholders.
- **History.**
  - Hall 1879; Thomson 1897; Millikan from 1909.
  - Lawrence: cyclotron conceived 1929, first working machines 1930–31, so "early 1930s" is right.
  - Pearl Street Station, Sept. 1882.
  - Westinghouse licensed Tesla's polyphase patents in July 1888.
  - Niagara (Adams station) power reached Buffalo in Nov. 1896.
  - Sources: Encyclopaedia Britannica entries on these people and events; IEEE/ETHW history pages.
- **Data and ranges.**
  - Carrier densities: Cu 8.49, Ag 5.86, Au 5.90 ×10²⁸ m⁻³ (free-electron values, Ashcroft & Mermin, Table 1.1).
  - PET cyclotrons, roughly 10–20 MeV (typical commercial units are 11–18 MeV).
  - Generator voltages of about 10–25 kV and distribution at several to tens of kV are fair ranges.
- **Labels and qualifications.** The three-phase paragraph is labeled simplified and is correct for a balanced load: the currents sum to zero and the total power is constant. ELI the ICE man is correct.
- **Glossary and cards.** None of the 13 glossary terms duplicates an existing term or alias (checked by the build). The definitions and cards are correct.
- **Mermaid.** All 5 diagrams render, are top-down where long, and have an accTitle and an accDescr that describe the whole diagram.

## Overlap
None found. Core lesson 38 (round 1) already introduces the cyclotron frequency in one sentence; the honors lesson builds on it rather than repeating it. No other round 2 lesson in physics covers the Hall effect, cyclotrons, power factor or transmission.

## Left uncertain or not changed
- The `sig3` placeholder format drops trailing zeros (e.g. "1.8 cm" for 1.80, "68 W" for 68.0) in drill solutions. This is engine behavior, not something this module can fix.
- The DC-motor drawing shows the commutator face-on, although the coil turns about a vertical axis. This is a common textbook schematic and I left it.
- Synchrotron/synchrocyclotron details and the magnetic-mirror theory are kept at a "beyond this course" level, as labeled.
