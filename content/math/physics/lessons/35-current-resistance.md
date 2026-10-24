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

The picture shows the two directions side by side for a short length of wire, along with the length $L$ and cross-sectional area $A$ that appear in the resistance formula below.

![A cylindrical wire with its + end on the left and its − end on the right. A red arrow above the wire points from + to − and is labeled conventional current I. Electrons inside the wire are drawn as small circles with minus signs, and a blue arrow below points from − to + labeled electron drift. The circular end face is labeled area A, and a bracket under the wire is labeled length L.](images/phys-m9-wire.svg)

## Resistance and Ohm's law

Pushing current through a material takes a potential difference, because the moving electrons keep colliding with the vibrating lattice. The **resistance** of a component is the ratio

$$R = \frac VI,$$

measured in **ohms** (Ω): $1\ \Omega = 1$ V/A. For many materials, notably metals at constant temperature, $R$ is constant over a wide range of voltages, so $V \propto I$. That proportionality is **Ohm's law**:

$$V = IR.$$

Components that obey it are called ohmic; their $I$–$V$ graph is a straight line through the origin. Diodes, light bulb filaments (whose resistance rises as they heat up) and transistors are non-ohmic.

The graph compares the two kinds. The ohmic resistor's line is straight, and its slope $I/V$ is $1/R$. The filament's curve bends over toward the voltage axis: each extra volt adds less current than the one before, because the hotter filament has a larger resistance.

```plot
{"x": [0, 12], "y": [0, 1.4], "xLabel": "voltage V (V)", "yLabel": "current I (A)", "functions": [{"f": "x/10"}, {"f": "0.35*sqrt(x)", "dashed": true}], "labels": [{"at": [8.5, 0.5], "text": "ohmic resistor, R = 10 Ω"}, {"at": [4.2, 1.0], "text": "filament bulb (illustrative)"}], "caption": "I–V graphs: a straight line through the origin for an ohmic resistor; a curve that bends over for a filament, whose resistance rises as it heats"}
```

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

## Charge from a current–time graph

Since $\Delta Q = I\Delta t$ for a steady current, the charge that flows is the area of a rectangle on a graph of current against time. When the current changes, the charge is still the area under the $I$–$t$ graph, found from rectangles and triangles. (Compare: displacement is the area under a velocity–time graph.)

### Example 3

The current in a circuit rises steadily from 0 to 4.0 A over the first 2.0 s, stays at 4.0 A for the next 3.0 s, then is switched off. How much charge flows in total? How many electrons is that?

Triangle (0 to 2.0 s): $\tfrac12(2.0)(4.0) = 4.0$ C. Rectangle (2.0 to 5.0 s): $(3.0)(4.0) = 12$ C. Total: $16$ C.

Electrons: $\dfrac{16}{1.602\times10^{-19}} = 1.0\times10^{20}$.

```plot
{"x": [0, 6], "y": [0, 5], "xLabel": "time t (s)", "yLabel": "current I (A)", "functions": [{"f": "2*x", "from": 0, "to": 2}, {"f": "4", "from": 2, "to": 5}], "segments": [{"from": [5, 4], "to": [5, 0]}], "shade": [{"f": "2*x", "from": 0, "to": 2}, {"f": "4", "from": 2, "to": 5}], "labels": [{"at": [1.4, 0.9], "text": "4.0 C"}, {"at": [3.5, 2], "text": "12 C"}], "caption": "Example 3: the shaded area under the current–time graph is the charge, 4.0 C + 12 C = 16 C"}
```

### Example 4

A heating element is made from a nichrome wire. A replacement wire of the same material is twice as long and has twice the diameter. Connected to the same 120 V outlet, how does its power compare with the original?

Resistance: $R = \rho L/A$. Twice the length doubles $R$; twice the diameter makes the area four times larger, dividing $R$ by 4. New $R$ is $2/4 = \tfrac12$ the original.

Power at fixed voltage: $P = V^2/R$, so halving $R$ doubles the power. (Using $P = I^2R$ here and keeping $I$ fixed would give the wrong answer: the current doesn't stay the same, because the voltage is what's fixed.)

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
