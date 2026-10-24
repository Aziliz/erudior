# Round 2 notes: phys-m9 (Electric circuits)

`content/math/check-module.sh physics phys-m9`: build and checker report zero problems
(5 lessons, 78 questions, 15 drills, 36 cards).

## Added

**Honors lessons** (2; `honors: true`, module phys-m9)
- `lessons/37h1-network-analysis.md` (phys-m9-h-network-analysis, "Honors: Dividers, bridges and
  equivalent circuits", 45 min, about 1,900 words): linear circuits, the voltage divider and its
  loading, the Wheatstone bridge (derivation of $R_1/R_2 = R_3/R_x$, null detection, Christie 1833 /
  Wheatstone 1843), Thévenin's theorem (open-circuit voltage, $R_{\text{th}}$ with batteries replaced
  by wires, $V_{\text{oc}}/I_{\text{sc}}$ check; Thévenin 1883, Helmholtz 1853), voltmeter and
  ammeter loading, superposition (re-solves lesson 36's Example 3; not for power).
  Examples: balanced bridge (330 Ω); strain-gauge bridge (50 mV); Thévenin of a 12 V 6k/3k divider
  with 2.0 kΩ and 6.0 kΩ loads; 10 MΩ vs 1.0 MΩ voltmeter on a megohm divider; superposition.
- `lessons/37h2-conduction.md` (phys-m9-h-conduction, "Honors: Inside a conductor: metals,
  semiconductors and superconductors", 45 min, about 2,100 words incl. table): $J = \sigma E$, the
  Drude model ($v_d = eE\tau/m$, $\rho = m/ne^2\tau$, mobility), why the classical model is
  simplified (quantum scattering from vibrations/defects only), temperature coefficient,
  superconductors (Onnes 1911; YBCO about 90 K), semiconductors, holes, thermistors, doping (n-type,
  p-type), p–n junctions, diodes, LEDs. Examples: copper τ = 2.5×10⁻¹⁴ s, μ, drift speed (matches
  lesson 35's 7.4×10⁻⁵ m/s), mean free path about 40 nm; Pt100 thermometer (138.5 Ω → 100 °C);
  bulb cold resistance/inrush; 1 ppm phosphorus-doped silicon.

**Core lessons** (additions only; nothing rewritten)
- 35: wire picture (conventional current vs electron drift, L, A); I–V plot (ohmic vs filament,
  labeled illustrative); I–t plot with shaded areas for Example 3.
- 36: circuit-symbol key (SVG) with two introductory sentences; circuit diagrams for Example 1,
  Example 3 (Kirchhoff) and Example 4 (bulbs); ammeter/voltmeter placement diagram; "which method"
  Mermaid flowchart; load-power vs load-resistance plot for maximum power transfer.
- 37: RC circuit with two-way switch (charge/discharge); discharge plot with half-life points;
  circuit diagram for Example 3; "just after / long after" Mermaid flowchart. Front matter now also
  lists drill phys-m9-r2-rc-snapshot.

**Pictures** (16 SVGs, original, 2.4–5.7 KB each, all rendered and checked, blank versions checked
with their markers): phys-m9-wire(+blank), -symbols, -series-parallel, -kirchhoff, -meters(+blank),
-bulbs, -rc(+blank), -rc-delay, -bridge(+blank), -thevenin, -lattice(+blank). These are the course's
first circuit diagrams.

**Diagrams** (4 Mermaid, all with accTitle/accDescr, rendered): method choice for DC circuits
(L36), capacitor snapshots (L37), finding a Thévenin equivalent (37h1), pure silicon to diode/LED
(37h2). **Plots** (6 new figure blocks): L35 ×2, L36 ×1, L37 ×1, 37h2 ×1 (diode I–V, illustrative),
plus the existing ones.

**Questions** (44, `questions/r2-phys-m9.yaml`)
- Core phys-m9-r2-q01…q16 (5/6/5 per lesson): label 3 (q01, q06, q12), text 3 (q02, q07, q13),
  match 3 (q03, q10, q16), order 2 (q08, q14), select-all 3 (q04, q09, q15), MC 2 (q05, q11).
  module_quiz: q01, q04, q06, q08, q12, q16.
- Honors phys-m9-r2-h01…h14 (37h1): 8 MC, text 2, select-all 1, order 1, match 1, label 1.
- Honors phys-m9-r2-h15…h28 (37h2): 8 MC, label 1, text 2, select-all 1, match 1, order 1.
- Answer positions of the 18 single-answer MC: 0: 5, 1: 5, 2: 4, 3: 4.

**Drills** (7, `drills/r2-phys-m9.yaml`): phys-m9-r2-rc-snapshot (L37), phys-m9-r2-bridge,
phys-m9-r2-thevenin, phys-m9-r2-loading (37h1), phys-m9-r2-drude, phys-m9-r2-thermometer,
phys-m9-r2-doped (37h2). All prompts state rounding; relTolerance 0.01 for 3 s.f. answers,
tolerance 0.6 for the nearest-degree temperature.

**Glossary** (25 new terms, `glossary-r2-phys-m9.yaml`, checked against every glossary*.yaml):
linear circuit, voltage divider, Wheatstone bridge, galvanometer, Thévenin's theorem, open-circuit
voltage, short-circuit current, loading effect, superposition theorem, conductivity, Drude model,
mean free time, mean free path, mobility, temperature coefficient of resistivity, critical
temperature, semiconductor, hole, thermistor, doping, n-type, p-type, p–n junction, diode,
light-emitting diode. Every bolded term in the honors lessons has an entry (no new bold terms in
core lessons). "superposition theorem" is a separate entry from the existing "superposition
principle" (fields/waves).

**Cards** (21, `cards-r2-phys-m9.yaml`): 9 for 37h1, 11 for 37h2, 1 for lesson 37.

## For a reviewer to double-check
- Lesson 36 still says "Since circuit diagrams are hard to draw here, circuits are described in
  words" (I made additions only). With diagrams now present, that clause should be deleted by
  whoever may edit shared text; also PROGRESS.md's note "Circuits are described in words (no circuit
  diagrams)" is now out of date.
- Aluminum resistivity: I used 2.65×10⁻⁸ Ω·m (20 °C handbook value) in h16 and the Drude drill; the
  existing drill phys-resistivity uses 2.8×10⁻⁸ (an older textbook value). Not changed; consider
  aligning.
- Approximate figures, labeled as such in the text: copper mean free path (uses the ~1.6×10⁶ m/s
  Fermi speed), pure-silicon carrier density 10¹⁶ m⁻³ and resistivity ~2×10³ Ω·m, electron mobility
  0.10 m²/(V·s) at 5×10²² m⁻³ doping, tungsten cold resistance via the linear α formula over 2,500 °C
  (labeled rough), LED forward voltages, YBCO "about 90 K".
- The diode and filament I–V curves are illustrative shapes, not data.
- h18's 7.3×10⁻⁵ m/s distractor is the lesson's value at half the field (a deliberate "used the
  example's number" trap).

## Errors found in existing content
None.

## Sources (facts checked)
OpenStax College Physics / University Physics Vol. 2 (resistivity and temperature-coefficient
tables, Drude/microscopic Ohm's law); CODATA values for $e$ and $m_e$; IEC 60751 Pt100
(α = 0.00385, 138.5 Ω at 100 °C); standard histories of the Wheatstone bridge (Christie 1833,
Wheatstone 1843), Thévenin's theorem (Helmholtz 1853, Thévenin 1883), superconductivity
(Kamerlingh Onnes 1911, mercury 4.2 K; Bednorz–Müller 1986; YBCO 1987). All numbers recomputed in
Python.
