---
id: alg-elimination
module: alg-m4
title: Solving systems by elimination
minutes: 25
topics: [Systems of equations]
drills: [alg-d-system-elim, alg-d-system-sub]
refs: [alg-ref-equations]
---
Substitution works best when some variable already has a coefficient of 1. When none does, substitution drags in fractions, and the elimination method is cleaner. Elimination is also the method that generalizes to three or more variables, which we'll need in Lesson 16.

## Why adding equations is allowed

If $A = B$ and $C = D$, then $A + C = B + D$: you're adding equal amounts to both sides. So you may add two equations of a system together, left side to left side and right side to right side, and the result is true for every solution of the system. The goal of the **elimination method** (also called the addition method) is to add the equations in a way that makes one variable cancel.

### Example 1

Solve $\begin{cases} 3x + 2y = 7 \\ 5x - 2y = 1 \end{cases}$.

1. The $y$-coefficients are $2$ and $-2$, opposites. Add the equations: $8x = 8$, so $x = 1$.
2. Back-substitute into the first: $3(1) + 2y = 7$, so $2y = 4$ and $y = 2$.
3. Check in the second: $5(1) - 2(2) = 1$. Solution $(1, 2)$.

## Making coefficients opposites

Usually the coefficients aren't opposites yet. Multiply one or both equations by constants (allowed by the multiplication property of equality) so that one variable's coefficients become opposites. Choose the variable that needs the smallest multipliers, and aim for the **least common multiple** of its coefficients.

### Example 2

Solve $\begin{cases} 4x + 3y = 10 \\ 6x - 5y = -4 \end{cases}$.

1. Eliminate $x$. The LCM of 4 and 6 is 12. Multiply the first equation by 3 and the second by $-2$:
$$\begin{aligned} 12x + 9y &= 30 \\ -12x + 10y &= 8 \end{aligned}$$
2. Add: $19y = 38$, so $y = 2$.
3. Back-substitute: $4x + 3(2) = 10$, so $4x = 4$ and $x = 1$.
4. Check: $6(1) - 5(2) = -4$. Solution $(1, 2)$.

Multiplying by $-2$ (rather than 2) made the coefficients opposites so the equations could be added. Alternatively, multiply by 2 and subtract; subtracting equations is fine too, but sign errors are more common, so many people prefer always to add.

### Example 3

Solve $\begin{cases} \tfrac12 x + \tfrac13 y = 4 \\ 0.2x - 0.5y = -1.6 \end{cases}$.

1. Clear fractions and decimals first. Multiply the first by 6: $3x + 2y = 24$. Multiply the second by 10: $2x - 5y = -16$.
2. Eliminate $y$: multiply the first by 5 and the second by 2: $15x + 10y = 120$ and $4x - 10y = -32$.
3. Add: $19x = 88$, so $x = \tfrac{88}{19}$.

That's not a pleasant number, so let's double-check by eliminating $x$ instead: multiply $3x + 2y = 24$ by 2 and $2x - 5y = -16$ by $-3$: $6x + 4y = 48$ and $-6x + 15y = 48$. Add: $19y = 96$, so $y = \tfrac{96}{19}$.

4. Check in $3x + 2y = 24$: $\tfrac{264}{19} + \tfrac{192}{19} = \tfrac{456}{19} = 24$. Correct. Solution $\left(\tfrac{88}{19}, \tfrac{96}{19}\right)$.

When the first variable comes out as a fraction, eliminating the other variable directly (instead of back-substituting a fraction) often keeps the arithmetic simpler.

## Special cases

If both variables cancel, look at what's left.

- A false statement like $0 = 6$: the lines are parallel, and there is no solution.
- A true statement like $0 = 0$: the equations describe the same line, and there are infinitely many solutions.

### Example 4

Solve $\begin{cases} 2x - 6y = 4 \\ -3x + 9y = 5 \end{cases}$.

1. Multiply the first by 3 and the second by 2: $6x - 18y = 12$ and $-6x + 18y = 10$.
2. Add: $0 = 22$. False. The system is inconsistent; it has no solution.
3. Graphically: both lines have slope $\tfrac13$ but different intercepts, so they are parallel.

```plot
{"x": [-4, 6], "y": [-3, 3], "functions": [{"f": "(2*x - 4)/6", "label": "2x - 6y = 4"}, {"f": "(3*x + 5)/9", "label": "-3x + 9y = 5", "dashed": true}], "caption": "Same slope 1/3, different intercepts: no intersection"}
```

## Choosing a method

| Situation | Good choice |
|---|---|
| a variable is already isolated, like $y = 3x - 1$ | substitution |
| some coefficient is 1 or $-1$ | substitution or elimination |
| all coefficients are larger numbers | elimination |
| you want a picture or a rough estimate | graphing |

Every method gives the same answer; pick the one that keeps the arithmetic easiest.

## Describing infinitely many solutions

When elimination gives $0 = 0$, it isn't enough to say "infinitely many." Describe them: every point on the common line.

### Example 5

Solve $\begin{cases} 3x - 2y = 4 \\ 6x - 4y = 8 \end{cases}$.

1. Multiply the first equation by $-2$: $-6x + 4y = -8$. Adding the second gives $0 = 0$.
2. Both equations describe the same line. Solve either for $y$: $y = \dfrac{3x - 4}{2} = \dfrac32 x - 2$.
3. The solution set is $\left\{(x, y) \mid y = \tfrac32 x - 2\right\}$. For instance $(0, -2)$, $(2, 1)$ and $(4, 4)$ are all solutions.

Pick any value of $x$ and the formula gives the matching $y$; that's what "infinitely many solutions" means concretely.

## Common mistakes

- Multiplying only one side of an equation, or only some of its terms, by the constant.
- Adding equations when the coefficients are equal rather than opposite, so nothing cancels.
- Arithmetic sign slips when subtracting equations. Multiplying by a negative and adding avoids this.
- Forgetting to find the second variable after eliminating.
- Reporting "$x = 0$" when the result is $0 = 22$. That means no solution.

## Key points

- Adding equal quantities to equal quantities keeps a true equation, so equations in a system may be added.
- Multiply equations so one variable has opposite coefficients, then add to eliminate it.
- Back-substitute (or eliminate the other variable) and check in both original equations.
- $0 = c$ with $c \ne 0$ means no solution; $0 = 0$ means infinitely many.
