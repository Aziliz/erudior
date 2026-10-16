---
id: phys-dc-circuits
module: phys-m9
title: DC circuits and Kirchhoff's rules
minutes: 45
topics: [Series and parallel circuits, Kirchhoff's rules]
drills: [phys-series-parallel, phys-internal-resistance, phys-kirchhoff]
refs: [phys-ref-em-modern]
---
## From one resistor to networks

Real circuits combine many components: the bulbs in a string of lights, the resistors on a circuit board, the appliances on a household circuit. This lesson shows how to reduce series and parallel combinations to a single equivalent resistance, how a battery's internal resistance affects what it delivers, and how Kirchhoff's two rules solve any circuit, even ones that can't be simplified.

Since circuit diagrams are hard to draw here, circuits are described in words: "in series" means one after another along a single path; "in parallel" means side by side, each connected across the same two points.

## Resistors in series

In series, the same current $I$ passes through each resistor (there's only one path, and charge can't pile up). The voltages add: $V = IR_1 + IR_2 + \cdots$ So the equivalent resistance is

$$R_{\text{eq}} = R_1 + R_2 + R_3 + \cdots$$

Series resistors act like one longer wire. The voltage divides in proportion to resistance: the biggest resistor gets the biggest share. One drawback: if one element breaks (an old-style string of holiday lights), the whole path is broken and everything goes out.

## Resistors in parallel

In parallel, each resistor has the same voltage $V$ across it (both ends connect to the same two points). The currents add: $I = V/R_1 + V/R_2 + \cdots$ So

$$\frac{1}{R_{\text{eq}}} = \frac{1}{R_1} + \frac{1}{R_2} + \frac{1}{R_3} + \cdots$$

Parallel paths are like extra lanes: the equivalent resistance is less than the smallest individual resistance. For two resistors, $R_{\text{eq}} = \dfrac{R_1R_2}{R_1 + R_2}$ ("product over sum"). Current divides in inverse proportion to resistance: most of it takes the easiest path. Household outlets are wired in parallel so every appliance gets the full 120 V and can be switched independently. Adding more appliances lowers the total resistance and raises the total current, which is why circuits have breakers.

### Example 1

A 6.0 Ω resistor is in series with a parallel pair of 4.0 Ω and 12 Ω, all connected to a 12 V battery (no internal resistance). Find the current from the battery, the voltage across each resistor, and the current in each branch.

Parallel pair: $\dfrac{4.0(12)}{4.0 + 12} = 3.0$ Ω. Total: $6.0 + 3.0 = 9.0$ Ω.

Battery current: $I = 12/9.0 = 1.33$ A.

Voltage across the 6.0 Ω: $1.33(6.0) = 8.0$ V. Across the pair: $1.33(3.0) = 4.0$ V (check: $8.0 + 4.0 = 12$ V ✓).

Branch currents: $4.0/4.0 = 1.0$ A and $4.0/12 = 0.33$ A, adding to 1.33 A ✓.

## EMF and internal resistance

A real battery has some **internal resistance** $r$ inside it. When it delivers current $I$, part of its emf is lost inside, so the **terminal voltage** available to the circuit is

$$V_{\text{terminal}} = \mathcal{E} - Ir.$$

With an external load $R$, the current is $I = \dfrac{\mathcal{E}}{R + r}$. A car battery's headlights dim when the starter motor draws hundreds of amperes, because the $Ir$ drop becomes large. Only when no current flows does the terminal voltage equal the emf.

### Example 2

A 9.0 V battery with internal resistance 0.50 Ω is connected to a 4.0 Ω resistor. Find the current, the terminal voltage, and the power delivered to the resistor.

$I = \dfrac{9.0}{4.5} = 2.0$ A. $V_{\text{terminal}} = 9.0 - 2.0(0.50) = 8.0$ V. $P = I^2R = 4.0(4.0) = 16$ W (another 2.0 W is wasted heating the battery).

## Kirchhoff's rules

Some circuits, such as two batteries in different branches, can't be reduced with series and parallel rules. **Kirchhoff's rules** handle every case:

1. **Junction rule** (conservation of charge): the total current into any junction equals the total current out, $\sum I_{\text{in}} = \sum I_{\text{out}}$.
2. **Loop rule** (conservation of energy): around any closed loop, the sum of potential changes is zero, $\sum\Delta V = 0$.

Sign conventions for the loop rule, traversing the loop in a chosen direction:

- Crossing a resistor *in the direction of* its assumed current: $\Delta V = -IR$ (going downhill). Against the current: $+IR$.
- Crossing a battery from $-$ to $+$: $\Delta V = +\mathcal{E}$. From $+$ to $-$: $-\mathcal{E}$.

Procedure: label a current (with an assumed direction) in each branch, write junction equations, write enough loop equations to have as many independent equations as unknown currents, and solve. A current that comes out negative simply flows opposite to your guess.

### Example 3

Two batteries power a shared resistor. Branch 1 has a 12 V battery and a 2.0 Ω resistor; branch 2 has a 6.0 V battery and a 3.0 Ω resistor; branch 3 is a single 6.0 Ω resistor. The three branches connect between the same two junctions, A (top) and B (bottom). Both batteries have their $+$ terminals toward A. Find the current in each branch.

Let $I_1$ and $I_2$ flow up through branches 1 and 2 (from B to A), and $I_3$ flow down through the 6.0 Ω resistor (A to B).

Junction A: $I_1 + I_2 = I_3$.

Loop through branches 1 and 3, going up branch 1 then down branch 3: $+12 - 2.0I_1 - 6.0I_3 = 0$.

Loop through branches 2 and 3: $+6.0 - 3.0I_2 - 6.0I_3 = 0$.

From the loops: $I_1 = 6 - 3I_3$ and $I_2 = 2 - 2I_3$. Substituting in the junction equation: $6 - 3I_3 + 2 - 2I_3 = I_3$, so $I_3 = 8/6 = 1.33$ A. Then $I_1 = 2.0$ A and $I_2 = -0.67$ A.

The negative $I_2$ means current flows *down* through the 6.0 V battery: the stronger 12 V battery is charging it.

## Meters

An **ammeter** measures current and is placed in series with the branch; it must have very small resistance so it doesn't change the current. A **voltmeter** measures potential difference and is connected in parallel across the component; it must have very large resistance so it draws almost no current. Connecting an ammeter in parallel short-circuits the component and can damage the meter.

## With calculus

Kirchhoff's rules give a system of linear equations, naturally written as a matrix equation $\mathbf{R}\,\vec I = \vec{\mathcal{E}}$ and solved by elimination or Cramer's rule; circuit simulation software does exactly this for thousands of unknowns. For Example 3, substituting the junction rule gives

$$\begin{bmatrix} 8 & 6 \\ 6 & 9 \end{bmatrix}\begin{bmatrix} I_1 \\ I_2 \end{bmatrix} = \begin{bmatrix} 12 \\ 6 \end{bmatrix},$$

with determinant $72 - 36 = 36$, so $I_1 = \dfrac{12(9) - 6(6)}{36} = 2.0$ A and $I_2 = \dfrac{8(6) - 6(12)}{36} = -0.67$ A, as before.

Calculus answers a design question: what load resistance draws the most power from a source with internal resistance $r$? $P(R) = \dfrac{\mathcal{E}^2R}{(R + r)^2}$; setting $dP/dR = 0$ gives $R = r$. This is **impedance matching**, used in audio amplifiers and antennas, at the cost of 50% efficiency.

## Common mistakes

- Adding parallel resistances directly or series resistances as reciprocals.
- Forgetting to take the reciprocal at the end of the parallel formula.
- Inconsistent signs in the loop rule; pick a direction and follow the convention strictly.
- Assuming the terminal voltage always equals the emf.
- Treating a negative current from Kirchhoff's rules as an error.

## Key points

- Series: same current, $R_{\text{eq}} = \sum R_i$. Parallel: same voltage, $1/R_{\text{eq}} = \sum 1/R_i$.
- Terminal voltage $V = \mathcal{E} - Ir$; $I = \mathcal{E}/(R + r)$.
- Junction rule: currents in = currents out. Loop rule: $\sum\Delta V = 0$ around any loop.
- Ammeters in series (low $R$); voltmeters in parallel (high $R$).
- Maximum power transfer when $R = r$.
