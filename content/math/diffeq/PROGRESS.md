# Differential Equations (math-diffeq) — progress

Prefix `de-`. Modules de-m1 … de-m9. Status: [ ] todo, [x] done (lesson + questions + drills, built and checked).

## Outline

### de-m1 Bridge: differential equations at the AP level
- [x] 01 de-intro — What a differential equation is (topics: DE basics) drills: de-verify-1, de-ivp-constant
- [x] 02 de-slope-fields — Slope fields (Slope fields) drills: de-slope-eval, de-slope-isocline
- [x] 03 de-separable — Separable equations (Separable equations) drills: de-sep-exp, de-sep-power
- [x] 04 de-growth-logistic — Exponential and logistic growth (Exponential growth, Logistic growth) drills: de-exp-model, de-logistic-value
- [x] 05 de-euler — Euler's method (Euler's method) drills: de-euler-2step, de-euler-3step

### de-m2 Classification and first-order methods
- [x] 06 de-classification — Classifying differential equations (Classification)
- [x] 07 de-existence — Existence and uniqueness (Existence and uniqueness) drills: de-interval
- [x] 08 de-linear-first — Linear first-order equations (Linear first-order) drills: de-linear-if, de-linear-ivp
- [x] 09 de-exact — Exact equations (Exact equations) drills: de-exact-check, de-exact-solve
- [x] 10 de-substitutions — Bernoulli and homogeneous equations (Substitutions) drills: de-bernoulli-w, de-homog-ivp

### de-m3 Modeling with first-order equations
- [x] 11 de-model-growth — Growth, decay, interest and cooling (Growth and decay, Newton's law of cooling)
- [x] 12 de-mixing — Mixing problems (Mixing problems)
- [x] 13 de-falling-circuits — Falling objects and RL/RC circuits (Falling objects, RL and RC circuits)

### de-m4 Autonomous equations and numerical methods
- [x] 14 de-autonomous — Autonomous equations and phase lines (Autonomous equations)
- [x] 15 de-bifurcation — Population models and bifurcations (Bifurcations)
- [x] 16 de-improved-euler — Error and improved Euler (Numerical methods)
- [x] 17 de-runge-kutta — Runge–Kutta methods (Numerical methods)

### de-m5 Second-order linear equations
- [x] 18 de-second-order — Second-order linear equations and the Wronskian (Second-order theory)
- [x] 19 de-char-real — Constant coefficients: real roots (Characteristic equation)
- [x] 20 de-char-complex — Constant coefficients: complex roots (Characteristic equation)
- [x] 21 de-reduction — Reduction of order (Reduction of order)

### de-m6 Nonhomogeneous equations and applications
- [x] 22 de-undetermined — Undetermined coefficients
- [x] 23 de-variation — Variation of parameters
- [x] 24 de-free-vibrations — Free vibrations (Mechanical vibrations)
- [x] 25 de-forced-vibrations — Forced vibrations, resonance and RLC circuits
- [x] 26 de-higher-order — Higher-order linear equations

### de-m7 Laplace transforms
- [x] 27 de-laplace-def — The Laplace transform
- [x] 28 de-laplace-inverse — Inverse transforms and partial fractions
- [x] 29 de-laplace-ivp — Solving IVPs with Laplace transforms
- [x] 30 de-laplace-step — Step functions and shifting
- [x] 31 de-laplace-impulse — Impulses and convolution

### de-m8 Systems
- [x] 32 de-systems-intro — Systems of first-order equations
- [x] 33 de-eigen-real — Real distinct eigenvalues and phase portraits
- [x] 34 de-eigen-complex — Complex and repeated eigenvalues
- [x] 35 de-nonlinear — Nonlinear systems and linearization

### de-m9 Series solutions, Fourier series and PDEs
- [x] 36 de-series — Series solutions near ordinary points
- [x] 37 de-fourier — Fourier series
- [x] 38 de-heat-wave — The heat and wave equations

## Status: COMPLETE
- Final: 38 lessons, 423 questions, 78 drills, 180 cards, 177 glossary terms, 4 reference sheets.
- `python3 content/math/build.py diffeq` and `npx tsx tests/check-course.mts samples/math/math-diffeq.json`: zero problems.
- Answer positions balanced (~105 per index).

## For a reviewer
- Lesson word counts (excluding figures) are ~900–1,250; a few are near 880–900 by a plain word count because of heavy math.
- Question explanations/stems render as plain text + math (no figures), so slope-field questions describe the field in words.
- Drill expression answers in t avoid arbitrary constants by always giving initial conditions; de-vp-sec / de-vp-log / de-sep-power / de-homog-ivp rely on the checker skipping sample points where ln/sqrt are undefined.
- Lesson 29 uses a `shape` diagram for the Laplace workflow; lesson 32–35 phase portraits use vectorField + parametric curves.

## References
- de-ref-methods (method chooser), de-ref-laplace (Laplace table), de-ref-solutions (solution forms), de-ref-models (models and numerical methods)

## Notes
- scratchpad/diffeq-w/scan.mts flags formatting glitches (1y, 0t, + -) in generated drills; use :coef/:signedcoef before letters.
- calc values must be strings (a bare 0 in calc breaks generation). Answers needing >2 decimals need format: num4/dp5.
- Scratch scripts in scratchpad/diffeq-w/ (balance.py moves correct choice to balanced slot; write questions with correct answer first then run it once per file; partial.sh builds+checks modules done so far).
- In drills: use {X:sig6} for numbers that may be >= 1000 inside TeX (default format adds commas).
