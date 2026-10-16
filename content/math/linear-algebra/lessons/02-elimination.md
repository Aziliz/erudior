---
id: la-elimination
module: la-m1
title: Solving systems by elimination
minutes: 25
topics: [Elimination]
drills: [la-sys2, la-sys3]
---
## Why elimination

The problem that launched linear algebra is solving several equations in several
unknowns at once. In algebra class you probably met two methods: substitution and
elimination. Substitution is fine for two equations, but it gets messy fast. Elimination
scales up: it is the method computers use for systems with millions of unknowns, and the
row reduction you'll learn in the next module is just elimination written neatly. This
lesson makes sure the hand technique is solid.

## Linear equations and solutions

A **linear equation** in the variables $x_1, \dots, x_n$ has the form

$$a_1x_1 + a_2x_2 + \cdots + a_nx_n = b,$$

where the coefficients $a_i$ and the right side $b$ are numbers. No products of
variables, no powers, no $\sqrt{x}$ or $\sin x$: $3x - 2y = 5$ is linear;
$xy = 4$ and $x^2 + y = 1$ are not. A **solution** of a system of equations is a list
of values that makes *every* equation true at once.

With two unknowns each equation is a line, and solving means finding where the lines
meet. Two lines can meet once, never (parallel), or everywhere (the same line). Those are
the only possibilities, and the same three cases hold for every linear system of any
size.

```plot
{"x": [-2, 8], "y": [-7, 5], "equal": true, "functions": [{"f": "(7 - 3x)/2", "label": "3x + 2y = 7"}, {"f": "(5x - 41)/4", "label": "5x - 4y = 41"}], "points": [{"at": [5, -4], "label": "(5, -4)"}], "caption": "One solution: the lines cross at (5, -4)"}
```

## The elimination method

Three moves never change the solutions of a system:

1. multiply an equation by a nonzero number;
2. add a multiple of one equation to another;
3. swap two equations.

Why they're safe: each move can be undone by another move of the same kind (divide by the
number, subtract the multiple, swap back). So anything that solves the old system solves
the new one, and vice versa. The **elimination method** uses these moves to knock
variables out until each equation has one unknown left.

### Example 1

Solve $3x + 2y = 7$ and $5x - 4y = 41$.

1. Choose a variable to eliminate. The $y$ coefficients are $2$ and $-4$; doubling the first
   equation makes them opposites: $6x + 4y = 14$.
2. Add to the second equation: $(6x + 4y) + (5x - 4y) = 14 + 41$, so $11x = 55$ and $x = 5$.
3. Substitute back into the first equation: $3(5) + 2y = 7$, so $2y = -8$ and $y = -4$.
4. Check in the *other* equation: $5(5) - 4(-4) = 25 + 16 = 41$. ✓

## Three equations, three unknowns

With three unknowns, each equation describes a plane in space, and the idea is the same
but organized:

- Use the first equation to eliminate $x$ from the second and third.
- Use the new second equation to eliminate $y$ from the new third.
- The third equation now has only $z$. Solve it, then work upward. Plugging known values
  into earlier equations is called **back-substitution**.

The result is a "triangular" system, and that shape is exactly what the next module calls
echelon form.

### Example 2

Solve
$$\begin{aligned} x + y + z &= 6 \\ 2x - y + z &= 3 \\ x + 2y - z &= 2 \end{aligned}$$

1. Eliminate $x$ from equation 2: subtract 2 times equation 1. $(2x - y + z) - 2(x + y + z) = 3 - 12$ gives $-3y - z = -9$.
2. Eliminate $x$ from equation 3: subtract equation 1. $(x + 2y - z) - (x + y + z) = 2 - 6$ gives $y - 2z = -4$.
3. Now two equations in $y, z$. Swap them so the simpler one is on top: $y - 2z = -4$ and $-3y - z = -9$.
4. Eliminate $y$: add 3 times the first to the second. $-3y - z + 3y - 6z = -9 - 12$, so $-7z = -21$ and $z = 3$.
5. Back-substitute: $y - 2(3) = -4$ gives $y = 2$. Then $x + 2 + 3 = 6$ gives $x = 1$.
6. Check all three: $1 + 2 + 3 = 6$, $2 - 2 + 3 = 3$, $1 + 4 - 3 = 2$. ✓

The solution is $(x, y, z) = (1, 2, 3)$.

## When it doesn't work out

Elimination also *tells you* when there is no unique answer.

- Solve $x + 2y = 4$ and $2x + 4y = 9$. Subtract twice the first from the second:
  $0 = 1$. That's impossible, so there is no solution: the lines are parallel. A
  system with no solution is called **inconsistent**.
- Solve $x + 2y = 4$ and $2x + 4y = 8$. Now the subtraction gives $0 = 0$, which is always
  true. The second equation added nothing; every point on the line $x + 2y = 4$ is a
  solution, so there are infinitely many. Write them as $x = 4 - 2t$, $y = t$ for any
  number $t$.

A system with at least one solution is called **consistent**. So a linear system is either
inconsistent, consistent with exactly one solution, or consistent with infinitely many.
You can never get exactly two solutions: if two points solve a linear system, so does
every point on the line through them.

## Common mistakes

- *Multiplying only one side*, or only some terms: doubling $3x + 2y = 7$ must double the 7 too.
- *Sign slips when subtracting* an equation: subtract *every* term, including the right side.
  Many people prefer to add $-2$ times an equation rather than subtract 2 times it.
- *Stopping at $0 = 0$* and declaring "no solution". $0 = 0$ means a redundant equation (infinitely
  many solutions, if nothing else is contradictory); $0 = 1$ means no solution.
- *Not checking.* Plug the answer into every original equation; it takes seconds.

## Key points

- Scaling an equation, adding a multiple of one equation to another, and swapping equations don't change the solution set.
- Eliminate one variable at a time to reach a triangular system, then back-substitute.
- A contradiction like $0 = 1$ means inconsistent (no solution); an identity $0 = 0$ signals a redundant equation.
- Every linear system has no solution, exactly one, or infinitely many.
