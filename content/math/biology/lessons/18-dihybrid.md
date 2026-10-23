---
id: bio-dihybrid
module: bio-m5
title: Dihybrid crosses and probability
minutes: 35
topics: [Dihybrid crosses, Probability in genetics]
drills: [bio-dihybrid, bio-dihybrid-count, bio-product-rule, bio-children]
refs: [bio-ref-genetics]
---
Lesson 17 followed one gene at a time. Real organisms inherit thousands of genes at once, so the next question Mendel asked was: when two traits are inherited together, do they travel as a package, or does each gene go its own way? His answer leads to the second law of inheritance, and it also gives us a fast method for any cross: treat each gene as a separate probability problem and multiply.

## Mendel's two-trait experiment

Mendel crossed a true-breeding plant with round, yellow seeds (RRYY) with one that had wrinkled, green seeds (rryy). Round (R) is dominant to wrinkled (r), and yellow (Y) is dominant to green (y).

Every F1 plant was RrYy, with round, yellow seeds, as expected from two dominant traits. A cross that follows two genes in parents heterozygous for both, such as RrYy × RrYy, is a **dihybrid cross**. When Mendel let the F1 self-pollinate, there were two possible outcomes:

- If the parental combinations were locked together (R always with Y, r always with y), the F2 would show only the two parental types, round-yellow and wrinkled-green, in a 3 : 1 ratio.
- If the genes sorted independently, new combinations (round-green, wrinkled-yellow) would also appear.

His F2 counts:

| Phenotype | Count | Fraction of 556 |
|---|---|---|
| Round, yellow | 315 | 0.567 |
| Round, green | 108 | 0.194 |
| Wrinkled, yellow | 101 | 0.182 |
| Wrinkled, green | 32 | 0.058 |

All four combinations appeared, close to $\tfrac{9}{16} = 0.5625$, $\tfrac{3}{16} = 0.1875$, $\tfrac{3}{16}$ and $\tfrac{1}{16} = 0.0625$: a 9 : 3 : 3 : 1 ratio.

## The law of independent assortment

The **law of independent assortment** says that the alleles of different genes separate into gametes independently of one another. Whether a gamete gets R or r tells you nothing about whether it gets Y or y.

For genes on different chromosomes, the cellular reason is the way homologous pairs line up in metaphase I of meiosis. Each pair orients at random, independently of the other pairs, so the chromosome carrying R is as likely to end up with the Y chromosome as with the y chromosome. An RrYy plant therefore makes four kinds of gametes in equal numbers: RY, Ry, rY and ry, each $\tfrac14$.

An important exception: genes that sit close together on the *same* chromosome tend to be inherited together because they ride on one piece of DNA. Such linked genes do not assort independently, although crossing over in meiosis sometimes separates them. Genes very far apart on one chromosome are separated by crossing over so often that they behave as if unlinked, but the reason is crossing over, not the random orientation of homologous pairs. Thomas Hunt Morgan's fruit-fly work around 1910 first showed linkage. Mendel's seven traits happen to behave independently, and in this module we assume genes are unlinked unless told otherwise.

## The 16-box Punnett square

With four gamete types from each parent, the Punnett square has $4 \times 4 = 16$ equally likely boxes.

| | RY | Ry | rY | ry |
|---|---|---|---|---|
| RY | RRYY | RRYy | RrYY | RrYy |
| Ry | RRYy | RRyy | RrYy | Rryy |
| rY | RrYY | RrYy | rrYY | rrYy |
| ry | RrYy | Rryy | rrYy | rryy |

Counting phenotypes: 9 boxes have at least one R and one Y (round, yellow), 3 have R but yy (round, green), 3 have rr but Y (wrinkled, yellow), and 1 is rryy (wrinkled, green). That is 9 : 3 : 3 : 1.

The square works, but it is slow and error-prone, and for three genes it would need 64 boxes. Probability rules do the same job much faster.

## The product rule and the sum rule

Two rules of probability cover nearly every genetics problem.

The **product rule**: the probability that two (or more) *independent* events both happen is the product of their separate probabilities.

$$P(A \text{ and } B) = P(A) \times P(B)$$

The **sum rule**: the probability that one *or* another of two mutually exclusive events happens (they cannot both happen) is the sum of their probabilities.

$$P(A \text{ or } B) = P(A) + P(B)$$

Because genes assort independently, a multi-gene cross splits into one-gene crosses. Solve each gene with a tiny 2 × 2 square (or from memory), then multiply. For RrYy × RrYy:

- Seed shape, Rr × Rr: round $\tfrac34$, wrinkled $\tfrac14$.
- Seed color, Yy × Yy: yellow $\tfrac34$, green $\tfrac14$.
- Round and green: $\tfrac34 \times \tfrac14 = \tfrac{3}{16}$. The 9 : 3 : 3 : 1 is just $(3 : 1) \times (3 : 1)$.

The sum rule handles "either way" outcomes. Within one gene, Aa × Aa gives a heterozygote two ways (A from the mother and a from the father, or the reverse), each $\tfrac12 \times \tfrac12 = \tfrac14$, so $P(\text{Aa}) = \tfrac14 + \tfrac14 = \tfrac12$.

### Example 1

In the cross AaBbCc × AaBbCc (three unlinked genes, each with complete dominance), find (a) the probability of an aabbcc offspring and (b) the probability of an offspring with the dominant phenotype for A and B but the recessive phenotype for C.

(a) For each gene, Xx × Xx gives xx with probability $\tfrac14$. By the product rule:

$$P(\text{aabbcc}) = \tfrac14 \times \tfrac14 \times \tfrac14 = \tfrac{1}{64}$$

(b) Dominant phenotype for a gene: $\tfrac34$. Recessive: $\tfrac14$.

$$P = \tfrac34 \times \tfrac34 \times \tfrac14 = \tfrac{9}{64}$$

A 64-box Punnett square would give the same answers after a lot more work.

### Example 2

Parents AaBb × aaBb. What fraction of offspring will be heterozygous for both genes (AaBb)?

Gene by gene:

- Aa × aa: offspring are Aa or aa, each $\tfrac12$ (a test cross). $P(\text{Aa}) = \tfrac12$.
- Bb × Bb: $P(\text{Bb}) = \tfrac12$.

Product rule: $P(\text{AaBb}) = \tfrac12 \times \tfrac12 = \tfrac14$.

The parents don't have to have the same genotype, and the genes don't have to be in the same state; just handle each gene with its own parental pair.

## Dihybrid test cross

A test cross works for two genes too. Cross a round, yellow plant of unknown genotype with rryy. If the unknown is RrYy, it makes RY, Ry, rY and ry gametes equally, and the rryy parent adds only ry, so the offspring show all four phenotypes in a 1 : 1 : 1 : 1 ratio. If it were RRYy, every offspring would be round, and color would split 1 yellow : 1 green.

## Families: combining the two rules

Probability rules also answer questions about several children. Each child is an independent event, so the product rule applies across children too.

### Example 3

Two parents are both carriers (Aa) of a recessive condition. They plan two children. What is the probability that (a) both children have the condition, and (b) exactly one of the two has it?

For each child, $P(\text{aa}) = \tfrac14$ and $P(\text{not aa}) = \tfrac34$.

(a) Both: $\tfrac14 \times \tfrac14 = \tfrac{1}{16}$.

(b) "Exactly one" can happen in two mutually exclusive orders:

- first child affected, second not: $\tfrac14 \times \tfrac34 = \tfrac{3}{16}$
- first not, second affected: $\tfrac34 \times \tfrac14 = \tfrac{3}{16}$

Sum rule: $\tfrac{3}{16} + \tfrac{3}{16} = \tfrac{6}{16} = \tfrac38$.

With more children, count the orders. For exactly $k$ affected among $n$ children, the number of orders is $\binom{n}{k}$, so

$$P = \binom{n}{k}\left(\tfrac14\right)^k\left(\tfrac34\right)^{n-k}.$$

For example, exactly 1 affected among 3 children: $3 \times \tfrac14 \times \tfrac34 \times \tfrac34 = \tfrac{27}{64}$.

Also remember that the past doesn't change the odds: if the couple's first child is affected, the chance that the next one is affected is still $\tfrac14$.

## Counting gamete types

An individual heterozygous for $n$ unlinked genes can make $2^n$ different gametes (each heterozygous gene doubles the options; homozygous genes add nothing). AaBb makes $2^2 = 4$ kinds, AaBbCc makes 8, and AaBBCc makes 4 (A/a × B × C/c).

## Common mistakes

- Listing gametes with two alleles of the same gene (Rr) or none of one gene. Each gamete gets exactly one allele of every gene.
- Adding when you should multiply. "And" for independent events multiplies; "or" for mutually exclusive outcomes adds.
- Forgetting the orders in "exactly one" problems. One affected child of two can be first or second, so multiply by 2.
- Assuming 9 : 3 : 3 : 1 for every two-gene cross. It holds only for two double heterozygotes with complete dominance and unlinked genes. Work out other crosses gene by gene.
- Thinking a previous child changes the next child's probability. Each fertilization is independent.

## Key points

- Law of independent assortment: alleles of different (unlinked) genes go into gametes independently. For genes on different chromosomes, the cause is the random orientation of each homologous pair at metaphase I.
- AaBb makes four gamete types equally; AaBb × AaBb gives 9 : 3 : 3 : 1.
- Product rule for "and" (independent events), sum rule for "or" (mutually exclusive events).
- Solve multi-gene crosses gene by gene, then multiply.
- Exactly $k$ of $n$ children: $\binom{n}{k}p^k(1-p)^{n-k}$.
- A heterozygote for $n$ unlinked genes makes $2^n$ gamete types.
