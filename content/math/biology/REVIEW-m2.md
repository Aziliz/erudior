# Review of Biology module 2 (bio-m2): Cells

Reviewer pass, 2026-10-23. Files: lessons 06–10, questions/m02.yaml, drills/m02.yaml,
glossary-m2.yaml, cards-m2.yaml.

## What was checked
- All 57 questions worked independently before reading the key; every key correct; no second
  defensible answers found. Numeric items re-computed in Python (actual size, field of view,
  216 and 1000 volume ratios, 0.38 M interpolation, −15% vs −17.6%, Ψs −2.49 / −0.22 / −4.99 bar,
  SA:V, agar 87.5% / 57.8% / 70.4%).
- All 5 lessons read in full; worked examples re-computed (60 µm, 50 µm, 216×, −4.9 bar, 70.4%).
- All 6 drills (prompts, where clauses, answer types, solution text).
- Glossary (30) and cards (30): consistent with lessons; no term defined twice across modules.
- Cross-module: endosymbiosis dates vs lesson 30 (eukaryotes ≈2 billion years ago; lesson 8's
  "more than 1.5 billion" is consistent); Woese 1977 vs lesson 31 (consistent); antibiotic targets
  vs lesson 31 (consistent).
- Lesson 11 back-reference: it calls the Na⁺/K⁺ pump "an active transport protein from the last
  module". Lesson 9 covers it (3 Na⁺ out, 2 K⁺ in per ATP, active transport); no change needed.
- Answer positions unchanged: 14 / 14 / 14 / 15. `check-module.sh biology m2`: OK.

## Changes
Key errors: 0.

Factual / precision fixes:
1. `lessons/06-cell-theory.md`: electron microscope resolution "a thousand times finer" than a
   light microscope; 0.2 µm vs ≈1 nm is ≈200×. Now "hundreds of times finer".
2. `lessons/08-organelles.md`: "Ribosomes, made in the nucleolus" → subunits "assembled in the
   nucleolus" (final maturation is in the cytoplasm).
3. `lessons/08-organelles.md`: Palade's 1974 Nobel was shared with Claude and de Duve for work on
   cell structure and organization, not for the pulse–chase alone; reworded.
   Source: https://www.nobelprize.org/prizes/medicine/1974/summary/
4. `lessons/08-organelles.md`: chloroplast "has two outer membranes" (ambiguous) → "is wrapped in
   two membranes".
5. `lessons/09-membranes.md` Example 1: "red blood cells, whose interior is about 0.9% salt" is
   wrong (contents are mostly K⁺ and protein); now "contents are isotonic to about 0.9% NaCl".
6. `lessons/09-membranes.md`: "hospital IV fluids are isotonic saline" → "the standard hospital IV
   fluid is" (not all IV fluids are normal saline).
7. `lessons/09-membranes.md` Example 3: added that glucose uptake against its gradient in gut
   cells is powered indirectly by the Na⁺ gradient from the sodium–potassium pump (otherwise
   learners would assume an ATP-using glucose pump).
8. `lessons/10-cell-size.md`: oxygen diffusing 1 cm "minutes to hours" → "several hours"
   (t ≈ x²/2D with D ≈ 2×10⁻⁵ cm²/s gives ≈6–7 h; 10 µm ≈ 0.02 s, consistent with the lesson).

Other:
9. `drills/m02.yaml` bio-osmosis-direction solution: "potato cells are roughly isotonic to about
   0.38 M" presented a value from the lesson's illustrative data as a general fact; now says it is
   the lesson's value and real potatoes vary (roughly 0.2–0.4 M).

## NOTES-m2 items
- bio-osmosis-direction asking only for percent change: acceptable.
- bio-water-potential (honors extension): correct formula and constants; editor may keep or drop.
- Pulse–chase table labeled "simplified, representative": acceptable.
- Leeuwenhoek "up to about 270 times": confirmed (best surviving lens ≈275×).
  Source: https://micro.magnet.fsu.edu/primer/museum/leeuwenhoek.html
- Light-microscope resolution 0.2 µm, EM "≈1 nm or better", 37 mtDNA genes, alphaproteobacteria /
  cyanobacteria origins, Ivanovsky/Beijerinck 1890s, Stanley 1935, Woese 1977, Hooke 1665,
  Schleiden 1838, Schwann 1839, Virchow 1855, Gorter–Grendel 1925, Singer–Nicolson 1972,
  Frye–Edidin 1970 (≈40 min at 37 °C; little mixing at ≤15 °C; mixing not blocked by protein-
  synthesis inhibitors), Agre 1992, Gurdon 1962 / Nobel 2012: all consistent with standard
  references; no change.
- The m05 `cell''s` issue noted by the writer is outside my files; not touched.

## Could not verify / for the editor
- Nothing outstanding.
