---
id: trig-double-angle
module: trig-m6
title: Double-angle and power-reducing formulas
minutes: 40
topics: [Double-angle formulas]
drills: [trig-d-double-given, trig-d-power-reduce]
refs: [trig-ref-identities]
---
## A special case with big consequences

Set $\beta = \alpha$ in the sum formulas and you get formulas for $\sin 2\alpha$, $\cos 2\alpha$ and
$\tan 2\alpha$. They look like a small corollary, but they are among the most used identities in
mathematics: they turn products like $\sin x\cos x$ into a single function, they remove
squares (which is how calculus integrates $\sin^2 x$), and they show up in physics
formulas such as the range of a projectile.

## The double-angle formulas

From $\sin(\alpha + \alpha)$ and $\cos(\alpha + \alpha)$:

$$\sin 2x = 2\sin x\cos x$$
$$\cos 2x = \cos^2 x - \sin^2 x$$
$$\tan 2x = \frac{2\tan x}{1 - \tan^2 x}$$

These are the **double-angle formulas**. The cosine formula has two more forms, obtained by
replacing $\sin^2 x$ with $1 - \cos^2 x$, or $\cos^2 x$ with $1 - \sin^2 x$:

$$\cos 2x = 2\cos^2 x - 1 = 1 - 2\sin^2 x.$$

Choose the form that matches what you know or what you want: if you know only $\sin x$, use
$1 - 2\sin^2 x$.

Note that $\sin 2x$ is not $2\sin x$: at $x = \tfrac{\pi}{2}$, $\sin\pi = 0$ but $2\sin\tfrac{\pi}{2} = 2$.

### Example 1

$\sin\theta = \tfrac{5}{13}$ and $\theta$ is in quadrant II. Find $\sin 2\theta$, $\cos 2\theta$ and $\tan 2\theta$,
and the quadrant of $2\theta$.

**Missing value.** $\cos\theta = -\tfrac{12}{13}$ (negative in QII).

$$\sin 2\theta = 2\cdot\tfrac{5}{13}\cdot\left(-\tfrac{12}{13}\right) = -\tfrac{120}{169}.$$
$$\cos 2\theta = \left(-\tfrac{12}{13}\right)^2 - \left(\tfrac{5}{13}\right)^2 = \tfrac{144 - 25}{169} = \tfrac{119}{169}.$$
$$\tan 2\theta = \frac{\sin 2\theta}{\cos 2\theta} = -\tfrac{120}{119}.$$

Sine negative and cosine positive put $2\theta$ in quadrant IV. That agrees with the angles:
$90^\circ < \theta < 180^\circ$ means $180^\circ < 2\theta < 360^\circ$, and the signs narrow it to IV.

### Example 2

Verify $(\sin x + \cos x)^2 = 1 + \sin 2x$.

$(\sin x + \cos x)^2 = \sin^2 x + 2\sin x\cos x + \cos^2 x = 1 + 2\sin x\cos x = 1 + \sin 2x$. ✓

### Example 3: triple angle

Express $\cos 3x$ in terms of $\cos x$.

$\cos 3x = \cos(2x + x) = \cos 2x\cos x - \sin 2x\sin x$
$= (2\cos^2 x - 1)\cos x - 2\sin x\cos x\cdot\sin x$
$= 2\cos^3 x - \cos x - 2\cos x(1 - \cos^2 x)$
$= 4\cos^3 x - 3\cos x.$

## Power-reducing formulas

Solve $\cos 2x = 1 - 2\sin^2 x$ for $\sin^2 x$, and $\cos 2x = 2\cos^2 x - 1$ for $\cos^2 x$:

$$\sin^2 x = \frac{1 - \cos 2x}{2}, \qquad \cos^2 x = \frac{1 + \cos 2x}{2}, \qquad \tan^2 x = \frac{1 - \cos 2x}{1 + \cos 2x}.$$

These **power-reducing formulas** trade a square for a first power of cosine at twice
the angle. That's the key step in integrating $\sin^2 x$ in calculus, and it explains the
graph: $\sin^2 x$ is a cosine wave of half the size, flipped and lifted to midline $\tfrac12$.

```plot
{"x": [-0.3, 6.6], "y": [-1.2, 1.3], "functions": [{"f": "sin(x)", "dashed": true, "label": "sin x"}, {"f": "sin(x)^2", "label": "sin² x = (1 − cos 2x)/2"}], "caption": "sin² x oscillates between 0 and 1 with period π"}
```

### Example 4

Rewrite $\sin^4 x$ using only first powers of cosine.

Write $\sin^4 x = (\sin^2 x)^2$ and reduce:
$$\left(\frac{1 - \cos 2x}{2}\right)^2 = \frac{1 - 2\cos 2x + \cos^2 2x}{4}.$$
Reduce $\cos^2 2x = \tfrac{1 + \cos 4x}{2}$:
$$\frac{1 - 2\cos 2x + \tfrac12 + \tfrac12\cos 4x}{4} = \frac{3 - 4\cos 2x + \cos 4x}{8}.$$
Check at $x = \tfrac{\pi}{2}$: left $1$; right $\tfrac{3 + 4 + 1}{8} = 1$. ✓

### Example 5: projectile range

A projectile launched at speed $v$ and angle $\theta$ over level ground (no air resistance)
lands at distance
$$R = \frac{v^2\sin 2\theta}{g}.$$
(It comes from $R = \tfrac{2v^2\sin\theta\cos\theta}{g}$, which is the double-angle formula in disguise.)
Since $\sin 2\theta$ is largest, 1, when $2\theta = 90^\circ$, the range is greatest at $\theta = 45^\circ$.
Angles like $30^\circ$ and $60^\circ$ give equal ranges because $\sin 60^\circ = \sin 120^\circ$.

### Example 6: starting from cosine

$\cos\theta = \tfrac35$ and $\theta$ is in quadrant IV. Find $\sin 2\theta$, $\cos 2\theta$ and $\tan 2\theta$.

$\sin\theta = -\tfrac45$ (negative in QIV). Then $\sin 2\theta = 2\left(-\tfrac45\right)\left(\tfrac35\right) = -\tfrac{24}{25}$,
$\cos 2\theta = 2\cdot\tfrac{9}{25} - 1 = -\tfrac{7}{25}$, and $\tan 2\theta = \tfrac{-24/25}{-7/25} = \tfrac{24}{7}$. Both sine and cosine of $2\theta$ are
negative, so $2\theta$ lies in quadrant III.

### Example 7: an identity

Verify $\dfrac{\sin 2x}{1 + \cos 2x} = \tan x$.

Use $\sin 2x = 2\sin x\cos x$ on top and $1 + \cos 2x = 2\cos^2 x$ underneath (the "$2\cos^2 x - 1$" form,
chosen so the 1's cancel):
$$\frac{2\sin x\cos x}{2\cos^2 x} = \frac{\sin x}{\cos x} = \tan x. \;\checkmark$$

## Choosing the right form

When you need $\cos 2\theta$ and know only $\sin\theta$, use $1 - 2\sin^2\theta$: no square root, so no sign to
decide. When you know only $\cos\theta$, use $2\cos^2\theta - 1$. Only $\sin 2\theta$ always needs both values.

## Common mistakes

- **$\sin 2x = 2\sin x$.** The factor of 2 can't be pulled out of the function.
- **Using the wrong form of $\cos 2x$.** All three are correct; pick the one that fits.
- **Sign errors in power-reducing:** $\sin^2$ gets the minus, $\cos^2$ the plus. Check at
  $x = 0$: $\sin^2 0 = 0 = \tfrac{1 - 1}{2}$.
- **Forgetting the quadrant of $\theta$** when finding the missing value.

## Key points

- $\sin 2x = 2\sin x\cos x$; $\cos 2x = \cos^2 x - \sin^2 x = 2\cos^2 x - 1 = 1 - 2\sin^2 x$.
- $\tan 2x = \dfrac{2\tan x}{1 - \tan^2 x}$.
- $\sin^2 x = \tfrac{1 - \cos 2x}{2}$, $\cos^2 x = \tfrac{1 + \cos 2x}{2}$.
- Find $\sin\theta$ and $\cos\theta$ with correct signs first, then apply the formulas.
