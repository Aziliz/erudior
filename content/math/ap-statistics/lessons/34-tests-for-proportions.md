---
id: stat-test-prop
module: stat-m8
title: Significance tests for proportions
minutes: 35
topics: [Tests for proportions]
drills: [stat-z-test-prop, stat-two-prop-test]
refs: [stat-ref-inference, stat-ref-which-test]
---
## Applying the framework

The last two lessons set up the logic of tests and the errors they can make. This lesson
puts the logic to work on the most common categorical questions: is a population
proportion different from a claimed value, and do two populations (or two treatments)
have different proportions?

## One-proportion z test

To test $H_0: p = p_0$:

$$z = \frac{\hat{p} - p_0}{\sqrt{\dfrac{p_0(1-p_0)}{n}}}.$$

Notice the standard error uses $p_0$, not $\hat{p}$ (unlike the confidence interval). The
p-value is computed *assuming $H_0$ is true*, and under $H_0$ the standard deviation of
$\hat{p}$ is exactly $\sqrt{p_0(1-p_0)/n}$ — no estimate needed.

*Conditions*:

- **Random**: random sample or random assignment.
- *10%*: $n \le 0.10N$ when sampling without replacement.
- **Large counts**: $np_0 \ge 10$ and $n(1 - p_0) \ge 10$ (expected counts under $H_0$).

### Example 1

A rail operator claims at least 90% of riders are satisfied. A consumer group surveys an SRS
of 300 riders and finds 258 satisfied. Is there convincing evidence at $\alpha = 0.05$ that
the true proportion is less than 90%?

1. *State*: $H_0: p = 0.90$, $H_a: p < 0.90$, where $p$ is the proportion of all riders
   who are satisfied. $\alpha = 0.05$.
2. *Plan*: one-proportion z test. Random ✓. 10%: the operator has far more than 3,000
   riders ✓. Large counts: $300(0.9) = 270$ and $300(0.1) = 30$, both $\ge 10$ ✓.
3. *Do*: $\hat{p} = 258/300 = 0.86$. $SE = \sqrt{0.9(0.1)/300} \approx 0.01732$.
   $z = (0.86 - 0.90)/0.01732 \approx -2.31$. p-value $= P(Z \le -2.31) \approx 0.0105$.
4. *Conclude*: Since $0.0105 < 0.05$, reject $H_0$. There is convincing evidence that fewer
   than 90% of riders are satisfied.

### Example 2: a two-sided test

A coin-flip machine is supposed to be fair. In 1,000 flips it produces 530 heads. Test
$H_0: p = 0.5$ vs. $H_a: p \ne 0.5$ at $\alpha = 0.05$.

$z = \dfrac{0.53 - 0.5}{\sqrt{0.25/1000}} \approx 1.90$; p-value $= 2P(Z \ge 1.90) \approx 0.058$.
Since $0.058 > 0.05$, fail to reject $H_0$: not convincing evidence the machine is unfair.
(A 95% CI for $p$, about $(0.499, 0.561)$, contains 0.5 — consistent with the test.)

## Two-proportion z test

To compare two proportions, test $H_0: p_1 = p_2$ (equivalently $p_1 - p_2 = 0$) against a
one- or two-sided alternative.

If $H_0$ is true, both groups share a common proportion $p$. The best estimate of it
combines the samples — the **pooled proportion**:

$$\hat{p}_c = \frac{X_1 + X_2}{n_1 + n_2} = \frac{\text{total successes}}{\text{total sample size}}.$$

Then

$$z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}_c(1 - \hat{p}_c)\left(\dfrac{1}{n_1} + \dfrac{1}{n_2}\right)}}.$$

Why pool here but not in the confidence interval? A test computes probabilities assuming
$H_0$ ($p_1 = p_2$), so we use the single estimate that $H_0$ implies. A confidence interval
makes no such assumption, so it estimates each $p$ separately.

*Conditions*: random samples or random assignment; independent groups; 10% for each
sample; large counts — $n_1\hat{p}_c$, $n_1(1 - \hat{p}_c)$, $n_2\hat{p}_c$, $n_2(1 - \hat{p}_c)$ all
at least 10.

### Example 3

In the fare-reminder experiment, 168 of 400 riders with message A and 132 of 400 with
message B renewed their pass. Is there a difference at $\alpha = 0.01$?

1. *State*: $H_0: p_A = p_B$; $H_a: p_A \ne p_B$, where $p_A$, $p_B$ are the renewal rates
   for riders who would receive each message. $\alpha = 0.01$.
2. *Plan*: two-proportion z test. Random assignment ✓. Pooled
   $\hat{p}_c = 300/800 = 0.375$; expected counts $400(0.375) = 150$ and $400(0.625) = 250$ ✓.
3. *Do*: $SE = \sqrt{0.375(0.625)(1/400 + 1/400)} \approx 0.03423$.
   $z = (0.42 - 0.33)/0.03423 \approx 2.63$. p-value $= 2P(Z \ge 2.63) \approx 0.0086$.
4. *Conclude*: $0.0086 < 0.01$: reject $H_0$. There is convincing evidence that the renewal
   rates differ; since riders were randomly assigned, message A appears to *cause* a higher
   renewal rate.

## Interpreting the p-value in context

For Example 3: "Assuming the two messages produce the same renewal rate, there is about a
0.86% probability of getting a difference in sample proportions of 0.09 or more in either
direction just from the random assignment."

### Example 4: when conditions fail

A railway claims only 2% of its trains are cancelled. In a random sample of 150 trains, 6 were
cancelled (4%). Can we use a one-proportion z test? Check large counts with $p_0$:
$150(0.02) = 3 < 10$. No — the normal approximation is poor. An exact binomial calculation
works instead: if $p = 0.02$, $P(X \ge 6) = 1 - P(X \le 5) \approx 0.08$ for $X \sim B(150, 0.02)$.
At $\alpha = 0.05$ that is not convincing evidence against the claim.

## One-sided two-proportion tests

If the agency in Example 3 had stated in advance that it expected message A to do *better*
($H_a: p_A > p_B$), the p-value would be the single upper tail: $P(Z \ge 2.63) \approx 0.0043$.
The test statistic is the same; only the tail area changes. As always, the direction must come
from the research question, not from looking at which sample proportion came out larger.

## Common mistakes

- Using $\hat{p}$ instead of $p_0$ in the one-sample test's standard error.
- Forgetting to pool in the two-sample test (or pooling in the interval).
- Checking large counts with $\hat{p}$ for a one-sample test instead of $p_0$.
- Concluding causation from observational samples.
- Saying "the probability $H_0$ is true is 0.0086."

## Key points

- One-proportion: $z = (\hat{p} - p_0)/\sqrt{p_0(1-p_0)/n}$; large counts with $p_0$.
- Two-proportion: pool $\hat{p}_c = (X_1 + X_2)/(n_1 + n_2)$;
  $z = (\hat{p}_1 - \hat{p}_2)/\sqrt{\hat{p}_c(1-\hat{p}_c)(1/n_1 + 1/n_2)}$.
- Tests use the null value in the standard error; intervals use the sample estimates.
- Follow State–Plan–Do–Conclude and interpret in context.
