---
id: pc-hyperbolas
module: pc-m7
title: Hyperbolas and identifying conics
minutes: 35
topics: [Hyperbolas, Identifying conics]
drills: [pc-hyperbola-foci, pc-conic-discriminant]
refs: [pc-ref-conics-polar]
---
## The open conic with two branches

An ellipse keeps the *sum* of distances to two foci constant. Keep the *difference* constant instead, and you get a hyperbola: two separate branches that open away from each other and approach a pair of crossing lines. Hyperbolas describe the paths of objects that fly past a planet too fast to be captured, the shape of cooling towers, and the curves of constant time difference used by older radio navigation systems. This lesson develops the hyperbola and then shows how to recognize any conic from its general equation, including a brief look at rotated conics.

## Definition and standard equation

A **hyperbola** is the set of points whose distances to two foci differ (in absolute value) by a constant $2a$. With foci $(\pm c, 0)$, the same algebra as for the ellipse gives

$$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1, \qquad \text{where } c^2 = a^2 + b^2.$$

Now $c > a$: the foci are farther from the center than the vertices $(\pm a, 0)$. The segment between the vertices is the **transverse axis**. Unlike the ellipse, $a$ need not be larger than $b$; the *positive* term decides the direction.

## Asymptotes

Solve for $y$: $y = \pm\frac{b}{a}\sqrt{x^2 - a^2}$. For large $|x|$, $\sqrt{x^2 - a^2} \approx |x|$, so the branches approach the lines

$$y = \pm\frac{b}{a}x.$$

A sketching trick: draw the **central rectangle** with sides $2a$ (along the transverse axis) and $2b$, centered at the center. Its diagonals extended are the asymptotes. Then draw each branch from a vertex, bending toward the asymptotes.

### Example 1

Analyze $\dfrac{x^2}{16} - \dfrac{y^2}{9} = 1$.

The $x^2$ term is positive, so the hyperbola opens left and right. $a = 4$, $b = 3$, $c = \sqrt{16 + 9} = 5$. Vertices $(\pm4, 0)$, foci $(\pm5, 0)$, asymptotes $y = \pm\frac34x$.

```plot
{"x": [-10, 10], "y": [-7.5, 7.5], "equal": true, "curves": [{"x": "4cosh(t)", "y": "3sinh(t)", "t": [-2, 2]}, {"x": "-4cosh(t)", "y": "3sinh(t)", "t": [-2, 2]}], "functions": [{"f": "0.75x", "dashed": true}, {"f": "-0.75x", "dashed": true}], "polygons": [{"points": [[-4, -3], [4, -3], [4, 3], [-4, 3]]}], "points": [{"at": [4, 0], "label": "(4, 0)"}, {"at": [-4, 0]}, {"at": [5, 0], "label": "focus"}, {"at": [-5, 0], "label": "focus"}], "caption": "x²/16 − y²/9 = 1 with its central rectangle and asymptotes y = ±¾x."}
```

## Standard forms with center $(h, k)$

| Equation | Opens | Vertices | Foci | Asymptotes |
|---|---|---|---|---|
| $\dfrac{(x - h)^2}{a^2} - \dfrac{(y - k)^2}{b^2} = 1$ | left/right | $(h \pm a, k)$ | $(h \pm c, k)$ | $y - k = \pm\dfrac{b}{a}(x - h)$ |
| $\dfrac{(y - k)^2}{a^2} - \dfrac{(x - h)^2}{b^2} = 1$ | up/down | $(h, k \pm a)$ | $(h, k \pm c)$ | $y - k = \pm\dfrac{a}{b}(x - h)$ |

with $c^2 = a^2 + b^2$ and eccentricity $e = \frac{c}{a} > 1$.

### Example 2

Write $4y^2 - x^2 - 2x - 24y + 19 = 0$ in standard form and describe it.

1. Group: $4(y^2 - 6y) - (x^2 + 2x) = -19$.
2. Complete squares: adding 9 inside the first bracket adds 36; adding 1 inside the second subtracts 1 (because of the minus sign): $4(y - 3)^2 - (x + 1)^2 = -19 + 36 - 1 = 16$.
3. Divide by 16: $\dfrac{(y - 3)^2}{4} - \dfrac{(x + 1)^2}{16} = 1$.

The $y$ term is positive: opens up and down. Center $(-1, 3)$, $a = 2$, $b = 4$, $c = \sqrt{20} = 2\sqrt5$. Vertices $(-1, 1)$ and $(-1, 5)$; foci $(-1, 3 \pm 2\sqrt5)$; asymptotes $y - 3 = \pm\frac12(x + 1)$.

## Identifying a conic from its general equation

Every conic has an equation of the form

$$Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0.$$

When $B = 0$ (no $xy$ term), the squared terms tell the type at a glance:

| Squared terms | Conic |
|---|---|
| only one of $x^2$, $y^2$ appears ($AC = 0$) | parabola |
| same sign, $A = C$ | circle |
| same sign, $A \ne C$ ($AC > 0$) | ellipse |
| opposite signs ($AC < 0$) | hyperbola |

There are also **degenerate conics**, such as a single point ($x^2 + y^2 = 0$), a pair of lines ($x^2 - y^2 = 0$), or no graph at all ($x^2 + y^2 = -1$). Completing the square reveals them: the right side comes out 0 or negative.

## Rotated conics, briefly

An $xy$ term means the conic's axes are tilted. The type is decided by the **discriminant** $B^2 - 4AC$:

| $B^2 - 4AC$ | Conic (if not degenerate) |
|---|---|
| $< 0$ | ellipse (or circle) |
| $= 0$ | parabola |
| $> 0$ | hyperbola |

With $B = 0$ this agrees with the table above: $-4AC < 0$ exactly when $A$ and $C$ have the same sign. To find the tilt, rotate the axes by an angle $\theta$ with $\cot 2\theta = \frac{A - C}{B}$; in the rotated coordinates $(x', y')$ the $xy$ term disappears.

### Example 3

Identify $xy = 1$.

Here $A = 0$, $B = 1$, $C = 0$, so $B^2 - 4AC = 1 > 0$: a hyperbola. $\cot 2\theta = 0$ gives $2\theta = 90^\circ$, $\theta = 45^\circ$. Rotating by $45^\circ$ (substituting $x = \frac{x' - y'}{\sqrt2}$, $y = \frac{x' + y'}{\sqrt2}$) turns $xy = 1$ into $\frac{x'^2}{2} - \frac{y'^2}{2} = 1$. Its asymptotes are the original coordinate axes; it's the graph of $y = \frac1x$.

### Example 4

Classify $3x^2 + 2xy + 3y^2 - 8 = 0$ and $x^2 - 4xy + 4y^2 + x = 0$.

- $B^2 - 4AC = 4 - 36 = -32 < 0$: ellipse.
- $B^2 - 4AC = 16 - 16 = 0$: parabola.

## Common mistakes

- *Using $c^2 = a^2 - b^2$ for a hyperbola.* It's $c^2 = a^2 + b^2$.
- *Choosing $a$ as the larger number.* For a hyperbola, $a$ goes with the positive term.
- *Asymptote slopes upside down.* Left/right opening: $\pm\frac ba$; up/down: $\pm\frac ab$.
- *Sign errors when completing the square* with a negative coefficient: $-(x^2 + 2x + 1)$ subtracts 1.
- *Forgetting the discriminant needs $B^2$*, not $B$.

## Key points

- Hyperbola: difference of distances to the foci is $2a$; $c^2 = a^2 + b^2$; $e > 1$.
- The positive squared term gives the opening direction.
- Asymptotes pass through the center with slopes $\pm\frac ba$ (left/right) or $\pm\frac ab$ (up/down); use the central rectangle to sketch.
- With no $xy$ term: one square → parabola; same signs → ellipse (circle if equal); opposite signs → hyperbola.
- With an $xy$ term, use $B^2 - 4AC$: negative ellipse, zero parabola, positive hyperbola.
