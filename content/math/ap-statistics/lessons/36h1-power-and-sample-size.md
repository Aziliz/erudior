---
id: stat-m8-h-power-planning
module: stat-m8
honors: true
title: 'Planning a study: power curves and sample size'
minutes: 45
topics: [Power and sample size]
drills: [stat-m8-r2-n-mean, stat-m8-r2-power-prop, stat-m8-r2-n-two-sample]
refs: [stat-ref-inference]
---
## From "what is the power?" to "how many do we need?"

Lesson 34 computed the power of one test against one alternative: with $n = 25$, the test of
$H_0: \mu = 50$ against $H_a: \mu > 50$ ($\sigma = 10$, $\alpha = 0.05$) detects a true mean of 55
with probability about 0.80. Real planning runs the other way. A researcher knows how big an
effect would matter and how much power she wants, and needs the sample size that delivers it.
This lesson turns lesson 34's calculation into a formula for $n$, extends it to proportions and
to two groups, and then looks at what goes wrong when studies are run with too little power.
All the tests here are z tests with a known (or planning) standard deviation; the last section
says how t tests change the answer.

## The power curve

Power depends on the true parameter value, so it is really a function. For the test above,
$\sigma_{\bar{x}} = 2$ and the test rejects when $\bar{x} \ge 50 + 1.645(2) = 53.29$. If the true mean is
$\mu$, then $\bar{x}$ is $N(\mu, 2)$ and

$$\text{power}(\mu) = P(\bar{x} \ge 53.29) = 1 - \Phi\!\left(\frac{53.29 - \mu}{2}\right),$$

where $\Phi$ is the standard normal cumulative distribution function (the area to the left). The
graph of this function is the **power curve** of the test.

```plot
{"x": [47, 61], "y": [-0.08, 1.08], "xLabel": "true mean μ", "yLabel": "power", "functions": [{"f": "1 - normcdf((53.29 - x)/2)", "label": "n = 25"}, {"f": "1 - normcdf((51.645 - x)/1)", "label": "n = 100", "dashed": true}, {"f": "0.05", "dashed": true, "color": "#888888"}], "points": [{"at": [50, 0.05], "label": "α = 0.05 at μ = 50"}, {"at": [55, 0.804], "label": "0.80"}, {"at": [53, 0.912], "label": "0.91"}], "caption": "Power curves of the one-sided z test: n = 25 (solid) and n = 100 (dashed)"}
```

Three features are worth reading off.

1. At $\mu = 50$ (the null value), the power equals $\alpha = 0.05$: "rejecting when $H_0$ is true"
   is exactly a Type I error.
2. The curve rises toward 1 as the true mean moves away from the null value: big effects are
   easy to detect.
3. A larger sample makes the curve steeper. With $n = 100$ the standard error halves, so the
   curve reaches 0.91 at $\mu = 53$, where the $n = 25$ curve is only at 0.44.

For a two-sided test the curve is U-shaped instead, rising on both sides of $\mu_0$, because the
test rejects for large departures in either direction.

## A formula for the sample size

Ask for power $1 - \beta$ against a true mean that is $\delta$ above $\mu_0$ (one-sided test, upper
alternative). Write $z_\alpha$ for the point with upper-tail area $\alpha$ (1.645 for 0.05) and
$z_\beta$ for the point with upper-tail area $\beta$ (0.842 for $\beta = 0.20$, 1.282 for $\beta = 0.10$).

- The test rejects when $\bar{x} \ge \mu_0 + z_\alpha \sigma/\sqrt{n}$.
- If the true mean is $\mu_0 + \delta$, the power is $1 - \beta$ exactly when that cutoff sits
  $z_\beta$ standard errors *below* the true mean:
  $$\mu_0 + z_\alpha\frac{\sigma}{\sqrt{n}} = \mu_0 + \delta - z_\beta \frac{\sigma}{\sqrt{n}}.$$
- Cancel $\mu_0$ and collect: $\delta = (z_\alpha + z_\beta)\,\sigma/\sqrt{n}$, so

$$n = \left(\frac{(z_\alpha + z_\beta)\,\sigma}{\delta}\right)^{2}.$$

Always round *up*: rounding down gives slightly less power than asked for. For a two-sided test
at level $\alpha$, replace $z_\alpha$ by $z_{\alpha/2}$ (1.960 for $\alpha = 0.05$). That ignores the tiny
chance of rejecting in the wrong tail, which is negligible once the power is reasonable.

The formula shows the levers at a glance. Halving the effect $\delta$ multiplies $n$ by 4; doubling
$\sigma$ also multiplies $n$ by 4; asking for more power or a smaller $\alpha$ raises $z_\beta$ or $z_\alpha$.

### Example 1: enough power to detect a mean of 53

Lesson 34 found that $n = 25$ gives power only 0.44 against $\mu = 53$. How large must $n$ be for
power 0.90, still with $\sigma = 10$ and a one-sided test at $\alpha = 0.05$?

1. Here $\delta = 53 - 50 = 3$, $z_\alpha = 1.645$ and, for $\beta = 0.10$, $z_\beta = 1.282$.
2. $n = \left(\dfrac{(1.645 + 1.282)(10)}{3}\right)^2 = (9.757)^2 \approx 95.2$.
3. Round up: $n = 96$.

Check: with $n = 96$, $\sigma_{\bar{x}} = 10/\sqrt{96} \approx 1.021$, the cutoff is
$50 + 1.645(1.021) \approx 51.68$, and the power is $P\!\left(Z \ge \frac{51.68 - 53}{1.021}\right) = P(Z \ge -1.29) \approx 0.90$.
(With $n = 95$ it is 0.8996, just short.)

## Effect size

The formula depends on $\delta$ and $\sigma$ only through their ratio. The **effect size**
$d = \delta/\sigma$ measures the effect in standard deviations of the individual measurements (not
of $\bar{x}$), and $n = \left((z_\alpha + z_\beta)/d\right)^2$. For a one-sided test at $\alpha = 0.05$
with power 0.80:

| Effect size $d$ | 0.2 | 0.5 | 0.8 |
|---|---|---|---|
| $n$ needed | 155 | 25 | 10 |

The psychologist Jacob Cohen suggested calling $d = 0.2$, 0.5 and 0.8 "small," "medium" and
"large" (in his 1988 book on power analysis). He meant these as rough defaults for when nothing
better is known, and what counts as large differs a lot between fields; it is better to decide
from the subject what size of effect would actually matter.

## Sample size for proportions and for two groups

**One proportion.** For $H_0: p = p_0$ against a true value $p_1$, the standard deviation of $\hat{p}$
is different under the two hypotheses, so each $z$ gets its own:

$$n = \left(\frac{z_\alpha\sqrt{p_0(1-p_0)} + z_\beta\sqrt{p_1(1-p_1)}}{|p_1 - p_0|}\right)^{2}.$$

**Two means.** With two independent groups of equal size $n$ each and a common standard deviation
$\sigma$, the standard error of $\bar{x}_1 - \bar{x}_2$ is $\sigma\sqrt{2/n}$, and the same algebra gives

$$n \text{ per group} = 2\left(\frac{(z_{\alpha/2} + z_\beta)\,\sigma}{\delta}\right)^{2} \quad \text{(two-sided)}.$$

The factor 2 is the price of comparing two estimates, each with its own noise; a matched-pairs
design avoids much of it when pairing is possible.

### Example 2: the rider-satisfaction survey

Lesson 35 tested $H_0: p = 0.90$ against $H_a: p < 0.90$ with 300 riders. Suppose the true
satisfaction rate is 0.86. What was the power, and how many riders would give power 0.80?

1. *Power with $n = 300$.* Under $H_0$, $SE = \sqrt{0.9(0.1)/300} \approx 0.01732$, so the test rejects
   when $\hat{p} \le 0.90 - 1.645(0.01732) \approx 0.8715$. If $p = 0.86$, the SD of $\hat{p}$ is
   $\sqrt{0.86(0.14)/300} \approx 0.02003$, and the power is
   $P\!\left(Z \le \frac{0.8715 - 0.86}{0.02003}\right) = P(Z \le 0.57) \approx 0.72$.
2. *Sample size for power 0.80.* $\sqrt{0.9(0.1)} = 0.300$ and $\sqrt{0.86(0.14)} \approx 0.347$:
   $$n = \left(\frac{1.645(0.300) + 0.842(0.347)}{0.04}\right)^2 \approx (19.64)^2 \approx 385.6,$$
   so 386 riders.

The consumer group was somewhat lucky: with 300 riders it had about a 28% chance of missing a
real drop from 90% to 86%.

### Example 3: comparing two production lines

Lesson 36's comparison of two lines ended with a borderline result and the advice to run a larger
study. Plan one: detect a difference of $\delta = 3$ units with power 0.80 in a two-sided test at
$\alpha = 0.05$, using a planning value $\sigma \approx 5$ (the two sample SDs were 4.1 and 5.2).

$$n = 2\left(\frac{(1.960 + 0.842)(5)}{3}\right)^2 \approx 2(4.670)^2 \approx 43.6,$$

so 44 days per line, 88 in all, compared with the 15 and 18 days of the original study.

## When $\sigma$ is unknown: t tests

In practice $\sigma$ is estimated, the test is a t test, and $t$ critical values are a little larger
than $z$ values, so slightly more data are needed. Exact calculations use the noncentral t
distribution and are done by software. For Example 1 they give $n = 97$ for the t test instead
of 96; the z formula is usually only a few observations short. The bigger uncertainty is the
planning value of $\sigma$ itself, which usually comes from a pilot study or earlier research. If
the true $\sigma$ is 20% larger than the planning value, the study needed $1.2^2 = 1.44$ times as many
observations as it got, so planners often round $\sigma$ up.

## Why low power is worse than it looks

A low-power study doesn't just miss real effects. When it *does* reach significance, it tends to
exaggerate the effect, because only the estimates that happened to land far from 0 cleared the
bar. This is sometimes called the **winner's curse**; Andrew Gelman and John Carlin (2014) called
the exaggeration a Type M (magnitude) error.

### Example 4: a significant result from an underpowered study

Suppose the true effect is exactly 1 standard error ($\delta = SE$) and the test is two-sided at
$\alpha = 0.05$, so it rejects when the estimate is more than 1.96 SE from 0.

1. The estimate is $N(1, 1)$ in SE units. Power $= P(\text{estimate} > 1.96) + P(\text{estimate} < -1.96) \approx 0.1685 + 0.0015 \approx 0.17$.
2. Among the significant results, the average size of the estimate is about 2.49 SE (computed from
   the normal distribution cut off at 1.96).
3. So a "significant" finding overstates the true effect by a factor of about 2.5 on average.
   (With power 0.80 the factor is only about 1.13.)

This is one reason why striking results from small studies so often shrink when they are repeated.

## Don't compute power after the fact

Some reports compute "power" by plugging the observed effect into the power formula once the data
are in. This **observed power** adds no information: for a given test it is a fixed function of
the p-value, and a result with p-value exactly 0.05 always has observed power about 0.50
(Hoenig and Heisey, 2001). Power is a planning tool. After the study, a confidence interval is the
honest summary of which effect sizes the data can and can't rule out.

## Common mistakes

- Rounding the computed $n$ down, or to the nearest whole number, instead of up.
- Using $z_{\alpha}$ instead of $z_{\alpha/2}$ for a two-sided test.
- Forgetting the factor 2 (and that it is per group) in the two-sample formula.
- Using $\sigma_{\bar{x}}$ instead of $\sigma$ in the formula, or an effect size measured in standard errors.
- Treating Cohen's small, medium and large as rules rather than rough defaults.
- Reading a non-significant result from a low-power study as evidence of no effect, or trusting the
  size of a significant one.

## Key points

- The power curve shows power at every true value; it equals $\alpha$ at the null value and rises
  toward 1, more steeply for larger $n$.
- One-sided test for a mean: $n = \left((z_\alpha + z_\beta)\sigma/\delta\right)^2$, rounded up; use
  $z_{\alpha/2}$ for two-sided tests.
- Effect size $d = \delta/\sigma$; halving the effect quadruples the sample size.
- Two groups need about $2\left((z_{\alpha/2} + z_\beta)\sigma/\delta\right)^2$ per group.
- Underpowered studies miss real effects and exaggerate the ones they find; plan power before
  collecting data, and report intervals afterward.
