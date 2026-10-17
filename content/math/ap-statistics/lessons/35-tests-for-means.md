---
id: stat-test-mean
module: stat-m8
title: Significance tests for means
minutes: 35
topics: [Tests for means]
drills: [stat-t-test-one, stat-t-test-paired, stat-t-test-two]
refs: [stat-ref-inference, stat-ref-which-test]
---
## Testing claims about means

Is the mean fill of cereal boxes below the labeled 12 oz? Does a training course improve
productivity? Do two production lines differ in average output? These are questions about
means, and they use the t distributions from lesson 30 with the test logic of lesson 32.
Three versions cover nearly every case: one-sample, paired, and two-sample.

## One-sample t test

To test $H_0: \mu = \mu_0$:

$$t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}, \qquad \text{df} = n - 1.$$

The p-value comes from the t distribution with $n - 1$ df (`tcdf` on a calculator), using the
tail(s) given by $H_a$.

*Conditions* (same as the t interval): random; 10%; normal population or $n \ge 30$, or for
small samples no strong skew or outliers in the data.

### Example 1

A cereal box is labeled 12 oz. An inspector takes a random sample of 20 boxes:
$\bar{x} = 11.85$ oz, $s = 0.32$ oz; a dotplot shows no skew or outliers. Is there convincing
evidence at $\alpha = 0.05$ that the mean fill is less than 12 oz?

1. *State*: $H_0: \mu = 12$; $H_a: \mu < 12$, where $\mu$ is the mean fill of all boxes.
2. *Plan*: one-sample t test; random ✓, 10% ✓, no strong skew or outliers ✓.
3. *Do*: $SE = 0.32/\sqrt{20} \approx 0.0716$; $t = (11.85 - 12)/0.0716 \approx -2.10$;
   df = 19; p-value $= P(t_{19} \le -2.10) \approx 0.025$.
4. *Conclude*: $0.025 < 0.05$, so reject $H_0$. There is convincing evidence that the mean
   fill is below 12 oz.

```plot
{"x": [-4, 4], "y": [-0.04, 0.42], "grid": false, "functions": [{"f": "tpdf(x, 19)"}], "shade": [{"f": "tpdf(x, 19)", "from": -4, "to": -2.096}], "segments": [{"from": [-4, 0], "to": [4, 0]}], "labels": [{"at": [-2.1, -0.025], "text": "t = −2.10"}, {"at": [0, -0.025], "text": "0"}], "caption": "p-value: area left of t = −2.10 under the t distribution with 19 df"}
```

Using a t table: with df = 19, the value 2.10 lies between 2.093 (one-tail area 0.025) and
2.205 (0.02), so $0.02 < p < 0.025$ — enough to compare with $\alpha$.

## Paired t test

For paired data (before/after, matched subjects), compute each pair's difference and run a
one-sample t test on the differences, usually with $H_0: \mu_d = 0$:

$$t = \frac{\bar{d} - 0}{s_d/\sqrt{n}}, \qquad \text{df} = n - 1 \text{ (}n = \text{number of pairs)}.$$

### Example 2

Eight operators assemble units with an old jig and a new jig (order randomized). Units per
hour, new minus old: 3, −1, 4, 2, 5, 0, 3, 2. Does the new jig increase output? Use
$\alpha = 0.05$.

1. *State*: $H_0: \mu_d = 0$; $H_a: \mu_d > 0$, where $\mu_d$ is the mean difference (new − old)
   for all such operators.
2. *Plan*: paired t test. Order of jigs randomized ✓; a dotplot of the 8 differences shows
   no outliers or strong skew ✓.
3. *Do*: $\bar{d} = 2.25$, $s_d \approx 1.982$, $SE = 1.982/\sqrt8 \approx 0.701$,
   $t \approx 3.21$, df = 7, p-value $\approx 0.0074$.
4. *Conclude*: reject $H_0$: convincing evidence the new jig increases mean output.

Treating the two columns as independent samples would be wrong — and would usually miss the
effect, since operator-to-operator differences would swamp the jig effect.

## Two-sample t test

For independent samples or two randomly assigned treatment groups, test $H_0: \mu_1 = \mu_2$:

$$t = \frac{(\bar{x}_1 - \bar{x}_2) - 0}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}},$$

with df from technology (Welch) or conservatively $\min(n_1, n_2) - 1$.

*Conditions*: random; independent groups; 10%; each group normal or $n \ge 30$ (or no strong
skew/outliers in small samples).

### Example 3

Daily output of two production lines over randomly selected days: Line A, $n = 15$,
$\bar{x} = 24.3$, $s = 4.1$; Line B, $n = 18$, $\bar{x} = 21.0$, $s = 5.2$. Do the lines differ in
mean output? $\alpha = 0.05$.

1. *State*: $H_0: \mu_A = \mu_B$; $H_a: \mu_A \ne \mu_B$.
2. *Plan*: two-sample t test; conditions assumed checked.
3. *Do*: $SE = \sqrt{4.1^2/15 + 5.2^2/18} \approx 1.620$; $t = 3.3/1.620 \approx 2.04$.
   Conservative df = 14: p-value $= 2P(t_{14} \ge 2.04) \approx 0.061$. Technology (df ≈ 30.9):
   p-value ≈ 0.050.
4. *Conclude*: with either method, p-value $> 0.05$ (just barely with Welch). Fail to reject
   $H_0$: the data don't give convincing evidence that mean outputs differ. A borderline
   result like this calls for a larger study, not a firm claim either way.

## Choosing among the three

| Data | Procedure |
|---|---|
| One sample, compare its mean to a standard | one-sample t |
| Two measurements on each individual / matched pairs | paired t on differences |
| Two independent groups | two-sample t |

The key question is whether the two sets of numbers are *dependent* (paired) or
**independent**.

## Using tests and intervals together

A 95% t interval for $\mu_A - \mu_B$ in Example 3 is about $(-0.003, 6.60)$ (Welch df). It
barely includes 0, matching the borderline test, and shows the difference could be as large
as 6.6 units — practically important if real. The interval says more than the test.

### Example 4: which test?

1. *Mean battery life of a random sample of 40 batteries vs. the advertised 20 hours.* One
   sample vs. a standard → one-sample t test.
2. *Reaction times of 18 drivers measured both with and without a phone conversation.* Each
   driver measured twice → paired t test on the differences.
3. *Repair times for 25 randomly chosen jobs at depot A and 30 at depot B.* Two independent
   samples → two-sample t test.
4. *Proportion of on-time trains on two lines.* Categorical response → not a t test at all;
   use a two-proportion z test.

## Common mistakes

- Using a two-sample test on paired data, or vice versa.
- Using df $= n$ or $n_1 + n_2$.
- Using $z$ critical values with $s$ in small samples.
- Ignoring outliers in small samples.
- Concluding "no difference" from a non-significant result.

## Key points

- One-sample t: $t = (\bar{x} - \mu_0)/(s/\sqrt{n})$, df $= n - 1$.
- Paired t: one-sample t on the differences.
- Two-sample t: $t = (\bar{x}_1 - \bar{x}_2)/\sqrt{s_1^2/n_1 + s_2^2/n_2}$, Welch or conservative df.
- Decide paired vs. independent from the study design.
