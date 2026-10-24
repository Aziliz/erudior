---
id: phys-rolling
module: phys-m5
title: Rolling and angular momentum
minutes: 40
topics: [Rolling motion, Angular momentum]
drills: [phys-rolling-incline, phys-angmom-skater]
refs: [phys-ref-mechanics]
---
## Two ideas that complete rotational mechanics

A wheel rolling down a road both translates and rotates, and the two motions are locked together. And a spinning skater who pulls in her arms speeds up without anyone pushing her. This lesson explains both: rolling without slipping, which combines the last two lessons, and angular momentum, whose conservation is as fundamental as that of linear momentum.

## Rolling without slipping

When a wheel of radius $R$ rolls without slipping, the point touching the ground is momentarily at rest (no skidding). In one revolution the center moves forward one circumference, $2\pi R$, so

$$v_{\text{cm}} = R\omega, \qquad a_{\text{cm}} = R\alpha.$$

The motion is a translation of the center plus a rotation about it. The top of the wheel moves at $v_{\text{cm}} + R\omega = 2v_{\text{cm}}$, the bottom at $v_{\text{cm}} - R\omega = 0$. That's why the top of a bicycle wheel's spokes look blurred in photos while the bottom ones look sharp.

![A wheel rolling to the right on the ground. The contact point at the bottom is at rest. The center moves right at speed v; the top moves right at 2v; the point at the front of the wheel, level with the center, moves at 1.41v slanting down and forward. A dashed line from the contact point to the tip of the top arrow shows that speed grows in proportion to distance from the contact point.](images/phys-m5-rolling-velocities.svg)

At any instant the wheel moves as if it were turning about the contact point: each point's velocity is perpendicular to the line joining it to the contact point, and its speed is $\omega$ times its distance from that point. The front point is $\sqrt2R$ from the contact point, so it moves at $\sqrt2v \approx 1.41v$, slanting down.

The kinetic energy has both parts:

$$K = \tfrac12Mv_{\text{cm}}^2 + \tfrac12I_{\text{cm}}\omega^2.$$

Writing $I_{\text{cm}} = cMR^2$ (with $c = 1$ for a hoop, $\tfrac12$ for a disk, $\tfrac25$ for a solid sphere, $\tfrac23$ for a hollow sphere) and $\omega = v/R$:

$$K = \tfrac12(1 + c)Mv^2.$$

## Rolling down an incline

Release a rolling object from rest at height $h$. Static friction at the contact point makes it roll, but does no work, because the contact point doesn't move. So mechanical energy is conserved:

$$Mgh = \tfrac12(1 + c)Mv^2 \quad\Rightarrow\quad v = \sqrt{\frac{2gh}{1 + c}}.$$

Mass and radius cancel; only the shape factor $c$ matters. Objects with mass concentrated near the center (small $c$) win a race: solid sphere ($c = 0.4$) beats solid cylinder ($0.5$) beats hollow sphere ($0.667$) beats hoop ($1$). A frictionless sliding block ($c = 0$, no rotation) beats them all, because none of its energy is tied up in spinning.

The acceleration down a slope of angle $\theta$ follows the same pattern: $a = \dfrac{g\sin\theta}{1 + c}$.

### Example 1

A solid ball and a hoop are released from rest at the top of a ramp 1.5 m high. Find each one's speed at the bottom.

Ball: $v = \sqrt{\dfrac{2(9.8)(1.5)}{1.4}} = \sqrt{21.0} = 4.58$ m/s.

Hoop: $v = \sqrt{\dfrac{2(9.8)(1.5)}{2}} = \sqrt{14.7} = 3.83$ m/s.

The ball arrives first. The hoop puts half its kinetic energy into rotation; the ball only $\tfrac{0.4}{1.4} = 29\%$.

## Angular momentum

The rotational analog of momentum is **angular momentum**. For a rigid object rotating about a fixed axis,

$$L = I\omega$$

(kg·m²/s). For a single particle moving past a point, $L = mvr_\perp$, where $r_\perp$ is the perpendicular distance from the point to the particle's line of motion: even a particle moving in a straight line has angular momentum about a point not on that line.

Just as net force changes linear momentum, net torque changes angular momentum:

$$\sum\tau = \frac{\Delta L}{\Delta t}.$$

## Conservation of angular momentum

If the net external torque on a system is zero, its angular momentum is constant:

$$I_i\omega_i = I_f\omega_f.$$

This is **conservation of angular momentum**. The striking consequence: if a system changes shape and its moment of inertia changes, its rotation rate adjusts in the opposite direction. A skater pulling in her arms reduces $I$, so $\omega$ increases. A diver tucks to spin faster and opens out to slow down before entering the water. A collapsing star can shrink to a neutron star spinning hundreds of times per second.

Which conservation law to use depends on what acts on the system:

```mermaid
flowchart TD
  accTitle: Which quantities are conserved in a rotation problem
  accDescr: If the net external torque about the axis is not zero, angular momentum changes, and the change equals torque times time. If the net external torque is zero, angular momentum is conserved. In either case, separately ask whether anything converts mechanical energy: if parts slide against each other, stick together, or muscles or a motor do work, kinetic energy is not conserved; otherwise, as in rolling without slipping with no losses, mechanical energy is conserved.
  A{"Net external torque about the axis zero?"} -- no --> B["L changes: change in L = torque times time"]
  A -- yes --> C["L conserved: I1 omega1 = I2 omega2"]
  B --> D{"Sliding, sticking, or muscles or a motor doing work?"}
  C --> D
  D -- yes --> E["Kinetic energy NOT conserved"]
  D -- no --> F["Mechanical energy conserved"]
```

### Example 2

A skater spins at 2.0 rev/s with her arms out, where $I = 4.5$ kg·m². She pulls her arms in, reducing $I$ to 1.8 kg·m². (a) What is her new spin rate? (b) What happens to her kinetic energy?

(a) $\omega_f = \dfrac{I_i}{I_f}\omega_i = \dfrac{4.5}{1.8}(2.0) = 5.0$ rev/s. (Units of $\omega$ cancel in the ratio, so rev/s is fine here.)

(b) In rad/s, $\omega_i = 12.57$ and $\omega_f = 31.42$. $K_i = \tfrac12(4.5)(12.57)^2 = 355$ J; $K_f = \tfrac12(1.8)(31.42)^2 = 888$ J. Kinetic energy increases by a factor of 2.5: her arm muscles do work pulling the mass inward. Angular momentum is conserved, kinetic energy is not.

### Example 3: a rotational collision

A 2.0 kg disk spins at 30 rad/s on a frictionless axle; $I_1 = 0.040$ kg·m². A second, non-rotating disk with $I_2 = 0.060$ kg·m² is dropped onto it and they spin together. Find the final angular speed.

No external torque about the axle: $I_1\omega_1 = (I_1 + I_2)\omega_f$, so $\omega_f = \dfrac{0.040(30)}{0.100} = 12$ rad/s. Like a perfectly inelastic collision, kinetic energy drops (from 18 J to 7.2 J), lost to friction between the disks.

## Angular momentum as a vector

Like torque, angular momentum has a direction along the rotation axis, given by the right-hand rule: curl your fingers with the rotation and your thumb points along $\vec L$. A wheel spinning counterclockwise as seen from above has $\vec L$ pointing up.

Torque changes angular momentum the way force changes momentum: over a short time, $\Delta\vec L = \vec\tau\,\Delta t$. A torque along $\vec L$ speeds the spin up; a torque opposite to it slows the spin. A torque *perpendicular* to $\vec L$ changes its direction rather than its size, just as a force perpendicular to the velocity (in circular motion) changes the direction of motion but not the speed.

That explains the **gyroscope**. A spinning top tilted from vertical has $\vec L$ along its axis. Gravity's torque about the pivot is horizontal, perpendicular to $\vec L$. So instead of falling over, the axis slowly swings around the vertical, a motion called **precession**. The faster the spin (the larger $L$), the smaller the fractional change each torque makes, and the slower the precession.

Kepler's second law (equal areas in equal times, coming up in the gravitation lesson) is also angular momentum conservation: gravity points toward the Sun, so its torque about the Sun is zero and the planet's angular momentum $mvr_\perp$ stays constant. Close to the Sun, $r_\perp$ is small, so $v$ must be large.

## Common mistakes

- Forgetting rotational kinetic energy for rolling objects (getting $\sqrt{2gh}$).
- Thinking static friction does work on a rolling object.
- Assuming kinetic energy is conserved when angular momentum is.
- Using rev/s in an energy formula (fine in a ratio, not in $\tfrac12I\omega^2$).

## Key points

- Rolling without slipping: $v = R\omega$; $K = \tfrac12Mv^2 + \tfrac12I\omega^2 = \tfrac12(1 + c)Mv^2$.
- Down an incline from rest: $v = \sqrt{2gh/(1 + c)}$; smaller $c$ wins.
- $L = I\omega$ (or $mvr_\perp$ for a particle); $\sum\tau = \Delta L/\Delta t$, direction by the right-hand rule.
- No external torque: $I_i\omega_i = I_f\omega_f$.
