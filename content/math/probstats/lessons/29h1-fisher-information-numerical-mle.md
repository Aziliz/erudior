---
id: ps-m6-h-numerical-mle
module: ps-m6
honors: true
title: 'Fisher information at work: numerical MLEs and standard errors'
minutes: 45
topics: [Likelihood computation]
drills: [ps-m6-r2-newton-step, ps-m6-r2-wald-exp, ps-m6-r2-info-matrix-se]
refs: [ps-ref-estimation]
---
## Beyond the closed form

The maximum likelihood lesson solved $\ell'(\theta) = 0$ by algebra and then quoted a large-sample
result: $\hat\theta \approx N(\theta, 1/(nI(\theta)))$. Real models rarely cooperate so well. Most likelihood equations
have no closed-form solution, most models have more than one parameter, and the formula $1/(nI(\theta))$
needs the unknown $\theta$. This lesson fills those gaps. It shows *why* the MLE is approximately normal,
how software actually finds an MLE (Newton's method and Fisher scoring), how to get a standard
error from the curvature of the log-likelihood, and what changes when there are several parameters.
These are the steps behind every "estimate and standard error" line printed by statistical software.

Throughout, $X_1, \dots, X_n$ are iid with density or pmf $f(x; \theta)$, the regularity conditions of the
Cramér–Rao lesson hold (in particular the support does not depend on $\theta$), and
$\ell(\theta) = \sum \ln f(X_i; \theta)$.

## The score and its two facts

The derivative of the log-likelihood is called the **score function**,
$U(\theta) = \ell'(\theta) = \sum_{i=1}^n \frac{\partial}{\partial\theta}\ln f(X_i; \theta)$. The MLE solves $U(\hat\theta) = 0$. At the *true* $\theta$, the score is
a sum of iid terms with two key properties.

1. *Mean zero.* For one observation, $E\big[\tfrac{\partial}{\partial\theta}\ln f(X; \theta)\big] = \int \frac{\partial_\theta f(x; \theta)}{f(x; \theta)}\,f(x; \theta)\,dx = \frac{d}{d\theta}\int f(x; \theta)\,dx = \frac{d}{d\theta}1 = 0.$
   Swapping the derivative and the integral is exactly what the regularity conditions allow.
2. *Variance equal to the information.* Differentiating the identity $\int (\partial_\theta \ln f)\,f\,dx = 0$ once more gives
   $E[(\partial_\theta \ln f)^2] = -E[\partial^2_\theta \ln f]$; both sides are $I(\theta)$, the Fisher information of one observation.

So $E[U(\theta)] = 0$ and $\operatorname{Var}(U(\theta)) = nI(\theta)$, and by the Central Limit Theorem, $U(\theta)/\sqrt n$ is approximately
$N(0, I(\theta))$.

## Why the MLE is approximately normal

Expand the score around the true $\theta$ and evaluate it at $\hat\theta$, where it is zero:

$$0 = U(\hat\theta) \approx U(\theta) + U'(\theta)(\hat\theta - \theta) \quad\Longrightarrow\quad \sqrt n\,(\hat\theta - \theta) \approx \frac{U(\theta)/\sqrt n}{-U'(\theta)/n}.$$

The numerator is approximately $N(0, I(\theta))$ by the CLT. The denominator $-\frac1n\sum \partial^2_\theta \ln f(X_i; \theta)$ is an average,
so by the law of large numbers it is close to its mean, $I(\theta)$. Dividing a nearly $N(0, I)$ variable by the
nearly constant $I$ gives a nearly $N(0, 1/I)$ variable (Slutsky's theorem, from the honors lesson on modes of
convergence, is the tool that makes this step precise):

$$\sqrt n\,(\hat\theta - \theta) \approx N\big(0,\; 1/I(\theta)\big), \qquad\text{that is,}\qquad \hat\theta \approx N\!\left(\theta, \frac{1}{nI(\theta)}\right).$$

This is a sketch, not a proof: a full proof must show that $\hat\theta$ is consistent (so the Taylor
expansion is taken over a shrinking interval) and must control the remainder term. It does show where
each ingredient comes from: the CLT supplies normality, and the curvature of the log-likelihood supplies the variance.

## Observed information

The variance $1/(nI(\theta))$ involves the unknown $\theta$. Two estimates are in common use:

- the **expected information** at the estimate, $nI(\hat\theta)$, and
- the **observed information** $J(\hat\theta) = -\ell''(\hat\theta)$, the curvature of the actual log-likelihood at its peak.

Both give standard errors $1/\sqrt{nI(\hat\theta)}$ or $1/\sqrt{J(\hat\theta)}$ that are correct for large $n$. The observed version
needs no expectation (useful when $I$ is hard to compute), and Efron and Hinkley (1978) argued that it
better reflects the precision of the data set actually observed. A sharply peaked log-likelihood
means the data pin $\theta$ down; a flat one means they do not.

The resulting **Wald interval** is

$$\hat\theta \pm z_{\alpha/2}\,\widehat{\text{SE}}, \qquad \widehat{\text{SE}} = \frac{1}{\sqrt{J(\hat\theta)}}.$$

## Finding the MLE numerically: Newton's method

When $U(\theta) = 0$ has no closed-form solution, apply **Newton's method** to the score. Near a guess $\theta_k$,
replace $U$ by its tangent line, $U(\theta) \approx U(\theta_k) + U'(\theta_k)(\theta - \theta_k)$, and solve for the zero:

$$\theta_{k+1} = \theta_k - \frac{\ell'(\theta_k)}{\ell''(\theta_k)} = \theta_k + \frac{\ell'(\theta_k)}{J(\theta_k)}.$$

Repeat until the steps are negligible. Near the answer the number of correct digits roughly doubles
each step. Far from it, Newton can overshoot, jump outside the parameter space, or even head for a
minimum, since all it looks for is a zero of $\ell'$. **Fisher scoring** replaces the observed curvature
$J(\theta_k)$ by the expected information $nI(\theta_k)$:

$$\theta_{k+1} = \theta_k + \frac{\ell'(\theta_k)}{nI(\theta_k)}.$$

Because $nI(\theta)$ is always positive, every scoring step points uphill (the same sign as $\ell'$), which often makes
scoring steadier early on; near the answer the two methods behave alike.

### Example 1: a fault log with the zero days missing

A maintenance log records the number of signal faults only on days with at least one fault. Ten
logged days show $1, 1, 2, 1, 3, 1, 2, 1, 1, 2$ faults ($n = 10$, $\sum x_i = 15$). Model the daily count as Poisson$(\lambda)$
with zeros never recorded, the **zero-truncated Poisson** distribution:

$$P(X = k) = \frac{e^{-\lambda}\lambda^k}{k!\,(1 - e^{-\lambda})}, \qquad k = 1, 2, \dots$$

1. *Log-likelihood.* $\ell(\lambda) = \big(\sum x_i\big)\ln\lambda - n\lambda - n\ln(1 - e^{-\lambda}) + \text{const}$.
2. *Score and curvature.* $\ell'(\lambda) = \dfrac{\sum x_i}{\lambda} - \dfrac{n}{1 - e^{-\lambda}}$ and $\ell''(\lambda) = -\dfrac{\sum x_i}{\lambda^2} + \dfrac{n e^{-\lambda}}{(1 - e^{-\lambda})^2}$.
   Setting $\ell' = 0$ gives $\bar x = \lambda/(1 - e^{-\lambda})$, which cannot be solved by algebra.
3. *Newton from $\lambda_0 = \bar x = 1.5$* (the answer if we ignored the truncation):

| $k$ | $\lambda_k$ | $\ell'(\lambda_k)$ | $\ell''(\lambda_k)$ |
|---|---|---|---|
| 0 | 1.5 | $-2.872$ | $-2.970$ |
| 1 | 0.5328 | 3.943 | $-18.435$ |
| 2 | 0.7467 | 1.080 | $-9.779$ |
| 3 | 0.8571 | 0.128 | $-7.610$ |
| 4 | 0.8739 | 0.0022 | $-7.349$ |
| 5 | 0.8742 | 0.0000007 | $-7.345$ |

The first step overshoots well below the answer; then the iterates close in, and the last steps
show the rapid convergence. Fisher scoring from the same start goes $1.5 \to 0.912 \to 0.8744 \to 0.87422$, without the
overshoot. So $\hat\lambda \approx 0.874$ faults per day, much less than the naive 1.5: the missing zero days
would have pulled the average down.

```plot
{"x": [0.2, 2], "y": [-8, 22], "xLabel": "λ", "yLabel": "score ℓ′(λ)", "functions": [{"f": "15/x - 10/(1 - e^(-x))"}], "segments": [{"from": [0.2, 0], "to": [2, 0]}, {"from": [1.5, -2.872], "to": [0.5328, 0], "dashed": true}, {"from": [0.5328, 0], "to": [0.5328, 3.943], "dashed": true}, {"from": [0.5328, 3.943], "to": [0.7467, 0], "dashed": true}], "points": [{"at": [1.5, -2.872]}, {"at": [0.8742, 0], "label": "MLE 0.874"}], "labels": [{"at": [1.5, -5.4], "text": "start 1.5"}], "caption": "Newton's method on the score of the truncated Poisson: each dashed tangent line is followed to the axis to get the next guess"}
```

### Example 2: standard error and interval

Continue Example 1.

1. *Observed information.* $J(\hat\lambda) = -\ell''(0.8742) \approx 7.345$, so $\widehat{\text{SE}} = 1/\sqrt{7.345} \approx 0.369$.
2. *Wald interval (95%).* $0.874 \pm 1.96 \times 0.369 = 0.874 \pm 0.723$, that is, $(0.151,\; 1.597)$.
3. *A function of $\lambda$.* The fraction of fault-free days, $e^{-\lambda}$, has MLE $e^{-0.874} \approx 0.417$ by invariance, and by
   the delta method an SE of about $|{-e^{-\hat\lambda}}| \times 0.369 \approx 0.154$.

Here observed and expected information agree at $\hat\lambda$: the expected information replaces $\sum x_i$
in $-\ell''$ by $nE[X] = n\lambda/(1 - e^{-\lambda})$, and the score equation makes these equal at the MLE. In general the
two differ slightly.

With only ten observations, a Wald interval should be read with care. It is symmetric by
construction, while the log-likelihood here is noticeably lopsided. The **likelihood interval**, the set of
$\lambda$ with $2[\ell(\hat\lambda) - \ell(\lambda)] \le 3.84$ (the cutoff comes from Wilks' theorem in the testing module), is
$(0.326,\; 1.773)$: shifted right, and it respects the shape of $\ell$. For large $n$ the two agree.

## Several parameters

With a parameter vector $\boldsymbol\eta = (\eta_1, \dots, \eta_p)$, the score is the gradient of $\ell$, and the information
becomes the $p \times p$ **Fisher information matrix** with entries

$$I_{jk}(\boldsymbol\eta) = -E\left[\frac{\partial^2}{\partial\eta_j\,\partial\eta_k}\ln f(X; \boldsymbol\eta)\right].$$

The large-sample result becomes $\hat{\boldsymbol\eta} \approx N\big(\boldsymbol\eta, (nI(\boldsymbol\eta))^{-1}\big)$, a multivariate normal whose covariance
matrix is the *inverse* of the information matrix. The standard error of $\hat\eta_j$ is the square root of
the $j$th diagonal entry of that inverse. Newton's method becomes
$\boldsymbol\eta_{k+1} = \boldsymbol\eta_k + J(\boldsymbol\eta_k)^{-1}\nabla\ell(\boldsymbol\eta_k)$, where $J = -\nabla^2\ell$ is the matrix of second derivatives with its sign flipped.

For $N(\mu, \sigma^2)$ the matrix is diagonal, $I = \begin{pmatrix} 1/\sigma^2 & 0 \\ 0 & 1/(2\sigma^4)\end{pmatrix}$, so $\hat\mu$ and $\hat\sigma^2$ are
asymptotically uncorrelated and each SE comes from its own entry. When the off-diagonal entries are
not zero, that shortcut fails.

### Example 3: gamma lifetimes

A gamma model with shape $\alpha$ and scale $\theta$ is fitted to $n = 50$ repair times, giving (for illustration)
$\hat\alpha = 2$ and $\hat\theta = 2$ hours. From $\ln f = (\alpha - 1)\ln x - x/\theta - \ln\Gamma(\alpha) - \alpha\ln\theta$:

1. *Second derivatives.* $\partial^2_\alpha \ln f = -\psi_1(\alpha)$, where $\psi_1 = \frac{d^2}{d\alpha^2}\ln\Gamma$ is the trigamma function;
   $\partial_\alpha\partial_\theta \ln f = -1/\theta$; and $\partial^2_\theta \ln f = -2x/\theta^3 + \alpha/\theta^2$, with mean $-\alpha/\theta^2$ since $E[X] = \alpha\theta$.
2. *Information matrix.* $I = \begin{pmatrix}\psi_1(\alpha) & 1/\theta \\ 1/\theta & \alpha/\theta^2\end{pmatrix}$. With $\psi_1(2) = \pi^2/6 - 1 \approx 0.6449$:
   $nI \approx \begin{pmatrix} 32.247 & 25 \\ 25 & 25 \end{pmatrix}$, determinant $\approx 181.17$.
3. *Invert.* $(nI)^{-1} \approx \dfrac{1}{181.17}\begin{pmatrix} 25 & -25 \\ -25 & 32.247\end{pmatrix} = \begin{pmatrix} 0.1380 & -0.1380 \\ -0.1380 & 0.1780\end{pmatrix}$.
4. *Standard errors.* $\operatorname{SE}(\hat\alpha) \approx \sqrt{0.1380} \approx 0.371$ and $\operatorname{SE}(\hat\theta) \approx \sqrt{0.1780} \approx 0.422$; the correlation
   is $-0.1380/(0.371 \times 0.422) \approx -0.88$.

The naive values $1/\sqrt{32.247} \approx 0.176$ and $1/\sqrt{25} = 0.2$ would be right only if the other parameter
were *known*. Not knowing $\theta$ more than doubles the uncertainty about $\alpha$. The strong negative
correlation has a plain meaning: the data fix the mean $\alpha\theta$ well, so a larger shape must be
paired with a smaller scale.

## Common mistakes

- *Taking reciprocals of the diagonal entries.* Standard errors come from the diagonal of the *inverse*
  matrix; $1/I_{jj}$ ignores the other parameters and understates the uncertainty.
- *Forgetting the sign.* Information is $-\ell''$; at a maximum $\ell'' < 0$, so $J > 0$. A negative "variance"
  means you are at a minimum or made a sign error.
- *Trusting Newton blindly.* Check that the iterates stay in the parameter space, that $\ell$ increases,
  and that the end point is a maximum; try several starting values.
- *Using $1/I(\hat\theta)$ without the $n$.* $I$ is per observation; the variance is $1/(nI)$, or $1/J$ with the
  observed information of the whole sample.
- *Reading a Wald interval as exact.* It rests on a large-sample approximation; with small $n$ or a
  lopsided log-likelihood, a likelihood interval is more reliable.

## Key points

- Score $U(\theta) = \ell'(\theta)$: mean 0 and variance $nI(\theta)$ at the true $\theta$.
- Taylor expansion + CLT + LLN: $\hat\theta \approx N(\theta, 1/(nI(\theta)))$.
- Observed information $J(\hat\theta) = -\ell''(\hat\theta)$; SE $= 1/\sqrt{J(\hat\theta)}$; Wald interval $\hat\theta \pm z_{\alpha/2}\,\text{SE}$.
- Newton: $\theta_{k+1} = \theta_k - \ell'(\theta_k)/\ell''(\theta_k)$; Fisher scoring uses $nI(\theta_k)$ in place of $-\ell''$.
- Several parameters: covariance $\approx (nI)^{-1}$; SEs from the diagonal of the inverse.
