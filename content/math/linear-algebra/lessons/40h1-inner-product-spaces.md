---
id: la-m9-h-inner-product-spaces
module: la-m9
title: Inner product spaces and Fourier approximation
minutes: 50
honors: true
topics: [Inner product spaces, Fourier approximation]
drills: [la-m9-r2-eval-ip, la-m9-r2-weighted, la-m9-r2-fourier]
refs: [la-ref-factor]
---
## Geometry without arrows

Look back at the proofs in this module: orthogonal sets are independent, the projection
formula, the best approximation theorem, Gram–Schmidt. None of them ever used the formula
$u_1v_1 + \cdots + u_nv_n$. Every step used only four facts about the dot product: it is
symmetric, it distributes over sums, scalars pull out, and $\mathbf{v}\cdot\mathbf{v} > 0$ for
$\mathbf{v} \ne \mathbf{0}$. So any other operation with those four properties brings the whole
toolkit along: lengths, angles, projections, closest points, least squares.

This lesson makes that precise and uses it on vector spaces of functions (Module 7 showed
that polynomials and functions are vectors too). The payoff is a striking idea: "the best
approximation of a function by simpler functions" is an orthogonal projection, computed
with exactly the formulas you already know. Fourier series, one of the most used tools in
physics and engineering, turn out to be projections onto an orthogonal set.

Calculus note: the function examples use definite integrals of polynomials and of
$\sin$ and $\cos$. The needed integrals are given; the linear algebra is the point.

## Inner products in general

> An **inner product space** is a vector space $V$ with an operation $\langle \mathbf{u}, \mathbf{v}\rangle$ that gives a real number for every pair of vectors and satisfies, for all $\mathbf{u}, \mathbf{v}, \mathbf{w}$ in $V$ and scalars $c$:
> 1. $\langle \mathbf{u}, \mathbf{v}\rangle = \langle \mathbf{v}, \mathbf{u}\rangle$;
> 2. $\langle \mathbf{u} + \mathbf{v}, \mathbf{w}\rangle = \langle \mathbf{u}, \mathbf{w}\rangle + \langle \mathbf{v}, \mathbf{w}\rangle$;
> 3. $\langle c\mathbf{u}, \mathbf{v}\rangle = c\langle \mathbf{u}, \mathbf{v}\rangle$;
> 4. $\langle \mathbf{u}, \mathbf{u}\rangle \ge 0$, with equality only when $\mathbf{u} = \mathbf{0}$.

Then we *define* $\|\mathbf{v}\| = \sqrt{\langle \mathbf{v}, \mathbf{v}\rangle}$,
$\operatorname{dist}(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|$, and call $\mathbf{u}, \mathbf{v}$
orthogonal when $\langle \mathbf{u}, \mathbf{v}\rangle = 0$. Four families of examples:

- *Weighted dot products on* $\mathbb{R}^n$: $\langle \mathbf{u}, \mathbf{v}\rangle = w_1u_1v_1 + \cdots + w_nu_nv_n$ with every weight $w_i > 0$. Weights let some measurements count more than others (in statistics, more reliable data gets more weight).
- *Matrix inner products*: $\langle \mathbf{u}, \mathbf{v}\rangle = \mathbf{u}^TA\mathbf{v}$ for a symmetric positive definite matrix $A$. Axiom 4 is exactly the definition of positive definite, which is one reason those matrices matter.
- *Evaluation inner products on* $\mathbb{P}_n$: pick $n + 1$ different numbers $t_0, \dots, t_n$ and set $\langle p, q\rangle = p(t_0)q(t_0) + \cdots + p(t_n)q(t_n)$. Axiom 4 holds because a nonzero polynomial of degree at most $n$ has at most $n$ roots, so it can't vanish at all $n + 1$ points.
- *Integral inner products* on continuous functions on $[a, b]$: $\langle f, g\rangle = \displaystyle\int_a^b f(t)g(t)\,dt$. Axiom 4 holds because $\int_a^b f(t)^2\,dt > 0$ for a continuous $f$ that is not identically 0.

Not everything qualifies. $\langle \mathbf{u}, \mathbf{v}\rangle = u_1v_1 - u_2v_2$ on $\mathbb{R}^2$ fails
axiom 4: $\langle (0, 1), (0, 1)\rangle = -1$. And $\langle \mathbf{u}, \mathbf{v}\rangle = u_1v_2$ fails axiom 1.

*Orthogonality depends on the inner product.* With $\langle \mathbf{u}, \mathbf{v}\rangle = 4u_1v_1 + u_2v_2$,
the vectors $(1, 2)$ and $(1, -2)$ are orthogonal ($4 - 4 = 0$), although their ordinary dot
product is $1 - 4 = -3$. Their weighted lengths are both $\sqrt{4 + 4} = \sqrt8$.

## Two inequalities that hold in every inner product space

> The **Cauchy–Schwarz inequality**: $|\langle \mathbf{u}, \mathbf{v}\rangle| \le \|\mathbf{u}\|\,\|\mathbf{v}\|$, with equality exactly when one vector is a multiple of the other.

*Proof.* If $\mathbf{u} = \mathbf{0}$ both sides are 0. Otherwise let $\hat{\mathbf{v}} = \dfrac{\langle \mathbf{v}, \mathbf{u}\rangle}{\langle \mathbf{u}, \mathbf{u}\rangle}\mathbf{u}$,
the projection of $\mathbf{v}$ onto $\mathbf{u}$. Then $\mathbf{v} - \hat{\mathbf{v}}$ is orthogonal to
$\mathbf{u}$, so by Pythagoras $\|\mathbf{v}\|^2 = \|\hat{\mathbf{v}}\|^2 + \|\mathbf{v} - \hat{\mathbf{v}}\|^2 \ge \|\hat{\mathbf{v}}\|^2 = \dfrac{\langle \mathbf{u}, \mathbf{v}\rangle^2}{\|\mathbf{u}\|^2}$.
Multiply by $\|\mathbf{u}\|^2$ and take square roots. Equality needs $\mathbf{v} = \hat{\mathbf{v}}$,
a multiple of $\mathbf{u}$. $\square$

So a projection is never longer than the vector it came from. Cauchy–Schwarz is what makes
angles meaningful everywhere: it guarantees $-1 \le \dfrac{\langle \mathbf{u}, \mathbf{v}\rangle}{\|\mathbf{u}\|\|\mathbf{v}\|} \le 1$,
so the number has an inverse cosine. It is named for Augustin-Louis Cauchy, who proved
the version for sums in 1821, and Hermann Schwarz, who proved an integral version in 1888
(Viktor Bunyakovsky had published one in 1859).

> The **triangle inequality**: $\|\mathbf{u} + \mathbf{v}\| \le \|\mathbf{u}\| + \|\mathbf{v}\|$.

*Proof.* $\|\mathbf{u} + \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + 2\langle \mathbf{u}, \mathbf{v}\rangle + \|\mathbf{v}\|^2 \le \|\mathbf{u}\|^2 + 2\|\mathbf{u}\|\|\mathbf{v}\| + \|\mathbf{v}\|^2 = (\|\mathbf{u}\| + \|\mathbf{v}\|)^2$,
using Cauchy–Schwarz in the middle. $\square$ Geometrically: one side of a triangle is never
longer than the other two together, and that now holds for "triangles" of functions.

### Example 1

In $\mathbb{P}_2$ with the evaluation inner product at $t = -1, 0, 1$, let $p(t) = 1 + t$ and $q(t) = t^2$. Find $\langle p, q\rangle$, both lengths, and check Cauchy–Schwarz. Then make $\{1, t, t^2\}$ orthogonal.

1. Values: $p$ is $(0, 1, 2)$ at $t = -1, 0, 1$ and $q$ is $(1, 0, 1)$. So $\langle p, q\rangle = 0 + 0 + 2 = 2$.
2. $\|p\| = \sqrt{0 + 1 + 4} = \sqrt5$ and $\|q\| = \sqrt{1 + 0 + 1} = \sqrt2$. Cauchy–Schwarz: $2 \le \sqrt{10} \approx 3.16$. ✓
3. Gram–Schmidt on $1, t, t^2$: the value lists are $(1, 1, 1)$, $(-1, 0, 1)$, $(1, 0, 1)$. $\langle t, 1\rangle = 0$, so $t$ stays.
4. $\langle t^2, 1\rangle = 2$, $\langle 1, 1\rangle = 3$ and $\langle t^2, t\rangle = 0$, so the third vector is $t^2 - \tfrac23$.
5. Check: $t^2 - \tfrac23$ has values $(\tfrac13, -\tfrac23, \tfrac13)$, whose sum is 0 (so it's orthogonal to 1), and $-\tfrac13 + 0 + \tfrac13 = 0$ (orthogonal to $t$). ✓

The evaluation inner product only looks at the three values, so working in $\mathbb{P}_2$ here is
really working with vectors in $\mathbb{R}^3$. Least-squares fitting of a parabola through data at
$t = -1, 0, 1$ is this computation in disguise.

## Orthogonal polynomials

Now use the integral inner product $\langle f, g\rangle = \int_{-1}^{1} f(t)g(t)\,dt$. The integrals
needed are $\int_{-1}^1 t^k\,dt = \dfrac{2}{k + 1}$ for even $k$ and 0 for odd $k$ (odd powers cancel
on a symmetric interval). Gram–Schmidt on $1, t, t^2, t^3$:

- $\langle t, 1\rangle = 0$, so $t$ stays.
- $\langle t^2, 1\rangle = \tfrac23$, $\langle 1, 1\rangle = 2$, $\langle t^2, t\rangle = 0$: the next one is $t^2 - \tfrac13$.
- $\langle t^3, 1\rangle = 0$, $\langle t^3, t\rangle = \tfrac25$, $\langle t, t\rangle = \tfrac23$, $\langle t^3, t^2 - \tfrac13\rangle = 0$: the next one is $t^3 - \tfrac35t$.

Up to scaling, $1,\ t,\ t^2 - \tfrac13,\ t^3 - \tfrac35t$ are the **Legendre polynomials**, which
Adrien-Marie Legendre introduced in the 1780s while studying gravitational attraction. The
usual scaling makes each equal 1 at $t = 1$: $P_2(t) = \tfrac12(3t^2 - 1)$ and $P_3(t) = \tfrac12(5t^3 - 3t)$.

```plot
{"xLabel": "t", "x": [-1, 1], "y": [-1.2, 1.2], "functions": [{"f": "1"}, {"f": "x"}, {"f": "(3*x^2 - 1)/2"}, {"f": "(5*x^3 - 3*x)/2"}], "labels": [{"at": [-0.6, 1.1], "text": "P₀"}, {"at": [0.62, 0.72], "text": "P₁"}, {"at": [0.08, -0.65], "text": "P₂"}, {"at": [-0.45, 0.6], "text": "P₃"}], "caption": "The first four Legendre polynomials, orthogonal under the integral inner product on [−1, 1]"}
```

### Example 2

Find the best approximation of $f(t) = |t|$ on $[-1, 1]$ by a polynomial of degree at most 2, in the integral inner product, and its error.

1. Use the orthogonal basis $1,\ t,\ t^2 - \tfrac13$ of $\mathbb{P}_2$. The projection is $\hat f = c_0 + c_1t + c_2(t^2 - \tfrac13)$ with $c_j = \langle f, \text{basis}_j\rangle / \langle \text{basis}_j, \text{basis}_j\rangle$.
2. $\langle |t|, 1\rangle = \int_{-1}^1 |t|\,dt = 1$ and $\langle 1, 1\rangle = 2$, so $c_0 = \tfrac12$.
3. $|t|\cdot t$ is odd, so $\langle |t|, t\rangle = 0$ and $c_1 = 0$.
4. $\langle |t|, t^2 - \tfrac13\rangle = 2\int_0^1 (t^3 - \tfrac13t)\,dt = 2\left(\tfrac14 - \tfrac16\right) = \tfrac16$, and $\langle t^2 - \tfrac13, t^2 - \tfrac13\rangle = \tfrac25 - \tfrac49 + \tfrac29 = \tfrac{8}{45}$. So $c_2 = \tfrac16 \cdot \tfrac{45}{8} = \tfrac{15}{16}$.
5. $\hat f(t) = \tfrac12 + \tfrac{15}{16}\left(t^2 - \tfrac13\right) = \dfrac{15t^2 + 3}{16}$.
6. Error: by Pythagoras, $\|f - \hat f\|^2 = \|f\|^2 - \|\hat f\|^2 = \tfrac23 - \left(\tfrac14\cdot 2 + \tfrac{225}{256}\cdot\tfrac{8}{45}\right) = \tfrac23 - \tfrac{21}{32} = \tfrac{1}{96}$, so $\|f - \hat f\| = \tfrac{1}{\sqrt{96}} \approx 0.102$.

No Taylor polynomial exists here ($|t|$ has a corner at 0), yet the projection gives the
quadratic that is closest *on average over the whole interval*.

```plot
{"xLabel": "t", "x": [-1, 1], "y": [-0.1, 1.2], "functions": [{"f": "abs(x)", "label": "|t|"}, {"f": "(15*x^2 + 3)/16", "label": "best quadratic", "dashed": true}], "caption": "|t| and its least-squares quadratic (15t² + 3)/16 on [−1, 1]"}
```

## Fourier approximation

On $[-\pi, \pi]$ with $\langle f, g\rangle = \int_{-\pi}^{\pi} f(t)g(t)\,dt$, the functions

$$1,\ \cos t,\ \sin t,\ \cos 2t,\ \sin 2t,\ \dots,\ \cos nt,\ \sin nt$$

form an orthogonal set: the integral of a product of two different ones is 0. (Each such
product is a sum of cosines or of sines of whole multiples of $t$, by the product-to-sum
identities, and those integrate to 0 over a full period.) Their squared lengths are
$\langle 1, 1\rangle = 2\pi$ and $\langle \cos kt, \cos kt\rangle = \langle \sin kt, \sin kt\rangle = \pi$
for $k \ge 1$. A combination of them is a **trigonometric polynomial** of order $n$.

Projecting $f$ onto their span uses the usual formula, coefficient by coefficient. The
results are the **Fourier coefficients**

$$a_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f(t)\cos kt\,dt, \qquad b_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f(t)\sin kt\,dt,$$

and the best approximation of order $n$ is

$$f(t) \approx \frac{a_0}{2} + \sum_{k=1}^{n}\left(a_k\cos kt + b_k\sin kt\right).$$

(The constant term is $\dfrac{\langle f, 1\rangle}{\langle 1, 1\rangle} = \dfrac{1}{2\pi}\int f = \dfrac{a_0}{2}$.)
Letting $n \to \infty$ gives the **Fourier series** of $f$. Joseph Fourier used such series in
his work on heat flow in the early 1800s (his book on the theory of heat appeared in 1822).

### Example 3

Find the Fourier approximations of $f(t) = t$ on $[-\pi, \pi]$.

1. $t\cos kt$ is odd, so every $a_k = 0$ (including $a_0$).
2. For the sines, $\int_{-\pi}^{\pi} t\sin kt\,dt = \dfrac{2\pi(-1)^{k+1}}{k}$ (integration by parts), so $b_k = \dfrac{2(-1)^{k+1}}{k}$: $b_1 = 2$, $b_2 = -1$, $b_3 = \tfrac23$.
3. Order 3: $t \approx 2\sin t - \sin 2t + \tfrac23\sin 3t$.
4. The error $\|f - \hat f\|$ shrinks as $n$ grows: about 2.85 for $n = 1$, 1.89 for $n = 3$ and 1.09 for $n = 10$, against $\|f\| \approx 4.55$. That it tends to 0 for every continuous $f$ (and many others) is a theorem of analysis that we state without proof.

```plot
{"xLabel": "t", "x": [-3.2, 3.2], "y": [-3.6, 3.6], "functions": [{"f": "x", "label": "t"}, {"f": "2*sin(x)", "dashed": true}, {"f": "2*sin(x) - sin(2*x) + 2*sin(3*x)/3"}], "labels": [{"at": [1.6, 2.3], "text": "n = 1"}, {"at": [-2.45, -3.25], "text": "n = 3"}], "caption": "f(t) = t on [−π, π] with its Fourier approximations of order 1 and 3"}
```

Near $t = \pm\pi$ the approximations stay poor: every term is 0 there, while $f$ is near
$\pm\pi$. The approximations are best *on average*, which is exactly what a projection
promises. Approximating in this sense is how sound, images and signals are analyzed into
frequencies.

## Common mistakes

- *Assuming every formula is an inner product.* Check all four axioms; positivity (axiom 4) is the one that usually fails.
- *Using the dot product after changing the inner product.* Lengths, angles and orthogonality all change with the inner product, so every projection coefficient must use the new one.
- *Forgetting the denominators.* In the Fourier formulas, $\langle \cos kt, \cos kt\rangle = \pi$ but $\langle 1, 1\rangle = 2\pi$; that is why the constant term is $\tfrac{a_0}{2}$.
- *Using the projection formula with a non-orthogonal basis.* $1, t, t^2$ is not orthogonal under the integral inner product ($\langle 1, t^2\rangle = \tfrac23$); orthogonalize first.
- *Expecting a pointwise match.* A best approximation minimizes $\|f - \hat f\|$, an average; it can still be far off at particular points.

## Key points

- Any operation with the four inner product properties gives lengths, distances, angles, orthogonality, projections and Gram–Schmidt, with the same formulas.
- Cauchy–Schwarz: $|\langle \mathbf{u}, \mathbf{v}\rangle| \le \|\mathbf{u}\|\|\mathbf{v}\|$; triangle inequality: $\|\mathbf{u} + \mathbf{v}\| \le \|\mathbf{u}\| + \|\mathbf{v}\|$.
- Gram–Schmidt on $1, t, t^2, \dots$ with $\int_{-1}^1 fg$ gives the Legendre polynomials $1, t, t^2 - \tfrac13, t^3 - \tfrac35t, \dots$ (up to scaling).
- The best approximation of $f$ from a subspace is its orthogonal projection; the error satisfies $\|f - \hat f\|^2 = \|f\|^2 - \|\hat f\|^2$.
- Fourier coefficients are projection coefficients onto the orthogonal set $1, \cos kt, \sin kt$ on $[-\pi, \pi]$.
