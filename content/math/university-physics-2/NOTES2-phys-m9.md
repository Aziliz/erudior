# Round 2 notes: phys-m9 (Electric circuits), University Physics II

`content/math/check-module.sh university-physics-2 phys-m9`: build and checker report zero problems
(5 lessons, 76 questions, 13 drills, 33 cards, 217 glossary terms).

## Honors lessons (2; `honors: true`, module phys-m9)
- `lessons/09h1-network-methods.md` (phys-m9-h-network-methods, "Honors: Node voltages, Thévenin and
  Norton, bridges and ladders", 45 min, about 1,950 words of prose): linear circuits; node-voltage
  method with the conductance matrix; Thévenin and Norton equivalents with a linearity proof
  ($V = V_{\text{oc}} - R_{\text{th}}I$); superposition (not for power); Wheatstone bridge balance and
  the off-balance current via Thévenin; infinite ladder and the golden ratio; Mermaid "which tool"
  chart. Examples: L08 Example 3 by one node equation (V = 8.0 V); Thévenin/Norton seen by the 6.0 Ω
  resistor (9.6 V, 1.2 Ω, 8.0 A, best load 19.2 W); unbalanced bridge (1.56 mA); infinite ladder
  (1.618R; finite ladders 2, 5/3, 13/8, 34/21).
- `lessons/09h2-transients-filters.md` (phys-m9-h-transients, "Honors: Transients, oscillators and
  filters", 45 min, about 1,850 words of prose): the one-capacitor recipe derived from Thévenin
  ($\tau = R_{\text{th}}C$, continuity of $V_C$); relaxation oscillators and their period, with the 555
  timer's 1/3–2/3 thresholds (labeled simplified); sinusoidal drive of the RC low-pass solved from the
  ODE (gain, phase, cutoff, −3 dB, high-pass); two capacitors sharing charge (energy loss independent
  of R). Examples: divider + capacitor (6.0 V, 20 ms, 3.79 V and 1.74 mA at τ, 108 ms discharge through
  R₂); oscillator (84.7 ms, 11.8 Hz, first cycle 110 ms) with sawtooth plot; filter at 995 Hz cutoff
  (0.980/11.4° at 200 Hz, 0.195/78.7° at 5 kHz); two 10 μF capacitors (50 V, 0.025 J, 5.0 ms).

## Core lessons (additions only; nothing rewritten or removed)
- 07: wire picture (conventional current vs electron drift, A, L) after the current-direction
  paragraph; ohmic vs filament I–V plot (filament labeled illustrative); I(t) plot with the shaded
  8.0 C area for the existing integral example.
- 08: symbol key after the "described in words" paragraph (with a sentence saying diagrams now
  accompany the main circuits); diagrams for Example 1 and Example 3; meter-placement diagram; Mermaid
  "which method" flowchart after the Kirchhoff procedure; maximum-power plot (12 V, r = 2.0 Ω, 18 W peak).
- 09: two-way-switch RC circuit; discharge plot with half-life points; Mermaid RC-timer cycle; low-pass
  filter diagram in "RC circuits in practice".

## Pictures (17 SVGs, 2.0–6.0 KB, all rendered and inspected; blanks checked with their markers)
- Drawn new: phys-m9-thevenin-norton (+blank), -bridge, -ladder, -delay, -relaxation, -lowpass (+blank).
- Copied unchanged from the algebra-based twin (`content/math/physics/images`, same circuits and the
  same example numbers as this course's lessons 07–09): phys-m9-symbols, -series-parallel, -kirchhoff,
  -meters (+blank), -wire (+blank), -rc (+blank). Marker positions for the blanks reused and re-checked.
- Diagrams: 3 Mermaid (L08 method chart, L09 timer cycle, 09h1 tool chart), all with accTitle/accDescr,
  rendered. Plots: 7 new (L07 ×2, L08 ×1, L09 ×1, 09h2 ×2 — sawtooth and filter gain), rendered with
  src/lib/figure.ts and inspected; labels moved off curves/axis titles.

## Questions (45, `questions/r2-phys-m9.yaml`)
- Core phys-m9-r2-q01…q17 (5/6/6 for L07/L08/L09): label 3 (q01, q06, q12), text 3 (q02, q07, q13),
  match 3 (q03, q10, q16), order 2 (q08, q14), select-all 3 (q04, q09, q15), MC 3 (q05, q11, q17).
  module_quiz: q02, q04, q07, q12, q15.
- Honors 09h1 h01–h14: label 1, text 2, select-all 1, order 1, match 1, MC 8.
- Honors 09h2 h15–h28: label 1, text 2, select-all 1, order 1, match 1, MC 8. (No module_quiz flags on
  honors questions; it would be ignored.)
- Single-answer MC positions: 0: 5, 1: 5, 2: 5, 3: 4. Every numeric key and named distractor
  recomputed in Python.

## Drills (5, `drills/r2-phys-m9.yaml`, all linked from the honors lessons)
phys-m9-r2-thevenin, phys-m9-r2-bridge (09h1); phys-m9-r2-delay, phys-m9-r2-relaxation,
phys-m9-r2-lowpass (09h2). All prompts state units and 3 significant figures; relTolerance 0.01; values
shown in prompts are the exact values used (t in whole ms, f from a choice list); `where` keeps the
bridge off balance (|V| > 0.05 V), t/τ in 0.2–4, and f/fc in 0.1–10.

## Glossary and cards
- 21 terms (`glossary-r2-phys-m9.yaml`), checked against every glossary*.yaml in the course: linear
  circuit, node-voltage method, reference node, conductance, current source, Thévenin's theorem,
  Norton's theorem, open-circuit voltage, short-circuit current, superposition theorem (separate from
  the existing "superposition principle"; no "superposition" alias), Wheatstone bridge, galvanometer,
  null measurement, first-order circuit, transient, steady state, threshold switch, relaxation
  oscillator, gain, cutoff frequency, high-pass filter. Every bold term in the honors lessons has an
  entry; no new bold terms in core lessons.
- 18 cards (`cards-r2-phys-m9.yaml`): 10 for 09h1 (Network analysis), 8 for 09h2 (Circuit transients,
  RC filters).

## For a reviewer
- Lesson 08 still says "Since circuit diagrams are hard to draw here, circuits are described in words"
  (additions only); the clause is now out of date and could be deleted by whoever may edit shared text.
- 09h1 word count is near the top of the range (about 2,280 words counting front matter, alt text and
  the Mermaid block).
- History: Thévenin 1883 / Helmholtz 1853; Norton 1926 (Bell Labs) and Mayer 1926; Christie 1833 /
  Wheatstone 1843. Standard attributions, worth a second look.
- 555 timer: "thresholds at one-third and two-thirds of the supply, each charging stretch RC ln 2" is
  labeled a simplified view (in the astable circuit charging is through R_A + R_B).
- The filament I–V curve is an illustrative shape, not data.
- A third honors lesson (microscopic conduction: Drude model, semiconductors) would fit; not written.

## Errors found in existing content
None.

## Sources
Standard circuit theory (OpenStax University Physics Vol. 2, ch. 9–10, for RC and Kirchhoff context);
555 timer threshold values from manufacturer datasheets (general knowledge); all numbers recomputed in
Python.
