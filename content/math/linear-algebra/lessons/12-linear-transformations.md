---
id: la-transformations
module: la-m4
title: Linear transformations
minutes: 30
topics: [Linear transformations]
drills: [la-T-image, la-T-from-basis]
refs: [la-ref-row]
---
## Matrices as functions

Until now, $A\mathbf{x} = \mathbf{b}$ was an equation to solve. Change the point of view:
think of $A$ as a machine that takes an input vector $\mathbf{x}$ and produces an output
vector $A\mathbf{x}$. Solving $A\mathbf{x} = \mathbf{b}$ then means finding an input that
the machine sends to $\mathbf{b}$. This dynamic view explains why matrices are useful in
graphics, physics and data science: they *move* vectors, by rotating, stretching,
projecting and shearing them.

## Transformations

A **transformation** (also called a function or mapping) $T$ from $\mathbb{R}^n$ to
$\mathbb{R}^m$, written $T: \mathbb{R}^n \to \mathbb{R}^m$, is a rule that assigns to each
$\mathbf{x}$ in $\mathbb{R}^n$ a vector $T(\mathbf{x})$ in $\mathbb{R}^m$.

- $\mathbb{R}^n$ is the **domain** and $\mathbb{R}^m$ is the **codomain**.
- $T(\mathbf{x})$ is the **image** of $\mathbf{x}$ under $T$.
- The set of all images $T(\mathbf{x})$ is the **range** of $T$. The range is part of the codomain, but it may not be all of it.

For an $m \times n$ matrix $A$, the rule $T(\mathbf{x}) = A\mathbf{x}$ is a **matrix transformation**, written $\mathbf{x} \mapsto A\mathbf{x}$. Its domain is $\mathbb{R}^n$
(the number of *columns*) and its codomain is $\mathbb{R}^m$ (the number of *rows*). Since
$A\mathbf{x}$ is a combination of the columns of $A$, the range of $\mathbf{x} \mapsto A\mathbf{x}$
is the span of the columns of $A$.

### Example 1

Let $A = \begin{bmatrix} 1 & -2 \\ 3 & 1 \\ 0 & 2\end{bmatrix}$ and $T(\mathbf{x}) = A\mathbf{x}$.

(a) Find the image of $\mathbf{u} = \begin{bmatrix} 2 \\ -1\end{bmatrix}$. (b) Find an $\mathbf{x}$ whose image is $\mathbf{b} = \begin{bmatrix} -3 \\ 5 \\ 4\end{bmatrix}$. Is it unique? (c) Is $\mathbf{c} = \begin{bmatrix} 1 \\ 1 \\ 1\end{bmatrix}$ in the range of $T$?

1. (a) $T(\mathbf{u}) = \begin{bmatrix} 2 + 2 \\ 6 - 1 \\ 0 - 2\end{bmatrix} = \begin{bmatrix} 4 \\ 5 \\ -2\end{bmatrix}$. Here $T$ maps $\mathbb{R}^2$ into $\mathbb{R}^3$.
2. (b) Solve $A\mathbf{x} = \mathbf{b}$. Row-reducing $\left[\begin{array}{cc|c} 1 & -2 & -3 \\ 3 & 1 & 5 \\ 0 & 2 & 4\end{array}\right]$ gives $\left[\begin{array}{cc|c} 1 & 0 & 1 \\ 0 & 1 & 2 \\ 0 & 0 & 0\end{array}\right]$, so $\mathbf{x} = (1, 2)$.
3. There are no free variables, so this $\mathbf{x}$ is the only one with $T(\mathbf{x}) = \mathbf{b}$.
4. (c) Row-reducing $[\,A \;\; \mathbf{c}\,]$ produces a pivot in the last column (the RREF is $I_3$), so $A\mathbf{x} = \mathbf{c}$ is inconsistent and $\mathbf{c}$ is *not* in the range.

The range of this $T$ is a plane through the origin in $\mathbb{R}^3$ (the span of the two
columns), so most vectors in the codomain are never hit.

## Linear transformations

Matrix transformations have two special properties, inherited from
$A(\mathbf{u} + \mathbf{v}) = A\mathbf{u} + A\mathbf{v}$ and $A(c\mathbf{u}) = cA\mathbf{u}$.
These properties are what "linear" means. A transformation $T$ is a **linear transformation** if, for all $\mathbf{u}, \mathbf{v}$ in its domain and all scalars $c$:

1. $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$;
2. $T(c\mathbf{u}) = cT(\mathbf{u})$.

In words: $T$ preserves vector addition and scalar multiplication. Adding then
transforming gives the same result as transforming then adding. Two consequences:

- $T(\mathbf{0}) = \mathbf{0}$, because $T(\mathbf{0}) = T(0\mathbf{0}) = 0T(\mathbf{0}) = \mathbf{0}$.
- $T(c\mathbf{u} + d\mathbf{v}) = cT(\mathbf{u}) + dT(\mathbf{v})$, and more generally $T$ of any linear combination is the same combination of the images. Engineers call this the **superposition principle**.

Checking $T(\mathbf{0}) = \mathbf{0}$ is a quick way to *rule out* linearity. For instance a
translation $T(\mathbf{x}) = \mathbf{x} + \mathbf{p}$ with $\mathbf{p} \ne \mathbf{0}$ sends
$\mathbf{0}$ to $\mathbf{p}$, so it is not linear. Likewise $T(x_1, x_2) = (x_1^2, x_2)$ fails
property 2: $T(2, 0) = (4, 0)$ but $2T(1, 0) = (2, 0)$.

## A linear transformation is determined by a few values

Superposition has a powerful consequence: if you know what $T$ does to a few vectors, you
know what it does to every combination of them.

### Example 2

$T: \mathbb{R}^2 \to \mathbb{R}^2$ is linear, with $T(\mathbf{e}_1) = \begin{bmatrix} 2 \\ 1\end{bmatrix}$ and $T(\mathbf{e}_2) = \begin{bmatrix} -1 \\ 3\end{bmatrix}$. Find $T\left(\begin{bmatrix} 3 \\ -2\end{bmatrix}\right)$.

1. Write the input as a combination of $\mathbf{e}_1, \mathbf{e}_2$: $\begin{bmatrix} 3 \\ -2\end{bmatrix} = 3\mathbf{e}_1 - 2\mathbf{e}_2$.
2. Apply linearity: $T(3\mathbf{e}_1 - 2\mathbf{e}_2) = 3T(\mathbf{e}_1) - 2T(\mathbf{e}_2)$.
3. Compute: $3\begin{bmatrix} 2 \\ 1\end{bmatrix} - 2\begin{bmatrix} -1 \\ 3\end{bmatrix} = \begin{bmatrix} 8 \\ -3\end{bmatrix}$.

```plot
{"x": [-2, 9], "y": [-4, 4], "equal": true, "segments": [{"from": [0, 0], "to": [2, 1], "arrow": true, "label": "T(e₁)"}, {"from": [0, 0], "to": [-1, 3], "arrow": true, "label": "T(e₂)"}, {"from": [0, 0], "to": [8, -3], "arrow": true, "label": "T(3, -2)"}], "caption": "T(3e₁ - 2e₂) = 3T(e₁) - 2T(e₂)"}
```

We never needed a formula for $T$: the images of $\mathbf{e}_1$ and $\mathbf{e}_2$ were
enough. The next lesson turns this observation into a theorem.

## Common mistakes

- *Mixing up domain and codomain sizes.* For a $3 \times 2$ matrix, $\mathbf{x} \mapsto A\mathbf{x}$ goes from $\mathbb{R}^2$ to $\mathbb{R}^3$: inputs match columns, outputs match rows.
- *Confusing range with codomain.* The codomain is where outputs are allowed to live; the range is where they actually land.
- *Assuming "linear" means "graph is a line".* $T(x) = 3x + 2$ has a straight-line graph but is not a linear transformation, since $T(0) = 2$.
- *Using $T(\mathbf{0}) = \mathbf{0}$ as proof of linearity.* It's necessary, not sufficient; $(x_1, x_2) \mapsto (x_1^2, x_2)$ fixes $\mathbf{0}$ but isn't linear.

## Key points

- $T: \mathbb{R}^n \to \mathbb{R}^m$ has domain $\mathbb{R}^n$, codomain $\mathbb{R}^m$; the range is the set of all images.
- $\mathbf{x} \mapsto A\mathbf{x}$ for $m \times n$ $A$ maps $\mathbb{R}^n \to \mathbb{R}^m$, and its range is the span of the columns of $A$.
- Linear means $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$ and $T(c\mathbf{u}) = cT(\mathbf{u})$; then $T(\mathbf{0}) = \mathbf{0}$ and $T$ preserves linear combinations.
- Every matrix transformation is linear; translations by a nonzero vector are not.
- Knowing $T(\mathbf{e}_1), \dots, T(\mathbf{e}_n)$ determines a linear $T$ completely.
