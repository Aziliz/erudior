---
id: geo-m6-h-golden
module: geo-m6
title: The golden ratio and figures similar to their own parts
minutes: 40
honors: true
topics: [Golden ratio]
drills: [geo-m6-r2-golden]
refs: [geo-ref-theorems]
---
Lesson 20 compared two separate figures: a photo and its enlargement, a map and the land. This lesson asks a stranger question: can a figure be similar to a *piece of itself*? The answer is yes, and asking it leads to one number again and again, the golden ratio, about 1.618. It sets the shape of a rectangle that survives having a square cut off, the shape of the regular pentagon and its star, and exact values of $\cos 36^\circ$ and $\cos 72^\circ$ that no calculator gives you. Along the way you will also see why many popular claims about this number are not supported by evidence.

## Cutting a square off a rectangle

Start with a rectangle whose long side is $x$ and short side is 1. Cut off a $1 \times 1$ square from one end. What is left is a rectangle with sides 1 and $x - 1$. Could the leftover rectangle be similar to the original?

For rectangles, similarity only needs the long-to-short ratios to match (all angles are right angles). In the leftover piece, the side 1 is the long one (we'll see that $x - 1 < 1$). So we need

$$\frac{x}{1} = \frac{1}{x - 1} \quad\Longrightarrow\quad x(x - 1) = 1 \quad\Longrightarrow\quad x^2 - x - 1 = 0.$$

The quadratic formula gives $x = \dfrac{1 \pm \sqrt5}{2}$. A length is positive, so

$$\varphi = \frac{1 + \sqrt5}{2} \approx 1.618.$$

This number is the **golden ratio**, written with the Greek letter phi, $\varphi$. A rectangle whose sides are in the ratio $\varphi : 1$ is a **golden rectangle**. Cut a square off it and the rest is another golden rectangle, scaled down by the factor $\tfrac{1}{\varphi}$. Cut a square off *that*, and so on forever: a golden rectangle is a nest of squares and ever-smaller golden rectangles.

![A golden rectangle divided into a large square on the left and a smaller golden rectangle on the right, which is itself divided into a square and a smaller golden rectangle, and so on for seven squares spiraling inward. A quarter-circle arc is drawn in each square, and together the arcs form a spiral.](images/geo-m6-golden-rectangle.svg)

The quarter-circle arcs in the picture join into a smooth-looking spiral that approximates a **logarithmic spiral**, one that grows by the same factor every quarter turn.

### Two identities worth memorizing

Because $\varphi^2 - \varphi - 1 = 0$:

- $\varphi^2 = \varphi + 1 \approx 2.618$. Squaring $\varphi$ just adds 1.
- Dividing $\varphi^2 = \varphi + 1$ by $\varphi$: $\varphi = 1 + \tfrac{1}{\varphi}$, so $\dfrac{1}{\varphi} = \varphi - 1 \approx 0.618$. Its reciprocal has the same digits after the decimal point.

### Example 1

A golden rectangle has a long side of 10 cm. Find the short side exactly and to two decimals.

**Step 1.** Short side $= \dfrac{10}{\varphi} = 10(\varphi - 1)$.

**Step 2.** $\varphi - 1 = \dfrac{1 + \sqrt5}{2} - 1 = \dfrac{\sqrt5 - 1}{2}$, so the short side is $10 \cdot \dfrac{\sqrt5 - 1}{2} = 5(\sqrt5 - 1) \approx 6.18$ cm.

**Check.** $\dfrac{10}{6.18} \approx 1.618$ ✓, and cutting off a $6.18 \times 6.18$ square leaves $3.82 \times 6.18$, with ratio $\tfrac{6.18}{3.82} \approx 1.618$ ✓.

## Extreme and mean ratio

Euclid described the same number with a segment instead of a rectangle (*Elements*, Book VI, about 300 BCE). A point $C$ divides segment $AB$ in **extreme and mean ratio** if the whole is to the longer piece as the longer piece is to the shorter:

$$\frac{AB}{AC} = \frac{AC}{CB}.$$

In Lesson 20's language, the longer piece $AC$ is the *geometric mean* of the whole and the shorter piece. If $AC = 1$ and $CB = y$, then $\tfrac{1 + y}{1} = \tfrac{1}{y}$, which leads to $y^2 + y - 1 = 0$ and $y = \tfrac{1}{\varphi}$. So the ratio is again $\varphi$. A 10 cm segment divided this way has pieces of about 6.18 cm and 3.82 cm. The name "golden" is much later; it became common in the 1800s.

## The regular pentagon and the golden triangle

Each interior angle of a regular pentagon is $\tfrac{(5 - 2)180^\circ}{5} = 108^\circ$ (Lesson 17). Draw the two diagonals from one vertex $A$: they cut the $108^\circ$ angle into three angles of $36^\circ$ each. (Each side triangle, like $\triangle ABC$, is isosceles with apex $108^\circ$, so its base angles are $36^\circ$; that leaves $108^\circ - 36^\circ - 36^\circ = 36^\circ$ in the middle.)

![A regular pentagon ABCDE with all five diagonals drawn, forming a five-pointed star. Triangle ACD, made of two diagonals from A and the bottom side CD, is shaded. Its angle at A is marked 36 degrees and its angle at C is marked 72 degrees. The interior angle of the pentagon at B is marked 108 degrees.](images/geo-m6-pentagon.svg)

So $\triangle ACD$, with two diagonals as its legs and a side as its base, has angles $36^\circ$, $72^\circ$, $72^\circ$. An isosceles triangle with these angles is a **golden triangle**, and the next argument shows its legs are $\varphi$ times its base.

**The self-similar cut.** Take a golden triangle $ABC$ with apex $\angle A = 36^\circ$, legs $AB = AC = 1$ and base $BC = b$. Bisect the base angle at $B$; the bisector meets $\overline{AC}$ at $D$.

- $\angle DBC = 36^\circ$ and $\angle C = 72^\circ$, so $\angle BDC = 72^\circ$. Triangle $BCD$ has angles $36^\circ$, $72^\circ$, $72^\circ$: it is similar to $\triangle ABC$ by AA, a smaller golden triangle. Its equal sides give $BD = BC = b$.
- $\angle ABD = 36^\circ = \angle A$, so $\triangle ABD$ is isosceles with $AD = BD = b$. Then $DC = 1 - b$.
- Similarity of $\triangle BCD$ and $\triangle ABC$ (base over leg): $\dfrac{CD}{BC} = \dfrac{BC}{AB}$, so $\dfrac{1 - b}{b} = \dfrac{b}{1}$, which gives $b^2 + b - 1 = 0$ and $b = \dfrac{\sqrt5 - 1}{2} = \dfrac{1}{\varphi}$.

So leg $\div$ base $= \tfrac{1}{b} = \varphi$. The leftover piece, $\triangle ABD$ with angles $36^\circ$, $36^\circ$, $108^\circ$, is called a golden gnomon. In the pentagon, this means:

**Regular pentagon.** The ratio of a diagonal to a side is $\varphi$.

### Example 2

A regular pentagon has side 10. Find a diagonal, exactly and to two decimals.

Diagonal $= 10\varphi = 10 \cdot \dfrac{1 + \sqrt5}{2} = 5 + 5\sqrt5 \approx 16.18$.

### Example 3: exact values of cos 72° and cos 36°

**cos 72°.** In a golden triangle with base 1 and legs $\varphi$, drop the altitude from the apex. It bisects the base (isosceles triangle), making a right triangle with hypotenuse $\varphi$, a $72^\circ$ angle, and adjacent leg $\tfrac12$. So

$$\cos 72^\circ = \frac{1/2}{\varphi} = \frac{1}{2\varphi} = \frac{\varphi - 1}{2} = \frac{\sqrt5 - 1}{4} \approx 0.3090.$$

**cos 36°.** In the golden gnomon $ABD$ above, the legs are $b = \tfrac{1}{\varphi}$ and the base is $AB = 1$, with $36^\circ$ base angles. The altitude from $D$ bisects $AB$, giving a right triangle with hypotenuse $\tfrac{1}{\varphi}$, a $36^\circ$ angle and adjacent leg $\tfrac12$:

$$\cos 36^\circ = \frac{1/2}{1/\varphi} = \frac{\varphi}{2} = \frac{1 + \sqrt5}{4} \approx 0.8090.$$

A calculator confirms both decimals. Together with Lesson 24's table for $30^\circ$, $45^\circ$ and $60^\circ$, these are among the few angles whose trig values have simple exact forms.

## Fibonacci numbers

The **Fibonacci sequence** starts 1, 1 and makes each new term the sum of the two before: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …. Ratios of consecutive terms approach $\varphi$:

| Ratio | $\tfrac{3}{2}$ | $\tfrac{5}{3}$ | $\tfrac{8}{5}$ | $\tfrac{13}{8}$ | $\tfrac{21}{13}$ | $\tfrac{34}{21}$ | $\tfrac{55}{34}$ |
|---|---|---|---|---|---|---|---|
| Value | 1.5 | 1.667 | 1.6 | 1.625 | 1.615 | 1.619 | 1.618 |

*Why.* If the ratio $\tfrac{F_{n+1}}{F_n}$ settles down to some number $r$, then $\tfrac{F_{n+2}}{F_{n+1}} = \tfrac{F_{n+1} + F_n}{F_{n+1}} = 1 + \tfrac{F_n}{F_{n+1}}$ gives $r = 1 + \tfrac{1}{r}$, the golden ratio equation again. (Proving that the ratio does settle down takes more work.) So a rectangle 34 by 21 is very nearly golden, and the squares of sides 1, 1, 2, 3, 5, 8, … fit together into a nest like the picture above.

## Fact and myth

The golden ratio really is built into the regular pentagon and into Fibonacci numbers, and the numbers of spirals in sunflower heads and pinecones are often consecutive Fibonacci numbers. But many popular claims go well beyond the evidence:

- **Buildings and paintings.** Claims that the Parthenon, the Great Pyramid or famous paintings were designed with $\varphi$ usually rest on measurements chosen after the fact. There is no surviving evidence that the ancient builders used it, and almost any complicated object contains *some* two lengths with a ratio near 1.6.
- **Nautilus shells.** The shell grows in a logarithmic spiral, but measurements of real shells generally do not match the golden spiral's growth rate.
- **"The most beautiful rectangle."** Experiments asking people to pick the most pleasing rectangle have given mixed results; there is no solid evidence of a universal preference for $\varphi$.

These points are about evidence, not taste: the mathematics of $\varphi$ is exact, while the claims about art and nature need measurements, and many don't survive them.

## Common mistakes

- **Writing $\tfrac{1}{\varphi} \approx 1.618$.** $\varphi \approx 1.618$ and $\tfrac{1}{\varphi} = \varphi - 1 \approx 0.618$.
- **Dropping the similarity condition.** Not every rectangle leaves a similar piece when a square is cut off; only the golden one does. A $2 \times 1$ rectangle leaves a $1 \times 1$ square.
- **Mixing up the two golden-ratio triangles.** The golden triangle has angles 36-72-72 (legs $\varphi$ times the base); the golden gnomon has angles 36-36-108 (base $\varphi$ times the legs).
- **Using the negative root.** $\tfrac{1 - \sqrt5}{2} \approx -0.618$ also solves $x^2 - x - 1 = 0$, but a length can't be negative.

## Key points

- $\varphi = \dfrac{1 + \sqrt5}{2} \approx 1.618$ solves $x^2 = x + 1$; also $\tfrac{1}{\varphi} = \varphi - 1 \approx 0.618$.
- Cutting a square off a golden rectangle leaves a smaller golden rectangle, similar to the original.
- Euclid's extreme and mean ratio: the whole is to the longer piece as the longer is to the shorter.
- In a regular pentagon, diagonal $\div$ side $= \varphi$; the 36-72-72 golden triangle has legs $\varphi$ times its base.
- $\cos 36^\circ = \tfrac{1 + \sqrt5}{4}$ and $\cos 72^\circ = \tfrac{\sqrt5 - 1}{4}$.
- Ratios of consecutive Fibonacci numbers approach $\varphi$; many claims about $\varphi$ in art and nature are unsupported.
