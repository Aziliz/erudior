---
id: phys-motion-2d
module: phys-m2
title: Motion in two dimensions and relative motion
minutes: 30
topics: [Two-dimensional motion, Relative motion]
drills: [phys-river-crossing, phys-plane-wind, phys-avg-2d]
refs: [phys-ref-mechanics]
---
## Beyond the straight line

Projectiles showed that two-dimensional motion splits into independent one-dimensional motions. This lesson makes that idea general, using position, velocity and acceleration vectors, and then tackles a question that matters to every pilot, sailor and swimmer: how does motion look from a frame of reference that is itself moving?

## Position, velocity and acceleration vectors

In two dimensions the position is a vector $\vec r = x\,\hat\imath + y\,\hat\jmath$. Over a time interval the displacement is $\Delta\vec r = \vec r_f - \vec r_i$, and

$$\vec v_{\text{avg}} = \frac{\Delta\vec r}{\Delta t}, \qquad \vec a_{\text{avg}} = \frac{\Delta\vec v}{\Delta t}.$$

Each is computed component by component: $v_{\text{avg},x} = \Delta x/\Delta t$, and so on.

A subtle but important point: acceleration is any change in the velocity vector, including a change in direction only. A car rounding a curve at a steady 50 km/h is accelerating, because its velocity vector is turning. The acceleration then has two parts:

- a **tangential** part, along the velocity, which changes the speed;
- a **radial** (centripetal) part, perpendicular to the velocity, which changes the direction.

We'll study the second one in detail in the circular-motion lesson.

### Example 1

A boat at the origin moves to $(120\text{ m}, 50\text{ m})$ in 20 s. Its velocity changes from $(4.0, 0)$ m/s to $(5.0, 4.0)$ m/s over the same time. Find the average velocity and average acceleration.

$\vec v_{\text{avg}} = \dfrac{(120, 50)}{20} = (6.0, 2.5)$ m/s, magnitude $\sqrt{36 + 6.25} = 6.5$ m/s.

$\vec a_{\text{avg}} = \dfrac{(5.0 - 4.0,\ 4.0 - 0)}{20} = (0.050, 0.20)$ m/s², magnitude $0.206$ m/s². Most of the acceleration is sideways: the boat is mainly turning, not speeding up.

## Relative motion

Velocity is always measured relative to something. A passenger walking forward at 1.5 m/s on a train moving at 30 m/s has velocity 1.5 m/s relative to the train and 31.5 m/s relative to the ground. Each observer uses a **reference frame**, a set of axes attached to some object.

The rule for combining velocities uses a subscript notation that almost checks itself. Write $\vec v_{AB}$ for "velocity of A relative to B". Then

$$\vec v_{AC} = \vec v_{AB} + \vec v_{BC}.$$

The inner subscripts match and "cancel," like conversion factors. Also $\vec v_{BA} = -\vec v_{AB}$: if you see a car approaching you at 20 m/s, its driver sees you approaching at 20 m/s in the opposite direction. This is **relative velocity**, and it is just vector addition.

The rule works because positions add: if A is at $\vec r_{AB}$ relative to B and B at $\vec r_{BC}$ relative to C, then $\vec r_{AC} = \vec r_{AB} + \vec r_{BC}$. Over a time interval the changes in position add the same way, and dividing each change by $\Delta t$ shows that the velocities add too. (Einstein showed this fails at speeds near light; see the relativity lesson.)

### Example 2: crossing a river

A river 80 m wide flows east at 1.2 m/s. A swimmer can swim at 2.0 m/s relative to the water. (a) If she heads straight across (north), how long does it take and how far downstream does she land? (b) Which way must she head to land directly opposite her start, and how long does that take?

Let S = swimmer, W = water, G = ground. $\vec v_{SG} = \vec v_{SW} + \vec v_{WG}$.

(a) $\vec v_{SW} = (0, 2.0)$, $\vec v_{WG} = (1.2, 0)$, so $\vec v_{SG} = (1.2, 2.0)$ m/s. Crossing time comes from the northward component alone: $t = 80/2.0 = 40$ s. Downstream drift: $1.2 \times 40 = 48$ m.

(b) To land opposite, $\vec v_{SG}$ must point due north, so the east component of $\vec v_{SW}$ must cancel the current: $2.0\sin\alpha = 1.2$, giving $\alpha = 36.9^\circ$ west of north (upstream). Her northward speed is then $2.0\cos 36.9^\circ = 1.6$ m/s, and the crossing takes $80/1.6 = 50$ s.

```shape
{"x": [-2.7, 2.0], "y": [-0.2, 1.95], "segments": [{"from": [0, 0], "to": [-1.2, 1.6], "arrow": true}, {"from": [-1.2, 1.6], "to": [0, 1.6], "arrow": true}, {"from": [0, 0], "to": [0, 1.6], "arrow": true, "dashed": true}], "labels": [{"at": [-1.55, 0.7], "text": "swimmer/water 2.0 m/s"}, {"at": [-0.6, 1.75], "text": "water/ground 1.2 m/s"}, {"at": [1.08, 0.8], "text": "swimmer/ground 1.6 m/s"}], "caption": "Heading upstream so the resultant points straight across"}
```

Heading straight across is the fastest way over; heading upstream is the way to land opposite. These are different goals with different answers, and the swimmer can land opposite only if her speed relative to the water exceeds the current's.

### Example 3: airplane in a crosswind

A plane flies with airspeed 220 km/h and must travel due north. A wind blows from west to east at 50 km/h. Find the heading and the ground speed.

$\vec v_{PG} = \vec v_{PA} + \vec v_{AG}$, with $\vec v_{AG} = (50, 0)$. For $\vec v_{PG}$ to point north, $220\sin\alpha = 50$, so $\alpha = 13.1^\circ$ west of north. Ground speed: $220\cos 13.1^\circ = \sqrt{220^2 - 50^2} = 214$ km/h.

## Moving frames agree on acceleration

Suppose frame B moves at constant velocity relative to frame C. Then $\vec v_{AC} = \vec v_{AB} + \vec v_{BC}$ at every moment, with $\vec v_{BC}$ never changing. Over any time interval, the change in $\vec v_{AC}$ therefore equals the change in $\vec v_{AB}$: the constant term contributes nothing to $\Delta\vec v$. Dividing by $\Delta t$, both observers measure the same acceleration. Observers moving uniformly relative to each other disagree about velocities but agree about accelerations, and so about forces; that is why Newton's laws hold equally in all such **inertial frames**.

### Example 4

A train moves east at a steady 20 m/s. A passenger tosses a ball straight up at 4.9 m/s relative to the train and catches it at the same height. Describe the ball's motion as seen by the passenger and by someone on the ground. ($g = 9.8$ m/s²)

Passenger's frame: the ball goes straight up and down. Its time in the air is $2(4.9)/9.8 = 1.0$ s, and it lands back in her hand.

Ground frame: the ball starts with velocity $\vec v_{\text{ball,G}} = \vec v_{\text{ball,T}} + \vec v_{\text{T,G}} = (20, 4.9)$ m/s. It is a projectile: it moves $20 \times 1.0 = 20$ m east during the flight, along a parabola. The hand also moves 20 m east in that second, so the catch works in this frame too.

Both observers measure the same acceleration, 9.8 m/s² downward, and the same flight time. Only the velocities and the shape of the path differ.

## Common mistakes

- Thinking constant speed means zero acceleration (direction changes count).
- Adding relative velocities as magnitudes instead of vectors.
- Getting the subscript order wrong ($\vec v_{AB}$ vs $\vec v_{BA}$ differ by a sign).
- Using the swimmer's speed relative to water for the crossing time when she heads upstream; only the component across the river counts.

## Key points

- $\vec v_{\text{avg}} = \Delta\vec r/\Delta t$, $\vec a_{\text{avg}} = \Delta\vec v/\Delta t$, computed by components.
- Acceleration includes changes of direction; tangential changes speed, radial changes direction.
- Relative velocity: $\vec v_{AC} = \vec v_{AB} + \vec v_{BC}$ and $\vec v_{BA} = -\vec v_{AB}$.
- Observers moving at constant velocity relative to each other measure different velocities but the same acceleration.
