---
id: phys-ref-mechanics
title: Mechanics equations
---
## Vectors

| | |
|---|---|
| Components | $A_x = A\cos\theta$, $A_y = A\sin\theta$ |
| Magnitude, direction | $A = \sqrt{A_x^2 + A_y^2}$, $\tan\theta = A_y/A_x$ |
| Dot product | $\vec A\cdot\vec B = AB\cos\phi = A_xB_x + A_yB_y + A_zB_z$ |
| Cross product | $\lvert\vec A\times\vec B\rvert = AB\sin\phi$ (right-hand rule) |

## Kinematics

| | |
|---|---|
| Definitions | $v = \dfrac{dx}{dt}$, $a = \dfrac{dv}{dt}$; $\Delta x = \int v\,dt$ |
| Constant acceleration | $v = v_0 + at$; $\Delta x = v_0t + \tfrac12at^2$; $v^2 = v_0^2 + 2a\Delta x$; $\Delta x = \tfrac12(v_0 + v)t$ |
| Projectile (level ground) | $R = \dfrac{v_0^2\sin 2\theta}{g}$, $H = \dfrac{v_0^2\sin^2\theta}{2g}$, $T = \dfrac{2v_0\sin\theta}{g}$ |
| Relative velocity | $\vec v_{AC} = \vec v_{AB} + \vec v_{BC}$ |
| Circular motion | $v = \dfrac{2\pi r}{T}$, $a_c = \dfrac{v^2}{r} = \omega^2r$ |

## Forces

| | |
|---|---|
| Newton's second law | $\sum\vec F = m\vec a = \dfrac{d\vec p}{dt}$ |
| Weight | $W = mg$ |
| Friction | $f_k = \mu_kn$, $f_s \le \mu_sn$ |
| Incline | $mg\sin\theta$ along, $mg\cos\theta$ into the slope |
| Spring | $F = -kx$ |
| Centripetal | $\sum F_{\text{in}} = \dfrac{mv^2}{r}$ |
| Atwood machine | $a = \dfrac{m_1 - m_2}{m_1 + m_2}g$ |

## Energy and momentum

| | |
|---|---|
| Work | $W = Fd\cos\theta = \int\vec F\cdot d\vec\ell$ |
| Kinetic energy | $K = \tfrac12mv^2$; $W_{\text{net}} = \Delta K$ |
| Potential energy | $U_g = mgy$, $U_s = \tfrac12kx^2$, $F = -\dfrac{dU}{dx}$ |
| Energy conservation | $K_i + U_i + W_{\text{nc}} = K_f + U_f$ |
| Power | $P = \dfrac{W}{t} = Fv$ |
| Momentum, impulse | $\vec p = m\vec v$; $\vec J = \int\vec F\,dt = \Delta\vec p$ |
| Center of mass | $x_{\text{cm}} = \dfrac{\sum m_ix_i}{M} = \dfrac1M\int x\,dm$ |
| Elastic collision (target at rest) | $v_{1f} = \dfrac{m_1 - m_2}{m_1 + m_2}v_{1i}$, $v_{2f} = \dfrac{2m_1}{m_1 + m_2}v_{1i}$ |
| Perfectly inelastic | $v_f = \dfrac{m_1v_1 + m_2v_2}{m_1 + m_2}$ |

## Rotation

| Linear | Rotational |
|---|---|
| $x$, $v$, $a$ | $\theta$, $\omega$, $\alpha$; $v = r\omega$, $a_t = r\alpha$ |
| $m$ | $I = \sum mr^2 = \int r^2\,dm$; $I = I_{\text{cm}} + Md^2$ |
| $F = ma$ | $\tau = rF\sin\theta = I\alpha$; $\vec\tau = \vec r\times\vec F$ |
| $K = \tfrac12mv^2$ | $K = \tfrac12I\omega^2$ |
| $p = mv$ | $L = I\omega$; $\vec L = \vec r\times\vec p$; $\tau = dL/dt$ |
| $P = Fv$ | $P = \tau\omega$ |

| Shape (mass $M$) | $I$ |
|---|---|
| Hoop, radius $R$ | $MR^2$ |
| Solid disk or cylinder | $\tfrac12MR^2$ |
| Solid sphere | $\tfrac25MR^2$ |
| Thin spherical shell | $\tfrac23MR^2$ |
| Rod about center / end | $\tfrac1{12}ML^2$ / $\tfrac13ML^2$ |

Rolling from height $h$ ($I = cMR^2$): $v = \sqrt{2gh/(1 + c)}$. Static equilibrium: $\sum\vec F = 0$, $\sum\tau = 0$.

## Gravitation

| | |
|---|---|
| Universal gravitation | $F = \dfrac{Gm_1m_2}{r^2}$; $g = \dfrac{GM}{R^2}$ |
| Circular orbit | $v = \sqrt{\dfrac{GM}{r}}$, $T^2 = \dfrac{4\pi^2}{GM}r^3$ |
| Potential energy | $U = -\dfrac{GMm}{r}$ |
| Escape speed | $v_{\text{esc}} = \sqrt{\dfrac{2GM}{R}}$ |
