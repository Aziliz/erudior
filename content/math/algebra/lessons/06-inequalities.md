---
id: alg-inequalities
module: alg-m2
title: Linear and compound inequalities
minutes: 30
topics: [Linear inequalities, Compound inequalities]
drills: [alg-d-ineq-smallest-int, alg-d-ineq-largest-int, alg-d-compound-ineq]
refs: [alg-ref-equations]
---
An equation pins a variable to particular values. An inequality allows a whole range: "at least 18 years old," "under 2,000 calories," "between 60 and 75 degrees." Solving linear inequalities uses almost exactly the steps from Lesson 3, with one important new rule. This lesson also introduces interval notation for writing the answers, and compound inequalities that join two conditions with "and" or "or."

## Inequalities and their solutions

A **linear inequality** looks like a linear equation with $=$ replaced by $<$, $\le$, $>$ or $\ge$, for example $2x - 5 < 7$. A solution is any number that makes it true, and there are usually infinitely many. For $2x - 5 < 7$, the number 3 works ($1 < 7$) and so does $-100$, but 6 doesn't ($7 < 7$ is false).

## Solving: the one new rule

Adding or subtracting the same number on both sides keeps an inequality true: if $a < b$, then $a + c < b + c$. Shifting both numbers along the number line keeps their order.

Multiplying or dividing by a positive number also keeps the order. But multiplying or dividing by a negative number reverses it. Take the true statement $2 < 5$ and multiply both sides by $-1$: you get $-2$ and $-5$, and on the number line $-2$ is to the right, so $-2 > -5$. Multiplying by a negative reflects the number line across 0, which flips left and right. So:

> When you multiply or divide both sides of an inequality by a negative number, reverse the inequality symbol.

### Example 1

Solve $7 - 3x \ge 19$ and graph the solution.

1. Subtract 7 from both sides: $-3x \ge 12$.
2. Divide by $-3$ and reverse the symbol: $x \le -4$.
3. Check a value from the answer, say $x = -5$: $7 - 3(-5) = 22 \ge 19$. True. Check one outside, $x = 0$: $7 \ge 19$ is false, as it should be.

```numberline
{"x": [-9, 3], "points": [{"at": [-4, 0], "label": "-4"}], "segments": [{"from": [-4, 0], "to": [-9, 0], "arrow": true}], "caption": "x ≤ -4: closed dot at -4, shading to the left"}
```

The dot at $-4$ is solid (closed) because $-4$ itself is a solution. For a strict inequality like $<$ or $>$, the endpoint is not included and the dot is drawn open.

You can avoid dividing by a negative by moving the variable term to the other side instead: $7 - 19 \ge 3x$, so $-12 \ge 3x$, or $-4 \ge x$. That says the same thing as $x \le -4$, read from the other side.

## Interval notation

**Interval notation** writes a set of numbers by its endpoints. A square bracket means the endpoint is included; a parenthesis means it is not. Infinity is never a number you reach, so $\infty$ and $-\infty$ always get parentheses.

| Inequality | Interval | Number line |
|---|---|---|
| $x > 2$ | $(2, \infty)$ | open dot at 2, shade right |
| $x \le -4$ | $(-\infty, -4]$ | closed dot at $-4$, shade left |
| $-1 < x \le 3$ | $(-1, 3]$ | open at $-1$, closed at 3 |
| all real numbers | $(-\infty, \infty)$ | whole line |

The **set-builder notation** $\{x \mid x > 2\}$, read "the set of all $x$ such that $x > 2$," is another common way to write the same set.

### Example 2

Solve $\dfrac{x}{2} + 1 < \dfrac{2x - 1}{3}$. Write the answer in interval notation.

1. Multiply every term by 6 (positive, so no flip): $3x + 6 < 2(2x - 1)$.
2. Distribute: $3x + 6 < 4x - 2$.
3. Subtract $3x$ and add 2: $8 < x$.
4. So $x > 8$, which is $(8, \infty)$.
5. Check $x = 11$: $5.5 + 1 = 6.5$ and $\tfrac{21}{3} = 7$, and $6.5 < 7$. True.

## Compound inequalities with "and"

A **compound inequality** joins two inequalities. With "and," a number must satisfy both, so the solution is the **intersection** of the two solution sets: the overlap. "$x > -2$ and $x \le 3$" is usually written as the **double inequality** $-2 < x \le 3$.

To solve a double inequality, do the same operation to all three parts at once.

### Example 3

Solve $-5 \le 2x + 3 < 9$.

1. Subtract 3 from all three parts: $-8 \le 2x < 6$.
2. Divide all three parts by 2: $-4 \le x < 3$.
3. Interval: $[-4, 3)$.

```numberline
{"x": [-7, 6], "points": [{"at": [-4, 0], "label": "-4"}, {"at": [3, 0], "open": true, "label": "3"}], "segments": [{"from": [-4, 0], "to": [3, 0]}], "caption": "-4 ≤ x < 3, the interval [-4, 3)"}
```

If you divide all three parts by a negative number, both symbols flip. For $1 < 5 - 2x < 11$: subtract 5 to get $-4 < -2x < 6$, divide by $-2$ to get $2 > x > -3$, and rewrite in increasing order as $-3 < x < 2$.

## Compound inequalities with "or"

With "or," a number needs to satisfy at least one of the inequalities, so the solution is the **union** of the two sets, written with $\cup$. Solve each part separately, then combine.

### Example 4

Solve $3x - 1 < -7$ or $2x + 5 \ge 11$.

1. First part: $3x < -6$, so $x < -2$.
2. Second part: $2x \ge 6$, so $x \ge 3$.
3. Union: $x < -2$ or $x \ge 3$, which is $(-\infty, -2) \cup [3, \infty)$.

```numberline
{"x": [-7, 7], "points": [{"at": [-2, 0], "open": true, "label": "-2"}, {"at": [3, 0], "label": "3"}], "segments": [{"from": [-2, 0], "to": [-7, 0], "arrow": true}, {"from": [3, 0], "to": [7, 0], "arrow": true}], "caption": "x < -2 or x ≥ 3: two separate rays"}
```

Watch for special cases. "$x > 4$ and $x < 1$" has no overlap, so it has no solution. "$x > 1$ or $x < 4$" covers every real number, because each number is either above 1 or below 4 (or both).

## Inequalities in applications

Words like "at least" ($\ge$), "at most" ($\le$), "more than" ($>$), "less than" ($<$), "no more than" ($\le$) and "minimum" or "maximum" signal an inequality.

### Example 5

A phone plan costs $25 a month plus $0.10 per text. How many texts can you send if you want the bill to be at most $40?

1. Let $t$ be the number of texts: $25 + 0.10t \le 40$.
2. Subtract 25: $0.10t \le 15$. Divide by 0.10: $t \le 150$.
3. You can send at most 150 texts. (Since $t$ counts texts, the realistic answers are the whole numbers from 0 to 150.)

## Common mistakes

- Forgetting to flip the symbol when multiplying or dividing by a negative. Moving a term across with addition never flips anything.
- Flipping the symbol when the coefficient is negative but you divided by a positive number.
- Using a bracket next to $\infty$. Infinity always takes a parenthesis.
- Writing an "or" answer as a double inequality: $x < -2$ or $x \ge 3$ is not $3 \le x < -2$, which describes no numbers at all.
- Confusing intersection (and, overlap) with union (or, everything in either).

## Key points

- Solve linear inequalities like equations, but reverse the symbol when multiplying or dividing by a negative.
- Closed dot or bracket: endpoint included ($\le$, $\ge$). Open dot or parenthesis: not included ($<$, $>$), and always next to $\pm\infty$.
- "And" means intersection; solve a double inequality by operating on all three parts.
- "Or" means union; solve each part and combine with $\cup$.
