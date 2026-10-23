---
id: bio-ref-genetics
title: Genetics and probability
---
## Classic ratios

| Cross | Offspring genotypes | Offspring phenotypes |
|---|---|---|
| $Aa \times Aa$ | 1 AA : 2 Aa : 1 aa | 3 dominant : 1 recessive |
| $Aa \times aa$ (test cross) | 1 Aa : 1 aa | 1 : 1 |
| $AaBb \times AaBb$ (independent genes) | 9 genotype classes | 9 : 3 : 3 : 1 |
| $AaBb \times aabb$ | 1 : 1 : 1 : 1 | 1 : 1 : 1 : 1 |
| Incomplete dominance $RW \times RW$ | 1 RR : 2 RW : 1 WW | 1 red : 2 pink : 1 white |

## Genetic code (mRNA codons)

| First base | Second U | Second C | Second A | Second G | Third base |
|---|---|---|---|---|---|
| U | UUU Phe | UCU Ser | UAU Tyr | UGU Cys | U |
|  | UUC Phe | UCC Ser | UAC Tyr | UGC Cys | C |
|  | UUA Leu | UCA Ser | UAA Stop | UGA Stop | A |
|  | UUG Leu | UCG Ser | UAG Stop | UGG Trp | G |
| C | CUU Leu | CCU Pro | CAU His | CGU Arg | U |
|  | CUC Leu | CCC Pro | CAC His | CGC Arg | C |
|  | CUA Leu | CCA Pro | CAA Gln | CGA Arg | A |
|  | CUG Leu | CCG Pro | CAG Gln | CGG Arg | G |
| A | AUU Ile | ACU Thr | AAU Asn | AGU Ser | U |
|  | AUC Ile | ACC Thr | AAC Asn | AGC Ser | C |
|  | AUA Ile | ACA Thr | AAA Lys | AGA Arg | A |
|  | AUG Met | ACG Thr | AAG Lys | AGG Arg | G |
| G | GUU Val | GCU Ala | GAU Asp | GGU Gly | U |
|  | GUC Val | GCC Ala | GAC Asp | GGC Gly | C |
|  | GUA Val | GCA Ala | GAA Glu | GGA Gly | A |
|  | GUG Val | GCG Ala | GAG Glu | GGG Gly | G |

AUG (Met) is the start codon; UAA, UAG and UGA are stop codons. Read the mRNA 5′→3′ in groups of three from the start codon.

## Probability rules

| Rule | Use | Formula |
|---|---|---|
| Product rule | A **and** B (independent events) | $P(A \text{ and } B) = P(A)\,P(B)$ |
| Sum rule | A **or** B (can't both happen) | $P(A \text{ or } B) = P(A) + P(B)$ |
| Gametes from $n$ heterozygous genes | Number of kinds | $2^n$ |

## ABO blood types

| Genotypes | Blood type |
|---|---|
| $I^AI^A$, $I^Ai$ | A |
| $I^BI^B$, $I^Bi$ | B |
| $I^AI^B$ | AB (codominant) |
| $ii$ | O |

## Pedigree symbols

Square = male, circle = female, filled = affected, half-filled or dot = carrier, horizontal line = mating, vertical line down = offspring, generations numbered I, II, III.

## Hardy-Weinberg

$p + q = 1$ and $p^2 + 2pq + q^2 = 1$, where $p$ and $q$ are allele frequencies and $p^2$, $2pq$, $q^2$ the genotype frequencies. Holds when there's no mutation, no migration, no selection, random mating and a very large population.

## Chi-square

$$\chi^2 = \sum \dfrac{(O - E)^2}{E}$$

Degrees of freedom = number of categories − 1. Reject the hypothesis when $\chi^2$ is larger than the critical value.

| df | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Critical value ($p = 0.05$) | 3.84 | 5.99 | 7.81 | 9.49 |
