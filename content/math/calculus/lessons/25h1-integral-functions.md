---
id: calc-m6-h-integral-functions
module: calc-m6
honors: true
title: Functions defined by integrals
minutes: 45
topics: [Functions defined by integrals]
drills: [calc-m6-r2-ln-sums, calc-m6-r2-integral-equation]
refs: [calc-ref-integrals]
---
## A new way to build functions

Lesson 23 drew a quiet but remarkable consequence of FTC 1: every continuous function $f$ has an antiderivative, namely $g(x) = \int_a^x f(t)\,dt$. That is true even when no formula you know will do the job. In this lesson we take the idea seriously and use integrals to *define* functions. You'll see how the natural logarithm can be built from scratch as an area, meet two famous functions that have no formula at all, and learn to analyze, take limits of, and solve equations involving functions given only as integrals.

The tools are the ones you already have: FTC 1 for derivatives, the chain rule, L'Hôpital's rule (Lesson 16), and reading increase, decrease and concavity from $g' = f$ and $g'' = f'$.

## The natural logarithm as an area

Up to now, $\ln x$ was the inverse of $e^x$. But that raises awkward questions: what exactly is $e^x$ when $x$ is irrational, and why is it differentiable? Many calculus texts (OpenStax *Calculus* Volume 1, Section 6.7, is one) sidestep them by starting from an integral instead; analysis courses often start from a power series for $e^x$ instead, and both routes lead to the same function. For $x > 0$, define

$$\ln x = \int_1^x \frac{1}{t}\,dt.$$

For $x > 1$ this is the area under $y = \frac1t$ from 1 to $x$; for $0 < x < 1$ the limits run backward, so $\ln x$ is negative.

```plot
{"x": [-0.2, 4.2], "y": [-0.3, 2.3], "functions": [{"f": "1/x", "from": 0.4, "to": 4.2, "label": "y = 1/t"}], "shade": [{"f": "1/x", "from": 1, "to": 2.5}], "points": [{"at": [1, 0], "label": "1"}, {"at": [2.5, 0], "label": "x"}], "xLabel": "t", "caption": "ln x is the shaded area under y = 1/t from 1 to x (here x = 2.5, area ≈ 0.916)"}
```

Everything we know about $\ln$ can be recovered from this definition.

- $\ln 1 = \int_1^1 \frac1t\,dt = 0$.
- By FTC 1, $\frac{d}{dx}\ln x = \frac1x$, which is positive, so $\ln$ is increasing; its second derivative $-\frac{1}{x^2}$ is negative, so it is concave down.
- *The product law.* Fix $a > 0$. Then $\frac{d}{dx}\ln(ax) = \frac{1}{ax}\cdot a = \frac1x$, the same derivative as $\ln x$. Two functions with the same derivative on an interval differ by a constant: $\ln(ax) = \ln x + C$. Setting $x = 1$ gives $C = \ln a$. So $\ln(ax) = \ln a + \ln x$.

That last argument proves a law of logarithms with no exponentials anywhere. From it follow $\ln\frac{a}{b} = \ln a - \ln b$ and $\ln(a^n) = n\ln a$ for whole numbers $n$.

*Where $e$ comes from.* The smallest value of $\frac1t$ on $[1, 2]$ is $\frac12$ and the largest is 1, so the bounds property from Lesson 22 gives $\frac12 \le \ln 2 \le 1$ (in fact strictly, since $\frac1t$ isn't constant). Then $\ln 4 = 2\ln 2 > 1$. Because $\ln$ is continuous and increasing, the Intermediate Value Theorem gives exactly one number between 2 and 4 whose logarithm is 1. That number is *defined* to be $e$. The same doubling shows $\ln(2^n) = n\ln 2 > \frac n2$, so $\ln x \to \infty$ as $x \to \infty$, even though it grows very slowly.

### Example 1 (pinning down $\ln 2$ with sums)

Use left and right Riemann sums with $n = 4$ to bound $\ln 2 = \int_1^2 \frac1t\,dt$.

$\Delta t = 0.25$, with endpoints $1, 1.25, 1.5, 1.75, 2$. Since $\frac1t$ is *decreasing*, the left sum is too big and the right sum too small.

$$L_4 = 0.25\left(1 + \tfrac45 + \tfrac23 + \tfrac47\right) = \frac{319}{420} \approx 0.7595, \qquad R_4 = 0.25\left(\tfrac45 + \tfrac23 + \tfrac47 + \tfrac12\right) = \frac{533}{840} \approx 0.6345.$$

So $0.6345 < \ln 2 < 0.7595$. (The true value is $0.6931\ldots$; the midpoint sum, $0.6912$, is much closer.) With more rectangles the bounds squeeze together, so in principle this definition lets you compute $\ln 2$ to any accuracy with nothing but arithmetic.

## Antiderivatives with no formula

An **elementary function** is one built from polynomials, roots, exponentials, logarithms, trig and inverse trig functions using arithmetic and composition. Derivatives of elementary functions are always elementary. Antiderivatives are not. Work by Joseph Liouville in the 1830s and 1840s led to methods that *prove* certain antiderivatives, such as those of $e^{-x^2}$, $\frac{\sin x}{x}$ and $\sin(x^2)$, are not elementary. No amount of cleverness with substitution or the techniques of Module 8 will find them.

These antiderivatives still exist (FTC 1 guarantees it), so mathematicians name them and tabulate them, just as $\sin$ and $\ln$ were once tabulated.

- The **error function**: $\displaystyle \operatorname{erf}(x) = \frac{2}{\sqrt\pi}\int_0^x e^{-t^2}\,dt$. The factor $\frac{2}{\sqrt\pi}$ is chosen so that $\operatorname{erf}(x) \to 1$ as $x \to \infty$. It is central to statistics: the chance that a standard normal variable lands within $z$ of its mean is $\operatorname{erf}\left(\frac{z}{\sqrt2}\right)$, and $\operatorname{erf}\left(\frac{1}{\sqrt2}\right) \approx 0.683$ is the familiar "68% within one standard deviation."
- The **sine integral**: $\displaystyle \operatorname{Si}(x) = \int_0^x \frac{\sin t}{t}\,dt$, where the integrand is taken to be 1 at $t = 0$ (its limit there), which makes it continuous. It appears in signal processing and optics.

```plot
{"x": [-3, 3], "y": [-1.3, 1.3], "functions": [{"f": "erf(x)", "label": "y = erf(x)"}, {"f": "1", "dashed": true}, {"f": "-1", "dashed": true}], "caption": "The error function rises from −1 to 1; it is odd, increasing, and has its only inflection point at 0"}
```

## Analyzing a function you can't write down

You don't need a formula to answer most questions about $F(x) = \int_a^x f(t)\,dt$. The derivative is $f$, the second derivative is $f'$, and $F(a) = 0$.

A symmetry fact is also useful. If $f$ is even, then $F(x) = \int_0^x f(t)\,dt$ is odd: substituting $t = -u$ gives $F(-x) = \int_0^{-x} f(t)\,dt = -\int_0^{x} f(-u)\,du = -F(x)$. Both $e^{-t^2}$ and $\frac{\sin t}{t}$ are even, so $\operatorname{erf}$ and $\operatorname{Si}$ are odd.

### Example 2 (the shape of Si)

Find the critical points of $\operatorname{Si}(x)$ for $x > 0$, classify them, and find its inflection point at the origin.

- $\operatorname{Si}'(x) = \frac{\sin x}{x}$. For $x > 0$ the denominator is positive, so the sign is the sign of $\sin x$. Critical points: $x = \pi, 2\pi, 3\pi, \ldots$
- $\sin x$ changes from $+$ to $-$ at $\pi, 3\pi, 5\pi, \ldots$: local maxima. It changes from $-$ to $+$ at $2\pi, 4\pi, \ldots$: local minima.
- $\operatorname{Si}''(x) = \frac{x\cos x - \sin x}{x^2}$ for $x \ne 0$. Near 0 this is negative for small $x > 0$ and (since $\operatorname{Si}'$ is even, $\operatorname{Si}''$ is odd) positive for small $x < 0$. So $\operatorname{Si}$ is concave up just left of 0 and concave down just right of it: an inflection point at $(0, 0)$.

Numerically, $\operatorname{Si}(\pi) \approx 1.852$ is the largest value of all, and $\operatorname{Si}(2\pi) \approx 1.418$. The oscillations shrink, and it is a known (harder) fact that $\operatorname{Si}(x) \to \frac\pi2 \approx 1.571$ as $x \to \infty$. The other inflection points, where $\tan x = x$ (the first is near $x \approx 4.493$), need a numerical solver.

![The graph of y = Si(x) from about −2π to 4π. It passes through the origin with an inflection point there, rises to a local maximum at (π, 1.85), dips to a local minimum at (2π, 1.42), and keeps oscillating with shrinking swings around the dashed horizontal asymptote y = π/2. On the left it mirrors this, approaching the dashed line y = −π/2.](images/calc-m6-sine-integral.svg)

## Limits involving integrals

When $x \to a$ in an expression with $\int_a^x$, the integral tends to 0, which often produces a $\frac00$ form. L'Hôpital's rule plus FTC 1 handles it.

### Example 3

Evaluate $\displaystyle\lim_{x\to0}\frac{1}{x^3}\int_0^x \sin(t^2)\,dt$.

Both numerator and denominator tend to 0. Differentiate each (FTC 1 on top):

$$\lim_{x\to0}\frac{\sin(x^2)}{3x^2} = \frac13\lim_{u\to0^+}\frac{\sin u}{u} = \mathbf{\frac13}.$$

A sanity check: near 0, $\sin(t^2) \approx t^2$, and $\int_0^x t^2\,dt = \frac{x^3}{3}$.

## Equations with an unknown inside an integral

An **integral equation** has the unknown function inside an integral. FTC 1 turns it into a derivative equation, and plugging in the integral's lower limit (where the integral is 0) supplies an initial value.

### Example 4

Find a number $a$ and a function $f$ such that $\displaystyle\int_a^x f(t)\,dt = x^2 - 2x - 8$ for all $x$.

- Differentiate both sides: $f(x) = 2x - 2$.
- Set $x = a$: the left side is 0, so $a^2 - 2a - 8 = 0$, $(a - 4)(a + 2) = 0$, and $a = 4$ or $a = -2$.

Check with $a = 4$: $\int_4^x (2t - 2)\,dt = (x^2 - 2x) - (16 - 8) = x^2 - 2x - 8$. ✓ Both values of $a$ work.

### Example 5

Find every continuous $f$ with $\displaystyle f(x) = 3 + 2\int_0^x f(t)\,dt$.

- The right side is differentiable (FTC 1), so $f$ is too, and $f'(x) = 2f(x)$.
- At $x = 0$: $f(0) = 3 + 0 = 3$.
- One solution is $3e^{2x}$. Is it the only one? Let $h(x) = f(x)e^{-2x}$. By the product rule, $h' = (f' - 2f)e^{-2x} = 0$, so $h$ is constant, $h(0) = 3$, and $f(x) = \mathbf{3e^{2x}}$.

Check: $3 + 2\int_0^x 3e^{2t}\,dt = 3 + 3(e^{2x} - 1) = 3e^{2x}$. ✓ (Module 9 solves equations like $f' = 2f$ in general.)

## Common mistakes

- *Thinking "no elementary antiderivative" means "no antiderivative."* Every continuous function has one; it just may need a new name.
- *Forgetting the chain rule.* $\frac{d}{dx}\operatorname{erf}(x^3) = \frac{2}{\sqrt\pi}e^{-x^6}\cdot 3x^2$.
- *Dropping the initial value* in an integral equation. Set $x$ equal to the lower limit: the integral vanishes and leaves $f(a)$ or an equation for $a$.
- *Reading extrema of $F$ from the extrema of $f$.* $F$'s critical points are the zeros of $f$ (with a sign change); $f$'s own maxima and minima give $F$'s inflection points.
- *Using FTC 1 on an integrand that isn't continuous.* For $\frac{\sin t}{t}$ we had to fill in the value 1 at $t = 0$ first.

## Key points

- $F(x) = \int_a^x f(t)\,dt$ defines a function for any continuous $f$; $F' = f$, $F'' = f'$, $F(a) = 0$.
- $\ln x = \int_1^x \frac{dt}{t}$ can serve as the definition of the natural log; its derivative and laws follow from FTC 1, and $e$ is the number with $\ln e = 1$.
- Some antiderivatives, such as those of $e^{-x^2}$ and $\frac{\sin x}{x}$, are provably not elementary; $\operatorname{erf}$ and $\operatorname{Si}$ are named integrals.
- If $f$ is even, $\int_0^x f(t)\,dt$ is odd.
- Limits of integrals: often $\frac00$, handled by L'Hôpital and FTC 1.
- Integral equations: differentiate, then plug in the lower limit for the initial value.
