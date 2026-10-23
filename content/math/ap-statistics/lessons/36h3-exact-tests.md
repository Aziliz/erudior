---
id: stat-m8-h-exact-tests
module: stat-m8
honors: true
title: 'Exact tests: binomial, sign and signed-rank'
minutes: 45
topics: [Exact tests]
drills: [stat-m8-r2-exact-binom, stat-m8-r2-exact-two-sided, stat-m8-r2-sign-test]
refs: [stat-ref-inference]
---
## When the normal curve isn't good enough

The z and t tests of lessons 35 and 36 get their p-values from a normal or t curve that
*approximates* the true sampling distribution, which is why they come with conditions such as
large counts and "no strong skew." Lesson 35's Example 4 met a case where the approximation failed
(only 3 cancellations expected) and switched to an exact binomial calculation. This lesson
develops that idea. An **exact test** computes its p-value from the exact distribution of the test
statistic under $H_0$, with no normal approximation. Exact tests work for any sample size, which
makes them the tool of choice for small samples, rare events and skewed data. Here we build three
of them for the situations of this module: one proportion, and paired data analyzed without
assuming normality.

## The exact binomial test

If $H_0: p = p_0$ is true and the $n$ trials are independent, the number of successes $X$ is exactly
binomial, $B(n, p_0)$. The **exact binomial test** uses that distribution directly.

- $H_a: p > p_0$: p-value $= P(X \ge x)$, where $x$ is the observed count.
- $H_a: p < p_0$: p-value $= P(X \le x)$.
- $H_a: p \ne p_0$: there is no single agreed rule when the distribution is lopsided. One common
  convention doubles the smaller tail (capping the result at 1). Another, used by R's `binom.test`,
  adds the probabilities of every outcome that is no more likely than the one observed. They agree
  when $p_0 = 0.5$ and can differ otherwise.

### Example 1: train cancellations, exactly

A railway claims that 2% of its trains are cancelled; in a random sample of 150 trains, 6 were. Is
there evidence that the rate is higher?

1. Under $H_0$, $X \sim B(150, 0.02)$, with mean 3.
2. $P(X \ge 6) = 1 - P(X \le 5) \approx 1 - 0.9181 = 0.0819$ (binomcdf).
3. At $\alpha = 0.05$, fail to reject: 6 cancellations is unusual but not convincing evidence
   against a 2% rate.

If the question had been two-sided, doubling would give $2(0.0819) \approx 0.164$, while summing all
outcomes no more likely than 6 gives about 0.130. Same data, same $H_0$, two defensible p-values:
which convention is used should be stated.

## Discreteness: exact tests are conservative

A binomial count can only take whole-number values, so only certain p-values are possible. With
$n = 10$ fair-coin trials and $H_a: p > 0.5$:

| Reject when $X \ge$ | 8 | 9 | 10 |
|---|---|---|---|
| Probability under $H_0$ | $56/1024 \approx 0.0547$ | $11/1024 \approx 0.0107$ | $1/1024 \approx 0.0010$ |

"Reject when the p-value is at most 0.05" therefore means "reject when $X \ge 9$," and the actual
Type I error rate is 0.0107, well below the nominal 0.05. A test whose true Type I error rate is
at most its nominal $\alpha$ is called **conservative**. Exact tests on small discrete data usually
are, which costs some power; the protection against false alarms is never worse than promised.

## The sign test for paired data

The **sign test** is an exact binomial test in disguise. For paired data, look only at whether
each difference is positive or negative. If the treatment has no effect, in the sense that the
median of the differences is 0, each nonzero difference is equally likely to be positive or
negative, so the number of positive signs is $B(n, 0.5)$, where $n$ counts the nonzero differences.
Differences of exactly 0 carry no sign and are dropped.

### Example 2: the new jig again

Lesson 36's eight operators had differences (new − old) of 3, −1, 4, 2, 5, 0, 3, 2. Test whether the
new jig tends to increase output.

1. Drop the 0, leaving $n = 7$ nonzero differences, of which 6 are positive.
2. Under $H_0$, the number of positives is $B(7, 0.5)$. The p-value is
   $$P(X \ge 6) = \frac{\binom{7}{6} + \binom{7}{7}}{2^7} = \frac{7 + 1}{128} = 0.0625.$$
3. At $\alpha = 0.05$ the sign test does not reject, while the paired t test of lesson 36 gave a
   p-value of 0.0074.

The two tests answer slightly different questions and use different information. The t test uses
the sizes of the differences and assumes they come from a roughly normal population; the sign test
uses only their directions and assumes nothing about shape. Throwing away the sizes costs power,
but the sign test can't be fooled by an outlier: a difference of +50 counts the same as +2.

## The Wilcoxon signed-rank test

The sign test ignores how big the differences are; the t test uses their sizes but leans on
normality. The **Wilcoxon signed-rank test** (Frank Wilcoxon, 1945) sits in between: it uses the
*ranks* of the sizes.

1. Drop zero differences. Rank the remaining differences by absolute value, from 1 (smallest) to
   $n$; tied absolute values share the average of their ranks.
2. Add up the ranks of the positive differences. Call the sum $W^+$.
3. Under $H_0$ (the differences come from a distribution symmetric about 0), each rank is equally
   likely to carry a plus or a minus sign, independently. So all $2^n$ sign patterns are equally
   likely, and the p-value is the share of patterns giving a $W^+$ at least as extreme as the
   observed one.

The ranks always add to $1 + 2 + \dots + n = n(n+1)/2$, so a large $W^+$ means the negative
differences hold only a few small ranks.

### Example 3: the jig data, ranked

The seven nonzero differences are 3, −1, 4, 2, 5, 3, 2.

| Difference | −1 | 2 | 2 | 3 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|
| Rank of size | 1 | 2.5 | 2.5 | 4.5 | 4.5 | 6 | 7 |

1. The ranks add to $7(8)/2 = 28$. Only the −1 is negative, with rank 1, so $W^+ = 28 - 1 = 27$.
2. $W^+ \ge 27$ happens only when the negative ranks add to at most 1: either no negative ranks (one
   pattern) or only rank 1 negative (one pattern).
3. p-value $= 2/2^7 = 2/128 \approx 0.0156$ (one-sided, $H_a$: the new jig tends to increase output).

So the three tests of the same data give 0.0625 (sign), 0.0156 (signed-rank) and 0.0074 (t). Each
uses more of the information in the differences than the one before, and each assumes a bit more:
nothing about shape, then symmetry, then near-normality. Statisticians call tests like the sign and
signed-rank tests **nonparametric** (or distribution-free), because their null distributions don't
depend on a normal or any other parametric model.

```plot
{"x": [-0.7, 7.7], "y": [-0.03, 0.32], "xLabel": "number of positive signs out of 7", "yLabel": "probability", "bars": [{"x": 0, "height": 0.0078, "width": 0.7}, {"x": 1, "height": 0.0547, "width": 0.7}, {"x": 2, "height": 0.1641, "width": 0.7}, {"x": 3, "height": 0.2734, "width": 0.7}, {"x": 4, "height": 0.2734, "width": 0.7}, {"x": 5, "height": 0.1641, "width": 0.7}, {"x": 6, "height": 0.0547, "width": 0.7, "color": "#c2570c"}, {"x": 7, "height": 0.0078, "width": 0.7, "color": "#c2570c"}], "labels": [{"at": [6.5, 0.1], "text": "p = 8/128"}], "caption": "The sign test's null distribution B(7, 0.5); the shaded bars (6 or 7 positive) give the p-value 0.0625"}
```

## The same idea elsewhere

Two other exact tests use the same recipe of listing equally likely outcomes. A permutation test
lists every way the random assignment could have split the observed responses between groups (see
the honors lesson on resampling in the final honors module), and Fisher's exact test does the same
for a two-way table with fixed totals, using hypergeometric probabilities (see the honors lesson
after the chi-square tests in module 9). Both are the standard fallbacks when two-sample z or t
conditions fail.

## Choosing between exact and approximate tests

Exact tests need fewer assumptions, but they are discrete and often conservative, and two-sided
versions need a stated convention. Approximate z and t tests are quick and accurate when their
conditions hold. A sensible habit: check the conditions; when counts are small or small samples are
strongly skewed, use an exact test, and say which one.

## Common mistakes

- Keeping zero differences in a sign test; they carry no sign and are dropped.
- Using $B(n, 0.5)$ for a sign test with $n$ = all pairs instead of the nonzero pairs.
- Counting only the observed outcome, not all outcomes "at least as extreme."
- In the signed-rank test, ranking the signed differences instead of their absolute values.
- Doubling a lopsided binomial tail without saying so, or expecting it to match software.
- Assuming an exact test's actual Type I error rate equals $\alpha$; it is usually smaller.
- Thinking "nonparametric" means "no assumptions": the data must still be random, and the signed-rank
  test assumes symmetry.

## Key points

- Exact tests take p-values from the exact null distribution, so they work for any sample size.
- Exact binomial: tail probabilities of $B(n, p_0)$; two-sided p-values depend on the convention.
- Sign test: count positive differences among the nonzero ones; compare with $B(n, 0.5)$.
- Signed-rank test: rank the sizes of the nonzero differences, add the ranks of the positive ones,
  and compare with all $2^n$ equally likely sign patterns.
- Sign, signed-rank and t tests use more and more of the data's information and need more and more
  assumptions.
- Discreteness makes exact tests conservative; they trade some power for guaranteed error control.
