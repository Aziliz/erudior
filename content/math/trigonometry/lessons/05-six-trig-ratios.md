---
id: trig-ratios
module: trig-m2
title: The six trigonometric ratios
minutes: 30
topics: [Trig ratios]
drills: [trig-d-six-ratios, trig-d-ratio-from-one]
refs: [trig-ref-unit-circle]
---
## Shape decides the ratios

Module 1 was about measuring angles. This module connects angles to lengths, and right
triangles are where that connection is simplest. The key fact comes from geometry: two
right triangles with the same acute angle are **similar**, so their sides are in the same
proportions no matter how big the triangles are. A ratio of two sides depends only on the
angle. Those ratios are the trigonometric functions.

```plot
{"x": [-0.5, 9], "y": [-0.5, 6.5], "equal": true, "polygons": [{"points": [[0, 0], [4, 0], [4, 3]]}, {"points": [[0, 0], [8, 0], [8, 6]], "color": "#1c7ed6", "fill": true}], "labels": [{"at": [1.3, 0.3], "text": "θ"}, {"at": [4.35, 1.5], "text": "3"}, {"at": [2.0, -0.35], "text": "4"}, {"at": [8.35, 3.0], "text": "6"}, {"at": [6.0, -0.35], "text": "8"}], "caption": "Same angle θ, different sizes: opposite/adjacent is 3/4 = 6/8 in both"}
```

## Naming the sides

Fix one acute angle $\theta$ of a right triangle. Relative to $\theta$:

- the **hypotenuse** is the side across from the right angle (always the longest side);
- the **opposite side** is the leg across from $\theta$;
- the **adjacent side** is the leg that touches $\theta$ and is not the hypotenuse.

"Opposite" and "adjacent" depend on which acute angle you are looking at. Switch to the
other acute angle and the two legs trade names; the hypotenuse never changes.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [6, 3.5]]}], "rightAngles": [[[6, 0], [0, 0], [6, 3.5]]], "labels": [{"at": [1.2, 0.3], "text": "θ"}, {"at": [3, -0.45], "text": "adjacent"}, {"at": [7.2, 1.75], "text": "opposite"}, {"at": [2.6, 2.3], "text": "hypotenuse"}]}
```

## The six ratios

$$\sin\theta = \frac{\text{opp}}{\text{hyp}}, \qquad \cos\theta = \frac{\text{adj}}{\text{hyp}}, \qquad \tan\theta = \frac{\text{opp}}{\text{adj}},$$
$$\csc\theta = \frac{\text{hyp}}{\text{opp}}, \qquad \sec\theta = \frac{\text{hyp}}{\text{adj}}, \qquad \cot\theta = \frac{\text{adj}}{\text{opp}}.$$

The names are **sine**, **cosine**, **tangent**, **cosecant**, **secant** and
**cotangent**. The mnemonic **SOH-CAH-TOA** covers the first three: Sine = Opposite over
Hypotenuse, Cosine = Adjacent over Hypotenuse, Tangent = Opposite over Adjacent.

The second row is the first row flipped. These **reciprocal** relationships are worth
memorizing in this form:
$$\csc\theta = \frac{1}{\sin\theta}, \qquad \sec\theta = \frac{1}{\cos\theta}, \qquad \cot\theta = \frac{1}{\tan\theta}.$$
A common slip is pairing secant with sine. Each "co-" function in the bottom row is paired
with a function *without* "co" in the top row, and vice versa: **sec** pairs with **cos**,
**csc** with **sin**.

Since $\tan\theta = \tfrac{\text{opp}}{\text{adj}}$, dividing the top and bottom by the
hypotenuse shows $\tan\theta = \dfrac{\sin\theta}{\cos\theta}$, and similarly
$\cot\theta = \dfrac{\cos\theta}{\sin\theta}$.

Because the hypotenuse is the longest side, $\sin\theta$ and $\cos\theta$ are always
between 0 and 1 for an acute angle, while $\csc\theta$ and $\sec\theta$ are always greater
than 1. Tangent and cotangent can be any positive number.

## Finding a missing side first

Often only two sides are known. The **Pythagorean theorem**, $a^2 + b^2 = c^2$ with $c$ the
hypotenuse, supplies the third. Whole-number solutions like $3, 4, 5$ and $5, 12, 13$ are
called **Pythagorean triples**; they make exact answers tidy, which is why textbook
problems love them.

### Example 1

A right triangle has legs 5 and 12. Let $\theta$ be the angle opposite the side of
length 5. Find all six trig ratios of $\theta$.

**Step 1: the hypotenuse.** $c = \sqrt{5^2 + 12^2} = \sqrt{169} = 13$.

**Step 2: label relative to $\theta$.** Opposite $= 5$, adjacent $= 12$, hypotenuse $= 13$.

**Step 3: write the ratios.**
$$\sin\theta = \tfrac{5}{13},\quad \cos\theta = \tfrac{12}{13},\quad \tan\theta = \tfrac{5}{12},\quad \csc\theta = \tfrac{13}{5},\quad \sec\theta = \tfrac{13}{12},\quad \cot\theta = \tfrac{12}{5}.$$

Check: the bottom three are the reciprocals of the top three, and $\sin$ and $\cos$ are
both below 1.

### Example 2

$\theta$ is acute and $\sin\theta = \tfrac37$. Find the other five ratios.

**Step 1: draw a triangle that fits.** Any right triangle with opposite 3 and hypotenuse 7
works, because only the ratio matters.

**Step 2: find the adjacent side.** $\text{adj} = \sqrt{7^2 - 3^2} = \sqrt{40} = 2\sqrt{10}$.

**Step 3: write the ratios and rationalize.**
$$\cos\theta = \frac{2\sqrt{10}}{7}, \quad \tan\theta = \frac{3}{2\sqrt{10}} = \frac{3\sqrt{10}}{20}, \quad \csc\theta = \frac73,$$
$$\sec\theta = \frac{7}{2\sqrt{10}} = \frac{7\sqrt{10}}{20}, \quad \cot\theta = \frac{2\sqrt{10}}{3}.$$
To rationalize $\tfrac{3}{2\sqrt{10}}$, multiply top and bottom by $\sqrt{10}$:
$\tfrac{3\sqrt{10}}{2 \cdot 10}$.

```shape
{"polygons": [{"points": [[0, 0], [6.3246, 0], [6.3246, 3]]}], "rightAngles": [[[6.3246, 0], [0, 0], [6.3246, 3]]], "labels": [{"at": [1.4, 0.3], "text": "θ"}, {"at": [3.16, -0.45], "text": "2√10"}, {"at": [6.75, 1.5], "text": "3"}, {"at": [2.9, 2.0], "text": "7"}], "caption": "A triangle with sin θ = 3/7"}
```

## Using a calculator

Calculators have keys for $\sin$, $\cos$ and $\tan$ only. For the others, use the
reciprocals: $\sec 40^\circ = \dfrac{1}{\cos 40^\circ} \approx \dfrac{1}{0.7660} \approx 1.3054$.
Make sure the calculator is in degree mode when the angle is in degrees.

Do **not** use the $\cos^{-1}$ key to find secant. $\cos^{-1}$ is the inverse cosine (it
takes a ratio and returns an angle), which is a completely different thing from
$\tfrac{1}{\cos}$. That distinction gets its own lesson in Module 5.

### Example 3

Find $\cot 25^\circ$ to four decimal places.

$\cot 25^\circ = \dfrac{1}{\tan 25^\circ} \approx \dfrac{1}{0.46631} \approx 2.1445$.

Sanity check: $25^\circ$ is a fairly small angle, so the opposite side is short compared
with the adjacent side, and adjacent/opposite should be bigger than 1. ✓

### Example 4: switching to the other acute angle

In Example 1's triangle (legs 5 and 12, hypotenuse 13), let $\beta$ be the *other* acute angle,
the one opposite the side of length 12. Find $\sin\beta$, $\cos\beta$ and $\tan\beta$.

From $\beta$, the opposite side is 12 and the adjacent side is 5:
$\sin\beta = \tfrac{12}{13}$, $\cos\beta = \tfrac{5}{13}$, $\tan\beta = \tfrac{12}{5}$.

Compare with $\theta$: $\sin\beta = \cos\theta$, $\cos\beta = \sin\theta$ and $\tan\beta = \cot\theta$. Because $\theta + \beta = 90^\circ$,
this always happens. The next lesson names it: the cofunction identities.

## Common mistakes

- **Labeling relative to the wrong angle.** Before writing any ratio, mark $\theta$ and
  label opposite/adjacent from *its* point of view.
- **Using the hypotenuse as a leg** in the Pythagorean theorem. The hypotenuse is alone
  on its side: $c^2 = a^2 + b^2$, so a leg is $\sqrt{c^2 - a^2}$.
- **Pairing secant with sine.** $\sec = 1/\cos$ and $\csc = 1/\sin$.
- **Confusing $\cos^{-1}$ with $\sec$.** $\cos^{-1}(0.5) = 60^\circ$ is an angle;
  $\sec 60^\circ = 2$ is a ratio.

## Key points

- Similar right triangles make each side ratio depend only on the angle.
- SOH-CAH-TOA: $\sin = \tfrac{\text{opp}}{\text{hyp}}$, $\cos = \tfrac{\text{adj}}{\text{hyp}}$,
  $\tan = \tfrac{\text{opp}}{\text{adj}}$.
- $\csc$, $\sec$, $\cot$ are the reciprocals of $\sin$, $\cos$, $\tan$.
- $\tan\theta = \sin\theta/\cos\theta$.
- Given one ratio, sketch a triangle, find the third side with the Pythagorean
  theorem, and read off the rest.
