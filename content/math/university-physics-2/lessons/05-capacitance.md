---
id: phys-capacitance
module: phys-m8
title: Capacitance and dielectrics
minutes: 40
topics: [Capacitance]
drills: [phys-parallel-plate, phys-cap-combo, phys-cap-energy]
refs: [phys-ref-em-modern]
---
## Storing charge and energy

A camera flash charges up for a few seconds, then dumps its energy in a millisecond. A defibrillator does the same for a heart. Every circuit board is dotted with small components that store charge and smooth out voltage. These are capacitors, and they're the practical payoff of electric fields and potential. This lesson defines capacitance, works out the parallel-plate capacitor, combines capacitors in circuits, and finds the energy they store.

## Capacitance

A **capacitor** is two conductors separated by an insulator. Connect it to a battery and charge $+Q$ collects on one conductor and $-Q$ on the other, with a potential difference $V$ between them. The charge is proportional to the voltage, and the constant of proportionality is the **capacitance**:

$$C = \frac QV.$$

Its unit is the **farad**, $1\text{ F} = 1\text{ C/V}$. A farad is huge; typical capacitors are measured in microfarads (μF), nanofarads (nF) and picofarads (pF). Capacitance depends only on the geometry and the insulating material, not on $Q$ or $V$.

## The parallel-plate capacitor

Two plates of area $A$ separated by a small gap $d$ have, from Gauss's law, a uniform field $E = \sigma/\varepsilon_0 = Q/(\varepsilon_0A)$ between them. The potential difference is $V = Ed = Qd/(\varepsilon_0A)$, so

$$C = \frac{\varepsilon_0A}{d}.$$

Bigger plates hold more charge at a given voltage; a smaller gap means a smaller voltage for the same charge. Both raise $C$.

### Example 1

A parallel-plate capacitor has square plates 10 cm on a side separated by 1.0 mm of air. Find its capacitance and the charge it holds when connected to a 12 V battery.

$C = \dfrac{(8.85\times10^{-12})(0.010)}{1.0\times10^{-3}} = 8.85\times10^{-11}$ F $= 88.5$ pF.

$Q = CV = (8.85\times10^{-11})(12) = 1.06\times10^{-9}$ C, about 1 nC. To get a farad with a 1 mm gap you'd need plates about 10 km on a side; real capacitors use thin films rolled up, and dielectrics.

## Dielectrics

Filling the gap with an insulating material, a **dielectric**, increases the capacitance by a factor $\kappa$, the **dielectric constant**:

$$C = \kappa\frac{\varepsilon_0A}{d}.$$

For air $\kappa \approx 1.0006$, paper about 3.7, glass 5–10, water about 80. The dielectric's molecules polarize in the field, lining up so that their bound charges partly cancel the field inside. With less field for the same plate charge, the voltage is lower, so $C = Q/V$ is higher. Dielectrics also prevent breakdown: air sparks at about $3\times10^6$ V/m, while many plastics withstand ten times that.

## Combining capacitors

*In parallel*, capacitors share the same voltage (both connected directly across the battery), and their charges add, $Q = Q_1 + Q_2 + \cdots$, so

$$C_{\text{eq}} = C_1 + C_2 + \cdots$$

It's like adding plate area.

*In series*, capacitors are connected end to end in a single path. Each carries the same charge $Q$ (charge pushed onto one plate induces equal charge on the next), and the voltages add, $V = V_1 + V_2 + \cdots$, so

$$\frac{1}{C_{\text{eq}}} = \frac{1}{C_1} + \frac{1}{C_2} + \cdots$$

The series combination is smaller than the smallest capacitor: like increasing the gap. (These rules are the reverse of those for resistors, coming in the next module.)

### Example 2

A 3.0 μF and a 6.0 μF capacitor are connected (a) in series and (b) in parallel across a 12 V battery. Find the equivalent capacitance and the charge on and voltage across each capacitor.

(a) Series: $\dfrac1{C_{\text{eq}}} = \dfrac13 + \dfrac16 = \dfrac12$, so $C_{\text{eq}} = 2.0$ μF. $Q = 2.0(12) = 24$ μC on each. $V_1 = 24/3.0 = 8.0$ V, $V_2 = 24/6.0 = 4.0$ V; they add to 12 V ✓. The smaller capacitor takes the larger voltage.

(b) Parallel: $C_{\text{eq}} = 9.0$ μF. Each has 12 V; $Q_1 = 36$ μC, $Q_2 = 72$ μC.

## Energy stored in a capacitor

Charging a capacitor takes work: each bit of charge must be pushed against the growing voltage. Since $V$ rises linearly with $Q$ from 0, the average voltage during charging is $V/2$, so the stored energy is

$$U = \tfrac12QV = \tfrac12CV^2 = \frac{Q^2}{2C}.$$

Where is the energy? In the electric field between the plates. Dividing $U = \tfrac12CV^2$ by the volume $Ad$ gives the **energy density** of an electric field,

$$u = \tfrac12\varepsilon_0E^2,$$

true for any electric field, not just in capacitors.

### Example 3

A defibrillator's 150 μF capacitor is charged to 2000 V. How much energy does it store? If it discharges in 4.0 ms, what is the average power?

$U = \tfrac12(150\times10^{-6})(2000)^2 = 300$ J. Average power $= 300/0.0040 = 75$ kW, far more than the charger could supply directly, which is the point of storing it.

## Energy by integration, and other geometries

The stored energy comes from integrating the work to move each increment of charge $dq$ against the current voltage $v = q/C$:

$$U = \int_0^Q\frac{q}{C}\,dq = \frac{Q^2}{2C}.$$

Capacitance of other geometries follows from $C = Q/V$ with $V = \int E\,dr$ from Gauss's law:

- *Cylindrical capacitor* (coaxial cable), inner radius $a$, outer $b$, length $L$: $E = \dfrac{\lambda}{2\pi\varepsilon_0r}$, so $V = \dfrac{\lambda}{2\pi\varepsilon_0}\ln\dfrac ba$ and $C = \dfrac{2\pi\varepsilon_0L}{\ln(b/a)}$.
- *Spherical capacitor*, radii $a < b$: $V = kQ\left(\dfrac1a - \dfrac1b\right)$, so $C = \dfrac{4\pi\varepsilon_0ab}{b - a}$. Letting $b\to\infty$ gives an isolated sphere, $C = 4\pi\varepsilon_0a$ (Earth's is only about 0.7 mF).

The energy density can also be integrated: the energy in the field of a charged conducting sphere of radius $R$ is $\int_R^\infty\tfrac12\varepsilon_0E^2\,4\pi r^2\,dr = \dfrac{kQ^2}{2R}$, which matches $Q^2/(2C)$.

## Common mistakes

- Swapping the series and parallel rules (capacitors are the reverse of resistors).
- Thinking $C$ changes when you change $V$ (it's set by geometry; $Q$ changes).
- Forgetting unit prefixes: μF $= 10^{-6}$ F, pF $= 10^{-12}$ F; mm and cm² conversions for plate size.
- Using $U = QV$ (missing the $\tfrac12$).

## Key points

- $C = Q/V$ (farads); parallel plates $C = \kappa\varepsilon_0A/d$.
- Parallel: $C_{\text{eq}} = \sum C_i$, same $V$. Series: $1/C_{\text{eq}} = \sum 1/C_i$, same $Q$.
- $U = \tfrac12CV^2 = \tfrac12QV = Q^2/(2C)$; field energy density $u = \tfrac12\varepsilon_0E^2$.
- A dielectric raises $C$ by $\kappa$ and increases the breakdown voltage.
