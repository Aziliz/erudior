---
id: pc-inequalities
module: pc-m3
title: Polynomial and rational inequalities
minutes: 30
topics: [Polynomial and rational inequalities]
drills: [pc-quad-ineq, pc-rational-ineq]
refs: [pc-ref-functions]
---
## From graphs to inequalities

An inequality like $x^3 - x^2 - 6x > 0$ asks: *where is the graph of $y = x^3 - x^2 - 6x$ above the $x$-axis?* You already know how to answer that: find where the expression is zero or undefined, and check the sign in between. That is the sign chart from the last lesson, now used as a solving method. Inequalities like these appear whenever a quantity must stay within limits: a profit that must be positive, a concentration that must stay below a threshold, the domain of $\sqrt{x^2 - 9}$.

## Why sign charts work

A polynomial's graph is unbroken, so it can only change sign by passing through zero. A rational function can also change sign at a vertical asymptote, where it jumps between $\pm\infty$. So if we mark all the zeros and all the undefined points on a number line, the expression keeps one sign on each interval between them. Testing one number per interval tells us the sign of the whole interval. These marked numbers are the **critical values** (also called boundary points).

## The method

1. Move everything to one side so the other side is 0. *Never multiply or divide both sides by an expression containing $x$*: you don't know whether it's positive or negative, so you don't know whether to flip the inequality.
2. Combine into a single factored fraction (or factored polynomial).
3. Find the critical values: zeros of the numerator and zeros of the denominator.
4. Make a **sign chart**: test one value in each interval (or count negative factors).
5. Choose the intervals with the required sign. Include zeros of the numerator when the inequality is $\le$ or $\ge$. Never include zeros of the denominator.

### Example 1

Solve $x^3 - x^2 - 6x > 0$.

1. Already compared with 0.
2. Factor: $x(x^2 - x - 6) = x(x - 3)(x + 2)$.
3. Critical values: $-2, 0, 3$.
4. Sign chart:

| Interval | $x + 2$ | $x$ | $x - 3$ | Product |
|---|---|---|---|---|
| $(-\infty, -2)$ | $-$ | $-$ | $-$ | $-$ |
| $(-2, 0)$ | $+$ | $-$ | $-$ | $+$ |
| $(0, 3)$ | $+$ | $+$ | $-$ | $-$ |
| $(3, \infty)$ | $+$ | $+$ | $+$ | $+$ |

5. We want $> 0$ (strict), so endpoints are excluded: $(-2, 0) \cup (3, \infty)$.

```numberline
{"x": [-5, 6], "points": [{"at": [-2, 0], "open": true}, {"at": [0, 0], "open": true}, {"at": [3, 0], "open": true}], "segments": [{"from": [-2, 0], "to": [0, 0]}, {"from": [3, 0], "to": [6, 0], "arrow": true}], "caption": "x³ − x² − 6x > 0 on (−2, 0) ∪ (3, ∞)"}
```

Quick check against the graph: a cubic with positive leading coefficient is positive on the far right; tracing leftward, it drops below the axis at 3, so it's negative on $(0, 3)$, and so on. The signs alternate because every factor has multiplicity 1.

## Repeated factors

A factor with an even power doesn't change sign. So the signs don't simply alternate when a factor is squared.

### Example 2

Solve $(x - 2)^2(x + 1) \le 0$.

Critical values: $-1$ and $2$. $(x - 2)^2 \ge 0$ always, so the sign of the product is the sign of $x + 1$, except that the product is $0$ at $x = 2$.

- $x < -1$: negative. ✓
- $-1 < x < 2$: positive. ✗
- $x > 2$: positive. ✗
- Zeros at $x = -1$ and $x = 2$ satisfy $\le 0$. ✓

Solution: $(-\infty, -1] \cup \{2\}$. The isolated point $x = 2$ is easy to miss and is a common test question.

## Rational inequalities

The same method works, with one extra rule: denominator zeros are critical values but are never in the solution set.

### Example 3

Solve $\dfrac{x + 1}{x - 3} \ge 2$.

1. Don't multiply by $x - 3$. Subtract 2 instead: $\dfrac{x + 1}{x - 3} - 2 \ge 0$.
2. Common denominator: $\dfrac{x + 1 - 2(x - 3)}{x - 3} = \dfrac{7 - x}{x - 3} \ge 0$.
3. Critical values: $x = 7$ (numerator zero) and $x = 3$ (denominator zero).
4. Signs: at $x = 0$, $\frac{7}{-3} < 0$; at $x = 5$, $\frac{2}{2} > 0$; at $x = 8$, $\frac{-1}{5} < 0$.
5. We want $\ge 0$: the interval $(3, 7)$, plus $x = 7$ (where the fraction is 0), but not $x = 3$ (undefined).

$$\text{Solution: } (3, 7].$$

What goes wrong if you multiply by $x - 3$? You'd get $x + 1 \ge 2x - 6$, so $x \le 7$, which wrongly includes values like $x = 0$ (where the left side is $-\frac13$, not $\ge 2$). The multiplication is only valid when $x - 3 > 0$.

## Applications

### Example 4

A company's monthly profit, in thousands of dollars, from selling $x$ hundred units is $P(x) = -x^2 + 12x - 20$. For what sales levels is profit at least \$7 thousand?

$-x^2 + 12x - 20 \ge 7 \iff -x^2 + 12x - 27 \ge 0 \iff x^2 - 12x + 27 \le 0 \iff (x - 3)(x - 9) \le 0.$

(Multiplying by $-1$ flipped the inequality; that's allowed because $-1$ is a known negative number.) The product is $\le 0$ between the roots: $3 \le x \le 9$, i.e. between 300 and 900 units.

## Common mistakes

- *Multiplying both sides by an expression in $x$.* Its sign is unknown; subtract to get 0 on one side instead.
- *Including denominator zeros.* The expression is undefined there.
- *Assuming signs alternate.* Even-power factors don't change sign.
- *Missing isolated points* like $x = 2$ in $(x - 2)^2(x + 1) \le 0$.
- *Forgetting to flip* when multiplying by a negative constant.

## Key points

- Get 0 on one side, factor, and find critical values (numerator and denominator zeros).
- The sign is constant between critical values; test one point per interval.
- $\le, \ge$: include numerator zeros; never include denominator zeros.
- Factors with odd powers change sign; even powers don't.
- Read your answer against the graph: "$> 0$" means "where the graph is above the $x$-axis."
