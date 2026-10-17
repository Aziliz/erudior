---
id: ps-ref-probability
title: Probability rules and distributions
---
## Probability rules

| Rule | Formula |
|---|---|
| Complement | $P(A^c) = 1 - P(A)$ |
| Addition | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| Inclusion–exclusion (3 events) | $\sum P(A_i) - \sum_{i<j} P(A_i \cap A_j) + P(A_1 \cap A_2 \cap A_3)$ |
| Union bound | $P(\bigcup A_i) \le \sum P(A_i)$ |
| Bonferroni | $P(A \cap B) \ge P(A) + P(B) - 1$ |
| De Morgan | $(A \cup B)^c = A^c \cap B^c$, $(A \cap B)^c = A^c \cup B^c$ |
| Conditional probability | $P(A \mid B) = P(A \cap B)/P(B)$ |
| Multiplication / chain rule | $P(A \cap B \cap C) = P(A)P(B \mid A)P(C \mid A \cap B)$ |
| Total probability | $P(A) = \sum_i P(B_i)P(A \mid B_i)$ for a partition $B_1, \ldots, B_k$ |
| Bayes | $P(B_j \mid A) = \dfrac{P(B_j)P(A \mid B_j)}{\sum_i P(B_i)P(A \mid B_i)}$ |
| Odds form of Bayes | posterior odds = prior odds × $\dfrac{P(A \mid B)}{P(A \mid B^c)}$ |
| Independence | $P(A \cap B) = P(A)P(B)$ |
| At least one success in $n$ trials | $1 - (1 - p)^n$ |
| Series / parallel reliability | $\prod p_i$ / $1 - \prod (1 - p_i)$ |

## Counting

| Selection of $r$ from $n$ | Count |
|---|---|
| Ordered, no repeats | $\dfrac{n!}{(n-r)!}$ |
| Ordered, repeats allowed | $n^r$ |
| Unordered, no repeats | $\dbinom{n}{r} = \dfrac{n!}{r!\,(n-r)!}$ |
| Split $n$ into labeled groups $n_1, \ldots, n_k$ | $\dfrac{n!}{n_1!\cdots n_k!}$ |
| Birthday: no match among $n$ | $\prod_{i=0}^{n-1}(1 - i/365)$ |
| Matching: at least one match | $\sum_{k=1}^{n} (-1)^{k+1}/k! \approx 1 - e^{-1}$ |

## Expectation and variance

| Quantity | Discrete | Continuous |
|---|---|---|
| Total probability | $\sum p(x) = 1$ | $\int f(x)\,dx = 1$ |
| cdf | $F(x) = \sum_{t \le x} p(t)$ | $F(x) = \int_{-\infty}^x f(t)\,dt$, $F' = f$ |
| Mean | $\sum x\,p(x)$ | $\int x f(x)\,dx$ |
| LOTUS | $E[g(X)] = \sum g(x)p(x)$ | $E[g(X)] = \int g(x) f(x)\,dx$ |
| Tail formula ($X \ge 0$) | $E(X) = \sum_{k \ge 0} P(X > k)$ (integer values) | $E(X) = \int_0^\infty P(X > x)\,dx$ |

- $\operatorname{Var}(X) = E(X^2) - [E(X)]^2$; $E(aX + b) = aE(X) + b$; $\operatorname{Var}(aX + b) = a^2\operatorname{Var}(X)$.
- MGF $M_X(t) = E(e^{tX})$: $E(X^k) = M^{(k)}(0)$; $M_{aX+b}(t) = e^{bt}M_X(at)$; $M_{X+Y} = M_XM_Y$ if independent.
- With $R(t) = \ln M_X(t)$: $\mu = R'(0)$, $\sigma^2 = R''(0)$.

## Discrete distributions ($q = 1 - p$)

| Distribution | pmf | Mean | Variance | MGF |
|---|---|---|---|---|
| Bernoulli$(p)$ | $p^x q^{1-x}$, $x = 0, 1$ | $p$ | $pq$ | $q + pe^t$ |
| Binomial$(n, p)$ | $\binom{n}{k}p^kq^{n-k}$, $k = 0..n$ | $np$ | $npq$ | $(q + pe^t)^n$ |
| Hypergeometric$(N, K, n)$ | $\dfrac{\binom{K}{k}\binom{N-K}{n-k}}{\binom{N}{n}}$ | $n\dfrac{K}{N}$ | $n\dfrac{K}{N}\left(1 - \dfrac{K}{N}\right)\dfrac{N-n}{N-1}$ | — |
| Geometric$(p)$, trials | $q^{k-1}p$, $k \ge 1$ | $\dfrac1p$ | $\dfrac{q}{p^2}$ | $\dfrac{pe^t}{1 - qe^t}$ |
| Negative binomial$(r, p)$ | $\binom{k-1}{r-1}p^rq^{k-r}$, $k \ge r$ | $\dfrac{r}{p}$ | $\dfrac{rq}{p^2}$ | $\left(\dfrac{pe^t}{1 - qe^t}\right)^r$ |
| Poisson$(\lambda)$ | $e^{-\lambda}\dfrac{\lambda^k}{k!}$, $k \ge 0$ | $\lambda$ | $\lambda$ | $e^{\lambda(e^t - 1)}$ |

Geometric tail: $P(X > k) = q^k$. Poisson process with rate $\lambda$: count in time $t$ is Poisson$(\lambda t)$.

## Continuous distributions

| Distribution | pdf | Mean | Variance | MGF |
|---|---|---|---|---|
| Uniform$(a, b)$ | $\dfrac{1}{b - a}$, $a \le x \le b$ | $\dfrac{a + b}{2}$ | $\dfrac{(b - a)^2}{12}$ | $\dfrac{e^{tb} - e^{ta}}{t(b - a)}$ |
| Exponential$(\lambda)$ | $\lambda e^{-\lambda x}$, $x \ge 0$ | $\dfrac1\lambda$ | $\dfrac{1}{\lambda^2}$ | $\dfrac{\lambda}{\lambda - t}$, $t < \lambda$ |
| Normal$(\mu, \sigma^2)$ | $\dfrac{1}{\sigma\sqrt{2\pi}}e^{-(x - \mu)^2/(2\sigma^2)}$ | $\mu$ | $\sigma^2$ | $e^{\mu t + \sigma^2t^2/2}$ |
| Gamma$(\alpha, \theta)$, scale $\theta$ | $\dfrac{x^{\alpha - 1}e^{-x/\theta}}{\Gamma(\alpha)\theta^\alpha}$, $x > 0$ | $\alpha\theta$ | $\alpha\theta^2$ | $(1 - \theta t)^{-\alpha}$, $t < 1/\theta$ |
| Chi-square$(\nu)$ | Gamma$(\nu/2, 2)$ | $\nu$ | $2\nu$ | $(1 - 2t)^{-\nu/2}$ |
| Beta$(a, b)$ | $\dfrac{x^{a-1}(1 - x)^{b-1}}{B(a, b)}$, $0 < x < 1$ | $\dfrac{a}{a + b}$ | $\dfrac{ab}{(a + b)^2(a + b + 1)}$ | — |

- Exponential: $P(X > x) = e^{-\lambda x}$, median $\ln 2/\lambda$, memoryless.
- Normal: $Z = (X - \mu)/\sigma$; $x_p = \mu + \sigma z_p$; $z_{0.90} = 1.2816$, $z_{0.95} = 1.6449$, $z_{0.975} = 1.9600$, $z_{0.99} = 2.3263$.
- Binomial ≈ Normal$(np, npq)$ when $np, nq \ge 10$ (many texts use 5); continuity correction $P(X \le k) \approx \Phi\left(\frac{k + 0.5 - np}{\sqrt{npq}}\right)$.
- Gamma function: $\Gamma(\alpha + 1) = \alpha\Gamma(\alpha)$, $\Gamma(n) = (n-1)!$, $\Gamma(\tfrac12) = \sqrt\pi$; $\int_0^\infty x^{\alpha-1}e^{-x/\theta}dx = \Gamma(\alpha)\theta^\alpha$.
- Beta function: $B(a, b) = \Gamma(a)\Gamma(b)/\Gamma(a + b)$.
- Time of the $k$-th event of a rate-$\lambda$ Poisson process: Gamma$(k, 1/\lambda)$, with $P(T_k > t) = P(\text{Poisson}(\lambda t) \le k - 1)$.

## Functions of a random variable

| Method | Formula |
|---|---|
| Discrete | $p_Y(y) = \sum_{g(x) = y} p_X(x)$ |
| cdf method | $F_Y(y) = P(g(X) \le y)$, then $f_Y = F_Y'$ |
| Monotone $g$ | $f_Y(y) = f_X(g^{-1}(y))\left\lvert \dfrac{d}{dy}g^{-1}(y)\right\rvert$ |
| Linear $Y = aX + b$ | $f_Y(y) = \dfrac{1}{\lvert a \rvert}f_X\left(\dfrac{y - b}{a}\right)$ |
| Two variables, one-to-one | $f_{U,V}(u, v) = f_{X,Y}(x(u,v), y(u,v))\,\lvert J\rvert$, $J = \det\dfrac{\partial(x, y)}{\partial(u, v)}$ |
| Probability integral transform | $F(X) \sim$ Uniform$(0, 1)$; $F^{-1}(U)$ has cdf $F$ |
