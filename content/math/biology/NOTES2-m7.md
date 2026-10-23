# Module 7 (Evolution), round 2 notes

`content/math/check-module.sh biology m7`: build and checker pass with zero problems (7 lessons, 108 questions, 11 drills, 50 cards).

## Added

**Honors lessons** (both `honors: true`, 45 minutes, about 2,100 words of prose each)
- `30h1-evolution-models.md` (bio-h-evolution-models): absolute and relative fitness, selection coefficient; one generation of selection worked as a table (Mermaid flowchart of the steps); why selection against a rare recessive slows (plot of change in q against q); heterozygote advantage and the equilibrium s/(s + t), worked with sickle-cell fitnesses; drift as sampling, fixation probability, heterozygosity loss $H_t = H_0(1 - 1/2N)^t$ with a simulation figure; effective population size (sex ratio, family size, harmonic mean through a bottleneck), founder sampling; chi-square test of Hardy-Weinberg with df = 1 (MN blood group example, plus a heterozygote-deficit case). 5 worked examples.
- `30h2-phylogenetics.md` (bio-h-phylogenetics): shared derived and shared ancestral characters, paraphyletic groups (reptiles without birds), outgroups and rooting, number of possible trees, homoplasy, maximum parsimony by counting changes (6-character table, three trees: 7/9/10 changes, figure of trees 1 and 2), a note that likelihood and Bayesian methods are now standard; molecular clocks (Zuckerkandl and Pauling, Kimura's neutral theory), $d = 2rT$, a calibration calculation and a calibration-line plot, caveats (rate variation, saturation, relaxed clocks, Panama calibration); horizontal gene transfer (transformation, transduction, conjugation; gene tree vs species tree; mitochondrial gene transfer; aphid carotenoid genes from fungi). 3 worked examples.

**Questions** (`questions/m07.yaml`)
- Core: bio-q-0756 to bio-q-0780, 5 per core lesson: 8 text, 5 match, 4 order, 3 label, 5 select-all. `module_quiz: true` on 0756, 0761, 0767, 0771, 0777 (one per lesson). No new single-answer choice questions, so the core answer spread is unchanged (0 = 14, 1 = 14, 2 = 13, 3 = 14).
- Honors: bio-qh-0701 to 0714 (evolution models) and bio-qh-0715 to 0728 (phylogenetics), 14 each: 9 multiple choice + 2 text + 1 order + 1 match + 1 select-all per lesson. Honors multiple-choice answer positions 0 = 4, 1 = 5, 2 = 5, 3 = 4. Module totals for single-answer choice questions: 18/19/18/18.

**Pictures** (`images/`, all original, previewed and checked; label-question markers checked)
- m7-forelimbs.svg (L26: human, cat, whale, bat forelimbs, bones color-coded) and m7-arm-bones.svg (unlabeled arm for label question 0756)
- m7-replica-plating.svg (L27 Example 1 and question 0764)
- m7-bottleneck-founder.svg (L28 and question 0768)
- m7-tree-parts.svg (L29, labeled root/node/branch/tip/clade) and m7-tree-blank.svg (label question 0771)
- m7-geologic-timeline.svg (L30, eons to scale plus Phanerozoic zoom with events) and m7-timeline-blank.svg (label question 0776)
- m7-rock-layers.svg (L30 Example 2 and question 0779)
- m7-drift-sim.svg (honors 1; seeded Wright–Fisher simulation, 8 runs each at N = 10 and N = 200, p0 = 0.5)
- m7-parsimony.svg (honors 2; trees 1 and 2 with numbered change bars, homoplasy in red; question 0717)
- m7-hgt.svg (honors 2)

**Mermaid diagrams**: L27 logic of natural selection; L28 Hardy-Weinberg as a null model; L29 kinds of reproductive isolation; L30 endosymbiosis; honors 1 steps of one generation of selection. **Plots** (```plot): honors 1 change in q vs q; honors 2 molecular-clock calibration line.

**Drills** (`drills/m07.yaml`): bio-h-selection-gen (mean fitness and q′ after selection against aa), bio-h-ne-bottleneck (harmonic-mean Ne and heterozygosity left through a one-generation bottleneck), bio-h-hw-chisq (p and chi-square for 400 genotyped individuals; counts are built so p and the expected counts are exact), bio-h-mol-clock (calibrate rate per lineage, then date a split).

**Glossary** (`glossary-m7.yaml`, 16 new terms): absolute fitness, relative fitness, selection coefficient, mean fitness, heterozygote advantage, balancing selection, fixation, shared derived character, shared ancestral character, paraphyletic group, outgroup, homoplasy, maximum parsimony, molecular clock, calibration, horizontal gene transfer. "Effective population size" is bolded in honors 1 but already defined in glossary-h3.yaml (same meaning), so not added again.

**Cards** (`cards-m7.yaml`): 20 new (10 per honors lesson).

**Core lesson text changes** (additions only, no rewrites): a sentence naming the forelimb bones (humerus, radius and ulna, carpals, metacarpals and phalanges) in L26; one or two sentences introducing each figure or diagram; one sentence after the bottleneck figure in L28 and one reading the tree in L29.

## For a reviewer to double-check

- Sickle-cell fitnesses in honors 1 Example 2 (w_AA = 0.88, w_AS = 1, w_SS = 0.20) are labeled illustrative, "of the size estimated in classic studies". The text says S-allele frequencies of roughly 0.1 or more occur in parts of sub-Saharan Africa. Both are general statements, not tied to one study.
- Honors 1: "selection controls an allele's fate when s is much larger than 1/(2Ne)" is labeled a rough rule (simplified from Kimura). The elephant-seal sex-ratio numbers (10 males, 90 females) are a hypothetical illustration.
- Honors 2: the calibration numbers in Examples 2 and 3 are hypothetical. The "about 2% per million years for animal mtDNA" rule of thumb is given as varying widely. The Isthmus of Panama closure is given as "most estimates near 3 million years ago, though some geologists argue for earlier dates".
- Honors 2: the pea-aphid carotenoid genes from fungi are from Moran and Jarvik 2010. I avoided saying aphids are the only animals that make carotenoids, because spider mites and some gall midges were later found to have similar transferred genes.
- Honors 1 and the h3 conservation lesson (another writer) both cover Ne and heterozygosity loss. The formulas agree, and my drill (harmonic mean through a bottleneck) differs from bio-h-heterozygosity (sex ratio).
- The bat wing in m7-forelimbs.svg is schematic (rotated 90°, with a reduced ulna). Bones are not to scale, and the figure says so.

## Errors found in existing content

None found in m7 questions or lessons this round.

## Sources

- OpenStax Biology 2e, ch. 18–20 (evolution, population genetics, phylogenies) for definitions and standard results; standard population-genetics results (Wright–Fisher drift, $H_t = H_0(1 - 1/2N)^t$, harmonic-mean Ne, $N_e = 4N_mN_f/(N_m + N_f)$, heterozygote-advantage equilibrium, df = 1 for an HW chi-square test).
- Sickle-cell selection example and West African genotype data: S. M. Carr, Estimation of selection coefficients (https://www.mun.ca/biology/scarr/Bio4250_Estimates_of_Selection_Coefficients.html).
- Isthmus of Panama calibration: Knowlton and Weigt 1998, Proc. R. Soc. B (https://repository.si.edu/items/68618a7e-9894-4067-86d0-219afa2fdd45).
- Moran and Jarvik 2010, Science 328:624, lateral transfer of carotenoid genes from fungi to aphids.
- Zuckerkandl and Pauling (1962, 1965), Kimura (1968), Hennig (1950/1966) for the history.
- All numbers in the lessons and questions were checked in Python (tree counts (2n − 3)!!, the Δq curve, Example 1–5 tables, the chi-square values, the calibration slope 0.2998).
