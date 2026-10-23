---
id: la-cramer-volume
module: la-m6
title: Cramer's rule, the adjugate, and area and volume
minutes: 35
topics: [Cramer's rule, Area and volume]
drills: [la-cramer, la-area, la-area-image]
refs: [la-ref-det]
---
## Two uses of the determinant

The last two lessons computed determinants. This one uses them. First, algebra: the
determinant gives explicit formulas for the solution of $A\mathbf{x} = \mathbf{b}$ and for
$A^{-1}$. These formulas are slow for big matrices, but they show exactly how the answer
depends on the data, which matters in theory and for small symbolic problems. Second,
geometry: $|\det A|$ is an area or volume, and it is the factor by which the transformation
$\mathbf{x} \mapsto A\mathbf{x}$ stretches every region.

## Cramer's rule

For an $n \times n$ matrix $A$ and a vector $\mathbf{b}$, let $A_i(\mathbf{b})$ be $A$ with
column $i$ replaced by $\mathbf{b}$.

> **Cramer's rule**: if $A$ is invertible, the unique solution of $A\mathbf{x} = \mathbf{b}$ has entries
> $$x_i = \frac{\det A_i(\mathbf{b})}{\det A}, \qquad i = 1, \dots, n.$$

Why it works: let $I_i(\mathbf{x})$ be the identity with column $i$ replaced by $\mathbf{x}$.
Then $A\,I_i(\mathbf{x}) = [\,A\mathbf{e}_1 \;\cdots\; A\mathbf{x} \;\cdots\; A\mathbf{e}_n\,] = A_i(\mathbf{b})$.
Expanding along row $i$ shows $\det I_i(\mathbf{x}) = x_i$. Taking determinants and using the
product rule, $\det A \cdot x_i = \det A_i(\mathbf{b})$.

### Example 1

Use Cramer's rule to solve $4x_1 + x_2 = 6$, $3x_1 + 2x_2 = 7$.

1. $A = \begin{bmatrix} 4 & 1 \\ 3 & 2\end{bmatrix}$, $\det A = 8 - 3 = 5$.
2. Replace column 1 by $\mathbf{b} = (6, 7)$: $\det\begin{bmatrix} 6 & 1 \\ 7 & 2\end{bmatrix} = 12 - 7 = 5$, so $x_1 = 5/5 = 1$.
3. Replace column 2: $\det\begin{bmatrix} 4 & 6 \\ 3 & 7\end{bmatrix} = 28 - 18 = 10$, so $x_2 = 10/5 = 2$.
4. Check: $4 + 2 = 6$, $3 + 4 = 7$. ✓

## The adjugate formula for $A^{-1}$

Applying Cramer's rule to $A\mathbf{x} = \mathbf{e}_j$ (whose solution is column $j$ of
$A^{-1}$) leads to a formula for the whole inverse. The **adjugate** (or classical adjoint) of
$A$ is the *transpose* of the matrix of cofactors:

$$\operatorname{adj} A = \begin{bmatrix} C_{11} & C_{21} & \cdots & C_{n1} \\ C_{12} & C_{22} & \cdots & C_{n2} \\ \vdots & & & \vdots \\ C_{1n} & C_{2n} & \cdots & C_{nn}\end{bmatrix}, \qquad A^{-1} = \frac{1}{\det A}\operatorname{adj} A.$$

Note the transpose: the $(i, j)$ entry of $\operatorname{adj} A$ is $C_{ji}$. For
$2 \times 2$ matrices, this is exactly the familiar formula: the cofactors of
$\begin{bmatrix} a & b \\ c & d\end{bmatrix}$ are $C_{11} = d$, $C_{12} = -c$, $C_{21} = -b$,
$C_{22} = a$, so $\operatorname{adj} A = \begin{bmatrix} d & -b \\ -c & a\end{bmatrix}$.

The formula is handy for one entry of an inverse: $(A^{-1})_{ij} = C_{ji}/\det A$. It also
shows that if $A$ has integer entries and $\det A = \pm1$, then $A^{-1}$ has integer entries.

## Determinants as area and volume

> *Theorem.* If $A$ is $2 \times 2$, the area of the parallelogram determined by its columns is $|\det A|$. If $A$ is $3 \times 3$, the volume of the **parallelepiped** (slanted box) determined by its columns is $|\det A|$.

Why: for a diagonal matrix the parallelogram is a rectangle with sides $|a|$ and $|d|$, and
the claim is clear. Column replacements (adding a multiple of one column to the other) don't
change the determinant, and geometrically they shear the parallelogram along one side, which
keeps the same base and height, hence the same area. Every matrix can be sheared to a
diagonal one this way (or has dependent columns, giving a flat parallelogram of area 0).

```plot
{"x": [-1, 8], "y": [-1, 3], "equal": true, "polygons": [{"points": [[0, 0], [3, 0], [7, 2], [4, 2]], "fill": true}], "segments": [{"from": [0, 0], "to": [1, 2], "dashed": true}, {"from": [1, 2], "to": [4, 2], "dashed": true}, {"from": [3, 0], "to": [4, 2], "dashed": true}, {"from": [0, 0], "to": [3, 0], "arrow": true, "label": "u"}, {"from": [0, 0], "to": [4, 2], "arrow": true, "label": "v + u"}], "caption": "Column replacement v → v + u is a shear: the dashed parallelogram (u, v) and the shaded one (u, v + u) share base 3 and height 2, so both have area 6"}
```

The same argument works in three dimensions, where the volume of a parallelepiped is the area
of its base times its height. A column replacement slides the top face around without
changing its height above the base, so it leaves the volume alone, just as it leaves the
determinant alone.

![A slanted box spanned by vectors u, v and w from the origin. The base is the parallelogram spanned by u and v, and the height is the dashed perpendicular from the tip of w down to the base. Below: volume equals area of base times height, which equals the absolute value of det of u, v, w.](images/la-m6-parallelepiped.svg)

### Example 2

Find the area of the parallelogram determined by $\mathbf{u} = (1, 3)$ and $\mathbf{v} = (4, -2)$.

$$\det\begin{bmatrix} 1 & 4 \\ 3 & -2\end{bmatrix} = -2 - 12 = -14, \qquad \text{area} = |-14| = 14.$$

```plot
{"x": [-1, 6], "y": [-3, 4], "equal": true, "polygons": [{"points": [[0, 0], [1, 3], [5, 1], [4, -2]]}], "segments": [{"from": [0, 0], "to": [1, 3], "arrow": true, "label": "u"}, {"from": [0, 0], "to": [4, -2], "arrow": true, "label": "v"}], "caption": "The parallelogram spanned by u and v has area |det[u v]| = 14"}
```

The sign of the determinant carries orientation: positive when turning from the first column
to the second is counterclockwise, negative when it's clockwise (as here).

To find the area of a parallelogram or triangle that isn't at the origin, translate one
vertex to the origin first; translation doesn't change area. For example the triangle with
vertices $(1, 1)$, $(4, 2)$, $(2, 5)$ has edge vectors $(3, 1)$ and $(1, 4)$ from $(1, 1)$, so
its area is $\tfrac12\left|\det\begin{bmatrix} 3 & 1 \\ 1 & 4\end{bmatrix}\right| = \tfrac12(11) = 5.5$.

## Linear transformations scale areas by $|\det A|$

> *Theorem.* If $T(\mathbf{x}) = A\mathbf{x}$ with $A$ $2 \times 2$ and $S$ is a region of finite area, then $\text{area of } T(S) = |\det A| \cdot \text{area of } S$. The same holds for volumes in $\mathbb{R}^3$.

For a parallelogram $S$ spanned by $\mathbf{b}_1, \mathbf{b}_2$, $T(S)$ is spanned by
$A\mathbf{b}_1, A\mathbf{b}_2$, and $|\det(AB)| = |\det A||\det B|$. Any other region can be
approximated by tiny squares, each scaled by the same factor.

### Example 3

$T$ has standard matrix $\begin{bmatrix} 2 & 1 \\ 0 & 3\end{bmatrix}$. What is the area of the image of the unit disk?

The unit disk has area $\pi$, and $\det A = 6$, so the image (an ellipse) has area $6\pi$.
If the matrix were singular, the image would be squashed onto a line, with area 0.

## Common mistakes

- *Replacing a row instead of a column* in Cramer's rule. $A_i(\mathbf{b})$ replaces column $i$.
- *Forgetting the transpose in the adjugate.* The $(i, j)$ entry is $C_{ji}$.
- *Reporting a negative area.* Area is $|\det A|$.
- *Forgetting the $\tfrac12$ for a triangle*, or not translating a vertex to the origin first.
- *Using Cramer's rule on large systems.* It needs $n + 1$ determinants; row reduction is far cheaper.

## Key points

- Cramer's rule: $x_i = \det A_i(\mathbf{b}) / \det A$ when $\det A \ne 0$.
- $A^{-1} = \dfrac{1}{\det A}\operatorname{adj} A$, where $\operatorname{adj} A$ is the transposed matrix of cofactors.
- $|\det A|$ is the area (2D) or volume (3D) spanned by the columns of $A$.
- $\mathbf{x} \mapsto A\mathbf{x}$ multiplies every area (or volume) by $|\det A|$.
