---
id: calc-squeeze-epsilon
module: calc-m1
title: The squeeze theorem, trig limits and ε-δ
minutes: 35
topics: [Squeeze theorem, Formal limit definition]
drills: [calc-d-limit-trig, calc-d-epsilon-delta]
refs: [calc-ref-limits]
---
## Where this fits

The algebra tricks of Lesson 2 fail on expressions like $\dfrac{\sin x}{x}$ or $x^2\sin(1/x)$: there's nothing to factor. This lesson adds a new tool, the squeeze theorem, uses it to prove the most important trig limit, and then makes the word "close" precise with the formal ε-δ definition. The formal definition is a college Calculus I topic; AP students can treat the last section as background.

## The squeeze theorem

**Squeeze theorem** (also called the sandwich theorem): suppose that for all $x$ near $a$ (except possibly at $a$)

$$g(x) \le f(x) \le h(x),$$

and $\lim_{x\to a} g(x) = \lim_{x\to a} h(x) = L$. Then $\lim_{x\to a} f(x) = L$.

Why: $f$ is trapped between two functions that both close in on $L$, so $f$ has nowhere else to go. The skill is finding the two bounding functions. Bounded factors like $\sin$ and $\cos$ (always between $-1$ and $1$) are the usual source.

### Example 1

Find $\displaystyle\lim_{x\to 0} x^2\sin\!\left(\frac1x\right)$.

$\sin(1/x)$ oscillates wildly and has no limit at 0, so the product law is useless. But for every $x \ne 0$,

$$-1 \le \sin\!\left(\tfrac1x\right) \le 1 \quad\Longrightarrow\quad -x^2 \le x^2\sin\!\left(\tfrac1x\right) \le x^2$$

(multiplying by $x^2 \ge 0$ keeps the inequalities pointing the same way). Both $-x^2$ and $x^2$ tend to 0, so the squeeze theorem gives a limit of **0**.

```plot
{"x": [-0.5, 0.5], "y": [-0.25, 0.25], "functions": [{"f": "x^2", "dashed": true, "label": "y = x²"}, {"f": "-x^2", "dashed": true, "label": "y = −x²"}, {"f": "x^2 sin(1/x)"}], "caption": "x² sin(1/x) is trapped between −x² and x²"}
```

## The key trig limit

$$\lim_{\theta\to 0}\frac{\sin\theta}{\theta} = 1 \qquad (\theta \text{ in radians}).$$

*Why it's true.* Take $0 < \theta < \pi/2$ on the unit circle. Compare three areas: the triangle with vertices $(0,0)$, $(1,0)$, $(\cos\theta, \sin\theta)$, the circular sector of angle $\theta$, and the larger right triangle with legs 1 and $\tan\theta$:

$$\frac12\sin\theta \;\le\; \frac12\theta \;\le\; \frac12\tan\theta.$$

The middle term uses the sector area formula $\frac12 r^2\theta$, which is exactly where radians are needed. Divide everything by $\frac12\sin\theta > 0$ and take reciprocals (flipping the inequalities):

$$\cos\theta \le \frac{\sin\theta}{\theta} \le 1.$$

As $\theta \to 0^+$, $\cos\theta \to 1$, so the squeeze theorem gives 1. The function $\frac{\sin\theta}{\theta}$ is even, so the left side matches.

```shape
{"circles": [{"center": [0, 0], "r": 1}], "polygons": [{"points": [[0, 0], [1, 0], [0.766, 0.643]]}, {"points": [[0, 0], [1, 0], [1, 0.839]], "fill": false}], "segments": [{"from": [0.766, 0.643], "to": [0.766, 0], "dashed": true}], "labels": [{"at": [0.25, 0.08], "text": "θ"}, {"at": [1.05, 0.42], "text": "tan θ"}, {"at": [0.55, 0.3], "text": "sin θ"}], "caption": "Small triangle ≤ sector ≤ large triangle"}
```

A companion limit follows from it:

$$\lim_{\theta\to0}\frac{1 - \cos\theta}{\theta} = 0.$$

(Multiply by $\frac{1 + \cos\theta}{1 + \cos\theta}$ to get $\frac{\sin^2\theta}{\theta(1 + \cos\theta)} = \frac{\sin\theta}{\theta}\cdot\frac{\sin\theta}{1 + \cos\theta} \to 1\cdot\frac02 = 0$.)

## Using the trig limit

The pattern is "sine of a thing over the same thing." Rearrange until you see it.

### Example 2

Find $\displaystyle\lim_{x\to 0}\frac{\sin 5x}{3x}$.

We need $5x$ in the denominator to match $\sin 5x$:

$$\frac{\sin 5x}{3x} = \frac{5}{3}\cdot\frac{\sin 5x}{5x}.$$

As $x \to 0$, $u = 5x \to 0$ too, so $\frac{\sin 5x}{5x} \to 1$. The limit is $\mathbf{\tfrac53}$.

In general, $\displaystyle\lim_{x\to0}\frac{\sin ax}{bx} = \frac ab$.

### Example 3

Find $\displaystyle\lim_{x\to0}\frac{\tan 2x}{x}$.

Write $\tan 2x = \dfrac{\sin 2x}{\cos 2x}$:

$$\frac{\tan 2x}{x} = \frac{\sin 2x}{x}\cdot\frac{1}{\cos 2x} = 2\cdot\frac{\sin 2x}{2x}\cdot\frac{1}{\cos 2x} \to 2\cdot 1\cdot 1 = \mathbf 2.$$

## The formal definition of a limit

"Close" has been informal. Here is the precise version, due to Cauchy and Weierstrass.

**ε-δ definition:** $\displaystyle\lim_{x\to a} f(x) = L$ means: for every $\varepsilon > 0$ there is a $\delta > 0$ such that

$$0 < |x - a| < \delta \implies |f(x) - L| < \varepsilon.$$

Read it as a challenge game. A skeptic names a tolerance $\varepsilon$ for the output ("get within 0.001 of $L$"). You must answer with a tolerance $\delta$ for the input such that *every* $x$ within $\delta$ of $a$ (other than $a$ itself, that's the $0 <$ part) lands within $\varepsilon$ of $L$. The limit is $L$ if you can win no matter how small $\varepsilon$ is.

```plot
{"x": [0, 4], "y": [0, 9], "functions": [{"f": "2x + 1"}, {"f": "5.6", "dashed": true}, {"f": "4.4", "dashed": true}], "segments": [{"from": [1.7, 0], "to": [1.7, 9], "dashed": true}, {"from": [2.3, 0], "to": [2.3, 9], "dashed": true}], "points": [{"at": [2, 5], "label": "(2, 5)"}], "caption": "ε-band around L = 5 (horizontal) and δ-band around a = 2 (vertical)"}
```

### Example 4

Prove $\displaystyle\lim_{x\to 2}(3x - 1) = 5$ and find $\delta$ for $\varepsilon = 0.06$.

*Scratch work.* We want $|(3x - 1) - 5| < \varepsilon$. Simplify: $|3x - 6| = 3|x - 2| < \varepsilon$ exactly when $|x - 2| < \varepsilon/3$. So choose $\delta = \varepsilon/3$.

*Proof.* Given $\varepsilon > 0$, let $\delta = \varepsilon/3$. If $0 < |x - 2| < \delta$, then
$$|(3x - 1) - 5| = 3|x - 2| < 3\delta = \varepsilon.$$
That's what the definition demands. For $\varepsilon = 0.06$, $\delta = 0.02$ works (any smaller positive $\delta$ works too).

For a linear function $mx + b$ the answer is always $\delta = \varepsilon/|m|$: steeper lines need tighter input windows.

### Example 5 (a nonlinear case)

Show $\lim_{x\to 3} x^2 = 9$.

We need $|x^2 - 9| = |x - 3|\,|x + 3| < \varepsilon$. The factor $|x + 3|$ varies, so first restrict $\delta \le 1$. Then $2 < x < 4$, which gives $|x + 3| < 7$. So $|x^2 - 9| < 7|x - 3|$, and that's below $\varepsilon$ once $|x - 3| < \varepsilon/7$. Choose $\delta = \min(1, \varepsilon/7)$.

## Common mistakes

- *Squeezing with the wrong inequality direction.* Multiplying by a negative flips inequalities; $x^2$ is safe, $x$ is not (use $|x|$ bounds instead: $-|x| \le x\sin(1/x) \le |x|$).
- *Matching the wrong argument.* $\dfrac{\sin 5x}{x} \to 5$, not 1. The thing inside the sine must match the denominator.
- *Degrees.* $\sin\theta/\theta \to 1$ needs radians.
- *ε-δ backward.* δ depends on ε, not the other way. You're given ε; you choose δ.
- **Forgetting $0 < |x - a|$.** The point $x = a$ is excluded, just as in the informal definition.

## Key points

- Squeeze: $g \le f \le h$ near $a$ with $g, h \to L$ forces $f \to L$.
- $\lim_{\theta\to 0}\frac{\sin\theta}{\theta} = 1$ and $\lim_{\theta\to0}\frac{1 - \cos\theta}{\theta} = 0$ (radians).
- $\lim_{x\to 0}\frac{\sin ax}{bx} = \frac ab$.
- ε-δ: for every $\varepsilon > 0$ there's a $\delta > 0$ with $0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon$.
- For $f(x) = mx + b$, $\delta = \varepsilon/|m|$ works.
