---
id: pc-partial-fractions
module: pc-m6
title: Partial fraction decomposition
minutes: 30
topics: [Partial fractions]
drills: [pc-pf-linear, pc-pf-repeated]
refs: [pc-ref-matrices-series]
---
## Running addition backward

You know how to add fractions: $\dfrac{2}{x - 2} + \dfrac{3}{x + 1} = \dfrac{5x - 4}{(x - 2)(x + 1)}$. **Partial fraction decomposition** runs this in reverse: it splits a complicated rational expression into a sum of simpler ones. In calculus this is the standard technique for integrating rational functions, and it's also used to sum certain series and in engineering (Laplace transforms). It belongs in this module because finding the unknown numerators is a linear system.

## When it applies

Start with a rational expression $\dfrac{P(x)}{Q(x)}$ in lowest terms.

1. If it is **improper** ($\deg P \ge \deg Q$), first divide (Lesson 9) to get a polynomial plus a **proper** fraction ($\deg P < \deg Q$). Decompose only the proper part.
2. Factor $Q(x)$ completely into linear factors and irreducible quadratics (quadratics with no real zeros, such as $x^2 + 4$).
3. Write one term (or a group of terms) for each factor, as in the table, with unknown constants.
4. Find the constants.

| Factor in $Q(x)$ | Terms in the decomposition |
|---|---|
| $(x - a)$ | $\dfrac{A}{x - a}$ |
| $(x - a)^k$ | $\dfrac{A_1}{x - a} + \dfrac{A_2}{(x - a)^2} + \dots + \dfrac{A_k}{(x - a)^k}$ |
| $(x^2 + bx + c)$, irreducible | $\dfrac{Bx + C}{x^2 + bx + c}$ |

Why a linear numerator over a quadratic? The numerator of each term must be allowed one degree less than its denominator, otherwise there aren't enough unknowns to match every possible numerator. A repeated factor needs every power because, for instance, $\frac{x}{(x - 1)^2} = \frac{1}{x - 1} + \frac{1}{(x - 1)^2}$ can't be written with the squared denominator alone and a constant on top.

## Finding the constants

Multiply both sides by $Q(x)$ to clear denominators. You get a polynomial identity, true for every $x$. Then either:

- substitute convenient values of $x$ (the zeros of the linear factors make most terms vanish), or
- expand and match coefficients of each power of $x$, which gives a linear system.

Often a mix of the two is fastest.

### Example 1: distinct linear factors

Decompose $\dfrac{5x - 4}{(x - 2)(x + 1)}$.

Write $\dfrac{5x - 4}{(x - 2)(x + 1)} = \dfrac{A}{x - 2} + \dfrac{B}{x + 1}$ and multiply by $(x - 2)(x + 1)$:

$$5x - 4 = A(x + 1) + B(x - 2).$$

- $x = 2$: $6 = 3A$, so $A = 2$.
- $x = -1$: $-9 = -3B$, so $B = 3$.

$$\frac{5x - 4}{(x - 2)(x + 1)} = \frac{2}{x - 2} + \frac{3}{x + 1}.$$

Check by recombining: $\frac{2(x + 1) + 3(x - 2)}{(x - 2)(x + 1)} = \frac{5x - 4}{(x-2)(x+1)}$. ✓

### Example 2: a repeated factor

Decompose $\dfrac{x + 7}{(x - 1)^2(x + 3)}$.

Set up $\dfrac{A}{x - 1} + \dfrac{B}{(x - 1)^2} + \dfrac{C}{x + 3}$. Clearing denominators:

$$x + 7 = A(x - 1)(x + 3) + B(x + 3) + C(x - 1)^2.$$

- $x = 1$: $8 = 4B$, so $B = 2$.
- $x = -3$: $4 = 16C$, so $C = \tfrac14$.
- No value kills the other terms to isolate $A$, so match the $x^2$ coefficients: the left side has $0x^2$; the right side has $(A + C)x^2$. So $A = -C = -\tfrac14$.

$$\frac{x + 7}{(x - 1)^2(x + 3)} = \frac{-1/4}{x - 1} + \frac{2}{(x - 1)^2} + \frac{1/4}{x + 3}.$$

### Example 3: an irreducible quadratic factor

Decompose $\dfrac{4x^2 - 3x + 5}{(x - 1)(x^2 + 2)}$.

$x^2 + 2$ has no real zeros, so it gets a linear numerator: $\dfrac{A}{x - 1} + \dfrac{Bx + C}{x^2 + 2}$.

$$4x^2 - 3x + 5 = A(x^2 + 2) + (Bx + C)(x - 1).$$

- $x = 1$: $6 = 3A$, so $A = 2$.
- $x^2$ coefficients: $4 = A + B$, so $B = 2$.
- Constants: $5 = 2A - C$, so $C = -1$.

$$\frac{4x^2 - 3x + 5}{(x - 1)(x^2 + 2)} = \frac{2}{x - 1} + \frac{2x - 1}{x^2 + 2}.$$

Check with the $x$ coefficients, which we didn't use: the right side gives $-B + C = -3$. ✓

### Example 4: an improper fraction

Decompose $\dfrac{x^3 + 2x}{x^2 - 1}$.

The degrees are $3 \ge 2$, so divide first: $x^3 + 2x = x(x^2 - 1) + 3x$, so the expression is $x + \dfrac{3x}{x^2 - 1}$. Now decompose the proper part with $x^2 - 1 = (x - 1)(x + 1)$: $3x = A(x + 1) + B(x - 1)$ gives $A = \tfrac32$ (at $x = 1$) and $B = \tfrac32$ (at $x = -1$). So

$$\frac{x^3 + 2x}{x^2 - 1} = x + \frac{3/2}{x - 1} + \frac{3/2}{x + 1}.$$

## A telescoping preview

Partial fractions explain a neat sum: $\dfrac{1}{k(k + 1)} = \dfrac1k - \dfrac{1}{k + 1}$. Adding these for $k = 1$ to $n$, almost everything cancels: $\left(1 - \tfrac12\right) + \left(\tfrac12 - \tfrac13\right) + \dots + \left(\tfrac1n - \tfrac{1}{n+1}\right) = 1 - \dfrac{1}{n + 1}$. Sums like this, called telescoping sums, come back when calculus studies infinite series.

## Common mistakes

- *Decomposing an improper fraction without dividing first.*
- *Leaving out powers of a repeated factor.* $(x - a)^2$ needs both $\frac{A}{x - a}$ and $\frac{B}{(x - a)^2}$.
- *A constant over an irreducible quadratic.* It needs $Bx + C$.
- *Factoring incompletely.* $x^2 - 1$ factors; $x^2 + 1$ does not (over the reals).
- *Not checking.* Recombine, or test one value of $x$ you didn't use.

## Key points

- Divide first if the fraction is improper.
- Each $(x - a)^k$ contributes $k$ terms; each irreducible quadratic contributes $\frac{Bx + C}{\text{quadratic}}$.
- Clear denominators, then substitute zeros of linear factors and/or match coefficients.
- The coefficient matching is a linear system, solvable with the methods of this module.
- Check by recombining or by plugging in a test value.
