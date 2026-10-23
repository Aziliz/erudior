# Module 8 review (The diversity of life, lessons 31–34)

Reviewer pass, 2026-10-23. `check-module.sh biology m8`: OK, zero problems.

## What was checked
- All 4 lessons read in full; worked examples recomputed (300 × 2⁶ = 19,200; 156 / (10⁻⁴ × 0.1) = 1.56 × 10⁷; potometer 0.75 × 42 / 6 = 5.25; stomata 28 / (π × 0.2²) ≈ 223; mouse/lizard crossing at 35 °C).
- All 47 original questions worked before reading keys, every distractor checked (numeric ones in Python).
- All 4 drills: prompts, ranges, tolerances (stomatal density rounding stays within 1% because density ≥ 61) and solution text.
- Glossary (30) and cards (30) against the lessons.
- Every item in NOTES-m8.md; tree-of-life consistency with lessons 07, 08, 29, 30.

## Changes
| File | Change | Why / source |
|---|---|---|
| 31-classification.md | Table: archaea have **one** RNA polymerase (complex, eukaryote-like), not "several"; bacteria one, simpler; eukaryotes several. | Factual error. |
| 31-classification.md | Tree paragraph rewritten to match L29/L30: most recent genome studies place eukaryotes inside the archaea, closest to the Asgard archaea; archaeal host plus bacterium → mitochondrion; two primary branches on such trees; three domains still used for classification. Note that eukaryote membrane lipids are bacterial-type (origin hedged). Key point updated. | Lessons 29–31 agreement. Eme et al. 2023 (https://research.monash.edu/en/publications/inference-and-reconstruction-of-the-heimdallarchaeial-ancestry-of), https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5875740/ |
| 31-classification.md | Woese "proposed the three-domain system" in 1977 → rRNA work 1977 (methanogens first), domain system formalized by Woese and colleagues in 1990. | Woese, Kandler & Wheelis 1990 PNAS. |
| 31-classification.md | "All known methane-producing organisms are archaea" → every known methanogen (methane as the end product of energy metabolism) is an archaeon. | Some bacteria release small amounts of methane by other routes. |
| 31-classification.md | Lytic cycle example "Cold and flu viruses behave this way" → general statement. | Influenza buds from cells rather than bursting them; the example was misleading. |
| 32-protists-fungi.md | Key point "Algae do about half of Earth's photosynthesis" → "Ocean phytoplankton (algae plus cyanobacteria)". | The lesson body itself credits protists plus cyanobacteria. |
| 33-plants.md | Pollen "delivers sperm without any need for water" → fertilization no longer needs a film of water outside the plant. | Cycad and ginkgo sperm still swim, inside the ovule. |
| 34-animals.md | Protostome/deuterostome split was "bilateral animals with a coelom"; now all bilateral animals, with protostomes including flatworms and roundworms (DNA). | Modern phylogeny; flatworms and nematodes are protostomes. |
| 34-animals.md | "Lungs and four limbs (amphibians)" → four limbs, with lungs already present in their fish ancestors. | Lungs evolved in bony fish before tetrapods. |
| q-0804 | Explanation "RNA polymerases" → "RNA polymerase". | Same fact as the table fix. |
| q-0807 | Distractor $8.4 \times 10^{-6}$ → $8.4 \times 10^{-5}$, the number the "multiplied by the dilution" error actually gives. | Distractor didn't match its own explanation. |
| q-0848 (new) | L31 question: why a two-branch tree and the three-domain system can both be reasonable (answer 3). | Covers the tree-of-life update. |
| glossary-m8.yaml | three-domain system: adds 1990 and the current placement of eukaryotes within archaea. | Consistency. |
| cards-m8.yaml | Three-domains card adds the current view. | Consistency. |

Answer positions now 0 = 12, 1 = 12, 2 = 12, 3 = 12 (48 questions).

## NOTES-m8 items
- Glossary collisions: none. m2 left domain terms unbolded for m8; no duplicate entries (checker passes with all glossaries loaded).
- Two-domain view vs m7: now agrees in L29, L30 and L31.
- Rounded figures (≈2 million named species, E. coli 20 min, gut bacteria ≈ human cells (Sender 2016), phytoplankton ≈ half of photosynthesis, Armillaria ≈ 9 km², ≈300,000 angiosperms, >90% water transpired, ≈95% invertebrates, malaria "hundreds of thousands" of deaths a year): all consistent with standard sources; kept.
- Potometer chart labeled illustrative; protostome/deuterostome exceptions left out as beyond scope (now hedged as "first recognized by how the embryo develops").

## Couldn't verify / for the editor
- Exact Armillaria area (sources give 9.1–9.6 km²) and the 1840s famine toll (~1 million) taken from standard accounts, not re-fetched.
