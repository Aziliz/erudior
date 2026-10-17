---
id: pc-linear-programming
module: pc-m6
title: Systems of inequalities and linear programming
minutes: 35
topics: [Systems of inequalities, Linear programming]
drills: [pc-lp-max, pc-lp-min]
refs: [pc-ref-matrices-series]
---
## From equations to limits

This module began by solving systems of equations, where every condition must hold *exactly*. Many real conditions are limits instead: a factory has *at most* 40 machine hours, a diet needs *at least* 50 grams of protein, a budget can't go *over* \$2,000. Conditions like these are inequalities, and the points that satisfy all of them at once form a region rather than a single point. This lesson graphs such regions and then answers the natural next question: which point of the region is best? That question is **linear programming**, one of the most widely used pieces of applied mathematics (airline scheduling, shipping routes and factory planning all run on it). We work in two variables, where everything can be drawn.

## Graphing one linear inequality

The line $2x + y = 8$ splits the plane into two sides. Every point on one side makes $2x + y > 8$ and every point on the other makes $2x + y < 8$, so the solutions of $2x + y \le 8$ form a **half-plane**: the line together with everything on one side of it. To graph a linear inequality:

1. Draw the **boundary line** (replace the inequality sign with $=$). Make it solid for $\le$ or $\ge$, since points on the line count, and dashed for $<$ or $>$.
2. Pick a **test point** not on the line, usually $(0, 0)$. If it satisfies the inequality, shade its side; if not, shade the other side.

For $2x + y \le 8$, the test point gives $0 \le 8$, which is true, so shade the side containing the origin. For $y > 2x - 1$, the origin gives $0 > -1$, also true, but the line is dashed. If the line passes through the origin, test a point such as $(1, 0)$ instead.

Why one test point is enough: the expression $2x + y - 8$ is zero only on the line, so it can't change sign without crossing the line. Every point on one side has the same sign as the test point.

## Systems of inequalities

A **system of linear inequalities** is a set of linear inequalities that must all hold. Its solutions, the overlap of all the half-planes, form the **feasible region**. A point where two boundary lines of the region meet is a **corner point** (or vertex) of the region. Find each corner by solving the two boundary equations as a system, exactly as earlier in this module.

A feasible region is **bounded** if it can be enclosed in a circle (a polygon), and unbounded if it stretches off forever in some direction. It can also be empty, when the conditions contradict each other. The same shading idea works for nonlinear inequalities: $y \ge x^2$ is the inside of a parabola, and $x^2 + y^2 < 9$ is the inside of a circle (dashed). Only the linear case leads to the corner point method below.

### Example 1

Graph the system $x \ge 0$, $y \ge 0$, $x + y \le 6$, $2x + y \le 8$, and find its corner points.

1. $x \ge 0$ and $y \ge 0$ keep us in the first quadrant (including the axes).
2. $x + y \le 6$: solid line through $(6, 0)$ and $(0, 6)$; the origin passes ($0 \le 6$), so shade below.
3. $2x + y \le 8$: solid line through $(4, 0)$ and $(0, 8)$; the origin passes, so shade below.
4. Corners: the origin $(0, 0)$; on the $x$-axis the tighter limit is $2x + y \le 8$, giving $(4, 0)$; on the $y$-axis the tighter limit is $x + y \le 6$, giving $(0, 6)$; and where the two slanted lines cross, subtracting $x + y = 6$ from $2x + y = 8$ gives $x = 2$, then $y = 4$, so $(2, 4)$.

The feasible region is the quadrilateral with corners $(0, 0)$, $(4, 0)$, $(2, 4)$ and $(0, 6)$. It is bounded.

```plot
{"x": [-1, 8], "y": [-1, 9], "equal": true, "polygons": [{"points": [[0, 0], [4, 0], [2, 4], [0, 6]], "fill": true}], "functions": [{"f": "6 - x", "from": -0.5, "to": 6.5}, {"f": "8 - 2x", "from": -0.25, "to": 4.25}, {"f": "(140 - 30x)/20", "dashed": true, "from": -0.5, "to": 5}], "labels": [{"at": [1.4, 7], "text": "2x + y = 8"}, {"at": [5.3, 1.6], "text": "x + y = 6"}], "points": [{"at": [0, 0]}, {"at": [4, 0], "label": "(4, 0)"}, {"at": [2, 4], "label": "(2, 4)"}, {"at": [0, 6], "label": "(0, 6)"}], "caption": "The feasible region of Example 1 (shaded). The dashed line is the level line 30x + 20y = 140 from Example 2: it touches the region only at the corner (2, 4)."}
```

## Linear programming

A linear programming problem asks for the largest or smallest value of a linear **objective function**, such as profit $P = 30x + 20y$, over a feasible region whose inequalities are called **constraints**. The key fact is the **corner point principle**: *if the objective function has a maximum (or minimum) on the feasible region, it occurs at a corner point.*

Here's why. The points where $P$ has a particular value, say $30x + 20y = 100$, form a straight line, and different values of $P$ give parallel lines. Raising $P$ slides the line across the plane. The largest $P$ that still touches the region is where the sliding line is about to leave it, and a line leaving a polygon last touches it at a corner (or along a whole edge, if the edge is parallel to the line, in which case both ends of the edge are corners that tie). So you only ever need to check the corners. For a bounded region, a maximum and a minimum always exist.

The method:

1. Name the variables and write the objective function.
2. Write every constraint, including hidden ones like $x \ge 0$, $y \ge 0$.
3. Graph the feasible region and find its corner points.
4. Evaluate the objective at each corner and pick the best.

### Example 2

A workshop builds tables and bookshelves. A table needs 1 hour of cutting and 2 hours of finishing; a bookshelf needs 1 hour of cutting and 1 hour of finishing. Each day there are 6 cutting hours and 8 finishing hours. Profit is \$30 per table and \$20 per bookshelf. How many of each should be built per day to maximize profit?

1. Let $x$ = tables and $y$ = bookshelves. Maximize $P = 30x + 20y$.
2. Cutting: $x + y \le 6$. Finishing: $2x + y \le 8$. Counts: $x \ge 0$, $y \ge 0$.
3. This is the region of Example 1, with corners $(0, 0)$, $(4, 0)$, $(2, 4)$, $(0, 6)$.
4. Evaluate:

| Corner | $P = 30x + 20y$ |
|---|---|
| $(0, 0)$ | $0$ |
| $(4, 0)$ | $120$ |
| $(2, 4)$ | $60 + 80 = 140$ |
| $(0, 6)$ | $120$ |

Build 2 tables and 4 bookshelves for the maximum profit of \$140 per day. Notice that the answer uses all 6 cutting hours and all 8 finishing hours; at the best corner, both constraints are tight.

## Unbounded regions and minimizing

With "at least" constraints the region is often unbounded. A maximum may then fail to exist (profit could grow without limit), but when the objective has positive coefficients and the region lies in the first quadrant, a minimum does exist and the corner point principle still finds it.

### Example 3

A feed mix uses $x$ kg of grain A and $y$ kg of grain B. Each kilogram of A supplies 1 unit of protein and 1 unit of fiber; each kilogram of B supplies 1 unit of protein and 3 units of fiber. The mix needs at least 5 units of protein and at least 9 units of fiber. Grain A costs \$4/kg and grain B \$5/kg. Find the cheapest mix.

1. Minimize $C = 4x + 5y$ subject to $x + y \ge 5$, $x + 3y \ge 9$, $x \ge 0$, $y \ge 0$.
2. The region lies *above* both lines (the origin fails both tests: $0 \ge 5$ is false) and is unbounded.
3. Corners: on the $y$-axis the tighter (higher) requirement is $x + y \ge 5$, giving $(0, 5)$; on the $x$-axis it is $x + 3y \ge 9$, giving $(9, 0)$; the lines cross where $(x + 3y) - (x + y) = 9 - 5$, so $2y = 4$, $y = 2$, $x = 3$, giving $(3, 2)$.
4. Evaluate: $C(0, 5) = 25$, $C(3, 2) = 12 + 10 = 22$, $C(9, 0) = 36$.

The cheapest mix is 3 kg of A and 2 kg of B, costing \$22. (There is no maximum cost: the region goes on forever.)

```plot
{"x": [-1, 11], "y": [-1, 7], "equal": true, "polygons": [{"points": [[0, 7], [0, 5], [3, 2], [9, 0], [11, 0], [11, 7]], "fill": true}], "functions": [{"f": "5 - x", "from": -0.5, "to": 5.5}, {"f": "(9 - x)/3", "from": 2, "to": 11}], "labels": [{"at": [1.1, 1.9], "text": "x + y = 5"}, {"at": [5.8, 0.4], "text": "x + 3y = 9"}], "points": [{"at": [0, 5], "label": "(0, 5)"}, {"at": [3, 2], "label": "(3, 2)"}, {"at": [9, 0], "label": "(9, 0)"}], "caption": "The feasible region of Example 3 is unbounded (it continues up and to the right beyond the picture)."}
```

## Common mistakes

- *Shading the wrong side.* Use a test point rather than guessing from "less than means below"; that shortcut fails for $x$-inequalities and when $y$ has a negative coefficient.
- *Solid vs. dashed.* $\le$ and $\ge$ include the line (solid); $<$ and $>$ don't (dashed).
- *Leaving out $x \ge 0$, $y \ge 0$.* Counts, amounts and times can't be negative, even when the problem doesn't say so.
- *Checking a point that isn't a corner, or missing a corner.* List corners from the graph and confirm each satisfies every constraint.
- *Taking the wrong intercept.* On an axis, the corner comes from the constraint that is tighter there (the smaller intercept for $\le$, the larger for $\ge$).
- *Claiming a maximum on an unbounded region.* Check whether the objective can grow forever.

## Key points

- A linear inequality's solutions form a half-plane: draw the boundary (solid or dashed) and shade the side that passes a test point.
- The feasible region of a system is where all the half-planes overlap; its corners come from solving pairs of boundary equations.
- Linear programming: optimize a linear objective function subject to linear constraints.
- Corner point principle: a maximum or minimum, if it exists, occurs at a corner point.
- A bounded region always has both; an unbounded region may lack a maximum or minimum.
