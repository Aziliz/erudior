---
id: mv-vectors
module: mv-m1
title: Space and vectors
minutes: 30
topics: [3D coordinates, Vector algebra]
drills: [mv-d-dist3, mv-d-vec-ops, mv-d-unit]
refs: [mv-ref-vectors]
---
## From the plane to space

Single-variable calculus lives in the plane. To study functions of two variables, surfaces,
and motion in space, we need a third axis. This lesson sets up **three-dimensional coordinates** and the objects we will use to describe directions and displacements in
them: vectors.

Take three mutually perpendicular number lines through a common origin $O$: the $x$-, $y$-
and $z$-axes. We orient them by the **right-hand rule**: curl the fingers of your right hand
from the positive $x$-axis toward the positive $y$-axis, and your thumb points along the
positive $z$-axis. A point is an ordered triple $(x, y, z)$. The three **coordinate planes** ($xy$, $yz$, $xz$) split space into eight octants; the first octant is where all
three coordinates are positive.

Equations in space describe surfaces, not curves. The equation $z = 3$ is not a line: it is
the horizontal plane of all points with height 3. The equation $y = x$ is a vertical plane
containing the $z$-axis.

## Distance and spheres

The distance between $P_1(x_1,y_1,z_1)$ and $P_2(x_2,y_2,z_2)$ is

$$|P_1P_2| = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}.$$

Why: go from $P_1$ to the point directly below or above $P_2$; that horizontal leg has
length $\sqrt{\Delta x^2+\Delta y^2}$ by the planar formula. The vertical leg $\Delta z$ is
perpendicular to it, so Pythagoras once more gives the result.

A **sphere** is the set of points at a fixed distance $r$ from a center $(h,k,l)$. Squaring
the distance formula gives its equation:

$$(x-h)^2 + (y-k)^2 + (z-l)^2 = r^2.$$

When the equation arrives expanded, complete the square in each variable to find the center
and radius.

### Example 1

Find the center and radius of $x^2+y^2+z^2 - 4x + 6z + 4 = 0$.

1. Group: $(x^2-4x) + y^2 + (z^2+6z) = -4$.
2. Complete squares: add $4$ for $x$ and $9$ for $z$ to both sides:
   $(x-2)^2 + y^2 + (z+3)^2 = -4 + 4 + 9 = 9$.
3. Center $(2, 0, -3)$, radius $3$.

## Vectors

A **vector** is a quantity with both length and direction, drawn as an arrow. The vector
from $A(a_1,a_2,a_3)$ to $B(b_1,b_2,b_3)$ is $\overrightarrow{AB} = \langle b_1-a_1,\;
b_2-a_2,\; b_3-a_3\rangle$. Its entries are its **components**. Two arrows with the same
length and direction represent the same vector, wherever they are drawn; the copy that
starts at the origin is the **position vector** of its tip.

The **magnitude** (length) of $\mathbf v = \langle v_1,v_2,v_3\rangle$ comes straight from
the distance formula:

$$|\mathbf v| = \sqrt{v_1^2+v_2^2+v_3^2}.$$

### Vector algebra

Vectors add componentwise, and a **scalar** (a real number) multiplies every component:

$$\mathbf u + \mathbf v = \langle u_1+v_1,\,u_2+v_2,\,u_3+v_3\rangle,\qquad c\,\mathbf v = \langle cv_1,\,cv_2,\,cv_3\rangle.$$

Geometrically, $\mathbf u+\mathbf v$ is found tip-to-tail: start $\mathbf v$ where $\mathbf u$
ends, and the sum runs from the start of $\mathbf u$ to the end of $\mathbf v$. Multiplying by
$c$ stretches the arrow by $|c|$ and reverses it when $c<0$. Two nonzero vectors are
**parallel** when one is a scalar multiple of the other.

```plot
{"x": [-1, 6], "y": [-1, 5], "equal": true, "segments": [{"from": [0, 0], "to": [4, 1], "arrow": true, "label": "u"}, {"from": [4, 1], "to": [5, 4], "arrow": true, "label": "v"}, {"from": [0, 0], "to": [5, 4], "arrow": true, "label": "u + v"}, {"from": [0, 0], "to": [1, 3], "arrow": true, "dashed": true, "label": "v"}, {"from": [1, 3], "to": [5, 4], "dashed": true}], "caption": "Tip-to-tail addition: the sum is the diagonal of the parallelogram"}
```

These rules obey the familiar laws: $\mathbf u+\mathbf v = \mathbf v+\mathbf u$,
$c(\mathbf u+\mathbf v) = c\mathbf u + c\mathbf v$, and $|c\mathbf v| = |c|\,|\mathbf v|$.

### Standard basis and unit vectors

The **standard basis vectors** are $\mathbf i = \langle1,0,0\rangle$,
$\mathbf j = \langle0,1,0\rangle$, $\mathbf k = \langle0,0,1\rangle$, so every vector can be
written $\langle a,b,c\rangle = a\mathbf i + b\mathbf j + c\mathbf k$.

A **unit vector** has length 1. To get the unit vector in the direction of a nonzero
$\mathbf v$, divide by its length:

$$\mathbf u = \frac{\mathbf v}{|\mathbf v|}.$$

This is called *normalizing* $\mathbf v$. It keeps the direction and throws away the size,
which is exactly what we need when a formula asks for "a direction" (directional
derivatives, unit tangent vectors, unit normals).

### Example 2

Let $A(1,-2,4)$ and $B(3,2,0)$. Find $\overrightarrow{AB}$, its length, and the unit vector
in its direction.

1. $\overrightarrow{AB} = \langle 3-1,\, 2-(-2),\, 0-4\rangle = \langle 2, 4, -4\rangle$.
2. $|\overrightarrow{AB}| = \sqrt{4 + 16 + 16} = \sqrt{36} = 6$.
3. Unit vector: $\tfrac16\langle 2,4,-4\rangle = \left\langle \tfrac13, \tfrac23, -\tfrac23\right\rangle$.

Check: $\tfrac19 + \tfrac49 + \tfrac49 = 1$, so it is indeed a unit vector.

### Example 3: forces

Two ropes pull a crate along the floor with forces $\mathbf F_1 = \langle 30, 40, 0\rangle$ N
and $\mathbf F_2 = \langle 50, -10, 0\rangle$ N. The **resultant** force is the sum
$\langle 80, 30, 0\rangle$ N, of magnitude $\sqrt{6400+900} = \sqrt{7300} \approx 85.4$ N.
Forces, velocities and displacements all add as vectors; that is why vectors are the
language of physics.

## Common mistakes

- Subtracting in the wrong order: $\overrightarrow{AB}$ is *end minus start*, $B - A$.
- Thinking $|\mathbf u + \mathbf v| = |\mathbf u| + |\mathbf v|$. Lengths only add when the vectors point the same way; in general $|\mathbf u+\mathbf v| \le |\mathbf u|+|\mathbf v|$ (the triangle inequality).
- Reading $x = 2$ in space as a point or a line; it is a plane.
- Forgetting a sign when completing the square, which moves the center to the wrong octant.

## Key points

- Distance in space: $\sqrt{\Delta x^2+\Delta y^2+\Delta z^2}$; a sphere is $(x-h)^2+(y-k)^2+(z-l)^2=r^2$.
- Vectors add and scale componentwise; $|\mathbf v| = \sqrt{v_1^2+v_2^2+v_3^2}$.
- $\mathbf v/|\mathbf v|$ is the unit vector in the direction of $\mathbf v$.
- $\mathbf i, \mathbf j, \mathbf k$ are the unit vectors along the axes.
