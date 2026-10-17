---
id: phys-dipoles
module: phys-m8
title: Electric dipoles
minutes: 40
topics: [Electric dipoles]
drills: [phys-dipole-axis, phys-dipole-torque]
refs: [phys-ref-em-modern, phys-ref-constants]
---
## Two charges that nearly cancel

The electric field lesson met a pair of equal and opposite charges close together, an **electric dipole**. Dipoles deserve a lesson of their own because they are everywhere. A water molecule is a dipole: its oxygen end carries a little extra negative charge and its hydrogen end a little positive. Neutral atoms become dipoles when a field pulls their electron clouds sideways. Antennas, microwave ovens and the dielectrics in the next lesson all depend on how dipoles respond to fields. This lesson uses the field and potential tools from the earlier lessons to find a dipole's own field, and then the torque and potential energy it has in someone else's field.

## The dipole moment

Take charges $+q$ and $-q$ a distance $d$ apart. The net charge is zero, so from far away the two fields almost cancel. What survives depends on the product of the charge and the separation, the **electric dipole moment**

$$\vec p = q\vec d, \qquad p = qd,$$

where $\vec d$ points from the negative charge to the positive charge. Its unit is the coulomb-meter (C·m). Two dipoles with the same $p$ look identical from far away even if one has twice the charge at half the spacing, which is why $p$, not $q$ or $d$ alone, is the quantity that matters.

Molecular dipole moments are tiny: water has $p = 6.2\times10^{-30}$ C·m, about what you would get from one electron charge shifted by 0.04 nm. Molecules with a built-in moment, like water, are called **polar molecules**. Others, like $\text{N}_2$ or $\text{CO}_2$, have no permanent moment but acquire an **induced dipole** when a field stretches them, with $p$ proportional to the field.

## The field on the axis

Put the dipole along the $x$-axis with its center at the origin, $+q$ at $x = d/2$ and $-q$ at $x = -d/2$. At a point on the axis at distance $x$ beyond the positive charge, both fields lie along the axis. The positive charge is closer, so its outward push wins:

$$E = \frac{kq}{(x - d/2)^2} - \frac{kq}{(x + d/2)^2} = \frac{2kqxd}{(x^2 - d^2/4)^2}.$$

(Put the two fractions over a common denominator: the numerator is $(x + d/2)^2 - (x - d/2)^2 = 2xd$.) Far away, where $x \gg d$, the $d^2/4$ is negligible and

$$E_{\text{axis}} \approx \frac{2kp}{x^3},$$

pointing along $\vec p$. On the perpendicular bisector, a similar calculation gives $E \approx kp/y^3$, half as large and pointing *opposite* to $\vec p$.

The important feature is the $1/r^3$. A lone charge's field falls as $1/r^2$; a dipole's falls one power faster because the two charges' fields cancel more and more completely with distance. Doubling the distance from a dipole cuts its field by a factor of 8.

```plot
{"x": [0.5, 4], "y": [0, 3.2], "functions": [{"f": "1/(x-0.5)^2 - 1/(x+0.5)^2"}, {"f": "2/x^3", "dashed": true}], "labels": [{"at": [1.2, 2.6], "text": "exact"}, {"at": [1.1, 0.7], "text": "2kp/x³"}], "xLabel": "x/d", "yLabel": "E (units of kq/d²)", "caption": "Field on a dipole's axis: the far-field formula 2kp/x³ is within about 2% once x reaches 5d"}
```

The potential tells the same story more simply. On the axis, $V = \dfrac{kq}{x - d/2} - \dfrac{kq}{x + d/2} = \dfrac{kqd}{x^2 - d^2/4} \approx \dfrac{kp}{x^2}$, and $E_x = -\dfrac{dV}{dx} = \dfrac{2kp}{x^3}$, as before. Everywhere on the perpendicular bisector, $V = 0$: each point is equally far from the two charges.

### Example 1

A dipole is made of $\pm4.0$ nC charges 2.0 mm apart. Find its dipole moment and the field on its axis 5.0 cm from its center.

*Moment:* $p = qd = (4.0\times10^{-9})(2.0\times10^{-3}) = 8.0\times10^{-12}$ C·m.

*Far-field estimate:* $x = 0.050$ m is 25 times $d$, so use $E \approx \dfrac{2kp}{x^3} = \dfrac{2(8.99\times10^9)(8.0\times10^{-12})}{(0.050)^3} = 1.15\times10^3$ N/C, directed from the $-q$ end toward the $+q$ end.

*Check with the exact formula:* $E = (8.99\times10^9)(4.0\times10^{-9})\left[\dfrac{1}{(0.049)^2} - \dfrac{1}{(0.051)^2}\right] = 1.15\times10^3$ N/C. The two agree to better than 0.1%.

## Torque in a uniform field

Now place the dipole in a uniform external field $\vec E$, with $\vec p$ at angle $\theta$ to the field. The positive charge is pushed along $\vec E$ with force $qE$ and the negative charge the opposite way with the same force.

- *Net force:* zero. The two forces are equal and opposite, so a dipole in a *uniform* field does not accelerate.
- *Torque:* not zero. The forces act along different lines and form a couple. Each has lever arm $\tfrac{d}{2}\sin\theta$ about the center, and both turn the dipole the same way, so

$$\tau = 2\left(qE\cdot\frac d2\sin\theta\right) = pE\sin\theta, \qquad \vec\tau = \vec p\times\vec E.$$

The torque swings $\vec p$ toward $\vec E$, like a compass needle swinging toward north. It is largest when the dipole is perpendicular to the field and zero when the dipole is parallel or antiparallel.

```shape
{"segments": [{"from": [-3, 1.6], "to": [3, 1.6], "arrow": true, "label": "E"}, {"from": [-3, -1.6], "to": [3, -1.6], "arrow": true}, {"from": [-0.98, -0.69], "to": [0.98, 0.69], "arrow": true}, {"from": [0.98, 0.69], "to": [1.98, 0.69], "arrow": true, "label": "qE"}, {"from": [-0.98, -0.69], "to": [-1.98, -0.69], "arrow": true, "label": "−qE"}, {"from": [-1.4, 0], "to": [1.4, 0], "dashed": true}], "points": [{"at": [0.98, 0.69], "label": "+q"}, {"at": [-0.98, -0.69], "label": "−q"}], "labels": [{"at": [0.55, 0.12], "text": "θ"}, {"at": [-0.25, 0.12], "text": "p"}], "caption": "A dipole in a uniform field: equal and opposite forces give no net force but a torque pE sin θ toward alignment"}
```

## Potential energy of a dipole

Rotating a dipole against the torque takes work, so a dipole in a field has a potential energy that depends on its orientation. Turning it from $\theta$ to $\theta + d\theta$ against the torque takes $dW = pE\sin\theta\,d\theta$. Choosing $U = 0$ at $\theta = 90^\circ$ and integrating,

$$U = \int_{90^\circ}^{\theta} pE\sin\theta'\,d\theta' = -pE\cos\theta = -\vec p\cdot\vec E.$$

- Aligned ($\theta = 0$): $U = -pE$, the minimum. This is stable equilibrium.
- Antiparallel ($\theta = 180^\circ$): $U = +pE$, the maximum. This is unstable equilibrium: the slightest nudge and the dipole flips.
- The work the field does as the dipole turns from $\theta_1$ to $\theta_2$ is $U_1 - U_2 = pE(\cos\theta_2 - \cos\theta_1)$.

The same formulas, with $\vec\mu$ and $\vec B$ in place of $\vec p$ and $\vec E$, will describe a current loop in a magnetic field in the magnetic force lesson.

### Example 2

A dipole of moment $3.0\times10^{-9}$ C·m sits at $60^\circ$ to a uniform field of $4.0\times10^4$ N/C. Find the torque on it, its potential energy, and the work the field does as it swings into alignment.

*Torque:* $\tau = pE\sin\theta = (3.0\times10^{-9})(4.0\times10^4)\sin 60^\circ = 1.04\times10^{-4}$ N·m.

*Energy at $60^\circ$:* $U = -pE\cos 60^\circ = -(1.2\times10^{-4})(0.50) = -6.0\times10^{-5}$ J.

*Energy when aligned:* $U = -pE = -1.2\times10^{-4}$ J.

*Work by the field:* $U_{\text{initial}} - U_{\text{final}} = -6.0\times10^{-5} - (-1.2\times10^{-4}) = 6.0\times10^{-5}$ J. Without friction the dipole would overshoot and oscillate about the field direction, the way a pendulum swings through the bottom.

### Example 3

A water molecule ($p = 6.2\times10^{-30}$ C·m) sits in a strong field of $5.0\times10^5$ N/C. How much energy does it take to flip it from aligned to antiparallel, and how does that compare with typical thermal energy $k_BT$ at 300 K?

$\Delta U = (+pE) - (-pE) = 2pE = 2(6.2\times10^{-30})(5.0\times10^5) = 6.2\times10^{-24}$ J.

$k_BT = (1.38\times10^{-23})(300) = 4.1\times10^{-21}$ J, about 670 times larger. Collisions keep knocking the molecules around, so the field produces only a slight average preference for alignment. That slight preference is still enough to reduce the field inside water by a factor of about 80, as the next lesson shows.

## Dipoles in nonuniform fields

In a nonuniform field the two charges feel *different* forces, so there is a net force. An aligned dipole is pulled toward the region of stronger field: along the axis, $F = p\,\dfrac{dE}{dx}$. This explains why, as the first lesson noted, a charged balloon or comb picks up bits of paper. It induces dipoles in the paper, the dipoles align with its field, and because that field is stronger closer in, the paper is drawn toward it.

Microwave ovens use the torque instead. The oven's field reverses about five billion times a second; the water molecules keep trying to twist into line with it, jostle their neighbors, and the food heats up.

## Common mistakes

- Pointing $\vec p$ from $+$ to $-$. It points from the negative charge to the positive charge.
- Using $1/r^2$ for a dipole's field far away. It falls as $1/r^3$.
- Expecting a net force on a dipole in a uniform field. There is only a torque.
- Dropping the minus sign in $U = -pE\cos\theta$, which would make the aligned position the high-energy one.
- Using $\cos\theta$ for the torque or $\sin\theta$ for the energy.

## Key points

- Dipole moment $p = qd$, pointing from $-q$ to $+q$; unit C·m.
- Far field on the axis $E \approx 2kp/x^3$ (along $\vec p$); on the bisector $E \approx kp/y^3$ (opposite $\vec p$).
- In a uniform field: zero net force, torque $\vec\tau = \vec p\times\vec E$, $\tau = pE\sin\theta$.
- Potential energy $U = -\vec p\cdot\vec E = -pE\cos\theta$: minimum $-pE$ when aligned, maximum $+pE$ when antiparallel.
- In a nonuniform field, an aligned dipole is pulled toward the stronger field.
