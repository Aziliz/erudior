---
id: pre-inequalities
module: pre-m7
title: Inequalities and number lines
minutes: 25
topics: [Inequalities]
drills: [pre-ineq-solve, pre-ineq-flip, pre-ineq-word]
refs: [pre-ref-algebra]
---
## When the answer is a range

"You must be at least 48 inches tall to ride." "Spend no more than \$60." "The temperature stayed above freezing." These don't pin down one number; they describe a whole range of numbers. An **inequality** is a statement that compares two expressions using $<$, $>$, $\le$, $\ge$ or $\ne$: one is less than, greater than, at most, at least, or not equal to the other. Solving inequalities uses almost exactly the same steps as solving equations, with one important twist.

## Inequality symbols

| Symbol | Meaning | Example |
|---|---|---|
| $<$ | is less than | $x < 5$ |
| $>$ | is greater than | $x > -2$ |
| $\le$ | is less than or equal to | $x \le 7$ |
| $\ge$ | is greater than or equal to | $x \ge 0$ |
| $\ne$ | is not equal to | $x \ne 3$ |

Phrases to translate: "at least" means $\ge$; "at most" and "no more than" mean $\le$; "more than" means $>$; "fewer than" and "less than" mean $<$.

A **solution of an inequality** is any value that makes it true. The inequality $x < 5$ has infinitely many solutions: 4, 0, $-10$, 4.99, $\tfrac12$ and so on. Since you can't list them, you describe them with a simpler inequality or a graph.

## Graphing on a number line

To graph an inequality in one variable, mark the boundary number and shade the side that works.

- An **open circle** means the boundary is *not* included ($<$ or $>$).
- A **closed circle** (filled in) means the boundary *is* included ($\le$ or $\ge$).

```numberline
{"x": [-1, 9], "points": [{"at": [5, 0], "open": true}], "segments": [{"from": [5, 0], "to": [-1, 0], "arrow": true}], "caption": "x < 5: open circle at 5, shaded to the left"}
```

```numberline
{"x": [-6, 4], "points": [{"at": [-2, 0], "open": false}], "segments": [{"from": [-2, 0], "to": [4, 0], "arrow": true}], "caption": "x ≥ -2: closed circle at -2, shaded to the right"}
```

A helpful habit: write the variable on the left. Then the inequality symbol points the way the shading goes: $x < 5$ points left, $x \ge -2$ "points" right. An inequality written as $3 > x$ means the same as $x < 3$; flip the whole statement, symbol and all, to put $x$ first.

## Solving: the same steps, with one twist

You may add or subtract the same number on both sides, and you may multiply or divide both sides by the same *positive* number, without changing the inequality. For instance, $2 < 6$; add 3: $5 < 9$, still true; multiply by 2: $4 < 12$, still true.

But multiplying by a *negative* number reverses order. Start with $2 < 6$ and multiply by $-1$: $-2$ and $-6$. On the number line $-2$ is to the right of $-6$, so $-2 > -6$. The symbol had to flip.

*Rule:* when you multiply or divide both sides of an inequality by a negative number, reverse the inequality symbol.

Why does this happen? Multiplying by $-1$ reflects every number across 0, swapping left and right. What was further left is now further right.

### Example 1

Solve $3x - 4 > 11$ and graph the solution.

- Add 4: $3x > 15$.
- Divide by 3 (positive, so no flip): $x > 5$.

```numberline
{"x": [0, 10], "points": [{"at": [5, 0], "open": true}], "segments": [{"from": [5, 0], "to": [10, 0], "arrow": true}], "caption": "x > 5"}
```

Check with a number from the shaded region, say $x = 6$: $3(6) - 4 = 14 > 11$. ✓ And a number outside it, $x = 4$: $8 > 11$ is false. ✓

### Example 2

Solve $5 - 2y \le 13$.

- Subtract 5: $-2y \le 8$.
- Divide by $-2$, and *reverse* the symbol: $y \ge -4$.

Check $y = 0$ (in the solution): $5 \le 13$. ✓ Check $y = -5$ (not in it): $5 + 10 = 15 \le 13$ is false. ✓

```numberline
{"x": [-8, 2], "points": [{"at": [-4, 0], "open": false}], "segments": [{"from": [-4, 0], "to": [2, 0], "arrow": true}], "caption": "y ≥ -4"}
```

### Example 3

Solve $2(x + 3) < 5x - 9$.

- Distribute: $2x + 6 < 5x - 9$.
- Subtract $2x$: $6 < 3x - 9$.
- Add 9: $15 < 3x$.
- Divide by 3: $5 < x$, which is the same as $x > 5$.

Keeping the variable on the side with the larger coefficient (here the right) avoided dividing by a negative.

## Compound inequalities

A statement like $-1 \le x < 3$ means *both* $x \ge -1$ *and* $x < 3$: the numbers between $-1$ and 3, including $-1$ but not 3. Its graph is a segment with a closed circle at $-1$ and an open circle at 3.

```numberline
{"x": [-3, 5], "points": [{"at": [-1, 0], "open": false}, {"at": [3, 0], "open": true}], "segments": [{"from": [-1, 0], "to": [3, 0]}], "caption": "-1 ≤ x < 3"}
```

## Word problems

### Example 4

A rideshare costs \$3.50 plus \$1.25 per mile. Ana has \$20. How many whole miles can she ride?

Let $m$ be the miles. Cost must be at most \$20: $3.50 + 1.25m \le 20$.

Subtract 3.50: $1.25m \le 16.50$. Divide by 1.25: $m \le 13.2$. She can ride at most 13 whole miles.

### Example 5

Jo's test scores are 78, 85 and 90. What must she score on the fourth test to average at least 85?

The average is the total divided by 4: $\dfrac{78 + 85 + 90 + s}{4} \ge 85$. Multiply by 4: $253 + s \ge 340$. Subtract 253: $s \ge 87$. She needs at least 87.

## Common mistakes

- *Forgetting to flip* when multiplying or dividing by a negative.
- *Flipping when you shouldn't:* subtracting a number, or dividing by a positive number, never flips the symbol, even if the result is negative ($3x < -12$ gives $x < -4$).
- *Open vs closed circles:* $\le$ and $\ge$ include the boundary (closed); $<$ and $>$ don't (open).
- *Shading the wrong way* when the variable is on the right: $4 < x$ means $x > 4$.
- *Mistranslating "at least"* as $>$; it means $\ge$.

## Key points

- Inequalities describe ranges; graph with an open circle for $<$, $>$ and a closed circle for $\le$, $\ge$.
- Solve like an equation: add, subtract, multiply or divide both sides.
- Multiplying or dividing by a negative number reverses the inequality symbol.
- Check with one value inside the solution and one outside.
- "At least" is $\ge$; "at most" or "no more than" is $\le$.
