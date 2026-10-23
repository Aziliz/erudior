# Module 7 (Evolution), round 2 review

Reviewer: independent round 2 reviewer (did not write this module). Scope: new pictures,
diagrams and added sentences in lessons 26–30; honors lessons 30h1 and 30h2; questions
bio-q-0756 to 0780 and bio-qh-0701 to 0728; drills bio-h-*; new glossary and card entries;
images m7-*.svg; NOTES2-m7.md.

`content/math/check-module.sh biology m7` after fixes: OK, zero problems (7 lessons,
108 questions, 11 drills, 50 cards).

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| bio-qh-0727 (order) | Five steps, but the order wasn't the only correct one: "sequence the gene in all species" and "find a dated split" can come in either order, and "measure the difference between the two species of interest" can come before calculating the rate. | Rewrote as four steps where each needs the result of the one before: find a dated split, measure the difference across it, divide by twice the known time to get the rate per lineage, divide the new pair's difference by twice that rate. Explanation updated. | Logic of calibration, as in the lesson |
| bio-q-0771 (label) | Marker 4 (Tip) overlapped the "S" of "Species E". | Moved from x = 62.1 to x = 60.8, onto the end of E's branch. Re-rendered with markers. | Preview |
| 30h2, "Ancestral and derived characters" | "Feathers [are a shared derived character] of birds": feathers first appeared in non-bird dinosaurs, so they don't mark birds alone. | Now: "Feathers are one for birds together with their closest dinosaur relatives, many of which had feathers too." | OpenStax Biology 2e ch. 29 (feathered dinosaurs); fossil record of feathered theropods |
| 30h1, "Effective population size" | The elephant-seal figures (10 males, 90 females) read as real data, but NOTES2 says they are hypothetical. | Now "In a hypothetical colony with 10 breeding males and 90 breeding females". | NOTES2-m7 |
| 30h1, "Testing Hardy-Weinberg with chi-square", and bio-qh-0708 | "Critical value at $p = 0.05$" in a lesson where $p$ is the allele frequency. A student could easily mix the two up. | Now "at the 0.05 significance level". | Clarity |
| Lesson 29, reproductive-isolation Mermaid diagram | A left-to-right tree of 10 boxes, about 770 × 750 px, too small to read on a phone (and taller than the preview window). | Changed to `flowchart TD` with 5 boxes: the two families, each with a box listing its barriers. accTitle and accDescr unchanged, since they still describe the whole diagram. Previewed: about 590 × 300 px. | AUTHORING.md diagram size guidance |

## Checked and found right

- **Every new question worked independently.** These are right: 0765 (160/310 = 51.6%, so 52), 0766 (0.42), 0760 (5 half-lives); qh-0701 (0.8), 0702 (0.375/0.875 = 0.4286), 0703 (90% of $a$ copies in carriers at $q = 0.1$), 0704 (0.2), 0706 (0.99^100 = 0.366; the distractor 0.98^100 = 0.133), 0707 (4/0.056 = 71.4; mean 380), 0709 (χ² = 36), 0710 (32), 0717 (Tree 3 = 10), 0719 (105), 0720 (10 Myr), 0725 (6 Myr). Select-all keys, match pairings and the other order items (0761, 0769, 0775, 0777, qh-0712) have a single defensible answer. The text-answer `accept` lists are complete and contain nothing wrong.
- **Honors 1 numbers, recomputed in Python.** Example 1 (0.278/0.556/0.167, $q' = 0.444$; from $q = 0.1$, $q' = 0.0964$). The Δq curve has its minimum at $q = 0.716$, which matches the caption's "near q = 0.7". Example 2 ($\bar w = 0.8897$, $q' = 0.054$, $\hat q = 0.13$). $\sqrt{pq/2N}$ is 0.112 and 0.025. Example 3 (0.98^50 = 0.364, $H = 0.18$; 0.999^50 = 0.951, $H = 0.48$). $N_e = 36$. Example 4 (mean 802, $N_e = 48.1$). Founder chance $1 - 0.99^{10} = 0.096$. Example 5 (expected 294.3/496.4/209.3, χ² = 0.22) and the 70/60/70 case (χ² = 32).
- **Honors 2 numbers.** Tree counts $(2n-3)!!$: 34,459,425 for 10 species and 8.2 × 10²¹ for 20. Parsimony totals 7/9/10, checked character by character, and they match the figure's bars (7 on Tree 1, 9 on Tree 2, red bars for the repeated changes). Example 2 (0.15% per lineage, 5 Myr). The least-squares slope of the Example 3 calibration line through the origin is 1709/5700 = 0.2998.
- **History and facts.** Fisher, Haldane and Wright. Zuckerkandl and Pauling (early 1960s, hemoglobin). Kimura's neutral theory (1968): the neutral substitution rate equals the mutation rate. Hennig (1950 German, 1966 English). Crocodiles are closer to birds than to lizards. The roughly 2% per Myr pairwise rule for animal mtDNA (Brown et al. 1979) is labeled as varying. The Panama closure near 3 Ma is given with the earlier-date debate noted. Pea-aphid carotenoid genes came from fungi (Moran and Jarvik 2010). Transformation, transduction and conjugation are described correctly.
- **Sickle-cell fitnesses** (0.88 / 1 / 0.20) are labeled illustrative. Classic estimates put $w_{SS}$ somewhere near 0.14–0.2, and the conclusion ($\hat q$ around 0.1–0.13) holds either way.
- **Drills**, recomputed from the YAML for sample inputs. bio-h-selection-gen: formula right, checked for $q$/$w$ = 0.6/0.2, 0.9/0.9 and 0.1/0.2. bio-h-ne-bottleneck: 700/6 gives $N_e = 29.0$ and 0.914 of heterozygosity left. bio-h-hw-chisq: the counts are built so that $p = k/20$ exactly and the expected counts are $k^2$, $2k(20-k)$, $(20-k)^2$. Proved algebraically, and checked for $k = 8$, $dv = -9$ (χ² = 3.516). All counts are ≥ 12 and all expected counts ≥ 36 over the variable range. bio-h-mol-clock: $d = 2rT$ is used consistently.
- **Pictures.** All 12 m7 SVGs were rendered and checked.
  - Forelimbs: right bone order, a 3-segment thumb and 4-segment fingers in the human, extra phalanges in the whale, a long-fingered bat wing with a reduced ulna, and a not-to-scale note.
  - Arm-bones markers: each one sits on the named bone. Checked against the SVG coordinates (marker 4 is on the middle metacarpal, marker 5 on the proximal phalanx).
  - Replica plating: the circled positions match between the master plate and the antibiotic plate.
  - Bottleneck: the 3 blue + 1 green survivors match the alt text (checked with pixel sampling). The founder island has no green.
  - Geologic timeline: drawn to scale (checked every boundary and event position against 4,540 Myr and 539 Myr).
  - Timeline and tree label markers: on the right intervals and parts.
  - Rock layers: order and dates are consistent with the lesson.
  - Drift simulation: N = 10 runs all fix or are lost by about generation 25. N = 200 runs stay mostly between 0.3 and 0.7, with one at about 0.15. The alt text says "mostly", so it is accurate.
  - HGT: the gene arises before the transfer, and the transfer arrow is roughly contemporaneous on both branches.
- **Mermaid diagrams** in lessons 27, 28 and 30 and honors 1: correct content, and accDescr describes the whole diagram. All were previewed and are readable.
- **Glossary** (16 terms) and **cards** (20): definitions are correct and consistent with the lessons. There are no duplicate card fronts.

## Left uncertain or not changed

- The endosymbiosis diagram in lesson 30 is left to right and about 880 px wide, so it shrinks on a phone. It is only three columns deep, so I left it.
- Honors 1's "selection controls an allele's fate when $s \gg 1/(2N_e)$" is a rough rule. Some texts write $1/(4N_e)$, depending on how fitness is defined. It is labeled as a simplification, so I left it.
