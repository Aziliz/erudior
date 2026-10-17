---
id: pc-ref-matrices-series
title: Matrices, sequences, counting and limits
---
## Systems and matrices

| Idea | Rule |
|---|---|
| Row operations | swap rows; multiply a row by $k \ne 0$; add a multiple of one row to another |
| No solution | a row $[0 \cdots 0 \mid c]$ with $c \ne 0$ |
| Infinitely many | fewer pivots than variables (free variables), no contradiction |
| Product size | $(m \times n)(n \times p) = m \times p$ |
| Product entry | $(AB)_{ij}$ = row $i$ of $A$ · column $j$ of $B$ |
| Identity | $AI = IA = A$ |
| $2 \times 2$ determinant | $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$ |
| $2 \times 2$ inverse | $\dfrac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$ |
| General inverse | row-reduce $[A \mid I] \to [I \mid A^{-1}]$ |
| Solve $AX = B$ | $X = A^{-1}B$ |
| Cramer's rule | $x_i = \dfrac{D_i}{D}$ ($D_i$: column $i$ replaced by constants) |
| Triangle area | $\tfrac12\left\lvert\det\begin{bmatrix} x_1 & y_1 & 1 \\ x_2 & y_2 & 1 \\ x_3 & y_3 & 1\end{bmatrix}\right\rvert$ |

## Partial fractions

| Factor | Terms |
|---|---|
| $(x - a)$ | $\dfrac{A}{x - a}$ |
| $(x - a)^k$ | $\dfrac{A_1}{x - a} + \dots + \dfrac{A_k}{(x - a)^k}$ |
| irreducible $x^2 + bx + c$ | $\dfrac{Bx + C}{x^2 + bx + c}$ |
| $(x^2 + bx + c)^k$, irreducible | $\dfrac{B_1x + C_1}{x^2 + bx + c} + \dots + \dfrac{B_kx + C_k}{(x^2 + bx + c)^k}$ |

## Sequences and series

| Type | $n$th term | Sum |
|---|---|---|
| Arithmetic | $a_n = a_1 + (n - 1)d$ | $S_n = \dfrac{n(a_1 + a_n)}{2}$ |
| Geometric | $a_n = a_1 r^{n - 1}$ | $S_n = a_1\dfrac{1 - r^n}{1 - r}$ |
| Infinite geometric | ($\lvert r \rvert < 1$) | $S = \dfrac{a_1}{1 - r}$ |

| Sum | Formula |
|---|---|
| $\sum_{k=1}^n k$ | $\dfrac{n(n+1)}{2}$ |
| $\sum_{k=1}^n k^2$ | $\dfrac{n(n+1)(2n+1)}{6}$ |
| $\sum_{k=1}^n k^3$ | $\left(\dfrac{n(n+1)}{2}\right)^2$ |

## Counting, binomial theorem, probability

| Idea | Formula |
|---|---|
| Permutations | $_nP_r = \dfrac{n!}{(n - r)!}$ (order matters) |
| Combinations | $_nC_r = \dbinom{n}{r} = \dfrac{n!}{r!(n - r)!}$ (order doesn't) |
| Binomial theorem | $(a + b)^n = \sum_{k=0}^{n}\dbinom{n}{k}a^{n-k}b^k$ |
| Complement | $P(\text{not } A) = 1 - P(A)$ |
| Addition rule | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| Independent events | $P(A \cap B) = P(A)P(B)$ |

## Limits and the derivative

| Idea | Statement |
|---|---|
| Limit exists | $\lim_{x\to a^-}f(x) = \lim_{x\to a^+}f(x)$ |
| Continuity at $a$ | $\lim_{x\to a}f(x) = f(a)$ |
| $\tfrac00$ forms | factor and cancel, or rationalize |
| Rational at $\infty$ | compare degrees (same as horizontal asymptotes) |
| Derivative | $f'(a) = \lim\limits_{h\to 0}\dfrac{f(a + h) - f(a)}{h}$ |
| Tangent line | $y = f(a) + f'(a)(x - a)$ |
