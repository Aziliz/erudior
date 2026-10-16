---
id: de-falling-circuits
module: de-m3
title: Falling objects and RL/RC circuits
minutes: 35
topics: [Falling objects, RL and RC circuits]
drills: [de-terminal-velocity, de-drag-velocity, de-rc-charge, de-rl-current]
refs: [de-ref-models]
---
## Two physical models with the same mathematics

This lesson covers two models from different corners of physics, a falling object with
air resistance and an electric circuit with a resistor and a capacitor or inductor.
They lead to the same equation, $y' + ay = b$, which you can now solve in your sleep.
Seeing one equation describe both is part of the point: the mathematics doesn't care
whether $y$ is a velocity or a current.

## Falling with linear drag

Take downward as positive. A falling object of mass $m$ feels gravity $mg$ (down) and air
resistance opposing the motion. For slow, small objects the drag is roughly proportional
to speed, $-\gamma v$ with $\gamma > 0$ the **drag coefficient**. Newton's second law,
$m\,\dfrac{dv}{dt} = \text{net force}$, gives

$$m\frac{dv}{dt} = mg - \gamma v.$$

Use $g = 9.8$ m/s² in SI units. The equation is linear: $v' + \dfrac{\gamma}{m}v = g$.

### Terminal velocity

As the object speeds up, drag grows until it balances gravity. Setting $v' = 0$ gives the
**terminal velocity**

$$v_T = \frac{mg}{\gamma}.$$

Solving with $v(0) = v_0$:

$$v(t) = v_T + (v_0 - v_T)e^{-\gamma t/m}.$$

The velocity approaches $v_T$ exponentially, the same shape as Newton's law of cooling.
Position comes from integrating $v$.

### Example 1

A 5 kg package is dropped from rest from a helicopter. Drag is $\gamma v$ with
$\gamma = 2$ kg/s. Find the terminal velocity and the velocity after 5 seconds.

- $v_T = \dfrac{5(9.8)}{2} = 24.5$ m/s.
- $v(t) = 24.5(1 - e^{-0.4t})$, since $\gamma/m = 0.4$ and $v_0 = 0$.
- $v(5) = 24.5(1 - e^{-2}) \approx 21.18$ m/s.
- Distance fallen: $x(t) = \int_0^t v = 24.5t - 61.25(1 - e^{-0.4t})$, so
  $x(5) \approx 122.5 - 52.96 = 69.5$ m.

```plot
{"x": [0, 15], "y": [0, 30], "xLabel": "t (s)", "yLabel": "v (m/s)", "functions": [{"f": "24.5(1 - exp(-0.4x))", "label": "v(t)"}, {"f": "24.5", "dashed": true, "label": "v_T = 24.5"}, {"f": "9.8x", "dashed": true, "to": 2.5, "label": "no drag"}], "caption": "Velocity of the package approaches terminal velocity; without drag it would grow like 9.8t."}
```

### Quadratic drag

For faster objects (skydivers, baseballs) drag is closer to proportional to $v^2$:
$mv' = mg - kv^2$. That's nonlinear but separable (and autonomous). Terminal velocity is
where $mg = kv^2$, so $v_T = \sqrt{mg/k}$. The solution starting from rest is
$v = v_T\tanh\!\left(\dfrac{gt}{v_T}\right)$, which you can verify by differentiating.

### Example 2: thrown upward

A 0.5 kg ball is thrown upward at 20 m/s with drag $0.1v$. Take *upward* positive now:
$0.5v' = -0.5(9.8) - 0.1v$, so $v' + 0.2v = -9.8$, and $v = -49 + 69e^{-0.2t}$. The ball
peaks when $v = 0$: $e^{-0.2t} = 49/69$, $t = 5\ln(69/49) \approx 1.71$ s, a little
sooner than the 2.04 s it would take with no drag. Choosing a direction and keeping
signs consistent is the whole game.

## Electric circuits: the parts

In a series circuit with a voltage source $E(t)$, the voltage drops around the loop add up
to the source (**Kirchhoff's voltage law**). Each component has its own drop:

| Component | Unit | Voltage drop |
|---|---|---|
| Resistor | ohms, Ω | $RI$ |
| Inductor | henries, H | $L\dfrac{dI}{dt}$ |
| Capacitor | farads, F | $\dfrac{q}{C}$ |

Here $I$ is current (amperes) and $q$ is charge on the capacitor (coulombs), with
$I = \dfrac{dq}{dt}$.

## RL circuits

A resistor and inductor in series with source $E$: $L\dfrac{dI}{dt} + RI = E(t)$. With
constant $E$ and $I(0) = 0$,

$$I(t) = \frac{E}{R}\left(1 - e^{-Rt/L}\right).$$

The current climbs to the steady value $E/R$ (what Ohm's law gives with no inductor);
the inductor only delays it. The number $L/R$ (in seconds) is the **time constant**:
after one time constant the current reaches $1 - e^{-1} \approx 63\%$ of its final value.

### Example 3

An RL circuit has $L = 2$ H, $R = 10$ Ω, and a 12 V battery switched on at $t = 0$.

- $2I' + 10I = 12$, so $I' + 5I = 6$, and $I = 1.2(1 - e^{-5t})$ amperes.
- Time constant $L/R = 0.2$ s. At $t = 0.2$, $I = 1.2(1 - e^{-1}) \approx 0.759$ A.

## RC circuits

A resistor and capacitor in series: $RI + \dfrac{q}{C} = E$. Since $I = q'$,

$$R\frac{dq}{dt} + \frac{1}{C}q = E(t).$$

With constant $E$ and an uncharged capacitor, $q(t) = CE\left(1 - e^{-t/(RC)}\right)$.
The time constant is $RC$. If instead the source is removed and a charged capacitor
discharges through the resistor, $q = q_0e^{-t/(RC)}$.

### Example 4

A 4 Ω resistor and a 0.05 F capacitor are connected to a 10 V battery at $t = 0$, with
$q(0) = 0$.

- $4q' + 20q = 10$, so $q' + 5q = 2.5$ and $q = 0.5(1 - e^{-5t})$ coulombs.
- The current is $I = q' = 2.5e^{-5t}$ A: it starts at $E/R = 2.5$ A and decays as the
  capacitor fills.

### Example 5: an alternating source

For $I' + 5I = 6\sin t$ (an RL circuit with $L = 1$, $R = 5$, $E = 6\sin t$), the
integrating factor method gives a **steady-state** part that oscillates with the source,
$I_{ss} = \dfrac{30\sin t - 6\cos t}{26}$, plus a transient $Ce^{-5t}$ that dies out.
Module 6 shows a quicker way to find steady-state responses.

## Common mistakes

- **Inconsistent sign convention.** Pick up or down as positive and stick with it; drag
  always opposes velocity.
- **Weight vs mass.** If a problem gives weight in newtons (or pounds), divide by $g$ to
  get mass.
- **Charge vs current.** RC circuits are naturally written in $q$; the current is $q'$.
- **Mismatched units.** Ω, H, F, V, A and s fit together; don't mix in milliseconds.

## Key points

- Linear drag: $mv' = mg - \gamma v$, terminal velocity $mg/\gamma$,
  $v = v_T + (v_0 - v_T)e^{-\gamma t/m}$.
- RL: $LI' + RI = E$, time constant $L/R$. RC: $Rq' + q/C = E$, time constant $RC$.
- All are $y' + ay = b$: an equilibrium value plus an exponentially decaying transient.
