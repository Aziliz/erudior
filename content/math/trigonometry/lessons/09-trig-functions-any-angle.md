---
id: trig-any-angle
module: trig-m3
title: Trig functions of any angle
minutes: 30
topics: [Trig functions of any angle]
drills: [trig-d-point-ratios, trig-d-quadrant-given]
refs: [trig-ref-unit-circle]
---
## Beyond the right triangle

A right triangle can only hold acute angles, yet Module 1 described angles of $150^\circ$,
$-45^\circ$ and $1000^\circ$. To give those angles a sine and a cosine, we need a definition
that does not depend on a triangle. The idea is to put the angle in standard position and
use the coordinates of a point on its terminal side. For acute angles the new definition
gives exactly the old values, so nothing learned so far is lost.

## The definition

Put $\theta$ in standard position and pick any point $(x, y)$, other than the origin, on
its terminal side. Let $r = \sqrt{x^2 + y^2}$ be that point's distance from the origin
(always positive). Then

$$\sin\theta = \frac{y}{r}, \quad \cos\theta = \frac{x}{r}, \quad \tan\theta = \frac{y}{x}\ (x \ne 0),$$
$$\csc\theta = \frac{r}{y}\ (y \ne 0), \quad \sec\theta = \frac{r}{x}\ (x \ne 0), \quad \cot\theta = \frac{x}{y}\ (y \ne 0).$$

**Why this extends the old definition:** for an acute angle the point $(x, y)$ is in
quadrant I, and dropping a perpendicular to the $x$-axis makes a right triangle with
adjacent side $x$, opposite side $y$ and hypotenuse $r$. So $y/r$ is opposite over
hypotenuse, as before.

**Why the choice of point doesn't matter:** any other point on the same terminal side is
$(kx, ky)$ with $k > 0$, at distance $kr$, and the $k$'s cancel in every ratio.

```plot
{"x": [-5, 3], "y": [-1.5, 5.5], "equal": true, "segments": [{"from": [0, 0], "to": [-3, 4], "label": "r = 5"}, {"from": [-3, 0], "to": [-3, 4], "dashed": true}], "points": [{"at": [-3, 4], "label": "(−3, 4)"}], "curves": [{"x": "0.6cos(t)", "y": "0.6sin(t)", "t": [0, 2.2143]}], "labels": [{"at": [0.55, 0.6], "text": "θ"}], "caption": "θ in quadrant II with the point (−3, 4) on its terminal side"}
```

### Example 1

The point $(-3, 4)$ is on the terminal side of $\theta$. Find all six trig functions.

**Step 1:** $r = \sqrt{(-3)^2 + 4^2} = \sqrt{25} = 5$.

**Step 2:** substitute $x = -3$, $y = 4$, $r = 5$:
$$\sin\theta = \tfrac45,\ \cos\theta = -\tfrac35,\ \tan\theta = -\tfrac43,\ \csc\theta = \tfrac54,\ \sec\theta = -\tfrac53,\ \cot\theta = -\tfrac34.$$

The signs come automatically from the signs of $x$ and $y$. In quadrant II, $x < 0$ and
$y > 0$, so sine is positive and cosine and tangent are negative.

## Signs in each quadrant

Since $r > 0$, the sign of each function depends only on the signs of $x$ and $y$:

- $\sin\theta = y/r$ has the sign of $y$: positive in quadrants I and II.
- $\cos\theta = x/r$ has the sign of $x$: positive in quadrants I and IV.
- $\tan\theta = y/x$ is positive when $x$ and $y$ agree: quadrants I and III.

Each reciprocal has the same sign as its partner. The mnemonic
**All Students Take Calculus** (**ASTC**), read counterclockwise from quadrant I, lists
which functions are positive: **A**ll in I, **S**ine in II, **T**angent in III, **C**osine
in IV.

```plot
{"x": [-2, 2], "y": [-2, 2], "equal": true, "labels": [{"at": [1, 1], "text": "I: All +"}, {"at": [-1, 1], "text": "II: sin, csc +"}, {"at": [-1, -1], "text": "III: tan, cot +"}, {"at": [1, -1], "text": "IV: cos, sec +"}], "caption": "ASTC: which functions are positive in each quadrant"}
```

### Example 2

$\tan\theta = -\tfrac{5}{12}$ and $\cos\theta > 0$. Find $\sin\theta$ and $\sec\theta$.

**Step 1: the quadrant.** Tangent is negative in II and IV; cosine is positive in I and IV.
Both hold only in **quadrant IV**, where $x > 0$, $y < 0$.

**Step 2: a point.** $\tan\theta = \tfrac{y}{x} = \tfrac{-5}{12}$, so take $x = 12$, $y = -5$.
(Not $x = -12$, $y = 5$: that's quadrant II.) Then $r = \sqrt{144 + 25} = 13$.

**Step 3:** $\sin\theta = -\tfrac{5}{13}$ and $\sec\theta = \tfrac{13}{12}$.

This is the standard technique whenever one function value and a sign condition are
given: find the quadrant first, then choose $x$ and $y$ with the right signs.

## Quadrantal angles

For a quadrantal angle the terminal side lies on an axis, so one coordinate is 0. Use the
convenient point at distance $r = 1$:

| $\theta$ | point | $\sin$ | $\cos$ | $\tan$ | $\csc$ | $\sec$ | $\cot$ |
|---|---|---|---|---|---|---|---|
| $0^\circ$ | $(1, 0)$ | $0$ | $1$ | $0$ | undef. | $1$ | undef. |
| $90^\circ$ | $(0, 1)$ | $1$ | $0$ | undef. | $1$ | undef. | $0$ |
| $180^\circ$ | $(-1, 0)$ | $0$ | $-1$ | $0$ | undef. | $-1$ | undef. |
| $270^\circ$ | $(0, -1)$ | $-1$ | $0$ | undef. | $-1$ | undef. | $0$ |

"Undefined" always means a zero in a denominator: tangent and secant divide by $x$, so they
fail where $x = 0$ (at $90^\circ$ and $270^\circ$); cotangent and cosecant divide by $y$, so
they fail where $y = 0$.

### Example 3

Find $\sin 270^\circ$, $\cos 540^\circ$ and $\tan 450^\circ$.

$270^\circ$ ends at $(0, -1)$, so $\sin 270^\circ = -1$.
$540^\circ - 360^\circ = 180^\circ$ ends at $(-1, 0)$, so $\cos 540^\circ = -1$.
$450^\circ - 360^\circ = 90^\circ$ ends at $(0, 1)$, so $\tan 450^\circ = \tfrac10$ is undefined.

Coterminal angles have the same terminal side, hence the same point and the same function
values. That's why reducing to $[0^\circ, 360^\circ)$ first is always allowed.

### Example 4

The terminal side of $\theta$ passes through $(-1, -2)$. Find $\sin\theta$ and $\cos\theta$
exactly.

$r = \sqrt{1 + 4} = \sqrt5$. So $\sin\theta = \tfrac{-2}{\sqrt5} = -\tfrac{2\sqrt5}{5}$ and
$\cos\theta = \tfrac{-1}{\sqrt5} = -\tfrac{\sqrt5}{5}$. Both negative, as expected in quadrant III.

## Common mistakes

- **Giving $r$ a sign.** $r$ is a distance, always positive. All the signs come from $x$ and $y$.
- **Choosing the point with the wrong signs** when working from a ratio like
  $\tan\theta = -\tfrac{5}{12}$. Decide the quadrant first.
- **Saying $\tan 90^\circ = 0$ or $\infty$.** It is undefined (division by zero).
- **Dropping the sign of a coordinate** when computing $r$: $(-3)^2 = 9$, not $-9$.

## Key points

- With $(x, y)$ on the terminal side and $r = \sqrt{x^2 + y^2}$: $\sin\theta = y/r$,
  $\cos\theta = x/r$, $\tan\theta = y/x$, and the reciprocals.
- ASTC: All, Sine, Tangent, Cosine are positive in quadrants I, II, III, IV.
- Quadrantal angles: use $(\pm1, 0)$ or $(0, \pm1)$; a zero denominator means undefined.
- Coterminal angles have identical trig values.
