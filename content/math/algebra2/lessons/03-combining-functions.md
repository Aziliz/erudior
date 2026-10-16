---
id: a2-composition
module: a2-m1
title: Combining and composing functions
minutes: 35
topics: [Function operations, Composition]
drills: [a2-d-function-ops, a2-d-compose-eval, a2-d-compose-expr]
refs: [alg-ref-functions]
---
Functions can be built from other functions. Two can be added or multiplied output by output, the way profit is revenue minus cost. More interesting, one function's output can be fed into another, the way a price goes through a discount and then a sales tax. That second operation, composition, is the main subject of this lesson. It's also the key to the next lesson, because an inverse function is defined by what happens when you compose it with the original.

## Sum, difference, product and quotient

For two functions $f$ and $g$, define new functions by combining their outputs at each input:

| Operation | Definition |
|---|---|
| Sum | $(f + g)(x) = f(x) + g(x)$ |
| Difference | $(f - g)(x) = f(x) - g(x)$ |
| Product | $(fg)(x) = f(x) \cdot g(x)$ |
| Quotient | $\left(\dfrac{f}{g}\right)(x) = \dfrac{f(x)}{g(x)}$, where $g(x) \ne 0$ |

An input is only allowed if both $f(x)$ and $g(x)$ exist, so the domain of each new function is the overlap of the two domains. The quotient also excludes every $x$ where $g(x) = 0$.

### Example 1

Let $f(x) = x^2 - 4$ and $g(x) = x + 2$. Find $f + g$, $f - g$, $fg$ and $\dfrac fg$, with any domain restrictions.

1. Sum: $(x^2 - 4) + (x + 2) = x^2 + x - 2$.
2. Difference: $(x^2 - 4) - (x + 2) = x^2 - x - 6$. The parentheses matter: the whole of $g$ is subtracted, including the $+2$.
3. Product: $(x^2 - 4)(x + 2) = x^3 + 2x^2 - 4x - 8$.
4. Quotient: $\dfrac{x^2 - 4}{x + 2} = \dfrac{(x - 2)(x + 2)}{x + 2} = x - 2$, but only for $x \ne -2$, because $g(-2) = 0$.

The quotient looks like the line $y = x - 2$, but its graph has a hole at $(-2, -4)$. The domain is decided by the original functions before any simplifying.

## Composition

The **composition** of $f$ with $g$ is the function

$$(f \circ g)(x) = f(g(x)).$$

Read $f \circ g$ as "$f$ of $g$" or "$f$ after $g$." The order is right to left: $g$ acts on $x$ first, and then $f$ acts on the result. Picture two machines in a row: $x$ goes into $g$, and whatever comes out goes into $f$. The new function is called a **composite function**.

```shape
{"polygons": [{"points": [[2, 0], [4, 0], [4, 1.5], [2, 1.5]]}, {"points": [[6, 0], [8, 0], [8, 1.5], [6, 1.5]]}], "segments": [{"from": [0, 0.75], "to": [2, 0.75], "arrow": true}, {"from": [4, 0.75], "to": [6, 0.75], "arrow": true}, {"from": [8, 0.75], "to": [10, 0.75], "arrow": true}], "labels": [{"at": [3, 0.75], "text": "g"}, {"at": [7, 0.75], "text": "f"}, {"at": [1, 1.2], "text": "x"}, {"at": [5, 1.2], "text": "g(x)"}, {"at": [9, 1.2], "text": "f(g(x))"}]}
```

To evaluate a composition at a number, work from the inside out. To find a formula, substitute the entire expression $g(x)$ for every $x$ in $f$.

Composition is usually not commutative: $f(g(x))$ and $g(f(x))$ are generally different. With $f(x) = x^2$ and $g(x) = x + 3$, $f(g(x)) = (x + 3)^2$ (add 3, then square) but $g(f(x)) = x^2 + 3$ (square, then add 3).

### Example 2

Let $f(x) = 2x - 1$ and $g(x) = x^2 + 1$. Find $(f \circ g)(2)$, $(g \circ f)(2)$, and formulas for $f(g(x))$ and $g(f(x))$.

1. $(f \circ g)(2) = f(g(2))$. Inside first: $g(2) = 4 + 1 = 5$. Then $f(5) = 10 - 1 = 9$.
2. $(g \circ f)(2) = g(f(2))$. Inside first: $f(2) = 3$. Then $g(3) = 9 + 1 = 10$.
3. $f(g(x)) = 2(x^2 + 1) - 1 = 2x^2 + 1$. Check at $x = 2$: $2(4) + 1 = 9$. ✓
4. $g(f(x)) = (2x - 1)^2 + 1 = 4x^2 - 4x + 2$. Check at $x = 2$: $16 - 8 + 2 = 10$. ✓

Checking a formula against a value you computed directly is a quick way to catch errors.

Compositions can also be read from tables or graphs. If a table says $g(1) = 4$ and $f(4) = -2$, then $f(g(1)) = f(4) = -2$, whatever the formulas are.

### Example 3

A store is taking 20% off everything, and you also have a \$10 coupon. Let $D(x) = 0.8x$ (the discount) and $C(x) = x - 10$ (the coupon), where $x$ is a price in dollars. Which order is better for a \$50 item?

1. Discount first, then coupon: $C(D(x)) = 0.8x - 10$. At 50: $40 - 10 = 30$ dollars.
2. Coupon first, then discount: $D(C(x)) = 0.8(x - 10) = 0.8x - 8$. At 50: $0.8(40) = 32$ dollars.
3. Taking the discount first is better by \$2 for every price, since $0.8x - 10$ is always 2 less than $0.8x - 8$. The 20% applies to the coupon's \$10 if the coupon comes first, which shrinks its value to \$8.

## The domain of a composition

For $f(g(x))$ to exist, two things must be true:

1. $x$ is in the domain of $g$ (so $g(x)$ exists), and
2. $g(x)$ is in the domain of $f$ (so $f$ can accept it).

Simplifying the final formula can hide the first condition, so find the domain from these two conditions, not just from the formula you end up with.

### Example 4

Let $f(x) = \dfrac{1}{x - 2}$ and $g(x) = \sqrt{x}$. Find $f(g(x))$ and its domain.

1. Formula: $f(g(x)) = \dfrac{1}{\sqrt{x} - 2}$.
2. Condition 1: $g(x) = \sqrt x$ needs $x \ge 0$.
3. Condition 2: $f$ can't accept 2, so we need $\sqrt x \ne 2$, which means $x \ne 4$.
4. Domain: $x \ge 0$ and $x \ne 4$, or in interval notation $[0, 4) \cup (4, \infty)$.

Compare $g(f(x)) = \sqrt{\dfrac{1}{x - 2}}$, which needs $x \ne 2$ and $\dfrac{1}{x - 2} \ge 0$. A fraction with numerator 1 is positive exactly when its denominator is positive, so the domain is $x > 2$.

## Decomposing a function

Going the other way, you can **decompose** a complicated function: write it as $f(g(x))$ with simpler pieces. Look for an "inside" expression that the formula does something to. For $h(x) = (3x + 1)^5$, the inside is $3x + 1$ and the outside action is "raise to the 5th power," so $g(x) = 3x + 1$ and $f(x) = x^5$. For $h(x) = \sqrt{x^2 + 9}$, take $g(x) = x^2 + 9$ and $f(x) = \sqrt{x}$.

Decompositions aren't unique ($h(x) = (3x + 1)^5$ is also $f(g(x))$ with $g(x) = 3x$ and $f(x) = (x + 1)^5$), but the natural choice is usually the inside expression. This skill becomes essential in calculus, where the chain rule differentiates composite functions.

## Common mistakes

- Doing the composition in the wrong order. In $f(g(x))$, $g$ goes first, even though $f$ is written first.
- Multiplying instead of composing: $f(g(x))$ is not $f(x) \cdot g(x)$.
- Substituting $g(x)$ for only one of the $x$'s in $f$. Every $x$ gets replaced.
- Forgetting parentheses when subtracting or squaring: $(f - g)(x) = x^2 - 4 - (x + 2)$, and $f(2x - 1)$ with $f(x) = x^2$ is $(2x - 1)^2$, not $2x^2 - 1$.
- Finding the domain from the simplified formula alone. Restrictions from the inner function, or from a cancelled factor in a quotient, still apply.

## Key points

- $f + g$, $f - g$, $fg$ and $\tfrac fg$ combine outputs; their domain is where both $f$ and $g$ are defined, and $\tfrac fg$ also needs $g(x) \ne 0$.
- $(f \circ g)(x) = f(g(x))$: apply $g$ first, then $f$. Evaluate from the inside out.
- Usually $f(g(x)) \ne g(f(x))$.
- The domain of $f \circ g$: $x$ must be in the domain of $g$, and $g(x)$ must be in the domain of $f$.
- Decompose by spotting an inside expression $g(x)$ and an outside action $f$.
