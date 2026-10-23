# Round 2 review: module m9 (The human body)

Reviewer brief: REVIEWERS-2.md. Scope: honors lessons 37h1–37h3, new pictures and diagrams in core lessons 35–37, questions bio-q-0937 to 0951 and bio-qh-0901 to 0942, drills bio-h-*, new glossary and card entries, all `images/m9-*.svg`, and NOTES2-m9.md.

Result: `content/math/check-module.sh biology m9` gives OK with zero problems after the fixes.

Counts: **0 answer-key errors**, **4 factual fixes**, **6 picture fixes** (one includes a marker move), **2 other fixes** (text-answer accept lists).

## Changes

### Factual fixes
1. **37h2, "Where the diversity comes from"** (after Example 1). The lesson said diversity estimates "run to 10^11 or beyond, more than the number of B cells in a body." But 10^11 is about the number of B cells a person has, not more, so the comparison failed. I changed it to "estimates run from about 10^12 to as many as 10^18 possible antibodies, far more than the number of B cells in a body at any one time, so each person carries only a sample of what is possible." Source: Briney et al. 2019, *Nature* 566:393 (up to about 10^18), and the NIH Research Matters summary, which gives the earlier estimate of at least 10^12.
2. **37h2, "Memory and vaccines".** The lesson said memory cells "outnumber the original naive cells." Memory cells don't outnumber all naive cells. I changed it to "outnumber the naive cells of the same specificity that started the response."
3. **37h2, vaccine types.** The lesson said inactivated, subunit and toxoid vaccines "usually need adjuvants." That's wrong for most inactivated vaccines: most flu shots and IPV have no adjuvant. The new text says these vaccines usually need several doses or boosters, and that subunit and toxoid vaccines usually also contain adjuvants, though most flu shots do not.
4. **37h3, diabetes insipidus.** I added one sentence giving the names recommended since 2022: arginine vasopressin deficiency (central) and arginine vasopressin resistance (nephrogenic). Students will meet both sets of names. Source: Working Group for Renaming Diabetes Insipidus position statement (2022, co-published in JCEM and other journals; PMC10534955) and Endocrine News, Nov 2022.

### Picture fixes
1. **m9-heart.svg and m9-heart-blank.svg.** The inferior vena cava ("from body") met the heart at the corner where the right atrium meets the valve line, so it could be read as entering the right ventricle. I raised its end so it clearly enters the right atrium. Label-question markers are unchanged and still on the correct parts.
2. **m9-nephron.svg, with its alt text in lesson 36.** The label "3 Secretion: H⁺, K⁺, some drugs" pointed at the distal tubule. Most drug secretion (organic anions and cations) happens in the proximal tubule, while H⁺ and K⁺ secretion in the distal nephron is correct. I removed "some drugs" from the label and the alt text. The core text still mentions drugs among secreted substances without naming a site, which is correct.
3. **m9-alveolus.svg.** The CO₂ arrow ran through the "alveolar wall" and "capillary wall" labels, and the O₂ arrow stopped in plasma although the alt text says it goes into a red blood cell. I moved the O₂ arrow so it ends on a red blood cell, moved the CO₂ arrow clear of the labels, and moved "blood flow" below the cells.
4. **m9-action-potential.svg.** The "Rising phase: Na⁺ rushes in" label overlapped the falling limb of the curve. I moved it to two lines on the left of the rising limb.
5. **m9-saltatory.svg.** The title said "the impulse jumps from node to node," but the lesson itself says the impulse doesn't literally jump. The title now reads "the impulse is renewed only at the nodes."
6. **m9-antibody.svg and m9-antibody-blank.svg, plus bio-qh-0924.** The antigen was so small that marker 1 hid it completely. I enlarged the antigen, still bound at the tip of the left arm, and moved the marker from (25.8, 25.3) to (25.0, 22.5) so it sits on the antigen with the shape visible around it.

### Other fixes (accept lists)
- **bio-q-0939**: added β cell(s), beta-cell(s) and islet beta.
- **bio-q-0950**: blank 1 now also accepts B cell(s), plasma cell(s) and plasma B; blank 2 also accepts memory B and memory B and T.

## Checked and found right (things a reader might doubt)
- **Diabetes cutoffs, checked as current.** ADA Standards of Care (2025 edition as cited by the Merck Manual; nothing changed in the 2026 update): fasting under 100 normal, 100–125 prediabetes, 126 or more diabetes; 2-hour OGTT under 140, 140–199, 200 or more. The ADA requires confirmation unless hyperglycemia is unequivocal (two abnormal results, from the same sample or separate samples). "Confirmation, usually by a repeat test" is a fair summary. The m9 cards and bio-qh-0934 match.
- **Type 1 and type 2 shares.** CDC "About diabetes" page: type 2 about 90–95% of diagnosed cases, type 1 about 5–10%. The core lesson and 37h3 match.
- **Herd immunity.** Measles R0 of about 12–18 is standard. CDC gives MMR as 97% effective after two doses and 93% after one, so the core Example 4 (93% threshold, about 96% coverage) is current. Formulas 1 − 1/R0, R_eff = R0·s and coverage = threshold/E are correct. All worked numbers were recomputed: 0.63, R_eff 1.48, 10·1.48³ ≈ 32, 83.3%, 107%; qh-0921 gives 1.40, qh-0922 gives 87.7% / 79.2% / 17.5%.
- **Nernst and Goldman.** 2.303RT/F at 310.15 K is 61.54 mV. E_K = −89.0 mV, E_Na = +60.6 mV, and the Goldman estimate is −68.5 mV. qh-0901 gives −98.5 mV (ln distractor −226.9). qh-0903's 5→10 mM case gives −70.5 mV.
- **V(D)J counts.** 40·23·6 = 5,520 and 200 + 120 = 320, giving about 1.77 million. qh-0916 gives 1,375,000, and its distractors 875,000, 5,275 and 75 all come from the stated mistakes. The segment counts are rounded textbook figures and are labeled "approximate."
- **Other numbers.** Half-life examples: 80 → 10 and 120 → 15. Urine volumes: 0.5 L, 4 L and 0.6 L. Reflex times: 30.5 ms and 31 ms.
- **Endocrine and kidney values** are in standard ranges: insulin half-life about 5 min, cortisol about 1 h, T4 about 7 days, urine 50–1,200 mOsm/kg, renal glucose threshold about 180 mg/dL, plasma osmolality 285–295. The LH surge (estradiol over about 200 pg/mL for about a day, ovulation about 34–36 h after surge onset) and the TSH/T4 interpretation table are both correct.
- **History.** Hodgkin–Huxley 1952 (Na⁺ replaced by choline), Burnet 1957, Tonegawa 1976, Porter and Edelman (Nobel 1972), and Zinkernagel–Doherty 1974 (Nobel 1996) are correct. The illustrative tables are labeled as illustrative.
- **Drug and toxin table** (TTX and lidocaine, botulinum, curare, organophosphates, SSRIs, cocaine, benzodiazepines) is mechanistically correct.
- **Heart picture conventions.** It is a front view with the heart's right side on the viewer's left, and the caption says so. The left ventricle wall is thick. Flow arrows are correct: vena cava → RA → RV → pulmonary artery to the lungs, and pulmonary veins → LA → LV → aorta, which arches to the viewer's right and down to the body. Valves sit at both AV positions and both arterial bases. The bio-q-0942 markers all sit on their named parts.
- **Digestive picture.** The liver is on the body's right (viewer's left) and the stomach on the body's left. The small intestine joins the large intestine at the lower right of the body (the cecum). The colon runs up the body's right, across, and down the body's left to the rectum at the center. The bio-q-0947 markers are correct.
- **Neuron, antibody, action-potential, synapse and hormone-signaling pictures.** Structures and arrows are correct. Light chains are on the outside of the arms, and variable regions are at the tips. In the synapse, Ca²⁺ flows in at the terminal, Na⁺ flows in at the postsynaptic receptor, and the reuptake arrow points into the terminal. In the action potential, rest is −70 mV, threshold −55, peak about +35 and undershoot about −80. Label markers for bio-q-0937, qh-0910 and qh-0924 are on their named parts.
- **Mermaid diagrams (6).** All were rendered. Content is correct, and each accTitle/accDescr describes the whole diagram. The insulin/glucagon LR loop is wide (3 columns) but readable.
- **Drills (6 bio-h-\*).** I generated sample values and recomputed them in Python. Formulas, rounding and tolerances are consistent. The `where` filter correctly excludes impossible coverage values.
- **Glossary and cards.** All 40 new terms and 27 new cards are correct. No term or alias collides with another glossary file.
- **Questions.** Every new question has exactly one defensible answer. Select-all, order and match keys are right. The 4-choice answer spread is even.

## Left as is / uncertain
- The 37h1 Example 3 knee-jerk path (0.9 m per axon) is on the long side for a real patellar reflex arc (about 0.5–0.7 m). It's a stated estimate, and the conclusion (a few tens of ms) matches measured latencies, so I left it.
- 37h3 says the LH surge ends as the follicle switches to progesterone. GnRH-receptor desensitization and LH depletion also contribute. The simplification is reasonable for honors level.
- The core lessons are slightly over the 1,800-word guideline, as noted by the writer. That is not an accuracy issue.
