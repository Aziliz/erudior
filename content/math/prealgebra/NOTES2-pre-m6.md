# Round 2 notes: pre-m6 (Exponents, roots and scientific notation)

Check: `content/math/check-module.sh prealgebra pre-m6` builds and checks with zero problems
(5 lessons, 83 questions, 14 drills, 48 cards).

## Honors lessons (2)
- `lessons/22h1-radicals.md`, **pre-m6-h-radicals**, "Simplifying square roots and fractional exponents"
  (about 1,800 words, 45 min): product and quotient rules for square roots (with why), simplest radical form
  (largest perfect square / prime pairs), a graph-paper picture of √8 = 2√2, like radicals, multiplying,
  rationalizing denominators (labeled as mostly a convention today), fractional exponents derived from the
  power-of-a-power rule. 6 worked examples. Positive bases only, stated as a simplification.
- `lessons/22h2-sig-figs.md`, **pre-m6-h-sig-figs**, "Significant figures and sizes in powers of ten"
  (about 2,100 words, 45 min): measured vs exact numbers, counting rules, scientific notation to remove
  ambiguity, rounding to n significant figures, the multiply/divide and add/subtract rules (labeled as a
  school rule of thumb, not full uncertainty analysis), metric prefixes giga to nano, comparing sizes in
  orders of magnitude. 7 worked examples.

## Core lesson additions (additions only)
- Lesson 20: SVG of nested number sets (real ⊃ rational ⊃ integers ⊃ whole; irrational beside), Mermaid
  "is a square root rational?" chart.
- Lesson 21: bar plot of 2ⁿ for n = −3…3 (halving pattern), Mermaid "which exponent rule" decision chart.
- Lesson 22: SVG naming the parts of 4.05 × 10⁻⁴, SVG of the decimal point hopping 4 places (Example 2),
  Mermaid multiply/divide-and-adjust procedure plus one sentence on why one adjustment is enough;
  `pre-m6-r2-sci-divide` added to its drills list.

## Questions (`questions/r2-pre-m6.yaml`, 45)
- Core (q01–q15, 5 per lesson): 4 text, 3 order, 3 match, 3 select-all, 2 label; 6 marked
  module_quiz (2 per lesson).
- Honors radicals (h01–h15): 9 multiple choice, 1 select-all, 2 text, 1 order, 1 match, 1 label.
- Honors significant figures (h16–h30): 9 multiple choice, 1 select-all, 2 text, 1 order, 1 match, 1 label.
- Single-answer correct positions across the file: 4 / 5 / 5 / 4.

## Pictures (`images/`, all original SVG)
pre-m6-real-numbers (+ -blank), pre-m6-sci-anatomy (+ -blank), pre-m6-point-hops, pre-m6-tilted-square,
pre-m6-radical-parts (+ -blank), pre-m6-sigfig-zeros (+ -blank), pre-m6-size-scale. Label markers checked
in previews.

## Diagrams
5 Mermaid (lessons 20, 21, 22, 22h1, 22h2), 1 bar plot (lesson 21).

## Drills (`drills/r2-pre-m6.yaml`, 7)
pre-m6-r2-sci-divide (core 22), pre-m6-r2-simplify-root, pre-m6-r2-like-radicals, pre-m6-r2-frac-exponent
(honors 1), pre-m6-r2-count-sigfigs, pre-m6-r2-sigfig-multiply (sigfigs: 2), pre-m6-r2-sigfig-add
(ties at the hundredths excluded so the rounding is never a half case).

## Glossary (`glossary-r2-pre-m6.yaml`, 7) and cards (`cards-r2-pre-m6.yaml`, 25)
Terms: simplest radical form, like radicals, rationalizing the denominator, index, fractional exponent,
significant figures, exact numbers. Cards: 3 for the core additions, 12 for honors 1, 10 for honors 2.

## For a reviewer
- Overlap check: pre-m1's honors lesson (05h3) already teaches Fermi problems and defines "order of
  magnitude", so 22h2 does not bold or redefine it and has no Fermi section; it uses the same
  "nearest power of ten" sense. pre-m8's honors work (picture pre-m8-h-ruler) appears to cover measurement
  precision; if it also teaches significant figures, the two should cross-reference.
- Significant-figure rules are a convention; 22h2 says so and treats trailing zeros in whole numbers as
  ambiguous (some books use a trailing decimal point).
- pre-m6-r2-sigfig-multiply uses `sigfigs: 2`, which also accepts an unrounded answer within half a unit
  (e.g. 23.944 for 24). The prompt asks for the rounded value.
- Size scale positions are rough (virus about 100 nm, red blood cell about 8 µm, sand grain 0.5 mm,
  Everest 8,849 m, Earth width 1.27 × 10⁷ m, Earth–Sun 1.5 × 10¹¹ m).

## Errors found in existing content
None. Spot-checked all pre-m6 questions and drills.

## Sources
Standard definitions (OpenStax Prealgebra 2e and Elementary Algebra 2e chapters on roots, exponents and
scientific notation, for scope); NIST SP 330 / BIPM SI brochure for the metric prefixes; the 1959
international yard and pound agreement (1 in = 2.54 cm exactly); mass of Earth 5.97 × 10²⁴ kg and of the
Moon 7.35 × 10²² kg (NASA fact sheets). All arithmetic rechecked in Python/sympy.
