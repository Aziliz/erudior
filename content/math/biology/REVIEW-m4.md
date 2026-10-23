# Module 4 review (bio-m4, Cell division)

## What I checked
- Lessons 14–16 read in full; worked examples recomputed (fruit-fly chromosome/chromatid counts; mitotic index 10%, prophase 72 min; 2³⁰ = 1,073,741,824 and 30 × 60 days ≈ 4.9 years, 2⁴⁰ ≈ 10¹² cells; 2²³ = 8,388,608; 2⁴⁶ ≈ 7.0 × 10¹³; 2³ = 8, 8 × 8 = 64; nondisjunction outcomes).
- All 37 questions worked before reading the key; every key correct, every distractor wrong; numbers checked in Python (0408, 0409, 0420, 0421, 0430, 0431).
- All 7 drills (formulas for chromosome/DNA counts at every stage in mitosis and meiosis traced by hand).
- Glossary and cards against the lessons; no duplicate terms with other modules.
- NOTES-m4 items: nondisjunction is defined only in glossary-m4 and lesson 21 does not bold it (it refers back to lesson 16) — OK. "chromosome" had no glossary entry anywhere — added (below). Cell-cycle timings are typical textbook values. History: Flemming 1882 (salamander), Rao & Johnson 1970 (fusion), Hunt's sea urchin cyclins, MPF in frog eggs, 2001 Nobel (Hartwell, Hunt, Nurse), Knudson 1971, Hertwig 1876, van Beneden 1883 (Ascaris, 2 + 2 chromosomes), Yamanaka 2006 / Nobel 2012 — consistent with standard sources; corrections below. p53 "about half of human cancers" is the standard figure (pan-cancer sequencing gives roughly 40–50%). Down syndrome text is respectful and accurate.
- Consistency with module 5 on independent assortment: lesson 16 / glossary-m4 (random orientation of each homologous pair at metaphase I, 2ⁿ combinations) and lesson 18 / glossary-m5 (Mendel's law; cellular basis = random orientation in metaphase I; linked genes are the exception) agree. Lesson 16 never tied the chromosome event to Mendel's law or mentioned linkage, so I added a bridge on my side.

## Changes
| File | Change | Why / source |
|---|---|---|
| lessons/14-cell-cycle.md | "about a few hundred billion cells every day" → "roughly 330 billion ..., most of them blood cells" | Sender & Milo 2021 (Nature Medicine): ~330 billion cells replaced daily, ~90% blood cells. https://wis-wander.weizmann.ac.il/node/11205 |
| lessons/14-cell-cycle.md, glossary-m4.yaml | Bolded **chromosome** at its definition in lesson 14 and added a glossary entry | No module's glossary defined this core term (writer flagged it). The editor may move it to module 2 if preferred. |
| lessons/15-cancer.md, cards-m4.yaml | Yamanaka 2006: "ordinary mouse fibroblasts (connective-tissue cells, such as those in skin)", with human skin cells following in 2007 (was "ordinary skin cells" in 2006) | The 2006 Cell paper used mouse fibroblasts; human iPSCs came in 2007. |
| lessons/16-meiosis.md | "Biologists in the 1880s" → "in the 1870s and 1880s" | The next sentence cites Hertwig in 1876. |
| lessons/16-meiosis.md | "Several crossovers usually happen on each pair" → "at least one crossover on every pair, and longer chromosomes often have two or three" | Human meiosis averages ~40–70 crossovers over 23 pairs (about 2–3 per pair), with at least one per pair needed for normal segregation; "several" overstated it. Broman et al., https://kbroman.org/pdfs/broman2002.pdf |
| lessons/16-meiosis.md | Added 2 sentences after 2²³: this shuffle is the physical basis of Mendel's law of independent assortment (lesson 18) for genes on different chromosomes; genes close together on one chromosome travel together unless crossing over separates them | Consistency with lesson 18 / glossary-m5. |
| glossary-m4.yaml (independent assortment) | Added "physical basis of Mendel's law of independent assortment for genes on different chromosomes" | Same. |
| questions/m04.yaml bio-q-0430 | Explanation said 10 "adds instead of multiplying"; 10 is 2 × 5 | Explanation error. |
| questions/m04.yaml bio-q-0431 | Explanation for 64 and 32 was muddled; now 64 = 8 × 8 (2n used as gamete count), 32 = 16 + 16 | Explanation clarity. |

## Couldn't verify / for the editor
- glossary-m5's "law of independent assortment" says it holds for genes "on different chromosomes or far apart on one". The "far apart" case is due to crossing over, not to metaphase I orientation as that entry's "because" clause says. That is module 5's file, so I left it; the module 5 reviewer or editor may want to reword.
- Rao & Johnson's paper title and results are confirmed (https://www.macmillanlearning.com/studentresources/highschool/biology/pol1e/investigation_links/0770.html); I did not confirm that their mitosis × interphase fusions were in the same 1970 paper (the premature condensation work is Johnson & Rao 1970 in a companion paper). The lesson's wording doesn't depend on it.
