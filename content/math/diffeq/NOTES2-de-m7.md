# Round 2 notes: de-m7 (Laplace transforms)

`content/math/check-module.sh diffeq de-m7`: build and checker OK, zero problems
(8 lessons, 121 questions, 16 drills, 54 cards).

## Honors lessons (3)
- `32h1-periodic-inputs.md`, `de-m7-h-periodic`: Periodic inputs: square waves, sawtooths and
  rectified sines. Periodic-function formula (two derivations), square wave (0/1 and ±1, tanh
  form), sawtooth, half- and full-wave rectified sine, RC circuit driven by a square wave
  (geometric-series inversion, plot), periodic steady state and ripple formula, Laplace vs Fourier.
- `32h2-s-domain-rules.md`, `de-m7-h-s-rules`: Calculus in s. L{tf} = −F′, L{f/t} = ∫ₛ^∞ F,
  L{∫f} = F/s, inverting ln/arctan, sin t/t and the Dirichlet integral (the s → 0 step is
  labeled as needing an extra argument), Frullani-type ∫(e^−t − e^−3t)/t = ln 3, Gamma function and
  L{t^a}, Bessel's equation of order 0 giving L{J₀} = 1/√(s²+1), with cautions. Short hedged
  history (Euler/Laplace, Heaviside, Bromwich/Carson).
- `32h3-poles-stability.md`, `de-m7-h-poles`: Transfer functions, poles and stability. Pole
  location table and s-plane picture, BIBO stability (with resonance counterexample and a
  pole-zero-cancellation caveat), quadratic and cubic Routh–Hurwitz tests, final value theorem
  with counterexamples, step response and DC gain (link to Lesson 26's complex gain),
  proportional feedback on G = 1/((s+1)(s+2)(s+3)): stable for −6 < K < 60, oscillation at
  √11 when K = 60, steady error 6/(6+K). Labeled as a simplified example.

## Core lesson additions (additions only)
- 28: plot of the weight e^(−st) for s = 0.5, 1, 2 (with two sentences); log-scale plot showing
  why e^(t²) is not of exponential order (with two sentences).
- 29: Mermaid decision chart for choosing partial-fraction terms.
- 30: new short section "Where each part of Y(s) comes from" (zero-input / zero-state split,
  new bold terms) with a Mermaid diagram.
- 31: SVG `de-m7-step-panels.svg` (u₂, pulse u₁ − u₃, delayed ramp, u₂·t) with an intro
  paragraph; Mermaid flow for inverting e^(−cs)H(s).
- 32: plot of unit-area pulses d_ε narrowing; Mermaid input → H(s) → output block.

## Questions (`questions/r2-de-m7.yaml`, 66)
- Core, `de-m7-r2-q01`–`q25` (5 per lesson; 9 marked `module_quiz`): text 9, select-all 5,
  order 5, match 4, label 1 (step panels), multiple choice 1.
- Honors, `de-m7-r2-h01`–`h41` (14 / 14 / 13): multiple choice 21, text 9, match 3, order 3,
  select-all 3, label 2 (periodic waves, s-plane).

## Pictures and diagrams
- SVGs (each with `-blank` copy for its label question): `de-m7-step-panels`,
  `de-m7-periodic-waves`, `de-m7-s-plane`. All previewed, markers checked on the blank copies.
- Mermaid: 29, 30, 31, 32 (one each), 32h3 (feedback loop, TD). Plots: 28 (2), 32 (1), 32h1 (1).

## Drills (`drills/r2-de-m7.yaml`, 6)
de-m7-r2-periodic-pulse, de-m7-r2-periodic-steady, de-m7-r2-t-times, de-m7-r2-sinc-integral,
de-m7-r2-final-value, de-m7-r2-routh-gain. Each generated 300 times against independent
formulas (correct answers accepted, perturbed answers rejected); 4-decimal answers use tolerance
0.00006, 3-decimal 0.0006.

## Glossary and cards
- `glossary-r2-de-m7.yaml`, 19 terms: square wave, sawtooth wave, half-wave / full-wave rectified
  sine, one-period window, periodic steady state, Dirichlet integral, Gamma function, zero-input
  response, zero-state response, pole, s-plane, BIBO stability, final value theorem, initial value
  theorem, step response, DC gain, proportional control, closed-loop transfer function.
- Not defined here because other round 2 writers already define them: Routh–Hurwitz criterion
  (de-m8, 37h2) and Bessel function (de-m9, 41h1); 32h2 and 32h3 mention them unbolded and point
  to those lessons.
- `cards-r2-de-m7.yaml`, 28 cards (9 per honors lesson, 1 for lesson 30).

## For a reviewer
- 32h2 Example 5 (Bessel): the claim that the derivative rules silently select the bounded
  solution, and that term-by-term inversion of the 1/s series is valid here, are stated as
  cautions; worth a look.
- 32h3: the BIBO criterion is stated for rational H with deg Q ≤ deg P; internal stability vs
  pole-zero cancellation is a brief caveat, not a full treatment.
- 32h3 overlaps a little with 37h2 (both use the cubic Routh–Hurwitz test; history dates
  Maxwell 1868, Routh 1877, Hurwitz 1895 agree). The feedback example was chosen to differ
  from 37h2's polynomial.
- All transforms, roots, steady-state values and drill answers recomputed with sympy/numpy.

## Errors found in existing content
None. No existing questions, drills, cards or glossary entries were edited.

## Sources
- Standard results (periodic-function formula, s-derivative and s-integral rules, Gamma
  function, final value theorem, Routh–Hurwitz for cubics) checked against the course's
  reference sheet and recomputed symbolically.
- History: Wikipedia, "Operational calculus" (Heaviside, 1890s; Bromwich and Carson's
  justifications); Gamma function attributed to Euler's 1729–1730 letters (hedged as "around
  1730").
