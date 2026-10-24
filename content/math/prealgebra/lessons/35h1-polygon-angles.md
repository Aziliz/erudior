---
id: pre-m8-h-polygon-angles
module: pre-m8
title: Angles of polygons and tilings
minutes: 40
honors: true
topics: [Polygon angles]
drills: [pre-m8-r2-polygon-sum, pre-m8-r2-regular-angle, pre-m8-r2-polygon-sides]
refs: [pre-ref-geometry]
---
## From triangles to every polygon

Lesson 31 proved that the angles of any triangle add to 180° and named the polygons: quadrilaterals, pentagons, hexagons, octagons. It also mentioned in passing that a quadrilateral's angles add to 360°. This lesson explains where that 360° comes from and finds the angle sum of *every* polygon, using nothing but the triangle fact. Then it uses the result to answer a practical question with a surprisingly short answer: which regular polygons can tile a floor with no gaps? Only three of them can, and you'll be able to prove it.

Throughout, $n$ stands for the number of sides of a polygon. A polygon has as many corners (vertices) as sides.

## Cutting a polygon into triangles

A **diagonal** of a polygon is a segment joining two vertices that are not next to each other. (A segment joining neighbors is a side.)

The angles inside a polygon, one at each vertex, are its **interior angles**. In this lesson the polygons are **convex**: every interior angle is less than 180°, so the polygon has no dents, and every diagonal lies inside it.

Pick one vertex of a convex polygon and draw every diagonal from it. The vertex can't connect to itself or its two neighbors, so there are $n - 3$ diagonals, and they cut the polygon into $n - 2$ triangles.

![A regular hexagon with three dashed diagonals drawn from its left vertex, cutting it into four numbered triangles. The caption reads: diagonals from one vertex, 4 triangles, 4 × 180° = 720°.](images/pre-m8-h-hexagon-triangles.svg)

The triangles' angles together make up exactly the polygon's interior angles: every triangle corner sits at a vertex of the polygon, and at the chosen vertex the triangle corners fit side by side to make up its whole interior angle. Each triangle contributes 180°, so

$$\text{sum of interior angles} = (n - 2) \times 180°.$$

| Polygon | $n$ | Triangles | Angle sum |
|---|---|---|---|
| triangle | 3 | 1 | 180° |
| quadrilateral | 4 | 2 | 360° |
| pentagon | 5 | 3 | 540° |
| hexagon | 6 | 4 | 720° |
| octagon | 8 | 6 | 1,080° |
| decagon | 10 | 8 | 1,440° |

The formula also holds for polygons with dents (non-convex ones), but the proof needs a little more care, since a diagonal can then pass outside the polygon. We stick to convex polygons here.

### Example 1

Find the sum of the interior angles of a 12-sided polygon (a dodecagon).

$(12 - 2) \times 180° = 10 \times 180° = 1{,}800°$.

### Example 2

Four of the angles of a pentagon measure 100°, 110°, 120° and 95°. Find the fifth.

A pentagon's angles add to $(5 - 2) \times 180° = 540°$. The four known angles total $100 + 110 + 120 + 95 = 425°$, so the fifth is $540° - 425° = 115°$.

## Regular polygons

In a regular polygon all $n$ interior angles are equal (Lesson 31), so each one is the sum divided by $n$:

$$\text{each interior angle of a regular polygon} = \frac{(n - 2) \times 180°}{n}.$$

### Example 3

Find each interior angle of a regular hexagon and of a regular decagon.

Hexagon: $\dfrac{4 \times 180°}{6} = \dfrac{720°}{6} = 120°$. Decagon: $\dfrac{8 \times 180°}{10} = \dfrac{1{,}440°}{10} = 144°$.

As $n$ grows, the angles get closer and closer to 180° without reaching it: a regular polygon with many sides looks almost like a circle.

### Example 4

Each interior angle of a regular polygon is 150°. How many sides does it have?

Set up the equation and solve, as in Module 7: $\dfrac{(n - 2) \cdot 180}{n} = 150$. Multiply both sides by $n$: $180n - 360 = 150n$. Subtract $150n$ and add 360: $30n = 360$, so $n = 12$. (The next section gives a quicker way.)

## Exterior angles

Extend one side of a polygon past a vertex. The angle between the extension and the next side is an **exterior angle**. An interior angle and its exterior angle together form a straight angle, so they are supplementary:

$$\text{exterior angle} = 180° - \text{interior angle}.$$

![A regular pentagon with its bottom side extended to the right. An arc marks the interior angle at the bottom-left vertex, another arc marks the exterior angle at the bottom-right vertex between the extension and the next side, a dashed segment joins two vertices that are not neighbors (a diagonal), and one side is labeled side.](images/pre-m8-h-polygon-angles.svg)

Here is the remarkable fact: **for any convex polygon, the exterior angles (one at each vertex) add to 360°**, however many sides it has.

*Why?* Imagine walking around the polygon's edge. At each corner you turn left by that corner's exterior angle. When you get back to the start you are facing the way you began, having turned around exactly once: 360°.

The algebra agrees. The $n$ straight angles at the vertices total $n \times 180°$. Take away the interior angles, $(n - 2) \times 180°$, and what's left is $n \times 180° - (n - 2) \times 180° = 2 \times 180° = 360°$.

For a regular polygon, all exterior angles are equal, so each is $\dfrac{360°}{n}$. This gives the quick route.

### Example 5

Redo Example 4 with exterior angles.

The exterior angle is $180° - 150° = 30°$. They total 360°, so there are $360 \div 30 = 12$ of them: 12 sides.

And going forward: a regular octagon has exterior angles of $360° \div 8 = 45°$, so each interior angle is $180° - 45° = 135°$. That matches $\tfrac{6 \times 180°}{8} = 135°$.

## Which regular polygons tile a floor?

A **tessellation** (or tiling) covers a flat surface with shapes that leave no gaps and don't overlap, like floor tiles. Suppose we tile using copies of a single regular polygon, meeting corner to corner. Where tiles meet, their angles must fill the full turn around the point exactly: they must add to 360°. So the interior angle must divide 360° a whole number of times.

- Equilateral triangles: 60°, and $360 \div 60 = 6$. Six triangles meet at each point. ✓
- Squares: 90°, and $360 \div 90 = 4$. ✓
- Regular pentagons: 108°, and $360 \div 108 \approx 3.33$. Three leave a 36° gap; four would overlap. ✗
- Regular hexagons: 120°, and $360 \div 120 = 3$. ✓
- Any regular polygon with more than 6 sides: its angle is more than 120° but less than 180°. Two of them make less than 360° and three make more than 360°. ✗

So there are exactly **three** regular tilings: triangles, squares and hexagons. Tilings that mix different regular polygons are possible too; the same rule (angles at each point add to 360°) tells you which mixtures can work.

![Left: a patch of a tiling by regular hexagons, three meeting at each point, with 120° + 120° + 120° = 360°. Right: a tiling by regular octagons with small squares in the gaps; two octagons and one square meet at each point, with 135° + 135° + 90° = 360°.](images/pre-m8-h-tilings.svg)

### Example 6

Can two regular octagons and one square fit together around a point? Can three regular pentagons?

Octagons and square: $135° + 135° + 90° = 360°$. Yes; this is a common bathroom-floor pattern. Pentagons: $3 \times 108° = 324° < 360°$. No: a 36° gap is left.

### A note on honeycombs

Honeybees build their combs from hexagonal cells. A common explanation is that hexagons save wax: among the three regular tilings, hexagons enclose a given area with the least total wall length. In 1999 the mathematician Thomas Hales proved a stronger statement, long known as the honeycomb conjecture: of *all* ways to divide a flat surface into regions of equal area, the regular hexagon pattern uses the least total boundary. (How bees actually come to build hexagons is still studied by biologists; the math explains why the shape is efficient, not how bees achieve it.)

## Common mistakes

- *Using $n \times 180°$ instead of $(n - 2) \times 180°$.* A triangle ($n = 3$) would then have 540°. Test your formula on a triangle.
- *Forgetting to divide by $n$* when asked for one angle of a regular polygon.
- *Dividing by $n$ for a polygon that isn't regular.* Only regular polygons have equal angles.
- *Mixing up interior and exterior angles.* They add to 180° at each vertex; the exterior angles of the whole polygon add to 360°.
- *Thinking the exterior angle sum grows with $n$.* It's always 360° for a convex polygon.
- *Assuming any regular polygon tiles.* The interior angle must divide 360° exactly.

## Key points

- From one vertex, $n - 3$ diagonals split a convex $n$-sided polygon into $n - 2$ triangles.
- Interior angle sum: $(n - 2) \times 180°$. Regular polygon: each angle $\tfrac{(n - 2) \times 180°}{n}$.
- Exterior angle $= 180° -$ interior angle. The exterior angles of a convex polygon add to 360°; for a regular polygon each is $\tfrac{360°}{n}$.
- To find $n$ for a regular polygon, divide 360° by its exterior angle.
- Angles meeting at a point of a tiling add to 360°; the only regular polygons that tile alone are the triangle, square and hexagon.
