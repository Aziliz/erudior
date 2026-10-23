# Biology module 2 (bio-m2): Cells — writer notes

## Counts
- Lessons: 5 (06 bio-cell-theory, 07 bio-cell-types, 08 bio-organelles, 09 bio-membranes,
  10 bio-cell-size); body about 1,450–1,800 words each (counting table text), each with at least
  2 worked examples (3 in most), Common mistakes and Key points.
- Questions (`questions/m02.yaml`, bio-q-0201…0257): 57 (11 or 12 per lesson);
  20 `module_quiz: true` (4 per lesson). Answer positions: 0 → 14, 1 → 14, 2 → 14, 3 → 15.
  (Modules 1+2 together: 28 / 28 / 28 / 29.)
- Drills (`drills/m02.yaml`): 6. Outline ids: bio-magnification, bio-field-size,
  bio-osmosis-direction, bio-sa-volume. Extras: bio-water-potential (lesson 9) and bio-agar-cube
  (lesson 10). bio-cell-types and bio-organelles have none ("—").
- Glossary (`glossary-m2.yaml`): 30 entries ("tonicity" carries hypertonic/hypotonic/isotonic as
  aliases; abbreviations ER, TEM, SEM, SA:V as aliases).
- Cards (`cards-m2.yaml`): 30.
- Figures: potato-core mass-change plot, SA:V = 6/s curve. Pulse–chase, cell comparison and
  Pasteur flask data are Markdown tables.
- `content/math/check-module.sh biology m2`: OK, zero problems.

## For a reviewer
- bio-osmosis-direction asks only for the percent change (numeric). The direction/tonicity part is
  answered in the solution text, since drills can't grade words. Its where clause keeps the result
  consistent with potato cells being isotonic at about 0.38 M (gain below, loss above).
- bio-water-potential (Ψs = −iCRT, R = 0.0831 L·bar/(mol·K), T in K) is honors-level, matching the
  "Water potential (extension)" section in lesson 9; drop it if the course should stay standard-level.
- Lesson 8 pulse–chase table is labelled "simplified, representative results", not Jamieson &
  Palade's exact percentages. Palade's Nobel: 1974.
- Lesson 8 endosymbiosis: "more than 1.5 billion years ago"; human mtDNA has 37 genes; mitochondria
  from alphaproteobacteria, chloroplasts from cyanobacteria.
- Lesson 7 sizes: prokaryotes 1–5 µm, eukaryotic cells 10–100 µm, most viruses 20–300 nm (giant
  viruses are not mentioned). Ivanovsky/Beijerinck filter experiments (1890s), Stanley crystallized
  TMV (1935), Woese rRNA / three domains (1977). Domain and classification terms are left unbolded
  for module 8 (lesson 31 bolds "three-domain system").
- Lesson 6: Leeuwenhoek magnification "up to about 270 times"; light-microscope resolution ≈ 0.2 µm;
  electron microscope "about 1 nm or better" (deliberately conservative for biological specimens).
  Low-power field of view 4.5 mm at 40× is a typical classroom value.
- Lesson 9: Gorter & Grendel (1925) ratio ≈ 2, with the note that their errors cancelled;
  Frye & Edidin (1970) mixing in ≈ 40 min at 37 °C, not at ≈ 15 °C or below; Agre aquaporins (1992).
- Lesson 10: Gurdon (1962) tadpole intestinal-cell nuclear transfer, Nobel 2012. Tissue and organ are
  bolded here, not in lesson 1. Stem cells are left for module 4 and gene regulation for module 6.
- Noticed while checking (not my files): `questions/m05.yaml` line ~410 has `cell''s` inside a `|-`
  block scalar, which will show a doubled apostrophe in the app.

## Sources consulted
- Repo: content/math/AUTHORING.md, biology/WRITERS.md, PROGRESS.md, RESEARCH.md,
  docs/COURSE_FORMAT.md, physics lesson 12 and questions m04 (tone).
- Scope: NGSS HS-LS1-1/2/3 (structure and function, organization, homeostasis); Texas TEKS Biology
  §112.42 (prokaryote vs eukaryote, viruses vs cells, cell transport, cell specialization).
- Historical facts from standard knowledge: Hooke 1665, Leeuwenhoek 1670s, Schleiden 1838, Schwann
  1839, Virchow 1855 (with Remak), Pasteur early 1860s, Palade 1960s, Margulis 1967, Singer–Nicolson
  1972. All writing is original; no copied text or images.
- All numeric answers (questions, worked examples, drill solutions) checked in Python or by
  generating the drills.
