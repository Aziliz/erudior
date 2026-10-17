---
id: ps-conditional-indep
module: ps-m4
title: Conditional distributions and independence
minutes: 35
topics: [Conditional distributions, Independence of random variables]
drills: [ps-d-cond-table, ps-d-cond-density, ps-d-exp-race]
refs: [ps-ref-estimation]
---
## Learning about one variable from another

The joint distribution from the last lesson describes a pair $(X, Y)$ all at once. Often we
observe one of them and want to update our beliefs about the other: given that a train is 10
minutes late, how is its dwell time distributed? This is conditional probability, applied
to whole distributions instead of single events. When observing $X$ never changes the
distribution of $Y$, the variables are independent, the property that makes most of
statistics workable.

## Conditional pmfs

For discrete $X, Y$ and a value $x$ with $p_X(x) > 0$, the **conditional probability mass function** of $Y$ given $X = x$ is

$$p_{Y \mid X}(y \mid x) = P(Y = y \mid X = x) = \frac{p(x, y)}{p_X(x)}.$$

This is just $P(B \mid A) = P(A \cap B)/P(A)$ with $A = \{X = x\}$ and $B = \{Y = y\}$. For a fixed $x$
it is a genuine pmf in $y$: nonnegative, and summing over $y$ gives $p_X(x)/p_X(x) = 1$. In a
table, conditioning on $X = x$ means taking the row for $x$ and dividing it by its row total.

In the inspection table from the last lesson, the row $x = 2$ is $(0.10, 0.15)$ with total 0.25, so

$$P(Y = 0 \mid X = 2) = 0.4, \qquad P(Y = 1 \mid X = 2) = 0.6.$$

Unconditionally, $P(Y = 1) = 0.40$. Learning that both pads are worn raises the chance of a
wheel flat to 0.60.

## Conditional pdfs

For continuous variables we cannot divide by $P(X = x) = 0$. Instead, for any $x$ with
$f_X(x) > 0$, define the **conditional probability density function**

$$f_{Y \mid X}(y \mid x) = \frac{f(x, y)}{f_X(x)}.$$

Why is this the right object? Condition on the thin strip $x \le X \le x + h$ instead of a single
point:

$$P(Y \le b \mid x \le X \le x + h) = \frac{\int_x^{x+h}\int_{-\infty}^{b} f(s, t)\,dt\,ds}{\int_x^{x+h} f_X(s)\,ds} \approx \frac{h\int_{-\infty}^{b} f(x, t)\,dt}{h\,f_X(x)}.$$

The $h$'s cancel, and as $h \to 0$ the result is $\int_{-\infty}^{b} f(x, t)/f_X(x)\,dt$. So
$f(x, y)/f_X(x)$ is the density that gives conditional probabilities given $X = x$.
Geometrically: slice the joint density surface at $X = x$, then rescale the slice so its area
is 1.

Rearranging gives the multiplication rule $f(x, y) = f_X(x)\,f_{Y \mid X}(y \mid x)$, which
is how joint models are usually *built*: choose the distribution of $X$, then describe $Y$
for each value of $X$.

### Example 1

For $f(x, y) = 8xy$ on $0 < y < x < 1$ we found $f_X(x) = 4x^3$. Find $f_{Y \mid X}(y \mid x)$ and
$P(Y < \tfrac12 \mid X = 0.8)$.

1. Divide: $f_{Y \mid X}(y \mid x) = \dfrac{8xy}{4x^3} = \dfrac{2y}{x^2}$ for $0 < y < x$. The range
   matters: given $X = x$, $Y$ lives on $(0, x)$.
2. Check it integrates to 1: $\int_0^x 2y/x^2\,dy = x^2/x^2 = 1$.
3. With $x = 0.8$: $P(Y < \tfrac12 \mid X = 0.8) = \int_0^{0.5} \dfrac{2y}{0.64}\,dy = \dfrac{0.25}{0.64} = \dfrac{25}{64} \approx 0.391$.

```plot
{"x": [0, 1.1], "y": [0, 8.5], "xLabel": "y", "yLabel": "density", "functions": [{"f": "2x/0.25", "from": 0, "to": 0.5, "label": "x = 0.5"}, {"f": "2x/0.64", "from": 0, "to": 0.8, "label": "x = 0.8"}, {"f": "2x", "from": 0, "to": 1, "label": "x = 1"}], "caption": "Conditional densities 2y/x² of Y given X = x: each lives on (0, x) and has area 1"}
```

### Example 2: building a joint from a story

A break in a cable is at a uniform position $X$ along a 1 km section, and the repair crew's
first probe lands uniformly between the start and the break: $Y \mid X = x \sim \text{Uniform}(0, x)$.
Find the joint density, the marginal density of $Y$, and $P(Y < \tfrac14)$.

1. Multiplication rule: $f(x, y) = f_X(x)\,f_{Y \mid X}(y \mid x) = 1 \cdot \dfrac1x$ on $0 < y < x < 1$.
2. Marginal of $Y$: fix $y \in (0, 1)$; $x$ runs from $y$ to 1, so
   $f_Y(y) = \int_y^1 \dfrac{dx}{x} = -\ln y$ for $0 < y < 1$. (It is unbounded near 0: probes cluster
   near the start.)
3. $P(Y < \tfrac14) = \int_0^{1/4} (-\ln y)\,dy = \big[\,y - y\ln y\,\big]_0^{1/4} = \tfrac14 + \tfrac14\ln 4 \approx 0.597.$

Note how a simple two-step story produced a marginal that is not uniform at all.

## Independence of random variables

$X$ and $Y$ are **independent random variables** if every event about $X$ is independent of
every event about $Y$. It is enough to check that the joint distribution factors:

$$p(x, y) = p_X(x)\,p_Y(y) \quad\text{or}\quad f(x, y) = f_X(x)\,f_Y(y) \quad \text{for all } x, y,$$

equivalently $F(x, y) = F_X(x)\,F_Y(y)$. Under independence the conditional distribution
equals the marginal: $f_{Y \mid X}(y \mid x) = f_X(x)f_Y(y)/f_X(x) = f_Y(y)$, so knowing $X$ tells us
nothing about $Y$.

The inspection table is not independent: $p(0, 0) = 0.30$ but $p_X(0)\,p_Y(0) = 0.40 \times 0.60 = 0.24$.
One failing cell is enough.

The **factorization criterion**: if the joint density can be written $f(x, y) = g(x)\,h(y)$ for
*all* $(x, y)$ (including where it is zero), then $X$ and $Y$ are independent; the
constants sort themselves out when you normalize $g$ and $h$. The fine print "for all" is
where people slip: the support itself must be a product set (a rectangle, possibly
infinite). The density $8xy$ *looks* like $g(x)h(y)$, but it is $8xy \cdot \mathbf{1}\{0 < y < x < 1\}$,
and the indicator ties $x$ and $y$ together. Indeed $f_X f_Y = 4x^3 \cdot 4y(1-y^2) \ne 8xy$.
*A non-rectangular support always means dependence*: learning $X = 0.3$ forces $Y < 0.3$.

### Example 3: which failure comes first?

A pump's seal fails after an exponential time $X$ with mean 2 years (rate $a = 0.5$), and its
bearing after an independent exponential time $Y$ with mean 4 years (rate $b = 0.25$). Find
$P(X < Y)$, the chance the seal fails first.

By independence the joint density is $f(x, y) = a e^{-ax} \cdot b e^{-by}$ for $x, y > 0$. The event is
the region above the line $y = x$:

$$P(X < Y) = \int_0^\infty a e^{-ax}\left[\int_x^\infty b e^{-by}\,dy\right] dx = \int_0^\infty a e^{-ax} e^{-bx}\,dx = \frac{a}{a + b}.$$

Here $P(X < Y) = 0.5/0.75 = \tfrac23$. The formula is worth remembering: in a race between
independent exponentials, each wins with probability proportional to its rate.

## Many variables; iid samples

Random variables $X_1, \dots, X_n$ are (mutually) independent if their joint pmf or pdf is the
product of the $n$ marginals. Functions of independent variables are independent too: if $X$
and $Y$ are independent, so are $X^2$ and $e^Y$.

If in addition they all have the same distribution, they are **independent and identically distributed** (**iid**). A random sample $X_1, \dots, X_n$ from a population is modeled as
iid, so its joint density is simply $\prod_{i=1}^n f(x_i)$. This product will reappear as the
likelihood function in Module 6.

## Common mistakes

- *Dividing by the wrong marginal.* $f_{Y \mid X}$ divides by $f_X$; dividing by $f_Y$ gives
  $f_{X \mid Y}$.
- *Dropping the conditional range.* $f_{Y \mid X}(y \mid x) = 2y/x^2$ is only valid for $0 < y < x$.
- *Declaring independence from the formula alone.* Check that the support is a rectangle;
  $8xy$ on a triangle is dependent.
- *Checking one cell.* Independence needs the product rule in *every* cell; dependence
  needs only one failure.
- *Confusing independent with disjoint.* Events $\{X = 1\}$ and $\{Y = 1\}$ can both have
  positive probability and still be independent; disjoint events with positive probability
  never are.

## Key points

- $p_{Y \mid X}(y \mid x) = p(x, y)/p_X(x)$ and $f_{Y \mid X}(y \mid x) = f(x, y)/f_X(x)$; each is a
  distribution in $y$ for fixed $x$.
- Multiplication rule: $f(x, y) = f_X(x) f_{Y \mid X}(y \mid x)$ builds joint models from stories.
- Independent $\iff$ joint = product of marginals everywhere $\iff$ conditionals equal
  marginals.
- Factorization works only on a rectangular support.
- Independent exponentials: $P(X < Y) = a/(a + b)$.
- iid sample: joint density $\prod f(x_i)$.
