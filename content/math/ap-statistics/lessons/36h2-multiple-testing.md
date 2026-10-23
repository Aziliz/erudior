---
id: stat-m8-h-multiple-testing
module: stat-m8
honors: true
title: Many tests at once: multiple comparisons and false discoveries
minutes: 45
topics: [Multiple testing]
drills: [stat-m8-r2-fwer, stat-m8-r2-holm-bh, stat-m8-r2-false-share]
refs: [stat-ref-inference]
---
## One test is not the whole story

Lesson 34 showed that a test at $\alpha = 0.05$ makes a Type I error 5% of the time when $H_0$ is
true. That promise is about *one* test. Real investigations run many: a survey compares dozens of
subgroups, a trial records several outcomes, a genetics study tests thousands of genes. Run
enough tests and some will come out "significant" by chance alone. This lesson measures that
problem, shows three standard corrections, and looks at how the same arithmetic has fed doubts
about published research.

## p-values are uniform when $H_0$ is true

A useful fact: if $H_0$ is true and the test statistic has a continuous distribution, the p-value
is equally likely to fall anywhere between 0 and 1. The reason is the definition. "p-value
$\le 0.05$" happens exactly when the test statistic lands in the most extreme 5% of its null
distribution, which has probability 0.05; the same argument works for any number $a$ in place of
0.05, so $P(\text{p-value} \le a) = a$, the defining property of a uniform distribution. (For
discrete statistics, such as counts, the probability is at most $a$.)

So when the null is true, a p-value of 0.03 is no more "nearly real" than a p-value of 0.63. Among
100 tests of true nulls, we expect about 5 p-values below 0.05, about 1 below 0.01, and so on.

## The family-wise error rate

The **multiple comparisons** problem: when many tests are run, the chance of at least one false
alarm grows. The **family-wise error rate** (FWER) is the probability of at least one Type I error
among all the tests in a family. If $m$ independent tests of true null hypotheses each use level
$\alpha$, the complement rule gives

$$\text{FWER} = 1 - (1 - \alpha)^m.$$

### Example 1: twenty station redesigns

A transit agency tries 20 different platform signs, each at a different station, and tests each
one at $\alpha = 0.05$ for an effect on boarding times. Suppose none of the signs has any effect.

1. Each test has probability 0.95 of correctly failing to reject.
2. If the tests are independent, all 20 do so with probability $0.95^{20} \approx 0.358$.
3. FWER $= 1 - 0.358 = 0.642$.

There is about a 64% chance that at least one useless sign looks like a success. The expected
number of false alarms is $20(0.05) = 1$. If the agency reports only the "winning" sign, the
reader has no way to see that it was one of 20 tries.

## The Bonferroni correction

The simplest fix is the **Bonferroni correction**: to keep the FWER at or below $\alpha$, test each
of the $m$ hypotheses at level $\alpha/m$ (equivalently, multiply each p-value by $m$ and compare with
$\alpha$). It is named after the Italian mathematician Carlo Bonferroni, whose probability
inequalities it rests on.

*Why it works.* Let $A_i$ be the event that test $i$ falsely rejects. For any events, the
probability of a union is at most the sum of the probabilities (the general addition rule with
the overlaps dropped):

$$P(A_1 \text{ or } A_2 \text{ or } \dots \text{ or } A_m) \le P(A_1) + \dots + P(A_m) \le m \cdot \frac{\alpha}{m} = \alpha.$$

The argument doesn't need the tests to be independent, which makes Bonferroni safe almost
anywhere. Its cost is power: with $m = 20$, each test must reach $p \le 0.0025$, so real but modest
effects are easily missed.

## Holm's method: same guarantee, more power

Sture Holm (1979) found a step-by-step version that controls the FWER just as Bonferroni does but
never rejects fewer hypotheses. **Holm's method**:

1. Sort the p-values from smallest to largest: $p_{(1)} \le p_{(2)} \le \dots \le p_{(m)}$.
2. Compare $p_{(1)}$ with $\alpha/m$, $p_{(2)}$ with $\alpha/(m-1)$, $p_{(3)}$ with $\alpha/(m-2)$, and so on,
   up to $p_{(m)}$ with $\alpha/1$.
3. Reject hypotheses in order as long as each p-value is at or below its threshold. At the first
   one that is above its threshold, stop: that hypothesis and all later ones are not rejected.

The first comparison is exactly Bonferroni's; after that the thresholds relax, because once a
hypothesis has been rejected there are fewer that could still be true.

## The false discovery rate

When thousands of hypotheses are screened, as in genetics, controlling the chance of even *one*
false alarm is too strict. Yoav Benjamini and Yosef Hochberg (1995) proposed controlling the
**false discovery rate** (FDR) instead: the expected proportion of false discoveries among all
the hypotheses rejected (counted as 0 when nothing is rejected). An FDR of 5% tolerates a few false
leads among many true ones.

The **Benjamini–Hochberg procedure** at level $q$:

1. Sort the p-values: $p_{(1)} \le \dots \le p_{(m)}$.
2. Find the largest $k$ with $p_{(k)} \le \dfrac{k}{m}q$.
3. Reject the hypotheses with the $k$ smallest p-values (even if some earlier p-value was above its
   own line).

It controls the FDR at $q$ when the tests are independent (and under some kinds of positive
dependence); more cautious versions exist for other cases.

### Example 2: three corrections, one set of p-values

An experiment measures five outcomes. The sorted p-values are 0.004, 0.009, 0.013, 0.031 and 0.20.
Use $\alpha = q = 0.05$.

| Rank $i$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| p-value | 0.004 | 0.009 | 0.013 | 0.031 | 0.20 |
| Bonferroni: $0.05/5$ | 0.01 ✓ | 0.01 ✓ | 0.01 ✗ | 0.01 ✗ | 0.01 ✗ |
| Holm: $0.05/(6 - i)$ | 0.0100 ✓ | 0.0125 ✓ | 0.0167 ✓ | 0.0250 ✗ | stop |
| BH: $0.05\,i/5$ | 0.01 ✓ | 0.02 ✓ | 0.03 ✓ | 0.04 ✓ | 0.05 ✗ |

- *Bonferroni* rejects 2 hypotheses (0.004 and 0.009).
- *Holm* rejects 3: 0.004, 0.009 and 0.013 pass; 0.031 is above 0.025, so it stops there.
- *Benjamini–Hochberg* rejects 4: the largest rank with $p_{(k)} \le 0.01k$ is $k = 4$
  ($0.031 \le 0.04$), so the four smallest are rejected.
- Testing each at 0.05 with no correction would also reject 4, but with no protection at all.

```plot
{"x": [0.5, 5.5], "y": [-0.004, 0.062], "xLabel": "rank i", "yLabel": "p-value", "functions": [{"f": "0.01*x", "label": "BH line 0.05i/5"}, {"f": "0.01", "dashed": true, "label": "Bonferroni 0.01"}], "points": [{"at": [1, 0.004]}, {"at": [2, 0.009]}, {"at": [3, 0.013]}, {"at": [4, 0.031], "label": "0.031"}, {"at": [1, 0.01], "open": true}, {"at": [2, 0.0125], "open": true}, {"at": [3, 0.016667], "open": true}, {"at": [4, 0.025], "open": true, "label": "Holm 0.025"}, {"at": [5, 0.05], "open": true}], "caption": "Sorted p-values (filled dots; the fifth, 0.20, is off the chart), Holm thresholds (open dots), the BH line and the Bonferroni level"}
```

Which to use depends on the cost of a false alarm. In a confirmatory drug trial with a few
pre-chosen outcomes, the FWER (Holm or Bonferroni) is the usual standard. In exploratory screening
whose hits will be checked again, the FDR is often more sensible.

## How many "discoveries" are false?

Even with a single test per question, the share of significant results that are false depends on
how many of the tested ideas were right to begin with. Picture a field that tests 1,000
hypotheses at $\alpha = 0.05$, of which 10% are real effects, studied with power 0.80.

### Example 3: the screening arithmetic

1. Real effects: 100. Detected: $0.80 \times 100 = 80$ true discoveries.
2. True nulls: 900. False alarms: $0.05 \times 900 = 45$.
3. Significant results: $80 + 45 = 125$, of which $45/125 = 36\%$ are false.
4. With power 0.35 instead (common for small studies), true discoveries drop to 35, and
   $45/(35 + 45) \approx 56\%$ of the significant results are false.

This is the same base-rate reasoning as a medical screening test (lesson 22): a significant
result is like a positive test, $\alpha$ plays the part of the false positive rate and power the part
of the sensitivity. John Ioannidis's widely read 2005 essay "Why most published research findings
are false" made this argument. Its premises (how many tested ideas are true, typical power, how
much bias) are debated, and the share of false findings surely differs between fields, but the
arithmetic itself is not in dispute.

## Hidden multiplicity: p-hacking

Multiplicity doesn't need many outcomes on paper. It also arises from flexible analysis: trying
several outcome measures, dropping "outliers" a few different ways, adding or removing control
variables, or analyzing subgroups, then reporting the version that crossed 0.05. This is called
**p-hacking**. Simmons, Nelson and Simonsohn (2011) showed by simulation that combining just four
such common choices could raise the real false-positive rate of a nominal 5% test to about 61%.
Gelman and Loken called the subtler version, where each choice seems reasonable given the data, the
"garden of forking paths."

A special case is **optional stopping**: checking the p-value as the data come in and stopping as
soon as it dips below 0.05. Even when $H_0$ is true, a z test checked after every 10 observations up
to 100 (10 looks) rejects at some point about 19% of the time, not 5%. Designs that plan interim
looks in advance use stricter thresholds at each look to keep the overall rate at 5%.

The main defenses are procedural. **Preregistration** records the hypotheses, outcomes and analysis
plan before the data are collected; reports should say how many tests were run; exploratory findings
should be labeled as such and replicated. When the Open Science Collaboration (2015) repeated 100
published psychology experiments, 97% of the originals had reported significant results but only
about 36% of the replications did. The American Statistical Association's 2016 statement on
p-values put it plainly: proper inference requires full reporting and transparency.

## Common mistakes

- Reporting the one significant result out of many tests without mentioning the others.
- Using Bonferroni with the wrong $m$: it is the number of tests actually run, not the number reported.
- In Holm's method, continuing past the first p-value that fails its threshold.
- In Benjamini–Hochberg, stopping at the first failure instead of finding the *largest* $k$ that passes.
- Thinking a p-value just under 0.05 among many tests is strong evidence.
- Confusing the FDR (a share of the rejections) with $\alpha$ (a rate among true nulls).

## Key points

- Under a true $H_0$ (continuous statistic), p-values are uniform on 0 to 1.
- FWER for $m$ independent true-null tests: $1 - (1 - \alpha)^m$; 20 tests at 0.05 give about 0.64.
- Bonferroni: test each at $\alpha/m$; valid under any dependence, but costly in power.
- Holm: compare sorted p-values with $\alpha/m, \alpha/(m-1), \dots$; stop at the first failure.
- Benjamini–Hochberg: reject up to the largest $k$ with $p_{(k)} \le kq/m$; controls the FDR.
- Share of false discoveries $= \dfrac{\alpha \cdot (\text{true nulls})}{\alpha \cdot (\text{true nulls}) + \text{power} \cdot (\text{real effects})}$.
- Preregister, report every test, and replicate.
