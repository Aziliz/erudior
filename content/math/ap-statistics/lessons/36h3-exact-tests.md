---
id: stat-m8-h-exact-tests
module: stat-m8
honors: true
title: 'Exact tests: binomial, sign, permutation and Fisher'
minutes: 45
topics: [Exact tests]
drills: [stat-m8-r2-exact-binom, stat-m8-r2-sign-test, stat-m8-r2-fisher]
refs: [stat-ref-inference]
---
## When the normal curve isn't good enough

The z and t tests of lessons 35 and 36 get their p-values from a normal or t curve that
*approximates* the true sampling distribution, which is why they come with conditions such as
large counts and "no strong skew." Lesson 35's Example 4 met a case where the approximation failed
(only 3 cancellations expected) and switched to an exact binomial calculation. This lesson
develops that idea. An **exact test** computes its p-value from the exact distribution of the test
statistic under $H_0$, with no normal approximation. Exact tests work for any sample size, which
makes them the tool of choice for small samples, rare events and skewed data.

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

## Permutation tests

Lesson 20 introduced the randomization test: shuffle the group labels many times and see how often
chance alone produces a difference as large as the observed one. With small groups we can list
*every* possible shuffle instead of sampling them. The result is a **permutation test**, whose
p-value is exact.

The logic rests on the random assignment itself. If the treatment has no effect, each subject's
response would have been the same in either group, so the only randomness is which subjects
landed in which group, and every possible split was equally likely.

### Example 3: four against four

Eight new drivers are randomly split into two groups of 4: one trains on a simulator, one in the
usual way. Their scores on a skills test:

- Simulator: 14, 17, 19, 22 (mean 18.00)
- Usual: 10, 12, 15, 16 (mean 13.25)

The observed difference in means is $18.00 - 13.25 = 4.75$. Is that convincing evidence that the
simulator helps?

1. *Count the splits.* There are $\binom{8}{4} = 70$ ways to choose which 4 of the 8 scores form the
   simulator group, all equally likely under $H_0$.
2. *A shortcut.* The 8 scores total 125, so a group with sum $S$ has difference in means
   $\frac{S}{4} - \frac{125 - S}{4} = \frac{2S - 125}{4}$. A larger difference means a larger $S$; the
   observed group has $S = 72$.
3. *Find the splits with $S \ge 72$.* Starting from the largest scores: $22 + 19 + 17 + 16 = 74$,
   $22 + 19 + 17 + 15 = 73$, $22 + 19 + 17 + 14 = 72$, $22 + 19 + 16 + 15 = 72$. Every other choice
   sums to 71 or less. That is 4 splits.
4. *p-value* $= 4/70 \approx 0.057$. At $\alpha = 0.05$, fail to reject, narrowly.

```plot
{"x": [-6.5, 6.5], "y": [-0.4, 6], "xLabel": "difference in means (simulator − usual)", "yLabel": "number of splits", "bars": [{"x": -5.75, "height": 1, "width": 0.4}, {"x": -5.25, "height": 1, "width": 0.4}, {"x": -4.75, "height": 2, "width": 0.4}, {"x": -4.25, "height": 1, "width": 0.4}, {"x": -3.75, "height": 3, "width": 0.4}, {"x": -3.25, "height": 2, "width": 0.4}, {"x": -2.75, "height": 3, "width": 0.4}, {"x": -2.25, "height": 5, "width": 0.4}, {"x": -1.75, "height": 3, "width": 0.4}, {"x": -1.25, "height": 5, "width": 0.4}, {"x": -0.75, "height": 4, "width": 0.4}, {"x": -0.25, "height": 5, "width": 0.4}, {"x": 0.25, "height": 5, "width": 0.4}, {"x": 0.75, "height": 4, "width": 0.4}, {"x": 1.25, "height": 5, "width": 0.4}, {"x": 1.75, "height": 3, "width": 0.4}, {"x": 2.25, "height": 5, "width": 0.4}, {"x": 2.75, "height": 3, "width": 0.4}, {"x": 3.25, "height": 2, "width": 0.4}, {"x": 3.75, "height": 3, "width": 0.4}, {"x": 4.25, "height": 1, "width": 0.4}, {"x": 4.75, "height": 2, "width": 0.4, "color": "#c2570c"}, {"x": 5.25, "height": 1, "width": 0.4, "color": "#c2570c"}, {"x": 5.75, "height": 1, "width": 0.4, "color": "#c2570c"}], "segments": [{"from": [4.5, 0], "to": [4.5, 5.5], "dashed": true}], "labels": [{"at": [5.1, 3.2], "text": "4 of 70"}], "caption": "All 70 equally likely splits; 4 give a difference of 4.75 or more"}
```

A one-sided two-sample t test on the same data (Welch df) gives a p-value of about 0.037. Part of the gap is
discreteness: with only 70 splits, the smallest possible p-value is $1/70 \approx 0.014$. For larger
groups the number of splits explodes ($\binom{20}{10} = 184{,}756$), and software either enumerates
them or, as in lesson 20, samples a few thousand at random to estimate the exact p-value.

## Fisher's exact test

For a two-way table of two groups and a yes/no outcome, fix the row and column totals. Under $H_0$
(no association), the count in one cell then follows a hypergeometric distribution: it is like
dealing the "yes" outcomes at random among the subjects. Using that distribution to get the
p-value is **Fisher's exact test**, the standard choice when expected counts are too small for the
two-proportion z test.

R. A. Fisher introduced the idea in *The Design of Experiments* (1935) with a famous story: a lady
claimed she could taste whether milk or tea had been poured into the cup first. Eight cups, 4 of
each kind, are presented in random order, and she must pick the 4 with milk first. If she is only
guessing, every set of 4 is equally likely, so $P(\text{all 4 right}) = 1/\binom{8}{4} = 1/70 \approx 0.014$.
Getting at least 3 right is far less impressive: $\binom{4}{3}\binom{4}{1} = 16$ sets have exactly 3
right, so $P(\ge 3 \text{ right}) = (16 + 1)/70 \approx 0.243$.

### Example 4: a small trial

In a small randomized trial, 7 of 9 patients on a new treatment improved, compared with 2 of 8 on the
standard treatment. Is there evidence that the new treatment works better?

| | Improved | Not improved | Total |
|---|---|---|---|
| New | 7 | 2 | 9 |
| Standard | 2 | 6 | 8 |
| Total | 9 | 8 | 17 |

1. *Large counts?* The pooled rate is $9/17$; the expected count of "not improved" in the standard
   group is $8 \cdot 8/17 \approx 3.8$, far below 10. The z test is out.
2. *Null distribution.* With the margins fixed, the number $X$ of improvers in the new group is the
   number of the 9 improvers that land among the 9 new-treatment patients when 9 of the 17 are chosen at
   random:
   $$P(X = x) = \frac{\binom{9}{x}\binom{8}{9 - x}}{\binom{17}{9}}, \qquad \binom{17}{9} = 24{,}310.$$
3. *One-sided p-value* $= P(X \ge 7) = \dfrac{\binom{9}{7}\binom{8}{2} + \binom{9}{8}\binom{8}{1} + \binom{9}{9}\binom{8}{0}}{24{,}310} = \dfrac{1{,}008 + 72 + 1}{24{,}310} \approx 0.0445.$
4. At $\alpha = 0.05$, reject $H_0$: convincing evidence (though not overwhelming) that the new
   treatment raises the improvement rate. Because patients were randomly assigned, the conclusion
   is causal for patients like these.

## Choosing between exact and approximate tests

Exact tests need fewer assumptions, but they are discrete and often conservative, and two-sided
versions need a stated convention. Approximate z and t tests are quick and accurate when their
conditions hold. A sensible habit: check the conditions; when counts are small or small samples are
strongly skewed, use an exact test, and say which one.

## Common mistakes

- Keeping zero differences in a sign test; they carry no sign and are dropped.
- Using $B(n, 0.5)$ for a sign test with $n$ = all pairs instead of the nonzero pairs.
- Counting only the observed arrangement, not all arrangements "at least as extreme."
- Doubling a lopsided binomial tail without saying so, or expecting it to match software.
- Assuming an exact test's actual Type I error rate equals $\alpha$; it is usually smaller.
- Running a permutation test on an observational study and calling the conclusion causal.

## Key points

- Exact tests take p-values from the exact null distribution, so they work for any sample size.
- Exact binomial: tail probabilities of $B(n, p_0)$; two-sided p-values depend on the convention.
- Sign test: count positive differences among the nonzero ones; compare with $B(n, 0.5)$.
- Permutation test: under $H_0$ every split is equally likely; p-value = share of splits at least as
  extreme as observed.
- Fisher's exact test: hypergeometric probabilities for a two-way table with fixed margins.
- Discreteness makes exact tests conservative; they trade some power for guaranteed error control.
