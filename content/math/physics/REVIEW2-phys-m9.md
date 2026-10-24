# Round 2 review: phys-m9 (Electric circuits)

Reviewed independently: honors lessons 37h1 and 37h2, the round 2 additions to lessons 35–37, all 44
questions in `questions/r2-phys-m9.yaml` (worked before reading the key), 7 drills, 25 glossary
entries, 21 cards, 16 SVGs (blank copies rendered with their label markers), 4 Mermaid diagrams and
the 6 new plot blocks (rendered with `preview-plots.mjs`). `content/math/check-module.sh physics phys-m9`
reports zero problems after the fixes.

## Changes

### Answer key
- **phys-m9-r2-h16**: the "inverted the fraction" distractor was $1.4\times10^{14}$ s. But $1/(7.44\times10^{-15}\text{ s}) = 1.34\times10^{14}$, so the
  distractor didn't match the mistake it names. Changed the choice and its explanation to $1.3\times10^{14}$.
- **phys-m9-r2-h27**: the explanation said the 144× distractor "would apply to power at fixed current". That's wrong:
  at fixed current, power scales with $R$, so it would be 1/12. Rewrote it: 144 assumes current goes as $1/R^2$, while at
  fixed voltage it goes as $1/R$. Also noted that the starting power $V^2/R$ is about 12 times the running power. The key (A) was already right.

### Facts
- **37h2, Example 1**: the line showed $\tau = 2.5\times10^{-14}$ s, then gave $\mu = e\tau/m = 4.3\times10^{-3}$. But with 2.5 the
  result is $4.4\times10^{-3}$. The 4.3 comes from the unrounded $\tau = 2.46\times10^{-14}$ s. Now shows $2.46\times10^{-14} \approx 2.5\times10^{-14}$ s
  and uses 2.46 in the mobility and mean-free-path lines. The values $\mu = 4.3\times10^{-3}$, $v_d = 7.3\times10^{-5}$ m/s and 40 nm are unchanged.
- **37h2, Drude section**: the $10^6$ m/s "random speed" is the quantum Fermi speed ($1.57\times10^6$ m/s for Cu). It is not a classical
  result: Drude's classical gas would give $\sqrt{3kT/m} \approx 1.2\times10^5$ m/s. Added a sentence that labels it as a quantum result. Also changed
  "At $10^6$ m/s" to "At about $1.6\times10^6$ m/s", the speed the calculation actually uses.
- **37h2, thermistor**: the lesson implied every thermistor's resistance falls with temperature. Added that this is the common NTC type and that PTC thermistors also exist.
- **37h2, Mermaid (silicon → diode → LED)**: the chain implied that LEDs are made from doped silicon. The lesson itself says they use GaN or GaAsP.
  Changed the LED node and accDescr to "other semiconductors, such as gallium nitride".
- **37h1, Example 2**: added a note that real strain gauges change by well under 1%. With a gauge factor of about 2 and strain of about $10^{-3}$, that's about 0.2%.
  The lesson's 2% is kept for easy arithmetic. Without the note, the lesson overstates real gauge signals.
- **37h1, Example 4**: "1.0 MΩ (common in older analog meters)" changed to "older analog meters often had this much resistance or less on their low ranges".
  Analog meters are rated in Ω/V, for example 20 kΩ/V, which gives 200 kΩ on a 10 V range.
- **glossary "light-emitting diode"**: changed "forward voltage is roughly the photon energy in eV" to "forward voltage, in volts, is roughly the photon energy in electron volts" (units).

### Pictures and plots
- **phys-m9-thevenin.svg**: the "Vth" label touched the battery's long plate and read as "Vth.". The "12 V" and "3.0 kΩ" labels touched the plate and the zigzag. Moved all three left.
- **Lesson 35, I–V plot**: the two curve labels overlapped each other and sat on the curves. Replaced them with `labels` placed below the line and above the curve.
- **Lesson 36, power plot**: the peak label overlapped the y-axis title, and the formula label sat on the curve. Raised the y range to 24 and moved both into `labels` in clear space.
- **Lesson 37, discharge plot**: the function label sat on the curve and on the x-axis title. Moved it to clear space.
- **37h2, diode I–V plot**: the diode label overlapped the y-axis title and the resistor label sat on its line. Moved them to short labels in clear space,
  and the caption now says the curve is an illustrative shape and the dashed line is a 1 Ω resistor.

### Drills
- **phys-m9-r2-loading**: in 43 of the 108 input combinations the loading error was under 2%. With `relTolerance: 0.01`, the "Reading"
  box then accepted the unloaded voltage, which is the very mistake the drill teaches against. Added `where: ['err > 2']`, which leaves 65 combinations.

## Checked and found right (a reader might doubt)
- Every other question key and distractor, recomputed: h01 (440 Ω; 205 = $R_1R_2/R_3$), h06 (powers 2.0/1.92/1.5/1.19 mW),
  h07 (3.33 V; 4.76 V for 10 MΩ), h09 order (9.0, 8.0, 5.76, 3.56 W), h12 (node voltage 6.0 V → 0.60 A), h14 (9.0 A = 3/(1‖0.5)),
  h16 ($\tau = 7.44\times10^{-15}$ s; Al $n = 3 \times 6.03\times10^{28}$), h18 (1.46e-4; 0.126; 7.9), h24 (50 °C; 5000), h28 (ρ = 2.60e-3; 1/(ne) = 3.1e-4), q08 order (8.0, 5.33, 2.67 W), q15 (3.0 mA, 1.0 mA, $V_C$ = 6.0 V).
- Order questions q08, q14, h09, h23 have exactly one order. Select-all choices in q04, q09, q15, h08 and h21 are each clearly right or wrong.
- Label markers on all five blank SVGs (wire, meters, rc, bridge, lattice) sit on the named parts.
- Superposition example (37h1 Ex. 5) directions match lesson 36's Example 3 diagram. The 3.0 Ω branch nets 0.67 A down, which matches $I_2 = -0.67$ A.
- RC two-way switch SVG: position a puts battery, R and C in one loop. Position b bypasses the battery so C discharges through R.
- 37h2 numbers: τ(Cu) 2.46e-14 s; mean free path 39 nm; Pt100 138.5 Ω → 100 °C; bulb cold R = 240/12.16 = 19.7 Ω, 6 A inrush;
  doped Si $n = 5\times10^{22}$, ρ = 1.25e-3 Ω·m, 1.6×10⁶ × lower than pure Si, 73,500 × copper; carrier ratio 1.7×10⁶;
  diode plot gives 1.1 A at 0.73 V and 0.06 A at 0.6 V. Max power in 37h1 Ex. 3 is 2.0 mW.
- Resistivities and α (OpenStax College Physics Table 20.1/20.2): Ag 1.59e-8, Cu 1.72e-8, nichrome 1.00e-6, pure Si 2.3e3 Ω·m,
  glass 1e9–1e14; α: Cu 3.9e-3, W 4.5e-3, Pt 3.93e-3, nichrome 0.4e-3. Intrinsic Si carrier density ≈ 1e16 m⁻³. Electron mobility
  ≈ 0.09–0.10 m²/(V·s) at 5e16 cm⁻³ doping (standard Si mobility curves, e.g. Sze, *Physics of Semiconductor Devices*).
- Dates and attributions: Christie 1833 / Wheatstone 1843; Helmholtz 1853 / Thévenin 1883; Drude 1900; Kamerlingh Onnes 1911
  (Hg, 4.2 K); Bednorz–Müller 1986; YBCO ≈ 93 K (1987); LN₂ 77 K; NbTi MRI magnets; IEC 60751 Pt100 (α = 0.00385, 138.51 Ω at 100 °C).
- Drills: formulas re-derived independently. For example, Drude $v_d = \mu E = E/(ne\rho)$ exactly. Each drill gives the material data it needs, so it doesn't
  depend on any other tolerance. Material data in the Drude drill (n and ρ for Ag, Au, Al) match standard tables. `relTolerance: 0.01` covers the
  worst-case 3-s.f. rounding (0.5%), and 0.6 °C tolerance covers nearest-degree rounding.
- Overlap: phys-m10's 41h1 (Hall effect) mentions holes and doped silicon briefly. It doesn't repeat 37h2's treatment. No other round 2
  lesson in this course covers Thévenin, bridges, Drude or semiconductors.

## Left as is / uncertain
- The writer flagged lesson 36's "circuit diagrams are hard to draw" sentence. It has already been replaced: line 14 now says that circuits are shown in diagrams and also described in words.
  PROGRESS.md may still say "no circuit diagrams". That's out of my scope.
- Aluminum resistivity: round 2 uses 2.65e-8 Ω·m (current handbook value at 20 °C). The round 1 drill phys-resistivity uses 2.8e-8. Both state their value, so neither is wrong.
  Consider aligning them.
- phys-m9-r2-thermometer uses the linear α model from −50 to 500 °C. Real Pt100 tables (Callendar–Van Dusen) fall about 3% below linear
  at 400 °C. The drill states its model, and the lesson calls the linear law an approximation over moderate ranges, so this is acceptable.
- Lesson 37's charging plot (round 1) has its "current I / I₀" label over the x-axis title. It's round 1 content, so I left it.
- The filament and diode I–V curves are illustrative shapes, labeled as such.
