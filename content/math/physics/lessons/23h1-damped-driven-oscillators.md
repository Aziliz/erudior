---
id: phys-m6-h-damped-driven
module: phys-m6
title: Damped and driven oscillators
minutes: 45
honors: true
topics: [Damped oscillations, Driven oscillations]
drills: [phys-m6-r2-damped-decay, phys-m6-r2-driven-amplitude, phys-m6-r2-critical-damping]
refs: [phys-ref-waves-thermo]
---
## Beyond the ideal spring

The simple harmonic motion lesson ended with two short paragraphs: real oscillators lose energy (damping), and a periodic push at the natural frequency builds up a large amplitude (resonance). This lesson puts numbers on both. You'll learn how fast an oscillation dies away, what a single number called the quality factor tells you about any oscillator, how a driven oscillator responds at every driving frequency, and why engineers sometimes add damping on purpose. The results for the motion itself come from solving Newton's second law with calculus; here they are stated and then checked and used with algebra.

## A model of damping

Many damping forces, at least for slow motion, are roughly proportional to the velocity and opposite to it:

$$F_{\text{damp}} = -bv,$$

where the **damping constant** $b$ (in kg/s, the same as N·s/m) measures how strong the damping is. Air drag on a slow pendulum, oil being pushed through a car's shock absorber and the eddy-current brake of a lab balance all behave roughly this way. (Fast motion through air has drag closer to $v^2$, and sliding friction is roughly constant; the model below is a simplification that works well for many oscillators.)

With this force added to $-kx$, the solution for light damping is

$$x(t) = A_0\,e^{-bt/(2m)}\cos(\omega_d t), \qquad \omega_d = \sqrt{\omega_0^2 - \left(\frac{b}{2m}\right)^2},$$

where $\omega_0 = \sqrt{k/m}$ is the undamped (natural) angular frequency. Two things to notice:

- The amplitude $A_0e^{-bt/(2m)}$ decays *exponentially*: it shrinks by the same fraction in every equal time interval, just as a radioactive sample loses the same fraction every half-life. So the amplitude falls by the same fraction each cycle.
- Light damping barely changes the frequency. The correction to $\omega_0$ involves $(b/2m)^2$, which is tiny when the damping is weak.

Since energy is proportional to amplitude squared ($E = \tfrac12kA^2$), the energy decays twice as fast: $E(t) = E_0e^{-bt/m}$.

```plot
{"x": [0, 10], "y": [-1.2, 1.2], "xLabel": "time t (s)", "yLabel": "x / A0", "functions": [{"f": "exp(-0.15*x)*cos(2*pi*x)"}, {"f": "exp(-0.15*x)", "dashed": true}, {"f": "-exp(-0.15*x)", "dashed": true}], "caption": "Light damping: the oscillation stays inside a shrinking exponential envelope (dashed), losing the same fraction of amplitude each cycle"}
```

## Underdamped, critically damped, overdamped

The formula for $\omega_d$ stops making sense when $b/(2m)$ reaches $\omega_0$. That boundary splits oscillators into three regimes:

- **Underdamped** ($b < 2\sqrt{mk}$): the system oscillates with shrinking amplitude. Guitar strings, pendulums and tuning forks are strongly underdamped.
- **Critically damped** ($b = 2\sqrt{mk}$): the system returns to equilibrium as fast as possible *without* overshooting.
- **Overdamped** ($b > 2\sqrt{mk}$): the system creeps back to equilibrium without overshooting, more slowly than with critical damping, because the large drag force holds it back.

The critical value $b_c = 2\sqrt{mk} = 2m\omega_0$ comes from setting $b/(2m) = \omega_0$.

```plot
{"x": [0, 6], "y": [-0.8, 1.1], "xLabel": "time t (s)", "yLabel": "x / x0", "functions": [{"f": "exp(-0.4*x)*(cos(1.9596*x) + 0.2041*sin(1.9596*x))", "label": "underdamped"}, {"f": "(1 + 2*x)*exp(-2*x)", "label": "critical"}, {"f": "(7.4641*exp(-0.5359*x) - 0.5359*exp(-7.4641*x))/6.9282", "dashed": true, "label": "overdamped"}], "caption": "The same oscillator (ω0 = 2 rad/s) released from rest at x0 with three amounts of damping"}
```

Devices that must settle quickly use damping near critical: analog meter needles, door closers, and car suspensions (which are usually tuned somewhat below critical, accepting a little overshoot for a softer ride).

### Example 1

A 0.50 kg block on a spring with $k = 200$ N/m has damping constant $b = 0.40$ kg/s. (a) Is it underdamped? (b) How long until the amplitude halves, and how many oscillations is that? (c) How much does damping change the frequency?

(a) $b_c = 2\sqrt{mk} = 2\sqrt{0.50 \times 200} = 20$ kg/s. Since $0.40 < 20$, it is underdamped (lightly).

(b) Half amplitude means $e^{-bt/(2m)} = \tfrac12$, so $\dfrac{bt}{2m} = \ln 2$ and

$$t_{1/2} = \frac{2m\ln 2}{b} = \frac{2(0.50)(0.693)}{0.40} = 1.73 \text{ s}.$$

With $\omega_0 = \sqrt{200/0.50} = 20$ rad/s, the period is $T = 2\pi/20 = 0.314$ s, so that's $1.73/0.314 \approx 5.5$ oscillations.

(c) $b/(2m) = 0.40$ s⁻¹, so $\omega_d = \sqrt{20^2 - 0.40^2} = 19.996$ rad/s, a change of 0.02%. Light damping shortens the motion's life, not its rhythm.

## The quality factor

One number summarizes how lightly damped an oscillator is. The **quality factor** is

$$Q = \frac{m\omega_0}{b} = \frac{\sqrt{mk}}{b}.$$

It is dimensionless, and a large $Q$ means light damping. For the block in Example 1, $Q = (0.50)(20)/0.40 = 25$. Three rules of thumb make $Q$ useful (the first two hold well when $Q$ is large, say above 10):

- **Energy per cycle.** Each cycle loses a fraction of about $2\pi/Q$ of the stored energy. Equivalently, $Q \approx 2\pi \times \dfrac{\text{energy stored}}{\text{energy lost per cycle}}$, which is often used as the definition.
- **Ringing time.** After $Q$ cycles, the amplitude has fallen to $e^{-\pi} \approx 4\%$ of its starting value. (Check: $Q$ cycles take $t = Q\cdot\dfrac{2\pi}{\omega_0} = \dfrac{2\pi m}{b}$, and then $\dfrac{bt}{2m} = \pi$.) So $Q$ is roughly "how many times it rings before it's nearly quiet."
- **Regimes.** Critical damping is exactly $Q = \tfrac12$; underdamped means $Q > \tfrac12$.

Very rough typical values: a car suspension well under 1, a playground swing in the tens, a tuning fork in the thousands, and the quartz crystal in a watch (which vibrates at 32 768 Hz) tens of thousands or more. A high $Q$ is what makes a good clock: the oscillator keeps its own rhythm and needs only a tiny push each cycle.

### Example 2

A pendulum's amplitude drops by 2.0% each cycle. (a) What fraction of the amplitude is left after 50 cycles? (b) What fraction of its energy does it lose per cycle? (c) Estimate $Q$.

(a) Each cycle multiplies the amplitude by 0.980, so after 50 cycles: $0.980^{50} = 0.364$, about 36%. (Not $1 - 50(0.02) = 0$: the losses compound, like interest.)

(b) Energy goes as amplitude squared: $0.980^2 = 0.9604$, so it loses $1 - 0.9604 = 0.0396$, about 4.0% per cycle, twice the amplitude percentage (for small losses).

(c) $Q \approx 2\pi/0.0396 \approx 160$.

## Driven oscillations and resonance

Now push the oscillator with a periodic force $F_0\cos(\omega t)$, where $\omega$ is the **driving frequency**, chosen by whoever is pushing, and $\omega_0$ is the oscillator's own natural frequency. At first the motion is a mess (a mix of the natural oscillation and the forced one), but the natural part dies away with damping. What remains is the **steady state**: the oscillator moves at the *driving* frequency, with amplitude

$$A = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + (b\omega/m)^2}}.$$

Look at three cases:

- **Slow driving** ($\omega \ll \omega_0$): $A \approx \dfrac{F_0/m}{\omega_0^2} = \dfrac{F_0}{k}$, the stretch a steady force $F_0$ would produce. The spring simply follows the force.
- **Driving at the natural frequency** ($\omega = \omega_0$): the first term vanishes and $A = \dfrac{F_0}{b\omega_0} = Q\,\dfrac{F_0}{k}$. The response is $Q$ times the static stretch, and only the damping limits it.
- **Fast driving** ($\omega \gg \omega_0$): $A \approx \dfrac{F_0}{m\omega^2}$, small. The mass's inertia can't keep up.

```plot
{"x": [0, 2], "y": [0, 11], "xLabel": "driving frequency ω / ω0", "yLabel": "amplitude ÷ (F0/k)", "functions": [{"f": "1/sqrt((1 - x^2)^2 + (x/10)^2)", "label": "Q = 10"}, {"f": "1/sqrt((1 - x^2)^2 + (x/5)^2)", "label": "Q = 5"}, {"f": "1/sqrt((1 - x^2)^2 + (x/2)^2)", "label": "Q = 2"}], "caption": "Resonance curves: the higher the Q, the taller and narrower the peak near ω = ω0"}
```

The peak is not only tall but narrow. The range of driving frequencies over which the oscillator responds strongly (amplitude above about 71% of the peak, which is half the peak energy) has a width of about

$$\Delta\omega \approx \frac{\omega_0}{Q}.$$

A high-$Q$ oscillator is *selective*: it responds strongly to one frequency and ignores its neighbors. That is how a radio tuner picks one station, and why a wine glass (high $Q$) can be shattered by a loud tone held at exactly its pitch.

**Why the peak is at $\omega_0$: the phase.** At steady state the displacement lags behind the force. For slow driving the lag is near zero; at $\omega_0$ it is a quarter cycle ($90^\circ$), and for fast driving it approaches half a cycle. A quarter-cycle lag in position means the *velocity* is exactly in step with the force, so the force pushes forward whenever the mass moves forward and does positive work all the time. That maximizes the power fed in, just like pushing a swing as it moves away from you. (Strictly, the *amplitude* peaks slightly below $\omega_0$, at $\omega_0\sqrt{1 - 1/(2Q^2)}$, and the power peaks exactly at $\omega_0$; for $Q$ above about 3 the difference is under 3%.)

### Example 3

The oscillator of Example 1 ($m = 0.50$ kg, $k = 200$ N/m, $b = 0.40$ kg/s, $Q = 25$) is driven by a force of amplitude $F_0 = 1.0$ N. Find the steady-state amplitude at $\omega = 20$, 18 and 40 rad/s.

The static stretch is $F_0/k = 1.0/200 = 0.0050$ m = 5.0 mm, and $F_0/m = 2.0$ N/kg.

At $\omega = 20$ rad/s (resonance): $A = \dfrac{F_0}{b\omega_0} = \dfrac{1.0}{0.40 \times 20} = 0.125$ m $= 125$ mm, which is $25 \times 5.0$ mm $= Q\times$ static ✓.

At $\omega = 18$ rad/s: $\omega_0^2 - \omega^2 = 400 - 324 = 76$ and $b\omega/m = 0.40(18)/0.50 = 14.4$.
$A = \dfrac{2.0}{\sqrt{76^2 + 14.4^2}} = \dfrac{2.0}{77.4} = 0.0259$ m $\approx 26$ mm.

At $\omega = 40$ rad/s: $400 - 1600 = -1200$ and $b\omega/m = 32$, so $A = 2.0/1200.4 = 0.00167$ m $\approx 1.7$ mm.

Driving just 10% off resonance cuts the response by a factor of about 5: the peak has width $\Delta\omega \approx 20/25 = 0.8$ rad/s.

## Resonance in structures

Resonance is a design problem for anything with a natural frequency that might be driven: machines with rotating parts, bridges under footsteps, buildings in wind and earthquakes. Engineers move the natural frequency away from likely driving frequencies (by changing stiffness or mass) or add damping, which lowers $Q$ and so lowers the peak.

One clever fix is the **tuned mass damper**: a second, smaller oscillator attached to the structure, tuned to the structure's natural frequency and damped. When the building sways, the damper swings out of step with it and soaks up energy. Taipei 101 has a famous one: a steel sphere of roughly 660 tonnes hung between its upper floors.

Two well-known stories are often told as simple resonance, and both are more subtle:

- **London's Millennium Bridge** (opened June 2000) swayed sideways on its opening weekend and was closed within days. The cause was a feedback loop: as the deck began to sway, walkers adjusted their steps to keep balance, pushing in step with the sway and making it worse. Dampers were fitted, and it reopened in 2002.
- **The Tacoma Narrows Bridge** (collapsed November 1940) is often described as wind "matching its resonant frequency." That's simplified: a steady wind doesn't push at a fixed frequency. Engineers attribute the collapse to aeroelastic flutter, a self-excited oscillation in which the bridge's own twisting changed the wind forces so that they fed energy into the twisting.

### Example 4

A simplified "quarter car" puts 400 kg of a car's mass on one spring with $k = 4.0\times10^4$ N/m. Find the natural frequency and the damping constant that would make the suspension critically damped.

$\omega_0 = \sqrt{k/m} = \sqrt{40\,000/400} = 10$ rad/s, so $f_0 = \omega_0/2\pi = 1.6$ Hz, a typical bounce rate for a car.

$b_c = 2\sqrt{mk} = 2\sqrt{400 \times 40\,000} = 2(4000) = 8000$ kg/s. (Check: $2m\omega_0 = 2(400)(10) = 8000$ ✓.) A shock absorber with $b$ well below this lets the car bounce several times after a bump; one well above it makes the ride feel stiff and slow to recover.

## Common mistakes

- Assuming the amplitude drops by the same *amount* each cycle. It drops by the same *fraction* (exponential decay), so the percentages compound.
- Forgetting that energy goes as amplitude squared: 2% amplitude loss per cycle is about 4% energy loss.
- Thinking a driven oscillator moves at its natural frequency. In steady state it moves at the driving frequency; the natural frequency only sets how strongly it responds.
- Thinking more damping always means faster settling. Overdamped systems settle more slowly than critically damped ones.
- Treating $Q$ rules of thumb ($2\pi/Q$ per cycle, width $\omega_0/Q$) as exact for small $Q$; they are approximations for light damping.

## Key points

- Linear damping $F = -bv$: amplitude $\propto e^{-bt/(2m)}$, energy $\propto e^{-bt/m}$; light damping hardly changes the frequency.
- Critical damping: $b_c = 2\sqrt{mk}$ ($Q = \tfrac12$). Below it, the system oscillates; above it, it creeps back.
- $Q = m\omega_0/b$: about $2\pi/Q$ of the energy lost per cycle; amplitude down to about 4% after $Q$ cycles.
- Driven at $\omega$: the steady state oscillates at $\omega$. Amplitude is $F_0/k$ for slow driving, $QF_0/k$ at resonance, and small for fast driving.
- Resonance width $\Delta\omega \approx \omega_0/Q$; at resonance the velocity is in step with the force.
