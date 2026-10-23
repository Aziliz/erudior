---
id: calc-h1-sequence-limits
module: calc-h1
title: Sequence limits, precisely
minutes: 45
topics: [Proving sequence limits, Subsequences]
drills: [calc-h1-r2-epsilon-n, calc-h1-r2-geometric-n]
refs: [calc-ref-limits, calc-ref-series]
---
## Why rebuild what already works

Lesson 40 said a sequence converges to $L$ when its terms get "arbitrarily close" to $L$ as $n$ grows, and Lesson 4 turned "close" into a precise ε-δ statement for functions. This honors module goes one level deeper, the way a first college course in **real analysis** does: it asks why the big theorems of calculus are true at all. The answer, built over four lessons, is a single property of the real numbers called completeness (Lesson 91). It makes the Intermediate Value, Extreme Value and Mean Value Theorems work (Lesson 92), and it decides which functions can be integrated (Lesson 93).

Sequences come first because they are the simplest limits, and because the later proofs are built out of them. This lesson gives the precise definition, shows how to prove that a sequence converges or diverges, and proves three basic facts you have been using without proof.

## The ε–N definition

The precise definition of the **limit of a sequence** has the same ε–N form as a limit at infinity, with whole numbers $n$ in place of $x$. $\displaystyle\lim_{n\to\infty} a_n = L$ means

> for every $\varepsilon > 0$ there is a number $N$ such that $|a_n - L| < \varepsilon$ for every $n > N$.

Read it as the same challenge game as ε-δ. A skeptic names a tolerance $\varepsilon$. You must answer with a cutoff $N$ so that *every* term after the cutoff lies inside the band from $L - \varepsilon$ to $L + \varepsilon$. If you can always answer, however small $\varepsilon$ is, the limit is $L$.

![A sequence plotted as dots against n. The dots alternate above and below a horizontal line at height L and close in on it. A shaded band runs from L − ε to L + ε. A dashed vertical line marks the index N; every dot to the right of N lies inside the band, while some earlier dots, such as the first term, lie outside it.](images/calc-h1-epsilon-band.svg)

Three things the definition says, and one it doesn't:

- *$N$ depends on $\varepsilon$.* Smaller tolerances usually need later cutoffs. $N$ never depends on $n$.
- *Only the tail matters.* The first million terms can be anything; changing finitely many terms never changes whether, or to what, a sequence converges.
- *Any larger $N$ also works.* You are not asked for the best cutoff, only for one that works. That freedom is what makes proofs manageable.
- It does *not* say the terms get closer to $L$ at every step. They can wander (like the dots above) as long as they eventually stay in every band.

### Example 1 (solve for the cutoff)

Prove that $a_n = \dfrac{2n + 3}{n + 1}$ converges to 2, and give a cutoff for $\varepsilon = 0.01$.

*Scratch work.* Simplify the distance first:
$$|a_n - 2| = \left|\frac{2n + 3 - 2(n + 1)}{n + 1}\right| = \frac{1}{n + 1}.$$
This is less than $\varepsilon$ exactly when $n + 1 > \frac1\varepsilon$, that is, when $n > \frac1\varepsilon - 1$.

*Proof.* Let $\varepsilon > 0$ and choose $N = \frac1\varepsilon - 1$. If $n > N$, then $n + 1 > \frac1\varepsilon$, so
$$|a_n - 2| = \frac{1}{n + 1} < \varepsilon.$$
For $\varepsilon = 0.01$ this gives $N = 99$: from $n = 100$ on, the distance is at most $\frac{1}{101} < 0.01$. Check the edge: $n = 99$ gives exactly $\frac{1}{100}$, which is not less than $0.01$, so 99 is the smallest cutoff.

### Example 2 (bound instead of solve)

Prove that $a_n = \dfrac{n^2 + 5}{2n^2 - n} \to \dfrac12$.

*Scratch work.* Over a common denominator,
$$\left|a_n - \tfrac12\right| = \frac{n + 10}{2n(2n - 1)}.$$
Solving "this $< \varepsilon$" exactly would mean solving a quadratic inequality. Instead, make the fraction *bigger but simpler*. For $n \ge 10$ the top is at most $n + n = 2n$, and the bottom has $2n - 1 \ge n$, so
$$\left|a_n - \tfrac12\right| \le \frac{2n}{2n\cdot n} = \frac1n.$$
And $\frac1n < \varepsilon$ once $n > \frac1\varepsilon$.

*Proof.* Given $\varepsilon > 0$, let $N = \max\!\left(10, \frac1\varepsilon\right)$. For $n > N$, both $n \ge 10$ and $n > \frac1\varepsilon$ hold, so $\left|a_n - \frac12\right| \le \frac1n < \varepsilon$.

For $\varepsilon = 0.001$ this proof uses $N = 1000$, while a computer search shows the true last term outside the band is $n = 260$. The proof is still correct: a generous cutoff is a valid cutoff. Bounding with simpler expressions, after first restricting $n$, is the main technique of the subject (the "restrict $\delta \le 1$" step in Lesson 4 is the same move).

## Proving that a sequence diverges

To show $a_n$ does *not* converge to $L$, negate the definition carefully: there is *one* $\varepsilon > 0$ such that for every $N$, some $n > N$ has $|a_n - L| \ge \varepsilon$. To show $a_n$ diverges, you must do that for *every* candidate $L$.

### Example 3

Prove that $a_n = (-1)^n$ diverges.

Take $\varepsilon = 1$ and any number $L$. Consecutive terms are $1$ and $-1$, which are 2 apart. If both were within 1 of $L$, the **triangle inequality** $|x + y| \le |x| + |y|$ would give
$$2 = |a_n - a_{n+1}| = |(a_n - L) + (L - a_{n+1})| \le |a_n - L| + |L - a_{n+1}| < 1 + 1 = 2,$$
which is impossible. So past any cutoff, at least one of every two consecutive terms is at least 1 away from $L$. No $L$ works: the sequence diverges, even though it is bounded.

## Three facts, now proved

*1. A sequence has at most one limit.* Suppose $a_n \to L$ and $a_n \to M$ with $L \ne M$. Take $\varepsilon = \frac{|L - M|}{2}$. Past some cutoff every term is within $\varepsilon$ of $L$, and past another, within $\varepsilon$ of $M$. Past both cutoffs, a single term $a_n$ satisfies
$$|L - M| \le |L - a_n| + |a_n - M| < \varepsilon + \varepsilon = |L - M|,$$
a contradiction. So $L = M$.

*2. A convergent sequence is bounded.* Take $\varepsilon = 1$: past some $N$, every term lies in $(L - 1, L + 1)$. Only finitely many terms come before $N$, and finitely many numbers always have a largest absolute value. So one number bounds them all. The converse is false: $(-1)^n$ is bounded and diverges.

*3. The sum law.* If $a_n \to L$ and $b_n \to M$, then $a_n + b_n \to L + M$.

*Proof.* Let $\varepsilon > 0$. Use the tolerance $\frac\varepsilon2$ on each sequence: there is $N_1$ with $|a_n - L| < \frac\varepsilon2$ for $n > N_1$, and $N_2$ with $|b_n - M| < \frac\varepsilon2$ for $n > N_2$. Let $N = \max(N_1, N_2)$. For $n > N$, both hold, and the triangle inequality gives
$$|(a_n + b_n) - (L + M)| \le |a_n - L| + |b_n - M| < \tfrac\varepsilon2 + \tfrac\varepsilon2 = \varepsilon.$$

The "$\frac\varepsilon2$ trick" and "take the max of the cutoffs" appear in almost every proof of this kind. (The Module 1 honors lesson on precise limits proves the same law for functions of $x$, taking the minimum of two δ's where we take the maximum of two cutoffs.) The product and quotient laws are proved the same way, with more bookkeeping.

## Subsequences

A **subsequence** keeps infinitely many terms of a sequence, in their original order, and drops the rest: $a_{n_1}, a_{n_2}, a_{n_3}, \dots$ with $n_1 < n_2 < n_3 < \cdots$. The even-numbered terms $a_2, a_4, a_6, \dots$ form one; so do $a_1, a_{10}, a_{100}, \dots$

*If $a_n \to L$, every subsequence also converges to $L$.* Since $n_k \ge k$, once $k > N$ the term $a_{n_k}$ is past the cutoff too.

Turned around, this is a fast divergence test: if two subsequences have different limits, the whole sequence diverges.

### Example 4

Does $a_n = (-1)^n\dfrac{n}{n + 1}$ converge?

The even terms are $\frac{n}{n+1}$ with $n$ even, which tend to 1. The odd terms are $-\frac{n}{n+1}$, which tend to $-1$. Two subsequences, two limits: the sequence diverges.

```plot
{"x": [0, 16.5], "y": [-1.4, 1.4], "xLabel": "n", "yLabel": "a", "functions": [{"f": "1", "dashed": true}, {"f": "-1", "dashed": true}], "points": [{"at": [1, -0.5]}, {"at": [2, 0.667]}, {"at": [3, -0.75]}, {"at": [4, 0.8]}, {"at": [5, -0.833]}, {"at": [6, 0.857]}, {"at": [7, -0.875]}, {"at": [8, 0.889]}, {"at": [9, -0.9]}, {"at": [10, 0.909]}, {"at": [11, -0.917]}, {"at": [12, 0.923]}, {"at": [13, -0.929]}, {"at": [14, 0.933]}, {"at": [15, -0.938]}, {"at": [16, 0.941]}], "caption": "aₙ = (−1)ⁿ n/(n + 1): the even terms climb toward 1, the odd terms fall toward −1"}
```

Subsequences matter far beyond this test. Lesson 91 proves that every bounded sequence, even a divergent one like this, has a *convergent* subsequence, and Lesson 92 uses that fact to prove the Extreme Value Theorem.

## Common mistakes

- *Letting $N$ depend on $n$.* "Choose $N = n + 1$" is meaningless; $N$ is fixed once $\varepsilon$ is given, before any $n$ is considered.
- *Checking one ε.* Showing that the terms eventually stay within 0.001 of $L$ proves nothing about 0.0001. The proof has to work for an arbitrary $\varepsilon$.
- *"The terms keep getting closer to $L$."* The terms of $\frac1n$ keep getting closer to $-1$ too, yet the limit is 0. Getting closer is not the same as getting arbitrarily close.
- *Thinking convergent sequences must be monotone.* Example 2's terms move steadily, but $\frac{(-1)^n}{n}$ jumps from side to side and still converges to 0.
- *Negating sloppily.* "Not convergent to $L$" needs one bad $\varepsilon$ and, for each $N$, one bad $n > N$, not every $n$.

## Key points

- $a_n \to L$: for every $\varepsilon > 0$ there is $N$ with $|a_n - L| < \varepsilon$ for all $n > N$.
- Find $N$ by simplifying $|a_n - L|$; when solving is messy, restrict $n$ and bound by something simpler. Any larger $N$ also works.
- Limits are unique; convergent sequences are bounded (not conversely); limits add, using $\frac\varepsilon2$ and $N = \max(N_1, N_2)$.
- Every subsequence of a convergent sequence has the same limit, so two subsequences with different limits prove divergence.
