---
id: phys-measurement
module: phys-m1
title: Measurement, units, and significant figures
minutes: 30
topics: [Units and conversions, Significant figures, Dimensional analysis]
drills: [phys-convert-speed, phys-convert-area, phys-sigfigs]
refs: [phys-ref-units, phys-ref-constants]
---
## Why physics starts with measurement

Physics makes claims you can test, and testing means measuring. Every physical quantity in this course is a number times a unit: "3.2 m" means 3.2 copies of the standard length called a meter. Drop the unit and the number means nothing, so a habit worth building on day one is to carry units through every line of every calculation. This lesson sets up three tools you will use in all the others: the SI unit system with its prefixes, the rules for honest precision (significant figures), and dimensional analysis, which catches mistakes before they cost you.

## SI units and prefixes

The international system (**SI units**) builds everything from seven base units. The four you will meet most are the meter (m) for length, the kilogram (kg) for mass, the second (s) for time, and the ampere (A) for current; the kelvin (K), mole (mol) and candela complete the set. Every other unit is a **derived unit**, a product or quotient of base units. Speed is m/s, acceleration m/s², and the newton is defined so that $1\text{ N} = 1\text{ kg·m/s}^2$ (it is the force that gives 1 kg an acceleration of 1 m/s²). The joule is $1\text{ J} = 1\text{ N·m} = 1\text{ kg·m}^2/\text{s}^2$, and the watt is $1\text{ W} = 1\text{ J/s}$.

Prefixes scale a unit by powers of ten:

| Prefix | Symbol | Factor | Prefix | Symbol | Factor |
|---|---|---|---|---|---|
| giga | G | $10^{9}$ | centi | c | $10^{-2}$ |
| mega | M | $10^{6}$ | milli | m | $10^{-3}$ |
| kilo | k | $10^{3}$ | micro | μ | $10^{-6}$ |
| | | | nano | n | $10^{-9}$ |

Large and small values are written in **scientific notation**, $a \times 10^n$ with $1 \le |a| < 10$: the mass of an electron is $9.11 \times 10^{-31}$ kg, far easier to read than thirty zeros.

## Converting units

A **conversion factor** is a fraction equal to 1, such as $\dfrac{1000\text{ m}}{1\text{ km}}$. Multiplying by 1 changes nothing physical, so you may multiply by as many conversion factors as you like, choosing each one so that the unwanted unit cancels.

### Example 1

Convert a highway speed of 108 km/h to m/s.

Write the quantity, then multiply by factors that cancel km and h:

$$108\,\frac{\text{km}}{\text{h}} \times \frac{1000\text{ m}}{1\text{ km}} \times \frac{1\text{ h}}{3600\text{ s}} = \frac{108\,000}{3600}\,\frac{\text{m}}{\text{s}} = 30\text{ m/s}.$$

Check: km cancels against km, h against h, leaving m/s. A useful shortcut follows: dividing km/h by 3.6 gives m/s.

When a unit is squared or cubed, the conversion factor must be squared or cubed too. Since $1\text{ cm} = 10^{-2}\text{ m}$, we get $1\text{ cm}^2 = (10^{-2}\text{ m})^2 = 10^{-4}\text{ m}^2$ and $1\text{ cm}^3 = 10^{-6}\text{ m}^3$. Forgetting to square the factor is the most common conversion error in the whole course.

### Example 2

A plate has area 250 cm². What is its area in m²?

$$250\text{ cm}^2 \times \left(\frac{1\text{ m}}{100\text{ cm}}\right)^2 = 250 \times 10^{-4}\text{ m}^2 = 0.025\text{ m}^2.$$

If you had used $\tfrac{1}{100}$ instead of $\left(\tfrac{1}{100}\right)^2$ you would get 2.5 m², a plate the size of a dining table.

## Significant figures

No measurement is exact. A ruler marked in millimeters lets you read a length as 12.3 cm with the last digit estimated; writing 12.300 cm would claim precision you don't have. **Significant figures** (sig figs) are the digits that carry real information. The rules:

- Nonzero digits are significant: 4.56 has three.
- Zeros between nonzero digits are significant: 2.05 has three.
- Leading zeros only place the decimal point: 0.0071 has two.
- Trailing zeros after a decimal point are significant: 3.400 has four.
- Trailing zeros in a whole number without a decimal point are ambiguous: write 1200 as $1.2 \times 10^3$ (two) or $1.200 \times 10^3$ (four) to be clear.

Scientific notation removes every ambiguity, because all digits in $a$ are significant.

*Calculating with measured values.* The result can't be more reliable than the weakest input, but "weakest" means different things for different operations:

- *Multiplying or dividing*: keep as many sig figs as the input with the fewest sig figs.
- *Adding or subtracting*: keep as many decimal places as the input with the fewest decimal places.

Exact numbers (counted objects, the 2 in $2\pi r$, defined conversions like 100 cm = 1 m) never limit precision. Round only at the end; carry an extra digit or two through intermediate steps.

The chart below sums up which rule to use.

```mermaid
flowchart TD
  accTitle: Choosing the significant-figure rule for a calculation
  accDescr: First set aside exact numbers such as counted objects and defined conversions, since they never limit the result. Then ask which operation combines the measured values. For multiplying or dividing, count significant figures and keep as many as the input with the fewest. For adding or subtracting, count decimal places and keep as many as the input with the fewest. In both cases, carry extra digits through the work and round only the final answer.
  X["Set aside exact numbers (counts, defined conversions)"] --> S{"Which operation?"}
  S -- "multiply or divide" --> M["Count significant figures"]
  M --> M2["Keep the fewest sig figs of any input"]
  S -- "add or subtract" --> A["Count decimal places"]
  A --> A2["Keep the fewest decimal places of any input"]
  M2 --> R["Round only the final answer"]
  A2 --> R
```

### Example 3

A rectangle measures 4.52 m by 2.1 m. Report its area.

$4.52 \times 2.1 = 9.492$. The inputs have 3 and 2 sig figs, so the answer gets 2: area $= 9.5\text{ m}^2$.

Now add masses of 12.41 kg and 3.2 kg: $15.61$, but 3.2 is known only to tenths, so report 15.6 kg.

**Accuracy** and **precision** are different ideas. Accuracy is how close a result is to the true value; precision is how tightly repeated measurements cluster (and how many digits you can justify). A miscalibrated scale can be very precise and still inaccurate.

Think of darts thrown at a target: precision is how tightly the darts cluster, and accuracy is whether the cluster sits on the bullseye.

![Four targets. Top left, accurate and precise: six dots tightly clustered on the center. Top right, precise but not accurate: a tight cluster far up and to the left of the center. Bottom left, accurate but not precise: dots scattered widely all around the center. Bottom right, neither accurate nor precise: dots scattered widely, mostly up and to the left.](images/phys-m1-targets.svg)

## Dimensional analysis

Every quantity has a **dimension**: length [L], mass [M], time [T], and so on. Speed has dimension [L]/[T], acceleration [L]/[T]², force [M][L]/[T]². **Dimensional analysis** rests on one fact: you can only add, subtract or equate quantities with the same dimension. So both sides of any correct equation must match dimensionally, term by term.

That gives a fast sanity test. Is $x = v_0 t + \tfrac12 a t^2$ plausible? $[v_0 t] = \tfrac{L}{T}\cdot T = L$ and $[a t^2] = \tfrac{L}{T^2}\cdot T^2 = L$. Every term is a length, as $x$ is. If you derive $x = v_0 t^2$, the check fails ($[L][T]$), so you know an error crept in. The pure number $\tfrac12$ has no dimension, so dimensional analysis can't detect a wrong numerical factor; it catches wrong powers and missing quantities.

### Example 4

A pendulum's period $T$ might depend on its length $L$, the bob's mass $m$, and $g$ (dimension [L]/[T]²). Find the form of the relationship.

Suppose $T = C\,L^a m^b g^c$ with $C$ a pure number. Dimensions: $[T]^1 = [L]^a [M]^b [L]^c [T]^{-2c}$. Matching powers: mass gives $b = 0$; time gives $-2c = 1$, so $c = -\tfrac12$; length gives $a + c = 0$, so $a = \tfrac12$. Therefore $T = C\sqrt{L/g}$. The mass drops out, and the full theory later supplies $C = 2\pi$.

Arguments of functions like $\sin$, $e^x$ and $\ln$ must be dimensionless, which is another quick check: $e^{-t/\tau}$ makes sense only if $\tau$ is a time.

## Estimation and orders of magnitude

Physicists often estimate before calculating. An **order of magnitude** is the power of ten nearest a value: a person's mass (70 kg) is order $10^2$ kg. Rough estimates ("how many heartbeats in a lifetime?" about $70\text{ beats/min} \times 5\times10^5\text{ min/yr} \times 80\text{ yr} \approx 3\times10^9$) tell you whether a precise answer is reasonable.

## Units of slopes and areas on graphs

Much of this course reads physics off graphs, and units tell you what a graph's slope and area mean before you calculate anything.

- The *slope* of a graph is rise over run, so its unit is (unit on the vertical axis)/(unit on the horizontal axis). On a graph of position (m) against time (s), the slope is in m/s: it is a velocity.
- The *area* between a graph and the horizontal axis is height times width, so its unit is (vertical unit)·(horizontal unit). On a graph of velocity (m/s) against time (s), a rectangle of area has units (m/s)·s = m: it is a displacement. On a graph of force (N) against distance (m), area has units N·m = J, an energy.

```plot
{"x": [0, 5], "y": [0, 7], "xLabel": "time t (s)", "yLabel": "velocity v (m/s)", "functions": [{"f": "2 + x", "label": "v = 2 + t", "from": 0, "to": 4.5}], "shade": [{"f": "2 + x", "from": 0, "to": 4}], "caption": "Slope = (4 m/s)/(4 s) = 1 m/s², an acceleration. Shaded area from 0 to 4 s = (2 + 6)/2 × 4 = 16 m, a displacement."}
```

### Example 5

A graph shows the force on a cart (N, vertical axis) against time (s, horizontal axis). What do its slope and the area under it represent, in SI units?

Slope: N/s, the rate at which the force changes. Area: N·s $= \text{kg·m/s}^2 \cdot \text{s} = \text{kg·m/s}$, which is the unit of momentum (mass times velocity). You'll meet this area again as impulse in the momentum lesson; the units already hint that it changes an object's momentum.

## Common mistakes

- Converting area or volume with an unsquared or uncubed factor (cm² to m² is $10^{-4}$, not $10^{-2}$).
- Dropping units midway and then guessing them at the end.
- Rounding intermediate results, so the final answer drifts.
- Applying the multiplication rule to addition (or the reverse).
- Treating "dimensionally correct" as "correct": a missing factor of 2 passes the check.

## Key points

- Every quantity is a number times a unit; SI base units include m, kg, s, A, K, mol.
- Convert by multiplying by factors equal to 1; square or cube them for areas and volumes.
- Multiply/divide: fewest sig figs. Add/subtract: fewest decimal places. Exact numbers don't count.
- Equations must be dimensionally consistent; function arguments must be dimensionless.
- A graph's slope has units of (vertical)/(horizontal); the area under it has units of (vertical)·(horizontal).
