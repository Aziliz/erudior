---
id: de-growth-logistic
module: de-m1
title: Exponential and logistic growth
minutes: 30
topics: [Exponential growth, Logistic growth]
drills: [de-exp-model, de-logistic-value, de-logistic-max]
refs: [de-ref-models]
---
## Two models of growth

With separation of variables in hand, we can solve the two most famous models in the
subject. Both describe how a quantity $P(t)$ changes over time $t$. The first assumes
nothing limits growth; the second adds a ceiling.

## Exponential growth and decay

The **exponential model** says the rate of change is proportional to the amount present:

$$\frac{dP}{dt} = kP.$$

It fits anything whose growth is driven by its own size: bacteria dividing, money
earning continuous interest, radioactive nuclei decaying (each nucleus has the same
chance per second, so the decay rate is proportional to how many there are). The
constant $k$ is the **relative growth rate**: $\dfrac{1}{P}\dfrac{dP}{dt} = k$. If $k > 0$
the quantity grows; if $k < 0$ it decays.

Separate and integrate: $\dfrac{dP}{P} = k\,dt$, so $\ln|P| = kt + C$, and

$$P(t) = P_0 e^{kt}, \qquad P_0 = P(0).$$

### Doubling time and half-life

Exponential growth multiplies by the same factor over equal time spans. The
**doubling time** $T_d$ solves $e^{kT_d} = 2$, so $T_d = \dfrac{\ln 2}{k}$. For decay
($k < 0$) the **half-life** is $T_{1/2} = \dfrac{\ln 2}{|k|}$. Notice neither depends on
$P_0$: 100 grams and 1 gram of the same isotope take the same time to halve.

### Example 1

A bacterial culture grows exponentially from 400 cells to 1,000 cells in 3 hours. How
many cells are there after 8 hours?

- Model: $P = 400e^{kt}$.
- At $t = 3$: $1000 = 400e^{3k}$, so $e^{3k} = 2.5$ and $k = \dfrac{\ln 2.5}{3} \approx 0.30543$
  per hour.
- At $t = 8$: $P = 400e^{8k} = 400(2.5)^{8/3} \approx 400(11.51) \approx 4{,}605$ cells.

Writing $e^{8k} = (e^{3k})^{8/3} = 2.5^{8/3}$ avoids rounding $k$ at all.

### Example 2

Carbon-14 has a half-life of about 5,730 years. What fraction of the original carbon-14
remains after 2,000 years?

- $k = -\dfrac{\ln 2}{5730} \approx -1.2097 \times 10^{-4}$ per year.
- Fraction left: $e^{2000k} = (1/2)^{2000/5730} \approx 0.785$, so about 78.5% remains.

## Logistic growth

Real populations can't grow exponentially forever; food and space run out. The
**logistic model** builds in a ceiling $K$, the **carrying capacity**:

$$\frac{dP}{dt} = kP\left(1 - \frac{P}{K}\right).$$

Read it piece by piece. When $P$ is small compared with $K$, the factor
$1 - P/K \approx 1$ and growth is nearly exponential with rate $k$. As $P$ approaches $K$
the factor shrinks to 0 and growth stalls. If $P > K$ the factor is negative and the
population falls back toward $K$. The equilibria are $P = 0$ and $P = K$.

### Solving it

The equation is separable. Using partial fractions,

$$\frac{K}{P(K - P)} = \frac{1}{P} + \frac{1}{K - P},$$

and integrating $\dfrac{K\,dP}{P(K-P)} = k\,dt$ gives $\ln\left|\dfrac{P}{K - P}\right| = kt + C$.
Solving for $P$ and using $P(0) = P_0$:

$$P(t) = \frac{K}{1 + Ae^{-kt}}, \qquad A = \frac{K - P_0}{P_0}.$$

As $t \to \infty$, $e^{-kt} \to 0$ and $P(t) \to K$ for every starting value $P_0 > 0$.

### Where growth is fastest

The rate $kP(1 - P/K)$ is a downward parabola in $P$ with zeros at $0$ and $K$, so it
peaks halfway, at $P = K/2$. That's the inflection point of the S-shaped
**logistic curve**: below $K/2$ the curve is concave up (speeding up), above it concave
down (slowing). You can find this without solving: the maximum growth rate is
$k\cdot\dfrac{K}{2}\cdot\dfrac12 = \dfrac{kK}{4}$.

```plot
{"x": [0, 12], "y": [0, 1200], "xLabel": "t", "yLabel": "P", "functions": [{"f": "1000/(1 + 9exp(-0.6x))", "label": "P(0) = 100"}, {"f": "1000/(1 - 0.5exp(-0.6x))", "label": "P(0) = 2000", "from": 1.2}, {"f": "1000", "dashed": true, "label": "K = 1000"}, {"f": "500", "dashed": true, "label": "K/2"}], "caption": "Logistic solutions with k = 0.6 and K = 1000. Curves below K rise in an S-shape; curves above K fall toward it."}
```

### Example 3

A lake is stocked with 100 fish. The population follows
$\dfrac{dP}{dt} = 0.6P\left(1 - \dfrac{P}{1000}\right)$ with $t$ in years.

(a) What is the long-run population? $K = 1000$ fish.

(b) Find $P(t)$. $A = \dfrac{1000 - 100}{100} = 9$, so $P(t) = \dfrac{1000}{1 + 9e^{-0.6t}}$.

(c) When is the population growing fastest, and how fast? At $P = 500$:
$\dfrac{dP}{dt} = 0.6(500)(0.5) = 150$ fish per year. Setting $P = 500$:
$1 + 9e^{-0.6t} = 2$, so $e^{-0.6t} = 1/9$ and $t = \dfrac{\ln 9}{0.6} \approx 3.66$ years.

(d) Population after 5 years: $P(5) = \dfrac{1000}{1 + 9e^{-3}} \approx 690.6$, about 691 fish.

### Recognizing the logistic form

The equation may be written $\dfrac{dP}{dt} = aP - bP^2$ or $\dfrac{dP}{dt} = cP(M - P)$.
Factor to match $kP(1 - P/K)$:

- $\dfrac{dP}{dt} = 0.02P - 0.0001P^2 = 0.02P(1 - 0.005P) = 0.02P\left(1 - \dfrac{P}{200}\right)$,
  so $k = 0.02$ and $K = 200$.
- $\dfrac{dP}{dt} = 0.003P(500 - P) = 1.5P\left(1 - \dfrac{P}{500}\right)$, so $k = 1.5$
  (not 0.003!) and $K = 500$.

## Choosing between the models

Look at the data. If a quantity grows by roughly the same *factor* in equal time spans with
no sign of slowing, the exponential model fits. If growth is fast at first and then levels
off, or if the setting has an obvious limit (food, space, a market of fixed size), use the
logistic model. Early on the two are almost indistinguishable, which is why exponential
projections of a young epidemic or a new product often overshoot badly.

## Common mistakes

- **Using the half-life as $k$.** The rate constant is $\ln 2$ divided by the half-life.
- **Rounding $k$ too early.** Keep exact forms like $\dfrac{\ln 2.5}{3}$ or use
  $e^{kt} = (\text{ratio})^{t/t_1}$.
- **Misreading $k$ in $cP(M - P)$.** The relative growth rate there is $cM$, not $c$.
- **Thinking logistic growth is fastest at the start.** It's fastest at $P = K/2$.
- **Expecting logistic solutions to overshoot.** They approach $K$ without crossing it.

## Key points

- $P' = kP$ gives $P = P_0e^{kt}$; doubling time $\ln 2/k$, half-life $\ln 2/|k|$.
- $P' = kP(1 - P/K)$ gives $P = \dfrac{K}{1 + Ae^{-kt}}$ with $A = (K - P_0)/P_0$.
- Every positive logistic solution tends to $K$; growth is fastest at $P = K/2$ with
  rate $kK/4$.
