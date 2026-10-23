# Module 5 (Inheritance), round 2: writer's notes

`content/math/check-module.sh biology m5`: build and checker report zero problems (7 lessons, 111 questions, 18 drills, 50 cards).

## Honors lessons (new)

- `lessons/21h1-linkage.md` (bio-h-linkage, 45 min, about 2,150 words). Covers Bateson–Saunders–Punnett coupling (1905), Morgan (1911), parental vs recombinant classes, recombination frequency, Sturtevant's map (1913), map units/cM, why RF approaches 50%, the three-point test cross with interference, coupling vs repulsion predictions, and limits of genetic maps (hotspots, sex differences, Huntington's 1983 linkage). 4 worked examples: an 18.0% two-point test cross with a chi-square against 1:1:1:1; ordering b–cn–vg from pairwise RFs; a 2000-fly three-point cross (b–cn 9.1, cn–vg 9.4, coefficient of coincidence 0.58, interference 0.42); a repulsion-phase prediction. Pictures: m5-crossing-over.svg, m5-linkage-map.svg. Diagram: Mermaid timeline, 1905–1983.
- `lessons/21h2-gene-interaction.md` (bio-h-gene-interaction, 45 min, about 2,180 words). Covers reading modified ratios in sixteenths; recessive epistasis 9:3:4 (mouse agouti/albino); complementary genes 9:7 (sweet pea) and the complementation test; dominant epistasis 12:3:1 (summer squash); duplicate genes 15:1 (shepherd's purse); pleiotropy and the recessive-lethal yellow mouse (2:1); quantitative traits and estimating the number of genes from F2 extremes (Nilsson-Ehle); norms of reaction (Clausen, Keck and Hiesey); V_P = V_G + V_E, H², h², the breeder's equation, twin studies, and what heritability does not mean. 4 worked examples: chi-square of 3:1 against 9:7; yellow mice; 4 additive genes from 1/256; H² = 0.6 and R = h²S. Pictures: m5-epistasis-ratios.svg. Diagram: Mermaid pathway (TD). Plot: invented norms of reaction for two genotypes.
- Questions: bio-qh-0501–0514 (linkage) and bio-qh-0515–0528 (gene interaction), 14 each: 9 multiple choice plus 1 label, 1 text, 1 order, 1 match and 1 select-all each. No `module_quiz` (honors lesson in a core module).
- Drills (6, ids bio-h-…): bio-h-recomb-freq, bio-h-linkage-predict, bio-h-interference (linkage); bio-h-epistasis-count, bio-h-polygenes, bio-h-heritability (gene interaction).
- Glossary: 19 new terms (linked genes, parental type, recombinant, recombination frequency, genetic map, map unit (aliases centimorgan, cM), coefficient of coincidence, crossover interference (alias interference), recessive epistasis, dominant epistasis, complementary genes, duplicate genes, complementation test, lethal allele, quantitative trait, norm of reaction, heritability (alias broad-sense heritability), narrow-sense heritability, breeder's equation). Grepped every glossary-*.yaml first: no duplicates. Cards: 20 new (11 linkage/mapping, 9 epistasis/quantitative).

## Core lessons (improved)

Pictures added, each placed where the text discusses it and mentioned in the text:
- L17: m5-mendel-cross.svg (P/F1/F2 flowers), m5-segregation.svg (Pp cell → meiosis → P and p gametes).
- L18: m5-independent-assortment.svg (two metaphase I arrangements → four gamete types), plus a Mermaid branch (forked-line) diagram for RrYy × RrYy.
- L19: m5-dominance-types.svg (complete / incomplete / codominance grid), m5-abo-cells.svg (antigens on red cells for A, B, AB, O).
- L20: m5-pedigree-symbols.svg (symbol key), m5-pedigree-xlinked.svg (three-generation X-linked recessive pedigree, with a short paragraph). The existing `shape` pedigree is kept.
- L21: m5-chromosome-parts.svg (centromere, sister chromatids, p and q arms, bands) with a short new paragraph on p/q arms and band names (7q31, the CFTR region); m5-karyotype.svg (schematic 47,XY,+21); m5-nondisjunction.svg (meiosis I vs meiosis II).
- Blank versions for label questions: m5-mendel-cross-blank, m5-abo-cells-blank (cells in a different order), m5-pedigree-symbols-blank (different order), m5-chromosome-parts-blank, m5-linkage-map-blank, m5-epistasis-ratios-blank (rows reordered). m5-pedigree-dominant.svg is used only in a question.
- All 20 SVGs were previewed (label ones with their markers) and fixed where text overlapped or was cut off. All are under 23 KB.

New questions: bio-q-0559–0583, 5 per core lesson. Types: 6 text (two with caseSensitive: true, for P/p and ii), 5 match, 2 order, 4 label, 5 select-all (two show pictures: the X-linked pedigree and the nondisjunction figure), 3 multiple choice (one shows the dominant-pedigree image). Lesson 18 has no label question because its structure (a branch diagram or Punnett square) isn't worth labeling. module_quiz: true on 0559, 0563, 0565, 0569, 0574, 0575, 0579, 0580.

Answer positions, new multiple-choice questions only (21): 0 = 5, 1 = 6, 2 = 4, 3 = 6. Whole module (single-answer): 0 = 20, 1 = 20, 2 = 19, 3 = 20.

## For the reviewer

- Linkage data sets are invented but realistic. Standard map positions put b, cn and vg at about 48.5, 57.5 and 67.0 on chromosome 2, so the lesson's distances (9.0 / 9.5 / 18.5) match real flies. The lesson doesn't say the counts are Morgan's.
- 21h1 says each large *Drosophila* autosome is "over 100 map units" long (about 107 and 106 in standard maps). Male *Drosophila* have no meiotic crossing over. Female human meiosis has more crossovers than male. One cM is "very roughly" 1 Mb in humans. Please spot-check these.
- 21h2: the A^Y lethality is explained as a deletion that misexpresses agouti and disrupts a neighboring essential gene (Raly; Michaud et al. 1994). The gene isn't named in the lesson. Height heritability is given as "about 0.8" in well-nourished populations. The sweet pea pathway (C and P enzymes) is the standard teaching model.
- 9:3:4 figure: the generic row merges aaB_ with aabb (aa epistatic), while the mouse text has cc epistatic. Both are 9:3:4, and the alt text describes which classes merge.
- Lesson 18 now lists 4 drills (unchanged from round 1); each honors lesson lists 3.
- Lesson 17 body is about 1,780 words after the additions; the others are 1,590–1,690.
- No errors found in the existing module 5 questions. No existing ids or answers were changed.

## Sources

OpenStax Biology 2e (chapters 12–13) for checking standard facts. Morgan 1911 (*Science* 34:384) and Sturtevant 1913 (*J. Exp. Zool.* 14:43) for the history. Bateson, Saunders and Punnett's reports to the Evolution Committee (1905–1908). Creighton and McClintock 1931 (*PNAS* 17:492). Gusella et al. 1983 (*Nature* 306:234) for Huntington's linkage. Cuénot 1905 and Castle and Little 1910 for yellow mice. Nilsson-Ehle 1909. Clausen, Keck and Hiesey 1948 (Carnegie Institution pub. 581) for yarrow. Falconer and Mackay, *Introduction to Quantitative Genetics*, for H², h² and R = h²S. All numbers were checked in Python. All text, figures and questions are original.
