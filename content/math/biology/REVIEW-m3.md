# Module 3 review (bio-m3, Energy in living things)

## What I checked
- Lessons 11–13 read in full: thermodynamics, ATP/coupling, redox; photosynthesis history, pigments, light reactions, Calvin cycle stoichiometry, limiting factors; glycolysis, Krebs, ETC, ATP totals, fermentation. Worked examples recomputed (coupling −9.5 / +14.5 / −16 kJ/mol; 54 ATP / 36 NADPH for 3 glucose; 24 and 9 bubbles/min; 32 → ~30 ATP; 915/2870 ≈ 32%; 4 vs 60 glucose).
- All 36 questions worked before reading the key; every key correct, every distractor wrong; numbers checked in Python (0307, 0308, 0320, 0329, 0333, 0334).
- All 5 drills: prompts, answer types and solution text.
- Glossary (37) and cards (29) against the lessons; no duplicate terms with other modules' glossaries.
- Every NOTES-m3 item: ATP yield framing (2.5/1.5, ~30–32, old 36–38) is current; ATP hydrolysis 30.5 kJ/mol standard, ~50 in cells; 2,870 kJ/mol; Ruben & Kamen 1941, Engelmann 1882, Krebs 1937 (pigeon breast muscle), Mitchell 1961 / Nobel 1978 consistent with standard sources; lactate/DOMS statement matches current consensus; lesson 04 does cover nucleotides/RNA and lesson 09 the Na⁺/K⁺ pump (3 out, 2 in), so the cross-references hold.

## Changes
| File | Change | Why / source |
|---|---|---|
| lessons/12-photosynthesis.md | van Helmont dated "early 1600s; published in 1648, after his death" (was "around 1640") | He died 1644 and the work appeared posthumously in Ortus Medicinae (1648); the experiment's exact year is unknown. Figures (5 lb → ~169 lb, 200 lb soil, ~2 oz lost, 5 years) confirmed. https://faculty.csbsju.edu/ssaupe/biol115/van_helmont.htm |
| lessons/12-photosynthesis.md | Heterotrophs include "many bacteria" (was "most") | Overstated; plenty of bacteria are autotrophic and the proportion isn't something a lesson can assert. |
| lessons/13-respiration.md | "Nearly every eukaryotic cell" respires (was "Every") | A few anaerobic eukaryotes lack aerobic respiration. |
| lessons/13-respiration.md | Muscle lactate: produced when cells need ATP faster than aerobic respiration can supply (was "when oxygen delivery cannot keep up") | Older "oxygen debt" framing; muscle makes lactate even when well oxygenated, driven by glycolytic rate. |
| lessons/13-respiration.md | Lactate cleared "within an hour or so after exercise" | Softened timing. |
| questions/m03.yaml bio-q-0320 | Explanation said the "second choice" was the one-glucose amount; it is the first (the second is the key) | Explanation error. |
| questions/m03.yaml bio-q-0334 | Explanation said 44 g "forgets the factor of 6" (that would give 22 g); now names the real mistakes behind 44 g and 90 g | Explanation error. |

## Couldn't verify / for the editor
- Total ATP in the body "about 50 g" (lesson 11, bio-q-0309): consistent with the ~0.1 mol figure in Törnroth-Horsefield & Neutze 2008 (PNAS) and the ~1 body weight/day turnover on BioNumbers (https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105606); I could not open the primary paper, so the 50 g figure is from memory of that source. Some popular sources say 250 g; the "or so" hedge is kept.
- Ruben–Kamen: the textbook account is used. Later work showed oxygen exchange between CO₂ and water complicated their original data; I left that out as beyond scope.
