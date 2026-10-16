---
id: mv-lines-planes
module: mv-m1
title: Lines and planes
minutes: 35
topics: [Lines in space, Planes]
drills: [mv-d-plane-3pts, mv-d-point-plane]
refs: [mv-ref-vectors]
---
## Describing flat things with vectors

In the plane, a line is $y = mx + b$: one equation. In space, one linear equation describes
a *plane*, and a line needs a different description. With dot and cross products in hand,
both become easy: a line is "a point plus any multiple of a direction," and a plane is
"all points whose displacement from a given point is perpendicular to a normal vector."

## Lines

A line through the point $P_0(x_0,y_0,z_0)$ parallel to the **direction vector**
$\mathbf v = \langle a,b,c\rangle$ consists of the tips of

$$\mathbf r(t) = \mathbf r_0 + t\mathbf v,\qquad t\in\mathbb R,$$

where $\mathbf r_0$ is the position vector of $P_0$. Componentwise these are the
**parametric equations**

$$x = x_0 + at,\quad y = y_0 + bt,\quad z = z_0 + ct.$$

If none of $a,b,c$ is zero, solving each for $t$ and equating gives the **symmetric equations** $\dfrac{x-x_0}{a} = \dfrac{y-y_0}{b} = \dfrac{z-z_0}{c}$.

The segment from $\mathbf r_0$ to $\mathbf r_1$ is $\mathbf r(t) = (1-t)\mathbf r_0 + t\mathbf r_1$
for $0\le t\le 1$, a parametrization we will use for line integrals.

### Example 1

Find the line through $A(2,-1,3)$ and $B(5,1,2)$, and where it crosses the $xy$-plane.

1. Direction: $\overrightarrow{AB} = \langle 3, 2, -1\rangle$.
2. Parametric: $x = 2+3t$, $y = -1+2t$, $z = 3 - t$.
3. The $xy$-plane is $z = 0$, so $t = 3$: the point is $(11, 5, 0)$.

### Relationships between two lines

In the plane, two lines either meet or are parallel. In space there is a third
possibility: **skew lines**, which are not parallel and never meet (think of a road
passing over a railway). To classify two lines:

1. If their direction vectors are parallel, the lines are parallel (or identical).
2. Otherwise, set the parametric equations equal with *different* parameters $t$ and $s$.
   Solve two of the three equations; if the solution satisfies the third, the lines
   intersect; if not, they are skew.

## Planes

A plane is determined by a point $P_0$ on it and a **normal vector** $\mathbf n = \langle a,b,c\rangle$
perpendicular to it. A point $P$ is on the plane exactly when $\overrightarrow{P_0P}$ is
orthogonal to $\mathbf n$:

$$\mathbf n\cdot(\mathbf r - \mathbf r_0) = 0 \quad\Longleftrightarrow\quad a(x-x_0) + b(y-y_0) + c(z-z_0) = 0.$$

Expanding gives the **scalar equation** $ax + by + cz = d$. The key fact to read off
instantly: *the coefficients of $x, y, z$ are a normal vector.*

### Example 2: plane through three points

Find the plane through $P(1,0,0)$, $Q(0,2,0)$, $R(0,0,3)$.

1. Two vectors in the plane: $\overrightarrow{PQ} = \langle -1,2,0\rangle$, $\overrightarrow{PR} = \langle -1,0,3\rangle$.
2. Normal: $\overrightarrow{PQ}\times\overrightarrow{PR} = \langle 6,3,2\rangle$ (computed in Lesson 4).
3. Through $P$: $6(x-1) + 3y + 2z = 0$, so $6x + 3y + 2z = 6$.

Check with $Q$: $0 + 6 + 0 = 6$ ✓; with $R$: $0+0+6 = 6$ ✓. Dividing by 6 gives the
intercept form $\tfrac x1 + \tfrac y2 + \tfrac z3 = 1$, which makes sense: the plane cuts the
axes at 1, 2 and 3.

### Angles and intersections of planes

Two planes are parallel when their normals are parallel, and perpendicular when their
normals are orthogonal. In general, the angle between planes is the angle between
their normals (taking the acute one). Two non-parallel planes meet in a line whose
direction is perpendicular to both normals, so $\mathbf v = \mathbf n_1\times\mathbf n_2$.

### Example 3

Find the line of intersection of $x + y + z = 1$ and $x - 2y + 3z = 1$.

1. Direction: $\langle1,1,1\rangle\times\langle1,-2,3\rangle = \langle 1\cdot3 - 1\cdot(-2),\; 1\cdot1 - 1\cdot3,\; 1\cdot(-2) - 1\cdot1\rangle = \langle 5,-2,-3\rangle$.
2. A point on both: set $z = 0$; then $x + y = 1$ and $x - 2y = 1$ give $y = 0$, $x = 1$. Point $(1,0,0)$.
3. Line: $x = 1+5t$, $y = -2t$, $z = -3t$.

## Distance from a point to a plane

The distance from $P_1(x_1,y_1,z_1)$ to the plane $ax+by+cz=d$ is

$$D = \frac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2+b^2+c^2}}.$$

*Why:* pick any point $P_0$ on the plane. The shortest path to the plane runs along the
normal, so the distance is the length of the scalar projection of $\overrightarrow{P_0P_1}$
onto $\mathbf n$: $|\mathbf n\cdot\overrightarrow{P_0P_1}|/|\mathbf n|$. Since
$\mathbf n\cdot\mathbf r_0 = d$, the numerator becomes $|ax_1+by_1+cz_1-d|$.

For example, the distance from $(2, 1, 4)$ to $6x+3y+2z = 6$ is
$\dfrac{|12+3+8-6|}{7} = \dfrac{17}{7}$. The distance between parallel planes is the
distance from any point of one to the other.

```plot
{"x": [-1, 5], "y": [-1, 4], "equal": true, "functions": [{"f": "0.5*x", "label": "plane (edge view)"}], "points": [{"at": [1, 3], "label": "P₁"}, {"at": [4, 2], "label": "P₀"}], "segments": [{"from": [1, 3], "to": [2, 1], "dashed": true, "label": "D"}, {"from": [4, 2], "to": [1, 3], "arrow": true}, {"from": [3, 1.5], "to": [2.4, 2.7], "arrow": true, "label": "n"}], "caption": "Seen edge-on, the distance D is the projection of P₀P₁ onto the normal n"}
```

## Common mistakes

- Using a point instead of a direction vector in $\mathbf r_0 + t\mathbf v$ (or the reverse).
- Taking the normal of a plane to be a vector *in* the plane.
- Concluding that two non-parallel lines in space must intersect; they may be skew.
- Using the same parameter for both lines when testing for an intersection.
- Forgetting the absolute value in the distance formula.

## Key points

- Line: $\mathbf r = \mathbf r_0 + t\mathbf v$; plane: $\mathbf n\cdot(\mathbf r-\mathbf r_0) = 0$, i.e. $ax+by+cz=d$ with normal $\langle a,b,c\rangle$.
- Plane through three points: normal is the cross product of two edge vectors.
- Line of two planes: direction $\mathbf n_1\times\mathbf n_2$.
- Point-to-plane distance: $|ax_1+by_1+cz_1-d|/\sqrt{a^2+b^2+c^2}$.
