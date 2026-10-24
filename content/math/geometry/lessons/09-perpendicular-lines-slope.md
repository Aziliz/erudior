---
id: geo-perp-slope
module: geo-m3
title: Perpendicular lines and slope
minutes: 30
topics: [Perpendicular lines, Slope]
drills: [geo-perp-slope, geo-perp-line, geo-point-line-dist]
refs: [geo-ref-coord]
---
The last lesson treated parallel lines with angles. This one adds perpendicular lines and then moves both ideas onto the coordinate plane, where "parallel" and "perpendicular" become simple statements about slope. That link between pictures and algebra is the start of coordinate geometry, which returns in Module 9.

## Perpendicular line theorems

Recall that perpendicular lines meet at right angles. A few theorems let you recognize and use them.

- **Linear pair of congruent angles.** If two lines meet to form a linear pair of congruent angles, the lines are perpendicular. (Each angle is half of $180^\circ$.)
- **Perpendicular Transversal Theorem.** In a plane, if a line is perpendicular to one of two parallel lines, it is perpendicular to the other. (Corresponding angles are both $90^\circ$.)
- **Lines perpendicular to a transversal.** In a plane, two lines perpendicular to the same line are parallel.

## Distance from a point to a line

The **distance from a point to a line** is the length of the perpendicular segment from the point to the line. Why the perpendicular? Any other segment from the point to the line is the hypotenuse of a right triangle whose leg is the perpendicular segment, and a hypotenuse is always longer than a leg. So the perpendicular segment is the shortest path.

```shape
{"segments": [{"from": [-1, 0], "to": [9, 0]}, {"from": [3, 4], "to": [3, 0], "label": "shortest"}, {"from": [3, 4], "to": [7, 0], "dashed": true}, {"from": [3, 4], "to": [0, 0], "dashed": true}], "rightAngles": [[[3, 0], [7, 0], [3, 4]]], "points": [{"at": [3, 4], "label": "P"}], "caption": "The perpendicular segment from P is shorter than any slanted one."}
```

The **distance between two parallel lines** is the length of any segment perpendicular to both. It's the same everywhere, which is what makes parallel lines "equally spaced".

## Slope

The **slope** of the non-vertical line through $(x_1, y_1)$ and $(x_2, y_2)$ is the ratio of vertical change ("rise") to horizontal change ("run"):

$$m = \frac{y_2 - y_1}{x_2 - x_1}.$$

Positive slope rises to the right, negative slope falls, a horizontal line has slope 0, and a vertical line's slope is *undefined* (the run is zero).

**Slope criteria for parallel and perpendicular lines.** For two non-vertical lines with slopes $m_1$ and $m_2$:

- They are parallel exactly when $m_1 = m_2$ (and they are different lines).
- They are perpendicular exactly when $m_1 m_2 = -1$, that is, $m_2 = -\tfrac{1}{m_1}$: the slopes are **negative reciprocals**.

Also: every vertical line is parallel to every other vertical line and perpendicular to every horizontal line.

*Why negative reciprocals?* Take a line with slope $\tfrac{a}{b}$: it goes $b$ right and $a$ up. Rotate that step by $90^\circ$ counterclockwise: going right $b$ becomes going up $b$, and going up $a$ becomes going left $a$. The new step is $-a$ across and $b$ up, so its slope is $\tfrac{b}{-a} = -\tfrac{b}{a}$. Rotating a line by $90^\circ$ flips and negates its slope.

```plot
{"x": [-4, 5], "y": [-1, 5], "equal": true, "segments": [{"from": [0, 0], "to": [3, 2], "arrow": true}, {"from": [0, 0], "to": [-2, 3], "arrow": true}], "labels": [{"at": [2.8, 0.55], "text": "3 right, 2 up"}, {"at": [-2.6, 1.6], "text": "2 left, 3 up"}], "rightAngles": [[[0, 0], [3, 2], [-2, 3]]], "caption": "Turning the step (3 right, 2 up) by 90° gives (2 left, 3 up): slope 2/3 becomes −3/2."}
```

```plot
{"x": [-6, 6], "y": [-5, 5], "equal": true, "functions": [{"f": "0.5x + 1", "label": "m = 1/2"}, {"f": "-2x + 1", "label": "m = −2"}], "caption": "Slopes 1/2 and −2 multiply to −1, so the lines are perpendicular."}
```

### Example 1

Line $\ell$ passes through $(1, -2)$ and $(5, 4)$. Find the slope of a line parallel to $\ell$ and of a line perpendicular to $\ell$.

**Step 1.** $m_\ell = \dfrac{4 - (-2)}{5 - 1} = \dfrac{6}{4} = \dfrac{3}{2}$.

**Step 2.** A parallel line has the same slope, $\tfrac32$.

**Step 3.** A perpendicular line has slope $-\tfrac{1}{3/2} = -\tfrac23$. Check: $\tfrac32 \cdot \left(-\tfrac23\right) = -1$.

## Writing equations of parallel and perpendicular lines

Use the **point-slope form** $y - y_1 = m(x - x_1)$, then rewrite in **slope-intercept form** $y = mx + b$ if asked.

### Example 2

Write the equation of the line through $(4, 1)$ that is perpendicular to $y = 2x - 5$.

**Step 1.** The given slope is 2, so the perpendicular slope is $-\tfrac12$.

**Step 2.** Point-slope: $y - 1 = -\tfrac12(x - 4)$.

**Step 3.** Distribute: $y - 1 = -\tfrac12 x + 2$, so $y = -\tfrac12 x + 3$.

**Check.** Substituting $x = 4$ gives $y = -2 + 3 = 1$. ✓

### Example 3

Are the lines $3x + 4y = 12$ and $8x - 6y = 5$ parallel, perpendicular or neither?

**Step 1.** Solve each for $y$. First: $y = -\tfrac34 x + 3$, slope $-\tfrac34$. Second: $-6y = -8x + 5$, so $y = \tfrac43 x - \tfrac56$, slope $\tfrac43$.

**Step 2.** The product is $-\tfrac34 \cdot \tfrac43 = -1$, so the lines are **perpendicular**.

A shortcut: for $Ax + By = C$ the slope is $-\tfrac{A}{B}$.

The whole decision, including the vertical-line cases, fits in one chart.

```mermaid
flowchart TD
  accTitle: Parallel, perpendicular or neither
  accDescr: Find each line's slope. If both lines are vertical, they are parallel, or the same line if they have the same x-intercept. If exactly one is vertical, the lines are perpendicular when the other is horizontal and neither otherwise. If neither is vertical, compare slopes. Equal slopes with the same y-intercept mean the same line; equal slopes with different y-intercepts mean parallel lines. Unequal slopes whose product is negative 1 mean perpendicular lines; any other unequal slopes mean neither.
  A["Find each line's slope"] --> B{"Is either line vertical?"}
  B -- "both are" --> V2["Parallel, or the same line"]
  B -- "one is" --> V1{"Is the other one horizontal?"}
  V1 -- yes --> PP1["Perpendicular"]
  V1 -- no --> N1["Neither"]
  B -- "neither is" --> E{"Are the slopes equal?"}
  E -- yes --> I{"Same y-intercept?"}
  I -- yes --> S["Same line"]
  I -- no --> PA["Parallel"]
  E -- no --> R{"Do the slopes multiply to negative 1?"}
  R -- yes --> PP2["Perpendicular"]
  R -- no --> N2["Neither"]
```

## Distance from a point to a line, by formula

To find the distance from $P$ to a line with coordinates, you could write the perpendicular through $P$, find where it meets the line, and measure. All of that collapses into one formula. The distance from $(x_0, y_0)$ to the line $Ax + By + C = 0$ is

$$d = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}.$$

The picture puts the pieces of this lesson together for the line $y = 0.75x + 1$, which is $3x - 4y + 4 = 0$. Its slope triangle has run 4 and rise 3. The point where the perpendicular from $P$ meets the line is called the **foot of the perpendicular**; $PF$ is the distance from $P$ to the line, and any slanted segment from $P$ is longer.

![A line on a grid rising to the right. A shaded slope triangle under it has a horizontal leg labeled run = 4 and a vertical leg labeled rise = 3. From a point P below the line, a solid segment marked shortest meets the line at a right angle at the foot F, and a dotted segment marked longer runs from P to another point on the line.](images/geo-m3-slope-perp.svg)

### Example 4

Find the distance from $(2, 7)$ to the line $3x + 4y = 9$.

**Step 1.** Rewrite as $3x + 4y - 9 = 0$, so $A = 3$, $B = 4$, $C = -9$.

**Step 2.** $d = \dfrac{|3(2) + 4(7) - 9|}{\sqrt{9 + 16}} = \dfrac{|25|}{5} = 5$.

## Common mistakes

- **Taking the reciprocal without changing the sign** (or vice versa). The perpendicular to slope 3 is $-\tfrac13$, not $\tfrac13$ or $-3$.
- **Subtracting coordinates in mismatched order.** Use $\tfrac{y_2 - y_1}{x_2 - x_1}$ with the same point first in both.
- **Calling a vertical line's slope zero.** Horizontal is zero; vertical is undefined.
- **Reading slope from $Ax + By = C$ as $A$.** Solve for $y$ first, or use $-\tfrac{A}{B}$.
- **Forgetting the absolute value** in the distance formula.

## Key points

- The distance from a point to a line is measured along the perpendicular.
- Slope $m = \tfrac{y_2 - y_1}{x_2 - x_1}$.
- Parallel lines: equal slopes. Perpendicular lines: slopes multiply to $-1$.
- Use point-slope form $y - y_1 = m(x - x_1)$ to write a line through a point.
- Distance from $(x_0, y_0)$ to $Ax + By + C = 0$ is $\tfrac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}$.
