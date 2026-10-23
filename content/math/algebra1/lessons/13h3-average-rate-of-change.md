---
id: alg-m3-h-average-rate
module: alg-m3
title: Average rate of change and the slope of a curve
minutes: 45
honors: true
topics: [Average rate of change]
drills: [alg-m3-r2-arc-quadratic, alg-m3-r2-secant-line, alg-m3-r2-diff-quotient]
refs: [alg-ref-functions]
---
A line has one slope, and Lesson 10 showed that it measures a constant rate of change. Most functions are not lines: a ball slows as it rises, a population grows faster as it gets bigger. Lesson 10 ended with a tool for these cases, the average rate of change over an interval. This honors lesson develops that tool: computing it from formulas, tables and graphs, reading the shape of a graph from how the rate changes, a shortcut for quadratic functions, and finally the question that leads to calculus: what is the rate of change *at a single instant*?

## The average rate of change

The average rate of change of $f$ on the interval from $x = a$ to $x = b$ is the change in output divided by the change in input:

$$\frac{f(b) - f(a)}{b - a}.$$

It is the slope of the line through the two points $(a, f(a))$ and $(b, f(b))$ on the graph. A line through two points of a curve is called a **secant line**, so the average rate of change is the slope of a secant line. Its units are output units per input unit, as for any slope.

### Example 1

A ball is thrown upward from a 5-foot platform, and (ignoring air resistance) its height after $t$ seconds is $h(t) = -16t^2 + 64t + 5$ feet. Find the average rate of change of $h$ over each one-second interval from $t = 0$ to $t = 4$, and describe the motion.

1. Heights: $h(0) = 5$, $h(1) = -16 + 64 + 5 = 53$, $h(2) = -64 + 128 + 5 = 69$, $h(3) = -144 + 192 + 5 = 53$, $h(4) = -256 + 256 + 5 = 5$.
2. Average rates, each over 1 second:

| Interval | $[0, 1]$ | $[1, 2]$ | $[2, 3]$ | $[3, 4]$ |
|---|---|---|---|---|
| Change in height (ft) | $48$ | $16$ | $-16$ | $-48$ |
| Average rate (ft/s) | $48$ | $16$ | $-16$ | $-48$ |

3. Interpretation: in the first second the ball rises at an average of 48 feet per second, in the next only 16. Then the rates turn negative: the ball is falling, and faster each second. The average rate of change of height is the ball's **average velocity**: speed with a sign that shows direction (positive up, negative down).

Over the whole interval $[0, 4]$ the average rate is $\dfrac{5 - 5}{4} = 0$ ft/s: the ball ends where it started. An average over a long interval can hide everything that happened inside it.

```plot
{"x": [0, 4.5], "y": [0, 80], "functions": [{"f": "-16*x^2 + 64*x + 5", "from": 0, "to": 4.07}], "points": [{"at": [0, 5], "label": "(0, 5)"}, {"at": [1, 53], "label": "(1, 53)"}, {"at": [2, 69], "label": "(2, 69)"}, {"at": [3, 53], "label": "(3, 53)"}], "segments": [{"from": [0, 5], "to": [1, 53], "dashed": true, "label": "slope 48"}, {"from": [2, 69], "to": [3, 53], "dashed": true, "label": "slope -16"}], "xLabel": "t (seconds)", "yLabel": "height (feet)", "caption": "Two secant lines: average velocity 48 ft/s on [0, 1] and -16 ft/s on [2, 3]"}
```

## Rates from a table

With data in a table, the average rate of change uses whichever two rows bound the interval. The rows need not be equally spaced, so always divide by the actual change in the input.

### Example 2

A phone's battery charge $B$ (percent) is recorded during a day of use:

| Time $t$ (hours) | $0$ | $1$ | $2$ | $4$ | $7$ |
|---|---|---|---|---|---|
| Charge $B$ (%) | $100$ | $88$ | $79$ | $64$ | $46$ |

Find the average rate of change of $B$ on $[0, 2]$, on $[2, 7]$ and on $[0, 7]$.

1. On $[0, 2]$: $\dfrac{79 - 100}{2 - 0} = \dfrac{-21}{2} = -10.5$ percentage points per hour.
2. On $[2, 7]$: $\dfrac{46 - 79}{7 - 2} = \dfrac{-33}{5} = -6.6$ points per hour.
3. On $[0, 7]$: $\dfrac{46 - 100}{7} = \dfrac{-54}{7} \approx -7.71$ points per hour.

The battery drained faster early in the day. Notice that the rate over the whole day, about $-7.71$, is *not* the average of $-10.5$ and $-6.6$ (that would be $-8.55$). The two parts lasted 2 hours and 5 hours, so the slower-draining part counts for more. An average rate of change is always total change in output divided by total change in input; never average the rates of the pieces.

## Reading shape from changing rates

On a line, every interval gives the same average rate: that's Lesson 10's slope. On a curve, compare the average rates over intervals of *equal width*, moving left to right:

- If the rates increase, the graph bends upward: it gets steeper going up, or less steep going down. Think of the right half of $y = x^2$.
- If the rates decrease, the graph bends downward, like the ball's path above, where the rates went $48, 16, -16, -48$.

(Calculus calls these shapes concave up and concave down.) This gives a quick test for data in a table with equally spaced inputs: if the differences between consecutive outputs are all equal, the data fit a line; if they grow, the graph curves upward; if they shrink, it curves downward.

## A shortcut for quadratic functions

For a quadratic function the average rate of change has a simple formula. Take $f(x) = ax^2 + bx + c$ and an interval from $p$ to $q$ with $p \ne q$:

$$\frac{f(q) - f(p)}{q - p} = \frac{a(q^2 - p^2) + b(q - p)}{q - p}.$$

The constant $c$ cancels. Now use the fact that $q^2 - p^2 = (q - p)(q + p)$. You can check this with the distributive property: $(q - p)(q + p) = q^2 + qp - pq - p^2 = q^2 - p^2$. Then $q - p$ is a common factor of the numerator, and dividing it out leaves

$$\text{average rate of change on } [p, q] = a(p + q) + b.$$

### Example 3

Use the shortcut for $h(t) = -16t^2 + 64t + 5$ on $[0, 1]$ and on $[1, 4]$, and for $f(x) = x^2$ on $[2, 5]$.

1. For $h$: $a = -16$, $b = 64$. On $[0, 1]$: $-16(0 + 1) + 64 = 48$ ft/s, matching Example 1.
2. On $[1, 4]$: $-16(1 + 4) + 64 = -80 + 64 = -16$ ft/s. Directly: $\dfrac{h(4) - h(1)}{4 - 1} = \dfrac{5 - 53}{3} = -16$. ✓
3. For $x^2$: $a = 1$, $b = 0$. On $[2, 5]$: $2 + 5 = 7$. Directly: $\dfrac{25 - 4}{3} = 7$. ✓

The formula also explains a fact about parabolas: the average rate is 0 exactly when $p + q = -\tfrac{b}{a}$, that is, when the interval is centered on $x = -\tfrac{b}{2a}$, the axis of symmetry. For the ball, $-\tfrac{64}{2(-16)} = 2$, and indeed $[0, 4]$ and $[1, 3]$, both centered on 2, give an average rate of 0.

## The rate at an instant

A car's speedometer doesn't show an average over an interval; it shows how fast you are going *now*. How can a rate be measured at a single instant, when the formula needs two different inputs? The idea is to use shorter and shorter intervals and see what the average rates approach.

Write the interval as $[a, a + h]$, where $h$ is a small nonzero number (positive or negative). The average rate of change on it is the **difference quotient**

$$\frac{f(a + h) - f(a)}{h}.$$

### Example 4

For $f(x) = x^2$, simplify the difference quotient at $a = 3$, and find what it approaches as $h$ gets close to 0.

1. $f(3 + h) = (3 + h)^2 = 9 + 6h + h^2$, so $f(3 + h) - f(3) = 6h + h^2$.
2. Divide by $h$ (allowed, since $h \ne 0$): $\dfrac{6h + h^2}{h} = 6 + h$.
3. Some values: $h = 1$ gives 7, $h = 0.1$ gives 6.1, $h = 0.01$ gives 6.01, and $h = -0.1$ gives 5.9.
4. As $h$ shrinks toward 0 from either side, the average rate approaches 6.

That limiting value, 6, is the **instantaneous rate of change** of $x^2$ at $x = 3$. On the graph, as the second point slides toward $(3, 9)$, the secant lines turn toward a single line that just touches the curve there: the tangent line, with slope 6.

```plot
{"x": [0, 6], "y": [-2, 30], "functions": [{"f": "x^2", "label": "y = x²"}], "tangents": [{"f": "x^2", "at": 3}], "segments": [{"from": [3, 9], "to": [5, 25], "dashed": true, "label": "slope 8"}, {"from": [3, 9], "to": [4, 16], "dashed": true, "label": "slope 7"}], "points": [{"at": [3, 9], "label": "(3, 9)"}, {"at": [4, 16], "label": "(4, 16)"}, {"at": [5, 25], "label": "(5, 25)"}], "caption": "Secants from (3, 9) to (5, 25) and to (4, 16) tilt toward the tangent line at (3, 9), whose slope is 6"}
```

The same idea gives the ball's velocity at an instant. Using the shortcut with $p = 1$ and $q = 1 + h$: the average velocity on $[1, 1 + h]$ is $-16(2 + h) + 64 = 32 - 16h$, which approaches 32 as $h$ approaches 0. One second after the throw, the ball is rising at 32 feet per second. (Check with $h = 1$: $32 - 16 = 16$, the average on $[1, 2]$ from Example 1.)

Making "approaches" precise takes the idea of a limit, and the instantaneous rate of change is called the derivative. Those are the starting point of calculus. In Algebra 1 it is enough to compute difference quotients and see what they get close to.

## Common mistakes

- Dividing by $b$ instead of $b - a$, or subtracting the outputs and inputs in opposite orders.
- Averaging the rates of two parts of an interval instead of dividing the total change in output by the total change in input.
- Assuming the average rate tells you the rate everywhere in the interval. The ball's average velocity on $[0, 4]$ is 0, but it was never at rest except at the top.
- Setting $h = 0$ in $\dfrac{f(a + h) - f(a)}{h}$ before simplifying. That gives $\tfrac00$, which means nothing; simplify first, then let $h$ get close to 0.
- Forgetting units: an average rate of change is in output units per input unit.

## Key points

- The average rate of change of $f$ on $[a, b]$ is $\dfrac{f(b) - f(a)}{b - a}$, the slope of the secant line through $(a, f(a))$ and $(b, f(b))$.
- Over an interval made of parts of different lengths, the average rate is total change over total change, not the average of the parts' rates.
- Over equal-width intervals, increasing rates mean the graph bends upward and decreasing rates mean it bends downward.
- For $f(x) = ax^2 + bx + c$, the average rate on $[p, q]$ is $a(p + q) + b$.
- The difference quotient $\dfrac{f(a + h) - f(a)}{h}$ is the average rate on $[a, a + h]$; the value it approaches as $h \to 0$ is the instantaneous rate of change, the slope of the tangent line.
