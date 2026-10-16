---
id: pc-inverses
module: pc-m2
title: Inverse functions
minutes: 30
topics: [Inverse functions]
drills: [pc-inverse-linear, pc-inverse-rational, pc-inverse-value]
refs: [pc-ref-functions]
---
## Undoing a function

A function turns inputs into outputs. An inverse function runs the machine backward: given an output, it tells you the input that produced it. Converting Celsius to Fahrenheit has an inverse (Fahrenheit to Celsius); so does "multiply by 3 and add 2" (subtract 2 and divide by 3). Inverses are how we will define logarithms in Module 4 and inverse trig functions in Module 5, so this lesson matters well beyond itself. It uses composition from the last lesson as its main tool.

## One-to-one functions

Running a function backward only works if every output came from exactly one input. Squaring fails: if the output is 9, was the input 3 or $-3$? A function is **one-to-one** if different inputs always give different outputs:

$$x_1 \ne x_2 \implies f(x_1) \ne f(x_2).$$

Graphically this is the **horizontal line test**: $f$ is one-to-one exactly when no horizontal line meets its graph more than once. A horizontal line $y = c$ collects all inputs with output $c$; two crossings mean two inputs share an output. Functions that are always increasing or always decreasing pass automatically.

## The inverse function

If $f$ is one-to-one, its **inverse function** $f^{-1}$ is defined by

$$f^{-1}(y) = x \iff f(x) = y.$$

Equivalently, $f^{-1}$ undoes $f$ and $f$ undoes $f^{-1}$:

$$f^{-1}\big(f(x)\big) = x \text{ for } x \text{ in the domain of } f, \qquad f\big(f^{-1}(x)\big) = x \text{ for } x \text{ in the domain of } f^{-1}.$$

The roles of input and output swap, so

$$\text{domain of } f^{-1} = \text{range of } f, \qquad \text{range of } f^{-1} = \text{domain of } f.$$

The $-1$ is notation, not an exponent: $f^{-1}(x)$ is *not* $\dfrac{1}{f(x)}$.

## Finding an inverse algebraically

1. Write $y = f(x)$.
2. Swap $x$ and $y$. (This is the "input and output trade places" step.)
3. Solve for $y$. The result is $f^{-1}(x)$.
4. Check with a composition, and state the domain.

### Example 1

Find the inverse of $f(x) = \dfrac{2x - 5}{3}$.

$y = \dfrac{2x - 5}{3}$. Swap: $x = \dfrac{2y - 5}{3}$. Solve: $3x = 2y - 5$, so $2y = 3x + 5$ and

$$f^{-1}(x) = \frac{3x + 5}{2}.$$

Check: $f^{-1}(f(4)) = f^{-1}(1) = \frac{3 + 5}{2} = 4$. ✓ Notice the inverse undoes the steps in reverse order: $f$ multiplies by 2, subtracts 5, divides by 3; $f^{-1}$ multiplies by 3, adds 5, divides by 2.

### Example 2

Find the inverse of $g(x) = \dfrac{x + 1}{x - 2}$ and give its domain.

$y = \dfrac{x+1}{x-2}$. Swap: $x = \dfrac{y + 1}{y - 2}$. Clear the fraction: $x(y - 2) = y + 1$. Collect the $y$ terms on one side: $xy - y = 2x + 1$, so $y(x - 1) = 2x + 1$ and

$$g^{-1}(x) = \frac{2x + 1}{x - 1}.$$

The domain of $g^{-1}$ is $x \ne 1$, which matches the range of $g$: $g(x) = 1$ would need $x + 1 = x - 2$, which is impossible, so $g$ never outputs 1. The key algebra move is gathering every $y$ term on one side and factoring $y$ out.

## Graphs of inverses

If $(a, b)$ is on the graph of $f$, then $f(a) = b$, so $f^{-1}(b) = a$ and $(b, a)$ is on the graph of $f^{-1}$. Swapping coordinates reflects a point across the line $y = x$. So:

> The graph of $f^{-1}$ is the reflection of the graph of $f$ across the line $y = x$.

```plot
{"x": [-3, 9], "y": [-3, 9], "equal": true, "functions": [{"f": "2^x", "label": "y = f(x)"}, {"f": "log2(x)", "label": "y = f⁻¹(x)"}, {"f": "x", "dashed": true, "label": "y = x"}], "points": [{"at": [2, 4], "label": "(2, 4)"}, {"at": [4, 2], "label": "(4, 2)"}], "caption": "A function and its inverse are mirror images across y = x; (2, 4) on f becomes (4, 2) on f⁻¹."}
```

## Restricting the domain

A function that fails the horizontal line test can still get an inverse if we cut its domain down to a piece where it is one-to-one. The standard example is $f(x) = x^2$ restricted to $x \ge 0$. On that piece, squaring is one-to-one, and the inverse is $f^{-1}(x) = \sqrt x$. (Restricting to $x \le 0$ instead would give $-\sqrt{x}$.) The inverse trig functions in Module 5 are built exactly this way.

### Example 3

Let $f(x) = (x - 3)^2 + 1$ with domain $x \ge 3$. Find $f^{-1}$.

$y = (x - 3)^2 + 1$. Swap: $x = (y - 3)^2 + 1$. Then $(y - 3)^2 = x - 1$, so $y - 3 = \pm\sqrt{x - 1}$. Since the range of $f^{-1}$ must equal the domain of $f$, which is $y \ge 3$, take the plus sign:

$$f^{-1}(x) = 3 + \sqrt{x - 1}, \qquad x \ge 1.$$

The domain $x \ge 1$ is the range of $f$, as it should be.

### Example 4

Given $f(2) = 7$, $f(5) = -1$ and $f$ one-to-one, find $f^{-1}(-1)$ and $f^{-1}(f^{-1}(7))$ if also $f(-3) = 2$.

$f^{-1}(-1) = 5$ because $f(5) = -1$. Next, $f^{-1}(7) = 2$, and $f^{-1}(2) = -3$ because $f(-3) = 2$. So $f^{-1}(f^{-1}(7)) = -3$.

## Common mistakes

- *Reading $f^{-1}$ as a reciprocal.* $f^{-1}(x) \ne \dfrac{1}{f(x)}$.
- *Forgetting to check one-to-one.* $x^2$ on all reals has no inverse.
- *Choosing the wrong sign of a square root.* The range of $f^{-1}$ must equal the domain of $f$.
- *Stopping at "swap" without solving for $y$.*
- *Mixing up domain and range swaps.* The domain of $f^{-1}$ is the range of $f$.

## Key points

- Only one-to-one functions (horizontal line test) have inverses.
- $f^{-1}$ undoes $f$: $f(f^{-1}(x)) = x$ and $f^{-1}(f(x)) = x$.
- To find $f^{-1}$: write $y = f(x)$, swap $x$ and $y$, solve for $y$.
- The graph of $f^{-1}$ is the reflection of $f$ across $y = x$; points $(a, b)$ become $(b, a)$.
- Restrict the domain to make a function one-to-one when needed.
