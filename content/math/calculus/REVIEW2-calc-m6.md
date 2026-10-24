# Round 2 review: calc-m6 (Integrals and the Fundamental Theorem)

Reviewer pass over the writer's round 2 work: honors lessons 25h1 and 25h2, additions to core
lessons 21–25, `questions/r2-calc-m6.yaml` (53), `drills/r2-calc-m6.yaml` (4),
`glossary-r2-calc-m6.yaml` (5), `cards-r2-calc-m6.yaml` (19) and the 11 `images/calc-m6-*` SVGs.
`content/math/check-module.sh calculus calc-m6` reports zero problems after the fixes.

Counts: answer-key errors 0, factual fixes 3, picture fixes 0, other fixes 7.

## Changes

### Factual
1. **25h2, "How far off are left and right sums?" and Common mistakes.** The lesson implied the
   identity $R_n - L_n = [f(b) - f(a)]\Delta x$ needs monotone $f$, and the Common-mistakes bullet
   said it "relies on every strip having the same sign". Wrong: the telescoping holds for every $f$
   with equal widths. What needs monotonicity is that the integral lies between $L_n$ and $R_n$.
   I added a sentence saying so and rewrote the bullet with a counterexample: $f(x) = x - x^2$ on
   $[0, 1]$, $n = 2$ gives $L_2 = R_2 = 0.125$ while the integral is $\frac16$ (checked in Python).
2. **cards-r2, "$R_n - L_n$ for monotone $f$".** Back said "$\pm[f(b) - f(a)]\Delta x$". The
   identity holds with its own sign, so the $\pm$ was wrong. Now "$[f(b) - f(a)]\Delta x$ (true for
   any $f$); for monotone $f$ the integral lies between …".
3. **glossary-r2, sine integral.** It said Si "has local maxima at odd multiples of $\pi$ and minima
   at even multiples". Si is odd, so for $x < 0$ this flips (local min at $-\pi$), and $0$ is not
   an extremum. Now limited to $x > 0$: maxima at $\pi, 3\pi, \ldots$, minima at $2\pi, 4\pi, \ldots$.

### Other (wording, unambiguity, distractor explanations)
4. **25h1 intro.** "Lesson 23 ended with …": the antiderivative remark is mid-lesson (line 36),
   not at the end. Now "Lesson 23 drew …".
5. **25h1, ln as an integral.** "Many college texts and most analysis courses" define ln this way:
   "most analysis courses" is overstated, since many (e.g. Rudin) start from the power series for
   $e^x$. Now: many calculus texts do (OpenStax *Calculus* Vol. 1, §6.7, cited); analysis
   courses often start from a power series; both give the same function. (The writer's notes cite
   §6.6; the section is 6.7.)
6. **25h2, trapping a sum.** "Shifting the boxes one unit left puts them under the curve" glossed
   over the first box, which would land on $[0, 1]$. Now says the boxes for $i = 2..n$ shift onto
   $[i-1, i]$ and $f(1)$ is left over, which is where the $f(1) +$ comes from.
7. **q05 (order).** Steps 2 and 3 could be swapped: you can antidifferentiate $f'$ with $C_1$
   still unknown. Item 3 now reads "Antidifferentiate $f'(x) = 4x^3 + 6x + 1$ …", which forces
   $C_1$ first. Now there is only one correct order.
8. **q20.** Distractor $-\frac15\sin(5x)$ had no explanation; added (sign of the antiderivative of
   sin, not cos).
9. **h18.** Distractor 330 matched no real mistake. Replaced with 770 (dividing by 3 instead of
   6), named in the explanation. Answer index unchanged.
10. **h20, h11.** Explanations now name the remaining distractors: 0.1 is $\Delta x$ alone; the
    first choice of h11 drops the chain-rule factor $3x^2$.

## Checked and found right (a reader might doubt)
- Every question worked independently before reading the key; all 53 keys are correct. Includes q13
  ($g(6) = 0 < g(4) = \frac43 < g(1) = \frac{25}{12} < g(2) = \frac83$), q25 (58 L), h21 (1278, since
  $200(e^2 - 1) = 1277.8$), h22 (choices 3 and 4 false for decreasing positive $f$), h23 (bounds
  4.615, 5.605; $H_{100} = 5.1874$), h24 ($H_{10000} = 9.7876$).
- All lesson numbers recomputed with mpmath: $L_4 = 319/420$, $R_4 = 533/840$ for ln 2;
  $\ln 2.5 = 0.9163$; Si(π) = 1.85194, Si(2π) = 1.41815; the first root of tan x = x is 4.49341;
  erf(1/√2) = 0.68269; $\sum_{i\le1000} 1000/(1000^2 + i^2) = 0.78515$; $\ln 1001 = 6.9088$,
  $1 + \ln 1000 = 7.9078$, $H_{1000} = 7.48547$, $\ln 1000 + \gamma = 7.48497$; $\sum\sqrt i$ = 671.463,
  bounds 666.67 and 676.02; the sum-of-squares algebra $2(n+1)^3 - 2 - 3n(n+1) - 2n = 2n^3 + 3n^2 + n$.
- Si(π) is the global maximum (the later maxima decrease toward π/2); erf's only inflection is at 0
  ($\mathrm{erf}'' = -\frac{4x}{\sqrt\pi}e^{-x^2}$); the "68% within one sd" link is
  $P(|Z| < z) = \mathrm{erf}(z/\sqrt2)$ (DLMF §7.2, §7.18 relations; standard).
- Liouville's work on integration in finite terms (1833–1841) is "1830s and 1840s"; Euler studied
  γ in 1734/35 (E43, published 1740), so "1730s" holds; the irrationality of γ is open; Archimedes'
  quadrature of the parabola is 3rd century BCE.
- Cross-references exist: Lesson 16 is L'Hôpital, 34 numerical integration, 35 improper integrals,
  41 the integral test; Module 8 is techniques, Module 9 differential equations; Lesson 22 has the
  bounds property used for $\frac12 \le \ln 2 \le 1$.
- Core additions: the motion chain matches Example 5; the accumulation picture is
  $f(t) = (t-2)(t-6)/4$ (f(0) = 3, min −1 at t = 4), as q13 says; the particle path matches
  $s(0..4) = 0, 4, 2, 0, 4$; the four sum-type panels and the R−L stacking picture are geometrically
  right (column runs from f(a) to f(b)).
- All 11 SVGs rendered; text readable, nothing cut off or overlapping. All 5 label questions
  rendered with their markers; every marker sits on the part its label names.
- All 6 Mermaid diagrams rendered and are correct; accTitle/accDescr describe the whole diagram.
  The ```plot specs (Example 6 f and g, the substitution regions, x³cos x (max |y| = 3.33 inside the
  ±3.6 window), 1/t area, erf, boxes over 1/x) have correct functions and captions. The previewer
  doesn't render ```plot, so label placement on those was checked by reasoning only.
- Drills: 200 instances each, answers recomputed independently in Python-style code from the
  prompt values; correctly rounded answers accepted (ln-sums tolerance 0.0001 for 4 places;
  sum-to-integral 0.006 for 2 places, and the exact fraction is accepted), off-by-one or wrong-sign
  answers rejected. The solutions read correctly; no unfilled placeholders or "+ -".
- Glossary: no duplicate terms or aliases in other calculus glossaries; Euler–Mascheroni is left to
  calc-m10's file, as the writer says.

## Overlap (not changed)
- 25h2's R−L telescoping picture is the same idea as 93-integrability's proof that monotone
  functions are integrable (calc-h1). Different purpose (error bound versus integrability).
- 25h2 Example 5 ($H_n \approx \ln n + \gamma$, passing 100 needs about $e^{99}$ terms) overlaps
  44h1 (calc-m10), which covers the same material in the series setting.

## Left uncertain
- Cosmetic only: lr-error prints large n with a thousands comma in bold text (outside math, which
  is allowed). For integer answers, sum-to-integral shows "580 ≈ 580.00".
- h05 marker 4 sits on the upper dashed line y = π/2 at the left of the graph, where the curve is
  actually near −π/2. The line is still the horizontal asymptote, so the key is right, but a marker
  on the right-hand part would be more natural. There the curve runs too close to the line for a
  clean marker, so I left it.

## Sources
- OpenStax, *Calculus* Volume 1, §6.7 "Integrals, Exponential Functions, and Logarithms"
  (https://openstax.org/books/calculus-volume-1/pages/6-7-integrals-exponential-functions-and-logarithms).
- NIST DLMF ch. 6 (sine integral) and ch. 7 (error function).
- Numerical checks: mpmath/Python, scratch only.
