---
id: phys-rc
module: phys-m9
title: RC circuits
minutes: 35
topics: [RC circuits]
drills: [phys-rc-charging, phys-rc-time]
refs: [phys-ref-em-modern]
---
## When currents change

In every circuit so far the currents were steady. Put a capacitor in a circuit with a resistor and things change with time: the capacitor charges gradually, and the current starts large and dies away. RC circuits set the timing in blinking lights, camera flashes, pacemakers and windshield wipers, and they filter signals in audio equipment. This lesson combines capacitance with Kirchhoff's rules and introduces the exponential behavior that shows up throughout physics.

## Charging a capacitor

Connect an uncharged capacitor $C$ in series with a resistor $R$ and a battery of emf $\mathcal{E}$, and close the switch at $t = 0$.

- At the first instant the capacitor has no charge, so no voltage across it; it acts like a plain wire. The full emf is across the resistor, and the current jumps to $I_0 = \mathcal{E}/R$.
- As charge builds up, the capacitor's voltage $q/C$ rises, leaving less for the resistor, so the current shrinks.
- Eventually the capacitor's voltage equals $\mathcal{E}$, the current stops, and the capacitor holds $Q = C\mathcal{E}$. A fully charged capacitor acts like a break in the circuit.

The charge and current follow exponential curves:

$$q(t) = C\mathcal{E}\left(1 - e^{-t/RC}\right), \qquad I(t) = \frac{\mathcal{E}}{R}e^{-t/RC}.$$

The capacitor's voltage is $V_C = \mathcal{E}(1 - e^{-t/RC})$.

## The time constant

The product

$$\tau = RC$$

has units of seconds (Ω·F = (V/A)(C/V) = C/A = s) and is called the **time constant**. It sets the speed of the whole process:

- after one time constant, the capacitor reaches $1 - e^{-1} = 63.2\%$ of its final charge, and the current has dropped to 36.8% of its initial value;
- after $2\tau$: 86.5%; after $3\tau$: 95.0%; after $5\tau$: 99.3%, effectively full.

A larger resistor slows the flow of charge; a larger capacitor needs more charge. Either way, larger $RC$ means slower charging.

```plot
{"x": [0, 5.2], "y": [0, 1.1], "xLabel": "t / RC", "yLabel": "fraction of final value", "functions": [{"f": "1 - exp(-x)", "label": "charge q / CE"}, {"f": "exp(-x)", "dashed": true, "label": "current I / I₀"}], "points": [{"at": [1, 0.632], "label": "63%"}, {"at": [1, 0.368], "label": "37%"}], "caption": "Charging an RC circuit: charge rises and current decays with time constant RC"}
```

### Example 1

A 4.0 μF capacitor charges through a 50 kΩ resistor from a 12 V battery. Find (a) the time constant, (b) the initial current, (c) the final charge, and (d) the capacitor's voltage after 0.30 s.

(a) $\tau = (50\times10^3)(4.0\times10^{-6}) = 0.20$ s.

(b) $I_0 = 12/(50\times10^3) = 2.4\times10^{-4}$ A $= 0.24$ mA.

(c) $Q = C\mathcal{E} = (4.0\times10^{-6})(12) = 48$ μC.

(d) $V_C = 12(1 - e^{-0.30/0.20}) = 12(1 - 0.223) = 9.32$ V.

## Discharging a capacitor

Now disconnect the battery and let a charged capacitor (initial charge $Q_0$) discharge through a resistor. The capacitor acts as the source; its voltage drives a current that drains its own charge:

$$q(t) = Q_0e^{-t/RC}, \qquad I(t) = \frac{Q_0}{RC}e^{-t/RC} = \frac{V_0}{R}e^{-t/RC}.$$

Both decay by the same factor in each equal time interval. The time for the charge to fall to half is $t_{1/2} = RC\ln 2 = 0.693\,RC$.

### Example 2

A camera flash's 100 μF capacitor charged to 300 V discharges through a 2.0 Ω flash tube. What's the time constant, and how long until the voltage drops to 10 V?

$\tau = 2.0(100\times10^{-6}) = 2.0\times10^{-4}$ s $= 0.20$ ms.

$10 = 300e^{-t/\tau}$, so $t = \tau\ln 30 = (0.20\text{ ms})(3.40) = 0.68$ ms. A brief, intense burst: that's the point of storing energy in a capacitor.

## Energy in an RC circuit

When a capacitor charges to $\mathcal{E}$, the battery supplies energy $Q\mathcal{E} = C\mathcal{E}^2$, but the capacitor stores only $\tfrac12C\mathcal{E}^2$. The other half is dissipated as heat in the resistor, whatever the value of $R$. (A smaller $R$ means a larger current for a shorter time, and the total heat comes out the same.)

## RC circuits in practice

Because $\tau = RC$ can be set anywhere from nanoseconds to minutes by choosing components, RC circuits are the standard way to make electronics wait. A car's turn-signal flasher, a smoke detector's chirp interval and the delay before a bathroom fan shuts off all come from a capacitor charging until its voltage crosses a threshold, which triggers a switch that discharges it and starts the cycle over.

RC circuits also act as filters. A capacitor needs time to respond, so it can't follow voltage changes much faster than $1/\tau$. Take the output across the capacitor and rapid fluctuations are smoothed away while slow changes pass through: a **low-pass filter**, used to remove hiss from audio and to smooth the ripple from a power supply. Take the output across the resistor instead and only the rapid changes get through, a high-pass filter. The crossover frequency is about $f = \dfrac{1}{2\pi RC}$. A 10 kΩ resistor with a 16 nF capacitor gives roughly 1 kHz.

## With calculus

Apply the loop rule to the charging circuit, with $I = dq/dt$:

$$\mathcal{E} - IR - \frac qC = 0 \quad\Rightarrow\quad R\frac{dq}{dt} = \mathcal{E} - \frac qC.$$

Separate variables:

$$\int_0^q\frac{dq'}{C\mathcal{E} - q'} = \int_0^t\frac{dt'}{RC} \quad\Rightarrow\quad -\ln\frac{C\mathcal{E} - q}{C\mathcal{E}} = \frac{t}{RC},$$

which rearranges to $q = C\mathcal{E}(1 - e^{-t/RC})$. Differentiating gives $I = \dfrac{dq}{dt} = \dfrac{\mathcal{E}}{R}e^{-t/RC}$.

For discharging, $R\dfrac{dq}{dt} + \dfrac qC = 0$, a first-order equation whose solution is $q = Q_0e^{-t/RC}$. This is the same differential equation as radioactive decay, Newton's law of cooling, and linear drag: anywhere a rate of change is proportional to the amount present.

The energy claim is a quick integral: heat in the resistor while charging is

$$\int_0^\infty I^2R\,dt = \frac{\mathcal{E}^2}{R}\int_0^\infty e^{-2t/RC}\,dt = \frac{\mathcal{E}^2}{R}\cdot\frac{RC}{2} = \tfrac12C\mathcal{E}^2.$$

## Common mistakes

- Treating an RC circuit as instantly charged (or the capacitor as always an open circuit).
- Using $e^{-t/RC}$ for the charge while charging (it's $1 - e^{-t/RC}$).
- Forgetting unit prefixes: kΩ × μF = ms, MΩ × μF = s.
- Thinking the current in a charging RC circuit grows over time (it decays).

## Key points

- $\tau = RC$ (seconds).
- Charging: $q = C\mathcal{E}(1 - e^{-t/RC})$, $I = (\mathcal{E}/R)e^{-t/RC}$.
- Discharging: $q = Q_0e^{-t/RC}$, $I = (V_0/R)e^{-t/RC}$; half-life $RC\ln 2$.
- Uncharged capacitor: acts like a wire at first; fully charged: acts like a break.
- Charging from a battery wastes half the energy as heat in $R$.
