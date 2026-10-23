# NOTES2-a2-h1: Honors module a2-h1, "Toward precalculus and beyond"

`content/math/check-module.sh algebra2 a2-h1`: build and checker report **zero problems** (4 lessons, 56 questions, 12 drills, 41 cards).

## What was added

The module is a capstone that pulls several core modules together and points ahead to precalculus and calculus. Before choosing topics I checked the other honors lessons in this course so I wouldn't repeat them. The a2-m2 honors lesson `09h1-complex-plane` covers the modulus, the triangle inequality and $|zw| = |z||w|$, and leaves "the angle half" for later; lesson 92 supplies that half and says so.

**Lessons** (module `a2-h1`; honors modules don't need an `honors:` line):

| File | Id | Minutes | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 90-conic-sections.md | a2-h1-conics | 45 | ~2,050 | 5 (focus/directrix of $x^2 = 8y$; ellipse $9x^2 + 25y^2 = 225$; hyperbola $9x^2 - 16y^2 = 144$; completing the square for an ellipse; for a parabola) | a2-h1-cone-sections.svg; a2-h1-ellipse-parts.svg; 2 plots (parabola with equal distances, hyperbola with asymptotes); Mermaid "identify the conic" chart | a2-h1-r2-circle-center, -parabola-focus, -ellipse-foci |
| 91-parametric-equations.md | a2-h1-parametric | 45 | ~1,650 | 4 (table and orientation; ellipse from cos and sin; segment; projectile from 6 ft at 80 ft/s, 30°) | a2-h1-projectile.svg; 2 plots (parametric parabola with orientation arrows, cycloid with its wheel); Mermaid "eliminate the parameter" chart | a2-h1-r2-param-line, -param-eliminate, -projectile |
| 92-polar-complex.md | a2-h1-polar-complex | 50 | ~1,570 | 6 (three conversions to polar, including the $\tan^{-1}$ quadrant trap; polar to rectangular; product checked in rectangular form; De Moivre; cube roots of 8; $z^4 = -16$) | a2-h1-polar-form.svg; 2 plots (repeated multiplication by $i$; cube roots of 8 as a triangle) | a2-h1-r2-modulus-argument, -polar-multiply, -de-moivre |
| 93-rates-of-change.md | a2-h1-rates | 45 | ~1,450 | 5 (average velocity of a thrown ball; difference quotients of a quadratic, $1/x$ and $\sqrt x$; instantaneous velocity) | a2-h1-secant.svg; plot of secant lines approaching the tangent; Mermaid "difference quotient routine" chart | a2-h1-r2-avg-rate, -diff-quotient, -instant-rate |

*Prose words leave out code blocks, display math and image alt text. Lesson 90 is near the top of the range.

Every lesson has an intro that ties back to core lessons (07 nonlinear systems, 06 completing the square, 01 transformations, 05 complex numbers, 29 unit circle, 13 radicals, 15–16 rational expressions), `##` sections that explain why things are true, "Common mistakes" and "Key points". Simplifications are labeled: projectiles ignore air resistance; the reflection property is stated without proof; the angle-sum formulas are used and proved later; Euler's formula and limits are previews.

**Questions** (`questions/r2-a2-h1.yaml`, a2-h1-r2-h01 to h56): 14 per lesson, 56 in total.
- 32 four-choice multiple choice, with answer positions 2/2/2/2 in each lesson.
- 24 other types (43%): 8 text (fill in the blank), 4 match, 4 order, 4 select-all, 4 label (ellipse parts, projectile, complex number in polar form, secant/tangent picture).
- `module_quiz: true` on 20 questions (5 per lesson). Together they cover every topic of the module.

**Pictures**: all original SVGs, each under 4 KB, previewed as PNGs:
- a2-h1-cone-sections.svg
- a2-h1-ellipse-parts.svg, with a blank copy for its label question
- a2-h1-projectile.svg, with a blank copy
- a2-h1-polar-form.svg, with a blank copy
- a2-h1-secant.svg, with a blank copy

Label markers were checked on the blank copies with `--markers`. There are 3 Mermaid diagrams and 7 plots, all rendered and inspected.

**Drills** (`drills/r2-a2-h1.yaml`): 12, listed in the table above.

**Glossary** (`glossary-r2-a2-h1.yaml`): 28 terms:
- conics: conic section, degenerate conics, ellipse, parabola, hyperbola, focus/foci, directrix, co-vertices, major axis, minor axis, eccentricity, general form;
- parametric equations: parametric equations, orientation, eliminate the parameter, cycloid;
- complex numbers: argument, polar form, cis, angle-sum formulas, De Moivre's theorem, roots of unity;
- rates of change: average rate of change, secant line, difference quotient, instantaneous rate of change, tangent line, derivative.

None of these terms or aliases duplicates an entry in any `glossary*.yaml` in the course, including the other writers' r2 files present on 2026-10-23. Every bolded term in lessons 90–93 has an entry.

**Cards** (`cards-r2-a2-h1.yaml`): 41 in total (11 / 9 / 11 / 10 by lesson).

## Verification

- Every question key, every worked-example number, and every number in the figures was recomputed with sympy/Python (`/tmp/r2-a2-h1/gen/vq.py`, 55 checks, all OK). Each distractor was checked to be wrong. Select-all and order questions were checked for exactly one correct answer set or order (h38's order was confirmed by computing the arguments).
- Drills: 400 seeded instances of each (4,800 total) were generated with `generate()` on the built JSON (`dump.mts`). `vd.py` re-solved each instance from the prompt text alone: 0 mismatches. Realistic typed answers were accepted in every instance:
  - exact forms: `sqrt(11)`, `-8/3`, lowest-terms fractions, `sqrt(128)`;
  - rounded decimals at the precision the prompt asks for;
  - expanded expressions in $x$ and $h$;
  - for the projectile drill, answers from a student who rounds the components to 2 decimals first.

  A wrong answer was never accepted.
- Fill-in-the-blank stems keep each `___` outside `$…$`, because the app splits the stem at blanks before rendering math.

## For a reviewer to double-check

- **"modulus" is not bolded in lesson 92.** The a2-m2 honors lesson bolds and defines it, and I didn't want a duplicate glossary entry. Its glossary file (`glossary-r2-a2-m2.yaml`) did not exist yet when I finished. If that writer doesn't add "modulus", it should be added to one of the two files.
- Lesson 92 refers to "the honors lesson on the geometry of complex numbers in Module 2" (`09h1-complex-plane.md`). If that lesson is renamed or dropped, this sentence needs to change.
- **Conventions.** Arguments are given in $[0^\circ, 360^\circ)$; the lesson notes that many books use $(-180^\circ, 180^\circ]$. Conic standard forms use $a$ for the semi-major axis (ellipse) and the positive term (hyperbola), and $p$ for the focal distance of a parabola.
- **Hyperbola orientation.** The general-form table names the conic for the non-degenerate case. The lesson says that degenerate cases show up only after completing the square.
- **History** (kept short and hedged):
  - Apollonius of Perga, around 200 BC, named the ellipse, parabola and hyperbola.
  - Kepler, 1609: planets move on ellipses with the Sun at a focus.
  - Abraham de Moivre (1667–1754) "used closely related formulas, although he never wrote it in exactly this form". Wikipedia's article says he never stated the formula itself.
  - Euler published $e^{i\theta} = \cos\theta + i\sin\theta$ in 1748.
  - Newton and Leibniz developed calculus independently in the later 1600s, building on tangent methods of Fermat and others.
- **Orbital values.** Earth $e \approx 0.017$; Halley's comet $e \approx 0.97$.
- **Drill tolerances.**
  - a2-h1-r2-projectile: greatest height ±0.02 and landing time ±0.006 (prompt says 2 decimals, "round only at the end"); distance ±1 ft (prompt says nearest foot).
  - a2-h1-r2-modulus-argument: $r$ ±0.006, $\theta$ ±0.06°.
  - a2-h1-r2-de-moivre: modulus ±0.006, so `sqrt(2)^5`-style exact entries and 2-decimal entries both pass.
- **Drill display.** a2-h1-r2-de-moivre's solution shows the base modulus as a decimal (for example "$r \approx 1.4142$"), because a choice can't carry both a TeX label and two numbers. The exact value is given in the lesson.
- **Mermaid labels** contain no `<`, `>` or `&`.

## Errors found in existing content

None. I read lessons 01, 05, 06, 07, 13, 29 and 30 (and the a2-m2 honors lesson 09h1) for overlap and cross-references. I edited no shared or existing files.

## Sources

- OpenStax *Precalculus 2e*: ch. 8 (Periodic functions, polar form of complex numbers, De Moivre's theorem, parametric equations); ch. 10 (Analytic geometry: ellipse, hyperbola, parabola, conics in general form).
- OpenStax *Calculus Volume 1*, sec. 2.1 (secant and tangent lines, the difference quotient).
- Wikipedia: "De Moivre's formula" (history: named after de Moivre, who never stated it in his works); "Apollonius of Perga"; "Kepler's laws of planetary motion"; "Halley's Comet"; "Euler's formula".
- Projectile model and $g \approx 32$ ft/s²: standard (OpenStax *University Physics Volume 1*, sec. 4.3).
