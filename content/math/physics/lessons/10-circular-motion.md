---
id: phys-circular
module: phys-m3
title: Uniform circular motion
minutes: 35
topics: [Circular motion]
drills: [phys-centripetal, phys-flat-curve, phys-vertical-loop]
refs: [phys-ref-mechanics]
---
## Turning requires a force

A car rounding a bend, a satellite in orbit, a ball whirled on a string: each moves in a circle, and each is accelerating even if its speed never changes, because its velocity keeps changing direction. By Newton's second law, something must supply a net force. This lesson finds how large that acceleration is, where it points, and which real forces provide it.

## Describing circular motion

An object moving in a circle of radius $r$ at constant speed $v$ is in **uniform circular motion**. The time for one revolution is the **period** $T$, and the number of revolutions per second is the **frequency** $f = 1/T$ (unit hertz, Hz $=$ s$^{-1}$). Since one lap is a distance $2\pi r$,

$$v = \frac{2\pi r}{T} = 2\pi r f.$$

## Centripetal acceleration

The velocity is always tangent to the circle, and the acceleration points toward the center. It's called **centripetal acceleration** ("center-seeking"), with magnitude

$$a_c = \frac{v^2}{r} = \frac{4\pi^2 r}{T^2}.$$

*Why $v^2/r$?* In a short time $\Delta t$, the object moves through a small angle $\Delta\theta = v\Delta t/r$. Its velocity vector, of fixed length $v$, rotates through the same angle, so the change in velocity has magnitude $|\Delta\vec v| \approx v\,\Delta\theta = v^2\Delta t/r$. Dividing by $\Delta t$ gives $a = v^2/r$. And as $\Delta\theta \to 0$, $\Delta\vec v$ is perpendicular to $\vec v$, pointing inward.

```shape
{"x": [-1.6, 1.6], "y": [-1.25, 1.6], "circles": [{"center": [0, 0], "r": 1}], "segments": [{"from": [0.707, 0.707], "to": [0.0, 1.414], "arrow": true}, {"from": [0.707, 0.707], "to": [0.283, 0.283], "arrow": true}], "points": [[0, 0], [0.707, 0.707]], "labels": [{"at": [0.47, 1.2], "text": "v"}, {"at": [0.32, 0.6], "text": "a"}, {"at": [0, -0.2], "text": "center"}], "caption": "In uniform circular motion (here counterclockwise), velocity v is tangent and acceleration a points to the center"}
```

## Centripetal force is a role, not a new force

Newton's second law toward the center reads

$$\sum F_{\text{toward center}} = \frac{mv^2}{r}.$$

The left side is the net inward force from real, identifiable forces: tension, gravity, friction, the normal force, or a combination. "Centripetal force" is a job description for whatever force(s) do the turning; it never belongs on a free-body diagram as an extra arrow. When the inward force disappears (a string snaps), the object continues in a straight line along the tangent. It doesn't fly outward; "centrifugal force" is what you feel in the car's non-inertial frame, not a real force in an inertial one.

In every problem, ask which real forces point toward the center. Common cases:

```mermaid
flowchart TD
  accTitle: What supplies the centripetal force
  accDescr: The net inward force m v squared over r is always supplied by real forces. Tension supplies it for a ball whirled on a string or a conical pendulum. Static friction supplies it for a car on a flat curve. Gravity supplies it for a satellite or the Moon in orbit. The normal force supplies it on a banked curve, through its horizontal component, and at the top and bottom of a loop together with gravity.
  A["Net inward force = mv²/r"] --> B["Tension"]
  A --> C["Static friction"]
  A --> D["Gravity"]
  A --> E["Normal force"]
  B --> B1["Ball on a string, conical pendulum"]
  C --> C1["Car on a flat curve"]
  D --> D1["Satellite or Moon in orbit"]
  E --> E1["Banked curve, loop-the-loop with gravity"]
```

### Example 1: car on a flat curve

What is the maximum speed at which a car can round a flat curve of radius 50 m if $\mu_s = 0.80$ between tires and road?

The tires don't slide sideways, so static friction provides the inward force. Vertically, $n = mg$. At the limit, $f_s = \mu_s mg = \dfrac{mv^2}{r}$, so

$$v_{\max} = \sqrt{\mu_s g r} = \sqrt{0.80(9.8)(50)} = 19.8\text{ m/s} \approx 71\text{ km/h}.$$

The mass cancels: a truck and a motorcycle have the same limit (with the same tires). On ice, with $\mu_s \approx 0.1$, the limit drops to 7 m/s.

## Banked curves

Highway engineers tilt curves so the normal force helps. On a frictionless curve banked at angle $\theta$, the normal force tilts toward the center. Vertically, $n\cos\theta = mg$; horizontally (toward the center), $n\sin\theta = mv^2/r$. Dividing,

$$\tan\theta = \frac{v^2}{rg}.$$

![A car on a road banked at angle theta, seen from behind, with the center of the curve to the left. The normal force n is perpendicular to the road, tilted from vertical by theta toward the center. Dashed components show n cos theta straight up and n sin theta horizontal, toward the center. The weight mg points straight down.](images/phys-m3-banked.svg)

At this design speed no friction is needed at all. Faster than this, friction must act down the slope; slower, up the slope.

## Vertical circles

A roller coaster loop or a bucket swung overhead moves in a vertical circle, usually not at constant speed, but the inward equation still holds at each point.

At the *top*, both gravity and the normal force (or tension) point down, toward the center: $n + mg = \dfrac{mv^2}{r}$. The minimum speed to stay on the track is when $n = 0$:

$$v_{\min} = \sqrt{gr}.$$

At the *bottom*, the normal force points up (toward the center) and gravity down: $n - mg = \dfrac{mv^2}{r}$, so $n = mg + \dfrac{mv^2}{r}$, which is why riders feel pressed into their seats at the bottom.

![A vertical circular loop with its center marked. At the top, a car inside the track has two forces pointing down toward the center, the normal force n and the weight mg, so n + mg = m v squared over r. At the bottom, the normal force n points up toward the center and mg points down, away from it, so n − mg = m v squared over r.](images/phys-m3-loop.svg)

### Example 2

A 0.50 kg bucket of water is swung in a vertical circle of radius 0.90 m. (a) What is the minimum speed at the top for the water to stay in? (b) If the speed at the bottom is 5.0 m/s, what tension does the arm supply there?

(a) $v_{\min} = \sqrt{9.8(0.90)} = 2.97$ m/s. At that speed gravity alone provides exactly the needed inward force, and the water is in free fall along the circle with the bucket.

(b) At the bottom: $T = mg + \dfrac{mv^2}{r} = 0.50(9.8) + \dfrac{0.50(25)}{0.90} = 4.9 + 13.9 = 18.8$ N.

### Example 3: conical pendulum

A 0.20 kg ball on a 1.0 m string swings in a horizontal circle with the string at $30^\circ$ from vertical. Find its speed and period.

Radius: $r = L\sin 30^\circ = 0.50$ m. Vertical: $T\cos 30^\circ = mg$. Inward: $T\sin 30^\circ = mv^2/r$. Dividing, $\tan 30^\circ = \dfrac{v^2}{rg}$, so $v = \sqrt{rg\tan 30^\circ} = \sqrt{0.50(9.8)(0.577)} = 1.68$ m/s. Period: $T_{\text{period}} = 2\pi r/v = 1.87$ s.

## Angular speed and rpm

Rotating machines are rated by how fast they turn, not by the speed of a point on them. The angular speed $\omega$ is the angle swept per second, in radians per second: one revolution is $2\pi$ rad, so $\omega = 2\pi/T = 2\pi f$. A point at radius $r$ covers $2\pi r$ per revolution, so $v = r\omega$, and the centripetal acceleration becomes

$$a_c = \frac{v^2}{r} = \frac{(r\omega)^2}{r} = \omega^2 r.$$

Motors and wheels are often rated in revolutions per minute (rpm). To convert, divide by 60 to get revolutions per second ($f$), then use $v = 2\pi r f$.

### Example 4

A washing machine drum of radius 0.25 m spins at 1200 rpm. Find the speed of the drum wall and the centripetal acceleration, as a multiple of $g$.

$f = 1200/60 = 20$ rev/s, so $v = 2\pi(0.25)(20) = 31.4$ m/s. Then $a_c = v^2/r = 31.4^2/0.25 = 3950$ m/s², about $400g$. Water in the clothes can't get that much inward force from the fabric, so it escapes through the holes in the drum along tangent lines.

When the speed is also changing (a car speeding up around a curve), the acceleration has a tangential part, $a_t = \Delta v/\Delta t$, along the velocity, as well as the centripetal part $v^2/r$ toward the center. They are perpendicular, so the total is $a = \sqrt{a_t^2 + (v^2/r)^2}$.

## Common mistakes

- Drawing a separate "centripetal force" arrow in a free-body diagram.
- Saying an object released from circular motion flies outward (it flies off along the tangent).
- Using $n = mg$ at the top or bottom of a vertical circle.
- Mixing up period and frequency, or forgetting to convert rpm to revolutions per second.

## Key points

- $v = 2\pi r/T$; $a_c = v^2/r$ toward the center.
- Real forces supply the inward net force: $\sum F_{\text{in}} = mv^2/r$.
- Flat curve: $v_{\max} = \sqrt{\mu_s g r}$. Banked, frictionless: $\tan\theta = v^2/(rg)$.
- Top of a vertical loop: $v_{\min} = \sqrt{gr}$. Bottom: $n = mg + mv^2/r$.
- Angular speed $\omega = 2\pi/T$ (rad/s), $v = r\omega$, $a_c = \omega^2 r$; rpm ÷ 60 gives revolutions per second.
