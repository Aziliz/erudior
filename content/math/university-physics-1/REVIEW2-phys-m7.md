# Round 2 review: module phys-m7 (Fluids and thermodynamics)

Reviewer's check: `content/math/check-module.sh university-physics-1 phys-m7` reports zero problems
after the fixes (9 lessons, 131 questions, 26 drills, 58 cards).

## Changes

### Answer key
- **phys-m7-r2-q02** (diver gauge pressure, text). The key accepted only `2.5`, which is the rule-of-thumb value. The explanation itself gives the exact value, $2.45\times10^5$ Pa = 2.42 atm, so a student who worked it out properly was marked wrong. Now `accept: ['2.5', '2.4', '2.42']`, and the explanation says 2.4 is also accepted. I left 2.45 out on purpose: that is the value in units of $10^5$ Pa (bar), not atm.

### Facts
- **29h1, "Why not a much higher compression ratio?"** It said gasoline engines "stop around 8 to 12". Several current production direct-injection engines run at 13–14:1 (for example, Mazda's Skyactiv-G is 13–14:1 and Toyota's Dynamic Force is about 13–14:1). Now: "usually stop around 8 to 12 (a few modern direct-injection designs reach 13 or 14)". The other "8–12" mentions (key points, h08, card) are worded as "about" or "limited by knock" and are consistent with "usually", so I left them.
- **29h1, Brayton section, and the glossary entry "combined-cycle".** These said the best combined-cycle plants convert "about 60%". The certified records are a little above that: about 62% at EDF Bouchain in 2016, and about 63% at Chubu Electric's Nishi-Nagoya in 2018 (Guinness World Records / GE press releases). Both now say "a little over 60%".

### Pictures and plots
- **images/phys-m7-kinetic-box.svg** (and **-blank.svg**, for consistency): in the labeled version, the label "after (x-part −vₓ)" was printed over a molecule, and "before (x-part +vₓ)" touched another one. I moved those two background molecules to (165, 262) and (178, 152). The label question's markers are unchanged and still on their parts.
- **27-ideal-gases, isotherms plot**: the curve labels "800 K" and "400 K" were drawn on top of their curves (the function `label`s sit on the curve). I replaced them with free `labels` placed beside each curve's end.
- **29h2, both bar charts** (coin multiplicities, Einstein-solid splits): the y-axis was drawn at x = 0, through the first bar, with its tick numbers printed on that bar. The axis titles ("number of heads", "quanta in solid A") also sat on the last bar. I redrew both with `grid: false`, a value label above each bar, the macrostate number under each bar, and the axis title below the bars. The data are unchanged (1, 4, 6, 4, 1 and 28, 63, 90, 100, 90, 63, 28). I moved "multiplicity Ω" into the first caption.
- **25-fluid-flow, draining-tank plot**: the x-axis title "time t (s)" covered the "empty at 63.9 s" dot. I widened the x range from 0–70 to 0–82.

### Other
- **phys-m7-r2-h29** explanation: the reason it gave for the extra $R^2$ ("because more of the fluid is close to the wall") was vague and could be misread. It now says that the whole parabolic profile $\frac{\Delta P}{4\eta L}(R^2 - r^2)$ scales as $R^2$, because all the fluid is closer to the motionless wall.

## Checked and found right (things a reader might doubt)
- All 71 new questions, worked independently, with every number recomputed in Python: q10 (63.9 s, plus the distractors 31.9, 45.2 and 626), q15 (45.8 °C), q21 (166 kPa), q31 (14.7, 13.7, 0.068), h01, h02, h09 (62.5%), h11 (53.9%), h12 (579 K), h14 (13.1 kJ), h17, h18, h22, h24 (0.021), h25 (6.36 km), h31 (Re = 114), h32 (2.04 mm/s, Re = 0.10), h36 (1.42 Pa·s, Re = 0.018), h39 (30.2 kPa, Re ≈ 850). Every distractor matches the mistake its explanation names. Every select-all, order and match question has exactly one defensible answer.
- Worked examples, recomputed: Otto r = 10 (60.2%, 754 K, 2.51 MPa, 796 K, Q_H 25.9 kJ, W 15.6 kJ); Diesel r = 18, r_c = 2 (63.2%; Otto at 18 is 68.5%); Brayton r_p = 20 (57.5%, 706 K); C(100,50) = 1.01×10²⁹; 2⁻¹⁰⁰ = 7.9×10⁻³¹; P(45–55 heads of 100) = 72.9% ("about 73%"); free expansion 5.76 J/K and 10^(−1.8×10²³); Einstein solid table, which totals 462 = C(11,6), with 20% for 5 or 6 quanta; scale heights 8.6 km (air, 293 K), 9.09 km (N₂) and 63.6 km (He), with fractions 0.33 and 0.85; needle 3.98 kPa / 0.31 N and 64 kPa / 5.0 N, Re = 640; pipe Re = 15,000 and 0.13 m/s; silt 0.36 mm/s, Re = 0.0072, 46 min; sand Re = 7.2. Core: Carnot plot points (V ratio 2^1.5 for T_H = 2T_C, γ = 5/3), draining time 63.9 s, coffee 62.5 °C at 10 min, rectangular cycle 600 J.
- Derivations: Otto, Diesel (T₄ = T₁r_c^γ) and Brayton efficiencies; the Poiseuille force balance and integration; average speed = ½ v_max; Stokes terminal speed; statistical temperature and heat-flow direction; Boltzmann factor from the reservoir entropy.
- The Otto SVG's two adiabats are consistent: with a suppressed pressure zero, both have P ratio ≈ r^1.4 for r = 5. The pipe-profile arrows follow 1 − (r/R)² to within a pixel.
- Facts and history (OpenStax University Physics Vol. 1 ch. 14 and Vol. 2 chs. 2–4; Schroeder, *Thermal Physics*; standard engineering thermodynamics, e.g. Çengel & Boles): Boltzmann's tombstone in the Vienna Zentralfriedhof reads S = k log W, in the form Planck wrote down; Stokes 1851 (Trans. Cambridge Phil. Soc.); Millikan's oil-drop work 1909–1913; viscosities (air 1.8×10⁻⁵, water 1.0×10⁻³ and 0.35×10⁻³ at 80 °C, blood 3–4×10⁻³, olive oil ≈ 0.08, glycerin ≈ 1.4 Pa·s); pipe Re thresholds 2000/3000 (labeled approximate); C ≈ 0.47–0.5 for a sphere at Re 10³–10⁵; real efficiencies (gasoline 25–35%, best near 40%; large marine two-stroke diesels about 50%; simple-cycle gas turbines 35–45%); the atmosphere well mixed below the ~100 km homopause; fluctuation-theorem experiments on small systems (Wang et al., PRL 2002). The air-standard model and the isothermal atmosphere are labeled as simplifications.
- All 17 SVGs rendered, the 8 label questions with their markers: every marker is on the part its label names, and text is readable with nothing cut off. All 7 Mermaid diagrams rendered: content correct and `accDescr` covers each whole diagram. All new plots rendered with the app's code.
- Drills: the formulas match the lessons. relTolerance 0.01 accepts every correctly rounded 3-significant-figure answer (the worst-case rounding error is 0.5%) and rejects answers 5% off. There are no unfilled placeholders and no collisions (`k` and `n` only appear where they should be filled). The `where` filters keep Poiseuille laminar and Stokes at Re < 0.5. The checker generated and typed every drill without errors.
- Glossary: no term or alias duplicates any other `glossary*.yaml` in the course. The definitions and cards are correct.

## Overlap
- 29h3 (viscous flow) and phys-m3's honors lesson 10h2-drag both introduce the Reynolds number for a sphere, Stokes' law b = 6πηR and C ≈ 0.5. This is complementary, not repeated: 10h2 solves the motion under quadratic drag and points forward to 29h3 for where Stokes' law comes from, while 29h3 derives viscous flow. Their numbers agree. No change.

## Left as is / uncertain
- Out of scope (round 1): the processes plot in 28-first-law, which predates round 2, has its "isothermal" label sitting on the dashed isotherm. I didn't touch it.
- The heat-transfer SVG draws its radiation waves starting just beside the pot and burner, not from the burner's glowing top. It reads correctly, so I left it.
- The Carnot plot's single "adiabats" label sits next to only the 2 → 3 adiabat. It is minor, and the caption explains which curves are which.
