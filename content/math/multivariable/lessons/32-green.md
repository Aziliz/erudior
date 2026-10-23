---
id: mv-green
module: mv-m7
title: Green's theorem
minutes: 40
topics: [Green's theorem]
drills: [mv-d-green-rect, mv-d-green-area]
refs: [mv-ref-vector-calculus]
---
## Circulation on the boundary, spin on the inside

The fundamental theorem for line integrals relates an integral along a curve to values at its
two endpoints. Green's theorem goes one dimension up: it relates a line integral around a
closed curve to a double integral over the region inside. It is the first of the three "big
theorems" of vector calculus, and it often turns a hard line integral into an easy double
integral (or the reverse).

## Orientation

Let $C$ be a **simple closed curve** (it does not cross itself) bounding a region $D$. Its
**positive orientation** is counterclockwise: as you walk along $C$, the region $D$ is always
on your left. We write $\oint_C$ for a line integral around a closed curve.

```plot
{"x": [-2.6, 2.6], "y": [-2, 2], "equal": true, "curves": [{"x": "2*cos(t)", "y": "1.4*sin(t)", "t": [0, "2pi"], "label": "C"}], "segments": [{"from": [2, 0], "to": [1.95, 0.35], "arrow": true}, {"from": [-2, 0], "to": [-1.95, -0.35], "arrow": true}, {"from": [0, 1.4], "to": [-0.4, 1.38], "arrow": true}], "labels": [{"at": [0, 0], "text": "D"}], "caption": "Positive orientation: counterclockwise, with D on the left"}
```

## The theorem

**Green's theorem.** Let $C$ be a positively oriented, piecewise-smooth, simple closed curve
in the plane, bounding the region $D$. If $P$ and $Q$ have continuous partial derivatives on
an open region containing $D$, then

$$\oint_C P\,dx + Q\,dy = \iint_D\left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dA.$$

In vector form, with $\mathbf F = \langle P, Q\rangle$, the left side is the **circulation**
$\oint_C\mathbf F\cdot d\mathbf r$, and the integrand $Q_x - P_y$ measures the local rotation
of the field (the "scalar curl"; Lesson 33).

**Why it is true (a sketch).** Check it for a tiny rectangle $[x, x + \Delta x]\times[y, y + \Delta y]$.
The two vertical sides contribute $Q(x + \Delta x, y)\Delta y - Q(x, y)\Delta y \approx Q_x\,\Delta x\,\Delta y$,
and the two horizontal sides (the top traversed leftward) contribute
$P(x, y)\Delta x - P(x, y + \Delta y)\Delta x \approx -P_y\,\Delta x\,\Delta y$. So the
circulation around a tiny rectangle is about $(Q_x - P_y)\,\Delta A$. Now tile $D$ with tiny
rectangles and add: each interior edge is traversed twice in opposite directions and cancels,
leaving only the outer boundary $C$. The sum of the small circulations is the circulation
around $C$.

![A rectangle divided into six small squares, two rows of three. Each small square has its own counterclockwise loop of blue arrows just inside its edges. Where two squares share an edge, their arrows along that edge point in opposite directions. The thick outer boundary C carries large counterclockwise arrows. Text below: each small square has circulation approximately Q sub x minus P sub y times delta A; shared edges are traversed both ways and cancel; only the outer boundary C is left.](images/mv-m7-green-tiles.svg)

### Example 1: checking on a rectangle

Evaluate $\oint_C xy\,dx + x^2\,dy$ around the rectangle $[0, 2]\times[0, 1]$, counterclockwise.

**With Green:** $Q_x - P_y = 2x - x = x$, and $\iint_D x\,dA = \int_0^1\int_0^2 x\,dx\,dy = 2$.

Directly, side by side: bottom ($y = 0$): $P = 0$ and $dy = 0$, giving 0. Right ($x = 2$,
$y$ from 0 to 1): $\int_0^1 4\,dy = 4$. Top ($y = 1$, $x$ from 2 to 0): $\int_2^0 x\,dx = -2$.
Left ($x = 0$): $Q = 0$ and $dx = 0$, giving 0. Total $4 - 2 = 2$. ✓

### Example 2: an impossible-looking integral

Evaluate $\oint_C(2y + e^{x^2})\,dx + (5x - \cos(y^3))\,dy$, where $C$ is the circle $x^2 + y^2 = 4$, counterclockwise.

Parametrizing would lead to integrals like $\int e^{4\cos^2t}\sin t\ldots$, hopeless. But
$Q_x - P_y = 5 - 2 = 3$, so the integral is $3\cdot\text{Area}(D) = 3\cdot4\pi = 12\pi$.
The nasty terms $e^{x^2}$ (depends only on $x$, in $P$) and $\cos(y^3)$ (only on $y$, in $Q$)
have zero cross-derivatives and drop out.

## Area from a line integral

Choosing $P$ and $Q$ with $Q_x - P_y = 1$ turns Green's theorem into an area formula. Three
convenient choices:

$$A = \oint_C x\,dy = -\oint_C y\,dx = \frac12\oint_C x\,dy - y\,dx.$$

### Example 3: the ellipse

For $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$, take $x = a\cos t$, $y = b\sin t$. Then
$x\,dy - y\,dx = (ab\cos^2t + ab\sin^2t)\,dt = ab\,dt$, so
$A = \tfrac12\int_0^{2\pi}ab\,dt = \pi ab$, matching Lesson 28.

This principle is how a **planimeter** works: a mechanical arm traced around the boundary of
a shape on a map reads off its area.

## Consequences and extensions

- **Conservative fields again.** If $P_y = Q_x$ on a simply connected $D$, Green's theorem
  gives $\oint_C\mathbf F\cdot d\mathbf r = 0$ around every closed curve in $D$. That is why the
  test in Lesson 31 works.
- **Regions with holes.** If $D$ has holes, its boundary has several pieces. Orient the outer
  curve counterclockwise and each inner curve clockwise (so $D$ is still on the left), and
  Green's theorem holds with the sum of all of them. This explains the field
  $\left\langle\tfrac{-y}{x^2+y^2}, \tfrac{x}{x^2+y^2}\right\rangle$: since $Q_x - P_y = 0$ away
  from the origin, its circulation is the same ($2\pi$) around *every* simple closed curve
  enclosing the origin.
- **Flux form.** Green's theorem also says the outward **flux** of $\mathbf F$ across $C$,
  $\oint_C\mathbf F\cdot\mathbf n\,ds = \oint_C P\,dy - Q\,dx$, equals
  $\iint_D(P_x + Q_y)\,dA$. This is the two-dimensional Divergence theorem (Lesson 37).

Here is the orientation rule for a region with one hole. Walking along either boundary curve
in its arrow's direction, you keep $D$ on your left.

![An annulus: a large circle C1 and a smaller circle C2 inside it, with the ring between them shaded and labeled D, and the white disk inside C2 labeled hole, with a dot at its center. Arrows on the outer circle C1 go counterclockwise. Arrows on the inner circle C2 go clockwise.](images/mv-m7-annulus.svg)

## Common mistakes

- Using $P_y - Q_x$ instead of $Q_x - P_y$.
- Applying the theorem to a clockwise curve without changing the sign.
- Applying it when $P$ or $Q$ is undefined somewhere inside $D$ (like at the origin above).
- Forgetting that the curve must be closed; for an open path, close it up and subtract the added piece.

## Key points

- $\oint_C P\,dx + Q\,dy = \iint_D(Q_x - P_y)\,dA$ for positively oriented (counterclockwise) boundaries.
- Circulation around $C$ = total "microscopic rotation" inside.
- Area $= \tfrac12\oint_C x\,dy - y\,dx$.
- Holes: orient inner boundaries clockwise.
