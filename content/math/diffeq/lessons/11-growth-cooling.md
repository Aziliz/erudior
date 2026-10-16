---
id: de-model-growth
module: de-m3
title: Growth, decay, interest and cooling
minutes: 30
topics: [Growth and decay, Newton's law of cooling]
drills: [de-cooling-temp, de-cooling-time, de-annuity]
refs: [de-ref-models]
---
## From words to equations

Module 2 gave you methods. This module puts them to work on **mathematical models**:
differential equations built from a description of how something changes. Every model
in this module follows the same pattern,

$$\text{rate of change} = \text{rate in} - \text{rate out},$$

and almost all of them turn out to be first-order linear equations. Modeling has three
steps: (1) choose variables and units and write the equation, (2) solve it, (3)
interpret the answer and check it makes sense.

## Growth and decay revisited

You met $y' = ky$ in Lesson 4. In modeling, the constant $k$ usually comes from data,
and the value of the model is prediction. Two facts from that lesson do most of the
work: $y = y_0e^{kt}$, and the time to change by a factor $r$ is $\dfrac{\ln r}{k}$.

### Example 1: radiocarbon dating

Living tissue has a fixed carbon-14 level. After death the C-14 decays with half-life
5,730 years. A bone has 22% of the living level. How old is it?

- $k = -\dfrac{\ln 2}{5730}$, and we need $e^{kt} = 0.22$.
- $t = \dfrac{\ln 0.22}{k} = \dfrac{5730\ln(1/0.22)}{\ln 2} \approx 12{,}517$ years.

## Compound interest

If a balance $A$ earns interest at annual rate $r$ compounded continuously, it grows at
rate $rA$. Add steady deposits of $d$ dollars per year (spread continuously), and

$$\frac{dA}{dt} = rA + d.$$

This is linear: $A' - rA = d$, with integrating factor $e^{-rt}$. The solution with
$A(0) = A_0$ is

$$A(t) = \left(A_0 + \frac{d}{r}\right)e^{rt} - \frac{d}{r}.$$

Withdrawals are just negative $d$. Continuous compounding is the limit of compounding $n$
times a year: $\left(1 + \frac{r}{n}\right)^{nt} \to e^{rt}$ as $n \to \infty$.

### Example 2

You deposit nothing up front but add \$3,000 per year continuously into an account earning
5% compounded continuously. How much is there after 30 years?

- $A_0 = 0$, $d = 3000$, $r = 0.05$: $A(30) = \dfrac{3000}{0.05}\left(e^{1.5} - 1\right) = 60000(3.4817) \approx$ \$208,902.
- Total deposited: \$90,000. The rest is interest.

### Example 3: paying off a loan

A \$200,000 loan at 6% compounded continuously is paid at \$15,000 per year
continuously. Then $B' = 0.06B - 15000$, $B(0) = 200000$. The balance is
$B = (200000 - 250000)e^{0.06t} + 250000 = 250000 - 50000e^{0.06t}$. It reaches zero when
$e^{0.06t} = 5$, that is $t = \dfrac{\ln 5}{0.06} \approx 26.8$ years. Notice that if the
payment were less than the interest on the initial balance ($0.06 \times 200000 = 12000$),
the balance would grow forever.

## Newton's law of cooling

**Newton's law of cooling** says an object's temperature $T$ changes at a rate
proportional to the difference between it and the surrounding (ambient) temperature
$T_a$:

$$\frac{dT}{dt} = -k(T - T_a), \qquad k > 0.$$

The minus sign makes sense: if $T > T_a$, the right side is negative and the object
cools; if $T < T_a$, it warms. The equation is linear (and separable). Let
$u = T - T_a$; then $u' = -ku$, so $u = u_0e^{-kt}$ and

$$T(t) = T_a + (T_0 - T_a)e^{-kt}.$$

The difference from the room decays exponentially, with the same "half-life" no matter
how hot the object starts.

```plot
{"x": [0, 60], "y": [0, 100], "xLabel": "t (min)", "yLabel": "T (°C)", "functions": [{"f": "20 + 70exp(-0.05x)", "label": "starts at 90"}, {"f": "20 - 15exp(-0.05x)", "label": "starts at 5"}, {"f": "20", "dashed": true, "label": "room 20 °C"}], "caption": "Newton's law of cooling with k = 0.05 per minute: both curves approach the room temperature."}
```

### Example 4

Coffee at 90 °C is set in a 20 °C room. After 10 minutes it is 60 °C. When will it reach
40 °C?

- $T = 20 + 70e^{-kt}$. At $t = 10$: $60 = 20 + 70e^{-10k}$, so $e^{-10k} = \tfrac{40}{70} = \tfrac47$
  and $k = \dfrac{\ln(7/4)}{10} \approx 0.05596$ per minute.
- Set $T = 40$: $70e^{-kt} = 20$, so $e^{-kt} = \tfrac27$ and
  $t = \dfrac{\ln(7/2)}{k} = \dfrac{10\ln 3.5}{\ln 1.75} \approx 22.4$ minutes.

### Example 5: time of death

A body is found at 10:00 p.m. with temperature 30 °C in a room at 20 °C. An hour later it is
28 °C. Assuming normal body temperature 37 °C at death, when did death occur?

- Measuring $t$ in hours from 10:00 p.m.: $T = 20 + 10e^{-kt}$ and $28 = 20 + 10e^{-k}$ give
  $e^{-k} = 0.8$, $k = \ln 1.25 \approx 0.2231$.
- At death $T = 37$: $10e^{-kt} = 17$, so $e^{-kt} = 1.7$ and $t = -\dfrac{\ln 1.7}{k} \approx -2.38$ hours.
- Death occurred about 2 hours 23 minutes before 10:00 p.m., near 7:37 p.m.

## Checking a model

After solving, ask:

- **Units.** $k$ in a cooling model has units of 1/time; $kt$ must be dimensionless.
- **Long-run behaviour.** Cooling models tend to $T_a$; savings with deposits grow;
  loans with too-small payments never end.
- **Initial value.** Plug in $t = 0$.

## Common mistakes

- **Using $T$ instead of $T - T_a$.** The exponential decay applies to the *difference*.
- **Sign of $k$.** With the form $-k(T - T_a)$, $k$ is positive for both heating and cooling.
- **Annual vs continuous rates.** A 5% continuous rate is $r = 0.05$ in $A' = rA$; it
  grows money by a factor $e^{0.05} \approx 1.0513$ per year.
- **Mixing time units.** If $k$ is per minute, $t$ must be in minutes.

## Key points

- Models balance rate in against rate out.
- Continuous interest with deposits: $A' = rA + d$, solution
  $A = (A_0 + d/r)e^{rt} - d/r$.
- Newton's law of cooling: $T' = -k(T - T_a)$, solution $T = T_a + (T_0 - T_a)e^{-kt}$.
- Fit $k$ from one extra data point, then predict.
