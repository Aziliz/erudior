---
id: phys-friction
module: phys-m3
title: Friction and inclined planes
minutes: 40
topics: [Friction, Inclined planes]
drills: [phys-incline-frictionless, phys-incline-friction, phys-static-friction]
refs: [phys-ref-mechanics]
---
## Why things stop

Push a book across a table and it slows to a stop. The first law says something must be acting on it, and that something is **friction**: a force that surfaces in contact exert parallel to their surfaces, opposing sliding (or the tendency to slide). This lesson adds friction to Newton's second law and then puts it to work on the inclined plane, the standard testing ground for free-body diagrams.

## Kinetic and static friction

Microscopically, even polished surfaces are rough, and contact points form temporary bonds. Two empirical rules describe the result well enough for most purposes.

**Kinetic friction** acts when surfaces slide over each other. Its magnitude is

$$f_k = \mu_k n,$$

where $n$ is the normal force and $\mu_k$ is the **coefficient of kinetic friction**, a dimensionless number depending on the pair of surfaces (rubber on dry concrete is about 0.7, steel on ice about 0.03). It points opposite to the sliding velocity, and to a good approximation it doesn't depend on speed or contact area.

**Static friction** acts when surfaces are not sliding but something is trying to make them. It adjusts to whatever value keeps the surfaces stuck, up to a maximum:

$$f_s \le \mu_s n.$$

The **coefficient of static friction** $\mu_s$ is usually larger than $\mu_k$, which is why it takes more force to start a heavy box moving than to keep it moving. The key subtlety: $f_s = \mu_s n$ only at the verge of slipping. A box that you're pushing with 20 N without moving it has 20 N of static friction, no matter how large $\mu_s n$ is.

Friction depends on $n$, not on the weight. Pull up on a sled rope and $n$ drops, and so does the friction.

### Example 1

A 25 kg box rests on a floor with $\mu_s = 0.50$ and $\mu_k = 0.35$. (a) What horizontal force is needed to start it moving? (b) If you keep pushing with that force once it slides, what is its acceleration?

Normal force: $n = mg = 25(9.8) = 245$ N (no vertical forces besides $n$ and $mg$).

(a) Maximum static friction: $\mu_s n = 0.50(245) = 122.5$ N. You need just over 122.5 N.

(b) Once sliding, friction drops to $f_k = 0.35(245) = 85.75$ N. Net force: $122.5 - 85.75 = 36.75$ N, so $a = 36.75/25 = 1.47$ m/s².

## The inclined plane

An object on a ramp tilted at angle $\theta$ is the classic problem where good axes matter. Tilt the axes: $x$ along the slope (down the slope positive is often convenient), $y$ perpendicular to it. Then the normal force and friction lie along the axes, and only the weight needs splitting.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [6, 3.464]]}, {"points": [[3.118, 1.8], [3.81, 2.2], [3.41, 2.893], [2.718, 2.493]]}], "segments": [{"from": [3.264, 2.346], "to": [3.264, 0.346], "arrow": true}, {"from": [3.264, 2.346], "to": [2.398, 3.846], "arrow": true}, {"from": [3.264, 2.346], "to": [4.303, 2.946], "arrow": true}, {"from": [3.264, 2.346], "to": [2.398, 1.846], "arrow": true, "dashed": true}, {"from": [3.264, 2.346], "to": [4.13, 0.846], "arrow": true, "dashed": true}], "labels": [{"at": [3.6, 0.6], "text": "mg"}, {"at": [2.2, 3.95], "text": "n"}, {"at": [4.55, 3.1], "text": "f"}, {"at": [1.65, 1.75], "text": "mg sin θ"}, {"at": [4.85, 0.75], "text": "mg cos θ"}, {"at": [1.2, 0.25], "text": "θ = 30°"}], "caption": "Block on a 30° incline: weight mg splits into mg sin θ down the slope and mg cos θ into the slope (dashed); n balances mg cos θ and friction f points up the slope"}
```

The weight makes angle $\theta$ with the $-y$ axis (the same angle as the incline, because both pairs of lines are mutually perpendicular). So:

- component down the slope: $mg\sin\theta$;
- component into the slope: $mg\cos\theta$.

Check the limits: at $\theta = 0$ (flat) the down-slope part vanishes; at $\theta = 90^\circ$ (vertical) it's all of $mg$. If you get them backwards, these limits will catch it.

Perpendicular to the slope there's no acceleration, so $n = mg\cos\theta$ (with no other perpendicular forces).

*Frictionless incline.* Along the slope: $mg\sin\theta = ma$, so $a = g\sin\theta$, independent of mass.

*With kinetic friction*, sliding down: $mg\sin\theta - \mu_k mg\cos\theta = ma$, so

$$a = g(\sin\theta - \mu_k\cos\theta).$$

Sliding up (after a push), friction also points down the slope: $a = -g(\sin\theta + \mu_k\cos\theta)$, a larger deceleration.

*On the verge of slipping* with static friction, $mg\sin\theta = \mu_s mg\cos\theta$, so

$$\tan\theta_{\max} = \mu_s.$$

That gives a simple way to measure $\mu_s$: tilt a board until the object just starts to slide and take the tangent of the angle.

### Example 2

A 4.0 kg block slides down a $35^\circ$ ramp with $\mu_k = 0.25$. Find its acceleration and the friction force.

$n = mg\cos 35^\circ = 4.0(9.8)(0.8192) = 32.1$ N, so $f_k = 0.25(32.1) = 8.03$ N up the slope.

$a = g(\sin 35^\circ - 0.25\cos 35^\circ) = 9.8(0.5736 - 0.2048) = 3.61$ m/s² down the slope.

Check using forces: $mg\sin 35^\circ = 22.5$ N down the slope, minus 8.03 N friction, leaves 14.45 N; divided by 4.0 kg gives 3.61 m/s².

### Example 3

A skier on a $20^\circ$ slope with $\mu_s = 0.10$: will she slide from rest?

$\tan 20^\circ = 0.364 > 0.10$, so static friction can't hold her and she starts sliding. A slope gentle enough to stand still on would need $\theta \le \tan^{-1}(0.10) = 5.7^\circ$.

## With calculus: drag

Friction between solid surfaces is roughly constant, but fluid resistance (drag) grows with speed. For slow motion through a viscous fluid, the drag is roughly proportional to speed, $F_D = bv$. A falling object then obeys

$$m\frac{dv}{dt} = mg - bv.$$

Separating variables and integrating from rest gives

$$v(t) = \frac{mg}{b}\left(1 - e^{-bt/m}\right).$$

As $t\to\infty$ the velocity approaches the terminal velocity $v_T = mg/b$, where drag balances weight and the net force is zero. The time constant $m/b$ sets how quickly it gets there: after one time constant it has reached $1 - e^{-1} = 63\%$ of $v_T$. For fast objects in air the drag is closer to $\tfrac12 C\rho Av^2$, giving $v_T = \sqrt{2mg/(C\rho A)}$; a skydiver's terminal speed is about 55 m/s belly-down.

## Common mistakes

- Using $f_s = \mu_s n$ when the object isn't on the verge of slipping.
- Using $n = mg$ on an incline or when a force pulls at an angle.
- Swapping $\sin$ and $\cos$ in the weight components (check $\theta = 0$ and $90^\circ$).
- Pointing kinetic friction along the motion instead of against it.
- Thinking friction depends on contact area or speed (in this model it doesn't).

## Key points

- Kinetic: $f_k = \mu_k n$, opposite the sliding. Static: $f_s \le \mu_s n$, just enough to prevent sliding.
- On an incline: $mg\sin\theta$ along the slope, $mg\cos\theta$ into it; $n = mg\cos\theta$.
- Frictionless: $a = g\sin\theta$. Sliding down with friction: $a = g(\sin\theta - \mu_k\cos\theta)$.
- Verge of slipping: $\tan\theta = \mu_s$.
- Linear drag: $v(t) = v_T(1 - e^{-bt/m})$, $v_T = mg/b$.
