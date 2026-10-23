# Module 10 (Ecology): notes

## Counts
- Lessons: 3 (38 bio-ecosystems, 39 bio-cycles-populations, 40 bio-communities-humans), about 1,620 / 1,630 / 1,690 words (prose, excluding figure JSON and table markup).
- Questions: 33 (bio-q-1001 to 1033), 11 per lesson. Answer positions: 0 ×9, 1 ×8, 2 ×8, 3 ×8. Module quiz: 13 (4 + 5 + 4), covering every topic.
- Drills: 9. The 6 from the outline (bio-ten-percent, bio-biomass, bio-exp-growth, bio-logistic, bio-mark-recapture, bio-diversity-index) plus 3 extras: bio-npp and bio-transfer-efficiency (lesson 38), and bio-pop-change (lesson 39, ΔN = B − D + I − E with percent change). So lesson 38 lists 4 drills and lesson 39 lists 4.
- Glossary: 29 terms (glossary-m10.yaml).
- Cards: 30 (cards-m10.yaml).
- Figures: an energy pyramid (shape), exponential vs logistic curves (plot), idealized predator–prey cycles (plot). Tables: Silver Springs energy data, symbiosis signs, biomes.
- `content/math/check-module.sh biology m10`: OK, zero problems.

## Decisions
- I did not bold population, community, ecosystem or biosphere. Lesson 01 covers the levels of organization. Photosynthesis and respiration are referred to, not bolded.
- I dropped "limiting factor" from my glossary because glossary-m3.yaml already defines it (for photosynthesis rates). Lesson 39 mentions it unbolded and refers back to that use. "Consumer", "food chain", "competitive exclusion principle", "nitrification", "biomagnification" and "eutrophication" are explained in the text but not bolded, to keep to the 30-term cap.
- Simpson's index uses the form $D = 1 - \sum n(n-1)/[N(N-1)]$ (the probability that two individuals are different species). The ecology reference sheet `bio-ref-evolution-ecology` should use the same form. Q1024 names 0.75 (the $1 - \sum p^2$ version) as a distractor and states the formula in the stem.
- Logistic growth is written $dN/dt = rN(K-N)/K$. Discrete exponential growth is $N_t = N_0\lambda^t$.

## For a reviewer to check
- Silver Springs figures (Odum 1957): producers 20,810, herbivores 3,368, carnivores 383, top carnivores 21 kcal/m²/yr (gross production). These are the widely cited values, given from memory. Lesson 38 and Q1008 use them.
- St. Matthew Island reindeer: 29 (1944) → about 6,000 (1963) → 42 (1966) (Klein 1968).
- Paine's Pisaster removal: species fell from 15 to 8.
- Current data, all stated as approximate with a year: CO₂ about 280 ppm before 1750 and about 425 ppm in 2024 (the Mauna Loa May 2024 peak was 426.9 ppm per NOAA/Scripps). Fossil CO₂ about 37 Gt in 2024 (Global Carbon Budget 2024), with roughly half staying in the air. 2024 was the warmest year on record at about 1.5 °C above 1850–1900 (WMO). IPBES 2019 put about 1 million species at risk and found land-use change to be the top driver. IUCN Red List 2025: more than 45,000 threatened of roughly 170,000 assessed. Tropical primary forest loss was about 6.7 million ha in 2024 (WRI/Global Forest Watch). IPBES 2023 found invasive species involved in about 60% of recorded extinctions. Human population about 8.2 billion in 2025, with a UN WPP 2024 peak of about 10.3 billion in the 2080s. Haber–Bosch fixation is described as "roughly as much as all natural processes on land", which is approximate.
- The DDT numbers in Q1031 (0.04 ppm in plankton, 10 ppm in birds) are illustrative, not from a specific study.
- Possible glossary clashes: modules 7 and 8 aren't written yet. If they bold niche, biodiversity, mutualism or parasitism, one of the two entries should be dropped.

## Sources consulted
- NOAA Climate.gov / Scripps, "During a year of extremes, carbon dioxide levels surge faster than ever" (May 2024 peak 426.9 ppm).
- Our World in Data, IUCN Red List 2025 grapher pages (number of threatened species).
- Background knowledge, checked against the standard literature: Lindeman 1942, Odum 1957, Gause 1934, MacArthur 1958, Paine 1966, Klein 1968, IPBES 2019 and 2023, WMO State of the Global Climate 2024, Global Carbon Budget 2024, UN World Population Prospects 2024.
- All numeric answers in the lessons and questions were checked in Python. Drills were generated and checked by the module checker (40 runs each).
