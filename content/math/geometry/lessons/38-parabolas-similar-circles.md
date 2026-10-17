---
id: geo-parabola
module: geo-m9
title: Parabolas from focus and directrix; all circles are similar
minutes: 30
topics: [Parabolas, Similar circles]
drills: [geo-parabola-eq, geo-parabola-focus, geo-circle-similar]
refs: [geo-ref-coord]
---
In Lesson 30 a circle's definition (every point the same distance from a center) became the equation $(x - h)^2 + (y - k)^2 = r^2$ through the distance formula. This lesson does the same for a second curve defined by distance, the parabola, which you may know from algebra as the graph of $y = x^2$. Then it uses the transformations of the last two lessons to prove a fact that Lessons 27 and 32 used without proof, and that sits behind $\pi$ and radian measure: all circles are similar.

## The parabola as a set of points

A **parabola** is the set of all points in a plane that are the same distance from a fixed point and a fixed line (the point not on the line). The point is the **focus** and the line is the **directrix**. Distance to a line means the perpendicular distance.

Two more names follow from the definition. The line through the focus perpendicular to the directrix is the **axis of symmetry**; the parabola is its own mirror image across this line. The point of the parabola on the axis, halfway between the focus and the directrix, is the **vertex of the parabola**.

```plot
{"x": [-6, 6], "y": [-2, 7], "equal": true, "functions": [{"f": "x^2/4", "label": "x² = 4y"}, {"f": "-1", "dashed": true, "label": "directrix y = -1"}], "points": [{"at": [0, 1], "label": "F"}, {"at": [4, 4], "label": "P (4, 4)"}, {"at": [0, 0], "label": "V"}], "segments": [{"from": [4, 4], "to": [0, 1], "label": "5"}, {"from": [4, 4], "to": [4, -1], "dashed": true, "label": "5"}], "caption": "Focus F(0, 1), vertex V(0, 0). P is 5 units from F and 5 units from the directrix."}
```

## Deriving the equation

Put the vertex at the origin with the focus above it at $F(0, p)$ and the directrix $y = -p$. (The number $p$ is the directed distance from the vertex to the focus.) A point $P(x, y)$ is on the parabola exactly when

$$\text{distance to } F = \text{distance to the directrix}: \qquad \sqrt{x^2 + (y - p)^2} = |y + p|.$$

Square both sides (both are nonnegative, so nothing is gained or lost):

$$x^2 + y^2 - 2py + p^2 = y^2 + 2py + p^2.$$

The $y^2$ and $p^2$ cancel, leaving

$$x^2 = 4py, \qquad\text{or}\qquad y = \frac{1}{4p}x^2.$$

So every parabola with this setup is the graph of a quadratic. If $p > 0$ the focus is above the vertex and the parabola opens up; if $p < 0$ it opens down. The size of $p$ controls the width: a focus farther from the vertex gives a wider parabola.

**Moving the vertex.** Translating the vertex to $(h, k)$ (Lesson 36) replaces $x$ with $x - h$ and $y$ with $y - k$:

| Opens | Equation | Focus | Directrix |
|---|---|---|---|
| up ($p > 0$) or down ($p < 0$) | $(x - h)^2 = 4p(y - k)$ | $(h,\; k + p)$ | $y = k - p$ |
| right ($p > 0$) or left ($p < 0$) | $(y - k)^2 = 4p(x - h)$ | $(h + p,\; k)$ | $x = h - p$ |

A horizontal directrix gives a parabola opening up or down; a vertical directrix gives one opening left or right. The parabola always opens toward the focus and away from the directrix.

### Example 1: equation from focus and directrix

Find the equation of the parabola with focus $(2, 5)$ and directrix $y = 1$.

**Step 1. Use the definition directly.** For $P(x, y)$: $\sqrt{(x - 2)^2 + (y - 5)^2} = |y - 1|$. Squaring: $(x - 2)^2 + y^2 - 10y + 25 = y^2 - 2y + 1$, so $(x - 2)^2 = 8y - 24 = 8(y - 3)$.

**Step 2. Cross-check with the pattern.** The vertex is halfway between the focus and the directrix: $(2, 3)$. The focus is 2 units above it, so $p = 2$ and $4p = 8$. The equation is $(x - 2)^2 = 8(y - 3)$, matching Step 1. Solved for $y$: $y = \tfrac18(x - 2)^2 + 3$.

**Check.** At $x = 6$: $16 = 8(y - 3)$, so $y = 5$. The point $(6, 5)$ is 4 units from the focus $(2, 5)$ and 4 units above the directrix $y = 1$ ✓.

### Example 2: focus and directrix from an equation

Find the vertex, focus and directrix of $y = -\tfrac12(x - 1)^2 + 4$.

**Step 1. Rewrite in focus form.** Subtract 4 and multiply by $-2$: $(x - 1)^2 = -2(y - 4)$.

**Step 2. Read off the parts.** Vertex $(1, 4)$. $4p = -2$, so $p = -\tfrac12$: the parabola opens down.

**Step 3.** Focus $(1, 4 - \tfrac12) = (1, 3.5)$; directrix $y = 4 + \tfrac12$, that is, $y = 4.5$.

In general, $y = a(x - h)^2 + k$ has $p = \dfrac{1}{4a}$.

**Why the focus matters.** A parabolic mirror reflects every ray that arrives parallel to its axis through the focus. That is why satellite dishes put their receiver at the focus and why a car headlight puts its bulb there (the same paths, run backward).

## All circles are similar

In Lesson 37, two figures are similar when a sequence of rigid motions and dilations maps one onto the other. Here is a short proof that any two circles qualify.

**Theorem.** Any two circles are similar.

**Proof.** Let circle $C_1$ have center $O_1$ and radius $r_1$, and circle $C_2$ have center $O_2$ and radius $r_2$.

1. Translate by the vector from $O_1$ to $O_2$. A translation keeps distances, so $C_1$ goes to the circle with center $O_2$ and radius $r_1$.
2. Dilate that circle with center $O_2$ and scale factor $k = \tfrac{r_2}{r_1}$. A point at distance $r_1$ from $O_2$ moves along its ray to distance $k r_1 = r_2$, so it lands on $C_2$. Every point $Q$ of $C_2$ is reached: it is the image of the point on ray $\overrightarrow{O_2Q}$ at distance $r_1$.

So a translation followed by a dilation maps $C_1$ exactly onto $C_2$, and the circles are similar. $\blacksquare$

**Why it matters.** Similar figures have every length in the same ratio. So the ratio $\tfrac{\text{circumference}}{\text{diameter}}$ is the same for every circle; that common ratio is the number $\pi$. Likewise, arcs with the same central angle are similar, so arc length is proportional to the radius, which is what makes radian measure (Lesson 27) work.

### Example 3: the similarity for two circles

Describe a similarity that maps $(x - 1)^2 + (y + 2)^2 = 9$ onto $(x - 5)^2 + (y - 4)^2 = 36$.

**Step 1. Centers and radii.** $C_1$: center $(1, -2)$, radius 3. $C_2$: center $(5, 4)$, radius 6.

**Step 2. Translate** by $\langle 5 - 1,\; 4 - (-2) \rangle = \langle 4, 6 \rangle$, moving the center to $(5, 4)$.

**Step 3. Dilate** about $(5, 4)$ by $k = \tfrac63 = 2$.

**Check one point.** $(4, -2)$ is on $C_1$. Translate: $(8, 4)$. Dilate about $(5, 4)$: $(5 + 2 \cdot 3,\; 4 + 2 \cdot 0) = (11, 4)$, and $(11 - 5)^2 + 0^2 = 36$ ✓.

## Common mistakes

- **Using $p$ as the focus–directrix distance.** That distance is $2|p|$; $p$ runs from the vertex to the focus.
- **Mixing up $\tfrac{1}{4p}$ and $4p$.** In $y = ax^2$, $a = \tfrac{1}{4p}$; for $y = \tfrac{1}{12}x^2$, $p = 3$, not $\tfrac{1}{48}$.
- **Putting the focus on the wrong side.** The parabola wraps around the focus and away from the directrix.
- **Measuring to the directrix along a slant.** Distance to a line is the perpendicular distance.
- **Dilating about the wrong center.** In the circle proof, dilate about the new center, after translating; otherwise the circle moves off target.

## Key points

- Parabola: points equidistant from the focus and the directrix; the vertex is halfway between them.
- Vertex at the origin, focus $(0, p)$, directrix $y = -p$: $x^2 = 4py$.
- Vertex $(h, k)$: $(x - h)^2 = 4p(y - k)$ opens up or down; $(y - k)^2 = 4p(x - h)$ opens right or left.
- $y = a(x - h)^2 + k$ has $p = \tfrac{1}{4a}$.
- Any two circles are similar: translate center to center, then dilate by $\tfrac{r_2}{r_1}$. That is why $\pi$ is the same for every circle.
