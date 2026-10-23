# Round 2 notes: geo-m6 (Similarity and right triangles)

`content/math/check-module.sh geometry geo-m6`: OK, zero problems (10 lessons, 157 questions, 26 drills).
The only warning was about another writer's file (`cards-r2-geo-m9.yaml`, a YAML error).

## Honors lessons (3, since the module has 7 core lessons)

| File | Id | Title | Words | Questions | Drills |
|---|---|---|---|---|---|
| 26h1-pythagorean-triples.md | geo-m6-h-triples | Pythagorean triples and more proofs | ~2,100 | h01–h14 | geo-m6-r2-euclid-triple, geo-m6-r2-semicircles |
| 26h2-triangulation.md | geo-m6-h-triangulation | Triangulation, bearings and measuring the unreachable | ~1,650 | h15–h28 | geo-m6-r2-two-angles, geo-m6-r2-bearing |
| 26h3-golden-ratio.md | geo-m6-h-golden | The golden ratio and figures similar to their own parts | ~1,750 | h29–h42 | geo-m6-r2-golden |

- **Triples:** Garfield's trapezoid proof; the generalized theorem for similar figures on the sides (Euclid VI.31); primitive triples and the parity argument (squares mod 4); Euclid's formula, when it gives primitive triples, and a proof sketch that it gives all of them; triples as rational points on the unit circle; history with uncertainty marked (Plimpton 322's purpose is debated, Pythagoras's authorship is traditional).
- **Triangulation:** height from two angles of elevation (two methods, Law of Sines and tangents); three-digit bearings, back bearings, a two-leg voyage solved with both laws and checked with coordinates; triangulation chains from a baseline (Snellius, the Great Trigonometrical Survey; flat-earth simplification labeled); sensitivity of the result to angle errors.
- **Golden ratio:** golden rectangle from similarity; φ² = φ + 1 and 1/φ = φ − 1; Euclid's extreme and mean ratio; regular pentagon, golden triangle and gnomon, diagonal/side = φ; exact cos 36° and cos 72°; Fibonacci ratios; a "fact and myth" section labeling unsupported claims (Parthenon, nautilus, "most beautiful rectangle").

## Core lessons (additions only)

| Lesson | Added |
|---|---|
| 20 | shape figure (1×1 square vs 3×3 grid); Mermaid "from any ratio to any ratio through k" |
| 21 | Mermaid "which similarity test"; picture geo-m6-shadow.svg at Example 5 |
| 22 | picture geo-m6-rearrangement.svg in the rearrangement proof; Mermaid "classify by sides" |
| 23 | picture geo-m6-special-halves.svg (square and equilateral halves); Mermaid "short leg first" |
| 24 | Mermaid "which ratio" (LR); picture geo-m6-elevation.svg |
| 25 | shape figure for the river example; Mermaid SSA counting chart |
| 26 | shape figure for the two boats; Mermaid "solving any triangle" (LR) |

## Questions (`questions/r2-geo-m6.yaml`, 77)

- Core q01–q35 (5 per lesson): 10 text, 7 match, 7 order, 7 select-all, 4 label. 8 marked `module_quiz` (1–2 per lesson).
- Honors h01–h42 (14 per lesson): 21 multiple choice, 8 text, 5 select-all, 3 order, 3 match, 2 label.
- Multiple-choice answer positions spread over 0–3 (5/4/7/5).

## Pictures (`images/`)

geo-m6-shadow (+blank), geo-m6-rearrangement (+blank), geo-m6-special-halves (+blank), geo-m6-elevation (+blank),
geo-m6-garfield, geo-m6-two-angles (+blank), geo-m6-bearings, geo-m6-golden-rectangle, geo-m6-pentagon (+blank).
All original SVGs (1–3 KB each), drawn from computed coordinates; all previewed, blanks previewed with their markers.

## Drills (`drills/r2-geo-m6.yaml`, 5)

geo-m6-r2-euclid-triple, geo-m6-r2-semicircles, geo-m6-r2-two-angles (nearest 0.1 m, tolerance 0.1),
geo-m6-r2-bearing (distance tolerance 0.02, bearing nearest 0.1°, tolerance 0.1), geo-m6-r2-golden (3 modes, tolerance 0.01).
The two-angle and bearing formulas were checked against independent formulas on 20,000 random inputs.

## Glossary and cards

- `glossary-r2-geo-m6.yaml`, 14 terms: primitive Pythagorean triple, Euclid's formula, rational point, Generalized Pythagorean theorem, bearing, back bearing, triangulation, baseline, golden ratio, golden rectangle, logarithmic spiral, extreme and mean ratio, golden triangle, Fibonacci sequence. No clashes with any glossary file in the course (another writer has "gnomon"; I didn't bold or define "golden gnomon").
- `cards-r2-geo-m6.yaml`, 28 cards (10 triples, 8 triangulation/bearings, 10 golden ratio).

## For a reviewer

- Historical claims to double-check: Garfield's 1876 proof in the *New-England Journal of Education*; Plimpton 322 dated about 1800 BCE with 119/169; Euclid's formula in Book X of the *Elements*, the generalized theorem as VI.31; Snellius's triangulation around 1615; the Great Trigonometrical Survey began in 1802; "golden" as a name from the 1800s.
- Golden-ratio myths are stated cautiously ("no surviving evidence", "generally do not match", "mixed results").
- Label questions use Unicode in answers (c², s√3, 36°) because drop-downs can't render TeX.
- I changed no existing questions, drills, cards or glossary entries, and found no errors in existing geo-m6 content.

## Sources

Standard results (Euclid's *Elements* I.47, VI.31, X.29 lemma; rational parametrization of the circle; golden triangle). History from general references on Garfield's proof, Plimpton 322 (Robson's work on its interpretation), Snellius's *Eratosthenes Batavus* (1617) and the Great Trigonometrical Survey of India. All numbers were recomputed in Python.
