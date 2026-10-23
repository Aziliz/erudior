# Module 5 (Inheritance) review

Reviewer: independent (did not write this module). Lessons 17–21, `questions/m05.yaml`,
`drills/m05.yaml`, `glossary-m5.yaml`, `cards-m5.yaml`, NOTES-m5.md items.
`content/math/check-module.sh biology m5`: 0 problems after edits.

## What was checked
- All 58 questions worked before reading the key. Every key correct; every distractor wrong; no
  ambiguous stems found. Numeric items recomputed (3/16, 3/8, 1/64, 5/16, 8 gametes, 2/3, 0.64%,
  χ² = 1.60 and its 1.43 divide-by-O distractor, 1/4 hybrid etc.).
- All five lessons read in full; worked examples recomputed in Python: Mendel's F2 ratios
  (2.96, 3.01, 3.15, 2.84), dihybrid fractions, exactly-k-of-n children (3/8, 27/64), 1:6:15:20:15:6:1,
  χ² = 0.26 (seed shape), 0.47 (dihybrid), 15.68 (Example 4). Pedigree figure matches caption.
- Drills: prompts and solution text read for all 12; formulas match the lesson (ABO, X-linked,
  product rule, binomial, chi-square tables with correct critical values 3.84/5.99/7.81/9.49).
- Glossary (29) and cards (30): consistent with lessons.
- Cross-module consistency: lesson 16 (nondisjunction, maternal age, meiosis I arrest) agrees with L21;
  lesson 29 polyploidy agrees with L21.

## Changes
| File | Change | Why / source |
|---|---|---|
| lessons/20-sex-linked.md | X "around 800 protein-coding genes" → "roughly 800 to 900 genes"; Y "fewer than 100 genes" → "only about 100 protein-coding genes" | NHGRI says X has about 900 genes and Y about 100 protein-coding genes, so "fewer than 100" was off. https://www.genome.gov/about-genomics/fact-sheets/X-Chromosome-facts , https://www.genome.gov/about-genomics/fact-sheets/Y-Chromosome-facts |
| lessons/21-chromosomes.md | Down syndrome "about 1 in 700" → "about 1 in 650 to 700 births" | CDC: about 1 in 640 US births; MedlinePlus: about 1 in 700. https://www.cdc.gov/ncbddd/birthdefects/DownSyndrome/data.html , https://medlineplus.gov/genetics/condition/down-syndrome/ |
| lessons/21-chromosomes.md | Turner "about 1 in 2,500" → "about 1 in 2,000 to 2,500 female births" | MedlinePlus now gives about 1 in 2,000 female newborns. https://medlineplus.gov/genetics/condition/turner-syndrome/ |
| lessons/21-chromosomes.md | Example 1, meiosis II case: "meiosis II of a sperm cell carrying the X" → "in meiosis II, in the X-carrying cell, sperm with 24,XX and with 22 … would form" | The cell dividing in meiosis II is a secondary spermatocyte, not a sperm cell. |
| glossary-m5.yaml | "law of independent assortment": no longer credits random metaphase I orientation for far-apart genes on one chromosome. Orientation is now the basis for genes on different chromosomes; far-apart genes behave independently because crossing over between them is frequent. | Coordinator request, matching lesson 16. Random orientation of homologous pairs can't separate two loci on the same chromosome; only recombination can (recombination frequency near 50%). |
| lessons/18-dihybrid.md | Linkage paragraph: added that far-apart genes on one chromosome behave as unlinked because of crossing over, not orientation. Key point now limits the metaphase I explanation to genes on different chromosomes. | Same as above. |
| cards-m5.yaml | "Law of independent assortment" card reworded the same way. | Same as above. |
| glossary-m5.yaml | "recessive": added "or in a male for an X-linked gene" | The old definition said a recessive allele shows only in a homozygote, which contradicts L20 (hemizygous males). |

Kept and confirmed: Klinefelter 1 in 500–1,000 male births (MedlinePlus: about 1 in 650,
https://medlineplus.gov/genetics/condition/klinefelter-syndrome/); red-green color blindness
about 8% of men / 0.5% of women of Northern European ancestry (MedlinePlus: 1 in 12 and 1 in 200,
https://medlineplus.gov/genetics/condition/color-vision-deficiency/); Mendel's counts and dates
(1856–1863, published 1866); Morgan 1910; roan cattle as codominance; hydrangea blue in acidic soil.

## NOTES-m5 items
- nondisjunction not bolded in L21 (defined in m4): fine. autosome / sex chromosome bolded in L20,
  not bolded in L16: fine.
- Test-cross drill "copies of B" design: fine, solution explains "most likely".
- Prevalence figures: updated as above.
- L18 lists 4 drills (AUTHORING suggests 1–3). Builder accepts it; left for the editor.

## Could not verify / left as is
- "Most affected infants [trisomy 18/13] live less than a year" and "a few percent" translocation
  Down syndrome: standard figures, not checked against a fetched source.
