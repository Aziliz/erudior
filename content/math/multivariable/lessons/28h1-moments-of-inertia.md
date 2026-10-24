---
id: mv-m6-h-moments-of-inertia
module: mv-m6
title: Moments of inertia of solids
minutes: 45
honors: true
topics: [Moments of inertia]
drills: [mv-m6-r2-moi-solid, mv-m6-r2-parallel-axis, mv-m6-r2-rolling]
refs: [mv-ref-integrals]
---
## Why a triple integral decides who wins a race

Lesson 24 met the moment of inertia of a flat plate, $I_0 = \iint(x^2 + y^2)\rho\,dA$, and
Lesson 25 promised that "everything carries over with $dV$ in place of $dA$". This lesson
cashes in that promise for spinning solids. With the triple integrals of Lessons 25 to 27
you can compute the moments of inertia of cylinders, balls, cones and boxes, prove the
**parallel axis theorem**, and settle a classic puzzle: release a solid ball, a solid
cylinder and a hoop together at the top of a ramp, and which reaches the bottom first?

One change of notation: spherical coordinates already use $\rho$ for distance from the
origin, so in this lesson density (mass per unit volume) is written $\delta$.

## Where the integral comes from

Picture a rigid body spinning about a fixed axis with angular speed $\omega$ (radians per
second). A small piece of mass $\Delta m$ at distance $d$ from the axis moves on a circle of
radius $d$, so its speed is $v = \omega d$ and its kinetic energy is
$\tfrac12\Delta m\,\omega^2d^2$. Adding over all pieces and taking the limit,

$$KE_{\text{rot}} = \frac12\omega^2\iiint_E d^2\,\delta\,dV = \frac12 I\omega^2, \qquad I = \iiint_E d^2\,\delta\,dV.$$

So $I$ plays the role for rotation that mass plays in $\tfrac12mv^2$. It is also the
constant in the rotational version of Newton's law, torque $=I\times$ angular acceleration.
Because distance enters *squared*, mass far from the axis counts much more than mass near
it. For the coordinate axes:

$$I_z = \iiint_E(x^2 + y^2)\,\delta\,dV,\quad I_x = \iiint_E(y^2 + z^2)\,\delta\,dV,\quad I_y = \iiint_E(x^2 + z^2)\,\delta\,dV.$$

A handy summary number is the **radius of gyration** $k = \sqrt{I/m}$: the distance from the
axis at which you could put all the mass in a thin ring and get the same $I$.

### Example 1: a solid cylinder about its axis

Take a uniform cylinder of radius $a$, height $h$, density $\delta$, with its axis on the
$z$-axis. In cylindrical coordinates $x^2 + y^2 = r^2$, so

$$I_z = \int_0^{2\pi}\int_0^a\int_0^h r^2\,\delta\,r\,dz\,dr\,d\theta = \delta\cdot2\pi\cdot h\cdot\frac{a^4}{4} = \frac{\pi\delta ha^4}{2}.$$

The mass is $m = \pi a^2h\delta$, so $I_z = \tfrac12ma^2$ and $k = a/\sqrt2 \approx 0.71a$. The
height has dropped out: a coin and a long rod of the same radius and mass have the same $I$
about their axis.

### Example 2: a solid ball, with a symmetry trick

For a uniform ball of radius $a$ centered at the origin, $I_z$ in spherical coordinates
needs $x^2 + y^2 = \rho^2\sin^2\phi$, which is doable but messy. Instead add all three:

$$I_x + I_y + I_z = \iiint_E 2(x^2 + y^2 + z^2)\,\delta\,dV = 2\iiint_E\rho^2\,\delta\,dV.$$

The ball looks the same from every axis, so $I_x = I_y = I_z = I$, and

$$I = \frac23\iiint_E\rho^2\,\delta\,dV = \frac23\delta\int_0^\pi\int_0^{2\pi}\int_0^a\rho^4\sin\phi\,d\rho\,d\theta\,d\phi = \frac23\delta\cdot\frac{4\pi a^5}{5} = \frac{8\pi\delta a^5}{15}.$$

With $m = \tfrac43\pi a^3\delta$, this is $I = \tfrac25ma^2$. The trick works for any density
that depends only on $\rho$.

## Hollow versus solid

A hollow object has its mass at the outside, so it should have a larger $I$ for the same
mass and radius. Calculus gets the thin spherical shell from the solid ball with no new
integral. A shell of radius $a$ and small thickness $\Delta a$ is the difference of two
balls, so its moment of inertia and mass are approximately the derivatives times
$\Delta a$:

$$\frac{\Delta I}{\Delta m} \approx \frac{dI/da}{dm/da} = \frac{8\pi\delta a^4/3}{4\pi\delta a^2} = \frac23a^2.$$

So a thin spherical shell has $I = \tfrac23ma^2$. (The same idea gives a thin cylindrical
shell or hoop $I = ma^2$: all its mass is at distance $a$.)

| Uniform solid, axis through the center | $I$ |
|---|---|
| Thin hoop or thin cylindrical shell, about its axis | $ma^2$ |
| Solid cylinder or disk, about its axis | $\tfrac12ma^2$ |
| Solid ball, about a diameter | $\tfrac25ma^2$ |
| Thin spherical shell, about a diameter | $\tfrac23ma^2$ |
| Solid cone, about its axis | $\tfrac{3}{10}ma^2$ |
| Box with sides $b$, $c$ across the axis | $\tfrac{1}{12}m(b^2 + c^2)$ |

## The parallel axis theorem

Tables give $I$ about an axis through the center of mass. To move to any parallel axis,
use the parallel axis theorem:

$$I = I_{\text{cm}} + md^2,$$

where $d$ is the distance between the two axes.

![A lumpy solid with its center of mass marked. A dashed axis passes through the center of mass, and a second dashed axis parallel to it lies a distance d away. A small mass element dm sits inside the solid, and the formula I = I_cm + m d² is shown.](images/mv-m6-parallel-axis.svg)

*Proof.* Choose coordinates with the center of mass at the origin and both axes parallel
to the $z$-axis, the new one through $(d, 0)$. The squared distance from $(x, y, z)$ to the
new axis is $(x - d)^2 + y^2 = x^2 + y^2 - 2dx + d^2$, so

$$I = \iiint_E(x^2 + y^2)\delta\,dV - 2d\iiint_E x\,\delta\,dV + d^2\iiint_E\delta\,dV = I_{\text{cm}} - 2d\,m\bar x + md^2.$$

Since the center of mass is at the origin, $\bar x = 0$ and the middle term vanishes. ∎

Two consequences: the axis through the center of mass gives the *smallest* $I$ among all
parallel axes, and the theorem only links an arbitrary axis to the center-of-mass axis. To
go between two axes that both miss the center of mass, pass through $I_{\text{cm}}$.

### Example 3: a ball turning about a tangent line

A uniform ball of mass $7$ kg and radius $0.11$ m pivots about a line tangent to its
surface. Then $d = a$ and

$$I = \tfrac25ma^2 + ma^2 = \tfrac75ma^2 = 1.4\cdot7\cdot0.0121 \approx 0.119\ \text{kg·m}^2,$$

three and a half times the $I_{\text{cm}} \approx 0.0339$ kg·m² about a diameter.

## The rolling race

An object **rolling without slipping** turns exactly as fast as it moves: its center has
speed $v = \omega R$, and the point touching the ramp is momentarily at rest. Write the
moment of inertia about the center as $I = \beta mR^2$, where $\beta$ is the number from the
table. Starting from rest and dropping a height $h$, energy is conserved (an idealization:
we ignore air drag and rolling resistance; friction is needed to make it roll, but it does no
work because the contact point does not slide):

$$mgh = \frac12mv^2 + \frac12I\omega^2 = \frac12mv^2 + \frac12\beta mR^2\frac{v^2}{R^2} = \frac12(1 + \beta)mv^2,$$

$$v = \sqrt{\frac{2gh}{1 + \beta}}.$$

Mass and radius cancel. Only the *shape*, through $\beta$, matters. Since this holds at every
height on the ramp, the acceleration along a ramp of angle $\alpha$ is the constant
$g\sin\alpha/(1 + \beta)$: smaller $\beta$ means faster at every instant, so the order of
finish is fixed by $\beta$ alone.

![Four identical ramps, each with one object released at the same moment: a solid ball with β = 2/5 is farthest down, then a solid cylinder with β = 1/2, then a thin spherical shell with β = 2/3, and a hoop with β = 1 is farthest behind.](images/mv-m6-rolling-race.svg)

### Example 4: speeds at the bottom

Each object rolls down a ramp that drops $h = 2$ m, with $g = 9.8$ m/s².

| Object | $\beta$ | $v = \sqrt{2gh/(1 + \beta)}$ |
|---|---|---|
| Solid ball | $\tfrac25$ | $\sqrt{39.2/1.4} \approx 5.29$ m/s |
| Solid cylinder | $\tfrac12$ | $\sqrt{39.2/1.5} \approx 5.11$ m/s |
| Thin spherical shell | $\tfrac23$ | $\sqrt{39.2/(5/3)} \approx 4.85$ m/s |
| Hoop | $1$ | $\sqrt{39.2/2} \approx 4.43$ m/s |

A block sliding down a frictionless ramp would reach $\sqrt{2gh} \approx 6.26$ m/s; a rolling
object is slower because some of its energy goes into spinning, and the hoop spends half of
it that way.

## What $I$ says about the inside of a planet

For a uniform ball, $I/(ma^2) = 0.4$. Astronomers measure the ratio $C/(MR^2)$ for planets
from their precession and gravity fields; this **moment of inertia factor** is about 0.331
for Earth. A value below 0.4 means mass is concentrated toward the center, here because of
the dense iron core.

### Example 5: a ball that is denser in the middle

Suppose the density falls linearly from $\delta_0$ at the center to 0 at the surface:
$\delta = \delta_0(1 - \rho/a)$. The density depends only on $\rho$, so the trick of Example 2
applies.

1. Mass: $m = \delta_0\cdot4\pi\displaystyle\int_0^a\left(\rho^2 - \frac{\rho^3}{a}\right)d\rho = 4\pi\delta_0\left(\frac{a^3}{3} - \frac{a^3}{4}\right) = \frac{\pi\delta_0a^3}{3}$. (The $4\pi$ is $\int_0^\pi\int_0^{2\pi}\sin\phi\,d\theta\,d\phi$.)
2. $I = \dfrac23\cdot4\pi\delta_0\displaystyle\int_0^a\left(\rho^4 - \frac{\rho^5}{a}\right)d\rho = \frac23\cdot4\pi\delta_0\cdot\frac{a^5}{30} = \frac{4\pi\delta_0a^5}{45}$.
3. $\dfrac{I}{ma^2} = \dfrac{4/45}{1/3} = \dfrac{4}{15} \approx 0.267$.

This model piles up more mass near the center than Earth does, so its factor is lower than
Earth's 0.331. Real planets are layered rather than linear, so this is a simplified model,
but it shows how a single measured number constrains what is inside.

## Common mistakes

- Using distance from the origin instead of distance from the axis: $I_z$ uses $x^2 + y^2$, not $x^2 + y^2 + z^2$.
- Forgetting the Jacobian ($r$ or $\rho^2\sin\phi$) on top of the $d^2$ in the integrand.
- Applying $I = I_{\text{cm}} + md^2$ between two axes when neither passes through the center of mass.
- Writing $md$ instead of $md^2$.
- Concluding that a heavier or bigger ball rolls down faster; for rolling without slipping only $\beta$ matters.

## Key points

- $I = \iiint_E d^2\,\delta\,dV$, with $d$ the distance from the axis; $KE_{\text{rot}} = \tfrac12I\omega^2$; radius of gyration $k = \sqrt{I/m}$.
- Solid cylinder $\tfrac12ma^2$, solid ball $\tfrac25ma^2$, thin spherical shell $\tfrac23ma^2$, hoop $ma^2$.
- For density depending only on $\rho$: $I_{\text{diameter}} = \tfrac23\iiint\rho^2\,\delta\,dV$.
- Parallel axis theorem: $I = I_{\text{cm}} + md^2$.
- Rolling without slipping from height $h$: $v = \sqrt{2gh/(1 + \beta)}$, independent of mass and radius.
