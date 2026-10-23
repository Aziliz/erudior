---
id: bio-gene-regulation
module: bio-m6
title: Gene regulation and mutation
minutes: 35
topics: [Gene regulation, Mutations]
drills: [bio-mutation-effect]
---
Your skin cells and your nerve cells carry the same DNA, copied from the same fertilized egg. Yet one makes keratin and the other makes neurotransmitter receptors. The last lesson showed how a gene becomes a protein; this lesson asks when it does. Cells constantly decide which genes to express, and that control is what makes cell types different. The second half of the lesson looks at what happens when the DNA sequence itself changes.

## Why cells regulate genes

Making RNA and protein costs energy and raw materials. A bacterium that made every one of its roughly 4,000 proteins all the time would waste resources on enzymes it has no use for. A multicellular organism has a different problem: hundreds of cell types must each express the right set of genes, at the right time in development, in the right amount. Most regulation happens at the first step, transcription, because it is cheapest to not start making something you don't need.

## The lac operon: a switch in bacteria

The first gene switch to be understood was found by François Jacob and Jacques Monod in the bacterium *E. coli*, work that earned a Nobel Prize in 1965. *E. coli* prefers glucose, but it can live on lactose (milk sugar) if it has to. To use lactose it needs enzymes, including one that splits lactose into glucose and galactose. Those enzymes are made only when lactose is around.

In bacteria, genes that work together are often grouped into an **operon**: a cluster of genes controlled by a single promoter and transcribed together as one mRNA. The lac operon has:

- a promoter, where RNA polymerase binds;
- an operator, a short DNA sequence overlapping the promoter that acts as the on/off switch;
- three genes for lactose-handling enzymes, transcribed together.

A separate gene, always on, makes a **repressor** protein that binds the operator.

- *No lactose:* the repressor sits on the operator and blocks RNA polymerase. The genes are off.
- *Lactose present:* a form of lactose binds the repressor and changes its shape, so it falls off the operator. RNA polymerase can now transcribe the genes. When the lactose is used up, the repressor binds again and the genes switch off.

The system is a negative feedback loop: the enzymes destroy the very signal that turns them on. (A second control, through an activator protein, keeps the operon low when glucose is also present, because the cell prefers glucose.)

### Example 1

Jacob and Monod worked out this model largely by studying mutant bacteria. Predict whether the lac genes are on or off in each case.

| Strain | Lactose absent | Lactose present |
|---|---|---|
| Normal | off | on |
| Repressor can't bind DNA | ? | ? |
| Repressor can't bind lactose | ? | ? |
| Operator changed so repressor can't bind it | ? | ? |

- Repressor can't bind DNA: nothing ever blocks the operator, so the genes are on in both conditions (always on).
- Repressor can't bind lactose: it stays on the operator even when lactose arrives, so the genes are off in both conditions (never induced).
- Operator mutated: the repressor has nowhere to bind, so the genes are on in both conditions, just like the first mutant.

Patterns like these, where the gene is stuck on or stuck off, are how the parts of the switch were identified.

## Gene regulation in eukaryotes

Eukaryotic cells regulate at many more steps, but the main control is still transcription.

- **Transcription factors** are proteins that bind to DNA near a gene and help or block RNA polymerase. Some bind the promoter; others bind enhancers, control regions that may sit thousands of bases away and loop over to touch the promoter. A gene is usually controlled by a combination of factors, so a few hundred transcription factors in different combinations can specify many cell types.
- *Packing.* DNA is wound around histone proteins. Tightly packed regions are hard for RNA polymerase to reach and stay silent; loosely packed regions can be transcribed. Chemical tags such as methyl groups on DNA, and tags on histones, change packing. These tags can be copied when cells divide, so a liver cell's daughters stay liver cells. Inherited changes in gene activity that don't change the DNA sequence are called epigenetic.
- *After transcription.* Cells also control RNA splicing (lesson 23), how long an mRNA lasts before it is broken down, whether it is translated (small RNAs called microRNAs can block it), and whether the finished protein is activated or destroyed.

In development, cell differentiation is gene regulation. Early embryonic cells switch on different transcription factors depending on their position, and those factors switch on further genes. Master regulators such as the Hox genes, which set up the head-to-tail body plan of animals from flies to people, are themselves transcription factors. A mutation in one Hox gene of a fruit fly can grow legs where its antennae should be.

## Mutations

A **mutation** is any change in the DNA sequence. Mutations arise in two main ways:

- *Spontaneously,* mostly from rare copying errors that slip past proofreading and repair (lesson 22).
- *From a* **mutagen**, an agent that damages DNA or raises the error rate: ultraviolet light (which links neighboring thymines), X-rays and other ionizing radiation, and chemicals such as some in tobacco smoke.

Where the mutation happens matters. A mutation in a body (somatic) cell is passed only to that cell's descendants; it can contribute to cancer (module 4) but is not inherited by children. A mutation in a cell that makes eggs or sperm (a germline mutation) can be passed on.

### Point mutations

A **point mutation** changes a single base. When one base is swapped for another (a substitution), the effect on the protein depends on the codon it lands in:

| Type | What changes | Example |
|---|---|---|
| Silent | Codon changes but still codes for the same amino acid | GAA → GAG: Glu → Glu |
| Missense | Codon now codes for a different amino acid | GAA → GUA: Glu → Val |
| Nonsense | Codon becomes a stop codon; the protein is cut short | UGG → UGA: Trp → Stop |

Sickle cell disease comes from a single missense mutation in the gene for a hemoglobin chain: codon 6 changes from GAG to GUG, putting valine where glutamic acid should be. That one change makes the hemoglobin molecules stick together into stiff fibers when oxygen is low, bending red blood cells into a sickle shape. One base out of hundreds in the gene changes how the protein behaves.

### Insertions and deletions

Adding or removing bases is more drastic. Because the ribosome reads in fixed groups of three from the start codon, inserting or deleting one or two bases shifts every codon after the change. This is a **frameshift mutation**. The amino acids downstream are all different, and a stop codon usually turns up early.

An insertion or deletion of exactly three bases (or any multiple of three) keeps the reading frame. The most common cystic fibrosis mutation is a deletion of three bases that removes one phenylalanine from a protein of about 1,480 amino acids. The protein misfolds, but the rest of its sequence is intact.

### Example 2

The normal mRNA is 5′-AUG GAA UGG CUA AAA UAA-3′, which codes for Met–Glu–Trp–Leu–Lys. Classify each mutation.

1. Codon 2 GAA → GAG. GAG still codes for Glu: silent.
2. Codon 2 GAA → GUA. GUA codes for Val: missense (Glu → Val).
3. Codon 3 UGG → UGA. UGA is a stop codon: nonsense. The protein is Met–Glu only.
4. The G of codon 2 is deleted. Re-read in threes from AUG: AUG AAU GGC UAA. The protein is Met–Asn–Gly, then stop. Every codon after the deletion changed, and a stop codon appeared early: frameshift.

Notice the method: write the new sequence, re-split it into codons starting from AUG, and translate. Don't just translate the one codon you think changed.

## Mutations are the raw material of variation

Most mutations are neutral (in DNA that doesn't code for anything, or silent) or harmful. A few are helpful in a particular environment. A mutation that keeps the lactase gene switched on in adults spread in human populations that kept dairy animals. Mutations are the ultimate source of new alleles; meiosis and fertilization (module 4) only reshuffle alleles that already exist. Module 7 shows how natural selection acts on that variation.

## Common mistakes

- Thinking different cells have different genes. Nearly all cells in a body have the same DNA; they express different parts of it.
- Mixing up the operator and the promoter. RNA polymerase binds the promoter; the repressor binds the operator.
- Saying lactose turns on the operon by binding the DNA. Lactose binds the repressor, which then lets go of the DNA.
- Calling every deletion a frameshift. Deleting three bases removes one amino acid and keeps the frame.
- Assuming every mutation is harmful. Many are neutral and some are beneficial.
- Thinking a somatic mutation is inherited. Only germline mutations reach the next generation.

## Key points

- Cells regulate which genes they express, mostly at transcription; different cell types differ in gene expression, not in genes.
- The lac operon: a repressor bound to the operator blocks transcription; lactose binds the repressor and releases it, switching the genes on.
- Eukaryotes use transcription factors, enhancers, DNA packing and epigenetic tags, plus control after transcription.
- Mutations come from copying errors and mutagens; only germline mutations are inherited.
- Substitutions can be silent, missense or nonsense; insertions and deletions not in multiples of three cause frameshifts.
- Mutation is the ultimate source of new alleles, the variation evolution works on.
