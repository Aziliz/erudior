---
id: trig-m8-h-rotation-area
module: trig-m8
title: Rotating vectors and measuring area with the determinant
minutes: 45
honors: true
topics: [Rotations and signed area]
drills: [trig-m8-r2-rotate, trig-m8-r2-triangle-area, trig-m8-r2-signed-angle]
refs: [trig-ref-triangles]
---
## Turning, not just stretching

Lesson 32 wrote every vector as $\langle r\cos\alpha, r\sin\alpha\rangle$, where $r$ is the magnitude and $\alpha$ the
direction angle. Lesson 33 found the angle between two vectors from the dot product. Two
questions are left open. First: how do you *turn* a vector by a given angle without changing
its length? Second: the dot product gives $\cos\theta$, which is the same for an angle and its
mirror image, so how do you tell whether $\mathbf{v}$ lies counterclockwise or clockwise from $\mathbf{u}$?

Both answers come from the sum formulas of Lesson 23, and together they lead to a second
product of two vectors, the determinant. It measures area, decides which way a path turns, and
is what computer graphics, robotics and surveying software use every time they rotate a shape
or ask "is this point inside that region?"

## The rotation formula

Let $\mathbf{v} = \langle a, b\rangle = \langle r\cos\alpha, r\sin\alpha\rangle$. Turning it counterclockwise by $\theta$ keeps the length $r$ and
adds $\theta$ to the direction angle, so the new vector is $\langle r\cos(\alpha + \theta), r\sin(\alpha + \theta)\rangle$. Expand with
the sum formulas:
$$r\cos(\alpha + \theta) = r\cos\alpha\cos\theta - r\sin\alpha\sin\theta = a\cos\theta - b\sin\theta,$$
$$r\sin(\alpha + \theta) = r\sin\alpha\cos\theta + r\cos\alpha\sin\theta = a\sin\theta + b\cos\theta.$$
This is the **rotation formula**:
$$\text{rotating } \langle a, b\rangle \text{ by } \theta \text{ gives } \langle a\cos\theta - b\sin\theta,\ a\sin\theta + b\cos\theta\rangle.$$
The length $r$ and the angle $\alpha$ never have to be found: the formula works directly on the components. A
negative $\theta$ rotates clockwise.

Three rotations are worth knowing by heart, because $\cos\theta$ and $\sin\theta$ are $0$ or $\pm1$:

| Rotation | Image of $\langle a, b\rangle$ |
|---|---|
| $90^\circ$ counterclockwise | $\langle -b, a\rangle$ |
| $180^\circ$ | $\langle -a, -b\rangle$ |
| $90^\circ$ clockwise ($-90^\circ$ or $270^\circ$) | $\langle b, -a\rangle$ |

A quick check of the first: $\langle a, b\rangle\cdot\langle -b, a\rangle = -ab + ab = 0$, so the two are perpendicular, and
both have length $\sqrt{a^2 + b^2}$.

### Example 1

Rotate $\mathbf{v} = \langle 4, 2\rangle$ by $30^\circ$ counterclockwise.

With $\cos 30^\circ = \tfrac{\sqrt3}{2}$ and $\sin 30^\circ = \tfrac12$:
$$\left\langle 4\cdot\tfrac{\sqrt3}{2} - 2\cdot\tfrac12,\ 4\cdot\tfrac12 + 2\cdot\tfrac{\sqrt3}{2}\right\rangle = \langle 2\sqrt3 - 1,\ 2 + \sqrt3\rangle \approx \langle 2.464, 3.732\rangle.$$
Check the length: $2.464^2 + 3.732^2 \approx 6.07 + 13.93 = 20.00 = 4^2 + 2^2$. The length is unchanged, as it should be.

```plot
{"x": [-1, 6], "y": [-1, 5], "equal": true, "segments": [{"from": [0, 0], "to": [4, 2], "arrow": true}, {"from": [0, 0], "to": [2.464, 3.732], "arrow": true}], "labels": [{"at": [4.6, 1.5], "text": "v = ⟨4, 2⟩"}, {"at": [3.6, 3.7], "text": "rotated 30°"}], "curves": [{"x": "1.5cos(t)", "y": "1.5sin(t)", "t": [0.4636, 0.9872]}], "caption": "Rotation keeps the length and adds 30° to the direction angle"}
```

### Example 2: building a square

Two neighboring corners of a square are $A(1, 1)$ and $B(4, 2)$, and the square lies to the left
of the path from $A$ to $B$. Find the other two corners.

$\overrightarrow{AB} = \langle 3, 1\rangle$. "To the left" of a direction is a $90^\circ$ counterclockwise turn, which gives
$\langle -1, 3\rangle$, a side of the same length perpendicular to $\overrightarrow{AB}$. So $C = B + \langle -1, 3\rangle = (3, 5)$ and
$D = A + \langle -1, 3\rangle = (0, 4)$. Check: $\overrightarrow{DC} = \langle 3, 1\rangle = \overrightarrow{AB}$, so the opposite sides match.

To rotate a *point* $P$ about a center $C$ other than the origin, do it in three moves: take the
vector $P - C$, rotate it, then add $C$ back.

## The determinant of two vectors

Rotate $\mathbf{u} = \langle u_1, u_2\rangle$ by $90^\circ$ to get $\mathbf{u}^\perp = \langle -u_2, u_1\rangle$, and dot it with $\mathbf{v}$:
$$\mathbf{u}^\perp\cdot\mathbf{v} = u_1v_2 - u_2v_1.$$
This number is the **determinant** of $\mathbf{u}$ and $\mathbf{v}$:
$$\det(\mathbf{u}, \mathbf{v}) = \begin{vmatrix} u_1 & v_1 \\ u_2 & v_2 \end{vmatrix} = u_1v_2 - u_2v_1.$$
(Some books call it the 2D cross product, because it is the one nonzero component of the 3D
cross product of $\langle u_1, u_2, 0\rangle$ and $\langle v_1, v_2, 0\rangle$. The names vary; the formula does not.)

Now the geometry. Let $\varphi$ be the **signed angle** from $\mathbf{u}$ to $\mathbf{v}$: positive if you turn counterclockwise
from $\mathbf{u}$ to reach $\mathbf{v}$, negative if clockwise, with $-180^\circ < \varphi \le 180^\circ$. The vector $\mathbf{u}^\perp$ points $90^\circ$
counterclockwise from $\mathbf{u}$, so the angle between $\mathbf{u}^\perp$ and $\mathbf{v}$ is $90^\circ - \varphi$ (up to sign and whole turns,
which cosine ignores). By the dot product formula, using $\lVert\mathbf{u}^\perp\rVert = \lVert\mathbf{u}\rVert$,
$$\det(\mathbf{u}, \mathbf{v}) = \lVert\mathbf{u}\rVert\,\lVert\mathbf{v}\rVert\cos(90^\circ - \varphi) = \lVert\mathbf{u}\rVert\,\lVert\mathbf{v}\rVert\sin\varphi.$$
Side by side with the dot product:
$$\mathbf{u}\cdot\mathbf{v} = \lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert\cos\varphi, \qquad \det(\mathbf{u}, \mathbf{v}) = \lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert\sin\varphi.$$
The dot product measures how much the vectors agree; the determinant measures how much they
turn. Its sign answers the question cosine could not: positive means $\mathbf{v}$ is counterclockwise
from $\mathbf{u}$, negative means clockwise, zero means they are parallel (or one is $\mathbf{0}$).
Swapping the vectors reverses the turn, so $\det(\mathbf{v}, \mathbf{u}) = -\det(\mathbf{u}, \mathbf{v})$.

Squaring and adding the two formulas gives, since $\cos^2\varphi + \sin^2\varphi = 1$,
$$(\mathbf{u}\cdot\mathbf{v})^2 + \det(\mathbf{u}, \mathbf{v})^2 = \lVert\mathbf{u}\rVert^2\lVert\mathbf{v}\rVert^2,$$
the two-dimensional case of **Lagrange's identity**. (You can also check it by expanding both
sides in components.) It shows again why $|\mathbf{u}\cdot\mathbf{v}| \le \lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert$: the leftover is a square.

### Example 3: the signed angle

Find the signed angle from $\mathbf{u} = \langle 3, 1\rangle$ to $\mathbf{v} = \langle -1, 2\rangle$.

$\mathbf{u}\cdot\mathbf{v} = -3 + 2 = -1$ and $\det(\mathbf{u}, \mathbf{v}) = 3\cdot2 - 1\cdot(-1) = 7$. Both equal $\lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert = \sqrt{50}$
times $\cos\varphi$ and $\sin\varphi$, so the point $(\cos\varphi, \sin\varphi)$ is a positive multiple of $(-1, 7)$: quadrant II.
The reference angle is $\tan^{-1} 7 \approx 81.87^\circ$, so $\varphi \approx 180^\circ - 81.87^\circ = 98.13^\circ$, counterclockwise.
(Programming languages do this placement for you with the two-argument function
$\text{atan2}(y, x)$, here $\text{atan2}(\det, \text{dot})$. Spreadsheets have it too, as ATAN2, but with the two
arguments in the opposite order.) The signed angle from $\mathbf{v}$ back to $\mathbf{u}$ is $-98.13^\circ$.

## Area from the determinant

Put $\mathbf{u}$ and $\mathbf{v}$ tail to tail and complete the parallelogram. Take $\mathbf{u}$ as the base, of length $\lVert\mathbf{u}\rVert$.
The height is the distance from the tip of $\mathbf{v}$ to the line of $\mathbf{u}$, which is $\lVert\mathbf{v}\rVert\,|\sin\varphi|$ by
right-triangle trig. So
$$\text{area of the parallelogram} = \lVert\mathbf{u}\rVert\,\lVert\mathbf{v}\rVert\,|\sin\varphi| = |\det(\mathbf{u}, \mathbf{v})|,$$
and a triangle with two sides $\mathbf{u}$ and $\mathbf{v}$ has half that. This is the formula
$\text{Area} = \tfrac12 ab\sin C$ from Lesson 31, written so that no angle or length has to be found first.

![A parallelogram spanned by vector u along the bottom and vector v rising up and to the right from the same corner, with the angle phi between them. A dashed height h = ‖v‖ sin phi drops from the tip of v to the base at a right angle. The text inside reads area = ‖u‖ h = |det(u, v)|.](images/trig-m8-parallelogram-area.svg)

The determinant without the absolute value is the **signed area**: positive when $\mathbf{v}$ is
counterclockwise from $\mathbf{u}$, negative when clockwise.

### Example 4

Find the area of the triangle with vertices $A(1, 2)$, $B(6, 3)$, $C(3, 7)$.

Use two sides leaving $A$: $\overrightarrow{AB} = \langle 5, 1\rangle$ and $\overrightarrow{AC} = \langle 2, 5\rangle$.
$\det(\overrightarrow{AB}, \overrightarrow{AC}) = 5\cdot5 - 1\cdot2 = 23$, so the area is $\tfrac{23}{2} = 11.5$.

The sign is a bonus: $23 > 0$, so $C$ is counterclockwise from $B$ as seen from $A$, and the
vertices $A, B, C$ go around counterclockwise. A check by Lesson 31's formula:
$\cos A = \tfrac{\overrightarrow{AB}\cdot\overrightarrow{AC}}{\sqrt{26}\sqrt{29}} = \tfrac{15}{\sqrt{754}}$, so $\sin A = \sqrt{1 - \tfrac{225}{754}} = \tfrac{23}{\sqrt{754}}$ and $\tfrac12\sqrt{26}\sqrt{29}\cdot\tfrac{23}{\sqrt{754}} = 11.5$.

## The shoelace formula

For a polygon, cut it into triangles that all share the origin as a corner. Adding their
*signed* areas makes the pieces outside the polygon cancel, and what is left is the
**shoelace formula**: for a polygon whose vertices $(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)$ are listed in order
around the boundary,
$$\text{Area} = \tfrac12\left|\,\sum_{k=1}^{n} (x_k y_{k+1} - x_{k+1} y_k)\right|, \qquad (x_{n+1}, y_{n+1}) = (x_1, y_1).$$
Each term is $\det$ of two consecutive position vectors. The sum is positive when the vertices go
counterclockwise. The name comes from the criss-cross pattern of the products when the
coordinates are written in two columns. Two conditions matter: the vertices must be in order
around the boundary, and the polygon must not cross itself.

### Example 5

Find the area of the pentagon with vertices $(2, 1)$, $(7, 2)$, $(8, 6)$, $(3, 7)$, $(0, 4)$, in that order.

| From | To | $x_k y_{k+1} - x_{k+1} y_k$ |
|---|---|---|
| $(2, 1)$ | $(7, 2)$ | $4 - 7 = -3$ |
| $(7, 2)$ | $(8, 6)$ | $42 - 16 = 26$ |
| $(8, 6)$ | $(3, 7)$ | $56 - 18 = 38$ |
| $(3, 7)$ | $(0, 4)$ | $12 - 0 = 12$ |
| $(0, 4)$ | $(2, 1)$ | $0 - 8 = -8$ |

The sum is $65$, so the area is $\tfrac{65}{2} = 32.5$. The sum is positive, so the vertices were listed
counterclockwise. A negative first term is normal; only the total matters.

```plot
{"x": [-1, 9], "y": [-1, 8], "equal": true, "polygons": [{"points": [[2, 1], [7, 2], [8, 6], [3, 7], [0, 4]]}], "points": [[2, 1], [7, 2], [8, 6], [3, 7], [0, 4]], "labels": [{"at": [2.2, 0.4], "text": "(2, 1)"}, {"at": [7.9, 1.6], "text": "(7, 2)"}, {"at": [8.1, 6.6], "text": "(8, 6)"}, {"at": [3, 7.5], "text": "(3, 7)"}, {"at": [1, 4.2], "text": "(0, 4)"}], "caption": "The pentagon of Example 5: area 32.5"}
```

## Which way does the path turn?

A robot drives from $A$ to $B$ and then on to $C$. At $B$ it turns left if $\det(\overrightarrow{AB}, \overrightarrow{BC}) > 0$ and
right if it is negative; zero means it keeps going straight (or reverses). This
**orientation test** uses only multiplication and subtraction, no angles, which is why it is the
basic step in programs that find the boundary around a set of points or decide whether a point
is inside a triangle (it is inside exactly when it is on the same side of all three edges).

For example, from $A(0, 0)$ to $B(4, 1)$ to $C(5, 4)$: $\det(\langle 4, 1\rangle, \langle 1, 3\rangle) = 12 - 1 = 11 > 0$, a left turn.

## Common mistakes

- **Rotating with the wrong signs.** The minus sign goes in the first component:
  $\langle a\cos\theta - b\sin\theta,\ a\sin\theta + b\cos\theta\rangle$. A check: rotating $\langle 1, 0\rangle$ by $90^\circ$ must give $\langle 0, 1\rangle$.
- **Rotating a point about the wrong center.** Subtract the center first, rotate, then add it back.
- **Swapping the order in the determinant.** $\det(\mathbf{u}, \mathbf{v}) = u_1v_2 - u_2v_1$; reversing the vectors flips the sign.
- **Forgetting the $\tfrac12$ for a triangle**, or the absolute value when you want an area.
- **Using the shoelace formula on vertices out of order.** Listing them in a criss-cross order
  describes a self-crossing polygon and gives the wrong area.

## Key points

- Rotation by $\theta$: $\langle a, b\rangle \mapsto \langle a\cos\theta - b\sin\theta,\ a\sin\theta + b\cos\theta\rangle$; by $90^\circ$: $\langle -b, a\rangle$.
- $\det(\mathbf{u}, \mathbf{v}) = u_1v_2 - u_2v_1 = \lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert\sin\varphi$, with $\varphi$ the signed angle from $\mathbf{u}$ to $\mathbf{v}$.
- Dot product and determinant together give the signed angle: $\cos\varphi$ and $\sin\varphi$ are in the ratio $\text{dot} : \det$.
- Parallelogram area $= |\det(\mathbf{u}, \mathbf{v})|$; triangle area $= \tfrac12|\det|$; polygons by the shoelace formula.
- The sign of $\det(\overrightarrow{AB}, \overrightarrow{BC})$ tells whether the path $A \to B \to C$ turns left (positive) or right (negative).
