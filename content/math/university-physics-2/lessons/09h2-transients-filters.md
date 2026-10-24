---
id: phys-m9-h-transients
module: phys-m9
title: 'Honors: Transients, oscillators and filters'
minutes: 45
honors: true
topics: [Circuit transients, RC filters]
drills: [phys-m9-r2-delay, phys-m9-r2-relaxation, phys-m9-r2-lowpass]
refs: [phys-ref-em-modern]
---
## Beyond one resistor and one capacitor

The RC circuits lesson solved one circuit: a battery, a resistor and a capacitor in a single loop. Real timing circuits have several resistors, switches that open and close, and inputs that wiggle instead of sitting at a fixed voltage. This lesson turns the RC result into a general method. Any circuit with one capacitor, resistors and steady sources reacts to a switch with the same exponential, and the only work is finding three numbers. Then it applies the method to a circuit that switches itself (a relaxation oscillator), solves the RC differential equation for a sinusoidal input (the theory of the filters mentioned at the end of the RC lesson), and settles a famous puzzle about connecting two capacitors.

## The one-capacitor recipe

Any circuit made of resistors, ideal batteries and *one* capacitor is a **first-order circuit**: its behavior after a switch is described by a first-order differential equation. Here is why. Look at the rest of the circuit from the capacitor's two terminals. By Thévenin's theorem (see the honors lesson on network methods) it acts like an emf $V_{\text{th}}$ in series with a resistance $R_{\text{th}}$. So the capacitor always sees a simple series RC loop, and the loop rule gives

$$R_{\text{th}}C\frac{dV_C}{dt} = V_{\text{th}} - V_C.$$

Its solution, for any starting value, is

$$V_C(t) = V_\infty + \bigl(V_C(0) - V_\infty\bigr)e^{-t/\tau}, \qquad \tau = R_{\text{th}}C, \quad V_\infty = V_{\text{th}}.$$

Because every other current and voltage in the circuit is a linear function of $V_C$ and the emfs, they all follow the same pattern: each quantity $x$ moves from its value just after the switch, $x(0^+)$, to its final value $x_\infty$ with the same time constant:

$$x(t) = x_\infty + \bigl(x(0^+) - x_\infty\bigr)e^{-t/\tau}.$$

The part that dies away is the **transient**; what remains is the **steady state**. The recipe needs three things:

1. *The capacitor voltage just after the switch.* It cannot jump: a sudden change would need $I = C\,dV_C/dt$ to be infinite. So $V_C(0^+) = V_C(0^-)$. An uncharged capacitor still acts like a wire at $0^+$; a charged one acts like a battery at its present voltage.
2. *The final values*, found by treating the capacitor as a break (no current in steady state).
3. *The time constant* $\tau = R_{\text{th}}C$, where $R_{\text{th}}$ is the resistance seen from the capacitor's terminals with batteries replaced by wires. It depends on which switches are closed, so it can differ between charging and discharging.

### Example 1

In the circuit shown, switch S closes at $t = 0$. Find $V_C(t)$, the battery current $i(t)$, and their values at $t = 20$ ms. Long afterward S is opened again; how long does the capacitor take to fall to 1.0 V?

![A 9.0 V battery on the left, an open switch S and a resistor R₁ = 3.0 kΩ along the top wire, then a resistor R₂ = 6.0 kΩ and a 10 μF capacitor C connected in parallel between the top and bottom wires. A note says switch S closes at t = 0 with the capacitor uncharged.](images/phys-m9-delay.svg)

*Final value.* With $C$ as a break, $R_1$ and $R_2$ form a divider: $V_\infty = 9.0\cdot\dfrac{6.0}{9.0} = 6.0$ V.

*Time constant.* From the capacitor, with the battery replaced by a wire, $R_1$ and $R_2$ are in parallel: $R_{\text{th}} = \dfrac{3.0(6.0)}{9.0} = 2.0$ kΩ, so $\tau = (2.0\times10^3)(10\times10^{-6}) = 20$ ms.

*Capacitor voltage.* $V_C(0^+) = 0$, so $V_C = 6.0\left(1 - e^{-t/20\text{ ms}}\right)$ V.

*Battery current.* At $0^+$ the capacitor acts as a wire and shorts $R_2$: $i(0^+) = 9.0/3.0 = 3.0$ mA. Finally $i_\infty = 9.0/9.0 = 1.0$ mA. So $i = 1.0 + 2.0e^{-t/20\text{ ms}}$ mA.

At $t = 20$ ms $= \tau$: $V_C = 6.0(1 - e^{-1}) = 3.79$ V and $i = 1.0 + 2.0e^{-1} = 1.74$ mA.

*Opening S.* Now $R_1$ and the battery are cut off and the capacitor discharges through $R_2$ alone, so $\tau' = (6.0\times10^3)(10\times10^{-6}) = 60$ ms, three times longer than the charging time constant. From 6.0 V to 1.0 V: $t = 60\ln 6 = 108$ ms.

## Relaxation oscillators

Put a **threshold switch** across the capacitor: a part that closes when the voltage across it reaches $V_{\text{on}}$ and opens again once it has fallen to $V_{\text{off}}$. A neon lamp behaves this way; so does a transistor or comparator circuit. The capacitor charges toward $\mathcal{E}$ through $R$, the switch dumps it quickly, and the cycle repeats. A circuit that produces a repeating signal this way, by slow charging and sudden release, is a **relaxation oscillator**.

![A battery ε on the left, a resistor R along the top wire, then a capacitor C and a box labeled threshold switch connected in parallel between the top and bottom wires. A note says the switch closes when the capacitor voltage reaches V_on and opens again once it has fallen to V_off.](images/phys-m9-relaxation.svg)

During each charging stretch the capacitor starts at $V_{\text{off}}$ and heads for $\mathcal{E}$: $V_C = \mathcal{E} - (\mathcal{E} - V_{\text{off}})e^{-t/RC}$. Setting $V_C = V_{\text{on}}$ and solving for $t$:

$$T = RC\ln\frac{\mathcal{E} - V_{\text{off}}}{\mathcal{E} - V_{\text{on}}},$$

the period if the discharge is fast enough to neglect. The common 555 timer chip switches at one-third and two-thirds of its supply voltage, so each of its charging stretches lasts $RC\ln 2 \approx 0.693RC$ (a simplified view; in its usual circuit the discharge also goes through a resistor and takes time of its own). Since $\mathcal{E} > V_{\text{on}}$ is needed for the capacitor to ever reach the threshold, a battery that runs down too far stops the oscillation completely rather than just slowing it.

### Example 2

A relaxation oscillator has $\mathcal{E} = 9.0$ V, $V_{\text{on}} = 6.0$ V, $V_{\text{off}} = 2.0$ V, $R = 50$ kΩ and $C = 2.0$ μF. Find the period and frequency, and the time until the first flash after switching on with the capacitor uncharged.

$\tau = (50\times10^3)(2.0\times10^{-6}) = 0.10$ s.

$T = 0.10\ln\dfrac{9.0 - 2.0}{9.0 - 6.0} = 0.10\ln\dfrac73 = 0.0847$ s, so $f = 1/T = 11.8$ Hz.

The first stretch starts from 0, not 2.0 V: $t_1 = 0.10\ln\dfrac{9.0}{3.0} = 0.110$ s. The first cycle is longer than the rest.

```plot
{"x": [0, 4.6], "y": [0, 10.5], "xLabel": "t / RC", "yLabel": "capacitor voltage (V)", "functions": [{"f": "9*(1 - exp(-x))", "from": 0, "to": 1.0986}, {"f": "9 - 7*exp(-(x - 1.0986))", "from": 1.0986, "to": 1.9459}, {"f": "9 - 7*exp(-(x - 1.9459))", "from": 1.9459, "to": 2.7932}, {"f": "9 - 7*exp(-(x - 2.7932))", "from": 2.7932, "to": 3.6405}, {"f": "9 - 7*exp(-(x - 3.6405))", "from": 3.6405, "to": 4.4878}, {"f": "9 - 7*exp(-(x - 4.4878))", "from": 4.4878, "to": 4.6}], "segments": [{"from": [1.0986, 6], "to": [1.0986, 2]}, {"from": [1.9459, 6], "to": [1.9459, 2]}, {"from": [2.7932, 6], "to": [2.7932, 2]}, {"from": [3.6405, 6], "to": [3.6405, 2]}, {"from": [4.4878, 6], "to": [4.4878, 2]}, {"from": [0, 9], "to": [4.6, 9], "dashed": true}, {"from": [0, 6], "to": [4.6, 6], "dashed": true}, {"from": [0, 2], "to": [4.6, 2], "dashed": true}], "labels": [{"at": [2.4, 8.5], "text": "ε = 9 V"}, {"at": [0.35, 6.4], "text": "Von"}, {"at": [1.5, 1.4], "text": "Voff"}], "caption": "Sawtooth from the relaxation oscillator of Example 2 (discharge treated as instant). The first rise from 0 V takes 1.10 RC; each later cycle takes RC ln(7/3) = 0.847 RC."}
```

## Sinusoidal inputs and filters

Now drive the low-pass circuit from the RC lesson with an alternating input $v_{\text{in}} = V_0\cos\omega t$ and take the output across the capacitor.

![A low-pass RC filter: two input terminals on the left, a resistor R along the top wire, a capacitor C connected from the top wire down to the bottom wire, and two output terminals on the right taken across the capacitor. A note says that for a high-pass filter R and C swap places so the output is across R.](images/phys-m9-lowpass.svg)

The loop rule gives $RC\,\dfrac{dv}{dt} + v = V_0\cos\omega t$ for the output $v$. The general solution is a transient $Ae^{-t/RC}$, which dies out, plus a steady oscillation at the driving frequency. Try $v = V_{\text{out}}\cos(\omega t - \phi)$. Substituting and writing the right side as $V_0\cos\bigl((\omega t - \phi) + \phi\bigr) = V_0\cos\phi\cos(\omega t - \phi) - V_0\sin\phi\sin(\omega t - \phi)$, the cosine terms and the sine terms must match separately:

$$V_{\text{out}} = V_0\cos\phi, \qquad \omega RC\,V_{\text{out}} = V_0\sin\phi.$$

Dividing gives $\tan\phi = \omega RC$; squaring and adding gives the **gain**, the ratio of output to input amplitude:

$$\frac{V_{\text{out}}}{V_0} = \frac{1}{\sqrt{1 + (\omega RC)^2}}, \qquad \phi = \arctan(\omega RC).$$

At low frequency ($\omega RC \ll 1$) the output copies the input. At high frequency the gain falls roughly as $1/(\omega RC)$ and the output lags by nearly 90°. The two regimes meet at $\omega RC = 1$, the **cutoff frequency**

$$f_c = \frac{1}{2\pi RC},$$

where the gain is $1/\sqrt2 = 0.707$, the output power is half the low-frequency value, and the lag is 45°. Engineers call it the "−3 dB point", since $20\log_{10}(0.707) \approx -3$. Taking the output across the resistor instead gives the high-pass gain $\omega RC/\sqrt{1 + (\omega RC)^2}$, which has the same cutoff. In the module on magnetism and AC circuits the same results come out of the capacitor's reactance $1/(\omega C)$.

```plot
{"x": [0, 5], "y": [0, 1.1], "xLabel": "ωRC (= f / fc)", "yLabel": "gain Vout / Vin", "functions": [{"f": "1/sqrt(1 + x^2)"}, {"f": "x/sqrt(1 + x^2)", "dashed": true}], "points": [{"at": [1, 0.7071]}], "labels": [{"at": [3.4, 0.33], "text": "low-pass"}, {"at": [3.4, 0.86], "text": "high-pass (dashed)"}, {"at": [1.75, 0.66], "text": "0.707 at f = fc"}], "caption": "Gain of RC filters against frequency, measured in units of the cutoff frequency."}
```

### Example 3

A low-pass filter has $R = 10$ kΩ and $C = 16$ nF. Find its cutoff frequency, and the gain and phase lag at 200 Hz and at 5.0 kHz.

$RC = (10\times10^3)(16\times10^{-9}) = 1.6\times10^{-4}$ s, so $f_c = \dfrac{1}{2\pi(1.6\times10^{-4})} = 995$ Hz.

At 200 Hz: $\omega RC = 2\pi(200)(1.6\times10^{-4}) = 0.201$, gain $1/\sqrt{1.040} = 0.980$, lag $\arctan 0.201 = 11.4°$.

At 5.0 kHz: $\omega RC = 5.03$, gain $1/\sqrt{26.3} = 0.195$, lag $78.7°$. A 200 Hz hum passes almost untouched while 5 kHz hiss is cut to about a fifth of its amplitude, about 4% of its power.

## Two capacitors and the missing energy

A capacitor $C_1$ charged to $V_0$ is connected through a resistor $R$ to an uncharged capacitor $C_2$. Charge is conserved, so the final common voltage is $V_f = \dfrac{C_1V_0}{C_1 + C_2}$. Stored energy is *not* conserved:

$$U_i - U_f = \tfrac12C_1V_0^2 - \tfrac12(C_1 + C_2)V_f^2 = \tfrac12\frac{C_1C_2}{C_1 + C_2}V_0^2.$$

The recipe shows where it goes. The loop is a series RC circuit with the two capacitors in series, $C_s = C_1C_2/(C_1 + C_2)$, and an initial voltage difference $V_0$, so $I = (V_0/R)e^{-t/RC_s}$ and the heat in the resistor is

$$\int_0^\infty I^2R\,dt = \frac{V_0^2}{R}\cdot\frac{RC_s}{2} = \tfrac12C_sV_0^2,$$

exactly the missing energy, whatever $R$ is. With no resistor at all the circuit model breaks down: in reality the wires' small resistance, sparks and electromagnetic radiation carry the energy away.

### Example 4

Two 10 μF capacitors, one charged to 100 V, are joined through a 1.0 kΩ resistor. Find the final voltage, the energy lost and the time constant.

$V_f = 100\cdot\dfrac{10}{20} = 50$ V. Before: $\tfrac12(10\times10^{-6})(100)^2 = 0.050$ J. After: $\tfrac12(20\times10^{-6})(50)^2 = 0.025$ J. Half the energy, 0.025 J, becomes heat. $C_s = 5.0$ μF, so $\tau = (1.0\times10^3)(5.0\times10^{-6}) = 5.0$ ms.

## Common mistakes

- Letting the capacitor voltage jump at a switch; only currents and resistor voltages can jump.
- Using the original $R$ instead of $R_{\text{th}}$ seen from the capacitor, or using the charging time constant for a discharge through a different path.
- Starting a relaxation oscillator's first cycle at $V_{\text{off}}$ instead of zero.
- Forgetting $2\pi$: the cutoff is at $\omega = 1/RC$, which is $f = 1/(2\pi RC)$.
- Expecting stored energy to be conserved when capacitors share charge.

## Key points

- One capacitor: every quantity follows $x(t) = x_\infty + (x(0^+) - x_\infty)e^{-t/\tau}$ with $\tau = R_{\text{th}}C$.
- $V_C$ is continuous across a switch; at steady state the capacitor carries no current.
- Relaxation oscillator period: $T = RC\ln\dfrac{\mathcal{E} - V_{\text{off}}}{\mathcal{E} - V_{\text{on}}}$.
- RC low-pass: gain $1/\sqrt{1 + (\omega RC)^2}$, lag $\arctan(\omega RC)$; cutoff $f_c = 1/(2\pi RC)$, gain 0.707 and lag 45° there.
- Joining two capacitors through any resistor turns $\tfrac12C_sV_0^2$ into heat.
