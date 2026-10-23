# Module 10 (Ecology), round 2 review

Reviewer: independent round 2 reviewer. Scope: new pictures and diagrams in lessons 38–40, honors lessons 40h1 and 40h2, new questions bio-q-1034 to 1048 and bio-qh-1001 to 1029, drills bio-h-*, new glossary and card entries, images/m10-*.svg, and the claims in NOTES2-m10.md.
`content/math/check-module.sh biology m10` reports OK, zero problems (5 lessons, 77 questions, 14 drills, 51 cards).

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| bio-q-1042 (select-all: what adds CO₂ to the air) | The distractor "Formation of limestone from shells" is chemically arguable. Calcification ($\text{Ca}^{2+} + 2\text{HCO}_3^- \rightarrow \text{CaCO}_3 + \text{CO}_2 + \text{H}_2\text{O}$) releases CO₂ to seawater in the short term, so a student who knows the chemistry could defend picking it. | Replaced it with "CO₂ dissolving into the ocean", which is unambiguously a removal. Updated the explanation. The answer stays [0, 2, 3, 5]. | Standard carbonate chemistry (OpenStax Chemistry 2e / Biology 2e §46.3) |
| bio-qh-1001 (beetle $q_2$) | The explanation says distractor 0.12 "divides the deaths by an original cohort of 1,000", but the stem never gave a cohort size, so the distractor and its explanation made no sense. | Stem now reads "In a cohort of 1,000 beetles, …". The key (0.40) is unchanged. | n/a (internal consistency) |
| Lesson 38, Mermaid "Where the energy in eaten grass goes" | The node "New rabbit tissue, about 10 percent" and the accDescr put the 10% as a share of the energy the rabbit *absorbs*. That figure is production efficiency, and for mammals it is only a few percent. The ten percent rule is the transfer *between trophic levels*, as the lesson text right after it says. | Node is now "New rabbit tissue: a small share". The accDescr now says only a small share of absorbed energy builds tissue and that overall roughly 10% of one level's energy reaches the next. | OpenStax Biology 2e §46.2 (production efficiency vs trophic level transfer efficiency) |
| Lesson 40h2, denitrification bullet | "reducing it through NO and nitrous oxide" skipped nitrite, the first product of nitrate reduction. | Now reads "through nitrite, NO and nitrous oxide (N₂O) to N₂". | OpenStax Microbiology / Biology 2e §46.3 |
| cards-m10, "Ocean vs land NPP" | "About half of global NPP (roughly 105 GtC per year) is in the ocean" could be read as ocean NPP = 105 GtC. | Now reads "(a total of roughly 105 GtC per year)". | Field et al. 1998 (total 104.9; ocean 48.5, land 56.4) |

## Checked and found right (things a reader might doubt)

- **Global Carbon Budget numbers.** Checked against the GCB 2024 abstract (Friedlingstein et al., ESSD 2025; Exeter repository record). The 2023 values are exactly as used: fossil 10.1, land-use change 1.0, total 11.1 GtC/yr, atmospheric growth 5.9 GtC/yr (2.79 ppm/yr), ocean sink 2.9, land sink 2.3, budget imbalance about 0. They are used in the carbon-budget image, Example 3, bio-qh-1024 and the card, and are correct in all four. 5.9 + 2.9 + 2.3 = 11.1 (the image footer). 5.9/11.1 = 0.53 and 5.9/2.12 = 2.78 ppm (vs the observed 2.79). "Recent airborne fraction about 45–50%" matches GCB decade means (about 5.2/11.0 ≈ 47% for 2014–2023). The weak 2023 land sink (El Niño, fires, drought) is also as GCB reports.
- **40h1 numbers recomputed in Python.**
  - Lizard table: $L_x$ = 700, 350, 240, 117, 27; $T_0$ = 1434, $T_1$ = 734; $e_0$ = 1.43, $e_1$ = 1.84.
  - $R_0$ = 1.147. Generation time $\sum x l_x m_x / R_0$ = 1.93 years, and $\ln R_0 / T$ = 0.071.
  - Example 4: $r$ = 0.40, $K$ = 400.
  - Example 5: $P^*$ = 40, $H^*$ = 100.
  - The predator–prey graph swings around (100, 40). The linearized period $2\pi/\sqrt{rm}$ = 9.07 years agrees with the plotted period of about 9.2, and the predator peak lags the prey peak by about 2 years in the plot.
- **40h1 history and experiments.**
  - D'Ancona was Volterra's son-in-law, and the wartime Adriatic catch data are correct.
  - Gause's *Didinium*/*Paramecium* tubes and Huffaker 1958 (oranges, barriers) are correct.
  - Endler's 1976 transplant and Reznick et al. 1990 (about 11 years, 30–60 generations) are correct. The low-predation predator (*Rivulus*) is correctly called a killifish that eats mainly juveniles.
  - MacArthur and Wilson's r/K terms date from the 1960s.
  - Kluane (Krebs et al. 1995, Science): about 1 km² plots, food ×3, predator exclusion ×2, both ×11. Correctly stated as averages over the peak and decline. The lesson does not overclaim.
  - The Lotka–Volterra competition coexistence conditions ($\alpha_{12} < K_1/K_2$, $\alpha_{21} < K_2/K_1$) are correct, as is the interpretation of $\alpha_{12}$.
- **40h2 facts.**
  - Gaarder and Gran (1927) are correctly credited for the light and dark bottle method. 1.8 × 12/32 = 0.675 mg C/L. The photosynthetic quotient caveat (slightly more than 1 O₂ per CO₂) is correct.
  - Redfield ("starting in 1934", with 106:16:1 as the later refined value) is worded acceptably.
  - Lake 226 (1973; C+N vs C+N+P), Ryther and Dunstan 1971, Martin's iron hypothesis and IronEx II 1995 (equatorial Pacific), and Elser et al. 2007 co-limitation are all correct.
  - The nitrogenase stoichiometry (16 ATP, 8 e⁻, H₂ by-product), heterocysts and leghemoglobin are correct.
  - The first cultured AOA (2005), comammox (2015), and anammox (discovered in a Delft wastewater plant in the 1990s, roughly a third to a half of marine N₂ loss) are correct.
  - N₂O is about 270× CO₂ over 100 years (AR6: 273) and is the leading remaining ozone-depleting emission.
  - Keeling curve about 315 → about 424 ppm; ice cores 180–300 ppm over 800 kyr; 2024 about 1.5 °C above 1850–1900; ocean heat uptake >90%; sea level about 0.20 m from 1901 to 2018; pH −0.1 ≈ 26% more H⁺ (10^0.1 = 1.26). All correct.
  - Global NPP about 105 GtC with the land/ocean split, and phytoplankton well under 1% of producer biomass, are both correct.
- **Questions.** I worked all 44 new questions before checking the keys. Every other key is correct, with exactly one defensible answer and every distractor actually wrong.
  - bio-qh-1005: 1.9 is correct; 1.8 omits the age-3 term, 0.475 is the mean, and 8 is the unweighted sum.
  - bio-qh-1014: species 1 wins.
  - bio-qh-1016, 1017, 1025: 1.7, 1.5 and 2.5.
  - bio-q-1047: Simpson's distractor reasoning is checked. Removing a singleton leaves $\sum n(n-1)$ unchanged and lowers $D$.
  - bio-qh-1013 / bio-qh-1023: the order sequences are unique.
  - Match and label pairings are unambiguous.
- **Pictures.** I rendered all 11 m10 SVGs, and the four label images with their markers.
  - Food web: the markers sit on Grass, Rabbit, Snake and Fungi/bacteria. In the image the rabbit eats only grass and the snake eats only the mouse, so the role keys hold.
  - Water cycle: markers 1–5 sit on the evaporation arrow, cloud, rain, transpiration arrow and runoff arrow.
  - Biomes: markers sit in tundra, boreal, desert, savanna and rainforest.
  - Survivorship: markers sit on the Type I/II/III curves.
  - The carbon cycle arrows, survivorship shapes (Type II straight on log axis), bottles and carbon budget bars are all correct. No overlaps or cut-off text.
- **Mermaid.** I previewed all six diagrams (energy fate, nitrogen cycle core, succession, hare–lynx loop, eutrophication chain, detailed nitrogen cycle). Their content is correct, the accTitle/accDescr describe the whole diagram, and they are readable.
- **Drills.** I generated and recomputed sample instances of all five.
  - bio-h-life-expectancy: the shortcut $T_0 = 500 + n_1 + n_2 + n_3 + n_4$ and $T_1 = n_1/2 + n_2 + n_3 + n_4$ equals the sum of $L_x$.
  - bio-h-life-table, bio-h-net-reproductive, bio-h-light-dark-bottle and bio-h-carbon-ppm: the formulas and tolerances are sound.
- **Glossary (26) and cards (21).** The definitions are correct.

## Left as is / uncertain

- Biome chart (m10-biomes.svg) is schematic, and the lesson and alt text say so.
  - Temperate deciduous forest is drawn up to about 220–250 cm. Real deciduous forests are mostly 75–150 cm, and the wettest temperate sites are temperate rainforest, which the chart doesn't show.
  - A thin cold, dry strip (−5 to 5 °C, under 30 cm) is shaded as temperate grassland but unlabeled.
  - Neither affects bio-q-1044, whose numbered regions are unambiguous. A future pass could cap the deciduous region nearer 200 cm or add a label to the strip.
- "Ammonia-oxidizing archaea … do much of the first step in oceans and soils": well supported for the ocean, but in soils their share relative to bacteria varies by site. The wording "much of" is acceptable.
- Anammox share "a third to a half" of marine N₂ loss: the published estimates range widely by region. It is stated as an estimate.
