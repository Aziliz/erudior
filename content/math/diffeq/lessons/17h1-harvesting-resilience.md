---
id: de-m4-h-harvesting
module: de-m4
title: Harvesting policies and resilience
minutes: 45
honors: true
topics: [Harvesting models]
drills: [de-m4-r2-effort-yield, de-m4-r2-return-time]
refs: [de-ref-models]
---
Lesson 15 modeled a fishery that removes a fixed catch $h$ every year and found a
bifurcation: above the maximum sustainable yield $rK/4$ the population crashes. That lesson
left two questions open. Is a fixed catch the only way to manage a harvest? And can you tell
that a system is close to a tipping point *before* it tips? This lesson answers both with the
tools of Lesson 14: equilibria, phase lines and the derivative $f'(y^*)$.

The models here are deliberately simple. Real fisheries have age structure, random good and
bad years, uncertain parameters and economics. Treat the conclusions as the qualitative
lessons that the simple models teach, not as management rules.

## Two harvesting policies

Start from logistic growth $P' = rP(1 - P/K)$ and subtract the catch.

- **Constant-quota harvesting** removes a fixed amount $h$ per unit time, however many fish
  there are: $P' = rP(1 - P/K) - h$. This is Lesson 15's model.
- **Constant-effort harvesting** keeps the fishing effort fixed (the same fleet, fishing the
  same number of days), so the catch is proportional to the stock: when fish are plentiful the
  nets fill faster. The model is
  $$P' = rP\left(1 - \frac{P}{K}\right) - EP,$$
  where the effort $E$ is a per-capita rate (units 1/time): the fraction of the stock caught per
  unit time. Note the different units: $h$ is an amount per year, $E$ is "per year".

## Constant effort is still logistic

Collect the terms that are linear in $P$:

$$P' = (r - E)P - \frac{r}{K}P^2 = (r - E)P\left(1 - \frac{P}{K(1 - E/r)}\right).$$

For $E < r$ this is a logistic equation with growth rate $r - E$ and carrying capacity
$K(1 - E/r)$. So everything from Lesson 4 applies, including the solution formula. The
equilibria are $P = 0$ and

$$P^* = K\left(1 - \frac{E}{r}\right).$$

With $f(P) = (r - E)P - \frac rK P^2$, the derivative is $f'(P) = (r - E) - \frac{2r}{K}P$, so

- $f'(0) = r - E$: unstable when $E < r$, stable when $E > r$;
- $f'(P^*) = (r - E) - 2(r - E) = -(r - E)$: stable when $E < r$.

At $E = r$ the two equilibria meet at 0 and swap stability. That is a transcritical
bifurcation (Lesson 15), not a saddle-node. Push effort past $r$ and the stock declines to
zero, but it does so gradually as $E$ grows: there is no sudden cliff of the kind the quota
model has.

```plot
{"x": [0, 1.5], "y": [-10, 110], "xLabel": "effort E", "yLabel": "P*", "functions": [{"f": "100(1 - x)", "to": 1, "label": "P* = K(1 − E/r)"}, {"f": "0", "to": 1, "dashed": true}, {"f": "0", "from": 1}], "points": [{"at": [1, 0], "label": "E = r"}], "caption": "Bifurcation diagram for constant effort with r = 1, K = 100: solid branches are stable, dashed unstable. The positive equilibrium shrinks steadily and meets P = 0 at E = r (transcritical)."}
```

## Sustainable yield

At the stable equilibrium the catch per unit time is constant. This **sustainable yield** is

$$Y(E) = E\,P^* = EK\left(1 - \frac Er\right).$$

As a function of $E$ it is a downward parabola with roots $E = 0$ and $E = r$, so its maximum
is at $E = r/2$:

$$Y_{\max} = \frac r2 \cdot K \cdot \frac12 = \frac{rK}{4}, \qquad P^* = \frac K2.$$

That is the same maximum sustainable yield as the quota model, reached at the same stock
$K/2$. The difference is stability. With a quota at $h = rK/4$ the equilibrium is
semistable, and any dip below $K/2$ starts a collapse (Lesson 15). With effort $E = r/2$ the
equilibrium has $f'(P^*) = -r/2 < 0$: it is a genuine sink, and the stock returns after a
dip.

```plot
{"x": [0, 1.1], "y": [0, 30], "xLabel": "effort E", "yLabel": "yield Y", "functions": [{"f": "100x(1 - x)", "to": 1, "label": "Y = EK(1 − E/r)"}], "points": [{"at": [0.5, 25], "label": "MSY: E = r/2"}], "caption": "Sustainable yield against effort for r = 1, K = 100. Beyond E = r/2, more effort catches less."}
```

### Example 1

A stock has $r = 0.8$ per year and $K = 500$ tonnes and is fished with constant effort
$E = 0.3$ per year. Find the equilibrium stock, the sustainable yield, and the effort for
maximum sustainable yield. What happens if effort is doubled to $0.6$?

- Equilibrium: $P^* = 500(1 - 0.3/0.8) = 500(0.625) = 312.5$ tonnes. Since $E < r$, it is stable.
- Yield: $Y = 0.3 \times 312.5 = 93.75$ tonnes per year.
- Maximum: $E = r/2 = 0.4$, giving $Y = rK/4 = 100$ tonnes per year at $P^* = 250$.
- Doubling the effort: $P^* = 500(1 - 0.6/0.8) = 125$ and $Y = 0.6 \times 125 = 75$ tonnes
  per year. Twice the effort catches *less*, from a much smaller stock. Past $r/2$ the extra
  effort removes fish faster than the smaller stock can replace them.

## Resilience and return time

Both policies can give the same yield. To compare them, ask how quickly the stock recovers
after a bad year. Near a stable equilibrium, Lesson 14's linearization says $u = P - P^*$
obeys $u' \approx f'(P^*)\,u$, so a small disturbance shrinks like $u_0 e^{f'(P^*)t}$. Define the
**return time**

$$T_R = \frac{1}{\lvert f'(P^*)\rvert},$$

the time for a small disturbance to shrink by a factor of $e \approx 2.7$. A short return time
means high **resilience** in the sense used here: the system bounces back quickly. (Ecologists
use "resilience" in more than one way; another meaning is how large a disturbance a system can
absorb without switching to a different state. Both ideas appear below.)

- Effort: $f'(P^*) = -(r - E)$, so $T_R = \dfrac{1}{r - E}$.
- Quota with $h < rK/4$: the stable equilibrium is $P_2 = \dfrac K2(1 + s)$ with
  $s = \sqrt{1 - 4h/(rK)}$, and $f'(P_2) = r - \dfrac{2r}{K}P_2 = -rs$. So
  $$T_R = \frac{1}{r\sqrt{1 - 4h/(rK)}}.$$

### Example 2

For the quota model with $r = 1$ and $K = 100$, compute the equilibria and return time for
several quotas.

| Quota $h$ | Threshold $P_1$ | Stable $P_2$ | $f'(P_2)$ | Return time $T_R$ |
|---|---|---|---|---|
| 0 | 0 | 100 | $-1$ | 1 |
| 16 | 20 | 80 | $-0.6$ | 1.67 |
| 21 | 30 | 70 | $-0.4$ | 2.5 |
| 24 | 40 | 60 | $-0.2$ | 5 |
| 24.75 | 45 | 55 | $-0.1$ | 10 |

For example, at $h = 24$: $P = 50 \pm \sqrt{2500 - 2400} = 50 \pm 10$, and
$f'(60) = 1 - 60/50 = -0.2$, so $T_R = 5$ years. Two things get worse together as $h$ rises
toward 25. The safety margin $P_2 - P_1$ (how far the stock can fall before it can no longer
recover) shrinks from 100 to 10, and the return time grows without bound.

```plot
{"x": [0, 26], "y": [0, 12], "xLabel": "quota h", "yLabel": "return time T_R", "functions": [{"f": "1/sqrt(1 - x/25)", "to": 24.9, "label": "T_R = 1/√(1 − h/25)"}], "segments": [{"from": [25, 0], "to": [25, 12], "dashed": true, "label": "h = 25"}], "caption": "Return time for the quota model with r = 1, K = 100. It blows up as the quota approaches the bifurcation value 25."}
```

## Critical slowing down

The growing return time is not special to fish. At a saddle-node bifurcation, $f = 0$ and
$f_y = 0$ hold together (Lesson 15's recipe), so as the parameter approaches its critical
value, $f'(y^*)$ at the surviving stable equilibrium tends to 0 and the return time tends to
infinity. This is called **critical slowing down**: just before a tipping point, the system
recovers from small knocks more and more slowly. (The same happens as $E \to r$ in the effort
model, where $T_R = 1/(r - E)$.)

Researchers in ecology, climate science and other fields have proposed using this as an
**early-warning signal**: if recovery is getting slower, or if random fluctuations in data are
getting larger and longer-lasting, the system may be nearing a tipping point. This is an
active research area, and such signals are not foolproof: some abrupt changes give no warning,
and noisy data can give false alarms.

### Example 3

With $r = 1$ and $K = 100$, compare a quota $h = 24$ with an effort $E = 0.4$. Both settle at
$P^* = 60$ and give the same yield: $0.4 \times 60 = 24$. Now a bad winter drops the stock to
35. What happens under each policy?

**Quota.** Factor the right side: $P - \dfrac{P^2}{100} - 24 = -\dfrac{(P - 40)(P - 60)}{100}$.
The threshold is $P_1 = 40$, and at $P = 35$ the rate is $-\dfrac{(-5)(-25)}{100} = -1.25$: the
stock keeps falling. Separating variables and using partial fractions,

$$t = \int_{35}^{0} \frac{-100\,dP}{(P - 40)(P - 60)} = -5\ln\left\lvert\frac{P - 60}{P - 40}\right\rvert\,\Bigg|_{35}^{0} = -5(\ln 1.5 - \ln 5) = 5\ln\frac{10}{3} \approx 6.0,$$

so the stock is gone in about 6 years unless the quota is cut.

**Effort.** Now $P' = 0.6P\left(1 - \dfrac{P}{60}\right)$, a logistic equation. At $P = 35$,
$P' = 0.6 \cdot 35 \cdot \tfrac{25}{60} = 8.75 > 0$: the stock grows back. The solution is
$P(t) = \dfrac{60}{1 + \tfrac57 e^{-0.6t}}$, which is back above 59 after about 6.2 years, and
the return time is $T_R = 1/0.6 \approx 1.7$ years.

The reason is feedback. Under constant effort, a smaller stock automatically means a smaller
catch, which helps the stock recover. A fixed quota takes the same amount however few fish are
left, which pushes a weakened stock down further. (Real effort-based management has its own
problems; for example, better boats and gear raise the effective effort over time.)

## Common mistakes

- **Treating $E$ like $h$.** Effort is a per-capita rate; the catch is $EP$, which changes as
  $P$ changes.
- **Equating same yield with same safety.** Example 3 has equal yields and opposite fates.
- **Using the return time for a large shock.** $T_R$ comes from linearization and describes
  small disturbances. A large drop can cross a threshold, and then no return time applies.
- **Forgetting the absolute value.** $T_R = 1/\lvert f'(P^*)\rvert$ only makes sense at a stable
  equilibrium, where $f'(P^*) < 0$.
- **Calling every bifurcation a cliff.** The quota model collapses suddenly at a saddle-node; the
  effort model declines gradually through a transcritical bifurcation.

## Key points

- Constant effort: $P' = rP(1 - P/K) - EP$ is logistic with rate $r - E$ and capacity
  $K(1 - E/r)$; transcritical bifurcation at $E = r$.
- Sustainable yield $Y(E) = EK(1 - E/r)$ peaks at $E = r/2$ with $Y = rK/4$, the same MSY as the
  quota model, but at a stable equilibrium.
- Return time $T_R = 1/\lvert f'(P^*)\rvert$: effort gives $1/(r - E)$; quota gives
  $1/\big(r\sqrt{1 - 4h/(rK)}\big)$.
- Near a saddle-node, $f'(y^*) \to 0$, so recovery slows (critical slowing down), a proposed
  early-warning signal.
