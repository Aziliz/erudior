---
id: stat-m1-h-robust
module: stat-m1
honors: true
title: 'Robust statistics: resistance made precise'
minutes: 45
topics: [Robust statistics]
drills: [stat-m1-r2-trimmed-mean, stat-m1-r2-mad, stat-m1-r2-modified-z]
refs: [stat-ref-descriptive]
---
## Why the median is "safer," in numbers

The core lessons said the median and IQR are resistant and the mean and standard deviation are
not, and showed it with examples. This honors lesson makes those statements precise. First,
each measure of center is the *best* answer to a different question, and the question explains
its behavior. Second, the *breakdown point* measures exactly how much bad data a statistic can
survive. Third, there are robust alternatives for spread and for flagging outliers that work
even when several values are bad, a situation the ordinary z-score handles poorly.

## What each center minimizes

Suppose you must summarize the data $x_1, \dots, x_n$ by one number $c$, and you pay a penalty
for how far each value is from $c$. Different penalties lead to different centers.

**The mean minimizes the sum of squared distances.** For any number $c$,

$$\sum (x_i - c)^2 = \sum (x_i - \bar{x})^2 + n(\bar{x} - c)^2.$$

To see why, write $x_i - c = (x_i - \bar{x}) + (\bar{x} - c)$ and square. The cross term is
$2(\bar{x} - c)\sum (x_i - \bar{x})$, which is zero because deviations from the mean add to zero.
The first sum doesn't depend on $c$ and the second term is never negative, so the total is
smallest exactly when $c = \bar{x}$. Squaring is the reason the mean is not resistant: a value
10 units away costs 100, so the mean moves a long way to reduce that one large cost.

**The median minimizes the sum of absolute distances** $\sum |x_i - c|$. Picture sliding $c$
to the right by a small amount $\delta$. Each value above $c$ gets $\delta$ closer and each value
below gets $\delta$ farther. If more values lie above $c$ than below, the total falls, so you keep
moving right; if more lie below, you move left. The total stops falling only when there are
equally many values on each side: at the median. When $n$ is even, every $c$ between the two
middle values gives the same minimum. With absolute distances, a value 10 units away costs only
10, and moving toward it helps only if more than half the data are on its side, which is why the
median ignores how far out the extreme values are.

Two more centers fit the same pattern. The **midrange**, $(\min + \max)/2$, minimizes the
*largest* distance $\max |x_i - c|$; it depends only on the two most extreme values, so it is the
least resistant summary of all. The mode maximizes the number of values hit exactly.

```plot
{"x": [0, 18], "y": [0, 450], "xLabel": "c", "yLabel": "sum of squares", "functions": [{"f": "(x-2)^2+(x-3)^2+(x-5)^2+(x-9)^2+(x-16)^2"}], "points": [{"at": [7, 130], "label": "mean 7, minimum 130"}], "caption": "Sum of squared distances from c for the data 2, 3, 5, 9, 16"}
```

```plot
{"x": [0, 18], "y": [0, 45], "xLabel": "c", "yLabel": "sum of distances", "functions": [{"f": "abs(x-2)+abs(x-3)+abs(x-5)+abs(x-9)+abs(x-16)"}], "points": [{"at": [5, 20], "label": "median 5, minimum 20"}], "caption": "Sum of absolute distances from c for the same data"}
```

### Example 1

For the data 2, 3, 5, 9, 16, check the identity at $c = 5$.

1. Mean: $35/5 = 7$. Deviations from 7: −5, −4, −2, 2, 9; squares add to
   $25 + 16 + 4 + 4 + 81 = 130$.
2. Directly, $\sum (x_i - 5)^2 = 9 + 4 + 0 + 16 + 121 = 150$.
3. The identity predicts $130 + 5(7 - 5)^2 = 130 + 20 = 150$. It agrees.
4. The absolute distances from the median 5 add to $3 + 2 + 0 + 4 + 11 = 20$; from the mean 7
   they add to $5 + 4 + 2 + 2 + 9 = 22$. Each center wins its own contest.

## The breakdown point

Resistance can be measured. The **breakdown point** of a statistic is the smallest fraction of
the data that, if replaced by arbitrarily wild values (say, data-entry errors), can make the
statistic as large or as small as you like.

| Statistic | Breakdown point | Why |
|---|---|---|
| Mean, standard deviation, range | one value, $1/n$ (essentially 0% for large $n$) | one huge value drags them anywhere |
| 10% trimmed mean | about 10% | the most extreme 10% at each end are dropped |
| IQR | 25% | wrecking it means moving a quartile, which takes about a quarter of the data |
| Median | about 50% | wild values must outnumber the good ones |

No sensible summary can do better than 50%: if more than half the data are wild, the wild values
*are* the main pattern.

### Example 2

A temperature logger records 10 readings (°C): 18.2, 18.9, 19.1, 19.4, 19.6, 19.9, 20.3, 20.5,
21.0, 21.8. A transmission error turns 19.9 into 9999. Compare the summaries.

1. Clean data: mean 19.87, median $(19.6 + 19.9)/2 = 19.75$.
2. With the error: the sum rises by $9999 - 19.9 = 9979.1$, so the mean jumps to about 1017.8.
   One bad value out of ten made the mean useless.
3. The median of the corrupted data is the average of 19.6 and 20.3, which is 19.95: it moved
   by only 0.2.
4. A 10% trimmed mean drops the lowest and highest value (one each, since 10% of 10 is 1)
   before averaging. Clean: $(18.9 + 19.1 + \cdots + 21.0)/8 \approx 19.84$. Corrupted: the 9999
   is dropped as the highest value, and the mean of the remaining eight is about 20.08.

## Trimmed and winsorized means

A $p\%$ **trimmed mean** (from the core lessons) sorts the data, removes $p\%$ of the values from
*each* end and averages the rest. A $p\%$ **winsorized mean** instead *replaces* the removed
values with the most extreme values that remain, then averages all $n$. For the clean logger
data, 10% winsorizing changes 18.2 to 18.9 and 21.8 to 21.0, giving a mean of 19.86.

Both are compromises between the mean (0% trimmed) and the median (essentially 50% trimmed).
They use more of the data than the median, so with well-behaved data they vary less from sample
to sample, yet one or two wild values cannot move them far. Some judged sports apply the same
idea, dropping the highest and lowest judges' scores before averaging, so that one biased or
mistaken judge has little effect.

## A robust measure of spread: the MAD

The **median absolute deviation** (MAD) does for spread what the median does for center:

$$\text{MAD} = \text{median}\,\bigl|x_i - \text{median}\bigr|.$$

Find the median, find every value's distance from it, and take the median of those distances.
Its breakdown point is 50%. For normally distributed data, the MAD is about $0.6745\sigma$
(because the middle 50% of a normal distribution lies within $0.6745\sigma$ of the center), so
$1.4826 \times \text{MAD}$ estimates $\sigma$. In the same way, $\text{IQR}/1.349$ estimates
$\sigma$ for normal data. When these robust estimates are much smaller than $s$, a few extreme
values are inflating $s$.

### Example 3

Delivery times (minutes): 9, 11, 12, 13, 14, 15, 16, 18, 22, 30. Find the MAD and compare
robust and ordinary measures of spread.

1. Median: $(14 + 15)/2 = 14.5$.
2. Distances from 14.5: 5.5, 3.5, 2.5, 1.5, 0.5, 0.5, 1.5, 3.5, 7.5, 15.5.
3. Sorted: 0.5, 0.5, 1.5, 1.5, 2.5, 3.5, 3.5, 5.5, 7.5, 15.5. The median of these ten is
   $(2.5 + 3.5)/2 = 3$, so $\text{MAD} = 3$ minutes.
4. Robust estimates of $\sigma$: $1.4826 \times 3 \approx 4.45$ and $\text{IQR}/1.349 = 6/1.349
   \approx 4.45$. The ordinary standard deviation is $s \approx 6.15$, inflated mostly by the 30.

## Flagging outliers robustly

The ordinary z-score, $z = (x - \bar{x})/s$, uses two non-resistant statistics. Outliers pull
$\bar{x}$ toward themselves and inflate $s$, which shrinks their own z-scores; with several
outliers, each can hide the others. This is called **masking**. A robust alternative is the
**modified z-score** (Iglewicz and Hoaglin, 1993):

$$M_i = \frac{0.6745\,(x_i - \text{median})}{\text{MAD}},$$

with values of $|M_i| > 3.5$ flagged as possible outliers. The constant 0.6745 puts $M$ on
roughly the same scale as an ordinary z-score for normal data.

### Example 4

Check the delivery time 30 by three rules.

1. Ordinary z-score: mean 16, $s \approx 6.15$, so $z = (30 - 16)/6.15 \approx 2.28$. Not
   unusual by a "beyond 3 standard deviations" rule, partly because 30 itself inflated $s$.
2. $1.5 \times \text{IQR}$ rule (core lesson): upper fence $18 + 9 = 27$, so 30 is an outlier.
3. Modified z-score: $M = 0.6745 \times (30 - 14.5)/3 \approx 3.48$, just under 3.5, so it is
   borderline but not flagged.

Different rules make different trade-offs, and none is "the" definition of an outlier. Report
which rule you used, and investigate flagged values rather than deleting them.

## Common mistakes

- Computing the MAD around the mean, or forgetting to take the median of the distances (the
  *mean* absolute deviation is a different, less resistant statistic).
- Trimming $p\%$ in total instead of $p\%$ from *each* end.
- Thinking a high breakdown point makes a statistic better in every way. With clean, roughly
  normal data, the mean and standard deviation vary less from sample to sample than the median
  and MAD.
- Using the MAD scale factor 1.4826 for strongly skewed data; it is calibrated for the normal
  distribution.

## Key points

- The mean minimizes $\sum (x_i - c)^2$, the median minimizes $\sum |x_i - c|$, and the midrange
  minimizes the largest distance. The identity $\sum (x_i - c)^2 = \sum (x_i - \bar{x})^2 + n(\bar{x} - c)^2$
  proves the first.
- Breakdown point: mean, SD and range 0 (one value is enough); $p\%$ trimmed mean about $p\%$;
  IQR 25%; median and MAD 50%.
- $\text{MAD} = \text{median}|x_i - \text{median}|$; for normal data $1.4826\,\text{MAD}$ and
  $\text{IQR}/1.349$ estimate $\sigma$.
- Modified z-score $M = 0.6745(x - \text{median})/\text{MAD}$; flag $|M| > 3.5$. Ordinary
  z-scores suffer from masking.
