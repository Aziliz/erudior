# Module 3 round 2 review (bio-m3, Energy in living things)

Scope: additions to core lessons 11–13 (pictures, Mermaid diagrams, new sentences, newly bolded
terms), honors lessons 13h1–13h3, questions bio-q-0337–0351 and bio-qh-0301–0340, drills
bio-h-*, the 29 new glossary terms and 27 new cards, all 13 `images/m3-*.svg`, and 5 Mermaid
diagrams. I worked every question before reading its key, recomputed every number in Python,
rendered every image (label images with their question's markers) and every diagram.
`content/math/check-module.sh biology m3`: build and checker OK, zero problems, after fixes.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| 13h2, "How many ATP per NADH?" | Said "yeast need 4.33 H⁺ per ATP, so NADH is worth 2.3". The c10 ring is from *S. cerevisiae*, which has no complex I, so its NADH does not move 10 H⁺. A student would learn a wrong yeast number. | Reworded as a synthase with a 10-subunit ring (as in yeast mitochondria): 10 H⁺ buy 2.3 ATP. Added a note that baker's yeast lacks complex I, so its NADH yields even less. | Lehninger / Berg; yeast Ndi1 replaces complex I |
| 13h2, experiments paragraph | "Boyer shared that year's Nobel Prize in Chemistry with John Walker" left out Jens Skou, who got the other half of the 1997 prize. | Now: Boyer and Walker shared half of the prize; the other half went to Skou (Na⁺/K⁺ pump). | nobelprize.org, 1997 Chemistry |
| 13h1, Example 3, step 3 | Example is set at 37 °C, but K′ was computed with RT = 2.48 (25 °C). | Uses 2.577 now: K′ = e^(−7.5/2.577) = 0.054, still "about 0.05". Conclusion unchanged. | Recomputed |
| bio-qh-0324 (text) | The accept list was missing correct names for the combined electrical and pH gradient. | Added `Δp`, `electrochemical gradient`, `electrochemical proton gradient`, `proton electrochemical gradient`. | — |
| bio-qh-0335 explanation | Said "away from the leaf surfaces", which is vague. The point is the leaf's air spaces. | Now "away from the leaf's air spaces". | — |
| drill bio-h-atp-per-nadh prompt | When `tr = 0` the prompt said "in a mitochondrion, 0 extra H⁺ per ATP is spent on transport". That suggests mitochondria can skip the transport cost. | The prompt now says to count {tr} H⁺ for transport, and that 0 means the transport cost is left out. Answers unchanged. | — |
| images/m3-coupling.svg | The figure says "drawn to scale", but each arrowhead ran 6 px (about 1.5 kJ/mol) past its target level. | Arrow ends now sit exactly on the target levels (4 px per kJ/mol: 13.8, 30.5 and 16.7). Re-rendered. | — |
| 13h3 Calvin-cycle Mermaid | It was a 5-box `flowchart LR` chain. AUTHORING says chains longer than four boxes use TD, because LR gets too wide on a phone. | Changed to `flowchart TD`. Re-rendered: readable, cycle arrow is clear. | AUTHORING.md |

Counts: answer-key errors 0; factual fixes 3 (yeast P/O, 1997 Nobel, Example 3 temperature);
picture fixes 1 (coupling arrows); other fixes 4 (0324 accept list, 0335 wording, drill
prompt, Mermaid direction).

## Checked and found right (a reader might doubt these)

- **Thermodynamics (recomputed):**
  - RT is 2.577 kJ/mol at 310 K and 2.478 at 298 K. At 25 °C, 5.71 kJ/mol is one factor of 10 in K′. K′ for ATP hydrolysis is e^(30.5/2.48) = 2.2×10⁵.
  - Example 1: Q = 2.0×10⁻⁴, RT ln Q = −21.95, ΔG = −52.4 kJ/mol.
  - Example 2: K′ goes from 0.0038 to 841; the ratio is 2.2×10⁵.
  - Example 3: ΔG = −4.37 kJ/mol.
  - PEP + ADP gives −31.4; G6P gives +16.7, glycerol-3-P +21.3, creatine +12.5.
  - The hydrolysis values (−61.9, −49.3, −43.0, −30.5, −13.8, −9.2) and +7.5 for TPI match Lehninger.
- **Reduction potentials:** −0.32, −0.19, +0.03, +0.045, +0.25 and +0.82 V match standard tables.
  - NADH → O₂: ΔE = 1.14 V, ΔG = −220.0 kJ/mol. Succinate → O₂: ΔG = −152.5. 220/30.5 = 7.2, "about seven times".
  - The redox-tower SVG is plotted to scale (300 px/V); all four points sit at their stated values.
- **Proton counts and P/O:**
  - 4/4/2 H⁺ per electron pair (10 from NADH, 6 from succinate). 61.5 mV per pH unit = 2.303RT/F at 310 K.
  - Example 1 (13h2): Δp = 200 mV, 19.3 kJ/mol per H⁺, at least 2.59 H⁺ per ATP.
  - 8/3 = 2.67. 10/3.667 = 2.73 and 10/4.333 = 2.31.
  - Chloroplast budget: 12 H⁺ ÷ (14/3) = 2.57 ATP per 2 NADPH, or 1.29 per NADPH, against 1.5 needed.
  - Ring sizes c8 (bovine), c10 (yeast, *E. coli*) and c14 (spinach) are right.
- **History:** Jagendorf & Uribe 1966 gave "1 ATP for every 4 chlorophylls" (confirmed in the PNAS abstract), so the lesson is right. Also checked Mitchell (1961, Nobel 1978), Racker–Stoeckenius 1974 (bacteriorhodopsin from an archaeon), Noji et al. 1997 rotation, DNP in the 1930s (deliberately undated), and Kortschak / Hatch–Slack in the mid-1960s.
- **13h3 numbers:**
  - Carbon bookkeeping (15 + 3 = 18) is right. Cost is 9 ATP + 6 NADPH per G3P. Regeneration uses ATP only.
  - Calvin transients go the right way: dark gives 3-PGA up and RuBP down; no CO₂ gives the opposite.
  - The photorespiration salvage releases 1 CO₂ per 2 oxygenations. Example 2: 340 net, 15% lost.
  - C4 cost is 5 ATP (PPDK makes AMP, so 2 ATP equivalents). C3 vs C4 per glucose: 18 vs 30 ATP.
  - Water figures 500/250/50 match Taiz & Zeiger's transpiration ratios and are hedged in the lesson. They give 3,000/1,500/300 mol, or 54/27/5.4 kg.
  - Stated as approximate and right: C4 is about 3% of species, about a quarter of land GPP, and has more than 60 origins; CAM is about 6%.
- **Questions:** all 55 new questions have exactly one defensible answer, and every distractor's stated error reproduces.
  - Checked by hand: qh-0303 (e^4.6 = 99), qh-0304 (−6.88), qh-0308 (−71.4; −35.7 for n = 1; −52.1 for the subtraction slip), qh-0317 (199.2 / 150.8 / 100.8 / 49.2) and qh-0331 (450).
  - The select-all sets 0340, 0345, 0350, qh-0312, qh-0327 and qh-0340 are complete.
  - Order items in 0341, 0343, 0348, qh-0313, qh-0326 and qh-0338 are uniquely ordered.
- **Pictures:**
  - ATP: the base attaches to ribose through the five-membered ring and phosphates sit on the C5′ side, with the ring O between C4′ and C1′.
  - Chloroplast and mitochondrion: the crista interiors connect to the intermembrane space.
  - Mitochondrial ETC: c is on the intermembrane-space face, F₁ is in the matrix, O₂ is reduced on the matrix side.
  - Thylakoid ETC: water is split into the lumen, b₆f pumps into the lumen, the ATP synthase head is in the stroma, and NADPH is made in the stroma.
  - C4 pathway: shown as the NADP-ME subtype.
  - All label markers (0337, 0342, 0347, qh-0314) sit on the named part. No overlaps or clipping.
- **Mermaid:** 5 diagrams. Content and accTitle/accDescr are correct and complete. The L13 pathway map has the right totals (26–28 ATP from the ETC = 30–32 − 4).
- **Drills:** sampled all 6 in Python. Answers, tolerances and solutions agree. The redox drill always has the acceptor potential ≥ the donor potential.
- **Glossary and cards:** all 29 new terms and 27 new cards are correct.

## Left uncertain / not changed

- The Δp split (Δψ 150–180 mV, ΔpH 0.5–0.8) and "isolated thylakoids about 3 pH units" are typical textbook ranges. The lesson already says the in-leaf split is still studied.
- The coupling figure's "uphill: will not go" is a standard-conditions statement. It's fine with the caption, so I left it.
- The L13 flowchart preview is taller than the preview canvas and crops at the bottom. That's a preview-tool limit; the diagram itself is fine at 9 nodes.
