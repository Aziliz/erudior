---
id: bio-h-statistics
module: bio-h1
title: 'Describing data: variation, error bars, and confidence'
minutes: 45
honors: true
topics: [Descriptive statistics]
drills: [bio-h-sd-se, bio-h-ci95]
refs: [bio-ref-lab]
---
Lesson 41 planned a fair experiment: caffeine versus pond water for water fleas (*Daphnia*), with randomized, blinded heart-rate counts. Now the numbers are in. The core course summarized data with a mean and a range and judged a difference by whether the ranges overlapped. This lesson makes those judgments precise. You will describe the center of a data set and its spread, measure how *precisely* a sample mean pins down the true mean, and read the error bars that appear on nearly every graph in biology. Lesson 43 then turns these ideas into formal tests.

## Center: mean and median

The **mean** ($\bar{x}$, "x-bar") is the sum of the values divided by how many there are. The **median** is the middle value when the data are put in order (with an even number of values, the mean of the two middle ones).

They agree when data are roughly symmetric, and disagree when a few values are far from the rest. Parasite counts are a classic case. A biologist counts ticks on nine wild mice:

$$0,\ 1,\ 1,\ 2,\ 3,\ 3,\ 4,\ 6,\ 38$$

The mean is $58/9 \approx 6.4$ ticks, but eight of the nine mice carry fewer than that. The median, the fifth value, is 3. One heavily infested mouse pulls the mean up and barely moves the median. A value far from the others is an **outlier**. An outlier is not automatically a mistake: in parasites it is normal for a few hosts to carry most of the parasites. Check outliers for recording errors, but never delete one just because it is inconvenient. For skewed data like these, the median is the better summary of a "typical" individual.

## Spread: range and standard deviation

The **range** is the largest value minus the smallest. It is easy, but it depends on only two values, so one outlier can inflate it, and it tends to grow as you collect more data.

The **standard deviation** ($s$ or SD) uses every value. It is roughly the typical distance of a value from the mean:

$$s = \sqrt{\frac{\sum (x - \bar{x})^2}{n - 1}}$$

Read the formula from the inside out: find each value's deviation from the mean, square the deviations (so negatives don't cancel positives), add them, divide by $n - 1$, and take the square root to get back to the original units. Why $n - 1$ and not $n$? The deviations are measured from the sample's own mean, which sits in the middle of the sample, so they run slightly smaller than deviations from the true population mean. Dividing by $n - 1$ corrects for that. (Calculators label this sample SD as $s$ or $s_x$; the population version, $\sigma$, divides by $n$.)

Many measurements in biology (heights, enzyme activities, heart rates) follow a roughly bell-shaped **normal distribution**. For normal data, about 68% of values lie within 1 SD of the mean and about 95% within 2 SD (1.96, to be exact).

```plot
{"x": [-3.5, 3.5], "y": [0, 0.45], "xLabel": "standard deviations from the mean", "yLabel": "relative frequency", "functions": [{"f": "normpdf(x)", "label": "normal curve"}], "shade": [{"f": "normpdf(x)", "from": -1, "to": 1}], "segments": [{"from": [-2, 0], "to": [-2, 0.054], "dashed": true}, {"from": [2, 0], "to": [2, 0.054], "dashed": true}], "labels": [{"at": [0, 0.16], "text": "about 68%"}, {"at": [2.6, 0.1], "text": "±2 SD: about 95%"}], "caption": "In a normal distribution about 68% of values fall within 1 SD of the mean (shaded) and about 95% within 2 SD"}
```

### Example 1: Standard deviation by hand

Five fruit flies (*Drosophila*) from one vial have wing lengths of 2.1, 2.3, 2.0, 2.4 and 2.2 mm. Find the mean and SD.

*Step 1: mean.* $(2.1 + 2.3 + 2.0 + 2.4 + 2.2)/5 = 11.0/5 = 2.2$ mm.

*Step 2: deviations and squares.*

| $x$ (mm) | $x - \bar{x}$ | $(x - \bar{x})^2$ |
|---|---|---|
| 2.1 | −0.1 | 0.01 |
| 2.3 | 0.1 | 0.01 |
| 2.0 | −0.2 | 0.04 |
| 2.4 | 0.2 | 0.04 |
| 2.2 | 0 | 0 |
| | sum = 0 | sum = 0.10 |

The deviations always add to zero, a handy check.

*Step 3: divide by $n - 1 = 4$, then square-root.* $0.10/4 = 0.025$, and $\sqrt{0.025} \approx 0.16$ mm.

So the wings average 2.2 mm with SD 0.16 mm: most wings are within about 0.16 mm of 2.2 mm.

## How precise is the mean? The standard error

The SD describes how much *individuals* vary. A different question is how much the *mean* would change if you repeated the whole study with a new sample. That is measured by the **standard error** of the mean:

$$\text{SE} = \frac{s}{\sqrt{n}}$$

The two behave differently as you collect more data. The SD settles toward the true spread of the population, which doesn't shrink: flies vary however many you measure. The SE keeps shrinking, because averaging many values cancels out more of the chance variation. That is the $1/\sqrt{n}$ rule lesson 41 used to plan sample size.

## Confidence intervals

A **confidence interval** gives a range of plausible values for the true population mean. A 95% confidence interval is about

$$\bar{x} \pm 2\,\text{SE}$$

For normal data with a large sample, the exact multiplier is 1.96. With small samples it is larger, because $s$ itself is uncertain; the multiplier comes from the $t$ distribution (lesson 43): about 2.78 for $n = 5$, 2.36 for $n = 8$, 2.09 for $n = 20$, and about 2 by $n = 30$ to 60. So "±2 SE" is a good rule of thumb for moderate samples and a bit too narrow for very small ones.

What does "95% confidence" mean? If you repeated the study many times and built an interval each time, about 95% of those intervals would contain the true mean. It does *not* mean that 95% of the individual data values fall inside the interval; that would be roughly mean ± 2 SD, a much wider band.

### Example 2: The *Daphnia* experiment

Heart rates (beats per minute) of 8 *Daphnia* per group:

| Group | Heart rates (bpm) |
|---|---|
| Pond water | 212, 198, 225, 207, 219, 203, 230, 210 |
| Caffeine | 238, 251, 229, 260, 244, 236, 255, 247 |

*Step 1: summaries* (computed as in Example 1):

| Group | Mean | Median | Range | SD | SE = SD/√8 |
|---|---|---|---|---|---|
| Pond water | 213.0 | 211.0 | 32 | 10.95 | 3.87 |
| Caffeine | 245.0 | 245.5 | 31 | 10.36 | 3.66 |

*Step 2: approximate 95% CIs.* Pond water: $213.0 \pm 2(3.87) = 205.3$ to $220.7$ bpm. Caffeine: $245.0 \pm 2(3.66) = 237.7$ to $252.3$ bpm.

*Step 3: refine.* With $n = 8$ the multiplier is really 2.36, giving 203.8 to 222.2 and 236.3 to 253.7. The intervals are a little wider but still far apart.

*Step 4: interpret.* The intervals don't overlap, so the true means very likely differ: caffeine raised mean heart rate by 32 bpm, or $32/213 \approx 15\%$. Notice that the SDs are about 11 bpm, the value lesson 41 used to plan the study.

## Reading error bars

An **error bar** is a line drawn above and below a mean on a graph. It can show the SD, the SE, or a 95% CI, and these differ a lot in length, so the first rule is: *read the figure legend to see which one it is.* The figure shows the same *Daphnia* data three ways.

![The Daphnia heart-rate means (213 and 245 beats per minute) drawn three times: with standard deviation bars (longest, about 11), with standard error bars (shortest, about 4) and with 95% confidence interval bars (about 9).](images/h1-error-bars.svg)

- SD bars show how much individuals vary. They describe the data; they are not a test of whether means differ.
- SE bars are short and make differences look impressive. For two independent groups of similar size, if the SE bars *overlap*, the difference is not statistically significant (in lesson 43's sense, $p > 0.05$).
- 95% CI bars that *don't overlap* mean the difference is significant ($p < 0.05$). But CIs can overlap a little and the difference can still be significant, roughly when the overlap is less than about half of one arm (Cumming, Fidler and Vaux, 2007).
- These rules apply to independent groups only. If the same individuals are measured before and after a treatment, the bars on each mean say nothing about the size of each individual's change.

### Example 3: Judge a figure

A paper shows two fertilizers, 12 plants each, with dry masses of $18.2 \pm 1.1$ g and $20.1 \pm 1.0$ g, "mean ± SE." Is the difference convincing?

*Step 1: draw the bars.* 17.1 to 19.3 g and 19.1 to 21.1 g. The SE bars overlap (19.1 to 19.3).

*Step 2: apply the rule.* Overlapping SE bars for independent groups: not significant at the 0.05 level. (Lesson 43 confirms it: $p \approx 0.2$.)

*Step 3: what if the legend said "mean ± 95% CI"?* Then the SEs would be only about half as big, and CIs that overlap this little (0.2 g, far less than half an arm) mean the difference *is* significant ($p \approx 0.01$). Same picture, different conclusion: read the legend.

## Choosing a graph

| Your data | Good choice |
|---|---|
| A measured variable in a few groups | Dot plot of every value with the mean and error bars; a bar graph with error bars if $n$ is large |
| How a variable changes with time, dose or temperature | Line graph (independent variable on the x-axis) |
| Relationship between two measured variables | Scatter plot |
| Shape of one variable's distribution | Histogram or box plot |
| Counts in categories (phenotypes, species) | Bar graph of counts |

Bar graphs of means hide the data: very different data sets can give identical bars. For the small samples common in biology, show the individual points (Weissgerber and colleagues, 2015, made this case to biologists). A **box plot** summarizes a distribution in five numbers. Here are tick counts from a larger sample of 15 mice from the same population: 0, 1, 2, 2, 3, 4, 4, 5, 6, 8, 10, 11, 15, 19, 34.

![A horizontal box plot of ticks per mouse for 15 mice on a scale from 0 to 35. The box runs from 2 to 11 with a line at 5, whiskers reach 0 and 19, and a separate dot sits at 34. Labels point to the median, the lower and upper quartiles, the whisker end and the outlier.](images/h1-boxplot-labeled.svg)

The line in the box is the median, the 8th of the 15 values (5). The box runs from the lower quartile (the median of the 7 values below the median, 2) to the upper quartile (the median of the 7 values above it, 11), so it holds about the middle half of the data. Whiskers reach the most extreme values that aren't outliers. A common rule calls a value an outlier if it lies more than 1.5 box-lengths beyond the box: here the box length is $11 - 2 = 9$, and $11 + 1.5 \times 9 = 24.5$, so 34 is drawn as a separate point and the whisker stops at 19. The long right whisker and the outlier show the skew at a glance; the mean (about 8.3) would hide it.

## Common mistakes

- *Using the mean for strongly skewed data.* Report the median too, or instead.
- *Dividing by $n$ instead of $n - 1$* for a sample SD.
- *Confusing SD and SE.* SD describes individuals and doesn't shrink with more data; SE describes the mean and does.
- *Reading a 95% CI as "95% of the data."* It is a range for the mean, not for individuals.
- *Comparing error bars without knowing what they show,* or using overlapping 95% CIs to declare "no difference."
- *Deleting outliers to make data look cleaner.*

## Key points

- **Mean** = sum/$n$; the **median** resists **outliers** and suits skewed data.
- **Range** = max − min. **Standard deviation** $s = \sqrt{\sum (x - \bar{x})^2/(n - 1)}$; for a **normal distribution** about 68% of values lie within 1 SD and 95% within 2 SD.
- **Standard error** $= s/\sqrt{n}$ measures how precisely the mean is known.
- A 95% **confidence interval** is about $\bar{x} \pm 2\,\text{SE}$ (a little wider for small samples).
- **Error bars** may show SD, SE or CI: check the legend. Overlapping SE bars: not significant. Non-overlapping 95% CIs: significant.
- Show individual data points when $n$ is small; use scatter plots for two measured variables and **box plots** or histograms for distributions.
