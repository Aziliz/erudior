# Module 10 (Ecology), round 2: notes

`content/math/check-module.sh biology m10` reports OK, zero problems. The build is 5 lessons, 77 questions, 14 drills and 51 cards.

## Honors lessons (new)
- `lessons/40h1-population-models.md` (bio-h-population-models): about 2,190 words of prose, 45 min. It covers cohort life tables ($l_x$, $d_x$, $q_x$, $L_x$, $T_x$, $e_x$) and survivorship curves (log scale, with caveats). It also covers $R_0 = \sum l_x m_x$ with a generation-time approximation, r/K selection and its caveats (continuum; the Endler/Reznick guppy transplant), and density dependence (estimating $r$ and $K$ from per capita data). Last come Lotka–Volterra predation (isoclines $P = r/a$ and $H = m/(ab)$, neutral cycles, Gause's Didinium, Huffaker's mites, D'Ancona) and competition with the coexistence conditions, plus the hare–lynx data story with its caveats and the Kluane results. There are 5 worked examples.
- `lessons/40h2-ecosystem-ecology.md` (bio-h-ecosystem-ecology): about 1,890 words, 45 min. It covers GPP, NPP and NEP (eddy-flux towers, global NPP about 105 GtC/yr split land/ocean), the light and dark bottle method with its caveats, and nutrient limitation (Liebig, Redfield 106:16:1, Lake 226, Ryther and Dunstan, IronEx II, Elser 2007 co-limitation) and eutrophication. The nitrogen cycle is covered in detail: nitrogenase at 16 ATP, heterocysts and leghemoglobin, AOA, comammox, denitrification and N₂O, and anammox. It ends with the 2023 global carbon budget and the lines of evidence for human-caused climate change. There are 3 worked examples.

## Core lessons (improved, existing text kept)
- 38: food web picture (`m10-food-web.svg`) with a short paragraph about trophic levels in the web; Mermaid flowchart showing where eaten energy goes.
- 39: water cycle picture (`m10-water-cycle.svg`), carbon cycle picture (`m10-carbon-cycle.svg`), and a Mermaid nitrogen cycle, each introduced in the text.
- 40: Mermaid diagram of primary and secondary succession; a biome climate chart (`m10-biomes.svg`, temperature against precipitation, labeled as a simplified sketch).

## Questions (44 new)
- Core bio-q-1034 to 1048, 5 per lesson. By type: label 3 (food web, water cycle, biomes), text 3, order 3, match 3, select-all 3. Module quiz: 1034, 1039, 1043, 1044.
- Honors bio-qh-1001 to 1015 (40h1) and bio-qh-1016 to 1029 (40h2), 29 in total:
  - 19 four-choice, with answer positions 0×5, 1×5, 2×5, 3×4.
  - 10 other types: text 3, match 2, order 2, select-all 2, label 1.
  - No `module_quiz` (core-module honors lessons).
- Existing questions were not changed. I found no errors in them.

## Pictures and diagrams
- SVGs (all original, 2–13 KB): m10-food-web, m10-carbon-cycle, m10-water-cycle and m10-water-cycle-blank, m10-biomes and m10-biomes-blank, m10-survivorship and m10-survivorship-blank, m10-predator-prey-model, m10-light-dark-bottles, m10-carbon-budget.
- The predator–prey graph is an RK4 simulation of the model in Example 5 ($r = 0.8$, $a = 0.02$, $b = 0.3$, $m = 0.6$). Prey cycle 57–160 and predators 25–60, with a period of about 9.2 years and a predator lag of about 1.9 years.
- The food web image is used both in the lesson and in the label question. The markers sit beside the organism names, the labels are trophic roles, and no roles are printed in the image.
- Mermaid: energy fate (38), nitrogen cycle (39), succession (40), hare–lynx loop (40h1), eutrophication chain and detailed nitrogen cycle (40h2).
- Every image and diagram was rendered and checked, including the label markers. The preview PNGs were deleted.

## Drills (5 new)
- bio-h-life-table ($l_x$, $q_x$), bio-h-life-expectancy ($e_0$, $e_1$) and bio-h-net-reproductive ($R_0$) are linked from 40h1.
- bio-h-light-dark-bottle (R, net, GPP) and bio-h-carbon-ppm (GtC staying in the air and the ppm rise) are linked from 40h2.

## Glossary and cards
- 26 new glossary terms: life table, cohort, life expectancy, survivorship curve, fecundity, net reproductive rate, life history, r-selected species, K-selected species, Lotka–Volterra model, competition coefficient, intraspecific competition, gross primary productivity, net ecosystem production, light and dark bottle method, limiting nutrient, Redfield ratio, eutrophication, nitrogenase, ammonification, nitrification, anammox, airborne fraction, carbon sink, greenhouse effect, ocean acidification.
- I grepped every glossary file first. I left an "R0" alias off "net reproductive rate" because glossary-h3 uses it for the basic reproduction number.
- Eutrophication and nitrification were unbolded in the core lessons, so I bolded them in 40h2.
- 21 new cards (40h1: 11, 40h2: 10).

## For a reviewer to double-check
- Global Carbon Budget 2024 values for 2023 (GtC/yr): fossil 10.1, land-use change 1.0, atmospheric growth 5.9 (2.79 ppm), ocean 2.9, land 2.3. These are used in the carbon-budget image, Example 3, bio-qh-1024 and a card. Recent airborne fraction is given as "about 45–50%".
- Kluane: about 3× with food, 2× with predator exclusion and 11× with both, averaged over the peak and decline (UBC Reports summary of Krebs et al. 1995). Krebs has since written that food addition alone did not change the timing of the cycle, and the lesson does not claim it did.
- Guppy transplant: Endler moved the guppies in 1976, and Reznick et al. (1990) reported the evolved changes about 11 years later. The question says "about 30–60 generations".
- From memory, all standard: Redfield ratio first reported in 1934 and refined later; Lake 226 in 1973; Ryther and Dunstan 1971; IronEx II in 1995; Elser et al. 2007; AOA first cultured in 2005; comammox in 2015; anammox estimated at a third to a half of oceanic N₂ loss; N₂O GWP100 about 270 (AR6: 273); global NPP about 105 GtC/yr (Field et al. 1998); ice-core CO₂ 180–300 ppm over 800 kyr; sea level about 20 cm from 1901 to 2018; ocean pH down about 0.1.
- The light and dark bottle numbers, the lizard life table, the bird density data and the nutrient-bioassay data are illustrative, not from specific studies.
- Biome chart: the region boundaries are schematic. Desert is drawn below 25 cm and tropical rainforest above 200 cm, matching the table in lesson 40, and the alt text and lesson text call it a simplified sketch.
- The hare–lynx caveat that the hare series was "pieced together from several sources" follows the usual account of MacLulich's compilation and is worded loosely on purpose.

## Sources
- Global Carbon Budget 2024 (Friedlingstein et al., ESSD 2025), abstract via https://archimer.ifremer.fr/doc/00943/105466.
- Krebs, Kluane results: https://archive.news.ubc.ca/ubcreports/1997/97feb06/krebs.html; Krebs, "The snowshoe hare 10-year cycle – a cautionary tale": https://www.zoology.ubc.ca/~krebs/ecological_rants/the-snowshoe-hare-10-year-cycle-a-cautionary-tale/.
- Background, checked against the standard literature: OpenStax Biology 2e chapters 45–46; Lotka 1925; Volterra 1926; Gause 1934; Huffaker 1958; MacArthur and Wilson 1967; Reznick et al. 1990; Schindler 1974; Ryther and Dunstan 1971; Martin 1990 and Coale et al. 1996; Elser et al. 2007; Field et al. 1998; Daims et al. and van Kessel et al. 2015; Strous et al. 1999; IPCC AR6 WG1; WMO State of the Global Climate 2024.
- Every number in the lessons and questions was checked in Python. The checker generated every drill 40 times.
