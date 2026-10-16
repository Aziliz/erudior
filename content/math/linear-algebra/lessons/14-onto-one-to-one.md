---
id: la-onto-one
module: la-m4
title: One-to-one and onto
minutes: 30
topics: [One-to-one and onto]
drills: [la-param-form, la-indep-h]
refs: [la-ref-imt]
---
## Existence and uniqueness, one more time

Every linear system raised two questions: does a solution exist, and is it unique? For a
transformation $T(\mathbf{x}) = A\mathbf{x}$, the same questions become properties of $T$
itself. *Onto* says every output is reached (existence for every $\mathbf{b}$);
*one-to-one* says no output is reached twice (uniqueness). The pleasant surprise is that
both properties can be read straight off the pivot positions of $A$, using the spanning and
independence tests from Module 3.

## Definitions

Let $T: \mathbb{R}^n \to \mathbb{R}^m$.

- $T$ is **onto** $\mathbb{R}^m$ if each $\mathbf{b}$ in $\mathbb{R}^m$ is the image of *at least one* $\mathbf{x}$ in $\mathbb{R}^n$. Equivalently, the range of $T$ is the whole codomain.
- $T$ is **one-to-one** if each $\mathbf{b}$ in $\mathbb{R}^m$ is the image of *at most one* $\mathbf{x}$. Equivalently, $T(\mathbf{u}) = T(\mathbf{v})$ forces $\mathbf{u} = \mathbf{v}$.

"At most one" includes "none": a one-to-one map may miss some outputs entirely. And an onto
map may hit some outputs many times. The two properties are independent of each other.

## A test for one-to-one

> *Theorem.* A linear transformation $T$ is one-to-one if and only if $T(\mathbf{x}) = \mathbf{0}$ has only the trivial solution.

Why: if $T$ is one-to-one, then since $T(\mathbf{0}) = \mathbf{0}$, no other $\mathbf{x}$ can
map to $\mathbf{0}$. Conversely, suppose only $\mathbf{0}$ maps to $\mathbf{0}$, and
$T(\mathbf{u}) = T(\mathbf{v})$. Then $T(\mathbf{u} - \mathbf{v}) = T(\mathbf{u}) - T(\mathbf{v}) = \mathbf{0}$,
so $\mathbf{u} - \mathbf{v} = \mathbf{0}$. Linearity turns a question about all outputs into
a question about the single output $\mathbf{0}$. This mirrors the structure theorem for
solution sets: solutions of $A\mathbf{x} = \mathbf{b}$ are a particular solution plus
homogeneous solutions, so they're unique exactly when the homogeneous system has only the
trivial solution.

## Reading both properties from pivots

Combine the definitions with the spanning theorem and the independence test:

> *Theorem.* Let $T(\mathbf{x}) = A\mathbf{x}$ with $A$ an $m \times n$ matrix.
> - $T$ is onto $\mathbb{R}^m$ ⟺ the columns of $A$ span $\mathbb{R}^m$ ⟺ $A$ has a pivot in every row.
> - $T$ is one-to-one ⟺ the columns of $A$ are linearly independent ⟺ $A$ has a pivot in every column.

Size alone gives quick conclusions:

- If $n > m$ (more columns than rows, a "wide" matrix), there can't be a pivot in every column, so $T$ is *not* one-to-one. Squeezing a bigger space into a smaller one must collapse something.
- If $n < m$ (a "tall" matrix), there can't be a pivot in every row, so $T$ is *not* onto. A smaller space can't fill a bigger one.
- If $n = m$ (square), a pivot in every row happens exactly when there's a pivot in every column, so $T$ is onto exactly when it is one-to-one. This is the start of the invertible matrix theorem.

| Shape of $A$ | Can be onto? | Can be one-to-one? |
|---|---|---|
| wide ($n > m$) | yes | never |
| tall ($n < m$) | never | yes |
| square ($n = m$) | yes, exactly when one-to-one | yes, exactly when onto |

### Example 1

Let $T(\mathbf{x}) = A\mathbf{x}$ with $A = \begin{bmatrix} 1 & 2 & 0 \\ 0 & 1 & 3\end{bmatrix}$. Is $T$ onto? One-to-one?

1. $A$ is already in echelon form, with pivots in columns 1 and 2, one in each row.
2. A pivot in every row: $T$ is onto $\mathbb{R}^2$.
3. Column 3 has no pivot, so $x_3$ is free and $A\mathbf{x} = \mathbf{0}$ has nontrivial solutions. Solving, $x_2 = -3x_3$ and $x_1 = -2x_2 = 6x_3$, so $(6, -3, 1)$ maps to $\mathbf{0}$.
4. So $T$ is not one-to-one: $\mathbf{0}$ and $(6, -3, 1)$ both map to $\mathbf{0}$.

### Example 2

Let $T(x_1, x_2) = (x_1,\ 2x_1 + x_2,\ 3x_2)$. Is $T$ onto $\mathbb{R}^3$? One-to-one?

1. Standard matrix: $T(\mathbf{e}_1) = (1, 2, 0)$ and $T(\mathbf{e}_2) = (0, 1, 3)$, so $A = \begin{bmatrix} 1 & 0 \\ 2 & 1 \\ 0 & 3\end{bmatrix}$.
2. $R_2 \leftarrow R_2 - 2R_1$ gives $[\,0 \;\; 1\,]$, then $R_3 \leftarrow R_3 - 3R_2$ gives $[\,0 \;\; 0\,]$. Pivots in both columns.
3. One-to-one: yes (pivot in every column, so the columns are independent).
4. Onto: no. Row 3 has no pivot; $T$ maps $\mathbb{R}^2$ onto a plane inside $\mathbb{R}^3$.

### Example 3

A $3 \times 3$ matrix $A$ has columns with $\mathbf{a}_3 = \mathbf{a}_1 + \mathbf{a}_2$. Then
$\mathbf{a}_1 + \mathbf{a}_2 - \mathbf{a}_3 = \mathbf{0}$, so $A(1, 1, -1) = \mathbf{0}$ and
$T$ is not one-to-one. Because $A$ is square, $T$ is not onto either. Without computing a
single row operation, we know $A\mathbf{x} = \mathbf{b}$ fails to be solvable for some
$\mathbf{b}$.

## Common mistakes

- *Swapping the conditions.* Onto ↔ pivot in every row ↔ spanning; one-to-one ↔ pivot in every column ↔ independence.
- *Thinking one-to-one means onto* (or vice versa) for non-square matrices. A tall matrix can be one-to-one and still miss most of the codomain.
- *Testing one-to-one with one input.* Showing $T(\mathbf{u}) \ne T(\mathbf{v})$ for a particular pair proves nothing; use $T(\mathbf{x}) = \mathbf{0}$.
- *Checking pivots of an augmented matrix.* These properties belong to $A$ alone.

## Key points

- Onto: every $\mathbf{b}$ is hit at least once. One-to-one: no $\mathbf{b}$ is hit more than once.
- Linear $T$ is one-to-one ⟺ $T(\mathbf{x}) = \mathbf{0}$ only for $\mathbf{x} = \mathbf{0}$.
- For $T(\mathbf{x}) = A\mathbf{x}$: onto ⟺ pivot in every row; one-to-one ⟺ pivot in every column.
- Wide matrices are never one-to-one, tall matrices are never onto, and for square matrices the two properties go together.
