---
id: alg-slope
module: alg-m3
title: Slope and rate of change
minutes: 25
topics: [Slope]
drills: [alg-d-slope-two-points, alg-d-slope-graph]
refs: [alg-ref-equations]
---
The simplest functions are the ones whose graphs are straight lines. What makes a line straight is that it rises or falls at a constant rate, and the number that measures that rate is the slope. This lesson defines slope, shows how to compute it from points, a graph or a table, and explains what it means in real situations. The next lesson uses slope to write equations of lines.

## Rise over run

Pick two points on a line. Moving from the first to the second, the vertical change is the **rise** and the horizontal change is the **run**. The **slope** $m$ is their ratio:

$$m = \frac{\text{rise}}{\text{run}} = \frac{y_2 - y_1}{x_2 - x_1}.$$

The Greek letter delta is often used for "change in," so you'll also see $m = \dfrac{\Delta y}{\Delta x}$.

```plot
{"x": [-1, 7], "y": [-1, 7], "functions": [{"f": "0.75*x + 1", "label": "y = 0.75x + 1"}], "points": [{"at": [0, 1], "label": "(0, 1)"}, {"at": [4, 4], "label": "(4, 4)"}], "segments": [{"from": [0, 1], "to": [4, 1], "dashed": true, "label": "run 4"}, {"from": [4, 1], "to": [4, 4], "dashed": true, "label": "rise 3"}], "equal": true, "caption": "From (0, 1) to (4, 4): rise 3, run 4, slope 3/4"}
```

Why is the slope the same no matter which two points you choose? Any two "slope triangles" on the same line are similar triangles: they have the same angles, so the ratio of their vertical side to their horizontal side is the same. That constant ratio is exactly what makes the graph a straight line.

### Example 1

Find the slope of the line through $(-2, 5)$ and $(4, -7)$.

1. Label: $(x_1, y_1) = (-2, 5)$ and $(x_2, y_2) = (4, -7)$.
2. $m = \dfrac{-7 - 5}{4 - (-2)} = \dfrac{-12}{6} = -2$.
3. Swapping the points gives $\dfrac{5 - (-7)}{-2 - 4} = \dfrac{12}{-6} = -2$, the same. Just be consistent: subtract in the same order on top and bottom.

## What the sign of the slope tells you

| Slope | Line | Example |
|---|---|---|
| $m > 0$ | rises from left to right | $y = 2x$ |
| $m < 0$ | falls from left to right | $y = -x + 3$ |
| $m = 0$ | horizontal | $y = 4$ |
| undefined | vertical | $x = -1$ |

A **horizontal line** has rise 0 for every run, so its slope is $0$. A **vertical line** has run 0, and dividing by zero is undefined, so a vertical line has **undefined slope**. Don't confuse "zero slope" with "no slope": they describe opposite lines.

The size of the slope measures steepness. A line with slope $-5$ is steeper than one with slope $2$, because $|-5| > |2|$.

```plot
{"x": [-4, 4], "y": [-4, 4], "functions": [{"f": "3*x", "label": "m = 3"}, {"f": "0.5*x", "label": "m = 1/2"}, {"f": "-x", "label": "m = -1", "dashed": true}, {"f": "-2", "label": "m = 0"}], "equal": true, "caption": "Larger |m| means steeper; the sign gives the direction"}
```

### Example 2

Find the slope through $(3, -1)$ and $(3, 6)$, and through $(-4, 2)$ and $(5, 2)$.

1. First pair: $m = \dfrac{6 - (-1)}{3 - 3} = \dfrac{7}{0}$, undefined. Both points have $x = 3$, so the line is vertical: $x = 3$.
2. Second pair: $m = \dfrac{2 - 2}{5 - (-4)} = \dfrac{0}{9} = 0$. The line is horizontal: $y = 2$.

## Slope from a graph

To read slope from a graph, find two points where the line crosses grid intersections exactly, then count the rise (up is positive, down is negative) and the run (right is positive). Choosing points far apart reduces the effect of small reading errors.

## Slope from a table

In a table of a linear function, the outputs change by the same amount for each equal step in the inputs.

| $x$ | 1 | 3 | 5 | 7 |
|---|---|---|---|---|
| $y$ | 10 | 16 | 22 | 28 |

Each step of 2 in $x$ adds 6 to $y$, so the slope is $\tfrac{6}{2} = 3$. If the changes in $y$ were not proportional to the changes in $x$, the data would not lie on a line.

## Slope as a rate of change

Slope carries units: units of the output per unit of the input. That makes it a **rate of change**.

### Example 3

A car's fuel tank holds 14 gallons after 60 miles and 9.5 gallons after 150 miles. Find and interpret the slope.

1. Points $(60, 14)$ and $(150, 9.5)$, with $x$ in miles and $y$ in gallons.
2. $m = \dfrac{9.5 - 14}{150 - 60} = \dfrac{-4.5}{90} = -0.05$ gallons per mile.
3. Interpretation: the tank loses 0.05 gallons for every mile driven (equivalently, the car gets $1 / 0.05 = 20$ miles per gallon). The negative sign says the amount of fuel is decreasing.

### Example 4

A hiking trail climbs from an elevation of 1,250 m to 1,610 m over a horizontal distance of 4.5 km. What is its average slope in meters per kilometer, and as a percent grade?

1. Rise: $1610 - 1250 = 360$ m. Run: $4.5$ km $= 4500$ m.
2. In meters per kilometer: $\dfrac{360}{4.5} = 80$ m/km.
3. As a pure ratio (same units): $\dfrac{360}{4500} = 0.08$, an 8% grade.

For a nonlinear graph, the slope between two points is called the **average rate of change** over that interval. It's the slope of the straight segment joining the two points.

## Common mistakes

- Subtracting in opposite orders on top and bottom, which flips the sign.
- Putting run over rise: slope is $\dfrac{\Delta y}{\Delta x}$, vertical over horizontal.
- Calling a vertical line's slope 0. Horizontal is 0; vertical is undefined.
- Forgetting units in an application, or mixing units (meters over kilometers) without saying so.
- Reading points off a graph that don't sit exactly on grid intersections.

## Key points

- $m = \dfrac{y_2 - y_1}{x_2 - x_1}$; any two points on a line give the same slope.
- Positive slope rises, negative falls, zero is horizontal, undefined is vertical.
- $|m|$ measures steepness.
- In context, slope is a rate of change with units "output per input."
- On a curve, the slope between two points is the average rate of change.
