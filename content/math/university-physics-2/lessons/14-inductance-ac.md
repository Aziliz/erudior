---
id: phys-inductance
module: phys-m10
title: Inductance, RL and LC circuits, and AC
minutes: 45
topics: [Inductance, AC circuits]
drills: [phys-rl-time, phys-lc-frequency, phys-ac-rms, phys-power-factor]
refs: [phys-ref-em-modern]
---
## Circuits that resist change

Faraday's law applies to a coil's own field too. When the current in a coil changes, its own magnetic flux changes, inducing an emf in the coil itself that opposes the change. This self-induction gives circuits a kind of inertia for current, just as capacitors give them a kind of storage for charge. This lesson introduces inductance, the RL and LC circuits built with it, and a brief look at alternating-current circuits.

## Inductance

A coil's flux is proportional to its current, so the self-induced emf is proportional to the rate of change of current:

$$\mathcal{E}_L = -L\frac{dI}{dt}.$$

The constant $L$ is the coil's **inductance**, measured in **henries** (H): $1\text{ H} = 1$ V·s/A. A component designed for inductance is an **inductor**. By Lenz's law the emf opposes the change: it fights a rising current and tries to keep a falling current going. A steady current produces no emf at all.

For a long solenoid with $N$ turns, length $\ell$ and cross-section $A$, $B = \mu_0(N/\ell)I$ and the total flux linkage is $N\Phi_B = \mu_0N^2AI/\ell$, so

$$L = \frac{\mu_0N^2A}{\ell}.$$

An iron core multiplies it greatly.

*Energy.* Building up current $I$ in an inductor takes work against its back emf, stored in the magnetic field:

$$U_L = \tfrac12LI^2.$$

The magnetic energy density is $u_B = \dfrac{B^2}{2\mu_0}$, the counterpart of $\tfrac12\varepsilon_0E^2$.

*Mutual inductance.* When two coils sit near each other, a changing current in one sends changing flux through the other and induces an emf there: $\mathcal{E}_2 = -M\,dI_1/dt$, where the **mutual inductance** $M$ (also in henries) depends only on the coils' geometry (and any iron core) and is the same in both directions. A transformer is two coils with a large $M$; wireless phone chargers work the same way.

### Example 1

A solenoid 0.30 m long with 1500 turns has cross-sectional area $4.0\times10^{-4}$ m². Find its inductance, the emf when its current rises at 50 A/s, and its stored energy at 2.0 A.

$L = \dfrac{(4\pi\times10^{-7})(1500)^2(4.0\times10^{-4})}{0.30} = 3.77\times10^{-3}$ H $= 3.77$ mH.

$|\mathcal{E}| = L\dfrac{dI}{dt} = (3.77\times10^{-3})(50) = 0.19$ V.

$U = \tfrac12(3.77\times10^{-3})(2.0)^2 = 7.5\times10^{-3}$ J.

## RL circuits

Connect an inductor $L$ in series with a resistor $R$ and a battery $\mathcal{E}$. At the instant the switch closes, the inductor prevents any sudden jump in current, so $I = 0$ at first and the full emf appears across the inductor. The current then rises toward its final value $\mathcal{E}/R$ (the derivation is at the end of the lesson):

$$I(t) = \frac{\mathcal{E}}{R}\left(1 - e^{-t/\tau}\right), \qquad \tau = \frac LR.$$

The time constant $L/R$ plays the same role as $RC$. If the battery is then removed (with a path left for the current), the current decays as $I = I_0e^{-t/\tau}$. An inductor acts like an open circuit at the instant of switching on and like a plain wire once the current is steady, the opposite of a capacitor.

Breaking an inductive circuit abruptly forces $dI/dt$ to be huge, inducing a large voltage that can spark across the switch. Car ignition coils use this deliberately to make the tens of kilovolts that fire a spark plug.

### Example 2

A 0.20 H inductor and a 40 Ω resistor are connected to a 12 V battery. Find the time constant, the final current, and the current after 10 ms.

$\tau = 0.20/40 = 5.0$ ms. Final current $= 12/40 = 0.30$ A. At 10 ms $= 2\tau$: $I = 0.30(1 - e^{-2}) = 0.26$ A.

## LC circuits

Connect a charged capacitor to an inductor (no resistor). The capacitor discharges, building current and storing energy in the inductor's field; the inductor then keeps the current going and charges the capacitor the other way; and so on. Energy sloshes between electric and magnetic forms, exactly like a mass on a spring sloshes between potential and kinetic energy. The oscillation frequency is

$$\omega = \frac{1}{\sqrt{LC}}, \qquad f = \frac{1}{2\pi\sqrt{LC}}.$$

The analogy is precise: charge ↔ position, current ↔ velocity, $L$ ↔ mass, $1/C$ ↔ spring constant. Adding resistance damps the oscillation, like friction. Radio tuners are LC circuits: turning the dial changes $C$ so the circuit resonates with one station's frequency.

### Example 3

What capacitance, with a 2.0 μH inductor, tunes a radio to 100 MHz?

$C = \dfrac{1}{(2\pi f)^2L} = \dfrac{1}{(6.28\times10^8)^2(2.0\times10^{-6})} = 1.27\times10^{-12}$ F $\approx 1.3$ pF.

## AC circuits, briefly

Power outlets supply **alternating current**: $V(t) = V_0\sin(\omega t)$, at 60 Hz in North America and 50 Hz in much of the world. Because the voltage keeps changing sign, we quote **rms** (root-mean-square) values, the equivalent steady values that deliver the same average power to a resistor:

$$V_{\text{rms}} = \frac{V_0}{\sqrt2}, \qquad I_{\text{rms}} = \frac{I_0}{\sqrt2}, \qquad P_{\text{avg}} = I_{\text{rms}}V_{\text{rms}} \text{ (resistor)}.$$

"120 V" household voltage is the rms value; the peak is $120\sqrt2 = 170$ V.

Capacitors and inductors respond to AC with frequency-dependent **reactance** (opposition to AC, in ohms):

$$X_C = \frac{1}{\omega C}, \qquad X_L = \omega L.$$

A capacitor blocks low frequencies and passes high ones; an inductor does the reverse. In a series RLC circuit the total opposition, the **impedance**, is

$$Z = \sqrt{R^2 + (X_L - X_C)^2}, \qquad I_{\text{rms}} = \frac{V_{\text{rms}}}{Z}.$$

The current is largest when $X_L = X_C$, at the resonant frequency $\omega_0 = 1/\sqrt{LC}$: the same frequency at which the LC circuit oscillates on its own.

In a capacitor or inductor the current and voltage are a quarter cycle out of step (current leads voltage by $90^\circ$ in a capacitor and lags it by $90^\circ$ in an inductor), so on average they absorb no energy. In the series RLC circuit the current is out of step with the source by the **phase angle** $\phi$, where $\tan\phi = (X_L - X_C)/R$. When $X_L > X_C$, $\phi$ is positive and the current lags the voltage (the circuit acts inductively); when $X_C > X_L$ it leads. Only the resistor dissipates energy: $P_{\text{avg}} = I_{\text{rms}}V_{\text{rms}}\cos\phi = I_{\text{rms}}^2R$. The factor $\cos\phi = R/Z$ is the **power factor**: 1 at resonance, near 0 for an almost purely reactive load.

## Deriving the RL, LC and rms results

Apply the loop rule to the RL circuit, with the inductor contributing $-L\,dI/dt$:

$$\mathcal{E} - IR - L\frac{dI}{dt} = 0.$$

Separating variables, $\dfrac{dI}{\mathcal{E}/R - I} = \dfrac RL\,dt$, integrates to $I = \dfrac{\mathcal{E}}{R}(1 - e^{-Rt/L})$. The energy stored follows from $P = LI\,\dfrac{dI}{dt}$: $U = \int_0^IL I'\,dI' = \tfrac12LI^2$.

For the LC circuit, the loop rule gives $L\dfrac{d^2q}{dt^2} + \dfrac qC = 0$, the simple harmonic oscillator equation $\ddot q = -\dfrac{1}{LC}q$, so $q = Q_0\cos(\omega t)$ with $\omega = 1/\sqrt{LC}$. Adding a resistor gives $L\ddot q + R\dot q + q/C = 0$, the damped oscillator.

The rms value comes from averaging $\sin^2$ over a cycle: $\dfrac1T\int_0^T V_0^2\sin^2(\omega t)\,dt = \dfrac{V_0^2}{2}$, so $V_{\text{rms}} = V_0/\sqrt2$.

## Common mistakes

- Thinking an inductor opposes current itself (it opposes *changes* in current).
- Using $RC$ for an RL time constant (it's $L/R$).
- Confusing peak and rms values (household 120 V is rms).
- Forgetting that $X_C$ falls and $X_L$ rises with frequency.

## Key points

- $\mathcal{E}_L = -L\,dI/dt$; solenoid $L = \mu_0N^2A/\ell$; energy $\tfrac12LI^2$.
- RL: $\tau = L/R$; $I = (\mathcal{E}/R)(1 - e^{-t/\tau})$.
- LC: $f = \dfrac{1}{2\pi\sqrt{LC}}$, energy oscillates like a mass on a spring.
- AC: $V_{\text{rms}} = V_0/\sqrt2$; $X_C = 1/(\omega C)$, $X_L = \omega L$, $Z = \sqrt{R^2 + (X_L - X_C)^2}$.
- Mutual inductance: $\mathcal{E}_2 = -M\,dI_1/dt$. Phase angle $\tan\phi = (X_L - X_C)/R$; power $P = I_{\text{rms}}V_{\text{rms}}\cos\phi$, power factor $\cos\phi = R/Z$.
