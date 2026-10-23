# Round 2 notes: module m2 (Cells)

`content/math/check-module.sh biology m2`: build and checker report zero problems
(7 lessons, 112 questions, 9 drills, 50 cards).

## Added

**Honors lessons**
- `lessons/10h1-endomembrane.md` (bio-h-endomembrane, 45 min, ~2,300 words incl. tables): signal
  hypothesis and SRP, ER folding/glycosylation/quality control (CFTR ΔF508), COPII/COPI/clathrin,
  Rabs and SNAREs (botulinum/tetanus), cis/trans Golgi, sorting signals (default secretion, KDEL,
  mannose-6-phosphate, I-cell disease), receptor-mediated endocytosis (LDL, familial
  hypercholesterolemia), endosomes, autophagy, the three cytoskeleton fibers, dynamic instability,
  kinesin/dynein/myosin, cilia (9 + 2, primary ciliary dyskinesia), colchicine/paclitaxel.
  Examples: engineered GFP destinations; ordering steps with Schekman-style double mutants;
  axon transport time and kinesin step count.
- `lessons/10h2-cell-signaling.md` (bio-h-cell-signaling, 45 min, ~1,800 words): signaling
  distances, Sutherland and the three stages, GPCRs and G proteins, RTKs (Ras, MAP kinase
  cascade), ligand-gated ion channels, intracellular receptors, $K_d$ and receptor occupancy,
  kinases/phosphatases, second messengers (cAMP, IP₃/Ca²⁺), amplification, specificity
  (epinephrine in liver, heart, vessels), switching off, cholera toxin, Ras in cancer.
  Examples: Sutherland's fractions; occupancy at 2, 6, 18 nM; amplification cascade; cholera.

**Core lessons 06–10**: pictures/diagrams added and referred to in the text, nothing rewritten.
- 06: timeline of cell theory (Mermaid), swan-neck flasks (SVG), labeled compound microscope (SVG)
  with a new short paragraph on microscope parts and the light path.
- 07: labeled bacterial cell (SVG), classification key (Mermaid flowchart).
- 08: labeled animal cell and labeled plant cell (SVG), secretory pathway (Mermaid).
- 09: labeled fluid mosaic membrane (SVG), tonicity grid for red blood cells and plant cells (SVG),
  transport decision flowchart (Mermaid).
- 10: SA:V cubes (SVG), agar cube cross-sections (SVG), levels of organization (Mermaid).

**Pictures** (19 SVGs, all original, each under 40 KB, all rendered and checked):
m2-animal-cell, m2-animal-cell-blank, m2-plant-cell, m2-plant-cell-blank, m2-microscope,
m2-microscope-blank, m2-swan-neck, m2-prokaryote, m2-prokaryote-blank, m2-membrane,
m2-membrane-blank, m2-tonicity, m2-sa-cubes, m2-agar-cubes, m2-endomembrane, m2-cytoskeleton,
m2-cytoskeleton-blank, m2-gpcr, m2-gpcr-blank. Blank versions are for label questions.

**Diagrams** (9 Mermaid): cell theory timeline, cell classification key, secretory path,
transport decision tree, levels of organization, SRP targeting, three stages of signaling, RTK
pathway, amplification cascade. All have accTitle/accDescr and were rendered.

**Questions** (52 new)
- Core, bio-q-0258…0283 (26; 5–6 per lesson, each lesson has a text, a match or order, a label
  where there is a structure, and a select-all question): label 5 (0258, 0263, 0268, 0269, 0274), text 5 (0259,
  0265, 0273, 0276, 0279), match 4 (0264, 0271, 0275, 0281), order 3 (0260, 0270, 0280),
  select-all 5 (0261, 0266, 0272, 0277, 0282), MC 4 (0262, 0267, 0278, 0283).
  module_quiz: 0259, 0263, 0268, 0274, 0278, 0280.
- Honors, bio-qh-0201…0215 (endomembrane, 15: 10 MC, 1 text, 1 match, 1 order, 1 label,
  1 select-all) and bio-qh-0216…0229 (signaling, 14: 9 MC, 1 text, 1 match, 1 order, 1 label,
  1 select-all). No module_quiz (core-module honors lessons).
- Answer positions of the 23 new 4-choice MC questions: 0: 6, 1: 6, 2: 5, 3: 6.

**Drills** (3, in drills/m02.yaml): bio-h-axon-transport (endomembrane), bio-h-receptor-occupancy
and bio-h-amplification (signaling).

**Glossary** (31 new terms in glossary-m2.yaml, checked against every glossary-*.yaml, no
duplicates): endomembrane system, cytoskeleton, signal sequence, signal recognition particle,
glycosylation, SNARE, mannose-6-phosphate, receptor-mediated endocytosis, endosome, autophagy,
microtubule, intermediate filament, microfilament, dynamic instability, motor protein, ligand,
receptor, signal transduction, G protein-coupled receptor, G protein, receptor tyrosine kinase,
ligand-gated ion channel, intracellular receptor, dissociation constant, protein kinase, protein
phosphatase, phosphorylation cascade, second messenger, cyclic AMP, amplification, Ras. Every
bolded term in the two honors lessons links to an entry.

**Cards**: 20 new (11 endomembrane/cytoskeleton, 9 signaling); cards-m2.yaml now has 50.

## For a reviewer to double-check
- Amplification numbers (lesson 10h2 Example 3, drill, bio-qh-0220) are illustrative and labeled
  as such; "about 20 glucose units per second per phosphorylase" is a deliberately modest
  turnover, not a measured constant.
- Fast axonal transport "about 1 to 5 µm/s (up to about 400 mm a day)"; kinesin 8 nm per ATP.
- Familial hypercholesterolemia "roughly 1 in 250"; Ras mutations in "roughly a fifth of human
  cancers" (Prior et al. 2020 estimate ≈19%); "about 800 GPCR genes", "roughly a third of
  approved drugs act on GPCRs" (Hauser et al. 2017, ≈34%).
- The Golgi transport mechanism is presented as debated, with cisternal maturation as the
  favored model.
- Sutherland's experiment is simplified into a three-tube table (labeled "simplified").
- The microscope drawing uses a box labeled "diaphragm" for the diaphragm/condenser assembly.
- Lesson lengths: 10h1 is ~2,300 words counting its two tables (prose ≈ 2,200); core lessons 08
  and 09 were already near or over 1,800 words and grew by ~120 words each with picture captions.
- Label markers sit on top of small structures (e.g. a lysosome, a mitochondrion); they cover
  part of the structure at small screen sizes, but each marked structure is distinct.

## Errors found in existing content
None. No existing question ids or answers were changed.

## Sources
OpenStax Biology 2e (ch. 4 Cell Structure, ch. 5 Membranes, ch. 9 Cell Communication); Alberts
et al., Molecular Biology of the Cell (protein sorting, vesicle traffic, cytoskeleton, signaling);
NobelPrize.org (Blobel 1999; Rothman, Schekman, Südhof 2013; Brown and Goldstein 1985;
Sutherland 1971; Ohsumi 2016); Novick, Field and Schekman 1980 and Kaiser and Schekman 1990 (sec
mutants, double-mutant ordering); Hauser et al. 2017, Nat Rev Drug Discov (GPCR drug targets);
Prior et al. 2020, Cancer Res (RAS mutation frequency); NIH/NHLBI and CDC pages on familial
hypercholesterolemia and cholera. Numbers checked in Python.
