---
id: mv-physics
module: mv-m8
title: Vector calculus in physics
minutes: 35
topics: [Applications to physics]
drills: [mv-d-gauss-flux]
refs: [mv-ref-vector-calculus]
---
## Why physicists care

Vector calculus was developed largely to describe fields: gravity, electricity and
magnetism, fluid flow, heat. The big theorems let physicists move between two ways of stating
a law. An **integral form** speaks about whole regions ("the flux out of any closed surface
equals the enclosed charge"). A **differential form** speaks about single points ("the
divergence of the field equals the charge density"). Integral forms are closer to
measurement; differential forms are what you solve. This closing lesson shows the pattern in
four settings.

## 1. Gravity and potential energy

The gravitational field of a point mass is conservative, with potential
$f = \dfrac{GMm}{|\mathbf x|}$ (Lesson 28). By the fundamental theorem for line integrals, the work
gravity does as a mass moves from distance $r_1$ to $r_2$ from the center is
$GMm\left(\dfrac{1}{r_2} - \dfrac{1}{r_1}\right)$, independent of the route. Escape velocity,
orbital energy and the "potential wells" of astronomy all rest on this one fact.

## 2. Electric flux and Gauss's law

A point charge $q$ at the origin produces the electric field

$$\mathbf E = \frac{q}{4\pi\varepsilon_0}\frac{\mathbf x}{|\mathbf x|^3},$$

where $\varepsilon_0$ is the permittivity of free space, about $8.854\times10^{-12}\text{ F/m}$ (CODATA
2022). Its magnetic partner, the permeability $\mu_0$ used below, is about
$1.2566\times10^{-6}\text{ N/A}^2$. That is $4\pi\times10^{-7}$ to many digits; it was exactly this
value before the 2019 redefinition of the SI units.

### Example 1: flux through a sphere

On the sphere of radius $a$, $\mathbf n = \mathbf x/a$ and $|\mathbf x| = a$, so
$\mathbf E\cdot\mathbf n = \dfrac{q}{4\pi\varepsilon_0a^2}$, constant. The flux is that times the area
$4\pi a^2$:

$$\iint_S\mathbf E\cdot d\mathbf S = \frac{q}{\varepsilon_0},$$

independent of the radius. Since $\operatorname{div}\mathbf E = 0$ away from the charge, the
Divergence theorem (applied to the shell between two surfaces) shows the flux is $q/\varepsilon_0$
through *every* closed surface enclosing the charge. Adding up many charges gives **Gauss's law**:

$$\iint_S\mathbf E\cdot d\mathbf S = \frac{Q_{\text{enc}}}{\varepsilon_0}.$$

For a continuous charge density $\rho$, $Q_{\text{enc}} = \iiint_E\rho\,dV$. Applying the
Divergence theorem to the left side, $\iiint_E\operatorname{div}\mathbf E\,dV = \iiint_E\dfrac{\rho}{\varepsilon_0}\,dV$
for every region $E$, which forces the integrands to agree:

$$\nabla\cdot\mathbf E = \frac{\rho}{\varepsilon_0}.$$

That step, "true for every region, so true at every point," is how all the differential laws
below are derived.

## 3. Circulation and Ampère's law

A steady current $I$ in a long straight wire produces a magnetic field $\mathbf B$ that circles
the wire. **Ampère's law** says the circulation around any closed loop equals $\mu_0$ times the
current through it: $\oint_C\mathbf B\cdot d\mathbf r = \mu_0I_{\text{enc}}$.

### Example 2: the field of a wire

Take $C$ to be a circle of radius $r$ around the wire. By symmetry $\mathbf B$ is tangent to
$C$ with constant magnitude $B$, so $\oint_C\mathbf B\cdot d\mathbf r = B\cdot2\pi r$. Setting this
equal to $\mu_0I$ gives

$$B = \frac{\mu_0I}{2\pi r}.$$

The field weakens like $1/r$ (compare $1/r^2$ for a point charge).

With current density $\mathbf J$, $I_{\text{enc}} = \iint_S\mathbf J\cdot d\mathbf S$, and Stokes'
theorem turns the left side into $\iint_S(\nabla\times\mathbf B)\cdot d\mathbf S$. True for every
surface, so $\nabla\times\mathbf B = \mu_0\mathbf J$.

### Maxwell's equations

Collecting the laws of electromagnetism (in vacuum, in their modern vector form):

| Law | Integral form | Differential form |
|---|---|---|
| Gauss (electric) | $\iint_S\mathbf E\cdot d\mathbf S = Q_{\text{enc}}/\varepsilon_0$ | $\nabla\cdot\mathbf E = \rho/\varepsilon_0$ |
| Gauss (magnetic) | $\iint_S\mathbf B\cdot d\mathbf S = 0$ | $\nabla\cdot\mathbf B = 0$ |
| Faraday | $\oint_C\mathbf E\cdot d\mathbf r = -\dfrac{d}{dt}\iint_S\mathbf B\cdot d\mathbf S$ | $\nabla\times\mathbf E = -\dfrac{\partial\mathbf B}{\partial t}$ |
| Ampère–Maxwell | $\oint_C\mathbf B\cdot d\mathbf r = \mu_0I_{\text{enc}} + \mu_0\varepsilon_0\dfrac{d}{dt}\iint_S\mathbf E\cdot d\mathbf S$ | $\nabla\times\mathbf B = \mu_0\mathbf J + \mu_0\varepsilon_0\dfrac{\partial\mathbf E}{\partial t}$ |

Each row is converted using the Divergence theorem (top two) or Stokes' theorem (bottom two).
"No magnetic monopoles" is the statement $\nabla\cdot\mathbf B = 0$.

## 4. Fluids and heat: conservation laws

**Fluid flow.** Let $\rho(x, y, z, t)$ be a fluid's density and $\mathbf v$ its velocity. The mass
flux is $\rho\mathbf v$. Mass in a fixed region changes only by flow through the boundary:
$\dfrac{d}{dt}\iiint_E\rho\,dV = -\iint_S\rho\mathbf v\cdot d\mathbf S$. The Divergence theorem
gives the **continuity equation**

$$\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\mathbf v) = 0.$$

For an incompressible fluid (constant $\rho$) it reduces to $\nabla\cdot\mathbf v = 0$.

**Heat flow.** Heat flows from hot to cold at a rate proportional to the temperature gradient:
the heat flux is $\mathbf q = -k\nabla T$ (Fourier's law; $k$ is the thermal conductivity).
Conservation of energy, run through the same argument, gives the **heat equation**
$\dfrac{\partial T}{\partial t} = \alpha\nabla^2T$ (here $\alpha = k/(\rho c)$ is the thermal
diffusivity, with $\rho$ the material's density and $c$ its specific heat), which is where the Laplacian of Lesson 32 earns
its keep. In steady state, $\nabla^2T = 0$: the temperature is harmonic.

### Example 3: heat leaving a ball

Inside a body the temperature is $T = 100 - x^2 - y^2 - z^2$ (°C, with lengths in meters), and
$k = 2$. Find the rate of heat flow out of the unit ball.

1. $\mathbf q = -k\nabla T = -2\langle -2x, -2y, -2z\rangle = \langle 4x, 4y, 4z\rangle$.
2. $\nabla\cdot\mathbf q = 12$, so by the Divergence theorem the outward flux is $12\cdot\tfrac43\pi = 16\pi \approx 50.3$ (watts, in consistent units).

Directly: on the unit sphere $\mathbf q\cdot\mathbf n = 4$, times area $4\pi$, gives $16\pi$. ✓

```plot
{"x": [-1.8, 1.8], "y": [-1.8, 1.8], "equal": true, "vectorField": {"u": "4*x", "v": "4*y", "step": 0.45}, "curves": [{"x": "cos(t)", "y": "sin(t)", "t": [0, "2pi"]}], "caption": "Heat flux q = −k∇T points outward, from the hot center to the cooler surface (circle: cross-section of the unit sphere)"}
```

## Common mistakes

- Forgetting the sign in $\mathbf q = -k\nabla T$: heat flows *down* the gradient.
- Using Gauss's law on a surface that does not enclose the charge (the flux is then 0).
- Mixing up which theorem converts which law: divergence laws use the Divergence theorem, circulation laws use Stokes.

## Key points

- Integral laws (flux, circulation) and differential laws (div, curl) are linked by the Divergence and Stokes theorems.
- Gauss's law: flux of $\mathbf E$ through a closed surface $= Q_{\text{enc}}/\varepsilon_0$; $\nabla\cdot\mathbf E = \rho/\varepsilon_0$.
- Ampère: $\oint\mathbf B\cdot d\mathbf r = \mu_0I$, giving $B = \mu_0I/(2\pi r)$ for a wire.
- Conservation laws give $\partial_t\rho + \nabla\cdot(\rho\mathbf v) = 0$ and the heat equation $T_t = \alpha\nabla^2T$.
