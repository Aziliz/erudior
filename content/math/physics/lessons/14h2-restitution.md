---
id: phys-m4-h-restitution
module: phys-m4
honors: true
title: 'Honors: Restitution, bouncing, and gravity assists'
minutes: 45
topics: [Restitution and gravity assists]
drills: [phys-m4-r2-restitution, phys-m4-r2-bounce]
refs: [phys-ref-mechanics]
---
## Between the two extremes

The collisions lesson solved the two extreme cases: elastic collisions, where the objects separate as fast as they approached, and perfectly inelastic ones, where they stick. It also defined the coefficient of restitution $e$, which is 1 at one extreme and 0 at the other. Most real collisions sit in between: a basketball, a golf ball, two colliding rail cars with springy couplers. This lesson solves the general case, finds exactly how much kinetic energy is lost for any $e$, follows a bouncing ball until it stops, and then uses the same ideas to explain how a spacecraft can steal speed from a planet.

## The general one-dimensional collision

For a head-on collision, the coefficient of restitution compares the speed at which the objects separate with the speed at which they approached:

$$v_{2f} - v_{1f} = e\,(v_{1i} - v_{2i}).$$

This is sometimes called Newton's experimental law of impact: in the *Principia* (1687) Newton reported pendulum experiments with balls of wool, steel, cork and glass and found that each pair of materials separated at a roughly fixed fraction of its approach speed. It is a model, not a law of nature. Measured values of $e$ depend on the materials, and also on the impact speed and temperature (a squash ball gets bouncier as it warms up), so treat $e$ as an approximate, measured property of a particular pair of objects.

Combining the restitution condition with momentum conservation, $m_1v_{1i} + m_2v_{2i} = m_1v_{1f} + m_2v_{2f}$, gives two linear equations in the two unknowns. Their solution is

$$v_{1f} = \frac{m_1v_{1i} + m_2v_{2i} - m_2e\,(v_{1i} - v_{2i})}{m_1 + m_2}, \qquad v_{2f} = \frac{m_1v_{1i} + m_2v_{2i} + m_1e\,(v_{1i} - v_{2i})}{m_1 + m_2}.$$

The first part of each fraction is just the center-of-mass velocity $v_{\text{cm}}$; the second part pushes the two objects apart from it. Check the extremes: with $e = 0$ both reduce to $v_{\text{cm}}$ (they stick), and with $e = 1$ and $v_{2i} = 0$ they reduce to the elastic formulas from the collisions lesson.

In practice you rarely need to memorize these. Write the momentum equation and the restitution equation, and solve them together.

### Example 1

A 2.0 kg cart moving at 4.0 m/s hits a 3.0 kg cart at rest. The coefficient of restitution is 0.50. Find both final velocities and the kinetic energy lost.

Momentum: $2.0(4.0) = 2.0v_{1f} + 3.0v_{2f}$, so $2.0v_{1f} + 3.0v_{2f} = 8.0$.

Restitution: $v_{2f} - v_{1f} = 0.50(4.0 - 0) = 2.0$, so $v_{2f} = v_{1f} + 2.0$.

Substitute: $2.0v_{1f} + 3.0(v_{1f} + 2.0) = 8.0$, so $5.0v_{1f} = 2.0$ and $v_{1f} = 0.40$ m/s; then $v_{2f} = 2.4$ m/s. Both keep moving forward.

Kinetic energy: before, $\tfrac12(2.0)(4.0)^2 = 16.0$ J. After, $\tfrac12(2.0)(0.40)^2 + \tfrac12(3.0)(2.4)^2 = 0.16 + 8.64 = 8.80$ J. Lost: 7.2 J.

## How much kinetic energy is lost

The cleanest way to see the energy loss is in the **center-of-mass frame**, the frame moving along with the center of mass at $v_{\text{cm}}$. In that frame the total momentum is zero, before and after. So before the collision the two objects come toward each other with equal and opposite momenta, and afterward they leave with equal and opposite momenta. Since their separation speed is $e$ times their approach speed, each object's velocity in this frame simply reverses and shrinks by the factor $e$.

Kinetic energy is proportional to speed squared, so every kinetic energy in the CM frame is multiplied by $e^2$. The kinetic energy seen in the CM frame is the **relative kinetic energy**,

$$K_{\text{rel}} = \tfrac12\mu\,(v_{1i} - v_{2i})^2, \qquad \mu = \frac{m_1m_2}{m_1 + m_2},$$

where $\mu$ is called the **reduced mass**. It is smaller than either mass and close to the smaller one when the masses are very different. As the collisions lesson showed, the total kinetic energy is $\tfrac12Mv_{\text{cm}}^2 + K_{\text{rel}}$, and the first part cannot change because momentum is conserved. So the energy lost is

$$K_{\text{lost}} = (1 - e^2)\,K_{\text{rel}}.$$

For $e = 1$ nothing is lost; for $e = 0$ all of $K_{\text{rel}}$ is lost, the perfectly inelastic maximum.

### Example 2

Check Example 1 with this formula. $\mu = \dfrac{(2.0)(3.0)}{5.0} = 1.2$ kg, and $K_{\text{rel}} = \tfrac12(1.2)(4.0)^2 = 9.6$ J. Then $K_{\text{lost}} = (1 - 0.25)(9.6) = 7.2$ J, matching the direct calculation. The other $16.0 - 9.6 = 6.4$ J is the kinetic energy of the center of mass, $\tfrac12(5.0)(1.6)^2$, which no collision between the carts can remove.

Notice that $e = 0.5$ does not mean half the energy is lost: three quarters of $K_{\text{rel}}$ is.

## The bouncing ball

When a ball hits the floor, the "second object" is the Earth, whose mass is so large that it doesn't move measurably. With $m_2 \to \infty$ the general result becomes simple: the ball rebounds with speed $e$ times its impact speed. Since the height a ball reaches is proportional to the square of its launch speed ($h = v^2/2g$), each bounce reaches $e^2$ times the previous height:

$$\frac{h_{\text{after}}}{h_{\text{before}}} = e^2, \qquad e = \sqrt{\frac{h_{\text{after}}}{h_{\text{before}}}}.$$

This gives an easy way to measure $e$ with a meter stick. (Air resistance is ignored; it lowers the rebound a little, so the measured $e$ comes out slightly low.)

The heights form a geometric sequence, $h_n = e^{2n}h_0$, and so do the times between bounces. Summing those geometric series shows a surprising fact: in this model the ball makes infinitely many bounces in a *finite* time and over a finite distance. A ball dropped from $h_0$ travels a total distance

$$D = h_0\,\frac{1 + e^2}{1 - e^2}$$

and comes to rest after a total time $T = t_0\,\dfrac{1 + e}{1 - e}$, where $t_0 = \sqrt{2h_0/g}$ is the time of the first fall. (Real balls stop slightly differently, because at very low speeds $e$ is no longer constant, but the model works well for the first several bounces.)

```plot
{"x": [0, 3], "y": [0, 1.1], "xLabel": "time (s)", "yLabel": "height (m)", "functions": [{"f": "1 - 4.9*x^2", "from": 0, "to": 0.4518}, {"f": "3.5418*(x - 0.4518) - 4.9*(x - 0.4518)^2", "from": 0.4518, "to": 1.1746}, {"f": "2.8334*(x - 1.1746) - 4.9*(x - 1.1746)^2", "from": 1.1746, "to": 1.7528}, {"f": "2.2667*(x - 1.7528) - 4.9*(x - 1.7528)^2", "from": 1.7528, "to": 2.2154}, {"f": "1.8134*(x - 2.2154) - 4.9*(x - 2.2154)^2", "from": 2.2154, "to": 2.5855}, {"f": "1.4507*(x - 2.5855) - 4.9*(x - 2.5855)^2", "from": 2.5855, "to": 2.8815}], "points": [{"at": [1.1746, 0.64], "label": "0.64 m"}, {"at": [1.7528, 0.41], "label": "0.41 m"}], "caption": "A ball dropped from 1.00 m with e = 0.80: each bounce peaks at 0.64 times the last, and the bounces get shorter in time too"}
```

### Example 3

A ball dropped from 1.00 m rebounds to 0.64 m. Find $e$, the height of the third bounce, and the total distance traveled before it stops.

$e = \sqrt{0.64/1.00} = 0.80$. Each bounce reaches $e^2 = 0.64$ of the previous one: 0.64 m, then 0.41 m, then $0.64^3 = 0.262$ m on the third bounce.

Total distance: $D = 1.00\cdot\dfrac{1 + 0.64}{1 - 0.64} = 4.56$ m. (Down 1.00 m, then up and down each bounce height: $1.00 + 2(0.64 + 0.41 + \dots) = 1.00 + 2(0.64/0.36) = 4.56$ m.)

Total time: $t_0 = \sqrt{2(1.00)/9.8} = 0.452$ s, so $T = 0.452 \times \dfrac{1.8}{0.2} = 4.07$ s.

Sports rules use exactly this test. The International Tennis Federation's rules require a tennis ball dropped from 254 cm (100 inches) onto concrete to rebound between 135 and 147 cm. That corresponds to $e = \sqrt{135/254} = 0.73$ up to $\sqrt{147/254} = 0.76$ (ignoring air resistance).

## Hitting a moving wall

Now let the heavy object move. A light ball approaches a very heavy object (a "wall") moving toward it at speed $V$. In the wall's frame, the ball comes in at $v + V$ and leaves at $e(v + V)$. Back in the ground frame, add the wall's velocity:

$$v_{\text{out}} = e\,(v + V) + V.$$

For an elastic bounce ($e = 1$), $v_{\text{out}} = v + 2V$: the ball gains twice the wall's speed. This is the "heavy hits light" case from the collisions lesson seen from a different angle.

### Example 4

A pitched baseball arrives at 40 m/s and meets a bat moving at 30 m/s toward it. Treat the bat as very heavy and take $e = 0.50$ (a rough value for a ball on a wooden bat). Estimate the ball's speed off the bat.

In the bat's frame: in at $40 + 30 = 70$ m/s, out at $0.50(70) = 35$ m/s. In the ground frame: $35 + 30 = 65$ m/s.

This is an overestimate. A real bat is not infinitely heavy (it recoils and slows down), so actual exit speeds are noticeably lower. The model still shows why a fast pitch is easier to hit hard: the incoming speed adds to the relative speed that gets "reflected."

## Gravity assists

A spacecraft flying past a planet never touches it, but the encounter behaves like an elastic collision. Gravity is a conservative force, so in the planet's frame the spacecraft leaves the encounter with the same speed it came in with; only its direction changes. In the Sun's frame, though, the planet is moving, and that changes everything.

![An idealized head-on gravity assist in the Sun's frame. A spacecraft moves right at speed v toward a planet moving left at speed U, swings around the far side of the planet along a dashed path, and leaves moving left at speed v plus 2U.](images/m4-gravity-assist.svg)

Take the idealized head-on case in the figure. The planet moves left at speed $U$; the craft approaches it moving right at speed $v$. In the planet's frame the craft approaches at $v + U$, swings around the planet's trailing side, and leaves moving left at the same $v + U$. Adding the planet's velocity back gives a Sun-frame speed of $v + 2U$, exactly the elastic moving-wall result.

The extra kinetic energy comes from the planet. By momentum conservation the planet slows down, but by an absurdly small amount because of its enormous mass. This trick is called a **gravity assist** (or gravitational slingshot). Voyager 2, launched in 1977, used gravity assists at Jupiter, Saturn and Uranus to reach Neptune in 1989, a trip that would have needed far more propellant otherwise.

Real flybys are not head-on: the planet's gravity bends the path by a limited angle, so the gain is less than $2U$. The head-on result is an upper limit, but the principle (same speed in the planet's frame, different speed in the Sun's frame) is exactly right. A flyby can also *slow* a spacecraft, by passing in front of the planet instead of behind it; missions to Mercury use this.

### Example 5

An 800 kg probe moving at 10.0 km/s meets Jupiter head-on in the idealized geometry above. Jupiter's orbital speed is about 13.1 km/s. Find the probe's speed afterward and estimate how much Jupiter slows. (Jupiter's mass is about $1.9\times10^{27}$ kg.)

Probe: $v + 2U = 10.0 + 2(13.1) = 36.2$ km/s, the upper limit for this flyby.

The probe's momentum changes from $+800(10\,000)$ to $-800(36\,200)$, a change of magnitude $800(46\,200) = 3.7\times10^7$ kg·m/s. Jupiter gets the opposite change, so its speed changes by $\dfrac{3.7\times10^7}{1.9\times10^{27}} \approx 2\times10^{-20}$ m/s. No measurement could detect that.

## Common mistakes

- Writing the restitution condition with speeds instead of signed velocities, or with the order reversed ($v_{1f} - v_{2f}$ on the left gives a negative $e$).
- Thinking $e = 0.5$ means half the kinetic energy is lost. The lost fraction of $K_{\text{rel}}$ is $1 - e^2$, and $\tfrac12Mv_{\text{cm}}^2$ can never be lost.
- Using $e = h_{\text{after}}/h_{\text{before}}$ for a bouncing ball; the height ratio is $e^2$.
- Forgetting to change frames back after working in the wall's or planet's frame.
- Believing a gravity assist creates energy. The planet loses exactly the energy the craft gains.

## Key points

- Restitution: $v_{2f} - v_{1f} = e(v_{1i} - v_{2i})$; solve it together with momentum conservation. It is an approximate, measured model.
- In the center-of-mass frame each velocity reverses and is multiplied by $e$, so $K_{\text{lost}} = (1 - e^2)K_{\text{rel}}$ with $K_{\text{rel}} = \tfrac12\mu(v_{1i} - v_{2i})^2$ and $\mu = m_1m_2/(m_1 + m_2)$.
- Bouncing: rebound height ratio $e^2$; total distance $h_0(1 + e^2)/(1 - e^2)$; the bouncing ends in a finite time.
- A light ball off a heavy moving wall: $v_{\text{out}} = e(v + V) + V$, or $v + 2V$ if elastic.
- A gravity assist is an elastic "collision" with a moving planet: same speed in the planet's frame, up to $2U$ gained in the Sun's frame, paid for by the planet.
