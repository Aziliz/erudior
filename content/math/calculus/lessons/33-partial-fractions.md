---
id: calc-partial-fractions
module: calc-m8
title: Partial fractions
minutes: 35
topics: [Partial fractions]
drills: [calc-d-partial-fractions]
refs: [calc-ref-integrals]
---
## Integrating rational functions

A rational function is a polynomial divided by a polynomial. We can already integrate a few: $\int\frac{1}{x - 3}\,dx = \ln|x - 3| + C$ and $\int\frac{1}{x^2 + 1}\,dx = \arctan x + C$. **Partial fractions** is the algebra that breaks any rational function into a sum of such simple pieces. It's adding fractions run backward: since
$$\frac{2}{x - 1} + \frac{3}{x + 2} = \frac{5x + 1}{(x - 1)(x + 2)},$$
we can integrate the right side by splitting it into the left side. Partial fractions is BC and college Calculus II material, and it reappears in logistic growth (Lesson 37) and telescoping series (Lesson 38).

## Step 0: is it proper?

A rational function $\frac{P(x)}{Q(x)}$ is **proper** if $\deg P < \deg Q$. If not, do polynomial long division first to get (polynomial) + (proper fraction).

### Example 1

Find $\displaystyle\int\frac{x^2 + 1}{x - 1}\,dx$.

Divide: $x^2 + 1 = (x - 1)(x + 1) + 2$, so $\dfrac{x^2 + 1}{x - 1} = x + 1 + \dfrac{2}{x - 1}$. Then
$$\int\left(x + 1 + \frac{2}{x - 1}\right)dx = \mathbf{\frac{x^2}{2} + x + 2\ln|x - 1| + C}.$$

## Step 1: factor the denominator

Every real polynomial factors into linear factors $(ax + b)$ and irreducible quadratics $(ax^2 + bx + c$ with $b^2 - 4ac < 0)$. Then the decomposition has one term for each factor:

| Factor in $Q(x)$ | Terms in the decomposition |
|---|---|
| distinct linear $(x - r)$ | $\dfrac{A}{x - r}$ |
| repeated linear $(x - r)^k$ | $\dfrac{A_1}{x - r} + \dfrac{A_2}{(x - r)^2} + \dots + \dfrac{A_k}{(x - r)^k}$ |
| irreducible quadratic $(x^2 + bx + c)$ | $\dfrac{Bx + C}{x^2 + bx + c}$ |

## Step 2: find the constants

Multiply both sides by the denominator to clear fractions. Then either

- *plug in convenient values* of $x$ (the roots of the factors make terms vanish), or
- *match coefficients* of like powers of $x$ and solve the system.

The root-plugging shortcut is fastest for distinct linear factors (it's sometimes called the cover-up method).

### Example 2 (distinct linear factors)

Find $\displaystyle\int\frac{5x + 1}{x^2 + x - 2}\,dx$.

Factor: $x^2 + x - 2 = (x - 1)(x + 2)$. Set up
$$\frac{5x + 1}{(x - 1)(x + 2)} = \frac{A}{x - 1} + \frac{B}{x + 2}.$$
Multiply through: $5x + 1 = A(x + 2) + B(x - 1)$.
- $x = 1$: $6 = 3A$, so $A = 2$.
- $x = -2$: $-9 = -3B$, so $B = 3$.

$$\int\left(\frac{2}{x - 1} + \frac{3}{x + 2}\right)dx = \mathbf{2\ln|x - 1| + 3\ln|x + 2| + C}.$$

### Example 3 (repeated linear factor)

Find $\displaystyle\int\frac{x + 5}{x(x + 1)^2}\,dx$.

Set up three terms (one for $x$, two for $(x + 1)^2$):
$$\frac{x + 5}{x(x + 1)^2} = \frac Ax + \frac{B}{x + 1} + \frac{C}{(x + 1)^2}.$$
Clear: $x + 5 = A(x + 1)^2 + Bx(x + 1) + Cx$.
- $x = 0$: $5 = A$.
- $x = -1$: $4 = -C$, so $C = -4$.
- Compare $x^2$ coefficients: $0 = A + B$, so $B = -5$.

$$\int\left(\frac5x - \frac{5}{x + 1} - \frac{4}{(x + 1)^2}\right)dx = \mathbf{5\ln|x| - 5\ln|x + 1| + \frac{4}{x + 1} + C}.$$

(The last term: $\int-4(x + 1)^{-2}dx = 4(x + 1)^{-1}$.)

### Example 4 (irreducible quadratic)

Find $\displaystyle\int\frac{2x^2 + 3}{x(x^2 + 1)}\,dx$.

Set up: $\dfrac{2x^2 + 3}{x(x^2 + 1)} = \dfrac Ax + \dfrac{Bx + C}{x^2 + 1}$. Clear: $2x^2 + 3 = A(x^2 + 1) + (Bx + C)x$.
- $x = 0$: $A = 3$.
- $x^2$ coefficients: $2 = A + B$, so $B = -1$.
- $x$ coefficients: $0 = C$.

$$\int\left(\frac3x - \frac{x}{x^2 + 1}\right)dx = \mathbf{3\ln|x| - \tfrac12\ln(x^2 + 1) + C}.$$

A quadratic term $\frac{Bx + C}{x^2 + a^2}$ splits into a log part ($\frac{Bx}{x^2 + a^2}$, by $u$-substitution) and an arctan part ($\frac{C}{x^2 + a^2}$).

### Example 5 (a definite integral)

Evaluate $\displaystyle\int_2^4\frac{dx}{x^2 - 1}$.

$\frac{1}{(x - 1)(x + 1)} = \frac{1/2}{x - 1} - \frac{1/2}{x + 1}$, so
$$\int_2^4\frac{dx}{x^2 - 1} = \frac12\Big[\ln|x - 1| - \ln|x + 1|\Big]_2^4 = \frac12\left[\ln\frac35 - \ln\frac13\right] = \frac12\ln\frac95 \approx 0.294.$$

## Why it always works

The algebra fact behind the method: every proper rational function can be written uniquely as a sum of the partial fractions in the table. So integrating any rational function reduces to three integrals you already know: $\int\frac{dx}{x - r}$ (log), $\int\frac{dx}{(x - r)^k}$ (power), and quadratic terms (log + arctan). In principle every rational function has an elementary antiderivative; the hard part in practice is factoring $Q(x)$.

## Common mistakes

- *Skipping long division* when the fraction isn't proper. The decomposition only exists for proper fractions.
- *Too few terms for repeated factors.* $(x + 1)^2$ needs both $\frac{B}{x + 1}$ and $\frac{C}{(x + 1)^2}$.
- *A constant numerator over a quadratic.* Use $Bx + C$, not just $B$.
- **Integrating $\frac{1}{(x + 1)^2}$ as a log.** It's a power: $-\frac{1}{x + 1}$.
- *Dropping absolute values* in the logs.

## Key points

- Make the fraction proper (long division), factor the denominator, set up one term per factor (more for repeated factors), solve for constants, integrate.
- Linear factors give logs; repeated linear factors also give negative powers; irreducible quadratics give logs and arctangents.
- Plugging in roots finds constants quickly; matching coefficients finds the rest.
