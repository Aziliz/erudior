---
id: alg-logs
module: a2-m6
title: Logarithms and their properties
minutes: 35
topics: [Logarithms]
drills: [alg-d-log-eval, alg-d-log-condense, alg-d-change-base]
refs: [alg-ref-explog]
---
Exponential functions answer "what is $2^5$?" Logarithms answer the reverse: "2 to what power is 32?" Without logarithms you can't solve for an unknown exponent, which is exactly what questions like "how long until my money doubles?" require. This lesson defines logarithms as inverses of exponentials, derives their properties from the exponent rules, and introduces common and natural logs and the change-of-base formula.

## Definition

For $b > 0$, $b \ne 1$ and $x > 0$,

$$\log_b x = y \quad \text{means} \quad b^y = x.$$

The **logarithm** $\log_b x$ is the exponent you put on the base $b$ to get $x$. So $\log_2 32 = 5$ because $2^5 = 32$, and $\log_{10} 0.01 = -2$ because $10^{-2} = 0.01$.

Every logarithmic statement can be rewritten in **exponential form** and back:

| Logarithmic form | Exponential form |
|---|---|
| $\log_3 81 = 4$ | $3^4 = 81$ |
| $\log_5 \tfrac{1}{25} = -2$ | $5^{-2} = \tfrac{1}{25}$ |
| $\log_{16} 4 = \tfrac12$ | $16^{1/2} = 4$ |
| $\log_7 1 = 0$ | $7^0 = 1$ |

The argument $x$ must be positive, because $b^y$ is always positive. $\log_2(-8)$ and $\log_2 0$ are undefined.

### Example 1

Evaluate $\log_4 64$, $\log_9 3$ and $\log_2 \tfrac18$.

1. $4^? = 64$: $4^3 = 64$, so $\log_4 64 = 3$.
2. $9^? = 3$: $9^{1/2} = 3$, so $\log_9 3 = \tfrac12$.
3. $2^? = \tfrac18 = 2^{-3}$, so $\log_2 \tfrac18 = -3$.

## Common and natural logarithms

Two bases get special names and calculator keys:

- The **common logarithm** is base 10, written $\log x$ (no base shown): $\log 1000 = 3$.
- The **natural logarithm** is base $e$, written $\ln x$: $\ln e^2 = 2$, and $\ln 1 = 0$.

## Basic properties

Straight from the definition:

$$\log_b 1 = 0, \qquad \log_b b = 1, \qquad \log_b b^x = x, \qquad b^{\log_b x} = x \;(x > 0).$$

The last two say that $\log_b x$ and $b^x$ undo each other: they are **inverse functions** (see Module 1). So the graph of $y = \log_b x$ is the reflection of $y = b^x$ across the line $y = x$. It has domain $(0, \infty)$, range all real numbers, $x$-intercept $(1, 0)$, and a vertical asymptote at $x = 0$.

```plot
{"x": [-4, 8], "y": [-4, 8], "equal": true, "functions": [{"f": "2^x", "label": "y = 2^x", "from": -4, "to": 3}, {"f": "log(x, 2)", "label": "y = log₂ x", "from": 0.06, "to": 8}, {"f": "x", "dashed": true, "label": "y = x"}], "points": [{"at": [1, 0], "label": "(1, 0)"}, {"at": [0, 1], "label": "(0, 1)"}, {"at": [4, 2], "label": "(4, 2)"}, {"at": [2, 4], "label": "(2, 4)"}], "caption": "log₂ x is the mirror image of 2^x across y = x"}
```

## The laws of logarithms

Because logarithms are exponents, the exponent rules translate directly. For $M, N > 0$:

| Law | Statement | Comes from |
|---|---|---|
| Product rule | $\log_b(MN) = \log_b M + \log_b N$ | $b^m b^n = b^{m+n}$ |
| Quotient rule | $\log_b \dfrac{M}{N} = \log_b M - \log_b N$ | $\dfrac{b^m}{b^n} = b^{m-n}$ |
| Power rule | $\log_b(M^k) = k\log_b M$ | $(b^m)^k = b^{mk}$ |

Proof of the product rule: let $m = \log_b M$ and $n = \log_b N$, so $M = b^m$ and $N = b^n$. Then $MN = b^{m+n}$, and taking $\log_b$ gives $\log_b(MN) = m + n$.

There is no rule for the log of a sum: $\log_b(M + N)$ does not simplify. And $\log_b M \cdot \log_b N$ is not $\log_b(MN)$.

### Example 2

Expand $\log_3 \dfrac{9x^4}{\sqrt y}$ (for $x, y > 0$).

1. Quotient rule: $\log_3(9x^4) - \log_3 y^{1/2}$.
2. Product rule: $\log_3 9 + \log_3 x^4 - \log_3 y^{1/2}$.
3. Power rule and $\log_3 9 = 2$: $2 + 4\log_3 x - \tfrac12\log_3 y$.

### Example 3

Condense $2\ln x + \ln(x + 1) - 3\ln y$ into a single logarithm.

1. Power rule first: $\ln x^2 + \ln(x + 1) - \ln y^3$.
2. Combine: $\ln \dfrac{x^2(x + 1)}{y^3}$.

### Example 4

Given $\log_b 2 \approx 0.356$ and $\log_b 3 \approx 0.565$, estimate $\log_b 12$.

$12 = 2^2 \cdot 3$, so $\log_b 12 = 2\log_b 2 + \log_b 3 \approx 0.712 + 0.565 = 1.277$.

## Change of base

Calculators have only $\log$ and $\ln$. To evaluate a log in another base, use the **change-of-base formula**:

$$\log_b x = \frac{\log x}{\log b} = \frac{\ln x}{\ln b}.$$

Why: let $y = \log_b x$, so $b^y = x$. Take $\ln$ of both sides: $y\ln b = \ln x$ by the power rule. Divide: $y = \dfrac{\ln x}{\ln b}$.

### Example 5

Evaluate $\log_3 50$ to four decimal places.

$\log_3 50 = \dfrac{\ln 50}{\ln 3} \approx \dfrac{3.9120}{1.0986} \approx 3.5609$. Check: $3^{3.5609} \approx 50$. It makes sense: $3^3 = 27$ and $3^4 = 81$, so the answer is between 3 and 4.

## Logarithmic scales

Because logarithms turn multiplication into addition, they're used to measure quantities that range over many powers of ten. The acidity of a solution is measured by its pH,

$$\text{pH} = -\log\,[\text{H}^+],$$

where $[\text{H}^+]$ is the hydrogen ion concentration. Lemon juice with $[\text{H}^+] = 10^{-2}$ has pH 2; pure water with $[\text{H}^+] = 10^{-7}$ has pH 7.

### Example 6

How many times more concentrated in hydrogen ions is a solution of pH 3 than one of pH 6?

The concentrations are $10^{-3}$ and $10^{-6}$, and $\dfrac{10^{-3}}{10^{-6}} = 10^{3} = 1000$. Each step of 1 on a base-10 log scale is a factor of 10, so 3 steps is a factor of 1000. Earthquake magnitude scales work the same way; on the decibel scale, each 10 dB step is a factor of 10 in sound intensity.

## Common mistakes

- Reading $\log_b x$ as $\log_b$ times $x$, or dividing $\dfrac{\log 50}{\log 3}$ as $\log \dfrac{50}{3}$.
- Inventing a sum rule: $\log(M + N) \ne \log M + \log N$.
- Applying the power rule to a coefficient outside: $(\log x)^2 \ne 2\log x$. The power rule needs the exponent on the argument.
- Taking logs of zero or negative numbers.
- Mixing up the base and the argument when converting: $\log_2 8 = 3$ means $2^3 = 8$, not $8^3 = 2$.

## Key points

- $\log_b x = y \iff b^y = x$; a logarithm is an exponent.
- $\log x$ is base 10; $\ln x$ is base $e$.
- $\log_b b^x = x$ and $b^{\log_b x} = x$: logs and exponentials are inverses.
- Product, quotient and power rules mirror the exponent rules; no rule exists for a sum.
- Change of base: $\log_b x = \dfrac{\ln x}{\ln b}$.
