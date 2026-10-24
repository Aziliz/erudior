---
id: ps-m6-h-decision-shrinkage
module: ps-m6
honors: true
title: 'Loss, risk and admissibility: decision theory for estimators'
minutes: 45
topics: [Decision theory]
drills: [ps-m6-r2-binomial-risk, ps-m6-r2-linear-shrinkage]
refs: [ps-ref-estimation]
---
## Choosing an estimator as a decision

The point-estimators lesson compared estimators by mean squared error and found that a biased
estimator can beat an unbiased one. The Bayesian lesson produced yet another kind of estimator,
the posterior mean. Which should we use? **Decision theory**, developed largely by Abraham Wald in the
1940s, gives a common language for the question: an estimator is a decision rule, a wrong answer
has a cost, and rules are compared by their average cost. The framework explains why there is
usually no single best estimator, what Bayes estimators and "minimax" estimators each optimize,
and when it pays to shrink an estimate toward a prior guess.

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
{"x": [0, 1], "y": [0, 30], "xLabel": "p", "yLabel": "risk (MSE) × 1000", "functions": [{"f": "1000 x (1 - x)/16"}, {"f": "10", "dashed": true}, {"f": "1000 (x - 0.5)^2", "from": 0.33, "to": 0.67}], "labels": [{"at": [0.5, 17.5], "text": "X/16"}, {"at": [0.14, 11.5], "text": "(X + 2)/20"}, {"at": [0.5, 26.5], "text": "guess 0.5"}], "caption": "Risk curves (× 1000) for n = 16: the MLE X/16 (arch), the constant-risk (X + 2)/20 (dashed) and the constant guess 0.5 (bowl, shown near p = 0.5). They cross, so none is best for every p"}
```

## No estimator is best everywhere

Example 1 is typical. The constant guess $\delta(X) = c$ has risk 0 at $\theta = c$, so an estimator with the
smallest risk at *every* $\theta$ would need zero risk everywhere, which is impossible with random data.
There are two ways out: restrict the class of estimators (the MVUE lesson restricted to unbiased
ones), or collapse each risk curve to a single number. Decision theory offers two such numbers.

A weaker requirement survives without either. An estimator $\delta'$ **dominates** $\delta$ if
$R(\theta, \delta') \le R(\theta, \delta)$ for every $\theta$, with strict inequality for some $\theta$. An estimator that is
dominated is inadmissible: there is no reason ever to use it. One that no estimator dominates is
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

## Shrinking one normal mean toward a prior guess

The Bayesian lesson's normal–normal model shows the whole trade-off in one picture. Let $\bar X \sim N(\theta, v)$
with $v = \sigma^2/n$ known, and consider the linear estimators

$$\delta_c = c\bar X + (1 - c)\mu_0, \qquad 0 \le c \le 1,$$

which pull $\bar X$ a fraction $1 - c$ of the way toward a guess $\mu_0$. The bias is $(1 - c)(\mu_0 - \theta)$ and the
variance $c^2v$, so

$$R(\theta, \delta_c) = c^2v + (1 - c)^2(\theta - \mu_0)^2.$$

Shrinking ($c < 1$) lowers the variance term but adds a bias term that grows with the distance between the
truth and the guess. Comparing with $R(\theta, \bar X) = v$, the shrunken estimator wins exactly when
$(\theta - \mu_0)^2 < \frac{1 + c}{1 - c}\,v$.

Under the prior $\theta \sim N(\mu_0, \tau^2)$, the posterior mean is $\delta_c$ with $c = \tau^2/(\tau^2 + v)$, so it is the Bayes estimator
under squared error. Averaging its risk over the prior, using $E[(\theta - \mu_0)^2] = \tau^2$, gives the Bayes risk
$c^2v + (1 - c)^2\tau^2 = cv$, which is exactly the posterior variance.

### Example 3: the sensor offset again

In the Bayesian lesson's Example 2, nine readings with $\sigma = 6$ give $v = 36/9 = 4$, and the prior is $N(100, 4^2)$.

1. *The Bayes estimator.* $c = 16/(16 + 4) = 0.8$, so $\delta_B = 0.8\bar X + 20$.
2. *Its risk.* $R(\theta, \delta_B) = 0.64 \times 4 + 0.04(\theta - 100)^2 = 2.56 + 0.04(\theta - 100)^2$.
3. *Comparison.* This is below $R(\theta, \bar X) = 4$ when $0.04(\theta - 100)^2 < 1.44$, that is, when $|\theta - 100| < 6$.
4. *Bayes risks.* $\delta_B$: $0.8 \times 4 = 3.2$ (the posterior variance found in that example); $\bar X$: 4.

```plot
{"x": [88, 112], "y": [0, 8], "xLabel": "true θ", "yLabel": "risk (MSE)", "functions": [{"f": "4", "dashed": true}, {"f": "2.56 + 0.04 (x - 100)^2"}], "segments": [{"from": [94, 0], "to": [94, 4], "dashed": true}, {"from": [106, 0], "to": [106, 4], "dashed": true}], "points": [{"at": [94, 4]}, {"at": [106, 4]}], "labels": [{"at": [109.5, 3.4], "text": "X̄: risk 4"}, {"at": [100, 2.1], "text": "0.8X̄ + 20"}, {"at": [95.9, 0.6], "text": "θ = 94"}, {"at": [107.9, 0.6], "text": "θ = 106"}], "caption": "Risk of the sample mean (dashed) and of the Bayes estimator that shrinks toward the prior mean 100: shrinking wins within 6 units of 100 and loses outside"}
```

If the prior guess is good, shrinking pays; if it is far off, the estimator pays a growing bias, and its
worst-case risk is unbounded. $\bar X$, with its constant risk $v$, is in fact minimax for a normal mean: the Bayes
risks $\tau^2v/(\tau^2 + v)$ of ever flatter priors rise toward $v$, so no estimator can have maximum risk below $v$
(this limiting argument is stated here without the details).

*Bayes estimators are admissible.* If the Bayes estimator for a prior is unique (as the posterior mean is under
squared error, when the Bayes risk is finite), nothing can dominate it: a dominating estimator would have
Bayes risk no larger, so it would also be a Bayes estimator, and uniqueness makes it the same estimator. So
$\delta_B$ above is admissible, and so is every estimator $\delta_c$ with $0 < c < 1$, each being Bayes for some normal
prior. Neither $\delta_B$ nor $\bar X$ dominates the other; the choice depends on how much the guess $\mu_0$ is trusted.

With *several* means estimated together, a striking thing happens: shrinking all of them toward a
common point, by an amount chosen from the data, beats the unshrunk estimates in total risk for *every*
value of the means once there are three or more. That is Stein's paradox, the subject of the honors
module's lesson on shrinkage and empirical Bayes.

## Common mistakes

- *Looking for an estimator that is best for every $\theta$.* Risk curves cross; a criterion (unbiasedness,
  Bayes risk, maximum risk) must be chosen first.
- *Matching the wrong summary to the loss.* Squared error gives the posterior mean, absolute error
  the posterior median.
- *Thinking admissible means good.* A constant guess is admissible; inadmissible means definitely
  improvable.
- *Confusing risk with Bayes risk.* Risk is a curve over $\theta$; Bayes risk is one number, the curve averaged
  over a prior.
- *Assuming shrinkage always helps.* Pulling toward $\mu_0$ helps only when the truth is near $\mu_0$; far away,
  the squared bias $(1 - c)^2(\theta - \mu_0)^2$ takes over.

## Key points

- Risk $R(\theta, \delta) = E_\theta[L(\theta, \delta(X))]$; under squared error it is the MSE.
- Dominated estimators are inadmissible; $S^2$ is inadmissible for $\sigma^2$ under squared error.
- Bayes estimator: minimizes average risk; posterior mean (squared error), median (absolute error), mode
  (zero–one). A unique Bayes estimator is admissible.
- Minimax: minimizes the worst-case risk; a constant-risk Bayes rule is minimax. For a binomial,
  $(X + \sqrt n/2)/(n + \sqrt n)$; for a normal mean, $\bar X$.
- Linear shrinkage $c\bar X + (1 - c)\mu_0$: risk $c^2v + (1 - c)^2(\theta - \mu_0)^2$; Bayes for a $N(\mu_0, \tau^2)$ prior when
  $c = \tau^2/(\tau^2 + v)$, with Bayes risk $cv$.
