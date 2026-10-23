# NOTES2-h2: Honors module bio-h2, Development, stem cells, and the genome

Writer notes for round 2 (WRITERS-2.md). `content/math/check-module.sh biology h2`: build and checker report zero problems (4 lessons, 55 questions, 5 drills, 44 cards).

## What was added

**Lessons** (all `honors: true`, module `bio-h2`, 45 minutes each; about 2,050–2,250 words counted with tables, under 2,200 of prose each)

| File | Id | Worked examples | Pictures / diagrams | Drills |
|---|---|---|---|---|
| 45-early-development.md | bio-h-early-development | Cell count and cell diameter after 12 cleavages; folic acid timing (neural tube closure vs pregnancy dating) | h2-cleavage.svg, h2-gastrula.svg, h2-neurulation.svg | bio-h-cleavage-cells |
| 46-differentiation.md | bio-h-differentiation | Spemann early/late gastrula transplant; Bicoid threshold position and dose shifts ($x = \lambda \ln(C_0/T)$); maternal effect cross | h2-organizer-graft.svg, h2-hox-colinearity.svg, Bicoid gradient `plot`, Mermaid segmentation cascade | bio-h-morphogen-threshold |
| 47-stem-cells.md | bio-h-stem-cells | Till–McCulloch colony frequency with seeding correction (plus `plot`); Dolly efficiency; separating empirical from value claims | Mermaid potency hierarchy, colony `plot`, h2-planarian.svg | bio-h-colony-frequency |
| 48-genome-evolution.md | bio-h-genome-evolution | Gene density and coding fraction (E. coli vs human); Alu copy number and average LINE-1 length; stickleback Pitx1 cis vs trans reasoning | Mermaid pie (genome composition), Mermaid duplicate-gene fates, h2-stickleback.svg | bio-h-gene-density, bio-h-te-copies |

**Questions** (`questions/h2.yaml`, bio-qh-h2-01 … 55): 55 total (14 / 13 / 14 / 14 per lesson).
- 36 four-choice, answer positions 9/9/9/9.
- 19 other types (35%): 4 select-all, 6 text, 4 match, 4 order, 1 label (h2-gastrula-blank.svg).
- 18 `module_quiz: true` (5 / 4 / 4 / 5), covering every topic.

**Drills** (`drills/h2.yaml`): bio-h-cleavage-cells, bio-h-morphogen-threshold, bio-h-colony-frequency, bio-h-gene-density, bio-h-te-copies.

**Pictures** (new, all original): h2-cleavage, h2-gastrula, h2-gastrula-blank (label question), h2-neurulation, h2-organizer-graft, h2-hox-colinearity, h2-planarian, h2-stickleback. All previewed and checked; preview PNGs deleted. 3 Mermaid diagrams previewed.

**Glossary** (`glossary-h2.yaml`): 71 terms, one per bolded term (checked against all glossary-*.yaml; no duplicates). Core terms already defined elsewhere (differentiation, stem cell, pluripotent, iPSC, transcription factor) are used but not bolded. Ectoderm/mesoderm/endoderm were mentioned in lesson 34 without glossary entries; they are defined here.

**Cards** (`cards-h2.yaml`): 44 (11 per lesson).

## For the reviewer to double-check

- Example 1 in lesson 47 uses illustrative data "of the kind Till and McCulloch collected" (about 1 colony per 10^4 cells, close to their reported order of magnitude), and a hypothetical 10% spleen-seeding fraction. Labeled as such in the text.
- Bicoid numbers: decay length about 100 µm in a ~500 µm egg (BioNumbers). Thresholds in Example 2 and the drill are illustrative; the text says measured boundary shifts are smaller than the simple model predicts.
- Dolly: 277 fused eggs → 29 embryos transferred → 1 lamb (Wilmut et al. 1997; Scientific American retrospective). Dolly euthanized in 2003 at age six (virus-caused lung tumor); Sinclair et al. 2016 on later clones from the same cell line.
- Genome sizes: Tmesipteris oblanceolata about 160 Gbp (2024), onion about 16 Gbp, axolotl about 32 Gbp, Australian lungfish about 43 Gbp. Gene counts for these are given as "not well established".
- The fraction of the human genome under selection is given as "about 10 percent" (mammalian constraint studies such as Zoonomia 2023); ENCODE 2012's 80% claim is presented as contested.
- Hox figure is explicitly simplified (main embryonic domains; pb shown on the chromosome only).
- Stickleback hybrid allele-specific-expression reasoning in Example 3 and Q53 is posed as a prediction exercise, not as a reported experiment.
- Potency Mermaid diagram draws the inner cell mass leading directly to blood and intestinal stem cells (skipping germ layers) for readability.
- "cis-regulatory element" is defined here; "enhancer" is not bolded (it belongs to lesson 24 / the m6 honors lesson). If the m6 honors writer adds "cis-regulatory element", one entry should be removed.

## Errors found in existing content

None found in the core lessons read (10, 15, 24, 26, 34).

## Sources

OpenStax Biology 2e (ch. 18, 43); Gilbert and Barresi, Developmental Biology (for fact checks, not wording); BioNumbers (Bicoid decay length); Newport & Kirschner 1982 (midblastula transition); Spemann & Mangold 1924; Driever & Nüsslein-Volhard 1988; Davis et al. 1987 (MyoD) and 1995 (Hoxa11/Hoxd11); Till & McCulloch 1961, Becker et al. 1963; Briggs & King 1952; Gurdon 1962; Wilmut et al. 1997; Takahashi & Yamanaka 2006; Wagner, Wang & Reddien 2011 (Whitehead Institute summary); Kragl et al. 2009; Lander et al. 2001 (human genome composition); Kazazian et al. 1988; Halder, Callaerts & Gehring 1995; Shapiro et al. 2004; Chan et al. 2010; Smithsonian/Kew report on Tmesipteris (2024); CDC folic acid guidance; ISSCR 2021 guidelines.
