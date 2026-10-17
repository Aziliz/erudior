---
id: phys-momentum
module: phys-m4
title: Momentum, impulse, and center of mass
minutes: 40
topics: [Momentum and impulse, Center of mass]
drills: [phys-impulse, phys-recoil, phys-com]
refs: [phys-ref-mechanics]
---
## Why we need momentum

Energy handles forces acting over distances. But in a car crash, a bat hitting a ball, or a rocket firing, huge forces act for short and complicated times, and energy is often lost to heat and deformation. Momentum is the tool for these situations. It is conserved even when mechanical energy isn't, and it leads naturally to the center of mass, the point that moves as if the whole system's mass were concentrated there.

## Linear momentum

The **momentum** (linear momentum) of an object is

$$\vec p = m\vec v,$$

a vector in the direction of the velocity, with units kg·m/s. A slow truck and a fast bullet can have similar momenta. Unlike kinetic energy, momentum has a direction, so two objects moving in opposite directions can have a total momentum of zero.

Momentum and kinetic energy are related: $K = \dfrac{p^2}{2m}$. For equal momenta, the lighter object has more kinetic energy.

## Impulse

Newton's second law in momentum form is $\vec F_{\text{net}} = \Delta\vec p/\Delta t$. Multiply through by $\Delta t$:

$$\vec J = \vec F_{\text{avg}}\,\Delta t = \Delta\vec p.$$

The product of force and time is the **impulse** $\vec J$, and it equals the change in momentum (the **impulse–momentum theorem**). Its units, N·s, are the same as kg·m/s.

The theorem explains a lot of safety engineering. To stop a moving object you must deliver a fixed impulse, $\Delta p$. Spreading it over a longer time reduces the average force: air bags, crumple zones, bending your knees when you land, and a catcher's padded glove all increase $\Delta t$. Conversely, a golf club or a hammer works because a large force acts over a very short time.

### Example 1

A 0.145 kg baseball arrives at 40 m/s and leaves the bat at 50 m/s in the opposite direction. The contact lasts 1.2 ms. Find the impulse and the average force.

Take the outgoing direction as positive: $v_i = -40$ m/s, $v_f = +50$ m/s.

$\Delta p = 0.145(50 - (-40)) = 0.145(90) = 13.05$ kg·m/s.

$F_{\text{avg}} = \dfrac{13.05}{1.2\times10^{-3}} = 1.09\times10^4$ N, roughly the weight of a small car, for about a millisecond. Forgetting the reversal of direction (using $50 - 40$) would underestimate the impulse by a factor of 9.

## Conservation of momentum

Consider a system of objects. Forces between objects inside the system (internal forces) come in third-law pairs, equal and opposite, so their impulses cancel. Only external forces can change the system's total momentum. If the net external force is zero,

$$\vec p_{\text{total, initial}} = \vec p_{\text{total, final}}.$$

This is **conservation of momentum**. It holds for each component separately: if external forces are only vertical (gravity and normal forces), horizontal momentum is still conserved. It also holds approximately during brief collisions and explosions even when external forces exist, because the internal forces are so much larger for that short time.

### Example 2: recoil

A 70 kg skater standing on frictionless ice throws a 5.0 kg ball forward at 12 m/s. How fast does she recoil?

Initially everything is at rest: total momentum 0. Afterward: $5.0(12) + 70v = 0$, so $v = -0.857$ m/s. She glides backward at 0.86 m/s. Kinetic energy was not conserved (it increased from 0, supplied by her muscles), but momentum was.

The same physics drives a rifle's recoil and a rocket: expelled gas carries momentum backward, so the rocket gains momentum forward. A rocket doesn't need anything to push against.

## Center of mass

For a system of particles, the **center of mass** (CM) is the mass-weighted average position:

$$x_{\text{cm}} = \frac{m_1x_1 + m_2x_2 + \cdots}{m_1 + m_2 + \cdots} = \frac{\sum m_ix_i}{M},$$

and likewise for $y_{\text{cm}}$ and $z_{\text{cm}}$. For a symmetric uniform object (a sphere, rod or plate), the CM is at the geometric center. The CM can lie outside the material, as in a ring or a boomerang.

### Example 3

Masses of 2.0 kg at $(0, 0)$, 3.0 kg at $(4, 0)$ and 5.0 kg at $(0, 2)$ (meters). Find the center of mass.

$M = 10$ kg. $x_{\text{cm}} = \dfrac{2(0) + 3(4) + 5(0)}{10} = 1.2$ m; $y_{\text{cm}} = \dfrac{2(0) + 3(0) + 5(2)}{10} = 1.0$ m. The CM is at $(1.2, 1.0)$ m, pulled toward the heavier masses.

*Motion of the center of mass.* Differentiating the definition gives $M\vec v_{\text{cm}} = \sum m_i\vec v_i = \vec p_{\text{total}}$, and differentiating again,

$$\vec F_{\text{net, ext}} = M\vec a_{\text{cm}}.$$

So the CM of any system moves like a single particle of mass $M$ acted on by the external forces alone, no matter how the parts move. When a firework shell explodes in midair, the fragments fly apart but their CM continues along the original parabola (until fragments hit the ground). With no external force, $\vec v_{\text{cm}}$ is constant: that's conservation of momentum in another form.

### Example 4

A 60 kg person stands at one end of a 120 kg, 4.0 m raft at rest on still water (no friction with the water). She walks to the other end. How far does the raft move?

No external horizontal forces, and the system starts at rest, so the CM stays put. If she moves 4.0 m relative to the raft and the raft moves $d$ backward, her ground displacement is $4.0 - d$. Setting the CM displacement to zero: $60(4.0 - d) - 120d = 0$, so $d = 240/180 = 1.33$ m.

## Time-varying forces and continuous objects

The general second law is $\vec F_{\text{net}} = d\vec p/dt$, and the impulse of a time-varying force is an integral:

$$\vec J = \int_{t_1}^{t_2}\vec F(t)\,dt = \Delta\vec p,$$

the area under the force–time curve. The average force is the constant force with the same area over the same time.

For a continuous object, the CM sums become integrals over mass elements $dm$:

$$x_{\text{cm}} = \frac{1}{M}\int x\,dm.$$

For a rod of length $L$ along $x$ with linear density $\lambda(x)$ (kg/m), $dm = \lambda\,dx$. A uniform rod gives $x_{\text{cm}} = L/2$, as expected. A rod with $\lambda = cx$ (denser toward one end) gives $M = \int_0^L cx\,dx = cL^2/2$ and $\int_0^L x\,cx\,dx = cL^3/3$, so $x_{\text{cm}} = \dfrac{2L}{3}$: shifted toward the heavy end.

### Example 5

A kick delivers a force $F(t) = (4.0\times10^{7})\,t\,(0.010 - t)$ N to a 0.45 kg ball at rest, for $0 \le t \le 0.010$ s. Find the impulse, the ball's speed, and the peak and average forces.

$$J = \int_0^{0.010} (4.0\times10^{7})(0.010\,t - t^2)\,dt = (4.0\times10^{7})\left[\frac{0.010\,t^2}{2} - \frac{t^3}{3}\right]_0^{0.010} = (4.0\times10^{7})(1.667\times10^{-7}) = 6.67\text{ N·s}.$$

The ball leaves at $v = J/m = 6.67/0.45 = 14.8$ m/s. The force peaks at the midpoint, $t = 0.005$ s: $F_{\max} = (4.0\times10^{7})(0.005)(0.005) = 1000$ N. The average force is $J/\Delta t = 667$ N, two-thirds of the peak, as expected for a parabolic pulse.

## Rockets: momentum with changing mass

A rocket is the standard example of a system that loses mass as it moves. Far from any planet (no external force), let the rocket have mass $m$ and velocity $v$, and let it eject exhaust backward at speed $u$ *relative to the rocket*. In a time $dt$ its mass changes by $dm$ (negative) and the exhaust carries away mass $-dm$ moving at $v - u$. Conserving momentum, $mv = (m + dm)(v + dv) + (-dm)(v - u)$, and dropping the tiny product $dm\,dv$ leaves $m\,dv = -u\,dm$. Separating variables and integrating from the initial mass $m_i$ to the final mass $m_f$:

$$\Delta v = u\ln\frac{m_i}{m_f}.$$

This is the rocket equation. The push on the rocket, the thrust, is $u\,|dm/dt|$. Because the gain grows only with the logarithm of the mass ratio, a rocket with $u = 3.0$ km/s that burns 80% of its mass ($m_i/m_f = 5$) gains only $3.0\ln 5 = 4.8$ km/s, which is why orbital rockets drop empty stages.

## Common mistakes

- Ignoring direction: momentum and impulse are vectors, and a rebound reverses the sign of $v$.
- Assuming kinetic energy is conserved whenever momentum is.
- Applying momentum conservation when a large external force acts over the time considered.
- Weighting CM positions by distance instead of by mass.

## Key points

- $\vec p = m\vec v$; impulse $\vec J = \vec F_{\text{avg}}\Delta t = \Delta\vec p$ (in general $\int\vec F\,dt$).
- With no net external force, total momentum is conserved, component by component.
- $x_{\text{cm}} = \sum m_ix_i/M$ (or $\tfrac1M\int x\,dm$); $\vec F_{\text{ext}} = M\vec a_{\text{cm}}$.
- Longer stopping time means smaller average force for the same $\Delta p$.
