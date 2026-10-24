# Round 2 notes: module phys-m8 (Electrostatics)

`content/math/check-module.sh physics phys-m8`: build and checker report zero problems
(8 lessons, 122 questions, 19 drills, 50 cards).

## Added

**Honors lessons** (3; the module has 5 dense core lessons and three distinct directions worth teaching)
- `lessons/34h1-electric-dipoles.md` (phys-m8-h-dipoles, "Honors: Electric dipoles and polar molecules",
  45 min, ~1,830 words): dipole moment and the debye, torque $pE\sin\theta$ and energy
  $-pE\cos\theta$ (checked from the two charges), far field $2kp/r^3$ / $kp/r^3$ with the algebraic
  approximation, polar vs nonpolar molecules (H₂O vs CO₂), thermal agitation vs $pE$, induced
  dipoles and the force toward stronger field (balloon and paper), $1/r^5$ scaling (labeled as a
  scaling estimate), bound charge in dielectrics, microwave ovens (labeled "not a resonance").
  Examples: torque/energy/flip work; exact vs far-field axis field; water $2pE$ vs $k_BT$.
- `lessons/34h2-millikan.md` (phys-m8-h-millikan, "Honors: Weighing the electron's charge: the
  oil-drop experiment", 45 min, ~1,780 words): background (Thomson e/m, cloud methods), apparatus,
  balancing method, terminal speed and Stokes's law, rising/falling method and charge jumps,
  finding e from data, the 1913 value and the viscosity error, the Holton/Franklin data-selection
  debate (labeled contested), Fletcher's role (labeled debated), Ehrenhaft, quarks, exact SI value.
  Examples: balanced drop; radius/mass/charge from fall time; e from five charges. Mermaid flow of
  the measurement.
- `lessons/34h3-sparks-lightning.md` (phys-m8-h-breakdown, "Honors: Sharp points, sparks and
  lightning", 45 min, ~1,940 words): electron avalanche, dielectric strength (rule of thumb),
  $V_{\max} = E_{\max}R$, connected spheres ($Q \propto R$, $E \propto 1/R$, labeled simplified),
  corona, precipitators, fair-weather field and Earth's charge, lightning stages (Mermaid), the
  initiation puzzle and charging mechanism (labeled open), lightning rods (contested claims noted).
  Examples: Van de Graaff limit; connected spheres and breakdown charge; Earth's surface charge;
  lightning energy estimate.

**Core lessons 30–34** (additions only; a sentence or two added to introduce each picture)
- 30: polarization picture (SVG); charging-by-induction flowchart (Mermaid) plus one sentence on
  why the order of steps matters; force diagram for Example 3 (```shape). The "Grounding" sentence
  now starts a new paragraph after the picture (text unchanged).
- 31: superposition procedure (Mermaid); deflection-plate picture (SVG) with a sentence before Example 4.
- 32: three Gaussian surfaces (SVG); "which surface" decision chart (Mermaid).
- 33: parallel plates with evenly spaced equipotentials (SVG); new short section "How the four
  quantities fit together" with a Mermaid diagram (F, E, U, V).
- 34: polarized dielectric in a capacitor (SVG); series/parallel circuit diagrams for Example 2
  (SVG, the course's first circuit diagrams); connected-vs-disconnected decision chart (Mermaid).

**Pictures** (16 SVG files, original, 1.5–8.6 KB each, all rendered and checked, markers checked
on every blank): phys-m8-polarization(-blank), phys-m8-crt(-blank), phys-m8-gauss-surfaces(-blank),
phys-m8-plates-equipotentials(-blank), phys-m8-capacitor-dielectric(-blank), phys-m8-cap-combos,
phys-m8-dipole-torque(-blank), phys-m8-millikan(-blank), phys-m8-connected-spheres.

**Diagrams**: 7 Mermaid (induction, superposition, Gaussian-surface choice, four quantities,
battery connected/disconnected, oil-drop procedure, lightning sequence), all with
accTitle/accDescr, all rendered; plus 1 ```shape figure.

**Questions** (67, `questions/r2-phys-m8.yaml`)
- Core phys-m8-r2-q01…q25 (5 per lesson): label 5, text 5, select-all 5, order 4, match 4, MC 2.
  module_quiz: q02, q05, q09, q10, q12, q15, q17, q20, q23, q25 (2 per lesson).
- Honors phys-m8-r2-h01…h14 (dipoles), h15…h28 (oil drop), h29…h42 (breakdown), 14 each: per
  lesson 1 text, 1 match, 1 order, 1 select-all, plus 1 label in the first two; the rest MC.
- 4-choice MC answer positions: 0: 8, 1: 7, 2: 8, 3: 7.

**Drills** (6, `drills/r2-phys-m8.yaml`): phys-m8-r2-dipole-torque, -dipole-axis (dipoles);
-oil-balance, -stokes-radius (oil drop); -breakdown-sphere, -connected-spheres (breakdown).
All answers 3 s.f. with 1% relative tolerance (or exact integer electron count).

**Glossary** (14, `glossary-r2-phys-m8.yaml`, checked against every glossary*.yaml): electric dipole
moment (alias dipole moment), polar molecule, induced dipole, bound charge, Stokes's law, electron
avalanche, dielectric breakdown, dielectric strength, Van de Graaff generator, corona discharge,
electrostatic precipitator, stepped leader, return stroke, lightning rod. "terminal velocity" is
bolded in 34h2 and links to the existing entry. I left "stable equilibrium" unbolded to avoid a
clash with other writers.

**Cards** (25, `cards-r2-phys-m8.yaml`): 9 dipoles, 8 oil drop, 8 breakdown.

## For a reviewer to double-check
- Millikan history: 1913 value $1.592\times10^{-19}$ C (≈0.6% low, viscosity of air); Nobel 1923;
  Fletcher's claim about the oil idea and authorship (from his memoir, published after his death);
  Holton 1978 / Franklin's analysis; Ehrenhaft's subelectrons put down to "problems such as
  irregularly shaped particles" (hedged). Only Wikipedia was reachable for checking (web access was
  limited); the rest is from memory and is phrased cautiously.
- The Cunningham-type correction "roughly 10%" for a 0.875 μm drop (mean free path ≈0.068 μm,
  factor ≈1 + 1.26λ/r) is approximate.
- Lightning numbers (median peak current about 30 kA, channel about 30,000 K, several to a few tens of C
  per flash, about $10^8$ V, cloud fields of a few hundred kV/m) are typical figures, stated with "about"
  or "typically"; the energy example is labeled order-of-magnitude.
- Water $p = 1.85$ D $= 6.2\times10^{-30}$ C·m; the claim that the dielectric constant of water falls
  with temperature is qualitative.
- Microwave frequency 2.45 GHz and "not a resonance" statement.
- Mermaid diagram in lesson 33 (four quantities, flowchart LR, 4 boxes) has a slightly unusual
  layout, but it reads correctly.

## Errors found in existing content
None found in the module's lessons, questions, drills, cards or glossary.

## Sources
Wikipedia "Oil drop experiment" (Millikan's value, the viscosity error, Fletcher, Holton/Franklin/
Goodstein, Nobel 1923); standard values (CODATA/SI 2019 for e); all numbers in lessons,
questions and drills were recomputed in Python (/tmp/r2-phys-m8/calc.py, calc2.py).
