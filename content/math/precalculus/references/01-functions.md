---
id: pc-ref-functions
title: Functions, graphs and polynomials
---
## Domain and notation

| Feature in the formula | Domain restriction |
|---|---|
| $\dfrac{p(x)}{q(x)}$ | $q(x) \ne 0$ |
| $\sqrt{u}$, $\sqrt[4]{u}$ (even roots) | $u \ge 0$ |
| $\log_b u$, $\ln u$ | $u > 0$ |
| $\sqrt[3]{u}$ (odd roots), polynomials | none |

| Interval | Meaning |
|---|---|
| $[a, b]$ | $a \le x \le b$ |
| $(a, b)$ | $a < x < b$ |
| $[a, \infty)$ | $x \ge a$ |
| $A \cup B$ | in $A$ or in $B$ |

## Rates of change

| Quantity | Formula |
|---|---|
| Average rate of change on $[a, b]$ | $\dfrac{f(b) - f(a)}{b - a}$ (slope of secant) |
| Difference quotient | $\dfrac{f(x + h) - f(x)}{h}$ |
| Vertex of $ax^2 + bx + c$ | $x = -\dfrac{b}{2a}$ |

## Symmetry

| Type | Test | Graph |
|---|---|---|
| Even | $f(-x) = f(x)$ | symmetric about the $y$-axis |
| Odd | $f(-x) = -f(x)$ | symmetric about the origin |

## Transformations of $y = f(x)$

| Equation | Effect |
|---|---|
| $y = f(x) + k$ | up $k$ (down if $k < 0$) |
| $y = f(x - h)$ | right $h$ (left if $h < 0$) |
| $y = -f(x)$ | reflect over the $x$-axis |
| $y = f(-x)$ | reflect over the $y$-axis |
| $y = a f(x)$ | vertical stretch by $\lvert a \rvert$ ($\lvert a \rvert > 1$) or compression ($\lvert a \rvert < 1$) |
| $y = f(bx)$ | horizontal compression by factor $1/\lvert b \rvert$ ($\lvert b \rvert > 1$) or stretch ($\lvert b \rvert < 1$); reflect over the $y$-axis too if $b < 0$ |
| $y = a f(b(x - h)) + k$ | point $(p, q) \mapsto \left(\tfrac{p}{b} + h,\; aq + k\right)$ |

## Composition and inverses

- $(f \circ g)(x) = f(g(x))$; domain: $x$ in domain of $g$ with $g(x)$ in domain of $f$.
- $f^{-1}$ exists when $f$ is one-to-one (horizontal line test).
- $f(f^{-1}(x)) = x$ and $f^{-1}(f(x)) = x$; graphs mirror across $y = x$.
- To find $f^{-1}$: write $y = f(x)$, swap $x$ and $y$, solve for $y$.

## Complex numbers

| Fact | Rule |
|---|---|
| Imaginary unit | $i^2 = -1$; $\sqrt{-b} = i\sqrt b$ for $b > 0$ |
| Powers of $i$ | $i, -1, -i, 1$ repeat every 4 (use the remainder of $n \div 4$) |
| Standard form | $a + bi$: real part $a$, imaginary part $b$ |
| Product | $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ |
| Conjugate | $\overline{a + bi} = a - bi$; $(a + bi)(a - bi) = a^2 + b^2$ |
| Quotient | multiply top and bottom by the conjugate of the denominator |
| Modulus | $\lvert a + bi\rvert = \sqrt{a^2 + b^2}$; $a + bi$ plots at $(a, b)$ |

## Polynomials

| Fact | Statement |
|---|---|
| End behavior | follows the leading term $a_n x^n$ |
| Turning points | at most $n - 1$ |
| Multiplicity | odd: graph crosses; even: graph touches and turns |
| Remainder theorem | $f(x) \div (x - c)$ leaves remainder $f(c)$ |
| Factor theorem | $(x - c)$ is a factor $\iff f(c) = 0$ |
| Rational zeros | integer coefficients: $\pm\dfrac{\text{factor of } a_0}{\text{factor of } a_n}$ |
| Fundamental theorem | degree $n \ge 1$ has exactly $n$ complex zeros (with multiplicity) |
| Descartes' rule | real coefficients: positive zeros = sign changes of $f(x)$, or fewer by an even number |
| Conjugates | real coefficients: $a + bi$ zero $\Rightarrow$ $a - bi$ zero |

## Rational functions $R(x) = \dfrac{p(x)}{q(x)}$ (reduced)

| Degrees | Horizontal asymptote |
|---|---|
| $\deg p < \deg q$ | $y = 0$ |
| $\deg p = \deg q$ | $y = \dfrac{\text{leading coeff of } p}{\text{leading coeff of } q}$ |
| $\deg p = \deg q + 1$ | none; slant asymptote = quotient of $p \div q$ |
| $\deg p \ge \deg q + 2$ | none, and no slant asymptote |

- Common factor cancels: hole. Remaining zero of the denominator: vertical asymptote.
- Inequalities: move everything to one side, find zeros and undefined points, test each interval (sign chart).
