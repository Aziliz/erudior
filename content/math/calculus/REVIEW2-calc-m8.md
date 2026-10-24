# Round 2 review: calc-m8 (Techniques of integration)

Reviewed independently: the honors lessons 36h1, 36h2 and 36h3, the round 2 additions to core lessons 31–36
(2 SVG pictures with blank copies, 8 Mermaid diagrams, 4 plots), `questions/r2-calc-m8.yaml` (72 questions),
`drills/r2-calc-m8.yaml` (5 drills), `glossary-r2-calc-m8.yaml` (9 terms) and `cards-r2-calc-m8.yaml` (24 cards).
`content/math/check-module.sh calculus calc-m8` reports zero problems after the fixes (9 lessons, 139 questions,
17 drills, 63 cards).

## Changes

### Questions
- **calc-m8-r2-q14** (order, partial fractions). "If the fraction is improper, divide first" and "Factor the
  denominator completely" could be done in either order, because long division leaves the denominator unchanged.
  That gave two valid orders. I changed the stem to "a proper rational function" and removed the division step,
  leaving 4 items: factor, write terms, solve for constants, integrate. Those steps have only one order. The
  explanation now mentions division in a note.
- **calc-m8-r2-q24** (order, improper integral). "Find the antiderivative $-\frac1x$" could come before
  "Replace $\infty$ by $t$", because the antiderivative doesn't depend on $t$. That gave two valid orders. I merged
  the antiderivative step into the evaluation step ("Evaluate the ordinary integral from 1 to $t$:
  $[-\frac1x]_1^t = 1 - \frac1t$"), leaving 3 items with one order.
- **calc-m8-r2-q10** (MC). The explanation said nothing about the two $\tan$ distractors. I added a sentence saying
  where they come from and showing $(\frac13\tan^3x)' = \tan^2x\sec^2x$. The key was correct.

### Lessons
- **36h2, "The definition", convergence on $[1, \infty)$.** The bound $x^{s-1}e^{-x} \le e^{-x/2}$ only holds
  for large $x$, but the lesson used it on all of $[1, \infty)$. I added one sentence: before $x$ is that large,
  the integral is an ordinary integral of a continuous function over a bounded interval.

### Plots (labels sitting on curves)
I rendered the plots with the app's `renderFigure` and `src/styles.css`.
- **34 (trapezoid and midpoint for $\frac12x^2 + 1$).** The "midpoint" point label was drawn over the curve and the
  tangent line. I moved it to a free label at (1.3, 1.25), inside the rectangle.
- **35 (region under $1/\sqrt x$).** The curve label "y = 1/√x" was drawn on the curve at the right edge. I
  replaced it with a free label at (1.05, 1.6), just above the curve.
- **36h2 ($\Gamma(x)$).** The labels "(2, 1)" and "(3, 2)" crossed the curve. I moved them to free labels at
  (1.95, 1.8) and (3.45, 1.3).

## Checked and found right (things a reader might doubt)
- **36h1 numbers** (recomputed in Python and sympy):
  - $\int x^3e^x$, $W_5 = 8/15$, $W_6 = 5\pi/32 \approx 0.4909$ and $\int_0^{\pi/4}\tan^4 = \pi/4 - 2/3 \approx 0.1187$.
  - The partial products $P_1 = 4/3$, $P_2 = 64/45$, $P_{10} = 1.53385$ and $P_{100} = 1.56689$. The gap
    $\pi/2 - P_{100} = 0.00390$ is close to $\pi/800 = 0.00393$.
  - In IEEE doubles the forward recurrence gives $J_{15} = 0.160496$ (true value 0.160426) and
    $J_{20} = -129.26$ (true value 0.123804). The bounds $1/(n+1) < J_n < e/(n+1)$ hold.
- **36h1 Wallis proof.** The squeeze gives $W_{2k}/W_{2k+1} \to 1$, and the ratio formula and the product are
  algebraically correct. Wallis, *Arithmetica Infinitorum*, 1656, is the standard citation, and the lesson
  correctly says he found the product by interpolation, not by this proof.
- **36h2 values:**
  - $\Gamma$ has its minimum of 0.88560 at $x = 1.46163$.
  - Stirling's relative error is 1.65% at $n = 5$, 0.83% at $n = 10$ and 0.42% at $n = 20$ (both the lesson's
    "under 0.5%" and h28's "0.8%" are right).
  - $\int_0^\infty x^4e^{-x^2} = 3\sqrt\pi/8$, $\int_0^1(-\ln x)^3 = 6$, and the exponential moments $n!/\lambda^n$.
- **36h2 history.** Euler's letters to Goldbach of 13 Oct 1729 (infinite product) and 8 Jan 1730 (integral).
  Euler's integral was $\int_0^1(-\ln x)^n\,dx$, which matches the remark in Example 4. Legendre introduced the
  $\Gamma$ notation in the early 1800s (1809–1811).
- **36h2 cross-references.** Lesson 35 quotes $\int_0^\infty e^{-x^2} = \sqrt\pi/2$, so "Lesson 35 quoted its
  value" holds. 30h2 finds the exponential mean by parts and gives the variance shortcut, as Example 5 says.
- **36h3 Euler–Maclaurin.** The signs and coefficients ($+h^2/12$, $-h^4/720$, from $B_2 = 1/6$ and
  $B_4 = -1/30$) are right. It is correctly labeled as asymptotic.
- **36h3 tables and numbers:**
  - Example 1: the whole error table for $\int_1^2 dx/x$.
  - Example 2: the Richardson value 0.693254.
  - Example 3: the whole Romberg table for $e^x$ to 7 decimal places; the corner error is $3.4\times10^{-10}$.
  - The $\sqrt x$ case: the error ratios are 2.64–2.77 per halving, and the corner of the 5-row table is off by
    0.00107.
  - $\int_0^{2\pi}e^{\sin x}$: $T_8$ is off by $1.25\times10^{-6}$ and $T_{16}$ by $2\times10^{-15}$.
  - The proof that $(4T_{2n} - T_n)/3 = S_{2n}$.
- **36h3 history.** Richardson's 1911 paper, Richardson and Gaunt's 1927 paper "The deferred approach to the
  limit", and Romberg's 1955 paper ("Vereinfachte numerische Integration"). The cross-references to 08h1 and 39h2
  match those lessons.
- **Core additions:**
  - 31: the $uv$-plane area argument (the three regions tile the $u_2v_2$ rectangle when $u$ and $v$ both
    increase, which the text states).
  - 33: $\frac12\ln\frac95 \approx 0.294$.
  - 34: $T_1 = 4$, $M_1 = 3$, true value $10/3$, and the tangent-line view of the midpoint rule.
  - 35: the $1/\sqrt x$ plot.
  - 36: the root-to-substitution chart.
- **All 72 questions worked independently.**
  - Notable values: q20 ($n \ge 3.51$, so $n = 4$; the trapezoid needs 48), q25 (6), q30 ($20\sinh 1 = 23.50$),
    h28 (0.83%), h34 (0.0358, rounded to 0.036), h39 (1.71883) and h41 (−0.003770).
  - h42: the errors $2.2\times10^{-3}$, $2.3\times10^{-6}$, $1.4\times10^{-8}$ and $3.4\times10^{-10}$ match the
    key.
  - YAML-doubled primes (`f''(b)`, `f''''''`) come out as $f'$ and $f'''$.
- **Pictures.** Both SVGs and their blank copies were rendered. The geometry is correct, nothing overlaps, and the
  markers in q04 and q09 sit on the regions and sides they name. The label answers are unambiguous: in q09, the
  only label that repeats is "a", and only one numbered side is "a".
- **Mermaid.** All 8 diagrams render. Their content is correct, and each accDescr describes the whole diagram.
- **Drills.** I recomputed all of them independently in Python:
  - gamma-moment: every $(n, a)$ with $a^{n+1} \le 20000$, checked against sympy.
  - gamma-half: $k = 3$–7, checked against sympy's gamma.
  - wallis: $n = 3$–10, the closed form checked against sympy integrals, and the chain labels match.
  - richardson: all 20 $(lo, d)$ inputs. The tolerance of 0.0001 is at least half of the last place (0.00005),
    so a correctly rounded answer is always accepted.
  - romberg: same tolerance.
- **Glossary and cards.** No duplicate terms or aliases in any `glossary*.yaml` in the course. The definitions and
  card backs are correct.

## Overlap
Richardson extrapolation also appears in 08h1 (calc-m2) and 39h2. 36h3 points to both and doesn't repeat their
material, and the term is defined only once (calc-m2's glossary). No other round 2 lesson covers the gamma
function, the Wallis product or Romberg integration.

## Uncertain
- 36h2 calls 30h2 "the honors lesson on probability density functions (Lesson 30)". That is accurate, since it is
  the honors lesson after Lesson 30, but I left the wording as written.
