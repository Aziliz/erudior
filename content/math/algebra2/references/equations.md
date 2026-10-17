---
id: alg-ref-equations
title: Equations, inequalities, lines, systems and matrices
---
## Properties of real numbers

| Property | Addition | Multiplication |
|---|---|---|
| Commutative | $a + b = b + a$ | $ab = ba$ |
| Associative | $(a + b) + c = a + (b + c)$ | $(ab)c = a(bc)$ |
| Identity | $a + 0 = a$ | $a \cdot 1 = a$ |
| Inverse | $a + (-a) = 0$ | $a \cdot \tfrac1a = 1$ ($a \ne 0$) |
| Distributive | $a(b + c) = ab + ac$ | |

Order of operations: grouping, exponents, multiplication/division (left to right), addition/subtraction (left to right).

## Solving

| Type | Method |
|---|---|
| Linear equation | clear fractions, simplify, collect variable terms, isolate, check |
| Literal equation | treat other letters as numbers; if the variable appears twice, collect and factor |
| Linear inequality | as an equation, but flip the symbol when multiplying or dividing by a negative |
| $\lvert u \rvert = k$ ($k > 0$) | $u = k$ or $u = -k$ |
| $\lvert u \rvert < k$ | $-k < u < k$ |
| $\lvert u \rvert > k$ | $u < -k$ or $u > k$ |

Variable vanishes: false statement means no solution; true statement means all real numbers.

## Interval notation

| Inequality | Interval |
|---|---|
| $a < x < b$ | $(a, b)$ |
| $a \le x \le b$ | $[a, b]$ |
| $x > a$ | $(a, \infty)$ |
| $x \le b$ | $(-\infty, b]$ |

## Lines

| Form | Equation | Notes |
|---|---|---|
| Slope | $m = \dfrac{y_2 - y_1}{x_2 - x_1}$ | horizontal: $m = 0$; vertical: undefined |
| Slope-intercept | $y = mx + b$ | $y$-intercept $(0, b)$ |
| Point-slope | $y - y_1 = m(x - x_1)$ | |
| Standard | $Ax + By = C$ | slope $-\tfrac AB$ |
| Horizontal / vertical | $y = b$ / $x = a$ | |
| Parallel | $m_1 = m_2$ | different intercepts |
| Perpendicular | $m_1m_2 = -1$ | $m_2 = -\tfrac{1}{m_1}$ (neither line vertical) |

## Systems

| Outcome | Graph | Algebra |
|---|---|---|
| one solution | lines cross | values for each variable |
| no solution | parallel lines | false statement, e.g. $0 = 5$ |
| infinitely many | same line | true statement, e.g. $0 = 0$ |

Three variables: eliminate the same variable from two different pairs of equations, solve the $2 \times 2$ system, back-substitute.

## Nonlinear systems

| Method | When | Notes |
|---|---|---|
| Substitution | one equation is linear | solve it for a variable, substitute, solve the quadratic; partners from the linear equation |
| Elimination | only $x^2$ and $y^2$ terms | add or subtract, then take $\pm$ square roots (up to 4 solutions) |
| Discriminant of the substituted quadratic | counting intersections | $> 0$: two; $= 0$: one (tangent); $< 0$: none |

Circle: $x^2 + y^2 = r^2$ (center origin), $(x - h)^2 + (y - k)^2 = r^2$ (center $(h, k)$).

## Matrices

| Idea | Statement |
|---|---|
| Augmented matrix | rows = equations, columns = variables (0 if missing), constants after the bar |
| Row operations | $R_i \leftrightarrow R_j$; $cR_i \to R_i$ ($c \ne 0$); $R_i + cR_j \to R_i$ |
| Row echelon form | leading 1s in a staircase, zeros below; back-substitute |
| RREF | zeros above and below each leading 1; read off the solution |
| $[\,0 \;\cdots\; 0 \mid c\,]$, $c \ne 0$ | no solution |
| Determinant ($2 \times 2$) | $\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc$ |
| Inverse ($2 \times 2$) | $\dfrac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$, if $ad - bc \ne 0$ |
| Matrix equation | $AX = B \Rightarrow X = A^{-1}B$ |

Linear programming: the maximum or minimum of a linear objective on a polygonal feasible region occurs at a vertex.

## Useful formulas

| Formula | Meaning |
|---|---|
| $d = rt$ | distance = rate × time |
| $I = Prt$ | simple interest |
| $\dfrac{\text{new} - \text{old}}{\text{old}} \times 100\%$ | percent change |
| $P = 2l + 2w$, $A = lw$ | rectangle |
