# Round 2 review: phys-m9 (Electric circuits), University Physics II

Reviewer for item 143. Checked the 2 honors lessons (09h1, 09h2), the additions to core lessons
07–09, `questions/r2-phys-m9.yaml` (45 questions, every one worked before reading the key),
`drills/r2-phys-m9.yaml` (5 drills), `glossary-r2-phys-m9.yaml` (21 terms), `cards-r2-phys-m9.yaml`
(18 cards), all 17 `images/phys-m9-*` SVGs (rendered; blanks rendered with their label markers),
the 3 Mermaid diagrams (rendered from .mmd) and all 7 new plots (rendered with
`scripts/preview-plots.mjs`). Every number in the lessons and keys recomputed in Python.
`content/math/check-module.sh university-physics-2 phys-m9` reports zero problems after the fixes.

## Changes

### Answer keys
None wrong. All 45 keys are right and have exactly one defensible answer.

### Questions (distractors and explanations)
- **phys-m9-r2-h06**: the 9.0 mA distractor's stated mistake ("divides 9.0 V by 1 kΩ") wasn't a
  plausible error. Replaced it with 0.56 mA ($V_{\text{th}}/(R_1 + R_2)$ = 9.0/16 kΩ) and explained it.
- **phys-m9-r2-h22**: the explanation didn't cover 6.77 kHz or 0.339 kHz. Added: $1/(\pi RC)$ = 6.77 kHz
  (π instead of 2π); 0.339 kHz is a power-of-ten slip.
- **phys-m9-r2-h24**: added that 0.500 is $1/(\omega RC)$, the high-frequency approximation of the
  low-pass gain.
- **phys-m9-r2-h28**: the 0.500 distractor matched no real mistake. Replaced it with 0.995 (the
  high-pass gain $10/\sqrt{101}$) and explained it. The answer index is still 2.
- **phys-m9-r2-h26**: added an explanation for the 50 V distractor.

### Facts and wording
- **09h1, "Fewer unknowns"**: the lesson defined a linear circuit as built only from ideal batteries
  and ohmic resistors, but then uses Norton current sources. Changed it to "ideal batteries, ohmic
  resistors and, if present, ideal current sources", so currents are linear in the source values.
  This now matches the glossary.
- **09h1, Mermaid `accDescr`**: it said "node-voltage method … or Kirchhoff's rules", but the chart
  has no Kirchhoff box. Removed the clause so the description matches the diagram.
- **09h2, 555 timer sentence**: added "with $R$ the total resistance it charges through". In the
  astable circuit that is $R_A + R_B$, so the $RC\ln 2$ claim is no longer ambiguous. The sentence
  was already marked as a simplification.

### Plots
- **L07 I–V plot**: the filament curve was $0.32\sqrt{V}$. Its slope is infinite at the origin, which
  means zero resistance for a cold filament. That is physically wrong even in a curve labeled
  "illustrative". Replaced it with $I = V/(1 + 2.8\sqrt V)$: about 1 Ω cold and about 10 Ω at 10 V
  (a realistic ratio of about 10×). It is still concave toward the voltage axis, still crosses the
  10 Ω line near 10 V, and the caption is still accurate. Re-rendered: no overlaps.

### Pictures
- **phys-m9-delay.svg**: moved the "C" and "10 μF" labels 7 px right. "C" was touching the
  capacitor plate.
- **phys-m9-relaxation.svg**: moved the "C" label 8 px left. Its right edge overlapped the left end
  of the plates.
- **phys-m9-r2-q01 (wire-blank label marker 1)**: moved it from y 31.1 (above the wire, where the
  leader line of the labeled version ends) to y 47.2, the centre of the end-face ellipse (cx 150,
  cy 170 in a 720×360 viewBox). It now sits on the part it names.

### Other
- **L09 low-pass image**: the image was inline at the start of the existing "The crossover frequency…"
  paragraph. Split it into its own paragraph so it renders as a figure.

## Checked and right (a reader might doubt these)
- 09h1 Example 1 node equation (V = 8.0 V); Example 2: $V_{\text{th}}$ 9.6 V, $R_{\text{th}}$ 1.2 Ω,
  $I_N$ 8.0 A, load current 1.33 A, max power 19.2 W. Superposition split: 1.0 A + 0.33 A.
  Bridge: 0.238 V, 102.4 Ω, 1.56 mA, current d→c, and the bridge SVG's arrow points d→c with the
  battery's long plate on top. Ladder: 2, 5/3, 13/8, 34/21 → 1.618R.
- The battery-branch formula $(V_b + \mathcal{E} - V_a)/R$ and the bridge balance algebra
  ($R_2R_3 = R_1R_x$).
- 09h2: Example 1 (6.0 V, 20 ms, 3.79 V, 1.74 mA, 60 ms, 108 ms). Example 2 (84.7 ms, 11.8 Hz,
  110 ms), and the sawtooth's breakpoints at 1.0986 + k·0.8473 in units of RC. Filter derivation
  (cos/sin matching gives $\tan\phi = \omega RC$ and the gain). Example 3: 995 Hz;
  0.980 / 11.37° at 200 Hz; 0.195 / 78.75° at 5 kHz (printed as 78.7°; 78.75 can round either way at
  3 s.f., left as is); 3.8% of power. Capacitor sharing: $\tfrac12 C_sV_0^2$ and Example 4.
- 555 thresholds: 1/3 and 2/3 of the supply give ln 2 for both the charge and discharge stretches.
  This is standard and correct.
- History: Helmholtz 1853 and Thévenin 1883; Norton (Bell Labs memo) and Mayer (Siemens) both 1926;
  Christie 1833 and Wheatstone 1843 (Bakerian lecture). Sources: D. H. Johnson, "Origins of the
  equivalent circuit concept", Proc. IEEE 91 (2003), parts 1–2
  (https://jontalle.web.engr.illinois.edu/uploads/537.F18/Papers/DonJohnson1-03.pdf);
  ETHW, Hans Ferdinand Mayer (https://ethw.org/Hans_Ferdinand_Mayer); National MagLab, Wheatstone
  bridge 1843
  (https://nationalmaglab.org/magnet-academy/history-of-electricity-magnetism/museum/wheatstone-bridge-1843/);
  Wikipedia, Wheatstone bridge (Christie 1833).
- Drills: the formulas match their prompts (kΩ × μF = ms, R kΩ × C nF for the filter). relTolerance
  0.01 accepts any value correctly rounded to 3 s.f. (the worst-case rounding error is 0.5%). The
  `where` clauses are sound and there are no placeholder collisions. The checker generated every
  drill without problems.
- Glossary: none of the 21 terms or aliases duplicates any other `glossary*.yaml` in the course
  (checked by script). The cards are correct.
- Every circuit SVG is topologically correct: two-way switch charge/discharge paths, meter
  placement, Kirchhoff battery polarities, series-parallel currents (1.33 / 1.0 / 0.33 A), and the
  Thévenin/Norton forms. The markers on all 5 blank images sit on their parts.
- L08 maximum-power plot (peak 18 W at 2 Ω), L07 I(t) shading (area 8.0 C), L09 half-life points.

## Left as is / uncertain
- L08 intro: the sentence "Since circuit diagrams are hard to draw here…", which the writer flagged,
  now reads "Circuits are shown in diagrams below and also described in words". The next paragraph
  ("The main circuits in this lesson also come with diagrams…") is now slightly redundant. It is
  harmless, so I left it.
- 09h2 "In the module on magnetism and AC circuits": the module's title is "Magnetism and
  induction", but lesson 14 (inductance and AC) does cover reactance, so the pointer is accurate.
- Overlap: 14h3 (phys-m10, driven RLC, phasors) also covers AC response. 09h2 derives only the RC
  filter from the ODE and points forward, so the overlap is small and the two complement each
  other. 09h1's maximum-power result repeats L08 on purpose and extends it.
