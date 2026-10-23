# Round 2 notes: module mv-m2 (Vector functions and motion)

`content/math/check-module.sh multivariable mv-m2`: build and checker report zero problems
(6 lessons, 97 questions, 12 drills, 48 cards).

## Added

**Honors lessons** (2; the module has only 4 core lessons, so not 3)
- `lessons/10h1-frenet-serret.md` (mv-m2-h-frenet-serret, "Torsion and the Frenet–Serret formulas", 45 min, about 2,200 words counting math tokens, 1,400 without):
  why dB/ds is parallel to N, the sign convention (labeled as a convention), derivation of all three
  Frenet–Serret formulas, the Darboux vector, the torsion formula derived from the TNB form of r''',
  the theorem "τ = 0 means planar" with proof, the fundamental theorem of space curves (stated
  without proof), helix from constant κ and τ, and an application: clothoid transition curves on
  railways and highways (κ = s/A², linear lateral acceleration, constant jerk; cant labeled as simplified).
  Examples: general helix (κ = a/(a²+b²), τ = b/(a²+b²)); twisted cubic τ(t) = 3/(9t⁴+9t²+1);
  spotting a plane curve (x+y+z = 1); designing a 100 m transition into R = 500 m at 30 m/s.
  Closes the "torsion computation" coverage gap in VERIFY.md.
- `lessons/10h2-kepler.md` (mv-m2-h-kepler, "Kepler's laws from Newton's law of gravitation", 50 min, about 1,650 words counting math tokens, 1,200 without):
  history (Kepler 1609/1619, Newton 1687), central forces conserve h = r × v (planar orbit, equal
  areas, valid for any central force), full vector derivation of the conic orbit
  r = (h²/GM)/(1 + e cos θ), third law with its constant 4π²/GM, simplifications labeled (fixed
  Sun, G(M+m), perturbations, relativity). Examples: perihelion/aphelion speed ratio for Earth;
  Earth's year; Mars in AU/years; geostationary radius; circular-orbit speed at 400 km.
  Closes the "Kepler's laws" coverage gap in VERIFY.md.

**Core lessons 07–10** (additions only; each new figure has a sentence introducing it)
- 07: 3D helix picture with position vector, tangent vector and xy-projection (SVG); plot of secant
  vectors turning into the tangent direction.
- 08: plot of chords approximating arc length; "which curvature formula" decision chart (Mermaid).
- 09: TNB frame with the osculating plane (SVG); procedure chart r → T → N → B, κ, a_T, a_N (Mermaid).
- 10: "from force to path" chart F → a → v → r (Mermaid); labeled projectile sketch (v₀, α, H, R) (SVG).

**Pictures** (9 original SVGs in `images/`, each under 10 KB, all previewed; markers checked):
mv-m2-helix, mv-m2-helix-blank, mv-m2-tnb, mv-m2-tnb-blank, mv-m2-projectile,
mv-m2-projectile-blank, mv-m2-orbit, mv-m2-orbit-blank, mv-m2-transition.

**Diagrams** (5 Mermaid, all with accTitle/accDescr, all previewed): curvature formula chooser (08),
TNB procedure (09), force to path (10), Frenet–Serret coupling T ↔ N ↔ B (10h1), Newton-to-Kepler
logical chain (10h2). **Plots**: 2 new (07, 08).

**Questions** (50 new, `questions/r2-mv-m2.yaml`)
- Core, mv-m2-r2-q01…q20 (5 per lesson; each lesson has a text, a match, an order and a select-all
  question, plus a label question in 07, 09 and 10 and an MC in 08):
  label 3 (q01, q11, q16), text 4 (q02, q06, q12, q17), match 4 (q03, q07, q13, q20),
  order 4 (q05, q09, q15, q18), select-all 4 (q04, q08, q14, q19), MC 1 (q10).
  module_quiz: q01, q04, q06, q08, q11, q12, q16, q19 (2 per lesson).
- Honors Frenet–Serret, h01…h15: 10 MC, 2 text (h10, h15), 1 match (h11), 1 order (h12), 1 select-all (h13).
- Honors Kepler, h16…h30: 9 MC, 1 label (h16), 2 text (h21, h28), 1 match (h25), 1 order (h26), 1 select-all (h27).
- Honors questions have no module_quiz (core-module honors lessons).
- Answer positions of the 20 new 4-choice MC questions: 0: 5, 1: 5, 2: 5, 3: 5.

**Drills** (5, `drills/r2-mv-m2.yaml`): mv-m2-r2-torsion-helix (exact fractions),
mv-m2-r2-torsion-cubic (3 decimals or fraction), mv-m2-r2-transition (angle, a_N, jerk) for 10h1;
mv-m2-r2-circular-orbit (speed, period), mv-m2-r2-kepler-third (a, e, T from perihelion/aphelion)
for 10h2. Each generated 500 times against independent formulas: 0 mismatches; answers rounded
as the prompt asks are accepted. Values renamed to avoid TeX placeholder clashes; numbers inside
math use `dp0` to avoid comma grouping.

**Glossary** (18 new terms, `glossary-r2-mv-m2.yaml`, checked against glossary.yaml and
glossary-r2-mv-m1.yaml, no duplicate terms or aliases): Frenet–Serret formulas, Darboux vector,
intrinsic, fundamental theorem of space curves, transition curve, clothoid (Euler/Cornu spiral),
jerk, Kepler's laws, Kepler's first/second/third law, central force, perihelion, aphelion, conic
section, eccentricity, semi-major axis, astronomical unit (AU). "torsion" already existed and is
reused. Every bolded term in the honors lessons has an entry (run-in labels such as "Theorem." are not terms).

**Cards** (22, `cards-r2-mv-m2.yaml`): 12 Frenet–Serret/torsion, 10 Kepler/central forces.

## For a reviewer to double-check
- Torsion sign convention: dB/ds = −τN (right-handed helix τ > 0), as in the core course; the lesson
  says some books use the opposite sign. VERIFY.md listed this convention as unverified.
- Constants used (standard values, not re-fetched): GM☉ ≈ 1.327×10²⁰ m³/s², GM⊕ ≈ 3.986×10¹⁴ m³/s²,
  a⊕ ≈ 1.496×10¹¹ m, Earth perihelion/aphelion ≈ 1.471/1.521×10¹¹ m, sidereal day ≈ 86,164 s,
  Earth radius 6,371 km mean / 6,378 km equatorial, AU = 149,597,870,700 m, Mars a ≈ 1.524 AU,
  Jupiter a ≈ 5.2 AU (period ≈ 11.86 yr).
- Earth's year from the rounded constants comes out 365.28 days; the lesson says "≈ 365.3 days".
- "Clothoid transitions have been used on railways since the nineteenth century" is deliberately
  vague; the railway example ignores cant and is labeled simplified.
- The orbit picture exaggerates eccentricity (e = 0.45) and says so; the shaded sectors have equal
  area (computed numerically).
- 10h1 is near the 2,200-word ceiling when math tokens are counted.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
- Frenet (thesis 1847) and Serret (1851): Wikipedia "Frenet–Serret formulas".
- Kepler, *Astronomia nova* (1609) and *Harmonices mundi* (1619); Newton, *Principia* (1687): standard history.
- Derivation of Kepler's laws follows the standard vector argument (as in common Calc III texts), rewritten.
- All lesson and question numbers were recomputed with sympy/scipy (κ, τ, the clothoid endpoint
  by numerical Fresnel integration, the equal-area sectors, orbital numbers).
