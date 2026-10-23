---
id: a2-m2-h-cramer
module: a2-m2
title: Determinants and Cramer's rule
minutes: 45
honors: true
topics: [Determinants and Cramer's rule]
drills: [a2-m2-r2-cramer2, a2-m2-r2-det3, a2-m2-r2-triangle-area]
refs: [alg-ref-equations]
---
In the matrices lesson the determinant $ad - bc$ of a $2 \times 2$ matrix appeared as the number you divide by in the inverse formula, with the warning that when it is 0 there is no inverse. This lesson explains where that number comes from and what it measures. You'll derive a formula, Cramer's rule, that solves a whole system with determinants alone; see that a determinant measures area; extend determinants to $3 \times 3$ matrices; and use them to find the area of a triangle from its vertices. You'll also see why, for big systems, row reduction still wins.

## Where the determinant comes from

Solve the general system

$$\begin{cases} ax + by = e \\ cx + dy = f \end{cases}$$

by elimination. Multiply the first equation by $d$ and the second by $b$, then subtract: the $y$-terms cancel and

$$(ad - bc)\,x = ed - bf.$$

Multiplying the first by $c$ and the second by $a$ and subtracting the first from the second eliminates $x$ instead:

$$(ad - bc)\,y = af - ce.$$

The same number, $ad - bc$, multiplies both unknowns. If it isn't 0, divide by it and the system has exactly one solution. If it is 0, the left sides vanish, and the system has either no solution or infinitely many. That number is the determinant of the coefficient matrix, written with straight bars:

$$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc.$$

## Cramer's rule for two equations

Look at the right sides above. The number $ed - bf$ is also a determinant: the coefficient matrix with its *first* column (the $x$-column) replaced by the constants $e, f$. Likewise $af - ce$ is the determinant with the second column replaced. Naming the three determinants

$$D = \begin{vmatrix} a & b \\ c & d \end{vmatrix}, \qquad D_x = \begin{vmatrix} e & b \\ f & d \end{vmatrix}, \qquad D_y = \begin{vmatrix} a & e \\ c & f \end{vmatrix},$$

the solution is

$$x = \frac{D_x}{D}, \qquad y = \frac{D_y}{D} \qquad (D \ne 0).$$

This is **Cramer's rule**. To find a variable, replace that variable's column by the constants, take the determinant, and divide by $D$.

### Example 1

Solve $3x + 2y = 7$, $5x - 4y = 8$ by Cramer's rule.

1. $D = \begin{vmatrix} 3 & 2 \\ 5 & -4 \end{vmatrix} = 3(-4) - 2(5) = -22$. It isn't 0, so there is exactly one solution.
2. $D_x = \begin{vmatrix} 7 & 2 \\ 8 & -4 \end{vmatrix} = -28 - 16 = -44$, so $x = \dfrac{-44}{-22} = 2$.
3. $D_y = \begin{vmatrix} 3 & 7 \\ 5 & 8 \end{vmatrix} = 24 - 35 = -11$, so $y = \dfrac{-11}{-22} = \dfrac12$.
4. Check: $3(2) + 2\left(\tfrac12\right) = 7$ and $5(2) - 4\left(\tfrac12\right) = 8$. ✓

Cramer's rule handles fractional answers without any fractions along the way, which is one reason it's handy for $2 \times 2$ systems.

## What a determinant measures

Draw the columns of $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$ as arrows from the origin, to $(a, c)$ and to $(b, d)$. They span a parallelogram, and

$$\text{area of the parallelogram} = |ad - bc|.$$

```plot
{"x": [-1, 5], "y": [-1, 4], "equal": true, "polygons": [{"points": [[0, 0], [3, 1], [4, 3], [1, 2]]}], "segments": [{"from": [0, 0], "to": [3, 1], "arrow": true, "label": "(3, 1)"}, {"from": [0, 0], "to": [1, 2], "arrow": true, "label": "(1, 2)"}], "labels": [{"at": [2, 1.5], "text": "area 5"}], "caption": "The columns (3, 1) and (1, 2) of a matrix with determinant 3·2 − 1·1 = 5 span a parallelogram of area 5"}
```

Here is why, for arrows arranged as in the picture (both in the first quadrant, with $(a, c)$ below $(b, d)$). The parallelogram sits inside a rectangle $a + b$ wide and $c + d$ tall, with area $(a + b)(c + d) = ac + ad + bc + bd$. Cutting the parallelogram out leaves two triangles with legs $a$ and $c$ (total area $ac$), two triangles with legs $b$ and $d$ (total area $bd$), and two small $b$-by-$c$ rectangles in opposite corners (total area $2bc$). Subtracting,

$$ac + ad + bc + bd - ac - bd - 2bc = ad - bc.$$

The sign of $ad - bc$ records orientation (whether turning from the first column to the second is counterclockwise, positive, or clockwise, negative), which is why the area is the absolute value.

This picture explains the zero case. $D = 0$ means the parallelogram is flat: the two columns lie on one line through the origin, one a multiple of the other. Then the rows are multiples too, so the two equations describe parallel lines (no solution) or the same line (infinitely many).

## Determinants of 3 × 3 matrices

For a $3 \times 3$ matrix, the determinant is built from $2 \times 2$ ones. The **minor** of an entry is the determinant left after crossing out that entry's row and column. The **cofactor** is the minor with a sign from the checkerboard pattern

$$\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}.$$

**Cofactor expansion** along the first row: multiply each entry of row 1 by its cofactor and add.

$$\begin{vmatrix} a_1 & b_1 & c_1 \\ a_2 & b_2 & c_2 \\ a_3 & b_3 & c_3 \end{vmatrix} = a_1\begin{vmatrix} b_2 & c_2 \\ b_3 & c_3 \end{vmatrix} - b_1\begin{vmatrix} a_2 & c_2 \\ a_3 & c_3 \end{vmatrix} + c_1\begin{vmatrix} a_2 & b_2 \\ a_3 & b_3 \end{vmatrix}.$$

You can expand along any row or column (using the checkerboard signs) and get the same value, so a row or column with zeros saves work. For $3 \times 3$ matrices only, there is also a diagonal shortcut, the **rule of Sarrus**: copy the first two columns to the right, add the three products down to the right, and subtract the three products up to the right. It does not extend to $4 \times 4$.

As in two dimensions, a $3 \times 3$ determinant measures size: its absolute value is the volume of the slanted box (parallelepiped) spanned by the three columns. A $3 \times 3$ matrix is invertible exactly when its determinant isn't 0.

### Example 2

Evaluate $\begin{vmatrix} 2 & 1 & -1 \\ 1 & 3 & 2 \\ 0 & -1 & 4 \end{vmatrix}$.

1. Entry 2: minor $\begin{vmatrix} 3 & 2 \\ -1 & 4 \end{vmatrix} = 12 + 2 = 14$, sign $+$: $2(14) = 28$.
2. Entry 1: minor $\begin{vmatrix} 1 & 2 \\ 0 & 4 \end{vmatrix} = 4$, sign $-$: $-1(4) = -4$.
3. Entry $-1$: minor $\begin{vmatrix} 1 & 3 \\ 0 & -1 \end{vmatrix} = -1$, sign $+$: $(-1)(-1) = 1$.
4. Total: $28 - 4 + 1 = 25$.

Check by expanding down column 1 instead, where the 0 saves a term: $2(14) - 1\begin{vmatrix} 1 & -1 \\ -1 & 4 \end{vmatrix} + 0 = 28 - 1(4 - 1) = 25$. ✓

## Cramer's rule for three equations

The rule extends word for word: $x = \dfrac{D_x}{D}$, $y = \dfrac{D_y}{D}$, $z = \dfrac{D_z}{D}$, where $D$ is the determinant of the coefficient matrix and $D_x$, $D_y$, $D_z$ replace the $x$-, $y$- or $z$-column with the constants.

### Example 3

Solve the system from the three-variable lesson: $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$.

1. $D = \begin{vmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 2 & -1 \end{vmatrix} = 1(1 - 2) - 1(-2 - 1) + 1(4 + 1) = -1 + 3 + 5 = 7$.
2. $D_x = \begin{vmatrix} 6 & 1 & 1 \\ 3 & -1 & 1 \\ 2 & 2 & -1 \end{vmatrix} = 6(1 - 2) - 1(-3 - 2) + 1(6 + 2) = -6 + 5 + 8 = 7$, so $x = 1$.
3. $D_y = \begin{vmatrix} 1 & 6 & 1 \\ 2 & 3 & 1 \\ 1 & 2 & -1 \end{vmatrix} = 1(-3 - 2) - 6(-2 - 1) + 1(4 - 3) = -5 + 18 + 1 = 14$, so $y = 2$.
4. $D_z = \begin{vmatrix} 1 & 1 & 6 \\ 2 & -1 & 3 \\ 1 & 2 & 2 \end{vmatrix} = 1(-2 - 6) - 1(4 - 3) + 6(4 + 1) = -8 - 1 + 30 = 21$, so $z = 3$.

The solution $(1, 2, 3)$ matches the one found by elimination and by row reduction.

## Area of a triangle from its vertices

A triangle is half a parallelogram, so its area is half a determinant. For vertices $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$:

$$\text{Area} = \frac12\left|\begin{vmatrix} x_1 & y_1 & 1 \\ x_2 & y_2 & 1 \\ x_3 & y_3 & 1 \end{vmatrix}\right|.$$

If the determinant is 0 the "triangle" is flat: the three points are **collinear** (on one line).

### Example 4

Find the area of the triangle with vertices $(1, 1)$, $(5, 2)$ and $(2, 6)$.

1. $\begin{vmatrix} 1 & 1 & 1 \\ 5 & 2 & 1 \\ 2 & 6 & 1 \end{vmatrix} = 1(2 - 6) - 1(5 - 2) + 1(30 - 4) = -4 - 3 + 26 = 19$.
2. Area $= \tfrac12|19| = 9.5$ square units.

And $(1, 2)$, $(3, 6)$, $(4, 8)$ give $1(6 - 8) - 2(3 - 4) + 1(24 - 24) = 0$: they are collinear, all on $y = 2x$.

## When to use Cramer's rule

Cramer's rule is a formula, which makes it excellent for small systems, for systems with letters as coefficients, and for proving things (for instance, it shows at once that the solution changes smoothly as the coefficients change). It is a poor way to solve big systems. Computing an $n \times n$ determinant by cofactor expansion takes on the order of $n!$ multiplications: $10! = 3{,}628{,}800$, and $20!$ is about $2.4 \times 10^{18}$. Row reduction takes roughly $\tfrac13 n^3$ multiplications, about 2,700 for $n = 20$. Computers solve large systems by elimination, not by Cramer's rule. (Determinants can also be computed by row reduction, which is how software does it.)

A little history: Gabriel Cramer published the general rule in 1750, and it carries his name, but Colin Maclaurin's *Treatise of Algebra* (published in 1748, after his death) already gave it for two and three unknowns. Determinant-like calculations appear even earlier, in work by Seki Takakazu in Japan (1683) and by Gottfried Leibniz (1693).

## Common mistakes

- Replacing the wrong column: for $D_x$, the constants go in the $x$-column, not the row.
- Forgetting the alternating signs in a cofactor expansion (the middle term of row 1 is subtracted).
- Using the rule of Sarrus on a $4 \times 4$ matrix. It works only for $3 \times 3$.
- Dividing by $D$ when $D = 0$. Then Cramer's rule says nothing; use row reduction to tell "no solution" from "infinitely many".
- Forgetting the $\tfrac12$ or the absolute value in the triangle-area formula.

## Key points

- $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$ appears when you eliminate a variable from a $2 \times 2$ system.
- Cramer's rule: $x = D_x/D$, $y = D_y/D$ (and $z = D_z/D$), where $D_x$ replaces the $x$-column by the constants; it needs $D \ne 0$.
- $|ad - bc|$ is the area of the parallelogram spanned by the columns; $D = 0$ means the columns are parallel.
- A $3 \times 3$ determinant is a cofactor expansion along any row or column, with checkerboard signs.
- Triangle area is $\tfrac12\lvert\det\rvert$ of the matrix with rows $(x_k, y_k, 1)$; a zero determinant means collinear points.
- Cramer's rule suits small or symbolic systems; elimination is far faster for large ones.
