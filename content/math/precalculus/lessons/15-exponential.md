---
id: pc-exponential
module: pc-m4
title: Exponential functions
minutes: 30
topics: [Exponential functions]
drills: [pc-compound, pc-continuous]
refs: [pc-ref-exp-log]
---
## Growth by a constant factor

Polynomials grow by adding: a line adds the same amount for each step in $x$. Exponential functions grow by *multiplying*: each step in $x$ multiplies the output by the same factor. Populations, investments, radioactive material, viral posts and cooling coffee all behave this way, at least for a while. This module covers exponential functions, their inverses (logarithms), how to solve equations with them, and how to build models. It relies on transformations (Module 2) and inverse functions (Lesson 7).

## Definition and basic shape

An **exponential function** with base $b$ is

$$f(x) = b^x, \qquad b > 0,\ b \ne 1.$$

The base must be positive so that $b^x$ is defined for all real $x$ (what would $(-4)^{1/2}$ be?), and $b \ne 1$ because $1^x = 1$ is just a constant. The variable is in the exponent, which is what separates $2^x$ from the power function $x^2$.

Key facts, all from the rules of exponents:

- $b^0 = 1$, so every graph $y = b^x$ passes through $(0, 1)$. And $b^1 = b$ gives the point $(1, b)$.
- $b^x > 0$ for every $x$, so the range is $(0, \infty)$ and the graph never touches the $x$-axis.
- The $x$-axis, $y = 0$, is a horizontal asymptote.
- If $b > 1$ the function is increasing: **exponential growth**. If $0 < b < 1$ it is decreasing: **exponential decay**.
- $\left(\tfrac1b\right)^x = b^{-x}$, so the graph of $y = \left(\tfrac12\right)^x$ is the reflection of $y = 2^x$ across the $y$-axis.

```plot
{"x": [-4, 4], "y": [-1, 9], "functions": [{"f": "2^x", "label": "y = 2ˣ"}, {"f": "(1/2)^x", "label": "y = (½)ˣ", "dashed": true}, {"f": "3^x", "label": "y = 3ˣ"}], "points": [{"at": [0, 1], "label": "(0, 1)"}], "caption": "Growth (2ˣ, 3ˣ) and decay ((½)ˣ). All pass through (0, 1) and approach y = 0 on one side."}
```

## Why exponential beats polynomial

Compare $2^x$ and $x^2$. At $x = 4$ they tie at 16. At $x = 10$: $1024$ versus $100$. At $x = 30$: about a billion versus 900. Each step multiplies $2^x$ by 2 but only adds $2x + 1$ to $x^2$, and eventually doubling outruns any fixed amount of adding. This is why an exponential with base greater than 1 eventually exceeds *any* polynomial.

The graphs show the race. They cross three times: once at a negative $x$ (about $-0.77$), then at $x = 2$ and $x = 4$. Between 2 and 4 the parabola is ahead, but after $x = 4$ the exponential leads for good.

```plot
{"x": [-2, 7], "y": [-2, 70], "functions": [{"f": "2^x", "label": "y = 2ˣ"}, {"f": "x^2", "label": "y = x²", "dashed": true}], "points": [{"at": [2, 4], "label": "(2, 4)"}, {"at": [4, 16], "label": "(4, 16)"}, {"at": [6, 64], "label": "(6, 64)"}, {"at": [6, 36], "label": "(6, 36)"}], "caption": "2ˣ and x² meet at x = 2 and x = 4; after that the exponential pulls away (64 versus 36 at x = 6)."}
```

## Transformations

All the rules from Lesson 5 apply. For $y = a\,b^{x - h} + k$:

- the horizontal asymptote moves to $y = k$;
- the anchor point $(0, 1)$ moves to $(h, a + k)$;
- the range becomes $(k, \infty)$ if $a > 0$ and $(-\infty, k)$ if $a < 0$.

### Example 1

Describe $g(x) = 2^{x - 1} + 3$ and give its asymptote and range.

Right 1, up 3. The asymptote moves from $y = 0$ to $y = 3$; $(0, 1)$ moves to $(1, 4)$ and $(1, 2)$ moves to $(2, 5)$. Range: $(3, \infty)$.

A vertical shift moves growth and decay curves alike. The picture shows $y = 2^x + 1$ and $y = \left(\tfrac12\right)^x + 1$: both are shifted up 1, so they share the asymptote $y = 1$ and the $y$-intercept $(0, 2)$, but one rises to the right and the other to the left.

![Graphs of y = 2ˣ + 1 rising to the right and y = (½)ˣ + 1 rising to the left. Both approach the dashed horizontal asymptote y = 1 and cross the y-axis at (0, 2).](images/pc-m4-exp-features.svg)

```plot
{"x": [-5, 5], "y": [-1, 12], "functions": [{"f": "2^x", "dashed": true}, {"f": "2^(x - 1) + 3", "label": "y = 2ˣ⁻¹ + 3"}, {"f": "3", "dashed": true}], "points": [{"at": [1, 4], "label": "(1, 4)"}, {"at": [0, 1]}], "caption": "2ˣ (dashed) shifted right 1 and up 3; the asymptote moves to y = 3."}
```

## Compound interest

Suppose you invest a **principal** $P$ at annual rate $r$ (as a decimal), with interest compounded $n$ times a year. Each period the balance is multiplied by $\left(1 + \tfrac rn\right)$, and there are $nt$ periods in $t$ years, so

$$A = P\left(1 + \frac{r}{n}\right)^{nt}.$$

This is the **compound interest** formula. It's exponential in $t$, with growth factor $\left(1 + \tfrac rn\right)^n$ per year.

### Example 2

\$5,000 is invested at 4.5% interest compounded monthly. What is it worth after 10 years?

$P = 5000$, $r = 0.045$, $n = 12$, $t = 10$:

$$A = 5000\left(1 + \frac{0.045}{12}\right)^{120} = 5000(1.00375)^{120} \approx 7834.96.$$

About \$7,834.96. Use $r = 0.045$, not $4.5$, and keep the exponent as $nt = 120$.

## The number $e$ and continuous compounding

What happens as interest is compounded more and more often? Take $P = 1$, $r = 1$ (100%) and $t = 1$, and let $n$ grow:

| $n$ | $\left(1 + \frac1n\right)^n$ |
|---|---|
| 1 | 2 |
| 12 | 2.613… |
| 1,000 | 2.7169… |
| 1,000,000 | 2.71828… |

The values level off at a famous constant, the **natural base** $e \approx 2.718281828$. With general $r$ the same limit gives $e^r$ per year, so compounding "every instant" gives the **continuous compounding** formula

$$A = Pe^{rt}.$$

The function $e^x$ is called *the* exponential function, or the **natural exponential function**. It plays the leading role in calculus because its rate of change at every point equals its own value, a fact you'll prove there.

### Example 3

Compare \$1,000 at 6% for 5 years compounded annually, quarterly, and continuously.

- Annually: $1000(1.06)^5 \approx 1338.23$.
- Quarterly: $1000(1.015)^{20} \approx 1346.86$.
- Continuously: $1000e^{0.3} \approx 1349.86$.

More frequent compounding helps, but with diminishing returns: continuous compounding is the ceiling.

## Exponential models in general

Any quantity that changes by the same *percentage* per unit time has the form

$$Q(t) = Q_0\,b^t \quad \text{or equivalently} \quad Q(t) = Q_0\,e^{kt},$$

where $Q_0$ is the initial amount. If a population grows 3% per year, then $b = 1.03$. If a drug's concentration drops 20% per hour, then $b = 0.80$. Lesson 18 builds these models from data.

## Common mistakes

- *Confusing $2^x$ with $x^2$.* In an exponential, the variable is the exponent.
- *Using the percent instead of the decimal.* 4.5% is $r = 0.045$.
- *Wrong number of periods.* Monthly for 10 years is $nt = 120$ periods.
- *Thinking the graph reaches the asymptote.* $b^x > 0$ always; it never equals 0.
- *Growth factor for decay.* A 20% decrease means multiply by 0.8, not 0.2.

## Key points

- $f(x) = b^x$ ($b > 0$, $b \ne 1$): passes through $(0, 1)$, range $(0, \infty)$, asymptote $y = 0$.
- $b > 1$ is growth, $0 < b < 1$ is decay.
- $y = a b^{x - h} + k$ has asymptote $y = k$.
- Compound interest: $A = P\left(1 + \frac rn\right)^{nt}$; continuous: $A = Pe^{rt}$.
- $e \approx 2.71828$ is the limit of $\left(1 + \frac1n\right)^n$.
