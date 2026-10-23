---
id: calc-m3-h-implicit-curves
module: calc-m3
title: 'Implicit curves: special tangents, singular points and orthogonal families'
minutes: 45
honors: true
topics: [Implicit curves, Orthogonal trajectories]
drills: [calc-m3-r2-horizontal-tangent, calc-m3-r2-folium-tangent]
refs: [calc-ref-derivatives]
---
## From one slope to the whole curve

Lesson 12 found the slope of an implicitly defined curve at a point. This lesson asks bigger questions about the whole curve. Where are its tangent lines horizontal or vertical? Are there points where the method breaks down, and what does the curve look like there? And when do two whole families of curves cross each other at right angles everywhere, as field lines and equipotential lines do in physics? The tools are the same implicit differentiation, used with a little more organization.

## A formula for the slope

Write the curve as $F(x, y) = 0$ by moving everything to one side. For example, the circle becomes $F(x, y) = x^2 + y^2 - 25$.

Define two new derivatives of $F$:

- $F_x$: differentiate $F$ with respect to $x$, treating $y$ as a constant;
- $F_y$: differentiate $F$ with respect to $y$, treating $x$ as a constant.

These are called **partial derivatives** (multivariable calculus studies them properly). For $F = x^3 + y^3 - 6xy$: $F_x = 3x^2 - 6y$ and $F_y = 3y^2 - 6x$.

Now differentiate $F(x, y) = 0$ implicitly. Every term splits into a part with no $\frac{dy}{dx}$ and a part multiplied by $\frac{dy}{dx}$. For a single term $x^my^n$, the product and chain rules give
$$\frac{d}{dx}\left(x^my^n\right) = mx^{m - 1}y^n + nx^my^{n - 1}\frac{dy}{dx},$$
and the first part is that term's contribution to $F_x$, the second its contribution to $F_y$. Adding over all the terms of a polynomial $F$ gives $F_x + F_y\frac{dy}{dx} = 0$, so
$$\frac{dy}{dx} = -\frac{F_x}{F_y}\qquad (F_y \ne 0).$$
(The same formula holds for any smooth $F$, by the multivariable chain rule.) For the circle, $-\frac{F_x}{F_y} = -\frac{2x}{2y} = -\frac xy$, as in Lesson 12. The formula is a bookkeeping device: it does exactly what you did by hand, sorted into two piles.

## Horizontal and vertical tangents

Read the formula like a fraction:

- **Horizontal tangent:** $F_x = 0$ and $F_y \ne 0$ (slope 0).
- **Vertical tangent:** $F_y = 0$ and $F_x \ne 0$ (the slope blows up; near such a point $x$ is a function of $y$ with $\frac{dx}{dy} = -\frac{F_y}{F_x} = 0$).

Each condition is one equation; together with the curve's own equation $F = 0$ it gives two equations in two unknowns. Always solve them *together*: a point that makes $F_x = 0$ but is not on the curve is irrelevant.

### Example 1

Find the points of the tilted ellipse $x^2 + xy + y^2 = 7$ (Lesson 12, Example 6) where the tangent is horizontal or vertical.

$F_x = 2x + y$ and $F_y = x + 2y$.

- *Horizontal:* $2x + y = 0$, so $y = -2x$. Substitute: $x^2 - 2x^2 + 4x^2 = 3x^2 = 7$, so $x = \pm\sqrt{7/3} \approx \pm1.528$. The points are $\left(\sqrt{7/3}, -2\sqrt{7/3}\right)$ and $\left(-\sqrt{7/3}, 2\sqrt{7/3}\right)$, about $(1.528, -3.055)$ and $(-1.528, 3.055)$. At them $F_y = x + 2y = -3x \ne 0$. ✓
- *Vertical:* $x + 2y = 0$, so $x = -2y$, and by the symmetry of the equation in $x$ and $y$ the points are $\left(-2\sqrt{7/3}, \sqrt{7/3}\right)$ and $\left(2\sqrt{7/3}, -\sqrt{7/3}\right)$.

The highest point of the ellipse is $(-1.528, 3.055)$ and the rightmost is $(3.055, -1.528)$, found without ever solving for $y$.

```plot
{"x": [-4.5, 4.5], "y": [-4, 4], "equal": true, "curves": [{"x": "1.5275cos(t) + 2.6458sin(t)", "y": "1.5275cos(t) - 2.6458sin(t)", "t": [0, "2pi"]}], "segments": [{"from": [-2.4, 3.055], "to": [-0.6, 3.055], "dashed": true}, {"from": [0.6, -3.055], "to": [2.4, -3.055], "dashed": true}, {"from": [3.055, -2.4], "to": [3.055, -0.6], "dashed": true}, {"from": [-3.055, 0.6], "to": [-3.055, 2.4], "dashed": true}], "points": [{"at": [-1.528, 3.055]}, {"at": [1.528, -3.055]}, {"at": [3.055, -1.528]}, {"at": [-3.055, 1.528]}], "caption": "x² + xy + y² = 7 with its two horizontal and two vertical tangents"}
```

### Example 2

Find where the folium of Descartes, $x^3 + y^3 = 6xy$, has a horizontal tangent.

$F_x = 3x^2 - 6y = 0$ gives $y = \frac{x^2}{2}$. Substitute into the curve:
$$x^3 + \frac{x^6}{8} = 6x\cdot\frac{x^2}{2} = 3x^3 \quad\Longrightarrow\quad x^3\left(\frac{x^3}{8} - 2\right) = 0.$$
So $x = 0$ or $x^3 = 16$. At $x = 0$ we get $y = 0$, but there $F_y = 0$ too, so the origin needs separate treatment (next section). At $x = \sqrt[3]{16} = 2\sqrt[3]2 \approx 2.520$, $y = \frac{x^2}{2} = \sqrt[3]{32} = 2\sqrt[3]4 \approx 3.175$, and $F_y = 3y^2 - 6x \approx 15.1 \ne 0$. ✓ The horizontal tangent is at $\left(2\sqrt[3]2, 2\sqrt[3]4\right)$, the top of the loop.

The equation is unchanged when $x$ and $y$ swap, so the curve is symmetric across $y = x$, and the vertical tangent is at the mirror point $\left(2\sqrt[3]4, 2\sqrt[3]2\right)$.

![The folium of Descartes: a loop in the first quadrant crossing itself at the origin, two tails approaching the dashed asymptote x + y = −2, a horizontal tangent at the top of the loop and a vertical tangent at its right end](images/calc-m3-folium.svg)

## Singular points

A point on the curve where $F_x = 0$ *and* $F_y = 0$ is a **singular point**. There the formula gives $\frac00$, and the curve may fail to have a single tangent line at all. Two typical pictures:

- *A crossing (node).* At the origin, the folium crosses itself: one branch arrives along the $x$-axis and another along the $y$-axis. There are two tangent lines, so "the slope at the origin" has no single value. Near the origin the cubic terms are tiny compared with $6xy$, so the curve looks like $xy = 0$, the two axes.
- *A sharp point (cusp).* For $y^2 = x^3$, $F_x = -3x^2$ and $F_y = 2y$ both vanish at the origin. The curve is $y = \pm x^{3/2}$: two branches that leave the origin in the same direction, both tangent to the $x$-axis, forming a sharp point. Seen with $x$ as a function of $y$, it is the graph of $x = y^{2/3}$, whose cusp Lesson 7 met.

```plot
{"x": [-1, 3], "y": [-3, 3], "equal": true, "curves": [{"x": "t^2", "y": "t^3", "t": [-1.4, 1.4]}], "points": [{"at": [0, 0], "label": "cusp"}], "caption": "y² = x³: two branches y = ±x^(3/2) meet in a sharp point at the origin"}
```

Not every solution of $F_x = F_y = 0$ is a singular point: it must also satisfy $F = 0$.

### Example 3

Find all singular points of the folium $x^3 + y^3 = 6xy$.

$F_x = 0$ gives $y = \frac{x^2}{2}$ and $F_y = 0$ gives $x = \frac{y^2}{2}$. Substituting, $x = \frac{x^4}{8}$, so $x = 0$ or $x^3 = 8$, that is $x = 2$ (and then $y = 2$). Check each on the curve:

- $(0, 0)$: $0 + 0 = 0$. ✓ A singular point.
- $(2, 2)$: $8 + 8 = 16$, but $6\cdot2\cdot2 = 24$. ✗ Not on the curve.

So the origin is the **only** singular point. Skipping the last check would wrongly add $(2, 2)$.

## Orthogonal families

Two curves are *orthogonal* at a point where they cross if their tangent lines there are perpendicular: the slopes multiply to $-1$ (or one tangent is horizontal and the other vertical). A *family* of curves is a set given by one equation with a parameter, such as all circles $x^2 + y^2 = r^2$. Two families are **orthogonal trajectories** of each other when every curve of one meets every curve of the other at right angles.

The circles $x^2 + y^2 = r^2$ and the lines through the origin $y = kx$ are the simplest pair. A circle's slope at $(x, y)$ is $-\frac xy$; the line through the origin and $(x, y)$ has slope $\frac yx$; the product is $-1$. Every radius is perpendicular to its circle.

### Example 4

Show that the hyperbolas $x^2 - y^2 = c$ and $xy = k$ are orthogonal trajectories, and check it where $x^2 - y^2 = 3$ meets $xy = 2$.

- $x^2 - y^2 = c$: $2x - 2yy' = 0$, so the slope is $\frac xy$.
- $xy = k$: $y + xy' = 0$, so the slope is $-\frac yx$.

At any crossing point with $x, y \ne 0$ the product is $\frac xy\cdot\left(-\frac yx\right) = -1$. Notice the slopes did not depend on $c$ or $k$, which is why one computation covers every pair of curves.

For the check, $y = \frac2x$ in the first equation gives $x^2 - \frac{4}{x^2} = 3$, i.e. $x^4 - 3x^2 - 4 = 0$, so $(x^2 - 4)(x^2 + 1) = 0$ and $x = \pm2$. At $(2, 1)$ the slopes are $\frac21 = 2$ and $-\frac12$, product $-1$. ✓

```plot
{"x": [-4, 4], "y": [-4, 4], "equal": true, "functions": [{"f": "1/x"}, {"f": "-1/x"}, {"f": "3/x"}, {"f": "-3/x"}], "curves": [{"x": "cosh(t)", "y": "sinh(t)", "t": [-2.2, 2.2], "dashed": true}, {"x": "-cosh(t)", "y": "sinh(t)", "t": [-2.2, 2.2], "dashed": true}, {"x": "sinh(t)", "y": "cosh(t)", "t": [-2.2, 2.2], "dashed": true}, {"x": "sinh(t)", "y": "-cosh(t)", "t": [-2.2, 2.2], "dashed": true}, {"x": "2cosh(t)", "y": "2sinh(t)", "t": [-1.5, 1.5], "dashed": true}, {"x": "-2cosh(t)", "y": "2sinh(t)", "t": [-1.5, 1.5], "dashed": true}, {"x": "2sinh(t)", "y": "2cosh(t)", "t": [-1.5, 1.5], "dashed": true}, {"x": "2sinh(t)", "y": "-2cosh(t)", "t": [-1.5, 1.5], "dashed": true}], "caption": "Solid: xy = ±1, ±3. Dashed: x² − y² = ±1, ±4. Every solid curve crosses every dashed curve at a right angle"}
```

These two families describe an *idealized* model of fluid flowing into a corner: the curves $xy = k$ are the streamlines (the paths the fluid follows) and $x^2 - y^2 = c$ are the curves of equal potential. The same right-angle pattern appears between electric field lines and equipotentials, between heat-flow lines and isotherms, and between the contour lines of a map and the paths of steepest descent.

### Example 5

Show that the ellipses $x^2 + 2y^2 = C$ are orthogonal trajectories of the parabolas $y = kx^2$.

- Ellipse: $2x + 4yy' = 0$, slope $-\frac{x}{2y}$.
- Parabola: slope $2kx$. This contains the parameter, so eliminate it: $k = \frac{y}{x^2}$, giving slope $\frac{2y}{x}$, valid at every point of every parabola with $x \ne 0$.

Product: $-\frac{x}{2y}\cdot\frac{2y}{x} = -1$. ✓ Eliminating the parameter is the key step: the slope must be written in terms of the point $(x, y)$ alone. *Finding* the ellipses from the parabolas, rather than checking them, means solving the differential equation $\frac{dy}{dx} = -\frac{x}{2y}$, a separable equation (Lesson 38).

## Common mistakes

- *Forgetting the curve's equation.* $F_x = 0$ alone is a whole curve of candidates; only the points that also satisfy $F = 0$ count.
- *Calling a singular point a horizontal tangent.* If $F_y = 0$ too, the formula is $\frac00$ and says nothing; look at the curve.
- *Leaving the parameter in.* For orthogonal families, the slope of each family must depend only on $(x, y)$; eliminate $k$ or $c$ first.
- *Mixing up the partial derivatives.* $F_x$ treats $y$ as a constant; the slope is $-\frac{F_x}{F_y}$, with $F_x$ on top and a minus sign.
- *Reading "vertical tangent" as "no tangent."* A vertical tangent line exists; only the slope $\frac{dy}{dx}$ fails to.

## Key points

- For $F(x, y) = 0$: $\dfrac{dy}{dx} = -\dfrac{F_x}{F_y}$, where $F_x$, $F_y$ are partial derivatives.
- Horizontal tangent: $F = 0$, $F_x = 0$, $F_y \ne 0$. Vertical tangent: $F = 0$, $F_y = 0$, $F_x \ne 0$.
- Singular point: $F = F_x = F_y = 0$; the curve may cross itself (node) or form a sharp point (cusp).
- Two families are orthogonal trajectories when their slopes at each point multiply to $-1$; write each slope in terms of $x$ and $y$ only.
