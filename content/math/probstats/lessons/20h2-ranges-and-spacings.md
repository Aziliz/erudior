---
id: ps-m4-h-ranges-spacings
module: ps-m4
honors: true
title: 'Joint order statistics: ranges and spacings'
minutes: 45
topics: [Ranges and spacings]
drills: [ps-m4-r2-uniform-range, ps-m4-r2-exp-order-mean, ps-m4-r2-exp-range]
refs: [ps-ref-estimation]
---
## Two order statistics at once

The core lesson found the distribution of a *single* order statistic: the minimum, the maximum,
or the $k$th smallest of $n$ iid values. Many practical questions involve two of them together.
How spread out is a batch of measurements (the **sample range** $X_{(n)} - X_{(1)}$)? After the
first of five pumps fails, how long until the second? A system that needs 3 of its 5 components
working fails at the third failure; what is its expected life? These need the *joint* behaviour
of order statistics, and they lead to one of the prettiest facts in probability: the gaps between
exponential failure times are independent exponentials.

Throughout, $X_1, \dots, X_n$ are iid with cdf $F$ and density $f$, and $X_{(1)} < X_{(2)} < \cdots < X_{(n)}$
are their order statistics (ties have probability 0 for continuous variables).

## The joint density of all the order statistics

The sorted vector $(X_{(1)}, \dots, X_{(n)})$ has joint density

$$f(y_1, \dots, y_n) = n!\,f(y_1)f(y_2)\cdots f(y_n) \qquad \text{for } y_1 < y_2 < \cdots < y_n,$$

and 0 otherwise. *Why.* The sorted values land near $(y_1, \dots, y_n)$ when the unsorted sample lands
near any one of the $n!$ rearrangements of that point. Each rearrangement has the same density
$\prod f(y_i)$, because the $X_i$ are iid, and the regions are disjoint. Adding the $n!$ equal pieces
gives the formula. (Sorting just relabels coordinates, so no Jacobian factor appears.)

Integrating out all but two coordinates gives the joint density of $X_{(j)}$ and $X_{(k)}$ for $j < k$.
The same "boxes" count as in the core lesson works: $j - 1$ values below $u$, one at $u$, $k - j - 1$
between $u$ and $v$, one at $v$, and $n - k$ above $v$:

$$f_{(j),(k)}(u, v) = \frac{n!}{(j-1)!\,(k-j-1)!\,(n-k)!}\,F(u)^{j-1}f(u)\,\big[F(v) - F(u)\big]^{k-j-1}f(v)\,\big[1 - F(v)\big]^{n-k}, \quad u < v.$$

For the minimum and maximum ($j = 1$, $k = n$) this is $n(n-1)\,f(u)f(v)\,[F(v) - F(u)]^{n-2}$.

## The minimum and maximum through one event

There is a quicker route for the extremes, using the same trick as the core lesson. The minimum
exceeds $u$ and the maximum is at most $v$ exactly when *every* value lies in $(u, v]$:

$$P\big(X_{(1)} > u,\; X_{(n)} \le v\big) = \big[F(v) - F(u)\big]^n, \qquad u < v.$$

Combining this with $P(X_{(n)} \le v) = F(v)^n$ gives the joint cdf
$P(X_{(1)} \le u, X_{(n)} \le v) = F(v)^n - [F(v) - F(u)]^n$, and taking $\partial^2/\partial u\,\partial v$ gives back
$n(n-1)f(u)f(v)[F(v) - F(u)]^{n-2}$.

### Example 1: an early and a late reading

Five readings are iid Uniform(0, 1). Find the probability that at least one reading is below 0.1
*and* at least one is above 0.9.

Let $A = \{X_{(1)} \le 0.1\}$ and $B = \{X_{(5)} \ge 0.9\}$. By inclusion–exclusion on the complements,

$$P(A \cap B) = 1 - P(A^c) - P(B^c) + P(A^c \cap B^c) = 1 - 0.9^5 - 0.9^5 + 0.8^5.$$

Here $P(A^c \cap B^c)$ is the chance that all five lie in $(0.1, 0.9)$, which is $0.8^5$. Numerically
$1 - 2(0.59049) + 0.32768 \approx 0.147$. Multiplying $P(A)P(B) \approx 0.168$ would be wrong: the
minimum and maximum of one sample are dependent.

## The range of a uniform sample

For a Uniform(0, 1) sample, $F(u) = u$ and $f = 1$ on $(0, 1)$, so the min and max have joint density
$n(n-1)(v - u)^{n-2}$ on $0 < u < v < 1$. Change variables to $u$ and $r = v - u$ (the Jacobian is 1):
the density becomes $n(n-1)r^{n-2}$ on $0 < r < 1$, $0 < u < 1 - r$. Integrating out $u$ over an interval
of length $1 - r$,

$$f_R(r) = n(n-1)\,r^{n-2}(1 - r), \qquad P(R \le r) = n r^{n-1} - (n-1) r^n, \qquad 0 < r < 1.$$

This is a beta density with parameters $n - 1$ and 2, so $E[R] = \dfrac{n-1}{n+1}$. For Uniform$(0, \theta)$ data,
scale every value by $\theta$: $P(R \le r) = n(r/\theta)^{n-1} - (n-1)(r/\theta)^n$.

### Example 2

A rail-temperature logger records five readings that are iid Uniform(0, 1) in suitable units.
Find the chance the range is at most 0.5, and the expected range.

1. $P(R \le 0.5) = 5(0.5)^4 - 4(0.5)^5 = 0.3125 - 0.125 = 0.1875$.
2. $E[R] = \tfrac{4}{6} = \tfrac23$.

Five uniform readings usually spread over more than half the interval ($P(R > 0.5) = 0.8125$): the five points
cut $(0, 1)$ into six gaps of average length $\tfrac16$, and the range is everything except the two end gaps.

## Exponential spacings: the Rényi representation

Now let the $X_i$ be iid exponential with rate $\lambda$, such as the lifetimes of $n$ identical
components switched on together. Define the **spacings** (gaps between successive order statistics)

$$D_1 = X_{(1)}, \quad D_2 = X_{(2)} - X_{(1)}, \quad \dots, \quad D_n = X_{(n)} - X_{(n-1)}.$$

**Rényi representation**: $D_1, \dots, D_n$ are independent, and $D_k$ is exponential with rate
$(n - k + 1)\lambda$.

*Why, by memorylessness.* The first failure is the minimum of $n$ independent exponentials,
exponential with rate $n\lambda$ (core lesson). At that moment the other $n - 1$ components are still
working, and by the memoryless property each one's remaining life is a fresh exponential with
rate $\lambda$, unaffected by how long the wait was. So the next gap is the minimum of $n - 1$ fresh
exponentials, rate $(n - 1)\lambda$, independent of $D_1$; and so on down to the last survivor, rate $\lambda$.

*Why, by the joint density.* The joint density of the order statistics is $n!\,\lambda^n e^{-\lambda\sum y_i}$
for $0 < y_1 < \cdots < y_n$. Since $y_k = d_1 + \cdots + d_k$, each $d_k$ is counted in $y_k, y_{k+1}, \dots, y_n$,
that is $n - k + 1$ times, so $\sum y_i = \sum_k (n - k + 1)d_k$. The map from the $y$'s to the $d$'s is
triangular with 1s on the diagonal (Jacobian 1), and $n! = \prod_k (n - k + 1)$, so the density of the
spacings is

$$\prod_{k=1}^{n} (n - k + 1)\lambda\, e^{-(n - k + 1)\lambda d_k}, \qquad d_k > 0,$$

a product of exponential densities: independent, with the claimed rates.

Adding the gaps gives the mean and variance of any order statistic:

$$E[X_{(k)}] = \frac1\lambda\sum_{i=1}^{k}\frac{1}{n - i + 1}, \qquad \operatorname{Var}(X_{(k)}) = \frac1{\lambda^2}\sum_{i=1}^{k}\frac{1}{(n - i + 1)^2}.$$

![Five failure times on a time axis with the gaps between them](images/ps-m4-h-spacings.svg)

### Example 3: a 3-out-of-5 system

Five pumps have iid exponential lifetimes with mean 1000 hours ($\lambda = 0.001$). A station needs
at least 3 working, so it fails at the third failure, $X_{(3)}$. A design that needs only 1 working
(a parallel system) fails at $X_{(5)}$. Find both expected lifetimes and the SD of $X_{(3)}$.

1. The first three gaps have rates $5\lambda$, $4\lambda$, $3\lambda$, so
   $E[X_{(3)}] = 1000\big(\tfrac15 + \tfrac14 + \tfrac13\big) \approx 783$ hours.
2. $\operatorname{Var}(X_{(3)}) = 1000^2\big(\tfrac1{25} + \tfrac1{16} + \tfrac19\big) \approx 213{,}611$, so the SD is about 462 hours.
3. Parallel: $E[X_{(5)}] = 1000\big(\tfrac15 + \tfrac14 + \tfrac13 + \tfrac12 + 1\big) \approx 2283$ hours.

The gaps grow as fewer pumps remain: the last survivor alone contributes a full 1000 hours on
average. Seen the other way, each extra pump adds less than the one before (the fifth adds only
$1000/5 = 200$ hours to the parallel design), so redundancy has diminishing returns. Such a design is a **k-out-of-n system**: it works while at least $k$ of its
$n$ components work, so it fails at failure number $n - k + 1$. Series ($k = n$) and parallel ($k = 1$) are the
two extremes.

### Example 4: how close together are the failures?

Four components have iid exponential lifetimes with mean 200 hours. Find the chance that all
four failures happen within 100 hours of the first one.

The range is $R = D_2 + D_3 + D_4$, a sum of independent exponentials with rates $3\lambda$, $2\lambda$, $\lambda$.
That is exactly the Rényi decomposition of the *maximum* of three iid exponentials with rate $\lambda$.
So $R$ has the same distribution as the maximum of three, and

$$P(R \le 100) = \big(1 - e^{-100/200}\big)^3 = (1 - e^{-0.5})^3 \approx 0.0609.$$

In general the range of $n$ iid exponentials is distributed as the maximum of $n - 1$ of them.

## Common mistakes

- *Treating the minimum and maximum as independent.* They come from the same sample; their joint
  cdf is $F(v)^n - [F(v) - F(u)]^n$, not a product.
- *Giving every gap the rate $\lambda$.* The $k$th gap has rate $(n - k + 1)\lambda$: early gaps are short because
  many components are racing.
- *Forgetting the $n!$* in the joint density of all order statistics (it is what makes the density
  integrate to 1 over the ordered region).
- *Mixing up $k$-out-of-$n$ with "fails at failure $k$".* The system fails at failure $n - k + 1$.
- *Using Rényi's result for non-exponential data.* It relies on memorylessness; uniform spacings
  are not independent (they must add to at most 1).

## Key points

- All order statistics: density $n!\prod f(y_i)$ on $y_1 < \cdots < y_n$.
- Extremes: $P(X_{(1)} > u, X_{(n)} \le v) = [F(v) - F(u)]^n$; joint density $n(n-1)f(u)f(v)[F(v) - F(u)]^{n-2}$.
- Uniform(0, 1) range: $P(R \le r) = nr^{n-1} - (n-1)r^n$, mean $(n-1)/(n+1)$.
- Exponential spacings are independent, $D_k \sim$ exponential with rate $(n - k + 1)\lambda$.
- $E[X_{(k)}] = \frac1\lambda\sum_{i=1}^k \frac1{n-i+1}$; the exponential range of $n$ is distributed as the maximum of $n - 1$.
