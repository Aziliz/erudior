---
id: mv-surfaces
module: mv-m1
title: Cylinders and quadric surfaces
minutes: 30
topics: [Cylinders, Quadric surfaces]
drills: [mv-d-sphere-center]
refs: [mv-ref-vectors]
---
## Seeing surfaces through their slices

Planes are the simplest surfaces, given by linear equations. The next simplest are given by
second-degree equations. You will meet them as graphs of functions in Module 3, as regions
of integration in Modules 5 and 6, and as surfaces for flux in Module 8, so it pays to
recognize them on sight. The main tool is the **trace**: the curve where a surface meets a
plane, usually a plane parallel to a coordinate plane ($x = k$, $y = k$ or $z = k$). A few
traces, drawn in 2D, tell you the 3D shape.

## Cylinders

In multivariable calculus, a **cylinder** is any surface made of all lines (the
*rulings*) parallel to a given line through a given plane curve. The practical test: *if one
variable is missing from the equation, the surface is a cylinder parallel to that
variable's axis.*

- $x^2 + y^2 = 4$ in space is a circular cylinder of radius 2 around the $z$-axis: every
  horizontal trace is the same circle, because $z$ is free.
- $z = y^2$ is a parabolic cylinder: the parabola $z = y^2$ in the $yz$-plane, slid along
  the $x$-axis.
- $y = \sin x$ is a wavy "corrugated sheet" running in the $z$ direction.

## Quadric surfaces

A **quadric surface** is the graph of a second-degree equation in $x, y, z$. After
translating and rotating axes, each one matches a standard form. Here they are with their
traces (constants $a, b, c > 0$):

| Surface | Standard equation | Traces |
|---|---|---|
| **Ellipsoid** | $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}+\dfrac{z^2}{c^2} = 1$ | all ellipses |
| **Elliptic paraboloid** | $\dfrac{z}{c} = \dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}$ | horizontal: ellipses; vertical: parabolas |
| **Hyperbolic paraboloid** | $\dfrac{z}{c} = \dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}$ | horizontal: hyperbolas; vertical: parabolas (a saddle) |
| **Cone** | $\dfrac{z^2}{c^2} = \dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}$ | horizontal: ellipses; vertical through axis: line pairs |
| **Hyperboloid of one sheet** | $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}-\dfrac{z^2}{c^2} = 1$ | horizontal: ellipses; vertical: hyperbolas |
| **Hyperboloid of two sheets** | $-\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}+\dfrac{z^2}{c^2} = 1$ | horizontal ($\lvert z\rvert>c$): ellipses; vertical: hyperbolas |

How to tell them apart quickly:

- Count the squared terms. Three squares and a constant: ellipsoid, a hyperboloid, or (with
  constant 0) a cone. Two squares and a linear term: a paraboloid.
- Count the minus signs (with the constant on the right and positive). No minus: ellipsoid.
  One minus: one sheet. Two minuses: two sheets.
- The variable that is linear (paraboloids) or has the odd sign (hyperboloids, cones) is the
  **axis** of the surface.

### Example 1: identify from traces

Identify $z = x^2 + 4y^2$.

1. Horizontal traces $z = k$: $x^2 + 4y^2 = k$. For $k > 0$ these are ellipses that grow with $k$; for $k = 0$ a single point; for $k < 0$ nothing.
2. Trace in $y = 0$: $z = x^2$, a parabola opening up. In $x = 0$: $z = 4y^2$, a narrower parabola.
3. Conclusion: an elliptic paraboloid with axis the $z$-axis, opening upward, a bowl.

```plot
{"x": [-3, 3], "y": [-2, 2], "equal": true, "curves": [{"x": "cos(t)", "y": "0.5*sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "k = 1"}, {"x": "2*cos(t)", "y": "sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "k = 4"}, {"x": "sqrt(6)*cos(t)", "y": "sqrt(6)/2*sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "k = 6"}], "caption": "Horizontal traces of z = x² + 4y²: ellipses x² + 4y² = k, viewed from above"}
```

### Example 2: the saddle

Describe $z = y^2 - x^2$.

1. Trace in $x = 0$: $z = y^2$, a parabola opening *up*.
2. Trace in $y = 0$: $z = -x^2$, a parabola opening *down*.
3. Horizontal traces $y^2 - x^2 = k$: hyperbolas opening along the $y$-axis for $k>0$,
   along the $x$-axis for $k<0$, and the crossing lines $y = \pm x$ for $k = 0$.

This is a hyperbolic paraboloid. Near the origin it rises in one direction and falls in
the other, like a saddle or a riding pass between two hills. We will meet the origin again
in Lesson 17 as the classic **saddle point**.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "functions": [{"f": "sqrt(x^2+1)"}, {"f": "-sqrt(x^2+1)"}, {"f": "x", "dashed": true}, {"f": "-x", "dashed": true}], "curves": [{"x": "sqrt(t^2+1)", "y": "t", "t": [-3, 3]}, {"x": "-sqrt(t^2+1)", "y": "t", "t": [-3, 3]}], "caption": "Horizontal traces of the saddle z = y² − x²: hyperbolas for k = ±1, the dashed lines y = ±x for k = 0", "labels": [{"at": [0.75, 1.55], "text": "k = 1"}, {"at": [1.75, 0.15], "text": "k = −1"}]}
```

## Completing the square

Shifted quadrics are identified by completing the square, just as for spheres.

### Example 3

Classify $x^2 + 2z^2 - 6x - y + 10 = 0$.

1. Complete the square in $x$: $(x-3)^2 - 9 + 2z^2 - y + 10 = 0$.
2. Solve for the linear variable: $y = (x-3)^2 + 2z^2 + 1$.
3. Two squares plus a linear term: an elliptic paraboloid with axis parallel to the
   $y$-axis, vertex $(3, 1, 0)$, opening in the positive $y$ direction.

## Common mistakes

- Calling $x^2+y^2 = 4$ a circle. In space it is a cylinder.
- Mixing up hyperboloids of one and two sheets: one minus sign means one sheet (connected).
- Forgetting that a cone has constant 0 (with constant $\ne 0$ you get a hyperboloid).
- Identifying the axis by the *largest* coefficient rather than by the odd-one-out variable.

## Key points

- A missing variable means a cylinder parallel to that axis.
- Traces in planes $x=k$, $y=k$, $z=k$ reveal the shape.
- Six quadrics: ellipsoid, elliptic and hyperbolic paraboloids, cone, hyperboloids of one and two sheets.
- The odd variable (linear, or with the different sign) gives the axis.
