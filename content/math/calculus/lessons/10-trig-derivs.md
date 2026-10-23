---
id: calc-trig-derivs
module: calc-m3
title: Derivatives of trigonometric functions
minutes: 25
topics: [Trig derivatives]
drills: [calc-d-trig-deriv, calc-d-trig-tangent]
refs: [calc-ref-derivatives]
---
## Where we are

We can differentiate powers, exponentials, and products and quotients of them. Trigonometric functions model anything periodic: springs, tides, alternating current, seasons. This lesson derives the derivatives of all six trig functions. Everything rests on the two special limits from Lesson 4, which is why angles must be in radians.

## The derivative of sine

Use the definition and the sine addition formula $\sin(x + h) = \sin x\cos h + \cos x\sin h$:

$$\frac{\sin(x + h) - \sin x}{h} = \sin x\cdot\frac{\cos h - 1}{h} + \cos x\cdot\frac{\sin h}{h}.$$

As $h\to0$, $\frac{\cos h - 1}{h} \to 0$ and $\frac{\sin h}{h} \to 1$. So

$$\frac{d}{dx}\sin x = \cos x.$$

The graph agrees. Where $\sin x$ peaks ($x = \pi/2$) its slope is 0, and $\cos(\pi/2) = 0$. Where $\sin x$ crosses zero going up ($x = 0$) its slope is steepest, 1, and $\cos 0 = 1$.

```plot
{"x": [-1, 7], "y": [-1.6, 1.6], "functions": [{"f": "sin(x)", "label": "sin x"}, {"f": "cos(x)", "dashed": true, "label": "cos x"}], "tangents": [{"f": "sin(x)", "at": 0}, {"f": "sin(x)", "at": 1.5708}], "caption": "The slope of sin x at each point is the height of cos x"}
```

The same method with $\cos(x + h) = \cos x\cos h - \sin x\sin h$ gives

$$\frac{d}{dx}\cos x = -\sin x.$$

The minus sign makes sense: just after $x = 0$, cosine is falling from its peak, and $-\sin x$ is negative there.

## The other four

Write each in terms of sine and cosine and use the quotient rule.

*Tangent.* $\tan x = \dfrac{\sin x}{\cos x}$:
$$\frac{d}{dx}\tan x = \frac{\cos x\cdot\cos x - \sin x\cdot(-\sin x)}{\cos^2 x} = \frac{\cos^2 x + \sin^2 x}{\cos^2 x} = \frac{1}{\cos^2x} = \sec^2 x.$$

*Secant.* $\sec x = \dfrac{1}{\cos x}$:
$$\frac{d}{dx}\sec x = \frac{0\cdot\cos x - 1\cdot(-\sin x)}{\cos^2 x} = \frac{\sin x}{\cos^2 x} = \frac{1}{\cos x}\cdot\frac{\sin x}{\cos x} = \sec x\tan x.$$

Cotangent and cosecant work the same way. The full table:

| $f(x)$ | $f'(x)$ | | $f(x)$ | $f'(x)$ |
|---|---|---|---|---|
| $\sin x$ | $\cos x$ | | $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2 x$ | | $\cot x$ | $-\csc^2 x$ |
| $\sec x$ | $\sec x\tan x$ | | $\csc x$ | $-\csc x\cot x$ |

A memory aid: the "co-" functions on the right are the mirror images of the left column, with a co- added to everything and a minus sign in front.

### Example 1

Differentiate $y = x^2\sin x$.

Product rule: $y' = 2x\sin x + x^2\cos x$.

### Example 2

Differentiate $y = \dfrac{\sec x}{1 + \tan x}$.

Quotient rule with hi $= \sec x$, lo $= 1 + \tan x$:
$$y' = \frac{\sec x\tan x(1 + \tan x) - \sec x\cdot\sec^2 x}{(1 + \tan x)^2}.$$
Factor $\sec x$ from the top and use $\sec^2 x = 1 + \tan^2 x$:
$$\sec x\left(\tan x + \tan^2 x - 1 - \tan^2 x\right) = \sec x(\tan x - 1).$$
So $y' = \dfrac{\sec x(\tan x - 1)}{(1 + \tan x)^2}$.

### Example 3

Find the tangent line to $y = \tan x$ at $x = \pi/4$.

$y(\pi/4) = 1$ and $y' = \sec^2 x$, so $y'(\pi/4) = \left(\sqrt2\right)^2 = 2$. Tangent: $y - 1 = 2\left(x - \frac\pi4\right)$, i.e. $y = 2x + 1 - \frac\pi2$.

## Higher derivatives cycle

The derivatives of $\sin x$ repeat every four steps:

$$\sin x \to \cos x \to -\sin x \to -\cos x \to \sin x \to \cdots$$

![Four boxes in a cycle joined by arrows labeled d/dx: sin x to cos x, cos x to −sin x, −sin x to −cos x, and −cos x back to sin x](images/calc-m3-trig-cycle.svg)

So $\frac{d^n}{dx^n}\sin x$ depends only on $n \bmod 4$. For example, $\frac{d^{27}}{dx^{27}}\sin x$: $27 = 4\cdot6 + 3$, so it's the third derivative, $-\cos x$.

### Example 4 (simple harmonic motion)

A mass on a spring has position $s(t) = 4\cos t$ cm ($t$ in seconds). Find its velocity and acceleration, and describe the motion at $t = \pi/2$.

- $v(t) = -4\sin t$, $a(t) = -4\cos t$.
- At $t = \pi/2$: $s = 0$ (passing through the rest position), $v = -4$ cm/s (moving down at top speed), $a = 0$.

Notice $a(t) = -s(t)$: the acceleration always points back toward the rest position, in proportion to the displacement. That's the signature of a spring (Hooke's law).

```plot
{"x": [0, 7], "y": [-5, 5], "functions": [{"f": "4cos(x)", "label": "s(t)"}, {"f": "-4sin(x)", "dashed": true, "label": "v(t)"}], "xLabel": "t", "caption": "Position and velocity of the spring: v = 0 at the turning points"}
```

### Example 5

On $[0, 2\pi]$, where does $y = \sin x + \cos x$ have horizontal tangent lines? What is the tangent line at $x = \frac\pi2$?

$y' = \cos x - \sin x$. Setting $y' = 0$ gives $\sin x = \cos x$, i.e. $\tan x = 1$, so $x = \frac\pi4$ and $x = \frac{5\pi}{4}$. At those points $y = \sqrt2$ and $y = -\sqrt2$: the curve's highest and lowest points.

At $x = \frac\pi2$: $y = 1 + 0 = 1$ and $y' = 0 - 1 = -1$. The tangent line is $y - 1 = -\left(x - \frac\pi2\right)$, or $y = -x + 1 + \frac\pi2$.

(The identity $\sin x + \cos x = \sqrt2\sin\left(x + \frac\pi4\right)$ confirms the maximum value $\sqrt2$.)

## Common mistakes

- **Sign of $\frac{d}{dx}\cos x$.** It's $-\sin x$. Every co- function's derivative has a minus.
- *Degrees.* $\frac{d}{dx}\sin x = \cos x$ only in radians. In degrees, $\frac{d}{dx}\sin(x^\circ) = \frac{\pi}{180}\cos(x^\circ)$.
- **$\frac{d}{dx}\tan x = \sec x$.** It's $\sec^2 x$.
- **Confusing $\sin^2 x$ with $\sin(x^2)$.** They need different rules (Lesson 11).
- *Losing a trig identity.* $\sin^2 x + \cos^2 x = 1$ and $1 + \tan^2 x = \sec^2 x$ simplify most answers.

## Key points

- $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, from the limits $\frac{\sin h}{h}\to1$, $\frac{\cos h - 1}{h}\to0$.
- $(\tan x)' = \sec^2 x$, $(\sec x)' = \sec x\tan x$, $(\cot x)' = -\csc^2 x$, $(\csc x)' = -\csc x\cot x$.
- Derivatives of sine and cosine cycle with period 4.
- All of this requires radians.
