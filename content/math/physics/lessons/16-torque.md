---
id: phys-torque
module: phys-m5
title: Torque and rotational dynamics
minutes: 40
topics: [Torque, Rotational dynamics]
drills: [phys-torque, phys-pulley-disk]
refs: [phys-ref-mechanics]
---
## What makes things rotate

Last lesson described rotation; now we ask what causes it. Push a door near its hinges and it barely moves; push at the handle with the same force and it swings easily. Push straight toward the hinges and nothing happens at all. The rotational effect of a force depends on where and in what direction it's applied, and that effect is called torque. With torque in hand, Newton's second law gets a rotational twin.

## Torque

The **torque** $\tau$ of a force about an axis is

$$\tau = rF\sin\theta,$$

where $r$ is the distance from the axis to the point where the force is applied and $\theta$ is the angle between $\vec r$ (pointing from the axis to that point) and $\vec F$. Units: N·m (not called joules, even though the units match, because torque isn't energy).

Two equivalent ways to see it:

- $F\sin\theta$ is the component of the force perpendicular to $\vec r$; only that component turns the object. So $\tau = rF_\perp$.
- $r\sin\theta$ is the perpendicular distance from the axis to the force's line of action, called the **lever arm** (moment arm) $\ell$. So $\tau = \ell F$.

A force aimed straight at or away from the axis ($\theta = 0$ or $180^\circ$) has zero torque. Torque has a sign: by convention, counterclockwise is positive and clockwise negative. A wrench with a longer handle gives more torque for the same push, which is the whole point of a wrench.

```shape
{"segments": [{"from": [0, 0], "to": [3, 0], "label": "r = 0.30 m"}, {"from": [3, 0], "to": [4, 1.732], "arrow": true, "label": "F"}, {"from": [3, 0], "to": [4.5, 0], "dashed": true}], "points": [{"at": [0, 0], "label": "axis"}], "labels": [{"at": [3.55, 0.25], "text": "60°"}], "caption": "Torque = rF sin θ: only the part of F perpendicular to the wrench turns the bolt"}
```

### Example 1

A mechanic pulls on a 0.30 m wrench with 80 N at $60^\circ$ to the handle. What torque does she apply? What if she pulls perpendicular to the handle?

$\tau = 0.30(80)\sin 60^\circ = 20.8$ N·m. Perpendicular: $\tau = 0.30(80) = 24$ N·m, the maximum for that force.

## Newton's second law for rotation

Consider a particle of mass $m$ on a light rod of length $r$, pushed by a force with tangential component $F_t$. Newton's second law tangentially: $F_t = ma_t = mr\alpha$. Multiply by $r$: $rF_t = mr^2\alpha$, i.e. $\tau = I\alpha$. Summing over all the particles of a rigid body (internal forces' torques cancel in pairs) gives

$$\sum\tau = I\alpha.$$

This is the rotational form of $\sum F = ma$: net torque causes angular acceleration, and the moment of inertia resists it. Like $\sum F = ma$, it's an equation you write for a chosen axis, with consistent sign conventions.

### Example 2

A 4.0 kg solid disk of radius 0.20 m is mounted on a frictionless axle. A string wrapped around its rim is pulled with a constant 6.0 N. Find the angular acceleration and the length of string unwound in 2.0 s, starting from rest.

$I = \tfrac12(4.0)(0.20)^2 = 0.080$ kg·m². $\tau = 0.20(6.0) = 1.2$ N·m. $\alpha = 1.2/0.080 = 15$ rad/s².

In 2.0 s: $\Delta\theta = \tfrac12(15)(2.0)^2 = 30$ rad, so string unwound $= r\Delta\theta = 0.20(30) = 6.0$ m.

## Pulleys with mass

Earlier we treated pulleys as massless, so the tension was the same on both sides. A real pulley has a moment of inertia, and to give it angular acceleration the tensions on its two sides must differ. Solve these problems by combining $\sum F = ma$ for each hanging or sliding object with $\sum\tau = I\alpha$ for the pulley, linked by the no-slip condition $a = R\alpha$.

### Example 3

A 2.0 kg bucket hangs from a rope wrapped around a 3.0 kg solid-cylinder windlass of radius 0.10 m that turns without friction. The bucket is released. Find its acceleration and the rope tension.

Bucket (down positive): $mg - T = ma$.

Cylinder: $TR = I\alpha = \tfrac12MR^2\cdot\dfrac{a}{R}$, so $T = \tfrac12Ma$.

Substitute: $mg - \tfrac12Ma = ma$, so

$$a = \frac{mg}{m + \tfrac12M} = \frac{2.0(9.8)}{2.0 + 1.5} = 5.6\text{ m/s}^2.$$

$T = \tfrac12(3.0)(5.6) = 8.4$ N, less than the bucket's 19.6 N weight. The cylinder acts like an extra $\tfrac12M$ of inertia that the bucket must also accelerate. As $M\to 0$, $a\to g$.

The same method handles an Atwood machine with a massive pulley: $a = \dfrac{(m_1 - m_2)g}{m_1 + m_2 + I/R^2}$.

## Work and power in rotation

A torque acting through an angle does work, $W = \tau\Delta\theta$ (for constant torque), and the rotational work–energy theorem says $W_{\text{net}} = \Delta\left(\tfrac12I\omega^2\right)$. Power is $P = \tau\omega$, the rotational version of $Fv$. A car engine's power curve comes from its torque and rpm: 300 N·m at 4000 rpm ($419$ rad/s) is 126 kW.

### Example 4

The windlass in Example 3 starts from rest. Using energy, find the bucket's speed after falling 1.5 m.

Gravity's lost potential energy goes into the bucket's translational and the cylinder's rotational kinetic energy, with $\omega = v/R$:

$$mgh = \tfrac12mv^2 + \tfrac12\left(\tfrac12MR^2\right)\left(\frac{v}{R}\right)^2 = \tfrac12\left(m + \tfrac12M\right)v^2.$$

$2.0(9.8)(1.5) = 29.4 = \tfrac12(3.5)v^2$, so $v = 4.10$ m/s. Check with kinematics: $v = \sqrt{2(5.6)(1.5)} = 4.10$ m/s ✓.

## With calculus: torque as a vector

In three dimensions torque is a cross product:

$$\vec\tau = \vec r\times\vec F,$$

with magnitude $rF\sin\theta$ and direction along the rotation axis by the right-hand rule (curl your fingers in the sense of rotation; your thumb gives $\vec\tau$). Counterclockwise rotation in the $xy$ plane corresponds to $\vec\tau$ along $+\hat k$, which is where the "counterclockwise is positive" convention comes from. In components, $\tau_z = xF_y - yF_x$.

For a rigid body rotating about a fixed axis, $\tau = I\,\dfrac{d\omega}{dt}$, and if the torque varies with time, $\omega(t) = \omega_0 + \dfrac1I\int\tau\,dt$. Work by a variable torque is $W = \int\tau\,d\theta$.

For instance, a force $\vec F = (3\hat\imath + 4\hat\jmath)$ N applied at $\vec r = (2\hat\imath + 1\hat\jmath)$ m gives $\tau_z = 2(4) - 1(3) = 5$ N·m, counterclockwise.

## Common mistakes

- Using the distance along the object instead of the perpendicular lever arm when the force is at an angle.
- Using the same tension on both sides of a pulley that has mass.
- Mixing sign conventions between the linear and rotational equations (choose them so $a = R\alpha$ with both positive).
- Forgetting rotational kinetic energy in energy problems with spinning parts.

## Key points

- $\tau = rF\sin\theta = rF_\perp = \ell F$; counterclockwise positive; $\vec\tau = \vec r\times\vec F$.
- $\sum\tau = I\alpha$ (rotational second law).
- Massive pulley: combine $\sum F = ma$, $\sum\tau = I\alpha$ and $a = R\alpha$.
- $W = \tau\Delta\theta$, $P = \tau\omega$; include $\tfrac12I\omega^2$ in energy conservation.
