---
id: alg-rational-simplify
module: a2-m5
title: Simplifying, multiplying, and dividing rational expressions
minutes: 30
topics: [Rational expressions]
drills: [alg-d-rat-simplify, alg-d-rat-multiply]
refs: [alg-ref-functions]
---
A rational number is a fraction of integers; a rational expression is a fraction of polynomials. Everything you know about fractions carries over: simplify by cancelling common factors, multiply straight across, divide by multiplying by the reciprocal. The only new ingredients are factoring (from Algebra 1), which is how you find the common factors, and keeping track of the values that would make a denominator zero.

## Rational expressions and their domains

A **rational expression** is a quotient $\dfrac{P}{Q}$ of two polynomials, with $Q$ not the zero polynomial. Examples: $\dfrac{3}{x}$, $\dfrac{x^2 - 4}{x^2 + 5x + 6}$.

Since division by zero is undefined, a rational expression is undefined wherever its denominator is zero. Those values are excluded from its domain; they're called **excluded values** (or restrictions). Find them by setting the denominator equal to zero, before simplifying.

For $\dfrac{x^2 - 4}{x^2 + 5x + 6}$: the denominator $(x + 2)(x + 3)$ is zero at $x = -2$ and $x = -3$, so the domain is all real numbers except $-2$ and $-3$.

## Simplifying

The **fundamental principle of fractions** says $\dfrac{AC}{BC} = \dfrac{A}{B}$ when $C \ne 0$: a common *factor* of the numerator and denominator can be cancelled. To simplify (reduce to **lowest terms**):

1. Factor the numerator and denominator completely.
2. Note the excluded values.
3. Cancel common factors.

### Example 1

Simplify $\dfrac{x^2 - 4}{x^2 + 5x + 6}$.

1. Factor: $\dfrac{(x - 2)(x + 2)}{(x + 3)(x + 2)}$.
2. Excluded values: $x \ne -3, -2$.
3. Cancel $(x + 2)$: $\dfrac{x - 2}{x + 3}$, for $x \ne -3, -2$.

The restriction $x \ne -2$ stays even though $(x + 2)$ is gone: the original expression is undefined there, and the simplified one must describe the same values. On a graph, the original has a **hole** at $x = -2$.

```plot
{"x": [-8, 4], "y": [-6, 8], "functions": [{"f": "(x - 2)/(x + 3)", "label": "y = (x - 2)/(x + 3)"}], "points": [{"at": [-2, -4], "open": true, "label": "hole at x = -2"}], "segments": [{"from": [-3, -6], "to": [-3, 8], "dashed": true}], "caption": "The original expression equals (x - 2)/(x + 3) except at x = -2, where it's undefined; x = -3 is a vertical asymptote"}
```

### Only factors cancel, never terms

$\dfrac{x + 6}{x + 3}$ can't be simplified. Cancelling the $x$'s, or the 3 into the 6, would treat terms as factors. Test with a number: at $x = 1$ the expression is $\tfrac74$, but "cancelling" might give 2.

### Opposite factors

$a - b$ and $b - a$ are opposites: $b - a = -(a - b)$. So $\dfrac{a - b}{b - a} = -1$.

### Example 2

Simplify $\dfrac{12 - 3x}{x^2 - 16}$.

1. Factor: $\dfrac{3(4 - x)}{(x - 4)(x + 4)}$.
2. Write $4 - x = -(x - 4)$: $\dfrac{-3(x - 4)}{(x - 4)(x + 4)}$.
3. Cancel: $-\dfrac{3}{x + 4}$, for $x \ne \pm 4$.

## Multiplying

Multiply numerators and denominators, but factor first and cancel before multiplying out:

$$\frac{A}{B} \cdot \frac{C}{D} = \frac{AC}{BD}.$$

### Example 3

Multiply $\dfrac{x^2 - 9}{2x + 8} \cdot \dfrac{x + 4}{x^2 - 3x}$.

1. Factor everything: $\dfrac{(x - 3)(x + 3)}{2(x + 4)} \cdot \dfrac{x + 4}{x(x - 3)}$.
2. Cancel $(x - 3)$ and $(x + 4)$: $\dfrac{x + 3}{2x}$.
3. Excluded values come from every original denominator: $x \ne -4, 0, 3$.

## Dividing

Dividing by a rational expression means multiplying by its reciprocal:

$$\frac{A}{B} \div \frac{C}{D} = \frac{A}{B} \cdot \frac{D}{C}.$$

When dividing, the divisor's numerator $C$ also can't be zero, since it ends up in the denominator.

### Example 4

Divide $\dfrac{x^2 + x - 6}{x^2 - 1} \div \dfrac{x + 3}{x + 1}$.

1. Flip and multiply: $\dfrac{x^2 + x - 6}{x^2 - 1} \cdot \dfrac{x + 1}{x + 3}$.
2. Factor: $\dfrac{(x + 3)(x - 2)}{(x - 1)(x + 1)} \cdot \dfrac{x + 1}{x + 3}$.
3. Cancel: $\dfrac{x - 2}{x - 1}$, with $x \ne \pm 1, -3$.

## Rational functions

A function given by a rational expression, like $f(x) = \dfrac{1}{x}$, is a **rational function**. Near an excluded value where a factor does not cancel, the function values blow up: the graph has a **vertical asymptote**, a vertical line it approaches but never touches. Where a factor cancels, there's a hole instead. (The graphs of rational functions are studied in depth later in this module.)

## One more example, and a quick check

### Example 5

Simplify $\dfrac{x^3 - 8}{x^2 - 4}$.

1. The numerator is a difference of cubes and the denominator a difference of squares: $\dfrac{(x - 2)(x^2 + 2x + 4)}{(x - 2)(x + 2)}$.
2. Excluded values: $x \ne 2$ and $x \ne -2$.
3. Cancel $(x - 2)$: $\dfrac{x^2 + 2x + 4}{x + 2}$, for $x \ne \pm 2$.

The trinomial $x^2 + 2x + 4$ has discriminant $4 - 16 < 0$, so it doesn't factor further and nothing else cancels.

A quick way to catch errors in any simplification is to test a convenient number that isn't excluded. At $x = 0$, the original is $\tfrac{-8}{-4} = 2$ and the simplified form is $\tfrac42 = 2$. They agree. If they didn't, a step would be wrong. (Agreement at one number doesn't prove the work is right, but disagreement proves it's wrong.)

## Common mistakes

- Cancelling terms instead of factors: $\dfrac{x + 5}{5} \ne x$.
- Forgetting excluded values, or finding them after cancelling and losing some.
- Missing the $-1$ when cancelling opposite factors.
- Flipping the wrong fraction when dividing.
- Multiplying everything out before factoring, which hides the common factors.

## Key points

- Excluded values make an original denominator zero; find them before simplifying.
- Simplify by factoring completely and cancelling common factors only.
- $\dfrac{a - b}{b - a} = -1$.
- Multiply straight across after factoring and cancelling; divide by multiplying by the reciprocal.
