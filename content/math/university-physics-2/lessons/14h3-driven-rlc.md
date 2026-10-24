---
id: phys-m10-h-driven-rlc
module: phys-m10
title: 'Driven RLC circuits: phasors, resonance and Q'
minutes: 45
topics: [Driven RLC circuits]
drills: [phys-m10-r2-rlc-phasor, phys-m10-r2-rlc-resonance]
refs: [phys-ref-em-modern]
honors: true
---
## Where the AC formulas come from

The inductance lesson gave the series RLC results as formulas: reactances $X_L = \omega L$ and $X_C = 1/(\omega C)$, impedance $Z = \sqrt{R^2 + (X_L - X_C)^2}$, and phase angle $\tan\phi = (X_L - X_C)/R$. This honors lesson shows where they come from, using **phasors**, and then studies what happens as the driving frequency is swept through resonance. The key new idea is the **quality factor** $Q$, one number that says how sharp the resonance is, how long the circuit rings, and how much larger the voltages inside the circuit can be than the source voltage. The same mathematics describes a driven mass on a spring, a tuning fork, a laser cavity and an MRI coil.

## Phasors

A sinusoidal quantity $A\cos(\omega t + \alpha)$ can be pictured as an arrow of length $A$ rotating counterclockwise at angular speed $\omega$; the quantity at any moment is the arrow's horizontal projection. This rotating arrow is a **phasor**. All the voltages and currents in a linear AC circuit rotate at the same $\omega$, so their phasors keep fixed angles to each other, and we can draw them frozen at one instant. Adding two sinusoids of the same frequency is then just adding their phasors as vectors.

In a series circuit the same current $i = I\cos\omega t$ flows through every element. The voltage across each one follows from its own law.

- *Resistor:* $v_R = iR$, in step with the current. Amplitude $IR$.
- *Inductor:* $v_L = L\,di/dt = -\omega LI\sin\omega t = \omega LI\cos(\omega t + 90^\circ)$. It leads the current by $90^\circ$, amplitude $IX_L$.
- *Capacitor:* $q = \int i\,dt = (I/\omega)\sin\omega t$, so $v_C = q/C = \dfrac{I}{\omega C}\cos(\omega t - 90^\circ)$. It lags the current by $90^\circ$, amplitude $IX_C$.

So the reactances are not new assumptions; they fall out of differentiating and integrating a sine. The source voltage is the sum of the three, which in phasor form is a right triangle: $IR$ along the current, and $I(X_L - X_C)$ at right angles to it.

![Phasor diagram: the resistor voltage lies along the current, the inductor voltage points up, the capacitor voltage points down, and the source voltage is the diagonal from their sum, at angle phi above the resistor voltage](images/phys-m10-phasor.svg)

Pythagoras gives the source amplitude $V = I\sqrt{R^2 + (X_L - X_C)^2} = IZ$, and the angle between the source voltage and the current is $\phi$, with $\tan\phi = (X_L - X_C)/R$. When $X_L > X_C$ the source voltage leads the current: the current lags.

### Example 1

A series circuit with $R = 30$ Ω, $X_L = 80$ Ω and $X_C = 40$ Ω is driven by a 100 V (rms) source. Find the current, the rms voltage across each element, and the phase angle.

$Z = \sqrt{30^2 + 40^2} = 50$ Ω, so $I_{\text{rms}} = 100/50 = 2.0$ A.

$V_R = 2.0(30) = 60$ V, $V_L = 2.0(80) = 160$ V, $V_C = 2.0(40) = 80$ V. Phase angle $\phi = \tan^{-1}(40/30) = 53.1^\circ$, current lagging.

The three meter readings add to 300 V, three times the source voltage. There is no contradiction: they are rms values of voltages that peak at different times, and they add as phasors: $\sqrt{60^2 + (160 - 80)^2} = 100$ V. The voltage across the inductor alone exceeds the source voltage.

## Complex impedance

Engineers usually do phasor arithmetic with complex numbers. Write $j = \sqrt{-1}$ (the letter $i$ is taken by current). Each element gets a complex **impedance**: $Z_R = R$, $Z_L = j\omega L$, $Z_C = \dfrac{1}{j\omega C} = -\dfrac{j}{\omega C}$. Multiplying by $j$ rotates a phasor $90^\circ$ forward, which is exactly the inductor's lead; dividing by $j$ is the capacitor's lag. Impedances then combine exactly like resistances: in series they add, and in parallel their reciprocals add. The magnitude of the total $Z$ is the ratio of voltage amplitude to current amplitude, and its angle is the phase by which the voltage leads the current.

For the circuit of Example 1, $Z = 30 + j(80 - 40) = 30 + 40j$, with magnitude 50 Ω and angle $53.1^\circ$, the same result in one line.

### Example 2

A 40 Ω resistor is connected in parallel with an inductor whose reactance is 30 Ω at the operating frequency. Find the combination's impedance and phase.

$Z = \dfrac{(40)(30j)}{40 + 30j} = \dfrac{1200j(40 - 30j)}{40^2 + 30^2} = \dfrac{36000 + 48000j}{2500} = 14.4 + 19.2j$ Ω.

$|Z| = \sqrt{14.4^2 + 19.2^2} = 24$ Ω, and the angle is $\tan^{-1}(19.2/14.4) = 53.1^\circ$: the voltage leads the total current by $53.1^\circ$. Without complex numbers, this parallel combination would need a separate phasor diagram for the currents.

## The resonance curve

Hold the source amplitude fixed and sweep the frequency of a series RLC circuit. The current amplitude is $V/Z$, largest when $X_L = X_C$, at $\omega_0 = 1/\sqrt{LC}$. Only the resistor absorbs energy, so the average power is

$$P(\omega) = I_{\text{rms}}^2R = \frac{V_{\text{rms}}^2R}{R^2 + \left(\omega L - \dfrac{1}{\omega C}\right)^2},$$

with its peak value $V_{\text{rms}}^2/R$ at resonance. Far below resonance the capacitor's reactance is huge; far above it the inductor's is. Either way little current flows.

## The quality factor

How narrow is the peak? Define the **quality factor**

$$Q = \frac{\omega_0L}{R} = \frac1R\sqrt{\frac LC}.$$

With it, the reactance difference can be written $\omega L - \dfrac{1}{\omega C} = RQ\left(\dfrac{\omega}{\omega_0} - \dfrac{\omega_0}{\omega}\right)$, so

$$\frac{P}{P_{\max}} = \frac{1}{1 + Q^2\left(\dfrac{\omega}{\omega_0} - \dfrac{\omega_0}{\omega}\right)^2}.$$

The shape of the resonance depends only on $Q$. A large $Q$ means a tall, narrow peak.

```plot
{"x": [0.4, 1.8], "y": [0, 1.1], "functions": [{"f": "1/(1 + 4*(x - 1/x)^2)", "dashed": true, "label": "Q = 2"}, {"f": "1/(1 + 64*(x - 1/x)^2)", "label": "Q = 8"}], "xLabel": "ω / ω₀", "yLabel": "P / P_max", "caption": "Resonance curves of average power for two quality factors. The higher-Q circuit has a much narrower peak"}
```

*Bandwidth.* The **half-power points** are the frequencies where $P = \tfrac12P_{\max}$, which happens when $|\omega L - 1/(\omega C)| = R$. Multiplying through by $\omega/L$ gives $\omega^2 \mp \dfrac RL\omega - \omega_0^2 = 0$, whose positive roots are $\omega_\pm = \sqrt{\left(\dfrac{R}{2L}\right)^2 + \omega_0^2} \pm \dfrac{R}{2L}$. Their difference is exactly

$$\Delta\omega = \omega_+ - \omega_- = \frac RL = \frac{\omega_0}{Q},$$

and their product is $\omega_0^2$, so the resonance sits at the geometric mean of the two. The same ratio holds in hertz: $\Delta f = f_0/Q$.

*Energy meaning.* At resonance the energy stored in the circuit stays constant at $\tfrac12LI_0^2$ (it sloshes between $L$ and $C$), while the resistor removes $\tfrac12I_0^2R$ times one period $2\pi/\omega_0$ each cycle. Their ratio gives

$$Q = 2\pi\,\frac{\text{energy stored}}{\text{energy lost per cycle}}.$$

This definition works for any resonator, from a guitar string to a quartz crystal. It also explains the free ringing of the circuit: with no source, a high-$Q$ circuit loses only a fraction $2\pi/Q$ of its energy per cycle, so it oscillates for about $Q/\pi$ cycles before its amplitude falls to $1/e$ (a good approximation when $Q$ is well above 1). If $Q < \tfrac12$, which is $R > 2\sqrt{L/C}$, it does not oscillate at all.

*Voltage magnification.* At resonance the current is $V/R$, so the voltage across the inductor is $\dfrac VR\omega_0L = QV$, and the voltage across the capacitor is the same. The two cancel each other in the loop, but each one alone is $Q$ times the source voltage. A circuit with $Q = 50$ driven at 120 V puts 6000 V across its capacitor, which is why parts in resonant circuits are rated well above the supply voltage.

### Example 3

A series circuit has $L = 0.10$ H, $C = 1.0$ μF and $R = 20$ Ω, driven by a 10 V (rms) source. Find the resonant frequency, $Q$, the bandwidth, the current at resonance and the capacitor voltage at resonance.

$\omega_0 = 1/\sqrt{(0.10)(1.0\times10^{-6})} = 3162$ rad/s, so $f_0 = 503$ Hz.

$Q = \dfrac{\omega_0L}{R} = \dfrac{(3162)(0.10)}{20} = 15.8$.

$\Delta\omega = R/L = 200$ rad/s, or $\Delta f = 31.8$ Hz. The half-power points are at 3064 and 3264 rad/s (488 Hz and 519 Hz).

At resonance $I_{\text{rms}} = 10/20 = 0.50$ A and $V_C = QV = 158$ V (rms), nearly sixteen times the source voltage.

### Example 4

An AM radio tuner selects a station at 1000 kHz. In North America, AM stations are spaced 10 kHz apart. Roughly what $Q$ does the tuner need so that its bandwidth is no wider than one station spacing?

$Q = f_0/\Delta f = 1000/10 = 100$. A tuner with $Q = 20$ would have a 50 kHz bandwidth and pick up several stations at once. (Real receivers use several tuned stages, so this is a simplified estimate.)

## Common mistakes

- Adding rms voltages around an AC circuit as plain numbers. They add as phasors, so the element voltages can sum to more than the source voltage.
- Getting the leads backwards: inductor voltage leads the current; capacitor voltage lags it.
- Taking bandwidth from the half-current points. The standard bandwidth uses the half-power points, where the current is $1/\sqrt2$ of its peak.
- Assuming a resonant circuit's voltages can never exceed the source. At resonance $V_L = V_C = QV$.
- Raising $R$ to sharpen a resonance. More resistance lowers $Q$ and widens the peak.

## Key points

- Phasors: $V_R$ in step with $I$, $V_L$ leads by $90^\circ$, $V_C$ lags by $90^\circ$; the source is their vector sum, giving $Z$ and $\tan\phi = (X_L - X_C)/R$.
- Complex impedances $R$, $j\omega L$, $1/(j\omega C)$ combine like resistances.
- $P(\omega) = V_{\text{rms}}^2R/Z^2$, peaking at $\omega_0 = 1/\sqrt{LC}$.
- $Q = \omega_0L/R = \dfrac1R\sqrt{L/C} = 2\pi\times$ (energy stored)/(energy lost per cycle).
- Bandwidth $\Delta\omega = R/L = \omega_0/Q$ between half-power points; at resonance $V_L = V_C = QV$.
