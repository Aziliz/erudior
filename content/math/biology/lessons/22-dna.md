---
id: bio-dna
module: bio-m6
title: DNA structure and replication
minutes: 35
topics: [DNA structure, DNA replication]
drills: [bio-chargaff, bio-complement, bio-strand-counts]
refs: [bio-ref-genetics]
---
In the last module you followed genes through crosses and pedigrees without asking what a gene physically is. Mendel never knew; he only saw the ratios. This module opens the box. This lesson answers two questions: how do we know genes are made of DNA, and how does the shape of the DNA molecule let it be copied every time a cell divides?

## How biologists showed that genes are DNA

By the 1940s genes were known to sit on chromosomes, which are made of DNA and protein. Most biologists bet on protein: proteins use 20 different amino acids, while DNA has only four kinds of nucleotide, which seemed too simple to carry instructions. Three experiments changed their minds.

*Griffith, 1928.* Frederick Griffith worked with two strains of pneumonia bacteria. The S strain has a smooth sugar coat and kills mice; the R strain lacks the coat and is harmless. Heat-killed S bacteria were harmless too. But when he injected heat-killed S bacteria *mixed with* live R bacteria, the mice died, and live S bacteria came out of their blood. Something from the dead S cells had permanently changed the R cells, and the change was passed on to their descendants. Griffith called this transformation. He did not know what the "transforming principle" was.

*Avery, MacLeod and McCarty, 1944.* They purified extract from S cells and destroyed one kind of molecule at a time with enzymes before mixing it with R cells.

### Example 1

Here is the logic of the Avery experiment as a data table. Which molecule is the transforming principle?

| S-cell extract treated with | Live S cells appear? |
|---|---|
| Nothing | Yes |
| Protease (destroys protein) | Yes |
| RNase (destroys RNA) | Yes |
| DNase (destroys DNA) | No |

Reason through each row. Destroying protein did not stop transformation, so protein is not needed. The same holds for RNA. Only destroying DNA stopped it. The transforming principle is DNA. The untreated extract is the control: it shows transformation works at all.

*Hershey and Chase, 1952.* Some biologists still doubted, so Alfred Hershey and Martha Chase used a virus that infects bacteria (a bacteriophage). A phage is just protein wrapped around DNA, and it injects its genes into the bacterium. Protein contains sulfur but almost no phosphorus; DNA contains phosphorus but no sulfur. So they grew one batch of phages with radioactive sulfur (³⁵S, labeling protein) and another with radioactive phosphorus (³²P, labeling DNA). After infection, they shook the empty phage coats off in a blender and spun the bacteria down. The ³²P was found inside the bacteria; the ³⁵S stayed outside with the coats. The material that enters the cell and directs new phages is DNA.

## The structure of DNA

Recall from module 1 that DNA is a nucleic acid, a polymer of nucleotides. Each nucleotide has three parts: a phosphate group, the five-carbon sugar deoxyribose, and one of four nitrogen bases: adenine (A), thymine (T), guanine (G) and cytosine (C). A and G are purines, with a double ring; T and C are pyrimidines, with a single ring.

Nucleotides link into a strand through sugar–phosphate bonds, forming a backbone with the bases sticking out to one side. The two ends of a strand differ: one ends in a phosphate attached to the sugar's 5′ (five-prime) carbon, the other in the sugar's 3′ carbon. So every strand has a direction, written 5′ → 3′.

Two strands make the **double helix**, a twisted ladder. The sugar–phosphate backbones are the rails; pairs of bases are the rungs, held together by hydrogen bonds. The pairing follows strict rules, called **complementary base pairing**:

- A pairs with T (two hydrogen bonds);
- G pairs with C (three hydrogen bonds).

Each rung is one purine plus one pyrimidine, so every rung is the same width and the helix is a uniform 2 nm wide. The strands are **antiparallel**: they run in opposite directions, one 5′ → 3′ and its partner 3′ → 5′.

The model came together in 1953. Rosalind Franklin's X-ray photographs (with Maurice Wilkins's group) showed a helix of constant width with a repeating pattern every 3.4 nm. James Watson and Francis Crick combined her data with a key clue from chemistry, Chargaff's measurements, and built the model.

## Chargaff's rules

Erwin Chargaff measured the base composition of DNA from many species. He found two patterns, now called **Chargaff's rules**: in any double-stranded DNA, the amount of A equals the amount of T, and the amount of G equals the amount of C; but the proportion of A + T versus G + C varies from species to species. Base pairing explains the first rule at once: every A on one strand has a T across from it.

Human DNA is about 30% A, 30% T, 20% G and 20% C.

### Example 2

A sample of double-stranded DNA is 22% guanine. Find the percentages of the other three bases.

- G pairs with C, so C = 22%.
- G + C = 44%, so A + T = 100% − 44% = 56%.
- A = T, so each is 56% ÷ 2 = 28%.

Answer: A 28%, T 28%, G 22%, C 22%. Check: 28 + 28 + 22 + 22 = 100.

Chargaff's rules apply to the double helix as a whole, not to one strand. One strand can have far more A than T; its partner then has the extra T.

### Example 3

Write the strand complementary to 5′-ATGCCGTT-3′.

Pair each base in turn: A→T, T→A, G→C, C→G. Under the given strand, the partner bases are T A C G G C A A. Because the strands are antiparallel, the partner runs the other way, so its left end is 3′:

| Given strand | 5′- A T G C C G T T -3′ |
|---|---|
| Complement | 3′- T A C G G C A A -5′ |

If you are asked to write the complement in the usual 5′ → 3′ direction, read it from its 5′ end (the right): 5′-AACGGCAT-3′. Both descriptions are the same molecule. The safest habit is to write the complement directly under the original with its ends labeled.

## Replication is semiconservative

Watson and Crick noticed that base pairing suggests a copying method: separate the two strands, and each one is a template for building its partner. Each new double helix would then have one old strand and one new strand. This is **semiconservative replication**. Two other ideas were possible: conservative (the original helix stays intact and a wholly new one is made) and dispersive (old and new pieces mixed along both strands).

In 1958 Matthew Meselson and Franklin Stahl tested them. They grew bacteria for many generations on heavy nitrogen (¹⁵N), so all their DNA was heavy, then moved them to normal light nitrogen (¹⁴N) and let them divide. They spun DNA samples in a dense salt solution, where DNA settles in a band at its own density.

### Example 4

Predict the bands after one and two generations in light nitrogen if replication is semiconservative.

- Generation 0: all DNA is heavy/heavy: one heavy band.
- Generation 1: each helix has one old heavy strand and one new light strand: one band, halfway between heavy and light (hybrid). This alone rules out the conservative model, which would give separate heavy and light bands.
- Generation 2: the two strands of each hybrid separate. The heavy strand gets a light partner (hybrid); the light strand gets a light partner (light). Half the DNA is hybrid, half is light: two bands of equal amount.

That is exactly what Meselson and Stahl saw. The dispersive model predicts a single band that just drifts lighter each generation, so the two bands in generation 2 ruled it out too. In general, after $n$ generations the two original heavy strands sit in exactly two of the $2^n$ helices, so the hybrid fraction is $2/2^n$.

## The replication machinery

Copying is done by a team of enzymes:

1. Replication starts at specific sites called origins. A bacterial chromosome has one origin; a human chromosome has thousands, so the work is split among many replication forks.
2. Helicase unwinds the helix, breaking the hydrogen bonds between bases and forming a Y-shaped replication fork.
3. Primase lays down a short RNA primer, because the main copying enzyme cannot start a strand from nothing.
4. **DNA polymerase** reads the template and adds matching nucleotides. It can only add to the 3′ end of a growing strand, so new DNA is always built 5′ → 3′.
5. Because the two template strands are antiparallel, one new strand (the leading strand) is built continuously toward the fork. The other (the lagging strand) must be built in short pieces, working away from the fork each time a new stretch opens up. These pieces are **Okazaki fragments**, named for Reiji and Tsuneko Okazaki, who found them in the 1960s.
6. The RNA primers are replaced with DNA, and DNA ligase seals the gaps between fragments.

DNA polymerase also proofreads: it backs up and removes a wrongly paired base. With proofreading and later repair, the final error rate is roughly one mistake per billion bases copied. Errors that slip through are mutations, a topic in lesson 24.

## Common mistakes

- Pairing A with G or C with T. The pairs are always A–T and G–C (purine with pyrimidine).
- Applying Chargaff's rules to one strand. A = T and G = C hold for double-stranded DNA, not for a single strand or for RNA.
- Forgetting that A + T and G + C both add to 100%. If G is 22%, A is not 78%; G and C together are 44%, leaving 56% to split between A and T.
- Ignoring direction. The complement of a 5′ → 3′ strand runs 3′ → 5′; label the ends.
- Thinking the lagging strand is made in the 3′ → 5′ direction. Every new strand grows 5′ → 3′; the lagging strand is made in fragments precisely because of that rule.
- Saying Meselson and Stahl's first generation ruled out the dispersive model. Generation 1 rules out conservative; generation 2 rules out dispersive.

## Key points

- Griffith found transformation; Avery's enzyme tests identified DNA as the transforming principle; Hershey and Chase showed phage DNA, not protein, enters the cell.
- DNA is a double helix of two antiparallel strands with sugar–phosphate backbones and base pairs A–T and G–C.
- Chargaff's rules: in double-stranded DNA, A = T and G = C; the A + T to G + C ratio differs between species.
- Replication is semiconservative: each new helix keeps one old strand (Meselson–Stahl, 1958).
- Helicase unwinds, primase primes, DNA polymerase builds 5′ → 3′ (leading strand continuous, lagging strand in Okazaki fragments), ligase joins, and proofreading keeps errors near one per billion bases.
