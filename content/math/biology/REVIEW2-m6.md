# Round 2 review: module 6 (DNA, genes, and biotechnology)

Reviewer: independent round 2 reviewer. Scope: new pictures/diagrams in lessons 22–25, honors lessons
25h1 and 25h2, new questions (bio-q-0643–0662, bio-qh-0601–0632), honors drills (bio-h-*), new glossary
entries and cards, all 18 `images/m6-*.svg`, NOTES2-m6.md.

`content/math/check-module.sh biology m6` after fixes: OK, 0 problems (6 lessons, 94 questions, 14 drills, 50 cards).

## Counts

- Answer-key errors: 0
- Factual fixes: 0 (2 precision tightenings, below)
- Picture fixes: 0
- Other fixes: 3 (accept lists, diagram wording)

## Changes

| Where | Problem | Change |
|---|---|---|
| 25h1 Key points (last bullet) | "microRNAs pair with mRNA 3′ ends" is loose; the lesson body (correctly) says the seed pairs with sites in the 3′ untranslated region. | Now "pair with sites in mRNA 3′ untranslated regions to reduce translation and speed mRNA decay". |
| cards-m6 "How a microRNA works" | Same "3′ ends" wording. | "pairs with sites in target mRNA 3′ untranslated regions". |
| bio-qh-0616 (order), item 5 | Same "3′ end" wording. | "...a site in the target mRNA's 3′ untranslated region". Order unchanged. |
| 25h2 Mermaid, Cas9 repair outcomes | Node said indels always give "Frameshift: gene knocked out"; an indel that is a multiple of 3 keeps the frame (the accDescr already said "usually"). | Node now "Often a frameshift: gene knocked out". |
| bio-q-0654 (text) | Reasonable answer "lac operator" not accepted. | Added to second blank. |
| bio-qh-0629 (text) | "60×" (with the × sign, as in the stem) not listed. | Added `60×`. |

## Checked and found right (things a reader might doubt)

**Pictures** (all rendered, blank versions with their label-question markers):
- `m6-dna-structure`: left strand runs P-sugar-P... from a free 5′ phosphate at top to a 3′ sugar at bottom; right strand the reverse, so the arrows (5′→3′ down on the left, up on the right) and end labels are consistent with which side of each sugar the phosphate sits on; the "one nucleotide" box holds phosphate + sugar + base of the same nucleotide. A–T two dashed bonds, G–C three; purines drawn wider than pyrimidines. Helix bracket spans one full period with 10 rungs, 2 nm width. Markers for bio-q-0643 sit on a phosphate, a deoxyribose, an adenine and the C–G hydrogen bonds, matching the explanation. (Marker 4 covers the dashes themselves; the pair is still identifiable as the bond between bases, so left as is.)
- `m6-replication-fork`: top template 3′ at left (5′ at the parent-DNA end), leading strand 5′ at left growing toward the fork; bottom template 5′ at left, lagging fragments growing right-to-left (away from the fork) with RNA primers at their 5′ (fork-side) ends, polymerase extending the newest fragment toward the previous fragment's primer, ligase at the nick between the two oldest. Primase on the lagging template near the fork. All correct.
- `m6-transcription`: coding strand 5′→3′ left to right, template 3′→5′; RNA pairs with the template, 5′ end trailing out, 3′ end in the polymerase, polymerase moving right, promoter upstream. Correct.
- `m6-translation`: codons AUG UUU GGC AAA UGA (5′→3′); anticodons drawn 3′→5′ left to right: AAA on UUU, CCG on GGC, departing UAC for AUG. Peptidyl tRNA (Met–Phe) in the P position, Gly-tRNA in the A position. Correct. Markers for bio-q-0648 correct.
- `m6-lac-operon` (+ blank): lacI, P, O, lacZ/Y/A order; repressor on O, polymerase on P; markers for bio-q-0653 on the right parts.
- `m6-gel` (+ blank): matches 25 Example 4 (evidence 9/12, A 9/12, B 9/14, ladder 8–15, short farthest). Markers for bio-q-0658 correct; electrodes can be inferred from the well position.
- `m6-meselson-stahl`: heavy / hybrid / hybrid + light for generations 0/1/2. Correct.
- `m6-enhancer-loop`, `m6-chromatin`, `m6-alt-splicing`: content matches the text; bio-qh-0615 markers correct.
- `m6-sanger`: template 3′-TGCAATC-5′, new strand 5′-ACGTTAG-3′; terminator colors consistent per base.
- `m6-crispr-cas9` (+ blank): non-target (top) strand 5′→3′ left to right with 5′-NGG-3′ just 3′ of the protospacer; guide 5′ end at the PAM-distal side, spacer pairs with the bottom (target) strand, scaffold at the guide's 3′ end; cut line about 2–3 bases from the PAM. bio-qh-0631 markers correct.
- Mermaid diagrams (23 central dogma, 24 mutation classification, 25 PCR cycle, 25h1 microRNA pathway, 25h2 repair outcomes): content correct, accTitle/accDescr describe the whole diagram, readable size.

**Honors lessons, recomputed in Python**: Dscam 12×48×33×2 = 38,016; reporter fold 98/5 ≈ 20; 25h2 Example 1 (5′-ATCCGATG-3′, template 5′-CATCGGAT-3′); Example 2 (6.2 × 10⁸ reads, e^−30 ≈ 9.4 × 10⁻¹⁴); Example 3 (positions 6 and 15 differ, both third positions, GCT/GCA and GCA/GCG all Ala, 90%); Example 4 (TGG at bases 25–27 is the only NGG on the strand shown; protospacer GACTCATGCTAGCTTACAGA; cut between ...CTTAC and AGA); 4²⁰ ≈ 1.1 × 10¹², 6.2 × 10⁹/4²⁰ ≈ 0.006.

**Facts checked** (standard references: OpenStax Biology 2e, NHGRI/NCBI, Nobel and FDA announcements): trp operon five genes and tryptophan as corepressor; CAP–cAMP 4-condition table; partial diploid outcomes in Example 1 and bio-qh-0604 (I^S dominant/uninducible; O^C cis-dominant constitutive); TATA ~25–30 bp upstream; nucleosome ~147 bp on a histone octamer; CpG maintenance methylation; IGF2 paternal expression; ~95% of multi-exon genes alternatively spliced; fly ~14,000 genes; microRNA ~22 nt, seed 2–8, Drosha/Dicer/Argonaute, lin-4 1993, 2024 Nobel; Sanger 1977, ~800–1,000 bases; HGP 1990–2003, ~$3 billion; T2T 2022 (~8% added), Y 2023; ~1.5% coding, ~20,000 genes (similar to C. elegans), ~half transposon-derived; ~1 SNP per 1,000 bases; SpCas9 PAM NGG, cut ~3 bp upstream; Gelsinger 1999; X-SCID leukemia early 2000s; Luxturna 2017, Zolgensma 2019, Casgevy 2023 (BCL11A erythroid enhancer); He Jiankui 2018 and imprisonment; 2023 summit "unacceptable at this time"; GINA 2008 (health insurance and employment, not life insurance). The glucose-effect wording (CAP–cAMP plus inducer exclusion, "current models include both") is fair.

**Questions**: all 52 worked independently before reading keys; every key, accept list, select-all set, order and match is correct. bio-q-0649 (anticodon 3′-GGU-5′ → codon 5′-CCA-3′), bio-qh-0618 (template 5′-GTAGC-3′), bio-qh-0619 (≈65×), bio-qh-0622 (90%, per the lesson's identical ÷ aligned-positions definition), bio-q-0659 (96) rechecked.

**Drills**: bio-h-splice-isoforms, bio-h-coverage, bio-h-chance-matches, bio-h-percent-identity: formulas and solutions correct. Worst-case 3-significant-figure rounding error over every input combination is 0.32% (coverage) and 0.30% (chance matches), inside the 0.5% relTolerance.

**Glossary (24) and cards (22)**: definitions correct.

## Left uncertain / notes for the writer

- bio-q-0650 lists "transcribed into pre-mRNA" before "capped, tailed and spliced"; in reality capping and much splicing happen during transcription. The order is still the only sensible one at this level, so left.
- The gel ladder bands are evenly spaced (linear), a fine simplification for STR alleles 4 bases apart.
- "Long reads are slower per base" (25h2) is loose (cost/throughput vary by platform) but not wrong enough to change.
- The writer's notes are accurate; nothing found in them was wrong.
