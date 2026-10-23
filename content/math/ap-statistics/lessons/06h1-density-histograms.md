---
id: stat-m1-h-density
module: stat-m1
honors: true
title: Density histograms, bin widths and smooth curves
minutes: 45
topics: [Density histograms and smoothing]
drills: [stat-m1-r2-density-height, stat-m1-r2-fd-width, stat-m1-r2-kde-point]
refs: [stat-ref-descriptive]
---
## Beyond the basic histogram

The histograms in the lesson on quantitative displays all used bins of equal width, with bar
height equal to the count. Three questions were left open. What if the bins are *not* equal,
as in many published tables (age groups, income brackets)? How should you choose the bin width,
when a different choice can make the same data look different? And can you replace the
staircase of bars with a smooth curve? This honors lesson answers all three. The common thread
is one idea: in a well-made histogram, *area*, not height, shows how much of the data falls
in a range.

## Unequal bins and the density scale

A rail operator surveys 200 riders and publishes their ages in the groups below. The groups
have different widths: 18 years for the youngest group, only 7 years for 18–<25.

| Age group | 0–<18 | 18–<25 | 25–<35 | 35–<50 | 50–<65 | 65–<85 |
|---|---|---|---|---|---|---|
| Width (years) | 18 | 7 | 10 | 15 | 15 | 20 |
| Count | 20 | 36 | 50 | 54 | 30 | 10 |

If you draw bars with heights equal to these counts, the 35–<50 bar is the tallest. But that bin
is 15 years wide, so it collects more riders partly *because it is wide*. A reader's eye
judges the area of each bar, and a wide bar with a count-scale height has an area that
overstates its share.

```plot
{"x": [0, 85], "y": [0, 60], "xLabel": "age (years)", "yLabel": "count", "bars": [{"x": 9, "height": 20, "width": 18}, {"x": 21.5, "height": 36, "width": 7}, {"x": 30, "height": 50, "width": 10}, {"x": 42.5, "height": 54, "width": 15}, {"x": 57.5, "height": 30, "width": 15}, {"x": 75, "height": 10, "width": 20}], "caption": "Misleading: counts drawn over unequal bins"}
```

The fix is the **density histogram**. Each bar's height is the **density**: the relative
frequency of the bin divided by its width.

$$\text{density} = \frac{\text{relative frequency}}{\text{bin width}} = \frac{\text{count}}{n \times \text{bin width}}$$

Then the *area* of each bar, height times width, equals the bin's relative frequency, and the
areas of all the bars add to exactly 1. The units of density are "proportion per unit of $x$",
here proportion of riders per year of age.

| Age group | 0–<18 | 18–<25 | 25–<35 | 35–<50 | 50–<65 | 65–<85 |
|---|---|---|---|---|---|---|
| Relative frequency | 0.10 | 0.18 | 0.25 | 0.27 | 0.15 | 0.05 |
| Density (per year) | 0.0056 | 0.0257 | 0.0250 | 0.0180 | 0.0100 | 0.0025 |

```plot
{"x": [0, 85], "y": [0, 0.03], "xLabel": "age (years)", "yLabel": "density", "bars": [{"x": 9, "height": 0.005556, "width": 18}, {"x": 21.5, "height": 0.025714, "width": 7}, {"x": 30, "height": 0.025, "width": 10}, {"x": 42.5, "height": 0.018, "width": 15}, {"x": 57.5, "height": 0.01, "width": 15}, {"x": 75, "height": 0.0025, "width": 20}], "caption": "Density histogram: bar area = proportion of riders"}
```

Now the picture tells the truth: riders are most concentrated between 18 and 35, and the
35–<50 group is large mainly because it spans 15 years. When all bins have the same width, a
density histogram has exactly the same shape as the count histogram (every height is divided by
the same number), so nothing is lost by using density everywhere. It is also the scale on
which a histogram can be compared with a density curve, which module 2 introduces.

### Example 1

Using the table above, find the density of the 18–<25 bin and estimate the proportion of riders
aged 30 to 40.

1. Relative frequency: $36/200 = 0.18$. Width: 7 years. Density: $0.18/7 \approx 0.0257$ per
   year. Check: area $= 0.0257 \times 7 = 0.18$.
2. Ages 30 to 40 straddle two bins. Assume, as a histogram does, that riders are spread evenly
   within each bin (this is an approximation). From 30 to 35 lies 5 years of the 25–<35 bin,
   whose density is 0.025: area $= 5 \times 0.025 = 0.125$.
3. From 35 to 40 lies 5 years of the 35–<50 bin, density 0.018: area $= 5 \times 0.018 = 0.09$.
4. Total: about $0.125 + 0.09 = 0.215$, so roughly 21.5% of riders are 30 to 40 years old.

## How many bins?

Even with equal bins, the **bin width** is a choice, and it matters. Very wide bins average
away real features such as a second peak; very narrow bins leave only one or two values in each
bin, and the picture turns into random spikes that would look different in the next sample.
The best width balances these two kinds of error, and it shrinks slowly as $n$ grows: with more
data you can afford finer detail. Statisticians have proposed several rules of thumb.

| Rule | Recommendation | Notes |
|---|---|---|
| **Sturges' rule** (1926) | number of bins $k = 1 + \log_2 n$, rounded up | Designed with bell-shaped data in mind; gives too few bins for large $n$ |
| **Scott's rule** (1979) | width $h = 3.49\, s\, n^{-1/3}$ | Uses the standard deviation; best for roughly normal data |
| **Freedman–Diaconis rule** (1981) | width $h = 2 \cdot \text{IQR} \cdot n^{-1/3}$ | Uses the IQR, so outliers don't inflate it |

These rules are starting points, not laws, and software defaults vary (R's `hist`, for
example, uses Sturges' rule unless told otherwise). Two more choices change the look of a
histogram without changing the data: where the first bin starts (shifting every boundary by
half a bin can merge or split a peak) and which bin receives a value on a boundary. A careful
analyst tries a few widths and starting points and reports features that survive all of them.

### Example 2

A sample of $n = 200$ commute times runs from 2 to 94 minutes, with $s = 14$ minutes and
$\text{IQR} = 18$ minutes. Compare the three rules.

1. Sturges: $\log_2 200 \approx 7.64$, so $k = 1 + 7.64 = 8.64$, rounded up to 9 bins. Over a
   range of $94 - 2 = 92$ minutes, that is a width of about $92/9 \approx 10.2$ minutes.
2. $n^{-1/3} = 200^{-1/3} \approx 0.171$ (since $200^{1/3} \approx 5.85$).
3. Scott: $h = 3.49 \times 14 \times 0.171 \approx 8.35$ minutes.
4. Freedman–Diaconis: $h = 2 \times 18 \times 0.171 \approx 6.16$ minutes, about
   $92/6.16 \approx 15$ bins.
5. In practice you would round to a convenient width, perhaps 10 minutes for a quick look and
   5 or 6 minutes to check for detail such as a second peak. The Freedman–Diaconis width is the
   smaller of the two even for normal data (there $\text{IQR} \approx 1.35\sigma$, so it gives
   about $2.7\,\sigma\, n^{-1/3}$), and the gap grows when a long tail or outliers inflate $s$.

## Smoothing: kernel density estimates

A histogram is a staircase, and its steps depend on where the bin boundaries fall. A **kernel
density estimate** (KDE) removes the boundaries. Instead of dropping each data value into a
bin, put a small smooth bump, called a **kernel**, centered on each value, and add the bumps
up. With $n$ values $x_1, \dots, x_n$,

$$\hat{f}(x) = \frac{1}{n h} \sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right),$$

where $K$ is the kernel and $h > 0$ is the **bandwidth**. The most common kernel is the
standard normal curve $K(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2/2}$, so each bump is a normal curve
centered at a data value with standard deviation $h$. Each bump has area $1/n$, so the total
area under $\hat{f}$ is 1: a KDE is a density curve built from the data. The idea goes back to
Rosenblatt (1956) and Parzen (1962).

![Five red tick marks on an axis at 2, 3, 3.6, 6 and 7. Above each tick is a dashed normal bump, labeled one kernel (area 1/5). A thick solid curve, labeled kernel density estimate (sum of the bumps), is the sum of the bumps: a high peak near 3 and a lower peak near 6.5. An arrow from the center of the bump at 6 out to 6.8 is labeled h = 0.8.](images/stat-m1-kde.svg)

The bandwidth does the job the bin width did. A small $h$ makes narrow bumps and a wiggly curve
that follows every quirk of the sample; a large $h$ makes wide bumps that blur real features
together.

```plot
{"x": [-2, 12], "y": [0, 0.42], "xLabel": "x", "yLabel": "density", "functions": [{"f": "(normpdf(x,2,0.3)+normpdf(x,3,0.3)+normpdf(x,3.6,0.3)+normpdf(x,6,0.3)+normpdf(x,7,0.3))/5", "label": "h = 0.3", "dashed": true}, {"f": "(normpdf(x,2,0.8)+normpdf(x,3,0.8)+normpdf(x,3.6,0.8)+normpdf(x,6,0.8)+normpdf(x,7,0.8))/5", "label": "h = 0.8"}, {"f": "(normpdf(x,2,2)+normpdf(x,3,2)+normpdf(x,3.6,2)+normpdf(x,6,2)+normpdf(x,7,2))/5", "label": "h = 2"}], "caption": "The same five values smoothed with three bandwidths"}
```

With $h = 0.3$ the curve has a spike for nearly every value; with $h = 2$ the two clusters
merge into one hump; $h = 0.8$ shows two groups. A widely used starting point for a normal
kernel is **Silverman's rule of thumb**,
$h = 0.9 \min\!\left(s, \tfrac{\text{IQR}}{1.34}\right) n^{-1/5}$, which works well for data
that are roughly normal and can oversmooth data with two peaks. For Example 2's commute times,
$\text{IQR}/1.34 \approx 13.4 < 14$, so $h \approx 0.9 \times 13.4 \times 200^{-1/5} \approx 4.2$
minutes.

### Example 3

Compute the KDE of the five values 2, 3, 3.6, 6, 7 at $x = 4$, with a normal kernel and
$h = 0.8$.

1. Standardize the distance from 4 to each value: $z_i = (4 - x_i)/0.8$ gives 2.5, 1.25, 0.5,
   −2.5 and −3.75.
2. Evaluate the normal curve $K(z)$ at each: about 0.0175, 0.1826, 0.3521, 0.0175 and 0.0004.
   The values closest to 4 (3.6 and 3) contribute most; 7 contributes almost nothing.
3. Add: $0.0175 + 0.1826 + 0.3521 + 0.0175 + 0.0004 \approx 0.5701$.
4. Divide by $n h = 5 \times 0.8 = 4$: $\hat{f}(4) \approx 0.1425$.

The same steps at $x = 3$ give about 0.221, higher because 3 sits in the middle of the cluster
2, 3, 3.6.

## Where smoothing can mislead

- **Boundaries.** Waiting times, prices and counts can't be negative, but normal bumps
  centered near zero spill below zero, so a plain KDE puts some area on impossible values and
  too little just above the boundary. Software offers corrections; at least be aware of it.
- **Bandwidth chosen to tell a story.** Like bin width, $h$ can be tuned to create or hide a
  second peak. Report the bandwidth, and check that the features you describe survive
  reasonable changes to it.
- **Small samples.** With a dozen values a smooth curve looks more certain than the data
  justify; a dotplot is more honest.

## Common mistakes

- Drawing counts over unequal bins. Use density $=$ relative frequency ÷ width so that area
  shows proportion.
- Reading a density as a proportion. A density of 0.025 per year is not 2.5% of riders; you
  must multiply by a width to get a proportion.
- Treating one bin width as "the" histogram. Try several widths and starting points.
- Forgetting that a KDE's total area is 1 because each of the $n$ bumps has area $1/n$; if your
  bumps each have area 1, you forgot to divide by $n$.
- Choosing the smallest bandwidth "to see more detail." Below a point, the extra detail is
  noise.

## Key points

- In a density histogram, height $=$ relative frequency ÷ bin width, each bar's area is its
  bin's relative frequency, and the total area is 1. Always use it when bins are unequal.
- Bin width trades too much smoothing (features vanish) against too little (noise). Sturges:
  $k = 1 + \log_2 n$ bins; Scott: $h = 3.49\,s\,n^{-1/3}$; Freedman–Diaconis:
  $h = 2\,\text{IQR}\,n^{-1/3}$.
- A kernel density estimate places a bump of area $1/n$ on each value and adds them:
  $\hat{f}(x) = \frac{1}{nh}\sum K\!\left(\frac{x - x_i}{h}\right)$.
- The bandwidth $h$ controls smoothness; report it and check that conclusions survive changes.
