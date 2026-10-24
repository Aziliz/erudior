---
id: bio-beyond-mendel
module: bio-m5
title: Beyond simple dominance
minutes: 35
topics: [Incomplete dominance, Codominance, Multiple alleles, Polygenic traits]
drills: [bio-blood-type, bio-incomplete]
refs: [bio-ref-genetics]
---
Mendel's pea traits were tidy: one gene, two alleles, one allele fully dominant, and two clear phenotypes. Lessons 17 and 18 used that model. Many traits are messier. A heterozygote can look intermediate, or show both parents' traits at once; a gene can have more than two alleles; a trait like height can depend on many genes plus the environment. None of this overturns Mendel. Alleles still segregate and assort exactly as before. What changes is the link between genotype and phenotype, so the Punnett squares stay the same and only the way you read the boxes changes.

## Incomplete dominance

In snapdragons and four o'clock flowers, a cross between a true-breeding red plant and a true-breeding white plant gives F1 plants that are all pink. This is **incomplete dominance**: neither allele is fully dominant, and the heterozygote has an intermediate phenotype.

Is this blending after all? No, and the F2 proves it. Let the pink F1 self-pollinate. Using $C^R$ for the red allele and $C^W$ for the white allele:

| | $C^R$ | $C^W$ |
|---|---|---|
| $C^R$ | $C^RC^R$ red | $C^RC^W$ pink |
| $C^W$ | $C^RC^W$ pink | $C^WC^W$ white |

The F2 is 1 red : 2 pink : 1 white. Pure red and pure white come back unchanged, exactly as particulate inheritance predicts. Blending would give only pink forever.

A molecular reason is often dosage. If the red allele makes a pigment-producing enzyme and the white allele makes a nonworking version, one red allele makes about half as much pigment as two. Half the pigment looks pink.

With incomplete dominance, every genotype has its own phenotype, so the phenotype ratio equals the genotype ratio. That makes these crosses easy to check: you can count genotypes directly.

### Example 1

In four o'clock plants, a pink plant is crossed with a white plant. What fraction of the offspring are pink, and how many red plants would you expect among 80 offspring?

The cross is $C^RC^W \times C^WC^W$. The white parent gives only $C^W$. The pink parent gives $C^R$ or $C^W$, each $\tfrac12$. So offspring are $\tfrac12$ $C^RC^W$ (pink) and $\tfrac12$ $C^WC^W$ (white). The fraction pink is $\tfrac12$; red needs a $C^R$ from both parents, which is impossible here, so the expected number of red plants is 0.

## Codominance

In **codominance**, a heterozygote shows the full phenotypes of both alleles at once, side by side, rather than a blend. Two classic examples:

- Roan cattle: a cross between red and white cattle gives roan calves whose coats are a mix of individual red hairs and individual white hairs. Each hair is fully one color.
- The human AB blood type: a person with one $I^A$ and one $I^B$ allele makes both the A and B sugar markers on their red blood cells.

The difference from incomplete dominance is what you see in the heterozygote. Pink petals are an in-between color everywhere; a roan coat has both pure colors present. Both cases still give a 1 : 2 : 1 phenotype ratio when two heterozygotes are crossed.

The figure puts the three relationships side by side. Read the middle column, the heterozygote: under complete dominance it looks like one parent, under incomplete dominance it is in between, and under codominance both parental forms are present at once.

![A three-by-three grid. Rows: complete dominance in pea flowers, incomplete dominance in snapdragons, and codominance in roan cattle. Columns: one homozygote, the heterozygote, the other homozygote. Peas: PP purple, Pp purple, pp white. Snapdragons: red, pink, white. Cattle hair patches: all red hairs, a mix of separate red and white hairs (roan), all white hairs.](images/m5-dominance-types.svg)

## Multiple alleles: the ABO blood groups

A single person has only two alleles of a gene, but a population can carry many. A gene with three or more alleles in the population has **multiple alleles**. The ABO blood-group gene has three common alleles:

- $I^A$ puts the A antigen (a sugar marker) on red blood cells;
- $I^B$ puts the B antigen on them;
- $i$ puts neither.

$I^A$ and $I^B$ are codominant with each other, and both are dominant to $i$. That gives six genotypes and four blood types:

| Blood type (phenotype) | Genotypes | Antigens on red cells | Antibodies in plasma |
|---|---|---|---|
| A | $I^AI^A$, $I^Ai$ | A | anti-B |
| B | $I^BI^B$, $I^Bi$ | B | anti-A |
| AB | $I^AI^B$ | A and B | neither |
| O | $ii$ | neither | anti-A and anti-B |

![Four red blood cells. The type A cell carries only A antigens (triangles) on its surface, the type B cell only B antigens (circles), the type AB cell both kinds, and the type O cell neither.](images/m5-abo-cells.svg)

The antibodies matter for transfusions: a person's plasma attacks red cells carrying an antigen they lack. Type O red cells carry no A or B antigen, so they can be given to people of any ABO type, while a person with type AB has no anti-A or anti-B antibodies and can receive red cells of any ABO type. (Real transfusions also match the separate Rh factor, controlled by a different gene, and other markers.)

### Example 2

A woman with type A blood and a man with type B blood have a child with type O blood. What are the parents' genotypes, and what is the probability that their next child has type AB?

A type O child is $ii$ and received $i$ from each parent. So the mother must be $I^Ai$ (not $I^AI^A$) and the father must be $I^Bi$.

Each parent gives either allele with probability $\tfrac12$:

| | $I^B$ | $i$ |
|---|---|---|
| $I^A$ | $I^AI^B$ (AB) | $I^Ai$ (A) |
| $i$ | $I^Bi$ (B) | $ii$ (O) |

All four blood types are possible, each with probability $\tfrac14$. So $P(\text{AB}) = \tfrac14$, the same as for each earlier child.

Blood types were once used to rule out a man as a child's biological father. In Example 2, a man with type AB ($I^AI^B$) could not be the father of the type O child, because he has no $i$ allele to pass on. Blood type can exclude but never prove parentage; DNA testing replaced it.

## Polygenic traits

Many traits don't fall into a few clear classes. Human height, skin color and many crop yields vary continuously. These are **polygenic traits**, controlled by the combined effects of many genes, each adding a small amount.

A simple model shows why polygenic traits form a bell-shaped curve. Suppose three unlinked genes each have an "adding" allele (A, B, C) and a "non-adding" allele (a, b, c), and each adding allele makes a plant 2 cm taller. Cross two AaBbCc plants. Each of the six allele positions in an offspring gets an adding allele with probability $\tfrac12$, so the number of adding alleles is like the number of heads in six coin tosses.

```plot
{"x": [-0.6, 6.6], "y": [0, 22], "yAxisAt": "left", "xLabel": "number of adding alleles", "yLabel": "offspring out of 64", "bars": [{"x": 0, "height": 1, "width": 0.8}, {"x": 1, "height": 6, "width": 0.8}, {"x": 2, "height": 15, "width": 0.8}, {"x": 3, "height": 20, "width": 0.8}, {"x": 4, "height": 15, "width": 0.8}, {"x": 5, "height": 6, "width": 0.8}, {"x": 6, "height": 1, "width": 0.8}], "caption": "AaBbCc × AaBbCc with additive alleles: 7 height classes in a 1:6:15:20:15:6:1 pattern", "labels": [{"at": [0, 1.99], "text": "1"}, {"at": [1, 6.99], "text": "6"}, {"at": [2, 15.99], "text": "15"}, {"at": [3, 20.99], "text": "20"}, {"at": [4, 15.99], "text": "15"}, {"at": [5, 6.99], "text": "6"}, {"at": [6, 1.99], "text": "1"}]}
```

### Example 3

In the model above, what fraction of offspring have the maximum height (all six adding alleles, AABBCC)?

By the product rule, each gene must be homozygous for the adding allele: $\tfrac14 \times \tfrac14 \times \tfrac14 = \tfrac{1}{64}$. The middle class (3 adding alleles) is the most common, $\tfrac{20}{64}$. With more genes, the classes get closer together and the histogram becomes a smooth bell curve. Environmental effects (nutrition, sunlight) blur the classes further.

## Genes and environment

The environment can change how a genotype is expressed:

- Hydrangea flowers with the same genotype are blue in acidic soil and pink in more alkaline soil.
- Himalayan rabbits have a temperature-sensitive pigment enzyme: their ears, nose and paws, the coolest parts of the body, are dark, while the warmer body is white.
- Phenylketonuria (PKU) is a recessive condition in which a person can't break down the amino acid phenylalanine. Without treatment it causes intellectual disability; with a low-phenylalanine diet from birth, people with PKU develop typically. The genotype is the same; the outcome depends on the environment.

Phenotype is the product of genotype and environment acting together.

## One gene, many effects; genes that affect other genes

**Pleiotropy** is when one gene affects several traits. The sickle-cell allele changes one amino acid in hemoglobin, and that one change leads to sickle-shaped red cells, anemia, pain, organ damage and, in carriers, some protection against malaria.

**Epistasis** is when one gene changes or masks the effect of another gene. In Labrador retrievers, gene B controls pigment color (B black, b brown/chocolate), but a second gene E controls whether pigment is deposited in the fur at all. A dog that is ee is yellow whatever its B genotype. A cross of two BbEe dogs gives 9 black : 3 chocolate : 4 yellow, a modified 9 : 3 : 3 : 1 in which the two classes with ee are merged.

## Common mistakes

- Confusing incomplete dominance with codominance. Intermediate blend in the heterozygote (pink) is incomplete dominance; both traits fully present (red and white hairs, A and B antigens) is codominance.
- Calling incomplete dominance "blending inheritance." The alleles stay separate and pure, as the 1 : 2 : 1 F2 shows.
- Thinking a person can have three ABO alleles. Multiple alleles exist in the population; each person has two.
- Forgetting that type A or B parents may carry a hidden $i$ allele.
- Using a 3 : 1 phenotype ratio for a heterozygote cross with incomplete dominance or codominance; it is 1 : 2 : 1.

## Key points

- Incomplete dominance: the heterozygote is intermediate; phenotype ratio = genotype ratio (1 : 2 : 1 from two heterozygotes).
- Codominance: the heterozygote shows both alleles' traits (AB blood, roan cattle).
- ABO blood groups: three alleles; $I^A$ and $I^B$ codominant, both dominant to $i$; four blood types from six genotypes.
- Polygenic traits come from many genes with additive effects and give continuous, bell-shaped variation.
- Pleiotropy: one gene, many traits. Epistasis: one gene masks or modifies another (9 : 3 : 4 in Labradors).
- The environment affects how genes are expressed.
