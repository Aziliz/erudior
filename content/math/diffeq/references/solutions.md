---
id: de-ref-solutions
title: Solution forms
---
## Second-order constant coefficients: $ay'' + by' + cy = 0$

| Roots of $ar^2 + br + c = 0$ | General solution |
|---|---|
| real $r_1 \ne r_2$ | $c_1e^{r_1t} + c_2e^{r_2t}$ |
| repeated $r$ | $(c_1 + c_2t)e^{rt}$ |
| complex $\lambda \pm i\mu$ | $e^{\lambda t}(c_1\cos\mu t + c_2\sin\mu t)$ |

Amplitude–phase: $c_1\cos\mu t + c_2\sin\mu t = R\cos(\mu t - \delta)$, $R = \sqrt{c_1^2 + c_2^2}$.

## Cauchy–Euler: $at^2y'' + bty' + cy = 0$, $t > 0$

| Roots of $am(m-1) + bm + c = 0$ | General solution |
|---|---|
| real $m_1 \ne m_2$ | $c_1t^{m_1} + c_2t^{m_2}$ |
| repeated $m$ | $t^m(c_1 + c_2\ln t)$ |
| complex $\alpha \pm i\beta$ | $t^\alpha\big(c_1\cos(\beta\ln t) + c_2\sin(\beta\ln t)\big)$ |

## Particular solutions (undetermined coefficients)

| $g(t)$ | Trial $Y(t)$ (multiply by $t^s$ if it overlaps $y_c$) |
|---|---|
| $P_n(t)$ | $A_nt^n + \cdots + A_0$ |
| $Ce^{\alpha t}$ | $Ae^{\alpha t}$ |
| $C\cos\beta t$, $C\sin\beta t$ | $A\cos\beta t + B\sin\beta t$ |
| $P_n(t)e^{\alpha t}$ | $(A_nt^n + \cdots + A_0)e^{\alpha t}$ |
| $e^{\alpha t}\cos\beta t$, $e^{\alpha t}\sin\beta t$ | $e^{\alpha t}(A\cos\beta t + B\sin\beta t)$ |

Variation of parameters: $Y = -y_1\int\frac{y_2g}{W}dt + y_2\int\frac{y_1g}{W}dt$, $W = y_1y_2' - y_1'y_2$.

## Vibrations: $mu'' + \gamma u' + ku = F_0\cos\omega t$

| Quantity | Formula |
|---|---|
| Natural frequency | $\omega_0 = \sqrt{k/m}$ |
| Critical damping | $\gamma_c = 2\sqrt{km}$ |
| Quasi-frequency | $\mu = \sqrt{4km - \gamma^2}/(2m)$ |
| Steady-state amplitude | $F_0/\sqrt{(k - m\omega^2)^2 + \gamma^2\omega^2}$ |
| Practical-resonance peak ($\gamma^2 < 2mk$) | $\omega_{\max}^2 = \omega_0^2 - \gamma^2/(2m^2)$ |
| Resonance ($\gamma = 0$, $\omega = \omega_0$) | $\frac{F_0}{2m\omega_0}t\sin\omega_0t$ |
| RLC analogy | $m \to L$, $\gamma \to R$, $k \to 1/C$ |

## Sinusoidal response with complex exponentials: $p(D)x = F_0\cos\omega t$

| Quantity | Formula |
|---|---|
| Exponential response | $z_p = F_0e^{i\omega t}/p(i\omega)$, $x_p = \operatorname{Re}z_p$ ($\operatorname{Im}$ for $\sin$) |
| Resonant case $p(i\omega) = 0$ | $z_p = F_0te^{i\omega t}/p'(i\omega)$ |
| Gain, phase lag | $g = 1/\lvert p(i\omega)\rvert$, $\phi = \arg p(i\omega)$; $x_p = gF_0\cos(\omega t - \phi)$ |
| Spring | $\tan\phi = \gamma\omega/(k - m\omega^2)$, $0 < \phi < \pi$ |

## Linear systems $\mathbf{x}' = A\mathbf{x}$ ($2 \times 2$)

Eigenvalues from $\lambda^2 - T\lambda + D = 0$, $T = \operatorname{tr}A$, $D = \det A$.

| Eigenvalues | Solution | Origin |
|---|---|---|
| real, opposite signs ($D < 0$) | $c_1e^{\lambda_1t}\mathbf{v}_1 + c_2e^{\lambda_2t}\mathbf{v}_2$ | saddle (unstable) |
| real, both negative | same | nodal sink |
| real, both positive | same | nodal source |
| $\alpha \pm i\beta$, $\mathbf{v} = \mathbf{a} + i\mathbf{b}$ | $e^{\alpha t}\big[c_1(\mathbf{a}\cos\beta t - \mathbf{b}\sin\beta t) + c_2(\mathbf{a}\sin\beta t + \mathbf{b}\cos\beta t)\big]$ | spiral sink ($\alpha < 0$), source ($\alpha > 0$), center ($\alpha = 0$) |
| repeated $\lambda$, one eigenvector | $c_1e^{\lambda t}\mathbf{v} + c_2e^{\lambda t}(t\mathbf{v} + \mathbf{w})$, $(A - \lambda I)\mathbf{w} = \mathbf{v}$ | improper node |

Forced systems $\mathbf{x}' = A\mathbf{x} + \mathbf{g}$: $\mathbf{x} = \Psi(t)\mathbf{c} + \mathbf{x}_p$. Constant $\mathbf{g} = \mathbf{b}$: $\mathbf{x}_p = -A^{-1}\mathbf{b}$. $\mathbf{g} = e^{rt}\mathbf{b}$ ($r$ not an eigenvalue): $\mathbf{x}_p = e^{rt}\mathbf{a}$, $(rI - A)\mathbf{a} = \mathbf{b}$. Variation of parameters: $\mathbf{x}_p = \Psi\int\Psi^{-1}\mathbf{g}\,dt$. Matrix exponential: $e^{At} = \Psi(t)\Psi(0)^{-1}$, $\mathbf{x} = e^{At}\mathbf{x}_0 + \int_0^te^{A(t - s)}\mathbf{g}(s)\,ds$.

Asymptotically stable exactly when $T < 0$ and $D > 0$. Nonlinear: use $J = \begin{bmatrix} F_x & F_y \\ G_x & G_y \end{bmatrix}$ at each equilibrium.

## Series, Fourier and PDEs

| Topic | Formula |
|---|---|
| Series near ordinary point | $y = \sum a_nx^n$, $a_0 = y(0)$, $a_1 = y'(0)$, recurrence from matching powers |
| Fourier coefficients (period $2L$) | $a_n = \frac1L\int_{-L}^Lf\cos\frac{n\pi x}{L}$, $b_n = \frac1L\int_{-L}^Lf\sin\frac{n\pi x}{L}$ |
| Half-range sine series | $b_n = \frac2L\int_0^Lf\sin\frac{n\pi x}{L}\,dx$ |
| Heat $u_t = \alpha^2u_{xx}$, zero ends | $u = \sum b_ne^{-\alpha^2(n\pi/L)^2t}\sin\frac{n\pi x}{L}$ |
| Heat, insulated ends ($u_x = 0$) | $u = \frac{a_0}{2} + \sum a_ne^{-\alpha^2(n\pi/L)^2t}\cos\frac{n\pi x}{L}$; $u \to$ average of $u(x, 0)$ |
| Heat, ends at $T_1$, $T_2$ | $u = T_1 + (T_2 - T_1)\frac xL + w$, $w$ = zero-end solution from $u(x, 0) - v(x)$ |
| Heat, $u(0) = 0$, insulated at $L$ | eigenfunctions $\sin\frac{(2n - 1)\pi x}{2L}$ |
| Wave $u_{tt} = a^2u_{xx}$, fixed ends | $u = \sum\big(b_n\cos\frac{n\pi at}{L} + c_n\sin\frac{n\pi at}{L}\big)\sin\frac{n\pi x}{L}$ |
