---
id: phys-m5-h-rolling-dynamics
module: phys-m5
title: 'Honors: Rolling with friction, angular impulse and precession'
minutes: 45
honors: true
topics: [Rolling dynamics, Angular impulse, Precession]
drills: [phys-m5-r2-roll-friction, phys-m5-r2-bowling, phys-m5-r2-precession]
refs: [phys-ref-mechanics]
---
## Beyond energy shortcuts

The rolling lesson found the speed of a ball at the bottom of a ramp with energy alone, and it explained the skater and the gyroscope with angular momentum. Energy and conservation laws are quick, but they hide the forces. This lesson opens them up. First we find the friction force that makes an object roll and ask when it isn't enough. Then we follow a bowling ball that starts out skidding and watch friction turn sliding into rolling. Next comes the angular version of impulse, which explains the "sweet spot" of a bat. Finally we put a number on how fast a gyroscope precesses.

Everything here uses the tools of the core lessons: $\sum F = ma$ for the center of mass, $\sum\tau = I\alpha$ about the center of mass, and $L = I\omega$ or $mvr_\perp$.

## The friction that makes a ball roll

Put a ball on a frictionless ramp and it slides without turning: gravity acts at its center and the normal force points straight at its center, so neither has a torque about the center. Something must twist the ball to start it spinning, and that something is **static friction** at the contact point, pointing up the slope.

Write $I_{\text{cm}} = cMR^2$ as before. For an object rolling down a slope of angle $\theta$:

- Along the slope (down positive): $Mg\sin\theta - f = Ma$.
- Torque about the center: only friction has a lever arm, so $fR = I_{\text{cm}}\alpha = cMR^2\alpha$.
- No slipping: $a = R\alpha$, so the torque equation becomes $f = cMa$.

Substituting $f = cMa$ into the first equation gives $Mg\sin\theta = (1 + c)Ma$, so

$$a = \frac{g\sin\theta}{1 + c}, \qquad f = \frac{c}{1 + c}\,Mg\sin\theta.$$

The acceleration matches the core lesson's energy result, which is a good check. What's new is $f$: the friction needed grows with $c$, so a hoop needs more grip than a solid ball.

Static friction can't exceed $\mu_sn = \mu_sMg\cos\theta$. Rolling without slipping is possible only if $\dfrac{c}{1 + c}Mg\sin\theta \le \mu_sMg\cos\theta$, that is,

$$\mu_s \ge \frac{c}{1 + c}\tan\theta.$$

On a steeper or slicker slope, the object rolls *and* slips: kinetic friction acts, the contact point skids, and the energy method with $v = R\omega$ no longer applies.

### Example 1: will it roll?

A 4.0 kg solid cylinder is released on a $30^\circ$ ramp. (a) Find its acceleration and the friction force if it rolls without slipping. (b) What is the smallest coefficient of static friction that allows this? (c) Would a hoop on the same ramp roll if $\mu_s = 0.25$?

(a) $c = \tfrac12$: $a = \dfrac{9.8\sin 30^\circ}{1.5} = 3.27$ m/s², and $f = \tfrac{0.5}{1.5}(4.0)(9.8)\sin 30^\circ = 6.53$ N, up the slope.

(b) $\mu_s \ge \tfrac{0.5}{1.5}\tan 30^\circ = 0.192$. (Check: $n = 4.0(9.8)\cos 30^\circ = 33.9$ N and $6.53/33.9 = 0.192$.)

(c) For a hoop, $c = 1$: it needs $\mu_s \ge \tfrac12\tan 30^\circ = 0.289$. With only 0.25 available, the hoop slips while it rolls.

Notice that the friction does no work as long as there's no slipping: the contact point is momentarily at rest, so the force acts through zero displacement. It doesn't remove energy; it only moves some of it into rotation.

## From skidding to rolling: the bowling ball

A bowler releases a ball sliding fast with almost no spin. At first the bottom of the ball skids along the lane, so **kinetic friction** acts backward at the contact point. That one force does two jobs at once:

- it slows the center: $a = -\mu_kg$ (with $n = Mg$ on a level lane);
- its torque about the center spins the ball up: $\mu_kMgR = cMR^2\alpha$, so $\alpha = \dfrac{\mu_kg}{cR}$.

The speed $v$ falls while $R\omega$ rises. When they meet, $v = R\omega$, the contact point stops skidding, kinetic friction switches off, and the ball rolls on at constant speed (ignoring the small rolling resistance).

```plot
{"x": [0, 3.5], "y": [0, 9], "xLabel": "time t (s)", "yLabel": "speed (m/s)", "functions": [{"f": "8 - 0.98*x", "from": 0, "to": 2.3324}, {"f": "2.45*x", "from": 0, "to": 2.3324}, {"f": "5.714", "from": 2.3324, "to": 3.5}], "points": [{"at": [2.3324, 5.714], "label": "rolling starts"}], "labels": [{"at": [0.9, 7.85], "text": "v (center)"}, {"at": [0.85, 3.4], "text": "Rω"}], "caption": "A bowling ball released at 8.0 m/s with no spin (μk = 0.10): the center slows while Rω grows; once they are equal the ball rolls at 5.71 m/s"}
```

For a solid sphere ($c = \tfrac25$), setting $v_0 - \mu_kgt = R\alpha t = \tfrac52\mu_kgt$ gives the time to start rolling and the final speed:

$$t_1 = \frac{2v_0}{7\mu_kg}, \qquad v_1 = v_0 - \mu_kgt_1 = \tfrac57v_0.$$

### A shortcut with angular momentum

The final speed came out independent of $\mu_k$, which hints at a conservation law. Measure angular momentum about a fixed point $P$ on the lane's surface. Friction acts along the lane, on a line through $P$, so its torque about $P$ is zero. Gravity and the normal force are equal and opposite and both act on the vertical line through the ball's center, so their torques cancel. With zero net torque about $P$, angular momentum about $P$ is conserved.

To add up that angular momentum, use a result we state without proof: the angular momentum of a body about a point equals the angular momentum of its center of mass moving past the point, $Mv r_\perp$, plus its spin about its own center, $I_{\text{cm}}\omega$. The center is at height $R$ above the lane, so $r_\perp = R$:

$$L_P = MvR + I_{\text{cm}}\omega.$$

At release, $\omega = 0$, so $L_P = Mv_0R$. Once rolling, $\omega = v_1/R$, so $L_P = Mv_1R + cMRv_1 = (1 + c)Mv_1R$. Setting them equal:

$$v_1 = \frac{v_0}{1 + c}.$$

For a solid sphere this is $\tfrac{v_0}{1.4} = \tfrac57v_0$, matching the force method. Kinetic energy is *not* conserved: the final energy is $\tfrac12(1 + c)Mv_1^2 = \dfrac{1}{1 + c}\cdot\tfrac12Mv_0^2$, so a fraction $\dfrac{c}{1 + c}$ (2/7 for a sphere) turns into heat while the ball skids.

### Example 2: down the lane

A 7.0 kg bowling ball is released at 8.0 m/s with no spin; $\mu_k = 0.10$. How long does it skid, how far does it travel while skidding, and how much energy is lost?

$t_1 = \dfrac{2(8.0)}{7(0.10)(9.8)} = 2.33$ s. Distance: $\Delta x = v_0t_1 - \tfrac12\mu_kgt_1^2 = 8.0(2.33) - \tfrac12(0.98)(2.33)^2 = 16.0$ m. Final speed $\tfrac57(8.0) = 5.71$ m/s.

Energy: $K_0 = \tfrac12(7.0)(8.0)^2 = 224$ J; after, $K_1 = \tfrac12(1.4)(7.0)(5.71)^2 = 160$ J. The 64 J lost is $\tfrac27$ of 224 J. A regulation lane is about 18 m long, so the ball skids for most of it; real bowlers add spin and use oiled lanes to control where the ball starts to grip and hook.

## Angular impulse and the sweet spot

Just as a force acting for a time gives an impulse $J = F\Delta t = \Delta p$, a torque acting for a time gives an **angular impulse**:

$$\tau\Delta t = \Delta L.$$

For a sharp blow, such as a bat hitting a ball, the forces are huge and brief and we can't measure them, but the impulse $J$ they deliver is enough. A blow of impulse $J$ with lever arm $b$ about a fixed pivot delivers angular impulse $Jb$.

Hang a uniform rod of mass $M$ and length $L$ from a frictionless pivot at its top end, and strike it horizontally with impulse $J$ at distance $b$ below the pivot. The pivot may also push on the rod during the blow with some impulse $J_p$. Two equations:

- Angular impulse about the pivot ($J_p$ has no lever arm there): $Jb = I_p\omega = \tfrac13ML^2\omega$.
- Linear impulse: $J + J_p = Mv_{\text{cm}} = M\omega\tfrac L2$.

The pivot feels no jolt ($J_p = 0$) when $J = \tfrac12ML\omega$. Putting that into the first equation gives $\tfrac12ML\omega\,b = \tfrac13ML^2\omega$, so

$$b = \tfrac23L.$$

This point is the rod's **center of percussion**. Strike there and the pivot (your hands, if the rod is a bat) feels no sideways sting. Strike higher or lower and the pivot must push back or forward. The same idea locates the "sweet spot" of bats, rackets and hammers, though real bats are not uniform rods, and players also care about vibration, so "sweet spot" has more than one definition.

### Example 3: hitting the middle instead

A 0.60 kg uniform rod 1.2 m long hangs from a pivot at its top. It is struck horizontally at its midpoint with an impulse of 3.0 N·s. Find its angular speed just after the blow and the impulse from the pivot.

$I_p = \tfrac13(0.60)(1.2)^2 = 0.288$ kg·m². Angular impulse: $\omega = \dfrac{Jb}{I_p} = \dfrac{3.0(0.60)}{0.288} = 6.25$ rad/s.

Center of mass: $v_{\text{cm}} = \omega\tfrac L2 = 6.25(0.60) = 3.75$ m/s, so $Mv_{\text{cm}} = 2.25$ N·s. Then $J_p = 2.25 - 3.0 = -0.75$ N·s: the pivot has to pull back on the rod with 0.75 N·s, because the middle is above the center of percussion (0.80 m).

## How fast does a gyroscope precess?

The core lesson explained precession in words: a torque perpendicular to $\vec L$ turns $\vec L$ instead of growing it. Now for the rate.

![A bicycle wheel spinning on a horizontal axle whose far end rests on a pivot post. The wheel's weight acts downward at its center, a distance r from the pivot. The spin angular momentum L points along the axle, away from the pivot; the torque of gravity about the pivot is horizontal, perpendicular to L; the axle swings around the post in the direction of the torque.](images/phys-m5-gyroscope.svg)

Take a wheel spinning fast with angular momentum $L = I\omega$ along a horizontal axle, one end of which rests on a pivot. The wheel's center is a distance $r$ from the pivot. Gravity's torque about the pivot has size $\tau = Mgr$ and points horizontally, perpendicular to the axle. In a short time $\Delta t$ it adds $\Delta L = \tau\Delta t$ sideways to $\vec L$. A small sideways addition doesn't change the length of $\vec L$; it rotates it through a small angle $\Delta\phi = \Delta L/L$. The axle follows $\vec L$ around, so the **precession angular speed** is

$$\Omega = \frac{\Delta\phi}{\Delta t} = \frac{\tau}{L} = \frac{Mgr}{I\omega}.$$

Faster spin means slower precession, exactly as the core lesson said. This simple formula is a *simplification*: it assumes the spin is fast ($\Omega$ much smaller than $\omega$), ignores the small extra angular momentum of the precession itself, and ignores the slight bobbing (nutation) a released gyroscope shows at first.

### Example 4: a bicycle-wheel gyroscope

A 2.0 kg bicycle wheel of radius 0.33 m (treat it as a hoop) spins at 5.0 rev/s. Its axle is horizontal and supported at one end, with the wheel's center 0.15 m from the support. Find the precession rate.

$I = MR^2 = 2.0(0.33)^2 = 0.218$ kg·m². $\omega = 2\pi(5.0) = 31.4$ rad/s, so $L = 0.218(31.4) = 6.84$ kg·m²/s. $\tau = 2.0(9.8)(0.15) = 2.94$ N·m.

$\Omega = \dfrac{2.94}{6.84} = 0.43$ rad/s, one trip around the support every $2\pi/0.43 = 14.6$ s. Here $\Omega$ is about 1.4% of $\omega$, so the fast-spin assumption holds. As friction slows the wheel, $L$ falls and the precession speeds up, until the simple picture fails and the wheel droops.

## Common mistakes

- Pointing static friction down the slope for a ball rolling downhill. It points up the slope: it is what spins the ball up.
- Using $v = R\omega$ while the object is still skidding. It holds only once rolling without slipping is reached.
- Assuming the friction needed is always $\mu_sn$. Static friction is only as large as rolling requires, $\tfrac{c}{1 + c}Mg\sin\theta$, up to that maximum.
- Taking angular momentum about the ball's center in the bowling problem. Friction has a torque about the center; it has none about a point on the lane.
- Expecting the gyroscope to precess faster when it spins faster. $\Omega = \tau/L$: more spin, slower precession.

## Key points

- Rolling down a slope: $f = \dfrac{c}{1 + c}Mg\sin\theta$ (up the slope); rolling without slipping needs $\mu_s \ge \dfrac{c}{1 + c}\tan\theta$.
- A skidding ball: kinetic friction slows $v$ and raises $R\omega$ until $v = R\omega$; final speed $v_0/(1 + c)$, from conservation of angular momentum about a point on the ground.
- Angular impulse: $\tau\Delta t = \Delta L$. A uniform rod pivoted at one end has its center of percussion at $\tfrac23L$.
- Precession rate $\Omega = \tau/L = Mgr/(I\omega)$, valid for fast spin.
