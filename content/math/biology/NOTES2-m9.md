# Module 9 (bio-m9, The human body): round 2 writer notes

## What I added

### Honors lessons (3)
| File | Lesson id | Words (rough, incl. tables) | Worked examples | Pictures and diagrams | Drills |
|---|---|---|---|---|---|
| 37h1-neurons.md | bio-h-neurons | about 2,190 | 3 (Nernst and Goldman; paired-pulse refractory data; reflex timing) | m9-action-potential.svg, m9-saltatory.svg, m9-synapse.svg | bio-h-nernst, bio-h-reflex-time |
| 37h2-immunology.md | bio-h-immunology | about 2,200 | 4 (V(D)J counting; IgM/IgG test reading; Zinkernagel–Doherty data; R_eff and coverage) | m9-antibody.svg, Mermaid MHC class I/II routes, plot of 1 − 1/R0 | bio-h-vdj, bio-h-reff |
| 37h3-endocrine.md | bio-h-endocrine | about 1,990 | 4 (half-life; TSH/T4 diagnosis; glucose tolerance classification; minimum urine volume), plus an LH/estradiol data table | m9-hormone-signaling.svg, Mermaid hypothalamus-pituitary-thyroid axis | bio-h-hormone-decay, bio-h-urine-volume |

All three have `honors: true`, `minutes: 45`, "Common mistakes" and "Key points".

### Core lessons improved (no existing text rewritten, only additions)
- 35-homeostasis: Mermaid temperature feedback loop (in Example 1), labeled neuron SVG (m9-neuron.svg), Mermaid insulin/glucagon double loop.
- 36-transport-systems: labeled heart schematic (m9-heart.svg), alveolus and blood-air barrier sketch (m9-alveolus.svg), labeled nephron (m9-nephron.svg, with one added sentence naming the proximal tubule and loop of Henle), Mermaid ADH feedback loop.
- 37-digestion-immunity: labeled digestive system (m9-digestive.svg), Mermaid adaptive immune response (with one added sentence on antigen display by phagocytes).

### Questions (questions/m09.yaml, now 93)
- Core: 15 new, bio-q-0937 to 0951, 5 per lesson, each lesson with one label (unlabeled images m9-neuron-blank, m9-heart-blank, m9-digestive-blank), one order, one text, one match and one select-all. 6 marked `module_quiz` (2 per lesson).
- Honors: 42, bio-qh-0901 to 0942, 14 per lesson: 28 multiple choice, 3 select-all, 3 text, 3 match, 3 order, 2 label (m9-action-potential-blank, m9-antibody-blank). No `module_quiz` (honors lessons in a core module).
- Answer positions of the 28 new 4-choice questions: 7/7/7/7. Whole file: 16/16/16/16.

### Drills (drills/m09.yaml, now 13)
bio-h-nernst, bio-h-reflex-time, bio-h-vdj, bio-h-reff, bio-h-hormone-decay, bio-h-urine-volume.

### Pictures and diagrams
- 15 original SVGs, all `images/m9-*.svg`, 2.5–12 KB each: neuron (+blank), heart (+blank), alveolus, nephron, digestive (+blank), action-potential (+blank, curve generated from a smooth interpolation through standard values), saltatory, synapse, antibody (+blank), hormone-signaling. Every one was rendered with preview-figure.mjs and looked at; label images were checked with their markers.
- 6 Mermaid diagrams (all with accTitle/accDescr, each rendered and checked) and 1 plot.

### Glossary and cards
- glossary-m9.yaml: 40 new terms (neurons 16, immunology 14, endocrine 10). Checked against every glossary-*.yaml before adding and again at the end; I removed an `APC` alias that clashed with m4's anaphase-promoting complex.
- Not bolded because another module defines them: ligand-gated ion channel (m2), basic and effective reproduction number (h3).
- cards-m9.yaml: 27 new cards (neurons 9, immunology 8, endocrine 10).

`content/math/check-module.sh biology m9`: OK, zero problems.

## For the reviewer
- Tables marked illustrative or in the "pattern found" form: the paired-pulse refractory table (37h1), Zinkernagel–Doherty kill percentages (37h2, labeled illustrative), the LH/estradiol cycle table (37h3, labeled illustrative), and the four glucose tolerance results (37h3, invented patients).
- Gene-segment counts (heavy 40 V, 23 D, 6 J; kappa 40 V, 5 J; lambda 30 V, 4 J) are the rounded textbook figures. Real functional counts vary between people and sources (for example 38–46 V_H). The lesson says "approximate."
- Goldman example: uses P_Na/P_K = 0.04 and ignores Cl⁻. It gives −68.5 mV, and the lesson presents it as a weighted Nernst estimate.
- "No more than about 1,000 action potentials per second" is based on an absolute refractory period of about 1 ms. Most neurons fire far slower, and the lesson says so.
- Endocrine values: insulin half-life about 5 min, cortisol about an hour or more, T4 about a week; maximum urine about 1,200 mOsm/kg, minimum about 50; renal glucose threshold about 180 mg/dL; ADA OGTT cutoffs (fasting 100/126, 2-hour 140/200), with confirmation by repeat testing noted; type 1 diabetes about 5–10% and type 2 about 90–95% of diagnosed cases.
- LH surge: I wrote that the surge ends as LH makes the follicle switch from estradiol to progesterone, and that ovulation follows about a day and a half after the surge begins. I avoided the common oversimplification that ovulation itself ends the surge.
- "Muscle has no glucagon receptors" is the standard teaching statement.
- Drugs table (37h1) describes mechanisms only and says it isn't medical advice.
- Core lessons 36 and 37 are now about 100 words over the 1,800-word guideline because of the sentences that introduce the new figures.
- The glossary term `threshold` is generic. Its definition is neuron-specific, so a later writer who wants "threshold" in another sense should use a qualified term.
- I found no errors in the existing m9 content.

## Sources
These are the standard references the facts and values come from. I worked from them as known references and did not re-fetch them online in this session, so a reviewer may want to spot-check the values listed above.

- OpenStax Biology 2e, chapters 35 (nervous system), 37 (endocrine), 41 (osmotic regulation), 42 (immune system); OpenStax Anatomy and Physiology 2e for pituitary, thyroid and kidney details.
- Hodgkin & Huxley 1952 (J Physiol); Burnet 1957 (Aust J Sci), clonal selection; Hozumi & Tonegawa 1976 (PNAS), V(D)J rearrangement; Zinkernagel & Doherty 1974 (Nature), MHC restriction; Porter and Edelman (1972 Nobel lectures) on antibody structure.
- Janeway's Immunobiology for gene-segment numbers and antibody class properties.
- American Diabetes Association Standards of Care (diagnostic criteria); CDC diabetes basics (type 1 and type 2 shares).
- Standard physiology texts (Guyton & Hall; Boron & Boulpaep) for urine osmolality limits, hormone half-lives, the beta-cell K_ATP mechanism, the LH surge and conduction speeds.
- Nernst constant computed in Python: 2.303 RT/F at 310.15 K = 61.54 mV. Every numeric question, example and drill was checked in Python.
- All text, figures and questions are original.
