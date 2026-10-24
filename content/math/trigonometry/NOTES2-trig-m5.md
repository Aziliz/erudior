# Round 2 notes: module trig-m5 (Inverse functions and basic equations)

`content/math/check-module.sh trigonometry trig-m5`: build and checker report zero problems
(5 lessons, 85 questions, 11 drills, 41 cards).

## Added

**Honors lessons** (both `honors: true`, `module: trig-m5`)
- `lessons/20h1-arctangent-identities.md`, `trig-m5-h-arctan-identities`, "Adding arctangents and
  computing π" (45 min, about 1,700 words with math, 1,160 without). It gives a coordinate proof that
  $\tan^{-1}a + \tan^{-1}b$ is the direction angle of $(1 - ab, a + b)$, using only right triangles. That
  leads to the arctangent addition formula with its $\pm\pi$ cases, the difference and doubling rules,
  and $\tan^{-1}x + \tan^{-1}(1/x) = \pm\tfrac{\pi}{2}$. The lesson also covers Machin's formula
  (checked exactly; $28561 = 13^4$), the arctangent series and why small inputs converge fast, and a
  short history of computing π. Examples: $\tan^{-1}\tfrac12 + \tan^{-1}\tfrac13 = \tfrac{\pi}{4}$ (with a grid
  proof), $\tan^{-1}2 + \tan^{-1}3 = \tfrac{3\pi}{4}$ (where the plain formula is wrong), reciprocals,
  Machin, and π from four series terms.
- `lessons/20h2-general-solutions.md`, `trig-m5-h-general-solutions`, "Families of solutions and
  equations without exact answers" (45 min, about 1,700 words with math, 1,170 without). It covers the
  rules for $\sin A = \sin B$, $\cos A = \cos B$ and $\tan A = \tan B$, using the cofunction identity to
  compare a sine with a cosine, the one-line form $(-1)^n\alpha + n\pi$, shifted arguments and counting
  solutions, a "choosing a method" chart, transcendental equations, bisection, fixed-point iteration,
  and Kepler's equation. Examples: $\sin 3x = \sin x$, $\sin 2x = \cos x$, $\sin(2x - \tfrac{\pi}{3}) = \tfrac12$,
  bisection on $\cos x = x$, and Kepler with $e = 0.2$, $M = 1$. No Module 6 identities are needed;
  where Module 6 gives the same result, the lesson says so.

**Core lessons 18–20** (additions only; each figure gets a sentence or two of lead-in)
- 18: a plot of the kept piece of $\sin x$ against $y = \tfrac12$; an SVG of the three ranges on unit
  circles (open dots for $\tan^{-1}$); a Mermaid flowchart for evaluating an inverse exactly.
- 19: a Mermaid chart "does it cancel?" (safe and risky order); an SVG of
  $\theta = \cos^{-1}(-\tfrac{5}{13})$ with its quadrant II reference triangle (Example 2).
- 20: an SVG of $\cos x = c$ on the unit circle; a Mermaid flowchart of the solving procedure; a plot of
  $\tan x = \tfrac43$ showing one solution per period (Example 3).

**Pictures** (11 original SVGs, each under 6 KB, all rendered and checked, markers checked on the blank
copies): trig-m5-ranges (+blank), trig-m5-quadrant2 (+blank), trig-m5-cos-equation (+blank),
trig-m5-arctan-construction (+blank), trig-m5-grid-pi4, trig-m5-equal-sines (+blank).

**Diagrams** (4 Mermaid, all with accTitle/accDescr, all rendered): exact evaluation of an inverse (L18),
cancellation chart (L19), solving procedure (L20), choosing a method (20h2). There are also 4 new plots
(two in core lessons, one in each honors lesson).

**Questions** (44, in `questions/r2-trig-m5.yaml`)
- Core, trig-m5-r2-q01…q15 (5 per lesson): text 3 (q01, q06, q11), match 3 (q02, q07, q12),
  order 2 (q05, q13), select-all 3 (q03, q08, q14), label 3 (q04, q09, q15), MC 1 (q10).
  module_quiz: q02, q05 (L18), q07, q10 (L19), q11, q12 (L20).
- Honors 20h1, trig-m5-r2-h01…h15: MC 9, text 2 (h04, h14), select-all 1 (h07), match 1 (h08),
  order 1 (h09), label 1 (h10).
- Honors 20h2, trig-m5-r2-h16…h29: MC 8, text 2 (h18, h27), select-all 1 (h21), match 1 (h23),
  order 1 (h24), label 1 (h25).
- Correct positions in the 18 four-choice MC questions: 0: 4, 1: 5, 2: 5, 3: 4.

**Drills** (3, in `drills/r2-trig-m5.yaml`; linked from the honors lessons)
- trig-m5-r2-arctan-sum: $\tan(\alpha + \beta)$ as a fraction in lowest terms, and $\alpha + \beta$ to 4 decimals.
  The solution names the quadrant of $(1 - ab, a + b)$ and the $\pm\pi$ correction.
- trig-m5-r2-shifted-eq: $\sin$ or $\cos(nx \pm \text{phase}) = $ a special value on $[0, 2\pi)$. Asks for the number of
  solutions and the smallest one (exact or 4 decimals, tolerance 0.001, same as trig-d-eq-multiple-angle).
- trig-m5-r2-kepler: first iterate $E_1$ and the solution $E$ of Kepler's equation (4 decimals,
  tolerance 0.0002).
- Each was generated 600 times and checked independently in a tsx script. Sums were checked with
  atan2. Shifted equations were checked by listing every root from both families and scanning for
  missed sign changes. Kepler was checked by substituting back. Answers rounded to 4 decimals and the
  shown fractions were accepted every time.

**Glossary** (8 new terms in `glossary-r2-trig-m5.yaml`; I checked every glossary*.yaml and found no
duplicates): arctangent addition formula, Machin's formula, Machin-like formula, arctangent series,
transcendental equation, bisection method, fixed-point iteration, Kepler's equation. These are all
the new bolded terms in the two honors lessons.

**Cards**: 20 in `cards-r2-trig-m5.yaml` (10 per honors lesson).

## For a reviewer to double-check
- The coordinate proof in 20h1 is written out for positive $a, b$. It says the same construction works
  for negative values (the turns are then clockwise), which is true: in the frame spanned by $(1, a)$
  and $(-a, 1)$, the point $C$ has coordinates $(1, b)$. That step is stated, not proved in full.
- History in 20h1 is labeled simplified. Machin 1706 (100 places). Gregory 1671, Leibniz 1670s,
  Madhava about 1400 as credited by later Kerala texts. Shanks 1873 (707 places, 527 correct, error
  found by Ferguson in 1946). ENIAC 1949 (2,037 digits) with Machin's formula.
- Kepler's equation in 20h2: "met it in his work on the orbit of Mars, published in 1609"
  (Astronomia nova). The terms mean and eccentric anomaly are explained in brief, and the iteration's
  convergence is explained loosely ($|e\cos E| \le 0.2$), with $|g'| < 1$ named as calculus language.
- Fixed-point iteration is presented as a tool that can fail (not a guarantee).
- The label question q04 tells inverse sine from inverse tangent only by open or closed endpoint dots.
  The stem says what open dots mean, and the distractor (inverse cotangent) tests the same idea.
- Word counts: each honors lesson is about 1,700 words counting inline math, about 1,170 of plain
  prose. That follows how the course counted its core lessons.

## Errors found in existing content
None. No existing questions, drills, cards or glossary entries were edited.

## Sources
- The course's own lessons 18–20 and VERIFY.md, for conventions (the ranges of the inverses, and the $[0, 2\pi)$ intervals).
- Wikipedia, "Chronology of computation of π" (Machin, Shanks, Ferguson, ENIAC), checked 2026-10-23.
- Standard results: the arctangent series; Machin's formula; Kepler's equation from Kepler's
  Astronomia nova (1609).

All numbers were recomputed in Python: identities, Machin's fractions, the bisection table, the
Kepler iterates, every question key and distractor, and the figure coordinates.
