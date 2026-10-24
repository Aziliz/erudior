---
id: trig-m8-h-vector-geometry
module: trig-m8
title: Geometry and proof with vectors
minutes: 45
honors: true
topics: [Vector geometry]
drills: [trig-m8-r2-section, trig-m8-r2-point-line]
refs: [trig-ref-triangles]
---
## Vectors as a language for geometry

Lessons 32 to 34 used vectors to compute: resultants, angles, projections, work. This
lesson uses them to *reason*. Points become vectors, lines become equations in vectors, and
classical theorems of geometry (the medians of a triangle meet at one point, an angle inscribed
in a semicircle is a right angle, the diagonals of a rhombus are perpendicular) come out of a
few lines of algebra with the dot product. The same habits, set up with vectors, then compute,
then read the answer geometrically, are how geometry is done in physics, engineering and
computer graphics, and in higher dimensions where pictures run out.

Two algebra facts, both from expanding dot products as in Lesson 33, do most of the work:
$$\mathbf{v}\cdot\mathbf{v} = \lVert\mathbf{v}\rVert^2, \qquad (\mathbf{u} + \mathbf{v})\cdot(\mathbf{u} - \mathbf{v}) = \lVert\mathbf{u}\rVert^2 - \lVert\mathbf{v}\rVert^2.$$
The second is the dot product version of $(a + b)(a - b) = a^2 - b^2$; expand it and the cross terms
$\mathbf{u}\cdot\mathbf{v}$ and $\mathbf{v}\cdot\mathbf{u}$ cancel because the dot product is commutative.

## Points as position vectors

The **position vector** of a point $A$ is the arrow from the origin to $A$; write it with the same
letter, $A = \langle a_1, a_2\rangle$. Then $\overrightarrow{AB} = B - A$ ("terminal minus initial"), and points can be added and
scaled like vectors.

**Points on a segment.** Starting at $A$ and going a fraction $t$ of the way to $B$ lands at
$$P = A + t(B - A) = (1 - t)A + tB.$$
If $P$ divides $AB$ in the ratio $m : n$ (so $AP : PB = m : n$), then $t = \tfrac{m}{m + n}$ and
$$P = \frac{nA + mB}{m + n},$$
the **section formula**. Notice the weights are crossed: the point closer to $B$ gets more of $B$. The
midpoint is the case $m = n$: $P = \tfrac{A + B}{2}$.

### Example 1

For $A(-2, 1)$ and $B(7, 4)$, find the point one third of the way from $A$ to $B$, and the point that
divides $AB$ in the ratio $2 : 1$.

$B - A = \langle 9, 3\rangle$. One third of the way: $A + \tfrac13\langle 9, 3\rangle = (-2 + 3, 1 + 1) = (1, 2)$.
Ratio $2 : 1$ means $t = \tfrac23$: $A + \tfrac23\langle 9, 3\rangle = (4, 3)$. By the section formula, $\tfrac{1\cdot A + 2\cdot B}{3} = \tfrac{(-2 + 14,\ 1 + 8)}{3} = (4, 3)$. ✓

## The centroid

A **median** of a triangle joins a vertex to the midpoint of the opposite side. Let $M = \tfrac{B + C}{2}$
be the midpoint of $BC$. The point two thirds of the way from $A$ to $M$ is
$$A + \tfrac23(M - A) = \tfrac13A + \tfrac23\cdot\tfrac{B + C}{2} = \frac{A + B + C}{3}.$$
That expression doesn't change if you swap the letters, so the point two thirds of the way down
*each* median is the same point. All three medians pass through it. This point,
$$G = \frac{A + B + C}{3},$$
is the **centroid**, the average of the vertices. A triangle cut from cardboard balances on it.
The proof also shows that the centroid divides each median in the ratio $2 : 1$, measured from the
vertex.

![A triangle ABC with its three medians drawn dashed, each from a vertex to the midpoint of the opposite side. The midpoints of AB, AC and BC are marked with open circles; M is the midpoint of BC, and the median from A to M is labeled. The three medians cross at one point G, the centroid.](images/trig-m8-centroid.svg)

For example, the triangle $A(1, 1)$, $B(7, 2)$, $C(4, 9)$ has centroid $\left(\tfrac{12}{3}, \tfrac{12}{3}\right) = (4, 4)$. As a check,
$M = (5.5, 5.5)$ and $A + \tfrac23(M - A) = (1 + 3, 1 + 3) = (4, 4)$.

## Lines in vector form

A line through the point $P_0$ running in the direction of a nonzero **direction vector** $\mathbf{d}$ is the set of
points
$$P = P_0 + t\,\mathbf{d}, \qquad t \text{ any real number}.$$
(Lesson 37 calls this a parametrization.) The other useful description uses a **normal vector**
$\mathbf{n}$, one perpendicular to the line: a point $P$ is on the line exactly when $P - P_0$ is perpendicular to $\mathbf{n}$,
$$\mathbf{n}\cdot(P - P_0) = 0.$$
With $\mathbf{n} = \langle a, b\rangle$ and $P = (x, y)$, this is $ax + by = c$ where $c = \mathbf{n}\cdot P_0$. So in every line $ax + by = c$,
the coefficient vector $\langle a, b\rangle$ is perpendicular to the line. A normal can be read off a direction
vector by turning it $90^\circ$: $\langle d_1, d_2\rangle \to \langle -d_2, d_1\rangle$.

### Example 2

Write the line through $(1, 2)$ with direction $\mathbf{d} = \langle 3, -1\rangle$ in vector form and as $ax + by = c$.

Vector form: $P = (1, 2) + t\langle 3, -1\rangle$. A normal is $\langle 1, 3\rangle$ (check: $\langle 3, -1\rangle\cdot\langle 1, 3\rangle = 3 - 3 = 0$).
Then $c = \langle 1, 3\rangle\cdot\langle 1, 2\rangle = 7$, so the line is $x + 3y = 7$. Check with $t = 1$: the point $(4, 1)$ gives $4 + 3 = 7$. ✓

## Distance from a point to a line

The shortest path from a point $Q$ to a line is the perpendicular, which runs along the normal.
So the distance is the length of the projection of $Q - P_0$ onto $\mathbf{n}$, for any point $P_0$ on the line:
$$d = \frac{|\mathbf{n}\cdot(Q - P_0)|}{\lVert\mathbf{n}\rVert} = \frac{|ax_0 + by_0 - c|}{\sqrt{a^2 + b^2}} \quad\text{for } Q = (x_0, y_0) \text{ and the line } ax + by = c.$$
The second form follows because $\mathbf{n}\cdot P_0 = c$. The **foot of the perpendicular** (the point on
the line closest to $Q$) is $Q$ minus the vector projection of $Q - P_0$ onto $\mathbf{n}$:
$$F = Q - \frac{ax_0 + by_0 - c}{a^2 + b^2}\,\mathbf{n}.$$

### Example 3

Find the distance from $Q(6, 5)$ to the line $3x + 4y = 12$, and the closest point on the line.

$3(6) + 4(5) - 12 = 26$ and $\sqrt{3^2 + 4^2} = 5$, so $d = \tfrac{26}{5} = 5.2$.
Foot: $F = (6, 5) - \tfrac{26}{25}\langle 3, 4\rangle = (6 - 3.12,\ 5 - 4.16) = (2.88, 0.84)$.
Check: $3(2.88) + 4(0.84) = 8.64 + 3.36 = 12$, so $F$ is on the line, and $\lVert Q - F\rVert = \lVert\langle 3.12, 4.16\rangle\rVert = 5.2$. ✓

```plot
{"x": [-1, 8], "y": [-1, 7], "equal": true, "functions": [{"f": "3 - 0.75x"}], "segments": [{"from": [6, 5], "to": [2.88, 0.84], "dashed": true}], "points": [{"at": [6, 5], "label": "Q(6, 5)"}, [2.88, 0.84]], "labels": [{"at": [1.6, 3.2], "text": "3x + 4y = 12"}, {"at": [5.3, 2.7], "text": "d = 5.2"}, {"at": [2.6, 0.2], "text": "F"}], "rightAngles": [[[2.88, 0.84], [6, 5], [0, 3]]], "caption": "The distance is measured along the normal ⟨3, 4⟩"}
```

## Proving theorems with the dot product

The method: put convenient points at the origin, write the sides as vectors, and turn the
claim ("these are perpendicular", "these lengths are equal") into a statement about dot
products.

### Example 4: an angle in a semicircle is a right angle

Claim: if $AB$ is a diameter of a circle and $P$ is any other point on the circle, then $\angle APB = 90^\circ$.
This is **Thales's theorem**, traditionally credited to Thales of Miletus, around 600 BC.

Put the center at the origin. Then $B$ is some vector $\mathbf{a}$, $A = -\mathbf{a}$, and $P = \mathbf{p}$ with $\lVert\mathbf{p}\rVert = \lVert\mathbf{a}\rVert$
(both are radii). The sides from $P$ are $A - P = -\mathbf{a} - \mathbf{p}$ and $B - P = \mathbf{a} - \mathbf{p}$. Their dot product is
$$(-\mathbf{a} - \mathbf{p})\cdot(\mathbf{a} - \mathbf{p}) = -(\mathbf{p} + \mathbf{a})\cdot(-(\mathbf{p} - \mathbf{a})) = (\mathbf{p} + \mathbf{a})\cdot(\mathbf{p} - \mathbf{a}) = \lVert\mathbf{p}\rVert^2 - \lVert\mathbf{a}\rVert^2 = 0.$$
The two sides are orthogonal, so the angle at $P$ is $90^\circ$. No coordinates were needed.

```plot
{"x": [-4, 4], "y": [-3.5, 3.5], "equal": true, "circles": [{"center": [0, 0], "r": 3}], "segments": [{"from": [-3, 0], "to": [3, 0]}, {"from": [-3, 0], "to": [1.268, 2.719]}, {"from": [1.268, 2.719], "to": [3, 0]}], "points": [[-3, 0], [3, 0], [1.268, 2.719], {"at": [0, 0], "label": "O"}], "labels": [{"at": [-3.35, 0.35], "text": "A"}, {"at": [3.35, 0.35], "text": "B"}, {"at": [1.45, 3.1], "text": "P"}, {"at": [-1.5, -0.8], "text": "diameter AB"}], "rightAngles": [[[1.268, 2.719], [-3, 0], [3, 0]]], "caption": "Thales: the angle at P is 90° wherever P sits on the circle"}
```

The identical algebra proves that the diagonals of a rhombus are perpendicular. In a
parallelogram with sides $\mathbf{u}$ and $\mathbf{v}$ from one corner, the diagonals are $\mathbf{u} + \mathbf{v}$ and $\mathbf{u} - \mathbf{v}$, and
$(\mathbf{u} + \mathbf{v})\cdot(\mathbf{u} - \mathbf{v}) = \lVert\mathbf{u}\rVert^2 - \lVert\mathbf{v}\rVert^2$, which is zero exactly when the sides are equal. So a
parallelogram has perpendicular diagonals if and only if it is a rhombus.

Two more facts about any parallelogram $ABCD$ (vertices in order) follow quickly:

- **The diagonals bisect each other.** $\overrightarrow{AB} = \overrightarrow{DC}$ means $B - A = C - D$, so $D = A + C - B$. The midpoint of
  $BD$ is $\tfrac{B + D}{2} = \tfrac{A + C}{2}$, the midpoint of $AC$.
- **The parallelogram law.** Expanding both squares, the cross terms cancel:
  $$\lVert\mathbf{u} + \mathbf{v}\rVert^2 + \lVert\mathbf{u} - \mathbf{v}\rVert^2 = 2\lVert\mathbf{u}\rVert^2 + 2\lVert\mathbf{v}\rVert^2.$$
  The squares of the two diagonals add up to the squares of the four sides.

### Example 5

A parallelogram has sides 5 and 7, and one diagonal is 10. How long is the other diagonal?

By the parallelogram law, $10^2 + d^2 = 2(5^2) + 2(7^2) = 148$, so $d^2 = 48$ and $d = 4\sqrt3 \approx 6.93$.
(A check with the law of cosines: the angle opposite the 10 diagonal has $\cos\theta = \tfrac{25 + 49 - 100}{70} = -\tfrac{13}{35}$;
the other diagonal is opposite the supplementary angle, so $d^2 = 74 + 70\cdot\left(-\tfrac{13}{35}\right) = 74 - 26 = 48$.)

Halving a diagonal gives a median, so the same law gives the length of a median of a triangle
with sides $a$, $b$, $c$: the median to side $a$ has length $\tfrac12\sqrt{2b^2 + 2c^2 - a^2}$.

## Why the inequalities hold

Lesson 33 stated the **Cauchy–Schwarz inequality** $|\mathbf{u}\cdot\mathbf{v}| \le \lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert$ from $|\cos\theta| \le 1$. That
argument leans on the picture of an angle. Here is a proof that uses only algebra, which is
why the same inequality holds for vectors with any number of components, and even for
functions. For $\mathbf{v} \ne \mathbf{0}$ and any real number $t$,
$$0 \le \lVert\mathbf{u} - t\mathbf{v}\rVert^2 = \lVert\mathbf{v}\rVert^2 t^2 - 2(\mathbf{u}\cdot\mathbf{v})\,t + \lVert\mathbf{u}\rVert^2.$$
This quadratic in $t$ is never negative, so it has at most one real root and its discriminant is
at most zero: $4(\mathbf{u}\cdot\mathbf{v})^2 - 4\lVert\mathbf{u}\rVert^2\lVert\mathbf{v}\rVert^2 \le 0$. That is Cauchy–Schwarz. Equality means the quadratic
reaches 0, so $\mathbf{u} = t\mathbf{v}$ for some $t$: the vectors are parallel. (If $\mathbf{v} = \mathbf{0}$, both sides are 0.) Cauchy
proved the version for sums in 1821; Bunyakovsky and Schwarz later proved versions for integrals.

The **triangle inequality** follows in one line:
$$\lVert\mathbf{u} + \mathbf{v}\rVert^2 = \lVert\mathbf{u}\rVert^2 + 2\,\mathbf{u}\cdot\mathbf{v} + \lVert\mathbf{v}\rVert^2 \le \lVert\mathbf{u}\rVert^2 + 2\lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert + \lVert\mathbf{v}\rVert^2 = (\lVert\mathbf{u}\rVert + \lVert\mathbf{v}\rVert)^2.$$
Take square roots: $\lVert\mathbf{u} + \mathbf{v}\rVert \le \lVert\mathbf{u}\rVert + \lVert\mathbf{v}\rVert$. A side of a triangle is never longer than the other two
together.

## Common mistakes

- **Crossing the section formula the wrong way.** For $AP : PB = m : n$, the point is $\tfrac{nA + mB}{m + n}$, not $\tfrac{mA + nB}{m + n}$.
  Sanity check: a point near $B$ must look mostly like $B$.
- **Confusing direction and normal vectors.** In $ax + by = c$, $\langle a, b\rangle$ is perpendicular to the line, not along it.
- **Dropping the absolute value or the square root** in the distance formula: divide $|ax_0 + by_0 - c|$ by $\sqrt{a^2 + b^2}$.
- **Proving a special case.** Placing the circle's center at the origin is fine (it loses no
  generality), but choosing a particular $P$ such as the top of the circle proves nothing about
  the others.
- **Assuming any parallelogram has perpendicular or equal diagonals.** Perpendicular diagonals
  mean a rhombus; equal diagonals mean a rectangle.

## Key points

- Section formula: $AP : PB = m : n$ gives $P = \tfrac{nA + mB}{m + n}$; centroid $G = \tfrac{A + B + C}{3}$, two thirds of the way down each median.
- Line: $P = P_0 + t\mathbf{d}$, or $\mathbf{n}\cdot(P - P_0) = 0$; in $ax + by = c$ the vector $\langle a, b\rangle$ is normal.
- Distance from $(x_0, y_0)$ to $ax + by = c$: $\tfrac{|ax_0 + by_0 - c|}{\sqrt{a^2 + b^2}}$.
- $(\mathbf{u} + \mathbf{v})\cdot(\mathbf{u} - \mathbf{v}) = \lVert\mathbf{u}\rVert^2 - \lVert\mathbf{v}\rVert^2$ proves Thales's theorem and the rhombus theorem.
- Parallelogram law: $\lVert\mathbf{u} + \mathbf{v}\rVert^2 + \lVert\mathbf{u} - \mathbf{v}\rVert^2 = 2\lVert\mathbf{u}\rVert^2 + 2\lVert\mathbf{v}\rVert^2$; Cauchy–Schwarz and the triangle inequality follow from expanding squares.
