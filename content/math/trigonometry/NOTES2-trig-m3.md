# Round 2 notes: module trig-m3 (Trig functions of any angle)

`content/math/check-module.sh trigonometry trig-m3` reports zero problems: 6 lessons, 95 questions,
13 drills, 46 cards, 232 terms.

## Added

**Honors lessons** (both have `honors: true`, `module: trig-m3`, 45 min, and link `trig-ref-unit-circle`)
- `lessons/12h1-six-segments.md` (trig-m3-h-segments), "The six functions as lengths: one picture
  and its history", about 2,000 words. It covers all six functions as segments on the unit circle
  with the tangent lines x = 1 and y = 1, each length proved with similar triangles, and where the
  names come from (tangent line and secant line, Fincke 1583, "co-" means complement). It shows the
  three Pythagorean identities as the Pythagorean theorem on three triangles, the inequalities
  sin < tan and cos < 1 < sec, and why tan 90° is undefined. Directed lengths
  (T = sec θ·P = (1, tan θ), C = csc θ·P) carry the picture into every quadrant. Chords
  (crd θ = 2 sin(θ/2)), Hipparchus and Ptolemy, the jyā → jība → sinus etymology (marked as the usual
  account, with the translator disputed), and versine, exsecant and haversine.
  4 examples: θ = 60°; working from AT = 5/12; θ = 150° with signs; Ptolemy's chord of 90°
  (84;51,10) and an arch's chord, arc and rise.
  Figures: six-segments SVG and a history flowchart (Mermaid).
- `lessons/12h2-small-angles.md` (trig-m3-h-small-angles), "Small angles: comparing sin t, t and
  tan t", about 1,600 words. It proves sin t < t < tan t by nested areas, then the squeeze
  cos t < sin t/t < 1, so sin t/t → 1, with a table. sin t/t is even. It explains why the limit is 1
  only in radians (π/180 in degrees) and why that is the reason calculus uses radians. It derives
  cos t ≈ 1 − t²/2 from the chord (1 − cos t = 2 sin²(t/2)) and shows the estimate is always low.
  Relative-error table; error sizes t³/6, t³/3, t⁴/24, stated as calculus results without proof;
  1% thresholds (0.244 rad ≈ 14° for sine, 0.173 rad ≈ 9.9° for tangent); |sin t| ≤ |t| and
  cos t ≥ 1 − t²/2 for all real t. 5 examples.
  Figures: an area-nesting plot, a plot of sin t, t and tan t, and a "use the approximation?"
  flowchart (Mermaid).
  This deliberately avoids angular size, the milliradian and the Moon, which the trig-m1 honors lesson
  04h1 already covers. It points to that lesson in one sentence.

**Core lessons.** Additions only, each with one introducing sentence:
- 09: flowchart (Mermaid) for finding all six from one value plus a sign condition.
- 10: four-quadrant reference-angle picture (SVG); flowchart of the reference-angle method,
  including the reduction step (Mermaid).
- 11: fully labeled unit circle, radians outside and degrees inside (SVG); flowchart for
  reading a special value by denominator (Mermaid).
- 12: plot showing t and t + π as opposite points on one line (why tan has period π); new short
  section "Putting the properties to work" with a flowchart for evaluating at large or negative
  inputs (strip periods, then even/odd, then evaluate) (Mermaid).

**Pictures** (7 SVGs in `images/`, all original, 1–5 KB, rendered and checked; the markers were
checked with `--markers`): trig-m3-terminal-point-blank (question-only; lesson 09 already has
the equivalent plot), trig-m3-reference-quadrants(-blank), trig-m3-unit-circle(-blank),
trig-m3-six-segments(-blank). Generator: /tmp/r2-trig-m3/gen.py (scratch, deleted).

**Diagrams:** 6 Mermaid diagrams (4 core, 2 honors), each with accTitle and accDescr, all rendered.

**Questions** (`questions/r2-trig-m3.yaml`, 48 new)
- Core, trig-m3-r2-q01…q20 (5 per lesson): label 3 (q01, q06, q11), text 4 (q02, q07, q12, q18),
  order 3 (q03, q08, q15), match 5 (q05, q10, q13, q16, q19), select-all 4 (q04, q09, q14, q17),
  MC 1 (q20). module_quiz: q01, q05 (09); q06 (10); q11, q13 (11); q17, q20 (12).
- Honors 12h1, h01…h14: 8 MC, 2 text, 1 label, 1 select-all, 1 match, 1 order.
- Honors 12h2, h15…h28: 8 MC, 3 text, 1 order, 1 select-all, 1 match.
- Answer positions of the 17 MC questions: 0: 4, 1: 4, 2: 4, 3: 5.

**Drills** (`drills/r2-trig-m3.yaml`, 4): trig-m3-r2-segments and trig-m3-r2-chord (12h1),
trig-m3-r2-small-approx and trig-m3-r2-rel-error (12h2). I generated 400 instances of each and
checked them against an independent computation from the prompt's inputs. In all 1,600 instances
the correctly rounded answers were accepted and answers 2 units off in the last place were
rejected.

**Glossary** (`glossary-r2-trig-m3.yaml`, 7): tangent line, secant line, directed length, versine,
exsecant, squeeze theorem, linear approximation. "relative error" is bolded in 12h2 but already
defined in glossary-r2-trig-m2.yaml, so I did not redefine it. I grepped every glossary file in the
course for duplicates.

**Cards** (`cards-r2-trig-m3.yaml`, 19): 10 for 12h1, 9 for 12h2.

## For a reviewer to double-check
- History in 12h1: Fincke, *Geometria rotundi* (1583), for "tangent" and "secant". Hipparchus is
  "usually credited" with the first chord table. Ptolemy's table is in half-degree steps, radius
  60. Indian half-chord tables date to "by about 500 AD" (Aryabhata 499). The sinus etymology is
  given as the usual account, with the 12th-century translator disputed (Robert of Chester, Gerard of
  Cremona and Plato of Tivoli are all named in the literature). *Śara* ("arrow") is one Sanskrit
  name for the versine.
- 84;51,10 for crd 90° and 37;4,55 for crd 36° both match 120 sin(x) computed in Python. The lesson
  shows 84;51,10 as a conversion and does not quote it as a table entry.
- 12h2 states the error sizes (t³/6, t³/3, t⁴/24) as calculus results without proof. The 1%
  thresholds were solved numerically (brentq).
- The six-segments figure has the sec and csc brackets on either side of the ray. Each bracket
  crosses one thin colored segment (BC and PM) near its end. That was unavoidable with both on the
  same ray, and the render is still clear.

## Errors found in existing content
None. I edited no round-1 questions, drills, cards or glossary entries.

## Sources
- Wikipedia, "Thomas Fincke" (tangent and secant, Geometria rotundi, 1583); MacTutor biography of Fincke.
- Wikipedia, "Jyā, koti-jyā and utkrama-jyā" (jyā/jīvā → jība → sinus; translator attribution
  disputed; utkrama-jyā = versine, also called śara, "arrow").
- Standard results (Ptolemy's chord table in radius 60, the area proof of sin t < t < tan t, Taylor
  error terms) were checked numerically in Python.
