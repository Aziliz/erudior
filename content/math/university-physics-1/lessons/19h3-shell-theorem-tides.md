---
id: phys-m5-h-tides
module: phys-m5
title: 'The shell theorem, gravity inside a planet, and tides'
minutes: 50
honors: true
topics: [Tides and the shell theorem]
drills: [phys-m5-r2-inside-planet, phys-m5-r2-tidal]
refs: [phys-ref-mechanics, phys-ref-constants]
---
## Gravity from bodies that aren't points

The gravitation lesson used $F = GMm/r^2$ for planets as if each were a point at its center, and stated without proof that a spherical shell exerts no force on anything inside it. This lesson proves those statements, uses them to find gravity inside a planet (and how long a fall through a tunnel to the far side would take), and then looks at what happens when the size of a body *does* matter: the stretching that raises the ocean tides, slows Earth's spin, and can tear a moon apart.

## Gravitational potential

Forces from many pieces of mass add as vectors, which is awkward. Potential energies add as plain numbers, which is easy. So work with the **gravitational potential** $V$, the potential energy per unit mass of a test particle:

$$V = \frac{U}{m}, \qquad V = -\frac{GM}{r}\text{ for a point mass } M.$$

The gravitational field (the acceleration $g$ a test particle feels) follows from $V$ exactly as force follows from potential energy: its component along $r$ is $g_r = -dV/dr$.

## Proving the shell theorem

Take a thin uniform spherical shell of mass $M$ and radius $R$, and a point $P$ a distance $r$ from its center. Slice the shell into rings centered on the line from the center to $P$. The ring at polar angle $\theta$ has radius $R\sin\theta$ and width $R\,d\theta$; its share of the shell's area $4\pi R^2$ is $2\pi R^2\sin\theta\,d\theta$, so its mass is

$$dM = \frac{M}{2}\sin\theta\,d\theta.$$

Every bit of that ring is the same distance $s$ from $P$, with $s^2 = r^2 + R^2 - 2rR\cos\theta$ by the law of cosines.

![A circle representing a spherical shell of radius R with center O. A point P lies outside on a horizontal line through O at distance r. A thin ring on the shell at polar angle theta from the line OP is drawn as a vertical chord, and the distance s from P to the ring is marked.](images/phys-m5-shell-ring.svg)

Differentiating at fixed $r$ and $R$: $2s\,ds = 2rR\sin\theta\,d\theta$, so $\sin\theta\,d\theta = \dfrac{s\,ds}{rR}$. The ring's contribution to the potential at $P$ is

$$dV = -\frac{G\,dM}{s} = -\frac{GM}{2s}\cdot\frac{s\,ds}{rR} = -\frac{GM}{2rR}\,ds.$$

The $s$ cancels, so the integral is just the range of $s$ times a constant.

- *$P$ outside* ($r > R$): $s$ runs from $r - R$ to $r + R$, a range of $2R$. So $V = -\dfrac{GM}{2rR}(2R) = -\dfrac{GM}{r}$, exactly the potential of a point mass at the center.
- *$P$ inside* ($r < R$): $s$ runs from $R - r$ to $R + r$, a range of $2r$. So $V = -\dfrac{GM}{2rR}(2r) = -\dfrac{GM}{R}$, the same everywhere inside. A constant potential has zero slope, so $g = 0$: no net force anywhere inside the shell.

That is the **shell theorem**. A solid sphere whose density depends only on $r$ is a set of nested shells, so outside it acts like a point mass. Newton proved the result geometrically in the *Principia* (1687), and it was the step that justified treating planets as points.

## Gravity inside a planet

At a distance $r$ from the center of a planet, the shells outside $r$ exert no net force, and the mass inside $r$ acts as if it were at the center: $g(r) = GM(r)/r^2$. For a uniform planet $M(r) = M r^3/R^3$, so

$$g(r) = \frac{GM}{R^3}\,r = g_s\frac{r}{R} \quad (r \le R),$$

rising linearly from zero at the center to the surface value $g_s$, then falling off as $1/r^2$ outside.

```plot
{"x": [0, 3], "y": [0, 1.15], "xLabel": "r / R", "yLabel": "g / g_s", "functions": [{"f": "x", "from": 0, "to": 1, "label": "inside: g ∝ r"}, {"f": "1/x^2", "from": 1, "to": 3, "label": "outside: g ∝ 1/r²"}], "points": [{"at": [1, 1], "label": "surface"}], "caption": "Gravity of a uniform planet: linear inside, inverse-square outside"}
```

*Simplified model.* Earth is not uniform: its iron core is much denser than its rocky mantle. Going down, you leave relatively light rock above you while staying close to the dense core, so real $g$ actually *increases* with depth through the mantle, to about 10.7 m/s² near the boundary between the mantle and the outer core (roughly 2,900 km down), before falling to zero at the center.

### Example 1: falling through the Earth

Imagine a straight tunnel through the center of a uniform Earth, with no air and no friction (and ignoring Earth's rotation). A ball is dropped in at the surface. Describe its motion.

At position $x$ from the center (positive on one side, negative on the other), the acceleration points toward the center with size $g_sx/R$:

$$\frac{d^2x}{dt^2} = -\frac{g_s}{R}\,x.$$

This is the equation of simple harmonic motion, met again in the oscillations module. You can check that $x = R\cos(\omega t)$ solves it: two derivatives give $-\omega^2R\cos(\omega t) = -\omega^2x$, which matches if $\omega = \sqrt{g_s/R}$. The ball oscillates from one end of the tunnel to the other with period

$$T = 2\pi\sqrt{\frac{R}{g_s}} = 2\pi\sqrt{\frac{6.37\times10^6}{9.8}} = 5.07\times10^3\text{ s} = 84.4\text{ min}.$$

The trip to the far side takes half of that, 42 minutes, and the ball passes the center at $\omega R = \sqrt{g_sR} = 7.9$ km/s. Those numbers are no coincidence: 84 minutes is the period of an orbit skimming the surface, and 7.9 km/s its speed, because $\sqrt{GM/R} = \sqrt{g_sR}$. (Any straight frictionless tunnel between two surface points, not just one through the center, takes the same 42 minutes.)

## Tidal forces

Now let size matter. The Moon pulls on every part of Earth, but not equally: the near side is closer, so it is pulled harder than Earth's center, and the far side less hard. Earth as a whole falls toward the Moon (more precisely, Earth and Moon orbit their common center of mass) with the acceleration of its center. What remains, the *difference* between the pull at a point and the pull at the center, is the **tidal force**.

Along the Earth–Moon line, a point a distance $d$ closer to the Moon than Earth's center feels an extra acceleration toward the Moon. With $a(D) = GM/D^2$ at distance $D$,

$$\Delta a \approx -\frac{da}{dD}\,d = \frac{2GM}{D^3}\,d.$$

The far side, at $D + d$, is pulled less than the center, so relative to the center it is pushed *away* from the Moon by the same amount. Points at right angles to the line are pulled slightly toward Earth's center, by $GMd/D^3$, because the Moon's pull there slants inward. The ocean is stretched into two bulges, one facing the Moon and one facing away, and squeezed around the middle.

![Earth with the Moon far to the right. Small arrows show the tidal acceleration at points around Earth: outward toward the Moon on the near side, outward away from the Moon on the far side, and inward at the top and bottom. A dashed oval shows the ocean stretched into two bulges along the Earth-Moon line.](images/phys-m5-tides.svg)

As Earth turns under the bulges, a coast passes through two high tides and two low tides in a little over a day (24 h 50 min, because the Moon moves along its orbit in the meantime), so high tides come about every 12 h 25 min.

*Simplified model.* This "equilibrium tide" explains why there are two bulges and roughly two tides a day. Real tides also depend on the shapes and resonances of ocean basins: tidal ranges vary from almost nothing in parts of the Mediterranean to more than 15 m in Canada's Bay of Fundy, and high tide is generally not when the Moon is overhead.

### Example 2: the Moon versus the Sun

Compare the tidal accelerations at Earth's surface from the Moon ($M = 7.35\times10^{22}$ kg, $D = 3.84\times10^8$ m) and the Sun ($M = 1.99\times10^{30}$ kg, $D = 1.496\times10^{11}$ m), with $d = R_E = 6.37\times10^6$ m.

Moon: $\dfrac{2(6.67\times10^{-11})(7.35\times10^{22})(6.37\times10^6)}{(3.84\times10^8)^3} = 1.10\times10^{-6}$ m/s².

Sun: $\dfrac{2(6.67\times10^{-11})(1.99\times10^{30})(6.37\times10^6)}{(1.496\times10^{11})^3} = 5.05\times10^{-7}$ m/s².

The Sun's *direct* pull on Earth ($GM/D^2 = 5.9\times10^{-3}$ m/s²) is about 180 times the Moon's, yet its tidal effect is only 0.46 times as large, because tides go as $1/D^3$, not $1/D^2$. When Sun, Earth and Moon line up (new and full moon), the effects add: **spring tides**, with tidal acceleration $1.6\times10^{-6}$ m/s². At first and third quarter they act at right angles and partly cancel: **neap tides**, about $0.6\times10^{-6}$ m/s². (Check: the exact difference between the Moon's pull at the near side and at the center is $1.13\times10^{-6}$ m/s², within 3% of the approximation.)

## Tidal friction and tidal locking

Earth spins faster (once a day) than the Moon orbits (once a month), and friction drags the tidal bulges slightly ahead of the Earth–Moon line. The Moon's pull on the leading bulge exerts a torque that slows Earth's spin, so the day very slowly lengthens. Angular momentum is conserved for the Earth–Moon system, so what Earth's spin loses, the Moon's orbit gains: the Moon spirals outward. Laser pulses bounced off reflectors left by Apollo astronauts show it receding by about 3.8 cm per year.

The same process, acting on the Moon long ago, braked its spin until its rotation matched its orbit. It now keeps the same face toward Earth: it is in **tidal locking**. Many moons in the solar system are tidally locked to their planets.

## The Roche limit

Tidal stretching can win against a body's own gravity. Consider a small moon of radius $r$ and mass $m$ held together only by gravity (a "rubble pile"), at a distance $D$ from a planet of mass $M$. A loose rock on the moon's near side is held by $Gm/r^2$ and pulled off by the tidal acceleration $2GMr/D^3$. It comes off when

$$\frac{2GMr}{D^3} > \frac{Gm}{r^2} \quad\Leftrightarrow\quad D < r\left(\frac{2M}{m}\right)^{1/3} = R_p\left(\frac{2\rho_p}{\rho_m}\right)^{1/3},$$

using $M/m = \rho_pR_p^3/(\rho_mr^3)$ for a planet of radius $R_p$ and density $\rho_p$ and a moon of density $\rho_m$. This distance is the **Roche limit**, after Édouard Roche, who in 1849 calculated it for a fluid moon. Our estimate ignores the moon's own rotation and its stretching into an egg shape; Roche's fluid calculation gives a larger coefficient, $D \approx 2.44R_p(\rho_p/\rho_m)^{1/3}$, instead of our $1.26R_p(\rho_p/\rho_m)^{1/3}$. Solid moons with real strength can survive inside it.

### Example 3: how close could the Moon come?

With $\rho_E = 5510$ kg/m³ and $\rho_M = 3340$ kg/m³, our rigid estimate gives $D = 6371\text{ km}\times(2\times5510/3340)^{1/3} = 6371(1.49) = 9500$ km, and the fluid formula gives $2.44(6371)(5510/3340)^{1/3} = 18\,400$ km. The real Moon, at 384,000 km, is far outside both. Saturn's main rings, by contrast, lie largely inside Saturn's Roche limit, where loose material cannot gather into a moon, and in 1992 Jupiter's tides broke comet Shoemaker–Levy 9 into a string of fragments that struck the planet in 1994.

## Common mistakes

- Thinking gravity is strongest at the center of a planet. It is zero there.
- Thinking the far-side bulge means the Moon pushes the ocean away. It is pulled less than Earth's center; the bulge is relative to the center.
- Using $1/D^2$ for tidal effects. Tidal acceleration goes as $2GMd/D^3$, which is why the nearby Moon beats the massive Sun.
- Applying the shell theorem to a non-spherical body or a shell of uneven density.
- Treating the uniform-Earth $g(r)$ as how real gravity varies with depth.

## Key points

- Shell theorem: outside a uniform shell, $V = -GM/r$ (like a point mass); inside, $V = -GM/R$ is constant, so $g = 0$.
- Uniform planet: $g = g_s r/R$ inside. A tunnel through it gives simple harmonic motion with $T = 2\pi\sqrt{R/g_s} = 84$ min.
- Tidal acceleration $\approx 2GMd/D^3$ along the line, $GMd/D^3$ inward across it: two bulges.
- Moon's tidal effect is about 2.2 times the Sun's; aligned they give spring tides, at right angles neap tides.
- Tidal friction slows Earth's spin and moves the Moon outward (about 3.8 cm/yr); tidal locking; Roche limit $\approx R_p(2\rho_p/\rho_m)^{1/3}$ (rigid estimate) to $2.44R_p(\rho_p/\rho_m)^{1/3}$ (fluid).
