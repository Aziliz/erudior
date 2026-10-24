---
id: pc-m3-h-interpolation
module: pc-m3
honors: true
title: 'Polynomial interpolation: one curve through given points'
minutes: 45
topics: [Polynomial interpolation]
drills: [pc-m3-r2-lagrange, pc-m3-r2-newton-form, pc-m3-r2-secret]
refs: [pc-ref-functions]
---
## From zeros to any points

In Lesson 8 you built a polynomial from its zeros plus one more point: three zeros and a $y$-intercept fixed a cubic. That is a special case of a bigger question. Given some points in the plane, is there a polynomial whose graph passes through all of them, and is there only one?

The answer is one of the cleanest facts in algebra:

> Through $n + 1$ points with different $x$-values there is **exactly one** polynomial of degree at most $n$.

Two points determine a line (degree 1), three points a parabola or a line (degree at most 2), four points a cubic at most, and so on. Finding that polynomial is called **polynomial interpolation**, and the polynomial is the **interpolating polynomial**. It is how calculators draw smooth curves through data, how fonts and animations bend curves, and, surprisingly, how some secrets are kept safe.

## Why there is only one

Uniqueness comes from the factor theorem. A nonzero polynomial of degree at most $n$ has at most $n$ zeros, because each zero $c$ contributes a factor $(x - c)$ and there is room for at most $n$ of them.

Suppose $p$ and $q$ both have degree at most $n$ and both pass through the same $n + 1$ points. Then $p - q$ also has degree at most $n$, and it equals 0 at all $n + 1$ of the $x$-values. A nonzero polynomial cannot have that many zeros, so $p - q$ is the zero polynomial: $p = q$.

This argument says nothing about *finding* the polynomial. For that there are two classic recipes.

## Lagrange's formula

Joseph-Louis Lagrange's idea (published in 1795, though Edward Waring had it in 1779) is to build the answer from pieces that each do one job. For points $(x_0, y_0), (x_1, y_1), (x_2, y_2)$, define

$$L_0(x) = \frac{(x - x_1)(x - x_2)}{(x_0 - x_1)(x_0 - x_2)},\quad L_1(x) = \frac{(x - x_0)(x - x_2)}{(x_1 - x_0)(x_1 - x_2)},\quad L_2(x) = \frac{(x - x_0)(x - x_1)}{(x_2 - x_0)(x_2 - x_1)}.$$

Each **Lagrange basis polynomial** $L_k$ equals 1 at its own point $x_k$ and 0 at the others: the numerator has a zero at every other $x$-value, and the denominator is the numerator's value at $x_k$, so the fraction is 1 there. So

$$p(x) = y_0 L_0(x) + y_1 L_1(x) + y_2 L_2(x)$$

has $p(x_0) = y_0 \cdot 1 + y_1 \cdot 0 + y_2 \cdot 0 = y_0$, and likewise at the other points. With more points, each $L_k$ has one factor for every other point.

### Example 1

Find the polynomial of degree at most 2 through $(-1, 6)$, $(1, 2)$ and $(2, 3)$.

1. Denominators: $L_0$ has $(-1 - 1)(-1 - 2) = 6$; $L_1$ has $(1 + 1)(1 - 2) = -2$; $L_2$ has $(2 + 1)(2 - 1) = 3$.
2. $p(x) = 6 \cdot \dfrac{(x - 1)(x - 2)}{6} + 2 \cdot \dfrac{(x + 1)(x - 2)}{-2} + 3 \cdot \dfrac{(x + 1)(x - 1)}{3}$.
3. Simplify: $(x^2 - 3x + 2) - (x^2 - x - 2) + (x^2 - 1) = x^2 - 2x + 3$.

Check: $p(-1) = 1 + 2 + 3 = 6$, $p(1) = 2$, $p(2) = 3$. ✓

```plot
{"x": [-2, 3.5], "y": [-1.5, 8], "functions": [{"f": "x^2 - 2x + 3", "label": "p(x) = x² − 2x + 3"}, {"f": "(x - 1)*(x - 2)/6", "label": "L₀", "dashed": true}, {"f": "-(x + 1)*(x - 2)/2", "label": "L₁", "dashed": true}, {"f": "(x + 1)*(x - 1)/3", "label": "L₂", "dashed": true}], "points": [{"at": [-1, 6], "label": "(−1, 6)"}, {"at": [1, 2], "label": "(1, 2)"}, {"at": [2, 3], "label": "(2, 3)"}], "caption": "Each dashed basis polynomial is 1 at its own x-value and 0 at the other two; p is 6L₀ + 2L₁ + 3L₂."}
```

Often you only need one value, not the whole polynomial. Then plug the number straight into the basis polynomials. For instance $p(0) = 6 \cdot \tfrac{2}{6} + 2 \cdot \tfrac{-2}{-2} + 3 \cdot \tfrac{-1}{3} = 2 + 2 - 1 = 3$, which matches $x^2 - 2x + 3$ at 0.

## Newton's form: adding a point later

Lagrange's formula has a drawback: add a fourth point and every basis polynomial changes. Newton's approach builds the polynomial one point at a time:

$$p(x) = c_0 + c_1(x - x_0) + c_2(x - x_0)(x - x_1) + c_3(x - x_0)(x - x_1)(x - x_2) + \cdots$$

This is the **Newton form**. Each new term is zero at all the earlier points, so adding it cannot spoil the fit already achieved. Find the coefficients by substituting the points in order; each substitution brings in just one new unknown.

### Example 2

Use the Newton form for the points of Example 1, then add the point $(3, 14)$.

1. $p(x) = c_0 + c_1(x + 1) + c_2(x + 1)(x - 1)$.
2. At $x = -1$: $c_0 = 6$.
3. At $x = 1$: $6 + 2c_1 = 2$, so $c_1 = -2$.
4. At $x = 2$: $6 + 3(-2) + c_2(3)(1) = 3$, so $3c_2 = 3$ and $c_2 = 1$.

So $p(x) = 6 - 2(x + 1) + (x + 1)(x - 1)$, which expands to $x^2 - 2x + 3$ again (by uniqueness, it had to).

Now add $(3, 14)$. Since $p(3) = 6$, the new term must make up the difference $14 - 6 = 8$ at $x = 3$ while vanishing at the other three points:

$$c_3(3 + 1)(3 - 1)(3 - 2) = 8 \implies 8c_3 = 8 \implies c_3 = 1.$$

The cubic through all four points is $x^2 - 2x + 3 + (x + 1)(x - 1)(x - 2) = x^3 - x^2 - 3x + 5$. Check at 3: $27 - 9 - 9 + 5 = 14$. ✓

## An application: sharing a secret

In 1979 Adi Shamir turned uniqueness into a security tool, now called **secret sharing**. Suppose a bank vault code should open only when any 3 of 5 managers combine their information. Choose a random quadratic whose constant term is the secret $S$:

$$p(x) = S + ax + bx^2.$$

Give manager $k$ the point $(k, p(k))$, called a share. Any 3 shares determine the quadratic, and so $S = p(0)$. Two shares are consistent with every possible secret, because through 2 points and any chosen $(0, S)$ there is a quadratic. Real systems do the arithmetic modulo a large prime, which makes two shares reveal truly nothing; ordinary numbers are used here to keep the idea visible, so this version is a simplification.

### Example 3

Three shares are $(1, 52)$, $(2, 68)$ and $(3, 90)$. Find the secret.

We need $p(0)$. The Lagrange basis values at $x = 0$ are

$$L_1(0) = \frac{(0 - 2)(0 - 3)}{(1 - 2)(1 - 3)} = 3,\quad L_2(0) = \frac{(0 - 1)(0 - 3)}{(2 - 1)(2 - 3)} = -3,\quad L_3(0) = \frac{(0 - 1)(0 - 2)}{(3 - 1)(3 - 2)} = 1.$$

So $S = 3(52) - 3(68) + 1(90) = 156 - 204 + 90 = 42$. (The quadratic was $42 + 7x + 3x^2$.) For shares at $x = 1, 2, 3$ the rule $S = 3y_1 - 3y_2 + y_3$ always works.

## A warning: more points is not always better

It is tempting to think that a polynomial through more data points must be a better model. In 1901 Carl Runge showed otherwise. Interpolate $f(x) = \dfrac{1}{1 + 25x^2}$ at 11 equally spaced points from $-1$ to $1$: the degree-10 polynomial matches $f$ exactly at those points, yet between the outer points it swings wildly, reaching almost 2 near $x = \pm 0.94$ where $f$ is below 0.05. This is **Runge's phenomenon**, and adding more equally spaced points makes the swings worse.

```plot
{"x": [-1.05, 1.05], "y": [-0.5, 2.1], "functions": [{"f": "1/(1 + 25x^2)", "label": "f(x) = 1/(1 + 25x²)"}, {"f": "-390625/1768*x^10 + 109375/221*x^8 - 51875/136*x^6 + 54525/442*x^4 - 3725/221*x^2 + 1", "label": "degree-10 interpolant", "dashed": true, "from": -1, "to": 1}], "points": [{"at": [-1, 0.0385]}, {"at": [-0.8, 0.0588]}, {"at": [-0.6, 0.1]}, {"at": [-0.4, 0.2]}, {"at": [-0.2, 0.5]}, {"at": [0, 1]}, {"at": [0.2, 0.5]}, {"at": [0.4, 0.2]}, {"at": [0.6, 0.1]}, {"at": [0.8, 0.0588]}, {"at": [1, 0.0385]}], "caption": "Runge's phenomenon: the interpolant passes through all 11 points but swings to nearly 2 near the ends."}
```

The lesson for modeling (Lesson 19 returns to it): interpolation is exact at the data and can be badly wrong between and beyond it. With noisy data, a low-degree regression curve usually predicts better than a high-degree curve through every point.

## Common mistakes

- *Assuming degree exactly $n$.* Through $n + 1$ points the polynomial has degree *at most* $n$; three points on a line give a line.
- *Repeated $x$-values.* Two points with the same $x$ and different $y$ cannot lie on any function's graph.
- *Dropping a factor in a basis polynomial.* $L_k$ needs one factor $(x - x_j)$ for every *other* point, and the matching denominator.
- *Recomputing everything to add a point.* In Newton form, keep the old coefficients and find only the new one.
- *Trusting a high-degree fit.* Exact at the points is not the same as accurate in between.

## Key points

- $n + 1$ points with distinct $x$-values determine exactly one polynomial of degree at most $n$; uniqueness follows from "degree $n$ means at most $n$ zeros."
- Lagrange: $p(x) = \sum y_k L_k(x)$, where $L_k$ is 1 at $x_k$ and 0 at the other points.
- Newton form: $c_0 + c_1(x - x_0) + c_2(x - x_0)(x - x_1) + \cdots$; solve for the coefficients in order, and add points without redoing earlier work.
- Secret sharing hides a secret as $p(0)$ and hands out points; enough points recover it.
- High-degree interpolation through equally spaced points can oscillate badly (Runge's phenomenon).
