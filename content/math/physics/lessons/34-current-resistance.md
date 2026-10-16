---
id: phys-current
module: phys-m9
title: Current, resistance, and power
minutes: 35
topics: [Current and resistance, Electric power]
drills: [phys-ohms-law, phys-resistivity, phys-energy-cost]
refs: [phys-ref-em-modern]
---
## Charges on the move

Electrostatics dealt with charges at rest. Connect a battery to a wire and charges flow: an electric current. Currents run our lights, motors and computers, and the next three lessons build the tools to analyze any circuit made of batteries, resistors and capacitors. This one defines current and resistance, states Ohm's law, and shows how electrical energy turns into heat and light.

## Electric current

**Electric current** is the rate at which charge passes through a cross-section of a conductor:

$$I = \frac{\Delta Q}{\Delta t},$$

measured in **amperes** (A): $1\text{ A} = 1\text{ C/s}$. By convention, current direction is the direction positive charges would move, from the high-potential (+) terminal of a battery, through the external circuit, to the low-potential (−) terminal. In metal wires the moving charges are actually electrons, flowing the opposite way; for circuit analysis the two descriptions are equivalent.

A battery is a source of **electromotive force** (emf, symbol $\mathcal{E}$), which is not a force but a potential difference maintained by chemistry: it does work $\mathcal{E}$ on each coulomb pushed through it. A 9 V battery gives each coulomb 9 J.

## Drift velocity

The electrons in a wire move randomly at about $10^6$ m/s, but in a current they also creep along at a tiny average **drift velocity** $v_d$. For a wire of cross-section $A$ with $n$ free electrons per cubic meter,

$$I = nqv_dA.$$

In a copper wire ($n = 8.5\times10^{28}$ m⁻³) of cross-section 1.0 mm² carrying 1.0 A, $v_d = \dfrac{1.0}{(8.5\times10^{28})(1.6\times10^{-19})(1.0\times10^{-6})} = 7.4\times10^{-5}$ m/s, less than a tenth of a millimeter per second. The light still comes on instantly because the electric field (the "push") travels through the circuit at nearly the speed of light, setting all the electrons moving at once.

## Resistance and Ohm's law

Pushing current through a material takes a potential difference, because the moving electrons keep colliding with the vibrating lattice. The **resistance** of a component is the ratio

$$R = \frac VI,$$

measured in **ohms** (Ω): $1\ \Omega = 1$ V/A. For many materials, notably metals at constant temperature, $R$ is constant over a wide range of voltages, so $V \propto I$. That proportionality is **Ohm's law**:

$$V = IR.$$

Components that obey it are called ohmic; their $I$–$V$ graph is a straight line through the origin. Diodes, light bulb filaments (whose resistance rises as they heat up) and transistors are non-ohmic.

## Resistivity

The resistance of a wire depends on what it's made of and its shape:

$$R = \rho\frac LA,$$

where $\rho$ is the **resistivity** of the material (Ω·m), $L$ its length and $A$ its cross-sectional area. Longer wires resist more (more collisions along the way); thicker wires resist less (more lanes for traffic). Copper's resistivity is $1.7\times10^{-8}$ Ω·m; nichrome, used in heating elements, is about 60 times higher; glass is around $10^{12}$ Ω·m.

Resistivity of metals increases with temperature, roughly $\rho = \rho_0[1 + \alpha(T - T_0)]$, because hotter atoms vibrate more and scatter electrons more often. Some materials become **superconductors** below a critical temperature, with exactly zero resistance.

### Example 1

A copper wire is 20 m long with a diameter of 1.0 mm. What is its resistance? What voltage drop does a 5.0 A current produce across it?

$A = \pi(0.50\times10^{-3})^2 = 7.85\times10^{-7}$ m².

$R = (1.7\times10^{-8})\dfrac{20}{7.85\times10^{-7}} = 0.433$ Ω. $V = IR = 5.0(0.433) = 2.2$ V.

That 2.2 V is lost along the wire, which is why long extension cords for heavy loads use thick wire.

## Electric power

A charge $\Delta Q$ dropping through a potential difference $V$ loses energy $\Delta Q\,V$. Per unit time, the power delivered to a component is

$$P = IV.$$

For a resistor, combining with Ohm's law gives two more forms:

$$P = I^2R = \frac{V^2}{R}.$$

In a resistor that power becomes heat (**Joule heating**), which is useful in toasters and stoves and wasteful in power lines. Power lines use very high voltage precisely to keep the current, and so the $I^2R$ loss, small for a given power delivered.

An appliance rated "1200 W at 120 V" draws $I = P/V = 10$ A and has resistance $R = V^2/P = 12$ Ω when running.

### Example 2

A 60 W incandescent bulb runs on 120 V. Find the current and its resistance. If electricity costs \$0.15 per kWh, what does it cost to run the bulb 5 hours a day for 30 days?

$I = 60/120 = 0.50$ A; $R = 120/0.50 = 240$ Ω.

Energy: $(0.060\text{ kW})(5 \times 30\text{ h}) = 9.0$ kWh. Cost: $9.0 \times 0.15 =$ \$1.35. (A 9 W LED giving the same light would cost about 20 cents.)

## With calculus

Current is the derivative of charge: $I = \dfrac{dQ}{dt}$, and the charge that flows in a time interval is $Q = \int I\,dt$. If the current in a wire is $I(t) = 4.0e^{-t/2}$ A, the total charge that ever passes is $\int_0^\infty 4.0e^{-t/2}\,dt = 8.0$ C.

On the microscopic level, the **current density** $\vec J = nq\vec v_d$ (A/m²) is related to the field in the material by $\vec J = \vec E/\rho$, which is Ohm's law in local form. Integrating over a uniform wire, $I = JA$ and $V = EL$, gives back $V = I\rho L/A = IR$.

For a conductor with a cross-section that varies along its length, add resistances of thin slices: $R = \int\dfrac{\rho\,dx}{A(x)}$. For a cone-shaped resistor tapering from radius $a$ to $b$ over length $L$, this gives $R = \dfrac{\rho L}{\pi ab}$.

## Common mistakes

- Thinking current is "used up" in a resistor (current in equals current out; energy is what's converted).
- Using diameter instead of radius for the wire's area, or forgetting to convert mm² to m².
- Confusing kW (power) with kWh (energy).
- Applying $V = IR$ to non-ohmic devices as if $R$ were constant.

## Key points

- $I = \Delta Q/\Delta t$ (amperes); conventional current flows from + to − outside the source.
- $R = V/I$; Ohm's law $V = IR$ for ohmic materials.
- $R = \rho L/A$; resistivity rises with temperature for metals.
- $P = IV = I^2R = V^2/R$; energy in kWh = power (kW) × time (h).
