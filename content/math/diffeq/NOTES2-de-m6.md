# Round 2 notes: de-m6 (Nonhomogeneous equations and applications)

`content/math/check-module.sh diffeq de-m6` reports no problems: 9 lessons, 144 questions, 22 drills.

## Honors lessons (3)
The module is large (6 core lessons), so it gets three honors lessons. Each is 1,550 to 1,850 words, 45 minutes, and has 4 worked examples, Common mistakes and Key points.
- `27h1-annihilators.md`, de-m6-h-annihilators, "The annihilator method: where the guesses come from". Covers operator algebra and why constant-coefficient operators commute, a table of annihilators, and the method itself. It derives the modification rule from added multiplicities, adds the exponential shift rule, and explains which functions have no annihilator. Includes a Mermaid flowchart.
- `27h2-quality-factor.md`, de-m6-h-quality-factor, "How sharp is resonance? Damping ratio and the Q factor". Defines ζ and Q and gives three meanings of Q: ringing (about Q cycles; the energy definition is marked as an approximation), amplification Q·F0/k at ω0, and the exact half-power bandwidth γ/m = ω0/Q. Also covers the logarithmic decrement, the phase lag at the half-power points, RLC Q, and a plot of power against frequency. A caveat says that bandwidth defined by power differs from bandwidth defined by displacement amplitude.
- `27h3-beams-buckling.md`, de-m6-h-beams, "Beams and buckling: boundary value problems". Covers the Euler–Bernoulli model (marked as a simplification), a table of end conditions, and full solutions for a simply supported beam (5wL⁴/384EI) and a cantilever (wL⁴/8EI), with the clamped–clamped result. Shows that a boundary value problem can have one, no or infinitely many solutions, and treats Euler buckling (π²EI/L², plus the clamped–free π²EI/4L²) with honest caveats. Includes the beams SVG and a plot of the mode shapes.

## Core lessons: additions only
- L22: plot of solutions approaching Y = 2t + 1 (Example 2); Mermaid procedure chart.
- L23: Mermaid procedure chart; Mermaid "which method" decision chart.
- L24: spring–mass–damper SVG; Mermaid damping-classification chart.
- L25: resonance plot (¾t sin 2t with envelope); transient → steady-state plot for u'' + 2u' + 5u = 10 cos t from rest (u = e^{-t}(-2cos 2t - 1.5 sin 2t) + 2cos t + sin t, checked with sympy); series RLC SVG.
- L26: complex-plane SVG of p(iω) (real part, imaginary part, modulus, phase lag); Mermaid complex-replacement chart.
- L27: Mermaid chart from roots to solutions; beams SVG in the beam-deflection section.

## Pictures (all original, each with a `-blank` copy for its label question)
`images/de-m6-spring-mass.svg`, `de-m6-rlc.svg`, `de-m6-complex-gain.svg`, `de-m6-beams.svg`. Each was previewed with and without markers.

## Questions: `questions/r2-de-m6.yaml` (72)
- Core lessons: 30 questions, ids de-m6-r2-q01…q30, 5 per lesson. Every lesson has at least one text question, one order or match question, and one select-all question. L24, L25 and L26 also have a label question. 12 are marked module_quiz, 2 per lesson.
- Honors lessons: 42 questions, ids h01…h42, 14 per lesson. Of these, 21 are new types (6 in h1, 7 in h2, 8 in h3).
- By type: 21 multiple choice, 21 text, 10 select-all, 9 match, 7 order, 4 label. Multiple-choice answer positions are balanced across 0–3.

## Drills: `drills/r2-de-m6.yaml` (7)
de-m6-r2-shift-double (expression), de-m6-r2-annihilator-pick (expression in r), de-m6-r2-q-bandwidth, de-m6-r2-log-decrement, de-m6-r2-rlc-q, de-m6-r2-beam-deflection, de-m6-r2-buckling. Rounding tolerances accept any correctly rounded answer (relTolerance 0.006 for 3 significant figures; ≥ half the last place for fixed decimals). Generated samples were read to check the formatting.

## Glossary and cards
- `glossary-r2-de-m6.yaml`: 17 terms. differential operator, annihilator, exponential shift rule, damping ratio, quality factor, static deflection, logarithmic decrement, half-power points, bandwidth, Euler–Bernoulli beam, flexural rigidity, clamped end, simply supported, free end, cantilever, critical buckling load, buckling. Checked against every glossary*.yaml in the course (including the other writers' r2 files): no duplicates.
- `cards-r2-de-m6.yaml`: 30 cards, 10 per honors topic.

## For a reviewer
- Sign conventions for beams: y is measured downward. The lesson says moment and shear equal EI y'' and EI y''' "up to a sign convention", and the boundary conditions only set them to zero.
- The buckling column derivation (EI y'' + Py = 0) is the standard pinned–pinned model. The clamped–free factor of 1/4 is stated, not derived.
- Euler's buckling work is dated only as "the 18th century", to avoid the 1744 vs 1757 ambiguity.
- In h1, "sin² t has an annihilator" (D(D²+4)) is intentionally tricky.
- h28: the exact ζ (0.03181) and the shortcut δ/2π (0.03183) agree at 3 s.f., so the key is the same either way.

## Errors found in existing content
None. No existing questions, drills, cards or glossary entries were edited.

## Verification and sources
Every worked example, beam formula, Q/bandwidth/half-power relation, annihilator coefficient (L/h1 Examples 2 and 4, h04, h11, h12) and question key was recomputed with sympy or Python. The facts are standard textbook material (undetermined coefficients and the annihilator method, the forced damped oscillator and Q, Euler–Bernoulli beams, Euler buckling); all wording and examples are original.
