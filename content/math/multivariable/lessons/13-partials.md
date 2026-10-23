---
id: mv-partials
module: mv-m3
title: Partial derivatives
minutes: 35
topics: [Partial derivatives, Higher-order partials]
drills: [mv-d-partials, mv-d-second-partials]
refs: [mv-ref-differential]
---
## Rates of change, one direction at a time

How fast does $f(x, y)$ change? It depends on which way you move. The simplest answer is to
move parallel to one axis at a time, holding the other variable fixed. That reduces the
question to a single-variable derivative, which you already know how to compute. The
result is a **partial derivative**, the building block of everything else in this module.

## Definition

The partial derivative of $f$ with respect to $x$ at $(a, b)$ is

$$f_x(a, b) = \lim_{h\to0}\frac{f(a + h, b) - f(a, b)}{h},$$

and similarly $f_y(a, b) = \lim_{h\to0}\dfrac{f(a, b + h) - f(a, b)}{h}$. Other notations:
$f_x = \dfrac{\partial f}{\partial x} = \partial_x f = D_xf$. The curly $\partial$ signals
"other variables are being held constant."

**How to compute:** to find $f_x$, treat $y$ as a constant and differentiate with respect
to $x$ using all the usual rules. To find $f_y$, treat $x$ as a constant.

### Example 1

Let $f(x, y) = x^3y^2 + 4xy - \sin(y)$. Find $f_x$, $f_y$, and $f_x(1, 2)$.

1. Holding $y$ fixed, $y^2$ is a constant coefficient and $\sin y$ is a constant: $f_x = 3x^2y^2 + 4y$.
2. Holding $x$ fixed: $f_y = 2x^3y + 4x - \cos y$.
3. $f_x(1, 2) = 3(1)(4) + 8 = 20$.

### Example 2: chain rule inside a partial

Let $g(x, y) = e^{x^2y}$. Then $g_x = e^{x^2y}\cdot 2xy$ and $g_y = e^{x^2y}\cdot x^2$. The
inner derivative is a partial derivative of the exponent.

## Geometric meaning

Freeze $y = b$. The plane $y = b$ cuts the surface $z = f(x, y)$ in a curve, the graph of
the one-variable function $x \mapsto f(x, b)$. Its slope at $x = a$ is $f_x(a, b)$. So
$f_x(a,b)$ is the slope of the surface in the $x$-direction, and $f_y(a,b)$ the slope in
the $y$-direction.

![A dome-shaped surface z = f(x, y) drawn in three dimensions with x, y and z axes. A vertical plane y = b slices through it, and the curve where they meet, the trace z = f(x, b), is drawn in red. At the point P = (a, b, f(a, b)) on the trace a green tangent line touches it; its slope is f sub x of (a, b).](images/mv-m3-partial-slice.svg)

In the picture, the trace is falling at $P$ as $x$ increases, so $f_x(a, b) < 0$ there. To see
$f_y$, slice with the plane $x = a$ instead.

On a contour map you can estimate the sign and size of a partial derivative by moving in
the positive $x$-direction from a point and seeing which level curves you cross and how
quickly.

```plot
{"x": [-3.2, 3.2], "y": [-2.4, 2.4], "equal": true, "curves": [{"x": "sqrt(2)*cos(t)", "y": "sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "c = 2"}, {"x": "2*cos(t)", "y": "sqrt(2)*sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "c = 4"}, {"x": "sqrt(6)*cos(t)", "y": "sqrt(3)*sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "c = 6"}, {"x": "sqrt(8)*cos(t)", "y": "2*sin(t)", "t": ["-0.25*pi", "1.75*pi"], "label": "c = 8"}], "points": [{"at": [1, 1]}], "segments": [{"from": [1, 1], "to": [1.8, 1], "arrow": true, "label": "+x"}, {"from": [1, 1], "to": [1, 1.8], "arrow": true, "label": "+y"}], "caption": "Level curves of f = x² + 2y². At P, f = 3; moving right or up crosses higher levels, so f_x > 0 and f_y > 0.", "labels": [{"at": [1.45, 0.72], "text": "P(1, 1)"}]}
```

For $f(x, y) = x^2 + 2y^2$ the partials at $P(1, 1)$ are $f_x = 2$ and $f_y = 4$. The
contours confirm it: moving in $+y$ climbs faster (curves are closer together in that
direction).

## Interpretation as rates

If $T(x, y)$ is temperature in °C at position $(x, y)$ in meters, then $T_x(3, 4) = -0.5$
means: at $(3, 4)$, moving east, temperature drops about 0.5 °C per meter. Units of a partial
derivative are (output units)/(input units).

## Higher-order partial derivatives

Partial derivatives are themselves functions of $x$ and $y$, so they can be differentiated
again. There are four **second-order partial derivatives**:

$$f_{xx} = \frac{\partial^2 f}{\partial x^2},\quad f_{yy} = \frac{\partial^2 f}{\partial y^2},\quad f_{xy} = (f_x)_y = \frac{\partial^2 f}{\partial y\,\partial x},\quad f_{yx} = (f_y)_x = \frac{\partial^2 f}{\partial x\,\partial y}.$$

Watch the order: in subscript notation $f_{xy}$ means "first $x$, then $y$," read left to
right; in fraction notation the order reads right to left.

**Clairaut's theorem.** If $f_{xy}$ and $f_{yx}$ are both continuous near $(a, b)$, then
$f_{xy}(a, b) = f_{yx}(a, b)$. For all the functions you will meet in practice, the mixed
partials agree, which is a useful check on your work.

### Example 3

For $f(x, y) = x^3y^2 + 4xy - \sin y$ (from Example 1):

1. $f_{xx} = \partial_x(3x^2y^2 + 4y) = 6xy^2$.
2. $f_{xy} = \partial_y(3x^2y^2 + 4y) = 6x^2y + 4$.
3. $f_{yx} = \partial_x(2x^3y + 4x - \cos y) = 6x^2y + 4$. ✓ Equal, as Clairaut predicts.
4. $f_{yy} = \partial_y(2x^3y + 4x - \cos y) = 2x^3 + \sin y$.

## Three or more variables

Nothing new: for $f(x, y, z)$, the partial $f_z$ treats $x$ and $y$ as constants. For example,
if $f = xe^{yz}$, then $f_x = e^{yz}$, $f_y = xze^{yz}$, $f_z = xye^{yz}$.

Partial derivatives also appear in **partial differential equations**. The function
$u = e^{-t}\sin x$ satisfies the heat equation $u_t = u_{xx}$: indeed $u_t = -e^{-t}\sin x$
and $u_{xx} = -e^{-t}\sin x$. Equations like this, along with Laplace's equation
$u_{xx} + u_{yy} = 0$ and the wave equation, model heat flow, electrostatics and vibration.

## Common mistakes

- Differentiating the "constant" variable anyway: $\partial_x(y^2) = 0$, not $2y$.
- Treating $\partial_x(xy)$ as $1$; it is $y$, since $y$ is a constant coefficient.
- Mixing up the order in $f_{xy}$ (subscripts: left to right).
- Forgetting the chain-rule factor inside exponentials and trig functions.

## Key points

- $f_x$: differentiate in $x$ with $y$ held constant; it is the slope of the surface in the $x$-direction.
- Second partials: $f_{xx}, f_{xy}, f_{yx}, f_{yy}$; Clairaut: $f_{xy} = f_{yx}$ when continuous.
- Units of $f_x$ are output units per unit of $x$.
