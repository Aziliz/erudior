---
id: phys-motion-1d
module: phys-m2
title: Describing motion in one dimension
minutes: 35
topics: [Velocity and acceleration, Motion graphs]
drills: [phys-avg-velocity, phys-vt-graph]
refs: [phys-ref-mechanics]
---
## What kinematics is for

**Kinematics** describes motion, where things are and how fast that changes, without yet asking what causes it (that's Newton's laws, two lessons from now). We start with motion along a straight line, because everything in two and three dimensions is built from it one axis at a time. The vector ideas from the last lesson apply directly: in one dimension a vector is just a signed number, with the sign giving the direction.

## Position, displacement, and distance

Choose an origin and a positive direction. An object's **position** $x$ is its coordinate along that line. The **displacement** over a time interval is the change in position,

$$\Delta x = x_f - x_i,$$

which can be positive, negative or zero. **Distance** is the total length of path covered, always positive. Walk 5 m forward and 5 m back: distance 10 m, displacement 0.

## Velocity and speed

The **average velocity** over an interval is displacement divided by elapsed time:

$$v_{\text{avg}} = \frac{\Delta x}{\Delta t}.$$

**Average speed** is distance divided by time. They can differ wildly: a runner who finishes one lap of a 400 m track in 80 s has average speed 5 m/s but average velocity 0, since she ends where she started.

Average velocity hides what happened inside the interval. Shrink the interval and you approach the **instantaneous velocity**, the velocity at one moment, which is what a speedometer reports (its magnitude is the instantaneous speed).

### Example 1

A cyclist rides 6.0 km east in 15 min, then 2.0 km west in 5.0 min. Find the average velocity and average speed for the whole trip, in km/h.

Total time: 20 min $= \tfrac13$ h. Displacement: $+6.0 - 2.0 = +4.0$ km (east). Distance: $6.0 + 2.0 = 8.0$ km.

Average velocity: $\dfrac{4.0\text{ km}}{1/3\text{ h}} = 12$ km/h east. Average speed: $\dfrac{8.0}{1/3} = 24$ km/h.

Notice you can't average the two legs' velocities ($24$ km/h and $-24$ km/h) to get the answer; average velocity always comes from total displacement over total time.

## Acceleration

**Acceleration** is the rate of change of velocity:

$$a_{\text{avg}} = \frac{\Delta v}{\Delta t},$$

with units m/s², read "meters per second, per second": each second the velocity changes by that many m/s. Its sign tells the direction of the change, not whether the object speeds up. An object speeds up when $v$ and $a$ have the same sign and slows down when they have opposite signs. A car moving in the $-x$ direction and braking has $v < 0$ and $a > 0$. Avoid the word "deceleration" in calculations; it hides the sign.

## Motion graphs

Graphs carry the same information as equations, often more clearly.

*Position–time ($x$–$t$) graph.* The slope at any point is the instantaneous velocity. A straight line means constant velocity; a curve means changing velocity. The slope of a chord between two points is the average velocity over that interval.

```plot
{"x": [0, 6], "y": [-1, 10], "xLabel": "t (s)", "yLabel": "x (m)", "functions": [{"f": "0.5*x^2 - 0.5*x", "from": 0, "to": 5, "label": "x(t)"}], "tangents": [{"f": "0.5*x^2 - 0.5*x", "at": 3}], "points": [{"at": [3, 3], "label": "slope here = v(3) = 2.5 m/s"}], "caption": "An x–t graph curving upward: the slope (velocity) is increasing"}
```

*Velocity–time ($v$–$t$) graph.* Two facts make it the most useful kinematics graph:

1. The slope is the acceleration.
2. The signed area between the curve and the $t$ axis is the displacement. Area above the axis counts positive, below counts negative.

The area fact comes from $\Delta x = v\,\Delta t$ for each thin strip of time: the strip's area is exactly its displacement, and adding strips adds displacements.

```plot
{"x": [0, 10], "y": [-4, 8], "xLabel": "t (s)", "yLabel": "v (m/s)", "functions": [{"f": "if(x < 4, 1.5*x, if(x < 7, 6, 6 - 4*(x - 7)))", "from": 0, "to": 9, "label": "v(t)"}], "shade": [{"f": "if(x < 4, 1.5*x, if(x < 7, 6, 6 - 4*(x - 7)))", "from": 0, "to": 9}], "caption": "Speeding up (0–4 s), constant velocity (4–7 s), then slowing, stopping at 8.5 s and reversing"}
```

*Acceleration–time ($a$–$t$) graph.* The area under it is the change in velocity, $\Delta v$.

### Example 2

Use the $v$–$t$ graph above. (a) What is the acceleration from 0 to 4 s? (b) What is the displacement from 0 to 7 s? (c) When does the object turn around?

(a) Slope $= \dfrac{6 - 0}{4 - 0} = 1.5$ m/s².

(b) Area: a triangle from 0 to 4 s, $\tfrac12(4)(6) = 12$ m, plus a rectangle from 4 to 7 s, $3(6) = 18$ m. Total 30 m.

(c) It turns around where $v$ changes sign. After 7 s, $v = 6 - 4(t - 7)$, which is zero at $t = 8.5$ s. Before 8.5 s it moves in $+x$, after it in $-x$. Note that $a = -4$ m/s² throughout the last segment, including the instant $v = 0$: the object is momentarily at rest but still accelerating.

## Instantaneous velocity from a curved graph

When an $x$–$t$ graph curves, the velocity at one instant is the slope of the *tangent line* there: the straight line that just touches the curve at that point and runs in the same direction as the curve. To find it, draw (or read) the tangent, pick two points on it that are far apart, and compute rise over run. The farther apart the two points, the smaller the effect of reading errors.

Why the tangent? The slope of a chord between two times is the average velocity over that interval. As the second time moves closer to the first, the chord swings around until it lies along the tangent, so the tangent's slope is the average velocity over a vanishingly short interval, which is exactly what instantaneous velocity means.

### Example 3

The first graph above is $x = 0.5t^2 - 0.5t$ (meters, seconds), with its tangent drawn at $t = 3$ s. The tangent passes through $(2\text{ s}, 0.5\text{ m})$ and $(5\text{ s}, 8.0\text{ m})$. Find the instantaneous velocity at 3 s and compare it with the average velocity from 0 to 3 s.

Instantaneous: slope of the tangent $= \dfrac{8.0 - 0.5}{5 - 2} = \dfrac{7.5}{3} = 2.5$ m/s.

Average: $x(0) = 0$ and $x(3) = 4.5 - 1.5 = 3.0$ m, so $v_{\text{avg}} = 3.0/3 = 1.0$ m/s.

The object is speeding up, so its velocity at the end of the interval is larger than its average over the interval. The chord from $t = 0$ to $t = 3$ s is visibly less steep than the tangent at 3 s.

## Reading one graph from another

The three graphs are linked: each one's slope is the next one's height, and each one's area gives the change in the previous one.

| If the $v$–$t$ graph is… | then the $x$–$t$ graph is… | and the $a$–$t$ graph is… |
|---|---|---|
| zero | flat (object at rest) | zero |
| a positive constant | a straight line sloping up | zero |
| a line sloping up | curving upward, getting steeper | a positive constant |
| a line sloping down through zero | rising, peaking where $v = 0$, then falling | a negative constant |

Areas run the other way: the area under an $a$–$t$ graph gives $\Delta v$, and the area under a $v$–$t$ graph gives $\Delta x$. An area tells you only the *change*; to get the actual velocity or position you also need its starting value.

### Example 4

A cart moving at 1.0 m/s has the acceleration shown: 2.0 m/s² from 0 to 3.0 s, then $-1.0$ m/s² from 3.0 to 7.0 s. Find its velocity at 3.0 s and at 7.0 s, and its displacement over the 7.0 s.

```plot
{"x": [0, 8], "y": [-2, 3], "xLabel": "t (s)", "yLabel": "a (m/s²)", "functions": [{"f": "2", "from": 0, "to": 3}, {"f": "-1", "from": 3, "to": 7}], "shade": [{"f": "2", "from": 0, "to": 3}, {"f": "-1", "from": 3, "to": 7}], "caption": "Acceleration–time graph: the shaded areas are the changes in velocity"}
```

Velocities from areas under the $a$–$t$ graph: from 0 to 3.0 s, $\Delta v = 2.0 \times 3.0 = 6.0$ m/s, so $v(3) = 1.0 + 6.0 = 7.0$ m/s. From 3.0 to 7.0 s, $\Delta v = -1.0 \times 4.0 = -4.0$ m/s, so $v(7) = 7.0 - 4.0 = 3.0$ m/s.

Displacement from areas under the $v$–$t$ graph, which is a straight line in each phase (so each area is a trapezoid): $\tfrac12(1.0 + 7.0)(3.0) = 12$ m, plus $\tfrac12(7.0 + 3.0)(4.0) = 20$ m, for 32 m in all. The velocity stayed positive throughout, so the cart never turned around.

## Common mistakes

- Confusing distance with displacement, or speed with velocity.
- Reading an $x$–$t$ graph's height as the velocity; velocity is the slope.
- Thinking negative acceleration always means slowing down.
- Thinking $v = 0$ means $a = 0$ (a ball at the top of its flight has $v = 0$ but $a = -9.8$ m/s²).
- Averaging velocities from legs of unequal duration.

## Key points

- Displacement $\Delta x = x_f - x_i$ is signed; distance is not.
- $v_{\text{avg}} = \Delta x/\Delta t$; $a_{\text{avg}} = \Delta v/\Delta t$.
- Slope of $x$–$t$ is $v$; slope of $v$–$t$ is $a$; area under $v$–$t$ is $\Delta x$; area under $a$–$t$ is $\Delta v$.
- Instantaneous velocity is the slope of the tangent line to the $x$–$t$ graph.
- Areas give changes only; add the starting value to get the actual velocity or position.
