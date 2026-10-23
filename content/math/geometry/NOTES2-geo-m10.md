# Geometry module 10 (geo-m10), round 2: writer notes

## Added

**Honors lessons (3)**
- `lessons/41h1-projective-planes.md` (geo-m10-h-projective-planes, "Finite geometries and projective planes",
  45 min, about 2,150 words): axioms P1–P3 (why P3 is needed), the Fano plane with full axiom check, order $n$
  and the $n^2 + n + 1$ count (with the one-to-one projection argument), which orders exist (prime powers;
  6 excluded by Bruck–Ryser 1949; 10 by Lam–Thiel–Swiercz 1989; 12 open), affine planes and parallel classes,
  projective ⇄ affine (deleting $DEF$ from the Fano plane gives Lesson 39's four-point geometry), duality with
  a proof of the dual of P3. 4 worked examples.
- `lessons/41h2-saccheri-quadrilaterals.md` (geo-m10-h-saccheri, "Geometry without the parallel postulate",
  45 min, about 1,850 words): what neutral geometry proves (Exterior Angle Inequality, two angles < 180°,
  parallels exist), why the sphere is not a model, the Saccheri–Legendre theorem with Legendre's halving lemma
  and full proof (Archimedean step flagged), the all-or-nothing theorem (stated without proof, labeled),
  additivity of defect, Saccheri quadrilaterals (summit angles congruent by SAS + SSS; never obtuse), Saccheri
  1733 and Lambert 1766/1786. 4 worked examples.
- `lessons/41h3-buffon-bertrand.md` (geo-m10-h-buffon-bertrand, "Buffon's needle and Bertrand's paradox",
  45 min, about 1,750 words): Buffon's model (x, θ uniform and independent, flagged as a modeling choice),
  sample-space rectangle derivation (area under sin = 1 stated as a calculus fact, checked by midpoint
  rectangles), Barbier's 1860 noodle argument, ℓ > d gives expected crossings not probability, Monte Carlo
  estimation of π and 1/√N error, Lazzarini 1901 (flagged as widely doubted), Bertrand's paradox (1/3, 1/2, 1/4)
  with Jaynes 1973 noted as contested. 4 worked examples.

**Core lessons (additions only)**
- 39: Mermaid "which method shows which fact" (consistency / independence / theorem / not a theorem) after
  Example 1, plus a closing sentence; SVG of Euclid's first four postulates after the postulate list.
- 40: SVG comparing Euclidean / spherical / hyperbolic triangles after the table; SVG of lines on a sphere
  (equator, latitude, great circle through the poles) with two sentences; Mermaid timeline of the parallel
  postulate (Euclid → Saccheri → Lobachevsky/Bolyai → Beltrami → Einstein) with a sentence on relative consistency.
- 41: Mermaid "which measure: length, area or volume" after the basic principle; labeled SVG of the meeting-problem
  square with a short paragraph reading its regions.

**Questions (`questions/r2-geo-m10.yaml`, 57)**
- Core, 15 (geo-m10-r2-q01–q15): 4 text, 3 match, 3 select-all, 3 label, 2 order. `module_quiz: true` on
  q02, q03 (39), q07, q08 (40), q11, q12 (41). Lesson 39 has no order question (no step list there has a single
  correct order), it has a match instead.
- Honors, 42 (geo-m10-r2-h01–h42, 14 per lesson): 26 multiple choice, 5 text, 3 select-all, 3 match, 3 order,
  2 label. No `module_quiz` (core-module honors).
- Single-answer positions (26): 0→6, 1→6, 2→7, 3→7.

**Pictures (13 SVGs in `images/`, all original)**: geo-m10-postulates (+ -blank), geo-m10-sphere-lines (+ -blank),
geo-m10-three-triangles, geo-m10-meeting (+ -blank), geo-m10-fano, geo-m10-saccheri (+ -blank), geo-m10-buffon
(+ -blank), geo-m10-bertrand. All rendered with preview-figure.mjs and looked at, label markers included.
Largest is 10.8 KB.

**Mermaid diagrams (6)**: 3 in the core lessons (above), plus projective ⇄ affine (41h1), Saccheri's three
hypotheses (41h2), Barbier's argument (41h3). All rendered and checked.

**Lesson figures**: `shape` of Legendre's construction (41h2); `plot` of Buffon's sample-space rectangle with the
shaded region under (ℓ/2) sin θ (41h3).

**Drills (`drills/r2-geo-m10.yaml`, 7)**: geo-m10-r2-proj-count, geo-m10-r2-affine-count (41h1);
geo-m10-r2-defect-split, geo-m10-r2-saccheri (41h2); geo-m10-r2-buffon, geo-m10-r2-buffon-pi,
geo-m10-r2-bertrand (41h3). 3-decimal answers use tolerance 0.001.

**Glossary (`glossary-r2-geo-m10.yaml`, 17)**: finite geometry, projective plane, Fano plane, order of a projective
plane, affine plane, parallel classes, point at infinity, principle of duality (alias "duality" only: "dual" is
already an alias of geo-m8's "dual polyhedron"), Saccheri–Legendre theorem, Saccheri quadrilateral, summit,
summit angles, Lambert quadrilateral, sample space, Buffon's noodle (alias Barbier's theorem), Monte Carlo method,
Bertrand's paradox. All glossary files checked for duplicates. "neutral geometry" is bolded in 41h2 but defined
by geo-m3 (glossary-r2-geo-m3.yaml), so not redefined here. In 41h2 "base" and "legs" are deliberately not bolded
(existing glossary entries mean the isosceles base and right-triangle legs).

**Cards (`cards-r2-geo-m10.yaml`, 27)**: 10 for 41h1, 9 for 41h2, 8 for 41h3.

`content/math/check-module.sh geometry geo-m10`: OK, zero problems (warning only about another writer's
cards-r2-geo-m9.yaml, which currently has a YAML error).

## For a reviewer
- 41h1: the Spot It!/Dobble remark (55 cards vs 57 lines of the order-7 plane) is hedged as "usually explained";
  the claim that P3 guarantees a point off any two lines is stated without proof.
- 41h2: the all-or-nothing theorem (one triangle with defect 0 forces all) is stated without proof and labeled so.
  Saccheri's quote is the usual English rendering of "repugnans naturae lineae rectae". The 09h1 lesson (geo-m3)
  also discusses neutral geometry and Euclid I.16/I.27; 41h2 builds on that rather than repeating the I.27 proof.
- 41h3: Lazzarini's figures (3408 tosses, 1808 crossings, ℓ/d = 5/6 → 355/113) recomputed in Python; his typical
  error (~0.05) computed from the binomial standard deviation. Barbier's argument is labeled as skipping details.
- All numbers recomputed in Python (Fano axioms checked by script; Buffon and Bertrand method-1 formulas checked by
  simulation; projective/affine counts; defect examples).

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard results: Euclid, *Elements* Book I (Props. 16, 27, 29); Hilbert-style neutral geometry as in
Greenberg, *Euclidean and Non-Euclidean Geometries*; Bruck and Ryser (1949); Lam, Thiel and Swiercz, "The
non-existence of finite projective planes of order 10" (1989); Saccheri, *Euclides ab omni naevo vindicatus* (1733);
Lambert, *Theorie der Parallellinien* (written 1766, published 1786); Barbier (1860) on Buffon's noodle;
Bertrand, *Calcul des probabilités* (1889); Jaynes, "The well-posed problem" (1973); Badger, "Lazzarini's lucky
approximation of π" (Mathematics Magazine, 1994).
