---
id: bio-biotech
module: bio-m6
title: Biotechnology
minutes: 40
topics: [Biotechnology, PCR, Gel electrophoresis]
drills: [bio-pcr-copies, bio-gel-size, bio-restriction-fragments]
refs: [bio-ref-lab]
---
The last three lessons described what DNA is, how it is copied, how it is read and how it changes. Every one of those facts became a tool. Biotechnology is the use of living things and their molecules to make products or answer questions, and modern biotechnology mostly means handling DNA directly: copying a gene, cutting it, sorting the pieces, moving it into another organism, or editing it in place. This lesson covers the core tools and the math that goes with them.

## Cutting DNA: restriction enzymes

Bacteria defend themselves against viruses with enzymes that cut foreign DNA. A **restriction enzyme** recognizes a specific short sequence, usually 4 to 8 base pairs, and cuts both strands there. The enzyme EcoRI, for example, recognizes

5′-GAATTC-3′
3′-CTTAAG-5′

and cuts between the G and the A on each strand. Notice the site reads the same 5′ → 3′ on both strands; most recognition sites are palindromes like this. Because the cuts are offset, each piece is left with a short single-stranded tail (AATT). These "sticky ends" can pair with any other piece cut by the same enzyme. (The bacterium protects its own DNA by adding methyl groups at its sites.)

Since a restriction enzyme cuts at every copy of its site, cutting a known DNA molecule gives predictable fragment sizes.

### Example 1

A linear DNA molecule of 10,000 base pairs (bp) has EcoRI sites at positions 3,000 and 7,500. What fragments does EcoRI produce? What if the same DNA were a circle?

- Linear: two cuts make three pieces. From the left end to the first cut: 3,000 bp. Between the cuts: 7,500 − 3,000 = 4,500 bp. From the second cut to the right end: 10,000 − 7,500 = 2,500 bp. Check: 3,000 + 4,500 + 2,500 = 10,000.
- Circular: a circle has no ends, so two cuts make only two pieces: 4,500 bp, and 10,000 − 4,500 = 5,500 bp.

In general, $n$ cuts give $n + 1$ fragments of a linear molecule and $n$ fragments of a circular one.

## Sorting DNA: gel electrophoresis

**Gel electrophoresis** separates DNA fragments by size. The DNA is loaded into wells at one end of a slab of gel (usually agarose, a jelly made from seaweed), and an electric current is run through it. DNA's phosphate backbone is negatively charged, so every fragment moves toward the positive electrode. The gel is a tangle of fibers, and short fragments slip through it faster than long ones. After a set time, fragments have spread out by size: the smallest are farthest from the wells. A dye makes the bands visible.

To measure size, one lane holds a ladder: a mixture of fragments of known sizes. Distance traveled is close to a straight line when plotted against the logarithm of size, so you can read an unknown off the ladder.

```plot
{"x": [25, 60], "y": [2.5, 4.2], "xLabel": "distance from well (mm)", "yLabel": "log of size (bp)", "functions": [{"f": "(110 - x)/20", "dashed": true}], "points": [{"at": [30, 4], "label": "10,000"}, {"at": [36.02, 3.699], "label": "5,000"}, {"at": [43.98, 3.301], "label": "2,000"}, {"at": [50, 3], "label": "1,000"}, {"at": [56.02, 2.699], "label": "500"}], "caption": "Ladder bands: log of fragment size falls along a straight line as distance increases"}
```

### Example 2

On the gel above, the ladder bands sit at these distances:

| Ladder band (bp) | 10,000 | 5,000 | 2,000 | 1,000 | 500 |
|---|---|---|---|---|---|
| Distance (mm) | 30.0 | 36.0 | 44.0 | 50.0 | 56.0 |

An unknown band traveled 47.0 mm. Estimate its size.

- It lies between the 2,000 bp band (44 mm) and the 1,000 bp band (50 mm), so its size is between 1,000 and 2,000 bp. Farther means smaller.
- Use the straight line: every 6 mm here is a factor of 2 in size, and every 20 mm is a factor of 10. The unknown is 3 mm short of the 1,000 bp band, so its log-size is $3 + 3/20 = 3.15$, and the size is $10^{3.15} \approx 1{,}400$ bp.

A linear guess halfway between 1,000 and 2,000 (1,500 bp) is close but not right; on a gel, halfway in distance means halfway in the logarithm.

## Copying DNA: PCR

Often there is too little DNA to study: a drop of blood at a crime scene, a single virus in a swab. **PCR** (polymerase chain reaction), invented by Kary Mullis in 1983, copies one chosen stretch of DNA billions of times in a few hours. A tube holds the DNA, two short primers that match the ends of the target stretch, free nucleotides, and a heat-resistant DNA polymerase (Taq polymerase, from a bacterium that lives in hot springs). A machine cycles the temperature:

1. Denature, about 95 °C: the two strands separate.
2. Anneal, about 50–65 °C: primers bind to their matching sequences on each strand.
3. Extend, about 72 °C: the polymerase builds new strands starting from the primers.

Each cycle takes a few minutes and, ideally, doubles the number of copies of the target. Starting with $N_0$ copies, after $n$ cycles there are

$$N = N_0 \times 2^n.$$

### Example 3

A sample has 50 copies of a target sequence. How many copies are there after 20 cycles, assuming perfect doubling?

$N = 50 \times 2^{20} = 50 \times 1{,}048{,}576 = 52{,}428{,}800$, about 52 million copies. Ten more cycles would multiply that by another $2^{10} = 1{,}024$. Real reactions run a bit below perfect doubling and level off once primers and nucleotides run low, so the formula gives the ideal maximum.

PCR is the basis of COVID-19 and other infection tests (after the virus's RNA is first copied into DNA), paternity tests, forensic work and studies of ancient DNA.

## Recombinant DNA and genetic engineering

Because the genetic code is nearly universal (lesson 23), a gene from one species can be expressed in another. **Recombinant DNA** is DNA joined together from different sources. The classic recipe uses a **plasmid**, a small circle of DNA that bacteria carry apart from their chromosome and copy on their own:

1. Cut the plasmid and the human insulin gene with the same restriction enzyme, so their sticky ends match.
2. Mix them; the ends pair, and DNA ligase seals the joints.
3. Put the recombinant plasmids into bacteria. Plasmids usually carry an antibiotic-resistance gene, so growing the bacteria on that antibiotic keeps only those that took up a plasmid.
4. Grow the bacteria in large tanks; they make human insulin.

Human insulin made this way was approved in 1982 and replaced insulin taken from pigs and cattle. An organism carrying a gene from another species is a **transgenic organism**. Examples include corn with a bacterial gene for an insect-killing protein (Bt corn), and Golden Rice, engineered to make beta-carotene to help prevent vitamin A deficiency.

## Editing genes: CRISPR

**CRISPR**-Cas9 also came from bacterial defense: bacteria store snippets of viral DNA and use a protein, Cas9, guided by a matching RNA, to cut that virus if it returns. In 2012 Jennifer Doudna and Emmanuelle Charpentier showed that the guide RNA could be designed to match almost any sequence, so Cas9 could cut a chosen gene in any organism. The cell's repair system then either disables the gene or inserts a supplied replacement. They received the 2020 Nobel Prize in Chemistry. In 2023 the first CRISPR-based treatment was approved, for sickle cell disease: doctors edit a patient's own blood stem cells outside the body to turn back on a fetal form of hemoglobin. Editing human embryos, whose changes would be inherited, remains widely opposed by scientists and regulators.

## Reading DNA: profiling and sequencing

Your genome differs from a stranger's at millions of places. **DNA profiling** compares a few highly variable regions. Forensic labs use short tandem repeats (STRs), places where a short sequence such as GATA is repeated a different number of times in different people. PCR copies about 20 STR regions, and electrophoresis measures their lengths. The chance that two unrelated people match at all of them is extremely small. Identical twins, though, share their profile.

### Example 4

At one STR region, evidence from a crime scene shows bands at 9 and 12 repeats. Suspect A has 9 and 12; suspect B has 9 and 14. What can be concluded from this one region?

Suspect B has a 14-repeat allele not in the evidence, so B is excluded as the source. Suspect A matches, but many people share any one pair of alleles, so one region can't identify A. Labs compare all regions; a match at every one is strong evidence, while a single mismatch excludes.

DNA sequencing reads the bases directly. The Human Genome Project finished a nearly complete human sequence in 2003, after 13 years and about $3 billion; today a genome can be sequenced in a day for a few hundred dollars.

## Common mistakes

- Saying DNA moves toward the negative electrode. It is negatively charged and moves toward the positive one.
- Thinking big fragments travel farthest. Small fragments move farthest from the wells.
- Using $N_0 \times 2n$ instead of $N_0 \times 2^n$ for PCR. Copies double each cycle; they don't add two.
- Forgetting that a circle cut $n$ times gives $n$ pieces, while a line gives $n + 1$.
- Treating a match at one STR region as proof of identity. One mismatch excludes; identity needs a match at every region.

## Key points

- Restriction enzymes cut DNA at specific (often palindromic) sequences, many leaving sticky ends.
- Gel electrophoresis separates negatively charged DNA by size; small fragments move farthest, and sizes are read from a ladder on a log scale.
- PCR copies a target by repeated denature–anneal–extend cycles; ideally $N = N_0 \times 2^n$.
- Recombinant DNA in plasmids lets bacteria make human proteins such as insulin; transgenic crops carry genes from other species.
- CRISPR-Cas9 edits chosen sequences; DNA profiling compares STR lengths; sequencing reads genomes base by base.
