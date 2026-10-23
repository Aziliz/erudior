# Biology (science-biology) — progress

Folder `content/math/biology`, id prefix `bio-`, module ids `bio-m1`…`bio-m10`. One
high school credit. Original writing throughout. Glossary and cards are split per module
(`glossary-mN.yaml`, `cards-mN.yaml`); questions and drills per module (`questions/mNN.yaml`,
`drills/mNN.yaml`). Scope: RESEARCH.md.

## Status: released (revision 2, app v0.22.0)

Revision 2: 74 lessons (40 core + 34 honors: 22 in modules, 12 in honors modules h1–h3), 1,149
questions (864 multiple choice incl. 77 select-all; 91 text, 73 match, 67 order, 54 label), 142
drills, 645 cards, 740 glossary terms, 167 original SVGs and 69 Mermaid diagrams (every
lesson has at least one picture or diagram). Thirteen writers (WRITERS-2.md, NOTES2-*.md), then
thirteen independent reviewers (REVIEWERS-2.md, REVIEW2-*.md): 3 answer-key errors, about 30
factual corrections, about 20 picture fixes, and a drill-grading fix. Editor pass: biome chart
corrected, 2-significant-figure grading in bio-h-gene-density, every lesson audited with axe.

### Revision 1

40 lessons, 10 modules, 458 questions (answer positions 116/114/113/115), 72 drills, 296 notecards,
313 glossary terms, 4 reference sheets. `python3 content/math/build.py biology` and
`npx tsx tests/check-course.mts samples/math/science-biology.json` pass with zero problems; axe
(WCAG 2.2 AAA where practical) clean on sampled lessons in light and dark.

Six writers wrote the modules in parallel (WRITERS.md, notes in NOTES-mN.md); five independent
reviewers then worked every question, re-checked every sequence-drill key and verified flagged facts
against OpenStax, NIH/NHGRI, CDC, WHO, WMO, IUCN and primary papers (REVIEWERS.md, REVIEW-mN.md).
Review totals: 1 answer-key error (bio-q-0741, rebuilt), about 50 factual corrections, a dozen
explanation fixes, 2 questions and 2 cards added. Open choice: lesson 9's honors-level water
potential section and drill (kept).

## Outline (40 lessons)

| # | Module | Lesson id | Title | Topics | Drills (ids) |
|---|---|---|---|---|---|
| 01 | m1 | bio-life | What biology studies: life and its levels | Characteristics of life; Levels of organization | — |
| 02 | m1 | bio-method | How biologists know: experiments, data, and theories | Scientific method; Experimental design | bio-percent-change, bio-mean-data |
| 03 | m1 | bio-chemistry | Atoms, water, and pH | Chemistry of life; Water; pH | bio-ph-scale |
| 04 | m1 | bio-macromolecules | Carbohydrates, lipids, proteins, and nucleic acids | Macromolecules | bio-dehydration |
| 05 | m1 | bio-enzymes | Enzymes | Enzymes | bio-enzyme-rate |
| 06 | m2 | bio-cell-theory | Cell theory and microscopes | Cell theory; Microscopy | bio-magnification, bio-field-size |
| 07 | m2 | bio-cell-types | Prokaryotic and eukaryotic cells | Cell types; Viruses | — |
| 08 | m2 | bio-organelles | Organelles and how a cell works | Organelles | — |
| 09 | m2 | bio-membranes | Membranes and transport | Cell membrane; Transport | bio-osmosis-direction |
| 10 | m2 | bio-cell-size | Cell size, surface area, and specialization | Surface area to volume; Cell specialization | bio-sa-volume |
| 11 | m3 | bio-energy-atp | Energy, ATP, and metabolism | Energy; ATP | — |
| 12 | m3 | bio-photosynthesis | Photosynthesis | Photosynthesis | bio-photo-rate |
| 13 | m3 | bio-respiration | Cellular respiration and fermentation | Cellular respiration; Fermentation | bio-atp-yield, bio-respiration-mass |
| 14 | m4 | bio-cell-cycle | The cell cycle and mitosis | Cell cycle; Mitosis | bio-mitotic-index, bio-phase-time |
| 15 | m4 | bio-cancer | Regulating the cell cycle; cancer and stem cells | Cell cycle regulation; Cancer; Stem cells | bio-doubling |
| 16 | m4 | bio-meiosis | Meiosis and sexual reproduction | Meiosis | bio-gamete-combos |
| 17 | m5 | bio-mendel | Mendel's laws and Punnett squares | Mendelian genetics | bio-monohybrid, bio-testcross |
| 18 | m5 | bio-dihybrid | Dihybrid crosses and probability | Dihybrid crosses; Probability in genetics | bio-dihybrid, bio-product-rule |
| 19 | m5 | bio-beyond-mendel | Beyond simple dominance | Incomplete dominance; Codominance; Multiple alleles; Polygenic traits | bio-blood-type, bio-incomplete |
| 20 | m5 | bio-sex-linked | Sex-linked traits and pedigrees | Sex linkage; Pedigrees | bio-x-linked |
| 21 | m5 | bio-chromosomes | Chromosomes, karyotypes, and chi-square | Chromosomal disorders; Chi-square test | bio-chi-square |
| 22 | m6 | bio-dna | DNA structure and replication | DNA structure; DNA replication | bio-chargaff, bio-complement |
| 23 | m6 | bio-protein-synthesis | From gene to protein | Transcription; Translation; Genetic code | bio-transcribe, bio-translate |
| 24 | m6 | bio-gene-regulation | Gene regulation and mutation | Gene regulation; Mutations | bio-mutation-effect |
| 25 | m6 | bio-biotech | Biotechnology | Biotechnology; PCR; Gel electrophoresis | bio-pcr-copies, bio-gel-size |
| 26 | m7 | bio-evidence | Evidence for evolution | Evidence for evolution | bio-half-life |
| 27 | m7 | bio-natural-selection | Natural selection and adaptation | Natural selection; Adaptation | bio-selection-change |
| 28 | m7 | bio-population-genetics | Population genetics and Hardy-Weinberg | Hardy-Weinberg; Mechanisms of evolution | bio-hw-frequencies, bio-hw-carriers |
| 29 | m7 | bio-speciation | Speciation and phylogenetic trees | Speciation; Phylogeny | — |
| 30 | m7 | bio-history-life | The history of life on Earth | History of life; Geologic time | bio-geo-time |
| 31 | m8 | bio-classification | Classification, bacteria, archaea, and viruses | Classification; Bacteria and archaea; Viruses | bio-bacteria-growth |
| 32 | m8 | bio-protists-fungi | Protists and fungi | Protists; Fungi | — |
| 33 | m8 | bio-plants | Plants: structure, transport, and reproduction | Plants | bio-transpiration |
| 34 | m8 | bio-animals | Animal diversity | Animals | — |
| 35 | m9 | bio-homeostasis | Homeostasis, nervous and endocrine control | Homeostasis; Nervous system; Endocrine system | bio-feedback |
| 36 | m9 | bio-transport-systems | Circulation, respiration, and excretion | Circulatory system; Respiratory system; Excretory system | bio-cardiac-output, bio-bmr-o2 |
| 37 | m9 | bio-digestion-immunity | Digestion, nutrition, and the immune system | Digestive system; Immune system | bio-energy-food |
| 38 | m10 | bio-ecosystems | Ecosystems and energy flow | Ecosystems; Energy flow | bio-ten-percent, bio-biomass |
| 39 | m10 | bio-cycles-populations | Matter cycles and population growth | Biogeochemical cycles; Population ecology | bio-exp-growth, bio-logistic, bio-mark-recapture |
| 40 | m10 | bio-communities-humans | Communities, biomes, biodiversity, and human impact | Community ecology; Biomes; Biodiversity; Human impact | bio-diversity-index |

## Round 2 (v0.22.0): honors, pictures, diagrams, new question types

Honors lessons are optional (`honors: true`); they don't count toward finishing a module and
stay out of module quizzes. Honors modules (`bio-h1`…`bio-h3`, `honors: true` in course.yaml)
have their own module quizzes. Brief: WRITERS-2.md. Question ids: new core questions continue
`bio-q-NNxx`; honors-lesson questions in core modules are `bio-qh-NNxx` (NN = module, xx 01–99);
honors-module questions are `bio-qh-h1-01`…; drill ids `bio-h-…`.

### Honors lessons in core modules (22)

| Module | File | Lesson id | Title | Topics |
|---|---|---|---|---|
| m1 | 05h1-protein-structure.md | bio-h-protein-structure | Protein structure and folding | Protein structure |
| m1 | 05h2-enzyme-kinetics.md | bio-h-enzyme-kinetics | Enzyme kinetics and regulation | Enzyme kinetics; Enzyme regulation |
| m2 | 10h1-endomembrane.md | bio-h-endomembrane | The endomembrane system and the cytoskeleton | Endomembrane system; Cytoskeleton |
| m2 | 10h2-cell-signaling.md | bio-h-cell-signaling | Cell communication and signal transduction | Cell signaling |
| m3 | 13h1-free-energy.md | bio-h-free-energy | Free energy, coupled reactions, and redox | Bioenergetics |
| m3 | 13h2-chemiosmosis.md | bio-h-chemiosmosis | Electron transport and chemiosmosis | Electron transport; Chemiosmosis |
| m3 | 13h3-c4-cam.md | bio-h-c4-cam | The Calvin cycle in depth: photorespiration, C4 and CAM | Calvin cycle; Photosynthetic adaptations |
| m4 | 16h1-cycle-control.md | bio-h-cycle-control | Molecular control of the cell cycle and apoptosis | Cyclins and CDKs; Apoptosis |
| m4 | 16h2-meiosis-variation.md | bio-h-meiosis-variation | Meiosis errors and the sources of variation | Nondisjunction; Genetic variation |
| m5 | 21h1-linkage.md | bio-h-linkage | Linked genes and gene mapping | Linkage; Gene mapping |
| m5 | 21h2-gene-interaction.md | bio-h-gene-interaction | Epistasis, pleiotropy, and quantitative traits | Epistasis; Quantitative genetics |
| m6 | 25h1-regulation-depth.md | bio-h-regulation-depth | Operons, transcription factors, and epigenetics | Operons; Eukaryotic gene regulation; Epigenetics |
| m6 | 25h2-genomics.md | bio-h-genomics | Sequencing, genomics, and gene editing | Genomics; Gene editing |
| m7 | 30h1-evolution-models.md | bio-h-evolution-models | Modeling evolution: selection, drift, and testing Hardy-Weinberg | Selection models; Genetic drift |
| m7 | 30h2-phylogenetics.md | bio-h-phylogenetics | Building phylogenies and molecular clocks | Cladistics; Molecular clocks |
| m8 | 34h1-plant-physiology.md | bio-h-plant-physiology | Plant hormones, responses, and water transport | Plant hormones; Plant responses; Water transport |
| m8 | 34h2-microbes.md | bio-h-microbes | Viruses, bacteria, and antibiotic resistance in depth | Viral replication; Antibiotic resistance |
| m9 | 37h1-neurons.md | bio-h-neurons | Neurons, action potentials, and synapses | Action potential; Synapses |
| m9 | 37h2-immunology.md | bio-h-immunology | Immunology in depth | Adaptive immunity; Vaccines |
| m9 | 37h3-endocrine.md | bio-h-endocrine | Hormones and feedback in depth | Hormone signaling; Glucose regulation |
| m10 | 40h1-population-models.md | bio-h-population-models | Life tables, survivorship, and predator-prey models | Life tables; Population models |
| m10 | 40h2-ecosystem-ecology.md | bio-h-ecosystem-ecology | Productivity, nutrient limits, and global change | Primary productivity; Global change |

### Honors modules (12 lessons)

| Module | File | Lesson id | Title | Topics |
|---|---|---|---|---|
| h1 Research and biostatistics | 41-investigation.md | bio-h-investigation | Designing an investigation | Experimental design |
| h1 | 42-statistics.md | bio-h-statistics | Describing data: variation, error bars, and confidence | Descriptive statistics |
| h1 | 43-hypothesis-tests.md | bio-h-hypothesis-tests | Testing hypotheses: chi-square, t-tests, and correlation | Hypothesis testing |
| h1 | 44-papers.md | bio-h-papers | Reading and writing science | Scientific communication |
| h2 Development, stem cells, and the genome | 45-early-development.md | bio-h-early-development | From zygote to embryo | Embryonic development |
| h2 | 46-differentiation.md | bio-h-differentiation | How cells become different: signals and Hox genes | Cell differentiation; Pattern formation |
| h2 | 47-stem-cells.md | bio-h-stem-cells | Stem cells, cloning, and regeneration | Stem cells; Cloning |
| h2 | 48-genome-evolution.md | bio-h-genome-evolution | Genomes and evo-devo | Genome evolution; Evo-devo |
| h3 Behavior, disease, and conservation | 49-behavior.md | bio-h-behavior | Animal behavior | Animal behavior |
| h3 | 50-social-behavior.md | bio-h-social-behavior | Social behavior, altruism, and kin selection | Social behavior |
| h3 | 51-epidemiology.md | bio-h-epidemiology | Epidemiology and public health | Epidemiology |
| h3 | 52-conservation.md | bio-h-conservation | Conservation biology | Conservation biology |
