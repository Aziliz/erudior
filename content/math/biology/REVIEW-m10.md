# Review of module 10 (bio-m10, Ecology)

Reviewer: independent (did not write this module). Date: 2026-10-23.

## What I checked
- All 33 questions in `questions/m10.yaml`. I worked each one first and checked the numbers in Python (10% rule, NPP, Silver Springs ratios, λ growth, logistic rate, Lincoln–Petersen, Simpson's index, DDT factor). Answer positions are 9/8/8/8 (unchanged).
- Lessons 38–40, read in full. I re-did every worked example (NPP 11,000 and 44%; Silver Springs 16.2%, 11.4%, 5.5%; 50,000 × 0.1³ = 50; 3 vs 0.3 people; 65 g → 260 g/m² → 5,200 kg; 640 and 40,960 rabbits; logistic 60/60/80; trout 250; Simpson 0.69 and 0.25). I also checked the plotted logistic and predator–prey curves.
- All 9 drills, 29 glossary terms and 30 cards. No glossary term clashes with modules 1–9.
- Every item in NOTES-m10.md "For a reviewer to check".

## Changes
| File | Change | Why | Source |
|---|---|---|---|
| questions/m10.yaml (bio-q-1018) | Replaced the distractor "About 188 individuals per year" with "375 individuals per year" (divides by $N$ instead of $K$) and rewrote its explanation. The key is unchanged (index 1, ≈94). | The explanation said 188 "uses $N = 500$", but $N = 500$ gives 125, which was already another choice. 188 came from no identifiable mistake. | Arithmetic |
| lessons/38-ecosystems.md | A bear eating salmon is at "level 4 or higher, since salmon themselves eat other animals" (was "level 3 or higher"). | Salmon are at least level 3, so the bear is at least level 4. Now matches Q1009. | Trophic-level logic |
| lessons/39-cycles-populations.md, cards-m10.yaml | CO₂ in 2024: "about 424 ppm (global average)" (was "about 425 ppm"); key point and card updated to match. | WMO global mean for 2024 is 423.9 ppm. Mauna Loa's annual mean is about 424.6 ppm, and its May peak was 426.9 ppm. | WMO State of the Climate 2025 one-pager, https://wmo.int/sites/default/files/2026-03/State%20of%20the%20Climate%202025_1%20pager_final.pdf; https://climate.gov/news-features/feed/during-year-extremes-carbon-dioxide-levels-surge-faster-ever |
| lessons/39-cycles-populations.md | Haber–Bosch "now fixes roughly as much nitrogen as all natural processes on land, or more by some recent estimates". | Recent estimates of natural terrestrial BNF are lower (about 65 Tg N/yr, Vitousek et al. 2013), so industrial fixation probably exceeds it. | https://www.usgs.gov/publications/global-terrestrial-nitrogen-fixation-and-its-modification-agriculture |
| lessons/40-communities-humans.md | IUCN now reads "2026 update: nearly 50,000 of about 176,000 assessed species threatened" (was 2025: more than 45,000 of roughly 170,000). | Red List version 2026-1 is current; it lists 49,505 threatened of 175,909 assessed. | Version confirmed at https://www.iucnredlist.org/resources/summary-statistics; counts from https://www.tnpscthervupettagam.com/currentaffairs-detail/iucn-red-list-2026-update/ and https://www.chronicleindia.in/online-magazine/csce-september-2026/iucn-red-list-2026-update (the IUCN statistics page didn't load) |
| lessons/40-communities-humans.md | Forest loss: 2024 was a record 6.7 Mha with fire behind nearly half; added that loss fell to about 4.3 Mha in 2025. | The 2025 data are out. | https://www.wri.org/news/release-tropical-rainforest-loss-drops-36-2025-fires-threaten-global-progress; https://news.mongabay.com/2025/05/tropical-forest-loss-hit-new-heights-in-2024-fire-a-major-driver-in-latin-america/ |
| lessons/40-communities-humans.md | Added "2023–2025 were the three warmest years measured". 2024 still holds the record (about 1.55 °C); 2025 was 2nd or 3rd at 1.43 °C. | Brings the data up to date. | https://wmo.int/news/media-centre/2025-set-be-second-or-third-warmest-year-record-continuing-exceptionally-high-warming-trend; WMO one-pager above |
| lessons/40-communities-humans.md | The symbiosis table intro now says competition and predation are included for comparison and are not symbiosis. | The text said "three main types", but the table had five rows. | Clarity |

Totals: key errors 0 (one distractor explanation was wrong), factual errors 2 (bear trophic level, CO₂ value), outdated data 3 (IUCN, forest loss, warmest years), unclear text 2 (symbiosis table, Haber–Bosch comparison), other 1 (Q1018 distractor).

## Verified without change
- Silver Springs (Odum 1957) gross production of 20,810 / 3,368 / 383 / 21 kcal/m²/yr matches OpenStax Biology 2e Fig. 46.8 (https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems). Decomposers are 5,060 (not used).
- St. Matthew Island: 29 reindeer released August 1944, about 6,000 in 1963, 42 in 1966 (Klein). https://www.gi.alaska.edu/alaska-science-forum/when-reindeer-paradise-turned-purgatory-0
- Paine 1966: Pisaster removal led to "a decrease from a 15 to an eight-species system". https://blogs.uoregon.edu/franciso/?p=32 (summary of the abstract); https://pubs.usgs.gov/publication/70175674 (seven subordinate species crowded out).
- Fossil CO₂ of 37.4 Gt in 2024 (Global Carbon Budget 2024, https://essd.copernicus.org/articles/17/965/2025/index.html). The airborne fraction for 2014–2023 is about 48%, so "about half" holds. Pre-industrial CO₂ is about 278–280 ppm.
- 2024 warmest year at 1.55 ± 0.13 °C (WMO).
- IPBES 2019: about 1 million species at risk, and land/sea-use change is the top direct driver (https://www.ipbes.net/news/Media-Release-Global-Assessment). IPBES 2023: invasive species involved in 60% of recorded extinctions (https://www.iucn.org/press-release/202309/iucn-welcomes-intergovernmental-platforms-assessment-risk-3500-invasive-alien).
- UN WPP 2024: 8.2 billion in mid-2024, peaking at about 10.3 billion in the mid-2080s (https://www.ungeneva.org/en/news-media/news/2024/07/95264/growing-or-shrinking-what-latest-trends-tell-us-about-worlds). I found no WPP 2026 release.
- Lindeman 1942; Gause 1934; MacArthur 1958; Hudson's Bay Company lynx–hare roughly 10-year cycle and the Kluane experiments; Keeling record since 1958; DDT banned in the US in 1972; bald eagle delisted in 2007; ESA 1973; brown tree snake on Guam.
- DDT figures in Q1031 are illustrative and the stem doesn't claim a study, so that's acceptable.

## For the editor (outside my files)
- `references/bio-ref-evolution-ecology.md` gives the transfer efficiency range as "roughly 5–20%". Lesson 38, the glossary and the cards say "under 1% to around 20%" or "1–20%". Pick one; the wider range is more accurate for endotherm-dominated chains. The Simpson form in the reference sheet already matches the lessons.
- The IUCN 2026-1 counts come from two secondary reports because the IUCN statistics page didn't load. Worth confirming before release.
