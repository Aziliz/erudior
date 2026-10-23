---
id: la-coordinates
module: la-m7
title: Coordinates and change of basis
minutes: 35
topics: [Coordinates, Change of basis]
drills: [la-coord, la-change-basis]
refs: [la-ref-factor]
---
## Describing vectors in a new language

The standard basis makes coordinates feel automatic: $(3, 5)$ means $3\mathbf{e}_1 + 5\mathbf{e}_2$.
But any basis can serve as a coordinate system, and often a different one is far more
natural: axes aligned with a tilted ellipse, with the eigenvectors of a matrix, or with the
directions of a crystal lattice. This lesson shows how to describe a vector in terms of any
basis, and how to translate between two bases.

## Coordinates relative to a basis

> *Unique representation theorem.* Let $\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ be a basis for a vector space $V$. Then each $\mathbf{x}$ in $V$ can be written in exactly one way as $\mathbf{x} = c_1\mathbf{b}_1 + \cdots + c_n\mathbf{b}_n$.

Existence holds because $\mathcal{B}$ spans $V$. For uniqueness, if two sets of weights both
worked, subtracting the two expressions would give a dependence relation, and since
$\mathcal{B}$ is independent, all the differences must be 0.

The weights are the **coordinates** of $\mathbf{x}$ relative to $\mathcal{B}$, and

$$[\mathbf{x}]_{\mathcal{B}} = \begin{bmatrix} c_1 \\ \vdots \\ c_n\end{bmatrix}$$

is the **coordinate vector** of $\mathbf{x}$ (the $\mathcal{B}$-coordinates of $\mathbf{x}$).

### Example 1

Let $\mathcal{B} = \{\mathbf{b}_1, \mathbf{b}_2\}$ with $\mathbf{b}_1 = (2, 1)$ and $\mathbf{b}_2 = (-1, 1)$. Find $[\mathbf{x}]_{\mathcal{B}}$ for $\mathbf{x} = (1, 5)$.

1. Solve $c_1\mathbf{b}_1 + c_2\mathbf{b}_2 = \mathbf{x}$: $2c_1 - c_2 = 1$ and $c_1 + c_2 = 5$.
2. Adding: $3c_1 = 6$, so $c_1 = 2$ and $c_2 = 3$.
3. $[\mathbf{x}]_{\mathcal{B}} = (2, 3)$. Check: $2(2, 1) + 3(-1, 1) = (1, 5)$. ✓

```plot
{"x": [-3, 5], "y": [-1, 6], "equal": true, "segments": [{"from": [0, 0], "to": [2, 1], "arrow": true, "label": "b₁"}, {"from": [0, 0], "to": [-1, 1], "arrow": true, "label": "b₂"}, {"from": [0, 0], "to": [4, 2], "arrow": true, "dashed": true, "label": "2b₁"}, {"from": [4, 2], "to": [1, 5], "arrow": true, "dashed": true, "label": "3b₂"}, {"from": [0, 0], "to": [1, 5], "arrow": true, "label": "x"}], "caption": "x = 2b₁ + 3b₂, so its B-coordinates are (2, 3)"}
```

The same point has standard coordinates $(1, 5)$ and $\mathcal{B}$-coordinates $(2, 3)$:
same arrow, different description.

Drawing the whole $\mathcal{B}$-grid makes this visible: the grid lines are the lines
$c_1 = \text{constant}$ and $c_2 = \text{constant}$, and $\mathcal{B}$-coordinates count grid
steps along $\mathbf{b}_1$ and $\mathbf{b}_2$ the way standard coordinates count steps along
the axes.

![A slanted grid built from b₁ = (2, 1) and b₂ = (−1, 1), drawn over the standard axes. The vector x = (1, 5) is reached by the dashed path 2b₁ followed by 3b₂, so it sits at grid point (2, 3).](images/la-m7-coord-grid.svg)

## The change-of-coordinates matrix in $\mathbb{R}^n$

Example 1 solved the equation $[\,\mathbf{b}_1 \;\; \mathbf{b}_2\,]\,[\mathbf{x}]_{\mathcal{B}} = \mathbf{x}$.
In general, let $P_{\mathcal{B}} = [\,\mathbf{b}_1 \;\cdots\; \mathbf{b}_n\,]$, the
**change-of-coordinates matrix** from $\mathcal{B}$ to the standard basis. Then

$$\mathbf{x} = P_{\mathcal{B}}[\mathbf{x}]_{\mathcal{B}}, \qquad [\mathbf{x}]_{\mathcal{B}} = P_{\mathcal{B}}^{-1}\mathbf{x}.$$

$P_{\mathcal{B}}$ is invertible because its columns form a basis. Multiplying by $P_{\mathcal{B}}$
converts $\mathcal{B}$-coordinates to standard ones; multiplying by its inverse goes back.

## Coordinates in other vector spaces

The **coordinate mapping** $\mathbf{x} \mapsto [\mathbf{x}]_{\mathcal{B}}$ is a one-to-one linear
transformation from $V$ onto $\mathbb{R}^n$, a correspondence called an **isomorphism**. It lets
us do computations in any vector space with an $n$-vector basis by working in $\mathbb{R}^n$.

For example, with the standard basis $\{1, t, t^2\}$ of $\mathbb{P}_2$, the polynomial
$p(t) = 3 - 2t + 5t^2$ has coordinate vector $(3, -2, 5)$. To test whether $1 + t^2$,
$t + t^2$ and $1 + 2t + 3t^2$ are independent in $\mathbb{P}_2$, test their coordinate vectors
$(1, 0, 1)$, $(0, 1, 1)$, $(1, 2, 3)$ in $\mathbb{R}^3$. The third is the first plus twice the
second, so the polynomials are dependent: $1 + 2t + 3t^2 = (1 + t^2) + 2(t + t^2)$.

## Changing from one basis to another

Suppose $\mathcal{B} = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ and
$\mathcal{C} = \{\mathbf{c}_1, \dots, \mathbf{c}_n\}$ are two bases of $V$.

> *Theorem.* There is a unique $n \times n$ matrix $P_{\mathcal{C} \leftarrow \mathcal{B}}$ with $[\mathbf{x}]_{\mathcal{C}} = P_{\mathcal{C} \leftarrow \mathcal{B}}[\mathbf{x}]_{\mathcal{B}}$ for every $\mathbf{x}$. Its columns are the $\mathcal{C}$-coordinate vectors of the vectors in $\mathcal{B}$:
> $$P_{\mathcal{C} \leftarrow \mathcal{B}} = \big[\, [\mathbf{b}_1]_{\mathcal{C}} \;\; [\mathbf{b}_2]_{\mathcal{C}} \;\cdots\; [\mathbf{b}_n]_{\mathcal{C}} \,\big].$$

It is called the **change-of-basis matrix** from $\mathcal{B}$ to $\mathcal{C}$. Why: if
$\mathbf{x} = c_1\mathbf{b}_1 + \cdots + c_n\mathbf{b}_n$, the coordinate mapping is linear, so
$[\mathbf{x}]_{\mathcal{C}} = c_1[\mathbf{b}_1]_{\mathcal{C}} + \cdots + c_n[\mathbf{b}_n]_{\mathcal{C}}$.
Its inverse is $P_{\mathcal{B} \leftarrow \mathcal{C}}$.

In $\mathbb{R}^n$ the columns $[\mathbf{b}_j]_{\mathcal{C}}$ come from one row reduction:

$$[\,\mathbf{c}_1 \;\cdots\; \mathbf{c}_n \;\;|\;\; \mathbf{b}_1 \;\cdots\; \mathbf{b}_n\,] \sim [\,I \;\;|\;\; P_{\mathcal{C} \leftarrow \mathcal{B}}\,].$$

(Equivalently $P_{\mathcal{C} \leftarrow \mathcal{B}} = P_{\mathcal{C}}^{-1}P_{\mathcal{B}}$.)

The three descriptions of a vector and the matrices that convert between them:

```mermaid
flowchart LR
  accTitle: Converting between coordinate systems
  accDescr: B-coordinates of x turn into the standard coordinates of x by multiplying by P sub B. Standard coordinates turn into C-coordinates by multiplying by the inverse of P sub C. The direct route from B-coordinates to C-coordinates multiplies by the change-of-basis matrix P from B to C, which equals P sub C inverse times P sub B.
  B["B-coordinates of x"] -- "multiply by P_B" --> X["x itself (standard coordinates)"]
  X -- "multiply by P_C inverse" --> C["C-coordinates of x"]
  B -- "multiply by P from B to C" --> C
```

### Example 2

Let $\mathbf{b}_1 = (1, 2)$, $\mathbf{b}_2 = (1, 3)$, $\mathbf{c}_1 = (1, 1)$, $\mathbf{c}_2 = (1, 2)$. Find $P_{\mathcal{C} \leftarrow \mathcal{B}}$, and $[\mathbf{x}]_{\mathcal{C}}$ if $[\mathbf{x}]_{\mathcal{B}} = (4, -1)$.

1. Row-reduce $\left[\begin{array}{cc|cc} 1 & 1 & 1 & 1 \\ 1 & 2 & 2 & 3\end{array}\right]$. $R_2 \leftarrow R_2 - R_1$: $[\,0 \;\; 1 \;\; 1 \;\; 2\,]$. $R_1 \leftarrow R_1 - R_2$: $[\,1 \;\; 0 \;\; 0 \;\; {-1}\,]$.
2. $P_{\mathcal{C} \leftarrow \mathcal{B}} = \begin{bmatrix} 0 & -1 \\ 1 & 2\end{bmatrix}$. (Check column 1: $0\mathbf{c}_1 + 1\mathbf{c}_2 = (1, 2) = \mathbf{b}_1$. ✓)
3. $[\mathbf{x}]_{\mathcal{C}} = \begin{bmatrix} 0 & -1 \\ 1 & 2\end{bmatrix}\begin{bmatrix} 4 \\ -1\end{bmatrix} = \begin{bmatrix} 1 \\ 2\end{bmatrix}$.
4. Check in standard coordinates: $4\mathbf{b}_1 - \mathbf{b}_2 = (3, 5)$ and $1\mathbf{c}_1 + 2\mathbf{c}_2 = (3, 5)$. ✓

### Example 3

Use $P_{\mathcal{B}}^{-1}$ to find $[\mathbf{x}]_{\mathcal{B}}$ for $\mathcal{B} = \{(3, 1), (5, 2)\}$ and $\mathbf{x} = (4, 1)$.

1. $P_{\mathcal{B}} = \begin{bmatrix} 3 & 5 \\ 1 & 2\end{bmatrix}$ has determinant $6 - 5 = 1$, so $P_{\mathcal{B}}^{-1} = \begin{bmatrix} 2 & -5 \\ -1 & 3\end{bmatrix}$.
2. $[\mathbf{x}]_{\mathcal{B}} = P_{\mathcal{B}}^{-1}\mathbf{x} = (8 - 5,\ -4 + 3) = (3, -1)$.
3. Check: $3(3, 1) - 1(5, 2) = (4, 1)$. ✓

When you need the $\mathcal{B}$-coordinates of many vectors, computing $P_{\mathcal{B}}^{-1}$ once and multiplying is convenient; for a single vector, row-reducing $[\,P_{\mathcal{B}} \;\; \mathbf{x}\,]$ is just as fast.

## Common mistakes

- *Confusing $\mathbf{x}$ with $[\mathbf{x}]_{\mathcal{B}}$.* One is the vector; the other is its list of weights in a particular basis.
- *Using $P_{\mathcal{B}}$ in the wrong direction.* $P_{\mathcal{B}}$ turns $\mathcal{B}$-coordinates into standard ones; to find $\mathcal{B}$-coordinates, solve $P_{\mathcal{B}}\mathbf{c} = \mathbf{x}$.
- *Row-reducing $[\,\mathcal{B} \;|\; \mathcal{C}\,]$ instead of $[\,\mathcal{C} \;|\; \mathcal{B}\,]$.* The target basis goes on the left.
- *Assuming order doesn't matter in a basis.* Coordinates depend on the order of the basis vectors.

## Key points

- In a basis $\mathcal{B}$, every vector has unique weights; they form $[\mathbf{x}]_{\mathcal{B}}$.
- In $\mathbb{R}^n$: $\mathbf{x} = P_{\mathcal{B}}[\mathbf{x}]_{\mathcal{B}}$ with $P_{\mathcal{B}} = [\,\mathbf{b}_1 \;\cdots\; \mathbf{b}_n\,]$.
- The coordinate mapping is an isomorphism $V \to \mathbb{R}^n$, so questions in $\mathbb{P}_n$ or $M_{m\times n}$ become questions in $\mathbb{R}^n$.
- $P_{\mathcal{C} \leftarrow \mathcal{B}}$ has columns $[\mathbf{b}_j]_{\mathcal{C}}$; get it by row-reducing $[\,\mathcal{C} \;|\; \mathcal{B}\,]$.
