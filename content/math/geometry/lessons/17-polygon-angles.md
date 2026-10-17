---
id: geo-polygons
module: geo-m5
title: Polygons and their angle sums
minutes: 25
topics: [Polygon angles]
drills: [geo-poly-interior, geo-poly-sides, geo-poly-missing]
refs: [geo-ref-theorems]
---
You know a triangle's angles add to $180^\circ$. What about a pentagon, or a 20-sided figure? This lesson extends the angle sum to every polygon by cutting polygons into triangles, then finds the remarkably simple fact that the exterior angles of *any* convex polygon add to $360^\circ$. These two formulas are behind tilings, gear design and the regular polygons used in Module 8.

## Polygons

A **polygon** is a closed plane figure made of segments (sides) that meet only at their endpoints (vertices), with each vertex shared by exactly two sides and no two adjacent sides collinear. Polygons are named by their number of sides:

| Sides | Name | Sides | Name |
|---|---|---|---|
| 3 | triangle | 8 | octagon |
| 4 | quadrilateral | 9 | nonagon |
| 5 | pentagon | 10 | decagon |
| 6 | hexagon | 12 | dodecagon |
| 7 | heptagon | $n$ | $n$-gon |

A polygon is **convex** if no line containing a side passes through the interior (informally: no "dents"). Otherwise it's **concave**. A **diagonal** joins two non-adjacent vertices. A **regular polygon** is both equilateral (all sides congruent) and equiangular (all angles congruent).

## Interior angle sum

From one vertex of a convex $n$-gon, draw all the diagonals. They cut the polygon into $n - 2$ triangles (each side except the two at that vertex makes one triangle). The triangles' angles together make up exactly the polygon's angles, so:

**Polygon Interior Angles Theorem.** The interior angles of a convex $n$-gon add to

$$S = (n - 2) \cdot 180^\circ.$$

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [8, 4], [4, 7], [-1.5, 4.5]]}], "segments": [{"from": [0, 0], "to": [8, 4], "dashed": true}, {"from": [0, 0], "to": [4, 7], "dashed": true}], "caption": "Two diagonals from one vertex cut a pentagon into 3 triangles: 3 × 180° = 540°."}
```

| $n$ | 3 | 4 | 5 | 6 | 8 | 10 |
|---|---|---|---|---|---|---|
| Sum | $180^\circ$ | $360^\circ$ | $540^\circ$ | $720^\circ$ | $1080^\circ$ | $1440^\circ$ |

The same sum holds for concave polygons too (any polygon whose sides do not cross can be cut into $n - 2$ triangles by suitable diagonals), but the one-vertex fan of diagonals above is the easiest picture for convex ones.

In a regular $n$-gon all the angles are equal, so each interior angle is

$$\frac{(n - 2) \cdot 180^\circ}{n}.$$

### Example 1

Find the interior angle sum of a 15-gon, and each interior angle if it is regular.

**Step 1.** $S = (15 - 2) \cdot 180 = 13 \cdot 180 = 2340^\circ$.

**Step 2.** Each angle of the regular 15-gon is $2340 / 15 = 156^\circ$.

### Example 2

The interior angles of a polygon add to $1980^\circ$. How many sides does it have?

$(n - 2) \cdot 180 = 1980$ gives $n - 2 = 11$, so $n = 13$.

If the sum isn't a multiple of $180^\circ$, no polygon has it.

### Example 3

A hexagon has angles $(x + 10)^\circ$, $2x^\circ$, $130^\circ$, $(x + 20)^\circ$, $(2x - 10)^\circ$ and $140^\circ$. Find $x$.

**Step 1.** A hexagon's angles add to $720^\circ$.

**Step 2.** $(x + 10) + 2x + 130 + (x + 20) + (2x - 10) + 140 = 6x + 290 = 720$.

**Step 3.** $6x = 430$, so $x = 71\tfrac23 \approx 71.67$.

The answer needn't be a whole number; check by adding: the angles are about $81.67, 143.33, 130, 91.67, 133.33, 140$, which sum to $720$.

## Exterior angle sum

At each vertex of a convex polygon, extend one side to form an exterior angle (one per vertex). Each exterior angle forms a linear pair with its interior angle, so the $n$ linear pairs total $180n$. Subtract the interior sum:

$$180n - (n - 2) \cdot 180 = 360.$$

**Polygon Exterior Angles Theorem.** The exterior angles of a convex polygon, one at each vertex, add to $360^\circ$, regardless of the number of sides.

*Intuition:* walk around the polygon. At each corner you turn by the exterior angle. After one lap you face your original direction, having turned one full revolution: $360^\circ$.

For a regular $n$-gon, each exterior angle is $\dfrac{360^\circ}{n}$, and each interior angle is $180^\circ$ minus that. This is often the fastest route.

### Example 4

Each interior angle of a regular polygon is $162^\circ$. How many sides does it have?

**Step 1.** Each exterior angle is $180 - 162 = 18^\circ$.

**Step 2.** $n = 360 / 18 = 20$ sides.

(Using the interior formula, $\tfrac{(n-2)180}{n} = 162$ gives $180n - 360 = 162n$, so $18n = 360$, the same answer with more algebra.)

### Example 5

Can a regular polygon have interior angles of $130^\circ$?

The exterior angle would be $50^\circ$, and $360 / 50 = 7.2$ isn't a whole number. So *no*.

## Diagonals

From each vertex of an $n$-gon you can draw $n - 3$ diagonals (not to itself or its two neighbors). Counting from all $n$ vertices counts each diagonal twice, so a polygon has

$$\frac{n(n - 3)}{2} \text{ diagonals.}$$

A hexagon has $\tfrac{6 \cdot 3}{2} = 9$.

## Which regular polygons tile the plane?

A **tessellation** (tiling) covers the plane with copies of shapes, with no gaps or overlaps. For copies of one regular polygon to meet around a point, a whole number of interior angles must make exactly $360^\circ$.

- Equilateral triangles: $360 / 60 = 6$ meet at each point. ✓
- Squares: $360 / 90 = 4$. ✓
- Regular hexagons: $360 / 120 = 3$. ✓
- Regular pentagons: $360 / 108 \approx 3.33$. ✗

For $n \ge 7$, each interior angle is more than $120^\circ$ but less than $180^\circ$, so more than two but fewer than three fit around a point. So only triangles, squares and hexagons tile by themselves, which is why honeycombs are hexagonal and floor tiles are usually squares.

## Common mistakes

- **Using $n \cdot 180$ instead of $(n - 2) \cdot 180$.**
- **Dividing the sum by $n$ when the polygon isn't regular.** Only regular polygons have equal angles.
- **Thinking exterior sums grow with $n$.** They're always $360^\circ$ (for convex polygons, one per vertex).
- **Mixing interior and exterior angles** when finding $n$: $n = 360 / \text{exterior}$, not $360 / \text{interior}$.

## Key points

- Interior angle sum of an $n$-gon: $(n - 2) \cdot 180^\circ$.
- Exterior angle sum (convex, one per vertex): $360^\circ$.
- Regular $n$-gon: each exterior angle $\tfrac{360^\circ}{n}$; each interior angle $180^\circ - \tfrac{360^\circ}{n}$.
- Number of diagonals: $\tfrac{n(n-3)}{2}$.
