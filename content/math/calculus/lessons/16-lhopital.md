---
id: calc-lhopital
module: calc-m4
title: L'Hôpital's rule and indeterminate forms
minutes: 35
topics: [L'Hôpital's rule]
drills: [calc-d-lhopital, calc-d-lhopital-exp]
refs: [calc-ref-limits]
---
## Back to limits, with new tools

Module 1 handled $0/0$ limits by algebra: factoring, conjugates, the special trig limits. But some limits resist algebra completely, like $\lim_{x\to0}\frac{e^x - 1 - x}{x^2}$ or $\lim_{x\to\infty}\frac{\ln x}{\sqrt x}$. Derivatives give a general method: L'Hôpital's rule.

## The rule

**L'Hôpital's rule.** Suppose $f$ and $g$ are differentiable near $a$ (except possibly at $a$), $g'(x) \ne 0$ near $a$, and

$$\lim_{x\to a}\frac{f(x)}{g(x)} \text{ has the form } \frac00 \text{ or } \frac{\pm\infty}{\pm\infty}.$$

Then

$$\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)},$$

provided the limit on the right exists (or is $\pm\infty$). The same holds for one-sided limits and for $a = \pm\infty$.

Note: it's the derivative of the top over the derivative of the bottom, taken *separately*. It is not the quotient rule.

**Why it works (the $0/0$ case with $f(a) = g(a) = 0$).** Near $a$, each function is close to its tangent line: $f(x) \approx f'(a)(x - a)$ and $g(x) \approx g'(a)(x - a)$. So
$$\frac{f(x)}{g(x)} \approx \frac{f'(a)(x - a)}{g'(a)(x - a)} = \frac{f'(a)}{g'(a)}.$$
When two functions both hit zero, their ratio is governed by how fast each one is heading to zero, which is their slopes. (A complete proof uses Cauchy's mean value theorem.)

### Example 1

Find $\displaystyle\lim_{x\to0}\frac{e^x - 1 - x}{x^2}$.

Check the form: at $x = 0$, top $= 1 - 1 - 0 = 0$, bottom $= 0$. It's $0/0$.

Apply the rule: $\displaystyle\lim_{x\to0}\frac{e^x - 1}{2x}$. Still $0/0$, so apply it again: $\displaystyle\lim_{x\to0}\frac{e^x}{2} = \mathbf{\frac12}$.

You may repeat the rule as long as each new limit is still indeterminate. Check the form *every* time.

### Example 2

Find $\displaystyle\lim_{x\to\infty}\frac{\ln x}{\sqrt x}$.

Form $\infty/\infty$. Differentiate top and bottom:
$$\lim_{x\to\infty}\frac{1/x}{1/(2\sqrt x)} = \lim_{x\to\infty}\frac{2\sqrt x}{x} = \lim_{x\to\infty}\frac{2}{\sqrt x} = \mathbf 0.$$

So $\sqrt x$ grows faster than $\ln x$. The same argument shows $\ln x$ loses to every positive power $x^p$, and repeated application shows $x^n$ loses to $e^x$: $\lim_{x\to\infty}\frac{x^n}{e^x} = \lim\frac{n!}{e^x} = 0$ after $n$ steps. These are the growth rates quoted in Lesson 3.

## Check the form first

L'Hôpital's rule applied to a non-indeterminate limit gives wrong answers. Example: $\lim_{x\to0}\frac{x + 1}{x + 2} = \frac12$ by substitution. Blindly differentiating gives $\frac11 = 1$, which is wrong.

## Other indeterminate forms

Five more forms reduce to $0/0$ or $\infty/\infty$.

| Form | Strategy |
|---|---|
| $0\cdot\infty$ | Rewrite $fg$ as $\dfrac{f}{1/g}$ or $\dfrac{g}{1/f}$ |
| $\infty - \infty$ | Combine into one fraction (common denominator, conjugate) |
| $1^\infty$, $0^0$, $\infty^0$ | Let $y = f^g$, take $\ln y = g\ln f$ (a $0\cdot\infty$ form), find its limit $L$; then the answer is $e^L$ |

### Example 3 ($0\cdot\infty$)

Find $\displaystyle\lim_{x\to0^+}x\ln x$.

As $x \to 0^+$, $x \to 0$ and $\ln x \to -\infty$. Rewrite: $x\ln x = \dfrac{\ln x}{1/x}$, now $\frac{-\infty}{\infty}$.
$$\lim_{x\to0^+}\frac{1/x}{-1/x^2} = \lim_{x\to0^+}(-x) = \mathbf 0.$$

(Putting $\ln x$ downstairs instead, $\frac{x}{1/\ln x}$, makes the derivatives messier. Choose the version whose derivatives simplify.)

### Example 4 ($1^\infty$)

Find $\displaystyle\lim_{x\to\infty}\left(1 + \frac3x\right)^x$.

The base tends to 1 and the exponent to $\infty$. Let $y = \left(1 + \frac3x\right)^x$, so
$$\ln y = x\ln\left(1 + \frac3x\right) = \frac{\ln(1 + 3/x)}{1/x} \quad\left(\tfrac00\right).$$
L'Hôpital: $\dfrac{\frac{1}{1 + 3/x}\cdot\left(-\frac{3}{x^2}\right)}{-\frac{1}{x^2}} = \dfrac{3}{1 + 3/x} \to 3$.

So $\ln y \to 3$ and $y \to \mathbf{e^3}$. In general $\left(1 + \frac ax\right)^x \to e^a$, the continuous compounding formula.

### Example 5 ($\infty - \infty$)

Find $\displaystyle\lim_{x\to0^+}\left(\frac1x - \frac{1}{\sin x}\right)$.

Combine: $\dfrac{\sin x - x}{x\sin x}$, form $0/0$.
- L'Hôpital: $\dfrac{\cos x - 1}{\sin x + x\cos x}$, still $0/0$.
- Again: $\dfrac{-\sin x}{2\cos x - x\sin x} \to \dfrac{0}{2} = \mathbf 0$.

### Example 6 ($0^0$)

Find $\displaystyle\lim_{x\to0^+}x^x$.

$\ln y = x\ln x \to 0$ (Example 3), so $y \to e^0 = \mathbf 1$.

## When L'Hôpital doesn't help

Sometimes the rule cycles forever: for $\lim_{x\to\infty}\frac{\sqrt{x^2 + 1}}{x}$, each application flips the fraction upside down. Algebra (divide by $x$) gives 1 instantly. And if $\lim\frac{f'}{g'}$ doesn't exist, the rule says nothing: $\lim_{x\to\infty}\frac{x + \sin x}{x} = 1$, but $\frac{1 + \cos x}{1}$ oscillates. L'Hôpital is a tool, not a replacement for algebra.

### Example 7 (two more)

Find $\displaystyle\lim_{x\to0}\frac{x - \sin x}{x^3}$ and $\displaystyle\lim_{x\to\infty}x^{1/x}$.

- $\frac00$ three times in a row: $\dfrac{1 - \cos x}{3x^2} \to \dfrac{\sin x}{6x} \to \dfrac{\cos x}{6} \to \mathbf{\dfrac16}$. (On the second line you could also use $\frac{\sin x}{x} \to 1$.)
- The form is $\infty^0$. Let $y = x^{1/x}$, so $\ln y = \dfrac{\ln x}{x}$, which is $\frac\infty\infty$; L'Hôpital gives $\dfrac{1/x}{1} \to 0$. So $y \to e^0 = \mathbf 1$.

The first result says $\sin x \approx x - \frac{x^3}{6}$ for small $x$, a preview of Taylor series (Lesson 44).

## A quick checklist

Before applying the rule, ask three questions. Is the form really $\frac00$ or $\frac\infty\infty$? (If not, rewrite it or substitute.) Would algebra be faster (dividing by the highest power, factoring, a known limit)? After differentiating, is the new limit simpler? If the new quotient is messier than the old one, step back and rewrite the original, for example by moving a factor into the denominator as its reciprocal.

## Common mistakes

- *Applying the rule without an indeterminate form.*
- *Using the quotient rule.* Differentiate numerator and denominator separately.
- *Forgetting to exponentiate* in $1^\infty$, $0^0$, $\infty^0$ problems: the limit of $\ln y$ is not the answer.
- **Calling $1^\infty$ equal to 1.** It's indeterminate: $(1 + 3/x)^x \to e^3$.
- **Applying the rule to $0\cdot\infty$ directly.** Rewrite as a quotient first.

## Key points

- For $\frac00$ or $\frac\infty\infty$: $\lim\frac fg = \lim\frac{f'}{g'}$ if the latter exists.
- Check the form before each application.
- $0\cdot\infty$: rewrite as a quotient. $\infty - \infty$: combine. $1^\infty$, $0^0$, $\infty^0$: take logs, then exponentiate.
- Growth: $\ln x \ll x^p \ll e^x$ as $x\to\infty$.
