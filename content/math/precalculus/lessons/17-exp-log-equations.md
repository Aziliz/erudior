---
id: pc-exp-log-equations
module: pc-m4
title: Solving exponential and logarithmic equations
minutes: 30
topics: [Exponential and logarithmic equations]
drills: [pc-exp-solve, pc-log-solve, pc-same-base]
refs: [pc-ref-exp-log]
---
## Using the inverse relationship

Most questions in exponential models end in an equation: *when* will the investment double, *how long* until only 10% of a drug remains? The unknown is in an exponent, and logarithms are the tool that brings it down. Conversely, when the unknown is inside a logarithm, exponentiating sets it free. This lesson collects the strategies, using the properties from the last lesson. The guiding principle is one-to-one-ness:

$$b^u = b^v \iff u = v, \qquad \log_b u = \log_b v \iff u = v \ (u, v > 0).$$

## Strategy 1: rewrite with the same base

If both sides are powers of the same number, write them that way and set the exponents equal.

### Example 1

Solve $8^{x + 1} = 4^{2x - 3}$.

Both 8 and 4 are powers of 2: $8 = 2^3$, $4 = 2^2$. So

$$2^{3(x + 1)} = 2^{2(2x - 3)} \implies 3x + 3 = 4x - 6 \implies x = 9.$$

Check: $8^{10} = 2^{30}$ and $4^{15} = 2^{30}$. ✓

## Strategy 2: isolate the exponential, then take a logarithm

When no common base exists, isolate the exponential expression, take $\ln$ (or $\log$) of both sides, and use the power rule to bring the exponent down.

### Example 2

Solve $5 \cdot 3^x = 40$. Give an exact answer and a decimal.

1. Isolate: $3^x = 8$. (Divide by 5 *before* taking logs; $\ln(5 \cdot 3^x)$ would need the product rule.)
2. Take $\ln$: $\ln 3^x = \ln 8$, so $x\ln 3 = \ln 8$.
3. Solve: $x = \dfrac{\ln 8}{\ln 3} \approx 1.8928$.

You could also write $x = \log_3 8$ directly from the definition; the change-of-base formula turns it into the same thing.

### Example 3

Solve $2^{x + 1} = 5^x$.

Take $\ln$ of both sides: $(x + 1)\ln 2 = x \ln 5$. Now it's a linear equation in $x$ with log constants as coefficients. Collect the $x$ terms:

$$x\ln 2 + \ln 2 = x\ln 5 \implies \ln 2 = x(\ln 5 - \ln 2) \implies x = \frac{\ln 2}{\ln 5 - \ln 2} \approx 0.7565.$$

```plot
{"x": [-2, 2], "y": [-0.5, 6], "functions": [{"f": "2^(x + 1)", "label": "y = 2ˣ⁺¹"}, {"f": "5^x", "label": "y = 5ˣ"}], "points": [{"at": [0.7565, 3.379], "label": "x ≈ 0.7565"}], "caption": "The solution of 2ˣ⁺¹ = 5ˣ is where the two graphs meet."}
```

## Strategy 3: exponential equations of quadratic type

If an equation contains $b^{2x}$ and $b^x$, substitute $u = b^x$ (so $b^{2x} = u^2$).

### Example 4

Solve $e^{2x} - 5e^x + 6 = 0$.

With $u = e^x$: $u^2 - 5u + 6 = 0$, so $(u - 2)(u - 3) = 0$ and $u = 2$ or $u = 3$. Then $e^x = 2$ gives $x = \ln 2 \approx 0.693$ and $e^x = 3$ gives $x = \ln 3 \approx 1.099$. If one of the $u$ values had been negative or zero, it would give no solution, since $e^x > 0$.

## Strategy 4: logarithmic equations

Use the properties to combine into a single logarithm, rewrite in exponential form, and solve. Then *check every answer in the original equation*: an answer that makes any log's argument zero or negative is an **extraneous solution** and must be rejected. Combining logs can widen the domain, which is how these false answers sneak in.

### Example 5

Solve $\log_2 x + \log_2(x - 2) = 3$.

1. Combine (product rule): $\log_2\big(x(x - 2)\big) = 3$.
2. Exponential form: $x(x - 2) = 2^3 = 8$.
3. Solve: $x^2 - 2x - 8 = 0$, so $(x - 4)(x + 2) = 0$ and $x = 4$ or $x = -2$.
4. Check: $x = 4$ gives $\log_2 4 + \log_2 2 = 2 + 1 = 3$. ✓ $x = -2$ gives $\log_2(-2)$, undefined. ✗

Solution: $x = 4$ only.

### Example 6

Solve $\ln(x + 1) - \ln x = 1$.

Quotient rule: $\ln\dfrac{x + 1}{x} = 1$. Exponentiate: $\dfrac{x + 1}{x} = e$. Then $x + 1 = ex$, so $1 = x(e - 1)$ and

$$x = \frac{1}{e - 1} \approx 0.582.$$

Check: $x > 0$, so both logs are defined. ✓

### Example 7

Solve $\log(3x - 2) = \log(x + 6)$.

Logs with the same base are one-to-one, so $3x - 2 = x + 6$ and $x = 4$. Check: $\log 10 = \log 10$. ✓

## A doubling-time application

### Example 8

At 5% interest compounded continuously, how long does it take money to double?

$Pe^{0.05t} = 2P \implies e^{0.05t} = 2 \implies 0.05t = \ln 2 \implies t = \dfrac{\ln 2}{0.05} \approx 13.86$ years.

Notice that $P$ cancels: the doubling time doesn't depend on how much you start with. That is a signature of exponential growth.

### Example 9

How long does it take \$1,000 to grow to \$1,500 at 5% interest compounded monthly?

Set up $1000\left(1 + \frac{0.05}{12}\right)^{12t} = 1500$ and isolate the power: $\left(1 + \frac{0.05}{12}\right)^{12t} = 1.5$. Take $\ln$ of both sides and bring the exponent down:

$$12t\,\ln\!\left(1 + \tfrac{0.05}{12}\right) = \ln 1.5 \implies t = \frac{\ln 1.5}{12\ln(1.0041\overline{6})} \approx 8.13 \text{ years}.$$

The unknown sat inside an exponent that was itself a product ($12t$); the power rule brings the whole product down, and then it's ordinary division. Keep the base unrounded until the end: rounding $1.00417$ early shifts the answer in the second decimal place.

## Common mistakes

- *Taking logs before isolating.* $\ln(5 \cdot 3^x) = \ln 5 + x\ln 3$, not $5x\ln 3$.
- *Dividing logs wrongly.* $\frac{\ln 8}{\ln 3} \ne \ln\frac83$ and $\ne \ln 8 - \ln 3$.
- *Skipping the check* in log equations, keeping an extraneous solution.
- *Keeping impossible $u$ values.* $e^x = -2$ has no solution.
- *Rounding too early.* Keep exact logs until the last step.

## Key points

- Same base: set exponents equal.
- Otherwise isolate the exponential, take $\ln$, and use the power rule.
- Equations with $b^{2x}$ and $b^x$: substitute $u = b^x$.
- Log equations: combine to one log, rewrite in exponential form, solve, then check for extraneous solutions.
- Doubling time with continuous rate $r$: $t = \frac{\ln 2}{r}$.
