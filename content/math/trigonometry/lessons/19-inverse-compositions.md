---
id: trig-inverse-comp
module: trig-m5
title: Compositions and other inverse functions
minutes: 35
topics: [Inverse compositions]
drills: [trig-d-inverse-comp, trig-d-inv-comp-algebra]
refs: [trig-ref-unit-circle]
---
## Undoing, and when it fails

A function and its inverse undo each other, so you might expect
$\sin^{-1}(\sin x) = x$ always. It is true only some of the time, because $\sin^{-1}$ can only
return angles in its restricted range. This lesson sorts out exactly when the
"cancellation" works, shows how to evaluate mixed expressions like
$\cos\!\left(\sin^{-1}\tfrac35\right)$ with a triangle, and introduces the three remaining
inverse functions.

## Compositions in the "safe" order

Applying the trig function *after* its inverse always cancels, as long as the input is in
the inverse's domain:
$$\sin(\sin^{-1}x) = x \ \text{for } -1 \le x \le 1, \qquad \cos(\cos^{-1}x) = x \ \text{for } -1 \le x \le 1, \qquad \tan(\tan^{-1}x) = x \ \text{for all } x.$$
Reason: $\sin^{-1}x$ is, by definition, an angle whose sine is $x$. So
$\sin\!\left(\sin^{-1}0.42\right) = 0.42$, and $\cos\!\left(\cos^{-1}(-0.9)\right) = -0.9$, but
$\sin\!\left(\sin^{-1}3\right)$ is undefined.

## Compositions in the "risky" order

Applying the inverse *after* the trig function cancels only when the angle is already in
the inverse's range:
$$\sin^{-1}(\sin x) = x \ \text{only for } -\tfrac{\pi}{2} \le x \le \tfrac{\pi}{2}, \qquad \cos^{-1}(\cos x) = x \ \text{only for } 0 \le x \le \pi,$$
$$\tan^{-1}(\tan x) = x \ \text{only for } -\tfrac{\pi}{2} < x < \tfrac{\pi}{2}.$$
Otherwise, evaluate the inside first, then apply the inverse, and the answer is the angle
*in the range* with the same trig value.

### Example 1

Evaluate $\sin^{-1}\!\left(\sin\tfrac{5\pi}{6}\right)$, $\cos^{-1}\!\left(\cos\left(-\tfrac{\pi}{3}\right)\right)$ and
$\tan^{-1}\!\left(\tan\tfrac{3\pi}{4}\right)$.

**First:** $\tfrac{5\pi}{6}$ is outside $\left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right]$. Inside first: $\sin\tfrac{5\pi}{6} = \tfrac12$.
Then $\sin^{-1}\tfrac12 = \tfrac{\pi}{6}$. So the answer is $\tfrac{\pi}{6}$, not $\tfrac{5\pi}{6}$.

**Second:** $-\tfrac{\pi}{3}$ is outside $[0, \pi]$. $\cos\left(-\tfrac{\pi}{3}\right) = \tfrac12$, and
$\cos^{-1}\tfrac12 = \tfrac{\pi}{3}$.

**Third:** $\tfrac{3\pi}{4}$ is outside $\left(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right)$. $\tan\tfrac{3\pi}{4} = -1$ and
$\tan^{-1}(-1) = -\tfrac{\pi}{4}$.

```plot
{"x": [-7, 7], "y": [-2, 2], "functions": [{"f": "asin(sin(x))", "label": "y = sin⁻¹(sin x)"}, {"f": "x", "dashed": true, "from": -1.5708, "to": 1.5708}], "caption": "sin⁻¹(sin x) equals x only on [−π/2, π/2]; elsewhere it zigzags"}
```

## Mixed compositions with a triangle

For $\cos\!\left(\sin^{-1}\tfrac35\right)$, let $\theta = \sin^{-1}\tfrac35$. Then $\sin\theta = \tfrac35$ and
$\theta$ is in $\left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right]$; since $\tfrac35 > 0$, $\theta$ is in quadrant I. Draw a right
triangle with opposite 3 and hypotenuse 5; the adjacent side is 4. So
$\cos\!\left(\sin^{-1}\tfrac35\right) = \cos\theta = \tfrac45$.

The method: **name the inner angle, find its quadrant from the inverse's range, draw a
reference triangle, read off the outer function with the correct sign.**

### Example 2

Evaluate $\tan\!\left(\cos^{-1}\!\left(-\tfrac{5}{13}\right)\right)$ and $\sec\!\left(\tan^{-1}\!\left(-\tfrac{7}{24}\right)\right)$.

**First.** $\theta = \cos^{-1}\!\left(-\tfrac{5}{13}\right)$ is in $[0, \pi]$ with negative cosine: quadrant II.
Use $x = -5$, $r = 13$, so $y = 12$ (positive in QII). $\tan\theta = \tfrac{12}{-5} = -\tfrac{12}{5}$.

**Second.** $\theta = \tan^{-1}\!\left(-\tfrac{7}{24}\right)$ is in quadrant IV. Use $x = 24$, $y = -7$, so
$r = 25$. $\sec\theta = \tfrac{r}{x} = \tfrac{25}{24}$.

### Example 3: algebraic expressions

Write $\sin(\tan^{-1}x)$ and $\cos(\sin^{-1}x)$ as algebraic expressions in $x$.

**$\sin(\tan^{-1}x)$.** Let $\theta = \tan^{-1}x$, so $\tan\theta = \tfrac{x}{1}$. Draw a triangle with
opposite $x$, adjacent 1, hypotenuse $\sqrt{1 + x^2}$. Then
$$\sin(\tan^{-1}x) = \frac{x}{\sqrt{1 + x^2}}.$$
This holds for negative $x$ too: $\theta$ is in quadrant IV, sine is negative, and so is $x$.

**$\cos(\sin^{-1}x)$.** Opposite $x$, hypotenuse 1, adjacent $\sqrt{1 - x^2}$:
$$\cos(\sin^{-1}x) = \sqrt{1 - x^2}.$$
The positive root is right because $\sin^{-1}x$ is in quadrants I or IV, where cosine is never negative.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 3]]}], "rightAngles": [[[4, 0], [0, 0], [4, 3]]], "labels": [{"at": [0.9, 0.25], "text": "θ"}, {"at": [2, -0.4], "text": "1"}, {"at": [4.35, 1.5], "text": "x"}, {"at": [1.6, 1.9], "text": "√(1 + x²)"}], "caption": "θ = tan⁻¹ x: opposite x, adjacent 1"}
```

## Inverse secant, cosecant and cotangent

The remaining inverses are defined through the reciprocal relationships. Conventions differ
between books. This course uses the ones below, which most precalculus texts and math software use;
some calculus books instead take $\left[0, \tfrac{\pi}{2}\right) \cup \left[\pi, \tfrac{3\pi}{2}\right)$ as the range of $\sec^{-1}$, so check
which one your text uses:

| Function | Definition | Domain | Range |
|---|---|---|---|
| $\sec^{-1}x$ | $\cos^{-1}\!\left(\tfrac1x\right)$ | $\lvert x\rvert \ge 1$ | $[0, \pi]$, $y \ne \tfrac{\pi}{2}$ |
| $\csc^{-1}x$ | $\sin^{-1}\!\left(\tfrac1x\right)$ | $\lvert x\rvert \ge 1$ | $\left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right]$, $y \ne 0$ |
| $\cot^{-1}x$ | $\tfrac{\pi}{2} - \tan^{-1}x$ | all reals | $(0, \pi)$ |

These are the **inverse secant**, **inverse cosecant** and **inverse cotangent**.

### Example 4

Find $\sec^{-1}2$, $\csc^{-1}(-\sqrt2)$, $\sec^{-1}3$ and $\cot^{-1}(-2)$.

$\sec^{-1}2 = \cos^{-1}\tfrac12 = \tfrac{\pi}{3}$. $\csc^{-1}(-\sqrt2) = \sin^{-1}\!\left(-\tfrac{1}{\sqrt2}\right) = -\tfrac{\pi}{4}$.
$\sec^{-1}3 = \cos^{-1}\tfrac13 \approx 1.2310$.
$\cot^{-1}(-2) = \tfrac{\pi}{2} - \tan^{-1}(-2) \approx 1.5708 + 1.1071 = 2.6779$, in $(0, \pi)$ as required.
(Computing $\tan^{-1}\!\left(-\tfrac12\right)$ instead would give a negative angle, outside the range.)

### Example 5: negative inputs

Evaluate $\cos\left(\tan^{-1}(-2)\right)$ and $\sin\left(\cos^{-1}\left(-\tfrac13\right)\right)$.

**First.** $\theta = \tan^{-1}(-2)$ is in quadrant IV. Take $x = 1$, $y = -2$, $r = \sqrt5$:
$\cos\theta = \tfrac{1}{\sqrt5} = \tfrac{\sqrt5}{5}$, positive as it must be in quadrant IV.

**Second.** $\theta = \cos^{-1}\left(-\tfrac13\right)$ is in quadrant II. Take $x = -1$, $r = 3$, $y = \sqrt{9 - 1} = 2\sqrt2$:
$\sin\theta = \tfrac{2\sqrt2}{3}$. Sine is positive in quadrant II, so the answer is positive even
though the input was negative.

## Equations that contain an inverse function

To solve an equation such as $2\sin^{-1}x = \tfrac{\pi}{3}$, isolate the inverse function and then apply the
ordinary function to both sides: $\sin^{-1}x = \tfrac{\pi}{6}$, so $x = \sin\tfrac{\pi}{6} = \tfrac12$. First check that the angle
is in the inverse's range. $\cos^{-1}x = \tfrac{3\pi}{2}$ has no solution at all, because $\cos^{-1}$ never returns an
angle larger than $\pi$. The same steps solve $y = 3\cos^{-1}\tfrac{x}{2}$ for $x$: $\tfrac{y}{3} = \cos^{-1}\tfrac{x}{2}$, so
$x = 2\cos\tfrac{y}{3}$, valid for $0 \le y \le 3\pi$.

A related fact is $\sin^{-1}x + \cos^{-1}x = \tfrac{\pi}{2}$ for every $x$ in $[-1, 1]$. If $\theta = \sin^{-1}x$, then
$\tfrac{\pi}{2} - \theta$ lies in $[0, \pi]$ and its cosine is $\sin\theta = x$, so it is $\cos^{-1}x$.

## Why inverse compositions matter

Compositions like $\cos(\sin^{-1}x) = \sqrt{1 - x^2}$ are used constantly in calculus, where
substitutions such as $x = \sin\theta$ turn square roots into trig functions and back. They also let a
program that has found an angle with $\tan^{-1}$ get that angle's sine or cosine directly from
the original ratio, without computing the angle at all.

## Common mistakes

- **Cancelling blindly.** $\sin^{-1}(\sin 3) \ne 3$, since 3 is outside $\left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right]$; it equals
  $\pi - 3 \approx 0.1416$.
- **Wrong sign in triangle problems.** The inverse's range fixes the quadrant of $\theta$;
  the triangle only gives sizes.
- **Taking $\pm$ in algebraic forms.** $\cos(\sin^{-1}x) = \sqrt{1 - x^2}$, never negative.
- **Using $\tfrac{1}{\cos^{-1}x}$ for $\sec^{-1}x$.** It is $\cos^{-1}\!\left(\tfrac1x\right)$.

## Key points

- $f(f^{-1}(x)) = x$ whenever $x$ is in the inverse's domain.
- $f^{-1}(f(x)) = x$ only when $x$ is in the inverse's range; otherwise evaluate inside first.
- For $\text{trig}(\text{inverse trig}(a))$: name the angle, place it using the range, draw a
  triangle, attach the sign.
- $\sec^{-1}x = \cos^{-1}(1/x)$, $\csc^{-1}x = \sin^{-1}(1/x)$, $\cot^{-1}x = \tfrac{\pi}{2} - \tan^{-1}x$.
