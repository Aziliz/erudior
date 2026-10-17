---
id: phys-projectiles
module: phys-m2
title: Projectile motion
minutes: 35
topics: [Projectile motion]
drills: [phys-proj-horizontal, phys-proj-angle]
refs: [phys-ref-mechanics]
---
## Two motions at once

A thrown ball, a long jumper, water from a hose: once released, each moves under gravity alone. This is **projectile motion**, and it is the payoff of the previous two lessons. The key idea is that horizontal and vertical motion are independent. Gravity pulls only down, so it changes only the vertical velocity; the horizontal velocity stays constant (ignoring air resistance). A projectile is just a constant-velocity problem in $x$ running side by side with a free-fall problem in $y$, and the two share one thing: the clock.

A famous demonstration: drop one ball and, at the same instant, fire another horizontally from the same height. They hit the floor together. The horizontal motion doesn't delay or speed up the fall.

## The equations

Put the origin at the launch point with $+y$ up. If the launch speed is $v_0$ at angle $\theta$ above horizontal, the initial components are

$$v_{0x} = v_0\cos\theta, \qquad v_{0y} = v_0\sin\theta.$$

Then for all later times (until it lands),

$$x = v_{0x}t, \qquad v_x = v_{0x},$$
$$y = v_{0y}t - \tfrac12gt^2, \qquad v_y = v_{0y} - gt.$$

Eliminating $t$ ($t = x/v_{0x}$) gives $y = x\tan\theta - \dfrac{g}{2v_0^2\cos^2\theta}x^2$, a downward parabola. That's why every projectile path, from a basketball shot to a fountain's arc, is parabolic.

The speed at any moment is $\sqrt{v_x^2 + v_y^2}$, and the velocity is always tangent to the path.

## Horizontal launches

When $\theta = 0$, $v_{0y} = 0$: the object starts falling from rest vertically while sliding along horizontally. The fall time depends only on the height, and the horizontal distance is speed times that time.

### Example 1

A ball rolls off a table 1.20 m high at 3.0 m/s. Where does it land, and how fast is it moving at impact? Use $g = 9.8$ m/s².

Vertical (take down as positive here): $1.20 = \tfrac12(9.8)t^2$, so $t = \sqrt{2(1.20)/9.8} = 0.495$ s.

Horizontal: $x = 3.0 \times 0.495 = 1.48$ m from the table's edge.

Impact velocity: $v_x = 3.0$ m/s, $v_y = gt = 4.85$ m/s downward. Speed $= \sqrt{3.0^2 + 4.85^2} = 5.70$ m/s, at $\tan^{-1}(4.85/3.0) = 58^\circ$ below horizontal.

## Launches at an angle

For a launch from level ground that lands at the same height, three results are worth knowing (and deriving):

- *Time of flight.* $y = 0$ again when $v_{0y}t - \tfrac12gt^2 = 0$, so $T = \dfrac{2v_0\sin\theta}{g}$.
- *Maximum height.* At the top $v_y = 0$; from $v_y^2 = v_{0y}^2 - 2gH$: $H = \dfrac{v_0^2\sin^2\theta}{2g}$.
- *Range.* $R = v_{0x}T = \dfrac{2v_0^2\sin\theta\cos\theta}{g} = \dfrac{v_0^2\sin 2\theta}{g}$.

The range is largest when $\sin 2\theta = 1$, that is $\theta = 45^\circ$. Complementary angles ($30^\circ$ and $60^\circ$, say) give the same range, since $\sin 2\theta = \sin(180^\circ - 2\theta)$; the steeper shot goes higher and stays up longer.

```plot
{"x": [0, 45], "y": [0, 20], "equal": true, "xLabel": "x (m)", "yLabel": "y (m)", "functions": [{"f": "x*tand(30) - 9.8*x^2/(2*400*cosd(30)^2)", "from": 0, "to": 35.35}, {"f": "x - 9.8*x^2/400", "from": 0, "to": 40.82}, {"f": "x*tand(60) - 9.8*x^2/(2*400*cosd(60)^2)", "from": 0, "to": 35.35}], "labels": [{"at": [17.7, 6.2], "text": "30°"}, {"at": [20.4, 11.2], "text": "45°"}, {"at": [17.7, 16.4], "text": "60°"}], "caption": "Launched at 20 m/s: 45° goes farthest; 30° and 60° land at the same spot"}
```

These shortcut formulas hold only when the projectile lands at its launch height. For a cliff, a basket above the shooter, or a ball hit from a tee into a hill, go back to the component equations.

### Example 2

A soccer ball is kicked at 18.0 m/s at $35^\circ$ above level ground. Find the time of flight, the maximum height and the range.

Components: $v_{0x} = 18.0\cos 35^\circ = 14.74$ m/s, $v_{0y} = 18.0\sin 35^\circ = 10.32$ m/s.

Time of flight: $T = 2(10.32)/9.8 = 2.11$ s.

Maximum height: $H = \dfrac{10.32^2}{2(9.8)} = 5.44$ m.

Range: $R = 14.74 \times 2.107 = 31.1$ m. Check with the formula: $R = \dfrac{18.0^2\sin 70^\circ}{9.8} = \dfrac{324(0.9397)}{9.8} = 31.1$ m.

### Example 3

A stone is thrown from a cliff 25.0 m high at 15.0 m/s, $30^\circ$ above horizontal. How long until it hits the water below, and how far from the cliff base?

Here the range formula doesn't apply. Components: $v_{0x} = 13.0$ m/s, $v_{0y} = 7.50$ m/s. Origin at the launch point, up positive; the water is at $y = -25.0$ m:

$$-25.0 = 7.50t - 4.9t^2 \quad\Rightarrow\quad 4.9t^2 - 7.50t - 25.0 = 0.$$

Quadratic formula: $t = \dfrac{7.50 + \sqrt{56.25 + 490}}{9.8} = \dfrac{7.50 + 23.37}{9.8} = 3.15$ s (the other root is negative, before the throw).

Horizontal distance: $x = 13.0 \times 3.15 = 40.9$ m.

## Scaling: what changes when the launch speed changes

The level-ground formulas make proportional reasoning quick. Time of flight is proportional to $v_0$, while maximum height and range are proportional to $v_0^2$. Mass appears nowhere: without air resistance, a heavy and a light ball launched the same way follow the same path.

### Example 4

A ball launched from level ground at some angle has a range of 20 m and a flight time of 1.6 s. It is relaunched at the same angle with twice the speed. Predict the new range, maximum height (compared with the old) and flight time.

Both $v_{0x}$ and $v_{0y}$ double. The flight time $2v_{0y}/g$ doubles, to 3.2 s. The range $v_{0x}T$ is (twice the horizontal speed) times (twice the time), so it quadruples, to 80 m. The height $v_{0y}^2/(2g)$ also quadruples. On the Moon, with $g$ six times smaller, the original launch would stay up six times longer and go six times as far.

## Air resistance

Real projectiles feel air drag, which points opposite the velocity and grows with speed. It slows the horizontal motion as well as the vertical, so the path is no longer a parabola: it is shorter, and it falls more steeply on the way down than it rose. With drag the best angle for range drops below $45^\circ$. For a dense, slow object (a shot put, a tossed coin) drag is small and the parabola is an excellent model; for a ping-pong ball or a long-distance golf drive it is not.

## Common mistakes

- Letting gravity affect $v_x$, or forgetting that $v_x$ stays constant.
- Using $v_0$ instead of $v_0\cos\theta$ for horizontal motion (or $\sin$ and $\cos$ swapped).
- Using the range formula when launch and landing heights differ.
- Saying the speed at the top is zero; only $v_y$ is zero there, and $v_x$ is unchanged.
- Treating the time to reach the top as the whole flight time.

## Key points

- Horizontal: constant velocity $v_0\cos\theta$. Vertical: free fall with $v_{0y} = v_0\sin\theta$. Time links them.
- Level ground: $T = \dfrac{2v_0\sin\theta}{g}$, $H = \dfrac{v_0^2\sin^2\theta}{2g}$, $R = \dfrac{v_0^2\sin 2\theta}{g}$ (max at $45^\circ$).
- Other launch and landing heights: solve the $y$ equation for $t$, then use it in $x$.
- On level ground, flight time scales with $v_0$; range and height scale with $v_0^2$.
