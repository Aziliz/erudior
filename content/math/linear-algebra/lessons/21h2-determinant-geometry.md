---
id: la-m6-h-determinant-geometry
module: la-m6
title: 'Determinants in geometry: cross products, orientation and polygon areas'
minutes: 45
honors: true
topics: [Cross product, Orientation and polygon area]
drills: [la-m6-r2-cross, la-m6-r2-tetra, la-m6-r2-shoelace]
refs: [la-ref-det]
---
## Beyond the parallelogram

The area and volume lesson showed that $|\det[\,\mathbf{u} \;\; \mathbf{v}\,]|$ is the area of a
parallelogram and $|\det[\,\mathbf{u} \;\; \mathbf{v} \;\; \mathbf{w}\,]|$ the volume of a
parallelepiped, and that the *sign* records orientation. This lesson puts those facts to work
in geometry: the cross product of two vectors in $\mathbb{R}^3$, volumes of tetrahedra, a
left-turn/right-turn test that computer graphics and mapping software run millions of times,
and a formula for the area of any polygon from the coordinates of its corners.

One tool from later in the course is needed: the dot product
$\mathbf{x} \cdot \mathbf{y} = x_1y_1 + x_2y_2 + x_3y_3$. Two vectors are perpendicular when their
dot product is 0, and the length of $\mathbf{x}$ is $\|\mathbf{x}\| = \sqrt{\mathbf{x} \cdot \mathbf{x}}$.

## The cross product as a determinant

For $\mathbf{u} = (u_1, u_2, u_3)$ and $\mathbf{v} = (v_1, v_2, v_3)$, the **cross product** is the
vector you get by expanding this "determinant" along its first row, whose entries are the
standard basis vectors:

$$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{e}_1 & \mathbf{e}_2 & \mathbf{e}_3 \\ u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3\end{vmatrix} = (u_2v_3 - u_3v_2,\;\; u_3v_1 - u_1v_3,\;\; u_1v_2 - u_2v_1).$$

The matrix isn't a real matrix (its first row holds vectors), so this is a memory device: the
cofactor expansion along row 1, with the usual signs $+, -, +$. Note the middle component:
$-(u_1v_3 - u_3v_1) = u_3v_1 - u_1v_3$.

The device pays off because of one identity. For any vector $\mathbf{w}$, the dot product
$\mathbf{w} \cdot (\mathbf{u} \times \mathbf{v})$ multiplies each cofactor by a component of
$\mathbf{w}$, which is exactly the cofactor expansion with $\mathbf{w}$ in the first row:

$$\mathbf{w} \cdot (\mathbf{u} \times \mathbf{v}) = \begin{vmatrix} w_1 & w_2 & w_3 \\ u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3\end{vmatrix} = \det[\,\mathbf{u} \;\; \mathbf{v} \;\; \mathbf{w}\,].$$

(Moving the top row to the bottom takes two row swaps, which cancel, and transposing doesn't
change a determinant.) This number is the **scalar triple product**. Every property of the
cross product now follows from properties of determinants:

- *Perpendicular to both.* Take $\mathbf{w} = \mathbf{u}$: two equal rows, so $\mathbf{u} \cdot (\mathbf{u} \times \mathbf{v}) = 0$. Likewise for $\mathbf{v}$.
- *Order matters.* Swapping $\mathbf{u}$ and $\mathbf{v}$ swaps two rows, so $\mathbf{v} \times \mathbf{u} = -(\mathbf{u} \times \mathbf{v})$, and $\mathbf{u} \times \mathbf{u} = \mathbf{0}$.
- *Length is area.* If $\mathbf{u} \times \mathbf{v} \neq \mathbf{0}$, let $\mathbf{n}$ be the unit vector in its direction. The box spanned by $\mathbf{u}$, $\mathbf{v}$, $\mathbf{n}$ has the parallelogram as base and height 1 (since $\mathbf{n}$ is perpendicular to the base), so its volume equals the parallelogram's area. That volume is $|\mathbf{n} \cdot (\mathbf{u} \times \mathbf{v})| = \|\mathbf{u} \times \mathbf{v}\|$.
- *Direction.* $\det[\,\mathbf{u} \;\; \mathbf{v} \;\; \mathbf{u} \times \mathbf{v}\,] = \|\mathbf{u} \times \mathbf{v}\|^2 > 0$, so $\mathbf{u}, \mathbf{v}, \mathbf{u} \times \mathbf{v}$ have the same orientation as $\mathbf{e}_1, \mathbf{e}_2, \mathbf{e}_3$ (whose determinant is $\det I = 1$). That is the **right-hand rule**: curl the fingers of your right hand from $\mathbf{u}$ toward $\mathbf{v}$ and your thumb points along $\mathbf{u} \times \mathbf{v}$. For example $\mathbf{e}_1 \times \mathbf{e}_2 = \mathbf{e}_3$.

![Two vectors u and v lie in a horizontal plane with the parallelogram they span shaded; the cross product u × v rises straight up from their common tail, at right angles to the plane. A curved arrow shows the counterclockwise turn from u to v as seen from above. Caption: u × v is perpendicular to u and v, its length is the area of the parallelogram, and u turns to v counterclockwise seen from its tip.](images/la-m6-h-cross.svg)

### Example 1

Find $\mathbf{u} \times \mathbf{v}$ for $\mathbf{u} = (1, 2, 3)$, $\mathbf{v} = (4, 0, -1)$, check it, and find the area of the parallelogram they span.

1. First component: $u_2v_3 - u_3v_2 = 2(-1) - 3(0) = -2$.
2. Second: $u_3v_1 - u_1v_3 = 3(4) - 1(-1) = 13$.
3. Third: $u_1v_2 - u_2v_1 = 1(0) - 2(4) = -8$. So $\mathbf{u} \times \mathbf{v} = (-2, 13, -8)$.
4. Check: $\mathbf{u} \cdot (-2, 13, -8) = -2 + 26 - 24 = 0$ and $\mathbf{v} \cdot (-2, 13, -8) = -8 + 0 + 8 = 0$. ✓
5. Area $= \sqrt{4 + 169 + 64} = \sqrt{237} \approx 15.39$.

## Tetrahedra and other simplices

A tetrahedron with corners $\mathbf{a}, \mathbf{b}, \mathbf{c}, \mathbf{d}$ is a pyramid on a
triangular base. A pyramid's volume is $\tfrac13$(base area)(height), and the triangle is half the
parallelogram spanned by its edges, so the tetrahedron is $\tfrac13 \cdot \tfrac12 = \tfrac16$ of
the parallelepiped spanned by its three edges from one corner:

$$\text{volume} = \tfrac16\left|\det[\,\mathbf{b} - \mathbf{a} \;\; \mathbf{c} - \mathbf{a} \;\; \mathbf{d} - \mathbf{a}\,]\right|.$$

The pattern continues the triangle formula $\tfrac12|\det|$: in $n$ dimensions the corresponding
solid (a simplex) has $\tfrac{1}{n!}$ of the volume of the box on the same edges.

### Example 2

Find the volume of the tetrahedron with corners $\mathbf{a} = (1, 0, 0)$, $\mathbf{b} = (2, 2, 1)$, $\mathbf{c} = (0, 3, 1)$, $\mathbf{d} = (1, 1, 4)$.

1. Edges from $\mathbf{a}$: $\mathbf{b} - \mathbf{a} = (1, 2, 1)$, $\mathbf{c} - \mathbf{a} = (-1, 3, 1)$, $\mathbf{d} - \mathbf{a} = (0, 1, 4)$.
2. Use them as rows (a transpose doesn't change the determinant) and expand along row 1: $\begin{vmatrix} 1 & 2 & 1 \\ -1 & 3 & 1 \\ 0 & 1 & 4\end{vmatrix} = 1(12 - 1) - 2(-4 - 0) + 1(-1 - 0) = 11 + 8 - 1 = 18$.
3. Volume $= \tfrac{18}{6} = 3$.

If the determinant had come out 0, the four points would lie in one plane.

## Orientation: which way does the path turn?

For points $\mathbf{p}, \mathbf{q}, \mathbf{r}$ in the plane, let

$$D = \det[\,\mathbf{q} - \mathbf{p} \;\; \mathbf{r} - \mathbf{p}\,] = (q_1 - p_1)(r_2 - p_2) - (q_2 - p_2)(r_1 - p_1).$$

The **orientation** of the triple is the sign of $D$: if $D > 0$, the path $\mathbf{p} \to \mathbf{q} \to \mathbf{r}$
turns left (the triangle is listed counterclockwise); if $D < 0$ it turns right (clockwise);
if $D = 0$ the three points lie on a line. The triangle's area is $|D|/2$. For example,
$(1, 2), (3, 5), (7, 11)$ give $D = \det\begin{bmatrix} 2 & 6 \\ 3 & 9\end{bmatrix} = 18 - 18 = 0$, so
they are on one line.

This one sign is the basic step in many geometry algorithms: deciding whether two line
segments cross, whether a point is inside a triangle, or building the convex hull of a set of
points. It also gives the equation of a line: $(x, y)$ lies on the line through
$(x_1, y_1)$ and $(x_2, y_2)$ exactly when

$$\begin{vmatrix} x & y & 1 \\ x_1 & y_1 & 1 \\ x_2 & y_2 & 1\end{vmatrix} = 0.$$

(Subtract the second row from the other two and expand down the third column: what is left
is $D$ for the three points $(x_1, y_1)$, $(x_2, y_2)$, $(x, y)$, so the determinant is 0 exactly
when they are collinear.) Through $(1, 2)$ and $(3, 7)$,
expanding along row 1 gives $x(2 - 7) - y(1 - 3) + (7 - 6) = -5x + 2y + 1 = 0$, that is,
$5x - 2y = 1$.

## The area of any polygon: the shoelace formula

List the corners $(x_1, y_1), \dots, (x_n, y_n)$ of a polygon whose sides don't cross, going
counterclockwise, and wrap around so that $(x_{n+1}, y_{n+1}) = (x_1, y_1)$. Then

$$\text{area} = \tfrac12\sum_{i=1}^{n}(x_iy_{i+1} - x_{i+1}y_i) = \tfrac12\sum_{i=1}^{n}\det\begin{bmatrix} x_i & x_{i+1} \\ y_i & y_{i+1}\end{bmatrix}.$$

This is the **shoelace formula** (write the coordinates in two columns and the cross-multiplied
pairs lace up like a shoe). *Why it works:* each term is twice the **signed area** of the
triangle with corners $\mathbf{0}$, $P_i$, $P_{i+1}$: positive when that triangle is
counterclockwise, negative when clockwise. Walking around the polygon, the triangles fan out from
the origin; every piece that lies outside the polygon is covered as often by positive
triangles as by negative ones and cancels, while every piece inside is left counted exactly
once, so the sum is the polygon's area. Listing the corners clockwise gives the
negative of the area.

### Example 3

Find the area of the pentagon with corners $(0, 0), (4, 0), (5, 3), (2, 5), (-1, 2)$, in counterclockwise order.

```plot
{"x": [-3, 6], "y": [-1, 6], "equal": true, "polygons": [{"points": [[0, 0], [4, 0], [5, 3], [2, 5], [-1, 2]]}], "segments": [{"from": [0, 0], "to": [5, 3], "dashed": true}, {"from": [0, 0], "to": [2, 5], "dashed": true}], "points": [{"at": [0, 0]}, {"at": [4, 0]}, {"at": [5, 3], "label": "(5, 3)"}, {"at": [2, 5], "label": "(2, 5)"}, {"at": [-1, 2]}], "labels": [{"at": [-0.95, 0.3], "text": "(0, 0)"}, {"at": [3.3, 0.3], "text": "(4, 0)"}, {"at": [-1.8, 2.2], "text": "(−1, 2)"}], "caption": "The pentagon split into a fan of triangles from the corner (0, 0); the shoelace terms are twice their areas"}
```

1. Consecutive pairs and their terms $x_iy_{i+1} - x_{i+1}y_i$:
   $(0,0),(4,0)$: $0 - 0 = 0$; $(4,0),(5,3)$: $12 - 0 = 12$; $(5,3),(2,5)$: $25 - 6 = 19$; $(2,5),(-1,2)$: $4 - (-5) = 9$; $(-1,2),(0,0)$: $0 - 0 = 0$.
2. Sum: $0 + 12 + 19 + 9 + 0 = 40$.
3. Area $= 40/2 = 20$.

Because one corner is the origin, the fan here is an actual triangulation: three triangles of
areas 6, 9.5 and 4.5, which add to 20.

## Looking ahead: the Jacobian

If you go on to multivariable calculus, the area-scaling theorem returns in a stronger form. A
curved change of coordinates, such as polar coordinates $x = r\cos\theta$, $y = r\sin\theta$,
behaves near each point like a linear map, so it multiplies tiny areas by the absolute value of
the determinant of that linear map's matrix (the Jacobian determinant). For polar coordinates
that determinant is $r$, which is where the $r$ in $dA = r\,dr\,d\theta$ comes from.

## Common mistakes

- *Dropping the minus sign on the middle component* of $\mathbf{u} \times \mathbf{v}$. It is $u_3v_1 - u_1v_3$, not $u_1v_3 - u_3v_1$.
- *Treating the cross product as commutative.* $\mathbf{v} \times \mathbf{u} = -(\mathbf{u} \times \mathbf{v})$.
- *Forgetting the $\tfrac16$* for a tetrahedron (or the $\tfrac12$ for a triangle).
- *Using corners instead of edge vectors.* Subtract one corner from the others first.
- *Listing polygon corners in a jumbled order.* The shoelace formula needs the corners in order around the boundary; clockwise order just flips the sign.

## Key points

- $\mathbf{u} \times \mathbf{v} = (u_2v_3 - u_3v_2,\; u_3v_1 - u_1v_3,\; u_1v_2 - u_2v_1)$: perpendicular to both, length = parallelogram area, direction by the right-hand rule.
- Scalar triple product: $\mathbf{w} \cdot (\mathbf{u} \times \mathbf{v}) = \det[\,\mathbf{u} \;\; \mathbf{v} \;\; \mathbf{w}\,]$.
- Tetrahedron: $\tfrac16|\det[\,\mathbf{b} - \mathbf{a} \;\; \mathbf{c} - \mathbf{a} \;\; \mathbf{d} - \mathbf{a}\,]|$.
- Orientation of $\mathbf{p}, \mathbf{q}, \mathbf{r}$: sign of $\det[\,\mathbf{q} - \mathbf{p} \;\; \mathbf{r} - \mathbf{p}\,]$; zero means collinear.
- Shoelace: area $= \tfrac12\sum(x_iy_{i+1} - x_{i+1}y_i)$ with corners listed counterclockwise.
