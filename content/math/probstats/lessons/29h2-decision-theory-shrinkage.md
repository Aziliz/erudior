---
id: ps-m6-h-decision-shrinkage
module: ps-m6
honors: true
title: 'Loss, risk and shrinkage: decision theory for estimators'
minutes: 45
topics: [Decision theory]
drills: [ps-m6-r2-binomial-risk, ps-m6-r2-james-stein]
refs: [ps-ref-estimation]
---
## Choosing an estimator as a decision

The point-estimators lesson compared estimators by mean squared error and found that a biased
estimator can beat an unbiased one. The Bayesian lesson produced yet another kind of estimator,
the posterior mean. Which should we use? **Decision theory**, developed by Abraham Wald in the
1940s, gives a common language for the question: an estimator is a decision rule, a wrong answer
has a cost, and rules are compared by their average cost. The framework explains why there is
usually no single best estimator, what Bayes estimators and "minimax" estimators each optimize,
and leads to one of the most surprising results in statistics, Stein's paradox.

## Loss and risk

A **loss function** $L(\theta, a)$ is the cost of reporting the value $a$ when the truth is $\theta$. Common choices:

- *squared error* $L = (\theta - a)^2$, which punishes large errors heavily;
- *absolute error* $L = |\theta - a|$, which treats errors in proportion to their size;
- *zero–one loss*, which costs 1 for any error larger than a tolerance and 0 otherwise.

For an estimator $\delta(X)$, the loss is random because the data are. Its average over repeated samples,
with $\theta$ held fixed, is the **risk function**

$$R(\theta, \delta) = E_\theta\big[L(\theta, \delta(X))\big].$$

Under squared error, risk is exactly the MSE of the earlier lesson. Risk is a *function* of $\theta$, so
comparing two estimators means comparing two curves, and curves can cross.

### Example 1: three estimators of a proportion

From $X \sim$ Binomial$(16, p)$, compare under squared error:

1. $\delta_1 = X/16$, the MLE. It is unbiased, so its risk is its variance: $R_1(p) = p(1-p)/16$.
2. $\delta_2 = (X + 2)/20$. Its variance is $16p(1-p)/400$ and its bias is $\frac{16p + 2}{20} - p = \frac{2 - 4p}{20}$, so
   $$R_2(p) = \frac{16p(1-p) + (2 - 4p)^2}{400} = \frac{16p - 16p^2 + 4 - 16p + 16p^2}{400} = \frac{4}{400} = 0.01.$$
   The $p$ terms cancel: the risk is constant.
3. $\delta_3 = 0.5$, ignoring the data. Its risk is $(p - 0.5)^2$: zero at $p = 0.5$, terrible elsewhere.

$R_1 < R_2$ exactly when $p(1-p) < 0.16$, that is, for $p < 0.2$ or $p > 0.8$. Neither of the first two is better
everywhere, and even the silly $\delta_3$ wins at $p = 0.5$.

```plot
{"x": [0, 1], "y": [0, 0.03], "xLabel": "p", "yLabel": "risk (MSE)", "functions": [{"f": "x (1 - x)/16"}, {"f": "0.01", "dashed": true}, {"f": "(x - 0.5)^2", "from": 0.33, "to": 0.67}], "labels": [{"at": [0.5, 0.0175], "text": "X/16"}, {"at": [0.14, 0.0115], "text": "(X + 2)/20"}, {"at": [0.5, 0.0015], "text": "0.5"}], "caption": "Risk curves for n = 16: the MLE X/16 (arch), the constant-risk (X + 2)/20 (dashed) and the constant guess 0.5 (bowl, shown near p = 0.5). They cross, so none is best for every p"}
```

## No estimator is best everywhere

Example 1 is typical. The constant guess $\delta(X) = c$ has risk 0 at $\theta = c$, so an estimator with the
smallest risk at *every* $\theta$ would need zero risk everywhere, which is impossible with random data.
There are two ways out: restrict the class of estimators (the MVUE lesson restricted to unbiased
ones), or collapse each risk curve to a single number. Decision theory offers two such numbers.

A weaker requirement survives without either. An estimator $\delta'$ **dominates** $\delta$ if
$R(\theta, \delta') \le R(\theta, \delta)$ for every $\theta$, with strict inequality for some $\theta$. An estimator that is
dominated is **inadmissible**: there is no reason ever to use it. One that no estimator dominates is
**admissible**. For normal data, $S^2$ is inadmissible for $\sigma^2$ under squared error, because
$\frac{n-1}{n+1}S^2$ (divide the sum of squares by $n + 1$) has smaller MSE for every $\sigma$, as the point-estimators
lesson showed. Admissibility is a low bar, though: under squared error the constant guess $\delta_3$ is
admissible (nothing else has zero risk at $p = 0.5$), yet nobody would use it.

## Bayes estimators: average the risk

Put a prior $\pi$ on $\theta$ and average the risk curve against it. The result, the **Bayes risk**
$r(\pi, \delta) = \int R(\theta, \delta)\,\pi(\theta)\,d\theta$, is one number, and the estimator minimizing it is the **Bayes estimator**.
It is found one data set at a time: for each $x$, choose $a$ to minimize the posterior expected loss
$E[L(\theta, a) \mid x]$.

- *Squared error → posterior mean.* $E[(\theta - a)^2 \mid x] = \operatorname{Var}(\theta \mid x) + (E[\theta \mid x] - a)^2$, smallest at $a = E[\theta \mid x]$.
- *Absolute error → posterior median.* Moving $a$ up by a small step $h$ adds about $h$ times the
  posterior probability below $a$ and subtracts $h$ times the probability above $a$; the two balance at the median.
- *Zero–one loss with a small tolerance → posterior mode*, the MAP estimate.

For a Beta$(5, 25)$ posterior, the three answers are the mean 0.167, the median 0.159 and the mode 0.143.
With a uniform prior in Example 1, the Bayes estimator under squared error is $(X + 1)/18$, with Bayes risk
$0.00926$; the averages of $R_1$ and $R_2$ over the same prior are $1/96 \approx 0.01042$ and $0.01$, both larger, as they
must be.

## Minimax estimators: guard against the worst case

The other single number is the worst case, $\max_\theta R(\theta, \delta)$. A **minimax estimator** makes this maximum as
small as possible. It suits a cautious analyst who will not commit to a prior.

*Theorem.* A Bayes estimator whose risk is constant is minimax. *Proof:* let $\delta$ be Bayes for $\pi$ with
constant risk $c$. If some $\delta'$ had $\max_\theta R(\theta, \delta') < c$, its Bayes risk would satisfy
$r(\pi, \delta') \le \max_\theta R(\theta, \delta') < c = r(\pi, \delta)$, contradicting the fact that $\delta$ minimizes the Bayes risk.

### Example 2: the minimax estimator of a proportion

The Beta$(a, a)$ prior gives posterior mean $(X + a)/(n + 2a)$. Repeating the algebra of Example 1 in general,
its risk is constant exactly when $a = \sqrt n/2$, so

$$\delta_{\text{mm}} = \frac{X + \sqrt n/2}{n + \sqrt n}, \qquad R = \frac{n}{4(n + \sqrt n)^2} = \frac{1}{4(1 + \sqrt n)^2}$$

is minimax. For $n = 16$, $a = 2$ and this is $\delta_2 = (X + 2)/20$ from Example 1, with risk 0.01, while the MLE's worst
risk is $1/64 \approx 0.0156$ (at $p = 0.5$). For $n = 400$ the minimax risk is $1/(4 \cdot 21^2) \approx 0.000567$ against the MLE's
worst case $0.000625$. As $n$ grows, the minimax estimator gains a little at $p$ near 0.5 and loses heavily near 0
and 1, which is why the minimax property alone rarely decides the matter in practice.

## Stein's paradox and shrinkage

Now estimate several unrelated means at once. Let $X_i \sim N(\theta_i, 1)$ independently for $i = 1, \dots, p$, with total
squared-error loss $\sum(\theta_i - a_i)^2$. The obvious estimator, $\delta_i = X_i$, has risk $p$ for every $\boldsymbol\theta$, and for $p = 1$ or 2 it is
admissible. In 1956 Charles Stein proved that for $p \ge 3$ it is **inadmissible**, and in 1961 he and Willard
James gave an explicit improvement, the **James–Stein estimator**

$$\delta^{\text{JS}}_i = \left(1 - \frac{p - 2}{\lVert \mathbf X\rVert^2}\right)X_i, \qquad \lVert \mathbf X\rVert^2 = \sum_{j=1}^p X_j^2.$$

Its risk is $p - (p - 2)^2\,E\big[1/\lVert \mathbf X\rVert^2\big]$, which is less than $p$ for every $\boldsymbol\theta$ (proof omitted; it uses an
integration-by-parts identity for normal expectations due to Stein). At $\boldsymbol\theta = \mathbf 0$, $\lVert\mathbf X\rVert^2 \sim \chi^2_p$ with
$E[1/\chi^2_p] = 1/(p - 2)$, so the risk is $p - (p - 2) = 2$: with $p = 10$ means, 2 instead of 10.

The paradox is that the means can be completely unrelated (rail wear in Ohio, rainfall in Peru, a
batting average), and still pooling them through $\lVert\mathbf X\rVert^2$ lowers the *total* risk. It does not lower the risk
for each mean separately; individual components can do worse.

```plot
{"x": [0, 8], "y": [0, 5.6], "xLabel": "‖θ‖ (distance of the true means from 0)", "yLabel": "total risk", "functions": [{"f": "5", "dashed": true}], "segments": [{"from": [0.0, 2.0], "to": [0.25, 2.037]}, {"from": [0.25, 2.037], "to": [0.5, 2.145]}, {"from": [0.5, 2.145], "to": [0.75, 2.312]}, {"from": [0.75, 2.312], "to": [1.0, 2.523]}, {"from": [1.0, 2.523], "to": [1.25, 2.76]}, {"from": [1.25, 2.76], "to": [1.5, 3.006]}, {"from": [1.5, 3.006], "to": [1.75, 3.246]}, {"from": [1.75, 3.246], "to": [2.0, 3.47]}, {"from": [2.0, 3.47], "to": [2.25, 3.672]}, {"from": [2.25, 3.672], "to": [2.5, 3.849]}, {"from": [2.5, 3.849], "to": [2.75, 4.002]}, {"from": [2.75, 4.002], "to": [3.0, 4.131]}, {"from": [3.0, 4.131], "to": [3.25, 4.24]}, {"from": [3.25, 4.24], "to": [3.5, 4.332]}, {"from": [3.5, 4.332], "to": [3.75, 4.41]}, {"from": [3.75, 4.41], "to": [4.0, 4.476]}, {"from": [4.0, 4.476], "to": [4.25, 4.531]}, {"from": [4.25, 4.531], "to": [4.5, 4.579]}, {"from": [4.5, 4.579], "to": [4.75, 4.62]}, {"from": [4.75, 4.62], "to": [5.0, 4.655]}, {"from": [5.0, 4.655], "to": [5.25, 4.686]}, {"from": [5.25, 4.686], "to": [5.5, 4.713]}, {"from": [5.5, 4.713], "to": [5.75, 4.736]}, {"from": [5.75, 4.736], "to": [6.0, 4.757]}, {"from": [6.0, 4.757], "to": [6.25, 4.776]}, {"from": [6.25, 4.776], "to": [6.5, 4.792]}, {"from": [6.5, 4.792], "to": [6.75, 4.807]}, {"from": [6.75, 4.807], "to": [7.0, 4.82]}, {"from": [7.0, 4.82], "to": [7.25, 4.832]}, {"from": [7.25, 4.832], "to": [7.5, 4.843]}, {"from": [7.5, 4.843], "to": [7.75, 4.853]}, {"from": [7.75, 4.853], "to": [8.0, 4.862]}]
2.0 2.523 3.47 4.862, "labels": [{"at": [6.6, 5.3], "text": "X itself: risk 5"}, {"at": [1.9, 2.4], "text": "James–Stein"}], "caption": "Total risk for p = 5 means: the James–Stein estimator is below the usual estimator everywhere, by most when the true means are near the shrinkage point 0"}
```

### Example 3: shrinking five readings

Five sensor offsets are measured once each with error SD 1: $\mathbf x = (1.2, -0.4, 2.1, 0.8, -1.5)$.

1. $\lVert\mathbf x\rVert^2 = 1.44 + 0.16 + 4.41 + 0.64 + 2.25 = 8.9$.
2. Shrinkage factor: $1 - 3/8.9 \approx 0.663$.
3. Estimates: $(0.796,\; -0.265,\; 1.392,\; 0.530,\; -0.994)$, each pulled a third of the way toward 0.

```plot
{"x": [-2.5, 2.5], "y": [-0.5, 1.6], "xLabel": "value", "yLabel": "", "segments": [{"from": [1.2, 1], "to": [0.796, 0], "arrow": true}, {"from": [-0.4, 1], "to": [-0.265, 0], "arrow": true}, {"from": [2.1, 1], "to": [1.392, 0], "arrow": true}, {"from": [0.8, 1], "to": [0.53, 0], "arrow": true}, {"from": [-1.5, 1], "to": [-0.994, 0], "arrow": true}], "points": [[1.2, 1], [-0.4, 1], [2.1, 1], [0.8, 1], [-1.5, 1], [0.796, 0], [-0.265, 0], [1.392, 0], [0.53, 0], [-0.994, 0]], "labels": [{"at": [-1.9, 1.35], "text": "readings x"}, {"at": [-1.9, -0.3], "text": "James–Stein"}], "caption": "Each reading is pulled toward 0 by the same factor 0.663"}
```

When $\lVert\mathbf x\rVert^2 < p - 2$ the factor is negative and the estimate flips sign, which is absurd; the
**positive-part** version, which replaces a negative factor by 0, has smaller risk still. Shrinking toward
0 is arbitrary: any fixed point works, and shrinking toward the average $\bar x$ (with $p - 3$ in place of $p - 2$, for
$p \ge 4$) is the version used in practice. Efron and Morris's 1970s studies of baseball batting averages
made this famous: early-season averages shrunk toward the overall mean predicted the rest of the
season better than the players' own averages.

*Why shrinkage works: an empirical Bayes view.* Suppose the $\theta_i$ were themselves drawn from $N(0, \tau^2)$. The
normal–normal model gives the Bayes estimator $\big(1 - \frac{1}{1 + \tau^2}\big)X_i$, but $\tau^2$ is unknown. Marginally
$X_i \sim N(0, 1 + \tau^2)$, so $\lVert\mathbf X\rVert^2/(1 + \tau^2) \sim \chi^2_p$ and $E\big[(p - 2)/\lVert\mathbf X\rVert^2\big] = 1/(1 + \tau^2)$. Replacing the unknown
factor by this unbiased estimate gives exactly James–Stein. The data estimate how much to trust the
prior; this is **empirical Bayes**, an idea credited to Herbert Robbins (1956) and central to modern
large-scale estimation.

## Common mistakes

- *Looking for an estimator that is best for every $\theta$.* Risk curves cross; a criterion (unbiasedness,
  Bayes risk, maximum risk) must be chosen first.
- *Matching the wrong summary to the loss.* Squared error gives the posterior mean, absolute error
  the posterior median.
- *Thinking admissible means good.* A constant guess is admissible; inadmissible means definitely
  improvable.
- *Reading Stein's result as "each mean is better estimated."* James–Stein lowers the *total* risk; it
  needs $p \ge 3$, and some individual means can be estimated worse.
- *Forgetting the scale.* The formula above assumes error variance 1; with variance $\sigma^2$ the factor is
  $1 - (p - 2)\sigma^2/\lVert\mathbf X\rVert^2$.

## Key points

- Risk $R(\theta, \delta) = E_\theta[L(\theta, \delta(X))]$; under squared error it is the MSE.
- Dominated estimators are inadmissible; $S^2$ is inadmissible for $\sigma^2$ under squared error.
- Bayes estimator: minimizes average risk; posterior mean (squared error), median (absolute error), mode (zero–one).
- Minimax: minimizes the worst-case risk; a constant-risk Bayes rule is minimax. For a binomial,
  $(X + \sqrt n/2)/(n + \sqrt n)$.
- For $p \ge 3$ normal means, James–Stein $\big(1 - (p-2)/\lVert\mathbf X\rVert^2\big)\mathbf X$ dominates $\mathbf X$ (risk 2 instead of $p$ at $\boldsymbol\theta = \mathbf 0$).
