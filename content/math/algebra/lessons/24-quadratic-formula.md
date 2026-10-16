---
id: alg-quad-formula
module: alg-m6
title: The quadratic formula and the discriminant
minutes: 30
topics: [Quadratic formula, Discriminant]
drills: [alg-d-quad-formula, alg-d-discriminant]
refs: [alg-ref-polynomials]
---
Completing the square solves any quadratic, but doing it from scratch each time is slow. If we complete the square once on the general equation $ax^2 + bx + c = 0$, we get a formula that solves every quadratic by substitution. This lesson derives the quadratic formula, shows how to use it, and explains how one piece of it, the discriminant, tells you in advance what kind of solutions to expect.

## Deriving the formula

Start with $ax^2 + bx + c = 0$, $a \ne 0$, and follow the completing-the-square steps from Lesson 23.

1. Divide by $a$: $x^2 + \dfrac{b}{a}x + \dfrac{c}{a} = 0$.
2. Move the constant: $x^2 + \dfrac{b}{a}x = -\dfrac{c}{a}$.
3. Half of $\tfrac{b}{a}$ is $\tfrac{b}{2a}$; add its square, $\tfrac{b^2}{4a^2}$, to both sides:
$$x^2 + \frac{b}{a}x + \frac{b^2}{4a^2} = \frac{b^2}{4a^2} - \frac{c}{a} = \frac{b^2 - 4ac}{4a^2}.$$
4. The left side is a perfect square: $\left(x + \dfrac{b}{2a}\right)^2 = \dfrac{b^2 - 4ac}{4a^2}$.
5. Square root property: $x + \dfrac{b}{2a} = \pm\dfrac{\sqrt{b^2 - 4ac}}{2a}$.
6. Subtract $\tfrac{b}{2a}$:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}.$$

This is the **quadratic formula**. (In step 5, $\sqrt{4a^2} = 2|a|$, but the $\pm$ already covers both signs, so we can write $2a$.)

## Using the formula

1. Write the equation in standard form $ax^2 + bx + c = 0$.
2. Identify $a$, $b$ and $c$, including their signs.
3. Substitute into the formula, using parentheses around negative values.
4. Simplify, especially the square root.

### Example 1

Solve $2x^2 + 3x - 5 = 0$.

1. $a = 2$, $b = 3$, $c = -5$.
2. $b^2 - 4ac = 9 - 4(2)(-5) = 9 + 40 = 49$.
3. $x = \dfrac{-3 \pm \sqrt{49}}{2(2)} = \dfrac{-3 \pm 7}{4}$.
4. $x = \dfrac{4}{4} = 1$ or $x = \dfrac{-10}{4} = -\dfrac52$.

Since 49 is a perfect square, this equation could also have been factored: $(2x + 5)(x - 1) = 0$.

### Example 2

Solve $x^2 - 4x - 1 = 0$. Give exact and approximate answers.

1. $a = 1$, $b = -4$, $c = -1$.
2. $b^2 - 4ac = 16 + 4 = 20$.
3. $x = \dfrac{4 \pm \sqrt{20}}{2} = \dfrac{4 \pm 2\sqrt5}{2} = 2 \pm \sqrt5$.
4. Approximately $x \approx 4.236$ and $x \approx -0.236$.

When simplifying, divide every term of the numerator by the common factor, not just one: $\tfrac{4 \pm 2\sqrt5}{2} = 2 \pm \sqrt5$, not $2 \pm 2\sqrt5$.

### Example 3

Solve $3x^2 = 2x + 4$.

1. Standard form first: $3x^2 - 2x - 4 = 0$, so $a = 3$, $b = -2$, $c = -4$.
2. $b^2 - 4ac = 4 + 48 = 52$, and $\sqrt{52} = 2\sqrt{13}$.
3. $x = \dfrac{2 \pm 2\sqrt{13}}{6} = \dfrac{1 \pm \sqrt{13}}{3}$.

The most common error is plugging $b = 2$ instead of $b = -2$ because the equation wasn't put in standard form first.

## The discriminant

The expression under the square root, $b^2 - 4ac$, is the **discriminant**, often written $D$ or $\Delta$. Its sign decides what the $\pm\sqrt{D}$ part does:

| Discriminant | Real solutions | Graph of $y = ax^2 + bx + c$ |
|---|---|---|
| $D > 0$ | two different real roots | crosses the $x$-axis twice |
| $D = 0$ | one real root (a double root), $x = -\tfrac{b}{2a}$ | touches the $x$-axis once |
| $D < 0$ | no real roots (two complex roots, Lesson 29) | doesn't meet the $x$-axis |

If the coefficients are integers and $D$ is a perfect square, the roots are rational and the quadratic factors over the integers. That gives a quick test of whether factoring is worth trying.

```plot
{"x": [-4, 4], "y": [-4, 6], "functions": [{"f": "x^2 - 2", "from": -3.2, "to": 3.2}, {"f": "x^2", "dashed": true, "from": -2.5, "to": 2.5}, {"f": "x^2 + 2", "from": -2, "to": 2}], "labels": [{"at": [0.9, -2.5], "text": "D > 0"}, {"at": [0.9, -0.5], "text": "D = 0"}, {"at": [0.9, 1.5], "text": "D < 0"}], "caption": "y = x² - 2, x², x² + 2: two, one and no x-intercepts"}
```

### Example 4

Without solving, describe the roots of $4x^2 - 12x + 9 = 0$, $x^2 + x + 1 = 0$ and $2x^2 - 7x + 3 = 0$.

1. $D = 144 - 144 = 0$: one double root, $x = \tfrac{12}{8} = \tfrac32$.
2. $D = 1 - 4 = -3 < 0$: no real roots.
3. $D = 49 - 24 = 25 > 0$, a perfect square: two rational roots ($3$ and $\tfrac12$).

### Example 5

For what values of $k$ does $x^2 + kx + 9 = 0$ have exactly one real solution?

One solution means $D = 0$: $k^2 - 36 = 0$, so $k = 6$ or $k = -6$. (Then the equation is $(x + 3)^2 = 0$ or $(x - 3)^2 = 0$.)

## Choosing a method

| Equation looks like | Best method |
|---|---|
| $x^2 = k$ or $(x + h)^2 = k$ | square root property |
| factors easily (check: $D$ a perfect square) | factoring |
| $x^2 + bx + c$ with $b$ even, if you want vertex form too | completing the square |
| anything else | quadratic formula |

The formula always works, so when in doubt, use it.

## Common mistakes

- Not writing the equation in standard form before reading off $a$, $b$, $c$.
- Sign errors: with $b = -4$, $-b = 4$ and $b^2 = 16$ (never $-16$).
- Writing the formula with only $-b$ over $2a$: the fraction bar covers the whole numerator, $-b \pm \sqrt{b^2 - 4ac}$.
- Simplifying $\tfrac{4 \pm 2\sqrt5}{2}$ as $2 \pm 2\sqrt5$.
- Concluding "no solution" when $D < 0$ without saying "no real solution."

## Key points

- Quadratic formula: $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, from completing the square on $ax^2 + bx + c = 0$.
- Put the equation in standard form and include signs when identifying $a$, $b$, $c$.
- Discriminant $D = b^2 - 4ac$: positive gives two real roots, zero gives one, negative gives none (real).
- A perfect-square discriminant (integer coefficients) means rational roots and the quadratic factors.
