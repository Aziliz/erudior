---
id: phys-const-accel
module: phys-m2
title: Constant acceleration and free fall
minutes: 35
topics: [Constant acceleration, Free fall]
drills: [phys-stopping, phys-free-fall, phys-thrown-up]
refs: [phys-ref-mechanics]
---
## The most useful special case

Last lesson defined velocity and acceleration in general. Most textbook problems, and a surprising amount of real life (a braking car, a dropped phone, a ball thrown upward), involve acceleration that stays constant. In that case the general relationships collapse into four short equations, and a whole family of problems becomes a matter of choosing the right one.

## The four kinematic equations

Suppose $a$ is constant, the clock starts at $t = 0$ with position $x_0$ and velocity $v_0$. Since the $v$–$t$ graph is a straight line with slope $a$,

$$v = v_0 + at. \tag{1}$$

The displacement is the area under that line: a rectangle $v_0 t$ plus a triangle $\tfrac12(at)t$:

$$x - x_0 = v_0 t + \tfrac12 a t^2. \tag{2}$$

Because $v$ changes linearly, the average velocity is the average of the end values, $\tfrac12(v_0 + v)$, so

$$x - x_0 = \tfrac12(v_0 + v)\,t. \tag{3}$$

Eliminating $t$ between (1) and (2) gives a time-free equation:

$$v^2 = v_0^2 + 2a(x - x_0). \tag{4}$$

Each equation leaves out one of the five quantities $\Delta x, v_0, v, a, t$: (1) has no $\Delta x$, (2) no $v$, (3) no $a$, (4) no $t$. So the strategy is: list the three you know and the one you want, then pick the equation missing the fifth.

These equations are valid only while $a$ is constant. If a car accelerates and then brakes, treat each phase separately, using the final velocity of the first phase as the initial velocity of the second.

### Example 1

A car moving at 25 m/s brakes with constant acceleration of magnitude 5.0 m/s². How far does it travel before stopping, and how long does it take?

Take $+x$ along the motion. Known: $v_0 = 25$ m/s, $v = 0$, $a = -5.0$ m/s². Want $\Delta x$ (no $t$ given), so use (4):

$$0 = 25^2 + 2(-5.0)\Delta x \quad\Rightarrow\quad \Delta x = \frac{625}{10} = 62.5\text{ m}.$$

For the time, (1): $0 = 25 - 5.0t$, so $t = 5.0$ s.

Note how stopping distance scales with $v_0^2$: doubling the speed quadruples the stopping distance. That is why speed limits near schools are so low.

## Free fall

Near Earth's surface, with air resistance neglected, every object accelerates downward at the same rate, the **acceleration due to gravity**, $g = 9.8\text{ m/s}^2$ (more precisely 9.81 at sea level; it varies slightly with location). An object moving under gravity alone is in **free fall**, whether it's dropped, thrown up, or thrown down. A feather and a hammer fall together on the Moon, where there's no air.

With $+y$ pointing up, free fall is constant acceleration with $a = -g$:

$$v_y = v_{0y} - gt, \qquad y = y_0 + v_{0y}t - \tfrac12 g t^2, \qquad v_y^2 = v_{0y}^2 - 2g(y - y_0).$$

The value $g$ is a positive number; the minus sign comes from choosing up as positive. You may choose down as positive instead, but then use it consistently for every quantity.

### Example 2

A ball is thrown straight up at 14.7 m/s from the edge of a roof 20.0 m above the ground. Find (a) its maximum height above the roof, (b) the time to reach it, and (c) its speed just before hitting the ground. Use $g = 9.8$ m/s².

(a) At the top, $v_y = 0$. Time-free equation: $0 = 14.7^2 - 2(9.8)\,\Delta y$, so $\Delta y = \dfrac{216.09}{19.6} = 11.0$ m above the roof.

(b) $0 = 14.7 - 9.8t$, so $t = 1.5$ s.

(c) From launch to ground, $\Delta y = -20.0$ m (it ends below where it started):

$$v_y^2 = 14.7^2 - 2(9.8)(-20.0) = 216.09 + 392 = 608.09,$$

so the speed is $\sqrt{608.09} = 24.7$ m/s (and $v_y = -24.7$ m/s, downward).

A useful symmetry: when the ball comes back down past the roof, it has the same speed it was thrown with, 14.7 m/s, and the time up equals the time down.

### Example 3

A stone is dropped into a well and the splash is heard 2.50 s later. Ignoring the time for sound to travel up, how deep is the well, and how fast is the stone moving at the bottom?

Dropped means $v_{0y} = 0$. Take down as positive to avoid signs: $d = \tfrac12 g t^2 = \tfrac12(9.8)(2.50)^2 = 30.6$ m, and $v = gt = 24.5$ m/s. (Sound at about 343 m/s takes roughly 0.09 s to climb 30 m, so the true depth is a bit less; a good example of checking whether a neglected effect is really small.)

## Graphs of constant-acceleration motion

With constant $a$: the $a$–$t$ graph is a horizontal line, the $v$–$t$ graph is a straight line of slope $a$, and the $x$–$t$ graph is a parabola. For a ball thrown upward, $y(t)$ is an upside-down parabola whose peak is where the $v$–$t$ line crosses zero.

```plot
{"x": [0, 3.2], "y": [-18, 18], "xLabel": "t (s)", "yLabel": "y (m), v (m/s)", "functions": [{"f": "14.7*x - 4.9*x^2", "from": 0, "to": 3}, {"f": "14.7 - 9.8*x", "from": 0, "to": 3, "dashed": true}], "points": [{"at": [1.5, 11.025], "label": "top: v = 0"}], "labels": [{"at": [2.75, 7], "text": "y(t)"}, {"at": [2.35, -12], "text": "v(t)"}], "caption": "Thrown up at 14.7 m/s: position is a parabola, velocity a straight line of slope −9.8 m/s²"}
```

## The equations from integration

Constant acceleration is the simplest case of integrating $a(t)$. With $a$ constant,

$$v(t) = v_0 + \int_0^t a\,dt' = v_0 + at, \qquad x(t) = x_0 + \int_0^t (v_0 + at')\,dt' = x_0 + v_0t + \tfrac12at^2.$$

Equation (4) also falls out of calculus using the chain rule: $a = \dfrac{dv}{dt} = \dfrac{dv}{dx}\dfrac{dx}{dt} = v\dfrac{dv}{dx}$, so $a\,dx = v\,dv$. Integrating both sides from start to finish gives $a(x - x_0) = \tfrac12(v^2 - v_0^2)$. The identity $a = v\,dv/dx$ is worth remembering: it solves problems where acceleration depends on position rather than time.

When air resistance matters, acceleration is no longer constant: a falling object approaches a **terminal velocity** at which drag balances its weight. We'll set up and solve that differential equation in the friction lesson, once we have Newton's laws.

## Common mistakes

- Using the constant-acceleration equations when $a$ changes (for example across a braking phase and a coasting phase together).
- Writing $g = -9.8$ and then also putting a minus sign in front of $g$, double-counting the direction.
- Setting $a = 0$ at the top of a throw; only $v_y$ is zero there.
- Forgetting that $\Delta y$ is negative when the object ends below its start.
- Solving the quadratic (2) and keeping the negative time root.

## Key points

- For constant $a$: $v = v_0 + at$, $\Delta x = v_0t + \tfrac12at^2$, $\Delta x = \tfrac12(v_0 + v)t$, $v^2 = v_0^2 + 2a\Delta x$.
- Pick the equation that omits the one quantity you neither know nor want.
- Free fall: $a = -g$ with up positive, $g = 9.8$ m/s², regardless of mass.
- Stopping distance grows with the square of speed.
