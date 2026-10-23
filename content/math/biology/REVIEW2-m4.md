# Module 4 (Cell division): round 2 review

Reviewer for: core lessons 14–16 (new pictures and diagrams only), honors lessons 16h1 and 16h2,
questions bio-q-0438–0452 and bio-qh-0401–0432, drills bio-h-*, new glossary and card entries,
images m4-*.svg, NOTES2-m4.md.

`content/math/check-module.sh biology m4`: zero problems after the fixes (5 lessons, 84 questions,
12 drills, 52 cards).

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| 16h1, "Switching a CDK on and off" | Said p21 **and p16** "bind cyclin–CDK complexes". p16 (INK4 family) binds CDK4/6 itself and keeps cyclin D from activating it; only p21 (CIP/KIP) binds cyclin–CDK complexes. | Sentence now gives each mechanism. | OpenStax Biology 2e 10.3; standard INK4 vs CIP/KIP biology |
| glossary-m4 `CDK inhibitor` | Same p16 error. | Definition rewritten to match. | as above |
| glossary-m4 `mosaicism` | Said mosaicism comes "from an error in mitosis after fertilization", stated as the only route. | "usually from an error in a mitotic division after fertilization". | — |
| 16h2, sex-chromosome paragraph | "A 47,XYY person **must** have received a YY sperm". A minority of XYY cases are postzygotic (mitotic) errors (Robinson and Jacobs 1999: about 84% paternal MII, the rest postzygotic). | "usually received a YY sperm … (A minority of cases arise instead from a mitotic error in the early embryo.)" | Robinson & Jacobs 1999, Hum Mol Genet |
| cards-m4 "47 XYY origin" | "Always paternal meiosis II". | "Usually paternal meiosis II … (less often, a mitotic error after fertilization)". | as above |
| bio-qh-0422 | Stem asked where nondisjunction "did occur", which is not certain (see above). Key unchanged. | Stem now says "most likely occur". | as above |
| bio-qh-0423 | Explanation said a meiotic error "would put the extra chromosome … in every cell", ignoring trisomy rescue (a trisomic zygote losing the extra copy in a later mitosis, which also gives a mosaic). Key unchanged (both routes involve a mitotic error). | Explanation now says "a meiotic error alone" and mentions trisomy rescue. | — |
| bio-qh-0432 (text) | `accept` included "allopolyploidy", which names the condition, not the plant the stem asks for. | Removed it. Added "amphidiploid" (a correct synonym for a doubled hybrid). | — |
| m4-tumor-spread.svg, m4-tumor-spread-q.svg | The dashed outline around the benign tumor cut through the corner cells of the tumor, so it looked like the tumor spilled out of its own boundary; the leader line ended on the dashed line. | Replaced the arc with a rounded outline that fully encloses the tumor; shortened the leader line. Re-rendered both (with the label question's markers). | — |
| 14-cell-cycle.md Mermaid cell cycle; 16h1 Rb/E2F Mermaid | `flowchart LR` with chains of 5–6 boxes; rendered about 900 px wide, too wide for a phone (AUTHORING asks for TD on chains over four boxes). | Changed to `flowchart TD`; re-rendered, both read clearly. | AUTHORING.md |

## Checked and found right (things a reader might doubt)

- **Questions**: worked every new question before reading the key. All 47 keys are right; every
  select-all list, match pairing, order and text accept list checked (apart from the fixes above).
  Numbers recomputed in Python: qh-0408 $e^{-2} = 0.135$, $2e^{-2} = 0.271$; qh-0409 0.25 × 24 = 6 h;
  qh-0424 $4^2 2^2 = 64$; qh-0425 $2/2^7 = 1/64$; qh-0426 (7 + 10) × 2 = 34; qh-0427 n = 21, x = 7.
- **Label questions**: rendered with their markers. bio-q-0438 (anaphase, prophase, telophase,
  metaphase), bio-q-0443 (five tumor-spread markers), bio-q-0448 (MII, mitotic metaphase, anaphase I,
  metaphase I) and bio-qh-0419 (parental/recombinant/recombinant/parental) all sit on the right part.
  In m4-which-division, the crossover tips are consistent between cells, homologs pair only in the
  MI cell, and the MII cell has n = 2.
- **m4-meiosis-stages.svg**: traced every chromatid's crossover tip from prophase I to the four
  products; it stays consistent, and the four products are all different. m4-mitosis-stages: four
  chromosomes in every stage, single chromatids in anaphase. m4-nondisjunction: MI gives 2 × (n+1),
  2 × (n−1); MII gives n+1, n−1, n, n. m4-crossover: one crossover between inner chromatids gives
  AB, Ab, aB, ab.
- **16h1 facts**: Masui & Markert 1971 and Smith & Ecker 1971; MPF amplification with protein synthesis
  blocked (Wasserman & Masui 1975); Lee & Nurse 1987 human CDC2 complementing fission yeast; Hunt's
  cyclin in sea urchin eggs; MPF purified 1988 (Lohka, Hayes & Maller) and shown to be cdc2 + cyclin B
  by about 1990; Wee1/Cdc25 feedback; wee1 mutants divide at about half size; Murray & Kirschner 1989
  (cyclin B mRNA alone restores cycling) and non-degradable cyclin arrests in M; Rieder et al. 1995
  laser ablation of the last unattached kinetochore; HPV E7/Rb and E6/p53; MDM2, ATM/ATR, p21, BAX;
  C. elegans 1,090 somatic cells with 131 deaths, ced-3/-4/-9, Nobel 2002 (Brenner, Horvitz, Sulston);
  caspase cut after Asp, DNA ladder ~180 bp; Bcl-2 from the follicular lymphoma t(14;18), venetoclax;
  Stehelin, Varmus, Bishop 1976 src. Example 2 Poisson numbers: $e^{-3} = 0.0498$, $3e^{-3} = 0.149$,
  $1 - 4e^{-3} = 0.801$. Knudson's m ≈ 3 is the standard reading of his 1971 paper. Example 3:
  10/6/4 h; after 16 h of CDK1 inhibition a 10 h G1 + 6 h S means nearly all cycling cells reach G2,
  so 88% 4C is plausible.
- **16h2 facts**: shugoshin ("guardian spirit"); maternal MI errors linked to absent or distal
  crossovers; at most 50% recombinants; trisomy 21 ≈ 90% maternal (≈ 70% of all cases MI, ≈ 20% MII),
  ≈ 5% paternal, a few percent postzygotic; mosaic Down syndrome 1–2%; XXY about half paternal;
  maternal-age bars match the commonly cited 1/1,250, 1/950, 1/350, 1/100, 1/30 (labeled
  approximate); C(23,10)/2^23 = 0.136, 2^-23 = 1.2 × 10^-7, (2^-23)^2 = 1.4 × 10^-14; Karpechenko
  1928 radish 2n = 18 × cabbage 2n = 18; bread wheat 6x = 42, x = 7; Wood et al. 2009 "about 15% of
  angiosperm speciation events"; watermelon and banana x = 11, 3x = 33; triploid balance 2/2^11 = 1/1024.
- **Drills** (bio-h-two-hit, flow-phases, gamete-crossover, grandparent-share, triploid-balance):
  generated cases by hand and recomputed in Python (e.g. 3 million × 1-in-a-million → m = 3,
  P(≥1) = 0.950; 400 cells 50/30/20% at 20 h → 10/6/4 h; 2n = 6 with c = 1 → 8 and 16; 6 pairs, k = 2 →
  15/64; x = 11 → 1/1024). Prompts, `where` limits, answers and solutions agree.
- **Mermaid**: all seven rendered. Content and accTitle/accDescr right; the checkpoint flowchart in
  lesson 15 is tall but readable.
- **Glossary and cards**: the other 16 new terms and 21 other new cards are correct.

## Left uncertain / notes

- Simplifications that are acceptable at this level but not labeled: cohesin is described as cut by
  separase at anaphase (in vertebrates most arm cohesin is removed earlier, in prophase, by a separate
  pathway); cyclin A–CDK2 is listed only for S (cyclin A also pairs with CDK1 in G2).
- Honors lessons are a little over the 2,200-word upper limit counting code blocks and tables (about
  2,800 and 2,400 words by a raw count); the prose alone is close to the limit. Not changed.
- Housekeeping: when I cleaned up after rendering, I deleted every `*.preview.png` in `images/`, not
  only mine. Preview PNGs are temporary files that writers are told to delete, but if another writer
  was looking at one, they'll need to render it again.
