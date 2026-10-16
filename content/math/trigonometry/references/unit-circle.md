---
id: trig-ref-unit-circle
title: Angles and the unit circle
---
## Angle measure

| Fact | Formula |
|---|---|
| Full turn | $360^\circ = 2\pi$ rad |
| Degrees to radians | multiply by $\dfrac{\pi}{180^\circ}$ |
| Radians to degrees | multiply by $\dfrac{180^\circ}{\pi}$ |
| One radian | $\approx 57.296^\circ$ |
| DMS | $1^\circ = 60'$, $1' = 60''$ |
| Coterminal angles | $\theta + 360^\circ k$ or $\theta + 2\pi k$ |
| Arc length | $s = r\theta$ ($\theta$ in radians) |
| Sector area | $A = \tfrac12 r^2\theta = \tfrac12 rs$ |
| Linear and angular speed | $v = r\omega$, $\omega = \theta/t$, rad/min $= 2\pi \cdot$ rpm |

## The unit circle

```plot
{"x": [-1.6, 1.6], "y": [-1.6, 1.6], "equal": true, "circles": [{"center": [0, 0], "r": 1}], "points": [{"at": [1.0000, 0.0000]}, {"at": [0.8660, 0.5000]}, {"at": [0.7071, 0.7071]}, {"at": [0.5000, 0.8660]}, {"at": [0.0000, 1.0000]}, {"at": [-0.5000, 0.8660]}, {"at": [-0.7071, 0.7071]}, {"at": [-0.8660, 0.5000]}, {"at": [-1.0000, 0.0000]}, {"at": [-0.8660, -0.5000]}, {"at": [-0.7071, -0.7071]}, {"at": [-0.5000, -0.8660]}, {"at": [-0.0000, -1.0000]}, {"at": [0.5000, -0.8660]}, {"at": [0.7071, -0.7071]}, {"at": [0.8660, -0.5000]}], "labels": [{"at": [1.3000, -0.0300], "text": "0°"}, {"at": [1.1258, 0.6200], "text": "30°"}, {"at": [0.9192, 0.8892], "text": "45°"}, {"at": [0.6500, 1.0958], "text": "60°"}, {"at": [0.0000, 1.2700], "text": "90°"}, {"at": [-0.6500, 1.0958], "text": "120°"}, {"at": [-0.9192, 0.8892], "text": "135°"}, {"at": [-1.1258, 0.6200], "text": "150°"}, {"at": [-1.3000, -0.0300], "text": "180°"}, {"at": [-1.1258, -0.6800], "text": "210°"}, {"at": [-0.9192, -0.9492], "text": "225°"}, {"at": [-0.6500, -1.1558], "text": "240°"}, {"at": [-0.0000, -1.3300], "text": "270°"}, {"at": [0.6500, -1.1558], "text": "300°"}, {"at": [0.9192, -0.9492], "text": "315°"}, {"at": [1.1258, -0.6800], "text": "330°"}], "caption": "The unit circle: the point at angle θ is (cos θ, sin θ)"}
```

| Degrees | Radians | Point $(\cos\theta, \sin\theta)$ | $\sin\theta$ | $\cos\theta$ | $\tan\theta$ |
|---|---|---|---|---|---|
| $0^\circ$ | $0$ | $(1, 0)$ | $0$ | $1$ | $0$ |
| $30^\circ$ | $\tfrac{\pi}{6}$ | $(\tfrac{\sqrt{3}}{2}, \tfrac{1}{2})$ | $\tfrac{1}{2}$ | $\tfrac{\sqrt{3}}{2}$ | $\tfrac{\sqrt{3}}{3}$ |
| $45^\circ$ | $\tfrac{\pi}{4}$ | $(\tfrac{\sqrt{2}}{2}, \tfrac{\sqrt{2}}{2})$ | $\tfrac{\sqrt{2}}{2}$ | $\tfrac{\sqrt{2}}{2}$ | $1$ |
| $60^\circ$ | $\tfrac{\pi}{3}$ | $(\tfrac{1}{2}, \tfrac{\sqrt{3}}{2})$ | $\tfrac{\sqrt{3}}{2}$ | $\tfrac{1}{2}$ | $\sqrt{3}$ |
| $90^\circ$ | $\tfrac{\pi}{2}$ | $(0, 1)$ | $1$ | $0$ | undefined |
| $120^\circ$ | $\tfrac{2 \pi}{3}$ | $(- \tfrac{1}{2}, \tfrac{\sqrt{3}}{2})$ | $\tfrac{\sqrt{3}}{2}$ | $- \tfrac{1}{2}$ | $- \sqrt{3}$ |
| $135^\circ$ | $\tfrac{3 \pi}{4}$ | $(- \tfrac{\sqrt{2}}{2}, \tfrac{\sqrt{2}}{2})$ | $\tfrac{\sqrt{2}}{2}$ | $- \tfrac{\sqrt{2}}{2}$ | $-1$ |
| $150^\circ$ | $\tfrac{5 \pi}{6}$ | $(- \tfrac{\sqrt{3}}{2}, \tfrac{1}{2})$ | $\tfrac{1}{2}$ | $- \tfrac{\sqrt{3}}{2}$ | $- \tfrac{\sqrt{3}}{3}$ |
| $180^\circ$ | $\pi$ | $(-1, 0)$ | $0$ | $-1$ | $0$ |
| $210^\circ$ | $\tfrac{7 \pi}{6}$ | $(- \tfrac{\sqrt{3}}{2}, - \tfrac{1}{2})$ | $- \tfrac{1}{2}$ | $- \tfrac{\sqrt{3}}{2}$ | $\tfrac{\sqrt{3}}{3}$ |
| $225^\circ$ | $\tfrac{5 \pi}{4}$ | $(- \tfrac{\sqrt{2}}{2}, - \tfrac{\sqrt{2}}{2})$ | $- \tfrac{\sqrt{2}}{2}$ | $- \tfrac{\sqrt{2}}{2}$ | $1$ |
| $240^\circ$ | $\tfrac{4 \pi}{3}$ | $(- \tfrac{1}{2}, - \tfrac{\sqrt{3}}{2})$ | $- \tfrac{\sqrt{3}}{2}$ | $- \tfrac{1}{2}$ | $\sqrt{3}$ |
| $270^\circ$ | $\tfrac{3 \pi}{2}$ | $(0, -1)$ | $-1$ | $0$ | undefined |
| $300^\circ$ | $\tfrac{5 \pi}{3}$ | $(\tfrac{1}{2}, - \tfrac{\sqrt{3}}{2})$ | $- \tfrac{\sqrt{3}}{2}$ | $\tfrac{1}{2}$ | $- \sqrt{3}$ |
| $315^\circ$ | $\tfrac{7 \pi}{4}$ | $(\tfrac{\sqrt{2}}{2}, - \tfrac{\sqrt{2}}{2})$ | $- \tfrac{\sqrt{2}}{2}$ | $\tfrac{\sqrt{2}}{2}$ | $-1$ |
| $330^\circ$ | $\tfrac{11 \pi}{6}$ | $(\tfrac{\sqrt{3}}{2}, - \tfrac{1}{2})$ | $- \tfrac{1}{2}$ | $\tfrac{\sqrt{3}}{2}$ | $- \tfrac{\sqrt{3}}{3}$ |

## Signs by quadrant ("All Students Take Calculus")

| Quadrant | Positive functions |
|---|---|
| I | all six |
| II | $\sin$, $\csc$ |
| III | $\tan$, $\cot$ |
| IV | $\cos$, $\sec$ |

## Reference angles

| Quadrant of $\theta$ | Reference angle (degrees) | Reference angle (radians) |
|---|---|---|
| I | $\theta$ | $\theta$ |
| II | $180^\circ - \theta$ | $\pi - \theta$ |
| III | $\theta - 180^\circ$ | $\theta - \pi$ |
| IV | $360^\circ - \theta$ | $2\pi - \theta$ |

## Special right triangles

| Triangle | Side ratios |
|---|---|
| $45^\circ$–$45^\circ$–$90^\circ$ | $1 : 1 : \sqrt2$ |
| $30^\circ$–$60^\circ$–$90^\circ$ | $1 : \sqrt3 : 2$ (short leg : long leg : hypotenuse) |

## The six functions

| Right triangle | Point $(x, y)$ at distance $r$ | Unit circle |
|---|---|---|
| $\sin\theta = \dfrac{\text{opp}}{\text{hyp}}$ | $\dfrac{y}{r}$ | $y$ |
| $\cos\theta = \dfrac{\text{adj}}{\text{hyp}}$ | $\dfrac{x}{r}$ | $x$ |
| $\tan\theta = \dfrac{\text{opp}}{\text{adj}}$ | $\dfrac{y}{x}$ | $\dfrac{y}{x}$ |
| $\csc\theta = \dfrac{\text{hyp}}{\text{opp}}$ | $\dfrac{r}{y}$ | $\dfrac{1}{y}$ |
| $\sec\theta = \dfrac{\text{hyp}}{\text{adj}}$ | $\dfrac{r}{x}$ | $\dfrac{1}{x}$ |
| $\cot\theta = \dfrac{\text{adj}}{\text{opp}}$ | $\dfrac{x}{y}$ | $\dfrac{x}{y}$ |

## Domains, ranges and periods

| Function | Domain | Range | Period |
|---|---|---|---|
| $\sin x$ | all reals | $[-1, 1]$ | $2\pi$ |
| $\cos x$ | all reals | $[-1, 1]$ | $2\pi$ |
| $\tan x$ | $x \ne \tfrac{\pi}{2} + k\pi$ | all reals | $\pi$ |
| $\cot x$ | $x \ne k\pi$ | all reals | $\pi$ |
| $\sec x$ | $x \ne \tfrac{\pi}{2} + k\pi$ | $(-\infty, -1] \cup [1, \infty)$ | $2\pi$ |
| $\csc x$ | $x \ne k\pi$ | $(-\infty, -1] \cup [1, \infty)$ | $2\pi$ |

## Inverse functions

| Function | Domain | Range |
|---|---|---|
| $\sin^{-1} x$ | $[-1, 1]$ | $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ |
| $\cos^{-1} x$ | $[-1, 1]$ | $[0, \pi]$ |
| $\tan^{-1} x$ | all reals | $(-\tfrac{\pi}{2}, \tfrac{\pi}{2})$ |
