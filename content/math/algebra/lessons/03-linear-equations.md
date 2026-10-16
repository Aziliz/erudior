---
id: alg-linear-eq
module: alg-m1
title: Solving linear equations
minutes: 30
topics: [Linear equations]
drills: [alg-d-two-step, alg-d-both-sides, alg-d-eq-fractions]
refs: [alg-ref-equations]
---
Now that you can simplify expressions, you can solve equations. An equation says two expressions are equal; solving it means finding every value of the variable that makes that statement true. This lesson handles **linear equations**, the ones where the variable appears only to the first power, like $3x - 7 = 11$ or $2(x + 1) = 5x - 4$. Everything later in algebra builds on doing this quickly and reliably.

## What it means to solve

A **solution** of an equation is a value of the variable that makes it true. $x = 6$ is a solution of $3x - 7 = 11$ because $3(6) - 7 = 11$. The set of all solutions is the **solution set**.

Two equations are **equivalent equations** when they have the same solution set. Solving is a chain of equivalent equations, each simpler than the last, until the variable stands alone: $x = \text{number}$.

## The properties of equality

What moves keep an equation equivalent? Think of a balance scale: whatever you do to one side, you must do to the other.

- **Addition property of equality**: if $a = b$, then $a + c = b + c$ (and likewise $a - c = b - c$).
- **Multiplication property of equality**: if $a = b$, then $ac = bc$, and $\tfrac{a}{c} = \tfrac{b}{c}$ for $c \ne 0$.

The restriction $c \ne 0$ matters. Multiplying both sides by 0 turns any equation into $0 = 0$ and destroys the information, and dividing by 0 is undefined.

Each property undoes an operation. Addition undoes subtraction, division undoes multiplication. To isolate the variable, undo the operations in the reverse order from how they were applied to it, the way you'd take off shoes before socks.

### Example 1

Solve $3x - 7 = 11$.

The expression $3x - 7$ was built by multiplying $x$ by 3 and then subtracting 7. Undo in reverse order.

1. Undo the subtraction: add 7 to both sides. $3x = 18$.
2. Undo the multiplication: divide both sides by 3. $x = 6$.
3. Check: $3(6) - 7 = 18 - 7 = 11$. True.

## A general strategy

Most linear equations fall to the same five steps:

1. Clear fractions or decimals if you like, by multiplying both sides by a common denominator or a power of 10.
2. Simplify each side: distribute, then combine like terms.
3. Collect variable terms on one side and constants on the other, using the addition property.
4. Isolate the variable using the multiplication property.
5. Check your answer in the original equation.

### Example 2

Solve $2(x + 1) = 5x - 4$.

1. Distribute on the left: $2x + 2 = 5x - 4$.
2. Collect $x$-terms. Subtracting $2x$ from both sides keeps the coefficient positive: $2 = 3x - 4$.
3. Add 4: $6 = 3x$.
4. Divide by 3: $x = 2$.
5. Check: left side $2(3) = 6$; right side $5(2) - 4 = 6$. True.

### Example 3

Solve $\dfrac{x}{4} - \dfrac{x - 2}{6} = 1$.

1. The least common denominator of 4 and 6 is 12. Multiply every term on both sides by 12:
$$12 \cdot \frac{x}{4} - 12 \cdot \frac{x - 2}{6} = 12 \cdot 1.$$
2. Simplify: $3x - 2(x - 2) = 12$. Keep the parentheses: the whole numerator $x - 2$ is multiplied by 2.
3. Distribute: $3x - 2x + 4 = 12$, so $x + 4 = 12$.
4. Subtract 4: $x = 8$.
5. Check: $\tfrac84 - \tfrac{6}{6} = 2 - 1 = 1$. True.

Clearing fractions works because of the multiplication property: multiplying both sides by 12 doesn't change the solution set. The same trick handles decimals. For $0.3x + 1.2 = 0.05x + 2.2$, multiply by 100 to get $30x + 120 = 5x + 220$, then $25x = 100$ and $x = 4$.

## Seeing a solution on a graph

You can picture an equation as two graphs, one for each side. For $2(x + 1) = 5x - 4$, graph $y = 2(x + 1)$ and $y = 5x - 4$. The solution is the $x$-coordinate where the two lines cross.

```plot
{"x": [-2, 5], "y": [-6, 12], "functions": [{"f": "2*(x + 1)", "label": "y = 2(x + 1)"}, {"f": "5*x - 4", "label": "y = 5x - 4", "dashed": true}], "points": [{"at": [2, 6], "label": "(2, 6)"}], "caption": "The two sides are equal where the lines meet, at x = 2"}
```

## Equations with no solution or infinitely many

Usually a linear equation has exactly one solution. Two other outcomes are possible, and you recognize them when the variable disappears.

- If you reach a false statement like $0 = 5$, the equation has **no solution**. Its solution set is the empty set, written $\varnothing$. Such an equation is a **contradiction**.
- If you reach a true statement like $0 = 0$ or $7 = 7$, every real number is a solution. Such an equation is an **identity**.

An equation that is true for some values and false for others, like $3x - 7 = 11$, is a **conditional equation**.

### Example 4

Solve $4(x - 2) + 3 = 4x - 1$ and $3(2x + 1) = 6x + 3$.

1. First equation: the left side simplifies to $4x - 8 + 3 = 4x - 5$. So $4x - 5 = 4x - 1$. Subtract $4x$: $-5 = -1$, which is false. No solution.
2. Second equation: the left side is $6x + 3$, identical to the right side. Subtract $6x$: $3 = 3$, always true. Every real number is a solution.

On a graph, the first case is two parallel lines that never meet, and the second is the same line drawn twice.

## Common mistakes

- Doing an operation to only one side, or to only one term on a side. When you multiply to clear fractions, every term on both sides gets multiplied.
- Dropping parentheses around a numerator: $-\tfrac{x - 2}{6}$ times 12 is $-2(x - 2) = -2x + 4$, not $-2x - 4$.
- Dividing by the coefficient but losing its sign: from $-4x = 12$, $x = -3$, not $3$.
- Writing "$x = 0$" for an equation like $-5 = -1$. A false statement means no solution at all, not a solution of 0.
- Skipping the check. Substituting back takes seconds and catches most slips.

## Key points

- Solving means producing simpler equivalent equations until the variable is alone.
- You may add, subtract, multiply or divide both sides by the same quantity (never multiply or divide by 0).
- Undo operations in reverse order: usually addition/subtraction first, then multiplication/division.
- Clear fractions by multiplying both sides by the least common denominator.
- If the variable vanishes, a false statement means no solution and a true statement means all real numbers.
