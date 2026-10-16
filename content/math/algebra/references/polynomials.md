---
id: alg-ref-polynomials
title: Exponents, polynomials, factoring and quadratics
---
## Exponent rules ($a, b \ne 0$)

| Rule | Statement |
|---|---|
| Product | $a^ma^n = a^{m+n}$ |
| Quotient | $\dfrac{a^m}{a^n} = a^{m-n}$ |
| Power | $(a^m)^n = a^{mn}$ |
| Product / quotient to a power | $(ab)^n = a^nb^n$, $\left(\dfrac ab\right)^n = \dfrac{a^n}{b^n}$ |
| Zero, negative | $a^0 = 1$, $a^{-n} = \dfrac{1}{a^n}$ |
| Scientific notation | $c \times 10^n$, $1 \le \lvert c \rvert < 10$ |

## Special products

| Product | Result |
|---|---|
| $(a + b)^2$ | $a^2 + 2ab + b^2$ |
| $(a - b)^2$ | $a^2 - 2ab + b^2$ |
| $(a + b)(a - b)$ | $a^2 - b^2$ |
| $(a + b)^3$ | $a^3 + 3a^2b + 3ab^2 + b^3$ |

## Factoring patterns

| Pattern | Factored |
|---|---|
| GCF | $ab + ac = a(b + c)$ |
| Difference of squares | $a^2 - b^2 = (a + b)(a - b)$ |
| Perfect square | $a^2 \pm 2ab + b^2 = (a \pm b)^2$ |
| Sum of cubes | $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$ |
| Difference of cubes | $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ |
| $x^2 + bx + c$ | $(x + m)(x + n)$ with $mn = c$, $m + n = b$ |
| $ax^2 + bx + c$ | split $bx$ using numbers with product $ac$ and sum $b$, then group |

Strategy: GCF first; 2 terms → squares/cubes; 3 terms → trinomial methods; 4 terms → grouping; factor completely; check by multiplying.

## Quadratic equations $ax^2 + bx + c = 0$

| Method | Use when |
|---|---|
| Zero product property | it factors: $AB = 0 \Rightarrow A = 0$ or $B = 0$ |
| Square root property | $u^2 = k \Rightarrow u = \pm\sqrt k$ |
| Completing the square | add $\left(\tfrac b2\right)^2$ to $x^2 + bx$ |
| Quadratic formula | always: $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ |

| Discriminant $D = b^2 - 4ac$ | Real solutions |
|---|---|
| $D > 0$ | two (rational if $D$ is a perfect square) |
| $D = 0$ | one (double root) |
| $D < 0$ | none (two complex conjugates) |

## Quadratic functions

| Form | Equation | Shows |
|---|---|---|
| Standard | $ax^2 + bx + c$ | $y$-intercept $c$; vertex at $x = -\tfrac{b}{2a}$ |
| Vertex | $a(x - h)^2 + k$ | vertex $(h, k)$, axis $x = h$ |
| Intercept | $a(x - r)(x - s)$ | $x$-intercepts $r$, $s$ |

$a > 0$: opens up, minimum at the vertex. $a < 0$: opens down, maximum. Projectiles: $h(t) = -16t^2 + v_0t + h_0$ (ft), $-4.9t^2 + v_0t + h_0$ (m).
