# Module 8 round 2 review (bio-m8, The diversity of life)

Reviewer scope: new pictures, diagrams and sentences in lessons 31–34; honors lessons 34h1 (plant physiology) and 34h2 (microbes); new questions bio-q-0849…0868 and bio-qh-0801…0830; drills bio-h-*; new glossary and card entries; all `images/m8-*.svg`; the `plot` in 34h2.

`content/math/check-module.sh biology m8` after fixes: build and checker OK (6 lessons, 98 questions, 7 drills, 56 cards).

## Changes

### Answer-key / grading errors (1)
- **Drill bio-h-xylem-tension**: both answers used `relTolerance: 0.01` while the prompt asks for 2 decimal places. For short trees the correctly rounded answer fell outside 1% (h = 20 m: ρgh = 0.1962 MPa, rounded 0.20 is 1.9% off), so a learner following the instructions was marked wrong. Python enumeration of all inputs: 105 combinations affected. Changed both to absolute `tolerance: 0.006` (just above the 0.005 rounding error).

### Factual fixes (4)
- **34h1, Example 3**: Briggs (1950, J Appl Phys) measured water holding under about −277 atm (≈ 28 MPa) at 10 °C, not "about 25 MPa". Now "nearly 28 MPa (about 280 atmospheres)".
- **34h1, Example 3**: the 2004 redwood height limit (Koch et al., Nature 428:851) was attributed to cavitation. Koch et al. based the 122–130 m limit on increasing water stress at the treetop (gravity plus path-length resistance) limiting leaf expansion and photosynthesis, with leaf water potentials approaching the cavitation threshold. Reworded to say that.
- **34h2, HIV paragraph**: "roughly one new copy in three carries a fresh mutation" overstated it; 9,700 × 3.4 × 10⁻⁵ ≈ 0.33 mutations per copy means about 28% of copies (Poisson) carry at least one. Now "on average about 0.3 new mutations (roughly one new mutation for every three genomes copied)". Matching edit to bio-qh-0820 choice C ("About 0.3, roughly one new mutation per three genomes copied"); answer key unchanged.
- **34h2, antibiotic table**: "DNA gyrase (unwinds DNA for copying)" changed to "(relieves the twisting of DNA during copying)"; gyrase introduces negative supercoils/relieves overwinding ahead of the fork, the helicase does the unwinding (OpenStax Microbiology, antimicrobial drugs).

### Picture fixes (2)
- **m8-bacterium.svg and m8-bacterium-blank.svg**: the pili and flagellum were drawn under the capsule, so they appeared to start at the capsule's outer edge. Redrawn to start at the cell wall/membrane and pass through the capsule (as in real cells). Markers and labeled leader lines still land on the same parts (re-rendered).
- **bio-q-0859 (flower label)**: the Ovary marker (55.5, 57) sat on the ovary/petal boundary, half on the petal. Moved to (53.6, 57.8), inside the ovary.

### Other fixes (1)
- **34h2 plot**: the resistant-cell line and its plateau were two separate functions (the plateau unlabeled and possibly drawn in another color). Merged into one dashed function `min(1 + 0.301*x, 9)` from 0 to 36, labeled "resistant cells". JSON otherwise checked by reading: susceptible line 9 − 0.5x falls from 10⁹ to 1 cell at 18 h; resistant line starts at 10 cells and doubles hourly (log₁₀2 = 0.301), reaching 10⁹ at 26.6 h; axis labels and caption match ("10 resistant cells among a billion, illustrative").

## Checked and right (things a reader might doubt)
- All 50 new questions worked independently; every key, select-all set, order and match is correct. Numerics recomputed: qh-0809 (0.78 MPa), qh-0817 (24; 2.4 and 240 distractors as explained), qh-0823 (10⁻³), qh-0808/0815 photoperiod schedules, Example 2 table in 34h1.
- Label markers rendered for all five label questions (bacterium, mushroom, flower, leaf, chordate); each sits on its named part.
- Pictures: flower (stamen/carpel parts, superior ovary with ovules), leaf (cuticle, epidermis, palisade, spongy mesophyll, xylem above phloem in the vein, stoma with guard cells on the lower surface), viruses (icosahedral phage head, sheath, base plate, fibers; enveloped virus with spikes), chordate (nerve cord dorsal to notochord, slits behind mouth, anus ventral, post-anal tail), coleoptile panel (Darwin, Boysen-Jensen mica on the shaded side, Went block on the convex side, bending away), three-domain tree, mushroom/mycelium: all correct and legible.
- All 7 Mermaid diagrams previewed: content correct, accTitle/accDescr describe the whole diagram.
- Numbers: suction limit 101325/(1000 × 9.81) = 10.33 m; 110 m column 1.08 MPa, top Ψ ≈ −2.3 MPa; air at 20 °C, 50% RH: RT/V̄ ln 0.5 = −93.6 MPa; fluctuation test means 12.4 and 13, sample variances 1,118 and 6.7; burst size 124; TB 10, 1000, 10⁻⁵.
- Facts verified: Darwins 1880; Boysen-Jensen 1913; Went 1926; Briggs, Tocher and Wilson 1957 corn coleoptiles; Thimann and Skoog 1933; Kurosawa 1926; Mendel's le allele (GA 3-oxidase, last step); kinetin from heated DNA (Miller, Skoog et al. 1955); Neljubow 1901; Borthwick and Hendricks 1952 (660/730 nm); Garner and Allard 1920; Hamner and Bonner 1938 (cocklebur); Chailakhyan, FT 2007; Dixon and Joly 1894; Ellis and Delbrück 1939; Luria and Delbrück 1943 before replica plating (1952, lesson 27); Mansky and Temin 1995 (3.4 × 10⁻⁵); ~8% of the genome endogenous retroviruses, syncytin; 1957/1968 shift pandemics, 2009 H1N1 reassortant; Japanese *Shigella* R plasmids, four drugs; Murray et al. 2022 (1.27 million); Sender et al. 2016 (38 vs 30 trillion); Qin et al. 2010 (~150× genes); van Nood et al. 2013 (81% vs 31%).
- Drills bio-h-phage-burst and bio-h-resistant-mutants: generated by hand from the YAML and recomputed; tolerances fine (burst ≥ 10 so 1-decimal rounding < 0.5%; doublings = aexp × log₂10 = 16.6/19.9/23.3/26.6). Placeholders like `10^{{nexp}}` render correctly.
- Glossary (30) and cards (26) definitions correct.
- Cross-references: "lesson 9" (water potential), "lesson 22" (Griffith), "lesson 27" (replica plating) all exist.

## Left uncertain
- The three-domain SVG shows the classic three-domain topology; the lesson text explains the two-domain alternative, which is adequate.
- 34h2's statement that the 2009 H1N1 virus came from "swine, bird and human lineages" and the latent period "about half an hour" are standard textbook summaries; fine at this level.
- The HIV Mermaid preview was taller than the preview canvas (the last box was cut off in the preview PNG). The diagram has 10 nodes, within the ~12-node guideline, so I left it; worth a glance in the app on a phone.

Counts: answer-key/grading errors 1, factual fixes 4, picture fixes 2, other fixes 1.
