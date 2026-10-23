---
id: stat-m9-h-reg-intervals
module: stat-m9
honors: true
title: 'Predicting with a regression line: confidence and prediction intervals'
minutes: 45
topics: [Regression intervals]
drills: [stat-m9-r2-mean-ci, stat-m9-r2-pred-int, stat-m9-r2-corr-t]
refs: [stat-ref-inference]
---
## Two different questions about a prediction

Lesson 39 put a confidence interval around the slope. But regression is usually fitted to
*predict*, and a prediction needs its own margin of error. Suppose rail-wear depth is regressed
on annual tonnage. A planner can ask two quite different questions at a tonnage of 30 million tons:

- *What is the average wear of all segments that carry 30 million tons?* That is the
  **mean response** $\mu_y = \beta_0 + \beta_1 x^*$ at $x^* = 30$, a fixed number on the population line.
- *How much wear will this one particular segment have?* That single value is
  $\mu_y + \varepsilon$: the mean response plus the segment's own random error.

Both are estimated by the same number, $\hat{y} = a + bx^*$. But the second is far less certain,
because no amount of data tells you a single segment's $\varepsilon$. This honors lesson derives the
standard error for each, shows why the intervals curve away from the line, and connects the slope
test to a test about the correlation.

## The standard error of the mean response

Because the line passes through $(\bar{x}, \bar{y})$, the prediction can be written

$$\hat{y} = \bar{y} + b(x^* - \bar{x}).$$

So the prediction has two sources of error: the height of the line ($\bar{y}$) and its tilt ($b$),
amplified by the distance $x^* - \bar{x}$. Under the regression model, $\bar{y}$ and $b$ are
uncorrelated (a standard result, stated here without proof), so their variances add:

$$\text{Var}(\hat{y}) = \frac{\sigma^2}{n} + (x^* - \bar{x})^2\frac{\sigma^2}{\sum (x_i - \bar{x})^2}.$$

Replacing $\sigma$ by $s$ and $\sum (x_i - \bar{x})^2$ by $(n - 1)s_x^2$ gives

$$SE_{\hat{\mu}} = s\sqrt{\frac{1}{n} + \frac{(x^* - \bar{x})^2}{(n - 1)s_x^2}} = \sqrt{\frac{s^2}{n} + (x^* - \bar{x})^2\, SE_b^2}.$$

The second form is handy with computer output, since $SE_b = s/(s_x\sqrt{n - 1})$. A confidence
interval for the mean response is

$$\hat{y} \pm t^*\, SE_{\hat{\mu}}, \qquad \text{df} = n - 2.$$

The interval is narrowest at $x^* = \bar{x}$, where only the height of the line is uncertain, and
widens as $x^*$ moves away, because an error in the slope matters more the farther you go.

## The prediction interval for one new value

A new observation is $y_{\text{new}} = \mu_y + \varepsilon_{\text{new}}$, and its error is independent
of the data used to fit the line. The prediction error $y_{\text{new}} - \hat{y}$ therefore has
variance $\sigma^2 + \text{Var}(\hat{y})$, and

$$SE_{\text{pred}} = s\sqrt{1 + \frac{1}{n} + \frac{(x^* - \bar{x})^2}{(n - 1)s_x^2}} = \sqrt{s^2 + SE_{\hat{\mu}}^2}.$$

A **prediction interval** for a single new response is $\hat{y} \pm t^*\, SE_{\text{pred}}$ with
df $= n - 2$. The extra "1" under the root is the new value's own scatter, and it never goes
away: as $n$ grows, $SE_{\hat{\mu}} \to 0$ but $SE_{\text{pred}} \to \sigma$, so a 95% prediction
interval can never be narrower than about $\hat{y} \pm 1.96\sigma$.

Drawing both intervals at every $x$ gives a **confidence band** for the line and a wider
**prediction band** for individual values. Both curve outward (they are hyperbolas), pinched
closest to the line at $\bar{x}$.

### Example 1: wear at 30 million tons

A random sample of $n = 12$ segments carrying between 9 and 31 million tons per year gives
$\hat{y} = 1.5 + 0.30x$ (wear in mm, $x$ in millions of tons), with $\bar{x} = 20$, $s_x = 6$ and
residual SD $s = 0.9$. Assume the LINER conditions hold. Find 95% intervals at $x^* = 30$.

1. *Prediction*: $\hat{y} = 1.5 + 0.30(30) = 10.5$ mm.
2. *Ingredients*: $(n - 1)s_x^2 = 11(36) = 396$ and $(x^* - \bar{x})^2 = 100$; df $= 10$, so
   $t^* = 2.228$.
3. *Mean response*: $SE_{\hat{\mu}} = 0.9\sqrt{1/12 + 100/396} = 0.9\sqrt{0.3359} = 0.522$.
   Interval: $10.5 \pm 2.228(0.522) = 10.5 \pm 1.16$, from 9.34 to 11.66 mm.
4. *One segment*: $SE_{\text{pred}} = \sqrt{0.9^2 + 0.522^2} = \sqrt{1.0821} = 1.040$.
   Interval: $10.5 \pm 2.228(1.040) = 10.5 \pm 2.32$, from 8.18 to 12.82 mm.
5. *Interpret*: we are 95% confident that the *mean* wear of all such segments carrying 30 million
   tons is between 9.34 and 11.66 mm, and 95% confident that *one* new segment carrying 30 million
   tons will have wear between 8.18 and 12.82 mm (95% of intervals made this way capture the new
   value).

At $x^* = \bar{x} = 20$ the same steps give $7.5 \pm 0.58$ (mean) and $7.5 \pm 2.09$ (one segment):
the mean-response interval is half as wide as at 30, but the prediction interval shrinks only a
little, because most of its width is the new segment's own scatter.

```plot
{"x": [5, 40], "y": [0, 18], "xLabel": "tonnage (millions of tons)", "yLabel": "wear (mm)", "functions": [{"f": "1.5 + 0.3*x"}, {"f": "1.5 + 0.3*x + 2.228*0.9*sqrt(1/12 + (x - 20)^2/396)", "color": "#2c5e8f"}, {"f": "1.5 + 0.3*x - 2.228*0.9*sqrt(1/12 + (x - 20)^2/396)", "color": "#2c5e8f"}, {"f": "1.5 + 0.3*x + 2.228*0.9*sqrt(1 + 1/12 + (x - 20)^2/396)", "dashed": true, "color": "#b5541a"}, {"f": "1.5 + 0.3*x - 2.228*0.9*sqrt(1 + 1/12 + (x - 20)^2/396)", "dashed": true, "color": "#b5541a"}], "segments": [{"from": [31, 0], "to": [31, 18], "dashed": true}], "labels": [{"at": [13, 13.5], "text": "middle line: ŷ = 1.5 + 0.30x"}, {"at": [35.7, 4], "text": "extrapolation"}], "caption": "95% confidence band (solid, inner) and prediction band (dashed, outer) for Example 1; both are narrowest at x̄ = 20 and widen with distance, and past the last data value (31) they rest on extrapolation"}
```

### Example 2: five points, wide intervals

For lesson 39's training data ($\hat{y} = 2.6 + 0.8x$, $n = 5$, $\bar{x} = 3$, $s_x^2 = 2.5$,
$s = 1.095$), find 95% intervals at $x^* = 3$ weeks.

1. $\hat{y} = 2.6 + 0.8(3) = 5.0$; df $= 3$, $t^* = 3.182$.
2. Mean response: $SE_{\hat{\mu}} = 1.095\sqrt{1/5 + 0} = 0.490$; interval $5.0 \pm 1.56$, from 3.44 to 6.56.
3. One new trainee: $SE_{\text{pred}} = 1.095\sqrt{1 + 1/5} = 1.200$; interval $5.0 \pm 3.82$, from 1.18
   to 8.82.

With only 3 df, $t^*$ is large and the prediction interval covers most of the score scale: five
points can suggest a trend but can't forecast one person's score usefully.

## Conditions matter more for prediction

The intervals rest on the same LINER conditions as lesson 39, but two of them bite harder:

- *Normal*: an interval for a mean or slope is protected by the Central Limit Theorem when $n$ is
  large; a prediction interval is not, because it describes one value of $\varepsilon$. If the
  residuals are skewed, a prediction interval can be badly off no matter how large $n$ is.
- *Equal SD*: the prediction interval uses one $s$ for every $x$. With a fan-shaped residual plot it
  is too wide where the scatter is small and too narrow where it is large.

And neither interval protects you against **extrapolation**. The formulas do widen outside the data,
but they assume the line is still straight there, which the data can't check.

## Testing the correlation

Lesson 39 noted that testing $\beta_1 = 0$ is the same as testing that the population correlation
$\rho$ (rho) is 0. Here is why. Use $b = r s_y/s_x$ and, since SSE $= (1 - r^2)\,$SST,
$s^2 = (1 - r^2)(n - 1)s_y^2/(n - 2)$. Substituting into $t = b/SE_b$, the $s_x$ and $s_y$ cancel:

$$t = \frac{r\sqrt{n - 2}}{\sqrt{1 - r^2}}, \qquad \text{df} = n - 2.$$

So the test needs only $r$ and $n$. It shows the same lesson as Example 2 of lesson 39: a given
$r$ means more with a bigger sample.

### Example 3

1. *Lesson 39's training data*: $r = 0.8$, $n = 5$: $t = 0.8\sqrt{3}/\sqrt{0.36} = 1.386/0.6 = 2.31$,
   matching $b/SE_b$ from lesson 39; two-sided $p = 0.10$.
2. *A weak correlation in a bigger sample*: $r = 0.3$, $n = 50$: $t = 0.3\sqrt{48}/\sqrt{0.91} = 2.18$,
   df $= 48$, two-sided $p = 0.034$. A correlation that explains only $r^2 = 9\%$ of the variation is
   statistically significant here, while the much stronger $r = 0.8$ above was not.

## Common mistakes

- Using the confidence interval for the mean response to describe a single individual: it is
  far too narrow for that.
- Forgetting the "1 +" in the prediction standard error, or adding $s$ and $SE_{\hat{\mu}}$ instead of
  their squares.
- Using $n$ instead of $n - 1$ with $s_x^2$ (or using df $= n - 1$ instead of $n - 2$).
- Expecting a prediction interval to shrink toward zero width with more data.
- Trusting either interval far outside the range of the $x$ data.

## Key points

- Mean response at $x^*$: $\hat{y} \pm t^* SE_{\hat{\mu}}$, $SE_{\hat{\mu}} = s\sqrt{1/n + (x^* - \bar{x})^2/((n - 1)s_x^2)}$.
- One new value: $\hat{y} \pm t^* SE_{\text{pred}}$, $SE_{\text{pred}} = \sqrt{s^2 + SE_{\hat{\mu}}^2}$; df $= n - 2$ for both.
- Both are narrowest at $\bar{x}$ and widen with distance; the prediction interval never gets narrower
  than about $\pm 1.96\sigma$.
- Prediction intervals depend heavily on normal errors and equal SD; neither interval covers
  extrapolation risk.
- $t = r\sqrt{n - 2}/\sqrt{1 - r^2}$ tests $\rho = 0$ and equals the slope's $t$.
