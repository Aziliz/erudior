# Round 2 notes: module 6 (DNA, genes, and biotechnology)

`content/math/check-module.sh biology m6`: 0 problems (6 lessons, 94 questions, 14 drills, 50 cards).

## Added

**Honors lessons**
- `lessons/25h1-regulation-depth.md` (bio-h-regulation-depth, "Operons, transcription factors, and epigenetics", 45 min, ~2,140 words of prose plus tables). Inducible vs repressible operons (lac, trp, corepressor), CAP–cAMP positive control (4-condition table), cis vs trans with lac partial diploids (Example 1: four genotypes incl. $O^C$ and $I^S$), general TFs, enhancers, looping and Mediator, combinatorial control, reporter-assay enhancer mapping (Example 2, data table), chromatin, histone acetylation, CpG DNA methylation and its maintenance after replication, X inactivation, imprinting (IGF2), caution on transgenerational epigenetic claims, alternative splicing (Example 3: Dscam 38,016), microRNAs (seed, Argonaute, 2024 Nobel).
- `lessons/25h2-genomics.md` (bio-h-genomics, "Sequencing, genomics, and gene editing", 45 min, ~1,980 words). Sanger chain termination (Example 1: read fragments), next-generation and long-read sequencing, coverage $C = NL/G$ and $e^{-C}$ missed fraction (Example 2), genome findings (T2T 2022, ~1.5% coding, ~20,000 genes, SNPs ~1/1,000), alignment and percent identity (Example 3, silent third positions), Cas9 mechanism (PAM, guide, cut 3 bp from PAM; Example 4: guide design and the $2G/4^{20}$ uniqueness estimate), repair outcomes, base/prime editors and dCas9, gene therapy (vectors, ex/in vivo, Gelsinger and X-SCID setbacks, Luxturna, Zolgensma, Casgevy and the BCL11A enhancer), ethics as four perspectives (somatic/cost, germline incl. 2018 twins and 2023 summit, disability perspectives, genetic privacy/GINA).

**Core lessons (pictures/diagrams added in place, existing text unchanged apart from linking sentences)**
- 22-dna: `m6-dna-structure.svg` (helix + untwisted ladder with nucleotide box), `m6-meselson-stahl.svg` (density tubes, gens 0–2), `m6-replication-fork.svg`.
- 23-protein-synthesis: Mermaid central-dogma flowchart (nucleus/cytoplasm), `m6-transcription.svg` (bubble, template/coding strands), `m6-translation.svg` (ribosome on the Example 2 mRNA).
- 24-gene-regulation: `m6-lac-operon.svg` (no lactose / lactose), Mermaid mutation-classification flowchart.
- 25-biotech: Mermaid PCR cycle, `m6-gel.svg` (STR gel drawn for Example 4: allelic ladder 8–15, evidence, suspects A and B). The existing ladder plot stays.

**Honors pictures/diagrams**: `m6-enhancer-loop.svg`, `m6-chromatin.svg`, `m6-alt-splicing.svg`, Mermaid microRNA pathway (25h1); `m6-sanger.svg`, `m6-crispr-cas9.svg`, Mermaid Cas9 repair outcomes (25h2).
**Blank versions for label questions**: `m6-dna-structure-blank`, `m6-translation-blank`, `m6-lac-operon-blank`, `m6-gel-blank`, `m6-enhancer-loop-blank`, `m6-crispr-cas9-blank`. All 18 SVGs are original, under 16 KB, and were rendered and checked (with markers for the blank ones).

**Questions (`questions/m06.yaml`)**: 52 new.
- Core bio-q-0643–0662 (5 per lesson): per lesson 1 label, 1 text, 1 order, 1 match, 1 select-all. module_quiz on 0643, 0646, 0648, 0652, 0653, 0657, 0658, 0662 (2 per lesson).
- Honors bio-qh-0601–0616 (25h1) and bio-qh-0617–0632 (25h2): 16 each, 10 multiple choice + 6 other types each (h1: 2 select-all, match, text, label, order; h2: select-all, match, 2 text, label, order). No module_quiz flags (honors lesson in a core module).
- Multiple-choice answer positions, whole file: 0 = 16, 1 = 16, 2 = 15, 3 = 15 (new honors MC: 5/5/5/5).

**Drills (`drills/m06.yaml`)**: 4 new: bio-h-splice-isoforms (25h1); bio-h-coverage, bio-h-chance-matches, bio-h-percent-identity (25h2).
**Glossary (`glossary-m6.yaml`)**: 24 new (inducible operon, repressible operon, corepressor, CAP, trans-acting, cis-acting, general transcription factors, enhancer, histone, nucleosome, chromatin, DNA methylation, epigenetics, alternative splicing, microRNA, dideoxynucleotide, Sanger sequencing, next-generation sequencing, coverage, genome, SNP, guide RNA, PAM, gene therapy). Checked against every glossary-*.yaml: no term or alias collisions.
**Cards (`cards-m6.yaml`)**: 22 new (13 for 25h1, 9 for 25h2); 50 total.

## For a reviewer to double-check
- Partial-diploid predictions in 25h1 Example 1 and bio-qh-0604 ($I^S O^+ Z^+$ / $I^+ O^C Z^+$ → constitutive from the $O^C$ copy). These are the standard textbook outcomes, assuming no glucose.
- Glucose effect: the lesson gives CAP–cAMP as the main mechanism and mentions inducer exclusion in one sentence. Current models include both.
- The trp attenuation mechanism is deliberately left out.
- Numbers: nucleosome ~147 bp; TATA box ~25–30 bp upstream; ~95% of multi-exon human genes alternatively spliced; fly ~14,000 genes; Dscam 12 × 48 × 33 × 2 = 38,016; microRNA ~22 nt, seed bases 2–8; lin-4 1993 and the 2024 Nobel (Ambros, Ruvkun); Sanger 1977, reads ~800–1,000 bases; T2T 2022 (Y in 2023), ~8% added; ~1.5% coding, ~20,000 genes; unrelated people differ at ~1/1,000 bases; Cas9 PAM NGG, cut ~3 bp from the PAM; Luxturna 2017, Zolgensma 2019, Casgevy 2023 (BCL11A erythroid enhancer); list prices above $2 million; He Jiankui 2018; 2023 summit statement ("unacceptable at this time"); GINA 2008 (excludes life insurance).
- Example 4 (25h2) guide design: the strand was built so that TGG is the only NGG on the strand shown (checked by script). The lesson says to use only that strand.
- The reporter-assay data (25h1 Example 2, bio-qh-0605), the Sanger fragment sets, and the 20-base alignment are invented teaching data, labeled as examples, not real genes.
- Long-read and chromatin descriptions are simplified (e.g. "a camera records each cluster's color"; histone methylation summarized as "active or silent depending on which amino acid carries the mark").
- Core lesson 22 is now about 1,860 words of prose (it was ~1,740) because of the figure sentences.

## Errors found in existing content
None. Existing question ids and answers were not changed.

## Sources
Standard references for current facts: OpenStax Biology 2e (ch. 14–17) and AP Biology; NCBI/NHGRI fact sheets on the Human Genome Project, T2T and genomic variation; Nobel Prize press materials (2020 Chemistry, 2024 Physiology or Medicine); FDA approval announcements (Luxturna 2017, Zolgensma 2019, Casgevy Dec 2023); statement of the Third International Summit on Human Genome Editing (2023). Written from this knowledge; no web pages fetched in this session. All arithmetic (coverage, $e^{-C}$, $4^{20}$, $2G/4^k$, isoform counts, percent identity, Sanger reads, guide site) checked in Python.
