---
id: a2-m3-h-roots-coefficients
module: a2-m3
title: "Roots and coefficients: Vieta's formulas and polynomial identities"
minutes: 45
honors: true
topics: [Vieta's formulas, Polynomial identities]
drills: [a2-m3-r2-vieta, a2-m3-r2-symmetric, a2-m3-r2-missing-root]
refs: [alg-ref-functions]
---
In Module 2 you saw that the roots $r$ and $s$ of $ax^2 + bx + c$ satisfy $r + s = -\tfrac ba$ and $rs = \tfrac ca$. The rational root theorem lesson showed that a polynomial of degree $n$ factors into $n$ linear factors over the complex numbers. Put those two ideas together and you get **Vieta's formulas**: for any degree, the coefficients are simple combinations of the roots. They let you find the sum of the roots, the sum of their squares, or a polynomial whose roots are doubled, all without solving anything.

The tool underneath is the idea of a **polynomial identity**: an equation between two polynomials that holds for every value of the variable. The second half of this lesson shows how to prove identities and how to tell an identity from an ordinary equation.

## Identities and comparing coefficients

An equation like $x^2 - 1 = 3$ is true for some values of $x$ (here $\pm2$) and false for others. An identity like $(x + 1)^2 = x^2 + 2x + 1$ is true for every $x$. To prove an identity, you usually expand or factor one side until it matches the other.

Here's the fact that makes identities so useful:

> **Identity principle**: if two polynomials of degree at most $n$ are equal at more than $n$ different values of $x$, they're equal for all $x$, and their coefficients match term by term.

Why: subtract them. The difference $d(x)$ has degree at most $n$ but more than $n$ zeros. The polynomial functions lesson showed that a nonzero polynomial of degree $n$ has at most $n$ zeros, so $d$ must be the zero polynomial, with every coefficient 0. That means corresponding coefficients of the two polynomials are equal. This step is called **comparing coefficients**.

### Example 1

Find $a$ and $b$ so that $(x - 2)(ax + b) = 3x^2 - 4x - 4$ for all $x$.

1. Expand the left side: $ax^2 + (b - 2a)x - 2b$.
2. Compare coefficients: $x^2$ terms give $a = 3$; constants give $-2b = -4$, so $b = 2$.
3. Check the $x$ terms: $b - 2a = 2 - 6 = -4$. ✓ So $3x^2 - 4x - 4 = (x - 2)(3x + 2)$.

The principle also says when checking numbers *is* a proof. Is $x^3 + 1 = (x + 1)(x^2 - x + 1)$ an identity? Both sides are polynomials of degree at most 3, so agreement at 4 values settles it. At $x = 0, 1, 2, -1$, the left side gives $1, 2, 9, 0$ and the right side gives $1 \cdot 1$, $2 \cdot 1$, $3 \cdot 3$, $0 \cdot 3$: the same four numbers. It's an identity (the sum of cubes). Checking fewer values proves nothing: $(x + 1)^2$ and $x^2 + 1$ agree at $x = 0$, yet they differ everywhere else.

## Vieta's formulas for a cubic

Suppose $ax^3 + bx^2 + cx + d$ has roots $r$, $s$ and $t$ (complex, repeated roots listed as often as their multiplicity). Then it factors as $a(x - r)(x - s)(x - t)$. Expand:

$$a(x - r)(x - s)(x - t) = ax^3 - a(r + s + t)x^2 + a(rs + rt + st)x - a\,rst.$$

This is an identity, so compare coefficients with $ax^3 + bx^2 + cx + d$:

$$r + s + t = -\frac ba, \qquad rs + rt + st = \frac ca, \qquad rst = -\frac da.$$

The three expressions on the left are the sum of the roots, the sum of their products two at a time, and their product. The signs alternate $-, +, -$.

The same expansion works in any degree. For $a_nx^n + a_{n-1}x^{n-1} + \cdots + a_0$:

- the sum of the roots is $-\dfrac{a_{n-1}}{a_n}$;
- the sum of all products of two roots is $\dfrac{a_{n-2}}{a_n}$, of three roots $-\dfrac{a_{n-3}}{a_n}$, and so on with alternating signs;
- the product of all the roots is $(-1)^n\dfrac{a_0}{a_n}$.

The formulas are named for François Viète (Latin name Vieta), a French mathematician of the late 1500s who found cases of them; Albert Girard stated the general pattern in 1629.

### Example 2

Without solving, find the sum, the sum of pairwise products, and the product of the roots of $2x^3 - 5x^2 - 4x + 3$. Then check with the roots.

1. Here $a = 2$, $b = -5$, $c = -4$, $d = 3$.
2. Sum: $-\tfrac{-5}{2} = \tfrac52$. Pairwise products: $\tfrac{-4}{2} = -2$. Product: $-\tfrac32$.
3. Check: the rational root theorem finds the roots $3$, $-1$ and $\tfrac12$. Their sum is $3 - 1 + \tfrac12 = \tfrac52$; pairwise products $-3 + \tfrac32 - \tfrac12 = -2$; product $3 \cdot (-1) \cdot \tfrac12 = -\tfrac32$. ✓

```plot
{"x": [-2, 4], "y": [-12, 10], "functions": [{"f": "2*x^3 - 5*x^2 - 4*x + 3", "label": "y = 2x³ - 5x² - 4x + 3", "from": -1.6, "to": 3.6}], "points": [{"at": [-1, 0]}, {"at": [0.5, 0], "label": "1/2"}, {"at": [3, 0]}], "labels": [{"at": [-1.3, 0.9], "text": "-1"}, {"at": [2.75, 0.9], "text": "3"}], "caption": "The zeros -1, 1/2 and 3 add to 5/2 and multiply to -3/2, as Vieta's formulas predict"}
```

## Symmetric expressions in the roots

A **symmetric expression** in the roots is one that stays the same when any two roots are swapped, like $r^2 + s^2 + t^2$ or $\tfrac1r + \tfrac1s + \tfrac1t$. Every symmetric polynomial expression can be rewritten using the three Vieta quantities, so you can evaluate it straight from the coefficients, even when the roots are ugly irrational numbers. Two useful rewrites:

$$r^2 + s^2 + t^2 = (r + s + t)^2 - 2(rs + rt + st),$$

which comes from expanding $(r + s + t)^2 = r^2 + s^2 + t^2 + 2(rs + rt + st)$, and

$$\frac1r + \frac1s + \frac1t = \frac{st + rt + rs}{rst},$$

from a common denominator (when no root is 0).

### Example 3

Let $r$, $s$, $t$ be the roots of $x^3 - 4x^2 + x + 5$. Find $r^2 + s^2 + t^2$ and $\tfrac1r + \tfrac1s + \tfrac1t$.

1. Vieta: $r + s + t = 4$, $rs + rt + st = 1$, $rst = -5$.
2. $r^2 + s^2 + t^2 = 4^2 - 2(1) = 14$.
3. $\tfrac1r + \tfrac1s + \tfrac1t = \tfrac{1}{-5} = -\tfrac15$.

The roots are about $-0.912$, $1.714$ and $3.199$, and a calculator confirms both answers. Vieta got them exactly, with no decimals at all.

A sum of squares can even tell you something about the roots. For $x^3 - 2x^2 + 3x - 4$, the same rewrite gives $r^2 + s^2 + t^2 = 2^2 - 2(3) = -2$. Squares of real numbers can't add to a negative number, so not all the roots are real. (One is real; the other two are a conjugate pair.)

### Example 4

The roots of $x^3 - 6x^2 + kx - 6$ form an arithmetic sequence. Find $k$ and the roots.

1. Write the roots as $m - e$, $m$, $m + e$. Their sum is $3m$, and Vieta says it's 6, so $m = 2$.
2. So 2 is a root: $8 - 24 + 2k - 6 = 0$, giving $k = 11$.
3. Divide by $x - 2$: $x^3 - 6x^2 + 11x - 6 = (x - 2)(x^2 - 4x + 3) = (x - 1)(x - 2)(x - 3)$. The roots $1, 2, 3$ are indeed evenly spaced, and their product $6$ matches $-\tfrac{-6}{1}$. ✓

### Example 5

Find a cubic whose roots are twice the roots of $x^3 - 4x^2 + x + 5$.

1. The new roots $2r, 2s, 2t$ have sum $2(4) = 8$, pairwise products $4(rs + rt + st) = 4$, and product $8rst = -40$.
2. With leading coefficient 1, Vieta in reverse gives $x^3 - 8x^2 + 4x - (-40)$, that is, $x^3 - 8x^2 + 4x + 40$.

A second way: $y$ is a new root exactly when $\tfrac y2$ is an old one, so substitute $\tfrac x2$ for $x$: $\left(\tfrac x2\right)^3 - 4\left(\tfrac x2\right)^2 + \tfrac x2 + 5$. Multiply by 8 to clear fractions: $x^3 - 8x^2 + 4x + 40$. Both methods agree.

## Proving identities: Pythagorean triples

Identities can prove facts about whole numbers too. A **Pythagorean triple** is a set of three positive integers $a$, $b$, $c$ with $a^2 + b^2 = c^2$, such as 3, 4, 5. Here's a way to make as many as you like.

### Example 6

Prove that $(m^2 - n^2)^2 + (2mn)^2 = (m^2 + n^2)^2$ for all $m$ and $n$, and use it to make triples.

1. Expand the left side: $m^4 - 2m^2n^2 + n^4 + 4m^2n^2 = m^4 + 2m^2n^2 + n^4$.
2. That's the perfect square $(m^2 + n^2)^2$. The identity holds for every $m$ and $n$.
3. So for whole numbers $m > n > 0$, the numbers $m^2 - n^2$, $2mn$, $m^2 + n^2$ always form a Pythagorean triple:

| $m$ | $n$ | $m^2 - n^2$ | $2mn$ | $m^2 + n^2$ |
|---|---|---|---|---|
| 2 | 1 | 3 | 4 | 5 |
| 3 | 2 | 5 | 12 | 13 |
| 4 | 1 | 15 | 8 | 17 |
| 4 | 3 | 7 | 24 | 25 |

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 3]]}], "rightAngles": [[[4, 0], [0, 0], [4, 3]]], "segments": [{"from": [0, 0], "to": [4, 0], "label": "2mn = 4"}, {"from": [4, 0], "to": [4, 3], "label": "m² - n² = 3"}, {"from": [4, 3], "to": [0, 0], "label": "m² + n² = 5"}], "caption": "The triple from m = 2, n = 1: legs m² - n² and 2mn, hypotenuse m² + n²"}
```

This recipe is often called Euclid's formula, since a version of it appears in Euclid's *Elements* (about 300 BCE). Checking a few triples numerically would only show that it works for those numbers; the algebra proves it works for all of them.

## Common mistakes

- Sign slips in Vieta's formulas. For a cubic the signs go $-, +, -$: the sum is $-\tfrac ba$, not $\tfrac ba$, and the product is $-\tfrac da$.
- Forgetting to divide by the leading coefficient when it isn't 1.
- Writing $r^2 + s^2 + t^2 = (r + s + t)^2$. Squaring a sum produces the cross terms $2(rs + rt + st)$, which must be subtracted.
- Treating a few numerical checks as a proof of an identity. Only more checks than the degree count as proof; otherwise, expand.
- Confusing an identity with an equation. $x^2 - 1 = 3$ is solved; $(x + 1)(x - 1) = x^2 - 1$ is proved.

## Key points

- Two polynomials of degree at most $n$ that agree at more than $n$ values are identical, so their coefficients match.
- Cubic $ax^3 + bx^2 + cx + d$ with roots $r, s, t$: $r + s + t = -\tfrac ba$, $rs + rt + st = \tfrac ca$, $rst = -\tfrac da$.
- In degree $n$, the sum of the roots is $-\tfrac{a_{n-1}}{a_n}$ and the product is $(-1)^n\tfrac{a_0}{a_n}$.
- Symmetric expressions such as $r^2 + s^2 + t^2 = (r + s + t)^2 - 2(rs + rt + st)$ can be found from the coefficients alone.
- $(m^2 - n^2)^2 + (2mn)^2 = (m^2 + n^2)^2$ generates Pythagorean triples.
