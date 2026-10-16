---
id: de-ref-models
title: Models and numerical methods
---
## First-order models

| Model | Equation | Solution / key facts |
|---|---|---|
| Exponential growth/decay | $P' = kP$ | $P = P_0e^{kt}$; doubling/half-life $\ln 2/\lvert k\rvert$ |
| Logistic | $P' = kP(1 - P/K)$ | $P = \dfrac{K}{1 + Ae^{-kt}}$, $A = \dfrac{K - P_0}{P_0}$; fastest at $K/2$, rate $kK/4$ |
| Harvested logistic | $P' = rP(1 - P/K) - h$ | equilibria exist iff $h \le rK/4$ |
| Threshold model | $P' = -rP(1 - P/T)(1 - P/K)$ | $0$ and $K$ stable, $T$ unstable |
| Continuous interest | $A' = rA + d$ | $A = (A_0 + d/r)e^{rt} - d/r$ |
| Newton's cooling | $T' = -k(T - T_a)$ | $T = T_a + (T_0 - T_a)e^{-kt}$ |
| Mixing tank | $Q' = r_{in}c_{in} - r_{out}\dfrac{Q}{V}$ | $V = V_0 + (r_{in} - r_{out})t$; constant $V$: $Q \to c_{in}V$ |
| Linear drag (down +) | $mv' = mg - \gamma v$ | $v_T = mg/\gamma$, $v = v_T + (v_0 - v_T)e^{-\gamma t/m}$ |
| Quadratic drag | $mv' = mg - kv^2$ | $v_T = \sqrt{mg/k}$ |
| RL circuit | $LI' + RI = E$ | $I = \frac ER(1 - e^{-Rt/L})$, time constant $L/R$ |
| RC circuit | $Rq' + q/C = E$ | $q = CE(1 - e^{-t/(RC)})$, time constant $RC$ |

Constants: $g = 9.8$ m/s² (SI) or $32$ ft/s² (US); mass = weight / $g$.

## Second-order and systems models

| Model | Equation |
|---|---|
| Spring–mass | $mu'' + \gamma u' + ku = F(t)$, $k = mg/L$ |
| RLC circuit | $Lq'' + Rq' + q/C = E(t)$ |
| Pendulum | $\theta'' + \frac gL\sin\theta = 0$ (small angles: $\theta'' + \frac gL\theta = 0$) |
| Predator–prey | $x' = ax - \alpha xy$, $y' = -cy + \gamma xy$; center at $(c/\gamma, a/\alpha)$ |
| Competing species | $x' = x(\epsilon_1 - \sigma_1x - \alpha_1y)$, $y' = y(\epsilon_2 - \sigma_2y - \alpha_2x)$ |

## Autonomous equations $y' = f(y)$

| Test | Conclusion |
|---|---|
| $f(y^*) = 0$ | $y^*$ is an equilibrium |
| $f'(y^*) < 0$ | asymptotically stable |
| $f'(y^*) > 0$ | unstable |
| $f'(y^*) = 0$ | check signs of $f$ on each side |
| $f = 0$ and $f_y = 0$ (with parameter) | candidate bifurcation |

## Numerical methods for $y' = f(t, y)$, step $h$

| Method | Formula | Global error |
|---|---|---|
| Euler | $y_{n+1} = y_n + hf(t_n, y_n)$ | $\propto h$ |
| Improved Euler (Heun) | $k_1 = f(t_n, y_n)$, $k_2 = f(t_n + h, y_n + hk_1)$, $y_{n+1} = y_n + \frac h2(k_1 + k_2)$ | $\propto h^2$ |
| RK4 | $k_1 = f(t_n, y_n)$, $k_2 = f(t_n + \frac h2, y_n + \frac h2k_1)$, $k_3 = f(t_n + \frac h2, y_n + \frac h2k_2)$, $k_4 = f(t_n + h, y_n + hk_3)$; $y_{n+1} = y_n + \frac h6(k_1 + 2k_2 + 2k_3 + k_4)$ | $\propto h^4$ |

Euler underestimates where solutions are concave up and overestimates where concave down.
