# Biology module 1 (bio-m1), round 2: writer notes

## Added

**Honors lessons (2)**
- `lessons/05h1-protein-structure.md` (bio-h-protein-structure, 45 min, about 2,150 words of prose plus a table):
  peptide bond geometry and Ramachandran, R-group classes (Gly/Pro/Cys), α helix (3.6 per turn,
  0.15 nm rise, i→i+4 H-bonds; Pauling–Corey–Branson 1951) and β sheet, hydrophobic effect and
  tertiary interactions, domains, intrinsically disordered regions (flagged as a limit of the textbook
  picture), hemoglobin cooperativity, Anfinsen's scrambled-disulfide result (1/105), Levinthal's
  paradox and the folding funnel, chaperones (Hsp70, GroEL/GroES), sickle cell, CFTR ΔF508,
  amyloid and prions, structure determination and AlphaFold. 3 worked examples.
- `lessons/05h2-enzyme-kinetics.md` (bio-h-enzyme-kinetics, 50 min, about 2,000 words of prose plus tables):
  Michaelis–Menten (Vmax, Km, limits, 50/75/90% at Km/3Km/9Km), kcat and kcat/Km (diffusion limit),
  Lineweaver–Burk (with its error-weighting caveat), competitive / pure noncompetitive /
  uncompetitive / mixed / irreversible inhibition with Km_app = Km(1 + [I]/Ki), drug examples,
  allosteric regulation and cooperativity (T/R), ATCase (Gerhart & Pardee 1962), feedback
  inhibition (Umbarger 1956, threonine deaminase), phosphorylation and zymogens. 4 worked examples.

**Questions (`questions/m01.yaml`)**
- Honors: bio-qh-0101–0115 (protein structure, 15: 10 multiple choice, 1 select-all, 1 text,
  1 match, 1 order, 1 label) and bio-qh-0116–0130 (kinetics, 15: 10 multiple choice, 1 select-all,
  2 text, 1 match, 1 order). No `module_quiz` (core-module honors lessons).
- Core: bio-q-0157–0181, 5 per lesson (25): 5 text, 5 order, 5 match, 4 label, 5 select-all,
  1 multiple choice. `module_quiz: true` on 0158, 0159, 0162, 0167, 0172, 0177 (1–2 per lesson).
  bio-life has no label question (its picture is the labeled levels chart; no structure to label).
- Answer positions of the 21 new single-answer 4-choice questions: 0→5, 1→5, 2→6, 3→5. Whole
  module file: 19 / 19 / 20 / 19. Existing questions unchanged.

**Pictures (14 SVGs in `images/`, all original)**
- m1-levels (lesson 1), m1-redi + m1-redi-blank (lesson 2), m1-water-hbonds + -blank (lesson 3),
  m1-dehydration, m1-amino-acid + -blank, m1-protein-levels (lesson 4; protein-levels reused in 05h1),
  m1-induced-fit + -blank (lesson 5), m1-tertiary-bonds + -blank (05h1), m1-allosteric (05h2).
  The five *-blank files are for label questions. All rendered with preview-figure.mjs and checked,
  label markers included.

**Mermaid diagrams (5)**: negative-feedback loop for body temperature (lesson 1), the investigation
cycle (lesson 2), generic feedback inhibition A→B→C→D (lesson 5), fates of a new polypeptide (05h1),
threonine→isoleucine feedback inhibition with valine activation (05h2). Each has accTitle/accDescr
and was rendered and checked.

**Plots (05h2)**: Michaelis–Menten curve with Km marked, Lineweaver–Burk lines (none / competitive /
noncompetitive), hyperbolic vs sigmoid curves with activator and inhibitor shifts.

**Drills (`drills/m01.yaml`, 5)**: bio-h-helix, bio-h-disulfide (05h1); bio-h-mm-rate,
bio-h-lineweaver, bio-h-competitive (05h2).

**Glossary (`glossary-m1.yaml`, +20)**: peptide bond, α helix, β sheet, hydrophobic effect, disulfide
bond, protein domain, molecular chaperone, prion, Michaelis–Menten equation, Vmax, Michaelis
constant (alias Km), turnover number (alias kcat), catalytic efficiency, Lineweaver–Burk plot,
uncompetitive inhibitor, irreversible inhibitor, allosteric regulation, cooperativity, feedback
inhibition, zymogen. All glossary files were checked for duplicates first (none) and again at the end.

**Cards (`cards-m1.yaml`, +19)**: 10 protein structure, 9 kinetics/regulation.

`content/math/check-module.sh biology m1`: OK, zero problems.

## For a reviewer
- The glossary aliases `allosteric`, `chaperone(s)`, `Km`, `kcat` are broad; if another module's writer
  defines "allosteric site" or "chaperone" separately, keep one entry.
- 05h1: β-strand rise given as 0.33–0.35 nm (0.34 used in calculations); membrane hydrophobic core
  "about 3.0 nm" → about 20 amino acids per crossing helix (a standard estimate). Ribonuclease A:
  124 amino acids, 8 Cys, 4 S–S, 105 pairings; Anfinsen's ~1% scrambled activity. Levinthal numbers:
  3^100 ≈ 5.2×10^47; at 10^13/s → 5.2×10^34 s ≈ 1.6×10^27 yr (Python-checked). PDB "well over
  200,000 structures"; cryo-EM Nobel 2017; AlphaFold 2020 / Nobel 2024; Prusiner Nobel 1997.
- 05h2: carbonic anhydrase kcat ≈ 10^6 s⁻¹ and kcat/Km ≈ 10^8 M⁻¹ s⁻¹ are rounded literature values;
  diffusion limit stated as 10^8–10^9. Example data (Vmax 50, Km 2 mM; competitive drug at 3 µM,
  Ki 3 µM) are made-up teaching data, worked in Python. The "noncompetitive" of the core lesson is
  identified as the pure special case of mixed inhibition.
- Valine as an activator of E. coli threonine deaminase (in diagram d5 and text) is the classic
  Changeux-era result; worth a glance.
- Lesson 3 picture: one water molecule shown hydrogen bonded to four neighbors (two as donor, two as
  acceptor); text says "up to four".
- Core lesson word counts grew by the picture sentences only (lesson 4 is now the longest core
  lesson at about 1,950 words counting table text).

## Errors found in existing content
None found in m1 lessons or questions during this pass.

## Sources
Facts were written from standard references (no web lookups were made in this pass, so a reviewer
may want to spot-check the dates and rounded constants listed above against them):
OpenStax Biology 2e ch. 3 and 6 and Biology for AP Courses (protein structure, enzymes, feedback
inhibition); NCBI Bookshelf (Berg, Tymoczko & Stryer, Biochemistry, chapters on protein structure
and enzyme kinetics; Alberts, Molecular Biology of the Cell, protein folding and chaperones);
Anfinsen (1973) Science 181:223; Levinthal (1969); Umbarger (1956) Science 123:848; Gerhart & Pardee
(1962) J Biol Chem 237:891; Pauling, Corey & Branson (1951) PNAS 37:205; RCSB PDB statistics;
nobelprize.org (1992, 1997, 2017, 2024). All numbers checked in Python; all writing and drawings
original.
