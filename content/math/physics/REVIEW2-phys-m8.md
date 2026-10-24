# Round 2 review: phys-m8 (Electrostatics)

Reviewer check: `content/math/check-module.sh physics phys-m8` reports zero problems after the fixes
(8 lessons, 122 questions, 19 drills, 50 cards).

## Changes

**Answer-key / question fixes (3)**
- `phys-m8-r2-q15` (order, Gauss's law steps): "Find the enclosed charge" and "Set E·A = Qenc/ε0"
  could be done in either order (the equation can be written symbolically first), so two orders were
  defensible. Merged the last two steps into "Put the enclosed charge into E times the area = Qenc/ε0
  and solve for E" (4 items, one order); explanation adjusted.
- `phys-m8-r2-h25` (order, oil-drop steps): "Switch the field on and find the balancing voltage" could
  be done before or after the fall timing, so the order was not unique. Rewrote the stem as "fall time
  and balancing voltage have both been measured; order the calculation steps", with 4 items
  (speed → radius → mass → q = mgd/V); explanation says why the measurements aren't steps.
- `phys-m8-r2-h41` (select-all): the choice "Lowering the pressure of the surrounding air" was keyed
  wrong (lowers V_max), but in a strong vacuum breakdown gets harder again (Paschen's law), so it was
  not clearly wrong. Changed to "Moving it from sea level to a high mountaintop, where the air is
  thinner" (clearly lowers breakdown strength); key unchanged.

**Factual fixes (2)**
- 34h2 "The result and the arguments": "quoted in his 1923 Nobel lecture" → "quoted again in his Nobel
  lecture of 1924 (for the 1923 prize)". The lecture was delivered 23 May 1924 and gives
  e = 4.774(±0.005)×10⁻¹⁰ esu = 1.592×10⁻¹⁹ C (source: Millikan's Nobel lecture,
  https://www.nobelprize.org/uploads/2018/06/millikan-lecture.pdf).
- 34h3 "Dielectric breakdown": "Thin air breaks down more easily" was unqualified; added that this holds
  down to pressures far below atmospheric and that in a near vacuum breakdown becomes harder again
  (Paschen's law; standard gas-discharge result).

**Picture/figure fixes (1)**
- 30-coulomb, Example 3 ```shape: the force labels ("0.108 N" ×2, "net 0.187 N") sat on the arrows and
  the "+3.0 μC" labels touched the triangle. Moved all text into free `labels` placed beside the
  arrows and below/right of the vertices; re-rendered and checked.

**Other fixes (1)**
- 34-capacitance Mermaid (connected/disconnected): label "U = Q²/2C" → "U = Q²/(2C)" to avoid reading
  it as Q²C/2.

## Checked and found right (things a reader might doubt)
- All numbers recomputed in Python: dipole Examples 1–3 (τ = 2.0×10⁻⁷ N·m, U = −3.5×10⁻⁷ J,
  exact axis field 4.52×10³ vs 4.50×10³ N/C, 0.5% at r = 10d and ~2% at r = 5d, 2pE/k_BT ≈ 1/334,
  water ≈ 3.3×10²⁸ molecules/m³); Millikan Examples 1–3 (4.80×10⁻¹⁹ C = 3e; r = 8.75×10⁻⁷ m,
  m = 2.52×10⁻¹⁵ kg, q = 2.00e; e = 33.68/21 = 1.604); 2 μm drop falls ≈0.11 mm/s; Cunningham factor
  1 + 1.26(0.068/0.875) ≈ 1.10; buoyancy 1.2/900 ≈ 0.13%; breakdown Examples 1–4 (600 kV, 13 μC,
  8.3×10¹³ e; 50/10 nC, 4.5 kV, 4.5×10⁴ and 2.2×10⁵ V/m, 0.80 μC; σ = 8.9×10⁻¹⁰ C/m²,
  Q ≈ 4.5×10⁵ C; 10⁹ J ≈ 4 months of 100 W). 1.602176634/1.592 → 0.64% low.
- Every one of the 67 questions worked before reading the key; all keys, accept lists and distractor
  explanations correct apart from the three above. MC positions balanced.
- Physics conventions: p from − to +; U = −pE cos θ derivation from the two charges; bisector field
  kp/r³ opposite to p; field arrows/plate signs consistent in the CRT, plates, capacitor-dielectric,
  Millikan (top plate + for a negative drop) pictures; induction order (ground off before rod away).
- History: Thomson e/m 1897; Holton 1978 notebooks study; Franklin's reanalysis (little change in e,
  larger uncertainty); Fletcher's posthumous memoir claim (labeled debated); Ehrenhaft in Vienna;
  e exact since 2019 SI; Feynman's remark on the drift of e values ("Cargo Cult Science").
- Lightning: graupel–ice charging (labeled leading, still researched); ~90% of CG flashes lower
  negative charge; median peak ≈30 kA, ≈30,000 K; in-cloud fields a few hundred kV/m; Franklin's rods
  1750s; fair-weather field ~100 V/m down, ground negative. Microwave 2.45 GHz not a resonance (correct).
- All 16 SVGs rendered; text readable, nothing cut off; every label marker on the part it names
  (q01, q06, q11, q16, q21, h14, h27). All 7 new Mermaid diagrams rendered and readable with full
  accTitle/accDescr; the lesson 33 LR diagram's layout is unusual but reads correctly.
- Drills: formulas recomputed independently; oil-balance checked over all 1,480 valid inputs (rounded
  voltage always gives back the integer electron count); 1% relTolerance accepts every correct
  3-s.f. answer and rejects clearly wrong ones.
- Glossary: no term or alias duplicates any glossary*.yaml in the course ("electric dipole" exists;
  "electric dipole moment" is distinct). Cards correct.

## Overlap
- 41h1-charged-particles covers Thomson's e/m and mentions Millikan in one sentence; complementary,
  no contradiction. No other round 2 lesson covers dipoles, the oil-drop experiment or lightning.

## Left uncertain
- "Water absorbs microwaves a few centimeters into food" is a typical penetration-depth figure
  (≈1–2 cm in water, more in drier food); stated loosely but not wrong.
- Lightning numbers (charge per flash, 10⁸ V) are order-of-magnitude and already labeled as such.
- Round 1 plot in lesson 32 (solid-sphere field) has its "outside" label sitting on the curve; out of
  scope, not changed.
