---
id: mv-ref-differential
title: Differential calculus formulas
---
## Single-variable review

| Rule | Formula |
|---|---|
| Chain rule | $\frac{d}{dx}f(g(x)) = f'(g(x))g'(x)$ |
| Product, quotient | $(fg)' = f'g + fg'$, $(f/g)' = (f'g - fg')/g^2$ |
| FTC | $\int_a^b f(x)\,dx = F(b) - F(a)$ where $F' = f$ |
| Parts | $\int u\,dv = uv - \int v\,du$ |
| Polar | $x = r\cos\theta$, $y = r\sin\theta$; area $\tfrac12\int r^2\,d\theta$ |

## Vector functions and motion

| Quantity | Formula |
|---|---|
| Velocity, speed, acceleration | $\mathbf v = \mathbf r'$, $\lvert\mathbf r'\rvert$, $\mathbf a = \mathbf r''$ |
| Arc length | $L = \int_a^b\lvert\mathbf r'(t)\rvert\,dt$ |
| Unit tangent | $\mathbf T = \mathbf r'/\lvert\mathbf r'\rvert$ |
| Principal normal, binormal | $\mathbf N = \mathbf T'/\lvert\mathbf T'\rvert$, $\mathbf B = \mathbf T\times\mathbf N$ |
| Curvature | $\kappa = \dfrac{\lvert\mathbf T'\rvert}{\lvert\mathbf r'\rvert} = \dfrac{\lvert\mathbf r'\times\mathbf r''\rvert}{\lvert\mathbf r'\rvert^3}$; for $y = f(x)$: $\dfrac{\lvert f''\rvert}{(1 + f'^2)^{3/2}}$ |
| Acceleration components | $a_T = \dfrac{\mathbf r'\cdot\mathbf r''}{\lvert\mathbf r'\rvert}$, $a_N = \dfrac{\lvert\mathbf r'\times\mathbf r''\rvert}{\lvert\mathbf r'\rvert} = \kappa v^2$ |
| Projectile | $\mathbf r = \langle v_0t\cos\alpha,\; v_0t\sin\alpha - \tfrac12gt^2\rangle$ |
| Range, flight time, height | $\dfrac{v_0^2\sin2\alpha}{g}$, $\dfrac{2v_0\sin\alpha}{g}$, $\dfrac{(v_0\sin\alpha)^2}{2g}$ |

## Partial derivatives

| Idea | Formula |
|---|---|
| Tangent plane | $z = f(a,b) + f_x(a,b)(x-a) + f_y(a,b)(y-b)$ |
| Differential | $dz = f_x\,dx + f_y\,dy$ |
| Chain rule | $\dfrac{dz}{dt} = f_x\dfrac{dx}{dt} + f_y\dfrac{dy}{dt}$; one term per tree path |
| Implicit | $\dfrac{dy}{dx} = -\dfrac{F_x}{F_y}$; $\dfrac{\partial z}{\partial x} = -\dfrac{F_x}{F_z}$ |
| Gradient | $\nabla f = \langle f_x, f_y, f_z\rangle$ |
| Directional derivative | $D_{\mathbf u}f = \nabla f\cdot\mathbf u$ ($\lvert\mathbf u\rvert = 1$); max $\lvert\nabla f\rvert$ |
| Level surface tangent plane | $\nabla F(P)\cdot\langle x-x_0, y-y_0, z-z_0\rangle = 0$ |
| Clairaut | $f_{xy} = f_{yx}$ when both are continuous near the point |

## Optimization

| Tool | Statement |
|---|---|
| Critical point | $\nabla f = \mathbf 0$ or undefined |
| Second-derivative test | At a critical point with continuous second partials, $D = f_{xx}f_{yy} - f_{xy}^2$: $D>0, f_{xx}>0$ min; $D>0, f_{xx}<0$ max; $D<0$ saddle; $D=0$ inconclusive |
| Closed region | Compare interior critical values with boundary extremes (include corners) |
| Lagrange | $\nabla f = \lambda\nabla g$, $g = k$ (needs $\nabla g \ne \mathbf 0$); two constraints: $\nabla f = \lambda\nabla g + \mu\nabla h$ ($\nabla g$, $\nabla h$ not parallel) |
| Least squares line | Minimize $S(m,b) = \sum(y_i - mx_i - b)^2$; normal equations $m\sum x_i^2 + b\sum x_i = \sum x_iy_i$, $m\sum x_i + nb = \sum y_i$ |
| Least squares formulas | $m = \dfrac{n\sum x_iy_i - \sum x_i\sum y_i}{n\sum x_i^2 - (\sum x_i)^2}$, $b = \bar y - m\bar x$; through the origin: $k = \sum x_iy_i/\sum x_i^2$ |
