# Module 5 (Inheritance): writer's notes

`content/math/check-module.sh biology m5`: build and checker both report zero problems.

## Counts

- Lessons: 5 (17 bio-mendel, 18 bio-dihybrid, 19 bio-beyond-mendel, 20 bio-sex-linked, 21 bio-chromosomes), roughly 1,480–1,730 words each, each with 3–4 worked examples, Common mistakes and Key points. Figures: polygenic histogram (L19), pedigree diagram (L20), chi-square curve with df = 3 and the shaded 5% tail (L21). Punnett squares and data are Markdown tables.
- Questions: 58 (bio-q-0501–0558): 12 / 12 / 12 / 11 / 11 per lesson, 20 with `module_quiz: true` (4 per lesson). Answer positions: 0 = 15, 1 = 14, 2 = 15, 3 = 14.
- Drills: 12 (`drills/m05.yaml`). All the outline ids (bio-monohybrid, bio-testcross, bio-dihybrid, bio-product-rule, bio-blood-type, bio-incomplete, bio-x-linked, bio-chi-square), plus four extras: bio-dihybrid-count (9:3:3:1 expected counts), bio-children (exactly k of n children, binomial), bio-chi-square-121 (1:2:1, df 2) and bio-chi-square-multi (9:3:3:1, df 3). Genetic probabilities use `fraction` with `lowestTerms`. The chi-square drills ask for χ² (tolerance 0.02–0.03), df, the critical value, and a reject decision typed as 1/0. The p = 0.05 table for df 1–4 appears in each prompt, and `where` keeps χ² at least 0.15–0.2 away from the critical value. Lesson front matter: L18 lists 4 drills (one more than AUTHORING's suggested 1–3; the builder accepts it, but drop bio-dihybrid-count from the list if the limit is strict) and L21 lists 3.
- Glossary: 29 terms (`glossary-m5.yaml`). Cards: 30 (`cards-m5.yaml`).

## For the reviewer / other writers

- Module 4's `glossary-m4.yaml` already defines **nondisjunction** and lesson 16 bolds it. I don't bold it in L21; L21 refers back to lesson 16 for it. Then L21 adds aneuploidy, karyotypes, the karyotype table (trisomy 21/18/13, 45,X, 47,XXY) and structural changes.
- I bold **autosome** and **sex chromosome** in L20. Lesson 16 mentions both without bolding them. If module 4 later bolds them, unbold mine.
- I don't bold "linked genes", "trisomy", "polyploidy", "null hypothesis" or "degrees of freedom". The lessons explain them in plain text to keep the glossary at 30 or fewer terms.
- The test-cross drill asks "how many copies of B" (1 or 2) so the genotype can be typed as a number. When all offspring are black, the answer is "most likely BB", and the solution explains this.
- Prevalence figures are approximate and given as "about": Down syndrome about 1 in 700 births; Turner about 1 in 2,500 female births; Klinefelter 1 in 500–1,000 male births; red-green color blindness about 8% of men and 0.5% of women of Northern European ancestry; about 800 protein-coding genes on the X and fewer than 100 on the Y.
- Mendel's counts used (standard published values): 5474/1850 seed shape, 6022/2001 seed color, 705/224 flower color, 787/277 stem length, and the dihybrid 315/108/101/32. χ² values checked in Python: 0.26 and 0.47. The critical values 3.84, 5.99, 7.81 and 9.49 come from scipy.
- Roan cattle are used as the codominance example (as in most US high school texts). Some sources describe roan more carefully at the molecular level, but this is standard.
- I checked every drill formula by brute-force enumeration in Python (ABO, three-gene product rule). I worked every question's numeric answer, and checked each distractor is wrong.

## Sources consulted

Background knowledge of standard genetics, checked against: Mendel's 1866 paper (the counts are in the public domain); Morgan's 1910 white-eye work (*Science* 32:120); NIH/NHGRI and CDC fact pages for chromosome-disorder prevalence and X/Y gene counts; scipy for chi-square critical values. All text, examples and questions are original.
