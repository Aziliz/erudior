---
id: pc-logarithms
module: pc-m4
title: Logarithmic functions and their properties
minutes: 30
topics: [Logarithms]
drills: [pc-log-eval, pc-change-base, pc-log-combine]
refs: [pc-ref-exp-log]
---
## The question a logarithm answers

$2^x = 8$ is easy: $x = 3$. But $2^x = 10$? The answer is somewhere between 3 and 4, and we need a name for it. Since $y = 2^x$ is one-to-one (always increasing), it has an inverse function, and that inverse is the logarithm. A logarithm answers the question "what exponent?" This lesson defines logarithms, graphs them as inverses of exponentials (Lesson 7), and develops the properties that make them so useful for solving equations in the next lesson.

## Definition

For $b > 0$, $b \ne 1$ and $x > 0$, the **logarithm** base $b$ of $x$ is

$$\log_b x = y \iff b^y = x.$$

In words: $\log_b x$ is the exponent you put on $b$ to get $x$. Every logarithm statement is an exponential statement in disguise, and switching between the two forms is the main skill.

| Log form | Exponential form |
|---|---|
| $\log_2 8 = 3$ | $2^3 = 8$ |
| $\log_{10} 0.01 = -2$ | $10^{-2} = 0.01$ |
| $\log_9 3 = \tfrac12$ | $9^{1/2} = 3$ |
| $\log_5 1 = 0$ | $5^0 = 1$ |

Two bases have special names. The **common logarithm** $\log x$ means $\log_{10} x$. The **natural logarithm** $\ln x$ means $\log_e x$.

### Example 1

Evaluate without a calculator: $\log_3 81$, $\log_4 \tfrac{1}{16}$, $\log_8 2$, $\ln e^5$.

- $3^? = 81$: $3^4 = 81$, so $\log_3 81 = 4$.
- $4^? = \tfrac1{16} = 4^{-2}$, so $\log_4 \tfrac1{16} = -2$.
- $8^? = 2$: since $8^{1/3} = 2$, $\log_8 2 = \tfrac13$.
- $\ln e^5 = 5$, because the exponent on $e$ is 5.

## Inverse properties

Because $\log_b$ and $b^x$ are inverse functions, each undoes the other:

$$\log_b\left(b^x\right) = x \quad \text{for all } x, \qquad b^{\log_b x} = x \quad \text{for } x > 0.$$

So $\log_7 7^{12} = 12$, $10^{\log 3} = 3$ and $e^{\ln 5} = 5$. Also $\log_b 1 = 0$ and $\log_b b = 1$.

## The graph

Reflect $y = b^x$ across $y = x$. The point $(0, 1)$ becomes $(1, 0)$, $(1, b)$ becomes $(b, 1)$, and the horizontal asymptote $y = 0$ becomes the vertical asymptote $x = 0$.

```plot
{"x": [-3, 9], "y": [-3, 9], "equal": true, "functions": [{"f": "2^x", "label": "y = 2ˣ", "dashed": true}, {"f": "log2(x)", "label": "y = log₂ x"}, {"f": "x", "dashed": true}], "points": [{"at": [1, 0], "label": "(1, 0)"}, {"at": [2, 1], "label": "(2, 1)"}, {"at": [8, 3], "label": "(8, 3)"}], "caption": "y = log₂ x is the mirror image of y = 2ˣ across y = x."}
```

For $f(x) = \log_b x$ with $b > 1$:

- domain $(0, \infty)$ (you can only take the log of a positive number), range all reals;
- vertical asymptote $x = 0$;
- increasing, but very slowly: $\log_2$ of a million is only about 20.

Changing the base changes how fast the curve climbs, but every graph $y = \log_b x$ passes through $(1, 0)$ and has the same asymptote. For $b > 1$, a larger base gives a flatter curve, because it takes a bigger power to reach each output.

```plot
{"x": [-0.5, 10], "y": [-3, 4], "functions": [{"f": "log2(x)", "label": "y = log₂ x"}, {"f": "ln(x)", "label": "y = ln x"}, {"f": "log10(x)", "label": "y = log x", "dashed": true}], "points": [{"at": [1, 0]}, {"at": [2, 1]}, {"at": [2.718, 1]}, {"at": [10, 1]}], "caption": "log₂ x, ln x and log x all pass through (1, 0). Each reaches 1 at its own base: x = 2, x = e ≈ 2.718 and x = 10.", "labels": [{"at": [1.75, -0.9], "text": "(1, 0)"}]}
```

The domain fact matters constantly: $\log_b(\text{expression})$ requires the expression to be positive. For example, $\ln(x - 3)$ has domain $x > 3$ and vertical asymptote $x = 3$.

The picture shows the same features for $y = \log_2(x - 2)$, the graph of $\log_2 x$ shifted right 2. Its vertical asymptote is $x = 2$, it crosses the $x$-axis at $(3, 0)$ (where $x - 2 = 1$), it reaches 1 at $(4, 1)$ (where $x - 2 = 2$), and nothing at all is drawn for $x \le 2$.

![Graph of y = log₂(x − 2): a dashed vertical asymptote at x = 2, a shaded region to its left marked outside the domain, the x-intercept (3, 0) and the point (4, 1).](images/pc-m4-log-features.svg)

## Properties of logarithms

Each exponent rule becomes a log rule. Let $M, N > 0$:

| Rule | Logarithm form | Comes from |
|---|---|---|
| Product | $\log_b(MN) = \log_b M + \log_b N$ | $b^u b^v = b^{u+v}$ |
| Quotient | $\log_b\dfrac MN = \log_b M - \log_b N$ | $\dfrac{b^u}{b^v} = b^{u - v}$ |
| Power | $\log_b(M^p) = p\log_b M$ | $(b^u)^p = b^{up}$ |

Why the product rule holds: let $u = \log_b M$ and $v = \log_b N$, so $M = b^u$ and $N = b^v$. Then $MN = b^{u+v}$, so $\log_b(MN) = u + v$. The other two are proved the same way.

There is no rule for $\log_b(M + N)$. It is *not* $\log_b M + \log_b N$.

### Example 2

Expand $\log_3\left(\dfrac{9x^4}{\sqrt{y}}\right)$ as far as possible.

$$\log_3 9 + \log_3 x^4 - \log_3 y^{1/2} = 2 + 4\log_3 x - \tfrac12\log_3 y.$$

(Product and quotient rules first, then the power rule, then $\log_3 9 = 2$.)

### Example 3

Condense $2\ln x + \ln(x + 1) - 3\ln z$ into a single logarithm.

Power rule first, moving coefficients into exponents: $\ln x^2 + \ln(x + 1) - \ln z^3$. Then product and quotient:

$$\ln\frac{x^2(x + 1)}{z^3}.$$

## Change of base

Calculators have $\log$ and $\ln$ keys only. To evaluate another base, use the **change-of-base formula**:

$$\log_b x = \frac{\ln x}{\ln b} = \frac{\log x}{\log b}.$$

Why: let $y = \log_b x$, so $b^y = x$. Take $\ln$ of both sides: $y \ln b = \ln x$ (power rule), so $y = \frac{\ln x}{\ln b}$.

### Example 4

Evaluate $\log_2 10$ to four decimal places.

$\log_2 10 = \dfrac{\ln 10}{\ln 2} \approx \dfrac{2.302585}{0.693147} \approx 3.3219$. That fits the estimate "between 3 and 4" from the introduction.

## Common mistakes

- *$\log_b(M + N) = \log_b M + \log_b N$.* False. Only products split into sums.
- *$\dfrac{\log M}{\log N} = \log M - \log N$.* False. The quotient rule is about $\log\frac MN$, not a quotient of logs.
- *$(\log x)^2 = 2\log x$.* False. The power rule needs the power *inside*: $\log x^2 = 2\log x$.
- *Taking logs of nonpositive numbers.* $\log_b 0$ and $\log_b(-5)$ are undefined.
- *Flipping change of base.* It's $\frac{\ln x}{\ln b}$, the argument on top.

## Key points

- $\log_b x = y$ means $b^y = x$: a logarithm is an exponent.
- $\log = \log_{10}$, $\ln = \log_e$.
- $\log_b b^x = x$ and $b^{\log_b x} = x$.
- The graph of $\log_b x$ mirrors $b^x$ across $y = x$: domain $(0, \infty)$, asymptote $x = 0$, through $(1, 0)$.
- Product, quotient and power rules; change of base $\log_b x = \frac{\ln x}{\ln b}$.
