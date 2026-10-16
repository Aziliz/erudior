---
id: pc-poly-division
module: pc-m3
title: Dividing polynomials; the remainder and factor theorems
minutes: 30
topics: [Polynomial division]
drills: [pc-remainder, pc-synthetic-quotient]
refs: [pc-ref-functions]
---
## Why divide polynomials?

In the last lesson, factored polynomials were easy to graph: the factors handed us the zeros. But most polynomials don't arrive factored. Division is the tool that breaks them apart: once you know one zero $c$, dividing by $(x - c)$ leaves a polynomial of lower degree that is easier to factor. Division also produces the slant asymptotes of rational functions later in this module and the partial fractions of Module 6.

## Long division

Polynomial long division works exactly like long division of numbers. The result is described by the **division algorithm**: for polynomials $f$ (the dividend) and $d \ne 0$ (the divisor) there are unique polynomials $q$ (the **quotient**) and $r$ (the **remainder**) with

$$f(x) = d(x)\,q(x) + r(x), \qquad \text{where } r = 0 \text{ or } \deg r < \deg d.$$

Dividing both sides by $d(x)$ gives the form you'll use for asymptotes: $\dfrac{f(x)}{d(x)} = q(x) + \dfrac{r(x)}{d(x)}$.

The routine: divide the leading term of what's left by the leading term of the divisor, write that as the next quotient term, multiply it back by the divisor, subtract, and repeat until what's left has lower degree than the divisor. Include $0$ placeholders for missing powers so the columns line up.

### Example 1

Divide $x^4 + 2x^3 - x + 5$ by $x^2 + 1$.

Write the dividend as $x^4 + 2x^3 + 0x^2 - x + 5$.

1. $x^4 \div x^2 = x^2$. Multiply: $x^2(x^2 + 1) = x^4 + x^2$. Subtract: $2x^3 - x^2 - x + 5$.
2. $2x^3 \div x^2 = 2x$. Multiply: $2x^3 + 2x$. Subtract: $-x^2 - 3x + 5$.
3. $-x^2 \div x^2 = -1$. Multiply: $-x^2 - 1$. Subtract: $-3x + 6$.

The remainder $-3x + 6$ has degree 1 < 2, so we stop:

$$\frac{x^4 + 2x^3 - x + 5}{x^2 + 1} = x^2 + 2x - 1 + \frac{-3x + 6}{x^2 + 1}.$$

Check by multiplying back: $(x^2 + 1)(x^2 + 2x - 1) + (-3x + 6) = x^4 + 2x^3 - x^2 + x^2 + 2x - 1 - 3x + 6 = x^4 + 2x^3 - x + 5$. ✓

## Synthetic division

When the divisor is linear, $x - c$, long division can be compressed into **synthetic division**, which keeps only the coefficients.

1. Write $c$ in a box and the dividend's coefficients (with 0 placeholders) in a row.
2. Bring down the first coefficient.
3. Multiply it by $c$, write the product under the next coefficient, and add.
4. Repeat to the end. The last number is the remainder; the others are the quotient's coefficients, one degree lower than the dividend.

Watch the sign: to divide by $x + 4$, use $c = -4$, because $x + 4 = x - (-4)$.

### Example 2

Divide $2x^3 - 7x^2 + 3x + 5$ by $x - 3$.

| | $2$ | $-7$ | $3$ | $5$ |
|---|---|---|---|---|
| $c = 3$ | | $6$ | $-3$ | $0$ |
| | $2$ | $-1$ | $0$ | $5$ |

Bring down 2. $2 \cdot 3 = 6$; $-7 + 6 = -1$. $-1 \cdot 3 = -3$; $3 + (-3) = 0$. $0 \cdot 3 = 0$; $5 + 0 = 5$. Quotient $2x^2 - x + 0$, remainder $5$:

$$2x^3 - 7x^2 + 3x + 5 = (x - 3)(2x^2 - x) + 5.$$

## The remainder theorem

Plug $x = c$ into the division algorithm with divisor $x - c$. The remainder is a constant $r$ (degree less than 1), and

$$f(c) = (c - c)\,q(c) + r = r.$$

This is the **remainder theorem**: *the remainder when $f(x)$ is divided by $x - c$ is $f(c)$.* In Example 2, $f(3) = 54 - 63 + 9 + 5 = 5$, matching the remainder. It works in both directions: synthetic division is often the quickest way to evaluate a polynomial by hand, and evaluating is the quickest way to find a remainder.

### Example 3

Find the remainder when $p(x) = x^4 - 3x^3 + 2x - 5$ is divided by $x + 2$.

The divisor is $x - (-2)$, so the remainder is $p(-2) = 16 - 3(-8) + 2(-2) - 5 = 16 + 24 - 4 - 5 = 31$.

## The factor theorem

A remainder of 0 means $x - c$ divides $f(x)$ evenly. Combining with the remainder theorem gives the **factor theorem**:

$$(x - c) \text{ is a factor of } f(x) \iff f(c) = 0.$$

So "$c$ is a zero," "$c$ is a root of $f(x) = 0$," "$(c, 0)$ is an $x$-intercept" (when $c$ is real) and "$x - c$ is a factor" all say the same thing.

### Example 4

Given that $2$ is a zero of $f(x) = x^3 - 7x + 6$, factor $f$ completely and find all its zeros.

Divide by $x - 2$ synthetically (note the 0 for the missing $x^2$ term):

| | $1$ | $0$ | $-7$ | $6$ |
|---|---|---|---|---|
| $c = 2$ | | $2$ | $4$ | $-6$ |
| | $1$ | $2$ | $-3$ | $0$ |

Remainder 0, as the factor theorem predicts. The quotient is $x^2 + 2x - 3 = (x + 3)(x - 1)$, so

$$f(x) = (x - 2)(x - 1)(x + 3), \qquad \text{zeros } 2,\ 1,\ -3.$$

The quotient after dividing out a known zero is called the **depressed polynomial**; it has degree one less, which is what makes this strategy work.

## Common mistakes

- *Skipping placeholders.* A missing $x^2$ term must appear as 0 in both long and synthetic division.
- *Using the wrong sign of $c$.* Dividing by $x + 5$ means $c = -5$.
- *Subtracting only the first term.* In long division, subtract the whole product (distribute the minus sign).
- *Misreading the synthetic bottom row.* The quotient's degree is one less than the dividend's.
- *Stopping too early or too late.* Stop exactly when the remainder's degree is less than the divisor's.

## Key points

- Division algorithm: $f = d\,q + r$ with $\deg r < \deg d$.
- Synthetic division handles divisors $x - c$ using coefficients only.
- Remainder theorem: dividing by $x - c$ leaves $f(c)$.
- Factor theorem: $x - c$ is a factor exactly when $f(c) = 0$.
- Knowing one zero lets you divide down to a smaller polynomial and find the rest.
