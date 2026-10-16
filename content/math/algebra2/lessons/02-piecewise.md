---
id: a2-piecewise
module: a2-m1
title: Piecewise-defined functions
minutes: 30
topics: [Piecewise functions]
drills: [a2-d-piecewise-eval, a2-d-piecewise-abs, a2-d-step-cost]
refs: [alg-ref-functions]
---
Many real rules change partway through. A phone plan charges one price up to a data cap and another price after it; a tax rate jumps at an income threshold; a parking garage charges by the started hour. A single formula can't describe these, but a function is allowed to use different formulas on different parts of its domain. This lesson shows how to read, evaluate and graph such functions, and explains two important examples: absolute value and step functions.

## What a piecewise function is

A **piecewise-defined function** (or piecewise function) uses different formulas on different intervals of its domain. It's written with a brace, each formula paired with the condition that says when to use it:

$$f(x) = \begin{cases} 2x + 3 & \text{if } x < -1 \\ x^2 & \text{if } -1 \le x \le 2 \\ 5 - x & \text{if } x > 2 \end{cases}$$

The conditions must not overlap, because a function gives each input exactly one output. Each input belongs to exactly one piece, and only that piece's formula is used for it. The numbers where the rule changes, here $-1$ and $2$, are the **break points**. Pay close attention to which piece owns each break point: the symbols $<$, $\le$, $>$ and $\ge$ decide it.

## Evaluating

To find $f(a)$:

1. Find the condition that $a$ satisfies.
2. Substitute $a$ into that piece's formula only.

### Example 1

For the function $f$ above, find $f(-3)$, $f(-1)$, $f(2)$ and $f(5)$.

1. $-3 < -1$, so use the first piece: $f(-3) = 2(-3) + 3 = -3$.
2. $-1$ satisfies $-1 \le x \le 2$ (not $x < -1$), so use the second: $f(-1) = (-1)^2 = 1$.
3. $2$ also satisfies $-1 \le x \le 2$: $f(2) = 2^2 = 4$. (Using the third piece would give $5 - 2 = 3$, which is wrong because 2 is not greater than 2.)
4. $5 > 2$: $f(5) = 5 - 5 = 0$.

## Graphing

Graph each piece as if it were a whole function, but keep only the part over its own interval. At each break point, draw a closed dot if the piece includes that endpoint ($\le$ or $\ge$) and an open dot if it doesn't ($<$ or $>$).

For the function $f$ above:

- The line $y = 2x + 3$ is drawn for $x < -1$. At $x = -1$ it would reach $2(-1) + 3 = 1$, so it ends with an open dot at $(-1, 1)$.
- The parabola $y = x^2$ runs from $(-1, 1)$ to $(2, 4)$, closed at both ends. Its closed dot at $(-1, 1)$ fills in the open dot of the first piece, so the graph is unbroken there.
- The line $y = 5 - x$ is drawn for $x > 2$, starting with an open dot at $(2, 3)$.

```plot
{"x": [-5, 6], "y": [-5, 6], "functions": [{"f": "2x + 3", "from": -5, "to": -1}, {"f": "x^2", "from": -1, "to": 2}, {"f": "5 - x", "from": 2, "to": 6}], "points": [{"at": [-1, 1], "label": "(−1, 1)"}, {"at": [2, 4], "label": "(2, 4)"}, {"at": [2, 3], "open": true, "label": "(2, 3)"}], "caption": "The pieces join at x = −1, but there is a jump at x = 2: f(2) = 4, and the open dot at (2, 3) is not on the graph"}
```

At $x = 2$ the graph has a jump: the second piece ends at height 4 and the third starts at height 3. You can test any break point this way: evaluate both neighboring formulas there. If they agree, the pieces meet; if not, the graph jumps. For instance, $g(x) = x + k$ for $x < 2$ and $g(x) = x^2$ for $x \ge 2$ meet only if $2 + k = 2^2$, that is, $k = 2$.

## Absolute value as a piecewise function

The absolute value function is really a two-piece function:

$$\lvert x \rvert = \begin{cases} x & \text{if } x \ge 0 \\ -x & \text{if } x < 0 \end{cases}$$

The second piece looks odd at first, but if $x$ is negative then $-x$ is positive; for example $\lvert -4 \rvert = -(-4) = 4$. This is why the graph of $y = \lvert x \rvert$ is two rays: $y = x$ on the right and $y = -x$ on the left. The same idea rewrites any absolute value of a linear expression: the break point is where the inside equals zero.

### Example 2

Write $g(x) = \lvert 2x - 6 \rvert$ as a piecewise function and graph it.

1. The inside $2x - 6$ is zero at $x = 3$; it's nonnegative when $x \ge 3$ and negative when $x < 3$.
2. When $x \ge 3$, the absolute value does nothing: $g(x) = 2x - 6$.
3. When $x < 3$, it changes the sign: $g(x) = -(2x - 6) = 6 - 2x$.
4. So
$$g(x) = \begin{cases} 2x - 6 & \text{if } x \ge 3 \\ 6 - 2x & \text{if } x < 3 \end{cases}$$
5. Check: $g(1) = 6 - 2 = 4$, and $\lvert 2(1) - 6 \rvert = \lvert -4 \rvert = 4$. The graph is a V with its corner at $(3, 0)$ and slopes $\pm 2$, which is $y = \lvert x \rvert$ shifted right 3 and stretched vertically by 2, since $\lvert 2x - 6 \rvert = 2\lvert x - 3 \rvert$.

```plot
{"x": [-1, 7], "y": [-1, 8], "functions": [{"f": "6 - 2x", "from": -1, "to": 3, "label": "y = 6 − 2x"}, {"f": "2x - 6", "from": 3, "to": 7, "dashed": true, "label": "y = 2x − 6"}], "points": [{"at": [3, 0], "label": "(3, 0)"}, {"at": [1, 4], "label": "(1, 4)"}], "caption": "|2x − 6| is made of two rays that meet at (3, 0)"}
```

## Step functions

A **step function** is a piecewise function that is constant on each piece, so its graph looks like a staircase of horizontal segments. The standard example is the **greatest integer function**, also called the floor function:

$$\lfloor x \rfloor = \text{the greatest integer that is less than or equal to } x.$$

So $\lfloor 3.7 \rfloor = 3$, $\lfloor 5 \rfloor = 5$, and $\lfloor -1.2 \rfloor = -2$. That last one catches people: $-1$ is greater than $-1.2$, so the greatest integer that does not exceed $-1.2$ is $-2$. Think "round down on the number line," never "chop off the decimals."

On each interval $n \le x < n + 1$ the value is the integer $n$. Each step has a closed dot on its left end and an open dot on its right end.

```plot
{"x": [-3, 4], "y": [-3, 4], "segments": [{"from": [-3, -3], "to": [-2, -3]}, {"from": [-2, -2], "to": [-1, -2]}, {"from": [-1, -1], "to": [0, -1]}, {"from": [0, 0], "to": [1, 0]}, {"from": [1, 1], "to": [2, 1]}, {"from": [2, 2], "to": [3, 2]}, {"from": [3, 3], "to": [4, 3]}], "points": [{"at": [-2, -2]}, {"at": [-1, -1]}, {"at": [0, 0]}, {"at": [1, 1]}, {"at": [2, 2]}, {"at": [3, 3]}, {"at": [-2, -3], "open": true}, {"at": [-1, -2], "open": true}, {"at": [0, -1], "open": true}, {"at": [1, 0], "open": true}, {"at": [2, 1], "open": true}, {"at": [3, 2], "open": true}], "caption": "y = ⌊x⌋: each step includes its left end and excludes its right end"}
```

Real prices that charge "per hour or part of an hour" are step functions that round up instead of down. Rather than memorize a formula, write the cases out.

### Example 3

A parking garage charges \$4 for the first hour or less and \$3 for each additional hour or part of an hour, up to a daily maximum of \$15. Write the cost $C(t)$ for $0 < t \le 24$ hours, and find the cost of parking for 2 hours, for 2 hours 10 minutes, and for 6 hours.

1. Up to 1 hour costs 4. Any time past 1 hour, up to 2, adds one more charge: 7. Past 2 hours, up to 3: 10. Past 3, up to 4: 13. Past 4 hours, the next charge would make 16, but the maximum caps it at 15.
2. As a piecewise function:
$$C(t) = \begin{cases} 4 & \text{if } 0 < t \le 1 \\ 7 & \text{if } 1 < t \le 2 \\ 10 & \text{if } 2 < t \le 3 \\ 13 & \text{if } 3 < t \le 4 \\ 15 & \text{if } 4 < t \le 24 \end{cases}$$
3. $t = 2$ is in $1 < t \le 2$, so $C(2) = 7$ dollars.
4. 2 hours 10 minutes is $t \approx 2.17$, in $2 < t \le 3$: \$10. The extra 10 minutes counts as a whole started hour.
5. $t = 6$ is in the last piece: \$15.

Because the charge rounds *up*, each step here is open on the left and closed on the right, the reverse of the floor function.

```plot
{"x": [0, 6], "y": [0, 17], "xLabel": "hours parked", "yLabel": "cost ($)", "segments": [{"from": [0, 4], "to": [1, 4]}, {"from": [1, 7], "to": [2, 7]}, {"from": [2, 10], "to": [3, 10]}, {"from": [3, 13], "to": [4, 13]}, {"from": [4, 15], "to": [6, 15]}], "points": [{"at": [0, 4], "open": true}, {"at": [1, 4]}, {"at": [1, 7], "open": true}, {"at": [2, 7]}, {"at": [2, 10], "open": true}, {"at": [3, 10]}, {"at": [3, 13], "open": true}, {"at": [4, 13]}, {"at": [4, 15], "open": true}], "caption": "The parking cost C(t): a step function that rounds up to the next started hour"}
```

## Common mistakes

- Using more than one piece for a single input, or the wrong piece at a break point. Read the inequality: at $x = 2$, "$x > 2$" does not apply.
- Drawing every piece across the whole graph instead of only over its own interval.
- Getting open and closed dots backwards. Closed means the endpoint is included ($\le$, $\ge$).
- Evaluating $\lfloor -1.2 \rfloor$ as $-1$. The floor of a negative non-integer is the next integer *down*.
- Writing $\lvert 2x - 6 \rvert$ as $2x - 6$ for $x \ge 0$. The break point is where the inside is zero ($x = 3$), not $x = 0$.

## Key points

- A piecewise function uses different formulas on non-overlapping intervals; each input uses exactly one formula.
- To evaluate, find the condition the input satisfies, then use only that formula.
- To graph, draw each piece on its interval with closed dots for included endpoints and open dots for excluded ones. Compare the neighboring formulas at a break point to see whether the graph joins or jumps.
- $\lvert x \rvert$ is $x$ for $x \ge 0$ and $-x$ for $x < 0$; for $\lvert mx + b \rvert$, the break point is where $mx + b = 0$.
- Step functions are constant on each piece. $\lfloor x \rfloor$ is the greatest integer $\le x$ (round down on the number line).
