---
id: phys-m5-h-gyroscopes
module: phys-m5
title: Gyroscopes, precession and unbalanced spin
minutes: 45
honors: true
topics: [Gyroscopes]
drills: [phys-m5-r2-precession, phys-m5-r2-imbalance]
refs: [phys-ref-mechanics]
---
## When torque turns the axis instead of tipping it

The rolling lesson ended with the vector law $\vec\tau_{\text{net}} = d\vec L/dt$ and a two-sentence account of why a spinning top doesn't fall over. This lesson takes that sentence seriously. Everything here follows from one fact: a torque changes angular momentum in the *direction of the torque*, and when the torque is perpendicular to $\vec L$, that change swings $\vec L$ around without making it any longer or shorter. We will derive the precession rate, see where the simple formula stops working, meet Earth's own 26,000-year precession, and then look at the other surprise of three-dimensional rotation: a body can spin about a fixed axle while its angular momentum points somewhere else.

## Deriving the precession rate

Take a gyroscope: a disk of moment of inertia $I$ spinning fast at $\omega$ on a light axle. One end of the axle rests on a pivot, the axle is horizontal, and the disk's center of mass is a distance $r$ from the pivot. Its spin angular momentum $L = I\omega$ points along the axle (right-hand rule).

Gravity acts at the center of mass. About the pivot its torque has size $\tau = Mgr$ and, by $\vec\tau = \vec r\times\vec F$, points horizontally, perpendicular to the axle. In a short time $dt$ the angular momentum changes by $d\vec L = \vec\tau\,dt$, a small sideways vector added to the tip of $\vec L$. The new $\vec L$ has the same length to first order but points in a slightly different horizontal direction, turned by the angle

$$d\phi = \frac{|d\vec L|}{L} = \frac{\tau\,dt}{L}.$$

The axle therefore swings around the vertical at the **precession** rate

$$\Omega = \frac{d\phi}{dt} = \frac{\tau}{L} = \frac{Mgr}{I\omega}.$$

![A gyroscope with its axle horizontal on a pivot. The spin angular momentum L points along the axle away from the pivot, the weight Mg acts down at the disk's center, the torque about the pivot points horizontally at right angles to the axle, and a curved arrow shows the axle precessing around the vertical.](images/phys-m5-gyroscope.svg)

If the axle is tilted at angle $\theta$ from the vertical instead of horizontal, the torque becomes $Mgr\sin\theta$ but only the horizontal part of $\vec L$, $L\sin\theta$, swings around, so the rate is the same: $\Omega = Mgr/(I\omega)$, independent of the tilt.

The direction follows from the right-hand rule. With the axle along $+x$ from a pivot at the origin and $\vec L$ along $+x$, gravity at $(r, 0, 0)$ gives $\vec\tau = r\hat\imath\times(-Mg\hat k) = +Mgr\,\hat\jmath$. The tip of $\vec L$ moves toward $+y$: the axle precesses counterclockwise as seen from above. Reverse the spin and the precession reverses.

### Example 1: a toy gyroscope

A toy gyroscope's rotor is a 0.15 kg uniform disk of radius 3.5 cm spinning at 3000 rpm. Its center is 4.0 cm from the pivot. Find the precession rate and period.

$I = \tfrac12(0.15)(0.035)^2 = 9.19\times10^{-5}$ kg·m². $\omega = 3000(2\pi/60) = 314$ rad/s, so $L = I\omega = 0.0289$ kg·m²/s.

$\tau = Mgr = 0.15(9.8)(0.040) = 0.0588$ N·m.

$\Omega = \tau/L = 0.0588/0.0289 = 2.04$ rad/s, a precession period of $2\pi/\Omega = 3.1$ s. As the rotor slows from friction, $L$ drops and the precession speeds up, which is the familiar sign of a toy top about to fall.

## Where the simple formula comes from (and when it fails)

The derivation treated $\vec L$ as pure spin, $I\omega$ along the axle. But a precessing gyroscope also turns slowly about the vertical, and that motion has angular momentum too. The formula is the **gyroscopic approximation**: it is accurate when the spin is much faster than the precession, $\omega \gg \Omega$. In Example 1, $\omega/\Omega \approx 150$, comfortably in that regime.

The approximation also hides how the precession starts. Release the gyroscope with its axle held still and it cannot instantly be precessing. At first it does begin to fall; the falling motion makes $\vec L$ start to swing; and the axle settles into precession while bobbing slightly up and down around the steady path. That bobbing is **nutation**. For a fast rotor the bobs are small and quick, and friction at the pivot soon damps them out. This picture is qualitative: the full motion of a top needs the equations of rigid-body dynamics, beyond this course.

Energy is consistent with this. Steady precession has a little extra kinetic energy (the slow turning about the vertical), and it comes from the small dip of the center of mass during the first moments after release.

## Earth is a gyroscope too

Earth spins once a day about an axis tilted $23.4^\circ$ from the perpendicular to its orbit, and its spin makes it bulge at the equator. The Sun and the Moon pull harder on the half of the bulge nearer to them, which produces a torque trying to line the equator up with the orbital plane. Exactly as with the top, the torque doesn't tip the axis; it makes it precess. Earth's axis sweeps out a cone about once every 26,000 years (about 25,800 years), a motion called **axial precession** or the precession of the equinoxes. The Greek astronomer Hipparchus discovered it around 130 BCE by comparing his star positions with older records.

Its effects are visible on human timescales. Polaris is close to the north celestial pole today but was not in ancient times, and roughly 12,000 years from now the pole will lie near the bright star Vega. The equinoxes also drift slowly westward against the stars, so the year of the seasons (equinox to equinox, the year our calendar follows) is about 20 minutes shorter than the time Earth takes to go once around the Sun measured against the stars.

## Angular momentum need not point along the axle

For a body spinning about a symmetry axis, $\vec L = I\vec\omega$ points along the axle. That is not true in general. Consider a light rod through its center on a vertical axle, with a small mass $m$ at each end, a distance $a$ from the center, but mounted crooked: the rod makes an angle $\beta$ with the axle instead of $90^\circ$.

![A vertical axle turning at angular velocity omega with a crooked dumbbell mounted on it: a rod through the axle's midpoint at angle beta to the axle, with a mass at each end. The angular momentum L points perpendicular to the rod, not along the axle, and so sweeps around a cone as the dumbbell turns.](images/phys-m5-dumbbell.svg)

Each mass moves in a circle of radius $a\sin\beta$ at speed $\omega a\sin\beta$. Its angular momentum about the center, $\vec r\times m\vec v$, has size $ma(\omega a\sin\beta)$ and points perpendicular to the rod, in the plane of the rod and the axle. Both masses give the same vector, so

$$L = 2ma^2\omega\sin\beta, \quad\text{perpendicular to the rod.}$$

Its component along the axle is $L\sin\beta = (2ma^2\sin^2\beta)\,\omega = I_{\text{axle}}\,\omega$, as expected. But it also has a sideways component $L_\perp = 2ma^2\omega\sin\beta\cos\beta$ that turns with the rod. A vector of fixed length $L_\perp$ rotating at rate $\omega$ changes at the rate $\omega L_\perp$, so the bearings must supply a torque

$$\tau = \omega L_\perp = 2ma^2\omega^2\sin\beta\cos\beta,$$

whose direction rotates with the shaft. It vanishes only for $\beta = 90^\circ$ (or $0$).

### Example 2: a crooked rotor

The masses are 0.10 kg each, $a = 0.15$ m, the rod is $10^\circ$ off perpendicular ($\beta = 80^\circ$) and the shaft turns at 50 rad/s. The bearings are 0.20 m apart. Find the torque they must supply and the force on each.

$L_\perp = 2(0.10)(0.15)^2(50)\sin 80^\circ\cos 80^\circ = 0.0385$ kg·m²/s.

$\tau = \omega L_\perp = 50(0.0385) = 1.92$ N·m. Two bearings 0.20 m apart supply it as a couple: $F = 1.92/0.20 = 9.6$ N each, in opposite directions, rotating with the shaft 8 times a second. That is a vibration, even though the center of mass sits exactly on the axle.

For every rigid body there are three perpendicular axes through the center of mass, its **principal axes**, about which $\vec L$ is parallel to $\vec\omega$; symmetry axes are always principal axes. A car tire is balanced in two senses: static balance puts the center of mass on the axle, and dynamic balance puts a principal axis along the axle. Spinning a tire on a balancing machine detects the rotating torque of Example 2, and small weights clipped to the rim cancel it.

### Example 3: flipping a spinning wheel

A student sits on a stool that turns freely; student and stool have $I = 3.0$ kg·m². She holds a bicycle wheel ($I_w = 0.12$ kg·m²) spinning at 20 rad/s with its axle vertical, angular momentum up. She turns the wheel upside down. What happens?

There is no external torque about the vertical axis, so vertical angular momentum is conserved. Before: $L = 0.12(20) = 2.4$ kg·m²/s up. After, the wheel contributes $2.4$ down, so student and stool must carry $4.8$ up:

$$\omega_{\text{student}} = \frac{4.8}{3.0} = 1.6\text{ rad/s}$$

in the wheel's original sense of rotation. Her hands exerted the torque that flipped the wheel; the wheel exerted the opposite torque on her.

## Gyroscopes at work, and one popular myth

Gyroscopes keep their direction in space unless a torque acts, which makes them useful for sensing and controlling orientation. Ships use gyrocompasses; the International Space Station turns itself using large spinning wheels called control moment gyroscopes, tilting them so the station gets the opposite change in angular momentum, without burning fuel.

A popular claim is that a bicycle stays up because its wheels are gyroscopes. That is *contested and mostly wrong as stated*. The wheels' spin does contribute to steering a moving bicycle, but in 2011 Kooijman and coworkers built a riderless bicycle with the wheels' spin angular momentum canceled by counter-rotating wheels, and it was still self-stable. Stability comes from several interacting design features, such as the steering geometry and how mass is placed on the front assembly.

## Common mistakes

- Expecting a torque to tip a spinning gyroscope in the direction of the force. The axle moves in the direction of the torque vector, at right angles to the force.
- Thinking a faster spin makes precession faster. $\Omega = \tau/(I\omega)$: faster spin, slower precession.
- Assuming $\vec L$ always points along the rotation axis. It does for symmetric bodies spinning about a symmetry axis, not in general.
- Using $\Omega = \tau/L$ when the spin is slow; it is the gyroscopic approximation and needs $\omega \gg \Omega$.

## Key points

- A torque perpendicular to $\vec L$ turns $\vec L$: precession at $\Omega = \tau/L = Mgr/(I\omega)$, independent of tilt.
- Direction: $d\vec L$ is along $\vec\tau$; reversing the spin reverses the precession.
- Release from rest gives nutation around steady precession; the simple formula needs $\omega \gg \Omega$.
- Earth's axis precesses in about 26,000 years because the Sun and Moon pull on its equatorial bulge.
- A crooked rotor has $\vec L$ off the axle; the bearings must supply $\tau = \omega L_\perp$, which rotates with the shaft. Principal axes have $\vec L \parallel \vec\omega$.
