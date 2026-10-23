# Biology module 1 (bio-m1): The science and chemistry of life — writer notes

## Counts
- Lessons: 5 (01 bio-life, 02 bio-method, 03 bio-chemistry, 04 bio-macromolecules, 05 bio-enzymes);
  body about 1,600–1,750 words each (counting table text), each with at least 2 worked examples,
  Common mistakes and Key points.
- Questions (`questions/m01.yaml`, bio-q-0101…0156): 56 (11 per lesson, 12 for bio-enzymes);
  19 `module_quiz: true` (4 per lesson, 3 for bio-macromolecules).
  Answer positions: 0 → 14, 1 → 14, 2 → 14, 3 → 14.
- Drills (`drills/m01.yaml`): 5, every id in the outline: bio-percent-change, bio-mean-data,
  bio-ph-scale, bio-dehydration, bio-enzyme-rate. bio-life has none ("—").
- Glossary (`glossary-m1.yaml`): 32 entries (29 terms + abbreviations CHNOPS, DNA, RNA).
- Cards (`cards-m1.yaml`): 30.
- Figures: bar chart (fertilizer means), water-molecule shape, pH number line, activation-energy
  diagram, temperature-activity curve, pepsin/trypsin pH curves, substrate-saturation curves with
  competitive and noncompetitive inhibitors.
- `content/math/check-module.sh biology m1`: OK, zero problems.

## For a reviewer
- Overlap with other modules: "metabolism" is defined in glossary-m3 (lesson 11), so it is NOT bolded
  in lesson 1 (used in plain text). "homeostasis" is bolded/defined here (lesson 1); if the m9 writer
  also defines it, one entry should be dropped. Population/community/ecosystem/biosphere, negative
  feedback, ATP, phospholipid (bolded in lesson 9), nucleotide are deliberately left unbolded.
- Lesson 1 Viking labeled-release paragraph: stated as "most scientists concluded" a chemical
  (non-biological) cause; worded to avoid overclaiming either way.
- Lesson 3: pH points on the number line are typical values (stomach ≈ 2, coffee ≈ 5, blood 7.4,
  ammonia ≈ 11). Specific heat of dry sand given as ≈ 0.8 J/(g·°C) (literature 0.7–0.8).
- Lesson 3 buffer table and lesson 5 catalase/inhibitor tables are illustrative data, not from a
  specific published study.
- Lesson 4: food tests use Benedict's (reducing sugars; says "simple sugars such as glucose"),
  iodine, biuret, paper spot / Sudan III. Anfinsen's ribonuclease experiment dated "late 1950s"
  (main work 1957–1961).
- Lesson 5: Buchner 1897 cell-free fermentation; Sumner 1926 urease; ribozymes noted as the
  exception to "enzymes are proteins". Temperature curve is a modelled shape, optimum ≈ 37 °C.
- Drill bio-ph-scale accepts [H⁺] typed as 10^-3 or 1e-3 (relTolerance 1%).
- Drill bio-enzyme-rate: integer-percent increases only (where clause), rates relTolerance 1%.

## Sources consulted
- Repo: content/math/AUTHORING.md, biology/WRITERS.md, PROGRESS.md, RESEARCH.md,
  docs/COURSE_FORMAT.md, physics lesson 12 and questions m04 (tone).
- Scope: NGSS HS-LS1 (structure and function, homeostasis), Texas TEKS Biology §112.42
  (biomolecules, enzymes, scientific practices), as summarized in RESEARCH.md.
- Facts checked against standard knowledge: Redi (1668), Pasteur, Viking LR (1976), Buchner (1897),
  Sumner (1926), Anfinsen (Nobel 1972); water specific heat 4.18 J/(g·°C); blood pH 7.35–7.45;
  fat ≈ 9 kcal/g, carbohydrate/protein ≈ 4 kcal/g. All writing is original; no copied text or images.
- All numeric answers (questions and worked examples) checked in Python.
