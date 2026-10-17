---
id: phys-newton
module: phys-m3
title: Newton's laws and free-body diagrams
minutes: 40
topics: [Newton's laws, Free-body diagrams]
drills: [phys-fnet-accel, phys-elevator, phys-two-forces]
refs: [phys-ref-mechanics]
---
## From describing motion to explaining it

Kinematics told us how to describe motion. Dynamics asks why objects move the way they do, and Newton's three laws answer that for everything from falling apples to orbiting satellites. The central quantity is **force**: a push or pull exerted by one object on another, measured in newtons (N). Forces are vectors, so all the component methods from the vectors lesson come straight back.

## Newton's first law

An object stays at rest, or keeps moving in a straight line at constant speed, unless a net force acts on it. This is **Newton's first law**, the law of **inertia**: the tendency of matter to keep its current velocity. A hockey puck sliding on ice slows only because of small friction forces; with none, it would glide forever.

The first law corrects an intuition many people hold: that motion needs a force to sustain it. It doesn't. A force is needed to *change* motion. The law also defines the frames we work in: it holds in inertial frames (non-accelerating ones). In an accelerating car, a coffee cup slides backward with no force pushing it; that's the car accelerating out from under it.

## Newton's second law

The **net force** $\vec F_{\text{net}} = \sum\vec F$ is the vector sum of all forces on an object. **Newton's second law** says

$$\sum \vec F = m\vec a.$$

The acceleration points the same way as the net force, and the **mass** $m$ measures how strongly the object resists acceleration. The same push gives a shopping cart a large acceleration and a car a tiny one. This is also where the newton comes from: 1 N gives 1 kg an acceleration of 1 m/s².

Because it is a vector equation, it is really one equation per axis:

$$\sum F_x = ma_x, \qquad \sum F_y = ma_y.$$

If the net force is zero, $\vec a = 0$, and the object is in **equilibrium** (at rest, or moving at constant velocity; both count).

## Weight and the normal force

The **weight** of an object is the gravitational force Earth exerts on it, $\vec W = m\vec g$, magnitude $mg$, pointing down. Mass is in kilograms and is the same everywhere; weight is a force in newtons and depends on the local $g$. A 70 kg astronaut weighs 686 N on Earth and about 113 N on the Moon, where $g = 1.62$ m/s², but her mass is 70 kg in both places.

When an object presses on a surface, the surface pushes back perpendicular to itself. This is the **normal force** $\vec n$ ("normal" means perpendicular). It is whatever size is needed to stop the object sinking into the surface, so don't assume $n = mg$; find it from Newton's second law in the perpendicular direction. A book on a flat table has $n = mg$, but push down on the book and $n$ grows; tilt the table and $n$ shrinks.

## Newton's third law

Forces come in pairs. If object A exerts a force on B, then B exerts a force on A of equal magnitude and opposite direction:

$$\vec F_{\text{A on B}} = -\vec F_{\text{B on A}}.$$

This is **Newton's third law**. The two forces of a pair act on *different* objects, so they never cancel each other in a single object's free-body diagram. When you push on a wall, the wall pushes back on you equally. When Earth pulls a falling apple down with force $mg$, the apple pulls Earth up with force $mg$; Earth's enormous mass makes its acceleration immeasurably small.

A classic confusion: the weight of a book on a table and the normal force on the book are equal and opposite, but they are not a third-law pair. They act on the same object (the book), and they are different kinds of force. The third-law partner of the book's weight is the book's pull on Earth; the partner of the normal force is the book pushing down on the table.

## Free-body diagrams

A **free-body diagram** (FBD) isolates one object and shows every force acting *on* it, as arrows starting from the object. It is the single most important step in a dynamics problem. A reliable method:

1. Choose the object (or system) and draw it as a dot or simple box.
2. Draw its weight, $mg$ downward.
3. Go around the object's boundary: everything touching it can exert a force (normal force, friction, tension in an attached rope, an applied push).
4. Add any non-contact forces (electric, magnetic) if relevant.
5. Choose axes, ideally with one along the acceleration.
6. Write $\sum F_x = ma_x$ and $\sum F_y = ma_y$, and solve.

Never put "$ma$" on the diagram as a force; it's the result of the forces, not one of them.

```shape
{"polygons": [{"points": [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]}], "segments": [{"from": [0, 0.5], "to": [0, 2.2], "arrow": true, "label": "n"}, {"from": [0, -0.5], "to": [0, -2.2], "arrow": true, "label": "mg"}, {"from": [0.5, 0], "to": [2.4, 0], "arrow": true, "label": "F (applied)"}, {"from": [-0.5, 0], "to": [-1.4, 0], "arrow": true, "label": "f (friction)"}], "caption": "Free-body diagram of a box pushed across a floor"}
```

### Example 1

A 12 kg crate on a frictionless floor is pulled by a rope with tension 60 N directed $30^\circ$ above horizontal. Find the acceleration and the normal force.

Forces on the crate: weight $mg = 117.6$ N down, normal force $n$ up, tension 60 N at $30^\circ$.

$x$: $60\cos 30^\circ = 12a$, so $a = \dfrac{51.96}{12} = 4.33$ m/s².

$y$: the crate doesn't leave the floor, so $a_y = 0$: $n + 60\sin 30^\circ - 117.6 = 0$, giving $n = 117.6 - 30 = 87.6$ N. The upward pull of the rope reduces the normal force.

### Example 2: apparent weight in an elevator

A 60 kg person stands on a bathroom scale in an elevator. What does the scale read when the elevator (a) accelerates upward at 2.0 m/s², (b) moves up at constant speed, (c) accelerates downward at 2.0 m/s²?

The scale reads the normal force $n$ it exerts. Take up as positive: $n - mg = ma$, so $n = m(g + a)$.

(a) $n = 60(9.8 + 2.0) = 708$ N, heavier than her true weight of 588 N.

(b) $a = 0$, so $n = 588$ N. Constant velocity is equilibrium.

(c) $a = -2.0$: $n = 60(7.8) = 468$ N. If the cable snapped ($a = -g$), the scale would read zero: she would feel weightless, though gravity still acts on her fully. This **apparent weight** is what your body senses.

## With calculus

Newton actually wrote the second law in terms of momentum $\vec p = m\vec v$:

$$\vec F_{\text{net}} = \frac{d\vec p}{dt}.$$

For constant mass this is $m\,d\vec v/dt = m\vec a$; the momentum form also handles rockets and conveyor belts where mass changes. Writing $a = dv/dt$ turns the second law into a differential equation for the motion, which we can solve when forces depend on time or velocity.

### Example 3

A 2.0 kg object starts from rest and feels a force $F(t) = 6t^2$ N along $x$. Find its velocity at $t = 3$ s.

$m\dfrac{dv}{dt} = 6t^2$, so $dv = 3t^2\,dt$. Integrating from 0: $v(t) = t^3$, and $v(3) = 27$ m/s. Using $F(3)/m = 27$ m/s² as if it were constant would badly overestimate.

For velocity-dependent drag $F = -bv$, the equation $m\,dv/dt = -bv$ gives $v = v_0e^{-bt/m}$: exponential decay, which the next lesson extends to falling objects and terminal velocity.

## Common mistakes

- Thinking a moving object must have a net force in its direction of motion.
- Assuming $n = mg$ in every problem.
- Treating weight and normal force as a third-law pair.
- Drawing forces that the object exerts on others in its own free-body diagram.
- Including "$ma$" or "the force of motion" as a force.

## Key points

- First law: no net force, no change in velocity. Second law: $\sum\vec F = m\vec a$, one equation per axis. Third law: forces come in equal and opposite pairs on different objects.
- Weight $= mg$ downward; the normal force is perpendicular to the surface and found from the equations.
- Always draw a free-body diagram before writing equations.
- $\vec F = d\vec p/dt$ is the general form; it becomes a differential equation for variable forces.
