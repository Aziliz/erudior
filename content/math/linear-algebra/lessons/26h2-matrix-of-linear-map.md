---
id: la-m7-h-linear-maps
module: la-m7
title: Matrices of linear maps between vector spaces
minutes: 45
topics: [Matrices of linear maps]
drills: [la-m7-r2-shift-map, la-m7-r2-eval-kernel]
refs: [la-ref-row]
honors: true
---
## From standard matrices to any linear map

In the linear transformations module, every linear map $T: \mathbb{R}^n \to \mathbb{R}^m$ turned
out to be multiplication by a matrix, its standard matrix, whose columns are
$T(\mathbf{e}_1), \dots, T(\mathbf{e}_n)$. The coordinates lesson then showed that any vector
space with an $n$-vector basis looks exactly like $\mathbb{R}^n$ through the coordinate mapping.
Put those two ideas together and every linear map between finite-dimensional spaces, such as
differentiating polynomials, evaluating them at points, transposing matrices, becomes a matrix.
Once it is a matrix, everything you know about null spaces, column spaces, rank and inverses
applies. This lesson sets that up and proves the rank–nullity theorem for linear maps.

## The matrix of a linear map relative to two bases

Let $T: V \to W$ be linear, with a basis $\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ of $V$
and a basis $\mathcal{C} = \{\mathbf{c}_1, \dots, \mathbf{c}_m\}$ of $W$. Take any $\mathbf{x}$ in $V$
with $[\mathbf{x}]_{\mathcal{B}} = (r_1, \dots, r_n)$, so $\mathbf{x} = r_1\mathbf{b}_1 + \cdots + r_n\mathbf{b}_n$.
Because $T$ and the $\mathcal{C}$-coordinate mapping are both linear,

$$[T(\mathbf{x})]_{\mathcal{C}} = r_1[T(\mathbf{b}_1)]_{\mathcal{C}} + \cdots + r_n[T(\mathbf{b}_n)]_{\mathcal{C}} = M[\mathbf{x}]_{\mathcal{B}},$$

where

$$M = \big[\, [T(\mathbf{b}_1)]_{\mathcal{C}} \;\; [T(\mathbf{b}_2)]_{\mathcal{C}} \;\cdots\; [T(\mathbf{b}_n)]_{\mathcal{C}} \,\big].$$

This $m \times n$ matrix is the **matrix of a linear transformation** $T$ relative to the bases
$\mathcal{B}$ and $\mathcal{C}$ (some books write $[T]_{\mathcal{C} \leftarrow \mathcal{B}}$). Its size is
$\dim W \times \dim V$: one column for each input basis vector, one row for each output
coordinate. The recipe is the standard-matrix recipe with coordinates added: *apply $T$ to each
input basis vector, write the result in output coordinates, and use it as a column.*

The picture is a square of maps. Going across the top applies $T$; going down either side
takes coordinates; going across the bottom multiplies by $M$. Both routes from $V$ to
$\mathbb{R}^m$ give the same answer, which is what $[T(\mathbf{x})]_{\mathcal{C}} = M[\mathbf{x}]_{\mathcal{B}}$ says.

![A square diagram. Top left V, top right W, joined by an arrow labeled T. Bottom left R^n, bottom right R^m, joined by an arrow labeled multiply by M. Downward arrows on the left and right are labeled take B-coordinates and take C-coordinates. A note says both paths from V to R^m agree.](images/la-m7-h-square.svg)

A linear map from a space to itself, $T: V \to V$, is called a **linear operator**; then one
usually uses the same basis on both sides and calls $M$ the matrix of $T$ relative to
$\mathcal{B}$.

### Example 1

Let $D: \mathbb{P}_3 \to \mathbb{P}_2$ be differentiation, $D(p) = p'$, with the standard bases
$\mathcal{B} = \{1, t, t^2, t^3\}$ and $\mathcal{C} = \{1, t, t^2\}$.

1. Apply $D$ to each input basis vector: $D(1) = 0$, $D(t) = 1$, $D(t^2) = 2t$, $D(t^3) = 3t^2$.
2. Their $\mathcal{C}$-coordinates are $(0, 0, 0)$, $(1, 0, 0)$, $(0, 2, 0)$, $(0, 0, 3)$. These are the columns:
$$M = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 3\end{bmatrix} \quad (3 \times 4).$$
3. Use it on $p(t) = 5 - 2t + 4t^2 + t^3$: $M(5, -2, 4, 1) = (-2, 8, 3)$, so $p'(t) = -2 + 8t + 3t^2$. Differentiating directly gives the same. ✓
4. $\operatorname{Nul} M = \operatorname{Span}\{(1, 0, 0, 0)\}$, which is the coordinate vector of the constant polynomial 1: the kernel of $D$ is the constants. $M$ has a pivot in every row, so the range of $D$ is all of $\mathbb{P}_2$.

### Example 2

Let $T: \mathbb{P}_2 \to \mathbb{R}^2$ be evaluation at two points, $T(p) = (p(1), p(2))$, with
the standard bases. Find the kernel and range.

1. Columns: $T(1) = (1, 1)$, $T(t) = (1, 2)$, $T(t^2) = (1, 4)$, so $M = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 4\end{bmatrix}$.
2. Row-reduce: $R_2 \leftarrow R_2 - R_1$ gives $[\,0 \;\; 1 \;\; 3\,]$; then $R_1 \leftarrow R_1 - R_2$ gives $[\,1 \;\; 0 \;\; {-2}\,]$. So $x_1 = 2x_3$, $x_2 = -3x_3$, and $\operatorname{Nul} M = \operatorname{Span}\{(2, -3, 1)\}$.
3. Translate back: the kernel of $T$ is spanned by $2 - 3t + t^2 = (t - 1)(t - 2)$. That makes sense: the quadratics that vanish at 1 and 2 are the multiples of $(t - 1)(t - 2)$.
4. $M$ has two pivots, one per row, so the range is all of $\mathbb{R}^2$: every pair of values $(p(1), p(2))$ is reached. $T$ is onto but not one-to-one.

## Kernel, range and rank–nullity for linear maps

Example 1 had $\dim \ker D = 1$ and range of dimension 3, adding to $4 = \dim\mathbb{P}_3$.
Example 2 had $1 + 2 = 3 = \dim\mathbb{P}_2$. That is no accident.

> *Rank–nullity for linear maps.* If $T: V \to W$ is linear and $V$ is finite-dimensional, then
> $$\dim V = \dim(\ker T) + \dim(\operatorname{range} T).$$

*Proof (for finite-dimensional $W$).* Choose bases and let $M$ be the matrix of $T$. The
$\mathcal{B}$-coordinate mapping is an isomorphism from $V$ to $\mathbb{R}^n$, and it carries
$\ker T$ exactly onto $\operatorname{Nul} M$: $T(\mathbf{x}) = \mathbf{0}$ if and only if
$M[\mathbf{x}]_{\mathcal{B}} = \mathbf{0}$. Likewise the $\mathcal{C}$-coordinate mapping carries
$\operatorname{range} T$ exactly onto $\operatorname{Col} M$. Isomorphisms take bases to bases,
so they preserve dimension. Now the rank theorem for $M$ gives
$n = \dim\operatorname{Nul} M + \operatorname{rank} M = \dim\ker T + \dim\operatorname{range} T$. $\blacksquare$

The dimension of the range is called the rank of $T$. Three quick consequences:

- If $\dim V > \dim W$, $T$ cannot be one-to-one (its kernel has dimension at least $\dim V - \dim W > 0$).
- If $\dim V < \dim W$, $T$ cannot be onto (its range has dimension at most $\dim V$).
- If $\dim V = \dim W$, then $T$ is one-to-one exactly when it is onto: kernel $\{\mathbf{0}\}$ means range of dimension $\dim V = \dim W$.

So no linear map squeezes $\mathbb{P}_3$ (dimension 4) one-to-one into $\mathbb{R}^3$, and no linear
map from $\mathbb{R}^2$ covers $M_{2\times 2}$ (dimension 4).

## Isomorphism and dimension

Two vector spaces are **isomorphic** if there is an isomorphism (a one-to-one, onto linear map)
from one to the other.

> *Theorem.* Finite-dimensional spaces $V$ and $W$ are isomorphic if and only if $\dim V = \dim W$.

If $\dim V = \dim W = n$, compose the $\mathcal{B}$-coordinate mapping $V \to \mathbb{R}^n$ with the
inverse of the $\mathcal{C}$-coordinate mapping $\mathbb{R}^n \to W$. Conversely an isomorphism
has kernel $\{\mathbf{0}\}$ and range $W$, so rank–nullity gives $\dim V = 0 + \dim W$. So
$\mathbb{P}_3$, $\mathbb{R}^4$ and $M_{2\times 2}$ are all "the same space wearing different
clothes", and a linear map between finite-dimensional spaces is invertible exactly when its
matrix (relative to any bases) is square and invertible.

### Example 3

Let $T: M_{2\times 2} \to M_{2\times 2}$ be the transpose, $T(A) = A^T$, with the basis
$\mathcal{E} = \{E_{11}, E_{12}, E_{21}, E_{22}\}$, where $E_{ij}$ has a 1 in position $(i, j)$ and
0 elsewhere.

1. $T(E_{11}) = E_{11}$, $T(E_{12}) = E_{21}$, $T(E_{21}) = E_{12}$, $T(E_{22}) = E_{22}$.
2. So $M = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1\end{bmatrix}$: it swaps the second and third coordinates.
3. $M$ is invertible (in fact $M^2 = I$, because transposing twice changes nothing), so $T$ is an isomorphism of $M_{2\times 2}$ onto itself.

## Composition is multiplication

If $T: U \to V$ has matrix $M_T$ (bases $\mathcal{A}$, $\mathcal{B}$) and $S: V \to W$ has matrix
$M_S$ (bases $\mathcal{B}$, $\mathcal{C}$), then $S \circ T$ has matrix $M_SM_T$ (bases $\mathcal{A}$,
$\mathcal{C}$), because $[S(T(\mathbf{x}))]_{\mathcal{C}} = M_S[T(\mathbf{x})]_{\mathcal{B}} = M_SM_T[\mathbf{x}]_{\mathcal{A}}$.
The middle basis must match. In particular the inverse of an isomorphism has the inverse
matrix. Changing the bases changes the matrix, by multiplying with change-of-basis
matrices on each side; the eigenvalue module studies the case of an operator on
$\mathbb{R}^n$, where the new matrix is $P^{-1}AP$.

### Example 4

Let $S: \mathbb{P}_2 \to \mathbb{P}_2$ shift the input, $S(p)(t) = p(t + 1)$, with the basis
$\{1, t, t^2\}$.

1. $S(1) = 1$, $S(t) = t + 1$, $S(t^2) = (t + 1)^2 = 1 + 2t + t^2$, so $M_S = \begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 2 \\ 0 & 0 & 1\end{bmatrix}$.
2. For $q(t) = 3 - t + 2t^2$: $M_S(3, -1, 2) = (4, 3, 2)$, so $q(t + 1) = 4 + 3t + 2t^2$. Directly: $3 - (t + 1) + 2(t + 1)^2 = 4 + 3t + 2t^2$. ✓
3. The inverse operator shifts back, $p(t) \mapsto p(t - 1)$. Its matrix, built the same way from $(t - 1)^2 = 1 - 2t + t^2$, is $\begin{bmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1\end{bmatrix}$, and multiplying the two matrices gives $I_3$, as composition predicts.

## Common mistakes

- *Writing $T(\mathbf{b}_j)$ as a row.* Coordinates of $T(\mathbf{b}_j)$ go in column $j$.
- *Getting the size backwards.* The matrix is $\dim W \times \dim V$: differentiation $\mathbb{P}_3 \to \mathbb{P}_2$ gives a $3 \times 4$ matrix, not $4 \times 3$.
- *Skipping the output coordinates.* If $\mathcal{C}$ isn't a standard basis, $T(\mathbf{b}_j)$ must be rewritten in $\mathcal{C}$-coordinates (a small system to solve) before it becomes a column.
- *Thinking the matrix belongs to $T$ alone.* It depends on both bases and on their order; change either and the matrix changes, but its rank does not.
- *Reading the null space as polynomials directly.* $\operatorname{Nul} M$ holds coordinate vectors; translate $(2, -3, 1)$ back to $2 - 3t + t^2$.

## Key points

- For $T: V \to W$ with bases $\mathcal{B}$, $\mathcal{C}$: $[T(\mathbf{x})]_{\mathcal{C}} = M[\mathbf{x}]_{\mathcal{B}}$, where column $j$ of $M$ is $[T(\mathbf{b}_j)]_{\mathcal{C}}$.
- $\ker T$ and $\operatorname{range} T$ correspond to $\operatorname{Nul} M$ and $\operatorname{Col} M$.
- Rank–nullity: $\dim V = \dim\ker T + \dim\operatorname{range} T$.
- Finite-dimensional spaces are isomorphic exactly when they have the same dimension.
- The matrix of a composition is the product of the matrices, with the middle basis shared.
