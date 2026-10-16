---
id: la-inner-product
module: la-m9
title: Inner product, length and orthogonality
minutes: 30
topics: [Inner product, Orthogonality]
drills: [la-dot-len, la-angle, la-unit]
refs: [la-ref-factor]
---
## Bringing geometry back

The algebra of the last few modules (span, bases, eigenvalues) never mentioned length or
angle. But many problems are about distance: the closest point, the best fit, the smallest
error. This module adds geometry through one operation, the inner product, and builds to the
least-squares method for fitting data. It starts with the definitions and the idea of
perpendicular subspaces.

## The inner product

For $\mathbf{u}$ and $\mathbf{v}$ in $\mathbb{R}^n$, the **inner product** (or **dot product**) is
the number

$$\mathbf{u}\cdot\mathbf{v} = \mathbf{u}^T\mathbf{v} = u_1v_1 + u_2v_2 + \cdots + u_nv_n.$$

It satisfies, for all vectors and scalars:

1. $\mathbf{u}\cdot\mathbf{v} = \mathbf{v}\cdot\mathbf{u}$;
2. $(\mathbf{u} + \mathbf{v})\cdot\mathbf{w} = \mathbf{u}\cdot\mathbf{w} + \mathbf{v}\cdot\mathbf{w}$;
3. $(c\mathbf{u})\cdot\mathbf{v} = c(\mathbf{u}\cdot\mathbf{v})$;
4. $\mathbf{u}\cdot\mathbf{u} \ge 0$, with equality only for $\mathbf{u} = \mathbf{0}$.

## Length and distance

The **norm** (length) of $\mathbf{v}$ is $\|\mathbf{v}\| = \sqrt{\mathbf{v}\cdot\mathbf{v}} = \sqrt{v_1^2 + \cdots + v_n^2}$,
generalizing the Pythagorean formula from Module 1, and $\|c\mathbf{v}\| = |c|\,\|\mathbf{v}\|$.
Dividing a nonzero vector by its length gives a unit vector in the same direction; this is
called *normalizing* it.

The **distance** between $\mathbf{u}$ and $\mathbf{v}$ is $\operatorname{dist}(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|$.
For example, the distance between $(7, 1)$ and $(3, 2)$ is $\|(4, -1)\| = \sqrt{17}$.

## Angles

In $\mathbb{R}^2$ and $\mathbb{R}^3$ the law of cosines gives
$\mathbf{u}\cdot\mathbf{v} = \|\mathbf{u}\|\,\|\mathbf{v}\|\cos\theta$, where $\theta$ is the angle
between the arrows. In any $\mathbb{R}^n$ we use this to *define* the angle:

$$\cos\theta = \frac{\mathbf{u}\cdot\mathbf{v}}{\|\mathbf{u}\|\,\|\mathbf{v}\|}.$$

The sign of $\mathbf{u}\cdot\mathbf{v}$ tells you whether the angle is acute (positive), right
(zero) or obtuse (negative). In statistics, this cosine for centered data vectors is the
correlation coefficient.

### Example 1

Let $\mathbf{u} = (1, -2, 2)$ and $\mathbf{v} = (3, 0, 4)$. Find $\mathbf{u}\cdot\mathbf{v}$, both lengths, the angle between them, and the unit vector in the direction of $\mathbf{v}$.

1. $\mathbf{u}\cdot\mathbf{v} = 3 + 0 + 8 = 11$.
2. $\|\mathbf{u}\| = \sqrt{1 + 4 + 4} = 3$ and $\|\mathbf{v}\| = \sqrt{9 + 0 + 16} = 5$.
3. $\cos\theta = \dfrac{11}{15}$, so $\theta = \cos^{-1}(11/15) \approx 42.8^\circ$.
4. Unit vector: $\tfrac15(3, 0, 4) = (0.6, 0, 0.8)$.

## Orthogonal vectors

Two vectors are **orthogonal** (perpendicular) if $\mathbf{u}\cdot\mathbf{v} = 0$. The zero vector
is orthogonal to everything. Expanding $\|\mathbf{u} + \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + 2\,\mathbf{u}\cdot\mathbf{v} + \|\mathbf{v}\|^2$ gives:

> *Pythagorean theorem.* $\mathbf{u}$ and $\mathbf{v}$ are orthogonal if and only if $\|\mathbf{u} + \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2$.

## Orthogonal complements

If $\mathbf{z}$ is orthogonal to every vector in a subspace $W$, we say $\mathbf{z}$ is orthogonal to
$W$. The set of all such vectors is the **orthogonal complement** of $W$, written $W^\perp$
("W perp"). It is itself a subspace. In $\mathbb{R}^3$, the complement of a line through the
origin is the plane through the origin perpendicular to it, and vice versa.

To check that $\mathbf{z}$ is in $W^\perp$, it's enough to check $\mathbf{z}$ against a spanning set
of $W$, because dot products distribute over linear combinations.

> *Theorem.* For an $m \times n$ matrix $A$: $(\operatorname{Row} A)^\perp = \operatorname{Nul} A$ and $(\operatorname{Col} A)^\perp = \operatorname{Nul} A^T$.

Why: $A\mathbf{x} = \mathbf{0}$ says exactly that $\mathbf{x}$ has dot product 0 with every row of
$A$. Apply the same fact to $A^T$ for the second statement. So the four fundamental subspaces
pair up into perpendicular pairs.

### Example 2

Find a basis for $W^\perp$ where $W = \operatorname{Span}\{(1, 1, 1)\}$ in $\mathbb{R}^3$.

1. $\mathbf{x}$ is in $W^\perp$ exactly when $x_1 + x_2 + x_3 = 0$, i.e. $\mathbf{x}$ is in $\operatorname{Nul}\begin{bmatrix} 1 & 1 & 1\end{bmatrix}$.
2. $x_1 = -x_2 - x_3$ with $x_2, x_3$ free: basis $\{(-1, 1, 0), (-1, 0, 1)\}$.
3. $W$ is a line and $W^\perp$ is a plane; the dimensions add to 3. In general $\dim W + \dim W^\perp = n$.

### Example 3

Find a basis for $W^\perp$, where $W = \operatorname{Span}\{(1, 0, 2), (0, 1, -1)\}$ in $\mathbb{R}^3$.

1. $\mathbf{x}$ is in $W^\perp$ exactly when it is orthogonal to both spanning vectors: $x_1 + 2x_3 = 0$ and $x_2 - x_3 = 0$.
2. That is $\operatorname{Nul}\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1\end{bmatrix}$, whose rows are the spanning vectors of $W$. (This is the theorem $(\operatorname{Row} A)^\perp = \operatorname{Nul} A$ in action.)
3. The matrix is already in RREF: $x_1 = -2x_3$, $x_2 = x_3$, $x_3$ free. Basis: $\{(-2, 1, 1)\}$.
4. Check: $(-2, 1, 1)\cdot(1, 0, 2) = -2 + 0 + 2 = 0$ and $(-2, 1, 1)\cdot(0, 1, -1) = 0 + 1 - 1 = 0$. ✓

So $W$ is a plane and $W^\perp$ is the line through $(-2, 1, 1)$, its normal direction. Recipe: to find the orthogonal complement of a span, put the spanning vectors in the *rows* of a matrix and find its null space.

The Pythagorean theorem gives a quick check on such a decomposition. With $\mathbf{u} = (1, 0, 2)$ in $W$ and $\mathbf{z} = (-2, 1, 1)$ in $W^\perp$, $\|\mathbf{u} + \mathbf{z}\|^2 = \|(-1, 1, 3)\|^2 = 11$, and $\|\mathbf{u}\|^2 + \|\mathbf{z}\|^2 = 5 + 6 = 11$. ✓

## Common mistakes

- *Forgetting the square root* in the length: $\|(3, 4)\| = 5$, not 25.
- *Treating the dot product as a vector.* $\mathbf{u}\cdot\mathbf{v}$ is a number.
- *Normalizing wrongly*, e.g. dividing by the sum of the entries instead of the length.
- *Checking orthogonality to $W$ with only one vector* when $W$ is spanned by several; check every spanning vector.
- *Calculator in radians* when the angle is wanted in degrees.

## Key points

- $\mathbf{u}\cdot\mathbf{v} = \mathbf{u}^T\mathbf{v}$; $\|\mathbf{v}\| = \sqrt{\mathbf{v}\cdot\mathbf{v}}$; $\operatorname{dist}(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|$.
- $\cos\theta = \dfrac{\mathbf{u}\cdot\mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}$; orthogonal means $\mathbf{u}\cdot\mathbf{v} = 0$.
- Pythagoras: $\|\mathbf{u} + \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2$ exactly for orthogonal vectors.
- $W^\perp$ is the set of vectors orthogonal to all of $W$; $(\operatorname{Row} A)^\perp = \operatorname{Nul} A$ and $(\operatorname{Col} A)^\perp = \operatorname{Nul} A^T$.
