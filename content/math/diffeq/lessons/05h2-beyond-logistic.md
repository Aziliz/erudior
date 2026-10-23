---
id: de-m1-h-beyond-logistic
module: de-m1
title: 'Beyond the logistic: epidemics, data and the Gompertz curve'
minutes: 45
honors: true
topics: [Logistic growth, Gompertz growth]
drills: [de-m1-r2-si-peak, de-m1-r2-logistic-3pt, de-m1-r2-gompertz]
refs: [de-ref-models]
---
## Where the logistic equation comes from, and where it goes

Lesson 4 introduced the logistic equation $P' = kP(1 - P/K)$ as a growth model with a
ceiling and solved it by separation. This honors lesson asks three further questions.
Why should a rate be proportional to $P(K - P)$ in the first place? Given real counts,
how do you find $K$ and $k$? And what if the S-shaped curve your data trace out isn't
symmetric? The answers are a simple epidemic model, a neat change of variable, and a
second classic S-curve, the Gompertz curve.

A little history first. The Belgian mathematician Pierre-François Verhulst proposed the
logistic equation for human populations in 1838 and later gave it the name *logistic*.
It was largely forgotten until Raymond Pearl and Lowell Reed rediscovered it in 1920 and
fitted it to United States census counts. Their projections looked good for a while and
then failed, a useful warning: a model that fits past data well can still mislead when
extended far into the future.

## A mechanism for logistic growth: the SI epidemic model

Consider a disease (or a rumor) spreading through a closed population of $N$ people.
Split them into two groups: $I(t)$ people already **infected** and $N - I$ people still
**susceptible**. Assume the population is well mixed: everyone is equally likely to meet
everyone else. New infections happen when an infected person meets a susceptible one,
so the rate of new infections is proportional to the number of such pairs,
$I(N - I)$. Writing the constant as $\beta/N$,

$$\frac{dI}{dt} = \frac{\beta}{N}\,I\,(N - I) = \beta I\left(1 - \frac{I}{N}\right).$$

This is the **SI model** (susceptible, infected). The constant $\beta$, the
**transmission rate**, is about the number of new infections one infected person causes
per unit time when nearly everyone is still susceptible. The equation is exactly the
logistic equation with $k = \beta$ and $K = N$, so everything from Lesson 4 applies:

$$I(t) = \frac{N}{1 + Ae^{-\beta t}}, \qquad A = \frac{N - I_0}{I_0}.$$

The product $I(N - I)$ explains the S-shape. Early on there are few infected people to
pass the disease on; late, there are few susceptible people left to catch it. In
between, with half the population on each side, the number of meetings and so the rate
of spread are largest.

```mermaid
flowchart LR
  accTitle: The SI epidemic model
  accDescr: People move from the susceptible group, N minus I people, to the infected group, I people, at the rate beta times I times N minus I divided by N. No one leaves the infected group.
  S["Susceptible: N − I"] -- "rate β·I·(N − I)/N" --> I["Infected: I"]
```

The model is deliberately simplified. It has no recovery and no deaths, so it predicts
that eventually everyone is infected. Adding a recovered group gives the SIR model
(Kermack and McKendrick, 1927), which needs a system of differential equations; the SI
model fits best to infections that last for life or to rumors and new products spreading
by word of mouth.

### Example 1

A rumor spreads through a school of 5,000 students. Ten students start it, and
$\beta = 0.5$ per day. When is it spreading fastest, how fast, and how many have heard it
after 10 days?

- $A = \dfrac{5000 - 10}{10} = 499$, so $I(t) = \dfrac{5000}{1 + 499e^{-0.5t}}$.
- Fastest spread at $I = N/2 = 2500$: $499e^{-0.5t} = 1$, so
  $t = \dfrac{\ln 499}{0.5} \approx 12.4$ days.
- The rate there is $\dfrac{\beta N}{4} = \dfrac{0.5 \cdot 5000}{4} = 625$ students per day.
- After 10 days: $I(10) = \dfrac{5000}{1 + 499e^{-5}} \approx 1146$ students.

Notice how long the slow start lasts: after 5 days only about 119 students know, yet a
week later the rumor is spreading at its peak speed.

## Fitting a logistic curve to data

Given counts of a growing population, how do you find $K$, $A$ and $k$? There is a
change of variable that makes the logistic equation linear. Let $u = 1/P$. Then

$$u' = -\frac{P'}{P^2} = -\frac{kP(1 - P/K)}{P^2} = -k\left(\frac1P - \frac1K\right) = -k\left(u - \frac1K\right).$$

So $u - \tfrac1K$ decays exponentially: $u(t) = \dfrac1K + \dfrac{A}{K}e^{-kt}$. (You can
also see this by flipping the solution formula: $\dfrac1P = \dfrac{1 + Ae^{-kt}}{K}$.)
Module 2 will show that this trick works for a whole class of equations, the Bernoulli
equations.

Now take three counts $P_0, P_1, P_2$ at equally spaced times $0, T, 2T$, and write
$u_n = 1/P_n$ and $c = 1/K$. Each step of length $T$ multiplies $u - c$ by the same
factor $q = e^{-kT}$, so $u_0 - c$, $u_1 - c$, $u_2 - c$ form a geometric sequence:

$$(u_1 - c)^2 = (u_0 - c)(u_2 - c).$$

Expanding, the $c^2$ terms cancel, leaving one linear equation for $c$:

$$c = \frac{u_0u_2 - u_1^2}{u_0 + u_2 - 2u_1}, \qquad K = \frac1c.$$

Then $A = K(u_0 - c)$ and $q = \dfrac{u_1 - c}{u_0 - c}$, so $k = -\dfrac{\ln q}{T}$.

### Example 2

A population is counted three times, two years apart: 200, 400 and 600. Fit a logistic
model.

- Reciprocals: $u_0 = 0.005$, $u_1 = 0.0025$, $u_2 = \tfrac{1}{600} \approx 0.0016667$.
- $c = \dfrac{0.005 \cdot \tfrac{1}{600} - 0.0025^2}{0.005 + \tfrac{1}{600} - 0.005} = \dfrac{2.0833\times10^{-6}}{1.6667\times10^{-3}} = 0.00125$, so $K = 800$.
- $A = 800(0.005 - 0.00125) = 3$, and $q = \dfrac{0.00125}{0.00375} = \dfrac13$, so
  $k = \dfrac{\ln 3}{2} \approx 0.549$ per year.
- Model: $P(t) = \dfrac{800}{1 + 3e^{-0.549t}}$. Check: $P(2) = \dfrac{800}{1 + 3\cdot\tfrac13} = 400$
  and $P(4) = \dfrac{800}{1 + \tfrac13} = 600$.

Three points determine the three constants exactly, so this fit always passes through
the data. With real, noisy data you would use many points and a least-squares fit, and
the estimate of $K$ is often the least reliable part, especially when all the data come
from before the inflection point. (The formula also needs the data to be bending over: if
$u_0 + u_2 - 2u_1$ is zero or $c$ comes out negative, the counts don't look logistic.)

## The Gompertz curve

The logistic curve is symmetric about its inflection point at $K/2$: it approaches $K$
as fast as it left 0. Many growth processes are lopsided, with a fast early rise and a
long, slow approach to the ceiling. A model with that shape is the **Gompertz model**:

$$\frac{dP}{dt} = kP\ln\frac{K}{P}.$$

Benjamin Gompertz introduced the curve in 1825 to describe how human death rates change
with age; since then it has been used to describe the growth of organisms, of some
tumors, and the spread of new technologies. Like the logistic, it is a *descriptive*
model: it often fits, but it doesn't come from a mechanism as clear as the SI model's.

Compare the two through the **relative growth rate** $\frac1P\frac{dP}{dt}$:

| Model | Relative growth rate | Inflection point | Fastest rate |
|---|---|---|---|
| Logistic | $k\left(1 - \dfrac{P}{K}\right)$, falls linearly | $P = K/2$ | $kK/4$ |
| Gompertz | $k\ln\dfrac{K}{P}$, falls like a logarithm | $P = K/e \approx 0.368K$ | $kK/e$ |

Both are positive below $K$, zero at $K$ and negative above, so both have the stable
equilibrium $P = K$. The Gompertz relative rate grows without bound as $P \to 0$, which
is unrealistic for very small populations; treat the model as useful only once growth is
under way.

The inflection point comes from maximizing the rate $g(P) = kP\ln(K/P) = kP(\ln K - \ln P)$:
$g'(P) = k(\ln K - \ln P - 1) = 0$ gives $\ln\frac{K}{P} = 1$, so $P = K/e$, where the
rate is $k\cdot\frac{K}{e}\cdot 1 = \frac{kK}{e}$.

### Solving the Gompertz equation

The equation is separable, and the substitution $w = \ln\dfrac{K}{P} = \ln K - \ln P$
makes it easy. Then $\dfrac{dw}{dt} = -\dfrac1P\dfrac{dP}{dt} = -k\ln\dfrac KP = -kw$, so
$w = w_0e^{-kt}$ with $w_0 = \ln\dfrac{K}{P_0}$. Undoing the substitution, $P = Ke^{-w}$:

$$P(t) = K\exp\!\left(-\ln\frac{K}{P_0}\,e^{-kt}\right).$$

As $t \to \infty$, $e^{-kt} \to 0$, the exponent goes to 0 and $P \to K$.

### Example 3

In an illustrative model, a tumor's volume (in mm³) follows the Gompertz equation with
$K = 1000$, $k = 0.3$ per week and $P(0) = 100$. Find $P(5)$, and when and how fast the
volume grows fastest.

- $\ln\dfrac{K}{P_0} = \ln 10 \approx 2.3026$, so $P(t) = 1000\exp\!\left(-2.3026\,e^{-0.3t}\right)$.
- $P(5) = 1000\exp(-2.3026\,e^{-1.5}) \approx 1000\exp(-0.5138) \approx 598$ mm³.
- Fastest growth at $P = K/e \approx 368$ mm³, when $\ln 10 \cdot e^{-0.3t} = 1$:
  $t = \dfrac{\ln(\ln 10)}{0.3} \approx 2.78$ weeks.
- The fastest rate is $\dfrac{kK}{e} = \dfrac{300}{e} \approx 110$ mm³ per week.

A logistic model with the same $K$, $k$ and $P_0$ gives only $P(5) \approx 332$ and
peaks later, at $t = \frac{\ln 9}{0.3} \approx 7.3$ weeks. The Gompertz curve starts with
a much larger relative growth rate ($0.3\ln 10 \approx 0.69$ versus
$0.3 \cdot 0.9 = 0.27$), so it rises faster and turns over sooner.

```plot
{"x": [0, 20], "y": [0, 1100], "xLabel": "t (weeks)", "yLabel": "P", "functions": [{"f": "1000exp(ln(0.1)exp(-0.3x))", "label": "Gompertz"}, {"f": "1000/(1 + 9exp(-0.3x))", "label": "logistic", "dashed": true}, {"f": "1000", "dashed": true, "label": "K = 1000"}], "points": [{"at": [2.78, 367.9], "label": "K/e"}, {"at": [7.32, 500], "label": "K/2"}], "caption": "Gompertz and logistic curves with K = 1000, k = 0.3 and P(0) = 100. The Gompertz curve bends over at K/e, earlier and lower than the logistic's K/2."}
```

## Choosing a model

- Exponential: growth by a constant factor in equal times, no sign of slowing.
- Logistic: an S-curve symmetric about its midpoint; natural when growth needs
  contact between "haves" and "have-nots" (the SI mechanism).
- Gompertz: an S-curve that rises quickly and then creeps up to its ceiling, bending
  over at about 37% of $K$.

With only early data the three can look nearly the same, so be cautious about long-range
predictions from any of them.

## Common mistakes

- **Reading $\beta$ as the long-run total.** In the SI model the ceiling is $N$;
  $\beta$ is a rate per unit time.
- **Using unequally spaced data in the three-point formula.** The geometric-sequence
  step needs times $0$, $T$, $2T$.
- **Rounding the reciprocals early.** The formula for $c$ subtracts nearly equal
  numbers; keep many digits (or exact fractions).
- **Putting the Gompertz inflection at $K/2$.** It is at $K/e \approx 0.37K$.
- **Writing $\ln(P/K)$ for $\ln(K/P)$.** Below $K$, $\ln(K/P) > 0$ and the population
  grows; the other way round flips every sign.

## Key points

- The SI model $I' = \beta I(1 - I/N)$ is logistic: contacts between infected and
  susceptible people drive the spread, which is fastest when $I = N/2$, at rate $\beta N/4$.
- The substitution $u = 1/P$ turns the logistic equation into $u' = -k(u - 1/K)$; three
  equally spaced counts give $K = 1/c$ with $c = \dfrac{u_0u_2 - u_1^2}{u_0 + u_2 - 2u_1}$.
- The Gompertz model $P' = kP\ln(K/P)$ has solution
  $P = K\exp\!\left(-\ln\frac{K}{P_0}e^{-kt}\right)$, inflection at $K/e$, fastest rate $kK/e$.
- All three are simplified, descriptive models; check their assumptions before trusting a
  long-range forecast.
