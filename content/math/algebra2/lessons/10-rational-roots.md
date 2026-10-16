---
id: alg-rational-roots
module: a2-m3
title: The rational root theorem and finding all zeros
minutes: 35
topics: [Rational root theorem]
drills: [alg-d-find-zeros, alg-d-cubic-rational]
refs: [alg-ref-functions]
---
The Factor Theorem says that every zero gives a factor, but where do you find the first zero? For polynomials with integer coefficients, the rational root theorem gives a short list of candidates. Test them, divide out each zero you find, and finish with the quadratic formula. This lesson puts that strategy together and adds the facts that guarantee how many zeros there are.

## The Rational Root Theorem

> **Rational Root Theorem**: if $f(x) = a_nx^n + \cdots + a_1x + a_0$ has integer coefficients and $\tfrac{p}{q}$ (in lowest terms) is a zero, then $p$ divides the constant term $a_0$ and $q$ divides the leading coefficient $a_n$.

Why it's true: substitute $x = \tfrac pq$, set $f = 0$ and multiply by $q^n$:

$$a_np^n + a_{n-1}p^{n-1}q + \cdots + a_1pq^{n-1} + a_0q^n = 0.$$

Every term except the last contains a factor of $p$, so $p$ divides $a_0q^n$. Since $p$ and $q$ share no factors, $p$ must divide $a_0$. The same argument with the first term shows $q$ divides $a_n$.

So the possible rational zeros are

$$\pm\frac{\text{factors of } a_0}{\text{factors of } a_n}.$$

The theorem lists candidates; it doesn't promise any of them works. A polynomial may have no rational zeros at all.

### Example 1

List the possible rational zeros of $f(x) = 2x^3 + x^2 - 13x + 6$.

1. Factors of the constant 6: $\pm1, \pm2, \pm3, \pm6$.
2. Factors of the leading coefficient 2: $\pm1, \pm2$.
3. Candidates $\tfrac pq$: $\pm1, \pm2, \pm3, \pm6, \pm\tfrac12, \pm\tfrac32$ (duplicates like $\tfrac22 = 1$ are dropped).

## Finding all zeros

1. List the possible rational zeros.
2. Test candidates with synthetic division (or by evaluating). A remainder of 0 means you've found a zero.
3. Use the quotient, the **depressed polynomial**, for the remaining zeros.
4. When the quotient is quadratic, factor it or use the quadratic formula.

### Example 2

Find all zeros of $f(x) = 2x^3 + x^2 - 13x + 6$.

1. Try $x = 2$: $f(2) = 16 + 4 - 26 + 6 = 0$. A zero.
2. Divide by $x - 2$:
$$\begin{array}{r|rrrr} 2 & 2 & 1 & -13 & 6 \\ & & 4 & 10 & -6 \\ \hline & 2 & 5 & -3 & 0 \end{array}$$
3. Quotient $2x^2 + 5x - 3 = (2x - 1)(x + 3)$.
4. Zeros: $2$, $\tfrac12$ and $-3$. All three were on the candidate list.

```plot
{"x": [-4, 3], "y": [-10, 20], "functions": [{"f": "2*x^3 + x^2 - 13*x + 6", "label": "f(x) = 2x³ + x² - 13x + 6", "from": -3.8, "to": 2.8}], "points": [{"at": [-3, 0], "label": "-3"}, {"at": [0.5, 0], "label": "1/2"}, {"at": [2, 0], "label": "2"}], "caption": "A graph is a good way to pick which candidates to test first"}
```

A graph or a table of values can tell you which candidates are worth testing: look for sign changes (the Intermediate Value Theorem from the polynomial functions lesson).

### Example 3

Find all zeros of $g(x) = x^3 - 3x^2 + x + 1$.

1. Candidates: $\pm1$. $g(1) = 1 - 3 + 1 + 1 = 0$.
2. Divide by $x - 1$: coefficients $1, -3, 1, 1$ give $1, -2, -1$, remainder 0. Quotient $x^2 - 2x - 1$.
3. Quadratic formula: $x = \dfrac{2 \pm \sqrt{4 + 4}}{2} = 1 \pm \sqrt2$.
4. Zeros: $1$, $1 + \sqrt2$, $1 - \sqrt2$. Two are irrational, so the rational root theorem alone couldn't find them.

## How many zeros?

The **Fundamental Theorem of Algebra** states that every polynomial of degree $n \ge 1$ has at least one complex zero. Applying it repeatedly with the Factor Theorem gives:

> A polynomial of degree $n$ has exactly $n$ complex zeros, counting multiplicity, and factors into $n$ linear factors over the complex numbers.

Some of those zeros may be real and some non-real. When the coefficients are real, non-real zeros come in **conjugate pairs**: if $a + bi$ is a zero, so is $a - bi$. (That's what happened with the quadratic formula in Module 2.) So a cubic with real coefficients always has at least one real zero.

### Example 4

Find all zeros of $h(x) = x^3 - 2x^2 + 4x - 8$.

1. Grouping works here: $x^2(x - 2) + 4(x - 2) = (x - 2)(x^2 + 4)$.
2. Zeros: $x = 2$ and $x^2 = -4$, so $x = \pm 2i$.
3. Three zeros for degree 3: one real, one conjugate pair.

### Example 5

Write a polynomial with real coefficients, of lowest degree, with zeros $3$ and $1 + i$.

1. Since $1 + i$ is a zero and the coefficients are real, $1 - i$ is too.
2. $(x - (1 + i))(x - (1 - i)) = ((x - 1) - i)((x - 1) + i) = (x - 1)^2 - i^2 = x^2 - 2x + 2$.
3. $f(x) = (x - 3)(x^2 - 2x + 2) = x^3 - 5x^2 + 8x - 6$.

## Common mistakes

- Putting the factors of the leading coefficient on top: candidates are $\tfrac{\text{factors of the constant}}{\text{factors of the leading coefficient}}$.
- Forgetting the $\pm$ signs on candidates.
- Testing candidates on the original polynomial after finding a zero, instead of continuing with the smaller depressed polynomial.
- Stopping once the rational zeros are found, without solving the remaining quadratic.
- Forgetting the conjugate of a complex zero when building a polynomial with real coefficients.

## Key points

- Possible rational zeros: $\pm\tfrac{p}{q}$, with $p$ dividing the constant term and $q$ dividing the leading coefficient.
- Test candidates, divide out each zero found, and finish the depressed quadratic by factoring or the formula.
- Degree $n$ means exactly $n$ complex zeros counting multiplicity (Fundamental Theorem of Algebra).
- With real coefficients, non-real zeros come in conjugate pairs.
