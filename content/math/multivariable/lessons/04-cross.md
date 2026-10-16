---
id: mv-cross
module: mv-m1
title: The cross product
minutes: 30
topics: [Cross product, Triple product]
drills: [mv-d-cross, mv-d-tri-area, mv-d-triple]
refs: [mv-ref-vectors]
---
## A product that makes a perpendicular vector

The dot product measures how much two vectors agree. The cross product answers a
different question: given two directions in space, which direction is perpendicular to
both, and how much area do they span? We need this constantly: to find the normal to a
plane (Lesson 5), the binormal of a curve (Lesson 9), torque, and the normal vector of a
parametric surface (Lesson 33). Unlike the dot product, the cross product exists only in
three dimensions and produces a vector.

## Definition

For $\mathbf a = \langle a_1,a_2,a_3\rangle$ and $\mathbf b = \langle b_1,b_2,b_3\rangle$,

$$\mathbf a\times\mathbf b = \begin{vmatrix} \mathbf i & \mathbf j & \mathbf k\\ a_1 & a_2 & a_3\\ b_1 & b_2 & b_3\end{vmatrix} = \langle a_2b_3 - a_3b_2,\; a_3b_1 - a_1b_3,\; a_1b_2 - a_2b_1\rangle.$$

The determinant is a memory device: expand along the first row, and remember the minus
sign on the middle ($\mathbf j$) term. In expanded form the middle component is
$-(a_1b_3 - a_3b_1)$, which is the same as $a_3b_1 - a_1b_3$.

### Example 1

Compute $\langle 1, 3, 4\rangle \times \langle 2, 7, -5\rangle$.

1. $\mathbf i$: $3(-5) - 4(7) = -15 - 28 = -43$.
2. $\mathbf j$: $-[1(-5) - 4(2)] = -(-13) = 13$.
3. $\mathbf k$: $1(7) - 3(2) = 1$.

So $\mathbf a\times\mathbf b = \langle -43, 13, 1\rangle$. Check perpendicularity:
$\langle -43,13,1\rangle\cdot\langle1,3,4\rangle = -43+39+4 = 0$ and
$\langle -43,13,1\rangle\cdot\langle 2,7,-5\rangle = -86+91-5 = 0$. ✓

## Geometric meaning

**Direction.** $\mathbf a\times\mathbf b$ is orthogonal to both $\mathbf a$ and $\mathbf b$
(you can verify $(\mathbf a\times\mathbf b)\cdot\mathbf a = 0$ by expanding: every term
cancels). Of the two perpendicular directions, it points the way given by the right-hand
rule: fingers from $\mathbf a$ toward $\mathbf b$, thumb along $\mathbf a\times\mathbf b$.
So $\mathbf i\times\mathbf j = \mathbf k$, $\mathbf j\times\mathbf k = \mathbf i$,
$\mathbf k\times\mathbf i = \mathbf j$.

**Length.** $|\mathbf a\times\mathbf b| = |\mathbf a||\mathbf b|\sin\theta$. *Why:* a
direct (if tedious) expansion gives Lagrange's identity
$|\mathbf a\times\mathbf b|^2 = |\mathbf a|^2|\mathbf b|^2 - (\mathbf a\cdot\mathbf b)^2$,
and replacing $\mathbf a\cdot\mathbf b$ with $|\mathbf a||\mathbf b|\cos\theta$ leaves
$|\mathbf a|^2|\mathbf b|^2\sin^2\theta$.

Since $|\mathbf b|\sin\theta$ is the height of the parallelogram with sides $\mathbf a$ and
$\mathbf b$, we get:

$$|\mathbf a\times\mathbf b| = \text{area of the parallelogram spanned by } \mathbf a \text{ and } \mathbf b.$$

A triangle with those two sides has half that area.

```plot
{"x": [-0.5, 7], "y": [-0.5, 4], "equal": true, "polygons": [{"points": [[0, 0], [5, 0], [6.5, 3], [1.5, 3]], "fill": true}], "segments": [{"from": [0, 0], "to": [5, 0], "arrow": true, "label": "a"}, {"from": [0, 0], "to": [1.5, 3], "arrow": true, "label": "b"}, {"from": [1.5, 3], "to": [1.5, 0], "dashed": true}], "caption": "Area = base |a| times height |b| sin θ = |a × b|", "labels": [{"at": [2.4, 1.4], "text": "|b| sin θ"}]}
```

## Algebra rules (and non-rules)

- **Anticommutative:** $\mathbf b\times\mathbf a = -(\mathbf a\times\mathbf b)$. Order matters.
- $\mathbf a\times\mathbf a = \mathbf 0$; more generally, $\mathbf a\times\mathbf b = \mathbf 0$ exactly when the vectors are parallel ($\sin\theta = 0$).
- Distributive: $\mathbf a\times(\mathbf b+\mathbf c) = \mathbf a\times\mathbf b+\mathbf a\times\mathbf c$; scalars pull out.
- **Not associative:** $(\mathbf i\times\mathbf i)\times\mathbf j = \mathbf 0$, but $\mathbf i\times(\mathbf i\times\mathbf j) = \mathbf i\times\mathbf k = -\mathbf j$.

### Example 2

Find the area of the triangle with vertices $P(1,0,0)$, $Q(0,2,0)$, $R(0,0,3)$.

1. Two sides from $P$: $\overrightarrow{PQ} = \langle -1,2,0\rangle$, $\overrightarrow{PR} = \langle -1,0,3\rangle$.
2. Cross: $\mathbf i(2\cdot3 - 0\cdot0) - \mathbf j((-1)(3) - 0\cdot(-1)) + \mathbf k((-1)(0) - 2(-1)) = \langle 6, 3, 2\rangle$.
3. $|\langle 6,3,2\rangle| = \sqrt{36+9+4} = 7$, so the area is $\tfrac72$.

The vector $\langle 6,3,2\rangle$ is also a normal to the plane through $P, Q, R$; we use
that in the next lesson.

## The scalar triple product

The **scalar triple product** $\mathbf a\cdot(\mathbf b\times\mathbf c)$ is the determinant

$$\mathbf a\cdot(\mathbf b\times\mathbf c) = \begin{vmatrix} a_1&a_2&a_3\\ b_1&b_2&b_3\\ c_1&c_2&c_3\end{vmatrix}.$$

Its absolute value is the volume of the **parallelepiped** (slanted box) with edges
$\mathbf a, \mathbf b, \mathbf c$. *Why:* $|\mathbf b\times\mathbf c|$ is the area of the
base, and $|\mathbf a||\cos\phi|$, where $\phi$ is the angle between $\mathbf a$ and the
base's normal $\mathbf b\times\mathbf c$, is the height. If the triple product is zero, the
box is flat: the three vectors are **coplanar**.

### Example 3

Are $\mathbf a = \langle 1,2,3\rangle$, $\mathbf b = \langle 0,1,4\rangle$, $\mathbf c = \langle 2,5,10\rangle$ coplanar?

$\det = 1(1\cdot10 - 4\cdot5) - 2(0\cdot10 - 4\cdot2) + 3(0\cdot5 - 1\cdot2) = -10 + 16 - 6 = 0.$
Yes; indeed $\mathbf c = 2\mathbf a + \mathbf b$.

## Torque

If a force $\mathbf F$ acts at the tip of a position vector $\mathbf r$ (from a pivot), the
**torque** is $\boldsymbol\tau = \mathbf r\times\mathbf F$. Its length
$|\mathbf r||\mathbf F|\sin\theta$ measures the turning effect, and its direction is the axis
of rotation. A 0.3 m wrench with a 40 N push at right angles gives torque $12$ N·m; pushing
along the handle ($\theta = 0$) gives none.

## Common mistakes

- Forgetting the minus sign on the $\mathbf j$ component.
- Swapping the order and getting the negative vector; this flips normals and orientations later.
- Using $\cos\theta$ for the cross product's length (that is the dot product).
- Forgetting the $\tfrac12$ for a triangle's area.

## Key points

- $\mathbf a\times\mathbf b$ is perpendicular to both, follows the right-hand rule, and has length $|\mathbf a||\mathbf b|\sin\theta$ (parallelogram area).
- $\mathbf a\times\mathbf b = \mathbf 0$ iff $\mathbf a \parallel \mathbf b$; $\mathbf b\times\mathbf a = -\mathbf a\times\mathbf b$.
- $|\mathbf a\cdot(\mathbf b\times\mathbf c)|$ is a parallelepiped's volume; zero means coplanar.
