---
id: alg-poly-ops
module: alg-m5
title: Polynomial operations and special products
minutes: 30
topics: [Polynomials]
drills: [alg-d-poly-add, alg-d-foil, alg-d-binomial-square]
refs: [alg-ref-polynomials]
---
Polynomials are the expressions built from a variable using only addition, subtraction, multiplication and whole-number exponents. They're the most important family of expressions in algebra: lines and parabolas are polynomial graphs, and Module 8 studies polynomial functions in depth. This lesson sets up the vocabulary and the arithmetic, using the exponent rules from the previous lesson, and ends with the special products you should recognize on sight.

## Vocabulary

A **monomial** is a single term: a number, or a number times variables with whole-number exponents, such as $7$, $-3x^4$ or $5x^2y$. A **polynomial** is a sum of monomials. One with two terms is a **binomial** ($x^2 - 9$) and one with three terms is a **trinomial** ($x^2 + 5x + 6$).

The **degree** of a term is the sum of its variables' exponents ($5x^2y$ has degree 3). The degree of a polynomial is the largest degree among its terms. Writing the terms from highest to lowest degree puts the polynomial in **standard form**; the first term is then the **leading term** and its coefficient is the **leading coefficient**.

For $-2x^3 + 4x^5 - x + 9$, standard form is $4x^5 - 2x^3 - x + 9$: degree 5, leading coefficient 4, constant term 9.

Expressions like $\tfrac{1}{x}$ (a negative exponent) or $\sqrt{x}$ (a fractional exponent) are not polynomials.

Degree names: degree 0 is constant, 1 linear, 2 quadratic, 3 cubic, 4 quartic.

## Adding and subtracting

Adding polynomials is just combining like terms. Subtracting means adding the opposite: distribute the minus sign to every term of the polynomial being subtracted.

### Example 1

Simplify $(5x^3 - 2x^2 + 7) - (3x^3 + x^2 - 4x + 2)$.

1. Distribute the minus sign: $5x^3 - 2x^2 + 7 - 3x^3 - x^2 + 4x - 2$.
2. Combine like terms: $(5 - 3)x^3 + (-2 - 1)x^2 + 4x + (7 - 2)$.
3. Result: $2x^3 - 3x^2 + 4x + 5$.

## Multiplying

To multiply polynomials, use the distributive property: multiply every term of the first by every term of the second, then combine like terms. A monomial times a polynomial is the simplest case: $3x^2(2x^2 - 5x + 1) = 6x^4 - 15x^3 + 3x^2$.

For two binomials, the four products are often remembered as **FOIL**: First, Outer, Inner, Last.

$$(2x + 3)(x - 5) = \underbrace{2x^2}_{F} \underbrace{- 10x}_{O} \underbrace{+ 3x}_{I} \underbrace{- 15}_{L} = 2x^2 - 7x - 15.$$

FOIL is only a checklist for binomials. For longer polynomials, distribute systematically, or use a grid (the **area model**): one factor's terms label the rows, the other's label the columns, and each cell holds a product.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [6, 3], [0, 3]]}], "segments": [{"from": [4, 0], "to": [4, 3]}, {"from": [0, 1.2], "to": [6, 1.2]}], "labels": [{"at": [2, 3.4], "text": "2x"}, {"at": [5, 3.4], "text": "+3"}, {"at": [-0.5, 2.1], "text": "x"}, {"at": [-0.5, 0.6], "text": "-5"}, {"at": [2, 2.1], "text": "2x²"}, {"at": [5, 2.1], "text": "3x"}, {"at": [2, 0.6], "text": "-10x"}, {"at": [5, 0.6], "text": "-15"}], "caption": "Area model for (2x + 3)(x - 5): the cells add to 2x² - 7x - 15"}
```

### Example 2

Multiply $(x - 2)(x^2 + 3x - 4)$.

1. Multiply $x$ by each term: $x^3 + 3x^2 - 4x$.
2. Multiply $-2$ by each term: $-2x^2 - 6x + 8$.
3. Add: $x^3 + (3 - 2)x^2 + (-4 - 6)x + 8 = x^3 + x^2 - 10x + 8$.

A degree-1 polynomial times a degree-2 polynomial has degree 3: degrees add when you multiply, because the leading terms multiply.

## Special products

Three products come up so often that you should know them as formulas.

*Square of a sum and of a difference:*

$$(a + b)^2 = a^2 + 2ab + b^2, \qquad (a - b)^2 = a^2 - 2ab + b^2.$$

Squaring a binomial gives a **perfect square trinomial**. FOIL shows where the middle term comes from: $(a + b)(a + b) = a^2 + ab + ba + b^2$, and the two middle products are equal. Geometrically, a square of side $a + b$ splits into an $a^2$ square, a $b^2$ square, and two $ab$ rectangles.

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [5, 5], [0, 5]]}], "segments": [{"from": [3, 0], "to": [3, 5]}, {"from": [0, 2], "to": [5, 2]}, {"from": [0, 0], "to": [3, 0], "label": "a"}, {"from": [3, 0], "to": [5, 0], "label": "b"}], "labels": [{"at": [1.5, 3.5], "text": "a²"}, {"at": [4, 3.5], "text": "ab"}, {"at": [1.5, 1], "text": "ab"}, {"at": [4, 1], "text": "b²"}], "caption": "(a + b)² = a² + 2ab + b²"}
```

*Product of a sum and a difference:*

$$(a + b)(a - b) = a^2 - b^2.$$

The outer and inner products, $-ab$ and $+ab$, cancel, leaving a **difference of squares**.

### Example 3

Expand $(3x - 4)^2$ and $(2y + 5)(2y - 5)$.

1. $(3x - 4)^2$ with $a = 3x$, $b = 4$: $(3x)^2 - 2(3x)(4) + 4^2 = 9x^2 - 24x + 16$.
2. $(2y + 5)(2y - 5) = (2y)^2 - 5^2 = 4y^2 - 25$.

The most common error in algebra may be writing $(3x - 4)^2 = 9x^2 + 16$ (or $9x^2 - 16$). The middle term $-24x$ is always there.

*Cube of a binomial* (useful later): $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$.

### Example 4

Use a special product to compute $49 \times 51$ mentally.

$49 \times 51 = (50 - 1)(50 + 1) = 50^2 - 1^2 = 2500 - 1 = 2499$.

## Common mistakes

- Subtracting only the first term of a polynomial: the minus sign applies to every term in the parentheses.
- Adding exponents of unlike terms when adding: $x^2 + x^3$ does not simplify.
- Missing products: every term must multiply every term. Two trinomials give nine products before combining.
- Forgetting the middle term: $(x + 5)^2 = x^2 + 10x + 25$, not $x^2 + 25$.
- Sign errors in $(a - b)^2$: the last term $b^2$ is positive.

## Key points

- Degree of a polynomial: the highest degree of its terms; standard form lists terms from highest degree down.
- Add and subtract by combining like terms; distribute a minus sign to every term.
- Multiply by distributing every term over every term; FOIL is the binomial case.
- $(a \pm b)^2 = a^2 \pm 2ab + b^2$ and $(a + b)(a - b) = a^2 - b^2$.
