---
id: pc-exp-models
module: pc-m4
title: Exponential, logarithmic and logistic models
minutes: 35
topics: [Exponential models]
drills: [pc-half-life, pc-doubling, pc-logistic, pc-cooling]
refs: [pc-ref-exp-log]
---
## From formulas to models

The last three lessons gave you exponential functions, logarithms and the algebra to solve equations with them. Now we use them to describe the world: how fast a population grows, how old a fossil is, how long coffee takes to cool, and why growth eventually levels off. Each model is a formula with a few constants; the work is usually (1) finding the constants from given data and (2) answering a question by solving an equation.

## Exponential growth and decay

A quantity that changes at a rate proportional to its size follows

$$Q(t) = Q_0 e^{kt},$$

where $Q_0 = Q(0)$ is the initial amount and $k$ is the **continuous growth rate** ($k > 0$ for growth, $k < 0$ for decay). The same model can be written $Q(t) = Q_0 b^t$ with $b = e^k$; use whichever the problem suggests.

### Example 1

A bacteria culture has 500 cells at $t = 0$ and 1,200 cells 3 hours later. Assuming exponential growth, when will it reach 5,000 cells?

1. Model: $Q(t) = 500e^{kt}$.
2. Find $k$ from the data: $500e^{3k} = 1200 \Rightarrow e^{3k} = 2.4 \Rightarrow k = \dfrac{\ln 2.4}{3} \approx 0.2918$ per hour.
3. Solve $500e^{kt} = 5000$: $e^{kt} = 10$, so $t = \dfrac{\ln 10}{k} \approx 7.89$ hours.

## Doubling time and half-life

The **doubling time** of a growing quantity is the time it takes to double; the **half-life** of a decaying quantity is the time it takes to halve. Both are constant for an exponential model, whatever the starting amount:

$$e^{kT} = 2 \Rightarrow T_{\text{double}} = \frac{\ln 2}{k}, \qquad e^{kT} = \tfrac12 \Rightarrow T_{\text{half}} = \frac{\ln(1/2)}{k} = -\frac{\ln 2}{k}.$$

If you know the half-life $T$, the decay model can be written without $k$ at all:

$$Q(t) = Q_0\left(\tfrac12\right)^{t/T}.$$

After one half-life ($t = T$) the factor is $\tfrac12$; after two, $\tfrac14$; and so on.

### Example 2

Carbon-14 has a half-life of about 5,730 years. A bone contains 30% of the carbon-14 it had when the animal died. About how old is it?

$\left(\tfrac12\right)^{t/5730} = 0.30$. Take $\ln$: $\dfrac{t}{5730}\ln\tfrac12 = \ln 0.30$, so

$$t = 5730 \cdot \frac{\ln 0.30}{\ln 0.5} \approx 9{,}950 \text{ years}.$$

Sanity check: 30% is between $\tfrac12$ (one half-life, 5,730 years) and $\tfrac14$ (two half-lives, 11,460 years). ✓

## Newton's law of cooling

A hot object in a cooler room doesn't cool toward 0; it cools toward the room temperature. The *difference* between the object and its surroundings decays exponentially. **Newton's law of cooling** gives

$$T(t) = T_s + (T_0 - T_s)e^{-kt}, \qquad k > 0,$$

where $T_s$ is the surrounding temperature and $T_0$ the initial temperature. The graph is an exponential decay shifted up to the horizontal asymptote $T = T_s$.

### Example 3

Coffee at 90°C is set in a 20°C room. After 10 minutes it is 70°C. When will it be 50°C?

1. $T(t) = 20 + 70e^{-kt}$.
2. Use the data: $20 + 70e^{-10k} = 70 \Rightarrow e^{-10k} = \tfrac{50}{70} \Rightarrow k = \dfrac{\ln(7/5)}{10} \approx 0.03365$.
3. Solve $20 + 70e^{-kt} = 50$: $e^{-kt} = \tfrac{30}{70} = \tfrac37$, so $t = \dfrac{\ln(7/3)}{k} \approx 25.2$ minutes.

```plot
{"x": [0, 80], "y": [0, 100], "xLabel": "t (min)", "yLabel": "T (°C)", "functions": [{"f": "20 + 70exp(-0.03365x)", "label": "T(t)"}, {"f": "20", "dashed": true}], "points": [{"at": [0, 90], "label": "(0, 90)"}, {"at": [10, 70], "label": "(10, 70)"}, {"at": [25.2, 50], "label": "(25.2, 50)"}], "caption": "Newton's law of cooling: the temperature approaches the room temperature, 20°C."}
```

## Logistic growth

Pure exponential growth can't last: a population runs out of food or space; a rumor runs out of people who haven't heard it. A **logistic model** starts out nearly exponential and then levels off at a maximum value $C$, the **carrying capacity**:

$$P(t) = \frac{C}{1 + Ae^{-kt}}, \qquad A, k > 0.$$

Why this shape: when $t$ is large, $e^{-kt} \to 0$ and $P \to \frac{C}{1} = C$. When $t$ is very negative, $Ae^{-kt}$ is huge and $P \approx \frac{C}{A}e^{kt}$, an exponential. At $t = 0$, $P(0) = \frac{C}{1 + A}$, which lets you find $A$ from the initial value. Growth is fastest when $P = \frac C2$, which happens at $t = \frac{\ln A}{k}$ (where $Ae^{-kt} = 1$); that point is the inflection point of the S-shaped curve.

### Example 4

A rumor spreads through a school of 1,000 students according to $P(t) = \dfrac{1000}{1 + 9e^{-0.5t}}$, with $t$ in days.

- Initially: $P(0) = \dfrac{1000}{10} = 100$ students.
- After 4 days: $P(4) = \dfrac{1000}{1 + 9e^{-2}} \approx 451$ students.
- Half the school knows when $9e^{-0.5t} = 1$: $t = \dfrac{\ln 9}{0.5} = 2\ln 9 \approx 4.39$ days.
- In the long run, $P \to 1000$: everyone hears it.

```plot
{"x": [-2, 16], "y": [0, 1100], "xLabel": "t (days)", "yLabel": "P", "functions": [{"f": "1000/(1 + 9exp(-0.5x))", "label": "P(t)"}, {"f": "1000", "dashed": true}, {"f": "100exp(0.5x)", "dashed": true, "to": 4.6, "label": "pure exponential"}], "points": [{"at": [0, 100], "label": "(0, 100)"}, {"at": [4.394, 500], "label": "half capacity"}], "caption": "A logistic curve tracks exponential growth at first, then levels off at the carrying capacity 1,000."}
```

## Logarithmic scales

Some quantities span so many powers of ten that we measure them by their logarithm. Sound level in decibels is $L = 10\log\dfrac{I}{I_0}$; the pH of a solution is $-\log[\text{H}^+]$; earthquake magnitudes are also logarithmic. On such a scale, adding a fixed amount means multiplying the underlying quantity. For decibels, $+10$ dB means 10 times the intensity, and $+20$ dB means 100 times.

### Example 5

A sound is 1,000 times as intense as another. How many decibels louder is it?

$L_2 - L_1 = 10\log\dfrac{I_2}{I_0} - 10\log\dfrac{I_1}{I_0} = 10\log\dfrac{I_2}{I_1} = 10\log 1000 = 30$ dB.

## Common mistakes

- *Using the half-life as $k$.* Convert: $k = -\frac{\ln 2}{T}$.
- *Cooling toward 0.* Newton's law approaches the surrounding temperature $T_s$.
- *Finding $A$ wrongly in a logistic model.* Use $P(0) = \frac{C}{1 + A}$, so $A = \frac{C}{P(0)} - 1$.
- *Expecting unlimited logistic growth.* $P$ never exceeds $C$ (if it starts below $C$).
- *Not sanity-checking.* Compare answers against whole numbers of half-lives or doubling times.

## Key points

- Exponential model $Q = Q_0e^{kt}$; find $k$ from one data point with $\ln$.
- Doubling time $\frac{\ln 2}{k}$; half-life model $Q = Q_0\left(\frac12\right)^{t/T}$.
- Newton's cooling: $T = T_s + (T_0 - T_s)e^{-kt}$.
- Logistic: $P = \frac{C}{1 + Ae^{-kt}}$, levels off at $C$, fastest growth at $P = \frac C2$.
- Logarithmic scales turn multiplication into addition.
