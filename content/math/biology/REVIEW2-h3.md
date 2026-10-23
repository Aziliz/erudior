# REVIEW2-h3: honors module bio-h3 (Behavior, disease, and conservation)

Independent round 2 review of lessons 49–52, `questions/h3.yaml` (bio-qh-h3-01 to -56),
`drills/h3.yaml`, `glossary-h3.yaml`, `cards-h3.yaml`, `images/h3-*.svg` and the four Mermaid
diagrams. `content/math/check-module.sh biology h3` reports zero problems after the fixes
(4 lessons, 56 questions, 10 drills, 41 cards).

Counts: **answer-key errors 0**, **factual fixes 3**, **picture fixes 0**, **other fixes 7**
(1 question explanation, 2 question wordings, 1 diagram layout, 2 glossary definitions, 1 card).

## Changes

### Factual fixes
1. **Lesson 52, "Conservation that worked", humpback whales.** The lesson put humpback recovery
   after "the international ban on commercial whaling took effect in 1986." Humpbacks had already
   been protected from commercial hunting worldwide by the IWC in 1966; the 1986 moratorium came
   later and covered all species. Rewritten to give both dates. The card "Conservation successes"
   now says "after hunting bans (1966, 1986)". Source: IWC history; NOAA Fisheries humpback species page.
2. **Lesson 51, "Zoonoses".** "HIV began as a related virus of chimpanzees" is true only of HIV-1
   (HIV-2 came from sooty mangabeys). Now "HIV-1, the virus behind the global AIDS pandemic, began
   as…". Source: Sharp and Hahn (2011), Cold Spring Harb Perspect Med.
3. **Lesson 51, Snow paragraph.** "Robert Koch identified the cholera bacterium" now says Koch
   identified it as the cause in 1883–84, and adds that Filippo Pacini had described it in 1854
   but was largely ignored, so students aren't told Koch was the first to see it.

### Other fixes
- **Lesson 51, Example 3 (Snow's grand experiment).** Step 1 rounded the Lambeth rate to 38 and step 2
  then wrote $315/38 \approx 8.4$, but $315/38 = 8.29$. Step 1 now gives 37.5 (98/26,107 × 10,000 =
  37.54) and step 2 $315/37.5 \approx 8.4$, matching the ratio of unrounded rates (8.40).
- **bio-qh-h3-33** explanation: "375 subtracts the new infections instead of adding them" is wrong
  (that gives 175). 375 = 500 − 125, i.e. recoveries subtracted and new infections left out. Fixed.
- **bio-qh-h3-04** choice A, "Birds in a field stop flying off when a motionless scarecrow is put up",
  could be read as the scarecrow itself stopping the birds. Reworded to "Birds that at first fled a
  new scarecrow stop fleeing after days of it never moving" (unambiguous habituation). Key unchanged.
- **bio-qh-h3-27** explanation: "pregnant-capable males" replaced by "males".
- **Lesson 52, extinction-vortex Mermaid diagram**: 5-box chain was `flowchart LR`, which AUTHORING.md
  says gets too wide on a phone (TD for chains of more than four boxes). Changed to `flowchart TD`;
  previewed, loop arrow reads correctly.
- **Glossary "biological control"**: definition said control happens "after testing that the enemy
  will not harm other species", which historical introductions (cane toad, the lesson's own example)
  didn't do. Now "modern programs first test…".
- **Glossary "haplodiploidy"**: "Full sisters share 3/4" now specifies same mother and father.

## Checked and found right (things a reader might doubt)

- **Condor count** (NOTES2 flagged as single-source): confirmed against the official USFWS
  "2025 California Condor Population Status" (as of Dec 31, 2025: 607 total, 392 wild). "About 600
  by 2025, more than half flying free" is correct. 27 birds in 1987 is correct.
- **Clock-shift direction** (lesson 49 Example 2 and q10): worked independently. 6 h fast → bird
  expects the sun in the west at noon → flies west, 90° counterclockwise; 6 h slow → east, 90°
  clockwise (q10's key, index 0, is right). Matches the standard Schmidt-Koenig/Wiltschko result.
- **Waggle dance** example (150° + 40° = 190°) and q7 (200° − 30° = 170°, 1.5 km) correct.
- **SIR figure**: extracted the plotted curves from the SVG and compared with a fresh simulation
  ($R_0 = 3$, $\gamma = 0.1$, $I_0 = 0.001$): peak 30.1% at day 38.4 with $s = 0.332$, final $s$ = 5.9%;
  the SVG matches (peak 30.1% at day 38, dotted line at day 38.5, final $s$ 5.9%). Final sizes 94%
  ($R_0 = 3$) and 80% ($R_0 = 2$) recomputed from the final-size equation.
- **Snow's numbers**: 40,046 houses / 1,263 deaths and 26,107 / 98 (first seven weeks), Lambeth intake
  moved 1852, pump handle removed September 8, 1854, brewery and workhouse wells, the Hampstead woman.
- All worked-example arithmetic recomputed in Python: crab profitabilities; Example 1 of lesson 50 and
  the elephant-seal variances (0.16, 2.56, ratio 16); $\tfrac14 + \tfrac1{2n}$ (n = 12 → 0.292);
  incidence 300 vs 304 per 100,000; SIR step (270, 1,170; day 2 ≈ 306); picnic RR 7 and 1.19;
  20 E/MSY; species-area 112 species; core areas 64 and 36 ha; $N_e = 32$, $0.984375^{20} = 0.730$,
  $0.99^{20} = 0.818$; Chapman 231 vs 250; $\sqrt{0.9} = 0.949$, $0.9^5 = 0.59$.
- **Every question** worked before reading the key: all 56 keys correct; select-all sets (04, 21, 36, 52)
  complete; match/order/label items unambiguous; text accepts adequate (17, 22 accept fraction and decimal).
- **Label markers**: rendered h3-sir-blank with q34 markers and h3-island-model-blank with q45 markers;
  every marker sits on its named curve (q34 marker 2 sits on the infectious curve just after the peak,
  about 16 px above the susceptible curve: tight but unambiguous).
- **Pictures**: all seven SVGs rendered; biology, labels and layout correct (haplodiploidy: brother has
  only maternal genes, r values right; island model: near/far immigration and small/large extinction
  curves and equilibria in the right order; fragment figure to scale).
- **Mermaid**: all four diagrams previewed; accTitle/accDescr describe the whole diagram. The
  outbreak-steps diagram is cut off at the bottom only in the preview tool (900×700 viewport), not in content.
- Other facts checked: vervet playback responses (Seyfarth, Cheney and Marler 1980); 1973 Nobel;
  Emlen/Betelgeuse; Arctic tern ~70,900 km (Egevang et al. 2010); Hamilton 1964, Trivers 1971/1972,
  Wilkinson 1984, Carter and Wilkinson 2013, Axelrod; Nowak–Tarnita–Wilson 2010 and the 137-author reply;
  Andersson 1982; Kermack–McKendrick 1927; CDC zoonoses (6 in 10; 3 in 4 emerging); CDC 2019 AR Threats
  (2.8 million, 35,000); Murray et al. 2022 (1.27 million); ~30% unnecessary outpatient prescriptions;
  2017 FDA growth-promotion ban; background 0.1 E/MSY and ~100 E/MSY current (Pimm 2014, De Vos 2015);
  Simberloff–Wilson; BDFFP 1979 with 1/10/100 ha fragments; Savannah River corridors; 50/500 → 100/1000
  (Frankham 2014); Florida panther (8 Texas females 1995, 120–230 now); Illinois prairie chickens;
  cane toad 1935; emerald ash borer Detroit 2002; South Georgia baiting 2011–2015, rodent-free 2018;
  vedalia beetle 1888–89; Yellowstone 31 wolves 1995–96.
- **Drills**: generated sample instances by hand from the YAML and recomputed every answer
  (waggle bearings within 10–350°, incidence/prevalence `where` clauses have ~8,600 valid combinations,
  SIR step, relative risk, species-area rounding within tolerance, core-area sides all whole since
  every `tot/nb` is a perfect square, $N_e$ and heterozygosity). All correct.
- Cross-references to lessons 27, 28, 37 (herd immunity $1 - 1/R_0$), 39 (mark–recapture), 40 and
  module 8's microbes honors lesson all point to real content.

## Left uncertain

- "Hundreds of millions" of ash trees killed by emerald ash borer: published estimates vary widely
  (tens to hundreds of millions); left as is since it is the commonly cited figure.
- Lake Victoria "perhaps 200 or more" cichlids lost: hedged appropriately in the text.
- Seasonal flu $R_0$ "about 1.3" is a median of published estimates; stated as approximate.

Sources consulted this round: USFWS 2025 California Condor Population Status
(https://www.fws.gov/sites/default/files/documents/2026-02/2025-california-condor-population-status_508-compliant.pdf),
plus the standard references named above.
