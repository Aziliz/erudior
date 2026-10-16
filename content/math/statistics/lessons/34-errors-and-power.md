---
id: stat-errors-power
module: stat-m8
title: Type I and Type II errors and power
minutes: 30
topics: [Errors and power]
drills: [stat-power-z]
refs: [stat-ref-inference]
---
## Tests can be wrong

A significance test reaches a decision from incomplete information, so it can be wrong in
two ways. Understanding those errors — their probabilities and their real-world costs — is
what lets you choose $\alpha$ sensibly and plan a study large enough to find an effect that
matters.

## Two kinds of error

| | $H_0$ true | $H_0$ false ($H_a$ true) |
|---|---|---|
| Reject $H_0$ | **Type I error** | Correct decision (power) |
| Fail to reject $H_0$ | Correct decision | **Type II error** |

- A **Type I error** rejects a true null hypothesis: a "false alarm," concluding there is an
  effect when there isn't.
- A **Type II error** fails to reject a false null hypothesis: a "missed detection,"
  overlooking an effect that is really there.

Only one of the two is possible in a given situation: if $H_0$ is true you can only make a
Type I error; if it's false, only a Type II.

### Example 1: consequences in context

A track inspector tests $H_0$: the rail segment is sound, versus $H_a$: the segment has a
dangerous flaw.

- Type I error: concluding a sound segment is flawed. Consequence: unnecessary repair cost
  and delays.
- Type II error: concluding a flawed segment is sound. Consequence: a possible derailment.

Here a Type II error is far more serious, so the railway should accept more false alarms —
use a larger $\alpha$ — to reduce missed flaws. In a drug trial where $H_a$ is "the new drug
works," a Type I error (approving a useless drug) may be the more serious mistake, calling
for a smaller $\alpha$.

## Probabilities of the errors

- $P(\text{Type I error}) = \alpha$. If $H_0$ is true, the test rejects exactly when the p-value
  falls at or below $\alpha$, which happens with probability $\alpha$. Choosing $\alpha = 0.05$
  means accepting a 5% false-alarm rate.
- $P(\text{Type II error}) = \beta$. Its value depends on what the true parameter actually
  is: a small departure from $H_0$ is easy to miss; a large one is hard to miss.

## Power

The **power** of a test against a specific alternative is the probability that it correctly
rejects $H_0$ when that alternative is true:

$$\text{power} = 1 - \beta.$$

Power answers the planning question "if the effect is this big, how likely am I to detect
it?" Studies are often designed for power of 0.80 or more.

### What increases power

1. *Larger sample size* $n$ — the most practical lever; it shrinks the standard error.
2. *Larger significance level* $\alpha$ — easier to reject (but more Type I errors).
3. *A true parameter farther from the null value* (a bigger effect is easier to see).
4. *Less variability* in the data (better measurement, blocking, matched pairs).
5. A one-sided alternative, when appropriate, has more power in that direction.

For a fixed $n$, reducing $\alpha$ increases $\beta$: the two error types trade off. Only
more information (larger $n$ or less noise) reduces both.

## Computing power (z test for a mean)

Suppose $H_0: \mu = 50$ versus $H_a: \mu > 50$, with known $\sigma = 10$, $n = 25$ and
$\alpha = 0.05$. What is the power if the true mean is 55?

1. *Find the rejection region in terms of $\bar{x}$*. $\sigma_{\bar{x}} = 10/\sqrt{25} = 2$.
   Reject when $z \ge 1.645$, i.e. $\bar{x} \ge 50 + 1.645(2) = 53.29$.
2. *Find the probability of landing there when $\mu = 55$*. Now $\bar{x}$ is $N(55, 2)$:
   $$P(\bar{x} \ge 53.29) = P\!\left(Z \ge \frac{53.29 - 55}{2}\right) = P(Z \ge -0.855) \approx 0.804.$$
3. Power ≈ 0.80; $\beta \approx 0.20$.

```plot
{"x": [43, 62], "y": [-0.03, 0.22], "grid": false, "functions": [{"f": "normpdf(x, 50, 2)"}, {"f": "normpdf(x, 55, 2)"}], "shade": [{"f": "normpdf(x, 55, 2)", "from": 53.29, "to": 62}, {"f": "normpdf(x, 50, 2)", "from": 53.29, "to": 62}], "segments": [{"from": [43, 0], "to": [62, 0]}, {"from": [53.29, 0], "to": [53.29, 0.21], "dashed": true}], "labels": [{"at": [50, -0.018], "text": "50"}, {"at": [55, -0.018], "text": "55"}, {"at": [53.29, -0.018], "text": "53.29"}, {"at": [57.2, 0.15], "text": "power"}, {"at": [48, 0.205], "text": "H₀"}, {"at": [56.6, 0.205], "text": "μ = 55"}], "caption": "Right of the cutoff: area under the H₀ curve is α; area under the μ = 55 curve is the power"}
```

How the levers move power in this example:

- True mean 53 instead of 55: power falls to about 0.44 (smaller effect).
- $\alpha = 0.01$ instead of 0.05: cutoff 54.65, power about 0.57.
- $n = 49$ instead of 25: $\sigma_{\bar{x}} \approx 1.43$, cutoff 52.35, power about 0.97.

### Example 2

A researcher's study has power 0.35 to detect a clinically important effect. What does
that mean, and what should be done? If the effect is real, there's only a 35% chance the
study will find it significant — a 65% chance of a Type II error. A non-significant result
from such a study says little. The fix is a larger sample (or less noisy measurements),
planned *before* collecting data.

### Example 3: how sample size drives power

Keep $H_0: \mu = 50$, $\sigma = 10$, $\alpha = 0.05$, but now ask for power against a *smaller*
effect, $\mu = 53$:

- $n = 25$: $\sigma_{\bar{x}} = 2$, cutoff 53.29, power $= P(Z \ge (53.29 - 53)/2) \approx 0.44$.
- $n = 100$: $\sigma_{\bar{x}} = 1$, cutoff $50 + 1.645 = 51.645$, power $= P(Z \ge (51.645 - 53)/1) \approx 0.91$.

Quadrupling the sample size turned a coin-flip chance of detecting the effect into a
91% chance. Power calculations like this are how researchers choose $n$ *before* collecting
data.

## Common mistakes

- Thinking $\alpha$ is the probability that $H_0$ is true, or that the p-value is $\alpha$.
- Describing an error without context: say what is concluded and what the consequence is.
- Assuming a non-significant result from a low-power study shows there is no effect.
- Forgetting that lowering $\alpha$ raises $\beta$ when $n$ is fixed.

## Key points

- Type I: reject a true $H_0$ (probability $\alpha$). Type II: fail to reject a false $H_0$ (probability $\beta$).
- Power $= 1 - \beta$ = probability of detecting a specific true alternative.
- Power increases with $n$, $\alpha$, effect size, and lower variability.
- Choose $\alpha$ by weighing the consequences of each error in context.
