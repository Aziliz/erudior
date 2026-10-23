---
id: mv-vector-functions
module: mv-m2
title: Vector functions and space curves
minutes: 30
topics: [Vector functions, Derivatives of vector functions]
drills: [mv-d-vf-deriv, mv-d-vf-integ]
refs: [mv-ref-differential]
---
## Curves as moving points

A line $\mathbf r_0 + t\mathbf v$ is the simplest example of a function that takes a number
$t$ and returns a vector. Let the components be any functions and you get a **vector-valued function** (or vector function):

$$\mathbf r(t) = \langle f(t),\, g(t),\, h(t)\rangle = f(t)\,\mathbf i + g(t)\,\mathbf j + h(t)\,\mathbf k.$$

Think of $t$ as time and $\mathbf r(t)$ as the position of a particle. As $t$ runs, the tip
of $\mathbf r(t)$ traces a **space curve**. This is the natural extension of parametric
curves from the bridge lesson, and it is how we will describe paths for arc length,
motion, and later line integrals. The **domain** of $\mathbf r$ is every $t$ where all
three components are defined.

### The helix

The curve $\mathbf r(t) = \langle \cos t,\, \sin t,\, t\rangle$ is a **helix**. Its first two
components trace the unit circle, while the height $z = t$ rises steadily: a spring or a
spiral staircase. Looking straight down the $z$-axis, you see only the circle. That view is
the *projection* of the curve onto the $xy$-plane, obtained by dropping the $z$-component.

```plot
{"x": [-1.6, 1.6], "y": [-1.6, 1.6], "equal": true, "curves": [{"x": "cos(t)", "y": "sin(t)", "t": ["-0.25*pi", "1.75*pi"]}], "points": [{"at": [1, 0]}], "segments": [{"from": [0.7071, 0.7071], "to": [0.35, 1.06], "arrow": true}], "caption": "Seen from above, the helix ⟨cos t, sin t, t⟩ circles counterclockwise forever", "labels": [{"at": [0.5, 0.1], "text": "t = 0, 2π, 4π, …"}]}
```

Projections onto the other coordinate planes help too: onto the $xz$-plane the helix
looks like the wave $z = t$, $x = \cos t$, a cosine curve turned on its side.

The 3D picture below shows the whole helix together with its shadow on the $xy$-plane. It
also previews the next idea: the position vector $\mathbf r(t)$ reaches from the origin to
the moving point, and the tangent vector $\mathbf r'(t)$ starts at that point and points
the way the point is moving.

![A helix winding up around the z-axis, drawn in 3D with x, y and z axes. Its shadow, a circle, lies shaded in the xy-plane. A blue arrow labeled r(t) runs from the origin to a point on the helix, and a red arrow labeled r prime of t starts at that point and points along the helix.](images/mv-m2-helix.svg)

### Example 1: a curve on a surface

Show that $\mathbf r(t) = \langle t\cos t,\, t\sin t,\, t\rangle$ lies on the cone $z^2 = x^2 + y^2$.

Compute $x^2 + y^2 = t^2\cos^2 t + t^2\sin^2 t = t^2 = z^2$. ✓ The curve spirals up the
cone, widening as it climbs, since its distance from the $z$-axis is $|t|$.

## Limits and continuity

Limits are taken componentwise:

$$\lim_{t\to a}\mathbf r(t) = \left\langle \lim_{t\to a}f(t),\, \lim_{t\to a}g(t),\, \lim_{t\to a}h(t)\right\rangle,$$

provided each component limit exists. And $\mathbf r$ is **continuous** at $a$ when
$\lim_{t\to a}\mathbf r(t) = \mathbf r(a)$, which happens exactly when every component is
continuous there. For example, $\lim_{t\to0}\left\langle \tfrac{\sin t}{t},\, e^{t},\, t^2\right\rangle = \langle 1, 1, 0\rangle$.

## Derivatives

The derivative is defined exactly as in one variable:

$$\mathbf r'(t) = \lim_{h\to0}\frac{\mathbf r(t+h) - \mathbf r(t)}{h}.$$

Since subtraction and division by $h$ act on each component, the limit can be taken
componentwise too: differentiate each component,
$\mathbf r'(t) = \langle f'(t), g'(t), h'(t)\rangle$.

*Geometric meaning.* The difference $\mathbf r(t+h) - \mathbf r(t)$ is a secant vector
between two points on the curve. Dividing by a small $h$ and letting $h \to 0$ turns it
into a vector **tangent** to the curve, pointing in the direction of motion. So
$\mathbf r'(t)$ is the **tangent vector**, and when it is nonzero the **unit tangent vector** is

$$\mathbf T(t) = \frac{\mathbf r'(t)}{|\mathbf r'(t)|}.$$

The tangent line at $\mathbf r(t_0)$ is $\mathbf r(t_0) + s\,\mathbf r'(t_0)$.

The figure shows this limit for the plane curve $\mathbf r(t) = \langle t,\, \tfrac12t^2\rangle$
at $t = 1$. The secant vectors to $\mathbf r(1 + h)$ swing toward the tangent direction as
$h$ shrinks; divided by $h$, they approach $\mathbf r'(1) = \langle 1, 1\rangle$.

```plot
{"x": [-0.5, 3], "y": [-0.5, 3], "equal": true, "curves": [{"x": "t", "y": "0.5*t^2", "t": [-0.6, 2.4]}], "points": [{"at": [1, 0.5], "label": "r(1)"}], "segments": [{"from": [1, 0.5], "to": [2.2, 2.42], "arrow": true, "dashed": true, "label": "h = 1.2"}, {"from": [1, 0.5], "to": [1.6, 1.28], "arrow": true, "dashed": true}, {"from": [1, 0.5], "to": [2.4, 1.9], "arrow": true, "label": "direction of r′(1)"}], "caption": "Secant vectors from r(1) to r(1 + h), for h = 1.2 and h = 0.6, tilt toward the tangent direction ⟨1, 1⟩ as h shrinks"}
```

### Differentiation rules

Each familiar rule has a vector version, and each is proved by writing out components:

- $(\mathbf u + \mathbf v)' = \mathbf u' + \mathbf v'$ and $(c\,\mathbf u)' = c\,\mathbf u'$.
- $(f\mathbf u)' = f'\mathbf u + f\mathbf u'$ for a scalar function $f$.
- $(\mathbf u\cdot\mathbf v)' = \mathbf u'\cdot\mathbf v + \mathbf u\cdot\mathbf v'$.
- $(\mathbf u\times\mathbf v)' = \mathbf u'\times\mathbf v + \mathbf u\times\mathbf v'$ (keep the order!).
- Chain rule: $\dfrac{d}{dt}\mathbf u(f(t)) = f'(t)\,\mathbf u'(f(t))$.

**A useful consequence.** If $|\mathbf r(t)|$ is constant, then $\mathbf r'(t)$ is
orthogonal to $\mathbf r(t)$. *Proof:* $\mathbf r\cdot\mathbf r = c^2$; differentiate:
$2\,\mathbf r\cdot\mathbf r' = 0$. Geometrically, a point moving on a sphere always moves
tangent to the sphere, perpendicular to its radius. We use this in Lesson 9 to show that
$\mathbf T'$ is perpendicular to $\mathbf T$.

### Example 2

For $\mathbf r(t) = \langle t^2,\, e^{-t},\, \sin 2t\rangle$, find $\mathbf r'(t)$ and the tangent line at $t = 0$.

1. Differentiate each component: $\mathbf r'(t) = \langle 2t,\, -e^{-t},\, 2\cos 2t\rangle$.
2. At $t = 0$: $\mathbf r(0) = \langle 0, 1, 0\rangle$ and $\mathbf r'(0) = \langle 0, -1, 2\rangle$.
3. Tangent line: $x = 0$, $y = 1 - s$, $z = 2s$.

The unit tangent at $t = 0$ is $\tfrac{1}{\sqrt5}\langle 0, -1, 2\rangle$.

## Integrals

Integrals are also componentwise:

$$\int_a^b\mathbf r(t)\,dt = \left\langle \int_a^b f(t)\,dt,\; \int_a^b g(t)\,dt,\; \int_a^b h(t)\,dt\right\rangle.$$

An indefinite integral gets a constant *vector* $\mathbf C$, and the FTC holds:
$\int_a^b\mathbf r'(t)\,dt = \mathbf r(b) - \mathbf r(a)$. This is how we will recover
position from velocity in Lesson 10.

### Example 3

Find $\mathbf r(t)$ if $\mathbf r'(t) = \langle 2t,\, 3t^2,\, \cos t\rangle$ and $\mathbf r(0) = \langle 1, 0, 2\rangle$.

1. Integrate: $\mathbf r(t) = \langle t^2,\, t^3,\, \sin t\rangle + \mathbf C$.
2. At $t = 0$: $\langle 0,0,0\rangle + \mathbf C = \langle 1,0,2\rangle$, so $\mathbf C = \langle 1,0,2\rangle$.
3. $\mathbf r(t) = \langle t^2 + 1,\, t^3,\, \sin t + 2\rangle$.

Notice one constant per component: forgetting $\mathbf C$, or using a single number for it,
loses information.

## Common mistakes

- Treating $\mathbf r'(t)$ as a number; it is a vector.
- Writing $(\mathbf u\times\mathbf v)' = \mathbf v'\times\mathbf u + \dots$: the cross product order must be preserved.
- Using $\mathbf r'(t)$ itself as the unit tangent without dividing by its length.
- Forgetting the constant vector of integration, or adding it to only one component.

## Key points

- $\mathbf r(t) = \langle f, g, h\rangle$ traces a space curve; limits, derivatives and integrals are componentwise.
- $\mathbf r'(t)$ is tangent to the curve; $\mathbf T = \mathbf r'/|\mathbf r'|$.
- Product rules hold for dot and cross products (order matters for cross).
- If $|\mathbf r|$ is constant, $\mathbf r\cdot\mathbf r' = 0$.
