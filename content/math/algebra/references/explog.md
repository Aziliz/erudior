---
id: alg-ref-explog
title: Exponentials, logarithms and sequences
---
## Exponential models

| Model | Formula |
|---|---|
| Exponential function | $f(x) = ab^x$ (growth $b > 1$, decay $0 < b < 1$) |
| Percent growth / decay | $A = a(1 \pm r)^t$ |
| Half-life $h$ | $A = A_0\left(\tfrac12\right)^{t/h}$ |
| Doubling time $d$ | $A = A_0 \cdot 2^{t/d}$ |
| Compound interest | $A = P\left(1 + \tfrac rn\right)^{nt}$ |
| Continuous compounding | $A = Pe^{rt}$, $e \approx 2.71828$ |

## Logarithms ($b > 0$, $b \ne 1$, $M, N > 0$)

| Rule | Statement |
|---|---|
| Definition | $\log_b x = y \iff b^y = x$ |
| Special values | $\log_b 1 = 0$, $\log_b b = 1$ |
| Inverses | $\log_b b^x = x$, $b^{\log_b x} = x$ |
| Product | $\log_b(MN) = \log_b M + \log_b N$ |
| Quotient | $\log_b \tfrac MN = \log_b M - \log_b N$ |
| Power | $\log_b M^k = k\log_b M$ |
| Change of base | $\log_b x = \dfrac{\ln x}{\ln b} = \dfrac{\log x}{\log b}$ |

No rule exists for $\log_b(M + N)$. $\log x$ means base 10; $\ln x$ means base $e$.

## Solving equations

| Equation | Method |
|---|---|
| $b^{f(x)} = b^{g(x)}$ | set $f(x) = g(x)$ |
| $b^{f(x)} = c$ | isolate, take $\ln$: $f(x) = \dfrac{\ln c}{\ln b}$ |
| $\log_b f(x) = c$ | $f(x) = b^c$; check arguments are positive |
| $\log_b f(x) = \log_b g(x)$ | $f(x) = g(x)$; check |
| Doubling time | $t = \dfrac{\ln 2}{\ln(1 + r)}$ |

## Sequences and series

| | Arithmetic | Geometric |
|---|---|---|
| Rule | add $d$ | multiply by $r$ |
| $n$th term | $a_n = a_1 + (n - 1)d$ | $a_n = a_1r^{n-1}$ |
| Sum of $n$ terms | $S_n = \dfrac{n(a_1 + a_n)}{2}$ | $S_n = \dfrac{a_1(1 - r^n)}{1 - r}$ |
| Infinite sum | diverges (unless all terms 0) | $S = \dfrac{a_1}{1 - r}$ if $\lvert r \rvert < 1$ |

Sigma notation: $\sum_{k=1}^{n} a_k = a_1 + a_2 + \cdots + a_n$.
