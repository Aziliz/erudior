# Module 7 review (Evolution, lessons 26–30)

Reviewer pass, 2026-10-23. `check-module.sh biology m7`: OK, zero problems.

## What was checked
- All 5 lessons read in full; worked examples recomputed (C-14 1/8 → 17,190 yr; K-40 1/4 → 2.5 Gyr; moth survivors 280/520 = 53.8%; HW p = 0.6; CF carriers 2(0.98)(0.02) = 0.0392; Example 3 χ² = 54.4 + 163.3 + 122.5 ≈ 340; Cambrian clock 24 × 4001/4540 = 21.15 h; humans 0.3/4540 × 24 h ≈ 5.7 s).
- All 54 original questions worked before reading keys, every distractor checked (numeric ones in Python).
- All 7 drills: prompts, `where` clauses, answer types and solution text.
- Glossary (30 terms) and cards (29) against the lessons.
- Every item in NOTES-m7.md; tree-of-life consistency across lessons 07, 08, 29, 30, 31.

## Changes
| File | Change | Why / source |
|---|---|---|
| 29-speciation.md | New section "The tree of all life": three domains (Woese rRNA), common ancestor at the root, Asgard archaea and the current view that eukaryotes arose from within the archaea (two primary branches), three domains kept as the classification. New key point. | Lessons 29–31 had to agree; L29 said nothing about the tree of life. Eme et al. 2023 Nature (https://research.monash.edu/en/publications/inference-and-reconstruction-of-the-heimdallarchaeial-ancestry-of), Spang et al./Asgard review (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5875740/), Williams et al. 2020 two-domain tree (https://courses.cs.duke.edu/spring24/compsci260/resources/TreeOfLife/williams.2020.pdf) |
| 29-speciation.md | Shared derived characters "are found in all of its descendants" → "were passed on to its descendants", plus note that traits can be lost (snake legs). | Factual: derived traits can be secondarily lost. |
| 29-speciation.md | Common mistake said "All tips are present-day groups", contradicting the lesson's own "present-day (or fossil) groups". Reworded. | Internal contradiction. |
| 29-speciation.md | "both cold-blooded" → "both depend on outside heat". | Lesson 34 teaches that "cold-blooded" is misleading. |
| 29-speciation.md, q-0743 | Darwin's finches "14 to 18" → "15 to 18" species. | 15 recognized species in Lamichhaney et al. 2015 (https://www.uu.se/en/press/press-releases/2015/2015-02-11-evolution-of-the-darwins-finches-and-their-beaks); ancestor ~2 Mya confirmed. |
| 30-history-life.md | Endosymbiosis paragraph: host was most likely an archaeon related to Asgard archaea; mitochondrion from a bacterium; chloroplast taken in later by a lineage that already had mitochondria. Key point updated to match. | Agreement with L29/L31; previous text said only "a host cell". Same sources as above. |
| 30-history-life.md | "first four-legged vertebrates came out of the water around 375 to 365 Mya (Tiktaalik)" → four-limbed vertebrates evolved from lobe-finned fish roughly 390–360 Mya; Tiktaalik (~375 Mya) shows the transition. | Tiktaalik is not a four-legged vertebrate; tetrapod trackways older than 375 Mya exist. |
| 30-history-life.md, q-0749 | End-Permian "roughly 90%" → "by most estimates 80 to 90 percent or more" of marine species. | Published estimates range from about 81% to 96%. |
| 26-evidence.md, q-0710 | Human–chimp ancestor "6 to 7" → "6 to 8 million years ago (estimates vary)". | Estimates range roughly 6–8 Mya and some higher (https://en.wikipedia.org/wiki/Chimpanzee%E2%80%93human_last_common_ancestor, https://www.unsw.edu.au/news/2016/02/when-humans-split-from-the-apes). |
| 26-evidence.md | Vitamin C pseudogene shared by "humans and other apes" → "humans, other apes and monkeys". | The GULO loss is shared across haplorhine primates, not apes only. |
| 27-natural-selection.md, q-0719 | Cabbage/broccoli/kale bred from "wild mustard" → "wild cabbage (*Brassica oleracea*, a relative of mustard)". | Factual: the species is wild cabbage. |
| 27-natural-selection.md | "From wolves" → "From ancient wolves". | Dogs descend from an ancient wolf population, not modern gray wolves. |
| 27-natural-selection.md | Removed "stopping a course before the infection is cleared" as a driver of resistance; now "overuse and misuse, such as taking antibiotics for viral colds". | The stop-early claim is contested; overuse/misuse is the well-supported driver. |
| q-0741 | Key error: hair (present only in mammals) was the "useful" trait for sorting mammals, birds and lizards, but a trait found in one group out of three can't show which two are closest. Rewritten around the lesson's own table: frog, lizard, human; amniotic egg is the informative trait. Answer index kept at 0. | Phylogenetic logic. |
| q-0755 (new) | L29 question on the Asgard archaea / eukaryote-origin view (answer 3). | Covers the new section. |
| cards-m7.yaml | Tree-reading card "tips are living groups" → "groups compared (usually living ones)". New card: origin of eukaryotes (current view). | Consistency with lesson. |

Answer positions now 0 = 14, 1 = 14, 2 = 13, 3 = 14 (55 questions).

## NOTES-m7 items
- Grant finches: >80% crash and ~4% deeper beaks agree with Boag & Grant's data as commonly reported; kept.
- Cytochrome c differences: labeled approximate; consistent with standard tables; kept.
- Elephant seals: tens to ~100 survivors in the 1890s, >200,000 now; kept.
- Lenski: started 1988, passed 75,000 generations; kept. Galápagos finches: fixed above.
- Spotted skunks: eastern late winter, western late summer/fall with delayed implantation; kept.
- Geologic dates match `bio-ref-evolution-ecology`; kept.
- Cross-references (endosymbiosis in L08, chi-square in L21) exist.

## Couldn't verify / for the editor
- Peppered moth ~98% near Manchester by 1895 and Daphne Major numbers taken from well-known secondary accounts, not re-fetched.
- Lesson 07 (module 2) dates the three domains to 1977 and L31 now says Woese's group formalized the domain system in 1990; both are true (1977 discovery, 1990 proposal), but the module 2 reviewer may want to say so.
