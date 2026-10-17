---
id: alg-quad-apps
module: alg-m6
title: "Quadratic applications: maximum, minimum, and projectiles"
minutes: 30
topics: [Quadratic applications]
drills: [alg-d-projectile, alg-d-fence-max, alg-d-revenue-max]
refs: [alg-ref-polynomials]
---
Many real questions ask for the largest or smallest possible value of something: the most area a fence can enclose, the price that brings in the most revenue, the highest point a ball reaches. When the quantity is a quadratic function, the answer is at the vertex of its parabola. This lesson puts the vertex formula from Lesson 24 and the solving methods from Lessons 21–23 to work on such problems.

## Optimization with a quadratic

For $f(x) = ax^2 + bx + c$:

- if $a < 0$, the parabola opens down and $f$ has a **maximum value** $f\left(-\tfrac{b}{2a}\right)$;
- if $a > 0$, it opens up and $f$ has a **minimum value** $f\left(-\tfrac{b}{2a}\right)$.

Two different numbers are involved, and problems ask for either. The input $x = -\tfrac{b}{2a}$ is *where* the max or min occurs; the output $f\left(-\tfrac{b}{2a}\right)$ is *what* the max or min is. Read the question carefully to give the one it asks for.

A strategy for word problems:

1. Identify the quantity to maximize or minimize, and write it as a function of one variable (use a second fact to eliminate any other variable).
2. Confirm it's quadratic and check the sign of $a$.
3. Find the vertex.
4. Answer the question in context, with units.

## Projectile motion

An object thrown straight up (or launched) near Earth's surface, ignoring air resistance, has height

$$h(t) = -16t^2 + v_0 t + h_0 \quad \text{(feet)}, \qquad h(t) = -4.9t^2 + v_0 t + h_0 \quad \text{(meters)},$$

where $t$ is time in seconds, $v_0$ is the initial upward velocity and $h_0$ is the starting height. The $-16$ (or $-4.9$) is half the acceleration due to gravity, about $32$ ft/s² (or $9.8$ m/s²), rounded; it's negative because gravity pulls down, so the parabola opens down and has a highest point.

### Example 1

A ball is thrown upward from a 6-foot platform at 40 feet per second. When does it reach its maximum height, what is that height, and when does it hit the ground?

1. $h(t) = -16t^2 + 40t + 6$, with $a = -16$, $b = 40$.
2. Time of maximum: $t = -\dfrac{40}{2(-16)} = 1.25$ seconds.
3. Maximum height: $h(1.25) = -16(1.5625) + 50 + 6 = -25 + 56 = 31$ feet.
4. Ground: solve $-16t^2 + 40t + 6 = 0$. Divide by $-2$: $8t^2 - 20t - 3 = 0$. The quadratic formula gives $t = \dfrac{20 \pm \sqrt{400 + 96}}{16} = \dfrac{20 \pm \sqrt{496}}{16}$. The positive root is $t \approx \dfrac{20 + 22.27}{16} \approx 2.64$ seconds. (The negative root is rejected: time before the throw.)

```plot
{"x": [-0.5, 3], "y": [-5, 36], "functions": [{"f": "-16*x^2 + 40*x + 6", "label": "h(t)", "from": 0, "to": 2.8}], "points": [{"at": [1.25, 31], "label": "max (1.25, 31)"}, {"at": [0, 6], "label": "(0, 6)"}, {"at": [2.64, 0], "label": "lands"}], "xLabel": "t (s)", "yLabel": "height (ft)", "caption": "The graph is height against time, not the ball's path through the air"}
```

The graph shows height against time. The ball actually moves straight up and down; the parabola is a plot of its height over time.

## Maximum area

### Example 2

A farmer has 240 m of fencing to enclose a rectangular field along a river. No fence is needed along the river side. What dimensions give the largest area?

```shape
{"polygons": [{"points": [[0, 0], [12, 0], [12, 6], [0, 6]]}], "segments": [{"from": [0, 6], "to": [12, 6], "dashed": true, "label": "river (no fence)"}, {"from": [0, 0], "to": [12, 0], "label": "240 - 2x"}, {"from": [0, 6], "to": [0, 0], "label": "x"}, {"from": [12, 0], "to": [12, 6], "label": "x"}], "caption": "Two sides of length x and one side of length 240 - 2x"}
```

1. Let $x$ be the length of each side perpendicular to the river. The side parallel to the river is $240 - 2x$.
2. Area: $A(x) = x(240 - 2x) = -2x^2 + 240x$.
3. $a = -2 < 0$, so there's a maximum at $x = -\dfrac{240}{2(-2)} = 60$.
4. Dimensions: 60 m by $240 - 120 = 120$ m. Maximum area: $60 \times 120 = 7{,}200$ m².

Without the river, with fencing on all four sides, the same reasoning gives a square. The river lets the long side be twice the short side.

## Maximum revenue

**Revenue** is price times quantity sold. When raising the price reduces sales at a steady rate, revenue becomes a quadratic in the price.

### Example 3

A theater sells 500 tickets a night at $20 each. For every $1 increase in price, it sells 20 fewer tickets. What price maximizes revenue?

1. Let $n$ be the number of $1 increases. Price: $20 + n$. Tickets: $500 - 20n$.
2. Revenue: $R(n) = (20 + n)(500 - 20n) = 10000 + 100n - 20n^2$.
3. Vertex: $n = -\dfrac{100}{2(-20)} = 2.5$.
4. The best price is $22.50, selling $500 - 50 = 450$ tickets, for revenue $22.50 \times 450 = 10{,}125$ dollars, compared with $10{,}000$ at the original price.

Using the intercept form is a neat check: $R(n) = 0$ when $n = -20$ or $n = 25$, and the vertex is halfway between, at $n = 2.5$.

## Minimum problems

### Example 4

Find two numbers that differ by 10 and whose product is as small as possible.

1. Call them $x$ and $x + 10$. Product: $P(x) = x(x + 10) = x^2 + 10x$.
2. $a = 1 > 0$: a minimum at $x = -\tfrac{10}{2} = -5$.
3. The numbers are $-5$ and $5$, with product $-25$.

## Common mistakes

- Giving the input $-\tfrac{b}{2a}$ when the question asks for the maximum value, or vice versa.
- Using a quadratic with $a > 0$ to find a maximum. Check the sign: an upward parabola has no maximum.
- Forgetting a constraint: in the river problem, only three sides need fence.
- Mixing feet and meters in projectile formulas ($-16$ is for feet, $-4.9$ for meters).
- Reading the height-time parabola as the ball's path.

## Key points

- A quadratic's maximum (if $a < 0$) or minimum (if $a > 0$) is at its vertex, $x = -\tfrac{b}{2a}$.
- Distinguish where the extreme occurs ($x$) from what it is ($f(x)$).
- Projectiles: $h(t) = -16t^2 + v_0t + h_0$ in feet, $-4.9t^2 + v_0t + h_0$ in meters.
- Build the function from the words, reduce to one variable, then use the vertex.
