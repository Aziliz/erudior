---
id: alg-m2-h-tolerance
module: alg-m2
title: 'Honors: Tolerance, error bounds and the triangle inequality'
minutes: 45
honors: true
topics: [Tolerance and error]
drills: [alg-m2-r2-interval-to-abs, alg-m2-r2-error-bound]
refs: [alg-ref-equations]
---
Lesson 7 read $|x - c| \le r$ as "$x$ is within $r$ units of $c$." That sentence is how engineers write tolerances on machine parts, how scientists report measurement error, and how calculus defines a limit. This lesson works in the other direction too: starting from an interval and writing the absolute value inequality, then asking how an error in one quantity spreads to the quantities computed from it. It ends with the **triangle inequality**, the rule that tells you how errors combine when you add or subtract measurements.

## From an interval to an absolute value

Every interval with two endpoints can be written as "within some distance of its middle." For the interval from $a$ to $b$, the **midpoint** and **half-width** are

$$m = \frac{a + b}{2}, \qquad h = \frac{b - a}{2}.$$

The midpoint is the average of the endpoints, and the half-width is half the length. Then $a = m - h$ and $b = m + h$, so

$$a \le x \le b \iff |x - m| \le h.$$

The same works with strict symbols ($a < x < b \iff |x - m| < h$), and the outside of the interval is the "greater than" form: $x < a$ or $x > b$ exactly when $|x - m| > h$.

### Example 1

(a) A thermostat keeps a room between 66°F and 74°F. Write this with an absolute value.

The midpoint is $\tfrac{66 + 74}{2} = 70$ and the half-width is $\tfrac{74 - 66}{2} = 4$, so $|T - 70| \le 4$: the temperature stays within 4 degrees of 70.

(b) Write $-3 < x < 8$ with an absolute value, using whole numbers only.

The midpoint is $\tfrac{-3 + 8}{2} = 2.5$ and the half-width is $\tfrac{8 - (-3)}{2} = 5.5$, so $|x - 2.5| < 5.5$. To clear the decimals, multiply both sides by 2, using $2|x - 2.5| = |2x - 5|$: the inequality becomes $|2x - 5| < 11$. Check by solving it: $-11 < 2x - 5 < 11$ gives $-6 < 2x < 16$, so $-3 < x < 8$.

```numberline
{"x": [-5, 10], "points": [{"at": [-3, 0], "open": true, "label": "-3"}, {"at": [8, 0], "open": true, "label": "8"}, {"at": [2.5, 0], "label": "2.5"}], "segments": [{"from": [-3, 0], "to": [8, 0]}], "caption": "-3 < x < 8 is the set within 5.5 of the midpoint 2.5"}
```

## Tolerances

A part made to a nominal size is never exactly that size. A drawing that says a shaft is 25.00 mm $\pm$ 0.03 mm sets a **tolerance**: the largest allowed difference from the nominal value. In symbols, $|d - 25| \le 0.03$, or $24.97 \le d \le 25.03$.

Tolerances are often given as a percent of the nominal value. Electronic resistors are commonly sold with 5% or 1% tolerance.

### Example 2

A resistor is labeled 470 ohms with a 5% tolerance. Which resistances are acceptable? Would a measured 492 ohms pass? 446 ohms?

1. The allowed difference is 5% of 470: $0.05 \times 470 = 23.5$ ohms.
2. So $|R - 470| \le 23.5$, which means $446.5 \le R \le 493.5$.
3. 492 passes ($|492 - 470| = 22 \le 23.5$). 446 fails ($|446 - 470| = 24 > 23.5$).

The difference $|\text{measured} - \text{true}|$ is called the **absolute error**. Dividing it by the size of the true value gives the **relative error**, $\dfrac{|\text{measured} - \text{true}|}{|\text{true}|}$, usually written as a percent. A 492-ohm reading of a true 470 ohms has absolute error 22 ohms and relative error $\tfrac{22}{470} \approx 0.047$, about 4.7%. Relative error makes different scales comparable: being off by 1 cm is excellent for a 100 m track and terrible for a 2 cm screw.

## How an error travels through a formula

Suppose $x$ is measured as 3, with error at most 0.1, so $|x - 3| \le 0.1$. You compute $y = 5x - 2$. The "true" $y$ would be $5(3) - 2 = 13$. How far can the computed value be from 13?

Write the difference so that $x - 3$ appears:

$$|(5x - 2) - 13| = |5x - 15| = |5(x - 3)| = 5\,|x - 3| \le 5(0.1) = 0.5.$$

The step $|5(x - 3)| = 5|x - 3|$ uses the rule $|ab| = |a|\,|b|$ (the size of a product is the product of the sizes). So the error in $y$ is at most 5 times the error in $x$. In general, for a linear formula $y = kx + b$ with measured input $x_0$ and computed output $y_0 = kx_0 + b$:

$$|y - y_0| = |k|\,|x - x_0|.$$

The slope magnifies (or shrinks) the error by $|k|$. The absolute value matters when the slope is negative: for $y = 20 - 4x$, an error of 0.1 in $x$ gives an error of up to $|-4|(0.1) = 0.4$ in $y$, not $-0.4$.

You can also run it backward: to guarantee $|y - 13| < 0.01$, you need $5|x - 3| < 0.01$, so $|x - 3| < 0.002$. "How close must the input be to make the output this close?" is exactly the question behind the precise definition of a limit in calculus, so this is a first taste of it.

### Example 3

A fence costs $C = 12L + 150$ dollars for a length of $L$ meters. You measured $L = 40$ m, but your measurement could be off by up to 0.5 m.

(a) How far could the true cost be from the estimate?

1. The estimate is $C_0 = 12(40) + 150 = 630$ dollars.
2. $|C - 630| = |12L + 150 - 630| = |12(L - 40)| = 12|L - 40| \le 12(0.5) = 6$.
3. The true cost is within \$6 of \$630, between \$624 and \$636.

(b) How accurately must you measure $L$ to know the cost within \$3?

1. You need $12|L - 40| \le 3$, so $|L - 40| \le 0.25$.
2. Measure to within 0.25 m.

## The triangle inequality

What happens to errors when you add two measured quantities? The answer rests on this rule for any real numbers $a$ and $b$:

$$|a + b| \le |a| + |b|.$$

It is called the triangle inequality because of its geometric cousin: in any triangle, one side is never longer than the other two put together (Proposition 20 of Book I of Euclid's *Elements*, written about 300 BC). On a number line, adding $a$ and then $b$ means taking two steps. If both steps go the same way, the distances add exactly. If they go opposite ways, the second step undoes part of the first, so you end up closer to 0 than $|a| + |b|$.

![Two number lines. Top: a = 3 and b = 2 drawn as arrows in the same direction, ending at 5, so |a + b| = 5 equals |a| + |b| = 5. Bottom: a = 3 drawn to the right and b = -5 drawn back to the left, ending at -2, so |a + b| = 2 is less than |a| + |b| = 8.](images/alg-m2-h-triangle.svg)

Equality holds exactly when $a$ and $b$ do not have opposite signs (both $\ge 0$ or both $\le 0$).

*Why it is true.* Every number is between its own absolute value and the opposite of it: $-|a| \le a \le |a|$ and $-|b| \le b \le |b|$. Adding these two double inequalities part by part gives

$$-(|a| + |b|) \le a + b \le |a| + |b|.$$

By Lesson 7's "less than means between" rule, read backward, this says $|a + b| \le |a| + |b|$.

Applied to distances, it says $|x - z| \le |x - y| + |y - z|$ for any three numbers: going from $x$ to $z$ by way of $y$ is never shorter than going directly. (Set $a = x - y$ and $b = y - z$.)

### Example 4

You measure $x = 5$ with $|x - 5| \le 0.2$ and $y = 3$ with $|y - 3| \le 0.1$. How far can $x + y$ be from 8? How far can $x - y$ be from 2?

1. Sum: $|(x + y) - 8| = |(x - 5) + (y - 3)| \le |x - 5| + |y - 3| \le 0.2 + 0.1 = 0.3$.
2. Difference: $|(x - y) - 2| = |(x - 5) - (y - 3)| = |(x - 5) + (3 - y)| \le |x - 5| + |y - 3| \le 0.3$. (Note $|3 - y| = |y - 3|$.)
3. Both bounds are 0.3. The difference is *not* $0.2 - 0.1 = 0.1$: the worst case is $x = 5.2$ and $y = 2.9$, which gives $x - y = 2.3$, a full 0.3 away from 2.

Errors in measurements you add *or* subtract combine by adding their bounds, because in the worst case they push the same way. Three boards each $1.2 \pm 0.005$ m long, laid end to end, give $3.6 \pm 0.015$ m.

This worst-case rule is the safe guarantee. In practice, independent errors often partly cancel, and statistics courses use a different rule (root-sum-of-squares) to estimate a *typical* combined error; that estimate is smaller, but it is not a guarantee.

## Common mistakes

- Using the full length $b - a$ as the half-width. The half-width is $\tfrac{b - a}{2}$.
- Taking a percent tolerance of the wrong number. A 5% tolerance on 470 ohms is 5% of 470, not 5 ohms.
- Subtracting error bounds when subtracting measurements. Bounds add for sums *and* differences.
- Forgetting the absolute value on a negative slope. An error bound is never negative.
- Treating $|a + b| = |a| + |b|$ as always true. It fails whenever $a$ and $b$ have opposite signs: $|3 + (-5)| = 2$, but $|3| + |-5| = 8$.

## Key points

- $a \le x \le b \iff |x - m| \le h$, with midpoint $m = \tfrac{a + b}{2}$ and half-width $h = \tfrac{b - a}{2}$.
- A tolerance $\pm t$ around a nominal value $n$ is $|x - n| \le t$; a percent tolerance is that percent of $n$.
- Absolute error is $|\text{measured} - \text{true}|$; relative error divides it by $|\text{true}|$.
- For $y = kx + b$, an input error of $e$ gives an output error of at most $|k|e$.
- Triangle inequality: $|a + b| \le |a| + |b|$, with equality when $a$ and $b$ don't have opposite signs. Error bounds add when measurements are added or subtracted.
