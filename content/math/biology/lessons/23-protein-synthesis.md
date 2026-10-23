---
id: bio-protein-synthesis
module: bio-m6
title: From gene to protein
minutes: 40
topics: [Transcription, Translation, Genetic code]
drills: [bio-transcribe, bio-translate, bio-codon-count]
refs: [bio-ref-genetics]
---
The last lesson showed how DNA is copied. But a gene is not useful just sitting in the nucleus being copied; it has to *do* something. Almost everything a gene does, it does through a protein: an enzyme, a channel, a hormone receptor, a structural fiber. This lesson follows the path from a stretch of DNA to a finished protein, and explains how a four-letter alphabet spells out sequences of 20 amino acids.

## The central dogma

Francis Crick summed up the flow of genetic information in 1958 as the **central dogma**: DNA → RNA → protein. Information is copied from DNA into RNA by **transcription**, and the RNA's message is decoded into a chain of amino acids by **translation**. Using a gene's information to make its product is called gene expression.

There are exceptions to the simple arrow. Retroviruses such as HIV copy RNA back into DNA, and many genes make RNA molecules that are never translated but do jobs of their own. Still, the main traffic of information goes DNA → RNA → protein, and it never goes from protein back to nucleic acid.

Why use an RNA middleman at all? In eukaryotes the DNA stays in the nucleus, while ribosomes work in the cytoplasm. A gene can be transcribed into many RNA copies, each translated many times, so one gene can make thousands of protein molecules quickly while the master copy stays protected.

## RNA is not DNA

RNA is a nucleic acid too, but it differs from DNA in three ways:

| | DNA | RNA |
|---|---|---|
| Sugar | deoxyribose | ribose |
| Bases | A, T, G, C | A, U, G, C (uracil replaces thymine) |
| Strands | usually two (double helix) | usually one |

Uracil pairs with adenine, just as thymine does. Three kinds of RNA do the main work of protein synthesis:

- **mRNA** (messenger RNA) carries a gene's sequence to the ribosome.
- **tRNA** (transfer RNA) brings amino acids to the ribosome; each tRNA carries one specific amino acid.
- **rRNA** (ribosomal RNA) makes up much of the ribosome and catalyzes the bonds between amino acids.

## Transcription

Transcription copies one gene, not a whole chromosome, and it uses only one of the two DNA strands as a pattern.

1. *Initiation.* The enzyme **RNA polymerase** binds to a **promoter**, a DNA sequence just upstream of the gene that marks where to start and which strand to read. It unwinds a short stretch of the helix.
2. *Elongation.* RNA polymerase moves along the template strand, adding RNA nucleotides that pair with the template bases (A with U, T with A, G with C, C with G). Like DNA polymerase, it builds 5′ → 3′, so it reads the template 3′ → 5′. Unlike DNA polymerase, it needs no primer.
3. *Termination.* At a terminator sequence the polymerase releases the RNA and the DNA rewinds.

The DNA strand that is read is the template strand. The other strand is called the coding strand, because its sequence matches the mRNA (with T in place of U).

In eukaryotes the new RNA is processed before it leaves the nucleus. A protective cap is added to its 5′ end and a tail of many A's to its 3′ end. Most genes also contain **introns**, stretches that are cut out, and **exons**, the stretches that are spliced together and expressed. Splicing can join exons in different combinations, which is one reason humans make far more kinds of protein than their roughly 20,000 protein-coding genes.

### Example 1

A DNA template strand reads 3′-TACGGATCC-5′. Write the mRNA.

Pair each template base with its RNA partner: T→A, A→U, C→G, G→C, G→C, A→U, T→A, C→G, C→G. The mRNA is antiparallel to the template, so its left end is 5′:

5′-AUGCCUAGG-3′.

Check with the coding strand: it would be 5′-ATGCCTAGG-3′, the same as the mRNA with T for U. A common error is to write the DNA complement (ATGCCTAGG) and forget that RNA uses U.

## The genetic code

Four bases cannot code for 20 amino acids one at a time, or even two at a time ($4^2 = 16$). Three at a time gives $4^3 = 64$ combinations, enough with some to spare. Each group of three mRNA bases is a **codon**. In 1961 Marshall Nirenberg and Heinrich Matthaei cracked the first word: they added an artificial mRNA made only of U's (UUUUUU…) to a cell-free extract, and it made a protein made only of phenylalanine. So UUU means Phe. Within five years all 64 codons were assigned.

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

To read the table, find the first base in the left column, the second base in the column headings, and the third base on the right. The code has four features worth knowing:

- *Start and stop.* AUG codes for methionine (Met) and is also the start codon where translation begins. UAA, UAG and UGA are stop codons: no tRNA matches them, and they end translation.
- *Redundant.* 61 codons code for 20 amino acids, so most amino acids have several codons (Leu has six). The extra codons usually differ in the third base, so many third-base changes don't change the protein.
- *Unambiguous.* Each codon means exactly one thing.
- *Nearly universal.* Bacteria, plants and people read codons almost the same way, which is strong evidence that all life shares a common ancestor, and the reason a human gene can be expressed in bacteria (lesson 25).

## Translation

Translation happens on ribosomes. Each tRNA has, at one end, an **anticodon**: three bases that pair with an mRNA codon. At the other end it carries the amino acid that codon specifies. The tRNA is the adapter that connects the nucleic acid language to the protein language.

1. *Initiation.* The small ribosomal subunit attaches to the mRNA near its 5′ end and slides to the first AUG. A tRNA with anticodon UAC, carrying Met, pairs with it, and the large subunit joins. The AUG sets the reading frame: from here the mRNA is read in non-overlapping groups of three.
2. *Elongation.* The next tRNA whose anticodon matches the next codon enters the ribosome. The rRNA joins its amino acid to the growing chain with a peptide bond. The ribosome shifts one codon along the mRNA (toward the 3′ end), the empty tRNA leaves to be reloaded, and the cycle repeats.
3. *Termination.* When a stop codon enters the ribosome, a release factor (a protein, not a tRNA) binds, the finished chain is let go, and the ribosome comes apart.

The new chain then folds into its three-dimensional shape, sometimes helped by other proteins, and may be modified or sent to the endoplasmic reticulum and Golgi apparatus you met in module 2.

### Example 2

Translate the mRNA 5′-GCAUGUUUGGCAAAUGAUC-3′.

- Find the start codon. Scanning from the 5′ end, the first AUG begins at the third base: GC AUG UUU…, so the reading frame starts there and the GC before it is not translated.
- Split into codons from AUG: AUG | UUU | GGC | AAA | UGA | UC.
- Look up each: AUG = Met, UUU = Phe, GGC = Gly, AAA = Lys, UGA = Stop.

The polypeptide is Met–Phe–Gly–Lys: four amino acids. The stop codon adds nothing, and the bases after it are not read.

### Example 3

A tRNA has the anticodon 3′-AAG-5′. Which amino acid does it carry?

The anticodon pairs with the codon, so the codon is the complement: A pairs with U, A with U, G with C, giving 5′-UUC-3′. From the table, UUC codes for Phe. Don't look up the anticodon itself in the table; the table is written in codons.

## Common mistakes

- Writing T in an mRNA. RNA uses U; the mRNA matches the coding strand, not the template strand.
- Translating from the first base instead of the first AUG.
- Looking up anticodons or DNA triplets in the codon table. The table lists mRNA codons.
- Counting the stop codon as an amino acid. A coding region of $n$ codons, start to stop, makes $n - 1$ amino acids.
- Saying ribosomes are made of protein only. rRNA forms the core and catalyzes peptide bonds.
- Thinking each gene makes exactly one protein. Alternative splicing lets one gene make several.

## Key points

- Central dogma: DNA → (transcription) → RNA → (translation) → protein.
- RNA has ribose, uracil instead of thymine, and is usually single-stranded; mRNA, tRNA and rRNA work together to make proteins.
- RNA polymerase starts at a promoter and builds an RNA complementary to the template strand. Eukaryotic RNA gets a cap and tail, and its introns are removed.
- The genetic code uses triplet codons: 64 codons, AUG = start (Met), three stops, redundant, unambiguous and nearly universal.
- tRNA anticodons pair with codons; the ribosome links amino acids in codon order from AUG to the stop codon.
