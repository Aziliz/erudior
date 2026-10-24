---
id: ps-m7-h-wald-score-lrt
module: ps-m7
honors: true
title: 'Wald, score and likelihood ratio tests'
minutes: 45
topics: [Wald, score and likelihood ratio tests]
drills: [ps-m7-r2-trinity-binomial, ps-m7-r2-trinity-poisson]
refs: [ps-ref-testing]
---
## Three ways to ask the same question

In the likelihood ratio lesson, Wilks' theorem gave a large-sample test for almost any model:
compare $-2\ln\Lambda$ with a chi-square distribution. At the end of the Poisson example there was
a second statistic, $(\bar x - \lambda_0)/\sqrt{\lambda_0/n}$, whose square came out close to
$-2\ln\Lambda$ but not equal to it. And in the proportions lesson the one-proportion $z$ test used
$p_0$ in its standard error, while confidence intervals use $\hat p$. These are not loose ends. They
are three different large-sample tests built from the same log-likelihood, often called the
"trinity": the **Wald test**, the **score test** and the likelihood ratio test. This lesson
derives all three, shows why they agree in large samples, and explains why they can disagree in
real ones.

Throughout, $X_1, \dots, X_n$ are independent with density or pmf $f(x; \theta)$, one parameter
$\theta$, log-likelihood $\ell(\theta) = \sum \ln f(X_i; \theta)$ and MLE $\hat\theta$. We test
$H_0: \theta = \theta_0$ against $H_1: \theta \ne \theta_0$.

## The ingredients: score and information

The derivative of the log-likelihood is the **score function**,
$U(\theta) = \ell'(\theta) = \sum_i \partial_\theta \ln f(X_i; \theta)$. It has two facts you met
with the Cramér–Rao bound: at the true $\theta$, each term has mean 0 and variance $I(\theta)$, the
Fisher information. So, by the Central Limit Theorem, under $H_0$

$$U(\theta_0) \approx N\big(0,\; nI(\theta_0)\big).$$

The curvature of the log-likelihood, $J(\theta) = -\ell''(\theta)$, is the **observed information**.
By the law of large numbers $J(\theta)/n \to I(\theta)$, so $J$ and $nI$ are interchangeable in large
samples. A sharply curved log-likelihood means the data pin $\theta$ down tightly.

## The three statistics

Each statistic measures how far $\theta_0$ is from what the data say, in a different direction on
the graph of $\ell$.

| Test | Statistic (one parameter) | What it measures | Fits needed |
|---|---|---|---|
| Wald | $W = (\hat\theta - \theta_0)^2\, nI(\hat\theta)$ | horizontal distance from the MLE to $\theta_0$ | unrestricted MLE only |
| Score | $S = \dfrac{U(\theta_0)^2}{nI(\theta_0)}$ | slope of $\ell$ at $\theta_0$ | null value only |
| Likelihood ratio | $\text{LR} = 2[\ell(\hat\theta) - \ell(\theta_0)]$ | vertical drop from the peak | both |

Under $H_0$ each is approximately $\chi^2_1$, so each rejects at level $\alpha$ when it exceeds
$\chi^2_{\alpha,1}$ (3.84 at 5%). For one-sided alternatives use the signed square roots, which
are approximately $N(0, 1)$. The Wald statistic is sometimes computed with $J(\hat\theta)$ in
place of $nI(\hat\theta)$; for the binomial and Poisson models the two are equal at the MLE.

![A concave log-likelihood curve. The peak is at the MLE. At the null value to its left, a tangent line shows the slope used by the score test; a vertical bracket shows the drop from the peak used by the likelihood ratio test; a horizontal bracket shows the gap between the null value and the MLE used by the Wald test.](images/ps-m7-h-trinity.svg)

If $H_0$ is true, $\hat\theta$ should be near $\theta_0$ (small horizontal gap), the curve should be
nearly flat at $\theta_0$ (small slope), and $\theta_0$ should sit near the top (small drop). The
three tests turn each of these into a number with a known approximate distribution.

## Why they agree in large samples

Expand around the MLE, where $U(\hat\theta) = 0$:

$$U(\theta_0) \approx U(\hat\theta) + (\theta_0 - \hat\theta)\,\ell''(\hat\theta) = (\hat\theta - \theta_0)\,J(\hat\theta),$$

$$\ell(\theta_0) \approx \ell(\hat\theta) - \tfrac12 J(\hat\theta)(\hat\theta - \theta_0)^2.$$

The second line gives $\text{LR} \approx J(\hat\theta)(\hat\theta - \theta_0)^2$. The first gives
$S \approx J(\hat\theta)^2(\hat\theta - \theta_0)^2 / nI(\theta_0)$. Since $J(\hat\theta)$,
$nI(\hat\theta)$ and $nI(\theta_0)$ are all close to one another when $\hat\theta$ is near $\theta_0$,
all three statistics are approximately $nI(\theta_0)(\hat\theta - \theta_0)^2$. Finally,
$\sqrt n(\hat\theta - \theta_0)$ is approximately $N(0, 1/I(\theta_0))$ (asymptotic normality of the
MLE), so this common value is the square of an approximately standard normal variable:
$\chi^2_1$.

When $\ell$ is exactly a parabola the expansions are exact and the three statistics are equal.
That happens for a normal mean with $\sigma$ known: all three equal $n(\bar x - \mu_0)^2/\sigma^2$, the
square of the $z$ statistic. Everywhere else they differ by amounts that shrink as $n$ grows
under $H_0$, but can matter in a finite sample.

### Example 1: a binomial proportion

Use the weld inspections from the proportions lesson: $x = 52$ defects in $n = 400$, $H_0: p = 0.10$.
For the binomial, $\hat p = x/n = 0.13$, $U(p) = \dfrac{x - np}{p(1-p)}$ and $I(p) = \dfrac{1}{p(1-p)}$.

1. *Score.* $S = \dfrac{U(p_0)^2}{nI(p_0)} = \dfrac{(\hat p - p_0)^2}{p_0(1-p_0)/n} = \dfrac{0.03^2}{0.000225} = 4.00$.
   Its signed root is $z = 2.00$, exactly the one-proportion $z$ statistic. The one-proportion $z$
   test is the score test. That is why its standard error uses $p_0$.
2. *Wald.* $W = \dfrac{(\hat p - p_0)^2}{\hat p(1-\hat p)/n} = \dfrac{0.0009}{0.13(0.87)/400} = 3.18$, signed root 1.78.
3. *Likelihood ratio.* $\text{LR} = 2\left[x\ln\dfrac{\hat p}{p_0} + (n - x)\ln\dfrac{1 - \hat p}{1 - p_0}\right] = 2[52\ln 1.3 + 348\ln(0.87/0.9)] = 3.69$, signed root 1.92.

Against the two-sided 5% cutoff 3.84, the score test rejects ($p = 0.046$) while the Wald test
($p = 0.074$) and the likelihood ratio test ($p = 0.055$) do not. For the one-sided alternative
$p > 0.10$ the p-values are 0.023 (score), 0.037 (Wald) and 0.027 (LR), against an exact binomial
0.031. The data are near the boundary, so the choice of test decides the verdict: one more reason to
report p-values and not just "reject."

### Example 2: the Poisson defect counts again

Forty segments, $\bar x = 3.6$, $H_0: \lambda = 3$. Here $\hat\lambda = \bar x$ and $I(\lambda) = 1/\lambda$.

1. *Wald.* $W = \dfrac{(\bar x - \lambda_0)^2}{\bar x/n} = \dfrac{0.36}{0.09} = 4.00$.
2. *Score.* $U(\lambda) = n(\bar x - \lambda)/\lambda$, so $S = \dfrac{(\bar x - \lambda_0)^2}{\lambda_0/n} = \dfrac{0.36}{0.075} = 4.80$.
3. *Likelihood ratio.* From the earlier lesson, $\text{LR} = 4.51$.

All three reject at 5% (p-values 0.046, 0.028, 0.034). The statistic quoted in that lesson,
$(\bar x - \lambda_0)/\sqrt{\lambda_0/n} = 2.19$, uses the null variance, so it is the root of the score
statistic. Notice the order: here $W < \text{LR} < S$, and in Example 1 also $W < \text{LR} < S$, but
that is a feature of these data, not a theorem. No ordering holds in general.

## Where the differences come from

**Which variance.** Wald estimates the spread of $\hat\theta$ at $\hat\theta$; score evaluates it at
$\theta_0$. In Example 1, $\hat p(1-\hat p) = 0.1131$ is larger than $p_0(1-p_0) = 0.09$, so the Wald
standard error is larger and its statistic smaller.

**Parametrization.** The likelihood ratio does not care how you label the parameter: $\ell$ at the
MLE and at the null value are the same numbers whether you write the model in terms of $p$ or of
the log-odds $\psi = \ln\frac{p}{1-p}$. The score test (with expected information) is also unchanged by
a smooth one-to-one relabeling, because the chain rule multiplies $U$ by $d\theta/d\psi$ and $I$ by its
square, and the factors cancel. The Wald test is not invariant: it measures a straight-line
distance in whichever scale you chose.

### Example 3: the same Wald test on the log-odds scale

In Example 1, test $\psi_0 = \ln(0.1/0.9) = -2.19722$. The MLE is $\hat\psi = \ln(0.13/0.87) = -1.90096$,
and its standard error, by the delta method, is $1/\sqrt{n\hat p(1 - \hat p)} = 1/\sqrt{45.24} = 0.14868$. Then

$$W_\psi = \left(\frac{-1.90096 + 2.19722}{0.14868}\right)^2 = (1.9927)^2 = 3.97,$$

against 3.18 on the $p$ scale. Same data, same hypothesis, different Wald statistic. In logistic
regression this lack of invariance can make the Wald statistic *shrink* as an effect grows very
large (the Hauck–Donner effect, described in 1977), which is one reason many statisticians prefer
likelihood ratio tests there.

## Turning tests into confidence intervals

Each test gives a confidence interval by collecting the null values it does not reject, as in the
framework lesson. For a proportion at 95%:

- *Wald:* $\hat p \pm 1.96\sqrt{\hat p(1 - \hat p)/n}$, the textbook interval.
- *Score:* all $p_0$ with $(\hat p - p_0)^2 \le 1.96^2\,p_0(1-p_0)/n$; solving this quadratic in $p_0$ gives
  the Wilson interval from the confidence-interval lesson.
- *Likelihood ratio:* all $p_0$ with $2[\ell(\hat p) - \ell(p_0)] \le 3.84$, found numerically.

For $x = 52$, $n = 400$ these are $(0.0970, 0.1630)$, $(0.1005, 0.1665)$ and $(0.0994, 0.1653)$. Only
the score interval excludes 0.10, matching the tests above. With small counts the Wald interval
fails badly: for $x = 1$, $n = 20$ it is $(-0.046, 0.146)$, which includes impossible negative values,
while the Wilson interval is $(0.009, 0.236)$. A well-known 2001 study by Brown, Cai and DasGupta
showed that the Wald interval's actual coverage can fall far below 95% even for fairly large $n$.

## Choosing among them

A summary that most statisticians would accept (practical advice, not a theorem):

- With plenty of data and a parameter well inside its range, the three agree; use whichever is
  easiest to compute.
- The likelihood ratio test is invariant and usually the most accurate in moderate samples, but it
  needs both fits.
- The score test needs only the fit under $H_0$. That makes it cheap for checking whether to add a
  term to a model you have already fitted, and it is the source of Pearson's $X^2$: for multinomial
  counts, $X^2$ is the score statistic, $G^2$ is the likelihood ratio statistic, and Neyman's
  $\sum (O - E)^2/O$ is the Wald statistic.
- The Wald test needs only the unrestricted fit, which is why software prints Wald $z$ values beside
  every estimate. Be most careful with it near a boundary or with small counts.

The score test is due to C. R. Rao (1948) and is also called the **Lagrange multiplier test** in
econometrics; the Wald test to Abraham Wald (1943); the large-sample likelihood ratio theory to Wilks
(1938).

With several parameters the same ideas hold with vectors and matrices, for example
$W = (\hat{\boldsymbol\theta} - \boldsymbol\theta_0)^{\mathsf T}\, nI(\hat{\boldsymbol\theta})\,(\hat{\boldsymbol\theta} - \boldsymbol\theta_0)$, and the
reference distribution is $\chi^2_r$ with $r$ the number of restrictions.

## Common mistakes

- Calling any $z$ statistic a "Wald test." If the standard error is computed at $\theta_0$, it is a score test.
- Expecting the three tests to give identical p-values. They agree only approximately, and only when $H_0$ is near the truth and $n$ is large.
- Using the Wald interval for a proportion with few successes or failures; it can extend below 0 or above 1.
- Forgetting that the Wald statistic depends on the parametrization: a Wald test on $p$ and on $\ln\frac{p}{1-p}$ can disagree.
- Using $\chi^2_1$ for a one-sided alternative: take the signed square root and use the normal tail.
- Treating "no general ordering" as "Wald is always smallest." It was smallest in both examples here, but not in every model.

## Key points

- Score $U(\theta) = \ell'(\theta)$ has mean 0 and variance $nI(\theta)$ at the true value; observed information is $J = -\ell''$.
- Wald: $(\hat\theta - \theta_0)^2 nI(\hat\theta)$. Score: $U(\theta_0)^2/nI(\theta_0)$. LR: $2[\ell(\hat\theta) - \ell(\theta_0)]$. All approximately $\chi^2_1$ under $H_0$.
- Geometrically: horizontal gap, slope at $\theta_0$, vertical drop. They coincide exactly when $\ell$ is quadratic.
- The one-proportion $z$ test and Pearson's $X^2$ are score tests; the Wilson interval inverts the score test.
- LR and score tests are invariant to reparametrization; the Wald test is not.
