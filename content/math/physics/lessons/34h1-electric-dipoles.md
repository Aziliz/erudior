---
id: phys-m8-h-dipoles
module: phys-m8
title: 'Honors: Electric dipoles and polar molecules'
minutes: 45
honors: true
topics: [Electric dipoles]
drills: [phys-m8-r2-dipole-torque, phys-m8-r2-dipole-axis]
refs: [phys-ref-em-modern]
---
## Why a neutral object can still feel a field

Lesson 31 met the electric dipole, a $+q$ and a $-q$ a small distance apart, and found its field at the midpoint. Lesson 30 explained why a charged balloon picks up neutral paper: the paper polarizes. Both ideas lead to the same object. A huge amount of nature is made of things with zero net charge whose positive and negative charges sit in slightly different places: water molecules, the molecules of a capacitor's dielectric, a bit of paper near a comb. This lesson treats the dipole as a single object with its own "strength", and works out how it turns in a field, how much energy that takes, what field it makes far away, and why water is such a remarkable liquid.

## The dipole moment

Two charges $+q$ and $-q$ separated by a distance $d$ have zero net charge, so in a uniform field the forces on them cancel. What they do have is a **dipole moment**, a vector

$$\vec p = q\vec d,$$

where $\vec d$ points from the negative charge to the positive charge. Its magnitude is $p = qd$, in coulomb-meters (C·m). Notice the direction convention: $\vec p$ points from $-$ to $+$, opposite to the way the field *between* the two charges points.

For molecules, chemists often use the debye: $1\text{ D} \approx 3.34\times10^{-30}$ C·m. A water molecule has $p \approx 1.85$ D $\approx 6.2\times10^{-30}$ C·m. That's what you'd get from one electron's worth of charge shifted by about 0.04 nm, a tenth of the molecule's size: water's oxygen pulls the shared electrons toward itself, and the bent shape keeps the two O–H contributions from cancelling. A molecule like this, with a permanent dipole moment, is a **polar molecule**. Carbon dioxide, which is straight (O=C=O), has two bond dipoles that cancel exactly, so it's nonpolar.

## Torque and energy in a uniform field

Put a dipole in a uniform field $\vec E$ with its moment at angle $\theta$ to the field.

![A dipole in a uniform field pointing right. The positive charge is pushed right by a force qE and the negative charge left by an equal force qE; the dipole moment p makes angle θ with the field.](images/phys-m8-dipole-torque.svg)

The positive charge is pushed along $\vec E$ with force $qE$ and the negative charge the opposite way with the same force. The net force is zero, but the two forces don't act along the same line, so they form a couple that twists the dipole toward the field. Each force has lever arm $\tfrac d2\sin\theta$ about the center, and both turn the same way, so

$$\tau = 2\left(qE\cdot\tfrac d2\sin\theta\right) = pE\sin\theta.$$

The torque is largest at $90^\circ$ and zero when $\vec p$ is parallel or antiparallel to $\vec E$.

Turning the dipole against this torque stores energy. Measuring potential energy from the perpendicular position, the result is

$$U = -pE\cos\theta.$$

You can check the aligned case from the charges themselves. Start with the dipole sideways, both charges on the equipotential through its center. Turning it to $\theta = 0$ moves the positive charge $\tfrac d2$ downstream along the field, where the potential is lower by $\tfrac12Ed$, so its energy changes by $-\tfrac12qEd$. The negative charge moves $\tfrac d2$ upstream, where the potential is higher by $\tfrac12Ed$, so its energy changes by $(-q)(+\tfrac12Ed) = -\tfrac12qEd$ too. The total is $-qEd = -pE$, as the formula says.

So $U$ is lowest, $-pE$, when $\vec p$ points along the field (stable equilibrium: twist it slightly and the torque brings it back) and highest, $+pE$, when it points against the field (unstable: the slightest nudge and it flips over). Turning a dipole from aligned to anti-aligned takes work $2pE$.

The same pattern, $\tau = (\text{moment})(\text{field})\sin\theta$ and $U = -(\text{moment})(\text{field})\cos\theta$, holds for the magnetic dipoles (current loops and compass needles) you'll meet in module 10.

### Example 1

Charges of $\pm2.0$ nC sit 4.0 mm apart in a uniform field of $5.0\times10^4$ N/C, with the dipole moment at $30^\circ$ to the field. Find (a) $p$, (b) the torque, (c) the potential energy, (d) the work needed to turn it from aligned to anti-aligned.

(a) $p = qd = (2.0\times10^{-9})(4.0\times10^{-3}) = 8.0\times10^{-12}$ C·m.

(b) $\tau = pE\sin30^\circ = (8.0\times10^{-12})(5.0\times10^4)(0.50) = 2.0\times10^{-7}$ N·m, turning $\vec p$ toward $\vec E$.

(c) $U = -pE\cos30^\circ = -(4.0\times10^{-7})(0.866) = -3.5\times10^{-7}$ J.

(d) $W = U(180^\circ) - U(0^\circ) = pE - (-pE) = 2pE = 8.0\times10^{-7}$ J.

## The field far from a dipole

Far from a dipole, the fields of $+q$ and $-q$ nearly cancel, because the two charges are almost the same distance away. What's left falls off faster than a single charge's field. On the dipole's axis, at distance $r$ from its center (the $+$ charge being the nearer one),

$$E = kq\left[\frac1{(r - d/2)^2} - \frac1{(r + d/2)^2}\right].$$

Putting the bracket over a common denominator gives $\dfrac{2rd}{(r^2 - d^2/4)^2}$. When $r \gg d$, the $d^2/4$ is negligible next to $r^2$, and

$$E_{\text{axis}} \approx \frac{2kp}{r^3}.$$

On the perpendicular bisector the far field is half as big and points opposite to $\vec p$: $E \approx kp/r^3$. The key fact is the $1/r^3$: double your distance from a dipole and its field drops to one-eighth, not one-quarter. That's why neutral molecules interact only at short range.

### Example 2

A dipole has $\pm1.0$ nC charges 2.0 mm apart. Find the field on its axis 2.0 cm from its center, exactly and with the far-field formula.

Exact: $E = (8.99\times10^9)(1.0\times10^{-9})\left[\dfrac1{(0.019)^2} - \dfrac1{(0.021)^2}\right] = 8.99\,(2770.1 - 2267.6) = 4.52\times10^3$ N/C.

Approximate: $p = 2.0\times10^{-12}$ C·m, $E \approx \dfrac{2(8.99\times10^9)(2.0\times10^{-12})}{(0.020)^3} = 4.50\times10^3$ N/C.

At ten times the separation the approximation is already within 0.5%. (At $r = 5d$ it's off by about 2%.)

## Polar molecules and temperature

If an external field twists polar molecules into line, why isn't every glass of water fully lined up with Earth's fair-weather field? Because the molecules are jostled by thermal motion, with typical energies around $k_BT$, where $k_B = 1.38\times10^{-23}$ J/K is Boltzmann's constant (from lesson 27) and $T$ is the temperature.

### Example 3

A water molecule ($p = 6.2\times10^{-30}$ C·m) is in a strong field of $1.0\times10^6$ N/C. Compare the energy to flip it, $2pE$, with the thermal energy $k_BT$ at 300 K.

$2pE = 2(6.2\times10^{-30})(1.0\times10^6) = 1.2\times10^{-23}$ J. $k_BT = (1.38\times10^{-23})(300) = 4.1\times10^{-21}$ J.

The thermal energy is about 300 times bigger. Even a field close to the breakdown field of air barely biases the random orientations: on average the molecules are only very slightly more likely to point along the field than against it. That small bias, multiplied over about $3\times10^{28}$ molecules per cubic meter, is still enough to give water its large dielectric constant (about 80). Heating a polar liquid scrambles the molecules more, so its dielectric constant goes down with temperature, which is what is measured.

## Induced dipoles and nonuniform fields

Nonpolar molecules and neutral conductors have no dipole moment until a field creates one. The field pushes positive and negative charge slightly apart, giving an **induced dipole** that, for modest fields, is proportional to the field: $p = \alpha E$, where $\alpha$, the *polarizability*, measures how easily the charge clouds shift.

In a uniform field a dipole feels only a torque. In a *nonuniform* field the two ends feel different forces, and an aligned dipole is pulled toward the region of stronger field. That is the full explanation of the balloon and the paper: the balloon's field induces a dipole in the paper, pointing along the field, and the field is stronger nearer the balloon, so the near end's attraction beats the far end's repulsion. It doesn't matter whether the balloon is positive or negative; the induced dipole always lines up so that the result is attraction.

A scaling argument shows how fast this falls off near a point charge (a proportional estimate, not a full calculation): the charge's field goes as $1/r^2$, so the induced $p$ does too; the force on a dipole depends on how quickly the field changes across it, roughly $E/r \propto 1/r^3$; so the force goes as $p \times 1/r^3 \propto 1/r^5$. Move a charged comb to twice the distance and its pull on a scrap of paper drops by a factor of about 32, which is why the paper has to be close before it jumps.

## Dielectrics, revisited

Lesson 34 said that a dielectric raises capacitance because its molecules "polarize in the field". Now the picture is complete. In a polar dielectric, permanent dipoles turn partly into line; in a nonpolar one, induced dipoles form. Either way, inside the material each dipole's $-$ end faces the positive plate and its $+$ end the negative plate. In the bulk the neighboring ends cancel, but at the two faces of the slab a thin layer of uncancelled **bound charge** is left: negative next to the positive plate, positive next to the negative plate. This bound charge partly cancels the plates' field, so the field inside drops from $E_0$ to $E_0/\kappa$, and for a fixed plate charge the voltage drops by the same factor.

A microwave oven uses the turning of water molecules. Its field oscillates about 2.45 billion times a second; the water dipoles keep trying to follow it, and collisions with their neighbors turn that motion into heat. (A common claim is that 2.45 GHz is a resonance of water. It isn't: water absorbs well over a broad range of microwave frequencies, and 2.45 GHz is a frequency set aside by regulators that also lets the waves reach a few centimeters into food.)

## Common mistakes

- Pointing $\vec p$ from $+$ to $-$. It points from the negative charge to the positive one.
- Saying a dipole in a uniform field accelerates. The net force is zero; only the torque is not.
- Mixing up the stable and unstable positions: $U = -pE$ (aligned) is the minimum.
- Using $1/r^2$ for a dipole's far field. It falls off as $1/r^3$, and the far-field formula only works for $r \gg d$.
- Forgetting that the force on an induced dipole is always toward the stronger field, whatever the sign of the source.

## Key points

- Dipole moment $\vec p = q\vec d$, from $-$ to $+$, in C·m; water $p \approx 6.2\times10^{-30}$ C·m.
- Uniform field: zero net force, torque $\tau = pE\sin\theta$, energy $U = -pE\cos\theta$; aligned is stable, flipping takes $2pE$.
- Far field: $2kp/r^3$ on the axis, $kp/r^3$ on the bisector.
- Thermal motion keeps polar molecules only slightly aligned, yet their alignment gives large dielectric constants.
- In a nonuniform field a dipole is pulled toward stronger field; induced dipoles explain why neutral objects are attracted to charges of either sign.
- Bound charge at a dielectric's faces cuts the field inside by the factor $\kappa$.
