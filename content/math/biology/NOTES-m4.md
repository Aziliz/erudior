# Module 4 (bio-m4, Cell division): writer notes

## Counts
- Lessons: 3 (14 bio-cell-cycle, 15 bio-cancer, 16 bio-meiosis); bodies about 1,450 / 1,640 / 1,670 words excluding figures.
- Questions: 37 (`questions/m04.yaml`, bio-q-0401 to bio-q-0437): 12 / 13 / 12 per lesson; 12 `module_quiz: true` (4 per lesson, every topic covered). Answer positions: 0 ×9, 1 ×9, 2 ×9, 3 ×10.
- Drills: 7 (`drills/m04.yaml`): bio-mitotic-index, bio-phase-time, bio-chromatid-count (extra), bio-doubling, bio-doubling-time (extra), bio-gamete-combos, bio-meiosis-count (extra).
- Glossary: 32 entries (`glossary-m4.yaml`): 30 terms + 2 abbreviations (CDK, iPSC). Every bolded term has an entry and every entry is bolded once.
- Cards: 29 (`cards-m4.yaml`).
- Figures: DNA-content-through-the-cycle plot (L14); cyclin/CDK levels plot (L15). Mitosis/meiosis stages are described in numbered lists and comparison tables rather than drawn.
- `content/math/check-module.sh biology m4`: build and checker OK, zero problems.

## For the reviewer
- `nondisjunction` was briefly also in glossary-m5.yaml; by the end of my run only glossary-m4.yaml defines it (lesson 16 introduces it). Check that lesson 21 no longer bolds it as a new term, or that it relies on this entry.
- Module 5 has "law of segregation / independent assortment" entries; this module's `independent assortment` (the meiosis event) did not collide by name, but check they read consistently.
- I did not bold "chromosome" or "chromatin" (likely introduced with the nucleus in module 2, and DNA structure is module 6); used plainly. If no earlier module bolds "chromosome", the editor may want to add it.
- Cell cycle timings (human cell in culture ~24 h: G1 ~11, S ~8, G2 ~4, M ~1) are typical textbook values.
- Historical details to spot-check: Flemming 1882 (salamander); Rao & Johnson 1970 cell fusion; Hunt (sea urchin cyclins), MPF in frog eggs, 2001 Nobel (Hartwell, Hunt, Nurse); Knudson 1971 two-hit; Yamanaka 2006 / Nobel 2012; Hertwig 1876 sea urchin fertilization; van Beneden 1883 Ascaris (gametes contributing 2 chromosomes each — true of the "bivalens" variety).
- p53 "mutated in about half of human cancers"; HPV vaccine and cervical cancer mentioned briefly. Down syndrome described respectfully (trisomy 21, maternal-age effect, many people live into their 60s).
- Stem cell ethics mentioned neutrally (some people object to using embryos; iPSCs avoid it).

## Sources consulted
Standard cell biology (Alberts, Molecular Biology of the Cell; Weinberg, The Biology of Cancer) for checkpoints, cyclin–CDK, oncogene/tumor suppressor logic and stem cell potency; history of cytology (Flemming, Hertwig, van Beneden, Weismann). All writing original. Numeric answers (2²³ = 8,388,608; 2³⁰ ≈ 1.07 × 10⁹; mitotic index and timing examples) checked in Python.
