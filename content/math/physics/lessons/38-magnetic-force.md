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

If the velocity also has a component along $\vec B$, that part is unaffected, and the particle spirals in a helix around the field lines. That's how Earth's field funnels solar-wind particles toward the poles to make the aurora.

### Example 2: mass spectrometer

Singly charged ions are accelerated through 1000 V and enter a 0.20 T field perpendicular to their motion. Find the radius of the path for a carbon-12 ion ($m = 1.99\times10^{-26}$ kg).

Speed from energy: $\tfrac12mv^2 = qV$, so $v = \sqrt{\dfrac{2(1.6\times10^{-19})(1000)}{1.99\times10^{-26}}} = 1.27\times10^5$ m/s.

Radius: $r = \dfrac{mv}{qB} = \dfrac{(1.99\times10^{-26})(1.27\times10^5)}{(1.6\times10^{-19})(0.20)} = 0.079$ m.

Heavier isotopes curve less (here $r \propto \sqrt m$), so they land at different spots. That's how a **mass spectrometer** sorts atoms by mass, from carbon dating to drug testing.

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

where $\phi$ is the angle between the field and the loop's normal. The quantity $\mu = NIA$ is the loop's **magnetic dipole moment**. The torque tries to align the loop's normal with the field, just as a compass needle aligns. An electric **motor** keeps the loop turning by reversing the current every half turn (with a commutator), so the torque always pushes the same rotational way. Analog meters and loudspeakers work on the same force.

## Why a loop feels torque but no net force

Look at a rectangular loop in a uniform field, with its plane parallel to the field. The two sides parallel to $\vec B$ feel no force ($\sin 0^\circ = 0$). The other two sides carry current in opposite directions, so by $F = ILB$ they feel equal forces in opposite directions: one pushed out of the page, one into it. Equal and opposite forces add to zero, so the loop's center of mass doesn't accelerate. But the two forces act along different lines, a distance $w$ apart (the loop's width), so together they make a torque $F\cdot w = (ILB)w = IAB$ for one turn, since $Lw = A$. That is the maximum value of $\tau = NIAB\sin\phi$ with $N = 1$. As the loop turns toward alignment, the lever arm shrinks as $\sin\phi$, and the torque falls to zero when the loop's normal points along the field.

The same argument works for any closed loop in a *uniform* field: forces on opposite stretches of wire cancel, leaving at most a torque. A net force on a loop needs a field that is stronger on one side than the other, which is why a bar magnet (with its nonuniform field) can pull a current loop toward it.

### Example 4: velocity selector

A beam of ions passes between plates that make a 3000 V/m electric field pointing down, with a 0.020 T magnetic field perpendicular to both the beam and $\vec E$. What speed passes straight through? What happens to a faster ion?

Balance: $qE = qvB$, so $v = E/B = 3000/0.020 = 1.5\times10^5$ m/s.

A faster ion feels a larger magnetic force ($qvB$ grows with $v$) but the same electric force ($qE$ doesn't depend on speed), so the magnetic force wins and the ion is deflected in the magnetic force's direction. A slower ion is deflected the other way, by the electric force. Notice that the charge cancels in the balance, so the selected speed is the same for any charge, positive or negative.

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
