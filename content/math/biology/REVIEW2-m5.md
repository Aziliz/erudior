# Module 5 (Inheritance), round 2: reviewer's report

Scope: new pictures and added paragraphs in lessons 17–21, honors lessons 21h1 (linkage) and 21h2 (gene interaction), questions bio-q-0559–0583 and bio-qh-0501–0528, drills bio-h-*, new glossary entries (19) and cards (20), all 20 `images/m5-*.svg`, NOTES2-m5.md. `content/math/check-module.sh biology m5` reports zero problems after the fixes (7 lessons, 111 questions, 18 drills).

## Changes

| Item | Problem | Fix |
|---|---|---|
| bio-q-0580 (order, chi-square steps) | Not a unique order: "find the degrees of freedom" could go anywhere before the comparison, and the explanation itself admitted this. | Merged df into the last step ("Compare chi-square with the critical value for df = categories − 1 and decide…"); 4 items, each depending on the one before. Explanation rewritten to match. |
| bio-qh-0512 (order, three-point cross) | "Identify parental classes" and "identify double-crossover classes" could be done in either order. | Merged into one step; 4 items, each needed for the next. |
| bio-qh-0503 (gene order) | Choices 0 ("B is at one end: B–A–C") and 2 ("A is in the middle: B–A–C") were the same order, so only two real distractors. | Choice 0 now "The order can't be found without a three-point cross"; explanation adds why pairwise distances are enough. Answer index (3) unchanged. |
| bio-q-0565 (order, meiosis) | Stem said "from the start of meiosis", but the first item (DNA replication) happens in interphase before meiosis. | Stem now "from just before meiosis". |
| images/m5-pedigree-symbols.svg | The leader line for "mating line (parents)" ran across the top edge of the female circle. | Leader now starts at x = 330 and rises to the label at y = 145, clearing the circle; label moved up to match. Re-rendered and checked. |

Counts: answer-key errors 0; factual fixes 0; picture fixes 1; other fixes 4 (two non-unique order questions, one duplicate distractor, one stem wording).

## Checked and right (things a reader might doubt)

- 21h1 numbers (Python): Example 1 chi-square vs 1:1:1:1 = 1024.1, RF 18.0%; Example 3: b–cn (85+87+10)/2000 = 9.1%, cn–vg (90+88+10)/2000 = 9.4%, b–vg scored alone 350/2000 = 17.5%, expected DCO 0.091 × 0.094 × 2000 = 17.1, coincidence 0.585 (lesson rounds 0.58), interference 0.42. The middle-gene step is right: the "cinnabar only" class differs from wild type only at cn. Class assignments to intervals are right.
- Example 4 (repulsion, 20 mu, 500 offspring): 200/200/50/50. Correct.
- 21h1 facts: no crossing over in male Drosophila; Sturtevant was an undergraduate in 1911 and published the map in 1913; Janssens' chiasmatype work 1909; Bateson–Saunders–Punnett sweet pea coupling (flower color and pollen shape) 1905; Creighton–McClintock and Stern 1931; Huntington's linkage to chromosome 4 in 1983 (Gusella et al.), gene found 1993; the two large Drosophila autosomes are each over 100 cM; human female meiosis has more crossovers; ~1 cM per Mb as a rough human average. The b/cn/vg distances match standard chromosome 2 positions (48.5, 57.5, 67.0).
- 21h2 numbers: Example 1 chi-square 68.27 (3:1) and 0.20 (9:7); 2:1 yellow mice (80 of 120); 1/256 → 4 genes, 4 cm per allele, 9 classes, F1 56 cm; H² = 0.6; R = 4 cm. Norms-of-reaction plot lines cross at x ≈ 2.5, matching the caption.
- 21h2 facts: mouse agouti (A banded, aa black) and albino cc (tyrosinase); squash W/Y 12:3:1; shepherd's purse 15:1; Cuénot 1905 yellow mice; A^Y as a deletion that puts agouti under a ubiquitous promoter and removes most of the neighboring essential gene (Raly), with obesity as a third effect; Marfan/fibrillin-1; Nilsson-Ehle 1/64 wheat crosses; Clausen, Keck and Hiesey yarrow clones; height heritability ~0.8.
- Epistasis figure: the generic 9:3:4 row merges aaB_ with aabb (aa epistatic) while the mouse text has cc epistatic; both are 9:3:4 and the alt text says which classes merge. Acceptable.
- Pedigrees: m5-pedigree-dominant shows father-to-son transmission (I-1 → II-2), so the explanation correctly rules out X-linked recessive; autosomal dominant is the only fitting choice. m5-pedigree-xlinked matches lesson 20's text and bio-q-0577 (answer I-1 and II-2).
- Other pictures: Mendel cross (P/F1/F2 genotypes and 1:2:1), segregation, independent assortment (both metaphase I arrangements, four gamete types), dominance grid (roan as codominance), ABO cells, chromosome parts (p/q, centromere, bands; 7q31 for CFTR is right), schematic karyotype 47,XY,+21 (acrocentrics drawn with tiny p arms), nondisjunction MI vs MII gamete counts, crossing-over (one crossover, two recombinant chromatids), linkage map. All rendered; labels readable, nothing cut off.
- Label markers rendered on all six blank images (0559, 0569, 0574, 0579, qh-0510, qh-0524): each marker sits on the part named, and blank images' orders match the keys.
- Mermaid: lesson 18 branch diagram, 21h1 timeline, 21h2 pathway all rendered; accTitle/accDescr describe the whole diagram. The timeline's six columns are small on a phone but readable.
- Drills: bio-h-linkage-predict always gives whole-number counts for every d (4–40) and n (checked all combinations); bio-h-interference's expected count is exact to one decimal for all n, so the solution's rounded division agrees with the key; other drills recomputed on samples.
- Glossary and cards: definitions correct; no duplicate terms in other modules' glossaries.

## Left uncertain (not changed)

- 21h2 dates the sweet pea white × white → purple cross "around 1905"; the report I recall is Bateson, Saunders and Punnett's 1906 report to the Evolution Committee. "Around" covers it.
- 21h1 says Morgan's 1911 crosses involved mutations "such as white eyes and miniature wings"; the exact genes in the 1911 Science paper were not checked against the original.
- bio-q-0560 and 0581 accept noun/adjective variants (homozygote, aneuploid) that don't fit the blank grammatically. They're harmless and were left in.
