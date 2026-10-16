---
id: mv-extrema
module: mv-m4
title: Local extrema and the second-derivative test
minutes: 40
topics: [Critical points, Second-derivative test]
drills: [mv-d-crit-pt, mv-d-second-test]
refs: [mv-ref-differential]
---
## Finding peaks and valleys

In single-variable calculus you found maxima and minima by setting $f'(x) = 0$ and then
checking the sign of $f''$. The same plan works for $f(x, y)$, with two differences: the
"derivative equals zero" condition becomes a *system* of equations, and a new kind of
critical point appears, the saddle, which is a maximum in one direction and a minimum in
another. This lesson develops the test that tells them apart. Optimization is where
multivariable calculus pays its way in economics, engineering and data fitting.

## Local extrema and critical points

$f$ has a **local maximum** at $(a, b)$ if $f(x, y) \le f(a, b)$ for all $(x, y)$ near
$(a, b)$, and a **local minimum** if $f(x, y) \ge f(a, b)$ nearby.

**Theorem.** If $f$ has a local extremum at $(a, b)$ and its first partial derivatives exist
there, then $f_x(a, b) = 0$ and $f_y(a, b) = 0$, that is, $\nabla f(a, b) = \mathbf 0$.

*Why.* If $f$ has a local max at $(a, b)$, then the one-variable function $g(x) = f(x, b)$
has a local max at $x = a$, so $g'(a) = f_x(a, b) = 0$. The same argument with
$h(y) = f(a, y)$ gives $f_y(a, b) = 0$. Geometrically: at a smooth peak or valley the
tangent plane is horizontal.

A **critical point** is a point where $\nabla f = \mathbf 0$ or where a partial derivative
fails to exist. Every local extremum is at a critical point, but not every critical point
is an extremum.

## Saddle points

Consider $f(x, y) = y^2 - x^2$. At the origin $\nabla f = \langle -2x, 2y\rangle = \mathbf 0$,
but along the $x$-axis $f = -x^2$ has a max at 0, while along the $y$-axis $f = y^2$ has a
min. A critical point where $f$ takes both larger and smaller values arbitrarily close by
is a **saddle point**. On a contour map, a saddle looks like crossing level curves, or
hyperbolas facing each other, with high ground on two opposite sides and low ground on
the other two.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "functions": [{"f": "sqrt(x^2+1)", "label": "c = 1"}, {"f": "-sqrt(x^2+1)"}, {"f": "sqrt(x^2+4)", "label": "c = 4"}, {"f": "-sqrt(x^2+4)"}, {"f": "x", "dashed": true, "label": "c = 0"}, {"f": "-x", "dashed": true}], "curves": [{"x": "sqrt(t^2+1)", "y": "t", "t": [-3, 3], "label": "c = −1"}, {"x": "-sqrt(t^2+1)", "y": "t", "t": [-3, 3]}, {"x": "sqrt(t^2+4)", "y": "t", "t": [-3, 3], "label": "c = −4"}, {"x": "-sqrt(t^2+4)", "y": "t", "t": [-3, 3]}], "points": [{"at": [0, 0], "label": "saddle"}], "caption": "Contour map of f = y² − x²: high to the north and south, low to the east and west"}
```

## The second-derivative test

Near a critical point, $f$ is approximated by its second-degree Taylor polynomial, a
quadratic $\tfrac12\left(f_{xx}h^2 + 2f_{xy}hk + f_{yy}k^2\right)$ in the displacements
$h, k$. Completing the square in that quadratic shows its shape is controlled by the
**discriminant**

$$D = f_{xx}f_{yy} - (f_{xy})^2,$$

evaluated at the critical point. (It is the determinant of the matrix of second partials,
the **Hessian**.)

**Second-derivative test.** Suppose the second partials are continuous near $(a, b)$ and
$\nabla f(a, b) = \mathbf 0$. Let $D = D(a, b)$.

| Condition | Conclusion |
|---|---|
| $D > 0$ and $f_{xx}(a,b) > 0$ | local minimum |
| $D > 0$ and $f_{xx}(a,b) < 0$ | local maximum |
| $D < 0$ | saddle point |
| $D = 0$ | test is inconclusive |

Intuition: $D > 0$ means the surface curves the same way in every direction (a bowl or a
dome), and then $f_{xx}$ tells which way. $D < 0$ means it curves up in some directions and
down in others. For $y^2 - x^2$: $f_{xx} = -2$, $f_{yy} = 2$, $f_{xy} = 0$, so $D = -4 < 0$, a
saddle.

### Example 1

Find and classify the critical points of $f(x, y) = x^4 + y^4 - 4xy + 1$.

1. $f_x = 4x^3 - 4y = 0$ and $f_y = 4y^3 - 4x = 0$ give $y = x^3$ and $x = y^3$.
2. Substitute: $x = x^9$, so $x(x^8 - 1) = 0$, giving $x = 0, 1, -1$ and correspondingly $y = 0, 1, -1$.
3. Second partials: $f_{xx} = 12x^2$, $f_{yy} = 12y^2$, $f_{xy} = -4$, so $D = 144x^2y^2 - 16$.
4. At $(0, 0)$: $D = -16 < 0$, a saddle.
5. At $(1, 1)$ and $(-1, -1)$: $D = 128 > 0$ and $f_{xx} = 12 > 0$: local minima, with value $1 + 1 - 4 + 1 = -1$.

### Example 2

Classify the critical points of $f(x, y) = x^3 - 3x + y^2 - 4y$.

1. $f_x = 3x^2 - 3 = 0$ gives $x = \pm1$; $f_y = 2y - 4 = 0$ gives $y = 2$.
2. $f_{xx} = 6x$, $f_{yy} = 2$, $f_{xy} = 0$, so $D = 12x$.
3. $(1, 2)$: $D = 12 > 0$, $f_{xx} = 6 > 0$: local minimum, $f = 1 - 3 + 4 - 8 = -6$.
4. $(-1, 2)$: $D = -12 < 0$: saddle point.

### When the test fails

If $D = 0$, examine $f$ directly. For example, $f = x^4 + y^4$ and $g = x^4 - y^4$ both have
$D = 0$ at the origin; $f$ has a minimum there (it is never negative), while $g$ has a
saddle.

## An applied problem

### Example 3: the cheapest box

An open-top box must hold $32\text{ m}^3$. Find the dimensions that use the least
material.

1. With base $x \times y$ and height $z$: $xyz = 32$, and the surface area is $S = xy + 2xz + 2yz$.
2. Eliminate $z = 32/(xy)$: $S(x, y) = xy + \dfrac{64}{y} + \dfrac{64}{x}$.
3. $S_x = y - \dfrac{64}{x^2} = 0$ and $S_y = x - \dfrac{64}{y^2} = 0$. Then $x^2y = 64 = xy^2$, so $x = y$, and $x^3 = 64$: $x = y = 4$, $z = 2$.
4. Check: $S_{xx} = 128/x^3 = 2$, $S_{yy} = 2$, $S_{xy} = 1$, $D = 3 > 0$ with $S_{xx} > 0$: a minimum. $S = 16 + 16 + 16 = 48\text{ m}^2$.

## Common mistakes

- Solving only $f_x = 0$, or losing solutions when dividing equations (keep track of factors like $x = 0$).
- Using $D = f_{xx}f_{yy} + f_{xy}^2$; the mixed term is subtracted.
- Calling $D < 0$ a maximum; it is a saddle regardless of $f_{xx}$.
- Concluding "no extremum" when $D = 0$; the test simply gives no information.

## Key points

- Local extrema occur at critical points, where $\nabla f = \mathbf 0$ (or a partial does not exist).
- $D = f_{xx}f_{yy} - f_{xy}^2$: $D > 0$ with $f_{xx} > 0$ min, with $f_{xx} < 0$ max; $D < 0$ saddle; $D = 0$ inconclusive.
- A saddle point is a critical point that is neither a max nor a min.
