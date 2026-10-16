---
id: alg-abs-value
module: alg-m2
title: Absolute value equations and inequalities
minutes: 30
topics: [Absolute value]
drills: [alg-d-abs-eq, alg-d-abs-ineq]
refs: [alg-ref-equations]
---
In Lesson 1 we defined $|a|$ as the distance from $a$ to 0. That one idea turns absolute value equations and inequalities into problems you already know how to solve: a pair of linear equations, a double inequality, or an "or" inequality. This lesson shows how to make the translation and why it works.

## Absolute value as distance

Because $|x|$ is the distance from $x$ to 0:

- $|x| = 4$ means $x$ is 4 units from 0, so $x = 4$ or $x = -4$.
- $|x| < 4$ means $x$ is less than 4 units from 0, so $-4 < x < 4$.
- $|x| > 4$ means $x$ is more than 4 units from 0, so $x < -4$ or $x > 4$.

```numberline
{"x": [-7, 7], "points": [{"at": [-4, 0], "open": true, "label": "-4"}, {"at": [4, 0], "open": true, "label": "4"}, {"at": [0, 0], "label": "0"}], "segments": [{"from": [-4, 0], "to": [4, 0]}], "caption": "|x| < 4: everything within 4 units of 0"}
```

More generally, $|x - c|$ is the distance from $x$ to $c$, so $|x - 3| < 2$ describes the numbers within 2 units of 3: the interval $(1, 5)$.

## Absolute value equations

For $k > 0$, the equation $|u| = k$ is equivalent to

$$u = k \quad \text{or} \quad u = -k,$$

where $u$ can be any expression. If $k = 0$, there is one solution: $u = 0$. If $k < 0$, there are no solutions, because a distance can't be negative.

Before splitting, isolate the absolute value: get $|u|$ alone on one side.

### Example 1

Solve $3|2x - 1| + 4 = 25$.

1. Isolate: subtract 4 to get $3|2x - 1| = 21$, then divide by 3 to get $|2x - 1| = 7$.
2. Split: $2x - 1 = 7$ or $2x - 1 = -7$.
3. Solve each: $2x = 8$ gives $x = 4$; $2x = -6$ gives $x = -3$.
4. Check: $3|7| + 4 = 25$ and $3|-7| + 4 = 25$. Both work.

A common slip is to split first, writing $3(2x - 1) + 4 = 25$ and $3(2x - 1) + 4 = -25$. The second is wrong: the negative belongs to what's inside the bars, not to the whole side.

### Example 2

Solve $|x + 5| + 8 = 3$.

Isolating gives $|x + 5| = -5$. An absolute value is never negative, so there is no solution. Spotting this saves you from producing two fake answers.

### Equations with two absolute values

If $|u| = |v|$, then $u$ and $v$ are the same distance from 0, so $u = v$ or $u = -v$. For $|x - 2| = |3x + 4|$: either $x - 2 = 3x + 4$, giving $x = -3$, or $x - 2 = -(3x + 4)$, giving $4x = -2$ and $x = -\tfrac12$. Check: $|-5| = |-5|$ and $|-\tfrac52| = |\tfrac52|$.

## "Less than" inequalities become "and"

For $k > 0$:

$$|u| < k \iff -k < u < k, \qquad |u| \le k \iff -k \le u \le k.$$

The values of $u$ are trapped between $-k$ and $k$, so the solution is a single interval. Think "less than → between."

### Example 3

Solve $|2x - 3| \le 5$.

1. Rewrite as a double inequality: $-5 \le 2x - 3 \le 5$.
2. Add 3 to all parts: $-2 \le 2x \le 8$.
3. Divide by 2: $-1 \le x \le 4$, the interval $[-1, 4]$.

The midpoint of $[-1, 4]$ is $1.5 = \tfrac32$, which is where $2x - 3 = 0$, and the interval reaches $\tfrac52$ on each side. That matches the distance picture: $|2x - 3| \le 5$ is the same as $|x - \tfrac32| \le \tfrac52$.

## "Greater than" inequalities become "or"

For $k > 0$:

$$|u| > k \iff u < -k \text{ or } u > k.$$

The values of $u$ are far from 0 in either direction, so the solution is two separate rays. Think "greater than → or."

### Example 4

Solve $|x + 1| - 2 > 4$.

1. Isolate: $|x + 1| > 6$.
2. Split: $x + 1 < -6$ or $x + 1 > 6$.
3. Solve: $x < -7$ or $x > 5$, which is $(-\infty, -7) \cup (5, \infty)$.

```numberline
{"x": [-11, 9], "points": [{"at": [-7, 0], "open": true, "label": "-7"}, {"at": [5, 0], "open": true, "label": "5"}, {"at": [-1, 0], "label": "-1"}], "segments": [{"from": [-7, 0], "to": [-11, 0], "arrow": true}, {"from": [5, 0], "to": [9, 0], "arrow": true}], "caption": "|x + 1| > 6: more than 6 units from -1"}
```

## Special cases with negative or zero right sides

Once the absolute value is isolated, look at the number on the other side before splitting.

| Inequality | Solution | Reason |
|---|---|---|
| $\lvert u \rvert < -3$ | none | a distance is never below a negative number |
| $\lvert u \rvert > -3$ | all real numbers (where $u$ is defined) | every distance is at least 0 |
| $\lvert u \rvert \le 0$ | only where $u = 0$ | the distance must be exactly 0 |
| $\lvert u \rvert > 0$ | everything except where $u = 0$ | every nonzero distance is positive |

## A graphical view

You can also read absolute value inequalities from a graph. The graph of $y = |x - 2|$ is a V with its corner at $(2, 0)$. The solutions of $|x - 2| < 3$ are the $x$-values where the V lies below the horizontal line $y = 3$.

```plot
{"x": [-3, 7], "y": [-1, 6], "functions": [{"f": "abs(x - 2)", "label": "y = |x - 2|"}, {"f": "3", "label": "y = 3", "dashed": true}], "points": [{"at": [-1, 3], "label": "(-1, 3)"}, {"at": [5, 3], "label": "(5, 3)"}], "caption": "The V is below y = 3 for -1 < x < 5"}
```

The V is below the line between $x = -1$ and $x = 5$, so $|x - 2| < 3$ has solution $(-1, 5)$, and $|x - 2| > 3$ has solution $(-\infty, -1) \cup (5, \infty)$.

## Common mistakes

- Splitting before isolating the absolute value.
- Writing $|u| = k$ as $u = k$ only, losing the negative case.
- Using "and" for a greater-than inequality: $|x| > 4$ is not $-4 > x > 4$, which no number satisfies.
- Missing the special cases: $|u| = -2$ and $|u| < -2$ have no solutions.
- Forgetting to flip the inequality when a negative coefficient shows up while solving the pieces.

## Key points

- $|u| = k$ with $k > 0$ splits into $u = k$ or $u = -k$; with $k < 0$ there's no solution.
- Isolate the absolute value first.
- $|u| < k$ becomes $-k < u < k$ (between, one interval).
- $|u| > k$ becomes $u < -k$ or $u > k$ (two rays).
- $|x - c|$ is the distance from $x$ to $c$, which explains all of the rules.
