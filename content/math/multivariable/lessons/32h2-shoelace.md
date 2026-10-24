---
id: mv-m7-h-shoelace
module: mv-m7
title: Polygons, the shoelace formula and centroids
minutes: 40
honors: true
topics: [Shoelace formula, Centroids from line integrals]
drills: [mv-m7-r2-shoelace, mv-m7-r2-poly-centroid]
refs: [mv-ref-vector-calculus]
---
## Area from the boundary alone

Lesson 32 turned Green's theorem into an area formula,

$$A = \frac12\oint_C x\,dy - y\,dx,$$

and used it on an ellipse. The formula says something surprising: to find the area of a
region you never need to look inside it. A walk around the edge is enough. This lesson
follows that idea to its most practical form. When the boundary is a polygon, the line
integral becomes a short sum over the corners, the **shoelace formula**, used by surveyors,
map software and computer graphics. The same method then gives the center of a shape from
its boundary, and the sign of the answer turns out to carry information too.

## One edge at a time

Take one straight edge of the boundary, from $(x_a, y_a)$ to $(x_b, y_b)$, and parametrize it
as in Lesson 30: $x = x_a + t\,\Delta x$, $y = y_a + t\,\Delta y$, $0 \le t \le 1$, with
$\Delta x = x_b - x_a$ and $\Delta y = y_b - y_a$. Then

$$x\,dy - y\,dx = \big[(x_a + t\Delta x)\Delta y - (y_a + t\Delta y)\Delta x\big]\,dt = (x_a\Delta y - y_a\Delta x)\,dt,$$

because the two $t$ terms cancel. The integrand is constant, so the edge contributes

$$\int_{\text{edge}} x\,dy - y\,dx = x_a\Delta y - y_a\Delta x = x_a y_b - x_b y_a.$$

That is the 2-by-2 determinant of the two endpoints, the same quantity as the $z$-component of
the cross product $\langle x_a, y_a, 0\rangle\times\langle x_b, y_b, 0\rangle$ from Lesson 4.

## The shoelace formula

Let a polygon have vertices $(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)$, listed in order around
the boundary, and wrap around by setting $(x_{n+1}, y_{n+1}) = (x_1, y_1)$. Add the edges:

$$A = \frac12\sum_{i=1}^{n}\left(x_i y_{i+1} - x_{i+1} y_i\right).$$

The name comes from the way people compute it by hand: list the vertices in a column, repeat
the first at the bottom, and multiply along the diagonals, down-right products minus
down-left products, a crisscross pattern like lacing a shoe. The formula is also called the
surveyor's formula or Gauss's area formula; it was described by the German mathematician
A. L. F. Meister in 1769.

### Example 1

Find the area of the quadrilateral with vertices $(1, 0)$, $(4, 1)$, $(3, 4)$, $(0, 2)$, in that
(counterclockwise) order.

| Edge | $x_i y_{i+1} - x_{i+1} y_i$ |
|---|---|
| $(1, 0)\to(4, 1)$ | $1\cdot1 - 4\cdot0 = 1$ |
| $(4, 1)\to(3, 4)$ | $4\cdot4 - 3\cdot1 = 13$ |
| $(3, 4)\to(0, 2)$ | $3\cdot2 - 0\cdot4 = 6$ |
| $(0, 2)\to(1, 0)$ | $0\cdot0 - 1\cdot2 = -2$ |

The sum is $18$, so $A = 9$. Check another way: the bounding square $[0, 4]\times[0, 4]$ has
area 16, and the four corner triangles cut off have areas $1$, $1.5$, $1.5$ and $3$, leaving
$16 - 7 = 9$. ✓

## What each term means: a fan of triangles

Each term has a picture. The triangle with vertices $O = (0, 0)$, $P_i$ and $P_{i+1}$ has area
$\tfrac12|x_i y_{i+1} - x_{i+1} y_i|$, and the quantity without absolute value is its
**signed area**: positive when $O \to P_i \to P_{i+1}$ turns counterclockwise, negative when it
turns clockwise. The shoelace formula adds the signed areas of the fan of triangles from the
origin to every edge.

When the origin is inside a convex polygon, every triangle is positive and they tile the
polygon. When the origin is outside, some triangles are negative, and they cancel exactly the
parts of the positive triangles that stick out of the polygon. In Example 1 the origin lies
outside, and the last edge gave $-2$: the triangle $O$, $(0, 2)$, $(1, 0)$ lies outside the
quadrilateral and is subtracted.

```plot
{"x": [-1, 4.5], "y": [-0.9, 4.5], "equal": true, "polygons": [{"points": [[1, 0], [4, 1], [3, 4], [0, 2]]}, {"points": [[0, 0], [4, 1], [3, 4]], "fill": true}, {"points": [[0, 0], [0, 2], [1, 0]], "fill": true}], "points": [{"at": [0, 0]}, {"at": [1, 0]}, {"at": [4, 1], "label": "(4, 1)"}, {"at": [3, 4], "label": "(3, 4)"}, {"at": [0, 2]}], "labels": [{"at": [-0.25, 0.12], "text": "O"}, {"at": [-0.55, 1.95], "text": "(0, 2)"}, {"at": [1.3, -0.65], "text": "(1, 0)"}], "caption": "Two fan triangles from O: the large one (signed area 6.5) adds, the small one at the lower left (signed area −1) is subtracted"}
```

## Orientation, and when the formula misleads

Because it is built from Green's theorem, the formula assumes the boundary is traversed
counterclockwise. Two things can go wrong.

- **Clockwise order.** Listing the same vertices clockwise reverses every edge, so the sum
  changes sign: you get $-A$. Programs use this on purpose. The sign of the sum is an
  **orientation test**: positive means the vertices run counterclockwise, negative clockwise.
  For a triangle it says whether the third point is to the left or right of the line through
  the first two.
- **Self-crossing polygons.** If the edges cross, the sum still equals the signed area, with
  each piece of the region counted by its winding number. That is rarely the area you want.

### Example 2: a bowtie

The "polygon" $(0, 0)\to(2, 2)\to(2, 0)\to(0, 2)\to(0, 0)$ crosses itself at $(1, 1)$. The
terms are $0$, $2\cdot0 - 2\cdot2 = -4$, $2\cdot2 - 0\cdot0 = 4$ and $0$, so the formula gives 0.
Yet the shape covers two triangles of area 1 each. The left triangle is traversed
counterclockwise and the right one clockwise, so they cancel. For a self-crossing outline, split
it at the crossing and treat each simple piece on its own.

## Centroids from the boundary

The centroid of a region $D$ is $\bar x = \dfrac1A\iint_D x\,dA$, $\bar y = \dfrac1A\iint_D y\,dA$
(Lesson 24). Green's theorem can turn these into line integrals too. We need $P$ and $Q$ with
$Q_x - P_y = x$: take $Q = \tfrac12x^2$, $P = 0$. For $y$, take $P = -\tfrac12y^2$, $Q = 0$. So

$$\iint_D x\,dA = \frac12\oint_C x^2\,dy, \qquad \iint_D y\,dA = -\frac12\oint_C y^2\,dx.$$

For a polygon, the fan of triangles gives the result faster. The triangle $O P_i P_{i+1}$ has
signed area $\tfrac12c_i$, where $c_i = x_i y_{i+1} - x_{i+1}y_i$, and its centroid is the
average of its vertices, $\left(\tfrac{x_i + x_{i+1}}{3}, \tfrac{y_i + y_{i+1}}{3}\right)$.
The centroid of the whole polygon is the area-weighted average of the triangles' centroids:

$$\bar x = \frac{1}{6A}\sum_{i=1}^{n}(x_i + x_{i+1})\,c_i, \qquad \bar y = \frac{1}{6A}\sum_{i=1}^{n}(y_i + y_{i+1})\,c_i.$$

Negative triangles get negative weights, which subtract their contribution just as they did
for the area. (Working out the line integrals edge by edge gives the same formulas.)

### Example 3: an L-shaped plate

Find the centroid of the L-shaped region with vertices $(0, 0)$, $(4, 0)$, $(4, 1)$, $(1, 1)$,
$(1, 3)$, $(0, 3)$, listed counterclockwise.

1. The terms $c_i$, edge by edge: $0\cdot0 - 4\cdot0 = 0$; $4\cdot1 - 4\cdot0 = 4$;
   $4\cdot1 - 1\cdot1 = 3$; $1\cdot3 - 1\cdot1 = 2$; $1\cdot3 - 0\cdot3 = 3$; $0\cdot0 - 0\cdot3 = 0$.
   Sum $12$, so $A = 6$.
2. $\sum(x_i + x_{i+1})c_i = 4(0) + 8(4) + 5(3) + 2(2) + 1(3) + 0(0) = 54$, so
   $\bar x = \dfrac{54}{36} = 1.5$.
3. $\sum(y_i + y_{i+1})c_i = 0(0) + 1(4) + 2(3) + 4(2) + 6(3) + 3(0) = 36$, so
   $\bar y = \dfrac{36}{36} = 1$.
4. Check by splitting into rectangles: $[0, 4]\times[0, 1]$ (area 4, centroid $(2, 0.5)$) and
   $[0, 1]\times[1, 3]$ (area 2, centroid $(0.5, 2)$). Then
   $\bar x = \frac{4\cdot2 + 2\cdot0.5}{6} = 1.5$ and $\bar y = \frac{4\cdot0.5 + 2\cdot2}{6} = 1$. ✓

The centroid $(1.5, 1)$ is not in the interior of the plate: it sits exactly on the inner edge from
$(4, 1)$ to $(1, 1)$. For non-convex shapes the centroid can lie on the edge or even outside the
shape (think of a ring, whose centroid is the empty center).

## Where this is used

- **Surveying and maps.** A land parcel is described by the coordinates of its corners, and its
  area comes straight from the shoelace formula. Mapping software computes the areas of
  countries, lakes and building footprints the same way, from outlines with thousands of
  vertices.
- **Planimeters.** Lesson 32's planimeter is the mechanical version: as you trace the boundary,
  its wheel adds up a line integral proportional to the enclosed area, and the dial is scaled to read the area.
- **Computer graphics and geometry software.** The orientation test decides which way a polygon
  faces and whether a point is to the left of an edge, steps inside many algorithms.

## Common mistakes

- Forgetting to wrap around: the last edge, from $(x_n, y_n)$ back to $(x_1, y_1)$, is part of
  the sum.
- Listing the vertices out of order (not around the boundary); the formula then describes a
  different, usually self-crossing, polygon.
- Reporting a negative area. A negative sum means the vertices were clockwise; take the
  absolute value for the area.
- Using the formula on a self-crossing outline and trusting the result.
- Dividing by $A$ instead of $6A$ in the centroid formulas.

## Key points

- One edge from $(x_a, y_a)$ to $(x_b, y_b)$ contributes $x_a y_b - x_b y_a$ to $\oint x\,dy - y\,dx$.
- Shoelace: $A = \tfrac12\sum(x_i y_{i+1} - x_{i+1}y_i)$ for vertices in counterclockwise order.
- Each term is twice the signed area of a fan triangle from the origin; clockwise order flips the
  sign, which makes the formula an orientation test.
- Centroid: $\bar x = \frac{1}{6A}\sum(x_i + x_{i+1})c_i$, $\bar y = \frac{1}{6A}\sum(y_i + y_{i+1})c_i$.
- Self-crossing outlines give a signed total, not the area.
