# Review of Biology module 1 (bio-m1): The science and chemistry of life

Reviewer pass, 2026-10-23. Files: lessons 01–05, questions/m01.yaml, drills/m01.yaml,
glossary-m1.yaml, cards-m1.yaml.

## What was checked
- All 56 questions worked independently before reading the key; every key correct; every
  distractor checked for a second defensible answer (none found). Numeric items (means, percent
  change, molar masses, rates, pH ratios) re-computed in Python.
- All 5 lessons read in full, including worked examples (re-computed: specific heat 10 450 J /
  2000 J / ≈1.9 °C, pH 10⁶ ratio, 342 and 1638 g/mol, 0.8 and 0.15 mL/s, 38% fertilizer change).
- All 5 drills: prompts, answer types, where clauses and solution text.
- Glossary (32) and cards (30): consistent with lessons. No duplicate terms in other modules'
  glossaries (checked `homeostasis` against m3–m10: only m1 defines it so far).
- Every item in NOTES-m1.md "For a reviewer".
- Lesson 11 back-reference: it calls ATP an RNA-like nucleotide "you met in module 1". Lesson 4
  only said "a modified nucleotide, ATP"; added the structure (see below).
- Answer positions unchanged: 14 / 14 / 14 / 14. `check-module.sh biology m1`: OK.

## Changes
Key errors: 0.

Factual / precision fixes:
1. `lessons/01-life.md` Viking LR: heat-sterilized control "gave much less gas" → "gave almost
   none" (heating at 160 °C completely inhibited the response).
   Source: https://web.mit.edu/12.000/www/finalpresentation/experiments/lr.html
2. `lessons/03-chemistry.md` ice: "about 9% less dense" was wrong; ice (0.917 g/cm³) is about
   8% less dense and occupies about 9% more volume. Reworded. Same fix in the explanation of
   `bio-q-0127`. (Standard densities; computed 0.917/1.000.)
3. `lessons/03-chemistry.md` Example 3: a 3.8-unit pH drop was called "a ten-thousandfold rise";
   it is about 6000-fold. Now "several thousandfold (10^3.8 ≈ 6000)".
4. `lessons/04-macromolecules.md`: "carbohydrates have neither [N nor P]" and "Nitrogen rules out
   carbohydrates" are untrue for chitin, which the lesson itself lists. Now "ordinary
   carbohydrates", with chitin named as the exception. `bio-q-0137` explanation: "typical
   polysaccharides".
5. `lessons/04-macromolecules.md`: unsaturated fats kink "in the usual natural (cis) form"
   (trans double bonds do not kink, and module/teachers may raise trans fats).

Cross-module (requested by editor):
6. `lessons/04-macromolecules.md` Nucleic acids: added that ATP (adenosine triphosphate) is built
   like an RNA nucleotide, with adenine and ribose, but carries three phosphate groups. This makes
   lesson 11's "close kin to the building blocks of RNA you met in module 1" true. ATP is not
   bolded here (glossary-m3 owns it).

Unclear stems / explanations:
7. `bio-q-0121` (storks): explanation said "larger, more rural areas"; replaced with a coherent
   town-size confounder explanation matching the stem.
8. `bio-q-0142`: "In the 1950s" → "In the late 1950s" to match the lesson.

Other:
9. `drills/m01.yaml` bio-enzyme-rate: the solution computed percent increase from the rates
   rounded to 2 decimals, which could print a percent that does not match the bold answer (e.g.
   7 mL / 15 s → 0.47). Solution now compares the volumes directly.

## NOTES-m1 items
- Homeostasis bolded only in m1 so far: fine; the m9 writer should not re-define it.
- Viking paragraph: wording "most scientists concluded" a chemical cause is fair; kept.
- pH points, sand specific heat ≈0.8 J/(g·°C), illustrative buffer/catalase/inhibitor tables:
  acceptable as labeled.
- Benedict's wording ("simple sugars such as glucose"): acceptable (strictly, reducing sugars).
- Anfinsen "late 1950s": fine (work 1957–1961; Nobel 1972). Buchner 1897, Sumner 1926, Redi 1668:
  correct.
- CHNOPS "roughly 98%": C, H, O, N alone are ≈96% of human mass, P ≈1%, S ≈0.3%, so ≈97–98%;
  "roughly 98%" left as is. Source: https://courses.lumenlearning.com/wm-nmbiology1/chapter/elements-in-biological-matter/

## Could not verify / for the editor
- Nothing outstanding. The 98% CHNOPS figure is on the high side of what sources give (97–98%).
