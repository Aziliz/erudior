---
id: trig-speed
module: trig-m1
title: Angular and linear speed
minutes: 25
topics: [Angular and linear speed]
drills: [trig-d-linear-speed, trig-d-angular-speed]
refs: [trig-ref-unit-circle]
---
## Two ways to say "how fast"

A point on a spinning wheel moves in two senses at once. Its radius line sweeps out angle,
and the point itself travels along the circle. The first is described by *angular* speed
(how much angle per unit time) and the second by *linear* speed (how much distance per
unit time). The arc length formula from the last lesson connects them, so this lesson is
really $s = r\theta$ divided by time.

## Definitions

Suppose a point moves along a circle of radius $r$ at a steady rate, sweeping out an
angle $\theta$ (in radians) and traveling an arc length $s$ in time $t$.

- The **angular speed** is the angle swept per unit time: $\omega = \dfrac{\theta}{t}$.
  Typical units are radians per second (rad/s) or radians per minute.
- The **linear speed** is the distance traveled per unit time: $v = \dfrac{s}{t}$.
  Typical units are m/s, ft/s, mi/h.

The Greek letter $\omega$ (omega) is the standard symbol for angular speed.

## The connecting formula

Divide $s = r\theta$ by $t$:

$$\frac{s}{t} = r\cdot\frac{\theta}{t} \qquad\Longrightarrow\qquad v = r\omega \quad (\omega \text{ in radians per unit time}).$$

Every point on a rigid spinning disk has the *same* angular speed, but points farther from
the center travel bigger circles in the same time, so their linear speed is bigger in
proportion to $r$. On a merry-go-round, the outer horses move faster than the inner ones.

```plot
{"x": [-1.6, 1.6], "y": [-1.4, 1.4], "equal": true, "circles": [{"center": [0, 0], "r": 1.2}, {"center": [0, 0], "r": 0.6}], "segments": [{"from": [0.6, 0], "to": [0.6, 0.35], "arrow": true}, {"from": [1.2, 0], "to": [1.2, 0.7], "arrow": true}, {"from": [0, 0], "to": [1.2, 0], "dashed": true}], "points": [[0.6, 0], [1.2, 0]], "labels": [{"at": [0.85, 0.5], "text": "v"}, {"at": [1.45, 0.85], "text": "2v"}], "caption": "Same angular speed; doubling the radius doubles the linear speed"}
```

## Revolutions per minute

Motors, wheels and disks are usually rated in **revolutions per minute (rpm)**. Since one
revolution is $2\pi$ radians,

$$\omega \ (\text{rad/min}) = 2\pi \times (\text{rpm}).$$

To get rad/s, also divide by 60. Going the other way, rpm $= \omega / (2\pi)$ when $\omega$
is in rad/min. Note that rpm is an angular speed in disguise: it counts turns per minute,
not distance.

### Example 1

A car's tires have radius 14 inches and are turning at 300 rpm. Find the tires'
angular speed in rad/min and the car's speed in miles per hour.

**Step 1: angular speed.** $\omega = 300 \cdot 2\pi = 600\pi$ rad/min.

**Step 2: linear speed.** A point on the tread moves at $v = r\omega = 14 \cdot 600\pi = 8400\pi$
inches per minute, about $26{,}389$ in/min. When a tire rolls without slipping, the car
moves at the same speed as the tread relative to the axle.

**Step 3: convert units.** There are 60 minutes in an hour and $5280 \times 12 = 63{,}360$
inches in a mile:
$$8400\pi \,\frac{\text{in}}{\text{min}} \cdot \frac{60 \text{ min}}{1 \text{ h}} \cdot \frac{1 \text{ mi}}{63{,}360 \text{ in}} \approx 25.0 \text{ mi/h}.$$

Unit conversion is where most errors in these problems happen. Writing each factor as a
fraction whose units cancel keeps it honest.

### Example 2

Earth turns once on its axis about every 24 hours. Its equatorial radius is about 3960
miles. How fast is a point on the equator moving because of the rotation?

$\omega = \dfrac{2\pi \text{ rad}}{24 \text{ h}} = \dfrac{\pi}{12}$ rad/h.

$v = r\omega = 3960 \cdot \dfrac{\pi}{12} = 330\pi \approx 1037$ mi/h.

People on the equator are moving over a thousand miles per hour and don't feel it,
because the speed is steady.

### Example 3: belts and gears

A belt connects a pulley of radius 5 cm to a pulley of radius 15 cm. The small pulley
spins at 12 rad/s. How fast does the large pulley spin?

The belt doesn't slip, so every point on the belt, and the rim of each pulley, has the same
linear speed:
$$v = r_1\omega_1 = 5 \cdot 12 = 60 \text{ cm/s}.$$
For the large pulley, $\omega_2 = \dfrac{v}{r_2} = \dfrac{60}{15} = 4$ rad/s, about
$4 \cdot \tfrac{60}{2\pi} \approx 38.2$ rpm.

The bigger pulley turns slower, in inverse proportion to its radius:
$\omega_1 r_1 = \omega_2 r_2$. Bicycle gears work the same way, with the chain as the belt.

## Choosing the formula

| You know | You want | Use |
|---|---|---|
| angle and time | angular speed | $\omega = \theta/t$ |
| arc length and time | linear speed | $v = s/t$ |
| radius and angular speed | linear speed | $v = r\omega$ |
| radius and linear speed | angular speed | $\omega = v/r$ |
| rpm | rad/min | multiply by $2\pi$ |

### Example 4: bicycle gears

A cyclist pedals at 60 rpm. The front chainring has radius 10 cm and the rear sprocket has
radius 4 cm. The rear wheel (attached to the sprocket) has radius 35 cm. How fast is the
bicycle moving, in km/h?

**Chain speed.** The chain is a belt: the chainring and sprocket rims share its linear speed,
so $\omega_{\text{front}}r_{\text{front}} = \omega_{\text{rear}}r_{\text{rear}}$. In rpm,
$60 \cdot 10 = \omega_{\text{rear}}\cdot 4$, so the sprocket, and the wheel with it, turns at $150$ rpm.
(Ratios of rpm work just like ratios of rad/min, since the $2\pi$ cancels.)

**Wheel speed.** $v = r\omega = 35 \cdot 150 \cdot 2\pi \approx 32{,}987$ cm/min. Converting:
$32{,}987 \text{ cm/min} \times 60 \text{ min/h} \div 100{,}000 \text{ cm/km} \approx 19.8$ km/h.

## Common mistakes

- **Using rpm directly in $v = r\omega$.** $\omega$ must be in radians per unit time.
  $14 \times 300 = 4200$ is not a speed in any useful unit; multiply by $2\pi$ first.
- **Diameter versus radius.** A "26-inch bike wheel" has a 13-inch radius.
- **Mismatched time units.** If $\omega$ is per minute, $v$ is per minute. Convert at the
  end, and do it explicitly.
- **Thinking all points on a disk have the same linear speed.** They share $\omega$, not $v$.

## Key points

- Angular speed $\omega = \theta/t$ (radians per unit time); linear speed $v = s/t$.
- $v = r\omega$, valid only with $\omega$ in radians per unit time.
- One revolution is $2\pi$ radians, so rad/min $= 2\pi \times$ rpm.
- Linked pulleys or gears share linear speed: $r_1\omega_1 = r_2\omega_2$.
