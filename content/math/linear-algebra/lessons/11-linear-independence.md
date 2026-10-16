---
id: la-independence
module: la-m3
title: Linear independence
minutes: 30
topics: [Linear independence]
drills: [la-indep-h, la-dep-relation]
refs: [la-ref-row]
---
## Is anything redundant?

The span lesson showed that adding a vector to a set doesn't always enlarge the span: if
the new vector is already a combination of the others, it contributes nothing. Linear
independence makes "no redundancy" precise. It is the companion of span: span asks
whether a set of vectors reaches everything it should; independence asks whether it does
so without waste. Together they will define a basis in Module 7.

## The definition

An indexed set of vectors $\{\mathbf{v}_1, \dots, \mathbf{v}_p\}$ in $\mathbb{R}^n$ is
**linearly independent** if the vector equation

$$x_1\mathbf{v}_1 + x_2\mathbf{v}_2 + \cdots + x_p\mathbf{v}_p = \mathbf{0}$$

has *only* the trivial solution. The set is **linearly dependent** if there are weights
$c_1, \dots, c_p$, *not all zero*, with $c_1\mathbf{v}_1 + \cdots + c_p\mathbf{v}_p = \mathbf{0}$.
Such an equation is called a **linear dependence relation**.

Since the vector equation is the homogeneous system $A\mathbf{x} = \mathbf{0}$ with
$A = [\,\mathbf{v}_1 \;\cdots\; \mathbf{v}_p\,]$, we get the working test:

> The columns of $A$ are linearly independent if and only if $A\mathbf{x} = \mathbf{0}$ has only the trivial solution, if and only if every column of $A$ is a pivot column (no free variables).

### Example 1

Are $\mathbf{v}_1 = \begin{bmatrix} 1 \\ -1 \\ 2\end{bmatrix}$, $\mathbf{v}_2 = \begin{bmatrix} 2 \\ 1 \\ 1\end{bmatrix}$, $\mathbf{v}_3 = \begin{bmatrix} 0 \\ 3 \\ -3\end{bmatrix}$ linearly independent? If not, find a dependence relation.

1. Row-reduce $A = [\,\mathbf{v}_1 \;\; \mathbf{v}_2 \;\; \mathbf{v}_3\,] = \begin{bmatrix} 1 & 2 & 0 \\ -1 & 1 & 3 \\ 2 & 1 & -3\end{bmatrix}$. $R_2 \leftarrow R_2 + R_1$ gives $[\,0 \;\; 3 \;\; 3\,]$; $R_3 \leftarrow R_3 - 2R_1$ gives $[\,0 \;\; {-3} \;\; {-3}\,]$; $R_3 \leftarrow R_3 + R_2$ gives zeros.
2. Column 3 has no pivot, so $x_3$ is free and the set is linearly dependent.
3. For a relation, finish the RREF: $\begin{bmatrix} 1 & 0 & -2 \\ 0 & 1 & 1 \\ 0 & 0 & 0\end{bmatrix}$, so $x_1 = 2x_3$, $x_2 = -x_3$.
4. Choose $x_3 = 1$: $x_1 = 2$, $x_2 = -1$. So $2\mathbf{v}_1 - \mathbf{v}_2 + \mathbf{v}_3 = \mathbf{0}$.
5. Check: $2(1, -1, 2) - (2, 1, 1) + (0, 3, -3) = (0, 0, 0)$. ✓

Equivalently $\mathbf{v}_3 = \mathbf{v}_2 - 2\mathbf{v}_1$: the third vector lies in the
plane spanned by the first two, so it adds nothing to the span.

## Quick tests for small and special sets

You can often decide independence without row reduction.

- *One vector:* $\{\mathbf{v}\}$ is independent exactly when $\mathbf{v} \ne \mathbf{0}$.
- *Two vectors:* $\{\mathbf{u}, \mathbf{v}\}$ is dependent exactly when one is a multiple of the other. Geometrically: independent means they don't lie on one line through the origin.
- *A set containing $\mathbf{0}$* is always dependent: $1\cdot\mathbf{0} + 0\mathbf{v}_2 + \cdots = \mathbf{0}$ is a nontrivial relation.
- *Too many vectors:* if $p > n$, any $p$ vectors in $\mathbb{R}^n$ are dependent. The matrix $[\,\mathbf{v}_1 \;\cdots\; \mathbf{v}_p\,]$ is $n \times p$ with more columns than rows, so it can't have a pivot in every column.

So three vectors in $\mathbb{R}^2$, or five vectors in $\mathbb{R}^4$, are automatically
dependent. The converse fails: three vectors in $\mathbb{R}^3$ might be dependent, as
Example 1 shows.

```plot
{"x": [-3, 4], "y": [-2, 4], "equal": true, "segments": [{"from": [0, 0], "to": [2, 1], "arrow": true, "label": "u"}, {"from": [0, 0], "to": [-1, 2], "arrow": true, "label": "v"}, {"from": [0, 0], "to": [1, 3], "arrow": true, "label": "w"}], "caption": "Three vectors in R²: w = u + v, so the set is dependent"}
```

## Dependence means some vector is redundant

> *Characterization of dependent sets.* A set $\{\mathbf{v}_1, \dots, \mathbf{v}_p\}$ with $p \ge 2$ is linearly dependent if and only if at least one of the vectors is a linear combination of the others. In fact, if the set is dependent and $\mathbf{v}_1 \ne \mathbf{0}$, then some $\mathbf{v}_j$ (with $j > 1$) is a linear combination of the vectors before it.

Why: given a relation $c_1\mathbf{v}_1 + \cdots + c_p\mathbf{v}_p = \mathbf{0}$ with some
$c_j \ne 0$, solve for $\mathbf{v}_j$ by dividing by $c_j$. Conversely, if
$\mathbf{v}_j = \sum_{i \ne j} d_i\mathbf{v}_i$, then moving $\mathbf{v}_j$ across gives a
relation with coefficient $-1 \ne 0$ on $\mathbf{v}_j$.

Careful: it says *at least one* vector is a combination of the others, not *every* one. In
$\{(1, 0), (2, 0), (0, 1)\}$ the first two are multiples of each other, but $(0, 1)$ is not a
combination of the others.

### Example 2

For which $h$ are $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 2 \\ -1\end{bmatrix}$, $\mathbf{v}_2 = \begin{bmatrix} 3 \\ 7 \\ -2\end{bmatrix}$, $\mathbf{v}_3 = \begin{bmatrix} 2 \\ 1 \\ h\end{bmatrix}$ linearly dependent?

1. Row-reduce $\begin{bmatrix} 1 & 3 & 2 \\ 2 & 7 & 1 \\ -1 & -2 & h\end{bmatrix}$. $R_2 \leftarrow R_2 - 2R_1$: $[\,0 \;\; 1 \;\; {-3}\,]$. $R_3 \leftarrow R_3 + R_1$: $[\,0 \;\; 1 \;\; h + 2\,]$.
2. $R_3 \leftarrow R_3 - R_2$: $[\,0 \;\; 0 \;\; h + 5\,]$.
3. Column 3 is a pivot column unless $h + 5 = 0$. So the vectors are dependent exactly when $h = -5$.

## Common mistakes

- *"Some weights are zero, so it's independent."* A dependence relation only needs the weights to be *not all* zero.
- *Using the augmented column.* For independence, row-reduce $[\,\mathbf{v}_1 \;\cdots\; \mathbf{v}_p\,]$ (the zero column adds nothing) and look for pivots in every column.
- *Confusing "pivot in every column" (independence) with "pivot in every row" (spanning).*
- *Concluding that every vector in a dependent set is a combination of the others.*

## Key points

- Independent: $x_1\mathbf{v}_1 + \cdots + x_p\mathbf{v}_p = \mathbf{0}$ only for all $x_i = 0$. Dependent: a nontrivial relation exists.
- The columns of $A$ are independent ⟺ $A\mathbf{x} = \mathbf{0}$ has only the trivial solution ⟺ a pivot in every column.
- Sets containing $\mathbf{0}$, and sets of more than $n$ vectors in $\mathbb{R}^n$, are dependent.
- Two vectors are dependent exactly when one is a multiple of the other.
- A set is dependent exactly when some vector in it is a linear combination of the others.
