---
id: mv-m7-h-winding
module: mv-m7
title: Holes and the winding number
minutes: 45
honors: true
topics: [Winding number, Fields on regions with holes]
drills: [mv-m7-r2-winding-circ]
refs: [mv-ref-vector-calculus]
---
## One strange field, looked at closely

Lessons 31 and 32 kept meeting the same troublemaker:

$$\mathbf V(x, y) = \left\langle\frac{-y}{x^2 + y^2},\; \frac{x}{x^2 + y^2}\right\rangle.$$

It passes the test $P_y = Q_x$ everywhere it is defined, yet its circulation around the unit
circle is $2\pi$, not 0. Lesson 31 explained the escape clause: the field is undefined at the
origin, so its domain, the **punctured plane** (the plane with the origin removed), is not
simply connected. Lesson 32 added that the circulation is $2\pi$ around *every* simple closed
curve that encloses the origin counterclockwise.

That raises sharper questions. What is the circulation around a curve that loops around the
origin twice, or one that crosses itself? Why is the answer always a multiple of $2\pi$? And
is $\mathbf V$ a rare curiosity, or does every such field look like it? This lesson answers all
three. The key idea, the **winding number** of a closed curve, is one of the first ideas of
topology, and it reappears in complex analysis and in physics (Ampère's law, point vortices).
We call $\mathbf V$ the **vortex field**.

## The vortex field measures angle

Write $\theta$ for the polar angle of the point $(x, y)$. Near any point other than the origin,
$\theta$ can be written as a smooth function (for example $\theta = \arctan(y/x)$ plus a
constant, in the right half-plane), and in every case

$$\frac{\partial\theta}{\partial x} = \frac{-y}{x^2 + y^2}, \qquad \frac{\partial\theta}{\partial y} = \frac{x}{x^2 + y^2}.$$

So $\mathbf V = \nabla\theta$, at least *locally*: on any small disk that misses the origin,
$\theta$ is a potential for $\mathbf V$. For a curve $\mathbf r(t)$ this means

$$\mathbf V(\mathbf r(t))\cdot\mathbf r'(t)\,dt = d\theta,$$

the small change in the angle of the moving point, as seen from the origin. Adding these up,
$\int_C\mathbf V\cdot d\mathbf r$ is the total angle swept out by the point as it travels
along $C$.

Why isn't $\mathbf V$ conservative, then? Because there is no single continuous $\theta$ on the
whole punctured plane. Start on the positive $x$-axis with $\theta = 0$ and walk once
counterclockwise around the origin, keeping $\theta$ continuous: you come back with
$\theta = 2\pi$ at the same point. A potential function would have to return to its starting
value. A field like $\mathbf V$, which has a potential near every point but not on the whole
region, is called **locally conservative**. On a simply connected region locally conservative
fields are conservative (that is the content of the $P_y = Q_x$ test); holes are exactly what
breaks this.

## The winding number

Along a closed curve $C$ that avoids the origin, follow the angle continuously. When the point
returns to where it started, the angle has changed by a whole number of full turns, because
the starting point and the ending point are the same point. So

$$\oint_C\mathbf V\cdot d\mathbf r = 2\pi\,w, \qquad w = \frac{1}{2\pi}\oint_C\frac{-y\,dx + x\,dy}{x^2 + y^2},$$

where the integer $w$ is the **winding number** of $C$ around the origin: the net number of
counterclockwise turns. Clockwise turns count as negative. To measure winding around a
different point $(a, b)$, shift the field there: replace $x$ by $x - a$ and $y$ by $y - b$.

### Example 1: going around twice

Take $\mathbf r(t) = \langle 2\cos 2t,\; 2\sin 2t\rangle$, $0 \le t \le 2\pi$: the circle of radius
2, traced twice counterclockwise.

1. $\mathbf r'(t) = \langle -4\sin 2t,\; 4\cos 2t\rangle$ and $x^2 + y^2 = 4$.
2. $\mathbf V(\mathbf r(t)) = \left\langle\dfrac{-2\sin 2t}{4},\; \dfrac{2\cos 2t}{4}\right\rangle$.
3. Dot product: $\dfrac{8\sin^2 2t + 8\cos^2 2t}{4} = 2$.
4. $\oint_C\mathbf V\cdot d\mathbf r = \int_0^{2\pi}2\,dt = 4\pi$, so $w = 2$.

The radius dropped out, as it must: angle does not care how far away the point is.

The picture below shows a curve that crosses itself. Points in the small inner loop are
circled twice, points between the loops once, and points outside not at all. The winding
number is constant on each piece of the plane that the curve cuts out, and changes by 1 when
you step across the curve.

![A limaçon: a closed curve with a large outer loop and a small inner loop on its left side, with arrows showing it is traced counterclockwise. Three marked points: one inside the small inner loop labeled w = 2, one between the inner and outer loops labeled w = 1, and one outside the curve labeled w = 0.](images/mv-m7-winding.svg)

## Deforming the curve

Here is the tool that makes these integrals easy. It is Green's theorem for a region with a
hole (Lesson 32), stated as a rule of its own.

**Deformation principle.** Let $C_1$ and $C_2$ be positively oriented simple closed curves,
with $C_2$ inside $C_1$, and let $\mathbf F = \langle P, Q\rangle$ have continuous partial
derivatives with $Q_x = P_y$ on an open set containing the region $D$ between them. Then
$\oint_{C_1}\mathbf F\cdot d\mathbf r = \oint_{C_2}\mathbf F\cdot d\mathbf r$.

*Why.* The boundary of $D$ is $C_1$ counterclockwise plus $C_2$ clockwise, so Green's theorem
gives $\oint_{C_1}\mathbf F\cdot d\mathbf r - \oint_{C_2}\mathbf F\cdot d\mathbf r = \iint_D(Q_x - P_y)\,dA = 0$.

So a curl-free field cannot tell two curves apart if one can be slid to the other without
crossing a singular point. To compute a circulation, shrink the curve to a small circle around
the trouble spot, where the integral is simple.

### Example 2: a square, two ways

Find $\oint_C\mathbf V\cdot d\mathbf r$ around the square with vertices $(\pm1, \pm1)$,
counterclockwise.

**Directly.** On the right side, $x = 1$ and $y$ runs from $-1$ to 1, with $dx = 0$:
$$\int_{-1}^{1}\frac{1}{1 + y^2}\,dy = \arctan 1 - \arctan(-1) = \frac{\pi}{2}.$$
The field and the square are both unchanged by a quarter turn about the origin, so each of the
four sides gives $\tfrac{\pi}{2}$, for a total of $2\pi$.

**By deformation.** The unit circle lies inside the square, and $\mathbf V$ is curl-free on the
region between them. So the answer equals the circulation around the unit circle, $2\pi$.
Either way $w = 1$, as it should be for a curve that goes once around.

```plot
{"x": [-1.8, 1.8], "y": [-1.6, 1.6], "equal": true, "vectorField": {"u": "-y/(x^2+y^2)", "v": "x/(x^2+y^2)", "step": 0.4}, "polygons": [{"points": [[1, -1], [1, 1], [-1, 1], [-1, -1]]}], "curves": [{"x": "0.6*cos(t)", "y": "0.6*sin(t)", "t": [0, "2pi"], "dashed": true}], "caption": "The vortex field: the square and the small dashed circle both have circulation 2π"}
```

## Every curl-free field on the punctured plane

Is $\mathbf V$ just one odd example? No: it is the *only* new ingredient.

**Theorem.** Let $\mathbf F = \langle P, Q\rangle$ have continuous partial derivatives with
$Q_x = P_y$ on the punctured plane. Let $c = \dfrac{1}{2\pi}\oint_{|\mathbf x| = 1}\mathbf F\cdot d\mathbf r$
(unit circle, counterclockwise). Then

$$\mathbf F = \nabla f + c\,\mathbf V$$

for some function $f$ on the punctured plane.

*Why.* Let $\mathbf G = \mathbf F - c\mathbf V$. It is curl-free, and its circulation around the
unit circle is $2\pi c - c\cdot2\pi = 0$. Every simple closed curve either encloses the origin
(then the deformation principle compares it with a small circle around the origin inside it,
and that small circle with the unit circle: circulation 0) or does not (then Green's theorem on the region inside gives 0). So $\mathbf G$ has
zero circulation around simple closed curves, which makes its line integrals path independent,
and by Lesson 31 it is a gradient. (We have shown the step for simple closed curves; the case
of curves that cross themselves follows by splitting them into simple loops, which we take on
trust here.)

Then for *any* closed curve $C$ in the punctured plane,
$\oint_C\mathbf F\cdot d\mathbf r = 2\pi c\,w$: one number $c$, measured once, plus the winding
number, settles every circulation.

### Example 3

Let $\mathbf F = \left\langle\dfrac{x - 3y}{x^2 + y^2},\; \dfrac{y + 3x}{x^2 + y^2}\right\rangle$.

1. **Curl-free.** A computation (or the decomposition below) gives $Q_x = P_y$ away from the
   origin.
2. **Find $c$.** On the unit circle $x = \cos t$, $y = \sin t$, $x^2 + y^2 = 1$:
   $\mathbf F\cdot\mathbf r' = (\cos t - 3\sin t)(-\sin t) + (\sin t + 3\cos t)\cos t = 3$.
   So the circulation is $6\pi$ and $c = 3$.
3. **Find $f$.** $\mathbf F - 3\mathbf V = \left\langle\dfrac{x}{x^2 + y^2}, \dfrac{y}{x^2 + y^2}\right\rangle$,
   which is $\nabla f$ for $f = \tfrac12\ln(x^2 + y^2) = \ln|\mathbf x|$.
4. **Use it.** Around the ellipse $\tfrac{x^2}{4} + y^2 = 1$ counterclockwise ($w = 1$): $6\pi$.
   Around the circle $(x - 5)^2 + y^2 = 1$ ($w = 0$): $0$. Around the circle of radius 2 traced
   twice clockwise ($w = -2$): $-12\pi$.

## Physics: wires and vortices

The vortex field is not only a classroom example.

- **Magnetic field of a long straight wire.** A current $I$ flowing up the $z$-axis produces,
  in the $xy$-plane, $\mathbf B = \dfrac{\mu_0 I}{2\pi}\mathbf V$: circles around the wire,
  with strength falling off like $1/r$. Ampère's law, $\oint_C\mathbf B\cdot d\mathbf r = \mu_0 I$
  for a loop around the wire once, is the statement $\oint\mathbf V\cdot d\mathbf r = 2\pi$; a loop
  that winds around the wire $w$ times picks up $\mu_0 I w$.
- **A point vortex in a fluid.** The velocity field $\dfrac{\Gamma}{2\pi}\mathbf V$ swirls around
  the origin with circulation $\Gamma$ around any loop enclosing it once, but has zero curl at
  every other point: a small paddle wheel carried along by the flow does not spin, even though
  the fluid as a whole goes around.

Both are idealizations: a real wire has thickness and a real vortex has a core where the
velocity stays finite. Outside the wire or core, the formulas are a good model.

## Common mistakes

- Concluding from $Q_x = P_y$ alone that a field is conservative when its domain has a hole.
- Treating $\theta$ as a potential on the whole punctured plane; it is one only on regions that
  do not go around the origin.
- Forgetting that clockwise turns count negatively, or that a curve that does not go around
  the origin has winding number 0 even if it is large.
- Using the deformation principle when the curve has to pass through a singular point to get
  from one position to the other.
- Expecting the winding number to depend on the size or shape of the curve; only the net number
  of turns matters.

## Key points

- The vortex field $\mathbf V = \left\langle\frac{-y}{x^2 + y^2}, \frac{x}{x^2 + y^2}\right\rangle$
  is locally $\nabla\theta$; its line integral is the total angle swept out.
- Winding number: $w = \dfrac{1}{2\pi}\oint_C\dfrac{-y\,dx + x\,dy}{x^2 + y^2}$, always an integer.
- Deformation principle: a curl-free field has the same circulation around two curves that
  bound a region free of singular points.
- On the punctured plane, every curl-free field is $\nabla f + c\mathbf V$, so
  $\oint_C\mathbf F\cdot d\mathbf r = 2\pi c\,w$.
- Ampère's law for a straight wire and the circulation of a point vortex are this same fact.
