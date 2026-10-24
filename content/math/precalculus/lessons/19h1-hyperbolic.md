---
id: pc-m4-h-hyperbolic
module: pc-m4
title: 'Hyperbolic functions: exponentials in disguise'
minutes: 45
honors: true
topics: [Hyperbolic functions]
drills: [pc-m4-r2-hyperbolic-value, pc-m4-r2-arsinh, pc-m4-r2-catenary]
refs: [pc-ref-exp-log]
---
## Two halves of $e^x$

Lesson 15 made $e^x$ the star of the module, and Lesson 17 showed how to solve equations containing both $e^{2x}$ and $e^x$ by substituting $u = e^x$. This honors lesson combines the two. Adding and subtracting $e^x$ and $e^{-x}$ produces a family of functions, the hyperbolic functions, that behave remarkably like sine and cosine, describe the shape of every hanging cable, and have inverses you can find with nothing more than the quadratic formula and a logarithm. They are standard equipment in calculus, physics and engineering, so it pays to meet them now, while the algebra is fresh.

Recall from Lesson 4 that a function is even if $f(-x) = f(x)$ and odd if $f(-x) = -f(x)$. The function $e^x$ is neither. But it can be split into an even part and an odd part:

$$e^x = \underbrace{\frac{e^x + e^{-x}}{2}}_{\text{even}} + \underbrace{\frac{e^x - e^{-x}}{2}}_{\text{odd}}.$$

Replace $x$ by $-x$ in the first piece and nothing changes; in the second piece the two terms trade places and the sign flips. These two halves get their own names.

## Definitions

The **hyperbolic cosine** and **hyperbolic sine** are

$$\cosh x = \frac{e^x + e^{-x}}{2}, \qquad \sinh x = \frac{e^x - e^{-x}}{2}.$$

(Say "cosh" and "sinch" or "shine".) The **hyperbolic tangent** is their quotient,

$$\tanh x = \frac{\sinh x}{\cosh x} = \frac{e^x - e^{-x}}{e^x + e^{-x}}.$$

A few values come straight from the definitions: $\cosh 0 = \frac{1 + 1}{2} = 1$, $\sinh 0 = 0$, and $\tanh 0 = 0$. Adding the two definitions gives back the starting point, $\cosh x + \sinh x = e^x$, and subtracting gives $\cosh x - \sinh x = e^{-x}$. Those two facts are the quickest way to get from hyperbolic values back to $x$, as Example 1 shows.

## The graphs

```plot
{"x": [-3, 3], "y": [-4, 5], "functions": [{"f": "cosh(x)", "label": "y = cosh x"}, {"f": "sinh(x)", "label": "y = sinh x"}, {"f": "tanh(x)", "label": "y = tanh x"}, {"f": "exp(x)/2", "dashed": true, "label": "y = eˣ/2"}], "points": [{"at": [0, 1], "label": "(0, 1)"}], "caption": "cosh x is even with minimum 1 at x = 0; sinh x is odd and increasing; tanh x stays between −1 and 1. For large x, cosh x and sinh x both hug eˣ/2 (dashed)."}
```

- $\cosh x$ is even, with its lowest point at $(0, 1)$, so its range is $[1, \infty)$. It looks like a parabola near the bottom, but it is not one: far from 0 it grows exponentially.
- $\sinh x$ is odd, passes through the origin, and is increasing everywhere, so it is one-to-one with range all reals.
- $\tanh x$ is odd and increasing, with horizontal asymptotes $y = 1$ and $y = -1$, because for large positive $x$ the $e^{-x}$ terms are negligible and the quotient is nearly $\frac{e^x}{e^x} = 1$.
- For large positive $x$, $e^{-x} \approx 0$, so $\cosh x \approx \sinh x \approx \frac{e^x}{2}$. At $x = 3$, $\cosh 3 \approx 10.068$ and $\sinh 3 \approx 10.018$.

## The fundamental identity

Square the definitions:

$$\cosh^2 x = \frac{e^{2x} + 2 + e^{-2x}}{4}, \qquad \sinh^2 x = \frac{e^{2x} - 2 + e^{-2x}}{4}.$$

(The middle term is $2e^xe^{-x} = 2$.) Subtract, and everything cancels except $\frac{2 - (-2)}{4}$:

$$\cosh^2 x - \sinh^2 x = 1.$$

Compare $\cos^2 t + \sin^2 t = 1$. That identity says the point $(\cos t, \sin t)$ lies on the unit circle $x^2 + y^2 = 1$. The new identity says the point $(\cosh t, \sinh t)$ lies on the **unit hyperbola** $x^2 - y^2 = 1$, and since $\cosh t \ge 1$ it is always on the right-hand branch. That is where the name "hyperbolic" comes from.

![The right branch of the unit hyperbola x² − y² = 1 with its asymptotes y = x and y = −x, the vertex (1, 0), a point P = (cosh t, sinh t) on the curve, and the shaded sector between the x-axis, the segment from the origin to P, and the hyperbola.](images/pc-m4-unit-hyperbola.svg)

The analogy goes one step further. On the unit circle, the sector swept out from $(1, 0)$ to $(\cos t, \sin t)$ has area $\frac t2$. On the unit hyperbola, the shaded sector from $(1, 0)$ to $(\cosh t, \sinh t)$ also has area exactly $\frac t2$. (Proving that takes an integral, so we only state it.) So $t$ is *not* an angle here; it measures area, just as a radian angle does on the circle.

Many trig identities have hyperbolic twins, sometimes with a sign change. Each can be checked by writing everything in exponentials, as we did above.

| Trigonometric | Hyperbolic |
|---|---|
| $\cos^2 x + \sin^2 x = 1$ | $\cosh^2 x - \sinh^2 x = 1$ |
| $\sin 2x = 2\sin x\cos x$ | $\sinh 2x = 2\sinh x\cosh x$ |
| $\cos 2x = \cos^2 x - \sin^2 x$ | $\cosh 2x = \cosh^2 x + \sinh^2 x$ |
| $\cos(-x) = \cos x$, $\sin(-x) = -\sin x$ | $\cosh(-x) = \cosh x$, $\sinh(-x) = -\sinh x$ |
| periodic, bounded | not periodic; $\cosh$ and $\sinh$ unbounded |

Check the double-angle formula for $\sinh$: $2\sinh x\cosh x = 2 \cdot \frac{e^x - e^{-x}}{2} \cdot \frac{e^x + e^{-x}}{2} = \frac{e^{2x} - e^{-2x}}{2} = \sinh 2x$.

### Example 1

Given $\sinh x = \frac34$, find $\cosh x$, $\tanh x$ and $x$ itself.

1. Identity: $\cosh^2 x = 1 + \sinh^2 x = 1 + \frac{9}{16} = \frac{25}{16}$. Since $\cosh x$ is never negative, $\cosh x = \frac54$. (Unlike cosine, there is no sign to decide by quadrant.)
2. Quotient: $\tanh x = \frac{3/4}{5/4} = \frac35$.
3. Add: $e^x = \cosh x + \sinh x = \frac54 + \frac34 = 2$, so $x = \ln 2 \approx 0.6931$.

Check with the definition: $\sinh(\ln 2) = \frac{2 - \frac12}{2} = \frac34$. ✓

## Inverse hyperbolic functions

Because $\sinh$ is one-to-one, it has an inverse, written $\sinh^{-1}$ or **arsinh**. To find a formula, solve $y = \sinh x$ for $x$:

$$y = \frac{e^x - e^{-x}}{2} \implies e^x - e^{-x} = 2y \implies e^{2x} - 2ye^x - 1 = 0,$$

after multiplying by $e^x$. This is an exponential equation of quadratic type (Lesson 17). With $u = e^x$: $u^2 - 2yu - 1 = 0$, and the quadratic formula gives

$$u = y \pm \sqrt{y^2 + 1}.$$

Since $\sqrt{y^2 + 1} > |y|$, the minus sign makes $u$ negative, which is impossible for $e^x$. Keep the plus sign and take $\ln$:

$$\sinh^{-1} y = \ln\left(y + \sqrt{y^2 + 1}\right) \quad \text{for every real } y.$$

The function $\cosh$ is not one-to-one (it is even), so, as with $x^2$ in Lesson 7, we restrict it to $x \ge 0$. The same steps give

$$\cosh^{-1} y = \ln\left(y + \sqrt{y^2 - 1}\right), \quad y \ge 1,$$

the nonnegative solution of $\cosh x = y$; the other solution is its negative. For $\tanh$, solving gives $\tanh^{-1} y = \frac12\ln\dfrac{1 + y}{1 - y}$ for $-1 < y < 1$.

### Example 2

Solve $\cosh x = 2$ exactly, then to four decimal places.

Use $u = e^x$: $\frac{u + 1/u}{2} = 2$, so $u^2 - 4u + 1 = 0$ and $u = 2 \pm \sqrt3$. Both are positive, so both work: $x = \ln(2 + \sqrt3) \approx 1.3170$ or $x = \ln(2 - \sqrt3) \approx -1.3170$. The two answers are negatives of each other, as they must be for an even function. (Indeed $(2 + \sqrt3)(2 - \sqrt3) = 1$, so their logarithms are opposites.) The formula $\cosh^{-1} 2 = \ln(2 + \sqrt 3)$ gives only the positive one.

### Example 3

Solve $3\sinh x - \cosh x = 1$.

Write everything with exponentials and clear the fractions:

$$\frac{3e^x - 3e^{-x}}{2} - \frac{e^x + e^{-x}}{2} = 1 \implies 2e^x - 4e^{-x} = 2 \implies e^x - 2e^{-x} = 1.$$

Multiply by $e^x$: $e^{2x} - e^x - 2 = 0$, so $(e^x - 2)(e^x + 1) = 0$. The factor $e^x = -1$ is impossible, so $e^x = 2$ and $x = \ln 2$. Check: $\sinh(\ln 2) = \frac34$ and $\cosh(\ln 2) = \frac54$, and $3 \cdot \frac34 - \frac54 = 1$. ✓

## Hanging cables: the catenary

Hold a chain by its two ends and let it hang. Its shape looks like a parabola, and Galileo suggested in 1638 that it was close to one. It isn't exactly. In 1691 Leibniz, Christiaan Huygens and Johann Bernoulli each found the true curve, now called a **catenary** (from the Latin *catena*, chain). With the lowest point on the $y$-axis, a uniform flexible cable hangs in the shape

$$y = a\cosh\frac{x}{a} + c,$$

where $a > 0$ is the horizontal tension in the cable divided by its weight per unit length (a tighter cable has a larger $a$ and a flatter curve) and $c$ just shifts the curve up or down. Power lines between towers, a necklace and a spider's silk thread all hang this way. Turned upside down, a catenary is the ideal shape for an arch that stands by compression alone; the Gateway Arch in St. Louis is based on such an inverted catenary, slightly modified because its legs are thicker at the base than at the top.

### Example 4

A cable is strung between two poles 40 m apart. Measured from the ground, with $x = 0$ halfway between the poles, it hangs in the shape $y = 20\cosh\dfrac{x}{20} - 10$ (meters).

1. Lowest point: at $x = 0$, $y = 20\cosh 0 - 10 = 10$ m.
2. Attachment points: at $x = \pm 20$, $y = 20\cosh 1 - 10 \approx 20.86$ m. So the cable sags about $20.86 - 10 = 10.86$ m.
3. Where is the cable 15 m above the ground? Solve $20\cosh\frac x{20} - 10 = 15$, so $\cosh\frac{x}{20} = 1.25$. Then
   $$\frac{x}{20} = \pm\ln\left(1.25 + \sqrt{1.25^2 - 1}\right) = \pm\ln(1.25 + 0.75) = \pm\ln 2,$$
   so $x = \pm 20\ln 2 \approx \pm 13.86$ m: about 6.1 m in from each pole.

A parabola through the same three points (lowest point and both ends) would be $y = 10 + 0.02715x^2$, which at $x = 13.86$ gives about 15.2 m instead of 15 m. The difference is small near the bottom and grows toward the ends, which is why the mistake was so easy to make by eye.

## A brief history of the names

Vincenzo Riccati and Johann Heinrich Lambert developed the hyperbolic functions in the 1750s and 1760s, and their names copy the trig names with an "h" for hyperbolic. Many calculators have a "hyp" key for them, and spreadsheets have `COSH`, `SINH` and `TANH`, so you can check any value in this lesson.

## Common mistakes

- *Writing $\cosh^2 x + \sinh^2 x = 1$.* The hyperbolic identity has a minus sign: $\cosh^2 x - \sinh^2 x = 1$. Test it at $x = 0$: $1 - 0 = 1$.
- *Treating $t$ in $(\cosh t, \sinh t)$ as an angle.* It is twice the area of the hyperbolic sector, not the angle at the origin.
- *Expecting $\cosh x$ to be negative or less than 1.* Its range is $[1, \infty)$, so $\cosh x = 0.5$ has no solution.
- *Losing a solution of $\cosh x = c$.* For $c > 1$ there are two answers, $\pm\cosh^{-1} c$.
- *Keeping the negative root.* In $u = y \pm \sqrt{y^2 + 1}$ the minus sign gives $e^x < 0$, which is impossible.
- *Calling a hanging cable a parabola.* It is a catenary; a parabola is only an approximation near the bottom.

## Key points

- $\cosh x = \frac{e^x + e^{-x}}{2}$ (even, minimum 1), $\sinh x = \frac{e^x - e^{-x}}{2}$ (odd, increasing), $\tanh x = \frac{\sinh x}{\cosh x}$ (between $-1$ and $1$).
- $\cosh x + \sinh x = e^x$ and $\cosh^2 x - \sinh^2 x = 1$, so $(\cosh t, \sinh t)$ lies on the unit hyperbola $x^2 - y^2 = 1$.
- Solve hyperbolic equations by writing them in exponentials and substituting $u = e^x$; reject $u \le 0$.
- $\sinh^{-1} y = \ln\left(y + \sqrt{y^2 + 1}\right)$; $\cosh^{-1} y = \ln\left(y + \sqrt{y^2 - 1}\right)$ for $y \ge 1$.
- A hanging cable is a catenary, $y = a\cosh\frac xa + c$.
