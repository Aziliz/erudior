---
id: alg-ref-functions
title: Functions, quadratics, radicals, rational functions and polynomials
---
## Functions

| Idea | Rule |
|---|---|
| Function | each input has exactly one output (vertical line test) |
| Domain from a formula | exclude zeros of denominators and negative even-root radicands |
| Composition | $f(g(x))$: apply $g$ first |
| Zeros | solutions of $f(x) = 0$ = $x$-intercepts |
| Average rate of change | $\dfrac{f(b) - f(a)}{b - a}$ |
| Sum, product, quotient | $(f + g)(x) = f(x) + g(x)$, etc.; domain: both defined, and $g(x) \ne 0$ for $\tfrac fg$ |
| Domain of $f(g(x))$ | $x$ in the domain of $g$ and $g(x)$ in the domain of $f$ |
| Inverse | $f(a) = b \iff f^{-1}(b) = a$; exists when $f$ is one-to-one (horizontal line test) |
| Finding $f^{-1}$ | $y = f(x)$, swap $x$ and $y$, solve for $y$; graph reflects across $y = x$ |
| Checking an inverse | $f(f^{-1}(x)) = x$ and $f^{-1}(f(x)) = x$ |
| Absolute value | $\lvert x \rvert = x$ if $x \ge 0$, $-x$ if $x < 0$ |
| Greatest integer | $\lfloor x \rfloor$ = greatest integer $\le x$; $\lfloor -1.2 \rfloor = -2$ |

## Transformations of $y = f(x)$

| Formula | Effect on the graph | Points move |
|---|---|---|
| $f(x) + k$ | up $k$ (down if $k < 0$) | $(x, y + k)$ |
| $f(x - h)$ | right $h$ (left if $h < 0$) | $(x + h, y)$ |
| $-f(x)$ | reflect across the $x$-axis | $(x, -y)$ |
| $f(-x)$ | reflect across the $y$-axis | $(-x, y)$ |
| $a f(x)$, $a > 0$ | vertical stretch ($a > 1$) or compression ($a < 1$) | $(x, ay)$ |
| $f(bx)$, $b > 0$ | horizontal compression ($b > 1$) or stretch ($b < 1$) | $\left(\tfrac xb, y\right)$ |
| $a f(x - h) + k$ | all together; anchor point to $(h, k)$ | $(x + h, ay + k)$ |

Parent functions: $x$, $x^2$, $x^3$, $\lvert x \rvert$, $\sqrt x$ ($x \ge 0$), $\sqrt[3]x$, $\tfrac1x$ ($x \ne 0$), $2^x$ (asymptote $y = 0$).

## Quadratics

| Fact | Statement |
|---|---|
| Vertex form | $a(x - h)^2 + k$, vertex $(h, k)$ |
| Quadratic formula | $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ |
| Discriminant | $b^2 - 4ac$: $> 0$ two real, $= 0$ double root, $< 0$ two complex conjugates |
| Sum and product of roots | $r + s = -\tfrac ba$, $rs = \tfrac ca$ |
| Roots $p \pm qi$ | $(x - p)^2 + q^2 = x^2 - 2px + p^2 + q^2$ |

## Radicals and rational exponents

| Rule | Statement |
|---|---|
| Root as exponent | $\sqrt[n]{a} = a^{1/n}$, $a^{m/n} = \left(\sqrt[n]a\right)^m$ |
| Product, quotient | $\sqrt[n]{ab} = \sqrt[n]a\sqrt[n]b$, $\sqrt[n]{\tfrac ab} = \tfrac{\sqrt[n]a}{\sqrt[n]b}$ ($a, b \ge 0$ if $n$ is even; $b \ne 0$) |
| Square of a root | $\sqrt{x^2} = \lvert x \rvert$ |
| Conjugates | $(a + \sqrt b)(a - \sqrt b) = a^2 - b$ |

Radical equations: isolate the radical, raise both sides to the index power, solve, check for extraneous solutions. For $u^{m/n} = c$, raise to the power $\tfrac nm$, with $\pm$ when $m$ is even ($x^{2/3} = 4$ gives $x = \pm 8$).

## Complex numbers

| Fact | Statement |
|---|---|
| Imaginary unit | $i^2 = -1$, $\sqrt{-b} = i\sqrt b$ ($b > 0$) |
| Powers of $i$ | $i, -1, -i, 1$ repeating |
| Conjugate product | $(a + bi)(a - bi) = a^2 + b^2$ |
| Division | multiply top and bottom by the conjugate of the denominator |

## Rational expressions

| Task | Method |
|---|---|
| Simplify | factor, note excluded values, cancel common factors only |
| Multiply / divide | factor and cancel; divide = multiply by the reciprocal |
| Add / subtract | rewrite over the LCD (each factor to its highest power) |
| Complex fraction | multiply top and bottom by the LCD of the inner fractions |
| Rational equation | multiply by the LCD, solve, reject excluded values |
| Work | $\dfrac{1}{t_1} + \dfrac{1}{t_2} = \dfrac{1}{T}$ |

## Graphs of rational functions

| Feature | How to find it |
|---|---|
| Domain | exclude zeros of the denominator |
| Hole | a factor that cancels; height from the simplified form |
| Vertical asymptote | a zero of the denominator that remains after cancelling |
| Horizontal asymptote | degree top < bottom: $y = 0$; equal: ratio of leading coefficients; top > bottom: none |
| Intercepts | $x$: zeros of the simplified numerator; $y$: $f(0)$ |
| Transformed reciprocal | $y = \dfrac{a}{x - h} + k$: asymptotes $x = h$, $y = k$ |
| Inverse variation | $y = \dfrac kx$, $k = xy$ |

## Polynomial functions

| Fact | Statement |
|---|---|
| End behavior | follows $a_nx^n$: even degree, ends match; odd degree, ends opposite |
| Multiplicity | odd: crosses the axis; even: touches and turns |
| Bounds | degree $n$: at most $n$ real zeros, at most $n - 1$ turning points |
| Division algorithm | $f = d \cdot q + r$, $\deg r < \deg d$ |
| Remainder Theorem | remainder of $f(x) \div (x - c)$ is $f(c)$ |
| Factor Theorem | $(x - c)$ is a factor $\iff f(c) = 0$ |
| Rational Root Theorem | candidates $\pm\dfrac{\text{factors of } a_0}{\text{factors of } a_n}$ |
| Fundamental Theorem of Algebra | exactly $n$ complex zeros (with multiplicity); non-real zeros of real polynomials come in conjugate pairs |
