---
id: bio-sex-linked
module: bio-m5
title: Sex-linked traits and pedigrees
minutes: 35
topics: [Sex linkage, Pedigrees]
drills: [bio-x-linked]
refs: [bio-ref-genetics]
---
In every cross so far, it made no difference which parent carried which allele: Aa mother × aa father gave the same results as aa mother × Aa father. That's true for most genes, but not all. Some traits, such as red-green color blindness and hemophilia, show up far more often in males than in females. This lesson explains why, using the chromosomes that differ between the sexes, and then shows how geneticists study human inheritance when they can't run experimental crosses: by reading family trees.

## Sex chromosomes and autosomes

Human body cells have 23 pairs of chromosomes. In 22 of the pairs, the two members match in size and carry the same genes; these are **autosomes**. The 23rd pair are the **sex chromosomes**, X and Y. Most females have two X chromosomes (XX) and most males have one X and one Y (XY). (Some people have other combinations, such as XXY; lesson 21 covers how these arise.)

The X is a large chromosome carrying around 800 protein-coding genes, most of which have nothing to do with sex: genes for color vision, blood clotting and muscle proteins, among others. The Y is small and carries fewer than 100 genes, including *SRY*, a gene that triggers development of testes in the embryo.

Inheritance of the sex chromosomes is simple. A mother always passes on an X. A father passes on either his X (the child is XX, typically female) or his Y (the child is XY, typically male), each with probability $\tfrac12$. So:

- a son always gets his X from his mother and his Y from his father;
- a daughter gets one X from each parent, and always gets her father's only X.

## X-linked genes

A gene on the X chromosome is **X-linked** (more generally, sex-linked). Males have only one X, so they have only one allele of every X-linked gene. Whatever allele that X carries is expressed, dominant or recessive, because there is no second copy to mask it. Females have two copies, so for a recessive X-linked trait they behave like any other gene: they need two recessive alleles to show it.

We write X-linked alleles as superscripts on the X: $X^B$ (normal color vision, dominant) and $X^b$ (red-green color blindness, recessive). The Y carries no allele for this gene.

| Genotype | Phenotype |
|---|---|
| $X^BX^B$ | female, normal vision |
| $X^BX^b$ | female, normal vision, **carrier** |
| $X^bX^b$ | female, color-blind |
| $X^BY$ | male, normal vision |
| $X^bY$ | male, color-blind |

A carrier is an individual who has one copy of a recessive allele but does not show the trait; she can pass the allele on. (The word is also used for heterozygotes of autosomal recessive conditions.)

This is why recessive X-linked traits are much more common in males. A male needs only one copy of the allele; a female needs two. If a fraction $q$ of X chromosomes carry the allele, about $q$ of males are affected but only about $q^2$ of females. Red-green color blindness affects roughly 8% of men of Northern European ancestry but only about 0.5% of women, close to $0.08^2 = 0.0064$.

## Morgan's white-eyed fly

The first gene ever tied to a specific chromosome was X-linked. In 1910 Thomas Hunt Morgan, breeding fruit flies (*Drosophila*), found a single male with white eyes instead of the normal red. He crossed it with a red-eyed female. All the F1 had red eyes, so white was recessive. In the F2, he saw the expected 3 red : 1 white, with a twist: every white-eyed fly was male.

Morgan explained this by putting the eye-color gene on the X chromosome (fruit flies use XX/XY like humans). The original male was $X^wY$; the female was $X^WX^W$. The F1 females were $X^WX^w$ and the F1 males $X^WY$. In the F2, sons get their single X from their carrier mother, so half are white-eyed, while every daughter gets the father's $X^W$ and has red eyes. This was the first strong evidence for the chromosome theory of inheritance: genes are located on chromosomes.

### Example 1

A woman who is a carrier for hemophilia A ($X^HX^h$) and a man without hemophilia ($X^HY$) have children. Find the probability that (a) a son has hemophilia, (b) a daughter has hemophilia, and (c) a child of theirs, sex not yet known, is a son with hemophilia.

| | $X^H$ | $Y$ |
|---|---|---|
| $X^H$ | $X^HX^H$ | $X^HY$ |
| $X^h$ | $X^HX^h$ | $X^hY$ |

(a) Sons are the right column: $X^HY$ and $X^hY$, so $P(\text{affected} \mid \text{son}) = \tfrac12$.

(b) Daughters (left column) all get $X^H$ from their father: none are affected, though half are carriers.

(c) Among all four equally likely boxes, one is $X^hY$: $\tfrac14$. Equivalently, $P(\text{son}) \times P(\text{affected} \mid \text{son}) = \tfrac12 \times \tfrac12 = \tfrac14$.

Be careful to read which question is asked: "the probability that a son is affected" ($\tfrac12$) is not "the probability that a child is an affected son" ($\tfrac14$).

### Example 2

A color-blind man ($X^bY$) and a woman homozygous for normal vision ($X^BX^B$) have children. What fraction of their sons and daughters are color-blind?

Every son gets his X from his mother: $X^B$. No sons are color-blind, and the father's allele can never reach a son. Every daughter gets the father's $X^b$ and a mother's $X^B$: all daughters are carriers ($X^BX^b$) with normal vision. The trait then tends to reappear in the daughters' sons, skipping a generation through carrier females.

## Pedigrees

Geneticists can't arrange human matings, so they work backward from family histories drawn as a **pedigree**, a chart of a family's relationships showing who has a trait. The standard symbols:

- square = male, circle = female;
- filled symbol = has the trait; open symbol = does not;
- a dot inside or a half-filled symbol = known carrier (not always shown);
- a horizontal line joining a male and a female = a mating; a vertical line down from it leads to their children, drawn left to right in birth order;
- generations are labeled with Roman numerals (I, II, III).

```shape
{"x": [-1.5, 6], "y": [0.8, 5], "polygons": [{"points": [[0.5, 3.5], [1.5, 3.5], [1.5, 4.5], [0.5, 4.5]]}, {"points": [[0, 1.5], [1, 1.5], [1, 2.5], [0, 2.5]], "fill": true}, {"points": [[4, 1.5], [5, 1.5], [5, 2.5], [4, 2.5]]}], "circles": [{"center": [4, 4], "r": 0.5}, {"center": [4, 4], "r": 0.12, "fill": true}, {"center": [2.5, 2], "r": 0.5}], "segments": [{"from": [1.5, 4], "to": [3.5, 4]}, {"from": [2.5, 4], "to": [2.5, 2.9]}, {"from": [0.5, 2.9], "to": [4.5, 2.9]}, {"from": [0.5, 2.9], "to": [0.5, 2.5]}, {"from": [2.5, 2.9], "to": [2.5, 2.5]}, {"from": [4.5, 2.9], "to": [4.5, 2.5]}], "labels": [{"at": [-1, 4], "text": "I"}, {"at": [-1, 2], "text": "II"}], "caption": "An X-linked recessive pattern: an unaffected father and a carrier mother (dot) have an affected son, an unaffected daughter and an unaffected son"}
```

The main inheritance patterns leave recognizable signatures:

| Pattern | Clues in a pedigree |
|---|---|
| Autosomal recessive | Often skips generations; two unaffected parents can have an affected child; males and females affected about equally |
| Autosomal dominant | Every affected person has at least one affected parent; does not skip generations; two affected parents can have an unaffected child; both sexes affected |
| X-linked recessive | Many more affected males than females; affected sons usually have unaffected (carrier) mothers; never passed from father to son |

Examples: cystic fibrosis and sickle-cell disease are autosomal recessive; Huntington's disease and achondroplasia are autosomal dominant; hemophilia A, Duchenne muscular dystrophy and red-green color blindness are X-linked recessive.

### Example 3

Two parents who do not have a condition have a daughter who does. What inheritance pattern does this show, and what is the probability that her unaffected brother is a carrier?

- Not dominant: a dominant trait in the daughter would require an affected parent.
- Not X-linked recessive: an affected daughter would need $X^aX^a$, with one $X^a$ from her father, and he would then be affected.
- So it is autosomal recessive, and both parents must be carriers, Aa × Aa.

The brother is unaffected, so he is AA or Aa, not aa. Among the Punnett boxes that are not aa, 1 is AA and 2 are Aa. So his probability of being a carrier is $\tfrac23$, not $\tfrac12$. Knowing he is unaffected removes the aa box from consideration.

Sorting out a pedigree this way, by asking which patterns are impossible, is usually faster than trying to prove the right one directly.

## Common mistakes

- Giving a male two alleles for an X-linked gene, or writing an allele on the Y.
- Saying a son inherited an X-linked trait from his father. Sons get their X from their mother.
- Mixing up "probability a son is affected" (out of sons only) and "probability a child is an affected son" (out of all children).
- Assuming X-linked traits never appear in females. A female is affected if she gets a recessive allele from both her carrier mother and her affected father.
- In pedigrees, deciding "dominant" because a trait is in many people. Look for the deciding clues: a trait skipping a generation, or two unaffected parents with an affected child, rules dominance out.

## Key points

- Humans have 22 pairs of autosomes and one pair of sex chromosomes (XX or XY in most people).
- Males have one allele of each X-linked gene, so a recessive X-linked allele always shows in a male.
- Sons get their X from their mother; fathers give their X to every daughter and never to a son.
- Carrier mother × unaffected father: half the sons affected, half the daughters carriers, no affected daughters.
- Pedigrees use squares, circles, and filled symbols; rule out patterns using the clues for autosomal recessive, autosomal dominant and X-linked recessive inheritance.
