---
id: la-bases
module: la-m7
title: Bases
minutes: 35
topics: [Bases]
drills: [la-nul-basis, la-rank-echelon]
refs: [la-ref-row]
---
## The most efficient spanning set

A spanning set describes a subspace, but it may contain redundant vectors. A linearly
independent set has no redundancy, but it may not reach everything. A *basis* is a set that
does both jobs at once: it spans, and nothing in it is wasted. Bases are the backbone of the
rest of the course: coordinates, dimension, change of basis, diagonalization and orthogonal
bases all start here.

## Definition

The definitions of linear independence and span carry over word for word to any vector
space. Let $H$ be a subspace of a vector space $V$. A set $\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_p\}$
in $V$ is a **basis** for $H$ if

1. $\mathcal{B}$ is linearly independent, and
2. $H = \operatorname{Span}\{\mathbf{b}_1, \dots, \mathbf{b}_p\}$.

Examples:

- The columns $\mathbf{e}_1, \dots, \mathbf{e}_n$ of $I_n$ form the **standard basis** for $\mathbb{R}^n$.
- $\{1, t, t^2, \dots, t^n\}$ is the standard basis for $\mathbb{P}_n$.
- If $A$ is an invertible $n \times n$ matrix, its columns form a basis for $\mathbb{R}^n$: by the IMT they are independent and span $\mathbb{R}^n$.
- $\{(1, 2), (3, 6)\}$ is not a basis for $\mathbb{R}^2$ (dependent); $\{(1, 0, 0), (0, 1, 0)\}$ is not a basis for $\mathbb{R}^3$ (doesn't span).

A basis is a spanning set that's as small as possible (remove any vector and it no longer
spans) and an independent set that's as large as possible (add any vector of $H$ and it
becomes dependent).

## Trimming a spanning set

> *Spanning set theorem.* Let $S = \{\mathbf{v}_1, \dots, \mathbf{v}_p\}$ span a subspace $H \ne \{\mathbf{0}\}$. If some $\mathbf{v}_k$ is a linear combination of the others, removing it leaves a set that still spans $H$. Some subset of $S$ is a basis for $H$.

Why: anything written using $\mathbf{v}_k$ can be rewritten by substituting its expression in
terms of the others. Keep removing redundant vectors until the set is independent.

## A basis for $\operatorname{Col} A$

Row reduction tells us *which* columns to keep. The key observation: row operations don't
change the linear dependence relations among the columns. If
$A\mathbf{x} = \mathbf{0}$ and $B\mathbf{x} = \mathbf{0}$ have the same solutions (as they do
for row-equivalent $A$ and $B$), then the columns of $A$ and of $B$ satisfy exactly the same
relations.

In the RREF, every non-pivot column is visibly a combination of the pivot columns, and the
pivot columns (pieces of the identity) are independent. Therefore:

> *Theorem.* The pivot columns of $A$ form a basis for $\operatorname{Col} A$.

Use the pivot columns of the *original* matrix $A$, not of its echelon form: row reduction
changes the column space.

### Example 1

Find bases for $\operatorname{Col} A$, $\operatorname{Nul} A$ and $\operatorname{Row} A$, where
$A = \begin{bmatrix} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 0 \\ 3 & 6 & 0 & 3\end{bmatrix}$.

1. Row-reduce. $R_2 \leftarrow R_2 - 2R_1$: $[\,0 \;\; 0 \;\; 3 \;\; {-6}\,]$. $R_3 \leftarrow R_3 - 3R_1$: $[\,0 \;\; 0 \;\; 3 \;\; {-6}\,]$. $R_3 \leftarrow R_3 - R_2$: zero row. Scale row 2 by $\tfrac13$ and clear above: the RREF is
$$\begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 0 & 1 & -2 \\ 0 & 0 & 0 & 0\end{bmatrix}.$$
2. Pivot columns are 1 and 3. Basis for $\operatorname{Col} A$: columns 1 and 3 *of A*, $\{(1, 2, 3), (-1, 1, 0)\}$.
3. The RREF also shows the relations: column 2 $= 2\,$(column 1), and column 4 $= 1\,$(column 1) $- 2\,$(column 3). Check in $A$: $(1, 2, 3) - 2(-1, 1, 0) = (3, 0, 3)$, which is column 4. ✓
4. $\operatorname{Nul} A$: $x_1 = -2x_2 - x_4$, $x_3 = 2x_4$, with $x_2, x_4$ free. Basis: $\{(-2, 1, 0, 0), (-1, 0, 2, 1)\}$.
5. $\operatorname{Row} A$: the nonzero rows of an echelon form, $\{(1, 2, 0, 1), (0, 0, 1, -2)\}$.

Notice the asymmetry: for $\operatorname{Row} A$ we use rows of the echelon form (row
operations preserve the row space), but for $\operatorname{Col} A$ we go back to the columns of
$A$.

> *Theorem.* The nonzero rows of an echelon form of $A$ form a basis for $\operatorname{Row} A$.

They span $\operatorname{Row} A$ (row operations preserve it), and they're independent because
of the staircase of leading entries.

## Bases from the null space

The method from the previous lesson always produces a basis for $\operatorname{Nul} A$: the
vectors from the parametric vector form span it and are independent. If there are no free
variables, $\operatorname{Nul} A = \{\mathbf{0}\}$, whose basis is the empty set.

### Example 2

Is $\{(1, 0, 2), (0, 1, -1), (1, 1, 2)\}$ a basis for $\mathbb{R}^3$?

1. Put the vectors in a matrix as columns: $\begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 2 & -1 & 2\end{bmatrix}$.
2. $R_3 \leftarrow R_3 - 2R_1$: $[\,0 \;\; {-1} \;\; 0\,]$. $R_3 \leftarrow R_3 + R_2$: $[\,0 \;\; 0 \;\; 1\,]$.
3. Three pivots, so by the IMT the columns are independent and span $\mathbb{R}^3$. Yes, it's a basis.

## Common mistakes

- *Taking pivot columns from the RREF* as a basis for $\operatorname{Col} A$. In Example 1, the RREF's pivot columns $(1, 0, 0)$ and $(0, 1, 0)$ don't even lie in $\operatorname{Col} A$.
- *Taking rows of $A$* (instead of an echelon form) as a basis for $\operatorname{Row} A$; the rows of $A$ may be dependent.
- *Confusing "spans" with "is a basis".* A spanning set may have extra vectors.
- *Listing the zero vector in a basis.* Any set containing $\mathbf{0}$ is dependent.

## Key points

- A basis is a linearly independent spanning set: a minimal spanning set and a maximal independent set.
- Standard bases: $\{\mathbf{e}_1, \dots, \mathbf{e}_n\}$ for $\mathbb{R}^n$ and $\{1, t, \dots, t^n\}$ for $\mathbb{P}_n$.
- Basis for $\operatorname{Col} A$: the pivot columns of $A$ itself.
- Basis for $\operatorname{Nul} A$: the vectors in the parametric vector form of $A\mathbf{x} = \mathbf{0}$.
- Basis for $\operatorname{Row} A$: the nonzero rows of an echelon form.
