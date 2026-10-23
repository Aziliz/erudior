---
id: geo-m6-h-triples
module: geo-m6
title: Pythagorean triples and more proofs
minutes: 45
honors: true
topics: [Pythagorean triples, Proofs of the Pythagorean theorem]
drills: [geo-m6-r2-euclid-triple, geo-m6-r2-triple-check]
refs: [geo-ref-theorems]
---
Lesson 22 proved the Pythagorean theorem twice, once by rearranging four triangles and once with similar triangles, and listed a few whole-number right triangles such as 3-4-5 and 5-12-13. This lesson goes further in both directions. First, two more proofs, one of which shows that the theorem is really a statement about *similar figures*, not just squares. Then the question a curious student asks after seeing that table: where do Pythagorean triples come from, and is there a recipe that produces every one of them? There is, and proving it takes nothing more than algebra and some careful thinking about even and odd numbers.

## A proof by a future president

In 1876 James A. Garfield, then a member of the U.S. House of Representatives and later the 20th president, published a short proof in the *New-England Journal of Education*. It uses a trapezoid instead of a square.

![A trapezoid with a horizontal bottom of length a plus b and vertical left and right sides of lengths b and a. It is cut into three triangles: triangle 1 with legs a and b at the bottom left, triangle 2 with legs b and a at the bottom right, and triangle 3 on top with two sides of length c meeting at a right angle on the bottom edge.](images/geo-m6-garfield.svg)

Place two copies of a right triangle with legs $a$, $b$ and hypotenuse $c$ side by side, as in the picture: triangle 1 stands on a bottom edge of length $a$ with a vertical leg $b$, and triangle 2 stands on a bottom edge of length $b$ with a vertical leg $a$. Join the tops of the two vertical legs. The result is a trapezoid whose parallel sides are the vertical legs $b$ and $a$, and whose height is the bottom edge, $a + b$.

**Why triangle 3 has a right angle.** At the point where the two triangles meet on the bottom edge, three angles fill a straight angle: an acute angle of triangle 1, an acute angle of triangle 2, and the angle of triangle 3. The two acute angles are the two *different* acute angles of the same right triangle, so they add to $90^\circ$. That leaves $180^\circ - 90^\circ = 90^\circ$ for triangle 3, which is therefore a right triangle with both legs equal to $c$.

**Counting the area two ways.** The trapezoid area formula gives $\tfrac12(a + b)(a + b)$. Adding the three triangles gives $\tfrac12 ab + \tfrac12 ab + \tfrac12 c^2$. Setting them equal and doubling:

$$(a + b)^2 = 2ab + c^2 \quad\Longrightarrow\quad a^2 + 2ab + b^2 = 2ab + c^2 \quad\Longrightarrow\quad a^2 + b^2 = c^2.$$

Garfield's figure is exactly half of the square picture from Lesson 22, cut along a diagonal line. That is why the algebra looks so similar.

## The theorem is about similar figures

The squares in $a^2 + b^2 = c^2$ are not special. Lesson 20 showed that when a figure is scaled by $k$, its area is multiplied by $k^2$. Suppose you draw three similar figures (any shape at all) on the three sides of a right triangle, each scaled so that its matching edge is that side. Then their areas are $Ka^2$, $Kb^2$ and $Kc^2$ for the same constant $K$, which depends only on the shape. Multiplying $a^2 + b^2 = c^2$ by $K$ gives:

**Generalized Pythagorean theorem.** If similar figures are drawn on the three sides of a right triangle, with corresponding edges along the sides, the area of the figure on the hypotenuse equals the sum of the areas of the figures on the legs.

Euclid proves this as Proposition 31 of Book VI of the *Elements* (about 300 BCE); the squares version is Proposition 47 of Book I.

### Example 1: semicircles

Semicircles are drawn outward on the sides of a 6-8-10 right triangle, each with a side of the triangle as its diameter. Check the theorem.

**Step 1.** A semicircle with diameter $s$ has radius $\tfrac{s}{2}$ and area $\tfrac12\pi\left(\tfrac{s}{2}\right)^2 = \tfrac{\pi}{8}s^2$, so $K = \tfrac{\pi}{8}$.

**Step 2.** On the legs: $\tfrac{\pi}{8}(36) = 4.5\pi$ and $\tfrac{\pi}{8}(64) = 8\pi$. On the hypotenuse: $\tfrac{\pi}{8}(100) = 12.5\pi$.

**Step 3.** $4.5\pi + 8\pi = 12.5\pi$ ✓.

All semicircles are similar, so this works for every right triangle, not just this one. The same holds for equilateral triangles on the sides ($K = \tfrac{\sqrt3}{4}$) and for any other family of similar shapes.

## Primitive triples

Recall that a Pythagorean triple is three positive whole numbers with $a^2 + b^2 = c^2$. If you multiply a triple by any whole number you get another one (a similar triangle), so the interesting triples are the ones that are not multiples of a smaller triple. A **primitive Pythagorean triple** is a triple whose three numbers have no common factor greater than 1. So 3-4-5 and 5-12-13 are primitive, while 6-8-10 and 15-20-25 are not. Every triple is a whole-number multiple of exactly one primitive triple: divide out the greatest common factor.

**Fact 1: in a primitive triple, $c$ is odd and exactly one leg is even.** The proof uses remainders on division by 4.

- An even number squared is a multiple of 4: $(2k)^2 = 4k^2$.
- An odd number squared is 1 more than a multiple of 4: $(2k + 1)^2 = 4(k^2 + k) + 1$.

Both legs can't be even, or 2 would divide all three numbers (if $a$ and $b$ are even, so is $c^2$, so $c$ is even). Both legs can't be odd either: then $a^2 + b^2$ would be 2 more than a multiple of 4, and no square leaves remainder 2. So one leg is even and one is odd, which makes $c^2$ odd and $c$ odd.

## Euclid's formula

Here is a recipe. Pick whole numbers $m > n > 0$ and set

$$a = m^2 - n^2, \qquad b = 2mn, \qquad c = m^2 + n^2.$$

This is **Euclid's formula** (it appears in Book X of the *Elements*). It always works, because

$$(m^2 - n^2)^2 + (2mn)^2 = m^4 - 2m^2n^2 + n^4 + 4m^2n^2 = m^4 + 2m^2n^2 + n^4 = (m^2 + n^2)^2.$$

| $m$ | $n$ | $a = m^2 - n^2$ | $b = 2mn$ | $c = m^2 + n^2$ | primitive? |
|---|---|---|---|---|---|
| 2 | 1 | 3 | 4 | 5 | yes |
| 3 | 1 | 8 | 6 | 10 | no (both odd) |
| 3 | 2 | 5 | 12 | 13 | yes |
| 4 | 1 | 15 | 8 | 17 | yes |
| 4 | 3 | 7 | 24 | 25 | yes |
| 5 | 2 | 21 | 20 | 29 | yes |
| 5 | 4 | 9 | 40 | 41 | yes |

**When is the triple primitive?** Exactly when $m$ and $n$ have no common factor greater than 1 *and* one of them is even and the other odd. If both are odd, all three numbers come out even (like 8-6-10); if they share a factor $p$, all three are multiples of $p^2$.

**Fact 2: every primitive triple comes from Euclid's formula.** Take a primitive triple and call its even leg $b$ (Fact 1 says there is exactly one). Here is the idea of the proof.

1. Rewrite $a^2 + b^2 = c^2$ as $b^2 = c^2 - a^2 = (c - a)(c + a)$.
2. Since $a$ and $c$ are both odd, $c - a$ and $c + a$ are both even. Divide by 4: $\left(\tfrac{b}{2}\right)^2 = \tfrac{c + a}{2} \cdot \tfrac{c - a}{2}$.
3. The two whole numbers $\tfrac{c + a}{2}$ and $\tfrac{c - a}{2}$ have no common factor. (Any common factor would divide their sum, $c$, and their difference, $a$, but $a$ and $c$ share no factor.)
4. Two whole numbers with no common factor whose product is a perfect square must each be a perfect square. Call them $m^2$ and $n^2$.
5. Then $c = m^2 + n^2$, $a = m^2 - n^2$ and $\tfrac{b}{2} = mn$, so $b = 2mn$.

Steps 3 and 4 rely on the fact that every whole number factors into primes in only one way, which you can take on trust here. The conclusion is a complete list: running through all suitable pairs $(m, n)$ produces every primitive triple exactly once, and their multiples produce all the rest.

### Example 2: working backward

Find $m$ and $n$ for the primitive triple 20, 21, 29.

**Step 1.** The even leg is $b = 20$, so $mn = 10$; the hypotenuse gives $m^2 + n^2 = 29$.

**Step 2.** Try factor pairs of 10 with $m > n$: $(10, 1)$ gives $101$, $(5, 2)$ gives $25 + 4 = 29$ ✓.

**Step 3.** Check: $m^2 - n^2 = 25 - 4 = 21$ ✓. So $m = 5$, $n = 2$.

### Example 3: two different triangles with hypotenuse 65

Find every primitive triple with $c = 65$.

**Step 1.** We need $m^2 + n^2 = 65$ with $m > n > 0$. Trying squares below 65: $64 + 1$ and $49 + 16$. So $(m, n) = (8, 1)$ or $(7, 4)$.

**Step 2.** Both pairs share no factor and have one even and one odd number, so both give primitive triples:
- $(8, 1)$: $a = 64 - 1 = 63$, $b = 16$, $c = 65$.
- $(7, 4)$: $a = 49 - 16 = 33$, $b = 56$, $c = 65$.

**Check.** $63^2 + 16^2 = 3969 + 256 = 4225 = 65^2$ and $33^2 + 56^2 = 1089 + 3136 = 4225$ ✓.

Since $65 = 5 \cdot 13$, there are also two non-primitive triples with hypotenuse 65: $13 \times (3, 4, 5) = (39, 52, 65)$ and $5 \times (5, 12, 13) = (25, 60, 65)$.

## A geometric view: points on the unit circle

Divide $a^2 + b^2 = c^2$ by $c^2$: $\left(\tfrac{a}{c}\right)^2 + \left(\tfrac{b}{c}\right)^2 = 1$. So every triple gives a point $\left(\tfrac{a}{c}, \tfrac{b}{c}\right)$ on the circle $x^2 + y^2 = 1$ whose coordinates are both fractions, a **rational point**. For 3-4-5 it is $(0.6, 0.8)$.

```plot
{"x": [-1.3, 1.3], "y": [-0.3, 1.3], "equal": true, "curves": [{"x": "cos(t)", "y": "sin(t)", "t": [0, 3.1416]}], "segments": [{"from": [-1, 0], "to": [0.6, 0.8], "dashed": true}, {"from": [-1, 0], "to": [0.8, 0.6], "dashed": true}], "points": [{"at": [-1, 0], "label": "(−1, 0)"}, {"at": [0.6, 0.8], "label": "(3/5, 4/5)"}, {"at": [0.8, 0.6], "label": "(4/5, 3/5)"}, {"at": [0.28, 0.96], "label": "(7/25, 24/25)"}], "caption": "Lines through (−1, 0) with fraction slopes hit the unit circle at points with fraction coordinates."}
```

A line through $(-1, 0)$ with slope $t$ meets the circle again at $\left(\tfrac{1 - t^2}{1 + t^2}, \tfrac{2t}{1 + t^2}\right)$. When $t = \tfrac{n}{m}$ is a fraction, multiplying through by $m^2$ turns these coordinates into $\tfrac{m^2 - n^2}{m^2 + n^2}$ and $\tfrac{2mn}{m^2 + n^2}$: Euclid's formula again. The slope $\tfrac12$ gives $(0.6, 0.8)$, the 3-4-5 triangle. This link between whole-number equations and geometry is a doorway into number theory.

## A little history (and what is uncertain)

The theorem is named for Pythagoras (6th century BCE), but no writings by him survive, and the claim that he proved it comes from authors writing centuries later. The relationship itself was known long before him. A Babylonian clay tablet called Plimpton 322, usually dated to roughly 1800 BCE, lists pairs of numbers that are the hypotenuse and a leg of right triangles with whole-number sides, such as 119 and 169 from the triple 119-120-169. Scholars still debate what the tablet was for; a teacher's table of exercises is one common reading. Early texts from India and China also state or use the relationship, though their dates are uncertain. So "Pythagorean" is a traditional label, not a statement about who discovered it first.

## Common mistakes

- **Assuming every multiple of a triple is primitive.** 6-8-10 is a triple but not primitive; its numbers share the factor 2.
- **Using two odd numbers in Euclid's formula** and expecting a primitive triple. $(m, n) = (5, 3)$ gives 16-30-34, which is twice 8-15-17.
- **Forgetting $m > n$.** If $m < n$, then $m^2 - n^2$ is negative.
- **Misreading the generalized theorem.** It needs *similar* figures with corresponding edges on the sides. Different shapes on different sides don't add up.
- **Thinking 2 can't be part of a primitive triple's $m$ or $n$.** $(m, n) = (2, 1)$ gives 3-4-5; only the *legs* can't both be even.

## Key points

- Garfield's trapezoid proof: $\tfrac12(a + b)^2 = 2 \cdot \tfrac12 ab + \tfrac12 c^2$ gives $a^2 + b^2 = c^2$.
- Similar figures on the three sides of a right triangle have areas that add like the squares, because area scales by $k^2$.
- A primitive triple has no common factor; its hypotenuse is odd and exactly one leg is even.
- Euclid's formula $a = m^2 - n^2$, $b = 2mn$, $c = m^2 + n^2$ gives a triple for any $m > n > 0$, and every primitive triple comes from a pair $m$, $n$ with no common factor and opposite parity.
- Triples correspond to rational points on the unit circle.
