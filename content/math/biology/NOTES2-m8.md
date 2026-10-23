# Module 8 (bio-m8, The diversity of life): round 2 notes

`content/math/check-module.sh biology m8`: build and checker OK, zero problems (6 lessons, 98 questions, 7 drills, 56 cards).

## Honors lessons (new)
- `lessons/34h1-plant-physiology.md` (bio-h-plant-physiology), about 2,200 words, 45 min. Darwins, Boysen-Jensen and Went; a Briggs-style data example on auxin redistribution; polar transport (PIN proteins); acid growth; gravitropism and apical dominance; gibberellins, cytokinins, ABA and ethylene with the experiments behind them; phytochrome (Borthwick and Hendricks lettuce seeds), photoperiodism (Garner and Allard, Hamner and Bonner night breaks), critical night length and florigen (FT); cohesion-tension with numbers (the 10.3 m suction limit, ρgh, pressure chamber, cavitation, root pressure, guard cell mechanism). 3 worked examples.
- `lessons/34h2-microbes.md` (bio-h-microbes), about 2,000 words, 45 min. Plaque assay and one-step growth (burst size); lambda's lysis/lysogeny choice and induction; lysogenic conversion; the HIV cycle, reverse transcriptase error rate, provirus reservoir, combination therapy; endogenous retroviruses; antigenic drift and shift; antibiotic targets and MIC; Luria-Delbrück fluctuation test; conjugation, transformation, transduction; resistance mechanisms; spread and stewardship; the microbiome (Sender 2016 numbers, *C. difficile* and fecal transplant trial). 3 worked examples.

## Core lessons (improved, existing text kept)
- 31: three-domain tree SVG, labeled bacterium SVG, phage and enveloped-virus SVG, Mermaid lytic/lysogenic diagram (plus short connecting sentences).
- 32: Mermaid *Plasmodium* life cycle (plus one sentence on sexual forms in the mosquito); labeled mushroom/mycelium SVG.
- 33: Mermaid alternation of generations; labeled leaf cross-section SVG (with a short paragraph on leaf tissues); labeled flower section SVG.
- 34: Mermaid animal phylogeny (tissues, symmetry, protostome/deuterostome); labeled lancelet-like chordate SVG.

## Questions (`questions/m08.yaml`)
- Core: 20 new, bio-q-0849…0868, 5 per lesson. Types: text 4, match 3, order 4, label 5, select-all 4. module_quiz: 0850, 0851, 0855, 0858, 0859, 0864, 0867.
- Honors: 30, bio-qh-0801…0815 (plant physiology) and bio-qh-0816…0830 (microbes). Each lesson: 10 four-choice, 1 text, 1 match, 1 order, 2 select-all. Honors four-choice answer positions 5/5/5/5; whole file 17/17/17/17.
- No existing question changed; I found no errors in the round 1 m8 content.

## Pictures and diagrams
- 13 SVGs in `images/`: m8-three-domains, m8-bacterium (+ -blank), m8-viruses, m8-mushroom (+ -blank), m8-flower (+ -blank), m8-leaf (+ -blank), m8-chordate (+ -blank), m8-coleoptile-experiments. 89 KB in all; each was rendered and checked, and the blanks were checked with their label markers.
- 7 Mermaid diagrams (4 core, 3 honors: phytochrome switch, guard cell opening and closing, HIV cycle with drug targets), all previewed.
- 1 `plot` in 34h2 (log cell number of susceptible and resistant cells under an antibiotic, illustrative). The checker renders it, but I couldn't preview `plot` figures with preview-figure.mjs, so a reviewer should look at it in the app.

## Drills (`drills/m08.yaml`)
- bio-h-xylem-tension (ρgh in MPa and treetop water potential), bio-h-phage-burst (PFU/mL and burst size), bio-h-resistant-mutants (single and double resistant counts, doublings to regrow).

## Glossary and cards
- 30 glossary terms added to `glossary-m8.yaml` (16 plant physiology, 14 microbes). I grepped every glossary file first and checked that no term or alias collides. "Horizontal gene transfer" already exists (m7), so it isn't bolded in 34h2.
- 26 cards added to `cards-m8.yaml` (13 per honors lesson).

## For the reviewer
- Example 1 in 34h1 uses simplified numbers in the style of Briggs et al. (corn coleoptiles); the lesson says so and notes that the auxin-redistribution account is less clear-cut for some broad-leaved stems.
- Example 3 in 34h2 uses round TB mutation frequencies (rifampin ~10⁻⁸, isoniazid ~10⁻⁶) and 10⁹ bacilli in a cavity; these are commonly cited textbook values.
- HIV reverse transcriptase error rate given as about 3 × 10⁻⁵ per base (Mansky and Temin 1995, 3.4 × 10⁻⁵ per bp per cycle), genome about 9,700 nt.
- Tallest tree "about 116 m" (Hyperion); the 2004 Koch et al. height limit of 122–130 m; Lyman Briggs (1950) water tension about 25 MPa; air water potential at 50% RH and 20 °C ≈ −93 MPa (computed from RT/V̄ ln RH).
- AMR deaths: 1.27 million directly attributable in 2019 (Murray et al., Lancet 2022). FMT trial: van Nood et al. 2013 (81% vs 31%).
- The three-domain tree SVG draws Archaea and Eukarya as sister groups; the L31 text now says that in the two-domain view eukaryotes would branch from inside the archaea.
- "Finish the course" advice: 34h2 says it is being revisited and to follow the prescriber, not that it is wrong.

## Sources
- OpenStax Biology 2e (plant hormones, plant transport, viruses, prokaryotes) for checking facts; no text or figures copied.
- Darwin, *The Power of Movement in Plants* (1880); Boysen-Jensen 1913; Went 1926/1928; Briggs, Tocher and Wilson 1957 (Science); Thimann and Skoog 1933 (PNAS); Skoog and Miller 1957; Borthwick et al. 1952 (PNAS); Garner and Allard 1920; Hamner and Bonner 1938; Corbesier et al. 2007 and Tamaki et al. 2007 (FT as florigen); Koch et al. 2004 (Nature); Briggs 1950 (J Appl Phys).
- Ellis and Delbrück 1939; Luria and Delbrück 1943; Waldor and Mekalanos 1996 (CTXφ); Mansky and Temin 1995 (J Virol); Perelson et al. 1996; Murray et al. 2022 (Lancet); Sender, Fuchs and Milo 2016 (PLoS Biol); Qin et al. 2010 (Nature); van Nood et al. 2013 (NEJM).
