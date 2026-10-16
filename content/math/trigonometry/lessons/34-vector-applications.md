---
id: trig-vector-apps
module: trig-m8
title: Vector applications - forces, navigation and work
minutes: 40
topics: [Vector applications]
drills: [trig-d-resultant, trig-d-navigation, trig-d-work]
refs: [trig-ref-triangles]
---
## Putting vectors to work

The last two lessons built the tools: components, magnitudes, direction angles, sums and
dot products. This lesson applies them to the problems vectors were invented for. The
pattern is always the same: **convert every vector to components, do the arithmetic in
components, then convert back** to a magnitude and a direction (or a bearing) if the
question asks for one.

## Resultant forces

When several forces act on an object, their combined effect is the vector sum, the
resultant force.

### Example 1

Two forces act on a bolt: 40 N in the direction $0^\circ$ and 60 N in the direction $50^\circ$. Find
the magnitude and direction of the resultant.

**Components.** $\mathbf{F}_1 = \langle 40, 0\rangle$; $\mathbf{F}_2 = \langle 60\cos 50^\circ, 60\sin 50^\circ\rangle \approx \langle 38.57, 45.96\rangle$.

**Sum.** $\mathbf{R} \approx \langle 78.57, 45.96\rangle$.

**Back to magnitude and direction.** $\lVert\mathbf{R}\rVert \approx \sqrt{78.57^2 + 45.96^2} \approx 91.02$ N;
$\theta = \tan^{-1}\!\left(\tfrac{45.96}{78.57}\right) \approx 30.33^\circ$ (quadrant I, so no adjustment).

(Equivalently, the law of cosines on the parallelogram: $\lVert\mathbf{R}\rVert^2 = 40^2 + 60^2 + 2(40)(60)\cos 50^\circ$. Note the
plus sign: the angle *inside* the triangle is $180^\circ - 50^\circ$.)

```plot
{"x": [-5, 90], "y": [-5, 55], "equal": true, "segments": [{"from": [0, 0], "to": [40, 0], "arrow": true, "label": "40 N"}, {"from": [0, 0], "to": [38.57, 45.96], "arrow": true, "label": "60 N"}, {"from": [0, 0], "to": [78.57, 45.96], "arrow": true, "label": "R ≈ 91 N"}, {"from": [40, 0], "to": [78.57, 45.96], "dashed": true}, {"from": [38.57, 45.96], "to": [78.57, 45.96], "dashed": true}], "caption": "The resultant is the diagonal of the parallelogram of forces"}
```

## Equilibrium

An object is in **equilibrium** (not accelerating) when the forces on it sum to the zero
vector: both the horizontal and vertical components balance.

### Example 2

A 100 lb sign hangs from two cables that make angles of $30^\circ$ and $45^\circ$ with the horizontal
ceiling, on opposite sides. Find the tension in each cable.

Let the tensions be $T_1$ (at $30^\circ$, pulling up and left) and $T_2$ (at $45^\circ$, up and right).

Horizontal: $T_1\cos 30^\circ = T_2\cos 45^\circ$. Vertical: $T_1\sin 30^\circ + T_2\sin 45^\circ = 100$.

From the first, $T_2\sin 45^\circ = T_2\cos 45^\circ = T_1\cos 30^\circ$ (since $\sin 45^\circ = \cos 45^\circ$). Substituting:
$T_1(\sin 30^\circ + \cos 30^\circ) = 100$, so $T_1 = \dfrac{100}{0.5 + 0.8660} \approx 73.2$ lb, and
$T_2 = \dfrac{T_1\cos 30^\circ}{\cos 45^\circ} \approx 89.7$ lb.

The steeper cable carries more of the load.

## Inclined planes

On a ramp tilted at angle $\theta$, the weight $W$ (pointing straight down) splits into a part
along the ramp, $W\sin\theta$, which tends to slide the object down, and a part perpendicular to
the ramp, $W\cos\theta$, which presses it into the surface.

### Example 3

A 500 lb cart sits on a ramp inclined at $12^\circ$. What force parallel to the ramp keeps it from
rolling down (ignoring friction)?

Force down the ramp: $500\sin 12^\circ \approx 104.0$ lb, so a force of about 104 lb up the ramp is
needed. The cart presses on the ramp with $500\cos 12^\circ \approx 489.1$ lb.

## Navigation

A plane's **heading** is the direction it points, and its **airspeed** is its speed relative to
the air. Wind moves the air itself. The plane's actual velocity over the ground is the sum
$$\text{ground velocity} = \text{air velocity} + \text{wind velocity},$$
whose magnitude is the **ground speed** and whose direction is the **course** (or track).

Bearings must be converted to direction angles for components: direction angle
$= 90^\circ - \text{bearing}$ (adding $360^\circ$ if needed). Equivalently, with bearing $\beta$, the vector is
$\langle s\sin\beta, s\cos\beta\rangle$ (east, north).

### Example 4

A plane flies with airspeed 300 mi/h on a heading of $040^\circ$. A 40 mi/h wind blows from the
west (toward the east). Find the ground speed and course.

**Air velocity:** bearing $040^\circ$ means direction angle $50^\circ$:
$\langle 300\cos 50^\circ, 300\sin 50^\circ\rangle \approx \langle 192.84, 229.81\rangle$.

**Wind:** blowing toward the east: $\langle 40, 0\rangle$. (Winds are named for where they come *from*.)

**Ground velocity:** $\langle 232.84, 229.81\rangle$. Ground speed $\approx \sqrt{232.84^2 + 229.81^2} \approx 327.1$ mi/h.

**Course:** direction angle $\tan^{-1}\!\left(\tfrac{229.81}{232.84}\right) \approx 44.63^\circ$, which is a bearing of
$90^\circ - 44.63^\circ \approx 045.4^\circ$. The tailwind component speeds the plane up and pushes it a little east.

## Work

If a constant force $\mathbf{F}$ moves an object along a displacement $\mathbf{D}$, the **work** done is
$$W = \mathbf{F}\cdot\mathbf{D} = \lVert\mathbf{F}\rVert\,\lVert\mathbf{D}\rVert\cos\theta,$$
where $\theta$ is the angle between force and motion. Only the component of the force along the
motion does work. With force in newtons and distance in meters, work is in joules.

### Example 5

A child pulls a wagon 20 m along level ground with a force of 50 N on a handle angled $30^\circ$
above the horizontal. How much work is done?

$W = 50 \cdot 20\cos 30^\circ \approx 866$ J.

In component form: a force $\mathbf{F} = \langle 3, 4\rangle$ (newtons) moving an object from $(1, 1)$ to $(6, 2)$
(meters) has $\mathbf{D} = \langle 5, 1\rangle$ and does $W = 15 + 4 = 19$ J of work.

## A strategy checklist

1. Draw a sketch with every vector as an arrow and label the angles.
2. Convert each vector to components, using direction angles (not bearings).
3. Add the components (or set the sums to zero for equilibrium).
4. Convert the result back to magnitude and direction, checking the quadrant.

## Common mistakes

- **Using bearings as direction angles.** Convert: direction angle $= 90^\circ - \text{bearing}$.
- **Wind direction.** "A wind from the west" blows toward the east.
- **Adding magnitudes instead of vectors.** 40 N + 60 N is 100 N only if both point the same way.
- **Using sine for work.** Work uses the cosine of the angle between force and displacement.

## Key points

- Convert to components, add, convert back: $\lVert\mathbf{R}\rVert = \sqrt{R_x^2 + R_y^2}$, $\theta$ from $\tan^{-1}$ and the quadrant.
- Equilibrium: horizontal and vertical components each sum to zero.
- On a ramp at angle $\theta$: $W\sin\theta$ along the ramp, $W\cos\theta$ into it.
- Ground velocity = air velocity + wind; work $= \mathbf{F}\cdot\mathbf{D}$.
