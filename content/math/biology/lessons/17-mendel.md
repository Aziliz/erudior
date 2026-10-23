---
id: bio-mendel
module: bio-m5
title: Mendel's laws and Punnett squares
minutes: 35
topics: [Mendelian genetics]
drills: [bio-monohybrid, bio-testcross]
refs: [bio-ref-genetics]
---
The last lesson followed chromosomes through meiosis: homologous chromosomes pair up, then separate, so each gamete gets one chromosome from every pair. This module asks what that means for the offspring. Why do two brown-eyed parents sometimes have a blue-eyed child? Why does a trait vanish in one generation and come back in the next? The rules were worked out by Gregor Mendel in the 1860s, decades before anyone had seen a chromosome. His results line up exactly with meiosis, and that match is one of the great "aha" moments in biology.

## Before Mendel: the blending idea

In the 1800s most naturalists believed in *blending inheritance*: offspring are a mix of their parents, like paint. A tall and a short parent should give medium children, and those should give medium grandchildren forever. Blending has a fatal problem: it predicts that variation should steadily disappear, and that a trait, once blended away, can never return. Farmers and breeders knew that traits do skip generations and reappear unchanged.

## Mendel's experiments with peas

Mendel, a monk and trained scientist in Brno (now in the Czech Republic), bred garden peas from about 1856 to 1863 and published in 1866. Peas were a smart choice:

- They have clear either/or traits: round or wrinkled seeds, yellow or green seeds, purple or white flowers, tall or dwarf stems. Mendel studied seven such traits.
- They normally self-pollinate, so he could start with lines that bred true (purple plants whose offspring were always purple), yet he could also cross-pollinate by hand, moving pollen with a brush after removing a flower's own pollen-making parts.
- They are cheap and produce many offspring, so he could count thousands of seeds and plants. Counting, and treating the counts as ratios, was Mendel's real innovation.

His basic experiment had three generations. The parental generation (P) was two true-breeding plants that differed in one trait, for example purple × white flowers. Their offspring are the first filial generation, F1. He then let the F1 plants self-pollinate to get the F2 generation.

The results were the same for all seven traits:

1. Every F1 plant looked like one parent. Purple × white gave all purple; the white trait seemed to vanish.
2. In the F2, the hidden trait came back in about one quarter of the offspring.

| Trait | F2 dominant form | F2 recessive form | Ratio |
|---|---|---|---|
| Seed shape | 5474 round | 1850 wrinkled | 2.96 : 1 |
| Seed color | 6022 yellow | 2001 green | 3.01 : 1 |
| Flower color | 705 purple | 224 white | 3.15 : 1 |
| Stem length | 787 tall | 277 dwarf | 2.84 : 1 |

The white trait could not have been destroyed in the F1, since it reappeared unchanged. So the F1 plants must have carried something for white that did not show.

## Genes, alleles, and the vocabulary of crosses

Mendel called his units "factors." Today we call a unit of inheritance a **gene**: a stretch of DNA that affects a trait (module 6 shows how). A gene can come in different versions, called **alleles**. The flower-color gene in peas has a purple allele and a white allele.

Each pea plant, like you, carries two copies of each gene, one inherited from each parent (they sit on the two members of a homologous chromosome pair). We write alleles with letters: a capital letter for the **dominant** allele, which shows its effect even when only one copy is present, and the same letter in lower case for the **recessive** allele, which shows its effect only when no dominant allele is present. For flower color, P = purple and p = white.

- A plant's **genotype** is its pair of alleles: PP, Pp or pp.
- Its **phenotype** is the trait you can observe: purple or white.
- A genotype with two identical alleles (PP or pp) is **homozygous**; one with two different alleles (Pp) is **heterozygous**.

Since P is dominant, PP and Pp plants are both purple. Only pp plants are white. Two genotypes can give the same phenotype, which is why you cannot read a genotype just by looking.

## The law of segregation

Mendel explained his data with what we now call the **law of segregation**: the two alleles of a gene separate (segregate) when gametes form, so each gamete carries just one allele, and the two are equally likely. At fertilization, an egg and a sperm each contribute one allele, restoring the pair.

Meiosis is the physical reason. The two alleles sit on the two homologous chromosomes, and homologs go to opposite poles in anaphase I. A Pp plant therefore makes gametes that are half P and half p.

Run the experiment with this model. The P generation is PP × pp, so every F1 plant gets P from one parent and p from the other: all Pp, all purple. Each F1 plant makes P and p gametes in equal numbers. A cross of Pp × Pp gives the F2.

## Punnett squares

A **Punnett square** is a grid that lists one parent's possible gametes across the top, the other parent's down the side, and fills each box with the genotype that union produces. Because each gamete type is equally likely, each box is equally likely.

### Example 1

Cross two heterozygous purple plants, Pp × Pp. What fraction of offspring are white, and how many white plants would you expect among 400 offspring?

Each parent makes gametes P and p, each with probability $\tfrac12$.

| | P | p |
|---|---|---|
| P | PP | Pp |
| p | Pp | pp |

Count the four equally likely boxes:

- Genotypes: 1 PP : 2 Pp : 1 pp (a 1 : 2 : 1 genotype ratio).
- Phenotypes: PP and Pp are purple, so 3 purple : 1 white (a 3 : 1 phenotype ratio).

The fraction white is $\tfrac14$, and among 400 offspring we expect $\tfrac14 \times 400 = 100$ white plants. That is Mendel's 3 : 1, explained.

Notice two other facts hiding in the square. Of the purple offspring, $\tfrac23$ are heterozygous (2 of the 3 purple boxes). And any one offspring is heterozygous with probability $\tfrac24 = \tfrac12$.

## Ratios are probabilities

A Punnett square does not say that a family of four children will contain exactly one recessive child. It gives the probability for each child, and each child is an independent event, like each toss of a coin. With 7324 seeds, Mendel got very close to 3 : 1 (2.96 : 1). With 8 offspring, getting 4 white or none at all is not surprising. Large samples match the predicted ratios closely; small samples can stray far from them. Lesson 21 shows how to decide when a deviation is too big to be chance.

## The test cross

A purple plant could be PP or Pp. How can you tell? Mendel's answer was the **test cross**: cross the unknown individual with a homozygous recessive one (pp). The pp parent can only give p, so each offspring's phenotype shows directly which allele came from the unknown parent.

- If the unknown is PP, all its gametes are P: every offspring is Pp, purple.
- If the unknown is Pp, half its gametes are p: offspring are about 1 purple : 1 white.

### Example 2

A black guinea pig (black, B, is dominant to white, b) is crossed with a white guinea pig. Their litters over a year total 12 offspring: 7 black and 5 white. What is the black parent's genotype?

The white parent is bb and contributes only b. Every white offspring (bb) must have received b from the black parent too. So the black parent carries b: it is Bb. A single white offspring is enough to prove this. The expected result for Bb × bb is 1 : 1, so 6 black : 6 white out of 12; 7 : 5 is a normal chance deviation.

If instead all 12 offspring had been black, the parent is probably BB. "Probably," not "certainly": a Bb parent would give 12 black offspring in a row with probability $\left(\tfrac12\right)^{12} = \tfrac{1}{4096}$, which is very unlikely but not impossible.

### Example 3

A tall pea plant of unknown genotype (T = tall, t = dwarf) is crossed with a heterozygous tall plant, Tt. Of the offspring, 3/4 are tall and 1/4 are dwarf. Which genotype fits?

Try each possibility.

- TT × Tt: every offspring gets T from the TT parent, so all are tall. Doesn't fit.
- Tt × Tt: the Punnett square of Example 1 gives 3 tall : 1 dwarf. Fits.

So the unknown plant is Tt. Working backward like this, from offspring ratios to parent genotypes, is a common exam task: 3 : 1 points to two heterozygotes, 1 : 1 to a heterozygote crossed with a homozygous recessive, and all one phenotype to at least one homozygous dominant parent (or two homozygous parents).

## Common mistakes

- Writing a gamete as "Pp." A gamete carries one allele of each gene, never two.
- Mixing up genotype and phenotype ratios. Pp × Pp gives 1 : 2 : 1 genotypes but 3 : 1 phenotypes.
- Thinking "dominant" means "more common" or "better." A dominant allele can be rare (the allele for Huntington's disease is dominant and rare); a recessive one can be very common (the allele for blood type O).
- Expecting a family to follow the ratio exactly. Each child is a separate chance event; the ratio describes probabilities, not guarantees.
- Concluding that a dominant-phenotype parent is homozygous from a few dominant offspring. Only a recessive offspring settles the question for sure.

## Key points

- Mendel crossed true-breeding peas and counted offspring: the F1 all showed one form, and the F2 showed 3 : 1.
- Genes come in alleles; each individual has two alleles per gene. Genotype is the allele pair, phenotype is the observable trait.
- Law of segregation: the two alleles separate into different gametes, each with probability $\tfrac12$, because homologous chromosomes separate in meiosis.
- Aa × Aa gives 1 AA : 2 Aa : 1 aa and 3 dominant : 1 recessive.
- A test cross with aa reveals an unknown genotype: all dominant suggests AA; any recessive offspring proves Aa.
