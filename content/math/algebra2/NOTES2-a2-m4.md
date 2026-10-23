# Round 2 notes: module a2-m4 (Radicals and rational exponents)

`content/math/check-module.sh algebra2 a2-m4`: build and checker report zero problems
(4 lessons, 67 questions, 11 drills, 28 cards).

## Added

**Honors lessons** (2; the module has only two core lessons, so a third seemed like padding)
- `lessons/14h1-irrational-roots.md` (a2-m4-h-irrational-roots, "Irrational roots, proof and
  approximation", 45 min, ~1,770 words): rational vs irrational numbers; proof by contradiction
  that √2 is irrational (with a Mermaid proof outline); √3 and why the argument fails for √4; the
  general test from the rational root theorem (ⁿ√k is a whole number or irrational); √2 + √3 is
  irrational; Heron's (Babylonian) method with the rectangle picture, Heron's own √720 example,
  YBC 7289; why every guess after the first is too big and why the error is squared
  ($e^2/2x$); the cube-root iteration and a pointer to Newton's method. 5 worked examples.
- `lessons/14h2-power-laws.md` (a2-m4-h-power-laws, "Power functions and power laws", 45 min,
  ~1,740 words): power functions $kx^{m/n}$, their shapes and domains (plot + Mermaid domain
  chart); where exponent rules break for negative bases ($(-8)^{1/3}$ vs $(-8)^{2/6}$,
  $(x^2)^{1/2} = |x|$); the scaling property $c^p$; Kepler's third law (plot of five planets);
  the square–cube law (SVG); finding $p$ from scale factors; Kleiber's law, labeled as empirical
  and debated. 5 worked examples.

**Core lessons** (additions only, nothing rewritten)
- 13-radicals: a short paragraph on rationalizing a single cube root (needed by the new chart),
  a Mermaid "which factor rationalizes the denominator" chart, and an SVG naming the parts of
  $5\sqrt[3]{2x}$ and $8^{2/3}$ (coefficient, index, radicand, base, power, root), introduced
  by one sentence. The existing √x / ∛x plot stays.
- 14-radical-equations: a Mermaid flowchart of the method (with the loop for a second radical),
  introduced by one sentence, and an SVG adding the lower half $y = -\sqrt{x+7}$ to Example 2,
  showing the extraneous value as the line's crossing with that half (two-sentence intro).

**Pictures** (6 SVGs in `images/`, all original, 1–9 KB, rendered and checked):
a2-m4-radical-parts, a2-m4-radical-parts-blank, a2-m4-extraneous, a2-m4-extraneous-blank,
a2-m4-heron-rectangles, a2-m4-square-cube.

**Diagrams** (4 Mermaid, all with accTitle/accDescr, rendered): rationalizing chart (13),
radical-equation method (14), √2 proof outline (14h1), domain of $x^{m/n}$ (14h2).
Plus 2 new ```plot figures in 14h2 (power-function gallery, Kepler's law with planets).

**Questions** (40, `questions/r2-a2-m4.yaml`)
- Core a2-m4-r2-q01…q12, 6 per lesson. Lesson 13: text q01, label q02, match q03,
  select-all q04, order q05, MC q06. Lesson 14: order q07, text q08, label q09, select-all q10,
  match q11, MC q12. module_quiz: q01, q02, q07, q09.
- Honors a2-m4-r2-h01…h14 (irrational roots: 8 MC, 2 text, 1 order, 1 match, 2 select-all) and
  h15…h28 (power laws: 8 MC, 2 text, 1 order, 1 match, 2 select-all). No module_quiz.
- MC answer positions in each honors lesson: 2/2/2/2 across indexes 0–3.

**Drills** (5, `drills/r2-a2-m4.yaml`): a2-m4-r2-heron-step, a2-m4-r2-cube-newton (14h1);
a2-m4-r2-kepler, a2-m4-r2-scale-factor, a2-m4-r2-find-exponent (14h2). Each was generated 400
times with `generate()` and re-solved independently in Python from the prompt text: 0
mismatches; the shown answer typed back was accepted every time and a wrong one rejected.
4-decimal answers use tolerance 0.0001 and 2-decimal answers 0.01, so correctly rounded answers
pass (for Heron's second step, rounding $x_1$ first changes $x_2$ by far less than 0.0001).

**Glossary** (10, `glossary-r2-a2-m4.yaml`, checked against every glossary*.yaml): rational
number, irrational number, proof by contradiction, Heron's method (alias Babylonian method),
Newton's method, power function, power law, astronomical unit (alias AU), square–cube law,
Kleiber's law. Every bolded term in the two honors lessons has an entry.

**Cards** (19, `cards-r2-a2-m4.yaml`): 10 for 14h1, 9 for 14h2.

## For a reviewer to double-check
- History: Aristotle (4th century BCE) refers to the odd/even proof; the Hippasus story is
  called a legend. Heron of Alexandria (1st century CE) and the √720 example from his
  *Metrica* (27 → 26 5/6). YBC 7289, dated about 1800–1600 BCE, 1;24,51,10 = 1.41421296…
  (error ≈ 6 × 10⁻⁷). "How the scribes got it is not known for certain."
- Kepler's third law published 1619; Mars 1.524 AU → 1.881 yr (687 days); Halley's comet
  "about 75 years" → 17.8 AU (measured ≈ 17.8 AU); planet points in the plot use standard
  semi-major axes and periods. Galileo, *Two New Sciences* (1638), for the square–cube law.
- Kleiber's law: "in the 1930s", "roughly", exponent 3/4 vs 2/3 described as debated.
- The statement that some calculators/languages give an error or a complex number for
  $(-8)^{1/3}$ is deliberately general (e.g. Python's `(-8)**(1/3)` is complex).
- Label markers in a2-m4-radical-parts-blank sit just beside small glyphs (index, exponent
  digits) so the digits stay visible.
- Cosmetic: a2-m4-r2-find-exponent shows $b^{1}$ when $y$ is multiplied by the base itself
  (e.g. $2^{3p} = 2^{1}$); a2-m4-r2-scale-factor shows $\sqrt[2]{\,}$ when $q = 2$.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
OpenStax College Algebra 2e §1.3 (radicals and rational exponents) and Intermediate Algebra 2e
ch. 8; Lamar (Paul's Online Notes) on rational exponents; Heath, *A History of Greek
Mathematics* (Heron's square-root method, Aristotle on incommensurability); Fowler and Robson,
"Square root approximations in Old Babylonian mathematics: YBC 7289 in context" (Historia
Mathematica, 1998); NASA planetary fact sheets (semi-major axes and periods); Kleiber (1932) and
later reviews of the 3/4 vs 2/3 debate. All numbers recomputed in Python.
