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


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every lesson solution checked against its ODE with sympy, every drill generated hundreds of times against an independent solver. All answer keys were correct. App fix from this review: typed answers like 5te^(2t) and tsin(t) now parse as products.

# Diff-eq review, modules de-m1 to de-m4 (lessons 01-17, questions/drills m1-m4, cards.yaml)

## How it was checked
- Lessons: every worked example re-derived; solutions checked against ODE + initial condition with sympy
  (lessons.py); Euler/Heun/RK4 tables, error tables and log-log intercepts recomputed; all figures rendered
  with renderFigure + app CSS and screenshotted (figs.png).
- Questions (m1-m4, 125): each solved independently, keys/distractors/explanations checked.
- Drills (36): 300 instances each generated from the built JSON; numeric answers compared with independent
  sympy/scipy computations (verify.py); expression answers checked to satisfy ODE + IC for 6,693 distinct
  instances (verify_expr.py); equivalent forms accepted and wrong forms rejected via checkAll (expr.mts).

## Fixes
Questions
- de-q-0301: stem used Markdown bold (**not**); removed (checker error).
- de-q-0312: distractor tan(arctan x) + 1 was identical to the x + 1 distractor; replaced with tan(arctan x + 1)
  (the C = 1 slip) and explained it.
- de-q-0502: explanation misnamed the mistake behind 4 (and left 4.5 unexplained); corrected.
- de-q-0210: needed the uniqueness theorem (Lesson 7) but sat in the Lesson 2 quiz; moved to m2.yaml,
  lesson de-existence, topic Existence and uniqueness.
- de-q-0901: explanation referred to choices by position ("the first", "the others" in order); now names them.
- de-q-1406: stem said solutions starting anywhere in (0, 4) have an inflection point; only those starting
  below 2 do. Stem now says 0 to 2, explanation notes why.
Lessons
- 07 Example 2: at (0, 0) f = sqrt(y) isn't defined for y < 0, so the claim that only the uniqueness
  hypothesis fails was imprecise; reworded.
Drills
- de-verify-1, de-equilibria: "(k - (-2))", "(y - (3))", "2y - (3) - (4)" output; now signed terms.
- de-ivp-constant: answer "t^3 - 2t^2 + 0" when C = 0 (excluded) and raw "\left(-2\right) {t}^{2}" answer
  display; added show.
- de-sep-y2: "1\,dx" and "C = -1/1"; cleaned.
- de-logistic-max: thousands commas inside math (0.002·1,000·1,000); fixed.
- de-linear-power: "t^{1}", "e^{1 ln t}"; k, m now 2-4.
- de-bernoulli-w: "y(0) = 1/1"; n now 2-5.
- de-drag-velocity: "thrown straight down at 0 m/s"; v0 now 1-10.
- de-phase-limit: "(y + 0)" factor; q now 1-2.
- de-euler-error: "y_{n}" placeholder rendered y_10 (subscript 1 only); now y_{10}.
Cards
- "Solution of y' + ay = b" back used y_0 not defined on the front; front now gives y(0) = y_0.

## No errors found
All other answer keys, distractors, lesson computations, figures (they match the text) and cards checked out.

## Notes / unresolved (cosmetic, not fixed)
- Several lesson figures have overlapping curve-end labels (lesson 01 "C = ..." labels, 02 "through (0, 1)" /
  "through (0, -2)", 04 "P(0) = 100" / "P(0) = 2000" / "K = 1000", 11, 13 "v_T = 24.5" / "v(t)", 14 "y(0)"
  labels). The math is right; it's a label-placement issue in the renderer.
- de-linear-power solution shows "t^{3-1}" (correct, slightly clumsy).
- de-annuity accepts within 0.05% though the prompt says nearest dollar (lenient, not wrong).
- Lesson 06 (classification) links drill de-verify-1, which practises exponential solutions rather than
  classification.
- Other modules: none reviewed beyond cards.yaml, which checked out.

# Review: diffeq modules de-m5 to de-m7 (lessons 18-31, questions/drills m5-m7)

## Questions (99 checked, each solved independently, spot-checked with sympy)
- All answer keys correct, exactly one correct choice each, no Markdown, no positional references.
- de-q-1904: explanation misnamed the distractor's mistake ("ignoring the leading 2" doesn't give -1, -4). Now: the ac-method product r^2+5r+4 without dividing the roots by 2.

## Lessons (all worked examples re-derived; ODE/IC checks)
- No math errors found in examples, tables or theorems.
- L23 Example 2: "W = e^{2t} (Lesson 18)" changed to Lesson 19, where W(e^{rt}, te^{rt}) is computed.
- Figures rendered and screenshotted:
  - L24: three curve labels sat on top of each other at t = 6, so they couldn't be read. Replaced them with text labels placed next to each curve.
  - L20: the envelope label overlapped y(t). It is now a separate text label.
  - L29: diagram arrows ran into the node text. Arrows shortened.

## Drills (29 drills, about 5,000 unique instances checked independently from the prompt text with sympy dsolve / laplace / inverse_laplace)
- Real error: de-rlc-type showed C = 0 F because plain {cap} rounds to 2 decimals (the earlier sig3 version showed 0.00100). de-spring-k showed the stretch as 0.2 m when it was really 0.196 m, so answers didn't match the prompt. Both now use labeled choices.
- de-wronskian: answers like -1/729 were shown as -0.0014. It now asks for an exact fraction (kind: fraction). Also removed t^{1} and t^{0}, and fixed "\cdot -3t".
- Cleanups:
  - "(r - (-1))" and "(s - (-2))" factors in char-distinct, char-repeated, higher-roots, inverse-pf, inverse-shift, impulse-response and convolution.
  - "(3)c_2" and "1c_1" in ivp-combo, char-distinct and euler-eq.
  - "t^{1}" in laplace-poly (now uses a labeled choice tn).
  - "+ 0" in uc-poly (where B != 0, q != 0).
  - "y = 0 + ..." in higher-ivp (c1 != 0).
  - "sY - (0)" in laplace-ivp1 (y0 != 0).
  - "1Y" in laplace-Ys.
  - "e^{2(-1)t}" in vp-log.
  - "1\cos" in steady-amplitude.
  - "\dfrac{4}{4}" in vp-sec.
  - Undefined "A" in spring-amplitude's solution.
  - euler-eq excludes m = 1 (avoids t^{1}).
- Shown answers are accepted when typed, equivalent forms are accepted and wrong ones rejected (checkAll), with one exception below.

## Unresolved (src/, not editable)
- The typed-answer parser reads "te^t" as (t*e)^t and "tsin(t)" as an unknown function. So "5te^(2t)" or "2te^t ln(t)" is marked wrong. Workaround: added "Type products with a star" hints to de-char-repeated, de-vp-log and de-vp-sec. splitName in src/lib/expr.ts should keep e^... from swallowing the preceding letter.

## Outside my area
- de-q-0301 (m1) stem uses Markdown; check-course flagged it earlier, and the latest full run reports OK.

# Review: diffeq de-m8 / de-m9 (lessons 32–38), glossary, references

Verified: every m8/m9 question solved independently (sympy) — all 44+33 keys correct, one correct choice each.
Lesson worked examples checked with sympy (eigenpairs, IVPs, generalized eigenvector, Jacobians,
Airy/series coefficients, Fourier coefficients, heat-equation values). Figures rendered with renderFigure
+ Playwright; Airy partial sum checked against numerical ODE solution. Drills: 300 instances each of 13
drills, answers recomputed from the prompt text in Python, typed into checkAll (right accepted, wrong
rejected), shown answers accepted. Build + check-course: OK.

## Fixes
- questions/m8.yaml de-q-3409: explanation referred to "The first" choice (positions are shuffled) — now names the matrix.
- questions/m9.yaml de-q-3703: stem said "the square wave above" (depends on another question) — now defines it.
- questions/m9.yaml de-q-3811: explanation clarifies why the "T grows" distractor isn't the reason.
- lessons/35: linearization theorem said nodes always stay nodes — added repeated-eigenvalue caveat; "unlike linear systems, there can be several equilibria" qualified to det A ≠ 0 (lesson 33 has lines of equilibria).
- lessons/34: trace–determinant figure caption "the left half is stable" (includes saddles) → region T < 0, D > 0.
- lessons/38: heat-profile figure labels overlap at x = 1; caption now says which curve is which.
- drills/m9.yaml de-recurrence, de-series-coef: solution showed "1a_0", "-1a_{n-1}" — now uses coef format.
- glossary.yaml: "asymptotically stable" had alias "stable", conflicting with lesson 34 (center is stable but not asymptotically stable) — alias removed.

## Not changed / notes
- de-eigenvalues-2x2 solution shows substitution like "λ² − (0)λ + (−9)"; parenthesized, left as is.
- References (4 sheets) and remaining glossary entries checked: no errors found.

## Gap lessons (2026-10-17)

Filled the coverage gaps from VERIFY.md. Lesson files from old 26 onward were renumbered to keep teaching order (ids unchanged): old 26–34 are now 27–35, old 35–38 are now 37–40. In-text "Lesson N" references (L28 → Lesson 31, L34 → Lesson 33, L40 → Lesson 39) and the `# Lesson N` comments in questions/m6–m9 were updated.

New lessons
- 26 `de-complex-gain` — Sinusoidal response with complex exponentials (de-m6), lessons/26-complex-gain.md. Topic: Complex gain. Drills: de-gain-phase, de-complex-replace.
- 36 `de-nonhomog-systems` — Nonhomogeneous systems and the matrix exponential (de-m8), lessons/36-nonhomogeneous-systems.md. Topics: Nonhomogeneous systems, Matrix exponential. Drills: de-sys-const-forcing, de-sys-exp-forcing, de-matrix-exp.
- 41 `de-heat-boundary` — Heat flow with insulated ends and nonzero end temperatures (de-m9), lessons/41-heat-boundary.md. Topic: Heat boundary conditions. Drills: de-heat-insulated, de-heat-steady.

New questions (40; correct answers 10 at each position)
- de-q-cg01 … de-q-cg12 (Lesson 26; module quiz: cg01, cg02, cg04, cg09)
- de-q-ns01 … de-q-ns12 (Lesson 36; module quiz: ns01, ns02, ns06, ns09)
- de-q-hb01 … de-q-hb12 (Lesson 41; module quiz: hb01, hb02, hb03, hb06)
- de-q-2512 … de-q-2515 (Lesson 25, practical-resonance peak; module quiz: 2512, 2515)

New drills (8): de-peak-frequency (linked from Lesson 25), de-gain-phase, de-complex-replace, de-sys-const-forcing, de-sys-exp-forcing, de-matrix-exp, de-heat-insulated, de-heat-steady.

Also: 14 glossary terms (complexified equation, exponential response formula, complex replacement, gain, phase lag, complex gain, forcing vector, fundamental matrix, matrix exponential, variation of constants formula, Dirichlet/Neumann boundary condition, insulated end, equilibrium temperature); 15 cards; rows added to de-ref-solutions (peak frequency, complex-exponential response, forced systems, heat with other ends) and de-ref-methods. Cross-references: L25 points to the next lesson, L33 to Lesson 36, L37 now says "Lessons 33–35", L40 points to Lesson 41 ("The course ends" → "closes").

Totals now: 41 lessons, 463 questions, 86 drills, 195 cards, 191 glossary terms. Build and check-course: zero problems.

Verification: every new question solved in sympy/scipy (keys and that distractors are wrong); lesson examples checked against their ODEs/PDE series (tank figure against solve_ivp); each new drill generated 400 times — answers recomputed independently from the prompt text (numerical optimization for the peak, complex arithmetic, numpy solves, scipy expm, quadrature for Fourier coefficients), shown answers accepted by checkAll (matrix-exp also in its shown form without stars), perturbed answers rejected. Figures rendered and inspected.

For a reviewer
- Gain is defined relative to the input $F_0\cos\omega t$ (g = 1/|p(iω)|); the lesson notes that some books scale the input by k.
- Gain/phase figures identify curves by caption (curves are nested) rather than labels, to avoid label overlap.
- de-heat-insulated may show an unreduced cosine argument such as 4πx/2 (same style as de-heat-term).
- de-matrix-exp uses the same constructed matrices as de-system-ivp (p ∈ {−2, 1}), so variety comes mostly from the eigenvalues.
