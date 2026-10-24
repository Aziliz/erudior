---
id: phys-m10-h-induced-fields
module: phys-m10
title: 'Induced electric fields, magnetic braking and back emf'
minutes: 45
topics: [Induced electric fields]
drills: [phys-m10-r2-induced-field, phys-m10-r2-magnetic-braking, phys-m10-r2-back-emf]
refs: [phys-ref-em-modern]
honors: true
---
## The field behind Faraday's law

The induction lesson ended with Faraday's law in integral form, $\oint\vec E\cdot d\vec\ell = -d\Phi_B/dt$, and a remark that a changing magnetic field creates an electric field even in empty space. This honors lesson takes that remark seriously. We will calculate the induced electric field in the most important symmetric case, see why it cannot be described by a potential, use it to explain the betatron, and then follow induction into machines: how magnetic brakes slow a moving conductor, and how the back emf of a spinning motor limits its current.

## Two kinds of electric field

Electric fields made by charges, the ones in the electrostatics lessons, are **conservative**: the work done on a charge moving around any closed path is zero, $\oint\vec E\cdot d\vec\ell = 0$, and that is what allows us to define a potential $V$.

A changing magnetic field makes a second kind, an **induced electric field** (sometimes called a nonconservative field). Its field lines do not start or end on charges; they close on themselves, circling the region where $\vec B$ is changing. Around such a loop, $\oint\vec E\cdot d\vec\ell = -d\Phi_B/dt \ne 0$, so a charge carried once around gains energy. That is precisely the emf of the induction lesson: the work per unit charge done by the induced field around the circuit. The wire is not needed for the field to exist; the wire just gives charges a path to follow it.

A force on a charge is $q\vec E$ whichever kind of field it is. The difference is only in where the field comes from and whether its loop integral vanishes.

## The field around a changing solenoid

A long solenoid of radius $R$ has a uniform field $B(t)$ inside, changing at rate $dB/dt$, and essentially no field outside. What electric field does this produce?

Symmetry fixes the shape. The setup looks the same after any rotation about the axis, so $E$ can depend only on the distance $r$ from the axis. There are no charges, so there is no radial component (by Gauss's law, a radial field would need enclosed charge), and for a long solenoid there is no component along the axis either. The induced field must circle the axis, with the same size all the way around a circle of radius $r$. Apply Faraday's law to that circle:

$$E\,(2\pi r) = \left|\frac{d\Phi_B}{dt}\right|.$$

*Inside* ($r < R$), the circle encloses flux $\pi r^2B$, so

$$E = \frac r2\left|\frac{dB}{dt}\right|.$$

*Outside* ($r > R$), the circle encloses all the flux, $\pi R^2B$, so

$$E = \frac{R^2}{2r}\left|\frac{dB}{dt}\right|.$$

The induced field grows linearly from zero at the axis, peaks at the solenoid's surface, and then falls as $1/r$. Notice the second result: there is an electric field outside the solenoid, where there is essentially no magnetic field at all. The induced field depends on how fast the enclosed flux changes, not on the magnetic field at the point itself.

![Cross-section of a solenoid with its field into the page increasing. Dashed circles inside and outside it show the induced electric field circling counterclockwise](images/phys-m10-induced-e.svg)

*Direction.* Use Lenz's law as if a ring of wire lay along the circle: the induced field points the way the induced current would flow. For a field into the page that is increasing, a current would have to make field out of the page, so $\vec E$ circles counterclockwise as seen.

```plot
{"x": [0, 4], "y": [0, 0.6], "functions": [{"f": "x/2", "from": 0, "to": 1}, {"f": "1/(2*x)", "from": 1, "to": 4}], "points": [{"at": [1, 0.5], "label": "r = R"}], "xLabel": "r / R", "yLabel": "E in units of R·dB/dt", "caption": "Induced electric field around a long solenoid with a changing field: linear inside, falling as 1/r outside"}
```

### Example 1

A long solenoid of radius 5.0 cm has its interior field rising at 40 T/s (as in a fast pulsed magnet). Find the induced electric field at 2.0 cm, 5.0 cm and 10 cm from the axis.

At 2.0 cm (inside): $E = \dfrac{0.020}{2}(40) = 0.40$ V/m.

At 5.0 cm (the surface): $E = \dfrac{0.050}{2}(40) = 1.0$ V/m.

At 10 cm (outside): $E = \dfrac{(0.050)^2}{2(0.10)}(40) = 0.50$ V/m. A single loop of wire of radius 10 cm around the solenoid would have an emf of $E(2\pi r) = 0.31$ V, exactly the rate of change of the solenoid's flux, $\pi(0.050)^2(40)$.

## No potential, so "voltage" depends on the path

Because $\oint\vec E\cdot d\vec\ell \ne 0$, the integral $\int_a^b\vec E\cdot d\vec\ell$ between two points depends on the path taken. There is no single potential difference between $a$ and $b$. This has a practical consequence that surprises people: two voltmeters connected to the same two points of a circuit around a changing flux can read different values if their leads run on opposite sides of the flux. Neither meter is wrong; each measures the integral along its own leads. In circuit work we avoid the problem by keeping the changing flux inside the inductors, where the loop rule's $-L\,dI/dt$ term accounts for it.

## The betatron

The induced field can accelerate particles with no electrodes at all. In a **betatron**, electrons circle inside a doughnut-shaped vacuum tube between the poles of an electromagnet whose field is increasing. The induced electric field along the orbit speeds the electrons up, while the magnetic field at the orbit bends them into a circle. Donald Kerst built the first working betatron at the University of Illinois in 1940.

For the electrons to stay on a circle of fixed radius $r$ as they speed up, the field at the orbit has to grow in step with their momentum. Two equations decide how.

- The magnetic force supplies the centripetal force: $p = eB_{\text{orbit}}r$ (this holds even at relativistic speeds). So $\dfrac{dp}{dt} = er\dfrac{dB_{\text{orbit}}}{dt}$.
- The induced field pushes along the orbit: $\dfrac{dp}{dt} = eE = \dfrac{e}{2\pi r}\dfrac{d\Phi_B}{dt}$, where $\Phi_B = \pi r^2\bar B$ and $\bar B$ is the average field over the area inside the orbit.

Setting them equal gives $\dfrac{dB_{\text{orbit}}}{dt} = \dfrac12\dfrac{d\bar B}{dt}$. Starting from zero field, the betatron condition (sometimes called the two-to-one rule) is

$$B_{\text{orbit}} = \tfrac12\bar B.$$

The magnet's poles are shaped so that the field is stronger near the center than at the orbit, making the average field inside the orbit exactly twice the field at the orbit.

### Example 2

A betatron's orbit has radius 0.20 m. The average field inside it rises steadily from 0 to 0.80 T in 4.0 ms. Find the energy gained per turn and the electrons' momentum at the end.

Rate of change of flux: $\pi(0.20)^2\dfrac{0.80}{4.0\times10^{-3}} = 25$ V. Each turn, an electron gains 25 eV.

At the end, $B_{\text{orbit}} = \tfrac12(0.80) = 0.40$ T, so $p = eB_{\text{orbit}}r = (1.602\times10^{-19})(0.40)(0.20) = 1.28\times10^{-20}$ kg·m/s, or $pc = 24$ MeV. The electrons are then moving at very nearly the speed of light, so in 4.0 ms they make about $(3.0\times10^8)(4.0\times10^{-3})/(2\pi\cdot0.20) \approx 9.5\times10^5$ turns. At 25 eV per turn that is about 24 MeV, which matches. (Their kinetic energy is $\sqrt{(pc)^2 + (mc^2)^2} - mc^2 = 23.5$ MeV.)

## Magnetic braking

Return to the sliding rod of the induction lesson: a rod of mass $m$ and length $L$ on frictionless rails, in a field $B$, closing a circuit of resistance $R$. This time give the rod a push to speed $v_0$ and let go. The induced current $I = BLv/R$ produces a force $ILB = B^2L^2v/R$ that opposes the motion, so

$$m\frac{dv}{dt} = -\frac{B^2L^2}{R}v \quad\Rightarrow\quad v(t) = v_0e^{-t/\tau}, \qquad \tau = \frac{mR}{B^2L^2}.$$

The braking force is proportional to speed, so the rod slows exponentially, like a body in a viscous fluid. Integrating $v$ from $0$ to $\infty$ gives the total stopping distance $v_0\tau$. All of the rod's kinetic energy ends up as heat in the resistor.

### Example 3

A 0.20 kg rod, 0.50 m long, slides at 2.0 m/s on frictionless rails in a 0.80 T field. The circuit's resistance is 0.10 Ω. Find the time constant, the speed after 0.25 s, and the stopping distance.

$\tau = \dfrac{(0.20)(0.10)}{(0.80)^2(0.50)^2} = 0.125$ s. After 0.25 s $= 2\tau$: $v = 2.0e^{-2} = 0.27$ m/s. Stopping distance $v_0\tau = 0.25$ m, and $\tfrac12mv_0^2 = 0.40$ J becomes heat.

Eddy-current brakes on trains and roller coasters work the same way, with a solid metal fin in place of the rod. Because the force shrinks with speed, such brakes are excellent at slowing a fast vehicle smoothly and without wear, but they cannot hold a vehicle still; a friction brake or a stop usually finishes the job.

## Back emf in motors

A motor's coil turns in a magnetic field, so it is also a generator. As it spins, it induces an emf, called the **back emf**, that opposes the applied voltage (Lenz's law again), and it grows with the rotation speed: $\mathcal{E}_b = k\omega$ for some constant $k$ set by the coil and magnet. With supply voltage $V$ and coil resistance $R$, the loop rule gives

$$I = \frac{V - \mathcal{E}_b}{R}.$$

Multiply by $I$ to see where the power goes: $VI = \mathcal{E}_bI + I^2R$. The term $\mathcal{E}_bI$ is the mechanical power delivered to the load; $I^2R$ is heat in the windings.

At start-up $\omega = 0$, so there is no back emf and the current is $V/R$, often many times the running current. That surge is why lights can dim when a large motor starts, and why a motor that jams (stalls) can overheat and burn out. As the motor speeds up, $\mathcal{E}_b$ rises and the current falls. The mechanical power $\mathcal{E}_b(V - \mathcal{E}_b)/R$ is largest when $\mathcal{E}_b = V/2$, but at that point half the input power is heat; real motors usually run with $\mathcal{E}_b$ much closer to $V$, where efficiency $\mathcal{E}_b/V$ is high.

### Example 4

A 12 V DC motor has a winding resistance of 0.50 Ω. At its running speed the back emf is 10.5 V. Find the running current, the start-up current, the mechanical power and the efficiency (ignoring friction).

Running: $I = (12 - 10.5)/0.50 = 3.0$ A. Start-up: $I = 12/0.50 = 24$ A, eight times larger.

Mechanical power $\mathcal{E}_bI = 10.5(3.0) = 31.5$ W, out of $VI = 36$ W in; the remaining 4.5 W heats the windings ($I^2R = 9.0(0.50)$). Efficiency $= 10.5/12 = 87.5\%$.

## Common mistakes

- Thinking there is no induced electric field where $B = 0$. Outside a changing solenoid there is one; it depends on the changing flux enclosed by the path.
- Assigning a potential difference to an induced field. Its line integral depends on the path, so no potential exists.
- Using $B_{\text{orbit}} = \bar B$ for a betatron. The orbit field must be half the average field inside the orbit.
- Expecting a magnetic brake to stop a conductor at a fixed distance in a fixed time. The force is proportional to speed, so the speed decays exponentially.
- Forgetting the back emf when finding a running motor's current. Using $V/R$ gives the start-up (or stalled) current, not the running current.

## Key points

- Induced electric fields form closed loops, $\oint\vec E\cdot d\vec\ell = -d\Phi_B/dt$; they are not conservative and have no potential.
- Long solenoid: $E = \dfrac r2\left|\dfrac{dB}{dt}\right|$ inside, $E = \dfrac{R^2}{2r}\left|\dfrac{dB}{dt}\right|$ outside.
- Betatron: induced $E$ accelerates, $B$ steers; the condition is $B_{\text{orbit}} = \tfrac12\bar B$.
- Magnetic braking: $v = v_0e^{-t/\tau}$ with $\tau = mR/(B^2L^2)$; stopping distance $v_0\tau$.
- Motors: $I = (V - \mathcal{E}_b)/R$; mechanical power $\mathcal{E}_bI$; start-up current $V/R$; efficiency $\mathcal{E}_b/V$ (ignoring friction).
