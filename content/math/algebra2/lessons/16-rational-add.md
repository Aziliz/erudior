---
id: alg-rational-add
module: a2-m5
title: Adding and subtracting rational expressions; complex fractions
minutes: 30
topics: [Rational expressions, Complex fractions]
drills: [alg-d-rat-add, alg-d-complex-fraction]
refs: [alg-ref-functions]
---
Adding fractions requires a common denominator, and the same is true for rational expressions. This lesson builds the least common denominator from factored denominators, adds and subtracts, and then simplifies complex fractions, which are fractions with fractions inside them. These skills set up the rational equations of the next lesson.

## Same denominator

Add or subtract the numerators and keep the denominator, then simplify:

$$\frac{A}{C} + \frac{B}{C} = \frac{A + B}{C}, \qquad \frac{A}{C} - \frac{B}{C} = \frac{A - B}{C}.$$

When subtracting, put the second numerator in parentheses: the minus sign applies to all of it.

### Example 1

Simplify $\dfrac{3x + 1}{x - 2} - \dfrac{x + 5}{x - 2}$.

1. $\dfrac{(3x + 1) - (x + 5)}{x - 2} = \dfrac{2x - 4}{x - 2}$.
2. Factor and cancel: $\dfrac{2(x - 2)}{x - 2} = 2$, for $x \ne 2$.

## The least common denominator

The **least common denominator** (LCD) of several rational expressions is the simplest expression that every denominator divides into. To find it:

1. Factor each denominator completely.
2. Take each distinct factor the greatest number of times it appears in any single denominator.

For denominators $x^2 - 9 = (x - 3)(x + 3)$ and $x^2 + 6x + 9 = (x + 3)^2$, the LCD is $(x - 3)(x + 3)^2$.

## Different denominators

1. Factor the denominators and find the LCD.
2. Rewrite each fraction with the LCD by multiplying top and bottom by the missing factors.
3. Add or subtract the numerators.
4. Simplify the numerator and factor it to see if anything cancels.

### Example 2

Simplify $\dfrac{2}{x} + \dfrac{3}{x + 1}$.

1. LCD: $x(x + 1)$.
2. Rewrite: $\dfrac{2(x + 1)}{x(x + 1)} + \dfrac{3x}{x(x + 1)}$.
3. Add: $\dfrac{2x + 2 + 3x}{x(x + 1)} = \dfrac{5x + 2}{x(x + 1)}$.

### Example 3

Simplify $\dfrac{x}{x^2 - 4} - \dfrac{1}{x - 2}$.

1. Factor: $x^2 - 4 = (x - 2)(x + 2)$, so the LCD is $(x - 2)(x + 2)$.
2. Rewrite the second fraction: $\dfrac{1}{x - 2} = \dfrac{x + 2}{(x - 2)(x + 2)}$.
3. Subtract, with parentheses: $\dfrac{x - (x + 2)}{(x - 2)(x + 2)} = \dfrac{-2}{(x - 2)(x + 2)}$.

Without the parentheses you'd get $x - x + 2 = 2$, the wrong sign.

### Example 4

Simplify $\dfrac{5}{x - 3} + \dfrac{2}{3 - x}$.

The denominators are opposites. Rewrite $\dfrac{2}{3 - x} = \dfrac{-2}{x - 3}$. Then the sum is $\dfrac{5 - 2}{x - 3} = \dfrac{3}{x - 3}$.

## Complex fractions

A **complex fraction** has a fraction in its numerator, its denominator, or both, like

$$\frac{\dfrac{1}{x} + \dfrac{1}{2}}{\dfrac{1}{x^2} - \dfrac{1}{4}}.$$

There are two methods.

*Method 1: multiply by the LCD.* Multiply the top and bottom of the big fraction by the LCD of all the small fractions. This clears every inner denominator at once.

*Method 2: simplify, then divide.* Combine the numerator into one fraction and the denominator into one fraction, then divide by multiplying by the reciprocal.

### Example 5

Simplify the complex fraction above.

Method 1: the small denominators are $x$, 2, $x^2$ and 4, with LCD $4x^2$.

1. Multiply top and bottom by $4x^2$: numerator $4x + 2x^2$; denominator $4 - x^2$.
2. Factor: $\dfrac{2x(2 + x)}{(2 - x)(2 + x)}$.
3. Cancel $(2 + x)$: $\dfrac{2x}{2 - x}$.

Method 2 gives the same: the top is $\dfrac{2 + x}{2x}$ and the bottom is $\dfrac{4 - x^2}{4x^2}$; dividing, $\dfrac{2 + x}{2x} \cdot \dfrac{4x^2}{(2 - x)(2 + x)} = \dfrac{2x}{2 - x}$.

### Example 6

Simplify $\dfrac{1 - \dfrac{4}{x^2}}{1 + \dfrac{2}{x}}$.

1. LCD $x^2$. Multiply top and bottom: $\dfrac{x^2 - 4}{x^2 + 2x}$.
2. Factor: $\dfrac{(x - 2)(x + 2)}{x(x + 2)} = \dfrac{x - 2}{x}$.

Complex fractions show up in physics and finance formulas. For example, the combined resistance of two resistors in parallel is $R = \dfrac{1}{\dfrac{1}{R_1} + \dfrac{1}{R_2}}$; multiplying top and bottom by $R_1 R_2$ gives the tidier $R = \dfrac{R_1R_2}{R_1 + R_2}$.

## Denominators with several factors

### Example 7

Simplify $\dfrac{2}{x^2 - x} + \dfrac{3}{x^2 - 1}$.

1. Factor: $x^2 - x = x(x - 1)$ and $x^2 - 1 = (x - 1)(x + 1)$.
2. LCD: every distinct factor to its highest power, $x(x - 1)(x + 1)$.
3. Rewrite: the first fraction needs a factor $(x + 1)$ and the second needs $x$:
$$\frac{2(x + 1)}{x(x - 1)(x + 1)} + \frac{3x}{x(x - 1)(x + 1)}.$$
4. Add: $\dfrac{2x + 2 + 3x}{x(x - 1)(x + 1)} = \dfrac{5x + 2}{x(x - 1)(x + 1)}$.
5. The numerator $5x + 2$ shares no factor with the denominator, so this is fully simplified.

Using the full product $x(x - 1)(x - 1)(x + 1)$ as a common denominator would also work, but then you'd have to cancel an extra $(x - 1)$ at the end.

## Common mistakes

- Adding denominators: $\dfrac{1}{x} + \dfrac{1}{y} \ne \dfrac{2}{x + y}$. The correct sum is $\dfrac{x + y}{xy}$.
- Forgetting to distribute a subtraction sign across the whole second numerator.
- Using the product of the denominators when a smaller LCD exists, which leads to more simplifying later (it's not wrong, just harder).
- In complex fractions, multiplying only some terms by the LCD.
- Not simplifying the final answer by factoring the numerator.

## Key points

- Same denominator: combine numerators; use parentheses when subtracting.
- LCD: each distinct factor to its highest power among the denominators.
- Rewrite each fraction over the LCD, combine, then factor and simplify.
- Complex fractions: multiply top and bottom by the LCD of all inner fractions, or combine and divide.
