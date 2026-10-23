---
id: stat-h1-meta-analysis
module: stat-h1
title: 'Effect sizes and meta-analysis: combining the evidence'
minutes: 50
topics: [Effect sizes and meta-analysis]
drills: [stat-h1-r2-cohens-d, stat-h1-r2-pooled-estimate, stat-h1-r2-i-squared]
refs: [stat-ref-inference]
---
## From one study to the evidence

The lesson on the logic of tests ended with a warning: statistical significance is not
importance, so report the size of an effect, not just its p-value. The last lesson added a second
warning: single studies, especially small ones, are often wrong. This capstone lesson puts those
together. It shows how to measure an effect on a common scale, and how a **meta-analysis**
combines many studies of the same question into one estimate that is more precise than any of them.
Meta-analyses sit at the top of most evidence rankings in medicine and education, so knowing how
they work, and how they fail, is part of reading science.

## Effect sizes

An **effect size** is a number that measures how large an effect is, independent of sample size.
The simplest is unstandardized: a difference in means in the original units (4.3 test points, 2.1 kg),
or a difference in proportions. Units make sense to a reader, but two studies that measured with
different scales can't be compared directly.

A standardized effect size divides by a standard deviation. For two groups, **Cohen's d** is

$$d = \frac{\bar{x}_1 - \bar{x}_2}{s_p}, \qquad s_p = \sqrt{\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}},$$

where $s_p$ is the pooled standard deviation. $d = 0.5$ means the group means differ by half a
standard deviation, so (for roughly normal data) the average member of group 1 scores above about
69% of group 2, since $P(Z < 0.5) \approx 0.69$. Jacob Cohen suggested reading 0.2, 0.5 and 0.8 as
"small", "medium" and "large", and he warned that these are rough conventions; a "small" effect on
death rates can matter enormously. For proportions, the risk difference, relative risk and odds
ratio from the lesson on risk and odds ratios are the usual effect sizes.

### Example 1: an effect size from summaries

A tutoring program is compared with regular study hall.

| Group | $n$ | Mean score | SD |
|---|---|---|---|
| Tutoring | 40 | 78.4 | 10.2 |
| Study hall | 45 | 74.1 | 11.0 |

1. Pooled SD: $s_p = \sqrt{\dfrac{39(10.2)^2 + 44(11.0)^2}{83}} = \sqrt{\dfrac{4057.56 + 5324}{83}} \approx \sqrt{113.03} \approx 10.63$.
2. $d = \dfrac{78.4 - 74.1}{10.63} \approx 0.40$: a small-to-medium effect, about 0.4 SD.
3. The pooled two-sample t statistic is $4.3 / \bigl(10.63\sqrt{1/40 + 1/45}\bigr) \approx 1.86$, with
   two-sided p-value about 0.066.

Not significant at 0.05, yet the estimated effect is far from trivial. The study was simply too small
to pin it down. That is the opposite of the 50,000-subject diet in the significance lesson, where a
trivial effect was highly significant.

## Why p-values aren't effect sizes

For two groups of equal size $n$, the pooled t statistic is $t = d\sqrt{n/2}$. The p-value mixes the
effect size with the sample size:

| $d$ | $n$ per group | $t$ | two-sided p-value |
|---|---|---|---|
| 0.1 (tiny) | 2,000 | 3.16 | 0.002 |
| 0.6 (medium-large) | 20 | 1.90 | 0.065 |

The tiny effect is "highly significant" and the large one is "not significant". Report $d$ (or the
raw difference) with a confidence interval, and the reader sees both the size and the uncertainty.

## Meta-analysis: weighting by precision

Suppose $k$ studies estimate the same effect, study $i$ giving estimate $y_i$ with standard error
$\text{SE}_i$. Averaging them equally would let a tiny study count as much as a huge one. Instead,
weight each by its precision, the **inverse-variance weight**

$$w_i = \frac{1}{\text{SE}_i^{\,2}}.$$

The pooled estimate and its standard error are

$$\hat{\theta} = \frac{\sum w_i y_i}{\sum w_i}, \qquad \text{SE}(\hat{\theta}) = \frac{1}{\sqrt{\sum w_i}}.$$

These weights give the most precise possible weighted average, and the pooled SE is smaller than
every individual SE. This is the **fixed-effect model** (also called common-effect): it assumes every
study measures one true effect and differs only by sampling error.

### Example 2: four small studies

Four randomized trials of a reading intervention report the gain in test points (treatment minus
control):

| Study | Estimate $y_i$ | $\text{SE}_i$ | 95% CI | Weight $w_i = 1/\text{SE}_i^2$ | Share of weight |
|---|---|---|---|---|---|
| A | 5.0 | 3.0 | −0.9 to 10.9 | 0.111 | 12% |
| B | 2.0 | 1.5 | −0.9 to 4.9 | 0.444 | 46% |
| C | 4.5 | 2.5 | −0.4 to 9.4 | 0.160 | 17% |
| D | 1.0 | 2.0 | −2.9 to 4.9 | 0.250 | 26% |

1. $\sum w_i = 0.111 + 0.444 + 0.160 + 0.250 = 0.965$.
2. $\sum w_i y_i = 0.556 + 0.889 + 0.720 + 0.250 = 2.414$, so $\hat{\theta} = 2.414/0.965 \approx 2.50$ points.
3. $\text{SE} = 1/\sqrt{0.965} \approx 1.02$, and the 95% CI is $2.50 \pm 1.96(1.02)$, about 0.51 to 4.50.
4. $z = 2.50/1.02 \approx 2.46$, two-sided p-value about 0.014.

Every individual interval includes 0, so each study alone was "inconclusive", and a reader counting
votes ("0 of 4 studies found an effect") would wrongly call the intervention useless. Combined, the
evidence for a positive effect is fairly strong.

## The forest plot

Meta-analyses display their results in a **forest plot**: one row per study, with a square at its
estimate (sized by its weight) and a line for its confidence interval, a diamond for the pooled
estimate whose width is the pooled CI, and a vertical line at "no effect" (0 for differences, 1 for
ratios).

![Forest plot of the four reading studies. Each study has a square at its estimate with a horizontal confidence-interval line, all crossing the vertical line at zero; study B's square is largest. A diamond at the bottom centered at 2.5 spans 0.5 to 4.5 and lies entirely to the right of the zero line.](images/stat-h1-forest-plot.svg)

## Heterogeneity

Are the studies really measuring one common effect? Real studies differ in populations, doses and
settings. **Heterogeneity** is variation among the true effects of the studies. Two summaries:

- **Cochran's Q**: $Q = \sum w_i (y_i - \hat{\theta})^2$. If there is no heterogeneity, $Q$ has
  roughly a chi-square distribution with $k - 1$ degrees of freedom, so $Q$ much larger than $k - 1$
  signals heterogeneity.
- **$I^2$** (Higgins and Thompson, 2002): $I^2 = \max\!\left(0,\ \dfrac{Q - (k-1)}{Q}\right)$, the
  estimated share of the variation among estimates that comes from real differences rather than
  chance. Values near 25%, 50% and 75% are often read as low, moderate and high.

In Example 2, $Q \approx 2.01$ with $k - 1 = 3$, so $I^2 = 0$: the four studies disagree no more than
chance predicts.

When heterogeneity is present, a **random-effects model** assumes each study's true effect is drawn
from a distribution of effects with variance $\tau^2$, and estimates the *average* effect. Weights
become $1/(\text{SE}_i^2 + \tau^2)$: more equal across studies, with a wider pooled interval.

### Example 3: when studies disagree

Three studies report $y = 8.0,\ 1.0,\ 3.0$ with $\text{SE} = 2.0,\ 1.5,\ 1.0$.

1. Weights $0.25, 0.444, 1$; fixed-effect estimate $\hat{\theta} = (2 + 0.444 + 3)/1.694 \approx 3.21$.
2. $Q = 0.25(8 - 3.21)^2 + 0.444(1 - 3.21)^2 + 1(3 - 3.21)^2 \approx 5.73 + 2.18 + 0.05 \approx 7.95$, with
   2 degrees of freedom ($\chi^2$ p-value about 0.019).
3. $I^2 = (7.95 - 2)/7.95 \approx 0.75$: high heterogeneity.
4. One common method (DerSimonian and Laird, 1986) estimates $\tau^2 \approx 6.3$. The random-effects
   weights $1/(4 + 6.3),\ 1/(2.25 + 6.3),\ 1/(1 + 6.3)$ give shares of about 28%, 33% and 39% (the
   fixed-effect shares were 15%, 26% and 59%), an average effect of about 3.7, and a 95% CI of about
   0.4 to 7.0, more than twice as wide as the fixed-effect interval.

With this much disagreement the better question is *why* the studies differ (different ages, doses?),
not just what their average is.

## Garbage in: publication bias

A meta-analysis can only combine studies it can find. If significant results are more likely to be
published (the previous lesson), the published studies overstate the effect, and so does any
meta-analysis of them. Robert Rosenthal called the unpublished null results the **file drawer
problem** (1979); the general distortion is **publication bias**. A **funnel plot** graphs each
study's estimate against its precision: without bias, the points form a symmetric funnel, wide at the
bottom where small imprecise studies scatter in both directions. If the small studies with
unimpressive results are missing, one lower corner of the funnel is empty. Asymmetry is a warning,
not proof, since small studies can differ for other reasons too.

Combining evidence is an old idea. Karl Pearson pooled several sets of data on typhoid inoculation
in 1904; the psychologist Gene Glass coined the term "meta-analysis" in 1976; and since 1993 the
Cochrane Collaboration has produced systematic reviews of medical treatments, which search for every
relevant trial, published or not, before pooling.

## Common mistakes

- Vote counting: tallying significant versus non-significant studies instead of pooling estimates.
- Weighting by $1/\text{SE}$ instead of $1/\text{SE}^2$, or averaging studies equally.
- Reading Cohen's 0.2/0.5/0.8 labels as rules rather than rough conventions.
- Pooling with a fixed-effect model when $Q$ and $I^2$ show the studies disagree.
- Forgetting that pooling cannot remove bias shared by the studies, including publication bias.

## Key points

- Effect size measures *how big*; Cohen's $d = (\bar{x}_1 - \bar{x}_2)/s_p$. A p-value mixes effect
  size with sample size ($t = d\sqrt{n/2}$ for equal groups).
- Fixed-effect meta-analysis: $w_i = 1/\text{SE}_i^2$, $\hat{\theta} = \sum w_i y_i / \sum w_i$,
  $\text{SE} = 1/\sqrt{\sum w_i}$.
- Heterogeneity: $Q = \sum w_i(y_i - \hat{\theta})^2$ compared with $k - 1$;
  $I^2 = \max(0, (Q - (k-1))/Q)$; if high, use random effects and look for reasons.
- A forest plot shows each study's estimate and CI and the pooled diamond.
- Publication bias distorts every meta-analysis built on published studies; funnel plots can hint at it.
