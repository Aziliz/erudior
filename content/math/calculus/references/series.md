---
id: calc-ref-series
title: Series tests, Taylor series, parametric and polar
---
## Convergence tests

| Test | Series | Conclusion |
|---|---|---|
| Divergence ($n$th term) | any $\sum a_n$ | $\lim a_n \ne 0$ ⇒ diverges; $a_n \to 0$ ⇒ no conclusion |
| Geometric | $\sum ar^n$ | converges to $\dfrac{\text{first term}}{1 - r}$ iff $\lvert r\rvert < 1$ |
| p-series | $\sum\dfrac{1}{n^p}$ | converges iff $p > 1$ |
| Telescoping | $\sum(b_n - b_{n+1})$ | sum $= b_1 - \lim b_n$ |
| Integral | $a_n = f(n)$, $f$ positive, continuous, decreasing | same as $\int_1^\infty f(x)\,dx$ |
| Direct comparison | $0 \le a_n \le b_n$ | $\sum b_n$ conv ⇒ $\sum a_n$ conv; $\sum a_n$ div ⇒ $\sum b_n$ div |
| Limit comparison | $a_n, b_n > 0$, $\lim\frac{a_n}{b_n} = c \in (0, \infty)$ | both converge or both diverge |
| Alternating series | $\sum(-1)^nb_n$, $b_n > 0$ decreasing, $b_n \to 0$ | converges; $\lvert S - S_N\rvert \le b_{N+1}$ |
| Ratio | $L = \lim\left\lvert\frac{a_{n+1}}{a_n}\right\rvert$ | $L < 1$ abs. conv; $L > 1$ div; $L = 1$ inconclusive |
| Root | $L = \lim\sqrt[n]{\lvert a_n\rvert}$ | same as ratio test |

Absolutely convergent ($\sum\lvert a_n\rvert$ converges) ⇒ convergent. Conditionally convergent: converges, but not absolutely.

Integral test remainder: $\int_{N+1}^\infty f \le R_N \le \int_N^\infty f$.

## Power series

$\sum c_n(x - a)^n$ converges for $\lvert x - a\rvert < R$ (ratio test), diverges for $\lvert x - a\rvert > R$; check endpoints separately. Differentiate and integrate term by term on $\lvert x - a\rvert < R$ (same $R$).

## Taylor series

$$f(x) = \sum_{n=0}^\infty\frac{f^{(n)}(a)}{n!}(x - a)^n \qquad \text{Lagrange: } \lvert R_n(x)\rvert \le \frac{M}{(n + 1)!}\lvert x - a\rvert^{n+1},\ \lvert f^{(n+1)}\rvert \le M$$

| Function | Maclaurin series | Interval |
|---|---|---|
| $\dfrac{1}{1 - x}$ | $\sum x^n = 1 + x + x^2 + \cdots$ | $(-1, 1)$ |
| $e^x$ | $\sum\dfrac{x^n}{n!} = 1 + x + \dfrac{x^2}{2} + \dfrac{x^3}{6} + \cdots$ | all $x$ |
| $\sin x$ | $\sum\dfrac{(-1)^nx^{2n+1}}{(2n + 1)!} = x - \dfrac{x^3}{6} + \dfrac{x^5}{120} - \cdots$ | all $x$ |
| $\cos x$ | $\sum\dfrac{(-1)^nx^{2n}}{(2n)!} = 1 - \dfrac{x^2}{2} + \dfrac{x^4}{24} - \cdots$ | all $x$ |
| $\ln(1 + x)$ | $\sum_{n\ge1}\dfrac{(-1)^{n+1}x^n}{n} = x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \cdots$ | $(-1, 1]$ |
| $\arctan x$ | $\sum\dfrac{(-1)^nx^{2n+1}}{2n + 1} = x - \dfrac{x^3}{3} + \dfrac{x^5}{5} - \cdots$ | $[-1, 1]$ |
| $(1 + x)^k$ | $1 + kx + \dfrac{k(k - 1)}{2!}x^2 + \dfrac{k(k - 1)(k - 2)}{3!}x^3 + \cdots$ | $(-1, 1)$; endpoints depend on $k$ |

## Parametric curves $x = x(t)$, $y = y(t)$

| Quantity | Formula |
|---|---|
| Slope | $\dfrac{dy}{dx} = \dfrac{dy/dt}{dx/dt}$ |
| Second derivative | $\dfrac{d^2y}{dx^2} = \dfrac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{dx/dt}$ |
| Arc length | $L = \int_\alpha^\beta\sqrt{(x')^2 + (y')^2}\,dt$ |
| Speed | $\sqrt{(x')^2 + (y')^2}$ |
| Area under curve | $\int y\,dx = \int_\alpha^\beta y(t)\,x'(t)\,dt$ |

Horizontal tangent: $y' = 0$, $x' \ne 0$. Vertical tangent: $x' = 0$, $y' \ne 0$.

## Polar curves $r = f(\theta)$

| Quantity | Formula |
|---|---|
| Conversion | $x = r\cos\theta$, $y = r\sin\theta$, $r^2 = x^2 + y^2$, $\tan\theta = y/x$ |
| Slope | $\dfrac{dy}{dx} = \dfrac{r'\sin\theta + r\cos\theta}{r'\cos\theta - r\sin\theta}$ |
| Area | $A = \dfrac12\int_\alpha^\beta r^2\,d\theta$ |
| Area between curves | $A = \dfrac12\int_\alpha^\beta\left(r_{\text{out}}^2 - r_{\text{in}}^2\right)d\theta$ |
| Arc length | $L = \int_\alpha^\beta\sqrt{r^2 + (r')^2}\,d\theta$ |
