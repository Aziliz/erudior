# Round 2 review: module m2 (Cells)

Scope: new pictures, diagrams and short added paragraphs in lessons 06–10; honors lessons
10h1 (endomembrane system and cytoskeleton) and 10h2 (cell signaling); new questions
bio-q-0258…0283 and bio-qh-0201…0229; drills bio-h-axon-transport, bio-h-receptor-occupancy,
bio-h-amplification; 31 new glossary terms and 20 new cards; the 19 m2-*.svg images; NOTES2-m2.md.

`content/math/check-module.sh biology m2` after fixes: build and checker OK, zero problems
(7 lessons, 112 questions, 9 drills, 50 cards).

## Changes

### Answer keys
None wrong. Every new question worked independently before reading the key; every key,
distractor and explanation checked. Three `accept` lists widened (correct answers that would
have been marked wrong):
- bio-q-0259: added `limit of resolution`, `resolution limit`.
- bio-q-0273: added `vacuoles`.
- bio-qh-0211 (second blank): added `ER signal sequence`.

### Factual fixes
- 10h1, "Vesicle traffic": the text said botulinum and tetanus toxins both block transmitter
  release "and paralysis follows", which implies the same effect. They cause opposite
  paralyses: botulinum toxin blocks acetylcholine release at the neuromuscular junction (floppy
  paralysis); tetanus toxin blocks inhibitory interneurons in the spinal cord (rigid spasms).
  Added one sentence saying so. Source: OpenStax Biology 2e ch. 35; CDC botulism and tetanus
  pages.
- glossary-m2 `G protein-coupled receptor`: "the largest family of receptors" became "the
  largest family of membrane receptors" (accurate wording).
- cards-m2 "Amplification": the card stated "one hormone molecule can release about a million
  glucose units per second" as a general fact. Those numbers are the lesson's labeled
  illustrative example, so the card now says that.

### Picture fixes
- m2-animal-cell.svg and m2-animal-cell-blank.svg: one ribosome dot (at 680, 230) sat outside
  the plasma membrane. Moved inside the cell (650, 245).
- m2-gpcr.svg: the "α" label overlapped the GTP circle on the α subunit. Moved the label to
  the right of the circle.

### Diagram fixes (readability)
- 06 cell-theory timeline: a 6-item Mermaid `timeline` renders about 900 px wide, which is
  unreadable at phone width. Converted to a `flowchart TD` with the same six dated steps;
  accDescr updated ("from top to bottom").
- 08 secretory-path diagram: `flowchart LR` with a 5-box chain, against AUTHORING.md (TD for
  chains of more than four boxes). Changed to `flowchart TD`; content unchanged.

## Checked and right (things a reader might doubt)
- Label markers: rendered all seven label images with their question's markers
  (0258 microscope, 0263 bacterium, 0268 animal cell, 0269 plant cell, 0274 membrane,
  qh-0214 cytoskeleton, qh-0228 GPCR). Every marker is on the named part. Where a marker
  covers a small structure (lysosome, mitochondrion, chloroplast in 0268/0269), another copy
  of that structure stays visible elsewhere in the cell. 0263's pilus marker covers the upper
  part of one short pilus; the lower part and four other pili remain visible, so left as is.
- Pictures: microscope parts and light path in the right order (light source, diaphragm,
  stage, objectives, tube, eyepiece); seven transmembrane helices on the GPCR with the
  N-terminus outside; α (with GTP), β and γ subunits; tonicity grid (crenated, normal, swollen
  red blood cells; plasmolyzed, flaccid, turgid plant cells) with the water arrows in the
  right directions; cytoskeleton fibers in the right proportions (about 25 : 10 : 7 nm);
  the agar and SA:V cube drawings to scale with the right numbers; Golgi cis face toward the
  ER, COPII forward and COPI backward.
- Numbers recomputed in Python: axon trip times (1 m at 1 µm/s = 11.6 days; at 4 µm/s =
  2.9 days; 1.25 × 10⁸ kinesin steps; qh-0208 69 h = 2.9 days, distractors 28.9 days etc.);
  occupancy (Example 2, qh-0219 = 75%, 81-fold range from Kd/9 to 9Kd); amplification chain
  (1 → 1,000 cAMP → 500 PKA → 50,000 phosphorylase → 10⁶/s; qh-0220 = 5,000, "82" is the
  sum); agar 4 cm cube 57.8% (qh-0283, 33.0% distractor checked); SA:V of a 5 µm cube = 1.2.
- Drills: generated several of each by hand from the YAML and recomputed; answers,
  tolerances and solution text agree (e.g. 100 cm at 0.5 µm/s = 555.6 h = 23.15 days;
  Kd·pct/(100 − pct) always gives exact values).
- Facts confirmed: Blobel 1999 Nobel; Rothman, Schekman and Südhof 2013; Brown and Goldstein
  1985; Sutherland 1971; KDEL = Lys-Asp-Glu-Leu; 14-sugar N-linked precursor; I-cell disease
  (missing phosphotransferase, enzymes secreted into blood); ΔF508 CFTR held in the ER and
  corrector drugs; familial hypercholesterolemia about 1 in 250; kinesin 8 nm per ATP; fast
  axonal transport up to roughly 4–5 µm/s (~400 mm/day); cholera toxin locks Gsα in the GTP
  form; PKA needs 2 cAMP per released catalytic subunit (R2C2 + 4 cAMP → 2 C); about 800
  human GPCR genes and about a third of approved drugs on GPCRs (Hauser 2017); Ras mutated in
  about a fifth of cancers (Prior 2020, ~19%); insulin receptor is a preformed RTK dimer;
  thyroid hormone enters by transporters; epinephrine effects on liver, heart, muscle vessels
  and skin/gut vessels; testosterone (288 Da) is larger than epinephrine (183 Da), as
  qh-0217 says.
- Double-mutant logic (Example 2 and qh-0205) is correct: the double mutant shows the
  earlier block.
- Cross-references hold: Palade's pulse–chase is in lesson 08, phagocytosis in 09, the
  diffusion-time square law in 10, chaperones in honors lesson 05h1.
- All Mermaid diagrams rendered; accTitle/accDescr describe each whole diagram.

## Left uncertain / notes
- Amplification factors (10, 100, 10, 10, 20/s) are illustrative, and the lesson says so.
- The microscope drawing has no separate condenser (the "diaphragm" box stands for the
  condenser and diaphragm assembly), a fine simplification for this level.
- The endomembrane map sends M6P-tagged enzymes straight from the trans-Golgi to the
  lysosome. In reality they pass through endosomes first; this is an acceptable
  simplification and was left as is.
- 10h1 is about 2,300 words with its tables, slightly over the 2,200 target. Not changed.

## Counts
Answer-key errors: 0 (3 accept lists widened). Factual fixes: 3. Picture fixes: 2
(3 files). Other fixes: 2 diagram-readability fixes + 3 accept-list additions.
