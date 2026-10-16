---
id: pc-ellipses
module: pc-m7
title: Ellipses and circles
minutes: 30
topics: [Ellipses]
drills: [pc-ellipse-foci, pc-ellipse-center]
refs: [pc-ref-conics-polar]
---
## Stretched circles

Planets orbit the sun in ellipses, with the sun at one focus, a fact Kepler worked out from naked-eye data four centuries ago. An ellipse is the closed conic, the one that looks like a stretched circle. Like the parabola in the last lesson, it has a distance definition that leads to a standard equation, and the same completing-the-square technique turns a messy general equation into that standard form.

## Definition

An **ellipse** is the set of points in a plane whose distances to two fixed points, the **foci** (singular: focus), add up to a constant. You can draw one with two pins and a loop of string: keep the string taut with a pencil and trace around.

Label the parts: the **center** is the midpoint of the foci. The longest chord, through both foci, is the **major axis**; its endpoints are the **vertices**. The chord through the center perpendicular to it is the **minor axis**, with endpoints called **co-vertices**.

## The standard equation

Put the center at the origin with foci $(\pm c, 0)$, and call the constant sum of distances $2a$. At a vertex $(a, 0)$, the distances are $a - c$ and $a + c$, which do add to $2a$, so the vertices are $(\pm a, 0)$. Writing $\sqrt{(x + c)^2 + y^2} + \sqrt{(x - c)^2 + y^2} = 2a$, isolating one root, squaring twice and simplifying leads to

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1, \qquad \text{where } b^2 = a^2 - c^2.$$

The co-vertices are $(0, \pm b)$. The relation $c^2 = a^2 - b^2$ has a picture: from a co-vertex, the distance to each focus is $a$ (half the string), so $b$, $c$ and $a$ form a right triangle with hypotenuse $a$.

```plot
{"x": [-6, 6], "y": [-4.5, 4.5], "equal": true, "curves": [{"x": "5cos(t)", "y": "3sin(t)", "t": [0, "2pi"]}], "points": [{"at": [-4, 0], "label": "F₁ (−4, 0)"}, {"at": [4, 0], "label": "F₂ (4, 0)"}, {"at": [5, 0]}, {"at": [0, 3], "label": "(0, 3)"}], "segments": [{"from": [-4, 0], "to": [0, 3]}, {"from": [4, 0], "to": [0, 3]}], "caption": "x²/25 + y²/9 = 1, with vertex (5, 0). From the co-vertex (0, 3), each focus is 5 = a units away: 3² + 4² = 5²."}
```

## Horizontal and vertical ellipses

The larger denominator is always $a^2$, and it sits under the variable of the major axis.

| Equation (with $a > b$) | Major axis | Vertices | Co-vertices | Foci |
|---|---|---|---|---|
| $\dfrac{(x - h)^2}{a^2} + \dfrac{(y - k)^2}{b^2} = 1$ | horizontal | $(h \pm a, k)$ | $(h, k \pm b)$ | $(h \pm c, k)$ |
| $\dfrac{(x - h)^2}{b^2} + \dfrac{(y - k)^2}{a^2} = 1$ | vertical | $(h, k \pm a)$ | $(h \pm b, k)$ | $(h, k \pm c)$ |

In both, $c^2 = a^2 - b^2$.

### Example 1

Analyze $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$.

$a^2 = 25$ is under $x^2$: horizontal major axis. $a = 5$, $b = 3$, $c = \sqrt{25 - 9} = 4$. Vertices $(\pm 5, 0)$, co-vertices $(0, \pm 3)$, foci $(\pm 4, 0)$. Major axis length $2a = 10$, minor axis length $2b = 6$.

## Eccentricity

How stretched is an ellipse? Its **eccentricity** is

$$e = \frac{c}{a}, \qquad 0 \le e < 1.$$

When $c$ is near 0, the foci are near the center and the ellipse is nearly a circle ($e \approx 0$). When $c$ is near $a$, the ellipse is long and thin ($e \approx 1$). The ellipse in Example 1 has $e = \frac45 = 0.8$. Earth's orbit has $e \approx 0.017$, nearly circular.

## Circles

When $a = b$, we get $c = 0$: both foci sit at the center and $e = 0$. The equation becomes

$$(x - h)^2 + (y - k)^2 = r^2,$$

a **circle** with center $(h, k)$ and radius $r$. It's the set of points at distance $r$ from the center, the distance formula squared.

## Completing the square

### Example 2

Write $9x^2 + 4y^2 - 36x + 24y + 36 = 0$ in standard form and find the center, vertices and foci.

1. Group and factor out the leading coefficients: $9(x^2 - 4x) + 4(y^2 + 6y) = -36$.
2. Complete each square, adding the same amounts to the right side. Inside the first bracket add 4, which really adds $9 \cdot 4 = 36$; inside the second add 9, which adds $4 \cdot 9 = 36$:
$$9(x - 2)^2 + 4(y + 3)^2 = -36 + 36 + 36 = 36.$$
3. Divide by 36: $\dfrac{(x - 2)^2}{4} + \dfrac{(y + 3)^2}{9} = 1$.

The larger denominator, 9, is under $y$: vertical major axis. Center $(2, -3)$, $a = 3$, $b = 2$, $c = \sqrt{9 - 4} = \sqrt5$. Vertices $(2, 0)$ and $(2, -6)$; co-vertices $(0, -3)$ and $(4, -3)$; foci $(2, -3 \pm \sqrt5)$.

```plot
{"x": [-3, 7], "y": [-7, 1], "equal": true, "curves": [{"x": "2 + 2cos(t)", "y": "-3 + 3sin(t)", "t": [0, "2pi"]}], "points": [{"at": [2, -3], "label": "center"}, {"at": [2, -0.764], "label": "focus"}, {"at": [2, -5.236], "label": "focus"}, {"at": [2, 0], "label": "(2, 0)"}, {"at": [2, -6], "label": "(2, −6)"}], "caption": "(x − 2)²/4 + (y + 3)²/9 = 1: a vertical ellipse centered at (2, −3)."}
```

The most common slip is in step 2: forgetting that the 4 added inside $9(\ \ )$ is really 36.

### Example 3

Find the equation of the ellipse with foci $(0, \pm 3)$ and vertices $(0, \pm 5)$.

Center $(0, 0)$, vertical major axis, $a = 5$, $c = 3$, so $b^2 = 25 - 9 = 16$:

$$\frac{x^2}{16} + \frac{y^2}{25} = 1.$$

## An application

### Example 4

An elliptical "whispering gallery" room is 50 ft long and 30 ft wide. A whisper at one focus is heard clearly at the other. How far apart are the foci?

$2a = 50$ and $2b = 30$, so $a = 25$, $b = 15$, $c = \sqrt{625 - 225} = 20$. The foci are $2c = 40$ ft apart, each 5 ft from an end of the room.

## Common mistakes

- *Assuming $a^2$ is always under $x^2$.* $a^2$ is the larger denominator, wherever it is.
- *Using $c^2 = a^2 + b^2$.* That's the hyperbola. For ellipses $c^2 = a^2 - b^2$.
- *Using $a^2$ as the distance.* Vertices are $a$ units from the center, not $a^2$.
- *Forgetting the factored coefficient* when completing the square.
- *Not dividing to get 1* on the right side.

## Key points

- Ellipse: sum of distances to two foci is $2a$.
- $\frac{(x-h)^2}{a^2} + \frac{(y-k)^2}{b^2} = 1$ (or with $a^2$ under $y$), $a > b$, $c^2 = a^2 - b^2$.
- Vertices $a$ from the center along the major axis; foci $c$ from the center on the same axis.
- Eccentricity $e = \frac{c}{a}$; $e = 0$ is a circle.
- Circle: $(x - h)^2 + (y - k)^2 = r^2$.
