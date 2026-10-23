# Module 3 (bio-m3, Energy in living things): writer notes

## Counts
- Lessons: 3 (11 bio-energy-atp, 12 bio-photosynthesis, 13 bio-respiration); bodies about 1,760 / 1,730 / 1,540 words excluding figures.
- Questions: 36 (`questions/m03.yaml`, bio-q-0301 to bio-q-0336): 11 / 12 / 13 per lesson; 13 `module_quiz: true` (4–5 per lesson, every topic covered). Answer positions: 0 ×9, 1 ×9, 2 ×9, 3 ×9.
- Drills: 5 (`drills/m03.yaml`): bio-photo-rate, bio-photo-mass (extra), bio-atp-yield, bio-respiration-mass, bio-fermentation-glucose (extra). Lesson 11 has no drills, as in the outline.
- Glossary: 37 entries (`glossary-m3.yaml`): 30 terms + 7 abbreviations (ATP, ADP, NADH, NADPH, G3P, FADH₂, acetyl-CoA). Every bolded term has an entry and every entry is bolded once.
- Cards: 29 (`cards-m3.yaml`).
- Figures: ATP-cycle shape (L11); chlorophyll a/b absorption curves and light-intensity rate curve (L12); ATP-by-stage bars (L13).
- `content/math/check-module.sh biology m3`: build and checker OK, zero problems.

## For the reviewer
- ATP yield taught as "about 30–32" (2.5 per NADH, 1.5 per FADH₂, glycerol-phosphate shuttle bringing it to ~30), with the older 36–38 explained. bio-atp-yield uses 2.5/1.5.
- ATP hydrolysis: 30.5 kJ/mol standard, "closer to 50 kJ/mol" in cells; glucose oxidation 2,870 kJ/mol; efficiency ~32%.
- Chlorophyll spectra in the L12 plot are smoothed Gaussians (peaks ~430/662 nm for a, ~455/642 nm for b), labelled "simplified".
- Historical details to spot-check: van Helmont figures (5 lb → ~169 lb, soil lost ~2 oz); Engelmann 1882 (filamentous green alga, aerobic bacteria); Ruben & Kamen 1941; Krebs 1937 (pigeon breast muscle); Mitchell 1961/Nobel 1978.
- L13 "Common mistakes" states lactate is not the cause of delayed-onset muscle soreness (current consensus); one question (bio-q-0336) tests this.
- Glossary terms that other modules might also bold: none duplicated at the time of checking. "electron transport chain" is defined here (L12, first use) and reused unbolded in L13. If module 2's mitochondria/chloroplast text bolds "cellular respiration" or "photosynthesis", one side should drop the bold.
- Lesson 11 refers to ATP as a nucleotide related to RNA building blocks "you met in module 1" and to the Na⁺/K⁺ pump "from the last module"; check those match what m1/m2 actually cover.

## Sources consulted
General biochemistry knowledge checked against standard references: ATP/NADH P/O ratios (2.5/1.5) and ~30–32 ATP per glucose as in current college texts (e.g. Alberts, Molecular Biology of the Cell; Berg, Biochemistry); history of photosynthesis (van Helmont, Priestley, Ingenhousz, Engelmann, Ruben–Kamen, Calvin–Benson–Bassham). All writing original. Numeric answers checked in Python.
