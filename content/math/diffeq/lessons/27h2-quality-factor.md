---
id: de-m6-h-quality-factor
module: de-m6
title: 'How sharp is resonance? Damping ratio and the Q factor'
minutes: 45
honors: true
topics: [Quality factor]
drills: [de-m6-r2-q-bandwidth, de-m6-r2-log-decrement, de-m6-r2-rlc-q]
refs: [de-ref-solutions, de-ref-models]
---
## One number for "how lightly damped"

Lesson 24 classified free vibrations by comparing $\gamma^2$ with $4km$. Lesson 25 found the
steady-state amplitude of $mu'' + \gamma u' + ku = F_0\cos\omega t$ and its practical-resonance
peak, and Lesson 26 drew the gain curves: tall and narrow for light damping, low and broad for
heavy damping. Engineers and physicists summarize all of that with a single dimensionless
number, the quality factor $Q$. It tells you how many times a struck system rings before it
dies away, how much a resonant drive amplifies a static push, and how narrow a band of
frequencies it responds to. A radio tuner wants a large $Q$ (pick out one station); a car's
suspension wants a small one (no bouncing). This lesson defines $Q$ and derives each of those
three meanings from the equations you already have.

## Damping ratio and quality factor

Divide the equation by $m$ and use $\omega_0 = \sqrt{k/m}$:

$$u'' + \frac{\gamma}{m}u' + \omega_0^2u = \frac{F_0}{m}\cos\omega t.$$

The damping coefficient is measured against critical damping $\gamma_c = 2\sqrt{km}$ (Lesson 24)
by the **damping ratio**

$$\zeta = \frac{\gamma}{2\sqrt{km}} = \frac{\gamma}{\gamma_c},$$

and the **quality factor** is

$$Q = \frac{\sqrt{km}}{\gamma} = \frac{m\omega_0}{\gamma} = \frac{1}{2\zeta}.$$

With these, $\dfrac{\gamma}{m} = 2\zeta\omega_0 = \dfrac{\omega_0}{Q}$, so the equation becomes
$u'' + 2\zeta\omega_0u' + \omega_0^2u = (F_0/m)\cos\omega t$. Lesson 24's three cases read:

| Damping ratio | Quality factor | Free motion |
|---|---|---|
| $\zeta < 1$ | $Q > \tfrac12$ | underdamped |
| $\zeta = 1$ | $Q = \tfrac12$ | critically damped |
| $\zeta > 1$ | $Q < \tfrac12$ | overdamped |

Both numbers are pure numbers: $\gamma$ has units N·s/m and $\sqrt{km}$ has units
$\sqrt{(\text{N/m})(\text{kg})}$, which is also N·s/m, so the units cancel.

## Meaning 1: how long it rings

For underdamped free motion, $u = Re^{-\gamma t/(2m)}\cos(\mu t - \delta)$ (Lesson 24), and
$\dfrac{\gamma}{2m} = \dfrac{\omega_0}{2Q}$. So the envelope is $Re^{-\omega_0t/(2Q)}$. After a time
$t = 2\pi Q/\omega_0$, which is $Q$ natural periods, the envelope has shrunk by exactly
$e^{-\pi} \approx 0.043$. Rule of thumb: *a system with quality factor $Q$ rings for about $Q$
cycles* before its amplitude falls below about 4% of the start. (The count is approximate
because the actual quasi-period $2\pi/\mu$ is slightly longer than $2\pi/\omega_0$.)

Energy gives the classic definition. Energy is proportional to amplitude squared, so it decays
like $e^{-\omega_0t/Q}$. Over one period $2\pi/\omega_0$ the fraction lost is
$1 - e^{-2\pi/Q} \approx 2\pi/Q$ when $Q$ is large, so

$$Q \approx 2\pi\,\frac{\text{energy stored}}{\text{energy lost per cycle}}.$$

This is an approximation for light damping, though many physics books use it as the
definition.

### Measuring damping: the logarithmic decrement

In the lab you rarely know $\gamma$; you record a decaying oscillation. Successive peaks are
one quasi-period $T_d = 2\pi/\mu$ apart, and the cosine factor repeats exactly, so the ratio of
any two successive peaks is $e^{\gamma T_d/(2m)}$. Its natural log is the **logarithmic
decrement**

$$\delta = \ln\frac{u_n}{u_{n+1}} = \frac{\gamma T_d}{2m} = \frac{2\pi\zeta}{\sqrt{1 - \zeta^2}}.$$

Solving for $\zeta$: $\zeta = \dfrac{\delta}{\sqrt{4\pi^2 + \delta^2}}$. For light damping
$\zeta \approx \delta/(2\pi)$ and $Q \approx \pi/\delta$.

### Example 1

A mass on a spring is plucked and its displacement recorded. Two successive maxima are 5.0 cm
and 4.0 cm. Find $\delta$, $\zeta$ and $Q$.

- $\delta = \ln(5.0/4.0) = \ln 1.25 \approx 0.2231$.
- $\zeta = \dfrac{0.2231}{\sqrt{4\pi^2 + 0.2231^2}} \approx 0.0355$, so the system has about
  3.5% of critical damping.
- $Q = \dfrac{1}{2\zeta} \approx 14.09$. The shortcut $\pi/\delta \approx 14.08$ agrees to three
  figures, as expected for light damping.

So it rings for roughly 14 cycles. Using peaks several cycles apart is more accurate in
practice: if $u_{n+N}$ is $N$ peaks later, $\delta = \frac1N\ln(u_n/u_{n+N})$.

## Meaning 2: amplification at resonance

The steady-state amplitude from Lesson 25 is
$R(\omega) = \dfrac{F_0}{\sqrt{(k - m\omega^2)^2 + \gamma^2\omega^2}}$. Two values stand out:

- At $\omega = 0$ (a constant push) $R = F_0/k$, the **static deflection**.
- At $\omega = \omega_0$ the first term vanishes and
  $R = \dfrac{F_0}{\gamma\omega_0} = \dfrac{m\omega_0}{\gamma}\cdot\dfrac{F_0}{m\omega_0^2} = Q\,\dfrac{F_0}{k}$.

So *driving at the natural frequency multiplies the static deflection by $Q$*. The true peak
sits slightly lower, at $\omega_{\max}^2 = \omega_0^2 - \dfrac{\gamma^2}{2m^2} = \omega_0^2\left(1 - \dfrac{1}{2Q^2}\right)$
(Lesson 25), and exists only when $Q > 1/\sqrt2$ (equivalently $\zeta < 1/\sqrt2$). Its height
is $R_{\max} = \dfrac{Q\,F_0/k}{\sqrt{1 - 1/(4Q^2)}}$, barely more than $QF_0/k$ when $Q$ is large.

### Example 2

A machine part has $m = 1$ kg, $k = 100$ N/m and $\gamma = 0.5$ N·s/m, and is shaken by
$F(t) = 2\cos\omega t$ newtons. Compare its static deflection with its response at resonance.

- $\omega_0 = \sqrt{100} = 10$ rad/s; $Q = \dfrac{\sqrt{100 \cdot 1}}{0.5} = 20$ ($\zeta = 0.025$).
- Static deflection $F_0/k = 2/100 = 0.02$ m.
- At $\omega = 10$: $R = Q \cdot 0.02 = 0.4$ m, twenty times larger.
- The exact peak is at $\omega_{\max} = 10\sqrt{1 - 1/800} \approx 9.994$ rad/s with
  $R_{\max} \approx 0.4001$ m: indistinguishable from the value at $\omega_0$.

## Meaning 3: bandwidth

How wide is the peak? The cleanest measure uses power. In steady state the damper dissipates
power $\gamma u'^2$; with $u = R\cos(\omega t - \phi)$ the velocity has amplitude $\omega R$, and
the average of $\sin^2$ over a cycle is $\tfrac12$, so the average power is

$$P(\omega) = \tfrac12\gamma\omega^2R^2 = \frac{F_0^2\,\gamma\,\omega^2}{2\big[(k - m\omega^2)^2 + \gamma^2\omega^2\big]}.$$

(The energy stored is the same at the start and end of each cycle, so this is also the average
power the force supplies.) Dividing top and bottom by $\omega^2$, the denominator becomes
$2\big[(k/\omega - m\omega)^2 + \gamma^2\big]$, smallest when $k/\omega = m\omega$. So, unlike
the amplitude, *power peaks exactly at $\omega_0$*, with $P_{\max} = F_0^2/(2\gamma)$.

The **half-power points** are the two frequencies where $P = \tfrac12P_{\max}$. That happens when
$(k - m\omega^2)^2 = \gamma^2\omega^2$, that is, $m\omega^2 \pm \gamma\omega - k = 0$. The
positive roots are

$$\omega_\pm = \frac{\sqrt{\gamma^2 + 4mk} \pm \gamma}{2m},$$

and the distance between them, the **bandwidth**, is exactly

$$\Delta\omega = \omega_+ - \omega_- = \frac{\gamma}{m} = \frac{\omega_0}{Q}.$$

So $Q = \omega_0/\Delta\omega$: *the quality factor is the resonant frequency divided by the
width of the peak.* A bonus: $\omega_+\omega_- = k/m = \omega_0^2$, so $\omega_0$ is the
geometric mean of the two half-power points. And since $\tan\phi = \gamma\omega/(k - m\omega^2)$
equals $\pm1$ there, the phase lag is exactly $\pi/4$ at $\omega_-$ and $3\pi/4$ at $\omega_+$.

```plot
{"x": [0.5, 1.5], "y": [0, 1.1], "xLabel": "ω", "yLabel": "P / P_max", "functions": [{"f": "0.04x^2/((1-x^2)^2+0.04x^2)", "label": "Q = 5"}, {"f": "0.5", "dashed": true}], "points": [{"at": [0.905, 0.5], "label": "ω₋"}, {"at": [1.105, 0.5], "label": "ω₊"}, {"at": [1, 1], "label": "peak at ω₀ = 1"}], "caption": "Average power for m = k = 1, γ = 0.2 (Q = 5). The curve crosses half its peak at ω₋ ≈ 0.905 and ω₊ ≈ 1.105, a bandwidth of exactly γ/m = 0.2 = ω₀/Q."}
```

A caution on definitions. Many books define the bandwidth by power, as here (equivalently, by
where the *velocity* amplitude falls to $1/\sqrt2$ of its peak). If you use the *displacement*
amplitude $R$ instead, the band is not exactly $\gamma/m$ wide, only approximately so for large
$Q$. For the lightly damped systems where $Q$ is used, the difference is negligible.

### Example 3: a tuned circuit

A series RLC circuit has $L = 0.01$ H, $C = 1\ \mu$F $= 10^{-6}$ F and $R = 5$ Ω. Using the
dictionary of Lesson 25 ($m \to L$, $\gamma \to R$, $k \to 1/C$), find $\omega_0$, $Q$ and the
bandwidth.

- $\omega_0 = \dfrac{1}{\sqrt{LC}} = \dfrac{1}{\sqrt{10^{-8}}} = 10^4$ rad/s (about 1592 Hz).
- $Q = \dfrac{\sqrt{km}}{\gamma}$ becomes $Q = \dfrac{1}{R}\sqrt{\dfrac{L}{C}} = \dfrac15\sqrt{10^4} = 20$.
- $\Delta\omega = R/L = 500$ rad/s (about 80 Hz), and indeed $\omega_0/Q = 10^4/20 = 500$.

Halving $R$ doubles $Q$ and halves the bandwidth: the circuit becomes more selective. That is
the trade-off in a tuner: a narrow band rejects neighboring stations, but a signal must sit
closer to $\omega_0$ to get through.

## Common mistakes

- **Confusing $\zeta$ and $Q$.** They are reciprocal up to a factor of 2: $Q = 1/(2\zeta)$.
  Critical damping is $\zeta = 1$, $Q = \tfrac12$, not $Q = 1$.
- **Using natural log vs. common log.** The logarithmic decrement uses $\ln$.
- **Peaks not one cycle apart.** For peaks $N$ cycles apart, divide the log ratio by $N$.
- **Expecting the amplitude peak at $\omega_0$.** Power peaks exactly at $\omega_0$; the
  displacement amplitude peaks slightly below, at $\omega_0\sqrt{1 - 1/(2Q^2)}$.
- **Bandwidth in hertz vs rad/s.** $\Delta\omega = \gamma/m$ is in rad/s; divide by $2\pi$ for Hz.
  The ratio $Q = \omega_0/\Delta\omega = f_0/\Delta f$ is the same either way.

## Key points

- $\zeta = \gamma/(2\sqrt{km})$ and $Q = \sqrt{km}/\gamma = m\omega_0/\gamma = 1/(2\zeta)$;
  critical damping is $\zeta = 1$, $Q = \tfrac12$.
- Ringing: the envelope is $e^{-\omega_0t/(2Q)}$, so a struck system rings for about $Q$ cycles.
- Logarithmic decrement $\delta = \ln(u_n/u_{n+1}) = 2\pi\zeta/\sqrt{1 - \zeta^2}$; $Q \approx \pi/\delta$.
- At $\omega_0$ the steady amplitude is $Q$ times the static deflection $F_0/k$.
- Power peaks at $\omega_0$; half-power bandwidth $\Delta\omega = \gamma/m = \omega_0/Q$.
- Series RLC: $\omega_0 = 1/\sqrt{LC}$, $Q = \frac1R\sqrt{L/C}$, $\Delta\omega = R/L$.
