---
id: phys-mag-force
module: phys-m10
title: Magnetic forces
minutes: 40
topics: [Magnetic force]
drills: [phys-charge-in-b, phys-wire-force, phys-mass-spec]
refs: [phys-ref-em-modern]
---
## A force that depends on motion

Magnets were known long before electricity was understood, but the two turned out to be deeply linked: magnetic fields act on moving charges, and moving charges create magnetic fields. This lesson covers the first half: what a magnetic field does to a moving charge and to a current-carrying wire. Motors, loudspeakers, mass spectrometers, particle accelerators and the aurora all follow from one force law.

## Magnetic fields

A bar magnet has a north and a south pole; like poles repel and unlike attract. Unlike electric charges, magnetic poles always come in pairs: cut a magnet in half and you get two smaller magnets, each with both poles. No isolated "magnetic monopole" has ever been found.

The **magnetic field** $\vec B$ is drawn with field lines that leave north poles and enter south poles, forming closed loops. Earth is a giant magnet whose field points roughly north at the surface (Earth's geographic north is near a magnetic *south* pole, which attracts compass needles' north ends). The SI unit of $\vec B$ is the **tesla** (T). Earth's field is about $5\times10^{-5}$ T; a refrigerator magnet about 0.01 T; an MRI scanner 1.5–3 T.

## Force on a moving charge

A charge $q$ moving with velocity $\vec v$ through a magnetic field $\vec B$ feels a force of magnitude

$$F = |q|vB\sin\theta,$$

where $\theta$ is the angle between $\vec v$ and $\vec B$. Three features make this force unlike any we've met:

- It is zero for a charge at rest, and zero for motion parallel to the field.
- It is perpendicular to both $\vec v$ and $\vec B$.
- Because it's perpendicular to the velocity, it does no work: it changes the direction of motion, never the speed.

*Direction (right-hand rule).* Point the fingers of your right hand along $\vec v$, curl them toward $\vec B$; your thumb points along the force on a *positive* charge. For a negative charge, the force is opposite. In vector form this is the cross product $\vec F = q\vec v\times\vec B$, and the unit tesla is defined from it: $1\text{ T} = 1$ N/(A·m).

In diagrams, a field pointing into the page is drawn as × marks (the tail of an arrow), and out of the page as dots (the tip).

### Example 1

A proton moves at $3.0\times10^6$ m/s east through a 0.50 T field pointing north. Find the force on it.

$\theta = 90^\circ$: $F = (1.6\times10^{-19})(3.0\times10^6)(0.50) = 2.4\times10^{-13}$ N. Direction: fingers east, curl toward north, thumb points up (out of the ground). For an electron with the same velocity, the force would point down.

## Circular motion in a uniform field

If a charged particle moves perpendicular to a uniform field, the magnetic force is constant in size and always perpendicular to $\vec v$: exactly the condition for uniform circular motion. Setting the magnetic force equal to the centripetal force,

$$|q|vB = \frac{mv^2}{r} \quad\Rightarrow\quad r = \frac{mv}{|q|B}.$$

Faster or heavier particles make wider circles; stronger fields make tighter ones. The period, $T = \dfrac{2\pi r}{v} = \dfrac{2\pi m}{|q|B}$, doesn't depend on the speed. This **cyclotron frequency**, $f = \dfrac{|q|B}{2\pi m}$, is the principle of the cyclotron accelerator.

The picture shows the geometry for a positive charge in a field pointing into the page: the force always points toward the center of the circle, at right angles to the velocity.

![A positive charge moving upward at the right edge of a dashed circle, in a field into the page; its velocity arrow points up and the magnetic force arrow points left, toward the center](images/phys-m10-orbit.svg)

If the velocity also has a component along $\vec B$, that part is unaffected, and the particle spirals in a helix around the field lines. That's how Earth's field funnels solar-wind particles toward the poles to make the aurora.

### Example 2: mass spectrometer

Singly charged ions are accelerated through 1000 V and enter a 0.20 T field perpendicular to their motion. Find the radius of the path for a carbon-12 ion ($m = 1.99\times10^{-26}$ kg).

Speed from energy: $\tfrac12mv^2 = qV$, so $v = \sqrt{\dfrac{2(1.6\times10^{-19})(1000)}{1.99\times10^{-26}}} = 1.27\times10^5$ m/s.

Radius: $r = \dfrac{mv}{qB} = \dfrac{(1.99\times10^{-26})(1.27\times10^5)}{(1.6\times10^{-19})(0.20)} = 0.079$ m.

Heavier isotopes curve less (here $r \propto \sqrt m$), so they land at different spots.

![A mass spectrometer: ions leave a source, are accelerated between two plates, and enter a field into the page, where lighter ions follow a small semicircle and heavier ions a larger one before striking a detector](images/phys-m10-mass-spec.svg)

 That's how a **mass spectrometer** sorts atoms by mass, from carbon dating to drug testing.

*Velocity selector.* If an electric field and a magnetic field are crossed (perpendicular to each other and to the beam), a particle goes straight when the electric and magnetic forces cancel: $qE = qvB$, so only particles with $v = E/B$ pass through undeflected.

## Force on a current-carrying wire

A current is moving charge, so a wire carrying current $I$ in a magnetic field feels a force. For a straight length $L$ at angle $\theta$ to a uniform field,

$$F = ILB\sin\theta,$$

with direction given by the right-hand rule, using the direction of the current in place of $\vec v$ (vector form: $\vec F = I\vec L\times\vec B$).

### Example 3

A 0.25 m horizontal wire carries 8.0 A east in a 0.40 T field pointing straight up. What force acts on it?

$F = 8.0(0.25)(0.40)\sin 90^\circ = 0.80$ N. Direction: fingers east, curl toward up, thumb points south ($\hat\imath\times\hat k = -\hat\jmath$ with $x$ east, $y$ north, $z$ up).

## Torque on a current loop and motors

A rectangular loop carrying current in a magnetic field feels forces on opposite sides in opposite directions. They don't move the loop, but they twist it. For a loop of $N$ turns and area $A$, the torque is

$$\tau = NIAB\sin\phi,$$

where $\phi$ is the angle between the field and the loop's normal. The quantity $\mu = NIA$ is the loop's **magnetic dipole moment**. The torque tries to align the loop's normal with the field, just as a compass needle aligns. In vector form $\vec\tau = \vec\mu\times\vec B$ and the loop's energy is $U = -\vec\mu\cdot\vec B$, exactly like an electric dipole's $\vec\tau = \vec p\times\vec E$ and $U = -\vec p\cdot\vec E$. An electric **motor** keeps the loop turning by reversing the current every half turn (with a commutator), so the torque always pushes the same rotational way. Analog meters and loudspeakers work on the same force.

## Current elements and the full Lorentz force

The general force on a current element is $d\vec F = I\,d\vec\ell\times\vec B$, so for a curved wire or nonuniform field,

$$\vec F = I\int d\vec\ell\times\vec B.$$

In a uniform field this integral depends only on the endpoints: any wire shape from point $a$ to point $b$ feels the same force as a straight wire from $a$ to $b$. A closed loop in a uniform field therefore feels zero net force (only a torque).

The full Lorentz force on a charge combines both fields: $\vec F = q(\vec E + \vec v\times\vec B)$. Writing Newton's second law, $m\dfrac{d\vec v}{dt} = q\vec v\times\vec B$ for a field along $z$ gives coupled equations $\dot v_x = \omega v_y$, $\dot v_y = -\omega v_x$ with $\omega = qB/m$, whose solution is circular motion at the cyclotron frequency, confirming the result above.

## Common mistakes

- Using the right-hand rule for a negative charge without reversing the result.
- Thinking magnetic forces can speed a particle up (they never do work).
- Expecting a force on a charge moving parallel to the field.
- Using $\theta$ between $\vec F$ and $\vec B$ instead of between $\vec v$ (or $I$) and $\vec B$.

## Key points

- $F = |q|vB\sin\theta$; perpendicular to $\vec v$ and $\vec B$ (right-hand rule, reversed for negative charges); $\vec F = q\vec v\times\vec B$.
- Circular orbit: $r = mv/(|q|B)$; period $2\pi m/(|q|B)$, independent of speed.
- Wire: $F = ILB\sin\theta$; loop torque $\tau = NIAB\sin\phi$.
- Velocity selector passes $v = E/B$.
