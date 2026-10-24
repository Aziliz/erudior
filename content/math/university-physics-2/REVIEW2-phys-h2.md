# Round 2 review: phys-h2 (Honors: Maxwell, relativity and quanta)

Reviewer for item 147. Scope: lessons 90–93, `questions/r2-phys-h2.yaml` (58), `drills/r2-phys-h2.yaml` (8),
`glossary-r2-phys-h2.yaml` (23), `cards-r2-phys-h2.yaml` (34), `images/phys-h2-*` (4 + 4 blank).
`content/math/check-module.sh university-physics-2 h2` after fixes: OK, zero problems.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| Q phys-h2-r2-h07 | Stem asked which equation shows a plane wave has "no oscillating field component along its direction of travel". The Ampère–Maxwell law's x component gives ∂E_x/∂t = 0 and Faraday's gives ∂B_x/∂t = 0, so two distractors were also defensible. | Stem now asks which equation gives ∂E_x/∂x = 0 (the lesson's step). Explanation says why the other laws don't give it. Answer unchanged. | Griffiths §9.2.2 |
| Q phys-h2-r2-h11 | `accept` missing 8.854 (ε0 = 8.854e-12 is used in the same lesson) | Added '8.854' | — |
| L93 Example 3 | Said Chamberlain and Segrè fired "protons at protons at rest". The 1955 experiment used a copper target. | Now: proton beam into a copper target; p + p → p + p + p + p̄ is the basic reaction on a nucleon at rest. Added one sentence: nucleon motion in the nucleus lowers the effective threshold somewhat. | APS News "This Month in Physics History" (Oct 2016); CERN Courier "Fifty years of antiprotons" |
| L93 Example 3 | "Bevatron built to reach about 6 GeV". Published accounts give 6.2–6.5 GeV. | Now "a little over 6 GeV" | CERN Courier (about 6.5 GeV); Wikipedia "Bevatron" (about 6.2 GeV needed) |
| L90 "Light from the equations" | "∂E_x/∂x = 0, so there is no oscillating field component along the direction of travel" skipped the time dependence. | Added a parenthetical: the x component of the Ampère–Maxwell law gives ∂E_x/∂t = 0, so any E_x is a constant field, not part of the wave. | Griffiths §9.2.2 |
| L91 polar plot | The x-axis label "x (direction of motion)" sat on the dashed circle. The "v = 0.8c" label sat next to the dashed (at-rest) circle, far from the solid curve it names. | xLabel is now "x" and the arrow reads "v (direction of motion)". "v = 0.8c" moved to (0.95, 1.45) beside the solid lobe; "at rest" nudged to (1.05, −0.95). Re-rendered: nothing overlaps. | — |
| L92 ratio plot | The y-axis label "frequency ratio" touched the point (2, 3) | y range 3.2 → 3.6 | — |
| Drill phys-h2-r2-divergence-charge | Prompt printed "1x", "-1x", "+ 1y" for unit coefficients | `{p1:coef}`, `{p2:signedcoef}`, `{p3:signedcoef}` | docs/COURSE_FORMAT.md placeholders |
| Glossary four-momentum | Alias "four-vector" would pop up four-momentum's definition for a broader term | Removed the alias | — |
| Card "How big a charge imbalance…" | The 2-in-10¹⁴ ratio depends on the wire's cross section, which the card didn't give | Added "of 1 mm² cross section" (as in the lesson) | — |

## Checked and found right (a reader might doubt these)

- **Lesson 90 numbers, recomputed in Python:**
  - Example 1: ρ = 1.59e-6 C/m³, consistent with the uniform-ball field ρr/3ε0.
  - Example 2: dE/dt = 2.88e13 V/(m·s); B = 4.8 μT; 8.0 μT at the rim.
  - c = 1/√(μ0ε0) = 2.998e8 m/s.
  - Example 3: B_z = (k/ω)E0 sin(kx − ωt), B0 = 2.0e-7 T, and ĵ×k̂ = î.
- **Maxwell history:** the displacement current came in "On Physical Lines of Force" (1861–62) through a vortex/ether model and was kept in "A Dynamical Theory of the Electromagnetic Field" (1865).
- **Lesson 91 wire argument:**
  - λ' = γλu²/c² and F' = γF are correct, as is the explanation of the factor γ by transverse force and time dilation.
  - I derived the general net density independently with relativistic velocity addition: −γ_v vI/c² for a charge moving along the conventional current. This matches the lesson's γvI/c², including the sign.
  - Directions are right in both frames: B is into the page above the wire, and the force is repulsive when the charge moves with the electrons.
- **Lesson 91 field transformations and examples:**
  - Field transformations and their compact form match Griffiths eq. 12.109.
  - Example 1: 4.8e-17 N in both frames; λ' = 3.3e-10 C/m.
  - Example 2: E'_y = −1.2 MV/m, and the force check cancels.
  - Example 3: B' = B/γ = 1.998e-3 T, and the invariant matches (−3.59e11 V²/m²).
  - Copper: about 1.4e4 C of conduction electrons per meter in a 1 mm² wire, so the imbalance is about 2.4e-14.
  - Field of a moving charge: 1/γ² ahead and γ at the sides. The plotted polar function is r = (1−β²)/(1−β² sin²θ)^{3/2}.
- **Lesson 92:**
  - Example 1: a = 1.76e18 m/s², P = 1.76e-17 W, K/P = 2.6 s. Exponential decay is right, since P ∝ K.
  - Example 2: v = 2.19e6 m/s, a = 9.05e22 m/s², P = 4.7e-8 W, and 13.6 eV/P ≈ 4.7e-11 s (the lesson says about 5e-11 s).
  - Example 3: the r² dr/dt = −(4/3)r_e²c derivation is right, and t = 1.56e-11 s.
  - Correspondence: the ratio is 3.0 at n = 2 and 1.0152 at n = 100, and the difference goes as about 3/(2n).
  - 13.6 eV/h = 3.286e15 Hz uses the course's h = 6.63e-34; with CODATA h it would be 3.2885e15, a 0.07% difference.
  - Rayleigh: (700/450)⁴ = 5.86. The simplification and the violet caveat are labeled.
  - The kink picture is J. J. Thomson's, as presented in Purcell & Morin ch. 11.
- **Lesson 93:**
  - Example 1: 135.2 MeV.
  - Threshold formula: derived again from (E_b + m_t c²)² − p_b²c² = M²c⁴.
  - Pair-production thresholds: 1.022 MeV near a nucleus (m_e/m_Pb ≈ 2.6e-6) and 4m_e c² on a free electron.
  - Antiproton: 6m_p c² = 5.63 GeV.
  - The Compton four-line derivation, including the cancellation in step 1, is right.
  - CMB: the mean photon energy is 2.70 kT ≈ 6.3e-4 eV, giving a threshold of about 4e14 eV. This is labeled a rough estimate. The highest-energy gamma rays seen so far (LHAASO, up to about 1.4 PeV) come from Galactic sources.
- **All 58 questions:** I worked each one before reading its key. Every key is right, and every distractor's stated mistake reproduces its number:
  - h04: the wire formula gives 3.0e-5 T and the rim gives 1.5e-5 T.
  - h34: 4π gives 8.5e-18 W, and c² in place of c³ gives 1.7e-9 W.
  - h47: θ = 121.25°.
  - h49: 144.7 MeV; 279.7 MeV for p + p → p + p + π0.
  - h52: 2.6e14 eV and 1.04e15 eV.
- **Order questions** (h13, h28, h43, h57): each has one valid order. **Select-all questions** (h09, h24, h39, h53) are clean, and so are the match questions.
- **Drills:** I generated 400 instances of each with the app's generator (seeded) and recomputed every answer independently in Python from the shown values.
  - All match. The 46 apparent mismatches are exact rounding ties such as 26.55 and 162.5.
  - Correct answers rounded half-even and half-up were both accepted in all 3,200 instances (0 rejected).
  - An answer 10% off was rejected in all 6,800 answer boxes.
  - Threshold-drill masses match PDG to the precision given.
  - After the fix, no prompt contains "+ -", "1x" or a thousands comma.
- **Pictures:** I rendered all four SVGs and their blank copies with the label-question markers. Every marker sits on its part.
  - Wire frames: the B direction and the ion/electron spacing are right.
  - Dipole: E_rad is drawn as −a⊥ (down-right for a up), which is correct, and the lobes follow sin²θ.
  - Bubble chamber: positron up and electron down for B into the page, from q v × B.
- **Mermaid:** all 4 diagrams were rendered. They are readable, and accTitle/accDescr cover each whole diagram. In the L91 chart, the "E equals cB" branch correctly gives null (light-wave) fields.
- **Glossary:** no duplicate terms or aliases across all of the course's glossary files. r_e matches 06h3's definition (ke²/m_e c², "not a real size").

## Overlap

None with other round-2 lessons. phys-m12's writer deliberately dropped a draft on invariant mass and thresholds because of L93 (NOTES2-phys-m12). 23h3 points to "the honors lesson on invariant mass and thresholds", which is L93. L92 bolds "classical electron radius", which is defined in glossary-r2-phys-m8.yaml, and the two agree.

## Left uncertain or for others

- The writer reports that a calc line that is a bare number (`mt: 938.3`) fails in the expression parser; `2*469.15` is a workaround. This is possibly a src/lib bug, not touched here.
- The B-loop arrow in the capacitor figure is schematic: an edge-on ellipse can't show its 3-D sense unambiguously. The text doesn't rely on it.
- The Bevatron's design energy is given as 6.2 GeV or 6.5 GeV depending on the source, so the lesson now says only "a little over 6 GeV".
