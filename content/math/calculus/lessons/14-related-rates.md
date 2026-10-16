---
id: calc-related-rates
module: calc-m4
title: Related rates
minutes: 35
topics: [Related rates]
drills: [calc-d-rr-circle, calc-d-rr-ladder]
refs: [calc-ref-derivatives]
---
## Rates that are tied together

When air is pumped into a balloon, its volume and radius both grow. Since volume depends on radius, their rates of growth are connected. If you know how fast one changes, you can find how fast the other changes. These are **related rates** problems: two or more quantities linked by an equation, all changing with time, and the chain rule (in the form of implicit differentiation with respect to $t$) connects their rates.

The core move: if $V = \frac43\pi r^3$ and both $V$ and $r$ are functions of time, differentiate both sides with respect to $t$:

$$\frac{dV}{dt} = 4\pi r^2\frac{dr}{dt}.$$

Every variable picks up a $\frac{d}{dt}$ factor, just as $y$ picked up $\frac{dy}{dx}$ in Lesson 12.

## A reliable procedure

1. *Draw and label* a picture. Use letters for every quantity that changes; use numbers only for quantities that stay fixed.
2. *List* the given rate(s), the rate you want, and the instant you care about ("when $r = 5$").
3. *Write an equation* relating the quantities (geometry, Pythagoras, similar triangles, trig).
4. *Differentiate* both sides with respect to $t$.
5. *Substitute* the values at the instant, and solve for the unknown rate.
6. *State the answer with units and sign meaning.*

The most important rule: *don't substitute the changing values until after you differentiate.* If you plug in $r = 5$ first, $r$ becomes a constant and its rate vanishes.

### Example 1 (an expanding ripple)

A stone dropped in a pond makes a circular ripple whose radius grows at 3 cm/s. How fast is the area growing when the radius is 10 cm?

- Given: $\dfrac{dr}{dt} = 3$. Want: $\dfrac{dA}{dt}$ when $r = 10$.
- Equation: $A = \pi r^2$.
- Differentiate in $t$: $\dfrac{dA}{dt} = 2\pi r\dfrac{dr}{dt}$.
- Substitute: $\dfrac{dA}{dt} = 2\pi(10)(3) = 60\pi \approx 188.5$ cm²/s.

The area grows faster as the circle gets bigger, even though the radius grows at a constant rate: the same thickening of the edge covers more area on a longer circumference ($2\pi r$).

### Example 2 (the sliding ladder)

A 13-ft ladder leans against a wall. Its foot slides away from the wall at 2 ft/s. How fast is the top sliding down when the foot is 5 ft from the wall?

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [0, 12]]}], "rightAngles": [[[0, 0], [5, 0], [0, 12]]], "segments": [{"from": [0, 0], "to": [5, 0], "label": "x"}, {"from": [0, 0], "to": [0, 12], "label": "y"}, {"from": [5, 0], "to": [0, 12], "label": "13"}], "caption": "Wall, floor and ladder: x² + y² = 169"}
```

- Let $x$ = distance from wall to foot, $y$ = height of top. Given $\dfrac{dx}{dt} = 2$. Want $\dfrac{dy}{dt}$ when $x = 5$.
- Equation: $x^2 + y^2 = 13^2$ (the ladder's length is fixed, so it's a number).
- Differentiate: $2x\dfrac{dx}{dt} + 2y\dfrac{dy}{dt} = 0$.
- At $x = 5$: $y = \sqrt{169 - 25} = 12$. So $2(5)(2) + 2(12)\dfrac{dy}{dt} = 0$, giving $\dfrac{dy}{dt} = -\dfrac{20}{24} = -\dfrac56$ ft/s.

The top slides down at $\frac56$ ft/s. The negative sign means $y$ is decreasing. Notice you needed $y$ at that instant, which came from the original equation.

### Example 3 (a conical tank, using similar triangles)

Water drains from an inverted cone (point down) with height 12 m and top radius 4 m, at 2 m³/min. How fast is the water level falling when the water is 6 m deep?

```shape
{"polygons": [{"points": [[-4, 12], [4, 12], [0, 0]]}, {"points": [[-2, 6], [2, 6], [0, 0]], "fill": true}], "segments": [{"from": [0, 0], "to": [0, 12], "dashed": true}, {"from": [0, 12], "to": [4, 12], "label": "4"}, {"from": [0, 6], "to": [2, 6], "label": "r"}], "labels": [{"at": [0.7, 3], "text": "h"}, {"at": [-1.2, 10], "text": "12"}], "caption": "Water forms a smaller cone similar to the tank: r/h = 4/12"}
```

- Volume of water: $V = \frac13\pi r^2h$. Given $\dfrac{dV}{dt} = -2$. Want $\dfrac{dh}{dt}$ when $h = 6$.
- Three variables is one too many. Similar triangles: $\dfrac rh = \dfrac{4}{12}$, so $r = \dfrac h3$. Then
$$V = \frac13\pi\left(\frac h3\right)^2h = \frac{\pi}{27}h^3.$$
- Differentiate: $\dfrac{dV}{dt} = \dfrac{\pi}{9}h^2\dfrac{dh}{dt}$.
- At $h = 6$: $-2 = \dfrac{\pi}{9}(36)\dfrac{dh}{dt} = 4\pi\dfrac{dh}{dt}$, so $\dfrac{dh}{dt} = -\dfrac{1}{2\pi} \approx -0.159$ m/min.

The level falls about 0.16 m per minute at that moment, and it will fall faster as the cone narrows.

### Example 4 (an angle of elevation)

A balloon rises straight up at 5 m/s from a point 100 m from an observer. How fast is the angle of elevation $\theta$ increasing when the balloon is 100 m high?

- Let $y$ = height. $\tan\theta = \dfrac{y}{100}$. Given $\dfrac{dy}{dt} = 5$.
- Differentiate: $\sec^2\theta\,\dfrac{d\theta}{dt} = \dfrac{1}{100}\dfrac{dy}{dt}$.
- When $y = 100$, $\theta = \pi/4$ and $\sec^2\theta = 2$. So $2\dfrac{d\theta}{dt} = \dfrac{5}{100}$, and $\dfrac{d\theta}{dt} = 0.025$ rad/s.

Angles come out in radians per unit time, because the derivative of $\tan\theta$ assumes radians.

### Example 5 (two cars)

Car A drives north from an intersection at 60 mph; car B drives east from the same intersection at 80 mph, both starting at noon. How fast is the distance between them changing at 2 p.m.?

At time $t$ hours, A is $y = 60t$ north and B is $x = 80t$ east; distance $D$ satisfies $D^2 = x^2 + y^2$. Differentiate: $2D\dfrac{dD}{dt} = 2x\dfrac{dx}{dt} + 2y\dfrac{dy}{dt}$. At $t = 2$: $x = 160$, $y = 120$, $D = 200$. So $200\dfrac{dD}{dt} = 160(80) + 120(60) = 20{,}000$, and $\dfrac{dD}{dt} = 100$ mph.

## Common mistakes

- *Substituting too early.* Plug in the instant's values only after differentiating.
- *Sign errors.* Decreasing quantities have negative rates: draining means $\frac{dV}{dt} < 0$.
- **Forgetting a $\frac{d}{dt}$.** Every changing variable gets one; constants (like the ladder's 13 ft) don't.
- *Not finding all values at the instant.* You often need another variable's value from the original equation (the ladder's $y = 12$).
- *Too many variables.* Use similar triangles or a given relationship to eliminate one before differentiating.
- *Degrees.* Angle rates are in radians per unit time.

## Key points

- Related rates: an equation linking quantities, differentiated implicitly with respect to time.
- Procedure: picture, knowns/unknown, equation, differentiate, substitute, interpret.
- Substitute instantaneous values after differentiating, never before.
- Signs carry meaning: positive = increasing, negative = decreasing.
