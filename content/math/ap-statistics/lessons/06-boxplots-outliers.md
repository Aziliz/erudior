---
id: stat-boxplots
module: stat-m1
title: Five-number summary, outliers and boxplots
minutes: 25
topics: [Boxplots and outliers]
drills: [stat-five-number, stat-fences, stat-boxplot-read]
refs: [stat-ref-descriptive]
---
## Putting center and spread in one picture

The last two lessons gave you the median, quartiles and IQR. Together with the minimum
and maximum, they make a compact summary that can be drawn as a boxplot — one of the
most useful graphs for comparing groups. This lesson also gives a standard rule for
deciding when a value is far enough out to call an outlier.

## The five-number summary

The **five-number summary** of a data set is

$$\text{Min},\quad Q_1,\quad \text{Median},\quad Q_3,\quad \text{Max}.$$

These five numbers divide the data into four parts with about 25% of the values in each.
They describe center (median), spread (IQR and range) and even a hint of shape: if the
median is closer to $Q_1$ than to $Q_3$, the upper half of the data is more spread out
than the lower half — a sign of right skew.

## The 1.5 × IQR rule for outliers

An **outlier** is a value that falls outside the overall pattern. To make that judgment
consistent, a common rule computes two **fences**:

$$\text{lower fence} = Q_1 - 1.5 \times \text{IQR}, \qquad \text{upper fence} = Q_3 + 1.5 \times \text{IQR}.$$

Any value below the lower fence or above the upper fence is flagged as an outlier.

Why 1.5? It is a convention chosen by John Tukey, and it works well in practice: for
normally distributed data, only about 0.7% of values fall beyond these fences, so a flagged
value is genuinely unusual, while in skewed data the rule flags the long tail's extreme
values. The rule is a guideline, not a law. An outlier should be investigated — it may
be a recording error, a member of a different group, or simply a rare but real value.
Never delete one just because it is inconvenient.

Another rule, for roughly symmetric data, flags values more than 2 or 3 standard
deviations from the mean. That rule uses the mean and SD, which the outliers themselves
inflate, so the IQR rule is generally preferred.

## Drawing a boxplot

A **boxplot** (box-and-whisker plot) is drawn above a number line:

1. Draw a box from $Q_1$ to $Q_3$ with a line inside at the median.
2. Compute the fences and mark any outliers individually (dots or asterisks).
3. Draw whiskers from the box out to the most extreme values that are *not* outliers.

A boxplot drawn this way is a **modified boxplot**. If you skip step 2 and run whiskers
to the min and max, it's a plain boxplot; most software and calculators draw the
modified version.

Using the delivery times from the last lesson (9, 11, 12, 13, 14, 15, 16, 18, 22, 30):
five-number summary 9, 12, 14.5, 18, 30; IQR $= 6$; fences $12 - 9 = 3$ and
$18 + 9 = 27$. The value 30 is above 27, so it is an outlier, and the right whisker stops
at 22, the largest non-outlier.

```plot
{"x": [3.8, 36.2], "y": [-0.8, 2.1], "grid": false, "polygons": [{"points": [[12, 0.5], [18, 0.5], [18, 1.5], [12, 1.5]]}], "segments": [{"from": [14.5, 0.5], "to": [14.5, 1.5]}, {"from": [9, 1.0], "to": [12, 1.0]}, {"from": [18, 1.0], "to": [22, 1.0]}, {"from": [9, 0.75], "to": [9, 1.25]}, {"from": [22, 0.75], "to": [22, 1.25]}, {"from": [5, 0], "to": [35, 0]}, {"from": [5, 0], "to": [5, -0.12]}, {"from": [10, 0], "to": [10, -0.12]}, {"from": [15, 0], "to": [15, -0.12]}, {"from": [20, 0], "to": [20, -0.12]}, {"from": [25, 0], "to": [25, -0.12]}, {"from": [30, 0], "to": [30, -0.12]}, {"from": [35, 0], "to": [35, -0.12]}], "labels": [{"at": [5, -0.45], "text": "5"}, {"at": [10, -0.45], "text": "10"}, {"at": [15, -0.45], "text": "15"}, {"at": [20, -0.45], "text": "20"}, {"at": [25, -0.45], "text": "25"}, {"at": [30, -0.45], "text": "30"}, {"at": [35, -0.45], "text": "35"}], "points": [{"at": [30, 1.0], "open": true, "color": "#2c5e8f"}], "caption": "Modified boxplot of delivery times; 30 is an outlier"}
```

## Reading boxplots

- Each section (lower whisker, lower box, upper box, upper whisker) holds about 25% of
  the values — regardless of how long it is. A long section means the values there are
  *spread out*, not that there are more of them.
- A long right whisker and a median near the left of the box suggest right skew.
- Boxplots hide detail: a bimodal distribution and a uniform one can have identical
  boxplots. Use a histogram or dotplot to see shape in detail.

### Comparing groups

Boxplots shine when comparing groups on the same scale. Below are delay times (minutes)
for two rail lines.

```plot
{"x": [-0.64, 16.64], "y": [-0.8, 3.4], "grid": false, "polygons": [{"points": [[3, 0.6], [10, 0.6], [10, 1.4], [3, 1.4]]}, {"points": [[3.5, 2.2], [6.5, 2.2], [6.5, 3.0], [3.5, 3.0]]}], "segments": [{"from": [6, 0.6], "to": [6, 1.4]}, {"from": [1, 1.0], "to": [3, 1.0]}, {"from": [10, 1.0], "to": [15, 1.0]}, {"from": [1, 0.8], "to": [1, 1.2]}, {"from": [15, 0.8], "to": [15, 1.2]}, {"from": [0, 0], "to": [16, 0]}, {"from": [0, 0], "to": [0, -0.12]}, {"from": [2, 0], "to": [2, -0.12]}, {"from": [4, 0], "to": [4, -0.12]}, {"from": [6, 0], "to": [6, -0.12]}, {"from": [8, 0], "to": [8, -0.12]}, {"from": [10, 0], "to": [10, -0.12]}, {"from": [12, 0], "to": [12, -0.12]}, {"from": [14, 0], "to": [14, -0.12]}, {"from": [16, 0], "to": [16, -0.12]}, {"from": [5, 2.2], "to": [5, 3.0]}, {"from": [1.5, 2.6], "to": [3.5, 2.6]}, {"from": [6.5, 2.6], "to": [8.5, 2.6]}, {"from": [1.5, 2.4], "to": [1.5, 2.8]}, {"from": [8.5, 2.4], "to": [8.5, 2.8]}], "labels": [{"at": [0, -0.45], "text": "0"}, {"at": [2, -0.45], "text": "2"}, {"at": [4, -0.45], "text": "4"}, {"at": [6, -0.45], "text": "6"}, {"at": [8, -0.45], "text": "8"}, {"at": [10, -0.45], "text": "10"}, {"at": [12, -0.45], "text": "12"}, {"at": [14, -0.45], "text": "14"}, {"at": [16, -0.45], "text": "16"}, {"at": [-0.2, 2.6], "text": "A"}, {"at": [-0.2, 1.0], "text": "B"}], "caption": "Delay (minutes) on Line A (top) and Line B (bottom)"}
```

Compare center, spread, shape and outliers: Line B's median delay (6) is higher than
Line A's (5); Line B is much more variable (IQR 7 versus 3, range 14 versus 7); Line B is
skewed right (long right whisker), while Line A is roughly symmetric. Line A is the more
reliable line.

### Example 1

Find the five-number summary and check for outliers: 41, 38, 45, 50, 47, 39, 44, 62, 43.

1. Sort: 38, 39, 41, 43, 44, 45, 47, 50, 62. $n = 9$, so the median is the 5th value: 44.
2. Lower half (first four): 38, 39, 41, 43 → $Q_1 = (39 + 41)/2 = 40$.
3. Upper half (last four): 45, 47, 50, 62 → $Q_3 = (47 + 50)/2 = 48.5$.
4. Five-number summary: 38, 40, 44, 48.5, 62.
5. IQR $= 48.5 - 40 = 8.5$; $1.5 \times 8.5 = 12.75$.
6. Fences: $40 - 12.75 = 27.25$ and $48.5 + 12.75 = 61.25$.
7. 62 is above 61.25, so it is an outlier (just barely). Nothing is below 27.25. In a
   modified boxplot, the upper whisker would end at 50.

### Example 2

A boxplot of 200 exam scores shows $Q_1 = 64$, median $= 72$, $Q_3 = 80$, min $= 31$,
max $= 98$. About how many students scored between 64 and 80? Is 31 an outlier?

1. The box holds the middle 50%: about $0.5 \times 200 = 100$ students.
2. IQR $= 16$; lower fence $= 64 - 24 = 40$. Since $31 < 40$, the score 31 is an outlier.

## Common mistakes

- Thinking a longer whisker or box section contains more data. Each quarter holds about
  25% of the values.
- Running the whisker to the fence instead of to the last actual data value inside the
  fence.
- Calling a value an outlier because it "looks far" without checking the fences.
- Using a boxplot to judge the number of peaks (boxplots can't show modes).

## Key points

- Five-number summary: Min, $Q_1$, Median, $Q_3$, Max.
- Outlier fences: $Q_1 - 1.5\,\text{IQR}$ and $Q_3 + 1.5\,\text{IQR}$.
- Modified boxplots plot outliers separately; whiskers end at the most extreme
  non-outliers.
- Boxplots are best for comparing groups: compare medians, IQRs, ranges, skew and outliers.
