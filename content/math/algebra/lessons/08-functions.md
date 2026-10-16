---
id: alg-functions
module: alg-m3
title: Functions and function notation
minutes: 25
topics: [Functions]
drills: [alg-d-eval-function, alg-d-function-expr]
refs: [alg-ref-functions]
---
So far each problem has asked for one unknown number. Much of algebra, and nearly all of science, is instead about how one quantity depends on another: distance on time, cost on quantity, temperature on altitude. The tool for describing that dependence is the function. This lesson defines functions, introduces the notation $f(x)$, and shows how to evaluate and interpret it.

## Relations and functions

A **relation** is any set of ordered pairs $(x, y)$. The first coordinates form its **domain** (the inputs) and the second coordinates form its **range** (the outputs).

A **function** is a relation in which each input has exactly one output. The input may be called the **independent variable** and the output the **dependent variable**, because the output depends on which input you choose.

- $\{(1, 4), (2, 7), (3, 4)\}$ is a function. Two inputs share the output 4, which is allowed.
- $\{(1, 4), (1, 6), (2, 7)\}$ is not a function, because the input 1 has two outputs.

The test is about inputs, not outputs: a function may repeat outputs but never assigns two outputs to one input. Think of a vending machine: each button gives one item. Two buttons giving the same snack is fine; one button giving either of two snacks at random is not a function.

## Functions described different ways

A function can be given as a table, a set of pairs, a rule in words, an equation, or a graph.

| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|---|
| $y$ | $3$ | $1$ | $-1$ | $-3$ | $-5$ |

The table above follows the rule "double $x$, subtract from 1," the equation $y = 1 - 2x$. Each description has its uses: tables are concrete, equations let you compute any value, and graphs show the overall shape at a glance.

An equation in $x$ and $y$ defines $y$ as a function of $x$ if each $x$ gives only one $y$. The equation $y = x^2$ does: each $x$ has one square. The equation $y^2 = x$ does not: for $x = 4$, both $y = 2$ and $y = -2$ work.

## The vertical line test

On a graph, an input $x = a$ corresponds to the vertical line through $a$. If some vertical line crosses the graph twice, that input has two outputs. So:

> **Vertical line test**: a graph represents a function exactly when no vertical line crosses it more than once.

```plot
{"x": [-1, 9], "y": [-4, 4], "functions": [{"f": "sqrt(x)", "label": "y = √x"}, {"f": "-sqrt(x)", "label": "y = -√x", "dashed": true}], "segments": [{"from": [4, -4], "to": [4, 4], "dashed": true}], "points": [{"at": [4, 2], "label": "(4, 2)"}, {"at": [4, -2], "label": "(4, -2)"}], "caption": "The whole curve y² = x fails the vertical line test at x = 4; its top half alone is a function"}
```

## Function notation

If a function is named $f$, then $f(x)$, read "$f$ of $x$," means the output of $f$ for the input $x$. It does not mean $f$ times $x$. Writing $f(x) = 1 - 2x$ is just a way to name the rule $y = 1 - 2x$ so we can talk about specific inputs: $f(3) = 1 - 2(3) = -5$ says that the point $(3, -5)$ is on the graph.

Function notation is compact and precise. "The value of $y$ when $x$ is 3" becomes $f(3)$, and if several functions are around we can name them $f$, $g$, $h$ or something meaningful like $C(n)$ for the cost of $n$ items.

### Example 1

Let $f(x) = 2x^2 - 3x + 1$. Find $f(-2)$, $f(0)$ and $f(a + 1)$.

1. $f(-2) = 2(-2)^2 - 3(-2) + 1 = 8 + 6 + 1 = 15$.
2. $f(0) = 0 - 0 + 1 = 1$.
3. Replace every $x$ by $(a + 1)$, keeping the parentheses:
$$f(a + 1) = 2(a + 1)^2 - 3(a + 1) + 1 = 2(a^2 + 2a + 1) - 3a - 3 + 1 = 2a^2 + a.$$

The input can be any expression. Whatever goes in the parentheses replaces $x$ everywhere.

### Example 2

Let $g(x) = 5 - 3x$. Solve $g(x) = 17$.

This asks a different question: which input gives the output 17? Set up the equation $5 - 3x = 17$, so $-3x = 12$ and $x = -4$. Check: $g(-4) = 5 + 12 = 17$.

Keep the two kinds of question apart. $g(17)$ asks for an output (it equals $5 - 51 = -46$); $g(x) = 17$ asks for an input.

## Reading values from a graph

On the graph of $f$, the point above (or below) $x = a$ has height $f(a)$. So $f(a)$ is read by going to $a$ on the $x$-axis and moving vertically to the curve. To solve $f(x) = c$, go to height $c$ on the $y$-axis and move horizontally to find where the curve is at that height.

```plot
{"x": [-3, 5], "y": [-5, 6], "functions": [{"f": "x^2 - 2*x - 3", "label": "y = f(x)"}], "points": [{"at": [3, 0], "label": "(3, 0)"}, {"at": [-1, 0], "label": "(-1, 0)"}, {"at": [0, -3], "label": "(0, -3)"}, {"at": [4, 5], "label": "(4, 5)"}], "caption": "f(0) = -3, f(4) = 5, and f(x) = 0 at x = -1 and x = 3"}
```

From this graph: $f(0) = -3$ (the curve crosses the $y$-axis at $-3$) and $f(4) = 5$. The equation $f(x) = 0$ has two solutions, $x = -1$ and $x = 3$, where the curve meets the $x$-axis.

## Functions in context

### Example 3

A streaming service charges a $12 monthly fee plus $4 per rental. Write the cost as a function of the number of rentals $r$, find $C(5)$, and interpret it.

1. $C(r) = 12 + 4r$.
2. $C(5) = 12 + 4(5) = 32$.
3. Interpretation: renting 5 movies in a month costs $32.

Here $r$ is the independent variable and $C$ is the dependent variable. A sensible domain is the whole numbers $0, 1, 2, \dots$, since you can't rent half a movie. That idea, the domain allowed by the situation, is the subject of the next lesson.

## Combining functions

Functions can be added, subtracted, multiplied and divided output by output: $(f + g)(x) = f(x) + g(x)$, and so on. You can also feed the output of one function into another. The **composition** $f(g(x))$ means "apply $g$, then apply $f$ to the result." If $f(x) = x^2$ and $g(x) = x + 3$, then $f(g(2)) = f(5) = 25$, while $g(f(2)) = g(4) = 7$. Order matters.

## Common mistakes

- Reading $f(x)$ as multiplication.
- Substituting an expression without parentheses: $f(a + 1)$ for $f(x) = x^2$ is $(a + 1)^2$, not $a + 1^2$.
- Confusing $f(3)$ (an output) with solving $f(x) = 3$ (finding inputs).
- Thinking a repeated output breaks the function rule. Only repeated inputs with different outputs do.
- Mixing up the order in a composition: $f(g(x))$ applies $g$ first.

## Key points

- A function assigns exactly one output to each input; the inputs form the domain and the outputs form the range.
- The vertical line test checks whether a graph is a function.
- $f(a)$ is the output for input $a$, and the point $(a, f(a))$ lies on the graph.
- To evaluate, replace every $x$ with the input in parentheses; to solve $f(x) = c$, set up an equation.
- $f(g(x))$ means apply $g$ first, then $f$.
