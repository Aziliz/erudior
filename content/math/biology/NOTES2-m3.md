# Module 3 round 2 (bio-m3, Energy in living things): writer notes

## Added
- **Honors lessons (3)**, all `honors: true`, refs `bio-ref-cell-energy`:
  - `13h1-free-energy.md` (bio-h-free-energy, 45 min, ~2,100 words): ΔG = ΔH − TΔS; ΔG°′ vs ΔG = ΔG°′ + RT ln Q; ΔG°′ = −RT ln K′; ATP at ~−52 kJ/mol in cells; hexokinase coupling (free energies add, K′ multiply); phosphoryl-transfer table; near- vs far-from-equilibrium steps; reduction potentials and ΔG°′ = −nFΔE°′. 4 worked examples. Drills bio-h-delta-g-cell, bio-h-redox-energy.
  - `13h2-chemiosmosis.md` (bio-h-chemiosmosis, 50 min, ~2,150 words of prose plus tables): complexes I–IV, Q, cytochrome c, proton counts (10/6); proton-motive force; ATP synthase rotary/binding-change, c-ring stoichiometry, P/O ratios; thylakoid chain and cyclic flow (ATP:NADPH budget); Mitchell, Jagendorf–Uribe, Racker–Stoeckenius, Boyer/Walker; uncouplers, inhibitors, brown fat, respiratory control. 3 worked examples. Drills bio-h-pmf, bio-h-atp-per-nadh.
  - `13h3-c4-cam.md` (bio-h-c4-cam, 45 min, ~2,150 words of prose plus tables): Calvin cycle carbon bookkeeping and light regulation; Calvin transient experiments; rubisco oxygenation and photorespiration; C4 (Kortschak, Hatch–Slack, Kranz anatomy, cost) and CAM; comparison table. 4 worked examples. Drills bio-h-calvin-cost, bio-h-photorespiration.
- **Core lessons improved** (no rewrites):
  - L11: energy diagram (exergonic vs endergonic, activation energy) and labeled ATP structure, both referred to in the text.
  - L12: labeled chloroplast drawing; Mermaid overview of the two stages; newly bolded **photosystem**, **rubisco**, **RuBP**, **carbon fixation** (they were used unbolded with no glossary entry).
  - L13: Mermaid map of glycolysis → Krebs → ETC / fermentation; labeled mitochondrion drawing (intermembrane space and matrix now named in the text); **substrate-level phosphorylation** now bolded.
- **Questions**: `questions/m03.yaml`
  - Core: 15 new, bio-q-0337 – bio-q-0351 (5 per lesson): label 3, match 3, order 3, text 3, select-all 3. module_quiz: 0337, 0340, 0342, 0345, 0347, 0350 (2 per lesson).
  - Honors: 40, bio-qh-0301 – bio-qh-0340 (13 / 14 / 13 per lesson): 27 four-choice (answer positions 0×7, 1×7, 2×7, 3×6), select-all 3, text 3, match 3, order 3, label 1 (13 other-type = about a third).
- **Pictures** (13 SVGs, all original, each under 8 KB): m3-atp(+blank), m3-energy-diagram, m3-chloroplast(+blank), m3-mitochondrion(+blank), m3-coupling, m3-redox-tower, m3-mito-etc(+blank), m3-thylakoid-etc, m3-c4-pathway. Blanks back the label questions 0337, 0342, 0347 and qh-0314. All rendered and checked with preview-figure.mjs (label ones with markers).
- **Mermaid diagrams (5)**: L12 two stages; L13 pathway map; 13h2 Jagendorf experiment; 13h3 Calvin carbon bookkeeping; 13h3 CAM night/day. All with accTitle/accDescr, previewed.
- **Drills (6)** in `drills/m03.yaml`: bio-h-delta-g-cell, bio-h-redox-energy, bio-h-pmf, bio-h-atp-per-nadh, bio-h-calvin-cost, bio-h-photorespiration.
- **Glossary**: 29 new terms (37 → 66): 5 for the newly bolded core terms above, 7 (13h1), 9 (13h2), 8 (13h3). Checked against every glossary-*.yaml; no duplicates.
- **Cards**: 27 new (29 → 56), 9 per honors lesson.
- `content/math/check-module.sh biology m3`: build and checker OK, zero problems.

## For the reviewer
- Numbers taken from standard biochemistry tables (Lehninger-style values): ΔG°′ hydrolysis PEP −61.9, 1,3-BPG −49.3, phosphocreatine −43.0, ATP −30.5, G6P −13.8, glycerol-3-P −9.2; glucose + Pᵢ +13.8; DHAP→G3P +7.5. E°′: NAD⁺ −0.32, pyruvate/lactate −0.19, fumarate/succinate +0.03, Q +0.045 (shown as +0.05), cyt c +0.25, O₂ +0.82 V.
- 13h1 Example 3 is framed as a generic step "about the value for DHAP → G3P", not a claim about measured in-cell ratios (measured triose-phosphate ratios sit near equilibrium).
- 13h2: proton counts 4/4/2 per electron pair; H⁺ per ATP = c/3 (+1 transport); c8 animal mitochondria, c10 yeast/E. coli, c14 spinach chloroplast; Δψ 150–180 mV, ΔpH 0.5–0.8; chloroplast linear-flow budget 12 H⁺ per 2 NADPH → 1.29 ATP/NADPH vs 1.5 needed. Complex II is shown with the "FADH₂" label of the core lesson; the text explains it is bound FAD in succinate dehydrogenase.
- 13h2 Example 3 oxygen-electrode data are labeled "illustrative".
- Jagendorf–Uribe 1966 yield "up to about one ATP per four chlorophylls" (paper abstract); acid stage described as pH 4 organic acid (succinate in the standard account).
- DNP: "sold as a diet drug in the early 1930s ... soon taken off the US market" (deliberately not dated to a specific year).
- 13h3: oxygenation:carboxylation "roughly one for every three or four" at 25 °C; photorespiration losses "a quarter or more" when hot; bundle-sheath CO₂ "several times (by some estimates up to ten times)" ambient; C4 ≈ 3% of flowering plant species and roughly a quarter of land photosynthesis; >60 independent origins; CAM ≈ 6% of species. Water lost per CO₂ fixed (500 / 250 / 50 molecules) is given as rough, often-quoted textbook figures and hedged in the lesson and card; worth a spot check. The 1815 observation of morning-sour leaves (Benjamin Heyne) is mentioned without a name.
- C4 cost 5 ATP per CO₂ assumes the NADP-malic-enzyme subtype (malate route); other subtypes differ slightly.
- Honors lessons sit at the top of the 1,300–2,200 range; 13h2 and 13h3 are slightly over 2,200 only if table cells and display equations are counted.

## Errors found in existing content
None. Existing question ids and answers unchanged.

## Sources
Standard references for values and history: Lehninger Principles of Biochemistry and Berg Biochemistry (free-energy and E°′ tables, proton stoichiometry, P/O), OpenStax Biology 2e / AP Biology (Calvin cycle, C4/CAM), Jagendorf & Uribe 1966 PNAS 55:170 (abstract via bioblast.at), Racker & Stoeckenius 1974 JBC, Noji et al. 1997 Nature, c-ring sizes (Watt et al. 2010 PNAS for c8; Seelert et al. 2000 Nature for c14), C4 statistics as summarized from Sage's reviews (Wikipedia "List of C4 plants"). All numeric answers and worked examples checked in Python. All writing and drawings original.
